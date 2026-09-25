---
title: "Discovery sprints: two weeks that de-risk six months"
description: "Our discovery sprint format, published: inputs, the ten days, the decision memo output, who must attend, and when discovery is a stall dressed as diligence."
slug: discovery-sprint-playbook
cluster: playbooks
tags: [discovery sprint, product discovery, project kickoff, de-risking, agency process]
date: 2024-11-28
author: Ruby Castellanos
keywords: [discovery sprint, product discovery, discovery phase, project kickoff, design sprint agency]
readingTime: 10
---

Every project we've ever run has an invisible fork in week one: either the team spends two weeks finding out what's true, or they spend six months finding out what wasn't. Discovery is how you buy the first option. Done well, it's the highest-leverage fortnight in any engagement — the difference between a build priced on evidence and one priced on hope. Done badly, it's a stall dressed as diligence, and we'll cover how to tell the difference at the end.

This is our actual format, the one behind projects like the [Brightmarsh onboarding rebuild](/work/brightmarsh-onboarding) and the [Sundial travel planner](/work/sundial-travel-booking). Publish-and-reuse: if your own team can run it without us, you should.

## What a discovery sprint is for (precisely)

A discovery sprint exists to convert a brief into a **decision-ready plan**: a validated problem, a scoped build with decomposed estimates, and a written recommendation for what to build first, what to skip, and what to stop doing. It is the paid trial that answers, with evidence, the questions proposals can only gesture at — it's also the fastest way to [test an agency](/journal/playbooks/choosing-an-agency) before committing to a build.

It is not for: producing a clickable prototype (sometimes it yields one, as a side effect), replacing ongoing product discovery (it's a spike, not a cadence), or giving stakeholders a feeling of involvement (stakeholders get *accountability* instead, which they tend to prefer once they've tried it).

## Day zero: the inputs

The sprint starts before the sprint. A week out, we ask for five things, and the client's ability to produce them is itself diagnostic:

1. **The evidence pile**: analytics export, funnel numbers, support-ticket themes, sales-call recordings or notes, churn interviews. We don't need it tidy; we need it real.
2. **The access list**: staging environments, the codebase or a walkthrough, the CMS, the analytics admin. Delays here are the number-one discovery killer — provision access *before* day one or move day one.
3. **The constraint doc**: the fixed / negotiable / unknown sorting from a [well-made brief](/journal/playbooks/writing-a-great-brief).
4. **The humans**: named, with hours committed (below).
5. **The decision this sprint will inform**, stated as a sentence: "Decide whether to rebuild the onboarding in place or fold it into the platform rewrite." A sprint without a decision is a research hobby.

## The fortnight, day by day

**Days 1–2: Interrogate.** Stakeholder interviews — the people who own the problem, not the people who were free — plus the evidence pile read cover to cover. We run interviews as [jobs-to-be-done conversations](/journal/product/jtbd-interviews-that-work) where users are the subject: hiring stories, last-time narratives, no opinions solicited. Two interviews per day per interviewer, written up same-day while the qualifiers are still warm.

**Day 3: The map.** The team draws the current state as one artefact: the real user journey (instrumented where analytics exist, reconstructed where they don't), the system landscape (what integrates with what, in what condition), and the metric baseline. Everything the build will touch, on one picture. This map is where the first surprises live — the undocumented integration, the funnel step nobody owned.

**Days 4–5: Decompose.** The candidate build is broken into estimate-grade units (the discipline from [how studios price](/journal/playbooks/estimating-software-projects)), each with risk loading and, crucially, *the experiment or test that would reduce the loading*. Integrations get sandboxed and poked — not designed, *poked*: twenty minutes with the vendor's real API is worth two days of reading their marketing documentation.

**Days 6–7: Thin-slice prototypes.** We build the riskiest assumption's cheapest test: a real-data spike of the hardest integration, a paper-thin prototype of the scariest flow shown to five users, a concierge version of the clever feature. Note what this is not: a design exploration. The question under test is "is the plan true", not "what should it look like".

**Days 8–9: Decide.** Findings converge into the decision memo (below). The draft circulates day 8; a two-hour working session day 9 red-pens it live — numbers challenged, descoping arguments had out loud, the recommendation defended or changed.

**Day 10: Readout and handover.** Ninety minutes: the map, the evidence, the memo, the quote. Attendance is mandatory for decision-makers; a readout the deciders skip is a sprint that will be re-litigated in month three, at build prices.

## The decision memo: the actual deliverable

Everything else is working paper. The memo is the product, and it has a fixed skeleton — five pages, six sections:

1. **The decision and the recommendation** — one paragraph, first. No throat-clearing.
2. **What's true** — the validated problem with its evidence, and the baseline metrics written down (you can't claim a lift later against a number nobody recorded).
3. **The build plan** — decomposed scope, per-line estimates with risk loading, team shape, timeline. This is the quotable quote: granular enough to hold a studio to, including us.
4. **What we cut and why** — descoping is a recommendation, not an apology. Each cut names the evidence that justified it and the trigger that would revive it.
5. **Risks left standing** — the unknowns that survived the fortnight, each with an owner and a mitigation priced or scheduled.
6. **The kill criteria** — what evidence, discovered during the build, should change the plan. Pre-committing to kill criteria is the difference between a plan and a religion.

