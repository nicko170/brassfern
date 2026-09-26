---
title: "The caching layers cake: HTTP, ISR and the discipline of invalidation"
description: "A layered caching model for content-heavy sites — CDN, full-page, data and application caches — plus the purge-on-publish pattern that ends 3am incidents."
slug: caching-strategy-content-sites
cluster: engineering
tags:
  - caching
  - performance
  - architecture
  - cms
date: 2025-06-20
author: Felix Brandt
keywords:
  - web caching strategy
  - http caching
  - isr nextjs
  - cache invalidation
  - cdn caching
readingTime: 9
---

There are two hard problems in computer science, the old joke goes: cache invalidation, naming things, and off-by-one errors. The joke survives because invalidation genuinely is hard — not intellectually, but operationally. Every layer of cache you add is a promise that something, somewhere, will expire correctly under pressure. Most caching incidents we get called in to fix are not exotic. They are a promo price that lingered four hours past midnight, or an embargoed article visible to anyone with a URL.

This is the mental model we use when designing caching for content-heavy sites — marketing sites, editorial platforms, large e-commerce catalogues. It has kept our clients' pages fast and their on-call engineers asleep.

## Think in layers, not switches

A content site usually has four distinct caching layers. Teams get into trouble when they treat caching as one switch rather than four separate contracts.

**Layer 1: the browser cache.** Controlled by your response headers. Private, per-user, excellent for assets, dangerous for HTML you cannot unpublish.

**Layer 2: the CDN or shared HTTP cache.** The cheapest compute in your stack: serving a cached page costs milliseconds and cents. This is where static assets, images and public HTML should live for the giant majority of traffic.

**Layer 3: the application render cache.** Full-page caching inside the framework — ISR in Next.js, route caches elsewhere — plus fragment caching of expensive components. This layer absorbs traffic when the CDN has to revalidate.

**Layer 4: the data cache.** Cached query results, ORM-level caches, a read model in Redis or an edge KV. This protects your database when the layers above it miss.

The discipline is giving each layer an explicit **time-to-live and invalidation story**. "We cache it" is not a strategy. "The CDN holds HTML for 5 minutes, revalidates in the background for an hour, and purges on publish webhooks" is a strategy.

## The header vocabulary worth memorising

Most caching behaviour is controlled by a handful of headers, and most bugs come from two of them being misunderstood.

- `Cache-Control: public, max-age=31536000, immutable` — for fingerprinted static assets (the filename contains a content hash). The browser and CDN may keep it forever, because a change means a new URL. This one directive, applied correctly, does more for repeat-visit speed than any framework choice.
- `Cache-Control: public, max-age=0, must-revalidate` — "you may cache this, but ask every time". Combined with `ETag`, the follow-up request is cheap (304 responses carry no body). Good for HTML that changes unpredictably.
- `stale-while-revalidate=SECONDS` — serve the stale copy instantly while fetching a fresh one in the background. The single kindest header for content sites: visitors never wait for a re-render.
- `stale-if-error=SECONDS` — serve the stale copy if the origin is down. This quietly turns origin outages into non-events for cached pages.
- `Vary` — declares which request headers produce different responses. Respect it like a loaded instrument. `Vary: Cookie` on a public page effectively disables shared caching, and we have seen exactly that line turn a healthy CDN hit ratio into 4%.

Set them deliberately at the route level, audit them with curl on staging, and put an assertion in your [launch-week checklist](/journal/playbooks/launch-week-checklist). Headers drift silently; tests do not.

## The invalidation patterns, ranked by sleep quality

Not all invalidation strategies are equal. Here is how we rank them for content work.

**1. Purge-on-publish (event-driven).** The CMS fires a webhook when content changes; your invalidation layer purges exactly the affected URLs from the CDN and marks the route for re-render. This is the gold standard: published changes appear in seconds, everything else stays cached indefinitely. It requires mapping content → URLs, which is the actual work. An article affects its own page, its tag pages, the cluster index, the RSS feed and possibly the homepage — we keep an explicit dependency map per content type, generated alongside the routes.

**2. TTL with background revalidation.** Cache for N minutes, serve stale while revalidating. Zero webhook plumbing, bounded staleness, excellent resilience. Costs a little freshness and a little extra origin traffic. For content where "a few minutes stale" is fine — most marketing and editorial content — this is often the right pragmatic choice, and it pairs naturally with the `stale-while-revalidate` header.

**3. Time-based purges.** Nightly cache clears, hourly rebuilds. Simple to reason about, terrible in every incident scenario: the urgent typo fix now waits forty minutes. Acceptable only as a safety net beneath event-driven purging.

**4. Manual purging.** A button someone presses. Someone is on holiday the day it matters. Manual purges are a fine backup escape hatch and a terrible primary mechanism.

**5. No invalidation because nothing is cached.** Also known as "the origin falls over during the product launch". Not a strategy.

