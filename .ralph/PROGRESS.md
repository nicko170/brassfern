# Progress

## Done (iteration 6 — builder: link audit, case-study enrichment, resources hub)

- **Internal-link audit now gates the build** — new `scripts/audit-links.mjs`
  scans every markdown link against a full route table (static pages, all
  articles/case studies, services, industries, team slugs, jobs, every tag,
  every demo). Broken root-relative links are **fatal in prebuild** (writers:
  run `node scripts/audit-links.mjs` before finishing). Found and fixed 6
  pre-existing broken links: stale `/services/product-design-and-engineering` →
  `/services/product` (2), `/services/brand-and-identity` → `/brand-identity` (2),
  `/services/e-commerce` → `/ecommerce`, a link to unwritten article
  `growth/subscription-retention-honest-design` → existing
  `ecommerce/subscription-ux-design`, `/about` → `/studio` (2). Deliberate
  `\](#)` placeholder links (5 case studies + 1 playbook) warn but pass.
- **Fixed broken home testimonial deep-links**: two quotes linked to *demo*
  slugs (`northwind-ledger-budget`, `pylon-health-booking` — 404 at /work/…);
  now point at the case studies. Expanded `testimonials` in clients.ts from 4
  to 12 entries — every case study with a demo now has a matched fictional
  client quote (Fernleigh, Brightmarsh, Tallow, Wattle & Daub, Copperline,
  Hearthbrew subscription, Osprey, GLADE).
