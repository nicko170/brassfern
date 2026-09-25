---
title: "Accessibility starts in the design file"
description: "Most accessibility rework is a design-file problem found too late. The annotations, contrast workflows and focus specs that stop retrofits before they start."
slug: accessible-design-handoff
cluster: web-design
tags:
  - Accessibility
  - Design systems
  - Handoff
  - WCAG
date: 2026-01-27
author: Aiko Tanaka
keywords:
  - accessible design process
  - wcag design
  - design handoff accessibility
  - inclusive design
readingTime: 9
---

There's a moment in every accessibility retrofit where an engineer, squinting at a finished design, asks: "What should focus look like here?" and the room goes quiet. The design doesn't say. The design never said. Focus order, keyboard flow, reading order, alt-text intent, what happens when text is 200% — none of it was specified, so it was improvised, and the improvisation failed the audit.

Here's the uncomfortable arithmetic: in the accessibility remediation projects we've inherited, the overwhelming majority of defects trace back to decisions that were made — or more accurately, not made — in the design phase. The markup inherited the ambiguity. An engineer cannot build a screen reader experience that was never designed any more than they can build a brand that was never art-directed. Accessibility that starts in the code is accessibility arriving two phases late.

This is the handoff practice we run on every project, from brand sites to regulated products like the [Copperline Mutual](/work/copperline-community-bank) rebuild. None of it requires new tooling. All of it requires that designers accept something the industry spent years avoiding: interaction intent is a design deliverable.

## 1. Annotate the experience, not just the screen

Static mockups describe what a screen looks like. They say nothing about how it behaves to someone not using a mouse. Our design files carry a companion layer — a set of numbered annotations, off-canvas, that travel with every component and page:

**Heading structure.** Every heading in the design is labelled with its intended level (H1–H6) or, for genuinely presentational text, marked "not a heading". Designers choose heading levels for visual hierarchy and then the DOM inherits a nonsense outline. Decide levels deliberately; visual size and semantic level can diverge via classes, but someone has to make the call, and the designer knows the content hierarchy best.

**Focus order.** For any screen more complex than a linear document — modals, multi-column layouts, tools, forms with conditional fields — we number the tab order directly on the canvas. It takes ten minutes per screen and eliminates an entire category of bug: the "visually logical, keyboard chaotic" page. If you can't number your own layout's tab order without wincing, the layout has a problem you just found for free.

**Focus appearance.** "The browser default" is not a design decision — it's an abdication that fails contrast requirements on half the backgrounds you designed. We spec a focus ring as a component: colour, offset, thickness, and how it behaves on dark sections. It gets reviewed like any other component, because it is one.

**Live regions and announcements.** When content changes without a page load — a filter applies, a cart updates, a validation error appears — the annotation says what a screen reader should be told and when. "Announces: '12 results, sorted by price, low to high.'" Engineers shouldn't have to invent your product's polite announcements; they will, and they'll be inconsistent.

## 2. Build contrast into the palette, not the checklist

Contrast failures are palette failures wearing a component costume. By the time QA flags "text on tertiary background fails 4.5:1", the wrongness was baked in weeks earlier, in a palette that never documented which combinations were legal.

The fix is a combination matrix, and it's a morning's work: list your text tokens against your background tokens, compute the ratios, and mark every legal pairing in the design system's documentation. "Ink on paper: 14.1:1 — body text, any size. Muted on paper: 4.6:1 — body text, normal weight only. Brass on night: 4.9:1 — large text or UI elements only." We treat this table as binding law, versioned alongside the tokens. When our brand work for [Tallow & Co.](/work/tallow-and-co-providore) needed a heritage gold that failed contrast on cream, the matrix caught it on day one and the brand palette adjusted before it touched a screen — not at audit time.

Two habits make this stick. Test at token time: any new colour enters the system with its legal pairings already written down, or it doesn't enter. And never spec overlays on photography without a documented scrim strategy — "white text on a photo" is not a pairing, it's a coin flip.

## 3. Design the states nobody enjoys designing

Happy-path screens are 20% of a product's states. The rest — empty, loading, error, disabled, zoomed, translated — is where accessibility defects breed, precisely because they were never drawn.

**Zoom and reflow.** WCAG requires content to work at 400% zoom without two-dimensional scrolling. Design a 320px-wide reflow view of any dense screen — tables, dashboards, multi-column forms — and suddenly the "at small widths this becomes…" decisions are made in the design phase, where they belong. Our [Northwind Ledger dashboard](/work/northwind-ledger-dashboard-rebuild) shipped with designed reflow states for every table; the auditors found nothing to flag because nothing had been improvised.

