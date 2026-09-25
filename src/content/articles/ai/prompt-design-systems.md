---
title: "Prompt libraries are a design system too"
description: "Prompts scattered through a codebase rot like untracked CSS. How we build prompt libraries: structure, versioning, test coverage, and a shared vocabulary."
slug: prompt-design-systems
cluster: ai
tags: [prompt engineering, design systems of prompts, ai infrastructure, versioning, evals]
date: 2025-07-18
author: Dev Khatri
keywords: [prompt engineering systems, prompt library, prompt versioning, system prompts design, prompt testing, ai design systems]
readingTime: 12
---

A year into most AI features, someone greps the codebase and finds the same system prompt in four places: one in a route handler, one copy-pasted into a background job with two lines changed, one in a notebook from a Friday experiment, and one — the actually good one — in a staging-only branch somebody forgot to merge. Every instance is slightly different. Nobody knows which is live in the support assistant. This is not a prompt engineering problem. It's a design system problem, and it has the same cure.

We learned to treat prompts as managed assets the way we learned to treat colour values: the hard way, through drift. This is the setup we now build on every engagement — it underpins the assistants in our [AI product practice](/services/ai) and saved the [Copperline Mutual voice](/work/copperline-community-bank) from diverging across six different features.

## Why prompts rot faster than code

Prompts have three properties that make them decay faster than anything else you ship:

**They're invisible in review.** A diff that changes `"be concise and professional"` to `"be concise, professional and warm"` looks trivial. That one word measurably changes output distribution across thousands of generations. Code review tooling gives you syntax highlighting and type checks; prose gets skimmed.

**They're load-bearing prose.** A prompt is simultaneously specification, style guide and error handler — but it's stored as a string literal, which invites casual editing. Nobody casually edits a regex that validates tax file numbers. People casually edit sentences.

**They fork silently.** Copy-pasting a prompt to adapt it creates a fork with no merge strategy. Six months later the fork has better edge-case handling and the original has the seasonal update, and both models are "the assistant".

The failure mode isn't dramatic. Nobody's assistant starts swearing at customers. It's slower and worse: the tone drifts, edge cases regress one prompt at a time, and every feature that talks to a model becomes slightly more its own product and slightly less yours.

## The anatomy of a prompt that survives production

A production prompt is not a paragraph. It's a structured document with the same skeleton, every time, so that readers and diffs can navigate it. Our standard seven sections:

```text
## ROLE
You are the support assistant for <Product>. You help customers
with billing, plan changes and account access.

## VOICE
Warm, plain, specific. Short sentences. No exclamation marks.
Never say "I understand your frustration". Australian English.

## AUDIENCE
Small business owners. Often on mobile, often mid-invoice.
Assume competence, not expertise.

## TASK
Resolve the customer's question using the retrieved account
context. If a human is needed, say so early and hand off cleanly.

## CONSTRAINTS
- Never invent policy: only state what appears in CONTEXT.
- Never confirm a refund; offer to connect billing support.
- Maximum 120 words unless the customer asks for detail.

## EXAMPLES
[2-4 input/output pairs, chosen to define the hard edges —
 an angry customer, an ambiguous question, an out-of-scope ask]

## OUTPUT FORMAT
Plain prose, one idea per paragraph. No bullet lists in chat,
no headers, no greetings after the first turn.
```

The value isn't the specific sections — it's that every prompt in the estate has the *same* sections, so a reviewer can check CONSTRAINTS without reading TASK, and a diff that touches VOICE is visibly a voice change. The structure is the lint rule.

## Storage: prompts go in files, not in routes

The single most important rule: **a prompt lives in exactly one file, versioned, and code imports it by name.** We keep prompts as their own files (Markdown with frontmatter works beautifully — the prose renders, the metadata is machine-readable) in a `prompts/` directory, loaded at build or startup:

```text
prompts/
  support-assistant/
    system.md          # v14 — frontmatter: version, model, owner, last-eval
    triage.md
    handoff-to-human.md
  invoice-narrator/
    system.md
```

