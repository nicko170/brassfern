---
title: "One schema everywhere: shared validation contracts"
description: "One Zod schema shared across client forms, API handlers and generated types. The architecture, error mapping and versioning that end validation drift for good."
slug: schema-validation-shared-contracts
cluster: engineering
tags: [typescript, validation, architecture, forms]
date: 2025-11-18
author: Felix Brandt
keywords: [zod validation, shared schemas typescript, end to end type safety, form validation architecture]
readingTime: 8
---

Every codebase we inherit has the same bug hiding in it twice. The signup form checks that a password is eight characters. The API checks that it's twelve. The support inbox fills with people who passed the first check and failed the second, staring at a generic "invalid request" toast. Nobody wrote a bad line of code. They wrote the same rule twice, in two languages of thought, and the rules drifted.

The fix is unfashionably simple: **write each validation rule exactly once, in one schema, and share that schema everywhere a value can cross a boundary.** Client form, API handler, webhook consumer, CSV importer. One contract, many enforcers.

This is the single highest-leverage architectural decision we make on product builds, and it costs almost nothing up front. Here's how we do it, where it breaks, and the failure modes nobody warns you about.

## The layers where validation usually lives (and rots)

A typical request lifecycle has four validation surfaces:

1. **The form**, which validates for user experience — inline, on blur, with friendly copy.
2. **The API handler**, which validates for correctness and security — the only validation that actually matters.
3. **The database**, which validates with constraints — the last line of defence.
4. **The types**, which validate nothing at runtime but tell every developer what they *believe* the data looks like.

When these are maintained separately, they form a committee that never meets. The TypeScript interface says `quantity: number`. The database says `integer, min 0`. The form says max 99 because someone set an HTML attribute three years ago. The API doesn't check quantity at all because it trusts the client. Every incident review ends with "we should add validation" — to whichever layer happened to be on the whiteboard that day.

## One package, no runtime dependencies on either side

The pattern we ship on every project: a standalone `contracts` package — plain TypeScript, no framework imports, no Node APIs, no DOM. It exports schemas (we use Zod; Valibot is equally good and slimmer) and the types inferred from them.

```ts
// packages/contracts/src/booking.ts
import { z } from 'zod';

export const bookingInput = z.object({
  serviceId: z.string().uuid(),
  slot: z.iso.datetime({ offset: true }),
  attendees: z.number().int().min(1).max(8),
  notes: z.string().max(500).optional(),
});

export type BookingInput = z.infer<typeof bookingInput>;
```

Because the package is dependency-free, the marketing site's React form imports it, the edge API handler imports it, and the batch job that imports bookings from a partner's CSV imports it. Three runtimes, one rule. On the Pylon Health telehealth build (see the [telehealth case study](/work/pylon-health-telehealth-flow)), moving booking validation into a shared contract eliminated an entire category of "works in the UI, rejected by the API" bugs during their busiest launch week.

The discipline that makes this work: the contracts package is the *only* place shapes are defined. API handlers never redeclare an interface for their payload. Forms never hand-roll regexes the schema already owns. If a rule changes, it changes in one file, and the type error ricochet tells you every surface that needs attention. If you're already bought into [end-to-end type safety from CMS to component](/journal/engineering/type-safe-cms-content), this is the same instinct applied to data going the other direction — from user to server.

## Error mapping: the part everyone ships badly

Zod gives you structured issues. Your form library wants a flat map of field paths to messages. Your API wants a stable JSON envelope. Naively, each surface stringifies errors its own way, and you're back to drift — this time in the messages.

So the contracts package also owns the mapping. One function, `toFieldErrors(issues)`, produces the shape the UI consumes; another, `toApiError(issues)`, produces the envelope. Message copy lives in the contract layer too, as functions of the issue:

```ts
export function messageFor(issue: z.core.$ZodIssue): string {
  if (issue.code === 'too_small' && issue.origin === 'number') {
    return `Must be at least ${issue.minimum}.`;
  }
  // …
}
```

That last point matters more than it looks. When copy lives next to the rule, "the API says you need 12 characters but the form says 8" becomes impossible — there's only one place that sentence can come from. It also gives content designers a real surface to edit. Our [form architecture work](/journal/engineering/form-architecture-scale) goes deeper on the UX side of this: autofills, error timing, and when *not* to validate.

## Client trust is a UX decision, server trust is a security decision

