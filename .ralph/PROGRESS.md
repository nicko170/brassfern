# Progress

## Done (iteration 11 — builder: tag canonicalisation, full press kit, industry journal signals, demo backlog, 2 heroes)

- **Tag canonicalisation pipeline** — `build-content-index.mjs` now normalises
  every tag (lowercase + `TAG_ACRONYMS` map: SEO, UX, AI, RAG, WCAG, CMS, CRO…
  and "saas" → "SaaS"). 354 case fixes in one pass; duplicate prerendered tag
  pages (`/journal/tag/UX` vs `/journal/tag/ux`) collapse to canonical URLs
  (1,511 routes, was 1,523). `TagPage` redirects mis-cased URLs client-side
  (`<Navigate replace>`) to the canonical casing. Chips, `byTag`, related
  scoring and search all share the canonical vocabulary now; writers can keep
  typing tags however they like.
- **Press → real press kit** (`src/pages/Press.tsx`): fictional mentions (4
  outlets), fast-facts fact-list, short + long boilerplate wells with a new
  clipboard **CopyButton** (`src/components/CopyButton.tsx`, aria-live state),
  a six-row fictional announcements reel linking to real pages, and a brand
  asset grid with six downloadable SVGs designed from the in-app FernMark
  (`public/press/`: mark/wordmark in ink + paper, brass accent mark, night
  avatar badge; Georgia-fallback wordmark type so the SVGs render anywhere).
  Do/don't usage rules; night CTA. New CSS: `.boilerplate`, `.press-row`,
  `.asset-grid`/`.asset-card`, `.check-list`.
- **Industry pages enriched** (`src/data/industries.ts` gains required
  `services[]` + `signals[]` per sector): IndustryPage now renders "What we do
  here" service chips and a "From the journal" section — articles scored by
  canonical-tag intersection with the sector's signal list, newest breaking
  ties, top 3; hides itself if no matches. Nine deeper, internally-linked
  pages for free.
- **Demo backlog**: +4 rich intents (orrery-sunday-podcast,
  assembly-room-ticketing, cartouche-identity-generator, tidemark-field-logger)
  — planned demos now 8 while builders work.
- **Heroes**: generated for growth/content-strategy-compounds and
  brand/measuring-brand-health (both flagships named in Next); frontmatter
  heroImage/heroAlt added.
- **Build-gate rescues**: brightmarsh-course-finder price facet passed a
  `(p: number)` predicate where `(c: Course)` was wanted — wrapped at call
  site; trailswell-habit-tracker `let p` TS7022 circular — annotated
  `p: number`. Trimmed 4 fresh over-length AI descriptions to ≤160.
- **Build green: 1,511 prerendered routes + 404**, 0 content warnings,
  link audit clean, dist verified (press SVGs copied, 6 download links,
  canonical tag dirs, industry sections present).

## Done (iteration 10 — builder: visible breadcrumbs, JobPosting schema, /colophon + /sitemap pages, QA)

- **Visible breadcrumbs everywhere deep** — new `src/components/Crumbs.tsx`
  (`.crumbs`): mono trail, brass "/" separators, current page plain with
  `aria-current="page"` (ellipsis at 32ch, hidden ≤560px since the h1
  repeats it). Rendered as the first child of `.article-head` on Article,
  WorkCase, ServicePage, IndustryPage, JobPage, PersonPage and TagPage —
  the visible twin of the BreadcrumbList JSON-LD those pages already emit.
- **JobPosting JSON-LD + published salary bands** — `jobs.ts` gains
  structured fields per role: `salary {text,min,max,currency}`, `posted`,
  `closes` (ISO), `remote`, `applicantLocations[]`, optional `office`.
  New `jobPostingLd()` in jsonld.ts (hiringOrganization, TELECOMMUTE +
  applicant country requirements for remote roles, PostalAddress for the
  two office roles, baseSalary QuantitativeValue, validThrough). Job pages
  show a `.fact-list` (band/team/location/type/posted/closes); careers
  index rows now print the band; careers lede says bands are published —
  matching the studio voice.
- **New page `/colophon`** — "Notes on the making of": three type
  specimens (Fraunces display/italic, Instrument Sans body, IBM Plex Mono
  labels), a 12-swatch token palette grid, the machinery fact-list (stack,
  prerendering, fonts via Google, GitHub Pages, no trackers, generated
  imagery), a night "The author" section with the mandatory concept-studio
  statement verbatim, four craft commitments (AA, reduced-motion, perf,
  honesty), "keep wandering" rows to approach/studio/sitemap.
- **New page `/sitemap` (human-readable)** — auto-derived from the same
  data as the route table: Start here (13), Services (6), Industries (9),
  journal clusters with live counts + tag total, ready lab demos, team,
  jobs, fine print, and a two-column all-case-studies list. Header count
  ("N+ pages") computed from those sources — can't drift. `.map-grid` /
  `.map-list` / `.map-count` CSS. Footer gains Colophon + Sitemap links;
  both routes added to App + prerenderRoutes (and thus sitemap.xml).
- **Build-gate rescue** — link audit failed on a fresh writer file
  (growth/alternative-to-pages-program linking to unwritten
  `voice-of-customer-mining`); retargeted the link to the existing
  customer-stories-that-rank playbook with adjusted anchor copy.
- **Description QA round 2** — trimmed 6 over-length descriptions
  (171–174 → 153–157 chars) across growth/playbooks/product files.
- **Backlog restocked** — +26 articles: product 15 (cluster was furthest
  behind: filters, D&D accessibility, sparklines, dark mode strategy, i18n
  UX, account deletion, scheduling/timezones, drawer-vs-page, avatars,
  offline states, surveys, confirmations, saved views, status pages,
  admin panels), brand 4, ai 4, ecommerce 3. Planned total ≈162.
- **Build green: 1523 prerendered routes + 404** (was 1410), sitemap
  contains /colophon + /sitemap, JobPosting/TELECOMMUTE/band verified in
  dist, crumbs + aria-current verified on article and case pages, zero
  content-index desc warnings remain, link audit clean.

## Done (iteration 9 — builder: crawlable journal pagination, intent prefetch, bench list, QA)

- **Route-based journal pagination (prerendered)** — replaced client-only
  `useState` pagination (`href="#top"` anchors, invisible to crawlers/no-JS)
  with real routes: `/journal/page/:n` and `/journal/:cluster/page/:n`,
  all statically prerendered (27+ hub pages added). Shared logic in
  `src/lib/paginate.ts` (`JOURNAL_PAGE_SIZE`, `journalPages`,
  `restCountFor`, `pageHref`, `pageWindow`) — used by both the pages and
  `entry-server.prerenderRoutes()` so route lists can't drift. Featured
  lead story stays excluded from the page counts. Windowed Pagination
  component (first/last/current±1, `…` gaps, ‹/› prev-next, `aria-current`,
  rel=prev/next); page 2+ get `Journal — page N of M` titles, self-canonical,
  extra BreadcrumbList rung. `/journal/page/1` 404s (canonical is the hub).
- **Hover/focus intent prefetching** — new `src/lib/prefetch.ts`: delegated
  `pointerover` + `focusin` listeners (wired once in Layout) warm the
  destination's page chunk AND the article/case-study markdown body before
  the tap. Saves ~most of route-chunk latency across 1400+ routes. Deduped
  per session, base-path aware, skipped on `navigator.connection.saveData`,
  retries allowed after a failed fetch.
- **Demo readiness guards** — `isDemoReady`/`readyDemos`/`benchDemos` in
  `lib/demos.ts`. In-flight demos (meta.ts but no index.tsx) used to link
  from /lab and /work into NotFound pages: now they're excluded from
  prerender routes, the Lab feature/grid, the home lab band and case-study
  demo strips; /lab shows them in a non-linked "On the bench" list
  (`.bench-list`). Case-study links in the Lab feature and demo bar are
  now verified against `getCase()` — demos pointing at unwritten case
  studies (e.g. `glasshouse-ticketing-relaunch`, planned) no longer 404.
- **Description QA** — trimmed 24 over-length frontmatter descriptions
  (171–183 chars → ≤160) across ai/brand/ecommerce/engineering/growth/
  playbooks/product/web-design + one work file. Content index warnings
  now only the deliberate `#`-placeholder notes in the link audit.
- **Backlog restocked** — +8 work case studies (incl. `glasshouse-ticketing-
  relaunch` matching the seat-map demo, and studies for the four newest
  planned demos: trailswell, switchyard, copperplate) and +39 articles
  weighted to the most-behind clusters: ecommerce 9, brand 7, ai 7,
  web-design 5, engineering 4, growth 3, playbooks 3, product 2.
- **Build green: 1410 prerendered routes + 404**, sitemap/robots/rss,
  no skeleton HTML outside /lab, pagination + canonical + aria-current
  verified in dist, bench list correctly absent while all 20 demos have
  entries, CI fixture builds with local BASE=/ (CI's /brassfern/ path
  unchanged by this work).

## Done (iteration 8 — builder: studio clocks, cursor ring, demo backlog, build rescue)

- **Four-city studio clocks** — new `src/components/StudioTime.tsx` exports
  `ClockStrip` (footer, between Fieldnotes and the colophon: mono city/time
  rows with a brass "open" dot) and `ClockGrid` (Contact page "Where we are,
  right now" section: big Fraunces tabular times, desk note, open/off-the-clock
  status line, plus a booking-window line — "January 2027 is the next open
  door"). Client-only rendering (em-dash placeholders in prerendered HTML, so
  no hydration mismatch), ticks every 20s, tabular-nums, full
  `visually-hidden` status text. Added a `.visually-hidden` utility to app.css.
- **Signature cursor ring** — new `src/components/Cursor.tsx`: a brass ring
  that trails the pointer with rAF lerp (0.22) and blooms over interactive
  elements (a/button/input/select/chip via delegated mouseover). Gated three
  ways: SSR renders nothing, `pointer: fine` required, and
  `prefers-reduced-motion` aborts. It never hides the system cursor; z-index
  2100, pointer-events none, transform-only updates.
- **Demos backlog +4** (planned now 8): `trailswell-habit-tracker` (risograph
  heatmap/ring tracker), `meridian-climate-heat-story` (scrollytelling summer
  heat story, static fallback under reduced motion), `switchyard-kanban`
  (drag + full keyboard shuttle, WIP limits, localStorage),
  `copperplate-ds-docs` (typefounder-specimen DS docs with live token
  playground). All with rich art-direction intents for demo builders.
- **Build rescue — glasshouse-seat-map demo was committed broken** (in-flight
  demo builder): fixed a malformed template literal in `SeatMap.tsx` (stray
  `}` inside the string, missing JSX container close), exported `CX` from
  `data.ts`, and boxed the closure-assigned `best` accumulator in
  `findBestAvailable` (classic TS "narrowed to never" through closures).
  Typecheck clean again.
- **Build green: 1268 prerendered routes + 404**, sitemap/robots/rss emitted,
  no skeleton HTML outside /lab, clock strip + clock grid + visually-hidden
  confirmed in dist HTML. Content index: 302 articles + 33 case studies.
- **Backlog state**: articles planned 128 (no top-up needed); demos planned 8.
  `.ralph/DESIGN.md` documents the cursor ring and clocks under Signature
  elements.

## Done (iteration 7 — builder: reading experience, ⌘K quick find, fieldnotes, backlog)

- **Table of contents on all long reads** — new `src/lib/toc.ts`
  (`parseToc()` regex-extracts h2/h3 ids from rendered markdown HTML),
  `src/components/Toc.tsx` sticky scroll-spy nav ("On this page", brass
  left-rail active state), and `.article-layout` grid (content + 16rem aside,
  ≥72em only; aside hidden otherwise). Articles and case studies show the TOC
  when ≥3 h2s exist. `.prose h2/h3` get `scroll-margin-top` for hash jumps.
- **Reading progress hairline** — `src/components/ReadingProgress.tsx`:
  rAF-throttled scroll-linked brass gradient bar (2px, fixed top, transform
  scaleX, zero CSS animation). Rendered on Article + WorkCase.
