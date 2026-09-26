---
title: "Loyalty programs that don't treat customers like lab rats"
description: "The line between a loyalty program and a manipulation engine is design, not intent. An audit of the dark patterns, plus the honest maths that make one worth it."
slug: loyalty-without-dark-patterns
cluster: ecommerce
tags: [loyalty programs, dark patterns, retention, customer trust, ecommerce ethics]
date: 2026-06-24
author: Sam Whitfield
keywords: [loyalty program design, loyalty dark patterns, retention ecommerce, points programs, customer loyalty UX]
readingTime: 10
---

Somewhere between the punch card and the app, loyalty programs stopped being "buy nine coffees, the tenth is ours" and became behavioural slot machines. Points that expire without warning. Tiers engineered for breakage. Confetti animations celebrating a reward worth less than the email that announced it cost to send. The industry calls these mechanics "engagement levers". Customers call them what they are, eventually, usually in a one-star review.

The uncomfortable truth: most loyalty dark patterns aren't designed by villains. They're designed by teams optimising a metric — enrolments, monthly active members, breakage rate — one defensible A/B test at a time, until the program is a manipulation engine with a brand guidelines PDF. Nobody chose the destination; everyone approved the turns. This piece is the audit we run to catch it: the patterns to refuse, the value maths to publish, and the honest version of when a loyalty program is worth building at all. (For the positive case — how to design the mechanics well — our sibling piece on [loyalty programs people don't resent](/journal/ecommerce/loyalty-program-design) covers the construction. This one is about what not to construct, and why it pays.)

## The dark-pattern inventory

These are the mechanics we flag on sight. Each has a metric it flatters and a trust account it drains.

**1. Breakage as a business model.** If your program's P&L assumes a large share of points never get redeemed, you haven't built a loyalty program — you've built a liability you hope customers forget about. The tell: expiry windows shorter than the natural purchase cycle. A store bought from twice a year whose points expire at 90 days has designed expiry as a confiscation schedule. Our rule: points live at least 24 months, expiry warnings go out at 60 and 14 days with a one-click way to redeem or give the value away, and the expiry policy is stated in one sentence at enrolment, not clause 14(b).

**2. The treadmill tier.** Tiers that demand increased spend to *retain* status convert loyalty into a threat. "You're $140 from losing Gold" is loss aversion with a logo. Status that resets annually should be announced as such with the real maths ("spend $600 in a year to keep these benefits") — and the benefits must survive the reset: if Gold meant free shipping, dropping a customer to paid shipping mid-relationship is a *new* price rise dressed as a program rule.

**3. Opacity in the earn rate.** "Earn points on every purchase!" without the number is a coupon with extra steps. If a customer can't compute "what is my next reward and how far am I?" in their head, the program is relying on confusion. Publish the rate as money: "$1 spent = 1 point; 200 points = $10 off. That's 5% back." If the honest sentence sounds unimpressive, the fix is the economics, not the copy.

**4. Gamified busywork.** Spin-to-win wheels, streaks, badges for opening the app, daily check-in bonuses at a store bought from monthly. These mechanics borrow casino engagement loops and point them at people who came to buy coffee. They boost "program engagement" metrics while teaching customers that your rewards are a game to be played rather than value to be banked — and games get abandoned the moment they're not fun.

**5. Enrolment as interception.** The checkout-blocking modal, the pre-ticked marketing consent inside enrolment, the discount that exists *only* if you join right now. First-order enrolment offers are legitimate; the dark version is when refusing the modal is harder than joining, or when "10% off" quietly includes a newsletter, an SMS program and a data-sharing clause. Consent bundled into a discount is neither.

**6. The redemption obstacle course.** Rewards that require a minimum spend above the average order, can't stack with anything, apply to full-price items only, and need a code typed at checkout. Each restriction was added to protect margin; collectively they mean the reward is marketing, not value. Measure *redemption friction* — how many earned rewards get used within 60 days — and treat a low number as a product failure, not a win.

**7. The exit tax.** Cancelling membership shouldn't involve a phone call, a retention specialist or a "we're sorry to see you go — are you sure?" three-screen flow. The same principle we apply to [subscription UX](/journal/ecommerce/subscription-ux-design) applies here: the exit must be as easy as the entrance, or the entrance was a trap.

## The trust ledger

Here's a frame we use with clients: every program interaction is a deposit or a withdrawal in a trust account, and the balance is visible to the customer even when the brand isn't looking.

The [Hearthbrew subscription club](/work/hearthbrew-subscription-club) runs this deliberately. Points never expire while you're a subscriber; the earn rate is stated as "5% back in credit, always"; skipping a month is one tap and keeps your streak ("we'd rather you skip than cancel" is the actual line in the UI). Nothing in it is clever. The clever part is commercial: members whose trust account stays in credit buy more often, churn less, and — this is the part dark-pattern programs never measure — *defend* the brand. Angry ex-members post screenshots. Banked-trust members post recommendations. One of those is an acquisition channel.

Dark patterns aren't just an ethics failure; they're a measurement failure. They move legible short-term metrics and destroy the illegible long-term ones — referral rate, unsubsidised repeat purchase, support sentiment. If your dashboard can't see trust, it will happily report the program's shadow as its substance.

## The honest value maths

Before designing any mechanic, run these three calculations. If they don't close, don't build the program — and that is a legitimate, cost-saving outcome.

**1. Cost of the reward as a percentage of the behaviour it buys.** A program moving second-purchase rate from 25% to 30% on a $90 average order with 60% gross margin buys real money: thousands of extra second orders, each with a downstream lifetime. A program discounting purchases that would have happened anyway buys nothing. Model both scenarios with your actual cohort data before a single point is specced. Our piece on [designing experiments you can believe](/journal/growth/cro-experiment-design) covers how to hold the line; the same discipline applies to program economics.

**2. Breakage honesty.** Write down the redemption rate you need for the program to be ethical (high enough that rewards are real) and the redemption rate your margin model assumes (low enough that rewards are affordable). If those two numbers can't be the same number, the program's business case *is* the dark pattern. Fix the economics — smaller, more frequent rewards usually beat big, rare, expiring ones.

**3. The alternative spend.** Loyalty programs compete for budget with unglamorous alternatives: faster dispatch, better packaging, a [returns experience](/journal/ecommerce/returns-ux-design) that converts a complaint into a repeat customer, or simply lower prices. For plenty of stores — especially those early in life or with naturally frequent purchase cycles — the highest-loyalty investment is operational excellence, and "our loyalty program is that everything works" is a complete and defensible strategy.

## When the answer is a punch card

The strongest argument in this entire piece is a physical object: the café punch card. Visible progress ("three stamps to go"), legible value ("the tenth is free"), zero surveillance, works without an app, expires never. Before building anything more complex, ask what your program does that a punch card can't — and whether that thing serves the customer or the dashboard.

Digital programs earn their complexity when they genuinely add something: credit that lives in your account across devices, early access that's actually early, rewards for behaviours beyond spend (reviews, referrals, recycling the packaging back). When we design these — usually as part of a broader [growth and retention engagement](/services/growth) — the punch card is the spec: visible progress, legible value, no traps. Everything beyond it must justify its existence to the customer, in the customer's language, on one screen.

## Key takeaways

- Loyalty dark patterns accumulate one defensible test at a time; audit the program whole, not the changes.
- Refuse the seven: breakage economics, treadmill tiers, opaque earn rates, casino mechanics, interception enrolment, redemption obstacle courses, exit taxes.
- Publish the value as money. If the honest sentence sounds thin, fix the economics.
- The trust account is real even when your dashboard can't see it: banked-trust members refer; burned members post screenshots.
- Run the three calculations — cost per behaviour, breakage honesty, alternative spend — before designing anything.
- The punch card is the benchmark. Complexity must beat it for the customer, not the reporting deck.

## FAQ

**Our existing program has some of these patterns. Fix quietly or apologise?** Fix visibly. "We've made points never expire and doubled what they were worth while they did" is one of the cheapest goodwill campaigns available to you, because the audience is people who already bought. Grandfather generously — the cohort you burned is the cohort watching how you treat the next one.

**Isn't some breakage just reality — people forget?** People forget, and honest programs design for that: reminders with a redemption path, donate-your-points options, balances printed on receipts and in order emails. The line is intent. Designing *for* forgetfulness (short windows, silent expiry) is the dark pattern; designing *against* it is the loyalty.

**Should tier status be spend-based at all?** Spend-based tiers are fine when the benefits are things a frequent customer actually values — shipping, early access, service priority — and when the threshold is attainable through *normal* behaviour, not aspirational overspend. A tier that requires a customer to change their life to reach it is a treadmill wearing a ribbon.

**Where does loyalty sit in a Brassfern engagement?** Usually downstream of the fundamentals. In an [e-commerce engagement](/services/ecommerce) we fix checkout, speed and merchandising first — because a loyalty program bolted onto a leaky funnel is decoration — then design retention mechanics, loyalty included, against measured cohort behaviour. The deliverable often includes the maths from this piece as a decision memo: build, simplify, or don't.
