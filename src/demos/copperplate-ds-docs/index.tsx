import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { PAGES, SECTIONS, getPage, pagesBySection } from './data'
import { GlyphIcon } from './icons'
import { useCopied } from './kit'
import { renderPage, type PageCtx } from './pages'
import { DEFAULT_TOKENS, type TokenState } from './tokens'
import './demo.css'

/**
 * Copperplate DS docs — a living design-system documentation site for the
 * fictional Copperplate (observability tooling). Art direction: a
 * typefounder's specimen book — warm bone paper, copper accents, wide-spaced
 * small caps, hairline rules, big proof glyphs. Scoped under .cpd.
 */

type Theme = 'day' | 'night'

function readHash(): string {
  if (typeof window === 'undefined') return 'overview'
  const id = window.location.hash.replace('#', '')
  return PAGES.some((p) => p.id === id) ? id : 'overview'
}

/* --- search ------------------------------------------------------------- */

interface SearchHit {
  id: string
  title: string
  section: string
  no: string
}

function useSearch(query: string): SearchHit[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const terms = q.split(/\s+/)
    return PAGES.filter((p) => {
      const hay = `${p.title} ${p.section} ${p.lede} ${p.keywords.join(' ')}`.toLowerCase()
      return terms.every((t) => hay.includes(t))
    }).map((p) => ({ id: p.id, title: p.title, section: p.section, no: p.no }))
  }, [query])
}

