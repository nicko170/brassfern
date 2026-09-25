---
title: "Landing page testing: velocity over genius"
description: "A landing page experiment programme that compounds: message-match first, structural swings second, a backlog scoring model that survives meetings, and kill criteria."
slug: landing-page-testing-program
cluster: growth
tags: [cro, landing pages, experimentation, ab testing, conversion]
date: 2025-05-28
author: Sam Whitfield
keywords: [landing page testing, cro program, ab testing landing pages, experiment velocity]
readingTime: 10
---

Every landing page testing programme starts the same way: enthusiasm, a testing tool subscription, and a workshop that generates forty test ideas. Ninety days later the programme is dead — not because the tests lost, but because they took so long that the one stakeholder who mattered stopped reading the results emails. The postmortem says "CRO didn't work here". What actually happened is the programme was designed for genius — each test a precious, hand-crafted, committee-approved bet — when compounding only ever comes from velocity.

After running experiment programmes across retainer clients — e-commerce, SaaS, services — our position has hardened into something close to a law: **a programme that ships a decent test every week will beat a programme that ships a brilliant test every quarter, almost every time.** Not because any single decent test wins. Because velocity buys learning density, learning density buys better hypotheses, and better hypotheses are the only durable advantage in CRO. Here's the operating system we install.

## The two failure modes: genius syndrome and widget churn

Before the fix, name the diseases.

**Genius syndrome** treats every test as a moonshot: full redesigns, six-week design phases, tests that take a quarter to build and run. When they win, the win is unattributable (seventeen things changed); when they lose, nothing is learned except "not that". Worst of all, the cost per test means nothing can be killed casually, so sunk cost politics infect every readout.

**Widget churn** is the opposite disease, common in teams that discover CRO blogs: button colours, hero-image swaps, exclamation marks on CTAs. Tests are cheap and fast and teach nothing, because they're not hypotheses — they're jitter. A year of widget churn produces a landing page that is locally optimised and globally incoherent, a palimpsest of micro-wins nobody can explain.

The programme that works sits between: tests cheap enough to kill without ceremony, but each one a *written hypothesis about the customer* rather than a UI dice-roll. That sentence — cheap to run, expensive to think — is the entire culture.

## Message-match first: the tests that pay for the programme

If you run paid traffic at all, the first month of any programme belongs to message-match testing, because the economics are obscene. The visitor arrives carrying the promise your ad made. Every pixel between that promise and your headline is a leak. Fixing the leak is not subtle creative work — it's alignment work:

- **Build one landing variant per distinct ad angle**, not per ad group. If your ads run three angles (price, speed, status), you need three landing messages, each repeating the angle's promise in its own voice in the first screenful. The headline is a receipt for the click.
- **Test the receipt, not the layout.** Same page structure, different message. Message tests routinely produce double-digit conversion deltas; layout tests on mis-matched messages produce noise on top of a leak.
- **Count intent honestly.** Judge message-match variants on downstream quality (trial-to-paid, lead quality score) where you can, because a warmer promise can lift clicks while degrading fit.

The design trap to avoid: message-matched pages drifting into three unrelated art directions. The [hero pattern work we wrote about in web design](/journal/web-design/hero-patterns-beyond-gradient) applies — the system should flex in message, not fragment in craft. One component system, many promises.

## Structural swings: when the whole frame is the variable

After message-match, the highest-value tests are *structural* — changes to the page's argument, not its furniture. The repertoire we cycle through:

- **Reorder the argument.** Proof-first (leads with customer evidence) versus promise-first (leads with the outcome) versus problem-first (leads with the pain). These aren't layouts; they're different theories about what your visitor needs to believe first.
- **Change the ask.** Demo vs trial vs pricing page vs sample. The ask is a variable, and for mid-commitment products it's often *the* variable. We've seen "watch a 3-minute tour" beat "start free trial" for complex products — lower friction, higher eventual conversion, and a better-informed sales pipeline.
- **Length as a bet.** Long-form argument versus concentrated one-screen page. The right answer correlates with consideration cost and traffic warmth, and the only way to know is the test. Notably, the form itself is part of the structure — [form design decisions](/journal/web-design/forms-people-finish) routinely swamp headline decisions in impact.
- **Objection placement.** Moving the pricing objection from "discovered at the end" to "addressed in the second section" is a structural test we run almost by default now, because it wins so predictably for considered purchases. Saying the expensive part early, with confidence, filters rather than frightens.

One structural test per cycle, run clean, teaches more than a dozen widget tests — this is where "expensive to think" earns its keep.

## The backlog scoring model that survives meetings

Every programme needs an idea backlog that doesn't get hijacked by the loudest voice in the review. We've used ICE, we've used PIE, and our settled model is a stripped variant we call the honest three — each idea scored 1–5 in the meeting, out loud, with one rule: **evidence claims must cite their evidence.**

