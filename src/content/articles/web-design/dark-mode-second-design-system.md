---
title: "Dark mode is a second design system"
description: "Treating dark mode as a CSS inversion is how you ship a grey smear. Here's how we design dark themes as a second, deliberate system — tokens, elevation, contrast and CI tests."
slug: dark-mode-second-design-system
cluster: web-design
tags: [dark mode, design tokens, colour contrast, theming, design systems]
date: 2026-03-17
author: June Okafor
keywords: [dark mode design, design tokens, colour contrast, theming, dark theme accessibility]
readingTime: 10
---

Every few months someone posts a dark mode toggle that took "twenty minutes with a CSS filter: invert." Every few months we inherit the wreckage: pure black voids, white text that buzzes, charts that invert their own data colours, and a brand palette that in the dark looks like an accident at the paint factory. The filter works, technically. So does a chainsaw haircut.

Dark mode is not a colour adjustment. It is a second design system that happens to share a component library with your first one. That framing changes every downstream decision: how you name tokens, how you do elevation, how you test, and who signs it off. This is how we run it at Brassfern — the same architecture behind the night theme we shipped for [Meridian Climate's data explorer](/work/meridian-climate-data-explorer) and the token discipline we described in [colour systems that survive dark mode and rebrands](/journal/web-design/colour-systems-dark-mode).

## Why the naive inversion fails

Three failure modes account for nearly every bad dark mode we've audited.

**Pure black, pure white.** The rookie dark theme is `#000` backgrounds with `#fff` text. Two problems. First, full-luminance contrast (21:1) causes halation — bright glyphs appear to bleed into the dark field — and it's genuinely tiring for readers with astigmatism. Second, pure black gives shadows nowhere to go. Elevation is communicated with shadow in light mode and with *lightness* in dark mode; a `#000` canvas flattens your entire hierarchy into one plane. We start dark surfaces at around 12–16% lightness, not zero.

**Hue inversion of meaning.** Data visualisation is where invert filters commit crimes. A red-to-green diverging scale becomes its own opposite: losses render green, gains render red. We've seen a finance dashboard proudly demoed in dark mode showing exactly the wrong story. Any meaningful colour — status, charts, diff highlighting — must be re-mapped by hand, never transformed.

**The dimmed but identical layout.** Light mode leans on warm paper tones and subtle tint differences to organise space. Invert that and the relationships survive badly: a well that was three degrees warmer than the page becomes three degrees cooler, and the eye reads it differently at night. Spacing, line weight and even typographic colour need adjustment, not just flipping.

## Semantic tokens are the whole game

If components reference raw colours, dark mode is a search-and-replace project that never ends. If components reference *roles*, dark mode is a mapping table. We've written the full three-layer architecture elsewhere — primitives, semantics, themes, enforced by linting ([testing design tokens in CI](/journal/engineering/design-tokens-pipeline-ci)) — but dark mode is where it pays its rent.

Two dark-theme-specific lessons we've learned the hard way:

**Double your elevation tokens.** In light mode, most products get away with two surfaces: page and card. Dark mode needs more, because separation no longer comes from shadow. We spec at least four: `surface/sunken` (wells, code blocks), `surface/base` (page), `surface/raised` (cards), `surface/overlay` (menus, dialogs). The steps between them are small — 3–5% lightness each. Big steps look like banding; small steps feel like light falling differently in the same room.

**Mute your accents, don't just brighten them.** The instinct is to raise accent luminance so buttons still pop. That works for one button on one screen and produces neon dashboards everywhere else. Instead, shift accent hues slightly and desaturate 10–20% for dark contexts. Saturated colours on dark backgrounds visually vibrate and fail contrast in edge cases you will not catch by eye. Our rule: every accent must hit 4.5:1 against its surface in *both* themes, measured, not eyeballed.

```css
[data-theme='dark'] {
  --surface-base: var(--ink-920);      /* ~13% lightness, not #000 */
  --surface-raised: var(--ink-880);
  --surface-overlay: var(--ink-840);
  --text-primary: var(--paper-200);    /* ~92% lightness, not #fff */
  --action-primary: var(--fern-350);   /* muted + brightened, re-mapped by hand */
  --chart-negative: var(--clay-300);   /* re-mapped, never inverted */
}
```

## Elevation and atmosphere

Light mode communicates depth with cast shadow. Dark mode communicates it with reflected light. That means two techniques light-mode designers rarely touch.

The first is **luminance layering** — the token ladder above. The second is faint **edge definition**: a 1px border at very low opacity (we use the light text colour at 8–12%) on raised surfaces. In light mode this reads as nothing; in dark mode it's the difference between a card that floats and a card that's indistinguishable from the page. Borders do the work shadows can't.

Drop shadows themselves should get *softer and darker*, not deleted. A light-mode shadow pasted into dark mode looks like fog. Halve the opacity, increase the blur, keep the offset. And question any glow effects: glows are the lens flares of dark UI — thrilling in the demo, exhausting in the product.

## Syntax highlighting is a theme within a theme

If your product shows code — docs, editors, dev tools, integrations pages — the syntax palette is a second dark-design problem hiding inside the first one. Light-theme syntax colours are chosen for contrast against white; pasted onto dark surfaces, half of them die and the other half scream.

We treat it as its own ramp with its own constraints: every syntax colour at 4.5:1 minimum against the code-block surface (which, remember, is `surface/sunken`, darker than the page), and adjacent token colours separated in *hue*, not just lightness, because proportional colour-vision deficiency doesn't care about your aesthetic. We keep a documented palette per theme and snapshot-test the rendered colours. The [design-token pipeline from Figma to production](/journal/engineering/design-tokens-pipeline) is what makes this survivable — the palette lives in one place and compiles to both themes.

## Testing both themes in CI, or it didn't happen

Manual dark-mode QA decays within a month of shipping. Someone adds a component, checks it in light mode (the default in every dev environment), merges, and the dark theme rots in the one place nobody looked. We enforce four mechanical checks:

1. **Contrast as a build step.** A script walks the resolved token pairs in both themes and fails the build under 4.5:1 for text roles, 3:1 for large text and non-text indicators. This catches the "muted brass on dark fern" class of mistake that every human reviewer squints past.
2. **Screenshot diffing in both themes.** Every visual-regression story renders twice. Dark-mode regressions show up in the same review as layout regressions, where they belong.
3. **A lint rule against raw colour in components.** No hex, no `rgb()` outside the token file. This is the single highest-leverage rule in the system; it makes re-theming a holiday instead of a quarter.
4. **The meta tag.** `<meta name="color-scheme" content="light dark">` and matching `color-scheme` CSS, so scrollbars, form controls and form-validation bubbles respect the theme. The fastest way to look unfinished is a beautiful dark app with blazing white native scrollbars.

One more operational rule: whoever ships a feature owns both themes at review time. "Dark mode follow-up ticket" is how dark mode becomes the product's junk drawer.

## The part nobody believes until launch

A good dark theme is not light mode at night. It's a sibling with its own tastes. At Meridian Climate, the night palette ended up *warmer* than the day one — brass tones slightly richer, greens slightly greyer — because cool accents on dark screens read as clinical, and the product is about public trust. Those decisions came out of critique and field testing, not a transform function. If your dark mode can be generated, it will feel generated.

Budget accordingly: for a mature product we plan dark mode as 15–25% of the design system's ongoing effort, front-loaded. Teams that plan a sprint of "invert the variables" end up paying that 25% anyway, in incident reports.

## Key takeaways

- Pure black backgrounds and pure white text cause halation and destroy elevation; start surfaces at 12–16% lightness and text just under full white.
- Components must speak semantic tokens only; dark mode is then a mapping table, enforced by a lint rule against raw colour in component code.
- Dark-mode elevation comes from luminance layering plus faint borders, not heavier shadows.
- Never invert meaningful colour (charts, status, diffs) — re-map it by hand.
- Syntax highlighting needs its own tested palette per theme.
- Automated contrast checks and dual-theme screenshot diffs are the only dark-mode QA that survives.

## Frequently asked questions

**Should dark mode be the default if the OS says so?**

Respect `prefers-color-scheme` for the initial paint, always — a flash of white at 11pm is a small act of violence. But persist the user's explicit choice in local storage and let it override the OS; preference stated beats preference inferred.

**How do we handle brand colour in dark mode?**

Define a dark-context variant of every brand role up front, in the same review as the light one. If brand owns "the blue," they also own "the blue at night." Brands that refuse to flex for dark contexts should not ship dark mode.

**Do images and photos need separate dark treatment?**

Sometimes. Photos rarely need reprocessing, but consider a subtle dark scrim on very bright imagery, and provide dark variants of anything with a transparent background — especially logos and diagrams with black strokes, which vanish.

**Is dark mode an accessibility feature?**

It's a preference feature with accessibility overlap. It helps some users (photophobia, migraine, some low-vision profiles) and hurts others (astigmatism, some dyslexia profiles). It never replaces hitting contrast minimums in both themes.

**When is dark mode not worth building?**

When your token architecture is immature, when your product is mostly content consumed in daylight contexts, or when nobody on the team will own it after launch. A neglected dark mode is worse than none — ship it as a commitment, not a flag.
