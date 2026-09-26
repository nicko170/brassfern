---
title: "When the AI says no: moderation UX"
description: "Every generative AI feature eventually refuses a user, and most refusals are dead ends. Designing blocked, revised and appeal states that preserve dignity."
slug: ai-moderation-ux
cluster: ai
tags: [moderation ux, ai safety, blocked states, responsible ai, content policy]
date: 2026-06-09
author: Aiko Tanaka
keywords: [content moderation UX, AI safety UX, blocked state design, AI refusal handling, responsible AI product design, moderation appeal flow]
readingTime: 12
---

Somewhere in your AI feature's future, a real person is going to type something innocent — a dermatology question, a legal letter to their landlord, a marketing line about a knife set for a cooking-school client — and the model is going to refuse. The safety classifier will fire, or the system prompt will. And what happens next, in the two seconds of interface that follow, decides whether that user trusts your product or quietly starts telling people it "doesn't work."

We have audited a lot of AI products in the last two years, in our own builds and in [responsible-AI reviews](/journal/ai/responsible-ai-review) for clients. The pattern is remarkably consistent: enormous care lavished on the happy path, and a refusal state that looks like a compiler error. *"I can't help with that."* No reason, no path forward, no acknowledgment that the machine might be wrong. A dead end with a vaguely scolding tone.

The refusal is a product surface. It deserves the same design rigour as the answer — more, in fact, because the user experiencing it is already frustrated. This is the framework we use.

## The user's mental model: it broke, or I'm in trouble

When a refusal fires, users reliably construct one of two stories, both bad. The first: *the product is broken.* These users rephrase the same request four times, get refused four times, and leave convinced the AI is useless. The second, worse: *I've done something wrong and someone is watching.* These users feel surveilled and scolded by a text box. We have watched this second reaction in usability sessions — people visibly lean back from the screen. One participant apologised to the prototype.

Neither story survives honest copy. The single most powerful sentence in a refusal state is the one that answers the user's silent question: **why did this happen?** Not the policy clause — the reason, in human terms, with an acknowledgment that the machine is fallible.

Compare, for a benign medical question that tripped a health-advice filter:

> "I can't help with that."

versus:

> "This touches on personal medical advice, which I'm not able to give — my answers there could be wrong in ways that matter. Here's what I can do instead: explain how these treatments generally work, or help you write good questions for your GP. I do sometimes over-refuse; if this seems like a mistake, tell me."

The second version is longer, and every word is load-bearing. It names the reason (predictability), states the boundary (honesty), offers redirection (a path forward), and admits fallibility (dignity). Users shown the second version in our bank-assistant work for [Copperline Mutual](/work/copperline-community-bank) re-engaged with the feature at roughly double the rate of the terse baseline.

## Dead ends are a design failure, not a safety requirement

Here is the thing moderation UX gets wrong most often: teams treat the refusal as the end of the interaction, when the safety requirement only covers the *output*. Nothing about declining the original request obliges you to abandon the human who made it.

So we design every refusal state with what we call the **three doors**:

**Door one — the adjacent yes.** The most useful response to "no" is a nearby "but I can." The user asked the assistant to write a threatening-sounding collections note; it can instead offer to write a firm but professional payment reminder. The user asked for a diagnosis; it can offer to explain the condition or prep an appointment. Doing this well requires the refusal response itself to be a small act of generation — a templated "I can't" followed by a contextual offer is cheap to build and transforms the emotional register of the moment. The assistant stops being a wall and starts being a person with boundaries.

**Door two — the revision hint.** Many refusals are triggerable phrasing around a legitimate intent. If you can detect *which* part of the request likely caused the flag, say so and suggest the rephrase: "It may be the phrasing about X — if you can describe the outcome you want rather than the approach, I can probably help." Some teams resist this as "teaching people to jailbreak." That's a confusion of categories. Helping a dermatology patient phrase a benign question is not the same as publishing exploits; your actual adversaries don't need your hints.

**Door three — the human path.** If the product has a human layer — support, account managers, a review team — the refusal should offer it where the underlying need is legitimate. "This is outside what I can do, but our team can; want me to hand this over?" The [human-in-the-loop queue](/journal/ai/human-in-the-loop-queues) has to exist on the other side, of course — a door that opens onto nothing is worse than no door.

## Over-refusal is a metric you're probably not tracking

Every safety system has two error rates: the harmful things it fails to catch, and the harmless things it blocks. The first gets telemetry, dashboards and executive attention. The second is usually invisible — counted, if at all, as a line item nobody owns.

This is backwards in a way that costs real usage. On one client audit, we sampled their refusal logs and found that nearly a third of refusals were over-reach: benign requests tripping a broad classifier. Their users weren't being protected; they were being rejected, silently, at scale, and the product team had no idea because "refusal rate" was the only number on the wall.

The instrumentation we now install on every moderation surface:

- **Refusal rate by intent category**, not in aggregate. A 5% refusal rate on "billing questions" is a broken classifier. A 5% refusal rate on "write something mean about my colleague" is the system working.
- **Rephrase-and-retry outcomes.** When users rewrite after a refusal and succeed, the first refusal was probably over-reach. The rephrase pairs — refused prompt → successful prompt — are gold for tuning, and reviewing a sample monthly is an hour well spent.
- **Abandonment after refusal.** How many users simply leave the session? This is the cost side of the safety ledger, and it should sit next to the benefit side when policy thresholds get set.
- **Explicit appeal signals.** If the refusal state includes "this seems like a mistake," count the presses. Appeals per hundred refusals is the cleanest single over-reach signal you can get.

