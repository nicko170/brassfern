---
title: "AI form copilots: suggestion, not substitution"
description: "AI form copilots work when they suggest, not substitute: per-field confidence, bulk-fill undo, and one rule — the model never commits silently."
slug: ai-form-copilots
cluster: ai
tags: [ai ux, forms, product design, copilots, onboarding]
date: 2026-09-22
author: Dev Khatri
keywords: [AI form filling, AI copilot UX, autofill design, AI assistance UI, form UX]
readingTime: 10
heroImage: /images/articles/ai/ai-form-copilots.jpg
heroAlt: "A blank paper form on cream paper with a brass mechanical pencil hovering above it, a ghosted pencil suggestion on one line, a brass ruler and fern frond nearby."
---

Every product team we work with has the same demo somewhere in a Figma file: a long, miserable form — onboarding, admin settings, a claims intake — with a sparkle button that fills it all in one glorious instant. The demo is impressive. The shipped feature, when teams build the demo, is a support-ticket generator. Users get a form full of plausible-looking values they didn't write, can't easily audit, and submit anyway because reviewing thirty pre-filled fields is more tedious than typing ten.

The fix isn't to abandon the idea. Form copilots are one of the most genuinely useful places to put a language model — forms are structured, constrained, and verifiable, which is exactly where LLMs perform best. The fix is a single design rule, held like a creed: **the model suggests, the human submits**. Everything below is what that rule looks like in practice.

## Why forms are different from chat

Chat interfaces forgive sloppiness because the user reads every word the model writes before acting on it. A form inverts that. The model's output lands pre-committed in UI elements that carry a heavy default: whatever is in the field at submit time is what the system of record believes. The user's natural posture — especially in a form they've filled before — is to skim, find the empty fields, fill them, and hit the button. Pre-filled values ride past that skim on momentum.

So the unit of design isn't the form. It's the **field**, and the question for each field is: did a person affirm this value, or did they just not delete it? A good copilot makes those two states unmistakably different.

## The suggestion layer

Our standard pattern renders model output as a *suggestion layer* over the form, not as values inside it:

- **Ghost values, not real ones.** Suggested text appears in the field styled as a placeholder or a tinted overlay — visibly provisional, like browser autofill before you accept it. Accept per field with a tap, or accept-all for a section. Rejected suggestions vanish; accepted ones become normal field values the user owns.
- **Per-field confidence.** Each suggestion carries a confidence signal — not a fake precision percentage, but an honest tier. We render three: confident (filled from a reliable source like the user's own documents), plausible (inferred), and guess (the model is riffing). Guesses are either hidden by default or visibly flagged, because a quietly plausible wrong value in a legal-name field is how you get misfiled paperwork.
- **Source chips.** Where the value came from matters as much as the value. "From your last application" and "Suggested" are different claims and deserve different labels. This is the same provenance instinct behind good [citation design](/journal/ai/citation-design-ai-features): people forgive wrong answers they can audit.

The layered approach costs more to build than straight autofill. It's also the difference between a copilot people trust with their onboarding and one they disable after it puts the wrong ABN in their tax form.

## Bulk fill needs a bulk undo

The feature that makes copilots feel magical — "fill this whole section" — is also the one that breaks the suggestion rule at scale. Twenty ghost values is no more reviewable than twenty committed ones. Three patterns rescue it:

**Section-scoped review.** When the model fills a section, collapse the fill into a reviewable receipt: "12 fields suggested from your uploaded council rates notice — 9 confident, 3 need your eyes." The 3 guesses are pulled into a short checklist. Confident fills can be accepted in one gesture because they were extracted, not invented.

**One-gesture undo.** Every bulk fill gets a single, obvious reversal — not Ctrl+Z spelunking through twenty micro-states, but "Undo all suggestions" that restores the pre-fill state completely. If undo is harder to find than the fill button, you don't have a copilot, you have a poltergeist. The state machine behind this is the same one that underpins [structured outputs rendered as UI](/journal/ai/structured-outputs-reliable-ui): model output is a diff against the form state, and diffs can be held, accepted piecemeal, or discarded whole.

**Never across the submit boundary.** This is the hard rule we write into every spec: a suggestion may pre-fill a field, but it may never satisfy a validation requirement that the user hasn't seen. Required fields stay technically empty until a human accepts a specific value. Yes, that means an extra tap. That tap is the feature.

## Where this pays: onboarding and admin

The two contexts where we've shipped form copilots that actually stayed on:

**Onboarding with documents.** A customer uploads an existing artefact — an old invoice, a rates notice, a competitor's export — and the copilot drafts the new account's setup form from it. Extraction tasks suit models beautifully; the source document is right there to cite, confidence is genuinely estimable, and the user is motivated to review because the values are about *them*. Time-to-complete on the last client onboarding flow we instrumented dropped by half, and correction rates after submit (the metric that matters) dropped more.

**Admin and back-office repetition.** Internal tools where the same form gets filled dozens of times a day, by staff who know what right looks like. Here the copilot learns from the user's own history, suggestions carry "you usually…" provenance, and the reviewer is an expert who will catch a bad suggestion in a glance. This is the friendliest possible environment, and it's where we tell clients to start: earn the pattern internally before offering it to customers. The review-queue thinking in [human-in-the-loop design](/journal/ai/human-in-the-loop-queues) applies verbatim.

Where we advise against it: low-frequency forms users see once (no repetition to amortise the trust-building), forms where errors graveyard into real-world consequences faster than people can review (wire transfers, medical dosages), and anywhere the model is guessing from vibes rather than extracting from a source.

## The trust ledger

Form copilots run on a trust ledger that every interaction credits or debits. A confident suggestion that's right: credit. A guess silently presented as fact that the user catches: large debit. A guess that sails through and causes a downstream mess: account closed, feature disabled, thread on social media. The asymmetry is brutal and permanent, which is why we hold the suggestion-not-substitution line even when clients ask for "just autofill it, our users are professionals". Professionals are exactly who will notice the first wrong value — and exactly whose goodwill you can't afford to spend.

Instrument the ledger if you can: acceptance rate per field, undo usage, post-submit correction rate, and time-to-complete. Those four numbers, tracked in the same dashboards we describe in [analytics for AI features](/journal/ai/ai-feature-analytics), tell you whether the copilot is earning trust or burning it —long before the support queue does.

## Key takeaways

- The rule is suggestion, not substitution: model output lives in a visible suggestion layer until a human accepts it, field by field or section by section.
- Distinguish "affirmed" from "not deleted". Ghost styling, per-field confidence tiers, and source chips make provisory values look provisory.
- Bulk fill demands bulk review and bulk undo: a section receipt, a checklist of low-confidence fields, and one obvious gesture that reverses everything.
- Suggestions never satisfy requirements across the submit boundary. Required means a human saw it.
- Start in document-backed onboarding and expert admin tools; avoid one-off forms and high-blast-radius contexts.
- Measure acceptance, undo, post-submit corrections, and time-to-complete — the four numbers on the trust ledger.

## FAQ

**Isn't this just autofill with extra steps?**

Browser autofill replays *known* facts — your address, your card. A form copilot synthesises *new* values from documents and context, which is categorically more powerful and categorically more error-prone. The extra steps exist because the failure modes do. Where a value is already known and verified, use plain autofill and skip the model entirely.

**What about accessibility — doesn't a suggestion layer complicate screen readers?**

It simplifies them, if you build it right. Ghost values are announced as suggestions ("Suggested: Surry Hills, press Enter to accept"), never silently populated, so there's no divergence between what assistive tech announces and what gets submitted. The dangerous pattern for accessibility is invisible pre-commitment, and that's the pattern the suggestion rule forbids.

**How do you compute confidence tiers honestly?**

From provenance, not from the model's self-reported certainty, which is unreliable. Extracted from a user-provided document and cross-checkable: confident. Consistent with the user's history: plausible. Generated with no grounded source: guess. When in doubt, tier down. A copilot that under-promises and over-delivers compounds trust; the reverse compounds churn.

**Should users be able to turn the copilot off?**

Always, obviously, per field group or globally — and the "off" state should be total, not just visually muted. Every pattern in [designing AI features users can trust](/journal/ai/ai-trust-design) applies: an off switch that still phones the model is worse than no switch at all.
