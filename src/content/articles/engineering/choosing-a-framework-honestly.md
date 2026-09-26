---
title: "Choosing a framework without the fashion show"
description: "How to choose a web framework honestly in 2026: content site vs app, team skills, hiring, SSR needs, ecosystem gravity, exit costs — plus our decision memo."
slug: choosing-a-framework-honestly
cluster: engineering
tags:
  - architecture
  - react
  - decision making
  - frontend
date: 2026-03-05
author: Tomás Reyes
keywords:
  - choosing a web framework
  - react vs svelte vs vue
  - framework decision guide
  - agency tech stack
readingTime: 10
heroImage: /images/articles/engineering/choosing-a-framework-honestly.jpg
heroAlt: "Paper cards fanned like a decision matrix on a cream desk, with a brass paperweight, calipers and a fern sprig."
---

The framework conversation has a uniform: a slide with eight logos, a benchmark chart nobody reads the axes of, and a junior engineer's GitHub stars screenshot presented as evidence. Then everyone picks React anyway, because their last three projects were React and the hiring pool is React.

Sometimes that instinct is right. Sometimes it's just inertia wearing a lab coat. Here's how we actually make the call — and the memo template we use to make it in writing, so nobody can retroactively claim the decision was obvious.

## First: admit what the choice is and isn't

A framework is a five-year mortgage, not a weekend rental. You'll pay it in hiring ("can we find a Nuxt dev in Auckland in six weeks?"), in upgrades (the major-version migration nobody budgeted), in ecosystem gravity (does the CMS have a first-party SDK, or a community one last touched in 2024?), and in exit costs (how badly does this hurt if we're wrong?).

What it usually isn't: a performance differentiator. Every mainstream framework beats your Core Web Vitals budget when run by a disciplined team, and every one of them can produce a 900 kB checkout when run by an undisciplined one. Discipline dominates the distribution — see [the 170 kB rule](/journal/engineering/bundle-budget-discipline) for how we hold the line regardless of stack. So stop optimising for the framework's theoretical ceiling and start optimising for your team's actual floor.

## The questions that decide it

