---
title: "Web Components vs React in 2026: a studio's scorecard"
description: "We build with both. An honest scorecard across portability, SSR, theming, a11y and hiring — plus where each earns its place on real projects."
slug: web-components-vs-react
cluster: engineering
tags: [web components, react, design systems, lit, architecture]
date: 2026-03-12
author: Felix Brandt
keywords: [web components vs react, custom elements, design system technology, lit vs react, shadow dom, framework comparison]
readingTime: 11
---

"Should we build our design system in Web Components so it works everywhere?" is the most common architecture question we get from clients, and "no" is the most common strawman answer from the internet. Both deserve better. We build with both technologies — sometimes in the same product — and the honest answer is a scorecard, not a verdict.

This is ours, updated for 2026. It's the reasoning behind the component strategy in our [design system work](/services/brand-identity) and the engineering choices inside projects like the Sundial Travel booking platform.

## First, kill the false premise

The debate is usually framed as tribal: standards purists versus framework pragmatists. In practice the two technologies solve different problems at different altitudes.

**React is a product-delivery system.** It answers "how do fifty features, four squads, and a weekly release train stay coherent?" Its strengths are application state, data flow, ecosystem depth, and hiring. Its weakness is that React-on-the-page is a commitment: React renders React.

**Web Components (custom elements + Shadow DOM) are a distribution mechanism.** They answer "how do we ship one canonical button that works in the marketing site's Astro build, the legacy Rails admin, and next year's framework-of-the-quarter?" Their strength is portability and longevity. Their weakness is that nobody has ever shipped a fast *product* on custom elements alone without rebuilding half an application framework around them.

Once you see that distinction — product engine versus portable parts — most of the theology evaporates.

## The scorecard, category by category

### Portability and longevity

**Web Components, clearly.** A custom element is a browser API. It renders wherever HTML renders, unchanged, for as long as browsers exist. Design-system primitives from 2018 (built with early Lit or even vanilla) still work today untouched. React components from 2018 need class-to-hooks archaeology.

This matters for organisations with heterogeneous surfaces: a bank with a React app, a .NET back-office, and a CMS-built marketing site can consume *one* canonical `<cu-button>` everywhere. That's the pitch, and it's real.

But portability has a price: the primitive must be genuinely generic. The moment your "portable" date picker needs app-specific data shapes, validation rules, and analytics, you've built a React component wearing a custom-element trench coat.

### SSR and SEO

**React (and friends), clearly.** React Server Components, streaming SSR, island architectures in Astro/Next — the server-rendering story is mature and gives you HTML-first pages with surgical hydration. It's how this site, and most of our [website builds](/services/websites), get to green Core Web Vitals without theatrics.

Declarative Shadow DOM closed *some* of the SSR gap for web components, but the ergonomics for streaming, partial hydration, and other 2026-era niceties still mostly live in the framework world. A content-heavy, SEO-critical page fully built in client-rendered custom elements is swimming upstream.

### Theming and styling

**Complicated — slight edge to Web Components at scale.** Shadow DOM gives you real style encapsulation: no specificity wars, no global CSS leaking into your date picker, and a stable contract (`::part`, CSS custom properties piercing the boundary) for consumers. For a design system consumed by teams you don't control, that encapsulation is governance you can't get from conventions alone.

The counter: Shadow DOM breaks familiar habits. Global resets stop applying (mostly a feature), slots complicate layout, styling across the boundary requires disciplined custom-property APIs, and form participation needed an ecosystem to catch up (`ElementInternals` now solves this properly, but only in the last few years). React + well-scoped CSS (modules, or a utility layer) is simpler for a single product where one team owns both sides.

### Accessibility

**A narrow, discipline-dependent edge to either — mistakes differ.** React fails accessibility through omission: unlabelled controls, divs-with-click-handlers, focus management never written. Web Components fail through *sealing*: a control inside a shadow root with an ARIA relationship to something outside it (labels, descriptions, live regions) hits the boundary problem — IDs don't cross shadow roots. `ElementInternals` and ARIA reflection attributes mostly solve this now, but your component authors must know that, and many don't.

Either stack can reach AA; we audit both the same way. Our [accessibility audit process](/journal/product/accessibility-audit-process) doesn't change its shape for custom elements, only its checklist.

### State, data flow, and complex UI

**React, overwhelmingly.** This is the category that decides most projects. Multi-step flows, server-state caching, optimistic UI, concurrent rendering, a form with forty interdependent fields — React's ecosystem (query layers, form libraries, state machines) is a decade of solved problems. In custom-element land you'd use Lit's reactive properties, events for upward communication, and then… rebuild a good chunk of a framework for anything ambitious. We know; we've watched teams do it.

If the surface is a *product* — dashboards, editors, flows — the honest 2026 answer is a component framework, and usually React, because hiring matters too.

### Hiring and team velocity

**React.** The hiring pool for web-components-first engineers is small and specialised. Every hour your team spends in Lit is an hour of institutional knowledge that transfers well (standards are forever), but you'll write more of the scaffolding yourself. For a studio shipping weekly across many clients, React velocity wins the spreadsheet.

## Where each one earns its place for us

