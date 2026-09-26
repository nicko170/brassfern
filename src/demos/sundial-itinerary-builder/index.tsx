import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  JOURNEYS,
  JOURNEY_BY_ID,
  MODE_LABEL,
  FEE_PER_DAY,
  MONTHS,
  TIER_MULTIPLIER,
  aud,
  fmtDuration,
  checkAvailability,
  suggestedMonths,
  journeyPerDay,
  type Availability,
  type Journey,
  type Mode,
  type StayTier,
} from './data'
import './demo.css'

/**
 * Sundial — slow-travel itinerary builder & booking.
 * Art direction: golden-hour warmth — sand, terracotta, deep teal,
 * journal-editorial type. Choose journeys, drag days into your own order,
 * watch an honest total assemble itself, then request the trip.
 * Plan persists to localStorage. All data and availability are fictional.
 */

const MAX_DAYS = 10
const PLAN_KEY = 'sdi-plan-v1'

interface PlanDay {
  uid: string
  journeyId: string
  dayIndex: number
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

interface Stored {
  days: PlanDay[]
  tier: StayTier
  month: number
}

function isStored(v: unknown): v is Stored {
  const s = v as Stored
  return (
    !!s &&
    typeof s === 'object' &&
    Array.isArray(s.days) &&
    s.days.every(
      (d) =>
        d &&
        typeof d.uid === 'string' &&
        JOURNEY_BY_ID.has(d.journeyId) &&
        Number.isInteger(d.dayIndex) &&
        d.dayIndex >= 0 &&
        d.dayIndex < JOURNEY_BY_ID.get(d.journeyId)!.days.length,
    ) &&
    (s.tier === 'family' || s.tier === 'boutique') &&
    Number.isInteger(s.month) &&
    s.month >= 0 &&
    s.month <= 11
  )
}

function defaultPlan(): Stored {
  return {
    days: JOURNEY_BY_ID.get('bookshop-line')!.days.map((_, i) => ({
      uid: uid(),
      journeyId: 'bookshop-line',
      dayIndex: i,
    })),
    tier: 'family',
    month: 4,
  }
}

function readPlan(): Stored {
  try {
    if (typeof localStorage === 'undefined') return defaultPlan()
    const raw = localStorage.getItem(PLAN_KEY)
    if (!raw) return defaultPlan()
    const parsed: unknown = JSON.parse(raw)
    return isStored(parsed) ? parsed : defaultPlan()
  } catch {
    return defaultPlan()
  }
}

function round5(n: number): number {
  return Math.round(n / 5) * 5
}

export default function SundialItineraryBuilder() {
  const [stored, setStored] = useState<Stored>(readPlan)
  const [sheetJourney, setSheetJourney] = useState<string | null>(null)
  const [requestOpen, setRequestOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [dragUid, setDragUid] = useState<string | null>(null)
  const rowRefs = useRef(new Map<string, HTMLLIElement>())
  const triggerRef = useRef<HTMLElement | null>(null)
  const requestBtnRef = useRef<HTMLButtonElement | null>(null)

  const { days: plan, tier, month } = stored

  useEffect(() => {
    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify(stored))
    } catch {
      /* private mode — session plan still works */
    }
  }, [stored])

  const announce = useCallback((msg: string) => {
    setNotice('')
    requestAnimationFrame(() => setNotice(msg))
  }, [])

  /* ---------------- plan operations ---------------- */

  const addJourney = useCallback(
    (j: Journey) => {
      setStored((prev) => {
        if (prev.days.length + j.days.length > MAX_DAYS) return prev
        const fresh = j.days.map((_, i) => ({ uid: uid(), journeyId: j.id, dayIndex: i }))
        return { ...prev, days: [...prev.days, ...fresh] }
      })
      announce(`${j.name} added — ${j.days.length} days pinned to your itinerary.`)
    },
    [announce],
  )

  const removeDay = useCallback(
    (u: string) => {
      setStored((prev) => ({ ...prev, days: prev.days.filter((d) => d.uid !== u) }))
      announce('Day removed.')
    },
    [announce],
  )

