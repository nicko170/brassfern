---
title: "404 pages with personality (that still get people home)"
description: "A 404 has three jobs: orient, recover, charm — in that order. The anatomy of an error page that rescues sessions, and how to measure whether yours works."
slug: designing-404-pages
cluster: web-design
tags:
  - UX writing
  - Brand voice
  - Error states
  - Conversion
date: 2026-03-18
author: Leonie Marsh
keywords:
  - 404 page design
  - error page ux
  - brand voice
  - website errors
readingTime: 8
---

Nobody plans to land on your 404. They arrive mid-errand, already slightly annoyed, usually by no fault of their own: a truncated link in a chat app, a CMS that renamed a slug without a redirect, a QR code printed two rebrands ago. The page they meet in that moment is the most honest page on your website. There is no funnel to protect, no narrative to sustain — just a stranger, a dead end, and whatever you decided to do about it. Most companies decided to do nothing. That's why the good ones stand out so much.

I write error pages for a living, and I've come to think of the 404 as a tiny rescue mission with three jobs, in strict order: **orient, recover, charm**. Personality is the garnish. Navigation is the meal. Get the order wrong and you've built a comedy club at a bus crash.

## Job one: orient (one second, no scrolling)

In the first second, the visitor needs to know two things: the page they wanted doesn't exist here, and they're still in the right place to get it. That's it. The failure mode we see most in audits isn't ugly 404s — it's ambiguous ones. Pages that say "Oops!" with no indication of what oopsed, or that redirect silently to the homepage, which is its own special cruelty. A silent redirect doesn't fix the dead end; it gaslights the user into thinking they mistyped.

Orientation is a copy problem first. Write the state plainly: "This page has moved or no longer exists." Not "Houston, we have a problem" — Houston's problem is not the user's problem, and the user's patience is shorter than yours. Then anchor it in your navigation. A 404 that strips the header and footer strands people on a bare stage; it reads as a broken site, not a missing page. Keep the chrome. The header is proof of life.

A small, overlooked detail: the HTTP status itself. Your 404 must return an actual 404 status code, not a 200 with a sad message. If Google's crawler can index your error page, you've polluted search results and corrupted your analytics. This is the kind of thing that is trivial in a statically prerendered site — the 404 is just an artifact like any other — and quietly broken in half the single-page-app deployments we audit.

## Job two: recover (three seconds, one obvious move)

Orientation tells people where they are. Recovery gives them somewhere to go. You have roughly three seconds of goodwill, and the research on this is consistent: the 404 page is a session-ending event until you give it an exit worth taking.

The obvious move is search. A real, working search box on the 404 converts a dead end into a detour, and it's the single highest-leverage addition you can make. We instrumented this on a content-heavy rebuild and found that 404 sessions with an on-page search field recovered at roughly four times the rate of sessions with navigation links alone. (Illustrative figures, your mileage will vary — but the direction never does.)

Second: links to where people were probably heading. Not a sitemap — a curated guess. Look at your top landing pages and your most common referrer paths into 404s. If broken links cluster around `/products/…`, link your catalogue and your contact page, not your investor relations page. Three to five links, written as destinations ("Browse the work", "Read the journal"), not as a wall of nav items repeated from the header.

Third, and most neglected: fix the source. Every 404 is a bug report someone filed with their feet. Server logs or analytics events on the error page will show you the requested URL and the referrer. Sort by frequency. The top twenty broken URLs usually account for the overwhelming majority of hits, and the fixes are drearily mechanical — redirects, updated links, an email to the partner who deep-linked a page you retired. A 404 page without a maintenance loop behind it is decoration on a leak.

## Job three: charm (only after the first two jobs are done)

Now — and only now — you may be funny. Personality on a 404 works because it converts a moment of friction into a moment of character. Done well, it's the cheapest brand advertising you'll ever publish, because it arrives when expectations are at zero.

But charm has a tone budget, and the budget is set by consequence. A 404 on a design studio's site can be playful — ours leans into it, because a visitor lost in our undergrowth is already in a forgiving mood. A 404 on a telehealth platform, reached by someone mid-symptom, should be calm, clear and quick. When we built the appointment flow for [Pylon Health](/work/pylon-health-telehealth-flow), the error states were written to the same standard as the triage questions: warm, unambiguous, zero jokes. The voice scales with the stakes.

The craft rules for charm:

