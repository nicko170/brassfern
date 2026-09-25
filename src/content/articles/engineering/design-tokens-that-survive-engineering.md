---
title: "Design tokens that survive contact with engineering"
description: "Most token pipelines rot within a year. Here's the architecture we use at Brassfern to keep design decisions flowing from Figma to production without drift."
slug: design-tokens-that-survive-engineering
cluster: engineering
tags: [design tokens, design systems, css, figma, frontend architecture]
date: 2026-02-10
author: Tomás Reyes
keywords: [design tokens pipeline, design system engineering, tokens in CI, figma tokens sync, css custom properties]
readingTime: 8
---

Every design system postmortem I've read starts the same way: a beautiful token taxonomy, a triumphant launch, then eighteen quiet months of drift until "slate-400" exists in the Figma library, the CSS variables, and the marketing site — as three different hex values. Tokens are easy to create and famously hard to *keep alive*, because a token is not a variable. It is a decision with a concurrency problem.

At Brassfern we've run token pipelines across design systems for retail, fintech and health clients — most recently the generative brand system behind our [Hearthbrew Coffee case study](/work/hearthbrew-brand-system). The architecture below is the one that has repeatedly survived contact with real engineering teams, changing brands and deadline weeks. It's boring in the best way.

## The failure modes first

Before tooling, name the ways pipelines die. There are four we see constantly.

**Lossy translation.** Designers name tokens for meaning (`surface/raised`), engineers name them for implementation (`--card-bg`). A human translates between them at handoff, and humans are lossy codecs. Every manual mapping table is a future bug.

**The second source of truth.** Tokens get pasted from Figma into a JSON file "for now". For now is where pipelines go to die. The moment two files can disagree, they will.

**Silent overwrites.** Someone hot-fixes a colour inline — `style={{ color: '#2e6b47' }}` — to make a deadline. Reasonable! Then it ships, the token update lands, and now production disagrees with design and nobody knows which is right.

**Version-less releases.** A palette ships, the app updates, and cached CSS from last week renders the new HTML with old variables. Tokens changed without a version, so the cache couldn't know.

Notice what these share: they're all *process* failures wearing tooling costumes. The fixes are mostly about where truth lives and who is allowed to write to it.

## The architecture that works

Our rule, stated once and enforced forever: **tokens have exactly one source of truth and are never typed by hand anywhere downstream.** From there the pipeline is five small, replaceable pieces.

### 1. Capture decisions where they're made

Designers live in Figma, so that's where tokens are born — using Figma variables or the Tokens Studio plugin, with a naming grammar we agree on during the first sprint. The grammar matters more than the tool: `{layer}/{element}/{property}/{variant}` (`surface/card/bg/raised`), three layers deep at most, aliases always resolved to primitives. If naming needs a meeting, it happens here, in week one, cheaply.

Crucially, we agree on *which decisions are tokens at all*. Our rule of thumb: a token is any value that appears in more than one component or is likely to change during the product's life. One-off values stay one-off. Token inflation — 900 tokens by month three — is its own failure mode, because every token is an API surface you'll someday want to rename.

### 2. Export mechanically, review humanly

A small script (ours is ~200 lines) pulls Figma variables via the API and writes a `tokens.raw.json` into the repo, opening a pull request. Not a silent sync — a PR. Design approves intent, engineering approves shape. The diff is the conversation. We've caught everything from an accidental `99999` radius to a brand-green that had quietly drifted 4% toward teal, because somebody looked at the diff and asked.

### 3. Transform once, emit everywhere

From the raw JSON, a build step (Style Dictionary, or a plain node script — the tool is genuinely interchangeable) emits the targets:

```css
/* tokens.css — generated, do not edit */
:root {
  --bf-color-surface-card-raised: #f3eddd;
  --bf-color-text-primary: #182116;
  --bf-space-4: 1rem;
}
```

And for the app layer, typed constants:

```ts
export const tokens = {
  color: { surface: { card: { raised: 'var(--bf-color-surface-card-raised)' } } },
} as const
```

One transform, many targets: CSS variables for the web, JSON for native, a Figma library refresh PR going the other way if engineering deprecates a token. The transform is also where we enforce contracts — unit tests that fail the build if a token lacks a primitive ancestor, if a colour fails its documented contrast pairing, or if a new name violates the grammar. Tokens are code; treat them like it.

### 4. Make bypasses loud

The pipeline's real enemy is the expedient inline override. We handle this socially and technically. Socially: overrides are allowed, celebrated even — urgency is real — but they mark themselves. Technically: a lint rule bans raw hex outside the tokens file, and any `/* token-debt */` pragma that suppresses it is tracked as an issue automatically. Debt is fine. Invisible debt is not.

### 5. Version every release

The generated CSS carries a content hash, and the app records which token version it was built against. When marketing and app disagree, the mismatch is visible in the DOM, not in a subtle shade of wrong. Cache invalidation becomes a non-event because filenames change when values do.

## The part nobody automates

Tooling is maybe 40% of this. The rest is cadence. We run a fifteen-minute token review inside the weekly [sprint demo ritual](/approach): what changed, what was deprecated, what new tokens are proposed and whether they deserve to exist. The person proposing a token names its owner and its likely lifespan. Tokens without owners get six months and a deletion date — the same "earn its keep" rule we apply to motion.

This is also where our product squads keep tokens honest on the engineering side: every project in our [product design & engineering practice](/services/product) starts with the token contract in the README, above the setup instructions, because it breaks more builds than Node versions ever have.

## Measuring whether it's working

Three numbers we track per system:

- **Drift count** — unique raw hex values found in built CSS that aren't tokens. Target zero; reality tolerates single digits, all with `token-debt` pragmas.
- **Rename half-life** — how often a token rename breaks consumers. If it hurts, your naming grammar is wrong, and it's cheaper to fix now than never.
- **Time-to-rebrand** — the honest test. When the brand team says "what if the green was different", a healthy pipeline answers in a pull request, not a project plan.

## Key takeaways

- A token is a decision with a concurrency problem; design for one source of truth and mechanical flow, not manual sync.
- Ship token changes as pull requests with real diffs — the review is where the system stays human.
- Test tokens in CI: grammar, ancestry, contrast pairs. Tokens are code.
- Allow urgent overrides but make them mark themselves; track token debt like any other debt.
- Version token releases so caches and mismatches are visible, not mysterious.
- Keep a weekly cadence where tokens are proposed, owned and pruned — pipelines rot socially before they rot technically.

## FAQ

**Should we use Style Dictionary or roll our own transform?**
Either. The transform step is the least interesting part of the system — pick the tool your engineers will happily debug at 4pm on a Thursday. Consistency beats cleverness.

**How do we start if we already have drift?**
Don't boil the ocean. Pick one surface (usually colour), declare it token-only, and let the rip current do the rest. Retrofitting all layers at once is how pipelines get abandoned.

**Do tokens belong in the app repo or a shared package?**
Shared package as soon as two build targets consume them — but keep publish cadence slow and versioned. A shared package with daily breaking releases is worse than copy-paste.

*Building a design system that has to survive a real engineering organisation? That's a normal Tuesday for our [squads](/services/product) — [come talk to us](/contact).*
