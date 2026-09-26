---
title: "Migrating a site without burning its rankings"
description: "Domain changes, CMS switches and relaunches are risk decisions, not just checklists. How to forecast the dip, set expectations and know when to roll back."
slug: seo-safe-site-migrations
cluster: growth
tags: [site migration, technical seo, risk management, website relaunch, analytics]
date: 2026-05-06
author: Priya Nair
keywords: [SEO migration, site migration checklist, redirect strategy, domain migration, relaunch risk]
readingTime: 10
---

Every redesign proposal contains an invisible line item nobody prices: the organic traffic you're about to spend. A migration — new domain, new CMS, new architecture, usually all three because someone said "while we're in there" — puts a year or more of accumulated search equity through a wood-chipper and asks you to catch the pieces. Most teams budget for the wood-chipper. Few budget for the catching.

We've written the [full migration runbook](/journal/growth/site-migration-seo) elsewhere — redirect maps, staging audits, launch-day checks, the thirty-day watch. This piece is about the layer above the checklist: whether to migrate at all, how big a dip to forecast and to whom, how to instrument the recovery so a bad week doesn't trigger a panic rollback, and how to know the difference between turbulence and a fire. Migrations don't fail on technical competence as often as they fail on decision-making under uncertainty. This is the decision layer.

## First: should you migrate at all?

The most valuable migration work we do is talking clients out of migrations. Before any planning, someone senior needs to answer one question in writing: *what does this change buy that a renovation of the current stack cannot?*

Legitimate answers exist. A domain rebrand with real trademark exposure. A CMS so constrained that every landing page is a two-week ticket. An acquisition where two domains genuinely must merge. A security posture the old platform can't meet. Fine — migrate.

Illegitimate answers are more common: "the new design would be easier to build from scratch" (it wouldn't, it's just more pleasant), "the platform is old" (old is not a failure mode), or the deadliest, "we're rebranding anyway, so we might as well" — the scope-creep conjugation that turns a moderate-risk visual relaunch into a maximum-risk domain-plus-platform-plus-IA change. Each axis of change is its own risk multiplier. A reskin on the same URLs is a rounding error. A domain change alone is significant. Domain plus platform plus restructured information architecture in one launch is a bet-the-organic-channel move, and it should be approved, in writing, as exactly that.

If the answer is still "yes, migrate," then the job becomes honest forecasting.

## Forecast the dip, then say it out loud

Search engines treat migrations as a trust reset. Even an immaculate redirect map involves reprocessing: every old URL must be recrawled, the redirect chain followed, signals reassigned. That takes days for a small site and months for a large one, and during reprocessing your rankings wobble. Published case data across the industry — and our own project history — puts the honest expectation at: **a 10–30% organic dip in the first 2–4 weeks, recovering over 6–12 weeks** for well-executed same-domain moves. Full domain changes run longer; we plan for a quarter to return to baseline and caveat that some long-tail queries never fully come back.

Write that range in the kickoff document. Present it to the CEO before the launch date is announced. Then annotate it everywhere.

**Annotation is the cheapest insurance in analytics.** The day the new site ships, drop a dated annotation in every analytics and reporting surface you own — GA4, the data warehouse, the Looker dashboards, the shared spreadsheet the board reads. "Site relaunched 14 May; organic expected to dip 10–30%, recovery target 12 weeks." When week-three panic arrives — and it arrives — the annotation is the difference between "we forecast this, here's the recovery curve" and a frantic all-hands that produces a rollback nobody can execute safely. This is basic [analytics governance](/journal/growth/analytics-governance), and migrations are where governance earns its keep.

Set the counterfactual in advance, too. "Traffic is down 18%" is meaningless without "down relative to what." Build the pre-launch baseline as a 12-month weekly series adjusted for seasonality (year-over-year comparison for the same weeks, not month-over-month), and agree on the recovery definition before launch: e.g., "recovered = organic clicks ≥ 90% of the seasonally-adjusted baseline for four consecutive weeks." Deciding what "fine" means while you're anxious guarantees the wrong answer.

## The risk register: name the ways it burns

A migration kickoff should produce a written risk register — five to eight named failure modes, each with an owner, an early-warning signal, and a pre-agreed response. Ours, refined across too many relaunches:

1. **Redirect coverage gaps** — orphaned legacy URLs that ranked, never mapped. Early warning: 404 spikes in logs and Search Console crawl stats within 48 hours. Response: emergency patch releases of the map; this is why the map is data-as-code, per our [technical SEO checklist](/journal/growth/technical-seo-checklist-2026).
2. **The template regression** — new templates quietly drop structured data, canonicals, or hreflang. Early warning: rich-result errors and coverage reports in week one. Response: staged hotfix, usually fast.
3. **Performance regression** — the new site is heavier; Core Web Vitals slide; crawl rate drops. Early warning: lab metrics on staging, field data by week two. If your new build needs a performance rescue at this point, that's a [websites engagement](/services/websites) of last resort — far better to gate launch on vitals than pay the crawl-budget tax after.
4. **Canonical self-destruction** — the new platform points canonicals at the old domain (yes, really; we've audited it twice in the wild). Early warning: indexing anomalies within days.
5. **Measurement blackout** — analytics tags or server-side tracking dropped in the rebuild, so the "dip" is partly fictional and the panic is doubled. Early warning: dry-run the full tagging plan on staging; verify event parity between old and new sites for a week of parallel data if the platform allows.
6. **The authority leak** — high-value backlinks keep pointing at URLs that now redirect through chains, or worse, at parked campaign domains. Early warning: backlink-crawl diff in the first fortnight.

The register's purpose isn't pessimism — it's conversion. It converts "the site is down 22%, everything is on fire" into "we are watching named signal #2, threshold is X, response is Y, owner is Priya." Anxiety with an index is a worklist.

## Turbulence or fire: the monitoring cadence

Post-launch, attention is a resource and panic is a tax. We run a fixed cadence so nobody improvises:

- **Week 1, daily**: a fifteen-minute check — indexation counts, redirect response codes sampled from the top 500 URLs by traffic, 404 volume, Search Console messages. One person owns it; findings go into one running doc, not scattered Slack threads that amplify alarm.
- **Weeks 2–6, twice weekly**: rankings on the money page set, organic clicks vs the annotated baseline, rich-result eligibility. Expect the dip to bottom out around week two or three. Flattening is good news; monotonic decline past week four is not, and that's when you open the rollback conversation with data in hand.
- **Weeks 6–12, weekly**: recovery trend against the pre-agreed definition, and the long-tail audit — are the small pages re-indexing, or is only the head recovering? Long-tail lag on domain changes is normal; long-tail disappearance is an architecture problem.

When we relaunched direct booking for [Marlowe Hotels](/work/marlowe-hotels-direct-booking-relaunch), the register caught its #2 risk early: a template had shipped canonicals pointing at the old booking subdomain from the staging config. Twelve days of caught-early weirdness instead of a quarter of quietly evaporated rankings. Nothing about that save was heroic. The cadence was the whole trick.

## Rollback criteria: decide before you need to

Rollback mid-migration is terrible — a second URL churn event that usually makes everything worse. So terrible that you must define, before launch, the only conditions under which you'd do it. Ours:

- **Immediate, unconditional rollback**: the site fails to serve correct 301s at scale, or serves 5xx to more than a token fraction of Googlebot requests. These are recoverable-only-by-revert failures.
- **Considered rollback, after week six**: organic under 60% of baseline with no flattening trend *and* a diagnosed cause that cannot be patched on the new platform.
- **Everything else: fix forward.** A dip in the forecast band — even the scary end of it — gets patience, not a revert.

Write those three lines into the kickoff document, because in week three someone very senior will demand a rollback of a healthy, on-schedule recovery, and "we pre-agreed the criteria" is the only argument that reliably beats adrenaline.

## Key takeaways

- Treat a migration as a risk decision first: justify it against renovation, and never bundle domain, platform and IA changes without pricing each as a separate risk multiplier.
- Forecast the dip in writing — 10–30% for 2–4 weeks, 6–12 weeks to recover, a quarter for domain changes — and annotate it in every reporting surface before launch.
- Run a pre-launch counterfactual: seasonally-adjusted baseline and an agreed recovery definition, decided while everyone is calm.
- Maintain a named risk register with owners, early-warning signals and pre-agreed responses. It converts panic into a worklist.
- Define rollback criteria before launch: immediate revert only for redirect/5xx catastrophes, considered revert only after six weeks of diagnosed, unfixable decline. Everything else is fix-forward.

## FAQ

**Does a redesign without URL changes still count as a migration?**
A much milder one. If URLs, platform and content stay put and only templates change, the risks compress to regressions in structured data, internal linking and performance — rows #2 and #3 of the register. Still annotate, still monitor for a fortnight, but skip the quarterly-recovery planning.

**How long should we keep old redirects alive?**
Forever, if it's cheap — and at the edge with JSON or a flat file, it is cheap. Practical minimum: three years after the last meaningful crawl of the old URL, which you verify in server logs, not vibes. Backlinks evaporate the day your redirects do.

**Should we tell Google via the Change of Address tool on a domain move?**
Yes — it's one of the few levers that genuinely helps a domain change, and it's free. It doesn't replace redirects; it accelerates signal transfer once they're perfect.

**Our rankings dipped 25% in week two. Panic?**
Check three things before anything else: is tracking intact (rule out #5), are money-page redirects serving 301s in one hop, and did Search Console report anything? If all clean and the dip is inside your forecast band, the correct action is a cup of tea and the week-four checkpoint.

**Can a migration ever *improve* organic traffic?**
Regularly — when the old platform was the ceiling. Consolidating cannibalising content, fixing architecture and shipping a faster site means a well-run migration often recovers above baseline by month three or four. But plan for the dip; the upside is a dividend, not a projection. It's the discipline we bring to every [growth engagement](/services/growth): hope is not a forecast.
