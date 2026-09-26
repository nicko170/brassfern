---
title: "Osprey Outdoor: the pack configurator that cut support tickets"
description: "How a WebGL pack configurator with a hard 3D performance budget and a full 2D fallback cut sizing tickets and returns for an outdoor gear brand."
slug: osprey-outdoor-configurator-launch
cluster: work
tags: [3d configurator, e-commerce, webgl, performance, product customisation]
date: 2025-08-27
author: Felix Brandt
keywords: [3d configurator case study, product customisation, react three fiber, ecommerce ux, osprey outdoor]
readingTime: 8
heroImage: /images/work/osprey-outdoor-configurator-launch.jpg
heroAlt: "A forest-green hiking backpack with orange webbing floating against a dark charcoal background, faint wireframe lines suggesting a 3D configurator model"
client: Osprey Outdoor
industry: Retail & e-commerce
services: [E-commerce, Product design & engineering]
year: 2025
stack: [React, TypeScript, Three.js, React Three Fiber, Node, Postgres]
---

Osprey Outdoor (a fictional client in our concept portfolio — any resemblance to real pack makers is coincidental) sells serious hiking gear: packs, tents, and apparel for people who read weather charts the way others read horoscopes. Their packs are the flagship — engineered, adjustable, sized to your torso. And that last fact was quietly eating the business alive.

Their head of e-commerce, Sienna Kaur, opened the brief with a spreadsheet nobody argues with: packs were their most-viewed, most-returned product. The product page was lovely. The fit was a mystery. Customers bought the wrong volume, the wrong frame size, or both, and the support inbox answered the same four questions several hundred times a month.

## The challenge

Buying a pack online is a spec-sheet guessing game, and Osprey's PDP was particularly good at guessing.

**Fit is a body measurement, not a product attribute.** Pack sizing depends on torso length — C7 vertebra to iliac crest, if you want to sound like the gear heads — and almost nobody shopping online knows theirs. The PDP had a size chart in a PDF behind a link labelled "Sizing guide". Return reasons clustered around "felt wrong on my back" and "smaller than expected", which are fit failures wearing photography's clothes.

**Colourways were photography debt.** Twelve colour options per pack family, of which six had studio shots. Shoppers buying a colour they couldn't see were buying a promise, and promises get returned.

**Volume is unvisualisable.** "55 litres" means nothing to most people. Is that a weekend? A week? The question behind half the support tickets was really *"is this pack the right size for my trip?"* — and the PDP had no way to answer it experientially.

Meanwhile Osprey's marketing wanted the opposite of the support team: more PDPs embedded in more campaigns, affiliate links, and a configurator story to tell. They were asking us to build a 3D toy. We proposed building a *warranty* instead — a tool that makes the confident purchase.

## The approach

### 3D that earns its bytes

The configurator renders one hero model per pack family in React Three Fiber, with colourways as texture swaps rather than separate models — one geometry, many skins. That decision drove everything downstream:

- **A hard byte budget:** the 3D scene gets 1.6MB on first load (draco-compressed glTF, KTX2 textures), lazy-loaded *below* the fully working product page. The PDP is complete without WebGL; the configurator is a layer, not a dependency. If 3D fails or is blocked, nothing breaks — the page just doesn't get a toy.
- **Interaction before fidelity:** we cut polygon counts until orbiting stayed at 60fps on a five-year-old phone, then spent the remaining budget on the two details that matter for confidence — how the hip belt wraps, and how the volume reads as space. A physically perfect zipper nobody inspects is a polygon budget set on fire.
- **Motion as information:** the model idles only until first interaction, respects `prefers-reduced-motion` by defaulting to a static turntable-on-demand, and uses camera moves to *explain* — the sizing view dollies to the torso strap, the volume view explodes the compartments. No cinematic swooping. A configurator that performs for itself is a vanity ad; one that performs for the buyer is a sales rep.

### The fit guide is the product

