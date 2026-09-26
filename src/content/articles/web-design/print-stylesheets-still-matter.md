---
title: "Print stylesheets: the forgotten design surface"
description: "Most web teams ship print CSS by accident. Here's @media print done properly: receipts, itineraries, tickets, page breaks, link URLs, and testing without a printer."
slug: print-stylesheets-still-matter
cluster: web-design
tags: [print css, design systems, accessibility, craft, front-end]
date: 2026-03-17
author: Aiko Tanaka
keywords: [print stylesheet css, media print design, print friendly web pages, printing web content]
readingTime: 9
---

Somewhere in your analytics there's a quiet number you've never looked at: how often `window.print()` fires, or how often people hit Cmd-P. On most marketing sites it's a rounding error. On the wrong site, it's the whole product. Ticket confirmations. Boarding passes. Recipes. Invoices and receipts. Insurance certificates. Itineraries. Any page that ends up folded into a pocket or pinned to a fridge is a print surface, and if you haven't designed it, the browser has.

This is the case for treating print as a real design surface — not a hack, not a `display: none` bonfire the night before launch, but a styled, tested, intentional layout. It costs about a day. It pays forever.

## Who actually prints

Forget the "nobody prints anymore" reflex. In the last year of fictional-but-representative builds at Brassfern, print showed up everywhere we bothered to look:

- **Travel.** For [Sundial Travel](/work/sundial-travel-booking), itinerary pages were printed by roughly one in eight customers who opened them — mostly travellers over 55, and nearly everyone travelling to regions with patchy connectivity. Paper doesn't lose signal.
- **Health.** Appointment summaries and referral letters get printed by patients, carers, and front-desk staff who live in three systems that don't talk to each other. The [Pylon Health telehealth work](/work/pylon-health-telehealth-flow) surfaced grandmas printing visit summaries to show their GP. That printout *is* the UX.
- **E-commerce.** Return authorisations, gift receipts, warranty cards. The returns flow is a loyalty moment — we wrote about that in [returns UX](/journal/ecommerce/returns-ux-design) — and a mangled return label printout is a support ticket with your logo on it.
- **Legal and finance.** Anything a person might need to show a third party who doesn't trust screens: a landlord, an insurer, a court clerk.

The pattern: print appears wherever the physical world, another human, or a bad connection enters the story. If your product touches any of those, you have a print product whether you designed one or not.

## The baseline: what you get for free

Start by knowing what the browser does unassisted. It prints the current DOM, roughly linearised, using your screen styles, minus backgrounds (by default) and minus anything the user agent decides is noise. Floats and fl/grid survive inconsistently. Fixed headers repeat on every page, upside down to your intentions. Sticky footers sit in the middle of page two. It's bad.

The minimal civilising layer is well-known but rarely finished:

```css
@media print {
  header, nav, footer .site-nav, .cookie-banner, .chat-widget { display: none; }
  * { background: transparent !important; box-shadow: none !important; text-shadow: none !important; }
  body { font-size: 11pt; line-height: 1.5; color: #000; }
  a { color: #000; text-decoration: underline; }
}
```

Two things people always rediscover. First, `!important` is not a code smell in print CSS — you're fighting your entire design system and specificity is cheaper than refactoring it. Second, stripping backgrounds is also an *ink* decision: a full-bleed hero costs someone 40 cents of toner. Be the good guest on their cartridge.

## Expansion is the real job

The single most valuable print technique is making hidden content visible. Screen design is a discipline of hiding: tabs, accordions, carousels, truncated text, hover tooltips. Print has no affordances. Everything the user might need has to be on the page.

That means your print stylesheet must:

- **Open every accordion** and render tab panels in sequence, ideally with their headings intact so the paper structure mirrors the screen structure.
- **Reveal truncated content** — kill `text-overflow: ellipsis` and max-height clamps.
- **Replace "load more" lists** with the full set server-side, or at least print what exists plus a URL where the rest lives.
- **Swap live charts for printed tables** where precision matters. A canvas chart prints as a pretty picture; the table behind it prints as data. Output both if the numbers matter — the chart first, the table beneath, as we do on the data-heavy dashboards in [tables on phones](/journal/web-design/responsive-table-design) territory.

We treat this as a component contract: every component that hides content on screen ships a print mode in the same PR. It's the same discipline as empty and error states — the states that carry trust, as [empty, loading, error](/journal/web-design/empty-loading-error-states) argues — except the state is "your user is standing at a post-office counter."

## Links die on paper — resurrect them

The classic trick remains correct:

```css
@media print {
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 90%; }
}
```

But be selective. Appending URLs to *every* link turns a navigation-heavy page into gibberish. Our rules: expand only external links and links whose destination isn't obvious from their text ("read the returns policy" gets its URL; "home" does not). Relative internal links pointing at important flows — a booking reference lookup, a warranty claim — get expanded against the canonical domain, because paper survives longer than sessions.

