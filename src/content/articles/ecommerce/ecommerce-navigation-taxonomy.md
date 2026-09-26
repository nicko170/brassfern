---
title: "Taxonomy is the store: e-commerce navigation done properly"
description: "E-commerce taxonomy done properly: category trees that match how customers think, mega-menu rules, facets vs filters, and search as a navigational layer."
slug: ecommerce-navigation-taxonomy
cluster: ecommerce
tags: [ecommerce, navigation, ia, taxonomy, ux]
date: 2026-06-30
author: Hannah Yeo
keywords: [ecommerce navigation design, category taxonomy, faceted filtering ux, mega menu ux]
readingTime: 9
---

Your category tree is your shop floor. A physical retailer would never debate where products sit by looking at their own warehouse layout — but that's exactly what most e-commerce navigation does: it exposes the org chart, the supplier names, or the ERP's SKU hierarchy and calls it "categories." Customers don't know and don't care. They arrive with a mental model of what they want, and every mismatch between their model and your tree is a portion of your traffic walking out of a store they couldn't find the door to.

This is how we design navigation on [e-commerce builds](/services/ecommerce): taxonomy from customer language, not internal structure, then mega-menus, facets and search as layers of the same system.

## The category tree is not your catalogue

The first principle of information architecture for stores: **the tree is a hypothesis about how customers think, and hypotheses are tested.** Your supplier's naming ("Artisanal Preserves & Condiments") is how they warehouse products; customers think "jam." Your internal split ("Women's / Unisex / Accessories") is a merchandising org chart; customers think "something warm for Melbourne in June."

A good category tree has three properties:

1. **Predictable.** A first-time visitor can guess which branch holds any given product, first try, at least 80% of the time. Below that you don't have categories; you have a filing system.
2. **Shallow.** Two levels for most catalogues, three at most. Depth is not sophistication — it's hiding. Every level halves the audience that will climb down it.
3. **Stable.** Categories that churn break customer learning, bookmarks, SEO equity and your own merchandising data. Add leaves liberally; rename branches almost never.

And the tree is small. If your top-level navigation has more than seven-ish items, you don't have a taxonomy — you have an index pretending to be one. Everything beyond ~7 belongs in the second level, in [footer navigation](/journal/web-design/footer-design-matters), or in search.

## Match how customers think: run the card sort

The method hasn't changed since it was index cards on a table, and it's still embarrassing how rarely stores do it:

1. **Take your 40–60 most-visited products.** Print them as cards — name, one-line description, small photo.
2. **Recruit 12–20 people from your actual audience** (past customers, mailing-list volunteers, a research panel; we fictionalise recruitments in case studies, but the method is real). Ask them to group the cards into piles that make sense *to them* and name the piles.
3. **Look for convergence and conflict.** Convergence becomes your tree. Conflict — products that different people file in different branches — tells you where you need cross-listing (one product legitimately living in two categories) rather than a forced single home.
4. **Follow with a closed sort:** give a fresh group your proposed category names and ask them to file the same cards into *your* branches. Success criterion: 80%+ correct placement on the branches that carry most revenue.

Two rounds, a spreadsheet, a week. It's the cheapest research in all of UX and it prevents the most expensive failure — a launch where your bestsellers are filed under a word nobody searches.

A note on naming: label branches in the language customers sort with, even when it's less elegant than brand voice would prefer. You can soften with sub-labels. If everyone says "boots," the nav says boots, whatever the lookbook calls them. [Conversion copywriting](/journal/growth/conversion-copywriting) makes the same point: clarity beats clever, and nav labels are copy at its most concentrated.

## Mega-menu rules

Mega-menus earn their space once a category carries more than ~8 second-level items. The rules that keep them useful rather than overwhelming:

- **Columns are mental models, not page counts.** Group second-level items by *how customers subdivide the category* (by use, by material, by recipient) — never alphabetically, never by internal department. Alphabetical means "we didn't decide."
- **3–5 columns, each with ≤7 items.** Beyond that, everything blurs into a wall of links.
- **One promotional slot, clearly separated.** A single featured tile (new kit, seasonal edit) at the menu's right edge is fine commerce. Multiple promos inside the link columns turn navigation into a billboard and train customers to stop opening it.
- **The hover intent problem is real.** Mega-menus that appear/disappear on mouse-over timing fracture on trackpads and vanish for keyboard users. Implement click-or-focus-to-open with intent delays, and make sure every destination is reachable without the menu at all — the menu is an accelerator, not the only road.
- **Mobile is an accordion, honestly labelled.** The desktop mega-menu's visual organisation should collapse into a two-level accordion with parent category links preserved ("All footwear" as well as its branches). Losing the parent on mobile orphans the category landing page — often your best SEO asset — behind a hidden state.

