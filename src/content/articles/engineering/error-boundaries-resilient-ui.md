---
title: "Error boundaries: designing UI that fails gracefully"
description: "Error boundaries are a product decision, not a try/catch. Granularity, fallbacks that save user work, retry semantics and reporting that actually gets read."
slug: error-boundaries-resilient-ui
cluster: engineering
tags: [react, reliability, error-handling, ux]
date: 2026-02-09
author: Tomás Reyes
keywords: [react error boundaries, resilient ui design, error handling frontend, fallback ui patterns]
readingTime: 8
---

Somewhere in your app right now, a chart component is one malformed API response away from taking down the whole dashboard. The user was mid-way through something. The screen goes white, or worse — it goes to a full-page error that says "Something went wrong" with a button labelled "Reload", which is the software equivalent of shrugging.

React gives us error boundaries, and most teams treat them as a seatbelt: install one at the root, forget it exists, hope never to see it. That's a waste. A boundary is a *design surface* — the place where your product decides what failure feels like. Done well, partial failure becomes almost invisible. Done lazily, one bad widget eats the whole page.

This is how we design for graceful failure on the product side of the studio, learned mostly by breaking dashboards in interesting ways.

## Boundaries are a granularity decision

The root-level boundary is necessary and nearly useless. Necessary, because an unhandled render error shouldn't white-screen your users. Useless, because when it fires, everything the user was doing is gone.

The craft is in deciding *where else* failure should stop. Our rule of thumb: **a boundary belongs wherever the UI has independent value.** On the Northwind Ledger rebuild ([case study](/work/northwind-ledger-dashboard-rebuild)), that meant:

- Each dashboard widget gets its own boundary. A broken cash-flow chart means the cash-flow card shows a sad face; the transactions table and the budget ring keep working.
- Each route gets a boundary, so a crash in Settings can't murder an in-progress expense entry elsewhere.
- Anything with **unsaved user state** gets its own boundary *and* a state-preservation plan — more on that below, because it's the part everyone misses.
- Any third-party island (chat widget, embedded map, payment iframe wrapper) gets quarantined. Never let someone else's code take down your navigation.

A mental model that helps: boundaries are the fire doors of your UI. You don't put one giant door on the building; you put them between rooms so a fire in the kitchen doesn't gut the hotel.

The cost of over-granularity is real, though — fifty bespoke fallback states is a maintenance nightmare. We standardise on three fallback components (`<PanelError>`, `<RouteError>`, `<RootError>`) and accept that a widget fallback won't be poetry.

## Design the fallback, don't default it

"Something went wrong" is copy that tells the user three things: it broke, we don't know what broke, and we don't care what you were doing. Every fallback we ship answers four questions instead:

1. **What happened**, in human terms scoped to the widget: "We couldn't load your cash-flow forecast." Not "Error: Cannot read properties of undefined."
2. **Is my data safe?** If the answer is yes, say so explicitly: "Nothing you've entered has been lost." This single sentence defuses most of the emotional cost of an error.
3. **What can I do?** A retry button (with real retry semantics — below), and if the feature has a degraded mode, a path to it: "You can still export your data as a CSV."
4. **Whose fault is it?** Yours. Never blame the user's connection unless you've actually detected that they're offline. "Unable to connect" earns trust when it's true and burns it when it's a guess.

This is design work, and it belongs in the same critique sessions as your happy-path screens. Our notes on [empty, loading and error states](/journal/web-design/empty-loading-error-states) cover the visual language; the short version is that a fallback should look like it was *made*, not *leaked*.

## Preserving user work: the feature nobody demos

The worst failure mode in any product is destroying something the user created. A rich-text draft, a half-configured report, a checkout with twelve fields completed. If a boundary catches an error, that state must survive.

Two patterns carry 90% of the weight:

**Journaled input.** For forms and editors, persist a draft to `sessionStorage` (or IndexedDB for heavier payloads) on every change, debounced. When the fallback renders, it offers "Restore my work" — and on retry or reload, the component rehydrates from the journal. The engineering cost is a day or two per complex form. The trust it buys is enormous. We pair this with the [shared schema contracts](/journal/engineering/schema-validation-shared-contracts) so the restored draft is validated before it re-enters the tree — a corrupted journal must fail the draft schema, not crash the boundary a second time.

