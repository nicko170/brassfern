---
title: "Focus states are a design system feature, not a browser default"
description: "Stop inheriting the browser's focus ring. Design it: tokens, 3:1 contrast on every surface, dark-theme variants, and the overrides that silently break keyboards."
slug: focus-states-design
cluster: web-design
tags: [accessibility, focus states, design systems, keyboard navigation, design tokens]
date: 2026-07-02
author: June Okafor
keywords: [focus visible css, focus ring design, keyboard accessibility design, focus state tokens, accessible design systems]
readingTime: 10
---

Every interactive element on your site has five states in your design file: default, hover, pressed, disabled, loading. It has a sixth — focused — that lives in exactly one place: the browser's default stylesheet. This is how you get a site where every hover is a considered easing curve and every keyboard user is navigating with the same dotted outline Netscape shipped in 1997, frequently invisible against your brand palette.

The focus state is not a browser concern. It's the most-used state on any keyboard-heavy flow and, unlike hover, it's a *promise*: you are here, this is where the next Enter goes. Treat it like the design-system citizen it is.

## The accessibility case, in one paragraph

WCAG's focus requirements are the floor, not the target: focus must be visible (2.4.7), the indicator must have at least 3:1 contrast against *adjacent* colours with a minimum area (2.4.11, AA as of 2.2), and focus must never be obscured by your own sticky headers and cookie banners (2.4.12). But the deeper argument isn't compliance — disabled users are not the only keyboard users. Power users tab through forms at speed. Screen-reader users *are* the focus sequence. Anyone who broke their wrist last week is a temporary keyboard-only customer. Our working catalogue of the AA traps that ambush product teams is in [WCAG AA for product teams](/journal/product/wcag-aa-product-teams); this article is the design side of one requirement done properly.

## Designing the ring like it's yours

A designed focus state has four decisions, and none of them is "blue outline, obviously."

**Shape.** Outlines hug the element's border-radius — a 4px-rounded button gets a 4px-rounded ring if you use `outline` with `outline-offset`, which is why we default to it over box-shadow tricks (outlines also honour forced-colors mode, which box shadows do not). The offset matters: `outline-offset: 2px` separates the ring from filled buttons so it can't melt into the background.

**Weight.** Two pixels minimum, three reads as confident. Thickness is a scale decision like any other — our rings share the 2px weight of our hairline rules doubled, so the focus state rhymes with the rest of the system rather than arriving from a different universe.

**Colour and the 3:1 problem.** Here's the trap: the ring must contrast 3:1 against *both* the element it wraps and the surface behind it when those differ. One token almost never survives every combination. The robust pattern is a two-tone ring — an outer light stroke and inner dark stroke (or vice versa) — so at least one tone clears 3:1 on any background. It looks intentional too, which disguises the fact that it's a compliance structure.

**Motion.** A ~120ms ease-in on `outline-offset` (from 1px to 2px) or a gentle opacity ramp makes focus feel alive without being decorative. Keep it under the house 160ms ceiling from [motion that earns its keep](/journal/web-design/motion-that-earns-its-keep), and respect `prefers-reduced-motion` by showing the end state instantly — for keyboard users the ring is wayfinding, not garnish, so faster is better.

## One token, every surface

If you maintain focus styles as per-component overrides, they'll drift the first sprint a new button variant ships. Focus belongs in the token layer — the same discipline we argue for across the whole pipeline in [design tokens are an API](/journal/engineering/design-tokens-pipeline):

```css
:root {
  --focus-width: 2px;
  --focus-offset: 2px;
  --focus-ring: var(--fern-2);
  --focus-ring-contrast: var(--paper);
}

:focus-visible {
  outline: var(--focus-width) solid var(--focus-ring);
  outline-offset: var(--focus-offset);
}
```

The important line is the second custom property. Dark sections, tinted wells, night-mode footers: each theme context overrides `--focus-ring` and `--focus-ring-contrast` exactly the way it overrides text colour. A ring that passes 3:1 on your paper background and vanishes on your dark CTA band is a bug in the token layer, not the component. If you run a dark theme, it needs its own focus tokens — dark mode is [a second design system](/journal/web-design/dark-mode-second-design-system), focus rings included.

