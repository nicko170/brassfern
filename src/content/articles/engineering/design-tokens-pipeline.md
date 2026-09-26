---
title: "Design tokens are an API: building a pipeline from Figma to production"
description: "How we build a design-token pipeline from Figma to CSS, Tailwind and native — one source of truth, versioned releases, and semver for visual decisions."
slug: design-tokens-pipeline
cluster: engineering
tags: [design tokens, design systems, style dictionary, css variables, figma]
date: 2025-09-11
author: Felix Brandt
keywords: [design tokens, style dictionary, design system pipeline, css variables, figma tokens, design system versioning]
readingTime: 11
heroImage: /images/articles/engineering/design-tokens-pipeline.jpg
heroAlt: "Machined brass swatch tiles in fern and cream tones arranged in a specimen-tray grid on a paper workbench, linked by thin brass rods."
---

Ask a team where their brand's primary colour lives and you'll get five answers: a Figma library, a Tailwind config, a SCSS partial, an Android `colors.xml`, and a Slack message from 2023 that begins "just use this for now." All five are slightly different. None is wrong in a way anyone can detect until the app and the marketing site sit side by side in a launch screenshot.

Design tokens fix this, but only if you treat them as what they actually are: **a versioned API for visual decisions**. Not a folder of JSON someone updates by hand. Not a Figma plugin export that gets committed once and rots. An API — with a source of truth, a build step, release tooling, and consumers who can pin or upgrade.

This is the pipeline we set up on engagements like the [Osprey Outdoor pack configurator](/work/osprey-outdoor-configurator-launch), where one visual language had to survive a marketing site, a 3D product configurator, and a dealer portal simultaneously. It pairs with our companion piece on [testing tokens in CI](/journal/engineering/design-tokens-pipeline-ci) — this article is the plumbing, that one is the safety net.

## The mental model: tokens are decisions, not values

The single most useful reframe: a token is a *decision with a name*, not a colour with a hex.

`#b08a3e` is a value. `color.action.primary` is a decision — "interactive primary elements use this brass." When the rebrand lands (and it always lands), you change the value once and every consumer updates. When a designer says "the focus ring should feel warmer," that's a decision-level change, and it should ship like one.

We organise tokens in three tiers, and we've never needed a fourth:

1. **Primitive** — the raw palette, spacing base units, typefaces. `fern.500: #1e4d33`. Nobody uses these directly in components.
2. **Semantic** — decisions in context. `color.surface.raised`, `color.text.muted`, `space.inset.comfortable`. Components consume these.
3. **Component** (use sparingly) — only where a component genuinely has its own contract, e.g. `button.primary.bg.hover`.

The trap is skipping tier two and letting components reference primitives. You get "consistency" that shatters the moment dark mode or a second brand arrives. Our piece on [colour systems that survive dark mode and rebrands](/journal/web-design/colour-systems-dark-mode) covers the design-side reasoning; the engineering consequence is simple: components may import semantics, never primitives. Enforce it with linting, not vibes.

## The pipeline, end to end

Here's the topology we standardise on. Every stage is boring on purpose — the whole point is that nothing in it requires heroics.

**1. Source of truth: token files in the repo, synced from Figma.** We keep tokens as JSON (W3C Design Token Community Group format, which finally means tooling is converging) in a `tokens/` package inside the monorepo. Designers edit in Figma Variables; a sync script (Tokens Studio's API or a small custom differ) proposes pull requests. *Proposes* — a human reviews it, because "the accent is now bluer" deserves a commit message and a changelog entry like any other API change.

**2. Build: Style Dictionary.** One config, multiple platforms:

```
tokens/
  primitives.json
  semantics.light.json
  semantics.dark.json
build/
  css/variables.css        # web, as custom properties
  ts/tokens.ts             # typed constants for JS logic (charts, canvas)
  tailwind/preset.js       # Tailwind preset that maps semantics into utilities
  android/                 # only when a native app exists
```

CSS custom properties are the right delivery mechanism on the web because they're live: dark mode is a data attribute flip, a white-label theme is a scoped override, and there's no rebuild. The Tailwind preset exists so utility classes *reference* those variables (`bg-action-primary` → `var(--color-action-primary)`), not copy their values. If your Tailwind config contains hex codes, the pipeline has leaked.

**3. TypeScript output earns its place.** Everyone builds the CSS; fewer build the typed module, and it's the one engineers actually love. Charts, canvas renderers, email templates (where custom properties don't survive), and OG-image generators all need token values in JS. Generate `tokens.ts` from the same source so `tokens.color.action.primary` in a D3 scale is guaranteed identical to the CSS variable.

