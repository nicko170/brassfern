import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { allTags, articles, byTag, formatDate, getArticle, relatedArticles } from '../lib/content'
import { articleLd, breadcrumbLd } from '../lib/jsonld'
import { CLUSTER_LABELS, CLUSTERS, type Cluster } from '../lib/types'
import { personSlug } from '../data/people'
import { absoluteUrl, withBase } from '../lib/base'
import { useBody } from '../lib/useBody'
import { parseToc } from '../lib/toc'
import Markdown from '../components/Markdown'
import Crumbs from '../components/Crumbs'
import Toc from '../components/Toc'
import ReadingProgress from '../components/ReadingProgress'
import { ArticleCard } from '../components/Cards'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

export default function Article() {
  const { cluster, slug } = useParams()
  const meta = cluster && slug && CLUSTERS.includes(cluster as Cluster) ? getArticle(cluster, slug) : undefined
  const html = useBody('article', slug ?? '', cluster)
  const tocItems = useMemo(() => (html ? parseToc(html) : []), [html])
  if (!meta) return <NotFound />
  const related = relatedArticles(meta)
  const idx = articles.findIndex((a) => a.cluster === meta.cluster && a.slug === meta.slug)
  const newer = idx > 0 ? articles[idx - 1] : undefined
  const older = idx >= 0 && idx < articles.length - 1 ? articles[idx + 1] : undefined
  const showToc = tocItems.filter((t) => t.level === 2).length >= 3

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        path={`/journal/${meta.cluster}/${meta.slug}`}
        type="article"
        image={meta.heroImage ? absoluteUrl(meta.heroImage) : undefined}
        jsonLd={[
          articleLd(meta, `/journal/${meta.cluster}/${meta.slug}`),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Journal', path: '/journal' },
            { name: CLUSTER_LABELS[meta.cluster], path: `/journal/${meta.cluster}` },
            { name: meta.title, path: `/journal/${meta.cluster}/${meta.slug}` },
          ]),
        ]}
      />
      <ReadingProgress />
      <article>
        <header className="article-head container">
          <Crumbs items={[
            { name: 'Journal', path: '/journal' },
            { name: CLUSTER_LABELS[meta.cluster], path: `/journal/${meta.cluster}` },
            { name: meta.title },
          ]} />
          <Reveal className="overline">
            <Link to={`/journal/${meta.cluster}`} style={{ color: 'inherit' }}>{CLUSTER_LABELS[meta.cluster]}</Link>
          </Reveal>
          <h1 className="display">{meta.title}</h1>
          <div className="article-meta">
            <Link to={`/team/${personSlug(meta.author)}`} className="article-meta__author">{meta.author}</Link>
            <span>{formatDate(meta.date)}</span>
            <span>{meta.readingTime} min read</span>
          </div>
          {meta.heroImage && (
            <figure className="article-hero-img">
              <img src={withBase(meta.heroImage)} alt={meta.heroAlt ?? ''} />
            </figure>
          )}
        </header>
        <div className="container section--tight" style={{ marginTop: 'var(--space-6)' }}>
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
        <div className="container">
          <div className="tag-row" style={{ marginBlock: 'var(--space-5) var(--space-6)' }}>
            {meta.tags.map((t) => (
              <Link key={t} to={`/journal/tag/${encodeURIComponent(t)}`} className="tag">{t}</Link>
            ))}
          </div>
          {(newer || older) && (
            <nav className="article-nav" aria-label="More from the journal">
              {older ? (
                <Link to={`/journal/${older.cluster}/${older.slug}`} className="article-nav__item">
                  <span className="article-nav__label mono">← Older</span>
                  <span className="article-nav__title">{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {newer ? (
                <Link to={`/journal/${newer.cluster}/${newer.slug}`} className="article-nav__item article-nav__item--next">
                  <span className="article-nav__label mono">Newer →</span>
                  <span className="article-nav__title">{newer.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
        {related.length > 0 && (
          <section className="section container" style={{ paddingTop: 0 }}>
            <hr className="rule" style={{ marginBottom: 'var(--space-6)' }} />
            <Reveal className="overline">Keep reading</Reveal>
            <div className="card-grid card-grid--3" style={{ marginTop: 'var(--space-5)' }}>
              {related.map((r) => (
                <ArticleCard key={`${r.cluster}/${r.slug}`} a={r} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}

export function TagPage() {
  const { tag } = useParams()
  const decoded = tag ? decodeURIComponent(tag) : ''
  // Tags are canonicalised (case/acronyms) at index-build time. Old or
  // mis-cased URLs ("/journal/tag/ux") forward to the canonical casing so
  // there is exactly one page per tag.
  const canonical = useMemo(
    () => (decoded ? allTags().find((t) => t.tag.toLowerCase() === decoded.toLowerCase()) : undefined),
    [decoded],
  )
  if (canonical && canonical.tag !== decoded) {
    return <Navigate to={`/journal/tag/${encodeURIComponent(canonical.tag)}`} replace />
  }
  const list = byTag(decoded)
  if (!decoded || list.length === 0) return <NotFound />
  return (
    <>
      <Seo
        title={`Tagged “${decoded}”`}
        description={`All Brassfern articles and case studies tagged “${decoded}”.`}
        path={`/journal/tag/${tag}`}
      />
      <header className="article-head container">
        <Crumbs items={[
          { name: 'Journal', path: '/journal' },
          { name: 'Tags', path: '/journal' },
          { name: `#${decoded}` },
        ]} />
        <Reveal className="overline">Tag</Reveal>
        <h1 className="display">#{decoded}</h1>
        <p className="lead">{list.length} piece{list.length > 1 ? 's' : ''} filed under “{decoded}”.</p>
      </header>
      <section className="section container">
        <div className="card-grid card-grid--3">
          {list.map((item) =>
            item.cluster === 'work' ? (
              <Link key={item.slug} to={`/work/${item.slug}`} className="card">
                <span className="card__index">Case study</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ) : (
              <ArticleCard key={`${item.cluster}/${item.slug}`} a={item} />
            ),
          )}
        </div>
      </section>
    </>
  )
}
