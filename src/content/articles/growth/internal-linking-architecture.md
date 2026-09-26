---
title: "Internal linking is architecture, not an afterthought"
description: "Internal linking is information architecture, not a plug-in. Hub-and-spoke models, anchor-text discipline, related-content automation, and measuring crawl paths."
slug: internal-linking-architecture
cluster: growth
tags: [internal linking, information architecture, seo, content strategy, site structure]
date: 2026-09-08
author: Priya Nair
keywords: [internal linking, information architecture, SEO structure, content hubs]
readingTime: 9
---

Ask a team who owns internal linking and you'll get a silence shaped like a department. SEO thinks it's content's job. Content thinks it's engineering's job. Engineering shipped a "related posts" plug-in in 2022 and considers the matter closed. Meanwhile the site's authority flows like water through a building with no plumbing plan — pooling on whatever pages oldest posts happened to mention, never reaching the pages that actually pay salaries.

Internal linking is not a tactic you sprinkle on after publishing. It is the load-bearing structure of a content site: it decides what crawlers find, what readers do next, and which pages accumulate enough weight to rank. Treat it as architecture — designed up front, maintained deliberately, measured like infrastructure — and it compounds. Treat it as an afterthought and you get the archipelago problem we describe in our [content clusters piece](/journal/growth/content-clusters-strategy): hundreds of islands, no bridges.

## What links actually do (all three jobs)

Every internal link performs three functions at once, and good linking respects all three:

**Crawl direction.** Crawlers discover and revisit pages by following links. A page no internal link points to is an orphan — effectively unpublished, however good it is. A page buried five clicks deep gets crawled rarely and treated as unimportant. Depth is a decision.

**Context.** Anchor text and surrounding copy tell both readers and engines what the destination is about. A link reading "our work with subscription retention" informs; a link reading "click here" wastes the one sentence of metadata you control completely.

**Authority distribution.** Internal links redistribute the equity your external links bring in. Most of it lands on the homepage and a handful of hits; your internal structure decides whether it reaches the commercial pages or evaporates into a 2019 press release. This is the least understood and most valuable of the three jobs — and the one no plug-in does well, because which pages deserve equity is a business decision, not an algorithmic one.

## Hub-and-spoke: the pattern that scales

Random cross-linking — "we add three links per post" — produces spaghetti. The structure that holds up as a site grows is hub-and-spoke, which we've written about at the strategy level [in our cluster strategy article](/journal/growth/content-clusters-strategy); here is the linking mechanics:

**Up:** every spoke links to its hub within the first third of the piece, with anchor text that names the topic, not the page ("our guide to lifecycle email", not "this article"). The hub is where equity gathers.

**Across:** every spoke links to its two or three most relevant siblings, chosen by reader intent — what would someone who cared about this want next? — never by publish date. Recency-based "related" widgets are how a post about pricing ends up recommending a post about office plants.

**Down:** the hub links to every spoke and is updated every time a new spoke publishes. Hubs are maintained documents. A hub that stops being updated is a hub that quietly stops ranking, and nobody notices for a year because hubs decay in slow motion.

**Sideways — commerce bridge:** each cluster gets exactly one well-placed link to a commercial page — a service, a demo, a resource. One, placed where it genuinely helps the reader. Five bridges per page is not architecture; it's anxiety, and readers can smell it.

## Anchor text: the discipline nobody teaches

Anchor text is the cheapest, most abused, most neglected lever in internal linking. The rules we enforce in editorial review:

- **Descriptive, not clever.** The anchor should tell a scanning reader what they'll get. "Read more" and "this piece" fail that test.
- **Name the topic, vary the phrasing.** Repeated identical anchors across a site read as coordinated manipulation — because they are. Write anchors like a human recommending things: sometimes the full phrase, sometimes a natural compressed version. Engines are good at semantic matching; you don't need to chant your keyword.
- **Links belong in sentences that earn them.** A link in a throwaway aside gets ignored by everyone; a link at the point of maximum curiosity gets clicked. Place links where the reader's question is hottest.
- **First-link priority in menus and templates is worth knowing about.** Where the same destination is linked twice on a page, engines historically weight the first anchor most heavily. Don't stack rival anchors and hope.

And the overcorrection to avoid: anchor text is not a keyword-injection system. If every internal link to your service page uses the exact commercial keyword, you've built a pattern, and patterns are what classifiers eat.

## Templates are link architecture too

The highest-leverage links on most sites aren't in prose — they're in templates, because templates scale:

**Navigation** should link to the pages the business needs to rank, not the org chart. "Insights" is not an SEO strategy; "Journal" organised by cluster is closer. Follow the same standard we apply in [navigation that survives the 375px test](/journal/web-design/navigation-that-survives-mobile): every item must defend its slot.

