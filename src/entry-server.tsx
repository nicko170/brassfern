import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App, { preloadAllPages } from './App'
import { createCollector, type HeadState } from './lib/head'
import { preloadForUrl } from './lib/preload'
import { articles, caseStudies, allTags, byCluster } from './lib/content'
import { journalPages, restCountFor } from './lib/paginate'
import { ROUTER_BASE } from './lib/base'
import { demos } from './lib/demos'
import { services } from './data/services'
import { industries } from './data/industries'
import { jobs } from './data/jobs'
import { personSlug, team } from './data/people'
import { CLUSTERS } from './lib/types'

export { headToHtml, type HeadState } from './lib/head'
export { absoluteUrl, BASE, SITE_URL } from './lib/base'
export { articles, caseStudies }

export async function render(url: string): Promise<{ html: string; head: HeadState }> {
  // Warm every page chunk so lazy boundaries resolve synchronously in renderToString.
  await preloadAllPages()
  await preloadForUrl(url)
  const collector = createCollector()
  // Give the StaticRouter the full path INCLUDING the base (and declare the
  // basename) — otherwise every <Link> href in the prerendered HTML lacks the
  // BASE_PATH prefix and is dead for crawlers / no-JS visitors on sub-path
  // deploys. Locally ROUTER_BASE is '/' and this is a no-op.
  const base = ROUTER_BASE === '/' ? '' : ROUTER_BASE
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={base + url} basename={base || '/'}>
        <App head={collector} />
      </StaticRouter>
    </StrictMode>,
  )
  return { html, head: collector.state }
}

/** Every route that must exist as a static HTML file after build. */
export function prerenderRoutes(): string[] {
  const routes = new Set<string>([
    '/',
    '/work',
    '/lab',
    '/services',
    '/industries',
    '/approach',
    '/pricing',
    '/studio',
    '/team',
    '/careers',
    '/journal',
    '/search',
    '/resources',
    '/contact',
    '/press',
    '/legal/privacy',
    '/legal/terms',
  ])
  for (const c of caseStudies) routes.add(`/work/${c.slug}`)
  // Only demos with a real entry component get a prerendered route — an
  // in-flight demo (meta.ts only) renders NotFound and stays out of the build.
  for (const d of demos) if (d.Component) routes.add(`/lab/${d.slug}`)
  for (const s of services) routes.add(`/services/${s.slug}`)
  for (const i of industries) routes.add(`/industries/${i.slug}`)
  for (const j of jobs) routes.add(`/careers/${j.slug}`)
  for (const p of team) routes.add(`/team/${personSlug(p.name)}`)
  // Paginated hub pages (/journal/page/2…, /journal/<cluster>/page/2…) so
  // every article is reachable as static HTML, not just behind client state.
  const jPages = journalPages(restCountFor(articles.length))
  for (let p = 2; p <= jPages; p++) routes.add(`/journal/page/${p}`)
  for (const c of CLUSTERS) {
    routes.add(`/journal/${c}`)
    const cPages = journalPages(restCountFor(byCluster(c).length))
    for (let p = 2; p <= cPages; p++) routes.add(`/journal/${c}/page/${p}`)
  }
  for (const a of articles) routes.add(`/journal/${a.cluster}/${a.slug}`)
  for (const t of allTags()) routes.add(`/journal/tag/${encodeURIComponent(t.tag)}`)
  return [...routes]
}
