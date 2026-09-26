---
title: "B2B wholesale portals: design for the reorder"
description: "Wholesale buyers are professionals doing a job. Quick-order tables, SKU paste, standing orders, net terms and account hierarchies — built for the reorder."
slug: wholesale-portal-design
cluster: ecommerce
tags: [ecommerce, B2B, product design, UX, wholesale]
date: 2026-03-21
author: Nate Sullivan
keywords: [wholesale portal design, B2B ecommerce UX, reorder UX, B2B ordering platform]
readingTime: 10
---

Consumer e-commerce design assumes a browser: someone wandering, persuadable, half-decided. Wholesale assumes the opposite. The person using your portal is a cafe manager doing the fortnightly order at 6:40 am with a milk crate of scribbled notes, or a buyer at a retailer with a spreadsheet they've refined for years. They know exactly what they want. They have ordered it forty times. Your portal's job is not to inspire them — it's to get out of their way so well that they'd rather order from you at a slightly worse price than fight a competitor's prettier catalogue.

That inversion changes almost every design decision. Here's how we think about wholesale portals after building several — including [Arkwright Supply's B2B commerce platform](/work/arkwright-supply-b2b-commerce) and the [Ironbark trade portal](/work/ironbark-trade-portal) — and where the conventional DTC playbook actively misleads you.

## The mental model: replenishment, not discovery

Consumer funnels run awareness → consideration → purchase. Wholesale funnels run **restock → restock → restock**, punctuated occasionally by "new line approval". Design the information architecture around that:

- **The homepage is a dashboard, not a shopfront.** Open with the reorder: last order summary, "order again" one-tap, standing order status, and any account news (price changes, discontinued lines, credit-hold warnings). Merchandising, if present at all, is a single rail of new and seasonal lines below the fold.
- **Navigation is SKU-first.** Category browsing exists, but the primary paths are search-by-SKU, category-by-last-purchased, and the order pad. A wholesale homepage with a hero video and a lifestyle carousel has mistaken the buyer for a tourist.
- **Sessions are long and utilitarian.** A buyer building a $4,000 order across 60 lines may be in the portal for an hour. Autosave the cart relentlessly — losing an hour's order to a session timeout is how portals get abandoned for phone calls, and phone orders cost you ten times more to serve.

## The quick-order table is the heart of the product

If you build one thing well, build the order pad: a dense, keyboard-first table — SKU or product name, pack size, price, quantity, line total — that behaves like a competent spreadsheet. The requirements that separate professional from decorative:

1. **SKU paste.** Buyers keep orders in spreadsheets and emails. A paste box that accepts a column of SKUs and quantities — tab-separated, comma-separated, or "2 x ARK-1042, 1 x ARK-2077" — and resolves them into cart lines is the single most-loved feature in every wholesale portal we've shipped. Handle failures gracefully: unrecognised SKUs listed with suggestions, never silently dropped.
2. **Full keyboard traversal.** Enter advances to the next row's quantity; Tab moves across; Escape aborts a search without losing the entry. A buyer who can't do the whole order from the keyboard will do the order by phone.
3. **Running totals at the edges.** Cart total, line count, and — critically — **delivery minimum progress** ("$230 more for free freight") pinned in view. Wholesale buyers optimise to freight thresholds the way consumers optimise to free-shipping bars, except they do it every single order.
4. **Pack-size truth.** Units in wholesale are ambiguous by nature: is quantity 12 twelve units or twelve cartons of twelve? Show the maths per line — "12 cartons × 12 units = 144 units, $518.40" — so a misplaced order is caught on screen instead of at the loading dock.

## Pricing and terms: display the deal, not the sticker

Wholesale pricing is contractual and layered, and the portal's first job is making the buyer's *specific* deal legible:

- **Authenticated pricing only.** Their tier price, their contract discounts, their volume breaks — shown per line, with the list price struck through when relevant. Public sticker price with a vague "your discount applies at checkout" destroys trust because it forces the buyer to do your accounting in their head.
- **Volume breaks as a motivation, not a footnote.** "Order 5 more cartons, save 4% on this line" inline on the order pad actively builds the order. It behaves like the [cart-as-negotiation](/journal/ecommerce/cart-design-patterns) pattern — show the deal improving as they build — tuned for professional quantities.
- **Net terms, displayed as plainly as prices.** "Net 30 — next statement 1 June" on the account dashboard and at checkout. If the account is near its credit limit, say so *before* the order is built, not after: "You've used 86% of your $15,000 limit; this order fits." A credit block discovered after an hour of order-building is a betrayal the buyer remembers at the exact moment they're choosing suppliers.
- **GST and the invoice reality.** AU/NZ wholesale buyers think in ex-GST numbers and reconcile in inc-GST ones. Show both, labelled, and make the order confirmation match what their accounting software will see. The portal that matches the ledger earns the finance team's loyalty, and finance chooses suppliers more often than marketing admits.

## Accounts are hierarchies, not users

A B2B account is a company with structure: a head buyer who approves, three store managers who order, a bookkeeper who needs invoices. Design for the org chart:

- **Roles and ceilings.** Sub-users with spend ceilings ("can order up to $2,000, above that routes for approval") turn the portal from a risk into a sanctioned tool. Approval flows should be one tap from an email — a manager approving an order shouldn't need to find the "pending approvals" screen themselves.
- **Ship-to management.** Multi-site businesses need saved delivery addresses per store, each with its own receiving hours and notes ("dock at rear, call 30 min ahead"). Delivery instructions attached to the site, not retyped per order — retyped instructions are how pallets end up at the wrong door.
- **The sales rep is a feature, not a fossil.** Good portals don't eliminate reps; they aim them. Give reps a view of their accounts' carts-in-progress, flagged drop-offs ("Cafe Meridian ordered fortnightly for two years, nothing in six weeks"), and a clean way to place orders *on behalf of* a customer during a phone call. The portal handles the routine so the rep handles the relationship.

## The catalogue: assume competence

This is the inversion that surprises DTC-trained teams: wholesale product pages should be **denser and duller** than consumer ones, on purpose.

- **Facts over romance.** A consumer PDP tells a story; a trade PDP is a spec sheet: SKU, pack size, barcode, shelflife, MOQ, lead time, margin calculator if you're generous, and the safety/compliance documents as downloads. The buyer has already decided the product is good — they decided last year. Now they're checking the pallet maths.
- **Availability with dates, per warehouse.** "In stock — 240 cartons, ships from Melbourne Tuesday" beats a green dot. Trade buyers plan inventory; vague stock states force a phone call, and every forced phone call is a leak in your self-service economics. The discipline is the same as [honest inventory UX](/journal/ecommerce/honest-inventory-ux) — just with professional stakes.
- **New lines as a deliberate moment.** Since the default behaviour is reorder, new-product discovery can't rely on browse. Use the weekly order rhythm: "New this fortnight" pinned to the dashboard, tasting notes and margin data attached, samples orderable in one click. You're pitching a line extension to a professional — bring numbers, not mood boards.
- **Keep the taxonomy industrial.** Trade buyers navigate by the categories your industry already uses, not by your brand team's lifestyle architecture. Our piece on [e-commerce taxonomy](/journal/ecommerce/ecommerce-navigation-taxonomy) covers the general craft; in wholesale, borrow the industry's vocabulary wholesale.

## Measure what wholesale actually optimises

Consumer KPIs (bounce rate! session length!) are noise here. The wholesale scoreboard:

- **Self-service order share**: the share of order value placed without rep involvement. This is the economics — every percentage point is cost out of serving revenue.
- **Time-to-complete-order**: median session from login to submitted order. Down is better. A wholesale portal where rising session length is celebrated has broken something.
- **Reorder rate on standing orders** and **paste-upload adoption**: proxies for whether the two flagship features are doing their jobs.
- **Phone-order deflection**: inbound phone/fax/email orders per account per month. Track it honestly, including the calls your portal *caused* ("the site wouldn't let me…"). The call drivers report should feed your backlog directly.

## Key takeaways

- Wholesale UX is replenishment design: open with the reorder, not the shopfront.
- The quick-order table with SKU paste, keyboard traversal and freight-threshold totals is the soul of the product.
- Show contracted pricing, volume breaks and net terms per line — a buyer should never do your accounting in their head.
- Accounts are org charts: roles, spend ceilings, approval flows, per-site delivery instructions.
- Price stock like a promise — quantities, warehouses, dates — because vague availability forces the phone calls you're trying to eliminate.
- Measure self-service order share and time-to-order; session length growing is a bad sign.

## FAQ

**Should the wholesale portal share a storefront with our DTC site?** Shared backend, yes — inventory, pricing engine, catalogue data. Shared *frontend*, almost never. The two audiences need opposite densities, different navigation and different checkouts (net terms vs card). Brands that bolt trade ordering onto a consumer theme end up serving both audiences at 60%.

**How do we onboard buyers who've ordered by phone for twenty years?** Migration is a sales motion, not a UX motion: the rep walks the buyer's first order *with* them, the first three orders carry a phone-safety-net line ("stuck? call and we'll finish it"), and the portal quietly demonstrates the perks the phone can't match — instant pricing, order history, standing orders. Adoption follows demonstrated respect, not forced cut-off dates.

**What's the minimum viable wholesale portal for a small brand?** Order pad with SKU paste, account-tier pricing, saved addresses, net-terms display, and order history with reorder. That five-feature portal beats a sprawling one, and it's the sort of focused build we scope on the [pricing page](/pricing) under a fixed-scope sprint. Fancy can wait; fast can't.

**Do standing orders risk over-stocking customers?** Only if designed trap-like. Good standing orders require a confirmation window before each dispatch ("your fortnightly order ships Thursday — edit by Tuesday") and make pausing one tap. A standing order that respects the buyer is the stickiest feature in wholesale; one that ambushes them is a churn machine wearing a retention costume. See [subscription UX that retains without trapping](/journal/ecommerce/subscription-ux-design) — the ethics transfer intact.