Define the ring *twice* everywhere: light tone and dark tone, painted as a double ring (`box-shadow: 0 0 0 2px var(--focus-ring-contrast), 0 0 0 4px var(--focus-ring)` for the two-tone variant when outlines won't reach). One tone is a gamble per surface; two tones are a guarantee.

## `:focus-visible` and the mouse-user myth

The historic excuse for removing outlines was "mouse users hate the ring on click." `:focus-visible` retired that excuse: browsers only apply it when focus was reached by keyboard or other non-pointer means. Ship your designed ring on `:focus-visible` and plain `:focus` styles on text inputs (where typing context makes pointer focus meaningful too).

Two subtleties bite in production. First, `:focus-visible` heuristics reset on click — a button that opens a menu and keeps focus may or may not show the ring, by spec ambiguity. Test it, don't assume it. Second, removing the default outline *without* replacing it (`outline: none` with nothing after) is still the single most common way sites fail keyboard users. Lint for it. It's a one-line stylelint rule and it pays for itself the first time it fires.

## Designing focus *order*, not just focus *style*

The prettiest ring in the world can't fix a focus sequence that teleports. Three order decisions are design decisions, not developer defaults:

- **Move focus on purpose.** Opening a modal or menu: focus moves *into* it — to the heading or first control, with the ring visible — and returns to the trigger on close. A modal that opens while focus stays on the button behind it is a keyboard trap with a backdrop filter. The broader choreography of these flows is in [keyboard-first interfaces](/journal/engineering/keyboard-first-interfaces).
- **Skip links are designed objects.** "Skip to content" should be a styled, on-brand element that appears on first Tab — not an afterthought clip-path. Design it like the emergency exit: invisible until needed, unmistakable when shown.
- **Delete focus black holes.** Custom selects, infinite scrollers and infinite calendars love to swallow Tab. Every such component in the design file should carry a small annotation: where focus enters, where it exits, and what Escape does. If that's not in the spec, it won't be in the build — this is what [accessibility starts in the design file](/journal/web-design/accessible-design-handoff) means in practice.

## The overrides that silently break it

A field guide to the quiet saboteurs we find in audits, roughly in order of how often they appear:

1. `* { outline: none }` in a reset — kill on sight.
2. `tabindex="-1"` on things that are actually interactive, usually to silence a validator.
3. Focus trapping that never releases: menus without Escape handling, modals that trap forever.
4. Positively-valued `tabindex` (tabindex="3") scrambling document order.
5. Custom components built from `<div>`s that fire on click and nothing else.
6. Focus rings drawn with box-shadow, then evaporating in Windows forced-colours mode.
7. Sticky headers covering the focused element — the 2.4.12 failure nobody scroll-tests.

Every one of these passes a visual QA. Only keyboard testing catches them, which is why one full keyboard pass per template belongs in every sprint exit criteria. We run ours alongside the audit process in [running an accessibility audit that leads to fixes](/journal/product/accessibility-audit-process).

## Key takeaways

- Focus is a designed state: shape, weight, colour and motion, specified like hover — not inherited from the browser.
- Use a two-tone ring (light + dark stroke) so 3:1 contrast survives every surface; theme it through tokens, including dark sections.
- Style `:focus-visible`, keep `:focus` on text inputs, and lint ruthlessly against bare `outline: none`.
- Design focus *order*: focus moves into modals and menus deliberately, skip links are styled components, and every custom widget documents its keyboard contract.
- The failures are invisible to visual QA — keyboard-test every template, every sprint.

## FAQ

**Are browser default focus rings good enough?**
They're accessible-ish and brand-hostile. Chrome's default ring fails 3:1 on plenty of brand backgrounds. If you've customised everything else about your site, shipping the default ring is shipping someone else's component.

**Outline or box-shadow?**
Outline first: it honours border-radius now, respects forced-colors mode, and doesn't disturb layout. Box-shadow for the two-tone variant or when you need ring + shadow simultaneously. Never box-shadow alone.

**Should focus and hover styles match?**
No — they have different jobs. Hover says "you could act here"; focus says "you *will* act here with Enter." Conflating them trains keyboard users to distrust the ring. Related, but distinguishable.

**How do we test this without a specialist?**
Unplug the mouse for ten minutes per template. Tab the whole journey: can you see where you are at every stop, reach every control, and escape every trap? That test, run by the designer who built the screens, catches 80% of what audits find.

*Focus states, tokens, keyboard flows — it's all part of the design systems work in our [brand & identity](/services/brand-identity) and [product](/services/product) engagements. [Start a conversation](/contact).*
