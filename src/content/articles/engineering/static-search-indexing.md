---
title: "A search index built at build time"
description: "A build-time search index for static sites: tokenisation, stemming, synonyms, size budgets, sharded delivery, worker-side ranking, and proof it got better."
slug: static-search-indexing
cluster: engineering
tags:
  - search
  - performance
  - static-sites
  - data
date: 2026-09-04
author: Felix Brandt
keywords:
  - static site search
  - search index build
  - client-side search engineering
  - search performance
  - content search
readingTime: 10
---

A content site with search but no server used to have two options: pay a hosted search vendor to hold twenty megabytes of your own words hostage behind their JavaScript, or give up and point at Google with `site:`. Both felt wrong for a statically rendered site that already knows — at build time, with complete certainty — the full text of every page it will ever serve.

So we build the third thing: **the search index is a build artifact**. Compiled during the content pipeline, versioned with the deploy, sharded, compressed, and queried in a web worker by a ranking function small enough to read in one sitting. This site's own [/search](/search) runs on exactly this machinery. Here is how to build it well.

## Why build-time wins

We made the build-vs-buy case in [rolling your own search](/journal/engineering/rolling-your-own-search); the short version is that most content sites have a few hundred documents and readers who query in two-word bursts. That workload doesn't need a SaaS cluster. It needs a good index file and a careful ranking function.

Building the index at build time gives you properties no runtime indexer can match: **freshness is automatic** (index and content deploy together, atomically — no crawler lag, no reindex cron), **the corpus is parsed once** (from your structured content pipeline, not scraped out of rendered HTML), and **the failure mode is honest** (if indexing breaks, the build fails loudly, not the search box quietly).

## Anatomy of the index

Strip a search index to its skeleton and it's three structures:

- **Documents**: `[{ id, url, title, cluster, date, description }]` — everything the results UI renders comes from here, so the ranking pass never needs the page itself.
- **Inverted index**: `{ token: [docId, docId…] }`, optionally with per-field scores folded in. This is the hot structure; everything else is garnish.
- **Boost table**: per-document weights (a case study outranks a tag page; a recent article outranks a stale one) computed at build time, where trends are cheap to compute.

Two size disciplines matter immediately. Store postings as **delta-encoded varint arrays** rather than JSON number lists — a token appearing in 80 documents serialises as a short string instead of 400 bytes of digits and commas. And intern repeated strings (cluster names, tags) as small integer IDs. Together these routinely halve index size before compression even sees it.

## Tokenisation: where search quality is decided

Ranking algorithms get the conference talks; tokenisation decides whether your search works at all. Our pipeline, in order:

1. **Normalise.** Unicode NFKC, case-fold, strip diacritics into a folded token *alongside* the original (searching "tomas" should find "Tomás"; displaying should show the real string).
2. **Split on a real word boundary**, not just whitespace — hyphens, slashes and camelCase are word edges in technical content. "UseEffect" must match "use effect" and "useEffect".
3. **Keep a stoplist short and cowardly.** The classic 500-word stoplist deletes genuinely meaningful queries ("how do I", "it"). We keep only pure structural words, and index short tokens anyway for the corpus's own jargon ("RSC", "a11y").
4. **Fold numbers and versions.** "React 19" should match "react19" and "react 19.0" — documentation is full of version-shaped queries.

Every one of these decisions is testable: write a fixture list of (query → must-find document) pairs from real failed searches and run it in CI. Which brings us to the corpus of those queries — **your own search box is the research department**, and we log queries (nothing else) precisely so "what did people type and find nothing" becomes the backlog for both tokenisation and content. It's the same loop described in [internal search mining](/journal/growth/internal-search-mining), just with engineering consequences.

## Stemming and synonyms: spend carefully

**Stemming** ("ship", "shipped", "shipping" → one token) buys a lot of recall for English and we ship a light suffix stemmer (~40 lines, deliberately dumber than Porter — over-aggressive stemming merges words users distinguish, like "design" and "designation"). For multilingual corpora, stemming complexity explodes and honest advice is: ship folded tokens without stemming first, and add language analyzers only when query logs prove the miss rate justifies them.

**Synonyms are content strategy, not linguistics.** A generic thesaurus is worse than useless ("demo" → "demonstration" finds Shakespeare). What works is a short, hand-maintained map of *this audience's* vocabulary: `pricing ↔ cost, quote`, `checkout ↔ payment`, `LLM ↔ model, AI`. Ours is 60 entries, reviewed quarterly against the zero-results list, and responsible for a measurable drop in dead-end searches. Maintain it like a product feature, because it is one.

## Size budgets and sharding