**Breadcrumbs** are unglamorous gold: they link upward consistently, they generate `BreadcrumbList` structure engines understand, and they reinforce the hub hierarchy on every single page without an editor lifting a finger.

**Related-content blocks** are fine — under rules. Intent-based selection (same cluster, adjacent funnel stage), capped at three to five items, refreshed when the cluster changes, and checked quarterly for circular recommendation loops. "Automated" must mean "rule-bound", not "unsupervised".

**The footer** is where architecture honesty shows. Ours is opinionated: the footer is a [sitemap with manners](/journal/web-design/footer-design-matters), and its links are chosen, not dumped. If your footer links to 240 pages, it links to none.

**HTML sitemaps** still earn their keep on large sites — a single crawlable page routing to every section flattens depth in a way no amount of prose linking achieves.

## Measuring: treat it like infrastructure

You don't "do" internal linking once; you monitor it the way [analytics governance](/journal/growth/analytics-governance) monitors tracking — with standing checks:

**Orphan and depth audits.** Crawl the site quarterly (Screaming Frog or a Logs-based equivalent) and diff against your sitemap. Any page with zero internal inlinks or a crawl depth above three is a defect, filed like a bug. On client audits, orphaned pages reliably make up 5–15% of "the content that isn't working".

**Link equity flow.** Use your SEO tool's internal-link metrics to check the distribution: your ten most important money pages should sit in the top decile of internal PageRank. If the top decile is your privacy policy and a pagination sequence, the plumbing has a leak.

**Behavioural confirmation.** Scroll-and-click data on related blocks and in-prose links tells you whether humans use the architecture. Engines and people usually agree; when the click map contradicts your linking theory, the click map is right.

**Crawl stats after restructuring.** After any significant re-linking — a cluster launch, a merger, a [pruning pass](/journal/growth/content-pruning-seo-lever) — watch crawl behaviour for a few weeks. Rising fetch share on target pages is the mechanism confirming itself before rankings move.

## Rolling it out without boiling the ocean

If your site has years of link debt, don't schedule a three-month re-linking project nobody will finish. Sequence it:

1. **Week one:** fix the templates — breadcrumbs, related-block rules, footer, nav. This repairs the plumbing for every page at once.
2. **Weeks two to four:** take your top cluster (the one nearest revenue) and enforce up/across/down linking properly, hub included. Measure it as the proof.
3. **Quarterly, forever:** orphan audit, depth audit, hub refresh, and a standing rule that no piece publishes without its links-out list in the brief — the same discipline we apply to [our own growth engagements](/services/growth).

Internal linking never goes viral and never makes the launch deck. It just decides, quietly and permanently, whether anything else you publish gets found. Architecture is not the decoration. It's the building.

## Key takeaways

- Internal links do three jobs at once — crawl direction, context, authority distribution — and only one of them can be automated safely.
- Structure content as hubs and spokes: spokes link up early and across by intent; hubs link down and get maintained forever.
- Anchor text should be descriptive and varied — written like recommendations, not keyword chants.
- Templates (nav, breadcrumbs, related blocks, footer) are link architecture with the widest blast radius; fix them first.
- Audit orphans and crawl depth quarterly; check that your money pages sit in the top decile of internal PageRank.
- Put the links-out list in the content brief, not in a post-publish cleanup.

## FAQ

### How many internal links should a page have?

Enough to be useful, few enough to be honest. In practice: six to twelve editorially chosen links for a standard article, up to two or three dozen for a true hub page. There's no penalty threshold; there is a reader-experience cliff where every paragraph glows and nothing gets clicked.

### Do internal links really affect rankings that much?

On established sites with link debt, restructuring internal links is frequently the single largest ranking lever available — we've seen target pages move from page three to page one on internal-link work alone. On small young sites, external authority matters more. Architecture amplifies what you have; it doesn't conjure what you don't.

### Should every blog post link to a service page?

No — one well-placed commercial bridge per cluster, not per post. Forcing a service link into every article teaches readers to ignore the links and teaches engines that the links aren't editorial. Restraint is the optimisation.

### Can we automate internal linking with a script or AI?

For suggestions, yes; for final placement, no. Automated suggestion (embedding-based "candidate siblings") is a fine assistant for editors. Unsupervised injection produces recency-biased, context-blind link spam wearing a productivity costume.

### How does internal linking interact with faceted navigation and filters?

Filters create the orphan/depth problem in bulk — thousands of near-duplicate crawlable states. The answer is architectural: decide which facets get canonical indexable URLs, noindex or block the rest, and link to the chosen facet pages deliberately from hubs. Filters are internal linking's most expensive bug farm.
