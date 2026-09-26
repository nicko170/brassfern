---
title: "Pull quotes and margin notes: editorial devices for the web"
description: "Pull quotes, asides and margin notes give long-form pages their editorial pulse. Here's the markup, the responsive behaviour and the restraint they demand."
slug: pull-quotes-editorial-devices
cluster: web-design
tags: [editorial design, typography, long-form design, pull quotes]
date: 2026-05-02
author: Leonie Marsh
keywords: [pull quotes, editorial web design, typographic details, article design, margin notes]
readingTime: 8
---

Print magazines solved a problem the web still fumbles: how to give a 2,500-word article a rhythm that lets a skimmer become a reader, and a reader pause to breathe. The devices they used — pull quotes, margin notes, asides, kickers — all exist on the web now, technically. What survives is the ones built with their semantics intact and their ego in check. Most aren't.

This is how we build editorial devices that survive responsive design, screen readers and rebrands.

## Know what each device is *for*

The failure mode is decoration: devices dropped in because the page looked grey. Each editorial device earns its place by doing a specific job:

- **Pull quotes** create a second reading path. A scanner should be able to read the headline, the subheads and the pull quotes and reconstruct the argument. They are signposts, not emphasis.
- **Margin notes** hold the parenthetical thought — the aside that would derail a paragraph but rewards a curious reader. Definitions, caveats, the "actually, one exception" footnote of good writing.
- **Asides and wells** hold content with a different epistemic status: worked examples, code, warnings, the "how we know this" sidebar. They say *this is still on-topic, but it's a different kind of thing*.
- **Crossheads** (the little subheadings inside a long section) are chunking, not decoration. Every 300–400 words of prose deserves one.

The test we use in review: delete the device. If the article loses nothing, the device was furniture. Cut it.

## The pull quote: markup and manners

The canonical mistake is duplication without disclosure. A pull quote repeats text the screen reader user has already read, or will read, in the flow. If you render it as an ordinary element, assistive technology announces it twice — once in flow, once standing on the page's elbow.

The pattern that works:

```html
<aside class="pull" aria-hidden="true">
  <p>“A scanner should be able to reconstruct the argument.”</p>
</aside>
```

It's an `<aside>` because it's complementary to the surrounding content, and `aria-hidden="true"` because it *repeats* it. The `aria-hidden` is the whole point: the quote already exists in the running text, where the reading order is correct.

For styling, this site's own pages use the pattern you'll see in our [case study design article](/journal/web-design/case-study-page-design): the pull quote sits at 140–160% of body size, set in the display face, with a short rule or glyph above it — never centred, never in a tinted box. Centred pull quotes are a newspaper convention the web inherited without the column width that made them work; at 65ch of prose, a centred quote reads as a mistake.

One more rule: the pull quote belongs *near* the paragraph it quotes — within about a viewport of it — and after it on the reading path, so it works as a reward, not a spoiler.

## Margin notes that survive 375px

A margin note needs a margin. On wide screens, that's the breakout column — the same technique that makes [editorial grids](/journal/web-design/editorial-grids-web) feel like print. A note at roughly 60% of body size, mono or the companion sans, sitting in the gutter, optically aligned with the line it annotates.

Below the breakpoint where the gutter disappears, you have three honest options:

1. **Inline it.** The note becomes a parenthetical sentence or a small indented paragraph, in flow. Simplest, and usually right — a note that can't survive being demoted to a small paragraph probably wasn't carrying enough weight.
2. **Footnote it.** A superscript reference, a jump link to a footnotes section, and a `↩` back-link. Right for citations and genuinely optional detail. Wrong for anything the reader needs mid-thought.
3. **Toggle it.** A `details` element or a small "note" affordance that expands in place. Right for technical tangents; seductive enough to overuse. If your article has six expandable notes, you have a second article hiding inside the first.

