import { useMemo, useState } from 'react'
import { Seo } from '../lib/head'
import { caseStudies } from '../lib/content'
import { WorkCard } from '../components/Cards'
import { breadcrumbLd } from '../lib/jsonld'
import Reveal from '../components/Reveal'

export default function Work() {
  const [service, setService] = useState<string>('all')
  const [industry, setIndustry] = useState<string>('all')

  const allServices = useMemo(
    () => [...new Set(caseStudies.flatMap((c) => c.services))].sort(),
    [],
  )
  const allIndustries = useMemo(
    () => [...new Set(caseStudies.map((c) => c.industry))].sort(),
    [],
  )
  const filtered = caseStudies.filter(
    (c) =>
      (service === 'all' || c.services.includes(service)) &&
      (industry === 'all' || c.industry === industry),
  )

  return (
    <>
      <Seo
        title="Work"
        description="Case studies from Brassfern: brands, websites, products and AI features shipped for (fictional) clients — with the numbers to show for it."
        path="/work"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Work', path: '/work' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Work</Reveal>
        <h1 className="display">Every project, <em>measured</em></h1>
        <p className="lead lead--wide">
          Case studies with the challenge, the approach and the outcome — including live demos you can touch. Clients are fictional; the craft is real.
        </p>
      </header>
      <section className="section container">
        <div className="filter-bar" role="group" aria-label="Filter by service" style={{ marginBottom: 'var(--space-4)' }}>
          <button className={`filter-btn${service === 'all' ? ' active' : ''}`} onClick={() => setService('all')}>All services</button>
          {allServices.map((s) => (
            <button key={s} className={`filter-btn${service === s ? ' active' : ''}`} onClick={() => setService(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="filter-bar" role="group" aria-label="Filter by industry" style={{ marginBottom: 'var(--space-7)' }}>
          <button className={`filter-btn${industry === 'all' ? ' active' : ''}`} onClick={() => setIndustry('all')}>All industries</button>
          {allIndustries.map((name) => (
            <button key={name} className={`filter-btn${industry === name ? ' active' : ''}`} onClick={() => setIndustry(name)}>
              {name}
            </button>
          ))}
        </div>
        {filtered.length > 0 ? (
          <div className="card-grid card-grid--2">
            {filtered.map((cs, i) => (
              <WorkCard key={cs.slug} cs={cs} index={i} />
            ))}
          </div>
        ) : (
          <p className="lead">No case studies match those filters yet — try widening the net.</p>
        )}
      </section>
    </>
  )
}
