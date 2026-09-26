---
title: "After launch: the first 90 days done properly"
description: "Launch day is the start, not the finish. How we run the first 90 days after a site ships: analytics baselines, bug etiquette, and the next engagement."
slug: first-90-days-after-launch
cluster: playbooks
tags: [post-launch, analytics, agency process, QA innovation, retainers]
date: 2025-09-30
author: Ruby Castellanos
keywords: [post-launch plan, website launch checklist, analytics baseline, agency retainer, 90 day plan, post-launch bugs]
readingTime: 11
---

Every project has a moment where the confetti settles, the launch tweet gets its modest likes, and a room full of people who were urgent all last week become suddenly, synchronously unavailable. The site is live. The client thinks the project is over. The studio thinks it's invoice time.

Both are wrong. What ships on launch day is a hypothesis. The first 90 days are where the hypothesis meets reality — real users, real devices, real search crawlers, real editors hammering the CMS in ways nobody rehearsed. Teams that plan these 90 days end up with a site that improves every month. Teams that don't end up, eighteen months later, paying for a redesign of a site that was never actually finished.

This is the plan we write into every engagement before we start, so nobody has to negotiate it while tired.

## Week zero: agree what "done properly" means

The 90-day plan is scoped at kickoff, not bolted on. Before launch, both sides agree on four things: the **stabilisation window** (how long the build squad stays on, at what capacity), the **baseline period** (when analytics become meaningful), the **handover point** (who owns the site on day 91), and the **decision rhythm** (a standing weekly, then fortnightly, review). Writing this down early matters because every one of these is painless to agree on in the optimism of month one and strangely contentious in the fatigue of launch week.

If your studio didn't propose any of this, our [launch week checklist](/journal/playbooks/launch-week-checklist) covers the run-up; this article picks up where that one stops.

## Days 1–14: stabilisation, and the etiquette of post-launch bugs

There will be bugs. The question is never whether — it's how they get triaged. The failure mode we see most is a client filing every observation at the same pitch: "the site is broken." Meanwhile the build team treats everything as wontfix because launch week burned them out. Both postures are manners problems wearing a technical costume.

So we run a simple etiquette, agreed in writing:

- **Severity has names.** S1: revenue or trust is actively leaking (checkout error, data exposure, site down). Response inside hours. S2: a real user journey is degraded (form validation glitch, mobile layout break on a key page). Fix this week. S3: polish and papercuts (orphaned word in a footer, a transition that stutters on one browser). Batched into a fortnightly tidy. Naming severities de-escalates everything, because "S3" lands softer than "not a priority."
- **Whoever finds it, writes it like a stranger will read it.** Device, browser, URL, expected, actual, screenshot. Bugs reported as "looks weird on my phone" cost everyone an hour each.
- **The fix window is a retainer of trust, not a warranty claim.** Stabilisation capacity — typically the squad at 25–50% for two weeks — is for launch-surface regressions, not for the new ideas that inevitably arrive in week one. New ideas go on the roadmap list. Blurring this boundary is how week two becomes scope month seven.

On the [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild) we logged 41 post-launch items. Three were S2s, all fixed inside the week; 38 were S3s cleared in two tidy batches. The client's ops lead told us later the triage sheet was the thing that made launch feel "boring, in the best way."

## Days 1–30: establishing the baseline, and ignoring it politely

Analytics from the first fortnight are fog. Launch PR, the team visiting from fifteen devices, the client's entire company clicking around — all of it pollutes the data. So the first 30 days have one analytics job: make sure the measurement itself is trustworthy. (The whole discipline of [analytics governance](/journal/growth/analytics-governance) — tracking plans before tools — is what makes this week boring instead of frantic.)

Our checks:

1. **Event audit against the tracking plan.** Every event that was specced fires, once, with the right properties. You'd be surprised how often "add to cart" fires on button render.
2. **Filter the insiders.** Internal IPs, staging domains, the studio's office. Excluding the launch cohort from baselines is the difference between measuring customers and measuring yourselves.
3. **Consent and sampling sanity.** Know what percentage of traffic your analytics actually sees in a consent-banner world, before anyone draws a trend line.
4. **Core Web Vitals in the field.** Lab scores at launch are a promise; field data at day 28 is the truth. We keep a running eye on the numbers using the budgets from our [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide) — LCP and INP regressions caught here are cheap; caught in a quarterly review, they are archaeology.

