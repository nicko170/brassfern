---
title: "Settings IA: where features go to be findable"
description: "Settings screens are where growing products quietly drown. Grouping by user intent, search-within-settings, destructive zoning and how to migrate categories safely."
slug: settings-information-architecture
cluster: product
tags:
  - Information architecture
  - Product design
  - Navigation
  - UX debt
date: 2026-05-12
author: Aiko Tanaka
keywords:
  - settings page design
  - information architecture
  - settings ux
  - product navigation
readingTime: 8
---

Every product's settings area is an honest biography of the company: you can see exactly when each team shipped, what they cared about, and where the org chart's fault lines ran. "Billing" lives under Admin because the platform team owned it. "Notifications" appears twice, configured differently, because two squads built on the same idea without talking. Nobody designed this geography. It accreted, the way pricing pages accrete, until the settings screen became the junk drawer where features go to be technically present and practically invisible.

Users experience this as a specific dread: knowing a thing must be possible but not knowing where it lives. Support tickets experience it as volume. Here's the practice we use to rebuild settings IA without breaking the existing users' muscle memory.

## Principle 1: group by the user's errand, not your architecture

The root sin of settings IA is structural honesty about the wrong thing. Engineers group settings by subsystem ("API", "Webhooks", "OAuth"), designers group by screen ("Profile", "Preferences"), and users arrive with errands: *stop these emails, change who pays, make me harder to hack, get my data out*. None of those errands know or care which subsystem serves them.

The fix is a card sort, but a specific kind: don't sort feature names — features are too insider — sort **stated errands**. Write thirty to fifty tasks in the user's grammar ("Change who receives invoices", "Turn off the weekly digest email", "Download everything we store about my account") and let users group them. The clusters that emerge are reliably different from the org chart and remarkably consistent across user types. On the [Copperline Mutual](/work/copperline-community-bank) work, errand-sorting collapsed fourteen developer-shaped categories into five user-shaped ones — Money, People, Security, Messages, Your info — and "where do I…" tickets fell away accordingly. (Illustrative figures; the direction held across every segment.)

A rule of thumb that travels: **category names pass the voicemail test** — could a user leaving a support voicemail say "it's under…" and have a reasonable chance of being right? If your category requires knowing how the software is built, it fails.

## Principle 2: depth is a tax; two levels is the budget

Settings hierarchies deeper than two levels (category → screen) hide things catastrophically. Each level of nesting cuts discoverability not arithmetically but emotionally — users stop digging. When we audit settings IA, we draw the tree and apply brutal questions:

- **Anything three levels deep gets re-homed or promoted.** A setting that matters at level three is either in the wrong category or important enough to surface higher.
- **Categories with one screen aren't categories.** Merge upward. "API" containing a single screen of keys belongs inside "Developers" or "Integrations".
- **Screens with one setting aren't screens.** A page holding only "email frequency: weekly" is a toggle in search of a neighbourhood — put it in Notifications where the errand lives.

The counter-pressure is the settings landing page becoming a wall of links. That wall is fine — better a scannable list of forty visible destinations than five mystery doors, as long as the ordering follows errand frequency from your analytics, most-used first.

## Principle 3: settings need their own search

Products happily build search for content and then forget that settings are content. A user who wants "two-factor" should not need to know you filed it under Security → Sign-in options. Settings search is cheap to build — the corpus is tiny, a few hundred strings — and disproportionately valuable, because it serves exactly the moment of highest frustration. When we redesigned dashboard settings for [Northwind Ledger](/work/northwind-ledger-dashboard-rebuild), in-settings search became the most-used navigation pattern within a month of shipping (again, illustrative — but pattern-typical). Three details make it work:

- **Search synonyms and outcomes, not just labels.** "Cancel", "refund", "stop paying" should all reach Billing. This synonym map is a content deliverable — write it with support's ticket transcripts open.
- **Result rows show the breadcrumb** ("Security → Sign-in options"), teaching the IA as a side effect.
- **Deep-link every result** straight to the field, scrolled and highlighted, not just the screen.

