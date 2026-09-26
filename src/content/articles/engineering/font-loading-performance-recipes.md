---
title: "Font loading: recipes from the network tab"
description: "Webfonts are where performance budgets go to die quietly. Subsetting in CI, unicode-range slicing, per-role font-display policies, and the CLS nobody plans for."
slug: font-loading-performance-recipes
cluster: engineering
tags: [performance, typography, webfonts, cls]
date: 2025-08-14
author: June Okafor
keywords: [webfont performance, font subsetting, font-display strategy, cls fonts]
readingTime: 8
---

Open the network tab on most marketing sites and scroll past the JavaScript. There they are: four weights of a grotesk, two of a serif, an italic nobody uses, 480 KB of compressed fonts, arriving whenever they feel like it, rearranging the page like furniture thieves. Fonts are the most lovingly chosen and least audited assets on the median website.

The design side of this story — choosing two families and eleven styles when you could choose one family and four — is covered in our piece on [type systems that load fast](/journal/web-design/typography-that-loads). This article is the engineering twin: what to do in the build pipeline and the network layer once the typeface decision is made. These are the recipes we run on every Brassfern build, including this one.

## Recipe 1: subset in CI, and commit the subsets

A retail font ships with several thousand glyphs. Your marketing site uses maybe three hundred: basic Latin, punctuation, a currency symbol, some curly quotes. Subsetting with `pyftsubset` (fonttools) routinely cuts a woff2 from 90 KB to 20 KB.

The mistake is subsetting as a one-off manual step. Somebody adds an em dash in November, the subset from March doesn't include it, and your body copy falls back to a system em dash that's visibly the wrong width — a bug only designers see, filed as a screenshot with a sad emoji.

So subsetting lives in CI or not at all:

```bash
pyftsubset Fraunces-var.woff2 \
  --unicodes="U+0020-007E,U+00A0-00FF,U+2010-2027,U+2030,U+20AC" \
  --layout-features="kern,liga,ss01" \
  --flavor=woff2 \
  --output-file=fraunces-latin.woff2
```

Rules that keep us honest: the unicode ranges live in a checked-in config file with a comment explaining every range; the build **fails** if published content contains a codepoint outside the declared ranges (a thirty-line script does this — scan the prerendered HTML, diff against the subset); and the subsets are committed so a content editor can see font files change in review.

If subsetting feels like overkill for your site, that's a signal your content is ASCII-pure *today*. It won't be when someone writes "mānuka", "Facadé", or a proper お疲れさま.

## Recipe 2: unicode-range for the genuinely big cases

Subsetting solves the common case. The hard case is a site that *does* need to render Vietnamese, Greek, or full multilingual editorial content from one variable font. Shipping a 300 KB pan-Unicode file to Sydney readers of an English-language journal is rude.

`unicode-range` in the `@font-face` block is the answer the platform already gave us. Declare the same family multiple times — one face per range — and the browser only downloads the slices the page actually uses:

```css
@font-face {
  font-family: 'Editorial';
  src: url('/fonts/editorial-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+2000-206F;
}
@font-face {
  font-family: 'Editorial';
  src: url('/fonts/editorial-vietnamese.woff2') format('woff2');
  unicode-range: U+0102-0103, U+1EA0-1EF9;
}
```

A Vietnamese article pulls both files; an English one pulls only Latin. The slicing itself is mechanical — same `pyftsubset`, once per range — and it composes with Recipe 1: your CI script emits a directory of slices plus the CSS that references them. Nobody hand-maintains anything.

One trap: `unicode-range` selection is *per glyph*, so a page with a single Vietnamese diacritic pulls the whole Vietnamese slice. That's fine — it's the correct granularity. But it means a stray "café" doesn't escape the Latin slice, which is why we keep Latin-1 Supplement inside the base range.

## Recipe 3: font-display is a product decision, per role

`font-display: swap` everywhere is the Cargo cult answer. The honest answer differs by what the font *does*:

- **Body text: `swap`.** Content appearing fast beats type appearing perfect. With good metric-matched fallbacks (Recipe 4) the swap is nearly invisible.
- **Display headlines: `swap` with a fast fallback** — or consider `fallback`, which gives the webfont a ~100 ms grace period before showing the fallback at all. For short hero lines on fast connections, `fallback` avoids the swap entirely for most visitors.
- **Icon fonts: `block`, or better, don't.** An icon font that swaps renders tofu boxes as content. Our actual advice is SVG sprites; but if you're stuck with an icon font, `block` is the only consistent policy.
- **Branding-critical wordmarks:** if a logo is typeset in the brand font, consider rendering it as SVG so it's pixel-stable and instant, independent of font loading entirely. We did exactly that for the client wordmark walls on this very site.

Whatever you choose, write the policy in a comment next to the `@font-face`. "Fraunces: swap — display serif, metric-matched fallback below. Do not change without re-auditing CLS" has saved us from at least one well-meaning refactor.

