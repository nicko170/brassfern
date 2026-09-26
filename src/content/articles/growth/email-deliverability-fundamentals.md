---
title: "Deliverability: the email growth lever nobody watches"
description: "SPF, DKIM and DMARC in plain English, list hygiene, domain warming, engagement-based sending, and how to diagnose why you landed in the promotions tab."
slug: email-deliverability-fundamentals
cluster: growth
tags:
  - email marketing
  - deliverability
  - lifecycle
  - growth ops
date: 2025-08-26
author: Mara Ellison
keywords:
  - email deliverability
  - dkim spf dmarc
  - email list hygiene
  - inbox placement
readingTime: 9
---

Here is a pattern we see in almost every growth engagement: a team has spent six months tuning subject lines, send times and template design — all the visible parts of email — while ten to twenty percent of their messages never reach an inbox at all. Not spam folder: *never delivered*, silently, to people who asked for the email. Deliverability is the growth lever nobody watches because its failure is invisible. An open rate of 38% doesn't announce "and it should be 47%".

The good news: deliverability is mostly hygiene and patience, not wizardry. This is the plain-English version we walk every client through before they touch a subject line again — the same foundation under our [lifecycle email architecture](/journal/growth/lifecycle-email-architecture).

## Authentication: the three-letter acronyms that gate everything

Mailbox providers start by asking "is this sender who they claim to be?" Three DNS-level records answer:

**SPF (Sender Policy Framework)** — a public list, in your domain's DNS, of which mail servers may send as you. If your email platform isn't on the list, your mail looks forged. Plain-English failure mode: you add a new tool (a helpdesk, a CRM), forget to authorise it, and its mail quietly fails at some providers.

**DKIM (DomainKeys Identified Mail)** — a cryptographic signature stamped on each message, verifiable against a public key in your DNS. Think wax seal: proves the message wasn't altered and really came from a sender holding your key. Every sending platform gives you DKIM setup docs; "we never got around to it" is the single most common finding in our audits.

**DMARC (Domain-based Message Authentication)** — the policy layer that ties the two together and tells receivers what to do when checks fail: monitor (`p=none`), quarantine, or reject. Since the 2024 sender requirements from Google and Yahoo, bulk senders effectively cannot operate at Gmail without DMARC — this is no longer optional craft, it's the door. Start at `p=none` to observe, graduate to quarantine, then reject. **BIMI** — the logo-in-the-inbox standard that sits on top of enforcement-level DMARC — is the rare deliverability chore with a visible brand payoff.

Audit order: send a test to a mail-tester tool, read the headers, fix the DNS. Half a day, done once, monitored after.

## Reputation: you are what you send, at volume

