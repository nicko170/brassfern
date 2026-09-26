---
title: "Testing design tokens in CI like the API they are"
description: "Design tokens are an API contract between design and engineering. The CI pipeline that enforces it: grammar linting, ancestry checks, contrast tests."
slug: design-tokens-pipeline-ci
cluster: engineering
tags: [design systems, design tokens, ci, testing, governance]
date: 2025-10-02
author: Felix Brandt
keywords: [design tokens ci, tokens testing, style dictionary pipeline, design system governance, token versioning]
readingTime: 9
---

A design token file is an API. It has consumers (every component, every platform, every demo), it has a schema (names, types, values), and it has the failure modes of any API: breaking changes shipped in minor versions, undocumented deprecations, consumers pinned to values that no longer mean what they meant. Yet most teams version-control their tokens with less rigour than they'd apply to a README. A designer renames `--color-accent` to `--color-brand` in Figma on Tuesday; production ships with brown buttons on Thursday and nobody can explain why.

This article is the pipeline we run to stop that. It treats tokens as a published contract: linted, tested, versioned, and released with changelogs. It's the engineering half of the design-system story — the design half lives in [colour systems that survive dark mode](/journal/web-design/colour-systems-dark-mode).

## Layer 1: grammar and shape linting

Before semantics, syntax. Every token file passes a schema validator in CI that checks, at minimum:

- **Naming grammar.** Tokens follow a strict pattern — ours is `<category>-<concept>-<variant>-<state>` (e.g. `color-surface-raised-hover`). A regex per category and a rule that every token must match one. This catches `color-blue-ish` and `tempButtonBg` before they metastasise.
- **Type declarations.** Every token declares its type (`color`, `dimension`, `duration`, `fontFamily`…). The W3C Design Tokens Community Group format gives you `$type`; enforce it. Type-less tokens are how `"12px"` ends up in an opacity slot.
- **Reference integrity.** Any token that references another token (`{color.fern.500}`) must resolve. Dangling references fail the build, not the browser.
- **No raw values in reference tiers.** Semantic tokens (the ones components consume) may only *reference* primitive tokens, never hardcode a hex. This single rule preserves dark mode and rebrand survivability — the whole point of the tier system.

## Layer 2: ancestry and orphan checks

A token that nothing references is dead weight; a primitive that nothing semantic references is a gap. We run a graph analysis on every PR:

1. Build the reference graph from primitives → semantics → component tokens.
2. Fail on **orphans**: primitives with no semantic consumer after 30 days (grace period via an allowlist with expiry dates, so "we're about to use this" can't be permanent).
3. Warn on **semantic fan-in extremes**: a semantic token consumed by forty component tokens is a basket holding too many eggs — a design-review trigger, not an error.

The ancestry report gets posted to the PR as a comment: "this change affects 3 semantic tokens and 212 component usages across 2 codebases." That number, visible *before* merge, has prevented more incidents than any review process we've tried. It turns "small tweak" into an informed decision.

## Layer 3: contract tests — contrast, motion, type

This is where token pipelines usually stop, and where the value actually starts. Because tokens are data, you can write unit tests against the *design system itself*:

**Contrast-pair tests.** Declare which token pairs must coexist as text/background (`--ink` on `--paper`, `--night-text` on `--night`, `--fern` on `--paper`) and assert WCAG ratios in CI: 4.5:1 for body pairs, 3:1 for large-display pairs. When a designer adjusts a tint, the test suite tells them exactly which pair broke — no more discovering contrast failures in a quarterly audit. This is the natural extension of the principles in [accessibility starts in the design file](/journal/web-design/accessible-design-handoff): the audit runs on every commit.

**Motion ceiling tests.** Duration tokens above `400ms` fail unless they're on an explicit allowlist keyed by name (`duration-celebration` gets 800ms, `duration-hover` never does). The 160ms-and-earned philosophy from [motion that earns its keep](/journal/web-design/motion-that-earns-its-keep) becomes executable policy.

**Scale coherence tests.** Spacing tokens must be multiples of the base unit. Type-scale ratios between adjacent steps must fall within tolerance. These catch the accidental `13px` that slipped into a scale built on 4px.

## Layer 4: versioned releases with content hashing

Tokens get published as a versioned package (or a versioned artifact consumed by CSS generation). Our rules:

- **Semver, honestly applied.** Renames and removals are majors. Value changes that alter rendering are minors *at best* and majors if the pair tests classify them as breaking (a contrast flip is breaking, full stop). Additions are patches or minors.
- **Content-hash fingerprints.** Every release embeds a hash of the normalised token set. Component builds embed the hash they were compiled against; runtime mismatches (stale CDN CSS against fresh JS) surface as a console warning in staging, not a visual bug in production.
- **Generated changelogs.** The diff between releases becomes a human-readable changelog automatically: "3 tokens added, 1 value changed (`color-fern-600`: `#2f6a48` → `#356f4e`), affects 14 component usages." Designers review the changelog; it's the moment design intent and engineering reality reconcile.
- **Codemods for renames.** A major release with renames ships a codemod that rewrites consuming code. Adoption of a breaking release becomes one command instead of a scavenger hunt, which is the difference between breaking changes that happen and breaking changes that get permanently deferred.

## Wiring it together

The pipeline order matters because feedback speed matters:

1. Schema lint (seconds) — catches typos.
2. Reference + ancestry graph (seconds) — catches structure.
3. Contract tests (seconds) — catches semantics.
4. Visual regression in the component library build (minutes) — catches the aggregate.
5. Release + changelog + codemod (on merge) — communicates.

Steps 1–3 run on every PR touching the token directory and block merge. The total added CI time is under twenty seconds. The first contrast-pair failure it catches pays for the entire setup.

## What this changes culturally

The unexpected effect of token CI isn't fewer bugs — it's a different conversation. "Can we just add one more grey?" becomes a visible act with a cost: a new primitive, ancestry obligations, pair-test implications. Designers stop seeing engineers as gatekeepers and engineers stop seeing design changes as unannounced breaking API edits, because the pipeline is the gatekeeper — neutral, fast, and equally strict with everyone.

It also makes handover durable. When a client team inherits a system with tests on it, the system keeps its shape after we leave. That's the living-handover philosophy from our [handover playbook](/journal/playbooks/design-handover-done-right) expressed in infrastructure.

## Key takeaways

- Treat tokens as a versioned API: schema lint, reference integrity, contract tests, honest semver.
- Contrast pairs, motion ceilings, and scale coherence are all executable as unit tests against token data — run them on every PR.
- Ancestry reports ("this change touches 212 usages") turn silent breaking changes into informed decisions.
- Changelogs and codemods are what make breaking token releases adoptable instead of feared.

## Frequently asked questions

**We're a small team with one Figma file and one CSS file. Is this overkill?**
Start with two pieces: a naming-grammar lint and contrast-pair tests. That's an afternoon of setup and it covers the two most common failures. Add versioning when you have a second consumer.

**How do tokens get from Figma to the repo?**
One direction only: the repo is the source of truth, Figma syncs from published releases. The reverse direction (Figma → code without review) is how undocumented changes ship. Designers propose changes in the token file like everyone else — the tooling syncs the library.

**Should semantic tokens live in the same file as primitives?**
Separate files, same package, explicit dependency direction. Primitives never know semantics exist. This is what keeps dark mode and rebrand themes possible without touching components.

**What's the most valuable single test?**
The contrast-pair suite, by a wide margin. It's cheap, it's objective, it has legal and ethical weight behind it, and it's the class of design-system bug most likely to reach users undetected.
