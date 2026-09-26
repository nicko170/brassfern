---
title: "The model deprecation playbook nobody writes until it's 3am"
description: "Your LLM provider just announced a deprecation window. How to migrate without panic: abstraction layers, eval-gated cutovers, shadow traffic and honest customer comms."
slug: model-deprecation-playbook
cluster: ai
tags: [ai, llmops, migration, evals, vendor risk]
date: 2026-06-22
author: Felix Brandt
keywords: [model deprecation, LLMOps, model migration, eval-gated migration, vendor risk, shadow traffic]
readingTime: 12
heroImage: /images/articles/ai/model-deprecation-playbook.jpg
heroAlt: "A desk calendar with a circled date beside brass gears and a potted fern on warm paper — a migration deadline on a workbench."
---

The email always arrives the same way. Subject: "Important changes to our model lineup." Body: the model your product has shipped on for fourteen months is deprecated, sunset in ninety days, and here's a cheerful migration guide that assumes your integration is a single API call. It never is. Your prompts are tuned to this model's quirks, your evals were calibrated against its failure modes, and somewhere in the codebase is a retry heuristic that only makes sense for exactly this model's timeout behaviour.

We've now run planned and unplanned model migrations across most of our [AI client work](/services/ai), and the difference between a two-week migration and a two-month incident is never the model — it's whether the deprecation playbook existed before the email arrived. This is the playbook we write on day one of every LLM engagement. The companion piece, [swapping the model without breaking the product](/journal/ai/model-migration-without-breakage), covers the cutover mechanics; this one is about the system you build so the mechanics stay boring.

## The calendar math nobody does

Deprecation windows look generous until you subtract. Ninety days minus weekends is about 64 working days. Now subtract:

- **Two to three weeks** for the provider's own migration guide to stabilise (the first version is always wrong in ways you'll discover, not be told).
- **One to two weeks** for eval re-baselining, because your golden set scores differently on the new model even when nothing is "broken."
- **Your release cadence.** If you ship weekly and need two quiet soak weeks at the end, that's four weeks of the window gone before you've migrated a single prompt.
- **The freeze reality.** Anything shipping during the migration competes for the same engineers. Deprecations don't pause your roadmap; they tax it.

A 90-day window is really about six weeks of usable migration time. A 30-day window — which happens — is an emergency. Plan your architecture for the 30-day case and the 90-day emails become paperwork.

## The abstraction layer that actually isolates

Every codebase claims to have a model abstraction layer. Most have a function called `callModel()` that takes a prompt string and returns a string — which isolates nothing, because the coupling was never in the API call. It's in everything around it.

Real model coupling lives in five places:

1. **Prompt shape.** Your prompts are tuned to one model's instruction-following habits, formatting preferences and tokenisation quirks. If prompts live inline in business logic, migration means archaeology.
2. **Structured output handling.** Each model family has its own JSON-reliability quirks — trailing commas, markdown fences, refusal formats. If your parsing code expects specific failure patterns, it's coupled. (The discipline in [structured outputs](/journal/ai/structured-outputs-reliable-ui) pays for itself precisely here.)
3. **Parameters.** Temperature isn't portable. A 0.3 on one model is not a 0.3 on another. Hard-coded generation parameters are hidden coupling.
4. **Token accounting.** Context windows, tokenizer differences, and price per token all change. Anything that budgets context by character-count heuristics tuned to one tokenizer breaks silently.
5. **Latency and retry assumptions.** Timeouts, streaming chunk behaviour, rate-limit shapes.

The layer that works: a **model adapter per provider** that owns the prompt template registry, output schema validation, parameter mapping, usage accounting, and streaming normalisation for one model family. Business code speaks in domain terms — `summariseTicket(ticket, opts)` — and never sees a prompt string. When migration day comes, you write a new adapter and run it against the eval suite. We've done this cutover in four working days; the archaeology version took a previous client eleven weeks.

## Eval-gated migration, or don't migrate

If you have no eval suite when the deprecation email arrives, your first sprint is building one — a thin version is enough. The golden-set approach in [mining support tickets for eval sets](/journal/ai/golden-eval-sets-support-tickets) gets you something real in days.

The migration gate is simple to state and brutal to honour: **the new adapter does not receive production traffic until it passes the eval suite at parity or better on every dimension the old model passed.** Not "mostly," not "the failures look acceptable." Parity. You define parity thresholds per feature before you start — because mid-migration, under deadline, everyone becomes very flexible about what "acceptable" means.

Two details that save you:

- **Score failure shape, not just failure rate.** The new model might fail less often but in new ways — refusing benign inputs it finds ambiguous, say. Your evals need categories, not a single pass rate.
- **Re-baseline once, loudly.** New model, new scoring quirks. Run the old model through the *new* eval harness before you start, record those numbers as the bar, and put them in the migration doc. Otherwise you're steering against a memory.

