---
title: "Site migrations that don't tank organic traffic"
description: "The migration runbook we run before every relaunch: redirect mapping at scale, staging audits, launch-day checks, rollback triggers and the 30-day watch."
slug: site-migration-seo
cluster: growth
tags: [site migration, technical seo, redirects, website relaunch, seo checklist]
date: 2026-02-18
author: Priya Nair
keywords: [site migration seo, website relaunch seo, redirect mapping, seo migration checklist]
readingTime: 9
---

Every agency has the scar story. The redesign ships, the client's CEO loves it, and three weeks later organic traffic is down 40% because nobody mapped the URLs. Migrations are the highest-stakes, lowest-glamour work in web development — the new site gets the applause, but the redirect map does the preserving.

The uncomfortable truth: migrations rarely fail on the hard parts. They fail on the boring parts done late — redirects mapped in a spreadsheet the night before launch, staging blocked from crawlers badly, analytics tags dropped in the rebuild. So here's the runbook we actually follow, start to finish. It's unglamorous. That's the point.

## T-minus eight weeks: freeze the inventory

Before anything is redesigned, you need a complete picture of what exists. Three sources, all of them:

**A full crawl.** Screaming Frog or equivalent over the entire current site — every URL, status code, canonical, title, and inlink count. This is ground truth for what *should* exist.

**Server logs.** Crawls find linked URLs; logs find what search engines actually request, including orphaned URLs, old campaign pages with lingering rankings, and parameter junk Google has decided to love. For high-stakes migrations we analyse 6–12 months of logs. The intersection of "high crawl frequency" and "nobody remembers this page" is where migrations go to die.

**Search Console exports.** Which URLs actually earn impressions and clicks. A page with ten backlinks and consistent impressions outranks its inlink count — it must survive the move even if the sitemap forgot it.

Merge the three into the master URL inventory. Every URL gets one of three dispositions: **keep** (URL survives unchanged — the best outcome), **redirect** (mapped to a specific successor), or **retire** (deliberately allowed to 404, with a conscious decision recorded). "Retire" must be a decision, not an omission. When we rebuilt the [Postcards Museum archive](/work/postcards-museum-archive), the inventory turned up eleven years of event pages earning quiet long-tail traffic; a third of them became redirects to archive collections that didn't exist until we created them, precisely because the traffic data said they deserved successors.

## The redirect map: the actual product of a migration

The redirect map is a database, not a spreadsheet document someone drafts once. Rules we've learned by being wrong:

**Map one-to-one or not at all.** "Redirect everything from the old blog to /journal" is not mapping, it's hoping. Google treats mass redirects to a single URL as soft 404s — the authority doesn't transfer, and you've converted ranked pages into nothing while feeling productive. Each retired URL needs a specific, topically-matching successor. If none exists, either create one or consciously 410 the page and accept the loss in writing.

**301 permanent, and kill the chains.** Redirects must be 301s (or 308s) served at the edge, first hop. Audit the *current* site for chains first — old-to-older-to-oldest redirect chains are common and each hop bleeds a little equity and a lot of crawl patience. The new map should bypass chains entirely: every historical URL in the logs redirects directly to its final destination, in one hop.

**Preserve parameters where they carry meaning.** Sort, filter and pagination parameters on listing pages encode distinct URLs Google may have indexed. Decide per-parameter: canonicalise away, or map deliberately. The answer differs for faceted navigation versus tracking junk (UTMs get ignored, obviously).

**Test the map as code.** The map is data — thousands of rows — so validate it like data: check every source exists in the inventory, every destination returns 200 on staging, no destination is itself a redirect, no loops. We generate the edge config from typed data and run exactly the kind of CI checks described in our [type-safe content pipeline](/journal/engineering/type-safe-cms-content) piece. A redirect map reviewed by eye is a redirect map with forty bugs in it.

## Staging: the last safe place to fail

Staging should be production's mirror, including performance and headers, with two differences: it must be invisible to search engines, and it must be crawlable *by you*.

**Block indexing twice, verifiably.** `robots.txt` disallow *and* HTTP-basic or IP allowlisting — belt and braces, because a staging site that leaks into the index creates duplicate-content chaos at the worst possible moment. The subtle failure mode is the inverse: the block rule that survives migration and goes live with the new site. Put "robots.txt serves production rules" as an explicit launch-day checklist item, because it has burned everyone once.

**Run the full audit on staging.** Complete crawl, compared programmatically against the inventory: every "keep" URL returns 200 with correct canonicals; every "redirect" fires the mapped one-hop 301; every "retire" 404s or 410s cleanly. Check hreflang, structured data per template (our [schema playbook](/journal/growth/schema-markup-playbook) covers the per-template audit), canonical tags, pagination, XML sitemaps, and internal links pointing at *new* URLs — internal links that rely on redirects burn crawl budget and leak equity through every hop.

