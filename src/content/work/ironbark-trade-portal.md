---
title: "Ironbark: retiring the order-desk fax ritual"
description: "How we replaced a wholesale roaster's phone-and-fax order desk with a self-serve portal: per-account price lists, honest cut-offs, and one-tap reorders."
slug: ironbark-trade-portal
cluster: work
tags: [b2b commerce, wholesale portal, reorder ux, self-serve, coffee]
date: 2025-11-13
author: Nate Sullivan
keywords: [b2b ecommerce portal, wholesale ordering, reorder ux, shopify b2b, self-serve commerce case study]
readingTime: 8
client: Ironbark Coffee Roasters
industry: Retail & e-commerce
services: [E-commerce, Product design & engineering]
year: 2025
stack: [Shopify B2B, TypeScript, Remix, Postgres]
---

Ironbark Coffee Roasters (a fictional client in our concept portfolio) supplies about 600 cafés, restaurants and offices across Australia's east coast. Excellent coffee, ferociously loyal customers — and an ordering process straight out of 1998. Wholesale orders arrived by phone, by email, by text message to a rep's personal phone, and, gloriously, by one elderly café in Armidale that faxed a handwritten form every second Tuesday. The order desk was four people doing data entry for a living.

Their operations director, Greg Barton, didn't pitch us a redesign. He pitched us his calendar: "Half my week is untangling orders that were never wrong in the customer's head. The fax is fine. The ten minutes we spend decoding it aren't."

## The challenge

B2B ordering fails differently from consumer e-commerce, and every mistake costs a relationship, not a conversion rate.

**Price lists were per-account folklore.** Ironbark's pricing depends on volume tiers, contract age and frankly some history nobody wrote down. The list lived in a spreadsheet with 40 tabs. Customers ordered at prices they remembered, the order desk invoiced at prices that were real, and the gap generated a slow drip of credit notes and quiet resentment.

**Order minimums and cut-offs were discovered after the fact.** Next-day roasting has a hard 2pm cut-off; some postcodes only get deliveries twice a week; minimum order quantities vary by freight zone. None of this was visible anywhere a customer could see it, so roughly a third of orders needed a phone call to become possible. That's not an ordering process, it's a negotiation.

**Reordering, the most valuable behaviour in wholesale, had no fast path.** A café orders the same basket for weeks. Yet every repeat order meant re-listing the same SKUs, because there was no order history a customer could act on. Reorder UX is a topic we've written about at length in our work on [cart design](/journal/ecommerce/cart-design-patterns), and wholesale is reorder UX in its purest form.

**The people were a feature nobody wanted to delete.** Ironbark's reps genuinely know their cafés — seasonal blends, machine problems, the new manager's name. The portal had to absorb the paperwork, not the relationships. Automating the second would have gutted the business's actual moat.

## The approach

We scoped a self-serve portal on Shopify B2B with a custom front end — the headless trade-offs are real, and we've written an [honest guide to them](/journal/ecommerce/headless-commerce-tradeoffs) — but here the maths was easy: Ironbark needed account-scoped pricing and purchasable order history, not a magazine.

### Log in and see *your* price list

Authentication turns the portal from a catalogue into an invoice preview. Every account sees its own tier pricing, its own MOQ, its own freight zone delivery days — computed, not narrated. We designed the price card as a contract in miniature: your price, the RRP, your free-freight threshold, and the number of kilos between you and the next tier. That last element — "2kg more and this blend drops 6%" — was Greg's idea and it's quietly the best merchandising on the site: it upsells by explaining, which is the only upselling wholesale customers don't resent.

### Honesty about time

The cut-off problem we solved with a pattern we now reach for in every logistics-adjacent build: put the constraint on the product row, not in a FAQ. Each line shows "Order by 2pm today → delivered Thursday" and the countdown is real — past 2pm it flips to the next roast day with an apology and an option to notify the rep. Delivery-day availability filters the session silently, so an Armidale café browsing on a Monday sees Tuesday and Friday slots, and never has to discover hard truths at checkout. Checkout friction in B2B is rarely about the checkout page — it's about surfacing constraints before they ambush the order, the same principle behind our [checkout friction audit](/journal/ecommerce/checkout-friction-audit).

### The repeat order, one tap deep

Order history is a reorder surface, not an archive. The account home leads with "Your usual" — the rolling modal basket — with one-tap "order again," per-line quantity nudges, and a diff when prices or stock changed since last time ("Colombia Estate is up 4%; Decaf Sugarcane is unavailable until Thursday — see alternatives"). Standing orders handle the truly stable baskets: set the cadence, get a confirmation email 24 hours before each run with a pause button. Pause, not cancel — a small piece of [subscription UX](/journal/ecommerce/subscription-ux-design) ethics we keep defending, because the café whose machine is down for repairs should love the portal for making it easy to skip, not resent it.

### Keep the humans for what humans do

We gave reps a portal view of their accounts with a "drifting" flag — customers whose order cadence is decaying — and every automated confirmation email comes from the rep's name with a real reply-to. The portal takes orders; the reps take relationships. In the [retail and wholesale work](/industries/retail) we do, that division of labour is the whole game.

## The outcome

Sixteen weeks from kickoff, launched pod by pod — Sydney metro first, regional accounts once the freight logic hardened. As with everything in our [work portfolio](/work), figures below are illustrative of a real engagement of this shape:

| Metric | Before | After (two quarters) |
| --- | --- | --- |
| Orders arriving fully processable (no callback) | 64% | 93% |
| Order-desk hours per week | ~110 | ~45 |
| Repeat orders placed via "order again" or standing | n/a | 58% of volume |
| Average order value vs pre-portal | 1.0× | 1.2× |
| Fax orders received per fortnight | 1 | 0 |

The Armidale fax number now rings through to the portal's onboarding video. The customer watched it, placed her first order, and emailed Greg to say the website "remembers me better than the rep does." She was joking. Mostly.

## What we learned

**In B2B, pricing visibility *is* the product.** Every other feature is secondary to a customer answering "what do I pay and when does it arrive" without phoning anyone.

**Constraints belong on the row, not in the docs.** MOQs, cut-offs and delivery days are UX content — write them into the interface where the decision happens.

**Automate the paperwork, advertise the humans.** The portal's most-loved feature was the confirmation email from a rep who actually replies. Self-serve doesn't mean self-alone — and Greg's order desk, now roughly two people's worth of hours, spends the reclaimed time on the cafés that are drifting. Which is exactly where we hoped it would go.
