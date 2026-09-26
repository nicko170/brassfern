---
title: "Estimating software honestly: ranges, risks and why we cap scope"
description: "How we estimate software honestly: signal ranges per phase, explicit risk buffers, fixed-scope sprints — and how to read any estimate a studio gives you."
slug: how-we-estimate-software
cluster: playbooks
tags: [estimation, pricing, scope management, project planning, client guidance]
date: 2026-03-26
author: Ruby Castellanos
keywords: [software estimation, project pricing, fixed price vs hourly, scope management]
readingTime: 10
---

Every software estimate you've ever received was two numbers wearing a trench coat: a real estimate, and a guess about how much honesty the relationship could survive. The industry has spent forty years perfecting the second number and neglecting the first. Projects priced at the optimistic end win the contract and lose the room by month three; projects priced honestly lose the contract to the optimist. Studios learn the lesson and adjust their honesty accordingly. This is the whole game, and everyone in it is vaguely ashamed.

I've produced estimates at Brassfern for eight years — the good ones, the bad ones, and the one that taught me the phrase "discovery is cheaper than regret". Here is how we estimate now, what the numbers in an estimate actually mean, and how you should read anyone's estimate, including ours.

## The cone is real; price it

At kickoff, every project sits inside a cone of uncertainty that no spreadsheet closes. The honest response is not precision; it's an explicit range whose width states the uncertainty. So we estimate in three-number form for every workstream:

- **Likely** — the median world, assuming normal discovery of the normal surprises.
- **Optimistic** — the world where the API documentation is accurate and the legacy export is clean. We use it only for internal scheduling, never for client commitments, because clients remember the optimistic number forever and forget everything else.
- **Risk-loaded** — the world where the two known risks materialise. This is the number that matters commercially, and it's the one used in fixed-scope pricing.

When we present ranges, we show all three and say which world the price assumes. When anyone else presents you a single number with false confidence, the correct follow-up question is: "which world does this assume, and what happens to the price in the other worlds?" An estimator who can answer that has an estimating process. One who can't has a sales process.

## Decompose until the guesses get small

Estimates fail at coarse grain. "Build the dashboard: 6 weeks" is not an estimate; it's a mood. The same scope estimated as fifteen component-level items — data model, query layer, chart components, empty states, permission rules, export, audit log, the [data-table interactions](/journal/product/data-dense-tables-ux) that always take longer than anyone remembers — converges on something testable. Not because small tasks are predictable, but because fifteen medium guesses average out where one big guess is just wrong with confidence.

The rule of thumb: no line item above ten working days. Anything bigger still contains a hidden second project. "Integrate payments" is a hidden second project. "Stripe checkout session, webhook reconciliation, failed-payment retry, dunning emails, refunds UI" is an estimate. The hidden second project is where contingency budgets go to die.

