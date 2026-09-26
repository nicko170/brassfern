import { articleIndex, caseIndex } from '../generated/content'
import { renderMarkdown, stripFrontmatter } from './markdown'
import type { ArticleMeta, CaseStudyMeta, Cluster } from './types'

/**
 * Content pipeline.
 *  - Metas come from a generated index (scripts/build-content-index.mjs) so
 *    listings stay tiny even with 600+ articles.
 *  - Bodies are lazy-loaded per file via import.meta.glob — each markdown
 *    file becomes its own chunk, fetched only when its page is opened.
 */

export const articles: ArticleMeta[] = [...articleIndex].sort((a, b) => b.date.localeCompare(a.date))
export const caseStudies: CaseStudyMeta[] = [...caseIndex].sort((a, b) => b.date.localeCompare(a.date))

// NOTE: every `tags` array in the index is already canonicalised (lowercase,
// acronyms uppercased — "SEO", "UX", "SaaS") by build-content-index.mjs.
// TagPage redirects mis-cased URLs to the canonical casing.

const bodyLoaders = import.meta.glob('../content/**/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

const bodyCache = new Map<string, string>()

function bodyPath(kind: 'article' | 'work', cluster: string | undefined, slug: string) {
  return kind === 'article'
    ? `../content/articles/${cluster}/${slug}.md`
    : `../content/work/${slug}.md`
}

/** Synchronous read for SSR/prerender (bodies are preloaded per route). */
export function getCachedBody(kind: 'article' | 'work', slug: string, cluster?: string): string | null {
  return bodyCache.get(`${kind}:${cluster ?? ''}:${slug}`) ?? null
}

export async function loadBody(kind: 'article' | 'work', slug: string, cluster?: string): Promise<string | null> {
  const key = `${kind}:${cluster ?? ''}:${slug}`
  const hit = bodyCache.get(key)
  if (hit) return hit
  const loader = bodyLoaders[bodyPath(kind, cluster, slug)]
  if (!loader) return null
  const raw = await loader()
  const html = renderMarkdown(stripFrontmatter(raw))
  bodyCache.set(key, html)
  return html
}

/* ——— lookups ——— */
export function getArticle(cluster: string, slug: string): ArticleMeta | undefined {
  return articles.find((a) => a.cluster === cluster && a.slug === slug)
}
export function getCase(slug: string): CaseStudyMeta | undefined {
  return caseStudies.find((c) => c.slug === slug)
}
export function byCluster(cluster: Cluster): ArticleMeta[] {
  return articles.filter((a) => a.cluster === cluster)
}
export function byTag(tag: string): (ArticleMeta | CaseStudyMeta)[] {
  return [...articles, ...caseStudies].filter((a) => a.tags.includes(tag))
}
export function allTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const a of [...articles, ...caseStudies]) {
    for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count)
}
export function relatedArticles(meta: ArticleMeta | CaseStudyMeta, take = 3): ArticleMeta[] {
  const pool = articles.filter((a) => a.slug !== meta.slug)
  const scored = pool.map((a) => {
    let score = 0
    if ('cluster' in meta && a.cluster === (meta as ArticleMeta).cluster) score += 2
    for (const t of a.tags) if (meta.tags.includes(t)) score += 1
    return { a, score }
  })
  return scored.sort((x, y) => y.score - x.score || y.a.date.localeCompare(x.a.date)).slice(0, take).map((s) => s.a)
}
export function relatedCases(meta: CaseStudyMeta, take = 3): CaseStudyMeta[] {
  return caseStudies
    .filter((c) => c.slug !== meta.slug)
    .map((c) => ({
      c,
      score:
        (c.industry === meta.industry ? 2 : 0) +
        c.services.filter((s) => meta.services.includes(s)).length,
    }))
    .sort((x, y) => y.score - x.score)
    .slice(0, take)
    .map((s) => s.c)
}

/* ——— search ——— */
export interface SearchHit {
  kind: 'article' | 'work'
  title: string
  description: string
  url: string
  cluster: string
  tags: string[]
  date: string
}
export function searchContent(query: string): SearchHit[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/)
  const hits: { hit: SearchHit; score: number }[] = []
  const consider = (
    kind: 'article' | 'work',
    m: ArticleMeta | CaseStudyMeta,
    url: string,
  ) => {
    const hay = `${m.title} ${m.description} ${m.tags.join(' ')} ${m.keywords.join(' ')}`.toLowerCase()
    let score = 0
    for (const t of terms) {
      if (m.title.toLowerCase().includes(t)) score += 5
      if (m.tags.some((tag) => tag.toLowerCase().includes(t))) score += 3
      if (m.description.toLowerCase().includes(t)) score += 2
      else if (hay.includes(t)) score += 1
    }
    if (terms.every((t) => hay.includes(t))) score += 4
    if (score > 0) {
      hits.push({
        hit: {
          kind,
          title: m.title,
          description: m.description,
          url,
          cluster: 'kind' in m && kind === 'work' ? 'Case study' : (m as ArticleMeta).cluster,
          tags: m.tags,
          date: m.date,
        },
        score,
      })
    }
  }
  for (const a of articles) consider('article', a, `/journal/${a.cluster}/${a.slug}`)
  for (const c of caseStudies) consider('work', c, `/work/${c.slug}`)
  return hits.sort((a, b) => b.score - a.score || b.hit.date.localeCompare(a.hit.date)).map((h) => h.hit)
}

/** Format an ISO date as "12 Mar 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
