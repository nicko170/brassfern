---
title: "Upgrade prompts that don't feel like ransom notes"
description: "In-product upsell timing and tone: moments of demonstrated value, honest limit nudges, the dismissed-state contract, and measurement that doesn't lie to you."
slug: upgrade-prompts-timing
cluster: product
tags: [upsell, pricing, PLG, growth UX, product-led growth]
date: 2026-01-15
author: Leonie Marsh
keywords: [upsell UX, upgrade prompt design, PLG prompts, paywall timing, in-product upgrade messaging]
readingTime: 9
---

There is a special genre of product moment: you're mid-flow, slightly proud of what you're making, and a modal drops over your work like a pelmet: **"You've discovered a Premium feature!"** You have discovered nothing. You clicked an export button. The product has interrupted your sentence to ask for money, and the relationship — which ten seconds ago felt collaborative — now feels transactional in the way that makes people open a spreadsheet of alternatives that evening.

Upgrade prompts are where product-led growth meets human dignity, and most implementations optimise the former by spending the latter. The conversion numbers look fine for a quarter. Then support sentiment turns, word of mouth sours, and the growth team can't find the leak because the corrosion doesn't show up in the prompt's own dashboard. This is how we design upsells that convert *because* they're respectful, not despite it.

## Timing is the whole profession

The difference between an offer and an interruption is a single variable: **has the user just experienced the value the upgrade amplifies?** We sort prompt moments into two bands and are ruthless about which band a prompt belongs to.

**Moments of demonstrated value.** The user has just done the thing that paid features make better: exported their first report (paid plan = scheduled exports), invited their fourth teammate (paid plan = roles), hit a natural plateau of the free tier while staring at proof it worked. A prompt here is *service* — it narrates a path from "this was useful" to "imagine this monthly, automatically." Conversion in these moments is routinely several multiples of interruption-moment conversion, and — the part dashboards underweight — the complaint rate is near zero. The user feels *seen*, not mined.

**Moments of interruption.** Mid-task modals, prompts on login, banners injected between a user and their deadline. Every one of these buys a click with trust, at an exchange rate you will not see until renewal conversations. The rule we give squads: an interruption prompt must clear an extraordinarily high bar (a genuine account risk, a hard limit reached) or it doesn't ship. "But engagement was up" is not a defence; engagement with a closed modal is not a victory.

A useful test, stolen from editorial: read the prompt copy aloud in the narrator voice of the user's day. "You just exported your first report — nice. Premium schedules it weekly." Sounds like a colleague. "Unlock PRO export superpowers!!" Sounds like a ransom note. Ship the colleague.

## Limits: the nudge ladder, with honest numbers

Usage limits are the most common upgrade trigger and the most commonly botched. The crimes are predictability (the user learns of the limit *at* the limit), vagueness ("you're approaching your limit" — approaching by how much?), and theatre ("only 3 left!" when the real cap is soft and everyone in procurement knows it).

The ladder that works, with illustrative-but-realistic pacing:

1. **60% — ambient.** The limit appears as a quiet meter in the place the resource lives. Not red, not a banner: furniture. Users self-regulate when they can see the tank.
2. **80% — informative.** A one-line notice tied to the consuming action, with the number: "This project uses 4 of your 5 free seats." One line, dismissable, remembered.
3. **95% — actionable.** Now the prompt carries its payload: the number, the date the pool refreshes if it does, what upgrading buys, and — critically — *what happens at 100%*. "At the limit, existing work stays safe; you won't be able to add more seats until next cycle or upgrade." Fear of the unspecified cliff is what makes limits feel like extortion; specify the cliff and it becomes a fence.
4. **100% — gracious.** The wall itself is polite, preserves the user's work in progress (the invite they were composing is saved, thanked), and offers the upgrade as one option among several — including "do nothing until the pool resets," explicitly. A limit wall that offers exactly one door is a hostage situation with a card form.

