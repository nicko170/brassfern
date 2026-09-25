---
title: "Streaming UX: making latency feel like thought"
description: "Token streaming is a design material, not a loading state. Skeleton-to-stream choreography, citation timing, honest cancellation, and perceived-performance numbers."
slug: streaming-ux-patterns
cluster: ai
tags: [ai ux, streaming interfaces, perceived performance, chat design, latency]
date: 2025-09-11
author: Aiko Tanaka
keywords: [streaming ui design, llm chat ux, token streaming interface, ai latency design, perceived performance, chat cancellation]
readingTime: 11
heroImage: /images/articles/ai/streaming-ux-patterns.jpg
heroAlt: "Abstract editorial illustration of a dense column of fern-green glyphs dissolving into spaced brass dashes across a cream paper background — a sentence arriving token by token."
---

Type a question into a well-built AI feature and the answer begins almost immediately — not because the model is fast, but because the interface was designed around the fact that it isn't. Type the same question into a badly built one and you stare at three pulsing dots for nine seconds, then a wall of text arrives all at once like a letter you didn't ask for.

Streaming is the single biggest perceptual upgrade AI interfaces have over every other kind of software, and most teams treat it as a transport detail: "we enabled SSE, done". It isn't. Streaming is choreography. This is how we think about it — the same thinking behind the assistant in our [Brightmarsh onboarding work](/work/brightmarsh-onboarding) and the genuinely complex tools we cover in [progressive disclosure for complex products](/journal/product/progressive-disclosure-complexity).

## The latency budget nobody set

Before pixels, numbers. Humans read English at roughly 200–260 words per minute comfortably; a good streaming interface only needs to stay ahead of the reader, not ahead of the network. That reframes everything:

- **Time to first token (TTFT)** is your LCP. Under ~600ms it feels instant. 600ms–1.5s feels responsive. Past 2.5s users start composing theories about what's broken. Everything before the first token is "thinking time" and must be *shown as thinking*, actively — a labelled state with visible work, not a decorative ellipsis.
- **Throughput** after the first token matters far less than people assume. Around 15–25 tokens/second renders faster than reading speed; below ~6 tokens/second the interface starts to feel like a fax machine. If your model is slow, *structure* the stream so the useful parts arrive first (the headline answer, then the detail) rather than trickling chronologically.
- **Total duration** is a UX variable you control. A 1,200-word answer that takes 40 seconds is a worse product than a 250-word answer with a "show the working" disclosure. Streaming doesn't excuse verbosity; it punishes it for longer.

Give each of those a number, write it in the brief, and review it the way you'd review [Core Web Vitals](/journal/engineering/core-web-vitals-field-guide). "Feels fast" is a design target, not a vibe.

## Choreography: the three phases of a streamed answer

We design every streaming surface as three distinct acts, each with its own visual language.

**Act one — intent acknowledged (0–600ms).** The instant the user submits, the interface must answer a different question than the one they asked: *did you hear me?* Their message should land in the transcript immediately (optimistically, before the server confirms), the input should clear or collapse, and the thinking state should begin within one frame. If you wait for a network round-trip before revealing their own message, the product feels broken at the moment of highest intent. We learned this the hard way on a support assistant: 380ms of dead time between Enter and acknowledgement measurably increased double-submits.

**Act two — thinking, shown as work (600ms → first token).** A spinner says "wait". A thinking state says "working, here's where". Show the shape of the forthcoming answer — a skeleton that matches the answer's structure (not a generic grey blob), or a live narration of tool calls when the feature uses retrieval or functions: *Searching your invoices… Found 3 matches.* Every word of that narration must be true. Fake progress narration is lying with CSS.

**Act three — the stream itself.** Here's where craft separates from cargo-culting the ChatGPT look. Layout stability is everything: if each token re-wraps the paragraph and shifts the scrollbar, users get seasick and stop reading. Our rules:

- Grow the container downward only. Never let streaming content push chrome, buttons or neighbouring panels around.
- Pin the transcript to the bottom while the user is at the bottom; if they've scrolled up to read earlier content, show a "new output below" pill instead of yanking their scroll position. New content must never steal the viewport — the same principle as the CLS rules in any [performance program](/journal/engineering/core-web-vitals-field-guide), just live.
- Render markdown incrementally with grace: an unterminated bold marker mid-stream shouldn't flash raw asterisks. Buffer incomplete syntax constructs (code fences, tables, list markers) one token behind the render.
- Keep the caret subtle. A blinking block after the last token is a fine "still going" signal; a pulsing rainbow is a screensaver.

## Citations and tool calls: reveal on arrival, not on completion

If your feature retrieves sources, the citations are the argument. The worst pattern — and the most common — is collecting all sources during generation and appending a "Sources" dump after the answer completes. The user has already judged the answer's trustworthiness by then; retroactive footnotes convince no one.

Instead: the moment the model cites a source, the citation chip appears inline *at that token*, with the source title and a stable position. Clicking one mid-stream opens the source in a side pane without pausing generation. Yes, this means your stream transport needs to carry structured events, not just raw text — server-sent events with typed payloads (`token`, `citation`, `tool_start`, `tool_end`) rather than a text hose you regex apart. That transport design is an API decision your designers should be in the room for, because it *is* the interface.

On the Brightmarsh assistant we render each source as a small card that slides in when cited — 160ms ease-out, matching the motion rules from [motion that earns its keep](/journal/web-design/motion-that-earns-its-keep) — and the sources dock into a persistent rail when the answer finishes. Users who engaged with citations trusted answers enough to act on them; users given a post-hoc source list treated them as decoration. The timing of the reveal is the feature.

## Cancellation: an honest stop button

