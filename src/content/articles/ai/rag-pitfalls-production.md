---
title: "RAG pitfalls we hit so you don't have to"
description: "Retrieval in production humbles everyone. The chunking trade-offs, citation bugs, stale knowledge and eval failures that taught us how RAG actually breaks."
slug: rag-pitfalls-production
cluster: ai
tags: [rag, retrieval, vector search, llm, ai engineering]
date: 2025-06-24
author: Felix Brandt
keywords: [rag pitfalls, retrieval augmented generation, vector search production, rag evaluation, chunking strategies]
readingTime: 9
---

Retrieval-augmented generation has the best demo-to-production ratio of any technology I have shipped. The demo takes an afternoon: chunk some docs, embed them, stuff the nearest matches into a prompt, watch the model answer questions about your data like it wrote the data. Then production happens, and you spend the next year discovering that the demo was showing you the *easy* 60% and the remaining 40% is where products live or die.

This is a tour of the pits we have fallen into across RAG engagements — in support tooling, internal knowledge, and document-heavy products like the [Northwind Ledger](/work/northwind-ledger-dashboard-rebuild) reporting assistant. Every pit is described from personal experience of the bottom of it.

## Pit 1: chunking by vibes

Everyone's first ingestion pipeline splits documents every 512 tokens with 10% overlap, because that's what the tutorial did. It's also how you get chunks that begin mid-table, sever a clause from its negation ("…does *not* apply to annual plans" split after "does"), and orphan the heading that gives a paragraph its meaning. Retrieval then confidently surfaces half a rule.

What actually works: **chunk on document structure first, size second**. Headings, sections, list boundaries, table blocks. Keep each chunk self-describing — we prepend a breadcrumb ("Refund policy › Quarterly plans › Exceptions") to every chunk before embedding, which costs a few tokens and fixes a whole class of "right words, wrong context" retrievals. Overlap matters less than everyone says if your cuts land on semantic boundaries; it matters enormously if they don't. And tables almost never survive naive chunking — extract them as structured rows and retrieve them as data, not prose.

## Pit 2: believing the vector is the search

Pure vector search fails silently on the queries that matter most: part numbers, error codes, names, dates, legislation references. Embeddings are about *meaning*, and "INV-20417" has no meaning — it's a string. Users type strings. The answer is boring and old: **hybrid retrieval**. A lexical index (BM25, or even Postgres full-text search) alongside the vector index, results merged by rank, and — if your query volume justifies it — a small reranker scoring the top 20. Every time we've added lexical search to a pure-vector system, a batch of long-standing "the assistant can't find the obvious thing" tickets quietly closed.

One warning: hybrid makes evaluation harder, because now you have two dials and a merge weight. Which brings us to the next pit.

## Pit 3: evaluating the answer when the retrieval failed

The classic RAG eval mistake: you eyeball final answers, see wrong ones, and start tuning the prompt. But a RAG system fails in two different places — retrieval can miss, or generation can mangle a perfectly good context — and the fixes are in different codebases. If you only ever look at final answers, you can't tell which is happening.

We instrument the pipeline at the seam: **recall@k against the golden set**. For each eval question we label which chunks *should* be retrieved, then measure whether retrieval surfaced them before generation ever runs. This produces the most useful diagnosis in RAG: "right chunk, wrong answer" (fix the prompt or model) versus "wrong chunk, right answer" (your eval question is ambiguous) versus "wrong chunk, wrong answer" (retrieval problem). On one engagement, 70% of the failures the client had blamed on "the AI" were retrieval misses with a single cause — their documents used internal codenames that never appeared in user questions. A synonym map at query time, not a prompt, fixed it. This is exactly why [evals belong before features](/journal/ai/llm-evals-framework), and for RAG specifically, why the eval set needs retrieval labels, not just expected answers.

## Pit 4: the citation is decorative

Everyone ships source citations; nobody checks them, and so citations rot into theatre. Two failure modes recur. **Misattribution**: the model quotes chunk A but the UI cites chunk B because the mapping between retrieved order and cited index drifted after a prompt edit. **Hallucinated support**: the model asserts something that is in *no* chunk, and the citation points at a plausible-sounding neighbour.

