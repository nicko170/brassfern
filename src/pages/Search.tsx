import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { searchContent, formatDate } from '../lib/content'
import Reveal from '../components/Reveal'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)
  useEffect(() => setInput(q), [q])
  const hits = useMemo(() => searchContent(q), [q])

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
            setParams(input.trim() ? { q: input.trim() } : {})
          }}
          style={{ maxWidth: '44rem', marginBottom: 'var(--space-7)' }}
        >
          <div className="field">
            <label htmlFor="search-input">Search journal & work</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'end' }}>
              <input
                id="search-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Try “design tokens” or “checkout”…"
                style={{ flex: 1, fontSize: '1.25rem' }}
              />
              <button type="submit" className="btn btn--primary">Search</button>
            </div>
          </div>
        </form>
        {q && (
          <p className="mono muted" style={{ marginBottom: 'var(--space-5)' }}>
            {hits.length} result{hits.length === 1 ? '' : 's'} for “{q}”
          </p>
        )}
        <div style={{ display: 'grid', gap: '0', borderTop: q ? '1px solid var(--line-strong)' : 'none' }}>
          {hits.map((h) => (
            <Link key={h.url} to={h.url} className="row-link" style={{ gridTemplateColumns: 'auto 1fr' }}>
              <span className="row-link__num">{h.cluster}</span>
              <div>
                <h3 style={{ fontSize: 'clamp(1.2rem,2.4vw,1.7rem)' }}>{h.title}</h3>
                <p className="muted" style={{ marginTop: '0.3rem' }}>{h.description}</p>
                <p className="mono" style={{ color: 'var(--ink-3)', marginTop: '0.4rem', fontSize: '0.6875rem' }}>{formatDate(h.date)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
