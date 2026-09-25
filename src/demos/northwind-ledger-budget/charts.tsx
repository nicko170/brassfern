import { useMemo, useState } from 'react'
import { fmt, fmtK, fmtSigned, type MonthPoint } from './data'

/**
 * Hand-rolled SVG charts for the Northwind Ledger dashboard.
 * No chart library — the drawings are simple, the answers are loud.
 */

// ---------------------------------------------------------------- cash flow ---

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return ''
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y} L ${pts[0].x + 0.01} ${pts[0].y}`
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

export function CashflowChart({ points }: { points: MonthPoint[] }) {
  const W = 720
  const H = 300
  const M = { l: 56, r: 20, t: 18, b: 36 }
  const iw = W - M.l - M.r
  const ih = H - M.t - M.b

  const [activeRaw, setActive] = useState(points.length - 1)
  const active = Math.min(Math.max(activeRaw, 0), points.length - 1)

  const { maxY, step } = useMemo(() => {
    const peak = Math.max(...points.map((p) => Math.max(p.spend, p.budget, p.income)), 1)
    const s = Math.ceil((peak * 1.15) / 4 / 5000) * 5000
    return { maxY: s * 4, step: s }
  }, [points])

  const x = (i: number) => M.l + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw)
  const y = (v: number) => M.t + ih - (v / maxY) * ih

  const spendPts = points.map((p, i) => ({ x: x(i), y: y(p.spend) }))
  const spendLine = smoothPath(spendPts)
  const areaD = `${spendLine} L ${x(points.length - 1)} ${M.t + ih} L ${x(0)} ${M.t + ih} Z`

  const ticks = [0, 1, 2, 3, 4].map((i) => ({ v: i * step, y: y(i * step) }))
  const p = points[active]

  return (
    <div className="nl-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Area chart of monthly spend against budget" className="nl-chart__svg">
        <defs>
          <linearGradient id="nl-spend-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t.v}>
            <line x1={M.l} x2={W - M.r} y1={t.y} y2={t.y} stroke="rgba(139,160,192,0.12)" strokeWidth="1" />
            <text x={M.l - 10} y={t.y + 4} textAnchor="end" className="nl-chart__tick">
              {t.v === 0 ? '0' : fmtK(t.v)}
            </text>
          </g>
        ))}

        <path d={areaD} fill="url(#nl-spend-grad)" />
        <path d={spendLine} fill="none" stroke="#5eead4" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <line
          x1={x(0)}
          y1={y(points[0].budget)}
          x2={x(points.length - 1)}
          y2={y(points[points.length - 1].budget)}
          stroke="#f6c177"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <text x={W - M.r} y={y(points[0].budget) - 8} textAnchor="end" className="nl-chart__tick nl-chart__tick--budget">
          Budget {fmtK(points[0].budget)}/mo
        </text>

        {points.map((pt, i) => (
          <g
            key={pt.key}
            role="button"
            tabIndex={0}
            focusable="true"
            aria-label={`${pt.short}: spent ${fmt(pt.spend)} of ${fmt(pt.budget)} budget, net ${fmtSigned(pt.net)}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className="nl-chart__hit"
          >
            <circle cx={x(i)} cy={y(pt.spend)} r="18" fill="transparent" />
            <circle
              cx={x(i)}
              cy={y(pt.spend)}
              r={i === active ? 6 : 4.5}
              fill="#0a111f"
              stroke="#5eead4"
              strokeWidth={i === active ? 3 : 2}
            />
            <text x={x(i)} y={H - 12} textAnchor="middle" className="nl-chart__tick">
              {pt.short}
            </text>
          </g>
        ))}
      </svg>

      <p className="nl-chart__status" aria-live="polite">
        <strong>{p.short}</strong> — spent <strong>{fmt(p.spend)}</strong> of {fmt(p.budget)} budget (
        {Math.round((p.spend / p.budget) * 100)}%), took in {fmt(p.income)}. Net{' '}
        <strong className={p.net >= 0 ? 'nl-up' : 'nl-down'}>{fmtSigned(p.net)}</strong>.
      </p>

      <ul className="nl-chips" aria-label="Net cash flow by month">
        {points.map((pt) => (
          <li key={pt.key} className={pt.net >= 0 ? 'nl-chip nl-chip--up' : 'nl-chip nl-chip--down'}>
            {pt.short} {fmtSigned(pt.net)}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ------------------------------------------------------------------- donut ---

export interface Slice {
  id: string
  label: string
  value: number
  color: string
}

export function Donut({
  slices,
  active,
  onSelect,
  onClear,
}: {
  slices: Slice[]
  active: string | null
  onSelect: (id: string) => void
  onClear: () => void
}) {
  const total = slices.reduce((s, sl) => s + sl.value, 0)
  const R = 70
  const GAP = 1.2
  let acc = 0
  const activeSlice = slices.find((s) => s.id === active)

  return (
    <div className="nl-donut">
      <div className="nl-donut__stage">
        <svg viewBox="0 0 200 200" role="group" aria-label="Expense categories donut chart" className="nl-chart__svg">
          {slices.map((s) => {
            const pct = total > 0 ? (s.value / total) * 100 : 0
            const dash = Math.max(pct - GAP, 0)
            const offset = 25 - acc
            acc += pct
            const isActive = active === s.id
            const dim = active !== null && !isActive
            return (
              <g
                key={s.id}
                role="button"
                tabIndex={0}
                focusable="true"
                aria-pressed={isActive}
                aria-label={`${s.label}: ${fmt(s.value)}, ${pct.toFixed(1)} percent of spend. Press to drill down.`}
                className="nl-chart__hit"
                onClick={() => (isActive ? onClear() : onSelect(s.id))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    isActive ? onClear() : onSelect(s.id)
                  }
                }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={isActive ? 30 : 22}
                  pathLength={100}
                  strokeDasharray={`${dash} ${100 - dash}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                  opacity={dim ? 0.28 : 1}
                  className="nl-donut__slice"
                />
              </g>
            )
          })}
        </svg>
        <div className="nl-donut__center" aria-hidden="true">
          {activeSlice ? (
            <>
              <span className="nl-donut__center-label">{activeSlice.label}</span>
              <span className="nl-donut__center-value">{fmt(activeSlice.value)}</span>
              <span className="nl-donut__center-sub">{((activeSlice.value / total) * 100).toFixed(1)}% of out</span>
            </>
          ) : (
            <>
              <span className="nl-donut__center-label">Total out</span>
              <span className="nl-donut__center-value">{fmt(total)}</span>
              <span className="nl-donut__center-sub">{slices.length} categories</span>
            </>
          )}
        </div>
      </div>

      <ul className="nl-legend" aria-label="Categories">
        {slices.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={active === s.id ? 'nl-legend__btn nl-legend__btn--on' : 'nl-legend__btn'}
              aria-pressed={active === s.id}
              onClick={() => (active === s.id ? onClear() : onSelect(s.id))}
            >
              <span className="nl-legend__dot" style={{ background: s.color }} aria-hidden="true" />
              <span className="nl-legend__label">{s.label}</span>
              <span className="nl-legend__value">{fmtK(s.value)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ------------------------------------------------------------------ pacing ---

export interface PaceItem {
  id: string
  label: string
  color: string
  spent: number
  budget: number
}

export function paceStatus(spent: number, budget: number, pace: number): { label: string; tone: 'ok' | 'warn' | 'bad' } {
  const expected = budget * pace
  if (spent > budget) return { label: 'Over budget', tone: 'bad' }
  const ratio = expected > 0 ? spent / expected : 0
  if (ratio > 1.12) return { label: 'Running hot', tone: 'warn' }
  if (ratio < 0.72) return { label: 'Quiet', tone: 'ok' }
  return { label: 'On pace', tone: 'ok' }
}

export function PacingBars({ items, pace }: { items: PaceItem[]; pace: number }) {
  return (
    <ul className="nl-pacing" aria-label="Budget pacing by category">
      {items.map((it) => {
        const st = paceStatus(it.spent, it.budget, pace)
        const fillPct = Math.min(100, (it.spent / it.budget) * 100)
        return (
          <li key={it.id} className="nl-pace">
            <div className="nl-pace__row">
              <span className="nl-pace__label">
                <span className="nl-legend__dot" style={{ background: it.color }} aria-hidden="true" />
                {it.label}
              </span>
              <span className="nl-pace__nums">
                <strong>{fmt(it.spent)}</strong> / {fmt(it.budget)}
              </span>
              <span className={`nl-pill nl-pill--${st.tone}`}>{st.label}</span>
            </div>
            <div
              className="nl-pace__track"
              role="img"
              aria-label={`${it.label}: ${fmt(it.spent)} spent of ${fmt(it.budget)} budget — ${st.label.toLowerCase()}`}
            >
              <div className="nl-pace__fill" style={{ width: `${fillPct}%`, background: it.color }} />
              <span className="nl-pace__marker" style={{ left: `${pace * 100}%` }} aria-hidden="true" />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

// -------------------------------------------------------------- goal track ---

export function GoalTrack({ balance, target }: { balance: number; target: number }) {
  const pct = Math.min(100, (balance / target) * 100)
  return (
    <div className="nl-goal">
      <div
        className="nl-goal__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={balance}
        aria-label={`Runway buffer: ${fmt(balance)} of ${fmt(target)} saved`}
      >
        <div className="nl-goal__fill" style={{ width: `${pct}%` }} />
        {[25, 50, 75].map((m) => (
          <span key={m} className="nl-goal__mark" style={{ left: `${m}%` }} aria-hidden="true" />
        ))}
      </div>
      <div className="nl-goal__scale" aria-hidden="true">
        <span>0</span>
        <span>{fmtK(target / 2)}</span>
        <span>{fmtK(target)}</span>
      </div>
    </div>
  )
}