**Check caching before you need it.** A migration changes thousands of URLs at once, which is exactly when misconfigured cache headers hurt most. Our [caching layers guide](/journal/engineering/caching-strategy-content-sites) has the discipline; the migration-specific points are that HTML stays revalidatable (you will be fixing things on launch day) and that the redirect rules themselves are deployable quickly.

**Verify analytics and consent parity.** The rebuild is when tracking silently halves: the tag manager container wasn't migrated, the consent banner blocks differently, server-side events got "simplified." Diff the live and staging tracking plans event-by-event — this is where [analytics governance](/journal/growth/analytics-governance) pays for itself. Continuity of measurement is continuity of business; you cannot evaluate the migration's success if the ruler changed the same week.

## Launch day and the 30-day watch

Launch is deliberate, small-hours, and staffed. The sequence: deploy; immediately verify robots.txt and the indexability of the homepage; spot-check a stratified sample of redirects (most-linked, most-trafficked, one per template); submit the new sitemaps in Search Console; run the canonical fetch on the top twenty URLs by traffic; notify stakeholders with a status page, not a vibe.

Then the monitoring plan we run for thirty days, minimum:

- **Search Console, daily for week one.** Coverage/indexing report (new URLs discovered, old ones dropping), enhancement errors, manual actions — plus a crawl-stats eyeball for 404 spikes, which are the smoke of every missed redirect.
- **Log files, weekly.** Watch Googlebot's shift from old to new URLs. Old URLs should decay steadily; a plateau after two weeks means links or XML sitemaps still reference them somewhere.
- **Rank and traffic tracking against a pre-migration baseline.** Export positions and landing-page sessions *before* launch so you're comparing against data, not memory.
- **New-site crawl at T+7.** Crawl the live site fresh and diff against expectations — launch week always introduces something staging didn't see.

**Expect the dip.** Even flawless migrations wobble: a 5–15% traffic dip for two to six weeks while Google reprocesses the URL graph is normal, and preparing the client for it in writing *before launch* is the difference between a monitored wobble and a panicked rollback.

**Rollback triggers, agreed in advance.** Define them numerically before launch, while everyone is calm: e.g. traffic down >25% at day 14 with no recovery slope, or a manual action, or index coverage collapsing. Below the triggers, you iterate — fix redirects, improve internal linking, ship the [content improvements](/journal/growth/content-clusters-strategy) you deferred. Migrations recovered by patience and targeted fixes outnumber migrations recovered by rollbacks ten to one, because a rollback re-traumatises the URL graph you just spent six weeks retraining.

## The part nobody budgets: follow-through

The migration isn't done at launch; it's done at day sixty, when the last old URL has dropped from the index and the new architecture has been given the content it was designed for. Budget for it explicitly in the [growth engagement](/services/growth): fix-forward capacity in weeks 1–2, a redirect-review week at 4–6, and a retrospective that feeds the next runbook. The agencies that "lose traffic on every redesign" aren't cursed; they're ending the project at the ceremony instead of the recovery.

## Key takeaways

- Build a three-source URL inventory (crawl, logs, Search Console) eight weeks out; every URL gets a recorded disposition: keep, redirect, or retire.
- Redirect one-to-one, 301, single hop, bypassing existing chains — and validate the map as data in CI, not by eye.
- Staging is for failing safely: block indexing twice, run the full programmatic audit, and diff event-level analytics against production.
- Launch quietly and deliberately, then watch Search Console daily for a week and logs weekly for a month.
- Set numeric rollback triggers before launch; expect and pre-communicate a 5–15% wobble; fund the sixty days of follow-through.

## FAQ

**How long does organic traffic take to recover after a migration?**
For a clean, well-mapped migration: two to six weeks of wobble, then baseline, often better since most migrations ship genuine improvements. Domain changes take longer — add a month or two. Anything not recovering by week eight needs diagnosis, not patience.

**Should we change URLs, structure, and content all at once?**
If you can avoid it, no — every simultaneous change multiplies the variables when diagnosing a dip. If the business case demands it (rebrand plus rebuild), accept the risk with eyes open and make the redirect map immaculate, because it's the only constant left.

**Are 302 redirects ever right in a migration?**
Almost never for content you're moving permanently — 302s signal temporary moves and delay equity transfer. Use them only for genuinely temporary situations (A/B tests, maintenance windows).

**Do we need to update external links pointing to old URLs?**
The redirect handles them, but for your most valuable backlinks it's worth outreach to update the target — every one-hop redirect you remove from a strong link is a small permanent gain.

**What size site makes this runbook mandatory?**
Anything with meaningful organic revenue or lead flow. A fifty-page brochure site can migrate over a weekend; the moment organic search pays salaries, the runbook pays for itself the first time it catches one missed redirect.

*Migrations are where our [growth practice](/services/growth) earns its keep the quiet way — or see how the audit habit runs on fresh builds in the [technical SEO checklist](/journal/growth/technical-seo-checklist-2026).*
