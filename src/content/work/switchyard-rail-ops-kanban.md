---
title: "Switchyard: teaching a rail-ops board new manners"
description: "For a rail-ops platform, the board is the product. We rebuilt Switchyard's kanban with a full keyboard shuttle and warnings that mean it."
slug: switchyard-rail-ops-kanban
cluster: work
tags: [kanban, saas, accessibility, drag and drop, keyboard]
date: 2026-04-28
author: Felix Brandt
keywords: [kanban, SaaS UX, drag and drop, accessibility, keyboard]
readingTime: 8
client: Switchyard
industry: SaaS
services: [Product design & engineering]
year: 2026
stack: [React, TypeScript, Pointer Events, ARIA live regions, Postgres]
heroImage: /images/work/switchyard-rail-ops-kanban.jpg
heroAlt: "Editorial still life: a brass index-card holder, blank cream cards, a stencil stamp and a dark green pencil on warm paper."
demo: switchyard-kanban
---

Switchyard sells scheduling software to freight-rail operators. Their customers' dispatchers spend entire shifts inside one screen: a board of wagon jobs moving through lanes — *incoming*, *crewed*, *in transit*, *held*, *cleared*. When we started the engagement, their head of product put it flatly: "The board isn't a feature of the product. The board *is* the product. And our board has bad manners."

She wasn't wrong. The board had been built in the jQuery era and grown by accretion: drag-and-drop that only worked with a mouse, no limits on lane size, and a concurrency model best described as "last save wins, silently." Two dispatchers moving the same job card meant one of them lost their decision without ever knowing it happened. A companion interactive slice of the rebuild is on the bench in our [Lab](/lab); the case study below is the full story.

## The challenge

Kanban boards are easy to demo and brutal to operate. Three problems, in descending order of embarrassment.

**The board was mouse-only, and procurement noticed.** Every interaction — assign a job, re-prioritise, move to a lane — began and ended with a pointer drag. Switchyard was starting to lose enterprise deals at the accessibility questionnaire stage: a scheduling platform that excludes dispatchers who navigate by keyboard or screen reader is a procurement non-starter, and rightly so. This is the WCAG basics that [product teams most often get wrong](/journal/product/wcag-aa-product-teams), applied to the single most complex interaction in the app.

**WIP limits existed on paper only.** Ops leads had lane policies — never more than six jobs *in transit* per crew region — but the software shrugged. Lanes silently accumulated forty-card piles, and the pile *was* the delay data nobody could see. The discipline that makes kanban work had been outsourced to memory and shouting.

**Concurrency was a coin flip.** Dispatch is a team sport with one ball. The old board's optimistic saves meant two people could act on stale state and both believe they'd succeeded. In rail ops, "I thought I'd moved that job to Crew B" is how wagons end up in the wrong yard — operationally expensive, and corrosive to trust in the tool.

## The approach

### The keyboard shuttle: accessibility as headline, not footnote

We designed the keyboard interaction *first* and let it set the bar for everything else. Focus a card, press `Space` or `Enter` to pick it up — the card audibly and visually lifts, with a subtle lift shadow for sighted users and an announcement for screen readers: "Wagon 441 picked up. Currently in Crewed, position 2 of 8." Arrow keys move between cards, `Left`/`Right` between lanes, `Space` drops. `Escape` puts everything back, always, no questions asked.

Every action speaks through an ARIA live region in plain operational language — "Wagon 441 moved to Held, position 1. Lane now has 3 jobs, limit is 4." The announcements were written with dispatchers, not for them; we tested phrasing until the narration sounded like a good co-worker, not a screen reader reading a tooltip. Reduced-motion preferences collapse the transitions to instant, because a vestibular-sensitive dispatcher shouldn't have to choose between the product and their balance.

The punchline we now repeat in every kickoff: the pointer interactions got *better* because the keyboard ones demanded structure every action had to satisfy — named positions, explicit orders, announceable results. We wrote about the general version of this principle in our [focus states work](/journal/web-design/focus-states-design): constraints compound.

### Pointer drags that behave

