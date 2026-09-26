---
title: "Rolling your own search in 2026: cheaper and better than you think"
description: "Search is a product, not a plugin. When we self-host Meilisearch or Typesense instead of renting the big names, how we tune typo tolerance, and the UX that forgives."
slug: rolling-your-own-search
cluster: engineering
tags: [search, architecture, ux, infrastructure, product engineering]
date: 2026-06-11
author: Felix Brandt
keywords: [site search, meilisearch vs typesense, algolia alternative, instant search ux, search relevance tuning, typo tolerance]
readingTime: 11
---

Somewhere in the last decade, site search became a thing you rent by the record. The pitch was fair — relevance is hard, ops is annoying, and a hosted index with a dashboard is a genuinely good product. But somewhere along the way the default calcified: even a 4,000-product catalogue whose entire corpus fits in 40 megabytes of RAM gets wired to a metered SaaS, with a price that scales against you and a relevance model tuned for someone else's catalogue.

We've now replaced or avoided that arrangement on five projects. Not because hosted search is bad — it isn't — but because rolling your own in 2026 means something completely different from rolling your own in 2016. The self-hostable engines grew up. What follows is the decision framework, the indexing pipeline we now stamp out per project, and the UX layer that matters more than either.

## The decision framework, in three questions

**1. How big is the corpus, honestly?** Under a million small documents — products, articles, pages, records — both Meilisearch and Typesense run happily on a small VM or a container next to your app, holding the index in memory. A bookshop's 60,000-title catalogue with reviews is about 300MB of index. This is not an operations burden; it's a dependency on the level of Postgres, which you already run and already pay someone to back up.

**2. Who needs to tune relevance, and how often?** If merchandisers need to pin products hourly for campaigns, the hosted dashboards earn their fee. If relevance tuning is a quarterly task done by a developer anyway, the dashboard is a tax on a workflow you don't have. Be honest about which organisation you are; the fantasy of the marketing team lovingly curating boosts dies in week three.

**3. What's the blast radius of "search is down"?** If search is the primary navigation of a revenue-bearing storefront, you need a failover story either way — hosted or self-hosted, the answer is a health-checked fallback. Self-hosting at least keeps that fallback inside infrastructure you already monitor, rather than a second vendor's status page you can't fix. Our rule mirrors the broader one from [designing APIs frontends love](/journal/engineering/api-design-frontends-love): an integration your UI can degrade gracefully around is worth more than an SLA.

When the answers come out "small corpus, quarterly tuning, one catalogue" — which describes most content sites and mid-size commerce — we self-host. When it's "millions of documents, multi-region, a merchandising team with opinions," we rent, happily, and write the same UX layer in front of it so the decision stays reversible.

## The indexing pipeline is the actual product

The engine is an afternoon. The pipeline — getting clean, current, well-shaped documents into the index — is the week. Ours looks the same on every project now:

**Denormalise at index time, not query time.** Each search document is a flattened, search-shaped object: title, subtitle, category breadcrumbs as an array, price, availability, a `boost` integer, and one pre-computed `display` field containing exactly the string the result row will show. The engine never joins anything; the frontend never formats anything. This is the same contract-first instinct as our [CMS-to-component type safety work](/journal/engineering/type-safe-cms-content) — the document schema is generated from the content model, and a pipeline that can't produce the schema fails loudly in CI rather than quietly returning stale results.

**Reindex as an event, a schedule and a button.** Webhooks from the CMS update single documents on publish. A nightly full reindex catches everything the webhooks missed — because webhooks always miss something, and the nightly run is what lets you say so calmly. And a "reindex now" button in the admin panel, because the person who just renamed 400 products does not want to hear about eventual consistency.

**Version the index, swap atomically.** New schema or new settings go into a fresh index alias-swapped when ready. This makes schema changes boring, rollbacks instant, and the "did the deploy break search?" debugging session short. It also gives you a free preview environment for relevance experiments: tune ranking rules against tomorrow's index while today's keeps serving.

**Measure it like a feature.** Search latency p95, empty-result rate for the top 200 queries, click-through from results. That last pair is where the truth lives, and it's the same instrumentation habit as [frontend observability](/journal/engineering/frontend-observability-small-teams): you don't need an SRE to count zero-result queries, and the list of them is the most honest backlog your search product will ever have.

## Tuning typo tolerance without summoning mush

The seductive default is maximum forgiveness: two typos allowed, prefix matching on, everything fuzzy. The result is mush — queries that match what the user *meant* alongside three things they didn't, ranked by vibes. Our starting configuration, tuned on real catalogues:

- **Typo tolerance: one typo on words up to 8 characters, two above.** The user's thumbs make one mistake per word; a tolerance of two on short words lets "oak" match "oil," which is how a bookshop's search starts recommending lubricants to furniture shoppers.
- **Prefix matching on the last word only.** "dune mess" should autocomplete toward "dune messiah"; "du me" matching every document containing "medium" is noise with extra steps.
- **Exact matches outrank everything, visibly.** An exact title or SKU match goes first, always, even above boosted items. Users treat exact-match supremacy as a proxy for "this search is not stupid," and they are right to.
- **Facets count against the filtered result, not the corpus.** A filter sidebar showing counts from the whole catalogue trains users to distrust filters. This one is pure configuration on the engines above and a surprising number of shipped sites get it wrong.

Then the discipline: every relevance change gets tested against a saved set of 30–50 real queries with their expected top results. It is the smallest, most valuable test suite on the project. Relevance is a regression-prone API surface precisely because it feels like vibes; a saved expectation set is what keeps it honest.

## The UX layer that forgives

The engine buys you relevance; the interface is what users actually experience as "search." The unglamorous fundamentals, none of which the engine gives you:

**Debounce and out-of-order safety, or it all falls apart.** 150ms debounce, and every request carries a monotonic sequence so a slow response to "wine" can't clobber the fast response to "wine glasses." If you remember one implementation detail from this article, make it that one — stale-response races are the source of nearly every "search feels janky" complaint we've ever diagnosed on inherited builds.

**Zero results is a design state, not an error.** Show the query as understood ("No results for 'chardonay'"), the did-you-mean suggestion as a confident link ("Show results for *chardonnay*"), and three genuinely useful exits: a category, a popular item, a contact path. An empty page with a sad icon is a product decision, and it's a bad one.

**Highlight the match.** Bold the matched terms in result titles, and show *why* a result matched when it's not obvious from the title — a snippet with the term in context. Users forgive imperfect ranking; they don't forgive results they can't explain.

**Render the first page from the server.** Search results that exist only after client hydration are invisible to crawlers, share-previews and slow devices. Where search pages are indexable landing surfaces — category-adjacent query pages on commerce builds — we prerender them like any other route. And when the whole corpus is small enough — like this site's journal — the honest answer is skipping the search server entirely: our own [/search](/search) page ships a compact index to the browser and filters it client-side, instantly, offline, at zero monthly cost. "Roll your own" includes rolling *less*.

For the [Willow & Wren bookshop](/work/willow-and-wren-bookshop) build, this whole stack — self-hosted engine, event-driven pipeline, forgiving UI — replaced a rented setup at roughly a quarter of the monthly cost, with median query latency under 25ms from a box that also runs the CMS. The number that matters more: empty-result rate on the top 200 queries dropped from 11% to under 2%, almost entirely from tuning and zero-result design rather than engine choice.

## Key takeaways

- Under ~1M small documents, self-hosted search is a Postgres-level responsibility, not an ops project.
- The engine is an afternoon; the indexing pipeline — denormalised documents, event + nightly + manual reindex, alias swaps — is the real product.
- Cap typo tolerance (one per short word), prefix-match the last token only, and let exact matches outrank boosts.
- Keep a 30–50 query relevance regression suite; relevance is an API surface.
- Debounce 150ms and guard against out-of-order responses before tuning anything else.
- Design the zero-results state with did-you-mean and real exits; it's where trust is won or lost.
- If your corpus fits in memory, consider no server at all.

## FAQ

**Self-hosted or hosted — what's the honest break-even?**
On pure subscription cost, self-hosting wins under a few million documents, but the true comparison includes your team's hours. We model it as: hosted covers its fee when you use the dashboard weekly (merchandising, synonyms, campaigns). If you log in quarterly, you're renting a dashboard you don't open.

**Meilisearch or Typesense?**
Both are excellent, memory-resident and a single binary away. We reach for Meilisearch when the content team wants approachable ranking-rule tuning and space-style search; Typesense when the workload is heavier on structured filtering and curation rules. Bake the choice behind your own API layer and it stays reversible.

**How do you handle multi-language catalogues?**
One index per locale, with locale-aware tokenisation, rather than one index with a language field filtered at query time. Relevance heuristics are language-specific enough that the split pays for itself; the pipeline is identical per locale.

**What about vector and hybrid search?**
For catalogue-style "find the thing" queries, keyword search with good typo tolerance still wins on quality and predictability. We add embeddings where the corpus is prose and the queries are questions — knowledge bases, documentation, the kind of retrieval work covered in our [AI services practice](/services/ai) — and even then, hybrid with keyword as the spine, vectors as the supplement.

**What's the single biggest mistake you inherit?**
No zero-result analytics. Teams tune relevance blind, guessing at failures, while the list of queries returning nothing — searchable in five minutes of instrumentation — sits uncollected. Instrument that first; everything else can wait a sprint.
