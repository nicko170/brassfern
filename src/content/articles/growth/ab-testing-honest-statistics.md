---
title: "A/B testing statistics for people who ship"
description: "Reading A/B tests honestly: minimum detectable effects, the peeking problem, novelty effects, segment traps, and the decision log that ends the arguments."
slug: ab-testing-honest-statistics
cluster: growth
tags: [a/b testing, experimentation, cro, statistics, decision making]
date: 2026-07-14
author: Sam Whitfield
keywords: [a/b testing statistics, experiment design, statistical significance, conversion rate optimisation, novelty effect]
readingTime: 10
---

Most A/B testing programmes don't fail on statistics. They fail on theatre: dashboards full of "winners" that evaporate on rollout, tests stopped the afternoon they turn green, ninety variants launched at a sample size that couldn't detect a marching band. The teams that get real compounding value from experimentation — and we run these programmes inside our [growth retainers](/services/growth) — are not more mathematical than the average team. They are more *disciplined*, in five specific places.

This is the practical version of that discipline. Not a stats course — a field manual for people who ship. For the broader question of which experiments are worth running at all, pair this with our [field guide to honest testing](/journal/growth/cro-experiments-that-matter).

## Size the test before you run it

Every test starts with one number: the **minimum detectable effect** (MDE) — the smallest lift you would actually act on. Not the lift you hope for. The lift that, if real, justifies shipping and maintaining the change.

This number changes everything downstream. Detecting a 1% relative lift on a checkout converting at 3% takes hundreds of thousands of sessions. Detecting a 15% lift on a neglected onboarding step might take two weeks. Teams that skip the MDE conversation end up running under-powered tests and then arguing about the noise, which is worse than not testing at all — at least untested intuition doesn't come with a chart.

The maths is any sample-size calculator; the discipline is in the conversation before it:

- **Write down the MDE, the baseline rate, and the required sample size in the experiment doc.** If the required runtime is three months, the honest options are: find a bigger change to test, accept a larger MDE, or don't run the test. "Run it anyway and squint" is not an option; it's how theology starts.
- **Power at 80%, significance at 95%, and stop fiddling with the dials.** Lowering significance to 90% because leadership is impatient doesn't create evidence; it creates a 1-in-10 false-positive machine that will eventually ship something embarrassing.
- **One primary metric.** The metric the test is designed to move. Everything else is a guardrail (did we break revenue, retention, page speed?) or a curiosity. Tests with five "primary" metrics are five tests wearing a trench coat, and they'll find a spurious winner in one of them about a third of the time.

## The peeking problem, and what to do about it

Classical significance testing assumes you look at the results exactly once, at the end. Every additional peek inflates the false-positive rate — and everyone peeks. Stakeholders peek. You peek. The dashboard is right there.

A test you check daily and stop "when significant" will produce a winner roughly one time in three even when nothing changed. This is the single most common source of phantom wins we've audited in client programmes, and it's invisible in retrospect: the test record says "p < 0.05 at stop" and that's technically true and practically meaningless.

Three workable fixes, in ascending order of rigour:

1. **Fixed horizon, held with social glue.** Commit to the runtime in the experiment doc, put the end date in the team calendar, and make peeking results-inadmissible before the date. This works until the first genuinely urgent stakeholder meeting.
2. **Sequential testing methods.** Group sequential designs or always-valid p-values (mSPRT and friends, built into most mature experimentation platforms) let you look whenever you like with controlled error rates. If your platform supports it, turn it on and stop having the conversation.
3. **The cooling-off rule.** Whatever your method, no test ships within one business week of turning green. Novelty spikes and weekday skew die in that window; real effects don't. It costs you five days and saves you quarterly.

## Novelty effects and their evil twin

Roll out a changed header and returning users often poke it because it's *new*, not because it's better. The effect shows as a lift that decays over the first two weeks — and a test stopped in week one banked the novelty, not the improvement. The fix is boring: run tests long enough for at least two full weekly cycles, and for changes aimed at returning users, look at the trend over time, not just the pooled average. A winner whose lift has halved every week is telling you something.

The evil twin is the **change aversion dip**: beloved features get punished for a fortnight by habitual users, then recover. Killing a genuinely better flow on week-one data is as common as banking novelty. This is why "run it longer" isn't pedantry — it's the entire game for products with loyal repeat usage, as any [lifecycle](/journal/growth/lifecycle-email-product) or subscription team knows.

## Segment traps

The test came back flat overall, someone slices it seventeen ways, and — look! — a 22% lift among mobile users in the second week on the pricing page. Ship it to that segment?

Almost certainly not. Slicing multiplies comparisons, and multiplied comparisons manufacture winners out of noise. The rules we enforce:

- **Pre-registered segments only.** If you hypothesised that new vs returning users would respond differently *before* the test ran, that's a legitimate read. A segment discovered by trawling the wreckage of a flat test is a lottery ticket.
- **Segments need their own power check.** Overall sample was adequate, so the mobile sub-segment with 8% of the traffic is… not. Do the maths again or treat the result as a hypothesis generator, nothing more.
- **Interaction beats subset.** "The effect differs between segments" is a different claim from "the effect exists in one segment", and it needs an interaction test. The subset read is how you end up shipping a mobile-only header that did nothing.

## The decision log

Every experiment programme we've seen decay into argument had the same missing artefact: a place where decisions were written down before results existed. Ours is a single table — experiment doc, one row per test, filled in *at launch*:

| Field | Example |
| --- | --- |
| Hypothesis | Showing delivery dates on the PDP cuts checkout anxiety for gift buyers |
| Primary metric | Checkout completion rate |
| MDE | 6% relative |
| Runtime / sample | 28 days, ~34k sessions per arm |
| Guardrails | Revenue per session, page LCP |
| Ship criteria | Primary ≥ MDE, guardrails neutral |
| Kill criteria | Runtime exceeded, guardrail breach, or flat at full sample |
| Owner | Sam |

Filling this in takes twenty minutes and prevents the three most corrosive endings: the test that runs forever waiting to be right, the flat result relabelled as "directionally positive", and the re-litigation six months later when a new stakeholder asks why the header looks like that. The log answers: because we tested it, here's what happened, here's what we decided. The log also feeds straight into the wider measurement plan — the artefact we insist on [before any build starts](/journal/playbooks/measurement-plan-before-build).

## When not to test

Honest statistics includes the honesty to say no:

- **Traffic can't support the MDE you'd care about.** Use research, session replays, and [structured UX review](/journal/growth/cro-experiment-design) instead. A test that can only detect a 30% lift will correctly ship nothing for years.
- **The change is obviously right.** Accessibility fixes, speed improvements, broken-link repairs — ship them. Testing whether the site should be faster is how you get a slower site with a changelog.
- **You can't act on the answer.** If engineering won't ship variant B regardless, the test is a very expensive opinion poll.

And the meta-rule: a testing programme is itself an experiment. If, after six months, the shipped winners don't show up in the aggregate baseline, your detection pipeline is producing phantoms — go back to peeking, power, and novelty before you buy more traffic.

## Key takeaways

- Define the minimum detectable effect before anything else. It dictates runtime, and runtime dictates whether the test should exist.
- Peeking without a sequential method manufactures winners. Fix the process, not the willpower.
- Novelty lifts and change-aversion dips both die in weeks three and four. Two full weekly cycles, minimum.
- Segments found after a flat result are hypotheses, not findings. Pre-register or regenerate.
- The decision log — hypothesis, MDE, ship and kill criteria, written before launch — is the artefact that keeps the programme honest.
- Don't test what you can't power, what's obviously right, or what you can't ship.

## FAQ

**How long should an A/B test run?**
Long enough to reach the pre-computed sample size and cover at least two full weekly cycles, whichever is longer. Most healthy tests land in the two-to-six-week range. Anything requiring three-plus months needs a bigger change, a bigger MDE, or a different method.

**Is 95% significance really necessary?**
It's a convention, not a law — but pick your convention in advance and keep it. The sin isn't choosing 90%; it's choosing after seeing the result. If your organisation's risk appetite supports 90%, say so in the decision log template and live with a higher false-positive rate knowingly.

**What do we do with flat tests?**
Celebrate them properly. A well-powered flat result is information: the thing you thought mattered doesn't, at this magnitude. Log it, share it, and let it steer the next hypothesis. Programmes that only celebrate winners teach everyone to hunt for phantoms.

**Bayesian or frequentist — does it matter?**
Far less than the internet argues. Both frameworks produce phantom winners under peeking and small samples, and both behave under discipline. Pick whichever your platform supports well, learn its stopping rules, and spend the saved energy on hypothesis quality.

**Can we run multiple tests at once?**
Yes, if the tests don't touch the same user journey or the same metrics, and if your platform handles assignment cleanly. Colliding tests on the same flow contaminate each other quietly. When in doubt, sequence them — a queue of good tests beats a soup of interacting ones.

**Our boss wants to "just test everything". What do we say?**
Show them the MDE maths for one representative page, then the false-positive rate of peeking, then the cost of the programme. Most "test everything" enthusiasm is really "I want decisions to be evidence-based" — which the decision log delivers at a fraction of the test count. Offer that.
