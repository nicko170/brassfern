---
title: "GraphQL vs REST, eight years in: a pragmatic retelling"
description: "GraphQL vs REST in 2026, without the zealotry: where GraphQL earned its keep, where it added cost, and the plain-REST setups we'd pick again tomorrow."
slug: graphql-vs-rest-pragmatic
cluster: engineering
tags:
  - api design
  - graphql
  - rest
  - architecture
date: 2026-01-22
author: Felix Brandt
keywords:
  - graphql vs rest
  - api design frontend
  - persisted queries
  - api architecture
readingTime: 10
---

Brassfern shipped its first production GraphQL API in 2018, in the golden age of the hype cycle, when conference talks promised that REST was a legacy disease and the schema was the cure. Eight years later we've built and maintained both styles across roughly sixty client projects, and the honest summary is deeply unsatisfying to partisans of either camp: **GraphQL is a client-coupling solution, and REST is a resource-model solution, and most arguments happen because teams pick one to solve the other's problem.**

Here's the retelling, with the scar tissue.

## Where GraphQL earned its keep

**Many clients, one API.** The canonical win, and a real one. A media client runs a marketing site, an iOS app, an Android app, a TV app and an internal editorial tool off one schema. Each client asks for exactly its shape: the TV app takes seven fields per show, the editorial tool takes forty. Doing this with REST means either an ever-growing `?include=` grammar (a query language with worse tooling and no type system — the worst of both timelines) or per-client BFF services. The schema absorbed the difference instead.

**Tooling that pays rent.** The type system is the product. Generated TypeScript types from schema to component — the same end-to-end discipline we described in [type safety from CMS to component](/journal/engineering/type-safe-cms-content) — killed an entire category of "the API changed and nobody told the frontend" incidents. Codegen, schema linting in CI, breaking-change detection on pull requests: this is the strongest argument for GraphQL and it has nothing to do with over-fetching.

**Federated product surfaces.** For one SaaS client, five internal teams own five subgraphs — billing, identity, projects, reporting, notifications — behind one gateway. Was federation worth its considerable complexity? Barely, yes, at five teams. At two teams it would have been an expensive hobby.

## Where GraphQL cost more than it returned

Now the chapters the talks skip.

**HTTP caching stopped being free.** The moment your API is `POST /graphql`, twenty years of HTTP caching infrastructure — CDNs, browser caches, shared caches — goes from "automatic" to "a project". Persisted queries with GET recover some of it; response caching with cache-control hints recovers more; but you are now *building* cache infrastructure instead of *using* it. We compared the layers in [the caching layers cake](/journal/engineering/caching-strategy-content-sites) — REST rides the top layers for free, GraphQL usually doesn't.

**N+1 is a subscription you can't cancel.** Every GraphQL server we've inherited had at least one query that turned 40 fields into 400 database round-trips. DataLoader fixes it, but DataLoader is a tax you pay quarterly, per resolver, forever. REST endpoints have N+1 too, but the endpoint is a natural place to spot and fix it; a graph hides the blast radius until someone profiles.

**Operations, not features.** Rate limiting per operation, cost analysis per query, persisted-query allowlisting in production, schema registry, gateway upgrades. A GraphQL API is a platform you operate. Several clients signed up for "an API" and received "a platform," and the difference showed up in their on-call rota. We've written the equivalent warning for rendering strategies in [the edge rendering guide](/journal/engineering/edge-rendering-honest-guide) — the shape of the surprise is identical.

**File uploads, long polls and websockets.** All possible, all bolted on. If your product is 30% "upload a CSV and watch processing progress," REST's awkwardness is a rounding error compared to GraphQL's.

## Where REST is still right, plainly

Our default for new work is boring REST with OpenAPI, and we reach for GraphQL only when the client-shape problem is real. The setups we'd pick again tomorrow:

- **JSON:API or well-shaped resource endpoints + OpenAPI + generated clients.** You keep the type-safety (generated from the spec), the docs, and the mock servers. The tooling gap versus GraphQL codegen narrowed to nearly nothing by 2024.
- **BFF for the genuinely awkward screen.** One endpoint that returns exactly what the dashboard needs, owned by the team that owns the dashboard. Boring, explicit, fast to change. The "under-fetching" discourse treats an extra round trip as a mortal sin; on HTTP/3 with proper caching it's usually a rounding error next to your JavaScript parse time.
- **Query parameters as a small, honest query language.** `?fields=`, `?filter[status]=`, `?sort=` — yes, this is a query language, and yes, it's fine, because it's twenty lines of code you can read, not a specification you operate.

