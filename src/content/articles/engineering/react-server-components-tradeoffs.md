---
title: "React Server Components: the trade-offs nobody puts in the talk"
description: "A sober field account of React Server Components: where they genuinely help, where the mental-model and caching costs bite, and how we decide per project."
slug: react-server-components-tradeoffs
cluster: engineering
tags: [react, architecture, server components, performance, frameworks]
date: 2025-03-13
author: Felix Brandt
keywords: [react server components, rsc tradeoffs, react architecture, next.js patterns, server side rendering react]
readingTime: 10
---

The conference talk version of React Server Components is clean: components run on the server, ship no JavaScript, stream down as HTML, and your bundle shrinks while your data fetching gets simpler. All true. What the talk leaves out is the invoice: a new mental model with sharp edges, a caching layer that will surprise you in production, and a debugging experience that ranges from fine to *where did this rerender come from and why is it Tuesday*.

We've shipped RSC-based projects since the architecture stabilised — a data-heavy editorial platform, a SaaS marketing site with an app behind it, one regrettable e-commerce experiment we quietly rolled back. This is the honest ledger.

## What RSC actually buys you

Strip away the framework vendor's framing and RSC gives you three things:

**1. Data colocation without a client round-trip.** A deeply nested component can query Postgres directly. No API route, no client loading state, no `useEffect` waterfall. For content and dashboard pages this is real — we cut the time-to-content on one account overview from 2.1s to 700ms purely by deleting four levels of client-side fetch chains.

**2. Zero-bundle components.** A markdown renderer, a syntax highlighter, a date-formatting util — things that used to cost visitors 40–120KB of parse-and-execute now cost nothing, because they never reach the browser. On mobile connections this is the single largest win RSC offers. It's the same instinct as our [Core Web Vitals field program](/journal/engineering/core-web-vitals-field-guide): the fastest JavaScript is the JavaScript you don't ship.

**3. Streaming composition.** Slow data can resolve in place while the shell paints instantly. Users see the page skeleton immediately and the expensive widget fills in. Done well, this beats a spinner in every way that matters.

## The costs, itemised

### The mental model is genuinely harder

Every React dev who grew up on "it's all just the client" now has to hold two runtimes in their head. The server/client boundary is explicit (`'use client'`) but the *implications* are not. The classic footgun: you import a server component into a client component file and it silently becomes a client component — along with everything it imports. Your "zero-bundle" markdown renderer just shipped to the browser because somebody wrapped it in a component with an `onClick`.

The fix is discipline, not intelligence: compose server components *through* client components via `children`, never *into* them by import. We lint for it. New team members still need two or three weeks before the boundary stops surprising them.

### Caching is a second architecture project

With RSC in a framework like Next.js you now manage at least four caches: the router cache (client), the full route cache (server), the data cache (`fetch` memoisation), and the request memoisation layer. Each has different invalidation semantics. Each has shipped at least one "why is the user seeing stale data" incident in our experience.

The pattern that saved us: treat cache policy as part of the data model's definition, not as an afterthought in the component. Every queryable entity gets an explicit freshness contract — "projects list: revalidate on mutation, 60s staleness acceptable" — written next to the schema. Undocumented cache behaviour is undebuggable cache behaviour.

### Composition gets weird at the leaves

Interactive leaves deep inside server-rendered trees — a like button inside a server-rendered comment thread inside a server-rendered post — are where the abstraction creaks. You end up passing serialisable props across the boundary, which means no functions, no class instances, no rich objects. Refactoring a server component to accept a callback from a client parent is not possible; you restructure the tree instead. This is architecturally *good* pressure (it forces cleaner seams) but it is still pressure, and it arrives mid-sprint.

### Debugging spans two runtimes

A hydration mismatch used to mean "your SSR and client disagree." Now it can also mean "your server component rendered different data than the client boundary expected, in DevTools that show you the client tree but not the server tree." React DevTools' RSC support has improved enormously, but a confusing rerender can still require correlating server logs with client timelines. Budget for it.

## Decision heuristics that have held up

After a handful of these builds, here's how we actually decide. If you're weighing architectures more broadly, our [islands architecture piece](/journal/engineering/islands-architecture-when) covers the adjacent territory.

**Reach for RSC when:**

- The site is content-first with an app attached — marketing pages, docs, editorial, plus a logged-in product. This is RSC's home turf; we used exactly this shape for a recent media build and the editorial side shipped almost no client JavaScript at all.
- Pages are data-dense and read-heavy: dashboards, listings, account views. Direct data access in components removes whole layers.
- The team is already fluent in React and committed to the ecosystem for years. The learning curve amortises.

**Stay client-rendered (or go islands) when:**

- The product is a true app: persistent shell, optimistic-everything, heavy client state. An inbox, a music player, a live budgeting tool like our [Northwind Ledger demo](/lab/northwind-ledger-budget). RSC adds a boundary tax to every interaction for no payoff.
- The team is small or rotating. The RSC discipline tax lands on your least experienced member at 11pm before a launch. A well-tuned SPA is a known quantity.
- You're on a host without good serverless/edge support for the framework's server side. Half-supported RSC is worse than no RSC.

**The mixed case that bit us:** e-commerce PDPs. We tried RSC on a storefront where every product tile needed client-side variant state, cart mutations, and pricing personalisation. The interactivity density was so high that the tree became a client component with server garnish — the worst of both. A conventional client-rendered storefront with aggressive static generation of the content shells was faster *and* simpler. Our broader thinking on this lives in [headless commerce: the honest trade-offs](/journal/ecommerce/headless-commerce-tradeoffs).

## Practices that make RSC survivable

If you do commit, these are non-negotiable in our book:

1. **Draw the boundary in the folder structure.** `/server` and `/client` directories with lint rules preventing cross-imports except through explicit composition. Boundaries you can see are boundaries that hold.
2. **Write cache contracts next to the data layer.** Freshness, invalidation triggers, acceptable staleness. Review them like schema migrations.
3. **Serialisable-props discipline.** If a prop crosses the boundary, it's JSON-shaped. No exceptions; exceptions become serialization bugs in month four.
4. **Measure hydration, not just LCP.** RSC's promise is less client work — verify with real-user INP data, otherwise you're trusting the marketing.

## Key takeaways

- RSC's real wins are deleted fetch waterfalls, zero-bundle server components, and streaming — all mobile-performance wins.
- The real costs are a two-runtime mental model, a multi-layer caching system, and composition friction at interactive leaves.
- Content-first-with-app-attached is the sweet spot; interactivity-dense products are the trap.
- Folder-enforced server/client boundaries and written cache contracts are what separate a maintainable RSC codebase from a haunted one.

## Frequently asked questions

**Is RSC worth it for a pure marketing site?**
Usually no — a static or islands architecture is simpler and faster to operate. RSC earns its complexity when content and a logged-in app share a codebase and a design system.

**Does RSC replace our API layer?**
For first-party reads within the app, yes — components query directly. But if mobile apps, partners, or public integrations consume the same data, keep the API; RSC becomes another consumer, not the only one.

**How long does the team take to get productive?**
In our experience: two to four weeks to competence, two to three months to the point where boundary decisions are instinctive. Factor that into project one; don't make project one a launch-critical rebuild.

**Can we adopt RSC incrementally?**
Yes, and you should. New sections of an app (docs, settings, billing views) are ideal pilots. Rewriting an existing interactive app to RSC wholesale is almost never the right call.
