---
title: "Anchor navigation on long pages: TOCs that get used"
description: "Tables of contents are either the hardest-working furniture on a long page or pure decoration. How we design anchor navigation that earns its pixels."
slug: anchor-navigation-long-pages
cluster: web-design
tags: [ux patterns, navigation, editorial design, accessibility]
date: 2026-08-04
author: Nate Sullivan
keywords: [table of contents ux, anchor links, scrollspy design, long-form navigation, web design patterns]
readingTime: 9
---

Somewhere north of two thousand words, every article develops a navigation problem. The reader who arrived from search wants the section that answers her question. The reader who got interrupted wants to resume. The reader who's skeptical wants to scan the argument's skeleton before committing an evening to it. All three are failed by the same thing: a scrollbar as the only wayfinding on the page.

The table of contents is the obvious answer, and the obvious answer is usually done badly — a floating box of vaguely-worded links, pinned ambiguously, that reports your position with the accuracy of a distracted tour guide. Here's how we design anchor navigation that people genuinely use, including the honest cases where we leave it out.

## When a TOC earns its pixels

The first decision is whether the page needs one at all. Our gate is unglamorous: a TOC appears when a page has at least three h2 sections *and* the piece is long enough that a reader plausibly wants to jump rather than scroll. Below that, a TOC is ceremony — a navigation system announcing that a short article contains sections, which the reader can see by flicking the scrollbar once.

There's a second, subtler gate: the headings have to be worth navigating to. A TOC is only as good as the heading copy it lists. "Introduction / Main Points / Conclusion" generates a useless TOC no matter how beautiful the rail. This is why TOC design is secretly an editorial discipline — you can't design your way out of bad structure, you can only expose it. The same argument we make about [drawing the sitemap before anyone opens Figma](/journal/web-design/sitemap-as-ux-artifact) applies one level down: write the headings first, then let the furniture reflect them.

One more honesty rule: only list what exists. We've audited pages whose TOC promised seven sections and delivered five, because the component read from a CMS field nobody updated. Generate the TOC from the rendered headings at build time, and it can never lie.

## Placement: on the side, out of the way

For long-form reading on desktop, the sticky left rail is the placement that wins on every measure we track. It stays visible without covering content, it reads top-to-bottom in the language's reading order, and it keeps the article column centred in the reader's attention rather than competing with it.

The details that make or break it:

- **Sticky, with a sane offset.** The rail pins to the viewport once the reader scrolls past its natural position, with a `scroll-margin-top` on target headings so anchored content never lands under a fixed header. Landing underneath the chrome is the single most common anchor-navigation bug on the web, and it's a one-line fix.
- **Vertical, set quiet.** TOC entries are wayfinding, not content — set them smaller than body copy, in the muted ink, with generous line height. The moment a TOC is more typographically assertive than the article, the page's hierarchy has inverted.
- **Width-capped and truncating honestly.** Long headings wrap to two lines maximum, then truncate with an ellipsis. A TOC entry is a button with a label, not a place to re-read the heading.
- **Gated by viewport.** Below roughly 70–75em there isn't room for a rail that doesn't squeeze the prose column into a ribbon, so the rail simply doesn't render. Which brings us to mobile.

## Active state: tell the truth or don't bother

Scroll-spy — highlighting the TOC entry for the section you're reading — is where most implementations go quietly dishonest. The classic failure: the active state flips when a heading crosses some arbitrary viewport line, so flicking between sections shows the *previous* section lit up, or the bar jitters between two entries near a boundary.

Our rules for an honest active state:

1. **Define "current" as the section whose content is in front of the reader.** Intersection-driven, with the root margin tuned so a section becomes active when its heading enters roughly the top third of the viewport — where eyes actually are — not at the very top edge.
2. **Exactly one entry is active, always.** If the section list resolves to zero matches (at the very top, before the first heading), highlight nothing rather than guessing. Below the last section, the last entry stays lit.
3. **The active affordance is quiet and structural.** We use a brass rail segment that slides along the TOC's left border — position communicated by *where*, not by shouting colour or weight. Colour alone is a WCAG failure and, honestly, a design failure too: a thing you already are is not a thing you need to be yelled at about.
4. **Cheap to compute.** Scroll-spy runs on a throttled observer, not on raw scroll events doing layout reads sixty times a second. If your TOC causes scroll jank, it has failed its entire purpose — which is helping, at no cost.

