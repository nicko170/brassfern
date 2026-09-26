---
title: "Rate limits are a UX surface, not just middleware"
description: "Rate limiting starts in middleware but ends in the interface. Retry-After contracts, queue positions, backpressure UX and the copy that keeps users calm."
slug: rate-limits-as-ux
cluster: engineering
tags: [api-design, ux, reliability, error-handling]
date: 2026-04-14
author: Felix Brandt
keywords: [rate limiting ux, retry-after header, api error design, backpressure ux, 429 handling]
readingTime: 8
---

Every API you ship has a rate limit, whether or not you designed one. The ones you *didn't* design are enforced by physics: connection pool exhaustion, a Postgres replica melting, a queue that never drains. The designed kind — the token bucket in middleware — is the easy part. The hard part, and the part almost nobody specs, is what the human on the other end experiences when they hit the wall.

We've shipped consumer products where a third of all "something went wrong" support tickets traced back to throttling the user never saw coming. The fix was never raising the limit. It was making the limit *legible*. This is how we think about rate limits as a product surface now, after several bruises.

## The taxonomy of "no"

Before you can design the experience, you need to know which "no" you're saying. In practice there are four, and they deserve different UX:

1. **Steady-state throttling.** Normal traffic management — 600 requests a minute per key. Users should almost never meet this one in a UI-driven product; if they do, your client is polling something it should be subscribing to. That's a bug in your architecture, surfaced as a user problem.
2. **Burst protection.** Login attempts, password resets, checkout submissions. The user absolutely will meet this one, and it's *supposed* to be met — it's protecting them or protecting you.
3. **Capacity shedding.** You're overloaded and turning people away to save everyone else. This is a degraded-mode decision, and it belongs in the same conversation as [error boundaries and graceful failure](/journal/engineering/error-boundaries-resilient-ui).
4. **Abuse containment.** Bots, credential stuffing, scraping. This user is not owed a good experience, but the false positive on your limiter is a real user who is, and they arrive wearing exactly the same HTTP response.

Collapses in trust happen when these four get one shared code path and one shared message. "Too many requests" after a failed login and "too many requests" during a traffic spike are different conversations.

## A contract, not a shrug: the Retry-After discipline

The single highest-leverage thing you can do is commit to honest `Retry-After` values — and surface them. A `429` without a `Retry-After` is a shrug with a status code. The client has two options: retry immediately (making the problem worse) or guess.

Our rules on API projects:

- **Always send `Retry-After`**, in seconds, on every 429 — even when you send `503` during shedding. If your limiter knows when the bucket refills, you know. Say it.
- **Human-readable echoes in the body.** The response body carries a machine field and a human sentence: `{ "retryAfterSeconds": 42, "message": "Try again in about a minute." }`. The sentence gets written by a content designer, not by `printf`. The visual side of this messaging patterns our notes on [empty, loading and error states](/journal/web-design/empty-loading-error-states).
- **Never lie to be kind.** If it says a minute, it must be a minute. Nothing teaches users to hammer the retry button like dishonest countdowns.
- **Use `429` for limits, `503` + `Retry-After` for capacity.** Conflating them makes your observability useless — you can't tell "the product is popular in a healthy way" from "we are on fire."

On the client, honour the header. We keep a small `retryWithAfter()` helper that reads `Retry-After`, respects a maximum of three attempts with jittered exponential backoff as a fallback, and reports every exhausted retry to telemetry. If you can't trust the server's number, fail closed: back off, don't blast.

## Backpressure UX: what the screen does while it waits

A throttled user staring at a frozen screen assumes the app died. A throttled user watching a countdown assumes the app is *working on it*. The difference is entirely legibility, which is why this is a design decision and not an infrastructure afterthought. It sits comfortably next to your [perceived-performance](/journal/web-design/perceived-performance-design) work — a wait you explain always feels shorter than a wait you don't.

Patterns that have earned their place in our builds:

**The inline countdown.** For burst protection on writes — resending a magic link, retrying a payment — the button disables itself and becomes the message: "Resend available in 0:47". It uses the server's number, renders in place, never navigates. Notice it doesn't say "Don't spam us"; it says when.

