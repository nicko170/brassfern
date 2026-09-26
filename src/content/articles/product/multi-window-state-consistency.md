---
title: "Two tabs, one truth: state across windows"
description: "Multi-tab state consistency without the baffling UX: storage events, BroadcastChannel, optimistic locks, and how to disclose last-write-wins before it betrays someone."
slug: multi-window-state-consistency
cluster: product
tags: [state management, multi-tab, consistency, product engineering, UX]
date: 2026-06-30
author: Felix Brandt
keywords: [multi-tab state sync, storage events, UI consistency, tabs in sync UX, product engineering UX]
readingTime: 9
---

Here is a scene that plays out in your product every day. A user opens your app in two tabs — because they wanted the customer record next to the invoice, because their browser restored a session, because middle-click is how some people breathe. In tab one they edit a record and save. Tab two still shows the old value. They flip back, see the discrepancy, and now they don't know which tab is lying. They do the rational thing: they edit in tab two, save, and silently overwrite their own work.

No error. No warning. Just quiet data loss in an application that passed QA.

Multi-tab inconsistency is the most common *invisible* integrity bug in web software. It never appears in a test plan, because test plans run in one tab. Support tickets about it arrive as "your app is buggy" or, worse, never arrive at all — the user just lowers their trust, permanently, by one notch. And the fix is rarely one feature; it's a set of decisions about truth, disclosure and conflict, made deliberately. This is how we make them.

## Decide what must be shared, and what is per-tab by design

The first failure is philosophical: teams either assume *everything* should sync across tabs (impossible, and confusing in its own way) or *nothing* should (the default, which produces the scene above). The honest answer is a taxonomy. State falls into three classes, and every product should write its own list down:

- **Session state** — auth, permissions, entitlements. Must sync. If a user logs out in one tab, every other tab is a locked door that must notice; a logged-out tab that keeps showing data is a security bug wearing a UX costume. Same for role changes: an admin demoted to viewer should see every tab become read-only, promptly.
- **Server-backed entity state** — records, lists, carts, dashboards. Should converge. Two tabs showing different versions of the same invoice is a truth problem, and truth problems compound: the user stops trusting *either* tab.
- **Ephemeral view state** — scroll position, open panels, draft filters, the specific row highlighted. Must *not* sync. Tabs that mirror each other's scroll are deeply unsettling; the tabs are workspaces, not windows on one workspace. Designers sometimes propose full synchronization because it demos well. It demos well for eleven seconds, and then it is a haunted house.

Write the taxonomy into the project's engineering notes. Every new piece of state gets classified when it's introduced, the way every new event gets a name in a [tracking plan](/journal/growth/analytics-governance). The classify-on-arrival rule is what stops the drift.

## The plumbing, shortest honest version

The platform gives you exactly enough. `BroadcastChannel` is the workhorse: same-origin pub/sub between tabs, clean API, wide support. One channel per product, a small typed message envelope (`{ type, payload, tabId, sentAt }`), and a shared-module singleton so you don't leak channels across hot reloads. The older `storage` event (fired in every *other* tab when localStorage changes) still works everywhere and doubles as the fallback; plenty of robust implementations are a `storage`-event write-through wrapped in BroadcastChannel when available.

Beyond the toys, apply the same discipline as any realtime system — the trade-offs in our [WebSockets vs SSE notes](/journal/engineering/websockets-vs-sse-realtime) are the same shape. The rules:

1. **One owner per subscription.** A single cross-tab coordinator module owns the channel; components subscribe through it. Components that open their own channels produce duplicate handlers and ghosts.
2. **Echo suppression.** Every message carries the sender's tab id; the sender ignores its own broadcasts. Without this, optimistic UI fights itself — the tab that wrote the change receives its own echo and re-renders, flickers, or double-applies.
3. **Invalidate, don't replicate.** The most robust cross-tab message is not "here is the new invoice object" but "invoice 1042 is stale — refetch". Replication copies bugs; invalidation has exactly one truth, the server. The receiving tab refetches the slice it cares about and renders from the same source everything else renders from.
4. **Degrade silently.** If BroadcastChannel is absent or blocked, the worst case should be the *old* behaviour — staleness — never an error state. Cross-tab sync is progressive enhancement on top of server truth, not a second source of it.

## Server truth, local echoes

The architecture that keeps this tractable: each tab owns its UI state, the server owns entity truth, cross-tab messaging only carries *signals of change*. When tab one saves invoice 1042, it (a) responds locally — recoil-free, [optimistic where warranted](/journal/product/optimistic-ui-integrity) — and (b) broadcasts an invalidation. Tab two receives it and refetches if invoice 1042 is anywhere in its rendered tree. Not open? Ignore the message entirely. Visible in a list row? Revalidate that row. In an edit form with unsaved local changes? That's a genuine conflict, and conflicts get the next section.

This is the same mental model as [local-first sync](/journal/engineering/offline-first-sync-engines), just with the shortest possible sync radius — one user, one browser, two views. If your app already has a sane fetch/revalidate layer (SWR, TanStack Query, a hand-rolled one with a proper cache), cross-tab invalidation plugs into it in an afternoon. If it doesn't, fixing *that* first is the real work, and the cross-tab layer is your excuse to do it.

## Conflicts: last-write-wins is a policy, not an accident

When two tabs genuinely edit the same record, something must give. The three honest policies, in escalating order of effort:

- **Last-write-wins, disclosed.** The server accepts both writes; the loser gets visibly superseded. This is fine — *if* the product says so. The disclosure is the product decision: a banner in the losing tab reading "This record was updated in another tab 20 seconds ago — you were editing an older version", with buttons for "reload latest" and "keep mine as a copy". The cost of LWW is not the lost write; it's the *silent* lost write. Disclose, and LWW becomes respectable.
- **Optimistic locking.** Every write carries the version it was based on (`If-Match` / a revision column); a stale write is rejected with 409 and the UI offers a diff view: your values, their values, per-field choice. This is the right call for financial records, medical notes, legal documents — anywhere a silent merge is professionally unacceptable. It costs real engineering: version columns, conflict responses, and a merge UI that isn't a spreadsheet of JSON. Worth it exactly where the data is worth it.
- **Presence-based locking ("soft locks").** Tabs announce "I'm editing record X"; other tabs show "Ruby C. is editing this in another tab/window" and make the form read-only. Feels collaborative, prevents rather than resolves. Danger: stale locks from crashed tabs. Locks need heartbeats and expiry — 30 seconds without a beat and the lock releases — or your product grows a ghost that eternally edits the pricing page.

What you must not do is the silent hybrid: LWW on the server, no disclosure in the UI, optimistic local state in both tabs. That configuration manufactures the worst sentence in software: "I know I saved it." Data made durable deserves [dedication to undo and recovery](/journal/product/undo-not-confirm); at minimum, keep a revision history so "keep mine as a copy" is recoverable after the fact.

## Login, logout, and the security edge

Auth is the one place multi-tab behaviour is a security question, not a polish question. The rules we treat as non-negotiable:

- **Logout is global.** Broadcast it; every tab tears down to the logged-out shell immediately. A muted "your session ended" toast beats a tab that quietly continues as a zombie session.
- **Token refresh is single-flight.** Multiple tabs refreshing the same short-lived token simultaneously is how you get refresh races and surprise logouts. The classic fix is leader election — one tab holds the refresh lock via `navigator.locks` (or a localStorage mutex with TTL) — and shares the fresh token via broadcast. The Web Locks API made this boring; boring is the goal.
- **Permission changes propagate as invalidations,** same channel as everything else. Sensitive areas gate on revalidation, not on "they probably still have access".

## UX furniture that makes sync legible

The engineering above is invisible when it works. A small amount of visible furniture turns "the app seems weirdly coherent" into visible trust:

- **"Updated just now" markers** on rows that were revalidated due to an invalidation from elsewhere — a subtle flash of the changed cell, a timestamp. The [activity-feed discipline](/journal/product/activity-feeds-audit-logs) applies at micro scale: the product keeps a memory and shows it.
- **A "Viewing in two tabs" affordance** for edit screens — a tiny indicator with a tooltip ("Same account, another tab"). Not a warning; awareness. Users forgive conflicts they were told were possible.
- **Draft honesty.** Unsaved form state should be per-tab *by design* (it's ephemeral view state), but if one tab autosaves a draft, the other tab's staleness banner should mention it: "A draft was autosaved in another tab." Ambiguity about drafts is where duplicate-record tickets are born.

On the [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild) — accountants mirror-reference records across tabs constantly — we implemented invalidation-based convergence plus disclosed LWW with revision history on financial entities. The support category "my changes disappeared" went from a weekly recurrence to two tickets in six months, both of which resolved themselves from the revision log before support replied.

## Testing what QA can't see

Write it into the test plan, because it will not surface otherwise. Minimum cross-tab suite: open two tabs, perform the write matrix (save/logout/permission change/delete) in tab one, assert tab two's behaviour per class. Automatable in Playwright with two contexts sharing storage state; the tests are clumsy once and cheap forever. Add one manual pass on real session-restore — "restore previous session" recreating five tabs with five different staleness windows is where the ghosts live.

## Key takeaways

- Multi-tab inconsistency is an invisible integrity bug. It erodes trust without ever filing a ticket.
- Classify your state: session syncs, entities converge, ephemeral view state stays per-tab on purpose.
- Broadcast invalidations, not data. One coordinator module, echo suppression, server remains the only truth.
- Pick a conflict policy per entity class — disclosed last-write-wins, optimistic locking, or soft locks with heartbeats — and never leave it as an accident.
- Logout is global; token refresh is single-flight via leader election. Auth bugs here are security bugs.
- Show small visible furniture ("updated just now", "editing in another tab") so convergence reads as care, not coincidence.

## FAQ

**Can't we just block the second tab?**
The "you already have this open" wall is the lazy fortress, and users routed around it yesterday: incognito, a second browser, a second profile. Worse, browsers restore sessions by reopening tabs, so the wall punishes normal behaviour. Build for multiple tabs; it's the world as it is.

**Does this matter for read-heavy products?**
Less, but not zero. Any product with a mutable session (auth, plan limits) or any kind of edit surface has the logout-is-global requirement at minimum. Pure read-only publishing can skip the conflict machinery and keep just the session broadcast.

**We've never had complaints — do we still have the bug?**
Almost certainly. Users don't report cross-tab inconsistency; they absorb it as personal error ("I must not have saved") or general flakiness. The absence of tickets is the signature of the problem, not evidence of its absence. Instrument silent-overwrite events and see.

**Offline-first apps — different rules?**
Same goals, harder plumbing. With a local database and a real sync engine, cross-tab becomes one more sync peer, and the correct move is usually a shared worker owning the local store so tabs talk to one replica instead of each keeping one. If you're there, your problems have graduated — congratulations and condolences, in that order.
