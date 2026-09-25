import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import { createCollector, type HeadState } from './lib/head'
import { preloadForUrl } from './lib/preload'
import { articles, caseStudies, allTags } from './lib/content'
import { demos } from './lib/demos'
import { services } from './data/services'
import { industries } from './data/industries'
import { jobs } from './data/jobs'
import { CLUSTERS } from './lib/types'

export { headToHtml, type HeadState } from './lib/head'
export { absoluteUrl, BASE, SITE_URL } from './lib/base'
export { articles, caseStudies }

export async function render(url: string): Promise<{ html: string; head: HeadState }> {
  await preloadForUrl(url)
  const collector = createCollector()
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
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
  for (const d of demos) routes.add(`/lab/${d.slug}`)
  for (const s of services) routes.add(`/services/${s.slug}`)
  for (const i of industries) routes.add(`/industries/${i.slug}`)
  for (const j of jobs) routes.add(`/careers/${j.slug}`)
  for (const c of CLUSTERS) routes.add(`/journal/${c}`)
  for (const a of articles) routes.add(`/journal/${a.cluster}/${a.slug}`)
  for (const t of allTags()) routes.add(`/journal/tag/${encodeURIComponent(t.tag)}`)
  return [...routes]
}
