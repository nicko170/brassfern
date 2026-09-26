---
title: "Pull quotes and margin notes: editorial devices for the web"
description: "Pull quotes, asides and margin notes give long reads their rhythm. The semantic markup, the responsive survival tactics, and the restraint that keeps them editorial."
slug: pull-quotes-editorial-devices
cluster: web-design
tags:
  - Editorial design
  - Typography
  - Accessibility
  - Layout
date: 2025-09-10
author: June Okafor
keywords:
  - pull quotes
  - editorial web design
  - typographic details
  - article design
readingTime: 9
---

Open any magazine you love and notice how your eye actually moves. You don't read top to bottom. You land on a pull quote, drift to a margin note, catch a caption, and only then commit to the paragraphs. Editorial designers have understood this for a century: long text needs *waypoints* — moments of emphasis, detour and rest that let a reader navigate a 2,000-word piece the way a walker navigates a trail. The web mostly gave up on this. Our articles are walls of paragraphs with the occasional hero image, and then we wonder why average reading time is eleven seconds.

So this is a field guide to three editorial devices — pull quotes, asides and margin notes — and how to make them survive the web: the semantic markup, the responsive behaviour, and, most important, the restraint. Because the same devices that give a page rhythm can flatten it into noise if you use them like confetti. Everything here sits on top of the grid thinking in [editorial grids on the web](/journal/web-design/editorial-grids-web); the devices are the furniture, the grid is the room.

## Pull quotes: the waypoint that must not lie

A pull quote is a sentence lifted from the text and set large, ahead of or beside the passage it came from. Its real job is not decoration. It's a promise to the scanning reader: there is substance here, and this is its flavour. Which is why the first rule is **the quote must actually be in the article**. Pull quotes written by the editor that appear nowhere in the text — a depressingly common CMS workaround — are clickbait in display type. When the reader goes looking for the context and can't find it, you've spent trust you can't afford.

The selection rules we use:

- **Pull the sentence with the strongest claim, not the prettiest words.** A pull quote should make a reader argue with it. Pick the opinion, the number, or the admission — the sentence where the writer's neck extends furthest.
- **One per screen-ish.** As a working ratio, one pull quote per 600–800 words of body copy. More than that and the reader starts experiencing the article as a series of interruptions.
- **Never the conclusion.** The closing thought is earned in sequence. Teasing it early as a pull quote collapses the article's argument into its spoiler.

Placement matters as much as selection. The quote should sit *after* its source paragraph in reading order, close enough to be recognised (a screen-length away at most), so it works as an echo, not a premonition. On this site, pull styling lives inside `.prose` — a hairline brass rule, display type a few steps up the [fluid scale](/journal/web-design/fluid-type-scales-in-practice), and an italic when the voice wants one. The device should feel like the article raising its voice for one sentence, not a poster pasted onto it.

### The screen-reader problem — and the honest fix

Here is the thing most pull-quote implementations get wrong: a pull quote is *duplicated content*. It exists in the body text and again in display type. Sighted readers understand the duplication instantly; screen-reader users hear the sentence twice with no explanation. The semantically honest pattern:

```html
<p>…the sentence as it appears in the body text…</p>
<aside class="prose__pull" aria-hidden="true">
  <p>the sentence as it appears in the body text</p>
</aside>
```

An `aside` marked `aria-hidden="true"` carries the visual emphasis while assistive technology meets the sentence once, in context, where it belongs. What you must not do is wrap the *body* instance in a `<blockquote>` and style it big — that isn't a quote of the article, it *is* the article, and you've just told assistive tech the main content quotes itself. We've written about this broader habit of letting visual intent override document semantics in [accessible design handoff](/journal/web-design/accessible-design-handoff); the pull quote is the smallest possible case study.

## Asides: the detour that earns its exit

An aside is a short block that steps out of the main argument — a definition, a war story, a worked example, a warning. In print it's the sidebar; on the web it's usually a tinted card. Its value is pacing: it lets the writer serve two readers at once, the one who needs the detour and the one who's already up to speed.

The craft rules:

- **Make skipping safe.** Open with a label that tells the reader exactly what they're skipping: "Example:", "Why this matters:", "The exception:". A reader who can predict the detour's contents will forgive it; one who can't will skim everything.
- **Keep it short.** Two to four sentences, one idea. An aside that grows past that is a section in costume — promote it to a real heading and let the [table of contents](/journal) carry it.
- **Style it quieter than you want to.** A common failure is the aside that shouts louder than the body: saturated backgrounds, borders, icons. The aside is a secondary voice — set it in the same type family, nudge the measure in, tint the well with the palest version of the palette's paper tones, and let the label do the work. On dark sections, invert quietly.
- **Semantically, `<aside>` means what it says.** If the content is tangential to the article, it's an aside. If it's required reading for the argument, it's a paragraph. That distinction is accessibility information, not trivia — screen readers announce landmarks and roles, and a consequential detour announced as complementary content misleads precisely the readers navigating by structure.

## Margin notes: the hard one, so do it properly

True margin notes — Tufte-style, sitting in the outside column beside the passage they annotate — are the device the web does worst, because they need horizontal room most viewports don't have. But they're worth fighting for on long reads, because they let a text carry footnotes, sources and small jokes without breaking stride. We used them for source annotations in the [Signal & Noise publication build](/work/signal-and-noise-podcast-network), where episode credits and research citations needed to live beside essays without hijacking them.

