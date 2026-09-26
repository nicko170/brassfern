---
title: "Design handoff that doesn't decay in a sprint"
description: "Why handoffs rot and how we stop it: living tokens, component specs over pixel mocks, motion specs with real easing values, and the annotation habits that survive sprints."
slug: handoff-that-does-not-decay
cluster: web-design
tags:
  - Design systems
  - Design engineering
  - Process
  - Design tokens
date: 2024-11-05
author: Tomás Reyes
keywords:
  - design handoff
  - design tokens
  - component specs
  - design engineering collaboration
readingTime: 9
---

Every handoff decays. The Figma file is perfect on the day of the kickoff; three sprints later the buttons in production have four radii, the designer is screenshotting the live site to find out what it does, and both disciplines privately believe the other one betrayed them. Nobody betrayed anybody. The handoff was a *document* — and documents freeze at the moment of export, while the product keeps moving.

The fix isn't better Figma hygiene. It's relocating the source of truth from the file to the pipeline: tokens that ship as code, specs written against components instead of pages, and annotations precise enough that "close enough" stops being a decision a developer has to make alone at 5:40pm.

This is the system we use on every [website](/services/websites) and [product](/services/product) engagement, refined across a decade of watching exactly where handoffs rot.

## Why handoffs rot: the three failure modes

**The source of truth forks.** Design lives in Figma; the build lives in the repo. On day one they match. On day six a developer fixes a spacing bug in code and no one backports it to the file. On day fourteen a designer revises a colour and no one backports it to the code. By launch there are two products, both wrong. Any handoff format that allows two writable sources of truth will fork. Guaranteed.

**Specs describe pages, not components.** A full-page mockup pins one instance: one viewport, one content length, one state under perfect data. The developer must reverse-engineer the *system* from a photograph of it — guessing what happens when a title wraps, at 375px, when the API returns nothing. Every guess is a small divergence. Multiply by a sprint.

**The ambiguous detail defaults to expedient.** "Subtle hover effect" is not a spec; it's an IOU. Under deadline, every ambiguity resolves to whatever's fastest — `transition: all 0.3s ease` — and the design intent that made the mockup feel expensive evaporates one shortcut at a time. The Polish Death Spiral: each individual compromise is invisible in review, and together they are the gap between the file and the site.

## Part 1: Tokens that ship as code

The single highest-leverage change: **design tokens stop being a Figma variable palette and become a versioned artefact the build consumes.** Colour, spacing, type scale, radii, shadows, durations, easings — one JSON (or source-of-truth format) of record, transformed into CSS variables, and the raw Figma variables stay in sync via a pipeline, manually or automated.

The consequences are profound and unglamorous. A designer's colour revision becomes a pull request that *is* the handoff — there is no "please update all the buttons" ticket, no two-week drift window where staging and design disagree. Versioning gives you review: a token diff that changes `--brass` luminance is visible, discussable, revertible, and testable in CI the way we describe in [testing design tokens in CI](/journal/engineering/design-tokens-pipeline-ci). And crucially, tokens kill the largest class of ambiguity: nobody hand-picks `#b08a3e` from an eyedropper when the only available value is `var(--brass)`.

Two disciplines make it work. First, **semantic naming over descriptive naming**: `--surface-well` not `--beige-2`, so a rebrand remaps meaning rather than renumbering fifty swatches — the same system that survives [dark mode and rebrands](/journal/web-design/colour-systems-dark-mode). Second, **a token is born in review, not in a file**: new values get added through the same gate as new components, or the palette re-forks within a month.

## Part 2: Component specs, not page mocks

Pages are for storytelling — clients buy pages. But the *buildable* artefact is the component spec. Ours have five sections, and a component doesn't enter a sprint without them:

1. **Anatomy**: parts and slots, named the same in Figma and in code. If the design calls it `Card.Meta`, the class better not say `card__footer`.
2. **States**: the full family — default, hover, focus, active, disabled, loading, empty, error — each designed, each with copy where it involves words. (The reasoning is in [the states that carry your trust](/journal/web-design/empty-loading-error-states).)
3. **Content limits**: max and min characters, what happens at 2× the sample content and at zero. Most "the layout broke" bugs were knowable here.
4. **Responsive behaviour**: not three breakpoints' worth of redraws, but the *rule* — "grid collapses 3→2→1 at these container widths, image ratio holds 4:3". Rules survive; redraws fossilise.
5. **Accessibility contract**: role, keyboard behaviour, focus order, the accessible name, and where focus goes on open/close/delete. Specified by design, implemented by engineering, never invented by either alone.

