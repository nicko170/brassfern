---
title: "Test the words before you test the pixels"
description: "Copy-first testing: mine the message from reviews and sales calls, test value props on plain pages, stay honest with small samples. Button colours come last."
slug: conversion-copy-first-testing
cluster: growth
tags: [copy testing, CRO, messaging, A/B testing, value proposition, conversion copywriting]
date: 2026-05-19
author: Sam Whitfield
keywords: [copy testing before design testing, value proposition testing, message mining, CRO experiment prioritisation, conversion copywriting]
readingTime: 10
---

There is a test running on a thousand marketing sites right now: button, green, versus button, blue. It will run for nine weeks, reach a sample size someone apologises for in a slide, produce a 1.4% lift with a confidence interval you could drive a truck through, and change nothing about why anyone buys. Meanwhile, the headline above that button — the four words doing the actual persuasion — hasn't been questioned since the site launched.

This is backwards. Message moves markets; chrome moves margins. The single highest-leverage change most teams can make to their experimentation programme is a reordering: test the words first, on purpose, with pages ugly enough that only the message can be causing the movement.

## Why copy tests beat pixel tests

Three reasons, in descending order of how often we have to argue them.

**The effect sizes are bigger.** A value proposition is a hypothesis about why somebody should care. Changing it changes the entire decision a visitor is making. Changing a Hero layout changes how the same decision feels. Across [the experiments we design for clients](/journal/growth/cro-experiment-design), message-level variants routinely produce double-digit swings — in both directions, which is the point — while visual polish tests cluster in the low single digits. Small effects need huge samples; huge effects are findable with the traffic you actually have.

**The learnings generalise.** Learn that "green beats blue on the pricing page" and you've learned one fact about one page. Learn that "your buyers respond to time saved, not money saved" and you've learned something that rewrites the site, the sales deck, the onboarding emails and the next two campaigns. Copy tests buy knowledge; pixel tests buy decorations.

**The failure mode is cheaper.** A losing copy test tells you what the market doesn't believe. A losing design test tells you someone didn't like the shadows. Only one of those is a strategy input.

## Mining the message first

You can't test copy you haven't found, and you won't find it in a brainstorm. The strongest variants come from language the market already uses — which is why a copy-testing programme starts with research, not with a copywriter's first draft.

The source hierarchy: sales and discovery calls, exit interviews, support tickets, review sites, community threads. What you're mining for is the before/after pair — the pain said with feeling ("I was rebuilding the same report every Monday") and the goal said with relief ("I just want it done when I open my laptop"). Tag verbatims, never paraphrase them, rank by frequency times heat, and compress the modal language into headline candidates. The full methodology deserves its own read: [voice-of-customer mining](/journal/growth/voice-of-customer-mining). If you do nothing else from this article, do that one.

A useful rule of thumb: every candidate that enters the test queue should be traceable to a real sentence a real person said. Brainstormed lines aren't banned — but they're the control, not the hypothesis.

## The plain-page protocol

The biggest mistake in copy testing is testing copy inside your polished page. Your beautiful hero image, your social proof bar, your carefully tuned layout — all of it smears the signal. If the variant wins, was it the words or the way the words sat next to that testimonial?

So test the words on a page that has almost nothing else. The protocol we run:

1. **Strip the stage.** A headline, a subhead, one call to action, black text on white (or your quietest brand default). No imagery, no logos, no feature grid. It will look like a wireframe. Good — that's the laboratory.
2. **Variant the proposition, not the phrasing.** Testing "Save time on reporting" against "Cut reporting time by 80%" is a phrasing test — same proposition, different dress. Test different *propositions*: time saved vs money saved vs risk removed vs status gained. Each variant should be a different reason to buy, not a different way to say one reason.
3. **Route cold traffic to it.** Paid social or search traffic pointed at the plain page, split across variants. Cold visitors have no context and no patience; they're the honest judge. Warm traffic that already knows you will forgive a weak proposition and corrupt the read.
4. **Measure a committed step.** Not scroll depth, not time on page — a click with intent: start trial, book demo, add to cart. Copy that wins attention and loses commitment is clickbait in a lab coat.
5. **Kill or crown, then graduate.** The winning proposition earns the right to be designed. Now — and only now — it goes into the real page, where you test it again against the incumbent in full costume.

One caution: the plain page converts worse in absolute terms than your designed page, because it should. You're comparing variants against each other, not against the production site. The question is never "does the lab page beat the homepage" — it's "which reason-to-buy wins the laboratory."

