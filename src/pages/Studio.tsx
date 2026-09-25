import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import Reveal from '../components/Reveal'

const values = [
  { t: 'Craft is a strategy', p: 'Beautiful, fast, accessible work is not decoration — it is how products earn trust and keep it. We are precious about the details so users never have to think about them.' },
  { t: 'Say the true thing', p: 'In critiques, in estimates, in postmortems. Politely, always; vaguely, never. Clients hire us for judgement, and judgement requires honesty.' },
  { t: 'Small teams, big ownership', p: 'The person who designs it can defend it; the person who builds it can demo it. Ownership is the fastest quality control we know.' },
  { t: 'Leave the door open', p: 'We document, teach and hand over. A client who outgrows us is a success story, and usually a referral.' },
]

const timeline = [
  { y: '2014', t: 'Mara founds Brassfern in a Surry Hills terrace with two clients and a monstera that outlived both.' },
  { y: '2016', t: 'First product engineering squad forms. The Friday demo is invented out of spite for status meetings.' },
  { y: '2018', t: 'Singapore desk opens — officially "for the time zone", unofficially for the food.' },
  { y: '2020', t: 'Remote-first for good. The team spreads across AU/NZ and the work gets better, not worse.' },
  { y: '2022', t: 'Growth practice launches after one too many clients ask "great site — now who finds it?"' },
  { y: '2024', t: 'AI practice formalised. First rule written on the wall: evals before features.' },
  { y: '2026', t: 'Forty-five people, four time zones, one standard. This website is built by our own tools, in public.' },
]

export default function Studio() {
  return (
    <>
      <Seo
        title="Studio — the story of Brassfern"
        description="Founded 2014 in Surry Hills, Sydney. An independent studio of 45 designers, engineers, strategists and writers across AU/NZ, Singapore and London."
        path="/studio"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Studio', path: '/studio' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">The studio</Reveal>
        <h1 className="display" style={{ maxWidth: '15ch' }}>Grown, <em>not scaled</em></h1>
        <p className="lead lead--wide">
          Brassfern started in 2014 as one designer with opinions. Twelve years later we are forty-five designers, engineers, strategists and writers — still independent, still opinionated, still in Surry Hills.
        </p>
      </header>

      <section className="section container">
        <div className="two-col two-col--wide-left">
          <div>
            <h2 className="display h-3" style={{ marginBottom: '1rem' }}>Why “Brassfern”?</h2>
            <p className="lead" style={{ maxWidth: '58ch', marginBottom: '1rem' }}>
              Brass is machined, precise, and better with patina. Ferns are patient, structural, and quietly everywhere. Good software is both: engineered hard enough to trust, alive enough to love.
            </p>
            <p className="muted" style={{ maxWidth: '58ch' }}>
              We stayed independent on purpose. No holding company, no growth-at-all-costs, no selling the client list. The work is the business model.
            </p>
          </div>
          <div>
            <h2 className="mono muted" style={{ marginBottom: '1rem' }}>Studio facts</h2>
            <ul className="fact-list">
              <li><span>Founded</span><span>2014, Surry Hills, Sydney</span></li>
              <li><span>People</span><span>45 across AU/NZ, Singapore, London</span></li>
              <li><span>Disciplines</span><span>Design, engineering, strategy, writing, growth</span></li>
              <li><span>Model</span><span>Independent, profitable since year two</span></li>
              <li><span>Ritual</span><span>Friday demos, always</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="night section">
        <div className="container">
          <Reveal className="overline overline--night">Values</Reveal>
          <h2 className="display h-2" style={{ marginBlock: '1rem 3rem', color: 'var(--night-text)' }}>What we optimise for</h2>
          <div className="pov-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 80} className="pov-item">
                <span className="card__index">0{i + 1}</span>
                <h3>{v.t}</h3>
                <p>{v.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <Reveal className="overline">Timeline</Reveal>
        <h2 className="display h-2" style={{ marginBlock: '1rem 2.5rem' }}>Twelve years, briefly</h2>
        <ul className="fact-list">
          {timeline.map((t) => (
            <li key={t.y}>
              <span>{t.y}</span>
              <span>{t.t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="two-col">
          <div>
            <Reveal className="overline">Colophon</Reveal>
            <p className="muted" style={{ marginTop: '1rem', maxWidth: '58ch' }}>
              Brassfern is a concept studio. This site — every page, article and demo — was designed and built autonomously by Kimi&nbsp;K3 running on GreenThread. All clients, people, testimonials, awards and numbers are fictional and illustrative.
            </p>
          </div>
          <div style={{ alignSelf: 'center' }}>
            <Link to="/team" className="btn btn--ghost" style={{ marginRight: '1rem' }}>Meet the team</Link>
            <Link to="/careers" className="link-line">Work with us →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
