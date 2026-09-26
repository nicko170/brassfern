---
title: "AI and brand voice: keeping the robot on-script"
description: "Models drift toward LinkedIn-speak. How we write voice specs machines can follow — exemplars, register maps, persona rules — and test them with real readers."
slug: ai-brand-voice
cluster: ai
tags: [brand voice, ai writing, tone of voice, editorial, llm content]
date: 2026-01-22
author: Leonie Marsh
keywords: [ai brand voice, ai copywriting, brand safety ai, tone control, voice spec, llm style guide]
readingTime: 12
---

There's a sentence that ends up in every AI copy system eventually, usually inside the first month of production: *"We hope this message finds you well."* Nobody wrote it. Nobody approved it. It materialised — because when you ask a large language model to sound human without telling it *which* human, it averages out to the most common human in its training data, and that human works in enterprise sales.

Brand voice is the fix, but not the way most teams apply it. Attaching your brand guidelines PDF to a prompt is like handing a new copywriter a stationery cupboard: technically on-brand, practically useless. This article is about the writing craft of keeping generated copy on-voice — how to write the document a machine can actually follow, how to decide the persona questions your guidelines never answered, and how to check with real readers that any of it worked. It pairs with our piece on the system side, [voice guardrails that hold](/journal/ai/ai-brand-voice-guardrails); this one is about what goes *into* the system.

## Personas first: the decision your brand book ducked

Before a single rule, answer a question most brand guidelines never had to face: when the AI speaks, *who* is speaking? There are three coherent positions, and most disasters come from mixing them.

1. **The brand as one voice.** No character, no name, no "I'm just an AI". The copy reads as the company speaking — as every good brochure and error message already does. This is the lowest-risk option and the easiest to keep consistent, because there's no persona to maintain, only a voice.
2. **A named character.** Sage, Penny, Fern. Named assistants buy personality and memorability, and they cost enormously: every message must stay in character across every emotional register, including complaints and refunds, where cuteness curdles fast. A character that jokes on a balance-due email is a screenshot.
3. **An honest instrument.** The AI identifies itself plainly as an automated helper that speaks *for* the brand, first person plural ("we", the company) rather than first person singular. This has aged well; users in 2026 are calibrated to AI and mostly annoyed by theatre.

Our default recommendation, after building these for a bank, a record label and a florist: position one or three, and only a named character if the brand already has a mascot tradition and the appetite to govern it. Whatever you choose, the persona decision goes at the top of the voice spec, because it determines every pronoun downstream.

## The voice spec: written for a reader that can't read between lines

A human copywriter infers. A model interpolates. Your voice spec has to say the quiet parts loud. After iterating these documents across several engagements, the structure that works has five sections, in this order:

**1. The stance (three sentences, no more).** Not adjectives — a position. "We speak like a knowledgeable friend who has read your file. We are calmest when the situation is worst. We would rather be plain than liked." If your stance section contains the word "innovative", start again.

**2. The register map.** Voice is constant; register flexes with stakes. We lay out a grid — channels down the side, stakes across the top — and write one example sentence in each cell. A shipping-notification sentence at low stakes ("Your parcel left Fernleigh this morning") and at high stakes ("Your order can't be fulfilled — here's what happens now"). The grid is usually the first time a brand team sees their voice *applied* rather than described, and it exposes every cell nobody had thought about. (For the underlying craft, our piece on [brand voice charts](/journal/brand/brand-voice-charts) is the prequel to this document.)

**3. Exemplars — the heart of the spec.** Ten to twenty pairs of before/after rewrites, sourced from your real copy history, each with a one-line note naming the principle it demonstrates. Exemplars do the heavy lifting that adjectives can't. Two companies can both claim to be "warm and direct"; their rewrites of the same refusal email will be nothing alike, and that difference is the actual brand. Sources, in order of value: your best-performing support macros, your founder's actual emails (lightly anonymised), headlines that tested well, and — honestly — the lines customers quote back to you.

