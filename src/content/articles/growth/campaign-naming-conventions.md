---
title: "Campaign naming conventions: boring is the feature"
description: "UTM and campaign names are infrastructure, not admin. A grammar that survives staff turnover, separator rules, tooling that enforces it, and how to clean historical messes."
slug: campaign-naming-conventions
cluster: growth
tags: [UTM parameters, analytics, campaign tracking, marketing ops, data hygiene]
date: 2025-10-29
author: Sam Whitfield
keywords: [UTM naming conventions, campaign tracking, marketing analytics hygiene, UTM parameters]
readingTime: 9
---

Somewhere in your analytics right now, the same newsletter appears as `email`, `Email`, `e-mail`, `newsletter`, and — a personal favourite from a real audit — `emial`. The paid-social data is split between `facebook`, `fb`, `meta` and `paid_social`. Every dashboard built on top of this is quietly lying, and everyone in the reporting meeting has learned to say "roughly" a lot.

Campaign naming is the least glamorous topic in marketing and one of the most load-bearing. Like plumbing, it's invisible until it fails, at which point it's the only thing anyone can talk about. The convention isn't bureaucracy — it's the grammar your decisions are written in. Here is the grammar we install, and the unglamorous machinery that makes people actually follow it after we've left.

## Why conventions fail (it's not laziness)

Teams don't ignore conventions because they're careless. They ignore them because the convention lives in a doc nobody can find, because the new starter launched her first campaign before anyone mentioned it, and because nothing *breaks* when you deviate — the data just quietly splits. Deviating has no cost to the deviator and a real cost to everyone downstream, which is the classic shape of a tragedy of the commons.

That tells you the fix. You cannot memo your way out of a coordination problem. You solve it by making the right name the *default* and the wrong name *impossible* — tooling, not training. Every convention we've seen survive three years and two restructures had a URL builder at its heart. Every convention that died was a PDF.

## The grammar: five fields, all lowercase, all underscores

We keep it deliberately dull:

- **`utm_source`** — the platform sending the click: `google`, `linkedin`, `brassfern_newsletter`. Known, enumerable, short.
- **`utm_medium`** — the *class* of channel: `paid_search`, `paid_social`, `organic_social`, `email`, `referral`. Medium is the roll-up your channel reports pivot on, which is why it must be drawn from a closed list of fewer than ten values.
- **`utm_campaign`** — the initiative, in the format `[yyyymm]_[descriptive_slug]`: `202603_spring_configurator_launch`. The month prefix sorts chronologically, survives fiscal-year arguments, and lets you find anything in your history in one grep.
- **`utm_content`** — the variant: creative, audience or placement. `content` answers "which thing within the campaign": `video_a_hook_price`, `static_b_au_lal1`.
- **`utm_term`** — keep its original meaning for paid search keyword; otherwise use it for audience segments, not vibes.

The separator canon: **lowercase, underscores within a field, hyphens never** (they read as minus signs in some reports), spaces absolutely never. The exact choice matters less than its totality — `paid_search` and `paid-search` in the same dataset is how channel reports get a mysterious 8% "other" line that nobody can explain at the board meeting.

Two more rules that feel pedantic until the day they save you: never put dates anywhere except the campaign prefix (dates in `content` make variant aggregation unreadable), and never encode personal names (`campaign: janes_test_2` is how Jane haunts the dashboards for two years after she leaves).

## Closed lists, published once

Sources and mediums get **controlled vocabularies** — a published list, version-controlled in the same repo or sheet as the URL builder, with an owner. When a new platform appears, it joins the list deliberately, with one spelling, before anyone tags a link with it. This takes ten minutes a quarter and eliminates the `meta`/`fb`/`facebook` schism at the root.

Campaign slugs get a pattern, not a list — `[yyyymm]_[thing]_[audience_or_market if needed]`. The pattern is teachable in one slide: "month, then what it is, then who it's for, all lowercase." If a campaign name can't survive being read aloud in a meeting, it's too clever. `202603_q1_brand_anz` tells the story; `202603_project_meridian_sunrise` requires a decoder ring and Jane, and Jane left.

The deeper principle: a naming convention is a **schema for a database you're writing one click at a time**. You would never let fifty people invent their own column names. Same discipline, smaller column.

## Enforcement: the builder, not the memo

The convention survives because deviation becomes harder than compliance:

1. **A campaign URL builder** — a simple internal form (ours is a single page: dropdowns for source and medium from the closed lists, a validated campaign field that enforces the pattern, live preview, copy button). Nobody hand-types UTMs, because hand-typed UTMs are where `emial` is born. Build it in an afternoon; it outlives the marketing manager.
2. **Platform-side templates.** Google Ads tracking templates, social ad naming in the platform's own fields using the same grammar, email tool defaults. The more the convention lives in saveable templates, the less it depends on memory.
3. **A monthly fifteen-minute hygiene report.** One query: every new source, medium and campaign value first seen this month, eyeballed by the ops owner. New legitimate value? Add to the list. Typo? Fix the mapper (below), correct the doc, move on. Fifteen minutes a month is the entire maintenance cost of clean data.
4. **A mapping layer in reporting.** A lookup table — `fb` → `facebook`, `Email` → `email` — that normalises stragglers at the reporting layer. Some drift is inevitable (agencies, partners, QR links someone printed in 2023); the mapper means drift degrades dashboards gracefully instead of fragmenting them. This is the analytics twin of [tracking-plan governance](/journal/growth/analytics-governance): name things deliberately, then defend the names.

## Cleaning the historical mess

You'll inherit history. Don't boil it — triage it:

- **Map, don't rewrite.** Historical data stays as-was; the mapping layer normalises old values into the new vocabulary so a three-year channel trend reads as one line. Rewriting stored events is how audits go to interesting places.
- **Fix forward.** The builder and templates apply from a decided date. "Clean from March" is an achievable goal; "clean always" is a fantasy that postpones starting.
- **Kill the zombie campaigns.** Old UTMs keep arriving for years from pinned posts and saved QR codes. Where a retired campaign still sends real traffic, redirect thoughtfully rather than letting the ghost campaign rank in your reports — [site migrations teach the same lesson](/journal/growth/site-migration-seo): dead plumbing keeps flowing until you cap it.
- **Declare the cutover in the dashboard.** Annotate the date the convention changed. Future-you, explaining a before/after step change in "other" traffic, will send present-you a thank-you card.

## What clean names buy you

The payoff isn't tidiness; it's decisions you can finally make. Channel economics that reconcile with finance to within a few percent instead of "roughly". Creative testing where `content` values line up so the [experiment results](/journal/growth/cro-experiment-design) are aggregable across campaigns. Onboarding for a new growth hire measured in minutes — "here's the builder, here's the list" — instead of an archaeological tour of everyone's personal dialects. And attribution conversations that start from a shared reality, which doesn't make [attribution honest by itself](/journal/growth/attribution-models-honest), but removes the excuse of dirty inputs.

We install this inside the first month of most [growth engagements](/services/growth), precisely because it's unglamorous: it costs almost nothing, it compounds forever, and it makes every subsequent report less of a negotiation. Boring is the feature. Boring is load-bearing.

## Key takeaways

- Conventions fail structurally, not morally: deviating costs the deviator nothing. Fix it with tooling that makes the right name the default.
- Five fields, lowercase, underscores; month-prefixed campaign slugs; closed lists for source and medium with one owner.
- Ship a URL builder with validation, bake the grammar into platform templates, and run a fifteen-minute monthly hygiene check.
- Normalise history with a mapping layer; fix forward from a declared cutover; cap the zombie campaigns.
- The payoff is decision-grade channel economics, aggregable creative tests, and new hires who are productive on day one.

## FAQ

**Should agencies and partners use our convention on links they control?**
Give them the builder output, not just the spec — paste-ready final URLs in the brief, and the closed lists as a one-page appendix. Partners comply with a ready-made link and ignore a document of rules. Put the tagging requirement (and the builder link) in the SOW so it's contractual, not aspirational.

**How do we handle offline and QR codes?**
QR codes print forever, so tag them with the most durable grammar you've got: `utm_medium=offline_qr`, a campaign slug that names the artifact (`202603_expo_booth_poster`), and no expiry assumptions. Expect zombie traffic years later and let the mapping layer roll retired slugs into an `offline_legacy` bucket rather than polluting current campaigns.

**Is it worth changing an existing messy convention to a better one?**
Almost never for its own sake. A mediocre convention applied consistently beats a beautiful one that resets the data. Migrate only when the current grammar genuinely blocks a decision (channel roll-ups, creative aggregation), and migrate with the mapping layer so history survives. Perfect is the enemy of parseable.

**What about internal links — should they carry UTMs?**
No. UTMs on internal navigation (homepage banner to a product page) torch your session attribution by restarting it mid-visit, making organic look like it converts worse and banners look like heroes. Internal promotion gets tracked with events or content-grouping, per your [event taxonomy](/journal/growth/analytics-taxonomy-first) — UTMs are for arrivals from outside only.
