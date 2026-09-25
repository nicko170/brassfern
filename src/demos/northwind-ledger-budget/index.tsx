import { useMemo, useState } from 'react'
import { CashflowChart, Donut, GoalTrack, PacingBars } from './charts'
import Transactions from './Transactions'
import type { MonthPoint } from './data'
import {
  buildTransactions,
  fmt,
  fmtSigned,
  GOAL,
  MONTHLY_BUDGET,
  MONTHS,
  OPENING_CASH,
  OUT_CATEGORIES,
  RECEIVABLES,
  TODAY,
} from './data'
import './demo.css'

/**
 * Northwind Ledger — the dashboard accountants actually open.
 * A budgeting dashboard for the fictional bookkeeper, rebuilt around a
 * 40-second morning ritual: am I okay, who owes me, what do I owe.
 */

const ALL_TXNS = buildTransactions()

const RANGES = [
  { n: 1, label: 'Sep only' },
  { n: 3, label: '3 months' },
  { n: 6, label: '6 months' },
]

export default function NorthwindLedgerBudget() {
  const [range, setRange] = useState(6)
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [queued, setQueued] = useState<Set<string>>(new Set())

  const windowMonths = MONTHS.slice(MONTHS.length - range)
  const prevMonths = MONTHS.slice(Math.max(0, MONTHS.length - range * 2), MONTHS.length - range)

  const catOf = (id: string, fallback: string) => overrides[id] ?? fallback

  // Group transactions by month, applying any recategorisation overrides.
  const byMonth = useMemo(() => {
    const map = new Map<string, typeof ALL_TXNS>()
    MONTHS.forEach((m) => map.set(m.key, []))
    for (const t of ALL_TXNS) map.get(t.month)!.push(t)
    return map
  }, [])

  const points: MonthPoint[] = useMemo(
    () =>
      windowMonths.map((m) => {
        let income = 0
        let spend = 0
        for (const t of byMonth.get(m.key) ?? []) {
          if (t.kind === 'in') income += t.amount
          else spend += t.amount
        }
        return { key: m.key, short: m.short, income, spend, budget: MONTHLY_BUDGET, net: income - spend }
      }),
    [byMonth, range],
  )

  const prevTotals = useMemo(() => {
    let income = 0
    let spend = 0
    for (const m of prevMonths) {
      for (const t of byMonth.get(m.key) ?? []) {
        if (t.kind === 'in') income += t.amount
        else spend += t.amount
      }
    }
    return { income, spend }
  }, [byMonth, range])

  const totals = useMemo(
    () => points.reduce((acc, p) => ({ income: acc.income + p.income, spend: acc.spend + p.spend }), { income: 0, spend: 0 }),
    [points],
  )

  const allTime = useMemo(() => {
    let net = 0
    for (const m of MONTHS) {
      for (const t of byMonth.get(m.key) ?? []) net += t.kind === 'in' ? t.amount : -t.amount
    }
    return net
  }, [byMonth])

  const cashNow = OPENING_CASH + allTime
  const weeklyBurn = (points.slice(-3).reduce((s, p) => s + p.spend, 0) / Math.min(3, points.length) / 4.345)
  const runwayWeeks = Math.round(cashNow / weeklyBurn)
  const owed = RECEIVABLES.reduce((s, r) => s + r.amount, 0)
  const overdueCount = RECEIVABLES.filter((r) => r.overdue).length

  // Donut slices for the selected window
  const slices = useMemo(() => {
    const sums = new Map<string, number>()
    for (const m of windowMonths) {
      for (const t of byMonth.get(m.key) ?? []) {
        if (t.kind !== 'out') continue
        const c = catOf(t.id, t.category)
        sums.set(c, (sums.get(c) ?? 0) + t.amount)
      }
    }
    return OUT_CATEGORIES.filter((c) => sums.has(c.id))
      .map((c) => ({ id: c.id, label: c.label, color: c.color, value: sums.get(c.id)! }))
      .sort((a, b) => b.value - a.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byMonth, overrides, range])

  const totalOut = useMemo(() => slices.reduce((s, x) => s + x.value, 0), [slices])
  const payrollShare = totalOut > 0 ? ((slices.find((s) => s.id === 'payroll')?.value ?? 0) / totalOut) * 100 : 0

  // Drill-down: top vendors within the active category
  const drill = useMemo(() => {
    if (!activeCat) return []
    const sums = new Map<string, number>()
    for (const m of windowMonths) {
      for (const t of byMonth.get(m.key) ?? []) {
        if (t.kind !== 'out') continue
        if (catOf(t.id, t.category) !== activeCat) continue
        sums.set(t.vendor, (sums.get(t.vendor) ?? 0) + t.amount)
      }
    }
    return [...sums.entries()]
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCat, byMonth, overrides, range])

  const drillTotal = drill.reduce((s, d) => s + d.amount, 0)

  // September pacing (current month, to date)
  const pacingItems = useMemo(() => {
    const sep = byMonth.get('2026-09') ?? []
    const sums = new Map<string, number>()
    for (const t of sep) {
      if (t.kind !== 'out') continue
      const c = catOf(t.id, t.category)
      sums.set(c, (sums.get(c) ?? 0) + t.amount)
    }
    return OUT_CATEGORIES.map((c) => ({ id: c.id, label: c.label, color: c.color, spent: sums.get(c.id) ?? 0, budget: c.budget }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byMonth, overrides])

  // Range transactions for the ledger table, newest first
  const rangeTxns = useMemo(
    () =>
      windowMonths
        .flatMap((m) => byMonth.get(m.key) ?? [])
        .sort((a, b) => (a.month === b.month ? b.day - a.day : a.month < b.month ? 1 : -1)),
    [byMonth, range],
  )

  // Answer-first headline for the cash-flow panel
  const last = points[points.length - 1]
  const sepOut = byMonth.get('2026-09') ?? []
  const sepBiggestId = OUT_CATEGORIES.map((c) => ({ id: c.id, v: sepOut.filter((t) => t.kind === 'out' && catOf(t.id, t.category) === c.id).reduce((s, t) => s + t.amount, 0) })).sort((a, b) => b.v - a.v)[0]?.id
  const sepBiggest = OUT_CATEGORIES.find((c) => c.id === sepBiggestId)?.label ?? 'Payroll'
  const headline =
    last.net >= 0
      ? `${last.short} closed ${fmt(last.net)} ahead — ${sepBiggest.toLowerCase()} was the biggest outflow.`
      : `${last.short} ran ${fmt(-last.net)} behind — ${sepBiggest.toLowerCase()} was the biggest outflow.`

  const goalBalance = GOAL.start + GOAL.monthly * GOAL.transfers

  const delta = (cur: number, prev: number, invert = false) => {
    if (!prev) return null
    const pct = ((cur - prev) / prev) * 100
    const good = invert ? pct < 0 : pct > 0
    return { text: `${pct > 0 ? '+' : ''}${pct.toFixed(0)}% vs prev ${prevMonths.length || range} mo`, good }
  }

  const deltas = {
    in: delta(totals.income, prevTotals.income),
    out: delta(totals.spend, prevTotals.spend, true),
    net: delta(totals.income - totals.spend, prevTotals.income - prevTotals.spend),
  }

  const queueReminder = (invoice: string) => {
    setQueued((prev) => new Set(prev).add(invoice))
  }

  return (
    <div className="nl">
      <div className="nl__wrap">
        {/* ------------------------------------------------------- header */}
        <header className="nl__head">
          <div className="nl__brand">
            <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" className="nl__logo">
              <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="none" stroke="#5eead4" strokeWidth="2" />
              <path d="M9 11h14M9 16h14M9 21h9" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>
              <span className="nl__wordmark">Northwind Ledger</span>
              <span className="nl__account">Books — Fieldstone Ceramics Pty Ltd</span>
            </span>
          </div>
          <div className="nl__head-right">
            <span className="nl__today">{TODAY.label} · AEST</span>
            <div className="nl-seg" role="group" aria-label="Date range">
              {RANGES.map((r) => (
                <button
                  key={r.n}
                  type="button"
                  className={range === r.n ? 'nl-seg__btn nl-seg__btn--on' : 'nl-seg__btn'}
                  aria-pressed={range === r.n}
                  onClick={() => setRange(r.n)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* --------------------------------------------------------- KPIs */}
        <section className="nl-kpis" aria-label="Key numbers">
          <div className="nl-kpi">
            <span className="nl-kpi__label">Cash now</span>
            <span className="nl-kpi__value">{fmt(cashNow)}</span>
            <span className="nl-kpi__cap">across operating + buffer accounts</span>
          </div>
          <div className="nl-kpi">
            <span className="nl-kpi__label">Cash in · {range === 1 ? 'Sep' : `${range} mo`}</span>
            <span className="nl-kpi__value nl-up">{fmt(totals.income)}</span>
            {deltas.in && <span className={`nl-kpi__cap ${deltas.in.good ? 'nl-up' : 'nl-down'}`}>{deltas.in.text}</span>}
          </div>
          <div className="nl-kpi">
            <span className="nl-kpi__label">Cash out · {range === 1 ? 'Sep' : `${range} mo`}</span>
            <span className="nl-kpi__value">{fmt(totals.spend)}</span>
            {deltas.out && <span className={`nl-kpi__cap ${deltas.out.good ? 'nl-up' : 'nl-down'}`}>{deltas.out.text}</span>}
          </div>
          <div className="nl-kpi">
            <span className="nl-kpi__label">Net</span>
            <span className={`nl-kpi__value ${totals.income - totals.spend >= 0 ? 'nl-up' : 'nl-down'}`}>
              {fmtSigned(totals.income - totals.spend)}
            </span>
            {deltas.net && <span className={`nl-kpi__cap ${deltas.net.good ? 'nl-up' : 'nl-down'}`}>{deltas.net.text}</span>}
          </div>
          <div className="nl-kpi">
            <span className="nl-kpi__label">Runway</span>
            <span className="nl-kpi__value">≈ {runwayWeeks} wks</span>
            <span className="nl-kpi__cap">
              You’re owed {fmt(owed)} · {overdueCount} overdue
            </span>
          </div>
        </section>

        {/* ------------------------------------------- cash flow + donut */}
        <div className="nl__grid nl__grid--main">
          <section className="nl-card" aria-labelledby="nl-cashflow-h">
            <header className="nl-card__head">
              <div>
                <h2 id="nl-cashflow-h">Cash flow</h2>
                <p className="nl-answer">{headline}</p>
              </div>
            </header>
            <CashflowChart points={points} />
          </section>

          <section className="nl-card" aria-labelledby="nl-donut-h">
            <header className="nl-card__head">
              <div>
                <h2 id="nl-donut-h">Where it went</h2>
                <p className="nl-answer">
                  Payroll took {Math.round(payrollShare)}c of every dollar out. Select a slice to drill down.
                </p>
              </div>
            </header>
            <Donut slices={slices} active={activeCat} onSelect={setActiveCat} onClear={() => setActiveCat(null)} />
            {activeCat && drill.length > 0 && (
              <div className="nl-drill">
                <h3>Top vendors — {slices.find((s) => s.id === activeCat)?.label}</h3>
                <ul>
                  {drill.map((d) => (
                    <li key={d.name}>
                      <span className="nl-drill__name">{d.name}</span>
                      <span className="nl-drill__bar" aria-hidden="true">
                        <span
                          style={{
                            width: `${Math.max(4, (d.amount / drillTotal) * 100)}%`,
                            background: slices.find((s) => s.id === activeCat)?.color,
                          }}
                        />
                      </span>
                      <span className="nl-drill__amt">{fmt(d.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        {/* -------------------------------- pacing + goal + receivables */}
        <div className="nl__grid nl__grid--second">
          <section className="nl-card" aria-labelledby="nl-pace-h">
            <header className="nl-card__head">
              <div>
                <h2 id="nl-pace-h">September, so far</h2>
                <p className="nl-answer">
                  Day {TODAY.dayOfMonth} of {TODAY.daysInMonth} — budgets should be {Math.round(TODAY.pace * 100)}% spent.
                </p>
              </div>
            </header>
            <PacingBars items={pacingItems} pace={TODAY.pace} />
          </section>

          <div className="nl__stack">
            <section className="nl-card" aria-labelledby="nl-goal-h">
              <header className="nl-card__head">
                <div>
                  <h2 id="nl-goal-h">{GOAL.name}</h2>
                  <p className="nl-answer">
                    {fmt(goalBalance)} of {fmt(GOAL.target)} — funds in full by {GOAL.eta}.
                  </p>
                </div>
                <span className="nl-goal__pct">{Math.round((goalBalance / GOAL.target) * 100)}%</span>
              </header>
              <GoalTrack balance={goalBalance} target={GOAL.target} />
              <p className="nl-card__note">{GOAL.note}</p>
            </section>

            <section className="nl-card" aria-labelledby="nl-owed-h">
              <header className="nl-card__head">
                <div>
                  <h2 id="nl-owed-h">You’re owed</h2>
                  <p className="nl-answer">
                    {fmt(owed)} outstanding — {overdueCount} invoice{overdueCount === 1 ? '' : 's'} overdue.
                  </p>
                </div>
              </header>
              <ul className="nl-owed">
                {RECEIVABLES.map((r) => (
                  <li key={r.invoice}>
                    <span className="nl-owed__who">
                      <strong>{r.client}</strong>
                      <small>
                        {r.invoice} · due {r.due}
                      </small>
                    </span>
                    <span className="nl-owed__right">
                      <span className="nl-table__amt">{fmt(r.amount)}</span>
                      {r.overdue ? (
                        queued.has(r.invoice) ? (
                          <span className="nl-pill nl-pill--ok" role="status">
                            Reminder queued
                          </span>
                        ) : (
                          <button type="button" className="nl-btn nl-btn--sm" onClick={() => queueReminder(r.invoice)}>
                            Send reminder
                          </button>
                        )
                      ) : (
                        <span className="nl-pill">On time</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* ------------------------------------------------- transactions */}
        <section className="nl-card" aria-labelledby="nl-txns-h">
          <header className="nl-card__head">
            <div>
              <h2 id="nl-txns-h">Transactions</h2>
              <p className="nl-answer">Recategorise a row and watch the donut and pacing move. Arrow keys walk the rows.</p>
            </div>
          </header>
          <Transactions txns={rangeTxns} overrides={overrides} onCategorise={(id, cat) => setOverrides((o) => ({ ...o, [id]: cat }))} />
        </section>

        <footer className="nl__foot">
          <p>
            All figures, vendors and clients on this page are fictional. Northwind Ledger is a Brassfern concept build —
            the craft is real, the books are not.
          </p>
        </footer>
      </div>
    </div>
  )
}