One more decomposition trick that pays for itself: estimate the boring last 15% explicitly. Accessibility remediation, cross-device QA, content migration, error states (as we've written, [error messages](/journal/product/error-messages-that-help) are designed artifacts, not accidents), performance passes against a [Core Web Vitals budget](/journal/engineering/core-web-vitals-field-guide), deployment runbooks. In weak estimates this work is absent, which is to say it's priced at zero, which is to say it gets skipped under pressure and remembered for years.

## Risk buffers are line items, not padding

Every project carries named risks — third-party API reliability, content readiness, stakeholder availability, the compliance review nobody has scheduled. We list them, assign each a probability and a cost if it lands, and the risk buffer is the weighted sum. Then — the important part — the buffer is *visible and consumed by name*. When content arrives three weeks late, the conversation is "the content-readiness risk has materialised; that draws the buffer by nine days" instead of the traditional festival of mutual surprise.

Visible buffers do something subtle to client behaviour: they make risk legible as a thing that can be retired. Content delivered on time? Buffer returned. Integration testing smooth? Buffer returned. We've returned buffer on roughly a third of projects, and the trust that buys is worth more than the margin would have been. Padding, by contrast — the secret 30% everyone adds — is invisible, so it's never returned, never discussed, and prices the honest studio out of the tender. Name the risks; kill the padding.

## Why we cap scope instead of padding time

Our default engagement shape is the fixed-scope sprint: a bounded block with a written scope, a fixed price, and an explicit "out of scope" list that is the real deliverable. The cap is the honesty mechanism. Unlimited-scope-finite-time arrangements quietly transfer risk to whoever blinks first; unlimited-time-finite-scope arrangements invoice forever. Capping both forces the only conversation that produces good estimates: what's actually in?

The out-of-scope list gets negotiated hardest and repays it. "CMS-driven, but no content migration — client provides final copy in structured sheets by week four." "Single language at launch." "No native apps; responsive web only, and here's why that serves the launch better." Each of those lines is a prevented dispute, prevented in the month when prevention is free.

When scope must change mid-sprint — sometimes it must — changes are priced and scheduled visibly against the cap, and something of equal weight comes out. The swap rule is what keeps the cap real. Without it, every change is an addition, the cap is decor, and the estimate was fiction with better typography.

## Reading anyone's estimate

Whether you're reading ours or a competitor's, the same five questions expose what's underneath:

1. **What's assumed?** Every estimate has assumptions; a serious one has a *list*. Content readiness, integration access, review turnaround times. No assumption list means the assumptions are whatever survives the dispute.
2. **What's excluded?** The out-of-scope list tells you more than the in-scope one. Ask what was left out and why.
3. **Where's the risk buffer and what consumes it?** Padding and process look identical in a total. Named-risk buffers and padding do not.
4. **What are the payment milestones tied to?** Milestones tied to calendar dates reward looking busy. Milestones tied to demonstrable states — staging link, audit pass, launch — reward finishing.
5. **What happened last time?** Ask for their estimate-to-actual variance on recent comparable projects. A studio that tracks it will tell you; one that gives a number without tracking it is performing the trench-coat trick described above.

## What the estimate is really selling

An estimate is a forecast about a relationship. The numbers matter, but the document's real content is: how this team decomposes work, whether it names risks or hides them, whether it can say "we don't know yet" inside a commercial document — and whether the client can hear it. The [engagement model](/pricing) you choose allocates the remaining risk; the retainer-versus-project calculus in [our decision guide](/journal/playbooks/retainer-vs-project) is really a choice about which worlds you want to pre-pay.

The studios worth hiring are the ones whose estimates you're slightly disappointed by — ranges instead of promises, exclusions instead of asterisks, contingency retired when not needed. Disappointment at estimate stage is the cheapest form it comes in. The alternative arrives in month three, itemised, at the optimistic price plus everything.

## Key takeaways

- Every estimate is a real guess plus a guess about tolerable honesty. Estimate in three-number ranges and state which world the price assumes.
- Decompose until no line item exceeds ten days; larger items contain hidden second projects. Estimate the boring final 15% explicitly or it will be silently skipped.
- Make risk buffers visible and consumed by named risk. Retire and return buffer when risks don't materialise. Padding is never returned and prices honest studios out.
- Cap scope rather than padding time: fixed-scope sprints with a negotiated out-of-scope list, and swap-rule changes, keep the cap — and the estimate — real.
- Read any estimate with five questions: assumptions, exclusions, buffer mechanics, milestone triggers, and historical estimate-to-actual variance.

## FAQ

**Why not just estimate in story points like our internal team does?**
Story points are a calibration tool for a stable team estimating its own repetitive work — the estimate improves as the team's velocity data accumulates. Agency estimation is estimation of *novelty*: new domains, new integrations, new stakeholders, often a new codebase. Different problem, different tool. We use velocity internally for sprint planning; client-facing estimates need ranges, decomposition and named risk because you can't calibrate against a relationship that doesn't exist yet.

**Fixed price vs time-and-materials — which protects the client better?**
Neither protects automatically; they hold different risks. Fixed price transfers delivery risk to the studio, who rationally prices it in — you pay a premium for certainty and get scope rigidity in return. Time-and-materials keeps flexibility and prices uncertainty at zero, which means the client holds the overrun risk. Fixed-scope sprints split the difference: price certainty per block, flexibility between blocks. The question to ask isn't which is safer; it's which risks you want to hold. There's always somebody holding them.

**What should we budget for contingency on top of an agency estimate?**
If the estimate has visible, named risk buffers: zero-to-modest — the contingency is already inside the number, itemised. If it doesn't: 20–30% for well-understood work, 40%+ for integrations with third parties you don't control or content from stakeholders with a history of lateness. And match contingency to *your* side of the risk register too — slow internal approvals cost real money in an agency engagement, and clients who budget only for the agency's risks are surprised by their own.

**How do we compare estimates from different studios with wildly different totals?**
Normalise before comparing: strip each to scope covered, assumptions, exclusions, buffer mechanics and team seniority. We've seen a $180k estimate and a $90k estimate describe functionally identical work after adjusting for what the cheaper one excluded (content migration, accessibility remediation, post-launch support) — the cheaper estimate wasn't cheaper; it was unfinished. The total is the least comparable number in the document.

**Can an estimate be too honest to win work?**
Occasionally, in the short run — a buyer optimising for the lowest number will choose the optimistic fiction, and part of the industry keeps selling it to them. In the long run, estimate honesty is a selection mechanism: clients who value it are the clients whose projects survive contact with reality, and those are the projects with case studies, referrals and renewals. We've lost tenders to the trench-coat number and been hired to rebuild the result. The second contract is always more honest and always more expensive. Cheaper to skip the first one.
