---
title: "Empty, loading, error: the states that carry your trust"
description: "A field guide to the 20% of screens that carry 80% of trust: zero-data dashboards, skeletons vs spinners, and error copy that admits fault without over-apologising."
slug: empty-loading-error-states
cluster: web-design
tags:
  - UI design
  - UX writing
  - Web states
  - Design systems
date: 2025-01-21
author: Aiko Tanaka
keywords:
  - empty states ux
  - loading state design
  - error state design
  - ui microcopy
readingTime: 8
heroImage: /images/articles/web-design/empty-loading-error-states.jpg
heroAlt: "Three small paper-craft vignettes on warm cream paper: an open empty sage-green drawer with a tiny brass key, a fern-green paper hourglass mid-turn, and a tilted terracotta flag leaning on a brass ramp"
---

Here's an uncomfortable way to audit a product: screenshot only the screens with no data, the screens mid-fetch, and the screens where something broke. Line them up. That's the product your users actually trust or abandon — because the happy path was designed once by a team, while the unhappy path gets *discovered*, alone, at midnight, by a person deciding whether this software deserves their money.

We estimate the stateful margins — empty, loading, error — are under 20% of screens and carry the large majority of trust decisions. The empty state decides whether a trial converts. The loading state decides whether the app feels fast or broken. The error state decides whether a mistake costs a user or costs you a subscriber. This is the field guide we hand every designer joining a [product engagement](/services/product).

## Empty states: the first five minutes

There are four distinct empty states, and designing one generic "No data yet 📦" for all of them is the canonical mistake.

**First-run empty.** The user just arrived and has nothing. This is a sales and teaching surface: what will this screen look like once it's working, and what's the one action that gets them there? Show a preview of what good looks like — a ghosted example row, a thumbnail of a filled dashboard — and give exactly one call to action. Not three. The [Brightmarsh onboarding work](/work/brightmarsh-onboarding) replaced a three-choice empty dashboard ("import data, invite team, explore demo") with one action and a live sample; activation jumped, because three doors ask a question and one door answers it. We wrote the longer version of this argument in [Empty states are product marketing](/journal/product/empty-states-design).

**Cleared empty.** The user had data and removed it all — inbox zero, trash emptied, filters cleared. This state is a *reward*, not a prompt. "All caught up" with calm visual weight, not an upsell. Treating achievement as a vacancy re-teaches users that the app only ever wants more.

**Filtered empty.** The user searched or filtered to zero results. This is the highest-frustration empty state because the user believes the data exists. Show the active filters as removable chips, offer the one-click clear, and when you can, show nearby matches ("no results for *merino scarf*, 12 results for *scarf*"). Never show a bare "no results" with the filters hidden three clicks away.

**Permission empty.** The user lacks access to what would be here. Say so plainly — "Your plan doesn't include audit logs" with an upgrade path, or "Ask an admin for access" — because a permission wall disguised as an empty state reads as a bug and generates support tickets. The politics of that surface are covered in [Permission UX](/journal/product/permission-ux-design).

## Loading states: skeletons, spinners, and the optimism ladder

The hierarchy we design to, from most trustworthy to least:

**Optimistic UI** — the action completes instantly in the interface and reconciles with the server behind the scenes. Correct for low-risk, high-frequency actions: liking, reordering a list, checking a box. The failure mode needs designing too: a quiet undo or reversion, never a toast screaming about a sync error for an action the user barely remembers taking.

**Skeleton screens** — the layout arrives immediately, rendered as pulse-animated placeholder blocks, and data fills it. Correct whenever the destination layout is knowable: feeds, dashboards, tables. Skeletons outperform spinners on perceived speed in every study that measures it, for a simple reason: they answer "what am I waiting for?" and "where will it be?". Design them from the real layout's geometry — a skeleton that doesn't match the content's shape causes a layout jump that undoes its own benefit, and trashes your CLS budget to boot (see [Core Web Vitals in the field](/journal/engineering/core-web-vitals-field-guide)).

**Progressive disclosure of parts** — render what you have, spin only what you don't. The header and navigation are not loading; the chart is. Per-region loading keeps the app legible mid-fetch and signals that the system is working, not hung.

