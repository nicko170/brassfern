---
title: "Marlowe Hotels: winning back the direct booking"
description: "A boutique coastal hotel group was paying OTAs a quiet tax on three-quarters of its bookings. We rebuilt the site and booking flow — and the share flipped."
slug: marlowe-hotels-direct-booking-relaunch
cluster: work
tags:
  - Hospitality
  - Booking flows
  - Performance
  - Editorial design
date: 2025-11-06
author: Mara Ellison
keywords:
  - hotel website case study
  - direct booking optimisation
  - hospitality web design
  - booking flow ux
  - hotel conversion rate
readingTime: 10
heroImage: /images/work/marlowe-hotels-direct-booking-relaunch.jpg
heroAlt: "A sunlit boutique hotel room overlooking the Australian coast — linen, timber joinery and a fern on the windowsill in late-afternoon light"
client: Marlowe Hotels
industry: Hospitality
services:
  - Websites
  - Growth
  - Brand & identity
year: 2025
stack:
  - React
  - TypeScript
  - Node
  - Postgres
  - Sanity
---

Marlowe Hotels runs four small properties along the New South Wales coast and one in the Blue Mountains — the kind of places with thirty rooms, a wood fireplace, and a staff who learn your name by the second morning. In 2024 they asked us to look at a number that embarrassed them: 76% of room-night revenue was arriving through online travel agencies, with commission taking a slice they described as "a fifth hotel we furnish but never own."

The dependency had crept up over a decade. The OTA listing photos were gorgeous; Marlowe's own site was a 2017 theme with a booking widget bolted on like an afterthought. Guests who found Marlowe on an OTA stayed on the OTA, and every returning guest — Marlowe's repeat rate was genuinely good — paid the commission again.

The brief from their GM, Ines Marlowe, was one line: *"Make our website a better salesperson than Booking.com, without making it feel like a salesperson."*

## The challenge

We spent the discovery sprint sitting in lobbies, watching phones. The pattern was unmistakable and consistent with industry surveys on hotel booking behaviour:

- **62% of sessions were mobile**, mostly on hotel Wi-Fi or regional 4G. The old site's booking widget took 9.4 seconds to become interactive on a mid-range Android. People quite reasonably left.
- **The rate story was muddled.** Marlowe's best price was on their own site, but the site never said so. Guests assumed parity, so the OTA's convenience habit won by default.
- **Offers were seasonal guesswork.** Packages ("winter whale weekend", "harvest-table long lunch") lived as PDFs and Instagram posts, disconnected from bookable inventory. Beautiful marketing, unbookable.
- **The CMS fought the team.** Updating a room description required a freelancer. Editorial content — the journals, the area guides, the stuff that ranks and persuades — had quietly died in place.

Underneath it all sat the strategic risk: a hotel brand whose customer relationship was owned by intermediaries. OTAs don't share guest email addresses. Marlowe was running a hospitality business with no mailing list worth the name.

## Approach

**A photography-led site that behaves like the property.** The design direction we landed on — internally "Coastline" — treats each property as an editorial spread: full-bleed seasonal photography, Fraunces-scale display type, and copy written like a note from the person who runs the place. No star ratings, no urgency ribbons, no "only 2 rooms left!" theatre. The persuasion is honesty stacked well: real room dimensions, the actual walk to the beach in minutes, and a rate-price promise stated plainly on every rate card: *book direct and this is the best price anywhere, plus a drink on arrival.* Rate transparency is the single most underused conversion lever in independent hospitality; we put it in the design system as a component, not an afterthought.

**A booking flow with three steps and zero surprises.** We built the booking island as a client-side React application over Marlowe's channel-manager API: dates, rooms, rates. That's the whole flow. Availability responses are cached at the edge with a thirty-second staleness window — inventory doesn't move faster than that, and guests shouldn't wait as if it does. Every state communicates: sold-out rooms show *when they're next available*, not a dead end. Returning guests get a prefilled flow from a magic-link email — no accounts, no passwords, nothing to remember. Interaction-to-confirmation on mobile dropped from a painful multi-widget ordeal to under ninety seconds in moderated testing.

**A performance budget treated as a brand value.** A coastal hotel's website loads on a ferry, on a headland, on one bar of reception. We set a budget of 1.5s LCP on throttled 4G and defended it like scope: static-rendered marketing pages, images as responsive AVIF with art-directed crops, the booking island lazy-hydrated only when tapped. The final build lands at 1.2s LCP in field data. We've written before that [site speed is a merchandising decision](/journal/ecommerce/site-speed-revenue-link); in hospitality it's closer to a front-desk decision — the site *is* the first member of staff a guest meets.

**A package engine the team actually drives.** Packages became structured content in Sanity — dates, inclusions, inventory hooks — so "winter whale weekend" is a bookable product with its own landing page the moment marketing dreams it up, not a PDF and a prayer. Each offer page follows the same editorial grammar as the property pages, so promotion never breaks the spell of the brand. The local area guides we rebuilt alongside them feed the whole thing: the guides rank for "weekend away from Sydney" queries, the packages catch the intent — the same flywheel we've covered in our notes on [local SEO for venues](/journal/growth/local-seo-hospitality).

**Migration without a traffic dip.** A decade of OTA-adjacent SEO equity had to survive the rebuild. We mapped every legacy URL, preserved the guide content that was quietly earning links, and staged the cutover behind a rollback plan. Our [website practice](/services/websites) treats migration as a launch-critical workstream, not a deploy-day detail; this one shipped with zero lost rankings on tracked terms. The broader *how we work* story is on our [approach page](/approach).

## The outcome

The relaunch went live in March 2025, timed to land before winter season. Illustrative outcomes across the first two full quarters, measured against the same period the prior year:

- **Direct booking share:** from 24% to 38% of room-night revenue. Commission saved in those two quarters alone covered the engagement's cost — the awkward ROI conversation we like having early.
- **Offer-page bounce rate:** down 41%, with packages now generating 22% of direct revenue. The whale weekend sold out in eleven days, entirely through the site and the email list it built.
- **Mobile booking completion:** up 58%. The three-step flow in field data behaves almost exactly as it did in testing, which never stops being gratifying.
- **Owned audience:** the guest email list grew from 4,100 to 11,800 addresses via pre-arrival and preference capture. Every OTA guest now arrives to find a reason — the direct-rate promise — to book direct next time.
- **Performance in the wild:** 1.2s p75 LCP on mobile, holding through the winter traffic spike.

We're careful with a stat like the 38% share. Some of it is macro: OTA commission fatigue is real and Marlowe's brand was always strong enough to carry direct demand. But when we interviewed returning guests, a phrase kept surfacing that we'll happily take credit for: *"the website felt like the hotel."* That's the actual job.

"We spent years furnishing a fifth hotel we didn't own," Ines told us at the season review. "The site earns its room now. The OTAs are a channel again, not the landlord."

## What we'd tell other hoteliers

Three things, quickly. First, state your rate promise on every rate card — the assumption of parity is the OTA's best friend and it costs you nothing to correct. Second, make your packages real products, not campaigns; the studio behind [Wattle & Daub's reservation flow](/work/wattle-and-daub-reservations) learned the same lesson in restaurants: the bookable thing and the beautiful thing must be the same thing. Third, treat performance as hospitality. A slow site is a locked front door with a sign that says "back in nine seconds."

If you run rooms and recognise any of this, the shape of the engagement is on our [pricing page](/pricing), and we're at hello@brassfern.studio via the [contact form](/contact).
