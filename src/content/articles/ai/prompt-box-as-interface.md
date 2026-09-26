---
title: "The prompt box is your whole interface — design it like one"
description: "An empty prompt box teaches nothing. Placeholder pedagogy, suggestion chips, command discovery and attachment UX that make AI assistants learnable."
slug: prompt-box-as-interface
cluster: ai
tags: [ai ux, prompt design, chat interface, onboarding, input design]
date: 2026-06-30
author: Aiko Tanaka
keywords: [prompt input design, ai chat ux, suggestion chips, empty prompt box problem]
readingTime: 10
---

Open most AI products and you get the same interface: a rectangle, a blinking cursor, and a placeholder that says "Ask anything…". Then the product team wonders why week-two retention craters and support gets tickets asking what the assistant can do. "Ask anything" is the most dishonest sentence in software right now. You cannot ask anything. You can ask a fairly specific set of things, phrased in ways the system happens to handle well, and the prompt box — the *entire* interface — declines to mention any of this.

We build AI features the way we build everything else: the interface is responsible for the user's success. When your interface is one text field, the text field carries the whole load — teaching capability, shape of input, and the vocabulary of the product. Here is how we design it to earn that load, drawn from assistant builds, our [onboarding work](/journal/ai/ai-assistant-onboarding), and more teardown audits than I should admit to.

## The prompt box is a blank state, so apply blank-state rules

An assistant's first screen is an empty state wearing a chat costume. Every lesson from [empty-state design](/journal/product/empty-states-design) applies: show what goes here, show what good looks like, make the first action effortless. "Ask anything…" does none of these. It's the AI equivalent of a search box labelled "Search", with an index the user has never seen.

The fix starts with treating the placeholder as a rotating tutor. Not decoration — curriculum. A placeholder that cycles through real, working prompts ("Summarise the last three invoices from Northwind", "What changed in the refund policy since May?") teaches three things at once: the vocabulary the system understands, the objects it can act on, and the shape of a successful ask. We rotate 4–6 placeholder examples, drawn from *actual successful queries in production*, and refresh them monthly. Placeholders written by copywriters at launch drift out of truth within a quarter; placeholders mined from query logs can't lie.

The objection we hear: "curated examples are limiting — they anchor users to a few patterns." Correct, and that's the point. Anchoring is teaching. The blank box doesn't produce freedom; it produces the same five generic prompts everyone types everywhere, followed by disappointment.

## Suggestion chips are navigation, not decoration

Chips below the input are the most-used and most-abused affordance in AI interfaces. The rules we've settled on:

**Chips must be executable, not thematic.** "Learn about pricing" is a topic. "Compare the annual and monthly plans side by side" is a prompt. The first sends users to a paragraph; the second sends them to an answer. Every chip should be paste-able verbatim into the box and produce a good result — we test chips like we test headlines.

**Chips should expire with competence.** First-run chips teach breadth ("What can you do?" is legitimate exactly once). By the fifth session, chips should shift to depth: follow-ups conditioned on the current conversation, not the product tour. A chip that says "Draft the reply" after a research answer is worth ten that say "Try asking about X". Contextual chips roughly double engagement over static ones on the products we've instrumented — and they cost you a small prompt and a structured output, which is to say almost nothing.

**Three, maybe four.** A wall of eight chips is a menu, and menus require the user to do the product-strategy thinking the team didn't. Cognitive load applies to suggestions too. Three chips with contrast (a lookup, a creation, an action) teach the range of the thing better than eight variations of "ask about docs".

## Discovery beyond the first day: the command layer

Chat scales poorly for capability discovery. Users who learn an assistant on day one need a *map* on day thirty, and the map is not more chips. Our answer is a command layer — the `/` menu, borrowed from command palettes and every editor your users already know, and patterned on the discipline in [our command-palette work](/journal/product/command-palette-craft).

Typing `/` opens a filterable list of every capability: `/summarise this thread`, `/compare to last quarter`, `/export as brief`. Each entry has a name, an example of its output, and — this is the part everyone skips — the arguments it expects shown as fill-in slots, like a function signature. `/compare [this period] to [that period]`. Users who would never type a well-formed analytical prompt will happily fill two slots. You've turned prompt engineering into a form, and forms are a solved problem.

