---
title: "WebGL on a budget: shipping 3D without melting mid-range phones"
description: "Shipping WebGL inside a performance budget: draw-call discipline, texture arithmetic, lazy canvases, device tiers, and keeping the 3D moment under 500KB."
slug: webgl-performance-budgets
cluster: engineering
tags:
  - webgl
  - performance
  - 3d
  - threejs
date: 2026-01-22
author: Hannah Yeo
keywords:
  - WebGL performance
  - three.js optimisation
  - 3D web design
  - GPU budgets
  - performance budget
readingTime: 10
---

A 3D moment on a website is a promise. Done well, it says the people who built this care about craft all the way down. Done badly — a fan-spinning, frame-dropping, battery-draining cube of regret — it says the opposite, louder, to every visitor on a mid-range phone. Which is most visitors. We love WebGL and we ship it with the enthusiasm of a studio that also publishes [performance budgets](/journal/engineering/bundle-budget-discipline) and enforces them. Those two facts get along fine, because the entire trick is this: the 3D scene is a feature with a budget, like fonts or images, and it lives or dies by the same arithmetic.

Our standing budget for a marketing-site 3D moment — product viewer, hero scene, configurator hero — is **500KB of compressed scene assets, 60fps on a 2021 mid-tier Android, and zero impact on the rest of the page's Core Web Vitals**. Here is how we hold it.

## Draw calls, not polygons

The first thing juniors optimise is polygon count; the first thing seniors measure is draw calls. A modern phone GPU chews through hundreds of thousands of triangles without noticing. What it cannot chew through is *state changes*: every distinct mesh-material combination is a draw call, every draw call is CPU-GPU coordination, and past roughly 100–200 per frame on a phone, you are scheduling slippage no polygon diet will fix.

The disciplines:

- **Merge static geometry.** Eight product components sharing a material are one mesh. Tools like `BufferGeometryUtils.mergeGeometries` exist for exactly this; use them at export time, not per-frame.
- **Instance repetition.** A field of screws, a grid of tiles, a forest: `InstancedMesh`. One draw call for ten thousand copies.
- **One texture atlas, one material.** UV-map the whole product into a single 2K atlas where art direction allows. Materials are the expensive object in three.js, not geometry.
- **Audit with data.** `renderer.info.render.calls` is a number, print it in dev tools, put it in the PR description. Our rule of thumb for a marketing scene: under 60 calls, frame one.

Low-poly is a *style choice we often make* (it also happens to compress beautifully), but performant 3D is built with the draw-call budget, not the triangle budget.

## Texture arithmetic

Textures are where 500KB scenes become 5MB scenes, so we do the arithmetic in the open, in the design doc, before modelling starts. The per-texture commandment: **no texture larger than the largest size it will ever be displayed**, quantized and compressed for the GPU, not just the network.

Concretely:

- **KTX2/Basis universal textures** over PNG/JPEG for anything big or repeated. UASTC for normal maps and anything where banding matters; ETC1S for albedo. The transcode cost at load is real but small; the GPU memory saving (4–8× versus raw) is what keeps mid-range phones from paging.
- **Cap at 2K.** A 2K atlas covers a full-viewport hero product. 4K is a render-farm habit.
- **Light by texture, not by lights.** Bake ambient occlusion and soft shadows into the atlas or a cheap lightmap. A baked AO pass reads as expensive lighting and costs almost nothing at runtime; three dynamic shadow-casting lights cost like they look.
- **HDR environments, tiny ones.** A 256×128 equirect env map gives metals and gloss their life for tens of KB. Nobody on a phone can tell it from 2K, and we've tested.

A scene budget we actually wrote down for a configurator hero: one 2K KTX2 albedo+AO atlas (~450KB after tuning), one 1K normal map, one 256 env map, geometry ~300KB as Draco-compressed glTF. Total on the wire: comfortably under 500KB gzip for the moment itself, with three.js (~160KB of our [170KB route budget](/journal/engineering/bundle-budget-discipline) conversation) lazy-loaded.

## The lazy canvas

Nothing about a homepage 3D moment should cost a visitor who never sees it. The rules we treat as law:

**Load the library on intersection.** three.js loads when the canvas scrolls near the viewport — `IntersectionObserver`, generous rootMargin, skeleton shimmer in place. No IntersectionObserver support means no 3D, and the static poster looks great; this is a feature, not a fallback.

**Pause off-screen and hidden.** `requestAnimationFrame` loops stop when the canvas leaves the viewport, when the tab hides (`visibilitychange`), and when the device reports `prefers-reduced-motion`. A rAF loop rendering an invisible scene is the single most common WebGL sin we find in audits — it drains batteries and melts INP for zero pixels.

**One context, deliberately.** WebGL contexts are scarce (browsers cap them; Safari aggressively). One canvas per page for the 3D moment; if a second moment exists, reuse or sequence contexts, never stack them.

