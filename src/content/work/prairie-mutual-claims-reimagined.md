---
title: "Prairie Mutual: claims that take six minutes, not six phone calls"
description: "A regional insurer replaced a fourteen-page claims PDF with a six-minute guided flow — and 'where is my claim?' calls fell by more than a third."
slug: prairie-mutual-claims-reimagined
cluster: work
tags: [insurance, forms, accessibility, UX writing, service design]
date: 2025-09-04
author: Aiko Tanaka
keywords:
  - insurance claims ux
  - claims app case study
  - accessible forms
  - insurtech design
readingTime: 9
client: Prairie Mutual
industry: Fintech
services: [Product design & engineering]
year: 2025
stack: [React, TypeScript, Node, Postgres]
---

Prairie Mutual is a fictional regional insurer — home, motor and small-farm cover across inland New South Wales and Queensland, staff of about two hundred, and a member base that skews older, rural and fiercely loyal. Loyalty, it turned out, had been doing a lot of load-bearing work. Because the one moment every insurer is truly tested — the claim — was Prairie Mutual's worst product: a fourteen-page PDF, an overburdened phone line, and a black hole in between.

The numbers their head of claims brought to our first meeting were the kind that end careers or start projects: 44% of claims were started on paper or abandoned in progress, the contact centre spent 37% of all call time answering one question ("where is my claim?"), and their own post-claim NPS was forty points below their renewal NPS. People loved Prairie Mutual until they needed it. Then they met the form.

The brief: make claims lodgement feel like the rest of the relationship. Illustrative metrics follow, as always on this concept site — but every decision described is one we'd make again tomorrow.

## The challenge

We spent discovery riding along with the claims team and listening to recorded calls (consented, anonymised), and the failure modes were remarkably consistent:

- **The form asked questions in the insurer's language, not the claimant's.** "Describe the proximate cause of loss." "Is the item subject to an existing encumbrance?" People who had just had their shed burn down were being asked to perform insurance. Abandonment clustered exactly at the jargon questions.
- **It demanded evidence in the wrong order.** Photos, receipts, police report numbers — all requested up front, often documents people wouldn't have for days. So they set the form aside "until they had everything", which is where claims went to die.
- **After lodgement: silence.** The claim vanished into a queue for up to ten days. So people called. The calls cost money, frustrated everyone, and — the tell — the staff answering them had no more information than the caller. The status was a folder on someone's desk.
- **Accessibility had never been tested.** A member base with an average age over fifty, filing on phones, often standing in a damaged kitchen — and the PDF required a printer. We don't need to labour this one. It was exclusion dressed as process.

We'd done a smaller version of this problem with [Kite & Anchor's insurance onboarding](/work/kite-and-anchor-insurtech), and the pattern held: in insurance, the form *is* the product, and nobody had ever designed theirs.

## The approach

**A guided flow that asks one thing at a time, in words people use.** We rebuilt lodgement as a conversational, single-question-per-screen flow on React and TypeScript. Not a chatbot — a well-mannered form. "What happened?" in plain words. Incident type chosen from big pictorial targets ("storm", "theft", "something hit my car"). Every technical term glossed inline, and every question rewritten with the claims team until it survived our plain-language bar: a claims officer and a 14-year-old should both parse it first read. Our full method is in [designing forms people actually finish](/journal/web-design/forms-people-finish); the short version is reciprocity — give progress and reassurance constantly, interrogate sparingly.

**Lodge now, evidence later.** The single biggest structural change: you can lodge a claim in six minutes with just your policy number and a description. Photos and documents are requested afterwards, one at a time, by SMS or email, each with clear guidance ("photograph the whole wall, then the damage up close — here's an example"). The claims team triages from the description and asks only for what each claim genuinely needs. Completion had been throttled by the demand for everything up front; pulling evidence collection post-lodgement was worth more than any visual polish we shipped.

**The claim is a state machine, and status is a feature.** Underneath, claims run through an explicit state machine — lodged, triaged, assessing, awaiting info, decided, settled — which gives us two things. First, resilience: every transition is logged and recoverable, and save-and-resume is free because state is the architecture, a pattern we've written up in [state machines for product flows](/journal/engineering/state-machines-ui-flows). Second, honesty: the status page shows the real state, the plain-words meaning ("We're assigning someone to your claim — usually within two business days"), and the next step. Proactive SMS/email updates fire on every transition that matters. "Where is my claim?" went from a phone call to a glance — and the contact centre felt it within a fortnight.

**Accessibility as the spec, not the audit.** Given the member base, we set WCAG 2.2 AA as the floor and aimed past it where it mattered: AAA contrast on all body text, minimum 44px targets, full keyboard and screen-reader paths tested in every sprint (not at the end), a "have someone help you" mode that lets a family member complete a draft the claimant reviews and submits, and an explicit, non-judgemental exit to a phone claim at every step — "Prefer to talk? Call us, mention your claim number, we'll pick up where you left off." The phone is an accessibility feature too. The discipline behind this is written up in [our accessibility audit process](/journal/product/accessibility-audit-process).

**Built with the claims team, not for them.** Twelve adjusters sat in weekly demos from week two. Their fingerprints are everywhere: the triage queue they asked for, the request-evidence templates they wrote, the fraud flags we *didn't* build after they explained which ones generate false positives. The product shipped with the people who'd run it already invested — the single best adoption strategy there is, and the reason the workflow changes survived contact with reality.

## The outcome

Illustrative outcomes, first two quarters after full rollout:

- **Median lodgement time: 6 minutes 12 seconds**, down from an average of six phone calls or a forty-minute form session. Digital lodgement share went from 38% to 79% of claims.
- **"Where is my claim?" call volume down 37%** — the status page absorbed the anxiety, and contact-centre staff were redeployed to the claims that actually needed a human.
- **Post-claim NPS up 22 points**, closing most of the gap to renewal NPS. The most common verbatim in the survey comments was some variation of "it told me what was happening." It is humbling how much of experience design is simply *narrating what's happening*.
- **Lodgement completion up 31%** among claimants over sixty — the cohort the PDF had excluded most thoroughly, now finishing on phones at rates their kids envied.

"Members used to brace before they called us," their head of claims said at the review. "Now the angriest feedback we get is that the flow didn't ask enough questions. People *want* to be thorough. We just finally let them." That's the reframe we took away: claimants aren't trying to do less work. They're trying to do the right work, once, in words they understand.

If your service's worst moment is also its most important one, that's exactly the engagement shape on our [product practice page](/services/product) — and the way we staff and run it week to week is [here](/approach).
