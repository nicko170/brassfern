---
title: "Streaming SSR: practical notes from shipping it"
description: "Streaming SSR in practice: what actually streams, where Suspense boundaries help or hurt TTFB, hydration ordering, mid-stream errors, and how to measure it."
slug: ssr-streaming-practical-notes
cluster: engineering
tags: [react, ssr, performance, suspense, architecture]
date: 2026-01-22
author: Tomás Reyes
keywords: [streaming ssr, react suspense server, ttfb optimisation, ssr performance, react streaming, web performance]
readingTime: 11
---

Streaming server rendering has one of the best marketing pitches in web performance — "send the page in chunks as it's ready, don't wait for the slowest query" — and one of the worst documentation-to-gotchas ratios. We've shipped it on production sites with real traffic, real ad scripts, and real SEO obligations, and the honest summary is: streaming is genuinely transformative for exactly one class of page, mildly useful for most, and actively harmful for a few it should never touch.

These are the notes we wish we'd had. Trace numbers below are from a content-heavy publishing rebuild (numbers rounded, illustrative and anonymised, but the shape is faithful), with the same patterns we've since applied to commerce and booking work like the [Sundial Travel itinerary flow](/work/sundial-travel-booking).

## What streaming actually buys you

In a classic SSR request, the server renders the entire React tree — meaning it waits on the *slowest* data fetch anywhere on the page — then sends the document in one go. Time to first byte is therefore `max(all data fetches) + render`. First contentful paint trails behind it.

With streaming (`renderToPipeableStream`, or a framework equivalent), the server sends the shell immediately and streams in Suspense-wrapped sections as their data resolves, along with inline scripts that swap each resolved boundary into place. TTFB becomes `shell render` — typically tens of milliseconds. FCP happens while your slow widgets are still fetching.

The critical nuance: **streaming doesn't make anything faster. It makes waiting visible earlier.** The total time until the last chunk arrives is unchanged (slightly worse, actually — chunk overhead and swapped-in HTML cost bytes). What improves is the *experience of time*: the user sees nav, hero, and layout while the slow stuff resolves, and [perceived performance](/journal/web-design/motion-that-earns-its-keep) is the metric users actually grade you on.

## Where boundaries help — and where they hurt

A Suspense boundary is a seam across which the server can say "this part later." Placement is the entire craft. Our rules after shipping it in anger:

**Boundary around slow, non-critical content.** The recommendations rail, the comments, the personalisation widget, the "people also bought." Slow query, irrelevant to the page's core promise. Classic win. On the publishing rebuild, moving the related-stories rail (a 480ms p95 query) behind a boundary dropped effective TTFB from 540ms to 70ms and moved FCP from 2.1s to 1.2s on 4G Moto-class profiles.

**Never boundary the LCP element.** If the hero image or headline is inside a Suspense boundary, streaming *delays* it — the browser can't start the fetch until the chunk arrives and the swap script runs. This is the single most common streaming self-own, and it's vicious because lab TTFB looks brilliant while LCP quietly regresses. Boundary below the fold, not above it. Our [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide) has the LCP-element archaeology to check.

**Never boundary anything that affects layout above it without a sized placeholder.** A streamed section that pushes content down is a CLS generator. Skeletons aren't decoration here; they're layout reservations with exact dimensions.

**Boundaries have a cost — treat them as a budget.** Every boundary adds a swap script (a few hundred bytes, minuscule but real) and a potential re-layout moment. Four to eight deliberate boundaries per page is our working range. Boundary-everything produces a page that appears fast but shimmers and shifts like a heat mirage on a slow connection.

## The gotcha giardino: headers, errors, and SEO

**Headers must be sent before the stream starts.** Obvious until it isn't: at stream time you're committed to your status code and headers. `Cache-Control` decisions, cookies, redirects based on data *inside* a boundary — all impossible. Move auth and redirect logic above the first byte (middleware or loader level, before render), and accept that a streamed 200 can still contain a client-side error state. Teams used to "render fails → send 500" need to redesign their error taxonomy: shell success, boundary failure, handled gracefully, is a valid response.

**Errors mid-stream need a story per boundary.** When a boundary's data fetch rejects *after* headers went out, React renders the nearest error boundary and streams the swap to display it. That means every streamed boundary needs a designed fallback for the failure case — not "Something went wrong" white-text-on-white but a considered empty state (`Related stories unavailable right now`), or the reserved placeholder space being released in a way that doesn't shove the layout around. Decide it per boundary in the design phase, not the incident review.

**SEO: crawlers get the full page — mostly.** Googlebot executes JavaScript and waits for streamed content, and in our measurements fully-streamed pages index correctly. *Mostly* doing heavy lifting there: we've seen delayed-indexing behaviour on pages where critical content (prices, availability) sat behind a boundary and the stream took 4+ seconds to complete. The rule we now apply: anything a crawler or a price-comparison bot must see without executing JS ships in the shell or in the first chunks. If legal must see it, or Google Shopping must see it, don't stream it.

**Third-party scripts and `streaming` don't mix carelessly.** Chat widgets and ad slots that scan the DOM at `DOMContentLoaded` can miss streamed content entirely, or worse, initialise twice when swap scripts mutate the tree. We namespace-init third parties on a `load`-plus-idle callback and make them idempotent. Test with network throttling on; the race only exists on slow connections, so fast lab machines are blind to it.

