---
title: "Voice charts: making tone teachable"
description: "Adjective lists don't teach tone; charts do. How we build voice guidelines that survive handover: axis sliders, rewrite tables, error-state voice and real-copy audits."
slug: brand-voice-charts
cluster: brand
tags: [brand voice, tone of voice, ux writing, copy style guide, verbal identity]
date: 2025-08-14
author: Leonie Marsh
keywords: [brand voice guidelines, tone of voice, ux writing voice, copy style guide]
readingTime: 10
---

Every brand gets the voice document it deserves, and most deserve better. The industry standard is a PDF with three adjectives — "bold, human, playful" — a mood board of other people's websites, and a page of hashtagged social posts nobody will ever write again. Six months later the support macros contradict the onboarding, the error messages sound like a court summons, and the adjectives are doing what adjectives always do: meaning whatever the reader already believed.

The fix is not more adjectives. It's charts. Voice is a set of positions on spectrums, and a position can be taught, argued about and — crucially — *checked*. Here's the system we build inside our [brand practice](/services/brand-identity), tested on clients from a [community bank](/work/copperline-community-bank) to a [coffee subscription](/work/hearthbrew-subscription-club).

## Why adjectives fail and axes don't

"Human" is undetectable. Nobody writes copy thinking *time to be a robot for this section*. Adjectives fail because they're conclusions, not instructions — they describe the feeling of the finished voice without telling a writer what to do on Tuesday.

An axis does the opposite. It names two poles, both respectable, and marks where this brand sits:

- **Plain ↔ Playful** — Copperline Mutual sits two notches toward plain. A bank can afford a wink in an empty state, never in a transaction declined message.
- **Expert ↔ Enthusiast** — are you the professor or the clever friend? "Returns are calculated on the daily closing balance" versus "here's how your interest actually grows".
- **Terse ↔ Generous** — how much context before the ask. Error messages skew generous; navigation labels skew terse.
- **Formal ↔ Warm** — contractions yes/no, "we" versus the royal passive, whether "Hi" or "Hello" opens an email.

Five or six axes is the ceiling. More than that and nobody internalises the map. Each axis gets a slider position *and one sentence of consequence*: "We're here because getting this wrong makes us sound like debt collectors." Consequences stick where labels don't.

The chart's real power is disagreement. In a voice workshop, "are we playful?" collapses into taste wars. "Where are we between plain and playful — show me on the slider" produces a debate you can settle, and a mark on a page everyone signed.

## The rewrite table: the only page people keep

The slider page earns the nod; the rewrite table earns the bookmark. This is the heart of every voice document we ship: twenty rows of **before → after**, drawn from the client's real copy, grouped by context.

The rules of a rewrite table that teaches:

- **Real source material.** Pull actual support macros, actual app strings, actual CEO all-hands emails. Rewrites of invented copy teach nothing because nobody believes them. We ask for the twenty ugliest strings in the product on day one.
- **Show the reasoning column.** Before | After | Why. "Why" is one sentence referencing an axis: *terser — the user is mid-task and annoyed*. Readers steal the reasoning, not the sentence, and that's exactly what you want.
- **Include mundane contexts.** Everyone rewrites the hero headline. Nobody rewrites the 404, the password-reset email or the "your plan renews in 3 days" notice — which is where voice actually lives or dies, as we keep finding in [empty states](/journal/product/empty-states-design) and [error messages](/journal/product/error-messages-that-help).
- **Three contexts, minimum.** Marketing, product UI, and service/support. Most brands have three voices whether they planned to or not; the document should say which differences are intentional.

For Copperline, the row that did the most work was a declined-payment SMS. Before: *"Transaction unsuccessful. Contact your financial institution."* After: *"That payment didn't go through — nothing's been charged. Worth a quick check of your balance, or call us and we'll figure it out together."* Same information, both poles of the warm-formal axis visible in one text message. Row by row, the team learned to find the position themselves.

