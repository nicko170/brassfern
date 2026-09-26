---
title: "Kite & Anchor: insurance onboarding people actually finish"
description: "A boutique insurtech's quote flow was losing four in five visitors. Progressive disclosure, honest defaults and plain-English policy summaries fixed the finish line."
slug: kite-and-anchor-insurtech
cluster: work
tags:
  - Fintech
  - Onboarding
  - Forms
  - Progressive disclosure
date: 2025-06-05
author: June Okafor
keywords:
  - insurance ux case study
  - onboarding flow
  - progressive disclosure
  - fintech forms
  - quote flow design
readingTime: 8
client: Kite & Anchor
industry: Fintech
services:
  - Product design & engineering
  - Websites
year: 2025
stack:
  - React
  - TypeScript
  - Node
  - Postgres
  - Sanity
  - PostHog
heroImage: /images/work/kite-and-anchor-insurtech.jpg
heroAlt: "A paper kite folded from a cream policy document, a brass anchor paperweight and an ink pen on warm paper."
---

Kite & Anchor sells landlord and small-business insurance in four states — the kind of cover people buy quickly, reluctantly, and usually on a phone between other tasks. Their product was good. Their quote flow was a filing cabinet wearing a web form: forty-one fields, one long page, and a completion rate of 19%.

When they engaged us, their growth team had already tried the obvious. The button was rounder. The hero had a photo of a happy couple with a dog. Completion was still 19%. The problem wasn't persuasion — it was arithmetic. Nobody finishes a form that asks for everything before it has given anything.

## The challenge

We mapped the original flow and found the usual insurance pathology, in concentrated form:

- **Front-loaded everything.** Fourteen fields before the visitor had seen a single dollar figure. The flow demanded commitment before it demonstrated relevance.
- **The fatal question.** Step nine asked for an excess amount with no explanation. Session recordings showed people stalling there — forty, sixty, ninety seconds — then leaving. It wasn't a question, it was an exam.
- **Compliance copy that protected nobody.** The product disclosure statement was linked as a PDF. The on-page summary was written to indemnify, not to inform. Customers were clicking "I understand" on text nobody understood, which is the worst of both worlds: legally exposed *and* confusing.
- **No way back.** Abandon the flow and your answers died with the session. Returning customers started again — and most didn't.

Kite & Anchor's head of product, Sarah Chen, framed the brief beautifully: "We're asking strangers to do paperwork. Make the paperwork feel like a conversation with someone competent."

## The approach

**Progressive disclosure with a spine.** We rebuilt the quote flow around the discipline we describe in [progressive disclosure for genuinely complex tools](/journal/product/progressive-disclosure-complexity): reveal complexity at the moment of decision, never before. The flow now asks five questions to produce an indicative price — state, property type, building value band, construction decade, occupancy. Everything else unfolds after the number exists, each question arriving with its reason attached: "Your insurer uses this to price storm risk," not "Field required". Forty-one fields became forty-one *moments*, sequenced by how much the answer moves the premium.

**The excess explainer, in dollars.** The fatal question became the flow's best moment: a slider with real numbers. Drag the excess from $500 to $2,000 and watch the annual premium move — the actual trade-off, computed on their real quote, updating live. Nobody leaves a slider confused. Almost nobody left this one.

**Honest defaults, always labelled.** We pre-fill what public data allows: construction era from the address record, estimate bands from council data. Every pre-filled answer wears a small "estimated — tap to correct" tag. This was the hard-fought design principle: a default you can see and edit builds trust; a default you can't see is a dark pattern with a suit on. Pre-filled fields had a 91% acceptance rate, and corrections clustered where the public data was genuinely stale, which told us the defaults were honest rather than coercive.

**Plain-English summaries with a paper trail.** Each cover tier gets a 90-second plain-words summary — what's covered, what isn't, the three exclusions most likely to surprise a landlord. Every sentence hyperlinks to the exact clause in the PDS it summarises, and the whole mapping is versioned, so compliance can diff a wording change against the source in one glance. This was the compliance team's idea, not ours, and it changed the engagement: the lawyers stopped being a gate and became reviewers of an artefact they could actually check. Sign-off time on wording changes dropped from weeks to days.

**Resume without ransom.** Leaving mid-flow saves your progress; returning arrives via a magic link straight to where you stopped. No forced account creation, no email hostage exchange. This one feature recovered 14% of abandoned quotes within 72 hours. It's the same philosophy as our writing on [forms people actually finish](/journal/web-design/forms-people-finish): a form is a promise, and breaking the visitor's work breaks the promise.

**Comparison without theatre.** The three tiers display side by side, differences highlighted rather than similarities padded. We banned the strikethrough-price anchoring the old site used; it tested well and explained badly, which is a trade we don't make.

## The outcome

The rebuilt flow launched in March 2025 across all four states. Illustrative figures from the first two quarters, compared with the same months a year prior:

- **Quote completion:** 19% → 41%. The biggest single lift came from the indicative-price-first restructure, not from any copy change.
- **Median time to quote:** 8 minutes 40 seconds down to 3 minutes 50 seconds — and the flow now *feels* shorter than that, because every question arrives with its reason.
- **Excess-related drop-off:** effectively eliminated. The slider question now has the highest engagement of any step.
- **Quote-to-bind rate:** up 47%, which the team attributes to customers arriving at purchase already understanding what they bought.
- **Support volume:** "what does my policy cover" calls to the service centre fell 33% — the plain-English summaries did their job on both sides of the phone.

"Every agency told us to make the form shorter," Sarah says. "Brassfern made it *answerable*. Those are different projects, and only one of them was the one we needed."

## What we'd tell other regulated-product teams

Your compliance team is a design partner if you give them an artefact they can check — and a bottleneck if you hand them prose. Show every default, attach a reason to every question, and put a real number on the screen before you ask for the tenth field. The flows that finish are the ones that feel like they're being filled in *with* you.

We do this work across regulated spaces — see how we gave a [community bank a human voice](/work/copperline-community-bank), browse our [fintech practice](/industries/fintech), or [brief us on your flow](/contact).
