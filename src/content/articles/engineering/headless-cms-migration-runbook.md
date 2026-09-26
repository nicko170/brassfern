---
title: "The headless CMS migration runbook"
description: "A field-tested runbook for migrating to a headless CMS: content inventory, model mapping, redirect strategy, preview parity, and the cutover weekend checklist."
slug: headless-cms-migration-runbook
cluster: engineering
tags:
  - cms
  - migration
  - content
  - architecture
date: 2025-08-08
author: Tomás Reyes
keywords:
  - headless cms migration
  - cms replatforming
  - content migration checklist
  - redirect strategy
  - cutover plan
readingTime: 9
---

Nobody migrates a CMS for fun. The trigger is usually a stack of grievances — an editor workflow that requires a priesthood, a plugin ecosystem held together by hope, a frontend framework that died three versions ago. By the time a client calls us, the migration is already decided emotionally. Our job is to make sure it survives contact with reality.

We have run this playbook on everything from a 400-page professional-services site to a 40,000-article publisher archive. It compresses into six phases. Skip any of them and the cutover weekend will find out.

## Phase 1: The content inventory, which is an audit in disguise

Before any model is designed, you need a machine-readable picture of what exists. Crawl the current site — Screaming Frog or a quick script — and export the CMS database if you can get it. Two sources, because the crawl finds what the public sees and the database finds what editors forgot: draft pages, unpublished landings, orphaned media.

For every content type, record: count, URL pattern, field shape, embed usage (forms, iframes, shortcodes), media dependencies, and owner. Then apply the only filter that matters: **kept, killed, or merged**. Migration is the cheapest content pruning you will ever get. On the publisher migration, 23% of the archive had zero organic sessions in a year; merging or retiring it shrank the model, the redirects and the timeline in one decision.

The failure mode we now check by name: **shortcode and embed soup**. Legacy page editors accumulate bespoke widgets — a pricing table plugin, a "related stories" block, a chart shortcode someone wrote in 2019. Each one is a mini-migration. Inventory them per template and assign each a fate: recreate as a structured block, replace with a standard component, or flatten to static markup.

## Phase 2: Model mapping — design for editors, not for parity

The instinct is to reproduce the old model in the new CMS. Resist approximately half of it. Old models carry sediment: fields added for one campaign in 2021, types that were really the same type, a `misc_content` text area that means trouble.

Map every old type to one of four outcomes:

- **Straight port** — the type is healthy, keep name and shape.
- **Normalised port** — merge near-duplicate types (we once merged four "landing page" variants into one with a layout field).
- **Split** — a kitchen-sink page type becomes pages plus reusable blocks. Old body HTML becomes structured content here; this is where [portable rich text pays for itself](/journal/engineering/type-safe-cms-content), because the day the frontend changes, semantic blocks migrate and tag soup does not.
- **Retire** — with a redirect, always.

Then write **migration scripts as code, checked into the repo**, from database export to new-CMS import API. Scripts, not a spreadsheet-and-copy-paste plan. You will run the migration at least three times (dev, staging rehearsal, production) and you want each run byte-identical. Every script logs a mapping table: old ID → new ID → new slug → new URL. That table is gold; it feeds redirects, QA and the inevitable "where did this page go?" for months.

## Phase 3: Redirects — where migrations actually live or die

