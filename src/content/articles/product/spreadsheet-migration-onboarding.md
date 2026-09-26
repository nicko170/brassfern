---
title: "The spreadsheet migration is the real onboarding"
description: "Most B2B onboarding is a spreadsheet migration wearing a wizard's hat. Column mapping, dry-run imports, inline validation, and the week-one trust dividend."
slug: spreadsheet-migration-onboarding
cluster: product
tags: [CSV import, data migration, onboarding, validation, B2B products]
date: 2025-06-19
author: Felix Brandt
keywords: [CSV import UX, data migration onboarding, spreadsheet import design, import validation UX, product onboarding]
readingTime: 10
---

Ask a B2B product team to describe their onboarding and they'll show you a welcome modal, a checklist, maybe a product tour. Ask their new customers and you'll hear a different story: "week one was getting our data out of the spreadsheet." For a huge class of products — CRMs, accounting tools, booking systems, anything that manages records — the onboarding *is* the migration. Everything else is decoration hung on it.

This matters because the spreadsheet is not just a data source. It's the incumbent. It holds years of slightly-wrong reality, it belongs to someone specific (usually named Deb, always load-bearing), and the new product's first real test is whether it can accept that reality without humiliating the person who maintained it. Teams that treat import as plumbing fail that test in week one and never fully recover the account. This piece is the playbook we give squads: parse generously, map visually, validate in place, run dry, and make the whole thing reversible.

## Why the spreadsheet wins (until it doesn't)

Nobody wakes up wanting your schema. They have `clients_FINAL_v3_USE-THIS-ONE.xlsx`, and it works — it has survived three staff departures and an office move. It encodes decisions your product doesn't know about: the "Status" column has seven values, two of which are typos that have become load-bearing, and the notes column contains information that is technically six different fields in a trench coat.

The design implication: the import flow is not a file picker and a progress bar. It's a negotiation between your data model and theirs, and the user is the interpreter. Your job is to make interpretation fast, forgiving and legible. When we rebuilt the estimate-to-onboarding path for [Brightline Solar](/work/brightline-solar-quote-engine), the unglamorous truth was the same: the sales team's spreadsheet was the product they were already using, and the "quote engine" only earned adoption once importing the old pipeline took minutes instead of a consultant.

## Step one: parse like you expect chaos

Every real-world CSV is a little broken. The parser should assume:

- **Encoding roulette.** Legacy Windows exports produce CP1252; your `₤` will arrive as mojibake. Auto-detect, and show a preview early enough that the user catches garbage before committing.
- **Delimiter dishonesty.** Semicolon-delimited files named `.csv`, tab-separated values, and the classic: commas inside unquoted notes fields. Sniff, don't trust the extension.
- **Header ambiguity.** Sometimes row one is headers, sometimes it's a title row and headers are row two, sometimes there are no headers at all.
- **Type soup.** Dates in four formats within one column, phone numbers with country codes mixed with locals, "N/A" where a number belongs.

The engineering answer is a normalisation pipeline with tolerant readers and a typed intermediate representation — the same philosophy as [one shared validation schema](/journal/engineering/schema-validation-shared-contracts): parse the mess once, at the boundary, and let everything downstream deal in clean types. The UX answer is a preview table that shows the file *as parsed*, with row counts, so "we read 1,847 rows of 12 columns" is confirmable at a glance.

## Column mapping is the core interaction — treat it that way

Matching their columns to your fields is where imports live or die. The patterns that work:

**Auto-match aggressively, confirm visually.** Fuzzy-match headers to fields ("Company" → Account name, "e-mail" → Email, "Contact (1st)" → First name) and present the mapping as a full-width table: source column on the left, your field on the right, sample values flowing across. Sample values are the trick — a human can verify "yes, that's the email column" in milliseconds by *looking at the values*, where header names alone are ambiguous. Show two or three example rows inline.

**Make non-obvious mappings cheap.** Support calculated or transformed mappings without leaving the flow: split "Full Name" into first/last, concatenate two columns, map a set of literal values ("Active", "active", "A", "Current" → Active). If the user has to go back to Excel to fix a structural mismatch, a meaningful percentage never come back.

**Let them ignore columns gracefully.** Every spreadsheet has columns that don't belong in your product. "Don't import" should be one click, per column, with a count of what's being left behind.

**Save the mapping.** Repeat imports (multi-entity rollouts, monthly backfills, the inevitable second attempt) should resume from the saved mapping, not from scratch. This is table stakes for anything imported more than once and unbelievably often skipped.

## Validation: echo errors back where they live

