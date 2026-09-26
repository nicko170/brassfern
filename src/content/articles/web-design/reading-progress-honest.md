---
title: "Reading progress indicators: craft or clutter?"
description: "The reading progress bar is the most faked detail on the web. The honest version: when long-form needs one, how to build it without jank or lies, when to skip it."
slug: reading-progress-honest
cluster: web-design
tags: [motion design, micro-interactions, ux patterns, performance]
date: 2026-08-21
author: Felix Brandt
keywords: [reading progress bar, scroll indicator ux, micro-interaction design, motion restraint, web design details]
readingTime: 9
---

The reading progress indicator is the small bar, ring, or percentage that fills as you scroll through an article. It is also, measured across the web, one of the most frequently faked details in interface design: bars that reach 100% two paragraphs early because they measure the viewport instead of the article, percentages that jump in chunks because someone debounced too hard, animations that stutter on the exact long pages they were built to serve.

None of this is an argument against the pattern. It's an argument that the pattern is small enough to do properly, and that doing it properly is a useful test of a studio's instincts — the same test we apply in our piece on [micro-interactions, fine versus expensive-feeling](/journal/web-design/microinteractions-that-matter). Here's where we land after building, measuring, and occasionally deleting these things.

## What the indicator is actually for

Before pixels, the job description. A reading progress indicator does one defensible thing: it answers "how much of this is left?" for a reader deciding whether to continue. That's a real question on long-form content. Committing to a 3,000-word piece is a small contract, and an honest progress signal lowers the perceived risk of signing it.

