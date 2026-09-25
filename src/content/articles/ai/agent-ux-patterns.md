---
title: "Agent UX: designing for delegation, not magic"
description: "Agentic features fail when they promise magic. The interface patterns we use instead: scope setting, visible progress, checkpoints, undo and earned autonomy."
slug: agent-ux-patterns
cluster: ai
tags: [ai ux, agents, interaction design, product design, human-ai interaction]
date: 2026-01-20
author: Aiko Tanaka
keywords: [ai agent ux, agent interface design, human ai interaction, agentic design patterns, ai autonomy]
readingTime: 9
heroImage: /images/articles/ai/agent-ux-patterns.jpg
heroAlt: "Editorial illustration of a machined-brass ladder of four ascending steps on cream paper, connected by fine fern-green hairlines like a letterpress circuit diagram."
---

The hardest thing about agentic features is not the model. It's the moment after the user presses the button — the thirty seconds or ten minutes when the software is doing things on their behalf and they are watching, or not watching, and deciding whether they will ever press that button again. Most agent interfaces answer that moment with a spinner and the word "magic". Both are the problem.

Delegation is a better frame than magic, because delegation is something humans already understand deeply. When you hand a task to a capable new colleague, you don't throw work over a wall and hope. You scope it. You agree on what done looks like. You want to hear how it's going. You want the ability to say "stop, not like that" mid-task. And you extend trust in increments — the keys to the petty cash first, the bank account eventually. Agent UX is the design of that relationship. These are the patterns we now reach for everywhere, from ops tooling to features like the ones in our [AI practice](/services/ai).

## Pattern 1: scope setting is the feature

The single biggest predictor of agent success is whether the user could state the boundaries before the run started. Not a prompt — a *fence*. What may it touch, what must it never touch, what's the budget of effort (time, steps, money), what does "stop" look like.

Good scope-setting UI is structured, not a text area. Checkboxes for target entities, a review-before-sending toggle, a numeric cap, an explicit list of excluded things. On a bulk-editing agent we prototyped, the difference between "clean up my CRM data" and "merge duplicate *companies*, archive contacts with no activity in 3+ years, change nothing with an open deal, show me every merge before committing" was the difference between a demo people admired and a tool people used. The scope form *is* the product; everything after it is execution of the agreement.

This is really just [progressive disclosure](/journal/product/progressive-disclosure-complexity) with higher stakes: simple default scope up front, one layer down the surgical options for people who need them.

## Pattern 2: the plan preview — "here's what I'm about to do"

Before any irreversible or expensive run, the agent drafts its plan: a short, numbered, human-readable list. "1. Find all 214 matching contacts. 2. Flag 61 probable duplicates. 3. Propose merges for review." Three sentences; seconds to read; and it converts blind trust into informed consent. Users catch scope errors at this step constantly — "wait, 214? I meant *this quarter*" — which is scope correction at the cost of a click instead of a cleanup.

Critically, the plan preview sets the vocabulary the whole run will use. Step numbers on screen are step numbers in the progress narration later.

## Pattern 3: progress as narration, not percentage

A progress bar for an agent is a lie in a tuxedo — the agent doesn't know how long it will take either. What users actually need is *situational awareness*: what it's doing now, what it just did, what it's decided along the way and why (in one clause, not a paragraph). "Checked 40 of 214 contacts · flagged 3 merges · skipping contacts owned by Sales Ops, per your fence."

The narrated trace does double duty: while running, it's reassurance; after the fact, it's the audit log. We persist it as a first-class artifact — the run's story — because the first question after any agent makes a mistake is "why did it think that was okay?", and the trace should answer it without a forensics session. Structurally it's a timeline of [meaningful moments](/journal/web-design/microinteractions-that-matter), not a technical log: verbs the user chose, not tool calls the model chose.

## Pattern 4: checkpoints and undo, by default

Here is the rule we write on the wall: **an agent earns the right to act irreversibly; it starts with the obligation to be reversible.** Spell out the blast radius of every action in the plan, and default every destructive step to a draft, a proposal, or a review queue. Undo is the interface feature that makes autonomy feel safe.

Where true undo is impossible — an email sent is sent — insert a checkpoint: the agent pauses, presents a small batch ("here are the first 5 of 61"), and waits for a verdict. Checkpoints are a negotiation about trust density: early runs checkpoint often, trusted runs checkpoint rarely. Which is the next pattern.