Frontmatter carries the operational metadata: `version`, `owner`, `models` (what it's been evaluated against), `requires_context` (what retrieval it expects), and a `changelog` line. This turns "who owns the support prompt and what changed last quarter" into a query, not an archaeology dig.

Two corollary rules that save you later:

- **Interpolate, don't concatenate.** Variables (`{account_tier}`, `{customer_name}`) are named slots with a tiny schema, filled by a helper that refuses to render a prompt with unfilled slots. String-concatenated prompts are how account data leaks into the wrong clause and how apostrophes end up in SQL-shaped places.
- **One prompt, one job.** If a prompt does classification *and* drafting *and* tone-policing, split it. Chained single-job prompts are testable; one 900-word mega-prompt is a horoscope.

## Versioning: prompts change like APIs, not like copy

Because a one-word change alters output distribution, prompt versions behave like API versions. Our discipline:

- **Every prompt change is a version bump**, committed alongside the eval results that justify it. The commit message says what behaviour changed, not what text changed ("stops offering refunds in chat", not "edited constraints").
- **Rollbacks are first-class.** Because prompts are data-in-files, a bad deploy rolls back with the code. Keep the last few versions addressable; when a model provider updates and your careful prompt starts behaving oddly, the ability to A/B it against last month's version is how you find out what the provider changed before they admit it.
- **Environment keys, not branches.** Which version serves production is configuration, never a long-lived branch. A prompt that only exists on a laptop is a prompt that doesn't exist.

This is the point where people ask whether they need a prompt management platform. Usually not at first — files, git and CI cover an astonishing amount. Graduate to a registry when you have multiple teams shipping prompts daily, or non-engineers (content, support leads) who need to propose changes through a workflow. The ownership matters more than the tooling: every prompt has a named owner who is paged by its evals, the same way a design system component has an owner. Unowned prompts are the CSS files of AI products — they grow until nobody dares delete anything.

## Test coverage: evals are the type checker

A prompt library without evaluations is a component library nobody has opened in a browser. You don't need a research-grade eval suite; you need a regression corpus that runs in CI and takes under ten minutes. For each prompt, keep a file of cases:

```text
prompts/support-assistant/cases/
  angry-refund-demand.md        # must NOT promise refund
  ambiguous-plan-question.md    # must ask ONE clarifying question
  out-of-scope-legal.md         # must hand off, no policy invention
  polite-billing-query.md       # happy path: resolve in <120 words
```

Each case states the input, the context blob, and *behavioural* assertions — checked by a rubric-graded judge model for the fuzzy ones ("tone is warm, no forbidden phrases") and by cheap deterministic checks where possible (length, forbidden phrases, required hand-off markers, citation presence when retrieval is involved). Run the suite on every prompt change and every model version bump. The judge model isn't oracular; it's a smoke alarm. It catches "we changed VOICE and now the refusal messages sound sarcastic" — the exact class of regression that code review never sees.

Keep the corpus growing from reality: every time a prompt misbehaves in production, that failure becomes a case. Within a quarter you have an eval suite that encodes your actual edge cases, which is worth more than any benchmark with a surname.

## Shared vocabulary across the estate

The least obvious maintenance win: prompts share nouns. Establish a small glossary that every prompt in the company uses — what "customer" vs "user" vs "member" means in prompts, standard phrasings for refusals and handoffs, the canonical sentence for "I don't have that information". Store them as partials or simply a style guide the prompt owner enforces.

Why? Because users experience your assistant as one entity across features. If the invoice narrator says "I've gone ahead and updated…" while the support assistant says "Would you like me to…", the product has multiple personalities. A shared refusal sentence — tested, blessed, reused — is the prose equivalent of a design token. It also makes legal and compliance review tractable: they review the glossary once, then diffs against it.

This is also where brand voice stops being a PDF and becomes infrastructure — your [voice chart](/journal/brand/brand-voice-charts) translated into the VOICE section plus an examples bank, so tone survives generation. We write about holding that line in [keeping AI output on-brand](/journal/ai/ai-brand-voice-guardrails).

## The review ritual

Prompts decay in the gaps between edits, so put the library on a rhythm. Ours: prompt owners review their eval dashboards weekly (five minutes, same slot as performance budgets — the cadence described in [budgets that survive sprints](/journal/engineering/core-web-vitals-field-guide)); a monthly prompt review where the two or three most-changed prompts get read aloud — yes, aloud; you hear tone drift immediately — and a quarterly estate audit that deletes dead prompts. Deleting is the health metric. A prompt library where nothing is ever removed is a landfill with good intentions.

## Key takeaways

- Prompts are structured documents: a fixed seven-section skeleton (role, voice, audience, task, constraints, examples, output format) makes diffs reviewable.
- One prompt, one file, imported by name — never string literals in routes; interpolate through a helper that refuses unfilled slots.
- Version prompts like APIs: every change is a bump with eval evidence, rollbacks are configuration, and nothing lives on a laptop.
- Evals are the type checker: a behavioural case per edge, judge-graded where fuzzy, run in CI on every prompt and model change.
- Share nouns, refusals and handoff sentences across prompts — the prose equivalent of design tokens.
- Rhythm beats heroics: weekly eval reviews, monthly read-alouds, quarterly deletions.

## FAQ

**Won't a heavy process slow down experimentation?**

The opposite. Experiments are cheap precisely because the library is sane: you fork a prompt file, run the eval corpus on both versions, and promote the winner with evidence. The slowest teams we meet are the ones where nobody dares touch the prompt because nobody knows what it currently guarantees.

**Do non-technical people get to edit prompts?**

They should — support leads and content strategists are often the best prompt editors. Give them a workflow, not prod access: a PR with the eval run attached, reviewed by the prompt owner. "Marketing changed the tone string directly in the admin panel" is how brands quietly become sarcastic.

**How many examples go in a prompt?**

Two to four, chosen for the edges, not the happy path. Examples are the strongest lever in most prompts and the most expensive in tokens; spend them on the behaviours you keep regressing — the angry customer, the ambiguous ask — not on confirming the model can answer an easy billing question.

**What about prompts embedded in vendor tools we don't control?**

Treat them as external dependencies with an eval harness anyway. Point your case corpus at the vendor endpoint if possible. When the vendor "improves" their prompt and your tone changes, you want to find out from your CI, not your customers.

**Where do we start if prompts are already everywhere?**

Grep, inventory, centralise — in that order, in one focused sprint. Don't rewrite anything yet; migrate first, evaluate second, refactor third. The first eval corpus can be five cases. The library matters more than its initial quality: once prompts are files with owners, quality compounds, the way it does in any well-run [brand system](/services/brand-identity).
