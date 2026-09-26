---
title: "Announcing a price rise without a revolt"
description: "The comms playbook for raising prices: grandfathering calls, notice periods, the announcement email anatomy, and why the apology tone is the mistake."
slug: pricing-communication-rollouts
cluster: growth
tags: [pricing, price increase, customer communication, churn, SaaS]
date: 2026-09-01
author: Sam Whitfield
keywords: [price increase announcement, pricing communication, grandfathering customers, SaaS pricing change, churn management]
readingTime: 10
---

Nobody's favourite launch is the price rise. The engineering is a config change; the actual project is communication, and it's the one launch where the copy does more revenue damage — or protection — than any landing page you'll write all year.

We've shepherded a dozen of these for clients, watched a few go sideways elsewhere, and the pattern is consistent: customers rarely revolt over the number. They revolt over *how they're told* — short notice, vague justification, an apologetic tone that signals the company doesn't believe its own price. Get the comms right and a well-set rise routinely lands with less churn than the leadership team feared. Get them wrong and you burn trust that took years to build in a single send.

## Decide the hard things before writing a word

The email is downstream of four decisions. Make them in a room, in this order, before anyone opens a doc:

**1. Grandfathering: who keeps the old price, and for how long.** The honest menu: (a) everyone moves, (b) existing customers keep the old price for a grace period, typically six to twelve months, (c) existing customers keep it forever. Forever-grandfathering sounds generous and quietly creates a legacy-pricing fossil record you'll be supporting in 2031 — including explaining to loyal ten-year customers why a trial user pays more than them. Our default for most SaaS: a long, explicit grace period. It honours loyalty without creating a permanent second price book. Whatever you pick, put the policy *in the announcement*, not in a reply-to.

**2. The effective date, with real runway.** Thirty days is the floor; sixty to ninety for annual-billing-heavy customer bases, so people can plan around renewal dates. Short notice reads as either panic or disrespect, and neither is the brand you want. Check your terms too — many contracts promise a notice window, and beating your own contractual minimum by a comfortable margin is cheap goodwill.

**3. Whether anything changes besides the number.** A rise that arrives with added limits removed, a feature un-gated, or service-level improvements lands entirely differently from a bare number going up. If the product has improved since the price was set, *say so specifically* — that's the justification, and it's true.

**4. The exception path.** There will be customers for whom the new price genuinely breaks the model: nonprofits at scale, customers mid-migration, the account that's about to churn anyway. Decide who can grant exceptions, within what guardrails, and how long the offer lasts. Undecided exception policy means support improvising discounts — which is how your pricing integrity dies one apologetic agent at a time.

If you're still at the "should we even raise" stage, that's the upstream conversation — we've written about [experimenting on pricing without lying](/journal/growth/pricing-experiments-ethical) and what [thirty pricing pages taught us about clarity](/journal/product/pricing-page-ux-research). This article assumes the decision is made and the number is defensible. If it isn't, fix that first; comms can't rescue an indefensible price.

## The announcement email, anatomised

This is the single highest-stakes email most companies ever send, and it has a shape that works:

- **Subject line: say it.** "We're updating our pricing" outperforms every cute alternative. Obscuring the subject doesn't soften the news; it adds a betrayal to it, because the reader finds out anyway, thirty seconds later, slightly more annoyed.
- **First sentence: the what, the when, the who.** "From 1 November, the Team plan moves from $49 to $59 per seat. Your account moves at your next renewal after that date." No preamble. The reader is scanning for exactly three facts; deliver them before they have to hunt.
- **Second paragraph: the why, concretely.** "Since this price was set in 2023, we've shipped X, Y and Z, and our costs have changed too." Specific improvements are justification; "to continue delivering value" is a shrug wearing a suit. One honest line about cost pressure, if true, reads as candour rather than complaint.
- **Third: the grace or grandfather terms.** In plain language, with the date arithmetic done for them. "You'll keep your current price through your May 2027 renewal" beats "a twelve-month grandfathering period applies" every time, because nobody wants to do date math while annoyed.
- **Fourth: what to do if it doesn't work.** Point at a human. "Reply to this email" with an actual monitored inbox is the single most powerful line in the whole message. It tells people they're dealing with people.
- **Sign-off: a name.** The head of product or the founder, a real person whose reputation is attached. Price rises signed "The Team" read like the company is hiding.

And the tone point we care most about: **do not apologise.** "We're so sorry, but unfortunately we have to…" frames the price as a wrongdoing, invites negotiation of the principle rather than the terms, and — worst of all — signals you don't believe the product is worth the new number. The register is respectful, direct and calm: here's the change, here's why, here's what it means for you, here's a human if it doesn't work. Apology tone is the mistake; clarity is the courtesy. The same principle governs all the [bad-moment communications](/journal/brand/brand-voice-in-errors) — errors, outages, churn: voice matters most when the news is bad.

## The rollout sequence that prevents the fire

