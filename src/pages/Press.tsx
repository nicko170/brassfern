import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import { withBase } from '../lib/base'
import CopyButton from '../components/CopyButton'
import Reveal from '../components/Reveal'

const mentions = [
  { outlet: 'The Field Notes Review', year: '2025', quote: 'Brassfern’s Hearthbrew work proves brand systems can feel hand-grown and ship like software.' },
  { outlet: 'Local/Motion Dispatch', year: '2025', quote: 'Their Friday-demo ritual should be mandatory across the industry.' },
  { outlet: 'Checkout Quarterly', year: '2025', quote: 'The rare studio that talks about cart abandonment and kerning with equal reverence.' },
  { outlet: 'Made in the Open (fictional annual)', year: '2024', quote: 'A studio that publishes its homework — checklists, evals and all.' },
]

const announcements: { date: string; title: string; note: string; to?: string; linkText?: string }[] = [
  {
    date: '2026-08',
    title: 'The Lab opens its bench',
    note: 'Every experiment now ships in public — working mini-products, not screenshots. Twenty-plus and counting.',
    to: '/lab',
    linkText: 'Visit the Lab',
  },
  {
    date: '2026-03',
    title: 'Salary bands, published',
    note: 'Every role at Brassfern now lists its band on the job page. Candidates shouldn’t need to negotiate blind.',
    to: '/careers',
    linkText: 'See open roles',
  },
  {
    date: '2025-11',
    title: 'We rebuilt our own site in the open',
    note: 'Tokens, type specimens, machinery and mistakes — the whole making-of is on the colophon page.',
    to: '/colophon',
    linkText: 'Read the colophon',
  },
  {
    date: '2025-06',
    title: 'London desk opens',
    note: 'Four time zones, one standup. Sydney, Auckland and Singapore gain a European sibling.',
    to: '/studio',
    linkText: 'About the studio',
  },
  {
    date: '2024-09',
    title: 'Fieldnotes passes ten thousand readers',
    note: 'Our occasional letter on craft and growth crosses five figures. Still no growth hacks in it.',
    to: '/journal',
    linkText: 'Read the journal',
  },
  {
    date: '2024-02',
    title: 'Brassfern turns ten',
    note: 'A decade independent. Still no investors, still shipping on Fridays.',
    to: '/studio',
    linkText: 'The story so far',
  },
]

const facts: [string, string][] = [
  ['Founded', '2014, Surry Hills, Sydney'],
  ['Team', '~45 across AU/NZ, Singapore, London'],
  ['Disciplines', 'Brand, websites, product, e-commerce, AI, growth'],
  ['Model', 'Small senior squads, fixed-scope sprints, retainers'],
  ['Tagline', '“Software with a heartbeat.”'],
  ['Entity', 'Brassfern Pty Ltd (fictional)'],
]

const BOILER_SHORT =
  'Brassfern is an independent digital product studio in Sydney. Forty-five designers, engineers, strategists and writers build brands, websites, products, e-commerce, AI features and growth programs for clients across four time zones. Software with a heartbeat.'

const BOILER_LONG =
  'Brassfern is an independent digital product studio founded in 2014 in Surry Hills, Sydney. The studio’s forty-five designers, engineers, strategists, writers and growth marketers work in small senior squads across Australia, New Zealand, Singapore and London. Brassfern designs and builds brands, websites, digital products and e-commerce storefronts, ships responsible AI features, and runs growth programs measured in outcomes rather than decks. Clients range from specialty coffee roasters to climate-data platforms. The studio remains independent, publishes its methods in an open journal, and demos work every Friday. Tagline: “Software with a heartbeat.”'

const assets = [
  { file: 'press/brassfern-mark-ink.svg', name: 'Fern mark — ink', note: 'Primary mark, light backgrounds', surface: 'paper' },
  { file: 'press/brassfern-mark-paper.svg', name: 'Fern mark — paper', note: 'Reversed, dark backgrounds', surface: 'night' },
  { file: 'press/brassfern-wordmark-ink.svg', name: 'Wordmark — ink', note: 'Full lockup, light backgrounds', surface: 'paper' },
  { file: 'press/brassfern-wordmark-paper.svg', name: 'Wordmark — paper', note: 'Full lockup, dark backgrounds', surface: 'night' },
  { file: 'press/brassfern-mark-brass.svg', name: 'Fern mark — brass', note: 'Accent use only, sparingly', surface: 'paper' },
  { file: 'press/brassfern-badge-night.svg', name: 'Avatar badge', note: 'Social avatars and favicons', surface: 'raw' },
] as const

