---
title: "The one-day performance audit (a playbook)"
description: "Run a credible performance audit in a single day: lab vs field data, Lighthouse and WebPageTest against CrUX, and an effort/impact findings template that ships."
slug: performance-audit-one-day
cluster: playbooks
tags: [performance audit, core web vitals, webpagetest, lighthouse, crux]
date: 2026-01-22
author: Tomás Reyes
keywords: [performance audit checklist, core web vitals audit, webpagetest guide, site speed audit]
readingTime: 11
---

There are two kinds of performance audits. The first takes three weeks and produces a 60-page PDF whose greatest achievement is its own file size. The second takes one day and produces a short, ranked list of things to fix on Monday. This is a playbook for the second kind — the audit we've run dozens of times before [engagements](/pricing), before launches, and inside teams who suspect their site is slow but can't prove where the day went.

It assumes one analyst, one day, no special access beyond analytics and Search Console. It will not catch everything; it will catch everything *that matters enough to act on next week*, which is the entire point.

## Hour one: field data first, always

Start with real users or don't start. Lab tools tell you what performance *could be*; field data tells you what it *is*, measured in the browsers of people deciding whether to buy from you.

1. **CrUX via PageSpeed Insights**: pull the field-data panel for the homepage and the three highest-traffic templates (usually a listing page, a detail page and one article/post). Record LCP, INP and CLS at p75 for mobile — mobile is the audit; desktop passes are dessert.
2. **Search Console's Core Web Vitals report**: which *groups* of pages are failing, not which individual URLs. Groups are the diagnosis; URLs are symptoms.
3. **Your own analytics**: cross-reference device mix, connection quality (if captured) and — the money chart — conversion or bounce rate against performance buckets. If your analytics ties revenue to LCP bands, the audit's business case writes itself.

Where there's no CrUX data (low-traffic sites), lab data is all you get — say so loudly in the report, because "fails in lab, unknown in field" prescribes different medicine than "fails in the field."

**Deliverable by 9:30am**: five numbers per key template (the vitals p75 + field coverage) and the sentence of the day: "Our [template] fails [metric] for [share] of real mobile visits."

## Hours two and three: lab reproduction, the right way

Now reproduce the field diagnosis in the lab, where you can dissect it. Rules that keep lab work honest:

- **Throttle like you mean it.** Lighthouse's default mobile profile (slow 4G, 4× CPU) is the floor. For anything international, run WebPageTest from the region your users actually live in — a Sydney page tested from Frankfurt will lie to you with a straight face, and several of our [Australian client audits](/work/meridian-climate-data-explorer) only made sense once the network leg was priced in.
- **Lighthouse for breadth, WebPageTest for truth.** Lighthouse is a fine triage instrument and a terrible diagnostic tool. The WebPageTest waterfall — connection setup, request ordering, render-blocking chains — is where causes live. Run three tests per template, take the median run; single runs are horoscopes, not data.
- **Record the filmstrip and keep it.** The moment LCP actually lands, visually, is often more persuasive than any number — especially when the filmstrip shows the hero arriving *after* the cookie banner.

While tests run, collect the cheap wins that need no tools: total transferred weight per template (site-wide median), the third-party script inventory (every tag, who owns it, when it was last justified), and the image format census (`curl` plus `grep` on a crawl will do). Third-party weight is the silent killer on almost every marketing site we audit — our [bundle-budget discipline](/journal/engineering/bundle-budget-discipline) piece covers how to hold the line after the audit, but step one is simply *counting* what marketing has loaded.

## Hours four and five: the big five causes, checked in order

A decade of audits has taught us that the same five causes explain most failures, roughly in this frequency order. Check each deliberately against your findings:

1. **LCP is late because the hero image is.** Look for: hero loaded via CSS background (discovered late), no `fetchpriority="high"`, oversized sources, or an LCP element rendered by client-side JS. Fix difficulty: usually hours. Impact: the largest single lever on most marketing sites. Our [image pipeline](/journal/engineering/image-pipeline-modern-web) playbook is the long-term treatment.
2. **INP is slow because the main thread is a mosh pit.** Open the DevTools performance panel on the failing template, interact, and look for long tasks over 200ms. Typical culprits: hydration of everything (including the footer), a tag-manager container doing DOM surgery, or an analytics script running experiments synchronously. Fix difficulty: days. Impact: the metric real users feel as "janky."
3. **CLS comes from late-loading stools**: cookie banners, font swaps with mismatched fallbacks, ads or embeds without reserved space, and images missing `width`/`height`. Fix difficulty: hours to a day. Impact: underweighted, because nothing photographs worse than a button that dodges the tap.
4. **TTFB is the hidden tax**: cache misses at the CDN, personalised HTML that can't be cached, or an origin far from users. Waterfall first byte over 600ms cached is a conversation with infrastructure about [caching layers](/journal/engineering/caching-strategy-content-sites). Fix difficulty: varies wildly. Impact: multiplies across everything.
5. **Death by third party**: the twelve scripts where each vendor swears theirs is 8KB. Sum the *evaluated* cost, not the transfer cost. Fix difficulty: organisational, not technical — which is why it's last.