function SearchBox({
  onGo,
  autoFocusRow,
}: {
  onGo: (id: string) => void
  autoFocusRow?: boolean
}) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const hits = useSearch(q)
  const listId = autoFocusRow ? 'cpd-results-mobile' : 'cpd-results'

  const go = useCallback(
    (id: string) => {
      setQ('')
      setOpen(false)
      onGo(id)
    },
    [onGo],
  )

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setHi((h) => Math.min(h + 1, hits.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHi((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && hits[hi]) go(hits[hi].id)
    } else if (e.key === 'Escape') {
      setQ('')
      setOpen(false)
    }
  }

  const showList = open && q.trim().length > 0

  return (
    <div className="cpd-search">
      <div className="cpd-search__box">
        <GlyphIcon name="search" size={15} />
        <input
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && hits[hi] ? `${listId}-${hits[hi].id}` : undefined}
          aria-label="Search the docs"
          placeholder="Search plates…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
            setHi(0)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKey}
        />
      </div>
      {showList ? (
        <ul className="cpd-results" role="listbox" id={listId} aria-label="Matching plates">
          {hits.map((h, i) => (
            <li key={h.id}>
              <button
                role="option"
                id={`${listId}-${h.id}`}
                aria-selected={i === hi}
                className={`cpd-results__hit${i === hi ? ' is-hi' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  go(h.id)
                }}
                onMouseEnter={() => setHi(i)}
              >
                <span className="cpd-results__no mono">{h.no}</span>
                <span className="cpd-results__title">{h.title}</span>
                <span className="cpd-results__sect mono">{h.section}</span>
              </button>
            </li>
          ))}
          {hits.length === 0 ? (
            <li className="cpd-results__none" role="option" aria-selected="false">
              No plates match “{q.trim()}”.
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  )
}

/* --- shell ----------------------------------------------------------------- */

export default function CopperplateDsDocs() {
  const [pageId, setPageId] = useState<string>(readHash)
  const [theme, setTheme] = useState<Theme>('day')
  const [tokens, setTokens] = useState<TokenState>(DEFAULT_TOKENS)
  const [copied, copy] = useCopied()
  const mainRef = useRef<HTMLDivElement | null>(null)
  const headRef = useRef<HTMLElement | null>(null)

  const go = useCallback(
    (id: string) => {
      if (!PAGES.some((p) => p.id === id)) return
      setPageId(id)
      if (typeof window !== 'undefined') {
        try {
          window.history.replaceState(null, '', `#${id}`)
        } catch {
          /* sandboxed contexts */
        }
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
      requestAnimationFrame(() => headRef.current?.focus({ preventScroll: true }))
    },
    [],
  )

  useEffect(() => {
    const onHash = () => setPageId(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const ctx: PageCtx = useMemo(
    () => ({
      tokens,
      patch: (p) => setTokens((t) => ({ ...t, ...p })),
      resetTokens: () => setTokens(DEFAULT_TOKENS),
      go,
      copied,
      copy,
    }),
    [tokens, go, copied, copy],
  )

  const page = getPage(pageId)

  const navList = (
    <nav className="cpd-nav" aria-label="Documentation plates">
      {SECTIONS.map((section) => (
        <div className="cpd-nav__group" key={section}>
          <p className="cpd-nav__section">{section}</p>
          <ul>
            {pagesBySection(section).map((p) => (
              <li key={p.id}>
                <button
                  className={`cpd-nav__link${p.id === pageId ? ' is-current' : ''}`}
                  aria-current={p.id === pageId ? 'page' : undefined}
                  onClick={() => go(p.id)}
                >
                  <span className="cpd-nav__no mono">{p.no}</span>
                  {p.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="cpd" data-theme={theme}>
      {/* mobile bar */}
      <div className="cpd-mobilebar">
        <span className="cpd-mobilebar__brand">
          <Monogram /> Copperplate <span className="mono">DS</span>
        </span>
        <div className="cpd-mobilebar__row">
          <label className="cpd-mobilebar__pick">
            <span className="visually-hidden-cpd">Jump to plate</span>
            <select
              className="cp-select"
              value={pageId}
              onChange={(e) => go(e.target.value)}
              aria-label="Jump to documentation plate"
            >
              {SECTIONS.map((section) => (
                <optgroup key={section} label={section}>
                  {pagesBySection(section).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.no} · {p.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'day' ? 'night' : 'day')} />
        </div>
        <SearchBox onGo={go} autoFocusRow />
      </div>

      <div className="cpd-shell">
        <aside className="cpd-rail">
          <button className="cpd-brand" onClick={() => go('overview')} aria-label="Copperplate DS — overview plate">
            <Monogram />
            <span className="cpd-brand__words">
              <span className="cpd-brand__name">Copperplate</span>
              <span className="cpd-brand__sub mono">Design System · v4.2</span>
            </span>
          </button>
          <SearchBox onGo={go} />
          {navList}
          <div className="cpd-rail__foot">
            <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'day' ? 'night' : 'day')} />
            <p className="cpd-rail__note mono">Printed live · no screenshots were harmed</p>
          </div>
        </aside>

        <div className="cpd-main" ref={mainRef}>
          <article className="cpd-article" key={pageId}>
            {page.bare ? null : (
              <header className="cpd-articlehead">
                <p className="cpd-eyebrow">
                  <span className="mono">{page.no}</span> {page.section}
                </p>
                <h1 className="cpd-h1" tabIndex={-1} ref={(el) => { headRef.current = el }}>
                  {page.title}
                </h1>
                <p className="cpd-lede">{page.lede}</p>
              </header>
            )}
            {page.bare ? (
              <span
                className="visually-hidden-cpd"
                tabIndex={-1}
                ref={(el) => { headRef.current = el }}
              >
                {page.title} — overview
              </span>
            ) : null}
            {renderPage(pageId, ctx)}
          </article>

          <footer className="cpd-foot">
            <p className="mono">Copperplate DS · v4.2 · a specimen printed live</p>
            <p>
              Copperplate is a fictional observability company; its design system is real enough to
              touch. Documentation plates by Brassfern — every example above renders the actual
              components.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}

function Monogram() {
  return (
    <svg className="cpd-mono" width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M20.6 11.4a6.4 6.4 0 1 0 1.4 6.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M24.5 13.2v5.1a3.6 3.6 0 1 1-1.8-3.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const night = theme === 'night'
  return (
    <button
      className="cpd-theme"
      onClick={onToggle}
      aria-pressed={night}
      aria-label={night ? 'Switch to the day plate (light theme)' : 'Switch to the night plate (dark theme)'}
      title={night ? 'Print on the day plate' : 'Print on the night plate'}
    >
      <span className="cpd-theme__track" aria-hidden="true">
        <span className="cpd-theme__dot" />
      </span>
      <span className="cpd-theme__label mono">{night ? 'Night plate' : 'Day plate'}</span>
    </button>
  )
}
