import { useEffect, useState } from 'react'
import { getCachedBody, loadBody } from '../lib/content'

/**
 * Renders a markdown body. During prerender the body is preloaded into the
 * synchronous cache (see lib/preload), so SSR output contains the full HTML.
 * On the client it fetches the per-article chunk on demand.
 */
export default function Markdown({
  kind,
  slug,
  cluster,
}: {
  kind: 'article' | 'work'
  slug: string
  cluster?: string
}) {
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

  if (html === null) {
    return (
      <div className="skel" aria-label="Loading article">
        <span /><span /><span /><span /><span /><span />
      </div>
    )
  }
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
}