  const moveDay = useCallback((u: string, to: number) => {
    setStored((prev) => {
      const from = prev.days.findIndex((d) => d.uid === u)
      if (from < 0) return prev
      const clamped = Math.max(0, Math.min(prev.days.length - 1, to))
      if (clamped === from) return prev
      const next = prev.days.slice()
      const [item] = next.splice(from, 1)
      next.splice(clamped, 0, item)
      return { ...prev, days: next }
    })
  }, [])

  const clearPlan = useCallback(() => {
    setStored((prev) => ({ ...prev, days: [] }))
    announce('Itinerary cleared. The shelf is still full.')
  }, [announce])

  const setTier = useCallback((t: StayTier) => setStored((prev) => ({ ...prev, tier: t })), [])
  const setMonth = useCallback((m: number) => setStored((prev) => ({ ...prev, month: m })), [])

  /* ---------------- derived ---------------- */

  const journeyIdsInPlan = useMemo(
    () => [...new Set(plan.map((p) => p.journeyId))],
    [plan],
  )

  const totals = useMemo(() => {
    let travel = 0
    let sleep = 0
    let extras = 0
    for (const p of plan) {
      const d = JOURNEY_BY_ID.get(p.journeyId)!.days[p.dayIndex]
      travel += d.travel
      sleep += round5(d.sleep * TIER_MULTIPLIER[tier])
      extras += (d.extras ?? []).reduce((s, e) => s + e.cost, 0)
    }
    const fee = plan.length * FEE_PER_DAY
    return { travel, sleep, extras, fee, total: travel + sleep + extras + fee }
  }, [plan, tier])

  /* ---------------- drag-to-reorder (pointer) ---------------- */

  const onDragMove = useCallback(
    (clientY: number) => {
      if (!dragUid) return
      let target: number | null = null
      plan.forEach((p, i) => {
        const el = rowRefs.current.get(p.uid)
        if (!el) return
        const r = el.getBoundingClientRect()
        if (clientY < r.top + r.height / 2 && target === null) target = i
      })
      if (target === null) target = plan.length - 1
      const from = plan.findIndex((p) => p.uid === dragUid)
      if (target !== from && target !== null) moveDay(dragUid, target)
    },
    [dragUid, plan, moveDay],
  )

