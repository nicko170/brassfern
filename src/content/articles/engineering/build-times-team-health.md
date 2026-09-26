---
title: "Build times are a team-health metric"
description: "Build time as a team-health metric: profiling CI honestly, cache strategies, test sharding, and the cultural rules that keep pipelines under five minutes."
slug: build-times-team-health
cluster: engineering
tags:
  - ci
  - developer-experience
  - testing
  - culture
date: 2026-03-12
author: Ruby Castellanos
keywords:
  - CI performance
  - build times
  - developer experience
  - test sharding
  - CI caching
readingTime: 10
---

I am a producer, not an engineer, which is exactly why I get to write this. Engineers treat a slow build as an irritation, like a squeaky chair. I treat it as what it actually is: a tax levied on every idea, every fix and every demo, paid in the studio's most expensive currency — senior people's attention. When I read a project's health, I ask for four numbers: deploys per week, lead time from merge to production, change-failure rate, and CI wall-clock time. The first three are the famous ones. The fourth is the one that quietly controls the other three.

A twelve-minute build doesn't cost twelve minutes. It costs the context switch out of flow, the "I'll batch a few more changes in" habit that makes every review bigger and worse, the flaky re-run lottery that teaches people to merge on amber, and the Friday demo that ships without the fix because the fix needed one more pipeline and the pipeline needed thirteen minutes twice. Slow builds don't just waste time; they change behaviour, and the behaviour change is always for the worse.

Our studio rule is simple and printed on the wall of every project channel: **main builds in under five minutes, PR checks under eight, and if either blows out, fixing it is sprint work, not hobby work.** Here is how we hold it, and how we got the culture to hold it with us.

## Measure first, because CI is a black box with an invoice

Nobody optimises what they don't graph, and CI is spectacularly good at hiding where the minutes go. Step one on any project we touch: emit per-step timing from every pipeline run into something queryable. Every serious CI platform can do this; if yours can't, `time` and a JSONL file in artifact storage will do. After a fortnight you have the truth, and the truth is always surprising — the team swears it's the test suite, and the graph says it's dependency install and Docker layer misses.

We put three numbers on a dashboard the whole team can see: median PR-check time, p95, and the weekly trend arrow. The trend arrow matters more than the absolute number. A build creeping up 3% a week is a fire in the walls; a stable eight minutes you understand is a known way of life.

## The boring wins, in the order we take them

**Dependency install is usually the first third.** Cache the package-manager store keyed on the lockfile hash — not the branch, not the build number, the lockfile. Cold-install on lockfile change, warm-start otherwise. On a recent monorepo (the trade-offs of which we work through in [monorepo or not?](/journal/engineering/monorepo-decisions-studios)) this single change took PR checks from 11 minutes to 6. Also: audit the dependency tree yearly. Every dependency is install time, every install is network, and half of what's in there was added to format a date in 2023.

**Docker builds: layer discipline.** Dependencies in early layers, source in late ones, and a remote build-cache backend so runners don't start cold. If your Dockerfile recompiles the world when one component's copy changes, the fix is an afternoon, once, and pays every day forever.

**Split the lanes.** Typecheck, lint and unit tests are three separate parallel jobs, not one sequential script. Wall-clock becomes the slowest lane instead of the sum. This is also why we keep TypeScript strictness improving via [the ratchet](/journal/engineering/typescript-strictness-ratchet): a typecheck lane that takes two minutes earns its keep by catching what a test would have caught nine minutes later.

