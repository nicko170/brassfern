---
title: "Help at the point of need"
description: "The user manual nobody opens, the tooltip that shouldn't exist, and how to design help that arrives where the question does — and gets out of the way."
slug: contextual-help-point-of-need
cluster: product
tags: [contextual help, documentation, tooltips, support deflection, UX writing]
date: 2025-10-02
author: Leonie Marsh
keywords: [contextual help UX, inline help design, tooltip UX, in-app documentation, support deflection]
readingTime: 9
---

There's a room in almost every product that users never visit: the help centre. It sits in a footer link or a life-ring icon, stocked with earnest articles written at launch, drifting further from the product with every release. Meanwhile, in the actual product, a user stares at the word "vesting schedule" for the ninth time, composes a support ticket, and adds to the queue someone will answer in twenty-one hours with a link back to the help centre they didn't find.

The distance between where questions arise and where answers live is one of the most expensive gaps in software. It costs the user their flow and it costs you a ticket the same product should have absorbed. Closing that gap is what contextual help is: help rendered at the point of need, in the vocabulary of the screen the user is looking at, brief enough to consume without leaving. This piece is how we design it — when to write inline, when a tooltip is an admission of failure, how to build search-inside-the-flow, and how to measure deflection honestly, without trapping people.

## The point-of-need ladder

Help comes in rungs, ordered by how much context they steal from the user. The art is reaching for the lowest rung that answers the question:

1. **The label itself.** The cheapest help is a clearer word. Before adding any help surface, interrogate whether the UI copy is doing its job. Half the tooltips we've deleted over the years were bandaids on a label that should have been rewritten. "Allocate" became "Split across cost centres" and the tooltip evaporated.
2. **Helper text.** A short line beside a field or section — persistent, not hover-gated — for information users need *before* acting: format requirements, consequences, who can see this. Helper text the user can read is accessibility baseline; helper text only visible on focus fails exactly the people using assistive tech inconsistently.
3. **Glossary tooltip.** A dotted underline or info affordance on *terms* — not functions — that reveals a one-or-two-sentence definition. This is the one legitimate tooltip genus: defining vocabulary, not explaining UI.
4. **Contextual panel.** For legitimate complexity, a side panel anchored to the current screen that answers "what am I looking at and what can go wrong" in under 200 words, with links onward. This is the workhorse, and the rest of this piece is mostly about doing it well.
5. **Searchable help in the flow.** A help entry point that searches your documentation *without leaving the product*, scoped by the current context first. More below.
6. **The help centre itself.** Still necessary! It's the canonical, linkable, deep archive — it's just the *last* resort, not the first. The point of the ladder is that rungs 1–5 absorb the common cases so the centre serves the genuinely thorny ones.

## When a tooltip is an admission of failure

A tooltip on an interactive control is usually the design saying *"I couldn't make this explain itself."* Sometimes that's true and fine — genuinely novel interactions deserve a hint. But audit your tooltips and you'll find most commit one of three sins:

- **Restating the label.** A button that says "Export CSV" with a tooltip that says "Exports a CSV." This is decoration with a maintenance cost.
- **Hiding essential information.** The thing users must know to act safely — "this will notify all 42 members" — belongs in visible text, not behind a hover. Hover doesn't exist on touchscreens, which is reason enough.
- **Explaining vocabulary the product invented.** If your tooltip defines a term your product made up, the fix is a better term or a [progressive disclosure](/journal/product/progressive-disclosure-complexity) pass, not a permanent crutch.

Our rule of thumb in critiques: a tooltip answering "what does this word mean?" is allowed; a tooltip answering "what does this button do?" is a bug report.

## The contextual panel, done properly

The side-panel pattern fails in predictable ways: generic content regardless of screen, 900-word articles when 150 would do, and a tone that reads like legal disclosure. What works:

**Write per-screen, not per-feature.** The question a user has on the *reconciliation* screen is not "what is your accounting product" — it's "what does 'unmatched' mean here and what happens when I ignore it." Content should be authored against screens, which means the help taxonomy mirrors the [settings and feature IA](/journal/product/settings-information-architecture) of the product, not the marketing sitemap.

**Front-load the decision.** The first two sentences answer the question or tell the user what to do. Background, edge cases and links go *after*. If the reader needs scrolling to learn the answer, the panel is an article squatting in a panel's clothes.

**Include the failure mode.** The most valuable sentence in contextual help is often "if you skip this, X happens on Friday." Users ask help systems about *consequences*, not features, more than teams expect. Write the consequence in.

