---
title: "Search on storefronts: the shopper's shortcut"
description: "Storefront search is where high-intent shoppers confess what they want. Instant results, synonym curation, zero-results recovery and honest measurement."
slug: ecommerce-search-design
cluster: ecommerce
tags: [site search, ecommerce ux, search design, merchandising, conversion rate]
date: 2026-01-20
author: Aiko Tanaka
keywords: [ecommerce site search, storefront search ux, instant search design, zero results page]
readingTime: 8
---

There's a moment on every storefront where the browsing ends and the shopper tells you, in their own words, exactly what they want. It's the search box. Shoppers who use it arrive with intent most site visitors never muster — they convert at multiples of browsers on nearly every catalogue we've instrumented — and stores routinely reward that intent with a results page that feels like filing a tax return.

Search is the store's concierge. A good concierge listens, clarifies, and never says "no" without offering an alternative. Here's how we design that concierge: the composition of instant results, the unglamorous craft of synonym curation, zero-results recovery, merchandising without manipulation, and the metrics that tell you if it's working.

## Design the answer, not the input

Most storefront search is designed as a field with a magnifying glass icon, and the thinking stops there. The interesting design surface is everything that happens *after* the first keystroke.

**Instant results, composed in layers.** As the shopper types, the dropdown should answer at three levels simultaneously: product matches first (thumbnail, name, price — the things that let someone recognise a product at a glance), then matching categories ("looking for the whole shelf?"), then — where it exists — relevant content like size guides or care instructions. Layering matters because searchers aren't a single intent: some know the product, some know the problem, some know the word wrong. The composition we shipped on the [Hearthbrew storefront](/work/hearthbrew-subscription-club) (play with it live in the [lab demo](/lab/hearthbrew-store)) puts two to four products up top, a category strip below, and keeps the whole panel navigable by keyboard — arrow keys down, Enter to go, Escape to dismiss. If your instant panel isn't fully keyboard-operable, it isn't finished.

**Query suggestions that teach vocabulary.** Autocomplete suggestions shouldn't be scraped keyword soup; they should reflect the catalogue's own language. If your PDPs say "espresso blend", suggestions should guide "expresso" typists toward that vocabulary — quietly training shoppers to speak the store's dialect, which improves every future search.

**Search input behaviour.** The box itself deserves craft: generous touch target, `type="search"` so mobile keyboards show a "Search" key, persistent query text on the results page (never clear what they typed — reformulation is diagnostic), and placeholder copy that suggests concrete example searches, not the word "Search".

## Synonym curation: the highest-leverage hour in commerce UX

Search engines fail storefronts in one predictable way: the customer's word isn't the catalogue's word. Shoppers type "sofa" into stores that say "couch", "runners" into stores that say "sneakers", "gumboots" where the PDPs say "wellies". Every mismatch is a high-intent shopper shown a zero-results page for a product you stock.

The fix isn't a smarter algorithm; it's a spreadsheet and an hour a month. Pull the search logs. Sort by zero-results queries and then by clickless queries. For each, ask: what *should* this have matched? Then write the synonym mapping — two-way where the words are genuinely interchangeable, one-way where they're not (a "laptop bag" searcher wants the bag category; a "bag" searcher doesn't want only laptop bags).

This curation is unglamorous, continuous, and worth more than any search-vendor feature. On catalogues with regional vocabulary spread — an AU/NZ store shipping to the US is the classic case — synonym work alone routinely cuts the zero-results rate by half. It's also merchandising knowledge in disguise: the words customers use that you don't are [digital shelf gaps](/journal/ecommerce/merchandising-digital-shelves) waiting to be named.

**Typo tolerance, tuned not trusting.** Fuzzy matching should catch "choclate" without flooding results with cocoa when someone types "chicory". The rule: tolerance scales with query length (short queries match tightly, long queries loosely), and a corrected query is always disclosed — "Showing results for *chocolate*" — so the shopper stays oriented.

Ranking deserves the same tuning: exact matches over partial, in-stock over out-of-stock, and business-weighted signals (bestsellers, margin) applied as gentle boosts, never as overrides. Ranking that hides the exact match on row three to push a high-margin near-match is a store lying to its best customer.

