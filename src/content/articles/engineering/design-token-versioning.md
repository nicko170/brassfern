---
title: "Design tokens are an API — version them like one"
description: "Rename a token and you ship a breaking change. Semantic versioning for token contracts, codemods for renames, migration windows, and deprecation hygiene."
slug: design-token-versioning
cluster: engineering
tags:
  - design-systems
  - design-tokens
  - versioning
  - design-engineering
date: 2026-02-18
author: Felix Brandt
keywords:
  - design token versioning
  - design ops
  - token API
  - breaking changes design system
  - design engineering
readingTime: 9
---

Nobody versions their design tokens, and everybody pays for it. The payment arrives on a Tuesday, when a designer renames `color-action-primary` to `color-interactive-primary` in Figma — a perfectly reasonable editorial decision — and three days later a contractor's branch, cut from a two-week-old tokens package, renders half the settings page in browser-default grey. No error. No warning. Just a quiet, distributed visual regression across a product nobody fully screenshots.

The root cause is a category error. Teams treat tokens as *assets* — a JSON file that floats around, imported latest-first, like a logo on a shared drive. Tokens are not assets. Tokens are a **public API consumed by code you don't control**, and the moment more than one codebase, squad, or vendor consumes them, every rename is a breaking change and every silent redefinition is an incident waiting for a quiet afternoon.

We laid the groundwork for this in [building a token pipeline from Figma to production](/journal/engineering/design-tokens-pipeline) and [testing tokens in CI](/journal/engineering/design-tokens-pipeline-ci). This piece is about the part everyone skips: the contract. What breaks, how to version it, and how to stop fearing your own rename.

## What "breaking" means for tokens

Semantic versioning is a perfect fit for tokens, but only if you're honest about what each tier means. Our mapping, argued over one long Friday and stable ever since:

**Patch (x.y.Z) — consumers cannot tell the difference structurally, and might not even notice visually.** A colour refined within its contrast class (`#1e4d33` → `#1f5036`, still AA on its documented pairings). A duration nudged by 10ms. A shadow softened. If a consumer *could* pin an exact pixel diff and complain, they can also be told: it's a patch, pin your screenshots if you care that much.

**Minor (x.Y.0) — purely additive.** New tokens, new themes, new optional metadata. Existing names keep existing meaning. Anything added is safe to adopt and safe to ignore. A new `--elevation-overlay` does not break the dialog that was hardcoding a shadow — it just gives it somewhere better to live.

**Major (X.0.0) — renames, removals, and semantic redefinitions.** This last one is the sleeper. Changing what `--text-secondary` *means* — repurposing a token that documented consumers built assumptions on — is breaking even if the name survives. Repointing `--brand-primary` from fern to brass in a rebrand is a major version, not because the build fails, but because the *meaning* failed. Our piece on [colour systems that survive rebrands](/journal/web-design/colour-systems-dark-mode) covers the design side; the engineering side is that a rebrand is a token major version with all the ceremony that implies.

Write this mapping down in the tokens package README. The entire discipline collapses if "major" is vibes.

## Publish the contract as an artifact

Versioning only works if the thing being versioned is a real artifact — an npm package, a tagged release, something with a lockfile entry — not "the JSON in the design-system repo that people copy." Our shape, boring on purpose:

- One tokens package per brand system, published with semver and a CHANGELOG.md a human actually writes (commits don't write themselves into prose).
- Compiled outputs committed per release: CSS custom properties, a TypeScript module of typed token names, and the raw JSON. Consumers pick their substrate; the *names and values* are identical across all three, enforced by the same build.
- The TypeScript module is the enforcement layer. Export token names as a union type, and a removed token becomes a compile error in every consumer on upgrade. This is the strictness-ratchet instinct applied to design: we did the same with [types across the codebase](/journal/engineering/typescript-strictness-ratchet) — make the wrong thing fail loudly at the cheapest possible moment.

A compile error is a gift. The failure mode you're defending against is worse: tokens consumed as raw strings in CSS, where a rename produces *no error at all*, just absences — fallbacks silently engaging, `var(--legacy-name, #888)` quietly winning, a product slowly drifting out of brand while every dashboard stays green. Failing loudly is the product.

## Renames are codemods, not memos

Every major version that renames tokens ships a migration codemod in the same release. This is non-negotiable and it's the part teams talk themselves out of, which is exactly backwards: the codemod is what makes the rename *cheap*, and cheap renames are what keep the vocabulary honest instead of fossilised around its earliest mistakes.

The codemod is usually embarrassingly small. A rename map checked into the release — `{ "color-action-primary": "color-interactive-primary" }` — plus a script that walks consumer codebases rewriting three shapes: the typed token reference, the CSS custom property usage, and the theme-object key in any tests. We run it across the fleet from one repo with a loop over clone → codemod → branch → PR, the same plumbing any codemod system uses. Twenty consumer repos migrate in an afternoon, each with a reviewable diff and CI doing the arguing.

Two rules keep codemods trustworthy. First, **never auto-merge**: the codemod proposes, a human on the consuming squad disposes, because token renames occasionally collide with local custom work the codemod can't see. Second, **test the codemod against its own fixture repo** in CI before release — a codemod that half-renames is worse than no codemod, because it teaches people not to trust the next one.

## Deprecation has a window, and the window is public

Removals shouldn't work like renames. A rename has a mechanical fix; a removal — of a token, a theme, a whole tier of the type scale — needs a migration window where the old thing exists, works, and *complains*. Our protocol:

1. **Announce in the changelog of the *last minor*** before the major: "these six tokens are deprecated, removal in v5, here's the replacement for each, here's the codemod."
2. **Make deprecation detectable.** The typed export keeps deprecated tokens under a `@deprecated` JSDoc tag so editors strike them through; the CSS build can emit a console warning in development mode listing deprecated usages. Developers should encounter the news *in their workflow*, not in a Slack message from March.
3. **Give the window a real deadline** — one full quarter for product repos — and then honour it. A deprecation that never completes teaches the fleet to ignore deprecations. The deadline can move for a documented reason; it cannot evaporate.
4. **Remove loudly in the major.** Deleted tokens, codemod for whatever mapping is mechanical, manual-migration notes for the rest, and a release note boring enough to be trusted.

The window is the empathy. The deadline is the spine. You need both, in writing, per release.

## Communicating across squads without a comms department

Token governance fails socially before it fails technically. A fifteen-person studio doesn't have a design-systems comms function; it has a shared channel and good habits. What survives contact with reality:

- A changelog written for *consumers*, listing per token: added / deprecated / removed / redefined. Not a git log. Nobody's archaeology hobby.
- A one-post digest in the shared channel per release, three sentences: what changed, what you must do, what happens if you don't.
- A pinned "current version" note each squad updates in their repo README, so a glance tells you who lags. (Lagging a major version is fine! Pinning is a feature of semver, not a character flaw. Lagging *unaware* is the disease; the note cures that.)
- A quarterly ten-minute slot in the design critique where the tokens owner previews upcoming deprecations. Faces beat threads for anything that asks people to do work.

If any of this feels heavy, remember the alternative we've audited twice on client engagements: a design system nobody dares rename, with `color-blue-2-final` and `color-blue-2-final-USE-THIS` coexisting since 2023, three parallel forks of the tokens file, and a rebrand quoted at eleven weeks that should have taken three. Versioning is the *cheaper* bureaucracy.

## Key takeaways

- Tokens consumed by more than one codebase are an API. Apply semver honestly: visual refinements are patches, additions are minors, renames/removals/redefinitions are majors.
- Publish tokens as a versioned artifact with typed exports; a removed token should fail consumer builds, not fade silently to fallback grey.
- Every rename ships with a codemod and a checked-in rename map. Codemods propose; humans on consuming squads merge.
- Deprecations get a public window with a deadline: deprecate in a minor, warn in dev, remove in the major, on schedule.
- Consumer-written changelogs, pinned version notes, and a standing critique slot are the whole comms plan. Failing loudly is the feature.

## FAQ

**Isn't semver for libraries, not colours?** Semver is for *contracts with consumers*, and a token name is exactly that — code you didn't write depends on strings you control. The medium is colour; the discipline is dependency management. The moment two repos import the same tokens, you're in the library business whether you meant to be or not.

**What about continuous delivery — can we just ship tokens live to everyone?** You can, for patch-tier changes inside one product you fully own and visually regression-test per deploy. The moment consumers are repos you don't deploy — vendor code, sister products, white-label forks — "live" becomes "unversioned," and unversioned is how `color-blue-2-final-USE-THIS` is born. Ship fast inside the boundary; version at the boundary.

**How do we version Figma itself?** Figma variables are the *source*, not the distribution. Version the compiled package; Figma's own version history handles the design-side rollback. Publish a tokens release when the compiled output changes, and name Figma libraries after the release they correspond to ("Core tokens v4") so designers and developers are pointing at the same contract when they argue.

**We have six engineers. Isn't this overkill?** Six engineers is the perfect size for this, because six engineers can adopt the habit in one sprint and never pay the audit tax later. The ceremony scales down gracefully: your MAJOR can be announced in a stand-up, your codemod can be a regex in a gist — as long as the *map* is checked in and the *changelog* is written. Skip those two and size doesn't save you.

---

*Tokens are the load-bearing API of every [product design engagement](/services/product) we run. See [how we work](/approach), or [bring us your system](/contact).*
