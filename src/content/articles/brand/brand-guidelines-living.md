---
title: "Kill the brand PDF: living guidelines that get used"
description: "Guideline PDFs rot in shared drives while brands drift. What actually replaces them: living guideline sites with tokens, patterns, versioning and honest governance."
slug: brand-guidelines-living
cluster: brand
tags: [brand guidelines, brand governance, design tokens, brand portal, identity systems]
date: 2025-06-11
author: Mara Ellison
keywords: [brand guidelines website, living brand guidelines, brand portal, brand governance]
readingTime: 8
---

Every agency has delivered it: the 90-page brand guidelines PDF, lovingly typeset, opened perhaps eleven times, then archived to a shared drive path nobody can quite remember. Eighteen months later the client's marketing team is cropping the logo in PowerPoint, a new starter is recreating colours with an eyedropper, and the rebrand that cost a quarter of a million dollars is being held together by the one designer who was there at the time.

The PDF isn't the failure. The *format* is the failure. Guidelines are infrastructure for decision-making, and infrastructure that's static, unsearchable, and unversioned will be routed around. The fix is a guideline site — the brand documented as a living web application — and after building several, we have firm opinions about what they need to earn daily use.

## Why the PDF dies

A guidelines PDF fails four ways, all structural:

**It can't be searched at the moment of need.** Nobody reads guidelines. People arrive with a specific question — "can the logo go on photography?" — at 4:45pm before a deadline. A PDF answers that with a table of contents and hope. A site answers it with a search box.

**It freezes at its least-informed moment.** Guidelines are written before the brand has met reality: before the first accessibility audit, before the product team needs dark mode, before legal asks about co-branding. The questions that matter most are discovered *after* publication, and a PDF has no mechanism to absorb the answers.

**It separates the rule from the resource.** "Use the primary green" in a PDF means a hex code someone retypes into Figma, code, and email templates — three chances for drift. A site can sit *on top of* the actual tokens and assets, so the documentation and the material are the same artefact.

**It has no telemetry.** A PDF tells you nothing about what people actually look up. A site tells you the logo-download page gets 40 visits a month and the voice section gets zero — which is exactly what you need to know before investing in [better voice documentation](/journal/brand/brand-voice-charts).

## What a living guideline site actually is

Strip away the portentous phrase "brand portal" and a guideline site is four sections, done properly:

**Foundations.** Logo behaviour, colour, typography, spacing, tone of voice, motion. Each page pairs rules with live, rendered examples — not screenshots of examples, which is how PDFs lie, but the real components and real type rendering in the browser. When we rebuilt the guidelines for [Hearthbrew's brand system](/work/hearthbrew-brand-system), the colour page rendered actual swatches driven by the same token file the storefront consumed; change the token, and the documentation and the product change together.

**Patterns with do/don't pairs.** Abstract rules ("maintain clear space") get ignored; concrete pairs get remembered. Every contentious rule gets a side-by-side: the logo placed correctly versus stretched, on-brand photography treatment versus the stock-photo-with-overlay crime. Don't examples do more governance work than principles — they give internal teams something to point at when a partner agency goes rogue.

**Downloads that are actually governed.** Assets served from the site itself — logos in every tier and format (see [logo systems, not logos](/journal/brand/logo-systems-not-logos) for the tiering), icon sets, type files with licence notes attached, templates. Where licences restrict redistribution (custom type is the usual case), the site states who may request access and from whom, instead of pretending the restriction away.

**The machine-readable brand.** A design tokens package — npm, JSON, Figma variables export — versioned like any dependency, so product teams consume the brand the way they consume any other API. This is the single highest-leverage piece: it converts governance from policing into plumbing. Our piece on [testing design tokens in CI](/journal/engineering/design-tokens-pipeline-ci) covers the mechanics; the brand-side point is that once tokens are code, "off-brand" becomes a failing test, not an awkward email.

## Versioning: the unglamorous killer feature

Brands evolve, and undocumented evolution is how you end up with three "current" blues in circulation. A guideline site versions like software:

- **A changelog**, dated, human-written: what changed, why, and what it supersedes. "v2.3 — April 2026: added dark-mode colour guidance and deprecated the legacy gradient" is worth more than any principles page.
- **Deprecations with dates.** Old assets don't vanish silently; they're marked deprecated with a removal date and a migration note. Campaigns in flight get to finish; new work uses the new thing. This is the difference between governance and vandalism.
- **Semver discipline for tokens.** Breaking changes (renames, removed values) bump the major version and come with a migration guide. Product teams already understand this contract; brand teams should speak it.

Versioning also changes the politics of updates. "The guidelines are wrong" used to mean "the PDF is wrong, forever, and everyone knows it." Now it means "file an issue" — and yes, the best guideline sites we've shipped have a visible feedback route, because the people hitting edge cases daily are the brand's cheapest research department.

## Governance without the brand police

The fear behind the PDF is defensible: without a locked document, won't the brand drift? In practice the opposite happens. Drift thrives on ambiguity, and static documents *maximise* ambiguity — they're stale by definition, so everyone learns to treat them continually as negotiable. A living site can be specific about what's settled and what's in progress, which paradoxically makes it more authoritative.

Governance, done well, is three habits:

**An owner with a name.** Not "the brand team" — a person, listed on the site, with response-time expectations. Brands without a named owner decay at the speed of their busiest requester.

**A release cadence.** Quarterly is about right: often enough that the site never feels frozen, rare enough that changes are considered. Batch feedback, decide, publish, announce. The announcement matters — an internal post saying what's new trains the organisation to check the changelog before asking.

**Usage analytics, read honestly.** Most-viewed pages tell you where the organisation is working; most-searched terms tell you what's missing; zero-view pages tell you what to delete or rewrite. We've retired entire guideline sections because the data said nobody needed them — a discipline borrowed from [our analytics governance practice](/journal/growth/analytics-governance), tracking plans before dashboards.

## What it costs, honestly

A guideline site isn't free. Expect a meaningful build — design systems tooling, content work, asset preparation — and a real but modest ongoing cost: a few days a quarter of stewardship. For most post-rebrand clients the build lands between 10% and 20% of the identity programme's cost, and the stewardship is usually folded into a retainer.

The comparison that matters isn't site-versus-PDF price. It's site cost versus the cost of drift: the external agency redoing templates because they couldn't find current assets, the product team maintaining three divergent colour palettes, the forty-person Slack thread titled "which logo??". Drift is expensive and invisible; the site is affordable and auditable. And a good one outlives the rebrand — the [rollout plan](/journal/brand/rebrand-rollout-plan) ends, but the guideline site is where the brand actually lives from then on.

## Key takeaways

- PDFs fail structurally, not editorially: they're unsearchable, frozen, disconnected from assets, and blind.
- A living guideline site is four things: foundations with live examples, do/don't pattern pairs, governed downloads, and a machine-readable token package.
- Version with a changelog, dated deprecations, and semver for tokens. Undocumented evolution is how three blues happen.
- Govern with a named owner, a quarterly release cadence, and analytics used to prune — not surveillance.
- Budget 10–20% of the identity programme for the build, plus light quarterly stewardship. Compare it to the cost of drift, not to a PDF.

## FAQ

**Should the guideline site be public or behind login?**
Mostly public, with licensed assets (custom type, some templates) gated. Public guidelines help partners, press and recruiters use the brand well, and they signal confidence. Gate only what licences or legal genuinely require.

**We're a 15-person company. Is this overkill?**
Scale it, don't skip it. A single well-structured page with live examples, a tokens file and a downloads section beats a 90-page PDF at any size. The discipline matters more than the surface area.

**How do we migrate from an existing PDF?**
Don't transcribe it. Catalogue every question the team has asked about the brand in the last year — that's your real table of contents — and build pages that answer those, carrying over from the PDF only what's still true.

**How do guidelines and the product design system relate?**
The guideline site owns *meaning* (voice, identity rules, why), the design system owns *components* (buttons, inputs, how). They link to each other heavily and share the token package as their single source of truth.

**Who writes the changelog?**
The named owner, in plain language, quarterly. If writing the changelog feels like a chore, the cadence is wrong — a quarter where genuinely nothing changed is a finding worth publishing too.

*Living guidelines are a standard deliverable in our [brand & identity engagements](/services/brand-identity) — because a brand that isn't used is a brand that wasn't built.*
