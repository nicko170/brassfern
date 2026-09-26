---
title: "Launch week: the checklist we run for every site"
description: "Go-live is a week, not an afternoon. The runbook we run for every launch: redirects, DNS, analytics continuity, rollback criteria, and day-two priorities."
slug: launch-week-checklist
cluster: playbooks
tags: [website launch, go-live checklist, launch runbook, DNS migration, deployment process]
date: 2024-09-02
author: Felix Brandt
keywords: [website launch checklist, site migration checklist, go live runbook, launch plan template, website relaunch SEO]
readingTime: 10
---

"Launch on Friday" is the four most dangerous words in web development. Not because Friday is cursed, but because the phrase reveals a mental model: launch as a moment — a switch flipped around 4pm, followed by congratulations and a weekend of silence. If the switch flip works, why not Friday?

Because launches are not moments. They're weeks. The flip takes minutes; everything that makes the flip boring — redirect maps, DNS choreography, analytics continuity, rollback rehearsal, stakeholder comms — takes five days of preparation and five days of watching afterwards. The sites that launch badly are almost never the ones with bad code. They're the ones where nobody wrote down the plan, so the plan lived in one person's head, and that person was at lunch when the payment webhook started failing.

This is the checklist we run for every Brassfern launch, from [restaurant sites](/work/wattle-and-daub-reservations) to [headless storefronts](/work/fernleigh-wines-dtc-storefront). Steal it wholesale.

## T-minus 7 days: freeze, map, rehearse

**Content and feature freeze.** Not a soft freeze where "just one thing" sneaks in — a real one, with a named exception approver. Every launch-week incident we've ever investigated traces back to a change that arrived after the freeze with the words "tiny, I promise."

**The redirect map, finalised and tested.** For any rebuild with existing traffic, this is the highest-stakes artefact of the week. Crawl the old site completely. Every URL gets one of three fates: an equivalent page (no redirect), a 301 to the closest equivalent, or a deliberate 410 for content that's genuinely gone. Never a blanket redirect to the homepage — that's how you tell Google that a hundred pages of earned authority are now a doorway page. Our [technical SEO checklist](/journal/growth/technical-seo-checklist-2026) covers the crawl-and-map mechanics in detail; the short version is: the redirect map is a spreadsheet with an owner, not a regex someone writes on launch morning.

**Rehearse the rollback.** The criterion isn't "can we roll back?" — it's "have we actually done it, this week, on this infrastructure?" A rollback that exists only in theory is a story you tell yourself. Run it once against staging with production-shaped data, time it, and write the duration on the runbook. If rollback takes forty minutes, your go/no-go thresholds need to know that.

**Warm the cold paths.** Anything that will break under first real traffic should have felt traffic before launch: checkout end-to-end with real payment processor in test mode, email deliverability from the production domain (check your SPF/DKIM the week before, not the day of), the contact form, the password reset. It's astonishing how many launches are sunk by a transactional email provider that was never verified for the new domain.

## T-minus 2 days: the comms layer

Technical teams forget that launches are also a communications event, and that unmanaged humans cause more launch chaos than unmanaged servers:

- **Stakeholder pre-brief.** One page to every stakeholder: what's changing, when, what downtime (if any) to expect, who to call, and what *not* to do (no social announcements until we confirm stability; no "just checking" Slack pings to the engineer running the DNS cutover).
- **Support team briefing.** Your support inbox is your best monitoring dashboard for the first 48 hours. Give them the known-changes list, the expected bumps, and a direct escalation line. "The site looks different and I can't find X" tickets are gold if support knows to route rather than reassure-and-close.
- **The war room calendar.** A shared channel, a named launch commander (one person who can say go, no-go, and roll back — not a committee), and defined check-in times. Launches fail by diffusion of responsibility; the commander model exists to prevent it.

## Launch day: the choreography

We launch Tuesday or Wednesday, early in the day, with the full squad on hand. Monday is for recovering from the weekend; Thursday is too close to Friday; Friday is for people who enjoy their weekends differently than we do.

**DNS choreography in order:**
1. **Lower TTLs 48 hours ahead.** Time-to-live on the records you're changing should be dropped to 300 seconds two days before, so caches flush fast. Raise them again a week later.
2. **Deploy to the new infrastructure first and verify against the raw hostname.** Full production checks against a URL the public can't see: smoke tests, key journeys, admin functioning.
3. **Cut over, then verify the apex AND the www variant AND the old subdomain anyone still links.** The `www.` redirect chain is the classic launch-day facepalm — three hops, one of them http, each leaking link equity and 200ms.
4. **Purge the CDN deliberately.** Stale cache at the edge is how you get a homepage that shows the new header with the old hero, in one region, for six hours.
5. **Run the synthetic checks immediately**: homepage, top five traffic pages, key conversion flow, 404 page (broken 404s on launch day are a genre — ours is designed with care, as covered in [designing 404 pages](/journal/web-design/designing-404-pages), but it should still only appear for actually-missing pages).

**The go/no-go thresholds, written down in advance.** Ours: error rate above 1% for ten minutes, p75 LCP above budget on real-user data, or any payment flow failure — each triggers the rollback clock without a meeting. Thresholds invented during an incident are just panic formatted as numbers.

