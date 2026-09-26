---
title: "Draw the sitemap before anyone opens Figma"
description: "The sitemap is the cheapest UX artefact you'll ever make and the one teams skip most. Map user questions to pages, audit navigation debt, realign stakeholders fast."
slug: sitemap-as-ux-artifact
cluster: web-design
tags: [information architecture, sitemaps, navigation ux, site structure]
date: 2026-05-16
author: Mara Ellison
keywords: [sitemap design, information architecture, navigation UX, site structure, user questions]
readingTime: 8
---

Every website project has a moment where the arguments start. It usually arrives in week three, inside a Figma file, over whether the product tour belongs on the homepage. By that point the argument is expensive: layouts exist, feelings are involved, and the real question — *should this page exist at all, and where does it live?* — was never answered on paper.

The sitemap is how you have that argument when it costs nothing. We draw one before a single artboard opens, on every project, and it's the single highest-leverage hour in our [discovery process](/journal/playbooks/discovery-sprint-playbook). Here's the method.

## A sitemap is a question map, not a page list

The classic failure is the org-chart sitemap: pages grouped by which department owns them ("About / Our Story / Leadership / Careers") rather than by what visitors arrive wanting to know. Nobody searches for your org chart.

Instead, start with the questions. For a marketing site, we ask the team to list the twenty things visitors actually want, verbatim, in the visitor's words — sticky notes, a whiteboard, whatever's fastest:

- "What does this thing do and is it for me?"
- "What does it cost, roughly, before I talk to anyone?"
- "Can I trust these people with something important?"
- "How is this different from the thing I already use?"
- "What happens if I click the big button?"

Then — and this is the whole trick — **each page in the sitemap must name the question it exists to answer**. Write it on the node. "Pricing — answers 'what will this cost me?'". "Work — answers 'can they trust us?'". A page that can't name its question doesn't get drawn. This does more to kill vanity pages than any critique session we've ever run, because it converts taste arguments into evidence arguments.

It also forces the duplication fight early. If "What does it cost?" is answered on both /pricing and /services, you now have two nodes claiming one question, and somebody has to win. That dispute takes eleven minutes on a whiteboard. In Figma, it takes a sprint. In production, it takes a ranking drop and an awkward redirect. We wrote about the cousin of this problem — duplicate content decaying after [content handover](/journal/playbooks/content-handover-workflow) — and the sitemap is where you pre-empt it entirely.

## The 20-minute sitemap exercise

This is the exercise we run in the first stakeholder workshop. It works with founders, marketing teams, boards, anyone.

1. **Five minutes — the dump.** Everyone silently writes visitor questions on notes. No discussion. The silence is load-bearing: it stops the loudest stakeholder from setting the taxonomy.
2. **Ten minutes — the map.** On one wall, the group clusters questions into pages, top-level pages into the small set that becomes navigation. The facilitator's only job is to keep asking: "Would a first-time visitor look for that there?" The moment someone says "well, they'd learn our structure…" you have detected a page that exists for the org, not the visitor.
3. **Five minutes — the vote.** Everyone gets three dots for the questions that matter most commercially. The top-voted questions get checked against the map: does each one have an obvious, one-click path from the homepage? If the highest-stakes question is three levels deep, the map is wrong no matter how tidy it looks.

What you get out of twenty minutes: a shared picture of the site that every stakeholder helped draw, which means the map is *theirs*, which means navigation stops being a design debate for the rest of the engagement. It's the most reliable [stakeholder alignment](/journal/playbooks/stakeholder-alignment-design) move we own.

## Navigation debt: auditing what you already have

Redesigns usually arrive with an incumbent site, and the incumbent sitemap is a sedimentary record of every past team, campaign and CMS workaround. We audit it as debt:

- **Orphan pages** — nothing links to them except Google. Usually dead campaigns. Each one is a 301 decision, made deliberately.
- **Depth debt** — important content buried at depth four or five. Our rule: anything a paying customer needs monthly must be reachable in two clicks from the homepage. Anything a first-time evaluator needs must be one.
- **Duplicate answers** — three pages partially answering the same question, all ranking poorly, all decaying. Consolidate into one canonical page; redirect the rest. This single move has recovered organic traffic on nearly every [growth engagement](/services/growth) we've taken on a mature site.
- **Navigation by fear** — top nav with nine items because departments negotiated. The [footer](/journal/web-design/footer-design-matters) exists precisely to absorb the long tail of legitimate-but-secondary pages so the header can stay opinionated. Seven items is the ceiling; five is the goal.

One tool we keep returning to: export every URL with its organic traffic, lay it against the hand-drawn question map, and colour every URL that answers no visitor question. On a recent hospitality group engagement that colour covered 61% of their indexed URLs. The redesign brief rewrote itself in an afternoon.

## From sitemap to structure: what the drawing must decide

A good sitemap isn't just boxes; it pre-decides the things that are painful to decide later:

- **URL taxonomy.** If /journal/:cluster/:slug is the shape, the sitemap says so, and every future article inherits the taxonomy. Retrofitting URL structure is one of the most expensive things you can do to a live site — decide it on paper.
- **What the global nav says, and what it refuses to say.** Draw the nav on the sitemap. Literally. If eight stakeholders each think their page is in the header, discover that on the whiteboard.
- **The paths that matter.** Annotate the two or three journeys the business runs on — evaluator to contact, reader to subscriber, donor to donation — as arrows across the map. If a journey crosses a dead end, the sitemap gets redrawn before any wireframe does.
- **Where search ends and browse begins.** Sites over a few hundred pages need a search strategy the sitemap acknowledges — which clusters are browsable trees, which are flat archives surfaced by search and tags. ([Tag architecture](/journal/web-design/related-content-modules) is its own discipline; decide the relationship now.)

Then, and only then, Figma. The [navigation patterns](/journal/web-design/navigation-that-survives-mobile) you'll design from here are downstream of decisions the sitemap already made — which is exactly the point. Constraints arriving from a cheap artefact feel like clarity; the same constraints discovered mid-design feel like sabotage.

## Key takeaways

- Sitemaps answer "what question does this page exist to answer?" A page that can't name its question doesn't get drawn.
- The 20-minute exercise: silent question dump, group clustering, dot-vote on commercial stakes. Stakeholders align themselves by drawing the map.
- Audit incumbent sites for navigation debt: orphans, depth, duplicate answers, fear-driven nav. The footer absorbs the long tail; the header stays opinionated.
- Pre-decide URL taxonomy, global nav scope, priority journeys and search-vs-browse on paper. Retrofitting any of them on a live site is ruinously expensive.
- Never open a layout tool until the sitemap survives the dot-vote test.

## FAQ

**Isn't this just card sorting?**
Card sorting asks users to categorise your content; the sitemap exercise asks stakeholders to map user questions. Different subject, different moment. We use card sorts later to *validate* clusters the sitemap proposes — they're a check, not the method.

**Do we need UX software to draw it?**
No. Sticky notes for the workshop, then whichever diagramming tool your team already opens fastest. The artefact's value decays in proportion to how beautiful it gets — a sitemap someone is afraid to redraw is a failed sitemap.

**How often should the sitemap be revisited after launch?**
Quarterly for content-heavy sites, and any time analytics shows a top-ten entry page that answers no question on the map. The sitemap is a living artefact; treat its drift like code drift.

**What about single-page sites?**
They still have a sitemap — it's called the section order, and the question test applies to every section. If anything, the constraint is harsher: one page means one chance at the sequence.
