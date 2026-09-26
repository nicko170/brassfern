---
title: "The launch-day QA checklist we run on every site"
description: "Launch week is preparation; launch morning is verification. Our day-of QA sweep: redirects, 404s, OG tags, forms, analytics parity, and the 72-hour war room."
slug: launch-day-qa-checklist
cluster: playbooks
tags: [website launch, QA checklist, launch runbook, quality assurance, go-live]
date: 2026-01-20
author: Ruby Castellanos
keywords: [website launch checklist, launch day qa, site launch runbook, pre launch testing, website go live checklist]
readingTime: 11
---

We've written before about [launch week](/journal/playbooks/launch-week-checklist) — the seven days of freezes, redirect maps and rollback rehearsals that make go-live boring. This is the companion piece: what happens on the morning itself, once the prep is done and the switch is about to flip. Launch week is preparation. Launch day is verification. The two require different temperaments, and confusing them is how teams end up writing the redirect map at 9am and discovering at 9:40 that nobody checked whether the contact form actually sends.

Everything below fits on two printed pages. Yes, printed. A checklist that lives in a browser tab competes with the incident it's supposed to catch; ours gets taped to a monitor and ticked off in pencil by a named human. Steal it.

## The standing order: two passes, one commander

Every launch-day QA runs twice. **Pass one** happens against the "dark site" — production infrastructure, real data, verified over a hosts-file entry or a raw hostname before DNS moves. This is where you catch the catastrophic stuff while the public still sees the old site. **Pass two** happens within thirty minutes of cutover, against live URLs, because some problems only exist after DNS, CDN and certificate reality has arrived.

One person calls the passes: the launch commander. Not a channel, not a rota — a person with the authority to say "we hold" when item fourteen fails. Pass one on a marketing site takes about ninety minutes with two people. If your pass one takes four hours, your checklist is wrong — either too vague ("check the site works") or too exhaustive (regression-testing the whole build instead of the launch-risk surface).

## Pass one: the dark-site sweep

**Redirects: sample like an auditor.** You can't re-click three thousand redirect rows on launch morning, and you don't need to. Pull twenty URLs stratified by risk: the top five by organic traffic, five deep legacy URLs from the oldest section of the site, five with query strings or trailing-slash weirdness, and five you know were restructured rather than mapped one-to-one. Check each returns a single 301 to the right destination — not a chain, not a 302, not a soft 200 on a catch-all page. Chains and 302s are the two ways a "finished" redirect map quietly leaks authority; our [technical SEO launch checklist](/journal/growth/technical-seo-launch-checklist) goes deep on crawl-level verification for the week after, but the twenty-URL sample is the launch-morning smoke alarm.

**The 404 sweep.** Deliberately visit five URLs that *should* 404 — a nonsense path, an old URL deliberately pruned, a mistyped slug. You're checking three things: the status code is a real 404 (not a 200 with an apology page, which search engines read as a soft-404 farm), the page renders the designed 404 rather than a server default, and the analytics tag fires on it so error traffic is visible. A [good 404 page](/journal/web-design/designing-404-pages) is a design artefact; on launch day it's also a diagnostic instrument.

**Metadata and social cards.** View-source on the homepage, one article or product template, and one utility page. Verify title, meta description, canonical (absolute, correct domain — staging canonicals shipping to production is a rite of passage you only do once), and the OG/Twitter image URLs. Then paste the homepage URL into a social-card debugger or a Slack DM to yourself: cached or missing OG images on launch day are embarrassing precisely because every stakeholder's first act is to share the link. If the hero share card is wrong, that screenshot lives in the company chat forever.

**Forms: submit them for real.** Every form, end-to-end, with real submissions into real inboxes and CRMs: contact, newsletter, checkout in test mode, password reset if auth ships today. Check the success state renders, the confirmation email arrives (from the right domain, not `noreply@staging…`), the data lands where the client expects it, and the analytics event fires. Then check the failure paths — submit with a required field empty and confirm the errors help rather than insult. Forms are the highest-density source of launch-day embarrassment: they touch DNS (mail records), third parties (CRM, payment), front end and back end simultaneously, which means they're the first thing any of four moving parts can break.

## The cutover, then pass two

DNS choreography belongs to the week runbook — TTLs lowered in advance, verify on the raw hostname, purge the CDN deliberately. Pass two re-runs a compressed version of pass one against live URLs: homepage, top three traffic pages, one form submission, one full conversion flow, and the redirect sample. The reason pass two exists at all is that a specific class of bug only hatches after cutover:

- **Absolute URLs and config that still point at staging.** Search the production HTML for `staging`, `localhost`, and `dev.` in asset paths and canonicals. One environment variable that didn't get promoted and your images load from a staging bucket that will be deleted on Friday.
- **Certificate and apex/www behaviour.** Both variants, both protocols, one hop each, HSTS where you intend it. A misconfigured www redirect is invisible to everyone who types the apex — which is to say, to the whole QA team and none of the audience.
- **CDN staleness.** Hard-purge and re-check; a homepage serving the old hero from one edge PoS is the classic "looks fine on my machine" launch bug.

## Analytics parity: the silent killer

Analytics failure is the most common launch defect and the only one that makes no noise — the site works, the client is happy, and three weeks later someone notices the funnel is flatlining because events fire into a property nobody reads. Launch-morning protocol:

1. **Real-time verification within the first hour.** Visit key pages yourself, watch your own session appear in the real-time view, complete one conversion and confirm the event. Then check again after the CDN purge, because cached HTML can serve a stripped or stale tag.
2. **Parity check against the old property.** Overlay the old site's Tuesday-morning traffic pattern against the new one. Orders of magnitude are what you're checking — a 40% trough on launch morning is a broken tag until proven otherwise.
3. **Annotate everything.** Launch date annotated in every reporting tool, including the ad platforms. The annotation is what stops the Q3 board deck from "diagnosing" a fictional trend at the seam.

## Performance and accessibility: the honest quick passes

Launch day is not the day for a full performance audit — that's what the week was for. It *is* the day to confirm nothing regressed in the final push. Run the top three templates through a lab test from a throttled profile, and — more importantly — open the site on a real mid-range phone on real mobile data and use it for two minutes. Lab scores on launch hardware lie generously; the phone tells the truth. Our [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide) covers the budgets that should already be wired into CI, so the morning check is a sanity pass, not an investigation.

The accessibility pass is thirty minutes: keyboard through the homepage and one conversion flow (can you reach and operate everything? is focus visible?), run one automated sweep for the mechanical errors, and check zoom to 200% on the money pages. This doesn't replace a real audit — our [accessibility audit process](/journal/product/accessibility-audit-process) is a separate day-long discipline — but it catches the launch-week regression where someone shipped a modal with no focus trap at 11pm.

## The first 72 hours: the war-room rota

Launch day ends; launch *window* doesn't. Most defects surface in the three days after go-live, when real traffic meets the site at hours the team isn't awake. The rota is the answer: a named human on point for every hour of the first 72, with a shared channel, a severity ladder, and a rule that the on-point person watches three dials — uptime and error rates, Search Console coverage, and the support inbox.

The support inbox deserves emphasis: it's the best monitoring dashboard you have. "Can't find the login button" tickets in the first afternoon are UX telemetry money can't buy, but only if support knows to route rather than reassure-and-close. Brief them before launch, debrief them after day three, and write every routed ticket into the week-two fix list.

And log everything. The launch log — what was checked, when, by whom, what failed, what was deferred — becomes the first entry of next project's runbook. Every item on this checklist exists because it once caught something, or because something it would have caught slipped through. Checklists are scar tissue in a useful format.

## Key takeaways

- Launch week is preparation; launch day is verification. Run QA twice — on the dark site before cutover, and compressed against live URLs within thirty minutes after.
- Sample redirects like an auditor: twenty URLs stratified by risk, checking for single 301s, no chains, no catch-alls.
- Submit every form for real, both success and failure paths. Forms touch more moving parts than any other surface.
- Analytics fails silently. Verify in real-time within the hour, check parity against the old property, and annotate the launch date everywhere.
- Performance spot checks happen on a real phone on real data; the accessibility quick pass is thirty minutes and non-negotiable.
- Staff the first 72 hours with a named on-point person and treat the support inbox as a monitoring instrument.

## Frequently asked questions

**When in the day should we actually flip the switch?**
Early morning, Tuesday or Wednesday, in the timezone where most of the team lives. Early gives you maximum waking hours to catch issues; midweek gives you runway before the weekend. A 6am flip with coffee beats a 4pm flip with bravado, every time.

**How long should the full day-of QA take?**
Ninety minutes for pass one on a typical marketing site, thirty for pass two, plus the war-room rota overhead. If it balloons past half a day, your checklist is doing regression testing's job — strip it back to the launch-risk surface.

**Who should hold the pencil?**
A producer or QA lead, never the engineer doing the cutover. The person executing the flip cannot also verify the flip; that's the same conflict of interest as proofreading your own email.

**What if something fails during pass one?**
The commander calls a hold, the fix goes in, the failed item *and its neighbours* get re-checked, and the pass resumes. A hold is a success state — the checklist doing its job. The failure mode is treating the schedule as more immutable than the checklist.

**Do small sites really need the war-room rota?**
Scale the rota, not the principle. A brochure site might mean one person checking three dashboards twice a day for two days. What's non-negotiable is that it's *named* — "someone will probably notice" is how a broken checkout runs for a long weekend.
