---
title: "Local-first on the web: sync engines, honestly"
description: "What local-first architecture actually costs and buys: IndexedDB patterns, CRDT trade-offs, schema migrations, sync-status UX, and when server-first is simply right."
slug: offline-first-sync-engines
cluster: engineering
tags:
  - architecture
  - offline
  - sync
  - data
date: 2025-06-20
author: Felix Brandt
keywords:
  - local-first software
  - offline-first web app
  - crdt sync engine
  - indexeddb patterns
  - conflict resolution
readingTime: 10
heroImage: /images/articles/engineering/offline-first-sync-engines.jpg
heroAlt: "Engraved-style illustration on cream paper: a small brass laptop and compass on fern-ink islands joined by delicate brass arcs, evoking devices syncing data across distance."
---

Every eighteen months, local-first becomes the future again. A demo goes around showing an app that works flawlessly in airplane mode, two laptops editing the same document in real time, and everyone in the room — ourselves included — feels the pull. Software that belongs to the person using it. No spinners. No "reconnecting…" toasts. It is a genuinely better vision of computing.

It is also, in production, an architectural mortgage. We have built sync-backed features into three client products and walked away from it on two more, and the pattern is consistent: local-first pays extraordinary dividends in a narrow band of products and quietly taxes everything outside that band. This is the honest ledger.

## What local-first actually means

Strip the manifesto and you get four commitments. The local device holds a **complete, queryable copy** of the data the user needs. All reads and writes go to that local copy first — the UI never waits on the network. Synchronisation to a server (and other devices) happens asynchronously, in the background. And when two devices changed the same thing offline, **conflicts resolve by rule, not by error message**.

Notice what is not on that list: "the server is optional." In every real product we have shipped, the server is the backup, the search index, the permission enforcer and the place where money moves. Local-first is a statement about the *primary* data path, not the only one.

## The data layer: IndexedDB, warts included

On the web, your durable local store is IndexedDB. Everything else is opinion layered on top. Our opinions, earned the slow way:

**Use a wrapper, always.** Raw IndexedDB is transaction-ceremony hell. We standardise on Dexie for hand-rolled stores and let sync engines (more below) bring their own abstraction when they do. Whichever you choose, wrap every access in a repository module — `notebookRepo.create()`, never `db.table('notebooks').add()` scattered through components. The day you migrate storage engines, that seam is the difference between a refactor and a rewrite.

**Model for the query you have, not the entity you designed.** IndexedDB has no joins and its indexes are per-object-store. A notes app that shows "notes, grouped by notebook, with attachment counts" wants a denormalised list record maintained on write, not three stores and client-side stitching. This feels wrong to anyone trained on normalised schemas. Get over it in week one rather than month six.

**Writes go through one queue.** A single write path — one module that appends mutations to a local outbox and applies them optimistically — gives you ordering guarantees, an audit trail for debugging, and a natural place to hang the sync engine. Two write paths gives you heisenbugs where the UI and the sync engine disagree about what exists.

**Test the quota cliff.** Mobile browsers evict storage under pressure, and Safari's thresholds are the most aggressive. Persist storage with the Storage API (`navigator.storage.persist()`) where you can, and design for total local-data loss as a recoverable state, not a catastrophe. If eviction means data loss, you never had local-first; you had a cache with delusions.

## Sync engines: the three honest options

When we say "sync engine" we mean the machinery that reconciles local state with remote state. There are three families, and the choice dominates everything downstream.

**Operation sync (outbox + server-authoritative merge).** Local mutations are appended to an op log; a background process ships them to the server, which validates, applies and broadcasts. Conflicts are resolved by business rules in code — "last writer wins on this field, merge on that one." This is how Linear-class tools work and how we built the project-planning layer of our [Northwind Ledger rebuild](/work/northwind-ledger-dashboard-rebuild): accountants' edits are small, field-level and rule-resolvable. Maximum control, maximum bespoke effort.

**CRDTs (conflict-free replicated data types).** Data structures — text sequences, maps, counters — that mathematically guarantee convergence regardless of merge order. Yjs and Automerge are the mature options. For collaborative text they are close to magic. The honest costs: document sizes grow with history (garbage collection and compaction = your problem), operational transforms across schema versions are delicate, and CRDTs resolve *concurrency*, not *semantics* — two users both deleting and editing the same paragraph converge to a state that is consistent and possibly nonsense. Somebody still owns the meaning.

**Replicated database (ElectricSQL, PowerSync, Zero, et al.).** A sync layer that streams selective Postgres rows into a local embedded database and ships writes back up. The newest family, and genuinely promising: you keep real SQL locally and the server stays the source of truth. The trade-off is you are betting your data layer on a young platform, and the moment a query needs data outside the replicated shape, you are building the escape hatch yourself.

We choose operation sync when writes are small and rules are expressible, CRDTs when the product *is* multi-user text or canvas, and replicated DBs when the team already lives in Postgres and the user base forgives a rough edge. We have not yet shipped the third in anger at Brassfern; the first two we can staff and debug at 2am, which is the real selection criterion.

## Migrations: the part nobody demos

