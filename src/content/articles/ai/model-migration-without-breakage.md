---
title: "Swapping the model without breaking the product"
description: "Model migrations without breaking the product: shadow runs, eval-gated cutovers, tone and format regression diffs, and rollback plans for behaviour you can't unit test."
slug: model-migration-without-breakage
cluster: ai
tags: [llm ops, migration, evals, testing, platform engineering]
date: 2026-07-30
author: Felix Brandt
keywords: [llm model migration, model upgrade testing, ai regression testing, llm shadow deployment]
readingTime: 11
---

Every LLM product eventually faces the migration: a better model ships, a provider deprecates your version, or costs force a smaller model into a bigger job. Traditional software migrations are painful but legible — you have types, tests and diffs. Model migrations have none of that comfort. The API signature is identical, the unit tests are green, and the product is nonetheless different: summaries got chattier, refusals moved, JSON keys renamed themselves in two percent of runs. The system "works" and the product is broken.

We've now run this drill across client platforms three times — once under deprecation deadline pressure, twice chasing quality and cost. The playbook below is the one that kept all three boring. Boring is the goal.

## Why model diffs are product diffs

The mental model to install first: a model swap is not a dependency upgrade, it's a **behavioural regression surface the size of your entire prompt surface**. Every prompt in the system now produces different output. Some differences are improvements. Some are irrelevant. Some are silent failures of assumptions your downstream code and UX were built on.

The categories that actually bite:

- **Format drift.** The new model adds a preamble ("Certainly! Here's your summary:"), changes how it emits JSON, or wraps code in different fences. Anything parsing output breaks — sometimes silently, into a generic error state the user can't act on.
- **Tone drift.** Your support assistant's warmth was partly the old model's personality. We've seen a swap move a feature's measured sentiment enough that users described it as "the assistant got rude", with zero prompt changes.
- **Refusal and boundary drift.** What the model declines, hedges or escalates on changes between versions. Safety-critical flows (we've shipped these in health and fintech — see the [Pylon Health case study](/work/pylon-health-telehealth-flow)) treat any boundary movement as a serious incident until characterised.
- **Length and latency drift.** Outputs get 30% longer; your UI truncates; your [streaming UX](/journal/ai/streaming-ux-patterns) feels different; your cost model quietly doubles.

None of these appear in a provider's changelog as "your product will change". Changelogs describe the model. You own the product.

## Step one: build the golden set before you need it

You cannot diff behaviour you never recorded. The precondition for any sane migration is a **golden set**: a few hundred real, de-identified inputs per feature, covering the common cases, the edge cases you care about, and every production failure you've ever fixed. Ours live in the repo, versioned next to the prompts they exercise.

If you don't have one, building it is the migration's first work package, not a nice-to-have. Harvest from [your AI analytics](/journal/ai/ai-feature-analytics): the most frequent input shapes, the flagged-wrong outputs, the correction-list patterns. Fifty good examples per feature beats five hundred junk-drawer ones; curate like it's a test suite, because it is one. This is exactly the eval philosophy we laid out in [our evals guide](/journal/ai/llm-evals-framework) — the migration playbook assumes that infrastructure exists.

## Step two: shadow-run with recorded traffic

Never A/B a model swap on live users as the first step. Shadow-run first: production traffic flows to the current model as normal; the same inputs are *also* sent to the candidate model, and the outputs are stored but never shown. A week of shadow traffic gives you a paired dataset — old output and new output for the same real inputs — without any user exposure.

From the pairs, compute a regression diff:

- **Structural checks** (automatic): output parses; required fields present; length within band; citations resolve to real passages; latency and token-cost deltas.
- **Semantic checks** (grader model or rubric): is the new answer at least as correct as the old on the golden set? Score each pair, and require a **win rate plus a flat-loss rate**: e.g. the candidate must win or tie ≥97% of the set, and must not lose by more than a small margin on any safety-critical slice.
- **Tone and format diffs** (automatic + sampled human review): measure the preamble rate, refusal style shifts, markdown habits. Sample fifty pairs and have a human read them side by side. Automated graders miss "it got sycophantic"; humans catch it in ninety seconds.

A note on graders: a grader model has its own preferences and will systematically favour outputs in its own style. Mitigate with a rubric that names concrete criteria (citation accuracy, instruction compliance, prohibited phrases) and anchor it with human-scored examples.

## Step three: gate the cutover, slice by slice

Full-fleet cutover day is for gamblers. Migrate by slice: per feature, per tenant cohort, per risk tier.

Our gating rule is simple: a slice flips when its shadow stats hold the win-rate bar for five consecutive days, and its failure alerts are wired. Internal-facing and drafting features go first — a chattier first draft is annoying, not harmful. Features with external blast radius (customer-facing answers, anything touching money or health) go last, and get an extra week of shadow plus a staff-preview flag. Support teams get the preview access and a heads-up on the known behaviour deltas, written in the language users will use: "answers may be shorter and more direct."

Keep the old model's code path alive behind a config flag. This is not optional. Rollback for a model is a config change — but only if you built the config change. We've never needed the emergency rollback and we're glad we had it both times, because needing it without having it is a page-one incident.

## Step four: hold a benchmark across versions

Post-cutover, the discipline that separates calm platforms from chaotic ones is a **standing benchmark**: the golden set, run nightly, with scores trended over time. Providers change models in place; behaviour moves without any deploy on your side. The standing benchmark is your smoke alarm — when a score dips, you investigate the provider, your prompts, or the data drift, in that order.

Prompts, by the way, are code in every practical sense. Review them like code: a prompt change and a model change through the same gate, with the golden set attached to the PR. When prompts live in code instead of the provider dashboard, migrations become diffs you can bisect — the same instinct behind treating [prompt libraries as a design system](/journal/ai/prompt-design-systems).

## A timeline that works

For a mid-size product (five to eight AI features), the honest schedule:

1. **Week 0–2:** build or refresh the golden set; instrument shadow-run plumbing.
2. **Week 2–3:** shadow-run the candidate; compute diffs; fix format drift with output adapters where possible rather than prompt rewrites — adapters are swappable, prompt rewrites entangle the migration with other changes.
3. **Week 3–5:** slice cutovers, internal to external, with the benchmark live.
4. **Week 5+:** decommission the old path after two clean weeks, and write the migration retro into the golden set as new cases.

Deprecation deadlines compress this; they don't remove steps, they parallelise them with more people.

## Key takeaways

- A model swap changes your product's behaviour everywhere at once. Treat it as a product change, not a dependency bump.
- Record a golden set before you need it: real inputs, edge cases, and every historical failure.
- Shadow-run with real traffic and diff the pairs — structural checks, semantic win rates, and human-read tone samples.
- Gate the cutover in slices by blast radius; keep the old model one config flag away.
- Run a standing nightly benchmark. Models change underneath you without asking.

## FAQ

**Can't we just pin a model version forever?**

Sometimes briefly, never indefinitely. Providers deprecate versions on six-to-twelve-month clocks, and staying behind usually means paying more for worse output. Pin versions for stability, and build the migration muscle so upgrades are routine rather than existential.

**How big should the golden set be?**

Per feature: 50 is enough to catch format and tone drift, 200–300 starts to catch rare semantic regressions. Quality dominates quantity — one example per distinct failure mode you've seen is the highest-value coverage.

**Should we rewrite prompts for the new model?**

Deliberately, and separately. Prompts tuned under the old model often carry folklore — phrases that steered the old model and now do nothing or backfire. Rewrite after the migration is stable, with the benchmark proving each change, one variable at a time.

**What about users who preferred the old behaviour?**

It happens: an accidental behaviour becomes a beloved feature. If the diff review flags a behaviour change that users built workflows around, either preserve it explicitly in the prompt or announce the change with a reason and a lead time. Silent productivity regression is still a regression.

**Who owns this — ML, platform, or product?**

Platform owns the plumbing (shadow runs, flags, benchmark), product owns the acceptance criteria (what "not broken" means for users), and whoever owns the prompts owns the rewrites. If any of those seats is empty, fill it before the deprecation email arrives.
