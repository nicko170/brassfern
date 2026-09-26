---
title: "Article indexes people actually browse"
description: "Most blog indexes are a reverse-chronological conveyor belt. Here's how we design journal indexes that invite real browsing — lead stories, rhythm, and honest pagination."
slug: article-index-design
cluster: web-design
tags: [editorial design, content discovery, ux patterns, information architecture]
date: 2026-07-09
author: Ruby Castellanos
keywords: [blog index design, article listing ux, editorial web design, content discovery, card grid design]
readingTime: 10
heroImage: /images/articles/web-design/article-index-design.jpg
heroAlt: "Overhead flat-lay of printed index cards and contents pages arranged in a rhythmic grid on cream paper, one oversized lead card, with brass and fern-green accents."
---

Open ten agency blogs and nine of them are the same page: a hero card for the newest post, then an infinite column of identical cards marching back to 2019, sorted by date and nothing else. It is a conveyor belt. It tells the reader one thing — "things happen here, sometimes" — and it answers none of the questions a real visitor arrives with. Is this place for me? Where's the good stuff? How deep does this go?

An article index is not a database dump with card chrome. It's the front door of your thinking. We design it the way a good magazine editor lays out a contents page: with opinion, rhythm, and a clear sense of what deserves your attention first. Here's the playbook we use, including the decisions on this site's own [journal](/journal).

## The conveyor belt problem

Reverse chronological order is a fine default for a database and a lazy one for a reader. Date order says "newest is best", which is rarely true — your best piece might be eighteen months old, and your newest might be a minor release note. It also flattens everything to one visual weight, so a 2,000-word flagship essay sits next to a four-paragraph announcement wearing the same card.

The failure mode we see most in audits: indexes that answer "what did you publish lately?" when visitors are asking "what do you know about X?" A prospective client landing on your journal wants to trace a path — from a topic they care about, to evidence you've thought about it hard, to the [work](/work) that proves it. Date order makes them do that archaeology themselves. Most won't.

The fix is not abandoning chronology — recency is a real signal that the studio is alive. The fix is layering editorial structure on top of it.

## Lead with a lead story

Newspapers worked this out a century ago: one story gets the big treatment, and everything else falls in behind. On a journal index, the lead story card does three jobs at once. It tells a first-time visitor what you consider your best current thinking. It gives returning readers a reason to look (the lead rotates). And it breaks the monotony of the card grid, giving the page a beginning.

Our rules for the lead slot:

- **One lead per page-one view**, set significantly larger than the grid cards — display-weight title, a real dek, an image or strong typographic tile. On our journal it's the latest article that has a proper hero image, which quietly enforces a quality bar: if a piece didn't earn a hero, it doesn't earn the lead.
- **Exclude it from the grid.** Nothing says "template" like the lead story appearing twice on the same page — once enormous, once as card number one. Dedupe at build time, not in the stylesheet.
- **Page one only.** Pagination pages two and beyond drop straight into the grid. The reader who clicked "page 3" is browsing the archive; ceremony is finished.

## Rhythm: card, list, card

A wall of identical cards reads as wallpaper after the second row. The eye needs syncopation. On dense indexes we mix two or three densities: full cards with images for pieces that have them, slim typographic rows (title, meta, arrow) for shorter reads, and the occasional full-width feature. Our [resources hub](/resources), for instance, uses compact numbered rows — a list that behaves like a table of contents rather than a Pinterest board.

A practical test: blur your eyes and look at the page. If you see one texture from top to bottom, you have wallpaper. A good index has a readable rhythm at blurry-vision distance — heavy, light, light, medium. This is the same instinct behind good [editorial grid work](/journal/web-design/editorial-grids-on-the-web): rhythm first, rules second.

## Metadata: orient, don't fill

Every card carries a metadata decision, and the temptation is to carry everything: author, date, reading time, tags, category, a share icon nobody has ever clicked. Resist. Card metadata exists to help a reader choose, and the signals that genuinely help are few:

- **Cluster or category** — "Engineering" tells a skimming founder whether this card is her conversation. One label, set quietly.
- **Reading time** — a promise a tired reader can act on. "6 min" converts better than any teaser copy we've tested against it.
- **Date** — matters disproportionately for fast-moving topics (AI, platform changes) and barely at all for craft pieces. We show it; we don't lead with it.

Descriptions deserve a harder look. A dek written for humans — a genuine one-line argument for reading — lifts click-through measurably. A dek that's the first sentence of the article with its knees cut off subtracts trust. Our rule: if the writer didn't write the description, the card doesn't show one. This holds down on [case study listings](/work) too, where the client's industry and services orient faster than any excerpt.