Organic traffic lives in URLs. Break them and you have performed an amputation, not a migration. We wrote a separate piece on [migrations that don't tank organic traffic](/journal/growth/site-migration-seo); the engineering side reduces to:

1. **A complete redirect map generated from the ID mapping table**, not assembled by hand. Old URL → new URL, 301, one hop. If the URL structure is unchanged, prove it with an automated comparison rather than assume it.
2. **No redirect chains.** Flatten anything the old site already redirected. We regularly inherit sites with three-hop chains from two previous migrations; this is your one chance to clean house.
3. **A catch-all with a conscience.** Every unmatched old URL should 301 to the nearest sensible parent, never silently to the homepage. Homepage redirects for deleted content are how you turn 404s into soft-404s and confuse search engines for quarters.
4. **QA at scale.** After cutover, crawl the *old* URL list against the new site and assert: status 301, single hop, destination 200. This is a script, not a sampling exercise. Ten thousand checks take minutes; ten hand-checked samples prove nothing.

## Phase 4: Preview parity — the editors' dealbreaker

Here is the uncomfortable truth of headless: the moment you decouple the CMS from the frontend, **you have taken away the editor's preview button**, and you owe them a better one. Migrations that nail content and redirects still fail politically when editors discover draft preview is broken.

Preview parity means: a draft in the new CMS renders on the real frontend, on the real URL pattern, within a few seconds, with a shareable link. The standard implementation is a draft-mode route that bypasses the static cache and renders against preview APIs — which interacts with your entire [caching and invalidation strategy](/journal/engineering/caching-strategy-content-sites), so design it before the first content import, not after the first editor complaint.

Also budget for the workflow deltas. Every CMS has a different answer to scheduling, versioning, roles, and "who can publish to the homepage." Run two editors through their real weekly workflow on staging and write down every stumble. Those stumbles are your training documentation, and occasionally your model corrections.

## Phase 5: The media migration nobody estimated

Media libraries are where "two days of scripting" goes to become three weeks. The issues, in order of frequency: duplicated assets under different filenames; originals at print resolution served to browsers; images hot-linked into body HTML; alt text stored in the wrong field or nowhere.

The fix is a pipeline, not a copy: dedupe by content hash, normalise formats and sizes at the edge or in the build (see [our image pipeline piece](/journal/engineering/image-pipeline-modern-web)), rewrite every reference in migrated content to the new canonical URL, and carry alt text through explicitly in the mapping table. The body-HTML rewriter deserves care — parse it as HTML, never regex it, and log every reference that fails to resolve so nothing silently breaks.

## Phase 6: Cutover weekend, run like a release

The cutover is not the risky part; the unrehearsed cutover is. Ours runs to a one-page checklist, rehearsed end-to-end on staging the week before:

**T-7 days:** freeze content model; final full migration script run on staging; editor UAT sign-off; redirect QA script green against staging.

**T-2 days:** content freeze announced to editors in the old CMS. Hard freeze. The one time an "urgent" page goes live mid-freeze is the time you learn why freezes exist.

**T-0 (day of):** final delta migration (catch anything created since the rehearsal); flip DNS or hosting to the new frontend; run the redirect QA script against production; submit the XML sitemap; watch server logs and Search Console coverage in one window, error tracking in the other.

**T+1:** old CMS stays up, read-only, for 60 days minimum. It is the rollback, the audit trail and the answer to "the old site had this field filled in."

Rollback is one step — point traffic back — which is exactly why it must be a decision, not a scramble. The full launch-day discipline, including the comms tree and the war-room roster, is in our [launch week checklist](/journal/playbooks/launch-week-checklist), and it's part of every [websites engagement](/services/websites) we scope.

## Key takeaways

- Start with a two-source content inventory (crawl plus database) and a kept/killed/merged decision per type — migration is the cheapest pruning you'll ever get.
- Every legacy embed and shortcode is a mini-migration; inventory and assign fates before modelling anything.
- Write migrations as checked-in, re-runnable scripts that emit an old-ID → new-URL mapping table; that table powers redirects, QA and institutional memory.
- Redirects are generated from data, flattened to single hops, and QA'd by crawling the complete old URL list — never sampled by hand.
- Preview parity is the editors' dealbreaker; build draft preview into the architecture and rehearsal, not the retrospective.
- Keep the old CMS read-only for 60+ days as both rollback and audit trail.

## FAQ

**How long does a headless CMS migration take?**
For a marketing site under a thousand pages with a clean model: six to ten weeks including editorial UAT. For publishers or multi-site platforms: a quarter, sometimes two. The timeline driver is never the CMS swap — it is content model rework, embed migration and editorial workflow change. Anyone quoting you by page count alone has not done one.

**Should we change our URL structure during the migration?**
Only with a compelling reason, because every changed URL spends redirect equity. Consolidating four path conventions into one is usually worth it; cosmetic rebranding of paths usually is not. If you do it, do everything in one migration — two URL changes in two years is how you build redirect chains.

**Do we need to migrate everything? Can we leave the archive behind?**
You can, and sometimes should — a frozen archive on a subdomain with a banner can be the honest answer for content nobody maintains. The rules: internal links to archived content still resolve, archived URLs stay stable forever, and the decision is documented in the model so the next migration doesn't rediscover the archive by accident.

**How do we keep editors working during the migration?**
Run both systems in parallel only during UAT, with the old CMS as the publishing source of truth until cutover day. Dual-publishing (editors entering content twice) sounds safe and produces drift within a week. A hard content freeze for the final 48 hours is kinder and cheaper than reconciliation.
