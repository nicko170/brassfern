---
title: "RAG and the staleness problem: freshness is a ranking signal"
description: "Stale retrieval makes RAG answers confident folklore. Treating freshness as a ranking signal, surfacing 'last updated' in answers, and designing the re-indexing pipeline."
slug: rag-freshness-staleness
cluster: ai
tags: [ai, rag, retrieval, knowledge base, engineering]
date: 2026-08-11
author: Felix Brandt
keywords: [RAG freshness, knowledge base AI, staleness handling, RAG design, AI support quality]
readingTime: 11
heroImage: /images/articles/ai/rag-freshness-staleness.jpg
heroAlt: "A stack of printed documents on cream paper, graded from crisp fresh sheets under a small brass weight to yellowed pages pressed with dried fern fronds."
---

Every RAG failure post-mortem we've run eventually reaches the same root: nothing was wrong with the model, the prompt, or the chunking. The retrieved documents were simply *old*. A refund policy retired in March, still faithfully retrieved in August. An API doc for the deprecated endpoint, ranked above its successor because it had more inbound links in the old wiki. The system answered exactly as designed — from a corpus that had quietly become folklore.

Staleness is the least glamorous problem in retrieval. There's no clever architecture that fixes it; there's only a pipeline, a policy, and a willingness to show your working. It's also the problem that most directly determines whether users trust an AI answer, because a user can forgive a hedged answer and will never forgive a confidently out-of-date one that cost them an afternoon. This piece covers how we handle it across our [AI engagements](/services/ai): freshness as a first-class signal, surfacing age in the UI, and the re-indexing pipeline that keeps support content from fossilising. It builds on the retrieval groundwork in [RAG pitfalls we hit so you don't have to](/journal/ai/rag-pitfalls-production) and the corpus-surgery in [chunking is a design decision](/journal/ai/rag-chunking-design).

## Staleness is three different bugs wearing one coat

Before designing anything, split the problem, because each variant has a different fix:

**Orphaned content** — documents about things that no longer exist: the deprecated feature, the old pricing plan, the sunsetted integration. Nothing signals their death because nobody deleted them; deletion is how they die in the product but almost never in the docs. These are the worst offenders, because they're not just old — they're *wrong*, and they often rank well (they were, once, heavily used).

**Zombie content** — documents about current things, last edited two years ago. Possibly accurate, possibly drifted. The danger here is ambiguity: the retrieval system can't tell "unchanged because still true" from "unchanged because abandoned."

**Fresh-but-unindexed** — the new policy exists but the pipeline hasn't ingested it, so the assistant answers from memory of the old world. The inverse failure: the corpus knows less than the company.

A mature freshness system handles all three deliberately. An immature one discovers them from support tickets, one angry user at a time.

## Freshness is a ranking signal, not a filter

The naive fix is a recency filter: only retrieve documents modified within N days. This fails immediately, because plenty of content is timeless (your security practices page should rank whether it was touched last week or last year) and plenty of recent content is irrelevant (the marketing blog post edited yesterday about the company offsite).

The right model: **freshness adjusts relevance; it doesn't gate it.** In practice:

**Store two timestamps per chunk, not one.** `content_modified_at` (the text changed) and `reviewed_at` (a human confirmed it's still true). These diverge constantly — a typo fix updates the first without touching the meaning; an annual review updates the second without touching the text. Retrieval that only sees `modified_at` systematically under-ranks stable, well-maintained content.

**Decay with a floor, per content class.** Apply a recency boost that decays over time, with class-specific half-lives: pricing and policy docs decay fast (a 90-day half-life is sane), reference documentation decays slowly, conceptual content barely decays at all. Old-but-unreviewed content doesn't vanish from results — it sinks unless nothing fresher competes. The floor matters: for niche queries, the two-year-old doc is still the only answer, and "old with a caveat" beats "no answer."

**Punish proven supersession, hard.** When doc B explicitly replaces doc A — versioned API docs, policy v2 over policy v1 — that's not a freshness gradient, it's a deletion your retrieval layer has to honour. Model supersession explicitly in metadata (`superseded_by`) and hard-exclude superseded chunks. Half-life decay will not save you here, because the old endpoint doc is usually *better written*, longer, and chunk-perfect for the query. It wins on quality signals while being wrong. We hit exactly this in the wild; it was the memorable failure from the aforementioned pitfalls piece and it still stings.

## Truth belongs near the mouth: surfacing freshness to users

The ranking layer is half the fix. The other half is admitting to the user that documents have ages. The pattern set:

**"Last updated" travels with the citation.** If an answer cites sources, the citation shows the source's age: "from *Refund policy*, updated 12 August 2026." We covered the citation mechanics in [citation design: making RAG answers checkable](/journal/ai/citation-ux-rag); the freshness stamp is the line item that most changes user behaviour, because it converts blind trust into calibrated checking. Users do date-math instantly when you hand them a date.

**Age-dependent hedging in the answer itself.** When the strongest source is old-and-unreviewed, the generation layer should say so: "Based on our docs (last reviewed in January), refunds take 5–10 days — worth confirming with support, as this policy may have changed." This isn't weakness; it's the single most trust-*building* sentence an assistant can produce when it's warranted. The threshold lives in the pipeline: past some staleness boundary, the system prompt gets an instruction to hedge and the answer gets a visual flag.

**The honest fallback.** Past a worse boundary — the only sources are orphaned or known-superseded — the right behaviour is non-answer with a handoff: "I can't find current documentation on this. Here's the team that owns it." This is [fallback UX for LLM features](/journal/ai/llm-failure-fallback-ux) with a retrieval-specific trigger. A RAG system that would rather say nothing than say 2023 is a system users keep trusting.

## The re-indexing pipeline is a product, not a cron job

Most teams build ingestion as a nightly batch job and discover its failure modes in production. Treat the pipeline as a product with its own reliability surface:

**Event-driven beats scheduled wherever the source allows it.** Webhooks from the CMS, doc store, or help centre trigger re-ingestion on publish. Scheduled crawls alone guarantee your freshness SLA is "up to one crawl interval of wrong answers." Event-driven ingestion collapses the fresh-but-unindexed gap from a day to minutes.

**Delete is a first-class event.** The pipeline's most common omission: documents removed or unpublished upstream stay searchable forever. Every ingestion path needs the symmetric operation. If your pipeline can insert and update but not delete, you don't have a freshness system — you have a hoarder with a queue.

**Content owners get a review queue.** The zombie-content problem isn't solvable by automation because only humans know whether an unchanged doc is still true. Route ageing content to its owner for a one-tap "still accurate" confirmation (which bumps `reviewed_at`) or an edit. This is a product surface with a UX bar: make the queue small, sorted by retrieval frequency (a stale doc that never gets retrieved is harmless), and completable in minutes. We wrote about the shape of these queues in [human-in-the-loop design](/journal/ai/human-in-the-loop-queues); the same mechanics apply to content maintenance. Ownership matters too — every chunk needs an accountable owner at ingestion time, or the queue routes to nobody and rots, which is where it started.

**Measure corpus health like uptime.** Median age of retrieved content (weighted by retrieval frequency), percentage of answers citing content past its review window, orphan rate, ingestion lag. Dashboard these; alert on them. A freshness budget — "less than 2% of answers cite unreviewed content older than 180 days" — is as legitimate a reliability target as latency, and it's the number that predicts user trust better than any eval score on a static test set.

## How staleness corrupts your evals (quietly)

One trap worth its own paragraph: if your golden eval set was built from the corpus (and it usually is — see [mining support tickets for test sets](/journal/ai/golden-eval-sets-support-tickets)), then when the world changes, the eval set's expected answers become folklore too. The assistant returns the new, correct answer; the eval marks it wrong against the old gold; the team "fixes" the prompt to restore yesterday's truth. We've watched this happen. It's the single most insidious staleness failure because it's self-reinforcing.

The defence: eval cases carry the same `reviewed_at` discipline as documents, eval review is part of content-review cadence, and any eval failure cluster gets a "did the world change?" check before a prompt change. Freshness is a property of the whole loop — corpus, pipeline, answer, and the yardstick you measure it with.

## A build order

1. Two timestamps per chunk; freshness as a ranking boost with per-class decay and a floor.
2. Explicit supersession metadata and hard exclusion of superseded chunks.
3. Delete propagation in the ingestion pipeline, plus event-driven re-indexing.
4. Citation-level "last updated", hedging thresholds, and the honest no-answer fallback.
5. Owner review queues for ageing content; corpus-health metrics and a freshness budget.
6. Eval-set review cadence tied to content review.

## Key takeaways

- Staleness is three bugs: orphaned (dead topics), zombie (ageing topics), and fresh-but-unindexed. Each has a different fix.
- Freshness adjusts ranking — two timestamps, per-class decay with a floor — and must never be a hard filter.
- Superseded content needs explicit deletion from retrieval; quality signals actively favour well-written wrongness.
- Surface document age in citations, hedge answers past a staleness threshold, and refuse past a worse one.
- The pipeline needs event-driven re-indexing, first-class deletes, and a human review queue routed to owners.
- Your eval set goes stale with the world; review it on the same cadence as the corpus or it will drag answers backward.

## FAQ

**Won't recency boosting bury our best, most stable documentation?**
Not with per-class decay and the `reviewed_at` timestamp. Stable docs that a human re-confirms stay fresh by definition — that's the point of rewarding review, not just editing. Timeless content classes should barely decay at all.

**Is showing "last updated" dates an admission of weakness?**
Users find the age out anyway — the moment an answer contradicts reality. Showing the date converts "the AI lied to me" into "the AI cited an old page," which is actionable and forgivable. Checkable beats confident, every time.

**How do we handle sources with no reliable timestamps?**
Assign a conservatively old default and let the review queue be the upgrade path: unverifiable age behaves like stale age until an owner confirms it. Never trust `Last-Modified` headers from a CMS that bumps them on template changes.

**Do we need event-driven ingestion to start?**
No — a nightly crawl plus delete propagation plus timestamps is a venerable v1. Event-driven matters when fresh-but-unindexed gaps cause real harm (support assistants answering policy questions are the canonical case). Build the delete path first; it's the one scheduled-only pipelines always lack.

**What freshness budget should we start with?**
Measure first, then budget. Most teams' initial numbers are grim — 15–25% of answers citing content past a 180-day review window is typical for a mature help centre that's never had review discipline. The trend is the goal: quarter over quarter, that number should fall.
