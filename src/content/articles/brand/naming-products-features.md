---
title: "Naming products and features inside a masterbrand"
description: "Not every feature deserves a name. The descriptive–invented spectrum, a naming budget against sprawl, and renaming features mid-life without confusing everyone."
slug: naming-products-features
cluster: brand
tags: [naming, brand architecture, product naming, naming governance, brand strategy]
date: 2025-06-17
author: Aiko Tanaka
keywords: [feature naming, product naming conventions, brand naming architecture, naming governance]
readingTime: 10
---

Somewhere around a SaaS company's third year, the naming debt comes due. The product has accreted features faster than language: there's a dashboard called Pulse, an export tool called Atlas, an AI feature called Sage, an integration called Bridge, a report called Insights, and — because someone panicked — a thing actually named The Insights Hub. Users can't find Pulse (it's under Analytics), support docs refer to Atlas by three names, and the sales team has quietly renamed everything again in their own decks. Nobody designed this. It grew the way naming always grows when nobody is tending it: one defensible decision at a time, compounding into sprawl.

Product and feature naming inside a masterbrand is mostly a governance problem wearing a creative costume. This is the system we install: a spectrum for choosing name types, a brutally honest test for whether a feature earns a name at all, a naming budget, and a protocol for the renames you'll inevitably have to do mid-life.

## The spectrum: descriptive to invented

Every name sits somewhere on a line from **descriptive** ("Reports", "Email automation") to **evocative/invented** ("Pulse", "Atlas"). Neither end is virtuous; they trade different costs.

- **Descriptive names** cost nothing to learn and nothing to defend legally, but they're invisible as brand — nobody remembers, mentions or loves "the reporting module". They're also SEO-legible, because they contain the words users type.
- **Invented names** are memorable, ownable and capable of carrying meaning the product grows into — and each one imposes a learning tax on every new user, forever. "Where do I find my invoices?" "That's in Ledger." That sentence is a transaction fee you charge every customer, forever.