Our default recipe for a content build: fingerprinted assets cached immutably, HTML cached at the CDN with a short TTL plus `stale-while-revalidate`, event-driven purges from the CMS for critical content types, and `stale-if-error` as the disaster blanket. That combination featured heavily in the rebuilds behind our [Holloway Records label site](/work/holloway-records-label-site) — a catalogue that changes on release Fridays and needs to survive the traffic spike when one does.

## ISR and friends: what "incremental" actually means

Incremental Static Regeneration deserves a straight explanation because the marketing around it is foggy. ISR is a full-page cache with a TTL, managed by the framework: the first request after expiry triggers a regeneration, and subsequent requests get the fresh copy. On-demand ISR adds an API to invalidate specific paths — which is purge-on-publish with framework plumbing.

The gotchas we see in the wild:

- **Stampedes on expiry.** At TTL expiry, many concurrent requests can each trigger a regeneration. Most platforms dedupe this now; verify yours does before you point a high-traffic route at a short TTL.
- **Inconsistent pages during rollout.** A purged article page may reference listing pages that have not regenerated yet. For tightly-coupled page sets (article + listing + feed), purge them as a group.
- **"Static" pages that secretly are not.** Any per-request header read — a cookie check, a geo lookup — can opt a route out of static caching entirely depending on the platform. This is where decisions about [where rendering happens](/journal/engineering/edge-rendering-honest-guide) intersect with caching: a single misplaced `cookies()` call can silently demolish your hit ratio. Grep for them in code review.

The broader principle: **know your cache hit ratio per route class** and alert on its slope, not just its value. A hit ratio sliding from 96% to 91% over a fortnight is a slow leak — usually a new query parameter or header entering the cache key — and it will present as "the site feels heavier this month".

## The operational discipline

Caching failures are operational failures wearing a technical costume. Three habits prevent nearly all of ours:

**Write the invalidation map before building the feature.** When we model a new content type, the schema review includes the question "what URLs does this touch?". If nobody can answer, the content model is not finished. This is the same boundary-thinking we apply to [type-safe CMS contracts](/journal/engineering/type-safe-cms-content) — content has consequences at the edges of the system.

**Test staleness like you test correctness.** Our browser suites include one unglamorous test: publish a draft change in a staging CMS, assert the change appears on the staging site within the promised freshness window. It catches webhook misconfigurations that no unit test will ever see. Suites like this are why we obsess over [browser tests that test intent](/journal/engineering/playwright-testing-that-lasts).

**Run the 3am drill once a quarter.** Someone purges production HTML by mistake (on staging, deliberately). Can you warm the cache? How long until the origin is overwhelmed? The drill is thirty minutes and changes how everyone writes `Cache-Control` headers forever.

## A note on personalised content

Caching and personalisation pull in opposite directions, and the graceful resolution is to **split the page, not the strategy**. Cache the anonymous shell aggressively; personalise through edge-side includes, client-side islands, or a small number of cached variants keyed on a segment cookie. The failure mode is `Vary: Cookie` on everything, which is not personalisation — it is just no caching with extra steps.

## Key takeaways

- Treat caching as four layered contracts — browser, CDN, render, data — each with an explicit TTL and invalidation story.
- Learn five headers deeply: `immutable` assets of everything, `stale-while-revalidate` for kindness, beware `Vary`.
- Purge-on-publish is the gold standard; TTL with background revalidation is the pragmatic default; everything else is a fallback.
- ISR is a full-page cache with a TTL. Understand its stampede, consistency and secret-dynamic pitfalls before trusting it.
- Measure hit ratio per route class and alert on the slope. Slow leaks present as "the site feels heavy".
- Test freshness in your browser suite and drill the accidental purge. Caching is operations.

## FAQ

**Should HTML ever be cached in the browser?**
Yes, carefully — with short `max-age` values and `must-revalidate`, or via the CDN alone with `s-maxage` so browsers revalidate while the shared cache serves stale-but-fast. Long-lived browser HTML caching is risky because you cannot unpublish what is sitting on someone's laptop.

**What hit ratio should we aim for?**
For a content-heavy site with purge-on-publish, 90%+ at the CDN is healthy; editorial sites often reach 97%. More important than the number is the trend and your ability to explain it per route class. A site at 99% may be under-personalised; a site at 60% is almost certainly leaking its cache key.

**Is Redis necessary for a content site?**
Usually not as a starting point. HTTP-layer caching plus a well-indexed database covers most content workloads. Add a data cache when you have measured query load that HTTP caching cannot absorb — typically expensive aggregations or API fan-out — not because the diagram looked thin.

**How do we cache authenticated pages?**
Split public and private deliberately. Public shells get the full treatment above. Authenticated HTML gets private, short-lived caching or none; the performance win for apps comes from caching the *data* layer (which is per-user safe with correct keys) and from fast APIs, not from caching private HTML at shared layers. Never let a private response be marked `public`.

**What is the cheapest first step for a slow legacy site?**
Put a CDN in front of it with `stale-while-revalidate` and `stale-if-error`, cache static assets immutably, and set a 5-minute HTML TTL. An afternoon of work, often a 5–10x TTFB improvement, and it buys you the calm to design proper invalidation next.
