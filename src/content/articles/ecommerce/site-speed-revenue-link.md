---
title: "Site speed is a merchandising decision"
description: "Milliseconds are margin. How to attribute revenue to performance honestly, where to spend speed budget on commerce templates, and how to make the case."
slug: site-speed-revenue-link
cluster: ecommerce
tags: [ecommerce performance, web vitals, conversion rate, performance budgets, revenue attribution]
date: 2025-10-07
author: Nate Sullivan
keywords: [ecommerce performance, site speed conversion, web vitals ecommerce, performance roi]
readingTime: 8
heroImage: /images/articles/ecommerce/site-speed-revenue-link.jpg
heroAlt: "Overhead flat lay on warm cream paper: a brass stopwatch beside kraft-paper parcels tied with dark green twine, a brass ruler and a small potted fern, soft window light and generous negative space."
---

Ask a merchandiser where the bestsellers should sit and you'll get a data-backed answer in seconds: eye level, end caps, first scroll position. Ask the same team where the storefront's speed budget is spent and you'll get a shrug. Yet the two questions are the same question. Speed determines what shoppers actually see — a product page that renders in four seconds on a mid-range phone is a shelf the customer never reaches. Performance isn't an engineering nicety bolted onto commerce. It *is* merchandising: the allocation of the milliseconds that decide whether anyone sees the merchandise.

So let's talk about it commercially: how to connect speed to revenue honestly, where the money is best spent per template, and how engineers can make the case in the language the CFO speaks.

## Don't borrow someone else's statistics

Every performance pitch deck cites the same circulating figures — "100ms costs 1% of revenue" — sourced from studies conducted on sites nothing like yours, a decade ago. Using them is tempting and wrong. If your CFO later discovers the number came from a 2010 big-box retailer, you've burned the credibility you needed for the next three infrastructure arguments.

The honest attribution model has three layers, and you can build all of them in a quarter:

**RUM correlation.** Real-user monitoring — field data, not lab tests — segmented by experience: conversion rate and revenue per session for sessions with good LCP versus poor LCP, split by template and device. This is correlational, so say so. It still anchors the conversation in *your* shoppers, and it's usually dramatic: on commerce sites we audit, sessions with poor LCP routinely convert at half to two-thirds the rate of fast sessions. On our [Fernleigh Wines storefront build](/work/fernleigh-wines-dtc-storefront), the gap between fast and slow PDP sessions (illustrative figures, as with everything on this concept site) was the single most persuasive slide in the post-launch review.

**Synthetic guardrails.** Lab tests (Lighthouse, WebPageTest) on a fixed device and throttled connection, run in CI against every release. These don't measure revenue; they prevent regression, which is how most of the revenue is actually protected. Performance is lost in a hundred small commits, not one big one.

**Occasional controlled proof.** Where traffic allows, the gold standard is a controlled experiment — serve a materially faster variant to a share of traffic and measure the delta. Expensive, rare, and worth doing once: one genuine A/B result on your own site ends the "but is it causal?" debate permanently. Until then, present correlation *as* correlation with the causal reasoning laid out, the same honesty we apply to [attribution modelling generally](/journal/growth/attribution-models-honest).

## Where the speed budget actually goes on commerce templates

Commerce sites have distinct performance economies per template. Spending evenly is wasting money; spend where the shopper's intent is hottest and the payload is heaviest.

**The PDP — spend the most here.** This is [the page that pays for everything](/journal/ecommerce/pdp-design-conversion), and its LCP is almost always the hero image. The fixes are unglamorous and decisive: serve the genuinely optimal size and format per viewport (AVIF/WebP, correctly sized `srcset` — our [image pipeline guide](/journal/engineering/image-pipeline-modern-web) is the how-to), preload the hero, and resist embedding autoplay video above the fold no matter how beautiful it is. A PDP hero that paints in under 1.8 seconds on a real phone outsells a cinematic one that paints in four.

**The PLP — win on interaction, not just paint.** Category pages live or die on INP: filtering, sorting, and pagination on a grid of sixty products. Client-side filtering of a large catalogue without virtualization is the classic offender — every keystroke re-renders the shelf. Window the grid, defer below-fold imagery, and keep sort interactions under 100ms.

