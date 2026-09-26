import { Link, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { getService, services } from '../data/services'
import { breadcrumbLd, faqLd } from '../lib/jsonld'
import { caseStudies } from '../lib/content'
import { WorkCard } from '../components/Cards'
import Crumbs from '../components/Crumbs'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

export function ServicesIndex() {
  return (
    <>
      <Seo
        title="Services"
        description="Brand & identity, websites, product design & engineering, e-commerce, AI products and growth — six crafts, one senior squad."
        path="/services"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Services</Reveal>
        <h1 className="display">Six crafts, <em>one squad</em></h1>
        <p className="lead lead--wide">
          Every engagement is the same shape: a small senior team, fixed scope, weekly demos. What changes is the craft we point at your problem.
        </p>
      </header>
      <section className="section container">
        <div className="rows">
          {services.map((s) => (
            <Link to={`/services/${s.slug}`} className="row-link" key={s.slug}>
              <span className="row-link__num">{s.num}</span>
              <h3>{s.name}</h3>
              <span className="row-link__arrow" aria-hidden>→</span>
              <p>{s.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export function ServicePage() {
  const { slug } = useParams()
  const service = slug ? getService(slug) : undefined
  if (!service) return <NotFound />
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  const key = norm(service.name)
  const related = caseStudies.filter((c) =>
    c.services.some((s) => {
      const v = norm(s)
      return v.includes(key) || key.includes(v)
    }),
  ).slice(0, 3)

  return (
    <>
      <Seo
        title={service.name}
        description={service.tagline}
        path={`/services/${service.slug}`}
        jsonLd={[
          faqLd(service.faqs),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
        ]}
      />
      <header className="article-head container">
        <Crumbs items={[
          { name: 'Services', path: '/services' },
          { name: service.name },
        ]} />
        <Reveal className="overline">Service {service.num}</Reveal>
        <h1 className="display">{service.name}</h1>
        <p className="lead lead--wide">{service.tagline}</p>
      </header>

      <section className="section--tight container">
        <div className="two-col two-col--wide-left">
          <div>
            <h2 className="display h-3" style={{ marginBottom: '1rem' }}>The short version</h2>
            <p className="lead" style={{ maxWidth: '56ch' }}>{service.description}</p>
          </div>
          <div>
            <h2 className="mono muted" style={{ marginBottom: '1rem' }}>Deliverables</h2>
            <ul className="fact-list">
              {service.deliverables.map((d) => (
                <li key={d}><span>Item</span><span>{d}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section container">
        <Reveal className="overline">Process</Reveal>
        <h2 className="display h-2" style={{ marginBlock: '1rem 2.5rem' }}>How a {service.name.toLowerCase()} engagement runs</h2>
        <div className="pov-grid" style={{ color: 'inherit' }}>
          {service.process.map((p, i) => (
            <Reveal key={p.title} delay={i * 90} className="pov-item" style={{ borderTopColor: 'var(--line-strong)' }}>
              <span className="card__index">0{i + 1}</span>
              <h3 style={{ color: 'inherit' }}>{p.title}</h3>
              <p style={{ color: 'var(--ink-2)' }}>{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <Reveal className="overline">FAQ</Reveal>
        <div style={{ marginTop: 'var(--space-5)', maxWidth: '46rem' }}>
          {service.faqs.map((f) => (
            <details key={f.q} style={{ borderBottom: '1px solid var(--line)', paddingBlock: '1.1rem' }}>
              <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 500 }}>
                {f.q}
              </summary>
              <p className="muted" style={{ marginTop: '0.8rem', maxWidth: '56ch' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section container" style={{ paddingTop: 0 }}>
          <Reveal className="overline">Related work</Reveal>
          <div className="card-grid card-grid--3" style={{ marginTop: 'var(--space-5)' }}>
            {related.map((cs) => (
              <WorkCard key={cs.slug} cs={cs} />
            ))}
          </div>
        </section>
      )}

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="night" style={{ borderRadius: 'var(--radius)', padding: 'clamp(2rem,6vw,4rem)' }}>
          <h2 className="display h-3" style={{ maxWidth: '18ch' }}>
            Bring us the problem. We will bring the <em>squad.</em>
          </h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn--brass">Start a project <span className="arrow" aria-hidden>→</span></Link>
            <Link to="/pricing" className="btn btn--ghost" style={{ color: 'var(--night-text)', borderColor: 'var(--night-line)' }}>Pricing</Link>
          </div>
        </div>
      </section>
    </>
  )
}
