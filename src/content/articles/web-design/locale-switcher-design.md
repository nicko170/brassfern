---
title: "Locale switchers without the flag clipart"
description: "Language switchers are small UI with big politics. Where the control lives, name-in-own-language rules, hreflang interplay, script support, and when to skip it."
slug: locale-switcher-design
cluster: web-design
tags:
  - internationalisation
  - navigation
  - UX patterns
  - localisation
  - multilingual
date: 2025-09-02
author: Felix Brandt
keywords:
  - language switcher UX
  - multilingual websites
  - localisation design
  - i18n UX
  - web design
readingTime: 7
---

There is a small control, usually stranded in the header or the footer, that chooses which language an entire website speaks. It gets about as much design attention as the legal links nearby — and yet it's the highest-stakes menu on the page, because every mistake in it is a mistake about *who is welcome here*.

We've shipped multilingual marketing sites and products across APAC and Europe, and the locale switcher is always where good intentions meet hard constraints: politics (flags), politics (language names), politics (whose content actually exists), and the very practical politics of fonts. Here's the thinking we apply before a single option is rendered.

## First question: should the switcher exist at all?

The honest answer is often no. A locale switcher is a promise — *we speak your language* — and a two-language site where the second locale is a half-translated homepage and an English checkout breaks the promise at the moment it matters most.

Before designing the control, audit the actual localisation:

- **Content coverage.** What percentage of pages have real translations? Below ~80%, geo-detection with a fallback banner serves people better than a switcher that leads to dead ends.
- **Locale or language?** These are different axes. French-in-France and French-in-Canada differ in date formats, pricing currency, legal footer text and spelling conventions. If you only translate language but keep locale behaviour global, name the control after *language* and be explicit that pricing stays in one region.
- **The maintenance budget.** Every locale you ship is a product line. Marketing sites love announcing seven locales in a launch post and quietly letting four of them rot. Two well-maintained locales beat seven haunted ones.

If the answer is "we mostly serve one market with occasional visitors from elsewhere," consider killing the switcher entirely and investing in one genuinely bilingual experience — or a translated PDF of the one document those visitors actually need. The best locale switcher is sometimes [the feature you delete](/journal/product).

(If the answer is yes, you're designing two things at once: the control, and the routing and content model underneath it. The engineering half of that conversation — URL strategy, string externalisation, pluralisation — is its own discipline, and we've written separately about [i18n beyond the strings file](/journal/engineering/i18n-architecture-hard-parts). This piece is the design half.)

## Naming: languages in their own voice

The single most consequential convention in locale switchers: **list every language in that language's own name**. English, Español, Deutsch, 日本語, Português, العربية — never "English, Spanish, German, Japanese, Portuguese, Arabic."

Translated names fail the only user who matters: the one who can't read the current locale and is hunting for their exit. A Japanese speaker staring at an English page can scan for 日本語 instantly; scanning for the English word "Japanese" requires the skill they came to the switcher to escape. The self-named list is also quietly respectful — it treats each locale as a peer, not a translation of English.

Two corollaries:

- **Alphabetise within each language's own script?** No — order by usage volume or market priority, with the current locale first or the most-used second locale adjacent. Alphabetical order is an English habit that breaks down across scripts anyway.
- **Include the endonym only once.** "Deutsch (German)" adds noise without helping the person who needs it. If you need English-language context for support staff, put it in a `title` attribute or admin UI, not the render.

## The flag problem

Don't use flags. This has been standard advice for twenty years and sites still do it, so here is the reasoning one more time:

- **Flags denote nations; languages are not nations.** Spanish is official in over twenty countries. English is official in more than fifty. Which flag do you show — and what do you say to everyone it excludes? Arabic across how many states? A US flag for English is a choice with a body count of grumpy Canadians, Australians and Brits.
- **Flags are political objects that change.** Disputed territories, quarantine of certain flags on app stores, regime changes — your navigation is not the place to host geopolitics.
- **Flags fail scalably.** The moment you need pt-BR versus pt-PT, the distinction between two flags is doing typographic work that two words ("Português (Brasil)", "Português (Portugal)") do better.

The exception that proves the rule: genuine *region* selectors (shipping destination, store picker) where nation is actually the axis. Even there, the word plus flag beats flag alone.

## Placement and the shape of the control

Placement follows stakes:

- **Header, secondary position**, when switching is a common need — multilingual markets (Singapore, Switzerland, Canada), or products whose users genuinely switch. Don't bury it behind a settings cog; the person who needs it most is the least equipped to dig for it in the current locale's vocabulary.
- **Footer**, when switching is occasional — mostly-English sites with one translated content set. Footer placement pairs naturally with the legal links and doesn't contest the primary nav.
- **Onboarding-interstitial**, rarely — the full-screen "choose your region" gate. Justifiable for compliance-driven region splitting (alcohol, financial products); hostile as a language picker, because it blocks the first impression for everyone to serve a fraction.

For the control itself, match the component to the locale count:

- **2–3 locales:** inline text links ("English | 日本語"). No menu needed; menus hide content, and three options aren't content.
- **4–10:** a button with a dropdown, labelled with the *current locale's endonym* plus a globe icon as a language-dependent-free affordance. The icon helps icon-literate scanners; the endonym anchors people already reading the page.
- **10+:** you're really building a locale directory — a dedicated `/language` page with endonyms grouped by region. Nobody should navigate a 40-item dropdown; that's what IA is for.