**Own the mistake, don't blame the visitor.** "We can't find that page" outperforms "You seem to be lost" every time. Don't accuse people of typo-ing. You will be wrong often enough to regret it.

**Be specific, not zany.** Generic randomness ("Uh oh! Gremlins!") ages in six months and was never about your brand. Specificity is: a coffee roaster whose 404 offers to grind the lost page into filter; a records label that lists "b-sides that never shipped". When we wrote the error states for [Holloway Records](/work/holloway-records-label-site), the copy referenced test pressings gone missing in the post. It works because it could only be theirs.

**Keep it fast and flat.** A 404 is not the place for a heavy animation, an autoplaying video, or a full-screen game. It's an error page. People are trying to leave it. Delight that delays recovery is theft with better kerning.

**Match the rest of the site.** Your 404 should use your type, your palette, your voice principles. The worst 404s feel like they were bought in a marketplace and welded on. If your [brand voice guidelines](/services/brand-identity) don't cover failure states, that's a gap — the guidelines should tell a writer what "us, but apologetic" sounds like.

## Measuring the rescue

If you can't measure it, it didn't happen. Three numbers tell you whether your 404 works:

1. **Recovery rate.** Of sessions that hit a 404, what share continue to another page (excluding the homepage auto-redirect people do out of habit)? Establish a baseline before you touch anything. On most marketing sites we audit, baseline recovery sits between 20% and 40%; a rebuilt 404 with search and curated links commonly doubles it.
2. **Time to recover.** How long between landing on the 404 and the next meaningful pageview? Good designs recover in under five seconds. Long times mean the page is being read as a destination, not a signpost — usually because the charm-to-clarity ratio is off.
3. **404 volume by source.** Not a page-quality metric, but a hygiene one. Watch it weekly. A spike after a deploy means you shipped broken internal links; a slow climb means external referrers are rotting.

Set an alert on volume, review the top broken URLs monthly, and treat recovery rate as a design KPI with a named owner. Error pages are infrastructure. Infrastructure gets monitored.

## A short anatomy you can steal

The 404s we ship all share a skeleton:

- Plain-language status line: what happened, no mystery.
- The brand's personality in one or two sentences — never more.
- A search field (on content sites) or the single most likely next step (on product sites).
- Three to five curated links, ordered by probability.
- Full site chrome: header, footer, working everything.
- Correct status code, `noindex` where appropriate, and an analytics event firing on view.

That last list feels unglamorous next to a witty headline, and it's where the value is. The wit gets the screenshot on social media. The plumbing gets the session back. If you're rebuilding and want error states treated as first-class screens rather than afterthoughts, that's exactly the kind of detail our [websites practice](/services/websites) sweats — and our [approach](/approach) page explains why we demo them on Fridays, dead ends included.

## Key takeaways

- A 404 has three jobs in order — orient, recover, charm. Personality before clarity is a party trick at someone's expense.
- Never silently redirect to the homepage. It confuses users and corrupts your analytics.
- On-page search is the single most effective recovery tool; curated links are second; charm is third.
- Voice scales with stakes. A bank and a band should not write the same error page.
- Instrument it: recovery rate, time to recover, and 404 volume by source, reviewed monthly.
- Error pages need a maintenance loop behind them, or you're decorating a leak.

## Frequently asked questions

**Should a 404 page be indexed by search engines?**
No. Return a true 404 status code and keep the page out of the index. A 404 served with a 200 status (a "soft 404") confuses crawlers, wastes crawl budget and can surface your error page in search results — the worst possible first impression.

**Is a funny 404 ever a bad idea?**
Yes, whenever the visitor is stressed, in a hurry, or dealing with something consequential — health, money, emergencies. In those contexts, warmth beats wit: acknowledge the dead end, apologise briefly and get them moving. Save the jokes for low-stakes browsing contexts where the visitor's only injury is mild inconvenience.

**How many links should a 404 page have?**
Three to five curated links, plus your normal navigation. More than that and you've rebuilt your sitemap on an error page, which forces a decision at exactly the moment the visitor least wants to make one. Choose for them, based on where your traffic and broken links actually point.

**Do we need a custom 404 if we're a tiny site?**
Tiny sites arguably need one most, because every lost visitor is a larger share of the pipeline. The minimum viable version is cheap: one clear sentence, your normal header, and two links. You can grow the charm later; ship the clarity now.
