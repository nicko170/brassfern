---
title: "i18n beyond the strings file"
description: "The hard 20% of internationalisation: plural rules, dates and currency, RTL layout, locale-aware content modelling, and design tokens that change per language."
slug: i18n-architecture-hard-parts
cluster: engineering
tags: [i18n, localisation, rtl, content modelling, design systems]
date: 2025-06-20
author: Dev Khatri
keywords: [internationalization architecture, i18n design systems, rtl css, localization engineering, icu messageformat, plural rules javascript]
readingTime: 11
---

Every internationalisation project starts the same way: someone extracts every hardcoded string into a JSON file, wires up a `t()` function, and declares the product "ready for translation". Three months later the Japanese layout is broken, the Arabic toggle mirrors the wrong arrow, and a plural rule in Polish has produced a sentence that reads, to a native speaker, like a programming error.

We've shipped products across English, Mandarin, Bahasa, Japanese and Arabic from our Sydney and Singapore squads. The strings file was solved in week one, every time. Everything in this article is what came after — the hard 20% that takes 80% of the effort. Much of this thinking went into the multilingual editorial platform behind our [Postcards from the Museums archive](/work/postcards-museum-archive).

## Plurals: the first wall

English has two plural forms (one / other), so English-speaking developers build `count === 1 ? singular : plural` into their bones. Polish has three forms. Arabic has six. Russian's depends on the last digit of the number. Slovenian has a dual form reserved for exactly two of something.

The fix is not to learn the rules — it's to refuse to concatenate. Every message that contains a number must be a single ICU MessageFormat string, translated as a unit:

```
{copies, plural,
  =0 {No copies in stock}
  one {# copy in stock}
  few {# copies in stock}
  many {# copies in stock}
  other {# copies in stock}}
```

The translator fills in the forms their locale needs; the code never branches on grammar. Two disciplines make this stick. First, lint rule: any `t()` call whose key is assembled from parts is a build failure. "You have " + count + " items" is the enemy — word order is not universal, and in Japanese the number often belongs mid-sentence. Second, pseudolocalisation in CI: render the app with a fake locale that doubles vowel length ("Ýöüû häävëë 5 ïïtëëms") and put it in every pull request's visual diffs. Overflow and truncation bugs surface weeks before the translators are even booked.

## Dates, currency and the tyranny of defaults

`Intl` is your friend and it is already in the browser. `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat` and `Intl.PluralRules` cover almost everything — resist adding a date library. The discipline is in the defaults:

- **Never hardcode a format string** like `DD/MM/YYYY`. `04/05/2025` is April 5th in Sydney and May 4th in New York. Let `Intl.DateTimeFormat(locale, { dateStyle: 'medium' })` decide.
- **Currency is not a symbol, it's a pair.** Amount + currency code + locale. `Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' })`. And store money as integer cents in a minor unit, always — the day a locale with non-decimal currency (or a fee rounded half-up vs banker's) arrives, floats will betray you.
- **Time zones are a data problem, not a display problem.** Store instants in UTC, plus the wall-clock time and zone the *user meant*. "7pm Melbourne" on a recurring booking must survive daylight saving transitions; recompute it, don't store the computed UTC.

## RTL: a layout mode, not a translation

Turning on Arabic or Hebrew flips reading direction, and everything spatial follows: nav order, carousel arrows, breadcrumb chevrons, the direction a progress bar fills, which side the icon sits on in a button. The good news is that modern CSS gives you logical properties, and adopting them is the single highest-leverage i18n change an existing codebase can make:

- `margin-left` → `margin-inline-start`; `padding-right` → `padding-inline-end`; `left`/`right` positioning → `inset-inline-start/end`.
- Icons that imply direction (arrows, chevrons, "reply") must be mirrored; icons that don't (clocks, search, the phone handset) must not. We keep an explicit `data-mirror` attribute on the icon set — the opinion belongs in the design system, not scattered across conditionals. Our [design tokens pipeline work](/journal/engineering/core-web-vitals-field-guide) uses the same principle: one source of truth, mechanical propagation.
- Test with CSS `dir="rtl"` on `<html>` long before real Arabic strings exist. English text in an RTL layout exposes every physical-direction bug cheaply.

Bidirectional text is the subtle one: an English brand name inside an Arabic sentence, or an Arabic quote inside an English article. The browser's bidi algorithm handles most of it, but list markers, punctuation and truncation ellipsis land in surprising places. `<bdi>` around user-generated fragments is cheap insurance.

## Content modelling for locales

This is where i18n becomes a CMS architecture decision, and where retrofitting hurts most. The modelling choices that matter:

**Translatable vs localisable.** Some fields are translations of one thing (a product description); some are genuinely different per market (pricing, legal disclaimers, available sizes). Model them differently. A `locales` map on the field works for the first; the second wants per-locale content entries with their own workflow.

**Fallback chains are product decisions.** If `ms-SG` is missing, do you show `ms`, then `en-SG`, then `en`? That's editorial policy — a Malaysian user might strongly prefer Bahasa over Singapore English, or exactly the opposite. Decide it with the client, write it down, and encode it in one resolver function, not in fifty components' default parameters.

**URLs and slugs.** Localised slugs help SEO and sharing (`/id/produk/...`), but ID-based routes are more robust. We do both: stable IDs underneath, localised slug as a cosmetic layer with redirects. Nothing breaks when a translator renames a page.

**Length is a design constraint.** German compounds run ~30% longer than English; Mandarin runs shorter but taller with complex glyphs at small sizes. Buttons with fixed widths, single-line labels, and text baked into images all break. The fix belongs upstream — our piece on [type systems that load fast](/journal/web-design/typography-that-loads) covers per-script font stacks; the same thinking applies per-locale line-height and letter-spacing. Thai, for instance, needs taller line boxes than Latin; clipping ascenders in a hero is the classic tell that nobody tested it.

## Design tokens that vary per language

Treat locale as a theming axis alongside dark mode. A small set of tokens legitimately varies: font stack and fallback order, line-height scale, letter-spacing (zero for CJK, always), numeral system (`numberingSystem` in `Intl` — Western digits are the norm in most Arabic-language interfaces now, but let it be a decision), and occasionally type scale, where dense scripts read better a step larger. Keep the list short; every locale-varying token is a testing burden forever.

## The working process

What makes this tractable in practice: pseudolocalisation in CI from day one, an `Intl`-only policy for formatting, logical CSS properties enforced by linter, one ICU string per message, and a quarterly "locale day" where the squad uses the product in another language for an afternoon. The last one finds more bugs than any test suite — including the ones that are really [onboarding UX problems in disguise](/journal/product/onboarding-checklist-patterns). If you're planning a multi-market build, this is core to how our [product engineering team](/services/product) scopes: the strings file is the headline, but the budget lives in the plumbing.

## Key takeaways

- Never branch on grammar in code and never concatenate translated strings; ICU MessageFormat with `plural` and `select` covers the world's plural systems.
- Adopt CSS logical properties and an explicit icon-mirroring policy early — retrofits of physical-direction layout are the most expensive i18n debt.
- Format with `Intl`, store money in integer minor units, and store recurring times as wall-clock-plus-zone, not computed UTC.
- Model genuinely per-market content separately from translations, and make fallback chains an explicit editorial decision.
- Pseudolocalised visual diffs in CI catch truncation and overflow months before real translations arrive.

## FAQ

**When should we start thinking about i18n — from day one or once we've proven one market?**
You don't need translations on day one, but you do need the three cheap disciplines: no string concatenation, `Intl` for formatting, logical CSS properties. Retrofitting those later costs ten times more and usually happens under deadline pressure.

**Which library should we use — i18next, FormatJS, Lingui?**
All of them are fine; the library is rarely the failure point. Pick the one whose ICU support and extraction tooling fit your build pipeline, then spend your energy on message conventions and CI checks. Switching libraries later is a week; switching content models is a quarter.

**How do we handle languages we don't speak in code review?**
Treat the translated strings as data and trust the pipeline, not your eyes. Back-translation (translating the translation back to English) for the critical user journeys — checkout, legal, error messages — is worth the money. And hire one native-speaking reviewer per launch market; agencies that translate UI strings without seeing the UI are how "Back" buttons end up labelled with the word for a human spine.

**Does RTL testing need real Arabic content?**
To start, no — `dir="rtl"` with English text finds layout bugs. But bidi edge cases (mixed-direction sentences, ellipsis placement) only appear with real strings, so run one full manual pass with genuine Arabic before launch.
