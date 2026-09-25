import { useEffect, useMemo, useRef, useState } from 'react'
import './demo.css'

/**
 * Pylon Health — telehealth booking flow.
 * Art direction: clinical calm — warm white, soft sage, plain language.
 * A five-step booking machine with back-button integrity, honest error
 * recovery (slots can be “just taken”), real validation, an .ics download
 * and full keyboard / screen-reader support. All data is fictional.
 */

// ---------------------------------------------------------------- data

interface Practitioner {
  id: string
  name: string
  role: string
  interests: string[]
  blurb: string
  initials: string
  tint: string
}

const PRACTITIONERS: Practitioner[] = [
  {
    id: 'rahim',
    name: 'Dr Nadia Rahim',
    role: 'General Practitioner',
    interests: ['Chronic conditions', 'Mental health', 'Care plans'],
    blurb: 'Fifteen years in regional practice. Unhurried consults, plain answers.',
    initials: 'NR',
    tint: '#7fa58c',
  },
  {
    id: 'ellery',
    name: 'Dr Tom Ellery',
    role: 'General Practitioner',
    interests: ['Kids & family', 'Skin checks', 'Sports injuries'],
    blurb: 'Ex-rural flying doctor. Good with wriggly toddlers on camera.',
    initials: 'TE',
    tint: '#a592c7',
  },
  {
    id: 'nair',
    name: 'Dr Asha Nair',
    role: 'General Practitioner',
    interests: ['Sleep', "Women's health", 'Repeat scripts'],
    blurb: "Writes things down for you. Won't rush the end of a consult.",
    initials: 'AN',
    tint: '#d19a66',
  },
  {
    id: 'marwick',
    name: 'Jill Marwick',
    role: 'Nurse Practitioner',
    interests: ['Immunisation', 'Wound care', 'Health checks'],
    blurb: 'Can prescribe, refer and reassure — often all three at once.',
    initials: 'JM',
    tint: '#6f96ad',
  },
]

const REASONS = [
  'Sore throat or cold',
  "Can't sleep",
  'Skin rash or mole check',
  'Repeat prescription',
  'Mental health check-in',
  'Child unwell',
  'Ongoing condition review',
  "Something's not right",
]

const STEP_LABELS = ['Why', 'Who', 'When', 'You', 'Confirm'] as const

// ------------------------------------------------------------ utilities

function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Slot {
  id: string
  label: string
  minutes: number
  taken: boolean
  /** contested slots get “just taken” on first confirm — honest error recovery */
  hot: boolean
}

interface Day {
  key: string
  date: Date
  weekday: string
  dayNum: number
  month: string
  closed: boolean
  slots: Slot[]
}

function fmtTime(totalMinutes: number) {
  const h24 = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const ampm = h24 < 12 ? 'am' : 'pm'
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildAvailability(practitionerId: string): Day[] {
  const seedBase = [...practitionerId].reduce((a, c) => a + c.charCodeAt(0), 733)
  const now = new Date()
  const days: Day[] = []
  for (let i = 1; i <= 7; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const rand = mulberry(seedBase + i * 977)
    const closed = rand() < 0.1
    const slots: Slot[] = []
    if (!closed) {
      for (let s = 0; s < 12; s++) {
        const minutes = 8 * 60 + 30 + s * 40 // 8:30am → 4:50pm
        const r = rand()
        slots.push({
          id: `${i}-${s}`,
          label: fmtTime(minutes),
          minutes,
          taken: r < 0.34,
          hot: r >= 0.34 && r < 0.42,
        })
      }
    }
    days.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      weekday: WEEKDAYS[date.getDay()],
      dayNum: date.getDate(),
      month: MONTHS[date.getMonth()],
      closed,
      slots,
    })
  }
  return days
}

function icsFor(start: Date, patientName: string) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
  const end = new Date(start.getTime() + 20 * 60_000)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pylon Health//Telehealth Booking//EN',
    'BEGIN:VEVENT',
    `UID:${start.getTime()}@pylon-health.demo`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    'SUMMARY:GP video consult — Pylon Health',
    `DESCRIPTION:Telehealth consult for ${patientName}. Your video link arrives by text 15 minutes before. Keep your rejoin code handy.`,
    'LOCATION:Pylon Health video room',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

// ------------------------------------------------------------ component

