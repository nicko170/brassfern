---
title: "Template galleries: the shortcut to the aha moment"
description: "Starter templates are onboarding's best shortcut — if they're categorised by job not industry, previewed live, pruned ruthlessly and measured to activation, not clicks."
slug: template-galleries-onboarding
cluster: product
tags: [templates, onboarding, activation, empty states, product design]
date: 2025-06-24
author: June Okafor
keywords: [template gallery ux, product onboarding templates, starter content design, activation metrics design, blank slate problem]
readingTime: 8
---

The blank canvas is a threat. A new user signs up for your project tool, your analytics suite, your newsletter platform — and the product responds with an empty rectangle and the implicit instruction: *go on, then, imagine your own value.* Most users can't, on demand, in the ninety seconds they've allotted you. They close the tab. Not because your product is bad, but because you asked them to do the hardest job in product adoption — picturing a future state — with the least possible material.

Templates exist to collapse that distance. Done well, a template gallery is the shortest path from signup to the aha moment: the user picks something that looks like their problem, sees it populated with plausible content, and thinks *oh, it's for people like me.* Done badly, it's a wall of near-identical screenshots categorised by marketing vertical, and the user picks at random and inherits someone else's mess. This piece is how we design the good kind: it's a companion to our [onboarding checklist patterns](/journal/product/onboarding-checklist-patterns) and the [metrics that make activation honest](/journal/product/activation-metrics-honest).

## Categorise by job, not industry

Open most template galleries and you'll find the same taxonomy: Marketing, Sales, Agencies, Education, Real Estate. It feels organised. It solves the wrong problem. A marketing manager in real estate and a marketing manager in SaaS have nearly identical jobs-to-be-done and wildly different logos; the industry tabs make her choose based on the label she answers to, not the task she's trying to complete.

The taxonomy that converts is organised by **job and outcome**: "Track a project," "Report to my board," "Launch a newsletter," "Onboard new hires." Each category answers the question the user is actually asking — *can this do my thing?* — and each template name inside it is a sentence of use, not a brand of vibe: "Weekly exec summary with automated variance notes," not "Synergy Pro."

How do you find the jobs? The same way you find any honest taxonomy: ask the people who just hired you. A dozen well-run [jobs-to-be-done interviews](/journal/product/jobs-to-be-done-interviews) with users in their first two weeks will surface the four to eight jobs that cover most signups. Sort by frequency, and that sorted list is your gallery's information architecture. For Northwind Ledger — a fictional-but-typical small-business accounting product — the shift from industry tabs ("Retail," "Trades," "Professional services") to job tabs ("Chase unpaid invoices," "Understand where the money went," "Get ready for the accountant") roughly doubled template adoption, because users could finally find themselves on the shelf.

A residual industry layer is useful as a *filter*, not the primary axis: the job gets the tab; the industry gets a chip. And cap the visible categories. Eight jobs, legibly named, beat thirty verticals every time — the gallery is a menu, not an archive.

## Live preview beats screenshot, and both beat description

The evaluation moment is everything: the user hovers between templates trying to decide which one is "theirs." What they need is to *see the product working on plausible data* — not a description of features, and ideally not a static screenshot either.

The hierarchy we build toward:

1. **A rendered, interactive preview** populated with realistic fictional content. The user clicks around a live board, dashboard or report — nothing saves, everything is labelled "Preview." This is the strongest possible aha delivery mechanism, because it demonstrates value in the product's own voice rather than asserting it in copy. It costs more to build (templates must be real, loadable configurations, which constrains your content model for the better) and it pays for itself in conversion.
2. **A zoomable static snapshot** with the fake data visible and legible. Notice what makes screenshots fail: lorem ipsum, or worse, real-seeming-but-generic numbers ("Project A, Task 1, Due soon"). Plausible data *is* the preview. Write template content the way you'd write any [empty state](/journal/product/empty-states-design) — as product marketing that happens to be data.
3. **Never** a paragraph of features with a thumbnail the size of a postage stamp.

Two preview details obsess us. First, show the template *populated* — a blank template is just an empty state in a trench coat. Second, include a "what you get" line: three bullets naming what's pre-built (views, automations, sample content), which sets expectations honestly and pre-answers the inevitable "wait, do I have to build the other half myself?"

