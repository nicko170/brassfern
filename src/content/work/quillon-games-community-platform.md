---
title: "Quillon Games — a community platform for a two-studio indie label"
description: "A two-studio indie label trades a scattered Discord for a community hub: patch notes that rank, roadmap voting, and a moderated fan-creation gallery."
slug: quillon-games-community-platform
cluster: work
tags:
  - case study
  - games
  - community
  - media
  - moderation
date: 2026-02-16
author: Leonie Marsh
keywords:
  - games community platform case study
  - indie game studio website
  - patch notes seo
  - community moderation tooling
  - fan content gallery
readingTime: 10 min read
client: Quillon Games
industry: Media & culture
services:
  - Product design & engineering
  - Brand & identity
year: 2026
stack:
  - React
  - TypeScript
  - Node
  - Postgres
  - Meilisearch
---

Quillon Games is a fictional-but-plausible indie label with two studios under one roof: Lantern Cub, shipping a beloved-but-ageing farming sim, and Northlass, eighteen months from launching an atmospheric sailing game with a growing wishlist. Fourteen developers total. Their community lived where indie communities live — a Discord server with 31,000 members, four volunteer moderators, and a search function that could find nothing.

The label's problem wasn't reach; it was gravity. Every announcement, patch note, dev diary and fan artwork disappeared into the scroll within a day. Launch week for Northlass's game would arrive with no owned surface to receive it. Here's the platform we built them instead. All figures are illustrative; the trajectory is true to the work.

## The challenge

Games studios have a strange relationship with the web: they ship software for a living, then run their entire public presence on platforms they don't control. Quillon's specifics made the gap acute.

First, **patch notes are a studio's most-read writing and its least findable.** Lantern Cub's five years of updates existed as Discord pins and a contemptible wiki. Players searching "Lantern Cub update 1.14" found forum arguments, not the notes. Second, **two studios, two tones**: Lantern Cub is cosy and whimsical; Northlass is moody and quiet. One platform had to host both without averaging them into beige. Third — the hard one — **moderation.** A fan-creation gallery was the most requested feature, and the studios' lawyers and volunteers alike were terrified of it. A gallery without serious tooling is a liability with thumbnails.

And a constraint that shaped everything: fourteen developers have no spare engineers for a community platform. Whatever we built had to be operated by community managers, not maintained by a dev team.

## The approach

**Patch notes as first-class, indexable documents.** Every update is a real page: human-readable slug, semantic version in the URL, structured data for search engines, per-game RSS feeds, and a diff-style "since you last visited" view for returning players. Notes are written in the studios' voices and rendered beautifully — screenshots with proper alt text, video with transcripts. This is the [changelog-as-marketing](/journal/growth/changelog-as-marketing) thesis applied in earnest: your update cadence *is* your content strategy. Within three months, "Lantern Cub patch notes" queries stopped returning the wiki at all.

**Seasonal theming as a system, not a re-skin.** Both studios needed the platform to wear their game's mood — including seasonal events, which indie communities treat as holidays. We built a token-driven theming layer: each game space owns its palette, display face and texture set, swappable per season by the community team with zero deploys. It's the same discipline as [seasonal theming without a rebrand](/journal/web-design/seasonal-theming-without-rebrand) and our broader [multi-property brand systems work](/journal/web-design/multisite-brand-systems) — variation through tokens, never through forked CSS. Lantern Cub's harvest event and Northlass's fog-drenched pre-launch look share 100% of their components and 0% of their mood.

**Roadmap voting with a steering wheel, not a democracy costume.** Players vote on a curated set of candidate features; every card carries a developer-written "what this would actually cost" note, and shipped items close the loop visibly ("you asked; it's live"). Votes inform but don't trap the roadmap — the studios are honest that they're building a game, not administering a plebiscite. Engagement stayed high precisely because the framing is honest.

**The gallery, with moderation built before the upload button.** This was the make-or-break feature, designed in the order that mattered: reporting flows, triage queues, audit trails and moderator tooling *first*, public upload *last*. Community managers work from a single queue with keyboard-driven triage, canned-and-customisable responses, and a reputation model where consistently-good contributors earn faster review rather than immunity. Search across the whole platform — notes, roadmaps, gallery metadata — runs on Meilisearch, tuned per our thinking on [site search as research](/journal/growth/internal-search-mining): the search logs are now the studios' most-listened-to audience signal.

## The outcome

Six months after launch, with Northlass's release announced on-platform:

- **Patch-note pages became the platform's front door**: organic search to patch notes grew from effectively zero to 61% of platform traffic, and the average note now outranks every third-party summary of it.
- **Wishlist conversion for Northlass's game quadrupled** in the window around the launch announcement, driven by the dev-diary series living at permanent, shareable URLs rather than Discord scrollback.
- **Community-manager moderation time runs at ~35 minutes a day** across 2,100 gallery submissions in the first six months — the tooling cost more to build than the gallery view did, and it was the right allocation every single day since.
- **The Discord didn't die; it got better.** With the platform absorbing durable content, the server returned to what it's good at: chat. Volunteer moderator burnout visibly eased.
- **Studio newsletters grew 3×**, fed by RSS-and-email subscriptions to patch notes and dev diaries — the owned audience the label had been renting for a decade, finally deeded over. The broader playbook here rhymes with what we built for [Holloway Records](/work/holloway-records-label-site) and [Signal & Noise](/work/signal-and-noise-podcast-network): media brands need homes, not presences.

## Stack and team

React and TypeScript front end; Node API; Postgres for content, votes, submissions and audit trails; Meilisearch for instant, typo-tolerant search across everything. Theming is design-token-driven with per-game, per-season presets editable by the community team. Squad: two engineers, one designer, a brand designer on the token system, a producer, and both studios' community leads embedded throughout — our usual shape under [how we work](/approach).

## What we'd tell another studio

Discord is where your community talks. It cannot be where your community's history lives. Build the home, be honest about the steering wheel, and fund your moderators' tooling before your upload button. More on our [media work](/industries/media), more [case studies](/work), or [tell us what your community deserves](/contact).
