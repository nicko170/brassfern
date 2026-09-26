---
title: "Review your content like a portfolio"
description: "A quarterly content benchmarking ritual: sort every article into winners, flatliners and sleepers, then give each piece one of three decisions — prune, refresh or expand."
slug: content-portfolio-quarterly-review
cluster: growth
tags: [content strategy, content audit, analytics, editorial, seo]
date: 2026-07-08
author: Leonie Marsh
keywords: [content benchmarking, content portfolio management, content audit, GA4 content metrics, editorial analytics]
readingTime: 8
---

Every quarter, in studios and marketing teams across the world, someone opens a spreadsheet of every article the site has ever published, stares at it for twenty minutes, and closes it. The instinct is right — the library needs a review — but the format is wrong. A content audit that tries to look at everything at once looks at nothing. What works is treating your archive the way an investor treats a portfolio: you don't stare at a hundred positions trying to feel something. You benchmark each one, sort them into buckets, and give each bucket a decision.

We run this ritual on our own journal and install it with most growth clients. It takes one focused day per quarter. It has opinions. And it reliably outperforms the effort of writing a handful of new articles, because the archive is where the compounding lives — [refreshing old content](/journal/growth/refreshing-old-content-wins) is the highest-leverage editorial work most teams never schedule.

## Step one: define metrics that survive your analytics

Before sorting anything, agree on what "performing" means — with numbers you can actually pull quarter after quarter. This is harder than it sounds in the GA4 era, where the same query run twice can disagree with itself. Our metric definitions, deliberately boring:

- **Organic clicks per 28 days, trailing quarter** (Search Console). The least-wrong acquisition number available. GA4's landing-page organic sessions is a corroborating view, not the source of truth.
- **Engaged reads, not pageviews.** GA4 session engagement for article landings; internally we prefer scroll-depth 75% events if you've implemented them. The exact yardstick matters less than picking one and never changing it mid-year — a metric you redefine each quarter is a mood, not a measurement.
- **Assisted conversions over trailing 180 days.** Newsletter signups, contact starts, demo requests attributed with article-touch in the path. Attribution here is directional — see [attribution that admits what it doesn't know](/journal/growth/attribution-models-honest) — but direction is what portfolio decisions need.
- **Links and citing domains** (any link index; consistency over accuracy again).

One rule that saves the ritual every time: **write the definitions into the top of the spreadsheet and freeze them**. If you can't reproduce a metric definition in a single sentence, it will decay by Q3.

## Step two: the three-bucket sort (plus one)

Pull the frozen metrics, rank the whole archive on organic clicks, and sort:

**Winners** — roughly the top 10–15%. Ranking, growing or holding. The mistake teams make with winners is leaving them alone. In portfolio terms they're your dividend stocks: you reinvest. Each winner gets a small standing task: keep statistics current, extend sections where search intent has drifted, make sure its internal links point at your newest relevant work — the architecture compounding described in [internal linking is architecture](/journal/growth/internal-linking-architecture).

**Flatliners** — the middle. Traffic flat, engagement fine, no links. These are the honest B-students of the archive, and they're where most of the review's conversation should happen, because every flatliner is a question about intent. Either the piece targets a query nobody has (a positioning error, not a quality error) or it targets a real query and loses to better pages (a quality or authority error). The decision differs completely.

**Sleepers** — low current traffic, but at least one signal says the market wants the topic: rising impressions with poor average position in Search Console, strong on-site search demand (your [search box is a research department](/journal/growth/internal-search-mining)), or a cluster of sales calls that could have been an article. Sleepers are the asymmetric bets of a content portfolio: cheap to improve, occasionally explosive.

**The fourth bucket: dead weight.** No impressions, no links, no engagement for four consecutive quarters, and no strategic reason to exist. More on what to do with them below — the short version is that [content pruning](/journal/growth/content-pruning-seo-lever) is an SEO lever, not an admission of failure.

## Step three: every piece gets exactly one decision

The review fails when it produces a report. It succeeds when every article leaves the room with one of three decisions, an owner, and a date:

**Prune.** Merge into a stronger sibling and 301, or delete and let it 404 (with a good 404 — they're [a system, not an accident](/journal/web-design/error-pages-as-system)). Pruning feels brutal to writers, which is why portfolios, not people, should hold the decision. The framework helps: content is an asset with a carrying cost (site quality, crawl attention, brand impression on the unlucky visitor who lands on your 2021 takes). Assets below their carrying cost get sold.

**Refresh.** Same URL, better piece: updated dates, data, screenshots and examples; sharpened title to match today's SERP intent; decayed advice removed. A refresh is two to four hours and the single best effort-to-return activity in editorial. Schedule the top of the flatliner pile and any winner whose facts are ageing.

**Expand.** For sleepers and intent-drifted flatliners: a real developmental edit. New sections answering the questions searchers actually have now (check the People Also Ask box the query has grown since you published), consolidation of two thin siblings into one definitive piece, expert quotes added, examples replaced with current ones. An expansion is a half day to two days and should be resourced like a new article — because commercially, it is one, except it starts with existing authority.

The ratio we aim for in a healthy programme: per quarter, refresh the top eight to twelve candidates, expand three to five sleepers, prune without sentimentality, and only then decide how many *new* articles the calendar can honestly carry. Most teams have this backwards; their [editorial calendar](/journal/growth/content-ops-editorial-calendar) is 100% new work and the archive rots underneath it.

## The benchmarks that make the split honest

A guard against wishful bucketing: use relative benchmarks, not gut feel.

- A piece is underperforming its potential if average Search Console position is 4–15 while click share sits below 3% — the ranking is there; the snippet or intent match isn't. That's a title/meta rewrite before any body edit.
- Compare pieces within their own cluster, not globally. An AI-governance article and a "what is headless commerce" explainer have different ceiling traffic; a sleeper in a niche cluster may already be a winner by its cluster's math.
- Age-adjust: articles under six months old get marked *jury out* rather than flatliner. Young pieces judged against old ones is how good seedlings get pruned.

A benchmark table lives in our working doc with exactly these columns: clicks trend, position band, engaged-read rate, assists, links, age, decision. Anything fancier becomes the thing the ritual is about instead of the ritual.

## Making it a ritual and not an event

Two habits decide whether this survives the year. First, **calendar it like a release**: same week each quarter, one day, the whole review done or it didn't happen. Second, **publish the changelog internally** — a one-page note of what was pruned, refreshed, expanded and what moved as a result last quarter. Nothing sustains the practice like visible compounding: "the February refresh of the attribution piece is now our fourth-biggest organic landing page" buys you the next review day without argument.

There's a cultural dividend too: teams that review their portfolio quarterly write differently. When you know every piece will face the spreadsheet in ninety days, you write fewer dutiful filler articles and more pieces with a reason to exist. The portfolio review is, quietly, an editorial standards body.

## Key takeaways

- Review the archive quarterly as a portfolio — winners, flatliners, sleepers and dead weight — never as one undifferentiated spreadsheet.
- Freeze metric definitions first: organic clicks from Search Console, engaged reads, 180-day assists, incoming links. Boring, frozen, reproducible.
- Every article leaves with one decision — prune, refresh or expand — an owner and a date. A review that ships a report instead of decisions is a meeting, not a programme.
- Bench comparatively: position-versus-click gaps, within-cluster ceilings, age adjustments for young pieces.
- Refresh most, expand few, prune hard — then set the new-writing calendar. The archive is where the compounding is.

## FAQ

**Which tools do we need for this review?** Search Console, GA4 (or your privacy-friendly equivalent), one link index, and a spreadsheet. That's genuinely it. If a tool subscription is a prerequisite for the review, the ritual will die the day the subscription does.

**How big an archive before this is worth doing?** Around thirty published pieces, or whenever "we should do a content audit sometime" has been said twice. Below that, the buckets collapse and a monthly skim is enough.

**Should pruning go through legal or brand?** Only for pieces with compliance exposure. For everything else, the editorial decision should live with the editorial owner — approval routing is how archives die of politeness.

**What if a flatliner is strategically important despite zero traffic?** Keep it, but say so explicitly: tag it "strategic keep" with the reason ("required by sales for procurement conversations"). Strategic keeps are legitimate; unnamed sentimentality isn't.

**How do refreshes show up in reporting?** Track refreshed URLs as their own cohort with pre/post 90-day windows. After two quarters you'll have an internal benchmark — ours sits around a 30–60% median click lift on flatliner refreshes — which is the number that funds the next cycle.

*This ritual is part of how we run [content strategy engagements](/services/growth) — the editorial calendar survives because the portfolio review guards it.*
