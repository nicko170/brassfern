---
title: "Keep your pages findable by Ctrl-F"
description: "Virtualisation silently breaks in-page search. The hidden=until-found and content-visibility toolkit, chunk-rendered long lists, and when a custom find box earns its keep."
slug: findable-by-ctrl-f
cluster: engineering
tags:
  - accessibility
  - front-end
  - performance
  - browser-platform
date: 2026-08-05
author: Aiko Tanaka
keywords:
  - in-page search accessibility
  - content-visibility hidden until-found
  - long list rendering
  - browser find UX
  - front-end accessibility
readingTime: 9
---

There's a thought experiment we run on every data-heavy build: a user presses Ctrl-F, types a word they know is on the page, and the browser says *0 of 0*. The user concludes — correctly, from where they sit — that the thing isn't there. They leave, or they call support, or they scroll manually through four thousand rows hunting with their eyes because your interface told them, falsely, that their data doesn't exist.

This is what happens when virtualisation ships without a findability audit. Windowing libraries render only the rows in the viewport; everything else doesn't exist in the DOM, so the browser's find-in-page — the single most universal power-user feature on the web, used by lawyers on contracts, accountants on ledgers, and everyone on every long page — searches an empty room. The page is fast. The page is also broken in a way no Lighthouse score will ever flag.

Findability is a rendering requirement, and like [accessibility in general](/journal/engineering/accessibility-as-engineering-practice) it's cheapest when it's an acceptance criterion rather than a remediation project. Here's the toolkit — what's genuinely solved by the platform in 2026, what's still on you, and where the honest boundary lies.

## Why virtualisation breaks find (and why it ships anyway)

The motive for virtualisation is legitimate: ten thousand DOM rows is a real performance problem — layout cost, memory, scroll jank on modest hardware, and miserable [keyboard interaction](/journal/engineering/keyboard-first-interfaces) when a single arrow key triggers a reflow across a mountain of nodes. The engineer's conclusion, "render only what's visible," is locally correct and globally wrong, because invisible rows aren't merely unpainted — they're *absent*, and absence breaks every feature that reads the DOM. Find-in-page is the loudest casualty, but it's the same wound that breaks "select all and copy," browser translation, RSS-style reader modes, and the humble page's print stylesheet (a sibling discipline we've written about in [print stylesheets](/journal/web-design/print-stylesheets-still-matter)).

The industry answer used to be an ugly binary: virtualise and break find, or don't virtualise and eat the perf cost. The platform has since shipped a third option that most teams haven't noticed.

## The platform's answer: hidden=until-found and content-visibility

Two browser features, designed to be used together, change the calculus:

**`hidden="until-found"`** is an HTML attribute that hides content — display:none-level hidden, removed from rendering — *until the browser's find-in-page or a fragment navigation matches text inside it*, at which point the browser reveals the section and scrolls to the match. The browser performs the find itself, internally, without needing the content rendered. Your rows can be legitimately unrendered and still findable.

**`content-visibility: auto`** on section-level containers tells the browser to skip rendering layout and paint for off-screen sections while keeping them *in the DOM* — where they remain searchable, accessible to find-in-page, and surfaced to assistive technology (with caveats about heading structure you must verify per browser). This is the near-free win: big documents get most of virtualisation's rendering savings with none of its absence.

Composed, the pattern for a giant list looks like: chunk the list into sections (by letter, month, category — whatever the data offers), give each chunk `content-visibility: auto` with an `contain-intrinsic-size` estimate so scrollbars don't thrash, and mark completely collapsed regions `hidden="until-found"` so they reveal on match. The `beforematch` event fires when the browser auto-reveals a hidden region — hook it to expand your collapsible wrappers (`<details>` elements, accordion sections), and find-in-page now opens drawers it matches inside. This is also the correct fix for the classic "user Ctrl-F's a term hidden inside a closed accordion and the browser shrugs" embarrassment.

Support in 2026 is broad but not wallpaper; treat both as progressive enhancement. The failure mode you must design for is a browser where `hidden="until-found"` acts as plain `hidden` — meaning content invisible *and* unfindable. The escape hatch: a feature-detect plus a "reveal all" escape that switches these containers to merely-collapsed rendering for browsers without the behaviour. Ten lines. Write them.

## Chunking is the honest middle

Sometimes the right answer isn't a clever attribute, it's *fewer rows in one room*. The pattern we reach for before any virtualisation conversation: render the list in semantic chunks with real boundaries — paginate at meaningful data boundaries ("Q3 2025", "Surnames M–R"), or lazy-append sections on intersection like a well-mannered infinite scroll that keeps earlier content mounted.

Chunked-plus-mounted has a property virtualisation never will: everything the user has scrolled through remains real DOM. Find-in-page finds text in all *rendered* content, and with `content-visibility` the cost of keeping hundreds of sections mounted is modest. The user's mental model — "this page contains the whole list, and find searches the page" — stays true instead of becoming a quiet lie. That truth is worth engineering toward, because users' trust in a page's completeness is plumbing you don't see until it bursts.

