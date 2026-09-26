---
title: "Onboarding that activates: patterns we keep, patterns we've banned"
description: "Activation-focused onboarding: value-first flows, honest commitment devices, the checklist patterns that still work, and the seven anti-patterns we refuse to ship."
slug: onboarding-patterns-activation
cluster: product
tags:
  - onboarding
  - activation
  - product design
  - UX patterns
date: 2025-02-04
author: Leonie Marsh
keywords:
  - onboarding ux
  - activation
  - product onboarding
  - user activation metrics
readingTime: 9
---

Onboarding is the only part of a product where the user is *trying* to be convinced. They arrived with intent, they gave you an email address, they are — for one short window — on your side. The scandal of product onboarding is how completely most products waste that window: five tooltip tours of UI chrome nobody asked about, a signup form that demands a phone number before showing a single pixel of value, a checklist of seven tasks because "Duolingo does it".

At Brassfern we design onboarding against a single measure: time-to-first-value, instrumented honestly (our [activation metrics piece](/journal/product/activation-metrics-honest) covers the definitions). This is our current pattern library — what we keep, and, just as usefully, what we've banned.

## First, define the value moment in one sentence

Everything downstream depends on this. "Value" is not "finished setup" — it's the moment the user's job-to-be-done first got visibly advanced. For the [Brightmarsh learning platform](/work/brightmarsh-onboarding) it wasn't "account configured", it was *first lesson completed and progress visible*. For a bookkeeping tool it's *first transaction reconciled*, not "bank connected". Write the sentence, get the client to sign it, and judge every onboarding decision against one question: does this pull the value moment earlier?

Patterns that survive do so because they shorten that distance. Anti-patterns die because they lengthen it while looking productive.

## Patterns we keep

