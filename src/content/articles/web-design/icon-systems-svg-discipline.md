---
title: "Icon systems: SVG discipline for the web"
description: "Most icon sets decay into a junk drawer of mismatched SVGs. Grid rules, stroke discipline, sprite strategy and the build-time pruning that keeps an icon system honest."
slug: icon-systems-svg-discipline
cluster: web-design
tags: [design systems, svg, icons, front-end]
date: 2026-06-18
author: June Okafor
keywords: [svg icon system, icon design guidelines, icon sprite svg, design system icons]
readingTime: 9
---

Every mature product has an icon drawer, and every icon drawer lies a little. It says "64 icons" and contains 64 icons in the sense that a kitchen drawer contains utensils: yes, they're all in there, but half are duplicates with different names, three are the same symbol drawn at different sizes by different contractors, one is 340 kilobytes because it's secretly an embedded PNG, and the whisk you actually need is missing.

Icons are the smallest assets in a design system and the most frequently shipped. They cross from Figma to code a hundred times a year, and each crossing is an opportunity for drift. This is the discipline we hold so the drift never starts — the brand-side strategy of when and why icons carry identity lives in [icon systems as brand assets](/journal/brand/icon-systems-brand-assets); this piece is the engineering of taste: grids, strokes, sprites and pruning.

## One grid, optical corrections

Icons live on a grid or they live by vibes. Our standard: a 24×24 base grid with a 2px safe zone, drawn at 24 and used at 16, 20, 24, 32. Key shapes (circle, square, horizontal and vertical bars) have fixed box sizes — circle 20px, square 18px, bars full-bleed to 20 — so a set of icons side by side has consistent visual weight even though the bounding boxes differ. This is the part teams skip because it's "just" four numbers, and it's exactly the part that separates a system from a clip-art folder.

Then the caveat that separates the seniors from the style guide: **grids are for building, eyes are for shipping.** A play triangle geometrically centred looks optically left; a circle and a square of identical pixel height look different sizes. Every icon gets an optical pass — nudge the triangle right by half a pixel, overshoot the circle's box by half a pixel — and that correction is *part of the asset*, committed, not a designer's secret knowledge. When the grid says one thing and your eyes say another, your eyes win in the file and the grid wins in the documentation.

Sizes below 16px are a different icon, not a scaled one. If you genuinely need 12px utility icons, draw a dedicated micro-set with simplified shapes and thicker strokes. `transform: scale()` on a 24px icon renders like a JPEG of a fax.

## Stroke discipline is the whole game

Pick a stroke weight per size and treat it as law: for us, 1.5px at 24px grid, 1.25px at 20, 1px at 16 — always targeting the same *visual* weight, not the same number. Three rules keep a stroke set coherent:

1. **Round joins and caps, always** (or never — but pick one). Mixed caps are the fastest way to make a set feel assembled from four icon packs. It usually was.
2. **Strokes expand before export.** Outline every stroke in the source file. Then the SVG is fills all the way down: no `stroke-width` rendering differences between browsers, no scaling surprises, no designer changing the weight in code and breaking the optical balance you argued about for an afternoon.
3. **Filled variants are drawn, not toggled.** A filled version of a stroked icon is not the stroked icon with `fill` slapped on; inner counters close up and the shape reads as a potato. Draw the filled state as its own glyph with preserved negative space.

Corner radii get the same treatment: one radius for inner corners, one for outer, written down. It sounds fussy until you place a new icon next to a two-year-old one and they look like siblings instead of strangers.

## One source of truth, then components

In code, one wrapper component owns the contract:

