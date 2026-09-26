---
title: "Winback flows: the cheapest revenue you're not earning"
description: "Lapsed customers already know you, trust your checkout and cost nothing to acquire. Designing winback flows that reactivate without discount-spamming the loyal."
slug: winback-email-flows
cluster: growth
tags: [lifecycle email, winback, retention, email marketing, discounting]
date: 2026-03-18
author: Priya Nair
keywords: [winback email campaign, lapsed customer reactivation, lifecycle email flows, email sunset policy, retention marketing]
readingTime: 10
---

Every store we've audited has the same quiet spreadsheet hiding in its customer base: tens of thousands of people who bought, were satisfied enough not to complain, and then simply drifted. Not angry. Not churned by decision. Just gone. They already know the brand, they've already survived the checkout, their card details are on file — and the blended cost of reactivating one of them is a fraction of acquiring a stranger. Winback is, almost without exception, the cheapest revenue a growth programme can find.

It is also the flow most often done badly: a single "We miss you! Here's 15% off" blasted at anyone who hasn't ordered in a while, subsidising people who were about to return anyway, while genuinely lost customers get one generic nudge and a discount they didn't need a reason to ignore. A real winback flow is designed — definition, arc, hygiene, measurement — like any other part of the [lifecycle email programme](/journal/growth/lifecycle-email-architecture). Here's the whole design.

## Define "lapsed" like an analyst, not a copywriter

"Lapsed" is a per-product definition, and getting it wrong makes every downstream number meaningless. The derivation takes ten minutes:

1. **Find the natural repurchase interval.** For repeat buyers, compute the distribution of days between orders. Look at the median and the 75th percentile, not the mean.
2. **Set the lapsed threshold well past the natural interval.** A customer two days past their median gap isn't lapsed — they're on schedule. We typically set "lapsed" at roughly twice the median interval, and "deeply lapsed" at three to four times.
3. **Segment by interval, not by calendar.** A monthly consumable (coffee, skincare) lapses fast; a quarterly purchase (wine cases, pet food) lapses slow; a considered annual purchase may need a year of silence before anything is wrong. One 90-day rule for all three is a category error wearing a segment.

For the [Hearthbrew subscription club](/work/hearthbrew-subscription-club), "lapsed" doesn't mean "hasn't bought in 90 days" — it means a subscriber who skipped twice consecutively, or a one-time buyer 60 days past their bean's expected consumption. The store knows the cadence; the definition should too. Non-repeat purchisers — someone who bought a kettle — shouldn't be in a winback flow at all; they belong in cross-sell, which is a different conversation.

## The three-touch arc

Winback flows that work share a shape: three emails, escalating in effort and honesty, each with a distinct job. The discount is the *second* email, not the first.

**Touch one — remind (no discount).** Sent at the lapsed threshold. The job is recall, not bribery: what they bought, what's new since, one click back to the store. Skincare reshows their exact product with a "running low?" frame; consumables do the arithmetic for them ("a 1kg bag lasts about five weeks — you're at nine"). A startling share of winback revenue happens here, from customers who just needed reminding. Every one of them you discount in touch two is margin you lit on fire.

**Touch two — incentivise (the earned discount).** Sent roughly one natural interval after touch one, to non-responders only. Now the offer, framed as an ending ("this one's got a shelf life — two weeks") rather than as ambient availability. Keep it modest: the goal is to tip a fence-sitter, not to retrain the base to wait for coupons. Dollar-off beats percentage for most AOVs; "free shipping" beats both where margin allows, and it never anchors the product price downward.

**Touch three — say goodbye (honestly).** Sent at the deeply-lapsed threshold. The best-performing final email is the least salesy: "We'll stop emailing about restocks — if you're done, no hard feelings; if you're not, one click keeps you on the list." This email does three jobs at once: it's a genuine reactivation surface (goodbye emails have oddly high click rates — loss aversion, ethically used), it's a suppression-hygiene instrument, and it's the moment the brand behaves like an adult, which some customers remember for years. It rhymes with the principle behind [cancellation flows that leave the door open](/journal/product/cancellation-flows-respect): the exit handled with grace *is* the retention play.

Two structural rules wrap the arc. First, **suppress the moment they buy** — nothing erodes trust like a "we miss you" email arriving three days after an order, and it happens constantly on stores where the winback segment updates nightly. Second, **branch by history**: a customer with five prior orders gets a different remind (her name is known, her taste is known) than a one-time buyer, whose lapse may mean the product disappointed and whose touch-one should ask, not sell.

## Suppression hygiene and the sunset policy

