---
title: "Background jobs: boring patterns that save your weekend"
description: "Queues vs cron, idempotency, dead-letter queues and backpressure — the boring background-job patterns that keep small teams asleep at 3am."
slug: background-jobs-small-teams
cluster: engineering
tags:
  - backend
  - reliability
  - architecture
  - queues
date: 2026-01-22
author: Felix Brandt
keywords:
  - background jobs
  - job queues
  - idempotency
  - reliability engineering
readingTime: 12
---

Every small team eventually discovers the same truth about production, usually at 3am: the request-response cycle is the easy part. The 400ms web request gets all the conference talks. Meanwhile, the invoice email that never sent, the image that never resized, and the webhook your partner retried nine times are quietly composing your weekend.

Background jobs are where correctness lives in most real applications, and yet teams treat them as an afterthought — a `setTimeout` in a worker, a cron that everyone forgot runs, a hand-rolled queue table with a `WHERE processed = false` that nobody monitors. This article is the set of patterns we install on every Brassfern backend, refined across fintech, health, and e-commerce builds. None of it is clever. All of it is why our phones stay quiet.

## Cron vs queue: the first fork

The first decision is where the job lives, and the honest answer is "both, for different things."

**Cron is for schedules.** "Every night at 2am, recompute the digest." "Every Monday, email the weekly report." Cron's superpower is that nothing needs to happen to trigger it — it fires because time passed. That's also its failure mode: if the machine is down at 2am, the digest never recomputes, and unless you built monitoring, nobody notices until a user does. Cron jobs must therefore be **re-runnable**: tonight's job computes "yesterday" from the clock, so running it twice at 2am and 2:15am, or manually at 9am after an outage, produces the same result. Never let a cron job depend on having run the previous night. The moment your daily job is stateful, you have a delivery guarantee problem wearing a scheduling costume.

