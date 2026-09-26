---
title: "Prototyping with AI: where it speeds design and where it rots it"
description: "Field notes on AI-assisted prototyping: real speed in code exploration, hallucinated-component traps, prompt libraries for layout, and a provenance rule for files."
slug: ai-prototyping-workflows
cluster: ai
tags: [prototyping, ai tooling, design engineering, design process, workflow]
date: 2026-08-27
author: Aiko Tanaka
keywords: [ai design tools, ai prototyping workflow, vibe coding design, ai generated ui, design engineering ai]
readingTime: 12
---

A year ago, prototyping a new idea at Brassfern meant a day in Figma for the story and, if we were feeling ambitious, an evening of hand-rolled React to make one interaction feel real. Now a designer can describe a flow on a Monday and click through a working, stateful, janky-but-alive version before lunch. This is genuinely marvellous. It is also the fastest route to a very polished wrong answer our industry has ever built.

We have spent two years folding AI tooling into our prototyping practice — across client work like the [Brightmarsh onboarding flow](/work/brightmarsh-onboarding) and our internal [lab builds](/lab) — and the shape of the trade is now clear. AI makes the *first 70%* of a prototype nearly free: scaffolding, layout exploration, fake data, wiring. The remaining 30% — the judgement about what should exist at all — it makes subtly more expensive, by flooding the room with plausible options. This is a field report on where the speed is real, where the rot sets in, and the rules we use to keep the good half.

## Where the speed is real

**Exploring layout space in code, not pictures.** The single biggest win: asking for five structural variations of the same screen in working HTML/CSS rather than one laborious Figma comp. Fiddling with a responsive dashboard grid, or three different navigation postures, now costs minutes each. You stop arguing about layouts in the abstract and start *using* them — which is the oldest lesson in design, newly cheap. On Brightmarsh we generated six arrangements of the course-progress header in an afternoon and killed four by dinner because they felt wrong in the hand, something static comps would have debated for a week.

**Realistic fake data.** Inventing believable content used to eat hours: names, prices, edge cases, the awkwardly long German compound noun that breaks your card. Generated fixtures are close to free, and better — you can ask specifically for the hostile cases. "Forty rows, three of them with missing values, one name in Thai, one address that's a poem" is a prompt, not a task.

**Motion and interaction sketches.** Roughing in a gesture, a transition, a drag behaviour to see if an idea has legs is where code prototypes beat every picture, and AI shortens the rough-in dramatically. Our motion designer's rule — [motion earns its keep or gets cut](/journal/ai/streaming-ux-patterns) — is now testable in an hour instead of a sprint.

**Throwaway research instruments.** Small, single-purpose tools: a wizard-of-Oz console, a preference-test harness, a scrappy internal dashboard for one study. These have always been worth building and never worth building carefully; AI is perfect for them.

## Where it rots

Now the honest list, assembled from our own scar tissue.

**The hallucinated component.** AI prototypes reach for components that look right and are wrong: a date picker with impossible keyboard behaviour, a combobox that fails screen readers, a chart library nobody would ship. Worse, they hallucinate *your system* — a plausible-but-fictional `<Badge variant="soft-success">` API that doesn't exist in your tokens. The prototype quietly teaches the team a design language you never agreed to. Counter-measure: constrain generation with your real component inventory and [token pipeline](/journal/ai/prompt-design-systems) pasted into context, and treat any invented API as a bug.

**Plausible-density bias.** Generated screens are relentlessly *fine* — medium information density, conventional hierarchy, the visual average of the last ten thousand dashboards. Left alone, AI pulls every design toward the mean of its training set, which is precisely the place a distinctive product refuses to live. Our [art direction standards](/approach) exist to push against exactly this gravity. If your prototype looks like everyone else's app, that's not the tool being neutral; it's the tool winning.

**Premature fidelity.** Working code feels finished. Stakeholders click a generated prototype and start discussing launch dates while the designer is still interrogating whether the feature should exist. Fidelity is a commitment device, and AI lets you commit accidentally. Counter-measure: keep an explicit fidelity dial. Ours runs *sketch / greybox / systems-true*, and greybox prototypes are deliberately styled to look provisional — system fonts, wireframe framing, no brand colour — so nobody can mistake exploration for a decision.

