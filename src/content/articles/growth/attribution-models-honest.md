---
title: "Attribution that admits what it doesn't know"
description: "Attribution is always lying a little. Model taxonomy, dark social acceptance, self-reported fields, geo holdouts and decision-making without false precision."
slug: attribution-models-honest
cluster: growth
tags: [attribution, measurement, analytics, marketing strategy, experimentation]
date: 2025-02-26
author: Priya Nair
keywords: [marketing attribution, attribution models, marketing measurement, dark social]
readingTime: 10
---

Every attribution system I've audited has the same skeleton in its closet: a confident dashboard built on a chain of small, understandable lies. The user cleared their cookies. The podcast ad was heard on a speaker. The CFO read about you in a group chat forwarded from a newsletter neither of you can see. The click-based model takes all of that reality, rounds it down to "direct / organic / branded search", and presents the result with two decimal places.

This doesn't mean attribution is useless. It means the industry's default relationship to it — precision cosplay — actively damages decisions. Channels get killed for failing to take credit they earned but can't prove. Brand spend gets strangled because demand capture wears its halo. Teams drown in model comparisons when the honest answer is a shrug with a plan.

Here's the framework we install with clients: a taxonomy of what each attribution method is actually for, the measurement moves that shrink the unknowable, and — most important — how to make good budget decisions while admitting the size of the fog.

## Know what each model is for (and stop asking it more)

Attribution tools fail partly because we ask one instrument to do every job. There are four distinct jobs, and each has a right tool:

**1. Optimisation (weekly, in-channel).** Click-based platform attribution — Google, Meta, the ad networks' own numbers. It exists to tune bids and creative *within* a channel, and it's fine at that. Using it to compare channels is where the lying starts, because every platform grades its own homework. A platform claiming credit for a conversion that also appears in three other platforms' dashboards is not a scandal; it's the instrument working as designed. Just don't add the claims up and call it revenue.

**2. Allocation (quarterly, across channels).** This is the question that matters — where should the next dollar go — and it has no honest click-based answer, because clicks systematically underweight anything people *hear about* rather than click on. Allocation needs triangulation: platform data, self-reported attribution, and incrementality tests, each checking the others' blind spots. More on all three below.

**3. Explanation (board decks, budget defence).** Multi-touch models (position-based, data-driven) are storytelling devices. They distribute credit across the visible journey and they're useful for showing that the journey exists. They are not causal evidence, whatever the "data-driven" label implies. A model that assigns 34.2% credit to display has averaged assumption, not discovered physics.

**4. Detection (did something break?).** First-touch and last-touch, ugly as they are, are excellent tripwires. A sudden shift in first-touch mix is often the earliest signal of a tracking change, a competitor's campaign, or a PR moment. Simple models are sensors; respect them as such.

The governance rule we write into every client's measurement doc: **each question names its instrument before anyone looks at a number.** Otherwise the meeting becomes four people arguing from four instruments, which is where "let's just trust the platform" comes from.

## Accept dark social, then measure around it

A large and growing share of word-of-mouth happens in channels no attribution will ever see: group chats, Slack communities, forwarded newsletters, podcasts played aloud, screenshots. This is not a problem to solve; it is a feature of how humans recommend things. The apps won; the trackers lost. Acceptance is the starting point, and it's oddly liberating, because it converts "why can't we track this?" into "how do we make decisions knowing this?"

Three moves:

**Self-reported attribution, done properly.** A free-text "How did you hear about us?" field on signup or checkout, plus a LLM-or-rules classifier into a fixed taxonomy, is the single highest-value measurement asset most companies don't have. Free text beats dropdowns — dropdowns train users to pick "Google" to make the form end. The yield is routinely humbling: in one B2B client engagement, the channels self-reported attribution surfaced as meaningful (a niche podcast, a community Slack, a conference talk) were collectively invisible in click data — while "branded search", which click data loved, was mostly the *last step* of journeys that started in the dark. Users telling you what happened is not soft data. It's the only data that includes the majority of human behaviour.

**Post-purchase surveys with memory decay awareness.** Ask within minutes of the decision, not weeks later. Same-week recall of journey origin is already mushy; month-old recall is fiction dressed as data.

**Branded search as a prism, not a channel.** When non-click channels work, branded search volume rises. Watch it as a composite vital sign of everything you can't track — and resist the temptation to let it absorb the credit. Nobody wakes up and searches your brand name because the brand name did great marketing.

## Incrementality: the only causality in the building

If you remember one methodological commitment, make it this: **periodically, deliberately, stop things.** Incrementality testing is the only tool that answers "what would have happened without this spend?" — the actual question budget allocation asks.

Our standard toolkit, in ascending order of cost:

