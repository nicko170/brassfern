---
title: "The motion layer of brand identity"
description: "Easing is a signature, transitions are grammar. How to build a kinetic identity system, export it as motion tokens engineers actually use, and survive prefers-reduced-motion."
slug: motion-identity-design
cluster: brand
tags: [motion design, kinetic identity, brand systems, motion tokens, design engineering]
date: 2025-04-02
author: Hannah Yeo
keywords: [motion brand identity, kinetic identity, brand animation guidelines, motion tokens]
readingTime: 10
heroImage: /images/articles/brand/motion-identity-design.jpg
heroAlt: "Overlapping translucent sheets tracing the easing curves of a fern form in motion, with brass timeline markers on cream paper."
---

Ask a brand team to describe their identity and you'll hear about the wordmark, the palette and the typeface. Ask how a menu opens in their app and you'll get a shrug, a `transition: all .3s ease`, and a modal that slides up because that's what the component library shipped. Yet motion is the brand attribute users feel most often. A customer sees your logo occasionally; they feel your easing curve a hundred times a session. If your identity system doesn't specify what things feel like when they move, you've left the most-touched layer of the brand to chance and to framework defaults.

This is the motion layer of identity: how we design it, how we hand it to engineers as tokens rather than films, and how it holds up when someone asks the operating system to switch it off. It's also where our [brand identity work](/services/brand-identity) and our web practice overlap most happily.

## Easing is your signature

Strip a brand to a single motion decision and it's the easing curve. Colour systems get documented exhaustively; the difference between `ease-out` and `spring` — between "settles" and "bounces into place" — goes undocumented in almost every brand book we inherit.

Treat easing the way you treat type: one primary voice, used almost everywhere. On Brassfern's own site everything settles with a fast deceleration — cubic-bezier(.22,1,.36,1) — because the character we're after is *decisive*. Things arrive quickly and stop dead, like a well-edited sentence. A playful consumer brand might legitimately pick an overshoot; a bank should consider that bouncing numbers read as unstable, which is a word you never want near a balance. For [Copperline Mutual](/work/copperline-community-bank) we built the whole system on steadiness: no overshoot anywhere, opacity-driven feedback instead of scale, durations a touch longer than fashionable — motion that takes its time reads as consideration.

The discipline is in the *almost*. A signature easing only reads as a signature when it's ubiquitous. Audit your production CSS: if you find eleven timing functions, you don't have a motion identity, you have eleven accidents.

## Durations are a scale, like type

Random durations are the motion equivalent of random font sizes. We build a duration scale of four to five steps and give every UI event a rung:

- **~120–160ms** — hover and press feedback. Below this, animation is invisible; above it, the interface starts feeling laggy. This is the rung where [the 160ms rule](/journal/web-design/motion-that-earns-its-keep) lives.
- **~250–300ms** — small state changes: toggles, accordion sections, toast arrivals.
- **~400–500ms** — larger transitions: panels, drawers, view changes within a page.
- **~700–900ms** — rare, earned moments: the reveal of a hero, a success sequence. If everything is on this rung, nothing is.

Two rules make the scale a brand asset rather than a style choice. First, **distance and duration scale together** — a tooltip moving 8px never takes as long as a sheet crossing the screen. Second, **entering beats exiting**: things leaving can go ~20% faster. Users forgive a brisk exit; a sluggish entrance feels like the software is thinking about whether you deserve it.

## Transitions are grammar, not decoration

A vocabulary is not a language — you need rules for how elements relate when they move. We call this the transition grammar, and we write it down in three sentences per brand:

1. **Spatial honesty.** Things come from where they live. A detail panel grows from the row you tapped, not from the top of the screen; a dismissed notification leaves toward the edge it entered from. Users build a spatial map of your product; every teleporting element corrupts it.
2. **Choreography order.** When several things move, what leads? Our default: the informed element moves first, the informing chrome follows. Content, then frame.
3. **What never moves.** Every grammar needs its silences. For most brands: numbers that represent money never animate; body copy never animates; nothing loops unless it's loading.

That last rule matters commercially. Animated prices and counters feel like a fruit machine. [Holloway Records](/work/holloway-records-label-site) gets away with a sleeve that spins on hover because playfulness *is* the product; a ledger should behave like one.

