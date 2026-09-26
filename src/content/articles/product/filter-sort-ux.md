---
title: "Filters, facets and sorts that hold up"
description: "Faceted filtering is where product UX goes to quietly die. Per-facet counts, honest applied-state chips, URL-synced views and zero-results recovery that works."
slug: filter-sort-ux
cluster: product
tags: [filters, interaction design, UX, product design, search]
date: 2026-03-12
author: Aiko Tanaka
keywords: [faceted filter ux, filter chips, zero results recovery, sort persistence, url state filters]
readingTime: 9
---

Every product with more than a screenful of records eventually grows a filter bar, and that's usually where the design stops being designed. Filters get bolted on: a dropdown here, a date range there, a sort menu that resets every visit. Six months later the team is fielding support tickets from users who are staring at zero results and can't tell *which* of their four filters did it.

Filters are not a control cluster. They are a conversation: the user says "show me less of this, more of that," and the product answers. Most filter UIs are incapable of holding that conversation because nobody decided what the rules were. Here are the rules we ship, learned across [Northwind Ledger's dashboard rebuild](/work/northwind-ledger-dashboard-rebuild), [Quarry & Compass's property search](/work/quarry-and-compass-property) and more admin consoles than we'll admit to.

## Applied filters are state, not decoration

The single most common failure: the user applies three filters from a panel, the panel closes, and the current filter state becomes invisible. The user is now looking at a subset the product remembers and they don't. Every "the data is wrong" support ticket starts here.

The fix is boring and non-negotiable: **applied filters render as chips above the results, always visible, always removable.** Each chip names the facet and the value — `Status: Overdue`, not just `Overdue` — because six bare values in a row is a guessing game. The whole chip is the remove affordance; don't hide a 12px × in the corner. And one `Clear all` sits at the end, styled quieter than the chips, because clearing everything should never be the same visual weight as clearing something.

Two details earn their keep. Chips should appear in the order applied, not the facet order — it tells a story the user can re-read. And interactive chips need a cursor, a focus ring and a hover state like any other control, because we've watched users in testing sessions not realise their own filters were removable.

## Facet counts: honest or absent

Counts in facets ("Status — Overdue (14)") are genuinely useful: they let users explore without committing. But they are also the easiest place to lie. The decisions:

- **Show counts only if they're cheap and correct.** If computing live counts fans out into an expensive query, drop the counts. A filter panel without counts still works; a filter panel with stale counts actively trains users to distrust the product.
- **Decide what the count means and never deviate.** Two defensible semantics: count-of-results-if-this-were-applied-on-top-of-current-filters (predictive), or count-in-current-result-set (descriptive). Predictive is friendlier for discovery; descriptive is simpler to keep honest. The lie to avoid is mixing both in one panel.
- **Zero counts stay visible but disabled.** Removing options from the panel as filters tighten is disorienting — the UI reshuffles under the user's hand. Grey out the dead options, keep the spatial memory intact.

On Northwind Ledger we shipped predictive counts and watched a support category die entirely. The accountants could see "Overdue (14)" before clicking, and the click became a confirmation instead of a gamble.

## URL-synced, or it's not a real feature

This is the part teams cut and always regret. If filter state doesn't live in the URL, then filtered views can't be shared, bookmarked, refreshed, linked from a notification, or survived by a back button. Every one of those is a real workflow in a team product: "look at these overdue invoices" is a Slack message, not a screen share.

Put the filter state in query params — readable ones, `?status=overdue&owner=priya`, not an opaque base64 blob — and treat the URL as the single source of truth. This one decision cascades beautifully: the back button becomes "unapply last filter," refresh just works, and your support team can send users links. The engineering discipline is the same argument we make in [the URL is your best state manager](/journal/engineering/url-as-state-management): the address bar is a UI surface you get for free, and squandering it is a choice.

One nuance: sort and pagination belong in the URL too, with sort defaulting out of the URL when it's at its default value. Clean URLs for the common case, complete URLs for the interesting case.

## Zero results is a filter problem, not an empty state problem

Designing a lovely zero-results illustration is solving the wrong problem. By definition, a user at zero results *filtered their way there* — the product knows exactly which combination produced nothing, and a witty illustration doesn't. The pattern that works:

1. **Name the cause.** "No results match Status: Overdue + Region: North." The sentence is built from the chips, so it's concrete, not generic.
2. **Suggest the drop.** Identify the single filter whose removal restores results and offer it as a button: "Remove Region: North (shows 23 results)." Computing the best candidate is one extra query per facet and it's worth every millisecond.
3. **Offer the reset.** "Clear all filters" as a real button, not footer text.

This is the filter-specific version of the rule from our [search UX work](/journal/product/search-ux-product): at the moment of failure, the interface earns trust by demonstrating it understood the request. And it pairs with the broader principle in [error states done well over at the web-design cluster](/journal/web-design) — recovery is a design surface, not an apology.

## Sort is a preference; persistence is respect

Sort behaviour fails in two directions. Direction one: sort resets on every visit, so the accounts payable clerk re-sorts by due date twenty times a day and quietly hates you. Direction two: sort persists globally, so a user who sorted one table by name once now finds every list in the product mysteriously alphabetical.

The contract we ship:

- **Persistence is per-view, per-user.** The invoices table remembers my sort; the customers table is a different job with its own memory. Server-side persistence survives devices; localStorage is the acceptable minimum.
- **Multi-column sort is visible or absent.** If shift-click sorts by a second column, that has to show up in the header (`Due date ↑, then Amount ↓`) — hidden secondary order is indistinguishable from randomness to a user scanning a column.
- **The default sort is a product decision.** "Most recently active" is usually right for work queues and usually wrong for reference data. Say which job each list serves, then default accordingly. Nobody ever complained about a default; they complain about fighting it daily.

## The mobile drawer contract

On desktop, filters live in a sidebar or toolbar. On mobile, they collapse into a drawer — and most drawers break the desktop contract. The rules:

- **The trigger shows the count.** `Filters (3)` with a badge when filters are active. An unbadged funnel icon is how active filters become invisible on small screens.
- **Apply is explicit and shows the stakes.** `Show 23 results` on the apply button, live-updating as options change. The user never commits blind.
- **Closing without applying discards.** Cancel and swipe-down mean "I was looking," not "half-apply what I touched."
- **Chips survive the drawer.** Applied filters render as horizontally scrollable chips below the trigger on mobile too. The state-never-hides rule is screen-size independent.

## What we stopped doing

Three patterns we've banned from Brassfern builds. Dropdowns that apply on selection (each change reflows results under a closed menu — bulk-select inside the panel, or use checkboxes with an apply button). Filter state in a modal that covers the results (the user is tuning blind; the results should be visible while filtering whenever viewport allows). And the global "advanced search" page divorced from the list (two filter systems to maintain, and the advanced one always rots). Faceted filtering on the results page is the whole game.

## Key takeaways

- Applied filters are always-on-screen chips, ordered as applied, each one removable; `Clear all` is quieter than the chips.
- Facet counts are predictive *or* descriptive, never mixed; if they can't be correct and cheap, ship no counts.
- Filter, sort and pagination state lives in readable URL params — shareability and the back button are features.
- Zero results should name the offending filter combination and offer the single-drop fix with its payoff count.
- Sort persists per-view, per-user; the default sort is a product decision about what job the list does.
- The mobile drawer shows active-filter count on its trigger, live result counts on apply, and chips outside the drawer.

## FAQ

**How many facets is too many?** Past about seven visible facets, switch to a primary set plus a "More filters" disclosure. Beyond fifteen, reconsider the IA — some of those filters are usually navigation in disguise, or fields nobody filters by that exist because the data does.

**Should filter panels apply live or on submit?** Live on desktop if the query is fast (under ~300ms); live filtering against a slow API is a flicker machine. On mobile, explicit apply with a live result count is the compromise that keeps both speed and commit confidence.

**Do saved views belong next to filters?** Yes — a named saved view is just a filter-plus-sort bundle with a label, and for table-heavy products it's often the highest-retention feature in the whole screen, as we found on [Northwind Ledger](/work/northwind-ledger-dashboard-rebuild). Save, rename and share beat re-filtering every time.

**What about filters for accessibility?** Chips need real buttons with labels ("Remove filter: Status Overdue"), the results region should announce count changes politely via `aria-live`, and filter drawers need focus trapping *and* the rule from [WCAG AA for product teams](/journal/product/wcag-aa-product-teams): test with a keyboard before it goes in the sprint demo, not before the audit.
