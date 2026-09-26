# Brassfern design system — "Botanic industrial editorial"

A warm paper canvas, deep fern ink, and machined-brass accents. Fraunces carries the
voice; Instrument Sans does the work; IBM Plex Mono labels the exhibits. Everything
feels printed, grown and engineered — never "SaaS template".

## Palette (CSS vars in `src/styles/tokens.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--paper` `#f5efdf` | page background |
| `--paper-2` `#ece3cc` / `--paper-3` `#e3d7b8` | cards, wells |
| `--ink` `#182116` | text, primary buttons |
| `--ink-2` `#3d4736` / `--ink-3` `#6a7261` | secondary text / muted |
| `--fern` `#1e4d33` / `--fern-2` `#2f6a48` | accents, italics in display heads, links in prose |
| `--fern-soft` `#d7e0cd` | success/tinted wells |
| `--brass` `#b08a3e` / `--brass-2` `#c9a84c` / `--brass-hi` `#e6cc8a` | rules, indices, CTA accents |
| `--clay` `#b4552d` | errors only |
| `--line` | `rgba(24,33,22,.16)` hairlines |
| Dark sections: `--night` `#141c15`, `--night-2` `#1c261d`, `--night-text` `#e9e2cd`, `--night-mute` `#9aa48e`, `--night-line` | POV band, footer |

Never introduce new hues; achieve variety with tints/opacity of these.

## Typography

- Display: **Fraunces** (variable, optical size, italic allowed; weight 380–560).
  Italic words inside display headlines are the signature accent (coloured `--fern`
  on paper, `--brass-2` on night).
- Body/UI: **Instrument Sans** 400–700. Body `--fs-body` 17px/1.6; prose 1.75.
- Labels: **IBM Plex Mono**, `--fs-micro` 11px, letter-spacing .14–.16em, uppercase —
  used for overlines, folio numbers (`01 —`), meta rows.
- Fluid scale in tokens (`--fs-hero` … `--fs-small`) via clamp(); no manual media-query font sizes.

## Signature elements

- **Generative fern hero** (`src/components/Fern.tsx`): Barnsley fern drawn point-by-point
  on canvas, brass↔fern gradient, pointer parallax via CSS transform. Home only — it's sacred.
- **Grain**: fixed SVG-noise overlay at 5.5% opacity (`.grain` in Layout).
- **Overline**: mono label preceded by a 2rem brass rule (`.overline`).
- **Rules & folios**: numbered rows (`.rows`/`.row-link`) with mono numerals and arrows;
  thin top rules instead of card chrome.
- **Marquee**: client wordmark wall (`.marquee`, pauses on hover, reduced-motion static).
- **Buttons**: pill, `.btn` ink solid / `--ghost` / `--brass`; arrow nudges on hover.
- **Cards**: `card` = top-rule editorial card; CSS-only generative tile art via
  `themeFor(slug)` initials until real hero images exist (Cards.tsx).

## Motion law

- Easing: `--ease-out` = cubic-bezier(.22,1,.36,1); spring for arrows only.
- Durations: 160ms hover / 420ms UI / 900ms reveals. Motion earns its keep or is cut.
- `prefers-reduced-motion`: global CSS kills animation; `Reveal` skips observation;
  Fern renders one static frame; marquees stop. Every demo must honour this too.

## Voice

Confident, witty, warm, precise. Short sentences. Australian spellings (colour, optimise).
Show, don't tell. Metrics on the concept site are always labeled illustrative/fictional.
The colophon (footer + /studio + /legal) is mandatory and must stay verbatim:
"Brassfern is a concept studio. This site — every page, article and demo — was designed
and built autonomously by Kimi K3 running on GreenThread."

## Honest fixtures — keep consistent

- **Team (article authors!)**: see `src/data/people.ts` — Mara Ellison, June Okafor,
  Tomás Reyes, Felix Brandt, Aiko Tanaka, Dev Khatri, Priya Nair, Leonie Marsh,
  Sam Whitfield, Ruby Castellanos, Nate Sullivan, Hannah Yeo.
