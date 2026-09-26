---
title: "Analytics for AI features: what to measure"
description: "Chat volume tells you nothing. The instrumentation stack we use for AI features: acceptance, correction signals, task completion, cost-quality overlays, weekly review."
slug: ai-feature-analytics
cluster: ai
tags: [analytics, ai metrics, instrumentation, product measurement, quality review]
date: 2026-07-09
author: Priya Nair
keywords: [ai analytics, llm metrics, ai feature instrumentation, copilot metrics]
readingTime: 10
---

The first AI feature I ever instrumented had immaculate dashboards. Sessions up. Messages per session up. Retention up. The client was thrilled right up until the quarter when a churn analysis showed something odd: the heaviest users of the assistant were churning *faster* than everyone else. The dashboard had been measuring enthusiasm. It should have been measuring success. Heavy use, it turned out, was mostly users re-asking the same question in different words, hoping for an answer the system didn't have.

That experience rewired how we instrument every AI feature now. The core problem is that AI features break the assumption baked into product analytics: that more interaction means more value. In a chat interface, interaction is often friction wearing a costume. So the measurement stack has to be rebuilt from the question up, not from the event stream up.

## Start from the task, not the technology

Before a single event is defined, answer: what job does this feature do, and what does a completed job look like from the user's side? For a support assistant, a completed job is *the user's issue resolved without escalation* — not "a conversation happened". For an AI-drafted report, it's *a report the user accepted and sent*, not "a draft was generated".

Every metric below hangs off that definition. This is the same jobs-to-be-done discipline we apply to any product surface — if you haven't done that work, start with our [interview script](/journal/product/jtbd-interviews-that-work) before touching the event taxonomy. Measuring an AI feature against the wrong job gives you precise numbers about the wrong thing, which is worse than no numbers, because false precision survives meetings.

## The five metric families

### 1. Acceptance and override rates

If the feature produces an artifact — a draft, a suggestion, a summary, a categorisation — the primary metric is what happens to it. Accepted as-is. Edited then used. Rejected entirely. Dismissed without reading (track dwell time; a two-second 'acceptance' is a misclick).

The edit distance matters. On a recent financial-services engagement, acceptance of AI-drafted client summaries was a healthy 78% — but a third of those "acceptances" involved edits to the same two sentences. The dashboard said success; the diff said the model reliably got the fee disclosure wrong. Track *what* gets edited, not just whether. Correction content is a free, continuous evaluation set — the single cheapest source of quality signal you have. (It feeds the trust loop too; see [designing AI features users can trust](/journal/ai/ai-trust-design).)

### 2. Correction and retry signals

For conversational features: re-ask rate (same intent, different phrasing, within a session), follow-up clarifications ("that's not what I asked"), explicit negative feedback, and escalation to a human. Each is a distinct failure flavour:

- **Re-asks** suggest the answer missed the intent.
- **Clarifications** suggest the answer was vague or ungrounded.
- **Escalations immediately after an answer** suggest the user checked and disbelieved it — the most expensive signal, because it's trust being spent.

Report these per intent category, not globally. A healthy 6% correction rate can be hiding a 40% rate on your most valuable intent.

### 3. Task completion vs chat volume

This is the metric that reframes everything: **median turns-to-done** and **completion rate per task**, measured against the job definition from step one. Falling turns-to-done with stable completion means the feature is getting better. Rising turns-to-done with falling completion — the classic growth of "engagement" — means it's getting worse while looking busier.

Define completion honestly. For a booking assistant, completion is a made booking, ideally confirmed downstream (attended, not cancelled in the first hour). We did this for the flow described in the [Pylon Health case study](/work/pylon-health-telehealth-flow): "conversation ended" looked fine; "appointment completed" told the truth.

### 4. Cost and quality, overlaid

AI features have a marginal cost per interaction, which makes them unlike almost anything else in your product. Every metric above should be viewable next to cost: cost per completed task, cost per accepted artifact, cost trend per user cohort. This does two things. It catches quality regressions early — a prompt change that raises cost *and* lowers acceptance is a double loss that flat dashboards miss. And it forces the architecture conversation into product terms: when cost per completed support task is $0.40 and falling, and a human-handled ticket costs $6, the ROI discussion is arithmetic, not evangelism. When it's $3.80 and rising because users re-ask five times, you have a product problem that framing as a model problem will not fix. (The architecture levers — cheaper models, distillation, retrieval over stuffing — are covered in our [fine-tuning vs RAG decision guide](/journal/ai/fine-tuning-vs-rag).)

### 5. Trust proxies, tracked over time

