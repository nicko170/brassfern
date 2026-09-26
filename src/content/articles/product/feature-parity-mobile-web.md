---
title: "Feature parity: deciding what mobile doesn't get"
description: "A decision framework for mobile/web feature parity: the task-context matrix, honest de-scoping documents, 'desktop-only' messaging with dignity, and cross-device handoff."
slug: feature-parity-mobile-web
cluster: product
tags: [mobile, responsive design, feature scoping, cross-device, product strategy]
date: 2025-04-08
author: Aiko Tanaka
keywords: [mobile feature parity, responsive product design, mobile app scoping, cross-device ux, desktop only features]
readingTime: 9
---

Somewhere in every product roadmap lives a quiet argument. Half the room believes mobile must do everything desktop does — anything less is a betrayal of users. The other half has seen the estimate for rebuilding the pivot-table editor on a 375-pixel viewport and has gone pale. Both sides are talking past each other, because "parity" is presented as a moral question when it is actually a *budget* question: which tasks, performed in which contexts, justify the cost of a second implementation and a lifetime of double maintenance?

The teams that ship good mobile products — within real budgets — stop arguing about parity in the abstract and start deciding feature by feature, with evidence. This is the framework we run with clients when the "what does mobile do?" question lands on the roadmap. It's the scoping cousin of our [progressive disclosure](/journal/product/progressive-disclosure-complexity) work, and it assumes you've thought about [what complexity earns its place at all](/journal/product/settings-design-neglected-ux).

## The task-context matrix

List every meaningful task in your product — not screens, tasks — and score each on two axes:

- **Frequency in mobile contexts.** Not frequency overall: how often is this task attempted *away from a desk*? Check your analytics by device class and viewport. A task done daily by 2% of mobile users and a task done weekly by 40% of mobile users are entirely different citizens.
- **Context fit.** Some tasks are structurally hostile to small screens (multi-entity comparisons, precise drag operations, anything tabular) or structurally native to them (approve, check, capture, glance). Fit is about the task's shape, not its importance: approving an expense is high-stakes *and* perfect for a phone.

The matrix gives you four honest quadrants:

| | High context fit | Low context fit |
| --- | --- | --- |
| **High mobile frequency** | **Build it well.** This is your mobile core | **Bridge, don't port.** Simplify to a mobile-specific version: the dashboard becomes a digest; the editor becomes a review-and-comment mode |
| **Low mobile frequency** | **Build it cheaply.** Straightforward, worth having | **De-scope honestly.** Desktop-only, with messaging and handoff (below) |

The quadrant fight is always the top-right: high-frequency tasks with poor fit. Resist the temptation to *shrink the desktop UI* — that produces the worst of both worlds, a dense interface nobody can operate at thumb scale. Northwind Ledger's transactional grid compares twelve columns across hundreds of rows; the mobile "version" isn't a grid at all. It's a morning digest — anomalies, approvals waiting, today's numbers — built as if the phone were the primary device for that *task*, which it is. Same data, different product, and nobody misses the frozen columns.

One research note: validate the frequency axis with actual behaviour, not survey answers. Users will tell you they'd "definitely edit the floor plan on mobile" and then, observed, they won't — the survey measures aspiration, the logs measure truth. A fortnight of [honest analytics](/journal/growth/analytics-taxonomy-first) with device-segmented funnels will settle most arguments the workshop can't.

## Write the de-scoping document, and sign it

Parity fails quietly. Without an explicit decision, mobile becomes "desktop, whatever fits," gaps accumulate undocumented, support discovers them via tickets, and roadmap meetings reopen settled questions every quarter. The fix is boring and powerful: a **de-scoping document** — a written, public list of what mobile deliberately does not do, with the reason for each omission attached.

Each entry looks like this:

> **Bulk CSV import — desktop-only.** Reason: file selection, column mapping and error review are all low-fit tasks on mobile; mobile demand in analytics <0.5% of imports. Alternative offered: import via cloud drive link on desktop, monitor import status and errors on mobile. Revisit: when import frequency on mobile exceeds 5% or when the upload API supports resumable mobile uploads cleanly.

Three properties make this document worth its page count. Every entry carries a **reason rooted in the matrix**, not a shrug — "we didn't get to it" is a debt admission, "we decided, here's the evidence" is a strategy. Every entry names the **mobile alternative**, because a de-scoped task should rarely be a dead end. And every entry has a **revisit trigger**, a measurable condition that reopens the question. Revisit triggers are what keep de-scoping honest: they turn "we'll see" into "here's exactly when we'll look again," and they keep the document from becoming a graveyard of excuses.

The document is shared with sales and support, linked from the FAQ, and versioned like the API. When a customer asks "why can't I do this on mobile?" the answer exists, has an explanation, and doesn't make the support agent improvise.

## "Desktop-only" messaging with dignity