Every streaming surface needs a stop control, and most are dishonest. The dishonest version: the UI hides the stop button but the server keeps burning tokens to completion. The honest version: pressing stop genuinely aborts the request (an `AbortController` through to the upstream fetch), the partial answer stays in the transcript marked clearly as stopped, and the user can continue from it.

Three details separate a good stop from a checkbox exercise:

1. **Keep what was generated.** Vanishing the partial answer punishes the user for a reasonable impulse. Mark it — "Stopped after 2 of 5 sections" — and offer *Continue*.
2. **Stop must feel instant.** The button should respond in under 100ms even if the server takes a beat to wind down. Optimistic UI, truthful backend.
3. **Say what stopping means for cost and state.** In metered contexts, "you won't be charged for the rest" is information users deserve. If the feature writes to anything (drafts, tickets), say exactly what was and wasn't saved.

Honest cancellation converts frustration into control — it's the same de-escalation instinct as good [error message design](/journal/product/error-messages-that-help).

## Mid-stream errors: the part nobody demos

Your demo never shows it; production serves it daily. The stream dies at token 400 of 900. The connection drops on a train. The model starts repeating itself or drifts into nonsense.

Design for it in advance:

- **Graceful truncation.** If the stream dies, keep the partial answer, mark the interruption precisely ("Connection lost — the answer below is incomplete"), and offer *Retry from here*, not *Start over*. Server-side, this means checkpointing: persist the partial completion keyed to the request so resume doesn't re-pay for regeneration.
- **Degradation, not duplication.** A retry that appends a second partial answer to the first is a support ticket. Deduplicate at the transcript layer.
- **Loop detection.** Repetition loops are common enough to deserve a client-side tripwire: if the last N tokens match a sliding window, cut the stream, apologise briefly, offer regeneration. Better to intercede than to let the product babble.
- **Timeouts with dignity.** If TTFT exceeds your budget (say 12s), fail *visibly and actionably*: "This is taking longer than usual — keep waiting or try a shorter question." Never let a thinking state run forever; a spinner with no timeout is a broken promise.

Every one of these states should be in your design file as a frame, copy-written and art-directed, before a line of streaming code ships. We walk clients through these states exactly the way we walk through [empty states](/journal/product/empty-states-design) — because that's what they are: the product with its guard down.

## The craft details

Small things that make streams feel expensive:

- **Smooth the cadence.** Networks deliver tokens in bursts. A tiny client-side render buffer (30–60ms) that releases tokens at a steady clip removes the staccato and reads calmer. Don't over-buffer — more than ~100ms of smoothing starts to feel laggy.
- **Respect reduced motion.** Streaming text is motion. Under `prefers-reduced-motion`, don't animate the caret, don't slide citations, and deliver text in slightly larger chunks so it reads as rendering rather than animation.
- **Keyboard and screen-reader truth.** Live regions must announce *that* an answer arrived without narrating every token — use a politely-updated summary ("Answer ready, 240 words, 3 sources") and keep the raw stream out of the aria-live region. Test it with a real screen reader; most implementations are acoustic chaos.
- **Sound off, always.** If you add an audible "done" tick, default it off. This is a workplace product, not a microwave.

## Measuring it

Instrument the stream like a page load: TTFT p50/p90, tokens-per-second distribution, completion rate, stop-button rate (a high stop rate is gold — it's your users voting on verbosity and relevance), and error-resume success. Review weekly. On one engagement, simply moving the answer's first sentence earlier in the prompt structure cut measured TTFT by 40% with zero infrastructure work — the single cheapest performance win we've found in AI interfaces, because the architecture was never the bottleneck. The sentence order was.

## Key takeaways

- Set a latency budget — TTFT under ~600ms feels instant; structure prompts so the useful answer streams first, not chronologically.
- Design three distinct acts: instant acknowledgement, *truthful* thinking narration, and a geometrically stable stream that never steals the viewport.
- Citations appear inline at the moment they're cited, not as a post-hoc dump — which means typed stream events are a design requirement.
- The stop button must genuinely abort, keep the partial answer, and report state and cost honestly.
- Mid-stream failure is a first-class design surface: checkpoint partials, resume in place, tripwire repetition loops, and time out with dignity.
- Instrument TTFT, throughput, stop rate and resume success; a high stop rate is feedback, not failure.

## FAQ

**Should every AI feature stream its output?**

Almost always yes for anything longer than a sentence — the perceptual gain is enormous. The exception is strongly structured output (a JSON form-fill, a generated table) where a half-valid structure is worse than a brief thinking state followed by the complete result. Stream narration (*Classifying 12 transactions…*) instead of raw structured tokens.

**How do we handle streaming on flaky mobile networks?**

Checkpoint aggressively server-side and make resume cheap. Keep payloads small, send heartbeats on the SSE channel so timeouts detect dead connections quickly, and design the partial-answer state for mobile first — that's where the dropouts live. Assume the train tunnel exists.

**Is the typewriter effect ever appropriate?**

Simulated typing on top of already-complete text is dishonest latency and users feel it. The smoothing buffer above (30–60ms) is different — it evens out real delivery. If the model returns everything at once, either show a short thinking state then reveal, or artificially stream only if it genuinely aids reading pace. Look, never fake thinking time to seem more considered; that's a lie with a nicer font.

**What about voice-first or multimodal streams?**

Same principles, tighter budgets. Voice makes waiting unbearable — past ~800ms of silence a conversation feels dead — so lead with an acknowledgement utterance while the real answer generates. And interruptibility becomes the core interaction: users must be able to barge in, and the product must stop mid-sentence without sulking.

**How does this fit an existing design system?**

Treat stream states as first-class tokens beside your loading and empty states: named, documented, componentised. We fold them into the same review cadence as everything else in our [AI product work](/services/ai) — an assistant's stream is where your brand's manners live, and manners are a system, not a feature.
