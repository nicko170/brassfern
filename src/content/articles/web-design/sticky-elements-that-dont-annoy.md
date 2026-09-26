---
title: "Sticky elements that don't annoy anyone"
description: "Sticky headers, bars and CTAs must pay rent for the viewport they occupy. Height budgets, scroll-directional chrome, and the focus traps behind sticky UI."
slug: sticky-elements-that-dont-annoy
cluster: web-design
tags: [sticky ui, navigation, interaction design, accessibility]
date: 2026-03-09
author: Aiko Tanaka
keywords: [sticky header design, sticky ui patterns, scroll navigation ux, sticky cta design]
readingTime: 8
---

Every sticky element on a page is a tenant. It occupies the most valuable real estate the user has — the viewport, on a phone maybe 640 CSS pixels tall before the browser chrome eats its share — and it stays there whether or not it's still useful. Good tenants pay rent every second they're in residence. Bad ones are the colleague's marketing pop-up that moved in three quarters ago and now nobody remembers approving.

The question is never "should the header be sticky?" It's "what does this element contribute on the five-hundredth pixel of scrolling, and is that worth what it costs?"

## The rent rule

Write down the rent, in pixels. A sticky header of 64px on a 667px-tall phone viewport — after iOS Safari's bars — consumes roughly 12% of the user's reading window for the entire session. A sticky header plus a sticky promo bar plus a cookie banner plus a chat bubble can easily kill a third of the screen. We've audited pages where the article on a "content-led growth" site got less than half the viewport. The content team wondered why scroll depth was low.

So the first discipline is a budget. Ours for marketing sites: one sticky element, maximum 72px tall including borders and shadows, and anything that wants to join it has to displace it or justify itself to a sceptical room. Product tools get more latitude — a data grid header row genuinely pays rent all day — but the arithmetic is the same.

This is also why we treat sticky as a motion decision, not just a layout one. An element that detaches, gains a shadow and shrinks on scroll is choreography. The same discipline we describe in [motion that earns its keep](/journal/web-design/motion-that-earns-its-keep) applies: if the transition doesn't communicate something (you've left the top; context is now compressed), cut it.

## Scroll-directional chrome

The most respectful pattern for a sticky header is the scroll-directional one: visible when you arrive, slides away as you scroll down (you're reading; get out of the way), slides back the moment you scroll up (you're navigating; here I am). It's the pattern browsers themselves taught a generation of mobile users, and it maps to two distinct intentions better than persistence does.

Three implementation notes, because the details are where this pattern either feels like quality or feels like a seizure:

1. **Hysteresis.** Don't toggle on a single pixel of direction change. Require 8–12px of sustained movement in a direction before acting, and ignore everything within the first ~100px from the top of the document, where rubber-banding lives. Without this, iOS overscroll flicks the header in and out like a faulty fluorescent tube.
2. **Never move it while focus is inside it.** If someone has tabbed into the header nav and it slides away because their screen reader scrolled the page, you have lost their focus to the void. Check `document.activeElement` and stay put.
3. **Reserve the space when it's `position: fixed`.** Transforming a fixed header in and out doesn't reflow the page — good — but a header that *becomes* fixed after a scroll threshold (`position: sticky` with an offset, or a class toggle on scroll) will make the content jump unless the placeholder stays. Jump is worse than absence. Jump breaks reading position, clicks mid-flight, and trust.

## Sentinels, not scroll listeners

The engineering underneath matters to the feel. A scroll handler doing geometry maths at 60Hz is how you get dropped frames and a phone that's warm in the reader's hand. The modern pattern is an `IntersectionObserver` watching a zero-height sentinel element placed exactly where the sticky behaviour should change:

```js
const sentinel = document.querySelector('#header-sentinel');
const header = document.querySelector('.site-head');

new IntersectionObserver(
  ([entry]) => header.classList.toggle('is-stuck', !entry.isIntersecting),
  { rootMargin: '0px 0px 0px 0px' }
).observe(sentinel);
```

No scroll math, no rAF loops, and the state change is a class — which means the visual transition lives in CSS, where `prefers-reduced-motion` can dissolve it to an instant cut. The same sentinel trick powers sticky table headers, "you are here" chapter navigation in long articles, and the point where a back-to-top affordance is allowed to appear.

## Sticky is a family, not a pattern

Header bars are just the loudest relatives. The quieter ones often pay better rent:

- **Sticky table headers.** The single kindest thing you can do for a long comparison table or data grid. `position: sticky` on `th` cells, a background that fully covers scrolled content, a hairline shadow once stuck. We go deep on the semantics in [data tables for people who live in them](/journal/product/data-dense-tables-ux).
- **Sticky filter rails.** On a PLP or search results view, keeping the active filters visible while the results scroll is worth real money — changing a facet without scrolling back up is the whole interaction. Budget the rail's own internal scroll so tall filter sets don't trap wheel events.
- **Sticky section labels.** The chapter marker that updates as you move down a long page quietly replaces a progress bar. Keep it small enough that it reads as annotation, not chrome.
- **Sticky CTAs.** The most abused and occasionally the most lucrative. A slim buy bar that appears *only after* the PDP's purchase section has scrolled out of view is genuinely helpful — it means "add to cart" is always one tap away on a 2,000-word product page without sitting on top of the photography. The rule: it appears to replace a control that left, not to nag. On smaller screens make sure it respects the one-thumb ergonomics we lay out in [PDP design](/journal/ecommerce/pdp-design-conversion).

