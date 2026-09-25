---
title: "Digital merchandising: shelves, not search results"
description: "Collection pages are shelving decisions wearing a UI. Sequencing strategy, badges with meaning, photography rhythm, facets that match mental models."
slug: merchandising-digital-shelves
cluster: ecommerce
tags: [merchandising, collection pages, ecommerce ux, visual hierarchy, retail]
date: 2025-03-19
author: Hannah Yeo
keywords: [ecommerce merchandising, collection page design, plp optimization, product listing ux, category page design]
readingTime: 10
---

Walk into a good butcher, a good wine shop, a good bookshop, and the shelving is doing quiet, continuous persuasion. The eye-level shelf holds the margin. The tops are for theatre and stock. The bottom shelf carries the bulky loyalists that would sell from a car park. The counter has three impulse items, chosen this morning, changed often. Nobody in the shop calls this "content hierarchy" — it's just what selling looks like when it's been done for a hundred years.

Then most of us build e-commerce category pages that render the database: forty products in whatever order the CMS vomits them, identical cards, a badge that says "SALE" on everything, and filters copied from a competitor's widget library. The shop has no eye-level shelf. It's a search result that happens to sell things.

Collection pages — PLPs, if you're wearing the acronym — are the highest-traffic, lowest-craft screens in most online stores. This article is our working method for fixing that, built through merchandising a [providore's pantry](/work/tallow-and-co-providore), a [cool-climate wine label](/work/fernleigh-wines-dtc-storefront), and a [skincare brand](/work/glade-skincare-ingredient-honesty) whose shelf logic is ingredient honesty.

## Sequencing is a strategy, not a sort order

"Sort by: Bestsellers" abdicates the most valuable decision on the page to a query. Baskets, margins, stock depth and seasonality all have claims on the first viewport, and a single default sort serves exactly one of them.

Our sequencing practice:

- **The first viewport is an editorial argument.** In a physical shop, the front table has a thesis — "the new season", "the gifts under fifty", "the thing we're famous for". Give your first four to eight positions the same job, and let them be curated, not computed. Curated here means a merchant actually chose them, weekly — which means your CMS needs a drag-and-drop pin layer over the algorithmic tail, and you need a calendar obligation to use it.
- **The tail gets the algorithm.** Positions nine through four hundred are where bestseller-by-revenue, new-arrivals-by-margin or personalisation earn their keep. The honest architecture is: human thesis on top, machine throughput beneath, and a page that never has to admit which is which.
- **Sequence to season, not to the calendar year.** For Fernleigh, the entire shop re-sequences around four moments — the vintage release, winter reds, the Christmas hamper window, the summer picnic shelf. The category structure doesn't change; the shelving does. Merchandising calendars are content calendars for products, and most stores have the latter and not the former.
- **Bury the dead honestly.** Out-of-stock products in the first rows are shelf gaps. Grey them *down* the rank rather than deleting them (they still carry SEO value and returning-customer bookmarks) — but never let a customer fall in love with position three and find it unavailable.

## Badges: a currency that inflates when overprinted

A badge is a promise that this card deserves an interruption. "New", "Bestseller", "Low stock", "Staff pick", "Back in". Each competes for the same thirty pixels above the product name, and every additional badge makes all badges cheaper.

Rules we now apply by default:

- **One badge per card, chosen by priority,** not by stacking everything true about the product. Priority order tends to be: social proof (Bestseller) > scarcity (Low stock, only when genuinely true) > novelty (New, with a 30-day expiry so it self-retires). A card wearing three badges is a card wearing none.
- **Scarcity badges must be computationally honest.** "Only 2 left" must mean two. Inventory-fed scarcity is persuasion; invented scarcity is a lie with a regulatory tail and — worse — it trains regular customers to ignore you. At Tallow & Co., low-stock badges are wired to actual coolroom counts, and the honesty is itself part of the brand.
- **The badge palette is part of the design system.** Badge styles live in tokens, not in campaign files. If a marketing team can mint a new badge colour for a promo, anti-inflation policy is already lost.

## Photography rhythm: the shelf needs a tempo

A grid of forty identically-composed packshots has the tempo of a spreadsheet. Physical shelving has rhythm — hero blocks, breathing room, an occasional pedestal. Digital shelves can have it too, carefully:

- **Doubles and full-width interruptions, sparingly.** One in every twelve to sixteen cards can render at double width as a visual anchor — typically the curated thesis items themselves, or a quiet editorial tile ("the pantry staples box, packed Friday"). More than that and you've built a magazine nobody can shop from.
- **Consistent crop logic is non-negotiable.** Mixed aspect ratios on the same shelf read as a marketplace, not a shop. Enforce one product-photography grammar per store — we treat it as an [art-direction system](/journal/web-design/image-art-direction-web) with its own spec: background, lighting temperature, prop rules — and the whole grid calms down.
- **Mobile is not "the same shelf, narrower".** Two-up grids on a phone make packshots thumbnail-sized and badges unreadable; one-up with a generous gutter converts better for considered purchases, two-up for replenishment browsing. This should be a merchandising decision per category, not a default for the site.
- **Hover-state second images** — the reversed jar, the poured glass, the label close-up — add depth without crowding the first impression, and they're measurably where product-curious customers signal intent. Treat which image sits in the hover slot as a merchandising lever with its own analytics event.

