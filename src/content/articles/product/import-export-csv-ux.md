---
title: "CSV import and export: the UX of tabular handoffs"
description: "CSV imports that survive real spreadsheets (mapping, previews, error files people can fix) and exports people can trust — stable schemas, honest metadata."
slug: import-export-csv-ux
cluster: product
tags: [CSV, import, export, data design, enterprise UX]
date: 2025-09-18
author: Tomás Reyes
keywords: [CSV import UX, data import design, bulk import product design, export UX, spreadsheet onboarding]
readingTime: 10
---

Somewhere in your product's future there is a spreadsheet. A customer's operations manager has exported six years of history into a CSV with 14,000 rows, three of which are broken in ways that will take an engineer an afternoon to diagnose. Your import flow is about to meet that file. How it behaves in the next ninety seconds determines whether the customer adopts your product or opens a support ticket titled "import not working" and quietly churns.

Import and export are the handoff surfaces of software — the places where your product takes responsibility for data it didn't create, or releases data into tools it doesn't control. They're chronically under-designed because they feel like plumbing. They're not. For most B2B products, the import *is* the onboarding, and the export *is* the procurement answer. This is how we design both.

## Design for the file you get, not the file you asked for

Every import spec starts with a beautiful template: canonical headers, ISO dates, UTF-8, comma-delimited. No customer has ever sent this file. What arrives instead:

- Headers in the customer's language, their old tool's export format, or their personal shorthand (`Cust. name (billing)`).
- Dates in five formats in one column, including the immortal `12/06/2025` that means June in Adelaide and December in Ohio.
- Encoding from 2009. Smart quotes. A stray `\r`. Rows where someone merged cells for "readability".
- A totals row at the bottom that your parser will import as a very strange customer named "TOTAL".

The mental model fix: **the importer is a translator, not a validator.** Validators reject. Translators interpret, then show their working. Every decision the importer makes on the user's behalf must be visible and overridable.

