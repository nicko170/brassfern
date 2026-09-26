---
title: "Islands architecture: sprinkle, don't soak"
description: "When islands beat a full SPA: hydration costs, interaction latency budgets, the pragmatic hybrid pattern we use on content-heavy sites, and the traps."
slug: islands-architecture-when
cluster: engineering
tags: [architecture, performance, hydration, astro, content sites]
date: 2025-06-19
author: Tomás Reyes
keywords: [islands architecture, partial hydration, astro vs next, hydration performance, content site architecture]
readingTime: 9
---

There's a particular kind of website that gets architecture wrong in the most expensive way: ninety percent content, ten percent interactivity, built as a single-page application. Every article, every landing page, every footer link ships the entire React runtime, hydrates the entire tree, and reimplements the `<a>` tag in JavaScript. The user came to read 800 words and downloaded a program.

Islands architecture is the correction. Render the page as static HTML on the server; hydrate only the small, named patches that need to be interactive — the accordion, the cart drawer, the search box. Everything else never touches a JavaScript engine. The metaphor is literal: an ocean of HTML, a few islands of interactivity.

## The bill hydration sends you

Hydration is invisible in a devTools waterfall on a MacBook Pro with fibre. On a mid-range Android over patchy 4G — which is to say, a large share of real users — it's the difference between a page that's ready in a second and a page that looks ready but ignores your first three taps.

The mechanics: the browser parses the HTML, downloads the JS bundle, parses *that*, executes it, rebuilds the component tree in memory, walks the DOM to attach event handlers, and only then is the page interactive. During that window you get the worst possible UX state — pixels without behaviour. We wrote about measuring exactly this with INP in the [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide); overgrown hydration is the single most common cause of bad INP we find in audits.

With islands, the HTML is the page. The interactive patches hydrate independently — often lazily, when scrolled into view or on first interaction. A 200KB marketing page ships 15KB of JavaScript instead of 300KB. That is not a rounding error; on real devices it's seconds.

## When to island, when to SPA

The decision is a ratio question: **what fraction of the visible page is interactive state, and how shared is that state across components?**

**Islands win when:**

- The page is mostly content: marketing sites, editorial, docs, blogs, most e-commerce storefronts.
- Interactivity is local and independent — an accordion doesn't need to know about the newsletter form.
- SEO and first-paint performance are existential, not nice-to-have.
- Teams publish content far more often than they change behaviour.

**A full SPA (or a tightly integrated framework like Next.js) wins when:**

- The page *is* the app: persistent shell, global state everywhere, constant mutation. An inbox. A design tool. Our [Northwind Ledger budgeting demo](/lab/northwind-ledger-budget) is pure island-free territory — everything talks to everything.
- Route transitions share heavy client state and you'd just rebuild SPA plumbing badly on top of an islands framework.
- Your team's velocity in one ecosystem outweighs the marginal performance win.

**The honest middle:** frameworks like Next.js with server components let you get island-*ish* economics inside React, at the cost of a more complex mental model — we itemise that trade in [React Server Components: the trade-offs](/journal/engineering/react-server-components-tradeoffs). Dedicated islands frameworks (Astro, Fresh, Qwik in spirit) get cleaner numbers with a smaller ecosystem. Neither is universally right; the ratio is.

## The hybrid pattern we actually use

On content-heavy builds our default architecture looks like this:

1. **Everything static by default.** Pages are server-rendered HTML with zero runtime JS. If a block doesn't need state, it's HTML and CSS. Full stop.
2. **Named islands with explicit loaders.** Each island declares when it hydrates: `idle` (accordions, tabs), `visible` (charts, maps), `interaction` (search overlays, video players). Interaction-loaded islands are the biggest win — the search box ships as a styled button and only downloads its code when someone hovers or focuses it.
3. **One shared island bus, reluctantly.** When two islands genuinely need shared state — cart count and cart drawer, say — they join a tiny client-side store scoped to precisely those islands. We treat cross-island state as a design smell to be justified, not a default. If three islands need shared state, that's usually evidence the page is actually an app, and we revisit the ratio.
4. **View transitions for the SPA feel.** Modern view-transition APIs let static multi-page navigations morph smoothly between pages. You keep island economics and shed the "full reload" feel that used to be the SPA's trump card. Motion without hydration cost — the same philosophy as [motion that earns its keep](/journal/web-design/motion-that-earns-its-keep).

## Traps we've stepped in so you don't have to

**Island sprawl.** It's easy to island everything and end up with forty separately-hydrating components, each with its own copy of shared dependencies. The bundle analyzer is your friend: dedupe ruthlessly, share one framework copy, and merge islands that always appear together.

**Props as a firehose.** Island props must be serialisable — they're embedded in the HTML as JSON. We've seen a "related products" island receive the entire product catalogue as props because it was convenient. Props are an API contract with a byte cost; design them like one.

**Styling drift.** Islands sometimes get built in a separate toolchain from the static shell, and the two quietly diverge — focus states missing in one, spacing tokens stale in the other. One token pipeline, one stylesheet, no exceptions. (Our [design tokens in CI](/journal/engineering/design-tokens-pipeline-ci) setup exists largely because of this failure mode.)

**Third-party scripts re-introducing the flood.** You can build a beautiful 12KB island page and then let marketing paste four tag-manager bundles into the head. Islands discipline has to include a third-party budget, enforced in CI, or you've built a dam with the gates open.

## A decision you can defend

The question we ask clients isn't "what framework do you want" — it's "show me the most interactive page on your site and count the stateful elements." If the answer is a nav, an accordion and a form, the answer is islands, and the performance budget writes itself. If the answer is "the whole thing is a live collaborative surface," the answer is a client app, and we stop feeling guilty about bundle size and start engineering it properly.

The worst outcomes come from picking the architecture by fashion and discovering the ratio afterwards.

## Key takeaways

- Islands render content as HTML and hydrate only named interactive patches — the right default for content-first sites.
- The decision variable is the interactivity ratio: local, independent state favours islands; global, shared state favours an app architecture.
- Lazy hydration triggers (`visible`, `interaction`) are where the dramatic wins live.
- Island prop payloads and third-party scripts are where the architecture silently dies — budget both.

## Frequently asked questions

**Can we mix islands and a SPA in one site?**
Yes — it's a common and healthy shape. Marketing and content sections as islands, the logged-in product as a client app, sharing tokens and components but not a runtime.

**Is islands architecture good for SEO?**
Excellent, because the HTML *is* the page. No client-rendering gap for crawlers, fast LCP, and stable layouts. Pair it with the fundamentals in our [technical SEO checklist](/journal/growth/technical-seo-checklist-2026).

**What about React Server Components — isn't that the same thing?**
Cousins, not twins. RSC keeps you inside one React tree with a server/client split; islands are a coarser, framework-agnostic pattern of independent entry points. RSC can be the right call inside a React-committed team — see [our RSC trade-offs piece](/journal/engineering/react-server-components-tradeoffs).

**How do we convince stakeholders who equate "modern" with "React SPA"?**
Show them the interaction-ready time of their current site on a real phone, then show a static-first version of the same page. Numbers from their own product end architecture debates faster than any blog post — including this one.