Two design rules keep the command layer honest. Every command must be reachable as plain language too — the palette is a discovery mechanism, not a gate, or you've shipped a CLI and called it friendly. And every command's output is logged as a discovered capability, so you can watch discovery *spread*: on one support-tool build, commands discovered via the palette accounted for 31% of weekly active capability use within two months, up from zero, because the feature previously had no surface at all.

## Attachments are context, so show the context

The moment users can attach things — documents, screenshots, records, the current page — the prompt box stops being a chat input and becomes a context assembler. Most products render attachments as little grey pills and hope. The problems with hoping:

**Users can't see what the model sees.** An attached PDF becomes "report.pdf" — did the system read all 80 pages, or the first screen? We've moved to context receipts: the attachment pill expands to show coverage ("3 sections indexed · figures 2–4 extracted"), and when the user asks something outside the attachment, the answer says so instead of confabulating from it. Coverage disclosure is the difference between an attachment feature and an attachment *claim*.

**Implicit context is invisible.** If the assistant knows what page the user is on, what record is open, or what quarter the dashboard is filtered to, that context must be visible *in the box* — a dismissible context chip, not a footnote in settings. Users correct context only if they can see it. The number of "why is it talking about March?" conversations drops to near zero the day you render "Context: March report" as a chip.

**Attachments are a memory boundary.** What persists after this message? What follows the user to the next conversation? This is the same design problem as [assistant memory](/journal/ai/assistant-memory-ux), and the answer is the same: visible, editable, revocable. If users can't tell what's remembered, they'll assume everything is, and they'll be wrong in both directions.

## The send affordance is a contract

One last, underrated element: what happens between Enter and the answer. The send state tells users what kind of machine they're talking to. A spinner says "computing". A status line — "Searching 1,240 support articles…" — says "retrieving from a place you can inspect", which pairs beautifully with [streaming UX that makes latency legible](/journal/ai/streaming-ux-patterns). And while the answer generates, the prompt box should hold the sent prompt visible above the stream, not swallow it — users refine by editing their last ask, and hunting for it in scrollback is friction you designed in.

We also cap and count. Character limits, token budgets, and rate limits should all be legible at input time ("1,820 / 4,000 characters" is honest; silently truncating the user's pasted brief is betrayal). A prompt box that hides the system's constraints forces users to discover them by error.

## Key takeaways

- The prompt box is your whole interface. It must teach capability, vocabulary and input shape — "Ask anything" teaches none of these.
- Rotate placeholder examples from real production queries. Copywriter placeholders drift out of truth; mined ones can't.
- Suggestion chips must be executable prompts, three or four at most, and should shift from breadth-teaching to contextual follow-ups as users gain competence.
- A `/` command layer gives day-thirty users a capability map — with fill-in argument slots that turn prompting into form-filling.
- Render context visibly: attachment coverage, implicit page context, and memory boundaries all belong in or beside the box, not in settings.
- Make the send state and the system's limits legible. A cap users hit by surprise is a trust problem wearing a UX costume.

## FAQ

**Doesn't a great prompt box just delay the need for better onboarding?**
They're the same system. The box *is* the onboarding for a mature user — every placeholder rotation and contextual chip is a continuing-education programme. We cover the first-session version in [onboarding users to an AI assistant](/journal/ai/ai-assistant-onboarding); this article is what happens after.

**How do we source good placeholder examples without leaking other users' queries?**
Mine successful, *anonymised and generalised* query patterns, then have a human rewrite each into clean fictional form. Never surface raw logged queries — privacy aside, they'd carry other people's typos and assumptions. The log tells you the shape; your team writes the sentence.

**Should the input grow into a multi-line editor for long prompts?**
Yes — past about 140 characters of visible capacity, single-line inputs cause a measurable drop in structured, specific asks, because users self-edit to fit the visible field. Auto-grow the box to roughly 8 lines with a subtle scroll past that, and keep the send button anchored.

**When is voice input worth it?**
In mobile and hands-busy contexts where dictation beats typing — field work, accessibility, driving-adjacent (mounted!) contexts. Voice changes prompt shape (longer, messier, more conversational), so pair it with a rewrite-then-confirm step or your error rate will spike. As a default on desktop, it's usually a demo feature, not a workflow.

**How do we know if prompt-box improvements worked?**
Track first-prompt success rate (did session one's first ask return a usable answer), prompt specificity (length and argument count of asks over time), and capability spread (how many distinct commands a weekly active user touches). If those three move, retention follows; we've yet to see it go the other way.