**Queue position when there's a queue.** During genuine capacity events — a ticket onsale, a launch spike — honesty about position beats false speed every time. "You're 1,240 in line" with a moving number converts rage into patience, because motion is evidence. If you can't track position, don't say the word "queue"; say "we're very busy, retrying automatically".

**Degrade sideways, not just slowly.** When the expensive endpoint is throttled, a human-first API gives you a cheap one. On the Quill Legal document platform ([case study](/work/quill-legal-document-platform)), when full-text search hits its burst limit the UI drops to title-only search with a line of brass-italic copy: "Deep search is resting — title matches still work." The user keeps a tool instead of losing a wall.

**Automatic retry, shown.** Silent background retries are lovely until the fifth one. Show the attempt: "Retrying… (2 of 3)". Instantiate the user's anxiety as a bounded number with an end.

## Preventing the collision in the first place

The best rate-limit UX is the one nobody triggers, because the client understood the shape of the API. This is the same philosophy as [designing APIs frontend teams love](/journal/engineering/api-design-frontends-love): limits are part of the interface contract, so publish them like one.

- **Return limit headers on every response**, not just failures: current window, remaining, reset. Clients can self-throttle before they ever see a 429 — a tiny piece of middleware that pays for itself in the first traffic spike.
- **Design the client to be cheap.** Debounce search-as-you-type, batch up autosaves, use conditional requests (`ETag`/`If-None-Match`), prefer subscriptions over polls for live data. On one dashboard rebuild, swapping a 5-second poll for a server-driven update channel removed 94% of API calls — the "rate limit problem" evaporated.
- **Different shapes, different buckets.** Reads, writes and expensive operations (exports, reports, AI calls) each get their own limit. A user generating a report should never lock themselves out of viewing one.

## The copy is an apology with a plan

Throttling copy fails in three predictable ways: it blames the user ("You've exceeded your limit"), it's cowardly ("Something went wrong"), or it's technical cosplay ("HTTP 429 rate_limit_exceeded"). Good throttling copy is an apology with a plan attached:

> Fewer than ten requests in a minute is normal for a person. This limit protects everyone's account. You can try again in about a minute — nothing you entered has been lost.

Note what it does: normalises the user, explains the *purpose*, gives a time, guarantees safety of their work. Four sentences, zero jargon. Write this copy in the same sprint you write the limiter, review it in the same critique as the happy path, and make sure every limit in the product has one. An undocumented limit with default copy is a design decision nobody admits they made.

## Key takeaways

- You already have rate limits. The question is whether you designed the experience of hitting them.
- Separate the four kinds of "no" — throttling, burst protection, capacity shedding, abuse — and give each its own UX and copy.
- Always send `Retry-After`, always honour it on the client, and never let a countdown lie.
- Show waits as bounded and moving: countdowns in place, queue positions when real, attempt counters when retrying.
- Publish limits in headers on success responses so good clients self-throttle; make the client cheap so users never meet the wall.
- Throttling copy is an apology with a plan: normalise, explain the purpose, name the time, guarantee their work is safe.

## FAQ

**Should users ever see the number 429?**
No. The status code is a contract between machines; the human gets a sentence with a time in it. The one exception is genuine abuse surfaces — you don't owe a scraper a roadmap.

**What's a sane retry ceiling for UI clients?**
Three attempts, exponential with jitter, capped around 30 seconds — then stop and hand over a manual retry with a clear escape hatch (download the data, switch to a degraded mode). Infinity loops turning failed mutations are how you corrupt state.

**How do we rate-limit AI features, which are slow and expensive?**
Bucket them separately from everything else, limit *token* throughput rather than request count, and design for the wait as a first-class state — streaming, progress, and honest "busy" copy. AI features are [a product surface of their own](/services/ai), not a detail in the limiter config.

**Is a queue page overkill for a small product?**
Usually yes. Queue pages pay off at true burst events — onsales, drops, launches. Below that scale, a `Retry-After`-honest countdown with automatic retry is calmer and cheaper than theatrical waiting rooms.
