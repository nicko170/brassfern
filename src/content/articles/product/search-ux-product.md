---
title: "Product search UX: from query box to answers"
description: "In-app search is a product decision wearing an engineering costume: scoping, suggestions, typo tolerance, filters vs facets, and no-results states that navigate."
slug: search-ux-product
cluster: product
tags:
  - Search
  - Interaction design
  - Information retrieval
  - UX
date: 2026-03-02
author: Felix Brandt
keywords:
  - search ux design
  - site search design
  - faceted search
  - no results page
readingTime: 9
---

Every product team treats search as infrastructure: pick an engine, index the documents, expose an endpoint, draw a box. Then the complaints arrive. "Search doesn't work." Investigation reveals that the index is fine and the engine is fine — the product around them was never designed. Nobody decided what search is *for*, what it scopes to, what a result looks like, or what happens when there aren't any. The box was drawn; the answers were not.

Search UX fails upward from undecided product questions. Here are the six decisions that matter, in the order you should make them — because engine choice, which teams agonise over, matters least.

## 1. Decide what search is for before you decide how it works

There are three different jobs hiding inside the word "search", and they want different interfaces:

- **Navigation**: the user knows the thing exists and wants to reach it. "Invoices", "Sarah Chen's account". Speed is everything; keyboard-first, instant results, one result type.
- **Retrieval**: the user knows roughly what they want and needs to find it among similar things. Products, documents, records. Relevance ranking and filters carry this job.
- **Exploration**: the user is forming the question. Journals, archives, catalogues. Serendipity, related content and forgiving, broad matching matter more than precision.

Most products need the first two; some need all three. The design failure is building a retrieval interface for a navigational need (a heavy results page where a command-palette jump would do) or a navigational interface for a retrieval need (a dropdown of ten prefix matches where the user needed to browse forty candidates). Name the job in the brief or you'll build the average of three interfaces, which serves none of them.

## 2. Scope visibly, or don't scope at all

Mixed-index search — users, documents, settings, help articles in one result set — sounds generous and reads as chaos. The pattern that works is the pattern you can see: scoped tabs or segmented results with honest counts ("Projects — 4 · Documents — 12 · Help — 2"), so the user learns what the index contains by using it. Hidden scoping is the failure: the query silently searches only titles, or silently excludes archived items, and the user concludes the thing they want doesn't exist.

This came up hard on the [Postcards from the Museums](/work/postcards-museum-archive) build: 8,000 digitised postcards across six collections. Early prototypes searched everything and returned undifferentiated grids; testing showed people couldn't tell *where* a result lived or why it matched. The shipped design states its scope on the box itself ("Search titles, inscriptions and places") and groups results by collection with counts. Zero-result complaints fell away because boundary confusion fell away.

## 3. Suggestions are your relevance interface

The dropdown beneath the query box is doing more design work than the results page. Good suggestion layers, in rough priority order:

1. **Recent searches** on focus, before a keystroke — free relevance, because repeat queries are the most common queries in most products.
2. **Query completions** that show why they're suggested (a highlighted match on the user's prefix), not opaque magic.
3. **Direct answers** — if the query matches an entity (a customer, an order number), offer to jump straight to it. Skipping the results page for high-confidence matches is the single biggest speed win available to retrieval interfaces.
4. **Zero-state help**: the empty dropdown should teach syntax ("Try a postcode, a species, a date like 1987") if your index has structure worth knowing.

Whatever you show, keyboard interaction is non-negotiable: arrows to move, Enter to commit, Esc to dismiss, focus never trapped, the active option announced. Search dropdowns are the single most common keyboard trap we find in audits — which is one more reason [accessibility intent belongs in the design file](/journal/web-design/accessible-design-handoff), not in a post-launch bug queue.

## 4. Typo tolerance is a silence problem

Users can't tell the difference between "no results because I misspelled it" and "no results because it doesn't exist". Your interface must resolve the ambiguity for them. The hierarchy, best first:

- **Silent tolerance**: fuzzy matching on tokens, so "restuarant" just works. The best typo handling is invisible.
- **Did-you-mean with one-click apply**: shown when confidence is high, phrased as assistance not correction.
- **Explicitly honest fallback**: "No matches for *restuarant* — showing results for *restaurant*" when you chose to correct on their behalf. If you autocorrect, always say so; silent correction breaks trust in counts.