Honesty clause: **if the limit is soft, say it's soft.** "Need a few more this month? Ask us — we say yes a lot" converts better than fake scarcity and builds the kind of goodwill that survives renewal. Fake scarcity converts once and emails your churn cohort forever after.

And upgrade prompts belong to the same respect-system as every other interruption: the delivery mechanics (frequency caps, dismissal memory, channel choice) are the ones we lay out in [notifications designed like you're not the main character](/journal/product/notification-design-respect). An upsell banner is a notification with a wallet, and it must obey notification law.

## The dismissed-state contract

"Dismiss" is a contract, and breaking it is the single fastest way to teach users that your UI lies. The contract, in full:

- **Dismissed means dismissed.** A closed prompt about feature X does not return about feature X for a meaningful interval — we default to 30 days for informational prompts, until plan-relevant change (new billing cycle, crossed threshold) for limit prompts. "Snooze" and "never for this feature" are different buttons; offer both, honour both.
- **Dismissal is per-feature, not per-surface.** Hiding the modal and then showing the same pitch as a banner, a sidebar card and an email is the same message wearing disguises, and users read it as one thing: nagging. Dismissal state lives on the *offer*, not the placement.
- **The path back is findable without a prompt.** Users change their minds at renewal-adjacent moments, budget cycles, and team growth spurts. If the dismissed feature can't be rediscovered from [pricing](/pricing)-adjacent surfaces — a compare row, a settings mention, a "plan" page that shows what the next tier unlocks — then dismissal is a dead end and you're forced into re-nagging to stay discoverable. Discoverable-without-nagging is a design deliverable: the [pricing page must do clarity work](/journal/product/pricing-page-ux-research) so the product doesn't have to do shouting work. The [quiet side of pricing pages](/journal/web-design/pricing-pages-that-convert-quietly) covers the page itself; the product's job is to hand off to it gracefully.

## The handoff: from prompt to pricing page without losing them

The click on "Upgrade" is the start of a funnel, not the end of a prompt, and the joint between product and pricing page is where conversions quietly die:

- **Carry the context.** The user clicked at a limit wall about *seats*; land them on a pricing view with seats pre-emphasised, ideally with the plan pre-selected and the relevant row highlighted. Dumping them on a generic four-plan grid after a specific prompt is a context switch they didn't ask for — same sin as a [workspace switch that loses your place](/journal/product/workspace-switching-ux).
- **One step to confirmation.** In-product upgrade means the payment method is often already on file. A prompt → pricing grid → plan page → checkout → confirmation chain has four places to abandon. Prompt → confirm (with honest price, billing period, and the seat maths done for them) has one.
- **Say the money plainly, twice.** The number at the prompt ("$24/seat/month") matches the number at checkout, including the annual-vs-monthly trickery that makes the price on the wall and the price on the form differ by a factor of "billed annually." If the marketing price requires an asterisk, the asterisk rides with it into the product.
- **Failure is a state too.** A declined card at upgrade — often a corporate card hitting a limit — must not strand the user at an error toast. Preserve the selection, offer the retry and the "email me an invoice link" path, and treat the whole thing with the dignity of any other [flow with real stakes](/journal/product/multi-step-flows-wizards).

## Measuring without lying to yourself

Upgrade-prompt analytics are a fraud machine by default: the modal on login will "outperform" everything because it touches everyone, and its cost is externalised onto metrics nobody attributes to it. Discipline:

- **Attribute the cohort, not the click.** The question isn't "prompt CTR" — it's whether users who saw the prompt upgrade within 30 days at a higher rate than a holdout who didn't, *and* whether their 90-day retention and support sentiment are no worse. Prompt-influenced upgrades with elevated 60-day sticker-shock churn are not upgrades; they're deferred refunds.
- **Guardrail metrics on the same dashboard as the wins.** Dismissal rate, second-dismissal rate (buyer's remorse at the prompt level), support tickets tagged "billing frustration," and session-abandonment immediately post-prompt. A prompt that wins upgrades and triples dismissals is borrowing from a competitor's future market share. This is the same measurement honesty as [funnel metrics that measure movement](/journal/growth/funnel-metrics-that-matter): stage definitions written down, movement cohorted, one owner per number.
- **Never A/B test aggression downward only.** Teams test their way from polite to pushy one experiment at a time, because pushier keeps locally winning. Countermeasure: hold a permanent low-aggression control and read it at the cohort level quarterly. Some of the best conversion we've seen came from *removing* prompts and letting the fences and discovery paths carry the load — the "upgrade" screen people reach themselves converts at multiples of the one that reached for them, because intent beats attention. That mirrors what we saw on [Larklight's marketing-site rebuild](/work/larklight-saas-marketing-site): the demo CTA that stopped interrupting and started being findable outperformed every modal variant tested (numbers illustrative, direction consistent).

## Copy, since you'll ask

Prompt copy follows ordinary conversion-copy rules with one extra: **the tension must be the user's, not yours.** "You've run 9 of 10 exports this month — Premium removes the ceiling" is their tension, named. "Upgrade now and unlock export superpowers!!" is your quota, showing. The full machinery of writing from the user's evidence instead of your adjectives is in [conversion copywriting](/journal/growth/conversion-copywriting); the upsell is where it matters most, because the reader has the least patience available anywhere in the product.

## Key takeaways

- Prompt at moments of demonstrated value, where the offer narrates a benefit the user just felt; interruptions at any other time buy clicks with trust at a bad exchange rate.
- Limits need a nudge ladder (ambient → informative → actionable → gracious wall) with honest numbers, the cliff specified in advance, and "do nothing" present as a real option at 100%.
- Dismissal is a contract — honoured per-offer, across placements, for meaningful intervals, with a findable path back that doesn't depend on re-nagging.
- The prompt-to-pricing handoff carries context: pre-selected plan, pre-done maths, one step to confirm, price stated the same number twice.
- Measure prompt-influenced upgrades cohort-vs-holdout with guardrail metrics (dismissals, billing-frustration tickets, 60-day churn) — or your dashboard will lie to you on schedule.

## FAQ

**Where do prompts belong: modal, banner, or inline?**
Inline first — a message in the surface where the limit lives is context, not interruption. Banner for account-wide matters (billing failure, plan change). Modal only for hard stops where the user literally cannot proceed, because a modal claims the whole stage; the moment a user learns your modals can be background noise, everything you ever say in a modal loses authority.

**How many concurrent upgrade messages is too many?**
One. A user who is being nudged about seats, exports *and* the annual discount simultaneously is being marketed at, not served. Run a single queue with priority rules (hard limits outrank nice-to-haves), and suppression: any hard-limit prompt mutes promotional ones for the duration. If your prompts need traffic control, your underlying plans probably do too.

**Should free users see prompts for enterprise features?**
Almost never. Personalities matter: the prompt is a promise that *this tier* was made for *them*. Showing a solo free user a "contact sales for SSO" wall teaches them the product's ceiling is elsewhere. Enterprise discovery belongs on the pricing page and in sales-assist flows, not interposed in a solo user's Tuesday.

**What prompt frequency cap actually works?**
We default to one promotional prompt per user per week, any surface, all campaigns combined — and two weeks of silence after any dismissal. Sounds austere; in practice scarcity forces prioritisation, which is exactly the discipline that keeps prompts useful enough to convert. Teams with a cap ship fewer, better prompts. Teams without one ship wallpaper.

**Do upgrade prompts belong in onboarding?**
Only in one form: honest ladders. "Free gets you X; when you outgrow it, Y is here" stated once during setup builds trust and plants the upgrade as a *graduation*, not a toll gate. Everything beyond that — day-two upsells, checklist items that are actually paywalled features — teaches new users that the product's agenda outranks theirs, which is a lesson they remember at renewal.
