---
title: "Plan your exit before you sign: vendor lock-in for agencies and clients"
description: "Every platform decision is also an exit decision. Portability tests, export drills, contract clauses and the abstraction seams that actually matter."
slug: vendor-lockin-exit-plan
cluster: playbooks
tags: [vendor lock-in, platform strategy, procurement, CMS, exit planning]
date: 2025-11-11
author: Felix Brandt
keywords: [vendor lock in, platform exit strategy, cms data portability, headless migration planning, procurement technology risk]
readingTime: 10
---

Somewhere in the second hour of a platform demo, when the vendor's solutions engineer is showing you the AI-assisted layout builder and everyone in the room is quietly nodding, nobody asks the question that matters most: *how do we leave?* It feels rude, like asking about the prenup at the engagement party. But every platform decision is also an exit decision — the only variable is whether you make it during procurement, when you have leverage, or during a crisis migration in year three, when you have none.

This isn't an argument against platforms. Proprietary tools earn their keep constantly, and we've recommended hosted commerce, managed CMSs and all-in-one analytics to clients whose teams would drown maintaining the open-source alternative. Lock-in is a spectrum, not a sin. The argument is for making the choice with eyes open: testing portability before you sign, writing exit into the contract, and rehearsing the departure the way you rehearse a rollback. Here's the hygiene we apply on every engagement.

## The portability test, run before signature

Every serious platform evaluation at Brassfern includes a portability test — a small, practical exercise, not a questionnaire the vendor fills in about themselves. Before the decision meeting, we spend half a day answering five questions by doing them:

1. **Export the content.** Not "is there an export button" — actually press it. What format lands on your disk? Structured JSON with relationships intact, or a zip of HTML strings with your content entombed in presentational markup? A CMS that exports your articles as page-builder serialisations has not exported your content; it has exported *its* content.
2. **Export the media.** Do you get original files with your filenames and folder structure, or renamed derivatives behind URLs that die when the subscription ends?
3. **Export the data that matters commercially.** Orders, customers, subscribers, analytics history. Each in a standard format, each with complete history — not the last ninety days.
4. **Reproduce one thing elsewhere.** Take the exported data and stand up a single page of it in a neutral environment — a static build, a different CMS's sandbox. This is the moment hidden coupling reveals itself: content models that reference platform-specific field types, URLs that only exist via the vendor's routing, images with processing baked into proprietary CDN parameters.
5. **Read the export's terms.** Some platforms technically export your data on a schedule of their choosing, in bulk, for a fee, with thirty days' notice. That detail lives in the terms of service, not the demo.

Half a day. That's the entire cost, and it's trivial next to a migration. We've seen this exercise end platform evaluations where the demo was glorious and the export was a screenshot.

## Contract clauses that pay rent later

Procurement teams negotiate price and uptime; almost nobody negotiates departure. Yet the exit clauses are the ones that matter in the only scenario where you read the contract again. Our standard asks, from [reading agency SOWs](/journal/playbooks/reading-an-agency-sow) sharpened by the same scar tissue:

- **Data return in a documented, standard format, on request, with a defined turnaround** — fourteen days, not "commercially reasonable efforts".
- **Historical data completeness**: the export includes the full history, not the current billing period.
- **A wind-down window**: read access continues for ninety days post-termination, because migrations never finish on the announced date and a dead admin panel mid-migration is a special kind of helpless.
- **No fee for your own data.** If the contract charges you to retrieve what is yours, that clause is the price of staying, restated.
- **API parity**: anything the admin UI can do, a documented API can do — because your eventual migration script will live or die on API coverage, and parity today is leverage tomorrow.

Vendors who flinch at these are telling you something about their retention model. Vendors who don't are telling you something about their confidence. Either way, you learn it while it's cheap.

## Abstraction seams: the ones that matter and the ones that don't

The engineering instinct is to abstract everything behind interfaces so any vendor can be swapped. This instinct is expensive and mostly wrong. Every abstraction layer is code you write, test and maintain forever, and most of it protects against migrations that never happen while slowing every feature that does. After building and later unwinding plenty of both kinds, here's where seams pay for themselves:

**Worth abstracting:**

