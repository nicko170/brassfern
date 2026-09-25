---
title: "Empty states are product marketing"
description: "First-run, cleared, error and no-results states teach or lose people. Copy frameworks, illustration restraint, and measuring empty states as funnel steps."
slug: empty-states-design
cluster: product
tags: [empty states, ux writing, onboarding, product design, microcopy]
date: 2024-10-08
author: Aiko Tanaka
keywords: [empty state design, ux writing, first run experience, product onboarding, no results ux]
readingTime: 8
---

There's a page in your product that more trial users see than your pricing page. It has no hero image, no testimonial, no copy deck. It says "No projects yet" next to a grey box, and it is doing your sales job, badly, every day. The empty state — the moment a feature exists but has nothing in it — is the most reliably neglected surface in product design. Teams will workshop a hero headline for six weeks and ship "Nothing to display" with a straight face.

We treat empty states as product marketing because that is literally their function: they stand at the exact moment a user's intent exceeds their content, and they either convert that intent into the product's first value or they refund it. When we mapped trial-dropoff in the [Brightmarsh onboarding work](/work/brightmarsh-onboarding), the single largest silent exit wasn't a paywall or a broken form — it was the empty course dashboard, where enrollees landed on a blank canvas and quietly concluded the course must be empty too. The fix was words and one button. The retention math was not small.

## A taxonomy, because the four states are four different jobs

"Empty state" lumps together situations that need opposite designs.

**First-run empty.** The user just arrived; nothing exists yet because *they* haven't made it. Job: convert intent into first action. This is a marketing surface — it must explain what lives here, why it's worth making, and make the making one click away.

**Cleared empty.** The user did the work — inbox zero, all tasks done, no new notifications. Job: acknowledge and get out of the way. A cleared state that tries to upsell ("why not create another project?") misreads the moment completely; the user just *finished*. The correct register is congratulations in lowercase.

**No-results.** A search or filter returned nothing. Job: repair. The user is in an error state they authored; the design must diagnose what went wrong (no matches for query X, filters active, date range too narrow) and provide the undo affordances inline.

**Error empty.** Something broke: failed load, permissions, an integration that died overnight. Job: honesty and a path forward. Technically the hardest state because the product must know what it knows.

Each gets different copy, different visual weight, different measurement. Treating them as one pattern is how you end up congratulating people for a failed search.

## The first-run copy framework

First-run copy carries the heaviest load, and it has a structure. Four lines, in order:

1. **Name what lives here in the user's vocabulary.** Not "No projects yet" (database-speak) but "Your project plans will live here." The user should recognise the *thing they came for*, not the table that's empty.
2. **State the value of having one.** One clause, concrete: "so your Monday reports write themselves." If you can't write this line, you've discovered the feature doesn't have a clear job — which is findable much earlier with a [jobs-to-be-done interview](/journal/product/jtbd-interviews-that-work), and cheaper than discovering it here.
3. **One primary action, verb-led.** "Create your first plan." Not "Get started" (started *with what?*), not "Learn more" (they came to *do*). If setup is heavy, this is also where you show the cost honestly: "About 2 minutes."
4. **A sample or scaffold, if you can build one.** The strongest empty state isn't empty. Seed examples the user can keep or delete — a demo project, three starter templates, sample data behind an obvious switch. In the [Hearthbrew storefront admin](/work/hearthbrew-subscription-club) we seeded a sample roast schedule on first login; support tickets about "where do I start" dropped to nearly none.

