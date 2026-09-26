import type { KeyboardEvent } from 'react'
import { RUN_OF_SEAT, SEATS, SEAT_BY_ID, TIERS, fmtMoney, type Supper } from './data'

/**
 * The Sawdust Room, drawn as a butcher's floor plan — butcher-block pass at
 * the top, the long table mid-room, banquettes on the walls, window rail at
 * the bottom. Every chair is a real button: pointer, keyboard and
 * screen-reader all reach it. (A full list view is offered beside it.)
 */

interface Props {
  taken: Set<string>
  selected: Set<string>
  anchor: string | null
  onPick: (seatId: string) => void
  dateLabel: string
}

export default function SeatMap({ taken, selected, anchor, onPick, dateLabel }: Props) {
  const handleKey = (e: KeyboardEvent<SVGGElement>, id: string, isTaken: boolean) => {
    if (isTaken) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onPick(id)
    }
  }

  return (
    <svg
      className="tsm-map"
      viewBox="0 0 720 600"
      role="group"
      aria-label={`Floor plan of the Sawdust Room — ${dateLabel}. Take chairs from the list if that's easier.`}
    >
      <defs>
        <pattern id="tsm-hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="var(--tsm-kraft-2)" />
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(36,32,25,.18)" strokeWidth="2" />
        </pattern>
        <pattern id="tsm-fold" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 10 L10 0" stroke="rgba(36,32,25,.07)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* room walls */}
      <rect x="24" y="16" width="672" height="556" rx="4" className="tsm-wall" />
      <rect x="24" y="16" width="672" height="556" rx="4" fill="url(#tsm-fold)" className="tsm-fold" pointerEvents="none" />

      {/* kitchen band */}
      <rect x="40" y="32" width="640" height="118" rx="6" className="tsm-kitchen" />
      <text x="56" y="58" className="tsm-room-label">The pass — watch Gus slice</text>
      <text x="664" y="58" className="tsm-room-label tsm-room-label--right">Kitchen ↑</text>
      {/* heat lamps */}
      {[120, 300, 420, 600].map((x) => (
        <line key={x} x1={x} y1={72} x2={x} y2={96} className="tsm-lamp" />
      ))}

      {/* butcher-block pass counter */}
      <rect x="150" y="102" width="420" height="22" rx="7" className="tsm-counter" />
      <text x="360" y="117" className="tsm-counter-label" textAnchor="middle">
        the butcher-block pass
      </text>

      {/* the long table, with planks */}
      <rect x="210" y="250" width="300" height="96" rx="14" className="tsm-table" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={210 + i * 50} y1={256} x2={210 + i * 50} y2={340} className="tsm-plank" />
      ))}
      <text x="360" y="274" className="tsm-table-label" textAnchor="middle">
        the long table
      </text>
      {/* candles */}
      {[280, 360, 440].map((x) => (
        <g key={x} pointerEvents="none">
          <circle cx={x} cy={298} r="3.4" className="tsm-candle" />
          <circle cx={x} cy={298} r="6.5" className="tsm-candle-glow" />
        </g>
      ))}

      {/* chalkboard by the door */}
      <rect x="56" y="196" width="92" height="64" rx="4" className="tsm-chalk" />
      <text x="102" y="218" className="tsm-chalk-text" textAnchor="middle">
        tonight
      </text>
      {[0, 1, 2].map((i) => (
        <line key={i} x1="70" y1={228 + i * 9} x2={134 - i * 12} y2={228 + i * 9} className="tsm-chalk-line" />
      ))}

      {/* banquettes — bench + rail table */}
      <g aria-hidden="true">
        <rect x="56" y="218" width="26" height="174" rx="9" className="tsm-bench" />
        <rect x="92" y="238" width="20" height="134" rx="6" className="tsm-rail" />
        <rect x="638" y="218" width="26" height="174" rx="9" className="tsm-bench" />
        <rect x="608" y="238" width="20" height="134" rx="6" className="tsm-rail" />
        <text x="69" y="410" className="tsm-room-label" textAnchor="middle">west banquette</text>
        <text x="651" y="410" className="tsm-room-label" textAnchor="middle">east banquette</text>
      </g>

      {/* plants from the providore patch */}
      <g aria-hidden="true" className="tsm-plants">
        <circle cx="70" cy="470" r="17" className="tsm-pot" />
        <circle cx="70" cy="470" r="7" className="tsm-pot-dot" />
        <circle cx="652" cy="482" r="13" className="tsm-pot" />
        <circle cx="652" cy="482" r="5" className="tsm-pot-dot" />
      </g>

      {/* window rail along the lane */}
      <rect x="190" y="516" width="340" height="16" rx="6" className="tsm-rail tsm-rail--window" />
      <text x="360" y="508" className="tsm-room-label" textAnchor="middle">
        the lane — window rail
      </text>

      {/* entrance */}
      <rect x="598" y="556" width="82" height="12" className="tsm-door" />
      <path d="M612 584 L668 584 M660 576 L668 584 L660 592" className="tsm-door-arrow" />
      <text x="612" y="598" className="tsm-room-label">entry — you'll smell it first</text>

      {/* ----------------------------
          chairs
      ---------------------------- */}
      {SEATS.map((seat) => {
        const isTaken = taken.has(seat.id)
        const isPicked = selected.has(seat.id)
        const isAnchor = anchor === seat.id
        const run = RUN_OF_SEAT[seat.id]
        const tier = TIERS[seat.tier]
        const state = isTaken ? 'taken' : isPicked ? 'held for you' : 'free'
        const label = `Chair ${seat.id} · ${run.name} · ${fmtMoney(tier.price)} · ${isTaken ? 'sold' : isPicked ? 'held for your party — press to move or clear' : 'free, press to take'}`
        return (
          <g
            key={seat.id}
            className={[
              'tsm-seat',
              isTaken && 'is-taken',
              isPicked && 'is-picked',
              isAnchor && 'is-anchor',
            ]
              .filter(Boolean)
              .join(' ')}
            role="button"
            tabIndex={isTaken ? -1 : 0}
            aria-disabled={isTaken || undefined}
            aria-pressed={isPicked}
            aria-label={label}
            onClick={() => !isTaken && onPick(seat.id)}
            onKeyDown={(e) => handleKey(e, seat.id, isTaken)}
          >
            <title>{`Chair ${seat.id} — ${tier.name}, ${fmtMoney(tier.price)}, ${state}`}</title>
            <circle cx={seat.x} cy={seat.y} r={seat.r + 6} className="tsm-seat__halo" />
            <circle cx={seat.x} cy={seat.y} r={seat.r} className="tsm-seat__body" />
            {isTaken && (
              <text x={seat.x} y={seat.y + 3.4} className="tsm-seat__x" textAnchor="middle" aria-hidden="true">
                ✕
              </text>
            )}
            {isPicked && (
              <text x={seat.x} y={seat.y + 3.8} className="tsm-seat__tick" textAnchor="middle" aria-hidden="true">
                ✓
              </text>
            )}
            {!isTaken && !isPicked && (
              <text x={seat.x} y={seat.y + 3.2} className="tsm-seat__id" textAnchor="middle" aria-hidden="true">
                {seat.id}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function seatSummary(ids: string[]): string {
  return ids
    .map((id) => `${id} · ${SEAT_BY_ID[id].tier}`)
    .join(', ')
}