Treat over-refusal like false positives in any classifier: tune for it deliberately, at the cost of recall if necessary, because the user experience of being wrongly refused is a tax paid by your most earnest users. This connects directly to how we think about [failure states generally](/journal/ai/llm-failure-fallback-ux) — the interface's job is to absorb the model's imperfection, not broadcast it.

## The anatomy of the refusal state

When we build these surfaces, the component spec has five parts, in this order:

1. **Acknowledge the intent, not the violation.** "You're trying to get a treatment plan for a rash" — showing the user they were understood defuses most of the sting. Never open with policy language.
2. **State the boundary briefly and honestly.** One or two sentences. Not the policy document; the reason a thoughtful person would accept.
3. **Admit fallibility, once, without grovelling.** "I sometimes get this wrong" is enough. It costs you nothing and earns you everything.
4. **Offer the doors.** The adjacent yes, the rephrase hint, the human path — whichever genuinely exist. Never list a door you can't open.
5. **Keep the composer alive.** The input box stays active, pre-focused, with the user's original text intact for editing. Clearing their words adds insult; many products do this and it reads as punishment.

Typography and tone matter here more than anywhere else in the product. The refusal state in a warm, human product should not flip into system-error styling — no red banners, no warning icons, no monospace. It's a message from the same character who answers all the other messages. The [voice guardrails](/journal/ai/ai-brand-voice-guardrails) that govern the answers govern the refusals too; a refusal in a different voice is how users end up feeling scolded by a committee they didn't know was in the room.

## Tier your responses like your policy already is

Not all blocks are equal, and the UX should reflect the underlying policy's actual structure. We design three tiers:

**Soft redirect** — the request is probably fine but the model's confidence is low, or it brushes a sensitive category. The product asks a light clarifying question or nudges phrasing, without a full refusal. Most "moderation events" in a well-designed product should land here invisibly.

**Hard refusal with doors** — the full five-part state above. The request is out of scope but the user is clearly acting in good faith, which describes the overwhelming majority of real refusals.

**Silent deprioritisation** — for genuinely adversarial patterns (repeated jailbreak attempts, obvious abuse), the product declines tersely and logs. You don't owe a helpful, dignity-preserving redesign to someone's twentieth injection attempt, and elaborate refusal states can function as a training gym for attackers. Design effort inverts with good faith.

## Writing refusal copy: the details that decide everything

Because the refusal is often the most emotionally loaded text in the product, it goes through the same editorial review as error messages and empty states — in our process, the [content lead](/team) red-pens it before any user sees it. The rules that emerge from every review:

- **First person plural for the boundary, first person singular for the fallibility.** "We don't give medical advice; I may have got this wrong." The boundary is the company's; the mistake is the machine's. This split reads as honest rather than evasive.
- **No policy citations in first render.** "Per our usage policy, section 4.2" is how a product tells a user to stop being a user and start being a rules-lawyer. Reason first; link to the policy for the determined.
- **No apology theatre.** One acknowledgment, then forward motion. Three sentences of contrition followed by nothing is worse than none.
- **Test refusal copy with the same users, in the same sessions, as the happy path.** If your usability script never triggers a refusal, you've tested half the product.

## Key takeaways

- A refusal is a product surface with a design spec, not an error message. Users read it as "it broke" or "I'm in trouble"; your copy must disarm both.
- Never ship a dead end: every refusal offers an adjacent yes, a revision hint, or a human path — whichever genuinely exist.
- Measure over-refusal as a first-class metric (by intent category, via rephrase-success pairs, via abandonment and appeal signals) — unmeasured false-positive rates silently tax your best users.
- The five-part anatomy: acknowledge intent, state the boundary, admit fallibility, offer the doors, keep the composer alive.
- Tier the response to the user's evident good faith: soft redirects for borderline cases, full refusals with doors for the good-faith majority, terse declines for the adversarial tail.
- Refusal copy gets full editorial review in the product's own voice — the moment it switches to committee voice, you've lost the user.

## FAQ

**Won't explaining why a refusal happened help people circumvent it?** For your actual adversaries, no — they're probing systematically regardless of what your UI tells them. For everyone else, the explanation is the difference between dignity and confusion. Keep hints at the level of *categories* ("personal medical advice") rather than *mechanics* ("the word X in combination with Y") and you help the innocent without publishing a manual.

**Should users be able to appeal a refusal?** Yes, when a human review layer exists and the category warrants it — a lightweight "this seems like a mistake" signal that flows into your review queue. But only build the button if someone reads the inbox, and set response-time expectations honestly. An appeal mechanism that goes nowhere is a trust-destroying placebo. Where no review is possible, the admission of fallibility in the copy does the same work with less ceremony.

**How do we handle moderation in regulated industries, where we genuinely can't redirect?** The doors still exist, they just open differently. For a [health triage product](/work/beacon-health-ai-triage), door one was often "explain the general condition, never the personal case," and door three — the clinician path — was the whole product's reason to exist. Regulation constrains the *answer*, not the *kindness of the interface*. The five-part anatomy works identically; the adjacent yeses are simply closer to education than action.

**Our refusal rate looks fine in aggregate. Do we still need per-category analysis?** Especially then. Aggregate refusal rates are an average of a working system and a broken one. A 4% overall rate that's actually 0.1% on sensitive topics and 11% on a benign category means your classifier is failing exactly where measurement is thinnest — and your best users are absorbing it.