**Fail soft, always.** Context creation can fail — old drivers, battery-saver modes, iOS low-power quirks. Wrap it, catch it, swap in the poster image. The poster is designed with the same care as the scene, which is what makes this graceful rather than broken.

## Device tiers, honestly detected

"Does it run at 60 on my iPhone 15" is the wrong acceptance test. Ours is a 2021 mid-tier Android over throttled 4G, because that is the median of reality. We grade devices into tiers at runtime and serve each tier a scene it deserves:

- **Tier 0 (no 3D):** `prefers-reduced-motion`, `deviceMemory < 4` where reported, failed context creation, or `saveData`. Gets the poster, which as established is lovely.
- **Tier 1 (essential):** low-end GPUs (heuristic: `devicePixelRatio` ≤ 1.5 plus WebGL renderer string denylist for known-struggling chipsets), capped DPR at 1, reduced particle/secondary effects, 30fps target.
- **Tier 2 (full):** everything else, DPR capped at 2 (rendering at native 3× on a flagship is how you set frames on fire for pixels nobody resolves).

Renderer-string detection is heuristic and we say so in code comments; combine hints, never trust one. And measure on real devices — the [field guide to Core Web Vitals](/journal/engineering/core-web-vitals-field-guide) covers our lab-vs-field split; for WebGL we add per-tier frame-time sampling to RUM so regressions surface in data, not in a client email that says "it feels janky?"

## 3D must have a DOM truth

Accessibility is where most WebGL marketing moments silently fail. Ours don't, by rule: **the scene is decoration or it's a component, and both kinds have a DOM truth.** A decorative hero canvas is `aria-hidden` beside a real heading and real copy. An interactive product viewer is wrapped in semantic controls — buttons for "rotate to back view", a list of colour options as actual radiogroup buttons that also drive the scene, a transcript-equivalent spec sheet. Screen-reader users get the information; keyboard users get the interactions; the canvas is the garnish. Our [accessibility-as-engineering](/journal/engineering/accessibility-as-engineering-practice) piece has the full doctrine; the WebGL corollary is "if the GPU died tomorrow, the page still sells the product."

Reduced motion deserves special mention: `prefers-reduced-motion` doesn't mean "no 3D" — it means no autonomous motion. We render the scene statically (if tier allows) and only animate on explicit user input, which is often the more premium feel anyway.

## Motion: the 160ms rule scales up

A word from the motion side of the house, because 3D scenes die by bad easing as often as by bad budgets. Camera moves follow the same law as UI motion — ease-out dominant, 400–900ms for scene transitions, nothing perpetual that doesn't earn its keep. Idle rotation is the "loading spinner of 3D": it says *we built this and don't know what it's for*. Give the orb a reason: respond to pointer, settle when idle, always overridable. The full house rules live in [animation is engineering](/journal/engineering/animation-engineering-60fps).

When we shipped the [Osprey Outdoor pack configurator](/work/osprey-outdoor-configurator-launch), the scene hit 60fps on a four-year-old Oppo with the viewer idle *and* under thumb-drag — because the budget was written on page one of the design doc, not discovered in week nine. The 3D earned the brand moment; the budget earned the client's support-ticket graph, which bent down and stayed down.

## Key takeaways

- Budget the 3D moment like any other asset class: ours is 500KB compressed, 60fps on a 2021 mid-tier phone, zero CWV damage elsewhere.
- Optimise draw calls and texture compression before polygons; bake lighting; atlas materials; print `renderer.info` in your PRs.
- Lazy-load the library and the canvas, pause off-screen and hidden, and design the poster fallback with love — it serves more people than you think.
- Tier devices honestly with combined signals, cap DPR, and sample frame times in RUM by tier.
- Every scene has a DOM truth: semantic controls for interactive 3D, `aria-hidden` for decorative, motion only on input under reduced-motion.

## FAQ

### Should we use a 3D scene at all?
When the product *is* spatial — hardware, footwear, architecture — a controlled 3D moment consistently earns its keep in engagement and pre-sales deflection. For abstract SaaS, a 3D blob usually says less than a great diagram. We test the poster first: if the static image doesn't sell the story, the rotating version won't either.

### three.js or react-three-fiber?
We prototype in react-three-fiber (the declarative scene graph speeds iteration enormously) and keep it for application-grade 3D like configurators. For a single hero moment on a content site, vanilla three.js in a lazy module keeps the bundle arithmetic simple. Both are excellent; the budget decides the wrapper, not fashion.

### How do we keep 3D off LCP?
Never gate the largest contentful paint on the scene: the hero's LCP element should be the poster image or headline, preloaded normally, with the canvas enhancing after. If your LCP waits on a glTF fetch, the budget meeting went wrong upstream.

### What's the maintenance story for 3D content?
Treat scenes like any other content pipeline: versioned glTF exports from the design tool, automated optimisation (Draco/meshopt + KTX2) in CI, and a dry-run size report per PR. The failure mode to avoid is "the 3D file lives on one designer's laptop" — we've inherited that twice, and it's a migration, not a handover.
