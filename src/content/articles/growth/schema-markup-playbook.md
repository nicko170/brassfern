---
title: "Schema markup that actually moves the needle"
description: "Structured data, done pragmatically: which schema types still earn rich results, how to keep JSON-LD honest, and the default set we ship on every build."
slug: schema-markup-playbook
cluster: growth
tags: [schema markup, structured data, technical seo, json-ld, rich results]
date: 2025-09-09
author: Sam Whitfield
keywords: [schema markup guide, structured data seo, json-ld best practices, rich results]
readingTime: 8
---

Structured data occupies a strange place in SEO discourse: either oversold as a ranking cheat code or dismissed as busywork for rich-result lottery tickets. The truth is duller and more useful. Schema markup is *eligibility infrastructure* — it determines which of Google's enhanced presentations your content can appear in, sharpens how machines understand your pages, and increasingly feeds the AI surfaces that sit on top of search. It won't rescue thin content and it won't directly lift rankings, but on a healthy site it's some of the cheapest durable leverage available.

Here's the pragmatic playbook: what we ship by default, what we skip, and how to keep the whole apparatus honest.

## First, lower the right expectations

Schema does three things, and only three:

1. **Unlocks eligibility for rich results** — review stars, FAQ dropdowns, breadcrumbs in the SERP, event listings, product pricing. Eligibility, not a guarantee; Google shows enhanced results when it trusts the site and finds the result useful.
2. **Disambiguates entities.** Organisation schema ties your brand to its social profiles, founding date, and logo; Person schema ties authors to their work. In a web increasingly mediated by answer engines, being unambiguous about who and what a page is *about* is worth real money.
3. **Improves machine legibility for whatever comes next.** AI answer surfaces, shopping engines, and vertical search tools all consume structured data. Schema written well today is infrastructure for surfaces that don't fully exist yet.

What schema does not do: substitute for content quality, compensate for a slow site, or forgive spam. It's on our [technical SEO checklist](/journal/growth/technical-seo-checklist-2026) precisely because it's hygiene, not heroics.

## The default set we ship on every build

After years of pruning, our baseline is seven types, chosen because they earn their bytes:

**Organization** (site-wide, on the homepage). Name, logo, founding date, sameAs links to social and directory profiles, contact points. This builds the knowledge-panel foundation and anchors every other entity on the site.

**WebSite** (homepage). Mostly for the `name` and potential `SearchAction` — the latter only if the site genuinely has internal search worth surfacing as a sitelinks search box. We include it where search is real, skip it where it isn't.

**BreadcrumbList** (every page below the root). The highest win-to-effort ratio in the entire vocabulary: it replaces hashed URLs with readable breadcrumb trails in results, it reinforces information architecture, and it takes ten lines to generate from a route hierarchy. There is no excuse for shipping a site without it.

**Article / BlogPosting** (every editorial page). Headline, dates, author (as a Person with a jobTitle), image, publisher. This is table stakes for content marketing, and it's how the author pages and publication dates Google shows actually get populated.

**FAQPage** (pages with genuine FAQs). Still eligible for rich treatment, though Google now limits visibility mostly to authoritative government and health sites for the full accordion. We include it anyway where the FAQ is real and on-page: it costs little, it documents the page's Q&A structure for other consumers, and the eligibility rules may loosen again. The non-negotiable: the schema must mirror visible content exactly.

**Product + Offer** (e-commerce only). Price, currency, availability, condition. This feeds merchant listings and shopping surfaces — for commerce clients it's the single most consequential schema in the stack, which is why it features heavily in our [headless commerce work](/services/ecommerce). AggregateRating goes in *only* when the reviews are real, collected on-site, and visible on the page.

**Event** (where events exist). Dates, location (including virtual), offer status. Event search surfaces remain genuinely useful, and the markup is trivially generated from any sane event model.

## What we deliberately skip

**Review schema you didn't earn.** Marking up testimonials or self-authored "reviews" of your own service is self-serving review spam under Google's guidelines, and sites do get manual actions for it. If the reviews aren't first-party, user-generated, and displayed, they don't get stars. This is also a trust issue with us — we turn down the request rather than implement it.

**HowTo.** Google deprecated HowTo rich results for most surfaces in 2023. We no longer ship it except where a vertical consumer specifically requests it.

**Decorative LocalBusiness.** If the business doesn't serve customers at an address, it doesn't get LocalBusiness schema. An agency with an office nobody visits gets Organization, not a fake storefront.

**Schema for content that isn't on the page.** The cardinal sin. Every property in the JSON-LD must correspond to something a human can see in the rendered page. This isn't just guideline compliance — divergence between markup and content is exactly the pattern spam classifiers look for.

## The honesty contract: schema mirrors content

