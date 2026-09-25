# BRIEF — Brassfern

You are building, over a long unattended run, the website of **Brassfern**, an independent digital
product studio and growth agency. You have **absolute creative control** within this brief. The brief
never changes; your notes in `.ralph/` record how you execute it. Every iteration should make the
site more impressive, more complete, more alive.

This site is a showcase: when a founder or marketing lead lands here, they should think *"these
people are world-class — I want them to build our thing."* It must feel like a real, top-tier agency
site (think the best of Awwwards / Site of the Day energy) — not a template.

## The company

**Brassfern — "Software with a heartbeat."** (You may refine the tagline; keep the name.)

- Independent studio, founded 2014, HQ in Sydney (Surry Hills) with a remote team across AU/NZ,
  Singapore and London. ~45 people. Designers, engineers, strategists, writers, growth marketers.
- What they do (services — each deserves a rich page):
  - **Brand & identity** — strategy, naming, visual identity, motion, design systems.
  - **Websites** — marketing sites, headless CMS, editorial platforms, performance-obsessed builds.
  - **Product design & engineering** — web apps, dashboards, SaaS, mobile (React, React Native,
    TypeScript, Node, Postgres), design systems, accessibility.
  - **E-commerce** — headless storefronts, conversion design, subscriptions, checkout.
  - **AI products** — LLM features, agents, retrieval, evaluation, responsible AI.
  - **Growth** — SEO & content, performance marketing, CRO, analytics, lifecycle/email.
- How they work: small senior squads, fixed-scope sprints and retainers, weekly demos, shipping
  in public. Opinionated about craft, speed and measurable outcomes.
- Voice: confident, witty, warm, precise. Short sentences. Show, don't tell. No buzzword soup.

