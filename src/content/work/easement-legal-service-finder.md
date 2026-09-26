---
title: "Easement Legal: a law firm site without the mahogany"
description: "A community legal centre replaced mahogany-and-gavel clichés with a plain-language service finder, honest fee tables and interpreter-first design."
slug: easement-legal-service-finder
cluster: work
tags:
  - case study
  - legal services
  - plain language
  - accessibility
  - service design
date: 2025-04-07
author: Leonie Marsh
keywords:
  - legal website case study
  - service finder ux
  - plain language design
  - trust design
  - community legal centre
readingTime: 9 min read
client: Easement Legal
industry: Non-profit
services:
  - Websites
  - Brand & identity
  - Product design & engineering
year: 2025
stack:
  - Astro
  - TypeScript
  - Sanity
  - Pagefind
---

Easement Legal is a fictional-but-plausible community legal centre in western Sydney: fourteen staff solicitors, a volunteer advice night, and a caseload spanning tenancy, family law, fines and employment. Their clients arrive in the worst week of their year, often in a language that isn't English, almost always on a phone. Their old website greeted these people with a stock photo of a gavel, a "practice areas" dropdown full of Latin, and a contact form that promised a reply "within 5–7 business days".

The centre's principal solicitor put it bluntly in the kickoff: *"The site looks like we charge. We don't."* Here's how we rebuilt it around the people actually arriving, what we made of the dreaded fee question, and the illustrative numbers that followed.

## The challenge

Community legal websites share a failure pattern we've also seen in health and government work: they're written to reassure *funders and peers*, not the person on the phone at the bus stop. Easement's version had three specific fractures:

- **Intake was a translation tragedy.** 41% of the centre's clients prefer a language other than English — Arabic, Vietnamese, Mandarin and Dari most of all. The old site was English-only with a "for interpreters, call…" footnote.
- **Legal categories don't match life categories.** "Civil litigation — tenancy division" is how the profession files the problem. The client's filing system is "my landlord is evicting me". The mismatch meant the front desk spent eleven hours a week redirecting people who'd read the site and still called the wrong line.
- **Fees radiated anxiety.** Community centres are mostly free or low-cost, but the old site said nothing about money anywhere, and silence on price reads as *expensive*. Reception's most-heard opening line: "I probably can't afford this, but…"

## The approach

**A service finder written in life-events, not legal taxonomy.** The homepage leads with a single question — *"What is happening?"* — followed by plain-language doors: "I'm being evicted", "I've left a violent relationship", "My employer hasn't paid me", "I can't pay a fine". Each door opens a one-page answer in this order: what this usually means, whether Easement can help, what it costs (usually nothing), and what to do today. The structure echoes the answer-first pattern in [our dashboard philosophy](/journal/product/dashboard-design-hierarchy): the answer leads, the apparatus follows.

**Interpreter-first, not translated-after.** We built the four priority languages as first-class editions, not machine translations bolted on: professionally translated, reviewed by community readers, and — crucially — the *information architecture itself* was adapted, because tenancy stress is framed differently across communities. A persistent, honest interpreter line ("Call us and say your language — we'll bring an interpreter, free") appears on every page, in that page's language. The phone number is tappable and huge.

**The fee table, on the homepage.** We put money where the anxiety lives. A simple band: *Advice — free. Casework — free if you're eligible (here's what that means in 40 words). If you're not eligible, here's what private help typically costs, because surprises are worse than numbers.* Publishing the *shape* of costs, even other people's, was the single most discussed decision of the project — and the most vindicated. It's the same honesty-lever approach as the pricing work in [our Larklight rebuild](/work/larklight-saas-marketing-site), transplanted to a place where the stakes are eviction, not MRR.

**Trust signals that aren't stock gavels.** No marble columns. Instead: photos of the actual advice room (warm, a bit scruffy, real), named solicitors with human bios that say what they're good *at* ("Ruth has handled 400+ tenancy matters and will tell you straight"), and a prominent registration line from the professional regulator. Research keeps showing specificity outperforms symbols — we said the same thing rebuilding [Copperline Mutual's voice](/work/copperline-community-bank).

**Built for the phone at the bus stop.** The site is a static build: sub-second pages on a prepaid Android, works in the train tunnel, total page weight under what the old hero image weighed alone. Accessibility was treated as the baseline rather than the audit — the process is the one we've documented for [product teams getting WCAG AA right](/journal/product/wcag-aa-product-teams) — and every page passes at a grade-8 reading level, checked with real readers, not just a score.

## The outcome

Eight months post-launch:

- **"Wrong line" calls to the front desk fell 62%** — the equivalent of handing the centre back most of a full-time role, redeployed into casework.
- **The four non-English editions now account for 29% of all sessions**, and advice-night attendance with an interpreter booked ahead rose measurably — people arrive expecting to be understood.
- **The opening line changed.** Reception logged the "I probably can't afford this, but…" preface dropping from the majority of calls to under one in five. The fee band did that.
- **Saturday-evening traffic tripled.** The worst weeks don't keep business hours; a site that answers properly at 9pm on a phone quietly became the front door.
- **Two other community legal centres adopted the service-finder content model** (the taxonomy and page templates are deliberately shareable), which the centre counts as impact, not competition.

## Stack and team

Astro for a static, featherweight build; TypeScript; Sanity so the (tiny) staff team edits every word themselves; Pagefind for instant client-side search in all five languages. Squad: one content lead (me), one designer, one engineer, with the principal solicitor and two front-desk staff in weekly reviews — front-desk staff, note, not just management. The shape of the engagement is the one we describe in [how we work](/approach).

## What we'd tell another legal service

Write your categories from the client's week, not your org chart. Publish the money shape even when the honest answer is "it depends" — especially then. And treat translated editions as products, not features: they deserve their own readers, their own testing, their own care.

More in this spirit across [our non-profit work](/industries/non-profit) and [the journal](/journal). If your organisation's website is turning away the people it exists for, [we'd like to hear about it](/contact).
