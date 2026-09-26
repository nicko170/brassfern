---
title: "Summit & Still: booking UX for a yoga studio group with a calm nervous system"
description: "Five studios, one timetable, zero countdown timers. How we rebuilt Summit & Still's booking around teacher loyalty, ethical intro offers and retention emails with empathy."
slug: summit-and-still-yoga
cluster: work
tags:
  - Booking UX
  - Wellness
  - Lifecycle email
  - Design systems
date: 2025-11-20
author: Priya Nair
keywords:
  - fitness booking case study
  - yoga studio website
  - class booking ux
  - wellness design
  - retention email
readingTime: 8
client: Summit & Still
industry: Hospitality
services:
  - Websites
  - Product design & engineering
  - Growth
year: 2025
stack:
  - React
  - TypeScript
  - Node
  - Postgres
  - Sanity
  - Resend
heroImage: /images/work/summit-and-still-yoga.jpg
heroAlt: "A rolled linen yoga mat, a brass singing bowl and a folded cream timetable card on warm paper."
---

Summit & Still runs five yoga and movement studios across Melbourne's inner north — the kind of places with concrete floors, excellent playlists, and teachers with followings loyal enough to change studios over. They came to us with a booking experience that behaved like an airline's: timer counting down your held spot, intro offers engineered to convert deal-chasers, and a timetable page that took eleven seconds to answer the question "is there a yin class near me after six?"

The numbers were decent. The feeling was wrong. Co-founder and head teacher Dana Reyes put it precisely: "People arrive at the studio tense. Our website shouldn't be their first warm-up."

## The challenge

Booking flows in fitness are a solved problem if you accept the industry's defaults: urgency, scarcity theatre, and a funnel that treats a first-timer's nerves as leverage. Summit & Still explicitly didn't. That ruled out the easy playbooks and left the genuinely interesting work:

- **The timetable was a spreadsheet with anxiety.** Five studios × forty classes a week × four filters meant every visit started with a dexterity test. First-timers — the studio's most nervous users — faced the busiest screen.
- **Intro offers attracted churn, not members.** The "30 days for $49" deal filled classes with people structurally unable to become regulars, then trained existing members to wait for the next deal.
- **Teacher loyalty flowed to teachers, not the studio.** Regulars followed their teachers between studios manually — text messages, Instagram stories, word of mouth. The platform captured none of this genuine, valuable behaviour.
- **Retention emails were discount blasts.** Lapsed members got "WE MISS YOU — 20% OFF" — the one message guaranteed to make a person feel worse about the class they didn't attend.

## The approach

**A timetable that answers one question at a time.** The rebuilt timetable is a single calm week-view, filtered progressively: pick a studio and it stays picked, remembered between visits. First-timers get a distinct path — "first class?" opens a guided flow that asks about experience and injuries-in-hindsight (bad back, tight hips) and recommends three specific classes with the teacher's name and what to expect, rather than a level taxonomy nobody understands. Waitlists show honest positions ("you're 3rd — historically this clears 7 times in 10") instead of pressure.

**The intro offer, redesigned ethically.** We replaced "30 days for $49" with a three-class intro pass, valid for forty-five days, priced to be worth it without being a hostage situation. After class three, the flow asks one question — "how often, honestly?" — and recommends a membership tier matched to the answer, including the honest option: "casual ten-pack, no expiry pressure." Fewer intro passes sold; far more of them became members. It's the same funnel-metrics discipline we argue for in [measure the movement, not the moment](/journal/growth/funnel-metrics-that-matter): optimise for who stays, not who clicks.

**Teacher pages as first-class citizens.** Every teacher has a real page: their class style in their own words, upcoming classes across all five studios, and a one-tap "follow" that surfaces their sessions in your timetable. We expected teachers to love it. We didn't expect it to become the studios' retention engine — members with a followed teacher attend 2.1× as often as members without one. The interface finally matched how people actually choose classes.

**A design system with a resting heart rate.** The visual system is built for calm: warm neutrals, generous line-height, and motion governed by the [160ms rule](/journal/web-design/motion-that-earns-its-keep) — everything eases, nothing flashes, and there is not a countdown timer anywhere on the property. The booking confirmation animates once, gently, and gets out of the way. Accessibility carried real weight here: large touch targets for pre-class booking in a car park, a dyslexia-friendly reading option on class descriptions, and contrast that survives a sunlit phone screen.

**Retention emails with empathy as the strategy.** The lifecycle programme — built on the six-flow architecture from our [lifecycle email playbook](/journal/growth/lifecycle-email-architecture) — starts from a simple rule: the studio never pretends not to know what it knows. If you've missed three weeks, the email says so warmly and suggests the gentlest class on the timetable. If you've been attending twice a week, nobody offers you a discount you don't need. Discounts moved from "blast the lapse list" to a single, dignified win-back moment at twelve weeks quiet.

## The outcome

Relaunched in September 2025, illustrative results across the first two quarters:

- **Timetable task success:** median time from homepage to a booked class fell from 3 minutes 40 seconds to under a minute for returning members; the remembered-studio preference alone cut the path by two screens.
- **Intro pass → membership:** 22% → 39% within ninety days of the third class, with refund requests on intro passes falling to near zero — the pass is priced and described so nobody feels tricked.
- **Waitlist conversion:** up 58%, driven by honest positions; members told us they now *join* waitlists they used to dismiss as theatre.
- **The lapse email:** 31% of three-week-quiet members book within a week of the gentle nudge, versus 9% under the old discount blast — and unsubscribe rates on the lapse flow fell by two thirds.
- **"Do you have parking?" calls:** down by half, thanks to per-studio detail pages (parking, showers, what to bring) that front-desk staff now link in confirmation SMS.

"The old site assumed people needed to be pushed," Dana said. "The new one assumes they wanted to come and got lost. That turned out to be true of the whole business."

## What we'd tell other booking businesses

Your booking flow is your brand's handshake — if it plays urgency games, everything after it inherits the distrust. Price your intro offer to find future regulars rather than one-time thrill-seekers, and let your retention programme sound like a teacher who knows you, because it is one. More of this thinking lives in our write-up of [Wattle & Daub's reservation flow](/work/wattle-and-daub-reservations), our [websites practice](/services/websites), or [send us a brief](/contact).
