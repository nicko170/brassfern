---
title: "Content handover: getting real words before design ends"
description: "Lorem ipsum is a launch delay in a fake moustache. The workflow we run: working inventories, voice alignment, reviews that don't sprawl, and editor-phase checks."
slug: content-handover-workflow
cluster: playbooks
tags: [content workflow, copy handoff, content production, web content, editorial process]
date: 2025-06-16
author: Leonie Marsh
keywords: [content workflow for websites, copy handoff process, content production process, website content plan, editorial workflow]
readingTime: 9
---

There's a familiar smell at week ten of a website project. The design is finished, the build is ahead of schedule, and someone asks the question that should have been asked at week one: "So… who's writing the actual words?" Then comes the scramble — product pages written by the founder at 11pm, an about page inherited from a 2019 pitch deck, and the discovery that the design's elegant three-line headline slot is being asked to hold a mission statement of forty-one words.

Then the launch slips. Not because of engineering. Because of copy — the one deliverable everyone assumed would appear by magic.

At Brassfern we treat content as a first-class workstream with its own schedule, its own owner, and its own done-ness criteria. I've run this workflow across [banks learning to sound human](/work/copperline-community-bank) and [providores learning to sell online](/work/tallow-and-co-providore), and I'll tell you the secret up front: **content doesn't take long because writing is slow. It takes long because decisions and reviews are slow.** Fix the workflow and the words arrive on time. Here's how.

## The principle: content is a product, not a paint

The mental shift everything else depends on: copy is not a coat of paint applied to finished design. It's structural. Headline length determines layout. Whether you have three service blurbs or five changes the grid. The tone of your error messages is part of your UX. Our piece on [landing page anatomy](/journal/web-design/landing-page-anatomy) makes the same point from the design side: the words are the load-bearing members, and the visual system is scaffolding around them.

So the workflow below has one goal — **real, approved words in the design file and the CMS before visual design closes.** Not lorem ipsum. Not "draft copy" that everyone politely ignores. Final words, or as close to final as honest iterating gets.

## Week 1: the content inventory, in the format that works

Every website project starts with an audit of what words already exist and what's needed. We've tried many formats and settled on one: a spreadsheet with exactly these columns —

