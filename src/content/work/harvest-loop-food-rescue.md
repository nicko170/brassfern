---
title: "Harvest Loop: logistics dashboards for a food-rescue charity"
description: "A driver app and donor dashboard for a food-rescue charity — built for cracked Android phones, volunteer patience and funders who reply with 'prove it'."
slug: harvest-loop-food-rescue
cluster: work
tags:
  - case study
  - non-profit
  - logistics
  - offline-first
  - PWA
date: 2025-11-10
author: Aiko Tanaka
keywords:
  - non-profit case study
  - logistics dashboard
  - charity tech
  - volunteer ux
  - offline-first app
readingTime: 9 min read
heroImage: /images/work/harvest-loop-food-rescue.jpg
heroAlt: "A paper-craft city map strung with a brass rescue route: pins, a paper van and crates of folded paper produce."
client: Harvest Loop
industry: Non-profit
services:
  - Product design & engineering
  - Websites
year: 2025
stack:
  - React
  - TypeScript
  - PWA (Workbox)
  - MapLibre
  - Node
  - Postgres + PostGIS
---

Harvest Loop is a fictional-but-plausible food-rescue charity operating across greater Melbourne: two refrigerated vans, a depot in Footscray, 340 food donors (supermarkets, farms, caterers) and 90 recipient agencies from shelters to school breakfast programs. Their mission is moving 40 tonnes of edible food a week from bin-bound to bellies. Their tooling, until recently, was a whiteboard, three WhatsApp groups and a shared spreadsheet called FINAL_runs_v7.xlsx.

The spreadsheet's name told you everything about the team's week. We were brought in to build the coordination layer the charity had outgrown. Here's what we made, what we got wrong first, and what happened after launch. All figures are illustrative — the shape of the result, not a promise.

## The challenge

Food rescue is a logistics business wearing charity clothes, but it differs from commercial logistics in one decisive way: **the labour force volunteers, and can simply stop showing up.** A courier company can mandate a device and dock pay for a failed scan. Harvest Loop's drivers are retirees, students and shift workers donating a Tuesday morning. Whatever we built had to work on a five-year-old Android with a cracked screen, in a loading dock with one bar of signal, operated by someone using it for the first time in three weeks.

The second challenge was trust in both directions. Donors — especially the big supermarket accounts — needed compliance-grade receipts: what was collected, when, by whom, at what temperature. Recipients needed predictable arrivals. Funders, the third audience, needed impact numbers that didn't take the office manager four days at the end of every quarter to assemble from that spreadsheet.

The third challenge was budget-shaped. Total engagement: tight. Ongoing maintenance: tighter. Anything we shipped had to be operable by a part-time office manager, not a retained dev team. That ruled out a lot of fashionable architecture on day one.

## The approach

**A PWA, not a native app — on purpose.** The obvious move was React Native. We deliberately went the other way: an installable progressive web app. No app-store approval cycles, no version fragmentation across volunteers' devices, no "please update" screen between a driver and their run. Workbox service workers cache the day's run sheet the moment a driver opens it at the depot — on depot wifi — so every subsequent interaction works offline by default, syncing when signal returns. For the full reasoning, our journals on [offline-first thinking](/journal/product/optimistic-ui-integrity) cover the same integrity trade-offs we applied here.

**The run sheet is one column of big, honest cards.** Each stop is a card: where, who to ask for, what to expect ("approx. 3 crates, ask for Deniz"), and one of exactly three buttons — *Collected*, *Partial*, *Not available*. No photo requirement (vague "prove it" vibes erode volunteer goodwill; we made photos optional and got them 60% of the time anyway). Confirmations are haptic and enormous. The entire driver flow was designed so the whole run can be completed with gloves on, and tested that way.

**Dashboards that answer first, chart second.** The donor dashboard shows a supermarket the two things they actually log in for — this month's diverted kilograms and their compliance receipts — above any chart, consistent with our [answer-first dashboard philosophy](/journal/product/dashboard-design-hierarchy). The ops dashboard for the depot team shows today's runs as a glancing grid: green, amber, red, and an exception queue that is the *only* screen the office manager must watch. Everything else is a report, not a dashboard.

**Impact reporting as a first-class feature, not an export button.** Every quarter, the system composes a funder-facing impact page — tonnes diverted, meals-equivalent, CO₂e avoided, with the methodology written in plain English right under the numbers — at a shareable URL. Funders stopped receiving PDFs and started receiving pages they could forward. We think of this as the same move we made for [Meridian Climate's public data explorer](/work/meridian-climate-data-explorer): the report *is* the product.

**Operability before elegance.** One small Postgres with PostGIS for catchments, a Node API, server-rendered admin, everything deployable by one documented script. We wrote the runbook like the charity's next technical volunteer would read it in year three, because that's who will.

## The outcome

Nine months after launch:

- **Pickup completion rate rose from 82% to 96%.** The miss reasons changed, too — "didn't see the message" effectively disappeared once the run sheet replaced three WhatsApp threads.
- **New driver onboarding dropped from a 40-minute buddy ride-along to a 9-minute self-serve flow** — a simulated Sunday run they complete on their own phone before their first real shift. Completion of the simulation is 94% before first shift, which the ops team now uses as their readiness signal.
- **Quarterly reporting went from four days to forty minutes.** The office manager now edits the *words* on the impact page instead of assembling its numbers. Two funders independently increased their grants the quarter after impact pages launched, citing the specific and checkable reporting.
- **Donor compliance queries fell by roughly 70%** because receipts are self-serve, timestamped and exportable. The two supermarket chains on the account expanded Harvest Loop's collection days after the receipts made their own internal reporting easier.
- **The whiteboard is still there.** Rituals matter. It's just now redundant, which the team's coordinator describes as "the best feeling".

## Stack and team

React and TypeScript PWA with Workbox for offline; MapLibre for route maps; Node and Postgres with PostGIS for catchment queries; SMS fallbacks via an off-the-shelf messaging API for the three volunteers with truly ancient handsets. Squad: one product designer, one engineer, one producer, plus Harvest Loop's coordinator embedded two days a week for the full engagement — our standard shape, described in [how we work](/approach).

## What we'd tell another charity

Design for the volunteer's patience, not the org chart's optimism. Budget a third of the project for the boring operability — runbooks, deploy scripts, the part-time successor. And lift your impact numbers above the fold: in the [non-profit world](/industries/non-profit), proof is the product.

If you run logistics with volunteer hands, see more of [our case studies](/work), read our thinking on [product design](/services/product), or [tell us about the spreadsheet you're trying to kill](/contact).
