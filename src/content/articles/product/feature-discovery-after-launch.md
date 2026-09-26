---
title: "Feature discovery: design for the day after launch"
description: "Shipping a feature is half the job. Announcement surfaces that respect focus, contextual education, suppression discipline, targeting and how to measure discovery lift."
slug: feature-discovery-after-launch
cluster: product
tags: [feature discovery, announcements, onboarding, changelogs, product design]
date: 2026-06-10
author: June Okafor
keywords: [feature discovery ux, product announcements design, in product education, what's new modal]
readingTime: 8
---

There's a shape every feature launch draws on the adoption chart: a spike for the launch cohort who saw the announcement, then a cliff, then a flat line well below what the feature deserves. Everyone who arrived after the launch never finds out the feature exists. The industry calls this a discovery problem and answers it with a louder modal. The modal gets dismissed in 400ms — we've watched the session recordings; users have developed a reflexive close-before-read that would impress a gazelle — and the flat line stays flat.

Discovery isn't a launch artifact. It's a permanent system with surfaces, targeting, suppression and measurement, and it has to serve two audiences with opposite needs: the already-here, who must not be nagged, and the not-yet-here, for whom every feature is brand new forever. Design for the day after launch, and the launch takes care of itself.

## The announcement surface ladder

Announcement surfaces sit on a ladder of interruption, and the craft is using the lowest rung that can carry the load:

1. **Ambient signals** — a dot on a nav item, a "New" badge, a changed empty state. Zero interruption, zero focus theft. The workhorse tier: always-on, always honest, never penalised because there's nothing to dismiss. This is the only tier that should be *loud* in the sense of numerous; its per-instance cost to attention is near zero.
2. **Contextual reveals** — the tooltip that appears when the user enters the relevant area, the coachmark anchored to the new control, the inline hint in the flow the feature affects. Interrupts the flow it improves, at the moment it improves it. The highest-converting tier in every instrumented product we've touched — often 5–10× the activation of a modal for the same feature.
3. **Digest surfaces** — the what's-new panel, the changelog page, the release-notes email. One accumulated place, user-initiated or minimally assertive (a tray with a count, not a cover). Trustworthy because it doesn't steal: users open it *because* it has always respected them.
4. **Modal takeovers** — reserved, by treaty, for changes the user cannot safely continue without: pricing model shifts, breaking workflow changes, security decisions. The moment a modal announces "we've updated our dashboards!", the tier is spent, and the next genuinely unmissable change pays for it.

The ladder's law: each tier's effectiveness is collectively owned by every feature team. One team's modal habit deflates the currency for everyone. Which is why discovery needs an owner and a budget, like performance does — our [bundle-budget discipline](/journal/engineering/bundle-budget-discipline) is the same governance shape, pointed at announcements instead of kilobytes.

## Contextual education beats the tour

The product tour — seven modal steps across the whole UI, shown at first login, before the user has a single reason to care — is dead and should stay dead. Its completion rates are in the single digits and its information retention is worse; users are learning where the *Skip* button lives.

What works is education at the **teachable moment**, and teachable moments are mostly predictable:

- **Empty moments** — an empty dashboard is the perfect surface for "this is where X will live; here's the 20-second version". We make the same argument for [empty states as product marketing](/journal/product/empty-states-design); a new feature's empty state is the cheapest discovery surface you'll ever build.
- **Adjacent-intent moments** — the user about to export a CSV for the third time this week gets the saved-reports hint; the person manually reconciling line items learns about auto-match. Detect the *behaviour the feature replaces* and teach from there. This is discovery via empathy, and it converts because the value proposition is the user's own just-wasted time.
- **Error and friction moments** — handled gently. "You can't do that" should sometimes be "you can't do that yet — this newer way is faster."

The discipline underneath: every contextual hint is anchored to a behaviour trigger, not a timer or a pageview. If you can't name the behaviour that reveals the need, you don't have a teachable moment — you have an ad.

## Suppression is respect

The whole system stands on suppression discipline, because attention debt compounds. The rules we write into every discovery spec:

- **Dismissal is a decision, remember it.** Dismissed means dismissed — not "remind me every Thursday". A user who closed the tooltip twice has voted; a third showing converts curiosity into loathing.
- **Snooze means rest, not repeat.** Snoozed surfaces return after a meaningful interval (weeks, not days) with the option to make the dismissal permanent.
- **Global frequency caps.** One product-wide assertive surface (tier 2+) per user per session, full stop; ambient tier unlimited. Without the global cap, feature teams don't compete — they pile.
- **Completion terminates everything.** The user who adopted the feature should never see its tutorial again. Instrument adoption signals first, then wire suppression to them — otherwise you're marketing to your own customers inside the product they pay for.
- **Declined-per-feature memory persists across devices and sessions.** Dismissal state belongs in the user profile, not localStorage: nothing says "we don't know you" like re-teaching a dismissed feature on a new laptop.

Teams worry suppression will kill discovery numbers. The opposite is measured: users learn the product's surfaces are *safe*, so they stop reflex-dismissing, and the surfaces that do appear get read. Respect is the growth hack.

## Targeting: right feature, right user

The second-biggest waste after modal abuse is broadcasting admin features to members and beginner features to experts. Every announcement ships with an eligibility contract: which roles, which plan, which behavioural segment, which maturity stage. The new bulk-import tool goes to users who import; the new dashboard layout goes to accounts old enough to have habits; the enterprise SSO setting goes to the three people with the keys.

Maturity-based targeting deserves special attention because it solves the not-yet-here audience. New signups shouldn't see the last eighteen months of what's-new noise — they need the *core loop* first, then advanced features staged to their growing competence. Define adoption stages (we usually use four: setup, first value, habit, mastery) and gate each feature's education to the stage where it's relevant. The new user sees a biweekly drip of well-timed depth; the product grows with them. Our [onboarding patterns](/journal/product/onboarding-patterns-activation) notes call this "the syllabus", and discovery is where the syllabus continues past week one.

## Measuring discovery (it is measurable)

Discovery teams fly blind more often than any other function, which is strange because the instrumentation is cheap. The four numbers:

- **Surface engagement** — impressions, dismissals, snoozes, click-throughs per surface. Track *dismissal velocity*: sub-second closes mean reflex, not evaluation, and your surface is spent.
- **Feature adoption curves** — weekly active users of the feature as a fraction of the eligible segment. The shape matters more than the level: a healthy discovery system shows a curve that climbs *after* launch week, powered by ambient and contextual tiers.
- **Discovery-source attribution** — first-touch surface per adopting user. This is how you find out the changelog page quietly out-activates the modal four to one, and move budget accordingly.
- **Guardrails** — support tickets referencing confusion, rage-dismiss rates, session abandonment on surfaces. Discovery that lifts adoption while tripling dismiss-rage is borrowing from retention.

None of this needs exotic tooling; it needs the events to exist before launch, which is a sentence we also end every [analytics-governance](/journal/growth/analytics-governance) conversation with.

## The changelog is the durable record

Announcement surfaces expire by design; the changelog is forever. It's the one discovery artifact compounding quietly in the background — the page power users bookmark, support links to, and prospects read to gauge whether your product has a pulse. Treat it with editorial care: dated, written in user-outcome language, scoped per change, and honest about fixes. We wrote the marketing case for it in [your changelog is a marketing channel](/journal/growth/changelog-as-marketing); the product case is simpler — a discovery system without a durable record has no memory, and users can't self-serve.

Feature discovery done properly converts launch energy into a standing capability: surfaces that teach on the user's schedule, suppression that keeps the surfaces safe, targeting that respects context, and measurement that keeps everyone honest. The feature launch stops being a spike followed by a cliff and becomes a slope that keeps climbing. That's the difference between shipping features and shipping capability.

## Key takeaways

- Discovery is a permanent system serving two audiences — the already-here and the not-yet-here — not a launch artifact.
- Use the lowest rung of the announcement ladder that can carry the load; modals are treaty-reserved for unmissable changes.
- Teach at teachable moments: empty states, adjacent-intent behaviours, friction points. Behaviour triggers, never timers.
- Suppression is the growth lever: remembered dismissal, real snooze, global frequency caps of one assertive surface per session, adoption-terminated education.
- Target by role, segment and maturity stage; stage features to a syllabus so new users grow into depth instead of drowning in old news.
- Measure surface engagement, post-launch adoption curves, discovery-source attribution and guardrail metrics — with events in place before launch.

## FAQ

**We have fifteen features a quarter — doesn't this system collapse under volume?**
The opposite: volume is what the ladder and the caps are *for*. Most of the fifteen should be ambient-and-changelog only; maybe three deserve contextual hints; one a year deserves a modal. The system is what stops the loudest team from turning your product into Times Square.

**Should discovery surfaces live in the design system?**
Yes — beacon, badge, coachmark, hint, tray and modal as governed components with suppression logic built in, so feature teams configure surfaces instead of inventing popovers. This is the same argument as putting focus management inside components: capability is policy.

**What about announcements outside the product — email, social?**
Email works as a digest lane (tier 3) for changes worth a mailbox; single-feature launch emails mostly train users to ignore your newsletter. Save outside-product announcements for changes that alter price, workflow or security — the same treaty as modals.

**How long should a "New" badge live?**
Two to four weeks for the existing cohort, then retire it for them — but it should persist for each *new* user from their own signup date until they've encountered it. Badge state is per-user-relative, not calendar-absolute, and "New" that lives nine months teaches everyone that your labels lie.
