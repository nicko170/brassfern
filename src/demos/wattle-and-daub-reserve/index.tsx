import { useEffect, useMemo, useRef, useState } from 'react'
import './demo.css'
import {
  ZONES,
  SITTING_META,
  MENU,
  WINE,
  OCCASIONS,
  TAG_LABELS,
  buildAvailability,
  fmtDateLong,
  dayHasRoom,
  cardHoldApplies,
  loadReservations,
  saveReservations,
  mulberry,
  type Day,
  type Reservation,
  type Sitting,
  type Slot,
  type Zone,
} from './data'

/**
 * Wattle & Daub — restaurant site with reservations.
 * Art direction: candlelight — firelit amber on charred timber, editorial
 * serif menu typesetting, rising embers on canvas. The booking flow is the
 * spine: party & date → sitting & seat → details → confirm → a ticket you
 * can keep, release, or drop into a calendar. Bookings persist in
 * localStorage; releasing a table is deliberately delightful, because a
 * released table can be resold. All data fictional.
 */

const STEP_LABELS = ['Party & date', 'Sitting & seat', 'Details', 'Confirm'] as const

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

// ---------------------------------------------------------------- embers

interface Ember {
  x: number
  y: number
  r: number
  vy: number
  wobble: number
  phase: number
  alpha: number
  life: number
  hue: number
}

