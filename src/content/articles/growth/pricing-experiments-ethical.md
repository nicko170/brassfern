---
title: "Experimenting on pricing pages without lying"
description: "You can test framing, proof and order on a pricing page. You can't charge different visitors different prices and keep their trust. Where the line sits."
slug: pricing-experiments-ethical
cluster: growth
tags: [cro, pricing, experimentation, ethics, b2b]
date: 2026-03-14
author: Sam Whitfield
keywords: [pricing page testing, A/B testing ethics, pricing experiments, CRO honesty, growth experiments]
readingTime: 9
---

The pricing page is where experimentation programs lose their conscience. Every CRO blog will tell you to "test your pricing," and most of them mean well, but the advice blurs a line that matters: there is a difference between testing how you *present* a price and testing who *pays* it. The first is craft. The second is a slow leak in the tank of trust, and in B2B — where your buyers talk to each other in Slacks you'll never see — the leak drains faster than the experiment can ever fill it.

We run pricing-page experiments for clients and for ourselves. We also refuse whole categories of them. Here's where we draw the line, what you can test safely, and how to handle the deeply inconvenient truth that most B2B pricing pages don't have the traffic for proper A/B tests anyway.

## The line, drawn in advance

One rule covers most of it: **everyone who visits on the same day must be able to arrive at the same price on the same terms, and be able to prove it to each other.**

That rules out the classics of growth-team temptation:

- **Segmented price display.** Showing enterprise-looking visitors (by IP, by referrer, by company-size enrichment) a higher number than bootstrapped-looking ones. Buyers compare notes at conferences. Someone screenshots both variants in the same thread and you are now the story of the week.
- **Fake scarcity.** "Only 2 seats left at this price" on a product with unlimited seats. Countdown timers that reset. These convert, briefly, and then they compound as reputation.
- **Sneaky default billing.** Annual preselected with monthly hidden behind a scroll, cancellation that requires a phone call to cancel what a click started. These aren't experiments; they're extractions wearing an experiment's lab coat.
- **Randomised sticker prices.** Person A sees $49, person B sees $59, assignment by cookie. Even when legal, it's a fairness landmine — and the "winning" variant is often just the one shown to luckier traffic.

The test for any idea, before any statistics: would we be comfortable printing the experiment design in the site's FAQ? If the answer involves the phrase "well, technically," it's out.

## What you may safely vary

Which is still a lot. The honest experimental surface on a pricing page is bigger than most teams bother to use:

- **Framing and anchoring.** The order of plans (ascending vs descending), which plan is visually marked as most popular, whether the expensive tier leads to make the middle one look sane. You're varying the comparison set, not the numbers.
- **Proof placement.** Which testimonial sits next to the price, whether logos go above or below the fold, whether the guarantee is stated beside the CTA or buried in the FAQ. Trust signals move decisions more reliably than price tweaks do.
- **Copy and naming.** Headline, plan names, CTA microcopy, how the annual discount is phrased. "Save two months" and "ten for the price of twelve" are the same offer with measurably different comprehension.
- **Information density.** Expandable feature tables vs full matrices, FAQ length, whether the comparison table covers three competitors or eight. Comprehension is a conversion variable.
- **Structure vs substance.** The general principle: vary the telling, never the substance. Every variant must lead to the same checkout with the same terms.

There's one grey zone worth naming: **defaults**. Preselecting the annual toggle is a design decision that behaves like a nudge. Our rule is that a preselection must be genuinely better for the median customer *and* reversible in one click, with the monthly figure visible without interaction. If you have to argue the median customer prefers it, they don't.

## The uncomfortable maths of B2B traffic

Now the part the testing tools won't tell you. A healthy B2B services or SaaS pricing page might see 2,000–4,000 unique visitors a month, of whom perhaps 3–5% take the target action — start a trial, book a call, begin checkout. Call it 120 conversions a month. To detect a 15% *relative* lift on that baseline at conventional power, you're waiting most of a quarter for a single A/B test to resolve, and by then the traffic composition has shifted under you (campaigns launch, seasons turn, a competitor implodes) and the result is confounded anyway.

We've covered the statistics proper in [A/B testing statistics for people who ship](/journal/growth/ab-testing-honest-statistics); the short version here is that low-traffic pricing pages call for a different shape of experimentation:

1. **Big swings, not micro-tweaks.** When you can't resolve small effects, don't test small things. Restructure the page — plan order, proof architecture, the whole argument — rather than nudging button colours that a low-powered test could never judge honestly anyway.
2. **Sequential windows over split traffic.** Variant A for four weeks, variant B for the next four, compared against the year's seasonal shape rather than against a simultaneous control. Less clean than a randomised split, more honest than pretending a two-week tie-breaker means anything.
3. **Qualitative weight.** Five recorded sales calls where a prospect quotes your pricing FAQ back at you are evidence. Ten moderated sessions watching buyers parse the page are evidence. On low-traffic pages, the qualitative-to-quantitative ratio should invert relative to a consumer site.
4. **Kill criteria, pre-registered.** Before anything ships, write down: the primary metric, the smallest effect worth acting on, the maximum duration, and what you'll do if it's inconclusive. I end more of my own tests than anyone else's on this team, and the kill criteria are why — they make stopping cheap, because stopping was the plan, not the failure.

## When the test resolves to 'shrug'

The most common honest outcome of a pricing experiment is *not conclusive*. The cargo-cult response is to wait for significance forever (the page rots) or to call p=0.13 a win (you've invented a fact). The grown-up response is a decision journal entry: the effect estimate, the uncertainty around it, the *cost of being wrong in each direction*, and the reversibility of shipping.

A restructure that's easy to roll back, roughly neutral in the data, and strongly preferred in moderated sessions? Ship it and watch. A plan-name change that's ambiguous and touches every email template, proposal deck and sales script? The switching cost is the deciding factor, and it's allowed to be. This is the same posture as [heuristic CRO audits](/journal/growth/heuristic-cro-audits): fix the obvious without a test, test the uncertain, and never let the testing apparatus veto judgement it was never precise enough to have.

## Tell people

The cheapest trust move on a pricing page costs one sentence. Ours reads, in the pricing FAQ, some version of: *"Our prices are the same for everyone at a given moment. We occasionally change how we present them; we never change who pays them."* It heads off the "did my colleague get a different quote?" paranoia, it disciplines the team (the sentence is a promise you now have to keep), and it quietly differentiates you from every competitor whose growth team is running the darker playbook.

If you run experiments at all, consider publishing the stance — even the log. The companies that treat their experimentation program as something a customer might read, and nod at, are the ones whose pricing pages are still trusted in year five. Which, in the end, is the only metric a pricing page is for.

## Key takeaways

- Draw the line before you need it: same day, same price, same terms, provable between strangers.
- Vary framing, proof, copy and density. Never vary who pays what, scarcity claims, or billing defaults that punish inattention.
- Low-traffic B2B pricing pages can't resolve small effects — test big structural swings, use sequential windows, and let qualitative evidence carry real weight.
- Pre-register kill criteria so that stopping is the plan, not the defeat.
- Answer "inconclusive" with a decision journal: effect estimate, cost of each error, reversibility — then decide and move.
- Put the fairness promise in writing, in public, where buyers and your own team can both hold you to it.

## Frequently asked questions

**Isn't testing different prices on different people just price discrimination, like airlines do?**
Airlines price by *product* (fare class, flexibility, timing) that any customer can choose. Covert person-level pricing hides the product itself. The first survives a screenshot; the second doesn't.

**How much traffic do I need before split-testing a pricing page is worthwhile?**
As a rule of thumb, if the page produces fewer than a few hundred primary conversions a month, a two-variant test on a realistic effect size will take quarters, not weeks. Below that threshold, restructure boldly and validate qualitatively instead of split-testing timidly.

**Can we ever change actual prices experimentally?**
Yes — over time, openly. Change the price for everyone, grandparent or clearly communicate existing customers' terms, and observe. Time-based variation with honest communication is commerce; person-based covert variation is the thing to avoid.

**What about geo-based pricing?**
Purchasing-power parity pricing, stated openly ("prices adjust by region"), is defensible and often generous. Geo-*stealth* — claiming one price while quietly serving another — fails the screenshot test. Openness is the whole difference.

**Where should our experimentation rules live?**
One page, written down, owned by a named person, reviewed whenever someone proposes something that makes the room go quiet. If it's in a deck nobody opens, you don't have rules — you have intentions.
