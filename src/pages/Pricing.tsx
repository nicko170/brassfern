import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd, faqLd } from '../lib/jsonld'
import Reveal from '../components/Reveal'

const models = [
  {
    name: 'Sprint',
    price: 'AUD 45–120k',
    duration: '2–8 weeks',
    desc: 'One outcome, fixed price, fixed date. Rebrands, site rebuilds, AI prototypes, audits that end in a roadmap.',
    items: ['Fixed scope agreed in week zero', 'Senior squad of 3–5', 'Weekly demos + staging links', '30-day post-launch iteration window'],
  },
  {
    name: 'Retainer',
    price: 'AUD 28k+/mo',
    duration: 'Quarterly commitment',
    desc: 'A standing squad for roadmaps that keep moving — product builds, growth programs, design systems that never go stale.',
    items: ['Same squad, compounding context', 'Weekly cadence & experiment rhythm', 'Roadmap we plan together quarterly', 'Pause or reshape with 30 days notice'],
  },
  {
    name: 'Residency',
    price: 'Custom',
    duration: '3–12 months',
    desc: 'We embed inside your team to ship something hard and leave capability behind. For rebuilds, replatforms and zero-to-one products.',
    items: ['Embedded alongside your people', 'Hiring & handover built into the plan', 'Your tooling, your repos, your IP', 'Exit criteria defined up front'],
  },
]

const faqs = [
  { q: 'Why fixed price?', a: 'Because it aligns us with your outcome, not your hours. We carry the estimation risk — that is what experience is for. If we misjudge, we wear it.' },
  { q: 'What is not included?', a: 'Media spend, third-party licences and content production at scale are passed through at cost. Everything about the work itself is inside the number.' },
  { q: 'Can we start smaller?', a: 'Yes. Many relationships begin with a two-week discovery sprint — a fixed, cheap way to de-risk both the problem and the partnership.' },
  { q: 'Do you discount for non-profits?', a: 'We reserve two discounted engagement slots a year for climate and community organisations. Tell us what you are working on.' },
]

export default function Pricing() {
  return (
    <>
      <Seo
        title="Pricing & engagement models"
        description="How Brassfern charges: fixed-scope sprints, quarterly retainers and embedded residencies. Transparent ranges, no hourly billing."
        path="/pricing"
        jsonLd={[faqLd(faqs), breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Pricing</Reveal>
        <h1 className="display">How we <em>charge</em></h1>
        <p className="lead lead--wide">
          No hourly billing, no surprise invoices. You are buying an outcome with a date on it — here is what that costs.
        </p>
      </header>

      <section className="section container">
        <div className="card-grid card-grid--3">
          {models.map((m, i) => (
            <Reveal key={m.name} delay={i * 90} className="card" style={{ gap: 'var(--space-4)' }}>
              <span className="card__index">0{i + 1}</span>
              <h3 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>{m.name}</h3>
              <p className="mono" style={{ color: 'var(--fern)' }}>{m.price} · {m.duration}</p>
              <p>{m.desc}</p>
              <ul style={{ paddingLeft: '1.2em', color: 'var(--ink-2)', fontSize: '0.95rem', display: 'grid', gap: '0.4rem' }}>
                {m.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <Reveal className="overline">FAQ</Reveal>
        <div style={{ marginTop: 'var(--space-5)', maxWidth: '46rem' }}>
          {faqs.map((f) => (
            <details key={f.q} style={{ borderBottom: '1px solid var(--line)', paddingBlock: '1.1rem' }}>
              <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 500 }}>{f.q}</summary>
              <p className="muted" style={{ marginTop: '0.8rem', maxWidth: '56ch' }}>{f.a}</p>
            </details>
          ))}
        </div>
        <p style={{ marginTop: 'var(--space-6)' }}>
          <Link to="/contact" className="btn btn--primary">Get a fixed quote <span className="arrow" aria-hidden>→</span></Link>
        </p>
      </section>
    </>
  )
}
