---
title: "Bundles and kits: designing the build-your-own moment"
description: "The bundle builder as interface design: shelf metaphors, fill visuals, flat pricing, coupled inventory — and when a kit makes the product disappear."
slug: bundles-and-kits-design
cluster: ecommerce
tags: [ecommerce, merchandising, interaction design, bundles, ux patterns]
date: 2026-02-10
author: June Okafor
keywords: [product bundles, bundle builder, ecommerce AOV, kit design, build your own box UX]
readingTime: 9
---

There's a moment in every bundle builder where the customer stops shopping and starts *composing*. The shelf stops being a catalogue and becomes a palette; the box they're filling becomes theirs. Designed well, that moment is the highest-pleasure interaction in e-commerce — half gift-wrapping, half pick-and-mix. Designed badly, it's an inventory form with a progress bar, and it converts like one.

We wrote about the [merchandising logic of bundles](/journal/ecommerce/bundles-kits-merchandising) — why they lift AOV, when curated beats build-your-own, how to price them. This article is the other half: the interface craft of the build-your-own moment itself. The metaphors, the fill visual, the pricing display, and the inventory coupling that decides whether your beautiful builder survives contact with a warehouse.

## Choose your metaphor before your components

Every bundle builder is one of three metaphors wearing a UI. Choose consciously; the metaphor dictates everything downstream.

**The shelf** — items sit on a faced shelf, and the customer picks them into an invisible container. It's the best metaphor for consumables (coffee, snacks, skincare) where browsing *is* the pleasure. [Hearthbrew's storefront](/lab/hearthbrew-store) works this way: you browse the roasts as if at a counter, and the box tallies quietly. The shelf's risk is that the container feels abstract — solved by the fill visual, below.

**The slots** — the bundle is a literal row of empty slots: pick something for slot one, then slot two. It's the right metaphor for *structured* kits — a skincare routine (cleanser, toner, moisturiser), a meal plan (two mains, two sides) — where the kit has grammar. Slots teach the structure of the product line, which is why they also educate: a customer who built a routine understands your catalogue afterwards.

**The gift box** — a persistent visual of the assembled box fills as you choose. It's the right metaphor when the bundle *is* the product (gifting, hampers, starter sets) and the pleasure is watching it become real. It's also the most expensive to build well, because the visual has to be genuinely gorgeous — a crude rectangle with thumbnails reads as a spreadsheet that grew a picture.

The wrongness matrix is simple: shelf metaphor with slot instructions, or slot grammar presented as a free-for-all shelf. When a builder feels confusing in testing, the bug is almost always a mixed metaphor, not a bad component.

## The fill visual is the persuasion engine

However you frame it, the customer needs to see the *shape of the outcome* — how full their box is, what's in it, what it's becoming. This is the same principle as the [cart-as-negotiation](/journal/ecommerce/cart-design-patterns) pattern: show the deal taking shape, not the arithmetic behind it.

What works, in order of impact:

1. **A persistent fill state.** A counter alone ("2 of 4 chosen") is the minimum viable version and it's honestly not bad. A visual fill — a box outline populating, a shelf assembling, a progress ring — is better, because completion is felt, not read. The fill visual should be visible from every scroll position: sticky tray on mobile, sidebar on desktop.
2. **The chosen items stay visible.** Line items with thumbnails, one tap to remove. The customer's own face in the mirror is the best salesperson; a customer looking at *their* picks talks themselves into the purchase.
3. **Completion is a small ceremony.** When the last slot fills, something should happen — the buy button ignites, the box closes, a line of copy changes from "choose 2 more" to "that's a beautiful box". One beat of celebration, not a confetti cannon. The transition from *composing* to *committing* is the emotional pivot of the whole pattern, and it deserves craft.

## Pricing display: flat price, anchor once, never itemise

The interactions of money inside a builder are where good intentions go to die. The rules:

- **One flat bundle price.** Not per-slot pricing. The moment customers start optimising which item occupies which slot's price, you've built an optimisation puzzle, and the answer to an optimisation puzzle is usually "close the tab". The flat price is the contract: curate within the price, don't audit it.
- **State the saving once, in the buy box.** "Worth $96 — the kit is $78." Then let the rest of the page sell the theme. Repeating per-item savings invites comparison-shopping; the [merchandising piece](/journal/ecommerce/bundles-kits-merchandising) covers the anchoring psychology in detail.
- **Handle constrained items structurally, not financially.** If one premium candle would break a flat-price four-candle kit, the answer is a rule ("pick up to one from the reserve shelf") rendered in the interface — a tagged group with its own small counter — not a surcharge line-item. Rules preserve the fiction of the gift; surcharges expose the accounting.

## Inventory coupling: where builders go to die

