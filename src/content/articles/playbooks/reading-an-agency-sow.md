---
title: "How to read an agency SOW before you sign it"
description: "Most SOW disputes were visible in the document. How to read scope boundaries, assumptions, change control, acceptance criteria and warranties before signing."
slug: reading-an-agency-sow
cluster: playbooks
tags: [agency selection, contracts, project management, procurement, scope]
date: 2026-03-03
author: Ruby Castellanos
keywords: [statement of work agency, sow review checklist, agency contract scope, project assumptions document]
readingTime: 9
---

Every painful agency engagement we've been asked to rescue started as a signed document. Not a bad team, not bad intent — a statement of work that two parties read differently, where one of those readings cost a lot of money by month three. The SOW is where ambiguity goes to become expensive.

We write a lot of SOWs, so let me show you ours from the reader's side. Here's how to read any agency's statement of work the way a producer reads it: hunting for the specific places where scope disappears, risk transfers, and "we'll figure it out" hides inside formal language. None of this is adversarial — a good agency welcomes these questions because they make the project cheaper to run. The ones who bristle are giving you information, too.

## 1. Scope boundaries: read what's excluded, not what's included

Everyone reads the deliverables list. The SOW's truth lives in the exclusions and the silence between the lines.

**Look for the exclusions section — and worry if there isn't one.** An SOW without an explicit "out of scope" list is an SOW written optimistically. Ours name excluded items plainly: content migration beyond N pages, third-party licence fees, photography, legal review of copy, post-launch support. When exclusions are named, both sides can argue about them *now*, when arguing costs an email rather than a change request.

**Interrogate nouns without numbers.** "Marketing website" — how many templates, how many distinct pages, which breakpoints? "CMS setup" — how many content types, which editors, what training? A capable SOW quantifies: page counts, component counts, integration counts, revision round counts. Where a noun refuses quantification, ask for it in writing. If the agency can't answer, that's the estimate calling for help — our guide to [how studios price work](/journal/playbooks/estimating-software-projects) explains why fuzzy nouns hide fuzzy assumptions.

**Trace every dependency the scope assumes.** "Client will provide final copy" is a scope boundary wearing a dependency costume. If your side slips on that input, what happens to timeline and price? A good SOW tells you; a fragile one discovers it live.

## 2. The assumptions section is the real contract

Every SOW rests on assumptions — and most clients skip the section because it reads like boilerplate. It is not boilerplate. It is the load-bearing wall.

Typical entries: "client stakeholders respond within two business days", "existing brand assets are final and licensed", "third-party APIs behave per their documentation", "no more than two stakeholder groups in reviews". Each of these is a condition under which the price is true. Read the section twice and ask, per line:

- **Is this assumption actually true for us?** If your legal team takes three weeks to review anything, the two-day feedback assumption is already broken at signature.
- **What happens when it breaks?** Look for the consequence. Professional SOWs link broken assumptions to the change-control process rather than to silent schedule drift.

An assumption you catch and correct at signing is a two-line edit. The same assumption discovered in month two is a dispute with a paper trail pointing at you.

## 3. Change control: small process, huge signal

Somewhere in every SOW is a clause about changes. The details reveal how the agency actually works:

**A defined change-request micro-process.** Requested in writing, estimated before worked, approved before billed, scheduled with eyes open about knock-on effects. If the SOW says changes are handled "at standard hourly rates", ask what the rates are and who approves before hours accumulate. Ambiguous change control converts scope debates into invoice surprises — the single most common ruin of otherwise healthy engagements, and the entire subject of [our piece on scope change](/journal/playbooks/scope-change-without-drama).

**A discovery allowance.** Mature SOWs acknowledge that early-phase finding will alter the plan, and pre-wire how — often re-planning points at fixed milestones. An SOW that pretends nothing will be learned during the work is fiction priced as fact.

**Rounding favours.** Tiny asymmetries matter: is there a threshold below which changes are absorbed without paperwork? Agencies that name one ("changes under half a day are absorbed") are telling you they track but don't nickel-and-dime. That's a trust signal worth more than the money.

## 4. Acceptance criteria: define "done" or be defined by the argument

"Website delivered" is not an acceptance criterion. Read for:

**Testable definitions.** "Passes WCAG 2.2 AA audit on the agreed template set", "LCP under 2.5s on the five template pages under [agreed test conditions](/journal/engineering/core-web-vitals-field-guide)", "migration verified against the content inventory". If acceptance is vibes, the project's last month becomes a negotiation about whether things are finished.

**A review window with a default.** "Client has ten business days to accept or respond with specific defects; silence constitutes acceptance" — the default matters, because without one, the project can sit ninety-nine percent finished and unbillable while your stakeholders holiday.

