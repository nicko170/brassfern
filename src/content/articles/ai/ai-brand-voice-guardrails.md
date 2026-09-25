---
title: "Keeping AI output on-brand: voice guardrails that hold"
description: "Brand voice survives generation only if it's engineered: voice charts as prompts, example banks, style evals, review lanes, and a graceful drift fallback."
slug: ai-brand-voice-guardrails
cluster: ai
tags: [brand voice, ai writing, content guardrails, tone of voice, llm content]
date: 2025-06-05
author: Leonie Marsh
keywords: [ai brand voice, llm tone of voice, ai content guardrails, on-brand ai writing, brand voice system prompt]
readingTime: 11
---

Every brand that ships an AI writing feature goes through the same three months. Month one: delight — the model writes fluent email responses in seconds. Month two: mumbling — someone notices the assistant has started saying "I hope this message finds you well" to customers who have been with the company for nine years. Month three: the PDF. Somebody attaches the 40-page brand voice guidelines to a ticket and writes "can we make it follow this?"

You cannot make a model follow a 40-page PDF. You can, however, engineer voice the way you engineer anything else — decompose it, encode the load-bearing parts, test against real output, and design for the day it drifts. This is the system we use, the same one holding the [Copperline Mutual](/work/copperline-community-bank) voice steady across six AI features, and it leans heavily on treating prompts as managed assets rather than strings scattered through code — our guide to that is [prompt libraries are a design system](/journal/ai/prompt-design-systems).

## Why voice drifts (and why it matters more than accuracy)

Models regress to the mean of their training data, and the mean of the internet's prose is a chirpy, exclamation-marked, em-dash-abusing corporate warmth. Left alone, your assistant converges on LinkedIn. The drift isn't a bug to fix once; it's gravity. Voice guardrails are not an instruction — they're a retaining wall with maintenance scheduled.

And voice failures cost more than factual ones, for an underappreciated reason: users forgive a wrong number and correct it, but a voice slip — assistant congratulating a customer on a bereavement claim, cheerfully — is a screenshot with your logo in it. Voice is where trust lives. A bank whose AI says "no worries!" in a fraud notification has a brand problem, not an AI problem.

## Step one: decompose the voice chart into something testable

The raw material is your [voice chart](/journal/brand/brand-voice-charts) — we are / we are not, with examples. Most voice charts are directions for humans ("be warm but not gushing"). Models and test harnesses need the mechanical version. For each voice principle, extract three kinds of guardrail:

**Observable rules** — checkable by code. Sentence length caps, banned phrases, required pronouns ("you", never "the user"), punctuation policy (Copperline: no exclamation marks anywhere, full stop), reading-level ceiling, greeting and sign-off rules per channel. These become lint rules and eval assertions. They're cheap and catch eighty percent of drift.

**Example pairs** — the voice defined by contrast. For each principle, one output that nails it and one that fails it, both plausible:

```text
Principle: "Plain about money."

ON:  "Your repayment of $612 goes out Thursday. Your balance
     after will be $1,204.60."
OFF: "We're excited to let you know your upcoming scheduled
     repayment will be processed as per your agreement! 🎉"
```

The OFF example is doing more work than the ON one — it defines the gravitational pull you're resisting. Ten good contrast pairs will steer a model further than ten pages of adjectives.

**Judgement heuristics** — what only a human (or a carefully instructed judge model) can grade: does the apology land before the policy, does this sound like it was written by someone who has met a customer. These become rubric items with scores, not pass/fail.

The deliverable from this step is the *voice spec*: a two-page document of rules, pairs and rubrics that is genuinely the voice, re-encoded for machines. If your brand guidelines can't survive this translation — if "challenger spirit" resists decomposition — that's a finding about the guidelines, and a gift to your brand team before an AI feature ever ships.

## Step two: encode it as the VOICE layer, once

The voice spec becomes a VOICE block — the same block — used in every prompt in the estate. One source of truth, imported, never copy-pasted. Silver, gold and bronze versions exist for context budget: the full VOICE block for long-form drafting, a condensed 150-token version for chat where every token costs latency and money, and a lint-only post-processing layer for tiny high-frequency surfaces like subject lines and push notifications.

Two encoding lessons from the field:

- **Examples dominate adjectives.** "Be warm" does almost nothing; two contrast pairs showing your warmth *corrects* almost everything. Spend your VOICE token budget on pairs first, rules second, adjectives never.
- **State the negatives.** LLM outputs fail on what they add, not what they omit — filler greetings, premature apologies, "As an AI…". An explicit NEVER list (banned phrases, banned openers, banned emoji) outperforms any positive description of tone. Auditing real outputs for a month tells you what the NEVER list should contain; on Copperline it grew to 34 entries and then stopped growing, because the model had run out of ways to be obsequious.

## Step three: evals that grade style, not just correctness

Voice drift is invisible to accuracy testing. You need a lane that grades style continuously. The practical setup:

1. **A style corpus.** Thirty to fifty prompts drawn from real traffic (anonymised), each with a rubric: the observable rules as deterministic checks, plus two or three judgement heuristics graded by a judge model prompted with your voice spec and contrast pairs.
2. **Run it on a schedule, not just on change.** Prompt edits trigger a run; but so should every model version bump, and once a week regardless — because providers silently update models, and silent updates are when "helpful" quietly becomes "friendly!!".
3. **Trend the scores.** A single run is a photo; the weekly series is the film. Alert on the *delta*, not the absolute score — a two-point slide in warmth over three weeks is drift; a score of 7.4 is just a number.

Calibration matters: hand-grade a sample of judge-graded outputs monthly and track agreement. When the judge and your editors agree above ~85%, the lane is trustworthy. Below that, your contrast pairs are ambiguous — fix the pairs, not the judge's prompt engineering.

## Step four: human review lanes that don't bottleneck

Guardrails fail socially before they fail technically: the moment review becomes the bottleneck, output routes around it. Design the human lane by risk, not volume.

- **Autopilot** for low-risk, high-volume, high-eval-coverage output (internal summaries, draft replies reviewed by the sender anyway). Evals run; humans sample 2–5% weekly.
- **Approval queue** for medium-risk outbound text (support macros, lifecycle email). Here the reviewers are your best writers and their edits are the most valuable dataset you own: every correction becomes a contrast pair. On one engagement, six weeks of harvested reviewer edits did more for voice scores than every prompt rewrite combined. The reviewers weren't a brake; they were the training data.
- **Human-only** for high-risk moments (complaints, hardship, anything legal or medical-adjacent). The AI drafts; a human sends. Write the feature so the human is the sender of record — it keeps everyone honest about what "AI-assisted" means.

Staff the lanes from the team that owns the voice — content or brand, not engineering — and give them the authority to block. A voice lane owned by engineering ships engineering's taste.

## Step five: design the drift fallback

It will drift. The question is whether drift is an incident or an event. Build the fallback in advance: a kill switch per surface that reverts the AI feature to template-based responses; a status note template so support can say "our assistant is having a lie-down, humans are on it" in your actual voice (practice writing that sentence before you need it); and a review trigger — if style scores fall below the floor for two consecutive weekly runs, the surface degrades gracefully to human-drafted templates until the cause is found.

On [Holloway Records](/work/holloway-records-label-site) the fallback ships as a feature, not a panic: when the release-blurb assistant's style lane dips, the copy desk gets a tidy queue of drafts annotated with *which* rule broke, so fixing the prompt and fixing the copy happen in the same week. Teams that treat drift as routine keep their voices for years; teams that treat it as betrayal keep re-prompting in anger and diverging further.

## The uncomfortable part: voice is a promise about authorship

One last thing, because it's where most projects quietly get weird. If your brand's deal with its audience is "a person wrote this" — a letter from the founder, a condolence note, a label's message to fans — no guardrail makes generated text honest there. Decide which surfaces carry that promise and keep them human. The voice spec will still help: it makes the humans faster. But guardrails protect the voice; they can't protect a lie about who holds the pen.

## Key takeaways

- Voice drift is gravity, not a bug. Build retaining walls with scheduled maintenance, not one-off instructions.
- Translate the voice chart into a machine-ready spec: observable rules, ON/OFF contrast pairs, judgement heuristics.
- Encode one VOICE block, imported everywhere, led by contrast pairs and a NEVER list — never by adjectives.
- Grade style continuously: a real-traffic corpus, scheduled runs, alerts on deltas, monthly human calibration.
- Tier human review by risk; harvest reviewer edits as contrast pairs — the approval queue is your best dataset.
- Pre-build the drift fallback: per-surface kill switch, status copy in your real voice, and a score-floor trigger.

## FAQ

**Can't we just fine-tune on our best writing?**

Fine-tuning bakes in a style but bakes in everything else too, and it's the slowest possible iteration cycle for something that needs weekly care. We use prompting, retrieval of your best examples, and evals first; fine-tuning earns its cost only when volume is enormous and the base style is stable. Even then, you still need the style eval lane — tuned models drift when providers update them.

**How big should the example bank be?**

Thirty to fifty high-quality contrast pairs per major surface beats five hundred mediocre ones. Curate ruthlessly: every pair should define an edge the model actually fails. The bank is a museum, not a warehouse — rotate out pairs the model now passes reliably.

**Do these guardrails work across languages?**

The rules and eval structure travel; the contrast pairs don't. Voice is culturally specific — Australian plainness reads as coldness elsewhere, and banned-phrase lists are dialectal. Budget for a native-language pass on the pairs and NEVER list per market. Don't machine-translate your tone; you'll get the mean of LinkedIn in five languages.

**Who should own the voice lane: brand, content or engineering?**

Content, with brand holding veto and engineering holding the tooling. The lane's success metric is style scores and reviewer-edit volume, not uptime. If the person who can block a release has never written for customers, the lane is ceremonial.

**How do we keep the NEVER list from becoming a straitjacket?**

Cap it and audit it quarterly. A NEVER list beyond ~40 items starts teaching the model to be anxious, which reads as stiff. Entries should come from observed failures, not pre-emptive taste — delete any rule that hasn't fired in two quarters. Voice lives in what you allow colourfully, not what you forbid. That's the editorial philosophy we bring to every [brand engagement](/services/brand-identity), whether the author is a person or a prompt.
