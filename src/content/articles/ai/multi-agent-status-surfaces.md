---
title: "Showing the swarm: status UX for multi-agent systems"
description: "Multi-agent features bury users in log firehoses or leave them staring at a spinner. Designing step summaries, cost displays, interruption and failure narration."
slug: multi-agent-status-surfaces
cluster: ai
tags: [ai, agents, ux design, transparency, product design]
date: 2026-05-22
author: Aiko Tanaka
keywords: [multi-agent UX, agent status UI, AI progress displays, agent transparency, AI workflow design]
readingTime: 11
---

A single-agent feature gives you an easy status problem: the user asks, the model streams, the answer lands. We've written about the patterns in [agent UX patterns](/journal/ai/agent-ux-patterns) and [designing for software that acts on your behalf](/journal/ai/agent-ux-control). Multi-agent systems break all of it. Now there are five workers running in parallel, one of them has silently retried a failed search four times, another is consuming tokens like it's being paid per word, and the orchestrator is about to make a decision the user can't see, can't predict, and — if you don't design for it — can't stop.

The two failure modes are symmetric. The **spinner**: one indeterminate animation for a six-minute job, producing the specific anxiety of watching a microwave with no display. The **firehose**: a raw event log of every tool call, which proves nothing except that the engineers were proud of their architecture. Both are answers to the same wrong question — "how do we show what the system is doing?" The right question is "what does the user need to know, decide, and be able to stop, at each moment?"

Here's the framework we've landed on across our [AI work](/services/ai).

## Design for three reader speeds

Every status surface gets read at three speeds, and needs a layer for each:

**The glance (one second):** Is it alive? Roughly how far through? Is anything wrong? This layer is a phase label and coarse progress — "Researching… 2 of 4 sources" — plus a single ambient state colour. If the glance layer requires reading more than six words, it has failed.

**The check-in (ten seconds):** What is each agent doing *right now*, in plain language? This is the step-level summary layer, and it's where most of the design work lives (below).

**The audit (as long as they want):** What exactly happened, in what order, using which data, at what cost? Expandable, always available, never the default view. The audit layer is for builders of trust over time and for the bad day when something goes wrong — it's the event log, but structured, attributed, and narrated rather than raw.

The mistake is shipping only layer one (anxiety) or only layer three (firehose). The craft is in layer two.

## Step-level summaries: verbs, objects, outcomes

The core unit of multi-agent status is the **step summary**: one line per active or completed step, updated as the swarm works. Getting these right is mostly a writing problem disguised as an engineering problem, because the raw material is a tool call like `web_search(query="competitor pricing site:acme.com")` and the output must be a sentence a human cares about.

Rules that hold up:

**Verb + object, in the user's vocabulary.** "Searching competitor pricing pages" not "Executing retrieval subtask 3". The noun should be the *thing the user asked about*, not the system's internal construct. If the step summaries read like a trace, you've built the firehose with better typography.

**Report outcomes, not attempts.** The system tried four searches and one worked. The audit layer should record all four; the check-in layer should say "Found pricing pages from two competitors." Attempt-counting is anxiety-inducing ("Retrying… attempt 3 of 5" reads as "this is going badly") and is honest only in a way that serves the machine's self-image, not the user's need.

**Collapse the parallel.** Five agents running concurrently should usually render as one summarised line ("Reviewing your four shortlisted venues") with the detail available on expansion. Five simultaneously updating lines is a slot machine. The exception is when the parallelism is itself legible and meaningful to the user — e.g., "Checking availability at each venue" with one line per venue the user recognises by name. Recognisable objects get rows; internal machinery gets rows collapsed.

This is the same discipline as thinking-in-public streaming ([streaming UX](/journal/ai/streaming-ux-patterns)) taken one level up: stream *meaning*, not tokens — summarise work, don't relay it.

## Progress is non-linear — stop pretending it's a bar

Multi-agent runs don't have reliable duration or fixed step counts. A progress bar that stalls at 40% for ninety seconds then jumps to done is worse than no bar. Options that work:

- **Phase progression** (Queued → Researching → Drafting → Checking) with the current phase doing a subtle working animation. Phases are honest where percentages lie.
- **Item progress** when there's a countable, user-legible unit: "3 of 7 venues checked." Item counts are the only numbers users believe, because they can verify them.
- **Elapsed time, displayed plainly.** "Running for 2m 14s." Counterintuitive, but honest elapsed time calms people more than fake percentages — it replaces "is it stuck?" with evidence of life. Pair it with a soft expectation set at kickoff ("Usually takes 2–4 minutes") so elapsed time has a frame of reference.

Whatever you choose, the terminal states must be designed as carefully as the working states: a clear "Done" with a summary of what was produced, and a distinct "Done, with caveats" state for partial completion (below).

## Cost and time display: show the meter

Agents spend money. Multi-agent systems spend it in parallel, sometimes on tasks the user values and sometimes on a retry loop it would have been cheaper to abandon. Our position — the same one we take on [LLM cost engineering](/journal/ai/llm-cost-engineering): **users who pay for compute should see the meter.**

