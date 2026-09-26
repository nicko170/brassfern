---
title: "Maps on the web: restraint and alternatives"
description: "A map is the most expensive component on most sites — in kilobytes, attention and accessibility. When a map earns it, how to design one that doesn't, and when a list wins."
slug: map-design-restraint
cluster: web-design
tags: [UX, maps, accessibility, performance, search design]
date: 2026-02-18
author: Aiko Tanaka
keywords: [map design web, map UX, location search UI, mapbox styling, accessible maps]
readingTime: 9
---

Every agency portfolio has the same screenshot: a dark, moody custom map, brass pins dropping in, the whole team quietly pleased. And every one of those maps, audited honestly, is doing the same job a sorted list would do — at forty times the JavaScript cost, with a keyboard experience that would make a screen-reader user weep.

Maps are the most over-reached-for component in web design. They're also genuinely irreplaceable in a handful of situations. Learning to tell the difference — and then designing the map you do ship with restraint — is a real skill. This is how we run the decision, and what "restraint" actually means in practice.

## The map audit: four conditions

We put every proposed map through the same gate. A map earns its place on the page only if **at least two** of these are true:

1. **Geography is the question.** The user's actual decision is spatial: "which clinic is near me," "what's available in this neighbourhood," "how far is the venue from the station." If the question is "what does it cost" or "which is best," the map is decoration.
2. **The reader brings a place.** The user arrives with a location in mind — an address, a suburb, "somewhere walkable" — and needs to relate your data to it. Exploratory browsing by region counts; reading an article does not.
3. **Density comparison matters.** Seeing *where things cluster* is the insight — coverage maps, outage maps, territory planning. One pin on a map is the saddest component on the web.
4. **Movement is the story.** Routes, deliveries, migrations, itineraries. A path through space is a map's native language.

A store locator page fails conditions one through three if you have three shops: distance and opening hours answer the question better. A property search passes all four, which is why our [Quarry property map demo](/lab/quarry-property-map) leads with the map and treats the list as the map's shadow. Run the audit before anyone styles a pin.

## If the map ships: mute it

The first design decision on any map is to turn down the map. Default tiles are designed to help people navigate the world; your tiles exist to help people read *your data against* the world. Those are different jobs and they want different contrast.

- **Strip the tile to a whisper.** Roads, water, parks, suburb labels at low contrast — that's the whole palette. Every POI icon, transit symbol and 3D building is noise competing with your pins. Most tile providers ship a "monochrome" or "light" style that is still two shades too loud; we usually build from the most minimal base and add back exactly three layers.
- **One accent for the data layer.** Pins, polygons and routes take your brand accent; the tile never does. If the water is brass, you've made a painting.
- **Labels that appear on zoom, not load.** Nothing at country zoom, suburbs at city zoom. Progressive disclosure applies to geography too.
- **Respect the user's map literacy.** People read maps through landmarks — the harbour, the river, the ring road. Removing *all* context makes a tile that looks clean and reads blank. Keep the two or three features locals navigate by.

## Pins, clusters and the sin of the rainbow marker

Marker design is where restraint normally dies. Rules we hold:

- **One shape, colour meaning one thing.** If pin colour encodes category, you need a legend, and legends on maps are read by nobody. Prefer one pin style plus filtering, or at most two states (available / taken).
- **Cluster early.** More than a dozen visible markers is noise; cluster at low zoom with counts in the cluster badge, and expand on zoom or tap. A cluster badge is a tiny chart — treat it with the honesty we apply to [data visualisation on marketing pages](/journal/web-design/charts-on-marketing-pages).
- **The cluster tap is a zoom, not a dead end.** Tapping a cluster must visibly move the map toward its children. If it just replaces one big number with smaller mess, you've shipped a slot machine.
- **Selection state is a real state.** Selected pin gets a distinct treatment *and* the corresponding list card highlights and scrolls into view. Map and list are one interface in two projections; keeping them in sync is the whole job.
- **Popovers close politely.** Esc closes, clicking away closes, focus returns to the pin. A map pin popover that traps focus is a modal wearing a moustache.

## The accessibility layer is a list (yes, again)

A map is a picture of a dataset, and the dataset is the content. The pattern that survives audits, and users:

