import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export interface DemoMeta {
  title: string
  description: string
  tags: string[]
  client: string
  caseStudy?: string
}

export interface DemoEntry extends DemoMeta {
  slug: string
  Component: LazyExoticComponent<ComponentType> | null
}

/**
 * Auto-discovery: any folder under src/demos/<slug>/ with a meta.ts
 * (default export { title, description, tags, client, caseStudy }) and an
 * index.tsx (default-exported component) appears in /lab automatically.
 * Demo builders never touch routes.
 */
const metaModules = import.meta.glob<{ default: DemoMeta }>('../demos/*/meta.ts', { eager: true })
const entryModules = import.meta.glob<{ default: ComponentType }>('../demos/*/index.tsx')

const slugFromPath = (p: string) => p.split('/').slice(-2, -1)[0]

export const demos: DemoEntry[] = Object.entries(metaModules)
  .map(([path, mod]) => {
    const slug = slugFromPath(path)
    const entryPath = `../demos/${slug}/index.tsx`
    const loader = entryModules[entryPath]
    return {
      slug,
      ...mod.default,
      Component: loader ? lazy(loader) : null,
    }
  })
  .sort((a, b) => a.title.localeCompare(b.title))

export function getDemo(slug: string): DemoEntry | undefined {
  return demos.find((d) => d.slug === slug)
}

/** A demo is "ready" once its index.tsx exists (in-flight metas are "on the bench"). */
export const isDemoReady = (d: DemoEntry): boolean => d.Component != null
export const readyDemos: DemoEntry[] = demos.filter(isDemoReady)
export const benchDemos: DemoEntry[] = demos.filter((d) => !isDemoReady(d))
