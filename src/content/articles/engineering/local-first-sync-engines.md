---
title: "Local-first sync engines: what we learned shipping one"
description: "Field notes from building a real sync engine: CRDT vs last-write-wins in practice, conflict UX that doesn't panic users, and when to skip it all."
slug: local-first-sync-engines
cluster: engineering
tags: [local-first, sync, CRDT, offline, architecture]
date: 2026-08-14
author: Felix Brandt
keywords: [local-first software, CRDT, offline sync, web app architecture]
readingTime: 11
---

The sync engine was the part of the project nobody could demo and everybody depended on. Warehouse volunteers with phones in one hand and a crate in the other, moving through steel sheds and dead carparks, scanning deliveries that absolutely had to reconcile at the end of a shift. This was for [Harvest Loop](/work/harvest-loop-food-rescue), a food-rescue charity whose logistics dashboard we rebuilt — and whose drivers' connectivity we could not fix.

We've written the survey version of this topic before: [Local-first on the web: sync engines, honestly](/journal/engineering/offline-first-sync-engines) covers the ecosystem and the decision tree. This piece is the other half — the field notes. What actually happened when we built one, what the diagrams never mentioned, and the decisions I'd make differently on a Tuesday with a deadline.

## What we actually shipped

Scope before architecture, because most local-first talk drowns in maximalism. We did *not* build a cross-device collaborative editor. We built an offline-capable field app: routes, pickups, deliveries, and status changes that must survive a 40-minute drive with zero signal and merge cleanly with what the office was doing meanwhile.

The stack, for the record:

- **IndexedDB as the source of truth on device.** Every mutation writes to a local `ops` log first — an append-only journal of intent, not of state.
- **A SyncWorker/Service Worker pair that drains the queue** whenever connectivity allows, batching ops to a plain REST endpoint. Not exotic: fetch with retries, idempotency keys, and "pull deltas since cursor X" on the way down.
- **Server-side authority for inventory counts**, device-side authority for statuses the driver witnessed (arrived, loaded, delivered). Two authorities, chosen deliberately, on purpose.
- **last-write-wins with field-level granularity** for most entities, vector-clock-flavoured ordering, and a real merge strategy (not LWW) for exactly two things: quantities and notes.

Build time: about six engineering weeks beyond a naive online-only implementation. That number is the entry price of this article, too. A sync engine is not a refinement; it's a second product.

## The CRDT question, answered by the actual data

Every local-first conversation eventually arrives at CRDTs, and the literature will happily sell you a semester of automerge before lunch. Here's the field version: **CRDTs solve concurrent edits to shared mutable state. Measure your concurrency first.**

We logged two weeks of production traffic from the legacy system and found that true concurrent edits to the same record — two humans changing the same pickup within the same sync window — happened in roughly 0.4% of operations. And of those, nearly all were office-and-driver touching *different fields* (notes vs. status). Field-level last-write-wins with a deterministic clock handled 99%+ of reality; a CRDT would have grown a dependency tree, a bundle, and a debugging story to serve the remaining fraction.

The exception was quantities. Two volunteers adjusting the same pallet count offline genuinely produces arithmetic conflicts that LWW gets *wrong* — driver A adds 3, driver B adds 5 against the same base of 20, and LWW records either 23 or 25 when the truthful answer is 28 if the additions were independent. So we made quantities **counter-like**: ops carry deltas (`+3`, `+5`), the server aggregates deltas rather than storing absolute values blindly, and absolute corrections require an explicit "recount" op that supersedes. It's the world's smallest CRDT — a PN-counter wearing a trench coat.

The lesson generalises past sync: **match your merge strategy to the shape of the conflict, not to the fashion.** Before choosing, write down the five worst concurrency stories your data can produce, with actual field names. We do this in a conflict matrix during discovery — it's the same discipline as drawing the failure branches of a checkout as a state machine (see [state machines for checkout and onboarding](/journal/engineering/state-machines-ui-flows)), except the transitions are edits and the terminal state is "nobody notices."

## Conflict UX: the part the papers don't cover

Here's what sync-engine documentation is oddly quiet about: when a conflict reaches the user, it usually reaches them as **"your change was silently overwritten"** — which is worse than an error, because it erodes trust invisibly. We shipped three rules:

**1. Conflicts resolve automatically whenever semantically safe.** Different fields? Merge silently. Driver's witnessed status vs. office's scheduled status? Driver wins, office gets notified in the feed, nobody is interrupted. Automated resolution covers ~97% of conflicts; software that surfaces the other 3% well is friendly, software that surfaces all of them is unusable.

**2. When a conflict must surface, it surfaces as a decision, not a diff.** Nobody in a warehouse resolves "which version of `notes`." So the UI asks in domain language — "Sam's note was added while you were offline: keep both?" — with the merged result as the default. The user chooses the *outcome*, never the bytes.

**3. Overwrites are always acknowledged and reversible.** Anything automated resolution discards lands in an activity log ("delivery status reverted to office schedule — tap to restore"). This pairs naturally with the undo philosophy in [undo beats confirm](/journal/product/undo-not-confirm): the best conflict UX is one where a mistake costs an undo, not a phone call.

And a note that sits at the seam of engineering and design: the entire optimistic surface of the app depends on sync keeping its promises. The moment sync lies — shows confirmed where it only hoped — the optimistic UI contract breaks. [Optimistic UI, with integrity](/journal/product/optimistic-ui-integrity) names the rule; sync engines are where it gets stress-tested.

