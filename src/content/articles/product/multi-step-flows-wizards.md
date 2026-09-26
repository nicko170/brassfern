---
title: "Wizards that don't feel like tax forms"
description: "Multi-step flows get a bad name from bad implementations. Step economics, honest progress, save-and-resume, and the test for when one long page beats five short ones."
slug: multi-step-flows-wizards
cluster: product
tags: [ux design, multi-step forms, progressive disclosure, product design, conversion]
date: 2025-05-19
author: Aiko Tanaka
keywords: [wizard UX, multi-step forms, progressive disclosure, flow design]
readingTime: 11
---

Somewhere in your product right now there is a flow that users describe as "a bit of a tax form." Five steps, a progress bar that lies, a summary page that ambushes them with an error from step two, and a completion rate the team has stopped saying out loud. We've rebuilt enough of these — from [telehealth intake](/work/pylon-health-telehealth-flow) to a six-stage [pack configurator](/work/osprey-outdoor-configurator-launch) — to know the pattern: the wizard isn't the problem. The wizard is where a set of small, unmade decisions accumulate into a bad experience.

This is the decision catalogue we use. Most of it applies to any multi-step flow: onboarding, checkout, intake, configuration, publishing.

## Step economics: what a step actually costs

Teams count steps wrong. They count screens; users experience *decisions*. A step's real cost has three parts:

1. **Cognitive cost** — how much thinking the screen demands. "Confirm your name" is nearly free. "Choose a billing model for your workspace" is expensive.
2. **Fetching cost** — anything that sends the user away from the screen: find a policy number, ask a colleague, check an email. Fetching is the most dangerous cost because it breaks the session; measure these fields first and move them late, make them optional, or let users skip and return.
3. **Commitment cost** — the felt irreversibility of the choice. Selecting a date feels cheap. Naming your company in a field that will appear on invoices feels expensive.

A healthy wizard arranges steps so cost rises gradually and the fetching/commitment-heavy steps come after the user has momentum and visible progress. The classic mistake is front-loading the scary field — "what should we call your organisation?" as question one — because it mirrors the *data model's* order rather than the *user's psychological* order. Order by momentum, not by schema.

There's also a budget. For consumer flows we treat three to five decisions as the ceiling before completion falls off a cliff; for professional tools with clear payoff, users tolerate more, provided each step visibly earns its place. Every step should pass a one-sentence justification: "This screen exists because ___, and it can't merge with a neighbour because ___." If the answer is "because the form was getting long," you don't have steps — you have a scroll that was cut with a knife.

## When one long page beats five short ones

[Progressive disclosure](/journal/product/progressive-disclosure-complexity) is a tool, not a religion. Splitting a form into steps trades scrolling for waiting and orientation cost, and sometimes the trade is wrong. One long page wins when:

- **Fields are interdependent.** Users need to see the whole problem to answer any part — common in configuration and budgeting tools, where choices constrain each other.
- **The data is short and familiar.** Name, email, one preference: one page, one submit, done. Chopping this into steps is theatre.
- **Review matters more than pace.** Checkout-adjacent flows where users constantly jump back to adjust earlier answers are misery as a strict stepper and pleasant as a scannable page with anchored sections.

A wizard wins when the task has a natural narrative arc (setup, intake, booking), when later steps genuinely depend on earlier answers, or when the audience is anxious or unfamiliar — a telehealth intake patient benefits from one question at a time; a daily admin configuring their fiftieth workspace does not. Match the structure to the user's relationship with the task, not to the team's component library.

## Progress honesty, or: the bar that lies

The fastest way to poison a wizard is a progress indicator that can't be trusted. The tells: a bar that jumps from 20% to 90% on the last step; "Step 3 of 5" where step 4 expands into seven sub-questions; a percentage computed from fields rather than effort.

Rules we hold to:

- **If you can't count it honestly, don't count it.** A step indicator that lies once is never trusted again. When the remaining effort is genuinely variable, use a non-numeric treatment — section names ("Your details" → "Preferences" → "Review") — which communicates position without promising distance.
- **Weight by effort, not screens.** "Step 2 of 5" should mean roughly 40% of the *work* is behind you. If step 2 is eight fields and step 5 is a checkbox, renumber or regroup until the fractions mean something.
- **Never go backwards.** A progress indicator that retreats — because an answer revealed a new step — destroys more trust than having no indicator at all. Branch-heavy flows should reveal the full possible path at the start ("3–6 steps depending on your answers") rather than improvising.

