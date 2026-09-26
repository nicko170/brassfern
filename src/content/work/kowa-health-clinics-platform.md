---
title: "Kowa Health — unifying nine clinics onto one patient platform"
description: "Nine NZ primary-care clinics, five booking systems and a phone-heavy queue, unified into one patient portal co-designed with the receptionists who run it."
slug: kowa-health-clinics-platform
cluster: work
tags:
  - case study
  - health
  - patient portal
  - booking platform
  - accessibility
date: 2025-10-06
author: Aiko Tanaka
keywords:
  - health platform case study
  - patient portal design
  - clinic booking system
  - healthcare accessibility
  - design system health
readingTime: 10 min read
client: Kowa Health
industry: Health
services:
  - Product design & engineering
  - Websites
year: 2025
stack:
  - React
  - TypeScript
  - Node
  - Postgres
  - Twilio
---

Kowa Health is a fictional-but-plausible primary-care group in Aotearoa New Zealand: nine clinics from Whangārei to Hamilton, 46 GPs, and roughly 11,000 enrolled patients. "Kowa" nods to connection — which was ironic, because nothing about the group's tooling was connected. Each clinic had been acquired with its own booking system, its own intake forms, its own phone queue, and in two cases its own fax-adjacent workflows we're still not permitted to describe.

The brief went to tender as "a website refresh." The discovery workshops surfaced the real brief in week one: *our phones are the product, and the product is on fire.* Here's what we built instead of a website refresh. All figures are illustrative; the shape of the work is real.

## The challenge

Consolidation projects in healthcare fail in a predictable way: they standardise the patient experience by flattening the staff experience underneath it. Kowa's reception teams — twelve people across nine sites, the actual operational intelligence of the business — had each built local workarounds in their incumbent systems that no requirements document would ever capture. Replace the systems without transferring the workarounds and you don't get consolidation; you get a very clean platform and a reception desk in mutiny.

Beyond that, three specifics. **Access inequity was real and measurable**: a patient cohort skewing older, a third preferring te reo Māori greetings at minimum, and phones older than the design industry likes to imagine. **Clinical safety shaped everything**: booking is triage-by-proxy, so "book an appointment" is dangerously ambiguous when the real question is "how soon, with whom, for what." And **the data was hostile**: eleven years of patient records across five formats, with duplicate identities that matched on nothing but vibes.

## The approach

**Receptionists as co-designers, not stakeholders.** We embedded with four receptionists across two clinics for two weeks before drawing a screen. Their schedule views — not the patient-facing ones — were designed *first*, on the principle that a booking system the desk can't operate at 8:05am on a Monday is a demo, not a product. Every patient flow was then walk-tested with the same receptionists playing bad-cop: "Mrs Ngata wants the nurse, not the GP, and only Thursdays. Show me." This co-design posture is the product-design version of what our [JTBD interview practice](/journal/product/jtbd-interviews-that-work) preaches: the workflow is the requirements document.

**One booking spine, nine clinic personalities.** A single scheduling service holds availability, practitioner types, visit reasons and urgency bands; each clinic configures its own rules on top (nurse clinics, immunisation blocks, a GP who genuinely does only see chronic-care patients on Wednesdays). The patient sees a calm, three-step flow — *what's this about*, *who and when*, *confirm* — modelled on our [wizard patterns](/journal/product/multi-step-flows-wizards): progress you can count, decisions you can't shortcut, and a back button that never loses your answers. Symptom language is plain and empathetic; anything matching an urgent pattern routes to a call-us-now screen rather than a booking, with the clinic's number pre-dialled.

**Forms before arrival, in the waiting room you already own — the phone.** Intake forms send as an SMS link 48 hours before the appointment, save progressively, and degrade gracefully to clipboard-at-the-desk if unfinished. Twilio handles the messaging spine; confirmations, reminders and the gentle two-hour nudge all flow through one template system the clinical director can edit. Notification cadence follows our [respectful notification rules](/journal/product/notification-design-respect): every message earns its interruption, and every reminder says how to cancel — which is how you actually attack no-shows, rather than by punishing them.

**Accessibility as architecture, not audit.** We set an internal bar above the legal one: WCAG AA as the floor, AAA contrast everywhere the booking flow could carry it, target sizes for hands with tremor, and a fully keyboard-and-screen-reader-tested path through booking before any visual polish began. Our published [WCAG AA field notes](/journal/product/wcag-aa-product-teams) cover the traps we refused to fall into here — focus order in step flows, error summary links that actually move focus, date pickers you can operate without a mouse. The te reo language toggle is persistently honoured end to end, email and SMS included, not a homepage decoration.

**Migration as a product, not a project.** Identity reconciliation ran as a clinician-reviewed workflow with confidence bands — auto-merge above 98% match certainty, human review below — rather than a one-night script. It took longer. It also meant no patient was ever told their own record didn't exist.

## The outcome

Twelve months after the first clinic went live (clinics onboarded in waves of three):

- **Phone volume at reception dropped 38%** across the group, measured line-minute by line-minute. The reduction concentrated exactly where designed: booking, rescheduling and "what do I need to fill in" calls.
- **Online booking grew to 52% of all appointments**, with completion on phones older than five years within a point of flagship devices — the accessibility budget working as intended.
- **No-show rate fell from 9.4% to 6.1%**, attributed by the ops team to the two-tap cancel path in reminders: when cancelling is easy, people cancel instead of ghosting, and the slot gets resold — in this case, re-offered to the waitlist within minutes.
- **Patient CSAT rose 14 points**, with the intake forms the most-cited improvement in verbatims: "done on the bus" appears eleven times.
- **Reception turnover — the metric that scared us — went down, not up.** Two of the four co-design receptionists now run onboarding for new clinics. The workaround knowledge is in the system, and the knowing is still in the people.

## Stack and team

React and TypeScript portal on a Node API; Postgres with row-level tenancy per clinic and a full audit log on every record touch; Twilio for SMS and voice fallback; the whole thing deployable per-region. Squad: two designers, three engineers, a delivery producer, and Kowa's clinical and reception leads in the room every week — our standard shape under [how we work](/approach), applied to [health](/industries/health). The public-facing [websites](/services/websites) for all nine clinics ride the same content spine.

## What we'd tell another health group

Design the desk before the door. Consolidation succeeds when the people who absorbed the old system's complexity can see their knowledge honoured in the new one. We took a different angle on similar territory with [Pylon Health's telehealth flow](/work/pylon-health-telehealth-flow) and [Beacon Health's triage assistant](/work/beacon-health-ai-triage). If your phones are the product, [talk to us](/contact).
