---
title: "View transitions in the wild: lovely, fragile, worth it"
description: "Eight projects in, we still love the View Transitions API — with our eyes open. Where it shines, how it fights your router, and the tiers that keep it honest."
slug: view-transitions-real-projects
cluster: engineering
tags: [animation, ux, progressive enhancement, frontend architecture, web platform]
date: 2026-08-21
author: Tomás Reyes
keywords: [view transitions api, spa page transitions, shared element transitions, view transition router integration, reduced motion animation]
readingTime: 10
---

In April, Hannah published [the mechanics guide](/journal/engineering/view-transitions-api-practical) — what the API does, the pseudo-element model, the fallback posture. This is the companion piece nobody plans to write: the field report. Eight client projects and one agency site into the View Transitions era, here's what the conference demos left out — where the API earns its keep, the precise place it fights your React router, and the tier system we now design against before the first line of CSS.

The short version: we keep shipping it, we have never once regretted shipping it, and every project still finds one new way for it to be weird.

## Where it genuinely shines

Two patterns justify the entire API. Everything else is garnish.

**List → detail is the canonical win.** A content card in a grid morphs into the hero of the article page: the image grows, the title slides, the user's eye follows the object its attention was already on. On the [Signal and Noise podcast network](/work/signal-and-noise-podcast-network), episode cards hand off to episode pages this way, and it's the single most complimented detail on the site — including, notably, from listeners who have no idea they're complimenting a browser API. That's the test. Good transition motion doesn't read as animation; it reads as *continuity*. The page didn't change; the thing you touched got closer.

**Filter and sort stability on data UIs.** When a table re-sorts or a product grid re-filters, the DOM updates and items teleport in a hard cut. Tag consistent `view-transition-name`s on rows and the update becomes a shuffle — items visibly trading places. The comprehension gain is real: users can *see* that the data is the same data, reordered, rather than re-rendered. We measured this informally on an internal dashboard: in moderated sessions, four of six participants described the old hard-cut version as "loading" and the transitioned version as "sorting." Same latency. Different truth.

Everything else — page crossfades, hero morphs on marketing sites, the occasional nav flourish — is fine when restrained and embarrassing when not. The rule from our [motion engineering practice](/journal/engineering/animation-engineering-60fps) applies unchanged: motion must carry information or state, or it's decoration with an LCP cost.

## The router fight, documented

Same-document view transitions wrap a DOM mutation in `document.startViewTransition()`. In a React app, "a DOM mutation" is the entire routing render — and here is the sentence that costs every team a sprint: **the transition callback is not awaited in the way you think.** The browser snapshots, runs your callback, then waits for the *next rendered frame* to snapshot the new state. React 18's concurrent scheduling does not promise you a commit on any particular frame. If your callback calls `navigate()` and React decides to yield, the browser can snapshot the intermediate state — or the old state — and your elegant morph becomes a flash of the wrong thing.

The working integration, which we've now shipped on three routers, has three parts:

1. **Flush before you return.** The callback must end with the new UI *committed*. On React Router that means treating the navigation as a transition-blocking update — either via the framework's own view-transition support where it exists, or by dispatching the route change synchronously from the callback. If your abstraction doesn't let you force a commit, wrap the navigation state yourself rather than fighting the router's scheduler.
2. **Name generation is a state problem, not a CSS problem.** Shared elements need matching `view-transition-name`s on both pages, and the natural unique key is data (the episode id, the product id) that both routes can compute. Centralise it: one helper takes an entity type and id and returns the name. Ad-hoc names scattered through components collide the moment two cards of different kinds share a transition — we shipped a bug where a podcast cover morphed into an unrelated host portrait because both were `vt-image`. Lovely motion, wrong resurrection.
3. **Transitions must not outlive their navigation.** Back-button spam, a second click mid-transition, a prefetch race — the cleanup story is yours. Skip the in-flight transition on any new navigation (`transition.skipTransition()` semantics) and never let a `view-transition-name` survive on an element that persists across routes. A named element that exists on two *unrelated* pages morphs them together, and the result looks exactly like the bug it is.

None of this is hard. All of it is undocumented in the tutorials, because the tutorials run on `<a>` tags.

## Reduced motion is a design tier, not a footnote

