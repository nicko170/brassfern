---
title: "Inclusive design beyond the checklist"
description: "Inclusive design past WCAG audits: inclusive language in UI copy, cognitive load budgets, SPA focus management, touch targets, and a critique criterion that sticks."
slug: inclusive-design-beyond-checklists
cluster: web-design
tags:
  - Accessibility
  - Inclusive design
  - UX writing
  - Interaction design
date: 2025-08-12
author: Hannah Yeo
keywords:
  - inclusive design
  - wcag aa
  - focus management
  - accessible ux
readingTime: 9
---

Every studio says it cares about accessibility. The tell is *where* it lives in the process. If accessibility arrives as a QA ticket three days before launch — a spreadsheet of colour-contrast failures and missing alt text — then it was never design; it was remediation. The checklist gets done, the score turns green, and the site is still exhausting for a dyslexic reader, still bewildering for a first-time screen-reader user, still written in a voice that assumes everyone went to the same university.

This is how we push inclusive design upstream at Brassfern: four practices that sit in the design phase, plus one process change that makes all of them stick. And yes, WCAG AA is the floor — we [audit against it properly](/journal/product/accessibility-audit-process) — but the floor is not the house.

## 1. Inclusive language is a copy problem, not a compliance problem

Words exclude before pixels do. Most exclusionary UI copy is invisible to the team that wrote it, because it matches how the team talks. The patterns we hunt in every copy review:

**Ableist defaults dressed as friendliness.** "Oops, looks like you goofed!" punishes someone for a form error that was probably our validation's fault. "Just click below" — *just* is the most ableist word in product copy, because it declares the task easy before the user has attempted it. Cut "just", "simply" and "easy" from every string and the interface immediately stops grading its users.

**False universals.** "Everyone knows their order number" — no, everyone *in this meeting* knows where the order number lives. Culturally specific metaphors (penalty shootouts, home runs) quietly tell international users the product wasn't thinking of them. We maintain a per-project substitution list: banned phrases and their replacements, enforced the same way a [brand voice guide](/journal/brand) is enforced — in review, with examples, not vibes.

**Error copy that admits fault.** "Invalid input" is an accusation. "That date's in DD/MM/YYYY order — try 14/03/2026" is a hand held out. The full pattern language is in our piece on [error messages that de-escalate](/journal/product/error-messages-that-help); the inclusive-design point is that blame-shifting copy lands hardest on users already fighting the interface hardest.

## 2. Cognitive load budgets

Screen readers and keyboard traps are visible in audits. Cognitive load is not, and it excludes at scale: people with ADHD, anxiety, low literacy, second-language readers, and everyone using your site at a bus stop in glare at 7am. We assign each key screen a **cognitive load budget** the way we assign performance budgets — a hard cap, reviewed in critique:

- **One decision per screen.** If a screen asks two questions ("choose a plan" *and* "how did you hear about us"), one of them moves. The [onboarding work for Brightmarsh](/work/brightmarsh-onboarding) cut completion drop-off by a third largely by unbundling double-decision screens.
- **Seven visible choices maximum at any decision point** — and seven is a ceiling for navigation, not a target; three to five is where comprehension stays near-total. Past it, people stop comparing and start guessing.
- **Reading grade under 9 for transactional copy.** Not because your users can't read above it, but because nobody's best reading happens on a phone with 12% battery. Plain language is a cognitive accessibility feature that everyone uses.
- **No unannounced state changes.** Content that rewrites itself live — totals updating, items vanishing, a countdown restarting — is disorienting for screen-reader users (unless it's politely announced) and for anyone whose attention model of the page just got invalidated. Changes happen on user action, or they're announced, or they don't happen.

The budget framing matters politically: "this screen exceeds its load budget" is a shippable-not-shippable statement. "I worry this might be overwhelming" is an opinion that loses to a deadline.

## 3. Focus management for single-page apps

The classic accessibility failure of the SPA era: the URL changes, the view swaps, and focus stays on the now-unmounted button. A keyboard user is left holding a focus ring attached to nothing; a screen-reader user hears silence and has to explore blindly to discover the page changed at all. Design owns this problem, because it's a question of *where attention should go* — engineering just implements the answer:

- **On route change, focus moves to the new page's H1** (`tabindex="-1"`, not focusable by tab). The heading announces itself, the user knows where they landed, and the tab order starts clean. Document this per route, in the design spec.
- **On modal open, focus moves to the first meaningful element,** gets trapped inside, and returns to the trigger on close. All three behaviours are designed states, not library defaults you hope for.
- **Deleting things needs a designed landing spot.** When a user removes a list item they were focused on, focus must go somewhere sensible — the list heading, or the next row. The default is a reset to `body`, which for keyboard users means starting over from the skip link. We spec a "focus recovery target" for every destructive action, the same way we spec empty states.

Our [keyboard-first engineering notes](/journal/engineering/keyboard-first-interfaces) cover the implementation; the point here is that none of it happens unless someone designs the destination of attention.

## 4. The physical layer: targets, reach and tremor

WCAG 2.2's 24×24 CSS pixel minimum is a floor for mouse precision, not a thumb standard. Our design floor is **44×44px touch targets with 8px of separation** — the comfortable thumb spec — and we audit the real troublemakers: icon buttons snugged together in card corners, close icons on toasts, inline text links inside dense legal paragraphs, and the "×" on tags and chips that designers draw at 14px because it looks tidy.

Reach matters as much as size: on a 6.7-inch phone the top quarter of the screen is a stretch for one-handed use, and a stretch with a tremor or limited grip is a miss. Primary actions belong in the bottom half. This is one reason we favour [bottom tab bars for products](/journal/web-design/navigation-that-survives-mobile) — it's not just thumbs, it's the entire population of people holding a pram, a rail, or a coffee.

## 5. Make it a critique criterion

The process change that makes the other four survive contact with deadlines: **accessibility is a standing agenda item in design critique, not a pre-launch audit.** Every crit includes the same four questions: What does this assume about the user's body? What does it assume about their attention? What does it assume about their language? Where does focus go? The work can't leave critique with an open answer to any of them — the same way it can't leave with an unknown empty state.

Two supporting habits keep it honest. First, **test with the setting on, not the checklist open**: designers spend one session per sprint using the build with keyboard only, and one with a screen reader actually running, the way we make them use real [reduced-motion settings](/journal/web-design/motion-that-earns-its-keep) rather than reading the media query and nodding. Second, diverse review beats exhaustive review: a forty-minute session with one user who navigates by switch control teaches more than a hundred-item audit spreadsheet, and it changes how the room argues forever after.

The line we use with clients: compliance is what accessibility owes lawyers; inclusion is what it owes users. We build for the second and get the first for free.

## Key takeaways

- Inclusive language lives in copy review: ban "just" and "simply", purge false universals, and make error copy admit fault. Keep a substitution list and enforce it like a voice guide.
- Give key screens cognitive load budgets — one decision per screen, ≤7 choices at any fork, transactional copy under reading grade 9 — and treat overruns as shippable/not-shippable.
- Design where focus goes: to the H1 on route change, into and back out of modals, and to a named recovery target after destructive actions.
- 44×44px with 8px separation is the real touch floor; primary actions live in reach, in the bottom half of the screen.
- Accessibility earns its place as a standing critique criterion — four questions every session — and survives by testing with settings on, not checklists open.

## FAQ

**Isn't WCAG AA enough for most projects?** WCAG is necessary and insufficient. It says nothing about reading grade, cognitive load, blame in error copy, or whether a screen-reader user can actually complete a happy path versus merely perceive every element. AA compliance plus the four practices above is the honest bar.

**How do you sell inclusive design to a skeptical stakeholder?** Don't sell it as ethics alone — sell the overlap. Plain language converts better. Bigger touch targets get tapped more. Single-decision screens complete more. Almost nothing in this article costs a conversion; most of it buys some.

**What should we test screen-reader journeys with?** The real stack your users have: VoiceOver on iOS (majority of mobile screen-reader use), NVDA on Windows for desktop, TalkBack second on Android. One announced journey through the happy path beats an automated scan by an order of magnitude.

**When in the sprint do inclusive practices land?** Copy and load budgets at wireframe, focus behaviour at interaction spec, targets at visual design, critique questions every week. Anything discovered in QA is a design debt with interest — the fix is ten lines of code against ten screens of layout.

**Do you run dedicated accessibility sprints?** Occasionally, to pay down inherited debt on legacy projects — but a dedicated sprint is a debt collector, not a strategy. The strategy is the standing critique criterion: prevention is consistently cheaper than the remediation loop.
