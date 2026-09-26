---
title: "Quarry & Compass: real-estate search that respects the dreamers"
description: "A property platform rebuilt around how people actually browse: dream scrolling, school-catchment rituals, honest listings, and maps that fly on regional 4G."
slug: quarry-and-compass-property
cluster: work
tags:
  - case study
  - real estate
  - map search
  - search UX
  - performance
date: 2025-06-16
author: Felix Brandt
keywords:
  - real estate case study
  - map search ux
  - property platform
  - saved search design
  - web performance
readingTime: 10 min read
client: Quarry & Compass
industry: SaaS
services:
  - Product design & engineering
  - Websites
year: 2025
stack:
  - React
  - TypeScript
  - MapLibre
  - Meilisearch
  - Node
  - Postgres + PostGIS
heroImage: /images/work/quarry-and-compass-property.jpg
heroAlt: "A hand-drawn style topographic map with brass map pins dissolving into a clean editorial property card grid."
---

Quarry & Compass is a fictional-but-plausible Australian property platform — listings, guides and buyer tools — founded by two ex-agents who believed the portals had trained everyone to hate house hunting. When they came to us, they had 62,000 listings, a loyal email list, and a website that treated every visitor like they were ready to buy a house this weekend.

Most visitors aren't. And that was the whole insight. Here is how we rebuilt the search experience around the way people actually behave, what we refused to copy from the big portals, and the illustrative numbers that followed.

## The challenge

We ran two weeks of diary studies with 19 house-hunters at different stages, from "six years away, just dreaming" to "auction on Saturday". The behaviour split cleanly: roughly 70% of sessions were *grazing* — aspirational scrolling, suburb reconnaissance, sending links to a partner with "imagine" in the message — and 30% were *hunting*, with filters, shortlists and open-home logistics. The old site served only the hunters. Grazers got a currency-field search box and a wall of urgency badges.

Three specific problems surfaced:

- **The map was a liability.** Vector tiles, 40,000 live pins, and a JavaScript bundle that turned browsing over regional 4G into a slide show. Half their audience browsed from regional towns — often looking at property in town.
- **Saved search was treated as a lead-capture trick**, not a ritual. People save searches the way they light candles: regularly, hopefully, and before they're ready to act. The old flow demanded an account before you could save anything, and then spammed you.
- **Listings lied by omission.** Floor plans without dimensions, "north-facing" claims you couldn't verify, car-space counts that excluded tandem. Every omission generated either a wasted inspection or a support email.

## The approach

**Two speeds, one surface.** Instead of separate "explore" and "buy" modes, we designed a search surface with a laziness gradient. Default state: a fast map with generous result cards, editorial photography-first grid, and soft prompts ("23 new in Castlemaine this month"). As the user's behaviour tightens — repeated filters, return visits, saved suburbs — the interface progressively offers sharper tools: commute-time filters, inspection planners, building-report links. This is progressive disclosure as a courtesy, a pattern we've written about in [our piece on complexity](/journal/product/progressive-disclosure-complexity) and applied in [Sundial Travel's booking flow](/work/sundial-travel-booking).

**The map got an engineering diet.** We rebuilt rendering around tiled, pre-clustered GeoJSON rather than live pins: at regional zoom levels you see suburb-level counts rendered server-side into compact tiles; individual listings appear only when there are few enough to be honest. The map tile budget — 220 KB per typical session viewport path — was set before the design of a single screen, in line with how we run [bundle budgets as a discipline](/journal/engineering/bundle-budget-discipline) and measure [Core Web Vitals in the field](/journal/engineering/core-web-vitals-field-guide). Result: the search page's first interactive map lands in under 2.5 seconds on a mid-range Android over 4G, versus eleven seconds before.

**Saved search as a ritual, with consent.** You can save a search with just an email — no password, one magic link now and another later if you return from a new device. Alerts are weekly by default, digest-shaped, and *beautiful*: a Sunday-morning email people described in testing as "a little magazine of my possible lives". Unsubscribe is one click and total. Referral behaviour told us we had it right: forwarded digest emails became a measurable acquisition channel.

**Honest listing pages.** We redesigned the listing template around verification. Floor plans carry a dimension layer. Aspect and sun-path are computed from the block's orientation and shown as a simple hourly arc, not asserted in copy. Every listing page carries a visible "what we couldn't verify" line when agents leave fields empty — which, delightfully, pressured agents to fill them. Trust UI as an incentive system.

**Catchments without the creepiness.** School-catchment overlays were the most-requested feature — and the one with real social sharp edges. We shipped them with data sources cited, boundaries marked as indicative, and no ranking language. Useful, sourced, humble.

## The outcome

Nine months post-launch:

- **Sessions per weekly active visitor rose 41%**, driven almost entirely by grazing behaviour — people browsing longer, further from purchase. The dreamers came, and stayed.
- **Saved searches per month tripled**, and the digest email's weekly open rate settled at 58% — absurd for property email, explicable only by the fact that people asked for exactly it.
- **Map interaction rate on mobile doubled** once the map stopped being the slowest thing on the page. Performance work showed up as engagement, as it always does.
- **"What we couldn't verify" lines fell by two-thirds** within a quarter as agents completed their listings — the platform's data quality improved through design pressure rather than moderation labour.
- **Support email volume on listing accuracy dropped 55%**, freeing the two-person support team to do the concierge work that differentiates a small platform from the portals.

## Stack and team

React and TypeScript; MapLibre over pre-clustered vector tiles; Meilisearch for the text-and-filter layer; Node and Postgres with PostGIS doing the geographic heavy lifting. Squad: one product designer, two engineers, one producer, with Quarry & Compass's founder sitting in Friday demos and vetoing anything that smelled like a portal. Our standard squad shape is described in [how we work](/approach).

## What we'd tell another marketplace

Respect the dreamers — they're your funnel, your brand and your email list, and most competitors insult them with urgency. Set the map's performance budget before the mood board. And design honesty as pressure: the best moderation tool is a visible empty field.

More of this thinking lives on [our journal](/journal), alongside the rest of [our work](/work). Planning a marketplace of your own? [Brief us](/contact).