## Shadow traffic: the honest rehearsal

Evals tell you the new model works on last month's problems. Shadow traffic tells you it works on this week's. The pattern:

1. Route production requests to both models.
2. Serve the old model's answer to the user; log the new model's answer alongside.
3. Diff on a schedule — automated comparisons for structured outputs, sampled human review for prose.
4. Track three numbers: agreement rate, latency delta, and cost delta.

Two weeks of shadow traffic on real load surfaces things evals never do: the prompt that only appears for one enterprise customer's weird data shape, the edge case where the new model is *better* and your fallback copy written for the old failure mode now confuses people, the p99 latency that doubles under rate limiting. Shadow traffic is also where you discover your cost model was wrong — pair it with the budgeting discipline from [cost engineering for LLM features](/journal/ai/llm-cost-engineering) before you commit.

One warning: shadow traffic doubles your provider bill for its duration. That's the price of the rehearsal, and it's cheaper than the alternative. Budget it when you scope the migration, not when the invoice lands which someone's CFO wants explained.

## Customer comms for behaviour drift

Even a parity-passing migration changes behaviour at the edges, and your power users will find those edges in a day. The temptation is silence — nothing *broke*, after all. We've watched silence burn: users notice the drift, assume the product is degrading, and trust erodes far more than if you'd just told them.

The comms pattern that works:

- **Announcement, not apology.** "We're upgrading the model behind [feature]. It's faster and scores better on our test suite. You may notice small changes in phrasing and structure." Confident, proportionate, two weeks before cutover.
- **Name the visible diffs.** If summaries will get shorter or the tone shifts, say so. Power users calibrate instantly when told; they spiral when surprised.
- **A feedback lane.** One-click "this seems different" reporting for two weeks after cutover. You'll get noise, and you'll also get the one report that catches the drift your evals missed. On one migration, a customer's report about date-format handling in extracted fields reached us eleven hours after cutover; shadow traffic had never seen that locale's invoices.
- **Internal enablement first.** Support and success teams get the migration notes, the known diffs, and the rollback criteria *before* customers get the announcement. The worst deprecations are the ones customers understand better than your own team.

## Rollback and the kill switch

Until the old model is actually sunset, your migration must be reversible in minutes: a config flag, not a deploy. Keep the old adapter tested through the whole window. After sunset, the rollback story becomes the new model's pinned predecessor — which is why we pin model versions explicitly in config (never `latest`) even for the *new* model from day one.

And every AI feature needs the ultimate escape hatch regardless of migrations: the [kill switch](/journal/ai/ai-feature-kill-switch) that degrades the feature gracefully to non-AI behaviour. Deprecation is the scenario that justifies building it even when nobody wants to.

## Key takeaways

- A 90-day deprecation window is six weeks of real migration time. Architect for the 30-day emergency case and normal deprecations become routine.
- Model coupling lives in prompts, parsing, parameters, token accounting and latency assumptions — not the API call. Your abstraction layer must own all five.
- Gate the cutover on eval parity with thresholds written before you start. Score failure shape, not just failure rate, and re-baseline the eval harness once, in writing.
- Run two weeks of shadow traffic on live load; it surfaces the edge cases evals can't and bills you less than a bad cutover.
- Communicate behaviour drift confidently and specifically, arm internal teams first, and keep rollback one config flag away for the entire window.

## FAQ

**We only call one model in one place — do we need all this?**
Scale the machinery, keep the order. Even a single-feature integration benefits from a prompt registry, evals and a config-level model pin; shadow traffic and formal comms can shrink to a week of internal canary use. What you can't skip is knowing, measurably, what "works" means before the window opens.

**Should we migrate before the deprecation is announced, as insurance?**
Continuous multi-model evals are cheap insurance: run your eval suite quarterly against one credible alternative model and store the scores. If a deprecation arrives, you're starting from data instead of zero. Actually maintaining two live adapters full-time is rarely worth it outside regulated or latency-critical products.

**The new model is better on evals but feels different. Ship anyway?**
Better-and-different is the normal case, and it's what the comms section is for. Ship after parity-plus on evals and shadow-traffic validation, announce the expected differences, and keep the feedback lane open. Chasing output-identical migrations is a trap — you're tuning prompts against a moving target with a hard deadline.

**What if we just… don't migrate and let it sunset?**
Then the feature dies on the provider's schedule instead of yours. Occasionally that's the right answer — deprecations are wonderful forcing functions for killing AI features whose unit economics never worked. But make the decision on purpose, with migration effort sized, rather than discovering it was made for you.
