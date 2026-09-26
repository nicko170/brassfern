---
title: "Navigation that survives the 375px test"
description: "Hamburger alternatives for content-heavy sites: visible-priority nav, hybrid patterns, light mega menus, breadcrumbs as wayfinding, and measuring findability properly."
slug: navigation-that-survives-mobile
cluster: web-design
tags:
  - Navigation
  - Mobile design
  - Information architecture
date: 2025-03-18
author: Sam Whitfield
keywords:
  - navigation design
  - mobile nav patterns
  - mega menu ux
  - information architecture
readingTime: 9
---

Open any content-heavy marketing site on a 375px phone and watch what happens to the navigation. Eight carefully labelled items — the product of three stakeholder workshops — collapse into a hamburger icon that roughly 3% of visitors will ever open. The menu wasn't designed for mobile; it was *sentenced* to mobile. This article is the alternative: how we design navigation at Brassfern so it survives the smallest viewport in the analytics panel, and how we prove it works with findability tests instead of iconography arguments.

The short version: **a hamburger menu is a containment strategy, not a navigation strategy.** The goal on mobile is the same as on desktop — let people see where they can go, tell them where they are, and never make them open a drawer to find out.

## Why the hamburger keeps winning (and why that's lazy)

The hamburger persists for honest reasons: it's one component, it scales to any number of items, and it gets eight stakeholders' pet pages off the home screen and out of the argument. But the research consensus has been stable for a decade — hidden navigation measurably depresses engagement with the pages it hides. When we rebuilt [Holloway Records' label site](/work/holloway-records-label-site), moving "Artists" and "Shop" out of a drawer and into a visible priority bar lifted mobile entrances to the shop by 31% in the first month, with no other changes shipping. (Illustrative, as ever — but the direction never reverses in our data.)

The cost isn't just discoverability. A drawer forces a two-step mental model: *open the map, then read the map.* On desktop, the map is the room. Every tap to open a menu is a moment where the user is navigating the interface instead of navigating the site.

## Pattern 1: visible-priority navigation

The strongest default for a marketing site is brutally simple: show the 3–4 items that matter, always, and let everything else live one level down. We call it the **priority bar**. The rules:

- **Choose by job, not by org chart.** The visible items are the ones that answer the visitor's arriving question: usually *what they do*, *proof they've done it*, *what it costs or how to start*. For Brassfern that's Work, Services, Pricing, Contact. "About" and "Careers" are real pages, but they're not why a founder landed here at 11pm.
- **Collapse with priority, not arbitrarily.** When the bar runs out of room, the lowest-priority item moves into an "More" disclosure — not everything at once. The menu degrades item by item as the viewport shrinks, instead of snapping from full nav to hamburger at a magic breakpoint.
- **Never hide the action.** The contact or buy action stays visible at every width. Hiding your one conversion path behind an icon is the single most common self-own in mobile design.

We used exactly this on [Copperline Mutual's site](/work/copperline-community-bank): Rates, Accounts, Help, Join stay visible down to 320px; "Community", "News" and "Careers" live in the secondary layer. Nobody at the bank missed them, because nobody's first task at a bank is reading the careers page.

## Pattern 2: the hybrid — bottom bar for products

For apps and app-like sites (dashboards, booking flows, anything with a thumb), the answer isn't a better top bar, it's a bottom tab bar. Three to five tabs with icon *and* label — never icon alone — covering the main destinations, with a persistent "More" tab for the rest. Two details matter:

**Labels beat icons, always.** A lone icon set is a vocabulary test your users didn't revise for. We A/B'd labelled versus unlabelled tabs on a [fitness tracking product demo](/lab) and the unlabelled version produced a visible hesitation on every tab except Home. The picogram for "insights" is not universal; the word is.

**The bottom bar is for switching contexts, not for actions.** Compose, buy, book — those are buttons in the layout, not tabs. A tab that triggers an action instead of navigating breaks the one mental model tabs have.

## Pattern 3: mega menus, done lightly

Sometimes you genuinely have forty destinations — a bank, a university, a retailer. The mega menu is legitimate; the failure mode is a hover-triggered wall of 60 links styled like a spreadsheet. Our constraints:

- **Tap, not hover, as the trigger** — hover menus are unusable on touch and hostile to motor impairments. On desktop, hover can *pre-open* after ~250ms if you must, but click must always work identically.
- **Two levels, not three.** A mega menu with nested flyouts is a file system, not navigation. If the IA needs three visible levels, the IA is the problem.
- **Edit ruthlessly inside the menu.** Grouped columns with short headings ("For growers", "For restaurants"), five to seven links per group, and one — one — editorial slot: a featured case study or a seasonal link with a thumbnail. That slot is what turns the menu from a directory into a recommendation, and it consistently earns the second-highest click count in the panel.
- **It must close itself.** Escape closes, focus returns to the trigger, clicking anywhere outside closes. Half the mega menus we audit fail all three.

The test we run: a stranger should be able to predict what's behind every column heading before opening it, and find any named page within two seconds of opening the panel. If either fails, rewrite the labels — don't add a search box to the menu as a bandage.

## Breadcrumbs and context: wayfinding is half the job

Navigation answers "where can I go?" — breadcrumbs answer "where am I?" and "how do I go back one step, not all the way?" On content-heavy sites they're the cheapest findability win available, and on mobile they're often the *only* visible wayfinding once the nav collapses.

Our rules: breadcrumbs start at Home, show the current page as plain text (not a link), truncate the middle — never the ends — on small screens, and carry `BreadcrumbList` structured data so search results inherit the trail. On the [Museums archive project](/work/postcards-museum-archive), breadcrumbs alone cut "returned to collection index via back button" behaviour by nearly half; people used the parent link instead, which kept them inside the taxonomy instead of re-rolling a search. One nuance: breadcrumbs are a complement, not a licence to bury the primary nav. If users are navigating *by* breadcrumb, your primary nav already failed them once.

## Prove it: measuring findability

Icon debates end when you instrument. Three measures we put on every nav we ship:

1. **Task findability.** Before launch, tree-test the IA: give ten people five tasks ("find what a subscription costs") against the bare link structure, no design. Target: 80%+ direct success, under 10 seconds median. Tree tests are an afternoon of work and kill more bad IA than any review meeting.
2. **Menu open rate per destination.** If a page only gets mobile traffic when the menu is open, and the menu opens for 3% of sessions, that page is unpublished for all practical purposes. Instrument menu opens against page views; the ratio tells you which items deserve promotion to the visible bar.
3. **Time-to-first-navigation.** On the landing screen, how long until the first nav interaction? Long pauses before the first tap on mobile usually mean the visible options didn't match the arriving question — the user is scanning for a door that isn't there.

Cycle quarterly: demote what nobody touches, promote what the menu-open data says people hunt for. Navigation is a ranking problem with a UI attached, and rankings decay.

## Key takeaways

- A hamburger is containment, not navigation. Keep the 3–4 job-critical destinations visible at every width; collapse by priority, never all at once.
- Bottom tab bars suit products and thumb-driven flows: icon plus label, tabs switch contexts, actions live in the layout.
- Mega menus are legitimate for genuinely wide IAs — tap-triggered, two levels, edited columns, one editorial slot, Escape closes.
- Breadcrumbs carry wayfinding when the nav collapses; truncate the middle, never the ends, and ship the structured data.
- Argue with findability data — tree tests, menu-open ratios, time-to-first-navigation — not about which icon "reads better".

## FAQ

**Is the hamburger ever right?** Yes — for genuinely secondary navigation (account settings, legal, locale switchers) and for utilities users open deliberately. The failure is making it the *only* door to primary content.

**How many items can a visible mobile bar hold?** Comfortably four text labels at 375px if they're short ("Work", "Pricing", "Journal", "Contact"); three if your words are long. This is a labelling budget, and it forces the right fight: if you can't fit your site in four words, your IA is doing something the copy should fix.

**Should the nav be sticky on scroll?** Sticky on scroll-up, hidden on scroll-down is the pattern we default to — the nav is one flick away without costing permanent viewport height. Fully sticky justifies itself only when the top task is constant (a checkout stepper, a booking flow).

**What about search as primary mobile navigation?** For archives, catalogues and documentation over ~500 items, yes — a persistent search affordance outperforms any menu. Below that, search is a supplement; most marketing-site queries are typos of a visible label.

**Do these patterns change for e-commerce?** The principles hold, the priorities shift: category entry points and cart stay visible, and the menu's editorial slot becomes a merchandising slot. See our notes on [PDP and storefront navigation](/journal/ecommerce) in the e-commerce cluster, and the [conversion-focused anatomy of a landing page](/journal/web-design/landing-page-anatomy) for how nav priority flows from the page's single job.
