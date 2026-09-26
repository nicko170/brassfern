---
title: "Errors are design material: engineering graceful failure"
description: "Failures are part of the product, not exceptions to it. Typed errors, retry policies, circuit breakers and writing the failure copy in the same sprint as the happy path."
slug: errors-as-design-material
cluster: engineering
tags: [error-handling, reliability, ux, typescript]
date: 2026-06-02
author: Tomás Reyes
keywords: [error handling design, typed errors typescript, retry logic circuit breaker, graceful degradation ux, resilience engineering]
readingTime: 9
heroImage: /images/articles/engineering/errors-as-design-material.jpg
heroAlt: "A cracked cream ceramic tile repaired with brass seams, beside a pressed fern frond and a machinist's ruler on warm paper."
---

Every product team's design system has a tokens file, a type scale and a button hierarchy, and almost none of them have an error taxonomy. Which is strange, because the failure states are where your product's personality shows under stress — and users judge software the way they judge people: not by the staircase, but by what happens when someone trips on it.

"Errors as design material" isn't a metaphor we use for warmth. It means failure modes get designed, specced and reviewed with the same rigour as the happy path: typed at the boundary, retried by policy instead of hope, decomposed by circuit when things get bad, and written by an actual writer while the feature is still being built. This is the system we run, assembled from the times we got it wrong in production.

## Start with a taxonomy, not try/catch

The most common error-handling failure isn't technical; it's vocabulary. When everything is "an error", everything gets one message and one policy. We classify failures along two axes before writing any handling code:

**Recoverable vs terminal.** Recoverable: transient network blips, conflicts resolvable by merging, limits with a known retry time. Terminal: malformed input, missing permissions, resources that are gone. Recoverable errors deserve automation (retry, queue, reconcile); terminal errors deserve a decision (fix the input, ask for access, accept the data loss).

**User-caused vs system-caused.** User-caused errors belong *in the flow* — inline validation, undo, confirmation dialogs. System-caused errors belong *above* the flow — toasts, banners, fallbacks. The crime to avoid is punishing the user for systemic failure with modal dialogs, or punishing the system for user error with five silent retries of a permanently malformed request.

Out of the four quadrants fall four components, four default copies, four telemetry labels. The taxonomy is a page in the design system, next to the button specs. Once it exists, design reviews get sharper: "which of the four is this?" is a question with an answer.

## Typed errors: make failure a value

Catch blocks receive `unknown` for a reason: thrown exceptions are a control-flow panic, not information. For anything a user might see, we return errors instead — a discriminated union that the UI can pattern-match:

```ts
type SaveResult =
  | { ok: true; document: Document }
  | { ok: false; kind: 'conflict'; theirs: Document }
  | { ok: false; kind: 'validation'; fields: FieldError[] }
  | { ok: false; kind: 'network'; retryAfterMs: number }
  | { ok: false; kind: 'unauthorised' }
```

The union *is* the design spec. Each arm maps to exactly one UI outcome — a merge dialog, inline field errors, an automatic retry with a countdown, a sign-in redirect — and TypeScript's exhaustiveness checking means adding a failure mode to the API surfaces every place that fails to handle it. When the compiler draws your error-state inventory for you, failure states stop being discovered in support tickets.

Two discipline notes. Validate at the boundary with your [shared schema contracts](/journal/engineering/schema-validation-shared-contracts), so malformed failure payloads fail as parse errors, not downstream mysteries. And keep the taxonomy shallow: four to seven kinds per domain. Twenty-three error variants is not rigour, it's taxonomy hoarding. In React trees, this pairs with [error boundaries as granularity decisions](/journal/engineering/error-boundaries-resilient-ui): typed results for expected failure, boundaries for genuinely unexpected failure.

## Retry by policy, not hope

Retries are the most misused primitive in frontend engineering. The defaults we ship:

- **Only idempotent-by-design operations retry automatically.** GETs and idempotency-keyed mutations. Never a raw POST that might charge a card twice.
- **Exponential backoff with jitter**, three attempts maximum for interactive flows, with the attempt visible in the UI ("Retrying… 2 of 3"). Forever-polling is a denial-of-service attack on your own servers, launched from your own client.
- **Honour the server's clock.** If the response carries `Retry-After`, use it; we've written about the [UX of rate limits and honest retry contracts](/journal/engineering/rate-limits-as-ux) separately, but the short version is that lying countdowns teach users to hammer buttons.
- **Failures get queued, not dropped, when the user made something.** A draft, an upload, an offline mutation — park it in IndexedDB with a last-attempt timestamp and reconcile when connectivity returns. That path converges with [offline-first sync](/journal/engineering/offline-first-sync-engines): the retry queue is just a very small sync engine.

