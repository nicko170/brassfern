---
title: "Designing CRO experiments you can believe"
description: "Hypothesis quality, sample-size honesty, the peeking problem, change isolation versus big-bang redesigns, and documenting learnings so your programme compounds."
slug: cro-experiment-design
cluster: growth
tags: [cro, experimentation, ab testing, statistics, research]
date: 2026-01-22
author: Sam Whitfield
keywords: [cro experiment design, ab testing statistics, conversion research, experimentation program]
readingTime: 9
---

Most A/B testing is astrology with a dashboard. A team changes a button colour, watches a graph until it looks encouraging, declares a winner at 62% confidence on a Tuesday because someone has a meeting on Wednesday, and ships a change whose true effect is somewhere between "nothing" and "slightly worse". Multiply by forty experiments a year and you have a programme that produces deck slides, not lift.

The good news: credible experimentation isn't exotic. It's a handful of disciplines, applied without exception, and a willingness to say "we don't know" — which is the sentence that separates a testing programme from a horoscope. This is how we run experiments in our [growth engagements](/services/growth), built up from programmes like the one behind our [GLADE skincare](/work/glade-skincare-ingredient-honesty) checkout work.

## 1. Hypothesis quality: the sentence test

Every experiment starts with one sentence, and if the sentence is weak the experiment is already over:

> Because we observed **[evidence]**, we believe **[change]** will cause **[metric]** to move **[direction/size]** for **[audience]**. We'll know we're wrong if **[falsifier]**.

"Because we observed" is the load-bearing clause. The evidence must exist *before* the test: session recordings of users hesitating on shipping costs, support tickets about delivery dates, [pricing-page research](/journal/product/pricing-page-ux-research) showing plan confusion. A hypothesis without observed evidence is a guess, and guesses teach you nothing — even when they win, you can't explain why, so you can't apply the lesson twice.

The falsifier is the second weight-bearing part. "We'll know we're wrong if checkout completion doesn't move" forces the team to name exactly what a negative result looks like *before* the result flatters them.

## 2. The honest maths: power, MDE and duration

Three numbers decide whether a test can detect anything, and they must be agreed before launch:

- **Baseline rate.** What the metric is now (say, 3.1% checkout completion).
- **Minimum detectable effect (MDE).** The smallest lift worth detecting. Smaller MDEs demand brutally more traffic — detecting a 10% relative lift needs roughly four times the sample of a 20% one. Choose the MDE from the *decision*, not the traffic you wish you had.
- **Duration in full business cycles.** Two weeks minimum, and always a whole number of weeks, so you capture each day-of-week pattern equally. A test run Tuesday-to-Monday has opinions about weekends you've never heard.

If the maths says you need nine weeks and the business will tolerate two, the honest answer is that this metric can't be tested at this traffic level — not that the maths is somehow negotiable. Low-traffic teams should test bigger swings (redesigns, offers, flows), measure lower-funnel-but-higher-volume metrics, or skip A/B entirely and use research plus staged rollouts. All three are respectable. Pretending a two-week trickle can detect a 5% lift is not.

As a rule of thumb that survives most conversations: at 80% power and 95% significance, detecting a 20% relative lift on a 3% baseline needs roughly 25,000 visitors *per variant*. If that number shocks you, good — it should rearrange your roadmap.

## 3. The peeking problem

Checking results daily and stopping when they look good inflates false positives catastrophically — a "95% significant" result checked continuously is significant in name only. This is the single most common way real teams fool themselves, because peeking feels like diligence.

Two honest fixes:

1. **Fixed-horizon testing:** decide the sample size and duration up front, then don't look. Automate the report to arrive *after* the end date.
2. **Sequential methods:** use a platform or stats package with always-valid p-values (group sequential tests, mixture sequential probability ratio tests) that are designed for continuous looking.

Either is fine. "We peek but we're careful" is not — the person peeking makes the stopping decision, and humans are hopeless at randomness. We pre-register every test: hypothesis, variants, primary metric, MDE, end date, in a shared doc, before the first visitor is bucketed. It takes fifteen minutes and it's the cheapest integrity money can't buy.

## 4. Change isolation versus big-bang redesigns

Purists say test one change at a time. Pragmatists note you can spend a year testing micro-tweaks while the competing site eats your lunch. The resolution:

