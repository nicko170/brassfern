---
title: "Handovers that don't decay: the living handover playbook"
description: "Most agency handovers are a folder of PDFs and a prayer. Here's the playbook we run instead: documentation that gets used, pairing windows, and a 30-60-90 support taper."
slug: design-handover-done-right
cluster: playbooks
tags: [agency handover, design handoff, knowledge transfer, project documentation, agency process]
date: 2025-03-10
author: Ruby Castellanos
keywords: [agency handover process, design handoff best practices, knowledge transfer plan, project documentation, agency to in-house transition]
readingTime: 9
---

Every agency engagement ends the same way on paper: "final handover, two weeks." And every in-house team that's lived through one knows what that usually means — a shared drive folder named `FINAL_v7`, a Figma file with 400 ungrouped frames, a ninety-minute Loom video recorded the night before, and a Slack channel that goes quiet on a Friday.

Six weeks later, the site has drifted. Buttons are the wrong radius. Someone hardcoded a hex value that's *almost* brand colour. The CMS has a new field called `temp2`. Nobody is at fault, exactly. The handover just decayed, the way a house decays when nobody lives in it.

At Brassfern we've run dozens of handovers — to in-house teams of two and platform orgs of forty — and we've learned that a handover isn't a deliverable. It's a **taper**. You don't throw the keys; you teach someone to drive while gradually taking your hands off the wheel. This is the playbook we run, and the parts of it you should demand from any studio you hire.

## The core mistake: treating handover as an event

The mental model to banish is the relay race — one team runs its leg, slaps the baton into the next runner's hand, and stops. Software doesn't work like that. Understanding doesn't transfer in a moment; it transfers through *repeated contact with real decisions*.

So we design handovers as a phase that starts weeks before the engagement ends. The rule of thumb: **the handover window should be roughly a quarter of the total engagement length.** A twelve-week build gets a three-week taper, at minimum. If your agency proposes a handover measured in days, they're planning to leave, not to land.

## Artefact one: documentation that gets used

Most documentation fails because it's written for a reader who doesn't exist — an omniscient future maintainer who reads cover to cover. Real maintainers arrive with a task: "change this component," "add a redirect," "why is this page slow." Documentation should be organised around tasks, not systems.

Our handover docs follow a strict hierarchy:

1. **The one-pager.** Architecture in ten boxes, the five commands everyone needs (`install`, `dev`, `test`, `build`, `deploy`), and the "if it's on fire" section: where logs live, who gets paged, how to roll back. If someone reads nothing else, this page keeps them alive.
2. **Task recipes.** Fifteen to twenty short runbooks for the jobs we know are coming: adding a landing page, editing navigation, shipping a new content type, rotating an API key. Each recipe is under a page and ends with "how to verify it worked."
3. **Decision records.** Short notes on the calls that will otherwise get relitigated: why the CMS, why this font-loading strategy, why we didn't build the thing sales asked for in week three. Decision records are the highest-leverage documents in the set — they prevent your team from being out-argued in meetings by people who weren't there.
4. **The reference layer.** Auto-generated where possible (component props, API schemas, token tables), because generated docs don't rot the way prose does.

On the [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild), the entire handover doc set was thirty-one pages — and their team used it, because every page answered a question they'd actually asked us during the build. That's the test: **write docs backwards from questions received, not forwards from systems built.**

## Artefact two: the working session, not the walkthrough

A walkthrough is a presentation with a Q&A tail. It's the least effective knowledge-transfer format ever devised, and it remains the industry default. The alternative is the **working session**: the client's engineer or designer drives, we ride shotgun, and the task is real work from their actual backlog.

The format we schedule in the final three weeks:

- **Week -3: shadow.** They watch us do two or three real tasks, narrating every decision, including the boring ones ("I'm checking the redirect map before I touch this template, because…").
- **Week -2: drive with supervision.** They perform the same class of tasks while we watch, staying silent until they're genuinely stuck. Silence is the important part. Rescuing people early teaches them to wait for rescue.
- **Week -1: solo with a leash.** They work alone; we're reachable in a shared channel with a two-hour response commitment. Every question they ask becomes either a fix (if the system is confusing) or a runbook (if the docs are missing the answer).

Notice what this produces: the final week of engagement *generates* the most valuable documentation, because it's written in response to real friction. Our piece on [accessibility in the design file](/journal/web-design/accessible-design-handoff) covers the design-side version of this — annotations only count if the person building the work has used them.

## Artefact three: access, keys, and the boring kingdom

