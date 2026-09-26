---
title: "Edge rendering: an honest guide for content sites"
description: "What edge rendering actually buys a content site, what it quietly costs, and the decision framework we run before moving a single route to the edge."
slug: edge-rendering-honest-guide
cluster: engineering
tags:
  - performance
  - architecture
  - infrastructure
  - rendering
date: 2025-03-14
author: Tomás Reyes
keywords:
  - edge rendering
  - edge functions
  - ttfb optimization
  - cdn architecture
  - server-side rendering
readingTime: 9
heroImage: /images/articles/engineering/edge-rendering-honest-guide.jpg
heroAlt: "Engraved-style map of the Asia-Pacific on cream paper, with brass arcs and fern lines linking network nodes between Sydney, Auckland and Singapore."
---

Every few months a client asks us to "move everything to the edge". Sometimes they read a benchmark. Sometimes a vendor sold them a map with many dots on it. The question deserves better than hype in either direction, so here is the guide we wish someone had handed us in 2021: what edge rendering genuinely buys a content-heavy site, what it quietly costs, and how we decide.

First, a definition, because the industry uses the word loosely. Edge rendering means executing your rendering code — the function that turns a request into HTML — in a data centre geographically close to the visitor, rather than in one origin region. The edge is not magic. It is somebody else's server, closer to the beach.

## What the edge actually buys you

### 1. Time to first byte, where distance was the problem

Light through fibre is stubbornly physical. Sydney to a `us-east-1` origin is roughly 180–220ms of round-trip time before your server thinks about anything. Add TLS negotiation and you can easily burn 400ms before the first byte exists, and that is before your framework wakes up.

If your server-side render takes 120ms in the origin and 100ms at the edge, the edge wins for a Perth user by the network distance alone. On a site we audited for a fictional but representative publisher — call it a regional media group with readers across AU and NZ — moving a personalised homepage render from a single US origin to edge PoPs in Sydney, Melbourne and Auckland cut median TTFB from 610ms to 140ms for domestic users. Nothing else changed. Same code, same data, shorter wire.

That number matters because TTFB is the first domino in everything we track in our [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide). LCP cannot start until the document arrives.

### 2. Geo-aware personalisation without a client-side flash

If you need to vary content by location — pricing in local currency, region-specific promotions, compliance copy — doing it at the edge means the **first paint is already correct**. The alternative pattern (render generic HTML, then swap content client-side after a geolocation lookup) produces the layout shift and content flicker that users experience as "janky", and that ad-blockers occasionally eat entirely.

For an e-commerce client selling into AU, NZ and Singapore, edge-rendered currency and shipping promises removed a visible price-swap on every product page, and with it a measurable slice of checkout hesitation. (Figures on the concept site are illustrative; the pattern is very real.)

### 3. A/B routing and header-based experiments at the network layer

Edge functions are a clean place to do bucketing: read a cookie, decide a variant, either rewrite the request to a different cached page or render the variant directly. Because the decision happens before the cache key is computed, you avoid the classic client-side experiment flicker. We cover the measurement side of this in our piece on [designing CRO experiments you can believe](/journal/growth/cro-experiment-design); the edge is simply the most honest place to enforce the assignment.

### 4. Resilience through distribution

A single-region origin is a single point of failure with a nice SLA attached. Edge platforms replicate your function across dozens of PoPs by default. Regional outages stop being your outage. This is not a reason to adopt edge rendering, but it is a genuine dividend once you have.

## What the edge quietly costs

Now the other ledger, because these costs are real and rarely in the brochure.

**Cold starts are back on the menu.** Edge isolates start fast compared to containers, but "fast" is not "free". A function that imports a large ORM, a markdown pipeline, and a syntax highlighter can spend 80–200ms initializing on a cold isolate. Because edge platforms aggressively reap idle isolates, cold starts happen more often than with a warm origin server. Your p50 looks wonderful in the vendor dashboard; your p95 tells the truth.

**Your data is still far away.** This is the one that ends most edge dreams. HTML moves to the edge easily. Your Postgres does not. If every render needs three queries against a database in `ap-southeast-2`, your edge function in Auckland is making trans-Tasman round trips for data while saving round trips for the user. You have moved the latency, not removed it. The honest fixes are replicated/read-cached data layers, edge-native KV stores for genuinely hot data, or — most often — deciding that route did not need per-request rendering at all.

**Observability fragments.** Distributed functions across forty PoPs generate distributed logs across forty PoPs. Tracing a slow render across edge and origin requires deliberate instrumentation; the default tooling aggregates away exactly the tail you care about. Budget time for this. It is never in the estimate.

**Cache behaviour gets subtle.** Edge platforms layer their own caching between your code and the world, with per-platform rules about what is cacheable, how `Vary` is honoured, and what a purge actually guarantees. We have seen "we purged the cache" mean anything from 2 seconds to 4 minutes of staleness depending on the platform and the plan tier. Your [caching strategy](/journal/engineering/caching-strategy-content-sites) needs a new chapter the day you adopt edge rendering, not after the first stale-content incident.