**Value before signup, wherever physics allows.** The strongest onboarding is a demo of value with no account at all: a calculator that works, a report generated from pasted data, a sample dashboard with realistic fake data. When [un-gating the first hour isn't possible](/journal/product/empty-states-design), seed the account with believable sample content so the first screen shows the product *working*, not the product empty and expectant.

**The minimum-viable signup.** Email and a password, or a passkey, full stop. Every additional field must argue for its existence against activation data, and in twelve engagements we have never once watched "how did you hear about us" win that argument. Ask later, in product, at a moment of gratitude — after the value moment, users answer profiling questions at triple the rate.

**One-path-first flows.** Resist the branching welcome survey ("what describes you best?" → six divergent tours). Multi-path onboarding multiplies design, test and maintenance surfaces, and the modal user picks a path at random anyway. One excellent default path, with personalisation applied *silently* where signals exist. Branch only when paths genuinely differ in the value moment itself.

**Checklists with teeth.** The onboarding checklist survives every trend cycle because it works — when it's honest. Our rules, elaborated in [checklists without the nag](/journal/product/onboarding-checklist-patterns): three to five items, each one a step toward the value moment (never "complete your profile"), each doable from the checklist row itself, each celebration proportionate. A checklist where every step activates is a tour that actually tours.

**Commitment devices, honestly used.** Asking for a small voluntary investment — naming the project, choosing a goal, inviting one colleague — measurably raises follow-through; people protect what they've built. The honesty constraint: the commitment must serve the *user's* goal, stated back to them ("you said weekly reports — pick the metrics"), never a growth-harvesting mechanic dressed as one. Users can smell the difference by week two.

**The graduating tour.** Contextual hints that appear at first encounter with a feature and *never again*, with a documentable dismissal model: seen, done, dismissed. Persistently resurfacing tips train users to reflex-dismiss everything, including the one tip that mattered.

**Lifecycle email as a second onramp.** The session ends before the value moment more often than not; a two-or-three-email sequence keyed to where they stalled ("your first report is waiting — here's the 40-second version") recovers a meaningful slice of drop-offs. Our equivalent of the [lifecycle discipline we run for growth clients](/services/growth), pointed inward at activation.

## Patterns we've banned

**The five-screen feature carousel before signup.** Slides about features, swiped past in four seconds by everyone, read by no one. If a claim matters, make it on the marketing site where there's room to prove it.

**The tooltip parade.** A sequenced tour of interface landmarks ("this is the sidebar!") delivered before the user has a task. Tooltips describe chrome; users learn products by *doing the job*, and a tour that interrupts intent to narrate furniture is the single most-dismissed pattern in the history of UI. Contextual hints at first use: kept. Patrol tours: banned.

**Forced actions before value.** "Invite your team to continue" gates convert a moment of intent into a moment of resentment, and the invited colleagues arrive to an empty product with no context. Gate nothing on the path to the first value moment; request, don't require, everything else.

**Congratulatory confetti for the trivial.** Celebrating "you created your account!" spends the user's celebration budget on *your* milestone. Save visible celebration for the user's own first win. Proportionality is the whole game.

**Fake personalisation.** "We've customised your dashboard!" followed by the same dashboard everyone gets. Dishonesty detected at minute two of the relationship compounds; personalisation claims must survive audit.

**The access-everything permission bundle.** Contacts, notifications and calendar requested in one pre-emptive modal at first launch. Ask at the moment of need, in context, with the reason ("to sync your rehearsal schedule"), and the grant rate roughly doubles. Permission design has the same rule as onboarding: *earn the ask*.

**Setup wizards that could be defaults.** Seven configuration steps whose answers are 90% predictable. Ship opinionated defaults, showcase one or two meaningful choices, move the rest to [settings](/journal/product/settings-information-architecture). Every defaulted decision is a step deleted.

## Measuring what the patterns earn

Keep/ban lists calcify into dogma unless the data gets a vote. We instrument four numbers per onboarding flow: completion rate per step (finds the cliff), time-to-value-moment (the headline), week-2 retention of activators vs non-activators (proves the value moment was chosen correctly), and recovery rate from lifecycle email (the second onramp's yield). When a "banned" pattern legitimately wins in a client's category — it happens — it earns a documented exception, tested, not vibes. The [Brightmarsh onboarding](/work/brightmarsh-onboarding) flow's current shape is entirely the product of these four measures arguing with our prior opinions, and winning some of the arguments.

## Key takeaways

- Fix the value moment in one client-signed sentence; every onboarding decision is judged on whether it pulls that moment earlier.
- Keep: value-before-signup, minimum-viable signup, one default path, honest checklists, user-serving commitment devices, graduating tours, lifecycle email as second onramp.
- Ban: feature carousels, tooltip parades, forced invitations, trivial confetti, fake personalisation, bundled permission asks, and setup wizards that should be defaults.
- Instrument completion-per-step, time-to-value, activator retention and email recovery — and let the data overrule the banned list when it honestly wins.

## FAQ

**Our product's value takes days to reach — what then?** Decompose it: find the earliest *credible proxy* (a preview, a dry run, a sandbox result) and design to that, then treat the days between as a lifecycle-communication problem. "Value takes time" is usually true; "therefore nothing can be shown early" is usually not.

**How long should onboarding take?** As long as the value moment requires, not a second more. For most tools that's under five minutes to the first visible win. If your honest value moment can't arrive inside one session, your onboarding's real job becomes scheduling the second one — and your design surface is email and re-entry, not the wizard.

**Should onboarding be skippable?** Always skippable, with the skip treated as a *segment*, not a failure. Skippers who succeed anyway tell you the flow was ornamental; skippers who sink tell you exactly which step carried the weight. Skippability is instrumentation, not surrender.

**Do checklists work for enterprise products?** Yes — shaped differently: the checklist lives in a setup hub, tracks team-level tasks ("connect SSO", "import ledger"), and persists across sessions and people. The mechanic (visible progress toward value) is universal; the chromosomes are per-person in consumer and per-deployment in enterprise.

**How do we migrate an existing bloated onboarding?** Don't redesign; amputate. Instrument the four measures on the current flow, delete the step with the worst completion-to-value contribution, wait two weeks, delete the next. Onboarding improves faster by subtraction than by replacement, and each deletion is its own A/B test.
