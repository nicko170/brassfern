---
title: "Core Web Vitals in the field: budgets that survive sprints"
description: "A practical Core Web Vitals program: LCP element archaeology, INP triage, CI-enforced budgets, and real-user monitoring on a shoestring. Recipes that work."
slug: core-web-vitals-field-guide
cluster: engineering
tags: [performance, core web vitals, ci budgets, observability, web standards]
date: 2025-08-07
author: Tomás Reyes
keywords: [core web vitals, web performance, lcp optimization, inp debugging, performance budgets, web vitals ci]
readingTime: 10
---

Every quarter someone publishes "the state of Core Web Vitals" and every quarter the same finding repeats: most sites fail on phones, and the failing pages are the ones that matter — product pages, dashboards, checkout. Not because teams don't care. Because performance work is done in a heroic two-week pass and then quietly eroded by the next six months of perfectly reasonable pull requests.

This is the field guide we run on engagements — the audit recipes, the CI budgets, and the monitoring setup that keeps a site fast *after* the performance team leaves. It's the same program behind the numbers in our [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild) and the [Fernleigh Wines storefront](/work/fernleigh-wines-dtc-storefront).

## Orientation: what the metrics actually punish

**LCP** (largest contentful paint, good ≤ 2.5s) punishes you for one big thing arriving late — usually a hero image, a webfont-painted headline, or a client-rendered block. It's a plumbing metric: server time, discovery, and transfer size.

**INP** (interaction to next paint, good ≤ 200ms) replaced FID in March 2024 and it's meaner: it samples *worst-ish* interactions across the whole session, not just the first tap. INP punishes long main-thread tasks — overgrown hydration, synchronous third-party scripts, expensive re-renders.

**CLS** (cumulative layout shift, good ≤ 0.1) punishes visual instability — late-loading images without dimensions, injected banners, fonts that swap and reflow.

Field data (CrUX, your RUM) is what Google sees and what users feel. Lab data (Lighthouse, WebPageTest) is what you debug with. Never optimise Lighthouse for its own sake; it will happily let you ship a fast test page and a slow product.

## LCP archaeology: find the element, then the wait

Step one is always: *which element is the LCP?* It changes per template, and teams guess wrong constantly. The recipe:

```js
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const last = entries[entries.length - 1];
  console.log(last.element, last.startTime);
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

Drop that in a console snippet (or your RUM) and you have the element. Then decompose the wait:

1. **Time to first byte.** If TTFB is 1.5s, no browser heroics will save you. Cache at the edge, kill per-request recomputation, and treat every redirect as a bill you're paying twice.
2. **Resource discovery.** Hero image hidden behind CSS `background-image`, a JS-injected component, or three layers of lazy wrappers? Use `<link rel="preload">` (sparingly — preloads are priority claims, and claiming everything prioritises nothing), put the hero in markup, and set `fetchpriority="high"` on it. That single attribute is the cheapest LCP win in modern browsers.
3. **Render blocking.** Fonts are the classic villain. `font-display: swap` prevents invisible text; better still, subset your fonts and preload only the display face above the fold. On the Fernleigh storefront, subsetting Fraunces and preloading the one display weight took 600ms off the mobile LCP by itself — the type now renders in the first paint on most visits.

`loading="lazy"` belongs on below-fold images only. Lazy-hydrating or lazy-loading your *LCP element* is the single most common self-own we find in audits, and it's usually someone being conscientious.

## INP triage: the session is the crime scene

INP debugging starts in the field, not the lab, because the bad interaction is usually one your test script never performed — the user who opened a filter panel on a dashboard with 4,000 rows, mid-hydration, on a mid-range Android.

Recipe one: get attribution into RUM. Send, per slow interaction: the event type, the target's selector, the long-task duration, and what was rendering at the time. Without that, INP work is archaeology without a site map.

Recipe two: break up the main thread as a habit, not an incident response.

```ts
// Before: 400ms of synchronous state + DOM work on click
button.onclick = () => { applyFilters(); renderAll(); };

