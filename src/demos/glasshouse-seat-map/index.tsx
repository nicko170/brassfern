import { useEffect, useMemo, useRef, useState } from 'react'
import './demo.css'
import SeatMap from './SeatMap'
import SeatList from './SeatList'
import {
  BOOKING_FEE,
  HOLD_MS,
  MAX_SEATS,
  SEAT_BY_ID,
  SHOWS,
  TIERS,
  TIER_ORDER,
  TOTAL_SEATS,
  findBestAvailable,
  fmtMoney,
  fmtTime,
  sightline,
  soldFor,
  type Show,
} from './data'

/**
 * The Glasshouse — box office.
 *
 * Art direction: velvet night. Deep oxblood walls, gilt filigree, cream
 * playbill type; the house drawn like an architect's plan. One screen does
 * the whole job: pick a performance, walk the plan (pointer, pinch, arrows
 * or the list), take up to eight chairs, watch the hold clock, and take
 * them to the box office. All shows, chairs and availability are fictional.
 */

const PARTY_SIZES = [1, 2, 3, 4, 5, 6]

interface Order {
  ref: string
  show: Show
  seats: string[]
  total: number
}

export default function GlasshouseSeatMap() {
  // ------------------------------------------------ state
  const [showId, setShowId] = useState(SHOWS[0].id)
  const [sel, setSel] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [view, setView] = useState<'map' | 'list'>('map')
  const [colourSafe, setColourSafe] = useState(false)
  const [party, setParty] = useState(2)
  const [holdEnd, setHoldEnd] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [notice, setNotice] = useState<string | null>(null)
  const [live, setLive] = useState('')
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

  const liveTimer = useRef<number | null>(null)

  // ------------------------------------------------ derived
  const show = SHOWS.find((s) => s.id === showId) ?? SHOWS[0]
  const sold = useMemo(() => soldFor(showId), [showId])
  const selected = useMemo(() => new Set(sel), [sel])
  const activeSeat = activeId ? SEAT_BY_ID[activeId] : null
  const subtotal = sel.reduce((n, id) => n + TIERS[SEAT_BY_ID[id].tier].price, 0)
  const total = subtotal + (sel.length ? BOOKING_FEE : 0)
  const heldMs = holdEnd ? holdEnd - now : 0
  const held = holdEnd !== null && heldMs > 0
  const freeCount = TOTAL_SEATS - sold.size
  const scarce = freeCount <= 60

  // ------------------------------------------------ effects

  // hold clock
  useEffect(() => {
    if (!holdEnd) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [holdEnd])

  // hold expiry
  useEffect(() => {
    if (holdEnd && now >= holdEnd && !order) {
      setHoldEnd(null)
      setSel([])
      setNotice('The hold lapsed and the house took the chairs back. They go fast on a good night.')
      announce('Hold lapsed — chairs released.')
    }
  }, [now, holdEnd, order])

  // keep SR announcements short-lived but polite
  function announce(msg: string) {
    if (liveTimer.current) window.clearTimeout(liveTimer.current)
    setLive('')
    liveTimer.current = window.setTimeout(() => setLive(msg), 60)
  }

  // ------------------------------------------------ actions

  function pickShow(id: string) {
    if (id === showId) return
    setShowId(id)
    setSel([])
    setHoldEnd(null)
    setActiveId(null)
    setOrder(null)
    setNotice(null)
    const s = SHOWS.find((x) => x.id === id)!
    announce(`Now showing ${s.title}, ${s.dateShort}. ${TOTAL_SEATS - soldFor(id).size} chairs available.`)
  }

  function toggle(id: string) {
    setNotice(null)
    if (sold.has(id)) return
    if (selected.has(id)) {
      const next = sel.filter((x) => x !== id)
      setSel(next)
      if (!next.length) setHoldEnd(null)
      announce(`${labelSeat(id)} released. ${next.length} chair${next.length === 1 ? '' : 's'} in your order.`)
      return
    }
    if (sel.length >= MAX_SEATS) {
      setNotice(`House limit of ${MAX_SEATS} chairs per booking — for bigger parties, phone the box office and ask for Marge.`)
      return
    }
    if (!holdEnd) setHoldEnd(Date.now() + HOLD_MS)
    setSel([...sel, id])
    const t = TIERS[SEAT_BY_ID[id].tier]
    announce(`${labelSeat(id)} taken, ${t.name} ${fmtMoney(t.price)}. ${sel.length + 1} in your order.`)
  }

  function labelSeat(id: string): string {
    const s = SEAT_BY_ID[id]
    return s.section === 'box' ? `${s.sectionName} chair ${s.num}` : `${s.sectionName} row ${s.row} seat ${s.num}`
  }

  function bestAvailable() {
    setNotice(null)
    const ids = findBestAvailable(sold, party)
    if (!ids) {
      setNotice(`No ${party} together left in a row — split the party across two rows, or try the boxes.`)
      announce(`No run of ${party} chairs available.`)
      return
    }
    if (!holdEnd) setHoldEnd(Date.now() + HOLD_MS)
    setSel(ids)
    setActiveId(ids[0])
    const first = SEAT_BY_ID[ids[0]]
    announce(
      `Best ${ids.length} available: ${first.sectionName} row ${first.row}, seats ${ids.map((id) => SEAT_BY_ID[id].num).join(', ')}. Total ${fmtMoney(ids.reduce((n, id) => n + TIERS[SEAT_BY_ID[id].tier].price, BOOKING_FEE))}.`,
    )
  }

  function checkout() {
    if (!sel.length || placing) return
    setPlacing(true)
    window.setTimeout(() => {
      const ref = `GH-${show.day}${show.month}-${String(100 + Math.floor(Math.random() * 900))}`
      setOrder({ ref, show, seats: [...sel], total })
      setHoldEnd(null)
      setPlacing(false)
      setSel([])
      announce(`Order ${ref} confirmed. ${sel.length} chairs for ${show.title}.`)
      document.getElementById('gsm-order-head')?.focus()
    }, 1100)
  }

  function bookAnother() {
    setOrder(null)
    setNotice(null)
  }

  // ------------------------------------------------ render

  return (
    <div className={`gsm${colourSafe ? ' gsm--cb' : ''}`}>
      {/* ------------------------------------------------ header */}
      <header className="gsm-head">
        <div className="gsm-brand">
          <p className="gsm-brand__mark">
            The <em>Glasshouse</em>
          </p>
          <p className="gsm-brand__sub">Independent theatre · King Street · est. 1927</p>
        </div>
        <ol className="gsm-facts" aria-label="House facts">
          <li><span className="gsm-facts__n">{TOTAL_SEATS}</span> chairs</li>
          <li><span className="gsm-facts__n">3</span> levels</li>
          <li><span className="gsm-facts__n">1</span> chandelier</li>
        </ol>
      </header>

      <div className="gsm-titleband">
        <p className="gsm-overline">Box office — Winter season</p>
        <h1 className="gsm-h1">
          Take your <em>seat</em>
        </h1>
        <p className="gsm-titleband__meta">
          Doors thirty minutes before curtain · the bar pours until the second bell
        </p>
      </div>

      <p className="gsm-sr" role="status" aria-live="polite">{live}</p>

      {notice && (
        <p className="gsm-notice" role="alert">
          <span aria-hidden="true">✳</span> {notice}
        </p>
      )}

      {/* ------------------------------------------------ show picker */}
      <div className="gsm-shows" role="radiogroup" aria-label="Choose a performance">
        {SHOWS.map((s) => {
          const left = TOTAL_SEATS - soldFor(s.id).size
          const on = s.id === showId
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={`gsm-show${on ? ' is-on' : ''}`}
              onClick={() => pickShow(s.id)}
            >
              <span className="gsm-show__date" aria-hidden="true">
                <span className="gsm-show__day">{s.day}</span>
                <span className="gsm-show__month">{s.month}</span>
              </span>
              <span className="gsm-show__body">
                <span className="gsm-show__kind">{s.kind}</span>
                <span className="gsm-show__title">{s.title}</span>
                <span className="gsm-show__meta">
                  {s.weekday} · {s.time} · {left} chairs left
                </span>
              </span>
              {left <= 60 && <span className="gsm-show__flag">Last chairs</span>}
            </button>
          )
        })}
      </div>
      <p className="gsm-showblurb">{show.blurb}</p>

      <div className="gsm-layout">
        {/* ------------------------------------------------ map panel */}
        <main className="gsm-stagepanel">
          <div className="gsm-toolbar">
            <div className="gsm-viewtoggle" role="group" aria-label="Seat picker views">
              <button
                type="button"
                className={`gsm-viewtoggle__btn${view === 'map' ? ' is-on' : ''}`}
                aria-pressed={view === 'map'}
                onClick={() => setView('map')}
              >
                House plan
              </button>
              <button
                type="button"
                className={`gsm-viewtoggle__btn${view === 'list' ? ' is-on' : ''}`}
                aria-pressed={view === 'list'}
                onClick={() => setView('list')}
              >
                Chair list
              </button>
            </div>

            <label className="gsm-cbswitch">
              <input
                type="checkbox"
                className="gsm-cbswitch__input"
                checked={colourSafe}
                onChange={(e) => setColourSafe(e.target.checked)}
              />
              <span className="gsm-cbswitch__track" aria-hidden="true"><span className="gsm-cbswitch__knob" /></span>
              <span className="gsm-cbswitch__label">Colour-safe palette</span>
            </label>
          </div>

          <ul className="gsm-legend" aria-label="Price tiers">
            {TIER_ORDER.map((k) => (
              <li key={k}>
                <span className={`gsm-swatch gsm-swatch--${k}`} aria-hidden="true" />
                <span className="gsm-legend__name">{TIERS[k].name}</span>
                <span className="gsm-legend__price">{fmtMoney(TIERS[k].price)}</span>
              </li>
            ))}
            <li>
              <span className="gsm-swatch gsm-swatch--sold" aria-hidden="true" />
              <span className="gsm-legend__name">Sold</span>
            </li>
          </ul>

          {view === 'map' ? (
            <SeatMap
              sold={sold}
              selected={selected}
              activeId={activeId}
              onActive={setActiveId}
              onToggle={toggle}
            />
          ) : (
            <SeatList sold={sold} selected={selected} onToggle={toggle} />
          )}

          {/* seat detail card — hover / focus / arrow-key driven */}
          {view === 'map' && (
            <div className="gsm-detail" aria-hidden={!activeSeat}>
              {activeSeat ? (
                <>
                  <div className="gsm-detail__idblock">
                    <p className="gsm-detail__seat">
                      {activeSeat.section === 'box'
                        ? `${activeSeat.sectionName} · chair ${activeSeat.num}`
                        : `${activeSeat.sectionName} · row ${activeSeat.row} · seat ${activeSeat.num}`}
                    </p>
                    <p className={`gsm-detail__tier gsm-detail__tier--${activeSeat.tier}`}>
                      {TIERS[activeSeat.tier].name} — {fmtMoney(TIERS[activeSeat.tier].price)}
                    </p>
                  </div>
                  <p className="gsm-detail__line">{sightline(activeSeat)}</p>
                  {sold.has(activeSeat.id) ? (
                    <p className="gsm-detail__sold">Taken — try the chair beside it.</p>
                  ) : (
                    <button
                      type="button"
                      className="gsm-detail__btn"
                      onClick={() => toggle(activeSeat.id)}
                    >
                      {selected.has(activeSeat.id) ? 'Release this chair' : 'Take this chair'}
                    </button>
                  )}
                </>
              ) : (
                <p className="gsm-detail__idle">Hover, tap or arrow-walk a chair for its story.</p>
              )}
            </div>
          )}
        </main>

        {/* ------------------------------------------------ order */}
        <aside className="gsm-order" aria-label="Your order">
          <div className="gsm-order__card">
            {order ? (
              <div className="gsm-done">
                <p className="gsm-overline">Order {order.ref}</p>
                <h2 id="gsm-order-head" className="gsm-h2" tabIndex={-1}>
                  House lights <em>down</em>
                </h2>
                <p className="gsm-done__lead">
                  {order.seats.length} chair{order.seats.length === 1 ? '' : 's'} for {order.show.title},{' '}
                  {order.show.dateShort} at {order.show.time}. Collect at the box office from an hour before
                  curtain — just say the name on the order.
                </p>
                <ul className="gsm-done__seats">
                  {order.seats.map((id) => {
                    const s = SEAT_BY_ID[id]
                    const t = TIERS[s.tier]
                    return (
                      <li key={id}>
                        <span>{labelSeat(id)}</span>
                        <span className="gsm-done__tier">{t.name}</span>
                        <span>{fmtMoney(t.price)}</span>
                      </li>
                    )
                  })}
                </ul>
                <p className="gsm-done__total">Paid {fmtMoney(order.total)} — incl. booking fee</p>
                <button type="button" className="gsm-btn gsm-btn--ghost gsm-btn--wide" onClick={bookAnother}>
                  Back to the plan
                </button>
                <p className="gsm-fineprint">Fictional tickets. The chandelier, sadly, is real only in our hearts.</p>
              </div>
            ) : (
              <>
                {held && (
                  <div className={`gsm-hold${heldMs < 120_000 ? ' is-soon' : ''}`}>
                    <div className="gsm-hold__row">
                      <span className="gsm-hold__label">Held until the bell</span>
                      <span className="gsm-hold__clock" role="timer">
                        {fmtTime(heldMs)}
                      </span>
                    </div>
                    <div
                      className="gsm-hold__bar"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={10}
                      aria-valuenow={Math.ceil(heldMs / 60000)}
                      aria-label="Hold time remaining in minutes"
                    >
                      <span style={{ width: `${Math.max(0, (heldMs / HOLD_MS) * 100)}%` }} />
                    </div>
                    <p className="gsm-hold__hint">
                      {show.watching} people are browsing this performance <em>(illustrative)</em> — your
                      chairs are yours for ten minutes.
                    </p>
                  </div>
                )}

                <p className="gsm-overline">Tonight’s order</p>
                <h2 className="gsm-order__title">{show.title}</h2>
                <p className="gsm-order__when">
                  {show.weekday}, {show.dateShort} · {show.time}
                  {scarce && <span className="gsm-order__scarce"> · selling fast</span>}
                </p>

                {sel.length ? (
                  <ul className="gsm-order__seats">
                    {sel.map((id) => {
                      const s = SEAT_BY_ID[id]
                      const t = TIERS[s.tier]
                      return (
                        <li key={id} className="gsm-order__seat">
                          <span className="gsm-order__seatid">{labelSeat(id)}</span>
                          <span className={`gsm-order__seattier gsm-order__seattier--${s.tier}`}>{t.name}</span>
                          <span className="gsm-order__seatprice">{fmtMoney(t.price)}</span>
                          <button
                            type="button"
                            className="gsm-order__x"
                            aria-label={`Release ${labelSeat(id)}`}
                            onClick={() => toggle(id)}
                          >
                            ✕
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="gsm-order__empty">
                    No chairs yet. Take them off the plan, walk the list, or let the usher choose below.
                  </p>
                )}

                <div className="gsm-best">
                  <p className="gsm-best__label" id="gsm-party-label">Let the usher choose — party of</p>
                  <div className="gsm-best__row" role="group" aria-labelledby="gsm-party-label">
                    {PARTY_SIZES.map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`gsm-best__n${party === n ? ' is-on' : ''}`}
                        aria-pressed={party === n}
                        onClick={() => setParty(n)}
                      >
                        {n}
                      </button>
                    ))}
                    <button type="button" className="gsm-best__go" onClick={bestAvailable}>
                      Best seats →
                    </button>
                  </div>
                  <p className="gsm-best__note">Boxes seat four and book by phone — the usher keeps to the rows.</p>
                </div>

                <dl className="gsm-order__totals">
                  <div>
                    <dt>Chairs ×{sel.length}</dt>
                    <dd>{sel.length ? fmtMoney(subtotal) : '—'}</dd>
                  </div>
                  <div>
                    <dt>Booking fee</dt>
                    <dd>{sel.length ? fmtMoney(BOOKING_FEE) : '—'}</dd>
                  </div>
                  <div className="gsm-order__grand">
                    <dt>Total</dt>
                    <dd>{fmtMoney(total)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  className="gsm-btn gsm-btn--gold gsm-btn--wide"
                  disabled={!sel.length || placing}
                  onClick={checkout}
                >
                  {placing
                    ? 'Ringing the till…'
                    : sel.length
                      ? `Take ${sel.length} chair${sel.length === 1 ? '' : 's'} — ${fmtMoney(total)}`
                      : 'Pick a chair to begin'}
                </button>
                <p className="gsm-fineprint">
                  Concept box office — no card, no charge, and the seats release themselves for the next
                  patron. Shows, chairs and availability are fictional.
                </p>
              </>
            )}
          </div>
        </aside>
      </div>

      <footer className="gsm-foot">
        <p>
          The Glasshouse · King Street, next to the pie cart · est. 1927 · a concept ticketing demo with a
          fictional season and a very real love of a good stalls row.
        </p>
      </footer>
    </div>
  )
}