A rule worth tattooing on the team charter: **client-side validation exists to be helpful; server-side validation exists to be right.** The shared schema serves both, but the posture differs.

On the client, we validate progressively — on blur for completed fields, on submit for the summary — because a schema error is a conversation with a human. On the server, we validate at the outermost boundary, before the handler's first line of business logic, and we *never* catch-and-coerce. Parse, and on failure return the envelope with a 422. Every handler is a one-liner guard:

```ts
const parsed = bookingInput.safeParse(await req.json());
if (!parsed.success) return apiError(parsed.error);
```

This composes beautifully with [checkout state machines](/journal/engineering/state-machines-ui-flows): schema validation gates the transitions, so the machine can only ever hold well-formed state.

## Versioning the contract without breaking the world

The uncomfortable question arrives around month six: what happens when the contract changes?

Our rules:

- **Additive changes are free.** New optional fields, new enum members the server tolerates — ship them whenever.
- **Breaking changes get a version suffix**, not migration theatre. If `attendees` becomes a structured list of people rather than a count, we ship `bookingInputV2`, accept both at the boundary for a deprecation window, and log which version each request used. Two weeks of logs tell you when V1 is safe to delete.
- **The schema is not the database schema.** JSON payloads are a wire format; your tables are storage. Coupling them 1:1 means every column rename is an API break. Let a thin mapping layer translate — boring code that earns its keep.

Try to skip versioning entirely with "we'll just deploy client and server together" and any cached service worker or background tab from yesterday will humiliate you. We've watched it happen on a Friday deploy. Twice. The [REST chapter of our API saga](/journal/engineering/graphql-vs-rest-pragmatic) covers the broader compatibility politics.

## Where the pattern leaks

Honesty section. Shared contracts are not free:

- **Bundle size is real.** Zod in the client costs ~13 KB gzipped, more with refinements. On marketing sites we sometimes split: the contracts package exports a `client/` entry with only the schemas forms actually need, so tree-shaking can do its job. Valibot's per-function imports shrink this further.
- **Over-fitting the schema to the form.** Forms sometimes want looser input than the contract (raw strings from inputs, partial drafts in localStorage). Don't weaken the contract. Define a *separate* draft schema in the form layer and parse into the real contract at submit.
- **Cross-language stacks.** If your API is Go or Elixir, you can't import the TypeScript schema. Then the contract becomes the source from which both sides are generated — JSON Schema in CI, codegen on each side — which is heavier but preserves the single-source property.
- **Tests still matter.** A shared schema is itself code with bugs. We test schemas directly (property-based tests with fast-check are excellent here) so that "the contract accepts garbage" gets caught in CI, not by a user. That sits inside the [testing pyramid we actually run](/journal/engineering/testing-strategy-that-scales).

## Key takeaways

- Write each validation rule once, in a framework-free contracts package; import it from form, API and batch jobs alike.
- Infer server and client types from the schema — never maintain parallel interfaces.
- Own the error mapping in the contract layer so user-facing copy can't drift between surfaces.
- Client validation is UX; server validation is security. Share the rules, not the posture.
- Version breaking schema changes explicitly and let request logs drive deprecation.
- Budget for the leaks: bundle size, draft-state schemas, and cross-language stacks all need a deliberate answer.

## FAQ

**Zod or Valibot — does it matter?**
Less than the architecture. Valibot wins on bundle size (its modular API tree-shakes to almost nothing), Zod wins on ecosystem and ergonomics. Pick one, wrap it behind your own exports, and the decision becomes reversible.

**Should the database schema also come from the contracts package?**
No. Wire contracts and storage schemas change for different reasons. Coupling them turns every migration into an API break. A thin mapping layer between them is the cheapest insurance in the stack.

**How do we handle file uploads or multipart data?**
Parse the metadata fields through the schema; validate the binary parts (size, MIME sniffing, dimensions for images) with dedicated utilities. Don't contort the schema to describe a file.

**Does this work with React Hook Form / TanStack Form?**
Yes — both have first-class Zod/Valibot resolvers. Wire the shared schema into the resolver and the `toApiError` mapper into your mutation layer, and the client and server stay in lockstep by construction.

**What's the first step in a legacy codebase?**
Pick the one endpoint that generates the most support tickets. Extract its validation into a contracts module, make the API import it, and point the form at it. The bug-count drop is usually visible in a month — and it's the best internal sales pitch for doing the rest.