Order of operations, and the order matters:

1. **Support and sales first, a week early.** They get the full FAQ: the exact terms, the exception policy, the twenty hardest customer questions with agreed answers. Nothing corrodes trust like a customer knowing more than the agent — and nothing reassures like an agent who answers instantly and specifically.
2. **Long-tenure and high-value accounts, personally.** Your top twenty customers get a call or personal email from a human they know, before the bulk send. This is a retention spend with an obviously positive expected value.
3. **The bulk email, timed.** Mid-week morning in the customer's dominant timezone. Not Friday afternoon — the world notices a Friday-afternoon price rise and correctly reads it as hiding.
4. **The in-product notice**, honest and dismissible, for people who filter email. Design it with the respect you'd give any [lifecycle message](/journal/growth/lifecycle-email-architecture): once, clearly, not a modal ambush during a task.
5. **Renewal reminders at the boundary.** As the grace period expires for each cohort, a plain reminder 30 days out. The second round of surprises is entirely preventable, so prevent it.

After it lands: monitor reply sentiment and cancellation-reason codes daily for a fortnight, and give the team permission to *not* over-react to the first forty-eight hours. Every price rise gets an initial spike of angry replies; the base rate settles fast when the terms are fair. Where the real learning lives: the cancellations that do happen are research grade — run them through your [exit interview](/journal/growth/churn-interviews-exit-surveys) process, because "the price rise" is rarely the actual reason; it's the permission slip for a latent unhappiness you should have heard about earlier.

## The math that makes this a strategy, not a gamble

Run the arithmetic honestly before you flinch: a 15% price rise can survive losing a slice of the customer base and still come out ahead — at typical SaaS margins, often several points of churn — and the customers most price-sensitive are frequently the highest-support-cost cohort. Model it with your real numbers, including the acquisition-cost difference between the leavers and the stayers. Most teams discover the emotional fear was running about three times the rational risk.

Then protect the outcome with discipline: no stealth exceptions leaking into the wild, a single page (internal Wiki, everywhere-linked) that is the source of truth on terms, and a retro two months later on actual churn versus the model — which is also when you adjust the next rise's playbook instead of improvising it.

Done this way, a price rise stops being the launch everyone dreads and becomes what it actually is: a quarterly-possible, fairly routine piece of pricing hygiene, handled with the same craft as the rest of the product. Customers don't need you to be cheap. They need you to be straight with them — about money most of all.

## Key takeaways

- Customers revolt over how they're told, not the number: short notice, vague justification and apology tone do the damage.
- Decide before writing: the grandfather policy, real notice runway (30 days floor, 60–90 for annual billing), what improved since the price was set, and the exception path.
- Announcement anatomy: subject that says it; the facts in the first sentence; concrete justification; grace terms with date math done; a human to reply to; a name on the sign-off.
- Never apologetic — respectful, direct, calm. Clarity is the courtesy; the apology tone signals you don't believe your own price.
- Sequence it: internal teams with the FAQ first, top accounts personally, bulk send mid-week, honest in-product notice, renewal reminders at the boundary.
- Model the churn math with real numbers before you flinch, and mine the exits for the latent unhappiness the rise merely surfaced.

## FAQ

**Should we blame inflation or costs?**
Only if it's true and specific. "Our costs have changed" plus two real examples — infrastructure, the team that supports you — reads as candour. A vague inflation gesture reads as everyone else's email and invites the obvious retort that your margins recovered faster than your customers'. The strongest justification is always product improvement since the price was set; lead with that and let costs be the secondary, honest line.

**What about annual customers mid-term?**
They're on the old price until renewal — that's the default reading of most contracts and the reading that keeps you trusted. The price rise applies at their next renewal after the effective date, and the grace-period arithmetic should make that trivially clear. Trying to re-price a contract mid-term is a legal grey zone and an unambiguous trust disaster; don't.

**Do we offer a discount to people who threaten to leave?**
Within the pre-decided exception policy only, and time-boxed. An on-the-spot negotiated discount teaches your customer base that the announced price is theatre, and word travels — communities compare notes within days. The principled exception (nonprofit status, genuine hardship, scale mismatch) holds; the haggle doesn't.

**How do we handle the inevitable social media pile-on?**
Reply like the email was written: direct, calm, specific. One public statement of the facts and the human contact path, then individual replies where people have individual situations. What makes a pile-on grow is a company going quiet or going defensive; a rise you believe in, explained straight, is a genuinely boring story by day three. The pile-ons that make the news almost always trace back to a comms failure — hidden changes, no notice, apology-and-vagueness — not to the rise itself.

**Can we ever just not communicate and let renewals reprice quietly?**
No. Silent repricing is how you end up as a cautionary screenshot. Customers treat uncommunicated price changes as a breach of the relationship even when contractually permitted, and they are right to. Every dollar saved on the awkward email is spent many times over on churn, support load and reputation repair. Straight comms is the cheap option.