## Zero results: never a dead end

A zero-results page is a concierge shrugging. It should never exist in its pure form. Every empty query deserves, in order:

1. **Honest acknowledgement** — "No matches for 'lavender candle'" — with the query echoed back so the shopper can spot their own typo.
2. **Nearest neighbours** — partial matches, related categories, or fuzzier results clearly labelled as approximate. Lavender soap beats nothing.
3. **The popular shelf** — bestsellers or trending categories, which convert a surprising share of would-be exiters.
4. **A human door** — contact, or a "notify me" capture if it's a stock gap. A zero-results query with an email field is demand data, not a failure.

Also: search results pages are forms people finish differently — the design details in [designing forms people actually finish](/journal/web-design/forms-people-finish) apply doubly here, because this particular form is the whole interaction.

## Merchandising search without poisoning it

E-commerce platforms offer pins, boosts and banners inside search results, and the temptation is to turn the results page into a billboard. The discipline we've landed on:

- **Pinned products are labelled.** If a result is there because you put it there, say so — "Featured" — the way a good store marks staff picks. Shoppers grant stores a promotion budget; they don't grant deception.
- **Banners answer the query.** A promotion shown against a relevant search ("summer whites" alongside a linen search) is service. A banner ignoring the query is noise that trains scroll-past blindness.
- **Boosts are bounded.** Business weights shift order within a result set; they never decide membership in it. The shopper's query defines the shelf; merchandising arranges it.

## Measuring the concierge

Four metrics tell the whole story, and all four should be on a monthly dashboard owned jointly by e-commerce and UX:

- **Zero-results rate** — the compound metric of synonym debt, typo tolerance and catalogue gaps. Healthy storefronts run low single digits.
- **Search exit rate** — sessions ending on or immediately after a results page. The concierge's report card.
- **Reformulation rate** — how often a second query follows the first. High rates mean first answers miss.
- **Search-to-PDP click-through by position** — validates the ranking; if position four out-clicks position one consistently, your ordering is wrong.

Treat these like [analytics with a governance plan](/journal/growth/analytics-governance): events defined once, reviewed on a cadence, feeding the synonym spreadsheet. Search is never "done"; it's a shelf you reset every month.

## Key takeaways

- Searchers are your highest-intent visitors; the results experience is a concierge, not a database dump.
- Compose instant results in layers — products, categories, content — all keyboard-operable with disclosed corrections.
- Synonym curation from real query logs is the highest-leverage hour in commerce UX; run it monthly.
- Zero results should acknowledge, approximate, offer the popular shelf, and open a human door — never dead-end.
- Merchandise search transparently: labelled pins, query-relevant banners, bounded boosts. Measure zero-results rate, exit rate, reformulation, and position CTR monthly.

## FAQ

**Build search ourselves or buy a platform?**
Catalogues under a few thousand SKUs with a decent modern stack can do remarkably well with a self-hosted engine plus disciplined curation — you keep ranking control and speed. Buy when you need ML-driven personalisation at scale, but budget for the curation work either way; no vendor automates "gumboots = wellies" for you.

**How big should the search box be?**
Visible on every page, generous enough for a full product name, and icon-identifiable at a glance. Mobile-first stores can collapse to an icon that expands — but the expansion must be instant and focused, with the keyboard already up.

**Should out-of-stock products appear in results?**
Yes, clearly badged and ranked below in-stock equivalents, with a back-in-stock capture. Hiding them wastes demand data and disappoints later; showing them honestly converts some searchers into subscribers.

**How do we handle filters on search results?**
Reuse the PLP's faceted filtering, scoped to the result set, with counts per facet. Never show facets that would zero the set — disable them with reason, or omit them.

**What's a good zero-results rate target?**
Under 5% is healthy for a mature catalogue; pushing under 3% usually means synonym and typo work is paying off. New stores start higher — the trajectory matters more than the snapshot.

*Storefront search is part of every [e-commerce engagement](/services/ecommerce) we run — measured monthly, curated forever.*
