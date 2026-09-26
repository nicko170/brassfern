---
title: "An illustration system is rules, not a folder of PNGs"
description: "Illustration that stays consistent after the artist leaves: principles with forbiddens, per-artist commissioning briefs, rarity budgets, and storage that survives churn."
slug: illustration-systems-not-galleries
cluster: brand
tags: [illustration, art direction, brand identity, design systems, commissioning]
date: 2025-11-04
author: June Okafor
keywords: [illustration, art direction, brand identity, design systems, commissioning]
readingTime: 8
---

We took over a brand last year that came with a shared drive folder called `illustrations_FINAL`. Inside: 340 images in five recognisably different hands. A flat geometric family from 2022, a textured collage phase, some isometric clip-art adjacent work, one surrealist beak-faced creature nobody could explain, and four years of "the freelancer had availability." Sampling across the site, the brand had five illustration styles and therefore none.

That's the gallery approach: illustration as procurement, episodic commissioning, no memory. The fix isn't one perfect artist on retainer forever — illustrators move on, budgets dry up. The fix is treating illustration the way we treat [logo systems](/journal/brand/logo-systems-not-logos) and [icon systems](/journal/brand/icon-systems-brand-assets): as a *system* — construction rules, explicit forbiddens, rarity budgets, and files named so a stranger can run it. Systems survive the people who made them. Galleries die with the shared drive password.

## Principles with forbiddens, not adjectives

Every illustration brief ever written contains the words "warm," "human," "playful yet professional." These are weather reports, not instructions. A system needs construction rules specific enough that two different illustrators, given the same brief, produce work that sits on the same page without a fight.

For a recent editorial brand we wrote the system as ten rules, and the load-bearing ones were the forbiddens:

- **One light source, upper left, always.** Shadows obey it or aren't drawn.
- **Palette is four colours per piece, from the brand set.** No new hues, ever; variety comes from tints, exactly like our approach to [brand colour beyond default blue](/journal/brand/brand-colour-beyond-default).
- **Line either everywhere or nowhere per piece.** Outlined fills and painterly fills may never share a canvas.
- **Hands have four fingers and a thumb, simplified.** (This one existed because three consecutive illustrators drew hands three ways and hands are in half of all product illustration.)
- **No gradients, no glass, no skeuomorphism.** The forbiddens are the moat — they're what make the style imitable by you and expensive to accidentally leave.
- **People are stylised to a fixed proportion system**, the same discipline we'd apply to [stylised team portraits](/team) — consistent enough to read as one world, abstract enough to never age into embarrassment.

Notice what none of these rules say: "be fun." Fun is the *output* of constraints obeyed well; it can't be specified directly. The test of a principle set: hand it to an illustrator who's never seen the brand, give them twenty minutes, and check whether the sketch could plausibly sit in the existing library. If yes, the rules work. If the brief needed interpretation, the rules are still adjectives wearing safety glasses.

## The rarity budget: scarcity is a system property

The fastest way to kill an illustration style is to use it everywhere. When every empty state, tooltip and error message carries an illustration, each one means less, the library inflates with filler, and the style drifts as volume forces speed.

So the system includes a **rarity budget**: a deliberate map of where illustration is allowed to appear at all. Something like: heroes on the top six pages; one spot per [case study](/journal/web-design/case-study-page-design); empty states for first-run screens only; nowhere in checkout; nowhere in form fields. This does two jobs. It protects impact — illustration stays a moment, not wallpaper, which is also how we'd discipline [motion, with a budget per surface](/journal/web-design/motion-that-earns-its-keep). And it protects the budget: if you can only commission twenty pieces a year, you *design* the twenty instead of panic-ordering mid-sprint from whoever's free this week.

Rarity also makes commissioning legible to finance: "we spend $X per year on twelve slots" is a budget line; "we commission sometimes when things look empty" is a leak.

## Commissioning briefs, per artist, in writing

Working with multiple illustrators inside one system is normal and good — styles evolve, availability doesn't. The system's job is to make artist #4's work sit beside artist #1's without a seam. That happens through the commissioning brief, which is a two-page document per engagement:

1. **The rules** (above), one page, with three exemplar pieces marked up — "this obeys rule 2, this is the shadow logic."
2. **The assignment**: the slots from the rarity map being filled, the subject matter, the where and the size, flagged with the oddities — "this runs at 120px and 1200px, so detail budget is low."
3. **The technical contract**: source files (layered, named layers), vector where possible, colour profile, naming convention, and — write it down — usage rights and portfolio rights for the artist.
4. **One round of structural critique, one round of polish.** More rounds means the rules weren't clear; re-read them instead of sanding the artist.

The markup exemplars do the heavy lifting. Artists are visual readers; three annotated beats three pages of prose.

## Storage, naming and the survival test

The last failure point is the least glamorous: the library itself. The folder called `illustrations_FINAL` failed not because the art was bad but because nothing about its organisation carried the system.

Rules that make a library survive staff churn:

- **Naming is semantic and versioned**: `empty-state--no-results--v2--fmt.svg`, not `final_FINAL2.svg`. Subject, context, version, first artist's initials. A stranger can find, a machine can index.
- **Store sources, not just exports.** The layered file is the style's DNA; exports without sources are a species you can't breed from.
- **The guidelines live next to the art.** The one-page rule sheet sits *inside* the library as `00_READ-THIS.md`, because guidelines stored in a separate wiki are guidelines that get lost — the same argument as [killing the brand PDF](/journal/brand/brand-guidelines-living) in favour of living docs.
- **A named owner.** Systems without owners become galleries again within two hiring cycles. Someone's job — ten percent of it, but *someone's* — is saying no.

The survival test is simple: the illustrator leaves, the art director changes jobs, and a junior designer with the drive link produces on-system work in a week. If that scenario is plausible, you have a system. If it's terrifying, you have a folder of PNGs.

## The refresh path

Systems also need a way to evolve without a rebrand-scale event. Build the refresh in: an annual review where the rules get edited — not by whim, but by pattern. If three commissions in a row fought rule 3, rule 3 is wrong and gets rewritten. If the collage experiments from year two now look like the future, admit it formally, deprecate the old family with a migration plan, and refresh the library in batches by surface importance — heroes first, empty states last. An illustration system that can't absorb a drift becomes, eventually, five styles in a folder, and you're someone else's takeover audit.

## Key takeaways

- Illustration consistency comes from construction rules, not artist loyalty or adjectives like "warm."
- Write the forbiddens — palette cap, shadow logic, gradients banned — they're the moat that keeps the style coherent across hands.
- Rarity is a system property: map the surfaces allowed illustration, protect impact and budget at once.
- Commission per-artist with a two-page brief: rules with marked-up exemplars, assignment, technical contract, two critique rounds.
- The library must survive churn: semantic versioned naming, layered sources, guidelines stored *with* the art, a named owner.
- Review the rules annually and edit them by pattern — systems that can't absorb drift become folders of PNGs.

## FAQ

**We can't afford custom illustration at all. Isn't this an enterprise luxury?**
A system costs the same as commissioning ad hoc — the rules are free. If budget is smaller, the rarity map gets tighter: three hero pieces a year, everything else typography and [colour doing the lifting](/journal/brand/typography-brand-distinctiveness). A three-piece library with rules beats a thirty-piece folder without any — and it beats stock, which is someone else's system rented by the month.

**Can't we just use AI image generation for the library?**
It accelerates exploration and mocks, and it's genuinely useful for moodboarding directions before commissioning. As the production library, it fails the system tests: you can't reliably reproduce a style on demand months later, you get no layered sources to edit, and the licensing and disclosure questions will find you at the worst time. Use it to *find* the style; hire humans to *be* the style.

**How many styles should a brand run — one, or a few per product line?**
One core system with deliberately bounded dialects, decided at the architecture level. Sub-brands can flex palette or texture inside the same construction logic; the moment a second system appears with different rules, you're maintaining two libraries with half the budget each. When in doubt, fewer.

**Our illustrators keep pushing back on the constraints. Is the system too tight?**
Maybe — or the constraints were written without an illustrator in the room, which is the common version. Write the v1 rules *with* your founding artist, not about them; they'll tell you which forbiddens are cheap and which ones break their hand. If good artists consistently fight the same rule, the annual review exists precisely to change it in writing rather than erode it in practice.
