---
title: "WebSockets vs SSE: a realtime guide without religion"
description: "An honest guide to realtime transport: WebSockets vs SSE vs polite polling. Lifecycle, reconnection with backoff, presence, scaling and mobile battery realities."
slug: websockets-vs-sse-realtime
cluster: engineering
tags: [websockets, server-sent events, realtime, architecture, typescript]
date: 2026-07-30
author: Tomás Reyes
keywords: [websockets vs sse, server sent events, realtime web architecture, reconnection backoff]
readingTime: 12
---

Every realtime architecture discussion eventually reaches the same pointless argument: WebSockets are "real engineering," SSE is "a hack," polling is "something to apologise for." None of this survives contact with a shipped product. We run all three in production across client work — a live order-ticker in a [podcast network player](/work/signal-and-noise-podcast-network), presence in a kanban tool, progress events during AI generation — and the honest answer is that transport choice is a boring, context-dependent decision. Which is good news: boring decisions are the ones you can get right every time.

This is the guide we wish we could hand to every team before the religious war starts: what each option actually is underneath, a reconnection implementation that doesn't embarrass anyone, the scaling and battery notes nobody mentions, and the decision table we use on real projects.

## What you're actually choosing

Strip the branding and the three options differ on exactly four axes: **direction** (server→client only or both), **transport friction** (proxies, firewalls, CDNs), **built-in resilience**, and **operational shape** (what your infrastructure team has to hold).

**Server-Sent Events** is HTTP. One request, `text/event-stream` response, server writes events down a held-open connection. Because it's plain HTTP, everything the web already knows applies: it passes through proxies and CDNs, it compresses, it works over HTTP/2 with multiplexing, it has a built-in retry protocol (`retry:` field, `Last-Event-ID` for resume), and the browser's `EventSource` reconnects automatically. One-way only — the client talks back with ordinary fetches, which for a shocking number of products is all they need.

**WebSockets** is a protocol upgrade: one HTTP handshake, then a persistent full-duplex frame channel. Genuinely bidirectional with low per-message overhead, binary-capable, and the only choice when the *client* streams too. The costs are operational, not ergonomic: it bypasses a lot of HTTP middleware (auth at the edge, caching semantics, some WAF defaults), load balancers need explicit upgrade handling, and you own reconnection, heartbeats, and message framing yourself. All solvable; none free.

**Polling** is a loop. And here's the heresy: for intervals above 30 seconds with tolerant freshness requirements — "is my export ready," "any new notifications" — a well-mannered poll with proper caching headers is simpler, cheaper per message, and easier to scale than either persistent connection. The sine qua non is *politeness*: conditional requests, long intervals, and silence when the tab is hidden.

## The decision table we actually use

| Need | Default choice | Why |
| --- | --- | --- |
| Dashboard ticks, activity feeds, notifications | SSE | One-way, auto-reconnect built in, survives corporate proxies |
| AI token streaming, progress events | SSE | Generation is server→client; cancel via fetch/abort |
| Collaborative editing, cursor presence, whiteboards | WebSocket | High-frequency client→server; CRDT/ops need two-way |
| Multiplayer games, voice/video signalling | WebSocket | Latency + bidirectional + binary |
| Server-driven UI with client actions | Either | Frequency of client chatter decides it |
| Background sync, "check again later" | Polling | No connection to babysit; cache-friendly |
| Mobile-first, battery-sensitive | SSE or polling | Radio wakeups are the real budget |

Two heuristics cover most grey zones. **Follow the chatter:** count messages per direction per minute. If the client says more than a few things a minute, WebSocket; if the client is nearly silent, SSE. **Follow the infrastructure:** if your platform team is two people and a CDN subscription, HTTP-shaped things (SSE, polling) cost less sleep. If you already run stateful services and a socket layer, bidirectional isn't the stretch it once was.

## Presence is a product decision, not a transport one

The most common trap: teams pick WebSockets "because we need presence," then discover presence is a *system*, not a socket. A connection tells you a tab is open; it does not tell you a human is attentive. Tabs freeze, laptops close mid-ping, and the mobile browser on a train is Schrödinger's user. Real presence needs heartbeats, per-device (not per-user) tracking, last-seen timestamps, and UI that degrades gracefully from "online now" to "active 20m ago." Build that state layer once, transport-agnostic, and it serves whether your pipe is SSE or WebSocket — the transport is replaceable, the presence model is the asset.

## Reconnection that doesn't embarrass anyone