// After: yield so the press state paints first
button.onclick = async () => {
  button.setAttribute('aria-pressed', 'true');
  await scheduler.yield?.() ?? new Promise(r => setTimeout(r));
  applyFilters(); renderAll();
};
```

That pattern — *paint the acknowledgment, then do the work* — fixes more INP complaints than any framework migration. Beyond it: move non-urgent state updates into transitions (`useTransition` in React), virtualise lists past a few hundred rows, and audit hydration. The Northwind dashboard was hydrating seventeen interactive chart islands on load; we cut it to the four above the fold and hydrated the rest on intersection. INP at p75 dropped from 380ms to 140ms in the following month's CrUX data.

And the third-party question, which nobody wants asked: list every script's cost, in milliseconds of main-thread time on a real phone. Tag managers routinely own a third of the thread. Someone in marketing can remove the script that nobody has opened the dashboard for since 2023. Make them the hero of that story.

## CLS: reserve space or pay in trust

Almost all production CLS is one of: images without `width`/`height` (or `aspect-ratio`), ad/banner injection, late CSS, or webfont metric shifts. The fixes are boring and total: reserve the box for everything asynchronous; never inject content above existing content without a user's action; match fallback font metrics (`size-adjust`, `ascent-override`) if you must swap. A page that doesn't move under your thumb feels trustworthy — CLS is a UX metric that happens to also be an SEO metric.

## Budgets that survive sprints

A performance budget fails when it lives in a wiki. It survives when it's a code review comment written by a robot. Our standard lathe:

```json
{
  "budgets": [
    { "path": "/", "resourceSizes": [
      { "resourceType": "script", "budget": 170 },
      { "resourceType": "total", "budget": 700 }
    ]},
    { "path": "/", "timings": [
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "interactive", "budget": 3500 }
    ]}
  ]
}
```

Wire it into CI (Lighthouse CI, sitespeed.io, or bundlesize for the asset-level numbers) and — this is the part that makes it work — **give the budget an owner and an escalation path**. When a PR breaches, the options are explicit: justify, optimise, or pay down elsewhere with the owner's sign-off. A budget that blocks silently gets routed around within a sprint.

Set budgets against *user* targets, not aspiration: LCP 2.5s at p75 on a throttled connection is the bar, so the lab budget should run tighter (lab median ≈ 1.9s) to leave room for field reality. Revisit quarterly; a budget that never moves is either being ignored or you're not shipping anything.

## RUM on a shoestring

You don't need a five-figure observability contract on day one. The `web-vitals` library, a tiny beacon endpoint, and a dashboard you check every Monday covers 90% of the value:

```ts
import { onLCP, onINP, onCLS } from 'web-vitals';

const send = (m: Metric) =>
  navigator.sendBeacon('/vitals', JSON.stringify({
    name: m.name, value: m.value, rating: m.rating,
    path: location.pathname, attribution: JSON.stringify(m.attribution ?? {}),
  }));

onLCP(send); onINP(send); onCLS(send);
```

Segment by template and device class, track p75 weekly, and alert on regression rather than raw value — you want "PDP LCP moved 300ms since Tuesday", not a wall of numbers. When the program matures, graduate to a real RUM vendor for session replay and device granularity. But start sending beacons this week; the most expensive performance data is the month you didn't collect.

## The sprint rhythm that holds the line

Performance is a treadmill, so build the treadmill into the cadence: budgets enforced in CI; a five-minute vitals review in Monday standup (three numbers, one owner for anything red); one performance item per sprint, however small; and a quarterly budget re-baseline. When we hand over [website builds](/services/websites) or long-running [product engagements](/services/product), this rhythm is the deliverable that matters most — the fast site is a symptom of it.

## Key takeaways

- Identify the LCP element per template before optimising anything; then attack TTFB, discovery (`fetchpriority`, preload with restraint), and blockers (fonts, CSS) in that order.
- INP is a session-long metric — instrument interaction attribution in RUM and make "paint the acknowledgment, then do the work" a house pattern.
- CLS = reserve space, don't inject, match font metrics. Boring fixes, total payoff.
- Budgets survive only when robots enforce them in CI with a human owner and a quarterly re-baseline.
- Ship a `web-vitals` beacon this week; alert on regressions by template, not on raw numbers.

## FAQ

**Our Lighthouse score is 95 but CrUX says we fail. Which is right?**

CrUX is real users; Lighthouse is one synthetic phone on one connection. If field data fails, believe the field. Common causes: your users' devices and networks are worse than the lab's, third-party scripts vary by region and consent state, or your test navigates differently from actual sessions. Debug with RUM slices, not more lighthouse runs.

**Is INP really worse than FID?**

It's a stricter, fairer judge. FID measured only the delay of the *first* interaction, so a page could freeze on every subsequent click and pass. INP looks across the whole visit (reporting a high percentile), which means hydration bloat and long tasks can no longer hide. Treat it as the cost-of-framework-and-scripts report you've been avoiding.

**How tight should we set the lab budget versus the 2.5s field target?**

Run the lab about 20–25% under the field bar, because field p75 includes slower devices, real networks, and unlucky cache states. Verify the translation with a month of RUM data, then lock the CI budget to the lab number that keeps field p75 comfortably under threshold.

**What's the cheapest meaningful performance win on an existing site?**

In our audits, three recur: `fetchpriority="high"` on the true LCP image; subsetting and `font-display: swap` on display fonts; and deleting one dormant third-party script. Usually a day of work for a double-digit LCP improvement — the kind of result that funds the rest of the program, and the kind we cover in discovery on [growth engagements](/services/growth).
