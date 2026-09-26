---
title: "Rebrand rollout: the domino order matters"
description: "A rebrand is a logistics operation wearing a brand costume. The domino order — domain, redirects, app stores, email, legal — that decides whether launch week sings."
slug: rebrand-rollout-sequencing
cluster: brand
tags: [rebrand, rollout, brand launch, operations, checklist]
date: 2026-01-27
author: Mara Ellison
keywords: [rebrand, brand launch, rollout, checklist, brand strategy]
readingTime: 9
---

The rebrand presentation went beautifully. The board loved the new mark. Someone said "it finally feels like us." Then, eight weeks later, the launch: the old logo on the login page for six days, the app-store screenshots still showing the old name, customer support drowning in "is this email really from you?" tickets, and a link in the top-performing SEO article pointing at a domain that no longer resolves.

Every rebrand has two projects inside it. The first is the identity work — the part with the beautiful decks. The second is a logistics operation: hundreds of surfaces, in dozens of systems, on an order that has to be right because the dominos knock each other over. We've written about the strategic middle elsewhere — [the rollout plan](/journal/brand/rebrand-rollout-plan) and the [announcement day itself](/journal/brand/rebrand-announcement-day). This piece is narrower and more operational: the sequence. Because in rebrands, the order *is* the strategy. Get it wrong and the same work costs three times as much with twice the confusion.

## The golden rule: infrastructure first, theatre second

Temptation runs the other direction. The reveal video is exciting; the redirect map is not. But everything visible depends on something invisible, and the invisible things have lead times nobody controls: app-store review queues, DNS propagation, legal entity changes, printed signage, the trademark filings that started [months before anyone designed anything](/journal/brand/naming-process-field-guide). The rollout sequence is built backwards from the launch date through dependencies, and each dependency forces a surprising amount of honesty about what "the brand" actually touches.

Our working sequence, in order, with the reasoning:

## Domino 1: the digital root (T-minus 10–8 weeks)

**Domains, redirects, and email deliverability.** Everything else depends on these, so they land first and quietly.

