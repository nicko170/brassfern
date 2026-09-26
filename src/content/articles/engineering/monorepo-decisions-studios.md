---
title: "Monorepo or not? A studio's decision framework"
description: "Monorepos solve code-sharing and coordination problems most studios don't have, at tooling costs they don't predict. When we say yes, and what we do when we say no."
slug: monorepo-decisions-studios
cluster: engineering
tags: [monorepo, tooling, architecture, engineering practice, decision making]
date: 2026-08-26
author: Tomás Reyes
keywords: [monorepo vs polyrepo, turborepo decision, code sharing strategy, agency engineering tooling, repository architecture]
readingTime: 11
---

The monorepo question arrives at studios disguised as a tooling question — "should we use Turborepo?" — when it's actually three separate questions bolted together: where does code live, how is code shared, and how are changes coordinated? The tooling answers question one. Most of the pain attributed to monorepos is question three wearing question one's clothes. And most of the actual problems studios have — five client projects sharing nothing but habits — aren't monorepo problems at all.

We run both shapes across our portfolio, so this is the framework we use when a client (or a new internal project) asks: the problems a monorepo genuinely solves, the costs that appear on the invoice rather than the blog post, the studio-specific wrinkle that changes everything (handover), and what we do instead when the answer is no.

## What a monorepo genuinely solves for a studio

Monorepos earn their keep in one scenario: **multiple deployables sharing meaningful, version-sensitive code, changing together.** Concretely for us, that's:

- **A product with a web app, a marketing site and a shared design system.** The component library, [design tokens](/journal/engineering/design-tokens-pipeline) and site/app consume each other on every commit. Atomically shipping a breaking token change across three surfaces in one PR — reviewed once, built once, deployed per-app — is the monorepo's killer feature. Polyrepo, that's a versioned-package release, a three-repo rollout, and a week of version skew.
- **An app and its API with a shared contract.** [Shared validation schemas](/journal/engineering/schema-validation-shared-contracts) between server and client, where both change in the same commit and type errors catch drift at build time. This alone has justified monorepos on several builds — the integration boundary becoming a type error instead of a production incident is worth real money.
- **A fleet under one team's stewardship.** A product family owned by one pod — versioning, linting, upgrades (one React bump, one PR) — benefits from the shared tooling a monorepo formalises.

The flavour of benefit is *coordination cost dropping*. A monorepo is, at heart, a machine for making cross-cutting changes boring.

## The costs that arrive on the invoice

The advocate's blog post ends before these line items:

- **CI is a designed system now.** Build-what-changed, task graphs, remote caching — without them, CI time balloons with repo size. Remote cache failures and cache-poisoning episodes are a new category of incident; someone owns that forever.
- **Tooling tax, levied per engineer.** IDEs, linters, typecheck and test runners all need per-package configuration to stay fast. On a healthy monorepo this is invisible; the person who keeps it invisible is a real cost.
- **Ownership boundaries get mushy.** Polyrepo forces crude but effective boundaries (clone access, CODEOWNERS). In a monorepo, discipline or config must do the work, or everything gradually becomes everyone's and therefore nobody's.
- **Release coupling.** One default branch means everyone's in-flight work rides together. Feature flags stop being optional; see [feature flags without the graveyard](/journal/engineering/feature-flags-craft) for the discipline that has to already exist.
- **Honest mathematics of scale.** The coordination wins show up when cross-cutting changes are common. For a studio where 80% of changes are single-project, polyrepo is not a failure of ambition — it's the correct shape.

## The studio wrinkle: handover

This is the part agency monorepo advice never mentions: **we build things we hand over.** The repository shape is partly determined by what happens when the engagement ends. A client's two-person team inheriting a Turborepo with a remote cache, task graphs and six workspace packages is inheriting our competence as a dependency. Some clients can operate that; many cannot, and pretending otherwise is a professional failing, not a tooling preference.

