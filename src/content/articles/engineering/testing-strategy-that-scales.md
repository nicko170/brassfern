---
title: "A testing strategy that ships: what to test, what to skip, what to delete"
description: "Our testing pyramid, rebuilt for reality: contract-first unit tests, a thin layer of Playwright journeys, flake budgets, and a CI bill we defend monthly."
slug: testing-strategy-that-scales
cluster: engineering
tags: [testing, playwright, vitest, ci, quality]
date: 2025-06-19
author: Tomás Reyes
keywords: [testing strategy, playwright e2e, vitest, ci quality, flaky tests, test pyramid]
readingTime: 11
---

Every codebase we've ever inherited tells the same story about its tests. Year one: enthusiasm, a pristine test pyramid, 80% coverage. Year two: the e2e suite takes forty minutes and fails on Tuesdays for reasons nobody can reproduce. Year three: engineers add `--skip-tests` to their mental muscle memory, and the test suite is a load-bearing ritual rather than a safety net. Coverage is high. Confidence is low.

The failure is never tooling. It's that the team never decided *what tests are for*, so tests accumulated like sediment — each one reasonable, the whole thing unusable.

This is the strategy we install on engagements and run on our own work: what we test, what we deliberately skip, what we delete on sight, and the budgets that keep the suite honest. It's the setup behind the [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild), where a finance product cannot ship a wrong number and also cannot wait an hour for CI.

## Decide what tests are for (write it down)

Our working definition, pinned in the repo before the first spec is written:

> Tests exist so that a squad can merge with confidence in under fifteen minutes, and so that when something breaks in production, we can point at the test that should have caught it — or consciously accept why none could.

Two consequences fall out immediately. One: CI duration is a product requirement, not an implementation detail — a suite nobody waits for is a suite nobody trusts. Two: every production incident ends with a question — *should a test have caught this?* Sometimes the answer is no, and that's a decision, not a gap.

## The pyramid, rebuilt for 2026

**Foundation — pure logic, tested ruthlessly.** Domain logic, formatters, validators, pricing calculations, state machines, date and currency handling: these get exhaustive unit tests in Vitest, including property-based tests with fast-check where the input space is wide. Money arithmetic gets property tests. Always. On Northwind Ledger, a fast-check seed found a rounding divergence between our totals function and the bank's statement renderer in week two — inputs no human would have typed (a refund of −0.005 against a boundary-amount credit). That class of bug never recurs, because the property test is now the contract.

**Middle — component contracts, not component internals.** With Testing Library, we assert what users perceive: given these props and this interaction, this accessible thing appears. We never assert class names, internal state, or component hierarchies. The heuristic we teach: if a refactor that changes zero user-visible behaviour breaks a test, that test was about the implementation and should be rewritten or deleted. This is where most suites drown — hundreds of specs pinning down JSX structure, all of them breaking when a designer swaps a `div` for a `section`.

**Top — a thin layer of real journeys.** Playwright against a production-like build, covering five to fifteen end-to-end journeys per product: signup-to-first-value, the checkout path, the one flow that would make the front page of the paper. These are expensive and flaky by nature, so we keep them few and make each one earn rent. Everything else in the gap between component tests and journeys is covered by API-level integration tests — hitting a real server with a real (test) database, no browser. They're ten times faster and catch most integration bugs e2e tests get blamed for.

**What we skip on purpose.** Snapshot tests of rendered markup (they produce approval-clicking, not confidence). Tests of third-party libraries' own behaviour. Coverage-chasing tests of trivial getters. And visual regression *in the same pipeline* — it runs, but in a parallel job that never blocks merge; design QA owns its failures.

## Flakes: the tax that kills suites

A flaky test is worse than no test. It trains the team that red means "re-run," and from there to "ignore" is two sprints. Our flake policy has teeth:

- **Any flake gets a same-day bisect.** If it can't be made deterministic within a working day, it's quarantined — moved to a nightly job with an owner and an expiry date. Quarantine is a hospital, not a retirement home: after two weeks unfixed, the test is deleted and a ticket captures the risk we're now carrying with our eyes open.
- **Flake budget, publicly tracked.** We report flake rate next to pass rate in CI. Above 2% of e2e runs failing-then-passing, we stop adding e2e tests until it's back under. You don't fix a leak by adding water.
- **The usual suspects, fixed structurally.** Time-of-day dependence gets a frozen clock in test setup. Animation-dependent assertions get `prefers-reduced-motion` forced in the e2e context — which, as a side benefit, means our [motion work](/journal/web-design/motion-that-earns-its-keep) is continuously verified against the reduced-motion path. Network races get route interception instead of `waitForTimeout`. A `waitForTimeout` in a PR gets the same review treatment as a `console.log`.

