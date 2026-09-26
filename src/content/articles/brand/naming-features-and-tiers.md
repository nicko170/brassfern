---
title: "Naming features and tiers: clarity beats poetry at checkout"
description: "Feature names and pricing tiers live in the hardest-working UI you own. Rules for naming what your product does so users buy faster and support sighs less."
slug: naming-features-and-tiers
cluster: brand
tags: [feature naming, pricing tiers, product naming, brand architecture, SaaS]
date: 2025-10-08
author: Leonie Marsh
keywords: [feature naming, pricing tier names, product naming, brand architecture, plan naming]
readingTime: 9
---

A company name gets a launch. A product name gets a campaign. And then there are the names nobody celebrates: the feature labels in settings, the three words on the pricing card, the toggle that the support team describes on calls forty times a day. These are the names that actually touch revenue, and they are almost always named worst — by a PM at 5pm on a Friday, from a shortlist of one.

Inside products, naming is a different discipline from naming companies. The stakes flip. A company name should be memorable; a feature name should be *parseable*. Nobody needs to remember your tier names — they need to choose between them in nine seconds without a demo call. Here's how we name the guts of a product, learned from [SaaS clients](/work/larklight-saas-marketing-site), [banks](/work/copperline-community-bank) and more pricing-page arguments than we care to count.

## The pricing-card test

Every product-internal name should pass one test a company name never has to: put it on a pricing card next to two siblings, show it to a stranger for nine seconds, and ask them which plan has the thing they want. Poetry fails this test. "Aurora", "Nimbus" and "Zephyr" are three plans nobody can rank. "Starter", "Studio" and "Organisation" is a ladder a stranger can climb.

This doesn't mean every tier must be descriptive. It means the name must encode *size or intent*, not vibes. Good tier names answer the buyer's silent question — "which one is for someone like me?" — using the buyer's own identity words. Freelancers buy "Solo". Team leads buy "Team". Nobody has ever identified as "Premium". Premium is a price, not a person.

The strongest tier architectures we've shipped use one of three logics:

- **Identity ladders** — Starter / Team / Organisation. The buyer self-selects; sales calls drop. Best when the segments are real and don't overlap.
- **Scope words** — Core / Plus / Complete. Signals accumulation: each tier contains the last. Best when the tiers genuinely stack and the differences are additive.
- **Use-case names** — "The tasting flight" / "The cellar club" at [Hearthbrew](/work/hearthbrew-subscription-club). Risky, only works when the brand voice is strong enough to carry the metaphor *and* the differences stay legible underneath it.

What never works: astronomy, mythology, gems and metals. Platinum vs Gold reads "expensive vs less expensive" — it tells the buyer nothing except that you think in markup.

## Feature names: describe the job, then earn decoration

A feature name appears in three contexts: marketing ("Get Ledger Lock"), the UI toggle ("Enable Ledger Lock"), and a support ticket ("is Ledger Lock the thing that freezes edits?"). The name has to survive all three, which means it needs a descriptive spine even if it wears a decorative hat.

Our rule: **verb or outcome first, metaphor only if it survives translation**. "Smart Retries" tells you nothing until you know; "Automatic retries" tells you immediately. If you want warmth, attach it where it can't confuse: "Automatic retries (we call it Second Chances)" is fine in onboarding copy, but the settings label stays "Automatic retries". Users must be able to search your docs with the words they already own.

Budget the metaphors. A product can support two, maybe three invented feature-names before the UI starts reading like insider slang — and insider slang is a tax on every new user, every support rep, and every translation. [Kite & Anchor](/work/kite-and-anchor-insurtech) came to us with eleven coined feature-names; the [rebuild](/work/kite-and-anchor-insurtech) kept the two users actually repeated in interviews and re-described the other nine. Support-ticket vocabulary matched product vocabulary within a quarter, which is the quietest ROI in branding.

## The internal–external split

Here's the uncomfortable truth: the people naming things (product, marketing) are not the people living with the names (support, sales, users). The fix is procedural, not creative.

Before any name ships, run it past the support lead with one question: *"Describe this feature to an angry customer using its name, out loud."* If the sentence is awkward, the name is wrong. "You'll want to turn off Dynamic Journey Orchestration" is a sentence that should embarrass everyone in the room. "Turn off auto-routing" is a sentence that ends calls.

