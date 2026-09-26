---
title: "Bundles and kits: merchandising beyond the single SKU"
description: "Bundles and kits done properly: curated vs build-your-own, pricing psychology, inventory implications, PDP architecture, and subscription bundle design."
slug: bundles-kits-merchandising
cluster: ecommerce
tags: [ecommerce, merchandising, bundles, pricing, pdp]
date: 2026-01-15
author: Sam Whitfield
keywords: [product bundles ecommerce, kit merchandising, build a box ux, bundle pricing strategy]
readingTime: 8
---

The single SKU page is e-commerce's default unit of thought, and quietly its most limiting one. A bundle reframes the purchase from "which one of these do I want?" to "how much of this good thing do I get?" — and that reframing raises average order value, simplifies decisions, and moves inventory the single-SKU page can't touch. Done lazily, though, bundles are clutter: a discount sticker on a headache.

Here's how we design bundle programs in our [e-commerce work](/services/ecommerce) — the merchandising logic, the pricing psychology, the inventory reality, and the page architecture that makes a kit feel like a gift rather than a multipack.

## Why bundles work (when they work)

Three honest mechanisms, no mysticism:

1. **Decision simplification.** A curated kit collapses a four-SKU research project into a single confident choice. This is strongest for newcomers — the "starter set" exists precisely because category natives don't need it.
2. **AOV lift at flat acquisition cost.** If it costs you $14 to acquire a visit, a $78 bundle converts at roughly the same rate as a $52 single item only when the bundle's value story is legible at a glance. When it is, contribution per acquired visit jumps.
3. **Margin shaping.** Bundles let you pair a hero SKU everyone price-compares with high-margin companions nobody does. The customer remembers the discount; the spreadsheet remembers the mix.

A fourth claimed mechanism — "people love deals" — is mostly false. People love *legible* value. An incoherent grab-bag at 20% off converts worse than a coherent kit at 12%. The theme is the deal.

## Curated kits vs build-your-own

This is the first fork, and it changes everything downstream.

**Curated kits** are fast to buy, cheap to build, and easy to merchandise: theme them by outcome ("The Weeknight Set", "Cold Brew for Sceptics"), photograph them as one hero image, and they're just another product page. Their weakness is taste variance — some buyers want three of the four items and bounce rather than accept the fourth.

**Build-your-own (BYO)** fixes taste variance at the price of friction. Every choice you add is a chance to stall. The designs that work:

- **Constrain ruthlessly.** Pick 4 from 9, not anything from 60. A faced shelf with a fill counter ("2 of 4 chosen") beats a catalogue with an empty box icon.
- **Price invisibly.** One flat bundle price, not per-item maths. The moment buyers start optimising individual slot prices, you've built a spreadsheet, not a gift.
- **Show the box filling.** A persistent visual of the assembled kit — not a line-item list — is the single highest-impact BYO pattern we've tested. It's the same persuasion logic as the [cart as negotiation](/journal/ecommerce/cart-design-patterns): show the shape of the outcome, not the accounting.

Rule of thumb: if buyers are mostly newcomers or gifters, curate. If your category has strong personal preference (coffee, fragrance, snacks, colour) and a returning audience, BYO earns its complexity. Many stores should run both: curated kits as the front door, BYO for the committed.

## Pricing psychology that isn't gross

Three patterns worth using; one worth avoiding.

- **Anchor on the sum, not the saving.** "Worth $96 — yours for $78" beats "18% off" because the anchor is concrete. Percentages are abstract; dollars are felt.
- **One saving number, said once.** Repeating the discount on every line item trains customers to price-check components on Google and erodes the kit's spell. State the deal in the buy box; let the rest of the page sell the theme.
- **The decoy bundle.** Three tiers — a modest kit, the target kit, and a premium one — pull buyers to the middle far more reliably than any single offer. The premium tier exists substantially to make the middle look sensible. Classic, and it still works when the tiers are genuinely differentiated, not just padded.
- **Avoid: manufactured scarcity + fake strikethroughs.** Dark-pattern anchoring ("was $150!" when nothing was ever $150) trades quarter-one conversion for year-two trust. The customer acquisition maths of your owned store depends on repeat purchase; don't burn the asset to spike the metric. Our [CRO experiment design](/journal/growth/cro-experiment-design) piece covers how to test pricing honest variants properly.

## Inventory: the part everyone forgets