**Vendor dialects.** Edge runtimes are mostly WinterCG-flavoured, but "mostly" carries weight. Node APIs you assumed existed may not. Packages that shell out to binaries do not run. The code is portable right up until it is not, and migration cost is a real line item.

## The decision framework we actually run

When a client asks about the edge, we walk five questions. They resolve most cases in an afternoon.

**1. What percentage of your audience is more than 100ms of network from your origin?** Pull the RUM data, not the vibes. If your traffic is 90% Sydney and your origin is in Sydney, the edge buys you almost nothing. A CDN in front of static assets (which you should have regardless) captures most of the win.

**2. Does the page truly render per-request?** The unglamorous truth: most content pages do not. A marketing page, an article, a product description — these change when a human publishes them, not when a visitor arrives. Static generation with [a disciplined invalidation strategy](/journal/engineering/caching-strategy-content-sites) serves them from the CDN with a TTFB the edge cannot beat, because there is no compute at all.

**3. Where does the render's data live?** Map every query the page makes. If the answer is "one region, far from users", the edge relocates your problem. If the answer is "a cacheable read model or a globally replicated store", the case strengthens.

**4. Do you need decision-making at request time?** Geolocation, experiment bucketing, auth-gated variants, header-driven personalisation. These are the edge's native habitat. If none apply, you are buying a faster render of a page that could have been static.

**5. Who operates it?** Edge platforms are operationally simple until they are not. A team without on-call maturity for distributed systems should weigh the observability tax honestly. Sometimes two well-cached regional origins beat forty PoPs nobody can debug.

The framework's output is usually a hybrid: static-first for content, edge rendering for the handful of routes that make per-request decisions, an origin API for anything data-heavy. The [headless commerce builds](/journal/ecommerce/headless-commerce-tradeoffs) we ship almost always land here — product and category pages static, cart and checkout edge-rendered, inventory through a cached read API.

## A fictional benchmark, honestly labelled

To make this concrete: we modelled a content site with 60k pages, traffic split 55% AU, 25% NZ, 20% Singapore, origin in Sydney. All numbers illustrative.

- **Origin-only SSR**: median TTFB 190ms (AU), 320ms (NZ), 430ms (SG).
- **Full edge render**: median 120ms everywhere — but p95 blew out to 900ms on cold isolates, and every page paid a 140ms database round trip back to Sydney.
- **Static-first + edge for 4 personalised routes**: median 35ms for cached content pages, 150ms for the edge-rendered routes, p95 under 400ms across the board. Operable by a two-person team.

The third option won on every axis we care about, and it is also the cheapest. That is not a coincidence. Removing compute beats relocating it.

## Key takeaways

- Edge rendering's core win is **network distance**: it shines when users are far from your origin and pages genuinely render per-request.
- The classic failure mode is rendering at the edge while your data sits in one region. Map the data before you move the HTML.
- Most content pages should not render per-request at all. Static-first with good invalidation beats edge on speed, cost and operability.
- Reserve the edge for request-time decisions: geo, experiments, auth variants. That is its native habitat.
- Cold starts and fragmented observability are real costs. Look at p95, not the vendor's p50.
- Decide with RUM data and a route-by-route audit, not with a map full of dots.

## FAQ

**Should our marketing site use edge rendering?**
Almost certainly not as the default. Marketing pages change on publish, not per-request, so static generation served from a CDN will beat edge compute on TTFB and cost. Use edge functions surgically — for geo-personalised pricing, experiment routing, or locale redirects — not for the whole site.

**What about edge rendering for SEO?**
Search engines care about fast, fully-rendered HTML, and both static generation and edge SSR deliver it. Edge rendering is not an SEO ranking factor in itself. If anything, static-first reduces the tail-latency risk that can hurt crawl efficiency on very large sites.

**How do we know if cold starts are hurting us?**
Instrument by warm/cold status — most edge platforms expose an invocation header or trace attribute you can log. Chart p50, p95 and p99 separately for cold and warm invocations. If cold p95 exceeds your TTFB budget, shrink the function's imports, split routes into smaller functions, or move the route back to a warm origin.

**Is vendor lock-in a real concern?**
Moderate. WinterCG-aligned runtimes have narrowed the gap, and frameworks like Remix and Astro abstract much of the platform surface. The stickier lock-in is operational: your purge scripts, your observability dashboards, your team's mental model. Plan for it as a switching cost, not an impossibility.

**Where should we start if we're curious?**
Pick one genuinely per-request route — a currency-aware pricing page is a classic — and move just that. Measure TTFB, cold-start rate and error rate for a fortnight against the origin version. Small bets, honest numbers. That is how we approach every architecture decision in [our engagement process](/approach), and it works here too.
