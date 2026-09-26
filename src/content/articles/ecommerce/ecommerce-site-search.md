---
title: "Site search: the highest-intent feature most stores neglect"
description: "On-site search users convert at multiples of browsers, yet most stores never open their search logs. The analytics loop, merchandising rules and KPIs that fix it."
slug: ecommerce-site-search
cluster: ecommerce
tags: [site search, search analytics, merchandising, ecommerce ux, catalogue]
date: 2026-08-12
author: Nate Sullivan
keywords: [ecommerce site search, search analytics, search merchandising, zero results queries, autocomplete UX]
readingTime: 10
---

Ask an e-commerce team what share of their revenue touches the search box and most will guess. Then we open the analytics together and watch the room recalibrate: searchers are typically 5–15% of sessions, converting at two to five times the rate of browsers, and contributing a wildly disproportionate slice of revenue. Site search is the only feature on the store where customers write down, in their own words, exactly what they came to buy. It is a confession booth for purchase intent.

It is also, on most stores, completely unmaintained. Nobody owns it. The synonym list was seeded at launch in 2022. The zero-results report has never been exported. Merchandising rules were set by whoever could find the admin panel. We've now instrumented search on everything from a [bookshop](/work/willow-and-wren-bookshop) to a [B2B industrial supplier](/work/arkwright-supply-b2b-commerce), and the pattern holds: search is the highest-leverage, lowest-effort improvement available on a mature catalogue — not because the technology is exotic, but because the *operations* are absent. This piece is the operating manual. (For the interface patterns themselves — instant results composition, keyboard behaviour, zero-results page design — see Aiko's companion piece on [storefront search design](/journal/ecommerce/ecommerce-search-design). This one is about the loop behind the glass.)

## The search analytics loop: an hour a month, forever

Search improves through a boring monthly ritual, not a platform migration. The loop has four inputs and one output, and it fits in a calendar invite.

**1. The zero-results report, ranked by volume.** Every query that returned nothing is a customer who told you what they wanted and were told you don't have it — even when you do. Pull the top fifty zero-results queries of the month. Classify each:

- *Wrong word* — you stock it under another name. That's a synonym entry (see below).
- *Genuine gap* — you don't stock it. That's merchandising intelligence: recurring zero-results demand is a buying signal for the range team, free of charge.
- *Content, not product* — "returns", "sizing", "shipping to NZ". Your search should route these to content pages. If it doesn't, that's a routing rule.
- *Noise* — ignore it. Some queries are "asdfgh". That's fine.

**2. The clickless-queries report.** Queries that returned results but got no clicks are subtler failures: results existed but looked wrong. Usually the top result is a near-match with a bad thumbnail, or the ranking buried the obvious match. Each of these is a ranking or presentation bug with a name on it.

**3. The reformulation rate.** What share of searchers immediately search again? Reformulation is the search equivalent of a customer repeating themselves to a staff member. A healthy catalogue sits low; spikes after a range change or a synonym edit tell you a mapping broke something.

**4. Exit-after-search.** Searchers who leave the store from the results page without clicking anything. This is your most expensive exit event in analytics — highest intent, zero return.

The output of the ritual is a small, dated changelog: synonyms added, ranking tweaks, rules retired. Thirty entries a year compounds into a search system tuned to *your* customers' vocabulary — an asset no platform switch preserves and no competitor can copy, because it's made of your own query logs.

## Synonyms: a library, not a list

The [search design piece](/journal/ecommerce/ecommerce-search-design) makes the case for synonym curation; here's the operational shape. Treat synonyms as a versioned library with three entry types, reviewed in the monthly loop:

- **Two-way equivalents** — genuinely interchangeable words ("couch" ↔ "sofa"). Keep this list short; equivalence is rarer than people think.
- **One-way hypernyms** — the specific implies the general, never the reverse. "Gumboots" → "boots", but "boots" does not map to gumboots. Most useful synonym work is this kind.
- **Query rewrites** — whole-phrase interventions. "Gift for dad" → curated gift category or the [gift-buying flow](/journal/ecommerce/gift-buying-ux). "iPhone case" at a store that sells "phone covers" → rewrite, don't synonym-chain.

Two disciplines keep the library healthy. First, every entry cites its evidence (the query log line that motivated it) — synonyms added on a hunch during a meeting decay into noise. Second, prune annually: entries that no longer correspond to live queries get retired. A synonym library, like a [navigation taxonomy](/journal/ecommerce/ecommerce-navigation-taxonomy), is gardening, not architecture.

## Merchandising rules: power tools with a governance problem