The cardinal sin of import UX is the post-hoc error report — import "fails" with a downloadable CSV of 400 invalid rows, and the user is asked to fix them offline, re-upload, and pray. That's a rejection letter, not a tool. The alternative is validation *in the mapping table*, before anything is committed:

- **Summarise by column, list by row.** "Email: 38 of 1,847 rows invalid" with the rows click-through-filterable. The summary answers "how bad is it"; the list answers "show me."
- **Fix in place.** Inline editing of bad values directly in the preview — no round trip to Excel. An invalid email highlighted in the cell, editable, re-validated on blur, with the summary count ticking down. This is the single most trusted feature in every import flow we've shipped, and it's the same principle as [form architecture at scale](/journal/engineering/form-architecture-scale): errors belong next to the field, not in a toast.
- **Explain in the user's nouns.** "Row 1,204: 'john.smith@' is not a valid email" beats "ValidationError: email format." We covered the tone rules in [error messages that de-escalate](/journal/product/error-messages-that-help) — imports are where those rules earn their keep at industrial volume.
- **Offer policies, not just errors.** For every class of problem, give the option to skip those rows, set a default, or fix inline. "Skip 38 rows and import the rest, then let me download just the skipped ones" turns a blocker into a decision.

## Dry runs, undo, and the trust dividend

Trust is built in the moment of commitment. Two mechanics make it:

**The dry run.** There's no structural reason the first pass through the pipeline must write to the database. Run the full validation and transformation against a shadow copy and report: "Import will create 1,204 contacts, update 89, skip 38 (fix or skip). 0 errors remaining." A diff-style summary — creates, updates, skips, and *why* — converts blind faith into informed consent.

**Commit that can be rolled back.** An import should land as a labelled batch: `Import #4 — clients_FINAL_v3.csv — 1,204 contacts created`. Every row written carries the batch reference, so "undo import #4" is a scoped, safe operation — not a fantasy. This is the exact architecture from our [undo-first design](/journal/product/undo-not-confirm) piece applied to bulk operations: soft-delete window, visible deadline, recoverable for days. Users who know the import is reversible press the button. Users who don't, schedule another meeting.

The dividend shows up in week one: a clean first import means the account's first real session happens in a product full of *their* data — which, as we argue in [the activation metrics piece](/journal/product/activation-metrics-honest), is usually what your aha-moment actually requires. The correlation we see across [product builds](/services/product) is consistent enough to plan around: accounts whose first import completes without assistance activate faster and raise materially fewer data-shape support tickets in month one.

## The honest edge cases

A few things this playbook doesn't make easy, said plainly:

- **Duplicates.** Matching "do I already have this contact?" is genuinely hard (names differ, emails change). Offer explicit match keys, show prospective duplicates in the dry run, and never silently merge.
- **Big files.** Past ~50k rows, move to asynchronous processing with progress and a resumable session; the preview/edit-in-place UX samples a window of rows, not the whole file. Tell the user that's what's happening.
- **Referential data.** Importing orders that reference customers means order-of-operations and dangling references. Multi-file imports need a dependency step; pretending they don't corrupts ledgers.
- **The spreadsheet that isn't.** A third of "CSV imports" in practice start life as exports from the *previous SaaS*. If you know the competitor formats, ship named presets — "Importing from ToolManager? Here's the mapping" — it's the cheapest competitive feature you'll ever build.

## Key takeaways

- For record-keeping products, the import flow *is* onboarding; treat the spreadsheet as the incumbent you're replacing, not a file format.
- Parse generously: encoding, delimiters and header rows all misbehave in the wild. Show an early parsed preview with counts.
- Column mapping is the core interaction: fuzzy auto-matching verified by sample values, in-flow transforms, per-column skip, saved mappings.
- Validate in place with column summaries, inline fixing, user-noun error messages, and skip/default policies.
- Commit through a dry run and a labelled, reversible batch. Users import boldly when rollback exists — and week-one trust compounds from there.

## FAQ

**How long should a good import flow take a user?** For a clean 2,000-row CSV with a sensible file, under fifteen minutes including mapping. If yours regularly takes longer, the bottleneck is almost always mapping rework or error round-trips, both fixable in the table.

**Should we support Excel files or just CSV?** Yes — `.xlsx` support via a battle-tested parser is cheap and removes a conversion step where files get mangled (formats stripped, dates munged). Accept both, parse identically.

**Is an import wizard or a blank-canvas table better?** Wizard for first-run (mapping → validate → review → commit), then a repeatable, resumable surface for subsequent imports. Power users outgrow wizards; first-timers drown without one.

**What do we do with rows the user skips?** Never silently drop them. Offer a downloadable "skipped rows" artifact with the reason per row — it's the receipt that lets the person responsible for the source data close the loop.