And if you're unsure whether your frontend has a real client-diversity problem or just fetch-shaped anxiety, our [framework decision memo](/journal/engineering/choosing-a-framework-honestly) has the same structure applied to the layer below.

## The decision table we actually use

We fill this in during discovery, with the client, in about twenty minutes:

| Question | Leans REST | Leans GraphQL |
| --- | --- | --- |
| How many distinct clients? | 1–2 similar | 3+ divergent |
| Who owns the API? | Same team as the frontend | Separate platform team |
| Caching profile? | Cacheable reads dominate | Personalised, low cache hit rate |
| Team's GraphQL experience? | None | Has operated it before |
| Ops budget for a gateway? | No | Yes, explicitly |
| File upload / streaming heavy? | Yes | Rare |
| Schema crosses team boundaries? | No | Yes, federation candidate |

Score it, don't vote it. If a column wins 5–2, the argument is over and the document is written — which is worth more than being right, because you'll be onboarding new engineers into this API in year three and they'll ask *why*.

## The hybrid that keeps winning

Increasingly our honest answer is "REST at the edges, graph where it pays": a resource API for the transactional core (payments, auth, uploads), and a thin GraphQL or BFF layer for the sprawling read-heavy surfaces (catalogs, dashboards, editorial pages). This isn't fence-sitting; it's matching the tool to the data's shape. Reads that fan out across entities love a graph. Writes with side effects love an endpoint with a name.

One warning on hybrids: two conventions mean two onboarding paths, so write down the boundary rule ("state changes go through REST; composed reads go through the graph") in the same repo, on day one, before folk law forms.

## What we'd tell our 2018 selves

The schema is not the product; the client's experience of the API is the product. GraphQL is excellent when many divergent clients read overlapping data and someone is paid to run the platform. It's a tax everywhere else. REST never died; it just stopped needing a conference talk. Choose with a table, not a tribe, and — as with every architectural bet — write down the choice and its revisit triggers before the code makes it scripture. If you want a second pair of eyes on your API shape, that's squarely inside what our [product engineering practice](/services/product) does in a discovery sprint, and the [contact form](/contact) is right there.

## Key takeaways

- GraphQL solves divergent-client coupling; REST solves resource modelling. Most pain comes from using one for the other's job.
- The type system and codegen are GraphQL's real payoff — over-fetching was always the marketing.
- `POST /graphql` forfeits two decades of HTTP caching; persisted queries and cost analysis are operations work you must budget for, forever.
- Default to OpenAPI-driven REST with generated clients; require a real multi-client case before reaching for a graph.
- Score the decision with a written table — the document outlives the debate and onboards your future engineers.

## FAQ

### Are persisted queries mandatory in production GraphQL?

For any public or high-traffic API, yes: they give you an allowlist (no arbitrary query cost from strangers), GET-based CDN caching, and stable operation names for observability. Without them you're running `eval` for HTTP. The overhead is real but mechanical — codegen emits the manifest, CI uploads it, the gateway enforces it.

### Does GraphQL still make sense for a single frontend?

Rarely. With one client, a BFF endpoint per screen gets you the exact-shape benefit without the platform. The exception is when the single frontend is enormous and multiple backend teams feed it — but at that point your problem is organisational, and federation is an org-chart tool wearing a schema costume.

### What about tRPC, gRPC, or just-fetch-with-zod?

tRPC is a fine choice for a monorepo where one team owns both ends — it's essentially codegen with less ceremony. gRPC earns its keep for internal service-to-service traffic, not browsers. Validated fetch is the floor everything else must beat, and for small apps nothing does. Each is a point on the same trade: coupling speed now versus platform surface later.

### How do you migrate off a GraphQL API that's become a burden?

You don't — you shrink it. Freeze the schema, carve the write paths out to REST endpoints one domain at a time, and let the graph become a read-only composition layer. Full rewrites of working APIs are how teams lose a year and learn nothing. Migrate the pain, keep the plumbing.