When a mobile user does hit the boundary, the interface has one job: communicate the limit without implying the user chose the wrong device. The gulf between good and bad here is small in words and enormous in tone.

Bad: "This feature is not available on mobile." A wall. It says the product is amputated and the user's context is invalid.

Good: "Building automations needs a bigger screen — we'll save your place. Email yourself a link to continue on desktop." The good version does three things: it states the constraint neutrally (screens, not deficiencies), it promises continuity (*your place is saved*), and it offers an immediate action (the send-link handoff). Give it a real button, pre-fill the email, and you have turned a dead end into a device handoff.

One more rule the accessibility-minded already know: never gate a *legally or functionally required* task behind device type. Password changes, privacy exports, invoice downloads — if a user *must* be able to do it, mobile must do it, full stop. Parity is negotiable except where exclusion would be a lock-in.

## Handoff: the product is the same, the device is a detail

The highest-leverage parity feature isn't any single screen — it's **continuity itself**. If state travels, device boundaries dissolve. The pieces are small:

- **Send-to-desktop / send-to-phone links** everywhere a de-scoped task lives, as above.
- **Resumable state.** The draft, the cart, the half-configured report — saved server-side and surfaced on the other device ("You left a draft report open on your phone"). This is the same persistence spine as good [autosave and recovery](/journal/product/session-timeout-autosave-ux); build it once and both features inherit it.
- **Notification as shuttle.** A mobile push that says "Your export is ready" and opens the finished artefact — not the export screen — means the user never needed parity on the *configuration* step at all.

Teams routinely discover that a solid handoff story satisfies three-quarters of the demand that a full mobile port would have — at a tenth of the cost — because most "mobile parity" complaints are actually "I started here and want to continue there" complaints wearing a parity costume.

## When parity is the weapon

All of this said: sometimes full parity is the strategy, and the de-scoping framework is precisely how you find out. Parity is worth its enormous cost when your product's core value is delivered *in the field*: inspection tools for construction sites, clinical workflows at the bedside, retail inventory on the shop floor, logistics at the dock door. In these products the mobile context isn't a segment — it's the job. A de-scoped mobile experience doesn't save money for them; it disqualifies the product.

The tell is in the matrix: when your top tasks all land in "high frequency, and the low fit is *because of legacy desktop design* rather than the task's shape," you're not de-scoping — you're under-investing. The honest build there often pairs mobile-first flows with genuinely offline capability (sync is its own discipline; see our [local-first notes](/journal/engineering/offline-first-sync-engines)) and treats desktop as the *admin* surface. That's a legitimate, often winning inversion — but choose it with eyes open, because inverted parity costs the same as parity, just on the other side.

Whether you're deciding parity for one feature or a whole product, this is intuition's least reliable neighbourhood. Device logs, the matrix, and a signed de-scoping document will save you from both failure modes: the thin-everywhere mobile app built from guilt, and the "mobile is a read-only companion" that's really just an unmade decision. It's the sort of scoping we run inside our [product engagements](/services/product) in the first fortnight, because everything downstream — IA, navigation, [multi-step flow design](/journal/product/multi-step-flows-wizards) — inherits the answer.

## Key takeaways

- Parity is a budget question. Score tasks on mobile frequency and context fit; the four quadrants decide most of the roadmap.
- High-frequency, low-fit tasks get *rethought* for mobile, not shrunk.
- Publish a de-scoping document — every omission with a reason, a mobile alternative and a measurable revisit trigger.
- Boundary messaging should state the constraint, promise continuity and offer a handoff — never scold the device.
- Server-side resumable state dissolves most parity complaints at a fraction of the cost of ports.

## FAQ

**Should we ever do parity "eventually" as a blanket goal?**
No — "eventually" does the harm (planning, user expectation, QA surface) without delivering the benefit. Commit parity per task, with a date, or de-scope it with a revisit trigger. The middle ground is where mobile experiences go to be mediocre.

**What about responsive web vs native — does that change the framework?**
It changes the cost column, not the decision logic. A well-built responsive web app makes "build it cheaply" cheaper and raises the bar for a native app to justify itself at all. The matrix still governs *what*; the platform debate is *how*.

**How do we tell tablet?**
Decide deliberately which column it joins rather than letting the CSS breakpoint decide. Tablets inherit desktop information density with mobile input ergonomics — treat them as desktop-leaning for creation tasks and mobile-leaning for consumption, and test the few you're unsure about.

**Won't users revolt at explicitly de-scoped features?**
Users revolt at surprises and dead ends. A documented de-scope with an alternative and a handoff generates a shrug; a silent gap generates a churn-risk ticket. In our experience support volume on documented omissions rounds to zero.

**Where do we start?**
Pull ninety days of device-segmented task analytics, run the matrix in one workshop, draft the de-scoping document, and add the two highest-quadrant mobile tasks and the handoff links to the next sprint. The framework takes a day; the confidence it buys lasts years.
