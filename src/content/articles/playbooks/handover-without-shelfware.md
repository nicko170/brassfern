---
title: "Handover without the hangover: documentation your team will read"
description: "A clean agency-to-client handover in practice: documentation people actually read, runbooks that run, training that sticks, and who owns the keys afterwards."
slug: handover-without-shelfware
cluster: playbooks
tags: [agency handover, documentation, knowledge transfer, runbooks, offboarding]
date: 2026-04-16
author: Ruby Castellanos
keywords: [agency handover checklist, project documentation, knowledge transfer plan, runbook template]
readingTime: 10
---

The saddest folder in software is called `handover-docs-FINAL-v3`. It contains a 90-page PDF nobody has opened since the day it was exported, architecture diagrams of a system that no longer exists, and a "passwords spreadsheet" nobody dares to open for fear of what they'll find. The agency cashed the cheque. The client's team inherited a black box with a manual written for a reader who never existed.

Handover is where engagement quality shows its true face. Anyone can look good at kickoff; the handover is when you find out whether the studio was building *your* capability or *their* dependency. This is how we run ours at Brassfern — and, if you're the client, the standard we'd suggest you hold any agency to.

## The first rule: handover is a phase, not an event

The single biggest predictor of a painless handover is when it starts. If knowledge transfer begins in the final week, what you're transferring is panic. We run handover *continuously*: every sprint adds to the runbook, every non-obvious decision lands in a decision log the day it's made, and the client's engineers review real pull requests from week two — not as observers, as reviewers with opinions.

This changes the economics completely. The final month stops being a document factory and becomes a taper: pairing sessions, shadow deploys, and the slow handover of the keyboard. Our [living handover playbook](/journal/playbooks/design-handover-done-right) covers the design-system side of this philosophy; this piece is about the operational whole.

## Documentation that gets read is documentation that gets used

People don't read documentation; they *consult* it, in a hurry, with a specific problem. So we structure everything as answers to the questions that actually arrive:

**The README is a funnel, not a novel.** Clone to running locally in under fifteen minutes, or the README is a bug. Every command copy-pasteable, every prerequisite named with its version, every "it depends on your machine" hunted down and killed. We test the README the way you'd test onboarding: a colleague who has never touched the repo follows it cold, narrating aloud. Every stumble becomes a fix. It never survives the first cold read unchanged.

**Architecture as a one-page map plus a legend.** One diagram, current *by construction* — for web systems, we generate dependency and routing maps from the code in CI rather than trusting anyone to keep a drawing honest. The legend explains conventions: where things live, naming rules, the three places state is allowed to exist. A map that's wrong is worse than no map, so anything that can't be generated gets a named owner and an expiry date in the header.

**Decision logs over rationale essays.** Twenty log entries — date, decision, alternatives rejected, reversibility — beat a ten-page architecture rationale, because the question teams ask six months later is never "explain the system" but "why on earth is it Postgres *and* Redis?" An entry takes four minutes on the day and saves a four-hour archaeological dig later.

**Troubleshooting written from real incidents.** "If X is slow, look at Y" entries accrete from actual 2am moments. The first time something breaks during the engagement, its diagnosis joins the runbook. By handover, the doc isn't hypothetical — it's the team's shared scar tissue, organised.

## Runbooks that run

A runbook is a set of procedures for the events that will definitely happen: deploys, rollbacks, scaling before a campaign, restoring a backup, rotating a key, responding to the provider status page going amber. The test of a runbook is not whether it's written but whether it *runs* — so in the final month we hold what we half-jokingly call fire drills: the client's engineer executes the rollback procedure on staging, alone, at a civilised hour. If they can't, the runbook gets fixed, not the engineer.

The drills that matter most are the frightening ones: restore from backup (have you ever actually *restored* one?), revoke a compromised secret, roll back a bad deploy under time pressure. Teams that have rehearsed these once handle real incidents with eerie calm. Teams that haven't are reading prose during an outage.

## Training: teach the workflow, not just the tool

Two sessions of "here's the CMS" make everyone feel like training happened. Training that sticks is built around the team's real weekly workflow — publishing a page, launching a campaign, triaging a bug report — practiced hands-on, twice, with the second session a week after the first because that's when the real questions surface.

