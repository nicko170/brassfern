---
title: "Onboarding for AI features: sell the p50, not the demo"
description: "AI onboarding fails when it promises the demo's best-case output. Design first-run flows around median performance — calibrated examples, honest scope, progressive trust."
slug: ai-onboarding-expectation-setting
cluster: ai
tags: [ai, onboarding, expectation setting, empty states, trust]
date: 2026-08-04
author: Dev Khatri
keywords: [AI onboarding, expectation setting, empty states, LLM UX, first run experience, trust calibration]
readingTime: 11
---

Every AI feature ships with two versions: the one in the demo video and the one users meet on a Tuesday with their own messy data. The demo shows the p95 output — the run where the retrieval was clean, the prompt was refined over four takes, and the model happened to be brilliant. The user gets the p50, and the gap between the two is where trust goes to die.

We've shipped onboarding for AI features across support triage, financial dashboards and document tools, and the pattern is constant: **onboarding calibrated to the demo produces a spike of activation followed by a cliff of abandonment.** Onboarding calibrated to the median produces slower adoption that actually sticks. This piece is about designing the second kind. It builds on the flow-level work in [onboarding users to an AI assistant](/journal/ai/ai-assistant-onboarding) and zooms in on the expectation-setting layer most teams never design at all.

## Expectations are a design material

In deterministic software, onboarding teaches *where things are*. In AI products, onboarding's real job is setting the user's internal probability distribution — what will this do, how often will it be good, what does "good" even look like here. Get that distribution right and even mediocre outputs land as "about what I expected, let's iterate." Get it wrong and the same output reads as betrayal.

The first-run experience is where that calibration happens, and there isn't a second chance at it. Users form their model of an AI feature in the first three or four interactions, and — this is the brutal part — they update asymmetrically. One fluent, confident, wrong answer early on costs you more trust than five good answers earn. The onboarding flow is your only controlled environment: use it to teach the failure shape before users meet it in the wild.

## Sell the p50: examples calibrated to median outcomes

The standard move is to seed the empty state with example prompts that produce the most spectacular outputs the team has ever seen. This feels like good marketing and is terrible onboarding. The user's first result will be compared against that example, and the median result always loses.

Our rule on every [AI engagement](/services/ai): **every example in onboarding must be achievable on the user's real data at p50 quality.** Not p90, not the run we screenshot for the case study. That means:

- **Test examples against messy inputs, not curated ones.** Pull the ugliest real-world data the feature will face — truncated records, inconsistent naming, missing fields — and only keep examples that still produce a useful result. If an example only shines on clean demo data, it's a demo asset, not an onboarding asset.
- **Show the good-enough output, not the perfect one.** In worked examples, include the kind of output a user would act on after one edit. This does double duty: it calibrates quality expectations and it teaches the "draft, then edit" working relationship that makes AI features valuable in practice.
- **Write examples for jobs, not tricks.** "Summarise last week's support tickets by theme" teaches a job. "Write a sonnet about your refund policy" teaches that the feature is a toy. Users generalise from examples with frightening literalism — we've covered the syllabus side of this in [teaching what the AI can do](/journal/ai/ai-feature-discovery-education).

