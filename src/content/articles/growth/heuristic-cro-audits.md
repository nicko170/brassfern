---
title: "Audit first, test second: heuristic CRO that finds the free wins"
description: "Before your next A/B test, walk the funnel as a stranger. Our heuristic CRO audit method: the friction walkthrough, severity scoring, and fixes that don't need stats."
slug: heuristic-cro-audits
cluster: growth
tags: [cro, audit, conversion, ux, experimentation]
date: 2026-01-28
author: Sam Whitfield
keywords: [CRO audit, heuristic evaluation, conversion optimisation, UX audit]
readingTime: 9
---

Somewhere right now a growth team is preparing an A/B test of a headline — a test that will run for six weeks, reach "no significant difference", and be logged as a learning — while on the same page a form rejects Australian phone numbers, the primary button sits under the fold on a 375px viewport, and the price shown in the hero is different from the price at checkout. Three fixes, no statistics required, almost certainly worth more than the test. But fixes don't feel like a *programme*, so the programme wins the calendar.

We run it the other way: **audit first, test second**. A heuristic CRO audit — a structured expert walkthrough of the funnel against known failure patterns — finds the free wins: friction so obvious in hindsight that shipping the fix is a better use of traffic than measuring it. Experiments are precious (every test spends your scarcest resource, weekly visitors); spend them on questions where reasonable people actually disagree. This is the audit method we run before any experimentation programme, refined across e-commerce, SaaS and lead-gen funnels.

## Why heuristics before hypotheses

Three arguments, in ascending order of importance.

**Free wins are real and numerous.** In the last ten audits we ran, the median yield was eighteen findings; about a third were "clear friction, just fix it" — validation errors eating submissions, dead ends in mobile navigation, trust elements missing where anxiety peaks. None needed a p-value. They needed eyes.

**Auditing calibrates the team.** Walking the funnel as a skeptical stranger rewires how everyone sees the site. The founder stops seeing the vision and starts seeing the phone-number field. After an audit, the experiment backlog gets noticeably less silly — fewer colour tests, more structural questions.

**Experiments are expensive in disguise.** A test at 3% baseline conversion looking for a 15% relative lift needs weeks of traffic most products don't have. Our rule of thumb, expanded in [designing CRO experiments you can believe](/journal/growth/cro-experiment-design): if you can't reach a decision in four weeks, the test is a coin flip with a dashboard. Audits are how you raise the baseline enough that experiments become affordable.

## The friction walkthrough, exactly how we run it

Half a day, three people, real devices. The cast matters: one person who knows the funnel intimately, one who has never seen it, one who owns the analytics for it. The stranger narrates everything aloud; stream-of-consciousness catches what inspection misses.

**Step 1 — Define the journeys, not the pages.** Two to four journeys worth actual money: paid-search click to signup, organic landing to demo request, returning user to upgrade. Auditing pages produces style notes; auditing journeys produces friction.

**Step 2 — Run each journey three ways.** Cold (no context, five seconds on the landing page, then answer: what is this, who is it for, what do I do next), skeptical (actively looking for reasons not to convert — read the FAQ like a lawyer, hunt for the price, try to find the catch), and hostile-device (real phone, hotel-grade throttled connection, one hand). The hostile-device pass alone produces a third of findings in most audits we run, because everyone on the team last saw the site on a 5K monitor.

**Step 3 — Score every finding at the moment you find it**, while the irritation is fresh, against six lenses:

1. **Clarity** — can a cold visitor answer the three questions in five seconds?
2. **Friction** — fields, steps, decisions that don't earn their place. Our [checkout friction audit](/journal/ecommerce/checkout-friction-audit) runs 40 checks on the last mile alone.
3. **Anxiety** — is reassurance (price, terms, proof, cancel-anytime) present at the exact moment doubt peaks, not three sections earlier?
4. **Value** — is the promise concrete and specific, or adjective soup?
5. **Distraction** — anything competing with the one action the journey exists for.
6. **State** — do error, loading and [empty states](/journal/web-design/empty-loading-error-states) keep the journey alive, or strand it?

Each finding gets: severity (blocker / major / minor / note), the lens it violates, evidence (screenshot, device, recording timestamp), and a **confidence tag** — the part most audits skip.

## The confidence tag: fix, or test?

This is the discipline that separates an audit from an opinion document. Every finding is one of three things:

- **Fix now** — high confidence the change is strictly better. Broken validation, misleading price, button below the fold. Testing these is a tax on users and a waste of traffic. Ship, annotate the analytics, move on.
- **Test** — plausible but contested. Headline direction, pricing-page layout, social-proof placement. These graduate to the experiment backlog with the audit as their prior. (Then run the [testing programme properly](/journal/growth/landing-page-testing-program): velocity over genius.)
- **Investigate** — you suspect friction but can't see it from the outside. Heatmaps, session recordings, funnel analytics, five user sessions against the journey. Investigation findings convert to fix or test within a week or get dropped — a finding that lives in "investigate" for a quarter is decorative.

