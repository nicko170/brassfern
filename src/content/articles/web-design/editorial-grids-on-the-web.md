---
title: "Editorial grids on the web: rhythm, breakout, and restraint"
description: "The sequel to our editorial grid philosophy: the CSS mechanics of full-bleed breakouts, captions and pull quotes as real components, and a governance model for restraint."
slug: editorial-grids-on-the-web
cluster: web-design
tags:
  - Editorial design
  - CSS grid
  - Art direction
date: 2026-05-12
author: June Okafor
keywords:
  - editorial web design
  - css grid layout
  - full bleed breakout css
  - art direction web
  - baseline grid web
readingTime: 11
---

An earlier piece, [editorial grids: rhythm without rigidity](/journal/web-design/editorial-grids-web), laid out the philosophy — a family of grids that collapses with intent, rhythm enforced as tokens. This is the sequel, and it's about the other half of the craft: the engineering of breaking out. Because the thing that makes an editorial page feel like a magazine rather than a dashboard is not the grid — it's what escapes it, and how rarely.

Three topics, in ascending order of difficulty: the CSS mechanics of full-bleed breakouts, captions and pull quotes as first-class components, and the governance question that actually determines whether the design survives — who is allowed to break the grid, and how often.

## The breakout grid: one pattern to know

The canonical technique for editorial pages today is the *breakout grid* — a single set of named columns where every content element defaults to the text measure but can opt into wider tracks. The structure:

```css
.article {
  --page-pad: clamp(1.25rem, 5vw, 5rem);
  --measure: 68ch;
  --popout-w: 12rem;

  display: grid;
  grid-template-columns:
    [full-start] var(--page-pad)
    [popout-start] minmax(0, var(--popout-w))
    [content-start] minmax(0, var(--measure))
    [content-end] minmax(0, var(--popout-w))
    [popout-end] var(--page-pad)
    [full-end];
}
.article > *       { grid-column: content; }
.article > .popout { grid-column: popout; }
.article > .full   { grid-column: full; }
```

Every child lands on the reading measure by default; three classes unlock the wider lives. Three implementation notes from shipping this pattern across the last few years of [marketing and editorial builds](/services/websites):

- **Centring is the point.** The `minmax(0, …)` columns keep the content *optically centred* with the popout tracks balancing each other. A breakout that only extends right reads as an accident; symmetric popout tracks read as intent.
- **Mind the narrow end.** Below the width where the popout track collapses to zero, `.popout` and `.content` become identical — which is correct. The design's response at phone widths should be *less* breakout, not a rescaled copy of the wide one.
- **Full-bleed bands with inset content** — night sections set against the page — need an inner element re-establishing the content measure, or nested grids inheriting the parent's named lines. We use the `full` track on an outer wrapper with a centred max-width child; the band paints edge-to-edge, the content inside obeys the measure.

That's the entire mechanical budget. Tempting as it is, don't add a fourth track. Each new named line multiplies the number of layouts a CMS editor or future designer must hold in their head, and the popout/full vocabulary covers every editorial moment we've actually met.

## Captions and pull quotes are components, not formatting

The difference between a template site and an art-directed one is usually hiding in the furniture — captions, pull quotes, footnotes, figure numbers. Treat them as components with contracts:

**Captions.** A caption is a three-way contract between the image, the text, and the gutter. Ours specifies: set in the small step of the type scale, measure capped at ~40ch, positioned *below* landscape images and *beside* square ones at desktop (using the popout track for the image so the caption can hang in the freed column), and always within one rhythm unit of its asset. Critically for CMS-driven pages: caption length is constrained at the field level — 140 characters — because a caption that grows into a paragraph breaks the gutter geometry it lives in.

**Pull quotes.** The pull quote is the most abused component on the business web, usually because it's implemented as a duplicate of body text without accessibility handling. Our contract: a pull quote is *decorative repetition* — it restates a sentence that exists in the flow — so it renders with `aria-hidden="true"`, linked to its paragraph by proximity only for sighted readers. If the quote doesn't exist in the body, it's not a pull quote; it's a blockquote and must be marked up as one. Visually, a pull quote owns the popout track, carries a brass rule and a large italic, and interrupts the text between paragraphs — never mid-sentence, and never two per viewport. The motion contract applies too: a pull quote may fade, it may not fly; the [160ms choreography ration](/journal/web-design/motion-that-earns-its-keep) governs everything that moves on an editorial page.

**Figure numbers and marginalia.** The quietest flex in editorial design is numbered exhibits — "fig. 03" set in small caps in the margin track. They cost nothing, they make long pages navigable in conversation ("scroll to figure three"), and they signal that someone counted. We auto-generate them from document order so renumbering is impossible to get wrong.

## Art-directed pages versus system pages

Here's the governance question disguised as a design question. Every project we take has two kinds of pages:

- **System pages** — archives, docs, listings, profile pages. Produced at volume, changed rarely per instance, they must tolerate any content they're fed. The grid here is a container with constraints: everything in the content column, no exceptions, resilience over expression.
- **Art-directed pages** — the homepage, campaign landers, the quarterly feature. Produced rarely, read by everyone, expected to carry the brand's whole personality. Here the breakout vocabulary is not just allowed but expected: full-bleed media, popout quotes, asymmetric spreads.

Be honest about which pages deserve which treatment, because art direction has a carrying cost: every art-directed page is a bespoke layout that must be re-verified at every viewport when content changes, forever. Our decision rule, stated plainly in kickoffs: a page earns art direction when it scores high on at least two of *traffic*, *longevity*, and *stakes*. The pricing page: high traffic, high stakes — art-directed. Blog post #214: system page, beautifully constrained, shipped.

The unglamorous part is staffing the boundary. We name an "editorial owner" on every engagement — one person (usually the client, post-handover) empowered to say *no, that page is a system page* when someone wants a campaign flourish on the docs homepage. Without that role, art direction spreads like condensation: six months later every page is bespoke, no page is maintained, and the grid is a rumour. This is the same ownership logic behind [analytics governance](/journal/growth/analytics-governance) — the tool isn't the hard part; the named adult is.

## Restraint, budgeted

Restraint fails when it's a vibe. Make it arithmetic. We give each template an explicit *interrupt budget*:

- System pages: **zero breakouts.** Full stop. The grid is the page.
- Feature articles: **one full-bleed moment + up to three popouts** per viewport-scan of the piece (roughly per 1,500 words).
- Art-directed landers: **one breakout per viewport**, which sounds generous until you count — a hero, a night band, a media strip and a closing break is already four, and the page is already loud.

The budget converts taste arguments into counting, which is an argument a team can actually finish. It also protects the reader: restraint is an accessibility property as much as an aesthetic one, since every interruption is a place where attention has to re-acquire the thread — a cost paid disproportionately by tired readers, screen-reader users navigating by structure, and anyone on a phone on a train. The [accessible handoff checklist](/journal/web-design/accessible-design-handoff) covers the mechanics; the budget covers the judgement.

Both our museum-archive project, [Postcards](/work/postcards-museum-archive), and the [Holloway Records](/work/holloway-records-label-site) label site run on versions of this exact budget — Postcards with a near-zero interrupt count (the collection *is* the content; the layout curates by shutting up) and Holloway with the loudest budget we've ever signed off, because for a record label the breaks are the brand.

## Key takeaways

- Implement breakouts with one named-line grid: `content` by default, `popout` and `full` as opt-ins. Three tracks, no more.
- Centre conforms with perception: symmetric popout columns make wide elements read as intended, not escaped.
- Captions, pull quotes and figure numbers are components with contracts — field-length limits, correct semantics, `aria-hidden` on decorative repetition.
- Split the site into system pages (constraint, zero breakouts) and art-directed pages (expression, budgeted breakouts), and assign a human to guard the boundary.
- Give restraint numbers: interrupts per viewport, per template, in writing.
- Art direction carries a maintenance cost at every viewport; spend it where traffic, longevity and stakes justify the bill.

## FAQ

**Doesn't a breakout grid fight CMS-driven content?**
Only if the editor can set it freely. We expose breakout as a *block-level choice in structured content* — an image block has a "layout: inline / popout / full-bleed" option with per-template availability. System templates simply don't offer the option. Editors get expressive power inside the budget and can't accidentally build a ransom note.

**Is this possible without CSS Grid?**
Negative-margin techniques can fake full-bleed inside a centred container, and for years that was the only way. But named lines express *intent* — the markup says "this escapes to popout," and the layout encodes what popout means. Intent-in-markup is what survives redesigns; margin arithmetic doesn't.

**How does the breakout grid coexist with the 12-column editorial grid?**
They're layers, not rivals. The 8/12-column family handles *page composition* — headers, feature splits, card ledgers. The breakout grid handles *long-form flow* — the article river, the case study body. Pages that do both (most marketing pages) compose sections in the 12-column grid and hand each long-form section to the breakout grid internally.

**What happens to breakouts on ultra-wide monitors?**
They stop growing. The measure caps, the popout caps, the page pad fluidly widens to a maximum, and beyond that the page sits centred with generous margins. A full-bleed *image* may extend; a full-bleed *text band* keeps its internal measure. Nobody has ever thanked a designer for a 90ch line.

**How do we keep breakout choices consistent across a multi-author blog?**
Write the interrupt budget into the style guide with two visual examples — one in-budget, one over — and have the editorial owner review at the draft stage, not the publish stage. Conventions enforced at review are culture; conventions enforced by revert are friction. And when images enter the budget calculation, the cropping discipline from our piece on [art-directing images](/journal/web-design/image-art-direction-web) applies — a full-bleed slot is an aspect-ratio contract the CMS must enforce.
