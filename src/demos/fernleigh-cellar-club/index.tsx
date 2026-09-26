import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Bottle from './Bottle'
import {
  wines,
  wineById,
  tiers,
  tierById,
  CLUB_REFERENCE_PRICE,
  seedCellar,
  aud,
  addWeeks,
  fmtDate,
  fmtShort,
  inWeeks,
  drinkStatus,
  FREE_FREIGHT_AT,
  FLAT_FREIGHT,
  type Wine,
  type WineKind,
  type Tier,
  type CellarBottle,
} from './data'
import './demo.css'

/**
 * Fernleigh Cellar — a direct-to-consumer cellar door for the fictional
 * Adelaide Hills winery. Shoppable PDPs, a three-tier wine club with
 * per-shipment sliders, skip-a-shipment management with a cadence calendar,
 * a drink-by cellar tracker and a mock checkout. Everything persists to
 * localStorage. Fog grey, vine green, wax-seal red. No photographs — every
 * bottle is drawn in SVG.
 */

interface CartLine {
  key: string
  wineId: string
  vintage: number
  qty: number
}

interface ClubPlan {
  tierId: string
  bottles: number
  cadence: number
  status: 'active' | 'paused'
  nextISO: string
  shipped: number
}

const CART_KEY = 'fcc-cart-v1'
const CLUB_KEY = 'fcc-club-v1'
const CELLAR_KEY = 'fcc-cellar-v1'

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

const isCart = (v: unknown): v is CartLine[] =>
  Array.isArray(v) &&
  v.every((l) => l && typeof l === 'object' && typeof (l as CartLine).key === 'string' && wineById.has((l as CartLine).wineId) && (l as CartLine).qty >= 1 && (l as CartLine).qty <= 24)

const isClub = (v: unknown): v is ClubPlan => {
  const p = v as ClubPlan
  return !!p && typeof p === 'object' && tierById.has(p.tierId) && typeof p.bottles === 'number' && typeof p.cadence === 'number' && typeof p.nextISO === 'string'
}

const isCellar = (v: unknown): v is CellarBottle[] =>
  Array.isArray(v) && v.every((b) => b && typeof b === 'object' && wineById.has((b as CellarBottle).wineId) && (b as CellarBottle).qty >= 0)

const lineKey = (wineId: string, vintage: number) => `${wineId}|${vintage}`

function shipmentCost(plan: ClubPlan): number {
  const tier = tierById.get(plan.tierId)!
  return plan.bottles * CLUB_REFERENCE_PRICE * (1 - tier.discount)
}

/** Price a single bottle would cost under a tier (for PDP comparison). */
function clubPrice(wine: Wine, tier: Tier): number {
  return wine.price * (1 - tier.discount)
}

const ORDER_PAD = () => `FRN-${Math.floor(10000 + Math.random() * 89999)}`