The honest ratio, across our audits: roughly 40% fix now, 40% test, 20% investigate. An audit where everything is "test it" is an analyst protecting themselves. An audit where everything is "fix it" is an ego wearing a checklist.

## Presenting findings so they get fixed

The graveyard of CRO is a 60-slide deck where every finding is severity-rated and nothing ships. What works instead:

**Lead with the journey video, not the findings.** A three-minute screen recording of the stranger pass — narrated, confused, giving up at the phone field — moves a roadmap more than forty bullet points. Attach it to the doc, force every stakeholder to watch it before the readout meeting.

**Group by decision, not by lens.** Nobody can act on "seven clarity issues". Everybody can act on: "Mobile signup leaks at phone validation — engineering, two days, fix now." "Pricing-page anxiety peaks at annual toggle — design spike, candidate for test." One finding = one owner = one next artefact.

**Price the blockers.** Even loosely: "18% of mobile signups hit this error state; at current paid spend that's roughly X lost accounts a month." A priced blocker jumps the sprint queue; an unpriced one waits politely forever. Pair the pricing with speech measured in money, which is [how funnel metrics earn attention](/journal/growth/funnel-metrics-that-matter) anyway.

**Timebox the readout.** Thirty minutes, findings pre-read, meeting exists only to assign owners and confidence tags. Readouts that re-litigate the findings live are how audits die performatively.

## The audit cadence

An audit has a half-life — sites change, teams ship, new friction accretes. Cadence we recommend: **a full friction walkthrough quarterly** (it's four hours; put it in the calendar like the board meeting), **a hostile-device pass on any journey touched by a sprint**, and a **semi-annual re-run of the cold test with a genuinely new stranger**, because the person who played stranger last quarter can no longer un-know the product.

And keep the audit documents. Comparing audit N with audit N+2 — which findings recurred, which fixes actually shipped, what happened to the metrics each fix predicted — is how a team develops taste. Recurring findings are never about the finding; they're about the process that keeps re-introducing it. On one engagement, the same "hidden pricing" finding appeared three quarters running across different pages; the root cause turned out to be a design-system [pricing component](/journal/web-design/pricing-pages-that-convert-quietly) with disclosure treated as an edge case. Fixing the component fixed the funnel in four places at once. That's the audit's real compounding: not the wins, but the pattern literacy.

If you'd rather have fresh eyes than another quarter of testing a 3% headline, this is a two-week engagement inside our [growth practice](/services/growth): walkthrough, scored findings, priced fixes, and an experiment backlog with actual priors. [Start with the brief](/contact).

## Key takeaways

- Audit before you experiment: heuristic audits surface "just fix it" friction that A/B tests waste weeks failing to confirm.
- Walk journeys, not pages — cold, skeptical, and hostile-device passes, with the stranger narrating aloud.
- Score findings against six lenses (clarity, friction, anxiety, value, distraction, state) and tag every one fix / test / investigate.
- Present via journey video, group by decision and owner, price the blockers in money.
- Re-audit quarterly; recurring findings indict the process, not the page.

## FAQ

**Isn't heuristic evaluation just one consultant's opinion with a score attached?**
It would be, done solo. The method earns its keep through three mitigations: two evaluators minimum scoring independently before reconciling (overlap exposes the opinions), evidence attached to every finding (screenshot, device, recording), and the confidence tag that sends contested findings to experiments instead of pretending certainty. A heuristic audit is a prioritisation instrument, not a verdict.

**When is it legitimate to skip the audit and go straight to testing?**
Two cases. One: the page is genuinely clean — you've shipped the obvious fixes, the analytics show a healthy funnel, and the remaining questions are real strategic forks (pricing model, positioning, offer). Two: you have enough traffic that a test resolves in under two weeks, in which case experimentation is nearly free. Both are rarer than teams believe; the median site we audit has double-digit fix-now findings.

**How do we stop fixes-now changes from accidentally hurting conversion?**
Annotation and holdback where cheap. Annotate every fix-now ship date in analytics so a later dip has a suspect list. For anything touching money directly (checkout, upgrade), a simple 95/5 holdback for a fortnight costs almost nothing and buys you a tripwire. But don't let fear launder indecision: a form that rejects valid phone numbers does not need an A/B test, it needs a ticket.

**Can we run the audit ourselves, or does it need outside eyes?**
You can and should run it yourselves — with one honest constraint: the stranger pass requires an actual stranger. Internalpeople cannot un-know the product, and 70% of an audit's value comes from someone encountering the phone field for the first time. Rotate in someone from another team, a customer-adjacent colleague, or yes, occasionally an outside pair of eyes who has broken these exact funnels before.
