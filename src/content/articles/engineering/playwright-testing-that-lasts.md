---
title: "Playwright suites that survive the redesign"
description: "How to write browser tests against intent, not pixels: accessible locators, honest page objects, visual diff quotas, and keeping the whole suite under ten minutes."
slug: playwright-testing-that-lasts
cluster: engineering
tags:
  - testing
  - playwright
  - quality
  - developer-experience
date: 2026-02-11
author: Tomás Reyes
keywords:
  - playwright testing
  - browser testing strategy
  - e2e test architecture
  - testing best practices
  - visual regression testing
readingTime: 9
---

Every agency inherits, at least once, the graveyard suite: four hundred end-to-end tests, eleven of which pass, none of which anyone trusts, all of which die properly in the next redesign. The tests were not bad when written. They were written against the wrong thing — against selectors, against pixel coordinates, against the day's DOM — and the interface moved on without them.

The suites that survive are written against **intent**: what the user is trying to do, expressed in terms the user could recognise. This is how we build Playwright suites that outlast redesigns, refactors and at least one rebrand, and that stay fast enough to run on every pull request.

## The first law: locate by role, not by shape

The single highest-leverage decision in browser testing is how you find elements. The hierarchy we enforce:

1. **Role and accessible name** — `getByRole('button', { name: 'Add to cart' })`
2. **Label** — `getByLabel('Email address')`
3. **Visible text** — `getByText('Checkout')`, used sparingly
4. **Test ID** — `getByTestId('cart-summary-total')`, for genuinely un-nameable regions
5. **CSS or XPath** — never, without a comment explaining why

This is not puritanism, it is alignment. When a redesign moves the checkout button from the sidebar to a sticky footer, a role-based locator does not care. The button is still a button; it still says "Checkout". The test passes, correctly, because the *intent* survived.

Notice what else this buys: a suite that cannot pass on an inaccessible page. If the button has no accessible name, the test cannot find it either. Your testing strategy and your [accessibility work](/journal/product/accessibility-audit-process) become the same work, each reinforcing the other. We have caught genuine accessibility regressions — a label unhooked from its input, a dialog missing its role — as test failures before an audit ever ran.

When the design genuinely removes a button, the test *should* fail, and the failure message should read like a user complaint: "could not find the Add to cart button". That is a failure a human can triage in seconds. "Selector `.btn-primary-cta-v2` not found" is a failure someone forwards to the original author, who left the company in 2024.

## Page objects: earn the abstraction or skip it

The Page Object Model is the most cargo-culted pattern in browser testing. Done badly — one class per page, mirroring the DOM, three hundred lines of locator getters — it doubles maintenance and hides intent behind indirection.

Our rule: **a page object must pay rent**. It earns its place when it captures a workflow that recurs across many tests, and it should express user-level actions, not element access:

```ts
// Good: an action a user would recognise
await cartPage.applyDiscountCode('WELCOME10')
await checkoutPage.completeWithTestCard()

// Bad: DOM plumbing wearing a suit
await cartPage.discountInput.fill('WELCOME10')
await cartPage.discountSubmitButton.click()
```

The good version absorbs redesigns: the discount field may move, become a disclosure, live in a modal — the method name stays true. The bad version is a CSS selector with extra steps.

For most flows, we skip page objects entirely and use small helper functions around shared setup: seed a cart, log in a fixture user, freeze the clock. Playwright's fixtures handle the wiring elegantly. Page objects enter only when a screen has real, reusable complexity — the seat map, the multi-step form — and then they model behaviour, never markup.

## Fixture data that does not rot

Tests fail for a thousand boring reasons, and stale data is most of them. The discipline that keeps suites green:

- **Seed, don't assume.** Every test that needs a product creates the product through an API fixture at setup. Tests never depend on demo content someone might edit, rename or delete.
- **Deterministic clocks.** Freeze time for anything touching dates — subscription renewals, "ships by Friday" copy. Playwright's clock API made this a one-liner; before that it was the source of the flakiness everyone blamed on the network.
- **Isolate per worker.** Parallel tests sharing a user account trip over each other's sessions and carts. Each worker seeds its own tenant, user or namespace.
- **Clean up cheaply.** Soft-delete or archive seeded data in teardown. A staging environment bloated with ten thousand test orders eventually slows every test that runs against it.

This setup work is where suite longevity actually lives. Locators get the conference talks; fixtures get the 2am pages.

## Visual regression: a quota, not a blanket

Screenshot diffing is the tool teams reach for first and regret first. Full-page screenshots diff on font rasterisation, sub-pixel anti-aliasing, animation frames, dynamic dates, and the phase of the moon. The suite becomes a noise generator, and noise teaches teams to click "approve all" — which is worse than no visual testing, because it looks like rigour.

We still use visual diffs, under a strict quota system:

- **A numbered budget.** This project gets fifteen visual tests. Adding the sixteenth means arguing for removing one. Scarcity forces the question "what pixels actually carry business risk?"
- **High-stakes, high-stability screens only.** The checkout summary. The pricing table. The invoice. Screens where a silent style regression costs money or trust — and that are static enough to diff honestly.
- **Masked and frozen.** Dynamic regions (dates, avatars, recommendations) are masked; animations are disabled; fonts are pinned. A visual test must fail only when a human would agree something changed.
- **Component-level over page-level.** Diffing a rendered component in isolation — the same instinct behind good [design tokens work](/journal/web-design/colour-systems-dark-mode) — removes layout noise and points the finger precisely.

Everything the quota excludes is covered by intent-level assertions: the price is visible, the tax line exists, the total matches the sum. Computed style checks (`toHaveCSS`) cover the rare case where a specific style is a contractual requirement, like brand colours on a partner logo.

## The ten-minute budget

A suite that takes forty minutes does not run on every pull request; it runs "later", and "later" is where failures go to be merged around. We hold a hard budget: **the full PR suite finishes in under ten minutes**, including build and setup. The tactics, in order of impact:

1. **Parallelism and sharding.** Playwright scales horizontally almost for free. CI shards by file; workers are cheap; wall-clock time is expensive.
2. **Reuse auth state.** Log in once per worker via API, serialise the storage state, skip the UI login in every test but the one that tests login.
3. **API setup, UI assertion.** Drive setup through fast API calls; reserve the browser for what the test claims to verify.
4. **The tier split.** A small smoke tier — the five flows that must never break — gates merges. The full suite runs on merge to main. Scheduled nightly runs cover exotic browsers and viewports.
5. **Quarantine, don't tolerate.** A flaky test gets 48 hours of quarantine with an owner attached, then it is fixed or deleted. A suite that cries wolf trains everyone to ignore the wolves.

Tie the budget to something the team already protects. Ours sits in the same CI file as our performance budgets from the [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide) — both are promises about what "done" costs, and both decay the moment nobody is looking.

## What survived the redesign

The proof came on a retail client whose storefront we rebuilt and then reskinned fourteen months later — new grid, new type, new checkout layout, same flows. The suite: 112 tests, median run 7 minutes 40 seconds.

- 89 tests passed against the reskin with **zero changes**. They were written against roles, labels and workflows; the reskin was honest about preserving behavior, and the tests noticed nothing because nothing that mattered changed.
- 17 tests legitimately failed and caught real regressions: a discount field that lost its label association, a confirmation step that no longer announced itself to screen readers, a cart that silently dropped persistence on mobile. Found in CI, not in production.
- 6 tests needed updates because the *intent itself* changed — the checkout genuinely went from three steps to two. Rewriting those took an afternoon, and the diffs read like product decisions, which they were.

That is the test of a suite, literally: when the redesign ships, does the suite distinguish "the pixels moved" from "the product broke"? Ours did, because it was never testing pixels in the first place. The same philosophy shaped the storefront behind the [Fernleigh Wines case study](/work/fernleigh-wines-dtc-storefront), where checkout intent had to survive both a replatform and a rebrand.

## Key takeaways

- Locate elements by role and accessible name. Tests that can only pass on accessible pages are two quality programs for the price of one.
- Page objects must pay rent: model user-level workflows, or use small fixture helpers instead.
- Seed your own data, freeze time, isolate workers. Most "flakiness" is fixture rot.
- Visual regression is a numbered quota — high-stakes, static, masked screens only. Blanket screenshotting produces noise and noise produces "approve all".
- Ten minutes or it doesn't gate. Parallelise, reuse auth, tier the suite, quarantine flakes with an owner and a deadline.
- Write failures that read like user complaints. Future you, triaging at midnight, says thanks.

## FAQ

**How many end-to-end tests should a product have?**
Far fewer than unit tests, and more than zero. Our rule of thumb: cover every flow whose breakage loses money, trust, or data — usually 30 to 120 tests for a mid-size product. Everything else belongs in faster layers of the pyramid. If the number grows past what the ten-minute budget holds, you have a prioritisation problem, not a coverage problem.

**Should tests run against production?**
A tiny smoke tier, yes — three to five read-only checks after every deploy (the homepage loads, the API responds, checkout renders in preview mode). Never mutating flows against real production data. The full suite belongs on staging with controlled fixtures.

**How do we test third-party integrations like payments?**
Against the provider's sandbox with their test cards, in a small number of tests that verify *your* behaviour: the pending state, the failure state, the confirmation. Don't test Stripe's rendering; test that your app reacts correctly to each outcome. Contract-level mocks cover the daily suite; sandbox tests run nightly.

**What makes a test flaky, really?**
In order of frequency we've observed: dependence on shared state, reliance on timing instead of assertions (`waitForTimeout` is a confession), animation races, and data that changed under the test. Fix by attacking those causes, not by adding retries. Retries on the main suite are a smoke machine over a fire.

**When is it worth rewriting a legacy suite?**
When the triage cost of failures exceeds the cost of rewriting against intent — usually recognisable when the team's response to a red build is "run it again". Rewrite incrementally: protect the ten most critical flows first with role-based tests, quarantine the old suite to nightly, and let it shrink in place. If you want a second pair of eyes on that plan, it is exactly the kind of thing we untangle in a [discovery sprint](/journal/playbooks/discovery-sprint-playbook).
