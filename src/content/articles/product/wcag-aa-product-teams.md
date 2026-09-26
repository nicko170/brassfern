---
title: "WCAG AA for product teams: the parts everyone gets wrong"
description: "The WCAG AA criteria that fail most often in real products — contrast in components, focus visible, target size, keyboard traps — and the review rituals that keep them green."
slug: wcag-aa-product-teams
cluster: product
tags:
  - accessibility
  - WCAG
  - product design
  - design review
date: 2025-07-29
author: Nate Sullivan
keywords:
  - wcag aa
  - accessible product design
  - inclusive design
  - accessibility review
readingTime: 9
---

Most product teams we meet have the same accessibility posture: genuine intent, an audit report from two years ago, and a quiet hope that the component library is handling it. Then we run our [accessibility audit process](/journal/product/accessibility-audit-process) on the product and find the same criteria failing, in the same components, for the same structural reasons. WCAG 2.2 AA isn't secret knowledge — but it has a failure pattern, and the pattern is remarkably consistent across B2B SaaS, health platforms and everything in between.

This is that pattern: the criteria that actually break in real products, why they break, and the rituals that keep them green. (Strategy, language and the upstream design habits are covered in [inclusive design beyond the checklist](/journal/web-design/inclusive-design-beyond-checklists); this piece is the criteria-level field guide.)

## The five that fail everywhere

**1. Contrast (1.4.3) — in components, not brand palettes.** Every team checks their brand colours; almost nobody checks the states. The failures live in: disabled-button text on tinted backgrounds, placeholder text (which still matters when it's doing a label's job), chart secondary series, badge text on tinted pills, and the muted metadata caption that's `#9aa48e` on a slightly-off-white card. AA demands 4.5:1 for normal text, 3:1 for large (24px+/18.66px bold). Our rule: contrast is checked per *component state*, in the design file, before a component enters the system — the same gate described in [accessibility starts in the design file](/journal/web-design/accessible-design-handoff). Palette-level approval is theatre; state-level approval is compliance.

**2. Focus visible (2.4.7) — styled away on purpose.** Somewhere in every product's history, someone typed `outline: none` to make a demo screenshot cleaner, and no design system ever restored it systematically. AA requires a visible focus indicator — WCAG 2.2 strengthened this with size and contrast minimums (2.4.11/2.4.13 levels aside, 2.4.7 remains the operative AA). The design answer isn't the browser default ring; it's a *designed* focus style: a two-pixel offset ring in a colour that meets 3:1 against adjacent backgrounds, specified per surface (light, dark, image) and treated as a first-class component state. If your design system's button spec has four states and none of them is focus, the system is the bug.

**3. Target size (2.5.8) — the new one everyone misses.** WCAG 2.2 added minimum pointer target size at AA: 24×24 CSS pixels, with spacing exceptions. It fails constantly in icon-dense toolbars, tag-remove buttons, close icons on chips and toasts, and inline links inside table actions columns. Our design floor is higher — [44px with separation](/journal/web-design/inclusive-design-beyond-checklists) — but the *compliance* floor is 24, and a remarkable number of "passed" audits predate the criterion. Check the date on your audit; if it's before the 2.2 adoption in your stack, target size has never been tested.

