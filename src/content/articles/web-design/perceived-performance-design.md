---
title: "Perceived performance is a design material"
description: "Perceived performance is designed, not just engineered: skeletons, optimistic UI, progressive images, zero layout shift and the choreography of waiting states."
slug: perceived-performance-design
cluster: web-design
tags: [perceived performance, loading states, motion design, skeleton screens, web performance]
date: 2026-04-09
author: Hannah Yeo
keywords: [perceived performance, skeleton screens design, optimistic ui, loading state design]
readingTime: 10
---

There are two clocks on every screen. One belongs to engineering: milliseconds, waterfalls, field data, budgets. We write about that clock constantly — [Core Web Vitals in the field](/journal/engineering/core-web-vitals-field-guide) is the house position, and the 170kb rule in [bundle budgets](/journal/engineering/bundle-budget-discipline) is how it's enforced. The other clock belongs to the user, and it is wildly inaccurate. It runs fast when the first useful pixels arrive early. It stalls when a button shows no sign of life. It has no access to your waterfall and no interest in your Lighthouse score.

The user clock is *designed*. Engineering makes things fast; design decides what fast feels like while fast is happening. This is the design-side handbook: the materials, the timings, and the mistakes that make a genuinely quick site feel slow.

## The unit of perceived performance is the hold, not the second

People don't experience load time as a number. They experience it as intervals of *uncertainty*: did my click register, is the page coming, is this broken? Research out of the HCI world has been consistent for decades — under ~100ms, an action feels instantaneous; under ~1 second, flow holds if there's feedback; past a few seconds without progress, attention wanders and abandonment starts. Your design job is to keep every interval under its threshold with honest signals, not to shave the last 40ms (engineering's joy, not this article's).

That reframing gives performance a place in your component library, next to colour and type: **waiting is a state of the UI**, with the same status as hover or disabled. And we've made the broader case elsewhere that [empty, loading and error are the states that carry your trust](/journal/web-design/empty-loading-error-states). What follows is how to make the loading state specifically feel short.

## Material 1: the skeleton, shaped like the answer

Skeleton screens are the best-established perceptual device we have, and still the most routinely botched. The rule: a skeleton is a **promise of structure**, not a grey rectangle with anxiety. It must match the coming layout in position, proportion and count — five list rows arriving means five skeleton rows, at their real heights. When the shape matches, users read the loading state as "almost here" and subjective wait time drops. When it doesn't (a card grid replaced by one giant shimmer box), users read it as a spinner with good PR.

Practical rules we hold:

- **Shimmer moves toward where content comes from** — or stays perfectly still. A shimmer that pans across empty space is decorative motion that hasn't earned its keep; a subtle 1200ms opacity pulse across correctly-shaped placeholders outperforms it and respects `prefers-reduced-motion` trivially.
- **Skeletons shouldn't flash.** If the real content reliably arrives under ~300ms (a cached route, a prefetched page), the skeleton causes a strobe of grey that feels *slower* than a blink of nothing. Gate skeletons with a small delay — render nothing for the first 200–300ms, then the skeleton. Under the threshold, users never notice the gap; over it, they get structure instead of a flash.
- **Don't skeleton what won't arrive in one breath.** Media that streams in over seconds shouldn't skeleton repeatedly; it wants the next material.

## Material 2: progressive images, done with manners

The fired-blur-up placeholder is a decade old and still the right material for editorial imagery *when the placeholder resembles the image*. A 20px dominant-colour blur that feels like the hero arriving early; a grey box that gets replaced does not. The sequence matters more than the technique: placeholder → low-res or blurred preview → full image, with zero layout shift at each stage and no crossfade longer than the 160ms house rule (see [motion that earns its keep](/journal/web-design/motion-that-earns-its-keep)).

Which brings us to the single biggest perceived-performance sin, and it's not slowness at all.

## Material 3: stability is a performance feature

A page that loads fast and then shoves the paragraph you're reading down two viewports is a slow page with good metrics. Cumulative Layout Shift got a metric because users have been cursing it for fifteen years. The design fixes are unglamorous and non-negotiable:

- **Reserved aspect-ratio boxes for every image, video, embed and ad slot.** If a slot's size depends on content, it needs a declared `aspect-ratio` or explicit dimensions *before* content arrives. No exceptions — this is the entire job.
- **Font loading that doesn't reflow.** `font-display: swap` with a matched fallback (tuned via `size-adjust` and friends, or a fallback metric-matched face) so text never jumps when Fraunces-or-whoever lands. Type that visibly *changes clothes* half a second after you started reading reads as broken, no matter how fast it was.
- **Nothing inserts above the fold after first paint.** Banners, cookie notices, upgrade nudges — all of them get reserved space or a polite position *after* the first viewport. If marketing needs the banner, marketing gets it in a slot that exists from frame one.

