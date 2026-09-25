---
title: "Evals before features: how we measure LLM quality"
description: "How we build evaluation harnesses for LLM features: golden datasets, rubric graders, human review lanes and regression tracking that stakeholders can read."
slug: llm-evals-framework
cluster: ai
tags: [llm evaluation, ai quality, golden datasets, llm ops, ai engineering]
date: 2025-10-07
author: Dev Khatri
keywords: [llm evaluation, ai evals, golden datasets, llm quality metrics, llm as judge]
readingTime: 9
---

Here's a sentence you will hear in every AI project: "I tried it on a few examples and it looked good." Here is what that sentence is worth: nothing, or slightly less than nothing, because it anchors the team on the examples that happened to work. The demo-to-production gap in LLM features is almost entirely a measurement gap. Traditional software fails loudly — exceptions, 500s, dead buttons. LLM features fail in complete silence, producing fluent, confident, structured wrongness that sails straight past every test suite you already have.

The fix is to treat quality as something you build, not something you notice. Before we write a line of feature code in our [AI practice](/services/ai), we build the harness that will judge it. Evals before features. This is that harness, layer by layer.

## Why "it looked good" fails

Three failure patterns repeat across every unmeasured LLM launch. **Cherry-picked inputs**: the five examples in the demo represent 0% of the input distribution and 100% of the team's confidence. **Silent regressions**: a prompt tweak that fixes a tone issue quietly breaks formatting on long inputs, and nobody knows until a customer does. **Stakeholder mismatch**: the founder's standard is "impressive in a pitch", the support team's is "never invents a refund policy", and without numbers both sides argue from vibes. Evals exist to convert all three into a shared, boring table of numbers.

## Layer one: the golden dataset

A golden set is a curated spreadsheet of inputs with expected outputs or a written grading rubric — the ground truth the harness runs against. Our working rules:

- **Size**: 100–300 examples for a first feature. Below 80, scores are noise; above 500, curation quality decays. A ruthless 150 beats a sloppy 600.
- **Source**: real inputs wherever possible. Anonymised production logs, historical support tickets, actual documents the client handles. Synthetic examples padded with a generator always skew easy, because the generator shares the model's blind spots.
- **Distribution**: roughly 40% happy path, 30% common edge cases (empty fields, giant pastes, mixed languages, ambiguous requests), 20% adversarial (prompt injection, requests to act beyond scope, policy landmines), 10% weird stuff a support lead contributed and everyone laughed about until it failed.
- **Labels with reasons**: each row carries the expected output *and* why — "must cite the invoice number; must not promise a date". The reason is what lets a grader, human or model, score consistently.

Refresh the set quarterly. Products drift, users drift, and last year's edge case becomes this year's Tuesday.

## Layer two: graders that match the task

Not every output needs the same kind of judgement, and picking the wrong grader is how eval programmes die of inaccuracy. We use four, in increasing order of effort:

**Programmatic checks** come first and are criminally underused. If the output must be valid JSON under 2,000 characters containing only SKUs that exist in the catalogue, that is a linter, not a judgement call. Half of production quality lives here.

**Reference comparison** — similarity against a gold answer — suits extractive tasks where wording can vary but substance can't.

**Rubric grading with an LLM judge** covers open-ended quality. The judge prompt is a checklist, not a vibe: five to eight criteria ("states the correct total", "does not promise delivery dates", "under 80 words"), each scored pass/fail with a quoted justification. A rubric of binary criteria is dramatically more reproducible than "rate 1–5 for quality", which produces a bell curve of nothing. Keep the judging model different from the generating model where budget allows, and treat judge drift as its own monitored thing.

**Pairwise comparison** is for when you can't say what good is, only that A is better than B. Useful for tone and style decisions early in a project.

## Layer three: the human lane

