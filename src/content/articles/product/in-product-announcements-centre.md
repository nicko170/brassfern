---
title: "Announcements inside the product, minus the noise"
description: "In-product announcements without banner blindness: an announcements centre, targeting by behaviour instead of blast radius, and expiry rules that stay honest."
slug: in-product-announcements-centre
cluster: product
tags: [in-product messaging, announcements, changelog, feature discovery, product design]
date: 2026-07-15
author: Leonie Marsh
keywords: [in-app announcements, product changelog UX, feature announcements, banner blindness, release notes UX]
readingTime: 8
---

Every product team has lived the same Tuesday. Something ships — a real improvement, weeks of work — and the release plan is a modal. Full-screen, unavoidable, one dismiss button. The announcement is shown to everyone, including people who logged in mid-task with thirty seconds to spare, including customers on flight wifi, including the admin who will never touch the feature because it isn't in her permissions.

Dismissal rates land around 90%. Within a month, support tickets ask about the feature the modal announced. Within two months, someone proposes *another modal* to fix it.

Interruptive announcements are the cheapest kind of communication and they cost the most: not in the dismiss click, but in the trained reflex they build. Users who learn that your product interrupts them with marketing develop the fastest dismiss-finger in software. Banner blindness isn't a failure of attention. It's a rational adaptation, and we taught it to them.

Here's the system we ship instead: an announcements centre, behaviour-based targeting, and expiry rules enforced by someone with the authority to delete.

## The core mistake: announcements are written for the sender

Read almost any in-product announcement and you can smell the org chart behind it. "We're excited to announce the launch of our new advanced reporting suite!" Nobody outside that launch meeting is excited. The user has a question the announcement doesn't answer: *what changes for me, right now, in this screen?*

Rewrite rule one: the announcement headlines the user's verb, not the team's feature name. Not "Introducing Workflow Automations" but "Stop re-sending the same chase email." Rule two: every announcement names its audience in the first sentence — "if you invoice clients monthly" — so the wrong audience can self-eject in two seconds and feel respected instead of spammed. Rule three: one action, named concretely. "Try it on your next report" beats "Learn more", because "learn more" is a commitment to read documentation and everyone knows it.

This is the same discipline as good [empty-state copy](/journal/product/empty-states-design): the words exist to shorten the distance to the user's next useful action, not to mark the team's territory.

## The announcements centre: a home, not an interruption

The pattern that fixes the channel economics is boring on purpose: a persistent, quiet inbox inside the product. Usually a bell icon with a badge, opening a chronological feed of announcements — each one dismissible, each one retrievable. "Retrievable" is the whole point. The person who dismissed Friday's modal mid-task can find the feature Sunday night when they actually have a minute. Announcements stop being a single interception attempt and become correspondence the user can open when ready.

The centre earns trust through a few rules:

- **The badge counts unread, and unread means unread.** No badge inflation for marketing campaigns, no re-badging because the first visit didn't convert. A badge that cries wolf becomes wallpaper within a quarter.
- **Announcements persist.** Nothing in the centre expires out from under the user. Expiry applies to *interruptions*, not the archive — the archive is where honesty lives.
- **Each item carries its context.** Audience tag ("for admins"), date, and a deep link that lands *in the feature*, not on a marketing page. An announcement whose link goes to a blog post has left the product to do its marketing elsewhere, which is backwards.
- **Disruption requires seniority.** We give teams a written tier list, and breaking upward through it requires sign-off. In practice: tier one is the centre only; tier two is a subtle in-context hint exactly where the feature lives; tier three is a dismissible banner; tier four — the interruptive modal — is reserved for things that will cost users money or data if missed. Security changes and pricing changes. Almost nothing else qualifies, and that's the point. When [interruption is rare, it works](/journal/product/notification-design-respect); we make the same scarcity argument about notifications.

## Targeting by behaviour, not blast radius

The strongest word in announcement tooling is "who". Blast-radius sending — everyone, now — is what teams do when the announcement system can't segment, and it's the single biggest driver of the dismiss reflex. Behavioural targeting fixes it, and the rules read like common sense once written down:

1. **Relevance by usage.** Announce the bulk-edit feature to people who performed the single-edit action three or more times last month. They feel seen rather than surveilled, because the trigger is their own workflow, not their demographic profile.
2. **Suppression by irrelevance.** Never announce a feature to accounts that can't access it. Announcing an enterprise-tier capability to free users isn't an announcement; it's a paywall wearing a party hat, and it converts worse than silence while costing goodwill.
3. **Timing by task state.** Never interrupt a half-finished flow. The announcement can wait for the next session start, and session starts are the natural reading moment — the user arrived with intent but hasn't committed to a thread yet.
4. **Frequency caps per user.** One interruptive-format message per user per week, maximum, across *all* teams. This requires announcements to share a ledger, which requires the org to admit that product, marketing and lifecycle emails are the same channel seen by the same human. That admission is worth the meeting.