**Honesty rules (non-negotiable):** clients, people, testimonials, awards and numbers are
fictional. Never use real company names or logos as clients, never attribute quotes to real
people, never claim real awards. Invent plausible, specific fictional brands (e.g. "Hearthbrew
Coffee", "Northwind Ledger", "Pylon Health") and keep them consistent. Include a tasteful colophon
in the footer and on /about: "Brassfern is a concept studio. This site — every page, article and
demo — was designed and built autonomously by Kimi K3 running on GreenThread."

## The website — required sections (expand freely)

- **Home** — an unforgettable first impression: bold typography, a signature interactive or
  generative hero (canvas/WebGL/SVG), a reel of featured work, services, clients (fictional logo
  wall — typographic wordmarks you design in SVG/CSS), testimonials, the studio's point of view,
  latest journal, a big CTA. Must respect `prefers-reduced-motion`.
- **Work** — filterable case-study index (industry, service, stack) + a page per case study:
  hero, the challenge, the approach, the outcome (clearly illustrative metrics), stack, team,
  gallery, testimonial, and — where one exists — an embedded or linked **live demo**.
- **Lab** — the live demos (see below): an index with previews, each demo at `/lab/<slug>`,
  full-screen, with a slim Brassfern overlay bar (back, "about this demo", link to its case study).
- **Services** — one page per service (above) with process, deliverables, FAQs, related work.
- **Industries** — fintech, health, retail, hospitality, climate, education, media, SaaS, non-profit.
- **Approach / How we work**, **Pricing & engagement models**, **Studio** (story, values, culture,
  timeline), **Team** (fictional people; stylised illustrated portraits — never photoreal faces),
  **Careers** + job pages, **Journal** (articles), **Resources** (guides, checklists, templates),
  **Contact** (a genuinely good project-brief form with client-side validation and a success state),
  **Press**, **Legal** (privacy, terms), 404 with personality.

## Live demos — the heart of the showcase

Demo builders create **real, working, interactive mini-products** — each a self-contained React app
living in `src/demos/<slug>/` (entry `index.tsx` with a default-exported component, and `meta.ts`
exporting `{ title, description, tags, client, caseStudy }`). They use realistic fake data, feel
production-grade, and each has its own art direction (not Brassfern's). Target **24 demos**, e.g.:
a specialty-coffee storefront with cart and subscription; a fintech budgeting dashboard with charts;
a 3D product configurator (three.js / react-three-fiber); a travel booking flow; a restaurant site
with reservations; a SaaS pricing calculator; a real-estate map search; a music player UI; a
fitness habit tracker; a scrollytelling data story; a design-system docs site; an AI support
assistant UI (mocked responses); a generative brand-identity toy; a kanban project tool; a
telehealth appointment flow; an event ticketing seat map; a portfolio CMS editor; a climate data
explorer; a podcast landing page; an onboarding flow; a checkout optimisation A/B demo; etc.
The app must discover demos automatically (e.g. `import.meta.glob('./demos/*/meta.ts')`) so demo
builders never edit routes. Each demo gets a case study in the `work` cluster.

## Journal — at least 600 articles

| Cluster (slug) | Target | Examples |
| --- | --- | --- |
| `work` — Case studies | 48 | One per demo plus other fictional client projects |
| `web-design` | 90 | Type systems for marketing sites, motion that earns its keep, landing page anatomy… |
| `engineering` | 90 | Core Web Vitals in practice, React Server Components trade-offs, design tokens pipelines… |
| `product` | 70 | Jobs-to-be-done interviews, dashboard design, onboarding patterns, accessibility… |
| `brand` | 60 | Naming process, logo systems, brand voice, rebrands that worked (and why)… |
| `growth` | 80 | Technical SEO checklists, content strategy, CRO experiments, attribution, lifecycle… |
| `ai` | 70 | Shipping LLM features, evals, RAG pitfalls, agent UX, AI and brand voice… |
| `ecommerce` | 50 | Headless commerce, PDP design, subscription models, checkout friction… |
| `playbooks` | 50 | Writing a great brief, choosing an agency, estimating, discovery sprints, handover… |

Article standards (validated by the harness): Markdown with YAML frontmatter at
`src/content/articles/<cluster>/<slug>.md` (case studies at `src/content/work/<slug>.md`) —
`title`, `description` (120–160 chars), `slug`, `cluster`, `tags`, `date` (ISO, 2024–2026),
`author` (a fictional Brassfern team member), `keywords`, `readingTime`, optional `heroImage`/`heroAlt`.
Case studies also need `client`, `industry`, `services`, `year`, `stack`, optional `demo` (demo slug).
Journal articles: 1,100–2,200 words, real expertise, specific examples, a "Key takeaways" section and
a closing FAQ. Case studies: 900+ words with Challenge / Approach / Outcome sections. 3–6 internal
links to real site paths. Every piece distinct and genuinely useful — no filler, no keyword stuffing.

## Technical requirements

- **React + TypeScript + Vite**, React Router, your styling system with a real token layer. Pick
  libraries boldly where they add craft (motion, three.js, charts) but keep the bundle disciplined:
  code-split per route and per demo.
- **Deployed to GitHub Pages at a sub-path from day one**: support `BASE_PATH` (default `/`) and
  `SITE_URL` env vars — Vite `base`, Router `basename`, and a single `withBase()` helper for every
  asset URL, image, preload, fetch and Markdown link. The harness has added
  `.github/workflows/pages.yml` (builds with `BASE_PATH=/brassfern/`); keep it working and never
  break the build. Emit `.nojekyll` and a styled `404.html`.
- **SEO**: static prerendering of every route (all articles, case studies, services, lab pages);
  per-page title/description/canonical/OG; JSON-LD (Organization, WebSite, Article, FAQPage,
  BreadcrumbList, CreativeWork for case studies); sitemap, robots, RSS.
- Search across journal + work, tag/cluster pages, pagination, related content.
- Performance, accessibility (WCAG AA), mobile-first — beautiful at 375px and 1440px.
- `npm run build` must pass at the end of every builder iteration. Provide `npm run typecheck`
  (tsc --noEmit) for workers who must not run full builds.

## Design direction — absolute creativity mode

You choose Brassfern's art direction and record it in `.ralph/DESIGN.md` on the first iteration,
then stay consistent. Aim for distinctive: an unexpected palette, expressive variable type, a
signature motion language, editorial layouts with rhythm, tactile details (grain, cursor, sound-off
micro-interactions). Avoid generic SaaS gradients and stock agency clichés.

## Images

Use `generate_image` for case-study heroes and device mockups of the demos, service and studio
art, journal heroes for your best pieces. Keep a consistent style per project; no text/logos in
images; team portraits are stylised illustrations, never photoreal people.
