---
title: "The TypeScript strictness ratchet: stricter every sprint, never a big bang"
description: "Strict mode on a legacy codebase is a migration disguised as a flag. The ratchet approach: incremental flags, scoped configs, codemods and type-debt metrics."
slug: typescript-strictness-ratchet
cluster: engineering
tags: [typescript, code quality, migration, static typing, engineering practice]
date: 2026-06-11
author: Felix Brandt
keywords: [TypeScript strict mode migration, incremental typescript adoption, type safety ratchet, typescript compiler flags]
readingTime: 10
---

Every aging TypeScript codebase has the file: a `tsconfig.json` from 2021 with `"strict": false` and a comment promising to revisit. The promise never ships, because the honest alternative — flip the flag, face 4,000 errors, halt feature work for a quarter — is commercially indefensible. So the codebase drifts on, enjoying maybe 40% of TypeScript's value: autocompletes nicely, catches typos, and lets entire classes of null bugs walk straight through CI.

The way out isn't discipline or heroics; it's a ratchet — a mechanism that only turns one way. Tighten the type system continuously, in slices small enough that no sprint notices, and structure the work so backsliding is mechanically impossible. We've run this on client codebases from [legal document platforms](/work/quill-legal-document-platform) to dashboards with a decade of organic growth. The shape is always the same: measure, slice, ratchet, codemod, repeat.

## Why big-bang strict migrations fail

The failure is political before it's technical. Flipping `strict` produces thousands of errors in files nobody owns, touching any of them surfaces unrelated bugs, and the migration branch diverges from main while product work continues — so the branch gets rebased until someone gives up, or gets merged in a weekend nobody fully reviewed. Meanwhile the organisation learns a lesson: "strict mode broke our flow for two months."

The ratchet replaces the event with a habit. Strictness is not a state you leap to; it's a direction you never turn away from. That reframe matters to the team more than to the compiler: every sprint ends slightly stricter than it began, and the toolchain makes regression impossible even for people who weren't in the original conversation.

## The mechanism: three ratchets that work

**Ratchet one: per-flag, not per-switch.** `"strict"` is a bundle of flags with wildly different cost-to-fix ratios. Enable them individually, cheapest first: `noImplicitThis` and `alwaysStrict` are often nearly free; `noImplicitAny` is where legacy code keeps its secrets — the usual fix is explicit `unknown` at boundaries plus genuine narrowing, not sprinkling `any` which merely renames the sin; `strictNullChecks` is the expensive one — most codebases have hundreds of "this is maybe undefined" flows that were never anyone's deliberate decision. Sequence them as separate milestones, each landed green.

**Ratchet two: per-directory configs.** TypeScript's project references (or `extends` from a base config with per-directory overrides) let you declare new code strict while legacy directories stay loose. New directories and new files are strict from birth — which is the actual point of a ratchet, since most churn is in new code, and new code written strictly never becomes tomorrow's debt. The migration then reduces to shrinking the list of loose directories, one bounded, ownable chunk at a time.

**Ratchet three: the error-count lockfile.** Some debt resists per-directory scoping — errors in shared modules that everything imports. For these, check the current failure count into the repo as a generated baseline (one known-errors file per flag, or an eslint-style suppression list with counts), and fail CI if the count *rises*. Increases fail the build; decreases get celebrated, and every PR that fixes errors must regenerate the baseline. This is the ratchet in its purest form: the number can only go down. It also makes the migration visible — a burn-down chart of remaining errors is surprisingly good management material, since it converts "when will strict mode land?" into a date on a slope.

## Codemods: automate the boring 80%

A large share of strict-mode errors are mechanical: implicit `any` from untyped module boundaries where an inference would do, redundant non-null assertions, legacy `Function`/`Object` types, functions whose return types should be explicit. Write small codemods (or use the compiler's own — `tsserver`'s codefixes applied en masse via scripts) for each signature mechanical pattern, run them directory by directory, land each as its own reviewable PR. The discipline: codemod output must be *behaviour-identical*; anything requiring judgement — a genuinely ambiguous nullable, an API that should really return a discriminated union — is left for humans. Mixing judgement into automated diffs is how migrations break production behaviour while fixing nothing.