**1. Is this a content site or an application?** This single question eliminates half the market. A marketing site, editorial platform or documentation hub wants server-rendered HTML, islands of interactivity, and content tooling. A dashboard, configurator, or heavy-workflow app wants a coherent client runtime, a component model your designers can think in, and real state management. When the answer is "mostly content with interactive pockets," an islands approach wins on payload almost every time — we made that case in [sprinkle, don't soak](/journal/engineering/islands-architecture-when).

**2. Who maintains this in month 14?** Not who builds it — who owns it after launch. If the client has two in-house devs who know Vue and zero who know our preferred stack, shipping them a hand-tuned Astro-with-React-islands masterpiece is a time bomb with excellent lighthouse scores. We explicitly score "handover survivability" in every decision memo.

**3. What does the ecosystem owe you?** List the five integrations the project can't live without — CMS, auth, payments, search, analytics — and check the first-party support for each candidate. Gravitational pull matters more than elegance. A boring framework with an official Shopify Hydrogen-grade SDK for your exact need beats a beautiful one with a 400-star community wrapper.

**4. What's the failure mode?** Every framework fails differently. React fails by accretion — ten state libraries, four data-fetching generations, a codebase stratified like sedimentary rock. Svelte fails by ecosystem thinness in weird corners. Full-stack meta-frameworks fail by coupling — the version upgrade that drags your bundler, router and server runtime into one terrifying weekend. Name your candidate's failure mode out loud. If nobody in the room can, you don't know it well enough to bet a client on it.

**5. Can you leave?** Write the exit plan before you enter. Could a competent team port this in eight weeks? If the framework's idioms have soaked into your business logic (server actions everywhere, framework-specific data formats), the answer is no, and your negotiating position with the framework's breaking changes is weak forever.

## The memo template

We write one page, always, no matter how obvious the choice feels. It's saved us from three bad decisions and one very awkward client conversation. Copy it freely:

```text
DECISION: <framework + rendering strategy> for <project>
DATE / OWNER: <who signs>

1. SHAPE: content site | app | hybrid (with % split guess)
2. AUDIENCE FLOOR: <browser support floor from analytics>
3. TEAM NOW: <skills in the room>
4. TEAM IN MONTH 14: <who maintains, what they know>
5. CRITICAL INTEGRATIONS: <5 max, first-party SDK? y/n>
6. FAILURE MODE WE'RE ACCEPTING: <one sentence>
7. EXIT COST: <weeks to port; what makes it painful>
8. RUNNER-UP AND WHY IT LOST: <must be honest>
9. REVISIT TRIGGERS: <what would make us reopen this>
```

Item 8 is the load-bearing one. If you can't write a fair sentence about the runner-up, you didn't evaluate it — you rationalised. Item 9 keeps the decision from becoming scripture: "reopen if the project's interactive surface crosses 60%" is a much healthier sentence than "we're a React shop."

## Our defaults, honestly stated

Writing the same memo twenty times a year, we've collapsed onto defaults — with documented exceptions, which is what separates defaults from dogma.

**Content-heavy marketing and editorial sites:** an islands/static-first stack. Ship HTML, hydrate pockets. This very site runs exactly that pattern, prerendered to static files. **Heavy client-side applications:** React with strict conventions — one data-fetching pattern, one state library, a component boundary between "the app" and "the framework" so the mortgage stays serviceable. **Small tools and demos:** whatever makes the demo sing, because a demo's month-14 owner is a case study, not a maintainer. **Hybrid products (marketing + app behind a login):** split the stacks at the boundary rather than bending one framework into both shapes. Two small codebases beat one confused one.

If you want the rendering-strategy half of this conversation — where SSR, streaming, SSG and ISR each earn their keep — we wrote it up in [React Server Components: the trade-offs](/journal/engineering/react-server-components-tradeoffs) and [an honest guide to edge rendering](/journal/engineering/edge-rendering-honest-guide).

## What founders should ask an agency's stack recommendation

If you're on the buying side and an agency recommends a stack, five questions cut through the fashion show:

- *"What did you build with it that I can click?"* Shipping beats opinions.
- *"What's the runner-up and why did it lose?"* If there's no runner-up, there's no decision.
- *"Who maintains this after you leave, and can I hire them?"* The honest answer includes a salary band.
- *"What's the exit cost if we part ways?"* Good agencies answer this warmly; trapped ones change the subject.
- *"Which parts of my project fight this framework?"* Every stack fights something. "Nothing, it's perfect for you" is a red flag in a trench coat.

We answer these on every pitch and in every [engagement we scope](/pricing), because the stack conversation is the cheapest place in a project to be honest. By the time you're arguing about it in month nine, it's the most expensive.

## Key takeaways

- Framework choice is a five-year mortgage: hiring, upgrades, ecosystem gravity and exit costs matter more than benchmark ceilings.
- The content-site-vs-application question eliminates half your options before benchmarks enter the room.
- Write a one-page decision memo with an honest runner-up and explicit revisit triggers — it kills both dogma and retroactive certainty.
- Optimise for your team's actual floor (who maintains this in month 14?), not the framework's theoretical ceiling.
- Buyers: ask any agency for the runner-up, the exit cost, and what parts of your project fight their recommendation.

## FAQ

### Isn't "we're a React shop" a legitimate strategy?

Yes — hiring speed, shared patterns and reusable internal libraries are real, compounding advantages. The mistake is pretending it's a technical verdict rather than an organisational one. Own it as a business decision and it serves you; dress it up as "React is objectively best" and you'll ship content sites with 400 kB of JavaScript and call it craft.

### How often should we revisit our default stack?

Annually for the default, immediately on revisit triggers per project. Our 2025 review changed exactly one default (we moved more content work to static-first rendering) and reaffirmed the rest. A review that never changes anything is fine — the point is that it *could*.

### Should a startup match its stack to the hiring market or to its team's taste?

For seed-stage, taste and velocity win — the founder-engineers' fluency ships the product that earns the right to hire. By series A, the hiring market starts winning the argument. The failure mode is flipping that ordering: exotic stack at scale, boring misery at the start.

### What's the single most skipped step in framework selection?

The exit-cost estimate. Teams treat "we'll never migrate" as a reason not to think about migration, which is backwards — the projects you never migrate are exactly the ones where exit cost accrues for a decade. Ten minutes in a memo. Do it. Or [let us do it with you](/contact).
