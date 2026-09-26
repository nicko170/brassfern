---
title: "Verdigris Archive: 80,000 botanical plates, searchable in a blink"
description: "A botanical museum put 80,000 plates online with fast faceted search, a deep-zoom viewer and public-domain downloads. Search success rose 63%."
slug: verdigris-archive-digital-collection
cluster: work
tags: [digital archives, search UX, faceted search, museums, performance]
date: 2026-05-21
author: Leonie Marsh
keywords:
  - digital archive case study
  - museum collection online
  - faceted search ux
  - deep zoom viewer
readingTime: 10
client: Verdigris Archive
industry: Media & culture
services: [Websites, Product design & engineering]
year: 2026
stack: [React, TypeScript, Meilisearch, Node, Postgres]
heroImage: /images/work/verdigris-archive-digital-collection.jpg
heroAlt: "Editorial flat-lay of antique botanical plates — engraved ferns and seed pods in fern green and brass on cream paper — with a brass magnifying loupe, for the Verdigris Archive case study."
---

Verdigris Archive is a fictional museum with a very real problem: eighty thousand hand-drawn botanical plates — three centuries of engravings, watercolours and lithographs, most of them public domain — and a website where finding one required either luck or a librarian's phone number. The collection was a treasure. The interface was a filing cabinet photographed from a distance.

The archive's remit is unusual and lovely: collect, preserve and *share*. Not share in the vague museum-mission sense — share literally. Every out-of-copyright plate is free to download, print, publish, teach with. Teachers use the plates in science and art classes; printmakers buy the high-res scans; researchers cite them. The website was failing all three audiences simultaneously, and the museum's director, Dr. Ines Farrow, knew it: "We have one of the great teaching collections in the country and a search box that behaves like it resents you."

As with everything on this concept site, the numbers below are illustrative. The craft is not.

## The challenge

Two weeks of discovery — desk research, educator interviews, a lot of time in the physical reading room — mapped the failure clearly:

- **Search assumed foreknowledge.** The old catalogue searched accession metadata: Latin binomials, artist names, catalogue numbers. A Year 9 art teacher looking for "blue flowers, dramatic, big leaves" got nothing. Researchers' queries and teachers' queries share almost no vocabulary, and the system served only the former — barely.
- **Non-searchable attributes were the whole point.** Colour, composition, bloom density, "feels like spring" — the things people actually choose botanical illustrations by lived nowhere in the data. The metadata described provenance when visitors needed appearance.
- **Images you couldn't look at.** Scans existed at gorgeous resolution but the viewer served a single 900-pixel JPEG behind a broken zoom tool. For a collection whose value is *detail* — vein structure, stipple technique, marginal annotations — this was like locking the cases.
- **Downloads were a favour.** Getting a usable file meant emailing staff. Three to five days. In 2025, for public-domain work, this was a quiet scandal, and the educators who should have been the collection's loudest advocates had quietly built workarounds instead.

The pattern rhymed strongly with our work on the [regional museums postcard archive](/work/postcards-museum-archive) — small teams, magnificent holdings, interfaces built for cataloguers rather than visitors — but Verdigris added a twist: an audience (teachers) with a curriculum calendar and no patience at all.

## The approach

**Metadata for the eyes, not just the ledger.** Before any interface work, we ran an enrichment pass over the collection: colour-profile analysis tagging dominant hues per plate, structured tags for genre (scientific plate, decorative, pattern sheet), subject-level and whole-plate composition flags, plus the existing scholarly metadata kept pristine at its own level. Scholarly and visual metadata live in separate layers with separate vocabularies, so the librarian's truth and the teacher's question can both be answered without corrupting each other. Eighty thousand plates sounds like a tagging mountain; in practice, colour extraction is scriptable, structure is chunkable, and the museum's volunteers handled the judgement calls through a small review tool we built for the purpose.

**Faceted search that behaves like a conversation.** The search experience — Meilisearch behind a React front end — starts from a single generous box and exposes facets that match how the three audiences actually browse: colour swatches you can click, species and common names side by side, artist, decade, plate type, orientation. Every facet is a filter AND a suggestion; every empty result state offers the nearest fruitful combination instead of a dead end. Sub-100ms responses keep the loop playful — speed is what turns "search" into "rummage", and rummaging is where these collections win. The general principles are in our notes on [search UX](/journal/product/search-ux-product) and on [rolling a search index at build time](/journal/engineering/rolling-your-own-search); Verdigris is the largest catalogue we've applied them to.

**A deep-zoom viewer that respects the work.** We built a tiled, progressive deep-zoom viewer so a visitor can travel from whole plate to the pressure lines of an engraver's burin without a loading state that lies. Zoom and pan are butter-smooth on decent hardware and honest on bad hardware — the viewer degrades to stepped zooms rather than stuttering, per our long-standing rule that perceived smoothness beats nominal fidelity (we've written before about [art-directing images for the responsive web](/journal/web-design/image-art-direction-web), and the same discipline applies here). Keyboard navigation and full alt descriptions are first-class: a plate is a document, and documents deserve text.

**Educator collections, set up like a shelf.** Teachers can create accounts, build collections ("Year 9 pattern & repetition", "Pollinators week"), annotate them, and share them with a link — no student accounts needed, a deliberate privacy line. We seeded the shelf ourselves: twenty-four curriculum-aligned starter collections, built with three working teachers during the engagement, so a first-time educator lands on something useful within ten seconds. The first good experience of an archive should never be an empty one.

**Downloads with the manners of a public institution.** Every public-domain plate offers instant download at three sizes, with a citation block you can copy and a licence statement in plain words ("Yours. Print it. Teach with it. Credit the archive — it keeps us funded."). The polite ask replaced the permission gate, and the citation format — collection, artist, accession — spreads the archive's name into classrooms and captions exactly as intended.

**Performance as preservation.** The whole site is statically rendered where it can be, edge-cached everywhere, and held to a strict image budget — which matters doubly for a collection visited on school laptops and regional connections. Details of the build are on the work page itself; the pipeline owes a lot to what we learned running [our website practice](/services/websites) on editorial-grade image collections.

## The outcome

Illustrative outcomes across the first full school term:

- **Search success — query to a visitor reaching a plate page — up 63%.** The "resentful search box" now resolves, and the most-clicked facet is colour, exactly as the desk research predicted and the old metadata couldn't express.
- **2,400 educator accounts in term one**, against a project goal of 800. The seeded starter collections did the heavy lifting: most new educators adopt one whole, then start remixing within a fortnight.
- **Downloads up roughly sixfold**, running at around 30,000 plates a term — which is the collection's mission, finally quantified. Print-on-demand sales of high-res scans rose alongside, a pleasing rebuttal to the fear that free downloads cannibalise paid ones. Generosity, it turns out, is a funnel.
- **Zero help-desk emails about downloading.** The mailbox that used to field three-to-five-day file requests now, mostly, receives thank-yous. It's a strange and wonderful metric to watch flatline.

"The collection finally behaves like it's ours to give," Dr Farrow said at the launch. It was always theirs to give. It just needed a door proportionate to the treasure behind it.

If you're sitting on a collection — archival, editorial or commercial — that deserves a better door, this is the kind of build we love most. Start the conversation via our [contact form](/contact).