**The prompt-shaped feature.** The deepest rot: features that exist because they were easy intuition for the model — chat interfaces where a form belongs, generation where a lookup belongs, "AI suggestions" stapled on because the demo gods demand a sparkle icon. When the building is cheap, the *deciding* is the whole job. Guard this with your life, or at least with a written problem statement that predates the prototype.

## Keeping generated code out of production

Simple rule, stated often, enforced structurally: **prototype code is quarantined, always.** No merging, no cherry-picking, no "it's basically there". Prototype branches live in a namespace that cannot target main. The reasons go beyond craft:

- Generated code carries no accessibility audit, no tests, no knowledge of your error-handling conventions — it passes demo, not review.
- Licence and provenance are murkier than your legal exposure should tolerate; some clients' contracts now ask about generated code directly.
- The most dangerous property of AI code is that it's *almost* production-shaped, which tempts exactly the shortcut that hurts most at month three.

What crosses the wall is the *learning* — the chosen interaction, the discarded options, the copy, the data shapes — reimplemented through the normal pipeline with the boring disciplines described in our [engineering practice](/services/product). The prototype answers questions; the product answers to users. Confusing those is how demos become technical debt with a launch announcement.

## Prompt libraries for layout exploration

The durable asset from all this is not any single prototype — it's the prompts that reliably produce *useful divergence*. We keep a small library, versioned like any design asset. What makes a layout prompt good, in our experience:

- **Ask for trade-offs, not variants.** "Three arrangements of this screen: one optimising for scan speed, one for first-use comprehension, one for dense expert use — tell me what each sacrifices" produces options with opinions attached. "Give me three versions" produces triplets.
- **Constrain with reality.** Paste the real content model, the breakpoint list, the component inventory, the token names. Every constraint you omit is filled with the average of the internet.
- **Demand the critical path in real data.** A prototype filled with lorem-grade fluff validates nothing. Feed it the worst real record you have.
- **One variable at a time.** When exploring, change the layout *or* the copy *or* the density per generation. Changing all three teaches you nothing about any of them.

## A provenance rule for design files

Last, the unglamorous rule that saved us during a client audit: every artefact in our project folders carries its origin. Figma files get a layer-level annotation convention (`ex:` prefix for explored-not-decided frames); prototypes get a `GENERATED` banner in the corner of greybox builds; research instruments are labelled as instruments. It feels fussy until the day someone finds a beautiful screen in a folder and costs it into a roadmap. Provenance is how a fast team stays honest: speed in exploration, deliberation in commitment, and a visible seam between the two.

## Key takeaways

- AI's real gift is cheap divergence: layout exploration, fake data, interaction sketches and throwaway research tools all cost minutes now.
- Generated output drifts toward the visual average and happily invents components and APIs. Constrain it with your real system or it quietly replaces your system.
- Working code looks finished. Keep an explicit fidelity dial and style early prototypes to look provisional on purpose.
- Quarantine prototype code absolutely; what crosses into production is the learning, reimplemented properly.
- Keep a versioned prompt library for exploration, and a provenance convention so nobody mistakes an exploration for a decision.

## FAQ

**Should designers learn to prompt, or is this a design-engineer specialisation?** Prompting well is a design skill now, like sketching — the median designer should be fluent enough to generate a greybox flow and evaluate it critically. The specialisation worth having is someone who owns the shared prompt library, the component-constrained contexts and the quarantine plumbing. Everyone explores; one person tends the fences.

**Doesn't this just move the bottleneck to review?** Yes, and that's the correct trade. Reviewing five working options is cheaper and better than commissioning five by hand — but only if critique stays sharp. Run the same structured critique you always did, and budget for it explicitly: the time AI saves in making should be re-spent in deciding, not banked.

**How do we stop stakeholders anchoring on a throwaway prototype?** Visible provisionality (greybox styling, `GENERATED` watermarks), a spoken rule in every share-out ("this answers one question; here's the question"), and deleting or archiving explorations once they've served. Dead prototypes shouldn't linger in drives looking employable.

**Is AI-generated prototype code safe to show clients?** Yes, with disclosure. We tell clients exactly what's generated, what question the prototype answers, and that the production build is written fresh. Clients consistently trust us *more* for the transparency — and the conversation sets up healthy expectations about speed versus commitment early in the engagement.
