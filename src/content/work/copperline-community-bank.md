---
title: "Copperline Mutual: a community bank that sounds human"
description: "How a voice overhaul and an accessibility-first platform rebuild helped a fictional mutual bank turn plain language into its sharpest competitive edge."
slug: copperline-community-bank
cluster: work
tags: [financial services, brand voice, accessibility, design system, content design]
date: 2025-08-22
author: Leonie Marsh
keywords: [bank website case study, financial services ux, plain language content design, accessible design system, mutual bank rebrand]
readingTime: 8
client: Copperline Mutual
industry: Fintech
services: [Brand & identity, Websites, Product design & engineering]
year: 2025
stack: [React, TypeScript, Sanity, Design tokens, Storybook, Playwright]
heroImage: /images/work/copperline-community-bank.jpg
heroAlt: "A warm bank-counter still life: a brass teller lamp, stacked paper ledgers and a pressed fern on cream paper."
---

Copperline Mutual is the sort of bank that still knows its customers' names. Eleven branches across regional Victoria, 40,000 members, a phone answered by a person on the second ring. What it did *not* have was a website that sounded like any of that. Its digital presence read like every mid-tier bank in the country: "competitive rates", "flexible solutions", "a range of products to suit your needs". Sentences with no pulse.

## The challenge

The brief from CEO Maree Callahan was unusual in its honesty: "We're the nice bank. Nothing on our website is nice."

She was right, and the audits proved it. Our content review scored the fifty most-visited pages for plain language: average reading grade 14 — postgraduate level — on pages aimed at pensioners comparing term deposits. A first-home-loan page used the word "remuneration". Twice. The accessibility picture was worse: the old platform failed 31 of the 50 WCAG 2.2 AA success criteria we test as standard, including focus order on the loan calculator and contrast on every primary button. For a bank whose membership skews older and rural, that wasn't a compliance footnote. It was the product.

The commercial problem sat on top. Comparison sites were eating Copperline's search traffic, application abandonment sat at 68%, and the contact centre fielded roughly 900 calls a month that started with "I was looking at your website and I couldn't understand…". Trust was Copperline's only moat, and the website was draining it.

## The approach

### Voice first, pixels second

Most bank redesigns start with layouts. We started with a style trie: forty pages of the existing site rewritten in what we came to call the Counter Voice — the way a good teller actually explains things. Short sentences. Numbers before adjectives. Jargon translated or deleted. "Our comparison rate is calculated on a loan of $30,000 over 5 years" instead of the regulatory foghorn version. Compliance reviewed every word; the surprise was how little they objected once we showed that plain language and accurate language are usually the same language.

This became a 22-page voice guide — not a PDF destined for a drawer but a section of the new site itself, with before/after examples the content team could steal from. It's the same philosophy behind the generative identity tool in our [Hearthbrew brand system work](/work/hearthbrew-brand-system): give people a machine, not a monument.

### An accessibility-first component library

The engineering build inverted the usual order. Before a single marketing page, we shipped the component library: 34 components, every one tested against WCAG 2.2 AA *before* it was allowed into Storybook, with focus management and keyboard behaviour treated as acceptance criteria rather than ticket fodder. The loan calculators — the highest-stakes UI on the site — got genuine amount sliders with full keyboard and screen-reader parity, not drag-only widgets.

Tokens flowed straight from the Figma library into CSS custom properties via the pipeline we describe as standard practice in our [websites service](/services/websites), so the "Copperline ochre" in the style guide and the one in production are literally the same value. Automated axe checks run in CI on every pull request; a component that regresses a single criterion fails the build. Unforgiving, and that's the point.

### Product pages that answer the real question

We rewrote the product page template around the questions members actually ask the contact centre, in the order they ask them: what does it cost, what do I get, what's the catch, how do I switch. "What's the catch" became a labelled section on every product page — fees, conditions and exit costs in plain sight. Half of banking UX is the confidence to say the quiet part. Structured data and genuinely useful content did the SEO work that keyword pages never could, an approach our [growth practice](/services/growth) has now standardised across financial clients.

### The calculator, rebuilt as a conversation

The borrowing calculator was the site's most-used and most-rage-inducing feature, so we rebuilt it around the question members actually have — "what would this cost me a fortnight?" — instead of the bank's internal framing. Sliders pair with plain text inputs (arthritis exists; so do exact numbers), results update instantly with no submit button, and every figure is annotated in the Counter Voice: what the comparison rate includes, what it hides, what happens if rates move. The old calculator ended in a lead-capture form. The new one ends in a decision, with the form offered only after the answer. Completion rose; complaints about "sneaky banking" fell to zero. It turns out the trust move and the conversion move are frequently the same move.

## The outcome

Launch came fourteen weeks after kickoff, inside the fixed sprint scope. The [metrics below are illustrative figures from this fictional concept project](#):

| Metric | Before | After |
| --- | --- | --- |
| Reading grade, top 50 pages | 14 | 7 |
| WCAG 2.2 AA failures (our 50-criteria audit) | 31 | 0 |
| Application completion rate | 32% | 57% (illustrative) |
| "I couldn't understand the website" calls / month | ~900 | ~310 |
| Organic clicks to product pages | baseline | +41% (illustrative, 6 months) |

The number Maree quotes most isn't any of those. It's the email from a 78-year-old member in Warrnambool who wrote, unprompted, that he had read the term deposit page "all the way through, twice, because it was a pleasure". A bank webpage as a pleasure. That's the whole strategy in one sentence.

> "The other banks have bigger budgets. We have a website that talks to people like people. Six months in, I'd put it against any of them." — Maree Callahan, CEO, Copperline Mutual (fictional)

## Stack & credits

- **Voice & content:** voice guide, 200 pages rewritten, compliance review workflow
- **Design:** identity refresh, component library, editorial templates in Figma
- **Engineering:** React + TypeScript front end, Sanity CMS, design tokens pipeline, axe-in-CI accessibility gates
- **Accessibility:** WCAG 2.2 AA audit, assistive-technology testing sessions with members
- **Squad:** content lead, design director, two engineers, producer — [how our squads work](/approach)
- **More on this work:** our [fintech industry page](/industries/fintech) · Planning a platform rebuild? [Start a project](/contact)