## Pattern 5: interruption and steering that actually work

If the user can't say "stop" and have it stop, you don't have an agent, you have a conveyor belt into a woodchipper. Interruption needs three behaviours: immediate halt (no finishing "just this one step" into a destructive action), a clean resumable state (paused runs are first-class objects you return to), and *steering* — the ability to redirect mid-run without restarting. "Good, but ignore anything older than 2022" typed into the running task should tighten the scope from step 41 onward, not abort 40 steps of good work.

The same respect-for-the-user's-time applies at the notification layer: an agent that pings you for every micro-decision is a needy employee with a pager. Batch the questions. Our [notification design rules](/journal/product/notification-design-respect) apply verbatim.

## Pattern 6: the autonomy ladder

Nobody hands a new hire full production access on day one, and yet agent demos routinely ask users to do exactly that. Design autonomy as levels the user explicitly promotes through:

1. **Advise** — it analyses and proposes; humans execute.
2. **Draft** — it prepares changes; humans approve each batch.
3. **Act with review** — it executes; humans inspect after, everything reversible.
4. **Act within fences** — it runs solo inside the scope and budgets the user set, with exception reporting.

Each level advertises the next one and the conditions for it ("after 10 reviewed runs you'll unlock scheduled runs"). This converts trust from a leap of faith into a progression the user controls — and it mirrors the [permission UX](/journal/product/permission-ux-design) politics we already design for in team software.

## Failure is a designed state, not an exception

Agents will fail — ambiguous inputs, changed pages, upstream services down, judgment calls beyond their fence. The interface's job is what happens next. A good agent failure states what it completed, what it didn't, why it stopped in plain language, and offers exactly two or three next actions (retry, adjust scope, hand to a human). This is our [error messages practice](/journal/product/error-messages-that-help) wearing new clothes: de-escalate, account for state, propose the path. What it must never do is fail silently halfway and leave the world in an unrecorded half-edited state. Half-done with no trace is the single trust-killer in this whole category; it's why the narration log and the checkpoints earn their keep.

## A word on pace

Agent UX has a strange temporal texture: fast enough to be worth delegating, slow enough to watch. Stream narration so a watching user can interrupt early; make notifications useful so a non-watching user doesn't have to. And design the *waiting state* explicitly — what else the user can safely do in the product while a run executes — because dead waiting time is when doubt grows.

Everything above rests on the same discipline the engineering side runs on the [production checklist](/journal/ai/shipping-llm-features): narrow tasks, traces you can read, and feedback routed back into the system. The interface patterns and the ops patterns are one design, seen from two sides of the glass.

## Key takeaways

- Design scope setting as a structured fence — targets, exclusions, budgets, stop conditions — not a blank prompt box.
- Show a numbered plan preview before any irreversible run; it catches scope errors at the cost of a click.
- Narrate progress in the user's verbs, persist the trace as an audit log, and never show a fake percentage.
- Default every destructive action to reversible; use early checkpoints where true undo is impossible.
- Sell autonomy as a ladder with explicit promotion rungs, from "advise" to "act within fences".
- Design the failure state as carefully as the run: what completed, what didn't, why, and three buttons.

## FAQ

**Doesn't all this ceremony slow the user down?** The ceremony scales with the blast radius. Reviewing five merges takes thirty seconds; cleaning up five wrong merges takes an afternoon. Users learn this fast — trust destroyed is much slower than trust deferred, and the autonomy ladder lets ceremony shrink as evidence accumulates.

**What if the agent can't produce a sensible plan?** That's information: the task is out of scope, and the honest interface says so before acting. An agent that can detect "I don't understand this task well enough to plan it" is dramatically safer than one that improvises, and the fallback — a human doing it with the agent assisting — is still a good product.

**Should the trace show raw tool calls?** One layer down, yes, for admins and debugging. At the surface, no: "Updated 12 records in the review set" earns trust; "POST /api/contacts/8841" spends it. Give the curious a disclosure affordance, give everyone else the story.

**How do we test agent UX before the model is reliable?** Prototype the delegation choreography with a fake agent — a scripted walkthrough, or a human behind the curtain simulating runs. Scope forms, plan previews, checkpoints and undo affordances can all be evaluated in a day of usability sessions before a single real capability ships.
