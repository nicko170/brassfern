---
title: "AI cost observability: tokens are a line item now"
description: "LLM features live or die on unit economics. Build per-feature token budgets, cost-per-successful-task dashboards, cache tracking and frontier charts execs actually read."
slug: ai-cost-observability
cluster: ai
tags: [ai, observability, finops, unit economics, dashboards]
date: 2026-05-28
author: Felix Brandt
keywords: [LLM costs, token budgets, AI observability, cost per task, finops, unit economics]
readingTime: 11
---

Every product with an LLM feature has a moment, usually around month three, when someone from finance forwards the provider invoice with a subject line like "???" The invoice is up 4x. Nobody knows which feature caused it. The dashboard says "AI calls: 2.1M" as if calls were the unit of anything. This is the moment the team discovers they built cost *logging*, not cost *observability* — and the difference, like most things in observability, is whether you can answer questions or just admire data.

We now treat AI cost instrumentation as a launch blocker on every [AI engagement](/services/ai), the way performance budgets are a launch blocker on our web builds. This piece is the setup we install: the metrics, the budgets, the alerts, and the one chart that gets execs to make decisions. For the engineering side — caching, routing, model selection — see [cost engineering for LLM features](/journal/ai/llm-cost-engineering). This one is about seeing.

## Cost per call is a vanity metric

The default instrumentation counts calls and tokens at the API boundary. It answers "how much did we spend" and nothing else. The questions that matter are all one level up:

- What does a *successful outcome* cost, per feature?
- Which features have improving unit economics, and which are structurally underwater?
- What did that prompt change do to cost per task?
- Where does the spend come from — users, retries, evals, test traffic, one customer's pathological data?

None of these are answerable from a token counter. The unit that matters is the **task**: a user-visible outcome like "ticket drafted," "document summarised," "answer with citations." Several calls, a retrieval, maybe a repair loop. Everything we instrument hangs off task IDs.

## The instrumentation skeleton

The setup we ship on day one:

**Task-scoped spans.** Every LLM call, retrieval, and tool invocation inside a user task carries the task ID, feature name, model, and user segment (never raw user identity — hash it). Costs roll up to the task, so "the summarisation feature cost $412 yesterday" is a query, not a research project.

**Success annotations.** A task span gets marked successful by whatever signal the product already has: the draft was sent, the summary was accepted without regeneration, the answer got a thumbs-up, the agent run completed without human takeover. Imperfect, directionally honest. Cost per *successful* task is the north-star metric; cost per attempted task tells you how much you're spending on failure.

**Retry and repair accounting.** Sub-agents, self-correction loops and retry-hedging features have a nasty habit of spending 3x the tokens to produce one output. That's fine if it's deliberate and priced in. It's usually neither. Log the call count per task; when the median task makes four model calls, you want to know.

**Waste buckets.** Eval runs, test traffic, synthetic monitoring, internal dogfooding. Route them to separate cost centres or your real unit economics are diluted by your own testing. On one project, "the feature" appeared to cost $0.11 per task until waste bucketing revealed $0.04 of that was the team's own eval suite running hourly against production.

## Budgets and alerts that page the right person

Global spend alerts ("AI spend exceeded $X/day") page whoever's on call, who can do nothing about it. Budgets belong at the feature level, owned by whoever owns the feature:

- **Soft budget at 80% of the month's target:** a Slack note to the owning team with the week-over-week trend attached. No pages; awareness.
- **Hard budget:** automatic degradation, not a page at 3am. This is what the [kill switch](/journal/ai/ai-feature-kill-switch) is actually for — drop to a cheaper model, tighten context windows, or gate the feature behind a queue. The system protects the margin while the humans sleep.
- **Anomaly alerts on cost per successful task, not raw spend.** Raw spend scales with growth and you want it to. Cost per task shouldn't move without a code, prompt, or model change — so when it does, something happened. A 30% week-over-week jump in cost per successful task with no deploy means user behaviour shifted (longer documents, new use case) or a provider quietly changed pricing. Both deserve a human's morning, and neither needs a page.

One rule we hold hard: alerts name the feature and the suspected cause in the alert text. "Summarisation: cost/task +42% after prompt change in PR #1183" gets fixed in an hour. "Spend high lol" gets snoozed for a quarter.

## The cache hit rate is a margin dial

