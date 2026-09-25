---
title: "The checkout friction audit: 40 checks, one afternoon"
description: "Checkout is where e-commerce revenue quietly bleeds out. The forty-check audit we run before any redesign: field math, wallets, error recovery, trust."
slug: checkout-friction-audit
cluster: ecommerce
tags: [checkout, conversion, ecommerce ux, cro, payments]
date: 2025-06-11
author: Priya Nair
keywords: [checkout optimization, checkout friction, ecommerce checkout ux, cart abandonment, payment ux]
readingTime: 11
heroImage: /images/articles/ecommerce/checkout-friction-audit.jpg
heroAlt: "A flat-lay on warm paper: a brass tally counter, a curling receipt, a pencil and a ticked checklist card beside a pressed fern sprig."
---

Every e-commerce team we've worked with has a number they know too well: cart abandonment somewhere between 65 and 80 percent. What they rarely have is a breakdown of *which* part of checkout is doing the damage, because abandonment dashboards measure the whole funnel and blame no one. "Checkout" is not one problem. It's a dozen small debts — a field that didn't need to exist, a postcode lookup that trusts no one, an error message written by a payment API — and each collects interest on every session.

Before we redesign a checkout, we audit it. The instrument is forty checks, run in one afternoon with a laptop, a phone, a stopwatch and a test card. We've run it on a [skincare brand with nothing to hide](/work/glade-skincare-ingredient-honesty), a [butcher-turned-providore](/work/tallow-and-co-providore), and a wine label that sells out of a shed in the Adelaide Hills — [Fernleigh Wines](/work/fernleigh-wines-dtc-storefront). The same checks catch the same failures, every time. Here it is, organised into the five debts that matter most.

## Debt one: field math

Every field in a checkout is a micro-tax, paid in attention and compounding in abandonment. The arithmetic is unforgiving: going from fourteen fields to eight isn't a 43% tidier form, it's the difference between a task and a chore.

1. **Count every field, including the hidden ones.** Most teams guess nine; the real number, once you count "address line 2", "company (optional)" and the marketing checkbox, is usually thirteen to sixteen. Count what's actually rendered, on mobile, with autofill disabled.
2. **Kill the second address line.** Address line 2 exists for databases, not humans. Merge to one line with a "Add apartment/suite" reveal. We've never seen delivery failure rates move; we've always seen completion move.
3. **One name field.** First name / last name splits inherited from the CRM. "Your name" handles mononyms, multi-part surnames and orders you haven't imagined — and deletes a field.
4. **Interrogate every "optional" field.** Optional fields failed some previous meeting. If it's optional, it ships hidden behind an explicit add-control, or it doesn't ship.
5. **Price the phone field.** Phone is the single most-abandoned field in checkouts we audit. If carriers need it, label it "for delivery updates only" — the qualifier recovers most of the drop. If nobody calls it, delete it and watch.
6. **Defer account creation.** "Create an account to continue" is a paywall with extra steps. Capture email for the order, then offer account creation on the confirmation screen — "You're done. Want a password so next time takes half as long?" Post-purchase conversion on that offer routinely beats mid-checkout forced registration by a wide margin.
7. **Autofill must actually work.** Run `autocomplete` attribute coverage as a checklist item — `shipping street-address`, `cc-number`, the lot. On mobile, a working autofill stack is the difference between checkout and thumb-gymnastics.
8. **Email is the first field, or near it.** It's the cheapest ask, it seeds autofill, and it gives you a recovery address if the session dies. Put it early.

## Debt two: wallet placement and payment rhythm

On phone-first checkouts, the express wallet button *is* the checkout for a large share of buyers. Everything else is a fallback.

