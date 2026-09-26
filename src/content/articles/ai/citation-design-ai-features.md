---
title: "Citation design: showing the AI's working"
description: "Citations are how AI answers earn belief. Inline sources, confidence without fake precision, expandable evidence, link rot, and how provenance UI measurably builds trust."
slug: citation-design-ai-features
cluster: ai
tags: [ai ux, citations, rag, provenance, trust]
date: 2026-09-10
author: Leonie Marsh
keywords: [ai citation design, rag source attribution, ai provenance ux, trust signals ai answers]
readingTime: 10
heroImage: /images/articles/ai/citation-design-ai-features.jpg
heroAlt: "A stack of fern-green and cream index cards with brass clips and numbered tabs, beside a brass loupe resting on ruled paper with a pressed fern frond."
---

An AI answer without a citation asks for faith. An AI answer with a good citation asks for nothing — it hands you the receipt and lets you decide. The difference sounds philosophical until you watch support tickets: teams shipping retrieval-grounded assistants see their "the AI made this up" complaints collapse not when the model improves, but when the provenance becomes visible. Users stop arguing with the machine and start checking its sources, which is exactly the behaviour you want. Verification is healthy. Faith isn't.

We covered the trust case for provenance in [Designing AI features users can trust](/journal/ai/ai-trust-design); this is the companion manual for the interface itself — what a citation is, how it should behave, and the unglamorous details (rot, drift, partial evidence) that separate a trust-building citation from a decorative "Sources: 3 links" footer that fools no one.

## A citation is a claim-to-source mapping, not a link list

The common failure: an answer, then a row of generic sources at the bottom. This claims nothing checkable. If the answer says the battery lasts 14 hours and the footer lists the product manual among five links, the user still has to dig — and if the claim came from a retrieval hallucination, the footer *launders* it with borrowed credibility. A citation that can't be traced to a specific claim is worse than none, because it converts uncertainty into false confidence.

The working unit is claim-level: this sentence, supported by this passage, in this document. When we build it, citations are structured data — each atomic claim in the answer carries a reference to a retrieved chunk, with the chunk's document, location and exact text. As we argued in [structured outputs](/journal/ai/structured-outputs-reliable-ui), citations belong in the schema as first-class fields, not glued on afterwards. If your pipeline can't say which chunk a sentence came from, the honest answer isn't to hide it — it's to not cite, and to mark the claim as generative.

## The three-tier citation pattern

The interface pattern we've converged on is a graduated commitment: reveal expense scales with user doubt.

**Tier 1 — the inline marker.** A small numbered or dotted reference attached to the claim, in the flow of text. Quiet, monochrome, positioned as superscript or end-of-sentence. It must not compete with the prose; its only jobs are to signal "this is backed" and to offer a destination. Markers need a visual rule for *which* claims get them: every verifiable factual claim, or none at all. Citing some facts and not others within one answer teaches users that uncited means invented — sometimes true, sometimes not, always confusing.

**Tier 2 — the hover/focus preview.** Activating a marker reveals the evidence card: the exact passage used, the document title, and when it was last updated. The passage is the point — users should be able to verify the claim *without leaving*. Keyboard-accessible, dismissible, and it must quote real retrieved text, not a model-paraphrased summary of it. (We count paraphrased "previews" as mis-citation: the model rewriting evidence is just a second, smaller hallucination surface.) On touch, where hover doesn't exist, this becomes a bottom sheet; on web, a well-behaved popover that doesn't fight with scroll.

**Tier 3 — the full source.** One more step: the document itself, opened at the relevant section, ideally scrolled and highlighted to the passage. If your document viewer can't deep-link to the evidence, the citation chain ends one hop early — and heavy users (lawyers, clinicians, analysts) will notice the break. Deep-linking sources is engineering work that users experience as integrity.

## Confidence registers, not percentages

Answers mix retrieval quality. One claim comes from ten corroborating chunks; another from a single paragraph in a prospectus from two years ago. Communicating this is necessary; communicating it as "72% confident" is fake precision that users can't calibrate, as we argued in the [trust piece](/journal/ai/ai-trust-design).