## Voice at the edges: errors, empties and legals

A voice that only works in headlines is a costume. The test contexts are the bad days:

**Errors.** The brand's promise made under stress. Warm brands over-apologise ("Oh no! Something went sideways!") and expert brands go cold; both break trust. Our rule: in an error, voice narrows to two moves — say what happened plainly, say what to do next kindly. Personality resumes *after* resolution. [Designing error copy that de-escalates](/journal/product/error-messages-that-help) is its own craft and we've written it up separately.

**Empty states.** The inverse: low stakes, high attention. This is where the playful end of the slider earns its keep. A well-voiced [empty state is product marketing](/journal/product/empty-states-design) — pitch the feature, don't mourn the absence of data.

**Legal and compliance.** Here's the heresy we defend to every general counsel: plain language is not a legal risk, it's a legal strategy. "You can cancel any time in Settings; we stop charging you from your next billing date" is more defensible than three paragraphs of "the Subscriber may terminate", because it cannot be misunderstood. Voice charts should extend all the way into terms and renewal notices — that is where customers decide if the voice was real.

## Testing voice before you ship the document

We never hand over a voice guide that hasn't survived a live-fire exercise. Two tests:

**The stranger test.** Give three writers who weren't in the workshops — new hires are perfect — one page of the document (the rewrite table) and three briefs: a push notification, an apology email, a settings label. If the three outputs land in the same neighbourhood, the document teaches. If they scatter, the axes are mush. We run this in week three of every engagement and it has never once passed on the first build.

**The audit-in-reverse.** Take twenty random strings already live in the product and slide them onto the axes. The scatter plot is the honest portrait of the product's current voice — usually a drunkard's walk. Presenting that image to a founder does more than any manifesto; the gap between the declared position and the plotted one *is* the project.

## Keeping it alive after the applause

Voice documents die of orphaning, not of disagreement. Three ownership moves that work:

1. **A named editor.** One person with the authority to rule on disputes and the duty to update the document quarterly. A voice guide with no owner is a historical artefact by Q2.
2. **Voice in the design system.** The table of error patterns should live next to the error components — [tokens and components carry voice](/journal/web-design/colour-systems-dark-mode) whether you write it down or not. When a designer grabs the `EmptyState` component, the example copy should already be on-voice.
3. **A ruthless example library.** Every time someone writes a string that nails it, it goes in the library. Fifty good examples beat five hundred rules.

## Key takeaways

- Replace adjectives with five or six axes, each with a marked position and a sentence of consequence.
- The rewrite table — real copy, before/after/why — is the page that teaches voice. Rewrite the boring strings, not just the hero.
- Test voice at the edges: errors, empty states, legal. That's where customers learn if you meant it.
- Run the stranger test before handover; scatter means the document isn't done.
- Audit live strings against the axes. The gap between claimed and actual voice is the project's true scope.
- Assign an owner, embed voice in the design system, and keep a library of nailed-it examples.

## FAQ

**How is this different from a copy style guide?**
A style guide governs correctness — punctuation, capitalisation, date formats. A voice chart governs judgement — where to land on each spectrum for each context. You need both, but only one of them teaches a stranger to *sound like you*.

**How many axes should we define?**
Five or six. Fewer and the voice is underspecified; more and nobody carries the map in their head. If axes seven and eight keep coming up in reviews, fold them back into the first six as consequences.

**Does this work for regulated industries?**
Especially there. Regulated copy fails by over-correction — compliance anxiety produces the coldest writing in the building. Axes give legal and brand a shared language to negotiate with, and plain-language first drafts usually survive legal review better than received legalese.

**What if founders disagree on the slider positions?**
That's the workshop working. Disagree about a mark on a page now — it's cheap — instead of about every headline for the next three years. When two founders won't budge, we write copy for the two candidate positions and test them with real customers. The market settles what the meeting can't.