## The accessibility footguns

Sticky elements cause a specific, sneaky class of accessibility failure, and most of it never shows up in a Lighthouse run.

**Anchor links vanish underneath.** A page jump to `#pricing` scrolls the heading to y=0 in the document — which is underneath your 72px fixed header. The fix is one line per target, or globally: `scroll-padding-top: 88px` on the scrolling root, or `scroll-margin-top` on the targets. If you ship a sticky header without this, every table of contents and footnote link is broken in a way sighted mouse users never notice.

**Focused controls hide under the chrome.** Keyboard and screen-reader users move focus to elements the browser then scrolls into view — possibly behind the header. `scroll-padding-top` fixes this too, which is why it belongs in the base stylesheet, not the component. Our [keyboard-first interfaces](/journal/engineering/keyboard-first-interfaces) piece covers the broader region model sticky chrome must not break.

**Zoom collapses the budget.** At 200–400% zoom, a 72px header is effectively 144–288px of viewport. WCAG's reflow criterion means you should sanity-check sticky elements at 400% zoom and be prepared to un-stick below a height threshold: `@media (max-height: 420px) { .site-head { position: static; } }`. Landscape phones thank you too.

**Stacking order rot.** The header works, then someone adds a drawer, then a modal, then a cookie bar, and one Tuesday the "Buy" button floats over the checkout overlay. Manage z-indices as named token layers — base, sticky, overlay, modal, toast — not as a bidding war of `z-index: 9999`.

## A field guide to common offenders

Since criticism is cheaper than pattern libraries, here's what we un-stick on nearly every engagement:

- **The double stack.** Promo bar above header, both sticky. Pick one; the countdown to a sale that ends every Sunday is not load-bearing.
- **The newsletter bar that follows you down an article about trusting the brand.** Enough said.
- **The chat bubble occluding the cart button on mobile.** If your support widget covers a conversion control at 375px, your support costs are paying for themselves in the worst way.
- **Sticky social share rails.** Nobody has ever shared an article because a button hovered at mid-viewport. They share because the paragraph was good.
- **Sticky video.** A video that shrinks to a corner player as you scroll says "we'd rather you watched than read." Respect the reader's choice to read.

## The decision test

Before anything gets `position: sticky`, it answers three questions in a design crit:

1. What job does this do at scroll depth 50% that it couldn't do from the top?
2. What would we remove from it to get under the height budget?
3. What breaks for keyboard, zoom and reduced-motion users when it's persistent?

If the answers are thin, the element goes back to being in flow — which, most of the time, is exactly what a footer, hero or buy section was designed to handle. And if you're rebuilding the whole [marketing site](/services/websites) anyway, sticky behaviour belongs in the design system with tokens, budgets and reduced-motion fallbacks, not sprinkled per page by whoever was in a hurry.

## Key takeaways

- Sticky elements pay rent in viewport pixels; budget one, under 72px, on marketing sites.
- Scroll-directional hide/show beats persistence for headers — with hysteresis, top-of-page immunity and focus protection.
- Drive state changes with `IntersectionObserver` sentinels; keep all visual transitions in CSS.
- `scroll-padding-top` is not optional once anything is sticky: anchor links and focused controls depend on it.
- Test sticky chrome at 400% zoom and un-stick in short viewports.
- The biggest wins are usually un-sticking things: promo bars, chat bubbles, share rails.

## FAQ

**Is a sticky header ever wrong on a content site?**
Mostly it's fine and expected. The failures are oversized headers, headers that never hide, and broken anchor jumps — not the concept. For immersive editorial pieces, letting the header retire entirely is the bolder, often better choice.

**`position: sticky` or `position: fixed`?**
`sticky` when the element belongs to a section or column (table headers, filter rails, chapter labels) — it composes with layout and needs no placeholder. `fixed` for global chrome, where you accept the placeholder management and focus/containment responsibilities.

**How do I stop the layout jump when a header becomes sticky?**
Keep the header in flow with `position: sticky; top: 0` from the start instead of toggling `fixed` on scroll. If it must toggle, leave a placeholder of identical height. Jump is worse than not sticking at all.

**Do sticky CTAs actually lift conversion?**
When they replace a control that scrolled away — yes, modestly and measurably. When they duplicate a visible control or interrupt reading, they mostly lift rage. Test with the experiment hygiene we describe in [designing CRO experiments you can believe](/journal/growth/cro-experiment-design), and include complaint rate and scroll-abandonment in the scorecard, not just click-through.
