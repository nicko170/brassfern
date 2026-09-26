---
title: "Reading agency contracts: IP, liability and the licence traps"
description: "A plain-English tour of the contract clauses that matter in creative engagements: IP assignment vs licence, portfolio rights, liability caps, kill fees, warranty windows."
slug: agency-contracts-ip-terms
cluster: playbooks
tags: [contracts, intellectual property, procurement, agency terms, legal]
date: 2026-06-09
author: Ruby Castellanos
keywords: [agency contract terms, design contract IP, agency agreement, creative services contract]
readingTime: 9
---

The first thing to say, in italics, in the first paragraph: *this is not legal advice, and we are not lawyers — we're producers who have read a decade's worth of creative-services contracts and watched which clauses actually detonate.* The point of this article is to make you dangerous in the hour *before* you call your lawyer, so the expensive hour is spent on the clauses that matter rather than the ones that don't.

Because here's what we've learned producing a few hundred engagements: nobody reads agency contracts until something goes wrong, and by then the contract is the whole conversation. The clauses that decide how that conversation goes are about six. Here's the tour, in descending order of blast radius.

## Clause one: who owns the work — assignment vs licence

This is the big one, and it hides in phrases like "intellectual property rights." Two structures exist, and they are not interchangeable:

- **Assignment** transfers ownership of the work to you, usually "upon full payment." You own the code, the designs, the words. You can modify them, take them elsewhere, hand them to the next agency.
- **Licence** means the agency keeps ownership and grants you permission to use the work — sometimes narrowly ("for use on the client's primary domain"), sometimes broadly. Read the scope of that grant like your budget depends on it, because it does.

Licence structures aren't inherently sinister — agencies keep ownership of genuinely reusable things all the time (more on that below). But a licence that quietly covers *everything* creates the classic trap: three years later you want a new agency to rework the site, and it turns out you'd need permission. We've taken over projects where the client's exit interview with the previous agency was basically a licensing negotiation. Unhappy endings were already written, on page eleven, in the third quarter of a good year.

What fair looks like: **deliverables are assigned to the client on full payment; the agency retains ownership of its pre-existing tools, libraries and internal frameworks, licensing those to you perpetually for use within the deliverable.** Anyone's lawyer can draft that sentence in a minute. If an agency resists the shape, ask why out loud.

## Clause two: the open-source and third-party stack

Your site is not a pristine sculpture; it's standing on a mountain of open source: React this, a date library that, a build tool all the way down. A good contract says plainly that deliverables include third-party open-source components under their own licences (MIT, Apache, whatever they are), lists the significant ones, and confirms the agency hasn't quietly included something with a copyleft or commercial licence that poisons your use case.

The trap version: contracts that are silent here, or worse, that warrant the deliverable is "wholly original work." Nothing is wholly original work and a clause pretending otherwise is a warranty nobody can honour. Also check **fonts and stock assets**: licensed fonts often can't be transferred; you may need your own licence to keep using them after handover. It's a $200 item that has a 100% chance of being discovered at the worst moment if it's discovered at all.

## Clause three: portfolio rights

Standard and reasonable: the agency may show the work in its portfolio after launch. But look at the details, because two of them bite:

1. **Timing.** Can they publish the case study the day you launch, or is there an embargo? If your launch is commercially sensitive — stealth startup, pre-announcement rebrand — negotiate a window.
2. **Claims.** Find the sentence that lets them describe the engagement, and make sure it doesn't let them claim outcomes they didn't cause. "We built the checkout that grew conversion 40%" — when two other firms also touched that checkout — is how fictional attribution enters the world. A decent clause is "factual description of services performed, subject to client's reasonable approval of published case studies." Reasonable approval rights are a sentence. Ask for the sentence.

For what it's worth, honest studios police themselves here — when we write [case studies](/work), the client reviews the metrics before anything ships, and our own [colophon says so plainly](/studio). But "trust us" is not a clause.

## Clause four: liability caps, indemnities and the warranty window

The metrics here are smaller than clients fear and bigger than agencies admit.

**Liability cap.** Expect the agency's total liability to be capped — commonly at the fees paid under the engagement, sometimes 12 months of fees. A contract with *no* cap sounds client-friendly and is actually a signal that nobody's read it; no insurer covers unlimited exposure, and a promise backed by nothing is a mood. What to check instead: which claims are *excluded* from the cap (IP infringement and confidentiality breaches are often carved out — good), and whether the exclusions include "consequential loss" language that quietly makes the cap worthless because all your real losses are consequential.

**Indemnities.** The fair exchange: the agency indemnifies you against claims that the deliverable infringes someone's IP (excluding things you supplied — your logo, your copy); you indemnify them against claims arising from your content and instructions. One-way indemnities in either direction deserve a red pen. So does an IP indemnity that evaporates if the work is "modified" — you'll modify it the week after launch; carve out modifications that don't cause the infringement.