- **⌘K quick-find palette** — `src/components/QuickFind.tsx`: global ⌘K/Ctrl+K
  (`useQuickFindShortcut`), header `.find-btn` (≥1020px), night dialog with
  combobox/listbox ARIA, arrow-key navigation, Enter-to-go, esc/backdrop close,
  focus restore, body scroll-lock, route-change close. Searches journal+work
  (`searchContent`) + static page jumps; empty query shows popular tag chips.
  Mobile menu gained a Search row → `/search`.
- **Fieldnotes letter signup** — footer newsletter block (`.foot-news`)
  between foot-grid and colophon: email validation with inline error + success
  panel, night-surface styling, honest concept-studio microcopy.
- **Markdown component refactor** — `Markdown` now takes preloaded
  `html: string | null`; pages use the new `useBody()` hook
  (`src/lib/useBody.ts`) so they can hand the same HTML to the TOC.
- **Backlog**: +57 articles (web-design 18, growth 14, ai 12, engineering 12,
  product 13 — planned total back to ~168) and 1 case study
  (`work/pylon-care-assistant`, matching the demo; hero image already at
  `public/images/work/pylon-care-assistant.jpg`). Removed my duplicate Tidal
  item and enriched the existing `tidal-games-storefront` plan with
  frontmatter hints (demo: tidal-games-store; hero exists).
- **Known gaps for writers**: case studies wanted for demos
  `pylon-care-assistant` and `tidal-games-storefront` (both hero images ready
  under `public/images/work/`); `tallow-seat-map` demo meta points at existing
  `tallow-and-co-providore` — a dedicated seat-map case study is optional.
- **Build green: 1106 prerendered routes**, typecheck clean, link audit clean,
  BASE_PATH=/brassfern/ CI-equivalent verified, no skeleton HTML outside /lab,
  TOC + progress bar + find-btn + fieldnotes confirmed in dist HTML.

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

- Journal heroes: ~310 articles still use themeFor tiles. Keep spending the
  image budget on flagships (2/iteration) — next candidates: web-design
  leads, engineering/performance pieces, ecommerce flagships.
- Builder ideas for later iterations: home POV band refresh; 375px device QA
  sweep (demo-strip/lab-feature/feature/person-hero/squad/press-kit grids
  verified in CSS but not on a real device); OG images per case study
  currently fall back to heroImage (good) — dedicated 1200×630 variants
  possible; ~930 tag pages exist and many are 1-article thin — consider a
  per-cluster tag index or min-count pruning for prerender only.
- Writers: keep burning backlog — run `node scripts/audit-links.mjs` before
  finishing (broken internal links are now FATAL in prebuild).
  Authors MUST be roster names; new case studies must use canonical industry
  names from src/data/industries.ts (Fintech, Health, Retail & e-commerce,
  Hospitality, Climate, Education, Media & culture, SaaS, Non-profit) so the
  /work filters and industry matchers stay clean. Tag casing no longer
  matters (pipeline canonicalises).
- Near-duplicate backlog items writers should SKIP (already published):
  editorial-grids-on-the-web, landing-page-anatomy-2026, forms-nobody-designs,
  dark-mode-second-design-system, naming-process-start-to-finish,
  logo-is-dead-system, design-tokens-pipeline (the -ci variant covers it).

## Known issues / watchlist

- Deliberate `](#)` placeholder links in 5 case studies + 1 playbook
  (rhetorical "metrics are illustrative" device) — warned by audit-links,
  not fatal. Consider pointing them at a real anchor eventually.
- Work frontmatter mixes inline YAML lists (`stack: [a, b]`) and longhand
  (`stack:` + `- item`) — both valid; if you script-edit frontmatter, insert
  keys before the closing `---`, never after a bare `stack:` line.
- Lab demo bodies SSR only the overlay bar (lazy demo not awaited) — by design.
- Work filter params use replace-history (no back-button trail) — deliberate.
- Industry pages saas / non-profit have no matching case studies yet — the
  related-work section omits itself until one ships; the new "From the
  journal" signals section covers the gap meanwhile.
- ~930 distinct tags → many 1-article tag pages; fine for now, prune or
  cluster if it starts to look thin.

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

## writer2 — iteration 15 (work ×4 case studies)

- work/marlowe-hotels-direct-booking-relaunch (Mara Ellison) — boutique coastal hotel group retreating from OTA dependency: direct-rate promise as a design-system component, three-step booking island over channel-manager API with edge-cached availability, 1.5s LCP performance budget (1.2s p75 field), Sanity package engine, migration with zero lost rankings. Illustrative outcomes: direct share 24%→38%, offer-page bounce -41%, list 4.1k→11.8k. No live demo (intent specified none). Hero image skipped — hourly image budget spent.
- work/quill-legal-document-platform (Aiko Tanaka) — legaltech SaaS redesign: matter-centric IA, split-view template builder with plain-language rules compiled to legacy syntax, preview-as-trust-surface highlighting, Precedent design system shipped as versioned tokens with WCAG 2.2 AA acceptance criteria, Quill-led final month (slope not cliff). Outcomes: task success +44%, trial→paid +31%, champion dependency 1.2→3.4 users/firm.
- work/saltbush-collective-marketplace (Nate Sullivan) — two-sided regenerative-farm marketplace: producer-first storefronts, season grammar replacing stock states ("remind me when the blood oranges are back" = biggest email capture), one-basket/four-fulfilment checkout with freshness-framed split delivery, suburb-level route windows. Outcomes: 52% repeat within 90 days, +$14 basket, zero farm churn, 6,300 remind-me sign-ups.
- work/beacon-health-ai-triage (Dev Khatri) — responsible-AI triage assistant for a regional clinic network: 48 clinician-gold scenario eval suites before any UI, 23-intent taxonomy with protocol cards (constrained generation over reviewed decisions), deterministic red-flag lane that locks the conversation, confidence-as-sentences, clinician review queue designed before the chat UI, 2am voice. Outcomes: 96% escalation precision, zero under-triages across ~19k conversations, reception peak volume -44%, CSAT 4.6/5.
- All four validated done via finish_article.

## writer1 — iteration 13 (work ×4 case studies)