## Analytics continuity: the part everyone pays for later

Analytics breaks on launch more reliably than servers do, and it breaks silently, so you find out at the next board meeting. The continuity checklist:

- **Verify the tag fires on the new property within the first hour** — real-time view, your own visit. Then check it again after the first CDN purge, because tag injection through cached HTML is a Shaolin-level gotcha.
- **Annotate the launch date in every reporting tool.** Every metric will have a seam at launch; the annotation is what stops next-quarter-you from diagnosing fictional trends.
- **Re-verify conversions before pausing ads.** If paid traffic is pointing at the old site or paused during migration, relaunch campaigns only after conversion events are demonstrably flowing. A week of un-tracked conversions is a hole in your data forever. The broader discipline lives in our [analytics governance](/journal/growth/analytics-governance) piece — tracking plans belong in the build, not the aftermath.
- **Search Console on day one.** Verify the property, submit the new sitemap, and watch coverage reports daily for a fortnight. The first hint of a redirect-map mistake appears there while it's still cheap to fix.

## The 48 hours after: watch the right dials

Post-launch monitoring is where "launch week" earns its plural. The dials we actually watch, in order of information value:

1. **Real-user Core Web Vitals**, not lab scores. Lab scores were verified in staging; what you're hunting now is the device-and-network reality — the mid-range Android on hotel Wi-Fi. Our [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide) explains which budget regressions are launch-noise and which are signal.
2. **Error tracking filtered to new errors.** You'll have pre-existing noise; what matters is the delta. Triage anything in a conversion path within the hour.
3. **Support ticket themes.** Three tickets about the same thing is a bug report with a sample size.
4. **Search behaviour.** Internal search queries with zero results spike after information architecture changes — they're a direct record of what people expected to find where. Mine them.

## Day two priorities nobody plans for

The strangest finding across our launches: the second-day problems are never technical. They're editorial and organisational.

- **The content debt notice.** Every migration inherits a swathe of "we'll fix it after launch" — outdated staff bios, the pricing footnote legal needed changed. Give that list an owner on day two with dates, or it becomes day-two-hundred content, silently eroding trust.
- **The social/OG verification pass.** Paste the top ten pages into a debugger and check the card renders. OG images have a gift for pointing at staging assets or a cache that will outlive us all.
- **The retrospective while it's fresh.** Booked in advance for day five: what surprised us, what the checklist missed, what the checklist had that we didn't need. That retro is where this document came from.
- **Celebrate properly.** Launching a site with a team that did it well is a genuine achievement, and the teams that mark it ship better next time. Fancy dinners are cheaper than burnout.

## Before you go: the launch commander's one-pager

Print this bit. Launch day, on a desk:

- Commander: one name. Comms channel: one channel. War-room check-ins: times listed.
- Thresholds to roll back: error rate, LCP, payment flow — numbers written down.
- Rollback: rehearsed, timed, steps attached.
- Redirect map: owner named, spot-check list of the ten highest-traffic legacy URLs.
- Emergency contacts: hosting, DNS, payments, CMS — with account IDs ready.

A launch with this on the desk is boring, and boring launches are the whole point. Save the adrenaline for the champagne.

## Key takeaways

- Launch is a week: five days of preparation, a boring Tuesday cutover, five days of monitored aftermath.
- The redirect map is the highest-stakes artefact for any rebuild with existing traffic — a spreadsheet with an owner, never a launch-morning regex.
- Rehearse the rollback and time it. Thresholds for go/no-go get written before the incident, not during.
- Analytics breaks silently: verify tags, annotate the date, re-verify conversions before resuming paid traffic.
- Day-two problems are editorial and organisational, not technical. Pre-assign owners for content debt and the retro.

## Frequently asked questions

**Why not launch on a Friday, really?**
Because the cost of a bad launch scales with time-to-fix, and your fixers are human. An incident at 5pm Friday is discovered slowly, fixed by tired people, and monitored by nobody until Monday. Tuesday mornings give you the best of everything: rested team, full week ahead, offices of your infrastructure providers staffed.

**How long should DNS TTLs stay lowered?**
Drop to ~300 seconds 48 hours before cutover, keep them there through launch week, then return to something sane (an hour or more). Permanently low TTLs buy you nothing and add query load; the whole point is fast recovery during the window when you might need it.

**What's the most common launch failure you see?**
Transactional email from a new domain without warmed deliverability — password resets and order confirmations silently landing in spam. It's unfailingly discoverable in the T-7 checks and unfailingly skipped when teams treat launch as an afternoon.

**Do we need a maintenance window page?**
For a well-planned DNS cutover or a zero-downtime deploy, no — the switch should be invisible. If your architecture does require visible downtime, that's fine; be honest and specific ("back by 9:30am AEST") rather than the vague "undergoing maintenance" page that trains users to assume the worst.

**Who should be in the war room?**
Small and senior: the launch commander, one engineer who can deploy, one person who owns content/CMS, one client decision-maker, and support feeding in themes. Everyone else gets the pre-brief and the all-clear. War rooms with fifteen attendees produce meetings, not launches.
