---
title: "Light, dark, light: section banding as rhythm"
description: "How to use alternating light and dark sections as editorial rhythm: surface budgets, seam design, spacing across bands, and fitting a night section into a paper site."
slug: section-banding-rhythm
cluster: web-design
tags:
  - layout
  - colour
  - dark mode
  - editorial design
date: 2026-06-11
author: June Okafor
keywords:
  - dark sections design
  - page rhythm
  - editorial web layout
  - colour surfaces
  - design system layout
readingTime: 9
---

Open any long marketing page and scroll with your thumb hovering, watching only the background. On weak pages, it's one unbroken wash — white from hero to footer, section after section differentiated by nothing but content until your sense of position dissolves. On strong pages, the background itself is doing editorial work: light, light, *dark*, light. The dark band arrives like a chapter break in a good book. You feel where you are.

That's section banding, and it's the cheapest powerful layout tool most teams never systematise. Here's how we think about it — when light/dark alternation earns its place, how many surfaces a page can carry before it becomes a patchwork quilt, and the craft of the seams.

## Why bands work: position and pulse

Scrolling is a time-based experience, and time-based experiences need rhythm to be legible. Music has bars; film has scenes; a long page has sections. But a section defined only by a heading and some whitespace is a weak beat — fine for a document, insufficient for a page that's trying to carry a visitor through an argument.

A surface change is a strong beat. It says, at the perceptual level, *the previous thought is complete; here comes something different in kind*. That's why the strongest use of banding is semantic, not decorative: the dark band holds the pivot of the page — the manifesto, the point of view, the big proof — and the light bands hold the argument around it. Our own site works exactly this way: paper sections carry the exhibits; a single night section carries the position. On a paper-toned site like ours (the full token set lives on our colophon), one dark band in a scroll of warm paper is thunder.

Two rules follow. **Contrast in kind, not degree.** A band should differ from its neighbour enough to change the room — light to dark, not light to slightly-dusted-light. Tints of the same surface read as contamination, not rhythm. **Rarity is the mechanism.** One dark band per page is a statement; five alternating bands are wallpaper with commitment issues.

## The surface budget

How many surface colours can one page carry? Our working rule, tested across a lot of launches: **three, with structural roles.**

1. **The ground** — the default canvas; here it's a warm paper. Carries 60–80% of the page.
2. **The well** — a tint of the ground (our paper-2, paper-3) used for cards, quote blocks and lifted content. It reads as the same room with the furniture moved, and it can appear freely because it never claims to be a new section.
3. **The night** — one inverted surface for the pivot moment. Inverted means genuinely inverted: text, lines, accents and imagery all re-derived for the dark ground, not the light-section components dipped in ink.

The failure pattern is the undocumented fourth: a marketing team's "soft grey" section, someone's tinted testimonial block, a footer in yet another near-black. Each is defensible alone; together they turn the page into a fabric sample book. If you're designing a page that seems to need a fourth surface, the real problem is that your sections aren't differentiated in content — the surfaces are compensating. This is the same argument as [dark mode being a second design system](/journal/web-design/dark-mode-second-design-system): a surface isn't a paint job, it's a parallel set of decisions. Budget them like decisions.

A subtlety worth stating: a *functional* dark region like the footer usually sits outside the budget. Footers are chrome, not content; visitors read them as the back cover of the book. What matters is that the footer never pretends to be a content band — it changes register, structure and density, so nobody confuses it with the argument above it.

## Seams: where bands meet

The junction between two surfaces is where craft shows. Options, in order of how loud they speak:

- **The hard seam.** Surface ends, next surface begins, no border. This is the editorial default — confident, print-like, correct when the colour contrast is high. Between paper and a true dark, a hard seam is a guillotine: clean and final.
- **The hairline.** A 1px keyline at the join. Use between *adjacent* values — paper against a well, or two light tints — where a hard seam would look accidental rather than decisive. Never put a hairline on a high-contrast seam; it's a belt with suspenders, and it whispers "we weren't sure."
- **The bleed break.** A container that floats above both bands — an overlapping card or image that crosses the seam. Powerful for moments of emphasis (a product shot breaking out of the dark band into the light) and correspondingly easy to overuse. One per page, maximum.

