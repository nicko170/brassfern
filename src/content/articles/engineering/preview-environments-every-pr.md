---
title: "A preview environment for every pull request"
description: "Per-PR preview environments cost less than the meetings they replace. How we build them: seed data, infrastructure on a budget, and demos as the default."
slug: preview-environments-every-pr
cluster: engineering
tags:
  - ci-cd
  - developer-experience
  - deployments
  - code-review
date: 2025-09-12
author: Tomás Reyes
keywords:
  - preview deployments
  - pull request previews
  - CI/CD workflow
  - ephemeral environments
readingTime: 11
heroImage: /images/articles/engineering/preview-environments-every-pr.jpg
heroAlt: "Rows of identical terracotta seedling pots with matching fern cuttings on cream paper — a still-life metaphor for cloned preview environments."
---

The most expensive artifact in a software project is a screenshot of a pull request, posted to Slack, with the caption "does this look right?" It's a fossil of a running application — you can't click it, resize it, tab through it, or read it with a screen reader. Whoever receives it has to reconstruct the whole change in their head from a diff and a JPEG, then approve with one eye closed. Multiply that by every feature, every stakeholder, every week of the project, and you've priced the real cost of not having preview environments.

A preview environment is a full deployment of the application, per pull request, with its own URL. `pr-412.project.preview.example.com`. The designer clicks it. The client clicks it. The QA pass happens on it. Reviewing software stops being an act of imagination and becomes an act of inspection. On every Brassfern engagement, previews are non-negotiable infrastructure — usually live by day three — and this article covers how we build them cheaply, what makes them trustworthy, and why they quietly reorganise how a whole team works.

## The economics nobody adds up

Teams resist preview environments on cost grounds, which is strange, because the cost is mostly meetings.

Consider the default alternative. A stakeholder wants to see a change. Someone checks out the branch, gets it running locally, screen-shares on a call, answers questions, and then merges — after which the real environment surfaces whatever the local machine's environment didn't. That's a thirty-minute meeting per significant change, plus the ambient cost of "it works on my machine." Now price the preview: a CI job that takes six minutes and a dormant container that costs pennies an hour while nobody's looking at it.

On one [product engagement](/services/product), we counted. Over a twelve-week build, preview environments replaced roughly thirty-five review meetings and uncounted rounds of feedback by screenshot. The infra cost for the quarter was under two hundred dollars. Nothing a studio does has a more lopsided cost-to-value ratio, which is why we treat previews as part of the definition of done rather than an optional nicety.

## What a good preview actually is

A URL that deploys when the PR opens is table stakes. The difference between a preview people use and a preview people ignore is everything around that URL.

**It looks like production.** Same build settings, same runtime environment, same feature-flag defaults as production — not main's. If the preview behaves materially differently from what will ship, reviewers learn to distrust it, and you've built a screenshot generator with extra steps. [Feature flags without the graveyard](/journal/engineering/feature-flags-craft) covers how we keep flag states legible across environments.

**It has believable data.** This is the part teams skip, and the reason half of all previews are useless. An empty app with lorem ipsum tells a reviewer nothing about the pagination, the long German compound word in a customer name, or the pricing edge case the change was supposed to fix. Every preview gets seeded from a known fixture set: a few hundred realistic records, deterministic, reset on every deploy. We keep the seed as code, reviewed like code, and versioned like code. The fixtures double as the test corpus — the same data our [Playwright suites](/journal/engineering/playwright-testing-that-lasts) run against — so "the seed drifted" is a test failure, not a surprise.

**It's fast enough to be reflexive.** If a preview link takes twenty seconds to load, people stop clicking it. The preview gets a CDN in front of static assets, a cache-warming request after deploy, and a bot comment on the PR with the URL as soon as it's actually ready — not "build finished" but "responds 200." The difference matters more than you'd think; a link that works when clicked gets clicked.

**It's discoverable.** The URL goes into the PR description automatically, into the Slack channel for the project, and onto the project board. Nobody goes hunting for environments. The comment bot posts links to the two or three screens the diff actually touched, because deep links get the right eyes faster than a homepage ever does.

**It dies.** Previews shut down when the PR closes. Sounds obvious; wasn't, until we looked at a client's inherited AWS bill, where three hundred orphaned environments from closed PRs were idling at forty dollars a month each. An aggressive TTL and a nightly reaper job. The reaper posts what it killed. Transparency keeps it honest.

## The architecture, boring on purpose

