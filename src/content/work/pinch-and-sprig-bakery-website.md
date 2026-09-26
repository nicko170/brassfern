---
title: "Pinch & Sprig — a bakery group that sells out by 10am, online first"
description: "Three Sydney bakeries, one-tap pre-orders with honest cut-offs, a wholesale portal that kills the 5am phone call — and menus that are pages, not PDFs."
slug: pinch-and-sprig-bakery-website
cluster: work
tags:
  - case study
  - hospitality
  - bakery
  - pre-order
  - brand identity
date: 2025-06-02
author: Nate Sullivan
keywords:
  - bakery website case study
  - hospitality ecommerce
  - pre-order ux
  - wholesale ordering portal
  - restaurant brand identity
readingTime: 10 min read
client: Pinch & Sprig
industry: Hospitality
services:
  - Brand & identity
  - Websites
  - E-commerce
year: 2025
stack:
  - React
  - TypeScript
  - Sanity
  - Shopify
  - Mapbox
heroImage: /images/work/pinch-and-sprig-bakery-website.jpg
heroAlt: "Editorial still life of pastries on brown paper with brass-toned cutlery and fern-green linen, warm morning light."
---

Pinch & Sprig is a fictional-but-plausible Sydney bakery group: a corner shop in Enmore that queues down the street, a newer site in Marrickville, a production kitchen in St Peters, and a wholesale list of thirty cafés. Their croissants sell out by ten most mornings. Their website, until recently, was an Instagram profile, a PDF menu from 2023 and a phone number nobody answered after 6am.

The founders came to us with a sentence we've learned to love: "We're too busy to grow." The morning sell-out sounds like success — and it is — but it's also a ceiling. Every sold-out morning is a hundred customers told no, thirty wholesale cafés ordering by voicemail, and a brand entirely dependent on a queue. Here's what we rebuilt. The numbers below are illustrative; the shape is honest.

## The challenge

Hospitality web projects usually fail by copying restaurant playbooks: booking widgets, hero videos, menus as PDFs. A bakery is a different business wearing the same apron. Its transaction is ten dollars, its window is ninety minutes, and its inventory **dies at 4pm**. Everything we designed had to live inside those constraints.

Three specifics. First, **the sell-out maths.** Pinch & Sprig baked for foot traffic plus a safety margin, and threw out the margin. Pre-orders could convert waste into revenue — but only if the cut-off logic was honest. Nothing poisons a bakery's reputation faster than a pre-paid croissant that isn't there at 8am. Second, **wholesale ran on voicemail.** Thirty café owners calling between 5am and 6am, orders transcribed onto paper, errors discovered at delivery. Third, **the brand had grown faster than its identity.** Three sites, three interpretations of the logo, packaging that didn't match the shop that didn't match the Instagram.

## The approach

**Identity: photograph the product, type-setting the rest.** The rebrand started with a two-day shoot — pastry under honest morning light, on the actual baking paper, with the actual trays. No styling trickery: that honesty *is* the positioning, consistent with our thinking on [product photography that actually sells](/journal/ecommerce/product-photography-that-sells). Around the photography we built a restrained system: a condensed grotesque for prices and windows, a warm serif for the words between, one pinch-red accent inherited from the shop's original awning. Enough system for three sites and a wholesale portal, not so much that a label printer can't follow it.

**Pre-orders with honest cut-offs — the heart of the build.** One tap from Instagram bio to a pickup slot. The bake sheet is the source of truth: each product has a per-site allocation per 30-minute window, decremented in real time, and the site says plainly when a window is full rather than overselling. The 9pm cut-off is explained in one sentence — "we laminate at 4am; this is when we need to know" — because a cut-off with a reason reads as craft, not bureaucracy. This follows our [pre-order trust playbook](/journal/ecommerce/preorder-flows-trust): scarcity you can verify is service; scarcity you can't is marketing. Failed pickups release stock back to the morning queue automatically, with a two-strike policy that has been used eleven times and disputed zero.

**Wholesale: a quick-order portal, not a shop.** Café owners don't browse; they reorder. The portal opens on a one-screen grid of *their* usual items with last-order quantities pre-filled — edit, confirm, done. Cut-off timers per product line, delivery-day logic per postcode, standing orders that pause for public holidays. The same "answer first" instinct as our [dashboard work](/journal/product/dashboard-design-hierarchy): a café owner at 5:40am wants to confirm, not to explore.

**Menus are pages, not PDFs.** Each site's menu is a real page — indexable, accessible, editable in Sanity by anyone on the team without a design degree. Allergen tags are data, not footnotes. Pricing changes propagate to menus, pre-order and wholesale from one place, ending the three-versions-of-the-truth problem that plagues every multi-venue [hospitality group](/industries/hospitality). The sites also carry proper local landing pages — opening hours that update for public holidays, park-nearby notes — built on the [local SEO checklist](/journal/growth/local-seo-hospitality) we run for every venue client.

## The outcome

Nine months after relaunch:

- **Pre-orders account for 41% of morning volume** at Enmore, and the morning sell-out moved from 10am to closer to midday on weekdays — same ovens, better information. Food waste is down by a fifth.
- **Wholesale reorder time fell from 25 minutes (voicemail, callbacks, confirmation texts) to 4 minutes.** Nineteen of thirty wholesale accounts converted to the portal in the first month without being asked twice; the rest followed when the phone line quietly stopped being the fastest option.
- **"Are you open?" phone calls dropped to effectively zero** — the hours panel answers to the minute, including the Instagram bio's most-asked question.
- **Pickup-window adherence is 94%.** The honest cut-off and the live allocation turned out to be self-policing: when the site doesn't oversell, customers don't queue-rage.
- **Catering enquiries tripled**, almost entirely through the menu pages' new ranking for "birthday cake Enmore" and friends — search traffic the PDF was invisible to.

## Stack and team

React and TypeScript storefront on Shopify for payments and order management; Sanity as the single content source for menus, hours and allocations; a small sync service keeps bake-sheet capacity honest in real time; Mapbox powers suburb-level delivery logic. Squad: a designer, two engineers, a producer, and Pinch & Sprig's head baker in every Friday demo — because she was the only person who knew what 4am actually looks like. Our standard squad shape, more on [how we work](/approach).

## What we'd tell another bakery group

Your sell-out isn't a marketing asset, it's a data problem. Put your bake sheet on the internet, make your cut-offs explain themselves, and let photography do the talking. We brought the same instincts to [Coriander Collective's six-restaurant platform](/work/coriander-collective-restaurant-group) and to [Tallow & Co.'s providore rebuild](/work/tallow-and-co-providore). If your mornings are chaos, [tell us about them](/contact).
