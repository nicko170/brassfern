---
title: "RSS: the distribution channel you already own"
description: "Followers you rent can be repriced overnight; a feed subscriber is yours. The case for full-text RSS in 2026 — and how to run a feed like a grown-up channel."
slug: rss-owned-distribution
cluster: growth
tags: [rss, distribution, publishing, owned audience, editorial]
date: 2026-08-18
author: Mara Ellison
keywords: [RSS strategy, content syndication, owned audience, web feeds, publishing stack]
readingTime: 9
heroImage: /images/articles/growth/rss-owned-distribution.jpg
heroAlt: "Editorial print illustration of a brass antenna mast growing from a potted fern, broadcasting concentric brass arcs over a fan of delivered paper envelopes."
---

Every few years someone announces the death of RSS, and every few years a platform reprices its reach and a few thousand publishers remember why feeds mattered. The pattern is old enough to have a moral: distribution you rent can be renegotiated at any time, by a counterparty who does not know your name. A feed subscriber is different. They took your URL into their own reader, on purpose. No algorithm stands in the middle, no invoice will ever arrive, and no platform can de-prioritise a relationship it doesn't mediate.

Brassfern has published a feed since 2014, and we ship one on every content site we build — this one included, at `/rss.xml`, declared on every page. Not from nostalgia. Because of all the channels a studio can operate, RSS is the only one that compounds with zero marginal spend and zero landlord risk. Here's the case, the spec, and the honest accounting of what you give up.

## The case in one paragraph, three lenses

**As arithmetic**: a feed subscriber costs nothing to reach again. A social follower costs whatever the algorithm says this quarter. An email subscriber costs ESP fees and deliverability vigilance. The feed is the cheapest retained attention there is. **As audience quality**: people who use feed readers in 2026 are self-selected for exactly the traits a serious publisher wants — they read long, they save and share deliberately, they skew technical and senior. We'd trade a thousand passive followers for a hundred reader subscribers without blinking. **As resilience**: platforms rise, pivot and die in cycles of about seven years; the feed format is twenty-five years old and has outlived every company that declared it dead. Boring is a structure, not a criticism.

## The spec we ship

A feed that earns loyalty is a small engineering artefact done with care. Our checklist — the publishing section of it lives alongside our [technical SEO launch checklist](/journal/growth/technical-seo-launch-checklist):

- **Valid, boring XML.** RSS 2.0 or Atom, validated in CI. A feed that breaks for a week teaches subscribers' readers to treat you as noise, and they don't come back.
- **Discovery everywhere.** `<link rel="alternate" type="application/rss+xml">` in the head of every page, not just the blog index. Reader apps auto-detect; give them the chance.
- **Stable GUIDs, forever.** The GUID identifies the item, full stop. Never regenerate them on a CMS migration, never derive them from titles that might change. Reshuffled GUIDs re-deliver your entire archive as "new" items — the single fastest way to get mass-unsubscribed.
- **Dates that behave.** `pubDate` set at publish and untouched after. Editing an article must not re-fire it into readers as fresh news; that's a timestamp bug wearing editorial clothing.
- **Absolute URLs in the body.** Readers render `content:encoded` out of context; relative image and link paths silently break. Resolve everything at build time.
- **Images included** — the hero, at feed-appropriate size. Cards render in readers too; an imageless item is a card that chose grey.
- **A JSON Feed alongside**, cheap to add and genuinely better-supported in newer reader apps. Two files, one pipeline.
- **A visible feed link** in the footer or journal header. Some humans still subscribe by hand. Bless them.

None of this is exotic. All of it is frequently wrong, because feeds get built once and audited never. Put feed validation in the same CI gate as your sitemap.

## Full-text vs excerpt: the honest trade

The oldest argument in feed publishing. Excerpts with a "read more" hop recover measurable traffic; full text wins the readers. We've run both across client programmes and our own journal, and our settled position: **full text for editorial, measure differently.**

The excerpt strategy optimises for the metric you can see — sessions — at the cost of the thing you actually wanted, which is people who trust you and remember you when budget season arrives. Reader-first audiences read in the reader. That's the deal they made: your words come to where they already are. Honouring it buys goods that attribution can't see: the forwarded item, the quote in a decision memo, the "you should read these people" in a Slack you'll never enter. Breaking it buys a click you can count and a reader who quietly leaves.

If you need the compromise position — say, a commerce-heavy publication where the site experience genuinely adds value — the honest version is a *generous* excerpt: the whole intro and the first section, not a fragment engineered to frustrate. A halfway feed is a tax on trust dressed as a growth tactic.

## Feeding the other channels from the feed

The feed isn't only for reader apps; it's the spine of a distribution operation a small team can actually run:

- **Newsletter digests.** If you publish a periodic letter, generate it from the feed rather than maintaining two pipelines — one source of truth, one place where title and description get their editorial pass. The care matters more than the mechanism: an auto-digest that reads like a press release sorted by date will still fail, as anyone who's read our [piece on growing a newsletter without becoming a goblin](/journal/growth/newsletter-growth-honestly) knows. The feed supplies the content; a human supplies the letter.
- **Syndication with canonical courtesy.** When you republish to platforms that aggregate (dev communities, Medium-alikes, industry portals), their import tools consume feeds — and the non-negotiable is a canonical link pointing home. Syndication without canonicals is lending the platform your authority; you want their audience, not their ranking. Get this right and recycling editorial into syndicated copies costs nothing and compounding-wise behaves like [content strategy that compounds](/journal/growth/content-strategy-compounds) — same asset, second audience.
- **POSSE as posture.** Publish on your own site, syndicate everywhere, let the feed be the machine that copies. The durable version of this principle has a name and twenty years of practice behind it; the web remembers who published first on their own domain.

## Measuring a channel that won't be measured

Feeds are private by design: no spy pixels, no per-subscriber tracking, no engagement funnels. This is a feature, and it means your measurement must be honest about being approximate. Three instruments, all respectable:

1. **Subscriber self-reports in user agents.** Major reader services fetch your feed on behalf of all their users and say so in the request — the agent string carries a subscriber count. Collect those from your logs monthly; the summed band is your reader audience, and its trend is real even though the point estimate isn't.
2. **Fetch-pattern analysis.** Requests per day, distinct reader agents, bot versus reader ratios from your CDN logs. A healthy editorial site sees feed fetches track output cadence; a spike in fetches with no new items means something's wrong upstream.
3. **The soft signals.** Replies that quote a piece the day it was only in the feed. Inbound emails that say "saw this in my reader." Prospects who arrive already convinced, on pages with no referrer. Feed-driven trust converts invisibly and arrives via [dark channels you model as a range](/journal/growth/attribution-noise-decisions), which is exactly how all good brand work arrives.

Publish the band internally — "reader audience holding around X thousand, growing" — so the channel has standing in budget conversations. Unmeasured channels get defunded; honestly-bounded ones survive.

## The ritual

Like every channel worth having, the feed dies of neglect unless someone owns it. Our version is small: feed validation in CI (a broken feed fails the build), a quarterly fetch-log review (subscriber band, reader mix, error rates), and one line in the publishing checklist — open the new item in an actual reader app and read it there once. Thirty seconds to catch the broken image, the relative link, the GUID that shouldn't have changed.

That's the entire cost of the cheapest, most durable distribution channel a publisher can own. Most teams pay it on their [web build](/services/websites) once and collect for a decade. The rest are still negotiating with a landlord, mostly in their [journal](/journal) comments, for reach the landlord reserves the right to halve.

## Key takeaways

- Feed subscribers are owned followership: no algorithm, no invoice, no landlord — and self-selected for seniority and depth.
- Ship the spec properly: valid XML in CI, discovery links on every page, immutable GUIDs, frozen dates, absolute URLs, images in the body.
- Publish full text and measure differently; excerpts optimise a visible metric by spending invisible trust.
- Use the feed as the spine for newsletters and syndication — one source of truth, canonical links pointing home, POSSE as posture.
- Measure honestly with user-agent subscriber counts, fetch patterns and soft signals; publish the band so the channel keeps its budget standing.
- Own the ritual: CI validation, a quarterly log review, and one human read in an actual reader before anything ships.

## Frequently asked questions

**Does anyone actually use RSS in 2026?**
Respectfully, the people asking this are not in feed readers, and the people in feed readers are disproportionately the people you want: developers, editors, researchers, the habitual sharers. Millions, self-selected, invisible to most analytics.

**Won't full-text feeds cannibalise site traffic?**
They redistribute it. Some reading moves into readers; trust, recall and sharing grow. Editorial businesses optimising for ad pageviews may choose excerpts; studios optimising for relationships shouldn't.

**RSS or email — if we can only do one?**
Do email for reach you can initiate, RSS for loyalty you've earned. They serve different promises and the marginal cost of the feed is near zero once the pipeline exists. This is a false either/or.

**How do we migrate platforms without losing subscribers?**
Keep the feed URL stable (redirect if you must, permanently), never reshuffle GUIDs, and publish a normal item explaining the move. Reader apps handle redirects gracefully; mass redelivery of your archive is the only unforgivable sin.

**Should we offer per-category feeds?**
If your clusters are genuinely distinct appetites — a changelog versus long-form essays — yes; they're free to generate and some subscribers want the narrow stream. But maintain one canonical "everything" feed; fragmentation is a favour, not the default.
