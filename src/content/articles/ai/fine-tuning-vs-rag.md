---
title: "Fine-tuning vs RAG vs prompt: a decision guide"
description: "Prompt, retrieve or fine-tune? The decision tree we run with clients, with real cost curves, data requirements, iteration speed and the maintenance burden nobody mentions."
slug: fine-tuning-vs-rag
cluster: ai
tags: [llm architecture, rag, fine-tuning, prompt engineering, technical strategy]
date: 2026-05-07
author: Tomás Reyes
keywords: [fine tuning vs rag, llm architecture decisions, when to fine tune, prompt engineering strategy]
readingTime: 11
---

The most expensive sentence in AI product development is "we'll just fine-tune it." We've heard it in kickoff meetings from smart teams with real budgets, and what it usually means is: we haven't isolated what's actually wrong with the base model's output, and fine-tuning sounds like the serious-engineer option. Sometimes it is. More often it's an irreversible-feeling commitment made before anyone's tried the reversible ones.

Here's the decision framework we run through with clients before any architecture gets committed. It's ordered by cost of change: prompt engineering first, retrieval second, fine-tuning last. Not because fine-tuning is bad — because the order matches how much each option costs to get wrong.

## The one question that decides most of it

Before any technique discussion: **is the problem knowledge, or is it behaviour?**

- **Knowledge problems**: the model doesn't know your refund policy, your product catalogue, last quarter's numbers, the user's account history. The information exists; the model can't see it.
- **Behaviour problems**: the model knows the facts but won't *behave* — wrong format, wrong voice, wrong structure, won't follow your classification schema, over-explains when you want terse.

Knowledge problems are solved by giving the model the knowledge (retrieval). Behaviour problems are solved by teaching the behaviour (prompting first, fine-tuning when prompting saturates). Teams reach for fine-tuning to fix knowledge problems roughly half the time we audit a struggling AI feature, and it never works well, because a fine-tuned model recites learned text with the confidence of fact — which is worse than not knowing, since you've now removed the ability to cite a source.

## Option 1: Prompt engineering — the free territory

A well-built prompt handles more than most teams believe, because they stopped iterating too early. "Well-built" means:

- **A system prompt with a defined role, output contract and failure behaviour.** Not "you are a helpful assistant" — two hundred words of specific instruction, including what to do when uncertain. Failure behaviour is the part everyone skips: "if the answer isn't in the provided material, say so and offer to connect the user to the team" is worth more than any amount of capability prompting.
- **Few-shot examples.** Three to five input/output pairs demonstrating the exact format and register you want. Examples teach structure better than instructions; the model is a pattern-completer and you're handing it the pattern.
- **Structured output constraints.** JSON schemas, response formats, length limits enforced in the prompt *and* validated in code. Never trust; always parse.

The economics: iteration costs minutes. A prompt change is a deploy, not a training run. You can A/B prompts like landing pages, and we do — the same [experiment discipline](/journal/growth/cro-experiment-design) applies, with pre-registered success criteria rather than vibes.

Prompt engineering saturates when your examples get long enough to eat the context window, when the behaviour you need is subtle enough that examples don't transfer, or when latency and token costs from a giant prompt exceed the cost of the alternatives. That's the honest stopping point. Most teams never reach it. For the craft details, our guide to [shipping LLM features](/journal/ai/shipping-llm-features) covers the prompt layer in depth.

## Option 2: RAG — for knowledge that changes

Retrieval-augmented generation inserts relevant documents into the prompt at query time. The model reads your policy, then answers. Its strengths line up exactly with fine-tuning's weaknesses:

- **Freshness.** Update the document, not the model top. When the client's pricing changed three times in a quarter — true story, retail engagement, mildly chaotic quarter — the RAG system didn't notice, because there was nothing to retrain.
- **Provenance.** Retrieved chunks can be cited. That unlocks the entire trust apparatus we described in [designing AI features users can trust](/journal/ai/ai-trust-design): inline sources, verification, the receipts.
- **Access control.** Retrieval filters can respect per-user permissions. A fine-tuned model's knowledge is fused into the weights; you can't selectively un-know something for a user who shouldn't see it. Anyone who has tried to bolt permissions onto a fine-tuned model knows this pain.

The costs are real and mostly operational. You're now running a retrieval system: chunking strategy, embeddings, a vector index, re-ranking, freshness pipelines. Each is a place for silent failure — the chunking that splits a policy table across two chunks so neither half is meaningful is a classic. RAG quality is a data-engineering discipline more than an ML one. Budget for it: in our experience, the retrieval pipeline is 60–70% of the build effort on a RAG feature, the prompt maybe 20%, and the "AI" part the trivial remainder.

RAG is wrong when the task isn't really about documents — classification, extraction, structured transformation — or when your corpus is small and stable enough to live in the prompt wholesale. Twenty pages of reference material? Put it in the system prompt and skip the vector database entirely. We've seen teams stand up a retrieval stack for a corpus that fit in 4,000 tokens.

## Option 3: Fine-tuning — for behaviour at scale

Fine-tuning earns its complexity in exactly four situations:

1. **Format compliance that prompts can't hold.** You need output in a rigid structure, thousands of times a day, and prompt-based compliance is at 94% when you need 99.9%. Structured extraction and classification at volume is the canonical case — the one where fine-tuning has the longest, dullest, most successful track record.
2. **Voice and style transfer.** If the output must carry a house voice consistently across millions of generations, examples-plus-fine-tuning beats a five-page style prompt. This connects to the [voice chart](/journal/brand/brand-voice-charts) work: a voice you can define with before/after pairs is a voice you can distil into weights.
3. **Latency and cost at volume.** A fine-tuned small model that does the job without a massive prompt can be an order of magnitude cheaper per call at scale. This is a real argument — after you've proven the behaviour with a big model and prompts first. Distill, don't speculate.
4. **Domain priors that examples can't convey.** Specialised vocabulary with non-obvious semantics — clinical shorthand, legal drafting conventions — where few-shot examples can't teach the implicit rules fast enough.

The maintenance burden nobody mentions in the demo: a fine-tuned model is a snapshot. Your data drifts, the base models improve, and you now own a retraining pipeline, an evaluation harness (which you needed anyway — see [analytics for AI features](/journal/ai/ai-feature-analytics)), and a regression risk every time you retrain. When the underlying provider releases a stronger base model, you re-run the whole thing or get left behind. This is a commitment to an ML lifecycle. If that sentence made you tired, you're not ready, and that's fine — most products never need it.

## The decision tree

```
Is the problem knowledge the model can't see?
├─ Yes → Is the knowledge large or frequently changing?
│   ├─ Yes → RAG
│   └─ No  → Put it in the prompt
└─ No (it's behaviour) → Does a strong prompt with examples hit the bar?
    ├─ Yes → Ship the prompt. Revisit at scale.
    └─ No  → Do you have 500+ good examples and an eval harness?
        ├─ Yes → Fine-tune (a small model, against evals)
        └─ No  → Build the examples and evals first. Prompt meanwhile.
```

Note what's absent from the tree: the size of the budget, the impressiveness of the technique, and what a competitor announced on their blog. Those three drive most real-world fine-tuning decisions, and they're all wrong reasons.

## A composite example

A logistics client wanted an assistant that answered shipper queries about their freight. We decomposed it: account-specific answers (current shipments, invoices) went to RAG over their operational data with citations. Format — always respond with status, ETA, and a next action — was prompt-engineered with examples, and held at 99%+ compliance, so fine-tuning died there. Voice was a prompt layer written with their comms team. Total fine-tuning used: none. Total time to a feature shippers trusted: eleven weeks, of which six were the retrieval pipeline. The lesson generalises: decompose the feature into knowledge and behaviour, then apply the cheapest tool per part. Features are mixtures; architectures should be too.

## Key takeaways

- Diagnose before prescribing: knowledge problems need retrieval, behaviour problems need prompting or fine-tuning. Treating one with the other's tool is the standard failure mode.
- Order options by cost of change: prompt (minutes), RAG (weeks of data engineering), fine-tuning (an ML lifecycle you now own).
- A strong prompt includes role, output contract, failure behaviour, few-shot examples and validated structured output. Most teams abandon prompting far earlier than it saturates.
- RAG's real cost is the retrieval pipeline — chunking, freshness, permissions — not the model. Budget 60–70% of effort there. Skip it entirely if your corpus fits in the prompt.
- Fine-tune for format compliance at volume, voice distillation, cost/latency at scale, or genuine domain priors. Never to fix missing knowledge, and never before the evals and examples exist.

## FAQ

**Can't fine-tuning teach the model our data so it answers from memory?**
It can, and you shouldn't want it to. Learned facts can't be cited, can't be permission-scoped, go stale silently, and are recited with unearned confidence. If the answer should come with a receipt — and almost every product answer should — the knowledge belongs in a retrieval layer, not the weights.

**How many examples do we need before fine-tuning is viable?**
For narrow format or classification tasks, a few hundred high-quality examples can be enough; for anything subtler, think thousands. But the binding constraint is usually evaluation, not training data: if you don't have an eval set that can tell v2 from v3, more training data just gives you a more confidently wrong antique.

**Is RAG obsolete now that context windows are huge?**
No — the economics and the permissions still favour retrieval. Stuffing a million tokens into every request is slow, expensive, and empirically degrades answer quality on the details in the middle. Retrieval is also how you enforce per-user access. Long context changed the chunking strategy, not the architecture.

**Should we fine-tune on user corrections?**
Eventually, carefully, and with consent — but corrections are more valuable sooner as evaluation cases and as retrieval improvements. A correction often signals a missing or mis-chunked document; fix that today rather than queuing it for a training run next quarter. Treat the correction stream as product feedback first and training data second.

**What about agents and tool use — where do they fit?**
They're orthogonal. An agent decides *what to do*; this framework governs how each step it takes gets its knowledge and behaviour. Agents mostly raise the stakes of everything above — a retrieval failure inside an autonomous loop is a wrong action, not a wrong sentence — which argues for doing the basics in the right order even more.