```tsx
export function Icon({ name, size = 20, label }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      className="icon"
    >
      <use href={`#icon-${name}`} />
    </svg>
  )
}
```

Everything flows from this. `viewBox` is fixed, CSS owns colour, and the accessibility decision is made in one place instead of in two hundred call sites — the same "one component encodes the policy" principle we apply across the [design tokens pipeline](/journal/engineering/design-tokens-pipeline).

**Sprites vs inline.** For a content site, an SVG sprite injected once and referenced with `<use>` wins: forty icons cost one parse, and repeated icons (arrows, close, external-link) reference rather than duplicate. Inline `<svg>` per call site wins when a page uses one or two icons total, or when you need to animate internals per instance. What loses every time is the React-component-per-icon barrel file that lets bundlers include the entire set on a page that renders a hamburger and an arrow. That's how 40KB of icons sneak into your hero chunk — the kind of leak our [bundle budget discipline](/journal/engineering/bundle-budget-discipline) exists to catch in CI.

**Colour: `currentColor` and nothing else.** Icons inherit text colour. No hex codes in path data, no hard-coded brand colour that breaks the day the icon sits on a dark section. Two-tone icons are a trap; if identity demands one, implement it as two explicitly named CSS custom properties and accept the maintenance burden knowingly. The day your theme system matures, single-colour icons will be the ones that survive it — the same argument as [colour systems that survive dark mode](/journal/web-design/colour-systems-dark-mode).

**Transforms are a smell.** `style={{ transform: 'rotate(180deg)' }}` on a chevron works and is occasionally pragmatic, but if an icon is commonly flipped (expand/collapse, back/forward), ship the directional glyphs. Rotated icons invert asymmetric details in ways that read as subtly wrong, and RTL internationalisation will come for the rotations anyway.

## Accessibility is an API decision

Icons have exactly two accessibility states: **decorative** and **meaningful**. Decorative (an arrow beside the word "Next", an icon inside a labelled button) gets `aria-hidden="true"` and no accessible name — full stop. Meaningful (a standalone icon-button, a status dot) gets an accessible name via `aria-label` on the control or `role="img"` plus a `<title>`. The catastrophic state is the third one teams invent: decorative icons exposed to screen readers, so a toolbar announces "image, image, image" like a haunted photo booth.

The Icon component above encodes this by requiring an explicit choice: pass `label` and the icon is meaningful; omit it and the icon vanishes from the accessibility tree. No default that guesses. We cover the audit ritual for this class of bug in [accessibility starts in the design file](/journal/web-design/accessible-design-handoff), but the cheapest fix is the one where an icon *cannot* be added without declaring its meaning.

## Pruning: the drawer is not a museum

Icon sets grow monotonically unless someone is paid to subtract. Our hygiene, run quarterly and enforced in CI:

- **Dead icon detection.** The sprite build maps which icon IDs are referenced in source. Anything unreferenced for two release cycles is deleted. Exceptions require a comment explaining why; "might need it" is not a why.
- **Duplicate detection.** A build step hashes normalised path data and fails on near-duplicates. This one script ends the era of `arrow.svg`, `arrow-right.svg` and `ArrowRight_Final_v2.svg` being three different arrows.
- **Weight budget.** The entire sprite ships under a cap (ours is 20KB gzipped for marketing sites, 40KB for product apps). SVGO runs at build with a checked-in config — never ad-hoc per export, because an over-aggressive `cleanupIds` will gleefully break your `<use>` references at 11pm on a Friday.
- **Naming review.** Names describe function, not shape: `icon-secure` can change its drawing; `icon-lock-with-shackle` cannot without a migration. Renames are cheap in year one and brutal in year three, so the taxonomy is decided before icon number thirty, not after.

New icons enter through the same door as every design-system addition: a one-paragraph case (what it means, where it's used, why no existing icon works), a grid check from a second designer, and the filled/stroked pair drawn together or not at all.

## The taste test

In critique, an icon set is judged the way you'd judge a choir: one at a time tells you nothing. Grid twenty of them at 16px on an actual screen background, blur your eyes, and ask which ones sing louder. Fix the loud ones. Then shrink to 12px and ask which ones still say anything at all — those are your survivors if the micro-set ever happens. Icons are a place where restraint is visibly, measurably better than expression. The interesting icons are the ones your brand gets to be; everything else should be as quiet and correct as a door handle.

## Key takeaways

- Fix one grid with explicit key shapes, then let optical corrections override geometry — and commit the corrections to the asset.
- Stroke discipline is the system: one weight per size, round joins throughout, strokes outlined before export, filled variants drawn separately.
- One Icon component owns sizing, colour (`currentColor` only) and the decorative-vs-meaningful accessibility decision.
- Sprites + `<use>` for icon-dense pages; inline for sparse ones; React barrel files for the whole set, never.
- Prune quarterly: unreferenced icons deleted, near-duplicates rejected in CI, the sprite under a byte budget with checked-in SVGO config.
- Name icons for function, not shape, and decide the taxonomy before icon thirty.

## FAQ

**Uneven third-party icon library or draw our own?**
Use a disciplined open library (consistently gridded, outlined-stroke exports available) for utility icons; draw your own where identity matters — product marks, empty states, anywhere the brand voice lives. Blending two libraries is worse than either alone.

**How do we keep Figma and code in sync?**
One direction only: design tool is the source, code sprite is generated by a build script on a scheduled sync with a diff in the pull request. Hand-exported SVGs committed by developers are how the drawer fills with whisks nobody ordered.

**Should icons animate?**
Sparingly, and only where the animation carries state information (menu-to-close, play-to-pause). Decorative icon animation is motion that doesn't earn its keep. And every animated icon honours reduced motion, the same as every other animated thing we ship.

**What about icon fonts?**
No. They're an accessibility and rendering dead end (screen readers announce ligature gibberish, blocked fonts give tofu boxes), and the caching advantage died with HTTP/2. SVG won this argument years ago; the sprite is the settlement.
