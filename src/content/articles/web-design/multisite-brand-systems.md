---
title: "One system, many sites: multi-property brand design"
description: "Running several web properties off one brand system without blurring them: shared tokens, house vs. property layers, cross-site navigation and honest governance."
slug: multisite-brand-systems
cluster: web-design
tags:
  - Design systems
  - Brand systems
  - Design ops
  - Typography
date: 2026-05-14
author: Mara Ellison
keywords:
  - multi-brand web design
  - design system tokens
  - brand architecture web
  - design ops
  - sub-brand websites
readingTime: 11
---

A group with one website has a design problem. A group with six websites has a design *politics* problem. The restaurant group that wants each venue to feel singular, but the group to feel like a family. The software company whose product, developer docs, academy and careers site all ship from different teams on different cadences. The non-profit federation where the national body and the local chapters need to be obviously related and obviously independent.

This is multi-property brand design, and the failure mode is always the same shape: either the properties homogenise into one beige sprawl with different logos swapped in, or they drift into six unrelated sites that share a footer link. Both are governance failures dressed as design failures. Here's how we run one system across many surfaces without sanding off what makes each surface worth visiting.

## Start with architecture, not art direction

Before a single token, the group has to answer a question it has usually been avoiding: what is the relationship between these properties? This is brand architecture, and we have a whole piece on [the decisions involved](/journal/brand/brand-architecture-decisions), but the web expression boils down to three models:

- **House of brands.** Properties stand alone; the parent is invisible or whisper-quiet (a footer credit, an "a X company" line). Tokens are shared as a foundation — grid, type ramp, focus states, component behaviour — but colour, typeface and voice are property-level. Users should not be able to tell the sites share machinery.
- **Branded house.** One master brand, properties are audiences or products of it ("Docs", "Academy", "Careers"). Shared everything, differentiated by content and a restrained accent. Users should never feel they've left the site.
- **Endorsed brands.** The interesting, difficult middle: each property leads with its own identity but carries the parent's endorsement visibly — a lockup, a shared nav strand, a common footer. Restaurant groups, hospitality collectives, cultural precincts. This is where craft lives.

Every downstream decision — token structure, navigation, domains — follows from naming which model you're in. Projects that skip this step end up re-litigating it in every component review for two years.

## The two-layer token system

The technical heart of multi-property design is a token architecture with a hard boundary between **house tokens** and **property themes**. When we built the shared system for the [Coriander Collective restaurant group](/work/coriander-collective-restaurant-group) — five venues, one kitchen philosophy, wildly different rooms — the split looked like this:

**House layer (frozen):** type scale and rhythm, spacing scale, elevation, motion durations and easings, grid, focus treatment, form-component behaviour, icon stroke. Everything that makes an interaction feel like it came from the same hands. These tokens are identical across all properties and changing them requires the whole group's sign-off.

**Property layer (owned):** colour palette on a shared tonal structure (each venue gets the same *slots* — surface, ink, accent, hairline — filled with its own values), display typeface, texture/illustration style, photography treatment. Each property can feel like a different room in the same house because it redecorates without moving the plumbing.

The discipline that makes this work: **property themes may only fill slots, never add structure.** The moment a property defines its own spacing scale or its own button radius, it has forked the system, and forks become permanent. Slots make variety cheap and inconsistency expensive, which is exactly backwards from the default. Our engineering team's write-up on [design tokens that survive engineering](/journal/engineering/design-tokens-that-survive-engineering) covers the pipeline side — for multi-property work, add per-theme output targets so a venue's palette ships as a theme file, not a codebase.

## Navigation between properties without identity whiplash

The scariest moment in a multi-property system is the cross-link: a visitor clicks from Venue A to Venue B (or from marketing to docs) and the entire visual world changes. Handle it with intention:

- **A shared wayfinding strand.** A slim group-level bar — even just a wordmark and a "Our venues" menu — that persists across all properties. It tells users the relationship exists and gives them the exit. Keep it identical on every site; it's the one component that must never be themed.
- **Honest transitions.** When a cross-property link means leaving the current identity, say so at the link: "Visit Hearth & Vine — our Surry Hills room" with a subtle external-relationship cue. Surprise is the enemy; confidence is labelling.
- **Consistent chrome, themed canvas.** Header structure, footer structure, typography conventions and link behaviour stay house-standard so the user's learned model survives the trip, even as colour and texture change completely. Visitors cross between properties the way they walk between rooms — the doorframes match even when the wallpaper doesn't.
- **Language and region switches obey the same rule.** A locale switcher is a cross-property journey in miniature; the navigation pattern we detail in our [locale switcher piece](/journal/web-design/locale-switcher-design) applies directly — persist context, label honestly, never dump users on a foreign homepage.

