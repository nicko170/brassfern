---
title: "Rebrand rollouts: the unglamorous crucial middle"
description: "Launch day is the easy part. The rebrand rollout plan: asset census, coexistence windows, internal enablement and honest measurement long after the applause."
slug: rebrand-rollout-plan
cluster: brand
tags: [rebrand, brand implementation, rollout plan, project management, brand ops]
date: 2024-11-20
author: Mara Ellison
keywords: [rebrand rollout, brand implementation, rebrand checklist, brand launch plan]
readingTime: 10
---

Every rebrand has a photo in the case study: the launch post, the pleased CEO, the social spike. What the photo leaves out is the four months either side of it — the part where the rebrand actually happens or quietly doesn't. We've watched beautiful identities die in rollout more often than in critique: killed by a billing system that still sends the old logo, by sales decks cloned from 2021, by a warehouse full of pre-printed boxes nobody budgeted to replace. The design work is the visible tenth. This is about the other nine-tenths: the unglamorous, crucial middle between the reveal and the day the old brand is genuinely gone.

Everything below is how we run rollouts inside [rebrand engagements](/services/brand-identity), learned across launches like [Copperline Mutual's](/work/copperline-community-bank) (regulated, branches, statements — the hardest mode) and [Holloway Records'](/work/holloway-records-label-site) (physical stock you can't patch). It's sequencing, mostly. Sequencing is the whole game.

## Start the rollout plan before the reveal is scheduled

The most expensive sentence in brand work: *"we've announced the date, is that enough time?"* A reveal date set before the asset audit is a hostage situation. Do these three things before any date goes in an email:

1. **The asset census.** List every surface the brand touches. Not "website, decks, social" — the actual inventory. Website, yes, but also: the PDF that Stripe-style receipts generate, the email templates in the ESP (all four templates, including the password reset nobody remembers), the app-store screenshots, the favicon, the Slack workspace icon, the signage, the employment contracts with the logo in the header, the investor data room. Our census template runs to 140 line items and clients are always shocked by at least twenty of them.
2. **Classify by switching cost. Instant / Scheduled / Sunset.** Instant: anything digital you control (site, product UI, social avatars) — these flip on reveal day. Scheduled: third parties and print (app stores review on their timeline; business cards need ordering). Sunset: things that will show the old brand until it's economical to change them (warehouse stock, hardware splash screens, a van wrap).
3. **Find the legal floor.** Regulated names, terms-of-service entity references, copyright lines and registered-trademark symbols have dates and jurisdictions attached. If the legal entity name changes, the rollout is on legal's critical path whether anyone likes it or not.

Only now do you set the date — backwards from the slowest Scheduled item, not forwards from excitement.

## Run the coexistence period on purpose

Here's the uncomfortable truth: for a window of weeks to months, both brands will be live in the world. Amateurs pretend this window doesn't exist and get caught contradicting themselves. Professionals design it.

**Pick the transition sentence.** One line, used everywhere the old brand appears during the window: *"Northwind Ledger is now [Client] — same team, new name, nothing about your account changes."* Write it before the reveal. Localise it. Put it in the support macros, the email footers, the old website's persistent banner, the app-store "what's new" text. Consistency across six months of small surfaces is what makes a rename feel organised rather than abandoned.

**Decide your coexistence hierarchy.** Money-adjacent surfaces change last and most carefully. When Copperline renamed, transaction notifications and statements kept the old name longest — with the transition sentence appended — because a payment alert from an unfamiliar sender is how you train customers to ignore fraud. Marketing surfaces flipped first because confusion there is cheap; confusion in a bank statement costs a call-centre week. Rank your surfaces by cost-of-confusion, not by visibility.

**Redirect like you mean it.** The old domain 301s everything, indefinitely — and the redirects get tested the week *before* launch, not during it. Keep the old email addresses accepting mail for at least a year; set auto-replies only where legally required, else forward silently. Divide old-name search traffic into "will follow a redirect" (fine) and "won't" (buy the old-name variations in paid search for two quarters). A rename without a search migration plan is an [SEO lesson learned the expensive way](/journal/growth/) — plan it with the same rigour as a [site migration](/journal/engineering/), because it is one.

## Internal enablement is half the project

Your team is the brand's largest surface and its most forgetful. Two hundred employees clone decks and forward templates every day; the old identity has home-court advantage. Enablement beats enforcement:

- **Make the new thing the path of least resistance.** Publish the new slide master into the actual template gallery, not a shared drive. Replace the email-signature generator. Ship a brand kit (logos in every format, sizing rules, the [voice charts](/journal/brand/brand-voice-charts)) as one canonical internal page — version-numbered, so "the PDF I downloaded in March" stops being an argument.
- **Recruit the power users.** Every org has the person whose deck everyone clones. Find them, brief them two weeks early, give them the new master first. You've just converted the distribution network.
- **Answer the forty questions in one sitting.** Run a company AMA the week of reveal, publish the transcript. The questions are always the same forty: what happens to my email address, do expense receipts need the new name, what do I tell the customer who asks why. Every unanswered question becomes an improvised local policy.
- **Give it a shelf date.** "Use up old stock where it doesn't face a customer, run out by Q3, then it's gone." A sunset rule prevents both waste and eternal limbo.

## Launch week is logistics, not vibes

The reveal itself should be boring because everything thrilling already happened. Our launch-week runbook, condensed:

- **Day −7:** redirect tests, asset stage in production behind flags, DNS lowered-TTL'd, status page note drafted, sign-off list walked (legal, security, exec, support leads).
- **Day 0, early:** site and product flip behind the flag, social avatars swap within the same hour, the announcement posts, the email to customers goes out *before* the public press — customers hearing it from TechCrunch before hearing it from you is a small betrayal they'll remember.
- **Day 0, later:** someone owns the inconsistency hunt. Crawl the site for old-logo images (they hide in blog heroes), screenshot every email template, check the app stores. Expect to file a dozen tickets; the system works if they're small ones.
- **Day 3:** support retro. What did customers actually ask? Fold answers into the macros and the launch FAQ the same week.

And have the rollback conversation in advance: what, precisely, would make you flip the flag back? "Embarrassment" isn't a criterion; "payments failing" is. Deciding the threshold in calm beats improvising it in a storm.

## Measuring after the applause

The launch metrics are the easy part and the least informative. Brand-lift is slow; honest measurement is scheduled:

- **30 days:** operational health. Broken links resolved, redirect coverage at 100%, support-ticket volume on naming confusion trending down week over week, delivery rates on the new email domain clean.
- **90 days:** search reality. Old-name queries declining, new-name queries climbing, and the old-name-to-new-entity association picked up by the knowledge panel. Branded search is the truest rename instrument there is.
- **180 days and 365 days:** the actual question. Unaided awareness versus baseline, consideration in your category, and — if the rebrand promised a commercial effect like [we promise clients on engagement models](/pricing) — the funnel metrics it was meant to move. Write the baseline down *before* launch or the anniversary review becomes a poetry reading.

## Key takeaways

- Do the asset census and switching-cost classification before anyone sets a reveal date. Dates precede audits only in horror stories.
- Design the coexistence window deliberately: one transition sentence everywhere, and the riskiest surfaces (money, legal, statements) change last.
- Enablement beats enforcement: put new templates where people already work, recruit the power users, answer the forty questions once.
- Launch week is a runbook. Customers hear it from you before the press; a named owner hunts inconsistencies on day zero.
- Measure on a schedule: ops at 30 days, search at 90, brand lift at 180 and 365 — with baselines captured before launch.
- Budget the physical world. Print run-offs, stock splash screens and van wraps have their own economics; decide the sunset rules up front.

## FAQ

**How long does a full rollout take?**
From locked identity to "the old brand is genuinely gone": four to nine months for a mid-size company. Reveal day is roughly the one-third mark. Anyone promising a six-week total rebrand means the design part.

**Big bang or phased?**
Phased for audiences, big-bang per surface. Each individual touchpoint flips completely — a half-old, half-new checkout is the worst of both worlds — but the order of touchpoints is sequenced by cost-of-confusion, not enthusiasm.

**Our old name has real SEO equity. How scared should we be?**
Appropriately, not paralysed. A disciplined redirect map, the transition sentence on legacy pages for a quarter, and patience through the algorithm's reassociation window recovers most equity in 90–120 days. What never recovers is a rename done with no redirect map at all.

**What's the single most-forgotten surface?**
The password-reset email. It sits in the ESP, copied from a template old enough to vote, and it's the one touchpoint every single user will eventually see. We check it on day zero of every rollout, and it has been wrong every single time.
