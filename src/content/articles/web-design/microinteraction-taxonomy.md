---
title: "A taxonomy of micro-interactions (and when to say no)"
description: "Hover states, cursor follow, scroll reveals and button physics — a working taxonomy with duration curves, quality tests, and reduced-motion fallbacks for every pattern."
slug: microinteraction-taxonomy
cluster: web-design
tags:
  - Interaction design
  - Motion
  - Accessibility
date: 2026-06-09
author: Felix Brandt
keywords:
  - microinteractions
  - hover states
  - scroll animation
  - prefers-reduced-motion
  - ui animation duration
readingTime: 11
---

A micro-interaction is a moment where the interface answers a question the user just asked with their hands: did that click register, is this draggable, where did it go, am I done? The ones people notice and praise are almost never the best ones — the best ones are felt as *the product simply working*.

This piece is the reference we use internally when designing and reviewing interaction detail across [product](/services/product) and [website](/services/websites) work: a taxonomy that sorts every micro-interaction by its job, the duration and easing constants we start from, the test that separates quality from gimmick, and a `prefers-reduced-motion` fallback for each pattern. It pairs with our taste argument in [micro-interactions: fine vs expensive-feeling](/journal/web-design/microinteractions-that-matter) — this one is the manual, that one is the essay.

## The taxonomy: four jobs, one freeloader

Every micro-interaction on a serious interface does one of four jobs. If it does none of them, it's the fifth category — the freeloader, covered later.

**1. Acknowledgement** — "I heard you." Button press states, toggle thumbs, form submit transitions, the brief colour change on copy-to-clipboard. These exist because a silent interface feels broken; latency without acknowledgement reads as failure in under 300ms. Budget: the *fastest* class of motion we ship, because the user is waiting on it.

**2. Orientation** — "you are here, and here's where that came from." Expand/collapse with height animation, elements that morph into the view they open (shared-element transitions), scroll-spy highlights, the drawer that slides from the edge it lives on. These maintain a spatial model of the interface in the user's head. Remove them and nothing breaks — but everything becomes slightly harder to find again, and support tickets quietly grow.

**3. Guidance** — "now look here." The cart icon that ripples when an item is added, the field that shakes once on invalid input, the progress indicator that advances. Guidance motion is a pointer: it borrows attention. It should be rare, because borrowed attention is a debt.

**4. Character** — "this product has a personality." The logo that breathes on 404, the keyboard-click microsound kept off by default, the confetti we ship approximately never. Character moments are seasoning; the dish must be good without them, and they must be the easiest thing in the codebase to delete.

The freelance fifth category — motion that exists because a demo looked nice — has a tell: it moves while the user is trying to read. Anything that animates in peripheral vision *during* consumption is spending attention it didn't earn.

## Duration and easing: the constants we start from

Motion feels physical or fake mostly on timing, and timing is cheap to get right once, in tokens:

| Pattern | Duration | Easing | Notes |
| --- | --- | --- | --- |
| Hover/press states | 80–140ms | ease-out | Under 80ms reads as a flicker, over 200ms reads as lag |
| Toggle/checkmark | 120–180ms | ease-out spring optional | The thumb should outrun any finger |
| Expand/collapse | 180–260ms, scaled by height | ease-in-out | Longer content, longer time — see below |
| Enter/exit of elements | 160–240ms in / 120–160ms out | ease-out in / ease-in out | Symmetric enter/exit feels indecisive; enter gently, leave promptly |
| Orientation morphs | 240–360ms | ease-in-out | Shared-element transitions earn the most time we're willing to spend |
| Guidance (one-shot) | 300–400ms, plays once | ease-out | Never loops; a looped nudge is a siren |

Three rules sit above the table:

1. **Faster on repeat.** The first time a pattern plays, 240ms; by the fiftieth use in a session it's friction. Patterns that fire constantly (list hovers, key-press feedback in an editor) live at the bottom of their range, or get their travel distance shortened instead — small distances read as fast.
2. **Time scales with distance, not with importance.** An accordion opening 600px of content takes longer than one opening 120px, because the eye is tracking the moving edge. Animate the *edge* (`height` is fine for accordions used occasionally; transforms with measured children when it fires often), and compute duration as `base + distance × k`, clamped under 400ms.
3. **Springs for play, curves for work.** Spring physics on a checkout button is a product announcing it doesn't take your money seriously. Springs suit canvases, drawers you fling, playful consumer surfaces; banking, health and admin UIs stay on curves. When in doubt: exponential ease-out, 160ms, done. That instinct is what we call the [160ms rule](/journal/web-design/motion-that-earns-its-keep), and it has ended more design debates than any other sentence in this studio.

## The quality test: does it answer a question?

The line between "expensive-feeling" and gimmick is one question: **what did the user just ask that this motion answers?** "Did my click register?" — answered by a press state. "Where did that panel go?" — answered by a collapse animation. "Is adding to cart working?" — answered by the cart ripple.