- **Your content model.** Define the schema as *yours* — types, fields and relationships shaped by your editorial reality, mapped into the CMS, not shaped by its defaults. When the model is yours, migration is a mapping exercise; when the model is the CMS's, migration is archaeology. The same principle powers [type-safe CMS content](/journal/engineering/type-safe-cms-content): the contract originates with you.
- **Canonical URLs.** Own your URL structure at the DNS and routing layer so the platform never gets to decide what `/products/:slug` means. URL ownership is why [migrations that don't burn rankings](/journal/growth/seo-safe-site-migrations) are a routing problem, not a SEO prayer.
- **Identity and payment tokens.** Wherever possible, use payment providers who let you port customer payment tokens, and auth you can export. The two most painful lock-ins we've unwound were stored cards that couldn't legally travel and an auth system whose password hashes used a proprietary scheme — each turned a platform swap into a forced re-consent campaign.
- **A thin event/data layer for analytics and email**, so behavioural data flows to a warehouse or neutral collector you control before it fans out to vendors.

**Not worth abstracting:**

- **The platform's page-building UI.** You will lose it in any migration; accept that layouts are perishable and content is not. Design for re-skinning, not for resale of the artefacts.
- **Vendor-specific conveniences mid-flow** (their search, their recommendations). Swap them deliberately, cheaply, and without pretending a wrapper makes it free later.
- **Hypothetical multi-vendor redundancy.** Running two CMSs "in case" is how you end up maintaining two CMSs.

The test for any proposed seam: does it make a *plausible* future migration cheaper by more than it costs to maintain this year? If you can't name the migration scenario, delete the abstraction.

## The annual exit rehearsal

Fire drills work because the discovery of a blocked exit during an actual fire is a plot twist nobody enjoys. Same logic: once a year — we schedule it alongside annual security review — run an exit rehearsal for your most load-bearing platform:

1. **Do a full export** of content, media and commercial data. Time it. Verify completeness against known record counts.
2. **Restore it somewhere neutral.** A weekend project revival of the demo-environment trick: no polish, just proof the data is enough to rebuild from.
3. **Write the incident-style retro.** What would leaving actually take, in days and dollars, today? Put the number in a document your leadership reads. The number changes as content accrues and integrations deepen — watching it grow year over year is the honest measure of your deepening lock-in, and sometimes growing is fine. Unmeasured is not.
4. **File the delta.** Every gap the rehearsal surfaced — a new integration with no export path, a media library that outgrew the trial restore — becomes a remediation item with an owner.

The first rehearsal always produces a small horror. That's the point. The horror found in a rehearsal is a ticket; the same horror found during a priced-out renewal negotiation is a year of your roadmap.

## What to do with all this leverage

Here's the twist worth stating plainly: teams that run this discipline rarely leave platforms sooner — they leave *better*. They extend contracts because the value is real, rather than because the exit is unthinkable, and they negotiate renewals with the only leverage that exists: a credible, rehearsed alternative. Lock-in you choose annually is a strategy. Lock-in you discover is a hostage situation.

If you're weighing a CMS or commerce platform and want a second set of eyes on the export button, that's a normal Tuesday for us — our [websites practice](/services/websites) has done this dance [more than once](/journal/engineering/headless-cms-migration-runbook).

## Key takeaways

- Lock-in is a spectrum, not a sin. Choose it deliberately, with the exit planned while you still have leverage.
- Before signing, run the portability test yourself: export content, media and commercial data, then rebuild one page of it elsewhere.
- Negotiate exit into the contract: standard-format data return, complete history, a ninety-day wind-down, no retrieval fees, API parity.
- Abstract sparingly: own your content model, URLs, payment tokens and behavioural data. Accept that layouts and vendor conveniences are perishable.
- Run an annual exit rehearsal — full export, neutral restore, written retro with a dollar figure — and treat every gap as a ticket, not a discovery.

## Frequently asked questions

**Isn't planning the exit pessimistic — a signal you don't trust the vendor?**
It's the same professional courtesy as a rollback plan: nobody interprets rehearsed rollback as distrust in their own deploy pipeline. Vendors with real confidence in their value don't fear exportable customers; they fear churn. You're testing which one you've found.

**We're already locked in. Is it too late?**
No — the rehearsal works retroactively. Run the export drill on your current platform this quarter. You'll either discover the exit is cheaper than feared (peace of mind for free) or you'll get a remediation list while the negotiation clock isn't running. Both beat learning the answer during a renewal dispute.

**Does choosing open-source solve this?**
It changes the shape, not the existence. Open-source swaps vendor lock-in for operational lock-in: the knowledge, infrastructure and maintenance burden that make leaving *your own stack* expensive. Ask your team how portable your last two self-hosted systems were. The portability test applies to everything.

**How do we compare platforms on this during procurement?**
Score the export, not the demo. We give portability its own weighted line in every platform evaluation — a vendor that demos at nine and exports at three ranks below one that demos at seven and exports at eight, for any relationship expected to outlast the honeymoon.

**What size company needs the annual rehearsal?**
Anyone whose content or customer data would take more than a week to recreate by hand. In practice that's everyone north of a hobby project. The rehearsal scales: a startup's version is a long afternoon, not a programme.