## Principle 4: zone the dangerous things

Destructive settings — delete workspace, transfer ownership, revoke all keys — should be deliberately *less* smooth than everything else. The pattern we standardise on:

- A visually distinct "danger zone", separated, labelled plainly, never disguised among ordinary controls.
- A two-step confirm whose friction is proportional to blast radius: typing the workspace name for deletion; a checkbox-and-button for anything reversible.
- **The consequence stated in the user's terms** before the point of no return: "This deletes 14 projects and 3 years of invoices. Exports are also deleted." Never "This action cannot be undone" alone — that's a threat without information.

The zoning principle generalises: the higher the consequence, the further from habitual click-paths the control sits. This is [progressive disclosure's](/journal/product/progressive-disclosure-complexity) grumpy cousin — some things should be findable but not *stumble-into-able*.

## Principle 5: migration is a feature, not a launch note

Eventually the categories must change, and existing users have geography in their heads. Handle it like you'd handle a breaking API change:

1. **Redirect, don't remove.** Old IA paths deep-link to their new homes for at least a quarter. Bookmarks, support macros and old help articles all depend on them.
2. **Annotate the change in place.** A quiet, dismissible "Billing moved here from Account" note for returning users, killed after a few weeks.
3. **Update every exoskeleton**: help centre articles, support macros, onboarding tours. A new IA with old documentation is worse than the old IA — it's two wrong maps.
4. **Instrument the transition**: settings searches that end in nothing, errand-completion time before and after. If search misses spike after migration, your synonym map didn't travel.

## The maintenance model

Settings IA decays by default because every team can add and nobody must remove. The governance that works is boring: settings changes ride the same design review as user-facing features, with one named owner of the taxonomy; a quarterly audit pass (draw the tree, check for orphans and duplicates); and a rule that new settings must justify why they *are* settings at all — the best settings screen is the one that doesn't exist because the default was right. Sensible defaults are product strategy, as we argue in the [complexity piece](/journal/product/progressive-disclosure-complexity), and settings are where product teams pay for indecisive defaults forever.

## Key takeaways

- Sort errands, not features: cluster user-stated tasks, name categories so users could guess them blind.
- Two levels of depth is the budget; re-home anything deeper.
- In-settings search is the highest-value search you'll ever build — synonyms, breadcrumbs, deep links.
- Dangerous actions get deliberate friction, plain consequence statements and their own visual zone.
- Category migrations need redirects, in-place annotations and updated documentation, or you now have two wrong maps.

## Frequently asked questions

**When should a growing product restructure its settings IA?**
When "where do I…" support tickets mention settings more than any single feature, when new settings are being added to categories by vibes, or when you can't draw the tree in under a minute — any one of the three means the geography no longer matches the product. Errand-sorted restructuring is a two- to four-week discovery inside a [product engagement](/services/product), not a rebuild.

**Should settings live in the main navigation or behind the avatar?**
Follow frequency and anxiety. High-frequency, low-anxiety settings (appearance, notifications) earn top-level visibility. Low-frequency or high-anxiety settings (billing, deletion) belong behind an account layer where a deliberate user finds them. The trap is putting billing behind the avatar to "reduce clutter" — users read that as hiding, and they're right.

**How many settings is too many?**
There's no count threshold, but there's a test: for each setting, ask what happens if you delete it and pick a default. If the honest answer is "some users are hurt", it stays. If the answer is "someone once asked", it's noise. Settings accumulate because adding is a decision nobody must defend; make removal equally discussable in review.

**Do desktop-era settings patterns still apply to mobile?**
The IA principles travel; the surfaces don't. Mobile settings need shallower trees, search even earlier (thumb-height), and dangerous actions even more carefully zoned, because accidental taps are rife. Errand sorting, two-level budgets and danger zoning are platform-independent — they're about human errands, and errands don't own devices.
