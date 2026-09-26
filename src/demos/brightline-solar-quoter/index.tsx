import { useEffect, useMemo, useRef, useState } from 'react'
import './demo.css'
import Compass from './Compass'
import SavingsChart from './charts'
import {
  ADDRESSES,
  BATTERIES,
  MIN_PANELS,
  PITCHES,
  ROOFS,
  SHADES,
  computeQuote,
  fmtKw,
  fmtKwh,
  fmtMoney,
  type QuoteConfig,
} from './data'

/**
 * Brightline Solar — instant quote engine.
 * Art direction: bright optimistic energy — warm white, sun-gold and deep
 * teal; chunky numerals; every number recomputes live and counts up (static
 * under reduced motion). All addresses, rebates and figures are mocked AU
 * fixtures; Brightline Solar is fictional.
 */

const STORAGE_KEY = 'brightline-solar-quote-v1'

const DEFAULTS: QuoteConfig = {
  addressId: 'bondi',
  orientationId: 'N',
  pitchId: 'standard',
  roofId: 'medium',
  shadeId: 'none',
  billQuarter: 420,
  panels: null,
  batteryId: 'none',
}

function loadConfig(): QuoteConfig {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<QuoteConfig>
    return { ...DEFAULTS, ...parsed }
  } catch {
    return DEFAULTS
  }
}

// ------------------------------------------------------------ hooks

