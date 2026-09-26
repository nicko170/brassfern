---
title: "Shipping LLM features: what production taught us"
description: "The lessons that only arrive after launch: latency budgets in the wild, streaming UX edge cases, cost surprises, fallback design, and setting expectations users actually hold."
slug: shipping-llm-features-lessons
cluster: ai
tags:
  - AI products
  - Production lessons
  - UX
date: 2026-01-27
author: Dev Khatri
keywords:
  - llm features
  - ai product development
  - streaming ux
  - ai ux
  - llm production lessons
readingTime: 11
---

We've published our pre-flight advice already — the [production checklist for LLM features](/journal/ai/shipping-llm-features) covers what to verify before you ship. This piece is the other bookend: what the features taught *us* after real users arrived, across support copilots, drafting tools and retrieval assistants we've built and still maintain. Checklists describe the world you plan for. Production is where you find out what you actually built.

Five lessons, roughly in the order they ambushed us.

## Lesson 1: Latency is a UX attribute, not an infrastructure metric

Pre-launch, we benchmarked median time-to-first-token and p95 completion and felt good. Production taught us the number that matters is **time-to-meaningful-content** — how long until the user can start *using* the answer, and it depends on answer shape:

- A summary renders value with the first paragraph streamed; two seconds to first token is fine.
- A structured extraction (JSON into a form) has no intermediate value; a four-second total wait feels broken where a four-second streamed essay feels alive.
- A chat reply that begins "Certainly! I'd be happy to help" has emitted tokens without emitting meaning, and users experience that as stalling — because it is.

We now design the "meaning budget" per feature: what's the first genuinely useful unit, how fast can we get it on screen, and can we reorder the answer to front-load it? Streaming is the mechanism, and the detail — optimistic skeleton states, keeping the stream visually calm, never letting partial markdown break layout — is covered in [streaming UX patterns](/journal/ai/streaming-ux-patterns). The new lesson from production: **measure user-visible latency against the shape of the answer, not against the API**. Our dashboards now track "time to first cited source," "time to first editable form field," per feature. Medians hid everything; per-shape percentiles found the pain.

## Lesson 2: Costs don't blow up at launch — they creep

Launch-day cost models are almost always right. Month three is where cost engineering actually begins, because three forces compound quietly:

1. **Prompt growth.** Every bug fix, every tone adjustment, every "can it also mention the return policy" adds tokens to the system prompt. One feature's prompt grew from 800 to 2,900 tokens in a quarter — a 3.6× input cost increase with zero new users.
2. **Retry and refinement loops.** Regenerate buttons, multi-step chains, and agentic retries mean a single user action triggers 2–4 generations. Early usage data undercounts this because only power users have found the workflows that spawn retries.
3. **Context inflation.** Retrieval pipelines get tuned toward recall ("grab more chunks, just in case"), and conversation history windows stretch. Tokens per request drift up 20–50% over a feature's first year if nobody owns the meter.

The fix is unglamorous: a token budget per feature, tracked per release like [cost engineering](/journal/ai/llm-cost-engineering) describes, and a named owner for prompt diffs. Prompts go through the same review as schema migrations, because economically they are one.

## Lesson 3: The fallback path is the feature

Every team plans for API failure. Production adds the failure modes you didn't model:

- **Degradation, not outage.** The model answers, 30% slower and 20% dumber (a provider-side incident, a new checkpoint behaving differently). Users don't see an error; they see a product that got worse today.
- **Silent emptiness.** A retrieval index that quietly went stale returns confident answers about last quarter's refund policy. The UI looks pristine. This is the worst failure class in applied AI: total success in the interface, total failure in the world.
- **Load shedding.** Your own rate limits trip during a launch spike, and the feature fails precisely on the day it's most visible.

So the fallback design has layers, not a single "try again" state: cached or deterministic responses for the most common requests; a visible "simplified mode" that swaps generation for templates under degradation; staleness indicators on anything retrieval-backed; and — the one that's earned its keep every time — a graceful kill switch per feature, operable by support staff without a deploy. The responsible-AI review process we publish in the open covers the governance side; production adds the operational one.

## Lesson 4: Users calibrate trust in the first three sessions — fix it there

