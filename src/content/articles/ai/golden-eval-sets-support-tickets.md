---
title: "Golden evals: mining support tickets for test sets"
description: "Your support inbox is the best LLM eval dataset you'll ever get. How to mine tickets into versioned golden sets that catch regressions before users do."
slug: golden-eval-sets-support-tickets
cluster: ai
tags: [llm evals, ai quality, support, golden dataset, testing]
date: 2025-11-13
author: Dev Khatri
keywords: [llm eval dataset, golden dataset ai, support ticket ai evals, prompt regression testing, ai quality assurance]
readingTime: 12
---

Every team building an AI feature eventually faces the same awkward question in a sprint review: "How do we know the new prompt is better?" And the answer is usually a shrug, a demo of three hand-picked examples, and a deploy. Three weeks later, support is fielding tickets about the assistant confidently inventing a returns policy.

The fix is a golden eval set — a curated, versioned collection of real inputs with known-good expectations, run against every prompt or model change. And the raw material is sitting in a place most teams overlook: your support inbox. Your customers have spent years writing you the perfect test suite, in their own words, at scale, with the ground truth already resolved by your agents. This article is how we mine it, from anonymisation to stratification to the cadence that makes evals a habit rather than a project. It's the applied sequel to [evals are the new unit tests](/journal/ai/evals-practical-guide).

## Why tickets, specifically

You can source eval inputs from synthetic generation, from staff imagination, or from live traffic. All three have a role, but tickets are uniquely rich for three reasons.

**They carry intent under pressure.** A support ticket is a real user trying to accomplish something specific, usually while mildly annoyed. The phrasing is unpolished, ambiguous, occasionally furious — which is precisely the distribution your assistant will face. Handwritten test cases are inevitably tidy; reality is not.

**They come with ground truth.** Solved tickets include what *should* have happened: the correct answer, the right policy, the resolution that closed the loop. That last mile — knowing what good looks like — is the expensive part of eval construction, and your support team has been producing it for years at no extra cost.

**They stratify naturally.** Ticket volume across categories is your real demand curve. If 30% of tickets are "where is my order", then roughly 30% of your eval set should be too. Synthetic sets tend to distribute uniformly, which means you over-test edge-case poetry and under-test the boring intents that actually carry your CSAT.

On a retailer engagement last year, 240 anonymised tickets produced an eval set that caught four regressions in the first quarter — including one where a model upgrade quietly stopped honouring the loyalty-tier discount. Nobody had written a test for loyalty tiers. The tickets had.

## Step one: extract and anonymise, seriously

Pull a sample from your helpdesk — we usually start with 500–1,000 conversations across a full quarter, so seasonal patterns are represented. Then anonymise, and do it properly, not vibes-properly:

1. Strip names, emails, order numbers, addresses at extraction time with deterministic redactors, then spot-check fifty by hand. Regexes miss the ticket where a customer pasted their entire signature block.
2. Remove or fuzz anything that could identify a *complaint about a person* — a named staff member in an escalation is both an HR issue and a liability in a dataset your whole team can read.
3. Keep the *shape* of identifiers where the intent depends on them. "My order ABC12345 hasn't arrived" should become "My order [ORDER_ID] hasn't arrived", because the presence of an order number is part of the test.
4. Get legal and support leadership to review the process once, in writing. This is the kind of thoroughness that falls under our [responsible-AI review](/journal/ai/responsible-ai-review) — boring, and the reason you can move fast afterwards.

One nuance people miss: anonymise the *agent responses* you'll use as reference answers too. You're building a test set, not a HR file.

## Step two: stratify by intent, difficulty, and stakes

A pile of 800 tickets is not an eval set; it's a pile. Curation is the job. We build along three axes:

**Intent buckets.** Cluster tickets into intents (order status, refund, how-do-I, complaint, cancellation, and the inevitable "other" — cap other at 10% or it's a smell). Size each bucket in the eval set roughly proportional to ticket volume, with a floor: even a 2%-of-traffic intent deserves five cases if it's high-stakes.

**Difficulty tiers.** Within each intent, tag cases as easy (clear question, answer in the knowledge base), medium (ambiguous phrasing, needs a clarifying step), and hard (multi-part question, missing information, policy edge case). A healthy set skews maybe 40/40/20. All-easy sets produce complacent prompts; all-hard sets produce paranoid ones. We've written before about how [RAG systems fail precisely at the hard tier](/journal/ai/rag-pitfalls-production) — retrieval of the nearly-right document — so make sure hard cases include near-miss knowledge base articles.

**Stakes tiers.** Flag cases where a wrong answer costs money, safety or trust — refunds over a threshold, health-adjacent questions, anything involving vulnerability. These get stricter pass criteria and, often, expectations that the correct behaviour is *to escalate to a human*. An eval that only rewards answering teaches the model to always answer. That's how you get an assistant confidently adjudicating hardship claims at 2am.

Target 150–300 cases to start. More isn't better; *representative* is better, and a set small enough to review line-by-line is a feature.

## Step three: write expectations, not scripts

Each case needs an expectation, and the temptation is to paste the historical agent response as the required answer. Resist. Language is too variable for exact matches, and last year's agent reply may not reflect this year's policy. Instead, capture expectations as layered criteria:

```text
Case: tkt-0847 (intent: refund, difficulty: medium, stakes: high)
Input: "item arrived broken, want my money back, this is the
second time btw"
Must: acknowledge this is a repeat issue; state the refund
  process; offer replacement as alternative; escalate to a
  human because repeat-issue flag is set
Must not: promise a refund amount; use the phrase "we
  apologise for any inconvenience"; suggest troubleshooting
  a physically broken item
Judge rubric: tone — calm, no cheerfulness; completeness —
  covers process AND next step
```

Deterministic checks (must/must-not phrases, escalation flags) run as code. Rubric items go to a judge model or a human reviewer. This layered style survives policy changes: when the refund window changes from 30 to 60 days, you update the policy in the knowledge base and the must-list stays valid. And keep prompts under version control with the evals in the same repository — a prompt and its test set are one artefact, like the [prompt libraries we treat as a design system](/journal/ai/prompt-design-systems). A prompt change without an eval run is a code change without a build.

## Step four: the cadence that catches regressions before users do

An eval set that runs quarterly is a museum. The valuable rhythm has three triggers:

- **On every prompt or model change.** Full set, gate the deploy. Non-negotiable; this is the whole point.
- **Weekly, regardless.** Providers update models silently, and silent updates are when your assistant drifts without anyone touching the code. The weekly run is how you learn the drift came from outside.
- **On a schedule of renewal.** Every month, mine that month's resolved tickets for new cases — especially any ticket where the AI was involved and the customer still needed a human. Those are the model's freshest failures, already curated by reality. Add five to ten; retire cases referencing dead policies. The set is a living asset with an owner, like everything else about [measuring AI features in production](/journal/ai/ai-feature-analytics).

Report the trend, not the score. "Intent accuracy held at 94%, escalation precision up three points after the prompt fix" is a sentence an exec can act on; "score: 7.4" is trivia.

## Key takeaways

- Support tickets are the best eval raw material you'll find: real phrasing, real ground truth, natural stratification.
- Anonymise deterministically, spot-check by hand, and keep identifier shapes that intents depend on.
- Stratify by intent (proportional to volume), difficulty (roughly 40/40/20), and stakes — with high-stakes cases that test escalation, not just answering.
- Write layered expectations — musts, must-nots, rubrics — not required script matches.
- Run evals on every change, weekly against silent provider updates, and renew the set monthly from fresh failures.

## FAQ

**We don't have a big ticket history. Can we still build a golden set?**
Yes. Interview your support team for their twenty most common conversations, transcribe two weeks of live chat, and seed the rest with synthetic cases — clearly labelled as synthetic, because you'll want to replace them with real ones as traffic accrues. Fifty good cases beats zero elegant plans.

**Should the eval set be secret so the model can't "overfit"?**
No — this isn't an exam, it's a spec. If your prompt is tuned to pass a representative set, it's tuned to serve your real customers. Do keep a small held-out rotation of fresh cases to sanity-check that, but don't confuse secrecy with rigour.

**How do we handle tickets where the right answer is "say no"?**
They're gold. Refusal and escalation cases are where assistants most often drift into people-pleasing. Must-not criteria ("does not promise a refund") carry more value than any positive rubric.

**Who owns the eval set — engineering or support?**
Support curates the cases and the expectations; engineering owns the harness and the gate. When one team owns both, you get either a test suite nobody trusts or a spec nobody runs. If you're standing this up for the first time, our [AI practice](/services/ai) runs exactly this as a two-week engagement — [talk to us](/contact).
