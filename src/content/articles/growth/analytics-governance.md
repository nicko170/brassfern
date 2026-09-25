---
title: "Analytics governance: tracking plans before tools"
description: "Analytics rots quietly until nobody trusts the dashboards. The fix is governance, not tooling: event naming grammar, ownership, QA rituals and the monthly data hour."
slug: analytics-governance
cluster: growth
tags: [analytics, data quality, tracking, measurement, operations]
date: 2025-09-10
author: Priya Nair
keywords: [analytics governance, tracking plan, event taxonomy, data quality marketing]
readingTime: 10
---

Nobody decides to build untrustworthy analytics. It happens the way kitchens get dirty during service: every event was added by a reasonable person solving a real problem, quickly. A PM adds `signup_complete` for a launch. A contractor, six months later, adds `Signup Completed` because they never saw the first. A pricing-page test adds `cta_click` — the seventh event named some variant of "clicked something". Two years in, the dashboard says signups rose while revenue says otherwise, the data team answers every question with "it depends", and executives quietly return to making decisions on instinct while paying six figures a year for the instruments they no longer believe.

Analytics doesn't break. It *rots* — and rot is an organisational condition, not a tooling one. No migration to a shinier platform has ever fixed it, because the platform is the container and the rot is in the practice. The fix is governance: boring, humane, week-in-week-out governance that makes good data the path of least resistance. Here's the system we install, which has survived contact with real teams at real shipping speed.

## The tracking plan is the constitution

Every trustworthy analytics practice sits on a tracking plan — one shared document (we use a spreadsheet, because spreadsheets are where organisations actually live) that defines every event before it exists. Columns: event name, description in a sentence a new hire understands, properties with types, which screens fire it, who owns it, when it was added, when it was last verified.

Two rules make it a constitution rather than a suggestion:

1. **No event ships without a row.** The plan is updated in the same pull request as the instrumentation. Not "we'll backfill the docs" — the PR template includes the plan row, and reviewers check it the way they check tests.
2. **The plan defines names; code obeys.** Not the reverse. The moment implementation reality diverges from the plan, someone must change one of them explicitly. Drift between plan and code is the rot's breeding ground.

The objection is always velocity — "this slows shipping". It does, by roughly the cost of writing a sentence and a few property names, and it repays itself the first time someone answers a board question in five minutes instead of commissioning a two-week investigation into which of the four `purchase` events is real.

## A naming grammar strict enough to be boring

Event naming is where governance either has teeth or is a mood. Our grammar, after years of refinement:

- **`object_action`, snake_case, past tense.** `invoice_downloaded`, `checkout_started`, `report_shared`. Object-first groups related events alphabetically anywhere they're listed; past tense records a thing that happened, which is what events are.
- **No synonyms in the vocabulary.** Started/created/initiated mean different things in English and must mean *nothing* different in your schema. Pick one verb per concept, put it in the plan's glossary, and enforce it in review. A twenty-verb vocabulary covers almost any product.
- **Context lives in properties, never in names.** `cta_clicked { location: "pricing_hero", variant: "b" }` — not `pricing_hero_cta_clicked` and certainly not `pricingHeroCTAClick_new`. Names describe what happened; properties describe where, how, and which variant. This one discipline is the difference between a schema that scales and one that becomes a junk drawer.
- **Screen names and identifiers are separate properties with controlled values.** `screen: "pricing"` from a defined list — never free text, because free text guarantees "Pricing", "pricing page" and "/pricing-final-v2" as three values for one screen.

Is this fussy? Completely. It's also the entire ballgame: naming strictness is what makes the data answerable six months later by someone who wasn't in the room.

## Ownership: every event has a name next to it

The single strongest predictor of analytics rot is orphanage — events nobody owns. Our model:

- **Every event and every metric has a named owner.** Owners aren't responsible for the plumbing; they're responsible for the *meaning*. When "signup" stops making sense after a pricing-model change, the owner redefines it or sunsets it.
- **Metrics owners publish definitions with the metric.** "Activation: completed the project-creation journey within 7 days, excluding staff domains" — written, dated, versioned. The number of expensive meetings that are actually two definitions of the same word arguing with each other is not funny after the tenth time.
- **Sunsetting is a celebrated act.** Twice a year, the plan gets pruned: events nothing consumes get turned off, with their history archived. Teams that only add eventually drown; deletion is hygiene and should be announced like a feature. The same discipline keeps [notification systems](/journal/product/notification-design-respect) and [experiment backlogs](/journal/growth/landing-page-testing-program) honest — accretion is the default; governance is the resistance.

## QA rituals: trust is verified, not assumed

Governance succeeds when verification is a small recurring ritual rather than a periodic catastrophe:

- **Every event is verified at birth.** The PR for instrumentation includes a captured payload from a real session. Two minutes, done while context is warm.
- **A weekly anomaly glance.** Not a dashboard ordeal — one person, fifteen minutes, scanning week-over-week swings in the twenty events that matter. Swings get one of three labels: real (investigate the business), broken (investigate the tracking), or seasonal (log and move on). The labelling is the governance; un labelled swings are how "the dashboard went weird in March" becomes permanent background doubt.
- **Reconciliation against money.** Once a month, analytics revenue/agreement numbers get compared to the billing system. They will never match exactly; the job is understanding and documenting the stable, explainable gap (refunds timing, currency, test accounts). A documented 3% gap everyone understands is trustworthy. A mysterious 0.2% gap is not.
- **Test accounts are excluded by construction**, not filters — a forced property or a separate environment — so exclusion can't silently rot with the next platform migration.

## The schema registry, sized to the team

At some scale the spreadsheet wants mechanical backup. The progression we advise:

- **Small team:** the spreadsheet plan plus the PR rule. This is enough for genuinely a long time. Don't buy infrastructure to compensate for missing habits.
- **Growing team:** events as code — a typed registry in the repo (TypeScript object, JSON schema, your analytics tool's code-gen) so an unknown event name or wrong property type *fails the build*. This is the single best governance investment available: it converts human vigilance into compiler errors, aligning with the way engineering already works — the same logic as budgets in [our Core Web Vitals practice](/journal/engineering/core-web-vitals-field-guide).
- **Scale:** a real schema registry with versioning, plus contract tests on critical journeys. At this point you have a data platform team, and they'll know what they need.

The anti-pattern is starting at the top: heavy tooling installed to fix a trust problem, abandoned in a quarter because the habits were never built. Tooling amplifies culture; it cannot substitute for it.

## The monthly data hygiene hour

The ritual that holds all of it together is almost insultingly simple: one hour, monthly, with the event owners in a room (or a call), running a standing agenda:

1. Anomaly review — anything labelled "broken" still unfixed?
2. New events in review — does the naming obey the grammar; do the definitions pass the new-hire test?
3. Definition disputes — any two teams using one metric differently? Resolved on the spot, in writing.
4. Pruning — anything to sunset?
5. One improvement — a single small upgrade to the practice, shipped before the next session.

The hour works because it's small, standing, and slightly ceremonial. It's also where the culture actually lives: the meeting where a PM learns that naming things well is respected work, and where "I don't trust this number" is treated as a useful report rather than an accusation.

## The payoff: decisions at the speed of trust

None of this is glamorous, and all of it compounds. Six months in, the visible change isn't cleaner dashboards. It's behavioural: questions get answered in the meeting where they're asked; experiments get believed when they lose; budget arguments get shorter because the [attribution tiers everyone now accepts](/journal/growth/attribution-models-honest) rest on events with published definitions; lifecycle flow debates reference [holdout data that wasn't begrudgingly produced](/journal/growth/lifecycle-email-architecture). Trust is the throughput.

If your dashboards have entered the "it depends" era, this is a quarter-long intervention, mostly habits and meetings, not a replatform. It's core to how our [growth practice](/services/growth) onboards — [engagement shapes are here](/pricing), [the brief form is here](/contact).

## Key takeaways

- Analytics rots organisationally, not technically. Governance — a tracking plan, naming grammar, ownership, QA rituals — is the fix; replatforming is not.
- The tracking plan is a constitution: no event ships without a row, and code obeys the plan, never the reverse.
- Use a strict naming grammar: `object_action` past tense, no synonyms, context in properties, controlled value lists.
- Every event and metric has a named owner with a written, versioned definition; sunset events ceremonially twice a year.
- Verify with small rituals: birth capture, weekly anomaly glance, monthly money reconciliation, and a standing one-hour hygiene meeting with a fixed agenda.

## FAQ

**We're small. Isn't this enterprise overkill?**
The small-team version is genuinely small: a one-tab spreadsheet, snake_case past-tense naming, owners' initials next to events, a five-line metric definitions page, and a monthly thirty-minute glance. Fifteen minutes of governance a week is what keeps a five-event product from becoming a fifty-event swamp. Governance scales by adding machinery; it never scales by adding meetings.

**Which analytics tool should we choose?**
The one that matches your data-warehouse ambitions and your team's habits, decided *after* the tracking plan exists. Tools that can't represent your grammar cleanly are disqualifying; beyond that, the differences that matter (raw data export, identity model, pricing at your volume) are comparison-table questions. Teams that choose the tool first end up with schemas shaped by default integrations — the junk drawer, pre-assembled.

**How do we recover from an already-rotten analytics setup?**
Don't audit everything — govern forward. Pick the ten events and five metrics the business actually runs on (revenue, activation, retention trail), re-instrument them cleanly under the new grammar with real QA, publish their definitions, and declare the rest legacy. Legacy data rots in place while the governed core earns trust; prune the legacy zone twice a year. Full restorations die of scope; clean cores spread by demonstration.

**Who should own analytics governance — data, growth or engineering?**
Growth/PM should own *meaning* (definitions, events, metric ownership) and engineering should own *correctness* (implementation, schema enforcement, pipelines). The monthly hygiene hour is where they meet. Disaster correlates with either side owning it alone: data-teams-alone produce correct schemas for questions nobody asked; growth-teams-alone produce fast answers everyone stops believing.
