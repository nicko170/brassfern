import { useEffect } from 'react'
import { BASE } from './base'
import { getArticle, getCase, loadBody } from './content'

/**
 * Intent-based prefetching. Hovering or keyboard-focusing any internal link
 * warms the destination's page chunk AND (for articles / case studies) its
 * markdown body, so the tap that follows is effectively instant. Delegated
 * listeners on the document — zero per-link code, works inside demos' chrome
 * and the quick-find palette alike. Skipped entirely on save-data connections.
 * Every path is warmed at most once per session.
 */

const PAGE_CHUNKS: [RegExp, () => Promise<unknown>][] = [
  [/^\/$/, () => import('../pages/Home')],
  [/^\/work$/, () => import('../pages/Work')],
  [/^\/work\//, () => import('../pages/WorkCase')],
  [/^\/lab(\/|$)/, () => import('../pages/Lab')],
  [/^\/services(\/|$)/, () => import('../pages/Services')],
  [/^\/industries(\/|$)/, () => import('../pages/Industries')],
  [/^\/approach(\/|$)/, () => import('../pages/Approach')],
  [/^\/pricing(\/|$)/, () => import('../pages/Pricing')],
  [/^\/studio(\/|$)/, () => import('../pages/Studio')],
  [/^\/team(\/|$)/, () => import('../pages/Team')],
  [/^\/careers(\/|$)/, () => import('../pages/Careers')],
  // Journal covers hubs, pagination, tags and articles (two chunks).
  [/^\/journal(\/|$)/, () => Promise.all([import('../pages/Journal'), import('../pages/Article')])],
  [/^\/search(\/|$)/, () => import('../pages/Search')],
  [/^\/resources(\/|$)/, () => import('../pages/Resources')],
  [/^\/contact(\/|$)/, () => import('../pages/Contact')],
  [/^\/press(\/|$)/, () => import('../pages/Press')],
  [/^\/legal(\/|$)/, () => import('../pages/Legal')],
]

const warmed = new Set<string>()

function stripBase(pathname: string): string {
  let path = pathname
  if (BASE !== '/' && path.startsWith(BASE)) path = `/${path.slice(BASE.length)}`
  path = path.split(/[?#]/)[0].replace(/\/+$/, '')
  return path || '/'
}

export function prefetchForPath(pathname: string): void {
  const path = stripBase(pathname)
  if (warmed.has(path)) return
  warmed.add(path)

  // Article bodies: warm only when the meta exists (avoids 404 chunk hunts).
  const article = path.match(/^\/journal\/([^/]+)\/([^/]+)$/)
  if (article && article[1] !== 'tag' && article[1] !== 'page') {
    if (getArticle(article[1], article[2])) void loadBody('article', article[2], article[1])
  }
  const work = path.match(/^\/work\/([^/]+)$/)
  if (work && getCase(work[1])) void loadBody('work', work[1])

  for (const [pattern, load] of PAGE_CHUNKS) {
    if (pattern.test(path)) {
      void load().catch(() => warmed.delete(path)) // allow retry after a flaky fetch
      break
    }
  }
}

/**
 * Delegated pointerover/focusin listeners. focusin covers keyboard users
 * tabbing through links — they get the same instant navigation.
 */
export function useIntentPrefetch(): void {
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) return

    const onIntent = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.('a[href]')
      if (!el) return
      const href = el.getAttribute('href') ?? ''
      if (!href.startsWith('/')) return
      prefetchForPath(href)
    }

    document.addEventListener('pointerover', onIntent, { passive: true })
    document.addEventListener('focusin', onIntent, { passive: true })
    return () => {
      document.removeEventListener('pointerover', onIntent)
      document.removeEventListener('focusin', onIntent)
    }
  }, [])
}