## Beyond page one: pagination without fatigue

Somewhere past sixty or eighty entries, every index faces the scale question. The usual answers are infinite scroll (a trap — it kills the footer, wrecks deep-linking, and makes "I saw it about halfway down" unrecoverable) or endless pages of twelve. Both treat the archive as a queue. Readers experience it as a swamp.

What works at scale:

1. **Filters that earn their place.** Cluster or tag filters let a reader say "only show me the growth pieces" — but only if the taxonomy is honest and every option has a count. A filter that yields zero results is a broken promise in a pill. Show counts, URL-sync the state (the URL is your best state manager — our engineers wrote a whole piece on [why](/journal/engineering/url-as-state-management)), so a filtered view is shareable and back-button-safe.
2. **Route-based pagination, not a load-more button.** Real pages with real URLs mean page 4 can be linked, indexed, and returned to. It also forces a discipline: if page 9 of your journal is embarrassing, the problem is your archive, not your pagination.
3. **Internal navigation between pages that respects the reader's position.** "Older / Newer" with page numbers, not a carousel of "1 2 3 … 47". Nobody has ever clicked 31.

If your index has hundreds of entries, also give people an exit ramp that isn't the index: a strong [search](/search) with an empty state that shows popular tags and latest articles. Browse and search are different moods; serve both.

## The index is a argument for the studio

This is the part agencies forget while styling cards. Your article index is often the second page a prospective client visits, and it makes an argument whether you intend it to or not. A blog with three posts from 2023 argues you stopped thinking. A wall of uncategorised listicles argues you think in volume. An index with a confident lead story, honest filters, and visible depth argues: these people have a practice, and it's been running for years.

That argument is convertable. Route it somewhere. The end of a good cluster page should gesture at the adjacent commercial surface — reading about type systems should end one click from [how we build websites](/services/websites). Not a hard sell; a door left open. We place related-case-study links inside the index furniture rather than a shouting CTA banner, because the reader came to browse, and manners matter. (Our piece on [related-content modules](/journal/web-design/related-content-modules) covers the ranking rules in detail.)

## A pre-flight checklist for index pages

Before we ship any article index, we run it through this list:

- Does page one have a clear lead story, excluded from the grid?
- Does the page have rhythm at blurry-vision distance?
- Is every metadata element on every card a genuine choosing signal?
- Do all filters show counts, URL-sync, and never dead-end at zero?
- Can page 4 be linked, shared, and crawled?
- Does the archive tell the truth about volume — no fake "load more" that ends after two clicks?
- Does the index route browsing readers one respectful step toward services or work?

## Key takeaways

- Reverse chronological is a storage order, not a reading order. Layer editorial structure over it.
- One lead story, big, deduped from the grid, page one only.
- Mix densities — cards, rows, features — so the page has rhythm instead of wallpaper.
- Card metadata exists to help readers choose: cluster, reading time, date. Descriptions only if a human wrote them.
- Filters need counts and URL state; pagination needs real routes; search needs a good empty state.
- Your index makes an argument about your practice. Make it on purpose, and leave a door open to the commercial pages.

## Frequently asked questions

**Should the newest article always be the lead story?**

No — the newest article *with a proper hero and a full argument* should be. Tying the lead slot to an asset (a hero image, a written description) is a forcing function for quality. A thin announcement as your lead story tells visitors your best thinking is an announcement.

**Isn't infinite scroll better for engagement?**

It inflates scroll-depth metrics and quietly destroys everything else: footers, deep links, back-button behaviour, and the reader's sense of the archive's size. On content sites we've audited, infinite scroll raised "pages per session" while lowering continuation to actual articles. Use real pages.

**How many cards per page?**

We default to twelve plus the lead. Enough to feel deep, few enough that page two isn't a junk drawer, and divisible by two and three so the grid never orphans a final card. The number matters less than the rule: pick one, hold it, and let the pagination routes fall out naturally.

**Do tags or clusters work better as the primary filter?**

Clusters as primary (five to nine of them, matching your actual practice areas), tags as the serendipity layer. Tags multiply faster than any governance can control; clusters make a promise about who you are. If a reader can't guess what's in a cluster from its name, rename it before you ship the filter.

**Our archive is thin — should we hide the index until it's bigger?**

No, but be honest about scale. Twelve good pieces with a confident lead story and no fake pagination beats forty pieces with bulk filler. A small, sharp archive argues focus. A padded one argues the opposite.