**4. Versioning and release.** The tokens package is semver like any other. Renaming a token or changing a semantic meaning is a major. Adding tokens is a minor. Shifting `fern.500` by three points of lightness is a patch — but a *documented* patch, because someone's screenshot diff is about to move. Consumers pin versions; a dependabot-style weekly bump opens PRs that visual regression tests evaluate.

## The parts that actually bite

**Naming is the hard problem, solved early or paid forever.** Token names are forever in the way URLs are forever. Our rules: names describe role, never appearance (`text.muted`, not `grey.text`); depth beyond three segments is a smell; and we ban synonyms — pick "surface" or "background," not both. A naming RFC that takes one afternoon saves a migration that takes a quarter.

**Figma is an editor, not the source of truth.** Automated one-way sync from Figma into the repo works. Two-way sync is a distributed-systems problem wearing a design tool's clothes. Decide which direction writes and make the other read-only, or you will eventually merge a colour conflict by hand on a Friday.

**Dark mode and theming live in the semantic tier.** Light and dark are parallel semantic files resolving the same names to different primitives. Components never know the difference. If dark mode requires touching component code, the tiering failed.

**Deprecation is part of the API.** Tokens get renamed. Our build emits a `deprecated` map (`old.name → new.name`, removal version), and the CSS build can optionally emit both names for one release cycle. Consumers get one graceful release to migrate; afterwards the old names stop compiling — loudly, in CI, not silently at runtime.

**Don't tokenise everything.** One-off layout values, animation choreography bespoke to a single sequence, and illustration palettes are not tokens. A token system that tries to encode every pixel becomes a taxonomy project that never ships. Tokens cover the reusable visual language; the last 10% is allowed to be code.

## Measuring whether it worked

Pipelines are easy to build and easy to abandon. Three metrics tell you if yours is load-bearing:

- **Drift count.** A weekly script greps consumers for raw hex/px values that match primitive values. On the Osprey project this started at 340 and hit zero in week nine. It stays near zero because the lint rule makes cheating annoying.
- **Upgrade lag.** How many versions behind are consumers? If the marketing site is six token versions back, the release process is too scary — usually because visual regression coverage is weak. Fix the safety net, not the release cadence.
- **Change cost.** Time a real rebrand exercise. On a recent White-label variant for a fintech client we produced a complete second theme — new primitives, same semantics — in one day. Before the pipeline, the same exercise was quoted at three weeks. That delta is the entire business case, and it's worth telling whoever pays the invoices. We cover the commercial framing more broadly on our [product design service page](/services/product), because "we can re-skin the product in a day" is a feature clients can actually buy.

## Key takeaways

- Tokens are a versioned API for visual decisions. Give them a source of truth, a build step, semver, and a changelog — the same respect as any other package in the repo.
- Three tiers: primitive, semantic, component. Components consume semantics only; enforce with linting.
- Ship CSS custom properties for the web, plus a generated TypeScript module — it's the output engineers reach for most.
- One-way sync from design tool to repo. Two-way sync is a trap.
- Measure drift, upgrade lag, and change cost. "Rebrand in a day" is the metric that justifies the whole program.

## FAQ

**Can't we just use Tailwind's theme config as the source of truth?**
You can, for a single web app with one brand and no dark mode beyond a toggle. The moment a second platform, a second brand, or a non-CSS consumer (charts, email, native) appears, Tailwind's config is the wrong layer — it's a consumer, not a source. Put the tokens upstream and generate the Tailwind preset like everything else.

**Do designers really tolerate editing tokens through PRs?**
Yes, when the loop is fast and the PR is readable. We make sync PRs show a visual diff (rendered swatches, not raw JSON) and land within a day. Designers tolerate process that respects their intent; they abandon process that makes a colour tweak feel like filing a visa application.

**How big should the token set be?**
Smaller than you think. Our production systems run 120–200 semantic tokens. If you're at 800, you've tokenised components, and every change is now a major release. Ruthlessly merge near-duplicates early; it's much harder later.

**What about Figma Variables versus Tokens Studio?**
Variables are native, fast, and increasingly capable — we start there. Tokens Studio still wins for multi-mode mathematics (computed spacing scales, alpha compositions) and for teams who've already built libraries on it. The pipeline is identical either way; don't let the tool choice delay the architecture.

**When is a token pipeline *not* worth it?**
A marketing site with one brand, one mode, and a two-year lifespan? Use well-organised CSS variables and move on. The pipeline pays for itself when there are multiple consumers, multiple themes, or a design system with a future. Our [websites practice](/services/websites) scopes this honestly in discovery — sometimes the right answer is a well-named sixty variables and no ceremony at all.
