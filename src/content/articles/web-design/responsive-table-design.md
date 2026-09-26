---
title: "Tables on phones: responsive table design that respects the data"
description: "A table is a set of relationships, and a 375px screen doesn't change that. Priority columns, honest card transposition, scroll affordances, and what to omit."
slug: responsive-table-design
cluster: web-design
tags: [tables, responsive design, data design, mobile ux]
date: 2026-04-14
author: Dev Khatri
keywords: [responsive tables, mobile table design, data tables small screens, responsive data design]
readingTime: 8
---

A table is not a grid of values. It's a set of relationships — row against row, cell against column header, value against unit. The moment you squeeze one onto a 375px screen, every technique you choose either preserves those relationships or quietly destroys them while looking tidy. Most responsive-table patterns on the web choose tidiness. The data — and the person trying to compare plans, specs or transactions — pays for it.

This is the working set of patterns we reach for, in the order we reach for them, along with the honesty tests each one must pass.

## First, interrogate the table

Before any pattern, three questions:

1. **Is this actually tabular data?** If the "table" is one row of features with icons, it was a layout, not a table, and it should become cards or a list on all screens, not just phones.
2. **What task does it serve?** Comparison tasks ("which plan has SSO?") need columns side by side. Lookup tasks ("what's the status of invoice 1042?") need a findable row and tolerate stacked detail. The task picks the pattern, not the breakpoint.
3. **Does it need to exist on mobile at all?** Sometimes the right answer is a summary — "3 plans, from $29/mo" or a chart of the trend — plus a clear route to the full table. Omitting data is a design decision; making it unreadable is just a rude one.

We keep the distinction between *data tables* (long-lived product surfaces, keyboard-heavy, dense) and *presentation tables* (pricing matrices, spec sheets, comparison pages) explicit, because they deserve different mobile fates. The former we cover separately in [data tables for people who live in them](/journal/product/data-dense-tables-ux); this piece is mostly about the latter, where most of the damage is done.

## Pattern one: priority columns plus row expansion

Rank the columns by what the task needs *at a glance*, keep the first two or three visible at small widths, and let each row expand in place for the rest. An invoice table collapses to date, counterparty and amount; tap the row and you get reference, status, GST and actions.

The honesty test: the collapsed view must still answer the row-level question on its own. If users have to expand three rows to find the one they wanted, your priority columns were wrong — go back to the task. Watch what people expand in analytics or session replays; an expanded-by-everyone field was a priority column all along.

Implementation notes: the expander is a real button with `aria-expanded`, the extra content is part of the same row in the accessibility tree (or clearly associated), and expansion state survives sorting — nothing says "we didn't think about this" like a sort collapsing your open row.

## Pattern two: horizontal scroll that admits it's scrolling

Sometimes the relationships genuinely need the full width — spec sheets, financial tables, the comparison matrices this site's [comparison page article](/journal/web-design/comparison-pages-that-convert) is about. Horizontal scrolling inside a contained region is a legitimate answer, provided you do three things most implementations skip:

- **Afford the scroll.** A soft shadow or fade at the clip edge that disappears at the end of travel tells the eye "more lives sideways." An unfaded hard crop teaches users the table is broken, not scrollable. `scroll-snap` on columns can help phones land cleanly.
- **Pin the label column.** `position: sticky; left: 0` on row headers, with a background that fully covers scrolled-under cells and a hairline shadow once past it. Without the pin, users scroll to column five and forget which row they were on — the relationships dissolve again.
- **Add a keyboard path.** The scroller region needs `tabindex="0"` and an `aria-label` ("Plan comparison, scrollable") so keyboard users can arrow across it; test that focus doesn't get lost behind the sticky column. The sticky-chrome caveats from [sticky elements that don't annoy anyone](/journal/web-design/sticky-elements-that-dont-annoy) apply to the pinned column too.

One trap: wide touch targets of one column width with scroll-snap can make a horizontally paged table feel like a carousel. It's not a carousel. Don't round the corners into one.

## Pattern three: card transposition, honestly

Flipping each row into a card — label/value pairs stacked — is the most common pattern and the most commonly bungled. Done honestly:

- The card preserves **labels with values** ("Renewal date: 14 Oct 2026"), never bare values that assume you remember the column order.
- The row's identity comes first: the card's heading is whatever the row was *about*, not its first cell by accident.
- Comparison becomes impossible and you say so. A card list is for lookup and management, not for weighing row against row. If the task is comparison, use pattern two.

The tell of a lazy transposition is `display: block` sprayed over a real `<table>`. Screen readers then announce a table that visually isn't one, or worse, lose the header associations entirely. If you transpose, you are building a different component — a definition list or a labelled card — and the markup should say so. Show one or the other per breakpoint; never ship both live in the DOM with `display: none` whack-a-mole. This is the same discipline as [accessibility as an engineering practice](/journal/engineering/accessibility-as-engineering-practice): the semantic layer is the product, not the skin.

## Pattern four: reframe, don't shrink

The most underused answer at 375px is to not show the table. Replace it with what the table was *for*:

- A pricing matrix becomes "recommended plan" logic plus a link to compare all.
- A thirty-row spec sheet becomes grouped accordions (dimensions, materials, care) that mirror how people actually read specs.
- A seasonal availability table becomes a single sentence generated from the data: "In season May through September."
- Historical numbers become a sparkline and a "view full data" disclosure.

This is not dumbing down; it's art direction for data, the same instinct as [art-directing images for the responsive web](/journal/web-design/image-art-direction-web) — crops change per viewport, and so can emphasis. The full table should remain reachable (drill-down, wider view, or a downloadable CSV for the genuinely dense stuff), because someone, somewhere, is that one person comparing all nine columns on a phone. Respect them.

## Type and number discipline

Whatever the pattern, small-screen tables live or die on micro-typography:

- **Tabular numerals** (`font-variant-numeric: tabular-nums`) so columns of figures don't shimmer as values change and digits align for scanning. Non-negotiable in anything financial — the budget dashboard in our [Northwind Ledger](/work/northwind-ledger-dashboard-rebuild) rebuild leans on it everywhere.
- **Right-align numbers, left-align text, align dates consistently** (right or fixed-width), and keep units in headers rather than repeating them per cell.
- **Don't shrink below ~13px** to "fit more columns." Small type is how tables pretend to fit while failing to be read. Fewer columns, bigger text.
- Cell padding is touch padding when rows are actionable — rows under 40px tall are mis-tap farms.

Our [fluid type scales](/journal/web-design/fluid-type-scales-in-practice) token setup carries table sizes as first-class citizens for exactly this reason.

## A decision table, fittingly

| Situation | Pattern |
| --- | --- |
| Lookup task, ≤6 columns | Priority columns + row expansion |
| True comparison, wide | Horizontal scroll + sticky label column |
| Management list, detail-heavy | Honest card transposition |
| Task is really a question | Reframe (summary/accordion/chart) + link to full data |
| Dense, daily-use product grid | Stay tabular; invest in density + keyboard, not transposition |

## Key takeaways

- The task — comparing, looking up, managing — picks the pattern, not the breakpoint.
- Collapsed views must answer the row-level question alone; measure what users expand.
- Scrolled tables need edge affordances, pinned labels and a keyboard path.
- Card transposition is a new component with labels intact, not `display: block` on a table.
- Sometimes the honest responsive table is a sentence, an accordion or a chart plus a route to the data.
- Tabular numerals, unit discipline and a hard floor on type size matter more than any pattern choice.

## FAQ

**Should I just use one of those "responsive tables" plugins?**
They encode exactly one pattern (usually crude transposition) and none of the judgment about tasks. Use the four patterns above deliberately; a plugin's defaults can't know why your table exists.

**What about `display: grid` for tables?**
Fine for presentation tables where you control semantics with `role="table"` and friends — but test the screen-reader experience, because grid exposes no table relationships on its own. For real data, reach for real `<table>` markup first.

**How wide before I give up the horizontal scroll?**
Beyond roughly twelve columns, scrolling becomes archaeology on a phone. Pin labels, allow the scroll, but strongly consider pattern four: group, filter or summarise so the wide table is the exception path, not the default view.