## The CI budget

We give CI a wallet: **ten minutes** for the merge-blocking pipeline, wall-clock, and we defend it like a [performance budget](/journal/engineering/core-web-vitals-field-guide) because it is one — for developer experience.

How the ten minutes get spent: lint and typecheck in parallel (2 min), unit + integration tests sharded across runners (6 min), build + smoke e2e journeys (8 min, overlapping). The full e2e matrix (multiple browsers, slow journeys) runs post-merge on a schedule; if it goes red, fixing it outranks feature work that day. Shard aggressively, cache dependencies and build artefacts, and — unglamorous but worth more than any of it — delete tests. A suite review where deleting is celebrated happens every quarter. Test count going *down* while incidents stay flat is a team getting sharper.

One more budget line people forget: the **CI bill in money**. When the compute invoice landed in the incident review for the first time we halved it in a fortnight — not by cutting coverage, but by making the matrix smarter (Chromium-only pre-merge; Firefox and WebKit nightly, because 94% of our caught browser-specific bugs surfaced there first).

## Coverage: measure it, don't worship it

Coverage is a smoke detector, not a fire rating. We keep it visible (a trend line, not a gate) and we care about exactly two signals: <70% line coverage on a *domain* package (someone's logic is untested), and dropping coverage on a file being actively changed (new logic is sneaking in untested). A global 85% gate produces exactly what you'd expect: tests written to satisfy the gate, in the easiest places, forever.

Mutation testing is the richer signal, and we run it monthly on the two or three packages where a wrong answer costs a client money — the pricing engine, the ledger maths. Stryker takes too long for CI but is perfect for a scheduled audit. It finds the tests that assert nothing, which are worse than missing tests because they lie in the coverage report.

## The incident loop

The strategy only compounds if incidents feed back into it. Our incident review always has a testing section with three possible outcomes: *add a test* (most common — at the lowest level that reproduces the failure), *accept the risk* (some things — a provider's webhook going sideways — are genuinely not testable economically; write the runbook instead), or *delete a test* (the test that should have caught it existed but asserted the wrong thing; fix the contract, not just the expectation).

Over a year this loop matters more than any individual decision in this article. A suite shaped by real incidents converges on testing what actually breaks, which is the only coverage metric that was ever real.

## Key takeaways

- Write down what tests are for: merge confidence in under fifteen minutes, and a learning loop from incidents. Everything else follows.
- Exhaustive unit tests for domain logic (property-based where inputs are wide), component tests against user-perceivable contracts, a thin layer of Playwright journeys, API integration tests for the gap.
- Flakes are a structural emergency: same-day bisect, quarantine with an expiry, public flake budget at 2%.
- Defend a ten-minute CI budget and a money budget; review the suite quarterly with deleting celebrated.
- Coverage is a trend line, not a gate. Mutation-test the packages where wrong costs money.
- Close the loop: every incident ends as add, accept, or delete.

## FAQ

**End-to-end before a feature ships, or after?**
Before, but only the golden path. We ship the happy-path journey with the feature, and grow failure cases at the cheaper layers (API, unit) in the weeks after — informed by what support and Sentry actually surface. Writing twenty e2e permutations on day one is how suites become 40-minute liabilities by day ninety.

**TypeScript makes tests less necessary, right?**
It makes *some* tests unnecessary — the "does this function receive the right shape" class, which is genuinely a large share of a poorly-typed codebase's suite. Good types let your tests focus on behaviour: correct totals, correct state transitions, correct accessibility. Types are the compile-time half of the strategy; the runtime half doesn't shrink, it sharpens.

**Should QA be a separate team?**
Not in our squads. Quality is a capability everyone carries — engineers write the layers above, product designers catch interaction regressions in review apps, and we embed one QA-minded engineer per squad who owns the flake budget and the incident loop. A separate QA gate is how you get two-week release trains and adversarial handoffs.

**How do you sell test investment to a client?**
In the unit they already understand: incident cost. We pull the last quarter's production incidents, price them at support-hours plus churn risk, and compare against the CI minutes and engineering time a working suite costs. On every engagement where we've run this exercise in the first sprint, the suite turns out to be the cheapest line in the budget. Our [approach page](/approach) covers how testing is built into fixed-scope sprints rather than billed as overhead.

**What about testing AI features — LLM outputs are non-deterministic?**
Different discipline entirely: evals, not assertions. We test the harness around the model (prompt assembly, retrieval, guardrails, fallback behaviour) deterministically, and evaluate the model's output against graded rubrics on a schedule. That's covered in depth in our AI cluster, including how we keep eval sets honest. See [shipping LLM features](/services/ai) for the shape of the work.
