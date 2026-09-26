---
title: "Information architecture for marketing sites: the growth lever in plain sight"
description: "IA decides what buyers find, what search engines index and what survives a redesign. The nav-to-journey map, the three-level ceiling and URLs that outlive themes."
slug: marketing-site-ia
cluster: growth
tags: [information architecture, navigation, seo, content strategy, website structure]
date: 2026-01-28
author: Leonie Marsh
keywords: [website information architecture, marketing site navigation, IA for SEO, URL structure, card sorting]
readingTime: 10
---

Ask a growth team where their leverage lives and they'll name channels, budgets, creative. Almost nobody names the sitemap. Yet information architecture quietly governs three of the most expensive things a marketing site does: whether a buyer at each stage finds the page that moves them, whether search engines understand which pages matter, and whether the next redesign is a migration disaster or a costume change. IA is compounding infrastructure disguised as a navigation menu.

Most marketing-site IA is built in a kickoff meeting, from the org chart outward: Products, Solutions, About, Resources, Blog. The result is navigation that describes *the company* rather than serving *the buyer*, URLs that encode last year's campaign names, and a blog hanging off the root like a shed. We've rebuilt IA for [SaaS marketing sites](/work/larklight-saas-marketing-site), [law firms](/work/easement-legal-service-finder) and [university admissions](/work/fernway-college-admissions-platform), and the same six decisions do most of the work. (This piece is deliberately IA-only: for the visual craft of nav on small screens see [navigation that survives the 375px test](/journal/web-design/navigation-that-survives-mobile), and for link equity plumbing see [internal linking architecture](/journal/growth/internal-linking-architecture).)

## Decision one: map the nav to buying stages, not departments

The buyers of a marketing site arrive in roughly four states: *problem-aware* ("this thing is costing us"), *solution-aware* ("what are the options"), *vendor-comparing* ("why you, at that price") and *ready* ("talk to sales / buy now"). Every primary nav item should own a state, or admit it's utility (About, Contact are honest citizens).

The test we run on any proposed primary nav: for each item, name the visitor state it serves and the next page the visitor should reach. "Products" often fails — it serves the org chart, and the problem-aware visitor doesn't know your product names yet. "Why [category]" or a use-case entry often serves them better. Larklight, the SaaS relaunch that doubled demo bookings, hinged on exactly this: the old nav said *Platform, Features, Resources*; the new one said what the platform *was for*, and ready-state visitors got a persistent, unmissable demo path from everywhere.

Keep primary nav to five-to-seven items. This isn't a taste preference; it's a triage mechanism that forces the org-chart fight to happen in the strategy meeting rather than on the homepage.

## Decision two: the three-level ceiling

Marketing sites almost never need more than three levels of hierarchy: section → page → (occasionally) detail page. Beyond three, every level multiplies the cost of everything: breadcrumb logic, URL length, migration surface, the odds a page is orphaned, the clicks a crawler spends.

When a team proposes level four, it's almost always one of two smells: either a *category that's really a filter* (use-case × industry × role matrices belong in one smart index page with filters, the same pattern our [work index](/work) uses), or a *content hoarding problem* (the page exists because nobody could say no). Both are solved better outside the tree. The ceiling rule gives you a polite, structural way to say no: "that's a level-four page, and we don't have level four."

## Decision three: URLs are contracts

Path structure is the part of IA that outlives every redesign — because external links, rankings and bookmarks point at it. Treat URL decisions as long-term contracts:

- **Meaning over mechanics:** `/journal/web-design/fluid-type-scales-in-practice` survives a CMS swap; `/p?id=4832` doesn't.(Our own URLs follow this: this article's address tells you its cluster and topic without loading anything.)
- **Short, lowercase, hyphenated, plural nouns for sections.** No dates in paths (dates go stale, and content refreshes should never 404), no campaign years, no language codes you'll regret when localisation never happens.
- **One canonical address per page**, enforced with redirects when slugs change — and slug changes should be rare, because every one spends accumulated equity. The redirect discipline in [site migrations that don't tank organic traffic](/journal/growth/site-migration-seo) is worth reading before any IA surgery; the single biggest unforced error is treating a redesign as licence to rename every path.
- **Never nest by authorship or tooling** (`/wp-content`, `/node/`) — paths describe the content, not the plumbing.

Write the URL policy in the project wiki before design starts. It's a page long and it's still true five redesigns later.

## Decision four: the footer is the second nav, and it's load-bearing

Primary nav is a promise; the footer is the map. Everything important that doesn't merit primary real estate — services subpages, industry pages, legal, careers, the journal's clusters — lives there, crawlable from every page of the site. This is why we treat the footer as a designed system ([the footer is a sitemap with manners](/journal/web-design/footer-design-matters)) rather than a dumping ground: from an IA standpoint it's the densest internal-linking asset the site owns. When we audit sites with weak indexation on their money pages, the footer is frequently how we fix it — a block of honest, permanent links beats a hundred contextual links that come and go with blog posts.

Practical rule: any page more than two clicks from the homepage that earns revenue should be reachable from the footer. Run the crawl and check.

## Decision five: card sorting that actually works — and when to skip it

Card sorting is the most misused method in IA. The failure mode: handing users your page titles and asking them to sort, thereby discovering that users group things by the words you chose. Better protocol:

- **Sort tasks, not pages.** "Where would you go to find out if this works for a 200-person company?" beats "group these cards". Task-based sorting (or tree testing: show the nav labels only, ask users to find things) tests *findability*, which is what nav is for.
- **Test the labels, not just the tree.** Half of all IA failures are vocabulary failures. If your tree test shows people looking for pricing information under "Plans" when you call it "Licensing", you have a labels problem, not a structure problem.
- **Small n, iterated.** Eight to fifteen participants per round, three rounds with fixes between, beats one fifty-person study. You're looking for breakage, and breakage shows up fast.
- **Skip it when the answer is obligation.** If the site has fifteen pages and four audiences, the IA job is strategy (what exists at all), not taxonomy. Spend the research budget on message testing instead.

## Decision six: measure the nav like a funnel, quarterly

IA isn't finished at launch; it's instrumented. The quarterly review we run is one hour, four reports:

1. **Path analysis from the homepage** — where does each nav item actually lead people? An item whose click-through is under ~2% of homepage sessions is either mislabelled or unnecessary; interrogate it.
2. **Search-as-feedback** — internal site-search queries for things nav should have answered. Every recurring "pricing" search when Pricing is in the primary nav is a label failure with data attached.
3. **Entry-point reality** — what share of sessions *enter* on deep pages from organic? High organic entry changes the IA job: those pages must carry local context (breadcrumbs, related links, a visible "you are here") because visitors never saw your carefully ordered homepage story.
4. **Debt register** — orphaned pages, redirect chains longer than one hop, pages unreachable in three clicks. Fix in that order.

IA is where "show, don't tell" gets structural: the architecture itself is an argument about what matters. Done well, it's invisible; done lazily, it taxes every visitor and every campaign, forever.

## Key takeaways

- Map primary nav to buying states, not departments; five-to-seven items, each owning a state and a next step.
- Three levels, ceiling. Level-four requests are filters or hoarding in disguise.
- URLs are contracts: meaningful, dated-never, canonical-once, redirected-always.
- The footer is the second nav and the site's densest internal-linking asset; revenue pages belong in it.
- Task-based tree testing iterates better than card sorts of your own page titles; skip taxonomy research when strategy is the real job.
- Measure nav quarterly: path analysis, search-as-feedback, organic entry share, debt register.

## FAQ

**Mega-menus: yes or no?** Yes, when level two is genuinely broad (many services, many industries) and the mega-menu is designed as a page preview with hierarchy and descriptions — not a wall of links. No, when it's hiding an undecided IA. A mega-menu full of 27 links is the org chart leaking.

**Should the blog/journal live on a subdomain?** Essentially never for marketing purposes. Subdomains fragment authority and make internal linking awkward; the equity argument is well settled and we've never seen the "brand separation" benefit outweigh it. Our journal lives at [/journal](/journal) for exactly this reason.

**How do we IA a site for multiple audiences (say, buyers and candidates)?** Don't fork the tree. Primary nav serves the buyer journey; secondary audiences get a persistent utility band (Careers, About, Contact) and destination pages written for them. Sites that split into parallel audience trees end up maintaining two websites and doing justice to neither.

**Where does IA sit in a Brassfern website project?** Week two of a [website engagement](/services/websites), right after positioning: IA workshop, URL policy, tree test if warranted, then the sitemap becomes the contract that design and content work against. Changes after that point are possible but priced honestly — which is the kindest thing we can do for the sitemap.
