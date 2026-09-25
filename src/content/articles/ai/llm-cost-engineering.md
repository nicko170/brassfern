---
title: "Cost engineering for LLM features"
description: "Unit economics for AI features: model routing, caching layers, context trimming, batch APIs, and dashboards that translate tokens into dollars per user."
slug: llm-cost-engineering
cluster: ai
tags: [llm costs, unit economics, model routing, caching, ai infrastructure]
date: 2025-04-24
author: Felix Brandt
keywords: [llm cost optimization, ai unit economics, model routing, llm caching, context trimming, batch api, ai feature costs]
readingTime: 12
---

Somewhere in your company right now is a spreadsheet from last year that says the AI feature costs "about $0.02 per request". It was true for a week, in a demo, with a 200-token context and nobody using the feature twice. Six months later the real number is eleven times that, the finance team has Started Asking Questions, and engineers are doing the least useful thing engineering can do to an AI feature: apologising for it.

LLM cost is not a surprise you discover; it's a system you design. The features that stay affordable treat cost the way good teams treat performance — a budget, a dashboard, a few boring disciplines exercised relentlessly. This is the discipline we install on engagements in our [AI practice](/services/ai), refined on features like the assistant behind [Brightmarsh](/work/brightmarsh-onboarding) and several we can't name because their margins are the point.

## Start with unit economics, not the token price

Token pricing tables are a trap because they make cost look like procurement. It isn't. The number that matters is **cost per successful outcome** — per resolved support conversation, per generated-and-kept draft, per user per month at your expected adoption. Work backwards:

```text
cost per conversation =
    (retrieval tokens + system prompt + history + output)
  × turns per conversation
  × price per token of the model you actually used
  + (retrieval infra + eval runs + safety passes)
```

Then put it next to value: the support cost deflected, the conversion lift, the seats it replaces. On the Brightmarsh assistant, the honest per-conversation number came out at roughly 1/40th of a human-handled ticket — but only after we killed a silent multiplier: users were pasting entire documents into chat, so median context had grown to 9,000 tokens. The fix wasn't a cheaper model. It was a product change — structured upload with extraction instead of paste — which is the recurring lesson of cost engineering: **the expensive parts are usually product decisions, not model prices.**

Set a budget per outcome before build, in dollars, written in the same document as the UX latency budget. If you can't state "a conversation may cost up to $0.35 and deflects an $8 ticket", you don't have a feature yet; you have a demo with a billing relationship.

## Discipline one: model routing is a product decision

The first law of LLM economics: most requests don't need your best model, and the ones that do are identifiable before you pay for them. Routing is how that law becomes margin. The typical estate has three or four quality tiers, and a cheap classifier — often a small model, occasionally a set of embarrassingly simple heuristics — assigns each request:

- **Tier 0 (no model).** Cache hits, FAQ lookups, deterministic answers. A shocking fraction of support traffic is answerable with retrieval alone: the question "where's my invoice" wants a database, not a reasoning engine. Every request served here costs the electricity to look it up.
- **Tier 1 (small model).** Classification, extraction, reformatting, short factual answers with retrieved context. Modern small models are absurdly good at narrow jobs, often 10–30× cheaper than frontier.
- **Tier 2 (frontier).** Multi-step reasoning, long documents, judgement calls, anything your evals show the small model failing.
- **Tier 3 (premium/reserve).** Rare; usually you can pretend it doesn't exist.

