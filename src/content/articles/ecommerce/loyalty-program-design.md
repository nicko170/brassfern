---
title: "Loyalty programs people don't resent"
description: "Most loyalty programs are bribery with a spreadsheet. Designing points worth earning, tiers without manipulation, and proof the program changes behaviour."
slug: loyalty-program-design
cluster: ecommerce
tags: [loyalty programs, retention, rewards ux, customer lifetime value, ecommerce strategy]
date: 2026-04-15
author: Priya Nair
keywords: [loyalty program design, loyalty ux, rewards program ux, customer retention design]
readingTime: 8
---

Most loyalty programs fail in a quietly expensive way. They launch with a burst of sign-ups — because "join and get 10% off" would sign anyone — and then settle into their real function: an automated discount machine for customers who were going to buy anyway, funded by margin, reported on with vanity metrics like "member count". The program doesn't create loyalty; it taxes revenue from the already-loyal and calls it retention.

A loyalty program worth building starts from a harder premise: loyalty is *behaviour change you can measure*, not enrolment you can count. Everything below follows from that.

## Start with the behaviour, not the rewards

Before any points mechanic exists, answer one question with numbers: **which customer behaviour, increased by what amount, pays for this program?** The candidates are few:

- **Frequency** — the classic. Moving a twice-a-year customer to three times a year compounds beautifully.
- **Second-purchase rate** — for most stores, the highest-value gap in the entire business is between first and second order. A program aimed here can be startlingly cheap because the prize is so large.
- **Category breadth** — customers who buy across two or three categories churn at a fraction of single-category buyers.
- **Advocacy** — referrals and reviews, where genuine.

Pick *one* primary behaviour. Programs that try to reward everything reward nothing legibly. For the [Hearthbrew subscription club](/work/hearthbrew-subscription-club), the target was explicit: convert occasional buyers into subscribers and keep subscribers past month three — which shaped everything from the reward cadence to the [skip-and-swap mechanics](/journal/ecommerce/subscription-ux-design). Points had to serve that behaviour, not decorate an account page.

## Points design: clarity is the mechanic

The single most common loyalty UX failure is that customers cannot answer "what do I get and when?" If the answer requires a calculator, the program is an accounting product, not a loyalty product.

**The earn rate stays visible at the point of decision.** Points earned *this order* shown in the cart and on the PDP — not buried in a dashboard. "This roast earns you 48 points" does more behavioural work than a balance page, because it attaches the program to the moment of desire.

**One currency, one metaphor.** Points that convert to dollars at an unstable or unexplained rate breed low-grade resentment. Fixed, memorable maths — 100 points = $5 — or skip points entirely and use punch-card mechanics (buy eight, the ninth is on us), which remain the most legible loyalty design ever shipped.

**Expiry policy is where programs confess their values.** Points that expire in 90 days are a pressure device wearing a reward costume; customers learn it and recall it as a small betrayal at exactly the moment you wanted warmth. Long or no expiry, generous warnings before anything lapses, and never a silent forfeiture.

**The balance is everywhere or nowhere.** A points balance should follow the customer — header, cart, checkout, emails — or don't build the program. A balance only visible in an account sub-page is a program that's already over.

## Tiers without the trap mechanics

Tiers work because status is motivating; they fail when the motivation tips into anxiety. The honest version:

**Progress is always visible and fairly framed.** "You're $40 from Gold" is motivation. "You're $960 from Platinum" — technically the same design, psychologically a taunt — is how programs teach customers the tier isn't for them. Chunk the gap into attainable-feeling steps, and celebrate the current tier's benefits genuinely rather than holding them hostage to the next one.

**Status is earned, never teased.** Showing a customer the Gold lounge they can't enter is an airline move, and even airlines are quietly regretting it. Tier benefits you don't qualify for shouldn't be on your page as a locked-preview catalogue of exclusion. Describe them; don't wave the key under the customer's nose.

**Devaluation is a breach of contract, treat it that way.** Every program eventually faces the margin meeting where someone proposes making points worth less. If you must devalue, do it with notice, grandfathering, and an honest explanation — the same candour standard as subscription price rises. A silent devaluation converts your most engaged customers into your most credible critics, and they will do the maths, in public, with screenshots.

**The top tier should be short on maths and long on meaning.** The benefits whales actually value are access and recognition — early releases, a human who knows their name, input into what's next — which are *cheaper than discounts* and can't be comparison-shopped. A top tier that is merely "more cashback" has no defence against a competitor offering more cashback.

## Discovery UX: the program nobody finds can't work

Program enrolment UX is usually a checkout checkbox and a buried footer link. The touchpoints that actually grow membership with the *right* members:

- **Post-purchase, not pre-purchase.** The moment after order one — confirmation page and email — is the honest high-intent moment: "You just earned 62 points. Want them?" Enrolment that retroactively credits the purchase just made converts better and starts the relationship generously instead of transactionally.
- **Order tracking and delivery emails.** The highest-open-rate messages a store sends. A points balance line in the delivery email costs nothing and reminds at a warm moment.
- **The return flow.** A customer mid-return offered bonus credit instead of refund — clearly optional, refund untouched, as discussed in our [returns UX piece](/journal/ecommerce/returns-ux-design) — is a loyalty-building offer, not a dark pattern, because the alternative remains fully available.
- **In-box and packaging.** Physical touchpoints for physical goods: the card in the parcel is read at the highest-attention moment of the entire relationship.

Checkout enrolment checkboxes still exist, but pre-ticked boxes and forced account creation are exactly the resentments that make people hate programs. Opt-in, plainly worded, skippable without guilt-tripping copy.

## Prove it or kill it: measuring real behaviour change

Here's where most programs get away with murder, because measurement is hard and "member count" is easy. The honest dashboard:

**Incrementality, not gross member revenue.** Members will always outspend non-members — high-intent customers self-select into programs. That comparison is worthless. What you need is a difference-in-differences view: did members' behaviour change *more* after joining than a matched cohort of similar non-members changed over the same period? If your tools can't do this, build holdouts: a slice of eligible customers who aren't shown the program, tracked quietly for two quarters. The same discipline we bring to [CRO experimentation](/journal/growth/cro-experiment-design) applies — pre-registered kill criteria included.

**Second-purchase rate and time-to-second-order.** If this doesn't move for members, the program is a discount scheme; rename it accordingly and check whether the discount would be cheaper as a plain price cut.

**Program P&L, in the open.** Reward costs, platform fees, and the discount cannibalisation estimate on one side; incremental margin on the other, with the attribution method labelled. If it's not clearly positive after a year, say so and fix or fold it. The programs that survive honest accounting are a minority, and they're worth five times the others.

**Churn signals.** Redemption rate is a health metric: members who never redeem are accruing a liability and receiving no emotional payoff — the worst of both sides. Prompt redemption; a redeemed reward creates a visit, and visits create orders.

## When not to build one

Honesty requires the negative case. Skip the program when: purchase frequency is naturally annual (a mattress store punch card is a joke the customer is in on); margins can't fund real rewards without devaluation tricks; or the product experience still has fixable friction — a loyalty program layered over a painful [checkout](/journal/ecommerce/checkout-friction-audit) or an unreliable delivery promise is lipstick on operational debt. Fix the fundamentals; loyalty is a multiplier of an experience already worth repeating.

## Key takeaways

- Define the one behaviour the program exists to change — usually frequency or second-purchase rate — and let it shape every mechanic.
- Keep the maths legible: visible earn rates at decision moments, one stable currency, generous expiry, balance everywhere.
- Tiers motivate with visible attainable progress, earned-not-teased status, and top-tier benefits built on access and meaning, not more cashback.
- Grow membership at warm moments — post-purchase, delivery emails, returns, packaging — always opt-in, never pre-ticked.
- Measure incrementally with holdouts and cohorts, publish the program P&L internally, and be willing to fold a program that fails its own audit.

## FAQ

**Points or tiers or subscriptions — which model?**
They solve different problems. Points reward accumulated behaviour; tiers reward *status level*; paid memberships (subscribe-and-save, Prime-alikes) monetise commitment directly. Many good programs layer two; few survive all three without confusing their customers.

**How generous should rewards be?**
Model it backwards from target behaviour-cost: what is moving a customer to one extra order a year worth in margin? Fund the program at a sensible fraction of that, and keep the earn rate honest — 2–5% effective value is the range where maths stays legible and finance stays calm.

**When should we launch a program — at what size?**
When you have enough repeat purchase to observe the behaviour you want to improve, and enough order volume to measure change against a holdout. Below that, invest in retention fundamentals: post-purchase emails, service quality, and product breadth.

**Should loyalty points integrate with referrals and reviews?**
Carefully. Rewarding referrals works; rewarding reviews contaminates review honesty and can breach platform guidelines. If you must incentivise reviews, reward the act, never the stars.

**What's the fastest loyalty win without building a full program?**
The post-purchase retroactive enrolment email — "your order earned you credit" — pointed at store credit rather than a formal program. It tests the appetite for the mechanic at a hundredth of the build cost.

*Retention economics run through every [e-commerce engagement](/services/ecommerce) we take on — programs included, illusions optional.*
