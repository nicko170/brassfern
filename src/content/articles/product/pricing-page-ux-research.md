---
title: "What 30 pricing pages taught us about clarity"
description: "A research review of SaaS pricing pages: tier naming that means something, comparison tables that aren't mazes, honest annual toggles and enterprise patterns."
slug: pricing-page-ux-research
cluster: product
tags:
  - Pricing
  - Conversion
  - SaaS
  - UX research
date: 2026-04-08
author: Priya Nair
keywords:
  - pricing page ux
  - saas pricing design
  - pricing tiers psychology
  - pricing page conversion
readingTime: 9
---

Last year we sat down with thirty SaaS pricing pages — a mix of client sites, prospects' sites and category leaders — and scored them against a single question: *could a tired buyer, arriving cold, work out what to buy in under two minutes?* Nineteen of the thirty failed. Not because the prices were wrong. Because the page made purchasing feel like filing a tax return.

The pricing page is the most mechanically important page on a product site and, perversely, the one most often designed by committee drift: a tier added here, a feature row appended there, an enterprise carve-out bolted on after a big deal. Nobody ever redesigns the pricing page; it accretes. What follows is what the review taught us, in the order visitors actually meet the problems.

## Finding 1: tier names are positioning, not decoration

The clearest pages named their tiers after *who the tier is for*; the muddy pages named them after sizes of nothing. "Starter / Growth / Scale" tells a buyer to self-identify with an ambition. "Solo / Team / Company" tells them to count heads — an objective, checkable fact. Counting beats identifying every time, because a buyer can be wrong about their ambitions but not about their headcount, and a wrong self-identification is an abandoned page.

The worst pattern in the review — present on seven pages — was aspirational naming applied to a seat-counted product: a "Growth" tier that was simply "11–50 seats". The name promised a feeling; the checkout demanded a number. Every mismatch like that is a small betrayal, and small betrayals compound. Our rule now: name tiers for the buyer's reality (team size, workflow, stage), and if your product is seat-priced, say so in the tier logic. We unpacked the voice side of this in the [Copperline Mutual](/work/copperline-community-bank) work — a community bank whose product names were rewritten until a customer could repeat them back; the same test applies to any tier grid.

## Finding 2: comparison tables are navigating, not reading

Twenty-two of the thirty pages had full feature-comparison matrices. Buyers used almost none of them the way their designers hoped. Eye-tracking sessions on our own builds keep confirming the same reading pattern: nobody reads a matrix; people *hunt* it for the two or three rows they care about — SSO, audit logs, their integration of choice — and every extra row is camouflage for those rows.

Design implication, stated bluntly: the comparison table is a navigation structure, so design it as one. That means:

- **Group rows by concern, not by product surface** — Security, Integrations, Support — because buyers think in concerns.
- **Keep authoritative rows above the fold of the matrix**, not alphabetical or org-chart order.
- **Sticky tier headers**, so a 60-row table remains legible halfway down.
- **Write cells as answers**: "Unlimited" and "✗" are answers; "Available as add-on (contact us)" is a trap door — if you must gate something, say the price or say why not.

And the marketing-copy rows — "Beautiful interface ✓✓✓" — get cut. Every subjective row makes the objective rows less trustworthy. (All three tiers have the beautiful interface; the tick is theatre.)

## Finding 3: the annual toggle is a trust instrument

Every page in the review had an annual/monthly toggle. The honest implementations and the manipulative ones looked almost identical — that's the problem. The manipulative version anchors on the annual per-month price, defaults the toggle to annual or styles monthly as the broken option, and reveals the real monthly price only at checkout. It works, briefly. Then it shows up in churn and in support tickets with the subject line "I didn't agree to this."

The pattern we now ship: default to **monthly**, because that's the buyer's loss-aversion frame, and make the annual saving arithmetically explicit — "$29/user monthly, or $23/user billed annually (save $216/user/year)". Show totals, not just per-month slivers. A toggle is a discount negotiation happening in public; run it as plainly as you'd run it across a sales desk. If your annual discount can't survive being stated in dollars, the discount is the problem, not the copy.

## Finding 4: "Contact us" is a tier with no copy

