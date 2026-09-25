---
title: "The footer is a sitemap with manners"
description: "Footers are the most neglected designed surface on the web. A taxonomy of trustworthy footer patterns — navigation, reassurance, colophons — and what each one earns."
slug: footer-design-matters
cluster: web-design
tags: [footer design, navigation, information architecture, trust signals, web design craft]
date: 2024-11-18
author: Leonie Marsh
keywords: [footer design, website footer best practices, navigation design, trust signals, website colophon]
readingTime: 8
---

There is a moment, about two-thirds through designing any website, when the footer gets designed. It's usually a Tuesday. Someone drags a dark rectangle onto the bottom of the homepage artboard, types "© 2025 Company Name" and a few orphaned links into it, and the room moves on. The footer becomes the web's junk drawer: privacy policies, an RSS icon nobody chose, "Careers" for some reason, and a newsletter field entombed beneath eleven columns of link slurry.

This is a waste, and measurably so. The footer is the only element on every single page of your site. It's where lost users go to reorient — analytics on our projects consistently show footer nav clicks skewing toward *high-intent* lookups: pricing, contact, documentation. People who scroll to the bottom of a page are telling you something: "the page didn't give me the next step." The footer is the answer to an implied question, and it deserves to be designed like one.

After building footers for [record labels](/work/holloway-records-label-site), [providores](/work/tallow-and-co-providore) and everything between, we've settled on a taxonomy. Four jobs, in descending order of importance. A great footer does the first three; a memorable one does all four.

## Job one: wayfinding for the lost

The primary job is navigational: **catch everyone the page failed**. Structurally this means the footer is a compressed, honest sitemap — but "honest" does the work in that sentence. Two failure modes dominate:

**The everything drawer.** Forty-seven links in nine columns, including links to pages the nav already has, pages nobody should visit, and three legacy vanity URLs kept alive out of fear. Link slurry helps no one; paradoxically it also hides the few links people actually come for. Our ceiling: ~25 links, and every one must survive the question "who arrives at the bottom of a page needing *this*?"

**The marketing echo.** A footer that repeats the hero's three CTAs and nothing else. This optimises for the funnel slide in someone's deck and abandons the reader who wants the careers page, the press kit, or the accessibility statement.

The shape that works: columns grouped by *reader intent*, not org chart. On Brassfern-flavoured sites that's typically "Work" (case studies, process), "Studio" (about, team, [journal](/journal), [careers](/careers)), and "Start" ([contact](/contact), [pricing](/pricing)). Note the ordering: for service businesses the final column is the conversion column, and it holds a real CTA — not a buried text link, a button — because the bottom of the page is exactly where a convinced reader ends up.

Two craft details that separate good from ordained:

- **Footer labels match the destination page titles exactly.** "Pricing & engagement" in the footer must not land on a page titled "How we charge". Every rename is a small betrayal, and small betrayals compound.
- **Local services get local answers.** A [restaurant](/work/wattle-and-daub-reservations) or [florist](/work/fern-and-forage-florist) footer leads with address, hours and phone — because for a local business, the footer *is* the wayfinding layer, and "how do I get there / are you open" is the implied question on every page. This isn't decoration; for hospitality it's the highest-converting content in the footer by a wide margin.

## Job two: reassurance at the exact moment of doubt

The bottom of a page is where evaluation happens. The reader has seen your pitch; now, thumb resting, they are deciding whether you are real. This is the footer's second job, and it's why three patterns earn their pixels:

**A physical address with a map link.** Not because anyone will visit — because a findable address is a proxy for accountability. Registered office, city, country. Fully remote businesses should name their registration anyway; a company with no place is a company that's one domain-renewal from vanishing, and buyers know the smell.

**Proof objects, sized honestly.** Memberships, certifications, security postures. One row, small, grey, unlinked-unless-verifiable. The failure mode is the badge farm: thirteen partner logos, half lapsed, performing legitimacy at people who were already convinced. If a badge wouldn't survive a prospect clicking it, remove it.

