---
title: "Multimodal interfaces: beyond the chat box"
description: "When chat is the wrong interface: designing AI products with the right modality — voice, image, structured output, inline suggestions — and how to choose."
slug: multimodal-ux-design
cluster: ai
tags: [ai, interaction design, voice ui, interface patterns, multimodal]
date: 2026-07-15
author: Dev Khatri
keywords: [multimodal ai ux, voice ui design, ai interface patterns, beyond chat ui]
readingTime: 9
---

The large language model gave us a miraculous gift, and the industry's first response was to put it in a text box. Two years on, the chat box has become the hamburger menu of AI: the lazy, universal container that hides everything and delights no one. Chat is wonderful for some things — open-ended exploration, drafting, negotiation, ambiguity — and actively bad for others. A user adjusting the seat map on a booking flow does not want to type "move me to a window seat, ideally row 12 forward". A warehouse picker does not want to type at all.

The interesting design work in AI right now isn't the model. It's the *modality decision*: which input and output shapes serve this task, this user, this moment. Here's the framework we use across our [AI product engagements](/services/ai), with the trade-offs made explicit.

## The modality decision matrix

Four questions, in order:

**1. How structured is the user's intent?** High structure ("book the earliest appointment next Tuesday") wants structured input — a date picker, a slot grid — not prose. Low structure ("help me figure out why churn spiked") wants conversation. The mistake is forcing structured intent through the ambiguity of chat, which adds an interpretation layer where none was needed.

**2. How structured is the right answer?** If the correct output is a table, a comparison, a route, a calendar — render the object, not a paragraph describing the object. Text is the fallback when the answer genuinely is prose.

**3. What are the hands and eyes doing?** Driving, cooking, wearing gloves, holding a child, walking a warehouse aisle. Voice and glanceable output exist for these contexts. Conversely, open-plan offices, hospitals and libraries punish voice input — always provide a silent path.

**4. What's the cost of a misread?** High-stakes tasks (payments, medical, deletion) demand explicit confirmation controls — buttons, not "just say yes". Chat's ambiguity is a liability precisely where precision matters most; see our [error messages piece](/journal/product/error-messages-that-help) for the copy side of repair.

Score a task against these, and the modality usually picks itself.

## Structured output: render the answer, not the essay

The single most underused pattern in AI products: the model's job is to *fill an interface*, not to write about one. When a user asks an assistant for a comparison, the best response is often a real comparison table — sortable, honest, actionable — with the model's prose as a caption. When they ask for options, render cards with buttons. When they ask for a plan, render an editable checklist.

This is LLMs-as-compilers: natural language compiles to structured JSON, which hydrates real components. The benefits compound:

- **Scannability.** Users compare rows, not paragraphs.
- **Actionability.** Each rendered object carries its own controls — book, save, edit — so the next step is one tap, not another prompt.
- **Reduced hallucination surface.** A schema constrains the model; you can validate numbers against your own data before rendering, and flag anything unverifiable. Our piece on [shipping LLM features](/journal/ai/shipping-llm-features) covers the validation layer in detail.
- **Honest streaming.** [Streaming patterns](/journal/ai/streaming-ux-patterns) apply to structured output too: stream the skeleton first, populate fields progressively, never block on the slowest field.

The trade-off is real: you must define schemas per task type, which means product decisions about what the assistant can do — a bounded capability set, deliberately chosen. That's not a limitation. That's design.

## Voice: the most misapplied modality

Voice input wins when typing is expensive (mobile, hands-busy, accessibility) and when intent is genuinely conversational. It loses when precision matters, when the environment is shared, and when the task has a visual answer.

Design rules we hold to:

- **Voice input, silent output.** Most people will speak a request in the kitchen but want to *read* the answer. Never assume voice in means voice out; always render the response visually, with audio as an opt-in.
- **Show the transcription.** Always display what the system heard, with an edit affordance. Misheard words discovered after the answer destroys trust; discovered before, they're a shrug.
- **Design for barge-in and disfluency.** Real speech has "um", restarts and interruptions. A voice UI that requires perfect sentence grammar is a typing test with extra steps.
- **Time-box listening.** Silence timeouts of one beat too long kill the illusion of conversation; one beat too short cuts people off mid-thought. Tune with real users, not a lab.

## Inline and ambient: the AI that never speaks

The most valuable AI in many products is the kind that never opens a conversation at all. Inline suggestions — the grey-text autocomplete in a composer, the "this looks like a duplicate" flag while filing a ticket, the suggested category while importing transactions — respect the user's flow instead of interrupting it. In the [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild), the highest-rated AI feature wasn't the assistant: it was the one-tap suggested match in the reconciliation queue. Nobody remembers it as "AI". That's the point.

Rules for the ambient mode: the suggestion must be dismissable with zero cost (typing overrides it), wrong suggestions must cost nothing (users forgive a ghost they can type through), and latency must be under ~300ms or the suggestion arrives as an interruption. This is classic [progressive disclosure](/journal/product/progressive-disclosure-complexity) the AI era — capability surface in proportion to confidence.

## Choosing, combining, sequencing

Real products mix modalities, and the seams are where design quality shows. Healthy combinations:

- **Chat for discovery → structured UI for commitment.** Ask in prose, then confirm with real controls ("here's the appointment — confirm?").
- **Structured input → conversational refinement.** Pick from the slot grid, then "anything earlier?" in chat. Let each modality do the half it's good at.
- **Voice capture → visual review.** Speak the note; review the structured extraction before saving.

Unhealthy combinations are sequential duplicates: making the user say it, then type it, then confirm it. Each modality hop is a tax — charge it only when it buys precision the previous hop couldn't.

One more constraint: every modality you ship is an accessibility obligation. Chat-only products exclude motor-impaired users; voice-only excludes Deaf users and shared environments; vision-dependent flows need screen-reader paths. The [accessibility audit process](/journal/product/accessibility-audit-process) now includes a modality audit by default, because AI features have quietly become the least accessible layer of most products.

## Key takeaways

- Chat is one modality among many; choose by the structure of the intent, the structure of the answer, the user's context, and the cost of error.
- Render structured answers as real interfaces — tables, cards, calendars — with model prose as the caption.
- Voice in almost never means voice out; always show the transcription and design for messy speech.
- Ambient, inline suggestions are often the highest-value AI feature, precisely because they don't announce themselves.
- Every modality is an accessibility surface; audit them all.

## FAQ

### Won't structured outputs limit what the model can do?

Deliberately, yes. A bounded set of renderable answer types is a product decision, and it's what separates a designed assistant from a demo. Users don't experience a schema as a limit; they experience it as competence.

### Is a chat box ever the right *primary* interface?

Yes — for genuinely open-ended work: research, drafting, negotiation, exploration, support triage. If you can't enumerate the top five tasks, chat is probably right. If you can, those tasks deserve purpose-built UI with the model behind it.

### How do we prototype multimodal flows cheaply?

Wizard-of-Oz everything. A human playing the model behind a structured prototype tells you whether the modality pays for itself before you write a line of integration code. Modality decisions made in Figma cost nothing; ones made after launch cost migrations.

### What's the biggest mistake teams make adding voice?

Building voice output they never tested in a real environment. A synthetic voice reading a four-paragraph answer in a noisy kitchen is a comedy sketch. Test in the place the task happens, with the ambient noise the task attracts.