**Warranty window.** Software ships with bugs; the question is who pays to fix the ones found right after launch. Thirty days is thin, ninety is common, and what matters more than the number is the definition: does the warranty cover *defects against the agreed spec* (defensible, testable) or a vague "material non-conformance" that becomes a philosophy seminar at midnight? Pair whatever window you negotiate with the [post-launch operating rhythm](/journal/playbooks/first-90-days-after-launch) so the window gets *used* — a 90-day warranty nobody tests against is confetti.

## Clause five: kill fees and termination

Every engagement should be exitable, and the price of exit should be arithmetic, not leverage. Look for:

- **Termination for convenience** with notice (14–30 days is normal), paying fees for work performed to date plus committed non-cancellable costs.
- **The kill fee** — a percentage of remaining fees payable on early termination. Some kill fee is legitimate chemistry: the agency turned away other work to hold your slot. But it should *taper* — a project killed in week two costing 50% of the remaining fees is a hostage clause. Ten percent, declining to zero past the midpoint, is the shape of a sane one.
- **What you own on exit.** This is the silent killer: does work-in-progress assign on payment-to-date, including in a termination? If the clause only assigns IP "on completion," a project terminated at 80% leaves you owning nothing you can hand to the rescuing agency. Fix that sentence before you sign, not during the breakup.

## Clause six: change control and the schedule of assumptions

The boring clause that decides whether months three to five are pleasant. A good contract makes change control mechanical: how a scope change is requested, estimated, approved, and what it does to timeline and price. Ours are deliberately unglamorous — the whole point is removing drama, which we wrote about in [scope change without drama](/journal/playbooks/scope-change-without-drama). Adjacent and equally load-bearing: the **assumptions** (your team reviews work within five business days; content arrives by an agreed date; a named decision-maker exists) and what happens when an assumption breaks. Assumptions without consequences are decoration; you want at least "timeline moves day-for-day" in writing, ideally in both directions.

## The ten-minute checklist

Before the lawyer, before the signature, run the paper against this:

- Deliverables assign on full payment — including on early termination, pro-rata.
- Agency's pre-existing tools are licensed to you, perpetual, within the deliverable.
- Third-party components disclosed; "wholly original" warranties deleted; font licences listed.
- Portfolio rights: embargo window, approval of case-study claims.
- Liability: sensible cap, real carve-outs, two-way indemnities, defined warranty window.
- Termination: convenience clause, tapering kill fee, exit-time IP assignment.
- Change control is mechanical; assumptions have consequences.
- The [SOW matches the contract](/journal/playbooks/reading-an-agency-sow) — scope, team, and price are the same document you discussed, not a colder cousin.

One last producer's note: the contract you'll actually experience is the *relationship* — the weekly demos, the status notes, the person who picks up the phone. Choose for that, via the [signals that actually predict it](/journal/playbooks/choosing-an-agency). But choose with open senses on the six clauses above, because the only time anyone reads a contract is the day it becomes the entire relationship, and on that day the difference between "assigns on payment" and "licensed for use on primary domain" is the difference between a negotiation and an ambush.

## Key takeaways

- Assignment (on payment, including on early exit) owns; narrow licences trap. Know which one page eleven grants you.
- No deliverable is "wholly original": open source, fonts and stock need disclosure and their own licences.
- Portfolio rights are fine — timing embargoes and approval of outcome claims are the details that bite.
- A capped liability with real IP carve-outs beats an unlimited promise backed by nobody's insurer.
- Kill fees should taper with the work; IP should assign pro-rata on exit. Fix these before signing, not during the breakup.
- Change control and assumption clauses are routine infrastructure, not pessimism — the drama-free months are built there.
- This article is the hour before the lawyer. Bring the lawyer for everything after.

## FAQ

**Should we just use our own paper instead of the agency's?**
Either works if the six clauses land fairly. Client paper drawn from procurement templates often miscasts creative work as commodity supply — "wholly original work" warranties, unlimited liability, no kill fee at all — which mostly succeeds at making senior agencies walk. Whoever's paper it is, judge it by the checklist, not by whose letterhead it's on.

**Is a mutual NDA enough before we share the brief?**
For the pitch stage, usually yes — briefs at that depth contain little you'd sue over. The heavier machinery (data processing terms, security schedules) belongs with the contract proper, once someone's seen your analytics. If an agency won't sign a reasonable mutual NDA to see a brief, that is itself a useful data point about the relationship to come.

**The agency won't budge on portfolio rights and we're pre-launch stealth. Options?**
Ask for what they actually need: usually the right to show work *eventually*. A 12–18 month embargo, or "after client publicly launches," solves a surprising share of these stalemates. What doesn't solve them is deleting the clause and assuming silence — agencies talk; write the timing down.

**What about AI-generated code and design — who owns that?**
The honest 2026 answer: ask the contract to warrant that the agency has rights to assign what it delivers *however produced*, that AI tools used don't leak your confidential data or impose licence contamination, and that a human authored or reviewed the deliverables you rely on. This area is moving fast; it's one of the places [our own AI practice](/services/ai) writes internal policy first and contracts second — your lawyer earns their fee on this clause specifically.
