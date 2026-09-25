---
title: "Brightmarsh: onboarding course-takers without the confetti"
description: "Onboarding for a short-course platform that trades confetti for momentum: activation up 41% with honest progress mechanics and lifecycle email that pairs."
slug: brightmarsh-onboarding
cluster: work
tags: ["case study", "education", "onboarding", "activation", "lifecycle email"]
date: 2025-05-20
author: Priya Nair
keywords: ["onboarding case study", "edtech ux", "activation metrics", "lifecycle email"]
readingTime: 8 min read
client: Brightmarsh
industry: Education
services: ["Product design & engineering", "Growth"]
year: 2025
stack: ["React", "TypeScript", "Node", "Postgres", "Resend", "PostHog"]
---

Brightmarsh sells short professional courses — four to eight hours of material, priced for individuals rather than L&D departments. Students buy the way they buy books: with enthusiasm at 9pm on a Sunday and good intentions about "next weekend". When we started working together, 58% of buyers never finished the first module. The product was excellent; the first hour of it was a waiting room.

This case study covers how we rebuilt onboarding around momentum instead of gamification, and what we learned about where confetti cannons go to die. Numbers are illustrative, as ever — but the shape of them is real.

## The challenge

Brightmarsh had a classic activation problem with a twist. The twist: their best customers were also their most cynical. Exit interviews (we ran 22, plus a survey of 340 lapsed starters) surfaced a phrase that became our design north star — one respondent described the existing onboarding as *"being cheered at by a vending machine"*.

The old flow had everything the growth industry recommends: a five-step checklist with a progress bar, badges for early wins, a streak counter, a burst of confetti on module completion. Completion rates were terrible *and* trust scores were worse. Students described the mechanics as "patronising", "like Duolingo's annoying cousin", and most damningly, "a distraction from why I bought this".

Quantitatively, three failure points: a sign-up-to-first-lesson median gap of 6 days (enthusiasm decays); a first-lesson abandonment spike at the 12-minute mark (the intro video was 14 minutes long); and an email programme that sent identical nudges to someone who'd completed 80% of a course and someone who'd never logged in.

JTBD interviews clarified the real job. Nobody hired Brightmarsh to "complete a course". They hired it to *have a better answer in Monday's meeting* — to feel competent about one specific thing, fast. The course was a means; perceived momentum toward competence was the product.

## The approach

**Define activation as competence, not clicks.** We retired "completed module one" as the activation metric and replaced it with: *student has produced something usable in their real job within 72 hours of purchase.* For the copywriting course that's a rewritten email they actually send; for the analytics course, a dashboard they'll open again. Every course now opens with a "Monday artefact" — a small, real deliverable achievable in the first sitting. This single change reframed everything downstream.

**Front-load the payoff.** We re-cut every course's first 15 minutes: intro videos capped at three minutes, theory moved after the first artefact, and the first interactive exercise reachable within two minutes of login. The 12-minute abandonment cliff moved to minute 47 — deep enough that most students simply push through. You don't fix drop-off with reminders; you fix it by moving value in front of the cliff.

**Honest progress mechanics.** Out went streaks, badges and confetti. In came a single "momentum line" — a quiet chart on the student's dashboard showing their own study sessions against their stated goal ("I want this done by the 18th"), plus a one-line indicator of what fraction of students finish having studied at this pace. No fabricated social proof, no loss-framed streak anxiety. Progress shown as information, not pressure. We wrote about the broader ethics of this pattern in [our studio's approach](/approach) — persuasive design earns its keep only when it argues for the user's own goal.

**Lifecycle email that reads the room.** We rebuilt the email programme around behaviour states rather than a fixed drip: *unstarted*, *mid-course*, *near-finish*, *stalled*, *finished*. A stalled student who completed 70% gets a message acknowledging they're close and naming the one remaining payoff; an unstarted student gets the two-minute artefact path, never the guilt drip. Plain-text styling, written by a copywriter, sent from a human's name. The "you left items in your cart of self-improvement" genre of email was ceremonially deleted.

**Instrumentation before interface.** Before designing anything, we instrumented the funnel properly in PostHog and ran the old onboarding as a control for four weeks, so we'd know which changes moved which metric. This is unglamorous and we insist on it in every [growth engagement](/services) — you cannot A/B your way out of not knowing where you started.

## The outcome

Nine months after the new flow shipped (rolled out at 25%/50%/100% so we could watch cohorts honestly):

- **Activation — artefact produced within 72 hours — up 41%.** The "Monday artefact" introduction is responsible for the majority of the lift; its prompt is now the first screen after purchase.
- **Course completion: 23% → 37%.** Still not a number to boast about at an edtech conference, which is precisely why we trust it. Real completion lifting by half again is a business-model change for a paid course platform.
- **Unstarted-buyer rate (30 days): 31% → 14%.** Most of the gain came from the state-based email programme plus a post-purchase screen that asks students to *book their first sitting* into their own calendar — a two-tap commitment device, freely chosen, that outperformed every reminder we tested.
- **Support tickets about "feeling behind" dropped by two-thirds.** The momentum line replaced anxiety with information.
- **Refund requests fell 28%**, and — the number Brightmarsh's CEO repeats — follow-on purchases within 90 days rose 19%. Finished students buy again; guilty students churn quietly.

What surprised us: killing the streaks produced a measurable *increase* in returning sessions. Our read: streaks convert rest days into failures, so a missed Thursday made Friday psychologically expensive. The momentum line makes Thursday simply a gap. Adults with jobs don't need a product to keep score; they need one that keeps their place.

## Stack and team

React and TypeScript on the front end, Node and Postgres behind, PostHog for product analytics and experimentation, Resend for the lifecycle programme with templates as code. Team: one product designer, one engineer, one growth strategist (embedded with Brightmarsh's course producers), delivered as two fixed-scope sprints plus a measured retainer quarter — the cadence we describe in [our engagement models](/pricing).

## What we'd tell another course platform

Interview lapsed starters before you design anything — they'll tell you the exact minute your product breaks its promise. Replace completion metrics with competence metrics, then design backwards from the first artefact. And before you add a streak, ask whether you're measuring the student's progress or the product's insecurity.

See how this thinking shows up elsewhere in [our work](/work) — like [the ethics-first data storytelling we built for Meridian Climate](/work/meridian-climate-data-explorer) — dig into [the journal](/journal), or [start your own briefing](/contact).
