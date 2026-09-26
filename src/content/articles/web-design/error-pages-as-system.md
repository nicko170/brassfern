---
title: "Your error pages are a system: design them like one"
description: "404s, 500s, offline and maintenance states are one family with one voice. Design them together, give each a real recovery path, and log what users hit."
slug: error-pages-as-system
cluster: web-design
tags:
  - Error states
  - UX writing
  - Systems thinking
  - Resilience
date: 2025-11-06
author: Leonie Marsh
keywords:
  - 404 page design
  - error pages
  - empty states
  - error UX
readingTime: 9
---

Every site we audit has the same scar tissue: a beautifully art-directed homepage, a carefully tuned checkout, and then — when something breaks — whatever the framework, the CDN or the hosting platform happened to ship by default. A React "Something went wrong" with a stack-flavoured shrug. An Nginx 502 in unstyled Times. The CMS vendor's maintenance page in a language the client doesn't operate in. The visitor doesn't experience these as five different companies' accidents. They experience them as *your website, falling apart*.

The fix is to stop treating error pages as accidents and start treating them as a system: one family of failure states, designed together, voiced together, instrumented together. We've written before about [the 404 as a three-job rescue page](/journal/web-design/designing-404-pages), and about [empty, loading and error states as carriers of trust](/journal/web-design/empty-loading-error-states). This is the layer above both — the operating model.

## Start with a failure inventory

You cannot design a system you haven't enumerated. On a typical marketing site plus web application, the failure family includes at least:

- **404** — the URL doesn't resolve. Highest volume, lowest severity.
- **410 / retired content** — the page existed and was deliberately removed. Deserves a different sentence than a 404 ("we took this down" is more respectful than "this doesn't exist"), and often has a logical successor to link.
- **500-class server errors** — something broke on your side. The visitor did nothing wrong, and your infrastructure knows it.
- **Client-side crashes** — the app shell rendered, then a component threw. In React this is an error boundary's job, which our engineers cover in [error boundaries and graceful failure](/journal/engineering/error-boundaries-resilient-ui). Design's job is deciding what the boundary *shows*.
- **Offline / network loss** — increasingly common on mobile, detectable, and completely mishandled by most sites, which just lie there looking broken while the connection is the actual problem.
- **Maintenance mode** — the one failure you schedule! And yet most maintenance pages are still third-party defaults.
- **Form and transaction failures** — payment declined, session expired mid-form, validation errors. In-flow rather than full-page, but part of the same voice.

Write the inventory down in a single document. Every state gets: a trigger, a severity, a voice note, a recovery path, and an owner. That document is the system. The page designs are just its visible edge.

## One voice chart for the whole family

Failure states reveal whether a brand is a coat of paint or a load-bearing wall. The playful studio that turns cold and bureaucratic the moment a payment fails has told the customer which version was real.

The tool we use is a **severity ladder**: one voice, calibrated by consequence.

- **Low stakes (404, retired page):** personality is affordable. Be charming, briefly, after orienting and recovering the visitor. The dead end is mildly annoying at worst.
- **Medium stakes (form errors, declined payments):** warm, specific, useful. "Your card was declined — no charge was made. Try again or use a different card" not "Error 0x8004. Transaction unsuccessful." Own what happened, say what *didn't* happen (no charge, nothing lost), and give the next move.
- **High stakes (500s, crashes, anything involving money or health):** zero jokes. Plain status, an apology that names the failure, data-preservation honesty ("your form entries are saved in this browser"), and a human contact path. When we wrote the failure states for the [Pylon Health telehealth flow](/work/pylon-health-telehealth-flow), the rule was: someone reading this might be unwell and anxious. Every sentence was tested against that reader.

The ladder keeps you honest in both directions: it stops the writers being cute during a payment failure, and it stops the engineers' default severity (alarm) leaking into a harmless 404. Since our [voice guidelines](/services/brand-identity) now include a failure-states section, new states get voice-checked in design review instead of discovered in production at 2am.

## Every state gets a recovery path, or it's a dead end

The single structural rule of the whole system: **no state leaves the visitor stranded**. For each entry in the inventory, define the recovery before you write a word of copy.

- **404:** on-page search plus three to five curated links ordered by probability. The numbers on on-page search are dramatic — we covered the evidence in the [404 piece](/journal/web-design/designing-404-pages).
- **500 / crash boundary:** first, a retry — a remarkable share of server errors are transient, and a "Try again" button that actually re-requests costs an afternoon and recovers a real fraction of sessions. Second, a status page link if you run one. Third, a human channel for anything transaction-shaped.
- **Offline:** a polite explanation and automatic recovery. If the app can detect the network returning (the `online` event, or a health ping), restore state without making the user reload. If parts of the app are cached, say so — "You can still browse pages you've visited" turns a failure into a feature.
- **Maintenance:** when you'll be back, stated as a clock time with timezone, not "shortly". "We'll be back by 06:00 AEST" is a promise; "back soon!" is a shrug. And if the window passes, the page must update automatically — nothing corrodes trust like a maintenance page outliving the maintenance.
- **Session expiry mid-form:** the cruellest common failure. The recovery is preservation: keep what's been typed, say it's kept, and get them re-authenticated and back to the same field. Losing someone's data on an error page is the one sin users never forgive.

