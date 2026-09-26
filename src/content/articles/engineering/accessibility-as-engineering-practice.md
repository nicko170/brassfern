---
title: "Accessibility is an engineering discipline, not a ticket queue"
description: "Treating accessibility as infrastructure: axe in CI, linting, component contracts, keyboard hierarchies, and who on the squad owns what. WCAG AA as a floor."
slug: accessibility-as-engineering-practice
cluster: engineering
tags: [accessibility, wcag, engineering practice, design systems, ci]
date: 2025-10-02
author: Felix Brandt
keywords: [accessibility engineering, wcag aa, axe ci, a11y automation, accessible components, inclusive engineering]
readingTime: 11
---

There's a shape of accessibility work most teams will recognise: a quiet product, a looming launch or legal notice, one frantic "a11y audit," a Jira epic full of tickets labelled *critical*, and a burn-down chart that reaches zero in a blaze of heroic, repetitive fixes. Six months later the same audit finds most of the same bugs back, wearing new components as camouflage.

The problem isn't care. It's the model. Accessibility done as a ticket queue treats symptoms one at a time; accessibility done as engineering treats causes — the components, the checks, and the ownership that produce the symptoms. If your date picker is inaccessible, no quantity of tickets about *this page's* date picker will save you. Fix the component and every page is fixed. That's the whole argument, and the rest of this article is how we operationalise it.

