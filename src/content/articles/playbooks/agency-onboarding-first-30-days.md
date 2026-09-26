---
title: "The first 30 days: onboarding a client engagement"
description: "How the first 30 days of an agency engagement should run: kickoffs that surface real decision-makers, baseline metrics, access week, and artefacts that prevent surprises."
slug: agency-onboarding-first-30-days
cluster: playbooks
tags: [agency onboarding, kickoff, client engagement, project setup, baseline metrics]
date: 2025-10-09
author: Ruby Castellanos
keywords: [agency onboarding process, client kickoff agenda, engagement kickoff, project onboarding checklist]
readingTime: 10
---

Projects rarely fail in month three. They fail in week one, quietly, and month three is when the bill arrives — the decision-maker nobody knew about, the integration dependency nobody asked about, the metric everyone assumed someone else was capturing. The first thirty days of an engagement are the cheapest time to prevent all of it, and the most squandered.

Here's how we run the opening month at Brassfern — told from our side, but written so a client can use it as a checklist for *any* agency they're onboarding. If your new partner's first month doesn't look roughly like this, ask why.

## Days 1–5: the kickoff that finds the real room

A kickoff has exactly one job that matters: exposing the *actual* decision structure before it sabotages you. Every organisation has the org chart on the website and the org chart that's true. The second one is the one that approves your work.

So our kickoff agenda is short and pointed:

1. **Ninety minutes, no decks.** Whoever presents a forty-slide capabilities deck at kickoff is performing reassurance, not alignment. We bring one page of questions.
2. **The decision walk.** "Walk us through the last significant decision this project team made — who proposed it, who weighed in, who actually said yes, and how long it took." The answer maps power better than any RASCI chart, and it surfaces the Reviewer Nobody Mentioned while there's still time.
3. **The failure interview.** "What's the worst way this project could go, and what would we have done to cause it?" Asked separately to three stakeholders, the answers triangulate the real risk register. Founders fear losing momentum; marketing leads fear a launch that embarrasses them; engineers fear inheriting a mess. All three are probably right.
4. **Success in numbers, agreed in the room.** One to three metrics with current values, target values, and measurement dates written down *before* work starts. Not "improve conversion" — "checkout completion from 61% to 70% by the end of Q2, measured in the existing analytics." The discipline we describe in [activation metrics that mean something](/journal/product/activation-metrics-honest) applies to engagements as much as products.
5. **The calendar, visualised.** Every stakeholder holiday, board meeting, campaign freeze and season blackout for the next six months on one shared timeline. The October surprise is always on someone's calendar in April.

Output of day one, published by day two: a one-page engagement charter — goal, metrics, decision-makers (with the real ones named), cadence, escalation path. Everyone signs it; everyone can quote it later.

## Days 6–10: access week and the quiet audit

Week two is plumbing, and plumbing exposes truths. We request access to everything relevant on day six — analytics, ad accounts, CMS, repos, error tracking, search console, support tools, the lot — and we track which requests take five days and involve four people. Those bottlenecks *are* the project's future, arriving early as a free preview.

While access arrives, we run the quiet audit: not a deliverable, just the agency reading the instruments it's about to be judged by. Analytics implementations are [governance problems wearing a technical costume](/journal/growth/analytics-governance) — this is when we find the double-counted pageviews, the broken funnel events, the "users" metric that's actually sessions. We also pull a performance baseline, because if we don't capture the Core Web Vitals and bundle weight on day six, we'll never be able to prove what improved on day ninety. The full capture list mirrors our [technical SEO checklist](/journal/growth/technical-seo-launch-checklist): vitals, indexation, top queries, conversion funnels, support-ticket volume by theme.

If the measurement is untrustworthy — and week two is when we can still say so safely — fixing the instruments becomes task zero. Agreeing to be judged by a broken ruler is how both parties end up furious.

## Days 11–20: the cadence hardens

Weeks three and four are when the project's operating system gets installed:

**Weekly demos from week one**, even when the demo is embarrassingly thin. Demoing a colour palette and a data model in week one feels silly; that's the point. The demo is not a status report, it's a forcing function — its format and culture deserve their own playbook, and get one. What matters here is that by week three, watching working software every Friday is already the room's habit, not a ceremony we've announced.