The same pipeline usually finds legitimate bugs — the undefined that really could happen, the exhaustive switch that wasn't. File those separately; they're evidence you can take to the conversation about why the remaining engineering investment is worth it.

## Lint rules that encode the target state

The compiler enforces types; the linter encodes *policy*, and policy is what keeps a strict codebase strict after the migration energy fades. The rules that matter most:

- `@typescript-eslint/no-explicit-any` at **error** in strict directories, warning (heading to error) in loose ones — with an explicit, grep-able escape hatch (`// type-debt: reason + ticket`) so exceptions are documented, not hidden.
- `no-unsafe-*` family (`no-unsafe-assignment`, `-call`, `-member-access`, `-return`) — these close the holes where `any` leaks through seams like `JSON.parse` and third-party typings. Pair with the discipline from [shared validation contracts](/journal/engineering/schema-validation-shared-contracts): parse at boundaries with a schema, never cast.
- Bans on `!` non-null assertions and `@ts-ignore` in favour of `@ts-expect-error` (which errors when the error disappears — a self-cleaning suppression).
- Consistent-type-imports and explicit-function-return-type at module boundaries, configured to the team's taste — these are the diff-noise reducers that make reviews about logic.

## Measuring type debt like you'd measure performance

What gets trended gets funded. Three numbers on the engineering dashboard, next to the [bundle budget](/journal/engineering/bundle-budget-discipline): the known-errors counts per flag (should slope to zero), the loose-directory count (should shrink), and a rough `any`-density measure — eslint counts of `no-unsafe` and `no-explicit-any` violations per 1,000 lines. Publish the slope, not just the level. In our experience the second derivative does the persuading: "we'll cross zero in Q3 at current pace" ends the debate about whether the migration will ever happen, which is the debate that actually kills migrations.

And celebrate crossings. First time `strictNullChecks` goes green on a directory that processes money is a ship-it moment, not a line in a sprint review. Type migrations die of invisibility more often than of difficulty.

## Key takeaways

- Strict mode on legacy code is a ratchet, not an event: a direction you never reverse, enforced mechanically.
- Enable flags individually, cheapest first; `strictNullChecks` is the expensive milestone and gets its own plan.
- Per-directory configs make new code strict from birth — new code is most of the churn, so the ratchet bites immediately.
- Lock remaining errors into a baseline file that fails CI on increase. The count only goes down; the slope is the schedule.
- Codemod the mechanical 80% as separate, behaviour-identical PRs; leave judgement to humans.
- Lint rules encode the target state; trend type-debt metrics next to performance budgets so the work stays funded.

## FAQ

**How long does the whole ratchet take?** On mid-size codebases (100–300k lines) with steady effort, six to eighteen months to near-full strictness — but the important answer is that it's strict-for-new-code within the first sprint. The tail is shrinking, bounded work, not a blocker.

**Enable strict in library code we're about to deprecate?** No — that's the beauty of per-directory scoping. Deprecation and strictification are both ratchets; don't pay for both on the same code. Tape over, deprecate, delete.

**What about the team's temporary productivity dip?** Real for a few weeks, mostly from `strictNullChecks` — engineers write code the compiler rejects until the mental model updates. Mitigate with pairing on the first strict PRs and with examples in the PR template from the team's own codebase, not from the TypeScript handbook.

**Is this how Brassfern greenfields run?** New codebases start strict — `strict`, the `no-unsafe` family, the lint policy — from the first commit; the ratchet is the pattern we bring to inherited code inside [product engineering](/services/product) engagements. Granted: strict-from-scratch is easy. Strict-in-2026-on-a-2019-codebase is a programme, and programmes deserve mechanisms, not memos.