Automated graders are wrong sometimes, in systematic ways — they over-reward length, they miss factual errors that sound right, they grade confidence as correctness. So every eval harness we ship has a human review lane: a small, random sample (10–20 rows per release) plus every failure the automated judge marks with low confidence, routed to a human reviewer with the rubric in front of them.

The human lane does two jobs. It calibrates the judge — if humans and the rubric grader agree under ~85% of the time, fix the rubric before trusting either. And it catches the category of wrong that only a domain expert notices. On the [Pylon Health telehealth build](/work/pylon-health-telehealth-flow), the automated judge happily passed a triage phrasing that a clinician flagged in four seconds as implying a diagnosis. That error class is now a rubric line item, which is how the lane pays for itself.

## Layer four: regression tracking per release

An eval that runs once is a demo of diligence. The harness must run automatically on every change that could move quality: a prompt edit, a model version bump, a retrieval change, a new few-shot example. Same machinery as CI — the eval score is a build artifact, compared against the previous release, with diffs you can read: which criteria moved, which example categories regressed.

We keep a per-feature scorecard with exactly three numbers anyone can recite: rubric pass rate, safety subset pass rate (which must be 100%, always, no exceptions), and the human-lane agreement rate. Everything else lives one click deeper.

## Presenting quality to people who don't build models

The scorecard fails if it only makes sense to the person who built it. Our rule: report quality the way we report performance — one budget, one trend line, one exception list. The [field-guide approach to Core Web Vitals](/journal/engineering/core-web-vitals-field-guide) applies directly: stakeholders don't need forty metrics, they need to know whether the thing is inside the budget we agreed, which direction it's heading, and what happens if it leaves. "Summaries are at 92% pass, up from 88%, safety at 100%, and these three failure examples are why it's not 95" is a sentence a CEO can hold. It's also a sentence that keeps AI quality budgeted like real engineering — part of the same [sprint cadence and Friday demos](/approach) as everything else we ship, not a mystical sidequest.

## The failure modes of eval programmes themselves

A confessional paragraph, because these are the ways we have personally broken this:

- **Evaluating the demo model.** The golden set was built against one prompt and never re-baselined. Scores rose while the product got worse.
- **A rubric full of vibes.** "Is helpful and professional" graded by a model is astrology. Every criterion must name an observable.
- **Judge inbreeding.** Same model generating and judging, politely agreeing with itself.
- **The set that aged in the wine cellar.** Six-month-old golden sets evaluate last year's product. Put a refresh date on the calendar when you create it.

## Key takeaways

- Build 100–300 golden examples from real inputs, weighted toward edges and adversarial cases, each labelled with the *reason* an output is right.
- Grade in layers: programmatic checks first, then reference, then rubric-based LLM judging, then pairwise — matched to how objective the task actually is.
- Keep a human review lane sampling every release; use it to calibrate the judge and to catch domain errors automation structurally misses.
- Run evals on every prompt, model or retrieval change, and track three numbers: rubric pass, safety pass (100%), human agreement.
- Report quality like a performance budget: one number, one trend, three reasons.

## FAQ

**Can't we just use an off-the-shelf eval framework?** Use the tooling, not the dataset. Frameworks are good at running suites and storing results; the golden set and the rubric have to come from your product's real inputs and failure modes. That's the part that can't be bought.

**How do we build a golden set before we have users?** Seed it from adjacent evidence: support tickets, sales call notes, the documents the feature will touch, and a structured role-play session where your team tries to break a prototype for one afternoon. Label it clearly as seed data and plan to replace it with production logs within 90 days of launch.

**Isn't LLM-as-judge just circular?** It can be — which is why the judge scores binary rubric criteria with quoted evidence, uses a different model than the generator where possible, and gets audited by the human lane every single release. Circular judges get caught by the 85% agreement check.

**What's the minimum viable version?** Fifty labelled examples, one rubric of five binary criteria, a script that runs it on every prompt change, and a spreadsheet. That's a weekend of work and it will save you a quarter.
