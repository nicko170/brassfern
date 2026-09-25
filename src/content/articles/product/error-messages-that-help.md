---
title: "Error messages that de-escalate"
description: "An error message is a conversation at someone's worst moment with your product. The structure, tone rules and support hooks that make errors actually help."
slug: error-messages-that-help
cluster: product
tags: [ux writing, error handling, microcopy, product design, support]
date: 2025-07-09
author: Ruby Castellanos
keywords: [error message design, ux writing errors, error handling ux, microcopy errors, error states]
readingTime: 8
---

Nobody reads your error messages until they have to. Then they read them in the worst possible state of mind: mid-task, mildly panicked, often with money or a deadline on the line, and — according to our session replays — while already composing the support ticket in their head. An error message is not copy. It's a conversation at the exact moment your product broke a promise.

We've written and rewritten error states across a [community bank](/work/copperline-community-bank), a [telehealth platform](/work/pylon-health-telehealth-flow) and a [payment-heavy providore checkout](/work/tallow-and-co-providore). The through-line: most error copy fails not because it's rude, but because it's *uninformative in a confident tone*. "Something went wrong" is the "we need to talk" of product writing. Here is the structure we teach every squad.

## The five-part error message

Almost every good error message assembles the same five parts. Not all five appear every time — but you should be able to point at where each one went.

1. **What happened.** One plain clause, user-centred. "Your payment didn't go through." Not "Transaction failed" (that's the system's dialect) and not "Oops!" (that's the copywriter's nerves showing).
2. **Whose fault it isn't.** Users reliably blame themselves. Correct them. "This is on our side" or "Your card wasn't charged" — the second does double duty, answering the question they're actually asking.
3. **What we kept.** The single most calming sentence in error UX: "Your form answers are saved." If you can't say it truthfully, that's an engineering bug, not a copy problem.
4. **What to do next.** One action, one button, specific. "Try again" when a retry plausibly works. "Contact your bank" when it won't. Never "try again later" for something later won't fix — that converts a small problem into tomorrow's support ticket.
5. **A trace for the humans.** An error reference code, quiet and secondary: "Ref 8F2-KQ". More on this below, because it's the highest-leverage line you'll ever write.

The parts compress hard at small scales. A form field error might manage only parts one and four — "Enter a date in the future" — and that's correct. A full-page outage earns all five.

## Tone: calm is a feature, not a personality test

Error tone debates usually collapse into "friendly vs formal". Wrong axis. The axis that matters is *disaster calibration*: how bad is this, and does the copy's temperature match?

We use a three-band scale:

- **Friction** (validation, empty states): direct and breezy. "That email doesn't look complete — mind checking it?" Warmth costs nothing here.
- **Failure** (payment declined, upload died): calm, plain, zero jokes. This is where cutesy copy does real damage. A user whose card was declined in public does not want to be told "Houston, we have a problem."
- **Catastrophe** (data loss, security, money moved wrongly): surgical. No personality at all beyond competence. Full sentences. Specifics. A named path to a human.

The mismatches are what users remember. A bank that jokes during fraud alerts and a bank that goes robotic over a missed optional field have both failed the same way: the copy reported the writer's mood instead of the user's situation.

One more rule we enforce in review: **never apologise twice**. One sincere "sorry" per incident. Repeating it reads as a product that knows it's guilty — and legally, in some industries, it can be treated as exactly that.

## Write errors backwards from the support ticket

Here's the habit that changed our error writing the most. Before writing the message, we ask support: *what does the ticket about this look like?*

If the answer is "user says it didn't work, we ask them what they were doing, they don't remember, we search logs by timestamp," the error message failed at its most profitable job. Every unactionable error generates a support conversation that starts from zero. Every good one arrives with evidence attached.

For the [Copperline Mutual rebuild](/work/copperline-community-bank), each failure state carries a short reference code mapped to a correlation ID in the logs. The message doesn't expose the ID — it shows a friendly token ("Ref 8F2-KQ") that support can resolve to the full trace. Result, from their first quarter live (illustrative, but typical of the pattern): average handling time on error-related tickets down by more than a third, and "something went wrong" disappeared from the ticket queue entirely — because nothing in the product says it any more.

Design has a role here too. The reference and the action must not compete. Next step gets the button; the reference sits in small mono type under it. Users photograph screens to send to support. Design for the screenshot.

## The four messages to ban

Some lines are so common they've stopped sounding like what they mean. Our lint list — yes, we lint copy in review:

- **"Something went wrong."** The product knows what failed and which subsystem failed. If you genuinely can't say, say that: "We can't tell what happened yet — here's what we saved."
- **"Invalid input."** Invalid *how*? Every validation rule was written by a person who knows the rule. "ABNs are 11 digits" beats "invalid ABN" by exactly the amount of information it contains.
- **"Are you sure?"** on destructive actions. It's a riddle. Name the consequence instead: "Delete this invoice? It can't be recovered." The button then completes the sentence: "Delete invoice."
- **"Error 500."** as user-facing text. Status codes are for machines and developers. If a user sees one, someone shipped a debugging tool to production.

## Errors deserve a design of their own, sometimes

Most errors should be quiet — inline, near the cause, in the flow. But two situations justify bespoke, designed error pages.

First, **outsages and maintenance walls**. If your product is definitively down, a real page — status, what you know, when you'll know more — outperforms a stack trace by an unimaginable margin and costs an afternoon. Second, **the 404**. It's the one error users generate themselves, at scale, forever, which makes it a brand surface. Ours argues the case at length over in [404 pages with personality](/journal/web-design/designing-404-pages).

For everything else, invest in the pattern library: inline errors, field-level messages, toast failures with undo, and empty states that teach. Document each with its five parts filled in, so the next squad writes the *content* of the error instead of reinventing its anatomy. That's how error quality survives team changes — the same reason we argue [accessibility starts in the design file](/journal/web-design/accessible-design-handoff) rather than in a QA ticket.

## Key takeaways

- Every error message answers five things: what happened, whose fault it isn't, what was kept, what to do next, and how support can find it. Compress the set; don't skip it.
- Match tone to disaster, not to brand athleisure. Friction can be warm; failure must be calm; catastrophe must be surgical.
- Write errors backwards from the support ticket. A reference code mapped to logs is the cheapest support deflector you'll ever ship.
- Ban "something went wrong", "invalid input", "are you sure?" and bare status codes. Lint copy like code.
- Give outages and 404s real, designed pages. Quiet everything else into a documented error pattern library.

## FAQ

**Should error messages be funny?**
Rarely, and only at the friction band — a playful empty state or a gentle validation nudge. Once money, data or health is involved, humour reads as the product not taking the problem seriously. The exception is self-inflicted, zero-stakes moments, like a 404, where charm is cheap and the user isn't stuck.

**How do we handle errors we can't predict?**
Design the fallback honestly. Tell the user what you *can* say: that their work is preserved (make it true), that the team has been alerted (make that true too), and the one action available to them. A truthful generic message beats a confident specific lie.

**Who should write error copy — designers, developers or writers?**
Developers discover the errors; they should draft them, because they know what actually failed. A writer or designer then runs them through the five-part check and tone bands. The failure mode to avoid is developers shipping log output or writers inventing causes that aren't real.

**Do reference codes really get used?**
Yes, if they're short, on-screen, and formatted for a photograph or a phone call — groups of characters, no ambiguous glyphs (0/O, 1/I/l). Across our support-heavy projects, reference codes are consistently among the highest-leverage lines in the product, purely because they let support skip the "what were you doing?" interview.