1. **Signal** — is there actual evidence this address a real friction? Session recordings, support tickets, funnel data, prior tests. An idea with no signal is a hunch, and hunches score 1 by house rule. This single rule transforms backlog quality in a month, because it makes *gathering evidence* the cheapest way to get your idea tested — which channels stakeholder energy into research instead of advocacy.
2. **Exposure** — how much of the valuable traffic touches this variant? A checkout test outranks a footer test regardless of either's cleverness.
3. **Effort** — inverted: 5 means a designer-engineer pair ships it this week. The scoring bias toward cheap tests is deliberate and declared; it exists to resist genius syndrome.

Ideas enter as one sentence in the customer's language ("Visitors from comparison ads don't believe we're faster because the page never shows a number"). Scored monthly, top of the pile ships weekly. The whole ritual takes forty-five minutes and, more importantly, survives leadership changes — the graveyard of most programmes.

## Kill criteria, written before the variant

Every test we run has, written in its brief before launch: the primary metric, the minimum detectable effect worth acting on, the maximum runtime (typically four weeks or two business cycles), the guardrail metrics, and the decision rule for each outcome — including "flat". Flat results get a decision too (usually: revert, log the learning, move on), because a programme without defined flat-result behaviour becomes a museum of abandoned variants nobody dared to turn off.

Two disciplines keep the statistics honest without needing a data scientist in residence:

- **Don't peek.** Sequential peeking at p-values is how teams ship noise. We use fixed-horizon reads (with Bayesian tools where the team prefers them — the discipline that matters is deciding in advance when you'll decide).
- **Respect the honest denominator.** A landing page test's effect is on *this traffic, this month*. Winners get re-validated before rollout to new segments, and seasonality-exposed results get re-run. The most expensive sentence in CRO is "it tested positive", said about a test that caught a holiday weekend.

And one cultural rule that pays for everything else: losses are read aloud with the same ceremony as wins. "The pricing-anchored hero lost by 8%, which means our value story isn't price-led — that's the referral programme's positioning confirmed from the other side" is a *result*. Teams that celebrate losses ship more tests; teams that only celebrate wins start quietly not shipping the risky ones. Which is genius syndrome through the back door.

## Cadence and the compounding chart

The operating rhythm we install: one test in market always, one in build, a scored backlog of ten-plus, a monthly scoring session, a quarterly step-back asking "what do we now believe about our customer that we didn't in January?". That quarterly belief-log — not the win rate — is the programme's actual product. Win rates of one-in-three are healthy; teams advertising higher are running widget churn.

After a year, the compounding is visible: the page converts better, yes — but more valuably, the team has a tested theory of their customer that product, pricing and [lifecycle messaging](/journal/growth/lifecycle-email-architecture) all draw from. The landing page was just where the theory was cheapest to build. And when measurement questions arise — did the wins survive rollout, what do we credit — the [attribution discipline](/journal/growth/attribution-models-honest) applies: holdouts, tiers of confidence, precision that admits the fog.

This is the exact shape of our [growth retainers](/services/growth): a weekly testing heartbeat with strategy around it. If your programme died of genius syndrome, that's curable — [see how engagements work](/pricing) or [start the conversation](/contact).

## Key takeaways

- Velocity beats genius: a decent weekly test compounds learning; a quarterly moonshot mostly produces politics.
- Month one belongs to message-match: one variant per ad angle, the headline as receipt for the click, judged on downstream quality.
- Then test structure, not furniture: argument order, the ask itself, page length, objection placement.
- Score the backlog on signal, exposure and effort — with evidence citations mandatory, so research beats advocacy.
- Write kill criteria before launch: primary metric, max runtime, guardrails, and a defined decision for flat results. No peeking; celebrate losses aloud.

## FAQ

**How much traffic do we need for a landing page testing programme?**
The comfortable threshold is roughly a thousand conversions a month on the tested page, which supports detecting mid-single-digit relative lifts in reasonable windows. Below that, don't abandon testing — change the instrument: bigger structural swings (which produce larger effects), longer runtimes, and qualitative triangulation from session recordings and five-second tests. Low-traffic CRO is slower and cruder, not impossible.

**Should we use A/B/n test multiple variants at once?**
Only with the traffic to support it, and rarely more than three cells. Every extra variant taxes runtime non-linearly and multiplies the ways results get misread. The far more common sin is one-variant-at-a-time thinking applied to *sequential* changes that never get tested at all — the fix for most teams isn't more cells per test but more tests per quarter.

**How long should a test run?**
Minimum two full business cycles (two weeks for most B2C, longer for sales-cycle products), maximum four — set in advance, as a kill criterion. A test that "hasn't reached significance" after four weeks has reached a decision: the effect, if any, is too small to matter at your traffic levels. Call it flat, log it, and spend the next cycle on a bigger swing.

**When do we stop testing a page and rebuild it instead?**
When the winning variants keep making the same point in different clothes — that's the system telling you the ceiling is structural. A tested theory ("our visitors need proof before promise") then becomes the brief for a genuine redesign built on wins rather than opinions. Rebuilds informed by a year of test learnings beat both endless iteration and redesign-by-committee; the sequence is iterate, extract theory, rebuild, resume iterating.
