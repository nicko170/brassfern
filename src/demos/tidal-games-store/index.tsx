import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  games,
  gameById,
  GENRES,
  PLATFORMS,
  REGIONS,
  applyCode,
  hashStr,
  money,
  mulberry,
  regionalPrice,
  usdPrice,
  type Genre,
  type Platform,
  type Region,
  type TgGame,
} from './data'
import CoverArt from './CoverArt'
import './demo.css'

/**
 * Tidal Games — a neo-arcade indie storefront. Deep-sea ink, phosphor mint,
 * CRT scanlines. Seeded-canvas cover art, platform/genre/price filters,
 * a wishlist, regional pricing (AUD/NZD/USD), discount codes and a mock
 * checkout that hands out fake game keys. Persisted to localStorage.
 */

const CART_KEY = 'tgs-cart-v1'
const WISH_KEY = 'tgs-wish-v1'
const REGION_KEY = 'tgs-region-v1'
const MAX_USD = Math.ceil(Math.max(...games.map((g) => g.usd)))

function readIds(key: string): string[] {
  try {
    if (typeof localStorage === 'undefined') return []
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const v: unknown = JSON.parse(raw)
    return Array.isArray(v) ? v.filter((id): id is string => typeof id === 'string' && gameById.has(id)) : []
  } catch {
    return []
  }
}

function readRegion(): Region {
  try {
    const code = typeof localStorage !== 'undefined' ? localStorage.getItem(REGION_KEY) : null
    return REGIONS.find((r) => r.code === code) ?? REGIONS[0]
  } catch {
    return REGIONS[0]
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* private mode — session state still works */
  }
}