A server-first app migrates its schema with a deploy: one database, one script, done. A local-first app has **N databases, one per device, on arbitrary versions, some of which have not connected in four months.** This is the cost that kills naive local-first projects, so treat it as a first-class design constraint:

- **Version every record.** Embed a schema version in each document or in per-store metadata, not inferred from shape.
- **Migrate lazily and idempotently.** Upgrade data when it is touched, via pure functions that run any number of times safely. A blocking "upgrading your data…" screen on app open is an admission that a migration can fail while the user watches.
- **Keep op formats append-only.** If your sync protocol's operation shape changes, version the protocol and have the server speak N-1 versions for a deprecation window. Devices that were offline during the window are your test suite now.
- **Simulate a hostile fleet in CI.** Build fixtures of stores at versions 1, 3 and 5, migrate them to current, and diff against a fresh store. We fold this into the same discipline described in [our testing strategy](/journal/engineering/testing-strategy-that-scales): the migration matrix is never optional.

## Sync-status UX: small, honest, ever-present

The default local-first demo hides sync entirely. Real products cannot. Users need to trust that their work is safe, and trust needs evidence. The pattern that has worked across our builds:

A **persistent, quiet indicator** — a word, not a spinner — with three states: *Saved* (synced), *Saving* (pending ops in outbox), and *Offline — will sync* (with a count if it's grown past trivial). Clicking it opens the truth: what is pending, when the last successful sync happened, and a manual retry. Never show a green "synced" while the outbox is non-empty; the one time it lies, you lose the user forever.

Conflicts that rules cannot resolve should be rare, and when they surface, they surface as **documents, not dialogs**: a "conflicted copy" appears alongside the resolved one, in the list, clearly labelled. Nothing blocks. Nothing is destroyed. Deletion is a legal act; never delegate it to a merge algorithm.

These flows are exactly where [state machines earn their keep](/journal/engineering/state-machines-ui-flows) — sync is a protocol with illegal states, and encoding it as a machine keeps the UI from ever displaying a lie.

## When server-first is simply right

We talked two clients out of local-first last year, and both calls were right. Walk away when:

**The data does not fit.** If the meaningful working set exceeds what a phone should hold — full-text search across a ten-year archive, dashboards over millions of rows — a local replica is a liability. A fintech client with heavy server-side aggregation needed the warehouse, not a sync engine; [edge rendering of precomputed views](/journal/engineering/edge-rendering-honest-guide) solved the latency complaint they actually had.

**Correctness has a single source of law.** Pricing engines, inventory with hard stock limits, anything regulated — the server's answer *is* the answer, and optimistic local decisions create money-shaped conflicts no merge rule can fix.

**The team and timeline are honest.** Local-first roughly doubles the data-layer budget and picks up permanent complexity. On a fixed-scope sprint with a team that has never shipped one, that is how projects die. There is no shame in a well-cached, fast server-first app. Shame lives in the airplane-mode bug tracker.

When it *is* right — field tools with genuinely spotty connectivity, creative tools where latency murders flow, collaboration where presence is the product — nothing else comes close. The trick is being honest about which product you are building before you pick the stack, which is a conversation we have in the first week of every [product engagement](/services/product).

## Key takeaways

- Local-first means the local store is the primary data path — not that the server is optional.
- Wrap IndexedDB behind a repository seam, denormalise for your real queries, and funnel all writes through one outbox queue.
- Choose the sync engine by conflict shape: operation sync for rule-resolvable field edits, CRDTs for shared text/canvas, replicated databases for Postgres-shaped teams.
- Schema migrations across a fleet of stale devices are the hidden killer; version records, migrate lazily and idempotently, and test a hostile version matrix in CI.
- Sync-status UI should be quiet, persistent and incapable of lying; conflicts surface as documents, never modals, and merges never delete.
- Server-first remains the correct default for oversized datasets, hard-consistency domains and tight timelines.

## FAQ

**What's the difference between offline-first and local-first?**
Offline-first usually means a server-first app with caching and queued writes so it degrades gracefully without connectivity. Local-first makes the local copy primary: the app is fully functional offline for as long as the user likes, including correct multi-device conflict handling. Offline-first is a feature; local-first is an architecture, with an architecture's price tag.

**Are CRDTs worth it for a simple app?**
Almost never. If users write to distinct records and conflicts are rare and field-level, an outbox with server-side merge rules is simpler to build, debug and explain. Reach for CRDTs when concurrent editing of shared rich structures — text, whiteboards, canvases — is the product itself.

**How big can a local-first dataset get before it breaks?**
The constraint is not IndexedDB capacity (gigabytes are realistic on desktop) but the phone: storage eviction policies, first-sync time over mobile data, and memory during queries. As a working ceiling we design for a few hundred megabytes and tens of thousands of records per user, with selective replication ("pin this project for offline") beyond that.

**Can I retrofit local-first onto an existing app?**
Painfully. The cheap version is offline-first read caching plus queued writes, which captures most user goodwill at a fraction of the cost. A true retrofit means re-modelling writes as operations and building the migration machinery described above — usually justified only when offline usage is a top-three churn driver with numbers to prove it.
