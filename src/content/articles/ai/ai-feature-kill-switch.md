---
title: "Every AI feature needs a kill switch"
description: "Config-driven disable paths, graceful degradation, incident comms for model-caused bugs, provider outage posture, and the quarterly drill where you flip the switch."
slug: ai-feature-kill-switch
cluster: ai
tags:
  - Operations
  - Reliability
  - Feature flags
date: 2026-09-18
author: Felix Brandt
keywords:
  - ai feature kill switch
  - llm incident response
  - ai feature flags
  - model outage
  - graceful degradation
readingTime: 11
---

Traditional features fail loudly. Exceptions throw, dashboards light up, someone rolls back the deploy. AI features fail *quietly*: the same code, the same model version, the same prompt — and the outputs are suddenly, subtly worse, wrong in a new accent, or confidently inventing policy. We detailed the whole taxonomy in [what production taught us about shipping LLM features](/journal/ai/shipping-llm-features-lessons). This piece is about the operational position those lessons force on you: **every AI feature ships with a rehearsed way to turn it off.** Not a config value in a spreadsheet. A kill switch with a degraded path, an owner, comms and a drill.

## Why conventional rollback isn't enough

Your standard incident playbook assumes the failure is in code you control. AI features break that assumption in three ways:

**The model changed without telling you.** Providers tune behaviour under the same API. We've watched a "same-version" model become chattier over a weekend, ruining a strict-format extraction pipeline that had been stable for months. No deploy happened on our side, so no rollback was possible.

**The world changed the inputs.** A new product launch, a trending news topic, a seasonal query shift — and your carefully evaluated prompt is now receiving a distribution of questions it has never seen. Your evals from [the golden set workflow](/journal/ai/evals-first-development) still pass on Tuesday; production is a different animal by Friday.

**The provider itself is down.** Rate limits at scale, an outage in one region, a sudden deprecation notice. If your architecture can't degrade without the model, your product has a dependency-shaped hole in its availability story.

A kill switch is the answer to all three, because it targets the *feature*, not the deploy.

## Anatomy of a real switch

One boolean in a feature-flag tool is not a kill switch. The working design has four parts:

**1. Scoped flags, not a global one.** Every AI surface gets its own flag: `ai.summaries`, `ai.assistant`, `ai.triage_routing`, `ai.search_answers`. This matters because incidents are almost always localised — the assistant is misbehaving while the summariser is fine. A global off switch turns a product incident into a company outage. Flags are evaluated server-side per request so there's no cached client with lingering AI; our broader conventions for flag hygiene are in [feature flags without the graveyard](/journal/engineering/feature-flags-craft).

**2. A designed degraded path.** This is the part nobody builds, and the part that matters most. When the flag flips, the user should land in a *good non-AI experience*, not an error toast:

- Summariser off → show the full content, which the page should render anyway.
- Assistant off → the help centre's article search and contact path, surfaced prominently.
- AI triage off → straight-to-queue routing, which — as we argue in [AI triage for support](/journal/ai/ai-support-triage-routing) — should have been your fallback design from day one.
- Generative onboarding off → the classic form-based setup, kept warm and tested in CI as a first-class flow, not a museum piece.

The degraded path must be *designed*, not implied, and the fallback UX patterns from [when the model fails](/journal/ai/llm-failure-fallback-ux) should be applied: state plainly what's unavailable and when it'll be back, with zero euphemism.

**3. An owner and a trigger.** The switch has a named owner per feature — the person paged when evals or monitors trip. The trigger conditions are written down: "auto-disable when hourly eval score drops 15 points below seven-day baseline", or "disable when provider error rate exceeds 5% for ten minutes." Flag-flipping without thresholds defers the decision to the worst moment to make one.