## Circuit breakers and degraded modes

Retries wear a disguise as resilience. Past a threshold they become cruelty — to your servers, and to the user watching a spinner for ninety seconds. Circuit-breaker thinking, borrowed from backend infrastructure, works beautifully on the client:

After N consecutive failures on a dependency (a flailing suggestions API, a third-party address lookup), the circuit *opens*: the feature announces its own unavailability and switches to its degraded mode. Manual address entry instead of lookup. Cached results instead of live search. The circuit half-opens after a cooldown with a single trial request, and closes when health returns.

The engineering is a hundred lines; the *design* is the product decision of what "degraded" means for each feature, and it only gets made well if it's made before the incident. Degraded modes are the engineering expression of [empty, loading and error states](/journal/web-design/empty-loading-error-states): three states per surface, minimum, designed together.

## The copy is written in the sprint, not the postmortem

"Something went wrong." A whole industry communicating through a shrug. Failure copy has a formula we've refined on every project since the Northwind Ledger rebuild ([case study](/work/northwind-ledger-dashboard-rebuild)), where the accountants taught us what "trust" means to someone whose data is money:

1. **Say what happened**, scoped to what the user was doing: "We couldn't save your invoice." Not "Error 5002".
2. **Say whether their work is safe.** If it is, this sentence comes next, immediately: "Nothing you entered has been lost."
3. **Say what happens now**, with agency: an automatic retry with a visible countdown, a button, or a phone number. "Try again in a minute" is a plan; "please try again later" is a dismissal.
4. **Apologise proportionally.** A dropped autocomplete suggestion merits no apology; a lost draft merits a sincere one and a human contact. Match the grief to the loss.

This copy lives in the design file alongside the happy-path screens, gets critiqued in the same session, and gets localised in the same batch. If your fatal-state copy is being written at 2am during an incident, you are improvising brand voice in front of your most unhappy users.

## Measuring failure like a feature

Finally: errors are design material, so they get metrics. On every significant [product build](/services/product) we track failure surfaces as first-class analytics — not just crash rates, but **recovery rates**: of the users who hit this error, how many completed their task within the session? A save-failure with a working retry has a 96% recovery rate and is roughly invisible. A silent dead-end has a 30% recovery rate and is quietly costing the business every day. That number, reviewed monthly, tells you which failure states deserve design love — which is all of them, but someone's first.

## Key takeaways

- Build an error taxonomy (recoverable/terminal × user-caused/system-caused) into the design system, not just the codebase.
- Return typed errors as values; let the union of failure kinds drive the union of UI states, and let the compiler audit coverage.
- Retry only idempotent operations, exponentially with jitter, honour `Retry-After`, cap attempts, and queue user-created data instead of dropping it.
- Circuit-break flaky dependencies into designed degraded modes — decided before the incident.
- Failure copy has a formula: what happened, is my work safe, what now, proportionate apology. Written in the sprint, by a writer.
- Measure recovery rate per failure surface, not just crash rate. Graceful failure is a retention feature.

## FAQ

**Isn't returning errors-as-values un-idiomatic in JavaScript?**
Idiomatic is what serves the product; `Result`-style unions are now common across the TS ecosystem precisely because thrown exceptions can't be typed. We still throw for programmer errors — the invariant violations that should crash in development. User-facing failure is data, and data should flow through return values.

**How do we decide a retry cap?**
Latency budget of the surface. Interactive flows cap at three attempts and ~10 seconds total, because past that the user has lost the thread. Background sync can afford minutes and dozens of attempts — different surface, different budget, same question.

**Won't degraded modes confuse users more than errors?**
Only if unlabelled. A degraded mode that announces itself ("Live search is resting — browsing your last synced results") reads as competence under pressure. A silently degraded mode reads as data loss.

**Where do circuit breakers live in a small app?**
One module. A `createBreaker(fn, options)` around the flaky dependency with counters and a cooldown is genuinely ~100 lines of TypeScript. The sophistication is the policy, not the machinery.
