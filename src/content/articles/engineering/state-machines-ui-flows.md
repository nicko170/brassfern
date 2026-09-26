---
title: "State machines for checkout and onboarding flows"
description: "Multi-step flows rot into boolean soup. Explicit state machines fix back-button bugs and analytics blindspots — with a worked checkout example."
slug: state-machines-ui-flows
cluster: engineering
tags: [state machines, frontend architecture, forms, checkout, xstate]
date: 2026-06-18
author: Tomás Reyes
keywords: [state machines frontend, xstate patterns, multi step forms, checkout state management, finite state machines ui]
readingTime: 10
---

Every multi-step flow we've ever been asked to "fix quickly" had the same patient zero: a handful of booleans. `isSubmitting`. `hasAddress`. `paymentFailed`. `showConfirm`. Each added for a good reason; together forming a board of switches where the impossible is representable — simultaneously submitting *and* failed, confirmed *and* editable — and the merely possible requires archaeology.

Then someone files the bug: "pressed back from payment, clicked pay again, got charged twice, support says my order is in limbo."

This is the article we point people at. Why flows rot, what an explicit state machine actually buys you (it's more than cleanliness), and a worked example from a checkout rebuild where the machine paid for itself in the first sprint.

## How boolean soup happens to good teams

Nobody designs boolean soup. Step one of a checkout is honest: `const [step, setStep] = useState(1)`. Then reality arrives in dribs:

- Payment can fail and needs a retry path: `paymentError`.
- Express wallet users skip the address step: `skipAddress`.
- An order can price-check before confirming: `priceChecked`.
- The user might edit the basket from the review screen: `editing`.

Each boolean is coherent. The *space* they define is not: five booleans admit 32 states; your flow has perhaps eight meaningful ones. Every impossible state is a bug that hasn't happened yet. Worse, transitions live scattered across event handlers — `onClick` here, a `useEffect` there, a promise callback somewhere brave — so the flow's true shape exists nowhere except in the minds of whoever's been on the team longest. When they go on leave, the flow develops opinions.

The symptoms are always the same. Back-button behaviour is broken because history was never part of the model. Analytics are fiction because "step viewed" events fire from render effects rather than transitions. And every new requirement ("now we need an ID-verification step, but only for some regions") multiplies the conditionals instead of extending a structure.

## What a machine actually is (and isn't)

A finite state machine for UI is three lists:

1. **States** — the names of the moments: `browsing`, `address`, `delivery`, `payment`, `authorising`, `review`, `confirmed`, `failed`. States are mutually exclusive. You are in exactly one.
2. **Events** — the things that can happen: `SUBMIT_ADDRESS`, `CARD_REJECTED`, `EDIT_BASKET`, `RETRY`.
3. **Transitions** — which events, in which states, lead where, with what side effects.

The load-bearing property: **if a transition isn't written down, it cannot happen.** `CARD_REJECTED` from `browsing` isn't a bug-path to defensively code around; it's undefined, and the machine ignores it. You flip the engineering question from "what if they somehow end up in a weird state?" to "what have we explicitly allowed?" That's the entire psychology shift, and it's why flow bugs largely vanish rather than get fixed.

Context — the cart, the form data, the payment intent — lives alongside the state, updated by explicit actions on transitions. The state says *where you are*; the context says *what you're carrying*. Keeping that distinction clean is half the craft.

## A worked example: the checkout rebuild

We rebuilt the checkout for [Hearthbrew's subscription club](/work/hearthbrew-subscription-club) — a coffee subscription with gift options, delivery cadence choices, and a wallet-first mobile audience. The inherited implementation was a 900-line component with eleven booleans and a `step` integer, which is to say a machine with no blueprint.

The explicit machine we designed with the team:

```text
                 ┌──────────┐   gift?   ┌───────────┐
  cart ──▶ details ──▶ options ────────▶ recipient  ─┐
                  │   (cadence, grind)                │
                  ▼                                   ▼
              delivery ◀──────────────────────────────┘
                  │ tokenised wallet → authorising ─┐
                  ▼                                  │
              payment ◀── RETRY ── failed ◀──────────┘
                  │ SET_CARD
                  ▼
              review ──▶ PLACE_ORDER ──▶ confirming ──▶ confirmed
                                              │
                                              ▼ DECLINED
                                          failed (with reason)
```

Three design decisions did the heavy lifting:

**`authorising` is its own state.** Wallet payments open a sheet on-device; the app must not accept edits or duplicate submissions while the sheet is out. As a boolean (`isAuthorising`) this was the source of the double-charge bug. As a state, "the user edited the address mid-authorisation" is simply not a thing the machine permits.

**`failed` carries a reason, and `RETRY` routes through it.** Declines for insufficient funds, verification failures, and network errors now produce different copy and different next actions, because the transition into `failed` is where the reason is recorded. Error copy as data — a theme we push everywhere (see [error messages that de-escalate](/journal/product/error-messages-that-help)) — drops out naturally.

**`review` accepts `EDIT_X` events that target specific states.** Editing cadence from the review screen jumps to `options`, and a guard on the return transition preserves everything already entered. In the boolean version, edit-from-review was disabled because nobody could convince themselves it was safe. With the machine, it was an afternoon.

The outcomes on the concept site's illustrative metrics: checkout abandonment on mobile dropped meaningfully in the first month, double-charge support tickets went to zero (from several weekly), and — the metric that surprised the client — time-to-add-a-new-step collapsed. A post-purchase "refer a friend" screen that would previously have been a two-week spelunk shipped in two days: one state, three transitions.

## The back button, for free

History integration is where machines quietly embarrass ad-hoc flows. Because states are named and transitions explicit, mapping them to the URL is mechanical: each entry step gets a route segment, `popstate` dispatches a `BACK` event, and guards decide whether `BACK` from `payment` returns to `delivery` or resets to `cart`. The browser's most-tested user behaviour — smashing back in a checkout — becomes specified behaviour instead of emergent chaos.

On telehealth flows this doubles as a compliance feature: the navigable path *is* the audit trail. When we built the booking flow for [Pylon Health](/work/pylon-health-telehealth-flow) — you can drive the result in the [Lab](/lab/pylon-health-booking) — the machine's transition log became the consent record. Clinically required steps can't be skipped because no transition routes around them; that's a property you can *show* a regulator, not just assert.

## Analytics that stop lying

Event instrumentation bolted onto renders produces garbage: effects re-fire, React re-renders for its own reasons, and "users saw the payment step four times" turns out to mean "the payment step rendered four times." Machines fix this structurally: you instrument *transitions*, not renders. `ENTERED payment` fires exactly once per arrival, by construction. Funnel analysis becomes trustworthy, and drop-off investigation starts from facts. Priya's team will not accept a growth brief on a flow that can't produce transition-level analytics any more — the [CRO experiment piece](/journal/growth/cro-experiment-design) assumes that floor.

## Practical notes from shipping these

**You don't need a library, but use one anyway.** A reduction to a switch statement is genuinely fine for a five-state wizard — and it's how we teach the pattern. The moment you want nested states (a payment step with `idle / validating / authorising` inside it), invoked async actors, or a visualiser that generates the diagram above from the code, reach for XState. The visualiser alone converts stakeholders: show a founder their checkout as a diagram and watch the requirements conversation get honest.

**Model the async explicitly.** Payment tokenisation, price checks, address validation — all are invoked actors with `onDone`/`onError` transitions. Never let a promise callback mutate state directly; route it through an event so every outcome is a named transition you log.

**Derive UI, don't mirror it.** The component tree is a pure function of `state.value` + context. The moment you catch yourself writing `setStep(` inside a component, you've re-invented the soup.

**Keep machines small and compose.** Cart contents are not checkout state; session auth is not onboarding state. Machines that know everything rot like their boolean ancestors — just grander.

**Test the machine, not the pixels.** Transition tests are trivial to write (given state X, event Y, expect state Z and effect A) and cover the personality of the flow. On [product engagements](/services/product) we require them; a checkout without transition tests is a checkout with a filing date.

## When not to bother

Honesty section: a linear three-page form with no branching, no async decisions, and no back-editing is fine as `step + 1`. The machine tax — modelling time, ceremony — is real and we don't pay it on trivia. Our heuristic: the moment a flow gains a conditional step, an async gate (payment, verification, availability), or an edit-from-review requirement, boolean modelling has already cost more than a machine would. And the moment a second developer must understand the flow from code alone, the machine is documentation that cannot drift out of date.

## Key takeaways

- Boolean-based flows represent 2ⁿ states when only a handful are meaningful; every impossible state is an unfiled bug.
- An explicit machine (states, events, transitions) makes unpermitted paths unrepresentable — flow bugs vanish structurally rather than being patched.
- Model async gates as states (`authorising`, `confirming`); that's where double-submits and race-condition charges die.
- Map states to URLs: the back button becomes specified behaviour, and consent/audit trails fall out of the transition log.
- Instrument transitions, never renders — funnel analytics become trustworthy by construction.
- Start with a switch statement; graduate to XState when you need nesting, async actors, or the stakeholder-converting diagram.

## FAQ

**Isn't this over-engineering for a simple wizard?**

For a truly simple wizard — linear, synchronous, disposable — yes, and we say so above. The trap is that flows earn complexity over their lifetime (a retry path here, a regional step there) and the rewrite happens at the worst time, under incident pressure. Our rule: when the second conditional arrives, spend the half-day converting. It's cheaper then than after the double-charge postmortem.

**How do state machines coexist with React Query / server state?**

Cleanly, if you respect the boundary. Server-state libraries own *data fetching and caching*; the machine owns *flow position*. The machine invokes an actor; the actor uses your query client; results come back as events. What you must not do is let query `status` double as flow state — "user is on the payment step because a mutation is pending" is boolean soup wearing a nicer hat.

**Do state machines work with multi-page, server-rendered flows?**

Yes — the states just persist in the URL and session instead of memory, and each page load reconstitutes the machine at the right state. That's the telehealth pattern: named states stored server-side, transitions validated on the server, the client machine a projection. You lose some animation fluidity; you gain resumability and an audit-grade trail.

**What does "guards" mean in this context?**

A guard is a predicate on a transition: `CONTINUE` from `delivery` is allowed *only if* a slot is selected. Guards keep validation logic attached to the transition it governs instead of smeared across handlers. Keep guards pure (no side effects, no fetches) — side effects belong to actions on transitions, or your machine becomes as untestable as the component it replaced.

**We have 40 engineers and six flows. Does this scale to a platform?**

That's where it pays most. Shared flow conventions — naming, actor patterns, transition logging — mean a checkout engineer can read the onboarding machine cold. We saw this at a utility client: incident reviews stopped being oral-history sessions because the diagram *is* the flow. The scaling hazard is over-centralisation (one mega-machine), which is why we compose small machines and give each a single owner.
