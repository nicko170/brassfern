---
title: "Focus-visible: designing the ring, not removing it"
description: "Keyboard focus styles are a design problem most teams delete instead of solve. How to design focus rings that are visible, beautiful and part of the identity system."
slug: focus-visible-beautiful
cluster: web-design
tags: [accessibility, interaction design, design systems, css]
date: 2026-07-06
author: Aiko Tanaka
keywords: [focus visible design, keyboard focus styles, accessible focus indicator, focus ring css]
readingTime: 8
---

Somewhere in the first week of almost every redesign project handed to us, a global CSS rule quietly appears or survives: `*:focus { outline: none; }`. Nobody remembers adding it. Somebody, once, found the default focus outline ugly, removed it everywhere, and shipped. The keyboard experience of the entire site was deleted to improve a screenshot.

We understand the impulse. Browser defaults are an accident of history — a dotted 1px outline that clips against dark backgrounds and disappears into busy ones. But the conclusion "focus styles are ugly, therefore remove them" is like concluding that fire alarms clash with the lobby and disconnecting them. The focus indicator is how a keyboard user knows where they are. It's the cursor for everyone who doesn't use a mouse. Remove it and you've made the site unusable for a slice of your audience in exchange for a marginally cleaner look on your Dribbble shot.

The designful conclusion — the one we'd expect from any senior team and hold ourselves to as part of [WCAG AA for product teams](/journal/product/wcag-aa-product-teams) — is that focus rings deserve the same craft as hover states, motion and type. This is how we design them.

## First, restore the distinction browsers already gave you

The core CSS is three lines and a philosophy:

```css
:focus { outline: none; }
:focus-visible { outline: 2px solid var(--fern); outline-offset: 3px; }
```

`:focus` fires for any focused element, including after a mouse click. `:focus-visible` fires when the browser heuristically decides the focus should be visible — after keyboard navigation, script focus, or a tap on certain controls. This distinction exists precisely so you can stop fighting the false trade-off: mouse users don't see rings on every click, keyboard users always see where they are. Any design that relies on `@media (hover: hover)` hacks to approximate this is reimplementing a shipped, well-tested browser heuristic in worse code.

The trap pairs are worth naming: `outline: none` with no replacement (the deletion), replacing `outline` with a `box-shadow` on the element but forgetting elements that render shadows badly (some inputs, clipped containers), and — subtlest — removing the outline but relying on a colour change alone, which fails WCAG's non-colour-contrast requirement for focus indication.

## Design the ring as part of the identity

A focus ring is a brand decision. On our own site, it's a 2px fern ring with a 3px offset — echoing the hairline rules and ink of the editorial system rather than a generic browser blue. On a client with a warmer palette, it might be a brass double ring. The point is the ring is specced in tokens like everything else:

- **`--focus-ring-color`** — chosen against the *page* palette with a contrast check, not assumed from the brand colour. WCAG 2.2's focus-appearance criterion asks for at least 3:1 contrast between the indicator and adjacent pixels. On our paper background, fern clears this comfortably; the same ring on the dark night-band sections flips to a brass token because fern-on-night fails. This is the same "tints and opposites by surface" logic as [colour systems that survive dark mode](/journal/web-design/colour-systems-dark-mode).
- **`--focus-ring-offset`** — the gap between element and ring. A 3px offset reads as crisp and intentional; a 0px outline butted against the element reads as the browser default with delusions.
- **`--focus-ring-radius`** — inherit the component's own `border-radius` where CSS allows, or match it explicitly so the ring hugs a pill-shaped button as a pill, not a rectangle.

Offset, thickness and radius together form a *signature*. A 3px-offset, 2px, rounded ring has become a quiet Brassfern tell on our sites the way a particular easing curve is: consistent enough that keyboard users learn "yes, that's this brand's focus" within three tab presses.

## Rings on hard cases

The easy cases are links and buttons on a pale page. Real design work starts on the surfaces where a simple outline breaks:

**On dark sections.** Flip the token. We do this at the section level — a data attribute sets the ring colour, not one-off overrides per component. One well-placed `data-theme="night"` and every focus ring in the section inverts correctly forever.

**On images and media.** A ring over a photograph is illegible by definition. Use a double ring: a thin high-contrast line in the *opposite* contrast direction outside the main ring, so regardless of the pixels beneath, one of the pair reads. Some teams draw focus as an inset border + internal-shadow pair instead; either is fine as long as it survives both a white sky and a black jacket in the same hero.