**Web Components: the long-lived primitives layer.** For design systems at multi-surface organisations, we build the lowest, most stable tier — buttons, inputs, disclosure, tabs, toast — as custom elements (usually Lit), wrapped thinly for React/Vue/Angular consumers. The framework wrappers are regenerable; the element is the source of truth. These components change quarterly, not weekly, so framework velocity doesn't matter and the portability dividend compounds for years.

**React: the product surfaces.** Everything with real state and tempo — the actual apps — is React (TypeScript, Vite, the stack on our [approach page](/approach)). Product code changes weekly; it needs the ecosystem.

**Both, meeting at the boundary.** On the Sundial rebuild, the design system's primitives are custom elements consumed by a React booking engine. The itinerary builder — the beating heart of the product, a drag-and-drop monster of shared state — could never be a portable element. The buttons and fields it composes are. The [Sundial case study](/work/sundial-travel-booking) has the detail, and the split is exactly the scorecard above applied to a budget.

## The caveats we've earned

Three stories we tell clients before they fall in love with either pole:

**The date picker that went home.** A client mandated all-custom-elements for portability. Eight months in, their flagship element was a date picker with app-coupled validation, analytics events bubbling through three shadow boundaries, and a React "adapter" thicker than the component. It got rewritten as a React component for the app and a thin custom element for the marketing site — two artifacts, each honest. Portability is earned per component, not per policy.

**The SSR that wasn't.** A content platform bet on "standards" and server-rendered custom elements via declarative shadow DOM. Content was indexable; hydration rebinding broke their table sorting in Safari for six weeks (a since-fixed edge), and their Lighthouse budget suffered through polyfill overhead on older devices. They'd have gotten to the same outcome with Astro islands in a quarter of the time. Standards-first is a great value and a mediocre plan.

**The silent win.** A utility company shipped one Lit-built form-controls package consumed by a React portal, an Angular ops tool, and a plain-server-rendered billing flow. Three years, zero rewrites, one accessibility audit. Nobody wrote a thinkpiece about it. That's what winning looks like — boring.

## How to decide, in four questions

1. **How many rendering stacks will consume this code?** One → React (or your product framework). Three+, including legacy → custom elements for the shared tier.
2. **How fast does it change?** Weekly product surface → framework. Quarterly primitives → elements.
3. **How stateful is it?** Real application state → framework. Presentational → either, portability decides.
4. **Who maintains it for the next five years?** A central platform team → elements can pay off. Rotating product squads → keep everything in the framework they already know.

And the meta-rule: whichever you choose, write the *other* decision down, with a date to revisit. Architecture that can't be argued with rots quietly — the same failure mode as unaudited [bundle budgets](/journal/engineering/bundle-budget-discipline), one layer up.

## Key takeaways

- React is a product-delivery system; Web Components are a distribution mechanism. Compare them at the same altitude and the debate becomes decidable.
- Custom elements win on portability, longevity, and style governance — for stable primitives that change quarterly and serve many stacks.
- React wins on SSR, state-dense UI, ecosystem, and hiring — for product surfaces that change weekly.
- The strongest pattern for design systems: Lit-built primitives with thin framework wrappers, source of truth in the element.
- SSR/SEO-critical pages belong to HTML-first frameworks; client-rendered custom elements swim upstream there.
- Decide with four questions (stack count, change rate, state depth, maintainer) and write the decision down with a revisit date.

## FAQ

**Is Lit "the web components framework"?**

Lit is the pragmatic default: a thin (5kb-ish), standards-faithful layer that takes the sharp edges off reactive properties and templating. It's not a framework in the React sense — no router, no state story, no opinions about your app. That absence is the point. If your custom elements start needing Lit *plus* a router *plus* a store, you're building a product, and you should reconsider the altitude of the decision.

**What about React Server Components vs. custom elements for a design system?**

They compose rather than compete. Server Components govern where your UI is rendered (HTML first, hydrate islands); custom elements govern *what* the reusable units are. A server-rendered page can output custom elements that hydrate natively in the browser with zero framework code. It's a lovely combination — we use a variant of it on statically rendered sites with interactive primitives.

**Do Shadow DOM styles really eliminate CSS conflicts?**

They eliminate the accidental ones. Global resets and utility classes don't cross the boundary (good, mostly), and internal styles can't be accidentally overridden by consumer specificity (governance win). The deliberate styling path is CSS custom properties and `::part()` — which forces you to design a theming API, which is work, which is also the point. The failure mode to watch: teams poking holes with dozens of custom properties until the "encapsulated" component is just CSS with extra steps.

**Can we migrate an existing React design system to Web Components incrementally?**

Yes, bottom-up. Start with the stablest leaf components (button, field, icon), ship them as custom elements alongside the React versions, and let the React components *render* the elements. When trust builds, deprecate the React-native versions. The trap to avoid: converting stateful composites first. Migrate leaves earn confidence; migrating a combobox first earns an incident review.

**Will frameworks eventually make Web Components obsolete?**

They've been predicting that since 2018; both ecosystems have instead grown into their respective strengths. Frameworks got better at shipping products (server components, fine-grained reactivity); custom elements got better at being components (declarative shadow DOM, ElementInternals, ARIA reflection). Betting on browsers staying boring and standards outliving frameworks has, so far, been the safe bet — which is exactly what a lower tier of your architecture should be.