## Hydration: the streamed half of the story

Hydration runs alongside streaming, boundary by boundary — React can hydrate the shell while later chunks are still arriving, and even hydrate in response to user interaction priority. Two consequences matter in practice.

First, **the shell must be interactively cheap.** If your header nav requires a 300KB client chunk to hydrate, users can *see* the page at 1.2s and *use* it at 4s, and they'll experience that as broken, not fast. We treat shell interactivity like an [islands](/journal/engineering/islands-architecture-when) problem: hydrate the critical controls early, leave the streamed content non-interactive until its turn.

Second, **selective hydration is a genuine superpower and a mild hazard.** React prioritising hydration of whatever the user is interacting with is brilliant — unless a streamed-in boundary *replaces* the DOM node the user is mid-tap on. It happens on very slow connections with eager tapper behaviour, and shows up in Sentry as mysterious "unable to find node" hydration errors. The mitigation is boring: put boundaries where users don't tap within the first second (below-fold, secondary content) and keep swap targets stable.

## Measuring whether streaming actually helped

The trap is celebrating TTFB. A streamed page with 70ms TTFB and identical LCP bought you very little. Our measurement checklist before we call a streaming migration a win:

- **TTFB and FCP**, field data, by connection cohort — the improvement should concentrate in slow-network segments. If only your office WiFi improved, you built a demo.
- **LCP regression check** — flat or better, or you boundary-wrapped something you shouldn't have.
- **INP in the first two seconds** of the session — hydration during interaction can degrade early-session INP; we watch the p75 of interactions starting before 2s specifically.
- **Time to last chunk** — expect it to go slightly *up*; if it goes up a lot, your boundary fallbacks may be serialising fetches that used to be parallel.
- **Crawler render check** — fetch-and-render in Search Console before and after, on a template you care about.

On the publishing project, the honest scorecard was: FCP −42% on slow cohorts, LCP flat, engagement-time-on-article up 11% (people meeting content sooner), and one full week spent untangling a consent manager that DOM-scanned at the wrong moment. Net: worth it. Net for a small marketing site where the slowest query is 40ms: emphatically not worth it — complexity is real and [RSC-style architectures](/journal/engineering/react-server-components-tradeoffs) compound it.

## When not to stream

Short list, strong opinions. Don't stream when the page is one fast query and a static shell (you're adding chunk overhead to save nothing). Don't stream when every section is equally critical (dashboards where the first thing users want is the slow widget — parallelise the data and take the buffered hit instead). And don't stream to fix a slow query you haven't profiled. Streaming is how you present latency honestly, not how you remove it. Profile first; some of our best "streaming migrations" were deleting a boundary after making the query fast enough to not need it — cheaper, simpler, better.

## Key takeaways

- Streaming buys earlier visibility, not less total time. It's a perceived-performance tool — measure it like one.
- Boundaries go around slow, non-critical, below-fold content. Never the LCP element, never above-fold layout shifters without sized placeholders. Four to eight per page.
- Headers, status codes, and redirects are decided before the first byte; mid-stream errors need a designed fallback per boundary.
- SEO: content crawlers must see without JS belongs in the shell or earliest chunks.
- Shell hydration must be cheap, or you've built a page that's visible and broken.
- Measure FCP in slow cohorts, LCP flatness, early-session INP, and time-to-last-chunk — never TTFB alone.
- Sometimes the right answer is not to stream: fix the query.

## FAQ

**Do I need React Server Components to stream on the server?**
No. Streaming SSR with `renderToPipeableStream` and Suspense predates and doesn't require RSC. RSC changes *what* renders on the server (components can stay server-only), streaming changes *when* bytes leave it. They compose well but solve different problems; the [RSC trade-offs piece](/journal/engineering/react-server-components-tradeoffs) covers that half.

**Will streaming help our Core Web Vitals score?**
Indirectly. FCP improves, INP can improve if hydration is spread out, LCP should be flat (if it isn't, you did it wrong). Google's thresholds care about field data from real users, which is exactly where streaming shows up — slow devices, slow networks. But if your vitals problem is a 900KB bundle or an unoptimised hero image, fix those first; streaming doesn't touch them.

**What about Next.js / Remix / others?**
Both majors support streaming natively (Next via Suspense in app router at the page or component level; Remix via `defer` at the loader level, which streams deferred loader data). The boundary-placement and gotcha rules in this article apply unchanged; what differs is the ergonomics of where data is declared. Framework choice is far less important than boundary discipline.

**How do we test streamed behaviour locally?**
Throttle. Chrome DevTools' network throttling plus a CPU throttle (4× slowdown approximates a mid-range phone) makes streamed boundaries, swap timing and hydration races visible. We also run the slow-cohort journeys in [our Playwright setup](/journal/engineering/testing-strategy-that-scales) with throttling enabled, asserting that shell content is visible before a sentinel streamed block appears.

**Can we stream parts of e-commerce pages safely?**
Yes, with one hard rule: price, availability, and add-to-cart never stream. Personalisation, reviews, recommendations — perfect candidates, and we've done exactly that on storefront work. Our [websites practice](/services/websites) scopes the boundary map as part of the performance architecture in the first sprint, before a line of streaming code is written.