Around day 30, the fog lifts and you can state, honestly: here is where we start. Sessions, conversion rate, search impressions, engagement by template, vitals percentiles. This baseline is the most valuable artefact of the month, because every future improvement claims its credit against it.

## Days 31–60: the first trading month

Now the site stops being a project and starts being a business asset. This month is about reading, not changing. The discipline is to annotate everything and alter almost nothing: when you change three things and conversion moves, you've learned nothing except that you can't be trusted near a trend line.

The review questions we ask at the day-60 session:

- Which pages do the work? Traffic concentrates; find the five templates carrying the revenue or the pipeline and stare at their funnels specifically.
- Where do users bail? Exit points against expectation, not against a generic benchmark.
- What did search do? Impressions normally dip or wobble after a replatform; recovery shape tells you whether redirects and [SEO hygiene](/journal/growth/technical-seo-checklist-2026) held.
- What are editors doing to the CMS? Support requests from the content team are free usability research. If three people ask how to update the same module, the module is wrong, not the people.

One warning: nobody gets to declare the site a success or failure at day 60 on a single metric that moved 4%. [Attribution in the first months is mostly weather](/journal/growth/attribution-noise-decisions). What you can judge is direction and behaviour — are the journeys we designed the journeys people take?

## Days 61–90: decide what this site is for next

By day 90 you have a baseline, a month of clean behaviour, a bug ledger that's quiet, and a list of deferred ideas. This is the moment the 90-day plan was built for: a proper decision about the next phase, made with data instead of vibes.

Three honest options, and we've recommended each of them at different times:

- **Optimise.** The site works; now compound it. A structured improvement cadence — experiments, content, performance — is where returns hide. This is the case for a [retainer rather than a new project](/journal/playbooks/retainer-vs-project), because the work is many small things, not one big thing.
- **Extend.** The baseline revealed a gap (a journey nobody uses, an audience nobody serves). Scope a small, targeted phase two. Small is the point: day-90 insight is precise, so the response can be surgical.
- **Operate.** Sometimes the right answer is: the site is done, hand it fully in-house, book a quarterly health check, and spend the budget on marketing. A studio that never says this is a studio that always needs your money.

The day-90 review ends with a written one-pager: baseline vs. current, what we learned, the chosen mode, and the next review date. It takes an afternoon. Clients have told us it gets forwarded to boards; a studio's work being legible to a board is an underrated survival trait.

## Key takeaways

- Plan the post-launch 90 days at kickoff: stabilisation window, baseline period, handover point, review rhythm.
- Give bug severity names and manners. S1/S2/S3 turns panic into process.
- Treat the first fortnight's analytics as fog; spend month one auditing measurement, not reacting to it.
- Month two is for reading, not changing. Annotate everything; alter almost nothing.
- Day 90 is a decision point with three honest outcomes: optimise, extend, or operate. All three are wins.

## FAQ

**What if we can't afford stabilisation time after launch?**
You can't afford not to have it, but you can shape it. Even two days a week of squad availability for a fortnight beats zero. What's genuinely dangerous is a contract that ends at deploy with no provision at all — negotiate it at signing, when leverage is friendly.

**Our last launch had no baseline and we regret it. Can we reconstruct one?**
Partly. Search Console history, server logs, and archived analytics settings recover more than people expect, but event-level funnels are gone forever. Start the clean baseline now and date it honestly; a younger baseline beats a fictional one.

**Who should attend the day-90 review?**
Whoever owns the number the site is meant to move, the person who edits the content, and whoever controls next quarter's budget. If any of those is missing the meeting produces a slide deck instead of a decision.

**How do we keep momentum if we choose "operate"?**
Schedule the quarterly health check before you disband, with a named owner on both sides. Sites decay silently — deps age, content drifts, vitals slide. A two-hour check-in beats a rescue project. And when you're ready to build again, [you know where we are](/contact).
