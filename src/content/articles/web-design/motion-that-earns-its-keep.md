---
title: "Motion that earns its keep (and the 160ms rule)"
description: "Brassfern's motion philosophy: the 160ms rule, an easing vocabulary of three curves, choreography limits, and why prefers-reduced-motion is a design input, not a checkbox."
slug: motion-that-earns-its-keep
cluster: web-design
tags:
  - Motion design
  - Interaction design
  - Accessibility
date: 2025-06-03
author: June Okafor
keywords:
  - web animation design
  - motion design principles
  - easing curves
  - reduced motion accessibility
readingTime: 8
heroImage: /images/articles/web-design/motion-that-earns-its-keep.jpg
heroAlt: "Abstract paper-craft composition on warm off-white: three curved ribbon trajectories in brass, forest green and terracotta describing easing curves through space, with a small still circle at the origin"
---

Every animation on a website is a loan. The user lends you their attention and their milliseconds; you owe them information or delight in return, at a fair rate. Most site motion defaults on that debt — a hero that shimmers because "premium brands move", an element that drifts in 900 milliseconds after you needed to read it. Our motion philosophy is one sentence: **motion is information about state and space; everything else is garnish, and garnish has a strict ration.**

This is the system we run across our [marketing sites](/services/websites) and [products](/services/product-design-and-engineering). It has three parts: a duration rule, a small easing vocabulary, and choreography limits. And one non-negotiable: reduced motion is a design input from the first wireframe, not an audit finding three days before launch.

## The 160ms rule

Durations aren't a matter of taste, they're a matter of fit between human perception and the size of the change. We use three tiers:

**Feedback: 100–160ms.** Hover states, button presses, toggles, focus rings. This is the tier where the 160ms rule lives — interaction feedback should complete in about a frame-count of conscience. Anything under 100ms reads as instant; anything over 200ms on a press reads as lag, and users start clicking twice. When a client says the interface feels "snappy", this tier is almost always what they mean. It costs nothing and it's the highest-ROI motion on any site.

**Transitions: 240–320ms.** A card expanding, a menu opening, a view crossfading. This is the comfortable range for spatial change: long enough for the eye to track where a thing went, short enough that nobody waits. If a transition needs 500ms to feel "smooth", the layout is moving too far — fix the distance, not the duration.

**Narrative: 480–700ms, once per page take.** A hero entrance, a large ambient loop, a scroll-driven sequence. One per viewport, and it must carry meaning — revealing hierarchy, establishing where you are, demonstrating a product behaviour. The moment a page has three things performing narrative motion, none of them are. This is the tier clients ask for by name ("make it feel cinematic") and the tier we ration hardest, because narrative motion is a tax on every repeat visit.

A practical heuristic we give teams: if you can't say in one sentence what changed and where it went, the animation isn't allowed past 240ms.

## An easing vocabulary of three curves

Sites feel jittery when every animation uses a different easing. We keep three named curves and reject new ones in review, the same way we reject new colours:

- **Out — standard entrance.** A decelerating curve with a fast first third. Coming *into* view should feel eager. Nearly everything uses this.
- **In — quick exit.** An accelerating curve for things leaving (a toast dismissing, an overlay closing). Departures should not linger; the user is done with that thing.
- **In-out — same-object moves.** When an element travels from one place to another and stays, the gentle acceleration at both ends preserves the sense of a single object moving through space rather than two objects swapping.

What we don't use: bounces and elastic overshoots in products and most marketing pages. An overshoot says "toy". There are brands that are toys — a children's app, a games campaign — but on a fintech dashboard an elastic dropdown quietly announces that the software is not serious. Linear is reserved for continuous motion only: marquees, progress, anything driven by scroll position.

## Choreography limits

Staggering is where good intentions go to be slow. A grid of twelve cards drifting in one by one at 80ms intervals takes a full second to stop being annoying. Our limits:

- **Stagger at most 3–4 items**, with 40–60ms steps, totalling under 200ms across the group. The list resolves as a unit; nobody watches card nine arrive.
- **One narrative motion per viewport, as above.** The hero performs. The rest of the page behaves.
- **Ambient loops must justify their render cost.** A constantly animating decorative element spends GPU for the entire session. If an ambient detail doesn't make a user smile on first visit, it's burning their battery on every visit after, when they no longer notice it.
- **Scroll-linked motion is entropy-tied.** Scroll-driven animation should map one-to-one to scroll position (scrubbed), not trigger and run free. Scrubbed motion never plays when the user isn't scrolling, never outruns them, and reverses gracefully. It respects the oldest fact of the medium: the reader controls the pace.

