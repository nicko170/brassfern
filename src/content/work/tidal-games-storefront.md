---
title: "Tidal Games: a storefront that outlasted launch day"
description: "An indie game label needed a store that could survive launch day and still feel hand-made. We built headless commerce and fair, queue-free drops."
slug: tidal-games-storefront
cluster: work
tags: [ecommerce UX, games, headless commerce, launch engineering, drop mechanics]
date: 2026-03-12
author: Nate Sullivan
keywords:
  - game store ecommerce
  - headless commerce case study
  - launch day scaling
  - drop mechanics ux
readingTime: 10
client: Tidal Games
industry: Retail & e-commerce
services: [E-commerce, Websites, Product design & engineering]
year: 2026
stack: [React, TypeScript, Node, Postgres, Cloudflare]
demo: tidal-games-store
heroImage: /images/work/tidal-games-store.jpg
heroAlt: "Editorial still-life of the Tidal Games storefront: arcade-cabinet shapes and game-cartridge forms in fern green and brass on cream paper, grain texture, generous negative space."
---

Tidal Games is a small indie game label — three founders in Fremantle, nine published titles, a devoted audience built a wishlist at a time. When they came to us in late 2025 they had a problem most studios would kill for and a website that couldn't survive it: their next release, a cozy sailing game called *Undertow Season*, had 74,000 wishlists, and their storefront was a third-party platform template held together with plugins.

The commercial shape of the problem is worth stating. Selling through the big platforms costs a label up to thirty cents in the dollar and, worse, costs them the customer relationship — no email addresses, no launch-day list, no way to tell their own players about the next game. Tidal wanted to sell direct for the titles they owned outright. But launch day in games is unlike launch day anywhere else in retail: five years of audience-building collapses into roughly ninety minutes of concentrated demand.

The brief from founder Mara Quill was two sentences: "It has to feel like us, not like a platform. And it cannot go down. If it goes down, we don't get a second launch."

Numbers in this piece are illustrative — Tidal is fictional, like all our clients — but the failure modes are ones we've watched sink real launches. And the living version of what we built is playable right now: the [Tidal Games storefront demo](/lab/tidal-games-store) runs the full browse-wishlist-checkout loop with seeded fake data.

## The challenge

Discovery — a fortnight embedded in their Discord, their analytics and their support inbox — surfaced four hard constraints:

- **Spiky doesn't cover it.** Their last launch, through a reseller's storefront, did 61% of its first-week sales in the first four hours. Capacity planning for "average traffic" was meaningless; the architecture had to assume the whole audience arrives at once, because they do, and they tweet about it if the door is locked.
- **Their previous drop had gone badly.** A limited collector's edition in 2024 had sold out in ninety seconds, largely to scalper bots, and the community remembered. Fairness wasn't a nice-to-have; it was a trust debt they owed their own fans.
- **The catalogue is small and deeply loved.** Nine games. A grid optimised for endless-scroll discovery would be wrong on a nine-title store. This is a shop window, not a warehouse — closer to a record store than a supermarket, a lesson we'd learned the other way around on [Holloway Records](/work/holloway-records-label-site).
- **The team are game developers, not e-commerce operators.** Whatever back office we shipped had to be runnable by three people who would rather be making games. That ruled out most of the enterprise commerce stack on day one of evaluation.

We'd written before about when [headless commerce is worth it and when it's theatre](/journal/ecommerce/headless-commerce-when-worth-it). Here the case was clear-cut: bespoke storefront experience, hard performance envelope, one specific backend system of record. Headless earned its complexity budget.

## The approach

**A neo-arcade storefront with editorial pacing.** The art direction we landed on — "neo-arcade" — borrows the visual grammar of cartridge-era packaging: strong flat colour, chunky borders, type that feels silk-screened. The home of the store is a curated shelf, not a feed: featured title large, the catalogue browsable by mood and platform, every game page loaded with the kind of thing fans actually want — generous screenshots, the story of the game's making, honest system requirements, real regional pricing. Player reviews and press quotes are there, but the tone is the label's own voice, wry included. It had to feel hand-made because it is.

**Drop mechanics that are fair by construction.** For collector's editions and launch drops we built scheduled inventory reveals instead of a race: a drop opens at a published time, everyone who commits within a fixed five-minute window is entered, and allocation is drawn randomly from that pool with one-per-customer enforcement and bot-signature filtering at the edge. No queue page, no refresh hammering, no advantage to a faster thumb or a shadier botnet. The store tells you exactly how it works, in plain words, on the drop page. Transparency is the feature — players share screenshots of the rules, which is the nicest possible outcome for a fairness mechanism.

**Architecture for the spike.** The catalogue pages are static-rendered and cached at the edge, so browse traffic never touches origin. The cart and checkout are isolated behind a Node checkout service with its own capacity envelope — browse and buy scale independently, and if one chokes the other survives. Inventory is reserved pessimistically at cart time with short holds, so a spike degrades to "temporarily reserved, try again in a moment" rather than overselling. We load-tested the checkout path at 40× the projected peak and made the failing component — the payment intent endpoint, inevitably — the thing we re-engineered first. The short version of the reliability playbook: on launch day, your CDN is your best friend and your origin is a stranger.

**A checkout tuned past the template.** Three steps, wallets first, express options placed per our house rule that [checkout friction hides in specific, findable places](/journal/ecommerce/checkout-friction-audit): regional pricing auto-detected with a manual override, gift purchase as a first-class path (games are gifted constantly; the template store made it impossible), and post-purchase that immediately hands you your keys, your receipt and one — one — social share prompt. The demo checkout models this end to end with mock payments and real key delivery.

**A back office for three people.** Order management, refund flows, drop scheduling and key fulfilment in one small admin, with sensible defaults everywhere and exactly zero features the founders didn't ask for twice. If a task takes more than four clicks, that's our bug.

## The outcome

*Undertow Season* launched in February 2026. Illustrative outcomes, stated honestly:

- **100% storefront uptime across launch day**, peak load 31× the prior month's average, p95 page response under 400ms at the peak. The door held.
- **Checkout conversion up 19%** against the reseller storefront's tracked funnel, with wallets now taking 41% of transactions.
- **The collector's drop ran clean** — 100% of stock allocated inside the five-minute window, zero oversells, and a support inbox that received fewer angry messages than an ordinary Tuesday. The community thread about the fairness mechanic was, and we checked, *nice*.
- **Direct channel now carries 34% of first-month revenue** across the catalogue, and every one of those customers is a relationship the label owns — the wishlist for their next title is already growing on infrastructure they control.

"Launch day used to be the day I aged in dog years," Mara told us afterwards. "This time I watched a line go up and to the right, drank a coffee, and went to bed at ten." That's the review we'd frame.

If your launch day is a liability instead of an asset, the architecture conversation starts [with our e-commerce practice](/services/ecommerce) — and the way we run these engagements, spikes and all, is on our [approach page](/approach).