The implementation that respects both the reader and the layout:

**At wide viewports** (roughly 1100px and up, with a content column of 65–70 characters), the note sits in the outside margin, optically aligned to the line it references. Grid makes this almost civilised: a three-column layout where the margin column is empty until a note intrudes. Keep the note small — a step down the type scale, muted ink, a left rule in the palette's quietest accent.

**At narrow viewports** the notes collapse inline, in place, as revealed content: a superscript marker the reader can tap to expand the note between paragraphs. The marker makes the note optional rather than missing — hidden content with a visible handle is honest; content that simply vanishes below a breakpoint is not.

**In the markup**, the note is a `<span role="note">` or a small `<aside>` placed immediately after its anchor sentence in source order — never floated from a distant position, because source order is what screen readers and reader modes actually read. Reader-mode compatibility is a free test: open the article in Safari Reader and if your notes appear in a sensible place, your document order is sound.

One pragmatic limit: margin notes don't survive articles that will be syndicated, emailed or CMS-round-tripped through systems that strip layout. If the text has to travel, use footnotes instead — footnotes are the margin note's portable form.

## Restraint: the rule that governs all of it

Every device in this article is a volume knob, and the failure mode of all of them is the same: amplification everywhere. A page with three pull quotes, five asides and a margin full of notes has no rhythm — it has a strobe. The reader can't tell what matters because everything is insisting.

The discipline we teach in the studio's Thursday critique:

1. **One device per type of emphasis, one emphasis per few hundred words.** Map them: pull quotes mark the argument's peaks, asides carry detours, margin notes carry sources. If two devices compete for the same job, cut one.
2. **The body must win.** At any scroll position, the plain paragraphs should still be the majority of what you see. Devices are seasoning. Nobody orders a bowl of seasoning.
3. **Reader mode is the audit.** Strip the CSS — via reader mode or a quick stylesheet toggle — and read what remains. If the article still flows, your devices were *additions*. If it falls apart, they were scaffolding, and you've abused them.
4. **Measure honestly.** Scroll depth and engaged time on long reads respond to waypoints — on our own long pieces, adding disciplined pull quotes and asides moved median scroll depth from roughly 40% to the mid-60s (in-house analytics; your mileage will vary). But the metric to watch isn't interaction with the devices; it's whether more readers reach the end. Furniture exists to serve the reading, never to harvest attention for itself.

The magazine editors who invented these devices had a harder constraint than we do: theirs were permanent. Ours reflow, adapt and collapse, which is a superpower — the same article can be a quiet column on a phone and an annotated broadsheet on a desktop. Treat that not as license to decorate every state, but as an obligation to make each state's few emphases earn their place. That's the whole game: rhythm without noise, emphasis without shouting, and a reader who reaches the end without ever noticing the machinery that carried them there.

## Key takeaways

- Long articles need waypoints. Pull quotes, asides and margin notes are navigation aids for readers, not decoration for designers.
- Pull quotes must come verbatim from the text, sit after their source paragraph, and make a claim worth arguing with. One per 600–800 words.
- Pull quotes are duplicated content — render them in an `aria-hidden` aside so screen readers meet the sentence once, in context.
- Asides must be safe to skip: explicit labels, one idea, quieter styling than the body, and genuine tangents only.
- Margin notes need a responsive plan: outside column on wide screens, collapsible inline markers on narrow ones, correct source order always. If the text must travel, use footnotes.
- Restraint is the system: one device per emphasis type, body text always in the majority, reader-mode as the audit, and scroll depth as the honest metric.

## Frequently asked questions

**Don't pull quotes hurt accessibility because they're duplicated text?**
They can, and often do — the raw duplication means screen-reader users hear the sentence twice without context. The fix is mechanical and cheap: the styled pull quote lives in an `aria-hidden="true"` aside, so assistive technology encounters the sentence only in its body-text position while sighted readers get the emphasis. You get the editorial effect without the double-reading.

**Should pull quotes link to the section they quote?**
No — a pull quote isn't a navigation element, and wrapping it in an anchor both pollutes the link sequence for keyboard users and sets an expectation of *going somewhere* that a same-page echo can't honour. If you want linkable highlights, that's what heading anchors are for.

**Blockquote, aside, figure — which element for which device?**
Rule of thumb: `<blockquote>` when the words come from *outside* the article (a citation, a testimonial), an `<aside>` when they're a detour or restatement of the article itself (pull quotes, sidebars), `<figure>` when the device is media plus caption. The choice is semantic information for assistive tech and search engines, not just styling hooks.

**Do these devices work in CMS-powered editorial platforms?**
Better than anywhere — but only if the CMS models them as first-class block types (pull quote, aside, note) rather than asking editors to hand-style paragraphs. When the devices are structured fields, you can enforce the discipline at the input: word limits on asides, source-verification on pull quotes, automatic responsive behaviour on notes. It's the same argument as design tokens: make the system the easy path.

**How many devices is too many?**
Our working ceiling: one device roughly every two screens of reading — a 1,500-word piece can carry two pull quotes, one aside and a handful of margin notes comfortably. Past that, each new device devalues the ones already there. When in doubt, cut the weakest one and read the piece aloud; the rhythm will tell you.
