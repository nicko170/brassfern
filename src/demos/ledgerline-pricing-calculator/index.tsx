import { useEffect, useMemo, useRef, useState } from 'react'
import './demo.css'
import Slider from './Slider'
import {
  DEFAULTS,
  LIMITS,
  PLANS,
  compute,
  findCode,
  fmt0,
  fmt2,
  fmtInt,
  searchFromState,
  snapReports,
  snapSeats,
  stateFromSearch,
  type CalcState,
  type Cycle,
  type PlanPrice,
} from './data'

/**
 * Ledgerline — pricing calculator.
 * Art direction: precise fintech paper. Off-white ledger stock, ledger-green
 * ink, double red rules lifted straight from the account book; tabular
 * numerals everywhere. Every number recomputes live (count-up motion, static
 * under reduced motion), serialises into the URL for shareable quotes, and
 * lands on a print-ready quote sheet. Ledgerline is fictional; the maths is
 * mocked but internally consistent.
 */

// ------------------------------------------------------------ hooks

function useReducedMotion(): boolean {
  const [rm, setRm] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setRm(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return rm
}

/** Eases a displayed number toward its target; snaps under reduced motion. */
function useCountUp(target: number, duration = 750): number {
  const rm = useReducedMotion()
  const [val, setVal] = useState(target)
  const fromRef = useRef(target)
  useEffect(() => {
    if (rm || typeof window === 'undefined' || !window.requestAnimationFrame) {
      fromRef.current = target
      setVal(target)
      return
    }
    const from = fromRef.current
    if (from === target) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(from + (target - from) * eased)
      if (p < 1) raf = window.requestAnimationFrame(tick)
      else fromRef.current = target
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [target, duration, rm])
  return val
}

// ------------------------------------------------------------ helpers

function shareUrl(state: CalcState): string {
  if (typeof window === 'undefined') return `?${searchFromState(state)}`
  return `${window.location.origin}${window.location.pathname}?${searchFromState(state)}`
}

const fmtHrs = (h: number) =>
  h.toLocaleString('en-AU', { minimumFractionDigits: h < 10 ? 1 : 0, maximumFractionDigits: 1 })

const fmtX = (m: number) => (m < 10 ? m.toFixed(1) : String(Math.round(m)))

// ------------------------------------------------------------ logo

function Ledgermark({ night = false }: { night?: boolean }) {
  return (
    <svg viewBox="0 0 34 34" width="32" height="32" aria-hidden="true" className={`ll-logo-svg${night ? ' ll-logo-svg--night' : ''}`}>
      <rect x="2.5" y="2.5" width="29" height="29" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="13.5" y1="2.5" x2="13.5" y2="31.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="21.5" y1="2.5" x2="21.5" y2="31.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="9" x2="8" y2="25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="17.5" y1="9" x2="17.5" y2="21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="27" y1="9" x2="27" y2="17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

// ------------------------------------------------------------ plan card

interface PlanCardProps {
  price: PlanPrice
  cycle: Cycle
  recommendedId: string
  pinnedId: string | null
  seats: number
  onPin: (id: PlanPrice['plan']['id'] | 'auto') => void
}

function PlanCard({ price, cycle, recommendedId, pinnedId, seats, onPin }: PlanCardProps) {
  const { plan } = price
  const isRec = plan.id === recommendedId
  const isPinned = pinnedId === plan.id
  const shown = cycle === 'annual' ? price.annualPerMonth : price.monthly

  let state: string
  if (!price.available) state = `Caps at ${plan.maxSeats} seats`
  else if (isPinned && isRec) state = 'Pinned · our pick too'
  else if (isPinned) state = 'Pinned — your call'
  else if (isRec) state = 'Recommended for your numbers'
  else state = `${plan.includedSeats} seats in the base`

  return (
    <div
      className={`ll-plan${isRec ? ' ll-plan--rec' : ''}${isPinned ? ' ll-plan--pinned' : ''}${!price.available ? ' ll-plan--out' : ''}`}
    >
      <div className="ll-plan__head">
        <h3 className="ll-plan__name">{plan.name}</h3>
        <span className={`ll-plan__state${price.available ? (isRec || isPinned ? ' ll-plan__state--live' : '') : ' ll-plan__state--out'}`}>
          {state}
        </span>
      </div>
      <p className="ll-plan__tag">{plan.tagline}</p>
      {price.available ? (
        <p className="ll-plan__price">
          <b>{fmt0(shown)}</b>
          <span>
            /mo{cycle === 'annual' ? ', paid yearly' : ''} · ≈ {fmt2(price.perSeat)} a seat
          </span>
        </p>
      ) : (
        <p className="ll-plan__price ll-plan__price--out">
          <b>—</b>
          <span>Your {fmtInt(seats)} seats outgrow this plan</span>
        </p>
      )}
      <dl className="ll-plan__math">
        <div>
          <dt>Base</dt>
          <dd>{fmt0(plan.base)}</dd>
        </div>
        <div>
          <dt>+{price.extraSeats} seats</dt>
          <dd>{fmt0(price.seatCost)}</dd>
        </div>
        <div>
          <dt>+{fmtInt(price.overReports)} reports</dt>
          <dd>{fmt2(price.usageCost)}</dd>
        </div>
      </dl>
      <ul className="ll-plan__feats">
        {plan.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="ll-plan__foot">
        <button
          type="button"
          role="radio"
          aria-checked={isPinned || (isRec && pinnedId === null)}
          className={`ll-plan__pick${isPinned ? ' ll-plan__pick--on' : ''}`}
          disabled={!price.available}
          onClick={() => onPin(isPinned ? 'auto' : plan.id)}
        >
          {isPinned ? 'Unpin — back to auto' : isRec ? 'Pin this plan' : 'Pin this plan'}
        </button>
      </div>
    </div>
  )
}

// ------------------------------------------------------------ component

export default function LedgerlinePricingCalculator() {
  const [state, setState] = useState<CalcState>(() =>
    typeof window === 'undefined' ? DEFAULTS : stateFromSearch(window.location.search),
  )
  const quote = useMemo(() => compute(state), [state])

  // discount field
  const [codeInput, setCodeInput] = useState('')
  const [codeMsg, setCodeMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  // share + announce
  const [copied, setCopied] = useState(false)
  const [announce, setAnnounce] = useState('')
  const announceTimer = useRef<number>(0)

  // count-ups in the quote panel
  const effMonthly = useCountUp(quote.effectiveMonthly)
  const hoursSaved = useCountUp(quote.roi.hoursSaved)
  const valueMonthly = useCountUp(quote.roi.valueMonthly)

  const say = (msg: string) => {
    setAnnounce(msg)
    if (typeof window !== 'undefined') {
      window.clearTimeout(announceTimer.current)
      announceTimer.current = window.setTimeout(() => setAnnounce(''), 4000)
    }
  }

  const set = <K extends keyof CalcState>(key: K, value: CalcState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }))

  // keep the URL in lockstep — the whole calculator is shareable
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.history.replaceState(null, '', `${window.location.pathname}?${searchFromState(state)}`)
  }, [state])

  // -------------------------------------------------- actions

  const applyCode = () => {
    const raw = codeInput.trim().toUpperCase()
    if (!raw) {
      setCodeMsg({ kind: 'error', text: 'Type a code first — LEDGER10 is a safe bet.' })
      return
    }
    const res = findCode(raw)
    if (res.status === 'ok' && res.deal) {
      set('code', res.deal.code)
      setCodeInput('')
      setCodeMsg({ kind: 'ok', text: `${res.deal.code} applied — ${res.deal.note}.` })
      say(`${res.deal.code} applied to the quote.`)
    } else if (res.status === 'expired' && res.deal) {
      setCodeMsg({ kind: 'error', text: `${res.deal.code} ${res.deal.note}. We'd love to, honestly — but a date is a date.` })
    } else {
      setCodeMsg({
        kind: 'error',
        text: "We don't know that code. MIGRATE20 is real, and very much available to people leaving spreadsheets.",
      })
    }
  }

  const removeCode = () => {
    set('code', '')
    setCodeMsg(null)
    say('Discount code removed.')
  }

  const copyLink = async () => {
    const url = shareUrl(state)
    let ok = false
    try {
      await navigator.clipboard.writeText(url)
      ok = true
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = url
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        ok = document.execCommand('copy')
        document.body.removeChild(ta)
      } catch {
        ok = false
      }
    }
    if (ok) {
      setCopied(true)
      say('Shareable quote link copied to the clipboard.')
      window.setTimeout(() => setCopied(false), 2400)
    } else {
      say("Couldn't reach the clipboard — copy the address bar instead, it's the same link.")
    }
  }

  const startOver = () => {
    setState(DEFAULTS)
    setCodeInput('')
    setCodeMsg(null)
    setCopied(false)
    say('Calculator reset to the defaults.')
    window.scrollTo({ top: 0 })
  }

  // -------------------------------------------------- derived display

  const tallyOut = state.seats > (PLANS[0].maxSeats ?? Infinity)
  const roi = quote.roi
  const barMax = LIMITS.minsPerReport.max + LIMITS.chaseMins.max

  return (
    <div className="ll">
      <div className="ll__sr" aria-live="polite">
        {announce}
      </div>

      {/* ================= screen chrome (hidden from print) ================= */}
      <div className="ll-screen">
        <header className="ll-head">
          <p className="ll-logo">
            <Ledgermark />
            <span>
              Ledger<b>line</b>
            </span>
          </p>
          <p className="ll-head__meta">
            Expenses, minus the theatre. · <a href="tel:1300534346">1300 LEDGER</a>
          </p>
        </header>

        <section className="ll-hero">
          <p className="ll-overline">Pricing · four plans · zero mystery</p>
          <h1>
            Pricing you can read like <em>a ledger</em>.
          </h1>
          <p className="ll-hero__lede">
            Every dollar itemised, every overage admitted, annual billing that actually pays you back
            (two months free). Move the sliders — the quote keeps its own books.
          </p>
          <ul className="ll-hero__facts" aria-hidden="true">
            <li>Pay 10, get 12</li>
            <li>No seat surprises</li>
            <li>Cancel anytime</li>
            <li>AUD, ex-GST</li>
          </ul>
        </section>

        <main className="ll-cols">
          {/* ---------------------------------------------- configure column */}
          <div className="ll-flow">
            <section className="ll-card" aria-labelledby="ll-h-team">
              <h2 id="ll-h-team" className="ll-q">
                <span>01</span> Who needs a seat?
              </h2>
              <p className="ll-hint">
                Finance, ops and the approvers. Everyone else files and forgets for free — submitters never
                count as seats.{tallyOut && <> At {fmtInt(state.seats)} seats, Tally's 12-seat cap rules it out.</>}
              </p>
              <Slider
                label="Seats"
                hint={quote.recommended.plan.maxSeats ? `${quote.recommended.plan.name} handles up to ${quote.recommended.plan.maxSeats}` : 'Room to grow'}
                value={state.seats}
                min={LIMITS.seats.min}
                max={LIMITS.seats.max}
                step={1}
                snap={snapSeats}
                format={(v) => `${fmtInt(v)} seats`}
                onInput={(v) => set('seats', v)}
                onCommit={(v) => {
                  set('seats', v)
                  say(`${fmtInt(v)} seats.`)
                }}
              />
            </section>

            <section className="ll-card" aria-labelledby="ll-h-paper">
              <h2 id="ll-h-paper" className="ll-q">
                <span>02</span> How much paper passes through?
              </h2>
              <p className="ll-hint">
                Expense reports filed across the whole company, per month. Coffee receipts to conference
                blowouts — if it has a receipt attached, count it.
              </p>
              <Slider
                label="Reports per month"
                hint={`${fmtInt(quote.recommended.plan.includedReports)} included on ${quote.recommended.plan.name}`}
                value={state.reports}
                min={LIMITS.reports.min}
                max={LIMITS.reports.max}
                step={25}
                snap={snapReports}
                format={(v) => `${fmtInt(v)} reports`}
                onInput={(v) => set('reports', v)}
                onCommit={(v) => {
                  set('reports', v)
                  say(`${fmtInt(v)} reports a month.`)
                }}
              />
            </section>

            <section className="ll-card" aria-labelledby="ll-h-cycle">
              <h2 id="ll-h-cycle" className="ll-q">
                <span>03</span> Monthly or annual?
              </h2>
              <div className="ll-seg" role="radiogroup" aria-label="Billing cycle">
                <button
                  type="button"
                  role="radio"
                  aria-checked={state.cycle === 'monthly'}
                  className={`ll-seg__btn${state.cycle === 'monthly' ? ' ll-seg__btn--on' : ''}`}
                  onClick={() => set('cycle', 'monthly')}
                >
                  Monthly
                  <small>drift in, drift out</small>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={state.cycle === 'annual'}
                  className={`ll-seg__btn${state.cycle === 'annual' ? ' ll-seg__btn--on' : ''}`}
                  onClick={() => set('cycle', 'annual')}
                >
                  Annual
                  <small>pay 10, get 12</small>
                </button>
              </div>
              <p className="ll-callout">
                {state.cycle === 'annual' ? (
                  <>
                    Settled once a year: <b>{fmt2(quote.cycleAmount)}</b> instead of{' '}
                    <s>{fmt2(quote.active.monthly * 12)}</s>. <b>{fmt2(quote.annualSaving)}</b> stays in
                    your war chest.
                  </>
                ) : (
                  <>
                    Switch to annual on {quote.active.plan.name} and keep <b>{fmt2(quote.annualSaving)}</b> a
                    year — we round the honesty up in your favour.
                  </>
                )}
              </p>
            </section>

            <section className="ll-card" aria-labelledby="ll-h-code">
              <h2 id="ll-h-code" className="ll-q">
                <span>04</span> Got a code?
              </h2>
              {state.code && quote.deal ? (
                <div className="ll-codechip" role="status">
                  <span className="ll-codechip__code">{quote.deal.code}</span>
                  <span className="ll-codechip__note">
                    {quote.deal.note} — <b>{fmt2(quote.discountValue)}</b> off this quote
                  </span>
                  <button type="button" className="ll-linkbtn" onClick={removeCode}>
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="ll-codefield">
                    <label className="ll-sr" htmlFor="ll-code">
                      Discount code
                    </label>
                    <input
                      id="ll-code"
                      type="text"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      placeholder="e.g. MIGRATE20"
                      value={codeInput}
                      aria-invalid={codeMsg?.kind === 'error'}
                      aria-describedby={codeMsg ? 'll-code-msg' : undefined}
                      onChange={(e) => {
                        setCodeInput(e.target.value)
                        if (codeMsg) setCodeMsg(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          applyCode()
                        }
                      }}
                    />
                    <button type="button" className="ll-btn ll-btn--green" onClick={applyCode}>
                      Apply
                    </button>
                  </div>
                  {codeMsg && (
                    <p id="ll-code-msg" className={`ll-msg ll-msg--${codeMsg.kind}`} role={codeMsg.kind === 'error' ? 'alert' : 'status'}>
                      {codeMsg.text}
                    </p>
                  )}
                  <p className="ll-hint ll-hint--tight">
                    Codes are honest about their expiry. Try EOFY24 to watch one fail with dignity.
                  </p>
                </>
              )}
            </section>

            <section className="ll-card" aria-labelledby="ll-h-roi">
              <h2 id="ll-h-roi" className="ll-q">
                <span>05</span> The ROI maths — your numbers, not ours
              </h2>
              <p className="ll-hint">
                Every assumption is yours to argue with. Defaults come from our (fictional) onboarding
                surveys; drag them until they match your building.
              </p>

              <div className="ll-roi-grid">
                <Slider
                  label="Blended hourly rate"
                  hint="everyone who touches expenses"
                  value={state.rate}
                  min={LIMITS.rate.min}
                  max={LIMITS.rate.max}
                  step={5}
                  snap={(v) => Math.round(v / 5) * 5}
                  format={(v) => fmt0(v)}
                  unit="/hr"
                  onInput={(v) => set('rate', v)}
                  onCommit={(v) => set('rate', v)}
                />
                <Slider
                  label="Minutes assembling a report"
                  hint="receipts, coding, exports"
                  value={state.minsPerReport}
                  min={LIMITS.minsPerReport.min}
                  max={LIMITS.minsPerReport.max}
                  step={1}
                  snap={(v) => Math.round(v)}
                  format={(v) => `${v} min`}
                  onInput={(v) => set('minsPerReport', v)}
                  onCommit={(v) => set('minsPerReport', v)}
                />
                <Slider
                  label="Minutes chasing each approval"
                  hint="the following-up tax"
                  value={state.chaseMins}
                  min={LIMITS.chaseMins.min}
                  max={LIMITS.chaseMins.max}
                  step={5}
                  snap={(v) => Math.round(v / 5) * 5}
                  format={(v) => `${v} min`}
                  onInput={(v) => set('chaseMins', v)}
                  onCommit={(v) => set('chaseMins', v)}
                />
                <Slider
                  label="Time Ledgerline removes"
                  hint="capture, routing, sync"
                  value={state.cutPct}
                  min={LIMITS.cutPct.min}
                  max={LIMITS.cutPct.max}
                  step={1}
                  snap={(v) => Math.round(v)}
                  format={(v) => `${v}%`}
                  unit="%"
                  onInput={(v) => set('cutPct', v)}
                  onCommit={(v) => set('cutPct', v)}
                />
              </div>

              <div className="ll-bars" aria-hidden="true">
                <div className="ll-bar">
                  <span className="ll-bar__label">Today — {roi.beforeMins} min a report</span>
                  <span className="ll-bar__track">
                    <span className="ll-bar__fill ll-bar__fill--before" style={{ width: `${(roi.beforeMins / barMax) * 100}%` }} />
                  </span>
                </div>
                <div className="ll-bar">
                  <span className="ll-bar__label">With Ledgerline — {roi.afterMins} min a report</span>
                  <span className="ll-bar__track">
                    <span className="ll-bar__fill ll-bar__fill--after" style={{ width: `${(roi.afterMins / barMax) * 100}%` }} />
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* ------------------------------------------------ quote column */}
          <aside className="ll-panel" aria-label="Your quote">
            <div className="ll-panel__in">
              <div className="ll-panel__top">
                <p className="ll-panel__overline">Live quote · {quote.cycle} billing</p>
                <p className="ll-panel__ref">{quote.ref}</p>
              </div>

              <p className="ll-panel__plan">
                <Ledgermark night />
                <span>
                  {quote.active.plan.name}
                  {quote.pinned ? <small>pinned by you</small> : <small>recommended for these numbers</small>}
                </span>
              </p>

              <p className="ll-big">
                <span className="ll-big__label">Effective per month</span>
                <b>{fmt0(effMonthly)}</b>
                <span className="ll-big__sub">
                  {quote.cycle === 'annual'
                    ? `${fmt2(quote.cycleAmount)} settled once a year`
                    : `${fmt2(quote.cycleAmount)} each month, cancel anytime`}
                </span>
              </p>

              <dl className="ll-rows">
                <div>
                  <dt>
                    {quote.active.plan.name} base · {quote.active.plan.includedSeats} seats in
                  </dt>
                  <dd>{fmt2(quote.active.plan.base)}</dd>
                </div>
                {quote.active.extraSeats > 0 && (
                  <div>
                    <dt>
                      {quote.active.extraSeats} extra seats × {fmt2(quote.active.plan.perSeat)}
                    </dt>
                    <dd>{fmt2(quote.active.seatCost)}</dd>
                  </div>
                )}
                {quote.active.overReports > 0 ? (
                  <div>
                    <dt>
                      {fmtInt(quote.active.overReports)} reports over × {quote.active.plan.overage.toFixed(2)}
                    </dt>
                    <dd>{fmt2(quote.active.usageCost)}</dd>
                  </div>
                ) : (
                  <div>
                    <dt>Usage</dt>
                    <dd>within allowance</dd>
                  </div>
                )}
                {quote.deal && (
                  <div className="ll-rows__deal">
                    <dt>
                      {quote.deal.code} — {quote.deal.pct}% × {quote.deal.months} mo
                    </dt>
                    <dd>−{fmt2(quote.discountValue)}</dd>
                  </div>
                )}
                <div className="ll-rows__total">
                  <dt>Year one, all in</dt>
                  <dd>{fmt2(quote.yearOneTotal)}</dd>
                </div>
              </dl>

              <div className="ll-stats">
                <div className="ll-stat">
                  <span className="ll-stat__label">Hours back / month</span>
                  <b>{fmtHrs(hoursSaved)}</b>
                  <small>{roi.beforeMins} → {roi.afterMins} min a report</small>
                </div>
                <div className="ll-stat">
                  <span className="ll-stat__label">Worth about</span>
                  <b>{fmt0(valueMonthly)}</b>
                  <small>a month at {fmt0(state.rate)}/hr</small>
                </div>
                <div className="ll-stat">
                  <span className="ll-stat__label">Return on plan</span>
                  <b>{fmtX(roi.multiple)}×</b>
                  <small>value ÷ monthly cost</small>
                </div>
                <div className="ll-stat">
                  <span className="ll-stat__label">Pays for itself</span>
                  <b>{roi.paybackDays <= 1 ? 'same day' : `day ${roi.paybackDays}`}</b>
                  <small>of a 30-day month</small>
                </div>
              </div>

              <div className="ll-actions">
                <button type="button" className="ll-btn ll-btn--paper" onClick={copyLink}>
                  {copied ? 'Copied — paste it anywhere' : 'Copy shareable quote link'}
                </button>
                <button type="button" className="ll-btn ll-btn--outline" onClick={() => window.print()}>
                  Print the quote sheet
                </button>
              </div>

              <p className="ll-fineprint">
                Illustrative numbers from a fictional expense platform. AUD, ex-GST. The link really does
                carry the whole calculator state — send it to your CFO and watch the slider positions
                survive the journey.
              </p>
              <p className="ll-resetrow">
                <button type="button" className="ll-linkbtn ll-linkbtn--night" onClick={startOver}>
                  Start over
                </button>
              </p>
            </div>
          </aside>
        </main>

        {/* ---------------------------------------------- plan matrix */}
        <section className="ll-matrix-wrap" aria-labelledby="ll-h-matrix">
          <div className="ll-matrix-head">
            <h2 id="ll-h-matrix">All four plans, priced against your numbers</h2>
            <p>
              The green frame follows the cheapest fit; pinning is yours.{' '}
              {quote.pinned && (
                <button type="button" className="ll-linkbtn" onClick={() => set('plan', 'auto')}>
                  Return to our recommendation
                </button>
              )}
            </p>
          </div>
          <div className="ll-matrix" role="radiogroup" aria-label="Choose a plan">
            {quote.prices.map((p) => (
              <PlanCard
                key={p.plan.id}
                price={p}
                cycle={state.cycle}
                recommendedId={quote.recommended.plan.id}
                pinnedId={quote.pinned ? (state.plan as string) : null}
                seats={state.seats}
                onPin={(id) => {
                  set('plan', id)
                  say(id === 'auto' ? 'Back to the recommended plan.' : `${PLANS.find((x) => x.id === id)?.name} pinned.`)
                }}
              />
            ))}
          </div>
        </section>
      </div>

      {/* ================= quote sheet (the print view, always on screen) ================= */}
      <section className="ll-sheet" aria-labelledby="ll-h-sheet">
        <div className="ll-sheet__paper">
          <header className="ll-sheet__head">
            <p className="ll-logo ll-logo--sheet">
              <Ledgermark />
              <span>
                Ledger<b>line</b>
              </span>
            </p>
            <div className="ll-sheet__meta">
              <h2 id="ll-h-sheet">Quote {quote.ref}</h2>
              <p>
                Prepared{' '}
                {typeof document !== 'undefined'
                  ? new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
                  : ''}
              </p>
            </div>
          </header>

          <dl className="ll-sheet__config">
            <div>
              <dt>Seats</dt>
              <dd>{fmtInt(state.seats)}</dd>
            </div>
            <div>
              <dt>Reports / month</dt>
              <dd>{fmtInt(state.reports)}</dd>
            </div>
            <div>
              <dt>Plan</dt>
              <dd>{quote.active.plan.name}</dd>
            </div>
            <div>
              <dt>Billing</dt>
              <dd>{quote.cycle === 'annual' ? 'Annual (pay 10, get 12)' : 'Monthly'}</dd>
            </div>
            {quote.deal && (
              <div>
                <dt>Code</dt>
                <dd>
                  {quote.deal.code} (−{quote.deal.pct}% × {quote.deal.months} mo)
                </dd>
              </div>
            )}
          </dl>

          <table className="ll-sheet__table">
            <caption className="ll-sr">
              Itemised price for the {quote.active.plan.name} plan
            </caption>
            <tbody>
              <tr>
                <th scope="row">
                  {quote.active.plan.name} base — {quote.active.plan.includedSeats} seats, {fmtInt(quote.active.plan.includedReports)} reports/mo included
                </th>
                <td>{fmt2(quote.active.plan.base)}</td>
              </tr>
              <tr>
                <th scope="row">
                  Seats — {fmtInt(state.seats)} total
                  {quote.active.extraSeats > 0 && `, ${quote.active.extraSeats} extra at ${fmt2(quote.active.plan.perSeat)}`}
                </th>
                <td>{quote.active.extraSeats > 0 ? fmt2(quote.active.seatCost) : 'included'}</td>
              </tr>
              <tr>
                <th scope="row">
                  Usage — {fmtInt(state.reports)} reports
                  {quote.active.overReports > 0 && `, ${fmtInt(quote.active.overReports)} over at ${quote.active.plan.overage.toFixed(2)}`}
                </th>
                <td>{quote.active.overReports > 0 ? fmt2(quote.active.usageCost) : 'within allowance'}</td>
              </tr>
              <tr className="ll-sheet__subtotal">
                <th scope="row">Monthly total</th>
                <td>{fmt2(quote.active.monthly)}</td>
              </tr>
              {quote.cycle === 'annual' && (
                <>
                  <tr>
                    <th scope="row">Annual billing — 12 months for the price of 10</th>
                    <td>−{fmt2(quote.annualSaving)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Billed once a year</th>
                    <td>{fmt2(quote.cycleAmount)}</td>
                  </tr>
                </>
              )}
              {quote.deal && (
                <tr>
                  <th scope="row">
                    {quote.deal.code} — {quote.deal.note}
                  </th>
                  <td>−{fmt2(quote.discountValue)}</td>
                </tr>
              )}
              <tr className="ll-sheet__grand">
                <th scope="row">Year one, all in</th>
                <td>{fmt2(quote.yearOneTotal)}</td>
              </tr>
            </tbody>
          </table>

          <div className="ll-sheet__roi">
            <p>
              <b>The other side of the ledger.</b> At {fmt0(state.rate)}/hr, {roi.beforeMins} minutes a
              report becomes {roi.afterMins}. Across {fmtInt(state.reports)} reports a month that's{' '}
              <b>{fmtHrs(roi.hoursSaved)} hours back</b> — worth about <b>{fmt0(roi.valueMonthly)}</b> a
              month, or {fmtX(roi.multiple)}× the cost of the plan. {' '}
              {roi.paybackDays <= 1 ? 'It pays for itself the same day.' : `Pays for itself by day ${roi.paybackDays}.`}
            </p>
          </div>

          <footer className="ll-sheet__foot">
            <p>
              Valid for 30 days. Prices in AUD, ex-GST, and entirely illustrative — Ledgerline is a
              fictional company and this is a working calculator demo. Shareable URL: {shareUrl(state)}
            </p>
          </footer>
        </div>
      </section>
    </div>
  )
}