Instability is doubly expensive on commerce: [site speed is a merchandising decision](/journal/ecommerce/site-speed-revenue-link) covers the revenue side, but the perceptual side is simpler — people extend the same trust to a page that they extend to a physical space. A shop whose shelves move while you browse feels like a scam.

## Material 4: optimistic UI — fast by taking the bet

The strongest perceptual device isn't making waiting look shorter; it's removing the wait from the moments that don't deserve one. Like the post, add to the playlist, tick the task: apply the change instantly, animate it in the house 160ms, and reconcile with the server in the background. We've written the integrity contract for this in [optimistic UI, with integrity](/journal/product/optimistic-ui-integrity) — the short version: be optimistic only where failure is rare, reversible, and *visibly* recovered. An optimistic like that quietly unlikes itself on a dropped train is fine. An optimistic payment is a lawsuit.

Design-side rules for optimism:

- **Only commit when the local model is complete.** You can optimistically add an item to a list you have. You can't optimistically show server-computed state (prices, availability) you don't — the correction flash is worse than the wait.
- **The optimistic state should be visually identical to the confirmed one.** Any "pending" styling visible to the user in the success path reintroduces doubt. (Exceptions: genuinely slow operations like uploads, where a determinate progress bar is honest and calming.)
- **Failure is designed, not handled.** Rollback animation, plain-language inline message, and the action remains retryable. An optimistic action that silently reverts teaches users that your UI lies.

## Material 5: the choreography of multi-stage waits

Some waits are real: payment processing, report generation, AI responses, uploads over hotel wifi. Here the design material is *narrative*. A 4-second wait with a determinate progress indicator and a short, honest explanation ("checking card with your bank — usually under 10 seconds") feels shorter than a 2-second wait behind a bare spinner. Staged copy works when the stages are true: "uploading → processing → generating" with a subtle state change at each boundary converts one long hold into three short ones.

For indeterminate-but-brief waits, a well-timed skeleton beats a spinner almost always; spinners are for actions (in a button, in a row), not for places. And for anything likely to exceed 8–10 seconds, add an escape: the ability to navigate away and be notified, an email-me-when-done, a backgrounded task. Respecting the user's clock sometimes means giving them back their time.

## Putting it in the design file

Perceived performance fails in handoff because it's specified nowhere. Our fix is procedural: every loading-capable component ships in the design system with the waiting states drawn — skeleton shapes at true proportions, debounce/delay behaviour noted in the spec ("no skeleton before 250ms"), optimistic actions marked, reserved space declared. Reviewers check waiting states the way they check hover states. The engineers we work with implement what's specced; perceived performance starts being real the day it appears in Figma instead of in a post-launch retro.

The [Larklight marketing site](/work/larklight-saas-marketing-site) is a good composite case: heavy hero imagery arrives through dominant-colour placeholders, the pricing section stabilises with declared ratios before fonts land, and the demo-booking action is optimistic through the calendar embed. Field data is nice. What converts is that the page never once asks you to doubt it.

## Key takeaways

- Users experience waiting as *intervals of uncertainty*, not seconds. Design keeps every interval under its psychological threshold with honest feedback.
- Skeletons must match the shape and count of the coming content, and should be gated by a 200–300ms delay so fast loads don't strobe.
- Zero layout shift is a perceived-performance feature: reserved aspect ratios, metric-matched font fallbacks, nothing injected above first paint.
- Optimistic UI removes waits that don't deserve one — but only where failure is rare, reversible, and visibly recovered.
- For genuinely long waits, narrative beats number: true staged copy, determinate progress, and an escape hatch after ten seconds.
- Specify waiting states in the design system like any other state, or they'll be invented at 11pm by whoever's shipping.

## FAQ

**Isn't perceived performance just "make it feel fast" — i.e., engineering with extra steps?**
No — the mechanisms are different. Engineering changes when pixels arrive; perception design changes what the user believes is happening before and after they do. The highest-leverage perceptual fixes (correct skeleton shapes, layout stability, optimistic actions) are often free in engineering terms.

**Won't adding skeleton delays and staged states add complexity?**
About as much as designing hover states — which is to say, trivially, once it's in the component library. The complexity people remember comes from retrofitting waiting states onto components that never planned for them.

**How do you measure perceived performance?**
Indirectly but reliably: rage-click and dead-click rates, abandonment during known wait points, session replay review around loading moments, and — simplest of all — asking in usability sessions "did that feel slow?" Subjective speed correlates with stability and feedback far better than with raw timings.

**Should everything optimistic? Is there such a thing as too optimistic?**
Yes: be conservative where the cost of being wrong is visible — money, inventory, another human's inbox. Optimism is a bet you place with the user's trust; place it where the odds are boring.

**What about AI features with 5–20 second response times?**
Same materials, harder mode: streamed partial responses (motion that earns its keep — [streaming UX](/journal/ai/streaming-ux-patterns) covers this properly), honest framing of what the model is doing, and a designed failure state for when it times out. The user clock ticks louder when the machine is "thinking."
