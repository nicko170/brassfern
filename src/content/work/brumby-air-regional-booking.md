---
title: "Brumby Air: booking a Cessna seat like ordering coffee"
description: "A booking engine for a 14-route outback airline: weight-limit honesty, calendars that admit empty days, fare comparison, and pages that survive rural connections."
slug: brumby-air-regional-booking
cluster: work
tags: [airline booking, travel ux, regional, fare comparison, performance]
date: 2026-01-22
author: Tomás Reyes
keywords: [airline booking ux, regional airline website, fare comparison, travel booking flow, slow connections performance]
readingTime: 9
client: Brumby Air
industry: Hospitality
services: [Websites, Product design & engineering]
year: 2026
stack: [Astro, React islands, TypeScript, Node, Redis]
---

Brumby Air (a fictional client in our concept portfolio) flies fourteen routes between regional and remote Australia — Cessna Caravans and Twin Otters, nine to thirteen seats, landing strips that double as the town's emergency runway. Their pilots are excellent. Their website was a tragic artefact: a booking flow that timed out on satellite internet, quoted one price and charged another, and answered the question "does the Tuesday flight exist?" with a silent 404.

Their general manager, Dianne Wills, framed the stakes better than we could: "Half our passengers are flying for a medical appointment, a funeral, or a court date. The booking flow is not a sales funnel. It's the front desk of a remote town."

## The challenge

Regional air travel imposes constraints the major-carrier playbook never meets, and Brumby's old site pretended none of them existed.

**Weight is a harder limit than seats.** A loaded Caravan on a 40-degree day at a short strip has a weight budget measured in single kilos. Passengers, bags and freight compete for the same allowance, and the old site sold thirteen seats regardless — leaving the check-in desk to have the worst conversation in aviation: which passenger's bag stays behind. This is a UX problem long before it's an operations problem, and it needed design, not disclaimers.

**The calendar lied by omission.** Brumby doesn't fly every route daily — some towns get two services a week. The old date picker offered every day and let availability fail at the *search results* step, one click deep into despair. For a passenger planning around a specialist appointment, that's not an inconvenience; it's misinformation.

**Fares were a riddle.** Three fare families with different change rules, but the differences surfaced only in a PDF of terms. Passengers bought the wrong flexibility for a trip where weather delays are a Tuesday, then discovered the difference at the worst moment.

**The network was the user.** A meaningful share of bookings happen on satellite links and phones in coverage shadows. The old flow was a 4MB single-page app that collapsed on anything slower than city broadband. Performance here isn't a developer vanity metric — we've argued elsewhere that [performance budgets are product decisions](/journal/engineering/core-web-vitals-field-guide) — it's whether a grazier can rebook a flight from the back paddock.

## The approach

We rebuilt the whole stack as an Astro site with React islands only where interactivity earns its bytes — the [islands architecture](/journal/engineering/islands-architecture-when) pattern this project became a poster child for. The marketing pages ship almost no JavaScript; the booking flow hydrates in stages, each step independently useful.

### The calendar tells the truth

The route-first calendar is the front door. Choose your route and you see six weeks of *actual* services — flights marked with seat counts, non-flying days rendered as honest gaps with the nearest alternative offered ("No Friday service — Thursday has 4 seats"). We fought for the empty days to be visible, and Dianne backed us: a calendar that admits its gaps earns more trust than one that hides them. Each date tile carries the starting fare, updated hourly, so comparison-shopping happens on the calendar itself rather than across seven abandoned searches.

### Weight, surfaced as generosity

Rather than hiding the weight budget, we designed the baggage step as a transparent trade: "Your fare includes 15kg. This flight has room for +10kg more today — $18." The allowance is computed per departure from actual load forecasts, and when a day is heavy the site says so *before payment*: "Hot day forecast — baggage over 15kg may travel on the next service. We'll confirm by SMS at 6pm." Nobody enjoys that message, but passengers told us in testing they vastly prefer it to the airstrip surprise. Scarcity honesty is a principle we carry through our [travel and hospitality work](/industries/hospitality): the constraint isn't the enemy, the surprise is.

### Fare families as decisions, not PDFs

The fare step compares the three families side by side in plain language — what changes cost, what refunds look like, what happens when weather cancels (everyone rebooks free; it's the fine print people fear most, so we put it in 16px type). A one-line recommendation engine reads the trip context — "leaving for a fixed appointment? The Flexible fare rebooks you onto the next service at no cost" — and the default selection is the honest cheapest fit, not the most expensive. In a quarter, Flexible fares grew anyway, because explained value converts better than dark patterns ever did. We see the same effect in [subscription design](/journal/ecommerce/subscription-ux-design): make the terms legible and people choose more, not less.

### Built for the paddock test

Every booking step is a server-rendered page that works with JavaScript disabled, submits by plain POST, and survives a dropped connection — draft state persists server-side keyed to a magic link in an SMS, so a passenger who loses signal at passenger-details comes back to a half-finished booking from any device, even hours later. Total JavaScript on the heaviest page: 74KB compressed. Largest contentful paint on a throttled 3G profile: 1.9 seconds. We load-tested the flow against a simulated satellite link with 2-second latency spikes, because that's not an edge case for Brumby — that's the median customer.

Accessibility ran on the same principle: the flow is a linear, keyboard-complete sequence with real labels and summaries a screen reader can recap — patterns we detail in our piece on [keyboard-first interfaces](/journal/engineering/keyboard-first-interfaces) and that matter doubly when your passengers skew older and your site might be operated one-handed in a ute.

## The outcome

Nineteen weeks from kickoff to full cutover, staged route by route. As with everything in our [work portfolio](/work), figures are illustrative of a real engagement of this shape:

| Metric | Before | After (six months) |
| --- | --- | --- |
| Direct online share of bookings | 34% | 71% |
| Booking completion rate (mobile) | 41% | 68% |
| Call-centre bookings per week | ~480 | ~190 |
| Median booking time | 11 min | 4 min |
| LCP on throttled 3G | 6.8s | 1.9s |
| Baggage disputes at check-in | "every flight, some days twice" | rare enough to be news |

The call centre didn't shrink — it changed jobs. The calls now are the ones worth having: group charters, medical travel, freight. Dianne's summary: "The website stopped being our biggest customer complaint and started being our best sales rep."

## What we learned

**Design for the constraint you're embarrassed by.** The weight budget felt like something to hide; turned into a fair, transparent trade, it became a revenue line and a trust signal at once.

**Empty states are content.** The calendar's non-flying days did more for credibility than any testimonial. Interfaces that admit reality get believed about everything else.

**Server-rendered isn't nostalgia.** For audiences on hostile networks — and that describes a lot of [product work](/services/product) outside the metro bubble — boring architecture is the radical choice. The fanciest thing a booking flow can do is finish.