Here's the engineering truth that reshapes the design: **a kit's availability is the minimum of its components.** If your "Weeknight Set" contains five SKUs and one is out of stock, the kit is out of stock — unless you've designed the coupling deliberately.

The options, honest versions only:

- **Hard coupling.** If any component is out of stock, the kit is unavailable, and the page says which item and when it's back. Correct for tightly themed kits where substitution destroys the point. Absence handled with the [honest inventory patterns](/journal/ecommerce/honest-inventory-ux): dates, notify-me, alternatives.
- **Soft coupling with swap.** The kit is available, and the out-of-stock component is flagged with a offered substitute. Fine for BYO; dangerous for curated kits, where "the brand chose these four" is the entire promise. A curated kit that silently swaps its own contents is a lie with a bow on it.
- **Virtual stock.** The kit is real inventory — pre-assembled boxes in the warehouse. Best UX, most ops cost, absolutely right for hero kits at volume. If a kit is 30% of your revenue, it deserves shelf space, not database arithmetic.

Choose per kit, and design the PDP so the coupling is legible: if component stock is what governs availability, show component stock. A customer who discovers a missing item at checkout trusted you twice and is leaving once.

## When bundles hide the product

Now the case against ourselves, because it's real: bundles can *hide* the product.

Every item placed inside a kit is an item that stops being browsable as itself — its photography, its story, its page. A catalogue made of bundles is a shop where everything is pre-wrapped: efficient, and airless. The failure signs are measurable: PDP traffic on component SKUs cratering, search entrances landing on kits and bouncing (the searcher wanted *the coffee*, not *a system*), returning customers unable to reorder the one thing they loved without re-buying the set.

The design fixes:

- **Components remain first-class products.** Every item in a kit has its own PDP, and the kit links to them. The kit is a lens on the catalogue, never a wall around it.
- **"Loved one part? Buy it again."** Post-purchase, surface component reorder links. The [Fernleigh Wines cellar club](/work/fernleigh-wines-dtc-storefront) does this elegantly — the discovery pack's whole job is to audition the single bottles you'll reorder directly.
- **Kits earn their shelf by test, not by hope.** A kit that doesn't convert newcomer's first sessions better than the plain catalogue gets retired. We test this with the same discipline as any [CRO experiment](/journal/growth/cro-experiment-design): pre-registered metrics, real windows, kill criteria.

## Mobile: the builder's final exam

Everything above is harder at 375px, and most bundle shopping is mobile now. The mobile rules are the desktop rules with the screws tightened: the fill visual becomes a sticky bottom tray that never blocks the shelf; selection is one tap (a second tap on a chosen item opens detail — never the reverse); and the shelf scrolls in the product's photography, because browsing is the pleasure and chrome is the tax. If your builder needs a landscape orientation or a pinch, you haven't built a mobile builder, you've built a desktop builder that tolerates phones.

## Key takeaways

- Pick one metaphor — shelf, slots or gift box — and let it govern the whole builder. Confused builders are mixed metaphors, not bad components.
- The fill visual is the persuasion engine: persistent, visual, and with a small ceremony at completion.
- Flat price, saving stated once, constraints rendered as rules — never per-slot accounting.
- Inventory coupling is a design decision: hard-coupled, soft-coupled or virtual stock, chosen per kit and shown honestly.
- Components must stay first-class products. A catalogue of only kits is a shop where everything's pre-wrapped.
- On mobile, the tray is sticky, selection is one tap, and the photography does the talking.

## FAQ

**Should the builder be a dedicated page or part of the PDP?** Dedicated page for BYO — it needs a browsing surface, and the [PDP's job](/journal/ecommerce/pdp-design-conversion) is single-item conviction. Curated kits, by contrast, are just products: photograph them as one thing, give them a PDP, done. The builder's URL also earns its own search and campaign entrances; a PDP tab can't do that.

**How many choices before completion rate collapses?** Our rule of thumb from usability work: four to six selections, four to nine candidates per selection. Beyond that, completion rate falls off a shelf of its own. If your bundle needs twelve picks, it's two bundles.

**Do bundle discounts devalue the brand?** Unthemed discounts do; themed kits don't. A kit priced as a coherent gift reads as generosity; a kit priced as a clearance mechanism reads as desperation, and customers can smell the difference at twenty paces. Theme first, then price.

**What about subscription bundles?** The strongest form: a BYO kit on a cadence, with per-delivery swaps. It inherits all the portal design problems — skip, reschedule, honest dunning — that we walk through in the [subscription portal piece](/journal/ecommerce/subscription-portal-design), plus the coupling problems above. Build the portal honestly and the bundle is the easiest recurring revenue you'll ever explain to a CFO. If that sounds like your roadmap, our [e-commerce team](/services/ecommerce) has the schematics.