Three rules we hold to: **teach in pairs** (one drives, one navigates — both learn faster than in an audience); **record every session** and cut it into titled ten-minute clips, because nobody re-watches a 90-minute Zoom but everyone watches "how to roll back a deploy"; and **train the trainer last**, because the client's designated expert needs enough depth to teach the next hire we've never met. For products with [onboarding that matters](/journal/product/onboarding-patterns-activation), we apply exactly the same philosophy inward that we apply to their users.

## The keys: accounts, secrets and ownership

This is the section least often done well and most often regretted. The audit we run before any handover:

- **Every account in the client's name.** Hosting, CI, error tracking, analytics, registries, app-store accounts, domain registrar, email provider. Agencies holding accounts "temporarily" is how companies discover, three years later, that their site runs on a credit card belonging to someone who left the agency. All billing to the client's card; the agency gets *access*, never *ownership*.
- **Secrets in the client's vault**, with a documented rotation procedure and a full rotation *at* handover — every token the agency ever touched gets cycled, so there's no ambiguity about access afterwards.
- **Roles over shared logins.** Every shared login removed or put under SSO; every agency account individually named so access can be revoked cleanly per person.
- **A licence and dependency register** — what's paid, what renews when, what's one deprecation away from a bad Monday. Nothing sours a relationship like a surprise $8k annual renewal the client never knew they had.

We hand this over as a single inventory table with a verified owner per row. Forty minutes to make, and it has prevented more post-engagement drama than any contract clause.

## The taper: the last month in practice

The final four weeks of our engagements look like this, roughly: week one, shadowing — client engineers drive, we navigate; week two, the fire drills and the second training round; week three, a live incident simulations and the full secrets rotation; week four, silence testing — the client team runs the system for five working days with us available but quiet, like a driving instructor with their hands off the wheel.

Then a written warranty: thirty days of incident support with named responders and response times, followed by a clean exit. If the client wants us after that, it's by choice — which is exactly the relationship we want, and the one our [retainer versus project](/journal/playbooks/retainer-vs-project) guide tries to make honest from the client side too.

A good handover doesn't feel like a delivery. It feels like the moment you realise the agency has been quietly working themselves out of a job — and that you're ready for them to go.

## Key takeaways

- Handover starts in week one: continuous decision logs, client code review from week two, a taper instead of a cliff.
- Write documentation for the person consulting it mid-problem: funnel README, generated maps, decision logs, incident-born troubleshooting.
- Runbooks are validated by drills — the client executes rollback, restore and key-rotation alone on staging.
- Training follows the real weekly workflow, in pairs, recorded as short clips, with a second session a week later.
- Every account and every secret ends up in the client's name and vault, with a full rotation at handover.
- Finish with five days of silence testing and a written thirty-day incident warranty.

## FAQ

### What should a handover document actually contain?

Five artefacts, not fifty: a README that gets a stranger running locally in fifteen minutes; a one-page architecture map plus conventions legend; a dated decision log; a runbook of rehearsed procedures (deploy, rollback, restore, rotate); and an inventory of accounts, licences and renewals with named owners. If it isn't consulted monthly, it wasn't worth writing — so everything else is ruthlessly optional.

### How long should the handover period take?

The formal taper is three to five weeks depending on system size, but effective handover is continuous from week two of the engagement. If an agency proposes transferring everything in the final week, what they're really proposing is a farewell lunch and a ZIP file. Ask instead how their process makes the final week *boring*.

### What are the warning signs of a bad handover approaching?

Documentation appearing for the first time in the last fortnight; accounts and domains still in the agency's name; no rehearsal of deploy/rollback by the client's team; "training" scheduled as a single webinar; and reluctance to let your engineers drive the keyboard. Any two of these means the agency is leaving you a dependency, not a capability.

### Should we keep the agency on retainer after handover?

If the handover was done properly, a retainer is a choice about *new work*, not life support. A small incident-warranty window (we give thirty days) is reasonable; an open-ended retainer that exists because your team can't safely deploy is a signal the handover failed. Our honest take on when retainers are worth it is in [retainer or project?](/journal/playbooks/retainer-vs-project).