**4. The NEVER list.** Models fail by addition: filler greetings, reflexive apologies, exclamation marks, "As an AI language model…". An explicit banned list outperforms any positive description. Audit one month of outputs, harvest every phrase that made an editor wince, and ban them by name. On one client the list stabilised at 34 entries; on another, banning the word "delighted" alone fixed half the drift.

**5. The escalation registers.** The two or three moments where the voice changes on purpose: bereavement, hardship, legal. Write these exemplars first and review them with your most senior people, because this is where a voice failure stops being a tone problem and becomes a values problem.

Keep the whole thing under two thousand words. A spec a model can't hold in context is a spec that's decorative.

## Test the voice with readers, not just judges

Technical evals — and you should have them, graded continuously as we describe in [evals are the new unit tests](/journal/ai/evals-practical-guide) — tell you whether output matches the spec. They cannot tell you whether the spec *is the brand*. For that you need readers.

Two methods have earned their keep:

- **Blind lineups.** Take output passages from the AI, from your best human writer, and from a competitor. Strip attribution, show them to eight or ten people who know the brand — staff from sales and support, not just marketing — and ask which is "us". Scores above 70% means the spec is legible; below 50%, your exemplars are describing a brand that exists only in the guidelines.
- **Fresh-customer perception tests.** Show real prospects two or three AI-written interactions and ask them to describe the company in three words. Compare the words to your intended stance. When we ran this for a wine merchant, customers said "knowledgeable, unhurried, a bit dry" — which was exactly the spec, and the day we all exhaled.

Run these at launch and after any major model or prompt change. They're cheap, they're fast, and they catch the failure mode that no eval will: a spec that is perfectly followed and perfectly wrong.

## Governance: voice is a garden, not a building

The launch-day spec will be right for about a quarter. Then products change, language moves, and the model provider silently updates something on a Tuesday. Assign a named owner — an editor, from content or brand, never engineering — with authority to block releases and a monthly hour to review drifted outputs. Every correction that owner makes is new spec material; the [human review lane](/journal/ai/ai-brand-voice-guardrails) is your mint for fresh exemplars. The teams that keep their voice for years are the ones that treat the spec like [a design system's tokens](/journal/engineering/design-tokens-pipeline): versioned, owned, and changed deliberately.

And budget for the work honestly. A voice spec is roughly one senior writer-week to draft and a day a month to maintain — trivial next to the cost of a voice incident, and less than most companies spend on the stock photography nobody remembers.

## Key takeaways

- Decide the persona before the rules: one brand voice, a named character, or an honest instrument. Don't mix.
- Write the spec for a reader that can't infer: stance, register map, exemplar pairs, a NEVER list, escalation registers — under two thousand words.
- Exemplar rewrites are the spec's load-bearing wall. Ten good pairs beat ten pages of adjectives.
- Evals prove output matches the spec; only readers prove the spec matches the brand. Run blind lineups and perception tests.
- One named editorial owner, a monthly review, and every correction harvested as new spec material.

## FAQ

**Can't we just fine-tune a model on our existing copy?**
Fine-tuning on your archive teaches the model your copy's average day, including every off-brand compromise ever shipped to meet a deadline. Curation beats volume; the decision guide in [fine-tuning vs RAG vs prompt](/journal/ai/fine-tuning-vs-rag) applies here, and our honest experience is that a sharp prompted spec plus a small exemplar bank gets you 90% of fine-tuning at 10% of the maintenance.

**Our brand guidelines are genuinely good. Why isn't that enough?**
Because guidelines are written for humans who can watch a colleague do it right. Models need the mechanical version: rules, pairs, bans. Translating your guidelines is usually a few days, and the translation often reveals gaps in the guidelines themselves — a free audit.

**Who should write the exemplars?**
Your best working copywriter, whoever holds that title. This is senior craft work, not an intern task — the exemplars will silently author thousands of future messages.

**How do we handle multiple languages?**
Rebuild the exemplar bank per language with native writers; don't translate it. Voice survives translation about as well as jokes do. Steer structure from the source spec, source the examples locally. If AI features are on your roadmap, our [AI practice](/services/ai) builds voice systems as part of discovery — and the [conversation starts here](/contact).
