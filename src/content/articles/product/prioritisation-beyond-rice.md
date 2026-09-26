---
title: "Prioritisation frameworks after RICE stops working"
description: "RICE works until the spreadsheet becomes the decision. What comes next: strategy filters, evidence maps, learning-first sequencing, meetings that decide."
slug: prioritisation-beyond-rice
cluster: product
tags: [prioritisation, product strategy, roadmaps, decision-making, product management]
date: 2026-01-19
author: Ruby Castellanos
keywords: [feature prioritisation, RICE alternatives, product roadmap, decision frameworks]
readingTime: 11
---

There is a moment in every growing product team when the prioritisation spreadsheet quietly becomes the product strategy. Scores go in, a ranked list comes out, and the roadmap is "the top of the list, in order." Nobody can defend item seven beyond "it scored well," and item two — the thing a senior engineer keeps describing as load-bearing — sits at rank nineteen because "reach" didn't know how to count it.

That's not a RICE problem exactly; it's a framework-doing-the-thinking problem. RICE, ICE, MoSCoW, Kano — all of them are fine conversation openers and none of them are decision-makers. This piece is about what to do when you notice the arithmetic has stopped matching your judgement: the filters, mappings and meeting formats we use with clients in our [product work](/services/product) when a team has outgrown its scoring sheet.

## Why RICE breaks (and when)

Credit where due: for a two-person team drowning in ideas, RICE is a genuine gift. It forces four writing-downs — reach, impact, confidence, effort — that most teams never do. It breaks later, in four predictable places:

1. **Reach gets inflated.** Reach is the easiest number to game and the least likely to be checked, so ambitious estimates drift upward. Everyone's project suddenly reaches all users.
2. **Effort is fiction** — estimated before any investigation, by people optimising to look fast. Months-long projects enter the sheet as "medium."
3. **Impact and confidence are vibes in a tuxedo.** A 3.0 vs a 2.5 on "impact" is not a measurement; it's a negotiation compressed into a decimal.
4. **The ranked list suppresses the real question.** Once scores exist, the debate stops being "what should we do?" and becomes "are these inputs right?" The framework's hidden danger isn't imprecision — it's that it relocates the argument to a less important room.

The tell that a team has outgrown its framework: prioritisation meetings have become about *adjusting scores* rather than making choices. When you see that, the tool has eaten the judgement it was meant to support.

## Frameworks are for conversations, not arithmetic

The useful reframing: a prioritisation framework is a **disagreement-finding machine**. Its job is not to produce a ranking; it's to surface, cheaply, where the room disagrees — because that's where the decision work lives. Two scores that differ wildly between two people are not an averaging opportunity; they're a flag that says "these two people believe different things about the world."

This reframe changes what you ask of any framework. You stop optimising for precision (false comfort) and start optimising for *legible disagreement* (real signal). Everything below follows from that.

## Layer 1: strategy filters before any scoring

The single highest-leverage move we introduce is a filter that runs *before* any framework: strategy gates. If the company has stated its two or three bets for the half — and if it hasn't, start with a [strategy one-pager](/journal/brand/brand-strategy-one-pager), because no prioritisation tool substitutes for that conversation — then every candidate item answers one question first: **which bet does this serve?**

Items serving no bet don't get scored. They get filed. This single act typically cuts a backlog by half, and it does so *defensibly* — "it doesn't serve either bet" is a strategic sentence, while "it scored 240 vs their 260" is an arithmetic shrug. It also answers the eternal stakeholder complaint — "why isn't my thing on the roadmap?" — in language about company direction rather than spreadsheet decimals.

Note what the filter also does: it makes room for the item RICE can't see. Foundational work — the load-bearing refactor, the [dashboard rebuild](/work/northwind-ledger-dashboard-rebuild) whose payback is every future feature shipping faster — never wins a reach contest against shiny features. Under explicit bets ("make the core loop trustworthy"), it wins instantly, because the bet owns the priority and the framework no longer has to pretend otherwise.

## Layer 2: map evidence, ignore precision

For items that pass the filter, replace fine-grained scores with an honest two-question mapping:

- **Expected value if it works** — meaningful, big, or company-moving. Three words, no decimals.
- **Evidence it will work** — guess, signal (support tickets, sales objections, a [research finding](/journal/product/research-repository-that-gets-used) with real weight), or proof (usage data, a validated experiment).

Plot every item in that 3×3 — value against evidence — and the meeting almost runs itself. High-value + proof: build it, argue details. High-value + guess: this is your *learning queue*, not your build queue — the job is to buy evidence cheaply before committing sprints. Low-value + proof: batch or kill. And the empty quadrant everyone discovers — big, valuable things with zero evidence, sitting unscored for months because nobody knew what to do with them — is usually where the actual strategy conversation was hiding.

The mapping beats scoring because it keeps the two things teams conflate apart: how much something is worth and how sure you are. RICE's "confidence" percentage gestures at this; a visible evidence ladder forces it.

