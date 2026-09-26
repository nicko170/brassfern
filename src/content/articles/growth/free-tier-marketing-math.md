---
title: "Free tiers as marketing: the unit economics before the launch"
description: "Freemium is an acquisition channel, not a pricing page row. The unit economics to run before launch: real costs, honest conversion, and the trial alternative."
slug: free-tier-marketing-math
cluster: growth
tags: [freemium, free tier, unit economics, conversion, product-led growth]
date: 2026-09-09
author: Priya Nair
keywords: [freemium unit economics, free tier strategy, free to paid conversion, product-led growth pricing, trial vs freemium]
readingTime: 10
---

A free tier is not a feature of your pricing page. It's an acquisition channel with a cost structure, a conversion rate and a payback period — and it should be justified against the channels it displaces, like paid ads or a sales team's time. Companies that treat it as a pricing decision launch free tiers that bleed money or convert nobody. Companies that model it as a *channel* decision know within a quarter whether it's working.

Here's the model we run before we let a client ship one.

## Step one: the real cost of a free user

"Marginal cost is near zero" is the sentence that kills free tiers. The actual cost stack, priced honestly:

**Infrastructure.** The true unit cost — compute, storage, egress, third-party API calls — for your *free-tier usage pattern*, not your blended average. Free users behave differently: more idle accounts, bursts of evaluation traffic, and in AI-adjacent products, per-interaction costs that are emphatically not near zero. Price the free-tier-specific pattern.

**Support.** Free users generate tickets, often at higher rates than paid users (newer, more exploratory, less documentation-patient). If support costs you $8–15 per resolved ticket and free-tier users file 0.3 tickets a year on average, that's a real per-account annual cost, and it belongs in the model. Design effort helps — a well-built help centre deflects much of it (we've written about [help centres as ticket deflection](/journal/growth/help-centre-seo-deflection)) — but the residual is yours.

**Trust and safety / abuse.** Every free tier attracts signup fraud, scraping, crypto-mining-by-API, and people reskining your product into spam infrastructure. Budget for the detection engineering and the review time. Ignore this line and a year's worth of "growth" turns out to be bots.

**The drag tax.** Free users shape the product roadmap, the performance envelope and the support queue. This one doesn't get a line item, but someone senior should say its name out loud in the meeting: your free tier's needs will compete with your paying customers' needs, forever.

Sum it per-account, per year. For typical B2B SaaS we see honest all-in figures between $3 and $30 per free account-year. If yours computes to near zero, your model is wrong.

## Step two: conversion honesty

The board gets pitched 5% free-to-paid because that's the number in blog posts. The distributions we've seen across real products: median around 2–4% for B2B SaaS, with well-matched free tiers pushing 5–8% and sloppy ones at 0.3% — which is indistinguishable from not having a free tier, except for the costs.

Three things determine which end you land on, and they're design decisions, not fate:

**Ceiling design.** What makes a free user eventually *need* to pay? The durable triggers are: hitting capacity limits (seats, storage, projects), needing collaboration (the second teammate is the classic trigger), needing control (SSO, audit logs, permissions — the enterprise floor), or needing continuity (history, retention, brand removal). Weak triggers — "remove a watermark nobody minds," "unlock a nicer dashboard" — produce the 0.3% end of the distribution. Choose the ceiling to match the moment of genuine [activation](/journal/product/activation-metrics-honest), so the paywall arrives *after* the user has felt the value, not instead of it.

**Time to the trigger.** A ceiling users hit in week twelve converts worse than one hit in week two, because the habit never forms. If your model shows the median free user reaching the upgrade moment late, either move the ceiling or accelerate the journey to it — this is onboarding's problem as much as pricing's, and [onboarding patterns that activate](/journal/product/onboarding-patterns-activation) matter twice as much in freemium as anywhere else.

**Ask design.** The upgrade prompt is a conversion surface like any other, with the same craft rules: contextual (asked at the moment the limit bites, not in a weekly nag), honest (the price, the difference, no dark countdown timers), and respectful of "not now." We wrote up [upgrade prompts that don't feel like ransom notes](/journal/product/upgrade-prompts-timing) separately; the short version is that the ask converts when it's a service, and churns goodwill when it's an ambush.

Then stress-test the number: if conversion is 1%, does the model survive? If the honest answer is no, the free tier is a bet you're making blind.

## Step three: the channel comparison

This is the step almost nobody does, and it's the one that settles the argument. Compute the free tier's effective CAC:

**CAC_free = (annual free-tier cost + amortised build cost) ÷ annual converted customers.**

Then compare it, like for like, with your other channels' fully-loaded CAC, using the same honesty about attribution on both sides — paid gets credited with assists it may not deserve, free users get credited with word-of-mouth they genuinely generate. (Attribution being what it is — [90% noise, as we've said](/journal/growth/attribution-noise-decisions) — run the comparison under pessimistic and optimistic assumptions and see if the decision even changes.)

