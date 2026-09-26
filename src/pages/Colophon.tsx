import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import Crumbs from '../components/Crumbs'
import Reveal from '../components/Reveal'

const SWATCHES: { token: string; hex: string; note: string }[] = [
  { token: '--paper', hex: '#f5efdf', note: 'Page background — warm stock, never white' },
  { token: '--paper-3', hex: '#e3d7b8', note: 'Deeper wells and tinted cards' },
  { token: '--ink', hex: '#182116', note: 'Text and primary buttons — fern-black' },
  { token: '--ink-3', hex: '#6a7261', note: 'Muted labels and meta text' },
  { token: '--fern', hex: '#1e4d33', note: 'Accents, italic words, prose links' },
  { token: '--fern-2', hex: '#2f6a48', note: 'Hover states and secondary accents' },
  { token: '--brass', hex: '#b08a3e', note: 'Rules, indices, machined details' },
  { token: '--brass-2', hex: '#c9a84c', note: 'Brass on night surfaces' },
  { token: '--brass-hi', hex: '#e6cc8a', note: 'Highlights and hover brass' },
  { token: '--clay', hex: '#b4552d', note: 'Errors — one job, held in reserve' },
  { token: '--night', hex: '#141c15', note: 'Dark sections: footer, POV band, lab' },
  { token: '--night-text', hex: '#e9e2cd', note: 'Text on night' },
]

const MACHINERY: { k: string; v: string }[] = [
  { k: 'Stack', v: 'React 18 + TypeScript + Vite. Hand-rolled CSS — no UI framework, no utility soup.' },
  { k: 'Rendering', v: 'Every route is statically prerendered to plain HTML at build time; pages then hydrate progressively. Every article is real HTML, not a skeleton.' },
  { k: 'Type delivery', v: 'Fraunces, Instrument Sans and IBM Plex Mono via Google Fonts with display=swap and preconnect hints.' },
  { k: 'Hosting', v: 'GitHub Pages, under a sub-path. A single withBase() helper keeps every asset honest at any mount point.' },
  { k: 'Tracking', v: 'None. No analytics, no pixels, no cookies. The exit-intent popup is scheduled for never.' },
  { k: 'Imagery', v: 'All generated in-house. No stock photography, no photoreal people; the team portraits are geometric illustrations.' },
]

const COMMITMENTS: { t: string; p: string }[] = [
  {
    t: 'Readable by everyone',
    p: 'WCAG 2.2 AA throughout: contrast-checked palette pairs, visible focus rings, keyboard-first interaction, semantic landmarks, labelled forms.',
  },
  {
    t: 'Motion you can decline',
    p: 'Every animation, reveal, marquee and canvas honours prefers-reduced-motion. The fern on the home page renders one static frame if you ask it to.',
  },
  {
    t: 'Light on the wire',
    p: 'Route- and demo-level code splitting, hover-intent prefetching, system-measured budgets. Performance is a design feature, not a retrofit.',
  },
  {
    t: 'Honest by construction',
    p: 'All clients, people, awards and numbers on this site are fictional and say so. Metrics are labelled illustrative. The demos run on seeded fake data.',
  },
]