function useReducedMotion(): boolean {
  const [rm, setRm] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setRm(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return rm
}

/** Eases a number toward `target`; snaps instantly under reduced motion. */
function useCountUp(target: number, duration = 850): number {
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

// ------------------------------------------------- booking-day helpers

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function nextVisitDays(): { iso: string; label: string }[] {
  const out: { iso: string; label: string }[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (out.length < 4) {
    if (d.getDay() !== 0) {
      out.push({ iso: d.toISOString().slice(0, 10), label: `${WD[d.getDay()]} ${d.getDate()} ${MO[d.getMonth()]}` })
    }
    d.setDate(d.getDate() + 1)
  }
  return out
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// ------------------------------------------------------------ component

export default function BrightlineSolarQuoter() {
  const [cfg, setCfg] = useState<QuoteConfig>(loadConfig)
  const q = useMemo(() => computeQuote(cfg), [cfg])

  // address combobox
  const [query, setQuery] = useState('')
  const [listOpen, setListOpen] = useState(false)
  const [hi, setHi] = useState(-1)

  // email-the-quote
  const [quoteEmail, setQuoteEmail] = useState('')
  const [quoteEmailError, setQuoteEmailError] = useState('')
  const [sending, setSending] = useState(false)
  const [sentTo, setSentTo] = useState('')

  // booking
  const [bookingOpen, setBookingOpen] = useState(false)
  const [booking, setBooking] = useState({ name: '', email: '', dayIso: '', window: 'morning' })
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({})
  const [bookingBusy, setBookingBusy] = useState(false)
  const [booked, setBooked] = useState<{ ref: string; dayLabel: string } | null>(null)
  const [announce, setAnnounce] = useState('')

  const visitDays = useMemo(nextVisitDays, [])
  const bookingRef = useRef<HTMLDivElement>(null)

  // persist config
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
    } catch {
      /* private mode — carry on */
    }
  }, [cfg])

  // animated summary numbers
  const net = useCountUp(q.net)
  const year1 = useCountUp(q.savingYear1)
  const newQ = useCountUp(q.newQuarter)
  const tenYear = useCountUp(Math.max(0, q.grossTenYear))

  const set = <K extends keyof QuoteConfig>(key: K, value: QuoteConfig[K]) =>
    setCfg((prev) => ({ ...prev, [key]: value }))

  const matches = useMemo(() => {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return ADDRESSES
    return ADDRESSES.filter((a) => {
      const hay = `${a.line} ${a.suburb} ${a.state} ${a.postcode}`.toLowerCase()
      return tokens.every((t) => hay.includes(t))
    }).slice(0, 6)
  }, [query])

  const pickAddress = (id: string) => {
    const a = ADDRESSES.find((x) => x.id === id)
    if (!a) return
    set('addressId', id)
    setQuery(`${a.line}, ${a.suburb} ${a.state}`)
    setListOpen(false)
    setHi(-1)
  }

  const sendQuoteByEmail = () => {
    if (!EMAIL_RE.test(quoteEmail.trim())) {
      setQuoteEmailError('That email looks off — e.g. you@home.com.au')
      return
    }
    setQuoteEmailError('')
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setSentTo(quoteEmail.trim())
      setAnnounce(`Quote emailed to ${quoteEmail.trim()}.`)
    }, 850)
  }

  const submitBooking = () => {
    const errs: Record<string, string> = {}
    if (booking.name.trim().length < 2) errs.name = 'A name to shout from the driveway, please.'
    if (!EMAIL_RE.test(booking.email.trim())) errs.email = 'We need a working email for the confirmation.'
    if (!booking.dayIso) errs.day = 'Pick a day that suits.'
    setBookingErrors(errs)
    if (Object.keys(errs).length > 0) return
    setBookingBusy(true)
    window.setTimeout(() => {
      setBookingBusy(false)
      const ref = `BLQ-${String(1000 + Math.floor(Math.random() * 9000))}`
      const dayLabel = visitDays.find((d) => d.iso === booking.dayIso)?.label ?? ''
      setBooked({ ref, dayLabel })
      setAnnounce(`Site visit booked for ${dayLabel}. Reference ${ref}.`)
    }, 950)
  }

  const startOver = () => {
    setCfg(DEFAULTS)
    setQuery('')
    setQuoteEmail('')
    setSentTo('')
    setBooking({ name: '', email: '', dayIso: '', window: 'morning' })
    setBookingOpen(false)
    setBooked(null)
    setBookingErrors({})
    setQuoteEmailError('')
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* fine */
    }
    window.scrollTo({ top: 0 })
  }

  const pct = Math.min(99, Math.round((q.savingYear1 / Math.max(1, q.annualUse)) * 100))

  return (
    <div className="bsq">
      <div className="bsq__sr" aria-live="polite">{announce}</div>

      {/* ------------------------------------------------ header */}
      <header className="bsq__head">
        <p className="bsq__logo">
          <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
            <circle cx="16" cy="16" r="7" fill="currentColor" className="bsq__logo-core" />
            <g className="bsq__logo-rays">
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i * 45 * Math.PI) / 180
                return (
                  <line
                    key={i}
                    x1={16 + 10 * Math.cos(a)}
                    y1={16 + 10 * Math.sin(a)}
                    x2={16 + 14 * Math.cos(a)}
                    y2={16 + 14 * Math.sin(a)}
                  />
                )
              })}
            </g>
          </svg>
          <span>
            Brightline <b>Solar</b>
          </span>
        </p>
        <p className="bsq__head-meta">
          Sunshine, engineered. · <a href="tel:1300552737">1300 55 27 37</a>
        </p>
      </header>

      {/* ------------------------------------------------ hero */}
      <section className="bsq__hero">
        <h1>A quote for your roof, in about <em>90 seconds</em>.</h1>
        <p>
          No pushy call. No email hostage-taking. Four honest questions, one
          live estimate — every number moves as you answer.
        </p>
        <ol className="bsq__hero-steps" aria-hidden="true">
          <li>Where</li><li>Roof</li><li>Power</li><li>Quote</li>
        </ol>
      </section>

      <main className="bsq__cols">
        {/* ============================================ question column */}
        <div className="bsq__flow">
          {/* ---------- 01 · address ---------- */}
          <section className="bsq__card" aria-labelledby="bsq-h-address">
            <h2 id="bsq-h-address" className="bsq__q-title"><span>01</span> Where's home?</h2>
            <p className="bsq__hint">
              Postcode and zone set your sun hours and rebates. Streets are fictional; the solar maths is real-ish.
            </p>

            <div className="bsq-combo">
              <div className="bsq-combo__fieldwrap">
                <input
                  id="bsq-address"
                  type="text"
                  role="combobox"
                  aria-expanded={listOpen}
                  aria-controls="bsq-addr-list"
                  aria-activedescendant={hi >= 0 && matches[hi] ? `bsq-opt-${matches[hi].id}` : undefined}
                  aria-autocomplete="list"
                  autoComplete="off"
                  placeholder="Type a suburb or postcode… e.g. Bondi"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setListOpen(true)
                    setHi(-1)
                  }}
                  onFocus={() => setListOpen(true)}
                  onBlur={() => window.setTimeout(() => setListOpen(false), 140)}
                  onKeyDown={(e) => {
                    if (!listOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                      setListOpen(true)
                      return
                    }
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      setHi((h) => Math.min(h + 1, matches.length - 1))
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      setHi((h) => Math.max(h - 1, 0))
                    } else if (e.key === 'Enter') {
                      if (hi >= 0 && matches[hi]) {
                        e.preventDefault()
                        pickAddress(matches[hi].id)
                      }
                    } else if (e.key === 'Escape') {
                      setListOpen(false)
                      setHi(-1)
                    }
                  }}
                />
                <button
                  type="button"
                  className="bsq-combo__lucky"
                  onClick={() => {
                    const a = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)]
                    pickAddress(a.id)
                  }}
                >
                  Surprise me
                </button>
              </div>

              {listOpen && (
                <ul className="bsq-combo__list" id="bsq-addr-list" role="listbox" aria-label="Matching addresses">
                  {matches.length === 0 && (
                    <li className="bsq-combo__empty" role="presentation">
                      No match in our fictional atlas — try “Bondi”, “Fitzroy” or a postcode like 4870.
                    </li>
                  )}
                  {matches.map((a, i) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        id={`bsq-opt-${a.id}`}
                        role="option"
                        aria-selected={a.id === q.address.id}
                        className={`bsq-combo__opt${i === hi ? ' bsq-combo__opt--hi' : ''}${a.id === q.address.id ? ' bsq-combo__opt--sel' : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          pickAddress(a.id)
                        }}
                        onMouseEnter={() => setHi(i)}
                      >
                        <span className="bsq-combo__opt-line">{a.line}, {a.suburb}</span>
                        <span className="bsq-combo__opt-meta">{a.state} {a.postcode} · Zone {a.zone}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <dl className="bsq__locfacts">
              <div><dt>Quoting for</dt><dd>{q.address.line}, {q.address.suburb} {q.address.state}</dd></div>
              <div><dt>Rebate zone</dt><dd>Zone {q.address.zone}</dd></div>
              <div><dt>Peak sun</dt><dd>{q.address.sunHours.toFixed(1)} hrs/day</dd></div>
            </dl>
          </section>

          {/* ---------- 02 · roof ---------- */}
          <section className="bsq__card" aria-labelledby="bsq-h-roof">
            <h2 id="bsq-h-roof" className="bsq__q-title"><span>02</span> Tell us about the roof.</h2>

            <div className="bsq__roofgrid">
              <Compass selectedId={cfg.orientationId} onChange={(id) => set('orientationId', id)} />

              <div className="bsq__roofright">
                <fieldset className="bsq__group">
                  <legend>Pitch</legend>
                  <div className="bsq-seg" role="radiogroup" aria-label="Roof pitch">
                    {PITCHES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        role="radio"
                        aria-checked={p.id === cfg.pitchId}
                        className={`bsq-seg__btn${p.id === cfg.pitchId ? ' bsq-seg__btn--on' : ''}`}
                        onClick={() => set('pitchId', p.id)}
                      >
                        {p.label}
                        <small>{p.desc}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="bsq__group">
                  <legend>Roof size</legend>
                  <div className="bsq-seg bsq-seg--roofs" role="radiogroup" aria-label="Roof size">
                    {ROOFS.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        role="radio"
                        aria-checked={r.id === cfg.roofId}
                        className={`bsq-seg__btn${r.id === cfg.roofId ? ' bsq-seg__btn--on' : ''}`}
                        onClick={() => set('roofId', r.id)}
                      >
                        {r.label}
                        <small>{r.desc} · up to {r.capacity} panels</small>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="bsq__group">
                  <legend>Shade</legend>
                  <div className="bsq-seg" role="radiogroup" aria-label="How much shade hits the roof?">
                    {SHADES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={s.id === cfg.shadeId}
                        className={`bsq-seg__btn${s.id === cfg.shadeId ? ' bsq-seg__btn--on' : ''}`}
                        onClick={() => set('shadeId', s.id)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </section>

          {/* ---------- 03 · usage ---------- */}
          <section className="bsq__card" aria-labelledby="bsq-h-usage">
            <h2 id="bsq-h-usage" className="bsq__q-title"><span>03</span> What's the damage each quarter?</h2>
            <p className="bsq__hint">
              Your last power bill, roughly. We turn it into kWh and a baseline to beat.
            </p>

            <div className="bsq-slider">
              <div className="bsq-slider__readout">
                <b>${cfg.billQuarter.toLocaleString('en-AU')}</b>
                <span>per quarter</span>
              </div>
              <input
                id="bsq-bill"
                type="range"
                min={200}
                max={1000}
                step={10}
                value={cfg.billQuarter}
                aria-valuetext={`${cfg.billQuarter} dollars per quarter, about ${q.dailyKwh} kilowatt hours a day`}
                aria-label="Quarterly electricity bill"
                onChange={(e) => set('billQuarter', Number(e.target.value))}
              />
              <div className="bsq-slider__scale" aria-hidden="true">
                <span>$200<small>frugal</small></span>
                <span>$1000<small>heated pool</small></span>
              </div>
            </div>

            <dl className="bsq__usagefacts">
              <div><dt>Daily use</dt><dd>≈ {q.dailyKwh} kWh</dd></div>
              <div><dt>On the grid</dt><dd>≈ {fmtMoney(q.annualUse)}/yr</dd></div>
              <div><dt>Self-use assumed</dt><dd>{q.battery.kwh > 0 ? '~68% (with battery)' : '~35% (panels only)'}</dd></div>
            </dl>
          </section>

          {/* ---------- 04 · gear ---------- */}
          <section className="bsq__card" aria-labelledby="bsq-h-gear">
            <h2 id="bsq-h-gear" className="bsq__q-title"><span>04</span> The gear.</h2>

            <div className="bsq-panels">
              <div className="bsq-panels__stepper" role="group" aria-label="Number of panels">
                <button
                  type="button"
                  className="bsq-step"
                  aria-label="Fewer panels"
                  disabled={q.panels <= MIN_PANELS}
                  onClick={() => set('panels', q.panels - 1)}
                >
                  −
                </button>
                <div className="bsq-panels__count">
                  <b>{q.panels}</b>
                  <span>panels × 430 W</span>
                  <span className="bsq-panels__kw">{fmtKw(q.kw)} system</span>
                </div>
                <button
                  type="button"
                  className="bsq-step"
                  aria-label="More panels"
                  disabled={q.panels >= q.roof.capacity}
                  onClick={() => set('panels', q.panels + 1)}
                >
                  +
                </button>
              </div>
              <p className="bsq-panels__note">
                {cfg.panels === null ? (
                  <>Auto-sized to your usage: <b>{q.recommended}</b> of a max {q.roof.capacity} for this roof.</>
                ) : q.panels === q.recommended ? (
                  <>Spot on — that matches our recommendation for your usage.</>
                ) : q.panels < q.recommended ? (
                  <>We'd suggest <b>{q.recommended}</b> to cover that bill — your roof can take {q.roof.capacity}.</>
                ) : (
                  <>Generous. Exports pay ~6.5 c/kWh, so extra panels mostly earn feed-in.</>
                )}
                {cfg.panels !== null && (
                  <button type="button" className="bsq-linkbtn" onClick={() => set('panels', null)}>
                    Revert to recommended
                  </button>
                )}
              </p>
            </div>

            <fieldset className="bsq__group">
              <legend>Battery — stash the sunshine for tonight</legend>
              <div className="bsq__batteries" role="radiogroup" aria-label="Battery options">
                {BATTERIES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    role="radio"
                    aria-checked={b.id === cfg.batteryId}
                    className={`bsq-batt${b.id === cfg.batteryId ? ' bsq-batt--on' : ''}`}
                    onClick={() => set('batteryId', b.id)}
                  >
                    <span className="bsq-batt__top">
                      <b>{b.label}</b>
                      {b.kwh > 0 && <span className="bsq-batt__kwh">{b.kwh} kWh</span>}
                    </span>
                    <span className="bsq-batt__desc">{b.desc}</span>
                    <span className="bsq-batt__price">{b.price > 0 ? `+${fmtMoney(b.price)}` : 'Included'}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </section>
        </div>
        {/* ============================================ summary column */}
        <aside className="bsq__panel" aria-label="Your quote">
          <div className="bsq__panel-inner">
            <p className="bsq__panel-overline">Your estimate — illustrative</p>

            <p className="bsq__bignum">
              <span className="bsq__bignum-label">Installed, after rebates</span>
              <b>{fmtMoney(net)}</b>
            </p>

            <dl className="bsq__rows">
              <div><dt>{q.panels} panels + inverter</dt><dd>{fmtMoney(q.gross - q.battery.price)}</dd></div>
              {q.battery.price > 0 && (
                <div><dt>{q.battery.label} · {q.battery.kwh} kWh</dt><dd>{fmtMoney(q.battery.price)}</dd></div>
              )}
              <div className="bsq__row--rebate"><dt>Federal STC rebate (mocked)</dt><dd>−{fmtMoney(q.stc)}</dd></div>
              {q.stateAmount > 0 && (
                <div className="bsq__row--rebate"><dt>{q.stateLabel}</dt><dd>−{fmtMoney(q.stateAmount)}</dd></div>
              )}
            </dl>

            <div className="bsq__statgrid">
              <div className="bsq__stat bsq__stat--hero">
                <span className="bsq__stat-label">Year-one saving</span>
                <b>{fmtMoney(year1)}</b>
                <small>that's ~{pct}% off the bill you typed</small>
              </div>
              <div className="bsq__stat">
                <span className="bsq__stat-label">New quarterly bill</span>
                <b>{fmtMoney(newQ)}</b>
                <small>down from {fmtMoney(cfg.billQuarter)}</small>
              </div>
              <div className="bsq__stat">
                <span className="bsq__stat-label">Payback</span>
                <b>≈ {q.paybackYears.toFixed(1)} yrs</b>
                <small>{q.breakEven ? `break-even around year ${q.breakEven}` : 'past the 10-year view'}</small>
              </div>
              <div className="bsq__stat">
                <span className="bsq__stat-label">10-year savings</span>
                <b>{fmtMoney(tenYear)}</b>
                <small>{fmtKwh(q.annualGen)} generated / yr</small>
              </div>
            </div>

            <SavingsChart years={q.years} breakEven={q.breakEven} />

            <div className="bsq__actions">
              {!booked && (
                <button
                  type="button"
                  className="bsq__btn bsq__btn--primary"
                  aria-expanded={bookingOpen}
                  onClick={() => {
                    setBookingOpen((o) => !o)
                    if (!bookingOpen) {
                      window.setTimeout(() => bookingRef.current?.scrollIntoView({ block: 'nearest' }), 60)
                    }
                  }}
                >
                  {bookingOpen ? 'Close the booking form' : 'Book a free site visit'}
                </button>
              )}

              {/* email-the-quote */}
              <div className="bsq__emailquote">
                {sentTo ? (
                  <p className="bsq__sentline" role="status">
                    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                      <circle cx="8" cy="8" r="7.2" fill="none" stroke="currentColor" />
                      <path d="M4.5 8.4l2.3 2.3 4.7-5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    On its way to <b>{sentTo}</b> — check spam, the sun gets flagged a lot.
                  </p>
                ) : (
                  <>
                    <label className="bsq__emailrow" htmlFor="bsq-emailquote">
                      <input
                        id="bsq-emailquote"
                        type="email"
                        inputMode="email"
                        placeholder="Email me this quote — you@home.com.au"
                        value={quoteEmail}
                        aria-invalid={!!quoteEmailError}
                        aria-describedby={quoteEmailError ? 'bsq-emailerr' : undefined}
                        onChange={(e) => {
                          setQuoteEmail(e.target.value)
                          if (quoteEmailError) setQuoteEmailError('')
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            sendQuoteByEmail()
                          }
                        }}
                      />
                      <button type="button" className="bsq__btn bsq__btn--ghost" disabled={sending} onClick={sendQuoteByEmail}>
                        {sending ? 'Sending…' : 'Send'}
                      </button>
                    </label>
                    {quoteEmailError && <p className="bsq__error" id="bsq-emailerr" role="alert">{quoteEmailError}</p>}
                  </>
                )}
              </div>
            </div>

            {/* booking flow */}
            {!booked && bookingOpen && (
              <div className="bsq__booking" ref={bookingRef}>
                <h3 className="bsq__h3">A real human on your actual roof.</h3>
                <p className="bsq__hint">Forty minutes, ladder and drone. The quote gets sharpened or we tell you not to bother.</p>

                <div className="bsq__form">
                  <label className="bsq__field" htmlFor="bsq-bk-name">
                    <span>Name</span>
                    <input
                      id="bsq-bk-name"
                      type="text"
                      autoComplete="name"
                      value={booking.name}
                      aria-invalid={!!bookingErrors.name}
                      onChange={(e) => {
                        setBooking({ ...booking, name: e.target.value })
                        if (bookingErrors.name) setBookingErrors({ ...bookingErrors, name: '' })
                      }}
                    />
                    {bookingErrors.name && <span className="bsq__error">{bookingErrors.name}</span>}
                  </label>

                  <label className="bsq__field" htmlFor="bsq-bk-email">
                    <span>Email</span>
                    <input
                      id="bsq-bk-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={booking.email}
                      aria-invalid={!!bookingErrors.email}
                      onChange={(e) => {
                        setBooking({ ...booking, email: e.target.value })
                        if (bookingErrors.email) setBookingErrors({ ...bookingErrors, email: '' })
                      }}
                    />
                    {bookingErrors.email && <span className="bsq__error">{bookingErrors.email}</span>}
                  </label>

                  <fieldset className="bsq__group bsq__group--flush">
                    <legend>Day</legend>
                    <div className="bsq__days" role="radiogroup" aria-label="Preferred day">
                      {visitDays.map((d) => (
                        <button
                          key={d.iso}
                          type="button"
                          role="radio"
                          aria-checked={booking.dayIso === d.iso}
                          className={`bsq-day${booking.dayIso === d.iso ? ' bsq-day--on' : ''}`}
                          onClick={() => {
                            setBooking({ ...booking, dayIso: d.iso })
                            if (bookingErrors.day) setBookingErrors({ ...bookingErrors, day: '' })
                          }}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                    {bookingErrors.day && <span className="bsq__error" role="alert">{bookingErrors.day}</span>}
                  </fieldset>

                  <fieldset className="bsq__group bsq__group--flush">
                    <legend>Time of day</legend>
                    <div className="bsq-seg" role="radiogroup" aria-label="Time of day">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={booking.window === 'morning'}
                        className={`bsq-seg__btn${booking.window === 'morning' ? ' bsq-seg__btn--on' : ''}`}
                        onClick={() => setBooking({ ...booking, window: 'morning' })}
                      >
                        Morning
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={booking.window === 'afternoon'}
                        className={`bsq-seg__btn${booking.window === 'afternoon' ? ' bsq-seg__btn--on' : ''}`}
                        onClick={() => setBooking({ ...booking, window: 'afternoon' })}
                      >
                        Afternoon
                      </button>
                    </div>
                  </fieldset>

                  <button
                    type="button"
                    className="bsq__btn bsq__btn--primary bsq__btn--block"
                    disabled={bookingBusy}
                    onClick={submitBooking}
                  >
                    {bookingBusy ? 'Booking…' : `Lock it in — ${fmtMoney(q.net)} after rebates`}
                  </button>
                  <p className="bsq__fineprint">No deposit. No lock-in. Cancel up to the day before.</p>
                </div>
              </div>
            )}

            {/* booking success */}
            {booked && (
              <div className="bsq__booked">
                <div className="bsq__booked-tick" aria-hidden="true">
                  <svg viewBox="0 0 44 44" width="42" height="42">
                    <circle cx="22" cy="22" r="20" />
                    <path d="M13 22.5l6 6 12-13" />
                  </svg>
                </div>
                <h3 className="bsq__h3">Sorted, {booking.name.split(' ')[0] || 'friend'}.</h3>
                <p>
                  We'll be on the roof <b>{booked.dayLabel}</b> ({booking.window === 'morning' ? 'morning' : 'afternoon'}).
                  Your reference is <b className="bsq__mono">{booked.ref}</b> — confirmation is flying to{' '}
                  <b>{booking.email}</b> now.
                </p>
                <button type="button" className="bsq__btn bsq__btn--ghost" onClick={startOver}>
                  Quote another roof
                </button>
              </div>
            )}

            <p className="bsq__fineprint bsq__fineprint--foot">
              Estimates use mocked tariffs (33 c/kWh, 6.5 c feed-in), 4% price rises and 0.6%/yr panel fade. Rebates
              are fictionalised AU-style incentives. Brightline Solar is a fictional installer; a real site visit
              sharpens everything — roofs contain spiders.
            </p>
            <p className="bsq__resetrow">
              <button type="button" className="bsq-linkbtn" onClick={startOver}>
                Start over
              </button>
            </p>
          </div>
        </aside>
      </main>
    </div>
  )
}
