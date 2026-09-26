---
title: "Pricing AI features: cost curves, credits and honest limits"
description: "How to price LLM features without burning margin: cost per action as a unit-economics input, credits vs guardrailed unlimited, fair-use caps, tiering and drift."
slug: ai-feature-pricing
cluster: ai
tags: [ai pricing, unit economics, saas pricing, credits, margin]
date: 2026-08-04
author: Priya Nair
keywords: [ai feature pricing, llm cost per user, ai saas pricing models, ai credits pricing, unit economics ai features]
readingTime: 13
---

Somewhere between "we shipped an AI feature" and "finance wants a word" sits a pricing meeting most teams have too late. The feature is live, users love it, and the usage graph looks like a hockey stick — which is lovely, except that for the first time in SaaS history, your marginal cost of serving a happy user is a real, non-zero number that scales with their delight. Every generation costs money every single time. An accountant has noticed.

Traditional SaaS pricing assumed marginal cost ≈ zero, so you could be generous: unlimited projects, unlimited seats, unmetered everything. LLM features broke that assumption and a lot of teams responded with a shrug and the word "beta". This article is the pricing framework we now build alongside AI features in our engagements — the same unit-economics discipline as our [cost engineering practice](/journal/ai/llm-cost-engineering), looked at from the revenue side of the ledger.

## Step one: find your cost per action, honestly

You cannot price what you cannot meter. Before any packaging discussion, get to a defensible **cost per action** — the all-in compute cost of one unit of value: one resolved conversation, one generated-and-kept draft, one summarised document. Not the token list price; the real number, including retrieval, retries, safety passes and the calls that failed silently. Instrument it in production for a few weeks and look at the *distribution*, not the mean. The mean lies. The p95 conversation — the user who pastes a novel, the agent that loops — is where pricing models go to die.

Then map the shape of your cost curve against your value curve. Three shapes cover nearly everything we've seen:

- **Flat and cheap.** Cost per action is fractions of a cent and doesn't grow with heavy use (classification, small-model extraction, templated generation). Price it like any SaaS feature: bundled, unmetered, forgotten about. Metering a nearly-free thing costs more in trust than the compute ever will.
- **Linear and meaningful.** Cost scales directly with usage and is big enough to matter — long-document analysis, deep research, agentic workflows. This is where credits and caps earn their complexity.
- **Convex.** Power users cost wildly more per unit of value delivered: recursive agents, multi-step reasoning, anything where context grows with ambition. Convex curves must be priced with hard ceilings, because "unlimited" here means your best customers are your loss leaders.

The worst outcome is discovering you have a convex curve after marketing shipped the word "unlimited".

## The packaging menu, and what each choice signals

There are four honest ways to package AI features. Each is a legibility trade-off: what the user understands versus what protects your margin.

**Bundled unlimited.** The AI is simply in the plan, no meter visible. Best when cost per action is flat-cheap, or when the feature is the plan's core promise and metering would poison adoption. The risk is adverse selection: heavy users concentrate in the plan that lets them be heavy. Mitigate with a fair-use policy that's real (see below) and soft-throttle rather than hard-stop.

**Credits.** Users buy or receive a balance; actions spend it. Credits are margin-safe and scale gracefully from hobbyist to monster. They are also the most cognitively expensive option — a user asking "how many credits is this?" is a user not doing their work. Credits work when actions are discrete and legible (generations, exports, lookups) and when users can see the price *before* they spend. Publish a rate card in-product. Hidden credit costs read as a casino.

**Guardrailed unlimited.** Unlimited within a generous envelope — say, a few hundred actions per seat per month — with a polite, honest overage path. This is our default recommendation for most B2B tools: it feels unlimited to 95% of users (we rarely see more than 3–8% of seats hit a well-set cap), the cap is sized from your cost distribution's shoulder rather than its tail, and it turns pathological usage into a conversation instead of an invoice surprise. The [pricing page research](/journal/product/pricing-page-ux-research) we ran says the same thing the data always says: users forgive limits they can see coming.

**Outcomes or per-resolution pricing.** Charge when the feature *works* — per resolved ticket, per qualified lead, per completed booking. Beautiful alignment, brutal bookkeeping: you need an attribution story the customer trusts, and revenue becomes lumpy because outcomes are lumpy. Reserved for features with a measurable, auditable definition of success.

## Communicating limits without looking scared

The failure mode isn't having limits; it's discovering them. Users accept caps, throttles and tiers with good grace when three conditions hold:

1. **The limit is stated in the plan page, in numbers.** "Generous monthly allowance" is a limit wearing a fake moustache. Write the number. If you're embarrassed to write it, the number is wrong.
2. **Approaching the limit is visible.** A meter, a heads-up at 80%, never a wall. The 47 pricing pages we tore down for a SaaS client last year shared one sin: the first mention of the cap was the error message when you hit it.
3. **The overage path is a feature, not a punishment.** "You've used your 300 summaries — add 100 more for $9, or upgrade" respects the user. A dead "limit reached" toast does not.

