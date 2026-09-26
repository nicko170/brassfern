---
title: "Preorders and backorders: UX for not-in-stock"
description: "Preorders and backorders without burning trust: dates as promises, deposit patterns, honest expectation-setting, split shipments, and copy that keeps inboxes quiet."
slug: preorder-backorder-ux
cluster: ecommerce
tags: [preorders, backorders, ecommerce ux, fulfilment, trust]
date: 2025-10-02
author: Nate Sullivan
keywords: [preorder ux, backorder design, out of stock ux, ecommerce fulfilment communication, deposit payments ux]
readingTime: 12
---

"Out of stock" is the laziest sentence in e-commerce. It says: we have a supply problem, and we have decided to make it your experience problem. But stockouts, pre-launch windows and made-to-order lead times are normal features of physical retail — restocks slip, presses print on schedule, ceramists throw pots at the speed of clay. The question isn't whether your store will sell things it doesn't currently hold. It's whether the customer learns the truth *before* or *after* they've paid.

We've built the honest version for a [bookshop that sells signed pre-release titles](/work/willow-and-wren-bookshop), an outdoor gear brand whose pack drops sell out in hours, and a winery that releases vintages on a calendar. The pattern holds across all of them: a preorder is a promise, and the design job is to make the promise explicit, keep it visible, and make breaking it expensive *for you*, not for the customer.

## A shipping date is a promise, so render it like one

The single most important piece of copy on a preorder is the date, and the most common failure is vagueness dressed as flexibility. "Ships soon" and "Available shortly" are lies of omission — the store knows a date range and has chosen not to say it. Our rules:

- **Give a range when you'd like to give a date.** "Ships between 14 and 28 November" is honest and manageable; "Ships 14 November" invites a support ticket per day of slippage. Ranges also survive reality: when the container lands early, you've over-delivered. A narrow estimate is a hostage.
- **Render the date where the price lives, not in a footnote.** For preorder items the ship window belongs directly under the buy button in the same visual weight as the price — same size class, muted colour, a small calendar or truck glyph. If the customer has to expand an accordion to learn their book ships in March, you have designed a complaint.
- **Repeat the date at cart, checkout and confirmation.** Every step restates the promise. This feels redundant until you read session recordings and watch buyers toggle between cart and PDP checking whether they imagined the wait. Reassurance is a feature.
- **Never mix promises silently.** A cart containing both in-stock and preorder items gets an explicit split-shipment decision — see below.

