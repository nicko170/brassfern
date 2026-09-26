---
title: "Multi-currency storefronts without the exchange-rate lies"
description: "Display currency vs settlement currency, duties honesty at checkout, geo-prompts with consent, and the switcher that quietly inflates rates — done properly."
slug: multi-currency-without-lies
cluster: ecommerce
tags: [multi-currency, international, pricing, checkout, localisation]
date: 2026-01-20
author: Felix Brandt
keywords: [multi-currency, international, duties, geo, pricing UX]
readingTime: 8
---

Here is a thing that happens thousands of times a day on international storefronts. A customer in Wellington browses in NZD, adds a $240 jacket, checks out — and their bank statement reads NZD 268.41. The storefront showed prices "in their currency". The payment settled in AUD. The difference is the platform's FX spread, roughly 4%, applied silently between the numbers the customer saw and the number their account actually paid.

Nothing about that transaction was technically false. Every honest instinct in commerce says it was a lie.

Multi-currency is where engineering, finance and UX meet and quietly take some of the most consequential honesty decisions on a storefront. This piece is the conversation we have with every client going international: display vs settlement, duties, geo-hints, price books, and the switcher component where all of it converges. Related reading: the broader [i18n architecture](/journal/engineering/i18n-architecture-hard-parts) for the platform side, and our locale-switcher patterns for the component's general form.

## Display currency and settlement currency are different promises

Start by separating the two things customers reasonably assume are the same.

**Display currency** is the number on the PDP. **Settlement currency** is the currency in which the charge is actually processed. They diverge in three legitimate designs and one illegitimate one:

1. **Full local acquiring.** You bill in NZD through a local acquirer; the customer pays exactly NZD 240. Best experience; only viable at meaningful volume per market.
2. **PSP multi-currency pricing.** Your payment provider presents and settles in NZD, converts to AUD on their side at a *disclosed, contracted* rate. Legitimate — provided the customer-visible total is the charge.
3. **Present-local, settle-base.** The *good* version: the checkout states plainly, before payment, "Your card will be charged A$222.34 (NZ$240 at today's rate)". The customer can decide; their bank does the conversion; nobody is surprised.
4. **Present-local, settle-base, say nothing.** The illegitimate-ish version — the Wellington scenario above. The customer finds out from their bank, which charges its own foreign-transaction fee on top. This design choice manufactures support tickets and chargebacks and reads, to sophisticated buyers, as exactly what it is.

Our default advice is boring and strong: if you can't settle locally yet, run option 3 — show both currencies in the order summary, with the rate and its timestamp, before the pay button. Being transparent about a worse price generates more trust than pretending a fiction.

## The rate itself: whose spread, and does it show?

If you generate local prices by converting your AUD price book, someone makes a spread decision. The quiet pattern: refresh FX weekly, pad 3–5% "for volatility", pocket the drift. The defensible pattern:

- **Set price books per market, manually, on a merchandising cadence** — not derived continuously from FX. Prices should be stable for weeks; customers screenshot and compare; a product that re-prices by ±4% a week looks broken or scammy.
- *If* you must derive: publish the effective rate's date, bake the spread into an honest round price (see price charm below), and never re-price between PDP view and checkout. The checkout total must match the PDP the customer came from; a price that moves during checkout is one of the experiences that permanently burns trust.
- **Receipts must restate the expectation.** Order confirmation shows the currency, the amount, and, where relevant, the settlement disclaimer that the checkout already showed. No new information after payment — that's the rule that makes returns and disputes survivable.

## Duties: DDP, DDU, and the doorstep ambush

For cross-border physical goods, the currency conversation is incomplete without duties, taxes and the courier's invoice.

**The lie pattern**: show no duties at checkout, ship DDU (delivered duties unpaid, incoterms vary), and let the customer discover a $42 COD invoice from the courier at the door — plus the courier's "advancement fee" for the privilege. Support calls it "international friction"; customers call it being tricked, correctly, and public reviews agree.

**The honest set:**

- **DDP (delivered duties paid)** where your logistics can price it: duties and import taxes calculated and collected at checkout, itemised as their own lines, with "nothing more to pay on delivery" stated on the button threshold. Customers demonstrably pay more total for certainty — the uplift typically beats the duty line itself.
- **Honest DDU** where you can't: estimated duties at checkout *clearly marked as estimates* ("Australian GST and import charges, estimated A$38, payable to the courier", with a date caveat), plus a summary sentence that covers the worst case. An honest estimate converts better than a blank.
- Whatever you can't estimate, **say so in six words at checkout**: "duties may apply on delivery". Silence is the lie; vagueness is a waistcoat for it.