**4. Keyboard operability (2.1.x) — custom widgets with no keyboard story.** Modals that don't trap or return focus, custom dropdowns reachable by mouse only, drag-only reordering, infinite scroll with no way to reach the footer, and the classic: a "click outside to close" behaviour with no Escape handler. The criterion is simple — everything operable by keyboard, no traps — and the failures concentrate wherever the team built a custom widget the design system didn't cover. Our fix is procedural: [keyboard behaviour is spec'd per component](/journal/engineering/keyboard-first-interfaces) with focus paths and named recovery targets, so engineers never improvise interaction models.

**5. Name/Role/Value (4.1.2) — the invisible one.** Icon buttons with no accessible name ("button"), custom toggles that announce nothing, live-region status updates that never reach a screen reader. This criterion fails silently because nothing *looks* wrong — the audit tool flags some of it, but automated scanners catch under half of real-world WCAG failures, and the rest surface only with an actual screen reader pass. One VoiceOver journey through the happy path per sprint, as a standing habit, finds more than a quarter's worth of automated scanning.

## Criteria teams over-worry, and one they under-worry

Over-worried: images of text (rare in products), audio descriptions (rare in B2B), and colour-hue memorisation games in charts, which matter but are solvable with direct labels and patterns. Under-worried: **error identification and suggestion (3.3.1, 3.3.3)** — errors announced as text, tied programmatically to the field, with a correction suggestion where one exists. "Invalid" in red fails twice over; "Date must be DD/MM/YYYY — try 03/04/2026" passes and helps everyone. The rhetoric lives in [error messages that de-escalate](/journal/product/error-messages-that-help); the compliance hook is that accessible error design is *also* the conversion-optimal error design, a rare free lunch.

## The rituals that keep AA green

Audits decay; rituals don't. Four that work:

**Component-state gate in design review.** No component enters the system without its contrast-checked states, its designed focus ring, its keyboard contract and its accessible name. Compliance becomes a property of the palette and the parts library, not a project of the quarter.

**Thirty-minute Friday keyboard sweep.** One designer, one engineer, no mouse, through the screens touched that sprint. Findings are filed like visual bugs — because they are.

**One screen-reader journey per sprint.** VoiceOver on iOS or NVDA on Windows, the happy path, actually running, someone narrating aloud. The first time a team hears their own product announce "button, button, button" for thirty seconds, the roadmap re-prioritises itself. Empathy is a poor process substitute — but it's an excellent consequence of a good one.

**A living known-issues register.** Accessibility debt happens; pretending otherwise produces quiet dishonesty that spreads. A register — issue, criterion, severity, plan — makes the debt visible and payable, and it's what an honest VPAT conversation looks like. The register shrinks or management sees why not; either is a healthy outcome.

## What AA doesn't cover — say so honestly

AA compliance is a floor with known gaps: cognitive load, language plainness, motion sensitivity beyond the animation-from-interactions criterion, the lived experience of a switch-control user versus a standards-conformant one. We design past AA on these and we say so, because the alternative — presenting a passed audit as proof of an inclusive product — is the kind of overclaim users with disabilities have learned to discount on sight. Compliance is what you owe the lawyer; the rest is what you owe the user.

## Key takeaways

- The five chronic failures: contrast in component *states*, designed focus indicators, 24px target size (new in 2.2 — check your audit's date), keyboard operability of custom widgets, and name/role/value on icon buttons and custom controls.
- Automated scanners find less than half of real failures; one actual screen-reader journey per sprint is the highest-yield accessibility habit available.
- Error identification (3.3.1/3.3.3) is the under-worried criterion, and fixing it improves conversion for everyone.
- Rituals beat audits: component-state gates, Friday keyboard sweeps, sprint screen-reader journeys, and an honest known-issues register.
- Say where AA ends; the credibility of the whole program rests on not overclaiming the badge.

## FAQ

**We're on WCAG 2.0 or 2.1 — do we need to move to 2.2?** Yes, and it's cheaper than you fear: 2.2 adds nine criteria, mostly tightening focus and input assistance, and removes one (4.1.1 parsing). If your component state gates already exist, the delta lands mostly in target size and focus visibility — weeks, not quarters.

**Does AA compliance protect us legally?** It's the defensible baseline in most jurisdictions and procurement regimes, but legal exposure varies — treat this as design guidance, not legal advice, and have counsel review your posture where it matters. The register and rituals are exactly the evidence trail counsel asks for first.

**Our component library claims AA out of the box. Are we covered?** You're covered for the components, in their default states, on the day the claim was written. Themes, overrides, custom extensions and composition are yours. Verify with the rituals; library claims are a starting deposit, not a balance.

**How do we prioritise remediation on a legacy product?** By user-path criticality, not by issue count: the signup, the pay flow, the core task, then the rest. Twenty contrast fixes on the checkout matter more than two hundred in the settings maze, and sequencing by path keeps the program visibly meaningful to the people funding it.

**Should we aim for AAA anywhere?** Selectively, where it's cheap and user-dense: 7:1 contrast on body copy, generous targets, no timing on essential flows. Declaring sitewide AAA is usually performance; hitting AAA *where users actually live* is craft.