**The checkout — subtract, don't add.** Checkout slowness is usually third-party slowness: tag managers firing forty pixels, A/B tools, chat widgets, fraud scripts, all stacked on the page where hesitation is deadliest. Audit ruthlessly — the [checkout friction audit](/journal/ecommerce/checkout-friction-audit) is the checklist — move non-essential tags off checkout entirely, and load what's left asynchronously with timeouts. Every script on checkout should have a named owner and a revenue justification.

**The cart drawer — the sneaky one.** Slide-out carts often recompute totals, re-fetch recommendations and re-render on every open. Cache prices, skeleton the drawer instantly, and let recommendations lag a frame. The cart is a negotiation, and negotiations die in silence while a spinner turns.

**Global — the fonts and the framework.** Self-hosted, subset fonts with a designed fallback; JavaScript budgets enforced in CI. The full discipline is in our [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide) — the commerce-specific summary is: a heavy framework tax is paid on *every* template, so it's the first thing to scrutinise on a rebuild and the hardest to fix after one.

## The business case template that works

Engineers lose speed arguments because they argue engineering: "our LCP is 3.4s" means nothing to someone planning margin. The case that gets funded has four numbers:

1. **Revenue at stake.** Sessions × poor-experience share × conversion gap, in dollars per month. From your own RUM data, labelled as an estimate with the reasoning visible.
2. **The cost of the fix.** Actual engineering weeks, honestly scoped. Speed work is usually shockingly cheap relative to paid acquisition doing the same job.
3. **The comparison that lands.** The same money spent on ads: how many sessions does that buy, at what conversion uplift? Performance routinely wins this comparison by an order of magnitude because it compounds — a faster site converts *all* traffic better, forever, including the traffic you're already paying for.
4. **The guardrail.** A performance budget enforced in CI so the gain doesn't evaporate over the next six months of marketing requests. This turns a one-off project into an asset.

One sentence that never fails: "We're paying for traffic we're rendering too slowly to convert." Framing speed as wasted acquisition spend — instead of technical debt — moves it from the engineering budget to the growth budget, where it belongs.

## What to stop doing

Three habits to kill: chasing Lighthouse scores as the goal (the score is a proxy; the field data is the truth); optimising the homepage while the PDP ships a 4MB hero (traffic-weight your effort — homepages on commerce sites are usually a minority of revenue landings); and treating performance as a launch milestone instead of a standing merchandise decision reviewed alongside category margins. The stores that win treat milliseconds like floor space: finite, valuable, and allocated on purpose.

## Key takeaways

- Site speed decides which shelves shoppers reach. Treat the performance budget as a merchandising allocation, not an engineering aesthetic.
- Build attribution from your own data: RUM correlation by template and device, CI guardrails, and one controlled experiment where traffic allows.
- Spend by template: PDP hero LCP first, PLP interaction responsiveness second, checkout third-party subtraction always.
- Make the case in four numbers: revenue at stake, fix cost, the paid-media comparison, and a CI-enforced budget to keep the gain.
- Kill score-chasing, homepage bias, and launch-milestone thinking. Milliseconds are floor space.

## FAQ

**What's a realistic conversion uplift from speed work?**
It varies wildly by baseline — a 5-second PDP has far more headroom than a 2.5-second one. Estimate from your own RUM segments, present the reasoning, and under-promise. Honest ranges survive contact with finance; borrowed statistics don't.

**Lab scores or field data — which do executives see?**
Field data, plotted as a trend, translated into revenue terms. Lab scores belong in engineering dashboards and CI gates where they catch regressions before they ship.

**Should we rebuild or optimise in place?**
Audit first. Third-party bloat and image pipelines fix in place cheaply; a fundamentally heavy framework or render architecture often doesn't. If the framework tax dominates every template, a rebuild — or a [headless re-architecture](/journal/ecommerce/headless-commerce-tradeoffs) with honest trade-offs — may be the cheaper two-year path.

**How do we stop marketing scripts from eroding the gains?**
Give the checkout and PDP a tags policy: named owner per script, revenue justification, CI budget enforcement. Marketing gets a fast-track review for new tags, not a veto-free deploy pipe. Friction on scripts is the point.

**Where does speed sit against conversion copy and design?**
Upstream. The best PDP copy in the world loses to a page that renders four seconds late on a bus. Speed is the admission fee; persuasion happens after the door opens.

*Performance-first builds are standard in our [e-commerce engagements](/services/ecommerce) — margins included in the definition of done.*
