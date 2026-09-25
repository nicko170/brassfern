/**
 * Base-path + absolute URL helpers.
 * Every asset URL, image, fetch and Markdown link must pass through withBase().
 * BASE comes from Vite's `base` (driven by the BASE_PATH env var) and always
 * ends with a slash — e.g. "/" locally, "/brassfern/" on GitHub Pages.
 */
export const BASE: string = import.meta.env.BASE_URL

const DEFAULT_SITE_URL = 'https://nicko170.github.io'

export const SITE_URL: string = (
  (import.meta.env.VITE_SITE_URL as string | undefined) || DEFAULT_SITE_URL
).replace(/\/+$/, '')

/** basename for <BrowserRouter> — no trailing slash. */
export const ROUTER_BASE = BASE.replace(/\/+$/, '') || '/'

export function withBase(path = '/'): string {
  if (/^(https?:)?\/\//.test(path) || /^(mailto:|tel:|#)/.test(path)) return path
  if (path === '' || path === '/') return BASE
  return BASE + path.replace(/^\/+/, '')
}

/** Absolute URL for canonical links, OG tags, sitemap and RSS. */
export function absoluteUrl(path = '/'): string {
  const rel = path === '/' ? '' : path.replace(/^\/+/, '')
  return `${SITE_URL}${BASE}${rel}`
}
