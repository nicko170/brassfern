---
title: "The technical SEO checklist we run before every launch"
description: "Our pre-launch SEO checklist became code: crawl assertions in CI, header diffs, structured-data audits — plus the judgement checks that never automate."
slug: technical-seo-launch-checklist
cluster: growth
tags: [technical seo, launch checklist, ci, crawlability, structured data]
date: 2025-09-18
author: Hannah Yeo
keywords: [technical seo checklist, seo audit, structured data seo, crawl budget]
readingTime: 9
---

For years our pre-launch SEO review was a document. A very good document — the current iteration lives on as our [walkthrough of the manual sweep](/journal/growth/technical-seo-checklist-2026) — but a document nonetheless. It depended on someone remembering to open it in the busiest week of a project, reading it fresh each time, and executing forty-odd checks by hand while three other deadlines screamed.

Documents decay. Checklists that live in wikis get skimmed, then skipped, then quietly become something we tell clients we do. So two years ago we did the obvious thing: we turned the checklist into code. The manual sweep still exists — judgement doesn't compile — but roughly 80% of pre-launch SEO verification now runs in CI on every pull request, which means it runs a hundred times before launch week, not once during it.

This is how the system works, and what stayed stubbornly human.

## Why documents fail and pipelines don't

A checklist has two failure modes. The first is omission under pressure: launch week is the one moment everyone is changing everything at once, and "check the canonicals" loses to "the client demo is in an hour." The second is drift: the checklist was written for the site as designed, and the site as built has a faceted search, a new blog cluster and a CMS-driven footer nobody told the wiki about.

Code has neither problem. A test doesn't get nervous before a demo. A crawl assertion doesn't skim. And because the suite runs on every pull request, it catches SEO regressions at the moment they're introduced — the PR that adds a `noindex` to a shared layout component fails loudly, on Tuesday, eleven weeks before launch — instead of being discovered during a heroic manual pass when fixing it means cherry-picking into a release branch.

The deeper shift is cultural. When the checklist is a document, SEO is a phase. When it's a test suite, SEO is a property of the build, like type safety. Nobody debates whether to run `tsc` before shipping. Nobody should debate whether the canonical tags resolved.

## The automated suite, layer by layer

Our suite runs in four layers, cheapest first, so failures surface fast.

**Layer 1: static linting of the built HTML.** After the production build, we crawl `dist/` with a link checker and a set of DOM assertions. Every page must have exactly one `<h1>`, a title between 30 and 60 characters, a meta description within bounds, a self-referencing absolute canonical, and no `noindex` unless the route is on an explicit allowlist (thank-you pages, internal search). Content pages must contain their headline and lead paragraph as real text — which catches "the page renders a skeleton until JavaScript arrives" regressions. Links must be `<a href>` elements that resolve to real routes; router-push buttons pretending to be navigation fail here.

**Layer 2: file assertions.** `robots.txt` exists, returns the production ruleset (asserting on content, not just presence — a staging robots file that leaks into production is a classic), and references the sitemap. `sitemap.xml` parses, contains only canonical URLs, and every URL in it passes through the layer-1 crawl as a 200. A sitemap entry that redirects is a test failure, not a shrug.

**Layer 3: header and status verification against a real server.** Some things only exist at runtime. We boot the built site behind the same CDN config it will ship with and assert: indexable routes return 200; retired routes return 301 with a single hop; missing routes return a true 404 with a useful body; `X-Robots-Tag` headers only appear where intended; cache headers match the [invalidation strategy](/journal/engineering/caching-strategy-content-sites) the project agreed on. This layer exists because we once shipped a launch where every page returned 200 — including deleted ones. Soft 404s at scale, visible in Search Console three weeks later, traffic gently deflating like a slow puncture.

**Layer 4: structured data as a contract.** We render each template and diff its JSON-LD against what the visible page actually claims. If the schema says the price is $89 and the page shows $96, the build fails. If an Article's `datePublished` isn't on the page, the build fails. Structured data formats what exists; the moment it asserts what doesn't, you've built a discrepancy engine — and search engines are very good discrepancy detectors. Our broader stance on what earns markup is in the [schema markup playbook](/journal/growth/schema-markup-playbook).

## The two-pass rhythm that survived automation

Automation didn't change the order of operations. We still run the sweep twice: once against staging behind auth, once in the first hour after DNS flips.

What changed is what each pass is *for*. The staging pass is now almost entirely automated — it's just the CI suite run against the staging build, and by launch week it's been green for weeks, so it acts as a smoke test rather than an audit. The production pass is where humans earn their keep, because production differs from staging in exactly the ways automation is worst at predicting: real DNS, real CDN, real third-party scripts the client added on launch morning, real redirects pointed at real old URLs.

