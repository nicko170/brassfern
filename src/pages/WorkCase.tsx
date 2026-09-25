import { Link, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { formatDate, getCase, relatedCases } from '../lib/content'
import { getDemo } from '../lib/demos'
import { breadcrumbLd, creativeWorkLd } from '../lib/jsonld'
import { absoluteUrl, withBase } from '../lib/base'
import Markdown from '../components/Markdown'
import { WorkCard } from '../components/Cards'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

export default function WorkCase() {
  const { slug } = useParams()
  const cs = slug ? getCase(slug) : undefined
  if (!cs) return <NotFound />
  const demo = cs.demo ? getDemo(cs.demo) : undefined
  const related = relatedCases(cs)

  return (
    <>
      <Seo
        title={`${cs.title} — ${cs.client}`}
        description={cs.description}
        path={`/work/${cs.slug}`}
        type="article"
        image={cs.heroImage ? absoluteUrl(cs.heroImage) : undefined}
        jsonLd={[
          creativeWorkLd(cs),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: cs.title, path: `/work/${cs.slug}` },
          ]),
        ]}
      />
      <article>
        <header className="article-head container">
          <Reveal className="overline">Case study — {cs.client}</Reveal>
          <h1 className="display">{cs.title}</h1>
          <div className="article-meta">
            <span>{cs.industry}</span>
            <span>{cs.year}</span>
            <span>{formatDate(cs.date)}</span>
            <span>{cs.readingTime} min read</span>
          </div>
          <div className="tag-row" style={{ marginTop: 'var(--space-4)' }}>
            {cs.services.map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
            {cs.stack.map((s) => (
              <span key={s} className="tag" style={{ borderStyle: 'dashed' }}>{s}</span>
            ))}
          </div>
        </header>

        {cs.heroImage && (
          <div className="container">
            <figure className="article-hero-img">
              <img src={withBase(cs.heroImage)} alt={cs.heroAlt ?? ''} />
            </figure>
          </div>
        )}

        {demo && (
          <div className="container" style={{ marginTop: 'var(--space-6)' }}>
            <Link
              to={`/lab/${demo.slug}`}
              className="btn btn--brass"
            >
              Try the live demo: {demo.title} <span className="arrow" aria-hidden>→</span>
            </Link>
          </div>
        )}

        <div className="container section--tight" style={{ marginTop: 'var(--space-5)' }}>
          <Markdown kind="work" slug={cs.slug} />
        </div>

        {related.length > 0 && (
          <section className="section container">
            <hr className="rule" style={{ marginBottom: 'var(--space-6)' }} />
            <Reveal className="overline">More work</Reveal>
            <div className="card-grid card-grid--3" style={{ marginTop: 'var(--space-5)' }}>
              {related.map((r) => (
                <WorkCard key={r.slug} cs={r} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
