---
title: "Northwind Ledger: rebuilding the dashboard accountants actually open"
description: "How we rebuilt Northwind Ledger's dashboard around a 40-second morning ritual — sparklines over charts, cash anxiety first, and a hard performance budget."
slug: northwind-ledger-dashboard-rebuild
cluster: work
tags: [fintech, dashboard design, data visualisation, product design, performance]
date: 2025-05-21
author: Priya Nair
keywords: [fintech dashboard case study, accounting software ux, dashboard design, data hierarchy, northwind ledger]
readingTime: 8
client: Northwind Ledger
industry: Fintech
services: [Product design & engineering, Websites]
year: 2025
stack: [React, TypeScript, Node, Postgres, D3]
demo: northwind-ledger-budget
---

Northwind Ledger is bookkeeping software for small businesses — invoicing, expenses, payroll, the whole ledger. By the time they called us, they'd spent two years building a dashboard designed to impress investors rather than owners. Seventeen configurable charts at login. A drag-and-drop grid nobody dragged. And a login-to-first-number wait that their analytics politely described as "up to nine seconds on a cold cache."

Their head of product, Dana Mercer, framed the brief with unusual honesty: "Our dashboard demos beautifully. Nobody opens it twice."

## The challenge

Some products get used because they're good. Accounting software gets used because the alternative is worse, so engagement is a story you have to earn. Northwind's numbers told an uncomfortable one: only a sliver of active accounts viewed the dashboard weekly, and the ones who did left within seconds.

We spent the first fortnight doing what we always do before touching a pixel — watching people work. We sat (virtually) with eleven owners and nine bookkeepers across the morning. What we saw rewrote the brief:

- **The dashboard is a ritual, not a report.** Owners open it with the first coffee, around 7:15. They want three answers in under a minute: *Am I okay? Who owes me? What do I owe?* Then they leave, reassured or rattled, and get on with the day.
- **Charts were the wrong density.** A line chart answers "what's the shape of this?" Owners were asking "is this number fine?" Those are different questions, and a seventeen-chart page answers neither quickly.
- **The bookkeepers were the power users nobody designed for.** They lived in the product eight hours a day with a completely different attention budget, and the demo-first grid served them worst of all.

The technical constraint matched the human one: the dashboard query path re-computed aggregates on every load. Any redesign that kept that architecture was lipstick on a furnace.

## The approach

### Design for three tiers of attention

We structured the new dashboard around the actual rhythm of use, in order of speed:

**Glance (0–10 seconds).** One hero number — cash runway, in plain weeks — flanked by two sentences in real language: *"You're owed $18,400. Three invoices are overdue."* Colour does the emotional work; type does the factual work. Nothing on this tier requires interpretation.

**Scan (10–40 seconds).** A row of compact cards — money in, money out, overdue invoices, upcoming bills — each led by a sparkline. We chose sparklines over charts deliberately: a sparkline answers *trend* ("this is drifting down") without demanding the attention a labelled axis does. One trend per card, one number per card. If a card needed a legend, it didn't belong here.

**Dig (40 seconds+).** Every card is a doorway. Click "overdue invoices" and you land in the invoice list pre-filtered, not in another chart. Our rule, borrowed from journalism: the dashboard is front page, and front pages don't contain the articles.

For the bookkeepers we built the opposite of the owner view: dense tables, keyboard-first batch actions, and saved views that remember filters across sessions. Same data layer, entirely different skin — the [product practice](/services/product) calls this "one truth, two tempos."

### An alert grammar with three states

The old dashboard had fourteen kinds of warning. We cut it to three: **fine** (no ink spent), **watch** (amber, quiet), **act** (a single red item with a verb attached — "Chase invoice #1041"). If everything on a page is urgent, nothing is; alert inflation had trained users to ignore the page. Under the new grammar, a red item means something genuinely needs doing today, and users learned to trust that.

### Performance as a feature, not a ticket

A morning ritual dies at a nine-second load. We set a budget before design sign-off: first meaningful paint under 1.5 seconds on a mid-range laptop over office wifi, dashboard data under 60KB for the glance tier. The work was gloriously unglamorous — pre-aggregating rollup tables nightly in Postgres, streaming the glance tier first, virtualising the long tables on the dig tier, and lazy-loading every chart below the fold. Shipping in weekly demos kept the budget honest; per [our approach](/approach), Northwind's team saw real builds from week two, and week-Thursday regressions got caught while they were still cheap.

### Pricing discipline's cousin: scope discipline

Northwind wanted everything — forecasting, bank feeds, an AI summary. We protected the ritual. Forecast charts moved to phase two; the summary stayed a one-line sentence, not a chatbot. This is the part of [fixed-scope engagement](/pricing) clients thank us for later: a dashboard that does three jobs brilliantly, shipped on time, instead of five jobs timidly, shipped late.

## The outcome

Eight weeks from kickoff to rollout, with a staged release to ten percent of accounts first. As with everything in our [work index](/work), the figures below are illustrative — this is a fictional concept project — but they show how we'd measure success on a real engagement of this shape:

| Metric | Before | After |
| --- | --- | --- |
| First meaningful paint (p75) | ~8.7s | ~1.3s |
| Weekly viewers of the dashboard | 22% of active accounts | 61% |
| Median time on dashboard | 2m 40s | 48s |
| Overdue-invoice actions taken per red alert | 19% | 54% |
| Bookkeeper task completion (batch reconcile) | baseline | 31% faster |

The median-time number deserves the asterisk it earned in our readout: halving time-on-dashboard was a *win*, not a concern. The ritual had been shortened to fit the morning. Dana's team briefly panicked at the drop; the daily-open rate, the alert action rate and the support-ticket language told the real story. People weren't bouncing. They were *finishing*.

Six months later, Northwind's marketing site stopped leading with a dashboard screenshot — the screenshots were finally boring. That was the point. As we wrote when [rebuilding Hearthbrew's brand system](/work/hearthbrew-brand-system), the best systems are the ones that survive their makers and keep working on an ordinary Tuesday.

> "Our old dashboard was a demo. The new one is a habit. Customers open it before their email now, and the scariest metric — people ignoring red alerts — basically vanished." — Dana Mercer, Head of Product, Northwind Ledger (fictional)

## Stack & credits

- **Product design:** research, information hierarchy, glance/scan/dig system, alert grammar, bookkeeper views
- **Engineering:** React + TypeScript front end, rollup aggregation in Postgres, streamed data fetching, table virtualisation, D3 for sparklines
- **Performance:** p75 budgets wired into CI; regression alerts on the aggregate path
- **Squad:** design lead, product designer, two engineers, producer — [how our squads work](/approach)
- **Next:** rebuilding a dashboard that ignores its users? [Start a project](/contact)