While you're there: print the important ephemera *on* the page. Booking references, timestamps ("generated 14 March 2026, valid for 30 days"), and a support contact. Paper loses your URL bar; give the artefact enough context to be useful next month.

## Page breaks: the layout grammar of paper

Print layout is layout, and it has three properties worth memorising:

- `break-inside: avoid` (the modern `page-break-inside`) on blocks that must not split: cards, figures, table rows, an address block, a signature line.
- `break-before: page` to start major sections on a fresh sheet — only where the document genuinely has chapters, or you waste paper and look precious.
- `orphans` and `widows` — set to at least 2 or 3 — so a heading isn't stranded at the bottom of a page or a lone line adrift at the top.

Add `display: none`-level surgery for elements that make no sense on paper even when visible: video players (replace with the poster image and a play URL in a `<p class="print-only">`), interactive maps (swap for a static image plus the address as text), and anything whose only verb is *click*.

Speaking of which: print-only content is legitimate. A `.print-only { display: none }` / `@media print { .print-only { display: block } }` pair lets you add a QR code, a cut-here line for receipts, or a "this page was printed from sundial.travel/trip/…" footer. The inverse of hiding screen-only chrome is *adding* paper-only wayfinding.

## @page, margins, and the things nobody styles

`@page` sets the sheet itself: size, margins, and (in supporting browsers) margin boxes for running headers and page numbers via `@bottom-center { content: counter(page) }`. Support for margin boxes is still uneven in 2026, so we set clean margins and let the sky fall where it may. Fifteen to twenty millimetres is the safe quiet zone; printers have physical unprintable edges and the people doing the printing do not care about your grid.

Also decide your colour policy explicitly. `print-color-adjust: exact` forces backgrounds through where you truly need them — a ticket's colour-coded day badge, a highlighted total. Use it surgically: it's telling the browser to ignore the user's ink-saving preference, so earn it.

## Testing without a forest

You do not need a printer. You need discipline:

1. **Browser print emulation.** Chrome and Firefox both emulate print media in devtools; Chrome's rendering panel toggles it in one click. It catches 90% of issues.
2. **Print-to-PDF as CI artefact.** On print-critical pages (receipts, certificates), we snapshot print-to-PDF output in the review pipeline. A layout regression on paper is a regression; treat it like the visual-diff coverage we describe in [Playwright suites that survive the redesign](/journal/engineering/playwright-testing-that-lasts).
3. **One real print, once.** Per redesign. Paper reveals what emulators don't: orphaned headings, a second page containing a single footer link, the receipt that needs two pages because of one rogue `100vh`.

The whole investment for a typical marketing site is a day or two; for a transactional product, fold print into your component acceptance criteria and it's nearly free. The footer, by the way, still matters on paper — it's often the only branding that survives the toner, and [the footer is a sitemap with manners](/journal/web-design/footer-design-matters) applies doubly when the manners are for someone holding a page at a service desk.

## Key takeaways

- If your product produces artefacts — receipts, itineraries, tickets, certificates, summaries — you have a print product. Design it or the browser will.
- Print's core job is *revealing*: open accordions, expand truncated text, replace charts with tables, print references and dates.
- Expand link URLs selectively — external and non-obvious links only — and add print-only wayfinding like source URLs and QR codes.
- `break-inside: avoid`, `orphans`, and `widows` are the three declarations that fix most paper ugliness. `print-color-adjust: exact` is a scalpel, not a default.
- Test with print emulation and print-to-PDF snapshots; do one physical print per redesign. Cost: about a day, once.

## FAQ

**Do print stylesheets affect SEO?**
Not directly — crawlers don't print. But print-friendly pages tend to be well-structured documents with complete content in the DOM, which is never a bad signal, and print-specific UX complaints never reach your reviews.

**Should I build a separate "print version" page?**
No — that's 2004 talking, and it forks your source of truth. `@media print` keeps one document, one URL, one set of content. The only exception is when print output is a genuinely different artefact (a formatted invoice PDF), in which case generate the PDF properly rather than pretending a web page is one.

**What about `save as PDF` — do people use print CSS for that?**
Constantly, and sometimes more than paper itself. Saving a confirmation page as a PDF for records uses the exact same print pipeline. Anything you fix for the printer, you fix for the archive.

**How do I handle dark themes?**
Force light. Print CSS should reset to dark-on-light regardless of the user's theme toggle; paper has no dark mode, and forcing a near-black background out of consideration for nobody is exactly the kind of detail ink cartridges hold grudges over.

**Is it worth polyfilling running headers and page numbers?**
Rarely. Accept clean `@page` margins, put document identity (title, date, reference number) at the top of page one, and let browsers without margin-box support ship a slightly quieter page two. The effort-to-audience ratio inverts past that point.
