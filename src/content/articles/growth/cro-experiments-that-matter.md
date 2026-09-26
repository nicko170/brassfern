---
title: "CRO experiments worth running: a field guide to honest testing"
description: "Most test backlogs are junk drawers. How we triage CRO ideas by evidence, opportunity and traffic tier — and sequence experiments so the learnings compound."
slug: cro-experiments-that-matter
cluster: growth
tags: [cro, experimentation, prioritisation, ab testing, growth]
date: 2025-11-12
author: Sam Whitfield
keywords: [cro experiments, ab testing, conversion rate optimisation, experiment design]
readingTime: 9
---

Every growth team we've joined mid-flight has a testing backlog. It is usually a spreadsheet, and it is usually a junk drawer: 140 rows of ideas accumulated from brainstorming sessions, competitor screenshots, a board member's nephew, and three CRO blog posts from 2019. The backlog is not the problem. The problem is that backlogs like this get executed in order of whoever shouted loudest in the meeting, which means the programme's scarce resource — traffic, and the weeks it takes to spend it — gets burned on tests that were never worth running.

This piece is about the decision *before* the test: which ideas deserve your traffic at all, in what order, and how to run a programme where each experiment makes the next one smarter. The statistical craft of running the tests themselves — power, peeking, pre-registration — has its own essay: [designing CRO experiments you can believe](/journal/growth/cro-experiment-design). This is the field guide for everything that comes first.

## The brutal arithmetic of testing capacity

Before any prioritisation framework, do the sum most teams avoid. A credible test at typical baselines needs tens of thousands of visitors per variant and a minimum of two full business cycles in duration. On a site with 40,000 monthly visitors to the page in question, running clean 50/50 tests sequentially, you can run perhaps six to ten meaningful experiments a year *on that page*.

Six to ten. That number should be printed above every prioritisation spreadsheet, because it transforms the question. You're not choosing which of 140 ideas to test first. You're choosing which six ideas in the entire company deserve a year of your traffic budget. Nobody who has internalised that number approves a test of the newsletter popup's border radius.

This is also why "we'll test everything" cultures quietly test nothing: they run 40 underpowered tests, declare 15 winners, ship 6 real improvements and 9 illusions, and lose the trust of every stakeholder who watched the deck claim a 40% cumulative lift that the revenue line never met.

## Triage: the three-gate filter

We run every candidate test through three gates, in this order, and an idea that fails a gate doesn't get scored further.

**Gate 1: Evidence.** Is there observed, specific evidence that the problem this test addresses is real? Session recordings of hesitation at the shipping step. Support tickets asking about delivery dates. A [pricing page research round](/journal/product/pricing-page-ux-research) showing the same confusion in five of eight sessions. "I think the button should be green" fails this gate. So does "competitor X does it" — you have no idea whether competitor X's version works; you might be copying their losing variant. Roughly two-thirds of typical backlogs die here, which is the gate doing its job.

**Gate 2: Opportunity size.** If the hypothesis is completely right, what is the plausible ceiling? Be crude and honest: a fix to an error message seen by 2% of users in checkout might lift completion by 0.1 percentage points if it's a triumph. A broken first impression on the PDP — the page where [most commerce revenue is decided](/journal/ecommerce/pdp-design-conversion) — might be worth ten times that. Multiply plausible ceiling by the revenue attached and you get a rough annual value; anything under a year of salary for the effort involved is a "do it without testing" or a "don't do it."

**Gate 3: Detectability.** Can you actually measure the effect with your traffic in a reasonable duration? If the plausible effect is below the minimum detectable effect for your traffic, the test is unfalsifiable — it can produce noise, not knowledge. This gate is where well-meaning teams lie to themselves, so we force the number to be written down next to the idea before it's approved. Our rule: if you can't detect it, either make the change bigger (test a redesign of the flow, not a tweak), measure a higher-volume proxy metric, or ship the change as a [staged rollout with before/after measurement](/journal/growth/funnel-metrics-that-matter) and don't pretend it's an experiment.

An idea that passes all three gates earns its place in the queue. In practice this turns 140-row junk drawers into queues of 8–15 experiments — which, given six to ten slots a year, is still a surplus. Good. A surplus of credible ideas is a luxury; a surplus of junk is a treadmill.

## Traffic tiers: match the experiment to the page

The gates interact with a page's traffic in ways worth systematising, because the right experiment on the wrong tier is still the wrong experiment.

**High-traffic surfaces (100k+ monthly visitors to the step).** You can afford refinement: iterated copy, layout and sequencing tests with modest MDEs. This is the only tier where "always be testing" is honest. These surfaces are also where tiny relative lifts are worth real money, so detectability is genuinely achievable.

**Mid-traffic surfaces (10–100k).** Test structure, not decoration: alternative flows, reordering steps, removing fields, changing the offer framing. Effects need to be large to be detectable, which conveniently aligns with where the value is — structural fixes are where double-digit relative lifts live. Our [checkout friction audit](/journal/ecommerce/checkout-friction-audit) is essentially a list of structural hypotheses for this tier.

