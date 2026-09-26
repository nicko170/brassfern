---
title: "Address forms for the world: one field doesn't fit all"
description: "International checkout forms: per-country field order, autocomplete's confident lies, the phone field's real job, PO-box honesty, and testing with real parcels."
slug: address-forms-international
cluster: ecommerce
tags: [checkout, forms, UX, internationalisation, engineering]
date: 2025-10-30
author: Felix Brandt
keywords: [address form design, international checkout, address autocomplete, shipping form ux, postcode validation]
readingTime: 9
---

Every checkout starts from a quiet lie: that addresses are roughly "street, suburb, postcode, country". That sentence describes maybe a third of the world. Japan writes addresses the other way round — postcode first, building last. Ireland ran for centuries without postcodes at all. In the UAE, a landmark genuinely is part of the address. And the moment your form imposes one national format on everyone, international checkout completion quietly bleeds.

We've built and rebuilt this layer more times than I'd like to admit — wine shipping at [Fernleigh](/work/fernleigh-wines-dtc-storefront), postcode-gated marketplaces for [Saltbush Collective](/work/saltbush-collective-marketplace) — and the lessons are consistent. An international address form is a small piece of software with a data model, not a stack of text inputs. Here's the architecture that holds up.

## Format per country, not per developer's address

The field order, labels and validation of an address form should change with the selected country. Which means the country field comes **first** — a detail that feels wrong until you realise that rendering the right form beats rendering the wrong one twice.

What actually varies:

- **Ordering.** Australia/US: street → suburb → state → postcode. Japan: postcode → prefecture → city → block → building. China: province-major. The form that makes a Japanese customer type their postcode last is teaching them your checkout before their address.
- **Labels that mean something locally.** "State" in Australia, "Prefecture" in Japan, "County" in Ireland (optional!), "Emirate" in the UAE. A generic "Region" is acceptable; "State/Province/Region (required)" is a confession that nobody thought about it.
- **Optional vs required.** Some countries need a second street line (unit/building), some need CEDEX or department codes, many need no postcode at all. Required-mark per the destination country's rules, not your database schema's.
- **The underlying model.** Store addresses structurally — name, lines 1–2, locality, administrative area, postal code, country — and render per-format. If your order table has columns named `state`, you've already lost. The battle-tested reference here is the universal postal union format data; don't invent your own taxonomy of the world.

One rule survives all countries: the fields a human writes *between* the lines — "leave with neighbour", "third door on the left" — deserve an explicit delivery-notes field, so they stop contaminating the street line.

## Autocomplete: helpful assistant, confident liar

Address autocomplete is the most romance-and-betrayal feature in checkout. The romance is real: five keystrokes instead of forty, and a structured, deliverable address. The betrayal is worse than no help at all, because autocomplete fails *confidently*.

The failure modes, all observed in the wild:

- **Dataset gaps.** Brand-new developments, rural properties, most of the Pacific. The suggestion list goes silent and, if manual entry is a tiny "can't find your address?" link, the customer assumes you don't ship to them.
- **Geocoding, not deliverability.** Map-API suggestion datasets generally describe *places*, not *letterbox-routable addresses*. A geocoded midpoint of a 400-number street is a place. It is not where the parcel goes.
- **Confident normalisation.** Tools that silently "fix" unit numbers or abbreviate street suffixes into forms the local carrier doesn't use.

The house rules we ship:

1. Suggestions, never forced selection. The fields stay visible and editable at all times; choosing a suggestion fills them, it doesn't hide them.
2. Manual entry is a first-class path — same size, same dignity, one tap away. Not a footnote link.
3. Re-verify structured output client-side: if the suggested result lacks a postal code in a postal-code country, warn, don't accept.
4. Show the composed result ("12/44 River St, Richmond VIC 3121") and let the customer edit any part. The form serves the customer's knowledge of their own home; the API is a stenographer that sometimes guesses.

We covered the checkout-level consequences — every field must justify its existence — in the [checkout friction audit](/journal/ecommerce/checkout-friction-audit). Autocomplete fails that audit loudly when it hides the escape hatch.

## The phone field is shipping equipment

Ask why the phone field exists. The honest answer at most stores is "because it was already there", and the dishonest one is "marketing". In international shipping, the number has a real job: customs declarations and courier delivery calls require it, in a machine-readable international format.

So design it for that job and say so: *"Couriers need this for delivery — we don't use it for marketing."* That one line measurably lifts international phone-field completion, because the ask stops smelling like a trap. Accept the number however the human types it, normalise to E.164 server-side, and never reject "+64" because your regex expected "0". The validation that corrects *format* while trusting *content* is the whole philosophy of this layer.