## The blank option: placement is positioning

Every gallery needs a "Start from scratch" option, and where you put it is a strategic decision. Burying it is a dark pattern — power users resent being herded — but leading with it recreates the blank-canvas threat with extra steps. The placement that respects everyone: blank goes **last in the grid**, visually equal to templates but clearly the road less travelled ("Blank project — start empty"), and **first for returning users** who've already used a template, since they've demonstrated they know what they're making.

One exception: if your product's core loop is creative expression (design tools, writing tools), blank is the hero and templates are the shortcuts. Know which product you are. Project-management software is not a sketchbook.

## Governance: the gallery is a garden, not a launch

Here's where most template programmes die: consumption is everyone's priority at launch and nobody's job thereafter. Six months later the gallery holds forty templates, twelve of which encode last year's best practice, four of which are broken by a feature change, and one of which gets 60% of all picks — data nobody is reading.

Template governance, written down before the gallery ships:

- **Every template has an owner.** Not a team — a person, named, whose quarterly job includes checking that their templates still encode current best practice and still work against the current product.
- **A quality bar with teeth.** Each template must demonstrate a complete job end-to-end, use realistic content, avoid premium features a trial user can't access (nothing curdles trust like importing a template that paywalls itself), and run under a minute from pick to populated.
- **A pruning rule.** Any template under a usage threshold for two consecutive quarters gets retired or reworked. A gallery of eight excellent templates outperforms a gallery of forty adequate ones; choice load is a tax on activation. We keep a museum mentality about this — [curating settings](/journal/product/settings-design-neglected-ux) and curating templates are the same discipline: the catalogue you *don't* show is a design decision too.

## Measure template-to-activation, not template clicks

The metric that matters is not "templates viewed" or even "template applied." It's the causal chain: **picked → populated → first genuine edit → activation metric hit.** Instrument every link in it.

The diagnostics it gives you are worth the event-schema work. If picks are high but first edits are low, previews are over-promising — the live product doesn't match the movie. If edits are high but activation is low, templates are teaching the wrong first behaviours, or your activation metric is mis-set (which is its own essay — see [the one above](/journal/product/activation-metrics-honest)). And segment by template: the gap between your best and worst templates' activation rates *is* your pruning list, written in numbers.

A note on honesty in measurement: comparing template users to non-template users flatters templates, because motivated users self-select into them. The cleaner read is the trend after each taxonomy or preview improvement — did template-user activation *move*? — plus a headline number you report with the selection caveat attached. Templates are a lever inside an [onboarding system](/services/product), not a magic metric; the teams who treat them as magic get fooled, and the ones who instrument the full chain keep compounding.

## Key takeaways

- Categorise templates by job-to-be-done, validated with recent-signup interviews; industry is a filter chip, not a tab.
- Previews should be interactive and populated with realistic content; plausible fake data is the preview.
- "Start blank" goes last in the grid for new users, first for returning ones — unless expression is your product's core loop.
- Every template needs a named owner, a working quality bar, and a pruning rule tied to usage.
- Measure the chain pick → populated → first edit → activation, and report template-vs-blank lifts with the self-selection caveat attached.

## FAQ

**How many templates should we launch with?**
Six to ten — one per major job, plus blank. Launch small and earn the right to expand; every added template is a maintenance obligation, not an asset.

**Should templates include sample automations and integrations?**
Yes for automations (they're the wow), cautiously for integrations — only if they degrade gracefully when unconfigured. A template that demos a Slack integration the user doesn't use just demonstrates absence.

**Community-submitted templates: worth it?**
Eventually, for platform-shaped products with healthy usage. Not at launch. Community galleries need submission tooling, review queues and IP hygiene; build the owned gallery, learn what quality means, then invite the crowd. Letting users publish "share my setup" links, however, is cheap and worth doing early — organic templates are a leading indicator of the jobs you haven't templated yet.

**Do templates work for technical products — APIs, dev tools?**
The equivalent is starter repos, example queries and seeded sandboxes. Same principle, different artefact: collapse the distance to the first success. A dashboard with three days of realistic synthetic history beats an empty chart with a docs link every time — it's why our own [demo lab](/lab) shows products populated, never pristine.
