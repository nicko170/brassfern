---
title: "Running an accessibility audit that leads to fixes"
description: "Most accessibility audits produce a PDF and no change. Our audit format — automated sweeps, manual journeys, a severity taxonomy teams understand, and fix-forward roadmaps."
slug: accessibility-audit-process
cluster: product
tags: [accessibility, a11y, wcag, audit, inclusive design]
date: 2025-04-23
author: Mara Ellison
keywords: [accessibility audit process, wcag audit, a11y remediation, accessibility testing]
readingTime: 11
heroImage: /images/articles/product/accessibility-audit-process.jpg
heroAlt: "Editorial still-life of printed accessibility audit sheets with annotations, a brass ruler and a screen reader handset on cream paper, fern-green and brass palette."
---

Most accessibility audits fail the same way. A capable consultant produces a thorough PDF — 140 issues, WCAG citations, screenshots with red boxes — and emails it to a product team that is already three sprints deep into a roadmap. The PDF gets skimmed, the alarming parts get worried about, a ticket gets created ("Fix accessibility?"), and eighteen months later the next audit finds substantially the same issues, now with fresher timestamps.

The problem is rarely the auditing. It's the design of the audit as an artefact: written to prove thoroughness, not to produce change. After running audits and remediations across products where exclusion has real consequence — a [telehealth flow](/work/pylon-health-telehealth-flow) where anxious patients must succeed on the first try, a [community bank](/work/copperline-community-bank) whose customers skew older and whose regulators read WCAG — we've converged on a format measured by one metric: **issues fixed per sprint, sustained**. Here's the whole thing, including the report structure, so you can run it yourself or hold your next auditor to it.

## Scope by journey, not by page count

The first decision shapes everything: what are we auditing? The default answer — "the site" — produces page-based audits, and page-based audits produce exactly the kind of findings list that rots. Pages are how websites are filed; **users experience journeys**.

We scope every audit as six to ten critical journeys with named, human stakes: "Book an appointment for the first time, while anxious, on a phone." "Move money between accounts using only a keyboard." "Find out whether an application was approved, using a screen reader." Each journey gets a persona-with-constraint pairing, not because users are their constraints, but because the pairing forces specificity. "Screen reader user, vague" lets findings drift into hypotheticals; "first-time appointment booking with NVDA on the account phone number screen" produces a finding you can fix.

Journeys also give you a denominator for severity that pages never can. A contrast failure on a decorative card and a contrast failure on the *pay now* button are the same WCAG success criterion and completely different problems. Only journey context tells you which is which.

## Automated sweeps: 20% of the coverage, 80% of the ammunition

We run automated tooling first — axe across every template in the journey set, Lighthouse, HTML validation, plus our own lint-level checks in CI once remediation begins. But we run it with clear eyes about what it is: automated testing reliably finds a minority of real-world accessibility problems. Interactive state, reading order, focus management, meaningful copy — the marrow of accessibility — is beyond automated reach.

So why run it? Three reasons:

- **The findings are unambiguous.** "14 instances of insufficient colour contrast, here's the ratio" requires no expertise to believe. Automated results are the door-opener with skeptical stakeholders.
- **They scale by template.** One contrast failure on a button component is one fix that heals four hundred pages. Automated audits think in components, which is exactly how engineering thinks.
- **They become the rats-in-the-walls detector after remediation.** The point of the initial sweep is partly to install the permanent checks. Post-audit, axe runs in the pipeline and new contrast failures fail the build.

Two disciplines keep the automated phase honest: never report a raw tool dump (deduplicate by component, always), and never let the client confuse the automated score with the state of their accessibility. A 100 Lighthouse score over an unusable journey is a failure our reporting names out loud.

## Manual testing: the skill roster that makes findings trustworthy

Manual testing is where audits earn their fee, and it's a roster problem, not a heroics problem. Our journey pass uses four modes, each done as a complete traversal, findings logged with steps, expected vs actual, and a capture:

1. **Keyboard-only.** Every journey, start to finish, tab and enter and escape. This alone surfaces the majority of critical issues in most products: focus lost in modals, skip links that skip to nowhere, menus that open but never let you leave. It also has the lowest empathy-barrier for the team — any developer can reproduce a keyboard trap in thirty seconds, which makes these the fastest-fixed findings.
2. **Screen reader.** A lead tester with daily NVDA/VoiceOver fluency walks the journeys, with a sighted note-taker. We pay for genuine fluency here; developers-trying-JAWS-for-a-day produces noise, not signal.
3. **Zoom and reflow.** 200% and 400% zoom, small viewport, landscape on mobile. Mature teams are often surprised how degrading this is on "responsive" sites.
4. **Cognitive-load pass.** Plain-language review of instructions, error messages, timeouts and deadline pressure. The least instrumented pass and — in health and finance, arguably the most important. We wrote about the copy side of this in [our forms piece](/journal/web-design/forms-people-finish); errors written as repairs matter twice as much under stress.

Where budget allows, we add sessions with users with disabilities. Nothing in a report moves a roadmap like watching a real customer's journey end at an invisible button. But a caution we hold firmly: user sessions are *research that deepens* the audit, never a substitute for the systematic pass — one user's setup is one data point, not coverage.

## A severity taxonomy the team can hold in its head

This is where most audits lose the plot, because they inherit WCAG's vocabulary (A/AA/AAA conformance levels) as their triage system. Conformance level is a legal and contractual category; it is nearly useless for sequencing work. An Edge-case AAA issue and a journey-blocking A issue get the same "level A" label, and the team reasonably concludes the taxonomy is noise.

Our taxonomy uses four severity levels, defined by user consequence:

- **S1 — Blocked.** A user cannot complete the journey. Unusable date picker by keyboard, screen-reader-invisible error on a required field. Fix in the current sprint, no exceptions, however awkward the roadmap.
- **S2 — Hurt.** Completion is possible but disproportionately painful: focus order chaos, unlabeled-but-guessable controls, buried refund links. Scheduled within one quarter.
- **S3 — Unequal.** The task completes but the experience is lesser: missing skip links, unlabeled icon buttons in secondary flows, no reduced-motion respect on decorative animation. Batched into a focused remediation sprint.
- **S4 — Polish.** Deviations with minimal user impact, documented and folded into component refactors.

Every finding in the report carries a severity *from the user's perspective*, the WCAG criterion it maps to (for the lawyers and the procurement teams), the component it lives in, and the fix sketch. The discipline that makes this work: **severity is argued in the room while we still remember the journey**, never reassigned later by someone reading a spreadsheet cold.

## The report is a backlog, not a verdict

Our audit deliverable has three parts, in this order:

**Part one: the fix-forward roadmap.** The findings pre-digested into a sequenced plan — the quick structural wins (component fixes that heal hundreds of pages), the S1 journey repairs, the batched S3 sprint, the component-refactor items mapped onto the client's existing roadmap. Rough effort ranges, no false precision. This section exists because "here are 140 issues, good luck" is how audits die; "here are six weeks of work, here's the order, here's why" is how they live.

**Part two: the journey evidence.** Each critical finding as a story: the journey, the persona-with-constraint, the capture, the moment of failure. This is the persuasion layer — for the executives who fund remediation and the designers who'll own the fixes. Stories move budgets; criteria don't.

**Part three: the complete register.** Every finding, every criterion, every component — the thoroughness layer, machine-filterable, for the team that will actually do the work and the auditor who'll verify it. Important, and deliberately last, because registries are where attention goes to die.

The format insight that took us embarrassingly long to learn: **every finding must be written as a ticket the team would file for themselves.** Title in imperative mood ("Focus is lost when the date-picker modal closes"), reproduction steps, expected behaviour, suggested approach. Findings the team has to translate are findings the team will "get to later". If you design artefacts for a living, this is the same lesson as [good case-study writing](/journal/web-design/case-study-page-design): the artefact's job is to cause the next action.

## Re-testing: the ritual that makes it stick

Audits decay on contact with shipping software, which is why the engagement doesn't end at the report. Our closing rituals:

- **Verification pass at six to eight weeks.** We re-walk the journeys and score the register: fixed, regressed, or untouched. The verification report is deliberately short and brutally legible — a traffic-light table that goes to whoever funded the work.
- **Telemetry where it's honest.** You can't "measure accessibility" from analytics, but you can watch journey completion on assistive-friendly proxies (keyboard-heavy sessions, zoom users, error rates on remediated screens). In the Pylon Health remediation, first-attempt booking completion on keyboard-only sessions became a standing metric the client's team watched themselves — the point where accessibility stopped being our audit and became their product quality bar.
- **Capability transfer.** A half-day workshop for the client's team: how to run the keyboard pass, how to read the taxonomy, how to spot a regression in code review. The best outcome of any audit is making the next audit smaller. Teams that design accessibility in from the start — as we argue in [accessibility starts in the design file](/journal/web-design/accessible-design-handoff) — rarely need the 140-finding report at all.
- **A standing date.** Accessibility is repainted yearly or it fades. We put the re-audit on the calendar before we leave.

None of this is exotic. It's the ordinary craft of designing an audit like a product: scoped to users, written for its readers, measured by the change it causes. Which happens to be [how we approach everything](/approach).

If you're facing a procurement requirement, a Complaint You Can't Ignore, or just the growing sense that your product quietly excludes people — a scoped audit is typically a few weeks, fixed price. [Talk to us](/contact), or see [how engagements work](/pricing).

## Key takeaways

- Scope audits by journey with named human stakes, never by page count. Journey context is what makes severity meaningful.
- Automated sweeps find a minority of issues but are unambiguous, component-scale ammunition — and become permanent CI checks after remediation.
- Manual testing is a roster: keyboard-only, fluent screen reader, zoom/reflow, cognitive-load pass, with user sessions as deepening research.
- Triage by user consequence (Blocked / Hurt / Unequal / Polish), not WCAG conformance levels — with criteria mapped for legal needs.
- The report is a backlog: fix-forward roadmap first, story evidence second, complete register last; every finding written as a ready-to-file ticket.
- Verify at six to eight weeks, hand over capability, and put the re-audit on the calendar before you leave.

## FAQ

**How long does an accessibility audit take?**
For a typical marketing site or SaaS product — six to ten journeys — two to four weeks: a few days of automated and component sweeps, the bulk in manual journey testing, and a week on the roadmap and report. Deep red-flag areas (complex checkout, data-heavy dashboards) extend the manual phase more than they extend the automated one.

**Can we just fix the automated issues and be done?**
You'd fix the most visible minority of issues and, worse, generate a clean-looking score that reads as "done". Automated-only remediation is how organisations end up genuinely surprised by a complaint. Use the sweep for component-scale quick wins *while* the manual journey pass runs — then let the findings, not the tools, declare completion.

**WCAG 2.1 or 2.2 — which should we target?**
Target WCAG 2.2 AA. It's the current W3C recommendation, it's backwards-compatible in the ways that matter, and regulators increasingly reference it. The 2.2 additions (focus appearance, dragging alternatives, accessible authentication, target size) are all things that help everyone on a phone — the easiest business case in the specification.

**What's the single highest-leverage remediation most teams can do now?**
The keyboard-only pass on your three highest-traffic journeys, this week, with a stopwatch. It costs nothing but an afternoon, surfaces the majority of critical issues in most products, and its findings are trivially reproducible — which means they get fixed instead of debated. Then install automated checks in CI so nothing reintroduces them.