**Crash re-entrancy.** If remounting a subtree can throw again on the same data, your retry button is a white-screen machine. Guard retry logic with an attempt counter, and on the third failure, stop offering retry and offer the escape hatch instead: "View in simplified mode" or "Download your data". Boundaries that loop are worse than boundaries that quit.

This is also where [state machines earn their keep](/journal/engineering/state-machines-ui-flows): when a flow's states are explicit, "recover to the last valid state" is a transition, not an archaeological dig through component state.

## Wiring errors to a place that gets read

A boundary that reports to nowhere is a diary. The `componentDidCatch` (or your framework's equivalent) should ship, at minimum: the component stack, the route, the boundary's ID (name your boundaries!), the app version, and a digest of the error message.

Two crafts separate useful reporting from noise:

**Fingerprinting.** Group raw errors by normalised message + boundary ID before they hit your tracker, or one trending JSON hiccup becomes four thousand issues about the same widget. We roll a tiny client-side fingerprinter and only report novel fingerprints aggressively.

**Budgets and gates.** Dashboard error rates deserve the same treatment as [Core Web Vitals budgets](/journal/engineering/core-web-vitals-field-guide): a weekly review, and — on mature products — CI canaries that alert when a release raises boundary-hit rates by more than a threshold. Errors found by dashboards are cheaper than errors found by support tickets.

Resist the urge to report every caught error as a page. Most are data problems, not code problems. We triage boundary hits into "code bug" (fix it), "data edge case" (handle it in the schema layer), and "user environment" (ad-blocker ate a chunk, extension injected garbage). Only the first two are yours to fix, but the third tells you where to add a quarantine boundary.

## Async errors don't hit boundaries (and what to do about it)

The famous gotcha, still true in 2026: error boundaries catch render, lifecycle and constructor errors. They do **not** catch errors in event handlers, `setTimeout`, promises, or data-fetching libraries' background refetches. Your beautiful fallback will never fire for the failure that's actually most common — a failed mutation.

The discipline: async failures get their own channel. Mutations surface as toasts/inline errors with retry. Query libraries (TanStack Query et al.) get `throwOnError` configured deliberately — *on* for render-critical reads inside a boundary, *off* for background refreshes where stale data beats a fallback. The [skeleton-state article](/journal/web-design/empty-loading-error-states) pairs with this: a background refetch failure should invalidate quietly, never flip a working table into an error card mid-read.

In React 19, `use()` with a rejected promise *does* reach the nearest boundary — which makes boundary placement even more of an information-architecture decision. Suspense granularity and error granularity should be designed together, on the same wireframe.

## Key takeaways

- Boundaries are fire doors: place them where UI has independent value, not just at the root.
- Standardise on three fallback components; make each one answer what happened, whether data is safe, what to do next, and whose fault it is.
- Preserve unsaved work with journaled drafts, and validate restored drafts against a schema before rehydrating.
- Give retry an attempt budget and an escape hatch; never let a boundary be a crash loop.
- Fingerprint and budget your error reporting like a performance metric, or it becomes unreadable noise.
- Design async-failure channels separately — boundaries will never see most of your real errors.

## FAQ

**Should I write my own error boundary or use a library?**
`react-error-boundary` is two kilobytes of well-tested code with a reset API you will otherwise reinvent. Use it; spend your effort on fallback design and reporting instead.

**Do error boundaries work with SSR and React Server Components?**
Boundaries catch client-render errors; RSC errors surface through the framework's own `error.tsx` conventions (Next.js) or your server's error handling. Design both storylines — a server-side 500 needs the same four-question treatment as a client fallback.

**Is it okay to swallow errors in a boundary and show nothing?**
Only if the widget is truly optional (a decorative promo card) *and* you still report the error. Silence without telemetry is just hiding.

**How do I test error states?**
Build a dev-only `<ErrorTrigger>` that throws on demand, wire it behind a query param, and make "what does this look like broken?" part of design review. Our [testing strategy](/journal/engineering/testing-strategy-that-scales) covers automating the rest — including a boundary that fires in CI, proving the reporting pipeline works end to end.

**What about Web Workers, canvases, WebGL?**
They're outside the React tree, so boundaries never see their failures. Wrap them in an isolate component that subscribes to the worker's error events and *translates* them into a boundary catchable error or a local fallback — that's the quarantine pattern from above, applied to actual threads.

**How many boundaries is too many?**
When engineers stop knowing which fallback a component lives under, you've gone too far. Converge on routes, stateful regions, and third-party islands; add widget-level boundaries only where a PM can name the value of the widget surviving alone.
