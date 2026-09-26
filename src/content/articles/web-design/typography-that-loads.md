---
title: "Type systems for marketing sites that still load fast"
description: "How to build a marketing-site type system that carries the brand without blowing the performance budget — variable fonts, subsetting and metric-matched fallbacks."
slug: typography-that-loads
cluster: web-design
tags:
  - Typography
  - Performance
  - Web design
date: 2025-02-11
author: June Okafor
keywords:
  - web typography
  - variable fonts
  - font performance
  - type scale design
  - font subsetting
readingTime: 9
---

Typography is the brand on a marketing site. Strip the imagery from most of the pages we ship and the identity survives, because the identity mostly *is* the type — the voice of the serif, the posture of the grotesk, the rhythm of the scale. That makes font files the one asset class where design and engineering cannot negotiate separately. Every decision a designer makes in the type palette is a payload decision, and every subsetting decision an engineer makes is a brand decision.

This is the working method we've settled on after a decade of [marketing-site builds](/services/websites): treat type as a system with two budgets — an expressive budget and a byte budget — and design against both from the first moodboard.

## The two budgets

The expressive budget is about restraint before it's about files. A marketing site almost never needs more than two families. Ours usually land on one display face with genuine personality — a serif with an opinion, a grotesk with an unusual skeleton — and one workhorse for body copy and UI. Three families is a smell; it usually means the brand strategy hasn't committed to a voice.

The byte budget is numeric and we write it into the brief: for most projects, **all fonts on the critical path together get 120KB compressed, and only one face is allowed to block first paint**. That's enough for a variable display face and a variable text face, properly subset. It's not enough for six static weights of a commercial superfamily loaded from a third-party CDN, which is what too many "fast" sites still ship.

Two budgets, one conversation. The designer who knows the byte budget stops reaching for hairline weights that need a seven-pixel stroke to survive mobile. The engineer who knows the expressive budget doesn't quietly swap Light for Regular because "it's 30KB lighter."

## Variable fonts, with disciplined axes

Variable fonts solved the file-count problem and created a file-size problem. A full variable build of a serious typeface — weight, width, optical size, italics — can weigh 300–500KB before you've touched the metrics tables. Shipped whole, it's worse than the static files it replaced.

So we make axis-level decisions in the design phase:

- **Weight axis: yes, always.** It's the axis that earns its bytes. We typically use three stops (headline bold, text regular, an intermediary for emphasis), but we keep the full axis range we've licensed so we can interpolate rather than fake weights with CSS.
- **Optical size axis: yes, where the typeface offers it.** This is the single most underused feature in web typography. Optical sizing means your 72px headline and 15px caption can both be drawn correctly — tighter spacing and sturdier hairlines at display sizes, looser and more open at text sizes — automatically, via `font-optical-sizing: auto`. It reads as "expensively typeset" and costs nothing extra once the axis is in the file.
- **Width axis: only if the layout concept uses it.** Condensed cuts are great for data-dense labels and poster headlines. If the design system never narrows, we strip the axis.
- **Italics: decide family by family.** Real italics on the display serif are often the personality of the brand — keep them, subset hard. On the grotesk text face, an oblique fake is sometimes acceptable for the three places a marketing site uses italic emphasis. That's a judgment call we make in the type spec, not in a panic before launch.

## Subsetting like you mean it

Every webfont we ship goes through `pyftsubset` before it touches the repo. The starting point for most English-language marketing sites:

- **Primary font:** Latin basic plus punctuation, currency, and the typographic glyphs designers actually use (proper quotes, en/em dashes, ellipsis, arrows if the design system has them). This usually lands between 30 and 60KB per variable face.
- **Secondary slice:** Latin-Extended for the accented characters your market needs — served as a separate file with its own `unicode-range`, so a browser rendering an English page never downloads it. For anything headed toward Vietnamese or pan-European copy, we plan extended subsets from day one rather than retrofitting.
- **Drop the features you don't use, keep the ones you do.** We keep kerning (obviously), `liga`, and `calt`; we keep `tnum` if the design has tabular numerals anywhere — pricing tables, dashboards, stats — and we keep stylistic sets a designer has explicitly chosen.

The `unicode-range` split is where the real win hides. Declare two or three `@font-face` rules for the same family with disjoint ranges, and the browser downloads only the slices containing glyphs on the page. An English marketing page then effectively carries one small font, even though the system can render Polish testimonial quotes without a rebuild.

## Loading strategy: one critical face, metric-matched fallback

The loading plan is where good font files still produce a bad site. Our defaults for marketing sites:

**One face blocks, and it's preloaded.** The critical face — usually the display weight of the headline face — gets a `<link rel="preload" as="font" crossorigin>` and the tightest subset of all. Everything else loads lazily via CSS. If you preload four fonts, you've preloaded none.

**`font-display: swap` with a metric-matched fallback.** A fallback stack named in CSS (`font-family: "Founders", "Helvetica Neue", Arial, sans-serif`) is not a strategy; it's a hope. We generate metric overrides (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`) for a local fallback so the swap doesn't move the layout. (Tools like Fontaine automate the maths.) Layout shift from font swap is the most common CLS bug we see on inherited sites, and it's entirely preventable at the system level.

**Self-host, always.** No third-party font CSS on the critical path — the connection setup to someone else's CDN costs more than the bytes, and it hands your uptime to a service you don't control. Commercial licences that forbid self-hosting webfonts are a procurement problem to solve before design starts, not after.

## The scale that survives 375px and 1440px

The other half of the type system isn't files at all — it's the scale. Our starting point for marketing sites is an eight-step ramp from 13px metadata to a display size that lands around 96px on desktop, built on a ratio near 1.25 and then hand-tuned, because pure mathematical scales produce sizes nobody asked for at the small end.

Two rules make it responsive without becoming mushy:

1. **Fluid only where it helps.** Headlines scale fluidly with `clamp()` between the mobile and desktop stops. Body text does not. Body copy is 16–18px everywhere, because reading comfort is a fixed cost and 15px body text on a phone is a designer's aesthetic imposed on a reader's eyesight.
2. **Line length is a layout constraint, not a type setting.** We cap measure at roughly 68 characters using `ch` units in the layout tokens. That single constraint resolves half of the "the type feels wrong on wide screens" complaints, which are usually about 140-character lines, not glyph choices.

The whole system — families, subsets, axis decisions, scale stops, metric-matched fallbacks — lives in the design tokens file we hand over with every project, the same place the colour and spacing primitives live. Type decisions that exist only in a Figma library or only in a CSS file will diverge. In tokens they stay one system.

We applied exactly this discipline on [GLADE's storefront](/work/glade-skincare-ingredient-honesty), where a single variable serif carries the whole brand voice and the entire font payload on the critical path is under 90KB — the type looks expensive because it is *set* expensively, not because it downloads expensively. The family choices themselves came out of a [brand and identity engagement](/services/brand-identity) the year before, which is the right order of operations: the type system should be decided as identity, then *implemented* as performance.

One last note, because it keeps coming up in audits: font loading interacts with everything else on the page — contrast handling, legibility testing, tap targets that shift when metrics change — so fold font QA into the broader [accessibility handoff](/journal/web-design/accessible-design-handoff) rather than treating it as a performance-nerd side quest. And if your current site isquietly paying the every-page-CSS penalty for a type system nobody budgeted, that's a short conversation with a team that does this weekly — [we're easy to brief](/contact).

## Key takeaways

- Give a type system two budgets: an expressive budget (two families, committed) and a byte budget (we use ~120KB compressed, one blocking face).
- Variable fonts pay for themselves only when you decide which axes you're buying. Weight and optical size almost always; width and italics case by case.
- Subset with `pyftsubset` and split by `unicode-range` so browsers download only the glyphs on the page.
- Preload exactly one font, use `font-display: swap`, and ship metric-matched fallbacks so the swap doesn't shift layout.
- Put the scale, subsets and fallbacks in design tokens — one source of truth for design and code.

## FAQ

**Should we license a variable retail font or use an open-source one?**
Licence quality faces when the brand can carry the cost — the drawing quality of good retail type is visible at display sizes, and licences for marketing-traffic sites are rarely the big line item people fear. Excellent open variable families exist for text roles. We often mix: retail display, open workhorse.

**Is system font stack "safe" fallback still worth it?**
As a fallback under metric-matched overrides, yes. As the whole strategy, no — a system-font site tells your visitors the brand didn't make the trip to the browser.

**Do we really need optical sizing?**
If your typeface offers the axis, turning it on is the highest-quality-per-byte decision in web typography. If it doesn't, don't fake it with letter-spacing hacks.

**What about icon fonts?**
Don't. Inline SVG is sharper, styleable, and doesn't create a render-blocking font for sixteen glyphs.

**How do we QA a font system?**
We test three things on real devices: transfer size on a cold cache, Cumulative Layout Shift during font swap on a throttled connection, and rendering of the full character set the CMS allows editors to type.