- work/harvest-loop-food-rescue (Aiko Tanaka) — Non-profit food-rescue logistics: chose a Workbox PWA over native (no app-store gatekeeping, volunteers' old Androids), run sheet pre-cached on depot wifi then offline-by-default, three-button stops with gloves-on testing, answer-first donor/ops dashboards, quarterly funder impact *pages* at shareable URLs replacing PDF reports, operability/runbook budgeted for a part-time successor. Illustrative outcomes: pickup completion 82%→96%, onboarding 40min→9min simulated run, reporting 4 days→40 min, compliance queries -70%.
- work/quarry-and-compass-property (Felix Brandt) — SaaS property platform (industry: SaaS, real-estate brief): diary studies split grazers (70%) vs hunters; laziness-gradient search surface; pre-clustered tile map with a 220KB viewport tile budget (11s→2.5s interactive on regional 4G); saved search as consent-first ritual with a "little magazine of my possible lives" digest; honest listing pages with computed sun-path arcs and a visible "what we couldn't verify" line as agent-pressure UI; sourced/humble school catchments. Outcomes: sessions/WAU +41%, saved searches ×3, digest open 58%, verify-lines fell by two-thirds.
- work/larklight-saas-marketing-site (Priya Nair) — field-service SaaS marketing rebuild: two-week messaging sprint ("It stops jobs falling through the cracks" headline mined from customers), crew-size slider pricing in real dollars (enterprise too), 11-field demo form → 3 fields + calendar, chaptered four-minute recorded demo for 9pm visitors, standing CRO cadence with pre-registered kill criteria, tracking-plan-before-tools. Outcomes: demo rate 0.9%→2.1% with spend flat, sales cycle -9 days, organic demos +38%.
- work/easement-legal-service-finder (Leonie Marsh) — Non-profit community legal centre: life-event service finder ("my landlord is evicting me" not legal taxonomy), four first-class language editions with adapted IA + persistent interpreter line, fee *shape* band on the homepage (kills the "I probably can't afford this" preface), trust via the real scruffy advice room + named solicitors + regulator line, static Astro + Pagefind build for prepaid-Android speeds, grade-8 reading level checked with humans. Outcomes: wrong-line calls -62%, non-English sessions 29%, Saturday-evening traffic ×3.
- All four validated done via finish_article. Hero images skipped (hourly image budget spent) and heroImage refs removed; heroes remain wanted at public/images/work/{harvest-loop-food-rescue,quarry-and-compass-property,easement-legal-service-finder}.jpg — regenerate when budget allows.

## writer3 — iteration 13 (work ×4 case studies)

- work/brightline-solar-quote-engine (Sam Whitfield) — Climate; solar installer's PDF quote form → 40-second estimate engine. Estimate-first architecture (address+bill → pin nudge → confidence-banded estimate with "why this number" drawer), shade/eligibility heuristics shown honestly, three-route finance comparison as content, qualification questions *after* value (calendar for hot leads, nurture for cold), server-side quotes stored with assumptions + 30-day expiry. Outcomes: qualified leads +71%, CPL -33%, completion 64%, quote-to-close 16d→6d. Linked demo: `demo: brightline-solar-quoter` in frontmatter — demo folder is in-flight (no meta.ts yet), so body links /lab not /lab/brightline-solar-quoter (audit-links would fail); once the demo ships, restore the deep link. Hero image: public/images/work/brightline-solar-quote-engine.jpg (rooftop model + brass slide rule flat-lay).
- work/fernway-college-admissions-platform (Leonie Marsh) — Education; Adelaide Hills school consolidating marketing/enrolments/alumni/news onto React+Sanity. Save-and-return enrolment wizard chunked by decision, structured content objects (story/event/person/program/policy) killing copy-paste, "Ivy" design system (sandstone/eucalypt/navy from campus), alumni register same spine different voice, training + field guide + editorial clinic. Outcomes: enquiries +46%, completions +58%, publishing time -60%, abandonment 71%→24%.
- work/coriander-collective-restaurant-group (Mara Ellison) — Hospitality; six Sydney venues, one spine six personalities. Venue themes as token sets (corner radius through photography recipe; accessible primitives shared), one reservation availability service across six table maps, group-site "Where can we eat tonight?" cross-venue availability (19% of bookings switch venue), gift-card storefront (per-venue or group-wide), structured menus in Sanity. Outcomes: reservation completion +34%, gift revenue 5x, direct bookings 41%→78%. New fictional client — add to clients.ts wordmark wall if a builder touches it.
- work/arkwright-supply-b2b-commerce (Nate Sullivan) — Retail & e-commerce; fictional 40k-SKU industrial supplier. Depot-and-ute discovery (phone orders timed 6m40s), alias-first Elasticsearch search (trade slang, misspellings, competitor part numbers; zero-results 34%→3.8% with weekly synonym gardening), four bulk-order modes incl. named reorder lists, account pricing/volume breaks/credit terms at checkout, quote-as-cart-state with rep dashboards. Outcomes: phone volume -48%, reorder time -70%, online 31% of orders. New fictional client (also clients.ts candidate).
- All four validated done via finish_article.

## writer4 — iteration 13 (engineering ×3 + web-design ×1)

- engineering/schema-validation-shared-contracts (Felix Brandt) — one Zod schema shared across client form, API handler and batch jobs via a framework-free contracts package; contracts own error copy (`toFieldErrors`/`toApiError`) so surfaces can't drift; client validation is UX vs server validation is security; additive changes free, breaking changes get explicit version suffixed schemas with log-driven deprecation; honest leaks (bundle size, draft-state schemas, cross-language codegen, property-tested schemas).
- engineering/error-boundaries-resilient-ui (Tomás Reyes) — boundaries as fire doors placed where UI has independent value (routes, stateful regions, third-party islands); three standardised fallbacks answering what happened / is my data safe / what now / whose fault; journaled-draft work preservation validated against the shared schema on restore; retry attempt budgets with escape hatches to stop crash loops; fingerprinted reporting with weekly budgets; async errors need their own channel (boundaries never see most real failures).
- engineering/font-loading-performance-recipes (June Okafor) — CI-driven pyftsubset subsetting with committed subsets and a build-failing codepoint coverage script; unicode-range slicing for multilingual sites; per-role font-display policy (swap body/display, block icons-or-SVG); metric-matched override fallbacks to zero out font CLS; max two crossorigin preloads; RUM INP long-task side-effect of late font arrival; five-item pre-launch font audit card.
- web-design/cookie-banners-honest-design (Leonie Marsh) — dark-pattern inventory with a mechanical test (equal clicks, equal visual weight); layered consent (40-word three-way first layer, grouped plain-language preferences panel); consent UI as design-system components in the token layer; CMP measured as third-party script tax (60–120KB, +400ms LCP on Moto-class); design stack so "no banner needed" is possible; honesty costs analytics-consent rate but no revenue. Hero image generated: public/images/articles/web-design/cookie-banners-honest-design.jpg.
- All four validated via finish_article; link audit 0 broken; my three >160-char descriptions trimmed to spec.

## demo3 — iteration 5 (demo shipped: quarry-property-map)

- `src/demos/quarry-property-map/` — Quarry & Compass map-first property search (fictional Ironbark Shire, 67 generated listings, 8 districts).
  - SVG survey map with viewBox pan/zoom (wheel + drag + arrow/±/0 keys), suburb clusters below 1.7× zoom splitting into focusable pins, draw-a-boundary polygon search (point-in-poly), price/beds/type/commute-live filters, saved searches + shortlist in localStorage, detail sheet with inspection-slot booking (validated, ref code), list-only view + live-region announcements, reduced-motion safe.
  - Art direction: sun-bleached sandstone/eucalyptus/surveyor-orange survey-map; generative per-lot SVG "photos" (Art.tsx). Allied hero/mockup image: `public/images/work/quarry-property-map.jpg`.
  - Showcase hero image: `public/images/work/quarry-property-map.jpg` (map + compass still life).
- NOTE for writers: the case study `work/quarry-and-compass-property` already exists but content files are outside my sandbox — it still needs frontmatter `demo: quarry-property-map` to surface the ".demo-strip" band, and could use `heroImage: /images/work/quarry-property-map.jpg` with alt text (image is ready; writer1 wanted a hero at the case-study slug name, so copy/rename as preferred).
- Typecheck clean for all quarry-property-map files; other errors in tree at the time (tidal-games-store, Article.tsx/WorkCase.tsx) belonged to in-flight workers.

## writer1 — iteration 14 (2026-09-26)
Completed 4 journal articles (all validated done):
- web-design/print-stylesheets-still-matter (Aiko Tanaka) — print as a real design surface: exceed-all for print, link URL expansion, page-break grammar, print-to-PDF testing.
- web-design/seasonal-theming-without-rebrand (June Okafor) — token-scoped campaign themes, data-theme overrides, expiry automation, "weather not building" rule.
- web-design/perceived-performance-design (Hannah Yeo) — skeleton shapes/gating, zero-CLS as perception, optimistic UI integrity, staged-wait narrative.
- engineering/local-first-sync-engines (Felix Brandt) — field notes from Harvest Loop sync build: field-level LWW vs delta-counters, conflict UX, ops-log discipline; positioned as the companion to engineering/offline-first-sync-engines (survey piece).
No hero images generated this iteration (budget conserved); pieces stand on text. All internal links audited green by finish_article.

## writer2 — iteration 16 (web-design ×4)

- web-design/related-content-modules (Leonie Marsh) — related-content modules that earn their place: pick one job per template (session continuation vs funnel progression vs mismatch rescue); boring build-time ranking (cluster +4, shared tags +2 cap, service family, recency tiebreak, +10 editorial pin) beats runtime "personalisation"; three cards max with reading-size titles and honest headings; mid-article aside and in-prose links outperform footer modules; measure module CTR against scroll-sentinel reachers with a pre-set kill criterion — delete losers. Links: internal-linking-architecture, third-party-scripts-audit, case-study-page-design, content-clusters-strategy, footer-design-matters, author-byline-trust-design (same iteration).
- web-design/author-byline-trust-design (Mara Ellison) — bylines/author pages as trust infrastructure: named authors lift scroll depth (~19% observed) and 2–4% byline CTR; byline anatomy (readable-size name, plain role, one consistent portrait register, honest dates, whole block linked); author page = stance line, proof-bearing bio, mapped credentials, framed work, one follow path; Person/ProfilePage schema documents only visible truth; roster hygiene (editor-extracts-not-impersonates, alumni honest, credit invisible roles). Links: /team, photography-style-without-a-photoshoot, schema-markup-playbook, brand-voice-charts, employer-brand-careers-page, related-content-modules.
- web-design/icon-systems-svg-discipline (June Okafor) — SVG icon system craft: 24px grid with fixed key shapes + committed optical corrections; stroke law (per-size weights, round joins, outline strokes before export, drawn-not-toggled filled variants); one Icon component owns viewBox/currentColor/ARIA contract; sprite+<use> for dense pages, inline for sparse, never React barrel files; quarterly pruning (unreferenced deleted, path-hash near-duplicate CI gate, byte-budgeted sprite, checked-in SVGO config, function-not-shape naming). Links: brand/icon-systems-brand-assets, design-tokens-pipeline, bundle-budget-discipline, colour-systems-dark-mode, accessible-design-handoff.
- web-design/focus-visible-beautiful (Aiko Tanaka) — focus rings designed, not deleted: `:focus-visible` as the contract; ring as brand signature via tokens (--focus-ring-color per surface incl. night flip, 3px offset, matched radius, 3:1 contrast); hard cases (dark sections, images/double-ring, overflow-hidden clipping, custom controls' peer ring, orthogonal selected-vs-focus signals); Tab Walk ritual + CI token-diff check + named owner. Links: wcag-aa-product-teams, colour-systems-dark-mode, sticky-elements-that-dont-annoy, keyboard-first-interfaces.
- All four validated done via finish_article. Hero image for focus-visible-beautiful skipped — hourly image budget spent; wanted at public/images/articles/web-design/focus-visible-beautiful.jpg (keyboard key + fern focus ring + brass caliper still-life) when budget allows.

## demo2 — iteration 5 (demo shipped: tidal-games-store)

- `src/demos/tidal-games-store/` — Tidal Games neo-arcade indie storefront (fictional Fremantle publisher, 12 invented games, 5 curated palettes).
  - Seeded-canvas cover art + in-game screenshot tiles (`CoverArt.tsx`: banded skies, rasterised moons, sine-ridge terrain, HUD chrome; image-rendering pixelated), hero starfield canvas with pointer parallax (static under reduced motion), demo-reel marquee (pauses on hover, static under reduced motion).
  - Catalogue filters: search, platform chips, genre select, price slider, on-sale + wishlist toggles, sort; live count + "reset the sonar". Detail sheet (focus-managed dialog) with specs, star ratings, screenshots strip. Cart drawer with discount-code logic (TIDAL10 / BUNDLE3 3+ / ABYSS US$60+, validated + removable), regional pricing AUD/NZD/USD with .99 endings (locale-formatted), mock checkout issuing stable fake game keys. Cart, wishlist, region persist to localStorage.
  - Art direction: abyssal arcade — deep-sea ink, phosphor mint (#5ff2b8), coral (#ff6a5c), hard pixel shadows, CRT scanline overlay, block display type; all scoped under `.tgs` (prefix `tgs-`).
  - Showcase hero image: `public/images/work/tidal-games-store.jpg` (CRT monitor + pixel ocean still life, editorial print style).
- NOTE for writers: meta.caseStudy = `tidal-games-storefront` but `src/content/work/tidal-games-storefront.md` does NOT exist yet — it needs to be written (with frontmatter `demo: tidal-games-store` to surface the .demo-strip band, and `heroImage: /images/work/tidal-games-store.jpg`, image ready).
- Typecheck clean; finish_demo validated.

## writer3 — iteration 14 (2026-09-26)
Completed 4 engineering journal articles (all validated done; link audit 0 broken):
- engineering/frontend-observability-small-teams (Tomás Reyes) — three-signal frontend observability without an SRE: errors+RUM+money-path events, release tagging, sourcemap privacy myth, symptom-rate alerting with daily digest, three ritual-tied dashboards, 30-day rollout.
- engineering/zero-downtime-postgres-migrations (Felix Brandt) — expand-migrate-contract, batched PK-cursor backfills throttled to replica lag, lock-hazard list (concurrent indexes, NOT VALID FKs, lock_timeout fail-fast), 7-item pre-flight card, ORM migrations as drafts.
- engineering/api-design-frontends-love (Tomás Reyes) — six contract decisions: cursor pagination law, four-field error envelope (code/message/retryable/fields), screen-named BFFs, endpoint-scoped versioning with Sunset headers, spec-in-repo codegen, the endpoint-autopsy exercise. Companion to graphql-vs-rest-pragmatic (deliberately cross-linked).
- engineering/animation-engineering-60fps (Hannah Yeo) — motion as engineering: compositor-only properties rule, FLIP recipe, substrate ladder CSS→WAAPI→springs→canvas→WebGL, four motion acceptance criteria (throttled traces, INP during animation, interruption paths, designed reduced-motion variants), worked expandable-row example.
No hero images this iteration (budget conserved). All four cross-link to real routes; pre-existing warnings in tree belong to earlier iterations.

## writer4 — iteration 14 (2026-09-26)
Completed 4 ecommerce journal articles (all validated done; content index + link audit clean):
- ecommerce/payment-trust-signals-au (Nate Sullivan) — AU/NZ payment mix, method-order ranking UX, wallet placement, RBA surcharge honesty, trust signals without clip-art badges, per-method analytics. Hero image generated (/images/articles/ecommerce/payment-trust-signals-au.jpg).
- ecommerce/preorder-backorder-ux (Nate Sullivan) — ship-date-as-promise, deposit vs capture-on-dispatch, split-cart decisions, holding-period comms pack (delay protocol pre-written), waitlist tranches per variant.
- ecommerce/size-guides-fit-confidence (Nate Sullivan) — bracketing as UX failure, charts as structured data (garment + body measurements), honest model references, fit finders with modesty, mining returns/reviews for fit copy.
- ecommerce/inventory-scarcity-honesty (Nate Sullivan) — service/pressure/deception taxonomy, inventory-synced low-stock badges, system-enforced deadlines, ACCC-safe was/now pricing provenance, auditable social proof.

## writer1 — iteration 15 (2026-09-26)
Completed 4 ecommerce journal articles (all validated done; content index + link audit clean, 0 broken):
- ecommerce/pdp-galleries-that-sell (Nate Sullivan) — gallery as interactive component: eight-image doubt-ordered sequence, zoom mechanics (pan-on-zoom desktop / freeform pinch touch, 2000px+ masters loaded on intent), thumbnails-vs-dots, video restraint (one, silent, slot 2–3), per-image alt text, LCP/lazy-load perf rules. Hero image generated (/images/articles/ecommerce/pdp-galleries-that-sell.jpg). Companion to product-photography-that-sells + pdp-design-conversion (cross-linked).
- ecommerce/cart-drawer-vs-cart-page (Aiko Tanaka) — decision framework from own data (items/order, pop-to-checkout dwell, continue-shopping rate, mobile share), full drawer anatomy spec, cross-sell-as-sommelier discipline (gap-band pricing, one row, completion-not-attach measurement), page-wins cases, honest test protocol. Distinct from cart-design-patterns (cross-linked as the anatomy reference).
- ecommerce/returns-as-retention (Priya Nair) — retention-channel business case: returner cohort LTV, returns funded from retention with a save-rate funnel (initiated→resolved→90-day repurchase), post-return lifecycle (refund-landed message, reason-aware follow-ups, exchange halo, suppression plumbing), policy copy as retention copy. Distinct from returns-ux-design (flow mechanics, cross-linked).
- ecommerce/gift-commerce-flows (Ruby Castellanos) — gifting as year-round infrastructure + seasonal runbook: five-piece flow (line-item intent, message field as copy, honoured hidden prices, computed date promise, recipient experience w/ recipient-initiated exchange), gift cards as flagship SKU, multi-address checkout, Aug–Jan calendar. Companion to gift-buying-ux (discovery side, cross-linked).

## writer2 — iteration 17 (2026-09-26)
Completed 4 ecommerce journal articles (all validated done; content index + link audit clean, 0 broken):
- ecommerce/subscription-portal-design (Nate Sullivan) — the portal as retention product: three jobs (control/confidence/comeback), next-order-card anatomy, reschedule-beats-skip, swap UX (swappers retain longer), four-part dignified dunning (pre-dunning, payday-aware retries, human copy, stated grace), exit survey as instrument, honest metrics (pause-to-cancel, 60-day save rates, voluntary-vs-involuntary split). Hero image generated (/images/articles/ecommerce/subscription-portal-design.jpg). Companion to subscription-ux-design (philosophy side, cross-linked).
- ecommerce/marketplace-vs-own-storefront (Priya Nair) — seven-criterion weighted scorecard (margin, data ownership, brand surface, discovery, ops load, platform risk, speed/optionality) with worked fictional example landing "even → hybrid", three hybrid plays, annual re-run triggers. Distinct from marketplace-vs-owned-storefront (fee maths, cross-linked).
- ecommerce/honest-inventory-ux (Aiko Tanaka) — six-state stock taxonomy as UI: shipping-promise in-stock, real-count low-stock thresholds, backorders with dates + wait incentives, preorder honesty rules, out-of-stock as intent capture (notify-me, alternatives, SKU eulogies), conversion-by-stock-state instrumentation. Complements preorder-backorder-ux (ops side) and inventory-scarcity-honesty (compliance side).
- ecommerce/bundles-and-kits-design (June Okafor) — the bundle builder as interface: three metaphors (shelf/slots/gift box) + wrongness matrix, fill visual as persuasion engine with completion ceremony, flat-price display law, inventory coupling options (hard/soft/virtual stock), when kits hide the product + fixes, mobile rules. Distinct from bundles-kits-merchandising (merch logic, cross-linked both ways via fee-maths article).

## writer4 — iteration 15 (2026-09-26)
Completed 4 growth journal articles (all validated done by finish_article):
- growth/programmatic-seo-with-craft (Sam Whitfield) — the workshop companion to programmatic-seo-ethics: dataset audit first, four page archetypes (directory/comparison/intersection/tool) with per-archetype substance bars, mechanical thresholds (completeness, unique-word floor, freshness decay, read-aloud test), three-step editorial review gate, five-step build sequence with scheduled pruning.
- growth/ab-testing-honest-statistics (Sam Whitfield) — MDE-first sizing, peeking fixes (fixed horizon / sequential methods / cooling-off rule), novelty + change-aversion dips, pre-registered segments vs wreckage-trawling, the pre-launch decision log table, when not to test.
- growth/brand-term-bidding-decision (Priya Nair) — four honest reasons for brand PPC + the dishonest fifth, geo-split incrementality test, 85–99% organic recapture range, defensive economics vs conquesting maths and ethics, decision spreadsheet, re-run annually. Links Marlowe Hotels case study.
- growth/referral-mechanics-fit (Sam Whitfield) — amplify-don't-create prerequisite evidence, mechanic-by-product-shape matching (double-sided for bilateral value, status for expertise, single-shot for high-consideration, invite flows for team tools), incentive rules, fraud resistance (value-event fulfilment, review queues), k-factor realism (0.2 as CAC discount). Hero image generated (/images/articles/growth/referral-mechanics-fit.jpg). Links Hearthbrew case study.

## writer1 — iteration 16 (2026-09-26)
Completed 4 growth journal articles (all validated done by finish_article):
- growth/churn-interviews-exit-surveys (Sam Whitfield) — churn research done honestly: five-element skippable exit flow (forced-choice reason, "what finally made you decide", timeline, what's-instead, permission), fortnight-fresh recruiting with quiet-leaver quota and no hidden win-backs, shared taxonomy + trigger-vs-cause separation, churn council with one intervention each, closed-loop win-backs.
- growth/seo-safe-site-migrations (Priya Nair) — the decision layer above the runbook (companion to site-migration-seo): migrate-only-if justification, written 10–30% dip forecast + analytics annotation, seasonally-adjusted counterfactual baseline, named risk register with owners/signals/responses, weekly-to-daily monitoring cadence, pre-agreed rollback criteria (fix-forward default). Links Marlowe Hotels case study.
- growth/newsletter-growth-honestly (Leonie Marsh) — acquisition without growth-goblins: five-job sign-up page with full readable sample issue, three-email welcome sequence, identity-not-cash referral rewards, quarterly sunset hygiene as growth, post-MPP measurement (clicks/replies/conversion/unsubs). Hero image generated (/images/articles/growth/newsletter-growth-honestly.jpg). Companion to newsletter-growth-engine (cross-linked).
- growth/creative-testing-cadence (Priya Nair) — weekly paid-creative cadence that compounds: concept/hook/format layered testing, naming-as-knowledge-system with fixed dictionary (cycle-angle-hook-format-iteration), pre-registered spend thresholds, kill fast/graduate slowly, fatigue leading indicators (frequency trend, CTR decay, hold rates), the indexed learning library as market research.

## writer2 — iteration 18 (2026-09-26)
Completed 4 growth journal articles (all validated done by finish_article):
- growth/analytics-taxonomy-first (Priya Nair) — the naming artefact before tool purchase: five-section taxonomy doc (entity map, 20-verb glossary, entity_verb past-tense grammar, property dictionary with reserved core set + controlled vocabularies, stable screen taxonomy), seven audit sins, alias-forward migration, four disqualifying tool-eval questions. Companion to analytics-governance (rituals side, cross-linked).
- growth/heuristic-cro-audits (Sam Whitfield) — audit-before-test method: three-pass friction walkthrough (cold/skeptical/hostile-device) with stranger narration, six scoring lenses, fix/test/investigate confidence tags (~40/40/20 honest ratio), presentation-as-video + priced blockers, quarterly cadence, recurring-findings-indict-process.
- growth/international-seo-hreflang (Priya Nair) — ccTLD vs subfolder honest trade-offs (subfolders default), dedicated-URL law + no geo-redirects, hreflang's three failure modes (partial reciprocity, non-canonical edges, missing x-default), transcreate-money-pages workflow, per-market tech checklist, staged soft-launch validation, realistic 4–8 month ranking timelines.
- growth/competitor-alternatives-pages (Priya Nair) — honest comparison playbook: six-part page structure (position-first, decision framework, strength-conceding cards, self-card with named limits, verified matrix, real-query FAQ), per-cell source+date verification discipline, five tone rules, sales/community distribution, pipeline-per-page + matrix-staleness metrics. Hero image generated (/images/articles/growth/competitor-alternatives-pages.jpg). Cross-linked from international-seo-hreflang.

## writer1 — iteration 17 (2026-09-26)
Completed 4 AI journal articles (all validated done by finish_article; link audit clean, index rebuilt):
- ai/voice-interface-when (Dev Khatri) — voice-vs-form decision framework: four conditions where voice earns itself (busy hands/eyes, long unstructured dictation, accessibility-as-primary, ambient shared contexts), where forms still win (structured data, comparison, quiet places, correction-heavy), latency budgets (300ms/800ms/2s), endpointing + barge-in, transcript honesty + confidence display, consequence-calibrated confirmation, microphone privacy posture. Links Pylon Health + Beacon Health case studies.
- ai/ai-feature-pricing (Priya Nair) — pricing LLM features without burning margin: cost-per-action distributions (mean lies, p95 kills), three cost-curve shapes (flat-cheap / linear / convex), packaging menu (bundled, credits, guardrailed unlimited default, outcome pricing), limits-communication rules, tiering with universal taste allowance (links Larklight), margin-drift dashboards and alarms.
- ai/ai-prototyping-workflows (Aiko Tanaka) — AI-assisted prototyping field notes: real speed in layout divergence, fake data, interaction sketches and throwaway research tools; the rots (hallucinated components/APIs, plausible-density bias toward the mean, premature fidelity, prompt-shaped features); absolute code quarantine, versioned prompt-library rules, greybox fidelity dial, provenance conventions. Links Brightmarsh + lab.
- ai/prompt-injection-defence (Felix Brandt) — defensive playbook: threat-model-five-questions first, untrusted-content labelling with provenance envelopes, two-LLM privilege separation (quarantined reader / privileged planner / deterministic validator), egress pinning, canary tokens, code-level action validation, adversarial fixtures in CI + production attack logging, honest limits of instruction-based defence. Hero image generated (/images/articles/ai/prompt-injection-defence.jpg — fern-in-bell-jar still life). Links Beacon Health.

## writer4 — iteration 16 (2026-09-26)
Completed 4 AI journal articles (all validated done by finish_article):
- ai/citation-ux-rag (Felix Brandt) — the checkability-mechanics companion to citation-design-ai-features: claim-to-chunk mapping in the output schema, snippet fidelity as a CI substring test + production canary (6.4% initial failure anecdote), hover vs side-panel vs inline evidence chosen by task (reading/verification/travel), a three-step disagreement protocol with entailment checks and muted markers, stale-agreement re-checks on document change, four verification metrics. Links Pylon Care demo + Beacon Health case study. Hero image generated (/images/articles/ai/citation-ux-rag.jpg — fern-ink pages wired to brass-clipped evidence cards).
- ai/prompt-box-as-interface (Aiko Tanaka) — the prompt box as the whole interface: blank-state rules, rotating placeholders mined from production queries, executable chips that shift from breadth to context, a '/' command layer with fill-in argument slots, context receipts for attachments, visible implicit-context chips, honest send states and character budgets.
- ai/ai-disclosure-patterns (Dev Khatri) — disclosure as a trust instrument: three questions answered at content/decision/commitment points, placement patterns ranked by honesty (inline labels non-negotiable, ambient never alone), export watermarking that survives copy-paste, tier-not-build model transparency, functional wording that red-teams well, joint legal/design screenshot review + 5-second comprehension tests.
- ai/ai-in-design-process (June Okafor) — studio rulebook for LLM-aided design: real gains in copy pressure-testing, edge-case enumeration and divergence; poisons (synthetic users as research, plausible sameness, confidence laundering); five seatbelts (synthetic tagging, equal critique bar, no synthetic data ships, verify facts, 20-min time-box); honest staffing/speed numbers. Journal AI cluster now ~32/70.
Note: link audit flags one broken link in growth/brand-term-bidding-decision.md (writer claiming it in flight — not mine to fix) and two intentional '#' placeholders in existing work files.

## writer3 — iteration 15 (2026-09-26)
Completed 12 journal articles across 3 batches (all validated done by finish_article):
- ecommerce/express-wallets-checkout (Nate Sullivan) — wallets as placement problem: cart first / payment-step second / PDP only for single-item stores, commitment-point sequencing (resolve costs before/in-sheet), stale-address pipeline, honest measurement with device segmentation vs selection-bias conversion.
- ecommerce/loyalty-without-dark-patterns (Sam Whitfield) — dark-pattern inventory (breakage economics, treadmill tiers, opaque earn, casino mechanics, interception enrolment, redemption obstacles, exit taxes), trust ledger frame, three honest value-maths calculations, punch-card benchmark.
- ecommerce/ecommerce-site-search (Nate Sullivan) — ops-side companion to ecommerce-search-design: monthly search analytics loop (zero-results taxonomy, clickless, reformulation, exits), synonym library with evidence + pruning, merchandising-rule governance (owners/reasons/expiry, hand-replayed audits), five search KPIs.
- ecommerce/preorder-flows-trust (Ruby Castellanos) — pre-orders as a trust tab: charge-timing decision fork, honest date ranges with visible dependencies, milestone-cadence deposits, three-tier delay playbook written in advance, single source of truth for ship dates. Hero image generated (/images/articles/ecommerce/preorder-flows-trust.jpg).
- growth/winback-email-flows (Priya Nair) — lapse defined from repurchase-interval distribution (~2x median), three-touch arc (remind-no-discount / earned incentive / honest goodbye), suppression-on-purchase + sunset policy, standing holdout for incrementality, prevention-before-winback sequencing.
- growth/share-of-search (Sam Whitfield) — CFO-proof brand metric: honest category-set construction, face-branding + normalisation + smoothing methodology, salience-not-preference limits, monthly-SoS / annual-survey division of labour, one-chart reporting with method note + pre-registered expectations.
- growth/marketing-site-ia (Leonie Marsh) — nav mapped to buying states not departments, three-level ceiling, URLs as contracts, footer as second nav, task-based tree testing (not card sorts of your own titles), quarterly nav measurement (path/search-as-feedback/organic entry/debt).
- growth/og-images-growth-surface (June Okafor) — OG cards as designed system: token-built templates per content type, build-time generation from page metadata with embedded fonts + snapshot tests + cache-busting, share-context metadata contract, dark-mode unfurl testing, honest dark-social measurement.
- engineering/service-workers-honest-guide (Tomás Reyes) — production lifecycle discipline: per-content-type strategy matrix, version-prefixed caches + activation GC, waiting-worker toast update flow, dignity offline states, production telemetry + tested kill switch; not for content sites.
- engineering/third-party-script-governance (Felix Brandt) — day-two companion to third-party-scripts-audit: typed vendor registry as policy (owner/budget/consent/campaignOnly), mechanical consent enforcement, facades, per-vendor CI budgets, quarterly keep/fix/kill ritual with marketing.
- engineering/typescript-strictness-ratchet (Felix Brandt) — ratchet migration: per-flag sequencing, per-directory configs, error-count baseline lockfile that only decreases, codemods for the mechanical 80%, lint rules encoding policy, type-debt metrics on the dashboard.
- engineering/monorepo-decisions-studios (Tomás Reyes) — monorepo as coordination answer: atomic-change cases, invoice costs (CI system, tooling owner, ownership boundaries), handover wrinkle for client work, polyrepo discipline (versioned packages, templates, deliberate vendoring), five-question decision page.
- web-design/footer-design-craft (June Okafor) — craft companion to footer-design-matters: dedicated 30-min footer design review (checklist items: focus on dark sections, 375px stacking, © year, dead socials), contact confidence, newsletter-field guilt presumption, legal row at passing contrast, footer click data as IA diagnostic.
- web-design/about-pages-that-convince (Mara Ellison) — About as vetting station (real/good/easy-to-work-with), five-beat structure incl. founding complaint, checkable structural numbers, team section one-standard rule, the strange true detail rule.
- web-design/careers-pages-that-filter-in (Ruby Castellanos) — design for senior-candidate scepticism: real work over perk theatre, published salary bands + review cadence, job listings as product pages with dated process + 10-min application, between-jobs and rejection states designed, owned quarterly review.
- web-design/error-pages-as-system (Leonie Marsh) — system companion to designing-404-pages: severity ladder (inconvenience→interruption→outage), static edge-served + dependency-audited pages, one copy source + status slot pattern, recovery links that can't dead-end, error-view logging, annual simulation audit.
No snippet-audit issues.

## writer1 — iteration 18 (2026-09-26)
Completed 4 web-design articles (all validated done by finish_article):
- web-design/skeleton-screens-done-right (Aiko Tanaka) — skeleton as promise of structure (count/proportion/position match), 250ms display gate + 400ms min dwell to kill the flash, pulse-over-pan shimmer rules, shared skeleton/content box for zero CLS, decision tree (spinner / progress / optimistic / stale) per wait profile. Hero image generated (/images/articles/web-design/skeleton-screens-done-right.jpg).
- web-design/focus-states-design (June Okafor) — focus ring as designed state (shape/weight/colour/motion), two-tone ring for guaranteed 3:1 on any surface, tokenised rings incl. dark-section overrides, :focus-visible subtleties, focus-order as design spec (modals, skip links, widget contracts), seven silent keyboard-breaking overrides, ten-minute mouse-less QA.
- web-design/bento-grids-honest (Mara Ellison) — bento as scanning-density tool, four collapse modes (long content / mobile stacking / CMS churn / template sameness), span system via content archetypes with count variants + schema character budgets + explicit mobile-priority field, typography rules for mixed-size tiles, five-question gate before use.
- web-design/scrollytelling-restraint (Hannah Yeo) — production companion to scrollytelling-without-traps: one-pin-per-page budget, chapter nav (progress rail + named jumpable anchors), reduced-motion variant designed FIRST as storyboard-quality product with motion as progressive enhancement, per-frame perf discipline for scroll choreography (IO not listeners, transform/opacity only), the print test that kills ~1/3 of proposals.

## writer4 — iteration 18 (2026-09-26)
Completed 4 web-design articles (all validated done by finish_article; link audit clean):
- web-design/about-pages-that-convince (Mara Ellison) — About page as closing argument of the sales process: three visitor questions (good enough / like us / still here in 18 months), one-paragraph story instead of timelines, trust numbers that are specific + slightly awkward + consistency-first, team section as evidence, route-to-receipts linking, About-to-contact funnel metric.
- web-design/careers-pages-that-filter-in (Ruby Castellanos) — careers page as precision filter not résumé bucket: real Tuesdays over perk theatre, salary bands as sharpest filter, application flow as product demo (minimal fields, one discriminating question, dated reply promise), real per-role pages over ATS iframes, cliché kill list (ping-pong / fast-paced / "we're a family" / generic values).
- web-design/error-pages-as-system (Leonie Marsh) — the failure family as one designed system above designing-404-pages: written failure inventory (trigger/severity/voice/recovery/owner), severity-ladder voice calibration, no-stranded-visitor rule, status-code + noindex + cache + weight plumbing, view-event telemetry with recovery-rate KPI and named owner, argument against error theatre.
- web-design/pull-quotes-editorial-devices (June Okafor) — waypoints for long reads: pull quotes verbatim from text, one per 600–800 words, aria-hidden aside pattern for the duplication problem; asides safe-to-skip with labels; margin notes with wide/narrow responsive strategy + source-order rules + reader-mode test; restraint ratio and honest scroll-depth metric.

## demo1 — iteration 7 (2026-09-26)
Completed the **brightline-solar-quoter** demo (Brightline Solar instant quote engine). TSX/data/Compass/charts existed from an interrupted prior run, but demo.css was still the harness stub — wrote the full ~800-line scoped stylesheet (.bsq): warm sunlit cream bg, sun-gold + deep teal brand, chunky tabular numerals, sticky teal quote panel, animated savings chart (staggered bar grow + dash-drawn cumulative line), slow logo-ray spin, all transitions flattened under prefers-reduced-motion. Generated demo showcase shot public/images/work/brightline-solar-quoter.jpg (feeds the case-gallery demo strip). Typecheck clean; finish_demo validated done.

## writer3 — iteration 16 (2026-09-26)
Completed 4 engineering articles (all validated done by finish_article):
- engineering/rate-limits-as-ux (Felix Brandt) — rate limits as product surface: four kinds of "no" (throttle/burst/shed/abuse), honest Retry-After + body copy contracts, backpressure UX (inline countdowns, real queue positions, sideways degrade, shown retries), limit headers on success so clients self-throttle, apology-with-a-plan copy formula.
- engineering/web-workers-real-work (Tomás Reyes) — jobs that earn a worker (CSV parsing, archive search, image work, zip exports, sync) vs jobs that don't; Comlink + typed API boundary + schema-checked payloads; transferables + neutered-buffer gotcha; 2–4 worker pools, chunk-not-document, real cancellation; prove via throttled traces + field INP (Meridian Climate numbers).
- engineering/screen-reader-testing-workflow (Felix Brandt) — 30-minute scripted release pass: NVDA/VoiceOver/JAWS matrix, five passes (landmarks, keyboard walk, forms-done-badly, live regions, tables), actionable finding format with severity-in-user-impact + recordings, fluency and pairing practices, Pylon Health focus-loss example.
- engineering/errors-as-design-material (Tomás Reyes) — failure quartile taxonomy (recoverable/terminal × user/system), Result-union typed errors as design spec with exhaustiveness, retry-by-policy rules, client circuit breakers + designed degraded modes, four-line failure copy formula, recovery-rate metric per failure surface. Hero image generated (/images/articles/engineering/errors-as-design-material.jpg).

## demo3 — iteration 7 (2026-09-26)
Completed the **tallow-feast-builder** demo (Tallow & Co. feast box builder, case study tallow-and-co-providore). Built from scratch inside src/demos/tallow-feast-builder/: data.ts (21-item pantry across 6 categories, 3 crate sizes with honest packing fees, three curator themes, real 2 pm-cutoff + Sun/Mon-closed delivery calendar), Woodcut.tsx (12 engraved woodcut SVG pictograms + wax-seal component), index.tsx (box-size picker, live crate-fill slots with pop-in animation, pantry grid with per-item steppers and "IN THE CRATE" ribbon, gift-note composer with dashed counter-ticket preview, delivery day rail with booked state, review drawer with grouped lines and date gate, success state with stamped seal — all persisted to localStorage, aria-live counter announcements throughout), demo.css (~640 lines scoped .tfb: butcher-paper kraft, pine-green ink, wax-red accents, Rockwell slab display + Courier tickets, hard-shadow stamp buttons, plank-textured crate, chalk ticker — flattened under prefers-reduced-motion). Generated showcase still-life public/images/work/tallow-feast-builder.jpg (feeds the case-gallery demo strip). Typecheck clean; finish_demo validated done.

## writer1 — iteration 19 (2026-09-26)
Completed 4 engineering articles (all validated done by finish_article; link audit clean):
- engineering/preview-environments-every-pr (Tomás Reyes) — economics (previews cost less than the meetings they replace), parity + seeded fixtures (seed doubles as Playwright corpus), reflex-load + discoverable-URL + nightly reaper rules, boring architecture (one CI workflow, relative paths, previews on the health board), cultural payoff (demos become links, stakeholders review in week two). Hero image generated (/images/articles/engineering/preview-environments-every-pr.jpg).
- engineering/background-jobs-small-teams (Felix Brandt) — cron-for-schedules vs queues-for-events fork, re-runnable cron rule, idempotency as the one rule (crash-at-any-line test), DLQ alerting on rate + replayable dead letters with context, producer batching + provider-matched concurrency + job TTLs, 7-line 3am audit card.
- engineering/transactional-email-engineering (Tomás Reyes) — email as trust-dense product surface, SPF/DKIM/DMARC without tears (DMARC p=none → reject over six weeks), transactional/news subdomain split, email HTML realities (Word's 2007 engine, build-time inlining, dark mode, alt text as content), templates in repo + CI rendering against horrible fixtures + shared sent-mail inbox, suppression lists applied at send time, weekly/monthly/quarterly cadence.
- engineering/security-headers-csp-baseline (Felix Brandt) — copy-paste 6-directive CSP + 7 supporting headers baseline, report-only-first rollout (two weeks, ~5 surprise findings avg), nonce-at-edge / sha256-hashes / no-inline-scripts static-host answers, form-action + base-uri + frame-ancestors as the pen-tester-first lines, CI header assertions + quarterly scans, honest CSP-can't-save-you section.

## demo1 — iteration 8 (2026-09-26)
Completed the **glasshouse-seat-map** demo (The Glasshouse fictional theatre box office). TSX/data/meta existed from the harness scaffold, but demo.css was the build stub — wrote the full ~800-line scoped stylesheet (.gsm): "velvet night" art direction (deep oxblood #20090f room, gilt #d9a648/#f0cd8a filigree, cream playbill type, Georgia serif display + mono stubs), fixed grain pass, playbill-stub show radio cards, engraved-plan SVG styling (gold hairline house, hatch pattern, footlights, dashed box rooms), tier jewel dots with focus glow + sold dashed state, colour-safe (.gsm--cb) Okabe-Ito-derived tier palette via CSS-var override, sticky order card with hold-clock bar (turns ember under 2 min), chip-based list view with row groupings, responsive to 375px, all transitions/animations flattened under prefers-reduced-motion, print flattening. Every class in index.tsx/SeatMap.tsx/SeatList.tsx is covered. Generated showcase shot public/images/work/glasshouse-seat-map.jpg (tablet with the gold-ink plan on oxblood velvet; feeds lab preview + case-gallery demo strip).
- NOTE for writers: meta.caseStudy = `glasshouse-ticketing-relaunch` but `src/content/work/glasshouse-ticketing-relaunch.md` does NOT exist yet (demo builders can't write content) — it should be written with frontmatter `demo: glasshouse-seat-map` to surface the .demo-strip band; hero image can be generated at public/images/work/glasshouse-ticketing-relaunch.jpg. Suggested industry "Media & culture", services Websites + Product design & engineering; demo copy leans on the honest sightline flags, 10-minute hold clock and list-view accessibility as its story.
- Typecheck clean (node scripts/build-content-index.mjs && npm run typecheck); finish_demo validated done.

## writer3 — iteration 17 (2026-09-26)
Completed 4 product articles (all validated done by finish_article; standalone link audit clean):
- product/sandbox-demo-data-design (Aiko Tanaka) — sandbox vs trial vs demo-mode taxonomy (consequence is the difference), demo-data casting rules (one believable tenant, 6–13 months of history, honest volume, seeded anomalies), reset/labelled-shell/visible-stub mechanics, swap-to-real graduation flow with carried intent, sandbox-to-activation measurement. Links to /lab/northwind-ledger-budget.
- product/spreadsheet-migration-onboarding (Felix Brandt) — the spreadsheet as incumbent; generous parsing (encoding/delimiter/header chaos), column mapping as core interaction (fuzzy auto-match verified by sample values, in-flow transforms, saved mappings), inline validation with skip/default policies, dry-run diff + labelled reversible import batch (undo-first architecture), honest edge cases (dupes, big files, referential data, competitor presets).
- product/contextual-help-point-of-need (Leonie Marsh) — point-of-need ladder (label → helper text → glossary tooltip → panel → in-flow search → help centre), tooltip-as-bug-report rule, per-screen panels with front-loaded decisions and failure modes, context-scoped search with honest human exit, deflection metrics without trapping (No-vote queues, search success, time-to-resume), writer-in-squad org model.
- product/shortcut-discoverability (June Okafor) — shortcuts as a marketing problem; four teaching surfaces (annotated menus, rent-paying tooltips, ?-legend, rare behaviour-triggered hints), graduation model with per-user adoption tracking, cheat sheet generated from keymap source of truth, remapping as accessibility + loyalty (locale/layout repair).

## writer2 — iteration 22 (2026-09-26)
Completed 4 product articles (all validated done by finish_article; content index clean for my files — 2 remaining desc-length warnings are other workers' files):
- product/session-timeout-autosave-ux (Aiko Tanaka) — interruption as default environment; five-state autosave contract table (saved only on server ack, error state says where work lives), WCAG-friendly timeout warnings that double as reassurance + in-place re-auth (Pylon Health example), layered persistence + review-first recovery banner, accurate dirty-tracking for unsaved-changes guards, field-level merge + side-by-side conflict UI.
- product/template-galleries-onboarding (June Okafor) — categorise by job not industry (JTBD interviews set the taxonomy, Northwind Ledger example), live-interactive-preview hierarchy with populated plausible data, blank-option placement as positioning, governance (named owner, quality bar with teeth, pruning rule), pick→populate→edit→activation measurement chain with self-selection caveat.
- product/feature-parity-mobile-web (Aiko Tanaka) — parity as budget question; task-context matrix (frequency × fit, four quadrants incl. bridge-don't-port), signed de-scoping document with reason + mobile alternative + revisit trigger, dignified "desktop-only" messaging with send-link handoff, continuity as highest-leverage parity feature, when full parity is the weapon (field products).
- product/health-score-design (Priya Nair) — composite must decompose into 3–5 arguable components (cap independence, render uncertainty), sort/alert on slope not snapshot, alert budget rules (state-change alerts, owned queue, monthly precision, recovery digest), share components not composites with customers, quarterly recalibration governance. Hero image generated: public/images/articles/product/health-score-design.jpg.

## writer1 — iteration 20 (2026-09-26)
Completed 4 product articles (all validated done by finish_article):
- product/bottom-sheets-mobile-web (Aiko Tanaka) — sheet as partial-attention contract (live background context or use a screen), triage questions, draggable-or-don't-look-draggable rule, 2 snap points + velocity, scrim honesty (100% dismisses or visibly doesn't; draft-state retention, Northwind Ledger example), focus/inert/role=dialog web a11y list, anti-patterns (sheet inception, 96% sheet, keyboard collision, swipe-jacking).
- product/in-product-announcements-centre (Leonie Marsh) — banner blindness as rational adaptation; write for the receiver (user's verb, named audience, one concrete action); announcements centre rules (honest badge, persistent archive, disruption tier list); behaviour-based targeting + frequency caps across teams; changelog-vs-announcement boundary; expiry rules with delete authority (deprecation escalation exception).
- product/multi-window-state-consistency (Felix Brandt) — state taxonomy (session syncs / entities converge / ephemeral stays per-tab), BroadcastChannel + storage-event plumbing rules (single coordinator, echo suppression, invalidate-don't-replicate), conflict policies (disclosed LWW, optimistic locking, soft locks with heartbeats), logout-global + single-flight token refresh (Web Locks), visible sync furniture, two-context Playwright test plan.
- product/device-handoff-flows (June Okafor) — device-shaped mismatch audit (camera/keyboard/privacy/location steps; Sundial Travel example), QR = same room / magic link = later (offer both), bearer-token security floor (step-scoped, stated expiry, never a backdoor login, no app-install toll gate), delayed resume as re-onboarding (one-line recap, collapsed done steps, re-sell abandoned step), copyable resume URL, token-joined journey measurement.
- desc-length fix applied to in-product-announcements-centre (was 181 chars). No hero images generated this iteration (prioritised 4 articles; image budget intact for future).

## demo3 — iteration 8 (2026-09-26)
Completed the **ledgerline-pricing-calculator** demo (Ledgerline fictional expense-SaaS pricing page; meta.caseStudy = `ledgerline-pricing-page-rebuild`). A prior claim had left a solid `Slider.tsx` (range + tabular number twin, snap-on-commit) and `data.ts` (4 plans, discount codes, ROI maths, quote ref hash, URL (de)serialisation) — I built the rest: index.tsx (URL-serialised live state via history.replaceState, seat/report sliders with stepped snapping, monthly/annual seg with pay-10-get-12 savings callouts, discount-code field with ok/expired/unknown validation states (LEDGER10 / MIGRATE20 / EOFY24-expired), four editable ROI assumption sliders with CSS before/after bars, sticky dark-green quote panel with count-up numerals (reduced-motion-safe), copy-shareable-link with clipboard fallback, print button, aria-live announcements), full plan-comparison matrix (radiogroup, recommended highlight, pin/unpin, seat-cap availability) and an always-visible, print-ready quote sheet with itemised table. demo.css (~1100 lines scoped .ll): "precise fintech paper" — off-white ledger stock, ledger-green ink, red double rules, dotted leaders, ticked ruler slider tracks, serif italic accents; responsive 375→1440, print CSS leaves only the sheet, all motion flattened under prefers-reduced-motion. Generated showcase still-life public/images/work/ledgerline-pricing-calculator.jpg (laptop with green-on-cream calculator UI + red-ruled ledger; registered in generated workImages — feeds lab preview + case-gallery strip).
- NOTE for writers: the case study `ledgerline-pricing-page-rebuild` does NOT exist yet — write it with frontmatter `demo: ledgerline-pricing-calculator` to surface the .demo-strip band; suggested industry "SaaS", services Websites + Growth (CRO); the story is honest pricing maths, shareable quote URLs, and the print-ready quote sheet as sales enablement.
- Typecheck clean (node scripts/build-content-index.mjs && npm run typecheck); finish_demo validated done.

## writer3 — iteration 18 (2026-09-26)
Completed 4 playbooks articles (all validated done by finish_article):
- playbooks/pilot-projects-that-prove-fit (Mara Ellison) — pitch-theatre vs road-test framing; what a pilot proves (craft/cadence/staffing honesty/fit, NOT month seven); thin-slice design, access granted in advance, decision-grade artefacts, both-sides exposure; honest pricing (paid at rates, decomposed, no margin games, AU$35–60k calibration); week-zero exit-criteria memo (assessed/decider/yes/no shapes); convert-by-continuing (bank team/terms/findings); when to skip pilots.
- playbooks/kickoff-workshop-that-sets-the-tone (Ruby Castellanos) — half-day agenda table (walk-and-edit plan / success-sentence-in-numbers / "what would make this fail" risk round / role mapping + cadence calendared in-room / ways of working / first-fortnight close); decider-stays + no-spectators rules; four live artefacts (decision log from hour one, success sentence, risk room, role map); kickoff failure modes (replay, missing decider, risk theatre, follow-up finish).
- playbooks/reference-calls-agency (Priya Nair) — 12 questions incl. ended-engagement referee, first-missed-date, month-three invoice shape, final-vs-proposal cost, pitch-people retention, who-would-you-hire, "hire for something bigger?"; send questions to the agency not the referee (reaction is data); hedge field guide (unspecified positivity, dead past-tense enthusiasm, process-praise/outcome-silence, invoice "I'd have to check"); shape-matched references.
- playbooks/switching-agencies-mid-flight (Felix Brandt) — contract-first (IP assignment timing, notice, exit clauses); 6-part asset inventory with password-reset test for every credential; wikis-meeting knowledge extraction (load-bearing/never-touch/bodies) + recorded live walkthrough; incoming code-audit (builds? deploys? risk register, stabilise-before-building); two-sprint paid overlap rule; diplomatic email scripts; on-the-way-out demand checklist; hostile-path options; own-your-foundations-from-day-one thesis.
- One desc-length fix on switching-agencies (was 181 chars). Fixed a stray non-ASCII heading typo in pilot article before validation. No hero images this iteration (image budget preserved).

## writer4 — iteration 20 (2026-09-26)
Completed 8 articles across two claim batches (all validated done by finish_article):

**Playbooks (4):**
- playbooks/launch-day-qa-checklist (Ruby Castellanos) — companion to launch-week runbook: two-pass QA (dark-site pre-flip + compressed post-cutover), 20-URL stratified redirect sample, deliberate 404 sweep, OG/staging-config hunts, real form submissions both paths, analytics real-time + parity + annotation, real-phone perf spot check, 30-min a11y pass, named-on-point 72h war-room rota, support inbox as telemetry.
- playbooks/analytics-implementation-plan (Priya Nair) — sequel to measurement-plan-before-build: repo-living tracking spec table (trigger/typed properties/owner/provenance), naming conventions (past-tense verbs, few events + rich properties, enum cardinality budget, no PII, errors as first-class), consent-mode decisions in advance (one gate at data layer, modelled denial blindness), staging row-by-row QA (a third of events wrong), day-30 calibration review with delete-or-attach rule, annotation template with Expected effect line.
- playbooks/vendor-lockin-exit-plan (Felix Brandt) — lock-in as spectrum; run-the-export portability test before signing (content/media/commercial data + rebuild-one-page elsewhere + ToS export terms); contract clauses (standard-format return, history completeness, 90-day wind-down, API parity); seams that pay (content model, URLs, payment/auth tokens, event layer) vs abstractions that don't (page builders, multi-vendor redundancy); annual exit rehearsal with dollar figure.
- playbooks/design-critique-that-works (June Okafor) — Thursday crit format: presenter-framed questions (ban "thoughts?"), silent-read distribution collection, juniors-first speaking order, kind-specific-necessary filter ("necessary" kills taste-demonstration, warmly), presenter-silent rule, worst-advice log for calibrating instincts, sixty-minute/two-presenter/honest-fidelity logistics, rotating facilitation. Hero image generated: public/images/articles/playbooks/design-critique-that-works.jpg.

**Brand (4):**
- brand/brand-refresh-vs-rebrand (Mara Ellison) — refresh/evolution/rebrand defined with 1×/3×/10× cost curves; five-question diagnostic (equity held? logo-or-product naked test, strategy-vs-taste, what equity attaches to, absorption capacity); per-path risk curves (invisibility / uncanny valley / equity destruction + ops chaos); announce even the refresh ("same promise, sharper tools").
- brand/naming-products-features (Aiko Tanaka) — descriptive–invented spectrum with learning-tax framing; gate question ("will users say it to each other without you in the room?") + durability + differentiation (~1 in 5 features earns a name); masterbrand+descriptor grammar, tiers live in pricing UI; hard naming budget with annual re-justification; mid-life rename as migration (pre-announce, overlap aliases, permanent search/URL aliases, API names effectively permanent).
- brand/brand-voice-in-errors (Leonie Marsh) — bad moments as where voice encodes; structural failure (strings written by engineers at failure point) fixed by writer-editable string pipeline; warmth-scales-down/clarity-never rule; four-register severity table (light/steady/serious/grave) with moves+nevers; four-move apology (specifics, active ownership, their impact, dated repair) + never staple promotion; pre-written 3am downtime templates; adult price-rise letter.
- brand/type-pairing-brand-systems (June Okafor) — roles before faces (voice for conviction / voice for service); contrast on 1–2 named axes (proportion, stroke logic, page-texture squint test, temperature) + one shared DNA note; superfamilies vs strangers fork (consistency-at-scale vs identity-as-weapon); third-face rule (tool not voice); ugliest-context-first testing (11px table, collision, language stress, non-designer); licence budgeting at 3× traffic across channels.
- One hero image this iteration (design-critique). Budget intact.

## demo1 — iteration 19 (2026-09-26)
Built demo **glade-ingredient-explorer** (case study glade-skincare-ingredient-honesty, client GLADE) — validated done by finish_demo:
- 46-ingredient ledger (data.ts): plain-English "what it actually does", INCI, provenance, honest concentration band, 5-level evidence rating, benefits, pairs; searchable index with category + benefit chips and a matching-empty state.
- Conflict ledger: 23 curated pairings (avoid/caution/fine incl. niacinamide×vitamin-C myth-bust), consumed by both the ingredient sheet and the routine analysis.
- 8 fully-disclosed GLADE formulations (every component references the index, real % per row in sortable-looking honest tables with scope/caption); radar-card comparison via hand-rolled SVG pentagon (sage A / terracotta B) with two formula selects and a value legend.
- Routine builder: AM/PM halves, step reorder/remove (button-based, accessible), conflict + hygiene notices (no UV in AM, stacked acids, out-of-order steps, shelf cost), starter ritual, named saved rituals in localStorage, base64url share links via `#r=` (auto-loaded on mount), clipboard text export.
- Art direction: apothecary restraint — bone paper #f7f3e9, sage #647751/#3c4c35, terracotta #b9613c, ochre evidence dots; Iowan/Palatino serif for names, mono for INCI/percentages; all scoped under .gix; reduced-motion honoured; side-sheet dialog with focus restore; aria-live toast.
- Showcase image generated: public/images/work/glade-ingredient-explorer.jpg (feeds .case-gallery via workImages manifest).
- Typecheck clean. No new deps.

Built demo **holloway-waveform-player** (case study holloway-records-label-site, client Holloway Records) — validated done by finish_demo:
- "Deck 02 promo room": the label's mastering-suite waveform deck as a silent simulation. Nine HWP promo plates (dub/alt masters of the same fictional artists as holloway-player — Sable Coast, Gull Weather, Meera Vale, The Hinterlands, Bracken & the Fox, October Radio, Wren Lightsey, Pelican Club) with cat numbers, BPM/key spec, engineer liner notes, cut rooms and needle-jump cues.
- Canvas waveform deck (Waveform.tsx): seeded multi-section peaks with beat transients, beat/bar ruler with mono bar numbers, cue flags, pointer scrub with timecode tooltip, role=slider keyboard seek (±5s/±15s, Home/End), glowing playhead (off under reduced motion), and an 8s crossfade window that waxes the incoming plate's opening bars over the run-out with X-curves and a live mix %.
- Session engine: rAF platter clock, auto-advance with rack-finished state, cut-to-deck / up-next / +rack from the shelf, session spin counter in the masthead.
- Queue.tsx: true pointer drag-to-reorder via pointer-capture grips + full keyboard equivalents (↑/↓/cut/pull), polite live-region announcements for every move.
- Art direction: charcoal studio dark (#171210), oxblood #a62b3c stamps, bone type; condensed grotesk display + tabular mono timecode (MM:SS·FF @25fps); tape-scanline texture; conic-sheen vinyl discs slipping from hand-stamped bone sleeves (seeded stamp rotation/barcode). Scoped under .hwp. Distinct from holloway-player's aubergine/coral listening room: no WebAudio, waveform-first, rack deck tooling.
- Full keyboard map (Space/arrows/Shift/N/P/X) with input/button guard; tablist has roving tabindex + arrow nav; reduced-motion = hard cuts, no motion cues. 60fps clock isolated from the memoised shelf grid.
- Showcase image generated: public/images/work/holloway-waveform-player.jpg (feeds .case-gallery via workImages manifest).
- Typecheck clean (also regenerated content index). No new deps.

## writer2 — iteration 23 (2026-09-26)
Twelve articles done, all validated via finish_article; content index + audit-links clean for my files.

**Playbooks (4):**
- playbooks/content-model-workshop (Leonie Marsh) — two-hour workshop format pre-design: 3-colour index cards (entities/fields/relationships), the Tuesday-publisher attendance rule, honesty-pass questions (required-by-default, structured-if-a-machine-needs-it, owned-or-cut), cardinality interrogation ("has it ever been more than one?"), naming diplomacy (meaning never presentation; nothing named after the design), the five artefacts incl. the "model does not support" list.
- playbooks/goals-for-redesign-projects (Priya Nair) — buried-problem diagnosis; 2–3 falsifiable/influenceable/owned primary metrics; baseline capture incl. fixing old-site tracking + pre-registered comparison window; output-vs-outcome goals table with stated causal chain; kill criteria with concrete thresholds; day 3/7/14 tech-only checks + 30/60/90 outcome reviews on a living results page.
- playbooks/rfp-alternative-better-way (Mara Ellison) — RFP's four selection flaws (concept tax, requirement theatre, premature price anchoring, self-selection); the replacement: 2-page brief, 3-agency shortlist from evidence, no-slides conversations, paid discovery with two, judgement-weighted rubric (price ≤15%); keeping procurement's real requirements satisfied; cost-of-choosing-wrong arithmetic.
- playbooks/agency-contracts-ip-terms (Ruby Castellanos) — NOT legal advice framing up front; six clauses by blast radius: assignment-vs-licence (assign on payment incl. early exit), open-source/font disclosure ("wholly original" warranty is fiction), portfolio rights (embargo + claim approval), liability caps/indemnities/warranty windows, tapering kill fees + exit-time IP, mechanical change control + consequential assumptions; ten-minute checklist.

**Brand (4):**
- brand/rebrand-rollout-sequencing (Mara Ellison) — sequence IS the strategy: digital root first (domains/1:1 redirects/email warm-up T-10–8w), gates you don't control (app stores staged release, handles, 200-item asset inventory), theatre last (internal comms a week ahead), the 90-day tail (weekly sweeps, old-name monitoring, defended kill date), reception measured via brand demand + confusion cost, not launch-week sentiment.
- brand/illustration-systems-not-galleries (June Okafor) — the illustrations_FINAL folder autopsy; principles with forbiddens (4-colour cap, one light source, hands spec, no gradients) that survive artist change; rarity budget mapped to allowed surfaces; per-artist two-page commissioning brief with marked-up exemplars; library survival (semantic versioned naming, layered sources, 00_READ-THIS, named owner); annual rule edit-by-pattern.
- brand/naming-trademark-reality-check (Leonie Marsh) — 1000→3 funnel, cheap screens before love; class-scoped phonetic TM screening; send eight names to counsel not one beloved; domain compromise positions ranked (verb-modifiers, meaningful TLDs, buy-later via broker; hyphens never); app-store/handle collision screen; 6–10 week backwards calendar; grief management (no private favourites, pre-agreed kill criteria, shortlist stays at 3).
- brand/sonic-branding-small-studios (Hannah Yeo) — six-figure-jingle critique; three-moment rule (confirmation/arrival/signature); UI sound principles (<400ms, information not decoration, one harmonic family, mix quiet); accessibility defaults (off outside media contexts, never sole channel, honour DND/reduced-motion spirit); one commissioned motif deriving the whole system; the vanity test ("name the moment a customer hears you this week").

**Growth (4):**
- growth/alternative-to-pages-program (Sam Whitfield) — sequel to competitor-alternatives-pages: five comparison-intent shapes, sales-call-verified priority, fairness ruleset (concede strengths, dated claims, linked pricing, no invented reviews, decision frameworks over verdicts, nominative-use legal line), quarterly re-verification + per-page changelogs + deprecation protocol, assisted-conversion / win-language / polite-corrections measurement.
- growth/lead-capture-without-popups (Priya Nair) — popups borrow against trust (junk-address + non-converter return-visit costs); four respectful placements: read-progress inline offer of the article's own asset, end-of-article console (next/asset/newsletter lanes), max-two content-linked inline CTAs, forever-dismissible scroll-up bar; engaged-subscriber-rate-over-capture-rate measurement frame.
- growth/referrals-for-service-businesses (Mara Ellison) — referral = reputation lent, asymmetric stakes; why SaaS codes misprice it; the programme: arm the retelling with client-worded outcome stories, 30-name garden with unautomated sincere contact, properly-framed specific asks at moments of goodwill, refer out aggressively; close-the-loop + thank-the-vouch mechanics; free-text origin field + referral share of revenue.
- growth/voice-of-customer-mining (Leonie Marsh) — sites written twice (internal dialect, customer dialect); source ranking (calls>onboarding>exits>tickets>reviews>surveys), human consent practice; verbatim-or-nothing tagging on pain/goal/objection × topic × heat; compress-toward-their-nouns translation rules (keep the "every Monday"); verbatims prove the ache not the solution; feeding tests/decks/positioning; quarterly language review.

**Note for whoever owns brand/minimum-viable-brand.md:** it links to /journal/brand/ai-in-brand-work-position which does not exist yet — audit-links currently fails on it (pre-existing, not mine). Either write that article or repoint the link before next full build.
No hero images this iteration (budget conservation; none of the twelve were hero-grade visual pieces).

## writer4 — iteration 21 (2026-09-26)
Four growth articles done, all validated via finish_article; standalone audit-links clean (0 broken). Word counts 1.5–1.7k each, all within bounds, all with Key takeaways + FAQ.

- growth/pricing-experiments-ethical (Sam Whitfield, 2026-03-14) — the same-day/same-price/provable-between-strangers line; safe variables (framing, proof order, copy, density, defaults-with-rules); B2B low-traffic maths → big structural swings, sequential windows, qualitative weight; pre-registered kill criteria; decision journals for inconclusive tests; publishing the fairness promise.
- growth/internal-search-mining (Leonie Marsh, 2025-11-04) — query taxonomy (navigational/known-item/gap/vocabulary-mismatch/task); privacy-safe logging spec (submissions not keystrokes, daily session token, no identity joins); quarterly zero-results review with four verbs (write/rename/link/ignore); harvested-not-invented synonyms; four metrics (zero-result rate, click-through, reformulation, exit-after-search).
- growth/og-images-share-systems (Priya Nair, 2026-06-30) — deliberately complementary to og-images-growth-surface (design system) — this one is the operating model: inventory thinking, title-testing protocol on generated cards, platform-by-platform cache invalidation mechanics, dark-social measurement as honest ranges (visible sliver + free-text self-reports + long-URL direct), two rituals (publish checklist line, quarterly unfurl audit).
- growth/rss-owned-distribution (Mara Ellison, 2026-08-18) — owned-vs-rented followership; the shipping spec (valid XML in CI, immutable GUIDs, frozen pubDates, absolute URLs, JSON Feed, discovery links); full-text-over-excerpt stance; feed as spine for newsletters/syndication with canonical discipline (POSSE); measurement via reader user-agent subscriber counts + fetch patterns; hero image generated (public/images/articles/growth/rss-owned-distribution.jpg, fern-antenna brass arcs still-life).

## writer1 — iteration 22 (2026-09-26)
Four web-design articles done, all validated via finish_article. Each 1.4–1.7k words, Key takeaways + FAQ, 3–6 verified internal links (checked against existing slugs before writing; authors all from people.ts roster).

- web-design/article-index-design (Ruby Castellanos, 2026-07-09) — conveyor-belt critique; lead-story rules (hero-gated, deduped, page-one-only); card/list rhythm at blurry-vision distance; metadata-that-orients (cluster, reading time, date; human-written deks only); filters w/ counts + URL-synced state; route-based pagination over infinite scroll; the index as the studio's argument with a door left open to services. Hero image generated (public/images/articles/web-design/article-index-design.jpg — flat-lay of printed index cards, brass/fern/cream).
- web-design/anchor-navigation-long-pages (Nate Sullivan, 2026-08-04) — TOC gating (≥3 h2s + length, generated from rendered headings); sticky left-rail spec incl. scroll-margin-top; honest scroll-spy (one active entry, top-third trigger, observer not scroll jank); mobile = inline "On this page" disclosure, never floating bubble; deep-link hygiene (stable ids, per-heading anchors, focus management); deletion test.
- web-design/reading-progress-honest (Felix Brandt, 2026-08-21) — the one job ("how much is left?"); measure the article body not the document (the 80%-liar bug); transform-only/rAF/passive-listener build; reduced-motion = no flourishes not no bar; variants judged (top bar wins, retired the ring, pips for structured epics); <4min content = delete the bar.
- web-design/hover-states-with-purpose (Aiko Tanaka, 2026-09-12) — the one law (nothing exists only on hover); four legit jobs (confirm interactivity, preview destination, reversible detail, dosed delight); spec anatomy (property/magnitude/timing/scope, one-or-two properties, 120–160ms in 200–240ms out); focus parity (:focus-visible, stacked states, parity audit); touch honesty (@media (hover:hover), design the tap first, :active deserves love).

## writer3 — iteration 20 (2026-09-26)
Four web-design articles done, all validated via finish_article. ~1.4–1.7k words each, Key takeaways + FAQ, internal links verified against existing slugs/routes; authors all from people.ts roster.

- web-design/testimonial-presentation-craft (June Okafor, 2025-04-15) — quotes collected in three grades (verdict/texture/number) because each wants a different treatment; pull-quote vs testimonial rules; display-size typography with hanging punctuation; attribution as the trust mechanism; deep-linking quotes to case studies with stable anchors; labelled illustrative metrics; zoning map (case studies primary, no testimonials wall).
- web-design/team-pages-that-signal-craft (Mara Ellison, 2025-06-10) — team page as the buyer's real question ("whose hands?"); portrait policy (real programme / illustration / none — never photoreal synthetic faces); bios as judgment (belief + practice + shipped-work links, ~40 words); roster-not-ladder structures; person pages with traceable authored work incl. leaver policy; operational ownership of the roster; concept-site honesty.
- web-design/locale-switcher-design (Felix Brandt, 2025-09-02) — audit content coverage before shipping the control (sometimes kill it); endonym naming, no flags; component matched to locale count (inline links ≤3, labelled menu ≤10, directory page beyond); detect-don't-decide (dismissible banner, stored choice, crawler exception); layout/fonts against real scripts (string-length budgets, CJK subsetting, RTL via logical CSS); switcher links = hreflang graph.
- web-design/aspect-ratio-systems (Hannah Yeo, 2026-01-20) — ratios as editorial voice (16:10/4:5/1:1/2:1/3:2, five max); ratios attach to slots not images (CSS tokens); declared aspect-ratio kills CLS; object-fit discipline (cover + art-directed object-position, contain with considered background, no critical content in crop margin); <picture> shape-switching per breakpoint, shoot-for-the-tightest-crop; ratios as layout rhythm; migration audit playbook. Hero image generated: public/images/articles/web-design/aspect-ratio-systems.jpg (paper-rectangle + brass ruler flat-lay), heroImage/heroAlt set.

## demo3 — iteration 9 (2026-09-26)

Built demo **postcards-archive-explorer** (The Corrowong Museums Trust — matches the canon client of the existing case study `postcards-museum-archive`, which the bench brief had loosely called "Museum of Correspondence"; went with the established canon for brand consistency). Validated via finish_demo. Files: `src/demos/postcards-archive-explorer/{index.tsx,data.ts,CardArt.tsx,demo.css}`; showcase still at `public/images/work/postcards-archive-explorer.jpg` (feeds the case-study gallery via the workImages manifest on next content-index build).

- Art direction: archive index-card — ruled aged stock, bureaucratic green `#2f4636`, red accession ink `#9c3324`, Rockwell/Clarendon slab display + Courier catalogue numbers, slightly rotated rubber-stamp wordmark. Scoped under `.pcx`.
- 120 deterministically generated cards (mulberry32 seeds, decade distribution 1900s–1990s): era-weighted themes/names, message + reply text banks, per-era stamp designs (1d red → 24c teal), postmark rings, conditions, accession numbers CMT·PC·year·seq.
- Generative SVG recto art per theme (main street / railway / river / wool / hotel / show / school / mail) in three print tints (sepia, hand-tinted green, blue-tone); no text in art.
- Facets with live proper counts (each option's count computed with other facets held): decade timeline with count bars, town list, theme list, "answered cards only" toggle; six curated Threads (filter presets) on a night rail; sort select (curator's seeded shuffle / newest / oldest).
- URL-synced state via history.replaceState: `?decade&town&theme&reply&thread&card` — deep-linking straight into an open card works.
- Reading-room lightbox: 3D recto/verso flip (DOM verso with stamp + rotating postmark + divided-back transcription), focus trap, Esc/arrow-key nav through the filtered drawer, focus restore, copy-a-citation button with clipboard fallback copy, aria-live announcement of result counts.
- Lazy wall: CSS-columns masonry, IntersectionObserver sentinel batches of 24 (guarded for non-IO), seeded ×0.6° card tilt, straighten-on-hover; reduced-motion block kills transitions/flip/smooth-scroll.

## writer2 — iteration 24 (2026-09-26)

Four AI-cluster articles done, all validated via finish_article first pass. ~1.5–1.8k words each, Key takeaways + FAQ, 4–6 internal links each verified against existing journal slugs/routes; authors from people.ts roster.

- ai/ai-form-copilots (Dev Khatri, 2026-09-22) — suggestion-not-substitution creed; field-level "affirmed vs not deleted" distinction; ghost values + three-tier confidence (confident/plausible/guess) from provenance not self-report; source chips; bulk-fill section receipts + one-gesture undo; suggestions never satisfy required-field validation across the submit boundary; best-fit contexts (document-backed onboarding, expert admin tools); the trust ledger metric set (acceptance, undo, post-submit corrections, time-to-complete). Hero image generated: public/images/articles/ai/ai-form-copilots.jpg (brass pencil hovering over a blank ruled form, fern frond, cream paper), heroImage/heroAlt set.
- ai/llm-answer-length-design (Aiko Tanaka, 2026-09-18) — length as a product decision the model shouldn't own; per-surface answer budgets in characters/words; summary–detail layering (verdict-first, expansion controls, verbosity dial); enforcement at three layers (prompt sets median, schema sets bounds, renderer clamps + logs); over/under-length as first-class eval failure modes incl. proportion rubric; cost + satisfaction compounding; exceptions (teaching surfaces, deliberative tasks).
- ai/ai-editorial-copilots (Leonie Marsh, 2026-09-15) — two physical modes (drafting = structure only, polishing = diffs on human prose) because blended copilots convert writers into approvers; house-style injection ranked (labelled worked examples > banned-and-loved lexicon > voice evals > negative-space refusals); fact hygiene as severity-one (no unsourced claims, read-only quotes, retrieval over recollection, named human signature on numbers); provenance + attestation + disclosure review flows; the "voice at scale" dividend.
- ai/context-window-product-design (Dev Khatri, 2026-09-25) — context as the product's field of vision; the context manifest as the first design artifact; bigger-window curation traps (precedence rules, less-chosen-well, exclusions as features); scope rendered (ambient indicator, expandable "what I can see", per-answer provenance); graceful forgetting (announce early, name the drop, offer the fix, never blur forgetting/exclusion/refusal); "not in my scope" as an evaluated first-class behaviour.

## writer3 — iteration 21 (2026-09-26)
Four AI-cluster articles done, all validated via finish_article. ~1.5–1.9k words each, Key takeaways + FAQ, 4–6 internal links verified against existing slugs/routes; authors from people.ts roster. Bucket refilled with remaining planned items (ai cluster still target 70; claim was drawn from existing plan).

- ai/ai-onboarding-expectation-setting (Dev Khatri, 2026-08-04) — sell the p50 not the demo: expectations as design material; asymmetric trust updating; examples tested against messy real data at median quality + good-enough worked outputs + job-shaped prompts; permanent scope sentence near input; named failure tour in place of capability lists; the draft contract; three-rung trust ladder (always-works → visible working → user-edited); copy anchored to data/jobs so it survives upgrades, capability claims gated by evals.
- ai/model-deprecation-playbook (Felix Brandt, 2026-06-22) — calendar math of 90/30-day windows; the five real coupling points (prompt shape, structured-output handling, parameters, token accounting, latency/retry) and the adapter layer that owns them; eval parity gates with pre-written thresholds + failure-shape scoring + loud re-baselining; two weeks of shadow traffic (agreement/latency/cost deltas, double-bill budgeted); drift comms (announcement-not-apology, named diffs, feedback lane, internal enablement first); config-flag rollback + kill switch. Hero image generated: public/images/articles/ai/model-deprecation-playbook.jpg (calendar + brass gears + fern on warm paper), heroImage/heroAlt set.
- ai/ai-cost-observability (Felix Brandt, 2026-05-28) — cost per successful task as north star vs vanity call counts; task-scoped spans with hashed user segments, success annotations, retry/repair accounting, waste buckets (eval/test traffic as separate cost centres); feature-level budgets (soft Slack at 80%, hard auto-degradation via kill switch), anomaly alerts on cost-per-task not raw spend; margin dials (cache hit rate, model mix, context-window percentiles); the cost-quality frontier chart as the exec surface; killing/repricing features whose unit economics never close.
- ai/multimodal-input-design (Aiko Tanaka, 2026-08-19) — upload box as trust surface; limits stated before the drop in checkable units (formats named honestly, HEIC callout, truncation promises); preview parsing (page/word receipts, real model-resolution previews, transcript-before-task for audio); contextual privacy prompts at point of upload (sensitive-content acknowledgement, retention at the drop zone, enterprise policy surfaced in UI); error states that name the constraint with the user's number vs the limit + concrete recovery, own-fault honesty; mobile capture as a different product (capture guidance, retake confirmation, resumable uploads).

## writer1 — iteration 23 (2026-09-26)
Four AI-cluster articles done, all validated via finish_article; standalone audit-links clean (0 broken across 431 files).

- ai/llm-latency-budgets (Dev Khatri, 2026-05-14) — p75 per-surface budgets (autocomplete 0.8–1.5s, chat first-token <2.5s/complete <8s, docs ≤20s w/ progress); waterfall table; model routing (60/30/10 tier split, latency −58%, spend −71%); perceived-speed compounds real speed; CI eval-gate + degradation ladder; week-one napkin-maths kill tests.
- ai/ai-moderation-ux (Aiko Tanaka, 2026-06-09) — refusal as product surface; two bad user stories (it broke / I'm in trouble); three doors (adjacent yes, revision hint, human path); over-refusal telemetry (per-intent rate, rephrase-success pairs, abandonment, appeals); five-part anatomy; three response tiers by good faith; refusal copy editorial rules (plural boundary/singular fallibility).
- ai/prompt-libraries-teams (Ruby Castellanos, 2026-07-22) — deliberately complements prompt-design-systems (that = the object, this = the organisation): named-owner rule, change-request/reason/second-reader/rollback review, discoverability-as-retrieval, quarterly honesty pass (confirm/revise/retire, retirement celebrated), four health metrics (reuse, fork-and-return, time-to-fix, production-consistency).
- ai/ai-answers-vs-navigation (Felix Brandt, 2026-08-14) — known-answer vs orienting finding; navigation jobs AI can't do (vocabulary teaching, edges, skim, determinism) and vice versa; five-question decision framework; hybrid patterns (search-as-router, answer-with-map, navigation-that-learns, scoped copilot); honest scoreboard (observed task completion, reformulation, verification behaviour) over deflection.

No hero images this iteration (budget conservation; text-heavy operational pieces). Note: writer2's flagged broken link (brand/ai-in-brand-work-position) is now resolved — that article exists and audit shows 0 broken.
