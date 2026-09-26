---
title: "The URL is your best state manager"
description: "Filters, tabs, search and pagination belong in the URL. Shareable views, working back buttons, better analytics — plus the honest list of state to keep out of it."
slug: url-as-state-management
cluster: engineering
tags: [url state, react, routing, shareable state, deep linking]
date: 2026-05-28
author: Felix Brandt
keywords: [url state management, useSearchParams patterns, shareable ui state, deep linking react]
readingTime: 10
---

Somewhere in your application right now there is a filter panel whose state lives in a `useState` hook three components up, impossible to share, fatal to the back button, invisible to analytics, and reset every time the user navigates away to look at the thing they filtered for. Somewhere else, a support session is happening that goes: "Click the second tab… no, the other second tab… now tick the checkbox near the bottom." Every one of these little miseries has the same root cause, and the same unreasonably effective fix: put that state in the URL.

After a decade of rebuilding dashboards, storefronts and data-heavy tools, our position is unfashionably simple: for any state you'd want to survive a page refresh, appear in a link, or show up in an analytics funnel, the URL is not just *an* option — it's the best state manager you're not using.

## What the URL buys you, for free

Every piece of state stored in a query param or path segment inherits five capabilities that would each be a feature request in any other store:

**Shareability.** Paste the link, get the view. When we rebuilt the [Northwind Ledger dashboard](/work/northwind-ledger-dashboard-rebuild), "send me what you're looking at" went from a screenshot-and-narrate ritual to pasting a URL. Their finance team's weekly reporting thread is now mostly links: `/reports?from=2026-04-01&to=2026-04-30&costCentre=marketing&view=variance`. That URL *is* the report.

**A back button that tells the truth.** Users treat back as undo. If a filter change doesn't create history, back becomes a trapdoor that throws them out of their work. URL state gives you deliberate control over which mutations earn history entries (changing a date range: yes) and which don't (retyping a character in a search box: replace, never push).

**Refresh resilience.** The page reloads — deploy, expired tab, mobile browser memory pressure — and the view survives. Anyone maintaining long-lived sessions in data tools knows how much invisible goodwill this buys.

**Deep links from everywhere.** Emails, Slack bots, onboarding checklists, saved views, even [lifecycle emails](/journal/growth/lifecycle-email-architecture) can drop users into the exact right aperture of the product. "Your report is ready" can deep-link to *the report*, pre-filtered.

**Analytics that read the intent.** Your tracking plan gets dramatically cheaper when the state is in the address bar: the URL alone encodes the funnel. As our growth team keeps saying in their [analytics governance](/journal/growth/analytics-governance) work, the best instrumented event is the one you didn't have to write.

## The pattern: the URL is the source of truth, components are sceptical readers

The architecture that holds up is not "sync state to the URL" — two sources of truth drift, always — but one-way reading: the URL *is* the state, and components parse it on render.

```ts
// use-query-param.ts — one typed hook per param family
import { useSearchParams } from 'react-router-dom'

export function useCostCentreFilter() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('costCentre')

  // Validate on read, not on write: the URL is untrusted input.
  const value = VALID_COST_CENTRES.includes(raw as CostCentre)
    ? (raw as CostCentre)
    : null

  const setValue = (next: CostCentre | null, opts?: { replace?: boolean }) => {
    setParams((prev) => {
      const p = new URLSearchParams(prev)
      next === null ? p.delete('costCentre') : p.set('costCentre', next)
      p.delete('page') // state changes reset dependent params
      return p
    }, { replace: opts?.replace ?? false })
  }

  return [value, setValue] as const
}
```

Three disciplines inside those few lines do most of the work:

**Parse defensively.** A query param is user input from the most hostile place of all: the user's own address bar, shared around Slack, bookmarked in 2024, mangled by email clients. Validate on read; fall back to defaults silently; never trust, never crash. If the value is invalid, render the default *view* but keep the URL as-is until the user touches a control — silently rewriting URLs breaks the very link someone pasted.

**Know your update semantics.** `push` for discrete, undo-worthy state changes (a new filter, a different tab). `replace` for continuous or transitional ones (keystrokes during search, scrubbing a slider) and for auto-applied defaults. The rule of thumb: ask "would pressing back feel like undo here?" If not, replace.

**Reset dependents explicitly.** Changing a filter invalidates pagination; changing a tab may invalidate both. Nothing erodes trust faster than `?page=7` on a filtered set with two results — which is why the hook above deletes `page` when its parent filter moves.

## Tabs, modals and other contested territory

**Tabs**: yes, when the tab structure encodes real meaning — `/settings/billing` beats a vengeful `useState`. Readers arrive from links, support can say "go to Settings → Billing" and history works. Prefer path segments over params for primary navigation; params for state *within* a view.

