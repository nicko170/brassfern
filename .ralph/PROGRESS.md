# Progress

## Done (iteration 2 — polish + hardening)

- **Author drift fixed**: all content authors re-mapped to the canonical roster
  in `src/data/people.ts`. `build-content-index.mjs` now parses the roster from
  people.ts, strips ", Job Title" suffixes, maps known phantom aliases
  (June Okonkwo→June Okafor, Priya Raghunathan→Priya Nair, etc.) with a warning,
  and hard-fails on truly unknown names. Display always uses canonical names.
- **Demo race guard**: `scripts/ensure-demo-css.mjs` (runs in predev/prebuild)
  stubs a missing `demo.css` in any demo folder that has `index.tsx` — demo
  builders write CSS last, so builds no longer break on in-flight demos.
  Their real CSS overwrites the stub on next save.
- **WorkCase hero**: case-study pages now render `heroImage` (-full-width figure)
  and pass it to OG/meta. WorkCard already used it.
- **Home**: featured-work reel now prioritises case studies that have hero art.
- **Lab**: newest demo gets a night "lab-feature" band (big copy, client, tags,
  CTA + case-study link); grid shows the rest. CSS in app.css (`.lab-feature*`).
- **Journal**: cluster hubs now have per-cluster intro copy (CLUSTER_INTROS)
  used for both the lead and the meta description; cluster nav shows counts
  (`.filter-btn__count`).
- **Article pages**: prev/next (newer/older) navigation + styles (`.article-nav`).
- **Services**: related-work matcher normalised (works for "AI products" → "AI"
  etc.).
- **Backlog**: +12 work case studies (Marlowe Hotels, Quill Legal, Saltbush,
  Beacon Health, Brightline, Fernway, Coriander, Arkwright, Ledgerline,
  Tidal, Prairie Mutual, Verdigris) and +12 web-design articles.
- **Demos live now**: hearthbrew-identity-lab, hearthbrew-store,
  northwind-ledger-budget, pylon-health-booking (284 prerendered routes).
- **Build green**: `npm run build` passes (36 articles + 17 case studies +
  more landing continuously from parallel writers).

## Next

- Writers: keep burning the backlog; authors MUST be roster names from
  people.ts (validator now enforces, title suffixes get stripped).
- If generate_image starts working (currently 401): case-study heroes for the
  14 works still missing them, journal heroes for flagship articles.
- Builder next iteration: work-index URL filter state + result counts,
  case-study "demo strip" band styling when demo exists, search UX polish
  (query params + empty state), OG image per article via heroImage already
  done — next step is per-page OG variants if image tool recovers, bundle-size
  check with rollup visualiser, 375px QA pass on Lab feature band + article nav.
- Skip backlog item `editorial-grids-on-the-web` — a writer already published
  `web-design/editorial-grids-web`; treat the backlog item as done/rename.

## Known issues / watchlist

- **generate_image returns 401** (bad API key) — all new imagery blocked.
  Hero art gaps remain on 14/17 case studies; CSS-only card art fills in.
- Backlog item "shipping-llm-features" title typo ("design systemToo") — fix
  on claim.
- `northwind-ledger-budget` may ship a stub demo.css if its builder hasn't
  saved the real one yet — stub is clearly marked; will be overwritten.
- Lab demo pages SSR only the overlay bar (React.lazy not awaited); fine.
- Journal pagination is client-side (page 1 prerendered only).
- Work index filters don't sync to URL yet.

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
