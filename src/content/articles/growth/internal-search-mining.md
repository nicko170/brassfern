---
title: "Your search box is a research department"
description: "Nobody lies to a search box. Mining internal site search — zero-results reviews, synonym dictionaries, query taxonomy — into a content roadmap that compounds."
slug: internal-search-mining
cluster: growth
tags: [site search, content strategy, research, seo, analytics]
date: 2025-11-04
author: Leonie Marsh
keywords: [site search analytics, zero results search, content gap analysis, search UX data, content strategy]
readingTime: 9
---

Ask people in a survey what content they want and you'll get manners. Watch what they type into your search box and you'll get the truth. Internal site search is the one place visitors tell you, in their own words, at the exact moment of intent, what they believe your site should contain — including the things it doesn't. It is a research department you already own, currently filing its reports into `/dev/null` on most sites.

We instrument search on every content site we ship, and we treat the query log as an editorial input with the same standing as keyword tools and sales-call notes. This is the working setup: how to capture queries on a static site without creepy analytics, how to read what you collect, and the quarterly ritual that turns a pile of zero-result searches into a roadmap.

## A taxonomy worth stealing

Before the tooling, the grammar. Almost every internal query falls into one of five buckets, and each bucket has a different job for you:

- **Navigational.** "pricing", "contact", "careers". The person wants a page that exists. If these dominate your query log, your navigation is failing — people only search for what's hard to click to. The fix is information architecture, not content, and our [marketing-site IA practice](/journal/growth/marketing-site-ia) starts here embarrassingly often.
- **Known-item.** "that article about design tokens", typed as `tokens pipeline`. They remember the thing, not the title. A healthy share of these confirms the content is memorable; failures here are a retrieval-quality problem (ranking, synonyms, titles that say nothing).
- **Gap.** Queries for things you genuinely don't have — a topic, a comparison, a template. This bucket is the research department's main export. Someone typed their actual problem into *your* box.
- **Vocabulary mismatch.** You wrote "engagement models"; they searched "retainer pricing". The content exists but wears the wrong name. Cheapest bucket to fix, endlessly recurring.
- **Task.** "how do I migrate webflow to astro" — a verb and an object. These are the highest-value gap queries, because they describe intentions, not topics, and intention is what a serious article serves.

Every quarter, the whole game is sorting the log into these buckets and assigning each bucket its mechanism: nav fix, ranking fix, new content, rename, or deliberate ignore.

## Capturing queries without becoming the problem

Client-side search on a statically built index — the architecture this site runs — means queries never naturally touch a server. You have to log them on purpose, which is good: logging done deliberately tends to be done well. Our rules:

- **Log submissions, not keystrokes.** The debounced intermediate typing is noise and tells you nothing the final query doesn't. Log when the user settles: on Enter, on result click, or after the results render for a settled query.
- **Three fields are enough.** Query text (normalised: lowercased, trimmed), result count, and — when a result is clicked — the clicked item and its rank. That trio powers every analysis below.
- **A session token that expires daily**, client-generated, never tied to identity. You need to spot reformulation ("brand guidelines" → "brand book pdf" is one person thinking, and interpreting it as two demands doubles the apparent pain).
- **No query-to-person joins.** The moment the search log can see accounts, your editorial research instrument becomes a surveillance liability and your honest insights die in legal review. Aggregate appetite is all you need.
- **Sample if volume is high.** Ten percent of queries on a busy site answers every question a quarterly review asks, and cuts the ethics surface by ninety percent.

This sits inside the discipline of [naming events before buying analytics tools](/journal/growth/analytics-taxonomy-first): `search_submitted`, `search_result_clicked`, `search_zero_results`, defined once, never renamed.

## The quarterly zero-results review

The ritual that makes all of this pay. Ninety minutes, once a quarter, with whoever owns content and whoever owns the site's IA:

1. **Export two lists.** The top 200 queries by volume, and every zero-result query above a minimum count (we use three — once is a typo, thrice is a request).
2. **Sort into the taxonomy.** This takes most of the ninety minutes and is where the value concentrates. Ten minutes in you'll find the query that appears forty times and maps to nothing, and you'll feel slightly ill that it's been appearing for two quarters.
3. **Decide, per item, one of four verbs.** *Write* it (genuine gap → content brief, prioritised by query volume × buyer proximity). *Rename* it (vocabulary mismatch → retitle, or at least add their word to the page so search and SEO both find it). *Link* it (the content exists and ranks fine but sits three levels too deep → surface it in nav, hubs or [internal linking](/journal/growth/internal-linking-architecture)). Or *ignore* it, deliberately, on the record — "people search our studio blog for free stock photos" happens, and ignoring is a decision too.
4. **Feed the pipeline.** Gap verdicts become briefs in the editorial calendar, with the *verbatim query* kept on the brief. The phrase real humans typed is a better headline seed than anything a workshop produces; treat it the way we do in [content strategy that compounds](/journal/growth/content-strategy-compounds), as demand evidence, not a suggestion.

The loop closes — and this is the part everyone skips — when next quarter's export shows the gap queries resolving. If you wrote the article and the query still returns zero results, your search index didn't pick the piece up or your title still doesn't speak their language.

## Synonym dictionaries from real misspellings

The zero-result list is also your synonym source, and the rule is: *never invent synonyms, only harvest them*. If two hundred people search "sitemap" and your articles say "site architecture", that's not a them problem. Build the synonyms file from observed pairs — queries that zeroed, followed within a session by a reformulation that succeeded. Those pairs are the vocabulary bridge your audience taught you for free.

Two cautions. First, synonym expansion should be one-directional where precision matters (map their informal term to your canonical term, not the reverse). Second, prune the file at the same quarterly review; synonym lists accumulate cruft like any other asset and a stale mapping that silently misroutes queries is worse than none.

For genuinely fuzzy matching — typos, transpositions — measure before and after with the reformulation rate, because fuzzy search that guesses wrong is loud about it: users reformulate immediately. We covered the adjacent editorial version of this discipline in [content pruning](/journal/growth/content-pruning-seo-lever): assets in, assets out, judged by behaviour.

## The metrics that prove the department works

Four numbers, reviewed quarterly alongside the export:

- **Zero-result rate** — share of settled queries returning nothing. Healthy sites sit under 10%; mature ones under 5%. Trend matters more than the point.
- **Search click-through** — share of searches ending in a result click. Below half usually means ranking or snippet problems, not content absence.
- **Reformulation rate** — sessions with a second query within thirty seconds of the first. The loudest signal retrieval quality produces. (This is why the daily session token earns its keep.)
- **Exit after search** — searches followed by leaving the site. The expensive one. Each is a person who told you exactly what they wanted and walked.

None of these need a dashboard that refreshes by the second. They need a spreadsheet, a quarterly ninety minutes, and the habit of treating every typed query as a small act of trust that deserves a better answer next quarter. That habit is most of what we mean by a [growth practice](/services/growth) that respects its readers.

## Key takeaways

- The query log is unfiltered research: visitors name what they want, in their words, at the moment of intent.
- Sort queries into five buckets — navigational, known-item, gap, vocabulary mismatch, task — each with its own fix.
- Log submissions, result counts and clicks with a daily session token; never keystrokes, never identity joins.
- Run a quarterly zero-results review with four verbs per query: write it, rename it, link it, or deliberately ignore it.
- Harvest synonyms from observed reformulation pairs; never invent them; prune quarterly.
- Watch four numbers — zero-result rate, click-through, reformulation, exit-after-search — as trends, not dashboards.

## Frequently asked questions

**Our site is small. Is this worth instrumenting?**
Small sites get *fewer* queries but each is proportionally more informative — fifty monthly queries is fifty direct statements of intent. The instrumentation is an afternoon; the quarterly review can be thirty minutes.

**Should we use a hosted search service with built-in analytics instead?**
Fine, provided the query analytics are exportable and the privacy posture matches the rules above. The trap is hosted dashboards that show vanity aggregates but won't export raw queries; the raw export is the instrument.

**How is this different from keyword research tools?**
Keyword tools tell you what the internet asks Google. Your query log tells you what *your* audience asks *you* — a warmer, more specific, buyer-adjacent sample. Use both; trust yours more.

**What do we do with queries we never intend to serve?**
Record the deliberate ignore, with the reason. A logged decision ("job seekers asking for salaries — answered on /careers, linked") beats a rediscovered mystery next quarter.

**When should zero-result queries become pages versus nav fixes?**
If the thing exists and ranks, it's a discoverability fix (rename or relink). If the thing doesn't exist and the volume × relevance justifies it, it's a brief. The taxonomy sort forces this answer; that's its job.
