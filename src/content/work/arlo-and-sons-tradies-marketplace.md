---
title: "Arlo & Sons: a tradies marketplace that earned trust slowly"
description: "How we rebuilt a two-sided trades marketplace around verified work: comparable quotes, review integrity, trade-side dashboards and onboarding that favours patience."
slug: arlo-and-sons-tradies-marketplace
cluster: work
tags:
  - Marketplace
  - Product design
  - Trust & safety
  - Two-sided platforms
date: 2025-04-10
author: Aiko Tanaka
keywords:
  - marketplace case study
  - trust design
  - two-sided marketplace
  - reviews ux
  - tradie marketplace
readingTime: 8
client: Arlo & Sons
industry: SaaS
services:
  - Product design & engineering
  - Growth
year: 2024
stack:
  - React
  - TypeScript
  - Node
  - Postgres
  - Stripe
  - PostHog
heroImage: /images/work/arlo-and-sons-tradies-marketplace.jpg
heroAlt: "A brass spirit level, folded paper plans and two work pencils arranged on cream paper with a fern sprig."
---

Arlo & Sons was founded by two brothers in Footscray — one an electrician, one a software engineer — on a simple observation: homeowners treat hiring a tradie like a small act of courage, and good tradies treat lead-generation apps like a tax. When they came to us in early 2024, they had a working marketplace with a fatal characteristic: it grew by injecting leads, and it leaked trust at both ends.

The numbers told a specific story. Homeowners posted a job, waited a median of 26 hours for a first quote, then received three quotes in three incompatible formats — a paragraph, a phone-scrawled photo of a notepad, a formal PDF. Tradies paid per lead, quoted fast to justify the fee, and won about one job in nine. Reviews were four and five stars across the board, which is to say they conveyed nothing.

## The challenge

Two-sided marketplaces die of asymmetric trust. The homeowner fears a cowboy; the tradie fears a tyre-kicker who burns an evening of quoting for nothing. Most platforms resolve this by ranking whoever pays the most and letting volume paper over the damage. Arlo & Sons wanted the opposite: win by being the place where both sides behave well, and make good behaviour legible.

Discovery surfaced three hard problems:

- **Quotes weren't comparable.** A homeowner choosing between a $4,200 paragraph and a $6,800 itemised quote isn't comparing prices — they're guessing at scope. The cheapest quote often won precisely because it had left things out.
- **Reviews carried no signal.** Anyone could review; jobs weren't tied to payments; tradies could nudge happy customers immediately after a good day. Four-point-eight stars meant "exists".
- **The trade-side experience punished quality.** The faster you quoted, the more you spent. Careful operators — the ones the platform needed — subsidised the sprayers.

The brief, as co-founder Matt Arlo put it: "Make the boring, careful, insured tradie the obvious choice."

## The approach

**Verification is the onboarding.** We made the sign-up slower on purpose. Licence check, insurance certificate, ABN, two referees from real addresses — all verified before a profile goes live, and all shown on the profile with dated badges. Then the part most marketplaces skip: we gave trades something for their patience. A completed profile unlocks a public page with its own URL, photo slots of past work, and a review history that belongs to the tradie, not the platform. Tradies who finished verification were 2.4× more likely to still be active at six months. Onboarding friction, aimed at the right people, is a filter — not a wall. (We made the same argument in our piece on [activation metrics that mean something](/journal/product/activation-metrics-honest): measure the movement to value, not the speed of the sign-up form.)

**Quotes in a comparable shape.** The centrepiece is the quote template. Every quote answers the same fields: scope line by line, materials included or excluded, earliest start, valid-until date, and — our favourite invention — "what could change", a required field where the tradie lists what they can't see yet (rotten boards behind the wall, asbestos risk, access). The homeowner's comparison view places up to three quotes side by side, field against field, with missing items flagged in the row, not hidden away. Itemised quotes stopped being a competitive disadvantage, so more tradies wrote them.

**Reviews with receipts.** A review can only be written when a job is marked complete *and* paid through the platform. No review links on good days, no discounts for stars, one calm response from the tradie per review. We also show the shape of a tradie's history — count, recency, spread — rather than letting an average do the talking. A 4.6 across 87 verified jobs means something; a 5.0 across four means nothing, and the interface now says so, politely.

**A dashboard that tells trades the truth.** The trade side got a working dashboard, not a lead inbox: response-time stats against suburb medians, quote-to-hire rate, and earnings on platform versus hours quoted. Crucially, we show the comparison honestly — "your quotes convert 1 in 4; the local median is 1 in 3" — with concrete levers (response time, itemisation, photos) rather than upsells. The discipline we applied is the one from our [dashboard design playbook](/journal/product/dashboard-design-hierarchy): answer first, chart second, settings never on the front page.

**Rollout by trade, not by splash.** We launched with two trades — electricians and plumbers — in four Melbourne postcodes, and stayed there for eleven weeks while the review corpus and quote norms matured. Only then did we open carpentry, then tiling. Marketplace launches that go wide and shallow build a catalogue of empty jobs; the slow version built norms.

## The outcome

Twelve months in, the illustrative numbers from the relaunched platform:

- **Median time to first quote:** 26 hours down to 3 hours 40 minutes. Homeowners now see each quote's actual response time on the tradie's profile, which turned out to be the strongest incentive to be fast — faster than any lead-fee mechanic.
- **Quote-to-hire rate:** from roughly 1 in 9 to 1 in 3.4 across verified trades, driven by comparable formats and the "what could change" field, which cut mid-job scope disputes by 61%.
- **Review integrity:** 92% of reviews now attach to completed, paid jobs; the star average across the platform *fell* from 4.8 to 4.4 — and conversion per profile view rose 38%. Trust showed up exactly where the reviews got more honest.
- **Trade churn:** verified-active tradies at six months rose from 41% to 67%, and the careful-but-slow cohort the platform was designed for became its top earners.

Designing the honest states mattered as much as the happy ones — empty job boards, declined quotes, disputes — the work we describe in [empty states are product marketing](/journal/product/empty-states-design). A marketplace lives and dies in those moments.

"We used to spend our energy apologising for the industry," Matt told us at the year-one review. "Now the platform's job is to make the good operators obvious. The homeowners figured that out before we finished saying it."

## What we'd tell other marketplace founders

Pick the side you serve first and make the other side *earn* its way onto the platform. Tie every trust claim to a transaction. And build the comparison view before you build anything clever — in a marketplace, the interface *is* the referee.

If you're building a two-sided product and the middle is getting messy, that's squarely in our [product design and engineering](/services/product) wheelhouse. [Start a conversation](/contact), or read how we handled a very different trust problem for [Northwind Ledger's accounting dashboard](/work/northwind-ledger-dashboard-rebuild).