**Queues are for events.** "A user signed up → send the welcome email." "A payment cleared → generate the receipt." Queues decouple the event from the work, which buys you three things at once: the web request gets faster (the email is not its problem), the work survives process restarts (it's a row, not a call stack), and failures become retryable (the job is still there). The moment the request handler starts doing slow or fallible work inline — PDF generation, third-party API calls, anything with "send" in the name — that's a queue job auditioning for the role.

The heuristic we teach: **if the user is staring at a spinner waiting for it, consider doing it inline; if they'd never know whether it happened this second or in thirty, it belongs in a queue.** "Consider," because waiting for a user matters to UX — but the invoice email does not belong on the critical path of the checkout response.

## Idempotency: the one rule that matters

Retry is not optional in background work. Networks fail. Workers get OOM-killed mid-write. Providers time out after having done the thing. The only sane response is "run it again" — which means **every job must be safe to run twice.** This single property, idempotency, outranks every other design decision.

Concretely:

- **Idempotency keys on mutation.** Queue jobs that call external APIs carry a stable key derived from the intent (`invoice_4829_email_v3`), not from the attempt. Stripe-style providers honour these; for providers that don't, you key your own dedupe table on it. A job that charges without a key will eventually charge twice. It's not a question of if.
- **Jobs check their own preconditions.** The welcome-email job checks whether the welcome email was already sent — not to be defensive, but because "was this done?" must be decidable from data, not from the job's memory of running. This is the same reason we like [shared validation contracts](/journal/engineering/schema-validation-shared-contracts): truth lives in the schema and the row state, never in the code path's recollection of itself.
- **Delivery is at-least-once; act accordingly.** Pub/sub, queues and webhooks all offer "at-least-once" in practice whatever their marketing says. Design for duplicates at the handler level and the delivery semantics stop mattering.

The test we run during review: "Describe what happens if the worker crashes at every line of this handler." If any answer is "the thing half-happens and nobody can tell," the handler is not done.

## Dead-letter queues: the graveyard that talks back

A job that fails ten times has stopped being a retry candidate and started being a signal. Dead-letter queues (DLQs) are where exhausted jobs go, and small teams get them wrong in a specific way: they have one, and nobody ever looks at it.

A DLQ that isn't consumed is a bug museum with no visitors. The pattern that works is small and stern:

1. **Bounded retries with backoff.** Five attempts, exponential, jittered — then dead-letter. Retry storms against a downed provider are how a hiccup turns into a self-DDoS, so the backoff must be real seconds, not busy loops.
2. **The DLQ pages a human.** Not per job — a threshold. One dead invoice email is a shrug; fifty in an hour is a provider outage. Alert on the *rate* of dead-lettering, not the existence. This is the same principle as our [frontend observability practice](/journal/engineering/frontend-observability-small-teams): surface deltas, not dashboards nobody reads.
3. **Replay is a first-class operation, not a console incantation.** There's a button or a CLI: `queue:d replay <dlq> <job-id|all>`. Half the value of the DLQ is that jobs in it are *replayable* — which they only are because you made them idempotent. See how it all hangs together.
4. **Dead letters carry their story.** The payload, the attempt history, the last error, and the version of the code that failed. A dead letter without context is archaeology; with context, it's a bug report that wrote itself.

## Backpressure and the virtue of small batches

Queues hide load until the day they don't. A marketing send to 200,000 subscribers, enqueued naively as 200,000 jobs at once, will punish the database, the provider's rate limit, and your retry budget simultaneously.

The boring fixes:

- **Producer-side batching.** The newsletter job enqueues "send batch 1 of 400" rather than two hundred thousand individual jobs. Fewer jobs mean less queue overhead, less connection churn, and a natural pause point between batches where you can check provider health.
- **Concurrency caps per queue.** Our email queue runs at a concurrency chosen *against the provider's rate limit*, not against our CPUs. Most queue libraries make this a one-liner. It's the single most-skipped configuration in small-team infrastructure.
- **Priority lanes, honestly maintained.** Password-reset emails jump the newsletter queue. Once you have priority lanes, the temptation to add tiers grows — resist until the day an actual incident forces the issue. Lane surgery under pressure is miserable; two lanes ("time-sensitive" and "everything else") covers nearly every real product.

One more quiet pattern: **jobs in hot paths carry a deadline.** A receipt email that hasn't sent in ten minutes isn't worth sending an hour later — it's worth dead-lettering and alerting, because something is deeply wrong. Time-to-live on jobs turns "the queue is mysteriously enormous" into "the queue is loudly enormous in the way we get paged for." Enormity you can page on is a feature. The same instinct governs how we run [zero-downtime migrations](/journal/engineering/zero-downtime-postgres-migrations): fail fast, fail loud, recover cheaply.

## The 3am audit

Before any system ships, we walk this checklist. It's short because checklists that sprawl get skipped — the same discipline we apply to our [testing strategy](/journal/engineering/testing-strategy-that-scales).

1. Every job is idempotent — crashable at any line, rerunable at any time.
2. Every mutation against an external system carries an idempotency key.
3. Retries are bounded, backed off, and land in a monitored DLQ.
4. Producer throughput and worker concurrency are chosen against the slowest downstream, not the fastest local resource.
5. Every scheduled job is re-runnable and self-dating — it computes its window from the clock.
6. There's exactly one way to replay dead letters, and every on-call person has run it once on stage.
7. Queue depth is a graphed, alerted metric — for every queue, not just the one that hurt you last.

Seven lines. In ten years of studio work, every 3am page we've had about background jobs traced back to a skipped line on this card.

## Key takeaways

- Cron is for schedules, queues are for events. Schedule-jobs must be re-runnable; event-jobs must be idempotent.
- Idempotency is the whole game. At-least-once delivery is a fact of life, so handlers must be safe to run twice — design for duplicates, not around them.
- Retry bounded and jittered, dead-letter what exhausts retries, and alert on DLQ *rate*, not on single failures.
- Set concurrency against your provider's rate limit, batch producers, and give jobs deadlines so the queue fails loudly instead of enormously.
- Make replay a real operation with a button or CLI. A DLQ nobody can replay into is an archive, and an archive nobody reads is fiction.

## FAQ

**Which queue should a small team actually use?** The one that matches your existing infrastructure. A Postgres-backed queue (a table plus a worker) is genuinely sufficient for most small products — you already run Postgres, you already back it up, and 10,000 jobs a minute is well past most products' needs. Graduate to Redis-based queues or a managed service when you have a team member who has operated them, not before.

**Isn't "just make it idempotent" hand-waving the hard part?** It's the part worth doing hard. The pragmatic order: start with the money jobs and the email jobs — payments, receipts, onboarding — because duplicates there are user-visible harm. Harmonise everything else over time. Perfect idempotency coverage isn't required to sleep well; *coverage of what hurts when duplicated* is.

**How many background workers is enough?** Start with one per queue, a concurrency cap, and a queue-depth alert. Add workers when the depth trend, not the day, says so. Most "we need more workers" incidents are actually "our retry storm is eating the worker pool," and more workers make that worse.

**Do serverless functions change any of this?** They change where the worker runs, not whether the work is reliable. Idempotency, bounded retries, dead-lettering and backpressure all still apply — you're paying someone else to run the process that can still crash at any line.

---

*Reliability like this is what we build into every [product engagement](/services/product) from week one — [see how we work](/approach), or [tell us what keeps you up at 3am](/contact).*
