---
title: "Agent UX: designing for software that acts on your behalf"
description: "When software acts instead of suggests, the interface becomes a control system: permission scopes, visible progress, real undo, and calibrated trust."
slug: agent-ux-control
cluster: ai
tags:
  - AI agents
  - Interaction design
  - Trust
date: 2026-05-26
author: Ruby Castellanos
keywords:
  - agent ux
  - ai agents
  - human in the loop
  - ai interaction design
  - agentic interfaces
readingTime: 11
---

An assistant that *suggests* and an agent that *acts* are different products wearing similar UIs. The moment software can send the email, move the money, close the ticket or reschedule the meeting without a human keystroke, the interface stops being a conversation surface and becomes a **control system**. Every design question re-frames: not "is this chat pleasant?" but "does the operator always know what the machine is doing, what it's about to do, and how to take it back?"

Our earlier piece on [agent UX patterns](/journal/ai/agent-ux-patterns) argued for designing delegation rather than magic — the philosophy. This one is the machinery: the five control surfaces every acting agent needs, and the trust-calibration curve that decides how much autonomy the user grants. We've shipped versions of this in operations copilots and workflow agents through our [AI practice](/services/ai); these are the parts that survived contact with users.

## Control surface 1: Permission scopes, not permission theatre

The dominant permission model for agents today is a binary presented as a modal: "Allow Agentius to act on your behalf? [Yes] [No]." This is security theatre — consent given once, about everything, remembered by no one.

What works is scoped, visible, revocable permissioning borrowed from the world of OAuth and file-system ACLs, redesigned for human comprehension:

- **Scope by verb and object, in language.** Not "access to workspace" but: "Can *draft* invoices — never *send* them. Can *reschedule* internal meetings — needs your OK for anything with external guests." Verbs are the unit of risk; objects are the unit of blast radius. Users can reason about both; they cannot reason about scopes named `crm:write`.
- **Tier the tiers.** We ship three standing permission levels: *Suggest* (agent proposes, human approves every action), *Act with review* (agent acts within low-risk scopes, every action lands in a review queue), *Act freely* (bounded scopes, post-hoc audit log). New features and new users start at Suggest. Autonomy is promoted, never granted by default.
- **Permissions have a home screen.** A standing page — not a settings sub-menu five taps deep — where every granted scope is listed in plain sentences with a one-tap revoke. If users can't casually re-read what they agreed to, the consent has expired even if the token hasn't.

## Control surface 2: A plan the user can inspect and interrupt

Acting agents do multi-step work, and the cardinal UX sin of agentic products is the spinner that hides a plan. During a four-minute autonomous run, a bare spinner tells the user one thing: *something is happening and you've lost the thread*.

The pattern that works is the **visible plan**: before acting, the agent shows its intended steps in plain language — "1. Pull the three overdue invoices. 2. Draft reminder emails in your tone. 3. Queue them for your review" — and during execution, that plan becomes the progress display: steps check off, the current step is named, and any deviation (a tool failure, a judgement call) is announced in-line. This is the agentic extension of [streaming UX](/journal/ai/streaming-ux-patterns): streams show *what it's saying*; plans show *what it's doing*, and doing is the scarier verb.

Two non-negotiables attached to the plan view:

- **Interruptibility.** A pause/stop control that's always live — not disabled during "critical sections" without saying why — and that leaves the system in a stated, coherent condition. "Paused after step 2. No emails sent. Drafts saved."
- **Dry-run for consequential flows.** For anything touching money, customers or public surfaces, the first run offers "show me what this *would* do" — a preview with synthetic or read-only data. Dry-run is the single most effective trust-building feature we've measured; users who preview before enabling grant broader scopes afterwards, because they saw the machine's judgement with the safeties on.

## Control surface 3: Undo that actually exists

Every agent pitch deck includes the sentence "and of course everything is undoable!" Very few products have done the engineering that sentence implies, because undo for an actor that touches *other systems* is genuinely hard:

- **Design the undo at action-design time.** Each action the agent can take is specced as a pair: the action and its reversal — or, where reversal is impossible (a sent email), its *mitigation* (a follow-up correction) with the honest label "cannot be recalled." The product knows which is which, and says so *before* acting, not after.
- **Time-box the easy reversals.** "Edits hold for 10 minutes before syncing" is a design pattern, not a limitation: a reconciliation window where everything is trivially undoable turns the scariest category (bulk changes) into a low-stakes one. Windowed committing is how spreadsheets, Git clients and good agents all handle it, because it works.
- **The audit log is a feature, not a compliance artefact.** A human-readable history — "Tuesday 14:03: archived 12 threads matching 'newsletter'" — with each entry undoable where possible. Users browse it the way they browse bank statements: rarely, and with total dependence on it existing. Motion and feedback within these flows stay inside the [160ms discipline](/journal/web-design/motion-that-earns-its-keep) — control systems need to feel instant and sober, not celebratory.