The counter-intuitive finding from years of watching session replays: restrained choreography makes a site feel *more* expensive, not less. Three fast, meaningful beats read as confidence. Twelve drifting elements read as a template.

## prefers-reduced-motion is a design input

Around a tenth of your visitors may have reduced-motion settings, through vestibular conditions, migraines, attention disorders, or plain preference. Vestibular triggers are specific — large parallax movements, zooms, and multi-element slides can cause genuine physical nausea — so this is a disability-access issue as real as contrast.

The mistake teams make is treating `@media (prefers-reduced-motion)` as an engineering cleanup task, which produces the worst of both worlds: motion that's either fully on or binary-off, with the reduced version an ugly insta-cut nobody designed. We handle it at design time. For every motion spec we write an **R-motion equivalent**: the reduced version isn't "nothing happens", it's a designed alternative. Slides become fades — opacity change carries the same "this is new" information without the movement that harms. Parallax becomes static layering. Scrubbed sequences become stepped states as you pass scroll thresholds.

In CSS this means building the reduced baseline and layering motion on top inside `@media (prefers-reduced-motion: no-preference)`, rather than writing the motion first and trying to unpick it. Progressive enhancement for motion, the same way we treat layout and JS. We audit it the way we audit contrast — it's in our [accessibility handoff checklist](/journal/web-design/accessible-design-handoff), and it's tested by actually enabling the setting, not by reading the media query and nodding.

## The engineering floor

Motion design fails at the compositor if it's not engineered. The floor rules: animate only `transform` and `opacity` (both skip layout and paint); never animate `width`, `height`, `top`, `left`, or shadows that repaint every frame; use `will-change` like medicine, applied temporarily before a big move and removed after, not sprinkled prophylactically. JS-driven animation only when the physics matter — inertia, spring dynamics, drag — in which case a real spring library beats hand-rolled easing, but vanilla CSS handles 90% of the spec above without shipping any animation JavaScript at all.

None of the animation craft matters if the expensive-hero-framework adds 80KB to the page. This is the same discipline as our [typography budgets](/journal/web-design/typography-that-loads): expressive range is purchased with engineering restraint, or it isn't purchased sustainably.

## Two pairs, in closing

**Bad:** a hero heading slides up over 900ms, then a paragraph fades in, then the CTA drops, then a background shape begins a permanent drift animation. **Good:** everything above the fold appears as one unit in 240ms with an out-curve; the CTA pulses once, gently, at 160ms on scroll-into-view; nothing moves again until the user acts.

**Bad:** a dashboard card hover scales to 1.05 over 500ms with a bounce, and a shadow animates to a different box-shadow value. **Good:** the card's border and a corner affordance respond in 120ms on the standard curve, transform only; a reduced-motion user sees the border respond, identical.

The difference isn't budget or talent. It's a rationing system, decided before the fun starts.

## Key takeaways

- Motion is information about state and space. Garnish gets a strict ration.
- Three duration tiers: feedback at 100–160ms, transitions at 240–320ms, narrative at 480–700ms and only once per viewport.
- Keep an easing vocabulary of three named curves; no bounce in serious products.
- Stagger at most 3–4 items at 40–60ms steps. Prefer scrubbed, scroll-linked motion over triggered animations.
- Design the reduced-motion equivalent of every animation as part of the spec; build reduced-first with `@media (prefers-reduced-motion: no-preference)`.
- Animate `transform` and `opacity` only; treat `will-change` as a temporary medicine.

## FAQ

**Doesn't restrained motion make site designs boring?**
The opposite. Motion draws the eye by definition, so restraint is what gives it power. It's the same reason an exclamation mark means something in prose that uses them rarely. Restraint is also what survives repeat visits.

**What tool should our team use — CSS, GSAP, springs?**
CSS for the 90% (the vocabulary above), springs for physics-driven interactions like drag and inertia, a mature animation library when sequences genuinely need orchestration. Don't hand-roll physics, and don't ship an orchestration library to fade in a nav.

**How do we test reduced motion?**
Enable the OS setting and browse the whole site — every state, every page. If your QA is "we have the media query", you haven't tested. Screen-reader tooling includes a rotor for it in testing labs; make it part of the release checklist.

**Should scroll-triggered reveals be banned?**
No, rationed. Scrubbed reveals are fine; triggered ones that play regardless of the user's intent are the problem. And a reveal must never make content *wait* to become readable — if the animation fails or is reduced, the content is simply there.

**How do we convince a stakeholder who loves a busy reference site?**
Show them a session recording of a real user scrolling past the fireworks unread. Then show them the 160ms hover on the button they clicked. Motion that earns its keep is the motion between intent and outcome; that's the story analytics will back you on.
