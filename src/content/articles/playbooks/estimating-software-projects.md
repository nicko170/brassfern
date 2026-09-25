---
title: "Estimating: how studios price and how to read a quote"
description: "Demystifying software estimates: scope decomposition, risk loading, fixed price vs retainer maths, variation clauses, and the questions buyers should ask."
slug: estimating-software-projects
cluster: playbooks
tags: [estimation, agency pricing, fixed price, retainers, buying software]
date: 2025-02-13
author: Tomás Reyes
keywords: [software project estimation, agency pricing models, fixed price vs time materials, project quote, reading agency proposal]
readingTime: 11
---

Every software estimate is a bet on the future wearing a spreadsheet costume. That doesn't make estimates useless — it makes them *readable*. Once you understand how a studio builds a number, you can tell within two pages whether a quote is a careful plan, a sales device, or a random number with a logo. This is the honest version of how the sausage is priced, from the side of the table that prices it daily.

## Where the number actually comes from

Serious estimates are bottom-up, and the bottom is decomposition. A good estimator breaks the project into units small enough that each one is boring. Nobody can estimate "a checkout flow"; almost anybody can estimate "a shipping-address form with postcode validation, three error states and a saved-address list" because they've built six of them. The units get individual estimates — usually in ideal days plus risk loading — and roll up.

Three properties of the decomposition tell you whether to trust the total:

1. **Granularity.** If you see line items over about ten days, the estimate is poetry. Ten-day items contain unknowns the estimator declined to find, and unknowns are where overruns breed.
2. **Explicit risk loading per line.** Honest estimates don't hide contingency in a lump; they show it per item. "3 days + 1 day risk (third-party API undocumented)" tells you both the number and *why it's soft*. A quote where every line is suspiciously certain about an integration nobody has tested yet is not confidence — it's marketing.
3. **What's excluded.** The exclusions list is the most honest page of any proposal. "Excludes: content migration, legacy SSO, app-store review cycles" is a list of known unknowns handed to you on paper. Treat a quote with no exclusions as a quote that hasn't admitted anything yet, and assume the admission will arrive later, invoice-shaped.

On our side, we keep a private library of actuals: what that checkout flow *really* took, per project, since 2019. Estimation gets good the way [Core Web Vitals work](/journal/engineering/core-web-vitals-field-guide) gets good — measured, compared, calibrated, repeated. Ask any studio what their estimate-to-actual ratio was on their last five similar projects. The studios that track it will tell you a number (nobody honest is at 1.0); the studios that don't will tell you a story.

## Reading the three pricing shapes

**Fixed price.** The studio prices the decomposed scope, loads for risk, and owns the overrun risk — in exchange for scope rigidity. Fixed price is a risk *transfer*, not a risk *removal*: the risk moves into the change-request column, which is why fixed-price contracts live and die on the variation clause. Read that clause before the price. A healthy one defines: what a variation is (anything outside the written scope), how it's costed (same rate card, documented estimate before work starts), and its approval path (written sign-off, named approver). A pathological one says "reasonable changes included" — a phrase that has ended more agency-client friendships than any technology decision.

**Time and materials.** You buy capacity at a rate; the studio is paid for the hours the work takes. T&M is cheaper on paper because you hold the risk — and it's superb when the scope genuinely can't be known (research-heavy work, integrations into legacy systems of unknowable temperament), provided the studio reports burn weekly against a re-forecast. The trap isn't T&M itself; it's T&M without a forecast. Demand the re-estimate cadence in writing: every fortnight, here's the burn, here's the revised total, here's what changed. A studio that resists fortnightly re-forecasting is asking for an open tab.

**Retainer / capacity.** You buy a fixed slice of a team monthly. Retainers shine when the work is continuous and priorities move — product teams without a full in-house squad, ongoing [growth programs](/services/growth). Read retainer quotes for two things: the rollover/catch-up policy (do unused hours die? Healthy studios cap rollover at a month or convert to tangible deliverables) and the team-consistency clause (a retainer that quietly rotates juniors is a staffing product, not a product team).

None of the three shapes is morally superior. Fixed price suits known scope; T&M suits exploration; retainers suit continuity. A studio pushes the wrong shape when its incentive — revenue certainty, utilisation — outvotes your project's reality, and knowing that lets you have the interesting conversation: "Why this shape, for this scope?" The answer is itself an estimate of the studio's honesty.

## The risk-loading conversation nobody has

Here's a curiosity of the industry: buyers celebrate negotiating risk *out* of quotes and then live through the consequences. Risk loading isn't padding; it's an actuarial acknowledgment that some line items are genuinely uncertain. When a buyer squeezes loading out of a fixed price, one of three things happens: the studio eats overruns quietly (and starts protecting itself by slowing down or cutting quality), the studio discovers "variations" (you pay it back with interest and friction), or the studio simply walks from the project when the numbers stop working. The fourth option — the work genuinely got simpler — is rare enough to discount.