## PO boxes, rural routes and other truths stated early

Carrier constraints are part of the address form. If a product can't ship to a PO box (courier-only, signature required,) say so **at the field**, the moment a PO box pattern appears — not after payment. Same for:

- Rural deliveries with genuine carrier surcharges — quote them at address entry, not at the card field. A surprise $9 rural fee at payment is a studied conversion killer.
- Territories and states you can't serve (dangerous goods, alcohol licensing, biosecurity). Block early, explain briefly, offer a pickup alternative if one exists. [Payment trust](/journal/ecommerce/payment-trust-signals-au) and address honesty are the same instinct: no surprises downstream of commitment.
- Validation for postal codes: match the country's format loosely (case-insensitive, space-tolerant), warn on mismatch, never hard-block. There is always a real address that breaks your regex. Always.

## Test with parcels, not personas

Lab testing international forms with synthetic data catches typos. It misses everything that matters. Our staging protocol for any cross-border launch:

1. **The hundred-dollar parcel test.** Before launch, ship cheap-but-trackable real parcels to real addresses of real people you know in each destination market. Read the courier labels. Find out what the form actually emitted. This has caught more defects than any automated suite: reversed Japanese fields, mangled Irish Eircodes, a suburb line a German carrier silently truncated at 30 characters.
2. **Read the carrier's spec**, not the field lengths you wish they had. Every carrier integration has maximum line lengths and character-set constraints — often ASCII-only per line. Transliterate or warn; don't let é disappear into a label printer's void.
3. **Device-switch test.** Address forms are disproportionately completed on phones, mid-commute, with the browser's own autofill racing your autocomplete. Check both autocomplete layers don't double-fill, and that the country field's keyboard is `autocomplete="country"` — the browser attributes exist; use them.
4. **Ship-to-receipt replay.** Compare stored address → printed label → delivered parcel for the first hundred orders per country. Instrument mismatches; they cluster beautifully.

## Validation that corrects format, not content

The full philosophy, stated once: an address form's job is to make the customer's address *machine-survivable*, not to correct the customer. Normalise whitespace, case postcodes, expand no abbreviations unless you're sure, warn on anything unverifiable — and always let the human override the warning, because they live there and you don't. Log the overrides; they're your best dataset of where the validation itself is wrong.

Get this layer right and it vanishes — which is precisely the point. Nobody praises a checkout's address form. The praise arrives as "your international shipping just works", said by people who've learned not to expect that. If your storefront's checkout is quietly losing overseas customers, this is the kind of [unglamorous, high-leverage work](/services/ecommerce) we like best.

## Key takeaways

- Put country first and render field order, labels, and requiredness per destination format; store addresses structurally, not as fixed columns.
- Autocomplete suggests, humans decide: editable fields always visible, manual entry a first-class path, structured output re-verified before composing.
- The phone field is customs and courier equipment — say so, accept any format, normalise server-side, never conflate it with marketing consent.
- State PO-box, rural-surcharge and territory restrictions at the field, early; warn on postal-code mismatches but never hard-block a real address.
- Test by shipping real parcels to each market and diffing stored address vs printed label; character sets and line lengths are where the bugs live.

## FAQ

**Should we use an address autocomplete API?**
Yes — with visible editable fields, a dignified manual path, and a deliverability-grade (not map-grade) dataset for your top shipping countries. Budget for it as infrastructure, the way you would payments. A £0 autocomplete plugin that guesses is more expensive than a paid one that doesn't.

**How do we handle countries without postcodes?**
Hide the field. Seriously. Render per-country form definitions: if the destination doesn't use postcodes, don't show — and certainly don't require — one. Generating fake postcodes to satisfy your schema corrupts your data and the label.

**Is a single "full address" free-text field a valid simplification?**
For domestic-only stores with a strong verification API behind it, it can convert well. Internationally, no: free text can't be routed into customs declarations or structured carrier labels reliably, and verification coverage drops off a cliff outside a handful of countries.

**Where does company name / department go for B2B shipping?**
A dedicated line above the street fields — not appended to line 1, where it gets truncated by carrier printers and confuses residential-classification logic. B2B addresses routinely fail residential surcharges and vice versa; keep the classification explicit.

**How often should we audit the address layer?**
Quarterly light review (validation override rates, carrier rejection reports) and a full parcel-replay test whenever you change carriers, add a market, or swap autocomplete providers. Addresses are stable; everything around them isn't.
