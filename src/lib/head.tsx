import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { absoluteUrl } from './base'

export interface HeadState {
  title: string
  description: string
  canonical: string
  ogType: string
  image?: string
  robots?: string
  jsonLd: object[]
}

export interface HeadCollector {
  state: HeadState
}

export function createCollector(): HeadCollector {
  return { state: defaultHead() }
}

function defaultHead(): HeadState {
  return {
    title: 'Brassfern — Software with a heartbeat',
    description:
      'Brassfern is an independent digital product studio in Sydney. Brand, websites, product engineering, e-commerce, AI and growth — built by small senior squads.',
    canonical: absoluteUrl('/'),
    ogType: 'website',
    image: absoluteUrl('images/og.jpg'),
    jsonLd: [],
  }
}

export const HeadContext = createContext<HeadCollector | null>(null)

export interface SeoProps {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  image?: string
  robots?: string
  jsonLd?: object[]
  children?: ReactNode
}

const TITLE_SUFFIX = ' — Brassfern'

export function Seo({ title, description, path, type = 'website', image, robots, jsonLd = [], children }: SeoProps) {
  const collector = useContext(HeadContext)
  const fullTitle = title.includes('Brassfern') ? title : `${title}${TITLE_SUFFIX}`
  const state: HeadState = {
    title: fullTitle,
    description,
    canonical: absoluteUrl(path),
    ogType: type,
    image: image ?? absoluteUrl('images/og.jpg'),
    robots,
    jsonLd,
  }
  // SSR: hand state to the collector during render.
  if (collector) collector.state = state
  // client: apply after hydration / on route change.
  useEffect(() => {
    applyHead(state)
  }, [fullTitle, description, path, type, image, robots])
  return children ? <>{children}</> : null
}

const RSS_HREF = absoluteUrl('rss.xml')

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function applyHead(s: HeadState) {
  document.title = s.title
  upsertMeta('name', 'description', s.description)
  upsertMeta('property', 'og:title', s.title)
  upsertMeta('property', 'og:description', s.description)
  upsertMeta('property', 'og:url', s.canonical)
  upsertMeta('property', 'og:type', s.ogType)
  upsertMeta('property', 'og:site_name', 'Brassfern')
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', s.title)
  upsertMeta('name', 'twitter:description', s.description)
  if (s.image) {
    upsertMeta('property', 'og:image', s.image)
    upsertMeta('name', 'twitter:image', s.image)
  }
  if (s.robots) upsertMeta('name', 'robots', s.robots)
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = s.canonical
  let rss = document.head.querySelector<HTMLLinkElement>('link[rel="alternate"][type="application/rss+xml"]')
  if (!rss) {
    rss = document.createElement('link')
    rss.rel = 'alternate'
    rss.type = 'application/rss+xml'
    rss.title = 'Brassfern — Journal'
    document.head.appendChild(rss)
  }
  rss.href = RSS_HREF
  // JSON-LD: replace previous scripts.
  document.head.querySelectorAll('script[data-bf-ld]').forEach((el) => el.remove())
  for (const obj of s.jsonLd) {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-bf-ld', '1')
    el.textContent = JSON.stringify(obj)
    document.head.appendChild(el)
  }
}

/** Render the collected head state to HTML for the prerendered document. */
export function headToHtml(s: HeadState): string {
  const e = (str: string) => str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  const parts: string[] = [
    `<title>${e(s.title)}</title>`,
    `<meta name="description" content="${e(s.description)}" />`,
    `<link rel="canonical" href="${e(s.canonical)}" />`,
    `<link rel="alternate" type="application/rss+xml" title="Brassfern — Journal" href="${e(RSS_HREF)}" />`,
    `<meta property="og:title" content="${e(s.title)}" />`,
    `<meta property="og:description" content="${e(s.description)}" />`,
    `<meta property="og:url" content="${e(s.canonical)}" />`,
    `<meta property="og:type" content="${s.ogType}" />`,
    `<meta property="og:site_name" content="Brassfern" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(s.title)}" />`,
    `<meta name="twitter:description" content="${e(s.description)}" />`,
  ]
  if (s.robots) parts.push(`<meta name="robots" content="${s.robots}" />`)
  if (s.image) {
    parts.push(`<meta property="og:image" content="${e(s.image)}" />`)
    parts.push(`<meta name="twitter:image" content="${e(s.image)}" />`)
  }
  for (const obj of s.jsonLd) {
    parts.push(`<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
  }
  return parts.join('\n    ')
}
