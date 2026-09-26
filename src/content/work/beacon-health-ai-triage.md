---
title: "Beacon Health: an AI triage assistant that knows when to stop talking"
description: "A primary-care network wanted an AI front door without the risk. We designed an AI triage assistant with red-flag escalation, clinician review and offline evals."
slug: beacon-health-ai-triage
cluster: work
tags:
  - AI products
  - Health
  - Responsible AI
  - Conversational UX
date: 2026-03-05
author: Dev Khatri
keywords:
  - ai healthcare case study
  - llm evaluation
  - responsible ai design
  - triage chatbot ux
  - clinician in the loop
readingTime: 11
client: Beacon Health
industry: Health
services:
  - AI products
  - Product design & engineering
year: 2026
stack:
  - React
  - TypeScript
  - Node
  - LLM API
  - Retrieval
---

Beacon Health runs nine primary-care clinics across regional Queensland. Their phones were the bottleneck every practice manager in the country recognises: reception lines jammed at 8am, forty-minute hold times, anxious patients giving up and going to the emergency department for things a GP could have settled in ten minutes. Their leadership wanted an AI front door — a triage assistant that could listen to "my son has had a fever since Tuesday" and route the family to the right care: book the appointment, suggest the nurse line, or say *this needs the ED, now*.

They were also, correctly, frightened. A health assistant that improvises is not a feature; it's a liability with a chat bubble. Their brief to us was unusually honest: *"We want the efficiency. We cannot ship the risk. Tell us where the line is."*

That sentence shaped the whole engagement. This is a case study about designing where a machine stops talking.

## The challenge

The failure modes of AI in clinical front doors are well documented and unforgiving:

- **The confident miss.** A model that hears "chest pain, bit sweaty" and suggests booking a routine appointment has done measurable harm at scale. Under-triage is the catastrophic direction.
- **The anxious over-escalation.** A model that sends every headache to the ED teaches users to ignore it — alarm fatigue sets in within weeks, and the clinics are back at square one with lower trust.
- **The voice problem.** People arrive at this assistant worried, sometimes at 2am. Copy that sounds like a corporate FAQ ("Invalid input. Please select from the following options") at that moment is a brand injury and a care injury.
- **The accountability gap.** When the assistant routes someone somewhere, a named human system must be able to answer: *why did it say that?* "The model felt like it" is not an answer a clinic director can give a coroner, a board, or a parent.

Beacon's clinical governance team set the bar themselves: the assistant would advise on routing and information only. No diagnosis, no dosage, no reassurance beyond what protocols allow. Every escalation pathway had to be reviewable by clinicians after the fact, and measurable before launch.

## Approach

**Evals before the interface.** Our first deliverable wasn't a prototype — it was a test suite. Working with Beacon's clinical leads, we built *48 scenario suites* covering the space the assistant would actually meet: chest pain at midnight, a toddler's fever, a medication question, a mental-health disclosure, a worried-well vitamin query, plus the adversarial edge cases (users asking for antibiotics by name, minimising symptoms to skip a queue). Each scenario carried a gold-standard routing decision agreed by two clinicians. The assistant's changes — prompts, retrieval sources, models — don't ship unless they pass the whole suite offline. Evals-first is our default discipline on every AI build; the method is written up in [evals are the new unit tests](/journal/ai/evals-practical-guide), and the ticket-mining technique behind the scenarios comes from our piece on [golden eval sets](/journal/ai/golden-eval-sets-support-tickets).

**An intent taxonomy, not an open mic.** The assistant never free-styles triage. Incoming messages are classified against a 23-intent taxonomy agreed with the clinical team — symptom report, appointment request, results query, mental health, medication side-effect, and so on — and each intent has a *protocol card*: what the assistant may say, what it must ask next, and where it must hand over. The generative layer speaks within the card; it never decides the card. That architecture — constrained generation over a reviewed decision structure — is the single most important responsible-AI choice in the build.

