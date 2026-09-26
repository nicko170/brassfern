---
title: "A research repository that gets read after the study ends"
description: "Most research dies in a read-once PDF. Build a repository people actually use: atomic notes, a lasting taxonomy, insight half-lives, traceable decisions."
slug: research-repository-that-gets-used
cluster: product
tags: [ux research, research ops, insights, product design, knowledge management]
date: 2025-10-06
author: Aiko Tanaka
keywords: [research repository, UX research, insights management, research ops]
readingTime: 11
---

Every product team has a research graveyard. It lives in a shared drive, in folder structures that made sense to whoever left the company two years ago: `Q3_onboarding_final_v2.mp4`, a 60-page deck titled *Key Insights 2024*, a spreadsheet of usability findings last opened by its author. The research was good. The teams paid for it, sat through the interviews, nodded along. And six months later, when a designer asks "do we know anything about how people handle recurring invoices?", the answer is a shrug and a fresh study — research bought twice because the first copy was unfindable.

A repository fixes this, but only if it's designed as a *reading tool for busy non-researchers*, not a filing system for researchers. That single inversion — build for the browser, not the archivist — is what separates repositories that get used from databases that get filled. Here's the system we advocate when we embed with product teams, and the one we run internally across our [product engagements](/services/product).

## Atomic notes: the unit of research that survives

The research report is the wrong archival unit. A report is an argument built for a moment ("should we rebuild onboarding, Q3 2024") — and the moment passes, taking forty findings hostage with it. The finding that outlives the deck is the *atomic note*: one observation per note, self-contained, findable without the study that birthed it.

A good atomic note is five fields:

1. **The observation** — one sentence, concrete. "Three of five users expected the invoice date to be editable after sending."
2. **The evidence** — a verbatim quote, a clip timestamp, a screenshot. Evidence travels with the note so a sceptical reader in 2027 can check the source without archaeology.
3. **The interpretation** — clearly separated from the observation. "We read this as users treating sent invoices as drafts." Marking the line between *what happened* and *what we think it means* is what keeps a repository honest as team members rotate.
4. **Strength** — a blunt label: single anecdote, repeated pattern, or triangulated across methods. This one field prevents the most common repository misuse: the lone dramatic quote wielded as unanimous user demand.
5. **Context** — who the participants were, when, and what the product looked like then. Findings age; context is how a reader calibrates whether a 2024 finding about a 2023 interface still applies.

Yes, this is slower than dumping interview notes into a folder — roughly an extra half-day per study. It is also the entire difference between research as a consumable and research as a compounding asset.

## A taxonomy that survives: tag by the questions people ask

Taxonomies fail in a predictable way: designed by researchers around *study metadata* (methodology, quarter, study name), browsed by designers around *product questions* (onboarding, pricing, mobile, anxiety). The browsing vocabulary wins, so design for it.

The taxonomy that has survived longest in our experience is small and mostly universal:

- **Journey stage** — discovery, onboarding, first value, habitual use, expansion, churn. The most browsed axis in every repository we've seen.
- **Theme** — a controlled list of product-area terms (*trust, pricing, collaboration, performance*), kept to the words the roadmap actually uses.
- **Method & strength** — interview, usability test, support-ticket analysis, survey; plus the strength label from the note itself.
- **Date** — automatic, and visible everywhere it matters.

And the rule that keeps it alive: **a ceiling of about thirty active tags, with a named gardener**. Uncontrolled folksonomies grow to three hundred tags, of which twelve are synonyms for "onboarding," within a year. The gardener merges, prunes and renames quarterly — this is the same governance instinct as keeping an [accessibility audit actionable](/journal/product/accessibility-audit-process): an owned backlog beats an impressive system nobody maintains.

## Insight half-lives: research expires — say so

Here's the thought that changes how you run a repository: findings decay. A usability finding about a navigation you redesigned in March is archaeology by June. A behavioural finding about invoice anxiety probably has a half-life of years. A cultural finding about how your users talk about money shifts slowly and then all at once.

Repositories that pretend findings are timeless produce one catastrophic behaviour: confident decisions from stale evidence. The fixes are cheap and mostly about *display*:

- **Surface age prominently.** Every note shows its study date without a click. "2 years old" next to a finding is information, formatted as typography rather than buried as metadata.
- **Stamp confidence decay by type.** Behavioural findings: flag for revalidation at 18 months. Interface findings: expire at the redesign. Builds-habits findings (how users describe a concept): five years, maybe. You'll tune these numbers; the point is having them at all.
- **Revalidate visibly.** When a new study confirms an old finding, link them — the note gains a "still true, checked 2026" line. A repository that shows which findings have *earned their continued existence* is trusted in a way a static wiki never is.

