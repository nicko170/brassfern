---
title: "Evals-first development: the build order that actually works"
description: "Write the golden set before the prompt, version prompts like code, and gate merges on eval scores. The workflow that makes LLM features shippable."
slug: evals-first-development
cluster: ai
tags:
  - Evals
  - Workflow
  - AI engineering
date: 2026-06-12
author: Dev Khatri
keywords:
  - eval-driven development
  - llm evals workflow
  - ai product workflow
  - prompt versioning
  - eval first development
readingTime: 11
heroImage: /images/articles/ai/evals-first-development.jpg
heroAlt: "Still life on cream paper: a fanned stack of index cards with green tick marks passing through a tiny brass turnstile, beside a coiled measuring tape."
---

Most teams build AI features in the same order: write a prompt, wire the UI, try it on a few examples, debate in the PR, ship. Then a customer finds the failure your PM's ten test prompts didn't, and you spend a week discovering there was never a definition of "working" to regress against.

There's a better build order, and it inverts the instinct: **write the evals before the prompt.** Not a full benchmark lab — a 30-case golden set, versioned in the repo, that becomes both the spec and the safety net. We argued the principle in [evals before features](/journal/ai/llm-evals-framework) and documented the machinery in [the practical evals guide](/journal/ai/evals-practical-guide). This piece is the workflow: what happens, in what order, in a real sprint where a chat trait becomes a shippable feature.

## The build order, step by step

**1. Write 30 cases before touching the model.** While the feature is still a Figma frame and an API sketch, someone — usually the engineer pairing with the designer — writes thirty realistic inputs. Not thirty happy paths. Roughly ten typical, ten awkward (ambiguous, malformed, multi-part), ten adversarial or boundary cases (out-of-scope asks, locale variants, the request that must be refused). Each case carries an expectation: a rubric in plain English, occasionally a reference answer.

This is the cheapest spec you've ever written. It forces the hard conversations on day one instead of launch week. "Should the assistant quote prices if the catalogue is stale?" "Can it talk to minors?" You're debating product behaviour on concrete examples, not vibes on a slide.

**2. Write the prompt to pass the set.** Now open the model. The prompt is written against the cases, and every draft is scored against them. The golden set stops prompt-writing from being an audition where the model charms you with one lovely answer; it makes it a test you can fail, which is what engineering feels like.

**3. Version the prompt like code, because it is.** Prompts live in the repo as source files — not in a CMS, not in someone's notes app. Every prompt change is a PR. Every PR runs the eval suite. The commit message says *what behaviour changed and why*, and the score delta is in the description: "softens refund language, +4 cases, vs draft." Six months later, when legal asks why the assistant stopped promising same-day refunds, `git log` answers. We detail the organisational side of this in [prompt libraries as design systems](/journal/ai/prompt-design-systems).

**4. Gate merges on a score floor.** The CI pipeline runs the golden set on every prompt-diffing PR. Below the floor — we typically start at 90% pass on rubric graders, relaxed for stochastic cases with "pass 2 of 3" semantics — the merge is blocked. Above the floor, one human reads the grader disagreements. Not to re-run the evals by hand, but to spot where the *rubric* is wrong, which happens constantly in the early weeks.

## The eval-vs-vibes review

Prompt PRs attract the worst reviews in software: "I tried it and it felt wordy." Eval-first gives the review a spine. The review conversation has three allowed moves:

- **Score moves.** Did the golden-set pass rate change? That's the first line of the review, objectively.
- **Set grows.** If the reviewer found a failure, the fix is not a tweaked adjective — it's a new case in the set, permanently. The reviewer contributes a test, like in ordinary TDD.
- **Rubric evolves.** If the score moved for the *right* reason ("it got more concise where it should"), edit the rubric, not the prompt, and let the diff show that.

Everything else — tone twitches, stylistic preference — belongs in the rubric or out of the review. This is where eval-first quietly fixes team dynamics: it converts taste arguments into artifact arguments. When we built the symptom-intake assistant in the [Beacon Health triage case study](/work/beacon-health-ai-triage), the clinical reviewers never touched code, but they added 60 cases to the golden set in the first two weeks — every one a refusal boundary they'd seen in practice. That set, not the prompt, was the real specification of the product.

