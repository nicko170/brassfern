---
title: "Generating PDFs from web tech without tears"
description: "Invoices, statements and reports generated from web tech: print CSS vs headless Chrome vs canvas composition, scored honestly — plus when PDF is the wrong answer."
slug: pdf-generation-web
cluster: engineering
tags: [pdf, print css, headless chrome, reporting, architecture]
date: 2025-04-15
author: Felix Brandt
keywords: [pdf generation javascript, print css, headless chrome pdf, report generation web, invoice generation, server-side rendering pdf]
readingTime: 11
---

Nobody chooses PDF generation. It chooses you, usually at 4pm on the Thursday before launch, when someone in accounts asks how the invoice email "actually produces the PDF". By then the answer determines whether your weekend is quiet.

We've shipped PDF pipelines for bank statements, insurance schedules, tasting-note sheets and tax invoices. The technology choices are fewer than the blog posts suggest, and each fails in its own specific way. This is the map we wish someone had handed us, including the bits that cost us a weekend to learn — and including the honest question of whether you need a file at all. It's the same thinking behind the statement engine in our [Copperline Mutual rebuild](/work/copperline-community-bank).

## Why PDFs are still a thing

Because the recipient isn't your user. The PDF leaves your product and enters somebody else's workflow: an accountant's inbox, a council submission portal, a lawyer's document management system, a printer in a warehouse. Those systems were standardised on PDF twenty years ago and they are not moving. A PDF is also a *snapshot* — it freezes a number, a total or a legal disclosure at a moment in time, which is precisely what finance and compliance teams want and precisely what a live web page can't promise.

So the job is real. The question is how to produce thousands of well-typeset documents a day from a stack that was built to render web pages.

## The three architectures

### 1. Server-side template plus headless Chrome

You render an HTML/CSS template — often the same component library as the app — in a managed headless browser (Browserless, or Puppeteer on a queue worker) and call `page.pdf()`.

**Strengths.** You write the layout once, in the medium your team already owns. Flexbox and grid work. Webfonts work. Charts render if you wait for them. Debugging is just DevTools on the template in a normal browser.

**Weaknesses.** A headless Chromium instance is a 300MB animal. Cold starts are 1–4 seconds; a warmed pool costs real money. Pagination is the eternal paper cut: `page-break-inside: avoid` gets you 80% of the way, and the last 20% — repeated table headers, avoid-orphan rules, footers with "page 3 of 17" — is CSS archaeology. Headers and footers via Chrome's own `headerTemplate` don't share your page's fonts unless you base64-inline them, a detail documented nowhere and discovered by everyone.

**Score it when:** layout fidelity matters, volume is moderate (thousands a day, not millions), and you can tolerate a queue. This is our default.

### 2. Programmatic composition (pdf-lib, PDFKit, Resvg-style pipelines)

You draw the document in code: text runs, vector boxes, embedded fonts, positioned absolutely or flowed by a layout engine you control.

**Strengths.** Fast — milliseconds per document, tiny memory. Deterministic; no browser in the loop means no flaky rendering. Excellent for high-volume, structurally repetitive documents like tickets, certificates and packing slips.

**Weaknesses.** Typography becomes your problem. Hyphenation, bidirectional text, OpenType features, correct line-breaking for CJK — you either bring a shaping engine (HarfBuzz via wasm) or accept "Latin text with sensible kerning" as your ceiling. Rich content (a chart, a map, a markdown-rendered clause library) means reimplementing rendering you'd get free in a browser.

**Score it when:** volume is high, layout is fixed, content is data-shaped rather than prose-shaped.

### 3. Print CSS, rendered client- or server-side

You author a genuinely good print stylesheet — `@page` rules, `size: A4`, running headers via `position: running()` where supported — and either let users print from the browser or render it server-side.

The dirty secret: most consumer browsers print fine, and for a large class of use cases ("download a nicely formatted copy of this report"), a print stylesheet plus a good "Print / Save as PDF" button beats an entire generation pipeline. No queue, no cold starts, no cost per document, and hyperlinks stay live.

**Weaknesses.** You don't control the file name, the paper size defaults, or the fact that Safari's print preview will do something creative with your multi-column layout. And you can't email the result to somebody's accounting system — there's no artefact.

