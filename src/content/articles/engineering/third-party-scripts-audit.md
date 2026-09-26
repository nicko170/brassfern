---
title: "Auditing third-party scripts before they audit you"
description: "Third-party scripts are a governed supply chain, not a paste bin. Our audit method: measure the cost, gate on consent, fence with CSP, and assign every tag an owner."
slug: third-party-scripts-audit
cluster: engineering
tags:
  - performance
  - security
  - governance
  - privacy
date: 2026-01-23
author: Felix Brandt
keywords:
  - third party scripts audit
  - tag management governance
  - content security policy
  - performance marketing scripts
  - consent management
readingTime: 9
---

Somewhere between the analytics platform and the seventh "just drop this snippet in" email, most marketing sites accumulate twenty to sixty third-party scripts. Each arrived with a reason. Almost none have an owner, a removal date, or a measurable cost attached. Collectively they are often the single largest line item in a page's performance budget, the largest surface in its security posture, and the least-reviewed code running in front of customers.

That is backwards. Third-party scripts are a supply chain — you are executing strangers' code, with your users' trust, on your pages. This is the audit we run at the start of engagements, and the governance we leave behind so the problem stays solved after we leave.

## Step 1: The inventory (you will not enjoy this)

Start by listing every external origin that executes code or sets state on your pages. Three sources, cross-referenced, because any one of them lies:

- **The network waterfall.** Run WebPageTest or a simple DevTools capture across your top ten templates — home, a landing page, product/article, checkout or conversion page — and export every third-party domain.
- **The tag manager container.** Export it. Note which tags fire on which triggers, and which fire on "All Pages" (read: nobody decided where they fire).
- **The codebase.** Grep for `script src`, `iframe`, and suspicious inline blobs. The scripts hardcoded by a contractor in 2022 that the tag manager doesn't know about are always the interesting ones.

For each script record: vendor, business purpose, who requested it, when, on which templates it loads, whether it's consent-dependent, and the date it was last validated as needed. That last column will be mostly empty. That emptiness is the finding.

## Step 2: Price every script in milliseconds and kilobytes

Vendors never quote you the cost of their snippet, so measure it. Per script, on a mid-range mobile profile:

- **Transfer and parse cost** — total bytes attributable to the origin (scripts often chain-load more scripts; measure the tree, not the tag).
- **Main-thread time** — long-task attribution in a performance trace. A 40kb script that chews 240ms of main thread on load is worth more concern than a lazy 300kb one.
- **Layout and interaction effects** — does it inject DOM (chat widgets, banners) that shifts content or blocks interaction?

The method that converts stakeholders: **remove-and-measure**. Block one origin at a time (a request-blocking rule per origin in DevTools or WebPageTest) and re-run. Present results as a table — script, bytes, main-thread ms, INP impact — next to the column "business purpose from Step 1." When a heat-map tool that one person opened twice last quarter turns out to cost 300ms of interaction readiness on mobile, the conversation ends itself.

We hold these against the same [170kb bundle budget](/journal/engineering/bundle-budget-discipline) and [Core Web Vitals targets](/journal/engineering/core-web-vitals-field-guide) we hold our own code to. Third parties do not get a sympathy allowance.

## Step 3: Consent gating, honestly implemented

If a script needs consent — analytics, advertising, personalisation — it must not execute before consent. "Must not" means no network request to the vendor at all, not "load the script and ask it nicely to behave." A tag that phones home before the banner is answered is a compliance incident with a friendly UI on top.

The pattern we standardise:

1. A **consent state** stored first-party (cookie or localStorage) with a small API: `consent.for('analytics')` returns granted/denied/unknown.
2. The tag manager (or direct loader) reads that state per category before injecting anything. Unknown means denied.
3. When consent changes, scripts load dynamically — no page reload required.
4. A **server log or debug flag** proves the gating works. We've caught "consent-aware" tag-manager configurations silently firing in preview mode more than once. Trust, then verify in the network panel.

Analytics folk worry about data loss from gating. Some loss is real and honest; inflated pre-banner numbers were never yours. A [tracking plan with explicit purpose per event](/journal/growth/analytics-governance) survives gating far better than a firehose.

## Step 4: Facades, fences, and server-side moves

With the list priced and gated, shrink what's left:

**Facade everything heavy and optional.** Chat widgets, video embeds, social embeds: render a static placeholder that matches dimensions (no layout shift), and load the real third party on interaction or on intersection. A YouTube facade swap routinely saves 500kb and a second of main-thread time per embed.