What works: confidence expressed through the citation UX itself. A claim with strong corroboration gets a normal marker and a preview showing "Supported by 4 sections across 2 documents". A claim resting on thin evidence gets a visibly different, muted marker with a preview that says so: "Based on a single source: the 2024 pricing prospectus." The user reads the epistemic status from the weight of the evidence, the way a reader of a well-edited newspaper feels the difference between "according to four officials" and "according to one person familiar with the matter". Prose beats percentages.

## The unglamorous parts: rot, drift, gaps

Citations decay like everything else on the web. Three maintenance disciplines:

**Link rot for external sources.** Archive or snapshot what you cite at answer time (we store the passage text itself, which doubles as the preview), treat dead links as a logged defect class, and re-crawl your top-cited sources on a schedule. A citation to a 404 is a broken promise with a timestamp.

**Corpus drift.** The underlying documents change — prices update, policies are retired. An answer generated last month may cite a chunk that no longer says what it said. This is another argument for archiving the passage text at answer time, *and* a case for staleness stamps: "Source updated 12 June; this answer generated 8 August." Users forgive staleness when it's dated. They don't forgive discovering it themselves.

**The honest gap.** When retrieval returns nothing useful, the citation layer has its hardest job: saying "I don't have a source for this." We design an explicit no-evidence state — a labelled "unverified answer" treatment, visually distinct (a thin rule, a quiet label, our [empty-state discipline](/journal/product/empty-states-design) applied to epistemics). The alternative — answering without acknowledging the missing ground — spends exactly the trust the citations were earning.

## Measuring that citations work

Provenance should pay rent in metrics, or it's decoration. The set we instrument:

- **Citation open rate** — early in a user's life with the feature, high open rates are healthy curiosity. Watch the *trend*: sustained high rates mean trust never formed; collapse to zero in week one means either instant trust (rare) or learned futility (the previews didn't help, so users stopped trying — check session replays before celebrating).
- **Dispute rate on cited claims** — "that's wrong" feedback split by cited vs uncited. If cited claims attract as many disputes, your citations aren't checkable enough to be believed.
- **Correction-after-citation** — users who open a citation then correct the AI are gold: engaged verifiers. Their corrections feed the [eval set](/journal/ai/evals-practical-guide) with real, hard examples.
- **Escalation quality** — in products with human backup, cited answers that still escalate produce far richer support conversations ("the manual says X but the invoice says Y"). Track it as a positive signal, not a failure.

## Key takeaways

- Citations are claim-level mappings, not source footers. If a sentence can't be traced to a chunk, mark it generative rather than launder it.
- Three tiers: quiet inline marker, quoted-passage preview, deep-linked full source. Never paraphrase the evidence in the preview.
- Express confidence through evidence weight — "supported by 4 sections" vs "based on a single source" — never fake percentages.
- Archive cited passages, re-crawl top sources, stamp staleness. Dead and drifted citations break promises with timestamps.
- Design an explicit "no evidence" state; the honest gap preserves the trust everything else earned.
- Instrument open rate trends, cite-vs-uncited dispute splits, and correction-after-citation — or admit the citations are decorative.

## FAQ

### Do inline citations clutter the reading experience?

Done loudly, yes. Done at the right visual weight — small, monochrome, end-of-claim — they behave like quality typography: noticed when needed, invisible otherwise. In testing, users report cited answers as *cleaner*, because the apparatus of trust is orderly.

### Our RAG pipeline attributes answers to documents, not chunks. Is that enough?

It's the thin version: it gets you truthful footers but not claim-level verification. Chunk-level attribution usually means tightening the retrieval side — see our field notes on [RAG pitfalls](/journal/ai/rag-pitfalls-production). Until you have it, cite documents and label answers as summaries rather than claiming line-level sourced truth.

### Should uncited generative claims be visually flagged?

Yes, consistently. One system of meaning per product: cited = grounded, flagged or plain = generative. The moment users can't tell which register they're reading, the citation layer stops teaching them anything.

### What do we do when sources conflict?

Show the conflict. Two citations and one sentence: "Sources disagree — the 2025 manual states 14 hours; the 2026 FAQ states 10." Models will happily average contradictions into fiction; the citation layer's job is to surface the disagreement as a fact about the world.
