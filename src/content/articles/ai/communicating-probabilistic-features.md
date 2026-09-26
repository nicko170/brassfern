---
title: "Shipping 'sometimes wrong': communicating AI features"
description: "Launch copy for features that are sometimes wrong: setting accuracy expectations, changelog phrasing, support macros, and the trust maths of underpromising deliberately."
slug: communicating-probabilistic-features
cluster: ai
tags: [ai ux, launch copy, product marketing, content design, trust]
date: 2026-08-14
author: Leonie Marsh
keywords: [ai feature communication, launching ai features, ai marketing honesty, probabilistic ux copy]
readingTime: 10
---

Most software launch copy is a promise of determinism. "Never miss a renewal." "Always know your numbers." The product does the same thing every time, so the copy can too. Then you ship an AI feature and inherit a new fact: the product will, with complete honesty of intent, sometimes be wrong. If your launch copy pretends otherwise, the first wrong answer doesn't cost you a point of accuracy — it costs you the user's belief in everything else you said. We call this the credibility cascade, and we've watched it play out in support inboxes.

Communicating a probabilistic feature is not about hedging. Hedge words ("might", "may") are how teams signal to themselves that they were honest while signalling nothing to users. The craft is in *calibration*: giving people an accurate mental model of where the feature is strong, where it's weak, and what to do with that information. Here's the system we use — copy decisions we've made across a dozen [AI engagements](/services/ai), including the hard lessons.

## Start with an honesty budget, not a hype budget

Every launch has a finite amount of user patience for surprises. Deterministic features can spend that patience on delight. Probabilistic features must spend most of it on expectation-setting. The mistake is treating accuracy disclaimers as legal fine print and the headline as unbounded.

Our rule: the headline can make one claim, and it must be a claim about the *task*, not the *technology*. "First drafts of client-ready summaries in thirty seconds" survives contact with a wrong answer — the user asked for a draft, and a flawed draft is still a draft. "The AI that knows your business" does not survive contact with a wrong answer, because a wrong answer directly falsifies the claim. Test every headline this way: if the worst plausible model output would make this sentence a lie, the sentence is a liability.

This pairs with the [trust design patterns](/journal/ai/ai-trust-design) Dev's team uses in the interface itself: provenance, correction affordances, stated boundaries. Copy is the front door to all of it.

## State the accuracy, but in units users can act on

"92% accurate" is the Shape of Honesty with none of the substance. A user cannot do anything with 92%. Should they check every answer? One in twelve? All of them in the first month? The number is a stat about the model, not guidance for the person.

We translate accuracy into *behavioural* instructions:

- "Right about nine times in ten — and it shows its sources, so the tenth is easy to catch." (Gives a frequency, and pairs it with the catch mechanism.)
- "Best on questions about billing and plans. Weaker on anything older than your 2024 data." (Gives a boundary map.)
- "Treat it like a fast junior colleague: great first drafts, always check before it leaves the building." (Gives a social analogy with an embedded workflow.)

The third pattern — the junior-colleague frame — is the single most effective calibration device we've tested. Users already have a complete mental model for working with someone smart and inexperienced: you delegate, you review, you don't fire them for one mistake but you also don't let them email the client unsupervised. That model transfers wholesale to the feature, and it's honest.

## Changelogs: phrasing model improvements without confessing past sins

Model and prompt updates ship constantly, and each one needs a changelog line. The trap is oscillating between "nothing to see here" and "we fixed the thing you didn't know was broken." Both erode the page over time.

Our phrasing formula has three parts: the user-visible change, the scope, and the verification affordance. "Summaries now cite their source paragraph. Applies to all workspaces from today. See a summary that looks off? Flag it in one click — every flag is reviewed." Note what this does: it announces an improvement without implying the old version was untrustworthy, it bounds the change, and it converts potential distrust into a contribution channel. The flag gets used — and as we wrote in [our analytics piece](/journal/ai/ai-feature-analytics), flag volume is one of the few honest health metrics an AI feature has.

Two more changelog rules. First, never write "improved accuracy" without saying *on what* — "improved accuracy on multi-currency questions" is calibration; the unscoped version is noise. Second, when you genuinely fix a bad failure mode, say so in plain words once, including roughly when it started. Users who hit the bug already know; the confession rebuilds more trust than the silence preserves.

## Support macros for wrong answers

The wrong-answer ticket is coming. Prepare the macro *before* launch, because the first week is when your reply quality sets the tone for the feature's reputation.

A good wrong-answer macro does four things, in order:

1. **Validates without grovelling.** "You're right, and thanks for catching it" — not "we're so sorry our AI failed you", which frames a known characteristic as a catastrophe.
2. **Explains the category, briefly.** "The assistant sometimes misreads merged cells in imported spreadsheets" tells the user something durable about how to work with the tool. It converts a failure into knowledge.
3. **States the consequence.** "We've logged this example for the eval set" — and mean it. If it goes into an eval set, say so. If it just goes to a spreadsheet someone reads on Fridays, say that. Vague "we've passed it to the team" reads as a bin.
4. **Offers the path around.** A workaround, a human handover, or an honest "this one's beyond it — here's the manual route."

Support agents should also have a one-line internal note on what *not* to say: never blame "the AI" as a separate entity ("the AI got confused"), because it teaches users the company isn't responsible for its own feature. The company shipped it; the company owns the output.

## Onboarding screens: prime for review, not for reliance

The first-run experience of an AI feature decides what users do with output forever after. If onboarding frames the feature as an oracle ("Ask anything!"), users treat output as truth until burned. If it frames the feature as a collaborator, the review habit installs on day one.

The pattern we keep returning to: make the user's *first success* include a verification step. On the [Pylon Health telehealth work](/work/pylon-health-telehealth-flow), the intake summary feature's onboarding has the clinician review and edit a sample draft before the real one — not as a tutorial they can skip, but as the actual first task. Clinicians who edited a draft in onboarding had meaningfully higher long-term usage than those who watched a demo video. The edit *is* the lesson: you are the editor; that's the job; here's how good the drafts are.

Consumer features can't always force this, but they can scaffold it — a first answer delivered with its sources expanded by default, a gentle "want to check this against the original?" the first time. Friction is usually the enemy of onboarding. Here, one well-placed point of friction is the feature's immune system.

## The trust maths of underpromising

Here's the arithmetic that convinces sceptical founders. Suppose your feature is right 93% of the time, and suppose a satisfied accurate experience gains you one unit of trust while a surprising wrong answer costs five. Overpromise, and every wrong answer is surprising: trust per 100 answers = 93 − (7 × 5) = +58. Calibrate honestly, and wrong answers land as expected-with-catch-path — say they cost one unit each: trust per 100 = 93 − 7 = +86. Same model. Nearly fifty percent more trust, purely from what you said at the door.

The catch (there's always a catch) is that underpromising costs you sign-ups at the top of the funnel. In our experience the honest feature page converts a few points lower than the breathless one and retains dramatically better — there's more on that trade-off in [our activation metrics piece](/journal/product/activation-metrics-honest). For a feature whose value compounds with usage, that's the right trade every time.

## Key takeaways

- Write claims about the task, not the technology. If the worst plausible output makes your headline false, rewrite the headline.
- Translate accuracy into behaviour: frequencies with catch mechanisms, boundary maps, and the junior-colleague analogy all beat percentages.
- Changelog entries need a user-visible change, a scope, and a verification affordance — "improved accuracy" alone is noise.
- Prepare the wrong-answer support macro before launch: validate, explain the category, state the consequence, offer the path around.
- Onboard users into a review habit; one point of friction early is cheaper than a trust collapse later.
- Underpromising converts a few percent worse at the door and retains far better over the year. Run the trust maths before the hype.

## FAQ

**Should we put an accuracy number anywhere at all?**

Yes — in the documentation and in sales conversations with technical buyers, alongside how it was measured, on what distribution, and when. A number with its methodology is honest. A bare number on a marketing page is theatre.

**Won't honest copy hurt us against competitors who promise the moon?**

In the short term, some. In the quarter after launch, their support queues and churn tell the story. We've rarely seen a category where the overpromiser kept their lead once users had sampled both. You can also be honest and vivid — "drafts in thirty seconds, with receipts" is both calibrated and a better line than "revolutionary AI".

**How do we talk about a feature that will improve over time?**

Commit to the direction, not the destination. "We're expanding what this can read — tell us what you want it to handle" invites users into the journey. "It'll be able to do that soon" invites them to wait, and then to be angry when soon isn't now.

**Who should own this copy — marketing or product?**

Content design, with both at the table, and with engineering in review. The writer needs to know the actual failure modes; the engineer needs to know what's being promised in their name. We treat launch copy for AI features as an engineering artefact: reviewed like a spec, changed like an API.

**What if leadership insists on stronger claims?**

Show them the trust maths, then show them a side-by-side: their proposed headline next to a plausible bad output. Ask whether they'd put those two sentences on the same page. Nobody ever has.
