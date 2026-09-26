---
title: "Fernway College: admissions journeys without the paper cuts"
description: "One editorial platform for a school's admissions, alumni and news — with an enrolment journey that saves progress and a CMS the comms team actually runs."
slug: fernway-college-admissions-platform
cluster: work
tags: ["case study", "education", "headless cms", "admissions ux", "design systems"]
date: 2025-11-20
author: Leonie Marsh
keywords: ["education website case study", "school admissions ux", "headless cms case study", "editorial platform"]
readingTime: 9 min read
client: Fernway College
industry: Education
services: ["Websites", "Brand & identity", "Product design & engineering"]
year: 2025
stack: ["React", "TypeScript", "Sanity", "Node", "Cloudflare", "Plausible"]
---

Fernway College is a fictional independent school of 1,200 students in the Adelaide Hills — strong programs, a beautiful campus, and a digital estate that had accreted like sediment. A marketing site from 2017. A separate enrolments portal from a vendor nobody remembered choosing. An alumni microsite on a subdomain, running a CMS so old its vendor had stopped existing. Every one of them told a slightly different story about the school, in a slightly different voice, at a slightly different URL.

The brief from the principal was disarmingly honest: "Parents judge us on this before they ever visit. Right now I'd judge us too." Here is how we put admissions, alumni and news under one editorial roof. Numbers are illustrative, in the time-honoured tradition of agency case studies — but directional and honestly earned.

## The challenge

School websites serve three audiences who want almost opposite things. Prospective parents want to fall in love and then enrol, in that order, without friction between the two. Current parents want three facts — term dates, the canteen menu, whether Thursday's excursion needs gumboots — in under ten seconds. Alumni want to be flattered, nostalgic and gently asked for money, approximately never in the same breath as a lunch menu.

Fernway's stack forced all three through the same brochure pages. Worse, the enrolment journey — the single highest-value flow on the estate — was a vendor portal that looked and behaved like a tax office: one session, no save-and-return, fourteen pages long, and abandoned on 71% of starts. The registrar's team compensated with a parallel paper process, which is a polite way of saying the digital one had failed.

And the communications team of two was drowning. News lived in three systems; a single event required five copy-pastes; the alumni editor had left in 2022 and nobody knew the subdomain's admin password. A headless rebuild was clearly right — but we've seen too many CMS migrations that swap one unusable admin for a shinier one. (We wrote the runbook we wish everyone followed: [the headless CMS migration runbook](/journal/engineering/headless-cms-migration-runbook).)

## The approach

**One platform, three doors, a shared spine.** We consolidated marketing, enrolments, alumni and news onto a single React front end over Sanity, with one design system — nicknamed *Ivy* by the team, and the name stuck — supplying every component. The information architecture was re-derived from search logs and front-office call records rather than the school's org chart, which is why "Term dates" now sits in global nav and the governance page sits in the footer, where search data said both belonged.

**An enrolment journey that respects how families actually decide.** Enrolling a child takes weeks and involves two parents, often at different kitchen tables. So the new flow is a wizard with a memory: create a profile with an email address, and every step saves automatically; return from any device and resume exactly where you stopped. Steps are chunked by decision, not by database table — *Your child*, *Your family*, *The practicalities* — with a persistent progress rail and a plain-English summary page you can print and argue over at the aforementioned kitchen table. Document uploads accept a phone photo of a birth certificate without complaint. The patterns are the ones we keep and the ones we've banned in [multi-step flows that don't feel like tax forms](/journal/product/multi-step-flows-wizards), applied to the highest-stakes form a school owns.

**An editorial model the comms team could actually run.** This was the real product. We modelled content as structured, reusable objects — *story*, *event*, *person*, *program*, *policy* — so a single athletics carnival becomes one entry that surfaces on the news feed, the calendar, the sports page and the weekly digest email without a single copy-paste. Preview builds render the actual site against draft content, so approval means seeing the real page, not guessing from form fields. We trained the team of two for a day and a half, wrote a twenty-page field guide in their voice (not ours), and held a monthly editorial clinic for the first quarter. The governance model — who may publish what, and how it expires — came from the same editorial-ops thinking in [content ops that survives contact](/journal/growth/content-ops-editorial-calendar).

**Ivy, the design system.** Fernway's identity was a respectable crest and a chaotic everything-else. We kept the crest (schools run on continuity) and rebuilt the expression around it: a serif voice for the school's story, a no-nonsense sans for administration, a palette drawn from the campus itself — sandstone, eucalypt, blazer navy — and a component library covering the forty-ish patterns a school site genuinely needs. Each component shipped with its editorial rules written beside it: when to use a hero, when a news card is enough, and who is allowed to decide otherwise.

**Alumni, flattered properly.** The alumni section got its own editorial register — warmer, first-name, archived photography treated with care — but shares the platform's spine, so a reunion event is the same *event* object as the athletics carnival, wearing a different voice. Giving pages lead with stories of what previous gifts built, and the ask is refreshingly direct.

## The outcome

Twelve months after launch, illustrative results:

- **Admissions enquiries up 46%**, and — the number the registrar actually cares about — *completed* enrolment applications up 58%, as save-and-return turned the 71% abandonment rate into 24%.
- **Publishing time down 60%.** The weekly news cycle that consumed a day now takes under two hours; the comms team redeployed the time into actual storytelling.
- **Zero parallel paper processes.** The registrar's office retired its shadow spreadsheet in term one.
- **One password to remember.** Alumni and news editors work in the same studio as marketing, on the same objects, with permissions matching their roles.
- **Core Web Vitals comfortably green on a school-run device fleet**, which matters more than it sounds: a meaningful share of current-parent traffic is a phone on one bar of playground reception.

Fernway sits in a family of education work we've done alongside [Brightmarsh's course onboarding](/work/brightmarsh-onboarding) — different sector position, same belief that institutions should respect the time of the people they serve. If your school, college or training organisation is running its most important journey on a vendor's forgotten portal, our [websites practice](/services/websites) and [approach to fixed-scope work](/approach) were built for exactly this.

## What we'd tell any school replatforming

Don't start with the homepage; start with the enrolment flow and the newsroom. Get three audiences three doors off one spine — and model content as objects, not pages, so one update propagates everywhere it should. And budget a day and a half of training plus a written field guide. The platform only works if the two busiest people in the school can run it on a Friday afternoon.