**Score it when:** the recipient is a human who could also just look at the page, and "Save as PDF" is an acceptable verb.

## The typography gotchas nobody mentions

Regardless of architecture, three things will bite.

**Fonts must be embedded and licensed for it.** Desktop licences rarely cover server-side embedding. Budget for it or use open faces — we subset Inter and Source Serif into the template so documents stay under 120KB even with two families.

**Numbers need tabular figures.** An invoice column rendered with proportional digits never aligns, and accountants notice before designers do. `font-feature-settings: "tnum"` — verify your font actually ships the feature.

**Colour is not guaranteed.** Documents get printed on mono lasers in warehouses. If meaning lives only in colour — a red "overdue", a green tick — you've shipped a document that lies when photocopied. We treat every PDF template as a [dark-mode-style dual palette problem](/journal/web-design/colour-systems-dark-mode): test it in greyscale once a quarter.

## Performance and cost, in numbers

From our last three pipelines, illustrative but honest:

- Headless Chrome, warmed pool of 4 workers: ~900ms median per A4 document, roughly $40–70 per million pages in compute.
- Programmatic (pdf-lib) rendering of a fixed-layout certificate: ~12ms median, and the limiting factor became the database.
- Print CSS: free, forever, until support tickets about Safari start.

Version your templates. A statement generated in March must re-render identically in a dispute in November. We snapshot the rendered HTML alongside the PDF — cheap insurance, and it's what let us regenerate two years of Copperline statements after a branding change without touching the archive.

## When PDF is the wrong answer

Frequently. Ask what the recipient actually does with the document. If the answer is "reads it once," a responsive web page with a print stylesheet is kinder to build and kinder to open on a phone. If the answer is "imports the figures," send CSV or an API — a PDF that someone re-keys is an API with extra steps. Reserve the file for the three cases it's genuinely unbeatable: a legal snapshot, an artefact for a system you don't control, and something a human will print and put in a folder. Every other "we need PDFs" request we've interrogated turned out to be one of the first two — or a dashboard export, which is a [table design problem](/journal/product/data-dense-tables-ux) wearing a file format's clothes.

If you're scoping this on a build, our [estimating playbook](/journal/playbooks/estimating-software-projects) has the questions we ask before quoting a reporting feature — pagination requirements alone can swing an estimate by a week. And if your team would rather not own the pipeline at all, this is squarely the kind of plumbing our [product engineering squad](/services/product) builds and hands over.

## Key takeaways

- Choose generation architecture by volume and layout variability: headless Chrome for rich layout at moderate volume, programmatic composition for fixed layout at high volume, print CSS when "save as PDF" is acceptable.
- Pagination, headers, footers and page numbering are where headless-Chrome projects go over budget. Prototype the ugliest page first.
- Embed subsetted, licensed fonts; use tabular figures for numeric columns; test every template in greyscale.
- Snapshot the source HTML next to each generated PDF so documents can be faithfully regenerated years later.
- Interrogate the request: a surprising share of "we need PDF generation" is actually an export, an email, or a print stylesheet.

## FAQ

**Should HTML still be the source of truth for the PDF template?**
Usually yes. It keeps the document in the same component and token system as the product, and non-engineers can review it in a browser. We only drop to programmatic composition when volume makes a browser pipeline uneconomic.

**How do we handle charts inside generated PDFs?**
Render them to SVG server-side (almost every charting library can), inline the SVG in the template, and pin every font and colour explicitly — never inherit from page defaults. Avoid canvas-based charts in headless Chrome unless you wait for a "render complete" signal; the classic bug is a blank chart in every tenth document.

**What about accessibility — do PDFs need it too?**
Yes, if they carry information users need. Tagged PDF with proper reading order is achievable from HTML sources (Chrome emits reasonable tags from semantic markup), but table-heavy documents usually need manual checking with a PAC-style validator. Budget half a day per template per year.

**Is it worth building our own renderer service?**
Only above roughly 100k documents a month, or when data residency rules out hosted rendering. Below that, the operational surface — browser updates, font caches, queue depth — costs more than it saves.