export default function FernleighCellar() {
  const [cart, setCart] = useState<CartLine[]>(() => readJSON(CART_KEY, [], isCart))
  const [club, setClub] = useState<ClubPlan | null>(() => readJSON(CLUB_KEY, null, (v): v is ClubPlan | null => v === null || isClub(v)))
  const [cellar, setCellar] = useState<CellarBottle[]>(() => readJSON(CELLAR_KEY, seedCellar, isCellar))
  const [pdpId, setPdpId] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [shipOpen, setShipOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | WineKind>('all')
  const [toast, setToast] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
      localStorage.setItem(CELLAR_KEY, JSON.stringify(cellar))
      if (club) localStorage.setItem(CLUB_KEY, JSON.stringify(club))
      else localStorage.removeItem(CLUB_KEY)
    } catch {
      /* storage full or blocked — the demo still works in-memory */
    }
  }, [cart, club, cellar])

  const announce = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast((t) => (t === msg ? '' : t)), 3600)
  }, [])

  const cartCount = cart.reduce((n, l) => n + l.qty, 0)
  const cartSubtotal = cart.reduce((n, l) => n + wineById.get(l.wineId)!.price * l.qty, 0)
  const freight = cartSubtotal === 0 ? 0 : cartSubtotal >= FREE_FREIGHT_AT ? 0 : FLAT_FREIGHT
  const activeTier = club ? tierById.get(club.tierId)! : null

  const addToCart = useCallback(
    (wineId: string, vintage: number, qty: number) => {
      setCart((prev) => {
        const key = lineKey(wineId, vintage)
        const found = prev.find((l) => l.key === key)
        if (found) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(24, l.qty + qty) } : l))
        return [...prev, { key, wineId, vintage, qty }]
      })
      const w = wineById.get(wineId)!
      announce(`${qty} × ${w.name} ${vintage} added to cart`)
    },
    [announce],
  )

  const shownWines = filter === 'all' ? wines : wines.filter((w) => w.kind === filter)

  return (
    <div className="fcc" id="top">
      <a className="fcc-skip" href="#fcc-wines">
        Skip to the wines
      </a>

      <header className="fcc-head">
        <a className="fcc-head__mark" href="#top" aria-label="Fernleigh Wines — back to top">
          <span className="fcc-head__fern" aria-hidden>
            ✦
          </span>
          Fernleigh
        </a>
        <nav className="fcc-nav" aria-label="Cellar door">
          <a href="#fcc-wines">Wines</a>
          <a href="#fcc-club">The club</a>
          <a href="#fcc-cellar">My cellar</a>
        </nav>
        <div className="fcc-head__actions">
          {club && (
            <button className="fcc-btn fcc-btn--line" onClick={() => setShipOpen(true)}>
              <span className="fcc-dot" aria-hidden /> Shipments
            </button>
          )}
          <button className="fcc-btn fcc-btn--red" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} bottles`}>
            Cart
            {cartCount > 0 && <span className="fcc-pill">{cartCount}</span>}
          </button>
        </div>
      </header>

      <main>
        {/* ---------- hero ---------- */}
        <section className="fcc-hero" aria-labelledby="fcc-hero-h">
          <div className="fcc-hero__hills" aria-hidden>
            <svg viewBox="0 0 1440 340" preserveAspectRatio="none">
              <path d="M0 220 C 240 140 420 260 720 200 C 1020 140 1200 260 1440 190 L1440 340 L0 340 Z" fill="#b9c2ae" opacity="0.55" />
              <path d="M0 260 C 260 200 520 300 780 250 C 1040 200 1250 290 1440 240 L1440 340 L0 340 Z" fill="#77896b" opacity="0.6" />
              <path d="M0 300 C 300 260 620 330 900 290 C 1140 256 1300 316 1440 290 L1440 340 L0 340 Z" fill="#3c5a3a" opacity="0.75" />
            </svg>
          </div>
          <p className="fcc-eyebrow">Adelaide Hills · Est. 1998 · Cool climate</p>
          <h1 id="fcc-hero-h">
            Wine made in the fog,
            <br />
            <em>delivered to your door.</em>
          </h1>
          <p className="fcc-hero__lead">
            Pinot noir from the stony rise, nebbiolo from the top block, and a pétillant the cellar door can't keep in
            stock. Join the club and never do arithmetic at a bottle shop again.
          </p>
          <div className="fcc-hero__cta">
            <a className="fcc-btn fcc-btn--red fcc-btn--big" href="#fcc-wines">
              Browse the wines
            </a>
            <a className="fcc-btn fcc-btn--ghost fcc-btn--big" href="#fcc-club">
              How the club works
            </a>
          </div>
          <dl className="fcc-hero__stats">
            <div className="fcc-stat">
              <dt>Bottles shipped to members</dt>
              <dd>31,207</dd>
            </div>
            <div className="fcc-stat">
              <dt>Club members</dt>
              <dd>1,842</dd>
            </div>
            <div className="fcc-stat">
              <dt>Average member rating</dt>
              <dd>4.9 / 5</dd>
            </div>
          </dl>
        </section>

        {/* ---------- wines ---------- */}
        <section className="fcc-section" id="fcc-wines" aria-labelledby="fcc-wines-h">
          <div className="fcc-sechead">
            <div>
              <p className="fcc-eyebrow">The range</p>
              <h2 id="fcc-wines-h">Six wines, one hill.</h2>
            </div>
            <div className="fcc-filters" role="group" aria-label="Filter wines by style">
              {(['all', 'red', 'white', 'sparkling'] as const).map((f) => (
                <button key={f} className={`fcc-chip${filter === f ? ' is-on' : ''}`} onClick={() => setFilter(f)} aria-pressed={filter === f}>
                  {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ul className="fcc-grid">
            {shownWines.map((w) => (
              <li key={w.id} className="fcc-wine">
                <button className="fcc-wine__btn" onClick={() => setPdpId(w.id)} aria-haspopup="dialog" aria-label={`View ${w.name} ${w.varietal}`}>
                  <span className="fcc-wine__art">
                    <Bottle wine={w} vintage={w.vintages[0]} />
                  </span>
                  <span className="fcc-wine__meta">
                    <span className="fcc-wine__name">{w.name}</span>
                    <span className="fcc-wine__var">
                      {w.varietal} · {w.vintages[0]}
                    </span>
                    <span className="fcc-wine__price">
                      {aud(w.price)}
                      <span className="fcc-wine__club">Club from {aud(clubPrice(w, tiers[0]))}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- club ---------- */}
        <section className="fcc-section fcc-clubsec" id="fcc-club" aria-labelledby="fcc-club-h">
          <div className="fcc-sechead">
            <div>
              <p className="fcc-eyebrow">The Fernleigh Club</p>
              <h2 id="fcc-club-h">{club ? 'Your membership' : 'Pick a tier. Tune it. Done.'}</h2>
            </div>
          </div>
          {club && activeTier ? (
            <PlanPanel
              plan={club}
              tier={activeTier}
              onOpenShipments={() => setShipOpen(true)}
              onUpdate={(p) => {
                setClub(p)
                announce('Membership updated')
              }}
              onLeave={() => {
                setClub(null)
                announce('Membership cancelled — the door stays open')
              }}
            />
          ) : (
            <ClubJoin
              onJoin={(tierId, bottles, cadence) => {
                setClub({ tierId, bottles, cadence, status: 'active', nextISO: inWeeks(cadence), shipped: 0 })
                announce(`Welcome to the ${tierById.get(tierId)!.name} tier`)
              }}
            />
          )}
        </section>

        {/* ---------- cellar ---------- */}
        <CellarSection cellar={cellar} club={club} />
      </main>

      <footer className="fcc-foot">
        <p>
          <strong>Fernleigh Wines</strong> · 14 Fog Lane, Lenswood SA · a fictional winery, drawn in SVG
        </p>
        <p className="fcc-foot__note">Prices illustrative. Please enjoy imaginary wine responsibly.</p>
      </footer>

      {/* ---------- sheets ---------- */}
      {pdpId && (
        <PdpSheet
          wine={wineById.get(pdpId)!}
          tier={activeTier ?? tiers[0]}
          isMember={!!club}
          onClose={() => setPdpId(null)}
          onAdd={(vintage, qty) => {
            addToCart(pdpId, vintage, qty)
            setPdpId(null)
            setCartOpen(true)
          }}
        />
      )}

      {cartOpen && (
        <CartSheet
          cart={cart}
          setCart={setCart}
          subtotal={cartSubtotal}
          freight={freight}
          memberDiscount={activeTier?.discount ?? 0}
          onClose={() => setCartOpen(false)}
          onComplete={(lines) => {
            setCellar((prev) => mergeIntoCellar(prev, lines))
            setCart([])
            announce('Order placed — bottles added to your cellar')
          }}
        />
      )}

      {shipOpen && club && (
        <ShipmentsSheet
          plan={club}
          tier={activeTier!}
          onClose={() => setShipOpen(false)}
          onSkip={() => {
            setClub({ ...club, nextISO: addWeeks(club.nextISO, club.cadence), shipped: club.shipped + 1 })
            announce('Next shipment skipped — the hill forgives you')
          }}
          onToggle={() => {
            setClub({ ...club, status: club.status === 'active' ? 'paused' : 'active' })
            announce(club.status === 'active' ? 'Membership paused' : 'Welcome back — membership resumed')
          }}
        />
      )}

      <div className="fcc-toast" role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  )
}

function mergeIntoCellar(prev: CellarBottle[], lines: CartLine[]): CellarBottle[] {
  const next = prev.map((b) => ({ ...b }))
  for (const l of lines) {
    const found = next.find((b) => b.wineId === l.wineId && b.vintage === l.vintage)
    if (found) found.qty += l.qty
    else next.push({ wineId: l.wineId, vintage: l.vintage, qty: l.qty })
  }
  return next
}

/* ================= PDP sheet ================= */

function PdpSheet({
  wine,
  tier,
  isMember,
  onClose,
  onAdd,
}: {
  wine: Wine
  tier: Tier
  isMember: boolean
  onClose: () => void
  onAdd: (vintage: number, qty: number) => void
}) {
  const [vintage, setVintage] = useState(wine.vintages[0])
  const [qty, setQty] = useState(1)
  const closeRef = useRef<HTMLButtonElement>(null)
  useSheetA11y(onClose, closeRef)

  const d = drinkStatus(wine)

  return (
    <Sheet onClose={onClose} label={`${wine.name} ${wine.varietal}`}>
      <div className="fcc-pdp">
        <div className="fcc-pdp__art">
          <Bottle wine={wine} vintage={vintage} variant="hero" />
        </div>
        <div className="fcc-pdp__body">
          <button ref={closeRef} className="fcc-sheet__close" onClick={onClose} aria-label="Close wine details">
            ✕
          </button>
          <p className="fcc-eyebrow">
            {wine.region} · {wine.kind}
          </p>
          <h3 className="fcc-pdp__name">
            {wine.name} <span>{wine.varietal}</span>
          </h3>
          <p className="fcc-pdp__tasting">{wine.tasting}</p>
          <p className="fcc-pdp__story">{wine.story}</p>

          <fieldset className="fcc-vints">
            <legend>Vintage</legend>
            {wine.vintages.map((v) => (
              <label key={v} className={`fcc-vint${vintage === v ? ' is-on' : ''}`}>
                <input type="radio" name={`fcc-vintage-${wine.id}`} checked={vintage === v} onChange={() => setVintage(v)} />
                {v}
              </label>
            ))}
          </fieldset>

          <div className="fcc-pdp__window">
            <span className={`fcc-dotlab fcc-dotlab--${d.status}`} aria-hidden />
            {d.label}
          </div>

          <div className="fcc-pdp__buy">
            <div className="fcc-stepper" aria-label="Quantity in bottles">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One fewer bottle" disabled={qty <= 1}>
                −
              </button>
              <output aria-live="polite" aria-label={`${qty} bottles`}>
                {qty}
              </output>
              <button onClick={() => setQty((q) => Math.min(24, q + 1))} aria-label="One more bottle">
                +
              </button>
            </div>
            <div className="fcc-pdp__prices">
              <span className="fcc-pdp__price">{aud(wine.price * qty)}</span>
              <span className="fcc-pdp__clubprice">
                {isMember ? `Your club price ` : `${tier.name} club price `}
                <strong>{aud(clubPrice(wine, tier) * qty)}</strong> (−{Math.round(tier.discount * 100)}%)
              </span>
            </div>
            <button className="fcc-btn fcc-btn--red fcc-btn--big fcc-pdp__add" onClick={() => onAdd(vintage, qty)}>
              Add {qty > 1 ? `${qty} bottles` : 'a bottle'} to cart
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  )
}

/* ================= club join ================= */

function ClubJoin({ onJoin }: { onJoin: (tierId: string, bottles: number, cadence: number) => void }) {
  const [tierId, setTierId] = useState('cellar')
  const tier = tierById.get(tierId)!
  const [bottles, setBottles] = useState(tier.defaultBottles)
  const [cadence, setCadence] = useState(8)

  const pickTier = (id: string) => {
    setTierId(id)
    setBottles(tierById.get(id)!.defaultBottles)
  }

  const perShipment = bottles * CLUB_REFERENCE_PRICE * (1 - tier.discount)
  const listEquivalent = bottles * CLUB_REFERENCE_PRICE

  return (
    <div className="fcc-join">
      <div className="fcc-tiers" role="radiogroup" aria-label="Club tiers">
        {tiers.map((t) => (
          <button
            key={t.id}
            className={`fcc-tier${tierId === t.id ? ' is-on' : ''}`}
            onClick={() => pickTier(t.id)}
            role="radio"
            aria-checked={tierId === t.id}
          >
            <span className="fcc-tier__name">{t.name}</span>
            <span className="fcc-tier__disc">−{Math.round(t.discount * 100)}%</span>
            <span className="fcc-tier__blurb">{t.blurb}</span>
            <ul className="fcc-tier__perks">
              {t.perks.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="fcc-dials" aria-label={`${tier.name} shipment settings`}>
        <div className="fcc-dial">
          <label htmlFor="fcc-dial-bottles">
            Bottles per shipment
            <output htmlFor="fcc-dial-bottles">{bottles}</output>
          </label>
          <input
            id="fcc-dial-bottles"
            type="range"
            min={tier.min}
            max={tier.max}
            step={1}
            value={Math.min(bottles, tier.max)}
            onChange={(e) => setBottles(Number(e.target.value))}
          />
          <p className="fcc-dial__hint">
            {tier.min}–{tier.max} bottles on the {tier.name} tier
          </p>
        </div>
        <div className="fcc-dial">
          <label htmlFor="fcc-dial-cadence">
            Every
            <output htmlFor="fcc-dial-cadence">{cadence} weeks</output>
          </label>
          <input id="fcc-dial-cadence" type="range" min={4} max={16} step={2} value={cadence} onChange={(e) => setCadence(Number(e.target.value))} />
          <p className="fcc-dial__hint">Next shipment lands {fmtDate(inWeeks(cadence))}</p>
        </div>
        <div className="fcc-dial fcc-dial--sum">
          <p className="fcc-dial__sumline">
            <span>Per shipment</span>
            <strong>{aud(perShipment)}</strong>
          </p>
          <p className="fcc-dial__sumline fcc-dial__save">
            <span>Cellar-door price</span>
            <s>{aud(listEquivalent)}</s>
          </p>
          <p className="fcc-dial__sumline">
            <span>Freight</span>
            <strong>{tier.shippingFree ? 'Free' : aud(FLAT_FREIGHT)}</strong>
          </p>
          <button className="fcc-btn fcc-btn--red fcc-btn--big" onClick={() => onJoin(tierId, Math.min(bottles, tier.max), cadence)}>
            Join as {tier.name}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================= active plan ================= */

function PlanPanel({
  plan,
  tier,
  onOpenShipments,
  onUpdate,
  onLeave,
}: {
  plan: ClubPlan
  tier: Tier
  onOpenShipments: () => void
  onUpdate: (p: ClubPlan) => void
  onLeave: () => void
}) {
  return (
    <div className="fcc-plan">
      <div className="fcc-plan__card">
        <p className="fcc-eyebrow">{tier.name} tier · {plan.status === 'active' ? 'active' : 'paused'}</p>
        <p className="fcc-plan__next">
          Next shipment <strong>{plan.status === 'active' ? fmtDate(plan.nextISO) : 'paused'}</strong>
        </p>
        <p className="fcc-plan__meta">
          {plan.bottles} bottles · every {plan.cadence} weeks · est. {aud(shipmentCost(plan))}
          {tier.shippingFree ? ' · free freight' : ''}
        </p>
        <p className="fcc-plan__seal" aria-hidden>
          −{Math.round(tier.discount * 100)}% member pricing
        </p>
        <div className="fcc-plan__actions">
          <button className="fcc-btn fcc-btn--red" onClick={onOpenShipments}>
            Manage shipments
          </button>
          <button
            className="fcc-btn fcc-btn--line"
            onClick={() => onUpdate({ ...plan, status: plan.status === 'active' ? 'paused' : 'active' })}
          >
            {plan.status === 'active' ? 'Pause' : 'Resume'}
          </button>
          <button className="fcc-btn fcc-btn--ghost" onClick={onLeave}>
            Leave the club
          </button>
        </div>
      </div>
      <div className="fcc-plan__dials">
        <div className="fcc-dial">
          <label htmlFor="fcc-plan-bottles">
            Bottles per shipment
            <output htmlFor="fcc-plan-bottles">{plan.bottles}</output>
          </label>
          <input
            id="fcc-plan-bottles"
            type="range"
            min={tier.min}
            max={tier.max}
            step={1}
            value={plan.bottles}
            onChange={(e) => onUpdate({ ...plan, bottles: Math.min(Number(e.target.value), tier.max) })}
          />
        </div>
        <div className="fcc-dial">
          <label htmlFor="fcc-plan-cadence">
            Every
            <output htmlFor="fcc-plan-cadence">{plan.cadence} weeks</output>
          </label>
          <input
            id="fcc-plan-cadence"
            type="range"
            min={4}
            max={16}
            step={2}
            value={plan.cadence}
            onChange={(e) => onUpdate({ ...plan, cadence: Number(e.target.value) })}
          />
          <p className="fcc-dial__hint">Changes apply from the next cycle — no phone calls, no guilt.</p>
        </div>
      </div>
    </div>
  )
}

/* ================= shipments drawer ================= */

function ShipmentsSheet({
  plan,
  tier,
  onClose,
  onSkip,
  onToggle,
}: {
  plan: ClubPlan
  tier: Tier
  onClose: () => void
  onSkip: () => void
  onToggle: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useSheetA11y(onClose, closeRef)

  const upcoming = useMemo(() => {
    const rows: { iso: string; label: string; next: boolean }[] = []
    let cursor = plan.nextISO
    for (let i = 0; i < 5; i++) {
      rows.push({ iso: cursor, label: `${plan.bottles} bottles · est. ${aud(shipmentCost(plan))}`, next: i === 0 })
      cursor = addWeeks(cursor, plan.cadence)
    }
    return rows
  }, [plan])

  return (
    <Sheet side onClose={onClose} label="Shipment manager">
      <div className="fcc-ship">
        <button ref={closeRef} className="fcc-sheet__close" onClick={onClose} aria-label="Close shipment manager">
          ✕
        </button>
        <p className="fcc-eyebrow">{tier.name} tier · {plan.status}</p>
        <h3>Shipment manager</h3>
        <p className="fcc-ship__lead">
          Skip a shipment, pause the season, or let it ride. Cut-off for changes is seven days before dispatch — the
          forklift waiteth for no one.
        </p>

        <div className="fcc-ship__next">
          <div>
            <span className="fcc-ship__datelab">Next dispatch</span>
            <strong>{plan.status === 'active' ? fmtDate(plan.nextISO) : 'Paused'}</strong>
            <span>{plan.bottles} bottles, the winemaker's pick</span>
          </div>
          {plan.status === 'active' && (
            <button className="fcc-btn fcc-btn--line" onClick={onSkip}>
              Skip this one →
            </button>
          )}
        </div>

        <h4 className="fcc-ship__calhead">Your cadence calendar</h4>
        <ol className="fcc-cal">
          {upcoming.map((r, i) => (
            <li key={r.iso} className={`fcc-cal__row${r.next && plan.status === 'active' ? ' is-next' : ''}`}>
              <span className="fcc-cal__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="fcc-cal__date">
                <strong>{fmtShort(r.iso)}</strong>
                <span>{new Date(r.iso).getFullYear()}</span>
              </span>
              <span className="fcc-cal__label">
                {plan.status === 'paused' ? 'Paused' : r.label}
                {r.next && plan.status === 'active' && <em> · next up</em>}
              </span>
            </li>
          ))}
        </ol>

        <div className="fcc-ship__actions">
          <button className="fcc-btn fcc-btn--ghost" onClick={onToggle}>
            {plan.status === 'active' ? 'Pause shipments' : 'Resume shipments'}
          </button>
        </div>
      </div>
    </Sheet>
  )
}

/* ================= cellar ================= */

function CellarSection({ cellar, club }: { cellar: CellarBottle[]; club: ClubPlan | null }) {
  const rows = cellar
    .filter((b) => b.qty > 0)
    .map((b) => ({ ...b, wine: wineById.get(b.wineId)!, d: drinkStatus(wineById.get(b.wineId)!) }))
    .sort((a, b) => a.wine.drinkTo - b.wine.drinkTo)

  const total = cellar.reduce((n, b) => n + b.qty, 0)
  const drinking = rows.filter((r) => r.d.status === 'drink' || r.d.status === 'drink-soon').reduce((n, r) => n + r.qty, 0)
  const holding = total - drinking

  return (
    <section className="fcc-section fcc-cellar" id="fcc-cellar" aria-labelledby="fcc-cellar-h">
      <div className="fcc-sechead">
        <div>
          <p className="fcc-eyebrow">My cellar</p>
          <h2 id="fcc-cellar-h">What to open, and what to wait for.</h2>
        </div>
        <dl className="fcc-cellar__stats">
          <div className="fcc-stat fcc-stat--sm">
            <dt>Bottles down</dt>
            <dd>{total}</dd>
          </div>
          <div className="fcc-stat fcc-stat--sm">
            <dt>Drinking now</dt>
            <dd>{drinking}</dd>
          </div>
          <div className="fcc-stat fcc-stat--sm">
            <dt>Still holding</dt>
            <dd>{holding}</dd>
          </div>
        </dl>
      </div>

      <ul className="fcc-crows">
        {rows.map((r) => (
          <li key={`${r.wineId}-${r.vintage}`} className="fcc-crow">
            <span className="fcc-crow__art">
              <Bottle wine={r.wine} variant="row" />
            </span>
            <span className="fcc-crow__id">
              <strong>
                {r.wine.name} {r.vintage}
              </strong>
              <span className="fcc-crow__var">{r.wine.varietal}</span>
            </span>
            <span className="fcc-crow__win">
              <span className={`fcc-dotlab fcc-dotlab--${r.d.status}`} aria-hidden />
              {r.d.label}
              <span className="fcc-bar" aria-hidden>
                <span className={`fcc-bar__fill fcc-bar__fill--${r.d.status}`} style={{ width: `${Math.round(r.d.pct * 100)}%` }} />
              </span>
            </span>
            <span className="fcc-crow__qty" aria-label={`${r.qty} bottles in cellar`}>
              ×{r.qty}
            </span>
          </li>
        ))}
      </ul>
      {club && (
        <p className="fcc-cellar__note">
          Next club shipment adds {club.bottles} more on {club.status === 'active' ? fmtDate(club.nextISO) : 'resumption'} — slots reserved.
        </p>
      )}
    </section>
  )
}

/* ================= cart & checkout ================= */

function CartSheet({
  cart,
  setCart,
  subtotal,
  freight,
  memberDiscount,
  onClose,
  onComplete,
}: {
  cart: CartLine[]
  setCart: React.Dispatch<React.SetStateAction<CartLine[]>>
  subtotal: number
  freight: number
  memberDiscount: number
  onClose: () => void
  onComplete: (lines: CartLine[]) => void
}) {
  const [step, setStep] = useState<'cart' | 'summary' | 'done'>('cart')
  const [orderNo, setOrderNo] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)
  useSheetA11y(onClose, closeRef)

  const total = subtotal + freight
  const potentialSaving = subtotal * (memberDiscount || tiers[0].discount)

  const adjust = (key: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty >= 1),
    )

  return (
    <Sheet side onClose={onClose} label="Cart and checkout">
      <div className="fcc-cart">
        <button ref={closeRef} className="fcc-sheet__close" onClick={onClose} aria-label="Close cart">
          ✕
        </button>
        {step === 'cart' && (
          <>
            <h3>Your cart {cart.length > 0 && <span className="fcc-cart__n">({cart.reduce((n, l) => n + l.qty, 0)})</span>}</h3>
            {cart.length === 0 ? (
              <div className="fcc-cart__empty">
                <Bottle wine={wines[1]} />
                <p>Nothing in the cart. The hill has opinions about that.</p>
                <a className="fcc-btn fcc-btn--red" href="#fcc-wines" onClick={onClose}>
                  Browse the wines
                </a>
              </div>
            ) : (
              <>
                <ul className="fcc-clines">
                  {cart.map((l) => {
                    const w = wineById.get(l.wineId)!
                    return (
                      <li key={l.key} className="fcc-cline">
                        <span className="fcc-cline__art">
                          <Bottle wine={w} variant="row" />
                        </span>
                        <span className="fcc-cline__id">
                          <strong>{w.name}</strong>
                          <span>
                            {w.varietal} · {l.vintage}
                          </span>
                        </span>
                        <span className="fcc-stepper fcc-stepper--sm" aria-label={`Quantity of ${w.name}`}>
                          <button onClick={() => adjust(l.key, -1)} aria-label={`Remove one ${w.name}`}>
                            −
                          </button>
                          <output aria-live="polite">{l.qty}</output>
                          <button onClick={() => adjust(l.key, 1)} aria-label={`Add one ${w.name}`}>
                            +
                          </button>
                        </span>
                        <span className="fcc-cline__price">{aud(w.price * l.qty)}</span>
                      </li>
                    )
                  })}
                </ul>
                <div className="fcc-cart__sums">
                  <p>
                    <span>Subtotal</span>
                    <strong>{aud(subtotal)}</strong>
                  </p>
                  <p>
                    <span>Freight {freight === 0 && subtotal > 0 && <em>· free over {aud(FREE_FREIGHT_AT)}</em>}</span>
                    <strong>{freight === 0 ? 'Free' : aud(freight)}</strong>
                  </p>
                  {!memberDiscount && potentialSaving > 0 && (
                    <p className="fcc-cart__hint">Club members would save {aud(potentialSaving)} on this order.</p>
                  )}
                  <p className="fcc-cart__total">
                    <span>Total</span>
                    <strong>{aud(total)}</strong>
                  </p>
                </div>
                <button className="fcc-btn fcc-btn--red fcc-btn--big fcc-cart__go" onClick={() => setStep('summary')}>
                  Checkout
                </button>
              </>
            )}
          </>
        )}

        {step === 'summary' && (
          <>
            <h3>Almost there</h3>
            <p className="fcc-cart__lead">A mock checkout — no card, no charge, only vibes and wine.</p>
            <div className="fcc-cart__box">
              <p>
                <span>Deliver to</span>
                <strong>H. Fern — 14 Fog Lane, Lenswood SA 5240</strong>
              </p>
              <p>
                <span>Payment</span>
                <strong>Visa ···· 4242 (imaginary)</strong>
              </p>
              <p>
                <span>Items</span>
                <strong>{cart.reduce((n, l) => n + l.qty, 0)} bottles</strong>
              </p>
              <p className="fcc-cart__total">
                <span>Charged</span>
                <strong>{aud(subtotal + freight)}</strong>
              </p>
            </div>
            <div className="fcc-ship__actions">
              <button className="fcc-btn fcc-btn--ghost" onClick={() => setStep('cart')}>
                ← Back
              </button>
              <button
                className="fcc-btn fcc-btn--red fcc-btn--big"
                onClick={() => {
                  onComplete(cart)
                  setOrderNo(ORDER_PAD())
                  setStep('done')
                }}
              >
                Place order
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div className="fcc-done">
            <span className="fcc-done__seal" aria-hidden>
              F
            </span>
            <h3>On its way down the hill.</h3>
            <p>
              Order <strong>{orderNo}</strong> confirmed. Your bottles have been logged in the cellar below — the
              tracker will tell you when to open them.
            </p>
            <button className="fcc-btn fcc-btn--red fcc-btn--big" onClick={onClose}>
              Back to the cellar door
            </button>
          </div>
        )}
      </div>
    </Sheet>
  )
}

/* ================= sheet plumbing ================= */

function Sheet({
  children,
  onClose,
  label,
  side,
}: {
  children: React.ReactNode
  onClose: () => void
  label: string
  side?: boolean
}) {
  return (
    <div className="fcc-scrim" onClick={onClose}>
      <div
        className={`fcc-sheet${side ? ' fcc-sheet--side' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function useSheetA11y(onClose: () => void, focusRef: React.RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    focusRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, focusRef])
}
