---
title: "The context window is a product decision"
description: "The context window is a product decision: curating what the model sees, showing users what's in scope, and designing honest 'I don't know' moments."
slug: context-window-product-design
cluster: ai
tags: [ai ux, llm, context, product design, transparency]
date: 2026-09-25
author: Dev Khatri
keywords: [context window UX, LLM product design, AI memory UX, RAG context design, AI transparency]
readingTime: 11
---

Somewhere in every LLM feature's architecture diagram is a box labelled "context", and it's usually the box the engineers argue about while the designers work on the chat bubbles. That's backwards. The context window — what the model can see when it answers — is not infrastructure. It's the product's field of vision. Every hallucination, every creepy "how did it know that", every maddening "I already told you this" starts life as a decision about what goes in the window, what gets left out, and whether the user can tell the difference. Treat those as product decisions, design them like you mean it, and half the classic LLM complaints evaporate.

## What the model sees *is* what the product knows

Users form a mental model of your assistant from its first answer, and the model they form is almost always wrong in the same direction: they assume it sees what they see. They're looking at a document, they ask a question about it, and they're baffled when the assistant answers from general knowledge instead of the page on screen. Or worse — it answers *plausibly*, blending half-guessed content with confidence, and the user can't tell which parts came from the document.

The root cause is a context decision made in an engineering ticket: which pages are indexed, what gets retrieved per query, how much history is carried, what's truncated when the window fills. The user never saw that ticket. They just see an assistant that sometimes reads the room and sometimes hallucinates it.

So the first product artifact for any LLM feature isn't a wireframe. It's a **context manifest**: a plain-language inventory of what the assistant can see, in each surface, in each state. Can it see the current page? The whole vault? Last week's conversations? The user's settings? Write it down as user-facing truth, not as an implementation detail — because it will become the honest answer to "why did it say that?" and the source material for every scope indicator you design.

## Curating the window is editorial work

A bigger context window doesn't remove the design problem; it reheats it. With a million tokens you *can* include everything, and the model will happily attend to the wrong thing, quote the deprecated policy alongside the current one, or drown the one relevant fact in forty pages of retrieval confetti. The failure mode changes from "didn't know" to "couldn't find in the noise" — ask anyone who has debugged lost-in-the-middle behaviour, or read our notes on [chunking as a design decision](/journal/ai/rag-chunking-design).

Effective context curation is editorial, and it has three craft rules:

**Recency and precedence are explicit.** When context contains conflicting versions — a superseded price list, an old policy doc — the system prompt must say which wins, and the retrieval layer should prefer it. "Most recent wins" is a product policy before it's a ranking function.

**Less, chosen well, beats more, chosen lazily.** Two hundred tokens of the right document outperform twenty thousand of approximate relevance — in accuracy, latency, and cost. This is why we pair context work with [evals-first development](/journal/ai/evals-first-development): a golden set that includes "questions where the answer is nearby but not retrieved" catches lazy retrieval long before users do.

**Exclusions are features too.** Deciding the assistant *doesn't* see DMs, drafts, or the finance folder is scope design, not a limitation. Users trust a smaller field of vision they understand over a huge one they can't predict. Some of the best-regarded assistants we've shipped are proudly narrow: this one sees your orders, that one sees your docs, neither pretends to see both.

## Show the scope, don't bury it

Once the manifest exists, the interface should render it. Users manage their trust continuously, and they can't manage what they can't see. Three patterns we return to:

**The ambient scope indicator.** A persistent, glanceable statement of what's in view: "Searching: Help Centre + your tickets" in the chat header, a subtle line under the composer, a chip on each retrieved answer. It changes as scope changes. This is the contextual cousin of [disclosure patterns](/journal/ai/ai-disclosure-patterns) — the machine states its working conditions up front instead of apologising after.

**The expandable "what I can see".** One tap from the indicator to a plain-English list, mirroring the context manifest. Users almost never open it, and that's fine — its existence changes how the occasional opening lands. It's the difference between discovering a camera and being shown one.

**Per-answer provenance.** When an answer draws on retrieved context, say which. [Citation design](/journal/ai/citation-ux-rag) covers the mechanics; the product point is that every citation is also a scope lesson. Twenty answers that visibly cite the Help Centre teach the scope model better than any onboarding carousel.

## Graceful forgetting

