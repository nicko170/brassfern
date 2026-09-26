---
title: "Our responsible-AI review, in the open"
description: "The full review we run before any AI feature ships: risk taxonomy, red-team scripts, disclosure patterns, data-handling checklists — and how we say no to features."
slug: responsible-ai-review
cluster: ai
tags: [responsible ai, ai governance, risk assessment, ethics, process]
date: 2026-08-13
author: Dev Khatri
keywords: [responsible ai process, ai risk assessment, ai ethics design, ai governance]
readingTime: 11
heroImage: /images/articles/ai/responsible-ai-review.jpg
heroAlt: "Overhead still life of a brass inspection stamp, loupe and paperweight beside hand-lettered fern-green specimen cards and a pressed fern on cream paper."
---

Every industry develops its ethics the same way: first as a poster, then as a checklist, then — if the field matures — as a practice with teeth. Most AI ethics we've encountered in the wild is still at the poster stage. "We believe in human-centred AI" on a careers page, while the roadmap contains a feature that summarises job applicants.

We got tired of our own version of that gap a few years ago, so we wrote our process down and made it a gate: no AI feature ships from Brassfern without passing this review. Publishing it does two things. It holds us to it — a published standard is harder to quietly waive. And it gives clients a concrete artefact to react to, which turns an abstract values conversation into a procurement-grade discussion about what we're actually building. Steal it, adapt it, argue with it. The specifics matter less than having specifics.

## Gate zero: should this exist at all?

Before the risk taxonomy, a simpler question, asked in the kickoff and not after the build: **what happens to a person when this feature is wrong about them?**

The answer sorts every proposed feature into one of three tiers, and the tier determines everything downstream:

- **Tier 1 — Low stakes, reversible, user-initiated.** Drafting, summarising your own data, creative exploration. Wrong answers waste minutes. Examples: email drafts, meeting summaries, style suggestions.
- **Tier 2 — Consequential, semi-reversible, affects others.** Answers given to customers, categorisations that route work, content published under the company's name. Wrong answers cost money, time or reputation. Examples: support assistants, triage, merchandising copy.
- **Tier 3 — Decisions *about* people, hard to reverse, often opaque to the subject.** Screening, scoring, eligibility, anything touching health, housing, employment, credit. Wrong answers cost people opportunities they may never know they lost.

Tier 1 gets the standard review described below. Tier 2 gets the review plus domain-expert sign-off and mandatory human escalation paths. Tier 3 gets a conversation we lead with scepticism: we have declined or reshaped more Tier 3 work than we've shipped, and the reshapes almost always move the AI from *deciding* to *assembling* — gathering and structuring information so a human decides visibly. The model prepares; the person judges. If a client wants the machine to be the judge, we're usually the wrong studio, and saying so early is cheaper for everyone, including the client's legal team.

## The review, step by step

### 1. Failure inventory

For each feature we write, in plain sentences, the five worst realistic failures. Not "the model hallucinates" — specific: "the assistant invents a refund policy that doesn't exist and quotes it to a customer"; "the summary omits the one clause the clinician needed". Realism matters: these come from reading sampled outputs, not from imagination, which is why this step happens only after a prototype exists. Each failure gets a likelihood, a blast radius and a mitigation — and mitigations must be interface-level (citations, confirmation steps, human review queues, scoped capability), not "we'll improve the prompt". Prompt improvements are included, but they don't count as mitigations, because they fail silently.

### 2. Red-team session