Register notes: sentence case, no exclamation marks on first-run (the product hasn't earned enthusiasm about itself yet), and never blame ("You haven't created any projects" — yes, thank you, I'd noticed the screen).

## Illustration: seasoning, not the meal

The default empty-state illustration is a pastel abstract person having a feeling about a folder. It communicates "we have a brand illustration library." That is the complete list of what it communicates.

Illustration earns its place in an empty state only when it *explains the shape of the thing to come* — a ghosted preview of a populated dashboard teaches more than any paragraph. Our rules: maximum width of a thumbnail, never visually louder than the primary action button, and always loaded lazily (an empty state is a performance surface — it's frequently the first painted content a new user sees, and it sits in the critical path of the [activation metric](/journal/product/activation-metrics-honest) you're trying to move). If the illustration budget is contested, spend it on the seeded-sample work instead; samples convert, mascots decorate.

## No-results is a repair surface

No-results states fail in one of two directions: dead ends ("No results.") or blame ("Your filters are too restrictive!"). The repair pattern, in order:

- **Restate the question honestly.** "No shipments match 'melb', 3 active filters." Most products show neither the query echo nor the filter count — the two facts the user needs to debug their own intent.
- **Rank the likely fixes as actions**, not advice. "Clear the date filter" as a one-click chip beats a sentence suggesting they consider clearing the date filter.
- **Offer the nearest breath.** Related queries, "did you mean", the unfiltered count ("412 shipments without filters"). Show that the data exists and the failure is in the query, not the system.

And the discipline underneath: an empty result that is *legitimate* should say so plainly. "No overdue invoices" is good news — render it as the cleared state it is, not as a failed search.

## Error states: say what happened, what you're doing, what they can do

Error empties are trust surfaces. The three-line contract, always: what happened in plain language, what the product is doing about it right now (retrying, logged, notified), what the user can do (retry button, status link, a promise about not losing their work). The cardinal sins: infinite spinners that never concede defeat, "Something went wrong" as the complete error message, and — the worst — a cheerful illustration of a broken robot, which converts a trust problem into a tone problem.

Retry buttons must actually retry the failed operation, preserve any in-progress input, and carry a time limit: after three failures, offer the human path. Error states with telemetry attached ("we've been notified" — and you have been) convert a bad moment into a trust deposit.

## Measure them like funnel steps, because they are

Empty states are measurable surfaces, and we instrument all of them: view of each state, action-taken from it, and time-to-action. Two metrics matter most. **First-run conversion rate**: what share of users who see the first-run state complete the primary action within, say, a day — this is a leading indicator on activation and deserves a place in the same review meeting as [activation metrics](/journal/product/activation-metrics-honest). **No-results exit share**: what fraction of no-results events end a session — the diagnostic for whether your repair affordances work.

What to expect: instrumenting empty states almost always reveals that they were invisible to the team's mental model of the funnel. They sit between "signed up" and "activated" doing quiet, unmeasured gatekeeping. Once visible, they're among the cheapest wins in the product: copy changes, one honest button, a seeded sample — the kind of work that ships in a sprint and shows up in the retention cohort two months later.

Empty states are the product talking when it has nothing to show. Write those lines like they matter, because to a new user deciding whether to stay, nothing else is on screen. If your onboarding loses people between signup and first value, that's [our bread and butter](/services/product) — or start with the [resources library](/resources) and fix the words yourself.

## Key takeaways

- Four empty states, four jobs: first-run (convert), cleared (congratulate, quietly), no-results (repair), error (honesty and a path). Don't share a pattern across them.
- First-run copy formula: what lives here, why it's worth it, one verb-led action with honest cost, a sample if you can seed one.
- Illustrations earn place only by explaining the coming content; samples beat mascots every time.
- No-results must echo the query, show the filter count, and offer one-click fixes — legitimate emptiness is a cleared state, not a failure.
- Error states follow the three-line contract: what happened, what we're doing, what you can do. Retries must preserve work and end in a human path.
- Instrument every empty state: conversion from first-run and exit-share from no-results belong in the activation review.

## FAQ

**Should every empty state have a call to action?**
First-run: yes, exactly one. Cleared: never — the action is done. No-results: repair actions, multiple but ranked. Error: retry plus human fallback. "Empty state = illustration + CTA" is the template-thought that creates upsells in inbox zero.

**What about empty states inside dense enterprise tools?**
The register shifts (less warmth, more precision) but the structure holds. Enterprise adds one killer variant: the permission-empty state — "you can't see this because you're not in the finance group, request access here" — which beats a silent blank that reads as a bug.

**How do we write empty-state copy for a genuinely complex setup?**
Don't compress the setup into the empty state; bridge it. "This takes about ten minutes, and here's the checklist" with a persistent progress indicator converts better than either a pep-talk or a shrug. Complexity communicated honestly is a trust deposit too.

**Do empty states need dark-mode or theme variants?**
If your product themes, yes — a ghost-preview illustration tuned for a light canvas often turns to mud on dark surfaces. It's a small job worth folding into the same pass as the rest of your [theme token work](/journal/web-design/colour-systems-dark-mode), not a separate art project.