## How eval-first changes what designers ship

This is the part engineers underestimate. Behavioural spec changes design scope:

- **Design prompts the rubric, not the pixel.** If the eval says answers must stay under 120 words, the UI needs a compact layout and a "tell me more" expansion affordance. The designer isn't styling an unknown output; they're styling a *ranged* output, which is a solvable problem.
- **Failure states get designed, not discovered.** The adversarial ten cases enumerate what the assistant must refuse. Refusal is a designed screen with language and a way forward — we cover the full pattern in [fallback UX for LLM features](/journal/ai/llm-failure-fallback-ux). Pre-eval-first, refusal is whatever the model happens to say on the day.
- **Onboarding can promise what the evals guarantee.** Marketing copy is constrained by demonstrated scores, not demo luck. The AI assistant onboarding flows we describe in [onboarding users to an AI assistant](/journal/ai/ai-assistant-onboarding) only work when "it does X, not Y" is verified ground truth rather than hope.

## Where eval-first hurts (honestly)

Three real costs, so you go in eyes-open:

**The first week is slow.** Writing 30 good cases takes a day or two of the team's best thinking. Teams that skip it save those two days and then lose two weeks relaunching after the first public failure.

**Rubric graders lie a little.** Model-graded rubrics agree with careful human judgment roughly 80–90% of the time on well-written rubrics — less on subjective qualities like "warmth." Mitigate by keeping rubrics concrete ("mentions delivery window", "no absolute promises") and by running a monthly sample audit where a human re-grades fifty outputs. If the grader has drifted from the humans, your floor is fiction and the CI gate needs recalibration.

**The set rots if nobody tends it.** Golden sets decay along two axes: product behaviour drifts (features change, cases stop being relevant), and the world's inputs drift (new user vocabulary, new attacks). The fix is the same one the practical guide prescribes: every production failure becomes a case within a week, and the set gets a quarterly prune like any other test suite.

## A realistic first fortnight

Days 1–2: thirty cases, rubric expectations, disagreement resolved in the doc. Days 3–5: first prompt draft, baseline score (expect 55–75%). Week 2: CI gate, prompt versioned, designer working against rubric-bounded outputs, eval-vs-vibes review culture established in the channel. By the end of week two the feature is usually *behind* a vibes-built counterpart on demo theatrics and *ahead* on everything that happens next.

That's the trade we make on every engagement under our [AI products practice](/services/ai): slow-looking starts, fast finishes, no surprise launches. It's the same discipline the whole studio applies to shipping in public — see [how we work](/approach).

## Key takeaways

- Write 30–40 golden cases before writing the prompt. Ten typical, ten awkward, ten adversarial. The set is the spec.
- Prompts live in the repo, versioned, every change a PR with an eval-score delta.
- Gate merges on a pass-rate floor; humans review grader disagreements and rubric wording, not vibes.
- Eval-first constrains output behaviour, which lets designers design real failure and refusal states instead of hoping.
- Keep rubrics concrete, sample-audit graders monthly, and convert every production failure into a permanent case.

## FAQ

**How many cases do we need before the gate means anything?**
Thirty is the floor where a single case is worth ~3 points of signal. Below that, noise dominates and the gate creates false confidence. Fifty is comfortable for a single-surface feature.

**What if the feature is inherently creative — rubrics don't fit?**
Grade properties, not art. "Under 100 words", "names at least three options", "no second person" are gradable; "inspiring" is not. Where the feature truly is taste-led, eval-first still works: the cases pin the boundaries (length, safety, format), and humans keep judging the middles.

**Doesn't this slow experimentation?**
Exploration is ungated; shipping is gated. Folks play in notebooks freely. The eval suite only applies when a prompt is proposed for production. In practice teams experiment *more*, because a green suite makes trying a bold rewrite safe.

**When should the golden set itself be versioned?**
In the same repo as the prompts, in the same PRs. A rubric change and a prompt change in one commit is how you keep intent and behaviour synchronised. If the set changes and the prompt doesn't, the score floor will tell you whether that was editorial or behavioural.
