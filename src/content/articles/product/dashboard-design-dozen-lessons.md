---
title: "Dashboard design: twelve lessons from twelve dashboards"
description: "Twelve hard-won dashboard design lessons from a dozen B2B products: hierarchy of attention, progressive disclosure, benchmark context, and when to kill a chart."
slug: dashboard-design-dozen-lessons
cluster: product
tags:
  - dashboard design
  - data visualisation
  - B2B product design
  - information hierarchy
date: 2025-05-20
author: Dev Khatri
keywords:
  - dashboard design
  - data ux
  - b2b product design
  - information hierarchy
readingTime: 10
---

Between 2021 and this year we've shipped, rebuilt or forensically audited twelve B2B dashboards — accounting, logistics, clinical ops, energy, two analytics suites and a few we'd sooner forget. Some of what follows is in our earlier piece on [answer-first hierarchy](/journal/product/dashboard-design-hierarchy); most of it isn't, because it only surfaced through repetition. Twelve lessons, one per scar.

## 1. The dashboard is not the product; the decision is

Every dashboard failing in the wild fails the same way: it displays the data the system happened to collect, arranged by the tables it happened to come from. The fix is to design backwards from named decisions. Before we draw anything, we list the five decisions the user must make on this screen — "Is the fleet utilisation off enough to act?", "Which invoice needs chasing *today*?" — and every element must serve one. Data with no decision attached is decoration with a database behind it.

## 2. The first viewport answers; it doesn't tour

