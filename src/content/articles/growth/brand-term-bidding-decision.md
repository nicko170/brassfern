---
title: "Bidding on your own name: when brand PPC pays"
description: "Should you bid on your own brand terms? The incrementality test that answers it, the economics of defensive spend, conquesting ethics, and a spreadsheet to decide."
slug: brand-term-bidding-decision
cluster: growth
tags: [paid search, ppc, brand bidding, incrementality, growth strategy]
date: 2026-05-08
author: Priya Nair
keywords: [brand bidding, paid search strategy, ppc incrementality, brand keywords, conquesting]
readingTime: 8
---

"We'd rank first for our own name anyway. Why are we paying Google for clicks we already own?"

It's the right question, and it deserves a better answer than "everyone does it" or, worse, "the agency says brand converts well" — of course brand converts well; those people typed your name into a search box. The debate around brand-term bidding is a masterclass in the difference between *attributed* and *incremental* value, which is why it belongs in the same conversation as [attribution that admits what it doesn't know](/journal/growth/attribution-noise-decisions). Here's how we actually decide, with maths you can run in an afternoon.

## What brand spend is really buying

Strip the arguments down and there are exactly four honest reasons to bid on your own name:

1. **Defence.** A competitor's ad sits above your organic result on your own brand terms. Losing a customer who searched your name to a rival's headline is a particularly stupid way to churn.
2. **Message control.** Your organic listing says what Google chooses to show. An ad says what you choose: current offer, sitelinks to the pricing page, a lander tuned to intent. For brands mid-repositioning or running promotions, that control has real value.
3. **SERP real estate.** Owning both the top ad slot and the first organic result measurably increases total clicks on your properties and starves the results below — review sites, resellers, and that forum thread from 2023 where someone was angry.
4. **Genuine incrementality.** Sometimes brand ads do add clicks that wouldn't have happened organically — on navigational searches where the organic result is buried by aggregators, or from users who habitually click the first thing on the page, which is the ad.

And one dishonest reason that keeps budgets alive: brand campaigns flatter blended performance dashboards. Killing them makes the paid team's blended numbers look worse while the business loses almost nothing. Which is, of course, the entire problem.

## The incrementality test: geography is your friend

You cannot A/B test ads on users directly in most search platforms, but you can do the next best thing: a geo-split. It's the single most useful experiment in paid search, and the mechanics are simple:

1. **Split your market.** Divide your serviceable geography into matched pairs of regions — similar size, similar baseline brand search volume, similar revenue per capita. Ten to twenty regions total is plenty.
2. **Randomise.** Half the pairs keep brand bidding on; half go dark. Flip a coin, write it down, and put the design in your [experiment decision log](/journal/growth/ab-testing-honest-statistics) with pre-registered read dates. Four to six weeks is the usual window — long enough to wash out weekly cycles and any short-term wobble.
3. **Measure totals, not channels.** The question is never "did brand-ad clicks disappear?" (they will) but "what happened to total clicks and total conversions from brand searches?" Watch organic click-through on brand terms in the dark regions: if organic recovers 95% of the lost paid clicks, brand spend was buying you 5%.
4. **Cost it.** Incremental conversions ÷ incremental spend = your true brand CPA. Compare it against what that budget earns in any other channel.

We've run variants of this for clients across e-commerce and SaaS. The honest range of outcomes: organic recapture between 85% and 99%. At the high end — an established brand, no competitors bidding, clean SERP — brand spend is close to pure tax. At the low end — aggressive competitor conquesting, or a crowded SERP with marketplaces outranking you — the spend earns its keep and then some.

## The defensive economics

When a competitor is bidding on your name, the maths changes shape. Their ad above your organic result will siphon a slice of your highest-intent traffic — in the geos we've measured, typically 5–15% of brand-search clicks when uncontested, worse if their offer is sharp.

Your counter isn't just "bid too" — it's a cost calculation:

- **Your brand CPC is usually cheap.** Quality Score rewards you for being the actual brand. Defending your own name typically costs a fraction of what the competitor pays to attack it.
- **Their economics are worse than they look.** Conquesting clicks convert poorly — the searcher wanted *you* — so the competitor is paying premium CPCs for low-intent accidents. Many conquesting campaigns die of their own unit economics within two quarters.
- **Sometimes the answer is a polite email.** For partners, resellers, and affiliates bidding on your terms, a trademark-policy conversation and an amended agreement costs less than a bidding war. Legal channels exist for trademark infringement in ad copy for a reason.

## Conquesting: the ethics and the maths

Should *you* bid on competitors' names? The legal line in most markets: bidding on the keyword is generally permissible; using their trademark in your ad copy often isn't. Check your jurisdiction, keep their name out of the headline, and this is settled.

