---
title: "Bundle budgets: the 170kb rule and how we hold it"
description: "Our rule: 170kb of compressed JavaScript per route, or the PR explains itself. How the budget works and where we spend bytes on purpose."
slug: bundle-budget-discipline
cluster: engineering
tags: [performance, bundling, code splitting, engineering culture, ci]
date: 2025-11-14
author: Tomás Reyes
keywords: [javascript bundle size, code splitting, bundle budget, vite bundle analysis, tree shaking, dependency audit]
readingTime: 10
heroImage: /images/articles/engineering/bundle-budget-discipline.jpg
heroAlt: "A brass balance scale weighing small green parcels of code against a single brass calibration weight, printed in engraved editorial style on cream paper."
---

Every website we've ever inherited had a moment where someone typed `npm install` and ended a performance era in eleven keystrokes. Nobody noticed. The package was small, the feature was urgent, the review was about correctness. Six months later a phone report landed: LCP failing at p75, INP climbing, and a diff-culture mystery nobody could pin down.

This is the system we run so that moment can't happen quietly. It's not exotic: a stated budget, enforced by robots, with a culture around the report. But the details matter, so here are all of ours. The same discipline sits behind the numbers in our [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide) and both case studies referenced there.

## Why 170kb, and what ISPs have to do with it

Our standard budget is **170 kilobytes of JavaScript per route, compressed (brotli), including the framework**. Not per page load — per *route*, because that's what a user actually pays to interact with the thing in front of them.

Why 170 specifically? It's not scripture; it's a regression from a target. An interactive experience on a mid-range Android over decent 4G needs the main thread mostly free by the two-second mark. Framework + routing + state + your feature code at 170kb compressed parses and executes in roughly the time that leaves room for rendering, fonts, and the inevitable third-party tag someone will add without asking. At 300kb that room is gone. At 500kb you're tuning a problem you created.

The number exists to be argued with, not worshipped. 3D demos and configurator-style tools get a larger envelope — but they get it *in writing, on a route-by-route basis*, and the rest of the site doesn't inherit their indulgence. Our [Osprey Outdoor configurator](/work/osprey-outdoor-configurator-launch) carries three.js on its route alone, lazily, and the marketing pages never see a byte of it.

## The report that makes it work

A budget in a wiki is a wish. Ours lives as a CI step that comments on every pull request:

```text
## Bundle report — route /checkout
first-load JS:  168.4kb → 214.1kb  (+45.7kb)  ⚠ BUDGET 170kb
largest new chunks:
  moment.js                +67.2kb (min)
  @vendor/datepicker       +11.3kb
```

Three properties make this effective rather than annoying:

1. **Per-route numbers, not a total.** Totals hide everything. The question is always "what did *this route* gain?" because that's the question the user's phone will ask.
2. **Attribution to packages.** "The bundle grew" starts an argument. "moment.js arrived" ends one.
3. **A stated escalation.** The comment ends with the rule: justify in the PR, swap for a lighter path, or spend savings from elsewhere with the performance owner's sign-off. Nobody routes around a budget that offers three legitimate doors.

We generate the report from Vite's manifest plus a small script — about 120 lines — that diffs chunk sizes against the base branch. Lighthouse CI watches the vitals side; this script watches the payload side. Both post to the PR because developers read PRs and do not read dashboards during a sprint.

## The dependency audit: reading the true cost

The interesting work isn't enforcing the budget; it's what you learn holding it. Our standing audit questions, in order of how often they pay off:

**Is this a package or a paragraph?** Leftpad-style incidents are rare, but "we installed 40kb of date library to write one relative-time string" happens monthly. Date formatting, currency formatting, slugify, debounce, classnames — these are single functions wearing a dependency's coat. We keep a `lib/` of house utilities precisely so the obvious move is the cheap one.

**What's the import surface?** ESM packages with correct `sideEffects: false` tree-shake; many popular ones don't. The check is empirical: import one symbol, build, look at the chunk. We've replaced charting, validation, and animation libraries after discovering their "import what you use" docs described an aspiration. When we rebuilt the Northwind Ledger dashboard, the original chart library contributed 94kb compressed to every route including login. A targeted swap and some SVG written by hand got charts under 19kb total — the full story is in the [case study](/work/northwind-ledger-dashboard-rebuild).

**Who owns the transitive mountain?** `npm ls <pkg>` and a bundle visualiser (any of them; we use the Rollup plugin) tell you which of your dependencies brought friends. One form library once dragged in a full locale corpus and a polyfill set for browsers we don't support — 120kb for an email input. The fix was configuration, but you only configure what you've looked at.

**Does it phone the main thread at startup?** Size is the visible cost; evaluation is the silent one. A 30kb module that runs a top-level regex over the DOM, builds a lookup table, or hydrates aggressively adds latency no tree-shaker can remove. INP complaints often trace back to "small" packages with expensive first breaths.

## Route-level splitting as an architecture decision

Code splitting is usually framed as a build feature. We treat it as an information-architecture decision: the route boundary is where you decisively say what a user *won't* need yet. Our rules of thumb:

- **Split at routes, always.** Every route is a dynamic import. This costs nothing and starts the discipline.
- **Split below the fold inside routes.** Charts, maps, editors, video players, configurator canvases: load on intersection or intent (hover/focus for prefetch). On the [Fernleigh Wines storefront](/work/fernleigh-wines-dtc-storefront), the entire cellar-door locator — map, tiles, geocoding — arrives only if you scroll to it or open the intent prefetch by touching the nav item. First-load JS paid nothing for a feature nine in ten sessions skip.
- **Don't over-split.** A dozen micro-chunks of 8kb each costs more in requests and waterfalls than it saves. We merge chunk groups deliberately: vendor code that changes rarely (React, router) in one long-cached chunk, app code in route chunks, heavy widgets in their own.
- **Prefetch with manners.** `requestIdleCallback`- or hover-triggered prefetching of the *next likely route* makes splitting invisible. The network is idle an astonishing amount of the time; spend idleness, not attention.

Typefaces belong in this conversation too. Display fonts are frequently the largest non-JS asset on marketing pages; subsetting and disciplined `font-display` are the same philosophy in a different wardrobe. Our [type-loading piece](/journal/web-design/typography-that-loads) covers that side.

## Where we spend bytes on purpose

A budget held with no taste produces a fast, joyless site. Some of our deliberate spends:

- **Motion bearing meaning.** On brand-led marketing sites we'll spend 15–20kb on a physics-based animation layer because the feel *is* the product. It ships to the routes that need it, never globally, and it respects `prefers-reduced-motion` unconditionally.
- **Real charts on dashboards.** Data density pays. We chose a chart stack for Northwind that costs ~19kb because the accountants who live in that tool deserve actual rendering quality, and the rest of the app is lean enough to absorb it.
- **Optimistic UI infrastructure.** A small mutation-queue layer (~4kb) that makes every write feel instant is worth more to perceived performance than 100kb of saved payload on a CRUD product.

The budget isn't "small is moral". It's "every byte has an advocate". When the advocate is a designer arguing for easing curves, and the byte cost is on the table, you get a real conversation — and usually a better decision than either default.

## The culture bit, which is the whole thing

Tooling enforces; culture sustains. Three habits keep ours honest after the engagement ends:

1. **The size diff is a first-class review surface.** Reviewers comment on bundle deltas the way they comment on API shape. It's normal, not a niche concern.
2. **Savings are celebrated in the same channel as features.** "Removed 60kb by replacing the date library" gets the Friday-demo treatment. What gets applauded gets repeated.
3. **The budget has an owner with authority to say "pay it down".** Not a veto — a negotiation with teeth. On retainers we quantify it: breaching the budget without sign-off is treated like a slipping deadline, because to the user it is one.

If you're commissioning a build, this is one of the questions worth asking a studio: *show me your bundle report from last Tuesday.* The honest ones have it open. It's part of how we run [website builds](/services/websites) and long-running product engagements, and it's covered in estimation on our pricing page.

## Key takeaways

- Pick a per-route, compressed JS budget derived from a user-experience target (ours: 170kb), and let exceptions be written down, not drifted into.
- Enforce in CI with a PR comment that attributes growth to packages and offers legitimate exits: justify, swap, or pay down with sign-off.
- Audit dependencies for import surface, transitive weight, and startup evaluation cost — size is the visible part of the bill.
- Treat route boundaries as architecture: split at routes and below the fold, merge micro-chunks, prefetch on intent.
- Spend bytes deliberately where they buy meaning — motion, charts, optimistic UI — and celebrate savings publicly.

## FAQ

**Is 170kb still realistic when "everyone" ships 500kb+?**

It's realistic because we've held it across e-commerce, editorial, and dashboard products for years. The 500kb norm is not a law of physics; it's an aggregate of decisions nobody owned. Content-led sites should land well under 100kb per route. Rich app surfaces can live within 170 if the heavy widgets split cleanly. What's genuinely hard is retrofitting the budget onto a codebase that never had one — which is an argument for starting, not for giving up.

**Doesn't server-side rendering make bundle size less important?**

SSR fixes first paint, not interaction. The browser still downloads, parses, and executes the JavaScript to make that server-rendered page *do* anything — and INP measures exactly that moment. SSR and bundle discipline are complements: one gets pixels up fast, the other ensures the pixels respond.

**What about third-party scripts we don't control — tag managers, chat widgets?**

They count. We measure them in the same report (they're often the largest single source of main-thread time) and we treat their inclusion as a budget item with an owner on the client side. Loading patterns help — `defer`, facade patterns for chat widgets, consent-gated loading — but the durable fix is a quarterly "who is this script for?" review.

**How do you handle a genuinely heavy feature, like a 3D configurator?**

By isolating it. The 3D stack lives behind a route-level split, loads on interaction where possible, and gets its own written budget. The rest of the site must not subsidise it — first-load JS on sibling routes stays under the general bar. Users who want the configurator pay for it; users reading the story don't.

**We inherited a 900kb bundle. Where do we start?**

Don't boil the ocean: fix the shared chunk first (what every route pays), then the worst single route, then institute the PR report so it stops growing. Most of the wins are swaps — dates, charts, a redundant utility belt — and one embarrassing discovery like a duplicated framework copy. Six weeks of steady pressure typically halves the payload, and the CI report means it stays halved.
