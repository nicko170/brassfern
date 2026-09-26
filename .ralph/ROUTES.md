# Routes & architecture

## Route table (all statically prerendered)

| Route | Page | Data source |
| --- | --- | --- |
| `/` | Home (generative fern hero) | clients, services, testimonials, latest content |
| `/work` | Case-study index (service + industry filters, URL-synced `?service=&industry=` with per-option counts) | `src/content/work/*.md` |
| `/work/:slug` | Case study + `.demo-strip` band when a demo exists | same; `demo` field links to lab |
| `/lab` | Demo index | `src/demos/*/meta.ts` (auto-discovered) |
| `/lab/:slug` | Demo full-screen + overlay bar (noindex) | `src/demos/<slug>/index.tsx` (lazy chunk) |
| `/services`, `/services/:slug` (6) | Service pages w/ process, deliverables, FAQ+JSON-LD | `src/data/services.ts` |
| `/industries`, `/industries/:slug` (9) | Industry pages | `src/data/industries.ts` |
| `/approach`, `/pricing`, `/studio`, `/team` | Studio pages | `src/data/people.ts` etc. |
| `/careers`, `/careers/:slug` (5) | Jobs | `src/data/jobs.ts` |
| `/journal` | Article index (12/page, client pagination) | generated index |
| `/journal/:cluster` | Cluster hubs (8 clusters) | generated index |
| `/journal/tag/:tag` | Tag pages (all tags prerendered) | generated index |
| `/journal/:cluster/:slug` | Article | `src/content/articles/<cluster>/<slug>.md` |
| `/search` (?q=) | Live-debounced client search; empty state shows popular tags + latest | metas |
| `/resources` | Playbooks hub | playbooks cluster |
| `/contact` | Brief form (client validation + success state) | — |
| `/press`, `/legal/privacy`, `/legal/terms` | Static | — |
| `/*` → 404 (also emitted as `dist/404.html`) | Lost in the undergrowth | — |

## Content pipeline (writers: read this)

- Articles: `src/content/articles/<cluster>/<slug>.md`. Clusters:
  `web-design, engineering, product, brand, growth, ai, ecommerce, playbooks`.
- Case studies: `src/content/work/<slug>.md` (cluster: `work`, plus client,
  industry, services[], year, stack[], optional demo).
- Frontmatter (all required): title, description (120–160 chars), slug, cluster,
  tags[], date (ISO, 2024–2026), author (**a name from `src/data/people.ts`
  exactly — the build enforces this; title suffixes are stripped, unknown names
  fail**), keywords[], readingTime; optional heroImage (path under
  `/images/…`), heroAlt.
- `npm run predev`/`prebuild` regenerates `src/generated/content.ts` (metas only)
  and **validates** (author roster, required fields, duplicate slugs fail the
  build); `scripts/ensure-demo-css.mjs` stubs demo CSS missing from in-flight
  demo folders so builds stay green.
- Markdown renderer is custom (`src/lib/markdown.ts`): headings, lists, quotes,
  code fences, tables, links, images. Internal links are base-prefixed
  automatically — write them as root-relative (`/services/growth`), never absolute.
- Article pages lazy-load their body chunk; prerender preloads bodies
  (`src/lib/preload.ts`) so static HTML has full content.
- 3–6 internal links per article. Journal: 1,100–2,200 words + "Key takeaways" +
  FAQ. Case studies: 900+ words, Challenge/Approach/Outcome.

## Demos

- `src/demos/<slug>/index.tsx` (default export) + `meta.ts` (default export
  `{ title, description, tags[], client, caseStudy? }`). Auto-discovered via
  `import.meta.glob` — never edit routes or the registry.
- caseStudy field = slug of the matching file in `src/content/work/`.
- Own art direction + scoped CSS (`demo.css` imported by index.tsx); prefix classes
  with the demo slug. Must work standalone down to 375px, respect reduced motion,
  and stay keyboard accessible.

## SEO / prerender

- `npm run build` = build-content-index → tsc → vite build → vite SSR build →
  `scripts/prerender.mjs` renders every route (list from `prerenderRoutes()` in
  `src/entry-server.tsx`) into `dist/<route>/index.html`, plus 404.html,
  sitemap.xml, robots.txt, rss.xml, .nojekyll.
- Per-page head is declared with `<Seo>` (`src/lib/head.tsx`); server collector
  writes title/description/canonical/OG/JSON-LD. JSON-LD helpers in `lib/jsonld.ts`
  (Organization, WebSite, Article, CreativeWork, FAQPage, BreadcrumbList).
- Canonical/OG/sitemap absolute URLs: `absoluteUrl()` = SITE_URL + BASE + path.
- Default OG image: `/images/og.jpg` (generated).

## Base path (GitHub Pages)

- CI sets `BASE_PATH=/brassfern/`, `SITE_URL=https://nicko170.github.io`.
- `src/lib/base.ts`: `BASE`, `withBase()` (use for EVERY asset/fetch/md link),
  `ROUTER_BASE` for `<BrowserRouter basename>`, `absoluteUrl()`.
- `%BASE_URL%` is replaced in index.html by a vite plugin (favicon).

## Commands

- `npm run dev` · `npm run build` (full, GHP-equivalent) · `npm run typecheck`
  (fast check for workers: regenerating content index first is wise:
  `node scripts/build-content-index.mjs && npm run typecheck`).

## Route code-splitting (builder note)

- Every page is a lazy chunk via `src/lib/lazyPage.ts` (`lazyPage`/`lazyNamed`,
  which add `.preload()`). `App.tsx` exports `preloadAllPages()`; the prerender
  awaits it before `renderToString`. It nudges React's internal lazy payloads
  (`_init`/`_payload`) — awaiting the *thrown thenable* then re-nudging —
  because React 18 SSR never resolves Suspense on its own. Don't remove the
  double-nudge: without it the first-rendered route of each page type ships
  skeleton HTML. Verify with: `grep -r 'class="skel"' dist --include=index.html
  | grep -v /lab/` (should be empty).
- Client hydration is progressive: prerendered HTML stays visible while each
  route chunk arrives; Suspense fallback is the `.skel` skeleton.
- Entry chunk ≈ 63 KB gzip (react-dom + router + shell + content metas);
  pages 5–40 KB; demos stay per-demo (three.js only on its demo route).
