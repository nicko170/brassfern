---
title: "Copperplate: a design system people actually read"
description: "How we rebuilt a dev-tooling company's design system docs around live tokens, do/don't blocks and honest guidance — and doubled adoption in a quarter."
slug: copperplate-design-system
cluster: work
tags: [design system, documentation, design tokens, component library, adoption]
date: 2026-03-19
author: June Okafor
keywords: [design system documentation, design tokens, component library adoption, dev tools UX, copperplate case study]
readingTime: 9
heroImage: /images/work/copperplate-design-system.jpg
heroAlt: "A design-system documentation page rendered as a printed specimen sheet: token swatches, a do-and-don't component pair, and brass-edged index tabs on warm paper"
client: Copperplate
industry: SaaS
services: [Product design & engineering, Brand & identity]
year: 2026
stack: [React, TypeScript, CSS custom properties, Vite, MDX]
demo: copperplate-ds-docs
---

Copperplate (a fictional client in our concept portfolio) builds observability tooling for infrastructure teams — the kind of product where the UI is dense, the users are sceptical, and every inconsistency gets a GitHub issue. They had a design system. Technically. It was a Figma library, a half-finished React package, and a Notion page called "Copperplate DS v2 (DRAFT)" that 40 engineers had silently agreed not to open.

Their design lead, Mira Kostova, put it plainly in our first call: "We don't have a consistency problem. We have an *adsorption* problem. Nobody takes the system up, so everyone rebuilds buttons in a slightly different shape." The product had five button styles. We counted.

## The challenge

Design systems fail in the documentation layer, and Copperplate's failure was a textbook example.

**The docs described components; they didn't teach decisions.** Each page was a prop table and a screenshot. Nothing said *when* to use a modal versus a drawer, or why the destructive action is never primary. An engineer looking for an answer found an API reference, and engineers with deadlines route around API references that don't answer their actual question. We write about this pattern constantly — a component library without usage guidance is a parts bin, not a system.

**The tokens were tribal knowledge.** Spacing values lived in Figma variables, colours in a CSS file, and the mapping between them in the head of one staff engineer. The Figma-to-production gap is exactly what a proper [token pipeline](/journal/engineering/design-tokens-pipeline) is built to close; Copperplate had the pipeline's ingredients and none of the plumbing.

**Adoption was unmeasured, so it was unmanageable.** Nobody could say how much of the product actually used the system, which made every "should we invest in the DS?" conversation a vibes-based negotiation.

The kicker: Copperplate's customers noticed. Their design review with an enterprise prospect had been derailed by someone spotting three different focus-ring styles in a single settings page. Consistency is brand trust for a [SaaS product](/industries/saas) — you are, quite literally, what your settings page looks like.

## The approach

We proposed treating the documentation site as the product and the component library as its dependency — the inverse of how Copperplate (and most teams) thought about it. Sixty per cent of the budget went to the docs experience.

### Live tokens, not screenshots

Every token on the site is the actual production value, rendered from the same CSS custom properties the package ships. The colour page isn't a picture of swatches; it's a live grid where copying a value copies the real thing, where changing the theme switches the whole page, and where each token shows its usage count across the product — pulled from a weekly static analysis of the repo. A token nobody uses is flagged as a deprecation candidate. This is the philosophy behind [versioning tokens like an API](/journal/engineering/design-token-versioning) made visible: consumers deserve to see the contract's health, not just its syntax.

The centrepiece is a token playground: pick a component, adjust spacing, radius and elevation on live instances, and the playground emits the diff — the exact overrides you'd write, or more often the realisation that the default was already right. We estimate half of all "can we customise this?" requests die in the playground. Dying there is the correct place to die.

### Do/Don't blocks that argue their case

Every pattern page leads with paired do/don't examples — rendered, not described — with the reasoning stated in one sentence each: "Don't: icon-only destructive buttons — users can't undo what they can't identify." The tone matters. We wrote these as guidance from a colleague who has been burned, not legislation from a committee, and we ran them through the same voice principles we'd apply to any [brand system](/services/brand): confident, specific, willing to say "we don't know yet" where the team genuinely didn't.

Each component page answers five questions in a fixed order: what it's for, when to use it, when *not* to, the accessibility contract (keyboard map, ARIA roles, focus behaviour), then — and only then — the props. Putting usage before API was the single most-copied decision in our internal critique. Engineers told us later the docs "read like they were written by someone who ships." They were.

### Adoption as a dashboard, not a hope

We shipped a small static-analysis script that counts system imports versus hand-rolled UI per product surface and publishes it to the docs' front page: "68% of Product surfaces run the system." Two things happened that we'd bet on but still enjoyed watching. First, teams started competing — the number became a leaderboard nobody mandated. Second, the design leads finally had leverage in planning meetings, because the investment question now had a denominator.

### Contributing without a committee

The old system's contribution path was "book a meeting with Mira." We replaced it with a documented RFC light: propose in a template, get an answer in a week, every accepted proposal appears in the changelog with the reason. The changelog is a real page on the site, dated, with migration notes — because a design system without a readable history is a present you can't trust.

## The outcome

Fourteen weeks from kickoff to launch, run as a fixed-scope sprint followed by a documentation retainer — the [engagement shape](/pricing) we'd recommend for any system that has to keep living after the builders leave. As with everything in our [work portfolio](/work), the numbers below illustrate a real engagement of this shape:

| Metric | Before | After (one quarter) |
| --- | --- | --- |
| Product surfaces on the system | 31% | 68% |
| Monthly "which component do I use?" Slack questions | ~90 | ~25 |
| Time for an engineer to ship a conformant settings page | ~3 days | ~1 day |
| Docs weekly active users (of 63 engineers) | 11 | 52 |
| Distinct button styles in production | 5 | 2 |

The fifth button style turned out to be load-bearing in a legacy chart toolbar. We let it live, documented, with a deprecation date. Honest systems document their exceptions; only fake ones pretend to be finished.

## What we learned

**Docs effort should outweigh component effort.** A mediocre component with excellent guidance gets adopted; a brilliant component with a prop table gets worked around. Budget accordingly.

**Adoption metrics change the politics.** Once uptake is measured and public, the design system stops being a design team hobby and becomes shared infrastructure with a visible return.

**The do/don't block is the highest-leverage component on the site.** It compresses a senior designer's judgement into a scannable pattern that survives their absence — which, in the end, is the entire point of a design system.

Mira's note in the retro was the summary we'd have written ourselves: "You didn't give us a design system. You gave us a place where our taste is recorded." That's the brief for every documentation project we take on now.
