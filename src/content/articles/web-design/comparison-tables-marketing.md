---
title: "Comparison tables: the marketing page's hardest-working table"
description: "Feature matrices carry your pricing argument. Honest checkmarks, mobile collapse patterns, the competitor-row dilemma, and the semantics most teams skip."
slug: comparison-tables-marketing
cluster: web-design
tags: [comparison tables, pricing pages, feature matrix, marketing pages]
date: 2026-05-09
author: Aiko Tanaka
keywords: [comparison tables, feature comparison, pricing table design, marketing pages, plan comparison]
readingTime: 8
---

No element on a marketing site works harder per pixel than the comparison table. It sits at the exact moment of decision, compresses your entire pricing argument into a grid of glyphs, and gets read by the most impatient audience you'll ever design for: someone holding a corporate card, tabbing between you and two competitors, looking for a reason to stop evaluating.

It's also the element most often shipped dishonestly — by accident, usually. Here's how we build them to hold up.

## The table is an argument, not a database

A feature matrix is not an inventory of your product. It's a ranking of the differences that matter, ordered by how much they move the decision. That means the first discipline is subtraction.

The rule of thumb: **twelve to eighteen rows, grouped into three or four clusters**. More than that and you're shipping your changelog as marketing. Every row you include should pass one test — *does a meaningful slice of evaluators rule plans in or out based on this row?* "Unlimited projects" passes. "99.9% uptime SLA" passes if competitors offer worse. "Beautiful interface" fails, and not just because it's uncheckable.

Order matters more than teams expect. Lead each cluster with the differentiator the mid-tier plan wins on, because the mid-tier is almost always the plan you're steering toward. The table is a funnel wearing a grid's clothing — the same quiet steering we wrote about in [pricing pages that convert quietly](/journal/web-design/pricing-pages-that-convert-quietly), just compressed into cells.

## Checkbox semantics: what a tick actually means

The cells of a comparison table carry five possible values, but teams reach for two glyphs. That mismatch is where dishonesty creeps in:

1. **Yes** — a tick, and nothing else. No asterisk ritual, no tooltip.
2. **No** — an em dash or a muted minus, never a cross. A red ✕ brands the plan; a quiet dash just says "not here."
3. **Partial** — the honest hardest case. "SSO (SAML only)", "API — read-only". Never a bare tick with a superscript asterisk; that's a tick that converts into a support ticket later.
4. **Quantity** — "10 seats", "3 environments". Use the number, not a row of tiered ticks.
5. **Add-on** — a plus glyph or the word "Add-on", consistently. An add-on tick pretending to be included is the single most common dark pattern in the genre.

If you take one thing from this article: **every tick must mean the same thing in every row**. A tick that means "included" in one row and "available on request" in another is not a table; it's a wager that nobody will read both rows. Someone always reads both rows. They work in procurement.

## The markup nobody wants to write

Comparison tables are real tables. Not divs, not a grid of cards pretending. `table`, `th scope="col"` for the plan headers, `th scope="row"` for the feature names, cluster groupings as `<tbody>` with a spanning header row. The semantics pay out immediately:

- Screen reader users get column context announced per cell ("SSO, Growth plan: included").
- The table survives copy-paste into procurement decks — which is where your table is going, whether you like it or not.
- Find-in-page works. Evaluators *do* hit ⌘F for "SOC 2".

Announce the glyph, don't rely on it: `<span class="visually-hidden">Included</span>` beside a tick graphic, or an SVG with a proper accessible name. We've audited marketing sites where screen readers announce five minutes of silence punctuated by occasional "image". That's the tick column.

For the mobile half of the story — sticky plan headers, column swiping, card transposition — the patterns in [responsive table design](/journal/web-design/responsive-table-design) apply directly. The one addition for comparison tables specifically: **pin the recommended plan as the first data column**, not the last. On a two-column-wide phone viewport, a recommended plan sitting fourth is a plan nobody scrolls to.

## The competitor-row dilemma

Should you include a "Us vs. Them" column? Sometimes, with discipline:

- **Compare categories, not caricatures.** "Spreadsheet workflows" or "Legacy suites" as a column is honest. A specific competitor's logo in a column you control invites stale information and legal grey zones — leave named head-to-heads to dedicated [comparison pages](/journal/web-design/comparison-pages-that-convert), where the format allows nuance and a date stamp.
- **Every claim needs a receipt.** If your table says the category "requires plugins" for a feature, someone must be able to produce the screenshot. We keep a dated evidence file for every row of every competitive table we ship.
- **Never mark the competitor row with crosses while your column is all ticks.** Nobody believes it, it reads as fear, and it makes the honest rows suspect too. If the competitor genuinely wins a row, give them the tick. That single tick buys more trust than the other eleven rows combined.

A client of ours in the retail analytics space ran an A/B on exactly this: identical tables, one where the incumbent category won two rows honestly, one where they lost all twelve. The honest version won on qualified demo requests by 19%. Evaluators aren't looking for perfection; they're looking for a vendor who grades themselves like an adult.

## Density, highlighting and the column you want to sell

Visual hierarchy in a comparison table does two jobs: it keeps the grid scannable, and it points at the plan you recommend.

- **Highlight one column, quietly.** A hairline frame or a 4% tint on the recommended column, plus a mono "Most chosen" label above the plan name. Full-saturation fills read as a pop-up.
- **Align values to the same baseline column-wide** so the eye can scan down the recommended plan without refocusing per row.
- **Row hover highlighting** is a gift on wide tables — but keep contrast on the highlighted row compliant, and make sure the hover is on the `<tr>`, not enacted by JavaScript that breaks when the sticky header clones the row.
- **Sticky plan headers** on long tables only — under twenty rows, they earn nothing and cost a layer of compositing on every scroll.

And keep the table near the pricing cards it explains, not divorced onto a separate page. The evaluator's loop is *card → question → table → card*. Every link in that loop you replace with a scroll-leap costs you evaluators — worth measuring in the plan you write for the launch, which is a measurement-planning habit we cover in [measure before you build](/journal/playbooks/measurement-plan-before-build).

## Key takeaways

- A comparison table is an argument in grid form: twelve to eighteen rows, ordered by decision impact, clustered by theme.
- Five cell values exist — yes, no, partial, quantity, add-on — and every tick must mean the same thing in every row, forever.
- Real `<table>` semantics with scope attributes: screen readers, copy-paste into decks, and find-in-page all depend on it.
- Competitive columns can work if you compare categories honestly, keep receipts, and let the competitor win a row.
- Pin the recommended plan as the first data column on mobile, highlight it with restraint on desktop.

## FAQ

**Checkmarks or written-out "Yes"/"No"?**
Glyphs scan better across asymmetrical rows; words localise and announce better. The answer is both: a glyph with a visually hidden text equivalent. Never glyph-only — that's unreadable to find-in-page, translation and screen readers at once.

**How many plans before a table collapses under its own weight?**
Four columns of plans is the practical ceiling for a readable matrix, and three is the sweet spot. At five or more, split by audience ("For teams / For enterprise") into two tables rather than shipping one unreadable one.

**Should the feature names link to docs?**
Yes — sparingly. Link the two or three features complex enough that a cell can't do them justice ("SOC 2", "Audit logs"). A table where every row links out is a table that funnels evaluators away from the decision.

**Is an interactive "choose your team size" configurator better than a static table?**
Different job. The configurator answers "what's my price"; the table answers "why this plan". Sites that replace the table with a calculator lose the evaluators who are still arguing about *which tier to pitch internally*, which is most of them.