**Ship it like copy, version it like code.** Contextual help decays silently when the product changes. Screenshots of UI age like milk. Treat panel content as strings in the repo or CMS with owners and a review pass at each release; a stale answer is worse than no answer, because you've now taught users the help is unreliable.

## Search inside the flow

When panels don't cover it, users search. The pattern that respects them: a help search embedded in the product (command palette or a dedicated search in the support entry point — the same muscle as the [command palette patterns](/journal/product/command-palette-patterns) we've written about), with three properties that matter more than the tech:

- **Context-scoped first, global second.** Results from the current area rank first, labelled ("In Billing"), with global results below. Relevance beats recall when someone is mid-task.
- **Answers, not just links.** Where a result has a crisp two-sentence answer, show it inline in the results, with the article beneath. This is the difference between search-as-navigation and search-as-resolution.
- **An honest exit.** When search fails to resolve — and it will — the path to a human must be one click, carrying the context (screen, search terms tried) into the ticket so the user never has to retype their question. The worst pattern in support UX is making a user debug the help system before they're allowed to ask for help.

We built this pay-off-first philosophy into the [Pylon Health telehealth work](/work/pylon-health-telehealth-flow), where patients under stress cannot be sent spelunking through a help centre to find out whether their appointment link works on their phone — the answer has to live where the anxiety lives.

## Measuring deflection without trapping anyone

"Ticket deflection" is a poisonous metric if naively measured, and support leaders know it: the laziest way to improve it is making support harder to reach. Deflection measured honestly looks like:

- **Panel usefulness votes with a punishment loop.** "Did this answer it?" Yes/No — and a No opens a free-text field *and* improves the contact-a-human result for that topic. No-votes are content bug reports; treat them as a queue.
- **Search success rate:** searches that end in an inline-answer view or a clicked result and *no* subsequent ticket or repeated search within the session. Refinements and pogo-sticking are failure signals, not engagement.
- **Time-to-resume:** analytics events can approximate how quickly the user returns to productive work after opening help. Help that resolves well is *fast*; long dwell time in help content is usually struggling, not interest.
- **Ticket rate per active account, by topic**, as the macro check. If deflection "improves" while topic-level ticket volume and churn both worsen, you built a wall, not an answer.

Instrumenting this properly is a tracking-plan problem — the same [analytics governance](/journal/growth/analytics-governance) discipline: name help events as first-class citizens (`help_opened`, `help_resolved`, `help_escalated`), or you'll be arguing from vibes at the quarterly review.

## The organisational honest bit

Great contextual help requires a writer close to the product, which means it is an ongoing cost, not a launch asset. The arrangement that works in our [product engagements](/services/product): one owner (usually content design) embedded with the squad, help content reviewed in the same PRs as the UI copy it sits beside, and the support team feeding the No-votes and ticket topics back weekly. When nobody owns the ladder, every rung rots at once — and the help centre quietly becomes, again, the room users never visit.

## Key takeaways

- Order help by context cost: label, helper text, glossary tooltip, contextual panel, in-flow search, help centre. Use the lowest rung that answers.
- A tooltip defining a button is a bug report; hover-gated essential information fails touch users outright.
- Write panels per-screen, lead with the decision, always include the failure mode, and version help like code with an owner.
- In-flow search should scope to context first, answer inline where possible, and offer an honest one-click exit to a human with context attached.
- Measure deflection with No-votes, search success, time-to-resume and per-topic ticket rates — never by making humans harder to reach.

## FAQ

**We have a help centre already. Where do we start?** Pull your top thirty ticket topics, map each to the screen where the question arises, and write a 150-word panel for the top ten. That sprint alone usually absorbs a visible chunk of volume — and it tells you which parts of the product are actually hard versus under-explained.

**Should help content live in the CMS or the codebase?** Wherever your writers can ship it fastest with review. For most squads: strings and short panels in the repo alongside UI copy (same PR, same review), long-form articles in the CMS behind the same publishing flow as marketing content.

**Does contextual help hurt power users?** Only if it's noisy. Persistent, skimmable, dismissible-but-not-naggy surfaces are invisible to people who don't need them and lifelines to people who do. Never auto-open, never re-show after dismissal, never gate it behind a tour.

**How does AI fit into this?** A well-scoped in-product assistant trained on your docs can compress rungs 4–6 into a conversation — but only with your real content behind it, honest "I don't know" behaviour, and the human exit intact. Otherwise you've animated the wall.
