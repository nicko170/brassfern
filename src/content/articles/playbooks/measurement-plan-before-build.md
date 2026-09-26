---
title: "Write the measurement plan before you build"
description: "Analytics bolted on after the build answers yesterday's questions badly. The measurement plan: events, naming, consent, dashboards — before the first sprint."
slug: measurement-plan-before-build
cluster: playbooks
tags: [analytics, measurement, project planning, data, experimentation]
date: 2026-04-14
author: Sam Whitfield
keywords: [measurement plan template, analytics implementation, event tracking plan, analytics requirements]
readingTime: 9
---

Every analytics retrofit starts the same way. The product ships, someone senior asks "is it working?", and the honest answer is nobody knows, because the events were never defined, the funnel steps share names with three other flows, and the consent banner blocks half the traffic from ever existing in the data. Then a team loses two sprints instrumenting software that's already finished — measuring a past they can no longer change.

Measurement is a build input, not a build output. The questions a product must answer determine the events it must fire; the events determine work in the backlog. Write the measurement plan before the first sprint and instrumentation becomes part of the definition of done instead of an apology season afterwards. Here's the version we run — a sibling discipline to our [analytics governance](/journal/growth/analytics-governance) guide, which covers tracking plans in depth; this one is about sequencing, workshops and the document itself.

## The workshop: questions before events

The single most valuable artefact in a measurement plan is a list of questions, so we start there. Sixty minutes, one facilitator, the product owner, someone from growth or marketing, a lead engineer, and — critically — whoever will actually read the dashboards. The prompt, on a whiteboard:

**"In the eight weeks after launch, what questions must we be able to answer, and what decision will each answer drive?"**

The decision clause does the filtering. "How many users signed up?" leads to no decision. "Is the new onboarding flow lift completing users 15% above the old one — if not, we revert" is a question with a spine. Two rules keep the workshop honest:

1. **Every question names its decision.** No decision attached, the question goes to the parking lot. This usually cuts the list by half, and the surviving half is what you'll actually act on.
2. **Someone owns each question.** An unowned question is unmeasured by nature. The owner is the person who will bring the answer to a review meeting, not a team name.

Expect ten to twenty surviving questions. They become the table of contents of the entire plan: acquisition, activation, retention, the funnel steps between, and the money questions at the end — matching how we think about [funnel movement rather than funnel moments](/journal/growth/funnel-metrics-that-matter).

## From questions to events

Each question decomposes into events and properties. This is the part teams try to improvise in sprint planning, which is why their analytics look improvised. Do it in the plan, in a table:

| Question | Event(s) | Key properties | Notes |
| --- | --- | --- | --- |
| Which onboarding variant completes best? | `onboarding_started`, `onboarding_completed` | `variant`, `step_count`, `time_to_complete` | A/B assignment must persist across sessions |
| Does pricing page traffic convert? | `pricing_viewed`, `cta_clicked`, `signup_started` | `plan`, `source`, `position` | CTA position for layout tests |
| Where does checkout collapse? | `checkout_step_completed` | `step`, `payment_method`, `error_code` | errors as first-class data |

Three conventions prevent the classic decay:

**Name events as past-tense verbs on objects** (`plan_selected`, not `selection` or `click_plan_btn_2`). Future-you will read these at 11pm during an incident; write for them.

**Properties carry the dimensions; events stay few.** One `content_viewed` with a `type` property beats nine view events, because questions evolve and properties are cheaper to extend than schemas.

**Errors are events too.** If a failure state doesn't fire an event, your funnel will silently over-report success. Instrument the unhappy paths with the same care — they're usually where the money leaks (which is why our [CRO experiment design](/journal/growth/cro-experiment-design) process starts by reading failure data, not best practices).

Every event lands in the backlog as an explicit task with acceptance criteria — "fires exactly once per completion, carries variant property, verified in staging" — and the first sprint doesn't close without its events passing QA the way features do.

## Consent is an architecture decision, not a banner

In 2026, measurement design is consent design. Decide early, because it's an engineering constraint:

**Consent-aware collection.** What fires before consent, what waits, and what's modelled. Regions differ; your plan should state which regimes you're designing for and how the tag layer behaves in each. "We'll add a CMP later" means re-plumbing every event later.

**First-party and server-side where it matters.** Browser-side analytics undercounts, increasingly and unpredictably. For conversion-critical measurement, first-party collection or server-side tagging is now the default serious option, with its own backlog item and its own QA.

