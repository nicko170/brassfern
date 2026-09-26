import { Link, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { getIndustry, industries } from '../data/industries'
import { caseStudies } from '../lib/content'
import { WorkCard } from '../components/Cards'
import { breadcrumbLd } from '../lib/jsonld'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

export function IndustriesIndex() {
  return (
    <>
      <Seo
        title="Industries"
        description="Fintech, health, retail, hospitality, climate, education, media, SaaS and non-profit — the sectors Brassfern knows from the inside."
        path="/industries"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Industries</Reveal>
        <h1 className="display">Sectors we know <em>from the inside</em></h1>
        <p className="lead lead--wide">Domain fluency shortens every project. These are the industries where we have shipped, stumbled and learned the lessons already.</p>
      </header>
      <section className="section container">
        <div className="rows">
          {industries.map((ind, i) => (
            <Link to={`/industries/${ind.slug}`} className="row-link" key={ind.slug}>
              <span className="row-link__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{ind.name}</h3>
              <span className="row-link__arrow" aria-hidden>→</span>
              <p>{ind.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export function IndustryPage() {
  const { slug } = useParams()
  const industry = slug ? getIndustry(slug) : undefined
  if (!industry) return <NotFound />
  // Exact canonical-industry match first (case studies use the names from
  // src/data/industries.ts); tolerant substring fallback for future drift.
  const exact = caseStudies.filter((c) => c.industry === industry.name)
  const related = (exact.length > 0
    ? exact
    : caseStudies.filter((c) => c.industry.toLowerCase().includes(industry.name.split(' ')[0].toLowerCase()))
  ).slice(0, 3)
  return (
    <>
      <Seo
        title={industry.name}
        description={industry.blurb}
        path={`/industries/${industry.slug}`}
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries' }, { name: industry.name, path: `/industries/${industry.slug}` }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Industry</Reveal>
        <h1 className="display">{industry.name}</h1>
        <p className="lead lead--wide">{industry.blurb}</p>
      </header>
      <section className="section container">
        <div className="two-col">
          <div>
            <h2 className="mono muted" style={{ marginBottom: '1rem' }}>Where we focus</h2>
            <ul className="fact-list">
              {industry.focus.map((f) => (
                <li key={f}><span>Focus</span><span>{f}</span></li>
              ))}
            </ul>
          </div>
          <div className="night" style={{ borderRadius: 'var(--radius)', padding: 'clamp(1.5rem,4vw,2.5rem)' }}>
            <h2 className="display h-3">Building in {industry.name.toLowerCase()}?</h2>
            <p style={{ color: 'var(--night-mute)', marginBlock: '1rem 1.5rem' }}>
              Tell us the constraint — regulation, legacy stack, impossible deadline. We have probably met it before.
            </p>
            <Link to="/contact" className="btn btn--brass">Start a project <span className="arrow" aria-hidden>→</span></Link>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section container" style={{ paddingTop: 0 }}>
          <Reveal className="overline">Work in {industry.name.toLowerCase()}</Reveal>
          <div className="card-grid card-grid--3" style={{ marginTop: 'var(--space-5)' }}>
            {related.map((cs) => (
              <WorkCard key={cs.slug} cs={cs} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
