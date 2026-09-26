---
title: "Related-content modules that readers actually use"
description: "Most 'related articles' modules are decoration. Here's how we design, rank and measure recommendation modules that readers genuinely click — and when to delete them."
slug: related-content-modules
cluster: web-design
tags: [content design, internal linking, editorial design, ux patterns]
date: 2026-05-14
author: Leonie Marsh
keywords: [related content design, related articles module, internal linking ux, content modules]
readingTime: 9
---

The "related articles" module is the appendix of web design: every long-form page has one, nobody can quite explain what it's for, and it only gets attention when something goes wrong. Scroll to the bottom of a typical agency blog and you'll find three cards chosen by a plugin, titled "You may also like", linking to posts from 2019 that nobody, including the author, would also like.

We know because we measured. Across a dozen content sites we've built or audited, default related-content modules earned click-through between 0.2% and 0.8% of article readers. Meanwhile, a single well-placed contextual link inside the prose of the same articles routinely earned 3–6%. The module wasn't failing because readers don't want more to read. It was failing because it was designed as furniture, not as an editorial decision.

Here's how we make these modules earn their place on the page — and how we decide when the honest answer is to delete them.

## The module's actual job

Before card layouts, agree on the job. A related-content module can plausibly do four things:

1. **Continue the session.** The reader finished the piece and has appetite left. This is the classic job, and the bar is high: they just got what they came for, so you're competing with the back button and the rest of their evening.
2. **Convert intent into a journey.** The article is top-of-funnel and the module should route the reader one step deeper — from a "what is" piece to a "how to" piece to a service or case study. This is a strategy job, not a similarity job.
3. **Rescue a mismatch.** The article wasn't quite what they wanted; the module is a second chance that keeps them on your site instead of returning to the search results.
4. **Distribute link equity.** Crawlers follow these links, and modules that surface older or deeper content measurably affect what gets indexed and ranked. We treat this as a welcome side effect, never the purpose — the architecture thinking lives in our piece on [internal linking as architecture](/journal/growth/internal-linking-architecture).

Most failed modules try to do all four at once and end up doing the algorithmic average of nothing. Pick one primary job per template. On our own journal, article pages optimise for job 1 with a strong assist to job 2; our [case study pages](/journal/web-design/case-study-page-design) optimise almost entirely for job 2, because somebody reading about a fintech dashboard rebuild is a very different prospect from somebody reading about type scales.

## Ranking: boring rules beat clever algorithms

The temptation is to reach for machine learning. Resist it for any site under roughly a million monthly readers — you don't have the data, and "personalisation" on thin data mostly means noisy recommendations that embarrass you in screenshots. We use a scoring rule simple enough to fit on a sticky note, applied at build time:

- **Same cluster:** +4. If someone finished a piece on focus states, the most likely next read is another interaction-design piece, not a pricing strategy essay.
- **Shared tags:** +2 per shared tag, capped at +4. Tags are our taste layer — they capture "articles about forms" across clusters, which is often the true affinity.
- **Same service family:** +2. Engineering articles gesture at other engineering articles.
- **Recency:** +1 if under a year old. Not a strong signal — old can be gold — but it breaks ties away from the archives.
- **Editorial pin:** a manual override, +10, used sparingly. When we launch a new service page rewrite, a producer can pin the companion article into relevant modules for a month.

This runs at build time and bakes three to five links into the page as static HTML. No client-side fetch, no layout shift, no third-party "engagement" pixel — if you're evaluating those widgets, our [third-party script audit](/journal/engineering/third-party-scripts-audit) explains why we consider their true cost in milliseconds and consent banners to be wildly underpriced by the vendors.

One hard rule: **never recommend the article you're on, and never recommend two articles with the same title pattern.** "Type scales, part one" and "type scales, part two" are one recommendation wearing an overcoat.

## Layout: three cards, real metadata

Card density follows the page's visual temperature. Our defaults, tested across several redesigns:

**Three cards, not four or six.** Three displays comfortably in one row at desktop, stacks gracefully on mobile, and — critically — keeps each card large enough to hold a useful title at reading size. Six-card grids are how modules become wallpaper. If your tags yield fewer than three good candidates, show fewer; two honest cards beat three honest and one desperate.

**Title large, dek optional.** The card's title should be set at the same scale the reader has just been reading at, because its job is to be *read*, not scanned as chrome. A 30–50 character teaser line (the description from frontmatter, trimmed) raises click-through meaningfully on long-form content, but only if the descriptions are written for humans — if your CMS is full of auto-generated excerpts, drop the dek rather than show "In this article we will explore…".

