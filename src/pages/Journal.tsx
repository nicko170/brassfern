import { Link, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { articles, byCluster, allTags } from '../lib/content'
import { CLUSTER_LABELS, CLUSTERS, type Cluster } from '../lib/types'
import { JOURNAL_PAGE_SIZE, journalPages, pageHref, pageWindow, restCountFor } from '../lib/paginate'
import { ArticleCard, ArticleFeature } from '../components/Cards'
import { breadcrumbLd } from '../lib/jsonld'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

/** Lead story = latest piece with hero art, else simply the latest. */
function pickFeatured<T extends { heroImage?: string }>(list: T[]): T | undefined {
  return list.find((a) => a.heroImage) ?? list[0]
}

const CLUSTER_INTROS: Record<Cluster, string> = {
  'web-design': 'Type, grids, motion and the thousand small decisions that make a page feel inevitable — written by the designers who sweat them.',
  engineering: 'Performance budgets, rendering trade-offs and the boring, load-bearing code that lets everything else be interesting.',
  product: 'Dashboards, onboarding, research rituals and the features we deleted. Notes from the product room.',
  brand: 'Naming, voice, identity systems — and what actually happened after the guidelines shipped.',
  growth: 'SEO, CRO, lifecycle and attribution, reported in revenue. Never in vibes.',
  ai: 'Shipping LLM features that survive contact with real users: evals, agents, retrieval and restraint.',
  ecommerce: 'Storefronts, PDPs, subscriptions and the sacred art of the frictionless checkout.',
  playbooks: 'Briefs, budgets, discovery sprints and handovers — how to buy, and run, agency work well.',
}

function clusterCount(c: Cluster) {
  return byCluster(c).length
}

export function ClusterNav({ active }: { active?: string }) {
  return (
    <nav className="filter-bar" aria-label="Journal clusters" style={{ marginBottom: 'var(--space-6)' }}>
      <Link to="/journal" className={`filter-btn${!active ? ' active' : ''}`} style={{ textDecoration: 'none' }}>
        All <span className="filter-btn__count">{articles.length}</span>
      </Link>
      {CLUSTERS.map((c) => (
        <Link key={c} to={`/journal/${c}`} className={`filter-btn${active === c ? ' active' : ''}`} style={{ textDecoration: 'none' }}>
          {CLUSTER_LABELS[c]} <span className="filter-btn__count">{clusterCount(c)}</span>
        </Link>
      ))}
      <Link to="/journal/tags" className={`filter-btn${active === 'tags' ? ' active' : ''}`} style={{ textDecoration: 'none' }}>
        Tags <span className="filter-btn__count">{allTags().length}</span>
      </Link>
    </nav>
  )
}

/** Route-driven pagination: real links, so every page is crawlable and works without JS. */
function Pagination({ base, page, pages }: { base: string; page: number; pages: number }) {
  if (pages <= 1) return null
  return (
    <nav className="pagination" aria-label="Journal pages" style={{ marginTop: 'var(--space-7)' }}>
      {page > 1 && (
        <Link to={pageHref(base, page - 1)} rel="prev" aria-label="Newer articles" title="Newer articles">
          ←
        </Link>
      )}
      {pageWindow(page, pages).map((n, i) =>
        n === '…' ? (
          <span key={`gap-${i}`} className="pagination__gap" aria-hidden="true">…</span>
        ) : n === page ? (
          <span key={n} className="current" aria-current="page">{n}</span>
        ) : (
          <Link key={n} to={pageHref(base, n)} aria-label={`Page ${n}`}>
            {n}
          </Link>
        ),
      )}
      {page < pages && (
        <Link to={pageHref(base, page + 1)} rel="next" aria-label="Older articles" title="Older articles">
          →
        </Link>
      )}
    </nav>
  )
}

/** Parses the optional /page/:n param; null means the URL is not a valid page. */
function usePageParam(restCount: number): number | null {
  const { page: raw } = useParams()
  if (raw === undefined) return 1
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 2 || n > journalPages(restCount)) return null
  return n
}

export function JournalIndex() {
  const featured = pickFeatured(articles)
  const rest = featured ? articles.filter((a) => a !== featured) : articles
  const pages = journalPages(rest.length)
  const page = usePageParam(rest.length)
  if (page === null) return <NotFound />
  const shown = rest.slice((page - 1) * JOURNAL_PAGE_SIZE, page * JOURNAL_PAGE_SIZE)

  return (
    <>
      <Seo
        title={page === 1 ? 'Journal' : `Journal — page ${page} of ${pages}`}
        description="Essays and field notes from the Brassfern studio: web design, engineering, product, brand, growth, AI, e-commerce and playbooks."
        path={pageHref('/journal', page)}
        jsonLd={[breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/journal' },
          ...(page > 1 ? [{ name: `Page ${page}`, path: pageHref('/journal', page) }] : []),
        ])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Journal</Reveal>
        <h1 className="display">Thinking, <em>in public</em></h1>
        <p className="lead lead--wide">
          Field notes on design, engineering and growth — written by the people who ship the work. No thought leadership, just lessons with receipts.
        </p>
      </header>
      <section className="section container">
        <ClusterNav />
        {featured && page === 1 && <ArticleFeature a={featured} label="The latest big read" />}
        {shown.length > 0 ? (
          <div className="card-grid card-grid--3">
            {shown.map((a) => (
              <ArticleCard key={`${a.cluster}/${a.slug}`} a={a} />
            ))}
          </div>
        ) : (
          <p className="lead">The first essays are in the press. Check back shortly.</p>
        )}
        <Pagination base="/journal" page={page} pages={pages} />
      </section>
    </>
  )
}

export function JournalCluster() {
  const { cluster } = useParams()
  const valid = cluster && CLUSTERS.includes(cluster as Cluster)
  const list = valid ? byCluster(cluster as Cluster) : []
  const featured = pickFeatured(list)
  const rest = featured ? list.filter((a) => a !== featured) : list
  const pages = journalPages(rest.length)
  const page = usePageParam(rest.length)
  if (!valid || page === null) return <NotFound />
  const label = CLUSTER_LABELS[cluster as Cluster]
  const shown = rest.slice((page - 1) * JOURNAL_PAGE_SIZE, page * JOURNAL_PAGE_SIZE)

  return (
    <>
      <Seo
        title={page === 1 ? `${label} — Journal` : `${label} — Journal, page ${page} of ${pages}`}
        description={CLUSTER_INTROS[cluster as Cluster]}
        path={pageHref(`/journal/${cluster}`, page)}
        jsonLd={[breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/journal' },
          { name: label, path: `/journal/${cluster}` },
          ...(page > 1 ? [{ name: `Page ${page}`, path: pageHref(`/journal/${cluster}`, page) }] : []),
        ])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Journal — {label}</Reveal>
        <h1 className="display">{label}</h1>
        <p className="lead lead--wide">{CLUSTER_INTROS[cluster as Cluster]}</p>
      </header>
      <section className="section container">
        <ClusterNav active={cluster} />
        {featured && page === 1 && (
          <ArticleFeature a={featured} label={`The ${label.toLowerCase()} big read`} />
        )}
        {shown.length > 0 ? (
          <div className="card-grid card-grid--3">
            {shown.map((a) => (
              <ArticleCard key={`${a.cluster}/${a.slug}`} a={a} />
            ))}
          </div>
        ) : !featured ? (
          <p className="lead">Nothing published in this cluster yet — the drafts are steeping.</p>
        ) : null}
        <Pagination base={`/journal/${cluster}`} page={page} pages={pages} />
      </section>
    </>
  )
}

export const Journal = JournalIndex