- **Fictional clients**: see `src/data/clients.ts` — Hearthbrew Coffee, Northwind Ledger,
  Pylon Health, Fernleigh, Osprey Outdoor, Brightmarsh, Tallow & Co., Meridian Climate,
  Holloway Records, Sundial, Wattle & Daub, GLADE (+ Copperline Mutual etc. in case studies).
- **Team portraits**: geometric SVG (`src/components/Portrait.tsx`) — never photoreal faces.

## Imagery

Generated images live under `public/images/…`, referenced via `withBase()`.
Style: editorial print — cream/paper backgrounds, brass/fern palette, grain,
generous negative space, no text/logos/photoreal people. `public/images/og.jpg` is the default OG image.
All 17 case studies have heroes at `public/images/work/<slug>.jpg` (editorial
still-lifes, iteration 3–4); journal heroes are added per flagship article at
`public/images/articles/<cluster>/<slug>.jpg`.

## Demos

Each demo has its OWN art direction (defined per-demo in its folder), scoped CSS
(`import './demo.css'`), and must respect prefers-reduced-motion. Never import the
Brassfern look into a demo.

- **Featured lab band** (`.lab-feature`): night-card on /lab spotlighting the newest
  demo — brass-italic client initials over a radial night texture, mono meta row.
- **Case-study demo strip** (`.demo-strip`): night card on /work/:slug when the study
  links a live demo — overline "Touch the work — live demo", demo title, mono meta,
  brass-initial art tile, mono CTA; art tile hides under 700px.
- **Article prev/next** (`.article-nav`): hairline-topped two-col links, Older ← / Newer →.
- **Counts in filters** (`.filter-btn__count`): superscript mono counts in cluster nav
  and work filters. **Filter status** (`.filter-status` + `.filter-status__reset`):
  live-region result count with underline reset affordance.
- **Testimonial deep-links** (`.quote-block__link`): fern-coloured underline link
  on the quoted client's company name → its case study (`Testimonial.caseStudy`
  in clients.ts).
- **Home lab band**: home reuses the Lab's `.lab-feature` night card
  (featuring demos[0]) between the work reel and services.
- **Print**: `@media print` block at the end of app.css hides chrome/grain/
  marquee/lab art, flattens night sections, expands prose link hrefs.
- **Author profiles** (`/team/:slug`): `personSlug()` in data/people.ts
  (diacritic-safe). Person page = `.person-hero` (text col + framed Portrait),
  `.person-hero__facts` (mono dt / display dd), authored case-study + article
  grids, team chip row. ProfilePage JSON-LD via `personLd()`. Bylines on
  article and case-study pages link to profiles via `.article-meta__author`
  (brass underline, fern on hover). Team index cards are full-block links
  (`.person__link`) with hover lift.
- **Lead stories** (`.feature`): editorial lead card on /journal + cluster
  hubs (page 1 only) — 2px ink top rule, text col + `.feature__media` (16:10,
  hero image or themeFor tile), mono meta row; featured = latest article with
  heroImage, excluded from the paginated grid.

## Content authoring rules (enforced by build-content-index.mjs)

- `author` must be a name from `src/data/people.ts` verbatim. A trailing
  ", Job Title" is stripped automatically; known aliases map to canonical names;
  anything else fails the build.
- `description` 120–160 chars warned at 110/170 bounds. Journal 1,100+ words,
  case studies 900+ words.

## CSS conventions

Hand-rolled (no frameworks). Tokens in `src/styles/tokens.css`, everything else in
`src/styles/app.css`. Class style: BEM-ish (`.site-head__in`). Utilities: `.container`,
`.section`, `.display`, `.lead`, `.mono`, `.muted`, `.two-col`, `.card-grid--2/3`,
`.fact-list`, `.prose`, `.chip`, `.field`, `.filter-btn`, `.skel`.