**Be honest about what's knowable.** Part of your funnel will be invisible — dark social shares, ad-blocked sessions, word of mouth. The plan should say so, and route those questions to methods that work: self-reported attribution fields, cohort comparisons, surveys. Our stance on [attribution's limits](/journal/growth/attribution-models-honest) applies doubly to brand-new products with no baseline.

A measurement plan that pretends visibility is total produces dashboards that lie with confidence. Marking the blind spots is part of the plan's job.

## Prototype the dashboard before the product

This feels backwards and is the highest-leverage step: **design the launch dashboard using fake data, in week one.**

Draw the actual charts — the funnel visualisation, the variant comparison, retention curves — populated with invented numbers. Three things happen immediately:

**Gaps surface early.** "We want weekly retention by signup source" projected on a wall forces the question of whether `signup_source` is captured, deduplicated and persisting — while you can still add it cheaply.

**Stakeholders commit to shapes.** It's far easier to argue about what the retention chart should show with a picture than describe it in the abstract. Arguments move to week one instead of launch week.

**Thresholds get set now.** Annotate the fake charts with decision lines: "if step-two completion is under 40% by 2,000 users, we investigate the form". Pre-registered thresholds are the difference between learning and rationalising — the same discipline as pre-registered kill criteria in experiments.

Keep the dashboard minimal. One screen, five to eight charts, each traceable to a workshop question. If a chart can't name its question and its decision, it ships without a home.

## The document, and the cadence that keeps it alive

The plan itself is deliberately unglamorous — a document, versioned, containing:

1. **Questions**, each with an owner and a decision.
2. **Events & properties**, with naming conventions and status.
3. **Consent & regime behaviour**, stated plainly.
4. **Dashboards**, with thresholds and review dates.
5. **Change log** — because events evolve, and an undocumented event name change is how reports silently fork.

Then the cadence: the measurement plan is reviewed alongside the roadmap each quarter, and every significant feature ships with an addendum — its question, its events, its dashboard row. This is the difference between a plan and a ritual artefact. It's also exactly the sequencing argument behind [discovery-first engagements](/journal/playbooks/discovery-sprint-playbook): the cheapest time to decide what success looks like is before you build the thing being measured.

The closing thought for sceptics: teams don't resist measurement plans because they're hard; they resist because measuring commits you to being wrong in public sometimes. That commitment is the entire point. A team that knows what it will look at in week eight builds a different product in weeks one to seven — and if you want a partner who works this way from day one, that's the shape of [how we engage](/approach).

## Key takeaways

- Analytics retrofits are apology seasons. Measurement is a build input; write the plan before the first sprint.
- Start from questions, not events: sixty minutes, one workshop, and the rule that every question names its decision and its owner.
- Name events as past-tense verbs, put dimensions in properties, and instrument errors as first-class data.
- Treat consent as architecture: regional behaviour, first-party/server-side options, and an honest map of what's invisible.
- Prototype the launch dashboard with fake data in week one, thresholds written on it.
- Version the plan, review it with the roadmap, and make every feature ship with its measurement addendum.

## FAQ

### How detailed should the event spec be before development starts?

Detailed enough to enter the backlog as tasks with acceptance criteria: event names, properties with types, when each fires, and how it's verified. Vague specs ("track engagement") are how you get thirteen events named variations of `engagement`.

### We're a small team — is this overkill?

Scale the document, not the sequence. A small team's plan might be fifteen questions and twenty events in a shared doc. What you can't skip is questions-before-events and consent-as-architecture; the ceremony is optional, the order isn't.

### How do we handle measurement for AI features?

The same plan plus two extra event families: interaction quality signals (accepted/edited/discarded suggestions, time-to-first-useful-output) and guardrail events (fallbacks triggered, refusals, escalation to human). Treat the model's output as a product surface with its own funnel, and link those events to the same question-owned dashboards.

### What if requirements change mid-build?

They will. That's what the change log is for: new questions enter through the same filter (decision? owner?), new events get versioned in, deprecated ones get marked — never silently renamed. A plan that changes deliberately stays trustworthy; one that drifts silently becomes the thing everyone stops reading.

### How soon after launch should we trust the numbers?

Structure your first review at two weeks for plumbing verification (do events match reality, spot-checked session by session) and your first decision review at whatever sample size the workshop committed to. Confusing "the pipes work" with "the metrics are decision-ready" is the classic launch-month mistake.
