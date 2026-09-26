---
title: "Wattle & Daub: a dining room website that fills tables"
description: "How we rebuilt a Surry Hills restaurant's website around reservations that actually convert — cutting no-shows 38% and doubling midweek covers."
slug: wattle-and-daub-reservations
cluster: work
tags: ["case study", "hospitality", "restaurant website", "reservations", "local seo"]
date: 2025-08-14
author: June Okafor
keywords: ["restaurant website case study", "reservation ux", "hospitality digital", "local seo"]
readingTime: 8 min read
client: Wattle & Daub
industry: Hospitality
services: ["Brand & identity", "Websites", "Growth"]
year: 2025
stack: ["Astro", "TypeScript", "Sanity", "Cloudflare Workers", "Twilio", "Plausible"]
heroImage: /images/work/wattle-and-daub-reservations.jpg
heroAlt: "Editorial still-life: ceramic plates, brass cutlery and yellow wattle blossoms on a linen table — the Wattle & Daub case-study hero."
demo: wattle-and-daub-reserve
---

Wattle & Daub is a 48-seat dining room in Surry Hills that cooks like a destination and, when we met them, had a website like an afterthought. Chef-owner Mara Ellery had built a ferociously loyal Friday-night crowd and a quietly empty Tuesday. The booking flow lived on a third-party marketplace that charged per-cover fees, owned the guest relationship, and — this is the part that stung — surfaced three competitor restaurants on Wattle & Daub's own Google listing.

This is the story of how we turned a brochure site into the restaurant's hardest-working member of staff. Everything below is illustrative of how we work; the numbers are directional, as they always are in hospitality.

## The challenge

Restaurants are a strange digital category. The product is perishable by the hour — an empty 7pm table on Tuesday is revenue that never comes back — yet most restaurant websites behave like printed menus from 2016: a PDF, a phone number, a phone-book listing on a marketplace.

Three problems, in order of pain:

**The marketplace tax.** Roughly 61% of Wattle & Daub's bookings arrived via a marketplace charging a per-diner fee. Over a year, that was the salary of a full-time commis chef, paid to a platform that actively taught guests to book *through* it rather than *with* the restaurant.

**A 22% no-show rate on peak nights.** No card holds, no reminders beyond an automated marketplace email nobody read. Every no-show on a Saturday was two to four seats comped to the bin.

**Invisible locally.** For a restaurant two blocks from one of Sydney's busiest dining strips, Wattle & Daub ranked on page two for "restaurant Surry Hills" and didn't appear at all for high-intent queries like "Sunday lunch Surry Hills" or "private dining 10 people Sydney".

The constraint that shaped everything: Mara had zero appetite for a system her floor team would have to babysit. The site had to earn its keep with less than ten minutes of staff attention a day.

## The approach

**Strategy first: own the guest, or rent them forever.** We reframed the project's goal from "a better website" to "move direct bookings from 39% to 80% within a year". Every design decision got measured against that single number. It clarified the work wonderfully. PDF menus died. Marketplace link-outs died. Anything between a hungry visitor and a confirmed table died a noble death.

**A booking flow, not a booking page.** We designed reservations as the spine of the site rather than a form tacked onto it. Party size, date and sitting are chosen in three taps from every template — the bar follows you down the menu, collapses politely while you read, and never blocks content. Under the hood we built a small availability service on Cloudflare Workers that reads the restaurant's table map (48 seats, three sittings, a chef's counter of four) and holds slots for eight minutes while guests confirm. Card-hold policy is applied selectively: required for parties of five-plus and Saturday sittings, waived for everyone else, because friction should be spent where the risk is.

**The menu as editorial.** Wattle & Daub's menu changes weekly, which is exactly why the old site had a stale PDF. We modelled the menu in Sanity as structured content — dishes, dietary tags, provenance notes — so the floor team's Sunday menu update is a five-minute job from a phone. Structured dishes also meant we could ship real dish-level schema markup, which turned out to matter more than any design decision for search visibility.

**Photography direction over photography volume.** We art-directed a single two-day shoot: overhead natural light, worn timber, steam caught against the window, hands in frame but no faces. Twelve hero dishes and four room shots, reused deliberately. The site's grain-textured, ink-and-brass art direction came from the room itself — the restaurant's brass door handle literally supplied the accent colour.

**Killing no-shows with SMS, not guilt.** Instead of punitive deposit emails, we built a light lifecycle: confirmation SMS immediately, a warm reminder at T-minus 48 hours ("Mara's got the duck on for Saturday — still joining us? One tap to confirm or release your table"), and a same-day nudge at T-minus 4 hours with a one-tap release link. Releasing a table is made absurdly easy, because a released table can be resold; a ghosted one can't. This is the same lifecycle thinking we bring to [our growth work](/services) — applied to duck confit instead of software trials.

**Local SEO as plumbing, not a campaign.** Google Business Profile overhaul, review prompts printed on bill presenters (QR to the restaurant's own review page first), capped at one ask per table. Location pages for "private dining" and "Sunday roast" — both built from real guest questions we pulled from call logs, not keyword tools.

## The outcome

Twelve months post-launch, illustrative results:

- **Direct bookings: 39% → 83%.** The marketplace remains as a discovery channel, but fees dropped by two-thirds — roughly the salary of that commis chef, returned to the kitchen.
- **No-shows: 22% → 7%** on peak sittings, driven almost entirely by the 48-hour confirm-or-release SMS. Released tables get resold about half the time, which is found money.
- **Midweek covers doubled** within two quarters, helped by a Tuesday "locals' menu" page we added after watching search data.
- **Page one for "restaurant Surry Hills"** and top-three for 11 of the 14 local queries we tracked, without a dollar of paid search.
- **LCP of 1.1s on mid-range Android over 4G** — because a slow restaurant site loses bookings the same way a slow door loses walk-ins. The whole marketing site ships under 140KB of JavaScript, most of it the booking widget.

The part we didn't predict: the one-tap release link became a story guests tell. Mara reports regulars proudly releasing tables "like returning library books". Generosity as an interface pattern — we'll take it.

## Stack and team

Astro for a static-first marketing site with islands only where interactivity pays (booking widget, availability). Sanity for menu and editorial content with phone-friendly editing. Cloudflare Workers for the availability and hold service. Twilio for SMS lifecycle. Plausible for privacy-respecting analytics the owner actually reads, sent as a one-page digest every Monday — the same measurement discipline we describe in [our approach](/approach).

Team: one design lead, one engineer, one growth strategist, part-time over a nine-week build, then a light quarterly retainer. Mara calls it "the employee who never calls in sick".

## What we'd tell another restaurant

Spend your friction budget on the moments that cost you money — card holds on big Saturday tables, not on Tuesday walk-ins. Structure your menu as data; the SEO and maintenance benefits compound. And make cancelling delightful. It sounds backwards. It isn't.

If this way of working sounds like your kind of project, [browse more of our work](/work) — including [a climate data platform](/work/meridian-climate-data-explorer) and [an education onboarding rebuild](/work/brightmarsh-onboarding) — or [start a project brief](/contact). We do our best thinking over a table like Mara's.