- **Isolated tests** are for learning. When you need to know *what* works — which message, which friction matters — change one thing. Isolation is how a programme builds transferable knowledge.
- **Big-bang tests** are for capture. When the current experience is clearly mediocre and you have strong research for a coherent redesign, test the whole new page against the old. Accept that you'll win-or-lose without knowing which element did it.
- **Never do the dishonest hybrid:** big-bang a page, then attribute the lift to your favourite component. That story is fan fiction, and it pollutes every future decision built on it.

On [landing pages](/journal/web-design/landing-page-anatomy) we usually run one big-bang structural test first (message hierarchy, offer framing), then isolated tests inside the winning structure. Structure first, polish second.

## 5. Guardrails and instrumentation

Every experiment runs with guardrail metrics that stop the test regardless of the primary result: error rates, page performance, unsubscribe or refund rates, revenue per visitor. A variant can "win" checkout completion by hiding shipping costs and lose the quarter to refund requests. Instrument first, test second — an experiment with untracked guardrails is a bet that nothing can go wrong, which is not a bet, it's a personality flaw.

Similarly, decide your bucketing and QA before launch: randomisation verified in the data (a quick A/A check catches broken splitters), variant rendering tested on the actual devices your [activation metrics](/journal/product/activation-metrics-honest) say your users own, and cookie/consent handling confirmed legal in your markets.

## 6. Documentation that compounds

The deliverable of an experiment is not the lift — it's the learning. Every test, win or lose, ends in a two-paragraph entry in a shared repository: what we believed, what happened, what we now believe. Format it so a stranger could scan six months of results in ten minutes.

Two practices make the repository worth having:

- **Kill criteria in writing.** We pre-commit to abandoning the change if it loses, even a beloved one. I've ended more of my own ideas than anyone else's; the kill criteria are why those endings were cheap.
- **A losses file.** Losing tests are the programme's actual asset — they're the map of what your users don't care about, which narrows every future hypothesis. Teams that only log wins re-run the same losing ideas every eighteen months on cycle with staff turnover.

A programme that runs ten rigorous tests and documents them will beat a programme that runs fifty casual ones within a year, and it isn't close.

## When not to test

Fix obvious broken things without a test — a confusing error message, a dead-end [404 page](/journal/web-design/designing-404-pages), a hover state that doesn't exist. Ship it; you don't need statistical significance to remove a pothole. Test when the decision is genuinely contested or genuinely expensive to reverse. Testing everything is a failure of conviction; testing nothing is a failure of curiosity. The craft is knowing which situation you're in.

## Key takeaways

- Every test starts with an evidence-backed hypothesis sentence and a named falsifier. No evidence, no test.
- Agree the MDE, sample and duration before launch — and if the maths says undetectable, change the bet, not the maths.
- Pre-register, then don't peek, or use sequential methods designed for peeking. There is no third option.
- Isolate when you need to learn, bundle when you need to win, and never attribute a big-bang result to a favourite element.
- Log losses with the same care as wins. The learning repository is the programme.

## FAQ

**What significance level should we use?**
95% is the sensible default for decisions that are expensive to reverse. For cheap, reversible changes, 90% is defensible — but decide the threshold in the pre-registration, not after looking at the p-value. The sin is choosing the bar to fit the result, whatever the height of the bar.

**How long should a test run?**
Long enough to reach the pre-calculated sample, spanning at least two full business cycles, and never stopped early because a graph looked pretty. If events interrupt the run — a sale, an outage, a press spike — extend the window or restart. Contaminated data is worse than late data.

**Our traffic is too low for A/B testing. What now?**
Research-led changes with staged rollouts. Use session recordings, interviews and support logs to form strong hypotheses; make the change for everyone; monitor a before/after with honest caveats about seasonality. It's less rigorous and that's fine — rigour you can't afford is not rigour, it's theatre.

**Should we email-test, ad-test, and site-test with the same discipline?**
Yes — the disciplines transfer: hypothesis sentences, pre-set windows, guardrails, a losses file. Email subject lines and ad variants are easier because the cycles are cheap; site tests are where the pre-registration habit pays for itself.

**Who should own experimentation?**
One named owner with the authority to say no — to stopping early, to underpowered tests, to shipping losers because someone senior liked them. A committee can advise; only a person can protect the programme's integrity.