Whatever you choose, connections die. Trains exist; laptop lids close; load balancers drain. The implementation we reach for handles three things: capped exponential backoff with jitter (avoiding the thundering-herd reconnect that takes your server down precisely when it's struggling), state reset on the `visibilitychange` event (mobile browsers kill sockets invisibly), and an explicit "offline" UI affordance the user can see. Here's the shape of it in TypeScript:

```ts
// reconnect.ts — capped backoff with jitter; works for WS or SSE
type Handlers<T> = {
  open?: () => void
  message: (data: T) => void
  offline?: (offline: boolean) => void
}

export function liveChannel<T>(connect: () => void, h: Handlers<T>) {
  let attempt = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let closed = false

  const wait = () =>
    Math.min(30_000, 1000 * 2 ** attempt) * (0.5 + Math.random() / 2)

  const fail = () => {
    if (closed) return
    h.offline?.(true)
    timer = setTimeout(tick, wait())
    attempt++
  }

  const tick = () => {
    if (closed || document.hidden) return
    connect() // on open: attempt = 0; h.offline?.(false); h.open?.()
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && attempt > 0) { attempt = 0; tick() }
  })

  tick()

  return {
    fail,                 // call from onclose/onerror (unless clean close)
    close() { closed = true; clearTimeout(timer) },
  }
}
```

The subtleties worth copying: **jitter is not optional** — a million clients reconnecting on identical backoff curves will DDoS you with mathematical precision. **Distinguish clean closes** (server said goodbye on purpose; respect it, don't reconnect) from deaths. And **surface the state**: a stale dashboard that looks live is worse than one that admits it's offline. We treat that banner as part of the [empty, loading and error states](/journal/web-design/empty-loading-error-states) that carry user trust — realtime UI without an offline state is a lie with a spinner.

## The scaling notes nobody puts in the talk

**Sticky sessions will find you.** Both transports pin a user to a process. With multiple nodes you need either sticky load balancing (brittle under deploys) or a shared pub/sub layer (Redis, NATS) so any node can reach any client. Budget this before launch day; "works on my single-node staging" is the canonical epitaph.

**File descriptors and idle connections.** A hundred thousand mostly-silent connections is a real workload: kernel limits, load balancer idle timeouts (ALBs idle-out at 60s by default — heartbeat under that), and proxy buffering settings (`X-Accel-Buffering: no` is the classic SSE debugging rite of passage).

**HTTP/2 changes the SSE calculus.** The old "six connections per host" browser limit applies to HTTP/1.1 SSE only. Over H2 every tab gets a connection and streams multiplex, so the "SSE wastes connections" objection is mostly a decade out of date. Worth verifying your CDN terminates H2 end to end.

**Mobile radios are the real cost centre.** Each message wakes the modem. Persistent chatty connections on cellular drain batteries and get apps killed by the OS. On mobile we heart-beat gently (30–60s), batch updates, and respect `navigator.connection` when it exists. The kanban client that pings presence every five seconds is a battery report away from a one-star review. This is one place "the fastest code is the code that doesn't run" meets "the greenest packet is the one you never send" — performance is carbon, as our climate work with [Meridian](/work/meridian-climate-data-explorer) kept reminding us.

**Auth and expiry.** Tokens expire during long-lived connections. Decide whether an expiring JWT kills the socket (simple, harsh) or you support re-auth on the existing connection (kind, more code). For SSE, cookie-session auth often works where WebSocket's handshake needs a token in the subprotocol or query — and tokens in URLs end up in logs, which is exactly why our [URL discipline](/journal/engineering/url-as-state-management) forbids them there.

## What we ship, in practice

Answering with our receipts: the [Northwind Ledger](/work/northwind-ledger-dashboard-rebuild) dashboard ticks over SSE (server→client updates, CDN-friendly, boring and solid). Our collaborative planning tools run WebSockets behind a pub/sub layer with the reconnect logic above. Everything that can tolerate thirty seconds of latency polls with `ETag`s and sleeps when the tab hides. In each case the transport was a Tuesday decision, made from the table, and none has needed revisiting. That's the real goal. Realtime is a feature of your product, not a personality of your stack — choose the dullest option that satisfies the frequency and direction, then spend your creativity where users can actually see it.

## Key takeaways

- Transport choice turns on direction, infrastructure shape and message frequency — not ideology.
- SSE: HTTP-native, auto-reconnecting, proxy-friendly; the default for server→client streams including AI token streaming.
- WebSockets: earn their complexity when the client chatters, latency matters, or payloads are binary.
- Polling above ~30s intervals with conditional requests is a legitimate, cache-friendly architecture.
- Presence is a product layer (heartbeats, per-device state, honest degradation), independent of the pipe.
- Reconnection needs capped exponential backoff *with jitter*, visibility-change handling and a visible offline state.
- Plan for sticky-session and heartbeat constraints before launch; on mobile, the radio is the budget.

## FAQ

### Is SSE fine for streaming LLM tokens to the browser?

Yes, and it's our default. Generation is a server→client stream, SSE plays beautifully with proxies and serverless HTTP, and cancellation is just aborting the fetch if you use a fetch-based SSE reader. The main gotcha is buffering — some proxies and frameworks buffer event-stream responses unless you set the right headers. Test through your actual CDN, not just localhost.

### When is polling genuinely the right answer?

When updates are sparse, freshness tolerance is 30 seconds or more, and operational simplicity is worth more than millisecond latency: status pages, export completion, notification badges. Conditional GETs with `ETag` make empty polls nearly free, and there is no connection lifecycle to babysit at 2am. If a well-cached poll answers the user's question, the socket is vanity.

### How do WebSockets and SSE behave through corporate proxies and firewalls?

SSE rides ordinary HTTPS and almost always survives. WebSocket's upgrade handshake occasionally meets a proxy that doesn't understand it, strips it, or buffers badly — the classic symptom is a socket that works at home and dies on a client VPN. Mitigations: always `wss://`, keep the fallback path (SSE or polling) alive, and test from the most cursed network your users actually have.

### Should we just use a managed realtime provider?

Often, yes — if realtime is a feature and not your product's core, paying a provider to absorb connection lifecycle, fan-out and global edge presence is frequently cheaper than your engineers' 2ams. Keep the abstraction honest: own your message schema and presence model, treat the provider as the replaceable pipe, and you keep the exit cheap if you outgrow the pricing.
