import { useEffect, useMemo, useRef, useState } from 'react'
import './demo.css'
import SeatMap from './SeatMap'
import {
  DIETARY_OPTIONS,
  HOLD_MS,
  RUNS,
  RUN_OF_SEAT,
  SEAT_BY_ID,
  SUPPERS,
  TIERS,
  TOTAL_SEATS,
  VENUE,
  blockFor,
  fmtMoney,
  fmtTime,
  takenFor,
  type Supper,
} from './data'

/**
 * Tallow & Co. — Supper Series ticketing.
 *
 * Art direction: butcher-paper cream under charcoal ink, stamp-red
 * ticketing, ticket-stub typography. The room is drawn, not rendered —
 * a butcher's floor plan where every chair is a button, with a full list
 * view for anyone who'd rather read than point. Seats are held on the
 * board (10-minute hold timer), details earn a dashed-perforation ticket,
 * and the confirmation is stamped like the best kind of paperwork.
 * All suppers, chairs and availability are fictional.
 */

type Step = 'supper' | 'seats' | 'details' | 'done'
type View = 'map' | 'list'

const STEPS: Array<{ key: Step; label: string }> = [
  { key: 'supper', label: 'Supper' },
  { key: 'seats', label: 'Chairs' },
  { key: 'details', label: 'Details' },
  { key: 'done', label: 'Tickets' },
]

const PARTY_SIZES = [1, 2, 3, 4, 5, 6]
const BOOKING_FEE = 7.5

interface Booking {
  ref: string
  supper: Supper
  seats: string[]
  name: string
  email: string
  phone: string
  diet: Record<string, string>
  allergens: string
  total: number
}

function regexEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())
}