**One channel of truth, named.** Decisions live in one place (we use a running decision log; email threads are where decisions go to be forgotten). A stakeholder can disagree with a decision, but nobody gets to discover it three weeks later.

**Office hours over availability theatre.** Open-ended Slack access produces warmth and archaeology problems. We hold two hours of scheduled drop-in weekly plus async answers inside a day. Predictable beats instant; nobody actually needs us at 11pm, and the ones who think they do need a better escalation path instead.

**The risk list, in public.** By day twenty the shared board carries a living risk register — integration unknowns, content dependencies, stakeholder availability — each with an owner and a next-check date. Risks that live in a producer's head are wishes. This is also when honest [estimation](/journal/playbooks/estimating-software-projects) earns its keep: ranges and named assumptions, so month-two surprises are at least month-one *named* surprises.

## Days 21–30: first proof and the month-one retro

By the end of the first month, something real must exist. Not a plan, not a mood board — a working slice, however ugly: a deployed skeleton of the system, a functioning checkout path behind a flag, a designed-and-coded component living in the real codebase. The shape matters less than the fact: the engagement produces *working things*, continuously, from the first month onward. Discovery-heavy engagements get their own shape — our [discovery sprint playbook](/journal/playbooks/discovery-sprint-playbook) covers the two-week version — but the principle survives translation: evidence over assurance.

Then the month-one retrospective, client included, three questions: what's slower than it should be, what's more confusing than it should be, what did we not ask in week one that we now wish we had. The retro is cheap at day thirty and priceless by comparison at day ninety, when the same answers will be delivered as a complaint.

## What month one buys

Run like this, the first thirty days produce an unglamorous harvest: a signed charter, verified baselines, a mapped decision structure, an installed weekly rhythm, a working slice of the thing, and a retro that already surfaced its first course correction. None of it shows up in a portfolio. All of it is why the portfolio piece exists.

The counterfactual is the project that skips all of it to "start faster": by day sixty they have momentum, mystery stakeholders, unmeasured progress, and a kickoff deck ageing like milk. Month one done right doesn't feel fast. It feels *unhurried* — the specific calm of a project whose foundations are load-bearing.

## Key takeaways

- Kickoff's real job is mapping the true decision structure: run the decision walk and the failure interview, then name everyone in a one-page charter.
- Agree success in numbers in the room, day one — metric, current value, target, date.
- Access week is a free audit of the client's own bottlenecks; watch what takes five days.
- Capture performance and analytics baselines in week two or lose the ability to prove improvement later.
- Demo weekly from week one; the thin early demo is a feature, not an embarrassment.
- End the month with a working slice and an honest shared retro — evidence over assurance, from day thirty onward.

## FAQ

### What should a client prepare before the kickoff?

Three things multiply the first month's value: access credentials ready for every relevant system (analytics, CMS, repo, ad accounts), one internal person empowered to make day-to-day calls within a week — not a committee — and a frank one-pager on why previous attempts, if any, struggled. The agency should be asking for all of this before day one; if they aren't, send it anyway.

### How many meetings is too many in the first month?

The test isn't the count, it's the artifact: every recurring meeting should produce a decision, a demo, or a removed risk. Our opening month typically runs kickoff, one stakeholder week, weekly demos, and office hours — five standing commitments, everything else async. If your calendar is full and your decision log is empty, you have meeting theatre.

### What if important stakeholders refuse to attend kickoff?

That's not a scheduling problem, it's a forecast: the absent executive is a future surprise review. Escalate kindly but firmly — offer a thirty-minute exec pre-brief before kickoff, and get their one constraint and one success metric in writing. A stakeholder who won't give thirty minutes in week one will happily take three meetings to veto your work in week nine.

### Can the first month be shorter for small projects?

Compress, don't skip: a three-week project still needs the charter, the baseline, and the demo habit, just at day-scale resolution. What disappears with timeline pressure is slack, not discipline. The smallest engagement we've run still did the failure interview — it took twelve minutes and rewrote the scope.