- The canvas carries an accessible name and a text summary that updates — "Showing 14 properties in Surry Hills, prices $850k–$2.1M." A live region announces result-count changes when the viewport pans or filters apply, once, debounced. Not per-pin.
- Every result exists in a **real HTML list**, sorted, filterable without touching the map. This is not the degraded experience — for a keyboard user, a screen-reader user, or someone on a train with one bar of reception, the list *is* the product. We treat this as first-class design work; the patterns from [product search UX](/journal/product/search-ux-product) — query states, empty states, filter chips — apply to it verbatim.
- Keyboard users can move between results without the map; if you offer map keyboard controls (arrow keys pan, +/- zoom, Enter on a focused pin), say so in the UI. Undocumented shortcuts don't exist — see [engineering keyboard-first interfaces](/journal/engineering/keyboard-first-interfaces).
- With `prefers-reduced-motion`, pan animations become instant. A vestibular-sensitive user on a slippy, easing, gliding map is having a genuinely bad time.
- Never let the map hijack scroll. Scroll-wheel zoom on an embedded map is the web's original dark pattern; require a modifier (Ctrl/Cmd+scroll, two-finger pan) and tell the user about it in one unobtrusive line.

## The performance budget nobody sets

A full vector-map SDK is routinely 300–700 KB of JavaScript before a single tile downloads, plus a font stack, plus tiles, plus a main-thread tax on every pan. On a marketing site whose entire [bundle budget](/journal/engineering/bundle-budget-discipline) is 170 KB, that map is four websites standing on each other's shoulders in a trench coat.

The discipline that keeps maps affordable:

1. **Load on intent, not on mount.** Render a static image (or a stylised SVG placeholder) with a "Load interactive map" affordance, or lazy-load the SDK when the map section scrolls near. Most pages' most common user never pans the map; don't make them pay for it.
2. **Static maps are a feature, not a fallback.** For single-location pages — a contact page, an event venue — a rendered static image with a "directions" link is faster, prints better, and answers the question. The contact map on most sites should never have been interactive.
3. **Cap the interaction surface.** Disable 3D, pitch and bearing unless the demo needs them. Every enabled gesture is a support ticket and a battery.
4. **Budget the tiles on a mid-range phone.** Test panning on a real device over 4G. If the tile flapping is visible in Sydney, imagine Dubbo.

## When the list wins outright

Some battles aren't close:

- **Fewer than ~8 locations, no routes:** a list with suburb, distance-from-you, and hours wins. The map adds nothing but a screenshot for the portfolio.
- **SEO matters:** crawlers and answer engines read text. Location content belongs in HTML — the discipline in [location pages that earn their rankings](/journal/growth/local-pages-without-doorway-spam) — with the map as garnish, never as the content.
- **The decision is comparative, not spatial:** pricing tiers, plan options, menu items. These are tables and cards. We see them shipped as maps when someone in the kickoff says "make it visually exciting," and the fix is to find the visual excitement in the content itself.
- **Print and email contexts:** maps print badly and don't exist in email at all. Static images or text, every time.

A closing provocation you can use in your next design review: present the map page with the map removed and the list expanded. If nothing feels lost, the map was a screensaver. If something feels genuinely lost — the sense of place, the density, the neighbourhood context — now you know what the map is *for*, and you can design it to do exactly that and nothing else.

## Key takeaways

- Gate every map: geography-the-question, a brought location, density-as-insight, or movement-as-story. Fail the gate, ship a list.
- Mute the tile to a whisper; give the data layer your one accent; add labels with zoom, not at load.
- One pin shape; cluster early; selection state syncs map and list; popovers behave like civilised modals.
- The sorted HTML list is not the accessibility fallback — it is the product, for a third of your users.
- Load map SDKs on intent; static maps for single locations; test panning on a mid-range phone over 4G.
- Under eight locations or any comparative decision: the list wins. Find the excitement in the content instead.

## FAQ

**Which map stack do you recommend?**
For restrained custom styling, a vector-tile stack (open data plus a lean GL renderer, or a hosted equivalent) gives you the muting control this article argues for. Satellites and heavyweight SDKs only when imagery is the content. Whatever you pick, ship it lazy and keep a static-render path.

**WebGL maps and `prefers-reduced-motion`?**
Reduced motion means no eased fly-tos, no spin-in pins, instant state changes. Test it — many map libraries animate camera moves by default and offer no reduced-motion path out of the box; wrap camera changes yourself.

**Should the list or the map come first on mobile?**
List first, map reachable via a persistent toggle or a peek-height bottom sheet. On a 375px screen a full viewport map makes results unreachable; the sheet pattern (with the traps avoided — see [bottom sheets that don't fight the user](/journal/product/bottom-sheets-mobile-web)) is the pattern that survives contact.

**How do we handle "near me" without being creepy?**
Ask on intent, fall back gracefully, and never centre the map on a guessed location without saying that's what you did. A one-line "sorted by distance from Carlton" is both a UX nicety and a trust signal.
