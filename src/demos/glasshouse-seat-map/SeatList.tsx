import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ROW_GROUPS, TIERS, fmtMoney, nearestInDirection, type Seat } from './data'

/**
 * The chair list — the map's equal, not its apology. Every row of the house
 * as a line of numbered chips in a single multi-selectable listbox: one tab
 * stop for the whole house, arrow keys walk seats and rows (left/right within
 * a row, up/down between rows by stage geometry), Enter takes or releases.
 * Each chair describes itself via aria-describedby.
 */

interface Props {
  sold: Set<string>
  selected: Set<string>
  onToggle: (id: string) => void
}

export default function SeatList({ sold, selected, onToggle }: Props) {
  const [focusId, setFocusId] = useState<string | null>(null)
  const liveRef = useRef<HTMLParagraphElement>(null)

  // flat, ordered list of every chair in the house
  const flat = useMemo(() => ROW_GROUPS.flatMap((g) => g.seats), [])

  useEffect(() => {
    if (!focusId) return
    const el = document.getElementById(`gsl-o-${focusId}`)
    el?.focus()
  }, [focusId])

  function describe(s: Seat): string {
    const tier = TIERS[s.tier]
    return `${s.sectionName}, ${s.section === 'box' ? `chair ${s.num}` : `row ${s.row}, seat ${s.num}`} — ${tier.name}, ${fmtMoney(tier.price)}.`
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    const dir =
      e.key === 'ArrowLeft' ? 'left' : e.key === 'ArrowRight' ? 'right' : e.key === 'ArrowUp' ? 'up' : e.key === 'ArrowDown' ? 'down' : null
    if (!dir) return
    e.preventDefault()
    const from = focusId ? flat.find((s) => s.id === focusId) : null
    if (!from) {
      setFocusId(flat.find((s) => !sold.has(s.id))?.id ?? null)
      return
    }
    const next = nearestInDirection(from, dir, sold)
    if (next) {
      setFocusId(next.id)
      if (liveRef.current) liveRef.current.textContent = describe(next)
    }
  }

  return (
    <div
      className="gsm-listbox"
      role="listbox"
      aria-multiselectable="true"
      aria-label="Every chair in the house, by section and row. Arrow keys move, Enter takes or releases a chair."
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <p ref={liveRef} className="gsm-sr" role="status" aria-live="polite" />
      {ROW_GROUPS.map((g) => {
        const tier = TIERS[g.seats[0].tier]
        const allSameTier = g.seats.every((s) => s.tier === g.seats[0].tier)
        return (
          <section key={g.key} className="gsl-row" aria-label={`${g.sectionName}, ${g.rowLabel}`}>
            <header className="gsl-row__head">
              <h3 className="gsl-row__name">
                <span className="gsl-row__section">{g.sectionName}</span> {g.rowLabel}
              </h3>
              {allSameTier && (
                <span className={`gsl-row__tier gsl-row__tier--${tier.key}`}>
                  {tier.name} · {fmtMoney(tier.price)}
                </span>
              )}
            </header>
            <div className="gsl-row__chips" role="group" aria-label={`Chairs in ${g.sectionName} ${g.rowLabel}`}>
              {g.seats.map((s) => {
                const isSold = sold.has(s.id)
                const isOn = selected.has(s.id)
                const t = TIERS[s.tier]
                const descId = `gsl-d-${s.id}`
                return (
                  <span key={s.id} className="gsl-chipwrap">
                    <span id={descId} className="gsm-sr">
                      {describe(s)} {s.restricted ? 'Restricted view. ' : ''}
                      {isSold ? 'Sold.' : isOn ? 'In your order.' : 'Available.'}
                    </span>
                    <button
                      type="button"
                      id={`gsl-o-${s.id}`}
                      role="option"
                      aria-selected={isOn}
                      aria-disabled={isSold || undefined}
                      aria-describedby={descId}
                      tabIndex={s.id === focusId ? 0 : -1}
                      className={`gsl-chip gsl-chip--${s.tier}${isOn ? ' is-on' : ''}${isSold ? ' is-sold' : ''}${s.restricted ? ' is-r' : ''}`}
                      onClick={() => !isSold && onToggle(s.id)}
                      onFocus={() => setFocusId(s.id)}
                    >
                      {s.section === 'box' ? s.num : s.num}
                    </button>
                  </span>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