What you never do: keep the note floating off-viewport, or shove it into a tooltip. Tooltips for content are an accessibility failure and a reading failure at once.

```html
<aside class="margin-note">
  <p><span class="margin-note__mark">*</span>
     We tested footnotes vs inline notes on three editorial clients;
     inline won on completion, footnotes on trust. Picked per article.
  </p>
</aside>
```

At the wide breakpoint it gets `position` into the gutter via grid; at narrow it becomes a hairline-left small paragraph. Two presentations, one source, correct reading order either way.

## Asides, wells and the status of content

The most useful editorial device on technical content is the well: the tinted or ruled block that holds a worked example, a config, a warning. Its power comes entirely from consistency. Readers learn your visual grammar in about two articles — if a ruled box sometimes means "example" and sometimes means "opinion" and sometimes means "advertisement", you've taught them nothing, and [related-content modules](/journal/web-design/related-content-modules) start getting ignored because they look like asides.

Our convention, kept across every long-form surface:

- **Ruled top, no fill** — example or case note ("Hearthbrew Coffee did this…")
- **Tinted well** — warning or prerequisite
- **Outlined box with mono label** — worked code or data

Three statuses. That's the whole vocabulary. The moment you add a fourth visual treatment, audit whether you have a fourth *kind* of content or just a bored designer.

## Restraint as a system rule

Editorial devices compound. One pull quote per 600–800 words feels edited; three feels like a magazine that doesn't trust its own prose. The budgets we hold:

- Pull quotes: one per ~700 words, max.
- Margin notes: two per article, and never adjacent to a pull quote — two interruptions on screen at once reads as visual shouting.
- Wells: as many as the content genuinely varies in status. This is the one device whose count is content-driven, not style-driven.
- Crossheads: non-negotiable, no maximum. Chunk until the structure is visible from the scrollbar.

And the meta-rule: these devices must degrade gracefully. Someone printing the article (yes, [people still print](/journal/web-design/print-stylesheets-still-matter)), reading in an RSS client, or hitting reader mode should lose nothing. Pull quotes vanish without harm (they were `aria-hidden` echoes anyway); margin notes stay in flow; wells keep their labels. If your device breaks reading order in reader mode, it was layered on top of the content instead of written into it.

The same fluidity applies to type sizing — pull quotes on a [fluid type scale](/journal/web-design/fluid-type-scales-in-practice) should interpolate with the body, not jump at breakpoints.

## Key takeaways

- Every editorial device has a job: pull quotes build a scanning path, margin notes hold asides, wells mark content of a different status. Decoration is not a job.
- Pull quotes duplicate flow text, so mark them `aria-hidden` and place them near — and after — the paragraph they quote.
- Margin notes need a fall-back story for small screens: inline, footnote or toggle, chosen per note by how essential it is.
- Reader mode, print and RSS are your honesty tests. A device that breaks them was pasted on, not designed.
- Budget your devices. One pull quote per ~700 words; two interruptions never share a screen.

## FAQ

**Should pull quotes be real quotes from the text, or can we write them separately?**
Real, verbatim sentences from the body. A "pull quote" that appears nowhere in the text is a subhead wearing costume — and when `aria-hidden` hides it from screen readers, as it should, that content never reaches those readers at all.

**Do pull quotes hurt readability because of duplication?**
The research is muddier than the dogma. Duplication costs some readers a beat; the scanning path it creates gains more readers than it costs. What reliably hurts is a pull quote placed so far from its source paragraph that both read as orphans.

**What about drop caps?**
Charming, expensive, and fragile across browsers' differing `initial-letter` support. We use them only on pieces that are explicitly ceremonial — anniversary posts, manifestos. A device reserved for special occasions means more than one worn daily.

**How do editorial devices work inside a CMS?**
As blocks with names that describe function, not appearance: "callout — example", "callout — warning", "pull quote". The moment your CMS blocks are named "yellow box", the vocabulary collapses and so does the consistency.