On the [Beacon Health triage work](/work/beacon-health-ai-triage), we deliberately built the onboarding examples from the blandest, most common cases rather than the dramatic ones. Clinicians trusted it faster precisely because nothing about the first run felt like a magic trick. (The numbers in that case study are illustrative; the trust pattern is one we've now seen across four separate products.)

## Preview the failure modes before users meet them

This is the part nobody wants to ship, because it feels like admitting weakness. It's the opposite. Stating scope limits and failure shapes up front reads as confidence, and it pre-empts the trust-destroying moment of discovering them alone.

Concretely, we design three things into every AI onboarding:

**A scope sentence near the input, permanently.** "Answers from your help centre, updated nightly." One quiet line that says what the feature reads and what it can't see. Users rarely read modals, but they absorb text that sits next to the thing they're using. This also survives model upgrades — the scope statement is about data, not capabilities.

**A named failure tour in place of a capability list.** Don't enumerate what the AI can do; show what it looks like when it can't. A single worked example of a refusal done well — "I can only see your invoices from March onwards; for older records, export them here" — teaches scope, honest refusal, and the recovery path in one screen.

**The draft contract.** Say explicitly that outputs are starting points: "Everything here is a draft until you send it." This one line licenses the editing behaviour that makes the feature valuable and inoculates against the disappointment of non-perfect output. It's also honest — the failure states we design in [when the model fails](/journal/ai/llm-failure-fallback-ux) all assume the user knows it's a draft. Onboarding is where they learn that.

## Progressive trust ladders

Trust in an AI feature isn't earned in a moment; it's a sequence of progressively larger delegations. Good onboarding choreographs that sequence instead of leaving it to chance.

Structure the first-run flow as a ladder:

1. **Rung one: a task that always works.** The feature's highest-success-rate capability on the user's own data, pre-wired. The goal of the first interaction is not delight — it's a correct, boring, useful result.
2. **Rung two: a task with visible working.** Something that shows citations, sources or steps, so the user learns *how* the answer was made. Visible provenance builds calibrated trust faster than invisible accuracy.
3. **Rung three: a task the user edits.** Deliberately end onboarding with an output the user improves. Editing is the behaviour you want long-term, and a first session that ends with "I made this better" ends with ownership, not scepticism.

The anti-pattern is onboarding that front-loads the most impressive capability. Impressive is usually the lowest reliability, and you're spending your one controlled environment on a coin flip.

## Copy that survives model upgrades

A final, unglamorous point: onboarding copy rots. Capabilities change with every model swap, and any onboarding text that names specific behaviours ("I can draft replies in your tone!") becomes a lie one upgrade later — in either direction. We watched one client's onboarding quietly undersell a feature for months after a model upgrade made it dramatically better; nobody owned the copy.

The durable approach: anchor onboarding copy to **data and jobs**, not model capabilities. "Ask questions about your bookings inbox" survives any backend change. Keep capability claims to what your [evals](/journal/ai/evals-practical-guide) currently prove, and route any capability claim in onboarding through the eval suite the way you'd route a claim through legal. If the eval for "summarisation beats extractive baseline by X" regresses on migration day, the onboarding prompt referencing it should fail a build-time check. Treat onboarding copy as a system output, not marketing static text — the migration discipline in [swapping models without breaking the product](/journal/ai/model-migration-without-breakage) applies to the words too.

## Key takeaways

- Onboarding calibrated to the demo's best output manufactures disappointment at scale. Calibrate every example and claim to median performance on real, messy data.
- Users update trust asymmetrically — one confident wrong answer outweighs five good ones. Teach the failure shape in the controlled environment of onboarding, not in production.
- State scope near the input permanently, name failure modes in place of capability lists, and establish the "everything is a draft" contract on day one.
- Structure first-run as a trust ladder: reliable success, then visible working, then an output the user edits and owns.
- Anchor onboarding copy to data and jobs so it survives model upgrades, and test capability claims against evals like production code.

## FAQ

**Doesn't under-promising hurt activation?**
It slows the spike and removes the cliff. Across our projects, median-calibrated onboarding shows lower day-one activation and meaningfully higher week-four retention — and retention is the number that pays for the feature. A user who expects a draft and gets a draft keeps going; a user who expects magic and gets a draft churns and tells people.

**How do we know what our p50 actually is?**
That's what evals are for. Build an eval set from real usage data, run it before launch, and use the median-passing examples in onboarding. If you don't have evals yet, you don't know what you're promising — start there.

**Should we ever show the spectacular output at all?**
Yes — in marketing, with honest framing ("here's what's possible"), never as the implicit promise of the first run. The gap between marketing sizzle and product reality is survivable. The gap between the onboarding example and the user's first result is not.

**When should onboarding change as the model improves?**
Whenever evals prove a durable capability shift — and only then. Upgrading onboarding claims on the strength of a good demo run is how you reintroduce the promise gap with extra steps.
