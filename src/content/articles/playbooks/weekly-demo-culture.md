---
title: "Weekly demos: the habit that runs our projects"
description: "Weekly demos as a project operating system: the format that forces progress, recording etiquette, async viewing, demo-driven scope discovery and braver clients."
slug: weekly-demo-culture
cluster: playbooks
tags: [weekly demos, agile rituals, shipping in public, client transparency, project cadence]
date: 2026-06-11
author: Mara Ellison
keywords: [weekly demo agile, sprint demo format, shipping in public, agency client communication]
readingTime: 9
---

Every year, around a whiteboard somewhere, someone invents a new project-status ritual: the async standup, the dashboard, the AI-generated weekly digest. Meanwhile the most honest project-management tool ever devised remains the one we run every Friday at Brassfern: *show the thing working*. Fifteen minutes, real software, no slides. It has survived every methodology fashion since 2014 because it answers the only question a client is actually paying to have answered — **is this real yet?**

Here's the whole practice: the format, the etiquette, and the surprising side effects nobody plans for.

## The format: fifteen minutes, one rule

The rule is the demo gods' first commandment: **demo working software, never intentions.** No roadmap slides, no "and next week we'll have," no screenshots of designs unmoored from code. If the feature isn't working well enough to show, the demo shows the *investigation* instead — the spike, the prototype, the performance trace — because "here's what we learned" is also working software's honest cousin.

The shape, refined over a few hundred Fridays:

- **One device, one driver** (2 min): the host shares their screen from a real build, never localhost-with-crossed-fingers when staging exists.
- **The walkthrough** (8–10 min): new behaviour, driven in real time, narrated in user language rather than developer language — "a shopper can now save a box for a skip-month" not "the subscription pause mutation ships."
- **The sharp edges, volunteered** (3 min): we show what's broken, slow or embarrassing *before* anyone asks. This is the trust engine of the whole format; more below.
- **The question, not questions** (2 min): each demo ends with exactly one decision or input we need from the client next week. Bounded asks get answered; open invites for "any feedback?" get essay-anxiety and silence.

Demos are recorded by default, timestamped and posted to the shared channel within the hour, with the single question highlighted at the top of the post. Nobody is required to attend live, and the recording is skimmable in four minutes at 1.5× speed — remote teams and distributed stakeholders stop being a reason meetings multiply, which connects to the whole operating model in [getting the most from a remote studio](/journal/playbooks/working-remote-agency).

## Why "volunteer the sharp edges" runs the entire economy of trust

Clients have finely tuned detectors for two failure modes: the demo where everything mysteriously works, and the demo where everything mysteriously works *except whatever you try to inspect*. Both teach the same lesson — the agency manages appearances, and weekly meetings become surveillance exercises. Someone starts asking to "drive." Someone asks for access to the burndown chart. The relationship decays into instruments.

Volunteering sharp edges short-circuits this completely. When the agency shows the bug — "this transition janks at 300ms instead of our [160ms budget](/journal/web-design/motion-that-earns-its-keep); here's the trace; we fix it Tuesday" — three things happen: the client learns how quality work actually talks about itself; the agency gains the credibility that makes "this one's fine, genuinely" believable later; and the room calibrates on what good looks like. After six Fridays, most clients can smell the difference between a hard problem and a lazy one, and that calibration is worth more than any status report.

## Demoing thin work early: the courage of week two

The hardest demos are the early ones, when the honest state of the work is "a palette, a data model and six passing tests." Teams skip these demos and reschedule for "when there's something to show," which is precisely backwards. Early thin demos do two jobs nothing else can:

**They prove the pipeline end-to-end while stakes are zero.** A week-two demo forces deploys, environments, recordings and client attendance habits to exist before the complex work arrives. Teams that "start demoing when real" discover in week eight that nobody can join the call, the staging SSL is broken, and three stakeholders never got the invite.

**They reset the client's ear for progress.** Executives who only ever see finished work develop a pathology: they expect software to be 80% invisible for three months and then *ta-da*. A thin week-two demo teaches the true shape of progress — lumpy, front-loaded with invisible plumbing, occasionally sideways — and makes the middle months legible instead of anxious.