The corollary test for removal: mute the motion and watch a session recording. If nothing becomes confusing — no double-clicks, no hunting for dismissed elements, no repeated form submissions — the motion was character at best, freeloading at worst. If users re-click or lose track of elements, the motion was doing acknowledgement or orientation work and earns its frames. We've deleted more motion than we've added across studio history, and the deletion almost always improved both the feel and the metrics; the [Osprey configurator](/work/osprey-outdoor-configurator-launch) shipped with roughly half the animation of its first prototype and tested measurably faster on every task.

## The reduced-motion contract, in full

`prefers-reduced-motion: reduce` is not a niche switch. It covers vestibular disorders (for whom a parallax scroll can mean actual nausea), attention conditions, migraines, and everyone on a low-power device. Our contract: **every pattern in the taxonomy ships its fallback in the same pull request as the motion itself.** The mapping we use:

| Pattern | Full motion | Reduced fallback |
| --- | --- | --- |
| Hover/press | 120ms ease-out transform | Instant state change or ≤80ms opacity fade — opacity is almost always safe |
| Expand/collapse | Height animation | Instant swap with `aria-expanded` still announced — structure is the real information |
| Orientation morphs | Shared-element travel | Cross-fade ≤120ms, destination ends in place |
| Scroll reveals | Translate + fade on intersection | Content visible by default; no reveal at all |
| Parallax/marquee/hero canvases | Continuous motion | Static composition; generative canvases render one considered frame |
| Guidance pulses | Ripple/pulse once | Single instant state change plus a textual/ARIA status where the info matters |

Two traps we audit for specifically: **opacity fades are the safe currency** (anything that stays within its own box and changes only transparency rarely triggers vestibular issues — scale and travel are the hazards), and **the media query must gate JavaScript motion too**, not just CSS. A `matchMedia('(prefers-reduced-motion: reduce)')` check in the animation loop, or a Web Animations API duration forced to near-zero, keeps canvases and spring physics honest. The wider accessibility bar — contrast, focus states, target size — is covered in our [accessible handoff checklist](/journal/web-design/accessible-design-handoff); motion is one chapter of it.

Also respected in our starter: the form patterns from [designing forms people finish](/journal/web-design/forms-people-finish) — an error shake that plays once and reports via `aria-live`, progress that animates on change, and never an animation that delays the next field being usable.

## When to say no

The checklist we run before any micro-interaction survives review — a "no" to any of the first four means the pattern goes back:

1. **Does it answer a question the user just asked?** If it's proactive flair, it's a guidance or character play at best — is that the right spend here?
2. **Does it delay access to content or controls?** Motion may accompany a transition but may never gate one; the control is clickable from frame one.
3. **Does it survive being fired 40 times in a session?** Animate like the user's fiftieth encounter is the one that matters, because for retention, it is.
4. **Does it have its reduced-motion fallback written down?** Not planned — written, in the ticket.
5. **Is it the fifth one on this screen?** One character moment per viewport. Two is a theme park.

Motion is one of the few design materials that is load-bearing for comprehension, for trust and for brand at once — which is exactly why it can't be left to vibe. Taxonomise it, time it, give it a fallback, and ration it. Then the moments you keep land like punctuation instead of noise.

## Key takeaways

- Sort every micro-interaction into acknowledgement, orientation, guidance or character. Anything without a job is a freeloader — delete or demote it.
- Keep duration in tokens: ~120ms for hover, ~160–240ms for enters, shorter for exits; scale timing with travel distance, not importance.
- Springs for play, curves for work. Default to ease-out, 160ms, when unsure.
- Run the removal test: mute the motion and watch sessions — confusion means it earned its frames, quiet means it didn't.
- Ship the `prefers-reduced-motion` fallback in the same PR as every pattern; opacity fades and instant swaps are the safe currency.
- Cap character moments at one per viewport, and never let motion gate access to anything.

## FAQ

**Should hover states exist on touch devices?**
They can't fire reliably, so nothing may depend on them: any information revealed on hover must also be reachable via focus and tap, and the interaction model should treat hover as progressive enhancement. We still design them, because on pointer devices they carry real orientation value — a hover state is the interface saying "yes, this is a thing you can press."

**CSS transitions or JavaScript/FLIP animations?**
CSS transitions for everything state-based (hovers, toggles, simple enters/exits) — they're declarative, composited, and cheap. Reach for FLIP techniques or the Web Animations API when layout itself moves (reordered lists, orientation morphs) or when duration must depend on measured distance. Keep physics libraries for the rare genuinely physical surface; they earn their kilobytes maybe twice a year.

**Do micro-interactions hurt performance on low-end devices?**
They can if they animate layout or paint. Stick to transform and opacity, which stay on the compositor; audit anything that triggers style recalculation per frame; and respect `prefers-reduced-data` / `Save-Data` as secondary signals to simplify. Sounding fast is a feature of motion design too — a well-timed 120ms press state makes a 300ms network response feel instant.

**How do we keep motion consistent across a big team?**
Tokens plus a motion spec page: durations, easings and the taxonomy live as code (`--dur-press: 120ms`), raw duration values get the same lint treatment as raw colours, and a hidden spec route plays every pattern on demand. Consistency is what makes character moments read as brand rather than noise.

**What about motion in emails and other constrained surfaces?**
Assume almost no CSS animation support and no reliable hover: a GIF for the one moment that matters, everything else designed to communicate statically. If the email only works in motion, the email doesn't work.
