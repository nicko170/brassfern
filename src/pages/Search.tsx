import { useMemo, useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { searchContent, formatDate, allTags, articles } from '../lib/content'
import Reveal from '../components/Reveal'

const RESULT_CAP = 60

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep the field in sync if the URL changes (back/forward, shared links).
  useEffect(() => setInput(q), [q])

  // Live search: debounce keystrokes into the query param (no history spam).
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = input.trim()
      if (trimmed !== q) setParams(trimmed ? { q: trimmed } : {}, { replace: true })
    }, 220)
    return () => clearTimeout(t)
  }, [input, q, setParams])

  const hits = useMemo(() => searchContent(q), [q])
  const shown = hits.slice(0, RESULT_CAP)
  const popularTags = useMemo(() => allTags().slice(0, 10), [])
  const recent = useMemo(() => articles.slice(0, 5), [])

  return (
    <>
      <Seo title="Search" description="Search the Brassfern journal and case studies." path="/search" robots="noindex,follow" />
      <header className="article-head container">
        <Reveal className="overline">Search</Reveal>
        <h1 className="display">Find the <em>receipts</em></h1>
      </header>
      <section className="section container">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            const trimmed = input.trim()
            setParams(trimmed ? { q: trimmed } : {}, { replace: true })
            inputRef.current?.blur()
          }}
          style={{ maxWidth: '44rem', marginBottom: 'var(--space-7)' }}
        >
          <div className="field">
            <label htmlFor="search-input">Search journal &amp; work</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'end' }}>
              <input
                id="search-input"
                ref={inputRef}
                type="search"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Try “design tokens” or “checkout”…"
                style={{ flex: 1, fontSize: '1.25rem' }}
              />
              <button type="submit" className="btn btn--primary">Search</button>
            </div>
          </div>
        </form>

        {q ? (
          <>
            <p className="mono muted filter-status" role="status" aria-live="polite">
              {hits.length} result{hits.length === 1 ? '' : 's'} for “{q}”
              {hits.length > RESULT_CAP ? ` — showing the first ${RESULT_CAP}` : ''}
            </p>
            {hits.length > 0 ? (
              <div style={{ display: 'grid', gap: '0', borderTop: '1px solid var(--line-strong)' }}>
                {shown.map((h) => (
                  <Link key={h.url} to={h.url} className="row-link" style={{ gridTemplateColumns: 'auto 1fr' }}>
                    <span className="row-link__num">{h.cluster}</span>
                    <div>
                      <h3 style={{ fontSize: 'clamp(1.2rem,2.4vw,1.7rem)' }}>{h.title}</h3>
                      <p className="muted" style={{ marginTop: '0.3rem' }}>{h.description}</p>
                      <p className="mono" style={{ color: 'var(--ink-3)', marginTop: '0.4rem', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        {h.kind === 'work' ? 'Case study' : 'Journal'} · {formatDate(h.date)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-note">
                <p className="lead">Nothing in the index matches “{q}”.</p>
                <p className="muted" style={{ marginTop: 'var(--space-3)' }}>
                  Try a shorter word, or browse a popular topic instead:
                </p>
                <div className="chipset" style={{ marginTop: 'var(--space-4)' }}>
                  {popularTags.map(({ tag, count }) => (
                    <Link key={tag} to={`/journal/tag/${encodeURIComponent(tag)}`} className="chip">
                      {tag} <span className="filter-btn__count">{count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <Reveal className="overline">Popular topics</Reveal>
            <div className="chipset" style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-7)' }}>
              {popularTags.map(({ tag, count }) => (
                <Link key={tag} to={`/journal/tag/${encodeURIComponent(tag)}`} className="chip">
                  {tag} <span className="filter-btn__count">{count}</span>
                </Link>
              ))}
            </div>
            <Reveal className="overline">Latest from the journal</Reveal>
            <div style={{ display: 'grid', marginTop: 'var(--space-4)', borderTop: '1px solid var(--line-strong)' }}>
              {recent.map((a) => (
                <Link key={a.slug} to={`/journal/${a.cluster}/${a.slug}`} className="row-link" style={{ gridTemplateColumns: 'auto 1fr' }}>
                  <span className="row-link__num">{a.cluster}</span>
                  <div>
                    <h3 style={{ fontSize: 'clamp(1.2rem,2.4vw,1.7rem)' }}>{a.title}</h3>
                    <p className="muted" style={{ marginTop: '0.3rem' }}>{a.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