`prefers-reduced-motion` handling for view transitions is one media query:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none; }
}
```

But deciding *what* that query should do is a design decision we now make explicitly, per project, in the motion spec. Our tiers:

- **Tier 0 — default:** no view transitions at all. Internal tools, heavy data UIs under time pressure, anywhere the choreography wasn't designed.
- **Tier 1 — the honest floor:** crossfade only, root-level, trivially disabled by the media query above. Every content site gets this; it costs an afternoon and removes the hard cut.
- **Tier 2 — continuity:** shared-element morphs for list→detail and sort stability. Requires naming discipline, reduced-motion alternatives, and a budget line in the estimate.
- **Tier 3 — choreography:** sequenced, art-directed transitions like the ones on our own site. Only with a motion designer in the room and [accessibility review](/journal/engineering/accessibility-as-engineering-practice) on the schedule, because a 600ms morph is in the way of a keyboard user moving fast.

The tier goes in the project brief and the performance budget. A Tier 3 team knows it has animation code-split per route, `view-transition-name` applied via inline style only while transitioning (so unrelated renders don't trigger stale names), and a QA checklist that includes back-button spam. The tier framework turns a vibes conversation into a scope line, which is where we like scope conversations: early, in writing.

## Debugging in the waterfall

The browser devtools animation inspector captures view transitions and lets you scrub the pseudo-element tree — learn this before you need it, because the failure modes are otherwise illegible. Our most-seen bugs, in order:

1. **The stale-name jump** (an element with a permanent `view-transition-name` re-renders for unrelated reasons and warps across the screen). Fix: names exist only during transitions.
2. **The z-index sandwich** (transition pseudo-elements render in a dedicated top layer; your sticky nav's box-shadow suddenly composits wrong). Fix: expect repaints of anything fixed-position; test with the inspector's paint flashing.
3. **The expensive snapshot** (transitioning a region containing a live chart or canvas; the snapshot rasterisation drops frames on mid-range phones). Fix: exclude it (`view-transition-name: none` subtrees still snapshot; genuinely heavy regions get moved outside the transitioned root or frozen to a poster during the transition).

That third one is why view transitions appear in our performance budgets alongside the [Core Web Vitals rules](/journal/engineering/core-web-vitals-field-guide): a morph is main-thread work competing with hydration, and on a mid-range Android over 4G, the budget meeting is short.

## Would we do it again?

Yes, at every tier, with eyes open. The API collapses what used to be a FLIP-animation library, a transition router and two weeks of state juggling into a browser primitive with real accessibility hooks. The fragility is concentrated exactly where competence pays: router integration and naming discipline. Get those two right and the rest is taste — which, conveniently, is the part we sell.

## Key takeaways

- Two patterns justify the API: list→detail shared elements and sort/filter stability. Both buy comprehension, not decoration.
- In a React SPA, the transition callback must end with the new UI committed — concurrent scheduling will otherwise snapshot the wrong frame.
- Centralise `view-transition-name` generation around entity ids; scattered names collide.
- Apply names only during transitions. A persistent name is a bug waiting for an unrelated re-render.
- Choose a motion tier (0–3) in the brief; put reduced-motion handling and QA in that tier's scope, not in a retrofit.
- Heavy live regions (charts, canvases) don't snapshot cheaply — exclude or freeze them.

## FAQ

**Do view transitions hurt SEO or crawlability?**
No. They're a rendering-layer concern snapshots of the DOM you already ship. Crawlers see the same HTML either way — this is one more argument for shipping real pages ([the MPA case](/journal/engineering/view-transitions-api-practical) covers it) rather than a blank shell that animates in its content.

**What about cross-document transitions between separate page loads?**
Shipped and stable for MPAs now, and they're the secret weapon of content sites: server-rendered pages with app-like continuity. This very site uses them. The integration fight above is a same-document SPA problem; cross-document transitions don't have it.

**How do we test them?**
Snapshot tests are useless — the transition is a browser interpolation. We test the *invariants*: the Playwright suite asserts that names appear only during navigation and that reduced-motion runs produce no transition artifacts. Catching the stale-name bug class automatically paid for the test day in its first month; our [Playwright practice](/journal/engineering/playwright-testing-that-lasts) write-up has the harness shape.

**Is it ready for client work without hedging?**
At Tier 0–2, yes, as progressive enhancement with a designed floor. At Tier 3, yes, with the caveats in writing. The honest hedge is no longer browser support; it's whether the choreography was designed or improvised.

**What breaks first under pressure?**
Naming discipline, always. The second a second developer tags elements by hand, the collision bugs begin. Generate names from data, lint against hard-coded ones, and the API stays lovely instead of fragile.
