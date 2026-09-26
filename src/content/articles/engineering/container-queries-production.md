---
title: "Container queries: finally designing components, not pages"
description: "Media queries ask the viewport; container queries ask the room. Production notes: containment costs, cqi type, fallbacks, and cards that go anywhere."
slug: container-queries-production
cluster: engineering
tags: [css, responsive design, component architecture, design systems, frontend]
date: 2026-02-18
author: Felix Brandt
keywords: [container queries, css containment, cqi units, responsive components, card component css, container query fallback]
readingTime: 10
---

For fifteen years, responsive design had a dirty secret: we weren't designing components, we were designing pages. A card wasn't a card — it was "a card in the main column between 768 and 1024 pixels." Move it to a sidebar and it broke, because its styles were keyed to a viewport it knew nothing about. Every design system eventually sprouted `Card--wide`, `Card--compact`, `Card--sidebar`, each one a confession that the component couldn't look after itself.

Container queries end that arrangement, and by 2026 they are simply how we build. This is what we've learned shipping them across dashboards, editorial platforms and e-commerce builds — the costs nobody mentions in the announcement posts, and the patterns that hold up when a marketing team starts dragging your components into layouts you never designed.

## The mental model, stated plainly

A media query asks: *how big is the window?* A container query asks: *how much room was I actually given?* The difference sounds academic until you build a dashboard with a collapsible sidebar. The main column changes width without the viewport changing at all. Media queries are blind to it. Container queries see it perfectly.

The setup is two declarations:

```css
.card-region {
  container-type: inline-size;
  container-name: cardhost;
}

@container cardhost (min-width: 420px) {
  .card { grid-template-columns: 160px 1fr; }
}
```

`inline-size` containment on the host, queries on the child. Note what you don't do: you do not containerise the card itself. You query the *space around* the component, not the component, for the same reason you can't query your own width to decide your own width. Circular. The browser will stop you — containment isolates the host's size from its contents — but the confusion wastes an afternoon the first time.

## The pattern that pays: cards that go anywhere

Our highest-value use is boring on purpose: content cards that survive any slot. On the [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild), a single `AccountCard` component renders in a dense three-column grid, a two-up row, a full-width banner slot, and a narrow "insights" rail. Before container queries that was four variants and a prop (`density="compact"`) threaded through four parent components — layout knowledge leaking upwards through the tree.

Now the card owns four breakpoints measured in the room it's given, and the prop is deleted. Parents stopped knowing. That's the real win: not fewer media queries, but a *deletion of coordination*. The design system team ships a card; the page team composes layouts; neither has to negotiate with the other. This is the component-driven version of the props-to-pieces discipline we want from our whole front end — the same reason we treat [design tokens as an API](/journal/engineering/design-tokens-pipeline-ci) rather than a variables file.

Two rules make the pattern work:

1. **Breakpoints belong to the component, not the page.** The card decides it goes two-column at 420px because *the card* needs 420px. Never reuse a page's media-query breakpoints inside container queries — the values mean different things.
2. **Query ranges, not points.** `(min-width: 420px)` is fine; `(420px <= width < 640px)` style chains are where the layout lives. Point queries regress into fragile pixel-matching.

## Containment is the bill

Container queries aren't free, and the invoice is `container-type`. Declaring inline-size containment tells the browser: *this element's width no longer depends on its contents.* That makes the query solvable, and it also breaks any layout that relied on content pushing the container wider.

The classic casualty is shrink-wrapping. A `display: inline-block` badge that hugs its text cannot be a size container, because containment forbids exactly that behaviour. The fix is almost always the same: put the containment on a *wrapper*, one level up, that was already block-shaped and full-width. In practice we containerise regions (`.product-grid`, `.account-list`, `.rail`) and never leaf elements.

Second cost, subtler: containment in a scrolling, dynamically-sized region can thrash. We hit this on a data table where the scrollbar appearing changed the container width, which changed the layout, which removed the need for the scrollbar — a 60fps oscillation. The cure is `scrollbar-gutter: stable` on the scroller, which is worth adding defensively to any container region that can overflow. One line, one oscillation avoided.

Third cost is honestly a feature: containment creates a new formatting context, so floats and margin-collapsing behave differently inside. If you inherit a layout held together by 2016-era float gymnastics, containerising it will surface the magic. Budget a day for that discovery; it's a day well spent.

## Typography in containers: cqi is the quiet star