## Recipe 4: metric-matched fallbacks, or accept the CLS

When a webfont swaps in over a fallback with different metrics, text reflows. That's Cumulative Layout Shift, it's a Core Web Vital, and it's the metric most font guides wave at vaguely. The fix is concrete: a fallback whose advance widths and x-height match your webfont, or an *override* face that adjusts a system font to match via `size-adjust`, `ascent-override` et al.

Modern approach — the `@font-face` override block:

```css
@font-face {
  font-family: 'Fraunces Fallback';
  src: local('Georgia');
  size-adjust: 102.3%;
  ascent-override: 96%;
  descent-override: 26%;
  line-gap-override: 0%;
}
```

Getting those percentages right used to mean an afternoon with Fontaine or manual nudging. Now Capsize or the newer tooling computes them from font metrics in your build. The result: the fallback occupies the same boxes as the final font, the swap moves nothing, and your CLS contribution from fonts is zero rather than the 0.15 we regularly inherit in audits. If you're building toward a [field-tested Web Vitals budget](/journal/engineering/core-web-vitals-field-guide), font CLS is the cheapest win in the whole ledger.

## Recipe 5: preload one file, not seven

`<link rel="preload" as="font">` is a scalpel people use as a sprinkler. Every preloaded asset competes with your LCP image and your critical CSS for bandwidth. Our rule: **preload at most two font files — the ones above the fold** — typically the display face and the body face, at their default weights only. Italics, bolds and display [560]s load on demand; by the time anyone scrolls to them they've arrived quietly.

And the boring non-negotiables that still get missed: `crossorigin` on the preload (fonts are always fetched CORS-mode, even same-origin — a preload without it downloads twice), woff2 only (WOFF and TTF are dead weight in 2026), self-hosting (the third-party-font-CDN DNS+TLS roulette costs more than it saves), and long-lived immutable cache headers, since a content-hashed font URL is the dictionary definition of immutable. Fonts slot into the same [caching cake](/journal/engineering/caching-strategy-content-sites) as every other static asset.

There's also an INP side-effect people miss: a font arriving mid-interaction can trigger a style recalc that lands in someone's click handler. It's rarely the top offender, but on sites with heavy typography-driven layouts it shows up in the [real-user monitoring](/journal/engineering/core-web-vitals-field-guide) traces as a mysterious long task. Tight subsets and early arrival are the cure there too.

## The audit we run before any launch

1. Network tab, throttled: total font bytes under 120 KB for a marketing site, under 200 KB for editorial with extended scripts.
2. Coverage script: every codepoint in the prerendered HTML is inside a declared subset.
3. CLS trace with cache disabled, fonts forced slow: layout shift attributable to fonts under 0.02.
4. No `preload` beyond two files; every preload `crossorigin`-correct.
5. Fallback faces defined and metric-matched; policy comment present on every `@font-face`.

It fits on an index card. It has caught a 380 KB regression more than once, including the week before a client's funding announcement, which is exactly when you don't want the typography collapsing on investor laptops.

## Key takeaways

- Subset fonts in CI and fail the build when content escapes the declared ranges; commit the subsets so changes are reviewable.
- Use `unicode-range` slicing for multilingual content — the browser downloads only the scripts each page uses.
- Set `font-display` per role (swap for body and display, block only for icon fonts — which you should replace with SVG).
- Metric-match your fallbacks with override faces; font CLS is a solved problem if you bother to solve it.
- Preload at most two above-the-fold font files, always with `crossorigin`; keep fonts on the same immutable-cache diet as your other static assets.
- Audit font bytes and font CLS like any other budget line — before launch, not after Lighthouse emails you.

## FAQ

**Variable fonts: one file or split statics?**
Variable almost always wins — one file covering 380–700 weight beats four statics of the same family. Split only when you need different *scripts* in different files (Recipe 2) or when a legacy corporate font ships broken variable tables.

**Is `font-display: optional` ever right?**
Yes: on sites where type is atmosphere, not information (some campaign or art pages), and where repeat visits dominate. First-time visitors on slow connections get the system font and never know what they missed. Test it against real device throughput, not your studio fibre.

**Should we use the Font Loading API to coordinate swaps?**
Rarely. `document.fonts.ready` is useful for one-shot effects (e.g. running a canvas measure after fonts settle). Coordinating whole layouts around it creates the very jank you're trying to avoid.

**What about locally installed versions via `local()`?**
Keep `local()` in the `src` list for system-named fonts (Georgia, Arial) but drop it for retail webfonts — a user's stale local copy with old metrics will sabotage your carefully matched fallbacks.

**How does this interact with inlined `font-variant` features like `ss01`?**
Stylistic sets live or die with the subsetter: if `pyftsubset` strips a feature your CSS later requests, you get silent fallback. Keep the `--layout-features` list in your subset config synchronised with the CSS, and let the coverage script check it.
