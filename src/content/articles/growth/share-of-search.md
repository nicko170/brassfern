---
title: "Share of search: a brand metric a CFO will accept"
description: "Brand health is usually measured with slow, soft surveys. Share of search turns branded query volume into a leading indicator finance teams actually trust."
slug: share-of-search
cluster: growth
tags: [brand measurement, share of search, analytics, marketing effectiveness, seo]
date: 2026-07-02
author: Sam Whitfield
keywords: [share of search, brand measurement, branded search volume, marketing effectiveness metrics, brand tracking alternative]
readingTime: 10
---

Every marketing team eventually has the same meeting. Brand spend is up for review; someone quotes awareness-survey deltas with error bars wider than the effect; the finance lead asks a very reasonable question — "how do we know any of this worked?" — and the room gets quiet. Brand measurement has a credibility problem: the instruments are slow, expensive, sample-thin, and easy to argue with. Surveys tell you what a few hundred people said to a stranger on a panel in March.

Share of search offers a different instrument: the share of all category search queries that include your brand name. It costs almost nothing to collect (query-volume tools or your own search console data plus a category keyword set), updates monthly, covers actual behaviour rather than stated attitudes, and — this is the part that matters in that meeting — it moves *ahead* of market share. Brands whose share of search rises tend to see share of market follow. It's not magic; it's demand formation made visible. If you're the kind of team already disciplined about [honest attribution](/journal/growth/attribution-models-honest), share of search is the missing upstream dial: attribution tells you how demand was captured; share of search tells you whether it's being created.

This piece is the working version: how to build the number properly, what it can and can't tell you, and how to report it without double-counting against your survey programme.

## Building the metric so it survives scrutiny

Share of search is simple to describe and easy to build badly. Four decisions determine whether the number holds up in the meeting:

**1. Define the category query set honestly.** The denominator is all search interest in your category, approximated by a fixed set of generic category queries — "budgeting app", "electric cargo bike", "sku-level terms" if that's the category. The set must be (a) fixed in advance, written down, and versioned; (b) built from customer language, not internal taxonomy — pull it from your SEO research, your sales calls, your [zero-results](/journal/ecommerce/ecommerce-site-search) logs if you have them; (c) pruned of any term that smuggles your brand in. The classic failure is curating a category set that flatters the trend. Write the list when you're calm, change it rarely, and log every change.

**2. Share = branded volume ÷ (branded + category volume), per competitor.** Pull monthly search-volume estimates for your brand name (plus common misspellings and product names) and for each named competitor's brand, plus the category set. Your share of search is your branded volume over everyone's branded volume — the category set is the normaliser that corrects for seasonality so that a Christmas spike in the whole category doesn't look like brand growth. Compare *among brands*, within category context.

**3. Normalise and smooth.** Monthly volume estimates are noisy; individual keyword estimates can lurch. Use a three-month rolling average for reporting, keep the raw series for diagnosis, and annotate the chart with known shocks (a viral moment, a product recall, a TV campaign) rather than letting the data pretend to be unexplained.

**4. Weight for your actual market.** If you sell in Australia and New Zealand, a global share-of-search number is someone else's metric. Restrict to the geographies that drive your revenue. It sounds obvious; the number of brands reporting global share to a domestic board is not small.

A practical shortcut if category tooling is thin: search-console impressions on your branded queries give you *your* branded trend at high fidelity, and public trend data gives you the competitive relative picture at lower fidelity. A precise trend for you plus a rough trend for rivals beats a rough trend for everyone.

## What share of search can tell you — and what it can't

The evidence base here is real but conditional. Research across many categories has found share of search correlates with market share, and that sustained movements in share of search tend to *lead* share movements — often by quarters, sometimes longer in slow-cycle categories like cars and insurance. The causal story is intuitive: branded search is demand pulled by memory. Someone typing your name into a search box has already been persuaded by something — advertising, word of mouth, a product experience — before any performance channel touched them. Share of search is the closest thing marketing has to a monthly census of "are we being thought of?"

The limits matter as much as the promise:

- **It's a share, not a level.** Category decline hides inside a stable share. Always look at share alongside absolute branded volume and the category trend.
- **Fame isn't favour.** A crisis is branded search. Always read share movements against sentiment context before celebrating; an annotation column in the reporting sheet is load-bearing.
- **Small brands get noisy numbers.** When your branded volume is a few hundred queries a month, the estimates wobble. Smooth harder, report less often, be humble.
- **It measures salience, not preference.** Being searched-for because you're cheap is different from being searched-for because you're loved. Share of search won't tell you which; that's what the survey is for.