Windows fill, sessions reset, retrieval misses. The question isn't whether the assistant loses context — it's whether the *experience* of losing it is designed. Undesigned, it looks like amnesia: the user refers to "the invoice we discussed" and the assistant blinks politely. Designed, it looks like a professional boundary.

Moves that work:

- **Announce the boundary at the start.** "This chat doesn't remember past conversations" in empty state copy prevents the discovery moment from being a betrayal. Set the expectation in [assistant onboarding](/journal/ai/ai-assistant-onboarding), not in a support article.
- **Name the drop when it happens.** If the conversation outgrew the window and early turns are gone, the honest assistant says so when it matters: "I can't see the earlier part of our conversation — could you paste the figure again?" One sentence, in the moment, turns a silent corruption of trust into a normal human request.
- **Offer the fix.** Ranges, uploads, links — give the user a way to put the missing thing back in scope ("Attach the invoice and I'll pick it up"). Forgetting with a remedy is a workflow; forgetting without one is a dead end.
- **Distinguish forgetting from refusing.** "I don't have access to that" (scope exclusion) and "I've lost that from context" (capacity) and "I'm not allowed to" (policy) are three different truths. Collapsing them into one generic "I can't help with that" teaches users that the assistant's limits are arbitrary — the same transparency principle that runs through [designing for trust](/journal/ai/ai-trust-design).

## The dignity of "this isn't in my scope"

The highest-trust moment in any assistant is the honest non-answer. Every product team wants their assistant to attempt everything; every user research session rewards the assistant that knows its edges. "That's not in the documents I can see — want me to search the web instead, or would you like to upload it?" is three products' worth of UX in one sentence: it states the scope, owns the gap, and offers forward motion.

Design these moments with the same care as the happy path, because they *are* the trust path. An assistant that sometimes declines cleanly gets believed when it answers confidently. An assistant that never declines gets doubted everywhere — fairly, since some of its confident answers are confabulations dressed for dinner. The failure-state canon in [when the model is wrong](/journal/ai/ai-wrong-answer-ux) applies, with one addition for context: the most dangerous wrong answer is the one that's factually fine but drawn from the wrong scope — last year's policy, the other client's account, the public web instead of your vault.

Guard that with evals, naturally: golden questions whose correct answer is "this isn't in your scope", graded on whether the assistant closes rather than guesses. Scope refusal is a behaviour, and behaviours you don't measure drift.

## A working agreement

When we kick off LLM features now, the context manifest and the scope indicators are in the first design review alongside the wireframes — not because we're precious about process, but because every week we've spent retrofitting scope transparency onto a shipped assistant was more expensive than the week of designing it first. The context window costs real money per token, shapes every answer, and defines what users believe the product is. That's not infrastructure. That's the product.

## Key takeaways

- What the model sees *is* the product's knowledge. Write a context manifest in plain language before you wireframe — it becomes your scope UI copy and your honesty backbone.
- Bigger windows don't remove the curation problem. Recency and precedence rules, tight retrieval, and deliberate exclusions are editorial product decisions.
- Render the scope: an ambient indicator, an expandable "what I can see", and per-answer provenance that teaches the mental model answer by answer.
- Design forgetting: announce boundaries early, name context drops in the moment, offer remedies, and never blur the line between forgetting, scope exclusion, and refusal.
- Treat "not in my scope" as a first-class designed moment and an evaluated behaviour. Assistants that close cleanly get believed the rest of the time.

## FAQ

**Doesn't showing scope add clutter to the interface?**

A well-designed scope indicator is one short line — less chrome than a timestamp. And the clutter economics run the other way: every answer the user doesn't have to second-guess saves them a verification loop. Scope UI doesn't add noise; it retires doubt.

**How do we handle scope across surfaces — chat vs inline vs email?**

Declare scope per surface, per the manifest, and let the indicator reflect it. An inline assistant that sees only the current document should say exactly that — and shouldn't pretend otherwise when the user asks about last month's report. Multi-surface honesty beats single-surface magic followed by confusion.

**Isn't "what I can see" a security disclosure risk?**

The manifest describes *categories* of access (your documents, your orders, the help centre), never internal architecture, keys, or retrieval mechanics. If your scope description would compromise security by existing, the problem is the architecture, not the transparency.

**Where does memory fit into all this?**

Memory is context with a longer fuse, and the same rules apply: visible, editable, scoped. We wrote the memory counterpart to this piece in [designing what assistants remember](/journal/ai/assistant-memory-ux) — the two systems should share one manifest and one etiquette.
