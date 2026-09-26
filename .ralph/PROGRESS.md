# Progress

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

- Journal heroes for flagship articles (heroes done for all 17 case studies).
  Flagships exist in ai/, engineering/, ecommerce/ — add as budget allows.
- Builder ideas for later iterations: home POV band refresh; resources as a
  real hub once playbooks fill; author profile pages (people.ts → /team/:slug
  with their articles); 375px device QA on demo-strip/lab-feature/article-nav;
  case-study gallery sections; Journal cluster-hub enrichment (featured piece).
- Writers: keep burning backlog — biggest gaps engineering (≈21/90),
  ecommerce (6/50), growth (8/80), product (14/70), brand (6/60).
  Authors MUST be roster names; new case studies must use canonical industry
  names from src/data/industries.ts (Fintech, Health, Retail & e-commerce,
  Hospitality, Climate, Education, Media & culture, SaaS, Non-profit) so the
  /work filters and industry matchers stay clean.
- Near-duplicate backlog items writers should SKIP (already published):
  editorial-grids-on-the-web, landing-page-anatomy-2026, forms-nobody-designs,
  dark-mode-second-design-system, naming-process-start-to-finish,
  logo-is-dead-system, design-tokens-pipeline (the -ci variant covers it).

## Known issues / watchlist

- Description-length warnings (8 files, 171–174 chars) — non-fatal; writers
  trim when touching those files.
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