**4. A comms template, pre-written.** Incident comms for AI failures differ from ordinary outages: the mode is *quality*, not availability. Pre-draft three notices: degraded (feature off, product fine), excluded (feature answer corrected after the fact), and disclosure (a bad output reached users — rare, serious, needs legal's eyes before publish, so do the drafting now). The last one is the template you'll be grateful exists.

## Plugging it into the alerting

The kill switch without monitoring is a fire exit without a fire alarm. Two monitoring layers:

**Continuous eval probes.** Every few minutes, production runs a small canary subset of the golden set — ten cases, cheap graders — against the live model and prompts. A drifting model shows up here before it shows up in support tickets. This is the production extension of the eval gates from [evals are the new unit tests](/journal/ai/evals-practical-guide); the same graders, on a timer, with alert thresholds.

**Behavioural signals.** Thumbs-down rate, escalation rate, hallucination flags from your own detectors, refusal-rate spikes. We cover the full metrics picture in [analytics for AI features](/journal/ai/ai-feature-analytics). These lag the canaries but catch what evals never anticipated — the kinds of failure only real users invent.

When either layer trips, the pager goes to the flag owner, and the first page of the runbook is *"check the switch; flipping it is reversible, safe and approved."* That sentence matters: the quickest incident response is the one with explicit permission pre-granted.

## The quarterly drill — actually flipping it

KILL switches that have never been flipped are decorative. Once a quarter, per feature, the team runs a drill we call *going dark*: during a low-traffic window, flip the flag in production for thirty minutes.

The drill answers questions no staging test can:

- Does the degraded path *actually* render? (The first time we drilled the assistant fallback on a client project, the fallback page 404'd — it had been silently broken for two releases. Every drill since has paid for itself.)
- Does anything else depend on the AI pathway? Queue consumers, analytics events, billing meters, downstream caches.
- Does support know the feature is dark? The drill includes a notification to the support channel and the pre-written customer comms template getting a test read.
- How fast can one person, cold, find and flip the flag? Target under three minutes from pager to degraded state.

After each drill, a fifteen-minute retro updates the runbook. That's it. The whole practice costs a few hours a quarter and converts "hipocratic hope" into genuine operational reversibility.

## Provider outages: the stance

Provider downtime deserves its own posture because you don't control the recovery clock. Our stance with clients:

- **Fail over to degraded, not to a backup model**, unless the failover model has been eval-tested against the golden set continuously. An untested backup model is a load-bearing surprise. Model portability is a real but separate project — see [model migration without breakage](/journal/ai/model-migration-without-breakage).
- **Cache the deterministic.** Responses to idempotent, high-frequency requests can be served from a short-TTL cache during an outage — with a "slightly delayed data" note, not silent staleness.
- **Status page honesty.** "AI-powered answers are temporarily unavailable; search and browse work normally." Specific, unembarrassed, done.

## How we put it in the contract

In our [AI products engagements](/services/ai), the kill-switch isn't a nice-to-have line item — it's part of the definition of done in the [measurement plan](/journal/playbooks/measurement-plan-before-build) and it's demoed, live, at the final [weekly demo](/journal/playbooks/weekly-demo-culture) before launch: we flip the feature off in front of the stakeholders and show the degraded experience. It's consistently the demo moment that makes clients relax. Software they can turn off is software they can trust.

## Key takeaways

- AI failures are quality failures — conventional deploy rollback doesn't cover model drift, input shift or provider outage.
- Every AI surface gets its own server-side flag, a designed non-AI fallback, an owner, and written trigger thresholds.
- Canary eval probes and behavioural signals are the alarm; the kill switch is the exit.
- Drill the switch quarterly in production. The first drill will find something broken. That's the point.
- Fail over to the degraded experience, not to an unevaluated backup model; cache the deterministic with disclosure.

## FAQ

**Isn't a degraded experience an admission that the AI isn't valuable?**
No — it's proof the *product* is valuable with or without the AI. If the degraded path is embarrassing, the AI feature was doing structural work it shouldn't have been. Kill switches force honest architecture.

**What about killing the feature for one user segment only?**
Per-tenant and per-segment scoping is the right next step after per-feature flags — it lets you contain an incident to the affected cohort. It also needs stricter flag tooling and access control, so earn it after the per-feature posture is drilled.

**Do kill switches apply to non-customer-facing AI (internal copilots)?**
Yes, and faster. Internal tools tend to have *fewer* reversibility controls because "it's just staff." An internal summariser that's quietly wrong poisons decisions nobody knows to trace back to it.

**How do we test the degraded path in CI so it doesn't rot?**
Run the E2E suite twice: once with AI flags on, once with a CI job that flips them off. The degraded flow is then as tested as the primary one, and the drill stops being a treasure hunt.