Our handover rubric has three questions. Will the client's team (or their next agency) have the monorepo tooling literacy to operate this without us? Will the deployables ever be worked on by *different* vendors or teams simultaneously — in which case repo boundaries are a governance feature, not a constraint? And does the shared-code benefit survive an organisation that will mostly make single-project changes? On [Quill Legal's document platform](/work/quill-legal-document-platform) the answers said monorepo — one in-house team, an app and marketing site sharing a design system. On plenty of other engagements the answers said: three repos, shared via versioning, gorgeous README, done.

## When the answer is no: the polyrepo discipline

"No monorepo" is not "no shared code" — it's shared code paying its costs honestly at the packaging boundary:

- **Versioned packages for genuinely stable libraries.** A component library that changes weekly belongs in a monorepo or tightly versioned packages with release automation; either is fine. Publishing from one of the repos with changesets-style automation keeps the ceremony under an hour.
- **Templates for project starts, not living inheritance.** Our starter templates encode current practice; projects fork them and own their evolution. Copy-paste at project birth is not the sin the mono-discourse says it is — divergence is fine when divergence is expected. What copy-paste must never be is a *live* dependency channel; that's what packages are for.
- **Vendoring, deliberately.** When a project needs a slice of a shared library (three token utilities), we sometimes vendor: copy the code into the project with provenance noted in the README, accept duplication, lose the sync problem. A small bounded copy with clear ownership beats a shared package nobody maintains.
- **Contracts at the network boundary.** Without a monorepo, the API client and server share schemas via a published package or a generated client — the same discipline, paying an explicit release step that the monorepo amortises.

## The decision, on one page

When we run the workshop, the shortlist is:

1. Do multiple deployables share code that changes weekly? **Yes → monorepo candidate.** No → polyrepo.
2. Is there an ongoing owner for the tooling layer? No → polyrepo regardless.
3. Will distinct teams or vendors work on distinct deployables? Yes → lean polyrepo; boundaries serve them.
4. Is the deploy topology genuinely one product (atomic releases welcome)? If releases must decouple anyway, the monorepo's best feature is on the shelf.
5. Handover: honestly assess the operating team's literacy. If the repo shape outruns the team, the shape is the risk.

And one meta-rule: repo shape is a reversible-ish decision at project start and an expensive one later. So we spend an hour in the [discovery phase](/approach) on it, write the answers down in the project's decision log, and — this is the non-negotiable part — revisit annually, because the team that inherits the repo was usually not in the room when the answer was chosen.

## Key takeaways

- A monorepo solves coordination and atomic-change problems; if your studio's changes are mostly single-project, it solves problems you don't have.
- Real costs: CI becomes a designed system (task graph, remote cache), a permanent tooling owner, mushy ownership boundaries, release coupling.
- The studio wrinkle is handover — the repo shape must be operable by whoever inherits it, not just by whoever chose it.
- The strongest monorepo cases: app + marketing site + design system, or client + server sharing contracts across one team.
- No-monorepo isn't no-sharing: versioned packages with release automation, starter templates, deliberate vendoring, generated clients.
- Decide in an hour, write it in the decision log, revisit yearly — the inheriting team wasn't in the room.

## FAQ

**Turborepo, Nx or pnpm workspaces alone?** pnpm workspaces covers dependency wiring for small setups; a task runner with remote caching earns its keep when build times hurt. Choose by measured CI pain, not by ecosystem fashion — the decision framework in [choosing a framework without the fashion show](/journal/engineering/choosing-a-framework-honestly) applies to build tooling verbatim.

**One repo per client, or our whole studio in one?** Never the studio in one. Client confidentiality, access control and handover make per-client repos the floor. The monorepo question lives inside a client engagement.

**We already have a sprawl of repos — consolidate?** Only if the shared-code change rate justifies it. Repo sprawl hurts less than it looks; forced consolidation of repos with different release rhythms and different owners trades visible clutter for invisible coupling, which is the more expensive disease.

**How does this interact with microservices?** Orthogonally — we mostly don't do microservices for the kinds of products studios build, but where they exist, repo shape should follow team ownership (polyrepo per team or monorepo per team), with contracts explicit. The principle throughout: let the organisation's real change patterns pick the shape, and tax anyone who proposes the shape before examining the patterns.