The mistakes to avoid: routing by vibes ("complex-sounding questions go to the big model" — your router must be validated against evals, or it's astrology), and one-sided routing that only escalates. Some requests routed *up* should be routed *down* after the first turn; a conversation that needed frontier reasoning in turn one often needs a parakeet by turn four. Re-route per turn, not per conversation, and log the tier of every call. On one fintech assistant, per-turn routing moved 61% of spend to small models while *raising* eval pass rates, because the frontier model had been lazily over-thinking simple requests and occasionally talking itself into error. Cheap and better is available more often than cheap and worse.

## Discipline two: caching is a stack, not a flag

Every layer caches something different, and the layers multiply:

1. **Exact response cache.** Identical prompts return the stored answer. Hit rates are low in chat but high in templated surfaces (product descriptions, report boilerplate). Free money; take it.
2. **Semantic cache.** Embed the request, return a stored answer when similarity passes a threshold *and* the underlying context is unchanged. Powerful, dangerous: a semantic cache that answers "what's my balance" at 0.97 similarity to last week's question is a data leak wearing a costume. Scope it per-user and invalidate on every context change, or don't build it.
3. **Prefix/context caching.** Providers now cache long shared prefixes — system prompts, few-shot banks, retrieved docs — at a discount. This is the biggest structural win available: design prompts so the stable, expensive prefix comes first and the volatile tail is short. On Brightmarsh, reordering the prompt so the 2,800-token voice-and-policy block sat before the per-request context cut prompt costs by roughly a third without changing a single word.

The cache discipline that matters most is metadata: log hit/miss per layer, per surface. A caching layer you don't measure is a belief system.

## Discipline three: tokens are inventory — trim the context

Context windows feel free until you get the invoice. The disciplines:

**History is not holy.** Chat products append the whole conversation forever "for continuity". Beyond a dozen turns, most history contributes nothing a summary couldn't: keep the last few turns verbatim, summarise the rest, drop tool outputs older than their usefulness. A rolling window with a summary layer typically cuts long-session costs by half with no measurable quality loss — verify with your evals, because "no measurable loss" is a claim you test, not assume.

**Retrieve less, better.** RAG costs compound twice: retrieval infrastructure, then the tokens of everything you stuffed in. Most pipelines over-retrieve defensively (top-20 "just in case"). Rank hard, stuff little, and dedupe chunks — the same paragraph retrieved from two documents is paid twice. We routinely find 40–60% of stuffed context is never reflected in the answer; measure "citation coverage" per stuffed chunk and let the data do the trimming. This pairs naturally with the pipeline hygiene in our [prompt system practices](/journal/ai/prompt-design-systems) — structure makes trimming possible.

**Output is the expensive direction.** Output tokens cost several times input. Verbosity is a settings-and-prompt problem: cap lengths in the system prompt, enforce them in evals, and never let a default be "write me an essay" when the user asked a yes/no question with a reason attached. On one drafting feature, moving from "thorough" to "tight, expandable" as the default cut output spend 47% and — because users actually read the short version — increased the keep-rate of drafts. This is the same lesson as [streaming UX](/journal/ai/streaming-ux-patterns): the interface shapes the economics.

**Sweat the system prompt.** A 2,000-token system prompt is paid on every call, on every turn, forever. That's not a style document; that's rent. Hold prompts to the same discipline as [performance budgets](/journal/engineering/core-web-vitals-field-guide): a token budget per prompt, enforced in CI, with an owner.

## Discipline four: shape the workload

Two levers routinely beat model choice:

**Batch the batchable.** Anything not user-facing-in-real-time — nightly classification, embedding refreshes, report generation — can run through batch APIs at roughly half price. Audit your surfaces: we usually find a third of "real-time" calls are real-time because nobody asked whether they were.

**Guard the edges.** Retries double-spend silently (dedupe idempotently, resume streams from checkpoints rather than regenerating); truncation hacks — "the user pasted 40k tokens, just cut it" — destroy quality while saving margin, so extract and summarise instead; and rate-limit per user per surface, because one enthusiastic script kiddie with your feature open is a Denial of Wallet attack. Cost anomaly alerts (spend per user per hour) belong on the same pager as uptime.

## The dashboard that changes behaviour

All of this dies without visibility, and the visibility that changes behaviour is **dollars per user per feature**, not tokens. The dashboard we leave behind on every engagement has five numbers, reviewable in five minutes on Monday — the same cadence as the vitals ritual in [budgets that survive sprints](/journal/engineering/core-web-vitals-field-guide):

- **Cost per successful outcome** per feature (weekly trend)
- **Route mix**: share of calls per tier (watch drift toward expensive)
- **Cache hit rates** per layer
- **Context stats**: median and p90 tokens stuffed, citation coverage
- **Spend per active user** with anomaly flagging

Give it an owner with the authority to say no — on healthy teams that's the AI lead sitting with product, because the expensive decisions are product decisions. And once a quarter, re-run the pricing exercise: model prices fall faster than adoption grows, and last year's margin story is usually *better* than you remembered. Cost engineering isn't only defence; it's how you find out you can afford the feature you earlier declined.

## Key takeaways

- Measure cost per successful outcome and set a dollar budget per outcome next to the latency budget; token price tables are procurement, not economics.
- Route per turn across no-model → small → frontier tiers, validated against evals; cheap-and-better is available more often than cheap-and-worse.
- Cache as a measured stack: exact, semantic (carefully scoped), and structured for provider prefix caching.
- Treat tokens as inventory: rolling-history summaries, hard-ranked minimal retrieval, output caps, and CI-enforced system-prompt budgets.
- Batch the batchable, dedupe retries idempotently, and alert on per-user spend anomalies.
- One dashboard, five numbers, five minutes every Monday, one owner with veto.

## FAQ

**Should we just self-host open-weights models to control cost?**

At sufficient, sustained volume — yes, sometimes. But price the whole thing: GPUs idle exactly as expensively as they run, ops people are tokens too, and frontier APIs reprice downward quarterly. Self-hosting wins for stable predictable workloads and data-residency needs; it loses as a reflex. Run the per-outcome numbers both ways, twice a year.

**What's a sensible gross-margin target for an AI feature?**

If the feature *is* the product (an AI writing tool), target the usual software economics — model cost under ~20–30% of revenue per user at scale, falling as providers reprice. If AI enriches an existing product, the bar is behavioural: does the feature pay for itself in retention, conversion or deflection? Measure that, not the token bill.

**How do we forecast cost before launch?**

Prototype with real prompts and honest usage assumptions, measure cost per conversation in pilot, then multiply by a pessimistic adoption curve — pessimistic because power users find the expensive paths first. Pad 2× for the paste-entire-documents behaviour you haven't discovered yet; there's always one.

**Do eval and safety passes really matter to cost?**

They can add 10–40% to LLM spend if implemented naively as extra full-context calls. Run them on smaller models, on subsets (sampled audits rather than 100% double-generation), and cache aggressively. Safety and evals are non-negotiable; their implementation shape is not.

**Where do teams most often overspend first?**

System prompt bloat and conversational history, in that order — both invisible to the people approving the invoice. A fortnight with a token logger on staging usually pays for the whole cost program. After that, it's the discipline above, and the willingness to treat a 2,000-token preamble as rent you keep renegotiating.
