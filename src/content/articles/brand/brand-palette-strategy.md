---
title: "Picking a brand palette is strategy wearing paint"
description: "A brand palette is a strategic decision before it is an aesthetic one. How we map competitors, treat accessibility as a creative constraint, and pick ownable colour."
slug: brand-palette-strategy
cluster: brand
tags: [colour, brand-strategy, accessibility, identity]
date: 2025-04-08
author: Mara Ellison
keywords: [brand colour palette, colour strategy, accessible colour, brand identity, visual identity]
readingTime: 9
---

Nobody picks a palette in a vacuum, but most palette exercises pretend to. Someone opens a tool, pulls five pleasing swatches, arranges them with generous whitespace, and presents the rectangle as if colour were a matter of taste. It is not. Colour is the fastest-registered, most fiercely contested piece of territory a brand can hold — and it is chosen inside a market full of people who got there first.

When we rebuilt the identity for [Copperline Mutual](/work/copperline-community-bank), a community bank, the first thing we did was not open a colour wheel. We opened a map of every competitor's brand. That is where every palette should start: with what's already claimed.

## Step one: map the territory, not the mood board

Print or screenshot the brands your audience will see you next to — the app grid, the comparison table, the high street, the sponsor wall at the industry event. Squint. What you will usually find is a herd. Fintech herds into navy and purple. Wellness herds into sage and blush. Climate herds into green-on-green, a category we know well from our work on the [Meridian Climate data explorer](/work/meridian-climate-data-explorer), where standing out meant *not* reaching for the obvious leaf.

The squint test tells you where the open water is. If every direct competitor lives in cool blues, a warm anchor isn't just pretty — it's a retrieval cue. Distinctiveness is a memory strategy. When someone tries to recall you in three months, "the orange one" beats "the trustworthy one" every time, because colour encodes faster than positioning statements.

A useful exercise: score every competitor on hue family, warmth, and saturation. Plot it. The empty quadrant is not automatically right for you — sometimes the herd is in blue because the category genuinely demands sobriety — but you should enter the crowded quadrant knowingly, with a plan to be distinctive inside it, rather than drifting in by default.

## Step two: decide what the palette has to do all day

A launch-deck palette and a working palette are different animals. Before choosing hues, write the job description. A serious palette for a digital product brand has to:

- Render readable body text and UI states (error, success, warning, disabled) without looking like an airport departure board.
- Survive both a 40-foot venue banner and a 16px favicon.
- Have at least one colour that can carry a full-bleed background with type on top — the "hero colour" problem.
- Work in one colour, because invoices, embroidery, and fax machines from 1997 still exist.
- Leave room for data visualisation, where you need a *ramp* of distinguishable colours, not one hero and four wallflowers.

That last one is chronically under-planned. A generic dashboard palette gets bolted on later and quietly eats the brand from inside the product. When we rebuilt the [Northwind Ledger dashboard](/work/northwind-ledger-dashboard-rebuild), the chart ramp was derived from the brand's brass-and-fern pairing, so the product's most-seen screens reinforced the identity instead of contradicting it.

## Step three: accessibility is a constraint, not an audit

The worst workflow in branding is: pick colours, fall in love, then run the contrast checker in week nine, then negotiate with WCAG as if it were a planning objection. Flip it. Contrast requirements are a creative constraint on day one, like a canvas size.

Practically: decide your text colours and background candidates first, and check AA pairs (4.5:1 for body text) as you go. You will quickly discover that the "mid" tones everyone adores — the greyish sage, the dusty rose — are nearly unusable for text. Good. That knowledge pushes you toward a palette with real dynamic range: at least one genuinely dark ink, one genuinely light paper, and accents that know which side of the line they live on.

Two techniques we use constantly:

1. **Pairing tables, not swatch rows.** Deliver the palette as a matrix of permitted foreground/background pairs that all pass AA. Designers downstream stop guessing; compliance stops being a vibe.
2. **Semantic layer.** Define `error`, `success`, `focus` as roles mapped to brand hues, so the red of an error message is *your* red, tuned to pass contrast, not the browser default red that fought its way in.

Treating accessibility as strategy also has a quiet commercial argument: roughly one in twelve men has some form of colour-vision deficiency. A palette that relies on hue alone to distinguish states is excluding customers you paid to acquire.

## Step four: ownability is a spectrum

You cannot trademark a hue family, and courts have been unimpressed by attempts. What you can own is a *combination* — a hue pair, a proportion, a behaviour. Tiffany's blue is ownable not because blue is rare but because the application is relentless and the context is unmistakable.

So the question isn't "has anyone used green?" It's "does this exact chord — this ink, this paper, this brass, in these proportions — read as us at a glance?" We test this crudely and effectively: mock the palette onto five real contexts (an Instagram grid, a conference lanyard, a bank-statement PDF, an app icon, a delivery van — whatever the client's actual surfaces are) and show them to people inside the company without the logo. If they can't tell it's theirs, it isn't yet.

Proportion matters more than people expect. A 60/30/10 style balance — dominant neutral, secondary anchor, sparing accent — is what makes the accent *mean* something. Palettes where every colour fights at equal volume produce brands that feel like a hardware-store paint fan.

## Step five: test in the wild, not in the deck

Before sign-off, we run what we call the gauntlet: the palette applied to the ten most-seen actual artefacts — the homepage, the pricing page, the app store listing, the email header, the error state, the dark-mode variant, the pitch deck, the invoice, the event booth, the merch. Palettes that look sublime as five swatches on white routinely collapse at artefact eight (it's always the invoice).

Also test the failure modes: printed uncoated, photocopied, on a sun-bleached shopfront, in a low-end phone screen's washed-out rendering. Heritage-minded clients especially benefit here — when we modernised [Tallow & Co.](/work/tallow-and-co-providore), a butcher from 1987, the deep cured-meat red we kept from their history had to survive both a neon-lit deli counter and an e-commerce PDP. Two different animals; one calibrated hue with context-specific tints.

## Key takeaways

- Start with a competitive colour map, not a mood board. Distinctiveness is a memory strategy.
- Write the palette's job description — UI states, data-viz ramps, one-colour fallbacks — before choosing hues.
- Bring contrast checking into day one; deliver permitted foreground/background pairing tables, not raw swatches.
- Ownability comes from combination, proportion and relentlessness, not from claiming a hue.
- Stress-test the palette on the ten most-seen real artefacts, including the ugly ones.

## FAQ

**How many colours should a brand palette have?** Fewer than you think. A working set is typically one ink, one paper, one or two accents, plus a functional set (success/error/focus) and tints of the anchors. Beyond that you're building a paint catalogue, not a brand.

**Should we avoid our competitor's colour entirely?** Not always. If the category colour carries meaning your audience depends on — navy in banking, say — you can enter it and differentiate through pairing, proportion or an unexpected accent. Enter knowingly, with a plan.

**Do we need a dark mode palette?** If you ship a digital product, yes, and it should be designed, not inverted. Dark surfaces change how every hue reads; accents usually need lightening, and contrast pairs need re-checking from scratch.

**Can we change our brand colour later?** Yes, but treat it like moving house, not repainting a room — see our [rebrand rollout plan](/journal/brand/rebrand-rollout-plan) for the unglamorous middle. Equity lives in consistency, so change needs a reason bigger than boredom.

**How does colour relate to the rest of the identity system?** Colour is one instrument in the band — type, voice and motion carry equal weight. We covered the system view in [the logo is dead; long live the identity system](/journal/brand/logo-is-dead-system). If the palette has to do all the distinctiveness work alone, the identity is underpowered.