The trust dynamics we wrote about in [designing AI features users can trust](/journal/ai/ai-trust-design) show up in production with a sharper edge: users form their model of the feature *fast*. If the first three interactions are accurate and appropriately hedged, users develop calibrated trust — they check outputs lightly and rely on them sanely. If session one contains a confident hallucination, users either abandon the feature or — worse — develop blanket distrust and re-do everything manually, at which point the feature is shelf-ware you pay inference for.

Production consequences:

- **Onboarding is expectation-setting, not feature touring.** Show the three best use cases and one honest limitation ("I can draft the reply; you check the figures"). The features with explicit stated limits in onboarding show better long-term retention in our [AI feature analytics](/journal/ai/ai-feature-analytics) than the ones with glossy everything-tours.
- **First-run quality gates.** New-user generations get the most careful prompting, the largest retrieval budget, sometimes the more expensive model. It costs more to acquire trust than to keep it.
- **Make confidence visible and correctable.** Citations, "based on your May data" timestamps, and one-tap "this is wrong" feedback that visibly does something. Correction affordances convert distrust into engagement — users who correct the system invest in it.

## Lesson 5: The model will change under you — own the layer between

Providers ship new checkpoints, deprecate models, adjust safety thresholds. Each change is a silent product update to *your* product. The features that survive provider volatility share a shape: an internal abstraction layer that owns prompts, output parsing and evaluation, with the model swappable behind it — and an eval suite that runs against new checkpoints *before* the provider's deprecation date, not after users notice. (The full mechanics of building that suite are in our [evals practical guide](/journal/ai/evals-practical-guide); short version: golden sets, regression gates, run on every model change as well as every prompt change.)

The twist production adds: provider changes produce *improvements* as often as regressions, and improvement also breaks products. A model that suddenly refuses less often, formats differently, or gets chattier will break parsers trained on the old behaviour. Diff every model upgrade against your evals in both directions: where did it get better, and does "better" break anything downstream?

None of this is a reason to shy away from generative features — the honest margin in them is real, and users now expect the capability. But the features that hold up treat the model as an unreliable partner inside a reliable product: meaning-budgeted latency, metered prompts, layered fallbacks, calibrated trust, owned abstraction. That's the shape we build into every engagement through our [AI practice](/services/ai) — less magic, more plumbing, and products that are still good on a bad model day.

## Key takeaways

- Measure time-to-meaningful-content per answer shape; medians and API metrics hide the pain users feel.
- Cost creeps through prompt growth, retry loops and context inflation — budget tokens per feature per release with a named owner.
- Fallbacks must cover degradation and silent staleness, not just outages; support staff need a no-deploy kill switch.
- Trust calibrates in the first three sessions — front-load quality in onboarding and state limits explicitly.
- Own the abstraction layer and eval suite so provider model changes are tested events, not surprise product updates.

## FAQ

**Should we build with one provider or design for several from day one?**
Design the abstraction layer for two from day one but only integrate one. The multi-provider option is cheap if the seam (prompts, parsing, evals) is owned by you; it's ruinously expensive to retrofit. Then revisit the second integration when you're big enough to have leverage or when volatility bites.

**How much latency budget should a generative feature get?**
Match the baseline of what it replaces. If the feature replaces a ten-minute manual task, four seconds is a miracle and you have headroom for quality. If it augments a flow users do twenty times a day, every extra second compounds — budget like an engineer, and spend it on time-to-meaning rather than total completion.

**When is streaming the wrong choice?**
For structured outputs consumed programmatically (form fills, classifications), where partial tokens have no value and add parser complexity; for very short answers under a second where the stream adds render jitter; and where downstream validation must pass before anything is shown. Stream prose; buffer structure.

**How do we know when a prompt has become too big?**
Set the tripwire at budgeting time — for example, input tokens exceeding 15% growth quarter-over-quarter triggers a prompt review. Symptoms arrive earlier: answers losing focus, earlier instructions being ignored, cost graphs sloping up without a usage graph to match. Prune ruthlessly; prompts accrete, they never self-clean.

**Do users forgive AI errors?**
They forgive honest, correctable ones — especially when the interface expected the error and made fixing it easy. They don't forgive confident wrongness presented as fact, or errors discovered downstream (the wrong ask sent to a customer, the wrong figure in a report). Design determines which kind you ship.