## Faceting that matches how people actually shop the category

Filters fail in two ways: they expose the database schema (nobody filters "roast_level_id = 3"), or they offer generic facets with no relationship to the purchase decision (filtering skincare by "colour").

The craft is choosing facets from *customer questions*, mined from search query logs, support tickets and in-store language:

- **The providore's facets come from Saturday-morning questions.** "What's good for a barbecue for twelve?" (facet: feeds how many). "Is it grass-fed?" (facet: provenance claims). "Delivered by Friday?" (facet: dispatch day). None of these are database columns; all of them are shelves.
- **Fewer, deeper facets beat many shallow ones.** Six to eight facet groups, expandable, with counts. A facet with zero-result combinations it happily lets you click into is a filter that lies.
- **Applied-filter states must be readable and reversible.** The applied filters render as removable chips above the grid, with count of results. If a customer can't reconstruct "what am I currently looking at?" from the chips, your filter UI has become a labyrinth. Good [search and filter UX](/journal/product/search-ux-product) treats the refined state as a readable sentence.
- **Empty states are merchandising moments.** "No dry-aged cuts match those filters — but the weekend special does" with a one-tap relaxation of the tightest filter beats a lonely "0 results".

## Promotion slots that don't cheapen the shop

Promos are where digital merchandising usually eats its own credibility. The whole shelf develops banner blindness, then promos get louder to compensate, then blindness deepens. The fix is architectural:

- **Promo slots are fixed positions with fixed inventory.** Slot one after row one, slot two after row four, done. When promo real estate is finite and designed, teams fight over *what deserves it* instead of wallpapering.
- **Promos compete on craft, not volume.** The slot that works is treated like a landing page in miniature — one message, one image, one action — not a carousel of five offers nobody asked for.
- **House promos exist too.** The slot that sells the click-and-collect service, the subscription offer or the gift-wrapping upgrade is merchandising for margin you already own, and often outperforms another "10% off" tile.

## Measuring the shelf

You can't improve what the shopkeeper can't see. The minimum viable merchandising analytics: position-level click-through on the top twenty slots (so the thesis can be argued with evidence), filter usage and dead-end rates, badge-attributed clicks, and scroll-depth per category. Review it weekly, at a standing meeting with someone who has authority to re-shelve — otherwise you're doing analytics theatre.

And give the merchant one superpower: a preview tool that shows tomorrow's shelf before it ships. Merchandising confidence compounds when the people choosing the shelf can *see* it.

## Key takeaways

- Collection pages are shelving decisions. Curate the first viewport as a thesis; let algorithms run the tail.
- Badges are a currency — one per card, honest scarcity, tokenised styles, self-retiring novelty.
- Photography rhythm (doubles, hover shots, consistent crops) creates tempo; mobile grids are a per-category decision.
- Facets should come from customer questions, not database columns — and refined states must read like sentences.
- Promo slots with fixed inventory create scarcity that makes promotions worth fighting for, and craft beats volume inside them.
- Measure at position level and give merchants a preview tool; merchandising is a weekly practice, not a launch artifact.

## FAQ

**Should we personalise the shelf order?** It's powerful downstream and dangerous at the top. Personalise the tail (reorder by inferred affinity), keep the curated thesis human, and be wary of personalising so aggressively the shop loses its identity — a store that looks different to everyone tells no one what it stands for.

**How often should the first viewport change?** Weekly at minimum for considered-goods stores; daily for fresh-food and fast fashion. The deeper point is that someone owns the shelf the way a chef owns a menu. If the honest answer to "who re-shelved this week?" is "nobody", the page is a database wearing a grid.

**Infinite scroll or pagination?** We default to a "load more" with a reflected state in the URL, mostly because back-button behaviour with infinite scroll routinely dumps customers at the top of a forty-product shelf — a small UX cruelty with a measurable cost. Infinite scroll can work for inspiration-heavy categories; test it against your return-visit paths, because the PDP-to-shelf round trip is where this gets decided. Our [PDP design piece](/journal/ecommerce/pdp-design-conversion) covers the other half of that journey.

**Does this apply to small catalogues?** Even more so. At twenty products, every position is eye-level, every card is the front table, and sequencing *is* the shop. Small catalogues get the most editorial treatment per square centimetre — the way the best small rooms in hospitality get the most considered service, and the tightest menus. Twenty products means every card is the front table.