**Metadata that orients, not metadata that fills.** We show cluster ("Engineering"), reading time, and date. Reading time is the unsung hero: "6 min" is a promise a tired reader can act on. Author name earns its place when your authors are a draw — which is its own design problem, covered in our piece on [bylines and author pages](/journal/web-design/author-byline-trust-design). Thumbnails help when you genuinely have photography or illustration per piece; a grid of three generic gradient rectangles subtracts trust, and we'd rather have a strong typographic card than a weak pictorial one.

**A heading that tells the truth.** "Keep reading" or "Related reading" outperforms "You may also like" and the unforgivable "Recommended for you" — a claim a tag-matching build step cannot honestly make. One client insisted on "Hand-picked for you" over a plugin. We changed it to "Hand-picked" and actually had an editor pick them. Click-through tripled. The lesson is not subtle.

## Placement: the module is not just a footer

The end-of-article slot is table stakes, but two other placements matter more and are less crowded:

**The mid-article aside.** At roughly 60% scroll depth, a single slim line — not a card, a line of type — pointing at the natural companion piece. In an article about fluid type, it points at the token pipeline that makes fluid type survive handoff. This "if you're building this, you'll want" link earns the highest CTR of any module we run because it's contextual, singular, and arrives while the reader is still engaged rather than at the moment of departure.

**The in-prose link.** Still the heavyweight champion. Three to six relevant links woven into the text, descriptively anchored, outperform any chrome module — and they're the unit the whole cluster strategy is built on, as we lay out in [content clusters that compound](/journal/growth/content-clusters-strategy). The module's job is to catch the readers the prose didn't.

One placement to avoid: the interstitial "you might also like" interruption mid-scroll. Nobody has ever been grateful for it, and on a phone it reads as a pop-up wearing clever clothes.

## Measuring honestly

Report on the module as a product surface, not a vibe. Our scorecard, reviewed quarterly per template:

- **Module CTR:** clicks on the module divided by article readers who reached it (use a scroll sentinel, not pageviews — the readers who matter are the ones who saw it).
- **Continuation rate:** share of article sessions that continue to any second page. The module owns a slice of this alongside the nav and prose links. Segment it or you'll credit the wrong thing.
- **Dead clicks and rage patterns:** misclicks on cards that look interactive but aren't fully linked, phantom taps on mobile. Make the whole card the link; it is 2026 and "Read more →" as the only hit area is a tax on thumbs.
- **Zero-click candidates:** any recommended article that nobody clicks for a quarter, across all modules. Either its titles are weak or the matching rule that surfaces it is. Both are fixable.

Set a kill criterion before you build: if the end-of-article module sits under 1% CTR for two consecutive quarters on a template, we redesign it once. If it still fails, we remove it and let the prose links and footer do the work. Deleting a failing module has never hurt a session metric we've watched; it consistently improves page weight and perceived quality. Related thinking in [the footer is a sitemap with manners](/journal/web-design/footer-design-matters): every redundant module you cut makes the ones you keep more legible.

## Key takeaways

- Pick one job per template — continue the session, deepen the journey, rescue a mismatch — and design only for that.
- Boring build-time ranking (cluster + tags + recency + editorial pins) beats runtime "personalisation" for nearly every content site.
- Three cards maximum, titles set at reading size, an honest heading, and real metadata — including reading time.
- The mid-article aside and in-prose links routinely outperform the footer module; treat the module as the safety net, not the star.
- Measure against readers who actually reached the module, set kill criteria in advance, and be willing to delete it.
- Make the entire card a link. Always.

## FAQ

**How many related links should an article module show?**
Three to five. Below three, your matching rules are too strict or your archive too thin; above five, you're building an index page in the wrong place. Curate down with the scoring rules above rather than paginating a module.

**Are third-party "related content" widgets worth it?**
Rarely. They cost page weight, add a consent-bug third party, and optimise for their network's engagement rather than your funnel. For the build cost of a scoring function and a card component you own the equity, the speed and the dignity.

**Should the module differ between blog posts and case studies?**
Yes — they have different jobs. Editorial content wants lateral continuation; case studies want funnel progression (related sector work, then the service page, then contact). Hard-code the funnel steps for case studies; automate the blog.

**Does the module help SEO?**
Indirectly but genuinely: it keeps deep content crawlable, spreads internal link equity, and improves engagement signals. But design it for readers first — the SEO benefit follows from people actually using it, not from link volume. Crawlers can find your sitemap on their own.