/** Fake licence key, stable per game + order. */
function makeKey(gameId: string, orderNo: string): string {
  const h = hashStr(`${gameId}:${orderNo}`).toString(16).toUpperCase().padStart(8, '0')
  return `${h.slice(0, 4)}-${h.slice(4, 8)}-${hashStr(orderNo).toString(16).slice(0, 4).toUpperCase()}`
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

export default function TidalGamesStore() {
  const [cart, setCart] = useState<string[]>(() => readIds(CART_KEY))
  const [wish, setWish] = useState<string[]>(() => readIds(WISH_KEY))
  const [region, setRegion] = useState<Region>(readRegion)
  const [detail, setDetail] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [code, setCode] = useState<{ code: string; pct: number } | null>(null)
  const [orderNo, setOrderNo] = useState<string | null>(null)
  const [bought, setBought] = useState<string[]>([])
  const [notice, setNotice] = useState('')

  const [q, setQ] = useState('')
  const [platform, setPlatform] = useState<Platform | 'all'>('all')
  const [genre, setGenre] = useState<Genre | 'all'>('all')
  const [maxUsd, setMaxUsd] = useState(MAX_USD)
  const [onlySale, setOnlySale] = useState(false)
  const [onlyWish, setOnlyWish] = useState(false)
  const [sort, setSort] = useState<SortKey>('featured')

  const triggerRef = useRef<HTMLElement | null>(null)
  const cartBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => write(CART_KEY, JSON.stringify(cart)), [cart])
  useEffect(() => write(WISH_KEY, JSON.stringify(wish)), [wish])
  useEffect(() => write(REGION_KEY, region.code), [region])

  const announce = (msg: string) => {
    setNotice('')
    requestAnimationFrame(() => setNotice(msg))
  }

  const anyDialog = detail !== null || cartOpen
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
    setDetail(null)
    setCartOpen(false)
    triggerRef.current?.focus()
  }, [])

  /* ---------- cart & wishlist ops ---------- */

  const inCart = (id: string) => cart.includes(id)
  const wished = (id: string) => wish.includes(id)

  const addToCart = useCallback((id: string) => {
    setCart((prev) => (prev.includes(id) ? prev : [...prev, id]))
    announce(`${gameById.get(id)!.title} added to your hold.`)
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((x) => x !== id))
    announce(`${gameById.get(id)!.title} removed.`)
    setCode((c) => (c && (c.code === 'BUNDLE3' || c.code === 'ABYSS') ? null : c))
  }, [])

  const toggleWish = useCallback((id: string) => {
    setWish((prev) => {
      const on = prev.includes(id)
      announce(
        on
          ? `${gameById.get(id)!.title} removed from wishlist.`
          : `${gameById.get(id)!.title} wishlisted. The tide will remember.`,
      )
      return on ? prev.filter((x) => x !== id) : [...prev, id]
    })
  }, [])

  const totals = useMemo(() => {
    const lines = cart.map((id) => regionalPrice(gameById.get(id)!, region).now)
    const subtotal = lines.reduce((s, v) => s + v, 0)
    const subtotalUsd = cart.reduce((s, id) => s + usdPrice(gameById.get(id)!), 0)
    const discount = code ? subtotal * code.pct : 0
    return { subtotal, subtotalUsd, discount, total: subtotal - discount, count: cart.length }
  }, [cart, region, code])

  /* ---------- catalogue ---------- */

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    let list = games.filter(
      (g) =>
        (platform === 'all' || g.platforms.includes(platform)) &&
        (genre === 'all' || g.genres.includes(genre)) &&
        g.usd <= maxUsd + 0.001 &&
        (!onlySale || g.sale) &&
        (!onlyWish || wish.includes(g.id)) &&
        (!needle ||
          `${g.title} ${g.dev} ${g.genres.join(' ')} ${g.features.join(' ')}`
            .toLowerCase()
            .includes(needle)),
    )
    const by = {
      featured: () => 0,
      'price-asc': (a: TgGame, b: TgGame) => usdPrice(a) - usdPrice(b),
      'price-desc': (a: TgGame, b: TgGame) => usdPrice(b) - usdPrice(a),
      rating: (a: TgGame, b: TgGame) => b.rating - a.rating,
      newest: (a: TgGame, b: TgGame) => b.year - a.year,
    }[sort]
    if (sort !== 'featured') list = list.slice().sort(by)
    return list
  }, [q, platform, genre, maxUsd, onlySale, onlyWish, sort, wish])

  const clearFilters = () => {
    setQ('')
    setPlatform('all')
    setGenre('all')
    setMaxUsd(MAX_USD)
    setOnlySale(false)
    setOnlyWish(false)
  }

  const openDetail = (id: string, from: HTMLElement) => {
    triggerRef.current = from
    setDetail(id)
  }
  const openCart = (from: HTMLElement) => {
    triggerRef.current = from
    setCartOpen(true)
  }

  const reelItems = games.map(
    (g) => `${g.title.toUpperCase()} ★${g.rating.toFixed(1)} · ${g.platforms[0]}+`,
  )

  return (
    <div className="tgs">
      <a className="tgs-skip" href="#tgs-catalogue">
        Skip to the catalogue
      </a>

      <header className="tgs-head">
        <a className="tgs-word" href="#tgs-top" aria-label="Tidal Games home">
          <span aria-hidden="true">≋</span> TIDAL GAMES
        </a>
        <nav className="tgs-nav" aria-label="Sections">
          <a href="#tgs-catalogue">Catalogue</a>
          <a href="#tgs-why">Why Tidal</a>
        </nav>
        <div className="tgs-head__actions">
          <div className="tgs-region" role="group" aria-label="Region and currency">
            {REGIONS.map((r) => (
              <button
                key={r.code}
                type="button"
                aria-pressed={region.code === r.code}
                onClick={() => {
                  setRegion(r)
                  setCode(null)
                  announce(`Prices now shown in ${r.code}.`)
                }}
              >
                {r.code}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="tgs-iconbtn"
            aria-pressed={onlyWish}
            aria-label={`Wishlist, ${wish.length} saved`}
            onClick={() => setOnlyWish((v) => !v)}
          >
            ♡ <span className="tgs-iconbtn__n">{wish.length}</span>
          </button>
          <button
            type="button"
            ref={cartBtnRef}
            className="tgs-iconbtn tgs-iconbtn--cart"
            aria-label={`Open hold, ${totals.count} games, ${money(totals.subtotal, region)}`}
            onClick={(e) => openCart(e.currentTarget)}
          >
            ▤ Hold · {totals.count}
            {totals.count > 0 && <span className="tgs-iconbtn__sum">{money(totals.subtotal, region)}</span>}
          </button>
        </div>
      </header>

      <main id="tgs-top">
        {/* ---------- hero ---------- */}
        <section className="tgs-hero">
          <Starfield />
          <div className="tgs-hero__in">
            <p className="tgs-eyebrow">Tidal Games — indie publisher · Fremantle → everywhere</p>
            <h1 className="tgs-h1">
              SMALL GAMES.
              <br />
              <em>DEEP WATER.</em>
            </h1>
            <p className="tgs-lede">
              Twelve games from nine stubborn little studios. No launchers, no loot boxes, no
              hundred-hour homework. Press start, get the keys, the games are yours.
            </p>
            <div className="tgs-hero__cta">
              <a className="tgs-btn" href="#tgs-catalogue">
                Browse the catalogue ▾
              </a>
              <button
                type="button"
                className="tgs-btn tgs-btn--ghost"
                onClick={() => {
                  setOnlySale((v) => !v)
                  document.getElementById('tgs-catalogue')?.scrollIntoView({ block: 'start' })
                }}
              >
                {onlySale ? 'Showing the sale shelf ✓' : 'Skip to the sale shelf'}
              </button>
            </div>
            <p className="tgs-hero__stats mono">
              {games.length} games · {PLATFORMS.length} platforms · 0 launchers · 0 DRM
            </p>
          </div>
          <div className="tgs-hero__art" aria-hidden="true">
            {[games[0], games[4], games[10]].map((g, i) => (
              <CoverArt key={g.id} game={g} variant={i} className="tgs-hero__cover" />
            ))}
          </div>
        </section>

        {/* ---------- demo reel ---------- */}
        <div className="tgs-reel" aria-hidden="true">
          <div className="tgs-reel__row">
            {[0, 1].map((half) => (
              <span key={half} className="tgs-reel__half">
                {reelItems.map((t, i) => (
                  <span key={i}>
                    {t} <b>◂▸</b>{' '}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <p className="tgs-visually-hidden">
          Demo reel: {games.map((g) => g.title).join(', ')}.
        </p>

        {/* ---------- catalogue ---------- */}
        <section className="tgs-catalogue" id="tgs-catalogue" aria-label="Game catalogue">
          <div className="tgs-cat__head">
            <h2 className="tgs-h2">The tank</h2>
            <p className="mono muted">Every title DRM-free · {region.code} pricing, no surprises</p>
          </div>

          <div className="tgs-bar">
            <label className="tgs-search">
              <span className="tgs-visually-hidden">Search the tank</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search title, studio, feature…"
              />
            </label>
            <div className="tgs-chips" role="group" aria-label="Filter by platform">
              {(['all', ...PLATFORMS] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className="tgs-chip"
                  aria-pressed={platform === p}
                  onClick={() => setPlatform(p)}
                >
                  {p === 'all' ? 'Any platform' : p}
                </button>
              ))}
            </div>
            <div className="tgs-bar__row">
              <label className="tgs-select">
                <span>Genre</span>
                <select value={genre} onChange={(e) => setGenre(e.target.value as Genre | 'all')}>
                  <option value="all">All genres</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
              <label className="tgs-range">
                <span>
                  Under {money(maxUsd, region)} <small>(US${maxUsd} base)</small>
                </span>
                <input
                  type="range"
                  min={5}
                  max={MAX_USD}
                  step={1}
                  value={maxUsd}
                  onChange={(e) => setMaxUsd(Number(e.target.value))}
                />
              </label>
              <button
                type="button"
                className="tgs-chip"
                aria-pressed={onlySale}
                onClick={() => setOnlySale((v) => !v)}
              >
                On sale
              </button>
              <label className="tgs-select">
                <span>Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="rating">Top rated</option>
                  <option value="newest">Newest</option>
                </select>
              </label>
            </div>
          </div>

          <p className="tgs-count mono" aria-live="polite">
            {filtered.length} / {games.length} games surfaced
            {(q || platform !== 'all' || genre !== 'all' || maxUsd < MAX_USD || onlySale || onlyWish) && (
              <>
                {' '}
                —{' '}
                <button type="button" className="tgs-reset" onClick={clearFilters}>
                  reset the sonar
                </button>
              </>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className="tgs-empty">
              <p>
                <strong>Nothing on the sonar.</strong>
              </p>
              <p>The tank is shallow but well stocked — loosen a filter and surface something.</p>
              <button type="button" className="tgs-btn tgs-btn--ghost" onClick={clearFilters}>
                Reset the sonar
              </button>
            </div>
          ) : (
            <ul className="tgs-grid">
              {filtered.map((g) => {
                const price = regionalPrice(g, region)
                return (
                  <li key={g.id} className="tgs-card">
                    <button
                      type="button"
                      className="tgs-card__art"
                      onClick={(e) => openDetail(g.id, e.currentTarget)}
                      aria-label={`${g.title} — details`}
                    >
                      <CoverArt game={g} />
                      {g.sale && <span className="tgs-badge">−{Math.round(g.sale * 100)}%</span>}
                      <span className="tgs-card__scan" aria-hidden="true" />
                    </button>
                    <div className="tgs-card__body">
                      <div className="tgs-card__title-row">
                        <h3>{g.title}</h3>
                        <button
                          type="button"
                          className="tgs-heart"
                          aria-pressed={wished(g.id)}
                          aria-label={wished(g.id) ? `Remove ${g.title} from wishlist` : `Wishlist ${g.title}`}
                          onClick={() => toggleWish(g.id)}
                        >
                          {wished(g.id) ? '♥' : '♡'}
                        </button>
                      </div>
                      <p className="tgs-card__meta mono">
                        {g.dev} · {g.year}
                      </p>
                      <p className="tgs-card__tags mono">
                        {g.genres.join(' / ')} · {g.platforms.join(' · ')}
                      </p>
                      <div className="tgs-card__foot">
                        <p className="tgs-price">
                          {price.was && <s>{money(price.was, region)}</s>}{' '}
                          <strong>{money(price.now, region)}</strong>
                        </p>
                        <button
                          type="button"
                          className={inCart(g.id) ? 'tgs-add tgs-add--in' : 'tgs-add'}
                          onClick={(e) =>
                            inCart(g.id) ? openCart(e.currentTarget) : addToCart(g.id)
                          }
                        >
                          {inCart(g.id) ? 'In hold ✓' : 'Add to hold'}
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* ---------- why ---------- */}
        <section className="tgs-why" id="tgs-why">
          <p className="tgs-eyebrow">Why buy here</p>
          <h2 className="tgs-h2">
            A store with <em>currents</em>, not dark patterns.
          </h2>
          <div className="tgs-why__cols">
            {[
              ['Keys, not leases', 'Every purchase is a DRM-free key. Your games work offline, forever. No launcher phoning home at 2 a.m.'],
              ['Honest regional pricing', 'AUD, NZD and USD converted at a flat fair rate with proper .99 endings. Switch regions up top — the maths is on the label.'],
              ['A wishlist that waves back', 'Wishlisted games resurface here the day they go on sale — in this demo, instantly, with the “On sale” switch.'],
            ].map(([t, d], i) => (
              <article key={t} className="tgs-why__col">
                <span className="tgs-why__no mono" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
          <p className="tgs-why__codes mono">
            Demo discount codes: TIDAL10 · BUNDLE3 (3+ games) · ABYSS (US$60+ carts)
          </p>
        </section>
      </main>

      <footer className="tgs-foot">
        <p>
          <strong>TIDAL GAMES</strong> — a fictional indie publisher. No games were harmed, shipped
          or redeemed. Storefront demo by Brassfern.
        </p>
        <p className="mono muted">Fremantle, WA · est. 2019 · press START to continue</p>
      </footer>

      {/* ---------- detail sheet ---------- */}
      {detail !== null && gameById.get(detail) && (
        <DetailSheet
          game={gameById.get(detail)!}
          region={region}
          inCart={inCart(detail)}
          wished={wished(detail)}
          onClose={closeAll}
          onAdd={() => addToCart(detail)}
          onWish={() => toggleWish(detail)}
        />
      )}

      {/* ---------- cart drawer ---------- */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          region={region}
          totals={totals}
          code={code}
          orderNo={orderNo}
          bought={bought}
          onClose={closeAll}
          onRemove={removeFromCart}
          onApplyCode={(raw) => {
            const res = applyCode(raw, cart.length, totals.subtotalUsd)
            if (res.ok && res.pct != null && res.code) {
              setCode({ code: res.code, pct: res.pct })
              announce(res.message)
              return { ok: true as const, message: res.message }
            }
            return { ok: false as const, message: res.message }
          }}
          onClearCode={() => setCode(null)}
          onPlaceOrder={(list) => {
            const no = `TG-${1000 + Math.floor(Math.random() * 9000)}`
            setOrderNo(no)
            setBought(list)
            setCart([])
            setCode(null)
            announce(`Order ${no} complete. Your keys are on screen.`)
          }}
        />
      )}

      <p className="tgs-visually-hidden" role="status" aria-live="polite">
        {notice}
      </p>
    </div>
  )
}

/* ================= Hero starfield ================= */

function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    interface Star {
      x: number
      y: number
      r: number
      depth: number
      phase: number
    }
    let stars: Star[] = []

    const seed = mulberry(hashStr('tidal-hero'))
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: Math.floor((w * h) / 9000) }, () => ({
        x: seed() * w,
        y: seed() * h,
        r: 0.5 + seed() * 1.3,
        depth: 0.3 + seed() * 0.7,
        phase: seed() * Math.PI * 2,
      }))
    }

    let mx = 0.5
    let my = 0.5
    let raf = 0
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const tw = reduced ? 0.7 : 0.45 + 0.45 * Math.sin(t / 900 + s.phase)
        const ox = reduced ? 0 : (mx - 0.5) * 26 * s.depth
        const oy = reduced ? 0 : (my - 0.5) * 14 * s.depth
        ctx.fillStyle = s.depth > 0.75 ? `rgba(95,242,184,${tw})` : `rgba(220,243,233,${tw * 0.7})`
        ctx.beginPath()
        ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const hero = canvas.parentElement!
    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect()
      mx = (e.clientX - rect.left) / rect.width
      my = (e.clientY - rect.top) / rect.height
    }
    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw(0)
    })
    ro.observe(hero)
    resize()
    if (reduced) {
      draw(0)
    } else {
      raf = requestAnimationFrame(draw)
      hero.addEventListener('pointermove', onMove)
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      hero.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="tgs-hero__stars" aria-hidden="true" />
}

/* ================= Detail sheet ================= */

function DetailSheet({
  game,
  region,
  inCart,
  wished,
  onClose,
  onAdd,
  onWish,
}: {
  game: TgGame
  region: Region
  inCart: boolean
  wished: boolean
  onClose: () => void
  onAdd: () => void
  onWish: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const price = regionalPrice(game, region)

  return (
    <div className="tgs-overlay" onClick={onClose}>
      <div
        className="tgs-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tgs-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" ref={closeRef} className="tgs-close" onClick={onClose} aria-label="Close game details">
          ✕
        </button>
        <div className="tgs-sheet__art">
          <CoverArt game={game} className="tgs-sheet__cover" />
          <div className="tgs-shots" aria-label="In-game screens (generative)">
            {[1, 2, 3].map((v) => (
              <CoverArt key={v} game={game} variant={v} shot className="tgs-shots__img" />
            ))}
          </div>
          <p className="tgs-shots__note mono muted">key art &amp; screens painted by the engine</p>
        </div>
        <div className="tgs-sheet__main">
          <p className="tgs-eyebrow">
            {game.dev} · {game.year}
          </p>
          <h2 className="tgs-sheet__title" id="tgs-detail-title">
            {game.title}
            {game.sale && <span className="tgs-badge tgs-badge--inline">−{Math.round(game.sale * 100)}%</span>}
          </h2>
          <p className="tgs-sheet__pitch">{game.pitch}</p>

          <dl className="tgs-specs">
            <div>
              <dt>Genre</dt>
              <dd>{game.genres.join(' · ')}</dd>
            </div>
            <div>
              <dt>Platforms</dt>
              <dd>{game.platforms.join(' · ')}</dd>
            </div>
            <div>
              <dt>Players</dt>
              <dd>{game.players}</dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{game.length}</dd>
            </div>
            <div>
              <dt>Rating</dt>
              <dd>
                <span className="tgs-stars" role="img" aria-label={`Rated ${game.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <i key={i} className={i < Math.round(game.rating) ? 'on' : ''} />
                  ))}
                  <b>{game.rating.toFixed(1)}</b>
                </span>
              </dd>
            </div>
          </dl>

          <ul className="tgs-feats mono" aria-label="Feature list">
            {game.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <div className="tgs-sheet__buy">
            <p className="tgs-price tgs-price--big">
              {price.was && <s>{money(price.was, region)}</s>}
              <strong>{money(price.now, region)}</strong>
              <small className="mono muted"> {region.code} · DRM-free key</small>
            </p>
            <div className="tgs-sheet__actions">
              <button
                type="button"
                className="tgs-btn"
                disabled={inCart}
                onClick={() => {
                  onAdd()
                  onClose()
                }}
              >
                {inCart ? 'In your hold ✓' : `Add to hold — ${money(price.now, region)}`}
              </button>
              <button type="button" className="tgs-btn tgs-btn--ghost" aria-pressed={wished} onClick={onWish}>
                {wished ? '♥ Wishlisted' : '♡ Wishlist'}
              </button>
            </div>
            <p className="tgs-sheet__fine mono muted">
              Key delivered on checkout · refund if it sinks within 14 days · mock store, real manners
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= Cart drawer ================= */

function CartDrawer({
  cart,
  region,
  totals,
  code,
  orderNo,
  bought,
  onClose,
  onRemove,
  onApplyCode,
  onClearCode,
  onPlaceOrder,
}: {
  cart: string[]
  region: Region
  totals: { subtotal: number; subtotalUsd: number; discount: number; total: number; count: number }
  code: { code: string; pct: number } | null
  orderNo: string | null
  bought: string[]
  onClose: () => void
  onRemove: (id: string) => void
  onApplyCode: (raw: string) => { ok: boolean; message: string }
  onClearCode: () => void
  onPlaceOrder: (list: string[]) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [rawCode, setRawCode] = useState('')
  const [codeMsg, setCodeMsg] = useState('')
  const [codeOk, setCodeOk] = useState(false)
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const done = cart.length === 0 && orderNo !== null

  return (
    <div className="tgs-overlay tgs-overlay--right" onClick={onClose}>
      <aside
        className="tgs-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Your hold"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="tgs-drawer__head">
          <h2>{done ? 'Dive in. ▶' : `Your hold · ${totals.count}`}</h2>
          <button type="button" ref={closeRef} className="tgs-close" onClick={onClose} aria-label="Close hold">
            ✕
          </button>
        </header>

        {done ? (
          <div className="tgs-done">
            <p>
              <strong>Order {orderNo}</strong> — paid in zero real dollars.
            </p>
            <p>Your keys, straight from the press:</p>
            <ul className="tgs-keys">
              {bought.map((id) => (
                <li key={id}>
                  <span className="tgs-keys__game">{gameById.get(id)!.title}</span>
                  <code>{makeKey(id, orderNo!)}</code>
                </li>
              ))}
            </ul>
            <p className="mono muted">No email required. No games exist. Perfect transaction.</p>
            <button type="button" className="tgs-btn" onClick={onClose}>
              Back to the tank
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="tgs-empty">
            <p>
              <strong>The hold is empty.</strong> The tank is not.
            </p>
            <p>Twelve little games are circling overhead. Catch one.</p>
            <button type="button" className="tgs-btn tgs-btn--ghost" onClick={onClose}>
              Browse the catalogue
            </button>
          </div>
        ) : (
          <>
            <ul className="tgs-lines">
              {cart.map((id) => {
                const g = gameById.get(id)!
                const price = regionalPrice(g, region)
                return (
                  <li key={id} className="tgs-line">
                    <CoverArt game={g} className="tgs-line__art" />
                    <div className="tgs-line__info">
                      <p className="tgs-line__title">{g.title}</p>
                      <p className="mono muted">
                        {g.platforms.slice(0, 3).join(' · ')} · DRM-free key
                      </p>
                    </div>
                    <p className="tgs-line__price">
                      {price.was && <s>{money(price.was, region)}</s>} <strong>{money(price.now, region)}</strong>
                    </p>
                    <button
                      type="button"
                      className="tgs-line__x"
                      onClick={() => onRemove(id)}
                      aria-label={`Remove ${g.title}`}
                    >
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>

            <form
              className="tgs-code"
              onSubmit={(e) => {
                e.preventDefault()
                const res = onApplyCode(rawCode)
                setCodeMsg(res.message)
                setCodeOk(res.ok)
                if (res.ok) setRawCode('')
              }}
            >
              <label htmlFor="tgs-code-input" className="mono">
                Discount code
              </label>
              <div className="tgs-code__row">
                <input
                  id="tgs-code-input"
                  type="text"
                  value={rawCode}
                  onChange={(e) => setRawCode(e.target.value)}
                  placeholder="TIDAL10…"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="submit" className="tgs-chip">
                  Apply
                </button>
              </div>
              {codeMsg && (
                <p className={codeOk ? 'tgs-code__msg tgs-code__msg--ok' : 'tgs-code__msg'} role="status">
                  {codeMsg}
                </p>
              )}
              {code && (
                <p className="tgs-code__applied mono">
                  {code.code} −{Math.round(code.pct * 100)}%{' '}
                  <button type="button" className="tgs-reset" onClick={() => { onClearCode(); setCodeMsg(''); }}>
                    remove
                  </button>
                </p>
              )}
            </form>

            <dl className="tgs-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{money(totals.subtotal, region)}</dd>
              </div>
              {code && (
                <div className="tgs-totals__off">
                  <dt>{code.code} (−{Math.round(code.pct * 100)}%)</dt>
                  <dd>−{money(totals.discount, region)}</dd>
                </div>
              )}
              <div className="tgs-totals__grand">
                <dt>Total</dt>
                <dd>{money(totals.total, region)}</dd>
              </div>
            </dl>

            <button type="button" className="tgs-btn tgs-btn--wide" onClick={() => onPlaceOrder(cart)}>
              Complete mock purchase — {money(totals.total, region)}
            </button>
            <p className="tgs-drawer__fine mono muted">
              Checkout is theatre. No card fields, no tracking pixels, no guilt.
            </p>
          </>
        )}
      </aside>
    </div>
  )
}
