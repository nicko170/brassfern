---
title: "Settings screens grow up: running the product surface nobody loves"
description: "Settings rot quietly — accreted toggles, orphaned features, dangerous defaults. A rubric for what earns a setting, and the quarterly audit that keeps it honest."
slug: settings-design-adult
cluster: product
tags: [settings, information architecture, product governance, ux audit, defaults]
date: 2025-04-22
author: June Okafor
keywords: [settings ux, product settings information architecture, saas settings design, settings audit, dangerous defaults]
readingTime: 9
---

Every product team has a junk drawer. It's called Settings.

Nobody plans to build it. Settings accrete the way lint accretes: a flag here because two customers disagreed, a toggle there because shipping it behind a switch felt safer than deciding, a panel nobody remembers adding because the engineer who added it left in 2023. Then one day a new hire asks "what does 'Enable legacy collation mode' do?" and the room goes quiet.

The root cause is cultural, not technical: teams treat settings as a place to *defer decisions*. Each new toggle is a small act of cowardice — we couldn't decide, so we made the user decide, forever, at 11pm, with no context. Adult settings design is mostly the discipline of deciding. This piece is the operating model we run on mature products: a gatekeeper rubric for what earns a setting at all, a quarterly audit ritual with a scoring sheet, and the migration mechanics for cleaning house without breaking anyone's workflow.

For the structural side — how to group, zone and search the settings you *keep* — our piece on [settings information architecture](/journal/product/settings-information-architecture) covers it. This one is about stopping the surface from rotting in the first place.

## The three kinds of rot

Settings decay in only three ways. Naming them makes them auditable.

**Accretion.** Settings with no decision behind them. The signature is a toggle added in the same PR as the feature it controls, with default "off," that nobody ever turned on. It shipped because a switch felt like a hedge. Accreted settings are easy to spot in a database query: set by <1% of accounts, untouched for a year.

**Orphans.** Settings that control features that no longer exist, or exist only partially. The integration was deprecated but its panel remains. The experiment ended; its flag didn't. Orphans are worse than accretions because they *lie* — they imply functionality the product doesn't have, and users burn support time discovering that.

**Dangerous defaults.** The most expensive kind. A setting whose out-of-box value quietly harms users who never visit the page: email notifications defaulting to "everything," data-sharing defaulting to "on," session timeouts defaulting to "never" on a product that handles health records. Defaults are design decisions made on behalf of every non-tinkerer — which is to say, roughly 95% of accounts. They deserve the same scrutiny as the marquee feature. They rarely get it.

## The gatekeeper rubric: does this earn a setting?

The highest-leverage practice is also the simplest: a checkbox list that a proposed setting must pass *before* it's built. Ours is five questions, and the answer must be yes to at least two:

1. **Will at least a double-digit minority of accounts plausibly choose the non-default?** If 1% of users want a behaviour, the answer is not a setting — it's a conversation with those users, or an API flag, or nothing.
2. **Is the choice stable?** A preference users set once and keep (date formats, timezone behaviour) is a good setting. A preference tied to a *situation* ("sometimes I want compact view") is a bad setting — it belongs in the interface, at the moment of need, not buried in a panel.
3. **Can a reasonable user understand the consequence without reading documentation?** If the honest explanation of a toggle takes three paragraphs, the product hasn't decided what it is yet. Fix the feature, don't ship the switch.
4. **Is there a real reason we can't just decide?** Regulatory variation, genuine hardware constraints, integrations with third parties we don't control — legitimate. "The team argued about it in standup" — not legitimate.
5. **Are we willing to maintain both paths forever?** Every setting doubles a test matrix. If the honest answer is "we'll test the default and hope," you're shipping a bug generator with a UI.

Run this rubric in design review the way you'd run a threat model. It feels bureaucratic exactly once — the first time it kills a setting, someone realises how many near-misses are already in production.

## The quarterly audit ritual

Prevention slows the rot; it doesn't reverse the existing stock. For that: a recurring audit, calendar-scheduled, never more than a half-day, with a fixed scoring sheet. Here's the ritual as we run it on retained products.

**Step one — pull the census.** Every setting, with: current value distribution (% of accounts on non-default), date last changed by a user (median), feature it controls, and owner. If your settings aren't queryable like this, that observability gap is finding zero of the audit.

**Step two — score each setting on four axes, 0–2 points each:**

| Axis | 2 points | 0 points |
| --- | --- | --- |
| Usage | >10% of accounts on non-default | <1% |
| Legibility | Users can predict the effect | Name references an internal codename |
| Health | Controls a live, tested code path | Feature orphaned or partially deprecated |
| Default safety | Default is the safe choice for a naive user | Default optimises for the product, not the user |