**On clipped or overflow-hidden components.** An offset ring on an element inside `overflow: hidden` gets guillotined. Fix at the component layer: add padding inside the clip boundary, or ring the inner focusable element instead of the clipped card shell. This is the single most common way focus rings "mysteriously disappear" after a component refactor — the same class of silent regression as [sticky chrome eating anchor links](/journal/web-design/sticky-elements-that-dont-annoy): visible only when you actually drive the interface by keyboard.

**On custom controls.** A hand-rolled toggle, slider or segment control needs the ring on the *control*, not on a hidden input that technically holds focus. This means wiring `:focus-visible` to the visually rendered peer in the component, with `peer-focus-visible:` or explicit class forwarding. Test the map, not the input.

**In components with their own indicating style.** A selected tab, an active segment, a pressed-but-held button: these states overlap with focus. Design them as orthogonal signals — selected is fill, focus is ring, never one signal doing both jobs, or the user can't tell where they are from what they've chosen.

## The ritual that keeps it alive

Focus design decays by refactor, not by malice. The countermeasure is a ritual, not a linter:

1. **The Tab Walk at every design review.** Before any screen is called done, a designer drives it by keyboard alone — through every control, into every menu, back out again. Two minutes. It catches missing rings, wrong ring colours, focus traps and the controls that were never reachable in the first place. This pairs naturally with [engineering keyboard-first interfaces](/journal/engineering/keyboard-first-interfaces): design and engineering look at the same walk.
2. **A token-level diff check in CI.** If the focus-ring token changes, the design system flags it for human review. Small change, big blast radius.
3. **One person owns focus styles.** Not "accessibility champion" as an honorary title — one named person whose crits ask the ring question by default. Ours lives with the senior product designer on each squad, which is why this article exists.
4. **Test the paths that matter.** The login form, the checkout pay button, the search field, the primary CTA of the hero. We run these as scripted keyboard paths in the same suite as our visual regression tests; a focus regression on a purchase button is a revenue bug, not an accessibility nicety.

## Why this is worth the effort

There's a utilitarian case — keyboard users include people with motor impairments, power users, assistive-technology users, screen-reader users, and anyone tabbing through a form on a laptop — and a legal case in most markets. But the design case is stronger and more durable: an interface that shows you where you are, in the brand's own visual language, feels *finished*. Focus rings are the interface's way of maintaining eye contact. Sites that remove them feel like talking to someone staring at their phone. You can't always name what's missing, but you feel it.

And the cost of doing this well is nearly zero once it's tokens and ritual. The expensive version is the retrofit — auditing a hundred un-ringed components after somebody asks, on behalf of a procurement team, for your accessibility statement.

## Key takeaways

- Deleting outlines is not a design decision; it's removing the interface's cursor for keyboard users.
- Use `:focus-visible` as the contract: keyboard focus always shows the ring, mouse clicks don't.
- Design the ring as brand — tokenised colour per surface, offset and radius as a signature, drawn to 3:1 contrast.
- Handle the hard cases deliberately: dark sections, images, clipped containers, custom controls, and components with selected/active states.
- Keep it alive with a Tab Walk ritual, a token-change CI check and one named owner per squad.

## FAQ

**Is `:focus-visible` safe to rely on today?**
Yes, as the primary trigger, in every current browser. For controls where the heuristic is genuinely ambiguous — custom components, canvas-adjacent widgets — add an explicit class fallback, but don't polyfill your way back to 2019.

**What about focus-within for composite components?**
Different job. `:focus-within` highlights the container while any child has focus — useful on cards of controls, compound inputs, menus. Use it in addition to `:focus-visible`, not instead of it.

**Should focus rings animate?**
Subtly, if at all. A 120–160ms fade of the ring easing in can feel polished; anything longer makes rapid tabbing feel laggy because the ring chases the user. And it honours reduced-motion settings like every other state transition we ship.

**Our brand colour fails contrast on our own background. What now?**
Don't bend the contrast rule; change the ring's hue, offset, or add the double-ring treatment. A brand that can't indicate its own keyboard focus on its own pages has a palette problem that will surface elsewhere too — fix it in [tokens and colours](/journal/web-design/colour-systems-dark-mode), not by invisibility.