Page-level design still exists — for hierarchy, rhythm, the feel of the thing — but it's explicitly a *composition* of spec'd components. When a page mocks something no component covers, that's a flag: either spec a new component or change the composition. What it never is: a silent instruction to freestyle.

This structure bakes in the bigger accessibility shift we argue for in [accessibility starts in the design file](/journal/web-design/accessible-design-handoff): the contract is written when intent is fresh and cheap, not audited when it's late and expensive.

## Part 3: Motion specs with real numbers

"Nice easing on the menu" is how good sites become generic ones. Our motion specs are a table, no prose:

| Element | Property | Duration | Easing | Delay |
| --- | --- | --- | --- | --- |
| Nav overlay | opacity, translateY(-8px→0) | 240ms | out-curve (cubic-bezier(.22,.61,.36,1)) | 0 |
| Overlay scrim | opacity | 200ms | linear | 40ms |
| Nav items | opacity | 160ms | out-curve | 60ms + 40ms/item, max 4 |

Three rules: the easing is a cubic-bezier value, named and referenced from the token set (never re-derived per component); the reduced-motion equivalent is specified in the same table as a parallel row (usually opacity-only, [per our motion philosophy](/journal/web-design/motion-that-earns-its-keep)); and anything a developer has to *choose* — a duration, a curve, an order — is a spec failure, fixed in the file, not in Slack.

## Part 4: The annotation habits that survive sprints

Systems rot at the edges, so a few habits carry disproportionate weight:

- **Annotate deviations in the file, on the frame.** If this card differs from the spec, a pinned note says so and says why. An unmarked deviation reads as a mistake and gets "corrected" in code — many production bugs are engineers dutifully normalising an intentional exception.
- **Red lines are for contracts, not measurements.** Developers measure in the tool; what they can't measure is *priority*. Annotate what must survive contact with reality: "this gap is sacred; headline can shrink." One priority note per screen outperforms forty pixel callouts.
- **Dead frames leave the file.** Explorations move to an archive page at sprint boundaries. A file with three generations of the homepage is a fork with extra steps.
- **The designer owns staging review weekly, with the throttle on.** Twenty minutes comparing a real build to intent, in a real browser, on a real 375px viewport. Divergence caught at six days is a conversation; caught at six weeks it's a referendum on the relationship.
- **Changes flow through the token/spec layer, even small ones.** The moment "just tweak it in code this once" is acceptable, the pipeline is decorative. The occasional legitimate emergency gets a follow-up ticket to backport, and the follow-up is tracked like a bug.

## What this buys

On the [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild) we shipped twelve sprints with this system and the post-launch design-intent audit found a handful of divergences — not the usual double-digit drift — nearly all traceable to two emergency hotfixes that skipped the backport habit. The system didn't prevent decay by being rigorous; it prevented decay by making the correct path the *fastest* one. That's the whole trick to process design: nobody defends a pipeline that slows them down.

## Key takeaways

- Handoffs rot by forking (two writable sources), by describing pages instead of systems, and by ambiguity defaulting to expedient under deadline.
- Tokens-as-code is the highest-leverage fix: one JSON of record, semantic names, reviewed like an API, diffed and tested in CI.
- Component specs carry five sections — anatomy, states, content limits, responsive *rules*, accessibility contract — and pages are compositions, not sources of truth.
- Motion specs are tables of durations and cubic-bezier values with reduced-motion rows; anything an engineer must choose is a spec failure.
- The surviving habits: deviation notes on frames, priority annotations over measurements, archived dead frames, weekly designer-on-staging review, and no change that bypasses the pipeline.

## FAQ

**Doesn't this slow design down?** The first spec of a component family takes longer; every screen after it takes *less*, because the page is assembly, not invention. Net: slower week one, faster quarter. The teams that feel slowed are usually paying, for the first time, spec debts they always owed.

**Figma already has dev mode and variables — isn't this built in?** Dev mode inspects; it doesn't govern. Variables sync design internally but don't reach production without a pipeline and a review gate. The tooling is a fine substrate — the system is the contract about who changes what, where, and how it ships.

**How small a project is too small for this?** Token pipeline: nothing is too small — it's an afternoon to set up and pays off on a five-page site. Full component specs: below about ten components, a lean states-and-rules sheet replaces the document, but the five questions (states, limits, responsive rule, keyboard, focus) still get answered somewhere.

**Who owns the tokens, design or engineering?** Jointly, with design proposing and engineering merging — the same as any API with two consumers. The moment one side can change tokens unilaterally, you've rebuilt the fork with extra ceremony.

**What's the first thing to adopt if we do one thing?** Weekly designer-on-staging review, throttled, at a real device width. It's nearly free, it surfaces every other failure this article names, and it changes the standing question from "did they build it right?" to "what did we learn this week?"
