---
title: "Latency budgets for LLM features"
description: "An LLM feature that answers correctly in eleven seconds is broken. How we set per-surface latency budgets, route models for speed, and kill what can't make the time."
slug: llm-latency-budgets
cluster: ai
tags: [llm latency, performance budgets, streaming ux, model routing, ai performance]
date: 2026-05-14
author: Dev Khatri
keywords: [LLM latency budget, AI performance UX, perceived speed AI, model routing, streaming UX, time to first token]
readingTime: 11
---

Every team building an LLM feature eventually has the same meeting. The demo goes beautifully. Someone asks how long responses take. The room does some quick mental arithmetic — prompt tokens, model choice, retrieval, the round trip to a data centre in another hemisphere — and lands somewhere between four and fourteen seconds. Then someone says the fatal words: "Users will wait, because the answer is so good."

They will not wait. We have the session replays to prove it. On one [support-assistant build for a community bank](/work/copperline-community-bank), abandonment climbed steeply past six seconds and the feature was functionally dead past ten — regardless of how good the answer was when it arrived. The users who waited longest were, heartbreakingly, the ones with the hardest problems, who needed the feature most.

The fix is not a faster model. The fix is a budget. This is how we set one, enforce it, and architect around it — the same discipline web performance teams have applied for a decade, pointed at a new and much slower primitive. It sits alongside our [streaming UX patterns](/journal/ai/streaming-ux-patterns) piece: that article is about making waiting feel shorter; this one is about making less of it happen.

## Seconds are a feature attribute, not an ops concern

A latency budget is a product decision, set before architecture, written in the design doc next to the colour palette. The numbers we start from, per surface:

- **Inline autocomplete and suggestions: 0.8–1.5 seconds.** Above that, the user has finished typing the word themselves and the feature is an interruption.
- **Command palette and quick actions: 2–3 seconds.** The user is mid-flow on a keyboard. Their hands haven't moved. You have their attention and nothing else.
- **Chat and assistant surfaces: first token under 2.5 seconds, complete answer under 8.** Streaming buys you the gap between those numbers, which is why we treat first-token and total-time as separate budgets with separate owners.
- **Document generation and long-form drafting: up to 20 seconds, only with visible structured progress.** The user clicked a button labelled "generate" — they've consented to a wait, and the interface must hold up its end with section-by-section rendering.
- **Bulk and background work: no interactive budget, but a completion promise.** "Your 40 product descriptions will be ready by 3:15" is a latency design.

Two rules make these numbers real. First, they are **p75 budgets, measured at production, on the median device, on the real network** — not the median latency from the office fibre. An LLM call has long, fat tails; the p95 can be triple the p50, and it's the p95 user who writes the support ticket. Second, the budget belongs to a named person. Budgets owned by "the team" are owned by no one, and the first launch crunch erases them.

## Where the time actually goes

Before optimising anything, instrument the waterfall. For a typical retrieval-augmented chat answer, the timeline looks roughly like this:

| Stage | Typical share | What hides here |
| --- | --- | --- |
| Auth, session, rate-limit checks | 5–10% | A slow database query nobody profiled |
| Query understanding and rewrite | 5–15% | An extra model call that could be a heuristic |
| Retrieval | 10–20% | Over-wide vector search, cold indexes |
| Time to first token | 25–40% | Model choice, queueing, provider region |
| Token generation | 20–45% | Longer answers than anyone asked for |

Three findings recur across every audit we run. The model call is rarely the whole story — a third of the wall-clock time is often the plumbing around it. Generation length is the most-easily-controlled variable and the most neglected (a prompt that invites 400-word answers costs four times a 100-word budget in pure decode time). And retrieval configured by someone who never saw the latency budget quietly performs top-50 searches when top-8 would do.

## Routing: the model is a per-request decision

The single most powerful lever is not using the big model. We route every request through a cheap classifier — sometimes a ruleset, sometimes a small model, often an embarrassing hybrid of regexes and one fine-tuned mini — that answers one question: **what does this request actually need?**

For the bank assistant, roughly 60% of conversations ("what's my daily transfer limit", "how do I add a payee") answered perfectly from retrieval plus a fast small model, fully inside a 3-second budget. Another 30% needed the mid-tier model for multi-step reasoning about the customer's actual account state. Fewer than 10% — policy edge cases, complaint handling, anything headed for a human anyway — justified the flagship model and its 6–9 second cost. Before routing, everything hit the flagship. After: median latency down 58%, monthly inference spend down 71%, and quality *up*, because the small model's answers were shorter and the flagship's attention was spent where it mattered.

Speed-versus-quality framing undersells what's happening. The correct framing is **quality matched to the task, with speed as a quality dimension**. A slightly less elegant answer in 2 seconds usually beats a beautiful one in 9, because the 9-second answer was never read by a third of its intended audience.

The patterns that earn their complexity:

- **Fast path with confidence gate.** Small model answers; if its confidence or an eval-style check fails, escalate to the larger model. Users on the fast path never know the gate exists.
- **Speculative drafting.** The small model drafts immediately; the large model verifies and corrects asynchronously, streaming corrections inline. Use sparingly — visible self-correction erodes trust if the drafts are often wrong.
- **Tiered retrieval.** A 5ms cache lookup, then a 50ms narrow search, then a 300ms wide one, stopping at the first tier that clears a relevance threshold.
- **Pre-computed answers for the head of the distribution.** Your top fifty questions by volume don't need a live model at all. They need a good cache with TTLs and editorial review.

## Perceived speed is the second half of the budget

Once the architecture has done its honest work, the interface takes over. The full vocabulary is in our [streaming piece](/journal/ai/streaming-ux-patterns), but the budget-relevant principles:

**Optimistic structure before content.** The moment the user submits, render the answer's skeleton — the section headers you know are coming, the table it's filling, the citations area at rest. The interface says "I heard you and I have a plan" while the model is still thinking. This is worth roughly a second of perceived time, and it costs nothing but design work.

**Stream the useful part first.** Order the prompt's output so the answer arrives before the caveats. If the response format puts a 60-word disclaimer before the 40-word answer, the user experiences the worst of both.

**Show honest progress, never a spinner.** A spinner says "something is happening, duration unknown" — the worst possible message. A staged progress indicator ("checking your account… drafting answer") converts dead time into legible process, but only if the stages are real. Fake stages get caught, and caught fake progress is worse than a spinner.

**Never block unrelated interaction.** While the model generates, the rest of the product stays live. Users who can keep working while an answer cooks report dramatically higher satisfaction at identical latency numbers.

## Enforcing the budget like you mean it

A budget without enforcement is a wish. Ours is wired three ways:

**In CI.** Eval runs double as latency tests (see our [evals framework](/journal/ai/llm-evals-framework)): a representative prompt set against staging, asserting p75 within budget. A regression that adds 800ms fails the build the same way a correctness regression does.

**In production dashboards.** Per-surface p50/p75/p95 with the budget line drawn on the chart. When a provider has a bad afternoon — and they do — the chart shows which budget just broke and which feature's fallback engaged.

**In the kill-switch plan.** Every AI feature ships with a degradation ladder defined in advance: Big model → mid model → templated answer → "this feature is having a slow day, here's the classic version." The bottom rung is why we insist the [non-AI fallback](/journal/ai/llm-failure-fallback-ux) exists and stays good. Latency budgets and failure budgets are the same document read from different ends.

## When the honest answer is "don't ship it"

Some features cannot make their budget, and the discipline is saying so early. The tests we run in week one of any [AI engagement](/services/ai):

- Rough-token arithmetic: input size × model latency × expected output length, at p75, on the target network. If the napkin says 15 seconds against a 3-second budget, the napkin is usually right.
- The head-of-distribution check: if 80% of requests are cacheable, the feature survives; if every request is genuinely novel, the budget must cover live generation.
- The reroute check: can this surface be redesigned so the AI is asynchronous — drafted ahead, delivered on return? Many "real-time assistant" features are secretly "prepare my morning briefing" features, and those have wonderful budgets.

When a feature fails all three, we say so, in writing, before the prototype becomes a promise. A latency budget that survives contact with production is the difference between an AI feature users love and one they route around.

## Key takeaways

- Set per-surface p75 latency budgets before architecture; assign each one a named owner.
- Instrument the full waterfall — plumbing, retrieval and generation length frequently cost more than the model itself.
- Route every request: most tasks don't need the flagship model, and routing improves speed, cost and often quality simultaneously.
- Optimise perceived speed after real speed: optimistic structure, useful-content-first streaming, honest staged progress.
- Enforce budgets in CI and production dashboards, with a pre-agreed degradation ladder.
- If a feature can't make its budget on week-one napkin maths, redesign the surface or decline to ship.

## FAQ

**What if the model providers are just slow this quarter?** Then your budgets catch it, your degradation ladder activates, and the product degrades gracefully instead of silently. This is the scenario budgets exist for. Model latency is a supplier-risk problem, and you manage it like any other supplier risk: measurement, fallbacks, and leverage (multi-provider routing where it makes sense).

**Isn't routing just adding a point of failure?** It's adding a decision point, which you needed anyway. The classifier is simple, fast and heavily tested — a far easier thing to reason about than the flagship model's behaviour on queries it shouldn't be answering. The failure mode is a wrong tier, observable and fixable; the alternative's failure mode is a slow, expensive, occasionally over-thinking product.

**How do we measure perceived latency rather than wall-clock?** Instrument the moments users feel: time from submit to first visible response, time to answer-complete, and interactions-per-second during generation. Complement with behavioural signals — abandonment rate by elapsed time, repeat-question rate (users re-asking because they assumed it broke). The wall-clock number is for engineering; the behavioural numbers are for truth.

**Should every request stream?** No. Streaming is the right default for anything over ~2 seconds of generation, but short answers to quick questions are better delivered whole — a 1.2-second pause followed by the complete answer reads as instant, while streaming the same answer reads as laboured. Match the delivery mechanism to the budget tier.
