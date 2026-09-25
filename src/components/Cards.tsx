import { Link } from 'react-router-dom'
import { formatDate } from '../lib/content'
import { withBase } from '../lib/base'
import { CLUSTER_LABELS, type ArticleMeta, type CaseStudyMeta, type Cluster } from '../lib/types'
import type { DemoEntry } from '../lib/demos'

/**
 * Until a case study has generated hero art, its card shows a distinctive
 * CSS-only composition derived from its name — never a grey placeholder.
 * Palettes are deterministic per slug.
 */
const ART_THEMES = [
  { bg: '#1e4d33', fg: '#e6cc8a' },
  { bg: '#182116', fg: '#c9a84c' },
  { bg: '#b4552d', fg: '#f5efdf' },
  { bg: '#2f6a48', fg: '#ece3cc' },
  { bg: '#3d4736', fg: '#e6cc8a' },
]

function themeFor(slug: string) {
  let n = 0
  for (const ch of slug) n = (n * 31 + ch.charCodeAt(0)) >>> 0
  return ART_THEMES[n % ART_THEMES.length]
}

function initials(name: string) {
  return name
    .split(/\s|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function WorkCard({ cs, index }: { cs: CaseStudyMeta; index?: number }) {
  const theme = themeFor(cs.slug)
  return (
    <Link to={`/work/${cs.slug}`} className="card">
      <div className="card__media">
        {cs.heroImage ? (
          <img src={withBase(cs.heroImage)} alt={cs.heroAlt ?? ''} loading="lazy" />
        ) : (
          <div className="card__hover-art" style={{ background: theme.bg, color: theme.fg }} aria-hidden="true">
            {initials(cs.client)}
          </div>
        )}
      </div>
      <span className="card__index">
        {typeof index === 'number' ? `${String(index + 1).padStart(2, '0')} — ` : ''}
        {cs.client} · {cs.year}
      </span>
      <h3>{cs.title}</h3>
      <p>{cs.description}</p>
      <div className="tag-row">
        {cs.services.slice(0, 3).map((s) => (
          <span key={s} className="tag">{s}</span>
        ))}
      </div>
    </Link>
  )
}

export function ArticleCard({ a, index }: { a: ArticleMeta; index?: number }) {
  return (
    <Link to={`/journal/${a.cluster}/${a.slug}`} className="card">
      <span className="card__index">
        {typeof index === 'number' ? `${String(index + 1).padStart(2, '0')} — ` : ''}
        {CLUSTER_LABELS[a.cluster as Cluster] ?? a.cluster} · {formatDate(a.date)} · {a.readingTime} min
      </span>
      <h3>{a.title}</h3>
      <p>{a.description}</p>
      <div className="tag-row">
        {a.tags.slice(0, 3).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
    </Link>
  )
}

export function DemoCard({ d }: { d: DemoEntry }) {
  const theme = themeFor(d.slug)
  return (
    <Link to={`/lab/${d.slug}`} className="card">
      <div className="card__media">
        <div
          className="card__hover-art"
          style={{ background: `linear-gradient(135deg, ${theme.bg}, #182116)`, color: theme.fg }}
          aria-hidden="true"
        >
          {initials(d.client)}
        </div>
      </div>
      <span className="card__index">{d.client}</span>
      <h3>{d.title}</h3>
      <p>{d.description}</p>
      <div className="tag-row">
        {d.tags.slice(0, 3).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
    </Link>
  )
}