**Build only what changed.** In a monorepo, affected-graph builds (Turborepo, Nx, Bazel if you're brave) are table stakes. The discipline that makes them work is honest dependency declaration — the graph is only as good as what you told it. We schedule one "cache-bust" full build nightly so a poisoned cache can never hide longer than a day.

## Test sharding and the flake tax

On most projects the test suite is where the remaining minutes live, and it fights back in two ways.

**Sharding.** Split the suite across N runners by historical duration, not by file count — timings change, so re-balance from recorded durations weekly (most runners do this automatically from JUnit output). Our end-to-end philosophy is documented in [Playwright suites that survive the redesign](/journal/engineering/playwright-testing-that-lasts); the CI corollary is that browser tests shard beautifully (specs are independent by design) and unit tests with shared global state don't — if your unit suite resists sharding, the suite is telling you something about your code.

**The flake tax.** A flaky test costs far more than its runtime: it costs the re-run, the distrust, the slow slide into merging on red. We treat flakes as P1 bugs with an owner and a clock. Any test that fails twice in a week on unrelated PRs gets quarantined to a separate non-blocking job the same day, with a ticket attached and a two-week fuse: fixed or deleted. This is the rule people resist and then thank us for. The full triage logic is in our [testing strategy](/journal/engineering/testing-strategy-that-scales) — the short version is that a suite people trust is faster than a suite people re-run, even when the raw minutes say otherwise.

**Delete the bottom.** Twice a year we export per-test durations and read the long tail with fresh eyes. Tests that take 30 seconds to assert a date format, suites guarding code scheduled for deletion, snapshot files nobody would dare fail: delete them. Deleting tests is the highest-value performance work in any pipeline and nobody puts it in a sprint because it doesn't feel like engineering. It is.

## The cultural rules, which matter more than the technical ones

Fast builds decay. Every project's build was fast once, at the empty-repo stage, and entropy does the rest unless culture pushes back. The rules that work at Brassfern:

1. **Build time is on the dashboard and in the retro.** Numbers people see get defended; numbers people don't see get spent.
2. **A regression budget.** Any PR that adds more than ~30 seconds to the pipeline needs a note in its description saying why it's worth it. Not forbidden — *noticed*. Ninety per cent of the time the author finds the cheaper way themselves once they have to write the sentence.
3. **Red main is a stop-the-line event.** A broken main build blocks everyone's pipeline minutes, so the person who can fix it fastest does, and debugging happens in the open. Never a blame event — a *traffic* event.
4. **Preview deploys are part of the pipeline's job.** Fast CI that ends in a manual deploy step has optimised the wrong half. Every PR gets a [preview environment](/journal/engineering/preview-environments-every-pr), so the pipeline's speed shows up where stakeholders feel it: the link in the PR, minutes after push.
5. **One engineer per project carries the pager for developer experience.** Officially. Named in the [project approach](/approach) doc. "Everyone owns CI" means nobody does.

## What it buys

The receipts from our own studio: when we pulled the median PR check under five minutes on a long-running product engagement, deploys per week roughly doubled within a quarter, with no headcount change and no quality dip — change-failure rate actually fell, because smaller, braver merges replaced big, fearful ones. Friday demos stopped starting with "this was meant to be in but the build…" The pipeline stopped being a place work went to wait and became what it should be: a conveyor belt nobody thinks about, which is the highest compliment infrastructure can receive.

## Key takeaways

- Build time controls deploy frequency, review size and merge discipline — it's a team-health metric, not an irritation.
- Measure per-step timings and graph the trend; the real bottleneck is never what the team guessed.
- Take the boring wins first: lockfile-keyed caches, Docker layer discipline, parallel lanes, affected-only builds.
- Treat flaky tests as P1s on a quarantine-and-delete clock; distrust is more expensive than runtime.
- Fast builds decay without cultural defence: a dashboard, a regression budget, stop-the-line on red, and a named owner.

## FAQ

### What's a realistic target?
Under five minutes for the merge-to-main build and under eight for full PR checks covers nearly every project we've seen outside embedded and game dev. If you're at twenty-plus, you'll reach single digits with cache and sharding alone; the last few minutes are where test-suite shape and culture take over.

### Do we need build-observability tooling to start?
No. `time`, CI artifacts and a spreadsheet will carry you through the first three fixes, which are usually the big ones. Graduate to dashboard tooling when you're defending gains, not finding them.

### Should PR checks run the full test suite?
Run everything that's fast and shardable; move the slow, stable, low-signal tail (visual regression sweeps, exhaustive matrix builds) to a post-merge or nightly job with good alerting. The contract we keep: anything not blocking PRs must page a human within the hour when it breaks, or it drifts into decoration.

### How do we get buy-in for CI work over feature work?
Don't frame it as engineering hygiene; frame it in the producer's currency. Measure one week of merge-to-deploy lead time and count the re-runs; convert to salaries and calendar. "We spent 61 engineer-hours waiting for CI last sprint" gets a budget line. "The pipeline feels slow" gets a sympathy nod.