The version that works for most projects is aggressively mundane. Build the app in CI exactly as production builds it. Deploy it to a static host with a hash- or PR-numbered path if the app is frontend-only — [our caching layers cake](/journal/engineering/caching-strategy-content-sites) applies here unchanged, since per-PR paths make cache invalidation trivial. If there's a backend, run it as a small container with the seed loaded on boot, and let the frontend know its API origin through an environment variable set at build time.

Three details do most of the work:

1. **One workflow file, not a platform.** Vendor preview features are pleasant until you need a database, a scheduled job, or a second service. A plain CI workflow — build, deploy, comment, tag, reap — is portable across hosts and readable by the next team. Complexity you can grep beats magic you can't.
2. **Relative asset paths everywhere.** A preview lives on a sub-path or a throwaway domain, so any absolute path (`/assets/logo.svg`) or hardcoded origin is a bug that only appears in previews. This rule also happens to be the same discipline that makes a site deployable to a staging domain, a client mirror, or a sub-path on day one. Write URLs as if the app might move, because in previews it does.
3. **A health board with previews in it.** Previews count as real infrastructure: uptime, deploy failures, and seed drift all get reported alongside production. An ignored environment becomes a broken one within a sprint. Observability doesn't have to be heavy — the same [frontend observability stack for teams without an SRE](/journal/engineering/frontend-observability-small-teams) covers previews with one extra dimension on the environment tag.

What you don't need, most of the time: a full replica of production infrastructure, managed previews priced per seat, or Kubernetes anything. A container and a CDN serve a surprising number of real products.

## The cultural effect is the point

Here's the thing that sneaks up on teams who adopt previews: the tool reorganises the work.

Demos stop being ceremonies and start being links. The Friday demo becomes "here are the URLs from this week's merged PRs" — the same shipping-in-public habit we describe in [how we work](/approach), now with receipts. Feedback changes shape. A comment that says "the empty state on the invoices page reads cold, here's a screenshot with the tab open" replaces a comment that says "LGTM" because the reviewer never actually ran the branch. Product decisions happen earlier, in the branch, where changing your mind is free.

The strangest effect is who shows up. Stakeholders who would never pull a repo start reviewing work weekly, because the cost of participation collapsed to clicking a link. Clients who used to see the product at milestone reviews start commenting on PRs within minutes of them opening. You stop discovering in week nine that the founder pictured a different onboarding. They watched it get built, preview link by preview link, and said so in week two when the change was a comment instead of a rework.

That — not the container, not the CDN — is what you're buying. The infrastructure is a rounding error. The alignment is priceless.

## Key takeaways

- A preview environment per pull request replaces review meetings, screenshot archaeology, and most "works on my machine" conversations. The infra cost is trivial next to the meeting cost it kills.
- Trustworthy previews need production-parity builds, seeded realistic data, and fast first loads. An unseeded preview teaches reviewers to stop clicking.
- Keep the architecture boring: one CI workflow, relative paths, seeded containers, a nightly reaper. Complexity belongs in the product, not the pipeline.
- Treat previews as real infrastructure — monitored, reaped, posted where people already look — or they'll quietly rot.
- The real payoff is cultural: weekly demos become links, stakeholders review by observing instead of imagining, and misalignment surfaces in week two instead of week nine.

## FAQ

**Do preview environments make sense for a small team?** Small teams benefit the most, because they have the fewest people to absorb the cost of review ceremonies. A two-person studio shipping to a client gets more from previews than a fifty-person company that has QA departments to paper over the gap. The setup is a day; the payoff starts the same week.

**How do you handle secrets and third-party integrations in previews?** You don't point previews at production anything. Every external service gets a sandbox mode or a stub: payment providers have test modes, email gets captured by a mail trap, analytics get a preview property. The rule is that a preview must be able to send, charge, and email absolutely nothing real. If an integration has no sandbox, that's a vendor evaluation criterion, not an exception.

**What about databases in previews — one database per PR?** Usually yes, and it's more reasonable than it sounds: a small Postgres container with the seed loaded on boot costs almost nothing and starts in seconds. Shared preview databases are where cross-contamination and mysterious failing reviews live. Exceptions exist for heavyweight data pipelines, where a per-PR schema on a shared instance is the pragmatic middle ground — but isolate by default.

**How do previews interact with feature flags?** Previews should boot with production's flag defaults so the reviewer sees what will ship, with a visible toggle panel for flipping flags in-session. Flags that are permanently different in previews create exactly the parity drift that makes people distrust the environment.

---

*Want a pipeline where every change is a link you can click? That's how we run every engagement, from [websites](/services/websites) to full product builds — [come see how we work](/approach) or [start a conversation](/contact).*