We run this discipline on every engagement, but it crystallised on [Pylon Health's telehealth flow](/work/pylon-health-telehealth-flow), where the audience includes people booking care while anxious, distracted, or using assistive tech under time pressure — and on the [Postcards archive](/work/postcards-museum-archive), a public-collection site where keyboard and screen-reader access isn't a compliance checkbox but the product itself.

## Layer one: the component library is the battleground

Roughly 80% of the accessibility defects we find in audits aren't page bugs. They're component bugs repeated across pages. So the highest-leverage move is to make the shared components *correct by construction*, and define "correct" in writing as a **component contract** — a document, per component, that states:

- **Keyboard behaviour.** Which keys do what, in what order, matching the relevant ARIA Authoring Practices pattern. A disclosure: `Enter`/`Space` toggles, focus stays put, `aria-expanded` mirrors state.
- **Focus management.** Where focus goes on open, on close, on deletion, on error. (The modal that returns focus to the trigger is table stakes; the surprising number of modals that strand focus in the removed DOM node is not.)
- **Naming.** How the accessible name is computed — visible label preferred, `aria-label` as the documented escape hatch, never invented inside with no ability to override.
- **State exposure.** `aria-expanded`, `aria-selected`, `aria-current`, `aria-invalid` — listed explicitly, tested explicitly.

Contracts get tests. Not vague "has no violations" tests — assertions: tabbing into the listbox puts focus on the selected option; pressing `Escape` closes and restores focus; the accessible name equals the visible text. Our [testing strategy](/journal/engineering/testing-strategy-that-scales) covers where these specs live in the pyramid; the short version is that they're component tests, they run fast, and they break when someone refactors the behaviour out.

The payoff is compounding. On Pylon Health, the booking flow has seven steps and fourteen distinct form patterns; every one of them inherits the same validated, annunciated, keyboard-complete field components. A new engineer can build a new step in an afternoon and ship it screen-reader-correct without having read WCAG once — because reading WCAG once is exactly what the component author already did.

## Layer two: automation — the reliable 40%

Automated checkers catch roughly 30–40% of WCAG conformance issues. That's not an indictment; it's a reason to catch that 40% for free, continuously, and spend human attention on the rest.

Our three automated gates, in order of increasing cost:

1. **Linting.** `eslint-plugin-jsx-a11y`, configured strict from day one — it's far cheaper to never write the lint violation than to remediate it. Autofixable rules (missing `htmlFor`, redundant roles) get fixed on save.
2. **axe in CI.** axe-core runs against every page in the prerender/build pipeline and inside component tests (`toHaveNoViolations()` on each render state — open, closed, error, loading; a button in one state is not a tested button). Rules tuned per project, with every disabled rule carrying a comment and a reviewer signature. A disabled rule with no reason attached fails review.
3. **Contrast and structure checks on the design side.** Tokens can't ship below-contrast pairings — we verify semantic colour pairs against WCAG ratios in the token build, which connects neatly to the [token pipeline](/journal/engineering/design-tokens-pipeline). If `text.muted` on `surface.sunken` falls under 4.5:1, the pipeline refuses. Designers still own the *pairing choices*; the build just guarantees the maths.

## Layer three: the manual work automation can't touch

Everything axe misses is the stuff that actually determines whether a disabled person can use the product. We budget for it explicitly — it's line items, not spare time:

- **Keyboard walkthroughs.** Every new flow gets a full keyboard pass, no mouse allowed, recorded. Focus order follows reading order; no traps; skip links where nav is heavy.
- **Screen-reader passes.** VoiceOver + Safari and NVDA + Chrome on the critical journeys each release. Not exhaustive combing — the journeys that matter, done properly, with the recording attached to the PR.
- **Reduced motion, zoom, and contrast preferences.** `prefers-reduced-motion` isn't a nicety; vestibular disorders make parallax a genuine hazard. Our motion tests assert the reduced path in CI, and design owns the [fallback choreography](/journal/web-design/motion-that-earns-its-keep) as a first-class deliverable.
- **Content checks.** Alt text quality (not presence — *quality*), heading outlines that read like a table of contents, and link text that survives being pulled out of context. "Learn more" twelve times on one page is an accessibility bug with good grammar.

When teams tell us manual testing is expensive, the honest answer is: it's cheaper than remediation, and most of the cost is in *finding* issues late, which automation plus correct components steadily removes.

## Ownership: who carries it

The failure mode of "accessibility is everyone's job" is that it's no one's job. We distribute it deliberately:

- **Design** owns contrast pairings, focus-visible styling (which engineering must never remove), reduced-motion choreography, and the annotated keyboard/focus specs in Figma. Our piece on [accessibility starting in the design file](/journal/web-design/accessible-design-handoff) covers that half in depth.
- **Engineering** owns component contracts, automated gates, and semantic correctness in markup.
- **Content** owns alt text, heading structure, and plain language.
- **One person wears the armband.** Each squad has an accessibility lead — not a gatekeeper, an editor. They run the monthly assistive-tech sweep, triage what automation flags, and decide which issues block release versus which get a dated ticket. A named human, rotated quarterly so the knowledge spreads instead of concentrating.

And a note on overlays: no. A third-party accessibility overlay injected over an inaccessible product is a sticking plaster that *also* breaks things — it interferes with real assistive technology, fools nobody who relies on it, and has not, to our knowledge, persuaded a single court. Build it correctly. It's genuinely cheaper.

## Measuring the discipline

What gets measured gets funded. Three numbers travel to leadership:

- **Violation trend per release** (axe counts, by severity, per template). This should fall and stay fallen — the "stay" is what distinguishes engineering from ticket queues.
- **Contract coverage**: what share of the shared component library has contracts with passing tests. Target 100% of interactive components; it takes a quarter, not a year.
- **Time-to-fix when something slips.** If the components are right, most regressions are one-line fixes in one place. That speed *is* the return on the discipline.

## Key takeaways

- Accessibility fails as a ticket queue because it fixes symptoms. Fix components and the pages inherit the fix.
- Write component contracts — keyboard behaviour, focus management, naming, state exposure — and test them like API contracts.
- Automate the reliable 40%: strict linting, axe in CI per render state, contrast verified at the token build.
- Budget the manual work: keyboard walkthroughs, screen-reader passes, reduced motion, content quality. It's cheaper than remediation.
- Ownership is explicit: design, engineering, and content each hold a piece; one named lead per squad carries the armband, rotated.
- Never ship an overlay.

## FAQ

**We need WCAG AA for a government contract. Where do we start?**
With your shared components and your critical journeys, in that order — not with a page-by-page audit of everything. An audit tells you where you are; contracts and automation change where you're *going*. Do the audit (you'll need it for an ACR/VPAT anyway), but run the remediation through the component layer or you'll be re-auditing the same bugs next year.

**Does AA compliance constrain the design?**
It constrains bad habits, not ambition. Strong focus states, honest contrast, visible affordances — these correlate with *better* design, and some of the most awarded sites we've shipped are fully AA. What AA rules out is typography at 12px light grey on white, and nothing of value was lost.

**What's the actual cost difference between building accessibly and remediating?**
Across our engagements, remediating a mature product to AA runs three to five times the cost of having built it accessibly — and remediation misses the compounding benefit, because the next feature built on inaccessible components restarts the debt. The cheapest moment to care is when the component is first written.

**Which screen readers do we test with?**
VoiceOver with Safari (the most common pairing for blind users on Apple devices, which dominate the demographic), NVDA with Chrome on Windows, and TalkBack spot-checks on Android for mobile-heavy products. JAWS matters in enterprise and government procurement contexts; test it there. Perfect coverage across every pairing isn't the goal — correct semantics that all tools interpret reliably is.

**Our design system is third-party. Are we stuck?**
No, but you're beholden. Audit the vendor's components against contracts before adopting — focus traps in their modal are your focus traps. Prefer libraries with documented, tested ARIA patterns (headless primitives are usually the safest base), and wrap them so your contract layer still applies. We've walked clients off pretty-but-broken vendors more than once; the [product practice](/services/product) includes that assessment in the first sprint.