## Domains: the strategic decision disguised as a technical one

Subdomain, subfolder or separate domain is an SEO question, an ops question and a brand question simultaneously, and anyone who tells you there's one correct answer is selling one of the three. Our working defaults:

- **Branded house** → subfolders on the master domain (`group.com/academy`). Consolidates authority, and users never leave "the site."
- **House of brands** → separate domains, happily. Let each brand carry its own search identity.
- **Endorsed brands** → separate domains for distinct trading names, with deliberate cross-linking; or subdomains when the endorsement should be visible in the URL itself (`venue.group.com` quietly says "part of something").

Whatever you choose, standardise analytics and consent infrastructure across all properties from day one. Six sites with six consent banners and six analytics setups is not a federation; it's a landfill.

## Governance: who owns the house layer

Multi-property systems die by committee or by neglect. The working model we've converged on is small and unfashionable: a **system council of three** — one house owner (design system lead), one property representative (rotating), one engineer — with a simple charter. House-layer changes need all three. Property-layer changes need only the property, inside the slots. Proposals are short written documents, meetings are monthly, and the system's changelog is public to the whole group.

Crucially, the council's job is to say *which layer a request belongs to*, not to adjudicate taste. "We want a fourth accent colour" is a slot question. "We want a different corner radius" is a fork, and the answer is a documented exception with an expiry date, or no. This is brand governance as we've written about before — [governance without police](/journal/brand/brand-governance-no-police) — applied to the surface where it's easiest to enforce: code. The tokens are the constitution; the council is a small, sleepy court that mostly just reads it aloud.

## A test we run before launch

We audit a multi-property launch with two screenshots of each site, side by side, and two questions. **The family test:** could a stranger tell these properties are related? For a branded or endorsed house, the answer must be yes — same bones, same manners. **The stranger test:** could a stranger tell them apart, and correctly guess which is which? For anything but a pure branded house, also yes. Systems that pass the first and fail the second have homogenised; systems that pass the second and fail the first have drifted. The work — nearly all of it in the house/property boundary — is keeping both answers true simultaneously.

That's the real deliverable of multi-property design: not six sites, but one argument, made in six dialects. It's the kind of problem our [brand and identity practice](/services/brand-identity) enjoys most, because it rewards clarity over decoration — and because the moment a fifth property onboards in a week using nothing but the token file and the constitution, you know the system is a system.

## Key takeaways

- Multi-property failure is governance failure: homogenisation or drift. Name the architecture model (house of brands / branded house / endorsed) before designing anything.
- Split tokens into a frozen house layer (type rhythm, spacing, motion, behaviour) and property themes that may fill slots but never add structure.
- Give properties a shared wayfinding strand and honest cross-link labelling so travel between sites never causes identity whiplash.
- Choose domain strategy per model, and standardise analytics and consent across properties from day one.
- Govern with a three-person council whose main job is deciding which layer a change request belongs to — exceptions get expiry dates.

## FAQ

**How many properties justify a shared system?**
Two, honestly. The moment a second surface exists, you either have a system or you have duplication. The payoff curve steepens at three or more, when onboarding a new property drops from months to weeks.

**Should every property use the same CMS and stack?**
Same content *architecture*, yes — shared models for venues, people, articles. Same stack, ideally, unless a property has a genuinely different job (a docs platform, a storefront). Shared mental models matter more than shared binaries.

**What if a property's brand genuinely clashes with the house typeface?**
Then the typeface is doing house-layer work it shouldn't. Keep the *scale and rhythm* in the house layer and let the property layer choose faces. Consistency of proportion reads as family; identical letterforms aren't required.

**How do we stop property teams from forking components?**
Make the house layer genuinely good (forks are usually protests against quality), make slot-level variation easy, and give every exception an expiry date that a named person reviews.
