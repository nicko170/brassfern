---
title: "Writing an analytics implementation plan before you tag anything"
description: "A measurement plan decides what to track; an implementation plan decides how. Naming, property hygiene, consent mode, staging QA and the 30-day calibration."
slug: analytics-implementation-plan
cluster: playbooks
tags: [analytics, measurement plan, event tracking, tagging, data quality]
date: 2026-05-19
author: Priya Nair
keywords: [analytics implementation plan, measurement plan template, event tracking taxonomy, ga4 setup process, tagging strategy]
readingTime: 10
---

We've made the case elsewhere for [writing the measurement plan before you build](/journal/playbooks/measurement-plan-before-build): questions first, events derived from decisions, instrumentation in the definition of done. That article ends where this one begins. A measurement plan says *what* the product must report. An implementation plan says *how* — the naming, the properties, the consent behaviour, the QA protocol — and it's the document that decides whether your dashboards answer questions or generate them.

Skip it and you get dashboard soup: forty-seven events, eleven of them synonyms, a `plan` property that contains "pro", "Pro", "PRO annual" and the string "undefined", and a Tuesday ritual where someone exports three reports to a spreadsheet to reconcile numbers that should agree by construction. This is the implementation plan we write for every engagement, from content sites to SaaS products. It's four pages. None of them are optional.

## Page one: the tracking spec

The tracking spec is the single source of truth for every event and property the product will ever fire. It's a spreadsheet — deliberately not the vendor's UI, because vendor UIs are where taxonomies go to die quietly, one click-created event at a time. Each row carries:

| Field | Example | Why it exists |
| --- | --- | --- |
| Event name | `checkout_step_completed` | Past-tense verb on an object |
| Trigger | "Fires when a checkout step validates and advances" | So QA can verify, not guess |
| Properties | `step`, `payment_method`, `error_code` | The dimensions questions pivot on |
| Property types | enum: `shipping \| payment \| confirm` | Prevents casing drift |
| Owner | an engineer's name | Unowned events rot |
| First shipped | sprint / date | Provenance for later confusion |

Two rules keep the spec alive after launch week: **nothing ships that isn't in the spec**, and **the spec lives in the repository** beside the code, reviewed in the same pull requests. A tracking spec in a wiki is a tracking spec that describes a product from eight months ago.

## Page two: naming and property hygiene

Naming is the cheapest thing to get right and the most expensive to fix retroactively, because historical data doesn't rename. Our conventions, held without exception:

- **Events are past-tense verbs on objects**: `plan_selected`, `invoice_downloaded`, `onboarding_completed`. Never `click`, never `page_view_custom_2`, never anything with a number in it. Two years from now, someone will read your funnel at 11pm during a board-prep panic. Write for that person.
- **One event, many properties beats many events.** `content_viewed` with a `content_type` property outlives nine separate view events, because questions evolve and properties are cheaper to extend than schemas. The full argument is in our piece on [naming events before choosing tools](/journal/growth/analytics-taxonomy-first).
- **Property hygiene is a cardinality budget.** Every property declares its type and — for enums — its allowed values. Free-text properties are for search queries and nothing else. And never, under any circumstances, does a property carry PII: no emails, no names, no full URLs with user-identifying parameters. Hash or drop at collection time, because "we'll filter it downstream" is a sentence that ends in a data-processing-review meeting.
- **Errors are first-class events.** If `payment_failed` doesn't fire with an `error_code`, your funnel over-reports success by exactly the rate of your most expensive problem.

The litmus test for the whole page: could a stranger reconstruct your business model from the event list? If yes, the vocabulary is honest. If the event list reads like a UI inventory (`btn_click_header`, `modal_open`), the implementation is measuring the interface instead of the business — and the interface changes every redesign while the questions don't.

## Page three: consent behaviour, decided in advance

Consent is the section most implementation plans omit and most implementations regret, because retrofitting consent logic changes your data retroactively in ways nobody annotates. Decide three things before a single tag fires:

1. **What fires before consent?** The defensible minimum: a consent-state ping, nothing else. Everything else waits. "We'll load the tag but not send events" is not a state — it's a hope, and hope does not survive a tag-manager audit.
2. **How does consent state reach the data layer?** Consent mode (or your CMP's equivalent) needs to gate at the data layer, not in forty individual tag conditions that drift apart. One gate, one source of truth, one place to check when the numbers wobble.
3. **What does denied consent do to your metrics?** This is the analytical consequence nobody models: consent-denied sessions don't bounce — they vanish. Your funnels get selectively blind, and the blindness correlates with geography, device and channel. Model the expected consent rate per market in the plan, so the post-launch calibration can tell "traffic dropped" from "consent dropped". The governance layer for all of this — change control, access, retention — is covered in our [analytics governance](/journal/growth/analytics-governance) guide; this page only needs the mechanics.

## Page four: QA and calibration

Analytics gets tested the way software does, in staging, against the spec — not in production, against hope. The protocol:

**In staging, before launch.** Someone walks the tracking spec row by row and fires each event manually, confirming trigger, payload and property values in the vendor's debug view. Every enum value gets exercised. Every error path gets broken on purpose. This takes two hours for a typical product and routinely finds a third of the events are wrong in one of three ways: fires twice, fires on the wrong trigger, or carries yesterday's property values because a state update raced the event.

**At launch.** Real-time verification within the first hour, as covered in our [launch-day QA checklist](/journal/playbooks/launch-day-qa-checklist) — you visit, you convert, you watch yourself appear.

**At day thirty: the calibration review.** This is the step every implementation skips and the one that pays for the whole document. Sit down with the plan's original questions and answer them from live data. What you're hunting is drift between expectation and reality: events that fire 40% less than the funnel implies (a trigger bug), properties that arrive blank (an integration gap), and — just as informative — events nobody has queried once in a month. Those get a decision wired into the review: attach them to a live question within thirty days or delete them. Unqueried events are inventory costs masquerading as assets.

Then annotate. The calibration review's findings — every fix, every deletion, every consent-rate surprise — go into the tool as annotations dated with the change. Six months later, when a chart has a step change, the annotation is the difference between a diagnosis and a séance. It's also what lets you do honest [attribution](/journal/growth/attribution-models-honest) later instead of archaeology.

## The annotation template

Steal this verbatim; it's the format we keep in every property:

> **Date** · **Change** — what shipped, in one sentence
> **Expected effect** — which metric moves, which direction, rough magnitude
> **Owner** — who will check it, and when
> **Result** — filled in at the next review

The `Expected effect` line is the whole trick. An annotation without a prediction is a diary entry; an annotation with one is an experiment record, and a year of them becomes the most honest account your company has of what actually moved what. It's the same discipline we apply to [CRO experiments](/journal/growth/cro-experiment-design): predictions in advance, or it didn't happen.

If this all sounds like more process than a four-person team needs — it isn't, it's exactly a four-page document, and it scales down to a landing page and up to a platform without changing shape. What doesn't scale is the alternative. And if you'd rather have the people who [run growth for a living](/services/growth) write it with you, that's literally the job.

## Key takeaways

- A measurement plan decides what to track; an implementation plan decides how. You need both, in that order.
- Keep the tracking spec in a spreadsheet that lives in the repo: event name, trigger, typed properties, owner, provenance — nothing ships that isn't in it.
- Name events as past-tense verbs on objects, keep properties typed and enum-bounded, and never let PII past collection time.
- Decide consent behaviour — what fires before consent, where the gate sits, what denial does to your metrics — before tagging anything.
- QA events in staging by firing each one manually; a third will be wrong in a findable way.
- Book the day-thirty calibration review at kickoff, and annotate every change with an expected effect or it isn't an annotation — it's a diary.

## Frequently asked questions

**Isn't this overkill for a simple marketing site?**
Scale the pages, not the discipline. A marketing site's tracking spec might be fifteen events instead of eighty, but the four pages — spec, naming, consent, QA/calibration — still apply. The sites with "simple" analytics needs are exactly the ones that discover, at month four, that nobody can say whether the contact form converts.

**Which analytics tool should we use?**
Choose after the implementation plan exists, not before — the taxonomy and consent requirements are the evaluation criteria. We've watched teams spend two months evaluating tools on feature checklists, then implement the same `button_clicked` soup in whichever one won.

**How do we handle events from third-party embeds we don't control?**
Wrap them. Route third-party interactions through your own data layer where the vendor permits it, and record the un-instrumentable ones as known blind spots in the spec itself. A blind spot that's written down is a decision; one that isn't is a future argument.

**Who owns the implementation plan after launch?**
A named person on the client side, with the agency as reviewer for the first ninety days. Ownership transfers fully at handover — if the spec can't survive without us, we wrote it wrong.

**When do we revisit the plan?**
At every calibration review for small amendments, and in full whenever the product answers a genuinely new class of question — a new pricing model, a new market, a new line. The plan is a living document in the literal sense: it changes on a schedule, not during incidents.
