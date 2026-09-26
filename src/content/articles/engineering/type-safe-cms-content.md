---
title: "End-to-end type safety from CMS to component"
description: "How we generate TypeScript types from headless CMS schemas, validate content at the boundary, and write content models that never cause the 6pm rename incident."
slug: type-safe-cms-content
cluster: engineering
tags:
  - typescript
  - cms
  - content-modelling
  - developer-experience
date: 2025-09-05
author: Felix Brandt
keywords:
  - typescript headless cms
  - type safe content
  - content modelling
  - sanity typescript
  - content validation
readingTime: 9
---

The 6pm field-rename incident is a rite of passage in headless CMS work. A well-meaning editor — or a developer tidying up — renames `heroImage` to `hero_image`, the deploy is green, and the production homepage renders a tasteful empty rectangle. The build passed because the content arrived at runtime, and TypeScript never saw it.

End-to-end type safety for content is the discipline of closing that gap: making the CMS schema, the API payload, the rendered component and the editor experience one continuous, checked contract. Here is how we do it, where it breaks, and the content-model conventions that prevent the incident rather than catch it.

## The contract has four joints

A type-safe content pipeline connects four things:

1. **The CMS schema** — the source of truth for what fields exist.
2. **Generated TypeScript types** — derived from the schema, never written by hand.
3. **Boundary validation** — a runtime check at the moment content enters your system.
4. **The component layer** — which consumes only validated, typed data.

Break any joint and you are back to hoping. Hand-written types drift from the schema. Types without runtime validation assume the API honours its own contract — until a draft, a migration, or a permissions quirk proves otherwise.

## Generating types from the schema

Every serious headless CMS now exposes its schema in machine-readable form, and every serious project should treat generated types as a build artefact, like a compiled binary. The shape of the pipeline:

- **Schema → types.** Tools like Sanity TypeGen, Contentful's type generators, or a GraphQL codegen step read the schema and emit `.d.ts` or `.ts` files. The rule in our repos: generated files live in a `generated/` folder, carry a "do not edit" header, and are regenerated in CI and on `postinstall`.
- **Types → drift detection.** CI regenerates the types and fails if the working tree changes. When someone edits the schema in the CMS and forgets to regenerate, the next build tells them — locally, loudly, before the rename reaches production.
- **Query → projection types.** Where the CMS supports it, derive types from the query shape, not just the schema. A component that only fetches `title` and `slug` should be typed as receiving exactly `title` and `slug`. Over-fetching is a performance smell; over-typing is a lying one.

The cultural rule matters more than the tool: **nobody writes content types by hand**. The moment a handwritten interface exists alongside a generated one, you have two sources of truth, and the handwritten one will silently become the false one.

## Validation at the boundary

Types vanish at runtime. The payload arriving from a CMS API is `unknown` in a trench coat, and treating generated types as proof is the subtlest bug factory in this architecture. Drafts with missing required fields. A newer API version. A plugin that serialises dates differently. All of it sails past the typechecker.

So we validate at the boundary — once, at the point content enters the application:

```ts
// the pattern, simplified
const Article = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  publishedAt: z.coerce.date(),
  heroImage: ImageAsset.nullable(),
  body: PortableText,
})

export type Article = z.infer<typeof Article>

export async function getArticle(slug: string) {
  const raw = await cms.fetch(articleQuery, { slug })
  const parsed = Article.safeParse(raw)
  if (!parsed.success) {
    reportValidationError(parsed.error, { slug })
    return null // caller renders a 404, not a half-page
  }
  return parsed.data
}
```

Three properties make this pattern earn its keep. **Co-located schemas**: the validator and its inferred type live together, so they cannot drift. **Fail closed**: invalid content becomes a controlled null — a 404 or a section that omits itself — never a partially-rendered page. And **reported, not swallowed**: validation failures go to error reporting with content IDs attached, so the team learns within minutes that an editor published an article without a hero, rather than within days from a screenshot in Slack.

One deliberate choice: validate at fetch time, not in components. Validation scattered through the render tree produces inconsistent behaviour and unreadable stack traces. One gate, one shape, one error format.

## Content modelling conventions that prevent the incident

Type safety makes breaking changes detectable. Good content modelling makes them rare. The conventions we enforce on every project:

**Additive changes are free; subtractive changes are a migration.** Renaming or removing a field is never an edit — it is add-new-field, dual-publish, migrate content, update code, remove-old-field, in that order. We say this in kickoff, we write it in the CMS field descriptions, and we mean it.

**Singular nouns, no prefixes, stable slugs.** `author`, not `articleAuthor` or `c_author`. Field slugs are API contracts; presentational nuance belongs in the field's *title* (which editors see, and which can change freely because nothing in code references it). Decoupling the machine name from the display label removes half the temptation to rename.

