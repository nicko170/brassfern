---
title: "Building an image pipeline that designers don't curse"
description: "The image pipeline behind our fast pages and happy editors: AVIF/WebP fallbacks, focal-point crops, build-time vs CDN transforms, and the editorial fields that matter."
slug: image-pipeline-modern-web
cluster: engineering
tags: [performance, images, avif, cdn, editorial]
date: 2026-01-22
author: Nate Sullivan
keywords: [image optimization pipeline, avif webp, responsive images cdn, image performance, focal point cropping]
readingTime: 9
---

Every performance audit we've run on a content site in the last three years has found the same number-one offender, and it isn't JavaScript. It's images: a 3MB hero PNG exported "just in case," an `<img>` with no dimensions reflowing the page, fifty identical JPEGs cropped by hand because nobody trusted the pipeline. Then, in the retrospective, someone says "we should really sort out images" and the team sort of agrees and nothing changes, because image pipelines are everyone's job and therefore no one's.

Here's the pipeline we build now — the transforms, the editorial fields, and the caching strategy — plus the part most engineering write-ups skip: making it pleasant enough that designers and editors actually use it.

## The non-negotiables of output

Whatever serves your images, the output contract is fixed:

- **Modern formats with honest fallbacks.** AVIF first (typically 40–60% smaller than JPEG at equal quality), WebP second, JPEG last. AVIF encoding is slow at high effort; cap effort levels for build-time generation or move encoding to the CDN. Decode speed on low-end devices matters too — we don't serve AVIF below a pragmatic quality floor where its ringing artefacts show on gradients.
- **Responsive srcset, sized by layout not by hope.** The size list comes from the component's actual rendered widths, derived from the design system: a card image gets 320/480/640/960; a full-bleed hero gets 768/1280/1920/2560. `sizes` is written from the same layout tokens, never hand-guessed per instance.
- **Dimensions always present.** Every image tag carries `width` and `height` from source metadata. Layout shift from images is a solved problem; it's embarrassing to still cause it, and CLS budgets (per our [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide)) should fail the build if it's absent.
- **Lazy below the fold, eager above, preload the LCP.** The hero image gets `fetchpriority="high"` and a preload; everything else waits. One of the cheapest real wins available, and the reasoning is laid out in our [hero patterns piece](/journal/web-design/hero-patterns-beyond-gradient).

## Build-time vs CDN transforms: the honest decision

**Build-time** (sharp, squoosh-cli, Astro/Next image components) gives you reproducible artifacts, zero runtime dependency, and pre-compressed files you can cache forever. It falls over when the image set is user-generated or huge — processing 40,000 editorial photos in CI is how you get 45-minute builds.

**CDN transforms** (an image CDN or a self-hosted imgproxy) give you on-the-fly resizing, format negotiation from the `Accept` header, and device-driven experiments. They cost money per transform, add a runtime dependency in the critical path, and can produce terrifying cache-miss stampedes on launch day.

Our default answer: **both, split by provenance**. Curated, design-owned imagery (heroes, case studies, marketing art) is transformed at build time — the set is small, the quality bar is highest, and the output ships with the site. Editorial and user-adjacent imagery (article bodies, product catalogues) goes through the CDN with transforms keyed by a strict allowlist of sizes, so a scraped URL with `w=9999` in it returns a 400, not an invoice.

This split is also how [Fernleigh Wines](/work/fernleigh-wines-dtc-storefront) works: campaign imagery is build-time and art-directed; the bottle shots flow through transforms from the catalogue.

## Focal points: the field that saves art direction

Automatic centre crops are why editorial teams hate image pipelines. The model's face gets halved at mobile aspect; the product in the hero becomes a mysterious elbow. The fix is not AI saliency detection (fine as a default, wrong as a policy) — it's a **focal point field in the CMS**.

Every image entry carries `focalX`/`focalY` (percentages) and optionally named crop overrides per aspect ("the 4:5 crop is a separate file"). The pipeline expresses the focal point as CSS `object-position` for single-file usage and as crop anchors (`fp-x`, `fp-y` style parameters) for CDN transforms. Designers set focal points once, at upload, with a click. The result: one source image, twelve aspect ratios, zero art-direction casualties.

We wrote the design-side rationale in [art-directing images for the responsive web](/journal/web-design/image-art-direction-web); the engineering side is exactly this field plus the discipline to thread it through every transform.

## The editorial contract

A pipeline designers don't curse is mostly *contract*, not codecs. The CMS enforces:

1. **Alt text rules by image type.** Photographs require alt; decorative images require an explicit "decorative" checkbox (empty alt by decision, not by omission); graphs require a text equivalent field that renders below the figure. CI can't enforce meaning, but it can enforce presence — and we fail content builds on missing alt, the same principle as [accessibility starts in the design file](/journal/web-design/accessible-design-handoff).
2. **Source quality floors.** Minimum source dimensions per usage slot (hero sources ≥ 2560px wide). Upscaling is rejected at upload with a human-readable message, not discovered in the shipped page.
3. **One blessed upload path.** No Dropbox link pasted into a rich-text field, ever. Images enter through the asset library, get deduplicated by hash, and get their pipeline metadata (focal point, alt, credit) attached at the source.

## Caching: the unsexy half

Two rules cover ninety percent of it. Content-hash every transformed file name, then cache immutable for a year. And version your transform parameters in the URL or the key, so when you change quality from 72 to 68 you don't serve a Frankenstein mix from edge cache. The third-rule-of-holes: purge paths must exist and be tested *before* the incident where someone uploads something they shouldn't have. We test purges quarterly, like fire drills.

For build-time images, precompress at the artifact level and let the static host serve precompressed files; for CDN images, make sure variants differ only in query params that are part of the cache key — a surprisingly common misconfiguration is negotiated format *not* being in the key, serving AVIF to a Safari from 2021.

## Measuring, briefly

Track three numbers per template in RUM: LCP image transfer bytes, LCP time, and the percent of image bytes served in modern formats. When a regression happens, the template attribution tells you where to look in minutes. Images are the rare performance domain where a single dashboard actually suffices.

## Key takeaways

- Output contract: AVIF/WebP/JPEG fallbacks, layout-derived srcset, dimensions always, LCP preloaded.
- Split transforms by provenance: curated imagery at build time, editorial volume through an allowlisted CDN.
- Focal points are a CMS field, not a hope — one source, many crops, intact art direction.
- The editorial contract (alt rules, quality floors, one upload path) is what keeps the pipeline fast *and* used.

## Frequently asked questions

**Should we just use a framework's built-in image component?**
For small-to-mid sites, yes — the defaults are sane. Outgrow it when you need focal-point art direction, DAM integration, or cost control on a large catalogue; those push you to an explicit pipeline.

**Is AVIF always worth it?**
For photos, almost always. For flat graphics and UI-critical imagery, often not — and never forget decent fallbacks; the fallback chain costs little and covers the long tail of old devices and in-app webviews.

**How do we handle user-uploaded images safely?**
Never serve originals. Re-encode everything through the transform layer (which strips anything that isn't an image), cap output dimensions, disallow ICC/profile weirdness by normalising colour space, and virus-scan at ingest. The transform proxy is also your security boundary.

**What about video?**
Same contract, bigger numbers: poster frame through the image pipeline, adaptive streams through a real video host, never autoplay with sound, and respect reduced-motion by defaulting to the poster. Motion earns its keep or stays a picture.
