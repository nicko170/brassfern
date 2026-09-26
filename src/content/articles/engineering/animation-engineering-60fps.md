---
title: "Animation is engineering: shipping motion at 60fps"
description: "Motion at 60fps is an engineering discipline: compositor-only properties, FLIP for layout changes, when canvas or WebGL earn their weight, and testing."
slug: animation-engineering-60fps
cluster: engineering
tags:
  - animation
  - performance
  - web platform
  - design engineering
date: 2026-06-11
author: Hannah Yeo
keywords:
  - animation performance
  - web animation 60fps
  - FLIP technique
  - prefers-reduced-motion
readingTime: 10
---

Every dropped frame is a broken promise. A user touches your interface, the interface hesitates for 80 milliseconds mid-gesture, and a small, unverifiable feeling settles in: this software is cheap. Nobody files the ticket. The feeling just compounds until a competitor with a snappier product wins the renewal.

At Brassfern, motion goes through the same engineering review as data fetching, because motion *is* engineering. The designer owns the intent — what moves, why, and how it should feel, which we've separated out in [motion that earns its keep](/journal/web-design/motion-that-earns-its-keep). This article is the other half: the implementation discipline that keeps the promise at 60 frames per second on a mid-range Android, not just the designer's MacBook. Sixteen milliseconds a frame. Everything below fits inside it.

## Rule one: the compositor is the only safe neighbourhood

A browser frame has a pipeline: JavaScript, style, layout, paint, composite. Every property you animate tolls a different set of gates:

- **Layout-triggering** (`width`, `height`, `top`, `margin`, font metrics): the browser recomputes geometry — potentially for the whole subtree — every frame. This is how hero sections stutter.
- **Paint-triggering** (`background`, `box-shadow`, `border-radius`): avoids layout but repaints pixels every frame. Cheaper, still not free, and brutal over large areas.
- **Compositor-only** (`transform`, `opacity`, modern `filter` within reason): the work happens on the GPU against an already-painted layer. Layout and paint never run. This is the safe neighbourhood.

The practical consequence: **animate `transform` and `opacity`, and treat everything else as a bug until proven innocent.** Expanding a panel? Don't animate `height` — animate `scaleY` on a fixed-height inner layer, or better, use the FLIP pattern below so layout happens *once* and the visible motion is a transform. Moving a card? `translate`, never `top`. That famous checklist — "if it has a unit that isn't `px`-on-transform, be suspicious" — will catch 90% of jank before DevTools does.

One nuance the checklist posters skip: `will-change` and implicit layer promotion have a memory cost, and promoting hundreds of elements turns your compositor savings into texture-memory thrash. Promote deliberately (a sticky header, a draggable element), not as a talisman on every animated node.

## FLIP: layout once, motion everywhere

The recurring hard problem: an element must genuinely change layout position — a list reorders, a card expands into a detail view, a shared element travels between screens — and transitions on layout properties are forbidden by rule one.

FLIP (First, Last, Invert, Play) is the standard escape:

1. **First:** measure the element's `getBoundingClientRect()` in its starting state.
2. **Last:** apply the state change (reorder the list, add the class) and measure the rect again.
3. **Invert:** apply a transform that maps the new rect back onto the old one — the element now *looks* unmoved, instantly.
4. **Play:** transition the transform to identity. Expensive layout ran exactly twice (reads batched apart from writes); per-frame work is a pure transform on the compositor.

Hand-rolling FLIP for a grid reorder is about thirty lines. The Web Animations API makes it cleaner without a runtime dependency, and the [View Transitions API](/journal/engineering/view-transitions-api-practical) now packages a platform-level FLIP for whole-view and shared-element transitions — our first choice where baseline allows, with a hand-rolled fallback behind it. Either way, the mechanism is the same: *layout is data, transforms are motion.* Hold that separation and 60fps stops being a hope.

## Choosing the substrate: CSS, WAAPI, canvas, WebGL

The substrate ladder, in the order we reach for them:

- **CSS transitions and keyframes** for stateful, interruptible, small-scope motion: hovers, toggles, entrances. Declarative, cheap, accessible-friendly, debuggable in the inspector. Default to this — always.
- **Web Animations API** when the animation needs a runtime brain: dynamic targets (drag end positions, FLIP deltas), scrubbing, playback control, sequencing without callback spaghetti. WAAPI is CSS animations with a steering wheel; use it before reaching for a library.
- **A physics/animation library** when spring dynamics are the product's feel. One library, tree-shaken, and accountable to the [bundle budget](/journal/engineering/bundle-budget-discipline) like anything else that ships over the wire.
- **Canvas 2D** when you're rendering hundreds of cooperating particles or live-updating generative art — DOM nodes can't afford that census. You forfeit accessibility semantics and text quality; compensate with a static alternative.
- **WebGL** when the work is genuinely spatial or shader-shaped: product configurators, data globes,shader-driven heroes. WebGL is a rendering engine you're now operating, with context-loss handling, device-pixel-ratio strategy and a duty to [disclose what the platform gives you](/journal/engineering/web-platform-baseline-2026) before you build a custom compositor on top of one. We love it. We budget for it like a product feature, because it is one.