/** Ambient candle-ember canvas for the hero. One static frame under reduced motion. */
function Embers({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let running = true
    const embers: Ember[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const spawn = (initial: boolean): Ember => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 12,
      r: 0.7 + Math.random() * 2.3,
      vy: 14 + Math.random() * 30,
      wobble: 8 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.6,
      life: 0,
      hue: 24 + Math.random() * 18,
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seedEmbers = () => {
      embers.length = 0
      const count = Math.round(Math.min(70, w / 16))
      for (let i = 0; i < count; i++) embers.push(spawn(true))
    }

    const draw = (t: number, still: boolean) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (const e of embers) {
        const drift = Math.sin(t / 1400 + e.phase) * e.wobble
        const x = e.x + drift
        const fade = still ? e.alpha : e.alpha * Math.max(0, 1 - e.life)
        const g = ctx.createRadialGradient(x, e.y, 0, x, e.y, e.r * 5)
        g.addColorStop(0, `hsla(${e.hue}, 92%, 66%, ${fade})`)
        g.addColorStop(0.5, `hsla(${e.hue}, 85%, 50%, ${fade * 0.35})`)
        g.addColorStop(1, 'hsla(20, 80%, 40%, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, e.y, e.r * 5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    let last = 0
    const loop = (t: number) => {
      if (!running) return
      const dt = Math.min(0.05, (t - last) / 1000) || 0.016
      last = t
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.y -= e.vy * dt
        e.life += dt * 0.22
        if (e.y < -16 || e.life >= 1) embers[i] = spawn(false)
      }
      draw(t, false)
      raf = requestAnimationFrame(loop)
    }

    resize()
    seedEmbers()
    const ro = new ResizeObserver(() => {
      resize()
      seedEmbers()
      if (reduced) draw(0, true)
    })
    ro.observe(canvas)

    const onVis = () => {
      running = document.visibilityState === 'visible'
      if (running && !reduced) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }

    if (reduced) {
      draw(0, true)
    } else {
      raf = requestAnimationFrame(loop)
      document.addEventListener('visibilitychange', onVis)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced])

  return <canvas ref={ref} className="wd-embers" aria-hidden="true" />
}

// ------------------------------------------------------------- utilities

function icsFor(res: Reservation) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const start = new Date(res.isoStart)
  const stamp = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
  const end = new Date(start.getTime() + 2 * 60 * 60_000)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wattle & Daub//Reserve//EN',
    'BEGIN:VEVENT',
    `UID:${res.ref}@wattle-and-daub.demo`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:Table at Wattle & Daub — ${res.zoneName}`,
    `DESCRIPTION:Party of ${res.party} at ${res.timeLabel}, ${res.dateLabel}. Ref ${res.ref}. Running late or can't make it? Release the table — one tap, no guilt.`,
    'LOCATION:14 Hibernia Lane\\, Surry Hills NSW',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function makeRef(when: Date) {
  const rand = mulberry(when.getTime() + 41)
  const letters = () => String.fromCharCode(65 + Math.floor(rand() * 26))
  return `WD-${letters()}${letters()}${Math.floor(rand() * 9)}${letters()}-${Math.floor(rand() * 90) + 10}`
}

// ------------------------------------------------------------- the demo

export default function WattleReserve() {
  const reduced = usePrefersReducedMotion()

  // booking state
  const [step, setStep] = useState(0) // 0..3 form, 4 = confirmation
  const [party, setParty] = useState(2)
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [zoneId, setZoneId] = useState<Zone['id']>('room')
  const [slotId, setSlotId] = useState<string | null>(null)
  const [details, setDetails] = useState({ name: '', phone: '', email: '', occasion: OCCASIONS[0], notes: '', consent: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirming, setConfirming] = useState(false)
  const [booked, setBooked] = useState<Reservation | null>(null)

  // stored reservations + release flow
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [armed, setArmed] = useState<string | null>(null)
  const [releasedNote, setReleasedNote] = useState('')

  // private dining enquiry
  const [pd, setPd] = useState({ name: '', email: '', date: '', guests: '12', notes: '' })
  const [pdErrors, setPdErrors] = useState<Record<string, string>>({})
  const [pdDone, setPdDone] = useState(false)

  const [announce, setAnnounce] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bookingRef = useRef<HTMLElement>(null)

  const days = useMemo(() => buildAvailability(14), [])
  const activeDay: Day | null = days.find((d) => d.key === dayKey) ?? null
  const zone = ZONES.find((z) => z.id === zoneId) ?? ZONES[0]
  const activeSlot: Slot | null = activeDay?.slots.find((s) => s.id === slotId) ?? null
  const needsCardHold = cardHoldApplies(party, !!activeDay?.isSaturday)

  // load stored bookings on mount (client only)
  useEffect(() => {
    setReservations(loadReservations())
  }, [])

  // default to the first evening with a table in the dining room
  useEffect(() => {
    if (dayKey) return
    const first = days.find((d) => dayHasRoom(d, 'room'))
    if (first) setDayKey(first.key)
  }, [days, dayKey])

  // keep zone & slot honest when the party or day changes
  useEffect(() => {
    if (party > zone.maxParty) setZoneId('room')
  }, [party, zone.maxParty])

  useEffect(() => {
    if (activeDay && activeSlot && activeSlot.gone[zoneId]) setSlotId(null)
  }, [activeDay, activeSlot, zoneId])

  // focus the step heading + announce on change
  useEffect(() => {
    headingRef.current?.focus()
    setAnnounce(
      step >= 4
        ? 'Your table is booked.'
        : `Step ${step + 1} of 4: ${STEP_LABELS[Math.min(step, 3)]}`,
    )
  }, [step])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const pickDay = (key: string) => {
    setDayKey(key)
    setSlotId(null)
  }

  const pickZone = (id: Zone['id']) => {
    setZoneId(id)
    const day = days.find((d) => d.key === dayKey)
    if (day && slotId) {
      const s = day.slots.find((x) => x.id === slotId)
      if (!s || s.gone[id]) setSlotId(null)
    }
  }

  // ------------------------------------------------- step navigation

  const validateDetails = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (details.name.trim().length < 2) e.name = 'A name for the booking — two letters will do.'
    const phone = details.phone.replace(/[\s()-]/g, '')
    if (!/^(\+61\d{9}|0\d{9})$/.test(phone)) e.phone = 'An Australian number like 04XX XXX XXX — we text your confirmation.'
    if (details.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()))
      e.email = "That email doesn't look right — or leave it blank and we'll just text."
    if (needsCardHold && !details.consent) e.consent = 'We need your okay on the card hold for this booking.'
    return e
  }

  const next = () => {
    if (step === 1 && !activeSlot) {
      setAnnounce('Choose a time before continuing.')
      return
    }
    if (step === 2) {
      const e = validateDetails()
      setErrors(e)
      if (Object.keys(e).length > 0) {
        document.getElementById(`wd-f-${Object.keys(e)[0]}`)?.focus()
        return
      }
    }
    setStep((s) => Math.min(s + 1, 3))
  }

  const back = () => setStep((s) => Math.max(0, s - 1))

  const confirm = () => {
    if (!activeDay || !activeSlot) return
    setConfirming(true)
    window.setTimeout(() => {
      setConfirming(false)
      const when = new Date(activeDay.date)
      when.setHours(Math.floor(activeSlot.minutes / 60), activeSlot.minutes % 60, 0, 0)
      const res: Reservation = {
        ref: makeRef(when),
        name: details.name.trim(),
        phone: details.phone,
        email: details.email.trim(),
        party,
        dateKey: activeDay.key,
        dateLabel: fmtDateLong(activeDay.date),
        isoStart: when.toISOString(),
        timeLabel: activeSlot.label,
        zone: zone.id,
        zoneName: zone.name,
        occasion: details.occasion,
        notes: details.notes.trim(),
        cardHold: needsCardHold,
      }
      setBooked(res)
      setReservations((prev) => {
        const nextList = [...prev, res]
        saveReservations(nextList)
        return nextList
      })
      setStep(4)
    }, 750)
  }

  const releaseTable = (ref: string) => {
    const res = reservations.find((r) => r.ref === ref)
    setReservations((prev) => {
      const nextList = prev.filter((r) => r.ref !== ref)
      saveReservations(nextList)
      return nextList
    })
    setArmed(null)
    if (res) {
      setReleasedNote(`Released — ${res.dateLabel} at ${res.timeLabel} goes back on the floor. Someone's Tuesday just got better.`)
      if (booked?.ref === ref) {
        setBooked(null)
        setStep(0)
      }
    }
  }

  const downloadIcs = (res: Reservation) => {
    const blob = new Blob([icsFor(res)], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wattle-and-daub-${res.ref.toLowerCase()}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const startAnother = () => {
    setStep(0)
    setParty(2)
    setZoneId('room')
    setSlotId(null)
    setBooked(null)
    setDetails({ name: '', phone: '', email: '', occasion: OCCASIONS[0], notes: '', consent: false })
    setErrors({})
    bookingRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  // -------------------------------------------- private dining enquiry

  const submitPd = () => {
    const e: Record<string, string> = {}
    if (pd.name.trim().length < 2) e.name = 'Who should Mara reply to?'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pd.email.trim())) e.email = 'We reply by email — we need a real one.'
    if (!pd.date) e.date = 'Pick a night, even a rough one. Tuesdays are kindest.'
    const g = Number(pd.guests)
    if (!Number.isFinite(g) || g < 8 || g > 14) e.guests = 'The Hearth Room seats 8 to 14.'
    setPdErrors(e)
    if (Object.keys(e).length > 0) return
    setPdDone(true)
  }

  // ------------------------------------------------- derived display

  const freeSlotsForZone = (day: Day, z: Zone['id']) => day.slots.filter((s) => !s.gone[z])
  const slotGroups = activeDay
    ? (['lunch', 'early', 'dinner', 'late'] as Sitting[])
        .map((sitting) => ({
          sitting,
          slots: activeDay.slots.filter((s) => s.sitting === sitting),
        }))
        .filter((g) => g.slots.length > 0)
    : []
  const noRoomToday = activeDay != null && !activeDay.closed && freeSlotsForZone(activeDay, zoneId).length === 0
  const nearbyNights = noRoomToday
    ? days.filter((d) => d.key !== activeDay.key && dayHasRoom(d, zoneId)).slice(0, 3)
    : []

  const ticketLines: [string, string][] = [
    ['Party', `${party} ${party === 1 ? 'guest' : 'guests'}`],
    ['Night', activeDay ? fmtDateLong(activeDay.date) : '—'],
    ['Where', zone.name],
    ['Time', activeSlot ? activeSlot.label : '—'],
  ]

  return (
    <div className="wd">
      {/* ——— header ——— */}
      <header className="wd-top">
        <button type="button" className="wd-wordmark" onClick={() => scrollTo('wd-top-anchor')}>
          Wattle <span aria-hidden="true">&amp;</span> Daub
        </button>
        <nav className="wd-nav" aria-label="Wattle & Daub">
          <button type="button" onClick={() => scrollTo('wd-menu')}>Menu</button>
          <button type="button" onClick={() => scrollTo('wd-wine')}>Wine</button>
          <button type="button" onClick={() => scrollTo('wd-private')}>Private dining</button>
          <button type="button" onClick={() => scrollTo('wd-tables')}>
            Your tables{reservations.length > 0 && <span className="wd-badge">{reservations.length}</span>}
          </button>
          <button type="button" className="wd-nav__cta" onClick={() => scrollTo('wd-reserve')}>
            Reserve
          </button>
        </nav>
      </header>

      <span id="wd-top-anchor" className="wd-anchor" aria-hidden="true" />

      <p className="wd-sr" role="status" aria-live="polite">
        {announce} {releasedNote}
      </p>

      {/* ——— hero ——— */}
      <section className="wd-hero">
        <Embers reduced={reduced} />
        <div className="wd-hero__glow" aria-hidden="true" />
        <div className="wd-hero__in">
          <p className="wd-overline">Surry Hills · Wood-fired · Est. 2019</p>
          <h1>
            A small room, a hot fire, <em>a table for you</em>.
          </h1>
          <p className="wd-lead">
            Wattle &amp; Daub is a 48-seat dining room cooking over ironbark coals. The menu changes
            with the market; the welcome doesn't. Book in three taps — release in one.
          </p>
          <div className="wd-hero__ctas">
            <button type="button" className="wd-btn" onClick={() => scrollTo('wd-reserve')}>
              Reserve a table <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="wd-btn wd-btn--ghost" onClick={() => scrollTo('wd-menu')}>
              Tonight's menu
            </button>
          </div>
          <ul className="wd-hours" aria-label="Opening hours">
            <li>Tue–Thu · Dinner from 5:30</li>
            <li>Fri–Sat · Sittings to late</li>
            <li>Sun · Long lunch 12–3</li>
            <li>Mon · Dark. The cooks rest.</li>
          </ul>
        </div>
      </section>

      {/* ——— booking ——— */}
      <section className="wd-section wd-book" id="wd-reserve" ref={bookingRef} aria-labelledby="wd-book-h">
        <div className="wd-section__head">
          <p className="wd-overline">Reservations</p>
          <h2 id="wd-book-h">Save us a seat — <em>we'll save you one</em>.</h2>
        </div>

        {step < 4 ? (
          <div className="wd-book__grid">
            <div className="wd-book__main">
              <ol className="wd-steps" aria-label="Booking progress">
                {STEP_LABELS.map((label, i) => (
                  <li key={label} className={i === step ? 'is-now' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
                    <span className="wd-steps__n" aria-hidden="true">{i < step ? '✓' : i + 1}</span>
                    <span className="wd-steps__t">{label}</span>
                  </li>
                ))}
              </ol>

              <h3 className="wd-step-h" ref={headingRef} tabIndex={-1}>
                {STEP_LABELS[step]}
              </h3>

              {step === 0 && (
                <>
                  <fieldset className="wd-fieldset">
                    <legend>How many of you?</legend>
                    <div className="wd-chips" role="group" aria-label="Party size">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={`wd-chip${party === n ? ' is-on' : ''}`}
                          aria-pressed={party === n}
                          onClick={() => setParty(n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="wd-hint">
                      Nine or more? That's our Hearth Room —{' '}
                      <button type="button" className="wd-linklike" onClick={() => scrollTo('wd-private')}>
                        private dining
                      </button>{' '}
                      has its own wood oven.
                    </p>
                  </fieldset>

                  <fieldset className="wd-fieldset">
                    <legend>Which night?</legend>
                    <div className="wd-days" role="group" aria-label="Choose a night">
                      {days.map((d) => {
                        const open = dayHasRoom(d, 'room')
                        return (
                          <button
                            key={d.key}
                            type="button"
                            className={`wd-day${d.key === dayKey ? ' is-on' : ''}${d.closed ? ' is-dark' : ''}`}
                            aria-pressed={d.key === dayKey}
                            disabled={d.closed}
                            title={d.closed ? 'Dark Monday — closed' : d.service === 'lunch' ? 'Sunday long lunch' : undefined}
                            onClick={() => pickDay(d.key)}
                          >
                            <span className="wd-day__wd">{d.weekday}</span>
                            <span className="wd-day__num">{d.dayNum}</span>
                            <span className="wd-day__mo">{d.closed ? 'Dark' : d.service === 'lunch' ? 'Lunch' : open ? d.month : 'Full'}</span>
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                </>
              )}

              {step === 1 && activeDay && (
                <>
                  <fieldset className="wd-fieldset">
                    <legend>Where in the room?</legend>
                    <div className="wd-zones" role="group" aria-label="Seating area">
                      {ZONES.map((z) => {
                        const tooBig = party > z.maxParty
                        return (
                          <button
                            key={z.id}
                            type="button"
                            className={`wd-zone${zoneId === z.id ? ' is-on' : ''}`}
                            aria-pressed={zoneId === z.id}
                            disabled={tooBig}
                            onClick={() => pickZone(z.id)}
                          >
                            <span className="wd-zone__name">{z.name}</span>
                            <span className="wd-zone__note">{tooBig ? `Parties up to ${z.maxParty} — the dining room has you.` : z.note}</span>
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>

                  {noRoomToday ? (
                    <div className="wd-recovery" role="note">
                      <p>
                        <strong>{fmtDateLong(activeDay.date)}</strong> is full in {zone.name.toLowerCase()} — word travels.
                        {nearbyNights.length > 0 ? ' These nights still have room:' : ''}
                      </p>
                      <div className="wd-chips">
                        {nearbyNights.map((d) => (
                          <button key={d.key} type="button" className="wd-chip" onClick={() => { pickDay(d.key) }}>
                            {fmtDateLong(d.date)}
                          </button>
                        ))}
                      </div>
                      <p className="wd-hint">
                        {ZONES.filter((z) => z.id !== zoneId && party <= z.maxParty && dayHasRoom(activeDay, z.id)).length > 0 && (
                          <>
                            Or stay on {fmtDateLong(activeDay.date)} and try{' '}
                            {ZONES.filter((z) => z.id !== zoneId && party <= z.maxParty && dayHasRoom(activeDay, z.id)).map((z, i, arr) => (
                              <span key={z.id}>
                                {i > 0 && (i === arr.length - 1 ? ' or ' : ', ')}
                                <button type="button" className="wd-linklike" onClick={() => pickZone(z.id)}>
                                  {z.name.toLowerCase()}
                                </button>
                              </span>
                            ))}
                            .
                          </>
                        )}
                      </p>
                    </div>
                  ) : (
                    <fieldset className="wd-fieldset">
                      <legend>
                        What time — {fmtDateLong(activeDay.date).toLowerCase()}
                        {activeDay.isSaturday ? ' · Saturday (card hold applies)' : ''}?
                      </legend>
                      {slotGroups.map((g) => {
                        const free = g.slots.filter((s) => !s.gone[zoneId])
                        if (free.length === 0) return null
                        return (
                          <div className="wd-sitting" key={g.sitting}>
                            <p className="wd-sitting__head">
                              <strong>{SITTING_META[g.sitting].name}</strong>
                              <span>{SITTING_META[g.sitting].note}</span>
                            </p>
                            <div className="wd-chips">
                              {g.slots.map((s) => {
                                const gone = s.gone[zoneId]
                                return (
                                  <button
                                    key={s.id}
                                    type="button"
                                    className={`wd-chip wd-chip--time${slotId === s.id ? ' is-on' : ''}`}
                                    aria-pressed={slotId === s.id}
                                    disabled={gone}
                                    onClick={() => setSlotId(s.id)}
                                  >
                                    {s.label}
                                    {gone && <span className="wd-sr"> — booked</span>}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </fieldset>
                  )}
                </>
              )}

              {step === 2 && (
                <div className="wd-form">
                  <div className="wd-row2">
                    <div className="wd-field">
                      <label htmlFor="wd-f-name">Name for the booking</label>
                      <input
                        id="wd-f-name"
                        value={details.name}
                        onChange={(e) => setDetails({ ...details, name: e.target.value })}
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'wd-e-name' : undefined}
                      />
                      {errors.name && <p className="wd-error" id="wd-e-name" role="alert">{errors.name}</p>}
                    </div>
                    <div className="wd-field">
                      <label htmlFor="wd-f-phone">Mobile</label>
                      <input
                        id="wd-f-phone"
                        value={details.phone}
                        onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="04XX XXX XXX"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'wd-e-phone' : 'wd-h-phone'}
                      />
                      <p className="wd-hint" id="wd-h-phone">We text your confirmation and a 48-hour reminder.</p>
                      {errors.phone && <p className="wd-error" id="wd-e-phone" role="alert">{errors.phone}</p>}
                    </div>
                  </div>
                  <div className="wd-row2">
                    <div className="wd-field">
                      <label htmlFor="wd-f-email">Email <span className="wd-opt">(optional)</span></label>
                      <input
                        id="wd-f-email"
                        type="email"
                        value={details.email}
                        onChange={(e) => setDetails({ ...details, email: e.target.value })}
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'wd-e-email' : undefined}
                      />
                      {errors.email && <p className="wd-error" id="wd-e-email" role="alert">{errors.email}</p>}
                    </div>
                    <div className="wd-field">
                      <label htmlFor="wd-f-occasion">Occasion</label>
                      <select
                        id="wd-f-occasion"
                        value={details.occasion}
                        onChange={(e) => setDetails({ ...details, occasion: e.target.value })}
                      >
                        {OCCASIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="wd-field">
                    <label htmlFor="wd-f-notes">Allergies &amp; notes <span className="wd-opt">(optional)</span></label>
                    <textarea
                      id="wd-f-notes"
                      rows={3}
                      value={details.notes}
                      onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                      placeholder="Coeliac, wheelchair access, one very opinionated toddler — tell us anything."
                    />
                  </div>
                  {needsCardHold && (
                    <div className={`wd-hold${errors.consent ? ' has-error' : ''}`}>
                      <p>
                        <strong>Card hold applies.</strong> {party >= 5 ? 'Parties of five or more' : 'Saturday sittings'} need a
                        card on file. Nothing is charged unless the table ghosts us — and releasing takes one tap,
                        no phone call, no guilt.
                      </p>
                      <label className="wd-check">
                        <input
                          id="wd-f-consent"
                          type="checkbox"
                          checked={details.consent}
                          onChange={(e) => setDetails({ ...details, consent: e.target.checked })}
                          aria-invalid={!!errors.consent}
                        />
                        <span>I understand a card hold applies to this booking.</span>
                      </label>
                      {errors.consent && <p className="wd-error" role="alert">{errors.consent}</p>}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && activeDay && activeSlot && (
                <div className="wd-review">
                  <dl className="wd-review__list">
                    <div><dt>Who</dt><dd>{details.name || '—'} · {details.phone}</dd></div>
                    <div><dt>Party</dt><dd>{party} {party === 1 ? 'guest' : 'guests'}</dd></div>
                    <div><dt>Night</dt><dd>{fmtDateLong(activeDay.date)}</dd></div>
                    <div><dt>Time</dt><dd>{activeSlot.label} — {SITTING_META[activeSlot.sitting].name}</dd></div>
                    <div><dt>Where</dt><dd>{zone.name}</dd></div>
                    <div><dt>Occasion</dt><dd>{details.occasion}</dd></div>
                    {details.notes && <div><dt>Notes</dt><dd>{details.notes}</dd></div>}
                    {needsCardHold && <div><dt>Card hold</dt><dd>Agreed — nothing charged unless the table ghosts us.</dd></div>}
                  </dl>
                  <p className="wd-hint wd-hint--honest">
                    Plans change. If they do, one tap releases your table and it goes back on the floor.
                    We'd rather resell it than sulk about it.
                  </p>
                </div>
              )}

              <div className="wd-book__nav">
                {step > 0 ? (
                  <button type="button" className="wd-btn wd-btn--ghost" onClick={back}>
                    <span aria-hidden="true">←</span> Back
                  </button>
                ) : (
                  <span />
                )}
                {step < 3 ? (
                  <button type="button" className="wd-btn" onClick={next} disabled={step === 1 && !activeSlot}>
                    Continue <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <button type="button" className="wd-btn wd-btn--ember" onClick={confirm} disabled={confirming}>
                    {confirming ? 'Holding your table…' : 'Hold this table'} <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </div>

            <aside className="wd-ticket" aria-label="Your table so far">
              <p className="wd-ticket__brand">Wattle &amp; Daub</p>
              <p className="wd-ticket__ref">Coat-check for the appetite</p>
              <dl>
                {ticketLines.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="wd-ticket__foot">
                Held eight minutes while you confirm. No card unless it matters.
              </p>
              <span className="wd-ticket__perf" aria-hidden="true" />
            </aside>
          </div>
        ) : (
          booked && (
            <div className="wd-confirm">
              <h3 className="wd-step-h" ref={headingRef} tabIndex={-1}>
                The table's yours, {booked.name.split(' ')[0]}.
              </h3>
              <div className="wd-confirm__ticket">
                <p className="wd-ticket__brand">Wattle &amp; Daub</p>
                <p className="wd-confirm__ref">{booked.ref}</p>
                <dl>
                  <div><dt>Night</dt><dd>{booked.dateLabel}</dd></div>
                  <div><dt>Time</dt><dd>{booked.timeLabel}</dd></div>
                  <div><dt>Party</dt><dd>{booked.party} {booked.party === 1 ? 'guest' : 'guests'}</dd></div>
                  <div><dt>Where</dt><dd>{booked.zoneName}</dd></div>
                </dl>
                <p className="wd-ticket__foot">
                  A text is on its way to {booked.phone}. We'll nudge you 48 hours out — confirm or release in one tap.
                </p>
                <span className="wd-ticket__perf" aria-hidden="true" />
              </div>
              <div className="wd-confirm__actions">
                <button type="button" className="wd-btn" onClick={() => downloadIcs(booked)}>
                  Add to calendar <span aria-hidden="true">↓</span>
                </button>
                <button type="button" className="wd-btn wd-btn--ghost" onClick={() => scrollTo('wd-tables')}>
                  Manage your tables
                </button>
                <button type="button" className="wd-linklike" onClick={startAnother}>
                  Book another table
                </button>
              </div>
            </div>
          )
        )}
      </section>

      {/* ——— menu ——— */}
      <section className="wd-section" id="wd-menu" aria-labelledby="wd-menu-h">
        <div className="wd-section__head">
          <p className="wd-overline">Tonight's menu</p>
          <h2 id="wd-menu-h">Written at the market, <em>cooked on coals</em>.</h2>
          <p className="wd-section__sub">
            The menu turns over with the season and the mood of the hearth. Dietaries are a conversation,
            not a compromise — most of the menu bends.
          </p>
        </div>
        <div className="wd-menu">
          {MENU.map((course) => (
            <article className="wd-course" key={course.name}>
              <header>
                <h3>{course.name}</h3>
                <p>{course.tagline}</p>
              </header>
              <ul>
                {course.dishes.map((d) => (
                  <li className="wd-dish" key={d.name}>
                    <p className="wd-dish__row">
                      <span className="wd-dish__name">{d.name}</span>
                      <span className="wd-dish__dots" aria-hidden="true" />
                      <span className="wd-dish__price">{d.price}</span>
                    </p>
                    <p className="wd-dish__desc">{d.desc}</p>
                    {d.tags.length > 0 && (
                      <p className="wd-dish__tags">
                        {d.tags.map((t) => (
                          <span key={t} title={TAG_LABELS[t]}>{t}</span>
                        ))}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="wd-menu__foot">— Mara Ellery, chef</p>
      </section>

      {/* ——— wine ——— */}
      <section className="wd-section" id="wd-wine" aria-labelledby="wd-wine-h">
        <div className="wd-section__head">
          <p className="wd-overline">By the glass</p>
          <h2 id="wd-wine-h">A short list, <em>poured generously</em>.</h2>
          <p className="wd-section__sub">
            Twenty bottles on the wall at any time, all Australian, all from growers we'd happily have dinner with.
          </p>
        </div>
        <table className="wd-wine">
          <thead>
            <tr>
              <th scope="col">Wine</th>
              <th scope="col" className="wd-wine__num">Glass</th>
              <th scope="col" className="wd-wine__num">Bottle</th>
            </tr>
          </thead>
          <tbody>
            {WINE.map((wline) => (
              <tr key={wline.name}>
                <td>
                  <span className="wd-wine__name">{wline.name}</span>
                  <span className="wd-wine__region">{wline.region}</span>
                  <span className="wd-wine__notes">{wline.notes}</span>
                </td>
                <td className="wd-wine__num">{wline.glass}</td>
                <td className="wd-wine__num">{wline.bottle > 0 ? wline.bottle : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ——— private dining ——— */}
      <section className="wd-section wd-private" id="wd-private" aria-labelledby="wd-private-h">
        <div className="wd-private__in">
          <div>
            <p className="wd-overline">Private dining</p>
            <h2 id="wd-private-h">The Hearth Room — <em>eight to fourteen</em>, one long table.</h2>
            <p className="wd-section__sub">
              A room of your own behind the kitchen, its own wood oven, a set menu built around your table
              and nobody else's noise. Birthdays, launches, long-overdue reunions.
            </p>
            <ul className="wd-facts">
              <li>Seats 8–14 · one long timber table</li>
              <li>Set menu from $95 a head · matched wines available</li>
              <li>Tuesday nights are kinder on the calendar</li>
              <li>Mara comes out and tells you what's on the fire</li>
            </ul>
          </div>
          {pdDone ? (
            <div className="wd-pd__done" role="status">
              <h3>Consider it with Mara.</h3>
              <p>
                Thanks, {pd.name.split(' ')[0]} — your enquiry for {pd.guests} guests is by the pass.
                We reply within a day, usually with two menu sketches and a strong opinion.
              </p>
            </div>
          ) : (
            <div className="wd-pd__form wd-form">
              <div className="wd-row2">
                <div className="wd-field">
                  <label htmlFor="wd-pd-name">Your name</label>
                  <input id="wd-pd-name" value={pd.name} onChange={(e) => setPd({ ...pd, name: e.target.value })} aria-invalid={!!pdErrors.name} />
                  {pdErrors.name && <p className="wd-error" role="alert">{pdErrors.name}</p>}
                </div>
                <div className="wd-field">
                  <label htmlFor="wd-pd-email">Email</label>
                  <input id="wd-pd-email" type="email" value={pd.email} onChange={(e) => setPd({ ...pd, email: e.target.value })} aria-invalid={!!pdErrors.email} />
                  {pdErrors.email && <p className="wd-error" role="alert">{pdErrors.email}</p>}
                </div>
              </div>
              <div className="wd-row2">
                <div className="wd-field">
                  <label htmlFor="wd-pd-date">Preferred night</label>
                  <input id="wd-pd-date" type="date" value={pd.date} onChange={(e) => setPd({ ...pd, date: e.target.value })} aria-invalid={!!pdErrors.date} />
                  {pdErrors.date && <p className="wd-error" role="alert">{pdErrors.date}</p>}
                </div>
                <div className="wd-field">
                  <label htmlFor="wd-pd-guests">Guests (8–14)</label>
                  <input id="wd-pd-guests" inputMode="numeric" value={pd.guests} onChange={(e) => setPd({ ...pd, guests: e.target.value })} aria-invalid={!!pdErrors.guests} />
                  {pdErrors.guests && <p className="wd-error" role="alert">{pdErrors.guests}</p>}
                </div>
              </div>
              <div className="wd-field">
                <label htmlFor="wd-pd-notes">What's the occasion? <span className="wd-opt">(optional)</span></label>
                <textarea id="wd-pd-notes" rows={2} value={pd.notes} onChange={(e) => setPd({ ...pd, notes: e.target.value })} />
              </div>
              <button type="button" className="wd-btn" onClick={submitPd}>
                Enquire about the Hearth Room <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ——— your tables ——— */}
      <section className="wd-section" id="wd-tables" aria-labelledby="wd-tables-h">
        <div className="wd-section__head">
          <p className="wd-overline">Your tables</p>
          <h2 id="wd-tables-h">Held bookings, <em>kept on this device</em>.</h2>
          <p className="wd-section__sub">
            This demo stores your tables in the browser — nothing leaves the room.
            Releasing a table is one tap on purpose: a released table can be resold, a ghosted one can't.
          </p>
        </div>
        {releasedNote && <p className="wd-released" role="status">{releasedNote}</p>}
        {reservations.length === 0 ? (
          <p className="wd-empty">
            No tables held right now. The hearth is lit most nights —{' '}
            <button type="button" className="wd-linklike" onClick={() => scrollTo('wd-reserve')}>save us a seat</button>.
          </p>
        ) : (
          <ul className="wd-reslist">
            {reservations.map((r) => (
              <li key={r.ref} className="wd-res">
                <div className="wd-res__main">
                  <p className="wd-res__when">
                    {r.dateLabel} · {r.timeLabel}
                  </p>
                  <p className="wd-res__meta">
                    {r.party} {r.party === 1 ? 'guest' : 'guests'} · {r.zoneName} · {r.ref}
                  </p>
                  {r.notes && <p className="wd-res__notes">“{r.notes}”</p>}
                </div>
                <div className="wd-res__actions">
                  <button type="button" className="wd-linklike" onClick={() => downloadIcs(r)}>
                    Calendar
                  </button>
                  {armed === r.ref ? (
                    <span className="wd-res__arm">
                      Release it?
                      <button type="button" className="wd-chip is-on" onClick={() => releaseTable(r.ref)}>
                        Yes, release
                      </button>
                      <button type="button" className="wd-chip" onClick={() => setArmed(null)}>
                        Keep it
                      </button>
                    </span>
                  ) : (
                    <button type="button" className="wd-linklike" onClick={() => setArmed(r.ref)}>
                      Release table
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ——— footer ——— */}
      <footer className="wd-foot">
        <p className="wd-foot__word">Wattle <span aria-hidden="true">&amp;</span> Daub</p>
        <p>14 Hibernia Lane, Surry Hills NSW · (02) 8000 0118 · hello@wattleanddaub.demo</p>
        <p className="wd-foot__fine">
          A fictional dining room, built as a Brassfern Lab demo. The bookings are mocked; the hunger is real.
        </p>
      </footer>
    </div>
  )
}
