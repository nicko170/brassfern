import { useEffect, useState } from 'react'
import type { TocItem } from '../lib/toc'

/**
 * Sticky scroll-spy table of contents for long reads. Rendered only on wide
 * screens (callers gate it); each entry deep-links to a heading id produced
 * by the markdown renderer.
 */
export default function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  return (
    <nav className="toc" aria-label="On this page">
      <p className="toc__label mono">On this page</p>
      <ol className="toc__list">
        {items.map((i) => (
          <li key={i.id} className={i.level === 3 ? 'toc__item toc__item--sub' : 'toc__item'}>
            <a
              href={`#${i.id}`}
              className={`toc__link${active === i.id ? ' is-active' : ''}`}
              onClick={() => setActive(i.id)}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
