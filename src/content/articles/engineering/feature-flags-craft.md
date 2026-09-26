---
title: "Feature flags without the graveyard"
description: "Flag discipline for product squads: lifecycle stages, a naming grammar, expiry automation, analytics hooks, and the monthly flag funeral that keeps codebases young."
slug: feature-flags-craft
cluster: engineering
tags: [feature flags, progressive rollout, technical debt, workflow, product engineering]
date: 2024-11-12
author: Sam Whitfield
keywords: [feature flags best practices, feature toggles, progressive rollout, feature flag lifecycle, technical debt flags, trunk based development]
readingTime: 10
---

Somewhere in your codebase right now is a flag named `new_checkout_v2` that has returned `true` for everyone since March. Nobody remembers who owns it. Nobody dares delete it, because deleting it means reading code nobody wants to read. It is not a flag any more. It is a load-bearing superstition.

Feature flags are one of the best ideas in modern delivery — decouple deploy from release, ship to production daily, roll out gradually, kill instantly. They are also a reliable way to double your code paths, your test matrix and your confusion, unless you impose the one thing teams resist: a lifecycle. This is the discipline we run on our [product engineering engagements](/services/product) — it takes about an afternoon to adopt and pays back within a sprint.

## Why flags rot

A flag is born with a purpose ("gate the new onboarding until legal signs off") and dies of ambiguity: the purpose is achieved, nobody is told, the conditional stays. Multiplied across two years of squads, you end up with forty dead branches, evaluation calls sprinkled through layers of the stack, and a growing sense that touching anything might be the mistake. The codebase's real behaviour becomes "the code, modulo a config file nobody has read end to end."

The fix is not fewer flags — flags are how you stay on trunk and ship continuously. The fix is treating every flag as an object with a lifecycle, an owner and a funeral date.

## The lifecycle: four stages, four dispositions

We classify every flag at the moment of creation. The name encodes it (more on that below), and each stage has a defined end.

**1. Experiment.** Gates an A/B or multivariate test. Exit condition: the experiment concludes or is abandoned, at which point one branch is deleted — not "kept around just in case". Maximum lifetime: 6–8 weeks, because an experiment you can't read in two months was too muddy to read anyway. Our [CRO work](/journal/growth) runs on these, and the rule is the same as in the stats: decide the decision rule before you start.

**2. Rollout.** Gates a progressive release — 1%, 10%, 50%, all. Exit condition: 100% for a defined soak period (we use a week), then the flag is removed and the new path is the code. Maximum lifetime: 4 weeks. A rollout flag that lives for six months is a lie about what "shipped" means.

**3. Ops.** A permanent kill switch for something operationally risky — a third-party integration, an expensive feature you may need to shed under load. These are allowed to live forever, but they must be *declared* as permanent, named `ops_*`, tested in both states quarterly, and wired into alerting (a flag that can take checkout down is incident tooling, not a deployment convenience).

**4. Permission.** Gates a plan tier, beta group or entitlement. These are product features in flag clothing — which is exactly why they should move into your billing/entitlement system as soon as one exists. Maximum lifetime as a flag: one quarter, then migrate.

The pattern across all four: **a flag's lifetime is decided at birth, not at cleanup.** The estimate conversation changes from "should we spend a day removing that flag someday" to "this rollout flag expires on the 14th; removing it is part of the ticket."

## A naming grammar that survives your absence

Two years on, nobody remembers what `enable_thing_v2` was, but `exp_onboarding-steps_2025-06-15` is self-describing. We enforce a grammar at the type level:

```
<stage>_<area>-<short-name>_<expiry>
```

- `exp_search-ranking-v3_2025-09-01` — experiment, expires the first of September.
- `roll_invoice-pdf-gen_2025-08-14` — rollout with a month at most.
- `ops_stripe-failover` — permanent ops switch, no expiry, different alerting rules.

The grammar does three jobs. Code review gets teeth: a flag without a parseable name fails lint. The registry page can sort by expiry so the oldest zombies sort themselves to the top. And naming becomes a forcing function — to name the flag you must say out loud which of the four kinds it is. Half the discipline is achieved in that moment. The same principle — encode the decision in the thing itself, not in a document about the thing — is what makes a [design tokens pipeline](/journal/web-design/colour-systems-dark-mode) outlive the people who built it.

## Evaluation hygiene: where the calls live

Two architectural rules keep flags from entangling the whole stack.

