import { loadBody } from './content'

/**
 * Route → data preloading for SSR/prerender. Runs before renderToString so
 * markdown bodies are in the synchronous cache when pages render.
 */
export async function preloadForUrl(url: string): Promise<void> {
  const article = url.match(/^\/journal\/([^/]+)\/([^/]+)\/?$/)
  if (article && article[1] !== 'tag') {
    await loadBody('article', article[2], article[1])
    return
  }
  const work = url.match(/^\/work\/([^/]+)\/?$/)
  if (work) {
    await loadBody('work', work[1])
  }
}