Pointer Events (not the crusty HTML5 drag API) back the whole interaction: a 6px movement threshold before a drag starts so clicking a card never becomes an accidental move, subgrid-aligned drop indicators that show exactly where the card will land, and zero layout jumping while you hover. Dragging on a touch screen got its own pass — long-press to lift, edge-of-lane auto-scroll capped at a humane speed.

### WIP limits as honest warnings

Lane limits became real but grown-up. Crossing a limit doesn't block you — rail ops has emergencies, and software that says "computer says no" to a dispatcher with a blocked main line is software that gets bypassed. Instead, the lane header turns brass, the drop is allowed, and the board asks for a one-line reason that goes into the ops log: *"Over limit: derailment clearance, expect drift until 15:00."* The warning is persistent, specific, and audible to the whole team — no silent pile-ups, no nagging. Limits ship with per-lane configuration for ops leads, and the defaults came from analysis of Switchyard customers' actual healthy boards, not from a framework's demo video.

### Optimistic UI, with integrity

Concurrency was rebuilt so failures are visible, never silent. Moves apply optimistically — the card lands instantly — but carry a pending state until the server confirms, and a conflicting edit produces an explicit resolution state: "Dana moved this job to Crew B 4 seconds ago. Keep your move or use Dana's?" The card shows collaborator ghost chips ("Dana is holding this") the moment someone else lifts it. This is the pattern we've written up as [optimistic UI with integrity](/journal/product/optimistic-ui-integrity): the speed of optimism, the honesty of a ledger.

The audit log got the same treatment — every move, override, and conflict resolution is recorded with actor and timestamp, because rail operators live in a world of incident reviews. The product's memory became a feature customers now demo to *their* boards.

### Performance at operational scale

A real dispatch board carries 400+ cards across a dozen lanes and must scroll at 60fps on the wall-mounted TV in the ops room as well as a laptop. The board virtualises off-screen cards, keeps the drag layer compositor-only, and holds a hard budget: no interaction over 100ms to first paint of feedback, ever. Budgets are CI-enforced; a regression in drag latency fails the build like a broken test, because to a dispatcher it *is* a broken feature.

## The outcome

Two squads, twenty-two weeks, one board that became the sales team's favourite demo. Metrics from this concept engagement are illustrative, but they're the shape of what we'd hold a real rebuild accountable to:

| Metric | Before | After |
| --- | --- | --- |
| Board fully operable by keyboard | No | Yes — every action, full parity |
| Screen-reader task completion (audit tasks) | 2 / 9 possible | 9 / 9, zero critical blockers |
| Enterprise deals stalled on accessibility | 3 in the prior year | 0 since relaunch; WCAG conformance became a sales asset |
| Cards lost to silent concurrent edits | ~40/month per customer | 0 — conflicts resolve explicitly |
| Lane-limit breaches without a logged reason | unmeasurable (no tracking) | 4% of drops, all with reasons |
| Drag feedback latency (p95) | 340 ms | 46 ms |

The row that surprised Switchyard most is the accessibility-to-revenue pipeline. The keyboard shuttle was scoped as a compliance cost; it shipped as a differentiator. Dispatch trainers now teach new staff the board *by keyboard* because it's faster to learn the numbered lanes than to aim a mouse, and two enterprise customers cited the conformance report as the tie-breaker in their evaluations. Accessibility, done properly, has a return on investment you can put in a board pack.

> "We stopped apologising for the board in sales calls. Now we open with it. The keyboard thing was supposed to be a checkbox — it turned out to be the feature dispatchers brag about." — Esme Voulgaris, Head of Product, Switchyard (fictional)

## Stack & credits

- **Product design:** keyboard shuttle grammar, announcement language, WIP-warning voice, conflict-resolution flows, ops-log design
- **Engineering:** React + TypeScript, Pointer Events drag system, ARIA live architecture, optimistic sync with explicit conflict resolution, virtualised lanes, latency budgets in CI
- **Accessibility:** WCAG 2.2 AA programme with assistive-technology users in the review panel, reduced-motion parity, conformance report for procurement
- **Squad:** principal engineer, product designer, two engineers, accessibility specialist, producer
- **A complex tool that needs to feel simple?** That's the work we do under [product design & engineering](/services/product) — [talk to the studio](/contact)
