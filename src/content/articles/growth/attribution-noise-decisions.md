---
title: "Attribution is 90% noise: making decisions anyway"
description: "Last-click lies, multi-touch dreams, and what actually works for teams without a data science department: a decision framework for acting on noisy attribution."
slug: attribution-noise-decisions
cluster: growth
tags:
  - Attribution
  - Analytics
  - Decision-making
date: 2026-02-24
author: Sam Whitfield
keywords:
  - marketing attribution
  - attribution model
  - marketing measurement small teams
  - marketing mix modeling
  - incrementality testing
readingTime: 11
---

Here is the uncomfortable baseline for this entire article: for most marketing teams, attribution data is around 90% noise and 10% signal — and the 10% is still worth acting on, if you know what it can and cannot answer.

Our earlier piece, [attribution that admits what it doesn't know](/journal/growth/attribution-models-honest), made the honesty case. This one is about the morning after: you have imperfect data, a budget meeting on Thursday, and a director of finance who believes the dashboard. How do you actually decide?

## Why last-click lies (and why we keep it anyway)

Last-click attribution credits the final touchpoint before conversion. Everyone in the industry knows it over-credits bottom-funnel channels — brand search, retargeting, email — and under-credits everything that created the demand in the first place. The mechanisms are boring and structural: users who were already going to convert get intercepted by a brand search ad; the podcast that planted the purchase three months ago had a listener on a different device, logged out, cookieless.

So why does a sensible team keep a last-click report on the wall? Two legitimate uses:

- **Operational hygiene.** Last-click is a decent instrumentation of *handoffs*: if tagging, redirects or consent flows break, last-click shifts in ways that flag the bug. It's a smoke detector, not a map.
- **Floor-funnel efficiency.** Within a channel, last-click comparisons between ad sets or creative are more defensible — you're comparing like with like inside one touchpoint's own mechanics.

What last-click cannot do is compare channel categories — paid social against brand search against organic. The moment a dashboard ranks a demand-harvesting channel against a demand-creating one on last-click CPA, it is manufacturing confidence that doesn't exist. That ranking view is usually the first thing we delete in an audit, and the honesty requires the tracking plan discipline in [analytics governance](/journal/growth/analytics-governance) before you can trust even the smoke detector.

## A hierarchy of evidence for small teams

Forget the enterprise fantasy of a full marketing-mix model on fifty variables. For teams spending under roughly $5M a year, evidence stacks in this order — each rung is more expensive than the last, so exhaust the cheap ones first:

**Rung 1: Directional platform data, deduplicated.** Every platform grades its own homework — Meta claims the same conversion Google does. Use each platform's numbers *within* the platform (creative testing, audience allocation) and never across platforms. The deduplicated view — total conversions claimed vs total conversions real — is sobering and should be in every monthly report as a footnote.

**Rung 2: First-party "how did you hear about us."** A required, single-select question at signup or checkout, plus a free-text follow-up. Crude, biased toward recall, and still the best source of demand-creation signal a small team has. When HDYHAU says 22% of customers cite a channel that appears in no dashboard, invest in that channel's tracking *and* in the channel.

**Rung 3: Geo holdouts and on/off tests.** Split spend by region or time period, hold one cell dark, measure the delta. A podcast campaign you can switch off for six weeks in half your markets teaches you more than any platform dashboard ever will. Design the test before the campaign, not after — the [experiment discipline](/journal/growth/cro-experiment-design) that governs CRO applies here unchanged: pre-registered hypothesis, pre-committed decision.

**Rung 4: Merchandise-math modeling, MMM-lite.** Once you have 18+ months of weekly spend and revenue data per channel, lightweight regression-style media mix models are within reach of a competent analyst. They live and die on input quality; they're a summary of history, not an oracle.

**Rung 5: Judgement, made explicit.** At the end of every evidence stack sits a human deciding. The mature move is making that explicit: "We believe brand spend works at roughly half the efficiency dashboards suggest; we're allocating on that stated belief and reviewing in two quarters." A written belief is auditable. A dashboard-derived "decision" never was.

## The four decisions attribution data can actually support

Map the question to the right evidence, and the noise stops mattering:

1. **"Is anything broken?"** — last-click and analytics plumbing. Cheap, continuous, technical.
2. **"Should we scale or cut this channel entirely?"** — rung 3 tests. Channels are usually worth a real kill-or-double experiment once a year; it's the highest-value measurement a small team can buy.
3. **"How do we split within a channel?"** — platform-native data, creative testing, on-platform signals. This is the 90% of day-to-day optimisation and platform data is fine for it.
4. **"What's the portfolio mix across categories?"** — the hardest question and the one no tool answers. Combine rung 2 survey data, historical kill-test results, and written beliefs; revisit twice a year in a room, not weekly on a dashboard.

Notice what's absent: "optimise daily spend across channels from an attribution tool." That is the single most common misuse — reallocating weekly between demand creation and demand harvest based on 14-day click windows, thereby slowly converting the entire budget into brand search. Several clients arrived at our studio mid-way through that conversion, wondering why growth had quietly stopped while "CPA looked great."

## Making peace with the noise

Three practices keep a team sane once they accept the 90/10 split:

- **Track decision quality, not attribution precision.** Keep a lightweight decision log: what did we believe, what did we do, what happened. In a year, it tells you whether your judgement machinery is improving — a question no vendor dashboard asks. It's the growth-team version of the funnel discipline in [measure the movement, not the moment](/journal/growth/funnel-metrics-that-matter): over quarters, the pattern of decisions is the metric.
- **Spend your measurement budget where decisions are expensive.** A $40k annual attribution platform to adjudicate a $60k channel is theatre; a $15k geo test to decide a $400k channel is arithmetic. Measurement has an ROI like everything else, and the [paid/organic budget conversation](/journal/growth/paid-organic-balance) should include the measurement line item explicitly.
- **Publish the uncertainty internally.** Every report that reaches leadership carries a "what we don't know" footer: channels with no reliable signal, effects below measurement floor, the current written beliefs. It feels vulnerable the first month and is the single biggest trust-builder by month three — finance partners extend dramatically more latitude to teams that visibly know where their map is blank.

We operationalised this with [Copperline Mutual](/work/copperline-community-bank), whose member-acquisition reporting mixed branch walk-ins, broker referrals and digital spend in one heroic spreadsheet. The rebuild did not produce a better attribution model; it produced a decision log, a twice-yearly holdout calendar, and a one-page "knowns and unknowns" document the board actually reads. Illustrative outcome: within two quarters, spend had shifted materially toward the two channels holdouts had validated — and the CFO started funding *more* experimentation, because the measurement was finally legible to her.

The clickstream era made measurement feel total. The privacy era has ended that illusion for everyone — nothing about 2026 will restore 2015's visibility. The teams that grow are the ones who treat attribution as one witness among several, cross-examine it, and write down what they believe while they wait for better evidence. It's the same posture we take across our [growth engagements](/services/growth): fewer dashboards, better decisions, honest footnotes.

## Key takeaways

- Assume ~90% noise: last-click is a smoke detector for plumbing and a within-channel tool, never a cross-channel referee.
- Climb the evidence hierarchy in order: platform data (within-platform only), HDYHAU surveys, geo holdouts, MMM-lite, then explicit written judgement.
- Match measurement to the decision: kill-or-scale questions deserve experiments; weekly creative allocation doesn't.
- Log decisions, not just data — decision quality compounds; dashboard precision doesn't.
- Publish uncertainty to leadership. It's the fastest route to long-horizon budget trust.

## FAQ

**Is multi-touch attribution (MTA) dead?**
Post-cookie, deterministic MTA across channels is severely degraded — browser restrictions, device switching and consent gaps mean the "journey" is stitched together from fragments and modelled guesses. Within a single logged-in product or a single platform, multi-touch views still help. Across the open web, treat MTA as directional narrative, not arithmetic.

**Won't leadership reject decisions made without "data"?**
Leadership rejects unmanaged risk, not calibrated belief. A written hypothesis with a review date, a kill criterion and a test plan attached is *more* rigorous than a dashboard screenshot — and smart CFOs know it. What leadership genuinely dislikes is being told attribution is precise and then watching outcomes fail to match the model.

**How do we run a geo holdout with limited regions?**
Match regions by historical conversion behaviour rather than size; prefer several smaller matched pairs over one big split; run at least one full business cycle (often 4–8 weeks in B2C, a quarter in B2B); and pre-commit to the decision rule ("if the lift is below X, we cut") before seeing results. Underpowered tests aren't useless for kill decisions — a channel that can't show a detectable effect above noise is telling you something.

**What about incrementality platforms vendors pitch us?**
Some run legitimate conversion-lift tests inside the walled gardens — those are real and worth using for big channels. Be allergic to any tool that claims cross-channel truth without an experiment behind it; ask which numbers came from holdouts and which came from modelling, and watch the demo get interesting.

**How often should we re-examine the mix?**
Twice a year for the portfolio view, because anything faster outruns your evidence-gathering. Channel-level and creative-level optimisation can run continuously on platform data. The cadence mismatch is the whole point: fast loops where data is good, slow loops where data is genuinely scarce.
