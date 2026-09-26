---
title: "Jobs-to-be-done interviews that surface what users won't say"
description: "Beyond the JTBD script: interviewing for the things customers can't or won't tell you, synthesising transcripts into forces maps, and turning jobs into ranked product bets."
slug: jobs-to-be-done-interviews
cluster: product
tags:
  - user research
  - jobs to be done
  - product strategy
  - research synthesis
date: 2025-09-09
author: Priya Nair
keywords:
  - jobs to be done
  - customer interviews
  - jtbd synthesis
  - product research
readingTime: 9
---

A few years into running JTBD interviews you notice something: the method's famous failures aren't bad scripts, they're bad *listening targets*. Teams run textbook switch interviews and come home with exactly what the customer could already articulate — the pains they'd tweet about, the features they'd list in a survey. The job's real payload lives in what people can't or won't say: the anxiety they don't have words for, the social politics of the decision, the workaround so habitual they've forgotten it's a workaround at all.

We've published [our exact interview script](/journal/product/jtbd-interviews-that-work) already. This is the companion piece: how to listen past the tellable story, and how to turn a pile of transcripts into bets a roadmap can actually hold.

## Why the tellable story isn't the job

Every customer arrives with a rehearsed narrative — ask anyone "why did you switch?" twice and the second answer is smoother and less true. The rehearsed version is optimised for the teller: it presents them as rational, diligent and decisive. The actual switch was usually messier: they tolerated the old tool for eighteen months, snapped on a Tuesday, panic-evaluated three alternatives in a weekend, and picked the one their colleague mentioned at lunch.

That mess is the product gold. Rational-timeline stories hide the four forces that actually govern switching — push, pull, anxiety, habit — because habit and anxiety are embarrassing to narrate. Nobody says "I stayed because change felt risky and I'd learned the old system's ugly dance." They say "it was fine for a while." Your job in the room is to excavate *under* the tellable version without making the teller feel caught.

## Techniques for the unsayable

**Interview around the thing, not about the thing.** People can't report on their own habits, but they can narrate specific days. Instead of "how do you handle month-end reporting?" — which invites the official process — ask "walk me through last month-end, starting Monday morning." The unofficial spreadsheet, the Slack message to Priya, the export-fix-reimport ritual: habits surface as events, not as answers.

**Use silence as a probe, then echo.** The most underused interview move is counting to four after an answer. The first answer is the press release; what follows the silence is the memoir. When they do say something loaded — "it got a bit political" — echo it flatly: "Political." Then stop talking. People fill precisely the gaps you refuse to fill for them.

**Probe the audience of the purchase.** "Who noticed you switched?" from our script deserves its own paragraph here, because the answer reveals the social job, which outranks the functional one embarrassingly often. The expense tool that's really a *look-rigorous-to-the-CFO* tool; the analytics platform that's really a *defend-myself-in-the-board-meeting* platform. You will never hear this stated directly. You'll hear it in "my boss finally stopped asking for the numbers" — that's a social job wearing a functional costume, and it changes everything about what the product must do in week one.

**Ask for artefacts, not recollections.** "Could you show me the spreadsheet you used before?" Fifteen columns of someone's lived workaround beats forty minutes of description. Same for the old tool's screenshots they keep, the folder of PDFs they export "just in case". Artefacts don't rehearse.

## The firing interview: the interview nobody runs

Most teams interview current customers. The sharper session is with someone who hired you and then *fired* you — a churned customer, ideally within 60 days of leaving. The protocol is identical (timeline, first thought, forces), but the incentives are inverted: they owe you nothing and the story is fresh.

Three questions earn the awkwardness tax of booking these:

- **"What did you hire after us?"** If they went back to a spreadsheet or an agency, your competitor set was never what your positioning deck said.
- **"Was there a moment, or a slow fade?"** Moment-churn is a product fix; fade-churn is a value-communication failure that started in [onboarding](/journal/product/onboarding-checklist-patterns) months earlier.
- **"What did we promise that turned out not to matter?"** This one stings, and it's the highest-yield question in the method — it audits your marketing with the only people qualified to judge whether the promise survived contact with the product.

