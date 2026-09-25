---
title: "The technical SEO checklist we run on every build"
description: "Our pre-launch technical SEO sweep: crawlability, canonicals, structured data, sitemaps, pagination, JS rendering traps and Core Web Vitals — copy-paste ready."
slug: technical-seo-checklist-2026
cluster: growth
tags: [technical seo, crawlability, structured data, launch checklist, core web vitals]
date: 2026-03-11
author: Priya Nair
keywords: [technical seo checklist, seo audit, site launch seo, core web vitals seo]
readingTime: 9
heroImage: /images/articles/growth/technical-seo-checklist-2026.jpg
heroAlt: "Overhead still life of a brass loupe on a hand-drawn site map in fern-green ink, with brass check marks and scattered fern leaves on cream paper."
---

Every site we ship gets the same treatment in its final week: a technical SEO sweep that takes about a day and has never once found nothing. Not because our builds are sloppy — because launch week is the one moment everyone is changing everything at once, and SEO bugs are bugs of omission. A canonical that nobody wrote. A `noindex` that nobody removed. A sitemap nobody regenerated. The pages work fine in the browser, which is exactly why nobody notices.

This is the checklist, cleaned up and generalised. It's the same sweep behind the organic numbers in our [Meridian Climate data explorer](/work/meridian-climate-data-explorer) rebuild, and it slots into the broader [growth engagement](/services/growth) we run after launch. Steal it wholesale.

## The order of operations

Run the sweep twice. Once against staging (behind auth, with the production robots rules *commented into the file* rather than live — remember, staging should not be crawlable), and once in the first hour after DNS flips. The staging pass catches architecture. The production pass catches deployment mistakes, which are the ones that actually hurt.

Crawl the staging site with a real crawler — Screaming Frog, Sitebulg, or `wget --spider` in a pinch. A crawl finds what code review never will: the orphaned page, the redirect chain, the 4,000 URLs your faceted navigation just invented.

## 1. Crawlability and index control

- **robots.txt** resolves at the root, returns 200, disallows staging artefacts and internal search results, and *references the sitemap*. One line people forget: `Sitemap: https://example.com/sitemap.xml`.
- **No `noindex` survivors.** Search the built HTML for `noindex` and for `X-Robots-Tag` headers. Staging protection has a survival instinct. We once found a client's entire blog still shipping `noindex` six weeks after a replatform — traffic looked like a cliff face.
- **Status codes are honest.** Indexable pages return 200. Moved pages return 301 (not 302 — a 302 says "temporary", and search engines believe you). No redirect chains longer than two hops. No soft 404s: missing pages return an actual 404 or 410, with [a useful 404 page](/journal/web-design/designing-404-pages) for the humans.
- **Canonicals on every indexable page**, self-referencing, absolute, and consistent with your trailing-slash and `www` decisions. Pick one URL form and defend it everywhere — canonicals, sitemaps, internal links, OG URLs.

## 2. Rendering: will the crawler see the words?

Modern search engines render JavaScript, on a delay, with a budget, and sometimes not at all. If your marketing pages need client-side rendering to show a headline, you are paying a tax on every crawl.

The test is thirty seconds long: view source on your five most important templates and look for the actual headline, the actual paragraph text, and actual `<a href>` links. If the words aren't in the initial HTML, prerender or server-render those routes. This is not anti-JavaScript puritanism — app-like interiors behind a login can render however they like — it's about not making a crawler run your build pipeline to read a services page.

Two traps we find constantly:

1. **Links that aren't links.** Click handlers on `<div>`s, router pushes on buttons. If it navigates, it's an `<a href>`. Full stop.
2. **Content behind interaction.** Tabs, accordions and "load more" buttons that fetch on click may never be associated with the page. If the content matters for ranking, it should be in the initial response, styled to whatever interaction pattern you like.

## 3. Structured data that earns its keep

Mark up what a stranger should be able to verify: Organization on the home page, Article with real dates and authors on articles, BreadcrumbList everywhere relevant, Product with genuine price and availability on commerce, FAQPage only where the questions are visibly on the page. Validate with the Rich Results Test, and then — the part nobody does — *read it as an audit*. If the JSON-LD claims a price the page doesn't show, that's not an SEO tactic, it's a discrepancy, and it erodes trust with systems that are very good at noticing.