A worked shape we see constantly: free tier costs $200k/year all-in, converts 400 customers → $500 effective CAC. Paid ads deliver the same customer at $700. The free tier wins *and* compounds, because today's free users seed tomorrow's referrals. reverse the numbers — $200k cost, 90 conversions — and you have a $2,200 CAC that a mediocre ad account beats, plus a support queue full of people who'll never pay. Same product category, opposite answers. The math is why "freemium worked for them" is not evidence for you.

One adjustment that often flips the model back: **account for the halo.** Free tiers produce brand impressions, community, marketplace legitimacy, and a top-of-funnel that dwarfs your ad impressions. That value is real but unverifiable — count it at a conservative fraction, never at face value, and never use it to rescue a model that fails on direct conversion alone.

## Freemium or trial: the decision rule

When the model doesn't hold, the alternative is usually a time-boxed trial — and the choice between them is more structural than philosophical:

- **Choose a free tier when** the product has network or collaboration effects (free users are part of the value paid users buy), marginal costs are genuinely tiny, the use case recurs indefinitely, and you can afford a long payback horizon. Free tiers are a land-grab instrument.
- **Choose a trial when** value concentrates in a short, demonstrable window (migrations, reporting, project-based work — the jobs where thirty days shows everything the product does), per-user costs are real, or your buyers are enterprises who'd rather evaluate with a credit card ready than adopt a tier designed for everyone.
- **Choose open tools and content when** what you actually want is the top-of-funnel halo without the support queue: a genuinely useful [interactive tool](/journal/growth/interactive-tools-as-content) earns the same trust as a free account for a fraction of the running cost, and nobody files a ticket against a calculator.

The hybrid that keeps working: a free tier calibrated to be *useful for individuals, insufficient for teams* — the collaborative ceiling does the converting, and solo power users become your advocates rather than your cost centre.

Whatever you ship, the instrumentation comes first: cohort tracking from day one, activation and limit-hit events named before the feature exists, the same discipline as any [measurement plan written before the build](/journal/playbooks/measurement-plan-before-build). A free tier launched unmeasurable is a cost centre with better marketing.

## Key takeaways

- Treat the free tier as an acquisition channel: cost structure, conversion rate, payback period — justified against paid ads and sales time, not against zero.
- Honest costs include support tickets, abuse management and the roadmap drag tax; "marginal cost is zero" is the sentence that kills them.
- Conversion distributions run 0.3% to 8%; the difference is ceiling design, time-to-trigger and ask design — all decisions, not fate.
- Compute effective CAC and compare channels under pessimistic and optimistic assumptions; if the decision doesn't change under stress, you have your answer.
- Free tier for network effects and land-grabs; trial for concentrated, demonstrable value; open tools when you want the halo without the queue.
- Instrument before launch. An unmeasured free tier is a cost centre with good PR.

## FAQ

**What conversion rate should we put in the pitch?**
Plan on 2% for B2B SaaS until proven otherwise, present the sensitivity at 1% and 4%, and show leadership what each scenario does to headcount plans. Sandbagging this number in the model is not pessimism — it's the difference between a free tier that survives a bad quarter and one that gets killed by the first CFO review. The 5%+ stories you've read are real; they are also the products whose category, ceiling and onboarding were built for freemium from the start.

**Won't a free tier cheapen the brand for enterprise buyers?**
Only if it reads as a toy. Enterprise buyers care that the product has a serious paid ceiling behind it — SSO, audit logs, admin controls — and a free tier that conspicuously lacks those *because they exist on paid* actually signals maturity. What cheapens the brand is a free tier that's the whole product: if the enterprise cannot tell what the money buys, the problem isn't the free tier, it's the packaging.

**How long should we give it before judging?**
Twelve months minimum, assuming you shipped the instrumentation on day one. Freemium compounds: early conversion understates the steady state because habits, referrals and limit-hits accumulate. Judge it earlier only on the cost side — if infrastructure or support spend is running far ahead of model, that's a design problem to fix immediately, not a patience problem.

**Can we just make the free tier worse to push conversion?**
Carefully, and only in one direction: you can raise the *ceiling's sharpness* — clearer limits, better-timed asks — but making the free *experience* worse (grinding restrictions, nagging, degraded performance) converts fewer people than it drives away, and it generates the worst marketing in existence: resentful users with audiences. The free tier is your biggest product demo. You do not sand down the demo.

**What kills free tiers most often?**
Support and abuse costs outpacing the model, and ceilings that trigger so late the habit never forms. Both are fixable if you're watching the instrumention — which is why the most common *fatal* version is simply the unmeasured one: eighteen months in, nobody can say whether it's working, and the loudest voice in the review meeting decides. Write the model first. It's cheaper than the meeting.