If you're feeding findings into retrieval systems or AI-assisted research tools, the half-life problem compounds — stale notes get retrieved with the same confidence as fresh ones. The failure modes rhyme directly with what we catalogued in [RAG pitfalls in production](/journal/ai/rag-pitfalls-production): retrieval doesn't know what's old unless you make age a first-class citizen.

## Connecting findings to decisions: the traceable link

The single most valuable feature a repository can have isn't search — it's the *decision link*. When a team makes a design decision, the decision records which findings informed it; when a finding informs a decision, the finding links back. Two-way, explicit, part of the workflow rather than documentation theatre.

What this buys, in practice:

- **The "why is this here" test.** A new designer looking at an odd-looking toggle can trace it to a finding ("users confused annual and monthly totals — 2025-03") instead of assuming it's accidental and deleting it. Institutional memory becomes readable.
- **Defensible roadmaps.** When leadership questions a priority, the answer isn't taste — it's a chain: priority → decision → seven findings → forty evidence clips. This ends an entire genre of meeting.
- **Research ROI you can point at.** "These nine roadmap items trace to repository findings" is how research stops being the first budget line cut in a hard quarter.

The lightweight mechanics: decisions get a note type of their own (decision, date, deciders, findings-cited), and the citation is drag-and-drop simple. If citing research takes more than ten seconds inside your existing tools, people won't do it, and the whole graph quietly stops growing. Design the citation *gesture*, not just the schema.

## The shop window: how people who hate databases consume research

Even a perfect repository is visited by maybe a quarter of the company. The other 75% consume research ambiently — and designing for the ambient channel is what makes the whole investment visible. Three channels, all cheap:

1. **A "fresh findings" feed.** Five atomic notes a week, pushed to where the company already reads (a chat channel, not email — email is where feeds go to die). One observation, one line of interpretation, one link. This feed alone typically doubles repository readership within a month, because it teaches people the repository *exists and is legible*.
2. **Findings embedded where decisions happen.** The [onboarding checklist](/journal/product/onboarding-checklist-patterns) template, the design-system docs, the PRD template — each carries a "what research says" strip linking relevant notes. Research appears at the moment of use rather than waiting to be sought.
3. **A quarterly synthesis, kept brutally short.** One page: the five most-cited findings, the two that expired this quarter, the three questions nobody has answered. Synthesis is the curator's voice, and repositories without a human voice drift into being infrastructure instead of knowledge.

This ambient layer is, not coincidentally, exactly how we study research itself: in our [jobs-to-be-done interviews](/journal/product/jtbd-interviews-that-work), the most revealing question we ask teams is "when did a piece of research last change your mind?" — and the quality of the answer predicts whether they have a repository or a graveyard.

## Consent, PII and the unglamorous governance

Two governance rules aren't optional. First, participant data lives behind access controls, and notes quote verbatims *without* identity — the repository is too browsable to carry raw PII safely. Second, consent forms must actually cover reuse: a participant who agreed to "this study" did not agree to a permanent clip library shared company-wide in 2027. Write the consent for the repository, not the session, or keep the clips out of it.

## Key takeaways

- Build for the browser, not the archivist. The audience is a busy designer with a question, not a researcher with a system.
- Archive atomic notes — observation, evidence, interpretation, strength, context — never decks. The finding must survive the study that produced it.
- Tag by the questions people ask (journey stage, product theme), cap the taxonomy near thirty tags, and name a gardener.
- Findings decay. Show age everywhere, set half-lives by finding type, and mark revalidated findings as "still true, checked."
- Two-way decision links turn a repository into institutional memory — and give research a defensible budget line.
- Most consumption is ambient: a weekly findings feed, research strips in templates, and a one-page quarterly synthesis.

## FAQ

**Won't atomic notes lose the narrative richness of a full report?**
The report still exists — it's the *presentation* layer, arguing a case for a moment in time. The repository is the *storage* layer, preserving findings beyond that moment. Write the report, then mine it into notes. Teams that keep only reports keep hostage findings; teams that keep only notes lose the argument. Keep both, each doing its job.

**How do we seed a repository from years of old research?**
You don't, mostly. Backfilling legacy studies is the fastest way to burn a research ops budget on findings with expired context. Seed with the last two or three studies, then adopt the rule "new studies enter as notes from now on." Old research earns entry only when someone actually needs it — a pull model that guarantees relevance and saves months.

**Who should own the repository?**
One named person — typically research ops or a senior designer — as gardener, with contribution from everyone. Ownership-by-committee produces the thirty-synonyms-for-onboarding problem. The gardener's real job is the editorial layer: merging tags, expiring stale notes, writing the quarterly synthesis.

**Do we need dedicated repository software?**
For the first year, no — a structured database in whatever documentation tool the team already opens daily beats a perfect tool nobody visits. Graduate to dedicated research tooling when the corpus is large enough that search quality becomes the bottleneck, and bring your taxonomy, note schema and decision links with you. The tool is replaceable; the habits are the asset.
