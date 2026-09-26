---
title: "Setting goals for a redesign that aren't vibes"
description: "How to turn 'make it feel modern' into measurable redesign goals: primary metrics, kill criteria, baseline capture, and reporting that survives launch fog."
slug: goals-for-redesign-projects
cluster: playbooks
tags: [redesign, measurement, project goals, analytics, strategy]
date: 2026-03-03
author: Priya Nair
keywords: [website redesign goals, redesign metrics, project success criteria, agency measurement]
readingTime: 9
---

The brief said the site should "feel modern and premium and reflect who we are now." Lovely. Eight months later, in the post-launch review, four stakeholders held four different opinions about whether the redesign worked, all of them defensible, none of them measurable, and the person who'd championed the budget was quietly updating their CV.

"Feel modern" is not a goal. It is a mood, and moods don't survive contact with a CFO, a board pack, or a slow first month. Redesigns are among the most expensive things a marketing organisation does, and most of them are run with less measurement discipline than a $5,000 ad campaign. Here's how we set goals that can actually be met — and, just as important, goals that can tell you when to stop.

## Start with the problem, not the aesthetic

Every redesign has a real reason buried under the stated one. "The site looks dated" usually means one of:

- Conversion has sagged and leadership wants a lever pulled.
- The brand evolved and the site embarrasses the sales team on calls.
- The CMS is so painful that publishing has effectively stopped.
- A competitor redesigned and someone senior noticed.

Each of these has a completely different success metric, and they imply different projects. Conversion means the work is mostly [landing-page and funnel craft](/journal/web-design/landing-page-anatomy) plus experimentation. Embarrassment means brand expression and case-study quality. A painful CMS means the win is editorial velocity, measured in minutes-to-publish. Competitor envy means someone's taste needs managing, which is a stakeholder problem wearing a design costume.

So before any goals get written, ask in the kickoff: *"If this project is a triumph in October, what number moved?"* Take the first answer seriously and the second answer too, because they're often different people with different numbers. That gap is the project's first risk.

## Two or three primary metrics, full stop

The failure mode is a goal list with nine items, which is a goal list with zero items. Nine metrics means every decision is defensible and none is binding; someone can always point at the metric that went up. We cap it: **two or three primary metrics per project, agreed in writing, with a named owner each.**

A good primary metric passes three tests. It's **falsifiable** — it can go down and you'd say so. It's **influenceable** — the redesign can plausibly move it within two quarters. And it's **somebody's job** — a person reports it, not a dashboard nobody opens.

By project type, the metrics we see hold up:

- **Marketing site rebuild:** qualified conversion rate (demo requests, enquiries — the *qualified* variant, or you'll optimize yourself into spam), organic non-brand sessions after 90 days, and — underrated — [Core Web Vitals](/journal/engineering/core-web-vitals-field-guide) pass rate on real users, because it's a leading indicator you control entirely.
- **E-commerce:** checkout completion rate, revenue per session, repeat purchase rate if subscriptions are involved.
- **Content/brand rebuild:** pages published per month, average time-to-publish, engaged time on the flagship pages.

Supporting metrics can go on a watchlist — things you monitor so a win on the primaries isn't hiding a fire elsewhere. Organic impressions on a paid-conversion project. Bounce on a speed project. The watchlist is where honesty lives: it's how you catch the redesign that lifted enquiries 20% by quietly killing SEO, which is a story we tell in [site migrations that don't tank traffic](/journal/growth/site-migration-seo) because we've watched it happen to sites we were hired to rescue.

## Baselines: the step everyone skips

Here is a sentence that has killed more post-launch reviews than any other: *"We don't actually know what it was before."* If the current analytics are untrustworthy — and they usually are — you cannot measure whether the new thing worked. Baseline capture is week one work, not week nine:

1. **Pull 12 months of the primary metrics**, by month, and look at the shape. Redesigns launched in November get judged against December's seasonal spike; you need the seasonality on paper before anyone draws conclusions.
2. **Fix or annotate tracking on the old site first.** Yes, it feels absurd to improve instrumentation on a site you're about to demolish. Do it anyway for the final quarter. Launching a redesign alongside a new analytics setup destroys comparability — you'll spend the post-launch month arguing about whether the metric moved or the ruler changed.
3. **Agree the comparison window now.** "90 days post-launch versus the same 90 days last year, or trailing 90, whichever the group pre-registers" — and write it down, because launch fog makes everyone want to check the dashboard hourly and declare victory or disaster on day four.

We put all of this in the [measurement plan before the build](/journal/playbooks/measurement-plan-before-build) for exactly this reason: a metric captured late is a metric argued forever.

## Outcome goals vs output goals

The other discipline is separating what the project must *cause* from what it must *deliver*. We put goals in two columns:

| Output (we control it) | Outcome (the world decides) |
| --- | --- |
| New site ships by 15 May | Demo request rate up 25% by Q4 |
| LCP under 2.0s on 4G | Organic non-brand sessions up 15% |
| CMS publishing time under 10 min | 8 posts/month sustained for two quarters |
| Brand system rolled out sitewide | Sales reps use the site on calls (ask them) |

Outputs are promises the agency can make without hedging — deadlines, performance budgets, [editorial workflows](/journal/growth/content-ops-editorial-calendar). Outcomes are bets you make together, with the causal chain stated out loud: "we believe faster, clearer pages with proof nearer the top will move qualified demos, and here's the evidence from the audit." Stating the chain matters because it's your diagnostic when the world declines to cooperate: if outputs shipped and the outcome didn't move, you examine the chain, not the team's effort.

An agency that only accepts output goals is dodging outcomes. A client that only sets outcome goals is writing the agency a lottery ticket. You need both columns, and both signed.

## Kill criteria: the goal nobody writes

Every redesign goal should carry a termination clause: the condition under which you change course instead of persisting. This is borrowed from how we run [CRO experiments](/journal/growth/cro-experiment-design), where a hypothesis without a kill criterion isn't an experiment, it's a hope with a budget.

For a redesign, kill criteria look like:

- "If qualified conversion drops more than 15% against baseline for four consecutive weeks post-launch, we roll back the pricing page and triage."
- "If organic impressions fall 20%+ at day 30 and haven't recovered by day 60, the migration SEO plan gets a forensic review before any new feature work."
- "If editors aren't publishing within six weeks of CMS training — regardless of whose fault it is — the workflow gets redesigned, not the editors."

Writing these before launch feels morbid. It's actually the kindest thing you can do for the project, because post-launch problems are guaranteed to arrive *eventually*, and deciding in advance what triggers action means the response is a plan instead of a blame seminar. Kill criteria also protect the redesign from its most dangerous enemy: the stakeholder who disliked it all along and treats any wobble as vindication. Pre-agreed thresholds separate signal from schadenfreude.

## Reporting cadence that survives launch fog

Launch week produces a strange weather: everyone in the company has an opinion, the CEO forwards a rendering bug from their cousin's Android, and a competitor chooses that week to announce something. If your reporting cadence is "we'll keep an eye on it," the loudest anecdote wins by Friday.

The structure that survives: a **shared results page** (not a slide deck — a living page) with the two or three primary metrics, the baseline, the comparison window, and a dated log of every change shipped post-launch, so movements can be matched to causes. Then:

- **Day 3, day 7, day 14:** technical checks only — tracking integrity, vitals, error rates. No verdicts. Declaring a launch "working" or "flopping" in week one is reading tea leaves with confidence.
- **Day 30, 60, 90:** outcome reviews against the pre-registered window, with the kill criteria on the table.
- **Quarterly for a year:** the honest retrospective. Some redesign wins take two quarters to compound — [content and SEO gains especially](/journal/growth/content-strategy-compounds) — and abandoning the measurement at day 30 is how good projects get quietly mislabelled as failures.

The first 90 days have their own rhythms and traps; our [post-launch playbook](/journal/playbooks/first-90-days-after-launch) covers the operational side. Goal-wise, the rule that matters most is the simplest: the people who set the goals should be the people who read the results. Delegating measurement to the least senior person in the building is how goals quietly become vibes again.

## Key takeaways

- "Feel modern" is a mood, not a metric. Find the buried problem before setting goals.
- Two or three primary metrics, each falsifiable, influenceable, and owned by a named human.
- Capture 12 months of baselines *before* the build, and fix old-site tracking even though it feels absurd.
- Separate output goals (promises) from outcome goals (bets with a stated causal chain). Sign both columns.
- Every goal needs a kill criterion — deciding triggers in advance turns post-launch problems into plans.
- Pre-register the comparison window, report on a living page at day 30/60/90, and let the goal-setters read the results themselves.

## FAQ

**What if stakeholders can't agree on the primary metrics?**
That disagreement is the most valuable discovery a kickoff can produce — better surfaced in a workshop than in the post-launch review. Force a vote, make the losers' metrics watchlist items, and write down who chose what. If alignment is the real problem, run that process first; we have a whole playbook on [aligning stakeholders without design by committee](/journal/playbooks/stakeholder-alignment-design).

**Isn't it unfair to judge a redesign on numbers when brand perception matters?**
Brand perception *is* measurable, just slower: share of search, direct traffic trends, and simply asking sales reps whether they send the site to prospects without apologising. What isn't acceptable is making perception the stated goal precisely *because* it can't be checked. Unmeasurable goals aren't ambitious — they're alibis.

**How big should the expected lift be to justify a redesign?**
There's no universal threshold, but do the arithmetic anyway: if qualified demos are worth $X annually and a credible lift is 20%, a redesign costing more than two years of the delta is a branding decision wearing an ROI costume. Branding decisions are legitimate — just make them with eyes open, as a [pricing conversation](/pricing), not a spreadsheet fantasy.

**The old analytics are a mess and leadership won't wait a quarter to fix them. Now what?**
Then your honest options are narrower goals (outcomes you can verify regardless — vitals, publishing velocity, conversion events you instrument fresh) or a parallel-tracked quarter where the old site's tracking is quietly repaired during design. What doesn't work is pretending the comparability problem away. It will be waiting for you at the 90-day review, holding a grudge.