Authentication gets you past the door; reputation decides the room. Mailbox providers build a sender reputation per sending domain (and per IP, though shared-IP senders mostly inherit their platform's pool). The inputs are behavioural: spam complaints (the most expensive signal — fractions of a percent matter), bounce rates, engagement over rolling windows, spamtrap hits, and consistency of volume. Nobody outside the providers knows the exact recipe, and anyone who claims precision is guessing with confidence. What practitioners can observe is direction: when recipients engage, placement improves; when they complain or go silent at scale, it degrades.

Two rules follow. **Sudden volume spikes look like abuse** even when legitimate — a long-quiet list mailed hard will trip it. And **engaged sending beats big sending**: 5,000 opens from a 20,000 list mailed twice weekly beats 5,000 opens from a 100,000 list mailed the same way, because the denominator of silent recipients drags reputation. Smaller, warmer lists outperform bigger, colder ones — the same philosophy as [growth metrics that admit noise](/journal/growth/attribution-noise-decisions), applied to the inbox.

## List hygiene: the unglamorous 80%

- **Confirmed (double) opt-in for anything that matters.** Yes, it costs signups at the margin. It buys a complaint rate near zero and a list of people who actually wanted the email. The list-growth-vs-quality tension resolves overwhelmingly toward quality once deliverability is priced in.
- **Sunset policy.** Subscribers with no engagement in a defined window (90–180 days for most cadences) get a re-engagement attempt; silence after that means removal from regular sending. Not deletion — suppression. The [Hearthbrew subscription work](/work/hearthbrew-subscription-club) is our favourite illustration of protecting sender reputation by mailing less: periodic pruning of the never-opening segment, with a plain "still want these?" send, kept placement strong while the list's *revenue per email sent* climbed. Illustrative numbers, real mechanic.
- **Bounce handling is non-negotiable.** Hard bounces suppressed immediately on the first failure; soft-bounce repeaters suppressed on a short streak. Any platform worth its fee does this automatically — verify it, because "we assumed" is the entire history of deliverability incidents.
- **One-click unsubscribe, honoured instantly.** Required by the major providers' bulk-sender rules and by basic decency. Making exit hard doesn't retain anyone; it converts unsubscribes into spam reports, and spam reports are the complaint channel you cannot A/B test your way out of.
- **Never buy a list.** Not because it's gauche — because purchased lists are salted with spamtraps and dead addresses precisely so mailbox providers can identify senders who buy them. It's the one move in this article that can burn a sending domain for months.

## New domains and warming

A brand-new sending domain has no reputation, which providers treat as suspicious neutrality at best. Warming is the discipline of starting with your most engaged recipients at small volumes and scaling over weeks — engagement-rich early sends build the history faster sends later will need. A rough arc: hundreds per day in week one, thousands by week three, normal volume by week six, adjusting to engagement signals the whole way. Transactional mail (receipts, password resets) belongs on a separate subdomain from marketing anyway — reputation separation protects the mail your product depends on from the mail your marketing team experiments with.

## Diagnosing placement: the inbox vs the tab vs the void

When results sag, localise before you optimise:

1. **Delivered at all?** Seeded test addresses across Gmail, Outlook, Yahoo plus your ESP's delivery data. Non-delivery points at authentication and reputation, not content.
2. **Spam folder?** Reputation complaint-driven, almost always: complaint rates, trap hits, a recent volume spike, or a segment that never should have been mailed.
3. **Gmail promotions tab?** This is categorisation, not punishment — and the evidence that it craters performance is weaker than the lore says. Chasing the primary tab with stripped-down, linkless, text-only mail is usually a worse trade than being a well-opened promotion. Optimise for the open, not the address of the tab.
4. **Silent decay?** Rolling engagement windows mean slump compounds: as placement slips, opens drop, which slips placement. Catch it with trend monitoring on a per-provider basis — Gmail can sour while Outlook is fine, and the blended number hides it.

Australian senders: the Spam Act 2003 sets the floor — consent, identity, functional unsubscribe — and it is a floor, not a strategy. Compliance keeps you legal; everything above keeps you delivered.

## Key takeaways

- Authentication first: SPF, DKIM and DMARC are DNS chores, done once, monitored forever; DMARC enforcement is effectively mandatory for bulk senders at Gmail-scale now.
- Reputation is behavioural: complaints, bounces and silent-recipient drag matter more than any copy trick. Smaller, engaged lists outperform big, cold ones.
- Hygiene is 80% of it: confirmed opt-in, a sunset policy with suppression not deletion, instant unsubscribe, and never — never — a purchased list.
- Warm new domains over weeks, and split transactional onto its own subdomain so marketing experiments can't burn the password resets.
- Diagnose placement in layers: delivered → inboxed → tabbed → trending. Fix the layer that's actually broken.

## FAQ

**Our open rates dropped overnight — is it deliverability or the update to Apple's Mail Privacy Protection?** Check the shape: MPP inflates opens (it auto-preloads), so a sudden *drop* reads more like a placement or authentication problem, a segment change, or a provider-specific event. Per-provider trend lines separate the possibilities; blended numbers smear them together.

**Do we need a dedicated IP?** Only at sustained high volumes (several hundred thousand monthly is the rough neighbourhood) with strong engagement to support it. Below that, a reputable shared pool is usually warmer than a dedicated IP you can't keep hot. A dedicated IP with mediocre engagement is the worst of both.

**How long does reputation repair take after we mess up?** Weeks to months of disciplined, engagement-heavy sending at reduced volume, with the complaint sources removed. There is no form to fill in. This asymmetry — burnt fast, rebuilt slowly — is why the hygiene section above is non-negotiable rather than aspirational.

**Does the sending platform determine deliverability?** The platform sets the ceiling (IP pool quality, bounce handling, signing); your list and behaviour set the altitude. Migrating platforms to fix a reputation problem you brought with you just moves the problem to a new dashboard.

**Where do open-rate benchmarks fit, post-privacy changes?** As directional signals within your own history — trends per provider, per segment — not as absolute truth against industry tables. Click-to-delivered and reply rates are the cleaner read on engagement now; anyone quoting you a universal "good open rate" in 2026 is quoting a world that ended.