Benchmarks from the engine documentation won't save you here — the tolerance has to be tuned against your corpus. Contract names tolerate nothing; cafe names tolerate plenty. Set aside real user queries from analytics (you are logging queries, yes?) and regression-test your tuning against them.

## 5. Filters vs facets: know which game you're playing

**Filters** narrow a known result set — applied from the result list, composable, reversible, each labelled with its count. **Facets** describe the corpus — shown on the results page as an overview of the terrain. Good retrieval interfaces do both and never confuse them: facets help an explorer take a bearing; filters help a retriever tighten the noose.

The functional rules that survive contact with users:

- **Counts on every option**, computed against the current query. An option that yields zero should say zero (disabled), not vanish — disappearing options make the interface feel unpredictable.
- **Never vanish applied filters.** Applied state lives above the results as dismissible chips, duplicated in the sidebar. Users should be able to reconstruct why they're seeing what they're seeing.
- **URL-synced state.** A filtered view is a shareable, back-button-able, refreshable resource. If pressing back after applying three filters leaves your product entirely, you've built a modal, not a view.
- **Reset exists and is findable.** "Clear all" is not a garnish.

## 6. The no-results page is a navigation surface

Zero results is not an error state; it's a fork in the road, and it will be a statistically large fork — on content sites we instrument, 5–15% of queries end there. Treat it as seriously as you treat [the 404](/journal/web-design/designing-404-pages), because it has the same job: orient, recover, charm-lite. Concretely: say what was searched and where; offer spelling corrections; broaden the scope one notch ("No matches in Projects — search everything?"); and show the de-facto exits (popular content, browse paths). What you must never do is show a bare "No results found" and strand the user at the exact moment their intent was most clearly expressed.

## Relevance is a product decision

Everything above is design. Underneath it sits the uncomfortable truth that relevance tuning — field weights, recency boosts, what gets indexed at all — is a series of judgement calls about what your users deserve to see first, and those calls belong to product people, not to an engine's defaults. When we rebuilt catalogue search for [Tallow & Co.](/work/tallow-and-co-providore), the ranking spec was written by the buyer-persona research, not the search vendor: in-stock beats everything, then cut popularity, then recency. The engineers implemented; the product owned the outcome. That's the split that makes search a feature instead of a lottery.

## Key takeaways

- Name the job first: navigation, retrieval or exploration. Each wants a different interface.
- Make index scope visible — on the box, in result grouping, in honest counts.
- Suggestion layers carry the relevance experience: recents, completions, direct answers, keyboard-complete.
- Typo tolerance resolves ambiguity silently, corrects transparently, and is tuned against real logged queries.
- Filters narrow; facets orient. Counts everywhere, applied state never hidden, state in the URL.
- No-results is a navigation page with the same discipline as your 404.

## Frequently asked questions

**Do we need a dedicated search engine, or is SQL LIKE fine?**
For small corpora with simple needs, database full-text search is genuinely fine and operationally cheaper — start there. Graduate to a dedicated engine when you need serious typo tolerance, synonym handling, faceting at scale or ranking control. The mistake isn't the modest stack; it's shipping the modest stack with a UI that promises search-engine behaviour.

**Should search results be paginated or infinite?**
For retrieval and exploration tasks, "load more" with a stable scroll position beats both pagination and infinite scroll: pagination buries results behind arbitrary cuts, while true infinite scroll destroys the footer and the scrollbar-as-map. Navigation-style quick search shouldn't paginate at all — cap it and offer "see all results".

**How do we measure whether search is working?**
Four signals: exit rate from results pages, query refinement rate (how often the second query is a slight edit of the first — a relevance smell), zero-results rate, and click position of the first interaction (if the median click is result six, your ranking is wrong). Review monthly against real queries, in the same routine as your [analytics practice](/services/growth).

**Is AI/semantic search ready to replace keyword search?**
For exploration-shaped corpora — documentation, research, archives — hybrid semantic-plus-keyword search is already better than either alone, and our [AI practice](/services/ai) ships exactly that pattern. For navigational and transactional queries, keyword precision still wins and semantic fuzz actively hurts. The right answer for most products is layered: fast keyword core, semantic fallback when keyword fails, and an interface that doesn't pretend one technology did everything.
