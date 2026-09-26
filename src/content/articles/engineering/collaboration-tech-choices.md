---
title: "Realtime collaboration tech: CRDT, OT, or a polite refresh"
description: "Choosing a collaboration stack honestly: OT versus CRDTs, Yjs in production, presence as a feature, and when a polite refresh beats a sync engine."
slug: collaboration-tech-choices
cluster: engineering
tags:
  - realtime
  - collaboration
  - architecture
  - websockets
date: 2025-11-06
author: Tomás Reyes
keywords:
  - realtime collaboration
  - CRDT
  - Yjs
  - operational transformation
  - multiplayer editing
  - websockets
readingTime: 11
---

Every product roadmap eventually grows the same roadmap item: "make it multiplayer, like Figma." Said in a kickoff, it sounds like a feature. It is actually an architecture decision — one that will quietly determine your data model, your hosting bill, your on-call rota and how your app behaves on hotel wifi for the next five years. We have shipped collaborative editing twice, shipped "collaboration-adjacent" presence features about six times, and talked three clients out of multiplayer entirely. The honest menu has three courses: operational transformation, CRDTs, and the deeply underrated third option — a polite refresh.

First, decode what the stakeholder is actually asking for, because "like Figma" usually means one of three very different things. **Co-editing**: two people typing in the same document without destroying each other's work. **Presence**: seeing who's here, where their cursor is, what they just changed — the feeling of company. **Concurrency safety**: two people editing the same record an hour apart without the second one silently erasing the first. These have wildly different costs, and roughly half the teams we meet only need the third one.

## OT: the venerable one

Operational transformation is the original sin of collaborative editing — Google Docs ran on it, ShareJS open-sourced it, and a generation of engineers got grey hair from it. The idea: represent every edit as an *operation* ("insert 'x' at position 47"), and when two operations race, *transform* one against the other so both apply to a converged document.

OT's virtues are real. Operations are tiny, documents stay compact, and with a central server sequencing operations you get a natural linear history — great for audit trails and replay. Its vice is also real: the transform functions are the fiddliest code most teams will ever own. Every pair of operation types needs a correct transform, correctness is proven with deep property-based testing, and the server is not optional — it is the arbiter, which means offline editing becomes a side quest. If your product is a collaborative text editor at its core and you can staff the protocol work, OT is respectable. If collaboration is a *feature*, building OT in 2026 is a hobby, not a plan.

## CRDTs: the honest glamour option

Conflict-free replicated data types flip the problem: instead of transforming edits against each other, you use data structures whose merge is *mathematically* convergent — any two replicas that have seen the same set of operations hold the same state, regardless of order. No arbiter, no transform matrix, peer-to-peer if you want it.

**Yjs** is the pragmatic default, and it deserves its reputation. It is fast (benchmarks that humbled academics), it has bindings for the editors you actually use (ProseMirror/Tiptap, CodeMirror, Quill, Monaco), and the ecosystem covers the boring parts: `y-websocket` or a managed provider for transport, `y-indexeddb` for offline persistence, awareness protocol for cursors and selection state. Automerge is the other serious option, with a nicer "it's just a JSON document" mental model and historically heavier performance characteristics; the gap has narrowed, so evaluate both against your data shape rather than Reddit threads from 2022.

Now the ledger of costs, because CRDT content marketing rarely includes it:

- **Document growth.** A CRDT document accumulates tombstones and operation metadata. A two-paragraph note edited across a long session can weigh 10–50× its visible text. Mitigations exist — compaction on save, snapshotting, garbage-collecting tombstones once all known replicas have synced — and they are *your* mitigations to design, test and operate.
- **Schema changes across live documents.** Documents created under v1 of your model will still arrive when you're on v4. You need a migration path at load time, and CRDT merges during a half-migrated fleet are where the genuinely strange bugs live. Version every document; migrate lazily; log loudly.
- **Convergence is not correctness.** CRDTs guarantee everyone ends with *a* consistent state, not a *meaningful* one. Two users deleting and rewriting the same paragraph simultaneously converge perfectly to something a human might call nonsense. Semantic conflicts — over-allocated budgets, double-booked rooms, contradictory approval states — need business rules on top. (Our longer treatment of this lives in [local-first on the web](/journal/engineering/offline-first-sync-engines) and the [field notes from shipping a sync engine](/journal/engineering/local-first-sync-engines).)
- **Operations.** Something must persist documents, broadcast updates, handle auth *per document*, and survive deploys without dropping a hundred live sessions. Managed providers (Liveblocks, PartyKit-class platforms, Supabase Realtime with adapters) trade money for this; self-hosting trades weekends.

Our rule: CRDTs when the product *is* the shared surface — a document, a canvas, a whiteboard, an annotation layer. The collaboration tech is the product's spine, so its complexity is well-spent.

## The polite refresh