**Errors as designed experiences.** An error state is copy, colour, iconography *and* semantics: the message is programmatically associated with its field, announced to assistive tech, and never communicated by colour alone. If the design file only shows valid inputs, the invalid experience will be invented at 11pm before launch. Draw the failure. Write the words. We covered the brand-voice side of this in [our 404 piece](/journal/web-design/designing-404-pages); the same discipline applies to every form field.

**Reduced motion.** Any screen with animation gets a "motion off" note: what the still equivalent is, what changes, what simply doesn't move. This is part of the [approach](/approach) we demo every Friday — motion that earns its keep, and a complete experience when it's switched off.

## 4. Write image intent, not alt text afterthoughts

Alt text written by an engineer during a build is alt text written by the person furthest from the image's purpose. The designer or content lead knows why the image is there: is it carrying information, setting a mood, or pure decoration? That intent is a one-line annotation per image in the design file: "Decorative — alt empty." "Chart: main point is the 2025 emissions drop; describe trend, not values." "Editorial photo: evoke the workshop, don't inventory it."

This takes minutes and transfers an enormous amount of correctness. It also forces the useful upstream question: if you can't say what the image is *for*, why is it on the page?

## 5. Make it visible in the process

None of this survives if it's invisible. Three process moves keep it alive:

**Accessibility is a review lane.** Every design review includes a pass over the annotation layer, the same way it includes a pass over type and spacing. What gets reviewed gets maintained.

**Handoff means annotated handoff.** A mockup without the accessibility layer is an unfinished deliverable, the same as a mockup without responsive views. Producers schedule for it; our [production practice](/services/product) bakes it into sprint definitions of done.

**Test with the actual tools, early.** One keyboard-only pass and one screen reader pass over the prototyped flow, before build. You are not looking for polish — you're looking for structural impossibilities, the kind that are ten times cheaper to fix in Figma than in the DOM.

## The economics, stated plainly

Fixing a focus-order defect in a design file costs an annotation. Fixing it after release costs a bug ticket, a reproduction, a debate about intended behaviour, a patch, and regression testing across everything adjacent. Industry remediation audits consistently price post-release accessibility fixes at an order of magnitude more than design-phase decisions, before you count the legal exposure or the users who left. Accessible design isn't a constraint on the craft. It *is* the craft, specified properly, once, by the people closest to the intent.

## Key takeaways

- Most accessibility defects are unspecified design decisions inherited by code. Annotate heading levels, focus order, focus appearance and live-region announcements in the design file.
- Publish a contrast matrix of legal token pairings in your design system, and gate new colours on it.
- Design the unglamorous states: 400% zoom reflow, errors, disabled, empty, reduced motion.
- Record image intent ("decorative" vs "informative", and the point of the chart) as a design annotation — alt text quality is decided upstream.
- Give accessibility its own lane in design review, or it will silently decay.

## Frequently asked questions

**Doesn't designing for accessibility limit visual creativity?**
The opposite, in practice. Constraints like a contrast matrix force palettes toward richer, more deliberate combinations, and focus-order thinking routinely exposes layout complexity that should have been simplified anyway. The work that wins design awards and passes audits shares one trait: nothing on the screen is unspecified or accidental.

**When in a project should this start?**
At the design system's birth, or the first component — whichever comes first. Retrofitting annotations onto a finished file is better than nothing, but the real value is structural: palette pairings, reflow behaviour and focus logic are cheapest when the page count is small. Fold it into the first sprint and it never appears on a budget line again.

**Who owns the annotation layer — designers or engineers?**
Designers author it, engineers review it for feasibility, and both sign it off the way they'd sign off responsive behaviour. If your engineers are inventing announcement copy or choosing heading levels seat-of-the-pants during build, that's a design deliverable that failed to ship, not an engineering shortcoming.

**Is automated auditing enough to catch these issues?**
No. Automated tools reliably catch roughly a third of WCAG issues — contrast ratios, missing alt attributes, broken ARIA. They cannot judge whether alt text matches image intent, whether focus order makes sense, or whether an announcement is useful. Those are exactly the issues the design file can settle. Automation is the floor; annotated design intent plus manual testing with real assistive technology is the practice.
