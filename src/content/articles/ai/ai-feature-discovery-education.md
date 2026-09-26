---
title: "Teaching what the AI can do: feature discovery as curriculum"
description: "AI features fail when users don't know what to ask. Designing discovery surfaces — prompt starters, worked examples, capability demos — that teach, not decorate."
slug: ai-feature-discovery-education
cluster: ai
tags: [ai, feature discovery, onboarding, ux writing, activation]
date: 2026-07-14
author: Dev Khatri
keywords: [AI feature discovery, AI onboarding, prompt examples UX, AI education UI, activation metrics]
readingTime: 10
---

There's a sentence we hear in nearly every AI product review: "Users just don't know what to ask it." It's usually said as if it's a user problem. It isn't. If your users don't know what the feature can do, that's a design failure — the product shipped without its manual, and the manual was supposed to be the interface itself.

Deterministic software teaches through structure: menus enumerate the verbs, buttons show the affordances, and the information architecture *is* the documentation. An AI feature has a text field and, if you're lucky, a sparkle icon. The verbs are infinite and invisible. So the job of discovery design changes: you're not showing people where things are, you're teaching them what's possible — and, just as importantly, what isn't.

This is the piece we end up writing on every [AI engagement](/services/ai), so here it is in one place: how to design education UI for AI features beyond the tooltip, and how to measure whether it's working.

## The tooltip is where discovery goes to die

The standard toolkit — a tooltip on the sparkle icon, a coach mark on first visit, a "What's new" modal — was built to annotate *visible* features. They point at a button and say what it does. An AI feature's capabilities aren't visible, so there's nothing to point at. Worse, tooltips train a behaviour: users learn that dismissible overlays are noise, and they dismiss faster each time. We've watched session recordings where users close a genuinely useful capability modal in under 900 milliseconds. It's muscle memory from a decade of cookie banners.

The rule we work from: **education that interrupts the task is spam; education that *is* the task interface is teaching.** Everything below lives inside the working surface — the prompt box, the empty state, the result — because that's the only place users are actually paying attention.

## Prompt starters are a syllabus, not a placeholder

Placeholder text in the prompt box is the single most neglected teaching surface in AI products. "Ask me anything…" is an anti-pattern: it's maximally vague, promises capabilities the model doesn't have, and sets the user up for the embarrassing first answer that kills adoption. We covered the empty-state version of this in [onboarding users to an AI assistant](/journal/ai/ai-assistant-onboarding); the discovery version runs deeper.

Treat example prompts as a designed curriculum with three properties:

**Coverage over cleverness.** Your starter set should span the capability space, not show off one trick. If the feature answers questions, drafts text, and compares documents, the examples should hit all three — one per use case, not three variations of the flashiest one. Users generalise from examples frighteningly literally: show three summarisation prompts and they'll conclude the product is a summariser.

**A ladder of ambition.** Sequence examples from safe-and-impressive to ambitious-and-might-need-editing. The first suggestion should be the capability with the highest success rate on the user's real data. The last one can stretch. This mirrors how good demos work: open with the thing that always lands, close with the thing that opens wallets.

**Rotation with memory.** Static starters teach once and then become wallpaper. Rotate them — but track which examples each user has seen and which they clicked, and don't show a clicked example again. This is a small bit of state that almost nobody builds, and it's the difference between "suggestions" and "a syllabus that knows what year you're in."

## Worked examples beat capability lists

When users do need more than three prompt starters — complex tools, multi-step workflows — the instinct is to build a capabilities page. Don't. Capability lists ("I can summarise, translate, draft, analyse…") are feature marketing copy, and they fail the same way menus fail for chat: they name the verb without showing the move.

What works is the **worked example**: a real-looking prompt paired with the real-looking output it produces, browsable in a gallery. Not a video — videos don't transfer into motor memory — and not a screenshot with no prompt attached, which shows the destination but hides the route. The pair is the teaching unit: "here is what was asked, here is what came back." Users learn prompt *shape* from these — length, specificity, structure — far faster than from any instruction.

Two craft details matter:

- **Use plausible fake content that matches the user's domain.** A legal-tech assistant's example gallery full of marketing copy prompts teaches lawyers that the product isn't for them. On the [Beacon Health triage work](/work/beacon-health-ai-triage), the example prompts used the actual phrasing clinicians type — abbreviations, fragments, urgency — and first-week adoption of the assistant roughly doubled against the generic set it replaced. (Illustrative numbers, real pattern.)
- **Make every example one-click runnable.** "Try this" that fills the prompt box converts education into action. A gallery you can only look at is a brochure.