**The defect process pre-agreed.** What counts as a defect (against the documented scope) versus a change (new desire)? The SOW should draw that line now, while nobody's anxious. Every month-end argument about "bug versus feature" is this line drawn late.

## 5. Money shape: what the payment schedule tells you

Payment terms are a behavioural diagram.

- **Study the trigger events.** What's invoiced at kickoff, at milestones, at acceptance? Milestone payments tied to objective gates (prototype approved, staging delivery) behave better than calendar payments, which drift loose of progress in both directions.
- **Check the tail.** A final payment held against acceptance gives you leverage at the moment you most need the agency engaged. SOWs front-loading nearly everything reduce your options exactly when launch risk peaks.
- **Watch for expense lines and pass-throughs** — licences, fonts, stock, hosting, third-party subscriptions. A SOW silent on who pays the tools becomes a monthly drip of small surprises.
- Compare against alternate shapes deliberately; fixed-scope versus retainer money behave very differently, and our [retainer or project guide](/journal/playbooks/retainer-vs-project) lays out the trade-offs we put in front of clients. Our own [engagement models](/pricing) page shows the shapes we use and why.

## 6. Warranty, IP and the after-care clauses

The last pages feel like legalese and deserve attention:

- **Warranty window.** Post-launch, what is fixed at no charge and for how long? Thirty to sixty days on defects within the delivered scope is a reasonable standard. "No warranty" is a statement about confidence.
- **IP transfer on payment.** You should own the work product upon final payment — code, designs, documentation. Retained IP structures (agency owns system, licences you usage) exist and aren't inherently sinister, but they must be priced visibly, not buried.
- **Exit ramps.** How does either party end the engagement cleanly, and what do you receive if that happens mid-flight? A SOW with a humane termination clause usually belongs to an agency planning to behave humanely.

## The five questions to ask before signing

Whatever the document, these five questions flush out most of the risk:

1. "Show me a change request from a past project — how did it move through this process?"
2. "Which assumption in this SOW is most likely to be wrong, in your experience?"
3. "What does the project look like in week two versus week nine — what will I have seen?"
4. "What happens to the timeline if our inputs arrive two weeks late?"
5. "Who is on our team by name, and what happens if one of them leaves?"

Judge the answers less for their content than their texture. Specific, unbothered answers mean the agency has been here before. Defensiveness about hypothetical bad news is the preview of the bad news.

A final note from the writer's side of the table: everything above is also what a *good* SOW gives you — a partner whose document does this work is telling you how they run projects, which is ultimately what you're buying. The document is the demo. Pair this reading with [how to evaluate the agency itself](/journal/playbooks/choosing-an-agency), read both before your next signature, and may your paperwork stay boring.

## Key takeaways

- Read exclusions and dependencies, not the deliverables list. Unquantified nouns are where scope disputes breed.
- The assumptions section defines when the price is true; check every assumption for real-world fit and consequence.
- Inspect change control: written, estimated, approved before billed, with a small-change threshold named.
- Acceptance needs testable criteria, a review window with a default, and a defect-versus-change line drawn in advance.
- Payment shape is behavioural: milestone triggers, a meaningful tail, named pass-throughs.
- Check warranty window, IP transfer on payment, and exit ramps — then ask the five questions and judge the texture of the answers.

## FAQ

### Should our lawyer review the SOW or just the MSA?

Both, but for different things. The lawyer handles liability, indemnity and IP mechanics; the operator's review in this guide — scope, assumptions, acceptance — is for you and your team, because you'll live inside it weekly. Legal review catches contract risk; operational review catches project risk, and nobody will do it for you.

### Are fixed-price SOWs riskier than time-and-materials?

Different risk, priced differently. Fixed price transfers delivery risk to the agency, which charges for it; time-and-materials transfers it to you, which requires your discipline. Quality SOWs state the shape and its logic openly — be suspicious of either priced without a conversation about why.

### What if the SOW is great but the master services agreement contradicts it?

Order-of-precedence clauses decide which document wins, and they're easy to miss. Ask, while negotiating, which controls. Then get the discrepancy fixed in writing; "we'd obviously follow the SOW" said in an email is not contract law.

### How long should SOW review take?

Two focused passes over two or three days, plus one meeting of questions — under a week of elapsed time. Agencies that pressure you to sign within a day or two are telling you something about how they'll behave when you're dependent on them.

### What if something is missing from the SOW that we assumed was included?

If it's not in the document, assume it's excluded — that is the safe reading, always. Raise it before signing; either it gets added to scope (and possibly price), added to exclusions explicitly, or clarified as an assumption. All three outcomes are fine. Surprise is the only failure mode.
