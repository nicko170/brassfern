#!/usr/bin/env node
/**
 * Static prerender: runs after `vite build` and `vite build --ssr`.
 * Renders every route to static HTML, injects per-page <head>, and emits
 * sitemap.xml, robots.txt, rss.xml, 404.html and .nojekyll.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DIST = path.join(ROOT, 'dist')
const SSR = path.join(ROOT, 'dist-ssr', 'entry-server.js')

if (!fs.existsSync(SSR)) {
  console.error('SSR bundle missing — run vite build --ssr first.')
  process.exit(1)
}

const { render, prerenderRoutes, headToHtml, absoluteUrl, articles } = await import(SSR)

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')

function htmlShell(body, head) {
  let out = template.replace('<!--APP-->', () => body)
  out = out.replace('<!--HEAD-->', () => headToHtml(head))
  return out
}

function outPathFor(route) {
  if (route === '/') return path.join(DIST, 'index.html')
  const decoded = decodeURIComponent(route).replace(/^\/+|\/+$/g, '')
  return path.join(DIST, decoded, 'index.html')
}

const routes = prerenderRoutes()
let rendered = 0
for (const route of routes) {
  try {
    const { html, head } = await render(route)
    const out = outPathFor(route)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, htmlShell(html, head))
    rendered++
  } catch (err) {
    console.error(`✖ prerender failed for ${route}`)
    console.error(err)
    process.exit(1)
  }
}

// 404 — GitHub Pages serves dist/404.html for unknown paths.
{
  const { html, head } = await render('/404')
  fs.writeFileSync(path.join(DIST, '404.html'), htmlShell(html, head))
}

// .nojekyll — keep underscored asset paths working on Pages.
fs.writeFileSync(path.join(DIST, '.nojekyll'), '')

// sitemap.xml
{
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const urls = routes
    .map((r) => `  <url><loc>${esc(absoluteUrl(r))}</loc></url>`)
    .join('\n')
  fs.writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
}

// robots.txt
fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('sitemap.xml')}\n`,
)

// rss.xml — latest 30 journal articles
{
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const items = (articles ?? [])
    .slice(0, 30)
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${esc(absoluteUrl(`/journal/${a.cluster}/${a.slug}`))}</link>
      <guid>${esc(absoluteUrl(`/journal/${a.cluster}/${a.slug}`))}</guid>
      <pubDate>${new Date(a.date + 'T00:00:00Z').toUTCString()}</pubDate>
      <description>${esc(a.description)}</description>
    </item>`,
    )
    .join('\n')
  fs.writeFileSync(
    path.join(DIST, 'rss.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Brassfern Journal</title>\n    <link>${esc(absoluteUrl('/journal'))}</link>\n    <description>Field notes on design, engineering and growth.</description>\n${items}\n  </channel>\n</rss>\n`,
  )
}

console.log(`prerendered ${rendered} routes + 404, sitemap (${routes.length} urls), robots, rss`)
