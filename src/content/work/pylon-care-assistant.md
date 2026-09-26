---
title: "Pylon Care: an AI support assistant that knows its limits"
description: "Pylon Health's support queue drowned in the same five questions. We shipped an AI assistant with citations, red lines and a kill switch — evals first."
slug: pylon-care-assistant
cluster: work
tags: [ai, responsible ai, support, rag, health]
date: 2025-06-17
author: Dev Khatri
keywords: [AI support assistant case study, healthtech AI, RAG citations, AI guardrails, Brassfern work]
readingTime: 7
client: Pylon Health
industry: Health
services: [AI products, Product design & engineering]
year: 2025
stack: [React, TypeScript, Retrieval (RAG), Golden-set evals, Postgres]
heroImage: /images/work/pylon-care-assistant.jpg
heroAlt: "A teal still-life: a phone mid-conversation on a desk beside a ceramic cup and stacked paperwork."
demo: pylon-care-assistant
---

Eighteen months after we shipped Pylon Health's [telehealth rebuild](/work/pylon-health-telehealth-flow), the platform was thriving and the support inbox was drowning. Four hundred tickets a week. A median first response of nine hours. And here's the embarrassing part, which Pylon's ops lead said out loud in the kickoff: "Sixty-two per cent of these are the same five questions."

Where's my referral letter? Can I reschedule without losing my spot? Why does the video test pass but the consult fail? Will I be charged if the doctor cancels? Do you store my Medicare number?

Pylon wanted an AI assistant. Their board wanted the cost saving. Their clinicians wanted to be very sure the thing never, ever played doctor. Everyone was right. The [live demo](/lab/pylon-care-assistant) is the distillation of what we built: a support assistant that streams answers from a curated library, shows its citations, redacts personal details, refuses medical questions politely, and hands over to a human with the transcript intact.

## The challenge

Support at a health platform is a trust business wearing a cost centre's hat. Three constraints shaped everything.

**The questions drift toward clinical territory within two turns.** A ticket that starts as "my video didn't work" ends as "should I take the script anyway?" Any assistant that answers freely will eventually answer dangerously — not maliciously, just confidently and wrong. The failure mode isn't rare; it's certain, given enough volume. That's the whole argument for [eval-first development](/journal/ai/llm-evals-framework): you don't hope the red lines hold, you measure them holding.

**The help content existed but wasn't machine-legible.** Pylon had a PDF policy pack, four years of ticket macros, and a wiki last touched by someone who'd left. Retrieval over that mess would produce fluent citations of contradictions. The corpus had to be rebuilt as a *library* — 140 short, templated, versioned articles — before any model touched it.

**The humans couldn't be disintermediated, just unburied.** Pylon's support team are good people answering the same five questions on behalf of a database. The goal was never fewer humans; it was humans doing the 38% of tickets that actually need judgement, with the other 62% answered in seconds.

## The approach

### Evals before the feature

Week one produced no chat UI. It produced a golden set: 900 anonymised, resolved tickets labelled by Pylon's own staff — 500 answerable from the library, 250 that should escalate, 150 deliberately adversarial (dosage questions, fake emergencies, prompt injection attempts, a user pasting their entire medical history unprompted). Every weekly build ran against it in CI, and the rollout gates were percentages, not vibes: 98% adherence to the no-medical-advice red line, 90% citation accuracy, zero unredacted Medicare numbers in transcripts. Below the bar, the flag stays off. We treat this like unit tests for behaviour, because that's what they are.

### Answers with working shown

Every answer is assembled from the library and *shows its sources* — inline citation chips and a sources drawer naming the exact articles, with version dates. If retrieval confidence is low, the assistant says so in plain words ("I'm not confident about this one") and offers a human instead of gambling. This [citation-first pattern](/journal/ai/citation-ux-rag) did more for trust in testing than any disclaimer we wrote: participants didn't read the sources, but they relaxed visibly knowing sources *existed*.

Streaming matters here too. Answers arrive token-by-token so a two-second retrieval feels like thought rather than a spinner — the latency becomes part of the voice.

### Red lines drawn in UI, not in a prompt

The no-medical-advice guardrail is a triage classifier in front of the model, not a paragraph in the system prompt — prompts are suggestions, classifiers are walls. Triggered questions get a warm, specific refusal: what the assistant can't do, what the patient *should* do, and one-tap routes to a clinician or a human ticket. Personal details are redacted client-side before anything leaves the browser; the transcript shows the patient their own redactions, because seeing `████` where you typed your Medicare number is strangely reassuring.

And every deployment ships with a kill switch scoped per feature, per page, per region, drilled monthly. An AI feature without a rehearsed off-switch isn't a feature; it's a liability with a chat bubble.

### Handover that keeps the plot

When the assistant escalates — by rule or by user request — the human receives the full transcript, the cited articles, and a one-line machine summary of what's been tried. The patient's screen says exactly what happens next and when ("Jules or Priya will reply by 4 pm today"). Nothing is retyped. In research, "having to repeat myself" was the single most-cited reason people hated support bots; we designed the handover *first* and the chat second, which we now recommend in our [AI products practice](/services/ai) for exactly this reason.

## The outcome

Fourteen weeks from kickoff to full availability, gated rollout at 5% → 25% → 100% over three weeks, eval suite running on every change. Metrics from this concept engagement are illustrative, but they're the shape of what we'd hold a real deployment accountable to:

| Metric | Before | After |
| --- | --- | --- |
| Median first response | 9 h | 40 s |
| Tickets resolved without a human touch | 0% | 58% |
| Escalations with full context attached | ~10% | 100% |
| Patient-reported resolution satisfaction | 3.1 / 5 | 4.4 / 5 |
| Red-line violations on the golden set | n/a (no assistant) | 0 in the 150-case adversarial suite |
| Support cost per resolved ticket | $11.40 | $5.10 |

The number we watch over Pylon's shoulder is the escalation *quality*, not the deflection rate. Deflection is a tempting vanity metric — you can push it up by making humans harder to reach, which is precisely the enshittified pattern everyone hates. Deflection held at 58% while escalations got *faster* and better-informed is what success looked like: the queue got shorter and the humans got sharper.

> "The assistant handles the questions that were costing us goodwill, and our team handles the ones that were costing us sleep. The transcripts mean nobody ever has to say 'can you start from the top?' again." — Ren Okafor-Ly, Head of Member Experience, Pylon Health (fictional)

## Stack & credits

- **AI design:** retrieval over a 140-article curated library, citation system with sources drawer, confidence surfacing, refusal and handover flows
- **Safety:** triage classifier for clinical red lines, client-side PII redaction, adversarial golden suite, scoped kill switch, weekly transcript audits (5% sample, human-reviewed)
- **Engineering:** React + TypeScript front end, streamed responses, versioned content pipeline with rollback
- **Squad:** AI lead, product designer, two engineers, content designer, producer — co-built with Pylon's support and clinical teams in weekly demos
- **Rebuilding support around AI?** [Talk to the studio](/contact) about how we scope responsible-AI engagements
