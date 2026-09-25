import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import BagArt from './BagArt'
import {
  coffees,
  aud,
  freshness,
  priceFor,
  GRINDS,
  INTERVALS,
  FREE_SHIPPING_AT,
  FLAT_SHIPPING,
  SUB_DISCOUNT,
  type Coffee,
  type Grind,
  type Interval,
} from './data'
import './demo.css'

/**
 * Hearthbrew Storefront — a specialty-coffee shop for the fictional
 * Hearthbrew Coffee. Warm paper, espresso ink, honest shipping thresholds,
 * subscribe-and-skip. Cart persists to localStorage.
 */

type Grams = 250 | 1000

interface CartLine {
  key: string
  coffeeId: string
  grind: Grind
  grams: Grams
  qty: number
  /** 0 = one-time purchase; otherwise delivery interval in weeks */
  sub: Interval | 0
}

interface SubPlan {
  coffeeId: string
  grind: Grind
  grams: Grams
  weeks: Interval
  status: 'active' | 'paused'
  nextISO: string
}

const CART_KEY = 'hbs-cart-v1'
const SUB_KEY = 'hbs-sub-v1'

const coffeeById = new Map(coffees.map((c) => [c.id, c]))

function inDays(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString()
}

function defaultSub(): SubPlan {
  return { coffeeId: 'cinder-house', grind: 'Whole bean', grams: 250, weeks: 4, status: 'active', nextISO: inDays(9) }
}