If the domain changes: register the new one early, park it with a holding page that reveals nothing, and build the redirect map *old page to new page*, not old domain to new homepage. A domain change is a site migration with a costume change; the mechanics are exactly the ones in [migrations that don't tank organic traffic](/journal/growth/site-migration-seo) — one-to-one 301s, sitemap swap, Search Console change-of-address, and a watchlist on the top hundred pages by organic traffic. Budget the redirect work properly: on one rebrand we rescued, the map was 2,300 URLs and had been estimated at "an afternoon."

Email is the sleeper. A new sending domain has no reputation; announcement day is the worst possible moment to discover your messages land in spam. Warm the new domain for weeks in advance: subdomain first, small engaged segments, proper SPF/DKIM/DMARC. And change the *display name and signatures* in lockstep across every inbox tool — a rebrand where sales emails still say the old company name reads as a phishing attempt to exactly the customers you most want to keep. Get ahead of it with the deliverability fundamentals in [the email lever nobody watches](/journal/growth/email-deliverability-fundamentals).

## Domino 2: the gates you don't control (T-minus 8–4 weeks)

**App stores, marketplaces, social handles, review platforms.** These have queues and policies you cannot negotiate with, so submit early and hold.

App-store reviews can take days or — before a holiday code freeze — longer. Submit the re-skinned build early with staged rollout disabled, so approval is in hand and release is a button press on the day. Check every marketplace and platform listing: app stores, browser extension galleries, Slack and Salesforce integrations, G2-style review profiles, the Google Business profile, the Apple Business entry. Social handles need securing across *every* platform including the ones you'll never use, because an unclaimed matching handle on a platform you ignore is a ticket to an impersonation headache.

The unglamorous task here is the **asset inventory**: a single spreadsheet of every surface where the brand appears, with owner, effort, sequence slot, and status. Logos in product, social avatars, ad creative, PDF letterheads, invoice templates, favicons, loading spinners, error pages, physical signage, the footer of automated emails. Every rebrand we've audited found *at least* a hundred surfaces; the median was well over two hundred. The inventory is not optional paperwork — it is the rollout.

## Domino 3: the theatre (T-minus 4 weeks to launch day)

Now — and only now — the visible work, because its dependencies are staged.

The marketing site launches first on launch morning, redirects live, so press and social traffic land somewhere coherent. The product re-skin ships within the same 48 hours: nothing poisons "we've grown up" like a marketing site saying new things to a product still wearing the old skin. The announcement plan — founder letter, press, the film — is its own discipline, covered in [rebrand announcement day](/journal/brand/rebrand-announcement-day), but the sequencing note is this: the announcement should be the *last* thing that happens, timed so every surface a sceptic might check already reflects the change. Launch-day war room: one channel, named owners per surface, a go/no-go checklist, and the phone numbers of anyone who controls a gate you discovered late.

Internal comms runs a week *ahead* of external: the team gets the story, the assets, the new email signatures, and answers for customers before the public does. A rebrand your own staff learn about from LinkedIn has already lost its first audience.

## The 90-day tail: where rebrands actually succeed or fail

Launch day is not the finish; it's the start of the tail — the long trail of missed instances that surfaces for about three months. An investor deck from 2023 circulates with the old mark. A conference lanyard. A template buried three menus deep in the CRM. An integration partner's marketplace listing that needs *their* release cycle, not yours.

Run the tail deliberately instead of being ambushed by it:

- **Weekly sweep for 90 days** against the asset inventory: every item either updated or consciously deferred with a date. Deferral is a decision; discovery is a failure.
- **Monitoring for the old name** — brand mentions, support macros, search queries. "Did you used to be called…?" is a support-ticket category for a year; give support the answer and the macro.
- **A kill date for the old brand.** Renaming projects die by a thousand grandfathered exceptions. Pick the date after which the old mark appears nowhere except archive screenshots, put it on the wall, and defend it.

## Measuring reception without the fairy tale

Resist the sentiment-dashboard story where the chart goes up after launch and everyone applauds. Rebrand measurement is slower and more honest. What we track:

- **Brand demand, not brand mood:** direct traffic, branded search volume, [share of search](/journal/growth/share-of-search) against the category — quarter over quarter, not week over week. The first two weeks are launch noise.
- **Confusion cost:** support tickets about identity ("is this really you?"), phishing reports, email reply rates dipping on the new domain. These should spike small and decay fast; if they persist, the transition comms failed, not the identity.
- **The old-name hangover:** how long branded search for the old name persists and where it lands. Those queries should hit a page that answers the question directly, not a homepage that pretends the old company never existed.
- **The qualitative check that matters:** sales calls. Do the team use the new name without flinching at week six? Do prospects repeat the new positioning back unprompted by week twelve? That's perceived rebrand success, and no mention-volume chart answers it better.

The reception measurement plan should be written before launch, alongside the rollout plan — the same discipline as [setting redesign goals that aren't vibes](/journal/playbooks/goals-for-redesign-projects), because a rebrand without pre-agreed measures gets judged on the loudest opinion in month two.

## Key takeaways

- A rebrand is a logistics operation: the sequence is the strategy, and it runs infrastructure first, theatre second.
- Domains, redirects and email reputation land 8–10 weeks out; a domain change is a full SEO migration, not a costume change.
- The gates you don't control (app stores, marketplaces, handles) get submitted early and held on staged release.
- The asset inventory — every surface, owner and status — *is* the rollout; expect a hundred-plus items.
- Internal comms runs a week ahead of external. Staff learning from LinkedIn is a lost first audience.
- The 90-day tail is where rebrands succeed: weekly sweeps, monitoring for the old name, and a defended kill date.
- Measure brand demand and confusion cost quarterly, not launch-week sentiment. Write the plan before launch.

## FAQ

**Should we do a hard switch or a gradual transition ("New Name, formerly Old Name")?**
Hard switch for the core surfaces, "formerly" bridge only where recognition risk is acute: email sender names, the login flow, anywhere a customer could mistake you for an impostor. The bridge is a cast on a broken bone — six to twelve weeks, then it comes off. Brands that wear "formerly" for two years never finish the rebrand.

**How do we handle print, merch and office stuff — the physical inventory?**
Gracefully and cost-honestly: run it down rather than landfill it, except anything customer-facing (signage, event booths, packaging) which flips on sequence like everything else. Let the ugly spreadsheet include a "deplete and don't reorder" column. Nobody remembers the notebooks; everybody photographs the building sign.

**What about the legal entity name versus the trading name?**
Decouple wherever you legally can. Entity changes drag banks, tax registrations, and contract novations into your rebrand. A new trading name over a stable entity is months cheaper. Invoices and contracts can read "NewBrand (trading name of Old Entity Pty Ltd)" for as long as your lawyer is comfortable — often indefinitely.

**When do we tell customers — and which ones first?**
Tiered, ahead of public: key accounts and active sales conversations get a personal heads-up the week before ("nothing changes operationally; here's what's changing visually"), the wider base hears on launch day through product and email, with the sender-name bridge in place. The customer who learns your new name from a bounced invoice is the story the rebrand gets remembered by.