The top of the screen answers "is everything okay?" in under three seconds: status, trend, and the single most decision-relevant number. What the first viewport must never do is tour the data model — six equal KPI cards, three of which nobody acts on. On [Northwind Ledger's rebuild](/work/northwind-ledger-dashboard-rebuild) we cut eleven top-of-page metrics to four, with the overdue-receivables number rendered at triple the visual weight of the rest. The user's eye should know where to land before the page finishes painting.

## 3. A number without context is a trivia question

"1,247 active users" — good? Bad? A number only informs when it's pinned against context: previous period, target, or cohort. Our default triple: value, delta vs prior period, and a sparkline for shape. Targets beat periods when they exist ("78% of monthly cap, on pace"). The audit rule: point at any number on the dashboard and ask "compared to what?" If the screen can't answer, the number is furniture.

## 4. Kill charts that fail the 5-second read

We run a blunt test in design review: show the chart for five seconds, hide it, ask what it said. Charts that fail usually commit one of three sins: a pie beyond three slices, a dual axis (always a lie — two scales imply a relationship the data may not have), or a legend forcing constant eyes-off-the-data lookups. Direct-label everything you can. When a chart fails the test twice and nobody mourns it, delete it; dashboards improve more by deletion than addition.

## 5. Time series need annotations, not just axes

A revenue line that dips in March means nothing to a new hire and everything to anyone who remembers the pricing change. The highest-leverage dashboard feature we've ever shipped is event annotations on time series: deploys, campaigns, outages, pricing changes, rendered as subtle markers along the x-axis. It converts "what happened?" from a Slack archaeology session into a glance. If your data platform makes annotations hard, build them anyway — the dashboard exists to answer *why*, and time alone never does.

## 6. Progressive disclosure beats pagination

Power users want everything; everyone else wants three things. Progressive disclosure resolves it without duelling dashboards: the answer-first layer for everyone, an expandable context layer behind it ("why is this number up?" → contributing segments), and the full data grid one click deeper for the five percent who live in it. The [progressive disclosure patterns](/journal/product/progressive-disclosure-complexity) piece covers the interaction grammar; the dashboard-specific rule is that each layer must stand alone — drilling down should feel like zooming, not paging to a different product.

## 7. The empty, loading and error states carry the trust

Dashboards suffer state catastrophes more than any other screen type: a failed widget inside a working page is scarier than a failed page, because it silently corrupts everything around it. A chart mid-fetch needs a skeleton in its final shape; a failed chart needs an honest, contained error with a retry — never a stale number wearing a fresh coat. Zero-data states for new accounts are an [empty-state design](/journal/web-design/empty-loading-error-states) problem ("here's what this chart shows once you've imported"), not a void. And every tile needs a visible "updated 4 min ago" — a dashboard's single most corrosive failure is users quietly uncertain whether they're looking at now.

## 8. Filters are a loan; saved views are equity

Global filter bars accumulate like technical debt — one field per stakeholder request — until the dashboard is a query builder no one asked for. Our caps: five global filters maximum; anything more lives per-section. And the moment a dashboard has filters at all, it needs saved views, because the second-most-common user behaviour after viewing is *reconstructing last Tuesday's view from memory*. Saved views with obvious names ("Q3 — NSW sites only") convert filter configuration from a chore into an asset, and they make shareable links possible — which is how dashboards escape the app and enter the meeting.

## 9. Tables are charts for people who live here

First-time users read charts; daily operators read tables. Dense, sortable, keyboard-navigable data grids are a feature of maturity, not a fallback — our [data table patterns](/journal/product/data-dense-tables-ux) cover the depth. The dashboard lesson: every chart should have a "view as table" escape hatch, for accessibility, for export-happy finance teams, and for anyone who trusts rows over shapes.

## 10. Alerts belong beside the chart, not in email

"A threshold fired" email with no context trains users to ignore alerts within a fortnight. Alert design is dashboard design: surface threshold breaches inline, at the tile, with the breach *visualised* (the recent segment of the line in warning colour, the threshold drawn). Email and Slack alerts should deep-link to that annotated state, not announce a naked number. We track alert-to-action rate as a design metric; below 20% sustained, the alert is noise and either the threshold or the design is wrong.

## 11. Design mobile for glance, not parity

Nobody reconciles accounts on a phone, and pretending otherwise ships a cramped mini-desktop. Mobile dashboard hierarchy: status ("all systems normal"), the three glanceable numbers, and alerts — with a clear "open desktop for detail" honesty. The [375px navigation discipline](/journal/web-design/navigation-that-survives-mobile) applies doubly to data surfaces: prioritise ruthlessly, collapse the rest.

## 12. Instrument the dashboard itself

Dashboards are products; measure them like products. Tile-level engagement tells you what to delete (the chart nobody expands for two consecutive quarters). Time-to-first-insight — how quickly after landing users reach the information they came for — tells you whether the hierarchy works. And watch the export button: sustained heavy export-to-Excel means the dashboard fails its job of making the data usable *in situ*. Export volume going down is our favourite launch retro metric.

## Key takeaways

- Design backwards from five named decisions; any element serving none of them is decoration.
- Context turns numbers into information: every value pins to a period, a target, or both — plus a 90-day sparkline.
- Five-second test every chart; delete what fails twice. Annotate time series with events so "why?" answers itself.
- Layer with progressive disclosure, cap global filters at five, and ship saved views the day filters exist.
- States carry trust: shaped skeletons, honest contained errors, zero-data previews, and a visible freshness stamp on every tile.
- Measure the dashboard itself — tile engagement, time-to-insight, alert-to-action, and declining export volume as the success metric.

## FAQ

**One dashboard or several role-based views?** Start with one answer-first layer plus role-tuned sections, share what can be shared, and fork a view only when two roles share under half their decisions. Premature splitting creates dashboards that drift apart and get maintained at half effort each.

**How many tiles per screen?** Our ceiling is one dominant answer, 2–4 supporting tiles, one list. Roughly six elements of consequence. Past that users start skimming in Z-patterns and your carefully sequenced story is a collage.

**Should users be able to customise and rearrange?** Only after the default view is demonstrably excellent, and only layout-level customisation (hide, reorder, resize). Full widget-builders delight two percent of users and double the QA surface for everyone.

**Dark mode dashboards — worth it?** For ops rooms and on-call contexts, yes, with re-tuned chart palettes; for general B2B, it trails the priority list far behind annotations, states and alerts. A dark dashboard with unannotated charts is still an unannotated dashboard.

**What's the fastest improvement to an existing dashboard?** Add the freshness stamp and the three-sentence "what am I looking at" context to the top tile, annotate the main time series with the last quarter's known events, and delete the two charts nobody can describe. An afternoon, and users notice by Friday.
