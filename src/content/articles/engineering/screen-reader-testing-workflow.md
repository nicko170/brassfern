---
title: "Screen-reader testing: a 30-minute workflow for every release"
description: "Automated checks catch a third of accessibility problems. A repeatable 30-minute manual screen-reader script catches the rest — the workflow we run every release."
slug: screen-reader-testing-workflow
cluster: engineering
tags: [accessibility, testing, screen-readers, qa]
date: 2026-05-07
author: Felix Brandt
keywords: [screen reader testing, nvda testing workflow, voiceover testing, accessibility testing manual, wcag testing]
readingTime: 9
---

Automated accessibility tooling is genuinely good now — axe, Lighthouse, pa11y in CI — and it catches roughly a third of real accessibility defects. The other two thirds live where automation can't see: focus that vanishes into a modal's shadow realm, a toast that announces nothing, a data table that reads like alphabet soup, an error message that exists visually but not in code. The only way to find those is to listen to your product.

Most teams don't, because "screen-reader testing" sounds like specialist work reserved for audits. It isn't. What follows is the compressed, repeatable 30-minute workflow we run before every significant release — the exact script, the three screen readers that matter, and how to write findings developers will actually fix. This sits inside our wider belief that [accessibility is an engineering discipline](/journal/engineering/accessibility-as-engineering-practice), not a ticket queue — the script is just the discipline made schedulable.

## The three screen readers that matter

You cannot test everything, so test where the users are. For a web product, the matrix that covers the overwhelming majority of real usage is:

1. **NVDA + Chrome or Firefox on Windows.** Free, dominant among desktop screen-reader users, and the most standards-following interpretation of ARIA. If your markup is honest, NVDA is honest about it.
2. **VoiceOver + Safari on macOS and iOS.** VoiceOver has its own mind — the rotor, the virtual cursor, gesture navigation — and iOS VoiceOver is the dominant mobile pairing. Test the iPhone path; mobile focus juggling is where single-page apps go to die.
3. **JAWS + Chrome, if you can afford the licence.** Still significant in enterprise and government contexts, and it has fascinatingly aggressive heuristics for covering up broken markup. If JAWS can't fix your page, it's genuinely broken.

TalkBack on Android rounds out the matrix if your audience skews Android. Explicitly out of scope for the routine pass: multiple browser pairings with the same reader, and niche combinations — document them as known gaps and move on. Decide your matrix once, write it down, test it every time. Accessibility regressions breed in the gap between "we tested it once" and "we test it always".

## The 30-minute script

