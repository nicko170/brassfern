---
title: "Programmatic SEO without producing landfill"
description: "The workshop version of programmatic SEO: dataset maturity gates, the four page archetypes that work, editorial review thresholds, and the build sequence we trust."
slug: programmatic-seo-with-craft
cluster: growth
tags: [programmatic seo, content operations, site architecture, data quality, seo strategy]
date: 2026-08-20
author: Sam Whitfield
keywords: [programmatic seo, templated pages seo, seo at scale, content quality, dataset-driven content]
readingTime: 9
---

We've published the philosophy of this before — [programmatic SEO without polluting the web](/journal/growth/programmatic-seo-ethics) lays out the three tests every generated page must pass. This article is the workshop version: what the dataset needs to look like, which page archetypes actually earn their URLs, how to gate a template before it generates ten thousand of anything, and the order of operations that keeps the whole thing from becoming a regret.

It's written for the team that's past "should we?" and into "how, exactly?" — usually a marketplace, a SaaS with an integrations story, a data-rich product sitting on an asset it hasn't noticed yet.

## Start with the dataset audit, not the keyword list

Every failed programmatic project we've been called in to fix started the same way: keyword research first, data second. Someone exported 40,000 queries, clustered them, and then went looking for content to fill the templates. That's backwards, and it produces pages that exist to satisfy a spreadsheet rather than a person.

The correct first artefact is a dataset audit. One page, honestly answered:

- **What do we have that is first-party?** Inventory with real availability. Prices we set. Measurements we take. Outcomes from our own product. Searches our users actually run. First-party data is the only durable moat — anything scraped or licensed is available to every competitor too.
- **How fresh is it, really?** A stale programmatic page is worse than no page. Each field needs a freshness expectation (hourly, daily, quarterly) and the audit needs to say whether you can hold it. If half the catalogue updates yearly and your template implies recency, the template lies.
- **How deep is the tail?** Combinatorial spaces are long-tailed. If generating a page for the 4,000th row produces something thin, you don't have 4,000 pages — you have however many rows pass a substance bar, plus a long tail that must never be generated.
- **Who owns it?** A programmatic section is a product surface that decays. Without a named owner and a review cadence, it rots in public.

If the audit comes back thin, stop. The honest outcome of a programmatic exploration is sometimes "we don't have the data to deserve this yet." That's a good answer. It saves six months.

## The four archetypes that earn indexation

Almost every programmatic system that works is one of four shapes. Naming them matters because each has a different substance bar.

**The directory.** One page per entity: a supplier, a venue, a species, a suburb. Substance comes from unique data per entity plus written context. This archetype lives or dies on dataset depth — if your page for entity #3,882 has the same chart with different numbers as every other page, it's wallpaper. The strong version adds interpretation: what the numbers mean, who this entity suits, what to watch for.

**The comparison.** "X vs Y", "X alternatives", "X for [use case]". Substance comes from genuinely evaluative content, which is hard to generate honestly at scale. These pages work when your dataset contains the evaluative layer — real performance measurements, pricing you've verified, trade-offs your team will put its name to. The Saltbush Collective marketplace we built only generates comparison pages where we hold first-party fulfilment data for both sides; everything else stays unwritten. See the build in the [Saltbush Collective case study](/work/saltbush-collective-marketplace).

**The intersection.** "Flights from A to B", "integrates X with Y", "[role] jobs in [city]". Substance comes from the intersection being real — actual routes, actual working integrations, actual open roles. This archetype has the most seductive combinatorial maths and the highest landfill rate. The gate is brutal: generate a page only where the intersection exists in your data *and* has an answer worth reading. No route, no page.

**The tool.** Calculators, checkers, generators parameterised by URL. Often the strongest of the four, because the utility is the content — we wrote about the broader strategy in [interactive tools as content](/journal/growth/interactive-tools-as-content). The programmatic lesson is that a tool template with 200 genuinely functional parameterised pages outperforms 20,000 prose pages on the same topic.

If your concept doesn't fit one of these shapes, be suspicious. Most novel shapes are the comparison archetype wearing a hat.

## Substance thresholds, stated in advance

"Quality" is unenforceable. Thresholds are not. Before a template generates anything, write down the bars a row must clear, and make the build enforce them mechanically:

- **Data completeness.** If a page would render with more than, say, 30% of its modules empty or placeholdered, don't generate it. "Near you: nothing" pages teach Google — and users — that the section is empty calories.
- **Unique-word floor.** Measure the proportion of each page's substance that is unique to its entity. Below a third, the pages are near-duplicates competing with each other. (The differentiation test from our [ethics piece](/journal/growth/programmatic-seo-ethics), made measurable.)
- **Freshness SLA per field.** Every rendered data point shows its age, and rows past their decay date drop out of generation and out of the sitemap until refreshed.
- **The read-aloud test.** A human reads a random sample of five generated pages aloud. If any sentence would be equally true with a different entity name pasted in and adds nothing a table couldn't, cut it from the template. This one is not mechanical, and it's the one that saves you.

