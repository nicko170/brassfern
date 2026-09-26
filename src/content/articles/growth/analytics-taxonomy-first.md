---
title: "Name your events before you buy the analytics tool"
description: "Event naming decides whether your data answers questions in year three. The taxonomy anatomy we design before any tool evaluation: verbs, properties, screens, migration."
slug: analytics-taxonomy-first
cluster: growth
tags: [analytics, event naming, taxonomy, measurement, data quality]
date: 2026-02-11
author: Priya Nair
keywords: [analytics taxonomy, event naming, measurement plan, analytics governance]
readingTime: 9
---

Every analytics RFP we've ever been cc'd on starts the same way: a feature matrix of tools, scored by someone who will never write an event name. Session replay? Check. Funnels? Check. Warehouse-native? Check. Meanwhile the actual determinant of whether anyone trusts the numbers in 2028 — the taxonomy, the hundreds of small naming decisions about what your events and properties are called and what they mean — gets zero slides.

This is backwards. Tools are interchangeable; they all ingest named events with properties. The taxonomy is the product you're actually building when you instrument one. So our rule of engagement: **name your events before you buy the analytics tool.** Design the taxonomy as an artefact, on paper, with the people who will read the dashboards. Then let the taxonomy disqualify tools that can't represent it cleanly. This article is the anatomy of that artefact — the parts that decide whether your data is answerable in year three or quietly abandoned in month eight.

## Why the taxonomy outlives the tool

Rough math from our last dozen audits: the average analytics tool tenure at the companies we met was 2.8 years. The average age of the event names still firing was 5+. `Signup Completed` (title case, space, present tense) has now survived three platforms because migrating names is painful and nobody owns it. Every tool evaluation treated the schema as an input — "we'll just re-implement our tracking" — and every re-implementation faithfully reproduced the junk drawer, because there was no better document to copy from.

Your taxonomy is the only layer of your analytics stack with a real chance of outliving the decade. Treat it with the respect of a public API, because that's what it is: the API between your product and every future question anyone will ask about it.

## The anatomy of a taxonomy document

Before tools, before implementation tickets, we draft one document with five sections. It fits in a spreadsheet. (We keep the broader governance rituals — ownership, QA, the monthly hygiene hour — in a [separate piece on analytics governance](/journal/growth/analytics-governance); this one is purely the naming and structure.)

**1. The entity map.** First: what are the nouns of your product? Not screens — *things*. For a self-serve SaaS, maybe: account, workspace, project, member, plan, invoice, report. Fifteen to twenty-five nouns for almost any product. Every one gets a one-sentence definition a new hire could read cold. This section feels trivial and is the most argued-over hour of the whole exercise, because it forces the org to admit it has three different concepts all informally called "team". Resolve it here, in words, or your events will encode the confusion permanently.

**2. The verb glossary.** Twenty verbs, maximum, each with a strict meaning. Ours, refined over years: `created`, `started`, `submitted`, `completed`, `updated`, `deleted`, `viewed`, `searched`, `shared`, `invited`, `accepted`, `declined`, `upgraded`, `downgraded`, `cancelled`, `renewed`, `exported`, `imported`, `clicked`, `failed`. The rule that does the work: **one verb per concept, forever.** If `submitted` is the verb for "user sent a form", then nothing is ever `sent`, `posted` or `completed-form`. Synonyms are how one question gets three answers.

**3. The event grammar.** Compose events as `entity_verb`, snake_case, past tense: `report_exported`, `member_invited`, `plan_upgraded`. Alphabetical listings group by entity for free. Reading order matches how questions are asked ("show me everyone who exported a report"). Context — which screen, which button, which variant — is *never* in the name. `pricing_hero_cta_clicked_v2` is not an event; it's a cry for help. It's `cta_clicked` with properties.

**4. The property dictionary.** This is where most taxonomies are phoned in, and where the year-three value actually lives. For every property: name, type, allowed values or format, and definition. The crucial moves:

- **A reserved core set** that rides on every event, enforced centrally: `screen`, `surface` (marketing / app / email / help), `plan_tier`, `account_age_days`, `experiment_ids`. Instrument these once, in the wrapper, and fifty future analyses get easier without a single new event.
- **Controlled vocabularies.** `screen: "pricing"` from a defined list, never free text — free text guarantees "Pricing", "pricing page" and "/pricing-final" coexisting as three values for one screen. Enforce the list in code, the same discipline as a [shared validation schema](/journal/engineering/schema-validation-shared-contracts).
- **Type discipline.** `amount_cents: integer`, currency always a sibling property. Timestamps in ISO 8601 with timezone. Booleans, not string "yes". Every "it depends" answer in a data meeting can be traced to a type crime committed in the name of speed.

**5. The screen taxonomy.** Your screens are an information architecture, so design them like one: a flat, human-named list (`home`, `pricing`, `checkout_payment`, `settings_billing`) with a rule for new screens joining it. When the IA changes — and it will — the *name in analytics stays stable* and a mapping note records the change. Renaming screens in analytics with every redesign is how you manufacture year-over-year charts that compare nothing to nothing.