The 3D was bait; the fit flow was the catch. We replaced the PDF with a measurement assistant: a two-minute guide that finds your C7 and iliac crest with photos, lets you measure against a doorway or a friendly human, and remembers the result. Fit state became first-class data — once measured, the configurator greys out frame sizes that don't suit you and *explains why* ("The S frame would ride below your hips at this torso length"). Explaining the negative is what turns a spec into advice.

Volume got its own translator: choosing 45L vs 65L shows an exploded visual with familiar anchors — "four days of winter kit", "a tent, sleeping bag, and the good coffee gear" — tuned per pack family with Osprey's guides, who argued happily about what fits. Copy-tested against real trip lists. When you disagree with the anchors, the configurator shows its working.

### Every configuration is a URL

Configuration state lives in the URL — pack family, colourway, frame size, torso fit, add-ons — so every customised pack is a shareable, bookmarkable, campaign-targetable page. Marketing got exactly what they wanted: affiliates embed pre-configured packs, the summer campaign linked straight into "mega-trail setups", and abandoned carts restore their configuration instead of a generic PDP. State-as-URL is a pattern we reach for constantly in [product work](/services/product) because it makes personalisation legible: no accounts, no cookies required, just an address bar you can trust.

Add-ons (hip-belt pockets, rain covers, the coffee-gear strap everyone at Osprey apparently wanted) live in the configuration, not a separate cross-sell modal. The price updates as you build. No surprises at checkout, which is the entire job of an [e-commerce experience](/services/ecommerce) in one sentence.

### Accessible, on a mountain profile

A 3D canvas is hostile territory for keyboards and screen readers, so we built the honest version of the fallback: the same configuration state drives a full 2D spec view — a rendered image of the current build plus a structured summary (pack, size, fit verdict, price) that a screen reader announces as it changes. Every 3D control has a keyboard-equivalent in the 2D view, and the canvas itself is `aria-hidden` decorative because *the state is the truth, not the pixels.* This is what we mean when we say accessible design isn't a skin: it's a second, faithful interface to the same state machine.

## The outcome

Nine weeks from kickoff to launch across two pack families, with the third following on a retainer cadence — the [engagement model](/pricing) that suits rollout-with-learning. As with everything in our [work portfolio](/work), figures are illustrative of a real engagement of this shape:

| Metric | Before | After |
| --- | --- | --- |
| Sizing/fit questions in support (monthly) | ~780 | ~240 |
| Pack return rate | 14.2% | 8.9% |
| Conversion: configurator users vs PDP-only | 1.0× | 1.8× |
| Average order value (configured packs) | baseline | +22% (add-ons) |
| 3D scene first load | — | 1.55MB (under 1.6MB budget) |
| 60fps orbit on 5-year-old mid-range phone | — | yes |

The row we watch is the compound one: fewer tickets *and* fewer returns on the exact products where the configurator gets used most. That pairing is the signature of a tool that changed the purchase, not just the page. Traffic came anyway — the shared-configuration URLs became their own acquisition channel once camping forums started posting their setups.

Osprey's team now uses the configurator in retail too: floor staff reach for it instead of the paper fitting sheet, which is the adoption signal no analytics dashboard can fake. The system followed the product into the shop. That's what we're for at this [studio](/studio): tools that keep working in weather.

> "We asked for a 3D toy and got a fit guide with a conscience. Returns are down, the inbox is quiet, and the forums configure our packs for us now. Best possible outcome of being wrong about what we needed." — Sienna Kaur, Head of E-commerce, Osprey Outdoor (fictional)

## Stack & credits

- **3D:** React Three Fiber + Three.js, draco glTF, KTX2 textures, 60fps interaction budget
- **Fit system:** torso measurement assistant, fit verdicts with explanations, per-family volume anchors
- **E-commerce:** state-as-URL configurations, add-on pricing, campaign deep links
- **Accessibility:** full 2D fallback interface, keyboard parity, `prefers-reduced-motion` respected
- **Squad:** design lead, 3D engineer, two product engineers, accessibility specialist, producer
- **Want a configurator that pays for itself?** [Talk to Brassfern](/contact)
