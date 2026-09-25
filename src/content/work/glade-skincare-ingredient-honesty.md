---
title: "GLADE: skincare e-commerce with nothing to hide"
description: "A skincare brand led with evidence instead of glow-washed photography. How ingredient transparency UX and honest PDPs changed what loyalty looks like."
slug: glade-skincare-ingredient-honesty
cluster: work
tags:
  - E-commerce
  - Beauty
  - UX design
  - Accessibility
date: 2024-11-05
author: "Priya Raghunathan, Principal Strategist"
keywords:
  - skincare ecommerce case study
  - ingredient transparency
  - pdp design
  - subscription ux
readingTime: 9
client: GLADE
industry: Beauty & Wellness
services:
  - E-commerce
  - Product design & engineering
  - Growth
year: 2024
stack:
  - React
  - TypeScript
  - Shopify Hydrogen
  - Sanity
  - Node
  - Postgres
---

GLADE is a Melbourne skincare label founded by two cosmetic chemists who were tired of their industry. Skincare marketing runs on a familiar conspiracy: photography retouched past biology, ingredient lists written in Latin to discourage reading, and star ingredients present in quantities homeopaths would consider conservative. GLADE's founders made products they supplied to dermatology clinics, with full formula disclosures. Their website, though, had been built by a friend in a weekend, and it sold a serious product with the visual language of a supermarket supplement.

Their brief to us contained a single non-negotiable sentence: "Nothing on the site can claim something the formula doesn't do at the concentration it's at." A brand strategy wearing a lab coat. Wonderful.

## The challenge

We audited how GLADE's existing visitors shopped, and the data told a consistent story. Product pages had short visits and high exit rates. Support inboxes carried long, careful questions — "is the 2% niacinamide buffered?", "what's the INCI name for the emulsifier?" — from a well-read audience that the site couldn't answer. The brand's real customers were ingredient literate, and the site addressed them like they were browsing for vibes.

Three design challenges:

- **Make evidence the hero.** Ingredient tables are, by convention, the thing you hide in an accordion. For GLADE's audience, the table was the pitch.
- **Serve two readers at once.** The dermatology-adjacent visitor wants INCI names, percentages and citations. The newer visitor wants to know if it's safe on rosacea. One PDP, two reading levels, zero condescension.
- **Make the tables accessible.** Real tables, on mobile, with screen-reader-friendly structure — the part every "clean beauty" mockup we've ever seen quietly fudges.

There was also a commercial wrinkle: GLADE was launching a subscription, "the Shelf", where the loyalty bet is that informed customers churn less. Everything above had to feed that bet.

## Approach

**The PDP is an open lab notebook.** Each product page opens with what the product does in one sentence, what it doesn't do in one sentence, and a "at a glance" band of actives with concentrations — visible without a scroll. Beneath, the full formula table: every ingredient, its purpose, its percentage band, and a plain-language gloss. Tap any row and you get a short note written by the formulators explaining the decision ("we cap this at 2% because above that it stings and the extra benefit is marketing"). This is the design pattern we think of as evidence-first merchandising — the variant our [e-commerce practice](/services/e-commerce) recommends whenever the product's strongest proof is its specification.

**A tiered reading experience.** We used progressive disclosure as a courtesy, not a hiding place. Glossy shoppers get claims and texture shots; a "read the science" layer sits one tap below with citations and formulation notes. Gesture and heading choice tested heavily with a panel of eight GLADE customers, including both dermatology nurses and loyalists who don't know an INCI from a PIN. Neither group had to wade through the other's material.

**Tables that work on a phone.** We built the ingredient table as a genuine HTML table with sticky row headers, horizontal scroll shadows, `caption` and `scope` attributes, and a generated plain-text long description for screen readers. Font sizes never run below 16px in the table body. Contrast holds at AAA except in one decorative band. We walked the whole PDP through NVDA and VoiceOver with an external accessibility auditor, which is standard on our builds — see our notes on [design-side WCAG practice](/journal/web-design/accessible-design-handoff).

**A subscription that respects the audience.** The Shelf holds a concise promise: annual refill plan, 10% off, swap products any time, skip when you're ahead, cancel on one screen with no phone call or "retention offer maze." GLADE's chemists also write a short "_formulation changes_" note that lists honestly when a reformulation changed a texture. In skincare this is nearly unheard of; in GLADE's support inbox it cut "did you change my moisturiser?" tickets by roughly a third.

**Photography with rules.** No retouched skin. Texture shots at actual macro scale on an honest range of skin tones, in unretouched daylight. Internal agreement: if you can't tell whether a photo is real, we didn't publish it.

## The outcome

Launched November 2024 with a marketing campaign neighbours described as "oddly unpanicked." Illustrative results from the first six months:

- **PDP engagement:** median time on product pages rose from 22 seconds to 71. Conversion from PDP view to basket rose from 1.9% to 3.4% — but more usefully, support questions shifted from "what does this contain?" to practicalities like shipping and dosing.
- **Ingredient table usage:** among purchasers, 62% had expanded at least one ingredient row pre-purchase. The table the industry hides became GLADE's best salesperson.
- **Subscription retention:** the Shelf's first-cohort retention at six months sat at 78%, versus a category benchmark we'd price around the mid-50s. Our internal hypothesis — disclosed formulation matches the kind of loyalty that reads the label — held up.
- **Refund rate:** fell 28% year on year, mainly from clearer "who this is not for" copy stopping mismatched purchases before they happened.

Co-founder Elise Ward put it plainly in our retro: "We assumed honesty would cost us some impulse buyers. It cost us the returns desk's week instead."

## What we'd tell other considered-purchase brands

If your product is genuinely well-made, your ingredient list is a marketing asset, not a legal obligation. Design for the expert and the newcomer as first-class readers of the same page. And treat refund reduction as a conversion feature: the customer you prevent from buying the wrong thing buys the right thing twice.

See more of our [e-commerce engagements](/work) or our take on [subscription design that retains like a magazine](/work/hearthbrew-subscription-club). If your product survives scrutiny, [we'd love to hear about it](/contact).