Notice the pattern: recovery is engineering and copywriting agreeing on a sentence. The copy can only promise what the build actually does, which is why this system only works when both disciplines sit in the same review.

## The plumbing: status codes, indexing, caches

A pretty error page with broken plumbing is set dressing. The technical checklist we run on every [website build](/services/websites):

1. **Real status codes.** 404s return 404, 500s return 500, maintenance returns 503 with a `Retry-After` header. A "soft 404" — an error page served with a 200 — pollutes search indexes and corrupts analytics. On statically prerendered sites this is cheap to get right; on SPA deployments it's wrong half the time we look.
2. **Noindex the failure family.** None of these pages belong in search results. `noindex` on the template, and check the CDN layer doesn't strip it.
3. **Cache behaviour.** Error pages must not be cached at the edge the way content is — a cached 500 that keeps serving after recovery is a self-inflicted outage. Our [caching layers piece](/journal/engineering/caching-strategy-content-sites) covers the discipline; error handlers get short or zero TTLs, explicitly.
4. **Weight.** An error page should be the lightest page on the site. No hero video, no hero fetch, no dependency on the API that might be the thing that's down. Inline critical CSS; keep it under a few dozen kilobytes. If the 500 page requires the same JavaScript bundle that just crashed, you have built a very stylish way to fail twice.

## Instrumentation: every error is a bug report with shoes on

Error pages without telemetry are decoration on a leak. The minimum log, per state, firing on view: the state code, the requested URL, the referrer, and a session identifier for recovery-rate maths. Then three habits:

- **Weekly volume review.** 404 volume is link-rot hygiene — the top twenty broken URLs are usually most of the traffic, and the fixes are drearily mechanical. 500 volume is platform health. A maintenance page that *keeps getting traffic* is telling you your communications missed someone.
- **Recovery rate by state.** What share of sessions that hit each state continue to a meaningful page within, say, five seconds? This is the design KPI. It turns "is our 404 good?" into a number with a trend line.
- **Replay the worst paths.** For application crashes, session replay (or at minimum component-path logging in the boundary) converts "users saw Something Went Wrong" into a stack of reproducible bugs. Every crash report that reaches the tracker with steps attached is a gift; design the boundary to write it.

And assign an owner. Systems decay when they're everyone's job. One named person reviews the error-state dashboard monthly and can spend a day a quarter fixing what it shows. That's the whole maintenance loop, and it's the difference between a designed system and a set of pages that were nice once.

## A note on error theatre

A trend worth resisting: the error page as entertainment product. Full-screen games, elaborate animations, witty illustrations custom-commissioned for the 500 page. Someone is having the worst moment your site can offer, and you've responded with a theme park.

Charm scales with stakes, always. Keep the recovery fast, the page light, and the personality proportionate — one good sentence, not a carnival. The goal of the whole system is that visitors barely remember the failure and definitely remember that getting out of it was easy. When we demo error states on Fridays alongside the happy paths — as our [approach](/approach) commits us to — that's the standard we demo them against.

## Key takeaways

- Error pages are a system. Start with a written failure inventory: every state gets a trigger, severity, voice note, recovery path and owner.
- Write from a severity ladder: one brand voice, calibrated from playful-at-no-stakes to plain-and-warm at high stakes. Never joke during money or health failures.
- No state may strand the visitor. Define the recovery first; the copy can only promise what the build does.
- Get the plumbing right: real status codes, noindex, no edge-caching of errors, and error pages light enough to render when everything else is down.
- Fire an analytics event on every state; review volume weekly and recovery rate monthly; assign a named owner.
- Skip the error theatre. The best failure experience is the one nobody remembers.

## Frequently asked questions

**Do small sites really need the full inventory?**
They need a smaller one, not a skipped one. A marketing site has 404, 500 via the host, offline, and form errors at minimum — four states you can design and write in a day. The system thinking matters more than the page count: one voice, one recovery rule, one place where it's all written down.

**Should error pages match our brand or be deliberately plain?**
Match the brand — same type, same palette, same chrome — because deviating reads as "the site broke and a different page loaded", which discredits the recovery. Plainness belongs in the *copy* at high severities, not in the design system.

**What should an error boundary show in a React app?**
Three things: a plain statement that something went wrong and it's not the visitor's fault, a retry action that re-mounts the failed subtree, and a fallback path (home, or a human channel for transactional flows). If your boundary swallows the error silently and shows a spinner forever, that's worse than a crash — a crash at least admits what happened.

**How often should we revisit the system?**
Review the telemetry monthly, the pages quarterly, and the whole inventory after any platform change — new host, new framework, new payment provider. Error states are where platform migrations show up first, usually reported by a stranger on social media before your own monitoring notices.
