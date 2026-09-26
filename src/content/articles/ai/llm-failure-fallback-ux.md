---
title: "When the model fails: fallback UX for LLM features"
description: "LLMs fail — slowly, confidently and at the worst times. How to design degradation tiers, honest error states and timeouts that keep users' trust intact."
slug: llm-failure-fallback-ux
cluster: ai
tags: [ai ux, error states, graceful degradation, product design, llm]
date: 2026-02-19
author: Aiko Tanaka
keywords: [llm fallback ux, ai error handling, graceful degradation ai, ai unavailable state, ai loading state design]
readingTime: 11
heroImage: /images/articles/ai/llm-failure-fallback-ux.jpg
heroAlt: "A brass service bell and desk tools arranged on descending stacks of index cards on warm cream paper — the fallback ladder made tangible."
---

Ask a room of product teams how their AI feature handles failure, and you'll hear a confident answer about the happy path. Retry logic, maybe. Someone mentions a toast notification. Then ask the follow-up: what does the user see when the model is down at 9am on a Monday, mid-task, with their boss watching? The room goes quiet.

Traditional software fails loudly and rarely — a 500 page, an outage, an incident. LLM features fail *softly and often*: slow, truncated, confidently wrong, weirdly formatted, or silently degraded after a provider's quiet Tuesday update. Yet in most product roadmaps the failure states get the same design budget as a 404 page. This article is the pattern library we use to fix that: degradation tiers, honesty without internals, timeouts that respect the user, and the "AI is unavailable" state as a first-class screen. It builds on our [production checklist for shipping LLM features](/journal/ai/shipping-llm-features) — this is the checklist's awkward chapter, written properly.

## The failure taxonomy: name them or they own you

Design starts with admitting the ways it breaks. We track five failure modes, each needing a different UX response:

1. **Hard failure** — the provider 500s, times out completely, or the request never returns. Rare, obvious, easiest to design.
2. **Slow failure** — the model responds, but in 40 seconds instead of 4. The most common mode, and the one most interfaces ignore: [streaming patterns](/journal/ai/streaming-ux-patterns) paper over latency, but only up to a point.
3. **Truncation and malformation** — the answer cuts off mid-sentence, or returns markdown soup where your UI expected structured JSON. Detectable, recoverable, catastrophic if ignored.
4. **Confident wrongness** — fluent, plausible, incorrect. Undetectable by code; only partially detectable by citations and evals. This one is a trust problem more than an error state.
5. **Context rot** — multi-turn conversations slowly drift off the rails as context grows. The user's seventeenth message gets a worse answer than their third, with no visible explanation.

Walk your feature and mark where each mode can bite before you design a single screen. Most teams discover they've been unconsciously designing for mode 1 only, while their users live in modes 2 and 5.

## Degradation tiers: fall back, don't fall over

The core insight: an AI feature is rarely the only way to accomplish the task — it's the *nicest* way. So design a ladder of fallbacks, from most to least magical, and make sure every rung is a real, working, tested product surface rather than an apology.

- **Tier 1: The AI feature itself.** Full capability, streaming, citations, the works.
- **Tier 2: Cached or pre-computed answers.** For high-frequency queries, serve yesterday's good answer with an honest timestamp. A support assistant whose model is down can still answer its top fifty questions beautifully. Users forgive "here's what we know as of this morning" instantly.
- **Tier 3: A rule-based or classic-UI path.** Search instead of semantic chat. Filters and facets instead of "describe what you want". A form instead of a free-text intake. This tier should feel *good*, not punitive — it's often faster than the AI path for expert users anyway. On the [Pylon Health telehealth flow](/work/pylon-health-telehealth-flow), the symptom-intake assistant degrades to a structured questionnaire, and in testing 12% of users chose the questionnaire on purpose.
- **Tier 4: Human handoff.** A queue, a callback promise, an email that goes to a person — with the conversation so far passed along so the user never re-explains. Passing the transcript is the difference between "we failed and we're sorry" and "we failed and we're competent".
- **Tier 5: The honest dead end.** Sometimes none of the above exists. Then say so, plainly, with a time expectation and an alternative contact. Never fake a capability you don't have; a button that promises and errors is worse than no button.

Build the ladder in advance and test every rung quarterly by actually turning the model off in staging. Teams that rehearse degradation ship calm software; teams that don't ship [agents users can't trust](/journal/ai/ai-trust-design).

## Honest errors without the internals

There's a failure style spectrum, and both ends are bad. One end: the stack trace in the toast — `OpenAIError: rate_limit_exceeded (429)` — which leaks internals and teaches users nothing. The other end: the anodyne "Something went wrong, please try again", which protects nobody and reads like the product is shrugging. The middle is *diagnostic honesty*: tell the user what happened in their terms, what it means for their task, and what to do next.

