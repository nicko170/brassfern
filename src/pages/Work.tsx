import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { caseStudies } from '../lib/content'
import { WorkCard } from '../components/Cards'
import { breadcrumbLd } from '../lib/jsonld'
import Reveal from '../components/Reveal'

/**
 * Work index. Filters sync to the URL (?service=&industry=) so views are
 * shareable and survive refresh; prerendered state is the unfiltered index.
 */
export default function Work() {
  const [params, setParams] = useSearchParams()

  const allServices = useMemo(
    () => [...new Set(caseStudies.flatMap((c) => c.services))].sort(),
    [],
  )
  const allIndustries = useMemo(
    () => [...new Set(caseStudies.map((c) => c.industry))].sort(),
    [],
  )

  const rawService = params.get('service')
  const rawIndustry = params.get('industry')
  const service = rawService && allServices.includes(rawService) ? rawService : 'all'
  const industry = rawIndustry && allIndustries.includes(rawIndustry) ? rawIndustry : 'all'
  const isFiltered = service !== 'all' || industry !== 'all'

  const setFilter = (key: 'service' | 'industry', value: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === 'all') next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  // Counts respect the *other* active facet, so numbers stay truthful.
  const serviceCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of caseStudies) {
      if (industry !== 'all' && c.industry !== industry) continue
      for (const s of c.services) m.set(s, (m.get(s) ?? 0) + 1)
    }
    return m
  }, [industry])
  const industryCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of caseStudies) {
      if (service !== 'all' && !c.services.includes(service)) continue
      m.set(c.industry, (m.get(c.industry) ?? 0) + 1)
    }
    return m
  }, [service])

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
          <button
            className={`filter-btn${service === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('service', 'all')}
            aria-pressed={service === 'all'}
          >
            All services
          </button>
          {allServices.map((s) => (
            <button
              key={s}
              className={`filter-btn${service === s ? ' active' : ''}`}
              onClick={() => setFilter('service', s)}
              aria-pressed={service === s}
            >
              {s}
              <span className="filter-btn__count">{serviceCounts.get(s) ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="filter-bar" role="group" aria-label="Filter by industry" style={{ marginBottom: 'var(--space-6)' }}>
          <button
            className={`filter-btn${industry === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('industry', 'all')}
            aria-pressed={industry === 'all'}
          >
            All industries
          </button>
          {allIndustries.map((name) => (
            <button
              key={name}
              className={`filter-btn${industry === name ? ' active' : ''}`}
              onClick={() => setFilter('industry', name)}
              aria-pressed={industry === name}
            >
              {name}
              <span className="filter-btn__count">{industryCounts.get(name) ?? 0}</span>
            </button>
          ))}
        </div>

        <p className="mono muted filter-status" role="status" aria-live="polite">
          Showing {filtered.length} of {caseStudies.length} case studies
          {isFiltered && (
            <>
              {' — '}
              <button
                className="filter-status__reset"
                onClick={() => setParams({}, { replace: true })}
              >
                Reset filters
              </button>
            </>
          )}
        </p>

        {filtered.length > 0 ? (
          <div className="card-grid card-grid--2">
            {filtered.map((cs, i) => (
              <WorkCard key={cs.slug} cs={cs} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-note">
            <p className="lead">Nothing in the folio matches that combination — yet.</p>
            <p className="muted">
              Try widening the net, or{' '}
              <button className="filter-status__reset" onClick={() => setParams({}, { replace: true })}>
                reset both filters
              </button>
              {' '}to see everything.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