The point of a script is that *any* engineer can run it, headphones on, screen optionally dimmed (NVDA's screen curtain is a feature, use it — it stops your eyes cheating). Thirty minutes, five passes, every release that touches interactive UI.

**Minutes 0–5: The landmark tour.** Press the rotor (VoiceOver) or elements list (NVDA's `Insert+F7`). Do the landmarks, headings and links form a sensible document? A page that reads as "main, complementary, complementary, contentinfo" with 40 links all labelled "learn more" has failed before you've touched a component. Headings should make an outline a stranger could navigate — we covered the writing side in [accessible design handoff](/journal/web-design/accessible-design-handoff).

**Minutes 5–12: The keyboard walk.** Unplug your mouse metaphorically. Tab through the primary flow: navigation, search, a form, a dialog. You're listening for three disasters: focus reaching invisible elements, focus *escaping* a modal into the page behind it, and modals that don't announce themselves at all. This pass overlaps entirely with [keyboard-first engineering](/journal/engineering/keyboard-first-interfaces) — every keyboard bug you can hear is a keyboard bug a screen-reader user lives inside.

**Minutes 12–20: The form slog.** Complete one real form badly on purpose. Leave required fields empty, type an invalid email, submit. Can you hear which fields are required *before* you get it wrong? Does the error summary receive focus, do errors get associated with their inputs (`aria-describedby`), does the summary link jump you to the field? Form accessibility failures are the single most common finding in our passes, which matches the design-side reality that [forms are the highest-traffic UI nobody designs](/journal/web-design/forms-nobody-designs).

**Minutes 20–26: Live regions and async.** Do the dynamic things: submit a search, add to cart, trigger a toast, paginate a list. Silent updates are invisible to a screen-reader user unless a live region announces them. Too little announcement is a void; too much (announcing every keystroke of a typeahead) is a barrage. The craft is announcing *outcomes*, not events: "14 results" beats "loading… loading… results".

**Minutes 26–30: The table test.** If the product has data tables — every [product we build](/services/product) eventually does — navigate one with table commands (`Ctrl+Alt+arrows` in NVDA). Do column headers repeat as you move? A table that reads "cell, cell, cell" is unusable data; one that reads "February, actual spend, $4,120" is information.

## Recording findings developers act on

A finding like "the dialog is inaccessible" goes to the backlog to die. A finding like this gets fixed in a day:

> **Checkout modal traps focus (NVDA + Chrome, release 4.2).** Steps: open payment modal, press Tab past the last button — focus moves to the page behind, invisible. Expected: focus cycles within the modal; `aria-modal="true"` and a focus trap. Severity: blocker (keyboard users cannot reliably complete checkout). Heard at 0:42 in attached audio clip.

The ingredients: named environment and version; numbered steps *in the screen reader*, not the mouse; the expected behaviour tied to a technique, not a feeling; **severity expressed in user impact** (blocker / painful / annoying), because "WCAG 4.1.2 violation" doesn't triage itself; and an audio or screen recording — thirty seconds of a confused speech buffer teaches faster than any paragraph.

Route findings like bugs, not like penance. Blockers stop the release. Painful gets scheduled in the next sprint. Annoying gets batch-fixed on the accessibility debt days we run every quarter — the same debt model we apply to [bundle budgets](/journal/engineering/bundle-budget-discipline): a visible ledger, a shrinking number.

## The mistakes that make teams quit

We've watched this workflow die in other organisations for predictable reasons, so:

- **Don't test with default settings only.** Crank the speech rate up slowly as you gain fluency — testing at 30% speed makes 30 minutes take 90, which is why nobody repeats it. Fluency is a feature of the workflow.
- **Don't chase parity across all three readers.** ARIA interpreted three ways is a platform reality, not a defect. Fix real barriers, accept accent differences.
- **Don't let the script fossilise.** Update it when the product's primary flow changes. The script is a test suite; it rots if nobody owns it.
- **Don't ration this to specialists.** Pair every engineer through it monthly. The first time a developer hears their own datepicker read aloud, they never ship it like that again. That's the actual product of the 30 minutes: not the findings, the reflex.

On the Pylon Health telehealth flow ([case study](/work/pylon-health-telehealth-flow)) this script was non-negotiable — health anxiety and inaccessible interfaces compound each other cruelly. The pass caught a focus-loss bug in the video-waiting room that automation waved through, on a flow where losing a patient mid-wait is a clinical problem wearing an engineering costume.

## Key takeaways

- Automation finds a third; a scripted manual pass finds the rest. Thirty minutes every release beats a painful audit every year.
- Test NVDA + Chrome/Firefox, VoiceOver + Safari (desktop *and* iOS), JAWS where the audience demands it. Write the matrix down.
- The five passes: landmarks, keyboard walk, forms-done-badly, live regions, tables. Same order, every time.
- Findings need environment, steps, expected technique, user-impact severity and a recording — or they join the backlog décor.
- Silence is the worst failure mode: unannounced errors, unannounced updates, focus that vanishes. Listen for nothing happening.
- Pair every engineer through it monthly. The reflex is the deliverable.

## FAQ

**We're remote — how do we test NVDA without a Windows box?**
A Windows VM (Parallels, a cloud box) with NVDA installed works fine, and assistivetesting services exist for the matrix you can't own. What doesn't work is assuming macOS VoiceOver findings transfer. They don't.

**Can we just hire an accessibility specialist instead?**
For depth, yes, and we pair with specialists on complex components. But specialists release-gate you: if one person holds the skill, accessibility becomes a bottleneck and then a resentment. Specialists should review and teach; the whole team should run the routine passes.

**Where does this sit relative to WCAG conformance audits?**
Upstream and continuous. The 30-minute pass keeps the product honest week to week; a formal audit samples it deeply once. Running the script makes audits boring — which is exactly what you want an audit to be.

**Screen readers say our app is fine, but a beta user says it's unusable. Who's right?**
The user. Always the user. Technical conformance is the floor; the [design of focus states, language and flow](/journal/web-design/focus-states-design) is the building. Script fixes the floor, usability testing with disabled users fixes the building. Do both.
