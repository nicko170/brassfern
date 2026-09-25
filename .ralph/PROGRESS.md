# Progress

## Done (iteration 1 — foundation)

- Full scaffold: React 18 + TS + Vite 5, React Router 6, hand-rolled CSS design
  system. `npm run build` passes (tsc → vite client → vite SSR → prerender).
- **Art direction** "botanic industrial editorial": paper #f5efdf, fern #1e4d33,
  brass #c9a84c; Fraunces / Instrument Sans / IBM Plex Mono; grain overlay;
  generative Barnsley-fern canvas hero (pointer parallax, reduced-motion static).
  Full spec in DESIGN.md.
- **Base path**: BASE_PATH/SITE_URL envs → vite base, Router basename, `withBase()`,
  `absoluteUrl()`, %BASE_URL% html replacement. Deploys to GitHub Pages sub-path.
- **Content pipeline**: md + frontmatter at `src/content/…`; `scripts/build-content-
  index.mjs` (predev/prebuild) validates + generates meta index; custom base-aware
  markdown renderer; bodies lazy-chunked per article, preloaded for SSR.
- **Prerender**: every route → static HTML with per-page head (title/desc/canonical/OG/
  JSON-LD), 404.html, sitemap.xml, robots.txt, rss.xml, .nojekyll. 133 routes now.
- **Pages**: Home (hero, wordmark marquee, work, services rows, POV, stats,
  testimonials, journal, CTA), Work index+filters+case-study template, Lab index +
  lab demo route w/ overlay bar (About, case-study link), Services index+6 pages,
  Industries index+9, Approach, Pricing, Studio (story/values/timeline/colophon),
  Team (12 geometric SVG portraits), Careers+5 job pages, Journal index/cluster/
  article/tag pages (client pagination), Search, Resources, Contact (validated brief
  form + success state), Press, Legal, 404.
- **Demo registry**: auto-discovery via import.meta.glob; first demo done: Hearthbrew
  Identity Lab (generative brand playground) + its case study.
- **Backlog**: 134 article ideas across all clusters + 12 demo briefs planned.
- OG default image at `public/images/og.jpg`.

## Next

- Writers: articles per backlog; keep authors from `src/data/people.ts`.
- Demo builders: pick planned demos (hearthbrew-store, northwind-ledger-budget, …).
- Builder next iteration: case-study hero images (generate_image per flagship work),
  journal hero images for best pieces, home polish (work reel once 3+ cases exist),
  related-content modules, a11y QA pass, bundle/perf pass (fonts subsetting),
  more sections as content grows (e.g. featured demo on /lab).

## Known issues / watchlist

- Backlog item "shipping-llm-features" title typo: "Prompt libraries are a design
  systemToo" — fix to "…a design system too" when a writer claims it.
- Lab demo pages SSR only the overlay bar (React.lazy not awaited in renderToString);
  fine (noindex), but revisit if SEO for demos is wanted.
- Journal pagination is client-side (page 1 prerendered only) — revisit if needed.
- Work index filter uses chip buttons, no URL state — fine for now.