Fixes that actually hold up in production: cite by stable document ID, not position; require the model to quote the supporting span, and programmatically verify that the quoted span exists in the retrieved context before the UI renders a footnote. If it doesn't, the answer ships without the citation and the trace gets flagged. It sounds strict. It is strict. A citation the user learns not to trust is worse than none — it teaches them the whole interface is set dressing.

## Pit 5: the index is a garden, and nobody is gardening

Launch day everyone cares about ingestion. Month four, the index is a swamp: deleted documents still retrievable because deletion wasn't propagated to the vector store; the old pricing page outranking the new pricing page because both are indexed and the old one embeds better; a draft policy that was indexed from a shared folder nobody realised was in scope.

The operational rules we now write into every RAG engagement:

- **Single ingestion spine.** Every source flows through one pipeline with one document registry. No side-channel uploads.
- **Lifecycle as code.** Deletes and updates propagate to *all* indexes within a defined window, and there's a reconciliation job that diffs the source of truth against the index and reports drift.
- **Freshness is queryable.** Every chunk carries source timestamps, and retrieval can prefer newer documents — especially for anything with prices, dates or policies, where the freshest wrong answer is still wrong.
- **Scope audit before ingestion.** The folder full of drafts is always in scope until someone checks.

Think of it as the knowledge-base version of content ops — the same discipline a good editorial platform needs, like the archive work behind our [museums project](/work/postcards-museum-archive), except here the readers are machines and they never notice when the collection rots.

## Pit 6: ingesting the kitchen sink

"A polymath is just a person who's bad at saying no" applies to indexes too. Teams ingest everything — wikis, Slack exports, PDFs of scanned faxes — because more knowledge feels like more capability. It's more noise. Retrieval precision drops as the index fills with near-duplicate, low-quality documents, and the model starts citing the deprecated 2023 onboarding doc because it exists and it's similar.

Start narrower than feels comfortable. Curate the corpus like a product surface: for each source, ask what question a user could ask for which this is the *best* evidence. If the answer is "none, but it exists", it doesn't go in. You can always expand a respected corpus; you can rarely shrink a distrusted one. And when the question the user asks has no good evidence in the corpus at all, the correct behaviour is a retrieval-confidence floor that triggers an honest "I don't have a reliable source for that" — scoped tasks and honest sentences, the same principle as every other [LLM feature we ship](/journal/ai/shipping-llm-features).

## The debugging workflow that ties it together

When a bad answer lands, we replay one question through four gates: was the right chunk labelable (is the answer even in the corpus)? Was it retrieved (recall at the seam)? Was it quoted (citation verification)? Was it used (does the answer follow the quote)? Ninety percent of production issues fail at exactly one gate, and knowing which one turns a week of prompt superstition into an afternoon of engineering.

## Key takeaways

- Chunk on document structure before size; make every chunk self-describing with a heading breadcrumb, and pull tables out as data.
- Hybrid retrieval — lexical plus vector — closes the part-number and codename blind spot that pure embeddings never will.
- Measure recall at the seam between retrieval and generation, not just final answers; most "AI failures" are retrieval misses.
- Verify every citation programmatically against the retrieved context, or don't show one.
- Treat the index as a product surface: one ingestion spine, lifecycle as code, freshness timestamps, and the discipline to leave things out.

## FAQ

**Do we need a dedicated vector database?** Usually not at first. Postgres with pgvector, or even your existing search platform with a dense-vector field, carries most products to meaningful scale. Buy the dedicated system when you have a measured reason — latency at your recall target, index size, filtering complexity — not a vibes reason.

**How big should chunks be?** Big enough to be self-contained, small enough that two different answers rarely share one. In practice that's often 150–400 tokens for prose with breadcrumbs, but let your recall evaluation decide rather than folklore: try three sizes, measure, keep the winner.

**When is RAG the wrong answer entirely?** When the corpus is small and stable enough to fit in context (just put it in the prompt), when the task needs reasoning *across* the whole corpus rather than retrieval from parts of it, or when you actually need structured queries over structured data — that's a database wearing a costume.

**What's the first thing to instrument?** The seam. Log which chunks were retrieved alongside every traced generation, with scores. You cannot fix what you replay from memory. [Full production checklist here](/journal/ai/shipping-llm-features).
