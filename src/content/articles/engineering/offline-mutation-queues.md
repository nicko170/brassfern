---
title: "Queuing writes for a flaky world"
description: "Offline writes done honestly: outbox queues, idempotency keys, optimistic state that admits it's pending, conflict surfacing, and deciding which features truly need them."
slug: offline-mutation-queues
cluster: engineering
tags:
  - architecture
  - offline
  - sync
  - reliability
date: 2026-08-14
author: Felix Brandt
keywords:
  - offline mutations
  - sync queue engineering
  - offline-first UX
  - idempotency keys
  - local-first engineering
readingTime: 10
heroImage: /images/articles/engineering/offline-mutation-queues.jpg
heroAlt: "Editorial print still-life on cream paper: a brass outbox tray with stamped tags, a fern-green thread carrying paper slips toward a small brass terminal, a pressed fern frond beside it."
---

A volunteer driver's phone loses signal in a warehouse loading bay. She taps "collected — 14 crates" anyway, because that is the truth on the ground, and gets in the van. What happens in the next ninety seconds is the entire subject of this article.

Most web apps handle this moment with a spinner that never resolves, or worse, a toast that says "Done" while the request is already dead. Both are the same failure: the app treats a write as a single request instead of what it actually is — a **promise the software makes to the user and must keep later**. Mutation queues are how you keep promises. We put one into [Harvest Loop's field dashboard](/work/harvest-loop-food-rescue) for exactly this scenario, and the pattern has paid for itself on every product since.

This is not local-first. You do not need a replicated database or CRDTs to stop losing writes — the full architecture is [its own honest ledger](/journal/engineering/offline-first-sync-engines). You need one queue, one drain loop, and the discipline to never lie about what has actually happened.

## The outbox: a write is a record, not a request

The core move is to stop calling your API from button handlers. Instead, every user write appends a **mutation record** to a durable local queue (IndexedDB via Dexie, in our builds), and a separate drain loop ships records to the server when it can.

A mutation record carries more than the payload:

- `id` — a client-generated UUID. This becomes the idempotency key.
- `type` + `payload` — what happened, expressed as intent (`shipment.collected { crates: 14 }`), not as an HTTP call.
- `entityVersion` — what the client believed the record looked like when the user acted.
- `createdAt`, plus `attempts` and `lastError` for the drain loop.
- `status` — `pending`, `in-flight`, `failed`, `conflicted`.

Persist the record **before** touching the UI. The ordering is the whole game: queue first, then update the screen, then attempt the network. If the tab closes mid-flight, the record survives and the drain loop retries on next launch. If you update the UI first and queue second, there is a fifty-millisecond window where a killed tab loses the write — and that window is exactly when warehouse Wi-Fi dies.

One more rule that saves you later: **one write path, ever**. Every mutation in the product goes through `outbox.append()`. The moment a second code path can create state — an optimistic shortcut, a "quick" direct fetch in a modal — the queue stops being the source of truth and becomes a second opinion.

## Idempotency is a server contract, not a client hope

Retrying a write is only safe if being heard twice is harmless. That makes idempotency a contract the server must sign, and it is worth writing down in the API review, not discovering in an incident report.

The shape that works: the client-generated mutation `id` travels with the request as an idempotency key. The server keeps a dedupe table keyed on it — saw this key, here is the stored response, do not re-apply. Now the drain loop can retry aggressively and indefinitely. Crashed-after-applying and never-received become indistinguishable, which is precisely what you want.

Two subtleties that bite teams:

**The response must be replayable.** When the server dedupes, it should return the *original* response (the created entity, its server ID, its version), not a generic "already done." The client often needs that data to reconcile its optimistic placeholder with the real record.

**Idempotency is per-operation, not per-endpoint.** "Create comment" and "mark shipment collected" have different natural keys. Where a natural idempotency key exists — an order ID, a client-supplied UUID on the entity — prefer it over accepting a separately-minted key, and say so in the API docs. Ambiguity here is how duplicate shipments are born.

## Optimistic state that admits it is pending

Once the record is queued, render the result immediately — she tapped "collected," the list should say collected. [Optimistic UI done with integrity](/journal/product/optimistic-ui-integrity) has one hard rule: the screen may be optimistic about content but never about certainty. The pending state is real information and the UI must carry it.

Our pattern: optimistic records get a quiet marker — a small clock glyph, a "Sending…" caption in the timestamp slot — that flips to the real timestamp on confirmation. Three states, never more: *pending*, *sent*, and the rare *needs attention*. No spinners (nothing is being waited on), no blocking overlays (the whole point is that she drove away).

Deletion is the one mutation we do not optimistically finalise. An optimistic delete that later conflicts forces the worst UI in software: the thing reappearing. Queue the delete, show the item as struck-through with an undo affordance, and only remove it from the list once the server confirms.

## The drain loop: boring, patient, exhaustive

The drain loop is a small state machine — and encode it as one, because [state machines exist for exactly this](/journal/engineering/state-machines-ui-flows). A queue has illegal states (in-flight while offline, sending a record whose dependency failed) and a machine keeps you out of them. Ours runs on page load, on `online` events, on a slow interval, and after every successful send (one success usually means the network is back — drain everything).

The rules, in order of how often teams get them wrong:

1. **Strict FIFO per entity, best-effort across entities.** Edits to the same shipment must send in order; edits to different shipments can interleave. Per-entity ordering keys give you both.
2. **Classify errors before reacting.** A 4xx means the server understood and rejected: stop retrying, surface it. A 5xx or a network failure means retry with exponential backoff plus jitter. Retrying a 422 for six hours is how a phone becomes warm.
3. **Handle auth expiry as a pause, not a failure.** A 401 suspends the loop and triggers re-auth; queue contents are precious and survive it. The same discipline as [boring background job patterns](/journal/engineering/background-jobs-small-teams): never let a recoverable error destroy a payload.
4. **Cap the queue in space, not in pride.** Ten thousand pending mutations is not a queue, it is a symptom. Set a generous ceiling (we use ~5MB of payloads) and surface a real message at 80% — if that ever fires, the product has a sync bug to fix, not a user to blame.

## Conflicts: surface them, don't dissolve them

Eventually the server says no: someone else marked that shipment, the record was edited from the office, the version you based the write on is stale. The `entityVersion` on the mutation record is what lets the server detect this — a compare-and-swap check, not a diff ritual.

Resolution comes in two tiers, and being explicit about which tier a mutation lives in is a design meeting you must have before building:

**Rule-resolvable.** Most field updates are commutative or last-writer-wins per field. "14 crates" from the driver and "notes: fragile" from the office don't conflict at all if your server merges at field level. Write the merge rule in code, in one place, with tests.

**Human-resolvable.** Genuinely contradictory writes (two people counted the crates differently) become **conflict objects, not error toasts**. The record shows both values side by side with who-and-when, the server's value wins by default, and one tap promotes the other. Nothing is discarded. The pattern we use everywhere: merges never delete, and no dialog ever blocks the user from continuing their actual work.

## Which features earn a queue

A mutation queue adds a queue, a drain loop, a dedupe table and a conflict surface to your product — real machinery that must be tested with a hostile-network test suite (we run drain-loop tests against a fake server that fails in scripted ways). Spend it where the physics demands:

- **Field and logistics work** — drivers, clinicians, inspectors: connectivity is the exception, writes are small and factual. Best case there is.
- **Long-form composition** — a support reply, an inspection report: the cost of loss is emotional, not just operational. Queue everything, aggressively.
- **Collaborative records edited on the move.** Worth it, with the conflict surface above.

Skip it where correctness has a single source of law — payments, inventory with hard stock limits, anything where an optimistic local decision creates a money-shaped conflict. And skip it for reads: read caching is a separate, much cheaper problem. The queue exists for one reason: when the user truthfully did the thing, software that loses that fact has failed at its only job. If you're scoping a product where field reality meets software, that conversation belongs in week one — it's a standing item in our [product engagements](/services/product).

## Key takeaways

- A user write is a promise: persist it as a queued mutation record *before* updating the UI, or accept that killed tabs lose data.
- One write path only — every mutation flows through the outbox, or the queue becomes a second source of truth.
- Idempotency is a server contract: client-generated keys, replayable stored responses, natural keys where the domain offers them.
- Optimistic UI may be confident about content but never about certainty; pending is a visible state, and deletes stay struck-through until confirmed.
- The drain loop is a state machine: per-entity FIFO ordering, 4xx stops the retry, auth expiry pauses rather than fails, and queue size has a ceiling.
- Conflicts resolve by written merge rules where possible, and surface as side-by-side conflict objects where not. Merges never delete.
- Queue writes where connectivity or loss-cost demands it; keep payments and hard-consistency writes strictly online and honest about it.

## FAQ

**Isn't this just local-first with extra steps?**
No — and the difference matters to your budget. Local-first makes the local database the primary data path for reads and writes, with full offline capability and multi-device sync. A mutation queue keeps the server as the source of truth and only guarantees that writes made during disconnection eventually arrive. You get roughly 80% of the user goodwill for perhaps 20% of the architectural cost.

**Why IndexedDB instead of localStorage for the queue?**
Two reasons: durability and size. localStorage is synchronous, capped around 5MB shared with everything else, and can be evicted silently. IndexedDB gives you transactions, far more headroom, and plays well with `navigator.storage.persist()` so the browser treats your queue as worth keeping. Wrap it in Dexie so you never write raw IndexedDB ceremony.

**What happens if the user edits the same thing twice while offline?**
Both mutations queue in order, and per-entity FIFO guarantees they apply in order. If your merge rules are field-level last-writer-wins, the second edit simply wins — which is almost always what the user meant. The failure mode to avoid is interleaving the two edits with server state between them, which the strict ordering key prevents.

**How do you test a drain loop?**
Against a scripted fake server, not the real one. We build a mock that fails in programmable ways — drops connections mid-sentence, returns 422 then 200, expires auth tokens on command — and run the full queue lifecycle in Playwright with the browser's offline mode. The hostile-network suite runs on every PR, because sync bugs regress quietly and announce themselves loudly, in production, on a Friday.