The discipline: **climb the ladder only when the rung below provably can't do the job**, and write down why, in the PR, so year-two engineers don't cargo-cult WebGL onto a tab switcher.

## Test motion like a feature, not a garnish

Motion is the only feature class most teams ship with zero acceptance criteria. Ours has four, and they live in the definition of done:

**1. Frame budget verification.** Chrome DevTools Performance panel, CPU throttled 4×, recording the interaction. The acceptance line: no long task over 50ms attributable to the animation, and dropped frames hovering near zero. The hardware excuse — "it's smooth on my machine" — is precisely why the throttle exists. Ship what the throttled trace allows, not what your laptop forgives.

**2. Interaction latency, not just average fps.** A 58fps average that stutters exactly when the user drags is worse than a steady 45. Watch INP during the animation on real sessions (we covered the field-measurement side in the [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide)); animation work on the main thread during input is a double sin.

**3. Interruption testing.** Users interrupt everything — hover-leave-hover in 300ms, open-close-open in a flash. Every animation gets the question: reverse mid-flight without a jump, cancel mid-flight without a dead state, and never queue identical runs. Spring physics handles this elegantly; hard-coded CSS keyframes with `animation-fill-mode: forwards` are where ghost states breed.

**4. Reduced-motion is a first-class state.** Not a deletion of the animation — a *designed alternative*: crossfades for slides, instant swaps with clear state for parallax, opacity-only micro-movement where movement was informational. Wrap it as a token (`--motion-scale: 0 | 1`) or a media-query-driven variant so it's one authored decision, not fifty scattered overrides. Motion accessibility intersects [accessibility as an engineering practice](/journal/engineering/accessibility-as-engineering-practice): vestibular sensitivity isn't an edge case, it's a third of your audience on a bad day, and "respect the setting" is the floor, not the ceiling.

## A worked example: the expandable row

Consider the humble expanding table row — the component where all four rules converge. Wrong version: animate `max-height`, watch layout thrash, accept the janky open because "it's subtle." Our version: the row's detail region renders (layout happens once, while `opacity: 0` hides it), we FLIP the container's height delta into a `scaleY` illusion or — simpler and now baseline-friendly — animate `height` from `0` to `auto` via the new `calc-size()` in supporting browsers with a WAAPI transform fallback. Unmount uses the reverse FLIP. Mid-flight interruption reverses the same transition from its current value, because the code paths are WAAPI-driven and values come from measurements, not keyframe absolutes. Reduced-motion swaps the sweep for a 120ms crossfade. Total: ~120 lines, a performance trace in the PR, and one component that will never appear in a "why is the app sluggish" thread.

That last outcome — absence from the incident channel — is the real deliverable. Great motion is something users *trust* without ever noticing, which means its success metric is silence.

If your product's motion layer is currently a museum of accrued keyframes, motion refactors are regular work for our [websites practice](/services/websites) and product squads alike — and as always, the [contact form](/contact) is the door.

## Key takeaways

- Animate `transform` and `opacity` by default; treat layout- and paint-triggering properties as bugs until a profile proves innocence.
- FLIP converts layout changes into compositor motion: measure, mutate, invert, play — layout runs twice, transforms run per frame.
- Climb the substrate ladder — CSS → WAAPI → springs → canvas → WebGL — only on evidence, and record why in the PR.
- Test motion like a feature: throttled traces, INP during animation, interruption paths, and a designed reduced-motion variant.
- Promote layers deliberately; blanket `will-change` trades jank for texture-memory thrash on the devices that least afford it.

## FAQ

### Is 60fps on 120Hz displays a problem — do we need to chase 120?

No, and you mostly can't control it anyway: rAF-aligned CSS and WAAPI animations render at the display's cadence automatically on most browsers. What you control is *missing* the frame budget. At 120Hz the budget halves to ~8ms, which makes rule one — compositor-only properties — more important, not different. Budget for the slowest device you support; the fast displays inherit the headroom.

### Should we use a specific animation library in 2026?

Choose on physics and licence, not brand. If your motion language is springy and gesture-driven, a spring library earns its kilobytes; if it's mostly enter/exit choreography, WAAPI plus a tiny FLIP helper covers it and deletes a dependency. The wrong answer is three libraries accrued over three years — audit before you add, and let the [bundle budget](/journal/engineering/bundle-budget-discipline) referee.

### How do scroll-driven animations fit into this?

The CSS scroll-driven animations spec moved the classic parallax-and-reveal pattern off the main thread entirely — a genuine platform gift, used with restraint. Scrubbed transforms and opacity are safe; scrubbed layout properties are the same sins with a new syntax. And scroll-jacking — overriding native scroll to orchestrate motion — remains a user-experience crime regardless of how smooth you make it.

### What's a realistic reduced-motion policy across a big codebase?

Centralise or fail. One token/hook (`useReducedMotion()` returning a motion scale), one documented mapping per pattern (slide→fade, parallax→static, scale→opacity), and lint-level pressure against bespoke media queries scattered through components. Fifty local decisions will drift; one authored decision won't. Audit quarterly with the setting *on* — teams that test with it off are lying to themselves politely.
