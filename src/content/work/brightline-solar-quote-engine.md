---
title: "Brightline Solar: from PDF quote form to 40-second estimate"
description: "How we replaced a solar installer's PDF quote form with a 40-second estimate engine — lifting qualified leads 71% and cutting cost per lead by a third."
slug: brightline-solar-quote-engine
cluster: work
tags: ["case study", "climate", "lead generation", "conversion design", "quote calculator"]
date: 2025-05-08
author: Sam Whitfield
keywords: ["lead generation case study", "quote calculator ux", "climate tech marketing", "solar website design"]
readingTime: 8 min read
client: Brightline Solar
industry: Climate
services: ["Product design & engineering", "Websites", "Growth"]
year: 2025
heroImage: /images/work/brightline-solar-quote-engine.jpg
heroAlt: "Editorial flat-lay: a miniature model rooftop with tiny solar panels, a brass slide rule and folded paper bill on cream paper — the Brightline Solar case-study hero."
stack: ["React", "TypeScript", "Node", "Postgres", "MapLibre", "Cloudflare Workers"]
demo: brightline-solar-quoter
---

Brightline Solar installs residential panels across Queensland and northern New South Wales. Good crews, honest pricing, ten years of five-star reviews — and a website whose quote journey was a downloadable PDF. A form you had to print, fill in, photograph and email. In 2024. The MD knew it was costing them work; what he didn't know was how much. Our estimate, after a fortnight of analytics archaeology and call-log listening: roughly two-thirds of high-intent visitors were evaporating between "Get a quote" and a human ever learning they existed.

This is how we replaced a dead document with a 40-second estimate engine, and what happened to the pipeline when we did. Figures are illustrative — every house, roof and market is different — but the shape of the result is real.

## The challenge

Solar is a considered purchase with an impatient first step. A homeowner's interest spikes in a specific moment — a frightening quarterly bill, a neighbour's new array, a 40-degree weekend — and decays within days. Brightline's journey wasted the moment: the PDF asked for information the visitor couldn't possibly have at hand (roof pitch, switchboard photo, meter number), promised a callback "within 5–7 business days", and delivered a quote two to three weeks later. By then the moment had passed, or a competitor with a faster pencil had taken it.

Three specific failure modes surfaced in our research:

**The form interrogated before it gave.** Seventeen fields before any value returned. The psychology was all wrong — it read as homework, not help. We've written about this pattern generally in [designing forms people actually finish](/journal/web-design/forms-people-finish): reciprocity first, interrogation later.

**Every lead looked identical.** A renter browsing out of curiosity and a cash-ready owner with a 45-square north-facing roof entered the same queue. Sales spent 60% of their time on calls that could never close.

**The estimate lived in someone's head.** One senior estimator, one spreadsheet, one deeply held fear of publishing numbers before a site visit. Meanwhile every competitor's ad screamed "instant quote!"

The constraint that defined the build: Brightline's sales team is exactly four people. The tool had to *reduce* their call load while raising close rates — not flood the queue with tyre-kickers.

## The approach

**Give the number first.** Our entire architecture inverts the industry pattern. The visitor gets a real, defensible estimate — system size, annual saving, payback window — in under 40 seconds, before we ask for anything personal. Two inputs open the flow: address and quarterly bill. That's it. Address resolution runs against a geocoder, drops a pin on a map, and only then do we gently ask the visitor to nudge the pin onto their actual roof. The nudge game-ifies the one step that matters for accuracy.

**Heuristics with honest labels.** We built a shade-and-eligibility engine from mocked-but-principled rules — roof orientation from the building footprint, shading penalties by surrounding canopy, tariff assumptions by postcode band — and, crucially, we showed our working. Every estimate carries a confidence band and a "why this number" drawer that lists the assumptions in plain English. Solar has a trust problem; showing the maths was the single most commented-on feature in user tests. The same "impossible to look away, impossible to misunderstand" discipline we applied to [Meridian Climate's council data explorer](/work/meridian-climate-data-explorer) applied here to a sales tool.

**Finance is content, not an afterthought.** Rather than bolting a loan calculator to the end, the flow presents three routes side by side — cash, green loan, and a power-purchase-style plan — with total ten-year cost for each. Cash isn't pushed; the honest comparison is the persuasion. Roughly 40% of completers explore all three tabs, which told sales *exactly* what to prepare before the call.

**Qualify with generosity.** After the estimate, the form asks for the four things that actually predict a job: ownership status, roof age, decision timeframe, and whether anyone else is quoting them. Each question is framed as benefiting the visitor ("so we don't quote you for a roof that needs work first"). Lead score is computed inline; high scorers see a live booking calendar with real crew-visit slots, low scorers get a genuinely useful savings guide and a polite nurture track. The [experiment design discipline](/journal/growth/cro-experiment-design) we preach — pre-registered hypotheses, pre-agreed kill criteria — governed every A/B test we ran here, including the one that killed our beloved animated roof-tilt slider (it entertained, it didn't qualify).

**A quote the office can stand behind.** Estimates generate server-side, are stored with their assumptions, and expire after 30 days with a graceful re-estimate path. Sales inherits a lead record containing the actual numbers the visitor saw — no more "well, the website said" conversations.

## The outcome

Nine months post-launch, illustrative results:

- **Qualified leads up 71%** against the same seasonal period, with "qualified" defined strictly: owner-occupied, roof viable, timeframe under six months.
- **Cost per qualified lead down 33%**, as paid spend was re-cut toward the keywords and suburbs the engine proved converted.
- **Estimate completion: 64%** of people who enter an address finish the flow — against 9% who ever returned the PDF.
- **Sales time per closed job down ~40%.** Reps open calls with the system size, shade assumptions and finance preference already known. The first call got 12 minutes shorter and noticeably friendlier.
- **Quote-to-close window: 16 days → 6 days** for calendar-booked visits, because the moment of intent is met while it's still warm.

You can play with a working slice of the engine — mocked data, same mechanics — in [the Brassfern lab](/lab). If your own pipeline has a PDF-shaped hole in it, [this is exactly the kind of growth engineering we do](/services/growth), and [the brief form is mercifully short](/contact).

## What we'd tell anyone building a quote engine

First: the estimate is the marketing. Spend your craft budget on the quality and transparency of the number, not the landing page around it. Second: qualification questions convert *better* after value is delivered, not before — the order of operations is the design. Third: give sales a record of exactly what the visitor saw. The tool isn't finished when the form submits; it's finished when the first call starts two moves ahead.