## Layer 3: sequence for learning, not just value

Once you know roughly what matters, the final move is the one frameworks skip entirely: **ordering**. Two items of equal value don't necessarily belong in either order — the right sequence is the one where each step teaches you the most about the next. We ask, of every candidate pair: *if we did A first, what would it tell us about B?*

Sequencing-for-learning heuristics that hold up:

- **Cheap-to-learn first.** The week-long instrumented prototype before the quarter-long rebuild, even when the rebuild scores higher, because it may change what the rebuild is — or retire it.
- **Dependency-aware, not dogmatic.** Build the measurement before the feature it measures. Fix the [activation metric](/journal/product/activation-metrics-honest) before launching the growth push whose success you'd otherwise be unable to read.
- **Alternate risk classes.** Follow a heavy platform item with a fast user-visible win. Teams need rhythm; roadmaps need morale; sequencing is where both get designed.

This is also where a producer earns their keep: sequencing is a craft of calendars, dependencies and human energy, and no framework touches any of them.

## The meeting format that ends with decisions

Process matters less than the room. The format we run — sixty to ninety minutes, monthly — is tuned to the disagreement-finding principle:

1. **Pre-read, scored in silence.** Items and evidence summaries circulate two days ahead. Everyone scores or places items *alone*. Group scoring produces groupthink in real time; silent scoring produces a map of actual disagreement.
2. **Compare, don't average.** Open with the deltas. "Priya put this at company-moving proof; Sam put it at big guess" — that row is the meeting. Convergent items get seconds of ratification.
3. **Fight the deltas for forty minutes.** The delta conversation has a rule: argue from evidence you could go get, not from confidence. "I believe enterprise wants this" loses to "I have eleven sales objections in a spreadsheet."
4. **Decide, and log the why.** Every item leaves with a status — build, learn, file, kill — and a one-line rationale in a decision log. The log is not bureaucracy; it's the artefact that stops settled debates from being re-opened by whoever missed the meeting. (The same principle as [decision links in a research repository](/journal/product/research-repository-that-gets-used): memory you can point at beats memory you have to re-argue.)

One more formatting rule that sounds small and isn't: the meeting ends with someone reading the decisions aloud. Decisions that were made in ambient agreement get re-litigated; decisions spoken and logged tend to stick. If your team wants an outside facilitator's first run of this, it's a [conversation we have often](/contact) — the first facilitation is mostly teaching the delta-fighting rule.

## Keep the system small enough to survive

The final anti-pattern is framework accretion: RICE, plus a Kano layer so it's "customer-informed," plus WSJF because an executive read a book, until prioritisation itself consumes the roadmap's energy. Every layer has to earn its keep by changing decisions; review the stack quarterly the same way you'd [measure whether your metrics still mean something](/journal/product/activation-metrics-honest). Most healthy teams end up with three pieces: a strategy filter, an evidence map, and a decision-logged meeting. That's not a sophisticated apparatus. It's a sophisticated *habit* — and habits, unlike spreadsheets, are still working at month eighteen.

## Key takeaways

- Outgrown frameworks show one tell: meetings about adjusting scores instead of making choices. The framework has eaten the judgement.
- Treat frameworks as disagreement-finding machines. Optimise for legible disagreement, not false precision.
- Strategy filters run before scoring: "which company bet does this serve?" cuts backlogs defensibly and makes room for foundational work.
- Map expected value against evidence. High value with no evidence is a learning queue, not a build queue — and usually where the real strategy conversation hides.
- Order the roadmap for learning: cheap-to-learn first, measurement before features, alternate heavy and light.
- Silent scoring, fight the deltas from evidence, log decisions with reasons, and read them aloud before the meeting ends.

## FAQ

**Should we abandon RICE entirely?**
Not necessarily. RICE remains a decent *idea-intake* tool — the discipline of writing reach and effort estimates beats not writing them. The failure is letting its output be the decision. Keep the inputs, replace the verdict.

**How do we include qualitative or brand-damage concerns a score can't see?**
Through the evidence column and the meeting, not the maths. "Fixing this protects enterprise trust" is an evidence claim you can support (churn interviews, renewal calls) and argue at the delta stage. Trying to numerically encode "this feels reputationally wrong" produces comedy decimals; stating it plainly produces a decision.

**What about stakeholder pet projects that score terribly?**
The strategy filter is your friend: "which bet does it serve?" is a kinder and firmer door than "it scored low." If it's genuinely important to the business and serves no stated bet, that's not a prioritisation problem — it's a strategy input, and it belongs in next half's bets conversation.

**How often should we re-run prioritisation?**
Monthly for the map, quarterly for the bets. Constant re-prioritisation is a sign the filter isn't trusted; sensible teams let a half's bets stay put and re-rank the items beneath them as evidence arrives. Roadmaps should bend without snapping — and a decision log is what tells you whether it bent for a reason or just bent.