On the data-table side — where we hold strong opinions, per [designing tables for people who live in them](/journal/product/data-dense-tables-ux) — chunked sections also give you natural landmarks: sticky group headers, per-section summary rows, and screen-reader navigable regions. Virtualisation fights the DOM; chunking *enlists* it.

## When the custom find box is honest

There is a legitimate case where in-page search cannot find content because the content genuinely isn't on the page — datasets too big to serialize, results computed server-side, data behind permissions. The honest solution is the one users already understand: a find box *in the interface* that searches the dataset, not the DOM.

The rules that keep this honest rather than user-hostile:

- **Match the muscle memory.** Users press Ctrl-F; a custom find that *captures* Ctrl-F and redirects it into the dataset search is meeting the user at their gesture. (Capture carefully: if your dataset search can't match the browser's behaviour — highlight all matches, navigate between them — then capture is a downgrade and you shouldn't. Judge your own implementation ruthlessly.)
- **Scope the promise visually.** The box must clearly search *the dataset*, not the page. Placeholder copy like "Search all 12,400 records" tells the truth; a bare magnifier icon implies the browser's job and breaks the user's world quietly.
- **Highlight in the results.** Searched terms should visibly highlight in result rows — the user asked "find this," not "filter to rows containing this," and the distinction is whether they can see *where* it matched.
- **Keep page-find intact for what's rendered.** The FAQ section, the column headers, the visible rows — browser find should still work over what *is* DOM. A custom find that disables or clobbers normal page search is a regression with good intentions; this whole care-for-the-user's-gesture philosophy mirrors how we think about [command palettes](/journal/product/command-palette-patterns) as accelerators rather than replacements.

## Making it stick: the acceptance criterion

Findability rots by default because nothing in CI screams about it. Two cheap practices fix that. First, a manual acceptance line on every long-list feature: *"Ctrl-F for the last item in the list must find it"* — one human, ten seconds, catches every virtualisation regression on contact. Second, an end-to-end test that types a known-far-down-list term through the browser's own mechanisms where automatable, or simply asserts the existence of the findable-DOM invariants (sections use `content-visibility`; collapsed regions use `until-found`; the custom find box exists and is labelled). Tests that assert *invariants* survive redesigns in a way pixel assertions never do — the same reasoning as our [Playwright suites that survive the redesign](/journal/engineering/playwright-testing-that-lasts).

And check the platform's direction of travel once a year: [Baseline](/journal/engineering/web-platform-baseline-2026) keeps absorbing what used to be library territory, and the findability feature set has improved more in three years than in the previous ten.

## Key takeaways

- Virtualisation renders non-visible rows absent from the DOM, which silently breaks find-in-page, copy-all, translation and print — a failure category no performance tool reports as an error.
- `hidden="until-found"` plus `content-visibility: auto` (with size containment) delivers most of virtualisation's savings while keeping content findable; hook `beforematch` to auto-expand collapsives. Feature-detect and degrade deliberately.
- Chunk long lists at meaningful data boundaries and keep scrolled sections mounted — the page should *contain* what users believe it contains.
- A custom find box is honest when the data truly can't be in the DOM: meet the Ctrl-F gesture, visually scope the promise, highlight matches, and never clobber page-find over rendered content.
- Make "Ctrl-F finds the last row" a standing acceptance criterion; assert findability invariants in E2E tests.

## FAQ

**Isn't this only a problem for huge datasets?** No — the trigger is *virtualisation and collapsing UI*, not data size. A five-hundred-row list behind un-found accordion sections, a split "portal" tree, a virtualised chat history: all unfindable at sizes that fit memory easily. If rows or sections can be unavailable to browser find while *appearing* available, you have the bug.

**Does content-visibility affect screen readers?** Behaviour has shifted as browsers align; the current guidance is that `content-visibility: auto` content stays in the accessibility tree (unlike `display: none`), but heading-level navigation into unrendered regions has had per-browser quirks. Verify with the [screen-reader testing workflow](/journal/engineering/screen-reader-testing-workflow) for your actual reading order — this is checkable, and it must be checked, not assumed.

**Safari lag — how do we handle partial support today?** Progressive enhancement with explicit fallbacks: feature-detect; where `until-found` is unsupported, prefer expand-all-on-search-attempt affordances (a visible "Expand all sections" control near long collapsed content) and keep `content-visibility` where it's safe without find-dependence. The lab's general stance applies: design for the intersection, delight on the union.

**Ctrl-F capture — isn't hijacking browser shortcuts hostile?** Hijacking is hostile when it *reduces* capability; redirecting is respectful when it strictly increases it. The test we apply: after your capture, can the user do everything browser-find did, plus more? Match navigation, highlight-all, match-count — if yes, capture with a clear "searching all records" scope; if no, leave the shortcut alone and place the dataset search one obvious inch away.

---

*Findability is one of the acceptance criteria we bake into every [product build](/services/product) — see [how we work](/approach), or [put us on your data-heavy problem](/contact).*
