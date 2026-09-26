import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

/** A lazy component whose chunk can be warmed ahead of render (used by the prerender). */
export interface Preloadable<T extends ComponentType<any>> extends LazyExoticComponent<T> {
  preload: () => Promise<unknown>
}

/**
 * React.lazy + .preload(). Pages use this for per-route code splitting;
 * the prerender calls preloadAllPages() so renderToString still sees fully
 * resolved components (React 18 SSR doesn't resolve Suspense boundaries).
 */
export function lazyPage<T extends ComponentType<any>>(loader: () => Promise<{ default: T }>): Preloadable<T> {
  const Component = lazy(loader) as Preloadable<T>
  Component.preload = () => loader()
  return Component
}

/** Named-export variant. */
export function lazyNamed<T extends ComponentType<any>>(
  loader: () => Promise<Record<string, T>>,
  name: string,
): Preloadable<T> {
  return lazyPage(() => loader().then((m) => ({ default: m[name] })))
}