**Low-traffic surfaces (below 10k).** Stop A/B testing here. It is not statistically serious, and pretending otherwise wastes the credibility the rest of the programme needs. Instead: ship improvements as sequential rollouts measured against seasonality-adjusted baselines, run qualitative studies (five users will tell you why a page fails far faster than five months of underpowered testing), and — the move nobody considers — *fix the traffic first*. A page with 4,000 monthly visitors and a famous conversion problem often has the wrong 4,000 visitors; the growth lever is upstream, in [channel and intent](/journal/growth/paid-organic-balance), not on the page.

## Sequencing: learn wide, then dig

Given six to ten tests a year, order matters more than selection. We sequence in two phases.

**Exploration first.** Early in a programme, prefer tests that discriminate between *theories of the customer* rather than variations of a treatment. "Visitors abandon because shipping cost surprises them" versus "visitors abandon because they don't trust the returns policy" are different theories of the same funnel step; a test with variants that lean into each theory (transparent all-in pricing versus a prominent [no-panic returns promise](/journal/ecommerce/returns-ux-design)) teaches you something even when it loses. Exploration tests should be the biggest swings you can build, because their job is to shrink the space of possible customers.

**Exploitation second.** Once a theory holds up across two or three tests, dig the vein: iterate within the winning theory, going narrower and compounding. This is where a learnings ledger pays for itself — a shared log of hypothesis, result and interpretation for every test ever run, searchable by page and by theory. The ledger is what stops a new team member re-testing settled questions and what turns a programme from a series of events into a body of knowledge. We've inherited programmes with four years of test history and no ledger; effectively, they'd run the same experiments a stranger with a free testing tool could have run in month one.

One sequencing rule we hold absolutely: never run two tests that can plausibly interact on overlapping audiences simultaneously. A PDP test and a site-wide navigation test contaminate each other, and untangling them after the fact is a fantasy. When in doubt, run the higher-upstream test first — its result changes the audience the downstream test sees.

## Reporting that earns trust

The graveyard of CRO programmes is full of teams that were right but unbelievable. Stakeholders quit trusting testing after watching claimed lifts fail to appear in revenue twice. Three reporting habits prevent this.

First, report in money and ranges, not percentages and point estimates: "worth roughly $180k–$420k a year at 90% confidence" is honest in a way "+12.4% conversion" never is. Second, pre-register and publish the decision rule *before* the test ends — the programme's integrity lives in the gap between what you said you'd do and what you did. Third, celebrate informative losses in the same forum you celebrate wins. A legible null result that kills a bad theory saves more money than most wins make. Programmes where losses are career damage are programmes where every result will eventually be a win, which is another way of saying every result will eventually be fiction.

This is the part of CRO that is actually culture, which is why we staff it alongside designers and engineers rather than handing it to a siloed "optimisation team." The [growth engagements](/services/growth) that compound are the ones where the product team inherits the ledger and the habits, not just the wins.

## What a year of honest testing looks like

From the outside it looks unambitious: a dozen explored ideas, eight shipped, four clean wins, two informative losses, two inconclusive-by-design rollouts. The claimed cumulative lift is modest — 15–25% on the target metric, with ranges. And the revenue line moves by roughly what the deck said it would, which is why year two gets funded with double the trust and none of the skepticism tax.

The loud version — forty tests, a 4% win rate presented as a 60% one — looks better for two quarters and then quietly dies in a budget review. CRO is a field where honesty isn't just ethics. It's the only go-to-market strategy that survives contact with the finance department.

## Key takeaways

- Compute your real testing capacity — often 6–10 credible experiments per page per year — and prioritise like it's true.
- Gate every idea on observed evidence, plausible opportunity size and detectability; most backlogs shrink by 85–90%.
- Match experiment type to traffic tier: refinement at high traffic, structure at mid, qualitative research and upstream fixes at low.
- Sequence to discriminate between theories of the customer first, then exploit the winning theory.
- Keep a learnings ledger — a programme without one is re-learning month one forever.
- Report money with ranges, pre-register decision rules, and treat informative losses as wins for the programme's credibility.

## FAQ

**What should we use instead of ICE or PXL scoring?**

Use the three gates pass/fail, then rank survivors by expected annual value divided by weeks of traffic required. Scoring frameworks fail because "impact" and "confidence" get scored by the person proposing the test, which converts the framework into a ritual for laundering hunches into numbers. Evidence-based gates are harder to game because the evidence either exists or it doesn't.

**How do we handle stakeholders who keep proposing button-colour tests?**

Thank them and route the idea through the gates in front of them. Ask for the observed evidence and the plausible ceiling, and write down the detectability maths together. Most small-tweak ideas die their own death in five minutes of arithmetic — which is far more durable than you saying no, and it teaches the arithmetic to the next person watching.

**Is it ever right to ship without testing?**

Constantly. Obvious accessibility fixes, broken layouts, dead links, compliance issues, changes where the plausible ceiling doesn't cover the cost of testing — ship them, measure directionally, and spend your test slots on genuine uncertainty. A backlog where everything must be A/B tested is a programme that optimises nothing that matters and everything that doesn't.

**How long should a test stay in the ledger?**

Forever, but with a decay flag. Customer behaviour and traffic mix shift; a null result from 2023 on a payment-flow test shouldn't veto a 2026 retest when mobile share has doubled. We mark entries stale after 18 months or any major audience shift, and staleness lowers the bar to retest — it doesn't erase the lesson.