**Step three — bucket by score.** 7–8: keep, no action. 4–6: fix — rename, re-explain, re-default, or relocate. 0–3: kill or migrate. The scoring is deliberately crude; precision isn't the point. The point is that "0–3" ends an argument that would otherwise run for six months of meetings.

**Step four — the defaults review.** Separately from scoring, read every default as if you're a new user with a threat model. This is where we pair product with whoever owns support, because support knows which defaults generate tickets. On one ed-tech platform we inherited, the audit found a default that emailed instructors on *every student submission* — in courses with 400 students. Nobody designed that; it was the framework's out-of-box value. Changing it cut notification complaints by more than half in one release (illustrative figure, but directionally the most common audit win we see: someone finally reads the defaults).

If you want the fuller case for treating defaults as [dangerous things that need zoning](/journal/product/permission-ux-design), the permission-UX playbook applies almost verbatim — permissions are just settings with legal consequences.

## Killing settings without killing trust

The failure mode of a settings cleanup isn't removing the toggle — it's removing it *badly*. Users who configured a thing have built a workflow on it. The mechanics that keep a deprecation safe:

- **Ship the migration before the removal.** If the killed setting maps to a behaviour, migrate everyone to the winning path first, silently, and let it bake. The setting removal a release later is then a UI change, not a behaviour change.
- **Stage it per cohort.** Roll the removal to new accounts first, then a percentage ladder of existing accounts with the flag still available behind support. This is standard feature-flag practice applied to subtraction — our engineering notes on [shipping behind flags](/journal/engineering/feature-flags-craft) cover the plumbing.
- **Tell the affected, not everyone.** Email the accounts on the non-default path — you know exactly who they are; that's what the census was for. "You turned this on; here's what changes and when" lands completely differently from a generic changelog line.
- **Keep a graveyard.** A short internal doc of removed settings, why, and when. It prevents the two-year-later re-addition of a setting that was killed for good reasons nobody wrote down.

## Settings need a landlord

The audit works when someone owns the surface. We assign it: a named person (usually a senior product designer or PM) who receives every proposed new setting, runs the rubric, and chairs the quarterly audit. Not a gatekeeping committee — one person, with authority to say "just decide" — because committees are how date-format pickers end up with four options.

The landlord's other job is presentational: keeping settings honest in the UI as the product grows. Surface the five settings that matter during onboarding or first-run; let the long tail live behind a [well-designed search](/journal/product/command-palette-craft); and treat any setting that generates a recurring support theme as a design bug with an owner and a deadline, not a fact of life.

None of this is glamorous. That's precisely why it rots. But settings are where your product's respect for its users is most legible — every default is a decision you made for someone who trusted you to make it. Run them like the product surface they are.

## Key takeaways

- Settings rot in three ways: accretion (cowardice toggles), orphans (dead features' leftovers), and dangerous defaults. Each is findable with a census query.
- Gate new settings with a five-question rubric. The core question: is there a real reason we can't just decide?
- Audit quarterly: census, score on usage/legibility/health/default-safety, bucket into keep / fix / kill. Crude scoring beats endless debate.
- Review defaults separately and with support in the room. Defaults are decisions made for the 95% who never open the page.
- Kill settings safely: migrate behaviour first, stage removals per cohort, email the affected, keep a graveyard doc.
- Give the surface one accountable landlord. "Just decide" is a job description.

## FAQ

**What about enterprise customers who genuinely need configurability?**
Enterprise configurability is real — but it belongs in an admin layer designed for administrators, with its own IA, documentation and support expectations. The rot problem is when enterprise-grade toggles leak into the everyday settings UI of everyone else. Two surfaces, two audiences, two standards.

**Isn't "just decide" hostile to power users?**
Power users are better served by shortcuts, APIs, and automation hooks than by a longer settings page. A dense list of toggles isn't power — it's homework. Give power users leverage, not a spreadsheet of the team's unresolved arguments.

**How long does the quarterly audit actually take?**
If the settings are queryable: half a day, including scoring. The first audit of a legacy product takes two to three days because you're also building the census. Budget it once; it's the most educational two days a new product hire can spend.

**What if a low-usage setting exists for accessibility or legal reasons?**
Legitimate settings fail the usage axis on purpose — that's why the rubric requires passing *two* of five questions, not all of them. A setting that exists for a regulatory or assistive need passes "real reason we can't just decide" instantly. The audit isn't trying to hit a count; it's trying to make every setting defensible.

**Where do feature flags fit in all this?**
A flag is a setting with a shelf life, and it should have an expiry date attached at creation. Our rule: every flag ships with a removal ticket in the backlog. Flags without expiry dates are how codebase archaeology becomes a department.