- **Wattle & Daub demo back-linked**: `demo: wattle-and-daub-reserve` added to
  the case study (demo1's handoff). Demo strip + gallery now render there.
- **Case-study pages enriched** (brief: stack/team/gallery/testimonial):
  closing client quote (`.case-quote`, renders when a testimonial matches the
  study), "The squad" strip (`.squad` — portraits + names + roles, derived
  deterministically via `src/lib/squad.ts` from author + services + producer;
  never hand-maintained), and a two-image gallery (`.case-gallery`) = hero
  still + demo showcase shot when one exists. New build: index builder now
  emits a `workImages` manifest (public/images/work/*.jpg) so pages can know
  which demo shots exist without a filesystem.
- **Resources page is a real hub** — lead-story feature ("The latest playbook"),
  numbered compact index of all other playbooks (`.resource-rows`), plus a
  cross-cluster "Checklists, audits & templates" band (tag-driven: checklist /
  audit / template).
- **Honesty note** under home stats: "A concept studio's numbers — illustrative
  by design…" (mono micro-style).
- **Hero art**: product/jobs-to-be-done-interviews (the iter-5 prompt) and
  playbooks/status-updates-clients-read (also the /resources lead feature).
  Trimmed 2 over-long descriptions (both were 172–173 chars).
- **Backlog**: +36 articles (playbooks 10, product 8, ai 6, brand 6, growth 6)
  + 4 demos (glade-ingredient-explorer, postcards-archive-explorer,
  brightmarsh-course-finder, signal-noise-studio — all target existing case
  studies).
- **Build green: 1006 prerendered routes** (broke 1000), typecheck clean,
  audit clean, CI-equivalent BASE_PATH build verified.

## Done (iteration 5 — builder: people pages, journal leads, backlog)

- **Author profile pages `/team/:slug`** — new `PersonPage` (named export of
  `src/pages/Team.tsx`): hero with big Portrait, role/location/writing-count
  fact list, their case studies (WorkCard grid), their journal articles
  (ArticleCard grid), and a chips row linking the rest of the team.
  `personSlug()` / `personBySlug()` helpers in `src/data/people.ts`
  (diacritic-safe: tomas-reyes). `personLd()` ProfilePage JSON-LD in
  `lib/jsonld.ts`.
- **Bylines are now links**: `Article` and `WorkCase` (`article-meta__author`,
  brass-underline micro mono) deep-link every author name to their profile.
  Team index cards are full links (`.person__link`) with hover lift.
- **Journal lead stories**: `ArticleFeature` (Cards.tsx) — editorial
  two-col lead card (hairline top rule, hero image or themeFor tile) rendered
  on page 1 of `/journal` ("The latest big read") and every `/journal/:cluster`
  hub ("The <cluster> big read"). Featured piece = latest article WITH
  heroImage, excluded from the paginated grid (pagination slices `rest`).
- **Routes/prerender/sitemap**: `team/:slug` added to App (lazyNamed) +
  prerenderRoutes → **868 prerendered routes**, 12 team URLs in
  sitemap; skel-check clean; ProfilePage JSON-LD + per-person canonical
  verified in dist.
- **Hero art**: generated editorial still-life for flagship
  `ai/evals-practical-guide` (brass balance scale + index cards); wired
  heroImage/heroAlt. `product/jobs-to-be-done-interviews` hero planned but
  image budget ran out — retry next iteration.
- **Backlog**: +19 articles (product 4, growth 4, playbooks 4, web-design 4,
  ai 3) + 3 demos (holloway-waveform-player, copperline-mobile-bank,
  tallow-feast-builder). Demos planned back to 8.
- **Build green**: 886 routes; typecheck clean; verified content (no 404s, no
  skeletons) under the CI-equivalent `BASE_PATH=/brassfern/` build.

## Solved (often-missed, now fixed)

- **Prerendered hrefs lacked the base path.** `StaticRouter` in
  `entry-server.tsx` had no `basename`, so every Router `<Link>` in static HTML
  rendered root-absolute (`/journal/…`) — dead on the `/brassfern/` sub-path
  for crawlers and no-JS visitors (hydration masked it). Now renders with
  `location={ROUTER_BASE + url}` + `basename={ROUTER_BASE}`; CI build verified:
  hrefs, images and canonicals all carry `/brassfern/`. (Canonical/OG/sitemap
  were already correct via `absoluteUrl()`.)

## Done (iteration 4 — builder: heroes, taxonomy, smallcraft)

- **All 17 case studies now have hero art.** Generated 10 editorial-print
  stills (cream paper, brass/fern, no text/people) at
  `public/images/work/<slug>.jpg` and wired `heroImage`/`heroAlt`:
  copperline-community-bank, fern-and-forage-florist,
  fernleigh-wines-dtc-storefront, glade-skincare-ingredient-honesty,
  hearthbrew-brand-system, northwind-ledger-dashboard-rebuild,
  postcards-museum-archive, pylon-health-telehealth-flow,
  signal-and-noise-podcast-network, tallow-and-co-providore.
- **Industry taxonomy normalised** — case-study `industry:` values collapsed
  from 14 noisy variants to the 7 canonical names in `src/data/industries.ts`
  (e.g. "Retail & hospitality"/"Retail & Food" → "Retail & e-commerce",
  "Media"/"Arts & culture" → "Media & culture"). /work filter bar is clean;
  **writers: only use canonical industry names** (see ROUTES.md).
  IndustryPage matcher now exact-matches with a substring fallback — every
  industry page with matching work surfaces it (saas/non-profit have none yet).
- **Testimonial deep-links**: `Testimonial.caseStudy?` in clients.ts; home
  quotes now link the company name (`.quote-block__link`) to its case study.
- **Home lab band**: `.lab-feature` night card between work reel and services
  (replaces the thin "N live demos" line; features demos[0], same as /lab).
- **RSS discoverability**: `<link rel="alternate" type="application/rss+xml">`
  in `headToHtml` (all prerendered pages) + client `applyHead` upsert.
- **Print stylesheet** appended to app.css: hides chrome/grain/marquee/lab-art,
  strips night backgrounds, expands prose link hrefs, break-inside rules.
- **Fixed**: duplicate `demo:` key in hearthbrew-subscription-club.md (YAML
  error found by build — the content validator catches these).
- **Backlog**: +55 planned (28 engineering, 15 brand, 12 growth).
- **Build green**: 685 prerendered routes; skel-check clean; RSS link verified
  in dist; canonical industry counts verified on industry pages.

## Done (iteration 3 — interactivity + perf)

- **Work index filters sync to URL** (`?service=&industry=`, replace-history),
  per-option counts (respecting the other active facet), live result-status
  line with Reset, and a proper empty state. Invalid params fall back to "all".
- **Case-study demo strip**: WorkCase renders a `.demo-strip` night band
  (overline, title, mono meta, brass-initial tile, CTA) when a demo exists —
  replaces the lone button. CSS added; art tile hides <700px.
- **Search**: live debounced search-as-you-type (220ms → `?q=`, replace),
  result cap 60, kind badges (Case study · Journal + date), rich empty states:
  no query → popular tags (chips w/ counts) + latest 5 articles; no results →
  suggestions + popular tags.
- **Route-level code-splitting** (`src/lib/lazyPage.ts`): every page is its own
  chunk; prerender warms all chunks via `preloadAllPages()` which nudges React
  lazy internals (double-nudge through the thrown thenable). Entry chunk went
  107 KB → ~63 KB gzip. Verified: zero prerendered pages ship skeleton HTML
  (demo bodies inside /lab/<slug> excepted, by design). See ROUTES.md
  "Route code-splitting" — do not remove the double-nudge.
- **Hero art × 4** (iteration 3): sundial-travel-booking,
  wattle-and-daub-reservations, holloway-records-label-site,
  brightmarsh-onboarding.
- **Fixed in-flight demo break**: osprey-pack-configurator had duplicate
  `aria-label` attributes (TS error) — merged into its conditional label.
- **Backlog**: +58 articles (engineering, web-design, ecommerce, playbooks,
  ai, growth, product, brand) + 3 demos (quarry-property-map,
  brightline-solar-quoter, tidal-games-store).
- **Build green**: 509 prerendered routes, typecheck clean.

## Next

- Journal heroes: flagships still bare — growth/content-strategy-compounds,
  engineering/keyboard-first... (has one), web-design flagships, brand/
  measuring-brand-health. Keep spending image budget here (2/iteration).
- Builder ideas for later iterations: home POV band refresh; 375px device QA
  sweep (demo-strip/lab-feature/feature/person-hero/squad verified in CSS but
  not on a real device); OG images per case study currently fall back to
  heroImage (good) — could add dedicated 1200×630 variants; reading-progress
  or TOC on long articles; /press page enrichment.
- Writers: keep burning backlog — run `node scripts/audit-links.mjs` before
  finishing (broken internal links are now FATAL in prebuild).
  Authors MUST be roster names; new case studies must use canonical industry
  names from src/data/industries.ts (Fintech, Health, Retail & e-commerce,
  Hospitality, Climate, Education, Media & culture, SaaS, Non-profit) so the
  /work filters and industry matchers stay clean.
- Near-duplicate backlog items writers should SKIP (already published):
  editorial-grids-on-the-web, landing-page-anatomy-2026, forms-nobody-designs,
  dark-mode-second-design-system, naming-process-start-to-finish,
  logo-is-dead-system, design-tokens-pipeline (the -ci variant covers it).

## Known issues / watchlist

- Description-length warnings (a few files, ~170 chars) — non-fatal; writers
  trim when touching those files. (2 fixed in iter 6.)
- Deliberate `](#)` placeholder links in 5 case studies + 1 playbook
  (rhetorical "metrics are illustrative" device) — warned by audit-links,
  not fatal. Consider pointing them at a real anchor eventually.
- Work frontmatter mixes inline YAML lists (`stack: [a, b]`) and longhand
  (`stack:` + `- item`) — both valid; if you script-edit frontmatter, insert
  keys before the closing `---`, never after a bare `stack:` line.
- `osprey-pack-configurator` demo shipped with stub demo.css overwritten by its
  builder's real CSS.
- Lab demo bodies SSR only the overlay bar (lazy demo not awaited) — by design.
- Journal pagination remains client-side (page 1 prerendered only).
- Work filter params use replace-history (no back-button trail) — deliberate.
- Industry pages saas / non-profit have no matching case studies yet — the
  related-work section omits itself until one ships.

## Solved (kept for reference)

- generate_image works again (was 401); hero gaps closing incrementally.
- Author drift fixed (iter 2); demo.css race guarded by ensure-demo-css.mjs.

## Demo: hearthbrew-store (demo2, 2026-09-26)

- Built `src/demos/hearthbrew-store/` — full coffee storefront: 9-coffee catalogue with
  generative SVG bag art (seeded per coffee), brew/roast/search/sort filters, PDP sheet
  (size/grind/one-time-vs-subscribe with interval picker, qty stepper), slide-out cart
  (localStorage `hbs-cart-v1`) with free-shipping progress bar ($45), mock checkout +
  success state, and a "Your box" subscription panel (interval change, skip, pause/resume,
  persisted to `hbs-sub-v1`). meta.caseStudy = `hearthbrew-subscription-club`.
- Art direction: cream paper + espresso ink + caramel, Georgia serif + mono badges, grain
  overlay; CSS scoped under `.hbs`; reduced-motion fully respected (marquee off, no lifts).
- **Writer handoff**: `src/content/work/hearthbrew-subscription-club.md` frontmatter says
  `demo: hearthbrew-coffee-storefront` but the demo slug is `hearthbrew-store` (harness-assigned).
  A writer should update that one line so the case study links to the live demo (demo builders
  are not allowed to edit work content).
- Showcase image `public/images/work/hearthbrew-store.jpg` failed to generate (image API 401,
  infra issue) — retry next iteration if auth is fixed.

## Writer iteration (writer1, 2026-09-26, iter 3)

- Wrote 4 articles, all validated done:
  - product/error-messages-that-help (Ruby Castellanos) — five-part error anatomy,
    tone-by-disaster bands, support reference codes.
  - product/data-dense-tables-ux (Dev Khatri) — density modes, sticky rules, column
    management, inline-edit integrity, keyboard set, export honesty.
  - brand/naming-process-field-guide (Leonie Marsh) — axes brief, volume generation,
    3-round screening, reality tests, committee-proof presenting.
  - brand/logo-systems-not-logos (Felix Brandt) — tiered identity systems, gauntlet
    tests, motion behaviour, co-branding rules, handover. Hero image generated at
    public/images/articles/brand/logo-systems-not-logos.jpg (heroImage/heroAlt set).
- Fixed demo↔case-study links per demo2 handoff: hearthbrew-subscription-club demo
  field now `hearthbrew-store`; added demo fields to northwind-ledger-dashboard-rebuild
  (`northwind-ledger-budget`) and pylon-health-telehealth-flow (`pylon-health-booking`).
- Note: build-content-index measures description length slightly differently than
  finish_article (em dashes/quotes?) — aim ≤160 per the script's count to avoid warnings.

## Demo builder iteration (demo3, 2026-09-26, iter 1)

- Built `northwind-ledger-budget` — the Northwind Ledger budgeting dashboard, validated done.
  Files: `index.tsx`, `meta.ts`, `data.ts` (deterministic seeded generator), `charts.tsx`
  (hand-rolled SVG), `Transactions.tsx`, `demo.css`. No new dependencies.
- Features: date-range switching (Sep / 3 mo / 6 mo) over 6 months of deterministic fake books
  for fictional "Fieldstone Ceramics Pty Ltd" (Apr–Sep 2026, 238 txns); KPI strip (cash now,
  in, out, net, ≈22-wk runway); answer-first cash-flow area chart with dashed budget line,
  focusable month points + aria-live readout; category donut with slice/legend drill-down to
  top-vendor bars; live September pacing bars vs day-26-of-30 pace marker; runway-buffer goal
  tracker (97.5% funded, ETA 31 Oct 2026); receivables card with "Send reminder" → queued state;
  transactions ledger with search, in/out filter, inline recategorisation (flows back into
  donut + pacing), roving-tabindex arrow-key row nav, show-more paging.
- Art direction: slate + mint dark UI (`color-scheme: dark`), tabular numerals, calm fintech;
  CSS scoped under `.nl`; all motion gated behind `prefers-reduced-motion: no-preference`.
- Data verified via esbuild+node harness: Aug runs –A$4.4k (client-holiday dip), Sep closes
  +A$16k ahead; monthly spend budget A$78,250. meta.caseStudy = `northwind-ledger-dashboard-rebuild`
  (case study already links back via `demo:` field — writer1 fixed in iter 3).
- Showcase image generated: `public/images/work/northwind-ledger-budget.jpg` (dark laptop
  mockup, mint dashboard glow, no legible text). Alt suggestion: "Laptop on a dark desk showing
  the Northwind Ledger dashboard — a mint area chart, donut and budget pacing bars on slate."

## writer2 — iteration 4 (2026-09-26)
- Wrote 4 articles, all validated done:
  - ai/ai-assistant-onboarding (mental-model onboarding, starter prompts as curriculum, calibration moment, activation metrics)
  - ai/multimodal-ux-design (modality decision matrix, structured output, voice rules, ambient AI)
  - ecommerce/headless-commerce-tradeoffs (TCO honesty, theme-vs-headless scorecard, hybrid paths)
  - ecommerce/pdp-design-conversion (11-second audit, image sequence, buy-box hierarchy, mobile ergonomics)
- Hero image: public/images/articles/ecommerce/pdp-design-conversion.jpg (editorial flat-lay, stoneware vessel + brass ruler on cream paper); heroImage/heroAlt set.

## writer1 — iteration 5 (2026-09-26)
- Wrote 4 ecommerce articles, all validated done:
  - ecommerce/checkout-friction-audit (40-check audit instrument: field math, wallet placement,
    address integrity, error recovery, trust proximity; links GLADE/Tallow/Fernleigh case studies)
  - ecommerce/subscription-ux-design (skip/pause as retention, dosage guidance, dignified
    cancellation, LTV case vs dark patterns; links hearthbrew case + lab demo)
  - ecommerce/merchandising-digital-shelves (PLP craft: curated thesis + algorithmic tail, badge
    inflation, photography rhythm, facets from customer questions, promo slot inventory)
  - ecommerce/cart-design-patterns (cart as negotiation: drawer vs page hybrid, threshold honesty,
    per-line-item gifting, save-for-later rituals, one-thumb mobile anatomy)
- Ecommerce cluster now has 6 done articles (with writer2's headless + PDP pieces).
- Hero image: public/images/articles/ecommerce/checkout-friction-audit.jpg (editorial flat-lay:
  brass tally counter, receipt, pencil, checklist, fern sprig on cream paper); heroImage/heroAlt set.
- Note for builders: 6 unique internal links per article; playbooks slugs (writing-a-great-brief
  etc.) are all still planned — avoid linking to them until written.

## writer2 — iteration 5 (2026-09-26)
- Wrote the first 4 playbooks articles (cluster was at 0 done), all validated:
  - playbooks/design-handover-done-right (handover as taper: task-recipe docs, working sessions,
    credentials "boring kingdom", 30-60-90 support taper, behavioural success criteria)
  - playbooks/working-remote-agency (distributed engagement buyer's guide: overlap design, written
    defaults, client decision turnaround, tooling/security hygiene, SOW clause list)
  - playbooks/launch-week-checklist (T-7 freeze, redirect map, rehearsed rollback, DNS choreography,
    analytics continuity, 48h monitoring, day-two editorial debt)
  - playbooks/content-handover-workflow (content inventory columns, voice alignment before volume,
    bounded 2-round reviews in situ, editor phase, CMS handover with trained editors)
- No hero images this round (kept budget for builder/key visuals; pieces stand alone as text).
- Cross-linked only to finished articles + core routes; safe for others to link INTO these four slugs now.

## writer3 — iteration 4 (2026-09-26)
- Wrote 4 ai articles (cluster was at 0 done), all validated:
  - ai/ai-trust-design (trust as interface property: provenance/citations, confidence registers,
    correction affordances, honest capability copy, trust metrics cohort-by-cohort)
  - ai/fine-tuning-vs-rag (knowledge-vs-behaviour diagnosis, prompt/RAG/fine-tune decision tree in
    code fence, cost curves, maintenance burden; composite logistics example)
  - ai/ai-feature-analytics (acceptance + edit distance, correction signals, task completion vs
    chat volume, cost-quality overlay, weekly human sampling ritual, vanity metrics to exclude)
  - ai/responsible-ai-review (studio review published: three-tier gate, failure inventory,
    red-team roles, disclosure rules, 8-question data checklist, how we say no + reshape)
- Hero image: public/images/articles/ai/responsible-ai-review.jpg (brass stamp, loupe, fern-green
  specimen cards, pressed fern on cream paper); heroImage/heroAlt set.
- Wrote 4 playbooks articles, all validated (distinct from writer2's four):
  - playbooks/accessibility-procurement (binding brief language, VPAT skepticism, payable
    acceptance criteria, post-launch decay mechanisms)
  - playbooks/retainer-vs-project (outcome vs capability, failure shapes of both, hybrid shapes,
    questions to ask before signing)
  - playbooks/stakeholder-alignment-design (authority mapping, input vs decision, demo-don't-
    present, lapse dates, stalled-project rescue sequence)
  - playbooks/how-we-estimate-software (three-number ranges, 10-day decomposition rule, named
    visible risk buffers, fixed-scope cap + out-of-scope list, 5 questions for reading estimates)
- Cross-links target finished articles, my own new slugs (finished same iteration), core routes,
  and the two in-flight ai slugs of another writer (shipping-llm-features, llm-evals-framework) —
  safe to link INTO all eight of my new slugs.

## demo3 — iteration 2 (2026-09-26): osprey-pack-configurator ✅
- Built src/demos/osprey-pack-configurator/ — "Ridgeline Works" 3D pack configurator for
  fictional Osprey Outdoor (case study: work/osprey-outdoor-configurator-launch, already existed).
- Stack: installed three@0.160.1 + @types/three (no react-three-fiber — imperative three in a
  React wrapper kept the wrapper code tiny; three rides in the demo's lazy chunk only).
- Features: low-poly pack assembled from primitives (capsule body, brain lid, shove-it pocket,
  bottle pockets, straps, hip belt, daisy chains, buckles), flat-shaded, dusk-ridgeline lighting;
  damped colour/material/size transitions; pointer drag + arrow-key rotation with auto-rotate
  after idle; exploded-view switch (parts fly apart with lerp); 3 models × 3 fabrics × 3 torso
  fits × 3-panel colourway (6 colours) recompute weight/price/specs live; full config serialized
  into the URL (?pack=&fit=&fabric=&body=&pocket=&trim=&view=exploded) with copy-link button +
  clipboard fallback; price breakdown + mono spec sheet; aria-live status summary for AT.
- Fallbacks: prefers-reduced-motion or no-WebGL → static SVG "spec elevation" Poster with live
  colours/scale and callouts; identical controls. Explode switch disabled in poster mode.
- Art direction (own, scoped under .opc): trail dusk — graphite #151917, moss, blaze orange,
  topo-line SVG texture, ui-monospace spec labels, pill copy-link CTA.
- Note: midway through, `src/lib/lazyPage.ts` (untracked, in-flight builder file) broke typecheck
  with `ComponentType<never>` generics; the owning worker fixed it while I investigated —
  typecheck now green with my demo included. No showcase image generated: the case study already
  has public/images/work/osprey-outdoor-configurator-launch.jpg and DemoCards use generative tiles.

## writer4 — iteration 5 (2026-09-26): 4 engineering articles ✅
- engineering/react-server-components-tradeoffs (Felix Brandt) — sober RSC ledger: wins
  (deleted fetch waterfalls, zero-bundle components, streaming), costs (two-runtime mental
  model, cache contracts, serialisable-props discipline), decision heuristics by project shape.
- engineering/islands-architecture-when (Tomás Reyes) — islands vs SPA by interactivity ratio;
  hybrid pattern (static default, lazy hydration triggers, reluctant shared bus, view
  transitions); traps: island sprawl, prop firehose, styling drift, third-party flood.
- engineering/design-tokens-pipeline-ci (Felix Brandt) — token CI: grammar lint, ancestry/
  orphan graph, contrast-pair + motion-ceiling + scale tests, semver + content-hash releases,
  codemods. Companion to existing colour-systems article.
- engineering/image-pipeline-modern-web (Nate Sullivan) — AVIF/WebP/JPEG contract, build-time
  vs CDN split by provenance, focal-point CMS field, editorial contract (alt rules, quality
  floors), caching/purge drills.
- All 4 use only existing routes/demos for cross-links (/lab/northwind-ledger-budget verified).
  No hero images generated this iteration (budget conserved).

## writer1 — iteration 6 (2026-09-26): 4 engineering articles ✅
- engineering/edge-rendering-honest-guide (Tomás Reyes) — what edge buys (TTFB/distance,
  no-flicker geo personalisation, network-layer experiments, distribution) vs costs (cold
  starts, data still far away, observability fragmentation, cache subtlety); 5-question
  decision framework; labelled fictional benchmark. Hero image generated:
  public/images/articles/engineering/edge-rendering-honest-guide.jpg (engraved APAC network map).
- engineering/caching-strategy-content-sites (Felix Brandt) — 4-layer caching cake
  (browser/CDN/render/data), header vocabulary, invalidation patterns ranked by sleep
  quality (purge-on-publish gold standard), ISR gotchas, operational drills, 3am drill.
- engineering/type-safe-cms-content (Felix Brandt) — schema→generated types→boundary
  validation (zod pattern)→components; drift-check CI; content modelling conventions
  (additive-only changes, intent over layout); editor-side contract; 5-step rename migration.
- engineering/playwright-testing-that-lasts (Tomás Reyes) — locate by role/intent hierarchy,
  page objects that pay rent vs fixture helpers, data/clock discipline, visual-diff quota
  (15 max), 10-minute suite budget, tiering/quarantine; reskin survival story (89/112 unchanged).
- All cross-links verified against finished article list + site routes. Typos self-checked.

## writer3 — iteration 5 (2026-09-26): 4 engineering articles ✅
- engineering/pdf-generation-web (Felix Brandt) — three generation architectures scored
  (headless Chrome pool, programmatic pdf-lib, print CSS), typography gotchas (embedded
  licensed fonts, tabular figures, greyscale test), perf/cost numbers, HTML snapshot for
  regeneration, when PDF is the wrong answer. Links: Copperline case study, colour-systems,
  data-dense-tables, estimating playbook, /services/product.
- engineering/i18n-architecture-hard-parts (Dev Khatri) — ICU plurals + no-concatenation lint,
  pseudolocalisation in CI, Intl-only policy, money in minor units, wall-clock+zone for
  recurring times, RTL via logical properties + icon-mirror attribute, content modelling
  (translatable vs localisable, fallback chains, localised slugs), locale-varying tokens.
- engineering/keyboard-first-interfaces (Aiko Tanaka) — regions/composites model, roving
  tabindex recipes (wrap rules, Home/End, type-ahead, virtualised focus restore), modal
  contract, shortcut system rules (gating, chords, discoverability, don't override browser),
  keyboard-only CI tests + tab-order snapshots. Hero image generated:
  public/images/articles/engineering/keyboard-first-interfaces.jpg (brass keycap still life).
- engineering/feature-flags-craft (Sam Whitfield) — 4-stage lifecycle (experiment/rollout/
  ops/permission) with max lifetimes, grammar-encoded names (stage_area-expiry), evaluate-at-
  boundary architecture, exposure-event requirement, expiry automation + monthly flag funeral.
- All cross-links verified against list_articles + ROUTES.md. Engineering cluster now moving
  (was 1 done + 12 claimed).

## writer1 — iteration 7 (2026-09-26): 4 brand articles ✅
- brand/illustration-systems (June Okafor) — primitives over pictures, composition grammar
  (density ceilings, single focal verb, scale rules, "we will not" list), generators for
  combinatorial assets, two-round commissioning briefs, maintenance model (named editor,
  quarterly cull, changelog, 10–15% maintenance budget), when to skip illustration.
  Hero image: public/images/articles/brand/illustration-systems.jpg (engraved botanical
  primitive kit on cream).
- brand/measuring-brand-health (Priya Nair) — five-instrument panel: share of search,
  tiny recall study (category entry points), consistency audit, pricing power + branded
  cohort gap, annual qualitative drift check; quarterly one-pager format; what not to
  measure (social engagement, sentiment, NPS-as-brand).
- brand/brand-strategy-one-pager (Mara Ellison) — six-block page (tension → position →
  proof → personality → enemy → "we will not"); annotated Sundial example; facilitation
  notes (tension-first sequencing, refusal auction, live-decision test, single owner);
  failure modes.
- brand/founder-led-brand (Leonie Marsh) — what founder voice buys (trust speed, taste
  moat, controversy with a face), four failure modes, harvest sequence (raw voice → laws
  not quirks → three context voices → founder as sharp end), three transition shapes
  (ensemble/editor/institution), when founder-led is wrong architecture.
- All 4 cross-linked to existing brand cluster + services/work/growth/ai articles
  (verified against list_articles). Brand cluster now 10 done.

## writer2 — iteration 7 (2026-09-26): 4 growth articles ✅
- growth/newsletter-growth-engine (Leonie Marsh) — promise design (10-word gain, not topic),
  issue skeleton (hook/payload/pattern/tray/one ask), four growth loops (3 are content
  properties), referral-mechanics honesty (accelerate enthusiasm, don't manufacture),
  cadence-as-capacity math, metric set (replies/forwards/30-day retention/downstream revenue).
  Hero image: public/images/articles/growth/newsletter-growth-engine.jpg (brass letterpress
  printing a newsletter strip that curls into a fern frond).
- growth/paid-organic-balance (Priya Nair) — paid = speed to signal, organic = equity/moat;
  fully-loaded CAC + payback-window math; "long paid payback is financing, not marketing";
  relay model (paid tests → organic briefs, organic winners → paid landers/seeds); breathing
  budgets + protected test line.
- growth/conversion-copywriting (Leonie Marsh) — verbatim voice-of-customer mining (transcripts,
  competitor reviews, objections, on-site search), 4-level message hierarchy, objection mapping
  ("unanswered objections adjourn decisions"), headline frameworks without formula smell,
  testing arguments-not-words at small scale.
- growth/funnel-metrics-that-matter (Sam Whitfield) — stage-definition contract (observable
  events, single owners, defined exits, annotated changes), movement metrics over snapshots
  (cohorted conversion, time-in-stage velocity, quality-adjusted entry, leakage triage),
  30-min weekly review format (walk → one constraint → one bet/owner/date), anti-fraud culture.
- All cross-linked to existing growth cluster + work studies + /services/growth, /pricing,
  /contact (verified against list_articles + ROUTES.md). Growth cluster now 12 done.

## writer3 — iteration 6 (2026-09-26): 8 articles (2 brand, 2 growth, 4 ecommerce) ✅
- brand/typography-brand-distinctiveness (June Okafor) — letterforms as highest-frequency
  brand asset; retail vs custom vs customised-retail maths (5yr licence ~60% rule); bespoke
  wordmark glyphs; brand-voice/workhorse split for product surfaces; debranded-screenshot,
  three-context and real-content tests.
- brand/brand-guidelines-living (Mara Ellison) — why guideline PDFs die (4 structural
  failures); living guideline site = foundations w/ live examples + do/don't pairs + governed
  downloads + machine-readable tokens; semver + changelog + dated deprecations; named owner,
  quarterly cadence, pruning analytics; 10–20% of identity budget.
- growth/schema-markup-playbook (Sam Whitfield) — schema as eligibility/disambiguation
  infrastructure, not rankings; default seven-type set; what we skip (unearned reviews,
  HowTo, fake LocalBusiness); JSON-LD generated from same data as visible page, single
  @graph; CI validation → per-template Rich Results audit → GSC enhancement monitoring →
  annual prune; honest CTR measurement.
- growth/site-migration-seo (Priya Nair) — full runbook: 3-source URL inventory (crawl,
  logs, GSC) at T-8wk; one-to-one one-hop 301 map validated as data; staging indexing
  belt-and-braces + full audit + analytics parity diff; launch sequence; 30-day watch;
  numeric rollback triggers; fund the 60-day follow-through.
- ecommerce/site-speed-revenue-link (Nate Sullivan) — speed as merchandising/floor space;
  honest attribution (own RUM correlation + CI guardrails + occasional controlled test,
  never borrowed statistics); per-template spend (PDP hero LCP, PLP INP, checkout tag
  subtraction, cart drawer); 4-number business case. HERO IMAGE:
  public/images/articles/ecommerce/site-speed-revenue-link.jpg (brass stopwatch + kraft
  parcels flat lay).
- ecommerce/ecommerce-search-design (Aiko Tanaka) — search as concierge; layered instant
  results (products/categories/content, keyboard-operable); monthly synonym curation from
  query logs; disclosed typo tolerance; zero-results recovery ladder; labelled pins +
  bounded boosts; 4-metric dashboard (zero-results, exit, reformulation, position CTR).
- ecommerce/returns-ux-design (Nate Sullivan) — returner = best customer; PDP-side policy
  promise converts; self-serve flow anatomy (no accounts, sizing-split reason taxonomy,
  printerless QR, tracked status); honest exchange-first incentives (instant credit on
  scan); returns data loops into PDP copy/photography/the buy; segment abuse, don't tax
  the honest.
- ecommerce/loyalty-program-design (Priya Nair) — start from one behaviour (frequency /
  2nd purchase); legible maths (visible earn rate, stable currency, generous expiry);
  tiers without anxiety (visible attainable progress, earned-not-teased, top tier = access
  + meaning); warm-moment discovery (post-purchase retroactive credit, delivery emails,
  returns, packaging); incrementality via holdouts + published program P&L; when NOT to
  build one. Note: check for stray non-ASCII chars when drafting fast — two CJK chars
  slipped into drafts this iteration and were caught/fixed before finish_article.
- All cross-linked and validated via finish_article (8/8 ✅). Ecommerce cluster now 10 done,
  brand 8, growth 12→14. Totals: 112 done.

## writer1 — iteration 8 (2026-09-26)
Ecommerce cluster, 4 articles claimed and completed (all validated ✅, totals: 124 done):
- ecommerce/gift-buying-ux (Hannah Yeo) — gift buyer ≠ fan; recipient-first navigation
  (answerable questions, ≤3-option shortlists, "most gifted" escape); delivery-date honesty
  (PDP promises, public cutoffs, say-no + digital escape hatch); gift-mode as ops feature
  (price-free slips, discreet packaging); card-message craft; recipient-as-cheapest-future-
  customer bridge; 8-item Q4 readiness checklist. Hero image generated:
  public/images/articles/ecommerce/gift-buying-ux.jpg (kraft parcels + brass twine + fern).
- ecommerce/headless-commerce-when-worth-it (Dev Khatri) — decision framework companion to
  headless-commerce-tradeoffs: 4-question theatre test; 4 legit sweet spots (content-led,
  interactive product, multi-brand, app-adjacent); 3-yr TCO model incl. app-ecosystem audit;
  team capability requirement; hybrid/islands middle path; per-band recommendations.
- ecommerce/subscription-models-retention (Ruby Castellanos) — second-order cliff is the
  whole game; anticipation-window pre-charge email with in-line levers; second-box design;
  spine-and-variable-joint novelty; dunning without resentment (silent retries, human copy,
  grace periods); honest pricing (discount trap, grandfathered rises); truth-telling metrics.
- ecommerce/checkout-friction-killers (Nate Sullivan) — diagnose from your own funnel, not
  folklore: step/field/error instrumentation + replays; six killers in frequency order
  (shipping-reveal delta, punitive validation, late express payments, account wall → move
  asks post-purchase, 2011 address entry, reassurance-by-specificity); funnel-lie caveats.

## writer2 — iteration 8 (2026-09-26)
Ecommerce cluster, 4 articles claimed and completed (all validated ✅):
- ecommerce/marketplace-vs-owned-storefront (Felix Brandt) — fee-stack maths table
  (owned often *costs more* per order yr 1; crossover via repeat/email compounding);
  what the marketplace rents vs what your domain owns; 3 hybrid plays (discovery/
  margin, liquidation valve, logistics-only); honest stay-put cases (commodities,
  low-repeat, pre-PMF); 6-input modelling worksheet w/ crossover-month output.
- ecommerce/product-photography-that-sells (Ruby Castellanos) — brief backwards from
  objections & return reasons; per-category shot-list table (apparel/food/skincare/
  furniture/hardware); one testable lighting language hero macro/scale as anti-return
  machinery; honest video ROI (in-motion clips yes, PDP brand films no); UGC licensing;
  5-part shoot brief template. Hero image generated:
  public/images/articles/ecommerce/product-photography-that-sells.jpg (stoneware +
  linen + brass reflector still life).
- ecommerce/bundles-kits-merchandising (Sam Whitfield) — bundles raise AOV only when
  theme is legible; curated (newcomers/gifters) vs BYO (preference-heavy, constrain
  4-from-9, flat price, box-fill visual); pricing psych (anchor on sum, one saving
  number, 3-tier decoy, no fake strikethroughs); virtual vs pre-kitted inventory +
  returns policy; kit-first PDP architecture; subscription twist = fixed theme,
  rotating payload (Hearthbrew). Conservative uplift model incl. 20–30% cannibalisation.
- ecommerce/ecommerce-navigation-taxonomy (Hannah Yeo) — tree is a tested hypothesis
  (predictable/shallow/stable, ≤7 top-level); open+closed card sort method (80% placement
  bar); mega-menu rules (3–5 cols ≤7, hover-intent, accordion on mobile); facets vs
  filters distinction, 6–9 demand-derived facets, indexable URLs for demand-carrying
  combos; search zero-results log = quarterly taxonomy research; Tallow & Co. example.

## writer3 — iteration 7 (2026-09-26)

Four web-design articles completed:
- web-design/dark-mode-second-design-system (June Okafor) — dark mode as a second design
  system: semantic tokens, 4-rung luminance elevation ladder + faint borders, muted-not-
  brighter accents, never invert meaningful colour, syntax palettes per theme, CI checks
  (contrast build step, dual-theme screenshot diffs, raw-hex lint, color-scheme meta).
- web-design/forms-nobody-designs (Aiko Tanaka) — persistent labels vs placeholder-as-label;
  validation timing (never scold on input, blur = validate, submit = summarise + refocus);
  what/why/what-next error copy; single-column dogma + honest exceptions; autocomplete
  attributes & input modes as cheapest CRO win; 10-point ship checklist. Links Pylon Health.
- web-design/photography-style-without-a-photoshoot (Mara Ellison) — treatment systems:
  exclusion lists, 4 levers (crop grammar / encoded grade / monochrome grain texture /
  subject mix), one-page treatment matrix + reject pile + one owner; directed phone shots,
  supplier doc photos, editorial licensing; honest "when to hire a photographer" cases.
  Hero image generated: public/images/articles/web-design/photography-style-without-a-photoshoot.jpg
  (flat-lay texture contact-sheet + fern notebook + brass loupe on cream paper).
- web-design/landing-page-anatomy-2026 (Priya Nair) — 9-section skeleton ordered by
  objection sequence (friction kill under the promise = most-missing section); two proof
  stacks; demo moment; alternatives table that concedes; 3-rung CTA ladder. Applied to
  Hearthbrew / Northwind Ledger / GLADE with different bends; measurement set +
  9-point checklist.

## writer4 — iteration 8 (2026-09-26)

Eight articles completed (two batches):

Batch 1 (web-design):
- web-design/fluid-type-scales-in-practice (Aiko Tanaka) — two-ratio fluid scales
  (1.2 mobile / 1.28–1.333 desktop) anchored on fixed body; clamp() with commented
  slope, rem-only, 375–1440 locks; fixed body text; midpoint-dip testing; optical
  correction (tracking/leading/opsz bound to clamp); ordinal tokens + specimen page.
  Hero image: public/images/articles/web-design/fluid-type-scales-in-practice.jpg
  (brass letterpress blocks ascending on cream paper, fern ink smudges).
- web-design/pricing-pages-that-convert-quietly (Leonie Marsh) — status-quo anchoring;
  buyer-identity plan names, 3+enterprise cap; honest billing toggle (radiogroup);
  comparison tables for evaluators (job-named groups, words over ticks); proof at doubt
  points; before/after composite refactor (1.8%→2.7% illustrative); leak list.
- web-design/editorial-grids-on-the-web (June Okafor) — SEQUEL to editorial-grids-web:
  named-line breakout grid CSS (content/popout/full, 3 tracks max); captions/pull-quotes
  as contracted components (aria-hidden decorative repetition); figure numbers; system vs
  art-directed pages (traffic×longevity×stakes rule); interrupt budgets per template;
  Postcards vs Holloway budgets.
- web-design/microinteraction-taxonomy (Felix Brandt) — 4-job taxonomy + freeloader;
  duration/easing token table (120–160ms axis, springs-for-play); "does it answer a
  question" quality test + mute-and-watch removal test; full reduced-motion fallback
  table (opacity = safe currency, gate JS motion too); 5-question say-no checklist.

Batch 2 (growth + ai):
- growth/attribution-noise-decisions (Sam Whitfield) — 90/10 noise baseline; last-click
  as smoke detector only; 5-rung evidence hierarchy (platform-in-platform / HDYHAU /
  geo holdouts / MMM-lite / explicit written beliefs); 4 decisions data can support;
  decision log > dashboard precision; Copperline Mutual example.
- ai/shipping-llm-features-lessons (Dev Khatri) — post-launch scars vs pre-flight
  checklist: time-to-meaningful-content per answer shape; cost creep (prompt growth,
  retry loops, context inflation); layered fallbacks incl. silent staleness + no-deploy
  kill switch; trust calibrates in first 3 sessions; provider model drift diffed both ways.
- ai/evals-practical-guide (Priya Nair) — golden sets (30–150, real, frozen,
  failure-weighted, versioned); grader hierarchy (deterministic → reference → rubric
  LLM-judge, atomised + calibrated); PR fast gate / nightly full / model-change both-ways
  diff; pitfall list (Goodhart, drift, judge-recursion); 2-week starter plan.
- ai/agent-ux-control (Ruby Castellanos) — agents = control systems: verb×object
  permission scopes, 3 tiers, revocable home screen; visible inspectable plan +
  interruptibility + dry-run; per-action undo/mitigation/irreversibility spec; attention
  routing table (act/batch-ask/interrupt/refuse, novelty-weighted); failure contract.

Note: several claimed slugs were near-dupes of existing pieces (editorial-grids,
microinteractions, shipping-llm, evals, agent-ux, attribution) — each was written as an
explicitly cross-linked sequel/companion with a distinct angle (mechanics vs philosophy).

## writer3 — iteration 8 (growth batch)

- growth/technical-seo-launch-checklist (Hannah Yeo) — deliberately the *sequel* to
  technical-seo-checklist-2026: checklist-as-code angle. Four CI layers (static HTML
  lint, file assertions, runtime header/status, JSON-LD contract tests), two-pass
  rhythm preserved, judgement checks that never automate (canonical intent, rendering
  trade-offs, crawl-budget economics, sniff test), first-90-days monitoring.
- growth/content-strategy-compounds (Priya Nair) — portfolio maths: 60/15/25
  compounder/spike/refresh allocation; intent-tier topic selection w/ bookmark test;
  refresh engine as the compounding mechanism; directional attribution defence.
- growth/cro-experiments-that-matter (Sam Whitfield) — companion to cro-experiment-design,
  focused on triage/sequencing: 6–10 tests/yr arithmetic, three-gate filter
  (evidence/opportunity/detectability), traffic tiers, learn-then-dig sequencing,
  ledger, money-with-ranges reporting.
- growth/lifecycle-email-product (Ruby Castellanos) — state machines not calendars;
  plain-text craft (91-word example); deliverability engineering (subdomain streams,
  MPP-aware metrics, sunset-as-code); time-to-state-transition north star.
  Hero image generated: public/images/articles/growth/lifecycle-email-product.jpg.

## writer1 — iteration 9 (web-design + product + growth)

- web-design/navigation-that-survives-mobile (Sam Whitfield) — hamburger alternatives:
  visible-priority bar, bottom tabs (label+icon), light mega menus, breadcrumbs as
  wayfinding, findability measurement (tree tests, menu-open ratios, time-to-first-nav).
- web-design/inclusive-design-beyond-checklists (Hannah Yeo) — inclusive language in
  copy, cognitive load budgets, SPA focus management, physical-layer targets/reach,
  accessibility as standing critique criterion. (Description needed one trim to 159.)
- web-design/empty-loading-error-states (Aiko Tanaka) — four species of empty states,
  loading ladder (optimistic > skeleton > progressive > spinner), error-copy anatomy,
  states-as-named-variants spec. Hero image generated
  (public/images/articles/web-design/empty-loading-error-states.jpg).
- web-design/handoff-that-does-not-decay (Tomás Reyes) — tokens-as-code, component
  specs (5 sections incl. accessibility contract), motion spec table w/ cubic-bezier
  + R-motion rows, annotation habits, weekly designer-on-staging.
- product/jobs-to-be-done-interviews (Priya Nair) — positioned as companion to
  jtbd-interviews-that-work (script): excavating the unsayable (artefacts, silence,
  audience probes), firing interviews, forces-map synthesis, jobs-to-bets translation.
- product/dashboard-design-dozen-lessons (Dev Khatri) — 12-scar listicle format;
  decisions-first, context-pinned numbers, 5-second chart test, annotations, filters
  vs saved views, freshness stamps, instrument-the-dashboard metrics.
- product/onboarding-patterns-activation (Leonie Marsh) — value-moment sentence, keep
  patterns (value-before-signup, honest checklists, graduating tours) + 7 banned
  patterns; four-measure instrumentation; amputate-don't-redesign migration.
- product/wcag-aa-product-teams (Nate Sullivan) — the five chronic failures (state
  contrast, focus visible, 2.2 target size, keyboard widgets, name/role/value),
  error-identification under-worry, four rituals, honest AA limits.
- growth/refreshing-old-content-wins (Ruby Castellanos) — decay segmentation (rank /
  impression / CTR), refresh-vs-rewrite-vs-consolidate-vs-retire triage, 8-point
  refresh pass, one-day-a-week cadence, cohort measurement.
- growth/digital-pr-backlinks-honest (Felix Brandt) — asset-first (data studies,
  reactive commentary w/ 90-min SLA, tools, contrarian w/ skin), 60-contact lists,
  one-follow-up rule, honest conversion rates, quality-not-DA measurement.
- growth/email-deliverability-fundamentals (Mara Ellison) — SPF/DKIM/DMARC/DMARC→BIMI
  plain-English, behavioural reputation, hygiene 80% (sunset, suppression, no bought
  lists), warming, four-layer diagnosis, Spam Act floor.
- growth/changelog-as-marketing (June Okafor) — dialect translation (patch→release
  note), three lanes, segmentation multiplier, triple duty (in-product/email/SEO),
  cadence-as-signal, archive mining for case studies.

Notes: service slugs confirmed brand-identity|websites|product|ecommerce|ai|growth
(existing motion article links /services/product-design-and-engineering — stale but
not mine to churn; builder may want a redirect audit later). finish_article clean
on all 12 after one description trim.

## writer2 — iteration 10 (product ux batch)

- product/cancellation-flows-respect (Aiko Tanaka) — one offer per cancel matched to
  reason, equal-weight decline, no confirm-shaming; exit-survey signal design (optional,
  quarterly-reviewed options, never gating); data export as dignity + enterprise
  purchase criterion; win-back timing follows re-entry moments + "we fixed it" emails;
  honest metrics (60-day re-churn, clean-leaver vs fought-leaver win-back).
- product/invite-flows-team-products (June Okafor) — role-at-invite with permission
  preview, least-powerful defaults; email vs shareable links w/ expiry + revoke;
  invitee arrival = inviter + thing + first task (skip tour, preserve personal message);
  inviter loop-closing (delivery visibility, human nudges, first-action reporting);
  viral-loop honesty (no scraping/pre-ticked/fake-personal) + full-loop instrumentation.
- product/activity-feeds-audit-logs (Felix Brandt) — event grammar (actor/verb/object/
  absolute time/context, old→new diffs, machines as named actors); noise control
  (write-time bulk roll-up, reversed salience, per-category mutes); filter bar = the
  feature (actor/object/tier/dates/fuzzy search); immutable append-only; retention
  windows announced; why audit logs close enterprise deals (monetise depth, not
  existence); saved filters as notification subscriptions.
- product/bulk-actions-ux (Tomás Reyes) — two-step explicit cross-page selection w/
  filter-scoped honesty + exclusion lists; effect-preview confirmations (count/
  consequence/exceptions at confirm time); undo > grace > confirmation hierarchy, real
  undo reverses data; long jobs get names/progress/receipts/partial-failure queues +
  permanent feed records; bulk as separate permission capability w/ batch caps and
  two-person approval gates; test at production scale.

## demo2 — iteration 3 (fernleigh-cellar-club)

- Demo: **Fernleigh Cellar — wine club subscription & shoppable PDPs**
  (`src/demos/fernleigh-cellar-club/`), linked to existing case study
  `fernleigh-wines-dtc-storefront`.
- Features: filterable 6-wine grid → PDP sheet with vintage radios, qty stepper,
  drink-window dot + club-price comparison; three club tiers (Explorer −10% /
  Cellar −15% / Collector −20%) with bottles-per-shipment + cadence sliders and
  per-shipment savings summary; active-plan panel with pause/resume/leave and a
  shipment-manager drawer (skip-next, 5-cycle cadence calendar); drink-by cellar
  tracker (status dots + window bars, 25-bottle seed) that restocks from mock
  checkout; cart drawer with freight threshold, member-saving hint, 3-step mock
  checkout. Cart/club/cellar persist to localStorage.
- Art direction (own, not Brassfern's): fog grey / vine green / wax-seal red,
  Iowan–Palatino serif voice, all bottles drawn as SVG (`Bottle.tsx` — wax
  capsules, typographic labels, no photographs). Scoped under `.fcc`.
- A11y/motion: dialogs with aria-modal + Escape + initial focus, live-region
  toast, labelled sliders, `:focus-visible` rings, full reduced-motion block.
- Showcase image: `public/images/work/fernleigh-cellar-club.jpg` (device mockup,
  fog/vine/wax palette, no text).

## demo1 — iteration 3 (wattle-and-daub-reserve)

- Demo: **Wattle & Daub — restaurant site with reservations**
  (`src/demos/wattle-and-daub-reserve/`), linked via meta.caseStudy to
  `wattle-and-daub-reservations`. Note: harness blocks demo builders from
  adding `demo:` to the case study md — the back-link from the case study
  still needs a writer to add `demo: wattle-and-daub-reserve` to
  `src/content/work/wattle-and-daub-reservations.md`.
- Features: candlelit ember canvas hero (rAF, visibility-paused, static frame
  under reduced motion); 4-step booking flow (party+date → sitting & seat →
  details → confirm) with deterministic seeded availability across 14 days,
  dark Mondays, Sunday long lunch, three seating zones with per-zone scarcity
  (chef's counter books fastest) and an honest "full tonight — nearest nights"
  recovery; live coat-check-ticket summary (cream paper ticket w/ perforation);
  card-hold consent only when it matters (party 5+ or Saturdays) per the case
  study's friction-budget rule; confirmation with ref code + .ics download;
  reservations persist in localStorage with a "Your tables" manager and a
  two-step, deliberately delightful one-tap release; editorial serif menu with
  dotted leaders + dietary tags; by-the-glass wine table; Hearth Room private
  dining enquiry with validation + success state.
- Art direction (own): firelit amber on charred timber, Iowan–Palatino serif,
  mono overlines; scoped under `.wd`. Header sticky at `top: 3rem` (under lab
  bar). Full reduced-motion block; aria-live step announcements; step-heading
  focus management.
- Showcase image: `public/images/work/wattle-and-daub-reserve.jpg` (phone on
  charred table, ember UI, no legible text).

## writer4 — iteration 9 (growth ×4 + playbooks ×4)

- growth/community-led-growth-honest (Priya Nair) — honest B2B community economics, three yes-conditions, dark-funnel measurement.
- growth/interactive-tools-as-content (Sam Whitfield) — tools vs prose link economics, sprint scoping, SEO architecture, sideways measurement.
- growth/content-pruning-seo-lever (Leonie Marsh) — audit table, keep/refresh/merge/redirect/delete tree, 90-day watch. Hero image added: public/images/articles/growth/content-pruning-seo-lever.jpg.
- growth/internal-linking-architecture (Priya Nair) — up/across/down hub mechanics, anchor discipline, template links, orphan/depth audits.
- playbooks/design-system-buy-in (June Okafor) — cost-of-inconsistency maths, pilot strategy, adoption metrics, governance.
- playbooks/measurement-plan-before-build (Sam Whitfield) — questions-before-events workshop, event naming, consent-as-architecture, fake-data dashboard.
- playbooks/reading-an-agency-sow (Ruby Castellanos) — exclusions, assumptions section, change control, acceptance criteria, five pre-signature questions.
- playbooks/scope-change-without-drama (Mara Ellison) — discovery vs preference vs creep, 4-rule change-request micro-process, pricing mid-stream, scripts.

## writer1 — iteration 11 (playbooks ×1 + ai ×3)

- playbooks/first-90-days-after-launch (Ruby Castellanos) — kickoff-scoped post-launch plan, S1–S3 bug etiquette, analytics fog + baseline, day-60 reading discipline, day-90 optimise/extend/operate decision.
- ai/ai-brand-voice (Leonie Marsh) — three persona positions, five-section voice spec (stance/register map/exemplars/NEVER list/escalation registers), blind lineup + perception testing, editorial governance. Distinct from ai-brand-voice-guardrails (writer's craft vs system).
- ai/golden-eval-sets-support-tickets (Dev Khatri) — mining tickets into golden eval sets: anonymisation, intent/difficulty/stakes stratification (40/40/20), layered expectations, weekly + renewal cadence.
- ai/llm-failure-fallback-ux (Aiko Tanaka) — five failure modes, five-tier degradation ladder, diagnostic-honesty error copy, time ceilings, designed degraded state. Hero image: public/images/articles/ai/llm-failure-fallback-ux.jpg.
- All four validated done via finish_article.

## writer2 — iteration 13 (brand ×4)

- brand/brand-colour-beyond-default (June Okafor) — category colour-map wheel, convention-vs-distinctiveness per surface, accessibility as day-one brief, perceptual tint scales as tokens, cheap-screen/print/photo/icon gauntlet. Hero image: public/images/articles/brand/brand-colour-beyond-default.jpg (swatch-card arc, blue-cluster joke).
- brand/co-branding-partnership-rules (Mara Ellison) — four-part taxonomy (endorsement/collaboration/venue/marriage), lockup geometry + optical sizing, colour custody patterns, one-page usage annex (approvals/custody/sunset), locked template kits.
- brand/packaging-to-web-consistency (Mara Ellison) — translate cues don't transpose labels, single claims register, one-shoot-two-framings photography, GTIN/schema/feed machine consistency, twice-yearly drift audit scorecard.
- brand/employer-brand-careers-page (Leonie Marsh) — careers page as most-read brand page, voice parity, real/illustrated/none photography policy, salary-band presentation, qualified-application metrics loop.
- All four validated done (descriptions needed one trim pass for 120–160 char bound).

## writer3 — iteration 11 (brand ×4)

- brand/brand-palette-strategy (Mara Ellison) — competitive colour mapping + squint test, palette job description (UI states, data-viz ramps, one-colour), accessibility as day-one constraint (pairing tables, semantic layer), ownability via combination/proportion, ten-artefact gauntlet.
- brand/icon-systems-brand-assets (June Okafor) — icons as most-touched brand asset, grid decisions (stroke/radius/terminals/fill) as brand character, metaphor registers, custom vs library decision table, motion spec, governance docs that survive turnover.
- brand/rebrand-announcement-day (Mara Ellison) — why→what-stays→unlocks→reveal narrative spine, launch runbook as coordinated deploy, hot-take posture, internal champions preview, six-month receipts case study.
- brand/heritage-brand-modernisation (Mara Ellison) — respect audit (artefact archaeology, recognition testing, language harvest, founder intent), keep/burn/build framework, whitewash failure mode + swap test. Hero image: public/images/articles/brand/heritage-brand-modernisation.jpg.
- All four validated done via finish_article.

## demo1 — iteration 4 (pylon-care-assistant)

- Built `src/demos/pylon-care-assistant/` — mocked "AI support assistant" for Pylon Health: scripted topic bank (10 intents + greeting/thanks), keyword detection with dominance-shaped confidence, token-streamed reveal (reduced-motion = instant), [n] citations → sources drawer, accuracy feedback loop (down-vote → rephrase or human), clinical guardrail + 000/Lifeline emergency card, personal-detail redaction (Medicare/phone/card) before "storage", 3-channel human handover with deterministic ticket id, localStorage transcript with 30-day expiry + restore banner.
- Art direction: calm clinical — warm ivory + glacier teal (distinct from booking demo's warm sage; same fictional client, cooler skin). Scoped `.pca`.
- caseStudy: 'pylon-care-assistant' — **no case-study file exists yet**; a writer should create `src/content/work/pylon-care-assistant.md`. Showcase image at `public/images/work/pylon-care-assistant.jpg` (teal phone-mockup still life) ready for that case study's heroImage.

## writer4 — iteration 11 (brand ×4)

- brand/art-directing-brand-photography (Mara Ellison) — shoot/stock/synthesise buckets, shot list as screenplay of site sentences, one-page lighting language (source/shadows/distance/background/prop rules), hands-before-faces casting, future-proof library practices (plates, versioned packaging shots, RETIRE quarterly). Hero image: public/images/articles/brand/art-directing-brand-photography.jpg (overhead prep-table still life).
- brand/sonic-branding-ui-sound (Hannah Yeo) — why sound gets skipped, tokenised sonic layer cake (signature/functional/notifications/ambience), repetition-proof sound craft (envelope/pitch grammar/loudness), silence-as-strategy states, testing (repetition/speaker/a11y/blindfold) + kill switch.
- brand/employer-brand-inside-out (Leonie Marsh) — perks-page myth, receipts audit table, salary transparency, showing real work with named authors, employer brand lives in every public surface, "would the team forward it?" test.
- brand/naming-international-checks (June Okafor) — Nova-myth framing, tiered linguistic screens, Nice-class trademark discipline, ccTLD/domain/email strategy, homophone/accent/script/initialism tests, finalist "passport" pre-flight checklist.
- All four validated done via finish_article; content index regenerates clean (220 articles, only pre-existing warnings).

## demo2 — iteration 4 (tallow-seat-map)

- Built `src/demos/tallow-seat-map/` — event ticketing with an interactive SVG seat map for Tallow & Co.'s fictional "Supper Series" in The Sawdust Room (36 chairs: 6-stool chef's counter, 20-chair long table, two 3-chair banquettes, 4-stool window rail). Features: 3 supper events with seeded block-pattern availability, party-size selection (1–6) with contiguous anchor-based group logic shared by map and list, SVG seats as real focusable buttons + full chair-list view for keyboard/SR users, per-tier pricing ($145–185), 10-minute hold timer with progress bar and lapse-and-release flow, diner details step (contact validation, per-chair dietary requests, allergies, release-the-chairs promise), order summary slip, and dashed-perforation stub tickets on confirmation with serials, barcode, download .ics and book-another. Reduced-motion honoured; live regions announce selection/expiry.
- Art direction: butcher-paper cream, charcoal ink, stamp red; ticket-stub typography (serif voice + mono stubs), double-border brand stamp, paper-order-slip summary with red dashed left edge. Scoped under `.tsm`.
- meta.caseStudy points at the existing `tallow-and-co-providore` case study (same fictional client). A writer could create a dedicated `src/content/work/tallow-seat-map.md` case study later; showcase image ready at `public/images/work/tallow-seat-map.jpg` (butcher-paper floor-plan still life).

## writer1 — iteration 12 (brand ×4 + product ×4)

- brand/mascot-systems-when-they-work (Mara Ellison) — employment test (recurring emotional moments + named owner), territory map ("error pages yes, invoices no"), rig-not-portrait construction (anchor shape, 3 construction logics, 6 poses, separate face spec), 6-expression library table, motion rules, retirement-with-dignity. Hero image generated: public/images/articles/brand/mascot-systems-when-they-work.jpg (fern-spirit specimen sheet in 6 poses).
- brand/brand-audit-90-minutes (June Okafor) — triage framing (drift/debt/mismatch), 12-tab consistency sweep, read-aloud voice sampling, asset-findability inventory, mismatch check, 8-criterion 0–2 scoring sheet with band readings and pattern diagnostics, fix list + kill list + one board slide.
- brand/packaging-thinking-digital-brands (Mara Ellison) — 32-pixel identity problem (glyph→icon→logo cascade), grid/facing test, brand block (GLADE example), range/tier architecture rules, back-of-pack trust surfaces (Hearthbrew receipt-email example), 10-minute wild audit.
- brand/co-branding-without-mush (June Okafor) — five pre-nup questions, hosted/endorsed/paired structures, lockup maths (optical weight not pixel height, divider/clear-space rules), palette territory not blending, one-narrator voice rule, trailer test, sunset clause.
- product/multi-step-flows-wizards (Aiko Tanaka) — step cost triad (cognitive/fetching/commitment), momentum-not-schema ordering, when one long page wins, progress honesty rules, one-decision-per-screen, silent draft persistence + resume UX, in-moment errors, sacred back button.
- product/settings-design-neglected-ux (June Okafor) — month-three judgement framing, deliberate-defaults audit (median want / blast radius / should-it-exist), consequence-over-mechanism copy, dangerous-action friction budget + undo-over-confirm + danger zone, settings search (synonym indexing, inline controls, deep links, empty-result mining), 1-hour quarterly audit.
- product/research-repository-that-gets-used (Aiko Tanaka) — atomic notes (observation/evidence/interpretation/strength/context), browse-vocabulary taxonomy with ~30-tag ceiling + gardener, insight half-lives and visible revalidation, two-way decision links, ambient shop window (feed/embeds/quarterly synthesis), consent & PII governance.
- product/prioritisation-beyond-rice (Ruby Castellanos) — disagreement-finding-machine reframe, strategy-bet filters before scoring, value×evidence 3×3 map (learning queue vs build queue), sequencing-for-learning heuristics, meeting format (silent scoring → fight deltas from evidence → decision log read aloud), keep the stack small.
- All eight validated done. Backlog note for writers: demo case studies still wanted for pylon-care-assistant and tallow-seat-map (heroes already exist under public/images/work/).

## writer3 — iteration 12 (product ×4)

- product/dashboard-empty-states (Aiko Tanaka) — blank dashboard as the activation funnel step, three archetypes (first-run fast-forward / cleared repair / lapsed alarm) with explicit code branching, sample-data rules (labelled, reality-shaped, full code path, reversible swap), four-line one-verb copy frame, escape-rate + time-to-data instrumentation, Northwind Ledger illustrative metrics.
- product/settings-design-adult (June Okafor) — settings as deferred decisions; three rots (accretion/orphans/dangerous defaults), five-question gatekeeper rubric, quarterly audit ritual with 0–2 scoring table (usage/legibility/health/default-safety), safe-kill mechanics (migrate-first, cohort staging, email affected, graveyard doc), landlord ownership. Distinct from settings-information-architecture (structure) and settings-design-neglected-ux (defaults/copy/friction) by taking the governance & audit-lifecycle angle.
- product/command-palette-craft (Aiko Tanaka) — task-router not search box (destinations/actions/objects/contextual), five-layer ranking (exactness→recency→frequency→context→global, per-user, labelled), subsequence + typo tolerance + hand-grown synonym table from zero-result logs, keyboard contract (focus in input, footer hints, <150ms, static registry), inline-argument actions with parsed previews, palette-as-crutch caveat. Hero image: public/images/articles/product/command-palette-craft.jpg (keyboard still life, cream/fern/brass).
- product/undo-not-confirm (Felix Brandt) — confirm habituation + risk-transfer critique, four properties of real undo (deferred/invertible action, 6–10s visible window, keyboard a11y, survives navigation), four-band reversibility model table (reversible/soft-delete/scheduled-cancellable/irreversible), soft-delete engineering notes (scoped queries, purge UI, idempotent inverses, cascades), when confirm is earned + informative-dialog rules, trust-dividend metrics.
- All four validated done via finish_article.
