import { useId, useMemo, type KeyboardEvent } from 'react'
import {
  BANDS,
  CENTROIDS,
  SECTION_KEYS,
  SECTION_ROWS,
  SECTIONS,
  STAGE_PATH,
  freeInSection,
  priceFor,
  sectionSeats,
  seatLabel,
  TIERS,
  type Seat,
  type SectionKey,
  type Show,
} from './data'

/**
 * The hall plan, two ways: an overview of the whole room with three
 * tappable zones, and a zoomed section view with arrow-key seat walking.
 */

interface Common {
  show: Show
  sold: Set<string>
  selected: Set<string>
  showId: string
}

// ---------------------------------------------------------------- overview

interface OverviewProps extends Common {
  onOpen: (section: SectionKey) => void
}

export function PlanOverview({ show, sold, selected, showId, onOpen }: OverviewProps) {
  const titleId = useId()
  return (
    <svg
      className="asr-plan asr-plan--overview"
      viewBox="0 0 1000 770"
      role="group"
      aria-labelledby={titleId}
    >
      <title id={titleId}>Plan of the whole hall — choose a section to zoom in</title>
      {/* stage */}
      <path className="asr-stage" d={STAGE_PATH} />
      <text className="asr-stage__label" x="500" y="58" textAnchor="middle">
        STAGE
      </text>

      {SECTION_KEYS.map((key) => {
        const seats = sectionSeats(key)
        const free = freeInSection(showId, key, sold)
        const c = CENTROIDS[key]
        const label = `${SECTIONS[key].name} — ${free} of ${seats.length} chairs available. Zoom in to choose seats.`
        return (
          <g
            key={key}
            className="asr-zone"
            role="button"
            tabIndex={0}
            aria-label={label}
            onClick={() => onOpen(key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpen(key)
              }
            }}
          >
            {BANDS[key].map((d, i) => (
              <path key={i} className="asr-zone__band" d={d} />
            ))}
            {seats.map((s) => (
              <circle
                key={s.id}
                className={dotClass(s, sold, selected)}
                cx={s.x}
                cy={s.y}
                r={s.wc ? 4.6 : 3.5}
              />
            ))}
            <text className="asr-zone__name" x={c.x} y={c.y - 4} textAnchor="middle">
              {SECTIONS[key].name}
            </text>
            <text className="asr-zone__count" x={c.x} y={c.y + 16} textAnchor="middle">
              {free} free · from {fmtTierPrice(show, key)}
            </text>
            <text className="asr-zone__cue" x={c.x} y={c.y + 36} textAnchor="middle" aria-hidden="true">
              zoom ⌕
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function fmtTierPrice(show: Show, key: SectionKey): string {
  const cheapest = key === 'balcony' ? 'gallery' : 'b'
  const n = priceFor(show, cheapest)
  return `$${n}`
}

function dotClass(s: Seat, sold: Set<string>, selected: Set<string>): string {
  let c = `asr-dot asr-dot--${s.tier}`
  if (s.wc) c += ' asr-dot--wc'
  if (sold.has(s.id)) c += ' asr-dot--sold'
  if (selected.has(s.id)) c += ' asr-dot--sel'
  return c
}

// ---------------------------------------------------------------- section detail

interface SectionProps extends Common {
  section: SectionKey
  activeId: string | null
  onActive: (id: string | null) => void
  onToggle: (id: string) => void
  onBack: () => void
}

export function SectionPlan({ section, show, sold, selected, activeId, onActive, onToggle, onBack }: SectionProps) {
  const titleId = useId()
  const rows = SECTION_ROWS[section]

  // bbox with generous padding for row labels
  const box = useMemo(() => {
    const seats = sectionSeats(section)
    const xs = seats.map((s) => s.x)
    const ys = seats.map((s) => s.y)
    const padX = 66
    const padY = 52
    const minX = Math.min(...xs) - padX
    const minY = Math.min(...ys) - padY
    return {
      minX,
      minY,
      w: Math.max(...xs) - minX + padX,
      h: Math.max(...ys) - minY + padY,
    }
  }, [section])

  const activeSeat = activeId ? findSeat(section, activeId) : null

  function onKeyDown(e: KeyboardEvent<SVGSVGElement>) {
    if (!activeId) return
    const ri = rows.findIndex((r) => r.seats.some((s) => s.id === activeId))
    if (ri < 0) return
    const row = rows[ri]
    const si = row.seats.findIndex((s) => s.id === activeId)
    let target: Seat | null = null
    if (e.key === 'ArrowRight') target = row.seats[si + 1] ?? row.seats[si]
    else if (e.key === 'ArrowLeft') target = row.seats[si - 1] ?? row.seats[0]
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const nextRow = rows[e.key === 'ArrowDown' ? ri + 1 : ri - 1]
      if (nextRow) {
        const me = row.seats[si]
        target = nextRow.seats.reduce((best, s) =>
          Math.abs(s.x - me.x) < Math.abs(best.x - me.x) ? s : best,
        )
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle(activeId)
      return
    } else if (e.key === 'Escape') {
      onBack()
      return
    } else return
    e.preventDefault()
    if (target && target.id !== activeId) {
      onActive(target.id)
      document.getElementById(`asr-s-${target.id}`)?.focus()
    }
  }

  return (
    <div className="asr-sectionview">
      <div className="asr-sectionview__bar">
        <button type="button" className="asr-back" onClick={onBack}>
          ← All sections
        </button>
        <p className="asr-sectionview__name">
          {SECTIONS[section].name} <span>— {SECTIONS[section].blurb}</span>
        </p>
        <p className="asr-sectionview__hint">Arrows walk · Enter takes</p>
      </div>
      <svg
        className="asr-plan asr-plan--section"
        viewBox={`${box.minX} ${box.minY} ${box.w} ${box.h}`}
        role="group"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
      >
        <title id={titleId}>
          {SECTIONS[section].name} seat map — use arrow keys to walk the chairs, Enter to take one
        </title>
        {rows.map((row) => {
          const first = row.seats[0]
          return (
            <text
              key={row.key}
              className="asr-rowlabel"
              x={first.x - 44}
              y={first.y + 5}
              textAnchor="middle"
            >
              {row.label}
            </text>
          )
        })}
        {rows.map((row) =>
          row.seats.map((seat) => {
            const isSold = sold.has(seat.id)
            const isSel = selected.has(seat.id)
            const cls =
              `asr-seat asr-seat--${seat.tier}` +
              (seat.wc ? ' asr-seat--wc' : '') +
              (isSold ? ' asr-seat--sold' : '') +
              (isSel ? ' asr-seat--sel' : '')
            const state = isSel
              ? 'selected'
              : isSold
                ? 'sold'
                : `${TIERS[seat.tier].name}, ${priceLabel(show, seat)}`
            return (
              <g
                key={seat.id}
                id={`asr-s-${seat.id}`}
                className={cls}
                role="checkbox"
                aria-checked={isSel}
                aria-disabled={isSold || undefined}
                aria-label={`${seatLabel(seat)} — ${state}`}
                tabIndex={seat.id === activeId ? 0 : -1}
                onClick={() => {
                  onActive(seat.id)
                  onToggle(seat.id)
                }}
                onFocus={() => onActive(seat.id)}
                onMouseEnter={() => onActive(seat.id)}
              >
                {seat.wc ? (
                  <>
                    <circle className="asr-seat__shell" cx={seat.x} cy={seat.y} r={16} />
                    <text className="asr-seat__num" x={seat.x} y={seat.y + 4.5} textAnchor="middle">
                      W
                    </text>
                  </>
                ) : (
                  <>
                    <circle className="asr-seat__shell" cx={seat.x} cy={seat.y} r={15} />
                    <text className="asr-seat__num" x={seat.x} y={seat.y + 4.5} textAnchor="middle">
                      {seat.num}
                    </text>
                  </>
                )}
              </g>
            )
          }),
        )}
      </svg>
      <p className="asr-readout" aria-hidden="true">
        {activeSeat ? (
          <>
            <strong>{seatLabel(activeSeat)}</strong>
            {sold.has(activeSeat.id)
              ? ' — sold, this one. The chair beside it might be free.'
              : ` — ${TIERS[activeSeat.tier].name}, ${priceLabel(show, activeSeat)}${
                  activeSeat.wc ? ' · wheelchair space' : ''
                } · ${selected.has(activeSeat.id) ? 'yours — click again to release' : 'click or press Enter to take it'}`}
          </>
        ) : (
          'Hover, tap or arrow-walk a chair for its story.'
        )}
      </p>
    </div>
  )
}

function priceLabel(show: Show, seat: Seat): string {
  const n = priceFor(show, seat.tier)
  return `$${n % 1 === 0 ? n : n.toFixed(2)}`
}

function findSeat(section: SectionKey, id: string): Seat | null {
  return sectionSeats(section).find((s) => s.id === id) ?? null
}