export default function TallowSeatMap() {
  // ----------------------------------------------- state
  const [step, setStep] = useState<Step>('supper')
  const [view, setView] = useState<View>('map')
  const [supper, setSupper] = useState<Supper | null>(null)
  const [party, setParty] = useState(2)
  const [anchor, setAnchor] = useState<string | null>(null)
  const [holdEnd, setHoldEnd] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [notice, setNotice] = useState<string | null>(null)
  const [live, setLive] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [allergens, setAllergens] = useState('')
  const [diet, setDiet] = useState<Record<string, string>>({})
  const [agreed, setAgreed] = useState(false)
  const [errs, setErrs] = useState<Record<string, string>>({})

  const headingRef = useRef<HTMLHeadingElement>(null)
  const stepRef = useRef<Step>(step)

  // ----------------------------------------------- derived
  const taken = useMemo(() => (supper ? takenFor(supper.id) : new Set<string>()), [supper])
  const selected = useMemo(
    () => (supper && anchor ? blockFor(anchor, party, taken) : []),
    [supper, anchor, party, taken],
  )
  const selectedSet = useMemo(() => new Set(selected), [selected])
  const seatIds = selected // alias for readability
  const subtotal = seatIds.reduce((n, id) => n + TIERS[SEAT_BY_ID[id].tier].price, 0)
  const total = subtotal + (seatIds.length ? BOOKING_FEE : 0)
  const shortfall = anchor ? party - seatIds.length : 0
  const canContinueSeats = seatIds.length === party && party > 0
  const heldMs = holdEnd ? holdEnd - now : 0
  const held = holdEnd !== null && heldMs > 0

  // ----------------------------------------------- effects

  // tick while a hold is live
  useEffect(() => {
    if (!holdEnd) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [holdEnd])

  // expiry
  useEffect(() => {
    if (holdEnd && now >= holdEnd && !booking) {
      setHoldEnd(null)
      setAnchor(null)
      setStep('seats')
      setNotice('Your hold lapsed — the chairs went back on the board. Take what you like, again.')
      setLive('Hold lapsed. Chairs released.')
    }
  }, [now, holdEnd, booking])

  // focus the step heading when we change step
  useEffect(() => {
    if (stepRef.current !== step) {
      stepRef.current = step
      headingRef.current?.focus()
      window.scrollTo({ top: 0 })
    }
  }, [step])

  // announce selection changes for screen readers
  useEffect(() => {
    if (step !== 'seats') return
    if (!seatIds.length) {
      if (anchor === null) setLive('')
      return
    }
    const runName = RUN_OF_SEAT[seatIds[0]]?.name ?? ''
    const msg =
      seatIds.length < party
        ? `${seatIds.length} of ${party} chairs free beside each other at ${runName}`
        : `${seatIds.length} chairs held at ${runName}: ${seatIds.join(', ')}. Total ${fmtMoney(total)}.`
    setLive(msg)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seatIds.join(','), party, step])

  // ----------------------------------------------- actions

  function pickSupper(s: Supper) {
    setSupper(s)
    setAnchor(null)
    setNotice(null)
    setStep('seats')
  }

  function pickSeat(id: string) {
    setNotice(null)
    if (id === anchor) {
      setAnchor(null) // clicking your anchor clears the board
      setLive('Chairs cleared.')
    } else {
      setAnchor(id)
    }
  }

  function goDetails() {
    if (!canContinueSeats) return
    if (!holdEnd) setHoldEnd(Date.now() + HOLD_MS)
    setStep('details')
  }

  function backToSeats() {
    setStep('seats')
  }

  function changeSupper() {
    setAnchor(null)
    setHoldEnd(null)
    setStep('supper')
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = 'Whose name goes on the board?'
    if (!regexEmail(email)) e.email = 'That email won’t reach the kitchen.'
    if (phone.trim() && phone.replace(/\D/g, '').length < 8) e.phone = 'A phone number needs at least 8 digits.'
    if (!agreed) e.agreed = 'Promise you’ll release the chairs if plans change — the kitchen counts heads.'
    return e
  }

  function confirmOrder() {
    if (!supper) return
    const e = validate()
    setErrs(e)
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0]
      document.getElementById(`tsm-f-${first}`)?.focus()
      return
    }
    setConfirming(true)
    window.setTimeout(() => {
      const digits = String(1000 + Math.floor(Math.random() * 9000))
      const d: Record<string, string> = {}
      seatIds.forEach((id) => (d[id] = diet[id] ?? 'All in'))
      setBooking({
        ref: `TC${supper.sup}-${digits}`,
        supper,
        seats: [...seatIds],
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        diet: d,
        allergens: allergens.trim(),
        total,
      })
      setHoldEnd(null)
      setConfirming(false)
      setStep('done')
    }, 1100)
  }

  function bookAnother() {
    setSupper(null)
    setAnchor(null)
    setBooking(null)
    setHoldEnd(null)
    setDiet({})
    setAllergens('')
    setAgreed(false)
    setErrs({})
    setNotice(null)
    setStep('supper')
    setLive('')
  }

  function downloadIcs() {
    if (!booking) return
    const pad = (n: number) => String(n).padStart(2, '0')
    const start = new Date(booking.supper.iso)
    const stamp = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
    const end = new Date(start.getTime() + 3 * 60 * 60_000)
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Tallow & Co.//Supper Series//EN',
      'BEGIN:VEVENT',
      `UID:${booking.ref}@tallow-co.demo`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:Tallow & Co. Supper №${booking.supper.sup} — ${booking.supper.title}`,
      `DESCRIPTION:Chairs ${booking.seats.join(', ')} · Ref ${booking.ref}. ${VENUE.doors}.`,
      `LOCATION:${VENUE.address.replaceAll(',', '\\,')}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `tallow-supper-${booking.ref}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ----------------------------------------------- render helpers

  const stepIndex = STEPS.findIndex((s) => s.key === step)
  const seatsLeft = supper ? TOTAL_SEATS - taken.size : 0

  return (
    <div className="tsm">
      {/* ---------------------------------------------------------- header */}
      <header className="tsm-head">
        <div className="tsm-brand">
          <p className="tsm-brand__mark" aria-hidden="true">
            Tallow <span className="tsm-brand__amp">&</span> Co.
          </p>
          <p className="tsm-brand__sub">Providore · Norwood · est. 1987</p>
        </div>
        <div className="tsm-head__title">
          <p className="tsm-overline">The Sawdust Room</p>
          <h1 className="tsm-h1">
            Supper <em>Series</em>
          </h1>
          <p className="tsm-head__meta">One long table · 36 chairs · doors 6:45 pm</p>
        </div>
        <ol className="tsm-steps" aria-label="Booking steps">
          {STEPS.map((s, i) => (
            <li
              key={s.key}
              className={`tsm-steps__item${i === stepIndex ? ' is-now' : ''}${i < stepIndex ? ' is-done' : ''}`}
              aria-current={i === stepIndex ? 'step' : undefined}
            >
              <span className="tsm-steps__tick" aria-hidden="true">
                {i < stepIndex ? '✓' : i + 1}
              </span>
              <span className="tsm-steps__label">{s.label}</span>
            </li>
          ))}
        </ol>
      </header>

      <p className="tsm-sr" role="status" aria-live="polite">
        {live}
      </p>

      {notice && (
        <p className="tsm-notice" role="alert">
          <span aria-hidden="true">✂</span> {notice}
        </p>
      )}

      <div className={`tsm-layout${step === 'supper' || step === 'done' ? ' tsm-layout--full' : ''}`}>
        {/* --------------------------------------------------------- main */}
        <main className="tsm-main">
          {/* ---- step: supper ---- */}
          {step === 'supper' && (
            <section aria-labelledby="tsm-h-supper" className="tsm-panel">
              <h2 id="tsm-h-supper" className="tsm-h2" ref={headingRef} tabIndex={-1}>
                Choose your <em>supper</em>
              </h2>
              <p className="tsm-lede">
                Three evenings a season, after the flyscreens come down. The same table rules as 1987:
                no phones over plates, no splitting the last course.
              </p>
              <div className="tsm-suppers">
                {SUPPERS.map((s) => {
                  const takenCount = takenFor(s.id).size
                  const left = TOTAL_SEATS - takenCount
                  const scarce = left <= 12
                  return (
                    <article key={s.id} className="tsm-supper">
                      <div className="tsm-supper__date" aria-hidden="true">
                        <span className="tsm-supper__day">{s.day}</span>
                        <span className="tsm-supper__month">{s.month}</span>
                      </div>
                      <div className="tsm-supper__body">
                        <p className="tsm-supper__no">Supper № {s.sup}</p>
                        <h3 className="tsm-supper__title">{s.title}</h3>
                        <p className="tsm-supper__blurb">{s.blurb}</p>
                        <p className="tsm-supper__courses">{s.courses.join(' · ')}</p>
                        <p className="tsm-supper__meta">
                          <span>{s.weekday} — {VENUE.doors.toLowerCase()}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {left} of {TOTAL_SEATS} chairs left
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>from {fmtMoney(145)}</span>
                        </p>
                        {scarce && <span className="tsm-stamp tsm-stamp--small">Nearly full</span>}
                      </div>
                      <button type="button" className="tsm-btn tsm-btn--red" onClick={() => pickSupper(s)}>
                        Take chairs <span aria-hidden="true">→</span>
                      </button>
                    </article>
                  )
                })}
              </div>
              <p className="tsm-fineprint">
                Concept box office — suppers, chairs and availability are fictional. The knife skills are not.
              </p>
            </section>
          )}

          {/* ---- step: seats ---- */}
          {step === 'seats' && supper && (
            <section aria-labelledby="tsm-h-seats" className="tsm-panel">
              <div className="tsm-panel__head">
                <div>
                  <p className="tsm-overline">Supper № {supper.sup} — {supper.title}</p>
                  <h2 id="tsm-h-seats" className="tsm-h2" ref={headingRef} tabIndex={-1}>
                    Take your <em>chairs</em>
                  </h2>
                </div>
                <button type="button" className="tsm-linklike" onClick={changeSupper}>
                  ✂ Change supper
                </button>
              </div>

              <fieldset className="tsm-fieldset">
                <legend className="tsm-label">Your party — parties sit together, always</legend>
                <div className="tsm-party" role="group" aria-label="Party size">
                  {PARTY_SIZES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`tsm-party__btn${party === n ? ' is-on' : ''}`}
                      aria-pressed={party === n}
                      onClick={() => setParty(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <p className="tsm-party__note">
                    Party of {party}. Bigger than six? Two bookings — or write to Frankie.
                  </p>
                </div>
              </fieldset>

              <div className="tsm-board-head">
                <div className="tsm-viewtoggle" role="group" aria-label="Seat views">
                  <button
                    type="button"
                    className={`tsm-viewtoggle__btn${view === 'map' ? ' is-on' : ''}`}
                    aria-pressed={view === 'map'}
                    onClick={() => setView('map')}
                  >
                    Floor plan
                  </button>
                  <button
                    type="button"
                    className={`tsm-viewtoggle__btn${view === 'list' ? ' is-on' : ''}`}
                    aria-pressed={view === 'list'}
                    onClick={() => setView('list')}
                  >
                    Chair list
                  </button>
                </div>
                <ul className="tsm-legend" aria-label="Chair states">
                  <li><span className="tsm-swatch tsm-swatch--free" aria-hidden="true" /> free</li>
                  <li><span className="tsm-swatch tsm-swatch--held" aria-hidden="true" /> your hold</li>
                  <li><span className="tsm-swatch tsm-swatch--sold" aria-hidden="true" /> sold</li>
                </ul>
              </div>
              <p className="tsm-tierkey">
                {Object.values(TIERS)
                  .map((t) => `${t.name} ${fmtMoney(t.price)}`)
                  .join('  ·  ')}{' '}
                — courses, the pour, and the good bread.
              </p>

              {view === 'map' ? (
                <SeatMap
                  taken={taken}
                  selected={selectedSet}
                  anchor={anchor}
                  onPick={pickSeat}
                  dateLabel={`${supper.weekday}, ${supper.dateShort}`}
                />
              ) : (
                <div className="tsm-list">
                  {RUNS.map((run) => {
                    const tier = TIERS[run.tier]
                    return (
                      <section key={run.key} className="tsm-list__run" aria-labelledby={`tsm-run-${run.key}`}>
                        <h3 id={`tsm-run-${run.key}`} className="tsm-list__runname">
                          {run.name} <span className="tsm-list__price">{fmtMoney(tier.price)}</span>
                        </h3>
                        <div className="tsm-list__chairs" role="group" aria-label={`Chairs at ${run.name}`}>
                          {run.ids.map((id) => {
                            const isTaken = taken.has(id)
                            const isPicked = selectedSet.has(id)
                            return (
                              <button
                                key={id}
                                type="button"
                                className={`tsm-chairchip${isPicked ? ' is-on' : ''}${isTaken ? ' is-taken' : ''}`}
                                aria-pressed={isPicked}
                                disabled={isTaken}
                                onClick={() => pickSeat(id)}
                              >
                                <span className="tsm-chairchip__id">{id}</span>
                                <span className="tsm-chairchip__state">{isTaken ? 'sold' : isPicked ? 'yours' : ''}</span>
                              </button>
                            )
                          })}
                        </div>
                      </section>
                    )
                  })}
                </div>
              )}

              {shortfall > 0 && anchor && (
                <p className="tsm-shortfall" role="status">
                  Only {seatIds.length} together at {RUN_OF_SEAT[anchor].name} — the rest of your party needs
                  another row. Try a quieter section of the room.
                </p>
              )}

              {supper && (
                <p className="tsm-roomnote">
                  {seatsLeft} chairs left of {TOTAL_SEATS} for {supper.dateShort}. House rule: once you carry
                  chairs to checkout, a ten-minute hold keeps them yours — then they’re back on the board.
                </p>
              )}
            </section>
          )}

          {/* ---- step: details ---- */}
          {step === 'details' && supper && (
            <section aria-labelledby="tsm-h-details" className="tsm-panel">
              <div className="tsm-panel__head">
                <div>
                  <p className="tsm-overline">Supper № {supper.sup} — chairs {seatIds.join(', ')}</p>
                  <h2 id="tsm-h-details" className="tsm-h2" ref={headingRef} tabIndex={-1}>
                    Whose <em>evening</em> is it?
                  </h2>
                </div>
                <button type="button" className="tsm-linklike" onClick={backToSeats}>
                  ← Move chairs
                </button>
              </div>

              <div className="tsm-fields">
                <div className="tsm-field">
                  <label htmlFor="tsm-f-name" className="tsm-label">Name on the board</label>
                  <input
                    id="tsm-f-name"
                    className={`tsm-input${errs.name ? ' is-err' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="e.g. Frankie Tallow"
                  />
                  {errs.name && <p className="tsm-err" role="alert">{errs.name}</p>}
                </div>
                <div className="tsm-field">
                  <label htmlFor="tsm-f-email" className="tsm-label">Email for the tickets</label>
                  <input
                    id="tsm-f-email"
                    type="email"
                    className={`tsm-input${errs.email ? ' is-err' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                  {errs.email && <p className="tsm-err" role="alert">{errs.email}</p>}
                </div>
                <div className="tsm-field">
                  <label htmlFor="tsm-f-phone" className="tsm-label">Phone <span className="tsm-opt">optional — running late?</span></label>
                  <input
                    id="tsm-f-phone"
                    type="tel"
                    className={`tsm-input${errs.phone ? ' is-err' : ''}`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="04xx xxx xxx"
                  />
                  {errs.phone && <p className="tsm-err" role="alert">{errs.phone}</p>}
                </div>

                <fieldset className="tsm-fieldset tsm-fieldset--diets">
                  <legend className="tsm-label">Each chair, one request</legend>
                  {seatIds.map((id) => (
                    <div key={id} className="tsm-diet">
                      <span className="tsm-diet__seat">Chair {id} · {TIERS[SEAT_BY_ID[id].tier].name}</span>
                      <div className="tsm-diet__opts" role="group" aria-label={`Menu for chair ${id}`}>
                        {DIETARY_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`tsm-diet__btn${(diet[id] ?? 'All in') === opt ? ' is-on' : ''}`}
                            aria-pressed={(diet[id] ?? 'All in') === opt}
                            onClick={() => setDiet((d) => ({ ...d, [id]: opt }))}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </fieldset>

                <div className="tsm-field">
                  <label htmlFor="tsm-f-allergens" className="tsm-label">
                    Allergies &amp; the kitchen should know <span className="tsm-opt">optional</span>
                  </label>
                  <textarea
                    id="tsm-f-allergens"
                    className="tsm-input tsm-input--area"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    rows={3}
                    placeholder="e.g. No shellfish at chair T6; a birthday — keep it quiet."
                  />
                </div>

                <div className="tsm-agree">
                  <input
                    id="tsm-f-agreed"
                    type="checkbox"
                    className="tsm-check"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <label htmlFor="tsm-f-agreed" className="tsm-agree__label">
                    If plans change, I’ll release the chairs so the kitchen isn’t cooking for ghosts.
                  </label>
                </div>
                {errs.agreed && <p className="tsm-err" role="alert">{errs.agreed}</p>}
              </div>
            </section>
          )}

          {/* ---- step: tickets ---- */}
          {step === 'done' && booking && (
            <section aria-labelledby="tsm-h-done" className="tsm-panel tsm-panel--done">
              <div className="tsm-done__head">
                <p className="tsm-overline">Booking ref {booking.ref}</p>
                <h2 id="tsm-h-done" className="tsm-h2" ref={headingRef} tabIndex={-1}>
                  You’re on the <em>board</em>, {booking.name.split(' ')[0]}
                </h2>
                <p className="tsm-lede">
                  Tickets are on their way to {booking.email}. Show this ref at the door — or just say the
                  name, we usually know it.
                </p>
                <span className="tsm-stamp tsm-stamp--big" aria-hidden="true">Confirmed</span>
              </div>

              <div className="tsm-tickets">
                {booking.seats.map((id, i) => {
                  const tier = TIERS[SEAT_BY_ID[id].tier]
                  const serial = `${booking.supper.sup}${String(i + 1).padStart(2, '0')}${id.replace(/\D/g, '').padStart(2, '0')}-8413`
                  return (
                    <article key={id} className="tsm-ticket">
                      <div className="tsm-ticket__main">
                        <p className="tsm-ticket__brand">Tallow &amp; Co. — Supper № {booking.supper.sup}</p>
                        <p className="tsm-ticket__event">{booking.supper.title}</p>
                        <p className="tsm-ticket__when">
                          {booking.supper.weekday} · {booking.supper.dateShort} · {VENUE.doors.split('·')[1].trim()}
                        </p>
                        <div className="tsm-ticket__row">
                          <span className="tsm-ticket__seatno">{id}</span>
                          <span className="tsm-ticket__tier">{tier.name}</span>
                          <span className="tsm-ticket__price">{fmtMoney(tier.price)}</span>
                        </div>
                        <p className="tsm-ticket__holder">
                          {booking.name} — {booking.diet[id]}
                        </p>
                        <div className="tsm-ticket__barcode" aria-hidden="true" />
                        <p className="tsm-ticket__serial">№ {serial}</p>
                      </div>
                      <div className="tsm-ticket__rip" aria-hidden="true" />
                      <div className="tsm-ticket__stub">
                        <p className="tsm-ticket__admit">Admit one</p>
                        <p className="tsm-ticket__stubseat">{id}</p>
                        <p className="tsm-ticket__stubdate">{booking.supper.dateShort}</p>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="tsm-done__actions">
                <button type="button" className="tsm-btn" onClick={downloadIcs}>
                  Add to calendar (.ics)
                </button>
                <button type="button" className="tsm-btn tsm-btn--ghost" onClick={bookAnother}>
                  Book another supper
                </button>
              </div>
              <p className="tsm-fineprint">
                Fictional tickets, real appetite. Note to the kitchen: {booking.allergens || 'nothing flagged'}.
              </p>
            </section>
          )}
        </main>

        {/* ------------------------------------------------------ summary */}
        {(step === 'seats' || step === 'details') && supper && (
          <aside className="tsm-summary" aria-label="Order summary">
            <div className="tsm-summary__card">
              {held && (
                <div className={`tsm-hold${heldMs < 120_000 ? ' is-soon' : ''}`}>
                  <div className="tsm-hold__row">
                    <span className="tsm-hold__label">On the board for</span>
                    <span className="tsm-hold__clock" role="timer" aria-live="off">{fmtTime(heldMs)}</span>
                  </div>
                  <div
                    className="tsm-hold__bar"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={10}
                    aria-valuenow={Math.ceil(heldMs / 60000)}
                    aria-label="Hold time remaining"
                  >
                    <span style={{ width: `${Math.max(0, (heldMs / HOLD_MS) * 100)}%` }} />
                  </div>
                  <p className="tsm-hold__hint">
                    Held until {new Date(holdEnd!).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}.
                  </p>
                </div>
              )}
              {!held && step === 'details' && (
                <p className="tsm-hold tsm-hold--gone">Hold lapsed — chairs released. Take them again from the board.</p>
              )}

              <p className="tsm-overline">Order № in waiting</p>
              <h3 className="tsm-summary__title">{supper.title}</h3>
              <p className="tsm-summary__when">
                {supper.weekday}, {supper.dateShort} — {VENUE.name}, Norwood
              </p>

              {seatIds.length ? (
                <ul className="tsm-summary__seats">
                  {seatIds.map((id) => {
                    const tier = TIERS[SEAT_BY_ID[id].tier]
                    return (
                      <li key={id} className="tsm-summary__seat">
                        <span className="tsm-summary__seatid">{id}</span>
                        <span className="tsm-summary__seattier">{tier.name}</span>
                        <span className="tsm-summary__seatprice">{fmtMoney(tier.price)}</span>
                        <button
                          type="button"
                          className="tsm-summary__x"
                          aria-label={`Chair ${id}, ${tier.name}, held — press to re-anchor the party here, or press again to clear`}
                          onClick={() => pickSeat(id)}
                        >
                          ✕
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="tsm-summary__empty">
                  No chairs yet. Tap one on the plan — we’ll seat your party of {party} beside each other.
                </p>
              )}

              {shortfall > 0 && anchor && (
                <p className="tsm-summary__short">{shortfall} chair{shortfall > 1 ? 's' : ''} short beside that anchor.</p>
              )}

              <dl className="tsm-summary__totals">
                <div><dt>Chairs ×{seatIds.length}</dt><dd>{fmtMoney(subtotal)}</dd></div>
                <div><dt>Booking &amp; sharpening fee</dt><dd>{seatIds.length ? fmtMoney(BOOKING_FEE) : '—'}</dd></div>
                <div className="tsm-summary__grand"><dt>Total</dt><dd>{fmtMoney(total)}</dd></div>
              </dl>

              {step === 'seats' && (
                <button
                  type="button"
                  className="tsm-btn tsm-btn--wide tsm-btn--red"
                  disabled={!canContinueSeats}
                  onClick={goDetails}
                >
                  {canContinueSeats
                    ? `Hold ${party} chair${party > 1 ? 's' : ''} — ${fmtMoney(total)}`
                    : seatIds.length
                      ? `Short ${shortfall} chair${shortfall === 1 ? '' : 's'}`
                      : 'Pick a chair to begin'}
                </button>
              )}
              {step === 'details' && (
                <button
                  type="button"
                  className="tsm-btn tsm-btn--wide tsm-btn--red"
                  disabled={confirming}
                  onClick={confirmOrder}
                >
                  {confirming ? 'Writing your name on the board…' : `Confirm — ${fmtMoney(total)}`}
                </button>
              )}

              <p className="tsm-summary__fine">
                Demo checkout — no card, no charge. Ten-minute holds; donations of cancelled seats go to
                the kitchen’s family meal.
              </p>
            </div>
          </aside>
        )}
      </div>

      <footer className="tsm-foot">
        <p>
          Tallow &amp; Co. — Supper Series · {VENUE.address} · concept ticketing demo with fictional suppers,
          chairs and availability.
        </p>
      </footer>
    </div>
  )
}
