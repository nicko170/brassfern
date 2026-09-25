import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import Reveal from '../components/Reveal'

const mentions = [
  { outlet: 'The Field Notes Review', year: '2025', quote: 'Brassfern’s Hearthbrew work proves brand systems can feel hand-grown and ship like software.' },
  { outlet: 'Local/Motion Dispatch', year: '2025', quote: 'Their Friday-demo ritual should be mandatory across the industry.' },
  { outlet: 'Made in the Open (fictional annual)', year: '2024', quote: 'A studio that publishes its homework — checklists, evals and all.' },
]

export default function Press() {
  return (
    <>
      <Seo
        title="Press"
        description="Press kit and (fictional) mentions for Brassfern, an independent digital product studio in Sydney."
        path="/press"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Press', path: '/press' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Press</Reveal>
        <h1 className="display">In their <em>words</em></h1>
        <p className="lead lead--wide">
          Brassfern is a concept studio, so the coverage below is fictional — illustrative of the kind of work we would want to be known for. No real awards are claimed.
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
        <div className="two-col">
          <div>
            <h2 className="display h-3" style={{ marginBottom: '1rem' }}>Boilerplate</h2>
            <p className="muted" style={{ maxWidth: '56ch' }}>
              Brassfern is an independent digital product studio founded in 2014 in Surry Hills, Sydney. Forty-five designers, engineers, strategists and writers ship brands, websites, products, e-commerce, AI features and growth programs for clients across four time zones. Tagline: “Software with a heartbeat.”
            </p>
          </div>
          <div style={{ alignSelf: 'center' }}>
            <p className="mono muted" style={{ marginBottom: '0.8rem' }}>Media enquiries</p>
            <Link to="/contact" className="btn btn--ghost">Via the contact form <span className="arrow" aria-hidden>→</span></Link>
          </div>
        </div>
      </section>
    </>
  )
}