On the [Sundial travel project](/work/sundial-travel-booking), firing interviews revealed that churning customers hadn't disliked the trip-planning tools — they'd completed their trip and felt no pull to plan another. The roadmap bet that followed (inspiration content tied to seasons, not more planning features) came entirely from interviews the client nearly declined to let us run. Illustrative, as our case-study numbers always are — but the bet's origin is real methodology.

## Synthesis: from tapes to forces maps

Synthesis is where JTBD programs die of transcription weight. Our pipeline keeps it to days, not weeks:

**Code transcripts against events, not themes.** Highlight: first thought, triggering event, search behaviours, consideration set, decision moment, first-use frictions, anxieties, social mentions. "Events" resist the researchers' favourite failure mode — twelve vague themes like "wants simplicity" that fit any roadmap.

**Draw one forces map per interview.** Push (what the old way cost), pull (what the new promised), anxiety (what nearly stopped them), habit (what the old way had going for it). Quantify nothing yet — mark intensity with the interviewer's judgement, honestly labelled as judgement. When six of eight maps show anxiety bigger than pull, you have a finding no survey will give you: your marketing is selling pull but your onboarding must sell *calm*.

**Write job statements in the when-I-want-so-I-can format.** "When month-end closes in, I want confidence the numbers reconcile, so I can stop pre-answering the CFO's questions in my head." The so-I-can clause is where the social and emotional jobs live; if yours are all functional, your interviewing never got past the press release.

**Cluster jobs by circumstance, not by persona.** Personas tempt you to segment by who people are; jobs cluster by what moment they're in. Two of our strongest engagements — [a learning platform](/work/brightmarsh-onboarding) and a fintech dashboard — produced job clusters that cut straight across the client's persona deck. That's often the finding itself.

## From jobs to bets

A job is not a roadmap item; it's a candidate bet with a confidence level. Our translation rules:

1. **One job, one bet, one falsifier.** "We believe the *reconciliation-confidence* job is under-served; we'll betting on an auto-reconcile preview; we're wrong if fewer than X% of target-segment users engage it within two sessions." Jobs without falsifiers become wallpaper.
2. **Rank by force, not frequency.** The job mentioned in seven interviews isn't automatically the top bet — the job with the strongest push and weakest current satisfaction is. Frequency measures talkativeness; force measures switching energy.
3. **Feed the four forces into [activation metrics](/journal/product/activation-metrics-honest).** If anxiety dominated, your activation metric should measure early reassurance (first successful reconciliation), not feature breadth. Research that doesn't change what you measure was storytelling.

## Key takeaways

- The rehearsed switch story hides anxiety and habit — the two forces that most decide real switching. Excavate with day-narration, silence, echo probes and artefact requests.
- Run firing interviews with churned customers; "what did we promise that turned out not to matter?" is the highest-yield question in the method.
- Synthesise against events, build per-interview forces maps, and write job statements whose so-I-can clause carries the social and emotional job.
- Cluster jobs by circumstance, expect them to cut across personas, and don't flinch when they do.
- Translate jobs to bets one-to-one, with falsifiers, ranked by switching force — and let the forces change what you measure in activation.

## FAQ

**How many interviews before we can trust the forces maps?** Eight to twelve per distinct circumstance saturates for event-level data; forces maps converge faster, often by interview six. If two consecutive interviews add no new events or forces, you've saturated — move budget to synthesis or a different segment.

**Can we do this remotely?** Yes, with two adjustments: screen-share artefact walkthroughs replace desk-side ones, and silences feel longer on video — hold them anyway. In-person earns its travel budget mainly for observing the *environment* (the second monitor, the printed checklist) that video crops out.

**How do we get churned customers to agree?** Pay properly, keep it to 45 minutes, be plain that this is an exit interview and not a win-back. Roughly a third say yes, and the yeses skew candid. Route the booking through the researcher, never through the account manager they fired.

**JTBD versus surveys — when is a survey the right tool?** Surveys measure the prevalence of jobs the interviews discovered; they cannot discover them. Interview wide-open first, then validate distribution with a survey if the bet is expensive. Reversing the order just quantifies your existing assumptions.

**How does this plug into a sprint-based engagement?** Interviews and synthesis run as a two-to-three-week discovery lane before the first build sprint — the pattern we describe in our [approach](/approach). The output isn't a report; it's the ranked bet list the first three sprints execute against.