Concretely, that means fuzzy header matching with a stated confidence. `Cust. name (billing)` maps to "Customer name" — say so: "We matched 11 of 14 columns automatically. Check the three below." Unmatched columns collect in a mapping step with searchable dropdowns of your schema, recent matches remembered per account. Never silently drop a column; "Skip this column" is a decision the user makes, not a default you apply. We build the mapper like a [data table for people who live in them](/journal/product/data-dense-tables-ux) — sticky column-header row (the user's headers, not yours), keyboard navigable, with the first three data rows shown so mapping is grounded in evidence, not header guesswork.

## The preview is the product

The single highest-leverage screen in import design is the preview: what will actually happen when this file lands. Not a summary ("14,000 rows ready") but a truthful sample — the first rows, the last row (that's where the TOTAL lives), and any rows flagged as problems, rendered as they will exist in your system.

A good preview answers three questions in ten seconds: did the columns land in the right fields, did the values survive interpretation (dates, currencies, phone numbers), and what is the damage report. The damage report wants numbers with dignity: "13,982 rows will import cleanly. 18 rows have issues." Not "some errors occurred."

Row-level issues need row-level addresses. "Error on row 4,102" is usable; "invalid email format" with no location is a treasure hunt. And the resolution path must not require re-uploading the whole file to fix three rows — let people fix values inline in the preview, or download a file of just the failures (next section), fix in their spreadsheet tool, and upload *that*. Re-processing a 14,000-row file to correct a typo is punishment, not validation.

## Error files people can actually fix

When rows fail, the output artifact is the whole game. We've settled on a contract after watching enough customers fail imports twice and give up:

**The error file is the input file, annotated.** Same columns, same order, same values — plus one appended column, `Import issue`, written for a human: "Email appears twice in this file (also row 8,331) — imports must be unique per customer." Not `ERR_DUP_KEY`. The user fixes the red cells, re-uploads this exact file, and it imports cleanly because nothing about the structure changed. Every deviation from "give them their own file back" is friction you invented.

Duplicate handling deserves its own sentence because it's the most common hard failure. State the rule ("email must be unique per account"), show *both* rows in conflict with their row numbers, and offer the merge decision at the conflict, not in a settings screen three levels away.

Report partial success honestly. "12,400 of 14,000 rows imported" with the failure file attached is a good outcome and should look like one — not a red banner that implies catastrophe. The visual register matters: this is a yellow-and-done state, not an error state. The same tonal discipline we apply to [error messages that de-escalate](/journal/product/error-messages-that-help) applies here, just at spreadsheet scale.

## Import is onboarding; design the first five minutes accordingly

For products that replace an incumbent, the import is often the first real thing a trial user does. It deserves onboarding-grade thinking:

- **Offer the realistic path first.** "Moving from spreadsheets or another tool?" with the three most common source formats pre-configured beats a generic "Upload CSV." If you know Competitor X's export format, matching it flawlessly is a conversion feature.
- **Show the template, but don't require it.** A downloadable template is a reference document, not a gate. Requiring your exact format upfront filters out everyone with an existing file — which is everyone.
- **Run big files in the background with a receipt.** Anything over a few thousand rows gets a job, a progress state, and an email when it finishes. The receipt is not "your import finished" — it's the damage report: imported, skipped, failed, with a link to the error file.
- **Make the first import undoable.** An "Undo this import" that removes exactly the rows the job created — available for, say, seven days — converts terrifying into safe. It's the same reversible-software discipline as [undo over confirm](/journal/product/undo-not-confirm), applied to a bulk operation. If your data model can't support scoped removal of an import batch, that's an architecture conversation to have now, before the feature ships. The mechanics rhyme with [type-safe content at the boundary](/journal/engineering/type-safe-cms-content): validate at the edge, tag provenance, keep the escape hatch.

We did this on the [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild), where the entire trial conversion hinged on importing years of bookkeeping history. The import's undo window and its error file ("your file, with a notes column") were cited in sales calls as the reason finance teams said yes. Illustrative as our numbers are, the directional lesson is real: import quality is a sales asset.

## Exports are a promise about the future

Export design gets less attention than import because the unhappy path is quieter — nobody files a ticket saying "your export subtly wasted three hours of my analyst's time." They just stop trusting your numbers. The rules:

**Stable schemas are a public API.** When a customer's finance team builds a spreadsheet model on your export, every column you rename or reorder breaks their model. Version the format, announce changes, offer the legacy format for a deprecation window. Treat your CSV schema with the seriousness of a REST endpoint, because for your customer's downstream tooling, that's what it is.

**The export must say what it is.** Filename: `invoices_2025-01-01_to_2025-09-30_aud.csv`, not `export (7).csv`. Inside the file or alongside it: the filters that were applied, the timezone of the timestamps, the currency (in minor units if you're serious), and the moment of generation. A CSV that can't answer "as of when, filtered how?" creates reconciliation meetings. We've watched a client's ops team lose an afternoon to two exports from the same screen an hour apart with different numbers and no way to see why. (One had an unstated status filter. Never again.)

**Export everything or say why not.** The export that contains 80% of the visible columns — silently missing the two the user needed — teaches people that your export lies. If a column can't be exported (computed, licensed), the export surface should say so before the click, not after the pivot table.

**Big exports are jobs too.** Stream them, email the link, expire the link, log who pulled it. Exports are also a data-governance surface: in any team product, the ability to export everything is a permission, and it belongs in the same [roles and permissions conversation](/journal/product/roles-permissions-ux) as everything else sensitive.

## Key takeaways

- The importer is a translator, not a validator — it interprets messy real files and shows its working; every automatic decision is visible and overridable.
- The preview screen is the product: truthful samples, a dignified damage report, row-level addresses for problems, and fixes that don't require re-uploading the whole file.
- The error file is the input file plus one human-written column of notes. Users fix it in their own tools and re-upload it unchanged.
- First imports need onboarding-grade care and a seven-day undo; import quality is a conversion feature, not plumbing.
- Exports are promises: stable versioned schemas, self-describing files (filters, timezone, currency, generated-at), and completeness you state honestly.

## FAQ

**How much fuzzy matching is too much?**
Match aggressively, display confidently, decide conservatively. Auto-match headers at high confidence, but anything ambiguous lands in the manual mapping step with your best guess pre-selected. The failure mode is silent wrong matches — a confident guess the user never saw. If you can't show the match, don't make the match.

**Should we validate strictly on upload or import-then-report?**
Validate on upload, before the job runs — failing a user after twenty minutes of background processing because row one has a bad date is theft of their evening. Structural validation (headers, encoding, date formats, duplicates) is instant; only genuinely heavy work (uniqueness against the live database, derived computations) belongs in the background job.

**Excel files — support them?**
Yes, reluctantly, because that's what finance teams actually have. Parse the first sheet by default and *say which sheet you read*. The multi-sheet workbook with the real data on sheet four is a classic silent failure. Everything else about the flow — mapping, preview, error files — stays identical.

**How long should import undo windows be?**
Long enough for someone to notice a problem: seven days is our default, matching most teams' weekly reconciliation rhythm. The window must be visible on the import receipt ("This import can be undone until 25 Sep"), and the undo must be scoped to exactly the rows the job created — otherwise you're offering to delete their older data too, which is a very different button.

**Do we need API import in addition to CSV?**
For most B2B products, CSV first, API later — CSV is the universal adapter and sales demos with it. But design the CSV importer as a thin layer over an internal, well-typed import pipeline, so the API (and the definition-of-done reuse across [product work](/services/product)) is inevitable rather than a rewrite.