Also: [payments and trust signals localise too](/journal/ecommerce/payment-trust-signals-au) — the marks and methods that reassure an AU buyer are not the ones a German or Japanese buyer scans for. International checkout is as much about *which* reassurance as how much.

## Geo-detection: hint, don't kidnap

Using IP or browser locale to *suggest* a region is helpful. Using it to *redirect* is an ambush — the customer who lives in Berlin but is shopping from a Sydney hotel with an AU card deserves the version of the store they asked for, and crawlers deserve something consistent for indexation ([international SEO](/journal/growth/international-seo-hreflang) has strong words about auto-redirects; listen to them).

The pattern we build:

- **First visit**: a slim, dismissible banner — "Shopping from Germany? Prices in EUR — [Switch]" — never a modal, never full-screen.
- **The switcher itself**: plain-country-and-currency (no flag-only UI; flags are not languages and barely currencies), current selection clearly marked, accessible labelling, and a predictable place to live (header + footer). Currency persists across sessions; a URL change makes selection shareable.
- **The currency code goes everywhere**: "A$240.00" vs "US$160.00" is not pedantry; three dollars signs walk the earth and they mean different numbers. Symbol-only prices on an international storefront are a small daily lie told to people whose statement will disagree.

## Price books, charm, and perceptions

Rounding conventions differ by market in ways that matter. `$199` reads as a deal in some markets and as suspicious precision in others; in Japan, round numbers carry quality associations that .99 endings erode; in Switzerland, .95 endings are standard. The rule: localise price *points*, not just digits — which is another argument for real per-market price books reviewed by a merchant, not a spreadsheet multiplying by 1.07.

Beneath that: **do the money like an engineer**. Integer minor units throughout (`price_cents: 24000`), never floats; market and currency on every price-as-stored record; rounding mode chosen once (half-even is the usual answer for presentation; never per-line-item scramble); currency captured on every analytics event so revenue dashboards aren't silently summing NZD with AUD — an embarrassingly common error your [analytics pipeline](/journal/engineering/analytics-pipelines-trust) will otherwise faithfully propagate into a board pack.

## Measuring international honestly

The correct report isn't "international revenue" — it's per-market conversion vs. domestic baseline, decomposed into the four classic friction points: price display confidence (does the currency match the card?), total-cost clarity (duties surfaced or ambushed?), payment method availability (local rails present?), and delivery promise. A market underperforming baseline by 40% is usually not a demand problem; it's the Wellington statement surprise, discovered one customer at a time.

Track FX-pad revenue as its own line if you must have it — the moment it becomes a meaningful percentage of "international margin", it stops being volatility insurance and becomes the product, which is a values conversation for a Tuesday board meeting, with this article open.

## Key takeaways

- Display and settlement currency are separate promises. Bill in the presented currency, or state the settlement amount *before* the pay button.
- Price books per market, refreshed on a merchandising cadence — never twitchy FX-derived prices that move during checkout.
- Duties: itemised DDP where possible, clearly-estimated DDU where not, and never doorstep silence.
- Geo by banner hint, never forced redirect; switcher with country + currency labels; currency codes on every price.
- Money is integers, currency rides every event, rounding mode is written down.
- Measure per-market conversion against baseline and decompose the gap; track FX-spread income as its own accountable line.

## FAQ

**We're on a platform that "does multi-currency automatically." Good enough?**
Usually not without configuration. "Automatic" almost always means present-local, settle-base with a fat default pad — the Wellington scenario. Test it: buy from a card in another currency, compare the storefront total with your statement. Whatever the gap is, your customer sees it too.

**How many currencies should we launch with?**
Fewer than ambition suggests. Each currency is a price book, a returns refund-currency decision, a support-language expectation (fair or not), and a test surface. Start with the two or three markets where you have real traffic *and* can answer duties confidently; expand when the first ones feel boring.

**Should prices re-sync when the customer switches currency mid-cart?**
Yes — immediately, visibly, with a one-line note ("Prices updated to EUR; total now €212.00"). Carts that retain the old currency's total while displaying new symbols are a special hell; rebuild the cart's pricing atomically on switch.

**What about crypto, BNPL, and market-specific payment rails?**
Separate decisions from currency, but they interact: the payment methods that signal "this store is for people like me" vary by market more than the currency symbol does. Treat payment-method mix as part of the per-market launch, not a global toggle.

**Can we A/B test the duties-at-checkout presentation?**
You can test *presentation* — placement, wording, whether estimates are ranges or single numbers. You can't A/B test honesty: one variant that hides duties and one that shows them isn't an experiment any credible research ethics would sign off, because only one arm learns the truth after paying. Test the message, not the fact. For experiment design more broadly: our [CRO field guide](/journal/growth/cro-experiments-that-matter) — and for the build itself, [talk to us](/contact).