**Rich text is portable or it is trouble.** Block-content formats (Portable Text, structured rich text) survive redesigns; HTML fields do not. The day a designer wants pull quotes styled differently, portable content accommodates; a blob of stored HTML becomes a regex someone regrets.

**References over duplication.** One author document referenced by forty articles, not forty embedded author objects. Referential integrity is checkable; duplicated strings are not. It also gives you the dependency map you need for [sane cache invalidation](/journal/engineering/caching-strategy-content-sites) — when an author updates their bio, you know exactly which pages changed.

**Model the intent, not the layout.** A field called `showAsWideBanner` encodes a design decision from 2024 into content that will outlive it. Prefer semantic flags (`emphasis: high | normal`) and let the front end decide what "high" means this year. Our piece on [content handover](/journal/playbooks/content-handover-workflow) covers the editorial side of this decision: models survive when they describe what content *is*, not how it happens to look.

## The editor experience is part of the contract

Type safety that only engineers feel is half the prize. The same schema should make the CMS itself harder to misuse: validation rules (required, max length, regex on slugs), preview text on every field, and conditional fields so editors only see what applies to the variant they picked.

We also wire **preview environments into the loop**. Editors get a real preview deployment rendering draft content; breaking the preview is the cheap rehearsal that prevents breaking production. When [handovers are done right](/journal/playbooks/design-handover-done-right), the documentation includes the content model's invariants — which fields feed SEO, which feed structured data, which are load-bearing for the layout — so a new editor inherits the contract, not just the login.

This is also where type safety quietly serves design: components typed against the full union of content states (missing image, over-long title, untranslated string) get designed for those states, because they are visible in the type system. The empty state stops being a surprise. Teams building real resilience into their front ends will recognise the same philosophy from our work on [error messages that de-escalate](/journal/product/error-messages-that-help): assume failure, design for it, and it rarely happens in front of a user.

## What it looks like on a real build

On our editorial platform builds — the pattern behind projects like the [Signal & Noise podcast network](/work/signal-and-noise-podcast-network), with its shows, episodes, hosts and transcripts — the pipeline runs like this:

1. Content models designed in the first discovery sprint, reviewed by editors and engineers together.
2. Schema committed to code; types generated on install; drift check in CI.
3. Boundary validators for every content type; failures reported with content IDs.
4. Preview deployments wired to drafts; publishing flows that warm caches and purge precisely.
5. A migration playbook next to the README: how to evolve a field without an incident, in five ordered steps.

The measurable outcome, on a representative engagement: zero content-model-related production incidents across eighteen months, and schema-change deploys that editors stopped noticing. The immeasurable one: engineers stopped writing defensive `?.` chains through every component, because the data arrives shaped as promised.

## Key takeaways

- Generate types from the CMS schema; never hand-write content interfaces. Two sources of truth become one false one.
- Regenerate types in CI and fail on drift. The rename incident should die at the build, not in production at 6pm.
- Validate at the boundary with a runtime schema, fail closed to a 404 or omitted section, and report failures loudly.
- Content modelling conventions — additive-only changes, stable machine names, references over duplication, intent over layout — prevent what type safety can only detect.
- Extend the contract to editors: validation rules, real previews, documented invariants.
- Typed unions of content states force design to reckon with missing images and over-long titles before users do.

## FAQ

**Is runtime validation overkill if the CMS guarantees its schema?**
CMS APIs guarantee the schema *currently configured*, not the content: drafts, in-progress migrations, legacy documents and preview tokens all produce payloads that violate it. Validation is cheap — a few milliseconds at fetch time — and it converts a class of production mysteries into clear, attributable errors. It is the best milliseconds in the stack.

**Which runtime validator should we use?**
Any schema library that infers static types from the runtime definition is fine — Zod, Valibot, ArkType and friends all work. Choose on bundle size and API taste; the architecture matters more than the library. What is non-negotiable is that the validator is the single source from which types derive.

**How do we handle genuinely breaking changes?**
As a five-step migration: add the new field, dual-populate from the old one, migrate existing content with a script, switch the front end to the new field, remove the old field after a quiet fortnight. Each step deploys independently and rolls back cleanly. It is slower than a rename and infinitely cheaper than the incident.

**Does this apply to Markdown-and-Git content setups too?**
Yes, and arguably more. Frontmatter has no schema enforcement at all, so boundary validation is the only gate. We frontmatter-validate at build time with the same pattern: parse, validate, fail the build on invalid content. A broken article should block a deploy, not publish half-rendered.

**Where does this fit in a small project?**
Scaled down, not skipped. A five-page marketing site still benefits from generated types and one boundary validator — the setup is an hour. The discipline scales with content volume; the philosophy does not. If you are planning a headless build, this is exactly the kind of foundation we lay in the first sprint of an [engagement](/approach).
