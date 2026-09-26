---
title: "When the model is wrong: designing failure states for AI features"
description: "AI failure is a design state, not an exception. Wrong-answer UX, graceful degradation tiers, feedback that improves the system, and copy that keeps trust intact."
slug: ai-wrong-answer-ux
cluster: ai
tags: [ai ux, error states, trust, content design, responsible ai]
date: 2026-06-04
author: Aiko Tanaka
keywords: [AI error states, model failure UX, AI trust design, graceful degradation]
readingTime: 10
---

Every mature product discipline has a body of knowledge about failure states: the 404, the empty inbox, the form error. AI features have a worse problem. Their most common failure is not an error at all — it's a fluent, confident, wrong answer that looks exactly like a right one. You can't try/catch a hallucination. You can only design for it.

This article is the other half of [our trust design piece](/journal/ai/ai-trust-design). That one covers how to earn trust. This one is about what happens in the moment trust is spent — and how to make spending it survivable.

## Catalogue the failure modes first

You can't design failure states for "the AI messing up" in the abstract. Failure modes are concrete, and each one needs its own state:

- **Wrong but confident** — a plausible fabricated answer. The hardest mode; the design answer is provenance and correction, covered below.
- **Wrong about the user** — misread their data, their file, their intent. Feels personal, and damages trust faster than factual errors because the user can immediately see the mistake.
- **Refusal / can't** — the model declines or the retrieval finds nothing. A null result, not an error. Handle it like a good empty state.
- **Malformed output** — JSON that doesn't parse, a summary that truncates mid-sentence. A real error. Treat it like one: retry, fallback, honest message.
- **Slow / unavailable** — provider degraded. Latency is its own failure mode at scale, and its own design problem (see [streaming UX patterns](/journal/ai/streaming-ux-patterns)).

Run a failure-mode workshop before design starts. Take the riskiest user flows, list every way the model plausibly fails in each, and score blast radius: who sees it, with what consequence. Design effort goes where the blast radius is largest. A wrong dinner recommendation is annoying; a wrong dose-math summary is a crisis. They are different products' problems and deserve different states.

## The tiers of graceful degradation

The strong version of an AI failure state is not an apology — it's a **degradation tier**: a lower-capability but deterministic mode the feature falls into when the probabilistic layer can't deliver. Design three tiers per feature:

**Tier 1 — Full AI.** The intended experience.

**Tier 2 — Scoped down.** When confidence is low or retrieval is thin, answer less: "Here's what I found in the policy docs — the rest I'm not sure about." Show the sources and stop. Partial answers with receipts outperform confident full answers in trust terms every time we've compared them.

**Tier 3 — Deterministic fallback.** No model involvement. For an assistant, that's the docs search and the human handover. For a summariser, it's the raw thread. For an autocomplete, it's no suggestion. The principle: **the feature degrades into the thing users did before it existed**, so a bad AI day is a normal day, not a broken one.

The tier to ship is chosen per-request by the pipeline, but what the user sees is a designed spectrum, not a cliff. The jump from Tier 1 to Tier 3 — magic to dead interface — is where trust dies. Tier 2 is the shock absorber.

## Copy patterns for the moment of wrong

When the system knows (or suspects) it's wrong, the copy has one job: hand control back without theatre. Four patterns we reuse:

- **The qualification:** "I'm not confident here — the policy changed recently and my sources may be stale." Names the limit, keeps the partial answer.
- **The offer:** "I might be misreading this. Want me to pull up the original record?" Agency to the user, verification one tap away.
- **The honest short-circuit:** "This one's beyond me — here's a human." No apology paragraph. Speed *is* the apology.
- **The correction confirmation:** "Got it — updated, and I've flagged the original for review." Visible action, not a vanished thumbs-down.

What to ban: blame-shifting to "the AI", grovelling, and — above all — repetition of the wrong answer in the apology. Echoing the error doubles the exposure. Also banned: humour. A joke in an error state is charming for a failed image upload. It is radioactive when the system just told a user something false about their own money or health.

## Feedback that visibly improves the system

"Was this helpful?" with a thumbs-down into a void is feedback theatre, and users learn it's theatre within two interactions. A correction affordance earns its place by producing a visible consequence: the answer updates, the record is marked, the suggestion adapts, or — for genuinely hard problems — the user gets told what happened with their report.

On the [Northwind Ledger work](/work/northwind-ledger-dashboard-rebuild), the anomaly-explanation feature let accountants mark any explanation as wrong with one tap and an optional category (wrong merchant, wrong period, nonsense). Marked explanations were collapsed by default for other users in the same workspace within minutes — feedback had a consequence they could witness. Response rates on the thumbs ran roughly four times higher than the "help us improve" patterns we'd shipped on other products, and the flagged corpus became the [eval set](/journal/ai/llm-evals-framework) that drove the next quarter's prompt work. Feedback loops that loop visibly close themselves.

The design detail that matters most: **sort the correction affordance to the error's severity**. A quick "that's wrong" for harmony cases; a structured report (what's wrong + what it should have said) where the output feeds compliance or money flows. Don't make a furious user fill in a form, and don't let a bookkeeper flag a wrong reconciliation with an unlabelled thumbs-down.

## Trust maths, again

A wrong answer corrected well is often a *net trust gain*. In moderated sessions we've repeatedly seen users who hit a handled failure report higher confidence than users who never hit one — the failure is where they learned the system's boundaries and saw the correction work. The dark version of this fact is that teams who never design the failure state are effectively choosing, in advance, which users discover the boundaries alone. They discover them, they screenshot them, they post them. Design the state and you keep authorship of the moment.

## Key takeaways

- Catalogue concrete failure modes per flow and score their blast radius. Design effort follows blast radius.
- Build degradation tiers: scoped-down answers with receipts, then deterministic fallbacks into yesterday's workflow.
- Failure copy hands control back fast — qualify, offer verification, short-circuit to a human. No blaming the AI, no echoing the error, no jokes.
- Feedback affordances must visibly act on input; flagged content becoming better is the retention mechanism.
- A well-handled wrong answer can build more trust than a lucky streak of right ones. Design the moment; don't leave it to chance.

## FAQ

**How do we detect "wrong but confident" answers in real time?**

Partially, at best. Signals that help: retrieval coverage (thin sources = high risk), self-consistency (re-generate and compare), tool verification (check claims against the database that owns the truth), and calibrated confidence registers in the response copy. None are reliable enough to catch everything — which is why the correction affordance is the load-bearing pattern, not the detection.

**Should wrong answers be hidden from other users immediately?**

For shared-surface features, fast retraction of flagged content is worth the plumbing — minutes, not days. For private, single-user outputs, the correction just needs to work for that user. Don't build fleet-wide moderation for a feature where mistakes never leave a personal session.

**What do we do about failures in categories we can't allow at all — medical, legal, financial advice?**

Those aren't failure states, they're scope boundaries, and they belong in the design from day one: redirect patterns, human handover, and hard railings tested in the [responsible-AI review](/journal/ai/responsible-ai-review). "The model gave unlicensed advice" is not a UX bug you patch with better copy.

**How much failure-state design is enough before launch?**

Ship when every top-blast-radius failure mode has a designed tier-2 and tier-3 state and tested copy. You will not catch every failure mode in advance — nobody does — so also ship the correction affordance that turns the ones you missed into your next eval cases.
