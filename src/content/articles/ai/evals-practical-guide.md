---
title: "Evals are the new unit tests: a practical guide for product teams"
description: "Golden sets, rubric graders, regression gates and CI plumbing: how product teams build LLM evaluations that catch real regressions without a research team."
slug: evals-practical-guide
cluster: ai
tags:
  - Evals
  - Testing
  - AI engineering
date: 2026-03-31
author: Priya Nair
keywords:
  - llm evals
  - ai evaluation
  - model testing
  - prompt regression
  - golden dataset llm
readingTime: 11
---

Traditional software gives you a comforting lie: the test passes or it fails. LLM features give you nothing so clean. Outputs are prose, quality is a gradient, and the same prompt run twice disagrees with itself. Teams respond in one of two bad ways — shipping on vibes ("the PM tried it ten times and it seemed fine") or abandoning measurement entirely because perfect measurement is impossible.

Between those failures sits a practical middle: evals as *engineering hygiene*. Not research-grade benchmark science — just the unit-test habit applied to a new, noisier material. We've made the philosophical case in [why evals come before features](/journal/ai/llm-evals-framework); this is the build guide: golden sets, rubric graders, regression gates, and the CI plumbing that ties them to your day job. It's the machinery that makes the operational lessons in [what production taught us](/journal/ai/shipping-llm-features-lessons) actionable instead of anecdotal.

## Golden sets: small, real, and lived-in

A golden set is a fixed collection of inputs paired with expectations about good outputs. Everything else in this article is plumbing around this artifact, so get its properties right:

- **Size: 30–150 examples per feature.** Under 30, noise swamps the signal — a single flaky grader judgment moves your pass rate 3 points. Over a few hundred, the set stops being maintainable and quietly rots. Start at 40.
- **Source: real inputs, not invented ones.** The first 20 examples come from dogfooding and beta logs (privacy-permitting); the rest accrete from production: every user-reported bad answer, every thumbs-down, every support ticket about the feature becomes a candidate. Invented examples test the product you imagined; logged examples test the one users met.
- **Composition: stratified by failure, not by frequency.** Include the happy path, but overweight the edges — empty states, adversarial inputs, ambiguous requests, locale and formatting variants, and every historical regression. A regression deserves a permanent home in the set; that's the entire mechanism for never shipping the same bug twice.
- **Format: input, context, expectation.** Store the raw input, any retrieval context or tool state it depends on (frozen), and an expectation written for a grader: sometimes a reference answer, more often a rubric ("must cite a source from the policy docs; must not state an absolute refund guarantee; under 120 words").

Store golden sets in the repo, reviewed like code. The discipline is the point: when the set is a first-class artifact, product managers add examples, support adds examples, and the [prompt library](/journal/ai/prompt-design-systems) grows a test suite beside it.

## Graders: exact where possible, rubric where necessary

Every example needs a grader that turns an output into a score. Use the cheapest grader that can tell good from bad:

**Deterministic checks first.** Surprising amounts of LLM output quality are checkable in code: valid JSON matching a schema, closed-answer formats honoured, required citations present, forbidden phrases absent, word-count bounds, links resolving. These graders are free, instant and never wrong — max out this layer before reaching for anything fancier.

**Reference comparison where truthful.** For extractive tasks (summaries of provided text, classifications with known labels, Q&A over fixed documents), exact match, label accuracy, or embedding-similarity against a reference answer all work. Similarity thresholds need calibration per feature; treat 0.85-style numbers as starting points, not constants of nature.

**LLM-as-judge for open-ended quality, with rules.** An evaluator model scoring against a written rubric is the workhorse for prose quality, and it's trustworthy only under discipline:

1. **Grade criteria in separate passes.** One yes/no judgment per rubric line ("Does the answer state a source?" scored alone) is far more reliable than a single holistic 1–5. Composed judgments drift; atomised judgments hold.
2. **Write the rubric like a spec, with examples.** Include two or three graded examples inside the judge's prompt. A rubric without demonstrations is a horoscope.
3. **Calibrate against humans quarterly.** Sample 50 graded items, have a human re-grade, measure agreement. When judge-human agreement drops below ~80% on a criterion, the criterion is badly written or the judge can't see what matters — fix the rubric, not the threshold.
4. **Mind self-preference.** Judges favour their own model family's phrasing; when grading across candidate models, use a judge from neither family, or at minimum know the bias exists.

A composite score per example — weighted average of its criteria — gives you the metric CI can act on. Keep the rubric in the repo beside the golden set; an undocumented rubric is a test nobody can fail on purpose.

## Regression gates: what CI enforces

The point of all this machinery is a pipeline that says "that change made things worse" before users do. Our reference setup, per AI feature:

- **On every pull request touching prompts, retrieval or model config:** run a *fast gate* — 30–40 item subset, deterministic checks plus one LLM judge pass, total runtime under ~5 minutes and a few dollars. Fail the build if the composite drops more than ~3 points versus the recorded baseline, or if any single regression-flagged example (from the incident archive) flips from pass to fail. The archived-regression rule is the non-negotiable one — it's the anti-groundhog-day clause.
- **Nightly:** full golden set, plus variance measurement (each example run 3x; features with >20% output flip-rate on identical input get flagged for prompt stabilisation work).
- **On every provider model change:** full set against old and new checkpoints, diffed in *both* directions — the improvement diff matters too, since "better" breaks parsers and calibrations built on the old behaviour.
- **Thresholds are features' own.** A legal-drafting assistant gates tighter than a tagline generator. Write each feature's gate thresholds beside its golden set, with a sentence justifying them. Unjustified numbers decay into superstition.

The economics are friendly: at current grading-model pricing, the nightly suite for a mid-size feature suite costs less than the monitoring tool you already pay for. If a team claims evals are too expensive, the actual objection is almost always that they're annoying.

## The pitfalls that eat eval programs

The failure modes we see repeat across teams:

- **Evaluating vibes instead of outcomes.** "Is the tone friendly?" matters less than "did the answer contain the three facts the task required?" Rewrite rubrics toward observable outcomes; tone survives as a minor criterion, not the headline.
- **Set–production drift.** The golden set freezes while usage moves: a new market, a new integration, a slang shift. Budget one hour a month to add the month's production failures and retire examples that no longer represent real inputs. An unmaintained set shows a steady, comforting, fictional pass rate.
- **Teaching to the test.** Prompts get tuned until gate metrics climb while production quality stalls — classic Goodhart. Defence: rotate a held-out slice (10–20 examples the prompt author never sees), and periodically spot-check production outputs against the same rubric.
- **Judging the judge with the judge.** When grader scores look wrong, a human spots it — never let disagreement with the judge be itself auto-graded by the judge. That recursive shortcut is how pipelines learn to assert their own excellence.
- **Skipping evals because quality is 'already good'.** The gate isn't for quality today; it's the fence around the refactor you do in nine months when nobody remembers why the temperature is 0.4.

## A two-week starter plan

For a team with one AI feature in production and no evals, the on-ramp that works:

- **Days 1–2:** pick the most valuable output dimension (usually factuality or instruction-following), export 40 recent inputs from logs, write one-paragraph expectations, three deterministic checks.
- **Days 3–5:** stand up the LLM judge rubric with three graded examples inside it; agree composite scoring; run a baseline.
- **Week 2:** wire the fast gate into CI on prompt/config changes; set thresholds; commit the set and rubric to the repo; write the maintainer rotation into the team calendar.

Everything after that is accretion — which is the whole philosophy. Eval programs don't get designed; they get *lived into*, one archived regression at a time. The [responsible-AI review](/journal/ai/responsible-ai-review) gives it governance context; this guide gives it plumbing; and our [AI practice](/services/ai) is what to call if you want the plumbing installed by people who've stepped in it before.

## Key takeaways

- Golden sets: 30–150 real, frozen, failure-weighted examples with written expectations, versioned like code.
- Grader hierarchy: deterministic checks first, reference comparison where truthful, rubric-driven LLM judges for prose — atomised, demonstrated, human-calibrated quarterly.
- Gate PRs on a fast subset; run the full set nightly; diff model upgrades in both directions; thresholds live per feature with justification.
- Every production regression becomes a permanent golden-set member; that's how bugs die once.
- Maintain the set monthly against production drift, hold out examples from prompt authors, and never let judges judge their own judging.

## FAQ

**How do evals handle non-determinism?**
By measuring it rather than wishing it away: run examples multiple times in the nightly suite, score each run, and track both mean and flip-rate. Gate on the mean for PRs, and treat high flip-rate as its own defect — instability is a quality dimension users experience directly.

**What's a realistic pass-rate target?**
Wrong question — targets are per-feature and per-criterion. A support summariser might gate at 95% citation-presence and 90% factual-completeness; a creative ideation tool might gate at 70% rubric compliance. What matters is that the number is written down, was chosen deliberately, and gates changes in both directions.

**Can we use the production model as its own judge?**
Sometimes, with care: it's fine for formatting and mechanical criteria, suspect for quality judgments anywhere a candidate model swap is being evaluated — self-preference quietly favours home turf. At minimum, alternate judge families and calibrate against humans so you know the size of the bias you're carrying.

**When should the golden set grow vs stay fixed?**
Grow it when production teaches you something — every incident, every new market, every new failure class. Freeze slices of it when you need comparability across time (a stable "canary" subset used for longitudinal trend lines). Both; labelled as such.

**Do open-source eval frameworks replace building this?**
Frameworks handle orchestration — dataset loading, judge calls, reporting — and save real time. They don't supply your golden set, your rubric or your thresholds, which are 90% of the value. Adopt the plumbing; own the content.