The engineering instinct behind rules like these — motion and observation that don't tax the main thread — is the same discipline in our guide to [shipping animation at 60fps](/journal/engineering/animation-engineering-60fps), just applied to the humblest component on the page.

## Mobile: the fallback that isn't a rail

On a phone there is no left rail worth having — a persistent TOC eats a third of a 375px screen and earns none of it. The mobile patterns, ranked by how often they actually get used:

**Best: a disclosure at the top.** A "On this page" summary below the intro — a simple list, inline with the prose, collapsed if it's long. It serves the arriving reader's scan-the-skeleton moment, then scrolls away politely. It costs no pixels once you're reading.

**Acceptable: a sticky mini-bar with the current section name.** A slim bar under the header showing "2 of 7 — The approach", which expands to the full list on tap. Good for very long, very structured pages (documentation, annual reports). Overkill for a 1,500-word essay.

**Worst: the floating "contents" bubble.** A perpetually hovering circle that covers text, drifts under thumbs, and exists to announce the site has a TOC. We've built it exactly once, for a client who asked, and the session recordings were a silent film of people trying to read around it.

## Deep-linking hygiene

Anchor navigation generates URLs, and URLs are promises. Three rules keep those promises:

- **Stable, human-meaningful ids.** `#the-approach`, not `#section-3` or an auto-hash. Headings sometimes get edited; if a heading changes and the id is derived live, every old deep link rots. Where we can freeze ids at publish, we do.
- **Headings carry their own anchor.** A hover-revealed link icon on each section heading lets a reader copy a link to exactly the passage they mean. This is how your content gets cited properly — "see the section on anchoring bias" with a link that lands there is worth ten undirected links to the top of the page. It also feeds your [internal linking practice](/journal/growth/internal-linking-architecture), because deep links distribute across the archive instead of piling on top-level URLs.
- **Focus follows the jump.** Browsers scroll to anchors, but assistive technology needs the focus moved too, or keyboard and screen-reader users land in a mystery location in the tab order. We move focus to the target heading with a temporary `tabindex="-1"`. It's small, and it is the difference between "works" and "works for everyone" — the standard we describe in [accessibility as an engineering discipline](/journal/engineering/accessibility-as-engineering-practice).

## When to delete the TOC

A short list of pages that should not have one: anything under three sections. Landing pages (the page *is* the navigation — each section is a screen). Case studies under about 900 words. Any page whose sections are sequential steps — onboarding documentation where section two makes no sense without section one — where a TOC invites skipping and skipping breaks the thing.

And the deletion test we apply to existing pages: watch five session recordings or run a one-week event flag on TOC clicks. If the rail earns under 1% of readers clicking anything in it, either the headings are weak or the page doesn't need wayfinding. Fix the headings first. If it still fails, delete the rail. A page with less furniture is almost never worse.

## Key takeaways

- Gate the TOC: at least three h2s and a length where jumping beats scrolling. Generate it from rendered headings so it can't lie.
- Desktop gets a sticky, quiet left rail; mobile gets an inline "On this page" list at the top — never a floating bubble.
- Scroll-spy must be honest: exactly one active entry, triggered where eyes actually read, computed without jank.
- Deep links are promises — stable ids, per-heading anchors, and real focus management.
- A TOC is only as good as its headings. Write the structure first; the furniture follows.
- Measure clicks, fix headings, and delete the rail if it doesn't earn its pixels.

## Frequently asked questions

**Should the TOC appear before the intro paragraph or after?**

After. The intro earns the reader; the TOC serves the reader who's now convinced or who wants a specific section. A TOC above the first sentence asks for a navigational commitment before the piece has made any argument at all.

**Do anchor links hurt SEO by splitting signals?**

No — fragments don't split link equity; they consolidate it on the one URL and give search engines passage-level structure to index. Deep links with descriptive fragments routinely earn sitelink-style treatment in results. The risk is thin anchor *pages*, not anchor links.

**Jump-scroll or smooth-scroll?**

Smooth, about 300–400ms, when the destination is on the same page and motion is allowed — the travel itself is wayfinding, showing the reader the distance and direction they moved. Instant jump on first load with a fragment (honouring the link fast beats animating to it), and instant always under `prefers-reduced-motion`.

**How many entries before the TOC itself needs collapsing?**

Around nine or ten is our threshold. Past that, the rail stops being scannable and becomes its own navigation problem. Options: collapse h3 entries until the parent h2 is active, or accept only h2s and let the section copy carry the finer structure. What we don't do is shrink it into illegibility — a TOC you need to squint at is furniture, not wayfinding.