The index competes for bytes with everything else on the page, so it lives under the same discipline as the JavaScript bundle — we enforce it next to the [bundle budget](/journal/engineering/bundle-budget-discipline) in CI. Our working targets for a ~600-document site:

- **Full index ≤ 250KB compressed.** Past that, you shard.
- **A tiny "hot" index ships with the search page** (titles + descriptions only, ~30KB) so the first keystrokes feel instant while the full body index streams in behind.
- **Shard by cluster** when the corpus grows: a reader searching from an engineering article almost certainly wants engineering first, so that shard is already warm. Shards carry a build hash in the URL so they cache for a year and invalidate atomically with the deploy.

Deltas instead of full re-ships (CRDT-style index diffs) are seductive and, at this scale, theatre — a 250KB annual-cached asset does not need a sync protocol. Spend that complexity budget on ranking.

## Querying: workers, ranking, and the honest millisecond

Search computation runs in a **web worker** — scoring 600 documents is trivial, but tokenising a paste-happy query and intersecting postings still belongs off the main thread, exactly per the division of labour in [web workers for real work](/journal/engineering/web-workers-real-work). The contract is one message type in (`{ query }`), one out (`{ results }`), and a promise-wrapped API so the UI never touches `postMessage`.

Ranking is BM25-lite with field weights, tuned by hand against the fixture suite:

- Title match ≫ description ≫ body. A rare token in a title beats ten common ones in prose.
- **Prefix matching for typeahead**: while the query is being typed, match token prefixes (an editor-built forward index per shard makes this cheap); commit to full tokens on submit.
- Build-time boosts decay gently with age and lift case studies — but keep every boost small enough that a strong text match still wins. Boosts should break ties, not rig elections.
- Zero-result handling is a feature: suggest the nearest non-empty query (edit distance over the token set), and — because you logged the query — the miss becomes next quarter's synonym entry.

Debounce input at ~120ms, cancel in-flight scoring on new keystrokes (a sequence number, not AbortController ceremony), and render results as real links with real titles. The whole client is under 6KB of our own code — a rounding error against the vendor script it replaced.

## Proving it got better

"Search feels faster" is not a metric. We track four numbers, weekly, from the anonymous query log:

- **Zero-result rate** (target: under 8% on a mature corpus; it started at 22% before synonyms landed).
- **Click-through on results** — a search that produces no click almost always produced no answer.
- **Time-to-first-result**: keystroke to painted list, p75 on mid-range phones. Ours sits at ~40ms; anything over 150ms starts to feel like a page, not a feature.
- **Refinement rate** — how often the second query is a respelling of the first. High refinement is tokenisation failing, and it's the signal that feeds the fixture suite.

That last loop — log, mine, fixture, fix, measure — is what turns a build artifact into a product. The index is the easy part. The humility loop is the feature.

## Key takeaways

- A build-time index deploys atomically with content: no crawler lag, no reindex cron, and indexing bugs fail the build, not the search box.
- Tokenisation decides quality: real word boundaries, diacritic folding, and version-number normalisation matter more than any ranking algorithm.
- Stem light and maintain synonyms by hand from your zero-results log — generic thesauri degrade precision.
- Budget the index like JavaScript: ≤250KB for the full corpus, a hot title index for instant typeahead, cluster shards with hashed URLs beyond that.
- Score in a web worker behind a promise API; rank with field weights and small build-time boosts that break ties rather than rig them.
- Measure zero-result rate, click-through, p75 latency, and refinement rate — and let those numbers write the backlog.

## FAQ

**When is a hosted search service actually the right call?**
When the corpus is huge (tens of thousands of documents), changes continuously between deploys, includes private per-user content, or needs serious multi-language analysis. A build-time index is unbeatable below roughly 5,000 public documents and wrong above roughly 50,000; between those, argue it out in the open with real corpus numbers.

**How do you handle results from pages that require JS to be useful?**
Every result in our index points at a statically prerendered page, so clicking through never depends on hydration. If your site isn't prerendered, fix that before you build search — a results list leading to loading skeletons teaches users not to search.

**Does client-side search leak private content?**
Only if you index it. Anything in the index is downloadable by anyone, authenticated or not — which is obvious when you say it out loud, and still the most common real-world bug in this architecture. Index public content only, and assert publicness in the build.

**Why not just use Pagefind / a library?**
Honestly: consider it. Pagefind is good tooling and we've shipped it. We hand-roll when the result UI is deeply designed, when ranking needs editorial judgement (boost tables, cluster weighting), or when the corpus has structured fields a generic indexer can't see. The decision is identical every time: use the library until it makes the product worse, then own the last mile.
