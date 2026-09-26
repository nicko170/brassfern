---
title: "OG images: the growth surface hiding in your metadata"
description: "Your pages are shared thousands of times, and most preview cards are a cropped hero or nothing. A system for OG images that earn the click — and how to measure it."
slug: og-images-growth-surface
cluster: growth
tags: [og images, social sharing, metadata, design systems, growth]
date: 2026-05-27
author: June Okafor
keywords: [OG image design, open graph images, social share cards, link preview design, generated og images]
readingTime: 9
---

Every time someone shares a link to your site — in a team chat, a community forum, a WhatsApp group where the actual buying decisions get discussed — the platform fetches your Open Graph image and renders your page as a card. That card is, functionally, an ad unit you didn't design, distributed for free into the most trusted channels there are: person-to-person messages. And on most sites it's an afterthought: the hero image crops badly, the title truncates, half the blog renders the brand's generic card, last year's homepage screenshot.

We treat OG images as a designed system, on every site we ship, for a simple reason: the click-through difference between a composed card and an auto-crop is real and measurable, and the work to close it is a template, a pipeline and a checklist — days, not sprints. Here's the system, from the design token layer up.

## The template is a design system, not a picture

A good OG system is a small set of composed templates, one per content type, built from your tokens — on Brassfern's own site that means the paper, the ink, the brass rule, Fraunces doing the voice. The pattern transfers to any brand system:

- **Article template.** Cluster label (mono, small caps), the title in display type set for *legibility at 400px wide* — because that's where most people will meet it — an author name where the byline carries trust, and one brand mark. The art direction question is how much of the article's hero to include; our answer is usually none, because a composed typographic card reads as deliberate, and a re-cropped photograph reads as a mistake.
- **Service/landing template.** The proposition, not the page title: "Software with a heartbeat" outranks "Services — Brassfern". These pages get shared as endorsements ("you should talk to these people"); the card should finish the sentence the sharer started.
- **Case-study template.** Client name, the project's one-line outcome, and brand texture. When a partner shares the case study you made about them, the card is doing portfolio duty in a thread you'll never see.
- **Default template.** The fallback for anything without a specific card — never "no image", because platforms then scrape whatever image they find first, and the first image is often a UI icon.

Design constraints that matter more than taste: **1200×630**, the near-universal stage; **safe margins** of roughly 40px because platforms round corners and some crop edges on certain surfaces; **contrast that survives ambient compression** — fine hairlines and 12px captions evaporate under platform recompression, so rules go thick and type goes big; and **no critical content in the corners**, where chat bubbles and platform chrome occasionally overlap.

## Generated vs. designed: build the machine

Hand-made OG images don't scale past about thirty pages, and content sites blow past thirty pages in a quarter. The scalable answer is template-per-type plus **build-time or edge generation**: the OG image is rendered from the same data as the page head — title, description, author, cluster — so a card can never drift from its page, and a redesign of the template reissues every card at once.

The engineering shape we use: templates are HTML/CSS (the design system you already have), rendered to PNG at build time for static content — articles, case studies, service pages all know their metadata at build time, and prerendered output means the cost is paid once, not per request. Dynamic surfaces (search results, user-ish pages) get edge generation or a generic card. Hand-designed one-off images are reserved for the few pages that justify them — the homepage, the biggest case studies — and even then, they're designed *into* the template system so the season's art can retire without rescuing 400 URLs.

Two pipeline rules learned the hard way. First, **fonts must be embedded at the generation layer** — subtle rasterisation differences between environments will quietly turn your Fraunces into a fallback serif on exactly the pages that matter, and nobody will notice for months. Bake a rendering snapshot test into CI: one known page's card, diffed. Second, **cache-bust on content change**: card URLs should carry a content hash or version param, because platforms cache OG images aggressively. Publish a corrected title and the old card can follow the URL around the internet for weeks.

## The metadata contract around the image

The image is the centrepiece of a larger contract; the card fails when the tags around it are sloppy. Our launch checklist — the social-metadata section of it, anyway, the full version lives in our [technical SEO launch checklist](/journal/growth/technical-seo-launch-checklist) — requires per page:

- `og:title`, `og:description` written for the *share context*, not just SEO reuse. "Pricing" is a page title; "Pricing that respects your time — Brassfern" is a card title. They may equal each other, deliberately, but that equality should be a decision.
- `og:image` absolute URL, plus `og:image:width`/`og:image:height` (some platforms lazily skip unannotated images), and a meaningful `og:image:alt`.
- The Twitter/X equivalents where you care; otherwise `summary_large_image` behaviour follows the OG tags. Canonical URL set, so shares consolidate.
- One structured truth per page — the [schema markup](/journal/growth/schema-markup-playbook) and OG tags should agree about what the page is. Inconsistency is how rich results contradict share cards.

## Testing the unfurl, including dark mode

Every template change gets unfurl-tested before it ships. The cheap way: a private staging URL posted into the platforms your audience actually uses (chat apps, the socials, a forum thread preview), plus each platform's official card validator to force a cache refresh. What you're checking, beyond the obvious:

- **Dark mode rendering.** Cards render against near-black backgrounds in dark-mode chat and feeds. A card built only on light paper can render as a glaring white rectangle — or worse, a transparent-PNG wordmark disappearing into dark chrome. Define both appearances explicitly: the card's background is *part of the image*, never left to transparency.
- **Retina sharpness.** 1200×630 downscaled is fine; the same card exported mushy at 2× isn't. Text rendering at generation time must be crisp — this is where the HTML-to-image approach shines over exported JPEGs of text.
- **Truncation behaviour.** Platform title/description limits differ; compose so the truncation is graceful. The card image carries the full thought; the tags carry the summary.
- **The article-grid moment.** Some surfaces (and many newsletters) show cards in a grid; look at your card next to three strangers' cards. Distinctiveness at thumbnail scale is an art-direction problem — the same problem discipline as [art-directing images for the responsive web](/journal/web-design/image-art-direction-web), with the budget of a postage stamp.

## Does it pay? Measuring what you mostly can't see

Honestly: most OG-driven sharing happens in dark social — private messages and groups — where referrers vanish. So measure what's visible and model the rest. Referral sessions from social and messenger surfaces per shared page, before/after card improvements, segmented by page type; the differences we've seen moving from auto-crops to composed cards are consistently meaningful for editorial content, less so for transactional pages. Slack-style unfurls and newsletter embeds leave partial traces. And treat card quality as hygiene, like [case-study pages that win work](/journal/web-design/case-study-page-design): you don't A/B test having a good office.

The deeper argument is brand arithmetic. Every shared link is a micro-impression of the brand's craft in the exact moment a trusted person recommended you. A site that sweats its 404 page and ships a broken share card has its effort gradient backwards — the card is, per impression, probably the cheapest high-trust brand surface you own.

## Key takeaways

- Shared-link cards are free ad units in the highest-trust channels; treat them as a designed system, one template per content type.
- Compose for 1200×630 with safe margins, thick rules and big type — platform compression eats subtlety.
- Generate cards from page metadata at build time; embed fonts, snapshot-test rendering, cache-bust on content change.
- The metadata contract matters as much as the image — share-context titles, image dimensions, alt text, one truth across OG and schema.
- Unfurl-test every template change across real platforms, in dark mode, at thumbnail scale.
- Expect dark social to hide the impact; measure visible referrals per page type and treat the rest as craft hygiene.

## FAQ

**Dynamic per-user OG images — worth it?** For user-generated or personalised pages (public profiles, shared reports), yes — that's where the card carries recipient-relevant information. For marketing and editorial content, per-page static generation covers everything; per-request dynamic rendering is complexity without upside.

**JPEG or PNG for cards?** PNG or high-quality WebP. Cards carry text and flat colour — exactly what JPEG mangles — and platforms recompress whatever you ship. Start lossless so the second generation is the platform's, not yours.

**How much should the homepage card differ from templates?** Enough to be a poster. The homepage card is the one shared out of context by people describing you; it gets the bespoke art direction, the tagline, the season's best image. Templates carry the other four hundred pages.

**Is this part of a website build or a retainer?** Both, but in a specific order: the OG system is a build-time deliverable inside a [website engagement](/services/websites) — templates, generation, QA — and thereafter it's maintained by the content process. Every new content type gets a template; every redesign reissues every card; nothing else needs thinking about. That's the point of a system.