## Statistical honesty for small samples

Here is the part the testing tools don't lead with: most sites don't have the traffic for the tests they think they're running.

A 5% relative lift on a 3% baseline conversion rate needs, at conventional power, somewhere around 40,000 visitors *per variant*. If your page gets 4,000 a month, that test takes twenty months. You will not run it. What you'll do instead is check the dashboard at week two, see a variant "winning," and ship noise. The discipline that protects you is the standard one — pre-registered hypotheses, a sample size decided before launch, a fixed end date, no peeking — and it's spelled out honestly in [A/B testing statistics for people who ship](/journal/growth/ab-testing-honest-statistics).

But small samples change the *kind* of copy test you should run, not just the patience required:

- **Swing harder.** Big proposition differences produce big effects, and big effects are detectable at modest n. "Time saved vs risk removed" might split 40/60; phrasing splits 48/52 and leaves you guessing for a quarter.
- **Prefer sequencing over splitting.** If traffic is genuinely thin, run variants back-to-back in week-long blocks and accept the seasonality noise — it's often cleaner than a split test starved of sample.
- **Use paid traffic as the sample pump.** You can buy statistical power. A modest paid budget pointed at the lab page for three weeks compresses a six-month organic test into a month, and the cost of the media is usually less than the cost of deciding on a hunch.
- **Know when you're really doing qualitative.** Below a few hundred conversions a month, "testing" is theatre. Run five to eight moderated sessions with the plain page instead — show the headline, ask what they think the product does and for whom, watch where the words fail. Low fidelity, high honesty.

## What the button colour is actually telling you

If your test queue is full of chrome — colours, shadows, hero images, carousel versus static — the queue is telling you something: you don't have a messaging hypothesis worth testing. That's the real finding. Button-colour tests are what experimentation programmes do when nobody has listened to a sales call recently.

The fix isn't to scold the queue; it's to refill it from upstream. Mine the calls, compress the propositions, run the laboratory. When the message is proven, *then* the design questions become good tests — because you'll be testing how to best express a truth, rather than hoping a rounded corner discovers one. And before any of it, run the audit that costs nothing: [heuristic CRO](/journal/growth/heuristic-cro-audits) finds the clarity problems — the vague headline, the buried price, the form with eleven fields — that no test should have to.

The sequence, taped above every growth team's monitor: **find the words, prove the words, then dress the words.**

## Key takeaways

- Message-level tests produce effect sizes an order of magnitude larger than visual tests, and their learnings transfer to every channel — chrome tests teach you one fact about one page.
- Mine candidate propositions verbatim from sales calls, exits, tickets and reviews; brainstormed lines are the control, never the hypothesis.
- Test propositions on a stripped plain page with cold traffic and a committed-step metric; a proposition must win the laboratory before it earns design.
- With small samples, swing harder, sequence instead of split, buy traffic as a sample pump — and know when you're really doing qualitative research.
- A queue full of button colours is a symptom: the programme has run out of messaging hypotheses. Refill it upstream.

## FAQ

**Should copy tests ever run on the real page instead of a plain page?**
Yes — as the confirmation stage, not the discovery stage. Once a proposition wins the laboratory, test it in full costume against the incumbent page, because headlines interact with layout, imagery and proof. Skipping straight to the designed page conflates message and presentation; skipping the confirmation risks crowning a winner that only works on a blank stage.

**How many propositions can we test at once?**
Two to four, and no more. Each variant splits your sample, and proposition tests earn their keep through contrast, not coverage. Pick the two reasons-to-buy with the strongest and most distinct verbatim evidence, plus the incumbent as control. A sixth variant teaches less than a sixth week of sample on the first five.

**Our brand team says plain pages are off-brand. How do we handle that?**
Frame the lab page as research infrastructure, not brand surface — it sits behind paid links, out of navigation, excluded from the sitemap. Agree a minimal kit (approved typeface, correct logo placement if any, accurate claims) and be explicit that what wins the lab gets fully art-directed before it touches the production site. Brand consistency on a page nobody was meant to admire is a strange hill to lose a market on.

**What do we do when two propositions tie?**
A tie is an answer: both reasons resonate, so they may belong at different depths of the funnel rather than in a fight. Test them in sequence — one as the promise, one as the supporting proof — and segment the readout if you can; ties often hide "variant A wins on mobile, B on desktop," which is a targeting insight wearing a stalemate.
