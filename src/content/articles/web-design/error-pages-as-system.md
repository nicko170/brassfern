---
title: "Your error pages are a system: design them like one"
description: "The 404 gets the personality budget while 500s, offline and maintenance states ship as raw server output. Error pages are one designed system — build that instead."
slug: error-pages-as-system
cluster: web-design
tags: [error pages, ux writing, design systems, reliability, brand voice]
date: 2026-05-21
author: Leonie Marsh
keywords: [error page design system, 500 error page, maintenance page design, offline page ux, error handling copy]
readingTime: 10
---

I've written before about [the 404 as a tiny rescue mission](/journal/web-design/designing-404-pages): orient, recover, charm. That piece is about craft on a single, lovable surface. This piece is about what I keep finding in audits after the 404 has won its little design award — a fan-out of every other failure state shipped as raw server output: a 500 page in default Nginx typography, an "offline" banner from a dependency's README, a maintenance page from 2019 that says the site will be back "shortly", a JS-boot-failed white screen with the console doing all the talking.

Errors are not independent pages. From the user's seat, they are one experience — "the site is not working, variously" — and the design response should be one system: one voice, one visual family, graduated severity, shared infrastructure. Teams treat them as edge cases because each is individually rare; collectively, on any decent-traffic site, they touch thousands of sessions a month. This is how we systematise them.

## The ladder of severity

The system starts by acknowledging that errors differ morally. A 404 is frequently *our* fault but *your* inconvenience, recoverable by navigation. A 500 is our fault and your blocked task. A maintenance window is announced failure, planned. Outage-adjacent states (third-party auth down) are someone else's fault but our problem. The ladder runs: **inconvenience → interruption → outage**, and tone, visual weight and promised information should move along it.

- **404 / 410 (inconvenience):** light voice, fast recovery, personality affordable. See the 404 piece; charm survives here.
- **Capture-form failures, JS-boot failure (interruption):** the page loaded but is broken; voice turns plain, recovery by reload/retry, minimal art, and every asset the error page needs must be *inline or first-party* — an error page whose CSS is on the failing CDN is a card-castle punchline.
- **500 / 503 (outage):** zero personality budget. Apologise in one clause, state what's known, give a status path and a timeframe-honest expectation. The humour evaporates the moment someone's work is blocked; we've never once been wrong to be boring on a 500.
- **Planned maintenance:** the only error page you can A/B-test the apology on, and the one where pre-announcement does most of the work — banners *before* the window, progress *during*, and a page that still tells the truth if the window overruns.

The design implication: a single base template (one brand stain, one voice) with three severity skins. Not four bespoke pages designed by four people in four years of incidents.

## The shared infrastructure that makes it a system

This is the engineering half, and it's where "system" stops being a metaphor:

**1. Error pages are pre-rendered static artefacts.** The 500 page cannot be rendered by the thing that just 500'd. We ship error pages as static HTML files, deployable separately from app code — sitting at the edge/CDN layer, servable when the origin is dead. The 404 template can live in the app; the 500 and maintenance templates must not.

**2. Every error page is dependency-audited.** Fonts, CSS, any inline imagery — bundled or inlined. Audit with devtools network throttling *and* with the CDN killswitch on. If the maintenance page shows fallback Courier because the font origin was part of the outage, the system lesson is the company's real typography.

**3. One copy source.** The voice doc — ours is a short "error voice" section in the content style guide — owns the tone ladder: how much apology, how much specificity, when the word "sorry" appears and when it shouldn't. Phrases get reused across pages deliberately. Consistency across failures reads as composure.

**4. Status and time expectations as a pattern, not improvised copy.** Every interruption page has a designed slot for "what we know / when we'll know more / where updates live" — populated honestly at incident time by whoever's on call. The slot existing is the system; the on-call filling it is the operation.

## Recovery links: the part with the actual job

Every error page's measurable job is *getting the visitor somewhere useful*. The recovery kit per level: 404s get search and the top-five sitemap links; interruptions get "reload" as a primary action plus cached-content fallbacks where a [service worker](/journal/engineering/service-workers-honest-guide) exists; outages get the support channel and the status page. The failure mode to audit: recovery links that dead-end into the same failure (a 500 page whose "return home" is broken because home is also 500ing — recovery links should target statically-cached or edge-served destinations first).

And log the encounters. Error-page views with referrer and requested URL, shipped into the dashboard next to the [placement funnel](/journal/growth/funnel-metrics-that-matter) numbers, answer reviewable questions: which external links are rotting, which URLs have hidden inbound traffic deserving redirects, whether the 500 rate is rising. An error page viewed 4,000 times a month is a landing page, an unhelpful one, owned by no one — until someone logs it.

## Design ops: the once-a-year audit

Error pages decay because nothing exercises them. The maintenance ritual, once a year, one hour:

- Trigger every error state deliberately (a staging environment with a `?simulate=500`, offline mode, maintenance flag) and screenshot each. Compare against the severity ladder and the voice doc.
- Click every recovery link in every state with the origin *down* where the state implies it would be.
- Check the log pipeline still receives error-page events, and who owns the mailbox the maintenance page promises to update.
- Refresh timestamps, phone numbers and status-page URLs. Error pages hold contact details longer than any other surface and betray contracts *exactly* when people are checking contracts.

It sounds small because it is small — an hour, a checklist — and it's precisely the kind of small that builds the pattern clients describe as "everything they make feels considered". The 404 with a personality is the visible tip; the system underneath is the craft.

## Where this fits in a brand and site build

In our [website engagements](/services/websites), error pages ship as a named deliverable in the design system, not as env defaults: the base template, the severity skins, the static-file infrastructure, the voice doc, the audit checklist. They inherit the [component discipline](/journal/engineering/design-tokens-pipeline) of everything else — one token change re-themes every error at once. And because the brief is honest about error rates (they are never zero, at any budget), these pages get made while everyone's calm, instead of pasted together at 11pm during the incident, which is how most of the web's 500 pages got their tone.

## Key takeaways

- Errors are one experience with varying severity; build one system, one voice, three skins — not four bespoke pages.
- The ladder: inconvenience can carry charm; interruption goes plain; outage gets zero personality budget.
- Engineering makes it a system: static edge-served pages, dependency-audited assets, one copy source, a designed status slot.
- Recovery links must dead-end nowhere and should aim at statically servable destinations.
- Log error-page views like landing traffic; the 404 report is a sitemap health instrument.
- Audit annually by simulating every state — error pages decay because nothing exercises them.

## FAQ

**Should the 500 page include a "retry" button?** Yes — with a small delay and honest copy ("If it fails again, it's us, not your connection."), because a hammered retry loop is how recovering origins get re-killed. Design retries with backoff if you can.

**Custom error pages per product/brand or per company?** Per brand voice, shared infrastructure. The severity ladder and the deployment pattern transfer; the voice calibration doesn't.

**What about error pages inside logged-in product apps?** The same ladder, with task-context recovery: what was the user mid-way through, and can the state be restored? Session errors deserve the deepest restore work — [optimistic UI with integrity](/journal/product/optimistic-ui-integrity) and error boundaries that preserve input are the product-side counterpart, and [error boundaries](/journal/engineering/error-boundaries-resilient-ui) covers the React mechanics.

**Won't static error pages drift from the live brand?** They will — which is why the token pipeline rebuilds and redeploys them on brand releases, and why the annual audit screenshots them. Drift is a process failure, and processes have owners.