Spacing across bands needs its own rule, because the eye reads padding as part of the surface it touches. Our fix: **pad sections, not containers** — vertical padding lives on the band itself and is constant per band type, so every seam has the same rhythm of approach and departure. Asymmetric padding (tight top, loose bottom) makes bands feel like they're leaning on each other.

And the rule that saves the most relaunches: **never band adjacent equal-importance sections.** Banding sandwiches matter — a dark band between two paper bands is a spotlight; a dark band between a dark band and a dark footer is a basement. Count the seams from the top of the page to the footer and read them aloud like a rhythm: da, da, DUM, da. If you can't hear it, neither can the visitor.

## Imagery and type across the band

Content has to be re-thought at the boundary, not just re-coloured.

**Photography**: images shot and graded for light sections — warm backgrounds, soft shadows — often die on dark grounds, where their own baked-in backgrounds become visible boxes. Either shoot/commission imagery with a dark variant in mind, or use imagery with natural containment (cutouts, product on transparent, duotones built from the night palette). Section-aware image variants, served with the band, beat one compromised asset every time. The broader craft is in our piece on [image art direction](/journal/web-design/image-art-direction-web).

**Type and weight**: dark grounds thicken strokes visually. Text that reads perfectly at weight 420 on paper can look bloated and slightly blurry inverted. We typically step body text down a notch in perceived weight on the night band (or nudge tracking open a fraction) — and we increase, not decrease, contrast on muted text, because the "soft grey caption" habit produces illegible murk on dark grounds far more readily than on light. This specific trap gets a full treatment in [colour systems for dark mode](/journal/web-design/colour-systems-dark-mode).

**Accents**: your signature accent colour has two jobs now. Brass on paper and brass on night are different colours perceptually; define a night variant of every accent (ours steps up in lightness and saturation) rather than hoping one value survives both grounds.

## When not to band

Restraint section, because it's due. Don't band when the page is short — under four or five sections, a surface flip reads as indecision. Don't band to rescue weak content hierarchy; if the page needs a dark rectangle to tell visitors what matters, fix the typography and spacing first — [whitespace is the subtler instrument](/journal/web-design/whitespace-as-layout-tool), and it never goes out of tune. Don't band long-form editorial: body text wants one stable surface from first paragraph to last, which is why journal pages stay on paper while [marketing pages get the full grid treatment](/journal/web-design/editorial-grids-web). And never band to look "premium" — that motivation reliably produces the alternating-zebra pages every SaaS template already offers, which is the aesthetic opposite of a decision.

The test we use in critique: cover the content and look at the page as pure surfaces. If the rhythm of bands, wells and seams still communicates where the emphasis lives and how far you've travelled, the banding is doing editorial work. If it's just stripes, paint it back to paper and let the content carry the beat.

## Key takeaways

- A surface change is a structural beat, not decoration: reserve strong bands for the page's pivot, and keep them rare — one per page is a statement.
- Three surfaces per page, with roles: the ground, the well (a tint for lifted content), and one genuinely inverted night. Treat footers as chrome, not content.
- Seams speak: hard seam for high contrast, hairline only between adjacent values, bleed breaks once a page at most. Pad bands, not containers, so every seam keeps the same rhythm.
- Re-derive type weight, muted-text contrast, imagery and accent variants for the dark ground — inversion is a parallel design, not a filter.
- Short pages, long reads and weak hierarchies are all reasons *not* to band.

## FAQ

**How many dark sections is too many?**
More than two on a single page, in almost every case. Beyond that, dark stops meaning "the important bit" and starts meaning "the template." If two candidates compete for the night band, choose the one closer to the page's decision moment and demote the other to a well.

**Should section banding respond to the visitor's dark-mode preference?**
No — bands are authored rhythm, like a print layout. A visitor's dark preference governs the page's *ground*, not which sections are emphasised. In a full dark mode, the night band still inverts relative to that ground (it becomes the light moment), which is exactly the parallel-design argument above.

**What contrast ratio should separate a ground from a well?**
Enough to be unambiguous at a glance — a value step of roughly 6–10% relative luminance works on paper-toned palettes — and always pair it with a hairline or shadow so the boundary is legible for low-vision visitors too.

**Do bands affect accessibility audits?**
Only favourably, if done right: every band must independently pass contrast for its own text/background pair. The seam itself carries no contrast requirement. Automated checkers test elements, not joins — so inverted bands rarely add findings, but inverted *muted text* absolutely does.
