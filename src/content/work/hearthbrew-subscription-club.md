---
title: "Hearthbrew: the subscription club that retained like a magazine"
description: "A specialty coffee roaster's subscription club rebuilt around skip-when-you're-ahead honesty and packaging-as-content. How churn fell without a single retention trick."
slug: hearthbrew-subscription-club
cluster: work
tags:
  - E-commerce
  - Subscriptions
  - Retention
  - Food & drink
date: 2026-02-12
author: Tomás Reyes
keywords:
  - coffee subscription case study
  - retention design
  - churn reduction
  - dtc subscriptions
readingTime: 9
demo: hearthbrew-store
heroImage: /images/work/hearthbrew-subscription-club.jpg
heroAlt: "A kraft coffee bag, riso-printed field-notes card and a cup of filter coffee on a roastery benchtop in warm morning light"
client: Hearthbrew Coffee
industry: Retail & Food
services:
  - E-commerce
  - Product design & engineering
  - Growth
year: 2025
stack:
  - React
  - TypeScript
  - Shopify Hydrogen
  - Sanity
  - Node
  - Postgres
demo: hearthbrew-store
---

Hearthbrew Coffee roasts in Brunswick, Melbourne, three days a week, and their café on-site has a line every Saturday morning. We'll drink to that. In 2023 they launched a subscription club with the standard toolkit: 15% off lock-in, upsell emails, a delete account flow that required phoning a person with a clipboard, and — when customers cancelled anyway — an exit survey too generic to read.

By late 2024 the club was the business's most reliable revenue line and quietly its least healthy. Cohort retention sat at 51% after nine deliveries. Support tickets crawled with themes like "did the next one ship yet?" and "how do I skip this one?" — the boring chores the shop should have answered before a person had to ask.

Hearthbrew's brief was short, and we liked it immediately: *"Make it work like a library card, not a timeshare."*

## The challenge

The five-minute crisis of subscription commerce is exactly this: retention engineering and retention design have diverged. Retention engineering locks the customer in; retention design gives them reasons to stay, and it loses CFO meetings whenever monthly numbers get tight.

Digging into the club's data and the cancellation interviews surfaced what we now think of as churn's three honest causes:

- **Inventory guilt.** Coffee arrives before the kitchen runs out. The customer feels they own a deadline.
- **Drift.** A four-week cadence stopped matching the customer's household months ago. Nobody said anything.
- **Ambient curiosity.** Some people cancel not because they dislike the product but to find out if they miss it. Anyone with magazine subscription muscle memory knows this pattern.

None of these are fixed by a 20% discount on the way out the door. Hearthbrew's problem wasn't retention; it was that the product couldn't flex as the customer's life did. The toolkit it shipped with was built for the roaster's cash flow, not the subscriber's kitchen.

## Approach

**Control panel before hero shots.** The subscriber's home page is a one-screen control panel now: next delivery date, wait-list ability to move it, bag size, grind, skip button, everything undoable. To pause indefinitely is a single toggle, not a "did you mean: different frequency?" confession box. We borrowed the mental model directly from good banking apps — customers deserve quiet control over their own recurring commitments — and carried across the pattern from our [Northwind Ledger dashboard work](/work/northwind-ledger-dashboard-rebuild), where a single dense screen beats a maze of tabs every time.

**Skip-and-resume as first-class features.** In the rebuilt flow, the "skip" button is displayed beside "manage" with equal prominence. The email that lands seven days before the next shipment asks exactly one question: *"Ready for the next one?"* Three buttons: ship it now, ship next week, skip this one. The honest outcome, from cohort data: people who regularly skip stay subscribed longer than people who never get asked. The churn curve flattens where the choice lives.

**Packaging as editorial.** A kilo of coffee is a fortnight of commitment. We helped Hearthbrew package that fortnight as content, not advertising: each delivery includes a riso-printed card with the roaster's field notes from origin, a grind guide calibrated to the batch, and a link to a members' page for the farm profile. The club landed back in the "magazine subscription" pattern Hearthbrew's founders understood instinctively — an artefact that earns its room on the benchtop. We've argued before that the physical artefact is the strongest retention mechanic in DTC; properly used, a printed card does more than six lifecycle emails.

**Churn diagnostics with actual teeth.** When someone cancels — cancellation remains one click, on every management screen, and always will — we ask a two-tap reason, wired into a real review with the roastery. Every other month, Hearthbrew sits down with it. A pattern such as "I'm drinking more filter at the office now" turned into a work-bench delivery option. The roastery reads the exits like an editor reads unsubscribe letters.

**Measurement that doesn't flatter.** The old dashboard opened with subscriber count, a carefully accidental vanity metric. The new one opens next to three things: nine-delivery cohort retention, active-with-paused share, and mean time to "pause" — three signals of whether the member club's contract is being honoured, not just its topline. Our growth practice explores the same ideas in the journal in the long guide to [subscription retention without dark patterns](/journal/growth/subscription-retention-honest-design), from which the design heuristics above descend.

## The outcome

The rebuilt club went live in mid-2025. Illustrative outcomes from the first two full quarters:

- **Nine-delivery cohort retention:** from 51% to 74%. Range matters here: honest control typically moves this number by high-teens points, and ours landed well within it.
- **Support tickets from subscribers:** down 46%, cross-referenced against a baseline of pre-launch months. Nearly all of the drop came from the "ship yet / skip it" class of chore ticket.
- **Pause usage as a signal:** 41% of subscribers paused at least once in their first two quarters. Of those pausers, 82% were still subscribed after nine deliveries — validating the central bet that pausing is a form of commitment.
- **Organic substitution:** the members' site became a content channel in its own right; the farm profiles rank for "where does X coffee come from" queries Hearthbrew never advertised on. The editorial surface of the club generates approximately a third of new sign-ups.

"It felt mad on paper," says roaster-director Mai Trent, "putting 'skip' as big as 'manage.' Then we sat with the numbers and skipped months stopped being bad news. They were the customer saying: I'm still here, just not this week."

## What we'd tell other subscription brands

Count the honest causes of churn before commissioning a retention discount. Build control panels better than your bounce-back offers. Treat paused membership as loyalty, not churn debt. And finally, if the product arrives at someone's door on a rhythm, treat the box as editorial — properly designed content outlives cartridge-based discounts by years.

You can see the club live in the [Hearthbrew case study files](/work) or browse our [other e-commerce work](/work). If your subscription is held together by a coupon stack, [we'd rather help you rebuild it](/contact).