**Move what you can server-side.** Vendor APIs called from the browser expose keys, add client waterfall time, and die to ad-blockers. Event collection, personalisation and even some experimentation bucketing increasingly belong on the server or at the edge — we've written about the trade-offs of [routing experiments at the network layer](/journal/engineering/edge-rendering-honest-guide). The browser gets a first-party endpoint; the vendor relationship stays yours.

**Fence the rest with CSP.** A Content Security Policy with an explicit `script-src` allowlist turns "anyone with tag-manager access can run arbitrary code in our users' browsers" into a reviewable change. Add `upgrade-insecure-requests`, lock `frame-src` to the embeds you actually use, and run the policy in report-only mode first with a reporting endpoint so you can see what would break before it does. Subresource Integrity on anything pinned to a versioned CDN file. This is a day's work that reclassifies an entire class of breach from "catastrophe" to "console error."

## Step 5: The tag-ownership register (the part that makes it stick)

Audits decay. Six months after any cleanup, entropy wins — unless ownership is structural. We leave clients a one-page register that engineering and marketing share:

| Field | Example |
| --- | --- |
| Script / tag | HeatInsight session replay |
| Owner (a person, not a team) | K. Alvarez, performance marketing |
| Business purpose | Landing-page friction analysis for Q3 experiments |
| Consent category | Analytics |
| Templates | Landing pages only (never checkout) |
| Cost budget | ≤ 60kb, ≤ 80ms main thread |
| Review date | 2026-06-30 (expires unless re-signed) |

Two rules make it real: **every tag has an expiry date** (renewal requires the owner to argue for it against its measured cost), and **adding a tag requires a register entry before it ships** — enforced socially in tag-manager access reviews, and enforced mechanically by CSP blocking anything unlisted. Marketing keeps the velocity they need — a sanctioned path measured in days, not a Jira queue measured in quarters — and engineering gets a supply chain with a bill of materials. This is the same governance instinct behind good [experiment design](/journal/growth/cro-experiment-design): tools serve a question with a kill date, they don't accrete.

## Step 6: Schedule the next audit

Set a quarterly 45-minute review: rerun the inventory diff, check the register for expired tags, re-price the top five scripts. The first audit is archaeology; every one after that is hygiene.

We include this in the first month of every [growth engagement](/services/growth), because performance marketing and site performance are the same budget whether the org chart admits it or not. The sites that stay fast are not the ones with the most discipline. They are the ones where speed has a mechanism.

## Key takeaways

- Third-party scripts are a supply chain: strangers' code executing with your users' trust. Treat them with supply-chain discipline.
- Inventory from three sources — network waterfall, tag manager export, codebase grep — because each one hides scripts the others miss.
- Price every script in bytes and main-thread milliseconds using remove-and-measure blocking; put the cost next to the business purpose in one table.
- Consent gating means zero vendor requests before consent, not loaded-but-well-behaved scripts. Verify in the network panel.
- Facade heavy embeds, move vendor calls server-side where possible, and fence the rest with an allowlist CSP plus SRI.
- Governance sticks when every tag has a named owner, a cost budget and an expiry date — and CSP blocks anything unregistered.

## FAQ

**Our tag manager is "marketing's tool" — how do we get engineering involved without a turf war?**
Frame it as shared infrastructure: the tag manager is a deployment pipeline that ships code to production, and it deserves the same access control and review as any other pipeline. In practice: marketing keeps publishing rights within the register's rules, engineering owns the CSP and the quarterly cost review, and both sign the register. Teams that fight over the tool are usually fighting over a missing process.

**Won't consent gating destroy our analytics data?**
It changes what the numbers mean, for the better. Pre-banner hits were partly bots, partly people about to decline. Post-gating numbers are smaller and honest, and trend comparisons stay valid as long as the gating is consistent. What gating does destroy is any model that silently assumed 100% coverage — which was fiction anyway.

**Is a CSP worth the effort on a marketing site?**
Yes, and it's cheaper than people assume. Run report-only for two weeks, fix what the reports surface, then enforce. The payoff is not hypothetical: when a vendor gets compromised — and vendors get compromised — an allowlist CSP is the difference between reading about it in the news and reading about it in your incident channel.

**How do we handle a script the business genuinely needs that's genuinely slow?**
In order: negotiate with the vendor (some offer lighter tiers or server-side options), confine it to the templates where it earns its cost, load it after interaction or idle, and record the accepted cost in the register as a budget line. An accepted, measured, owned cost is fine. An invisible one is the disease.