**Red-flag escalation as its own lane.** Red-flag detection runs as a separate, deterministic layer: symptom phrases and combinations from Beacon's clinical protocols trigger escalation regardless of what the model thinks is happening. If "chest pain" meets "radiating to arm," the assistant stops chatting. It displays a calm, unmissable card — *these symptoms can be serious; call 000 or go to your nearest emergency department now* — and the conversation locks. No softening, no upsell to a nurse line, no "but it could also be." In the final evaluation this lane's precision was 96% with a deliberate over-trigger bias: false alarms are reviewed and refined; missed ones change the protocol. For the general pattern of failure-state design, see our piece on [when the model fails](/journal/ai/llm-failure-fallback-ux).

**Confidence shown as sentences.** We banned percentage confidence readouts — users read "85% sure" as a diagnosis coupon. Instead the assistant writes its confidence as a sentence tied to an action: *"This sounds like something a GP should see within 24 hours"* versus *"This could be a few things; a nurse call is the right next step."* The sentence is generated from the routing tier, not invented by the model, which keeps the language auditable. Users in testing consistently paraphrased the assistant back accurately — our real comprehension check.

**Clinician-in-the-loop, designed as a queue.** Every conversation lands in a review queue that receives genuine design attention: sortable by escalation level, expandable reasoning trails ("classified as symptom-report → protocol card 12 → asked duration, severity, red flags → routed nurse line"), and a correction control for clinicians to flag a routing decision. Corrections feed the eval suite, so clinical judgement compounds into the tests. Our [human-in-the-loop](/journal/ai/human-in-the-loop-queues) essay describes why the review queue is a product surface, not a back-office chore; Beacon's queue was designed before the chat UI was.

**Voice for 2am.** The assistant's copy was written for someone holding a sick toddler: short sentences, no exclamation marks, no "I totally understand how scary this is" theatrics, no unearned names or personas. It doesn't pretend to be a nurse; it says plainly what it is — *"I'm Beacon's automated assistant. A nurse reviews every conversation."* That disclosure, tested against variants, measurably increased completion of the triage flow: honesty turned out to be the best friction-reducer we had. The same principle runs through our work on [keeping AI output on-brand](/journal/ai/ai-brand-voice-guardrails).

## The outcome

The assistant piloted at two clinics in late 2025, then rolled out across the network in January 2026. Outcomes are from the first quarter of full operation and are illustrative:

- **Escalation performance:** 96% precision on red-flag scenarios in live operation, with zero documented under-triages across ~19,000 conversations in the first quarter. Every over-escalation was reviewed; 11 refined the trigger lists.
- **Call volume to reception:** down 44% during the 8–10am peak. Reception staff report the calls that remain are the complex ones they'd want to keep — the assistant takes the queue, not the relationship.
- **Routing accuracy against the gold standard:** 93% agreement with blinded clinician review on a weekly sample, up from 87% in the pilot month as corrections fed the eval suite.
- **Patient satisfaction:** 4.6/5 post-conversation rating, with the highest scores on "I knew what to do next." The most common written comment was some variant of "it told me when to stop googling."
- **Governance:** Beacon's clinical governance committee reviews the eval suite results monthly as a standing agenda item — the assistant has a reporting line, which is how we think every clinical AI should be wired.

"People expected the AI to be the clever part," Dr. Ada Kessler, Beacon's clinical director, told the steering group. "The clever part is that it has a boss."

## What we'd tell other teams shipping AI in high-stakes products

Three habits carried this project. First, build the eval suite before the feature, with the domain experts writing the gold answers — everything else is negotiation against that baseline. Second, separate the deciding from the speaking: a constrained action layer under a generative voice is safer than a clever prompt, and you can audit it. Third, design the moment the machine shuts up — escalation is a UX surface, and in high-stakes products it's the surface your reputation actually lives on. The broader production checklist is in our notes on [shipping LLM features](/journal/ai/shipping-llm-features), and our [AI practice page](/services/ai) lays out how an engagement like Beacon's is structured.