**The spinner** — correct only for short, total waits: an auth check, a payment confirmation, a submission under roughly 2–4 seconds. Beyond that, a spinner is a design failure being rotated. Long waits get honest copy ("Matching you with available clinicians… usually takes about 20 seconds") or a stepwise status; a ten-second bare spinner gets a tab closure.

One rule that outranks all of them: **never clear content the user already has to show a loading state for the next thing**. A list refreshing in place keeps its rows; only a desperate app blanks the world while it thinks.

## Error states: admit fault, offer a hand, don't grovel

Error design is a voice problem wrapped around a cause problem. The anatomy:

**Say what happened, in the user's terms.** "Payment failed" beats "422 Unprocessable Entity". If we don't know what happened, say that honestly and say what we do know ("Your changes are saved; the confirmation email didn't send").

**Assign fault accurately — usually to us.** Users forgive "We couldn't reach your bank" and remember "Invalid card" when the card was valid. The default grammatical subject is *we*, not *you*. The exception: when the user genuinely can fix it, make the instruction the star — "That postcode doesn't match the address. Check the first line." The full rhetoric of this is in [Error messages that de-escalate](/journal/product/error-messages-that-help).

**Always give the next action.** Every error state needs a door: retry (with the form preserved — data loss on error is the single most trust-destroying behaviour in software), go back, contact support, or try a different route. An error with no action is a dead end, and dead ends get screenshots posted to social media.

**Calibrate the apology.** Over-apologising ("We're SO sorry! Something went terribly wrong!") makes small problems feel big and reads as self-absorption. One acknowledgement, then help. Save visible distress for genuinely destructive events — and if a payment double-charged, that error state isn't copy, it's an incident response.

**Log before you display.** If an error is worth showing a user, it's worth capturing with context. The worst error state is the one your team hears about first from a support ticket.

## The spec format that makes states survive

States rot because they live in stray Figma frames nobody implements. Our rule: **every component in the design system carries its states as named variants** — `default / loading / empty / error / offline` — and a component isn't "done" in review until all five exist. Copy for every state is written by a writer in the same file, never improvised by an engineer at 6pm. And we test with the throttles on: every sprint review includes one pass on a 3G throttle with the API occasionally broken on purpose. States that only exist in a design file are marketing.

## Key takeaways

- Empty states come in four species — first-run, cleared, filtered, permission — each with a different job: teach, reward, recover, explain. One generic empty state fails all four.
- Design loading on a ladder: optimistic UI for safe frequent actions, skeletons for knowable layouts, per-region loading for partial data, spinners for short total waits only. Never blank existing content to load new.
- Error copy: user's terms, *we* as the subject when it's our fault, always a next action, never preserved data lost, apology calibrated to the blast radius.
- States survive when they're named variants in the design system with writer-authored copy, and when sprint reviews run throttled with a deliberately broken API.

## FAQ

**How do we prioritise which states to design first?** By trust density: the empty state on the first screen after signup, the loading state of the core action, and the error state of anything involving money. Those three carry more subscription decisions than any hero section.

**Are skeleton screens ever wrong?** When the layout isn't knowable (a radically variable response) or the wait is under ~300ms, where a skeleton flashes as noise. In fast cases we delay the skeleton's appearance briefly so quick loads show nothing at all.

**What about offline states?** A fifth state, and the most neglected. Read-only access to cached content with an honest banner ("You're offline — showing last synced data") converts an outage from a wall into a window. Design it whenever the user might plausibly be underground, airborne or rural: which is to say, always.

**Should error states be playful, like a witty 404?** Severity-calibrated. A playful [404](/journal/web-design/designing-404-pages) is fine because the stakes are a mistyped URL. A witty payment failure is a small cruelty. Humour scales down as money and data loss scale up.

**Who writes state copy — designers or writers?** A writer, against the named variant, in the design file. Engineers should never be the first human to compose the sentence a frightened user reads. If your team has no writer, make it one person's stated job; "whoever was in the file" produces "Oops! Something went wrong," which is where trust goes to die.