The harder question is whether it works. Honest scorecard from programmes we've run and audited: competitor-term CPCs run two to four times your brand terms' cost, conversion rates land at a third to a half, and the customers you win churn faster — they were loyal to someone else an hour ago. Conquesting earns its budget in exactly two situations: when you're meaningfully, provably better for a specific use case and your ad says precisely that ("X doesn't do usage-based pricing; we do" — comparisons are fine, lies are not), and when the competitor's brand terms have enough volume to matter, which usually means you're the challenger and they're the incumbent. It's the paid version of the honest comparison pages we've written about in [comparison pages that convert](/journal/web-design/comparison-pages-that-convert): specific, substantiated, never weaselly.

## The decision spreadsheet

The whole debate fits in one sheet, which we'd rather you built than trusted us about:

| Input | Where it comes from |
| --- | --- |
| Monthly brand search volume | Search Console, brand queries |
| Organic CTR on brand terms, ads on vs off | Your geo test |
| Brand CPC and monthly spend | Ads platform |
| Conversion rate, brand-ad clicks vs organic brand clicks | Analytics, segment by landing path |
| Competitor ads present? (% of auctions) | Auction insights |
| Alternative use of budget | Your best marginal channel |

The output is one number — true incremental CPA of brand spend — held against one question: *is this the best marginal use of this money?* Sometimes yes, loudly. Sometimes the sheet says you're paying four figures a month to protect traffic that was never leaving. Both are fine outcomes. The bad outcome is never running the sheet.

Two footnotes before you cancel anything. First, [paid and organic genuinely interact](/journal/growth/paid-organic-balance) — brand ads lift organic clicks in some verticals and cannibalise them in others; measure yours, not a blog's. Second, re-run the test yearly. SERPs change: a marketplace enters, a competitor gets funding, Google reshuffles the furniture. Last year's answer expires.

## What we tell our own clients

Our default posture is unromantic: bid defensively while competitors bid, run the geo test annually, cap brand spend as a percentage of paid budget, and never, ever let brand conversions headline a performance report. When we rebuilt direct booking for [Marlowe Hotels](/work/marlowe-hotels-direct-booking-relaunch), the brand-term programme ran exactly this way — dark-region tests against OTA-heavy SERPs, spend that flexed with competitor presence — and the savings funded the things that actually moved direct share: speed, loyalty, and a booking flow that didn't feel like a penalty.

That's the grown-up frame for the [growth budget](/services/growth) generally: brand spend is a defensive line item with a measured price, not a growth engine with a flattering dashboard. Treat it like insurance — price it, cap it, re-quote it — and the arguments mostly stop.

## Key takeaways

- Brand campaigns convert beautifully because the intent existed before the ad. Attribute nothing until you've measured incrementality.
- The geo-split test is the answer machine: matched regions, brand on vs off, four to six weeks, watch *total* conversions.
- Organic recapture of 90%+ means you're buying a tax; below that, or with competitors in the auction, defence is worth its price.
- Conquesting works when you're provably better for a named use case and you're the challenger. Keep their trademark out of your copy.
- One spreadsheet ends the argument: incremental brand CPA versus your best marginal use of the same money. Re-run annually.

## FAQ

**Google says brand ads lift total clicks. Is that wrong?**
The studies are real but they're population averages, and the population includes brands in heavily contested SERPs where ads genuinely add clicks. Your number comes from your SERP and your recapture rate. Averages don't pay your invoices.

**What about bidding on our brand plus modifier terms — "BrandName pricing", "BrandName reviews"?**
Often the highest-value brand spend. These are decision-stage queries where message control matters most: you want your pricing page and your best proof in front of them, not whatever the organic snippet generator felt like. We almost always keep these on, measured separately from pure "BrandName" navigational searches.

**A competitor is using our trademark in their ad copy. What now?**
Screenshot with timestamps, file a trademark complaint through the platform's ad policy channel, and brief your lawyer if it persists. Platform takedowns are slow but real. Meanwhile, bid on your own term so their non-compliant ad isn't sitting alone at the top of your name.

**Should small brands with no competitors bidding run brand campaigns at all?**
Usually minimal or none — put the budget into non-brand terms and [content that compounds](/journal/growth/content-strategy-that-compounds). The exception is launch windows, rebrands, or promotions where message control is worth a small, capped spend.

**How do we report brand performance without misleading anyone?**
Report it on its own line, always: brand spend, brand revenue, and — if you've run the test — estimated incremental brand revenue. Blending brand into "paid search performance" is how the Pacific garbage patch of marketing metrics gets bigger.