## One decision per screen — and one story across screens

Within a step, the discipline we design to is *one decision per screen*, with supporting fields allowed only when they're literally inputs to that single decision. "Your practice details" is not a decision; it's a filing cabinet. "How many clinicians will use this?" is a decision, and the fields beside it earn their place only if the answer changes them.

Across steps, the wizard needs narrative connective tissue. Each screen should open with a line that acknowledges what just happened and sets up what's next — "You're booked for Tuesday. Now, two quick questions so your clinician is prepared." This is the difference between a flow and a questionnaire, and it's the cheapest warmth you can buy in product copy. It pairs well with the broader craft of [onboarding that activates](/journal/product/onboarding-patterns-activation): the wizard is often the user's first real conversation with your product, and it should sound like one.

## Save-and-resume is not a luxury

Any flow longer than three minutes, or containing a single fetching-cost field, will be abandoned mid-way by some large share of your users. The question is whether abandonment is permanent. Persist drafts silently — every keystroke, no "save draft" button — and treat the return experience as a designed surface: resume where they left, summarise what they've told you so far, never make them re-verify what you already know. For B2B flows, let a partially complete form be handed to a colleague; the person who starts an intake is frequently not the person holding the policy number.

And when the flow does fail — a declined card, an invalid ABN — failing well is its own discipline. Errors belong *in the step, at the field, at the moment of entry*, never stockpiled for a judgy summary screen at the end. Our rules for [error messages that de-escalate](/journal/product/error-messages-that-help) apply with double force inside a wizard, where the user has invested the most.

## The details that separate "fine" from "felt easy"

A handful of smaller rules, each learned from a flow that ignored it:

- **The back button is sacred.** Browser back, step back and breadcrumb back must all work and must never punish the user by clearing entered data. A wizard that destroys input on back-navigation is a wizard users learn to fear.
- **Keyboard-first through the whole flow.** Enter advances, focus lands on the first field, error states announce to screen readers. Wizards concentrate focus-management bugs; test the flow with a keyboard before it ships, not after the accessibility report.
- **The last step is small on purpose.** End on something cheap — a name, a consent toggle, a review — so the finish line is visibly close. Never put the heaviest decision last.
- **The completion screen is a beginning.** Confirm what happened, state what happens next and when, and give the user their next action. A wizard that ends with "You're all set!" and nowhere to go has spent the user's momentum and banked nothing.

If you're scoping this kind of rebuild, it's squarely the work our [product design and engineering](/services/product) squads do in fixed-scope sprints — a broken intake flow is usually a four-to-six-week fix, not a quarter-long epic.

## Key takeaways

- Count decisions, not screens. Each step carries cognitive, fetching and commitment cost — sequence by user momentum, not by database order.
- Every step needs a one-sentence justification that isn't "the form was long."
- Progress indicators tell the truth or don't exist: weight by effort, never retreat, go non-numeric when you can't count honestly.
- One long page beats a wizard when fields are interdependent, short, or review-heavy. Wizards win for narrative arcs, dependent steps and anxious audiences.
- Persist drafts silently, design the resume experience, and put errors in the moment, not in a summary ambush.
- Back never destroys data; the last step is cheap; the completion screen gives a next action.

## FAQ

**How many steps is too many?**
There's no magic number, only a cost curve. In consumer flows we see steep completion drop-offs past five decisions; in professional tools with clear payoff, eight well-shaped steps outperform three badly-shaped ones. Measure abandonment *per step*, and hunt the step with the cliff — it's almost always a fetching-cost or commitment-cost field that can move, soften or become optional.

**Should branching flows show a step count?**
No. Branching is the case for named sections ("About you" → "Your projects" → "Review") with an honest range — "four to six steps" — set at the start. A precise count you can't honour is worse than none.

**Do wizards hurt conversion versus single-page forms?**
The honest answer: it depends on field count, audience and payoff, and the published studies in both directions usually compare a good implementation of one against a bad implementation of the other. What reliably hurts conversion is lying progress bars, summary-page error ambushes and front-loaded scary fields — all fixable within either structure before you reach for an A/B test.

**When should we show a summary/review step?**
When the output has consequences — money, legal weight, something others will see. And make the review live: each row links back to its step for editing without losing place. A read-only summary that forces full back-navigation is a review in name only.