The production runbook is short and ordered: verify robots.txt and sitemap from an external network (not the office VPN — more than once we've "verified" a robots file that only existed inside the client's infrastructure); submit the sitemap; spot-check redirects from the [migration map](/journal/growth/site-migration-seo) with `curl -I`, never a browser (browsers cache redirects and lie about chains); trigger a render of the five most important templates and read the HTML a crawler receives; then set a calendar entry for 48 hours later to check index coverage has begun moving. The last step is the one everyone forgets and the one that catches the catastrophes early.

## The checks that never automate

Some of the checklist refuses to compile, and we've stopped trying to force it.

**Canonical intent.** A canonical tag can be syntactically perfect and strategically wrong. When a product page exists in three categories, which URL is canonical? That's an information-architecture decision with commercial weight, not a lint rule. We automate the detection of *inconsistency*; a human decides the *intent*.

**Rendering trade-offs.** Layer 1 can tell you the words aren't in the initial HTML. It cannot tell you whether that's acceptable. A configurator behind a login can render however it likes; a services page cannot. Someone who understands both the stack and the business has to draw that line per route — the same judgement call behind our [islands architecture](/journal/engineering/islands-architecture-when) decisions.

**Crawl-budget economics.** On sites past a few thousand URLs, whether a URL family *deserves* to exist is a strategy question. Facets, filters, paginated archives, UTM-polluted internal links — automation counts them and flags the explosion, but deciding which to canonicalise, which to noindex and which to promote is a conversation about what the business wants to be found for. The fullest version of that conversation is in our piece on [where programmatic pages earn indexation](/journal/growth/programmatic-seo-ethics).

**The sniff test.** Once per launch, one senior person browses the site like a sceptical stranger: does every click land somewhere sensible, does anything feel like it was built for a robot rather than a reader. It sounds unscientific. It has caught a mis-targeted hreflang cluster, a breadcrumb that linked to a staging domain and a sitemap that listed a legal page under `/fun/`. Machines check assertions. Humans notice weirdness.

## The first ninety days

Launch is week one of a quarter, not the end of a project. The automated suite keeps running — it now guards every content publish, because CMS editors can ship a broken canonical just as fast as engineers can — and we add three monitoring loops on top.

Index coverage, weekly: which sections are being indexed, which are being crawled-and-dropped, and whether the drop pattern matches intent. Log-file sampling, monthly on larger sites: where the crawl budget actually goes, which is always more embarrassing than anyone predicts (facet pages, API endpoints leaking into HTML, a calendar that generates URLs to the year 3000). And a Core Web Vitals field-data check tied to the alerting stack, because [real-user vitals](/journal/engineering/core-web-vitals-field-guide) degrade with content growth in ways lab tests never see — the day a marketing team uploads an 8MB hero is the day your LCP eats a ranking tiebreaker.

The point of all of it is the same: the checklist stopped being a ritual we perform and became a property we maintain. The document version asked humans to be perfect in the worst week of the project. The pipeline version asks humans to make a handful of genuinely human decisions, and lets machines be tiresomely, reliably perfect at everything else.

## Key takeaways

- Manual SEO checklists fail by omission under pressure and by drift; a document's authority decays the moment it's written.
- Move roughly 80% of verification into CI, in four layers: static HTML linting, file assertions, runtime header/status checks, and structured-data contract tests.
- Keep the two-pass rhythm — staging for architecture, production for deployment mistakes — but let each pass play to its strengths.
- Automation detects inconsistency; humans must still decide canonical intent, rendering trade-offs and crawl-budget economics.
- Launch is week one: index coverage, log files and field vitals form the monitoring loop for the following quarter.
- Test *content* of critical files (robots.txt, sitemaps), not just their presence — the disasters are almost always correct-looking files with wrong contents.

## FAQ

**Do we need this level of automation for a small marketing site?**

The four layers cost about two engineering days to set up from scratch and near zero to maintain. Even a ten-page site benefits from layer 1 and 2 — a wrong canonical on a ten-page site is 10% of your web presence, not a rounding error. Layers 3 and 4 pay for themselves once you have a CDN, a CMS or any third-party scripts.

**Won't an SEO tool's scheduled crawl cover this?**

Scheduled crawls check the *deployed* site on a *calendar*. CI checks the *proposed* site at the *moment of change*. The difference is the difference between discovering a broken canonical in a weekly report and preventing it from ever existing. Both are useful; only one is prevention.

**How do you keep the assertions from going stale as the site grows?**

The assertions are generated from the route manifest and content index, not hand-curated — a new template automatically acquires the h1/title/canonical/description rules. What we hand-maintain is the allowlist of intentional exceptions, and every entry on it requires a comment explaining why. The list is reviewed quarterly; unexplained exceptions get deleted and the build gets to argue.

**What's the single highest-value check if we do only one?**

Assert that the built production HTML has no `noindex` outside your allowlist. Of all the launch-week disasters we've been called in to mop up after, silent sitewide noindex is the most common, the most damaging, and the easiest to have prevented with twelve lines of code.