- **Geo holdouts.** Split comparable regions, pause a channel in half of them for four to six weeks, watch the divergence in total outcomes (not tracked outcomes — *total*). Crude, noisy, and one of the few honest instruments in marketing. In an illustrative engagement we ran for a retail client, a geo holdout on paid social found real lift — but roughly 60% of what the platform dashboard claimed. That single number renegotiated the entire channel budget, and the peace treaty stuck because both sides designed the test together *before* seeing results.
- **Conversion lift / ghost-bid studies** where platforms offer them. Built by the platform, so treat with care — but directionally useful and nearly free.
- **Branded search on/off tests.** Most brands bidding on their own name have never tested whether they need to. A two-week pause (where competitive conquesting risk allows) often reveals that the budget was buying the same clicks the organic result would have caught. Sometimes it reveals the opposite. Either answer pays for the test in a quarter.

The cadence matters more than the sophistication: one incrementality question per quarter, pre-registered with a written hypothesis and pre-agreed decision ("if lift is under X, we cut Y"). Teams that pre-agree act on results; teams that don't will find a reason the test was flawed precisely when it says something expensive.

## Decide in the fog: the confidence-tiered budget

The culmination of honest attribution is a budgeting practice that encodes uncertainty instead of hiding it. We sort every spend line into three tiers:

- **Proven** — survived an incrementality test or has overwhelming triangulated evidence. Fund confidently, re-test annually.
- **Directional** — consistent platform and self-reported signal, never causally tested. Fund with a cap, and schedule its test. Most of a healthy budget lives here.
- **Article of faith** — spend justified by vibes, founder conviction, or "everyone does it". Brand campaigns, sponsorships, community. These aren't forbidden — some of the best marketing lives here — but they're *labelled*, funded at a deliberate size, and given outcome definitions upfront ("we expect branded search volume and direct traffic to compound; here's the baseline") so the faith has terms.

The tiers do something cultural as much as financial: they make it safe to say "we don't know" in a budget meeting, because not-knowing is a legitimate, managed state rather than an admission of failure. That safety is what actually changes behaviour. As we wrote in our [notes on lifecycle measurement](/journal/growth/lifecycle-email-architecture), the instrument you trust is the organisation you'll build.

One last rule, call it the two-decimal law: **if a number matters, report it at a precision that reflects its uncertainty.** "Paid social drove ~$120–180k, direction confidently positive, exact split unknowable" is harder to put in a deck than "$147,322". It is also true, and decks that tell the truth compound in credibility exactly the way channel-credit inflation compounds in dysfunction.

If your measurement stack has grown by accretion and nobody quite believes any of it — that's normal, and fixable in a quarter of structured work. It's core to our [growth practice](/services/growth), usually starting with a [paid discovery sprint](/pricing). [Here's how to reach us](/contact).

## Key takeaways

- Name the question's instrument first: platform data for in-channel optimisation, triangulation for allocation, multi-touch for storytelling, simple models as tripwires.
- Dark social is a permanent feature; accept it and measure around it with free-text self-reported attribution, prompt recall surveys, and branded search as a prism.
- Incrementality is the only causal tool: geo holdouts, platform lift studies, branded on/off tests — one per quarter, pre-registered with the decision written down.
- Tier the budget by evidence (proven / directional / article of faith) so uncertainty is managed openly instead of laundered into precision.
- Report at honest precision. A credible range beats a false point estimate in every room that matters.

## FAQ

**Which attribution model should we use?**
For most companies under ~$50k/month spend: none, in the multi-touch sense. Use first-touch + last-touch as sensors, platform data for in-channel tuning, free-text self-reported attribution for journey truth, and one incrementality test a quarter for allocation decisions. Multi-touch models earn their complexity only when journey volume makes their averaging meaningful and someone owns the model's assumptions full-time.

**Isn't last-click attribution dead?**
The model was always simple; what died is the pretence that it described reality. Last-click remains superb for two jobs: detecting tracking problems and answering "what was the final nudge?" It fails only when asked to allocate budgets — but that's true of every click-based model, which is why allocation needs triangulation and incrementality, not a fancier curve over the same clicks.

**How do we measure podcast, PR or community spend?**
You don't attribute it; you bound it. Fixed promo codes and vanity URLs catch the countable slice, "how did you hear about us" catches the self-aware slice, geo or time-based on/off tests bound the total effect, and branded search trends show the compounding. Accept that the true number integrates across all four and is never directly observable — fund it in the "article of faith with terms" tier.

**Our CEO wants one dashboard with one ROI number per channel. What do we do?**
Give them the dashboard — with confidence intervals rendered as ranges and each channel tagged with its evidence tier. The point isn't to withhold the summary executives need; it's to make uncertainty visible at the moment of decision. Teams that show ranges get asked better questions within a quarter. Teams that show false precision get asked to explain why reality missed the forecast.
