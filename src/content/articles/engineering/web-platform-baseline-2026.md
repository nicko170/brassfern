---
title: "Baseline 2026: what the platform finally gives you"
description: "A working guide to web Platform Baseline in 2026: what you can ship without polyfills, how to read compat data, and a sane adoption policy for teams."
slug: web-platform-baseline-2026
cluster: engineering
tags:
  - web platform
  - css
  - browsers
  - progressive enhancement
date: 2026-02-11
author: Felix Brandt
keywords:
  - web platform baseline
  - modern css support
  - browser compatibility policy
  - progressive enhancement
readingTime: 9
---

Every few years the web platform quietly eats another layer of your dependency tree. jQuery lost to `querySelector` and `fetch`. Lodash lost to spread syntax and `Array.prototype` methods. Moment lost to `Intl`. In 2026 the same thing is happening to a whole row of CSS tooling and JavaScript polyfills, and a lot of teams haven't noticed because nobody sent them a memo.

This is that memo.

## What Baseline actually is

Baseline is a cross-vendor agreement — maintained through the W3C WebDX Community Group, with data surfaced on MDN, Can I Use and web.dev — that marks features as **Newly available** (working in the latest versions of Chrome, Edge, Firefox and Safari) or **Widely available** (Newly available for at least thirty months). The thirty-month line matters because it roughly approximates "your users' browsers have actually updated".

The widget you see at the top of MDN pages now — the blue or green Baseline badge — is the single most useful piece of documentation furniture added to the web in a decade. Before shipping anything, we check the badge, not our memories. Our memories are from 2021 and they lie.

## The 2026 snapshot: what's genuinely Widely available

Here's what we treat as free to use on client work today, no polyfills, no fallbacks, no support tickets:

**CSS layout and selectors.** Container queries (`@container`, plus the size units `cqi`/`cqw`), `:has()`, CSS nesting, `:is()` and `:where()`, subgrid, `aspect-ratio`, `gap` in flexbox, logical properties everywhere. Container queries and `:has()` crossed the Widely available line in 2025, and they change how you write components — we covered the component-level consequences in our [web components scorecard](/journal/engineering/web-components-vs-react). Together they killed most of the remaining reasons to reach for a runtime styling library.

**CSS colour and typography.** `oklch()` and `oklab()` colour functions, `color-mix()`, relative colour syntax, `text-wrap: balance` and `pretty`, `font-palette` for colour fonts, and `@font-face` size-adjust for metric-compatible fallbacks. We build whole token systems in `oklch` now — it pairs naturally with the pipeline we described in [design tokens are an API](/journal/engineering/design-tokens-pipeline).

**Viewport and scrolling.** Scroll-driven animations (the last engine landed in 2025), `scroll-snap`, `scroll-margin`, the small/large/dynamic viewport units (`svh`, `lvh`, `dvh`) that finally fixed mobile vh, and `@media (prefers-reduced-motion)` for doing the right thing by default.

**JavaScript and DOM.** `Array.prototype.at` and friends, `structuredClone`, `Object.groupBy`, `Promise.withResolvers`, view transitions (same-document, cross-browser as of 2025), the Popover API, `dialog` with all the trimmings, `Intl.Segmenter`, and `import` attributes for JSON modules.

**Forms.** Customisable `<select>` shipped cross-engine in late 2025 — the single longest-running embarrassment in HTML, ended. Plus `fieldset`-free validation styling with `:user-valid`, which is gentler than `:invalid` for exactly the reason the name suggests.

## What's Newly available but not Widely — handle with intent

Some 2026 features are Newly available and worth adopting *behind a progressive-enhancement fence*: cross-document view transitions, `@scope`, anchor positioning, masonry layout (still flagged in one engine), and `text-box-trim`. Our rule: if the fallback is "the layout still reads fine and nothing looks broken," ship the enhancement. If the fallback is "the page is unusable," wait for Widely or build the fallback properly.

Anchor positioning is the poster child here. A tooltip that degrades to `position: absolute` with a sensible default is fine. A navigation system that *requires* anchor positioning is not. Decide feature by feature, not vibes.

## A feature-adoption policy that fits on one page

We keep a one-page internal policy. It's short enough to actually be read, which is the entire point.

