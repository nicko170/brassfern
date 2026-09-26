---
title: "Buying accessible software: a procurement playbook"
description: "A procurement playbook for accessibility: brief language that binds, evaluating claims beyond the VPAT, acceptance criteria that bite, and keeping standards after launch."
slug: accessibility-procurement
cluster: playbooks
tags: [accessibility, procurement, wcag, rfp, acceptance criteria]
date: 2026-04-22
author: Felix Brandt
keywords: [accessibility procurement, wcag requirements rfp, buying accessible software, a11y compliance]
readingTime: 10
---

Most accessibility failures in software are procurement failures wearing a delivery costume. By the time a launched product can't be used with a screen reader, the actual mistake happened months earlier: a brief that said "must be accessible" with no standard, a vendor proposal that said "WCAG compliant" with no evidence, a contract with no acceptance criteria, and a launch checklist where accessibility was a phase that could be descoped when timelines got tight. Which it always is, because phases that can be descoped get descoped.

This playbook is for the buying side — procurement leads, product owners, heads of digital signing off on agencies and platforms. It's the checklist we wish more of our clients arrived with, and the one we now offer at the start of engagements. None of it requires you to become an accessibility specialist. All of it requires you to make accessibility a purchasing condition rather than a hope.

## Write it into the brief so it binds

"Must meet WCAG 2.2 AA" appears in briefs constantly and binds nothing, because it arrives with no definition of what meeting it means. Brief language that actually binds has four parts:

1. **The standard and the scope.** "WCAG 2.2 Level AA" *plus* which user journeys it applies to: "the complete browse-to-checkout journey, account management, and all template types" — named flows, not vibes. Accessibility scoped to "the website" gets interpreted as "the homepage".
2. **The assistive-technology matrix.** Name what you'll test with: current NVDA and JAWS on Windows, VoiceOver on macOS and iOS, TalkBack on Android, keyboard-only throughout, 200% zoom, Windows High Contrast. A vendor who blinks at this list is telling you something valuable in week one.
3. **The process requirement.** Require evidence during delivery — accessibility findings in design review, automated checks in the build pipeline, screen-reader testing footage at each sprint demo — not a single audit at the end. End-loaded accessibility is archaeology.
4. **The people requirement.** Ask who on the team owns accessibility, by name and role, and what they've shipped before. "The whole team cares about accessibility" is a poster, not a plan.

Our own [accessibility audit process](/journal/product/accessibility-audit-process) shows what a serious delivery process looks like from the inside; the short version is that findings should be boring, incremental and fixed weekly, not discovered in a heroic pre-launch sweep.

## Evaluate claims beyond the VPAT

The VPAT (Voluntary Product Accessibility Template) is where accessibility claims go to be unfalsifiable. We've reviewed VPATs that marked every criterion "Supports" for products that failed basic keyboard navigation within ninety seconds. The document means the vendor knows the vocabulary. That's all it means.

Evaluate with evidence instead:

- **Ask for a live demonstration with a screen reader** — the vendor performs a core journey on their own past work, using NVDA or VoiceOver, unprompted by you. Fluency here can't be faked in a procurement deck. Teams that test this way weekly demo it effortlessly; teams that don't, fumble within minutes, and both outcomes are informative.
- **Request a past audit report and its remediation log.** Any vendor with a real practice has both, and the remediation log is the more revealing document: it shows whether findings got fixed or got argued with.
- **Run your own thirty-minute pass.** Keyboard-only through their portfolio site's main flow. Turn on VoiceOver and attempt one form. You will not become an auditor in thirty minutes, but you will learn whether accessibility survived contact with their real shipped work.
- **Probe the design-stage practice.** Accessibility that's only tested in code is being found too late. Ask how contrast, focus order, target size and error patterns are handled in design files — our piece on [accessibility starting in the design file](/journal/web-design/accessible-design-handoff) describes what good looks like at that stage, so you know what to listen for.

## Acceptance criteria that bite

Contracts fail accessibility in the acceptance clause, where "reasonable efforts" goes to retire. Criteria that bite are testable, tied to payment, and sequenced:

- **Testable:** "Zero critical or serious issues from a WCAG 2.2 AA audit of the named journeys, performed by an agreed independent auditor" — not "best efforts toward compliance". Define severity categories in the contract (there are mature taxonomies; any serious vendor has one) so disputes reference a definition rather than a mood.
- **Tied to payment:** the final milestone is not payable until the audit passes. This single clause changes vendor behaviour more than every other line in the contract combined, because it moves accessibility from the quality column to the cash column.
- **Sequenced:** an interim audit at the midpoint, not only at the end. Midpoint findings are cheap to fix and — just as important — they tell you whether the vendor's process works, while there's still budget to react to the answer.

