import { useMemo, useState } from 'react'
import type { CategoryId, Txn } from './data'
import { CATEGORIES, catOf, dayLabel, fmt } from './data'
import Icon from './icons'

export default function Activity({ txns }: { txns: Txn[] }) {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<CategoryId | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return txns.filter((t) => {
      if (cat !== 'all' && t.category !== cat) return false
      if (!q) return true
      return (
        t.merchant.toLowerCase().includes(q) ||
        (t.note ?? '').toLowerCase().includes(q) ||
        catOf(t.category).label.toLowerCase().includes(q)
      )
    })
  }, [txns, query, cat])

  const groups = useMemo(() => {
    const map = new Map<string, Txn[]>()
    for (const t of filtered) {
      const key = t.date
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    }
    return [...map.entries()].map(([date, items]) => ({
      date,
      label: dayLabel(date),
      items,
      out: items.filter((t) => t.dir === 'out').reduce((s, t) => s + t.amount, 0),
    }))
  }, [filtered])

  const catsUsed = useMemo(() => new Set(txns.map((t) => t.category)), [txns])
  const chips = CATEGORIES.filter((c) => catsUsed.has(c.id))

  return (
    <div className="cl-view" key="activity">
      <header className="cl-viewhead">
        <h1 className="cl-h1">
          Every <em>dollar</em>, accounted for
        </h1>
        <p className="cl-sub">Search a merchant, a note, a hunch.</p>
      </header>

      <div className="cl-search">
        <Icon glyph="search" size={17} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transactions"
          aria-label="Search transactions"
        />
        {query && (
          <button className="cl-search__clear" onClick={() => setQuery('')} aria-label="Clear search">
            <Icon glyph="close" size={14} />
          </button>
        )}
      </div>

      <div className="cl-chips" role="group" aria-label="Filter by category">
        <button className={`cl-chip${cat === 'all' ? ' is-on' : ''}`} onClick={() => setCat('all')} aria-pressed={cat === 'all'}>
          All
        </button>
        {chips.map((c) => (
          <button
            key={c.id}
            className={`cl-chip${cat === c.id ? ' is-on' : ''}`}
            onClick={() => setCat(cat === c.id ? 'all' : c.id)}
            aria-pressed={cat === c.id}
          >
            <Icon glyph={c.glyph} size={13} /> {c.label}
          </button>
        ))}
      </div>

      <p className="cl-count" role="status">
        {filtered.length === 0
          ? 'Nothing matches — try a different word.'
          : `${filtered.length} transaction${filtered.length === 1 ? '' : 's'}${cat !== 'all' || query ? ' match' : ''}`}
      </p>

      {groups.map((g) => (
        <section className="cl-group" key={g.date} aria-label={g.label}>
          <div className="cl-group__head">
            <h2>{g.label}</h2>
            {g.out > 0 && <span className="cl-group__out cl-ser">−{fmt(g.out)}</span>}
          </div>
          <ul className="cl-feed cl-feed--flush">
            {g.items.map((t) => (
              <li className="cl-feed__row" key={t.id}>
                <span className={`cl-feed__glyph cl-feed__glyph--${t.category}`} aria-hidden="true">
                  <Icon glyph={catOf(t.category).glyph} size={16} />
                </span>
                <span className="cl-feed__main">
                  <span className="cl-feed__merchant">
                    {t.merchant}
                    {t.pending && <span className="cl-pending">Pending</span>}
                  </span>
                  <span className="cl-feed__meta">{t.note ?? catOf(t.category).label}</span>
                </span>
                <span className={`cl-feed__amt cl-ser${t.dir === 'in' ? ' is-in' : ''}`}>
                  {fmt(t.dir === 'in' ? t.amount : -t.amount, { sign: true })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {filtered.length === 0 && (
        <div className="cl-empty">
          <Icon glyph="search" size={28} />
          <p>No transactions found.</p>
          <button
            className="cl-pillbtn"
            onClick={() => {
              setQuery('')
              setCat('all')
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
