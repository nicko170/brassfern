---
title: "Harbourlight: a donation flow that respects the giver"
description: "A coastal housing charity's donation flow rebuilt around honesty — plain fees, fair recurring asks, and receipts that read like a human wrote them."
slug: harbourlight-donation-platform
cluster: work
tags:
  - case study
  - non-profit
  - donations
  - form design
  - trust
date: 2025-08-18
author: Priya Nair
keywords:
  - non-profit donation platform
  - donation form design
  - recurring giving ux
  - charity website case study
  - payment transparency
readingTime: 9 min read
client: Harbourlight
industry: Non-profit
services:
  - Websites
  - Growth
  - E-commerce
year: 2025
stack:
  - React
  - TypeScript
  - Node
  - Postgres
  - Stripe
---

Harbourlight is a fictional-but-plausible housing charity on the NSW south coast: 40 emergency beds, a tenancy-support program keeping 300 families housed, and an op-shop network run by volunteers. Their funding is half grants, half individual giving — and that half was leaking. The donation flow, inherited from a well-meaning 2019 rebuild, sent donors through fourteen fields, two full-page redirects and a hosted payment page in a font the charity had never owned.

The board could see the leak in the analytics — a 61% abandonment rate between "Donate" and "Thank you" — but the fix kept losing to the winter appeal. We were brought in to rebuild the giving experience end to end: donation flow, receipts, impact reporting. Every figure below is illustrative; the shape of the result is real.

## The challenge

Charity donation flows sit at a strange intersection: they are **checkout** (money, cards, fraud screening), **ceremony** (people give to feel something), and **audit trail** (tax receipts, acquittals, a board that answers to regulators). Most rebuilds optimise one and sacrifice the other two. Harbourlight's old flow optimised nothing.

Three specifics. First, **fee opacity.** A third-party platform added a "platform contribution" at the last step, pre-ticked, at 15%. Technically optional. Practically invisible. Donors noticed — complaint emails mentioned the word "trick" more often than anyone liked. Second, **the recurring ask was a guilt trap**: the monthly option was pre-selected, styled brighter, and switching to once-only triggered a modal asking if you were *sure*. That's not fundraising; that's a dark pattern with a mission statement. Third, **impact reporting was a PDF.** A 22-page annual report, published five months late, that answered no question a donor was actually asking.

And underneath all of it: a team of two in fundraising, no in-house developer, and a budget that said "do it once, properly."

## The approach

**We treated the donation form as an e-commerce checkout with a conscience.** The full discovery followed our usual [checkout friction audit](/journal/ecommerce/checkout-friction-audit) — forty checks, screen by screen. Fourteen fields became seven. Title, phone number and "how did you hear about us" left the critical path entirely. Card fields stopped pretending to be one input and became real, labelled fields that tell Safari's autofill the truth.

**Fees, shown like a menu, not hidden like a surcharge.** The platform fee moved from a pre-ticked afterthought to a plain line on the amount step: "We pay 1.9% + 30¢ to process this. Add $1.14 so 100% of your gift reaches the Coast?" Un-glossy copy, a real number, no tick done on your behalf. Coverage opt-in sits at a little over half of donations — lower than the old dark-pattern number, and worth every basis point in trust. Complaint emails about fees: zero since launch.

**Once and monthly, equally weighted.** Both options are the same size, same colour, same emphasis — the monthly card carries one honest extra line ("Cancel in two taps, any time") and the once-only card is never made to apologise for itself. This follows the same philosophy as our [subscription UX work](/journal/ecommerce/subscription-ux-design): retention earned by the relationship, not the friction of leaving. Donors who choose monthly under honest framing stay longer; donors who were *tricked* into it churn in month two and tell people why.

**Receipts that read like a human wrote them.** Every gift triggers a receipt that's a tax document below the fold and a thank-you above it — one sentence about what this fortnight's giving funded, pulled from a small CMS the fundraising team actually updates. Deductible-gift-recipient status, ABN and the exact deductible amount sit in a mono-type block, because receipts are documents and documents should look like documents. The pattern overlaps with how we think about [forms people actually finish](/journal/web-design/forms-people-finish): every field should be able to explain itself.

**Impact as a page, not a PDF.** A public impact dashboard — beds funded this quarter, tenancies held, cost per outcome, methodology in plain English underneath — replacing the annual PDF as the donor-facing source of truth. It's the same move we made for [Harvest Loop](/work/harvest-loop-food-rescue): in the non-profit world, proof is the product. The annual report still exists (the regulator requires it) but nobody's donation decision waits for it.

## The outcome

Six months after launch:

- **Checkout completion rose from 39% to 68%.** The single biggest lift came from removing the off-site redirect; field reduction contributed the rest, roughly in proportion to the number of fields removed.
- **Monthly giving grew 41% year-on-year** despite — we'd argue because of — the un-nudged toggle. Voluntary monthly selection converts at a lower rate than the guilt trap did at day one and a higher rate at day ninety.
- **Fee-coverage opt-in sits at 53%**, against an industry-benchmarked ~90% for pre-ticked models. Harbourlight's finance lead ran the numbers and chose trust: the complaint-to-testimonial ratio flipped, and unsolicited replies to receipts ("this is the first receipt I've ever read") became a small but real signal stream.
- **The impact dashboard is now the second-most visited page on the site** after the donation form itself, and its URL is what the grants officer pastes into applications.
- **Fundraising admin time fell by a day a week** — receipt variants, appeal tags and the quarterly acquittal export all stopped being manual.

## Stack and team

React and TypeScript on the front; a small Node API; Postgres for donor records with every money movement double-entered and auditable; Stripe for payments, webhooks reconciled nightly against the ledger. Hosting and tooling deliberately boring — the charity inherits this, and inheritance should be gentle. Squad: one designer, two engineers, our [growth practice](/services/growth) on analytics and the receipts programme, and Harbourlight's two-person fundraising team embedded in every review.

## What we'd tell another charity

Your donation form is the only page on your site where trust converts to revenue in real time. Audit it like a checkout, write it like a thank-you letter, and never pre-tick anything — in [non-profit work](/industries/non-profit), the long game is the only game. See more of [our case studies](/work), or [tell us about your giving flow](/contact).