Every search platform ships merchandising rules — pins, boosts, buries, banners. They're how a merch team puts the new season on the top shelf. They're also how search results quietly stop reflecting what customers asked for. The failure modes we see repeatedly:

**The pin that outlived the season.** Someone pinned a Valentine's collection in February; it's October and "candle" still leads with heart-shaped stock that's sold down to one scent. Rules need expiry dates at creation time. No expiry, no pin.

**Boosts stacked into incoherence.** Ranking-then-boost-then-pin, added by three teams over two years, until nobody can explain why a result ranks where it does. Once a quarter, reproduce the top ten results for your ten highest-volume queries *by hand* in a spreadsheet: query, expected top results, actual top results. Disagreement between the two columns is your rule-debt register.

**Margin overrides disguised as relevance.** Boosting high-margin near-matches above exact matches is the store lying to its best customer — and it's measurable: click-through on the top result falls, reformulation rises. Margin belongs in boosts, gentle ones, and never above an exact match. The exact match is the customer being right.

**Banner blindness in the results.** Promotional banners injected into results pages are legitimate when they match intent ("you searched walking boots — the winter range just landed") and corrosive when they don't. Rule: the banner's category must match the query's category, or it doesn't render.

Governance is one paragraph long: rules are created with an owner, a reason, an expiry; the monthly loop reviews what fired; the quarterly audit replays top queries by hand. That's it. The goal isn't to forbid merchandising — it's to keep search *accountable to the query*, the same principle we apply to [digital shelf merchandising](/journal/ecommerce/merchandising-digital-shelves) generally.

## Measuring search like a revenue feature

Search earns maintenance budget when it's reported like the revenue feature it is. Five numbers, monthly:

- **Search usage rate** (share of sessions using search) — watch for drops after navigation changes; sometimes the fix belongs in [taxonomy and nav](/journal/ecommerce/ecommerce-navigation-taxonomy), not search.
- **Zero-results rate** — target under 2%, driven by the loop, not the algorithm.
- **Search exit rate** — the expensive one; trend it.
- **Revenue share via search** — for the exec slide that funds the hour a month.
- **Click-through on the first result** for the top hundred queries — the cleanest single health metric there is. If customers aren't clicking the first answer, search isn't answering.

At Arkwright Supply, the B2B catalogue runs on part numbers, abbreviations and tradie shorthand — "dynabolt", "sleeve anchor", the SKU itself. The monthly loop there isn't optional garnish; it's the difference between a reorder taking forty seconds and a phone call. That's the general case, compressed: search maintenance is the cheapest customer-service reduction and the cheapest conversion lift on the P&L, and it costs one spreadsheet and one recurring hour.

## Key takeaways

- Searchers are a minority of sessions and a majority of intent; revenue share via search is the number that gets the work funded.
- Search decays through neglect, not bad technology. The fix is a monthly loop: zero-results, clickless queries, reformulation, exits.
- Synonyms are a versioned library with evidence attached — two-way, one-way, and rewrites — pruned annually.
- Merchandising rules need owners, reasons and expiry dates; audit by replaying top queries by hand each quarter.
- Never rank a margin-boosted near-match above an exact match. That line, once crossed, is visible in your reformulation rate.
- Report five metrics monthly and click-through-on-first-result is the north star.

## FAQ

**Which search platform should we use?** Later than you think. The loop in this piece runs on the search that ships with every major commerce platform plus an analytics export. Graduate to a dedicated search service when the catalogue is large, the vocabulary is gnarly (B2B part numbers, technical specs), or personalisation matters — usually as part of a broader [headless commerce](/journal/ecommerce/headless-commerce-when-worth-it) decision. Platform first, operations second is how stores end up with expensive search and the same zero-results rate.

**Can AI/vector search replace the synonym library?** It reduces the wrong-word problem; it doesn't touch the governance, merchandising-accountability or analytics-loop problems — and it can silently drift in ways a synonym table never does. Our practical stance: semantic search as a recall layer, human-curated synonyms as the accountable layer, the monthly loop as the referee. The loop stays either way.

**We're a small catalogue — 200 products. Does this apply?** At 200 products, great [navigation and taxonomy](/journal/ecommerce/ecommerce-navigation-taxonomy) carry more of the load, but the zero-results report is even cheaper to run — sometimes twenty queries a month — and each one is a named customer failing to buy. Small catalogues can't afford to lose high-intent sessions to a missing synonym.

**Where does this sit in a Brassfern engagement?** Search instrumentation and the first three months of the loop are a standard module in our [e-commerce engagements](/services/ecommerce), usually alongside checkout and speed work. The deliverable isn't a tool — it's the ritual, the reports, and a team that knows how to read them after we've left.