## The seven sins we audit for

When we inherit an existing schema, these are the failure modes, in descending order of damage:

1. **Synonym verbs** — `started`/`began`/`initiated` across features built by different squads. Funnels silently drop steps.
2. **Context baked into names** — `checkout_step2_continue_clicked`. Redesign the checkout once and your history is unreadable.
3. **Free-text screen and location values.**
4. **Implicit identity** — events that make sense only if you know which account type fired them, with no `plan_tier` or `role` property to reconstruct it.
5. **State masquerading as events** — `user_is_on_trial` fired daily. State belongs in user properties or the warehouse; events are things that happened.
6. **Duplicates with different payloads** — two `purchase` events firing on one transaction, one from client, one from server, differing by a rounding rule. Reconciliation hell. Our rule: one source of truth per money event, [reconciled monthly against billing](/journal/growth/analytics-governance).
7. **Properties nobody consumes** — 40% of inherited schemas carry properties that appear in zero saved reports. Delete them at audit; they cost trust by making every event look more complicated than it is.

A realistic audit: 60–90 minutes for a fifty-event schema, score in the doc, fix the top ten sins in the next sprint. You don't need purity; you need the ten events the business runs on to be beyond reproach.

## Migrating without losing history

Sometimes the schema you have must become the schema you drafted. Two techniques, no heroics:

- **Alias, don't rename.** Fire the new name; register the alias in the tool so old charts keep working. Most platforms support this; it's one of the few feature-matrix rows worth caring about. Announce a six-month deprecation for the old name, in writing, and actually delete it — the same pruning ceremony we use for [content that's stopped earning its keep](/journal/growth/content-pruning-seo-lever).
- **Migrate forward, archive backward.** Don't rewrite historical data. Declare the cutover date, document the definition change next to the metric, and teach the three people who pull year-over-year numbers where the seam is. Trying to backfill five years of history converts a two-sprint job into a programme, and programmes are where taxonomy projects go to die.

## What this buys you before a single tool decision

Once the taxonomy exists on paper, tool evaluation becomes almost boring, which is the point. Can the tool ingest our grammar without mangling names? Can it enforce property types? Does raw export preserve the schema? Can we alias renamed events? Four disqualifying questions instead of forty rows of session-replay checkboxes. The tools that survive are, honestly, usually fine — the differences that remain are about warehouse strategy and pricing at your volume, and both are legible questions to a procurement spreadsheet.

And the compounding payoff is behavioural, the same compounding we see when [experiments are pre-registered](/journal/growth/cro-experiment-design) or a [measurement plan precedes the build](/journal/playbooks/measurement-plan-before-build): when people trust that a number means one thing, they ask better questions, faster, and they act on answers. That behaviour is the product. The dashboard is just the packaging.

A taxonomy session — entity map, verb glossary, grammar, property dictionary, screen list — is two workshops and a spreadsheet. It's the highest-leverage week in a growth engagement, and it's where our [growth practice](/services/growth) starts every measurement conversation. If your dashboards have entered the "which signup event is the real one" era, [tell us about it](/contact); this is a delightfully fixable problem.

## Key takeaways

- The taxonomy outlives the tool. Design event and property names as an artefact before any platform evaluation; let the taxonomy disqualify tools.
- Draft five sections: entity map, verb glossary (twenty verbs, one per concept), `entity_verb` past-tense grammar, property dictionary with types and controlled vocabularies, and a stable screen taxonomy.
- Carry a reserved core property set (`screen`, `surface`, `plan_tier`, `experiment_ids`) on every event — it's the cheapest fifty future analyses you'll ever buy.
- Audit inherited schemas for the seven sins, synonym verbs first; fix the ten business-critical events to beyond-reproach standard and let the rest follow.
- Migrate by aliasing forward and archiving history with documented seams — never by backfilling.

## FAQ

**Isn't this what analytics-governance tools and CDPs are for?**
They can enforce a taxonomy; they cannot invent one. A CDP happily pipes forty synonym events to five destinations with perfect reliability. The craft is deciding what the names mean; the tooling just makes disobedience expensive. Sequence matters: grammar first, enforcement second.

**Past tense — really? People fight us on this.**
Yes, and we win the fight with one demo: open the event list and read it aloud. `report_exported`, `member_invited` reads as a ledger of things that happened, which is what analytics is. `report_export` reads like a button label and ages into ambiguity ("does this fire on click or on success?"). Past tense forces the question of *when* an event fires to have a real answer.

**How do we handle events that don't fit the grammar — third-party webhooks, legacy SDKs?**
Wrap them. One translation layer at the boundary converts `ORDER-COMPLETE_V3` from your payments provider into `order_completed` with your property dictionary applied. Never let a vendor's naming convention into your schema unwrapped; vendors change, and your schema shouldn't notice.

**How long should the taxonomy document be allowed to get?**
Fifty events covers most products' core questions; past about 150, growth usually signals missing properties (you're encoding context in names again) or missing pruning. Review the count quarterly the way you'd review bundle size. Both are junk-drawer metrics with a direct line to user trust — one in the interface, one in every decision made about it.