Two costs dominate most LLM features: uncached input tokens (the same system prompt, the same retrieved context, re-billed a thousand times a day) and over-sized models on tasks a smaller model handles. Observability should surface both as first-class metrics:

- **Cache hit rate per feature**, with the dollar value of hits alongside. Watching this number drop after a "harmless" prompt refactor — one that shuffled a dynamic field into the cached prefix — has paid for the whole dashboard more than once.
- **Model mix per feature.** After you introduce model routing (small model for easy tasks, large for hard), the mix *is* the margin. A drift from 70/30 to 50/50 in the big model's favour usually means the routing heuristic regressed, not that users got needier.
- **Context-window utilisation.** If your summariser's input tokens doubled, either documents grew or retrieval started over-stuffing. The number to track is input tokens per task by percentile — p50 tells you about normal use, p95 tells you about the customer whose data will bankrupt you.

## The frontier chart execs actually read

Finance stakeholders don't want token dashboards; they want to know whether the feature is worth it and whether the trend is friendly. The chart that works is the **cost-quality frontier**: every model-and-prompt configuration you've tested, plotted as cost per successful task against task success rate on your [eval suite](/journal/ai/evals-practical-guide), with the current production config marked.

It answers the three executive questions at a glance: where are we, what would a cheaper config cost us in quality, and what would a better config cost us in money. When a new model launches, you re-run the suite, add a point, and the "should we switch" conversation becomes a five-minute meeting about a picture instead of a month of opinions. It also makes the migration cost visible before anyone commits — the same clarity that pays off in the [deprecation playbook](/journal/ai/model-deprecation-playbook).

Keep it monthly, keep it in the same deck format, and annotate it with the changes that moved the dot. Executives don't need observability; they need a trend line they trust.

## Killing features whose economics never worked

The uncomfortable purpose of all this instrumentation: some AI features have unit economics that never close. The task success rate is real, users love it, and the cost per successful task exceeds what anyone will pay — often because the valuable cases are the expensive ones (long documents, multi-step agent runs) and the cheap cases are the ones nobody needed.

Without task-level cost data, these features linger for years, subsidised by the vague goodwill of "AI strategy." With it, the conversation gets honest and fast. We've recommended killing or restructuring three features across our client work in the past year; in each case the data turned a political fight into a pricing decision. Two of the three came back stronger — one as a paid-tier feature with a credit system (see [pricing AI features](/journal/ai/ai-feature-pricing)), one redesigned around pre-computation so the expensive inference happened once, offline, instead of per-user. Killing a feature with good data is product management. Killing it with vibes is just a meeting.

## Key takeaways

- Instrument tasks, not calls. Cost per successful task is the north star; cost per attempted task shows what failure costs you.
- Scope budgets and alerts to features and owners. Hard budgets should trigger automatic degradation, not 3am pages; alert on cost-per-task anomalies, not raw spend growth.
- Track cache hit rate, model mix and context utilisation as margin dials — they regress quietly after innocent-looking prompt changes.
- Keep a cost-quality frontier chart per feature; it turns model-selection and migration debates into five-minute meetings about a picture.
- The point of cost observability is decisions: repricing, redesigning, or killing features whose economics can't close. Vibes don't survive an invoice.

## FAQ

**How much instrumentation is enough for a pre-launch feature?**
Task IDs, per-call cost logging, and a success signal — that's the minimum, and it's an afternoon of work if you do it before launch and a month of retrofitting after. Budgets and alerts can start crude (a spreadsheet, honestly) and graduate to real monitoring when spend crosses a pain threshold.

**Our success signal is noisy — users regenerate even good outputs sometimes.**
Directionally honest beats precisely wrong. Pick the best available proxy, document its flaws, and recalibrate quarterly against a small human-reviewed sample. The metric's job is to be comparable over time, not perfect.

**Won't finance just want one total?**
They already have one — the invoice. Your job is to give them the breakdown that makes the total boring: per-feature cost per successful task, trend lines, and the frontier chart when decisions loom. One total invites "can we spend less"; unit economics invite "is this worth it," which is the question that keeps good features alive.

**How do we attribute costs in multi-tenant products?**
Hash tenant IDs into spans at the adapter level and report cost per successful task by tenant segment, not per individual tenant, to keep the analytics clean and privacy-safe. The output you actually need is "which *kind* of customer is expensive," because that's a pricing and packaging question.