- **Page / component** (mapped to the sitemap, one row per designed unit)
- **Purpose** (one sentence: what should this copy accomplish?)
- **Source** (existing content, interview needed, net-new)
- **Owner** (one named person who drafts it)
- **Approver** (one named person who can say yes — see below)
- **Status** (not started / drafting / in review / approved)
- **Word budget** (the design's real constraint, in words or characters)

The word budget column is the workhorse. It comes *from the design in progress*, and it converts "write something punchy" into "write 6–10 words." Designers find this clarifying rather than constraining: a budget is a brief. It's much easier to write a nine-word headline than an unspecified one, the same way it's easier to design a 300px card than "a card."

The inventory meeting — ninety minutes, week one — fills in the purpose and source columns for every row. That's when the hidden monsters surface: the legal page nobody's thought about, the 200 product descriptions assumed to be "already somewhere," the founder's bio that needs a photo and a rewrite. Finding monsters in week one is cheap. Finding them in week ten is a launch slip.

## Weeks 2–3: voice alignment, before volume

The single most skipped step in content production is agreeing the voice *before* anybody drafts three thousand words in the wrong one. We front-load it:

1. **A voice session with the stakeholders who'll approve copy.** We bring examples — not adjectives. Nobody has ever learned to write "bold yet approachable"; everyone can learn from "this headline, not that headline." We show pairs of real options and get explicit reactions.
2. **A voice chart, one page.** Our [voice charts piece](/journal/brand/brand-voice-charts) describes the format in depth: three to four spectrums (playful↔serious, plain↔technical, etc.) with the dial positions, plus translation examples of the same sentence at each setting. The chart is the contract. When a review dispute erupts in week seven — and it will — the chart settles it without relitigating taste from scratch.
3. **A paid trial: the three hardest pages first.** Homepage hero, the pricing or services intro, and one product/service page. These carry the most voice risk per word. Approve these three in detail and every remaining page is a downhill write. Approve the easy pages first — about, contact — and you'll discover the disagreement on the pages that matter, at the deadline.

This is also where we align on the pernickety things that become inconsistency weeds later: capitalisation rules, Oxford comma, Australian versus American spellings, whether the company is "we" or the third person, how product names appear. Thirty minutes of decisions, documented on the voice chart, saves a hundred comment threads.

## Weeks 3–8: production with reviews that don't sprawl

Copy review is where content schedules go to die, so the workflow is more surgical than the writing:

**One approver per page, named in the inventory.** Not "the leadership team." A person. Committees don't approve copy; they multiply it. If a page genuinely needs sign-off from legal *and* the founder, the approver's job is to consolidate them into one voice before the feedback reaches the writer. Conflicting comments applied simultaneously are how you get sentences written by no one.

**Bounded review rounds: two.** Round one: substance (is this accurate, is this the right argument?). Round two: polish (tone, rhythm, consistency — checked against the voice chart). There is no round three by default. If round two can't close a page, the problem is upstream — an undecided strategy, an unaligned stakeholder — and we escalate that, rather than sanding the paragraph into dust.

**Comments of consequence only.** Reviewers can veto claims, accuracy, and voice-chart violations. Reviewers may *suggest* line edits. They may not rewrite everything into their own idiolect — that's how a forty-page site ends up sounding like nine different companies, one per reviewer. The writer holds the pen; the approver holds the standards.

**Draft in the design tool or the CMS, not in documents.** This is the highest-leverage habit in the whole workflow. Words reviewed in a Google Doc are reviewed in the abstract; the same words pasted into the actual layout get read differently — suddenly the approver sees that the paragraph is a wall, the headline wraps badly, the button label lies about what happens next. We review copy in situ from round one. It catches integration problems when they're still typos-shaped rather than redesign-shaped.

## Weeks 8–10: the editor phase

Once pages are drafted and approved in place, one editor — me, or my counterpart on the client side — does a full pass over the entire site as a *reader*, in a single sitting where possible. The editor phase checks what page-by-page review can't:

- **Consistency of promises.** Does the pricing page's claim match what the services page says? Is the company "12 years old" here and "a decade of experience" there? Readers notice; trust erodes in unit increments.
- **Repetition between pages.** The homepage doesn't need the about page's story. Adjacent pages that repeat each other are a sign the site architecture and the copy architecture disagree — usually fixable by cutting, not writing.
- **The link graph in words.** Every internal link's anchor text should promise the destination accurately. Yes, this is also an SEO practice; mostly it's a manners practice.
- **Reading level and rhythm sweep.** One pass with fresh eyes, aloud where stakes are high. Anything you stumble over, the reader will too.
- **Accessibility of the words themselves.** Link text that works out of context, headings that describe their section, alt text that describes rather than decorates. Our [accessibility audit](/journal/product/accessibility-audit-process) process treats copy problems as first-class findings, because they are.

## Handover: the CMS loaded with trained humans behind it

The last mile: content moves from documents/designs into the CMS, and the client's team learns to keep it alive. We insist on three things:

1. **The client enters real content themselves during the project**, with us alongside — not us bulk-importing everything on their behalf. A team that has felt the CMS's grain — its slug rules, its image ratios, its preview quirks — uses it confidently on day one. Our [handover playbook](/journal/playbooks/design-handover-done-right) covers the broader taper this belongs to.
2. **An editorial cheatsheet in the CMS itself**: the voice chart condensed, the formatting conventions, image crops, and the "before you publish" checklist — living where the work happens, not in a PDF in a drive.
3. **Words per page measured at handover.** If the pagination of copy decisions isn't settled — who can publish, who approves changes, how often content gets reviewed — we write that operating model down before we leave. A beautiful site with no editorial owner is a garden with no gardener.

These mechanics are part of why we pair content strategy with our [websites practice](/services/websites) rather than bolting it on: the CMS design and the voice are the same decision, made in different tools.

## Key takeaways

- Content slips launches because decisions and reviews are slow, not because writing is. Fix the workflow, not the typists.
- Start with a page-level inventory: purpose, source, owner, approver, word budget. The budget column turns dread into briefs.
- Align voice before volume: example pairs, a one-page voice chart, and the three hardest pages approved first.
- Bound reviews: one approver per page, two rounds, comments on substance — and review in the actual layout, never in a document.
- One editor reads the whole site end-to-end at the end; handover means the client's hands have already been on the CMS.

## Frequently asked questions

**Our founder insists on writing the copy. Is that a problem?**
Only if it's unmanaged. Founder-written copy is often the best-sounding copy a company has — nobody else carries the conviction. The workflow handles it the same way: a word budget, the voice chart as shared reference, two bounded review rounds, and honest scheduling ("founder drafts Fridays, editor polishes Mondays"). What doesn't work is the unplanned founder pass at week ten, rewriting everything because the draft was never aligned with them early.

**How long should copy for a marketing site actually take?**
For a typical 15–25 page marketing site with this workflow: six to eight weeks from inventory to approved-in-CMS, running parallel to design and build. The two failure modes that double it — scattered approvers and document-based review — add nothing to quality. They're pure latency.

**Should we hire a copywriter or use our internal team?**
Internal writers win on product truth; external writers win on craft and throughput. The pattern that works best is usually hybrid: external writer sets voice and writes the high-stakes pages (homepage, key landing pages), internal team writes the depth (docs, product pages) with the voice chart as guardrails and an editor over everything. Worst case is the split nobody planned, discovered mid-project.

**What if stakeholders fundamentally disagree on voice?**
That's a strategy problem wearing a copy problem's coat, and it's exactly what the voice session exists to surface. Run it in week one with the disagreeing parties and real example pairs. If the disagreement survives concrete examples — not adjectives — escalate it to whoever owns brand strategy before a single page is drafted. Copy drafted while voice is contested will be rewritten regardless of how good it is.

**Can AI tools help with this workflow?**
With the drafting labour, sometimes; with the decisions, no. The expensive parts — voice alignment, approval politics, accuracy against your product — are exactly the parts language models can't do. Use them for first drafts and variants if you like, but never skip the voice chart and never let an unedited generated page into review: approvers anchor on whatever they read first, and a mediocre first draft burns a review round you'll want back.
