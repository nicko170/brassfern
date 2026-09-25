---
title: "Shipping LLM features: a production checklist"
description: "The pre-launch checklist we run before any LLM feature ships: evals, traces, cost ceilings, fallbacks, feedback loops and the metrics that catch quality drift."
slug: shipping-llm-features
cluster: ai
tags: [llm, production, observability, ai engineering, launch checklist]
date: 2026-04-14
author: Dev Khatri
keywords: [llm features production, ai product checklist, llm observability, shipping ai features, llm monitoring]
readingTime: 9
---

Every LLM feature dies twice. The first death is in the demo, where it works beautifully, on three hand-picked inputs, in front of a room that wants to believe. The second death is in week three of production, when a customer pastes their entire tenancy agreement into a field designed for a sentence, the model confidently summarises a different agreement, your support inbox fills up, and someone from legal sends the email that starts with "a quick question".

This checklist exists to prevent the second death. It's the same one we run before any LLM feature leaves our [AI products practice](/services/ai) — twelve items, in roughly the order we test them. None of them are exotic. All of them get skipped constantly.

## 1. The task is narrow enough to test

"AI assistant for the dashboard" is not a task. "Draft a release-note paragraph from a merged PR title and diff summary, max 80 words, in the customer's configured tone" is a task. The difference is not pedantry — a narrow task has a shape you can validate: known input bounds, an output contract, a failure mode you can name. If you cannot write the failure mode in one sentence ("it invents a metric that isn't in the data"), you cannot build a check for it, and you will learn it from a screenshot on Twitter.

We scope LLM work the same way we scope everything else in our [delivery approach](/approach): a slice small enough to demo on Friday and to evaluate honestly. Broad assistants arrive narrow anyway — users find the two things it's good at. Ship those two things deliberately.

## 2. An eval set exists and it includes the hostile cases

Before launch you need a golden set: real-ish inputs with expected outputs or a grading rubric, usually 100–300 examples for a first feature. Critically, it must include the cases you hope never happen — the empty input, the 40,000-word paste, the prompt that tries to make the model a lawyer, the input in Portuguese when you said English-only. We wrote up the full method in [evals before features](/journal/ai/llm-evals-framework); the short version is that a feature without an eval set is a vibe with an API key.

The launch gate is a number, agreed with the client before we start building: for example, "rubric-graded pass rate of 90% on the golden set, 100% on the safety subset." Below the gate, it doesn't ship. This conversation is uncomfortable in week one and priceless in week nine.

## 3. Traces are on, and someone can actually read them

Every production call gets logged: input (or a reference to it), model and version, prompt template version, retrieved context, output, latency, token counts, and the user action that followed — accepted credit, edited, regenerated, abandoned. Without traces, every quality conversation is anecdote versus anecdote. With traces, "the summaries got worse" becomes a query.

Keep the tooling boring. A table you can filter beats an observability platform nobody logs into. The point is that at 10am on a bad Tuesday, an engineer — not a data team, next sprint — can pull the last hundred failures and read them.

## 4. Cost has a ceiling per user, per task, and in aggregate

LLM costs are spiky in ways that web infrastructure costs usually aren't, because users control the input size. Set three budgets: a hard cap on tokens per request (enforced, not aspirational), a per-user-per-day ceiling that triggers graceful degradation, and a monthly aggregate with alerting at 50/80/95%. When the [Northwind Ledger](/work/northwind-ledger-dashboard-rebuild) dashboard added a "explain this variance" feature, the 95th-percentile user session cost was eight times the median — one person leaving a tab open on an auto-refreshing view. The fix was a stale-data guard, not a bigger budget.

## 5. There is a fallback, and it is not an apology

The feature must degrade to something useful when the model fails, times out, or gets rate-limited. A canned template, the previous deterministic behaviour, a queue-and-notify. "Our AI is busy, try again later" is an apology with a spinner. Design the degraded state first — it's the version some percentage of your users will genuinely experience, and it is still your product.

## 6. The UI has a feedback valve

Two mechanisms, minimum. An inline accept/edit/reject control whose events land in your traces (this is your real-world eval data — guard it jealously). And a low-friction report path for "this is wrong", wired to capture the trace ID so a human can look at the exact call. Feedback you can't route to a specific traced call is sentiment, not signal.

## 7. Latency is treated as UX, not infrastructure

Model latency is variable in a way databases taught us to forget. So stream where streaming helps comprehension, set expectations where it doesn't (a labelled "drafting…" state with a realistic time hint beats a naked spinner), and never block a page's core content on a generation. The discipline is the same one as our [Core Web Vitals practice](/journal/engineering/core-web-vitals-field-guide): pick the budget, measure the p75, let the budget veto features.

## 8. Prompt injection has been actively tried

Someone on the team has spent a day trying to break it: instructions embedded in pasted text, exfiltration attempts through user-controlled fields, the classics and the current ones. You will not make it injection-proof; you will make it injection-expensive, and you'll make sure the model never holds credentials or write-access it doesn't strictly need. Least-privilege applies to models exactly as it applies to services.

## 9. Data handling is documented like a grown-up system

Where does the input go, who is the processor, what's retained, what trains what? Controllers and processors, retention windows, regional routing if you're in AU and care about it — all decided and written down *before* launch, in language the client's counsel can review. "We use the API, not the consumer product" is step zero, not the policy.

## 10. Quality drift has a dashboard

Models change under you — version bumps, provider-side tuning, your own prompt edits. The golden set re-runs on every model or prompt change, automatically. In production, the inline feedback rate (edits and rejects as a share of generations) is charted weekly. When it moves two weeks running, that's an incident review, same as an error-rate climb.

## 11. A human owns the feature after launch

Not a team — a person. They watch the drift charts, triage the "this is wrong" reports weekly, and own the prompt changelog. LLM features unmaintained rot quietly; the failure mode isn't a crash, it's a slow slide into mushy, slightly-wrong output that erodes the trust the rest of the product spent years earning.

## 12. The honest sentence is in the interface

If the output can be wrong, say so, specifically, at the point of use: "Drafted from this month's figures — check the numbers before sending." Not a buried disclaimer; a sentence in the UI. It costs you nothing and buys you the one thing AI features can't regenerate: calibrated user trust.

## Key takeaways

- If you can't name the failure mode in one sentence, the task scope is too broad to ship.
- Gate launch on an agreed eval score over a golden set that includes hostile inputs.
- Trace every call and wire inline feedback to trace IDs — that's your real-world eval pipeline.
- Enforce three cost ceilings: per request, per user per day, and monthly aggregate with alerts.
- Design the degraded fallback state first; some users will only ever see that version.
- Re-run evals on every model or prompt change, and chart feedback rates weekly to catch drift.

## FAQ

**How long should this checklist take to run?** Two to four weeks alongside the build for a first feature, less for subsequent ones because the tracing, eval harness and feedback plumbing are reusable. The expensive part is always the golden set, and it's expensive precisely because it's the part that matters.

**Do we need all this for an internal-only tool?** Yes to evals, traces and a fallback; you can soften the data-review and cost ceilings if the blast radius is genuinely small. Internal users forgive less than you'd think — they're the ones whose Monday depends on it.

**Which items do teams skip most?** The fallback design and the named post-launch owner. Both are organisational, not technical, which is exactly why they get skipped — nobody's ticket says "own this in October."

**When should the eval score gate be set?** In the first week of the engagement, before anyone has a demo to fall in love with. A gate agreed before the demo survives contact with the demo; a gate invented after the demo bends.