Two clauses worth adding that most buyers miss: a **regression warranty** (issues introduced by the vendor's own change requests in the first 90 days get fixed at the vendor's cost) and a **training handover** (your content team learns the accessibility-relevant parts of the CMS — alt text policy, heading structure, video captions — because the most accessible build in the world degrades the first time someone pastes a PDF as a page).

## The platform and vendor shortlist

For off-the-shelf platforms and component vendors rather than agencies, the leverage is different but the principle holds. Ask for their public accessibility roadmap and their issue tracker culture — a vendor whose GitHub shows accessibility bugs closed with care is worth more than one with a conformance badge. Ask specifically how they handle the components you'll live in daily: date pickers, modals, tables, autocomplete fields, the checkout. Complex widgets are where platforms' claims meet reality. And get the answer in writing to one question: "when we file an accessibility defect, what is the committed triage SLA?"

## Keeping standards after launch

Launch day is peak accessibility; it's downhill from there unless someone owns the slope. Three mechanisms keep a product from degrading:

1. **A named internal owner** with actual time allocated. Not a committee — a person whose objectives include the accessibility scoreboard.
2. **Automated regression checks in the deployment pipeline** for the mechanically detectable share (contrast, labels, landmarks, duplicate IDs). Automation catches maybe a third of real issues, but it catches them on every deploy, forever, for free. The other two-thirds need the third mechanism.
3. **A recurring manual audit on a calendar** — quarterly for active products, with the same journeys and assistive-technology matrix from the brief. Content-driven decay (new templates, new imagery, that enthusiastic marketing pop-up) is the main failure mode post-launch, and only a recurring human pass sees it.

If you're building with an agency on a continuing basis, fold the recurring audit into the engagement model — it's the kind of unglamorous, compounding work a [retainer](/pricing) is genuinely good at. And if you're at the earlier stage of still choosing who to build with, the same evidence standards apply to every vendor on the shortlist; our [approach](/approach) page documents how we run this ourselves, and we're happy to be measured against everything above.

## Key takeaways

- Accessibility failures are usually procurement failures: briefs without standards, claims without evidence, contracts without acceptance criteria, launches where the accessibility phase gets descoped.
- Binding brief language names the standard, the journeys, the assistive technologies, the in-flight process evidence and the accountable person.
- A VPAT proves vocabulary, not capability. Evaluate with live screen-reader demos, past audit and remediation logs, and a thirty-minute keyboard-and-VoiceOver pass of the vendor's shipped work.
- Acceptance criteria bite when they're testable, payable and sequenced: independent audit against named journeys, final payment gated on passing, interim audit at midpoint.
- Launch is peak accessibility. Post-launch survival needs a named owner, automated pipeline checks, and a recurring manual audit on a calendar — not another poster.

## FAQ

**Do we need an accessibility specialist in-house to buy well?**
No. You need the binding brief language, the evidence-based evaluation and the teeth in the acceptance clause — all of which are procurement skills, not WCAG expertise. Where a specialist earns their fees is the independent acceptance audit at midpoint and launch: budget for that as an external line item, the same way you'd budget for a building inspection.

**WCAG 2.2 AA or AAA — which should we require?**
AA, comprehensively; AAA criteria selectively where they serve your audience (for instance, consistent help and authentication patterns in services for users with cognitive disabilities, or target size in anything mobile-heavy). Blanket AAA is unachievable for most content and websites, and requiring it invites vendors to promise it dishonestly. A vendor who promises full AAA without a conversation about scope is waving a red flag, not a credential.

**What should we budget for accessibility on a typical build?**
Done properly from the start, roughly 10–15% of design and build effort on a marketing site, more for complex applications with dense interactions. Bought as an end-of-project audit-and-remediation, the same outcome typically costs two to three times as much, because you're paying to unpick decisions rather than make them. Retrofitting is the expensive way to buy the same thing.

**How do we handle a platform or plugin we depend on failing an audit?**
Document it, file it with the vendor citing their own conformance claims, and build a workaround at your layer where feasible. Contracts should anticipate this: your lead agency's acceptance criteria can't include silent dependencies on third-party components nobody controls. Name the dependencies in the brief and assign responsibility per component before work starts, not in the findings meeting.

**Is accessibility legally required for us?**
That depends on your jurisdiction, sector and audience — and it's a question for your lawyer, not your agency. What we can tell you: in Australia, the US, the UK and the EU, digital accessibility obligations are real, actively enforced in various forms, and widening. But the stronger argument was never compliance alone — accessible journeys convert better for everyone, and the buying process above produces better software even if nobody ever sends you a legal letter.
