---
title: "Service workers: an honest production guide"
description: "Service workers are the most powerful and least forgiving API in the browser. Cache strategies by content type, update flows, offline fallbacks and production debugging."
slug: service-workers-honest-guide
cluster: engineering
tags: [service workers, offline, pwa, caching, performance]
date: 2026-02-19
author: Tomás Reyes
keywords: [service workers, offline first, PWA caching strategies, workbox alternatives, cache API production]
readingTime: 10
---

The service worker tutorial version of reality goes like this: register, precache, cache-first everything, your app works offline, applause. The production version goes like this: a stale bundle serves old JavaScript against a new API for three weeks, a user's cart silently points at a deleted product, and the fix command your support team learns is "clear site data". Service workers are the most permanence you can install in a user's browser short of malware, and they repay exactly the effort you put into lifecycle discipline.

We ship them where they genuinely earn their complexity — field tools, conference apps, [data-heavy dashboards](/work/harvest-loop-food-rescue) used in warehouses with bad wifi — and we don't ship them where a good [HTTP caching strategy](/journal/engineering/caching-strategy-content-sites) already does the job. (Content sites: that's you. A marketing site with a service worker is a liability cosplaying as a feature.) For everything in between, this is the guide we hand to teams — strategies by content type, the update flow that doesn't strand users, offline states with dignity, and how to debug the thing nobody can see.

## First, the honest prerequisites

Two decisions before any caching strategy. **Do you need offline at all?** Offline capability is a product feature with a support surface, not a free upgrade. If the honest answer is "it would be nice", skip the precache and keep a read-through runtime cache only.

And **do you need a framework wrapper?** Tools like Workbox are excellent until your caching needs get opinionated, at which point you're debugging a code generator's idea of your intent. For apps with small, well-understood caching surfaces — which is most apps that need service workers — hand-rolled fetch handlers are shorter than the configuration that reproduces them, and the code you write is the code you debug at 2am. Choose the wrapper only when the matrix of strategies is genuinely large.

## Cache strategies by content type, with names

The mistake is choosing one strategy for the app. The craft is per-content-type:

- **App shell / static assets (hashed): cache-first, immutable.** Vite-style content-hashed bundles are the easy case — cached forever, updated by URL change. Verify the hash is genuinely in the filename before you trust this; a "hashed" build that isn't has ruined at least one launch of our acquaintance.
- **HTML documents: network-first with a tight timeout.** For navigation requests, race the network against a ~3–4 second timeout, fall back to cache, and *always* version entries by deployment. Stale HTML serving a new API is the classic production incident.
- **API reads: stale-while-revalidate, with per-endpoint max age.** Serve cache instantly, update in the background — for reference data, catalogues, anything where ten-minute staleness is tolerable. Critical: only cache GETs, honour per-endpoint freshness, and never cache authenticated endpoints into a cache your logout flow can't reach to clear.
- **API writes: never cache, always queue.** Mutations over a service worker belong to the sync-engine world — background sync, outbox tables, conflict logic. If you need that, you need the whole discipline of [offline-first sync engines](/journal/engineering/offline-first-sync-engines), which is a bigger commitment than a service worker alone.
- **Media and images: cache-first with an LRU cap.** Unbounded image caches are how a service worker quietly fills a user's disk quota until the browser evicts the entire origin — including your lovingly precached shell. Cap entries and size; evict least-recently-used; the browser will still evict you eventually, so nothing cached is load-bearing.

Prefix cache names with the app and version (`app-static-v14`, `app-pages-v14`) so the update flow can garbage-collect cleanly. A cache named `my-cache` is a cache you'll be afraid to delete forever.

## The update flow: where users get stranded

The service worker lifecycle — install, wait, activate — exists to keep multiple tabs in sync, and it will strand users if you handle it carelessly. The production pattern that works:

1. **New worker installs, enters "waiting". Never auto-`skipWaiting` on every update** — you'd swap code under running tabs and their lazy-loaded chunks can 404 into white screens.
2. **Show the user an affordance instead:** a quiet toast, "A new version is ready — refresh". One `controllerchange` listener reloads *once* when the user clicks it. Version-locked apps (banking, healthcare tools) may force this on the next navigation; consumer apps can wait politely.
3. **If you do `skipWaiting` in the worker, pair it with `clientsClaim()` and a deploy strategy that keeps old asset URLs alive** for one release window, so old tabs can finish gracefully. Deleting last deploy's hashed assets the moment the new one ships is self-inflicted.
4. **Garbage-collect old caches on `activate`** by deleting every cache not in your current prefix list.

The test that catches lifecycle bugs: two tabs open, deploy a new version, click around both. Run it on every release until it bores you.

## Offline fallbacks with dignity

The offline experience is a designed state, not an error. Minimum viable dignity:

- **An offline page** that matches the app's voice, explains what happened, and offers the one useful thing available offline (cached reads, a queue summary). It should be precached *first*, because if it's not, its absence is discovered at the worst moment.
- **Connectivity is not a boolean.** `navigator.onLine` lies happily on captive portals and flaky cells. Treat failure of the actual request as the source of truth; use "last synced at" timestamps in the UI rather than a green dot of fiction. The honest-versioning instincts from [frontend observability](/journal/engineering/frontend-observability-small-teams) apply: surface staleness to the user before they act on it.
- **Failed mutations get queued, visibly.** "Your note will save when you're back online" with a pending indicator beats silent loss or a dead button. Anything more sophisticated is sync-engine territory — read the [local-first piece](/journal/engineering/local-first-sync-engines) before committing to conflict resolution.

## Debugging in production: the invisible layer

Service workers fail invisibly between your code and the network, so debugging needs its own kit. In development: the Application panel is home — inspect registered workers, caches and storage; "Update on reload" and "Bypass for network" save hours; and *never* test updates only with "Update on reload" enabled, or you'll ship a flow you've never actually run. In production: log lifecycle events (installed, waiting, activated, caches deleted) into your existing telemetry — they're non-PII operational events and they're the difference between "users report weirdness" and knowing the version mix in the wild. Keep a documented kill command: an unregister-and-clear endpoint or page support can link to, tested, because the day you need it is not the day to write it.

## Key takeaways

- Service workers are product features with support surfaces; content sites should usually stop at good HTTP caching.
- Strategy per content type: shell cache-first, HTML network-first with timeout, API reads SWR with max-age, writes never cached, media LRU-capped.
- Version-prefixed cache names and activation-time garbage collection or nothing ever gets deleted.
- The update flow is user-facing design: waiting-worker toast, one controlled reload, old assets alive for a release window.
- Offline is a designed state: precached fallback first, request failure as connectivity truth, visible mutation queues.
- Log lifecycle events to production telemetry and maintain a tested kill switch.

## FAQ

**Should every PWA install use a custom offline page per route?** No — one well-crafted offline shell plus per-feature handling of what breaks. Per-route offline pages is maintenance fiction.

**iOS Safari — still a problem?** It's the constraint that defines your architecture: storage eviction is aggressive, background sync support is partial, and cache size limits are tighter. Design for eviction (nothing cached is load-bearing), test on real hardware, and make peace with "offline, mostly".

**How does this relate to the Baseline discussion?** The platform keeps absorbing service-worker use cases piecemeal — better HTTP caching, speculation rules for instant navigations. Worth reading our [Baseline 2026](/journal/engineering/web-platform-baseline-2026) notes before deciding what you still need a worker for.

**Where does this fit in an engagement?** Usually inside [product design & engineering](/services/product) work on tools with hostile-network users. The deliverable includes the strategy matrix, the lifecycle flow, the telemetry and the runbook — the code is the easy third.
