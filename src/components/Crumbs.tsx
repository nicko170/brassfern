import { Link } from 'react-router-dom'

export interface Crumb {
  name: string
  /** Omit the path (or render as final item) for the current page. */
  path?: string
}

/**
 * Visible wayfinding crumbs — the on-page twin of every page's
 * BreadcrumbList JSON-LD. Mono, hairline-subtle, brass separators.
 * Rendered as the first child of `.article-head` headers.
 */
export default function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1
          return (
            <li key={`${c.name}-${i}`}>
              {!last && c.path ? (
                <Link to={c.path}>{c.name}</Link>
              ) : (
                <span className="crumbs__current" aria-current={last ? 'page' : undefined}>
                  {c.name}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