## A logo's behaviour, in one storyboard

The kinetic logo is the brand-identity layer everyone enjoys designing and almost nobody specifies well. Our format is a single storyboard with five frames: **rest → attention → action → resolve → rest**, each frame with its duration and curve noted. What the logo does under each verb *is* the brand in miniature. Does it breathe at rest? Does it recoil, lean in, or hold still on hover? Does resolving mean settling to centre or exiting stage left?

Rules we hold the line on: the logo animates on *intent*, not on a timer — a wordmark that waves at you every eight seconds is a banner ad with a salary. And the kinetic form must reduce gracefully to the static one: remove the motion and the identity must still read. If your logo only works while moving, you've designed a screensaver.

## Exporting motion as tokens

Here is where most kinetic brand work dies: it ships as a showreel, and showreels don't compile. Engineers cannot implement a Vimeo link. The handover that survives is **tokens** — named values in the same system as your colours and type scale. [Core Web Vitals engineering](/journal/engineering/core-web-vitals-field-guide) taught us that values engineers can copy are values that ship; motion is no different.

A minimal token set:

- `motion/ease-standard`, `motion/ease-emphasis` (spring or overshoot, if the brand owns one), `motion/ease-in-only` for exits.
- `motion/dur-1` through `motion/dur-4`, mapped to the rungs above.
- `motion/distance-1/2/3` — the physical scale of small, medium and large movements, so 8px hovers don't share a constant with full-screen sheets.
- Semantic aliases: `motion/feedback = { ease: standard, dur: dur-1 }`, `motion/overlay-enter`, `motion/page-transition`. Semantic names mean rebrand the values, and every component updates — exactly how [colour systems survive rebrands](/journal/web-design/colour-systems-dark-mode).

Export to CSS custom properties for the web and a typed constants file for React Native, from one source of truth. And document *where each token may be used* — `ease-emphasis` on feedback loops only, never on navigation — because tokens without usage rules get applied everywhere, and emphasis everywhere is emphasis nowhere.

## Designing for reduced motion from day one

`prefers-reduced-motion` is not an edge case you patch before launch; it's a design constraint you brief with, like small screens. Around a quarter of your users will have it set at some point, and for vestibular-disorder users your parallax hero is not charming, it's symptomatic.

The pattern we spec into every identity: define **two states of the system at design time**, not one state and a kill switch. The reduced state isn't "nothing moves" — it's "nothing travels". Replace translation and scale with opacity fades under 200ms; replace parallax with static composition chosen to work flat; play one frame of the reveal and stop. The identity survives because you designed the still version as a first-class citizen. A kinetic brand whose reduced version feels broken is a brand that discriminates by accessibility setting.

## Key takeaways

- Choose one signature easing and use it almost everywhere; ubiquity is what makes it a signature.
- Build a duration scale of four or five rungs and put every UI event on a rung. Entering beats exiting; distance and duration scale together.
- Write a three-sentence transition grammar: spatial honesty, choreography order, and what never moves.
- Storyboard the logo's behaviour in five frames, intent-triggered, and make sure it works standing still.
- Ship motion as tokens with semantic aliases and usage rules — engineers implement values, not showreels.
- Design the reduced-motion state in the same pass as the full one. Replace travel with fade, and never with emptiness.

## FAQ

**Isn't springy, bouncy motion just... friendlier?**
Sometimes. Overshoot reads as play and energy, which suits consumer products aimed at delight. It reads as instability everywhere numbers, money or health are involved. Friendliness lives in copy and colour too; don't ask easing to carry the whole personality.

**How do we keep third-party components on-brand?**
You mostly can't restyle a vendor's motion, so choose vendors whose defaults sit near your tokens — and wrap the rest: portals and overlays you control can standardise entrances even when the innards are foreign. Audit your component library's timing functions before you sign off the token names.

**Does motion identity apply to email and social?**
Email clients make motion unreliable, so design your templates to read statically and let GIFs be an enhancement, never the message. For video and social, the same storyboard and easing rules apply — a lower, slower frame rate actually shows off a signature curve better than a 60fps app does.

**How long does a kinetic identity layer take to build?**
Folded into a brand engagement: two to three weeks including the token export and reduced-motion spec. Retrofitted onto a live product: budget for the audit first — finding the eleven timing functions is the long part.
