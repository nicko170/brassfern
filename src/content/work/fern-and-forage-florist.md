---
title: "Fern & Forage: same-day flower delivery without the panic"
description: "A florist's website where the hardest UX problem is honesty — cutoffs, postcodes and seasonal stock — turned into the brand's warmest asset."
slug: fern-and-forage-florist
cluster: work
tags: [ecommerce, delivery ux, local retail, content design, conversion]
date: 2025-05-30
author: Nate Sullivan
keywords: [florist ecommerce case study, same-day delivery ux, local commerce website, occasion-based browsing, checkout design]
readingTime: 8
client: Fern & Forage
industry: Retail & hospitality
services: [E-commerce, Websites]
year: 2025
stack: [React, TypeScript, Shopify Hydrogen, Sanity, Cloudflare Workers]
---

Fern & Forage runs three flower shops across Melbourne's inner north. The flowers are exceptional — garden-style arrangements, local growers, nothing that looks like it came off a refrigerated truck. The website, when we met them, was a national wire-service template with their logo pasted on it: generic stock roses, a checkout that accepted orders for suburbs the van couldn't reach, and a phone that rang constantly with the same three questions. "Is it too late for today?" "Do you deliver to Coburg?" "What will it actually look like?"

## The challenge

Same-day floristry is a logistics business wearing a tulle skirt. Every day the shops hold finite stock that dies on a schedule, a van with a fixed delivery window, and a 2pm cutoff that is genuinely immovable. The old website's cardinal sin was pretending otherwise: it took every order, at any hour, for any suburb, and let the humans sort out the disappointment. Founder Saskia Meagher estimated the team spent two hours a day on apology phone calls, refunding orders that should never have been accepted.

The second problem was trust. Flowers online are a leap of faith — you're buying something perishable, emotional and future-dated, usually for someone else. Stock photography said "any florist". Saskia's shop fronts, crammed with banksias and dried grasses, said something entirely more specific. The site needed to close that gap, because in this category [conversion design](/services/ecommerce) *is* confidence design.

The constraints were unglamorous and real: a three-person shop team with no time for content production, inventory tracked in a point-of-sale system with an API best described as shy, and Valentine's week traffic at twenty times the daily norm.

## The approach

### Honesty as interface

We started with the cutoff, because everything hung off it. The new site knows what time it is, where you are, and what's alive in the coolroom — and it says so, clearly, before you spend a dollar. Order at 11am and the hero reads "Order by 2pm for same-day delivery". Order at 2:15pm and it reads, without drama, "Today's run has left — first delivery tomorrow from 9am". A small, calm countdown replaces panic with clarity. Postcode entry happens up front, not at checkout: tell us where it's going and we'll show you only what can get there. It is the single most-loved feature we built, measured in phone calls that no longer happen.

### Occasions, not SKUs

Nobody shops for "arrangement, medium, glass vase, item 4417". They shop for a birthday, an apology, a new baby, a Tuesday. The shop is organised by occasion with genuinely useful filters — vibe (wild, classic, sculptural), price, and "get well soon, but make it interesting" — and every occasion page leads with one honest line of copy about what the florist would choose right now, this week, from what's good at the market. It's the counter conversation, automated. That instinct for occasion-led merchandising is one we now bring to most of our [retail work](/industries/retail).

### A photography system, not a photoshoot

The trust problem demanded real photography of real arrangements, but a quarterly photoshoot would go stale within weeks — stock changes daily. So we built a system instead: a daylight corner in the Fitzroy shop, a fixed backdrop and distance marks taped to the floor, a one-page shot list (front, three-quarter, hand-scale detail), and a colour-grading preset. Any staff member can shoot a new arrangement in four minutes, and it lands on the site via the CMS looking like it belongs. Consistency without a retainer. The same token-driven consistency runs through the build, which uses the [design tokens pipeline](/work/hearthbrew-brand-system) pattern we rely on across projects.

### Checkout: forty seconds, no surprises

The checkout was rebuilt around the reality of a gift purchase. The buyer is rarely the recipient, so delivery details come first, card message gets a proper writing field with a character count and real suggestions (not "Happy Bday!!!" placeholder shame), and delivery windows are explicit choices — "morning run, 9am–12pm" — rather than a hopeful date picker. Express, PayPal and Apple Pay sit up front; the form is four fields shorter than the template it replaced. Every price shown anywhere on the site includes delivery for the stated postcode, because the "gotcha" fee at the final step was the single largest source of abandonment in the old funnel and the single easiest thing to delete.

Underneath, it's a headless Shopify build — [Hydrogen and TypeScript](/services/websites) at the front, the POS feeding stock through a small sync worker — because the fastest way to kill a small retailer's website is to hand them two admin panels.

## The outcome

Launched in nine weeks, just ahead of Mother's Day, which felt either brave or foolish and turned out to be the perfect load test. The [metrics below are illustrative figures from this fictional concept project](#):

| Metric | Before | After |
| --- | --- | --- |
| Online conversion rate | 1.1% | 3.4% (illustrative) |
| "Can you deliver to…" phone calls / week | ~60 | ~11 |
| Refunds from impossible orders | ~5% of orders | <0.5% |
| Average order value | $78 | $96 (illustrative) |
| Mother's Day week revenue, online | baseline | +184% YoY |

The metric Saskia frames, though, is the apology calls. Two hours a day became ten minutes. The site absorbed the logistics so the humans could go back to the flowers — which, she points out, is what a florist's website is actually *for*.

> "I used to dread looking at our own website. Now it's the best staff member I have. It never sleeps, it's honest about the cutoff, and it upsells better than I do." — Saskia Meagher, Founder, Fern & Forage (fictional)

## Stack & credits

- **Design:** occasion-led IA, delivery-state system, photography art direction, checkout redesign
- **Engineering:** Shopify Hydrogen storefront, POS stock sync, postcode/cutoff logic, edge-rendered delivery states
- **Content:** occasion copy system, seasonal shot list and photography workflow
- **Squad:** e-commerce lead, product designer, engineer, producer — [how our squads work](/approach)
- **Selling something perishable, seasonal or same-day?** [Start a project](/contact)