9. **Wallets appear above the card form, not after it.** Apple Pay, Google Pay, PayPal — whichever the audience uses — go at the top of payment and again in the cart drawer. Buried-after-card-fields placement is the single most common unforced error we find; moving wallets up was worth a meaningful, measurable lift in completed mobile checkouts at Fernleigh Wines within the first month. (Illustrative figure; every store's mix differs. Measure yours.)
10. **The express path skips the duplicate asks.** If the wallet carries the address, don't re-render address fields beneath it "for confirmation". Trust the token.
11. **Card inputs brand themselves.** Detect the card type from the BIN and show it. Asking "card type?" in a dropdown is 2009 talking.
12. **Never clear the card on another field's error.** A checkout that wipes the card number because the postcode failed has told the customer you have never watched a human buy anything. Errors affect their own field. Full stop.
13. **The last button says what it does.** "Pay $84.00" beats "Place order" beats "Submit". "Continue" as a final label is a lie that costs money.

## Debt three: address lookup integrity

Address lookup is the section where audits get quiet, because everyone *has* one and almost nobody has tested it against reality.

14. **Test with an address that isn't in the database.** New estates, rural routes, units in old buildings. If lookup fails, the fallback must be a graceful manual form — not a dead end with a red box. The Tallow & Co. checkout treated lookup failure as a first-class flow, because a providore shipping to regional NSW meets a lot of addresses the lookups have never heard of.
15. **Let people override the suggestion.** "Use suggested address" must always lose to "no, I know where I live". Forced normalisation is how parcels tour the state.
16. **PO Boxes and parcel lockers work or are honestly refused.** Nothing erodes trust like accepting an address you'll later reject by phone.
17. **Postcode/suburb state machine matches the shipping country.** Shipping to New Zealand with an Australian-state dropdown hard-coded is a classic.
18. **Address errors name the fix, not the fault.** "We couldn't find that address — check the suburb spelling or enter it manually" beats "Invalid address". See our piece on [error messages that de-escalate](/journal/product/error-messages-that-help) for the full writing pattern; it applies to checkout hardest of all.

## Debt four: error recovery and failure states

Assume failure. Cards decline, sessions expire, couriers' postcode rules change mid-checkout. The audit asks: what does each failure *feel* like?

19. **Declined cards get a human script.** "Your bank declined this card — no charge was made. Try again, or use another card." Not "ERROR 5110". The words "no charge was made" do the heavy lifting; fear of double-charging is what sends people to support or away entirely.
20. **The summary comes with the error.** On submit failure, a summary at the top lists what's wrong, each line a link that focuses the offending field. Scrolling a long form hunting for one pale-red outline is a mobile nightmare.
21. **Session expiry preserves the cart.** Twenty minutes of inactivity should cost nothing. Cart survives; re-entry lands where you left.
22. **Payment spinner has a floor and a ceiling.** Instant spinners read as glitches; endless ones read as doom. Minimum 600ms so the state change reads as intentional, honest timeout message with a support path if the processor hangs.
23. **Reload-safety.** Refresh the page mid-checkout during the audit. If the cart dies, you've found your leak.
24. **Stock loss mid-checkout is explained, not silent.** "The 250g tins sold out while you were checking out — we've removed them" beats a mysteriously smaller order total.

## Debt five: trust proximity

Trust isn't a badge wall in the footer. It's the presence of reassurance at the exact pixel where doubt occurs.

25. **Total cost is visible before payment is asked.** Shipping surprises at the payment step are the number-one abandonment cause in every study worth citing for two decades, and we still find it weekly. Show the real total — shipped, taxed — on the cart step.
26. **Delivery estimate sits next to the pay button.** "Arrives Tue 30 Sep – Thu 2 Oct" is a trust element, not a nice-to-have.
27. **Returns policy in one line, one click from payment.** "Free returns within 30 days" beside the button. The full policy can be a link; the promise can't.
28. **Security reassurance near the card field, worded like a human.** "Encrypted and processed by Stripe — we never see or store your card number." Specificity outperforms padlock clip-art.
29. **Support is reachable from checkout.** A help link that opens chat or a phone number — staffed hours stated — rescues orders daily. At [GLADE](/work/glade-skincare-ingredient-honesty) it rescues ingredient questions that would otherwise become abandoned carts.
30. **Order review before the final commit on high-consideration purchases.** Under $80 impulse? One step. $400 hamper for a client? Give them the review screen.

## The second ten: mobile, speed and the small stuff

The remaining ten checks are faster to list than to fail:

31. One-thumb reachability of the pay button in the drawer. 32. Numeric keyboards for numeric fields (`inputmode`, not just type). 33. No marketing popups inside checkout — ever, no exceptions, fight the meeting. 34. Checkout page weight under control; third-party scripts audited — the script-audit discipline from technical SEO checklists applies here too. 35. Taxes and duties computed, not TBD, for cross-border. 36. Gift options available pre-payment, not post-purchase email. 37. Multi-quantity discount clarity: the line item shows the saving. 38. Confirmation screen carries delivery window, support path and referral prompt. 39. The confirmation email arrives within a minute and renders on a phone. 40. Analytics events on every step and every error — because next quarter's audit should start from evidence, not vibes. Tracking plans before tools is the discipline that makes this data trustworthy.

## Running the audit

Book three hours. Two people minimum: one driving, one scoring. Every check gets pass, fail, or "can't tell" — and "can't tell" is a fail with a deadline. Run it on the slowest Android you can find, on hotel wifi, because that's where your Friday-night customers live. Then sort fails into two columns: *fixes this sprint* (labels, input modes, error copy) and *fixes the quarter* (field math, wallet architecture). The first column alone usually pays for the afternoon.

And re-run it quarterly. Checkout decays. Campaigns bolt things on; plugins update; someone adds a birthday field "for a surprise". Friction is not a bug you fix once — it's entropy you manage.

## Key takeaways

- Abandonment is a dozen small debts, not one big problem — audit, don't redesign blind.
- Field math is arithmetic: every field deleted buys completion. Run the audit before any layout work.
- Wallets belong above the card form on mobile. The express path must trust its own tokens.
- Error copy is checkout UX: name the fix, promise no double-charge, never clear entered data.
- Trust lives next to the doubt: total cost, delivery window and returns beside the pay button.
- Audit quarterly. Friction is entropy.

## FAQ

**How much abandonment is "fixable"?** Some abandonment is window-shopping and comparison — you'll never recover it, and that's fine. In our experience the fixable slice is roughly a third of abandonment: invited-surprise costs, form friction and failure states. That's still an enormous number at most stores' volumes.

**Should we A/B test every fix?** Test the structural changes (wallet placement, guest checkout, shipping-cost reveal timing). Don't test fixing a bug — a checkout that clears card numbers isn't an experiment, it's an injury. Our [CRO experiment design](/journal/growth/cro-experiment-design) piece covers where the line sits.

**Single-page checkout or multi-step?** The honest answer is that it depends on basket complexity and device mix, and the audit data tells you which. What we will say: multi-step with an excellent order-summary rail and honest progress beats a long single page on mobile almost every time.

**Where does checkout UX sit in a wider engagement?** It's typically week one of an [e-commerce engagement](/services/ecommerce) — highest leverage per hour of anything we do — then feeds the merchandising, PDP and retention work after. Arrive with your abandonment numbers, your field count and one screen recording of checkout on a phone, and the first conversation gets very practical, very fast.
