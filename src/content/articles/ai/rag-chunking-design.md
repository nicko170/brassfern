---
title: "Chunking is a design decision: RAG retrieval craft"
description: "Chunk sizing, structure-aware splitting, metadata, hybrid retrieval and reranking — the retrieval engineering that decides whether your RAG feature answers or shrugs."
slug: rag-chunking-design
cluster: ai
tags:
  - RAG
  - Retrieval
  - AI architecture
date: 2026-07-08
author: Dev Khatri
keywords:
  - rag chunking
  - retrieval design
  - vector search ux
  - rag architecture
  - hybrid retrieval
readingTime: 12
---

Every RAG system has two products, and most teams only ship one. The visible product is the chat answer. The invisible product — the one that determines whether the visible one succeeds — is the retrieval pipeline. And inside that pipeline, the highest-leverage decision is chunking: how documents are cut into the pieces that get embedded, stored, fetched and stuffed into a context window.

Chunking is treated as a config default, a lambda you wrote in fifteen minutes with `chunk_size=1000, overlap=200`. Then the team spends months wondering why retrieval is "sometimes weird." This article is the craft version: the trade-offs, the structure-aware splitting, the metadata that earns its keep, and the reindexing plan you need *before* the corpus grows teeth. It builds directly on the war stories in [RAG pitfalls in production](/journal/ai/rag-pitfalls-production) and the measurement machinery from [evals are the new unit tests](/journal/ai/evals-practical-guide).

## Two failure modes, one slider

Chunk size is a trade-off between two failure modes, and you can choose which one you die of:

**Too small:** chunks lack context. The passage that answers the question got split across a paragraph boundary, and neither half is retrieving a coherent thought. You get answers that start confident and end vague, citations pointing to a fragment missing its qualifying clause. Classic symptom: the assistant half-answers and hedges.

**Too large:** chunks dilute relevance. The embedding of a 2,000-token chunk averages the topic of the whole passage, so a precise query retrieves a document where the answer is two sentences in a sea of boilerplate. The model then has to read 2,000 tokens to find 80, and context windows fill with noise; you pay for tokens that compete with the answer.

The practical answer is rarely one number. Our defaults, after several engagements: **300–600 tokens per semantic chunk, with parent-child structure** (more below) and structure-aware splitting. Then measure — don't argue. Chunk size is a parameter in your eval suite. Write retrieval-focused golden cases (the questions users actually ask, with the passages that should be retrieved) and sweep the sizes. We've had cases where 350 beat 800 by 12 retrieval-precision points and others where 800 won. The corpus decides, not blog posts.

## Split on structure, never on arbitrary character counts

The biggest single win in chunking craft is respecting document structure. Documents have skeletons — headings, sections, tables, list items — and the skeleton is *meaning*. Rules we enforce:

- **Never split inside a section.** Split at heading boundaries; a section is a coherent unit a human author already designed.
- **Never split a table.** Keep tables whole, convert them to compact plaintext or structured records, and give them their own chunks with a `type: table` flag. Splitting a pricing table at row 40 is how assistants quote the wrong tier.
- **Attach the heading path.** Every chunk carries its breadcrumb: `"Pricing > Team plans > Annual billing"`. The model reads the chunk in context instead of as an orphan sentence.
- **Pull out code into its own chunk type.** Code chunks have different retrieval dynamics — hybrid search with exact token matching matters far more than embeddings. A `def` signature should be findable by name, not by semantic vibe.

Structure-aware splitting is unglamorous work — parsers for HTML, Markdown and PDF that understand your specific sources. It is also, in our experience, worth more than any model upgrade. When we built retrieval over planning documents for the [Meridian Climate data explorer](/work/meridian-climate-data-explorer), moving from fixed-size splitting to section-aware splitting improved answer-groundedness scores from 71% to 89% with zero model changes. The model wasn't the bottleneck. The knife was.

## Metadata that earns its keep

Metadata is retrieved beside the chunk — it's how you filter, rank and attribute. The trap is hoarding metadata because you might need it; unused fields rot and nobody trusts the index. Metadata that consistently earns its retrieval slot:

- `source` / `url` — attribution. Non-negotiable; it powers the citation design we detail in [showing the AI's working](/journal/ai/citation-design-ai-features).
- `heading path` — the breadcrumb, as above.
- `doc type` — policy, guide, API reference, marketing page. Enables scope filters ("never answer legal questions from marketing copy") and reranking boosts.
- `updated at` — freshness-aware reranking. Stale chunks are a trust bomb; two sources disagreeing because one is two releases old is worse than no answer.
- `tenant` / `locale` — hard isolation rows. Security metadata, not UX metadata.

The litmus test for keeping a field: name the query or filter that currently uses it. Can't? Delete it from the index; you can always reindex.

## Hybrid retrieval: BM25's revenge

Pure vector retrieval has a well-known blind spot: exact strings. Product SKUs, error codes, function names, medication dosages — queries where the right answer is determined by tokens, not meaning. Embedding models paraphrase these away with confidence. The production fix is **hybrid retrieval**: run BM25 (or a modern lexical equivalent) and vector search in parallel, then fuse the results — reciprocal rank fusion is the standard, boring, effective answer. Lexical catches "ERR_4093" and "Paracetamol 500mg"; embeddings catch "my payment failed" and "drowsiness side effects."

If your corpus contains identifiers people will quote verbatim, hybrid isn't a nice-to-have, it's the baseline. We cover the UX side of this — what to do when both retrieval paths fail — in [when the model fails](/journal/ai/llm-failure-fallback-ux).

## The reranking step everyone defers

After hybrid fusion retrieves 40 candidates, a cross-encoder reranker scores query-vs-chunk pairs properly — slower than bi-encoder embeddings, but dramatically better at ordering. Then you take the top 5–8 into the prompt. In every engagement where we measured it, a reranker improved end-to-end answer quality more than any change to the LLM integration. It is the most skipped step in RAG because the demo looks fine without it. The demo is lying; the tail of real queries is where it earns its keep.

## Chunked once is chunked forever: plan the reindex

The hidden cost of chunking decisions is that they're stamped into production data. Your 40,000-document index is a frozen artifact of a parser you wrote in week one. When (not if) you want to move to parent-child chunking or add a metadata field, you're doing a **reindexing migration** — exactly analogous to a database schema migration, and it deserves the same planning:

- **Store raw documents, derive chunks.** The corpus of originals is the source of truth; the index is a build artifact. If you can't rebuild the index from stored sources plus a versioned parser, you're one bad migration from irreversibility.
- **Version the pipeline.** `chunker_v3` should be a value in the index, not a hope. Mixed-version indexes make retrieval debugging miserable.
- **Dual-read during migration.** Stand up the new index alongside the old, eval both against the golden retrieval set, then cut over — the same posture as [model migration without breakage](/journal/ai/model-migration-without-breakage). Reindexing mid-flight on 40k documents takes hours on one machine; plan for it as a background job with progress, not a maintenance window.
- **Eval before, eval after.** Retrieval golden sets turn reindexing from an anxious rebuild into a comparison with a score.

## The retrieval UX contract

Finally: retrieval quality is a UX property, and design has tables. Deciding to retrieve 8 chunks max, with dedupe by source document, with a freshness floor, is a design conversation about what the answer surface can support. The citation rail, the "based on these three documents" line, the refusal behaviour when retrieval confidence is low — these are where the pipeline meets the user. Engineers decide *what* can be retrieved; design decides how the user learns to trust or distrust it. Do both sides in the same sprint review or neither will survive contact with the other.

We've put this philosophy to work repeatedly through our [AI products practice](/services/ai) — the boring, load-bearing retrieval work is exactly where we start.

## Key takeaways

- Chunk size trades context coverage for relevance dilution. Default 300–600 tokens, structure-aware; then sweep on a retrieval golden set — the corpus decides.
- Split at section boundaries, never inside tables or code, and attach the heading path to every chunk.
- Hybrid retrieval (lexical + vector, rank-fused) is baseline wherever users quote identifiers verbatim.
- A cross-encoder reranker is the highest-leverage step most teams skip.
- Store raw documents and version the chunking pipeline; reindex like a database migration, with dual-read and evals both sides.

## FAQ

**Isn't parent-child chunking worth using everywhere?**
Mostly, yes — retrieve the small child, send the surrounding parent context to the model. But it costs you index size and ingestion complexity. On corpora under ~10k documents with short sections, plain structure-aware chunks are indistinguishable in evals and simpler to run.

**How do I know my chunking is the problem and not the prompt?**
Instrument retrieval separately. Log the retrieved chunks per query (with scores) alongside the final answer. When a bad answer has the right passage in the top 5, it's a prompt/context problem. When the right passage never appears, it's retrieval — and nine times out of ten, structure-blind chunking.

**Should we use asymmetric embeddings or different models for queries vs documents?**
Worth evaluating once your pipeline is stable. Query-document asymmetry helps on large corpora; on the 5–50k document scale most products live at, good hybrid retrieval plus a reranker closes most of the gap at a fraction of the cost.

**When do we reindex on a schedule vs on change?**
On change. Reindexing should be triggered by pipeline version bumps and source updates, not a cron. A scheduled full reindex mostly hides staleness bugs; an event-driven pipeline forces you to build the freshness story properly.