The enterprise tier was the single weakest element across the review — routinely a grey card with a sales-assistant icon and nothing else. But enterprise buyers are also buyers: they arrive with procurement questions, and silence reads as "expensive and disorganised".

The good specimens answered the questions procurement actually asks, without publishing a price: deployment options, security certifications, SSO/SCIM, data residency, contract minimums, who implements it and how long that takes. That shifts "Contact us" from a gate to an invitation with known terms. On builds where we've added this layer (the pattern we used on the [Brightmarsh](/work/brightmarsh-onboarding) education platform), enterprise enquiries got fewer and *better* — further along the procurement path, shorter cycles. Illustrative as those numbers are, the direction is consistent: information self-selects buyers.

## Finding 5: the page's hardest job is the undecided

The review's most useful insight came from watching people fail. Visitors who bounced rarely disagreed with the prices — they couldn't locate themselves in the offer. "I don't know which of these I am." The fixes that worked weren't persuasive copy; they were orientation copy:

- A one-line "for" statement under each tier name ("For teams shipping their first product").
- A recommended-tier marker chosen by *fit logic you can defend*, not by margin — and labelled as such: "Most teams your size start here." The moment the highlight smells like the company's preference rather than the buyer's, the whole grid loses credibility.
- A graceful escape for the genuinely hybrid buyer: "Between tiers? Usage grows with you — upgrade when you hit limits, nothing breaks."

## What clarity costs (and returns)

None of this is free. Tier renaming touches billing systems, sales decks and every existing proposal. Honest toggles remove a dark pattern that was quietly contributing double-digit percentages of first-receipt revenue on more than one page we audited. That's real money, and the honest conversation with a CFO is about the second quarter, not the first: refund rates, churn cohorts of "tricked" annual buyers, sales-cycle length for enterprise deals.

But clarity is measurable, which is its superpower. Pricing pages respond beautifully to experimentation — the traffic is qualified and the conversion event is unambiguous. Baseline the page, change one structural thing at a time, pre-register your kill criteria, and let the numbers argue. That's the whole [growth practice](/services/growth) — and if your pricing page is due for this treatment, the [Sundial Travel](/work/sundial-travel-booking) booking rebuild is a nice example of what happens when buying-path clarity is the design brief rather than an afterthought.

## Key takeaways

- Name tiers after the buyer's reality (headcount, workflow, stage), never after abstract ambition.
- Design comparison tables as navigation: grouped by concern, sticky headers, cells written as answers.
- Default the billing toggle to monthly and state annual savings in dollars per year.
- Give "Contact us" real content — procurement questions answered is what turns a gate into an invitation.
- Optimise for the undecided with fit statements, a defensible recommendation and an honest escape hatch.
- Pricing pages are the best experiment surface on your site; change one thing, measure, repeat.

## Frequently asked questions

**How many tiers should a pricing page have?**
Three visible tiers is the reliable maximum; four works only when the fourth is a clearly demarcated enterprise lane. Beyond that, choice paralysis sets in and the page stops being a decision aid. If your packaging genuinely has more options, the fix is a "plan finder" question or a calculator — something that converts choice into a guided pick the [product practice](/services/product) can prototype quickly.

**Should we show prices at all, or gate them behind a demo?**
If any competitor shows prices, show yours. Gated pricing doesn't create scarcity; it creates suspicion and hands the initiative to whoever publishes. The legitimate exceptions — genuinely bespoke deployments, regulated pricing — should say *why* the price isn't shown and what a ballpark looks like.

**Where does the FAQ go — pricing page or support docs?**
On the pricing page, below the grid, written for purchase anxiety rather than product usage: refunds, seat changes mid-cycle, what happens at limits, contract terms. Purchase-stage questions answered in place measurably outperform the same answers hiding in docs, and they feed [structured-data](/journal/web-design/designing-404-pages) rich-result eligibility when marked up properly.

**How often should pricing pages be redesigned?**
Structure rarely; copy and experiments continuously. A pricing page should change as often as your packaging evolves, but a full visual redesign more than once a year usually signals internal churn, not user need. Instrument it well and let small, tested iterations carry the load.