export default function PylonHealthBooking() {
  const [step, setStep] = useState(0) // 0..4 form steps, 5 = confirmation
  const [reasons, setReasons] = useState<string[]>([])
  const [ownWords, setOwnWords] = useState('')
  const [reasonError, setReasonError] = useState('')

  const [practId, setPractId] = useState<string | null>(null)
  const [loadedFor, setLoadedFor] = useState<string | null>(null)
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [slotId, setSlotId] = useState<string | null>(null)
  const [slotGone, setSlotGone] = useState<Record<string, boolean>>({})
  const [hotHandled, setHotHandled] = useState(false)
  const [slotNotice, setSlotNotice] = useState('')

  const [details, setDetails] = useState({ first: '', last: '', phone: '', medicare: '', consent: false })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [confirming, setConfirming] = useState(false)
  const [booked, setBooked] = useState<{ code: string; ref: string; when: Date } | null>(null)
  const [announce, setAnnounce] = useState('')
  const [copied, setCopied] = useState(false)

  const headingRef = useRef<HTMLHeadingElement>(null)

  const practitioner = PRACTITIONERS.find((p) => p.id === practId) ?? null
  const days = useMemo(() => (practitioner ? buildAvailability(practitioner.id) : []), [practitioner])
  const isGone = (key: string, id: string) => !!slotGone[`${key}|${id}`]
  const firstOpenDay = days.find((d) => !d.closed && d.slots.some((s) => !s.taken && !isGone(d.key, s.id)))
  const activeDay = days.find((d) => d.key === dayKey) ?? firstOpenDay ?? null
  const activeSlot = activeDay?.slots.find((s) => s.id === slotId && !s.taken && !isGone(activeDay.key, s.id)) ?? null

  // focus the step heading on every step change — screen readers announce it
  useEffect(() => {
    headingRef.current?.focus()
    const title = step >= 5 ? 'Booking confirmed' : STEP_LABELS[Math.min(step, STEP_LABELS.length - 1)]
    setAnnounce(step >= 5 ? 'Your appointment is booked.' : `Step ${Math.min(step, 4) + 1} of 5: ${title}`)
  }, [step])

  // simulate fetching this practitioner's diary
  useEffect(() => {
    if (step !== 2 || !practitioner || loadedFor === practitioner.id) return
    const t = window.setTimeout(() => setLoadedFor(practitioner.id), 620)
    return () => window.clearTimeout(t)
  }, [step, practitioner, loadedFor])

  const toggleReason = (r: string) => {
    setReasons((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]))
    setReasonError('')
  }

  const selectPractitioner = (id: string) => {
    if (id !== practId) {
      setPractId(id)
      setLoadedFor(null)
      setDayKey(null)
      setSlotId(null)
      setSlotNotice('')
    }
  }

  const validateDetails = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (details.first.trim().length < 2) e.first = 'We need a first name — at least two letters.'
    if (details.last.trim().length < 2) e.last = 'And a family name, for your record.'
    const phone = details.phone.replace(/[\s()-]/g, '')
    if (!/^(\+61\d{9}|0\d{9})$/.test(phone)) e.phone = 'Enter an Australian number like 04XX XXX XXX.'
    const med = details.medicare.replace(/\s/g, '')
    if (med && !/^\d{10}$/.test(med)) e.medicare = 'Medicare numbers are 10 digits — or leave this blank.'
    if (!details.consent) e.consent = 'We need your okay to proceed with a video consult.'
    return e
  }

  const next = () => {
    if (step === 0) {
      if (reasons.length === 0 && ownWords.trim().length < 3) {
        setReasonError('Pick a reason, or use your own words — anything goes.')
        return
      }
    }
    if (step === 3) {
      const e = validateDetails()
      setErrors(e)
      if (Object.keys(e).length > 0) {
        const firstBad = document.getElementById(`ph-field-${Object.keys(e)[0]}`)
        firstBad?.focus()
        return
      }
    }
    setStep((s) => Math.min(s + 1, 4))
  }

  const back = () => {
    if (step === 0) return
    setSlotNotice('')
    setStep((s) => s - 1)
  }

  const confirm = () => {
    if (!practitioner || !activeDay || !activeSlot) return
    setConfirming(true)
    window.setTimeout(() => {
      setConfirming(false)
      // a “hot” slot gets nabbed by another patient the first time you try
      if (activeSlot.hot && !hotHandled) {
        setHotHandled(true)
        setSlotGone((prev) => ({ ...prev, [`${activeDay.key}|${activeSlot.id}`]: true }))
        setSlotId(null)
        setSlotNotice(
          `Sorry — ${activeSlot.label} with ${practitioner.name} was just taken. These were the closest times still free.`,
        )
        setStep(2)
        return
      }
      const when = new Date(activeDay.date)
      when.setHours(Math.floor(activeSlot.minutes / 60), activeSlot.minutes % 60, 0, 0)
      const rand = mulberry(when.getTime())
      const code = `PYL-${String(Math.floor(rand() * 9000) + 1000)}-${String.fromCharCode(
        65 + Math.floor(rand() * 26),
        65 + Math.floor(rand() * 26),
      )}`
      setBooked({ code, ref: `PH-${when.getFullYear()}-${String(Math.floor(rand() * 90000) + 10000)}`, when })
      setStep(5)
    }, 900)
  }

  const downloadIcs = () => {
    if (!booked) return
    const blob = new Blob([icsFor(booked.when, `${details.first} ${details.last}`.trim() || 'Patient')], {
      type: 'text/calendar',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pylon-health-appointment.ics'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setStep(0)
    setReasons([])
    setOwnWords('')
    setPractId(null)
    setLoadedFor(null)
    setDayKey(null)
    setSlotId(null)
    setSlotGone({})
    setHotHandled(false)
    setSlotNotice('')
    setDetails({ first: '', last: '', phone: '', medicare: '', consent: false })
    setErrors({})
    setBooked(null)
    setCopied(false)
  }

  const longDate = (d: Date) =>
    `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`

  // ------------------------------------------------------------- render

  return (
    <div className="ph">
      <div className="ph__sr" aria-live="polite">{announce}</div>

      <header className="ph__header">
        <p className="ph__wordmark">
          Pylon <span>Health</span>
        </p>
        <p className="ph__sub">GP video consults — no waiting room, no two-hour drive.</p>
      </header>

      <main className="ph__layout">
        <aside className="ph__aside" aria-label="How booking works">
          <h2 className="ph__aside-title">How this works</h2>
          <ol className="ph__aside-list">
            <li><b>Tell us what's up.</b> Your own words are fine — no medical dictionary needed.</li>
            <li><b>Pick your clinician and time.</b> Times shown are genuinely free.</li>
            <li><b>Get a text, join the call.</b> Video link arrives 15 minutes before. If your signal drops, we phone you instead.</li>
          </ol>
          <div className="ph__aside-call">
            <p>Prefer to talk to a person?</p>
            <a href="tel:1800795600">1800 795 600</a>
            <small>7am–10pm, every day</small>
          </div>
        </aside>

        <section className="ph__card" aria-labelledby="ph-step-heading">
          {step < 5 && (
            <ol className="ph__steps" aria-label="Booking progress">
              {STEP_LABELS.map((label, i) => {
                const done = i < step
                const current = i === step
                return (
                  <li key={label} className={`ph__pip${done ? ' ph__pip--done' : ''}${current ? ' ph__pip--current' : ''}`}>
                    {done ? (
                      <button type="button" onClick={() => setStep(i)} aria-label={`Go back to ${label}`}>
                        <span className="ph__pip-num" aria-hidden="true">✓</span>
                        <span className="ph__pip-label">{label}</span>
                      </button>
                    ) : (
                      <span className="ph__pip-static" aria-current={current ? 'step' : undefined}>
                        <span className="ph__pip-num" aria-hidden="true">{i + 1}</span>
                        <span className="ph__pip-label">{label}</span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
          )}

          {/* ------------------------------------------------ step 0: why */}
          {step === 0 && (
            <div className="ph__step">
              <h2 id="ph-step-heading" ref={headingRef} tabIndex={-1} className="ph__h2">
                What's bothering you?
              </h2>
              <p className="ph__lead">Pick whatever fits — or use your own words. There's no wrong answer.</p>

              <div className="ph__chips" role="group" aria-label="Common reasons for a consult">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`ph__chip${reasons.includes(r) ? ' ph__chip--on' : ''}`}
                    aria-pressed={reasons.includes(r)}
                    onClick={() => toggleReason(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <label className="ph__field">
                <span className="ph__label">In your own words <em>(optional)</em></span>
                <textarea
                  rows={3}
                  value={ownWords}
                  onChange={(e) => {
                    setOwnWords(e.target.value)
                    if (e.target.value.trim().length >= 3) setReasonError('')
                  }}
                  placeholder="e.g. It's been going on for a week and it's not getting better…"
                />
              </label>
              {reasonError && (
                <p className="ph__error" role="alert">{reasonError}</p>
              )}
            </div>
          )}

          {/* ------------------------------------------------ step 1: who */}
          {step === 1 && (
            <div className="ph__step">
              <h2 id="ph-step-heading" ref={headingRef} tabIndex={-1} className="ph__h2">
                Who would you like to see?
              </h2>
              <p className="ph__lead">All our clinicians bulk-bill standard consults with a valid Medicare card.</p>

              <div className="ph__docs" role="group" aria-label="Choose a clinician">
                {PRACTITIONERS.map((p) => {
                  const avail = buildAvailability(p.id).find((d) => !d.closed && d.slots.some((s) => !s.taken))
                  const nextSlot = avail?.slots.find((s) => !s.taken)
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`ph__doc${practId === p.id ? ' ph__doc--on' : ''}`}
                      aria-pressed={practId === p.id}
                      onClick={() => selectPractitioner(p.id)}
                    >
                      <span className="ph__avatar" style={{ background: p.tint }} aria-hidden="true">
                        {p.initials}
                      </span>
                      <span className="ph__doc-body">
                        <b>{p.name}</b>
                        <span className="ph__doc-role">{p.role}</span>
                        <span className="ph__doc-blurb">{p.blurb}</span>
                        <span className="ph__doc-tags">
                          {p.interests.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </span>
                        <span className="ph__doc-next">
                          {avail && nextSlot
                            ? `Next free: ${longDate(avail.date)}, ${nextSlot.label}`
                            : 'Fully booked this week'}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ----------------------------------------------- step 2: when */}
          {step === 2 && (
            <div className="ph__step">
              <h2 id="ph-step-heading" ref={headingRef} tabIndex={-1} className="ph__h2">
                When suits you?
              </h2>
              <p className="ph__lead">
                {practitioner ? `${practitioner.name}'s diary for the next seven days.` : 'Pick a time.'}
              </p>

              {slotNotice && (
                <p className="ph__notice" role="alert">{slotNotice}</p>
              )}

              {!practitioner || loadedFor !== practitioner.id ? (
                <div className="ph__loading" aria-busy="true" role="status" aria-label="Fetching available times">
                  <span /><span /><span /><span /><span /><span />
                  <p>Checking {(practitioner?.name.split(' ').pop() ?? 'the clinician') + "'s"} diary…</p>
                </div>
              ) : (
                <>
                  <div className="ph__days" role="group" aria-label="Choose a day">
                    {days.map((d) => {
                      const open = d.slots.filter((s) => !s.taken && !isGone(d.key, s.id)).length
                      const disabled = d.closed || open === 0
                      const active = activeDay?.key === d.key
                      return (
                        <button
                          key={d.key}
                          type="button"
                          className={`ph__day${active ? ' ph__day--on' : ''}`}
                          disabled={disabled}
                          aria-pressed={active}
                          onClick={() => {
                            setDayKey(d.key)
                            setSlotId(null)
                          }}
                        >
                          <span className="ph__day-wd">{d.weekday}</span>
                          <span className="ph__day-num">{d.dayNum}</span>
                          <span className="ph__day-count">
                            {d.closed ? 'Closed' : open === 0 ? 'Full' : `${open} free`}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {activeDay && (
                    <div className="ph__slots" role="group" aria-label={`Times on ${longDate(activeDay.date)}`}>
                      <h3 className="ph__h3">{longDate(activeDay.date)}</h3>
                      <div className="ph__slot-grid">
                        {activeDay.slots.map((s) => {
                          const taken = s.taken || isGone(activeDay.key, s.id)
                          return (
                            <button
                              key={s.id}
                              type="button"
                              className={`ph__slot${slotId === s.id && !taken ? ' ph__slot--on' : ''}`}
                              disabled={taken}
                              aria-pressed={slotId === s.id && !taken}
                              onClick={() => {
                                setSlotId(s.id)
                                setSlotNotice('')
                              }}
                            >
                              {s.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ------------------------------------------------- step 3: you */}
          {step === 3 && (
            <div className="ph__step">
              <h2 id="ph-step-heading" ref={headingRef} tabIndex={-1} className="ph__h2">
                A few details about you
              </h2>
              <p className="ph__lead">We text your video link and reminders to this number. Nothing is shared.</p>

              <div className="ph__form">
                <div className="ph__row2">
                  <label className="ph__field" htmlFor="ph-field-first">
                    <span className="ph__label">First name</span>
                    <input
                      id="ph-field-first"
                      type="text"
                      autoComplete="given-name"
                      value={details.first}
                      aria-invalid={!!errors.first}
                      aria-describedby={errors.first ? 'ph-err-first' : undefined}
                      onChange={(e) => {
                        setDetails({ ...details, first: e.target.value })
                        if (errors.first) setErrors({ ...errors, first: '' })
                      }}
                    />
                    {errors.first && <span className="ph__error" id="ph-err-first">{errors.first}</span>}
                  </label>

                  <label className="ph__field" htmlFor="ph-field-last">
                    <span className="ph__label">Family name</span>
                    <input
                      id="ph-field-last"
                      type="text"
                      autoComplete="family-name"
                      value={details.last}
                      aria-invalid={!!errors.last}
                      aria-describedby={errors.last ? 'ph-err-last' : undefined}
                      onChange={(e) => {
                        setDetails({ ...details, last: e.target.value })
                        if (errors.last) setErrors({ ...errors, last: '' })
                      }}
                    />
                    {errors.last && <span className="ph__error" id="ph-err-last">{errors.last}</span>}
                  </label>
                </div>

                <label className="ph__field" htmlFor="ph-field-phone">
                  <span className="ph__label">Mobile number</span>
                  <input
                    id="ph-field-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="04XX XXX XXX"
                    value={details.phone}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'ph-err-phone' : undefined}
                    onChange={(e) => {
                      setDetails({ ...details, phone: e.target.value })
                      if (errors.phone) setErrors({ ...errors, phone: '' })
                    }}
                  />
                  {errors.phone && <span className="ph__error" id="ph-err-phone">{errors.phone}</span>}
                </label>

                <label className="ph__field" htmlFor="ph-field-medicare">
                  <span className="ph__label">Medicare number <em>(optional — needed for bulk billing)</em></span>
                  <input
                    id="ph-field-medicare"
                    type="text"
                    inputMode="numeric"
                    placeholder="10 digits"
                    value={details.medicare}
                    aria-invalid={!!errors.medicare}
                    aria-describedby={errors.medicare ? 'ph-err-medicare' : undefined}
                    onChange={(e) => {
                      setDetails({ ...details, medicare: e.target.value })
                      if (errors.medicare) setErrors({ ...errors, medicare: '' })
                    }}
                  />
                  {errors.medicare && <span className="ph__error" id="ph-err-medicare">{errors.medicare}</span>}
                </label>

                <div className="ph__consent">
                  <label htmlFor="ph-field-consent">
                    <input
                      id="ph-field-consent"
                      type="checkbox"
                      checked={details.consent}
                      aria-invalid={!!errors.consent}
                      aria-describedby={errors.consent ? 'ph-err-consent' : undefined}
                      onChange={(e) => {
                        setDetails({ ...details, consent: e.target.checked })
                        if (errors.consent) setErrors({ ...errors, consent: '' })
                      }}
                    />
                    <span>
                      I'm okay with a video consult, and I understand the clinician might still ask me
                      to see someone in person.
                    </span>
                  </label>
                  {errors.consent && <span className="ph__error" id="ph-err-consent">{errors.consent}</span>}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------- step 4: confirm */}
          {step === 4 && (
            <div className="ph__step">
              <h2 id="ph-step-heading" ref={headingRef} tabIndex={-1} className="ph__h2">
                Does this look right?
              </h2>
              <p className="ph__lead">Nothing is booked until you press the button below.</p>

              <dl className="ph__summary">
                <div>
                  <dt>Reason</dt>
                  <dd>
                    {reasons.length > 0 ? reasons.join(' · ') : '—'}
                    {ownWords.trim() && <blockquote>“{ownWords.trim()}”</blockquote>}
                    <button type="button" className="ph__edit" onClick={() => setStep(0)}>Edit</button>
                  </dd>
                </div>
                <div>
                  <dt>Clinician</dt>
                  <dd>
                    {practitioner?.name ?? '—'} <span className="ph__dim">{practitioner?.role}</span>
                    <button type="button" className="ph__edit" onClick={() => setStep(1)}>Edit</button>
                  </dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>
                    {activeDay && activeSlot ? `${longDate(activeDay.date)}, ${activeSlot.label} — 20 min` : '—'}
                    <button type="button" className="ph__edit" onClick={() => setStep(2)}>Edit</button>
                  </dd>
                </div>
                <div>
                  <dt>Patient</dt>
                  <dd>
                    {details.first} {details.last} <span className="ph__dim">{details.phone}</span>
                    <button type="button" className="ph__edit" onClick={() => setStep(3)}>Edit</button>
                  </dd>
                </div>
                <div>
                  <dt>Cost</dt>
                  <dd>
                    {details.medicare.replace(/\s/g, '').length === 10
                      ? 'Bulk billed — $0.00, no gap'
                      : '$39 gap without a Medicare number (rebate claimable)'}
                  </dd>
                </div>
              </dl>

              <div className="ph__cta">
                <button type="button" className="ph__btn ph__btn--primary" disabled={confirming} onClick={confirm}>
                  {confirming ? (
                    <>
                      <span className="ph__spin" aria-hidden="true" /> Holding your time…
                    </>
                  ) : (
                    'Book this appointment'
                  )}
                </button>
                <p className="ph__fine">Free to reschedule up to 2 hours before. We hold your slot while you decide.</p>
              </div>
            </div>
          )}

          {/* --------------------------------------------- confirmation */}
          {step === 5 && booked && (
            <div className="ph__step ph__confirm">
              <div className="ph__check" aria-hidden="true">
                <svg viewBox="0 0 52 52" width="52" height="52">
                  <circle cx="26" cy="26" r="24" />
                  <path d="M15 27l7 7 15-16" />
                </svg>
              </div>
              <h2 ref={headingRef} tabIndex={-1} className="ph__h2">
                You're booked, {details.first || 'friend'}.
              </h2>
              <p className="ph__lead">
                {practitioner?.name} — {longDate(booked.when)} at{' '}
                {booked.when.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}.
              </p>

              <div className="ph__ticket">
                <div>
                  <span className="ph__ticket-label">Booking reference</span>
                  <b>{booked.ref}</b>
                </div>
                <div>
                  <span className="ph__ticket-label">Rejoin code (save this)</span>
                  <b className="ph__mono">{booked.code}</b>
                  <button
                    type="button"
                    className="ph__btn ph__btn--small"
                    onClick={() => {
                      navigator.clipboard?.writeText(booked.code).catch(() => undefined)
                      setCopied(true)
                      window.setTimeout(() => setCopied(false), 1600)
                    }}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <ol className="ph__next">
                <li><b>15 minutes before:</b> we text your video link.</li>
                <li><b>On a shaky connection?</b> it drops to audio, then a phone call — never a lost consult.</li>
                <li><b>Have handy:</b> your Medicare card and any current medications.</li>
              </ol>

              <div className="ph__cta ph__cta--row">
                <button type="button" className="ph__btn ph__btn--primary" onClick={downloadIcs}>
                  Add to calendar
                </button>
                <button type="button" className="ph__btn ph__btn--ghost" onClick={reset}>
                  Book another appointment
                </button>
              </div>
            </div>
          )}

          {/* footer nav for steps 0–4 */}
          {step < 5 && step !== 4 && (
            <div className="ph__nav">
              <button type="button" className="ph__btn ph__btn--ghost" onClick={back} disabled={step === 0}>
                ← Back
              </button>
              <button
                type="button"
                className="ph__btn ph__btn--primary"
                disabled={
                  (step === 1 && !practId) ||
                  (step === 2 && (!activeSlot || loadedFor !== practitioner?.id))
                }
                onClick={next}
              >
                Continue →
              </button>
            </div>
          )}
          {step === 4 && (
            <div className="ph__nav">
              <button type="button" className="ph__btn ph__btn--ghost" onClick={back} disabled={confirming}>
                ← Back
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="ph__footer">
        <p>Pylon Health is a fictional practice in the Brassfern Lab. Demo data, real craft.</p>
      </footer>
    </div>
  )
}