The unglamorous other half of winback is *not sending*. Chronic non-openers drag your sender reputation down for everyone — deliverability is a commons, and every ISP is watching your engagement ratios. Our [deliverability fundamentals](/journal/growth/email-deliverability-fundamentals) piece covers the mechanics; the winback-relevant rule is simple: after the goodbye email, non-responders go on a **sunset policy** — suppressed from marketing email, still reachable for transactional, re-eligible the moment they return and buy on their own.

Teams resist this because it shrinks the list-size number they report upward. Counter it with the sendable-revenue number: revenue per *thousand delivered* rises when you stop mailing the dead weight, and the list-size vanity metric quietly re-prices itself. A list of 40,000 engaged beats a list of 120,000 that Gmail has learned to bury.

## Measuring incrementality: the holdout is non-negotiable

Here is where most winback programmes lie to themselves. Default attribution — "the flow generated $X" — counts every purchase within the attribution window after any email touch, including all the people who would have come back anyway. Lapsed customers return spontaneously at a meaningful rate; season alone resurrects a chunk of them. The flow gets credited, the CFO funds the discount budget, and no one can say what was actually bought.

The fix is a standing **holdout**: a randomly chosen 5–10% of the lapsed segment who receive nothing. Compare reactivation rates between mailed and held-out groups and you get the flow's true lift — the only number that should fund the programme. The mechanics and the politics of holdouts are covered in our piece on [CRO experiments worth running](/journal/growth/cro-experiments-that-matter); for winback specifically, expect the honest lift to be substantially smaller than the dashboard number, and expect the honest number to *still* clear its cost comfortably. That's the nice thing about cheap revenue: it survives honest measurement.

Holdouts also settle the discount argument empirically. Run touch-two with discount vs. without, both against the holdout. On several programmes we've instrumented, the discount moved reactivation less than expected while eroding margin on would-have-returned customers — and the winning configuration was a smaller discount sent later. You don't know yours until you hold out.

## Where winback sits in the programme

Sequence matters. Winback is cheap, but it's downstream of the flows that *prevent* lapse: post-purchase education, replenishment timing, [subscription mechanics that make skipping easy](/journal/ecommerce/subscription-ux-design). A store that pours customers into a leaky retention bucket and then runs brilliant winback is doing expensive cardio. In a [growth engagement](/services/growth), we build the prevention flows first, then design winback against whatever still lapses — which is always less, and lapses for more interesting reasons, than the team expected.

Then let it run. Winback is the rare growth surface that genuinely benefits from set-and-occasionally-audit: quarterly, recompute the lapsed thresholds as the customer base shifts, refresh the touch-one content so it's never stale, and re-verify the holdout is actually held out. Everything else is cadence and craft.

## Key takeaways

- "Lapsed" is derived from your repurchase interval distribution — roughly twice the median gap — never from a global 90-day rule.
- Three touches: remind (no discount), incentivise (earned, modest, expiring), say goodbye (honest). The discount is never the opener.
- Suppress on purchase instantly; branch the arc by order history.
- Sunset the non-responders. Deliverability is a commons; list size is a vanity metric.
- A permanent 5–10% holdout is the only honest measure of winback lift — and usually proves smaller discounts would have done.
- Build lapse-prevention flows first; winback is for what still leaks.

## FAQ

**What winback rate should we expect?** It varies enormously by category, cadence definition and how long lapses have been ignored. As a sanity anchor: a well-built three-touch arc reactivating a low single-digit percentage of the lapsed segment is already excellent economics, because the segment costs nothing to reach. Beware anyone quoting double-digit reactivation without a holdout next to it.

**Should winback discounts stack with everything?** No. Code the offer to exclude sale items and existing promos, or your winback margin maths becomes a choose-your-own-adventure. And never let a customer qualify for winback repeatedly without buying in between — "winback farmer" segments exist, and they were trained by us.

**Email only, or SMS and direct mail too?** Email is where the arc lives because it's cheap and rich. SMS works for touch two on high-intent segments where you have real consent — and nowhere else; an unsolicited "we miss you" text reads like an ex, not a brand. Direct mail is surprisingly effective in high-AOV categories precisely because nobody expects it.

**We're starting from zero — what's week one?** Week one is definition and plumbing: compute the interval distribution, build the lapsed segment, confirm suppression-on-purchase works, and set up the holdout. The emails are week two. Teams that write copy first ship a flow that measures nothing, which is worse than not shipping — a theme we return to throughout our [resources and playbooks](/resources). Measure first, persuade second.