Don't mark up invisible content, don't mark up reviews of yourself, and don't expect schema to rescue weak pages. Structured data formats what exists; it doesn't create importance.

## 4. Sitemaps and architecture

- Sitemap contains only canonical, indexable, 200-status URLs. Every URL in the sitemap is a vote; voting for redirects and 404s confuses the count.
- Sitemaps split by section when you're past a few hundred URLs, so index coverage reports tell you *which* part of the site is being dropped.
- Crawl depth: every important page reachable within three clicks of the home page. If the crawler finds a page only through the sitemap, Google notices that nobody links to it either.
- Pagination uses real links with real `href`s, page 2+ self-canonicalised, each page with enough distinct content to justify existing. (On large catalogues, read our piece on [where programmatic pages earn indexation](/journal/growth/programmatic-seo-ethics) before letting facets generate URLs at all.)

## 5. Speed is an SEO feature

Core Web Vitals are a ranking tiebreaker and, more importantly, a conversion lever. The short version: LCP under 2.5s (usually an image discovery or font problem), INP under 200ms (usually a main-thread problem), CLS under 0.1 (always a reserve-the-space problem). The long version is our [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide). Run the audit on a mid-range Android over a throttled connection, because that is the device Googlebot's assessment approximates and the device a third of your audience owns.

## 6. The launch-day runbook

The day itself is mostly redirects and discipline:

1. The redirect map goes live *with* the site, not after. Every old URL mapped one-to-one where possible, to a parent where not, never blanket-redirected to home — a mass redirect to the home page reads as a soft 404 and throws the old site's equity in the bin.
2. Verify Search Console and Bing Webmaster Tools properties, submit the sitemap, request indexing on the ten pages that pay the rent.
3. Annotate the launch in your analytics. Six months from now someone will ask why the graph moved, and "I think that was the replatform?" is not an answer.
4. Crawl production. Compare the crawl to staging. Diff the indexable URL counts.

## The first thirty days

Watch coverage reports weekly: which URLs are discovered but not indexed, which are indexed then dropped. Watch the 404 log for missed redirects and fix them with 301s, not indifference. Watch query data for the old brand terms — they tell you whether the redirect map transferred relevance. Expect a wobble in week one; worry about a trend in week four. If the rebuild is sound, the wobble is the search engine re-crawling, not re-judging. Something like a well-executed [website rebuild](/services/websites) should surface in the data as a dip and recovery, not a new baseline.

## Key takeaways

- Technical SEO failures are bugs of omission found by crawling, not by browsing. Crawl staging, then crawl production, and diff them.
- Canonicals, robots rules and status codes are a single source of truth problem: pick one URL form and enforce it in every system that emits a URL.
- If the words and links aren't in the initial HTML, you're asking the crawler to finish your build.
- Redirects ship with the launch. A blanket redirect to home burns the old site's equity.
- Speed, structure and honesty compound. None of this is glamorous; all of it is visible in the revenue line six months later.

## FAQ

**How often should we run a technical audit outside of launches?**
Quarterly for a healthy site, monthly if you're publishing at volume or running a large catalogue. The quarterly pass is a two-hour crawl review: coverage drift, orphan pages, redirect rot, new template errors. Sites decay quietly; the audit is how you notice.

**Do we need an agency to do this?**
You need a crawler, a checklist and four hours of a developer who cares. The value an experienced team adds is pattern recognition — we've seen the `noindex`-survivor bug a dozen times, so we look for it first. This article is us trying to make ourselves unnecessary for the easy 80%.

**What's the single highest-impact item on the list?**
For rebuilds, the redirect map. For new sites, getting the content into the initial HTML. Both are unglamorous, both are decisive, and both are much cheaper to do right than to fix after the fact.

**Is Core Web Vitals really a ranking factor?**
Yes, but a modest one — it's a tiebreaker between pages of similar relevance, not a rocket. Treat it as a conversion and usability requirement that happens to also affect rankings, and you'll invest the right amount: serious, not superstitious.

**Should we block AI crawlers in robots.txt?**
Decide deliberately rather than by default. Blocking reduces your presence in AI-generated answers; allowing it increases your exposure to scraping you'd rather not fund. There's no universal right answer — but it should be a decision, made on purpose, documented in the file with a comment.