Container query units (`cqi`, `cqb`, `cqmin`, `cqmax`) don't get the headlines, but they've changed how we set fluid type inside components. One percent of the container's inline size is a far saner basis for a card's headline than one percent of the viewport.

```css
.card__title {
  font-size: clamp(1.125rem, 0.9rem + 1.2cqi, 1.75rem);
}
```

Same headline, correct size, whether the card is a full-width hero or a 280px rail item. The `clamp` matters twice: it floors the size for accessibility, and it keeps font size stable while the container *grows* during a sidebar collapse animation, interpolating smoothly instead of jumping at breakpoints. Paired with the token discipline from our [tokens pipeline](/journal/engineering/design-tokens-pipeline-ci), a card's entire typographic scale can live in three clamped values.

One warning: `cqi` resolves against the *nearest* ancestor container, which is not always the one you meant. Name your containers and, where precision matters, size queries and units against the named one. Ambiguity here produces type that mysteriously shrinks when someone nests your card inside another containerised region — a bug that reads as a design decision and survives review.

## Fallbacks without two codebases

Baseline support for size container queries has been solid across every browser we test in for years now, so our default posture is: ship them, no polyfill, and design the *smallest* container state as the no-query fallback. Structure the CSS mobile-first — base styles are the compact card; container queries only ever *add* complexity:

```css
.card { /* compact layout: the floor */ }

@container cardhost (min-width: 420px) { /* richer */ }
@container cardhost (min-width: 680px) { /* richest */ }
```

On a browser with no container query support, the `@container` blocks are ignored and every slot shows the compact card. That's not a degraded experience; that's the mobile layout, which was designed. The discipline this forces — the compact state must be *good*, not a collapsed accident — improves the component for everyone. It pairs cleanly with the page-level philosophy from our [Baseline 2026 review](/journal/engineering/web-platform-baseline-2026): use the platform's modern floor, and let the floor be genuinely decent.

We used to keep an `@supports not (container-type: inline-size)` override path. We deleted it in 2025. Nobody noticed, which was the point of the exercise.

## Where we don't use them

Restraint list, because this is the section that ages well:

- **Anything global.** Navigation, page grids, full-bleed heroes — the viewport is the right question there. A container query for the site's header is a media query with extra steps.
- **Deeply nested micro-layouts.** If a component has three nested containers, you've rebuilt the page-coordination problem inside a component. Two levels, maybe. Three is a smell.
- **As a substitute for content modelling.** A card with eight container states is often eight variants pretending to be one. Sometimes the honest answer is two components with a shared base — this is the same "sprinkle, don't soak" judgement we apply to [islands architecture](/journal/engineering/islands-architecture-when) and, frankly, to most platform features at their hype peak.

## Key takeaways

- Container queries delete coordination between page teams and component teams; that deletion is the win, not the CSS.
- Containerise regions, never leaves — wrappers that were already block-shaped, one level above the component.
- Compact-first structure gives you a free fallback and forces the smallest state to be well designed.
- Use `cqi` units with `clamp()` for component typography, and name containers before nesting bites you.
- Add `scrollbar-gutter: stable` to overflowing container regions; oscillation bugs are real and baffling.
- If a single component grows five container states, ask whether it's actually two components.

## FAQ

**Should every component be container-aware from day one?**
No. Start with the ones that demonstrably move between contexts: cards, media objects, data summaries. Containerising a component that has only ever lived in one slot adds flexibility nobody asked for — and every state you add is a state you design, test and review.

**How do container queries interact with grid and flex?**
Beautifully, and that's the point. Grid decides how much room each cell gets; the component inside the cell adapts to the room. Grid is the landlord, container queries are the tenant deciding how to furnish. Keeping those responsibilities separate is most of the architecture.

**Do they affect performance?**
Containment can actually *help* rendering performance by letting the browser isolate subtree layout, and in practice we've measured no cost from the queries themselves. The performance risk is behavioural: teams adding container-aware variants so lavishly that the CSS payload grows. Variant discipline is a bundle-budget discipline.

**Can we use them inside shadow DOM?**
Yes — containers and queries work across shadow boundaries in the way you'd hope (a host element can be a container for its shadow children). We use this in the parts of our systems built on Web Components, and it's one of the few places the two technologies feel designed for each other.

**Do container queries replace responsive design?**
They complete it. Media queries still own the page level: the grid's column count, the navigation mode, the full-bleed moments. Container queries own the component level. Responsive design was always supposed to be both; for fifteen years we only had half the vocabulary.