**Modals**: mostly no — a detail panel over a list is ephemeral chrome. The exception is the modal that *is* a resource (an order detail, a record inspector). Those get a route and a close-returns-to-list affinity. If a user would ever want to link directly to what's inside the modal, it's not a modal; it's a page wearing a costume.

**Multi-select filters and sort orders**: yes, with boring serialisation. `?status=open,in-progress&sort=-updated` — comma-joined, stable order, explicit minus for descending. Avoid JSON-in-a-param; it's un-typeable, un-readable in logs, and it catches fire when double-encoded.

**Text search**: yes, but debounced into the URL with `replace`, so typing "general ledger" doesn't mint thirteen history entries.

## What to keep out — the honest list

The URL-as-state idea develops a religion problem when applied to everything. Keep out:

- **Ephemeral UI**: hover states, open dropdowns, scroll position. Back-undoing a dropdown is a war crime.
- **Fetched data**: the URL stores *which* data, never the data itself. Params select; caches remember.
- **High-frequency scrubbing**: dragging through a timeline at 60Hz will drown the history API and, on some mobile browsers, your main thread. Read from the URL, write on release.
- **Secrets and PII**: query strings land in server logs, proxy logs, and every analytics tool you forgot was installed. Never.
- **Anything you'd be ashamed to see printed in a support ticket.** A surprisingly good filter for the edge cases.

Complex flows with genuine sequencing constraints — think checkout steps or multi-path wizards — are the one place we deliberately combine URL state with an explicit machine, the way we do in our [state machines for checkout flows](/journal/engineering/state-machines-ui-flows) work: the machine owns validity, the URL owns addressability.

## Tooling and tests

You rarely need a library; `useSearchParams` plus small typed hooks covers most apps. Dedicated param-state libraries earn their keep when you want declarative schemas, server-rendering friendliness and central parsers — pick one that treats the URL as untrusted and parse-on-read, as above.

Two tests we always write for URL-state screens: the **refresh test** (set state only via UI, reload, expect pixel-identical view) and the **paste test** (copy the URL into a fresh tab in a logged-in session, same expectation). Both catch entire categories of regression that unit tests of components never will. Our [Playwright suites](/journal/engineering/playwright-testing-that-lasts) include these as standard fixtures for every data screen we ship.

## The compounding payoff

Six months after [Fernleigh Wines' storefront](/work/fernleigh-wines-dtc-storefront) launched with URL-native filtering, their marketing team had built an entire campaign system on it: every email, ad and social post deep-linked to a pre-filtered shelf (`/shop?region=orange&style=chilled-reds&sort=-rated`), and their attribution reports read like a feature spec of their own site. Nobody planned that. The URL just made the product *addressable*, and addressable things get composed by the people around them. That's the real argument: state in the URL isn't an implementation detail. It's an API your users, marketers and support team will build on whether you design it or not. Design it.

## Key takeaways

- If state should survive refresh, be shareable, or appear in a funnel, it belongs in the URL — the cheapest capabilities you can inherit.
- One source of truth: parse the URL on render, validate on read, fall back silently to defaults.
- Push history for discrete changes, replace for continuous ones; delete dependent params (page) when parents change.
- Route the tabs, param the filters; modals are chrome unless they contain a linkable resource.
- Keep out ephemera, fetched data, 60Hz scrubbing and anything you'd hide from a server log.
- Test with the refresh test and the paste test — they catch what component tests can't.

## FAQ

### Doesn't URL state get unwieldy with lots of filters?

Fifteen-plus interactive params is a real threshold. Past it, introduce a named "view" concept: a short id (`?view=q2-variance`) that resolves to a stored param set server-side. The URL stays shareable and short while the full state lives in your datastore. Build the parsing infrastructure early and the ceiling is surprisingly high — most tools never get near it.

### How do we migrate an existing app to URL state without breaking workflows?

Screen by screen, starting where support pain is loudest (usually the main data table). Add URL parsing as the initial value of the existing store first — a read adapter — then migrate writes to push/replace, then delete the store. Deep links start working from the first step, which buys goodwill for the rest.

### What about server-rendered apps and SEO?

Better, not worse — URL state and SSR are natural allies, because the server can render the exact filtered page on first paint. For crawlable surfaces, keep parameter values within a published, sane vocabulary, canonicalise default combinations, and remember that every param pair is a potential duplicate-content edge. Our [technical SEO checklist](/journal/growth/technical-seo-checklist-2026) has the full rules for indexable filtered views.

### Should form inputs live in the URL too?

Search boxes and filter-like inputs, yes (debounced, replace). Genuine forms — the thing you're filling in to submit — no; that's draft state and belongs in component state with [its own architecture](/journal/engineering/form-architecture-scale). The test is whether a *shared link* should reproduce the value. Shipping a half-filled personal form in a URL is how PII ends up in analytics.