Keep two registers deliberately:

- **The marketing register** can be as poetic as the brand allows — headlines, campaign names, the [voice work](/journal/brand/brand-voice-charts) belongs here.
- **The UI register** must be literal, consistent in grammatical form (all noun phrases or all verb phrases, never mixed), and stable across versions. Renaming a shipped UI label to match a new campaign is vandalism with a launch plan.

When marketing wants poetry in the product itself, the compromise is placement: poetry in the empty states and onboarding, clarity in the controls. Users forgive whimsy when they're cruising; they never forgive it when they're hunting.

## Grammar is architecture

Nobody notices when a product's labels share a grammar; everybody feels it when they don't. Mixed forms — "Export reports", "Scheduling", "Smart Alerts" — reads as three teams who never met. Pick one form per surface:

- **Navigation and sections:** noun phrases ("Reports", "Billing", "Audit log").
- **Buttons:** verbs ("Create invoice", "Invite member").
- **Settings toggles:** noun phrases describing state ("Automatic retries", not "Retry automatically").
- **Feature names in marketing:** free-ish, but they must contain a noun a user can search for.

Write this into the [living guidelines](/journal/brand/brand-guidelines-living) as a table, not an essay. Future PMs will follow a table; they will not read an essay.

## Naming plan tiers you plan to change

Tiers churn. Prices rise, limits move, plans get grandfathered. Name for the world after the change: avoid numbers in tier names ("Team 20" becomes a lie at Team 25), avoid feature-gated names ("API plan" is awkward when API access moves down a tier), and keep the ladder extensible at the top — there's always an "Enterprise" shaped vacancy. If you're pricing AI features specifically, the cost curves make this harder and we wrote the [separate playbook](/journal/ai/ai-feature-pricing) for it.

And when you do re-tier: grandfather loudly. "Founding members keep their plan forever" is a retention asset and a [growth](/services/growth) story in one.

## A naming checklist we actually use

For every feature or tier name, five questions before it ships:

1. Can a stranger rank or place it in nine seconds on a pricing card?
2. Can support say it aloud in a complaint sentence without cringing?
3. Does it contain the noun a user would type into your docs search?
4. Does it match the grammatical form of its neighbours?
5. If we change the price or the limits, does the name survive?

Five yeses, ship it. Any no, workshop again. This checklist has killed more bad names than any brainstorm ever generated good ones — that asymmetry is the entire [naming discipline](/journal/brand/naming-process-field-guide) in miniature.

## Key takeaways

- Tier names must answer "which one is for someone like me?" — identity, scope or use-case beat vibes, gems and astronomy.
- Feature names need a descriptive spine; metaphors are a budget of two or three, placed where they can't confuse.
- Support is the naming QA you're ignoring. Test names in complaint sentences.
- Fix the grammar per surface (nouns for nav, verbs for buttons) and write it down as a table.
- Name for the world after your next pricing change: no numbers, no feature-gated names, room at the top.

## FAQ

**Should tier names be consistent with the company voice if our voice is playful?**
Playful brands can absolutely run playful tiers — but the play has to encode rank. "Tasting flight / Cellar club / Whole vineyard" still ladders. "Whimsy / Sparkle / Zing" doesn't. Voice lives in the copy around the names; the names themselves carry wayfinding weight.

**We already have mythological tier names and customers are used to them. Rebrand?**
Only if choice confusion shows up in the data (long time-on-pricing, plan-selection drop-off, sales calls that exist to explain tiers). Grandfathered names can live forever quietly; just name the *new* ladder properly and stop adding to the pantheon.

**How many tiers is too many?**
Three is the cognitive sweet spot, four is acceptable with a ladder logic, five-plus is a sales tool pretending to be self-serve. If you have more than four, the honest answer is usually that two of them are negotiable — move those behind "Talk to us" and clean the card.

**Do feature names need trademark checks?**
Occasionally, if the feature is going to be marketed heavily or spun out as a product. The [international checks](/journal/brand/naming-international-checks) are worth twelve minutes of anyone's time before a launch, and twelve weeks of pain afterward if skipped.
