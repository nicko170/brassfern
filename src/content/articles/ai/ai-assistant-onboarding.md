---
title: "Onboarding users to an AI assistant"
description: "First-run design for copilots: capability discovery without homework, starter prompts that teach, mental-model calibration, and measuring adoption honestly."
slug: ai-assistant-onboarding
cluster: ai
tags: [ai, onboarding, product design, copilot ux, adoption]
date: 2026-06-04
author: Aiko Tanaka
keywords: [ai onboarding ux, copilot onboarding, ai feature adoption, assistant first run]
readingTime: 9
---

Every AI feature ships with the same onboarding fantasy: a user arrives, reads the splash screen, intuitively grasps what the model can and can't do, writes a confident first prompt, gets a great answer, and becomes a daily user. Every AI feature also ships with the same reality: the user stares at an empty chat box, types "hi", gets a cheerful paragraph they didn't need, and never comes back.

The gap isn't the model. It's that traditional onboarding patterns — carousels, coach marks, checklists — were built for deterministic software, where the feature set is finite and the first run teaches you where the buttons are. An assistant's feature set is effectively infinite and its failure modes are invisible. Onboarding has to teach a *mental model*, not a map. Here's how we do it in our [AI engagements](/services/ai), and what we've learned measuring it.

## What users actually need to learn

Strip away the feature tour and a new assistant user needs exactly four beliefs:

1. **What it's for.** Not "AI-powered assistance" — a concrete job. "It drafts reply suggestions from your support history" beats "your intelligent helper" every time.
2. **What it knows.** Which data it can see, and which it can't. Users will blame the model for not knowing things it was never given.
3. **How to talk to it.** That specificity helps, that iteration is normal, that a bad first answer isn't a verdict.
4. **When not to trust it.** The failure shape: confident, fluent, wrong. Where checking matters.

Notice none of these are "where the buttons are". Our [onboarding checklist research](/journal/product/onboarding-checklist-patterns) applies here with one amendment: the checklist for an AI feature should demonstrate *behaviours*, not navigate screens.

## Starter prompts are the curriculum

The single highest-leverage onboarding surface is the set of suggested prompts on the empty state. Treat them as a syllabus, not decoration.

**Sequence them by teaching value.** The first suggestion should be the assistant's most reliable, most impressive capability — the one least likely to embarrass itself. The second should demonstrate iteration ("now make it shorter"). The third should demonstrate a boundary ("what can't you see?") or a more ambitious task. Three to five suggestions is the ceiling; more reads as homework.

**Make them specific enough to succeed.** "Summarise this thread" works because the content is present. "Write me a marketing plan" fails because the model has nothing to work with and produces confident mush that teaches the user the assistant is a novelty. This is the same principle behind our [empty states work](/journal/product/empty-states-design): the empty state is product marketing, and for AI features it's also the user manual.

**Localise them to the user's actual data** wherever possible. A suggested prompt that references the user's real project ("Summarise the Meridian board pack") converts at multiples of a generic one. Yes, it's harder to build. It's also the difference between onboarding and decoration.

**Retire them as the user grows.** A daily user seeing first-week suggestions is a signal your onboarding never graduated anyone. Swap in prompts that teach the *next* capability tier.

## Calibrating trust: the confidence ladder

The dangerous user isn't the skeptic — it's the person who trusts the model completely on day one because the first answer was fluent. Onboarding should deliberately expose a controlled failure.

We call this the calibration moment. Early in the first session, surface a task where the assistant's answer is good but imperfect, and annotate it: a subtle "verify the figures before sending" on a data-heavy draft, an inline citation UI that shows exactly which documents an answer drew from, a "how confident should you be?" affordance on tasks with known error rates. The goal is a user who expects fluency *and* checks claims — which is, not coincidentally, the only safe user.

Concretely, this means first-run flows should include:

- **Source surfacing** — show the retrieval trail on at least the first few answers, even if you hide it later.
- **Honest scope statements** — "I can read your docs and tickets, not your email" in plain language, near the input, not buried in a modal.
- **Failure recovery as a taught behaviour** — one-tap "regenerate", "try differently", and an escape hatch to a human or a form. Users who recover from a failure successfully retain better than users who never fail, because they've learned the failure is survivable.

