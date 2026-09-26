---
title: "Activation metrics that mean something"
description: "Most activation metrics are flattering fictions. Find the behaviour that predicts retention, measure time-to-value honestly, defend it in the boardroom."
slug: activation-metrics-honest
cluster: product
tags: [product metrics, activation, retention, analytics, growth]
date: 2025-06-24
author: Priya Nair
keywords: [activation metrics, product metrics, time to value, retention analytics, aha moment fallacy]
readingTime: 8
---

Every product team I've ever audited has an activation metric. Most of them are cosplay: a number chosen because it was easy to instrument, goes up when anything good happens, and makes the monthly board slide look like a ski slope. "Signed up for a trial." "Created a project." "Completed onboarding." These metrics share a fatal quality — they measure the *user's compliance with our funnel*, not the *user's receipt of value*. A user who creates a project has obeyed you. A user who got the answer they signed up for has been served. Only one of those predicts whether they're still around in month three.

An honest activation metric is a specific, observable user behaviour that reliably precedes retention. Finding one is analysis work. Defending it — when it moves slowly, when it's embarrassing, when the flattering metric is right there — is politics. Both are the job. Here's how we run both, the same method behind the onboarding rebuild in our [Brightmarsh case study](/work/brightmarsh-onboarding).

## What activation actually is

Definitions first, because the term rots fastest. A user is *activated* when they have experienced the core value of the product at least once, in a way they would notice and miss. Two clauses matter. "Experienced the core value": the value is defined by the job they hired the product for (if you haven't run [jobs-to-be-done interviews](/journal/product/jtbd-interviews-that-work), stop here — you cannot define activation for a job you haven't heard described). "Would notice and miss": if the user's Tuesday would be identical had they never opened your product, whatever they did in it was not activation.

This immediately kills most candidate metrics. "Added a teammate" fails because nobody misses a teammate they never collaborated with. "Imported data" fails because import is effort, not value. The metric that survives the test usually describes the *consequence* of setup, not the setup: not "connected their bank" but "saw their real cash position". Not "built their first dashboard" but "viewed a chart built from their own data twice in a week".

## The correlation hunt, done properly

The method is unglamorous SQL, and it goes like this:

1. **Define retention first.** Pick the retention you care about — week-8 return for a consumer-ish tool, month-3 active for B2B — and fix it before you look at anything else. Choosing the retention definition after seeing correlations is how teams accidentally prove whatever they wanted to prove.
2. **List candidate early behaviours.** Twenty to forty of them, from events you already log plus a few you should add: first-week actions, frequencies, time-to-first-X.
3. **Correlate each against retention, in cohorts.** For each behaviour: among users who signed up in a window, what share of those who did X within N days were retained, versus those who didn't? Read the *gap*, not the absolute rate.
4. **Interrogate the survivors.** Correlation here is heavily polluted: people who would have retained anyway do more of everything. Two filters help. Check *dose-response* (does doing X more predict better, or is it binary?) and check *precedence* (does X happen before the behaviour that retention-research says users value, or is X actually a proxy for "already power user"?).

What you're left with is rarely a magic number. It's usually a mundane behaviour with a stubborn gap. At Brightmarsh, the surviving behaviour was not "finished the onboarding quiz" (correlated with nothing) nor "enrolled in a course" (correlated mildly) — it was *completed one lesson in the first session*. Course-takers who finished a lesson that day had week-8 retention roughly three times those who enrolled but stalled. The whole onboarding redesign — which we wrote about in the [case study](/work/brightmarsh-onboarding) — reorganised around earning that one completion.

## Time-to-value: the metric under the metric

Once you know the activation behaviour, measure how long it takes to get there — time-to-value — because activation rate and TTV move different levers. Improving rate often means removing steps; improving TTV often means making the remaining steps faster to *understand*.

Rules that keep TTV honest:

- **Measure from the moment intent exists, not from signup.** If someone creates an account Monday, is dragged into meetings, and returns Thursday, the product didn't take four days to deliver value. Measure from first session with genuine intent (you'll have to define this; "second login or session longer than 90 seconds" is a defensible proxy).
- **Report the median, and show the distribution.** A mean TTV hides the bimodal truth: a fast group and a lost group. The lost group's tail is the product problem.
- **Watch the wall-clock, not the funnel-step clock.** Five minutes spread across three interrupted sittings is a different product problem than five focused minutes — even though both look identical in a steps-to-completion chart.

## When the honest metric is embarrassing

Here's the part conference talks skip. Your honest activation metric will often be *small* — "22% of signups completed a lesson in week one" — and the flattering metric right beside it will be large: "89% completed onboarding!". Someone with a quarterly narrative to protect will propose reporting the flattering one. Sometimes that someone is the founder. Sometimes it is you.

Our rules for surviving that meeting:

- **Never delete the flattering metric; demote it.** Flattering metrics are often useful diagnostics of funnel mechanics (onboarding completion tells you about your onboarding). They're just not the claim. Keep them visible as plumbing, below the headline.
- **Name the metric after the value, not the behaviour.** "Weekly resolved" beats "lesson_completion_7d". When the metric's name contains the user's outcome, the meeting stays honest longer.
- **Tie the honest metric to money as soon as possible.** The Brightmarsh number survived politics for one reason: retained learners were the revenue model. If your activation metric can't be connected to a commercial line within two arrows, strengthen the connection or expect to lose the room.
- **Publish the kill criteria with the goal.** We pre-register, in the same doc that sets the quarterly activation target, what evidence would make us change the metric itself. Making the metric falsifiable is what separates measurement from religion — the same discipline our [growth practice](/services/growth) applies to experiments.

## Instrumentation notes, briefly

Instrument the activation behaviour with its *context*, not as a bare event: which surface, which session number, elapsed time since first intent. You want to answer "what would have to be true for more people to get here?" without a second instrumentation pass. And if your stack can't answer per-user cohort questions without an export, fix that before the next roadmap meeting — a [dashboard that can't answer why](/journal/product/dashboard-design-hierarchy) is furniture.

Honest metrics are a culture output, which is why we wire them during engagement setup rather than after launch; the [pricing model](/pricing) reflects it — measurement plans are a deliverable, not a favour.

## Key takeaways

- Activation means the user experienced core value in a way they'd miss — consequences, not setup steps.
- Fix the retention definition first, then hunt correlations in cohorts, and filter survivors for dose-response and precedence.
- The winning behaviour is usually mundane and the gap, not the rate, is the signal.
- Measure time-to-value from first intent, report medians and distributions, and treat wall-clock fragmentation as its own problem.
- Keep flattering metrics as plumbing, name the honest metric after user value, tie it to money, and pre-register what would change it.

## FAQ

**Can a product have more than one activation metric?**
Per job, no; per product, sometimes. A product serving genuinely different jobs (an admin and a practitioner doing entirely different work) may need one per job — but each must be defined per circumstance, not per persona label. If you have five activation metrics, you have a funnel, not a model.

**What if nothing correlates with retention?**
Then retention is noise or value isn't being delivered yet — both are real findings we've delivered with a straight face. Check whether retained users share a *behaviour sequence* rather than a single action, and check whether your retention window matches the product's natural cadence (a monthly tool measured weekly looks dead).

**How often should the activation metric change?**
Rarely — once per major strategy shift, not per quarter. Metric churn destroys the one thing a metric is for: a stable yardstick against which the team learns. This is why pre-registered kill criteria matter; they make change possible but expensive.

**Do onboarding checklists hurt activation?**
They raise compliance metrics, not necessarily activation. Checklists work when every item is on the critical path to the first value moment — when they include "invite your team" and "follow us on social", they are marketing that borrows the checklist's authority, and they cost you the honest signal.