Our house phrasing, said aloud at every thin demo: "This is small on purpose. Next week it'll be slightly less small." Nobody has ever complained. Several have quoted it back at us in testimonials.

## The side effects nobody plans for

The demo habit compounds in ways that have nothing to do with status:

**Scope discovers itself in the room.** At a demo, hypothetical scope arguments collapse into reality: watching the real flow, someone says "wait — what happens if the courier is late?" and a genuine edge case surfaces eight weeks before it would have in UAT. We've come to trust demos as our cheapest requirements-elicitation tool; the "one question" slot at the end is usually answered by the flow itself.

**It de-risks launch week socially.** By launch, the client has seen the software evolve forty times; there is no big reveal to be nervous about, no president-views-the-website moment, no surprise stakeholder asking for the logo bigger. Launch becomes admin. The [launch-week checklist](/journal/playbooks/launch-week-checklist) is mundane precisely because the demos have already absorbed all the drama.

**It changes who clients become.** This is the effect we treasure most. Watching working software weekly makes clients braver: they approve bolder design, because they can see it live early rather than gambling on a deck. They defer gold-plating, because they can see which features users will never touch. They defend scope cuts to their own boards, because they've watched the trade-offs happen. A client who's been demoed to well becomes, by month three, a better product owner than many professionals — and that skill is what actually gets their organisation a great product after we leave.

## The anti-patterns (we've committed all of them)

**The demo as theatre** — rehearsed paths, cleared caches, hidden latency; teaches the client to doubt. **The demo as lecture** — thirty minutes of SDK internals; the room learns to multitask, irreversibly. **The hostage demo** — attendance mandatory for twelve people to justify a feature two of them care about; post the recording and free eleven calendars. **The silent livestream** — a working screen watched in awkward quiet; narrate *intent* ("we chose this because…") or you're demoing to yourself. And the deadliest: **the demo that slips** — skipped one week "because nothing to show," then another, then quietly replaced by a slides-and-metrics update that charts activity instead of showing reality. A slipped demo is itself a demo: it demonstrates the project is in trouble earlier than any report would.

So we hold the line on Friday, for the fifteen minutes. Not because we're disciplined people, particularly — because a decade of shipping has taught us that the weekly demo is less a meeting than a side of the product itself: the part the client experiences most often, and the part that quietly decides whether they trust everything else.

## Key takeaways

- Demo working software, never intentions; when the work is thin, demo the learning.
- Fifteen minutes: walkthrough in user language, sharp edges volunteered, exactly one question at the end.
- Record, timestamp, post within the hour; attendance is never mandatory.
- Start in week two even with embarrassingly little to show — it builds the pipes and the client's ear for progress.
- Volunteer your bugs first; calibrated honesty is the trust engine of the whole engagement.
- Treat demos as your cheapest scope-discovery and stakeholder-calibration tool; the side effects outlast the project.

## FAQ

### What if there's genuinely nothing to show this week?

Then demo the problem: the failed approach, the performance numbers, the rejected prototype, the email thread with the third-party API vendor. "Nothing demoable" is nearly always "nothing *finished*," and unfinished work narrated honestly is still a working demo. The only true non-demo is the one where nothing happened — and that's the one week you must not hide, because it's what the ritual exists to surface.

### How do we handle stakeholders who use the demo to relitigate decisions?

The recording helps — relitigators are rarer in async comments. When it happens live, the host's line is "noted in the decision log; let's take it offline with who needs to be there," said warmly and consistently. Demos show current reality; they're a terrible venue for reopening closed scope, and protecting the format is the producer's actual job description.

### Should demos involve real client data?

Prefer production-shaped data on staging: real catalogues, real content, anonymised where required. Dummy data hides the problems demos exist to catch — the surname that breaks the layout, the 4,000-item list, the image with an 8MB hero. Except for healthcare-style privacy constraints, realism in demo data is realism in your bug reports, weeks early.

### Does the weekly demo replace written status updates?

For us, mostly yes — the demo post plus the decision log plus the risk board *are* the status system. Some client organisations still require a formal update for their own reporting; when they do, we dash one off from those artefacts in ten minutes rather than maintaining a parallel shadow-reporting universe. One source of truth, formatted for whoever must read it.