## The offline queue: boring, load-bearing

The ops log earned more engineering care than anything else in the system. Hard-won list:

- **Idempotency keys on every op, generated at creation.** Retries are guaranteed; duplicate side-effects must not be. The server dedupes per key, forever.
- **Ops carry their *intent* and their *base version*.** "Set status to delivered" vs. "add 3 crates" are different conflict shapes — the op type tells the server which merge rule applies. Ops that assume a base that has moved on get re-based or escalated, never blindly applied.
- **Compaction happens on read, not on write.** Fifty ops mutating the same delivery collapse into one state when the UI hydrates; the log itself stays append-only and debuggable. Append-only logs are the difference between grief and archaeology when a driver swears the app "ate" a delivery.
- **The queue is visible.** A small sync affordance — pending count, last-synced timestamp, a manual "sync now" — turned out to be the most trusted UI element in the field app. In a dead zone, *knowing* your changes are queued and safe is the feature. Uncertainty is the actual enemy, as [perceived performance as a design material](/journal/web-design/perceived-performance-design) argues from the design side.
- **Sync order matters.** Deliveries-before-notes, by explicit priority — because a note about a delivery that doesn't exist server-side yet is an error you generated yourself.

## Failure modes nobody warned us about

**Clock skew.** Device clocks lie. A driver's phone set manually, by an hour, re-orders your ops in ways that take days to untangle. Server-assigned logical timestamps on accept, device timestamps only as display and tiebreak hints — never as truth.

**The "zombie session."** Devices that go to sleep mid-sync with a drained half-queue wake up in a torn state unless the drain is transactional. We made queue-drain phases resumable from any point; sync became idempotent end-to-end, which transformed debugging from guesswork into replay.

**Merge storms after mass offline events.** A public-holiday outage means hundreds of devices reconnect simultaneously with long queues. Server-side rate limiting and client-side jittered retry with a per-op budget saved the twice-yearly Mondays. Load-test sync, not just the happy API path.

**Storage eviction.** Browsers will reclaim IndexedDB under pressure on exactly the budget Androids warehouses issue. Request persistent storage early (`navigator.storage.persist()`), monitor quota, and design rehydration from server as a first-class flow — a wiped device must be a two-minute inconvenience, not a data-loss incident.

## When to skip the engine

We'd estimate one project in five that *asks* for sync genuinely needs it. Skip the custom engine when:

- The app is read-mostly: service workers + a good cache strategy gets "works offline" reading without any of the above.
- Edits are rare and conflict tolerance is zero (payments, bookings, legal): stay online-first, surface a honest "you're offline" state, and save engineering for the flow itself.
- The team is small and the data is shared hot: mature engines and backends that give you sync out of the box exist precisely so you don't write the previous 2,000 words into your repo. Weigh them honestly before building. The survey piece at the top maps the candidates.

The one in five that *does* need it — fieldwork, logistics, health visits, disaster response — earns every week of the build. Harvest Loop's drivers stopped carrying paper backup sheets in week two. When software quietly survives the carpark, that's the compliment.

## Key takeaways

- Treat local-first as a second product with its own price (~6+ engineering weeks beyond online-only). Buy it only when the work happens where connectivity doesn't.
- Measure real concurrency before choosing a merge strategy: field-level LWW covers most reality; reserve CRDT-ish structures for genuinely arithmetic data like quantities.
- Ops carry intent, base versions, and idempotency keys — that's what makes sync debuggable instead of haunted.
- ~97% of conflicts should resolve automatically and silently; the rest surface as domain decisions with undo, never as diffs.
- Device clocks lie, queues must drain transactionally, and a visible "pending / last synced" affordance is field users' most trusted UI.
- Read-mostly apps don't need a sync engine — service-worker caching is the honest answer most of the time.

## FAQ

**Should I use an off-the-shelf sync engine or build?**
Default to buy/borrow. Reasons to build: hard data-residency or backend constraints, a merge semantics your domain needs that engines don't expose (our delta-quantities), or an offline shape unusual enough that the engine's abstractions fight you. If none apply, adopt one and spend the saved weeks on conflict UX — that's where the actual product quality lives.

**How do you test a sync layer without going mad?**
Property-based chaos works better than test cases: scripted "two devices, random ops, random offline windows, assert invariants" generators that run nightly in CI. Invariants like "delivered count equals sum of deltas" catch whole classes of merge bugs that hand-written cases miss. Plus one real device farm pass with real radios in real elevators — simulators never reproduce the carpark.

**Doesn't local-first conflict with making the server authoritative?**
Authority can be *partitioned* — by field, by op type, by workflow stage. "Driver witnesses status; office owns schedule; server aggregates quantities" is a coherent authority model with three sources. The anti-pattern is a global toggle; the design work is drawing the boundaries.

**How does this pair with optimistic UI?**
They're the same contract viewed from either end. If the op is queued and will almost certainly succeed, show it as done; if a class of op has real conflict odds, annotate it as pending. Optimism should be informed by the op's historical merge success rate, not by vibes.

**What about real-time collaboration — live cursors, shared docs?**
Different product, different engine, three times the price. Presence and shared text editing are the cases where the CRDT literature actually earns its complexity. Field-ops reconciliation with minutes-long windows is not; don't let a collaboration demo sell you collaboration infrastructure.