Keyboard and screen-reader behaviour: the switcher is navigation, so build it on links (`<a href>` to the localised URL), not JavaScript state changes. The localised URL must exist server-side anyway for [international SEO](/journal/growth/international-seo-hreflang) — if your hreflang tags point at URLs your switcher doesn't link to, something has gone wrong twice.

## Detection: suggest, never decide

Geo-IP and `Accept-Language` detection are useful as *suggestions* and toxic as *decisions*. The failure mode is famous: an English speaker holidaying in Tokyo gets the Japanese site with no escape hatch visible; a Berlin-based French speaker gets locked into German because her IP said so.

The pattern we use:

1. **First visit with a strong signal** (Accept-Language or IP mismatch with the requested locale): show a slim, dismissible banner — in the *detected* language — offering the switch. Never auto-redirect.
2. **Honour explicit choice forever.** Once someone uses the switcher, store the preference (a cookie is fine; this is a legitimate functional use) and route them accordingly on return visits.
3. **Googlebot exception:** serve crawlers the locale of the URL they requested. Crawlers that get bannered or redirected produce the hreflang chaos described in [our international SEO guide](/journal/growth/international-seo-hreflang).

`Accept-Language` over IP when you must choose: the browser's preference stack is the user's own configuration, while an IP is a guess about geography that travels badly (VPNs, travellers, diaspora users — the exact people locale-switching serves).

## Type and layout survive contact with real scripts

A design system untested against its locales is a design system untested. Before committing to a layout:

- **Measure the longest-menu problem.** Translated navigation runs +30% longer in German, contracts in Chinese. Header layouts with exactly-enough room in English will wrap in German, and the switcher is usually the sacrificial victim. Design nav with a length budget and test with real strings, not "Lorem ipsum DE".
- **Budget the fonts.** CJK fonts are megabytes, not kilobytes. Shipping full Japanese and Chinese faces to every Australian visitor of an English page is a Core Web Vitals own-goal; the [font-loading recipes](/journal/engineering/font-loading-performance-recipes) for subsetting and unicode-range splitting apply with interest. Design with system CJK fallbacks that still respect your typographic voice, and self-host subsets for the glyphs that actually appear in UI strings.
- **RTL is a layout mirror, not a text flip.** Arabic and Hebrew mean the header mirrors, the switcher moves, icons with directionality (arrows, breadcrumbs) reverse, and progress indicators flow right-to-left. Logical CSS properties (`inline-start` over `left`) make this nearly free; physical properties make it a rewrite. The [typography of marketing sites](/journal/web-design/typography-that-loads) has to hold in both directions.
- **Date and number formats are typography too.** 26 September 2026 in one locale is 2026年9月26日 and ٢٦ سبتمبر in others. `Intl.DateTimeFormat` handles the logic; your line-length budgets handle the fallout.

## Small details that mark craft

- **Persist where the user *was*, not just who they are.** Switching from an English case study should land on the same case study in the target locale — or, if it's untranslated, on the translated section index with a note, not a silent redirect to the homepage.
- **Label the untranslated honestly.** If a locale's news section is empty, show the English items with a small "in English" tag rather than either hiding the section or serving English as if it were localised.
- **Keep the switcher visible in every locale** — it sounds obvious, but redesigned headers have shipped with the control present only on the English build, stranding everyone else.
- **Test the switcher's own a11y** in each locale: aria-labels on the control should themselves be localised ("Sprache wechseln", not "Change language" rendered on the German page).

## Key takeaways

- A locale switcher promises maintained localisation. Audit content coverage first; two good locales beat seven haunted ones, and sometimes the right count is one.
- Name languages in their own endonym; never in English, never with flags.
- Match the component to the count: inline links for 2–3 locales, a labelled menu for up to ten, a directory page beyond.
- Detect politely (a dismissible banner), store explicit choices, never auto-redirect — and serve crawlers the URL they asked for.
- Build the control on real links to real localised URLs; the switcher and your hreflang graph are the same map or you're lying somewhere.
- Design the layout against real translated strings and budget CJK fonts deliberately. RTL readiness comes from logical CSS, bought early.

## FAQ

**Should we show the current language in the switcher button itself?**

Yes — the button reads as "Language: Español" (or just "Español" with a globe). Showing a bare globe icon alone fails people without icon literacy, and showing nothing forces the switcher open to learn the current state.

**IP detection or Accept-Language first?**

Accept-Language first, always — it's the user's configured preference. Use IP only as a tiebreaker for *region* variants (de-DE vs de-AT) or commerce defaults, never for language.

**Can we auto-translate with machine translation and mark it?**

You can, if you're honest about it and the content is low-stakes (help docs seeking coverage beats zero). But a marketing site is a craft showcase — MT'd marketing copy is the opposite of a promise. If it matters enough to switch to, it matters enough to translate well.

**What about URLs — subdirectories, subdomains or ccTLDs?**

Subdirectories (`/de/…`) for most studios: one domain's authority, one deployment, simplest ops. ccTLDs earn their complexity for genuinely country-operated businesses. The SEO half of that decision is covered in our [hreflang field guide](/journal/growth/international-seo-hreflang).

**How do we handle a locale where only some pages exist?**

Switching lands the user on the nearest translated ancestor, with a note ("this page isn't available in Español yet — here's the section overview"). Silent homepage redirects feel like errors; honest handoffs feel like service.