Everything else people claim for the pattern is decoration wearing a business case. It does not meaningfully increase time on page (readers finish articles they're interested in). It does not help SEO. It does not "gamify" reading, whatever the 2016 blog posts said. If you can't articulate the job as "helping one reader make one decision", the indicator is jewellery, and jewellery has to justify its weight some other way.

Which leads to the first real rule: **if the content doesn't need the decision made, delete the indicator.** Short articles under about four minutes of reading don't need a progress bar; the scroll thumb already answers the question. Landing pages never need one. Case studies under a thousand words, never. The indicator earns its place on long reads — precisely the pages where being wrong costs the reader the most time.

## Honesty requirements: measuring the right thing

The most common implementation bug is measuring the wrong distance. `scrollY / (documentHeight - viewportHeight)` measures the whole page — header, footer, related-content modules, the lot. On a typical article template that means the bar hits 100% when the reader is at 80% of the actual text, because the last fifth of the page is furniture. Congratulations: you've built a liar.

An honest progress indicator measures the article body:

1. Find the prose container's top and bottom in document coordinates.
2. Progress = how far the bottom of the viewport has travelled from the article's first line to its last, clamped to 0–1.
3. Recalculate on resize — font loading and image reflow move the article's bottom, and your measurement must follow.

The second honesty requirement is resolution. A bar that updates four times a second in visible chunks feels cheap in a way readers can't name but can feel. Scroll-linked position should update every frame the scroll position changes. Which raises the performance question.

## Building it without jank

Scroll-linked effects are where good intentions go to drop frames. The rules we hold to, in increasing order of importance:

**Transform-only.** The bar animates with `transform: scaleX()` on a fixed element with `transform-origin: left`. Never `width` — width changes trigger layout, and layout on every scroll frame is how you get a 2-pixel bar that costs 12ms a frame. This is animation-engineering table stakes; the full discipline is in our piece on [shipping motion at 60fps](/journal/engineering/animation-engineering-60fps).

**rAF, not scroll handlers doing work.** Listen to scroll (passive), set a flag, and do the one layout read and one transform write inside a `requestAnimationFrame` callback. Reads and writes batched, one per frame. The handler itself should be nearly free.

**Passive listeners only.** A non-passive scroll listener on the document is a main-thread tax on every scroll gesture, and it's the kind of tax that breaks [bundle and performance budgets](/journal/engineering/core-web-vitals-field-guide) in ways that show up as INP regressions months later.

**Fixed, slim, and quiet.** Two pixels tall, pinned under or fused with the header, in an accent colour that doesn't compete with links. Ours is a brass gradient on the top edge — visible when you glance, invisible when you read. If a reader's eye is being pulled to the bar mid-paragraph, the bar is too loud.

## Reduced motion and other accessibility terms

The indicator has an accessibility profile, and it's mostly solvable:

- **`prefers-reduced-motion`** doesn't mean "no progress" — position changes aren't vestibular triggers the way animation is. But it does mean kill any smoothing or easing on the fill, and absolutely no pulsing, glowing, or percentage tickers. Static mapping of scroll to position is fine; animated flourishes are not. Same principle from [motion that earns its keep](/journal/web-design/motion-that-earns-its-keep): motion is a tool for understanding, not a texture.
- **It's decoration to assistive technology.** The bar should be `aria-hidden="true"` and carry no keyboard focus. Screen readers already have document position ("25% down the page") built in; duplicating it in the a11y tree is noise.
- **Contrast honesty.** The bar is exempt from contrast requirements precisely because it's non-essential — but if your design *needs* the bar to read clearly, it stops being decorative and starts being content, at which point 3:1 against its background is the floor. Decide which one it is and be consistent.

## The variants, judged

**The top bar.** Slim, horizontal, full-width, transform-driven. The right answer for most long-form pages. Cheap, honest, familiar.

**The circular ring around a back-to-top button.** Cute on paper. In practice it spends most of the article invisible (rings are illegible at small fills), combines two jobs awkwardly, and the button it decorates is usually redundant — the home gesture exists on every device. We've retired this pattern everywhere.

**The percentage readout.** "47%" is false precision dressed as data. Nobody has ever made a reading decision at the granularity of single percentage points, and the number ticking as you scroll is motion noise. If you must quantify, do it before reading starts — "9 min read" is a far better promise than a live counter, and reading time honesty is its own craft, covered in our notes on [perceived performance as a design material](/journal/web-design/perceived-performance-design).

**The section pips.** A dot per chapter that fills in sequence. Genuinely useful on very long structured documents — annual reports, documentation, [scrollytelling pieces](/journal/web-design/scrollytelling-without-traps) — because the pips carry *structure* (how many parts, which one am I in), not just quantity. Overkill and mostly illegible on a standard essay.

## The measurement loop

We treat the indicator like any other surface: it has to justify its existence with signal, not vibes. Two diagnostics we run on long-read templates:

- **Completion correlation.** Segment readers by whether they scrolled past 50%. If the progress bar's presence (A/B it) nudges completion among that group on long pieces, it's doing its one job. In the few honest tests we've run, the effect is small but real on 8+ minute reads and nonexistent under 5.
- **Rage-scroll detection.** Fast, violent scrolling with immediate exits near the top of articles suggests the indicator promised something the piece didn't deliver — a mismatch between the implied contract and the content. That finding goes to the editorial team, not the design system.

And the kill criterion, which we've exercised: if a template's pieces are mostly under four minutes, the indicator simply doesn't ship. Deleting it has never once hurt a metric. It has always improved the page's honesty budget — one fewer element saying "look at me" on a page whose entire purpose is the opposite.

## Key takeaways

- The job is singular: answer "how much is left?" for a reader deciding whether to commit. Anything else is jewellery.
- Measure the article body, not the document — a bar that completes early is a liar with good easing.
- Transform-only, rAF-driven, passive listeners: a 2px bar has no right to dropped frames.
- Reduced motion means no flourishes, not no indicator; keep it out of the a11y tree.
- Skip the percentage counter and the scroll-ring; ship a slim top bar or, on structured epics, section pips.
- Under four minutes of reading, the scroll thumb already does the job. Delete the bar.

## Frequently asked questions

**Should the progress bar sit above or below the header?**

Fused with it. A detached line floating in the article's whitespace reads as a stray design element; a bar bound to the header's bottom edge reads as part of the chrome, which is what it is. On pages with a fixed header, the bar lives on the header's underside and inherits its elevation.

**Does scroll progress tracking have privacy implications?**

If you send it to analytics, yes — scroll depth is behavioural data and belongs in your consent story. The indicator itself is local and free; instrumenting it is a governance decision, and we've written about [third-party script governance](/journal/engineering/third-party-script-governance) for exactly this class of quiet creep.

**What about reading progress across sessions — "resume where you left off"?**

A different pattern with a different honesty burden. For a single article, resume features mostly get in the way (the reader who returns three days later has context to rebuild, not a scroll position). They shine on book-length or multi-chapter content. Don't bolt a resume feature onto your blog because a progress bar made you ambitious.

**Mobile: top bar or nothing?**

Top bar, same rules. The mobile scroll thumb is nearly invisible in most browsers, which actually strengthens the case for a slim top indicator on long reads — the reader's one other position cue is gone. Keep it 2px, keep it transform-only, and test it on a mid-range Android before you call it done.