The least glamorous part of handover is the one that causes the most pain a quarter later, so we run it as a checklist with a named owner on both sides:

- **Repositories** transferred or forked into the client's org, with CI/CD secrets re-issued — never shared over Slack, never left pointing at our accounts.
- **Credentials audit.** Every service the project touches (CMS, analytics, error tracking, email, DNS, CDN, payment sandbox) listed in a single inventory with an owner column. Anything owned by a person gets re-owned by a *role* (`platform@client.com`), because people leave companies.
- **Licences and subscriptions** moved to client billing, with renewal dates in a shared calendar. The number of sites that have fallen over because a font licence or monitoring plan quietly expired on a departed freelancer's credit card is not small.
- **Analytics continuity** verified against the old property for a full billing cycle where possible — see our [analytics governance](/journal/growth/analytics-governance) piece for the tracking-plan side of this.

This inventory takes a day to compile during the engagement if you're disciplined, and a week of archaeology if you're not. Compile it from day one.

## The 30-60-90 support taper

The engagement contract shouldn't end at "handover complete." Ours end with a taper, priced explicitly in our [engagement models](/pricing):

- **Days 1–30:** hypercare. Two-hour response on blockers, a standing thirty-minute weekly call, and a shared channel we actually watch. This is when the scary unknowns surface — the deploy nobody's done alone, the CMS edge case.
- **Days 31–60:** steady state. Same-day response, fortnightly call, and we review their first solo release with fresh eyes.
- **Days 61–90:** fade. Best-effort response, one closing review, and a structured retro where we ask what the handover missed. That retro is how this playbook exists.

The taper matters psychologically as much as operationally. An in-house team that knows help is genuinely leaving on a date behaves differently than one that believes the agency is one call away forever — they take ownership earlier, and they ask better questions.

## Measuring whether the handover worked

"Handover complete" is usually declared by the departing agency, which is a conflict of interest. We agree the success criteria up front, and they're all behaviours, not artefacts:

1. **The client team has shipped to production alone** — at least twice — before we leave. Not a content change; a real release through their pipeline.
2. **Mean time to first shipped fix under two weeks.** If the inherited team can't fix a small bug inside a fortnight, they don't own the system yet, whatever the docs say.
3. **Ninety days later, the [Core Web Vitals](/journal/engineering/core-web-vitals-field-guide) and uptime match what we left.** Decay is measurable; measure it.
4. **The decision records get cited in their meetings.** When someone says "we chose this because…" using our reasoning, knowledge transferred. When they relitigate settled calls, it didn't.

If you're buying agency work, put these four conditions in the statement of work. Any studio confident in its [approach](/approach) will sign them happily. Any studio that baulks is telling you something about what usually happens after their invoices clear.

## Key takeaways

- A handover is a taper, not an event. Budget roughly a quarter of the engagement length for it.
- Write documentation backwards from real questions: one-pager, task recipes, decision records, generated reference.
- Replace walkthroughs with working sessions: shadow, supervised, solo. The final week's questions become your best docs.
- Run the boring kingdom explicitly: repos, credentials re-owned by roles, licences moved, analytics continuity verified.
- Contract a 30-60-90 support taper, and define success as behaviours — solo releases, time-to-first-fix, metrics that don't decay.

## Frequently asked questions

**What if we don't have an in-house team to hand over to?**
Then the handover target is your next supplier — or a maintenance retainer with us. The checklist barely changes: someone still needs the credentials inventory, the runbooks, and the rollback plan. The worst handovers we've inherited were orphaned projects where nobody owned anything; an explicit maintenance arrangement, even a small one, is dramatically cheaper than a rescue job.

**How much documentation is too much?**
When it stops being read. Our ceiling is roughly thirty pages of prose plus generated reference. Beyond that, pages start contradicting each other and nobody trusts any of them. Long docs rot; short, task-shaped docs get updated because they get used.

**Should we record video walkthroughs?**
Yes — but as a supplement, never the substance. Video is excellent for "watch me do the scary deploy once" and terrible as a search surface. Pair each recording with a written recipe, and re-record if the process changes. A two-year-old video of a renamed interface is worse than none.

**Who should attend the working sessions?**
The people who will actually operate the thing — not their managers, not a friendly architect who'll never touch the repo. Two or three operators, maximum. Large audiences turn working sessions back into presentations, and the knowledge stays with us.

**What's the single most skipped step?**
The credentials audit. Every post-mortem on a decayed project features a line like "the analytics account belonged to someone who left in 2023." Do the boring kingdom. It's a day of work that prevents a month of archaeology.