Ninety minutes, three roles: an attacker (tries to make the feature misbehave — prompt injection through user content, boundary probing, getting it to claim capabilities it doesn't have), a sceptic (uses the feature as a careless, hurried or adversarial *ordinary user* would — wrong inputs, truncated context, unreasonable requests), and a scribe. The sceptic role finds more than the attacker role, every time, because real misuse is usually mundane: the user who pastes the wrong document, the agent who asks the assistant to "just approve it anyway".

Every successful exploit becomes a test case in the evaluation suite and a fix with an owner. The bar to pass: no open critical exploits, and every accepted residual risk has a named human who has agreed, in writing, to own it. "The team is aware" is not ownership.

### 3. Disclosure pattern

How does a person encountering this feature know it's AI? Our rules:

- **Obvious at first contact.** No anthropomorphic camouflage — the assistant is presented as software, in its name, its avatar-free presentation and its copy. It does not say "I feel" and it does not pretend to type.
- **Persistent at the point of consequence.** Where the output informs a decision, the AI origin travels with the artifact — a drafted message is labelled as drafted, a summary is labelled as a summary with sources.
- **Honest about basis.** The interface states what the feature draws on, as covered in our piece on [designing AI features users can trust](/journal/ai/ai-trust-design). Disclosure that lives only in a privacy policy is not disclosure; it's archiving.

### 4. Data-handling checklist

Eight questions, answered in the project's living doc before first production traffic:

1. What user data reaches the model, itemised field by field?
2. Which of that is sent to third-party model providers, and under what retention terms?
3. Can the feature work with less? (Usually yes. Scoping data down is the single highest-value privacy intervention, and it's free.)
4. What is logged, where, for how long, and who can read production conversations?
5. What's the consent story, in the interface's own words?
6. What breaks for users who decline?
7. How is data excluded from provider training, verified in the contract rather than assumed from the marketing page?
8. What's the deletion path when a user exercises it?

Question 7 earns its place: we've twice found a provider's default data-use terms contradicted the slide deck the client had been shown. Assume nothing; read the DPA.

### 5. Rollout plan

No AI feature goes from dark to everyone. All users at once is a launch; graduated rollout is a practice. Internal dogfood for two weeks minimum, then an opt-in cohort with extra instrumentation (the metrics in [analytics for AI features](/journal/ai/ai-feature-analytics) wired before the cohort sees it), then general availability with a kill switch someone has rehearsed using. The kill switch gets tested. An untested kill switch is a hope with a UI.

## How we say no

Saying no is a service, and like all services it needs a method, or it comes out as vibes and sounds like judgement. Ours has three parts.

**Offer the reshape first.** Almost every feature we've declined had a viable form one tier down. "Screen job applicants" becomes "structure applications so humans screen consistently". "Auto-approve claims" becomes "pre-fill the assessor's checklist with citations to the evidence". The reshape usually preserves 80% of the value — the drudgery was the cost centre, not the judgement — and the client relationship survives because we came with an alternative, not a sermon. Several of our best engagements, including the work behind the [Pylon Health telehealth flow](/work/pylon-health-telehealth-flow), began as a reshape of a scarier idea.

**Put the risk in business language.** "Ethically problematic" starts an argument. "This feature will eventually invent a policy, a customer will screenshot it, and your support team will be honouring a refund you don't offer" ends one. Concrete failure stories are more persuasive than principles, because they're forecasts, not accusations.

**Be willing to walk.** We've twice declined the AI portion of an engagement while keeping the rest, and once declined outright. Each time, the discovery work we'd already done stood on its own — the fixed-scope sprint model in [how we work](/approach) de-risks exactly these decisions before the build budget exists. The studio's position is simple: we put our name on what ships, so every feature is effectively signed. We don't sign things we can't defend.

## What the review is not

Three honest limitations, because pretending otherwise would be exactly the kind of over-claiming we critique elsewhere. It's not compliance — legal review is separate and a lawyer's job, not ours. It's not a guarantee — it reduces the most likely, most boring failures, which is where most of the harm actually lives, but novel systems fail in novel ways. And it's not static — the taxonomy, the red-team scripts and the checklist all get revised every quarter from the year's incidents and near-misses, ours and the industry's. A responsible-AI process that doesn't itself improve quarterly is a poster with extra steps.

What it is: a set of questions with teeth, asked early enough that the answers can still change the design. That's the whole trick, honestly. The ethics is easy; the timing is the work.

## Key takeaways

- Gate every AI feature by what happens to a person when it's wrong about them. The tier — inconvenience, consequence, or decision about someone's life — determines the process, not the budget or the deadline.
- Write the five worst realistic failures from sampled outputs, and require interface-level mitigations. Prompt improvements are not mitigations; they fail silently.
- Red-team with a sceptic as well as an attacker. Mundane misuse — wrong document, careless request — out-finds adversarial cleverness every session.
- Disclosure means obvious at first contact, persistent at the point of consequence, honest about basis. A privacy policy is archiving, not disclosure.
- Scope data down before anything else; verify training-exclusion in the contract, not the slide deck.
- Saying no works when you offer the reshape, speak in business consequences, and are genuinely willing to walk. Features you ship are features you've signed.

## FAQ

**Doesn't this process slow shipping to a crawl?**
The full review is roughly three days of effort spread across a build — a failure-inventory workshop, a ninety-minute red-team, the checklist. What slows teams down is discovering a disqualifying problem in week ten. Gate-zero triage happens in the first week, so the expensive surprises happen while the design is still cheap to change. Every declining-or-reshaping story in this article was a kickoff conversation, not a launch-blocking crisis.

**Who should run this review — an internal team or an outside party?**
The review works best run by people who will own the consequences, which usually means the product team with structured facilitation. Outside review adds the most value at Tier 3 and in regulated domains, where independence is part of the point. What doesn't work anywhere is review by the same person who built the feature with no external eyes — enthusiasm is a documented failure mode.

**How do we handle clients or stakeholders who see the review as bureaucratic theatre?**
Show them the failure inventory format and red-team findings from an anonymised past project. Concrete stories of caught failures — the invented refund policy, the assistant approving things it shouldn't — reframe the review from "ethics overhead" to "the QA pass that catches what QA structurally can't". Nobody has ever watched a red-team session and called it theatre afterwards.

**What about open-source models we host ourselves — does the checklist still apply?**
Every step. Self-hosting changes the third-party data questions (7 and parts of 4) in your favour and adds nothing else. The failures, the disclosure, the provenance, the rollout discipline — all of it is about your users' experience of the feature, which is identical regardless of whose GPU the model ran on. Self-hosting removes a vendor risk, not a product risk.

**How do we keep the process current as models and regulation change?**
Quarterly revision is built in: each quarter we fold in the year's incidents — ours and the industry's public post-mortems — and re-run the taxonomy against whatever we're actually building. Regulation moves slower than the discourse suggests; in practice, the existing checklist (data minimisation, disclosure, human oversight, logging) already covers the shape of every framework we've mapped it against. The durable stuff is durable because it's about people, not about any particular model.