One more piece of honesty: say *why* the limit exists in one plain sentence. "AI features have real compute costs, so plans include an allowance that keeps the product fast and fairly priced for everyone" defuses the suspicion that your cap is a dark pattern. Limits explained read as stewardship; limits hidden read as a trap.

## Tiering: where the AI feature lives

Should AI be the entry point, the mid-tier upsell, or the enterprise garnish? Decide with three questions: Is the AI the reason people buy, or the reason they stay? Does the cost curve scale with company size? Does the lower tier's unit economics survive AI at scale?

What's worked in our engagements: **let every tier taste the feature with a small allowance, and reserve volume for the tiers where the usage is.** When [Larklight rebuilt its marketing site and packaging](/work/larklight-saas-marketing-site), the AI assistant shipped to every plan with a modest allowance and a clear upgrade story attached to volume — trial users experienced the magic, expansion revenue had somewhere to go, and nobody's free tier became a compute bonfire. The universal allowance acts as a demo that sells itself; the allowance ceiling is the upgrade prompt you don't have to write.

Avoid the two classic mistakes: AI gated entirely behind enterprise (you've paid to build a feature five percent of accounts touch, and the market learns your story without the magic), and AI free at the bottom with no ceiling (your least profitable users consume your most expensive compute, forever).

## Margin drift: the cost curve moves under you

Here's the uncomfortable part: your pricing page is a bet against a moving vendor price list. Model prices per token have fallen steeply and will keep falling — but adoption also rises, context windows grow, and the mix shifts toward modalities (audio, video) that eat the savings. Net effect: margin drifts, in both directions, all the time. Treat AI margin like infrastructure SLOs:

- **Dashboard it monthly.** Cost per action, cost per active AI user, allowance utilisation per tier, and the ratio of AI COGS to AI-attributed revenue. If you can't produce these four numbers, you don't have AI pricing; you have AI vibes.
- **Alarm on the shoulder, not the cliff.** Alert when cost per action moves more than, say, 20% in a month, or when allowance utilisation breaches your design band (we aim for 3–8% of seats hitting caps). Waiting for the invoice is a quarter too late.
- **Renegotiate the packaging, not the principle.** When a vendor price cut halves your cost per action, you have a choice: bank the margin or pass it through as bigger allowances. Passing some through buys loyalty cheaply; banking some is honest too. What you can't do is nothing, twice, and then pretend the spreadsheet from 2024 is still true.

Our own [pricing and engagement page](/pricing) follows the same philosophy: numbers stated plainly, limits in the open, and a structure that survives contact with the real world. Price your AI the way you'd want to buy it.

## Key takeaways

- Meter cost per *action* in production before packaging anything; design against the distribution's shoulder, not its mean.
- Match packaging to the cost curve: flat-and-cheap gets bundled, linear gets credits or allowances, convex gets hard ceilings.
- "Guardrailed unlimited" with a published number and a graceful overage path is the best default for most B2B tools.
- Limits stated, visible and explained beat "unlimited" asterisks every time — users forgive ceilings they can see coming.
- AI margin drifts monthly in both directions. Dashboard it, alarm early, renegotiate packaging calmly.

## FAQ

**Should we charge separately for AI, or include it in the plan price?** Include the magic in the plan when it's the product's core promise or flat-cheap to serve — splitting it out makes the headline price look better but cuts adoption exactly where you want wow. Meter it separately when usage varies tenfold between customers of the same size, because bundling then subsidises the heaviest users at everyone else's expense. Many mature offerings do both: a real allowance in-plan, overage billed.

**Are credits too complicated for a consumer product?** Usually, yes. Consumers don't want currency maths inside a $12 app. Prefer clearly labelled monthly quotas in human units ("200 summaries a month") with a reset date, or tiered unlimited where throttling at the extreme tail protects you quietly. Save explicit credits for prosumer tools where discrete actions are priced and legible.

**How do we handle a user who burns through their allowance in a day?** First, check whether it's fraud (scripted abuse, shared accounts) or delight (a team genuinely getting value). Fraud gets rate limits and terms enforcement; delight gets a sales conversation and a bigger plan. Either way the interface should pause gracefully with a written way forward — never silently degrade quality, which teaches users the product got worse, not that they hit a limit.

**When model prices fall, should we cut our prices?** Not automatically. Recompute your cost per action, then choose: expand allowances, improve quality per action, or hold price and harvest margin. Publicly lowering prices trains customers to expect a race to zero; expanding what the plan *includes* captures the same goodwill while keeping your price points stable.
