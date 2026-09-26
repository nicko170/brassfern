---
title: "Citation design: making RAG answers checkable"
description: "Citations only work if they're checkable: claim-to-chunk mapping, snippet fidelity tests, anchor UX, and what to do when the source contradicts the summary."
slug: citation-ux-rag
cluster: ai
tags: [ai ux, citations, rag, retrieval, verification]
date: 2026-07-22
author: Felix Brandt
keywords: [citation ux, rag interface design, source grounding ux, ai answer verification]
readingTime: 11
heroImage: /images/articles/ai/citation-ux-rag.jpg
heroAlt: "Typed pages in fern-green ink with hand-drawn lines connecting underlined sentences to brass-clipped evidence cards, laid out on cream paper with a brass ruler and a pressed fern frond."
---

Leonie wrote the trust case for citations in [Citation design: showing the AI's working](/journal/ai/citation-design-ai-features) — what the interface owes the user. This is the article about what the pipeline owes the interface. Because here's the uncomfortable truth we keep finding in audits: most RAG citations are decorative. The answer cites a document, but not the passage. The passage is cited, but the quote doesn't appear in it. The quote appears, but says the opposite of the claim. Three layers of "good enough", and the user who actually checks — your most valuable user — discovers the citations are theatre.

Checkable is the standard. Not "there is a link", but "a motivated user can verify this claim in under ten seconds, and the system knows when they can't". This piece covers the four mechanics that get you there: claim-to-chunk mapping, snippet fidelity, anchor UX, and the disagreement protocol.

## Claim-to-chunk mapping is a data problem first

Every atomic claim in a grounded answer needs provenance recorded *during generation*, not inferred afterwards by string-matching the answer against the corpus. The reliable shape we've used across three retrieval products now: the model emits claims as an array, each with a `text` field and a `chunkIds` field pointing at the retrieved chunks it relied on. The citations are part of the output contract — as we argued in [Structured outputs: making LLMs renderable](/journal/ai/structured-outputs-reliable-ui), anything you want to render should be in the schema.

Two practical notes from building this:

**Let the model point at chunks, never at documents.** Chunk IDs are cheap to validate (they exist in the retrieval set or they don't — a hallucinated ID is caught at render time and downgraded). Document-level citations are unverifiable mush: a 40-page PDF "cited" for one sentence is a citation in name only.

**Plan for one claim, many chunks.** Real answers synthesise: "Plan renewals rose 12% while trial conversions fell 4%" draws on at least two sources. If your schema forces one chunk per claim, the model will either pick one arbitrarily (mis-citation) or split the claim awkwardly. Arrays of chunk IDs, rendered as grouped markers, solve it.

The anti-pattern that keeps resurfacing: post-hoc citation injection, where a second pass inserts footnote numbers into fluent prose. It reads beautifully and verifies terribly, because the citing model never saw the generation context. Cite at write time or don't cite.

## Snippet fidelity: the property you can actually test

A citation is only checkable if the evidence the UI shows *is* the evidence the model used. We define snippet fidelity as a measurable property: the quoted passage displayed in the citation popover must be a verbatim substring of the retrieved chunk as stored at answer time, not a paraphrase, not a re-summary, and not a fresh fetch of the document.

That last clause matters more than it sounds. Serving "the current document text" instead of the archived passage means your citation drifts with the corpus — the source gets edited, your preview changes, and a claim that was true in June quietly becomes unsupported in September while the UI keeps confidently underlining it. Store the passage text against the answer record. It costs bytes and buys integrity.

Fidelity is a test, not a hope. We add a CI check and a production canary:

- **Substring test:** every displayed snippet is a normalised substring of its stored chunk. Runs in the eval harness; failure rate above zero blocks release.
- **Canary audits:** a scheduled job replays a sample of recent answers and recomputes fidelity against the stored chunks. Catches drift from pipeline changes — someone switching chunkers, a new cleaner silently rewriting whitespace, an "optimisation" that re-summarises passages.

When we first added the substring test on a support-assistant build, 6.4% of citations failed — the model had helpfully "cleaned up" quotes it emitted for previews. Neither the PM nor the design team had noticed, because paraphrased snippets *read* fine. That's exactly why fidelity can't be a design concern alone. Six percent is not a rounding error; it's one user in sixteen learning not to trust your checkmarks, and they don't file a ticket about it — they just stop checking, and then stop believing.

## Hover vs side panel: it's an information-density question, not a taste question

We've built the citation surface three ways and have opinions now.

**Hover popover / focus card** wins for short passages in long-form answers — knowledge assistants, inline research summaries, the pattern in our [Pylon Care demo](/lab/pylon-care-assistant). It's fast, keeps reading position, and supports the scan-and-continue rhythm of expert users. Its limits are hard: passages beyond ~60 words overflow, and on touch devices hover doesn't exist, so the popover becomes a bottom sheet with very different ergonomics. If you design hover-first and retrofit touch, the mobile experience always feels like a tax.

**Side panel** wins when sources are long, numerous, or the verification *is* the task — legal research, clinical references, compliance review. The answer and the evidence sit side by side; clicking a marker scrolls the panel to the passage and highlights it. The cost is layout: on a 1280px laptop, a persistent evidence panel eats 35–40% of the answer's breathing room. We default it collapsed and remember the preference per user; heavy verifiers pin it open and never look back.

**Inline evidence blocks** — the passage rendered inside the answer flow, expandable — is the pattern we reach for least and respect most in the right context: reports, audits, anything that will be printed or forwarded. A forwarded side panel cites nothing. An inline block survives copy-paste.

The honest rule: hover for reading products, side panel for verification products, inline for documents that travel. Mixing all three in one product is a smell that nobody decided what the answer *is for*.

## The disagreement protocol: when the source says otherwise

The hardest case in citation UX is not a missing source. It's a present source that contradicts, qualifies, or only weakly supports the claim. Retrieval gives you a chunk that *mentions* the topic; generation turns the mention into an assertion. The snippet is verbatim, the link works, and the citation is still a lie of emphasis.

You need a protocol, not a hope that the model won't do this:

1. **Detect cheaply, distrust cheaply.** Run a lightweight entailment check — does the cited passage support the claim as stated? A small classifier or a second cheap model call scores each claim/chunk pair. Treat anything below threshold as *flagged*, not failed: the goal is routing, not silence.
2. **Downgrade, don't delete.** A flagged claim still renders, but the marker changes register (the muted/dotted treatment from the three-tier pattern) and the preview leads with the honest framing: "Related source — may not fully support this statement." Users who check get the raw material to judge. Users who don't check at least weren't shown a confident green tick on shaky ground.
3. **Log everything.** Flagged pairs are the highest-value rows in your corpus: they are exactly the failure mode your [golden eval set](/journal/ai/golden-eval-sets-support-tickets) should grow by. We pipe them into the eval backlog with the claim, chunk, entailment score and the user correction when one follows.

One more edge case worth naming: **stale agreement**. The source agreed with the claim *when the answer was generated*, and the document has since been updated to disagree. This is corpus drift with teeth — the archived passage you (correctly) stored now contradicts the live document a verifier will open. The fix is the staleness stamp plus a re-check: when a cited document changes, re-run fidelity and entailment against recent answers citing it. If the answer no longer holds, either expire it or annotate it. We built this re-check pipeline for a [health client's triage content](/work/beacon-health-ai-triage) because in regulated domains "the answer was true in August" is not a defence anyone wants to make.

## What we measure

Checkability should move numbers or it's ornamentation:

- **Verifiable claim rate** — claims with a chunk mapping ÷ factual claims in sampled answers. Below ~85% on a retrieval product, your grounding is leaky.
- **Snippet fidelity rate** — the substring test in production. Target is boring: 100%. Anything less is a bug class, not a metric to "improve".
- **Entailment pass rate** — share of claim/chunk pairs above the support threshold. This is the honest composite of your retriever and your prompt.
- **Dispute ratio, cited vs uncited** — if users dispute cited claims at the same rate as uncited ones, the citations aren't earning anything. On a recent launch this gap was 4.2× in week one and widened to 6× by week eight as users learned the markers meant something.

None of this requires exotic infrastructure. It requires deciding that a citation is a promise with a verification path, and building the four boring mechanisms that keep the promise true.

## Key takeaways

- A citation is checkable or it is decoration. Store claim-to-chunk mappings at generation time, as structured output — never infer provenance afterwards.
- Snippet fidelity is testable: the displayed passage must be a verbatim substring of the archived chunk. Test it in CI, canary it in production, archive passages at answer time.
- Choose the citation surface by task: hover for reading products, side panel for verification-heavy work, inline blocks for documents that travel.
- Write a disagreement protocol before launch: detect weak support, downgrade the marker instead of hiding the claim, and pipe flagged pairs into your eval backlog.
- Re-check cited answers when source documents change. Stale agreement is how true answers become liabilities.

## FAQ

**Do claim-level citations slow generation noticeably?**
Slightly — emitting claim objects with chunk references costs extra output tokens, typically 15–25% more than freeform prose with footnotes. Streaming the claims as they complete (each claim renders when its object closes) keeps perceived latency flat, which is the number users actually feel.

**Which entailment model should we use for the support check?**
Whatever scores fast and cheap at your volume. A fine-tuned small classifier on your own flagged pairs outperforms a general-purpose LLM judge within a few hundred labelled examples — and you already have the [eval discipline](/journal/ai/llm-evals-framework) to measure whether it's helping.

**How many sources per claim is too many?**
Past three chunks per claim, the preview card becomes a list and users stop reading. If a claim genuinely needs four sources, the claim is probably two claims. Split it.

**Should users be able to report a bad citation separately from a bad answer?**
Yes, and make it one tap on the evidence card. Citation-specific reports are cleaner training data than answer-level "thumbs down", because they tell you the grounding failed even when the answer happened to be right.

**Does any of this change for multi-modal sources?**
The contract is identical — claim, verbatim evidence, timestamp — but the "snippet" becomes a frame range, a table region or an audio segment. Budget real design time for those previews; a text-only citation bolted onto a video corpus convinces no one.