Some lines that have survived usability testing:

```text
Slow:      "Still working — this one's taking longer than usual.
           [Keep waiting] [Get a shorter answer]"
Truncated: "That answer got cut off. Want me to finish it?"
Down:      "Our assistant is unavailable right now. Your question
           is saved — [browse help topics] or [email a human,
           ~2h reply today]."
Wrong:     (never detected by code — so: citations, confidence
           cues, and a one-tap "this answer wasn't right" that
           routes to review)
```

Note what none of these say: the model's name, the vendor, the HTTP code. Users have a task, not an ops interest. And when the failure is the provider's fault, resist the urge to say so — "our assistant is unavailable" is the honest unit, because to the user, you *are* the assistant. Blame-passing in error copy is a small confession that you don't consider the AI part of your product.

## Timeout and latency design: the seconds where trust is decided

Mode 2 (slow failure) deserves its own doctrine because it's where most trust is lost. Rules we hold:

- **Commit to a time ceiling per surface** — say 12 seconds for interactive chat — and design what happens at the ceiling, before engineering picks a default. When the ceiling hits, offer a choice, not a dead stop: keep waiting, get a partial, or switch tier.
- **Show progress that means progress.** A spinner says "something is happening"; staged status ("reading your policy documents… drafting…") says what's happening — but only if it's real. Fake progress stages are detectable and corrosive; we've covered the honest version in [streaming UX patterns](/journal/ai/streaming-ux-patterns).
- **Never burn the user's input.** Whatever they typed survives every failure, restorable in one tap. The psychological weight of a lost query is enormous — users rate products harsher for losing 40 typed words than for the outage that lost them.
- **Interruptible by default.** A stop button that actually stops, mid-stream, and keeps the partial answer. Silence-after-stop that deletes everything reads as punishment for impatience.

One often-missed case: when the user abandons a slow request. Send nothing to the void — if they closed the tab, don't spend tokens finishing it, and don't pop a notification saying their answer is ready for a question they've moved on from.

## The unavailable state as a first-class screen

Every product has a designed empty state and — increasingly — a designed loading state. LLM-era products need a designed *degraded state*, and it deserves the same craft as onboarding. On a recent SaaS engagement the "AI offline" variant of the dashboard shipped with: the data tables fully functional (they never needed the model), a slim banner in the product's real voice, the assistant's panel flipped into tier-3 search mode without leaving the layout, and a status line updated by the on-call engineer. Support tickets about the outage that week: zero. The week the *previous* version failed with raw toasts: forty-one.

Design assets to make in advance, before the incident: the banner copy in your [brand voice](/journal/ai/ai-brand-voice-guardrails) (write "our assistant is having a lie-down; humans are on it" before you're panicking), the wireframe of each degraded tier, and the macro that support sends when users ask. Incident-day is the wrong day for tone meetings. Teams doing [agentic features](/journal/ai/agent-ux-control), where the model acts rather than answers, need this most: a half-failed agent that's midway through changing things is a UX and a governance problem at once.

## Key takeaways

- Name the five failure modes — hard, slow, truncation, confident wrongness, context rot — and mark where each one bites before designing.
- Build a degradation ladder (cached answers → rule-based path → human handoff → honest dead end) and test every rung quarterly by turning the model off.
- Write errors with diagnostic honesty: what happened in user terms, what it means for their task, what next. No stack traces, no shrugs, no vendor-blaming.
- Set time ceilings, offer choices at the ceiling, and never burn the user's input.
- Ship the "AI is unavailable" state as a designed screen, with copy, wireframes and support macros prepared before the incident.

## FAQ

**Isn't tiered fallback just over-engineering for a rare outage?**
Provider hard-outages are rare; soft degradation is weekly. And the tiers pay rent daily — cached answers cut cost, rule-based paths serve expert users faster, and the human handoff is what makes high-stakes journeys shippable at all. The ladder is the product, not the insurance.

**How do we design for "confidently wrong" if code can't detect it?**
You design *around* it: citations users can check, hedged phrasing for low-confidence retrieval, a one-tap "not right" that routes to review, and high-stakes intents that escalate by rule rather than by the model's mood. Detection is a model problem; containment is a design problem.

**Should the UI admit it's AI when it fails?**

Yes — and it should have admitted it all along. Interfaces that hide their AI nature get burned twice in a failure: once for failing, once for the reveal. Plain identification ("automated helper", "AI assistant") buys you calibrated expectations on the good days and forgiveness on the bad ones.

**We're pre-launch. What do we build first?**
Tier 3 (the non-AI path), the input-preservation rule, and one honest down-state screen. Those three cover most of the blast radius, and they make the AI feature itself safer to iterate on. If you want a second pair of eyes on the failure plan, that's exactly the kind of review our [AI practice](/services/ai) does — [here's where to find us](/contact).
