---
title: "Mobile checkout, field by brutal field"
description: "A field-by-field teardown of mobile checkout: input modes, autocomplete contracts, wallet placement, errors with fat fingers, and measuring drop-off per field."
slug: mobile-checkout-field-by-field
cluster: ecommerce
tags: [mobile checkout, form design, autofill, input modes, conversion]
date: 2026-06-30
author: Nate Sullivan
keywords: [mobile checkout UX, form design mobile, autocomplete attributes, inputmode, field-level analytics, express checkout]
readingTime: 9
---

Desktop checkouts forgive. There's a mouse, a keyboard with all the keys visible at once, a screen wide enough to see the whole form and your own mistakes. Mobile is none of that. On a 375px screen your checkout is a tunnel: one field visible at a time, half the glass eaten by a keyboard, and a customer's thumb doing precision work it was never engineered for. When we say the majority of e-commerce traffic is mobile and the majority of mobile checkouts are abandoned, those two facts are the same fact.

This is the field-by-field teardown we run on every mobile checkout we touch. It assumes you've already done the strategic work — guest checkout, no account walls, honest totals early — which we covered in the [checkout friction audit](/journal/ecommerce/checkout-friction-audit). This one is about the glass: every field, its keyboard, its failure modes, and the drop-off data that proves where you're bleeding.

## The keyboard contract

Every field on mobile is a negotiation with the keyboard, and the negotiation is conducted through three HTML attributes that cost nothing and are wrong on a remarkable share of stores.

- **`inputmode` picks the keys.** Email gets `inputmode="email"` (the @ on the primary layout). Phone and postcode get `inputmode="numeric"` or `tel`. A postcode field that summons the qwerty keyboard is telling the customer you have never watched anyone use your form. Postcodes in Australia are four digits; the qwerty layout for them is a self-inflicted wound.
- **`autocomplete` is an API, not a hint.** The tokens exist and browsers honour them: `given-name`, `family-name`, `email`, `tel`, `street-address`, `address-level2`, `postal-code`, `cc-number`, `cc-exp`. When autofill works, the address form vanishes into one tap. When your attributes are wrong or missing, the customer retypes their life story on glass, mid-bus-ride. Filling the tokens correctly is one afternoon of work and frequently the single highest-ROI commit in the whole checkout.
- **`autocapitalize` and `spellcheck` off for anything machine-read.** Names at least deserve capitalisation; emails, codes and postcodes deserve neither. An iPhone happily capitalising the first letter of an email address is a bug you shipped by omission.

Test the contract on a real device, on cellular, one-handed. Lab testing with a desk keyboard simulates none of the failure modes that matter.

## Field by field

**Email, first and fast.** It's the identity of the order and the recovery mechanism if the session dies. Put it first, give it `inputmode="email"` and `autocomplete="email"`, and validate on blur, not per keystroke — the red error state that fires while someone is still typing their own address is pure spite. Common-domain suggestion ("did you mean gmail.com?") catches a meaningful slice of typos; those typos become lost order confirmations and abandoned carts you can never email.

**Name: one field.** `Full name` with `autocomplete="name"` beats the first/last split on mobile, full stop. Two fields means two taps, two focuses, two keyboard dismissals of your carefully chosen `inputmode`. The split exists for fulfilment systems designed in 2004; split server-side if your warehouse demands it.

**Address: let lookup do the work.** On desktop, a multi-field address form is tolerable. On mobile it's the single biggest drop-off wall we measure. An address-autocomplete field (Google, Loqate, a national postal API — any reputable one) collapses six fields into one search interaction. The pattern that converts: one lookup field, results that refine as you type, and — this is the part everyone skips — **an immediately visible "enter manually" escape hatch** that reveals the full field set, pre-filled with whatever the lookup already captured. Lookups miss unit numbers, new builds and rural addresses; trapping a customer behind a lookup that can't find their house is abandonment you've engineered.

Unit/apartment goes *above* the street field, not below, because it's the field people actually forget, and the field that fails delivery. If you take one layout change from this article, take that one.

**Phone: optional and honest about why.** If you need it for delivery exceptions, say so inline — "couriers use this if they can't find your door." An unexplained phone field reads as "we will telemarket you," and on mobile, a mandatory unexplained phone field is where a quiet percentage of checkouts simply end. `inputmode="tel"`, no strict formatting validation; accept what they type and normalise server-side. Rejecting "+61" or spaces in a phone number is the form arguing with its own user.

**Delivery options are not a form field but behave like one.** Radio rows with names, prices, and honest dates — "arrives Thursday" beats "express" — selectable with one thumb-sized tap target each. The 44px minimum is not a guideline here; it's the difference between a selection and a rage-tap.

## Payment: where wallets earn their place

By the card form, you've spent the customer's patience budget. Two rules:

**One, wallets before the card form.** Apple Pay and Google Pay render the whole address section above moot — that's their actual function, not speed for its own sake. Placement is a cadence decision: the wallet button belongs at the point of maximum remaining effort, which on mobile is the top of checkout, before the address tunnel, not buried beside "pay by card" as an afterthought. We measured this exact placement question across stores in [express wallets: faster checkout, if you place them right](/journal/ecommerce/express-wallets-checkout); the short version is that wallets before the form convert, wallets after the form are decoration.

**Two, the card form itself.** Single field for the number with automatic spacing (format as they type, 4-4-4-4), `inputmode="numeric"`, no expiry dropdown — a month/year text pair or the native month input beats scrolling through thirty-one days of nothing. Never unset a field's value on validation failure. And the card number field that clears itself when a digit is wrong — a real pattern, shipped by real stores — is the single most infuriating interaction in commerce.

## Errors for fat fingers

Mobile errors need different physics than desktop ones:

- **Inline, specific, and adjacent.** "That postcode doesn't match the state" beside the postcode, not a summary banner at the top of a form the customer would have to scroll a tunnel to re-read. Error summaries have their place for screen readers and long forms; as the *only* error UI on mobile they're abandonment.
- **Preserve everything entered.** An error page that comes back with empty fields is a form asking to be abandoned.
- **Validate once, at blur or submit — never per keystroke.** The "email invalid" state that appears while typing the first character is a tiny humiliation repeated millions of times a day.
- **The summary, if you must, anchors focus.** On error submit, move focus to the first problem field with the keyboard already up for it. Fix-forward in one gesture.

Accessibility and conversion stop being different disciplines here: labels above fields (placeholder-is-not-a-label, still, in 2026), visible focus states, and tap targets a real thumb can hit. The WCAG-AA end of this is worth its own audit — our notes on [the payments and trust signals Australian shoppers actually read](/journal/ecommerce/payment-trust-signals-au) cover the reassurance layer that sits alongside these fields.

## Measure field by field or don't bother

Aggregate checkout-abandonment tells you a house is On Fire but not which room. The instrumentation we wire into every checkout — the same discipline as any [field-level analytics taxonomy](/journal/growth/analytics-taxonomy-first) — tracks per-field focus, blur, completion, validation failure, and correction events.

What you learn is always specific: the phone field has a validation-failure rate triple its neighbours (your regex rejects real numbers). Address lookups end in "enter manually" 40% of the time (your region data is stale). Session replays show thumb-reach struggles with the sticky pay button occluding the last field. None of this is visible in a funnel. All of it is fixable in a sprint.

One measurement warning: instrument corrupts if it nags. Field events belong in an analytics pipeline, never blocking the main thread — a checkout that janks because it's reporting itself is a special kind of irony.

## Key takeaways

- Mobile checkout is a tunnel: one field, half a screen of keyboard, one thumb. Design for the tunnel, not the desktop form shrunk down.
- The keyboard contract — `inputmode`, `autocomplete`, no stray capitalisation — is an afternoon of attributes with outsized returns.
- One name field. Address lookup with an instant manual escape. Unit number above street. Phone optional and explained. Wallets before the card form.
- Errors: inline, adjacent, specific, at blur or submit, with every entered value preserved.
- Aggregate abandonment is a shrug. Field-level analytics turns "mobile underperforms" into a fixable list.

## FAQ

**Single-page or multi-step checkout on mobile?** Multi-step, usually — but only because a well-paginated mobile checkout (contact → shipping → payment, progress visible, browser back working honestly) keeps the tunnel short. A single long page isn't faster; it's just unscrolled. Whatever you choose, the back button must move backwards through steps instead of detonating the session. Breaking the back button is the one sin we refuse to sign off.

**Do address-lookup services pay for themselves?** On mobile-heavy stores, consistently yes — measured as drop-off reduction at the address step, not vibes. The caveat is coverage: if a meaningful share of your customers live somewhere the lookup handles badly (new developments, rural routes), the manual fallback quality matters more than the lookup, and you should A/B the ordering — lookup-first versus manual-first — before committing. Test design honesty required, per usual; see [designing CRO experiments you can believe](/journal/growth/cro-experiment-design).

**What about one-tap checkout everywhere (Shop Pay, Link, etc.)?** For returning customers within those ecosystems they're excellent, and we happily ship them alongside the native wallets. Two cautions: recognise that enrolment into a third-party identity system is a consent moment, not a conversion trick; and measure them as their own tender type so you can see genuinely new speed rather than customers you already had, arriving by a different door.

**How do we handle government PO boxes, parcel lockers and the like?** As first-class address modes, not validation errors. If your address validation rejects "Parcel Locker 1234," you're telling a growing slice of Australian shoppers their address is wrong when it's your model that's wrong. Accept the formats reality uses; validate deliverability with the carrier, not a regex from 2011.
