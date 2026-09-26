---
title: "Designing APIs that frontend teams don't route around"
description: "API design judged by its frontend: pagination contracts, error shapes you can build UI on, BFF vs direct, honest versioning, and the endpoint autopsy."
slug: api-design-frontends-love
cluster: engineering
tags:
  - api design
  - developer experience
  - rest
  - frontend
date: 2026-05-14
author: Tomás Reyes
keywords:
  - API design
  - backend for frontend
  - REST API pagination
  - API error handling
readingTime: 10
---

There's a reliable test for whether an API was designed or merely emitted: count the fetch-aborting, state-reassembling, error-string-parsing glue code in the frontend that consumes it. On projects Brassfern inherits, we routinely find four hundred lines of client code compensating for an API that wasn't thinking about anyone. The frontend team, quite reasonably, has started routing around it — bespoke BFF endpoints, catch-all `useApi` hooks, a spreadsheet of known quirks.

An API frontends love isn't one with a beautiful spec document. It's one where the client code is boring. Six contract decisions account for nearly all of that boredom. Take them in order, and the glue code evaporates.

## 1. Pagination is a contract, not a decoration

Every list endpoint eventually grows past the point where "return everything" works, and the pagination shape you pick on day one is the one you'll defend in year three. Our defaults, argued over enough projects to be settled law internally:

- **Cursor-based for user-facing feeds** — anything where items are inserted while the user scrolls. `?cursor=eyJpZCI6...&limit=25` with an opaque cursor (an encoded ID, not a documented data structure) and a `nextCursor` field that's `null` at the end. Offset pagination on a moving list duplicates and skips items; users notice, they just report it as "the app feels glitchy."
- **Offset is fine for admin tables** — bounded, sortable, where total-count display matters and the data changes slowly. Don't feel forced into purity.
- **Expose the cursor in the URL of the client.** The [URL is your best state manager](/journal/engineering/url-as-state-management): if page 4 of the invoices list can't be copied and shared as a link, the API's pagination contract has leaked into session state, and refresh becomes a trap.

The failure mode to refuse: a `hasMore: boolean` with no cursor, forcing the frontend to track offsets mentally. Every consumer will implement it slightly differently, and one of them will be subtly wrong in production for months.

## 2. Error shapes you can build UI on

`{ "error": "Something went wrong" }` with a 500 is not an error response; it's an apology. Frontend error handling needs structure, which means committing to one envelope across every endpoint:

```json
{
  "error": {
    "code": "card_declined",
    "message": "Your card was declined. Try another payment method.",
    "retryable": true,
    "fields": { "email": ["already registered"] }
  }
}
```

Four fields, each earning syntax:

- **`code`** — a stable, enumerated, snake-cased machine string. This is what client code switches on. It belongs in a shared type, which means the spec is the source of truth (more on that below).
- **`message`** — human prose, safe to render, written for the end user rather than the developer. If your `message` says "Foreign key violation on invoices.customer_id," you have outsourced copywriting to Postgres.
- **`retryable`** — a boolean the server is honest about. It saves every client from the guess-which-errors-are-transient dance.
- **`fields`** — validation errors keyed by the form's field names, not the database's column names. We laid out the client half of this contract in [form architecture at scale](/journal/engineering/form-architecture-scale) — it only sings when the server speaks the same keys.

And the status code still carries semantics: 4xx means the client can fix it, 5xx means it can't, 409 means conflict-over-lost-update, 422 means well-formed-but-invalid. Clients branch on class, switch on code.

## 3. BFF vs. direct: own the awkward screens explicitly

Should the web app call the resource API directly, or sit behind a backend-for-frontend that composes exactly what each screen needs? The honest answer is "both, deliberately," and we wrote the broader REST-vs-graph framing in [GraphQL vs REST, eight years in](/journal/engineering/graphql-vs-rest-pragmatic). The operative rule here:

- **Direct-to-API for transactional verbs.** Create-invoice, update-profile, change-password. One resource, one mutation, no composition to hide.
- **BFF for sprawling read screens.** The dashboard that needs the user, their plan, their usage counters, three lists and a banner eligibility check is one BFF endpoint, owned by the team that owns the screen. One round trip, one loading state, one error state.

What the BFF is *not*: a junk drawer. The moment a BFF endpoint serves three unrelated screens, it has become its own monolith with worse boundaries. Name BFF routes after screens (`/bff/billing-overview`), not domains (`/bff/billing`), so the ownership stays legible and deletion stays possible.

## 4. Versioning that isn't theatre

Most API versioning is ceremony without protection: `/v2/` appears, the old version is never actually deleted, and both rot. Our working rules:

- **Additive changes don't version.** New fields, new endpoints, new enum values sent to tolerant readers — these are the everyday evolution of any healthy API. If a client breaks because a new field appeared, the client was wrong, and the fix is teaching parsers tolerance, not minting `/v2`.
- **Version only breaking changes, and few of them.** A changed response shape, a removed field, a changed default. When it happens, version *the endpoint*, not the universe: `POST /v2/refunds` can coexist with `GET /v1/orders` for years without shame.
- **Sunset is the product.** A version without a deprecation date, a migration doc, and `Sunset`/`Deprecation` headers is just a second codebase. Announce, warn in headers, measure remaining traffic on the old version from server logs, and delete on schedule. Traffic on a deprecated version is not a reason to keep it; it's a list of clients to email.

## 5. Make the spec the source of truth

An OpenAPI document that drifts from the server is worse than none, because it trains everyone to distrust documentation. The setup that eliminates an entire category of bug: spec in the repo, server validates requests against it in CI, TypeScript types generated from it for the client. This is the same end-to-end type discipline we described in [type safety from CMS to component](/journal/engineering/type-safe-cms-content) — the transported-realisation being that "the API changed and nobody told the frontend" stops being an incident class entirely. When the spec is also the mock server, frontend work unblocks before backend work lands, which reorders sprints in a way product managers notice.

## 6. Run the endpoint autopsy

The exercise we run in the first discovery week of any API-adjacent engagement, and the reason this article exists: pick the three ugliest screens in the frontend and read every network call they make. Write down, per screen: how many requests, how much glue code, how many error shapes, how many over-fetches. Then do the same for the three *cleanest* screens.

The delta is your API design review. Ugly screens are never ugly because the frontend team is bad; they're ugly because the API made them that way, one "we'll just make it flexible" decision at a time. The autopsy converts vague API anxiety into a numbered list, and numbered lists get funded. Vibes don't.

A note on scope: none of these six decisions requires new infrastructure. They're conventions — cursor shapes, an error envelope, a naming rule, a spec in CI — the sort of thing a senior squad can land inside a sprint. Which is precisely why they're worth holding as standards rather than renegotiating per endpoint. If your API has already accreted years of folk law, an API reshape is bread-and-butter work for our [product engineering practice](/services/product); the [contact form](/contact) takes briefs.

## Key takeaways

- Pagination is a contract: opaque cursors and explicit `nextCursor` for moving feeds; offsets only for bounded admin tables. Never `hasMore` without a cursor.
- One error envelope everywhere: machine `code`, renderable `message`, honest `retryable`, and `fields` keyed by the client's form names.
- Direct calls for transactional verbs, a screen-named BFF endpoint for sprawling read screens — and BFFs named after screens so they can be deleted.
- Version only breaking changes, version the endpoint rather than the API, and give every version a sunset date with headers to match.
- Spec in the repo, validated in CI, types generated client-side: this eliminates "nobody told the frontend" as an incident class.
- The endpoint autopsy — tracing the network cost of your three ugliest screens — turns API debt into a fundable, numbered list.

## FAQ

### Should we use HTTP problem details (RFC 9457) instead of a custom envelope?

`application/problem+json` is a good envelope and we'd happily adopt it — with extensions. The stock fields (`type`, `title`, `status`, `detail`) don't include field-level validation errors or a retryable hint, both of which frontend error handling genuinely needs. Extend it; don't reject it for being standard or adopt it unextended.

### What about batch endpoints — one call, many operations?

Occasionally right on chatty mobile clients, usually wrong on the web. Batching smuggles per-item failure semantics into a transport that assumes one status: what HTTP code is a 7-of-10 success? If mobile latency forces batching, return a 200 with a per-item results array and teach clients to walk it — but treat that as the documented exception it is.

### How do we evolve a response shape without versioning?

Add the new field, migrate readers, then stop *populating* the old field while keeping the field (deprecated, documented) until traffic on it is zero, and only then remove. Sound familiar? It's expand-migrate-contract from our [zero-downtime migrations piece](/journal/engineering/zero-downtime-postgres-migrations), one layer up — API shapes are schemas too, and they deserve the same patience.

### GraphQL federation, tRPC, REST+BFF — how do we choose?

By client diversity and ops budget, not fashion: one team owning both ends in a monorepo gets tRPC or plain REST; genuinely divergent clients reading shared data justify a graph; most products are REST plus a thin BFF. The full scorecard is [GraphQL vs REST, eight years in](/journal/engineering/graphql-vs-rest-pragmatic) — the conclusion rhymes with this article: boring conventions, written down, beat clever flexibility.