And then there is the option that ships in a fortnight instead of a quarter. A surprising share of "we need collaboration" resolves to **concurrency safety plus ambience**, which you can get from boring parts you'd want anyway:

- **Optimistic concurrency.** Every record carries a `version`; updates include the version the client read; a mismatch returns `409` with the current record. Write a merge UI for the rare collision and you've eliminated silent overwrites — the only failure that actually costs users trust.
- **Field-level last-writer-wins with an audit log.** Most business records are edited field-by-field, and simultaneous edits to the *same* field are rare when you measure them. Store an event per change ("Priya changed status to Approved, 14:02") and render it as an activity feed. Users experience this as collaboration.
- **Presence without co-editing.** WebSocket (or SSE — see our [transport rundown](/journal/engineering/websockets-vs-sse-realtime)) broadcasting "Aiko is viewing this invoice" chips. Cheap, delightful, zero consistency risk.
- **A staleness nudge.** Long-poll or socket-ping a version counter; when it changes, show a warm banner — "Tomás saved changes 12 seconds ago — refresh to see them" — and merge the user's unsaved form state across the refresh where you can. This is the polite refresh. It respects people's attention instead of yanking their document.

When we rebuilt [Northwind Ledger's dashboard](/work/northwind-ledger-dashboard-rebuild), the accountants' collaboration need was exactly this: dozens of people touching a shared ledger, almost never the same line at the same moment. Operation-sync with field rules and a good activity feed beat a CRDT on cost, debuggability and auditability — and nobody missed live cursors, because nobody asked for them once colliding edits stopped happening.

Measure before you build: log how often two users edit the same record within, say, ten minutes. Across three client products we've instrumented, genuine same-record-same-session collisions landed between 0.1% and 2% of edits. That number, not the demo, should choose your architecture.

## Presence is 80% of the feeling

Whichever data layer you choose, the *felt* sense of multiplayer comes from presence, and presence is its own feature with its own pitfalls. Awareness data — cursor positions, selections, "is typing" — should travel an ephemeral channel separate from document data, expire aggressively (a stale cursor is worse than none), and never, ever be persisted into the document. Rate-limit outbound updates (~30/second per client is plenty; mousemove events are not a message protocol). And design the visual language with restraint: coloured carets plus a small avatar stack is a language everyone already speaks; name-tagged cursors trailing labels across the canvas is a carnival. Our [product team](/services/product) treats presence as UI design first and protocol second, which is the correct order.

## A decision guide

Ask, in order:

1. **Do edits collide in practice?** Below ~2% same-record concurrency: optimistic concurrency + activity feed + presence. Stop here; you've shipped.
2. **Is the product a shared canvas/document?** Yes → CRDT (Yjs unless your data argues otherwise). Budget for compaction, document migrations and a provider decision.
3. **Do you need linear, replayable, legally-auditable history of a shared text?** Consider OT, or CRDT snapshots plus a server-side operation log — then interrogate whether "replayable" is a real requirement or a nice-sounding one.
4. **Whatever the answer,** ship presence and the activity feed first. They're cheap, they de-risk the roadmap politically ("look, multiplayer!"), and half the time they're all anyone needed.

## Key takeaways

- "Make it multiplayer" is three different requests — co-editing, presence, concurrency safety — and most products only need the cheapest one.
- CRDTs (Yjs) are the right answer when the shared surface *is* the product; budget for document growth, cross-version migrations and semantic conflict rules.
- OT earns its complexity only for linear-history text editing at the product's core. Don't build it as a feature.
- The polite refresh — optimistic concurrency, activity feeds, presence chips, staleness nudges — covers a remarkable share of real needs for a fraction of the cost.
- Measure actual edit collisions before committing to an architecture; the number is usually smaller than the ambition.

## FAQ

### Is Yjs production-ready?
Yes — it underpins serious products at scale. The caveat is that "production-ready" describes the algorithm, not your deployment: persistence, per-document auth, compaction and connection lifecycles are still yours to engineer, whether you self-host or pay a provider to.

### Can we start with the polite refresh and graduate to CRDTs later?
Yes, and it's the path we recommend. Optimistic concurrency and an activity log are goods in their own right that a CRDT system still uses — the audit feed doesn't disappear when cursors arrive. The one decision to make early is storing events per change; retrofitting the history after launch is the painful version.

### What about offline editing?
Offline changes everything — it moves you from "collaboration" into "sync," a bigger commitment with its own honest ledger. CRDTs handle it gracefully; OT mostly doesn't without heavy machinery. If offline is a genuine requirement, read it as an architecture choice, not a checkbox.

### How do we test collaborative behaviour?
Three layers: property-based tests over arbitrary concurrent edit sequences against your merge logic; scripted multi-client integration tests (two browser contexts in Playwright making simultaneous edits); and a chaos pass where the network drops mid-edit. The third layer finds the bugs the first two can't imagine.