The mistakes are predictable: teams invent names for boring features (charging the learning tax with no brand payoff) or describe the features that deserved flags (the flagship AI assistant called "AI Assistant", indistinguishable from everyone else's). Match the position on the spectrum to the strategic weight of the thing. Your differentiating, demo-able, talk-about-able features earn evocative names. Your plumbing gets described.

## The test: does this feature earn a name at all?

The strongest naming governance we've ever implemented is a single gate question, asked of every proposed new name: **"Will users need to refer to this thing in a sentence, to another human, without you in the room?"**

Most features fail it, and rightly — users don't say "I used the bulk actions bar", they say "I selected everything and hit archive". The feature is real; the *linguistic object* is not. Naming it anyway creates a word the company uses and the customer doesn't, which is the seed of every doc-support-sales drift later. Our rough rule from a decade of audits: a healthy product surface names perhaps one in five significant features. Everything else is descriptive UI copy, and thrives as it.

Two more gate questions for the survivors: is the feature **durable** (will it exist in three years — names outlive roadmaps)? And is it **demonstrably differentiating** (does it appear in pitch decks and comparison pages)? Three yeses and the feature has earned a name. See our [naming field guide](/journal/brand/naming-process-field-guide) for the creative process downstream of the gate — brainstorms, screening, trademark basics. The gate is what keeps that process from being run forty times a year.

## Architecture before vocabulary

Where names sit matters as much as what they are. Inside a masterbrand, our default grammar is deliberately boring: **Masterbrand + descriptor** for products, **in-product descriptive labels** for features, with invented feature names reserved for the flagship tier. "Northwind Ledger — Reports", not "Reports by Stormline by Northwind Ledger". The deeper the nesting, the more your architecture is leaking into the user's mouth. The strategic layer of this — when sub-brands and endorsed brands actually earn their existence — is covered in [brand architecture decisions](/journal/brand/brand-architecture-decisions); for features, the answer is almost always that they don't.

Two architecture rules that pay off steadily:

1. **Names live in one tier.** A feature name shouldn't carry version markers, tier markers or platform markers in the name itself ("Atlas Pro for Teams"). Tiering is a pricing property; it belongs in pricing UI, not in vocabulary.
2. **The name style is a system with rules, not vibes.** If your flagship features are single words drawn from nature (as the fictional suite above noticed too late), the sixth one can't be an acronym. A name that breaks the system reads as an acquisition, and support fields the confusion.

## The naming budget

The mechanism that makes governance stick is a budget: a hard cap on live invented names across the product, set with leadership, and reviewed like a performance budget. We've run caps of five to nine depending on portfolio size. The cap transforms the politics — "can we add a name?" becomes "which existing name is this worth more than?" — and naming decisions stop being free, so people stop making them casually. Like any budget it needs an owner (brand or product marketing, jointly) and an expiry review: every named feature gets re-justified annually, and names whose features shipped quietly and stayed quiet get retired to descriptive labels.

This is also where linguistic diligence lives. Any name reaching cap review gets the standard checks before attachment deepens — trademark screening, domain/handle reality, and the [international meaning checks](/journal/brand/naming-international-checks) that have saved more than one client from learning a rude verb in a growth market. Feature names travel further than founders expect: changelogs, comparison sites, conference talks, other companies' integration docs.

## Renaming mid-life without chaos

Eventually a name must die: the feature outgrew it, the trademark letter arrived, or a decade of sprawl gets pruned in one decisive quarter. Mid-life renames fail when they're treated as find-and-replace. They're a communication migration, and they deserve the same care as any other:

- **Announce before, not after.** Two weeks' in-product notice ("Pulse is becoming Signal — same tool, new name") prevents the support spike where users report a feature as *missing* rather than renamed.
- **Run the overlap.** Old and new names coexist in UI and docs for a cycle — "Signal (formerly Pulse)" — because docs rot and muscle memory is real. Search must resolve both, permanently; an alias entry is cheap forever.
- **Own the redirect layer.** Docs URLs, in-product deep links, integration identifiers. API identifiers in particular: if your integration key is public, the old name may be effectively permanent in code, and that's fine — code stability outranks vocabulary tidiness. Say so explicitly so nobody "fixes" it.
- **Tell the story once, well.** A rename wrapped in an honest reason earns goodwill; one slipped silently into a release earns distrust. The humble changelog does more brand work here than any launch post — we make that case in [your changelog is a marketing channel](/journal/growth/changelog-as-marketing).

The through-line of all of this: naming is language infrastructure, not decoration. Brands that treat it as infrastructure — spec'd, budgeted, owned, versioned — spend their creativity on the five names that matter instead of maintaining forty that don't. If your product has outgrown its vocabulary, that's a normal chapter of growth, and a satisfying one to untangle — our [brand practice](/services/brand-identity) keeps a week open for exactly this kind of surgery.

## Key takeaways

- Names sit on a descriptive–invented spectrum; match position to strategic weight. Differentiating flagships earn evocative names; plumbing gets described.
- Gate every proposed name: will users say it to each other, is it durable, is it differentiating? Roughly one in five significant features passes.
- Keep the architecture grammar boring: masterbrand + descriptor, one nesting tier, tiering in pricing UI rather than in names.
- Run a naming budget — a hard cap on invented names with an annual re-justification review — so additions force trade-offs.
- Rename mid-life as a migration: pre-announce, overlap old and new, permanently alias search and URLs, and treat public API names as effectively permanent.

## Frequently asked questions

**Won't descriptive names hurt us in a sales demo?**
The opposite, usually. Buyers evaluating three tools in a week are cognitively flooded; "their reporting is genuinely good" travels further than "what was the name of their report thing again?" Distinctiveness belongs to the masterbrand and the flagship. Everything else should reduce friction.

**How do we handle names the team loves that users ignore?**
Run them honestly for a cycle — if the name appears in zero support tickets or community posts after six months, users don't hold it. Retire it to a descriptive label. A name only exists where mouths use it.

**Should feature names match our URL structure?**
URLs follow information architecture, not marketing vocabulary. `/features/reports` beats `/features/atlas` in nearly every case: durable through renames, legible to search, and honest. The name lives in the H1.

**What about codenames — do they leak?**
Constantly. Assume every internal codename will appear in a screenshot in a public deck within the year, so run a light version of the same diligence on codenames, or use deliberately boring ones. The product our industry knows by a seafood name learned this expensively; several clients have too.

**Who should veto a name?**
One owner with the budget, advised by legal and the teams who field language daily (support, docs, sales). Veto by committee produces names like "The Insights Hub" — names built to offend nobody, which is to say names built to mean nothing.