For each candidate, write one evidence line: what you saw, in which tool, with a screenshot or filmstrip frame. Audits die of vagueness; "INP is bad" gets ignored, "INP 480ms p75 driven by the consent-banner's 310ms resize handler, frame attached" gets fixed by Thursday.

## Hour six: the findings document

One page, not sixty. The template we use:

| Finding | Evidence | Metric affected | Effort | Expected impact | Owner |
| --- | --- | --- | --- | --- | --- |
| Hero LCP image lazy-loaded by CSS | WPT filmstrip, frame 4 | LCP −1.2s est. | S | High | Web |
| Consent banner blocks INP | DevTools long task trace | INP −300ms est. | M | High | Web + Legal |
| No CDN caching on listing pages | WPT TTFB 1.4s repeat | TTFB/LCP | M | Medium | Infra |

Three rules: **six to ten findings maximum** (a longer list is a way of not choosing); **effort in hours or days, never t-shirt sizes** (S/M/L is how "quick wins" become next quarter); and **every finding has a named owner type** — audits that end without owners end, full stop. Rank by impact-per-effort, not raw impact; the point of a one-day audit is a week of high-yield fixes, not a research programme.

Set the post-fix budget at the same sitting. "LCP under 2.5s p75 on the four key templates, held in CI" converts the audit from an event into a contract — the mechanism we describe in [Core Web Vitals in the field](/journal/engineering/core-web-vitals-field-guide). Without a budget and a guard, every fix regresses inside two quarters. Every time.

## Hours seven and eight: validation pass and the honest-unknowns page

Spend the last two hours doing what weak audits skip: **verifying your own medicine**. For the top two findings, do the smallest possible live experiment — flip `fetchpriority` on staging, bump the hero preload, block the third-party script in WebPageTest with request-blocking — and capture the before/after. Audits that arrive with one already-proven fix change the entire reception: you're no longer selling suspicion, you're selling certainty at volume.

Then write the honest-unknowns page: what the day *couldn't* establish. No field data for the checkout flow; the app dashboard behind login untested; third-party A/B tool's contribution unmeasured. Naming the unknowns is not weakness — it's the agenda for deciding whether a deeper audit is worth commissioning, and it's what separates a credible one-day audit from a confident guess.

Finally, know when one day isn't enough. Call in specialists when the field data contradicts itself, when INP failures point deep into framework hydration, when the money pages are behind auth (synthetic testing gets complicated), or when the fixes require architectural change rather than tuning. A good one-day audit ends as often as not with a crisp sentence like: "Five of the six findings are week-sized fixes; the sixth is a [platform decision](/services/websites) and deserves its own scoping." That sentence — evidence-backed, scope-bounded — is the whole product.

## Key takeaways

- Start with field data (CrUX, Search Console, analytics-by-bucket); lab tools explain, never diagnose alone.
- Reproduce on mobile-profile throttling with three-run WebPageTest medians; filmstrips over numbers when persuading.
- Check the big five in frequency order: late LCP hero, main-thread INP, layout-shift stools, TTFB tax, third-party cumulative cost.
- Deliver one page: six to ten findings with evidence, effort in hours, expected metric impact and an owner type.
- Prove one fix on staging before the meeting; certainty sells the rest.
- Write the honest unknowns, and set the vitals budget with CI enforcement at the same sitting — unaudited performance always regresses.

## FAQ

### Can I trust Lighthouse scores at all?

As a smoke alarm, yes; as a diagnosis, no. The composite score swings with throttling noise and rewards gaming; the underlying timings and opportunities are the useful part. If your Lighthouse score says 92 but your field LCP fails, believe the field. Always believe the field.

### What if the site has too little traffic for CrUX?

Say it in the report's first line and lean on lab data with extra humility: multiple runs, multiple regions, and a RUM tool as the first fix to recommend. Small sites can be fast or slow; they just can't yet *prove* which, and installing measurement is a legitimate top finding.

### How often should we run this audit?

Quarterly for marketing sites, monthly for revenue-critical flows, and automatically in CI for every deploy on the metrics that matter. The one-day audit is the right *depth* for a periodic sweep; the [continuous budgets](/journal/engineering/bundle-budget-discipline) are what keeps the gains. Think dentist and toothbrush, not dentist and hope.

### We fixed everything and the score didn't move. Now what?

Usually one of three things: the fixes shipped but field data lags a full 28-day CrUX window (check the trend, not the current value); you fixed lab-visible problems while the field fails on a different device or network segment; or the regression lives behind consent/auth where your tools can't see. That third case is precisely when the one-day playbook has done its job and a deeper engagement starts earning its fee.
