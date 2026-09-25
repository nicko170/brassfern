import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { fmt, INCOME_LABELS, OUT_CATEGORIES, type Txn, type TxnKind } from './data'

/**
 * Transactions ledger — searchable, keyboard-navigable, with inline
 * recategorisation that flows back into the donut and pacing panels.
 */

interface Props {
  txns: Txn[]
  overrides: Record<string, string>
  onCategorise: (id: string, category: string) => void
}

type KindFilter = 'all' | TxnKind

const PAGE = 14

export default function Transactions({ txns, overrides, onCategorise }: Props) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<KindFilter>('all')
  const [visible, setVisible] = useState(PAGE)
  const [focusIdx, setFocusIdx] = useState(0)
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([])

  const effective = (t: Txn) => overrides[t.id] ?? t.category

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return txns.filter((t) => {
      if (kind !== 'all' && t.kind !== kind) return false
      if (!q) return true
      const cat = effective(t)
      const catLabel = t.kind === 'out' ? OUT_CATEGORIES.find((c) => c.id === cat)?.label ?? cat : INCOME_LABELS[cat] ?? cat
      return t.vendor.toLowerCase().includes(q) || t.date.toLowerCase().includes(q) || catLabel.toLowerCase().includes(q)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txns, overrides, query, kind])

  const shown = filtered.slice(0, visible)

  const onRowsKeyDown = (e: KeyboardEvent) => {
    const tr = (e.target as HTMLElement).closest('tr[data-idx]') as HTMLTableRowElement | null
    if (!tr) return
    const idx = Number(tr.dataset.idx)
    let next = idx
    if (e.key === 'ArrowDown') next = Math.min(shown.length - 1, idx + 1)
    else if (e.key === 'ArrowUp') next = Math.max(0, idx - 1)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = shown.length - 1
    else return
    e.preventDefault()
    setFocusIdx(next)
    rowRefs.current[next]?.focus()
  }

  return (
    <div className="nl-txns">
      <div className="nl-txns__bar">
        <div className="nl-txns__search">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M11 11 L14.5 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setVisible(PAGE)
              setFocusIdx(0)
            }}
            placeholder="Search vendor, date or category…"
            aria-label="Search transactions"
          />
        </div>
        <div className="nl-seg" role="group" aria-label="Filter by direction">
          {(['all', 'in', 'out'] as KindFilter[]).map((k) => (
            <button
              key={k}
              type="button"
              className={kind === k ? 'nl-seg__btn nl-seg__btn--on' : 'nl-seg__btn'}
              aria-pressed={kind === k}
              onClick={() => {
                setKind(k)
                setVisible(PAGE)
                setFocusIdx(0)
              }}
            >
              {k === 'all' ? 'All' : k === 'in' ? 'Money in' : 'Money out'}
            </button>
          ))}
        </div>
      </div>

      <div className="nl-txns__scroll">
        <table className="nl-table">
          <caption className="nl-visually-hidden">
            Transactions for the selected period. Use arrow keys to move between rows; change a category with the
            select in each row.
          </caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Vendor</th>
              <th scope="col">Category</th>
              <th scope="col" className="nl-table__amt">
                Amount
              </th>
            </tr>
          </thead>
          <tbody onKeyDown={onRowsKeyDown}>
            {shown.map((t, i) => {
              const cat = effective(t)
              return (
                <tr
                  key={t.id}
                  data-idx={i}
                  tabIndex={i === focusIdx ? 0 : -1}
                  ref={(el) => {
                    rowRefs.current[i] = el
                  }}
                  onFocus={() => setFocusIdx(i)}
                >
                  <td className="nl-table__date">{t.date}</td>
                  <td>
                    <span className="nl-table__vendor">{t.vendor}</span>
                    <span className="nl-table__id">#{t.id.split('-').pop()?.padStart(3, '0')}</span>
                  </td>
                  <td>
                    {t.kind === 'out' ? (
                      <label className="nl-table__cat">
                        <span className="nl-visually-hidden">Category for {t.vendor} on {t.date}</span>
                        <select value={cat} onChange={(e) => onCategorise(t.id, e.target.value)}>
                          {OUT_CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : (
                      <span className="nl-table__cat-static">{INCOME_LABELS[cat] ?? cat}</span>
                    )}
                  </td>
                  <td className={t.kind === 'in' ? 'nl-table__amt nl-up' : 'nl-table__amt'}>
                    {t.kind === 'in' ? '+' : '−'}
                    {fmt(t.amount)}
                  </td>
                </tr>
              )
            })}
            {shown.length === 0 && (
              <tr>
                <td colSpan={4} className="nl-table__empty">
                  Nothing matches “{query}”. The books are clean — try a shorter search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="nl-txns__foot">
        <p aria-live="polite">
          Showing {shown.length} of {filtered.length} transactions.
        </p>
        {visible < filtered.length && (
          <button type="button" className="nl-btn" onClick={() => setVisible((v) => v + PAGE)}>
            Show {Math.min(PAGE, filtered.length - visible)} more
          </button>
        )}
      </div>
    </div>
  )
}
