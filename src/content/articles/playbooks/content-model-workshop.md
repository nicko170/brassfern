---
title: "Running a content model workshop before the design starts"
description: "A two-hour workshop format that produces a real CMS content model — index cards, cardinality questions, naming rules — before anyone draws a single page."
slug: content-model-workshop
cluster: playbooks
tags: [content modelling, headless CMS, workshops, content strategy, process]
date: 2026-04-14
author: Leonie Marsh
keywords: [content modelling workshop, headless CMS planning, content model, CMS design]
readingTime: 9
---

Every broken CMS we've ever inherited was broken the same way: the model was designed by whoever set up the CMS, in an afternoon, while the design was already underway. Articles became pages, pages became "flexible content" — the two saddest words in content management — and by launch day the editors were doing layout in raw HTML fields and hating everyone.

The fix is not a better CMS. It's two hours with sticky notes before anyone opens Figma. Here's the workshop we run, exactly as we run it, including the questions that feel pedantic in the room and save the project in month four.

## Why before design, not during

Design and content modelling constrain each other, and the order matters. When the model comes after the design, the model gets reverse-engineered from screenshots — which means every editorial reality (an article with two authors, a product that's sometimes out of stock, a page that exists in Welsh) becomes a hack. When the model comes first, honestly drawn, the design inherits real shapes to work with. The designer knows an author can have zero to many articles, that a case study has exactly one client, that some testimonials are two sentences and some are four paragraphs. Surfaces get designed to the actual grain of the content.

This is the same argument we make about drawing the [sitemap before anyone opens Figma](/journal/web-design/sitemap-as-ux-artifact): structure precedes surface, always, because surfaces are cheap to change and structures are not.

## The room and the kit

Ninety minutes is the minimum, two hours is comfortable. You need:

- **The editor who will actually live in the CMS.** Not the marketing director — the person who publishes on Tuesdays. This is non-negotiable. If they can't attend, reschedule.
- **One designer, one engineer, one strategist** from the build team.
- **Someone who owns the business logic** — product manager, founder, whoever can answer "can an event belong to two series?"
- **Index cards in three colours** (entities, fields, relationships), painter's tape, and a wall. Digital whiteboards work remotely, but physical cards force a useful scarcity: you can't make forty entity types when you have twenty cards left.

One facilitator. Their job is to keep the room answering questions about the world, not about preferences. "Should a recipe have a hero image?" is the world. "Should the hero image be on the left?" is a preference, and it gets parked.

## Act one: nouns on cards (25 minutes)

Ask the room: *what are the things this site is made of?* Not pages — things. People write them on cards, one per card, as fast as they can. Verbatim nouns, no editing.

This produces the usual suspects (Article, Author, Product, Event) and the interesting ones (Ingredient, Certification, Team Member's Favourite, That PDF Legal Insists On). The facilitator's job in this phase is only to push past pages. When someone writes "About page," ask what the about page is *made of*. Story chapters? Timeline entries? Photos with captions? Those are entities; the page is a rendering.

Expect 15–40 cards. More than 40 and the room is modelling every edge case; fewer than 12 and they're modelling a brochure. Both are diagnosable.

## Act two: fields and the honesty pass (30 minutes)

Take each entity card and surround it with field cards: title, body, date, photo, price. Then run the honesty pass — the questions that feel trivial and aren't:

- **Is this field required?** Not "should it be" — will there ever be a real instance without it? A quote without attribution? An event without a date? Optional fields are debts: every one is a conditional in every template forever. When we [model for a headless CMS](/services/websites), required-by-default is the house rule and every exception gets named.
- **Is this one value or many?** An article with one author or several? A product with one image or a gallery? This is the cardinality question, and it deserves its own act — see below.
- **Is this structured or prose?** "Opening hours" feels like a text field until someone needs "open now?" logic at 9pm on a public holiday. If a machine will ever need to reason about the value, structure it now.
- **Who owns keeping this true?** A field nobody maintains becomes a field that lies. If there's no owner, cut the field. This is the most content-strategic sentence in the whole workshop.

As fields accumulate, watch for the same field appearing on five entities. That's the model telling you there's a missing entity — "speaker" appearing on Event, Article and Podcast Episode means Speaker wants to be its own card with a biography that lives in one place.

## Act three: cardinality, the part that hurts (30 minutes)

Draw the relationships between entity cards with tape, and at each end write the number: one or many. Author *writes* many Articles; Article *has* one-or-many Authors. Case Study *belongs to* exactly one Client; Client *has* many Case Studies.

Cardinality is where content models go to be wrong, because the answer in the room is always "one, probably" and the answer in production is "many, occasionally, and the template breaks." Three questions force the truth:

1. **"Has it ever been more than one?"** Dig through the archive. Somewhere in 2019's blog there's a co-authored post, and now your `author` field is the wrong shape.
2. **"Who would be annoyed if we capped it?"** If the answer is "the events team, immediately," it's many.
3. **"What's the rendering cost of many?"** One-to-many relationships make designs honest. A case study grid that must handle one testimonial *or five* is designed once, correctly, with the variation visible in Figma rather than discovered in production.

Get these right and the CMS schema practically writes itself. Get them wrong and you get what we inherited on a retail project last year: a `relatedProduct` (singular) field holding comma-separated SKUs. Someone had typed commas into a text field because the model said one and the world said twelve.

## Act four: naming, the diplomacy (20 minutes)

Last, name everything, in front of the editors, out loud. Naming conventions sound like bikeshedding until you're six months into a CMS where one field is `bodyText`, another is `Content`, and a third is `content_blocks_final_FINAL`.

Our rules, offered as a starting point:

- **Entity names are singular nouns in the editors' vocabulary.** They say "story," not "article"? Then the entity is Story. The CMS is the editors' tool; the API can translate.
- **Field names describe the content, not the presentation.** `summary`, not `greyTextUnderTitle`. Presentation changes on redesigns; meaning doesn't.
- **Booleans are phrased as true statements.** `isFeatured`, not `featuredFlag`. Slugs are kebab-case, forever, no exceptions.
- **Nothing is named after the current design.** We once untangled a field called `heroWeirdWavyThing`. The wave lasted one redesign; the field name lasted four years and three confused agencies.

Write the names on the cards in marker. This is the schema. Photograph the wall.

## What the workshop produces (and what it forbids)

The deliverable is five artefacts, produced within two days while the wall is still warm: an entity list with one-sentence definitions, a field table with required/optional and structured/prose flags, a relationship diagram with cardinalities, a naming sheet, and — the secret weapon — **a list of things the model does not support**. That last list is a gift. "The model does not support events that belong to two series" is a sentence that kills a six-week scope argument in a kickoff meeting. Constraints stated in April are planning; constraints discovered in September are change orders. We cover the drama-free version of that conversation in [scope change without drama](/journal/playbooks/scope-change-without-drama), but the best scope change is the one the model made unnecessary.

The model then constrains design honestly. When a designer proposes a "latest thinking" band on the homepage, everyone can see it needs Articles tagged by topic — a relationship that either exists or gets added deliberately. No more designs built on content that does not exist, which is the quiet cause of half the launch delays we've ever seen. (The other half is words arriving late, which is why we run the [content handover workflow](/journal/playbooks/content-handover-workflow) in parallel, not at the end.)

This workshop sits inside the first week of our [discovery sprints](/journal/playbooks/discovery-sprint-playbook) whenever a CMS is involved. Two hours, some index cards, and the entire downsteam project gets easier: estimates tighten because entities are countable, migrations get planned because fields have owners, and the editor who will live in the system has already shaped it — which, twelve months after launch, is the difference between a CMS that's loved and one that's worked around.

## Key takeaways

- Model the content *before* the design; surfaces are cheap to change, structures aren't.
- The person who publishes on Tuesdays must be in the room. Reschedule for them.
- Cards in three colours: entities, fields, relationships. Physical scarcity is a feature.
- Required-by-default, structured-if-a-machine-ever-needs-it, owned-or-cut. Every optional field is a debt.
- Ask cardinality in the interrogative past: "has it ever been more than one?"
- Name fields for meaning, never presentation — `summary`, not `greyTextUnderTitle`.
- Ship a list of what the model does *not* support. Stated constraints are planning; discovered ones are change orders.

## FAQ

**Do we need this for a small site — five pages and a blog?**
Yes, but scale it down: forty minutes, ten cards. The questions don't shrink with the site. A five-page site still has authors, still has required-versus-optional, and still gets a CMS schema someone will inherit.

**Can't the CMS's AI scaffolding / starter template generate the model?**
It can generate *a* model — usually Article, Page, Author with a heroic number of optional fields. It cannot tell you whether your events can belong to two series, who maintains the certifications list, or that your editors say "story." The tool is never the problem; the unasked questions are.

**Who should facilitate?**
Someone with no fields to defend. A facilitator advocating their own schema design will steer the room into it. We bring a strategist or producer — anyone who can ask "has it ever been more than one?" a dozen times without blushing.

**What if the model changes mid-project?**
It will — the point is that changes become visible, priced decisions instead of silent drift. A new entity is a conversation: what does it cost in schema, templates, migration and editor training? Model-first projects handle this calmly because there's a picture of what changed.

**How does this relate to information architecture?**
The IA decides what the *site* is made of — the [information architecture of a marketing site](/journal/growth/marketing-site-ia) is navigation, hierarchy, user intent. The content model decides what the *CMS* is made of. They overlap in entities but answer different questions, and confusing them produces models full of "pages" again. Run the IA first by a week, then model what the IA surfaces actually are.