## Filters vs facets — and who lives in the URL

Catalogue pages die of two diseases: no filtering (500 products, 40 per page, good luck) and filter sprawl (34 facets, most empty). The healthy middle:

- **Facets are the properties customers genuinely trade off.** Price band, size, colour, material, availability. Get the list from the card sort and from search queries — if people search "linen," linen is a facet, full stop.
- **Six to nine facets maximum**, ordered by observed usage, each showing live result counts. A facet with zero results for most selections is decoration that lies.
- **Filters are states, facets are properties.** "On sale," "in stock," "new this month" are filters — toggle states layered over the catalogue. Mixing them into the facet list muddies the mental model.
- **Faceted combinations that carry demand deserve indexable URLs.** "Linen dresses" as a static, cached, crawlable page is [technical SEO](/journal/growth/technical-seo-checklist-2026) and good navigation simultaneously. Combinations with no search demand get `noindex` and stay ephemeral. Decide per combination or your crawl budget becomes a swamp of near-duplicate pages.

## Search is the express lane of your navigation

Customers who search convert dramatically better than browsers in almost every store we analyse — because they arrived with intent and your navigation merely stood in their way. Treating search as a side feature is leaving that intent on the table: prominent placement, forgiving typo tolerance, synonym dictionaries built from zero-result logs, and results pages that respect your merchandising logic. The full treatment is in [search on storefronts](/journal/ecommerce/ecommerce-search-design); the taxonomy-relevant point is that **search query data is free taxonomy research.** Your zero-results report is a list of the words customers use that your tree doesn't. Every quarter, mine it: rename a category, add a synonym, or create the branch the queries demand.

## Category pages are content, not just grids

The final reframe: your top category pages are landing pages for both humans and search engines, and deserve design accordingly. Forty words of orientation copy ("what's here, who it's for"), curated featured slots above the grid, and internal links to adjacent clusters — for [Tallow & Co.](/work/tallow-and-co-providore), the pantry category page carried the providore's voice in two sentences and still out-ranked the home page for its target queries. Merchandising the grid itself — what leads, what's surfaced, what rests — is its own discipline; see [digital merchandising](/journal/ecommerce/merchandising-digital-shelves).

One hard-won law to close: **navigation changes shipping slowly.** Migration of a category tree is a project with redirects, SEO transition plans and a parallel-run period, not an afternoon in the CMS. Get the hypothesis from the card sort, prototype it, test the closed sort, then commit. You'll live with this tree longer than you think.

## Key takeaways

- The category tree models customer thinking, not your warehouse; test it like any hypothesis.
- Two rounds of card sorting (open then closed) costs a week and prevents filing your bestsellers under words nobody uses.
- Top-level nav caps at ~7; mega-menus get 3–5 columns with ≤7 items each, organised by mental model.
- Six to nine demand-derived facets with live counts; filters (states) and facets (properties) stay distinct.
- High-demand facet combinations earn static, indexable URLs; the rest stay ephemeral.
- Search logs are quarterly taxonomy research — the zero-results report is your tree's bug tracker.

## FAQ

**How many products before we need facets at all?** Roughly when a category exceeds two paginated pages — around 48–80 products, depending on grid density. Below that, a good grid beats a bad filter panel.

**Should we show product counts next to nav items?** Rarely. Counts add noise and date as stock changes. The exception is small catalogues (under ~15 per category) where "12 items" sets useful expectations — and even then, keep it to the menu.

**How do we handle products that fit two categories?** Cross-list them. One canonical URL, visible from both branches. Forcing a single home for a genuinely ambiguous product means half your customers never find it; duplicate pages with different URLs means search engines can't either.

**How often should the taxonomy change?** Leaves (subcategories) can respond to seasons and stock; branches (top-level) should be stable for years. If you're renaming top-level categories annually, the problem was the research, not the market.
