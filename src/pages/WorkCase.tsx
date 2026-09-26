import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { formatDate, getCase, relatedCases } from '../lib/content'
import { getDemo } from '../lib/demos'
import { breadcrumbLd, creativeWorkLd } from '../lib/jsonld'
import { personSlug } from '../data/people'
import { testimonials } from '../data/clients'
import { squadFor } from '../lib/squad'
import { workImages } from '../generated/content'
import { absoluteUrl, withBase } from '../lib/base'
import { useBody } from '../lib/useBody'
import { parseToc } from '../lib/toc'
import Markdown from '../components/Markdown'
import Toc from '../components/Toc'
import ReadingProgress from '../components/ReadingProgress'
import Portrait from '../components/Portrait'
import { WorkCard } from '../components/Cards'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

export default function WorkCase() {
  const { slug } = useParams()
  const cs = slug ? getCase(slug) : undefined
  const html = useBody('work', slug ?? '')
  const tocItems = useMemo(() => (html ? parseToc(html) : []), [html])
  if (!cs) return <NotFound />
  const demo = cs.demo ? getDemo(cs.demo) : undefined
  const related = relatedCases(cs)
  const quote = testimonials.find((t) => t.caseStudy === cs.slug)
  const squad = squadFor(cs)
  const demoImg = demo && workImages.includes(demo.slug) ? `/images/work/${demo.slug}.jpg` : undefined
  const showToc = tocItems.filter((t) => t.level === 2).length >= 3

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
      <ReadingProgress />
      <article>
        <header className="article-head container">
          <Reveal className="overline">Case study — {cs.client}</Reveal>
          <h1 className="display">{cs.title}</h1>
          <div className="article-meta">
            <span>{cs.industry}</span>
            <span>{cs.year}</span>
            <span>{formatDate(cs.date)}</span>
            <span>{cs.readingTime} min read</span>
            <Link to={`/team/${personSlug(cs.author)}`} className="article-meta__author">Words by {cs.author}</Link>
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
            <Link to={`/lab/${demo.slug}`} className="demo-strip">
              <span className="demo-strip__copy">
                <span className="overline overline--night">Touch the work — live demo</span>
                <span className="demo-strip__title">{demo.title}</span>
                <span className="demo-strip__meta">
                  {demo.client} · {demo.tags.slice(0, 3).join(' · ')}
                </span>
              </span>
              <span className="demo-strip__art" aria-hidden>
                <span>{demo.client.slice(0, 2).toUpperCase()}</span>
              </span>
              <span className="demo-strip__cta">
                Open the demo <span className="arrow" aria-hidden>→</span>
              </span>
            </Link>
            <p className="mono muted" style={{ marginTop: 'var(--space-3)', fontSize: 'var(--fs-micro)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              This case study ships with a working mini-product — mocked data, real craft.
            </p>
          </div>
        )}

        <div className="container section--tight" style={{ marginTop: 'var(--space-5)' }}>
          {showToc ? (
            <div className="article-layout">
              <div className="article-layout__main">
                <Markdown html={html} />
              </div>
              <aside className="article-layout__aside">
                <Toc items={tocItems} />
              </aside>
            </div>
          ) : (
            <Markdown html={html} />
          )}
        </div>

        {quote && (
          <section className="container" aria-label="Client testimonial">
            <figure className="case-quote">
              <blockquote>“{quote.quote}”</blockquote>
              <figcaption className="mono">
                {quote.name} · {quote.title}, {quote.company}
              </figcaption>
            </figure>
          </section>
        )}

        <section className="container" aria-label="The squad">
          <div className="squad">
            <span className="squad__label overline" style={{ margin: 0 }}>The squad</span>
            <ul className="squad__list">
              {squad.map((p) => (
                <li key={p.name}>
                  <Link to={`/team/${personSlug(p.name)}`} className="squad__person">
                    <span className="squad__portrait" aria-hidden>
                      <Portrait person={p} />
                    </span>
                    <span className="squad__name">{p.name}</span>
                    <span className="squad__role mono">{p.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {cs.heroImage && demoImg && (
          <section className="container" aria-label="Project gallery">
            <div className="case-gallery">
              <figure className="case-gallery__item">
                <img src={withBase(cs.heroImage)} alt="" loading="lazy" />
                <figcaption className="mono">The project, as the studio likes to remember it</figcaption>
              </figure>
              <figure className="case-gallery__item">
                <img src={withBase(demoImg)} alt="" loading="lazy" />
                <figcaption className="mono">The live demo — running now in the <Link to={`/lab/${demo!.slug}`}>Lab</Link></figcaption>
              </figure>
            </div>
          </section>
        )}

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
