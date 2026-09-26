import { useEffect, useState } from 'react'
import { getCachedBody, loadBody } from './content'

/**
 * Loads a markdown body (article or case study), returning rendered HTML or
 * null while loading. During prerender the body is preloaded into the
 * synchronous cache (see lib/preload), so SSR output contains full HTML.
 */
export function useBody(kind: 'article' | 'work', slug: string, cluster?: string): string | null {
  const [html, setHtml] = useState<string | null>(() => getCachedBody(kind, slug, cluster))

  useEffect(() => {
    let alive = true
    const cached = getCachedBody(kind, slug, cluster)
    if (cached) {
      setHtml(cached)
      return
    }
    setHtml(null)
    loadBody(kind, slug, cluster).then((h) => {
      if (alive) setHtml(h)
    })
    return () => {
      alive = false
    }
  }, [kind, slug, cluster])

  return html
}
