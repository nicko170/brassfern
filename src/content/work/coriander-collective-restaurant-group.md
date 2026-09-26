---
title: "Coriander Collective: six restaurants, one platform, zero beige"
description: "A restaurant group's six venues got one platform and six personalities: token-driven theming, unified reservations and gift cards that grew revenue 5x."
slug: coriander-collective-restaurant-group
cluster: work
tags: ["case study", "hospitality", "multi-brand", "design tokens", "reservations"]
date: 2024-10-03
author: Mara Ellison
keywords: ["restaurant group website", "multi-brand design system", "reservations ux", "hospitality case study"]
readingTime: 9 min read
client: Coriander Collective
industry: Hospitality
services: ["Brand & identity", "Websites", "E-commerce"]
year: 2024
stack: ["React", "TypeScript", "Node", "Postgres", "Sanity", "Stripe"]
---

Coriander Collective runs six Sydney restaurants you would never guess were siblings: an 18-seat omakase above a laneway, a loud Greek taverna that seats 200, a wine bar with no sign, a Cantonese barbecue institution, a beachside kafeneion and a bakery that sells out of sourdough by 9am. What they shared, until recently, was the group — and six websites so unrelated that Google's knowledge panel once confidently merged two of them into a restaurant that doesn't exist.

The group's operations director described the ambition in one line: "I want someone to book any of our rooms in under a minute, and I want each site to feel like the room." Six personalities, one spine. Here is how we built it. The figures below are illustrative — but the architecture, and the arguments we had along the way, are precisely as they happened.

## The challenge

Multi-venue hospitality groups face a fork every few years: one templated platform that sandpapers every venue into the same beige, or six independent sites that cost six times to build, maintain and keep secure. Coriander had accidentally chosen a third, worse option — six sites, built by four different vendors across eight years, sharing nothing but neglect. Three had no online reservations. Gift cards were sold over the phone, manually, at one venue, during office hours, because of course they were.

The problems in priority order:

**Brand soup at the group level, brand absence at the venue level.** The Collective's own site existed mainly to list its venues; the venues' sites varied from "brochure with misaligned PDF menu" to "just an Instagram link". Guests loyal to the taverna had no idea the omakase was family.

**Reservation chaos.** Four venues on a marketplace that owned the guest relationship and charged per-cover fees; two on a shared Gmail inbox. There was no cross-venue view of capacity — the taverna could be turning away walk-ins while the wine bar sat half-empty three suburbs away, and nobody would know until the morning report.

**Gift cards: the lost goldmine.** Hospitality gift cards are the highest-margin product in the building, and Coriander sold them by telephone. The group's own rough guess at foregone revenue was "a lot".

The constraint that made it interesting: each venue's manager — all six of them, all opinionated, all correct about their own room — had veto power over anything that made their venue feel corporate.

## The approach

**Themability as the founding principle, not a skin.** We built one component library and one content platform, then designed six themes as data. Every visual variable — palette, type pairing, texture treatment, photography recipe, even the corner radius (the taverna gets generous rounds; the omakase gets none) — is a token, and a venue is a token set. Components are drawn from the same accessible primitives, so when we fixed focus states we fixed them six times at once. This is the [design-tokens-as-API pipeline](/journal/engineering/design-tokens-pipeline) we use everywhere, pushed until it carried an entire brand architecture: tokens don't just keep one brand consistent, they keep six brands *honestly different* without forking code.

Each venue got its own art direction sprint — a day in the room itself, camera and notebook — and the directions are genuinely distinct: the omakase site is near-monochrome with a single red accent; the kafeneion is Aegean blue and sun-bleached cream; the barbecue institution runs on generational family photography and gold. A visitor clicking between them would never detect the shared skeleton. A developer absolutely would.

**One reservation spine, visible everywhere.** Every venue's site books through one availability service — a small Node service over Postgres holding the table maps, sitting plans and pacing rules for all six rooms. The group-level site got the killer feature: "Where can we eat tonight?" Enter a party size and a time, and see live availability across the whole Collective. Roughly a fifth of group-site bookings now land at a venue the guest hadn't originally searched for. That's not a booking widget — that's the group behaving like a group for the first time.

**Gift cards as a first-class storefront.** We built a proper little e-commerce flow: beautifully designed digital cards, per-venue or group-wide, scheduled delivery, balances that (with a Stripe integration and some careful ledger work) redeem at any room. Gift-buying is its own psychology — the buyer isn't the guest, and the design has to make a stranger feel generous rather than transactional, a distinction we explore in [designing for the gift buyer](/journal/ecommerce/gift-buying-ux). Christmas 2024 arrived two months after launch. The timing was not an accident.

**Menus as structured content, finally.** One Sanity studio, six venues, dishes modelled with dietary tags and wine-pairing notes. Venue managers edit their own menus from a phone; nobody outside a venue can accidentally (or otherwise) reprice its lamb.

## The outcome

Twelve months of illustrative results:

- **Reservation completion up 34%** across the group, with abandonment now measured per-venue per-service and argued about at ops meetings — the good kind of argument.
- **Group gift-card revenue up 5x** in year one, from "telephone, office hours" to a storefront that sold most strongly at 10pm on December 23rd, when all six dining rooms were closed.
- **Direct bookings at 78%** of total covers, up from 41%, as the marketplace was repositioned from default to discovery channel.
- **Cross-venue discovery: 19%** of bookings on the group site choose a venue other than the one searched — the wine bar owes the taverna several hundred covers and counting.
- **One platform fee, six personalities.** Hosting, security and CMS costs consolidated to roughly what two of the old six sites used to cost — and a new venue onboarding is now measured in weeks, not procurement cycles.

The sibling study to this one is [Wattle & Daub](/work/wattle-and-daub-reservations), where we took a single dining room through the same direct-booking philosophy. And if you're weighing up a multi-brand platform of your own, the honest version of what it costs and how the engagement shapes up lives on [our pricing page](/pricing); the brand-system thinking behind six-brands-one-spine is what our [identity practice](/services/brand-identity) does on purpose rather than by accident.

## What we'd tell any hospitality group

Don't unify the look; unify the spine. Tokens let six rooms stay six rooms while sharing reservations, content and code. Get gift cards online before Christmas — any Christmas. And the most valuable page a restaurant group can own is the one that answers "where can we eat tonight?" across every room it runs.