The memo belongs to the client, including the numbers. Take it to another studio if you like — a discovery worth paying for prices the work honestly enough to survive that. (We've won builds this way and lost them this way; both outcomes beat a build founded on vibes.)

## Who must be in the room

The attendance rule that makes or breaks discovery: **every decision the build will need must have its owner reachable within hours, not weeks.** Concretely:

- **The decision-maker** — 2 hours at kickoff, the day-9 working session, the readout. Not negotiable. A sprint whose decider is "keeping an eye on it" produces a recommendation with no one to recommend to.
- **A product/operations owner** — the person who knows how the thing actually runs, half-time for the fortnight.
- **An engineer who knows the estate** — a day of walkthroughs plus on-call access during the integration poking. The ratio of discovery value to legacy-system access is near one.
- **Users** — five to eight, recruited ahead of the sprint. The memo's "what's true" section is only as strong as these conversations.

And from the studio's side: the same senior people who will run the build. Discovery staffed by a sales-adjacent team who then throw the memo over a wall is theatre with nicer stationery.

## When discovery is a stall

The honest audit, since we sell these: discovery is worth its fee exactly when there's a real, consequential unknown — an untested integration, an unevidenced problem statement, a scope too fuzzy to price. It is a stall when: the problem is already evidenced and the scope is narrow (just build the thing, or at most take the planning week); the "discovery" is really internal politics needing a referee (hire a facilitator; it's cheaper and more honest); or the output is a slide deck nobody can act on, priced per slide. Our deciding question before accepting any discovery engagement: *what decision does this inform, and who will make it on day ten?* If the answer is a shrug, we say so and quote the build with the risk loading visible. Sometimes the bravest, cheapest discovery is the first two weeks of the [actual engagement](/approach) with harsh kill criteria attached.

## Key takeaways

- Discovery converts a brief into a decision-ready plan: validated problem, decomposed quote, kill criteria. Define the decision it informs before day zero.
- Inputs are diagnostic: evidence pile, access provisioned in advance, sorted constraints, named humans, a decision sentence.
- The fortnight has a shape: interrogate, map, decompose, poke the risky integrations, thin-slice test, decide, readout. Attendance rules are the load-bearing part.
- The deliverable is a five-page decision memo the client owns — including the numbers, usable with any studio.
- Discovery staffed by a different team than the build is theatre; insist on continuity.
- It's a stall when there's no real unknown, when it's refereeing politics, or when the output is a deck nobody can act on.

## FAQ

**How much should a discovery sprint cost?**

Enough that the senior people doing it are the ones who'll build — for a two-senior-person fortnight with research and integration spikes, that's typically 8–12% of the build cost it informs. Credited-back or free discovery is priced at zero and worth it. Judge it by the deliverable: would you pay this fee for the memo alone, if there were no build afterwards? You should be able to say yes.

**Can we run discovery internally without an agency?**

Yes, and teams that can, should — the format above transfers cleanly. The honest constraint is evidence-blindness: internal teams carry assumptions about why users behave as they do that an outside interviewer doesn't. If you run it yourself, import one outsider (a freelancer researcher counts) purely to interview users and read the evidence pile first.

**What if discovery finds we shouldn't build anything?**

Then it paid for itself at a multiple no build ever matches. It happens more often than agencies admit — a third of our discoveries shrink or reshape the brief substantially, and a handful end in "the spreadsheet plus an integration does this". A studio that has never delivered that memo has never run a real discovery.

**How is this different from a design sprint (the Google Ventures kind)?**

A GV sprint validates a concept with a prototype in five days; a discovery sprint validates a *plan* — evidence, integrations, estimates, decision — in ten. They compose well: discovery first (what's true, what to build), GV sprint inside the build's first phase if the concept risk demands it. Confusing them produces beautiful prototypes of unbuildable products.

**The build team changed after our discovery — did we waste the money?**

Mostly no, if the memo is good: the evidence, decomposition and risk loading transfer. What doesn't transfer is calibration — the new team's actuals differ, so re-baseline the estimates with their ratios during week one. This is why we insist the memo is client-owned, and why the readout day matters: the knowledge has to live in the room, not in one agency's heads. If your last discovery produced knowledge you can't carry, the next one is on us to fix — that's literally what the [contact page](/contact) is for.