For made-to-order goods, the same logic applies to lead times. "Made to order: 3–4 weeks" on the PDP, restated at cart. [Fern & Forage's same-day flower delivery](/work/fern-and-forage-florist) is the mirror image of this problem: a promise measured in hours, where the cut-off time is rendered as a live countdown that quietly turns into tomorrow's delivery window at 2pm. Meeting a promise starts with stating it.

## Deposits, full payment, and the held card

How much money you take up front is a trust dial, and the settings matter more than teams expect.

**Deposit (part payment) now, balance on dispatch.** Best for high-AOV items and long lead times — furniture, bespoke, small-batch runs. A 20–30% deposit signals mutual commitment: the customer has skin in the game, and so do you. The design requirements are a clear ledger in the order confirmation ("Paid $180 today; $420 on dispatch, card ending 4242") and a reminder email before the balance charge. A balance charge with no warning is a chargeback generator, and every chargeback is a conversation you lost.

**Full payment now.** Standard for low-to-mid AOV preorders where the fulfilment date is weeks, not months away. It works when the store has earned trust, the date is specific, and cancellation is easy. If your cancellation flow is dark, holding full payment for six weeks turns unease into resentment.

**Authorise now, capture on dispatch (the gold standard where the stack allows it).** The card is validated and the funds held — or simply the token stored with a mandate — but money moves only when the parcel does. This is the most customer-honest pattern and, not coincidentally, the one that survives ACCC scrutiny best: Australian Consumer Law cares deeply about taking payment for goods you then fail to supply on the timeframe you advertised. Several payment providers support capture-on-fulfilment for preorders; if yours doesn't, that constraint should shape your payment policy, not your customers' patience.

Whatever the pattern, the checkout step must say the quiet part: "You'll be charged $X today" or "Nothing is charged until your order ships." Ambiguity here is where dispute emails are born.

## The split-cart problem

A customer adds an in-stock candle and a book that ships in five weeks. Now what? The three honest answers:

1. **Split automatically, ship each when ready, absorb or itemise the extra freight.** The best experience and the right default when your margins allow it. The cart renders two fulfilment groups with their own dates — "Arrives this week" and "Ships from 28 November" — so the customer sees the logic before you execute it.
2. **Ship everything together on the latest date.** Cheaper, and acceptable *if* it's framed as a choice with the alternative visible: "Everything ships together on 28 November — or ship the candle now for $8." Holding the in-stock item hostage to the preorder without saying so is how you teach customers not to bundle.
3. **Block mixed carts.** The lazy solution. A checkout that refuses the order and makes the customer self-separate their trip is demand destruction wearing a policy hat. If your 3PL truly cannot split shipments, eat the logistics cost operations-side; don't offload the constraint to the buyer.

The cart UI does the heavy lifting: group items by promise date, label each group, and put the decision toggle where the groups meet, not in a shipping-methods dropdown three steps later.

## The holding period is a product surface

Between order confirmation and dispatch — days or weeks of silence in a normal store — a preorder customer is quietly auditing you. Fill the silence with production, not marketing. The communications pack we build:

- **Order confirmation** with the restated date range, the payment terms, a one-tap cancellation link, and a human reply-to. Not a noreply address; preorders generate questions.
- **A production update at the midpoint.** "The books arrived at the bindery" or "the roaster fired the first batch" — one image, two sentences. This is the highest-open-rate email a store will ever send, because it's news about a thing they already own.
- **A delay protocol, pre-written.** When the date slips — and across enough preorders, some date will slip — the message goes out within 24 hours of the team knowing, with the new range, the reason in one honest sentence, and a one-click "refund me instead" path. Stores that offer the refund proactively keep most of their orders; stores that go quiet lose the orders *and* the customers.
- **Dispatch notice with tracking that works.** Tracking that 404s for the first 48 hours is a support-ticket machine; only send when the carrier actually has the parcel.

We help clients write these as a copy pack at build time — the delay email is template number one, because the middle of a supply problem is the worst time to draft it. For the wider lifecycle view, our [lifecycle email architecture](/journal/growth/lifecycle-email-architecture) piece covers the flows these messages slot into.

## Backorders: the waitlist that behaves

"Notify me when available" is a promise too, and most back-in-stock flows break it in three places: the email arrives hours after stock does (sold out again), it goes to everyone at once (a stampede one unit deep), or the item quietly returns and the email never fires at all. The honest backorder flow:

- **The signup asks for the variant.** Size, colour, grind. "Notify me about this product" when the customer wants the medium in ochre is a broken contract on both sides.
- **Restock notifications fire in order, in tranches, with hold windows.** If eighty people waitlisted and forty units landed, the first forty get a link that reserves a unit for some hours. First-come-first-served blasts are a loyalty tax: your most patient customers lose to whoever's refresh-happy.
- **The PDP stays honest during the stockout.** Show the expected restock window if you have one ("back mid-March"), offer comparable in-stock alternatives *below* the waitlist signup — not instead of it — and never autocomplete the buyer's hope by leaving the buy button live on a ghost of stock. Zombie buy buttons that error at cart are the single most enraging pattern in this whole category.

The [cart itself deserves the same honesty](/journal/ecommerce/cart-design-patterns): items that go out of stock while sitting in a saved cart get a gentle flagged state, not a silent disappearance.

## Key takeaways

- State the ship window at price size, restate it at every step, and prefer honest ranges over optimistic exact dates.
- Match the payment pattern to the lead time: capture-on-dispatch where possible, deposits for expensive bespoke, and always label today's charge explicitly.
- Mixed carts need a visible split-shipment decision, grouped by promise date — never a silent "ships together late".
- The gap between confirmation and dispatch is a communications surface: midpoint updates and a pre-written delay protocol with a one-click refund door.
- Back-in-stock lists notify in order, in tranches, per variant — or they're just a mailing list with extra disappointment.

## FAQ

**Should we take preorders for everything as a hedge against stockouts?** No — preorder fatigue is real, and converting your whole store into a laying-away operation erodes the "buy it now" impulse that drives conversion. Reserve preorders for genuinely time-bound products: launches, vintages, restocks with a known date, made-to-order lines.

**How long is too long for a preorder window?** Beyond eight to ten weeks, completion confidence drops and cancellation risk climbs steeply. If lead times consistently run longer, a deposit pattern or a waitlist-with-priority-access model works better than an open preorder.

**Do we legally need to offer refunds on preorders in Australia?** Under Australian Consumer Law, if you can't supply within the advertised timeframe (or a reasonable one), the customer is entitled to cancel for a full refund. Design for the entitlement, not around it — a prominent cancel path costs you a few orders and saves you the chargebacks.

**What if we genuinely don't know the restock date?** Then run a waitlist, not a preorder. Taking money against a date you don't have is where ACCC complaints and broken trust live. "We'll email you the moment it's back" is a fine promise; "ships soon" after payment is not.

**Should preorders count toward free-shipping thresholds and discounts?** Yes, generally — penalising preorder customers on the loyalty ledger teaches them to wait for stock instead of committing early, which is the opposite of what a preorder program is for.

Building a store that sells things honestly — in stock or not — is the core of our [e-commerce practice](/services/ecommerce); the [Willow & Wren bookshop case study](/work/willow-and-wren-bookshop) shows the preorder system in the wild.