The [Larklight marketing site](/work/larklight-saas-marketing-site) project taught the same lesson from the web side — clarity about audience doubled demo bookings — and it doubles again inside the product, where you have behavioural truth instead of inferred intent.

## Changelog vs announcement: draw the boundary in ink

Teams blur these because both are "stuff we shipped", and the blur kills both. The distinction we enforce:

- **Announcements** are for changes that alter what a user *can do* or *should do*. New capabilities, changed defaults, deprecations, pricing. Audience: the people affected. Tone: imperative and concrete. Written for the person mid-workflow.
- **Changelog** is the running ledger of everything: fixes, improvements, removals. Audience: power users, admins, integrators, and support staff answering "did something change last Thursday?" Tone: factual, timestamped, searchable. Written for the person investigating.

The changelog is prose for the meanwhile; the announcement is choreography for a moment. Merging them produces a feed where "fixed a rounding error in CSV export" sits beside "your pricing changes in 30 days", trains everyone that most items are irrelevant, and guarantees the pricing notice gets skimmed past. Volume is the enemy. A changelog can be high-volume because it's opt-in reading; an announcement feed must stay low-volume or it forfeits the click.

## Expiry rules, or why release notes rot

Every announcement needs a death date at birth, decided by one person with authority — at Brassfern engagements that's usually the producer, and in-house it should be whoever owns the [feature-discovery calendar](/journal/product/feature-discovery-after-launch). The rules that have survived contact with real teams:

- **Interruptive formats expire in 14 days.** If a user hasn't seen the modal after two weeks, the moment has passed — they were busy, they'll find it in the centre. A 45-day-old modal greeting a returning user announces that nobody is minding the shop.
- **Banners expire at 30 days, in-context hints at 90.** Hints may live longer because they only appear to people standing in the relevant place; relevance expires slower than novelty.
- **Deprecations are the exception.** Those run to the deprecation date and escalate through the tier list as the date approaches — centre, banner, modal — which is the correct use of escalation: rising urgency matched to rising stakes, initiated by the calendar rather than someone's anxiety.
- **Measure, then delete the losers.** If an announcement's click-through is under 2% after a week, the problem is the announcement or its targeting — never the users. Pull it, rewrite the verb, and re-target. Announcements are copy, and copy gets edited. The [growth team's experiment discipline](/journal/growth/cro-experiment-design) — pre-registered kill criteria, no zombie campaigns — applies verbatim.

## Implementation notes, briefly

One announcements registry: id, audience predicates, tier, copy, expiry, and impression/dismissal/click events, all in one data structure consumed by whichever surface renders it. Client-side, the registry is static-ish and cached; eligibility is evaluated locally so targeting never adds latency to session start. And log *who dismissed what* — dismissals are the cheapest user research you'll ever collect, and a feature nobody wants to hear about from you is a feature worth watching.

None of this is glamorous. It's plumbing for politeness. But the compound effect is large: a product whose announcements are rare, relevant and recoverable is a product whose messages get read, and being read is the entire ballgame.

## Key takeaways

- Banner blindness is a rational adaptation to interruption. You trained it, and only scarcity untrains it.
- Write announcements for the receiver: user's verb in the headline, audience named in the first line, one concrete action.
- Build an announcements centre so nothing is single-attempt; the badge counts honesty, the archive never deletes.
- Target by behaviour and permission, suppress the irrelevant, cap interruption frequency across all teams at once.
- Changelog is the ledger, announcements are the moments. Blurring them buries the important under the routine.
- Every interruptive format gets an expiry date and an owner with delete authority. Deprecations escalate on purpose.

## FAQ

**We don't have engineering bandwidth for a centre. What's the smallest honest version?**
A single dismissible banner shown at session start, behaviourally targeted, capped at one per week, expiring in 30 days, plus a public changelog page linked from settings. That covers 80% of the value — the targeting and the caps matter more than the UI.

**Should the centre also hold marketing content — webinars, case studies, offers?**
No. The moment the bell mixes "you can now do this" with "come watch us talk", users reclassify it as marketing and stop opening it. If marketing wants in-product reach, the honest route is lifecycle email directed at people who opted in — the boundary we argue for on the [growth side](/services/growth) is the same boundary here.

**How do we announce things to users who log in twice a year?**
You mostly don't, and accepting that is healthy. Rare users get a "what's changed" digest panel on their next login — drawn from the centre, filtered to their permissions since their last visit — instead of an archaeological layer of expired modals. If a change affects them critically (billing, security), that's what email is for.

**What's a healthy click-through for in-product announcements?**
Context-dependent, but the pattern matters more than the number: well-targeted, verb-first announcements to behaviour-matched audiences routinely see 15–35%; blast modals to everyone see 2–4% with 90% dismissal in under a second. If you're in the second bucket, the fix is upstream of the copy.