Verification clicks (opening citations), delegation depth (does the user ask the system to *do* things or only find things), and return-after-correction. These are slower signals — trust is a stock, not a flow — so read them on cohort curves over weeks, not on a weekly dashboard. The full reasoning is in the trust piece linked above; the short version is that a user who checks your citations in week one and stops checking by week six is showing you the trust being built that your engagement metrics can't see.

## Sampling: the human layer

Automated metrics miss the most important question: *were the answers actually good?* Acceptance can be lazy, completion can be coerced by a narrow funnel, and none of it catches a fluent, plausible, wrong answer the user acted on happily.

So: sample. We set up a weekly review where a human — usually a rotating pair, one product person and one domain person — reads a stratified random sample of 30–50 interactions and scores them against a short rubric: correct, grounded, on-voice, appropriately confident. Stratified matters: oversample escalations, corrections and low-confidence outputs, because the failures cluster there. An hour a week. This is the cheapest, highest-yield ritual in the whole stack, and it catches what dashboards structurally cannot.

It also needs plumbing: you must be able to *see* production interactions, which means consent, data handling and access controls sorted out at instrumentation time, not after a lawyer asks. What's logged, who reads it, how long it's kept — decisions documented before launch. Our [responsible-AI review](/journal/ai/responsible-ai-review) covers the review-side checklist.

## The weekly quality review standing agenda

The metrics only earn their keep in a ritual. Ours is 45 minutes, weekly, same agenda:

1. **Completion and cost per completed task** — trend vs last week, any step changes tied to deploys.
2. **Correction clusters** — top three things users edited or re-asked, with examples read aloud. (Read aloud. It changes the room.)
3. **Sampled quality score** — the human rubric result, vs trend.
4. **One decision** — every review ends with a single commit: a prompt fix, a new eval case, a retrieval patch, an experiment to run. If the meeting produces insights but no commit, it degrades into theatre within a month.

Feed every correction cluster back into the evaluation set. Evals are how you stop fixing the same failure twice; the eval framework piece from our AI lead covers the mechanics, and the discipline rhymes with honest [experiment design](/journal/growth/cro-experiment-design): pre-register what "fixed" means before you change anything.

## What not to measure

Three vanity metrics to actively exclude from dashboards, because they reward the wrong behaviour:

- **Messages per session.** Rewards friction.
- **Thumbs-up rate in isolation.** Users up-vote politeness and confidence, not correctness; teams optimise tone and accuracy silently degrades.
- **AI usage as a North Star.** "Percentage of users touching the AI feature" incentivises stuffing AI into surfaces where it doesn't belong. The North Star is task value — the same [activation metrics that mean something](/journal/product/activation-metrics-honest) you'd hold any feature to.

## Key takeaways

- More interaction is not more value in AI features. Instrument against task completion, not engagement volume, and expect heaviest users to sometimes be your most frustrated ones.
- Track acceptance *with edit distance* — what users correct is your cheapest, richest quality signal and a free evaluation set.
- Overlay cost on quality always: cost per completed task turns AI ROI into arithmetic and catches regressions that flat quality dashboards miss.
- Sample production interactions weekly with a human rubric. Automated metrics cannot see fluent, plausible, wrong answers — and those are the ones that spend trust.
- Run a weekly quality review with a standing agenda that ends in exactly one committed change. Insights without commits become theatre within a month.

## FAQ

**We don't have engineering capacity for full instrumentation. What's the minimum viable stack?**
Three things: an acceptance/override event on every artifact the feature produces, a visible correction affordance that logs, and the weekly human sample of 30 interactions. That trio will tell you more than a dozen automated dashboards without the sampling layer. Build the rest as questions emerge.

**How do we measure completion for open-ended features like brainstorming or drafting?**
Redefine the job: not "had a creative conversation" but "left with something usable". Proxy it with downstream behaviour — was the draft exported, sent, saved, built upon within 24 hours? Imperfect, but it separates productive sessions from abandoned ones better than any in-conversation signal.

**Should AI feature metrics live with product analytics or ML evaluation?**
Both, deliberately duplicated. Product analytics answers "is this feature valuable?"; evals answer "is the model good?". Teams that merge them end up arguing about which dashboard is right instead of fixing the feature. Keep the datasets separate and read them side by side in the weekly review.

**How much should AI features cost per task before the economics stop working?**
Compare against the cost of the alternative — usually a human doing the task, or the task not being done at all — and demand a healthy margin, because costs drift up as usage grows and users ask harder things. A feature at 90% of the human cost is a bad business; a feature at 10% has room for the quality investment that earns retention.

**What if legal won't let us log conversations for review?**
Then scope down: log structured events (accepted, corrected, escalated) without content, and run the sampling review on consented accounts — an internal cohort or opt-in beta users — where you've been explicit about what's recorded and why. A feature you cannot inspect is a feature you cannot improve, and shipping it anyway should be a conscious risk decision, not a default.
