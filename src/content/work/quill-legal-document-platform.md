---
title: "Quill Legal: a document platform lawyers actually enjoy"
description: "A legal-tech SaaS had a brilliant document-automation engine trapped in a 2016 UI. We redesigned the product end-to-end and shipped its design system, Precedent."
slug: quill-legal-document-platform
cluster: work
tags:
  - SaaS
  - Product design
  - Design systems
  - Accessibility
date: 2025-08-21
author: Aiko Tanaka
keywords:
  - saas redesign case study
  - legaltech product design
  - design system case study
  - dashboard ux
  - template builder design
readingTime: 10
client: Quill Legal
industry: SaaS
services:
  - Product design & engineering
  - Websites
year: 2025
stack:
  - React
  - TypeScript
  - Node
  - Postgres
  - Storybook
---

Quill Legal builds document-automation software for mid-size Australian law firms: turn your precedents into smart templates, answer a questionnaire, and generate a shareholder agreement in four minutes instead of four hours. The engine was genuinely excellent — firms described it as "the thing that paid for our paralegal budget." The interface around it was a different story: a 2016 admin theme, tables nested in tables, and a template builder that one customer called "the spreadsheet that judges you."

By the time Quill's founders reached us, the UI debt had become a commercial problem. Trials converted at half the rate of the sales team's demos. Expansion revenue stalled because firms bought the platform and then only one person — always called the "Quill champion," never a job anyone wants — used it deeply. The product had a depth problem disguised as a design problem.

## The challenge

We embedded with Quill for a two-week discovery sprint, interviewing twenty-three lawyers, conveyancers and practice managers across eight firms. Three findings did most of the strategic work:

- **Legal work is verification-heavy.** Lawyers don't trust a generated document; they trust the document after they've checked its critical clauses against their intent. The old UI buried the connection between "answer" and "output", so users generated, exported to Word, and reviewed there — leaving the platform at the exact moment it delivered value.
- **The template builder scared people.** Building a smart template meant writing conditional logic in a syntax resembling a mail-merge language. Only power users touched it, which is why every firm had exactly one champion.
- **Nobody knew where a matter stood.** Quill organised work around templates, but lawyers organise work around matters — the client, the matter number, the deadline. The information architecture matched the database, not the practice.

And a constraint that shaped everything: Quill's six-person engineering team would own whatever we shipped. A redesign they couldn't maintain would be a slower kind of failure than not redesigning at all.

## Approach

**The matter dashboard as home.** We re-platformed the product's centre of gravity from templates to matters. The dashboard answers three questions in priority order — what needs my attention, what's waiting on a client, what did the team finish — with dense, keyboard-friendly matter tables underneath. We leaned on the same hierarchy discipline we wrote up in [dashboard design: answer first, chart second](/journal/product/dashboard-design-hierarchy): status before statistics, always. The dashboard became the screen practice managers open with their morning coffee, which is the only engagement metric Quill's CEO now quotes unprompted.

**A template builder with live preview.** The builder's redesign was the riskiest surface, so we prototyped it in week three and tested it with five real "champions" before committing. The pattern that won: a split view, questionnaire on the left, live-rendered document on the right, with conditional logic expressed as plain-language rules ("include this clause when the company has more than one shareholder") compiled to Quill's existing syntax underneath. Power users can still drop to code. Everyone else never has to see it. This is the progressive-disclosure pattern we keep returning to — our journal notes on [disclosing complexity without hiding it](/journal/product/progressive-disclosure-complexity) cover the general case.

**Preview as the trust surface.** In the document flow itself, every answer a user gives highlights its downstream effect in the preview as they type — answer a question, watch clause 7.2 appear. That simple causality loop did more for trust than any marketing copy. In testing, participants described the feeling as "I can see it listening." An AI-flavoured cousin of the same principle — showing the system's working — shows up in our notes on [citation design](/journal/ai/citation-design-ai-features); provenance is a universal trust mechanism.

**Precedent: the design system, shipped as tokens.** Because Quill's engineers owned the future, we didn't deliver screens — we delivered a design system, named (with the firm's blessing) *Precedent*. Tokens for colour, type, spacing and density ship as a versioned package; components live in Storybook with accessibility acceptance criteria attached to each one. Form-heavy legal software means the boring components matter most: inputs, select menus, error summaries, date pickers that don't fight the keyboard. Every component passes WCAG 2.2 AA; target sizes, focus states and contrast were acceptance criteria in the build, not a retrofit. If you're running a similar audit, our [accessibility process](/journal/product/accessibility-audit-process) is public.

**Pairing, not parachuting.** The engagement ran as one squad: two Brassfern designers and two engineers embedded with Quill's team, weekly demos in their stand-up slot, design decisions recorded as short Architecture Decision Records they still write. The last month of the engagement was deliberately Quill-led, with us reviewing rather than driving — the handover was a slope, not a cliff. The squad model is the core of how we work; it's written up on our [approach page](/approach), and the [product service page](/services/product) describes the engagement shape.

## The outcome

The redesigned platform shipped progressively over two quarters in 2025, template builder last. Outcomes below are illustrative, measured against matched pre-launch cohorts:

- **Task success on core flows:** up 44% in moderated benchmark testing (generate a document, build a template, find a matter's status) — the number that told us the redesign was honest.
- **Trial-to-paid conversion:** up 31%. The trial now opens on the matter dashboard with a guided first document, and the sales team reports that demos and trials finally "feel like the same product."
- **Onboarding drop-off:** down 29%, measured from account creation to first generated document. The single biggest contributor: the plain-language template rules, which let firms import their favourite precedent in their first session instead of their fourth.
- **Champion dependency — the real prize:** the share of active users per firm rose from a median of 1.2 to 3.4. Multi-seat engagement is Quill's strongest retention predictor, and it's now a board metric.
- **Accessibility, sustained:** a third-party audit three months post-launch found two minor issues. Both were fixed in the component library, so the fix shipped to every surface at once — which is the whole point of shipping tokens.

"The old builder was a priesthood," one firm's operations manager told us in a follow-up interview. "Now the grad builds the templates and I check them. That's how it should have worked from day one."

## What we'd tell other SaaS teams

Redesigns fail when they're sold as coats of paint to be applied at the end. The work that moved Quill's numbers was structural — re-centring the IA on matters, making trust visible in the preview, and shipping a system the owning team could actually run. If your product has a "champion" bottleneck, that's the signal: your power users aren't a gift, they're a symptom. For the broader pattern, see our notes on [feature discovery after launch](/journal/product/feature-discovery-after-launch) — and if this sounds uncomfortably familiar, our [contact page](/contact) is the right next click.