Bundles are where merchandising meets the warehouse, and the meeting is often ugly. Two architecture choices:

**Virtual bundles** (the bundle is a pricing rule over existing SKUs; the 3PL picks components) are flexible — any component can sell standalone, and stock never strands. They need inventory logic that decrements correctly across channels and kills the bundle when one component stocks out. For most SMB stacks this is the right default.

**Pre-kitted bundles** (physically boxed) ship faster, photograph better, and enable gifting presentation that virtual bundles can't — tissue, a card, a real box. They also create a third inventory pool that can strand (you're long the kit, short the components). Reserve pre-kitting for proven, stable bundles; pilot everything else virtually.

Also honest: bundles complicate returns. Decide the policy before launch — full-bundle-only returns are cleanest; partial-bundle returns create refund arithmetic your support team will hate you for.

## PDP architecture for bundles

A bundle page is not a product page with more stuff in it. The [PDP sequencing rules](/journal/ecommerce/pdp-design-conversion) apply, plus three bundle-specific moves:

1. **The kit hero is the kit.** Photograph the assembled bundle as one image first — the "what arrives" fantasy — before any component galleries. Buyers commit to the kit emotionally, then audit the components rationally. Order matters.
2. **Components as a tasteful index, not a product grid.** Name each component with a one-line role ("the one that converts sceptics"), with tap-to-expand detail. Don't link out to six full PDPs mid-purchase; that's an exit ramp placed inside your own funnel.
3. **Variant logic stays shallow.** If every component needs its own size/colour variant, the page becomes a configurator. Constrain variants at the bundle level or you'll rebuild the Osprey-style [configurator problem](/work/osprey-outdoor-configurator-launch) by accident.

## Subscription bundles: the compounding case

The strongest bundle play is the recurring one. A one-off kit raises AOV; a subscription kit raises lifetime value and smooths inventory. The design principles live in [subscription UX that retains](/journal/ecommerce/subscription-ux-design) — swap-and-skip controls, honest cancellation — but bundles add one twist: **rotate the content, keep the theme.** The [Hearthbrew subscription club](/work/hearthbrew-subscription-club) retained like a magazine precisely because each delivery was a surprise inside a promise: always coffee, never the same coffee. Predictable theme, variable payload. Boredom and chaos both churn; the space between them retains.

## Modelling the uplift honestly

Before launch, model with deliberately conservative assumptions and make them visible to the client (illustrative starting points, not promises):

- Bundle attach rate: 8–15% of category sessions for curated kits with dedicated PDP traffic.
- AOV lift: +25–40% on bundle orders vs single-item median.
- Conversion rate on the bundle PDP: assume *below* your hero SKU page first-pass; novelty traffic inflates early reads.
- Cannibalisation: 20–30% of bundle revenue replaced purchases that would have happened anyway. Model the increment, not the gross.

Run the bundle PDP against the status quo as a real experiment, four weeks minimum, before rolling the format catalogue-wide.

## Key takeaways

- Bundles raise AOV and simplify decisions when the theme is legible; the theme is the deal.
- Curate for newcomers and gifters; build-your-own for preference-heavy categories — and constrain BYO ruthlessly.
- Anchor prices on the summed value, state the saving once, and use a three-tier decoy honestly.
- Choose virtual vs pre-kitted inventory on flexibility vs gifting presentation; set the returns policy pre-launch.
- Kit PDPs need a kit-first hero, component index (not grid), and shallow variant logic.
- Subscription bundles compound: fixed theme, rotating payload.

## FAQ

**How much should a bundle discount be?** Commonly 10–18% off component sum. Deeper discounts attract deal-hunters who never repeat; shallower ones fail the legibility test. Test within the band; don't chase the marketplace's 30%-off grammar.

**Should bundles get their own collection and nav entry?** Yes if you have three or more — "Kits" or "Sets" is a genuinely useful category for gifters and newcomers, the two audiences bundles serve best.

**Can bundles fix slow-moving stock?** Carefully. Pairing dead stock with a hero SKU works once or twice. Pattern-recognising customers will decode it as a clearance mechanism and your kit framing decays into a bargain bin.

**Build in-house or use bundle tooling?** Start with your platform's native bundle features or a well-reviewed app while validating; invest in custom merchandising logic once the format has proven retention. [Merchandising the digital shelf](/journal/ecommerce/merchandising-digital-shelves) covers the broader collection-level thinking.