**Evaluate at the boundary, pass the result in.** A component that receives `showNewTotals: boolean` is testable, story-bookable, and ignorant of your flag vendor. A component that calls `useFlag()` internally is coupled to the flag system's name for the feature forever — which makes flag removal a find-and-replace across dozens of files instead of one deletion at the boundary. We allow flag evaluation in exactly two places: route/layout composition, and the flag service itself.

**One evaluation per render tree.** Flags evaluated multiple times per request (client and server, or three components deep) create the possibility of inconsistent mid-render flips. Evaluate once at the top, thread it down through context or props. This also gives you one obvious place to log exposures for analytics.

## Analytics hooks: flags are measurement infrastructure

If a flag change doesn't emit an event, you can never attribute a metric shift to it — and "did the rollout break activation?" becomes a vibes-based incident review. Every evaluation at the boundary logs `flag_name`, `variant`, and `user/session id` into the analytics stream. Experiments get their own immutably-recorded exposure events; rollouts get a dashboard comparing error rates per variant. This is the plumbing behind our [AI feature analytics](/journal/ai/ai-feature-analytics) — an LLM feature flagged to 10% of users is unmeasurable without it. It also makes the funeral easier: nothing is more persuasive in a "can we delete this?" conversation than a dashboard proving which variant is live and what it did to [activation](/journal/product/activation-metrics-honest).

## Expiry automation and the flag funeral

Willpower-based cleanup loses to shipping pressure every time, so automate the reminders:

- A CI check fails any PR that introduces a flag without a parseable name or an expiry more than 8 weeks out.
- A scheduled job opens a "retire this flag" ticket — assigned to the original author — a week before each expiry. On expiry day, CI turns the flag's name red on the registry page and pings the squad channel.
- **The monthly flag funeral**: thirty minutes, first Friday, the squad walks the registry and closes, extends or schedules removal for anything near expiry. Extending requires a reason typed into the registry, which is read aloud. The ceremony is the point — it converts private guilt into shared maintenance, and it reliably catches the scariest items, like the ops flag nobody knew could disable fraud checks.

Deleting a flag's dead branch is the highest morale-per-line-of-code work in software. We make whoever does it ring the (metaphorical, Slack-based) gong in standup.

## The honest costs and where to start

This isn't free: flag evaluation needs latency budget (evaluate server-side or cache aggressively; a 40ms network call in the render path is a [Core Web Vitals tax](/journal/engineering/core-web-vitals-field-guide)), and every experiment flag doubles one test path in CI. Budget both. If you're starting from a bad place — sixty flags, no registry — don't refactor everything. Introduce the naming grammar for *new* flags this week, build the registry page next week, and run one funeral. The graveyard stops growing the day the first name is typed, and shrinks every month after. If you want a second opinion on the rollout plan, our [discovery sprint playbook](/journal/playbooks/discovery-sprint-playbook) shows how we'd scope the audit.

## Key takeaways

- Every flag is born with a type — experiment, rollout, ops or permission — and the type determines its maximum lifetime and exit condition.
- Encode stage and expiry in the flag name itself; a name you can't parse is a flag you can't govern.
- Evaluate flags once, at the composition boundary, and pass booleans down; components that call the flag service directly make removal expensive.
- No exposure event, no flag: measurement hooks are not optional on experiments and rollouts.
- Cleanup needs automation and a ceremony — expiry-driven tickets plus a monthly funeral beats willpower every time.

## FAQ

**Feature flag service or roll our own?**
Buy or use a mature open-source one unless your needs are genuinely unusual. The hard parts — consistent bucketing, low-latency evaluation, audit logs, SDK edge cases — are solved problems, and a homegrown system tends to ossify into exactly the graveyard this article is about. Spend your engineering effort on the discipline, not the plumbing.

**How do flags interact with testing?**
Test both states of every live rollout and experiment flag in CI (a whole-test-suite run per variant is usually proportionate for a handful of flags), and require ops flags to have a both-states smoke test. Dead flags, once removed, delete their dead tests too — another reason removal is so satisfying.

**What do we do about flags in mobile apps, where ships are slow?**
Everything in this article applies harder: use flags aggressively to decouple app-store releases from releases, but shorten experiment lifetimes — app versions linger, so gate the *config* server-side and keep the client-side branch count low. A flag whose client branch ships in v4.2 but evaluates on v4.0 is how you get silent degradation.

**Won't all this process slow the squad down?**
The naming grammar costs thirty seconds per flag. The funeral costs thirty minutes a month. The first time a one-line flag deletion replaces a two-day unravel of nested conditionals, the squad is net ahead — and that moment usually arrives in the first quarter.