The budget conversation matters here: templates that enforce thresholds properly cost more upfront. If the project's business case only works at maximum scale with zero gating, the business case is the landfill. Say so early.

## The editorial review gate

Generated content still needs an editor — just at the template level instead of the page level. Our gate has three steps, and none is optional:

1. **Template review.** Before generation, the full template — every module, every conditional, every fallback string — goes through the same editorial review as a flagship article. Fallback copy is where landfill hides: "Contact us for more information about [entity]" multiplied by nine thousand pages is a reputation.
2. **Sample review.** Generate fifty pages across the distribution — the best row, the median row, the weakest row that still passes thresholds. Review them as a set. The median row is the product; the best row is marketing.
3. **Rolling audit.** Monthly, a human reads a random sample of live pages and scores them against the thresholds. When scores drift — and they drift as data ages — the template goes back to step one, or the failing tail gets `noindex`ed.

This is the same posture we take with AI-generated prose anywhere else on a site: constrained inputs, measurable outputs, a human accountable for the sample. If your programmatic roadmap involves LLM-written sections, apply the discipline from our [evals framework](/journal/ai/llm-evals-framework) — generate only from verified data, and check claims against fields automatically.

## The build sequence

Order of operations, learned the expensive way:

1. **Prove the dataset monthly.** Freshness, ownership, accuracy checks. Two cycles minimum before templates start.
2. **Ship one template, fifty pages.** The strongest slice only. Wire the analytics first — impressions, indexation rate, engagement per template, not per page — using the same [tracking-plan discipline](/journal/growth/analytics-governance) as any product surface.
3. **Stage indexation.** Submit the sitemap for your proven slice. Expand only when indexation and impressions justify it. Reputation compounds in both directions.
4. **Build the graph.** Curated hubs above, disciplined sibling links across, spokes that end somewhere useful. The graph design happens before generation, never after.
5. **Schedule the prune at launch.** Quarterly deletion is a feature of the system, not an admission of failure. Put the first review date in the roadmap document or it will not happen.

The plumbing — rendering, canonicals, performance at scale — is the standard sweep, and it's unforgiving at volume: ten thousand pages is ten thousand chances at a slow LCP. Run the [technical SEO checklist](/journal/growth/technical-seo-checklist-2026) against the template before generation, not the site after.

## When the answer is no

The most valuable thing a good [growth engagement](/services/growth) produces is occasionally a refusal. Decline the programme when the dataset is licensed or scrapeable by everyone, when the honest page count is under a few hundred (just write them — craft beats machinery at that scale), when nobody will own the system after launch, or when the traffic model requires the thin tail to rank. A programmatic section that dies after eleven months doesn't just fail — it spends your domain's trust on the way down.

The teams that win at this are the ones who find it slightly boring: a dataset they maintain anyway, a template they respect, and the discipline to generate a tenth of what they could.

## Key takeaways

- Audit the dataset first. First-party depth, freshness SLAs, and a named owner decide whether you deserve programmatic scale at all.
- Four archetypes earn indexation — directory, comparison, intersection, tool — and each has its own substance bar. Learn which one you're building.
- Write substance thresholds down before generation and enforce them in the build: completeness, uniqueness floor, freshness decay.
- Editors review templates and samples, not pages. The median generated page is the product.
- Ship small, stage indexation, and schedule the prune at launch. Deletion is a feature.
- The correct outcome is sometimes "not yet". Landfill spends domain trust you can't buy back.

## FAQ

**What's a realistic minimum scale for programmatic SEO?**
Below a few hundred genuinely strong pages, hand-writing usually wins on quality per URL. The machinery pays off when you have thousands of rows that clear your thresholds — or when the dataset updates so frequently that manual publishing can't keep up, which is its own justification.

**How do we measure whether a template is working?**
Per template, not per page: indexation rate, impressions trend, click-through, and whatever downstream action the section exists to feed. A template with 40% indexation has a quality problem, not a promotion problem. Give a new template a full quarter before judging; give it two before scaling.

**Should we build the pages before or after the internal linking structure?**
Graph first. Hubs, sibling logic, and spoke endings are design decisions; pages are their output. Teams that generate first and link later end up with twenty thousand orphans joined by a faceted sidebar, which is a crawl-budget fire in a landfill factory.

**Can programmatic SEO work on a new domain?**
It can, but the trust-building phase is longer and the staged approach is non-negotiable. Fifty excellent pages that earn impressions beat five thousand hopefuls. If your timeline needs results in one quarter on a fresh domain, spend the budget on a small number of exceptional [interactive tools](/journal/growth/interactive-tools-as-content) instead.

**Who should own a programmatic section internally?**
The same shape as any product surface: one accountable owner, engineering time for the pipeline, editorial time for the template and audits, and a growth lead watching the numbers. If the org chart answer is "everyone, kind of," the correct project plan is [fix the ownership first](/journal/growth/content-ops-editorial-calendar) — the calendar discipline transfers directly.