  useEffect(() => {
    if (!dragUid) return
    const onMove = (e: PointerEvent) => onDragMove(e.clientY)
    const onUp = () => {
      announce('Day moved.')
      setDragUid(null)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragUid, onDragMove, announce])

  /* ---------------- dialog plumbing ---------------- */

  const anyDialog = sheetJourney !== null || requestOpen
  useEffect(() => {
    if (!anyDialog) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDialogs()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anyDialog])

  const closeDialogs = useCallback(() => {
    setSheetJourney(null)
    setRequestOpen(false)
    triggerRef.current?.focus()
  }, [])

  const openJourney = (id: string, from: HTMLElement) => {
    triggerRef.current = from
    setSheetJourney(id)
  }

  const openRequest = (from: HTMLElement) => {
    triggerRef.current = from
    setRequestOpen(true)
  }

  const sheetData = sheetJourney ? JOURNEY_BY_ID.get(sheetJourney) ?? null : null

  return (
    <div className="sd">
      <a className="sd-skip" href="#sd-planner">
        Skip to your itinerary
      </a>

      <header className="sd-head">
        <a className="sd-word" href="#sd-top" aria-label="Sundial Travel home">
          <SundialMark /> Sundial
        </a>
        <nav className="sd-nav" aria-label="Sections">
          <a href="#sd-journeys">Journeys</a>
          <a href="#sd-planner">Itinerary</a>
          <a href="#sd-fees">The fee, up front</a>
        </nav>
        <button
          type="button"
          ref={requestBtnRef}
          className="sd-req"
          onClick={(e) => openRequest(e.currentTarget)}
          disabled={plan.length === 0}
          aria-label={
            plan.length === 0
              ? 'Request this trip — add days to your itinerary first'
              : `Request this trip — ${plan.length} days, ${aud(totals.total)}`
          }
        >
          Request this trip
          {plan.length > 0 && <span className="sd-req__sum">{aud(totals.total)}</span>}
        </button>
      </header>

      <main id="sd-top">
        {/* ---------------- hero ---------------- */}
        <section className="sd-hero">
          <p className="sd-eyebrow">Sundial Travel · slow journeys by rail, ferry and foot · Sydney → the world</p>
          <h1 className="sd-h1">
            Plan the trip you keep <em>thinking about</em>.
          </h1>
          <p className="sd-lede">
            Pin journeys to the board, drag the days into your own order, and watch a price that
            already includes our fee assemble itself. No dates yet. No scarcity theatre. Just a
            good plan, priced honestly.
          </p>
          <div className="sd-hero__cta">
            <a className="sd-btn" href="#sd-journeys">
              Browse the six journeys
            </a>
            <a className="sd-btn sd-btn--bare" href="#sd-planner">
              Go to your itinerary
            </a>
          </div>
        </section>

        {/* ---------------- journey shelf ---------------- */}
        <section className="sd-shelf" id="sd-journeys" aria-label="Journey collection">
          <div className="sd-shelf__head">
            <h2 className="sd-h2">Six journeys, pinned to the wall.</h2>
            <p>
              Each one is a route our planners have actually ridden, priced for two in family-run
              rooms. Add whole journeys, then drag days around. Or look inside first — every leg
              is listed.
          </p>
          </div>
          <ul className="sd-grid">
            {JOURNEYS.map((j) => {
              const wouldOverflow = plan.length + j.days.length > MAX_DAYS
              return (
                <li key={j.id} className="sd-card">
                  <button
                    type="button"
                    className="sd-card__artwrap"
                    onClick={(e) => openJourney(j.id, e.currentTarget)}
                    aria-label={`Open ${j.name} route details`}
                  >
                    <JourneyArt j={j} />
                    <span className="sd-card__days">{j.days.length} days</span>
                  </button>
                  <div className="sd-card__body">
                    <h3>{j.name}</h3>
                    <p className="sd-card__region">{j.region}</p>
                    <ul className="sd-moods" aria-label="Mood">
                      {j.mood.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                    <p className="sd-card__season">{j.seasonNote}</p>
                    <div className="sd-card__foot">
                      <span className="sd-card__price">
                        from <strong>{aud(journeyPerDay(j))}</strong>/day for two
                      </span>
                      <span className="sd-card__actions">
                        <button
                          type="button"
                          className="sd-mini"
                          onClick={(e) => openJourney(j.id, e.currentTarget)}
                        >
                          The route
                        </button>
                        <button
                          type="button"
                          className="sd-add"
                          disabled={wouldOverflow}
                          title={wouldOverflow ? `Ten days is the most we trust a memory to hold — remove some first.` : `Add all ${j.days.length} days to your itinerary`}
                          onClick={() => addJourney(j)}
                        >
                          + Add
                        </button>
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ---------------- planner ---------------- */}
        <section className="sd-planner" id="sd-planner" aria-label="Your itinerary">
          <div className="sd-planner__head">
            <h2 className="sd-h2">Your itinerary, your order.</h2>
            <p>
              Drag the handle, use the arrows, however you like — the arithmetic follows. Ten days
              is the most we trust a memory to hold; after that we start a second board.
            </p>
          </div>

          <div className="sd-planner__grid">
            <div>
              {plan.length === 0 ? (
                <div className="sd-empty">
                  <p>
                    <strong>The board is bare.</strong> A good trip starts with one pin.
                  </p>
                  <div className="sd-empty__cta">
                    <button
                      type="button"
                      className="sd-btn"
                      onClick={() =>
                        JOURNEY_BY_ID.get('bookshop-line') && addJourney(JOURNEY_BY_ID.get('bookshop-line')!)
                      }
                    >
                      Start with the Bookshop Line
                    </button>
                    <a className="sd-btn sd-btn--bare" href="#sd-journeys">
                      Browse the shelf
                    </a>
                  </div>
                </div>
              ) : (
                <ol className="sd-days">
                  {plan.map((p, i) => {
                    const j = JOURNEY_BY_ID.get(p.journeyId)!
                    const d = j.days[p.dayIndex]
                    const dayCost =
                      d.travel +
                      round5(d.sleep * TIER_MULTIPLIER[tier]) +
                      (d.extras ?? []).reduce((s, e) => s + e.cost, 0)
                    return (
                      <li
                        key={p.uid}
                        ref={(el) => {
                          if (el) rowRefs.current.set(p.uid, el)
                          else rowRefs.current.delete(p.uid)
                        }}
                        className="sd-day"
                        data-dragging={dragUid === p.uid || undefined}
                      >
                        <span className="sd-day__no" aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="sd-day__main">
                          <p className="sd-day__title">{d.title}</p>
                          <p className="sd-day__route">
                            <ModeIcon mode={d.mode} />
                            <span>
                              {d.from} → {d.to}
                              {d.durationMin > 0 && (
                                <em>
                                  {' '}
                                  · {MODE_LABEL[d.mode]} · {fmtDuration(d.durationMin)}
                                </em>
                              )}
                            </span>
                          </p>
                          <p className="sd-day__stay">Sleep: {d.stay}</p>
                        </div>
                        <div className="sd-day__side">
                          <span className="sd-day__cost">{aud(dayCost)}</span>
                          <span className="sd-day__journey">{j.name}</span>
                        </div>
                        <div className="sd-day__ctl">
                          <button
                            type="button"
                            className="sd-grip"
                            aria-label={`Drag to reorder day ${i + 1}, ${d.title}. Use arrow keys to move.`}
                            onPointerDown={(e) => {
                              e.preventDefault()
                              setDragUid(p.uid)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowUp') {
                                e.preventDefault()
                                moveDay(p.uid, i - 1)
                                announce(`Day moved up to position ${Math.max(1, i)}.`)
                              }
                              if (e.key === 'ArrowDown') {
                                e.preventDefault()
                                moveDay(p.uid, i + 1)
                                announce(`Day moved down to position ${Math.min(plan.length, i + 2)}.`)
                              }
                            }}
                          >
                            ⠿
                          </button>
                          <span className="sd-day__arrows">
                            <button
                              type="button"
                              aria-label={`Move day ${i + 1} up`}
                              disabled={i === 0}
                              onClick={() => {
                                moveDay(p.uid, i - 1)
                                announce(`Day moved up to position ${i}.`)
                              }}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              aria-label={`Move day ${i + 1} down`}
                              disabled={i === plan.length - 1}
                              onClick={() => {
                                moveDay(p.uid, i + 1)
                                announce(`Day moved down to position ${i + 2}.`)
                              }}
                            >
                              ↓
                            </button>
                          </span>
                          <button
                            type="button"
                            className="sd-day__rm"
                            aria-label={`Remove day ${i + 1}, ${d.title}`}
                            onClick={() => removeDay(p.uid)}
                          >
                            ✕
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              )}
              {plan.length > 0 && (
                <p className="sd-planner__foot">
                  <button type="button" className="sd-mini sd-mini--danger" onClick={clearPlan}>
                    Clear the board
                  </button>
                  <span className="sd-days-count" aria-live="polite">
                    {plan.length} / {MAX_DAYS} days pinned
                  </span>
                </p>
              )}
            </div>

            {/* -------- totals card -------- */}
            <aside className="sd-total" aria-label="Trip estimate">
              <h3>The honest total</h3>
              <div className="sd-field">
                <span id="sd-tier-label">Rooms</span>
                <div className="sd-seg" role="group" aria-labelledby="sd-tier-label">
                  {(['family', 'boutique'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={tier === t}
                      data-on={tier === t || undefined}
                      onClick={() => setTier(t)}
                    >
                      {t === 'family' ? 'Family-run' : 'Boutique'}
                    </button>
                  ))}
                </div>
              </div>
              <label className="sd-field">
                <span>Start month</span>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <dl className="sd-ledger">
                <div>
                  <dt>Rail, ferries & passes</dt>
                  <dd>{aud(totals.travel)}</dd>
                </div>
                <div>
                  <dt>Nights ({tier === 'family' ? 'family-run' : 'boutique'})</dt>
                  <dd>{aud(totals.sleep)}</dd>
                </div>
                <div>
                  <dt>Booked experiences</dt>
                  <dd>{aud(totals.extras)}</dd>
                </div>
                <div className="sd-ledger__fee">
                  <dt>Sundial planning fee · {aud(FEE_PER_DAY)}/day</dt>
                  <dd>{aud(totals.fee)}</dd>
                </div>
                <div className="sd-ledger__grand">
                  <dt>For two travellers, incl. everything</dt>
                  <dd>{aud(totals.total)}</dd>
                </div>
              </dl>
              <p className="sd-total__note">
                Including our fee, taxes and the luggage-forwarding we always recommend. This is an
                estimate a planner will honour within 10% — usually under.
              </p>
              <button
                type="button"
                className="sd-btn sd-btn--full"
                disabled={plan.length === 0}
                onClick={(e) => openRequest(e.currentTarget)}
              >
                Request this trip →
              </button>
            </aside>
          </div>
        </section>

        {/* ---------------- fee honesty ---------------- */}
        <section className="sd-fees" id="sd-fees">
          <h2 className="sd-h2">
            The fee is on the price tag, <em>not in the fine print</em>.
          </h2>
          <div className="sd-fees__grid">
            <article>
              <h3>{aud(FEE_PER_DAY)} a day, stated first</h3>
              <p>
                That’s us: the planner who knows which village takes the morning light, the bookings
                made by phone, the seats facing the right way. We used to hide it in the rate. Now
                it’s a line item, and people trust the rest of the arithmetic because of it.
              </p>
            </article>
            <article>
              <h3>No scarcity theatre</h3>
              <p>
                Nothing on this page flashes “1 room left!”. When availability genuinely tightens,
                we say so plainly and suggest the months where it isn’t. Pressure converts once;
                honesty converts for years.
              </p>
            </article>
            <article>
              <h3>A quote you can check</h3>
              <p>
                Every leg, night and experience rolls up to the number you see. If a planner’s final
                quote differs by more than 10%, we show you exactly which assumption changed and why.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="sd-foot">
        <p>
          <strong>Sundial Travel</strong> — a fictional slow-travel company. Demo by Brassfern; the
          ferries, regrettably, do not actually wait for you.
        </p>
        <p className="sd-foot__mono">Surry Hills office · by appointment · the kettle is on</p>
      </footer>

      {/* ---------------- journey detail sheet ---------------- */}
      {sheetData && (
        <JourneySheet
          j={sheetData}
          disabled={plan.length + sheetData.days.length > MAX_DAYS}
          onClose={closeDialogs}
          onAdd={() => {
            addJourney(sheetData)
            closeDialogs()
          }}
        />
      )}

      {/* ---------------- request flow ---------------- */}
      {requestOpen && (
        <RequestSheet
          plan={plan}
          tier={tier}
          month={month}
          totals={totals}
          journeyIds={journeyIdsInPlan}
          onClose={closeDialogs}
          onMonthChange={setMonth}
          announce={announce}
        />
      )}

      <p className="sd-visually-hidden" role="status" aria-live="polite">
        {notice}
      </p>
    </div>
  )
}

/* ================= SVG bits ================= */

function SundialMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
      <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 13 L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 13 L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 20 h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ModeIcon({ mode }: { mode: Mode }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 16 16',
    'aria-hidden': true as const,
    focusable: false as const,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
  }
  switch (mode) {
    case 'rail':
      return (
        <svg {...common}>
          <rect x="3" y="2" width="10" height="9" rx="2" />
          <path d="M5 11 l-1.5 3 M11 11 l1.5 3 M3 7 h10" />
        </svg>
      )
    case 'ferry':
      return (
        <svg {...common}>
          <path d="M2 10 h12 l-2 3 h-8 z M8 10 V4 M8 4 l4 3" />
        </svg>
      )
    case 'walk':
      return (
        <svg {...common}>
          <circle cx="8" cy="2.5" r="1.4" />
          <path d="M8 4.5 v3.5 L5.5 12 M8 8 l2.5 2 M6 14.5 L5.5 12 M8 6 L11 7.5" />
        </svg>
      )
    case 'cycle':
      return (
        <svg {...common}>
          <circle cx="4" cy="11" r="2.4" />
          <circle cx="12" cy="11" r="2.4" />
          <path d="M4 11 L7 5 h3 l2 6 M7 5 L5.5 3.5" />
        </svg>
      )
    case 'bus':
      return (
        <svg {...common}>
          <rect x="2.5" y="3" width="11" height="8" rx="1.5" />
          <path d="M2.5 7 h11 M5 13.5 a1 1 0 1 0 0-.01 M11 13.5 a1 1 0 1 0 0-.01" />
        </svg>
      )
  }
}

/** Generative postcard: sun over sea and land, in the journey's palette. No text — the DOM does that. */
function JourneyArt({ j }: { j: Journey }) {
  const { art } = j
  const gid = `sdg-${j.id}`
  return (
    <svg className="sd-art" viewBox="0 0 400 220" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={art.sky1} />
          <stop offset=".55" stopColor={art.sky2} />
          <stop offset="1" stopColor={art.sky3} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#${gid})`} />
      <circle cx="272" cy="86" r="46" fill={art.sun} />
      <circle cx="272" cy="86" r="58" fill="none" stroke={art.sun} strokeOpacity=".35" />
      <path d="M0 150 Q 90 118 200 146 T 400 138 V220 H0 Z" fill={art.sea} />
      <path d="M0 176 Q 120 158 240 178 T 400 170 V220 H0 Z" fill={art.sea} opacity=".82" />
      <path d="M0 126 Q 70 96 150 118 Q 210 132 250 120 L 0 133 Z" fill={art.land} />
      <g stroke={art.sky1} strokeOpacity=".5" strokeWidth="2">
        <path d="M20 162 h 60 M110 172 h 44 M210 164 h 70 M300 176 h 55" strokeLinecap="round" />
      </g>
    </svg>
  )
}

/* ================= journey detail sheet ================= */

function JourneySheet({
  j,
  disabled,
  onClose,
  onAdd,
}: {
  j: Journey
  disabled: boolean
  onClose: () => void
  onAdd: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  return (
    <div className="sd-overlay" onClick={onClose}>
      <div
        className="sd-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sd-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" ref={closeRef} className="sd-close" onClick={onClose} aria-label="Close journey details">
          ✕
        </button>
        <div className="sd-sheet__art">
          <JourneyArt j={j} />
        </div>
        <div className="sd-sheet__main">
          <p className="sd-eyebrow">{j.region}</p>
          <h2 className="sd-sheet__title" id="sd-sheet-title">
            {j.name}
          </h2>
          <p className="sd-sheet__blurb">{j.blurb}</p>
          <p className="sd-sheet__season">
            <strong>When:</strong> {j.seasonNote}
          </p>

          <ol className="sd-route" aria-label="Day by day route">
            {j.days.map((d, i) => (
              <li key={i} className="sd-route__leg">
                <span className="sd-route__rail" aria-hidden="true" />
                <div className="sd-route__body">
                  <p className="sd-route__head">
                    <span className="sd-route__no">Day {i + 1}</span>
                    <strong>{d.title}</strong>
                  </p>
                  <p className="sd-route__meta">
                    <ModeIcon mode={d.mode} /> {d.from} → {d.to}
                    {d.durationMin > 0 && ` · ${MODE_LABEL[d.mode]}, ${fmtDuration(d.durationMin)}`}
                  </p>
                  <p className="sd-route__note">{d.note}</p>
                  <p className="sd-route__stay">
                    Sleep: {d.stay} · {aud(d.travel + d.sleep)} for two
                    {d.extras && ` (+ ${d.extras.map((e) => `${e.label} ${aud(e.cost)}`).join(', ')})`}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="sd-sheet__cta">
            <button type="button" className="sd-btn" onClick={onAdd} disabled={disabled}>
              {disabled ? 'Board’s full — remove a day first' : `Pin all ${j.days.length} days to my itinerary`}
            </button>
            <p className="sd-sheet__fine">Every leg editable after pinning. Nothing is booked yet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= request flow ================= */

interface Totals {
  travel: number
  sleep: number
  extras: number
  fee: number
  total: number
}

function RequestSheet({
  plan,
  tier,
  month,
  totals,
  journeyIds,
  onClose,
  onMonthChange,
  announce,
}: {
  plan: PlanDay[]
  tier: StayTier
  month: number
  totals: Totals
  journeyIds: string[]
  onClose: () => void
  onMonthChange: (m: number) => void
  announce: (m: string) => void
}) {
  const [step, setStep] = useState<'when' | 'you' | 'checking' | 'result'>('when')
  const [startMonth, setStartMonth] = useState(month)
  const [travellers, setTravellers] = useState(2)
  const [pace, setPace] = useState<'unhurried' | 'balanced' | 'sprightly'>('unhurried')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [noteText, setNoteText] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [ref, setRef] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    closeRef.current?.focus()
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const journeys = useMemo(
    () => journeyIds.map((id) => JOURNEY_BY_ID.get(id)!).filter(Boolean),
    [journeyIds],
  )

  const runCheck = (m: number) => {
    setStep('checking')
    announce('Checking the ledger for availability.')
    timerRef.current = window.setTimeout(() => {
      const a = checkAvailability(journeyIds, m)
      setAvailability(a)
      setRef(`SD-${1000 + Math.floor(Math.random() * 9000)}`)
      setStep('result')
      announce(a === 'waitlist' ? 'That month is fully booked.' : 'Availability confirmed.')
    }, 950)
  }

  const validateYou = (): boolean => {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = 'A name makes the first phone call warmer.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = 'That email won’t survive a mail server.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const suggestions = suggestedMonths(journeys, startMonth)
  const perTraveller = Math.round(totals.total / 2 / 5) * 5

  return (
    <div className="sd-overlay sd-overlay--right" onClick={onClose}>
      <aside
        className="sd-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Request this trip"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sd-drawer__head">
          <h2>
            {step === 'result' && availability !== 'waitlist'
              ? 'It’s on the books.'
              : step === 'result'
                ? 'That month’s gone.'
                : 'Request this trip'}
          </h2>
          <button type="button" ref={closeRef} className="sd-close" onClick={onClose} aria-label="Close request">
            ✕
          </button>
        </header>

        <p className="sd-drawer__sum">
          {plan.length} days · {journeys.map((j) => j.name).join(' + ') || 'no journeys'} ·{' '}
          {tier === 'family' ? 'family-run rooms' : 'boutique rooms'} ·{' '}
          <strong>{aud(totals.total)}</strong> for two (≈ {aud(perTraveller)}/traveller)
        </p>

        {step === 'when' && (
          <div className="sd-drawer__body">
            <h3 className="sd-h3">When, and how fast?</h3>
            <label className="sd-field">
              <span>Setting out in</span>
              <select value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <div className="sd-field">
              <span>Travellers</span>
              <div className="sd-stepper" aria-label="Number of travellers">
                <button
                  type="button"
                  onClick={() => setTravellers((n) => Math.max(1, n - 1))}
                  aria-label="Fewer travellers"
                >
                  −
                </button>
                <span aria-live="polite">
                  {travellers} {travellers === 1 ? 'traveller' : 'travellers'}
                </span>
                <button
                  type="button"
                  onClick={() => setTravellers((n) => Math.min(6, n + 1))}
                  aria-label="More travellers"
                >
                  +
                </button>
              </div>
            </div>

            <fieldset className="sd-field">
              <legend>Pace</legend>
              <div className="sd-seg">
                {(['unhurried', 'balanced', 'sprightly'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={pace === p}
                    data-on={pace === p || undefined}
                    onClick={() => setPace(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="sd-field__hint">
                {pace === 'unhurried'
                  ? 'One room, three nights minimum, long lunches protected.'
                  : pace === 'balanced'
                    ? 'A move every couple of days, one lazy anchor town.'
                    : 'You’ll see everything and sleep brilliantly. We’ll still talk you out of one day.'}
              </p>
            </fieldset>

            <button type="button" className="sd-btn sd-btn--full" onClick={() => setStep('you')}>
              Your details →
            </button>
          </div>
        )}

        {step === 'you' && (
          <form
            className="sd-drawer__body"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              if (validateYou()) runCheck(startMonth)
            }}
          >
            <h3 className="sd-h3">Nearly there.</h3>
            <label className="sd-field">
              <span>Your name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'sd-err-name' : undefined}
                autoComplete="name"
              />
              {errors.name && (
                <em className="sd-err" id="sd-err-name">
                  {errors.name}
                </em>
              )}
            </label>
            <label className="sd-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'sd-err-email' : undefined}
                autoComplete="email"
              />
              {errors.email && (
                <em className="sd-err" id="sd-err-email">
                  {errors.email}
                </em>
              )}
            </label>
            <label className="sd-field">
              <span>Anything we should know? (optional)</span>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Anniversary, coeliac, knees that object to stairs…"
              />
            </label>
            <div className="sd-drawer__row">
              <button type="button" className="sd-btn sd-btn--bare" onClick={() => setStep('when')}>
                ← Back
              </button>
              <button type="submit" className="sd-btn">
                Check {MONTHS[startMonth]} →
              </button>
            </div>
          </form>
        )}

        {step === 'checking' && (
          <div className="sd-drawer__body sd-checking" role="status">
            <span className="sd-spinner" aria-hidden="true" />
            <p>
              Ringing the guesthouses that don’t have websites…
              <br />
              <small>(this is a demo — the wait and the answer are both pretend)</small>
            </p>
          </div>
        )}

        {step === 'result' && availability && (
          <div className="sd-drawer__body">
            {availability === 'waitlist' ? (
              <>
                <p>
                  <strong>{MONTHS[startMonth]} is fully committed</strong> for this route — the small
                  rooms we love go first. Two kinder windows:
                </p>
                <div className="sd-altmonths">
                  {suggestions.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className="sd-btn sd-btn--bare"
                      onClick={() => {
                        setStartMonth(m)
                        onMonthChange(m)
                        runCheck(m)
                      }}
                    >
                      Try {MONTHS[m]} →
                    </button>
                  ))}
                </div>
                <p className="sd-field__hint">
                  Or we can hold a waitlist spot — plans shuffle in slow travel more often than
                  you’d think.
                </p>
              </>
            ) : (
              <>
                <p className="sd-done__tick" aria-hidden="true">
                  ✓
                </p>
                <p>
                  <strong>Reference {ref}</strong> —{' '}
                  {availability === 'open'
                    ? `${MONTHS[startMonth]} is wide open along your route.`
                    : `${MONTHS[startMonth]} is possible, but two of the guesthouses are down to their last rooms — worth moving this fortnight.`}
                </p>
                <p>
                  A planner (a person — probably Helen) would call {name.split(' ')[0] || 'you'} within
                  two working days, quote within 10% of {aud(totals.total)}, and only then ask for a
                  deposit.
                </p>
                <dl className="sd-ledger sd-ledger--summary">
                  <div>
                    <dt>Travellers / pace</dt>
                    <dd>
                      {travellers} · {pace}
                    </dd>
                  </div>
                  <div>
                    <dt>Setting out</dt>
                    <dd>{MONTHS[startMonth]}</dd>
                  </div>
                  <div>
                    <dt>Estimate, all-in</dt>
                    <dd>{aud(totals.total)}</dd>
                  </div>
                </dl>
              </>
            )}
            <button type="button" className="sd-btn sd-btn--full" onClick={onClose}>
              {availability === 'waitlist' ? 'Keep planning' : 'Back to the board'}
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
