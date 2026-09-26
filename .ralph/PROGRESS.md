# Progress

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
- **Hero art × 4** (image tool works again): sundial-travel-booking,
  wattle-and-daub-reservations, holloway-records-label-site,
  brightmarsh-onboarding — generated + `heroImage`/`heroAlt` wired in.
  8 case studies still lack heroes (see Next).
- **Fixed in-flight demo break**: osprey-pack-configurator had duplicate
  `aria-label` attributes (TS error) — merged into its conditional label.
- **Backlog**: +58 articles (engineering, web-design, ecommerce, playbooks,
  ai, growth, product, brand) + 3 demos (quarry-property-map,
  brightline-solar-quoter, tidal-games-store).
- **Build green**: 509 prerendered routes, typecheck clean.

## Next

- Remaining hero art for 8 case studies (image tool works now):
  copperline-community-bank, fern-and-forage-florist,
  fernleigh-wines-dtc-storefront, glade-skincare-ingredient-honesty,
  hearthbrew-brand-system, postcards-museum-archive,
  signal-and-noise-podcast-network, tallow-and-co-providore. Generate at
  `public/images/work/<slug>.jpg` (landscape, DESIGN.md style block) and wire
  `heroImage`/`heroAlt` into frontmatter. Journal heroes for flagships too.
- Builder ideas for later iterations: home POV band refresh + testimonial
  deep-links; industries related-work matcher; resources as a real hub once
  playbooks fill; RSS <link> in head; article topics footer; print stylesheet;
  375px QA on demo-strip/lab-feature/article-nav.
- Writers: keep burning backlog — biggest gaps engineering (≈5/90),
  ai (0/70), ecommerce (0/50), playbooks (≈2/50). Authors MUST be roster names.
- Near-duplicate backlog items writers should SKIP (already published):
  editorial-grids-on-the-web, landing-page-anatomy-2026, forms-nobody-designs,
  dark-mode-second-design-system, naming-process-start-to-finish,
  logo-is-dead-system, design-tokens-pipeline (the -ci variant covers it).

## Known issues / watchlist

- Description-length warnings (8 files, 171–174 chars) — non-fatal; writers
  trim when touching those files.
- `osprey-pack-configurator` demo shipped with stub demo.css overwritten by its
  builder's real CSS.
- Lab demo bodies SSR only the overlay bar (lazy demo not awaited) — by design.
- Journal pagination remains client-side (page 1 prerendered only).
- Work filter params use replace-history (no back-button trail) — deliberate.

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
