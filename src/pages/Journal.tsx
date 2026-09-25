import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { articles, byCluster } from '../lib/content'
import { CLUSTER_LABELS, CLUSTERS, type Cluster } from '../lib/types'
import { ArticleCard } from '../components/Cards'
import { breadcrumbLd } from '../lib/jsonld'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

const PAGE_SIZE = 12

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

function ClusterNav({ active }: { active?: string }) {
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
    </nav>
  )
}

export function JournalIndex() {
  const [page, setPage] = useState(1)
  const pages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE))
  const shown = useMemo(() => articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [page])

  return (
    <>
      <Seo
        title="Journal"
        description="Essays and field notes from the Brassfern studio: web design, engineering, product, brand, growth, AI, e-commerce and playbooks."
        path="/journal"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Journal', path: '/journal' }])]}
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
        {shown.length > 0 ? (
          <div className="card-grid card-grid--3">
            {shown.map((a) => (
              <ArticleCard key={`${a.cluster}/${a.slug}`} a={a} />
            ))}
          </div>
        ) : (
          <p className="lead">The first essays are in the press. Check back shortly.</p>
        )}
        {pages > 1 && (
          <nav className="pagination" aria-label="Pagination" style={{ marginTop: 'var(--space-7)' }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) =>
              p === page ? (
                <span key={p} className="current" aria-current="page">{p}</span>
              ) : (
                <a key={p} href="#top" onClick={(e) => { e.preventDefault(); setPage(p); window.scrollTo({ top: 0 }) }}>
                  {p}
                </a>
              ),
            )}
          </nav>
        )}
      </section>
    </>
  )
}

export function JournalCluster() {
  const { cluster } = useParams()
  const [page, setPage] = useState(1)
  if (!cluster || !CLUSTERS.includes(cluster as Cluster)) return <NotFound />
  const list = byCluster(cluster as Cluster)
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const shown = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <Seo
        title={`${CLUSTER_LABELS[cluster as Cluster]} — Journal`}
        description={CLUSTER_INTROS[cluster as Cluster]}
        path={`/journal/${cluster}`}
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Journal', path: '/journal' }, { name: CLUSTER_LABELS[cluster as Cluster], path: `/journal/${cluster}` }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Journal — {CLUSTER_LABELS[cluster as Cluster]}</Reveal>
        <h1 className="display">{CLUSTER_LABELS[cluster as Cluster]}</h1>
        <p className="lead lead--wide">{CLUSTER_INTROS[cluster as Cluster]}</p>
      </header>
      <section className="section container">
        <ClusterNav active={cluster} />
        {shown.length > 0 ? (
          <div className="card-grid card-grid--3">
            {shown.map((a) => (
              <ArticleCard key={`${a.cluster}/${a.slug}`} a={a} />
            ))}
          </div>
        ) : (
          <p className="lead">Nothing published in this cluster yet — the drafts are steeping.</p>
        )}
        {pages > 1 && (
          <nav className="pagination" aria-label="Pagination" style={{ marginTop: 'var(--space-7)' }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) =>
              p === page ? (
                <span key={p} className="current" aria-current="page">{p}</span>
              ) : (
                <a key={p} href="#top" onClick={(e) => { e.preventDefault(); setPage(p); window.scrollTo({ top: 0 }) }}>
                  {p}
                </a>
              ),
            )}
          </nav>
        )}
      </section>
    </>
  )
}

export const Journal = JournalIndex