**Contact that a human answers.** "info@", a phone number, or a genuine response-time promise ("We reply within one business day" — and then, crucially, replying within one business day). Our [contact page](/contact) follows the same doctrine: the form is honest about what happens next, because a form that feels like a slot machine teaches people not to play.

Legal links — [privacy](/legal/privacy), [terms](/legal/terms) — live here too, and they belong in plain sight, low-key, styled like everything else. Companies that shrink legal links to 9px grey-on-grey are telling on themselves.

## Job three: the system layer

Under the human jobs sit the machine jobs, and the footer quietly carries them:

- **Crawl paths.** Search engines weight footer links as internal navigation; a well-structured footer is a sitemap.xml with manners. This is one reason intent-grouped columns pay twice — they're information architecture for readers *and* a clean crawl graph. (Our [websites practice](/services/websites) audits footer link equity during every migration; it's consistently the cheapest SEO win on the table.)
- **The newsletter ask, if and only if it can be justified.** A persistent footer signup works when the newsletter is genuinely good and the ask is one field. The instant it needs a dropdown ("Select your interests"), it's a form, and forms belong on pages with room to argue their case — see our piece on [forms people actually finish](/journal/web-design/forms-people-finish).
- **Preference survival.** Language, region, currency selectors persist naturally in a footer because the footer is the only surface that's always there. If your site has user preferences, this is their home.

## Job four: the colophon, or the signature on the joinery

The last job is optional and disproportionate: the colophon. A line or two saying how the thing was made, by whom, with what. Set in the type it praises. Small, quiet, honest.

Colophons do something no CTA can: they signal that the people who built this site *care about how sites are built*, at the moment the reader has just finished experiencing the evidence. On agency and studio sites, the colophon doubles as a credit roll — and crediting the makers is both decent and shrewd, because the person reading an agency's footer colophon is frequently the person about to shortlist agencies. Ours names the studio, the type, and the stack, and it costs nobody anything.

A colophon is also where odd, personality-bearing details can live without cluttering the pitch above: the year range rather than just the year, a one-line acknowledgement of country for Australian and New Zealand businesses, the domain's birthday. These details are footnote-sized, and footnotes are where trust accumulates.

## A short audit you can run today

Open your footer on your phone and answer honestly:

1. Can a lost first-time visitor reach pricing, contact and your best proof of work in one tap each?
2. Does every label match the page title it lands on?
3. If you're local: address, hours, phone — visible without scrolling the footer itself?
4. Is there one clear conversion element, or a damp patch of "learn more"?
5. Does anything in there exist for no reason you could defend in a meeting?

Question five is the one that changes footers. Junk drawers are not designed; they accumulate. Footers should be the opposite — the most deliberate rectangle on the page, because it's the only one that's everywhere.

## Key takeaways

- The footer answers an implied question: "the page didn't give me a next step." Design it for lost, high-intent readers.
- Cap links around 25, grouped by reader intent, with labels that match destination page titles exactly.
- Reassurance earns its space: a physical address, verifiable proof, honest contact expectations, visible-but-quiet legal links.
- The footer is infrastructure too: crawl paths, persistent preferences, and (only if your newsletter is genuinely good) a one-field signup.
- Add a colophon. Signing your work is a trust signal no badge can fake.
- Audit on a phone with five hard questions, especially "what couldn't I defend?"

## FAQ

**Mega-footers or minimal footers?**
Match the site. A documentation-heavy product can justify a rich footer sitemap; most marketing sites cannot. The test is whether each column serves a reader intent you'd recognise, or an internal team you'd rather not name.

**Should the footer be identical on every page?**
Mostly yes — consistency is the point of a wayfinding layer. One sanctioned exception: conversion flows (checkout, application forms) get a stripped "quiet footer" with legal, contact and nothing else, because wayfinding there means finding the exit.

**Where do social links go?**
In the footer, small, unobtrusive, and only for networks you actually maintain. A social icon whose profile last posted in 2022 is an anti-trust signal sitting in your reassurance zone.

**Is "back to top" worth it?**
On very long pages with no sticky nav, yes — styled as a real control, keyboard-reachable, and honouring `prefers-reduced-motion` by jumping rather than smooth-scrolling. Otherwise the scrollbar already has the job.