function readJSON<T>(key: string, fallback: T, valid: (v: unknown) => v is T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    return valid(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function isCart(v: unknown): v is CartLine[] {
  return (
    Array.isArray(v) &&
    v.every(
      (l) =>
        l &&
        typeof l === 'object' &&
        typeof (l as CartLine).key === 'string' &&
        coffeeById.has((l as CartLine).coffeeId) &&
        (l as CartLine).qty >= 1 &&
        (l as CartLine).qty <= 6,
    )
  )
}

function isSubPlan(v: unknown): v is SubPlan {
  const s = v as SubPlan
  return !!s && typeof s === 'object' && coffeeById.has(s.coffeeId) && s.weeks != null && typeof s.nextISO === 'string'
}

function lineKey(coffeeId: string, grind: Grind, grams: Grams, sub: Interval | 0) {
  return `${coffeeId}|${grind}|${grams}|${sub ? `${sub}w` : 'once'}`
}

export function linePrice(l: CartLine): number {
  const c = coffeeById.get(l.coffeeId)!
  const base = priceFor(c, l.grams) * l.qty
  return l.sub ? base * (1 - SUB_DISCOUNT) : base
}

function lineBase(l: CartLine): number {
  return priceFor(coffeeById.get(l.coffeeId)!, l.grams) * l.qty
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })

type BrewFilter = 'all' | 'espresso' | 'filter' | 'decaf'
type RoastFilter = 'any' | 'light' | 'dark'
type SortKey = 'fresh' | 'price' | 'roast'

export default function HearthbrewStore() {
  const [cart, setCart] = useState<CartLine[]>(() => readJSON(CART_KEY, [], isCart))
  const [subPlan, setSubPlan] = useState<SubPlan>(() => readJSON(SUB_KEY, defaultSub(), isSubPlan))
  const [pdp, setPdp] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [checkout, setCheckout] = useState<'cart' | 'summary' | 'done'>('cart')
  const [orderNo, setOrderNo] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [q, setQ] = useState('')
  const [brew, setBrew] = useState<BrewFilter>('all')
  const [roast, setRoast] = useState<RoastFilter>('any')
  const [sort, setSort] = useState<SortKey>('fresh')

  const triggerRef = useRef<HTMLElement | null>(null)
  const cartBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {
      /* private mode — session cart still works */
    }
  }, [cart])

  useEffect(() => {
    try {
      localStorage.setItem(SUB_KEY, JSON.stringify(subPlan))
    } catch {
      /* ignore */
    }
  }, [subPlan])

  const announce = (msg: string) => {
    setNotice('')
    // re-set on next frame so repeated identical messages are read aloud
    requestAnimationFrame(() => setNotice(msg))
  }

  const anyDialog = pdp !== null || cartOpen || subOpen

  useEffect(() => {
    if (!anyDialog) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anyDialog])

  const closeAll = useCallback(() => {
    setPdp(null)
    setCartOpen(false)
    setSubOpen(false)
    setCheckout('cart')
    triggerRef.current?.focus()
  }, [])

  /* ---------- cart ops ---------- */

  const addLine = useCallback((coffeeId: string, grind: Grind, grams: Grams, qty: number, sub: Interval | 0) => {
    const key = lineKey(coffeeId, grind, grams, sub)
    setCart((prev) => {
      const i = prev.findIndex((l) => l.key === key)
      if (i >= 0) {
        const next = prev.slice()
        next[i] = { ...next[i], qty: Math.min(6, next[i].qty + qty) }
        return next
      }
      return [...prev, { key, coffeeId, grind, grams, qty, sub }]
    })
    const c = coffeeById.get(coffeeId)!
    announce(
      sub
        ? `Subscription added: ${c.name}, every ${sub} weeks, ${qty} bag${qty > 1 ? 's' : ''}.`
        : `Added ${qty} × ${c.name} ${grams} grams to cart.`,
    )
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(6, Math.max(1, qty)) } : l)),
    )
  }, [])

  const totals = useMemo(() => {
    const base = cart.reduce((s, l) => s + lineBase(l), 0)
    const subtotal = cart.reduce((s, l) => s + linePrice(l), 0)
    const savings = base - subtotal
    const shipping = cart.length === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : FLAT_SHIPPING
    return { base, subtotal, savings, shipping, total: subtotal + shipping, count: cart.reduce((s, l) => s + l.qty, 0) }
  }, [cart])

  /* ---------- catalogue ops ---------- */

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const matchesBrew = (c: Coffee) =>
      brew === 'all' ||
      (brew === 'decaf' && c.brew === 'decaf') ||
      (brew === 'espresso' && (c.brew === 'espresso' || c.brew === 'both')) ||
      (brew === 'filter' && (c.brew === 'filter' || c.brew === 'both'))
    const matchesRoast = (c: Coffee) =>
      roast === 'any' || (roast === 'light' && c.roast <= 3) || (roast === 'dark' && c.roast >= 4)
    const list = coffees.filter(
      (c) =>
        matchesBrew(c) &&
        matchesRoast(c) &&
        (!needle ||
          `${c.name} ${c.origin} ${c.notes.join(' ')} ${c.process}`.toLowerCase().includes(needle)),
    )
    const sorted = list.slice()
    if (sort === 'fresh') sorted.sort((a, b) => a.roastedDaysAgo - b.roastedDaysAgo)
    if (sort === 'price') sorted.sort((a, b) => a.price250 - b.price250)
    if (sort === 'roast') sorted.sort((a, b) => b.roast - a.roast)
    return sorted
  }, [q, brew, roast, sort])

  /* ---------- render ---------- */

  const openPdp = (id: string, from: HTMLElement) => {
    triggerRef.current = from
    setPdp(id)
  }

  const openCart = (from: HTMLElement) => {
    triggerRef.current = from
    setCheckout('cart')
    setCartOpen(true)
  }

  const placeOrder = () => {
    setOrderNo(`HB-${1000 + Math.floor(Math.random() * 9000)}`)
    setCart([])
    setCheckout('done')
    announce('Order placed. You will hear from us — briefly, and only when it matters.')
  }

  const tickerItems = coffees.map((c) => `${c.name} · ${freshness(c.roastedDaysAgo).toLowerCase()}`)

  return (
    <div className="hbs">
      <a className="hbs-skip" href="#hbs-coffees">
        Skip to the coffees
      </a>

      <header className="hbs-head">
        <a className="hbs-word" href="#hbs-top" aria-label="Hearthbrew Coffee home">
          Hearthbrew<span aria-hidden="true"> ✳ </span>
        </a>
        <nav className="hbs-nav" aria-label="Sections">
          <a href="#hbs-coffees">Coffees</a>
          <a href="#hbs-how">Subscriptions</a>
          <a href="#hbs-promise">The promise</a>
        </nav>
        <div className="hbs-head__actions">
          <button
            type="button"
            className="hbs-ghostbtn"
            onClick={(e) => {
              triggerRef.current = e.currentTarget
              setSubOpen(true)
            }}
          >
            Your box
          </button>
          <button
            type="button"
            ref={cartBtnRef}
            className="hbs-cartbtn"
            onClick={(e) => openCart(e.currentTarget)}
            aria-label={`Open cart, ${totals.count} items, ${aud(totals.subtotal)}`}
          >
            Cart · {totals.count}
            {totals.count > 0 && <span className="hbs-cartbtn__sum">{aud(totals.subtotal)}</span>}
          </button>
        </div>
      </header>

      <main id="hbs-top">
        <section className="hbs-hero">
          <p className="hbs-eyebrow">Specialty roasters · Brunswick, Melbourne · est. 2014</p>
          <h1 className="hbs-h1">
            Roasted Sundays. <em>At yours</em> Wednesdays.
          </h1>
          <p className="hbs-lede">
            Nine coffees, one roastery, zero warehouse shelves. Every bag ships within a week of the
            drum — and the roast date is on the label, not in the fine print.
          </p>
          <div className="hbs-hero__cta">
            <a className="hbs-btn" href="#hbs-coffees">
              Shop this week’s roast
            </a>
            <button
              type="button"
              className="hbs-btn hbs-btn--bare"
              onClick={(e) => {
                triggerRef.current = e.currentTarget
                setSubOpen(true)
              }}
            >
              Manage your subscription
            </button>
          </div>
          <div className="hbs-ticker" aria-hidden="true">
            <div className="hbs-ticker__row">
              {[0, 1].map((half) => (
                <span key={half}>
                  {tickerItems.map((t, i) => (
                    <span key={i}>
                      {t} <b>✳</b>{' '}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="hbs-shelf" id="hbs-coffees" aria-label="Coffee catalogue">
          <div className="hbs-shelf__bar">
            <div className="hbs-filters" role="group" aria-label="Filter by brew">
              {(['all', 'espresso', 'filter', 'decaf'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  className="hbs-chip"
                  aria-pressed={brew === b}
                  onClick={() => setBrew(b)}
                >
                  {b === 'all' ? 'Everything' : b}
                </button>
              ))}
            </div>
            <div className="hbs-filters" role="group" aria-label="Filter by roast">
              {(
                [
                  ['any', 'Any roast'],
                  ['light', 'Light–medium'],
                  ['dark', 'Dark'],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  className="hbs-chip"
                  aria-pressed={roast === v}
                  onClick={() => setRoast(v)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="hbs-search">
              <span className="hbs-visually-hidden">Search the shelf</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search origin, note, process…"
              />
            </label>
            <label className="hbs-sort">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                <option value="fresh">Freshest first</option>
                <option value="price">Price, low to high</option>
                <option value="roast">Darkest first</option>
              </select>
            </label>
          </div>

          <p className="hbs-count" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'coffee' : 'coffees'} — all roasted{' '}
            {sort === 'fresh' ? 'within the last 7 days' : 'within a week of shipping'}
          </p>

          {filtered.length === 0 ? (
            <div className="hbs-empty">
              <p>
                <strong>Nothing on the shelf matches that.</strong>
              </p>
              <p>Try clearing a filter — we roast narrow, not deep.</p>
              <button
                type="button"
                className="hbs-btn hbs-btn--bare"
                onClick={() => {
                  setQ('')
                  setBrew('all')
                  setRoast('any')
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="hbs-grid">
              {filtered.map((c) => (
                <li key={c.id} className="hbs-card">
                  <div className="hbs-card__art">
                    <BagArt coffee={c} />
                    <span className="hbs-fresh">{freshness(c.roastedDaysAgo)}</span>
                  </div>
                  <div className="hbs-card__body">
                    <h3>{c.name}</h3>
                    <p className="hbs-origin">{c.origin}</p>
                    <ul className="hbs-notes" aria-label="Tasting notes">
                      {c.notes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                    <div className="hbs-card__foot">
                      <span
                        className="hbs-roast"
                        role="img"
                        aria-label={`Roast level ${c.roast} of 5`}
                        title={`Roast ${c.roast}/5`}
                      >
                        {Array.from({ length: 5 }, (_, i) => (
                          <i key={i} className={i < c.roast ? 'on' : ''} />
                        ))}
                      </span>
                      <button
                        type="button"
                        className="hbs-card__cta"
                        onClick={(e) => openPdp(c.id, e.currentTarget)}
                      >
                        From {aud(c.price250)} →
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="hbs-how" id="hbs-how">
          <p className="hbs-eyebrow">The club</p>
          <h2 className="hbs-h2">A subscription that assumes you have a life.</h2>
          <div className="hbs-steps">
            {[
              ['Pick an interval', 'Every 2, 4 or 6 weeks. Change it any time — the discount doesn’t care.'],
              ['Skip when you’re ahead', 'Beans piling up? Skip the next box in one tap. We don’t make you call a person with a clipboard.'],
              ['Pause, no guilt', 'Going away? Pause for a season and come back to the same coffee, same price, same seat at the table.'],
            ].map(([t, d], i) => (
              <article key={t} className="hbs-step">
                <span className="hbs-step__no" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
          <p className="hbs-how__facts">
            15% off every box · Free shipping over {aud(FREE_SHIPPING_AT)} · No lock-ins, ever
          </p>
        </section>

        <section className="hbs-promise" id="hbs-promise">
          <h2 className="hbs-h2">
            <em>The promise:</em> if it’s more than a week off roast, we tell you before you buy.
          </h2>
          <p>
            Coffee is produce, not pantry stock. Our bag labels carry the actual roast date, our
            shipping threshold is honest arithmetic, and our subscription emails say “skip” as loudly
            as they say “buy”. Roasted to order in Brunswick. Posted Monday and Thursday, Australia-wide.
          </p>
        </section>
      </main>

      <footer className="hbs-foot">
        <p>
          <strong>Hearthbrew Coffee</strong> — a fictional roastery. Demo storefront by Brassfern;
          beans remain, regrettably, undelivered.
        </p>
        <p className="hbs-foot__mono">Roastery · 14 Foundry Lane, Brunswick VIC · Sun–Wed</p>
      </footer>

      {/* ---------- PDP sheet ---------- */}
      {pdp !== null && coffeeById.get(pdp) && (
        <PdpSheet
          coffee={coffeeById.get(pdp)!}
          onClose={closeAll}
          onAdd={(line) => {
            addLine(pdp, line.grind, line.grams, line.qty, line.sub)
            setPdp(null)
            triggerRef.current = cartBtnRef.current
            setCartOpen(true)
          }}
        />
      )}

      {/* ---------- Cart drawer ---------- */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          totals={totals}
          checkout={checkout}
          orderNo={orderNo}
          onClose={closeAll}
          onQty={setQty}
          onCheckout={() => setCheckout('summary')}
          backToCart={() => setCheckout('cart')}
          onPlaceOrder={placeOrder}
        />
      )}

      {/* ---------- Subscription panel ---------- */}
      {subOpen && <SubPanel plan={subPlan} onChange={setSubPlan} onClose={closeAll} announce={announce} />}

      <p className="hbs-visually-hidden" role="status" aria-live="polite">
        {notice}
      </p>
    </div>
  )
}

/* ================= PDP ================= */

function PdpSheet({
  coffee,
  onClose,
  onAdd,
}: {
  coffee: Coffee
  onClose: () => void
  onAdd: (line: Omit<CartLine, 'key' | 'coffeeId'>) => void
}) {
  const [grams, setGrams] = useState<Grams>(250)
  const [grind, setGrind] = useState<Grind>('Whole bean')
  const [kind, setKind] = useState<'once' | 'sub'>('once')
  const [weeks, setWeeks] = useState<Interval>(4)
  const [qty, setQty] = useState(1)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const base = priceFor(coffee, grams) * qty
  const total = kind === 'sub' ? base * (1 - SUB_DISCOUNT) : base

  return (
    <div className="hbs-overlay" onClick={onClose}>
      <div
        className="hbs-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hbs-pdp-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" ref={closeRef} className="hbs-close" onClick={onClose} aria-label="Close product view">
          ✕
        </button>
        <div className="hbs-sheet__art">
          <BagArt coffee={coffee} large />
          <p className="hbs-fresh hbs-fresh--big">{freshness(coffee.roastedDaysAgo)}</p>
        </div>
        <div className="hbs-sheet__main">
          <p className="hbs-eyebrow">{coffee.origin}</p>
          <h2 className="hbs-sheet__title" id="hbs-pdp-title">
            {coffee.name}
          </h2>
          <p className="hbs-sheet__blurb">{coffee.blurb}</p>

          <dl className="hbs-specs">
            <div>
              <dt>Altitude</dt>
              <dd>{coffee.altitude}</dd>
            </div>
            <div>
              <dt>Process</dt>
              <dd>{coffee.process}</dd>
            </div>
            <div>
              <dt>Roast</dt>
              <dd>{coffee.roast} / 5</dd>
            </div>
          </dl>

          <ul className="hbs-notes hbs-notes--pdp" aria-label="Tasting notes">
            {coffee.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>

          <fieldset className="hbs-field">
            <legend>Size</legend>
            <div className="hbs-choice-row">
              {([250, 1000] as const).map((g) => (
                <label key={g} className="hbs-choice" data-on={grams === g || undefined}>
                  <input
                    type="radio"
                    name="hbs-grams"
                    checked={grams === g}
                    onChange={() => setGrams(g)}
                  />
                  <span>{g === 250 ? '250 g' : '1 kg'}</span>
                  <em>{aud(priceFor(coffee, g))}</em>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="hbs-field">
            <legend>Grind</legend>
            <div className="hbs-choice-row hbs-choice-row--wrap">
              {GRINDS.map((g) => (
                <label key={g} className="hbs-choice" data-on={grind === g || undefined}>
                  <input type="radio" name="hbs-grind" checked={grind === g} onChange={() => setGrind(g)} />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="hbs-field">
            <legend>Purchase</legend>
            <div className="hbs-choice-row">
              <label className="hbs-choice" data-on={kind === 'once' || undefined}>
                <input type="radio" name="hbs-kind" checked={kind === 'once'} onChange={() => setKind('once')} />
                <span>One-time</span>
              </label>
              <label className="hbs-choice" data-on={kind === 'sub' || undefined}>
                <input type="radio" name="hbs-kind" checked={kind === 'sub'} onChange={() => setKind('sub')} />
                <span>Subscribe</span>
                <em>−15%</em>
              </label>
            </div>
            {kind === 'sub' && (
              <div className="hbs-interval">
                <p id="hbs-interval-label">Deliver every</p>
                <div className="hbs-choice-row" role="group" aria-labelledby="hbs-interval-label">
                  {INTERVALS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      className="hbs-choice hbs-choice--btn"
                      data-on={weeks === w || undefined}
                      onClick={() => setWeeks(w)}
                    >
                      {w} weeks
                    </button>
                  ))}
                </div>
                <p className="hbs-interval__hint">Skip or pause anytime from “Your box”. No lock-ins.</p>
              </div>
            )}
          </fieldset>

          <div className="hbs-sheet__buy">
            <div className="hbs-stepper" aria-label="Quantity">
              <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((n) => Math.min(6, n + 1))} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button
              type="button"
              className="hbs-add"
              onClick={() => onAdd({ grind, grams, qty, sub: kind === 'sub' ? weeks : 0 })}
            >
              Add to cart — {aud(total)}
              {kind === 'sub' && <small>then {aud(total)} every {weeks} weeks</small>}
            </button>
          </div>
          {kind === 'sub' && (
            <p className="hbs-saveline">You save {aud(base - total)} per delivery with the club.</p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================= Cart drawer ================= */

function CartDrawer({
  cart,
  totals,
  checkout,
  orderNo,
  onClose,
  onQty,
  onCheckout,
  backToCart,
  onPlaceOrder,
}: {
  cart: CartLine[]
  totals: { base: number; subtotal: number; savings: number; shipping: number; total: number; count: number }
  checkout: 'cart' | 'summary' | 'done'
  orderNo: string | null
  onClose: () => void
  onQty: (key: string, qty: number) => void
  onCheckout: () => void
  backToCart: () => void
  onPlaceOrder: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const remaining = Math.max(0, FREE_SHIPPING_AT - totals.subtotal)

  return (
    <div className="hbs-overlay hbs-overlay--right" onClick={onClose}>
      <aside
        className="hbs-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="hbs-drawer__head">
          <h2>
            {checkout === 'done' ? 'Sorted.' : checkout === 'summary' ? 'Checkout' : `Your cart · ${totals.count}`}
          </h2>
          <button type="button" ref={closeRef} className="hbs-close" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </header>

        {checkout === 'done' ? (
          <div className="hbs-done">
            <p className="hbs-done__tick" aria-hidden="true">
              ✓
            </p>
            <p>
              <strong>Order {orderNo}</strong> is on the bench cards.
            </p>
            <p>
              It roasts this Sunday, ships Monday morning, and should reach your door by Wednesday.
              We email twice: when it ships, and never again.
            </p>
            <button type="button" className="hbs-btn" onClick={onClose}>
              Back to the shelf
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="hbs-empty hbs-empty--cart">
            <p>
              <strong>The cart’s empty.</strong> The drum isn’t.
            </p>
            <p>Nine coffees, freshest first — go meet one.</p>
            <button type="button" className="hbs-btn hbs-btn--bare" onClick={onClose}>
              Browse coffees
            </button>
          </div>
        ) : (
          <>
            {checkout === 'cart' && (
              <>
                <div className="hbs-ship">
                  {remaining > 0 ? (
                    <p>
                      Add <strong>{aud(remaining)}</strong> more and shipping is on us.
                    </p>
                  ) : (
                    <p>
                      <strong>Free shipping unlocked.</strong> Nicely done.
                    </p>
                  )}
                  <div
                    className="hbs-ship__bar"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={FREE_SHIPPING_AT}
                    aria-valuenow={Math.min(totals.subtotal, FREE_SHIPPING_AT)}
                    aria-label="Progress toward free shipping"
                  >
                    <i style={{ '--p': `${Math.min(100, (totals.subtotal / FREE_SHIPPING_AT) * 100)}%` } as CSSProperties} />
                  </div>
                </div>
                <ul className="hbs-lines">
                  {cart.map((l) => {
                    const c = coffeeById.get(l.coffeeId)!
                    return (
                      <li key={l.key} className="hbs-line">
                        <div className="hbs-line__art" aria-hidden="true">
                          <BagArt coffee={c} />
                        </div>
                        <div className="hbs-line__main">
                          <p className="hbs-line__name">
                            {c.name} {l.sub > 0 && <span className="hbs-subbadge">club</span>}
                          </p>
                          <p className="hbs-line__meta">
                            {l.grams === 250 ? '250 g' : '1 kg'} · {l.grind}
                            {l.sub > 0 && ` · every ${l.sub} wks`}
                          </p>
                          <div className="hbs-line__row">
                            <div className="hbs-stepper hbs-stepper--sm">
                              <button type="button" onClick={() => onQty(l.key, l.qty - 1)} aria-label={`Decrease quantity of ${c.name}`}>
                                −
                              </button>
                              <span>{l.qty}</span>
                              <button type="button" onClick={() => onQty(l.key, l.qty + 1)} aria-label={`Increase quantity of ${c.name}`}>
                                +
                              </button>
                            </div>
                            <p className="hbs-line__price">
                              {aud(linePrice(l))}
                              {l.sub > 0 && <s>{aud(lineBase(l))}</s>}
                            </p>
                          </div>
                        </div>
                        <button type="button" className="hbs-line__rm" onClick={() => onQty(l.key, 0)} aria-label={`Remove ${c.name} from cart`}>
                          ✕
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <footer className="hbs-drawer__foot">
                  <div className="hbs-sumrow">
                    <span>Subtotal</span>
                    <strong>{aud(totals.subtotal)}</strong>
                  </div>
                  {totals.savings > 0.005 && (
                    <div className="hbs-sumrow hbs-sumrow--save">
                      <span>Club savings</span>
                      <strong>−{aud(totals.savings)}</strong>
                    </div>
                  )}
                  <div className="hbs-sumrow">
                    <span>Shipping</span>
                    <strong>{totals.shipping === 0 ? 'Free' : aud(totals.shipping)}</strong>
                  </div>
                  <button type="button" className="hbs-btn hbs-btn--full" onClick={onCheckout}>
                    Checkout — {aud(totals.total)}
                  </button>
                  <p className="hbs-fineprint">Ships Monday &amp; Thursday from Brunswick. Roast date on every label.</p>
                </footer>
              </>
            )}

            {checkout === 'summary' && (
              <div className="hbs-summary">
                <button type="button" className="hbs-backlink" onClick={backToCart}>
                  ← Back to cart
                </button>
                <dl>
                  <div>
                    <dt>Items ({totals.count})</dt>
                    <dd>{aud(totals.subtotal)}</dd>
                  </div>
                  {totals.savings > 0.005 && (
                    <div>
                      <dt>Club savings included</dt>
                      <dd>−{aud(totals.savings)}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Shipping</dt>
                    <dd>{totals.shipping === 0 ? 'Free' : aud(totals.shipping)}</dd>
                  </div>
                  <div className="hbs-total">
                    <dt>Total today</dt>
                    <dd>{aud(totals.total)}</dd>
                  </div>
                </dl>
                <div className="hbs-address">
                  <p className="hbs-eyebrow">Delivering to (demo)</p>
                  <p>14 Wattle Lane, Fitzroy VIC 3065</p>
                  <p className="hbs-fineprint">Subscriptions use this address per delivery — change it from “Your box”.</p>
                </div>
                <button type="button" className="hbs-btn hbs-btn--full" onClick={onPlaceOrder}>
                  Place order — {aud(totals.total)}
                </button>
                <p className="hbs-fineprint">A mock checkout. No card, no charge, no beans. We’re honest about that too.</p>
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  )
}

/* ================= Subscription panel ================= */

function SubPanel({
  plan,
  onChange,
  onClose,
  announce,
}: {
  plan: SubPlan
  onChange: (p: SubPlan) => void
  onClose: () => void
  announce: (m: string) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const coffee = coffeeById.get(plan.coffeeId)!
  const paused = plan.status === 'paused'

  const skip = () => {
    const next = new Date(new Date(plan.nextISO).getTime() + plan.weeks * 7 * 86400000).toISOString()
    onChange({ ...plan, nextISO: next })
    announce(`Skipped. Next delivery moved to ${fmtDate(next)}.`)
  }

  const perDelivery = priceFor(coffee, plan.grams) * (1 - SUB_DISCOUNT)

  return (
    <div className="hbs-overlay hbs-overlay--right" onClick={onClose}>
      <aside
        className="hbs-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Your subscription"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="hbs-drawer__head">
          <h2>Your box</h2>
          <button type="button" ref={closeRef} className="hbs-close" onClick={onClose} aria-label="Close subscription panel">
            ✕
          </button>
        </header>

        <div className="hbs-subcard" data-paused={paused || undefined}>
          <div className="hbs-line">
            <div className="hbs-line__art" aria-hidden="true">
              <BagArt coffee={coffee} />
            </div>
            <div className="hbs-line__main">
              <p className="hbs-line__name">
                {coffee.name}{' '}
                <span className={`hbs-status hbs-status--${plan.status}`}>{paused ? 'Paused' : 'Active'}</span>
              </p>
              <p className="hbs-line__meta">
                {plan.grams === 250 ? '250 g' : '1 kg'} · {plan.grind} · {aud(perDelivery)} / delivery
              </p>
            </div>
          </div>

          <dl className="hbs-subfacts">
            <div>
              <dt>Every</dt>
              <dd>{plan.weeks} weeks</dd>
            </div>
            <div>
              <dt>{paused ? 'Paused until resumed' : 'Next delivery'}</dt>
              <dd>{paused ? '—' : fmtDate(plan.nextISO)}</dd>
            </div>
            <div>
              <dt>Skips used this year</dt>
              <dd>2 · fine by us</dd>
            </div>
          </dl>

          <div className="hbs-field">
            <p id="hbs-sub-int">Change the interval</p>
            <div className="hbs-choice-row" role="group" aria-labelledby="hbs-sub-int">
              {INTERVALS.map((w) => (
                <button
                  key={w}
                  type="button"
                  className="hbs-choice hbs-choice--btn"
                  data-on={plan.weeks === w || undefined}
                  onClick={() => {
                    onChange({ ...plan, weeks: w })
                    announce(`Deliveries set to every ${w} weeks.`)
                  }}
                >
                  {w} weeks
                </button>
              ))}
            </div>
          </div>

          <div className="hbs-subcard__actions">
            <button type="button" className="hbs-btn hbs-btn--bare" onClick={skip} disabled={paused}>
              Skip next delivery
            </button>
            <button
              type="button"
              className="hbs-btn hbs-btn--bare"
              onClick={() => {
                onChange({ ...plan, status: paused ? 'active' : 'paused' })
                announce(paused ? 'Subscription resumed.' : 'Subscription paused. See you next season.')
              }}
            >
              {paused ? 'Resume deliveries' : 'Pause for a season'}
            </button>
          </div>
          <p className="hbs-fineprint">
            Skip twice in a row and we’ll email once — a check-in, not a pitch. Cancel any time; the
            door stays open.
          </p>
        </div>
      </aside>
    </div>
  )
}