export default function Colophon() {
  return (
    <>
      <Seo
        title="Colophon — how this site was made"
        description="The type, palette, machinery and authorship of the Brassfern site: a concept studio built autonomously by an AI, to a human-grade bar."
        path="/colophon"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Colophon', path: '/colophon' }])]}
      />
      <header className="article-head container">
        <Crumbs items={[{ name: 'Studio', path: '/studio' }, { name: 'Colophon' }]} />
        <Reveal className="overline">Colophon</Reveal>
        <h1 className="display">Notes on the <em>making of</em></h1>
        <p className="lead lead--wide">
          A colophon is where a book admits how it was printed. This is ours: the type, the palette, the machinery — and the rather unusual author.
        </p>
      </header>

      <section className="section container">
        <Reveal className="overline">The type</Reveal>
        <div className="specimens" style={{ marginTop: 'var(--space-6)' }}>
          <div className="specimen">
            <p className="specimen__sample specimen__sample--display">
              Software with a <em>heartbeat</em>.
            </p>
            <p className="specimen__caption">
              Fraunces — display. A variable serif run at optical size with soft weights (380–560). Italic words inside headlines are the signature accent.
            </p>
          </div>
          <div className="specimen">
            <p className="specimen__sample specimen__sample--body">
              The work has to load fast, read well at 375 pixels, and still feel expensive at 1440. Instrument Sans carries that weight — body copy, interface, buttons, and everything that must simply work.
            </p>
            <p className="specimen__caption">
              Instrument Sans — body and interface. Quiet, legible, unbothered.
            </p>
          </div>
          <div className="specimen">
            <p className="specimen__sample specimen__sample--mono">
              01 — Overline · Fig. 03 · Est. 2014 · Sydney / Auckland / Singapore / London
            </p>
            <p className="specimen__caption">
              IBM Plex Mono — labels, indices, timestamps and other exhibit furniture. Uppercase, tracked wide, 11px up.
            </p>
          </div>
        </div>
      </section>

      <section className="section container">
        <Reveal className="overline">The palette</Reveal>
        <p className="lead" style={{ maxWidth: '56ch', marginTop: 'var(--space-4)' }}>
          Warm paper, deep fern ink, machined brass. Twelve values, reused everywhere — variety comes from tints and opacity, never new hues.
        </p>
        <div className="swatches" style={{ marginTop: 'var(--space-6)' }}>
          {SWATCHES.map((s) => (
            <div className="swatch" key={s.token}>
              <span className="swatch__chip" style={{ background: `var(${s.token})` }} aria-hidden />
              <span className="swatch__token mono">{s.token}</span>
              <span className="swatch__hex mono">{s.hex}</span>
              <span className="swatch__note">{s.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal className="overline">The machinery</Reveal>
        <ul className="fact-list" style={{ marginTop: 'var(--space-6)' }}>
          {MACHINERY.map((m) => (
            <li key={m.k}>
              <span>{m.k}</span>
              <span>{m.v}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="night section">
        <div className="container">
          <Reveal className="overline overline--night">The author</Reveal>
          <h2 className="display" style={{ marginBlock: 'var(--space-4)' }}>
            No humans were <em>harmed</em> — or, honestly, involved.
          </h2>
          <p className="lead lead--wide" style={{ color: 'var(--night-mute)' }}>
            Brassfern is a concept studio. This site — every page, article and demo — was designed and built autonomously by Kimi&nbsp;K3 running on GreenThread. The studio, its people, its clients, its awards and every metric are fictional; the craft standards are real, and we hold the machine to a human-grade bar.
          </p>
          <div className="pov-grid" style={{ marginTop: 'var(--space-7)' }}>
            {COMMITMENTS.map((c, i) => (
              <Reveal key={c.t} delay={i * 80} className="pov-item">
                <h3>{c.t}</h3>
                <p>{c.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <Reveal className="overline">Keep wandering</Reveal>
        <div className="rows" style={{ marginTop: 'var(--space-5)' }}>
          <Link to="/approach" className="row-link">
            <span className="row-link__num">01</span>
            <h3>How we work</h3>
            <span className="row-link__arrow" aria-hidden>→</span>
            <p>Squads, sprints, weekly demos, shipping in public</p>
          </Link>
          <Link to="/studio" className="row-link">
            <span className="row-link__num">02</span>
            <h3>The studio</h3>
            <span className="row-link__arrow" aria-hidden>→</span>
            <p>Story, values, culture and timeline since 2014</p>
          </Link>
          <Link to="/sitemap" className="row-link">
            <span className="row-link__num">03</span>
            <h3>Sitemap</h3>
            <span className="row-link__arrow" aria-hidden>→</span>
            <p>Every path in the garden, indexed by hand</p>
          </Link>
        </div>
      </section>
    </>
  )
}
