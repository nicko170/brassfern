import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { allTags, searchContent } from '../lib/content'

/** Static jump targets, matched against the query too. */
const PAGES = [
  { label: 'Work', sub: 'Case studies', url: '/work' },
  { label: 'Lab', sub: 'Live demos you can touch', url: '/lab' },
  { label: 'Services', sub: 'Six crafts, one squad', url: '/services' },
  { label: 'Journal', sub: 'All the writing', url: '/journal' },
  { label: 'Pricing', sub: 'How we charge', url: '/pricing' },
  { label: 'Approach', sub: 'How we work', url: '/approach' },
  { label: 'Contact', sub: 'Start a project', url: '/contact' },
]

interface Entry {
  kind: 'page' | 'hit'
  label: string
  sub: string
  url: string
}

const HIT_CAP = 8

export default function QuickFind({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const restoreRef = useRef<Element | null>(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Clear the query whenever the palette is (re)opened, focus the field, and
  // remember what had focus so we can hand it back on close.
  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement
    setQ('')
    setActive(0)
    const t = window.setTimeout(() => inputRef.current?.focus(), 30)
    document.body.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = ''
      const restore = restoreRef.current
      if (restore instanceof HTMLElement) restore.focus()
    }
  }, [open])

  // Close on navigation.
  useEffect(() => {
    if (open) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const entries = useMemo<Entry[]>(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) {
      return PAGES.slice(0, 4).map((p) => ({ kind: 'page' as const, ...p }))
    }
    const hits = searchContent(q)
      .slice(0, HIT_CAP)
      .map((h) => ({
        kind: 'hit' as const,
        label: h.title,
        sub: h.kind === 'work' ? 'Case study' : h.cluster,
        url: h.url,
      }))
    const pages = PAGES.filter(
      (p) => p.label.toLowerCase().includes(needle) || p.sub.toLowerCase().includes(needle),
    )
      .slice(0, 2)
      .map((p) => ({ kind: 'page' as const, ...p }))
    return [...pages, ...hits]
  }, [q])

  useEffect(() => setActive(0), [entries.length])

  const popular = useMemo(() => allTags().slice(0, 6), [])

  const go = (e: Entry) => {
    onClose()
    navigate(e.url)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (entries.length ? (a + 1) % entries.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (entries.length ? (a - 1 + entries.length) % entries.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (entries[active]) go(entries[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`#qf-opt-${active}`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  return (
    <div className="qf" onClick={onClose}>
      <div
        className="qf__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Quick find"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="qf__field" onKeyDown={onKeyDown}>
          <span className="qf__magnify mono" aria-hidden>⌕</span>
          <input
            ref={inputRef}
            className="qf__input"
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls="qf-list"
            aria-activedescendant={`qf-opt-${active}`}
            aria-autocomplete="list"
            placeholder="Search articles, case studies, pages…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <kbd className="qf__esc mono">esc</kbd>
        </div>

        <ul className="qf__list" id="qf-list" role="listbox" aria-label="Results" ref={listRef}>
          {entries.length === 0 && (
            <li className="qf__empty" role="option" aria-selected="false">
              Nothing matches “{q}”. Try “tokens”, “checkout”, “RAG”…
            </li>
          )}
          {entries.map((e, i) => (
            <li
              key={e.kind + e.url}
              id={`qf-opt-${i}`}
              role="option"
              aria-selected={i === active}
              className={`qf__item${i === active ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(e)}
            >
              <span className="qf__item-label">{e.label}</span>
              <span className="qf__item-sub mono">{e.sub}</span>
            </li>
          ))}
        </ul>

        {!q && (
          <div className="qf__foot">
            <span className="mono">Popular:</span>
            {popular.map(({ tag }) => (
              <button key={tag} className="qf__tag mono" onClick={() => go({ kind: 'page', label: tag, sub: '', url: `/journal/tag/${encodeURIComponent(tag)}` })}>
                #{tag}
              </button>
            ))}
            <span className="qf__hint mono" aria-hidden>↑↓ move · ↵ open</span>
          </div>
        )}
        {q && entries.length > 0 && (
          <div className="qf__foot">
            <span className="qf__hint mono" aria-hidden>↑↓ move · ↵ open · esc close</span>
          </div>
        )}
      </div>
    </div>
  )
}

/** Global ⌘K / Ctrl+K listener — call once from Layout. */
export function useQuickFindShortcut(open: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
}
