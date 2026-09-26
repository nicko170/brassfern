---
title: "Saltbush Collective: a marketplace for food with a postcode"
description: "A two-sided marketplace connecting regenerative farms to city buyers. We built producer storefronts, seasonal availability and a checkout tuned for mixed baskets."
slug: saltbush-collective-marketplace
cluster: work
tags:
  - Marketplace
  - E-commerce
  - Checkout
  - Food & drink
date: 2025-05-14
author: Nate Sullivan
keywords:
  - marketplace case study
  - food ecommerce ux
  - checkout design
  - two-sided marketplace
  - farm to table platform
readingTime: 10
client: Saltbush Collective
industry: Retail & e-commerce
services:
  - E-commerce
  - Product design & engineering
year: 2025
stack:
  - React
  - TypeScript
  - Headless commerce
  - Node
  - Postgres
---

Saltbush Collective started as a spreadsheet. A handful of regenerative farms within two hours of Melbourne — a rare-breed pig farmer near Ballarat, a market garden on the Mornington Peninsula, a dairy doing pasture-fed cheese — coordinating orders for a few hundred city households who cared where food came from. The spreadsheet worked until it didn't: order cutoffs lost in email threads, three farms selling out while a fourth sat on a winter glut, and a founder spending twenty hours a week being a human router.

When they came to us, the ask was "a website." The real brief, after a week of discovery calls with farmers and buyers, was sharper: **become a marketplace without becoming a middleman.** The farmers needed to keep their names, their prices and their margins. The buyers needed one basket, one delivery window, and a reason to trust vegetables they'd never tasted from a farm they'd never visited.

## The challenge

Two-sided marketplaces have a geometry problem: every decision must work for both sides at once, and the design defaults borrowed from single-seller e-commerce break immediately.

- **Mixed baskets are a checkout nightmare.** A buyer's week might include pork, cheese, citrus and seedlings from four farms with four different harvest schedules, cutoffs and delivery routes. Standard cart logic assumes one warehouse.
- **Availability is seasonal, not stock-counted.** Farms don't have "inventory"; they have a harvest calendar and the weather's opinion. "Out of stock" is the wrong concept for something that is *between seasons* — it reads as failure instead of ecology.
- **Trust must be earned per-producer.** Buyers were loyal to farmers, not to the Saltbush brand. Hiding the farms behind a unified catalogue — the classic marketplace move — would have destroyed the entire value proposition.
- **The founders feared becoming Uber for carrots.** Fees, deadlines and dashboards designed for the platform rather than the producer would have emptied the supply side within a season. Farmers leave quietly and take their regulars with them.

## Approach

**Producer storefronts, first-class.** Every farm gets a real storefront — its own photography direction, its "how we farm" story, its own seasonal calendar — and every product card in the marketplace carries the farm's name in the same weight as the product's. The search results group by farm before they group by category. It's the digital version of a good farmers' market: stalls, not shelves. We took the taxonomy problem seriously throughout; the reasoning echoes our long piece on [taxonomy as the store](/journal/ecommerce/ecommerce-navigation-taxonomy), where finding is a designed act, not an index of SKUs.

**Seasonal availability as a story, not an error state.** We replaced stock language with a season grammar: *in season now*, *back in June*, *last boxes this week*. Products out of season don't 404 — they show the farm's calendar and a "remind me when the blood oranges are back" button, which became Saltbush's single biggest email-capture mechanism. The grammar does quiet educational work too: buyers learn to cook with the season because the interface keeps telling them there is one.

**One basket, four fulfilments — with the seams visible.** The checkout is where the marketplace either wins or collapses, so we prototyped it first. A buyer checks out once; Saltbush splits the order into per-farm fulfilments behind the scenes, each with its own cutoff and harvest day. The seams that *do* surface are deliberate: the delivery step shows "Thursday: Peninsula Organics + Hart Dairy; Saturday: Ballarat Pork Co." — buyers forgive split delivery when it's explained as *freshness*, and they resent it when it's explained as *logistics*. Cutoff countdowns sit on each farm's section of the cart, honest and unmanipulated — countdowns that mean something are serviceable; countdowns that don't are theatre. Our [checkout friction audit](/journal/ecommerce/checkout-friction-audit) covers the forty checks we ran this flow against before a single line shipped.

**Fulfilment cadence as the delivery promise.** Rather than promising "delivery in 2–4 days" — meaningless when the pig is processed on Tuesdays — the delivery picker offers suburb-level windows tied to each farm's actual route. Enter a postcode, see "your street: Thursday and Saturday drops." It's the openness we applied to [Fernleigh Wines' DTC storefront](/work/fernleigh-wines-dtc-storefront): tell the customer the true operational story and let them plan around it. The post-purchase email shows the order's journey farm by farm, which turned out to be the most-forwarded email Saltbush sends.

**Art direction: print-catalogue warmth.** Saltbush's brand is earthy without being rustic-costume: cream paper, deep soil inks, a type system that reads like a really good printed produce catalogue, and photography briefs that demanded dirt under the fingernails. No farm-to-table clichés, no leaves arranged on slate. The whole direction was stress-tested against accessibility — contrast on cream is unforgiving — and passes AA throughout, consistent with our [e-commerce practice](/services/ecommerce) standards.

## The outcome

The platform launched in March 2025 with eleven farms and a waitlist of forty more. Illustrative first-year numbers, shared with Saltbush's blessing:

- **Repeat purchase rate:** 52% of buyers placed a second order within 90 days — the healthiest retention signal a grocery-adjacent marketplace can show, and the number that de-risked adding ten more farms.
- **Average basket:** up $14 versus the spreadsheet era, driven almost entirely by cross-farm bundling at checkout ("your Thursday drop has room for the cheese").
- **Producer retention:** zero farms churned in the first year. The most-cited reason in farmer interviews: order summaries arrive as a clean pick list the night before harvest, replacing the email archaeology. Software that respects a 4am start earns loyalty that no revenue share can buy.
- **"Remind me" captures:** 6,300 sign-ups on out-of-season products — a pre-committed demand list Saltbush now uses when onboarding new farms. The citrus grower who joined in winter launched to 400 waiting buyers.
- **Support burden on the founder:** order-routing emails effectively eliminated; the founder's Sunday is hers again, which she listed as the engagement's primary KPI and we have chosen to believe.

The most telling artefact came from a buyer survey. Asked why they stayed, the modal answer wasn't price or convenience. It was: *"I know my pork comes from Claire."* The marketplace's job was never to be loved. It was to stay out of the way of people who love the farms.

## What we'd tell other marketplace founders

Aggregating supply is the easy half; the hard half is using the platform's leverage to make every producer *more* visible, not less. Design the checkout around your fulfilment truth, make seasonality a feature with a grammar, and treat each seller's name as brand equity you're borrowing, not noise you're filtering. If you're weighing up a marketplace against going it alone, our piece on [running the real numbers](/journal/ecommerce/marketplace-vs-owned-storefront) is the honest starting point — and the [pricing page](/pricing) shows how an engagement like this one is usually shaped.