## Education at the moment of failure

The cheapest teaching moment is the one right after something didn't work. When a query fails — out of scope, missing data, ambiguous — the error state is a classroom. "I can't answer that" wastes it. "I can't see your invoices — I can only read your support docs. Try asking about ticket trends" teaches scope, suggests a recovery, and calibrates trust in one sentence.

We build what we call **corrective starters**: when a prompt fails, the failure state includes two or three rewritten versions of the user's own prompt that *would* have worked. It's the worked-example pattern but personalised to the exact thing the user just tried — the highest-intent teaching moment that exists. It also turns a trust-destroying event into a trust-building one, which connects directly to the failure-state thinking in [communicating probabilistic features](/journal/ai/communicating-probabilistic-features).

## Narrated confidence is part of the curriculum

Discovery isn't only "what can it do" — it's "how much should I believe it." Teaching the failure shape is as important as teaching the capability set, because the dangerous failure mode of AI features isn't refusal, it's fluent wrongness.

Annotate outputs with what the model drew from (citations, source chips — see [citation design for AI features](/journal/ai/citation-design-ai-features)) and state scope limits in plain language near the input, permanently. "Answers from your help centre, updated nightly" in quiet text under the prompt box does more for calibrated trust than any modal. It's also honest product marketing: a stated boundary reads as confidence, not limitation.

## Measuring time-to-first-valuable-output

Discovery design ships with instrumentation or it didn't ship. The core metric is **time-to-first-valuable-output (TTFVO)**: median time from first session to the first output the user *accepted* — copied, inserted, exported, saved. Not first prompt sent: "hi" is a prompt. Around it:

- **Starter adoption rate**: share of first valuable outputs that began from a suggested prompt. Under ~20%, your examples are generic or mistargeted.
- **Breadth of discovery**: how many distinct capability categories a user touches in their first month. A flat one-category curve means your curriculum taught one trick.
- **Failed-prompt recovery rate**: of users whose first prompt failed, how many produced an accepted output within the same session. This is the metric corrective starters move.
- **Example-gallery engagement**: clicks, run-clicks, and — the signal that matters — subsequent *unprompted* prompts that resemble the example's shape. That's learning made visible.

Segment all of it by entry point. Discovery surfaces behave completely differently for users arriving from onboarding versus users discovering the feature cold in month three — the day-after-launch problem we wrote about in [feature discovery after launch](/journal/product/feature-discovery-after-launch). And as always, define "valuable" with the growth team before you build the dashboard, or you'll end up reporting prompt counts to a board that wants retention. [Activation metrics that mean something](/journal/product/activation-metrics-honest) has the longer argument.

## Key takeaways

- Users "not knowing what to ask" is a design failure, not a user failure. AI features need curriculum, not tooltips.
- Prompt starters are the highest-leverage surface: design them for capability coverage, sequence them by success rate, rotate them with memory.
- Worked examples — prompt *and* output, clickable — teach prompt shape better than any capability list or video.
- Failure states are classrooms. Corrective starters rewrite the user's failed prompt into ones that work.
- Teach the failure shape as deliberately as the feature set; stated scope limits build calibrated trust.
- Measure time-to-first-*valuable*-output, starter adoption, breadth of discovery, and failed-prompt recovery — or you're guessing.

## FAQ

**How many prompt starters should we show at once?**
Three to five. Fewer than three under-represents the capability space; more than five reads as homework and click-through collapses. If you have more to teach, rotate — don't stack.

**Should example prompts be personalised to the user's data?**
Wherever you can, yes. A starter that references the user's actual project converts at multiples of a generic one. When personalisation isn't possible, match the *domain* at minimum — realistic fake content from their industry beats generic every time.

**Isn't a capabilities modal better than nothing?**
Barely, and it can be worse: it burns the user's one moment of attention on a wall of text they'll never re-open. If you have the budget for a modal, spend it on three good starters and one corrective-starter failure state instead.

**How do we teach power features to established users?**
Result-adjacent suggestions: after a successful output, one quiet line — "You can also ask me to turn this into a table." The user just felt value, so the pitch lands as generosity. Sequence by readiness signals (usage depth, feature tenure), not by a drip calendar.

**How long until we know the discovery design worked?**
TTFVO and starter adoption move within two to four weeks on most products if traffic is decent. Breadth-of-discovery curves need six to eight. If TTFVO doesn't move, the problem is usually the examples' specificity, not their placement.