## Combining with surveys without double-counting

The trap to avoid: running a brand tracker *and* share of search, watching them disagree, and then cherry-picking whichever moved the right way per quarter. The honest architecture assigns each instrument its question:

- **Share of search, monthly:** is salience moving? This is the leading indicator and the budget conversation.
- **Survey, once or twice a year:** why is it moving — awareness, consideration, associations, the attributes the brand strategy actually bet on. Surveys are diagnostic instruments; they're wasted as a monthly pulse.
- **Brand search CTR and direct-traffic quality:** whether the salience is converting when it arrives — a branded SERP where you lose clicks to a marketplace listing your products is a fixable leak, not a brand problem.

When the instruments disagree, believe them both: a share-of-search rise with flat consideration usually means a fame event without conviction (a stunt, a news cycle); rising consideration with flat search often means the message is landing but not yet memorable — check whether your distinctive assets are actually present in the media. Our [funnel metrics](/journal/growth/funnel-metrics-that-matter) piece covers the general rule: measure movement between states, not the states themselves, and never let two instruments compete for the same verdict.

## Reporting cadence that survives the CFO

The reporting format matters as much as the methodology, because this metric lives or dies on whether it becomes a *fixture*. What works:

- **One chart, one page, every quarter in the business review.** Your brand and named competitors, rolling average, category volume beneath, annotations on. Same chart, same layout, forever — the familiarity is what builds trust. The fastest way to kill a brand metric is to change its presentation whenever results are awkward.
- **A written method note** — category set, sources, smoothing rule, version history — attached to every report. When a new finance partner joins and challenges the number, you hand them the note, not a meeting.
- **Pre-registered expectations.** When a campaign launches, write down the share-of-search movement it should produce and by when. Then report against it, hit or miss. This one habit converts share of search from an alibi machine into a decision instrument — the same pre-commitment discipline we apply to experiments in our [CRO practice](/journal/growth/cro-experiment-design).

And the boundary rule: share of search is an input to decisions about *brand investment weight and timing* — it's not a scoreboard for individual campaign accountability, and using it that way invites the metric to be gamed (branded search can be bought with stunts; nobody wants to win share of search by being briefly infamous).

## Key takeaways

- Share of search = your branded query volume over all category brands' branded volume, normalised by category seasonality. Simple idea, demands honest construction.
- Fix the category query set in advance, in customer language, and version it. Curated-after-the-fact denominators are how brand metrics become alibis.
- It leads market share in many categories — read it as "are we being thought of?", not as a level or a verdict.
- It measures salience, not sentiment or preference: pair a monthly share-of-search pulse with an annual survey, each answering its own question.
- One chart, one method note, one cadence, pre-registered expectations. The reporting discipline is what makes the number bankable.
- Never use it to score individual campaigns; that's how you incentivise infamy.

## FAQ

**How long until share of search reflects a brand campaign?** In fast categories (consumer apps, food & beverage), we've seen movement within one to two months of sustained activity; in slow, high-consideration categories it can take two or more quarters, which is exactly why the metric pairs with patience and why pre-registered windows matter. If you promised the board a number next month, you promised wrong.

**Our brand name is a common word — is this hopeless?** Harder, not hopeless. Exclude pure dictionary queries via negative keyword sets, include product-qualified branded phrases, and lean more heavily on search-console impressions for your own trend line. If the word is truly generic, your brand has a naming problem share of search is merely reporting.

**Does this work for B2B?** Yes, with humility: volumes are thin and lumpy, so smooth over longer windows and report half-yearly inside the business review rather than monthly. Thin-volume B2B brands should weight the *trend* and the relative position more than the point estimate.

**Where does this sit in a Brassfern engagement?** Typically inside a [growth engagement](/services/growth) measurement build: we stand up the category set, the collection pipeline, the annotated dashboard and the method note, then run two quarters of reporting alongside your team until the cadence holds on its own. It usually arrives packaged with the attribution and [lifecycle](/journal/growth/lifecycle-email-architecture) instrumentation, because the upstream brand dial is only useful next to the downstream capture numbers.