Treat this as a hard engineering rule: **JSON-LD is generated from the same data that renders the page, in the same code path.** Never hand-maintained, never hardcoded per template, never "updated later."

On our builds, the article body, the author record, and the Article schema all draw from one typed content model — the same discipline we describe in [end-to-end type safety from CMS to component](/journal/engineering/type-safe-cms-content). When a colleague edits a publish date in the CMS, the visible date, the `datePublished`, the RSS feed and the sitemap all change together, because there is exactly one value to change. Divergence becomes structurally impossible rather than merely discouraged.

Two corollaries:

- **One JSON-LD block per entity graph, not per plugin.** Fragmented schema from a CMS plugin, a theme, and a hand-rolled snippet will produce duplicate, conflicting Organization blocks. Consolidate: build a single `@graph` per page with stable `@id`s so entities relate to each other instead of floating as orphans.
- **Invisible claims are violations.** A price in Offer schema that isn't the price on the page; an FAQ answer that exists only in markup; ratings that were real two years ago but got removed from the UI — all of these are spam signals, and all of them happen by accident in unmaintained sites. Schema rots. Budget for its maintenance like you budget for [analytics governance](/journal/growth/analytics-governance).

## Validation and monitoring: the workflow

**In development.** Schema is code, so test it in CI. We validate generated JSON-LD against zod schemas of the schema.org shapes we use, plus snapshot tests on representative pages. A PR that breaks `datePublished` format or drops a required property fails the build, not the client.

**Before launch.** Run Google's Rich Results Test on one URL per template type — not to "pass" but to see exactly which enhancements are detected, and confirm the parsed values match the page. The Schema.org validator catches vocabulary errors Google tolerates silently; run both.

**After launch.** Search Console's enhancement reports are the monitoring layer: breadcrumbs, FAQs, products each get validity/error counts over time. We wire a monthly check into client reporting — sudden error spikes after a release almost always mean a template changed without the schema knowing. This pairs naturally with the post-launch checks in any [migration or relaunch](/services/growth): new templates, new schema audit.

**Annually.** Vocabularies evolve and eligibility shifts. Once a year we review which types are still earning results for each client and prune the rest. Schema that generates impressions of zero for a year is deleted, not hoarded.

## Measuring what it earns

Attribution honesty matters here. You can't A/B schema meaningfully, but you can observe: filter Search Console by search appearance (rich result types) and compare CTR of enhanced versus plain impressions for the same query class. On content sites we typically see enhanced presentations lift CTR meaningfully for FAQ-eligible and breadcrumb-rich results; product markup lifts commercial CTR where pricing displays. Report those numbers as *illustrative of eligibility paying off*, never as causal proof — the honest framing we apply to [attribution generally](/journal/growth/attribution-models-honest). The win usually isn't dramatic; it's a persistent few-percent CTR edge, compounding quietly across thousands of URLs, for a few days of engineering. That's the shape of good SEO infrastructure.

## Key takeaways

- Schema buys eligibility and disambiguation, not rankings. Sell it internally as infrastructure, not a growth hack.
- Ship a disciplined default set: Organization, WebSite, BreadcrumbList everywhere; Article, FAQPage, Product/Offer, Event where the content genuinely matches.
- Generate every JSON-LD value from the same data that renders the visible page, in one consolidated `@graph`.
- Skip unearned reviews, deprecated types, and anything not on the page. Divergence from visible content is a spam signal.
- Test schema in CI, audit it per template before launch, monitor Search Console enhancement reports monthly, and prune annually.

## FAQ

**Does schema markup improve rankings?**
Not directly — it's not a ranking factor. It improves how results are presented (which lifts CTR) and how machines understand entities. Treat ranking-focused schema pitches as a red flag.

**JSON-LD or Microdata?**
JSON-LD, always. It's what Google recommends, it separates structured data from markup, and it can be generated, typed and tested as a pure function of page data. Microdata tangles schema into templates where it rots.

**How do we handle schema in a headless/CMS build?**
Model it in the content layer: authors, dates, FAQs and offers should be structured CMS fields, not prose. Then generate the `@graph` from those fields at render time. If a fact can't be edited in the CMS, it shouldn't be in the schema.

**We removed FAQ rich results eligibility — should we delete FAQ schema?**
Only after checking Search Console. If FAQ enhancements still earn impressions in your vertical, keep it; if it's been zero for a year, prune. The visible FAQ section itself is worth keeping regardless for users and answer engines.

**How long until rich results appear after adding schema?**
Eligibility typically reflects within days to a few weeks of a recrawl; whether Google *shows* enhancements depends on query, site trust and result usefulness, and is never guaranteed. Report on eligibility and impression share, not promises.

*Structured data is one line item in the [growth engagements](/services/growth) we run — the boring, compounding kind that pays for the interesting kind.*