## Capability discovery without homework

Nobody reads documentation for a chat box. Capability discovery has to happen *in situ*, at the moment of need:

- **Contextual nudges, not tours.** When the user opens a document, a subtle "ask me to summarise this" inline. When they hit a form, "I can draft this from last quarter's". Triggered once, dismissable forever.
- **Result-adjacent expansion.** After a successful answer, one line: "You can also ask me to turn this into slides." The user just experienced value, so the pitch lands as generosity instead of an ad.
- **Progressive disclosure of power features.** Multi-step tasks, file uploads, voice — each revealed as the user's usage suggests readiness. Our [progressive disclosure patterns](/journal/product/progressive-disclosure-complexity) map directly: complexity arrives when competence does.

The anti-pattern is the "capabilities modal" — a wall of twelve features in organised sections. Users close it in under two seconds and retain nothing. We've measured this. It's not close.

## Measuring whether onboarding worked

AI onboarding has a unique measurement trap: activation metrics built for normal software will lie to you. "Sent a first prompt" is not activation — typing "hi" counts. Define activation as a **completed valuable task**: an answer the user accepted (copied, inserted, exported), on a real piece of their own content, within the first week.

Metrics we instrument on every assistant launch, building on the framework in [activation metrics that mean something](/journal/product/activation-metrics-honest):

- **Time-to-first-accepted-output** (not first prompt): median minutes from signup.
- **Starter-prompt adoption rate**: percentage of new users whose first accepted output came from a suggestion. Below ~20% usually means the suggestions are generic.
- **Second-session survival**: came back within 7 days and completed another task. This is the metric the onboarding actually moves.
- **Failure recovery rate**: of first-week users who hit a bad answer, how many iterated or recovered versus silently left. Low recovery = the first failure killed trust.
- **Suggestion retirement**: are established users still being shown beginner prompts? (A hygiene metric most teams never check.)

The [Pylon Health](/work/pylon-health-telehealth-flow) telehealth work taught us the healthiest version of this: their intake assistant's onboarding shows three prompts tied to the patient's actual appointment, demonstrates a calibrated "I might get this wrong — confirm with your provider" moment on day one, and second-session retention sits well above their old deterministic flow. (Metrics illustrative, as ever — but the shape is real.)

## A launch checklist

1. Activation defined as an *accepted output*, agreed by product and growth.
2. Three to five starter prompts sequenced as curriculum, localised to real data where possible.
3. One deliberate calibration moment in the first session.
4. Scope statement in plain language within view of the input.
5. One-tap recovery paths on every bad answer.
6. Contextual nudges for capability discovery — no capability tours.
7. Suggestions that graduate as users do.
8. Second-session survival on the launch dashboard, not just week-one excitement.

## Key takeaways

- AI onboarding teaches a mental model — purpose, knowledge scope, communication style, failure shape — not a map of buttons.
- Starter prompts are the curriculum: sequenced, specific, localised, retired as users grow.
- Deliberately expose one controlled failure early; calibrated users retain better than dazzled ones.
- Discoverability belongs at the moment of need, not in a capabilities modal.
- Measure activation as completed valuable work, and watch second-session survival as the real verdict.

## FAQ

### Should onboarding explain that the product "uses AI"?

Explain what it does and what it knows; the AI label earns you skepticism without informing anyone. If regulation or policy requires an AI disclosure, keep it plain and pair it with the scope statement — both are trust surfaces.

### How long should first-run onboarding take?

One screen of orientation, maximum, then a real task with starter prompts. Anything beyond sixty seconds before the user touches their own data is homework, and homework gets skipped.

### Do we need a "skip" option?

Always, and without penalty. Power users will skip and self-educate; forcing them through a flow just delays their discovery. The skip rate is also useful telemetry — a high skip rate on a specific step usually means the step is boring, not that users are impatient.

### When do we revisit onboarding?

At every major model or capability change, and quarterly regardless. The most common failure we see is onboarding written for the v1 model that now undersells v3 — the prompts teach caution the product no longer needs.