export default function Press() {
  return (
    <>
      <Seo
        title="Press & media kit"
        description="Press kit for Brassfern: boilerplate, fast facts, brand assets, fictional mentions and studio announcements from the independent Sydney product studio."
        path="/press"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Press', path: '/press' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Press</Reveal>
        <h1 className="display">In their <em>words</em></h1>
        <p className="lead lead--wide">
          Brassfern is a concept studio, so the coverage below is fictional — illustrative of the kind of work we would want to be known for. No real awards are claimed. The boilerplate, facts and assets are real enough to copy.
        </p>
      </header>

      <section className="section container">
        <div className="pov-grid">
          {mentions.map((m, i) => (
            <Reveal as="figure" key={m.outlet} delay={i * 80} className="quote-block">
              <blockquote>“{m.quote}”</blockquote>
              <figcaption>{m.outlet} — {m.year}</figcaption>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <Reveal className="overline">Fast facts</Reveal>
        <ul className="fact-list" style={{ marginTop: 'var(--space-5)' }}>
          {facts.map(([k, v]) => (
            <li key={k}><span>{k}</span><span>{v}</span></li>
          ))}
        </ul>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <Reveal className="overline">Boilerplate</Reveal>
        <div className="two-col" style={{ marginTop: 'var(--space-5)', alignItems: 'start' }}>
          <div className="boilerplate">
            <p className="mono muted">Short — {BOILER_SHORT.split(' ').length} words</p>
            <p>{BOILER_SHORT}</p>
            <div className="boilerplate__foot">
              <CopyButton text={BOILER_SHORT} label="Copy text" />
            </div>
          </div>
          <div className="boilerplate">
            <p className="mono muted">Long — {BOILER_LONG.split(' ').length} words</p>
            <p>{BOILER_LONG}</p>
            <div className="boilerplate__foot">
              <CopyButton text={BOILER_LONG} label="Copy text" />
            </div>
          </div>
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <Reveal className="overline">Studio announcements</Reveal>
        <div className="rows" style={{ marginTop: 'var(--space-5)' }}>
          {announcements.map((a) => (
            <div className="press-row" key={a.date}>
              <span className="row-link__num">{a.date}</span>
              <div>
                <h3 className="press-row__title">{a.title}</h3>
                <p className="press-row__note">{a.note}</p>
              </div>
              {a.to ? (
                <Link to={a.to} className="press-row__link mono">{a.linkText} →</Link>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <Reveal className="overline">Brand assets</Reveal>
        <p className="lead" style={{ marginTop: 'var(--space-4)' }}>
          The fern and the wordmark, as SVG. Take them; just follow the house rules below.
        </p>
        <div className="asset-grid" style={{ marginTop: 'var(--space-5)' }}>
          {assets.map((a) => (
            <figure key={a.file} className="asset-card">
              <div className={`asset-card__preview${a.surface === 'night' ? ' asset-card__preview--night' : ''}`}>
                <img src={withBase(a.file)} alt={a.name} loading="lazy" />
              </div>
              <figcaption className="asset-card__foot">
                <span>
                  <strong>{a.name}</strong>
                  <span className="muted"> {a.note}</span>
                </span>
                <a href={withBase(a.file)} download className="mono asset-card__dl">SVG ↓</a>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="two-col" style={{ marginTop: 'var(--space-6)' }}>
          <div>
            <h3 className="mono muted" style={{ marginBottom: '0.8rem' }}>Please do</h3>
            <ul className="check-list">
              <li>Give the fern clearspace of at least one frond-width on all sides.</li>
              <li>Use the ink, paper or brass versions exactly as supplied.</li>
              <li>Scale freely — everything is vector.</li>
            </ul>
          </div>
          <div>
            <h3 className="mono muted" style={{ marginBottom: '0.8rem' }}>Please don’t</h3>
            <ul className="check-list check-list--no">
              <li>Stretch, rotate, re-stroke or re-space the fern.</li>
              <li>Retype the wordmark — it’s set in Fraunces, not a lookalike.</li>
              <li>Place the mark on busy photography or off-palette colours.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="night" style={{ borderRadius: 'var(--radius)', padding: 'clamp(1.5rem,4vw,2.5rem)' }}>
          <div className="two-col" style={{ alignItems: 'center' }}>
            <div>
              <h2 className="display h-3">Writing about the studio?</h2>
              <p style={{ color: 'var(--night-mute)', marginBlock: '1rem 0' }}>
                We answer media enquiries quickly and honestly — including the awkward questions about being fictional.
              </p>
            </div>
            <div style={{ justifySelf: 'end' }}>
              <Link to="/contact" className="btn btn--brass">Get in touch <span className="arrow" aria-hidden>→</span></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