Concretely: for metered or credit-based products, show a running cost or credit figure in the audit layer, and show the *estimated* cost before the run starts when it exceeds some threshold. "This will analyse 140 documents (~30 credits, about 5 minutes). Run it?" is the most trust-building sentence in agent UX. It converts the system from a black box that spends into a contractor that quotes.

Even where users don't pay directly, aggregate spend visibility matters *to you*: run-level cost telemetry will find the agent retry loop that's quietly responsible for 40% of your inference bill. It always exists. Nobody believes this until they look.

## Interruption: pause, steer, stop

The longer a run, the more likely the user watches the first thirty seconds and thinks "no, not like that." Systems without interruption controls teach users a terrible lesson: don't start ambitious tasks, because you're committed the moment you do.

Three controls, in ascending severity:

- **Steer** — add guidance without killing the run: "Focus on Australian suppliers." Not every architecture can support mid-run steering (this needs orchestrator-level design from day one, not a bolt-on), but where it exists it's the control that most increases task ambition.
- **Pause** — freeze in a resume-safe state. This demands checkpoints, which again is an architecture decision with a UX payoff.
- **Stop and keep** — halt the run but preserve and present partial results: "Stopped after researching 4 of 7 venues. Here's what we found." Partial results salvage value and, critically, teach the user what the system was doing.

The confirmation-free pattern matters here: stop should be instant (it's the safe action), with results salvageable. It's the agent-system version of [undo beats confirm](/journal/product/undo-not-confirm) — reversibility replaces gatekeeping.

## Failure narration: the swarm's post-mortem, in human

Partial failure is the *normal* state of multi-agent systems — a source was unreachable, one agent's output failed validation, a tool timed out. The failure modes that erode trust are silence (the answer quietly omits what couldn't be fetched) and exposure (a stack-trace-looking error in the user's face).

Design the **completion report**: when a run finishes, one honest block narrating what worked, what didn't, and the consequence. "Reviewed six of seven interviews — one file was an unsupported format, so its themes aren't included. Re-upload as PDF and I can extend the analysis." That's the whole pattern: what, why, consequence, recovery. It borrows directly from [fallback UX for LLM features](/journal/ai/llm-failure-fallback-ux) and from plain old [error messages that help](/journal/product/error-messages-that-help), applied to a process instead of a response.

One hard rule: **failures that change the answer's reliability must travel with the answer**, not live only in the audit log. If one of seven sources failed, the report citation where the summary appears should carry the caveat. A caveat a user has to go looking for is a caveat that doesn't exist.

## A build order

1. Phase labels + elapsed time + stop. (The minimum honest surface.)
2. Step summaries with verb-object writing and outcome reporting.
3. Completion report with failure narration that travels with the output.
4. Audit layer: structured, attributed event log.
5. Cost meter where compute is user-visible; estimated-cost confirmation for expensive runs.
6. Steer and pause, once the orchestrator supports checkpoints.

## Key takeaways

- Design three reading speeds: glance (phase + health), check-in (step summaries), audit (full structured log). Never ship only the spinner or only the firehose.
- Step summaries are a writing problem: verb + user-legible object, outcomes not attempts, parallel work collapsed unless the items are recognisable.
- Percentages lie; phases, countable items, and honest elapsed time don't.
- Show the meter: cost and time visibility converts a black box into a contractor that quotes.
- Interruption controls (steer, pause, stop-and-keep) determine how ambitious a task users will dare to start.
- Partial failure is the normal case. Narrate it — what, why, consequence, recovery — and make caveats travel with the answer.

## FAQ

**Won't showing all this activity overwhelm non-technical users?**
Only if you default to the audit view. The check-in layer — one summarising line, expandable — reads as *less* noisy than a spinner, because it answers the question the spinner raises. In usability sessions we've run, step summaries reduce "is it stuck?" abandonment sharply; nobody reads the expanded log unless something went wrong, which is exactly when they should.

**Do we really need checkpoints to ship this?**
You need them for pause and for salvageable stops, yes — but phases, summaries, stop, and the completion report all work without checkpointing. Ship the honest surface first; add resumability when the architecture matures.

**Should we show which model each agent used?**
In the audit layer, yes, if it's stable and meaningful (it matters for debugging trust — "the cheap model summarised, the strong one verified"). In the check-in layer, no: model names are internal machinery and read as it.

**How do we handle runs that take 20+ minutes?**
Don't make users babysit them. Design for abandonment as the primary path: kick off, notify on completion (with the completion report), deep-link back into the audit view. A 20-minute run whose UX assumes continuous attention is a 20-minute run users won't start twice.

**What about agent-to-agent messages — show them?**
Almost never verbatim. Inter-agent chatter is like database queries: essential to the system, meaningless as narration. Summarise what the *handoff* produced ("Passed venue shortlist to the availability checker") and keep the payload in the audit log.