## Control surface 4: Attention budgeting — when to interrupt the human

The hardest design problem in acting agents isn't permission or undo; it's **interruption economics**. An agent that asks before every action is an intern with a chat UI. An agent that never asks is a liability with good uptime. Somewhere between is a routing decision every action makes: *act, ask, or escalate*.

The routing table we design with clients looks roughly like:

| Action's risk × reversibility | Agent behaviour |
| --- | --- |
| Low risk, easily reversible | Act, log it, mention it in the next summary |
| Low risk, irreversible (or medium, reversible) | Batch into a review queue with one-tap approve-all |
| High risk or novel (never seen this action type before) | Ask first, with the plan and the diff shown |
| Outside all granted scopes | Refuse visibly, explain what permission would allow it |

Two refinements from production. First, **novelty matters as much as risk** — a low-risk action type the agent has never performed for this user gets asked-about once, and the answer teaches the routing table. Second, **summaries replace interruptions**: a daily or per-run digest ("While you were away: 6 routine actions, 2 things need your eyes") converts ambient anxiety into a checkable artifact. This is the trust calibration problem from [designing AI users can trust](/journal/ai/ai-trust-design) made mechanical: the goal is a user whose confidence in the agent tracks the agent's actual reliability, and that tracking is built from visible plans, honest logs, and interruptions that arrive at the right moments — never from marketing adjectives.

## Control surface 5: The failure contract

Agents fail differently than assistants. An assistant that fails produces a bad answer; an agent that fails produces a bad *state of the world*. So the failure UX is a published contract:

- **Failures are announced at the severity they deserve.** A failed low-risk step is a quiet line in the plan view; a failed irreversible step is an interruption with the remediation options already attached. The UI never lets a failure sink silently below a success message.
- **Partial completion is always represented.** "7 of 12 updates applied, listed here; the remaining 5 failed for this reason; here's a one-click retry for just those." Retry-from-checkpoint, informed by the plan structure, beats "something went wrong, start over" by an emotional mile.
- **The agent reports what it *considered*, not just what it did.** For judgement calls — which tickets to escalate, which tone to use — a one-line "chose X because Y" in the log converts mysterious behaviour into reviewable reasoning, and gives users the material to correct the policy rather than abandon the product.

None of these surfaces are optional garnish. Assistants live and die on quality; agents live and die on control. The products earning permission to act more freely next quarter are the ones whose users could always see the plan, always stop the run, always take back the action — and, over a hundred small successful runs, chose to stop watching so closely. That's not a failure of vigilance. That's what earned autonomy looks like.

## Key takeaways

- Permission is scoped by verb and object in plain language, tiered (suggest / act-with-review / act freely), and lives on a first-class screen with one-tap revoke.
- Show the plan before and during execution; every run is pausable at a coherent checkpoint; consequential flows offer dry-run first.
- Undo is designed per action at spec time — reversal, mitigation, or honestly-labelled irreversibility — with time-boxed windows for bulk edits.
- Route every action through act / batch-ask / interrupt / refuse based on risk × reversibility × novelty; replace ambient interruption with digests.
- Publish the failure contract: severity-matched announcements, explicit partial-completion states, and logged reasoning for judgement calls.

## FAQ

**Won't visible plans and permission tiers overwhelm users?**
Only if they arrive as walls of text. The plan collapses to a progress line once it's trusted; permission tiers read as three sentences, not a matrix. Complexity hidden by defaults, depth available on demand — progressive disclosure, the oldest trick in the discipline, applied to agency instead of menus.

**How do we decide what's 'high risk'?**
Three axes, scored with the team and the lawyers in the room: blast radius (how many actors/systems affected), reversibility (designed-in undo, mitigation, or none), and consequence type (money, reputation, data exposure). Actions scoring high on any axis start in ask-first. Tune quarterly against the audit log — the log is also your classification data.

**Is human-in-the-loop just a transitional phase until agents improve?**
Partially — review volumes drop as reliability proves out. But the *control surfaces* are permanent: even a hypothetical flawless agent requires visible plans, logs and revocable scopes, because users must retain the *capability* of oversight whether or not they exercise it daily. Institutions don't grant unobservable power to systems they can't audit; neither do users, once they've been burned once.

**How does this change for internal tools versus consumer products?**
Internal tools can lean harder on batch-review and scopes tied to roles, because blast radius maps to org structure and training exists. Consumer agents need stricter defaults and more dry-run, because the cost of a visible failure is churn, not a support ticket — and there is no admin to call when the user *is* the admin.

**What's the cheapest control surface to start with?**
The audit log. It's the least glamorous, requires no model changes, and retrofits onto almost any agent — and it retroactively makes every other surface meaningful, because review queues, undo and trust calibration all read from it. Ships in a sprint; pays out forever.