1. **Widely available features are default-on.** No discussion, no fallbacks. Delete the polyfill if one exists.
2. **Newly available features require an enhancement plan.** Write down, in the PR, what users on older engines see. If the answer is "nothing breaks," proceed. If the answer is "a worse experience," that's allowed — but say it out loud and get the designer to sign off.
3. **Pre-Baseline features (single-engine) need a client conversation.** We still ship them — view-transition experiments, scroll-driven storytelling — but only when the audience data supports it and the client understands the trade.
4. **Review the dependency list twice a year against Baseline.** We call this the polyfill purge. Last year's purge removed 34 transitive dependencies across our starter kit, including a smooth-scroll library (native `scroll-behavior`), a `focus-visible` polyfill, and 11 kB of grid fallbacks nobody had dared delete since 2019.

## Reading compat data like an adult

Three habits save us from compat mistakes:

**Check the badge, then check the caveats.** Baseline tells you a feature *exists* in all engines, not that it behaves identically. `:has()` with certain complex selectors still has performance cliffs in one engine. Subgrid's row-gap handling differed subtly for a year after Baseline. Read the MDN compat notes, not just the badge colour.

**Know your real audience.** Baseline is a floor, not a target. A fintech dashboard used by corporate desktops on managed browsers has a different floor than a hospitality booking site in regional Australia where an eight-year-old Android is a normal device. We keep a per-project "browser floor" note in the README, derived from the client's actual analytics during discovery — a step we bake into the engagements described on our [websites service page](/services/websites).

**Budget for the fallback you didn't write.** Every enhancement fence adds a small testing surface. That's fine — it's still cheaper than the 40 kB of JavaScript you used to ship to fake the feature. Put it in the performance budget alongside everything else, the way we do in [our bundle budget practice](/journal/engineering/bundle-budget-discipline).

## The quiet payoff

The compounding benefit isn't any single feature. It's that the platform's floor rising lets you spend your complexity budget on the parts of the product that are actually yours. The team that doesn't maintain a tooltip positioning library, a body-scroll-lock hack, and a container-query workaround has more afternoons for the work clients remember: the odd, opinionated, custom thing that makes a site feel like somebody cared.

That's what Baseline gives you in 2026. Not features. Afternoons.

## Key takeaways

- Baseline's Widely available line (thirty months post cross-engine support) is the safest default for client work; Newly available features ship behind explicit enhancement fences.
- Container queries, `:has()`, nesting, `oklch`, dynamic viewport units, same-document view transitions and the Popover API are all genuinely free to use in 2026.
- Check the MDN badge for support, then read the compat notes for behavioural differences — Baseline means "present", not "identical".
- Set a per-project browser floor from real analytics, and purge polyfills and dependencies against the platform's floor twice a year.
- The real win is reclaimed complexity budget: less platform polyfilling, more product craft.

## FAQ

### Does Baseline mean I can drop my build tool's autoprefixer?

Mostly, yes. If your browser floor is Baseline Widely available, the remaining prefixes (`-webkit-` overflow scrolling, some gradient oddities) are handled by default in modern autoprefixer configs, and you can trim your browserslist to `baseline widely available` — the browserslist project supports Baseline queries natively now. Audit the output once, then stop thinking about it.

### What about Internet Explorer holdouts in enterprise?

IE has been fully unsupported by Microsoft since 2022 and is not in any Baseline calculation. If a client's analytics still show meaningful IE traffic (rarer than ghost stories in 2026, but they exist), that client's project gets an explicit, priced compatibility scope. Don't bend your whole practice for one haunted intranet.

### Should we adopt Newly available features in a design system?

Yes, in the "enhanced" tier of components. Our design systems declare three tiers: core (works at the browser floor), enhanced (Newly available upgrades, opt-in), and experimental (single-engine, clearly flagged). Consumers pick the tier per surface. It keeps the system honest without freezing it in 2023.

### Where do you track what's crossed into Widely available?

The web-platform-dx feature-set data (what powers MDN badges) is on npm and consumed by linters. We run a quarterly script against our component library that lists every feature we gate and whether it's crossed Widely. Forty minutes of setup, saves the whole team from memorising support tables. If you'd like help rationalising your own platform posture, [that's a normal Tuesday for us](/contact).