The better negotiation: attack uncertainty, not the number. If a line reads "SSO integration: 5 days + 4 risk", ask what would halve the risk — usually "can we get a sandbox account and a contact at your identity vendor this week?" You can often convert loading into a week's homework and take real money out of the quote. This is the single best use of a buyer's leverage, and almost nobody uses it. (If your project is early and the unknowns are structural rather than technical, buy them down properly with a [discovery sprint](/journal/playbooks/discovery-sprint-playbook) before asking anyone to price the build.)

## Questions to ask any number

Seven questions, each with a correct flavour of answer:

1. **"Show me the decomposition."** Healthy answer: a spreadsheet. Unhealthy: "we estimate holistically."
2. **"What's the risk loading, per line, and what's it for?"** Healthy: specific reasons per line. Unhealthy: "industry standard contingency."
3. **"What's excluded, and what would change that?"** Healthy: a list with triggers. Unhealthy: silence.
4. **"What's your estimate-to-actual ratio on comparable projects?"** Healthy: a number slightly above 1 with an explanation. Unhealthy: "we always deliver on budget" — nobody always does; they're telling you how they'll behave when they don't.
5. **"What does day one need from us, and what happens to the price if we're late with it?"** Healthy: a dependency list (access, content, people) and a written standstill policy. The honest quote assumes things about *you*, and says so.
6. **"Walk me through the variation clause with an example."** Healthy: they tell the story of a real variation on a past project. Unhealthy: they reassure you it rarely comes up.
7. **"What would you descope to hit 80% of this number?"** The single most revealing question in procurement. A studio that engaged with your problem has a view on what's load-bearing and what's garnish. On the [Brightmarsh project](/work/brightmarsh-onboarding) our answer demoted an entire reporting module to phase two — because the evidence said activation was the fire to put out first. A studio that can't descope gracefully hasn't understood your priorities; they've only totalled your requests.

## The numbers that sit beside the number

A quote should also tell you the operating numbers: team shape (who, seniority, allocation), weekly cost of any standby, the change-request rate card, payment schedule tied to delivery milestones, and the warranty window (what's fixed free after launch — four to six weeks on defects is the honest norm). If any of these are absent from the document, they exist anyway; they'll just be invented later by whichever side is more tired.

And a word on the suspiciously cheap quote: projects don't get cheaper, they get *reallocated* — to less senior people, to thinner QA, to a codebase you'll be quoted again to untangle. The question isn't "can you do it for less" but "what stops happening when we pay less". Ask it verbatim. The good studios have a real answer; on our [pricing page](/pricing) we publish ours before anyone has to ask.

## Key takeaways

- Trust bottom-up estimates: granular line items, per-line risk loading with stated reasons, and a real exclusions list.
- Match pricing shape to scope kind — fixed for known scope, T&M for exploration, retainer for continuity — and read the variation, re-forecast and rollover clauses respectively.
- Negotiate uncertainty down (sandbox access, answers, a discovery sprint) instead of negotiating risk loading out with pressure.
- Ask seven questions, especially "what would you descope to hit 80%" and "what's your estimate-to-actual ratio".
- The operating numbers matter as much as the total: team shape, rate card, milestones, warranty.
- Cheap quotes reallocate cost into seniority, QA and your next rebuild. Ask what stops happening.

## FAQ

**Why do two studios quote 3× apart for the same brief?**

Usually because they're pricing different projects: one priced your stated scope, the other priced the scope they believe you'll actually need — integrations, content, states, edge cases — after building five things like it. Ask both to show decompositions and exclusions; the gap almost always lives in the exclusions page. Occasionally it's honest disagreement about approach, which is exactly what a good [brief](/journal/playbooks/writing-a-great-brief) is supposed to surface.

**Is a detailed estimate worth paying for?**

Yes — pre-sales estimates are necessarily rough because nobody's being paid to find the unknowns yet. A paid discovery produces a decomposable scope, tested integrations and real risk loading; the resulting build quote often *drops* relative to the pre-sales guess, and the variance shrinks dramatically. Paying for the estimate is how you stop the estimate being a sales artefact.

**Should we just insist on time-and-materials to keep it flexible?**

Only if you'll genuinely do the governance — weekly burn reviews, fortnightly re-forecasts, decisive reprioritisation. T&M punishes passive buyers brutally: flexibility without attention is just a slow leak. If your organisation can't staff the steering, a well-scoped fixed price transfers that burden to people who do it for a living.

**What does "10% contingency" actually mean?**

Usually nothing — it's a vibe. Ask contingency *what*, per line, and against which risks. Real contingency is traceable to named uncertainties; undifferentiated 10% is either fear (if the studio added it) or naivety (if procurement demanded its removal and the studio quietly re-hid it in the rates).

**How do we compare a studio quote against hiring in-house?**

Compare per shipped outcome per quarter, including the unpriced items: recruitment lead time (4–6 months for seniors), management overhead, tooling, leave coverage, and the risk of a bad hire. Studios are expensive per hour and often cheap per outcome — but only for the things studios are for. Continuous product ownership belongs in-house eventually; the good studios will tell you when, and [help you hire the handover team](/approach).
