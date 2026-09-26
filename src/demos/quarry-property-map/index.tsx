import { useEffect, useMemo, useRef, useState } from 'react'
import './demo.css'
import SurveyMap, { type Pt } from './Map'
import PropertyArt from './Art'
import {
  COMMUTE_MAX,
  fmtLand,
  fmtMoney,
  hashStr,
  LISTINGS,
  pointInPolygon,
  SUBURBS,
  TYPES,
  type Listing,
  type PropertyType,
} from './data'

/**
 * Quarry & Compass — a map-first property search for the entirely
 * fictional Ironbark Shire. Draw a boundary, tighten the filters, book
 * an inspection. Every lot, street, agent and price is invented; the
 * interactions are real — saved searches and the shortlist persist in
 * localStorage, and the whole thing works from the keyboard via the
 * list view and focusable pins.
 */

interface Filters {
  minPrice: number | null
  maxPrice: number | null
  beds: number
  types: PropertyType[]
  maxCommute: number
  suburb: string
}

const DEFAULT_FILTERS: Filters = {
  minPrice: null,
  maxPrice: null,
  beds: 0,
  types: [],
  maxCommute: COMMUTE_MAX,
  suburb: 'any',
}

interface SavedSearch {
  id: string
  name: string
  filters: Filters
  boundary: Pt[] | null
  summary: string
  savedAt: string
}

const PRICE_STEPS = [500_000, 750_000, 1_000_000, 1_250_000, 1_500_000, 2_000_000, 2_500_000]
const LS_SEARCHES = 'qc-saved-searches'
const LS_SHORTLIST = 'qc-shortlist'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function persist(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode — searches live for the session only */
  }
}

function isDefaultFilters(f: Filters): boolean {
  return (
    f.minPrice === null &&
    f.maxPrice === null &&
    f.beds === 0 &&
    f.types.length === 0 &&
    f.maxCommute === COMMUTE_MAX &&
    f.suburb === 'any'
  )
}

function summarise(f: Filters, boundary: Pt[] | null): string {
  const bits: string[] = []
  if (f.suburb !== 'any') bits.push(f.suburb)
  if (f.minPrice) bits.push(`from ${fmtMoney(f.minPrice)}`)
  if (f.maxPrice) bits.push(`to ${fmtMoney(f.maxPrice)}`)
  if (f.beds > 0) bits.push(`${f.beds}+ bed`)
  if (f.types.length) bits.push(f.types.join('/'))
  if (f.maxCommute < COMMUTE_MAX) bits.push(`≤ ${f.maxCommute} min`)
  if (boundary) bits.push('inside boundary')
  return bits.length ? bits.join(' · ') : 'Whole shire'
}

function fmtPriceShort(n: number): string {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}m` : `$${Math.round(n / 1000)}k`
}

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())

/* ================================================================ app */

export default function QuarryPropertyMap() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<'newest' | 'price-asc' | 'price-desc' | 'commute'>('newest')
  const [boundary, setBoundary] = useState<Pt[] | null>(null)
  const [drawMode, setDrawMode] = useState(false)
  const [draft, setDraft] = useState<Pt[]>([])
  const [shortlist, setShortlist] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : load<string[]>(LS_SHORTLIST, []),
  )
  const [searches, setSearches] = useState<SavedSearch[]>(() =>
    typeof window === 'undefined' ? [] : load<SavedSearch[]>(LS_SEARCHES, []),
  )
  const [saveName, setSaveName] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selected, setSelected] = useState<Listing | null>(null)
  const [live, setLive] = useState('')
  const [view, setView] = useState<'split' | 'list'>('split')

  /* ----- filtering */

  const results = useMemo(() => {
    let out = LISTINGS.filter((l) => {
      if (filters.minPrice !== null && l.price < filters.minPrice) return false
      if (filters.maxPrice !== null && l.price > filters.maxPrice) return false
      if (l.beds < filters.beds) return false
      if (filters.types.length && !filters.types.includes(l.type)) return false
      if (l.commute > filters.maxCommute) return false
      if (filters.suburb !== 'any' && l.suburb !== filters.suburb) return false
      if (boundary && !pointInPolygon(l.x, l.y, boundary)) return false
      return true
    })
    out = [...out].sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.price - b.price
        case 'price-desc': return b.price - a.price
        case 'commute': return a.commute - b.commute
        default: return a.listedDays - b.listedDays
      }
    })
    return out
  }, [filters, boundary, sort])

  useEffect(() => {
    setLive(
      results.length
        ? `${results.length} ${results.length === 1 ? 'lot' : 'lots'} match.`
        : 'No lots match the current filters.',
    )
  }, [results.length])

  /* ----- shortlist & searches */

  const toggleShortlist = (id: string) => {
    const next = shortlist.includes(id) ? shortlist.filter((s) => s !== id) : [...shortlist, id]
    setShortlist(next)
    persist(LS_SHORTLIST, next)
    const l = LISTINGS.find((x) => x.id === id)
    setLive(
      shortlist.includes(id)
        ? `${l?.address ?? 'Lot'} removed from the shortlist.`
        : `${l?.address ?? 'Lot'} added to the shortlist. ${next.length} saved.`,
    )
  }

  const saveSearch = () => {
    const name = saveName.trim()
    if (!name) return
    const entry: SavedSearch = {
      id: `s${Date.now().toString(36)}`,
      name,
      filters,
      boundary,
      summary: summarise(filters, boundary),
      savedAt: new Date().toISOString(),
    }
    const next = [entry, ...searches].slice(0, 8)
    setSearches(next)
    persist(LS_SEARCHES, next)
    setSaveName('')
    setLive(`Search “${name}” saved.`)
  }

  const applySearch = (s: SavedSearch) => {
    setFilters(s.filters)
    setBoundary(s.boundary)
    setDrawMode(false)
    setDraft([])
    setLive(`Applied saved search “${s.name}”.`)
  }

  const deleteSearch = (id: string) => {
    const next = searches.filter((s) => s.id !== id)
    setSearches(next)
    persist(LS_SEARCHES, next)
  }

  /* ----- boundary drawing */

  const addPoint = (p: Pt) => {
    if (draft.length >= 24) return
    setDraft((d) => (d.length >= 24 ? d : [...d, p]))
    setLive(`Corner ${draft.length + 1} placed.`)
  }

  const applyBoundary = () => {
    if (draft.length < 3) return
    setBoundary(draft)
    setDrawMode(false)
    setLive(`Boundary applied with ${draft.length} corners.`)
  }

  const cancelDraw = () => {
    setDrawMode(false)
    setDraft(boundary ?? [])
  }

  const activeFilters = isDefaultFilters(filters) ? (boundary ? 1 : 0) : 10

  return (
    <div className="qc">
      <a className="qc-skiplink" href="#qc-results">Skip to results</a>

      {/* ------------------------------------------------ header */}
      <header className="qc-head">
        <div className="qc-head__brand">
          <svg className="qc-head__mark" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2.4" />
            <path d="M 20 7 L 24.5 24 L 20 21 L 15.5 24 Z" fill="currentColor" />
            <circle cx="20" cy="20" r="2.4" fill="currentColor" />
            <path d="M 20 3 v 3 M 20 34 v 3 M 3 20 h 3 M 34 20 h 3" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div>
            <p className="qc-head__name">Quarry &amp; Compass</p>
            <p className="qc-head__meta">
              Property atlas · Ironbark Shire · {LISTINGS.length} lots surveyed · Est. 1962
            </p>
          </div>
        </div>
        <div className="qc-head__stats">
          <span className="qc-head__chip">{shortlist.length} shortlisted</span>
          <span className="qc-head__chip">{searches.length} saved {searches.length === 1 ? 'search' : 'searches'}</span>
        </div>
      </header>

      {/* ------------------------------------------------ body */}
      <div className={`qc-body qc-body--${view}`}>
        {/* ------ filter rail ------ */}
        <aside className="qc-rail" aria-label="Search filters">
          <button
            type="button"
            className="qc-rail__toggle"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((o) => !o)}
          >
            Filters &amp; boundaries
            {activeFilters ? <span className="qc-rail__dot">{activeFilters > 1 ? 'on' : '1'}</span> : null}
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>

          <div className={`qc-rail__in${filtersOpen ? ' qc-rail__in--open' : ''}`}>
            {/* district */}
            <div className="qc-field">
              <label htmlFor="qc-suburb">District</label>
              <select
                id="qc-suburb"
                value={filters.suburb}
                onChange={(e) => setFilters((f) => ({ ...f, suburb: e.target.value }))}
              >
                <option value="any">Whole shire</option>
                {SUBURBS.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* price */}
            <div className="qc-field qc-field--pair">
              <div>
                <label htmlFor="qc-minp">Min price</label>
                <select
                  id="qc-minp"
                  value={filters.minPrice ?? ''}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, minPrice: e.target.value ? Number(e.target.value) : null }))
                  }
                >
                  <option value="">No min</option>
                  {PRICE_STEPS.map((p) => (
                    <option key={p} value={p}>{fmtPriceShort(p)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="qc-maxp">Max price</label>
                <select
                  id="qc-maxp"
                  value={filters.maxPrice ?? ''}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : null }))
                  }
                >
                  <option value="">No max</option>
                  {PRICE_STEPS.map((p) => (
                    <option key={p} value={p}>{fmtPriceShort(p)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* beds */}
            <fieldset className="qc-field">
              <legend>Bedrooms</legend>
              <div className="qc-seg" role="group" aria-label="Minimum bedrooms">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={filters.beds === n ? 'is-on' : ''}
                    aria-pressed={filters.beds === n}
                    onClick={() => setFilters((f) => ({ ...f, beds: n }))}
                  >
                    {n === 0 ? 'Any' : `${n}+`}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* type */}
            <fieldset className="qc-field">
              <legend>Dwelling</legend>
              <div className="qc-chips">
                {TYPES.map((t) => {
                  const on = filters.types.includes(t)
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`qc-chipbtn${on ? ' is-on' : ''}`}
                      aria-pressed={on}
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          types: on ? f.types.filter((x) => x !== t) : [...f.types, t],
                        }))
                      }
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* commute */}
            <div className="qc-field">
              <label htmlFor="qc-commute">
                Commute to the Quay <output htmlFor="qc-commute">{filters.maxCommute >= COMMUTE_MAX ? 'any time' : `≤ ${filters.maxCommute} min`}</output>
              </label>
              <input
                id="qc-commute"
                type="range"
                min={15}
                max={COMMUTE_MAX}
                step={5}
                value={filters.maxCommute}
                onChange={(e) => setFilters((f) => ({ ...f, maxCommute: Number(e.target.value) }))}
              />
              <div className="qc-range-marks" aria-hidden="true"><span>15</span><span>45</span><span>90 min</span></div>
            </div>

            {/* boundary status */}
            <div className="qc-field">
              <span className="qc-field__label">Boundary</span>
              {boundary ? (
                <div className="qc-boundary">
                  <p>Drawn boundary active — {boundary.length} corners.</p>
                  <div className="qc-boundary__row">
                    <button type="button" onClick={() => { setDraft(boundary); setDrawMode(true) }}>
                      Redraw
                    </button>
                    <button
                      type="button"
                      onClick={() => { setBoundary(null); setDraft([]); setLive('Boundary cleared.') }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <p className="qc-rail__hint">No boundary. Use “Draw a boundary” on the map to fence a search area.</p>
              )}
            </div>

            {(activeFilters > 0) && (
              <button
                type="button"
                className="qc-reset"
                onClick={() => {
                  setFilters(DEFAULT_FILTERS)
                  setBoundary(null)
                  setDraft([])
                  setDrawMode(false)
                  setLive('All filters cleared. Whole shire shown.')
                }}
              >
                Reset everything
              </button>
            )}

            {/* saved searches */}
            <div className="qc-saved">
              <h2 className="qc-saved__title">Saved searches</h2>
              <div className="qc-saved__new">
                <label htmlFor="qc-savename" className="qc-sr">Name this search</label>
                <input
                  id="qc-savename"
                  type="text"
                  placeholder="Name this search…"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveSearch() }}
                  maxLength={42}
                />
                <button type="button" onClick={saveSearch} disabled={!saveName.trim()}>
                  Save
                </button>
              </div>
              {searches.length === 0 ? (
                <p className="qc-rail__hint">Nothing pinned yet. Set some filters, name the search, come back tomorrow.</p>
              ) : (
                <ul className="qc-saved__list">
                  {searches.map((s) => (
                    <li key={s.id}>
                      <button type="button" className="qc-saved__apply" onClick={() => applySearch(s)}>
                        <strong>{s.name}</strong>
                        <span>{s.summary}</span>
                      </button>
                      <button
                        type="button"
                        className="qc-saved__del"
                        aria-label={`Delete saved search ${s.name}`}
                        onClick={() => deleteSearch(s.id)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>

        {/* ------ map ------ */}
        {view === 'split' && (
          <section className="qc-mapwrap" aria-label="Map search">
            <SurveyMap
              listings={results}
              shortlist={new Set(shortlist)}
              boundary={boundary}
              drawMode={drawMode}
              draft={draft}
              onAddPoint={addPoint}
              onOpen={setSelected}
              onLive={setLive}
            >
              <div className="qc-map__drawbar">
                {!drawMode ? (
                  <button type="button" className="qc-drawbtn" onClick={() => { setDrawMode(true); setDraft(boundary ?? []) }}>
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.3 1.7l3 3L6 13H3v-3l8.3-8.3zM2 15h12" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                    {boundary ? 'Edit boundary' : 'Draw a boundary'}
                  </button>
                ) : (
                  <div className="qc-drawtools" role="group" aria-label="Boundary drawing tools">
                    <span className="qc-drawtools__hint">
                      {draft.length < 3
                        ? `Click the map to place corners — ${Math.max(0, 3 - draft.length)} more to close`
                        : `${draft.length} corners — apply when the shape feels right`}
                    </span>
                    <button type="button" onClick={() => setDraft((d) => d.slice(0, -1))} disabled={!draft.length}>
                      Undo
                    </button>
                    <button type="button" onClick={() => setDraft([])} disabled={!draft.length}>
                      Clear
                    </button>
                    <button type="button" className="is-primary" onClick={applyBoundary} disabled={draft.length < 3}>
                      Apply boundary
                    </button>
                    <button type="button" onClick={cancelDraw}>Cancel</button>
                  </div>
                )}
              </div>
            </SurveyMap>
          </section>
        )}

        {/* ------ results ------ */}
        <section className="qc-results" id="qc-results" aria-label="Listings">
          <div className="qc-results__bar">
            <p className="qc-results__count">
              <strong>{results.length}</strong> of {LISTINGS.length} lots
              {boundary ? ' · inside boundary' : ''}
            </p>
            <div className="qc-results__tools">
              <label htmlFor="qc-sort" className="qc-sr">Sort listings</label>
              <select id="qc-sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
                <option value="newest">Newest first</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
                <option value="commute">Shortest commute</option>
              </select>
              <div className="qc-viewswitch" role="group" aria-label="Results layout">
                <button
                  type="button"
                  className={view === 'split' ? 'is-on' : ''}
                  aria-pressed={view === 'split'}
                  onClick={() => setView('split')}
                >
                  Map + list
                </button>
                <button
                  type="button"
                  className={view === 'list' ? 'is-on' : ''}
                  aria-pressed={view === 'list'}
                  onClick={() => setView('list')}
                >
                  List only
                </button>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="qc-empty">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" />
                <path d="M 32 14 L 37 36 L 32 32 L 27 36 Z" fill="currentColor" />
              </svg>
              <p className="qc-empty__title">The needle spins. Nothing in this patch.</p>
              <p>Loosen a filter, widen the boundary, or let the compass reset.</p>
              <button
                type="button"
                className="qc-reset"
                onClick={() => {
                  setFilters(DEFAULT_FILTERS)
                  setBoundary(null)
                  setDraft([])
                  setLive('All filters cleared. Whole shire shown.')
                }}
              >
                Reset the survey
              </button>
            </div>
          ) : (
            <ul className={`qc-cards${view === 'list' ? ' qc-cards--wide' : ''}`}>
              {results.map((l) => (
                <PropertyCard
                  key={l.id}
                  listing={l}
                  saved={shortlist.includes(l.id)}
                  onOpen={() => setSelected(l)}
                  onSave={() => toggleShortlist(l.id)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ------------------------------------------------ detail sheet */}
      {selected && (
        <DetailSheet
          listing={selected}
          saved={shortlist.includes(selected.id)}
          onSave={() => toggleShortlist(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}

      <div className="qc-live" aria-live="polite">{live}</div>

      <footer className="qc-foot">
        <span>Quarry &amp; Compass © concept demo — every lot, agent and price on this atlas is fictional.</span>
        <span>Surveyed · Drafted · Drawn in the browser.</span>
      </footer>
    </div>
  )
}

/* ================================================================ card */

function PropertyCard({
  listing,
  saved,
  onOpen,
  onSave,
}: {
  listing: Listing
  saved: boolean
  onOpen: () => void
  onSave: () => void
}) {
  const l = listing
  return (
    <li className="qc-card">
      <button type="button" className="qc-card__media" onClick={onOpen} aria-label={`View details for ${l.address}, ${l.suburb}`}>
        <PropertyArt listing={l} className="qc-card__art" />
        <span className="qc-card__lot">{l.lot}</span>
        <span className="qc-card__type">{l.type}</span>
      </button>
      <div className="qc-card__body">
        <div className="qc-card__pricerow">
          <p className="qc-card__price">{fmtMoney(l.price)}</p>
          <button
            type="button"
            className={`qc-save${saved ? ' is-on' : ''}`}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${l.address} from shortlist` : `Shortlist ${l.address}`}
            onClick={onSave}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 14.2S1.6 10.4 1.6 6A3.6 3.6 0 0 1 8 3.7 3.6 3.6 0 0 1 14.4 6c0 4.4-6.4 8.2-6.4 8.2z" />
            </svg>
          </button>
        </div>
        <p className="qc-card__addr">{l.address}</p>
        <p className="qc-card__suburb">{l.suburb}, Ironbark Shire</p>
        <p className="qc-card__specs">
          {l.type === 'Land' ? (
            <span>{fmtLand(l.land)}</span>
          ) : (
            <>
              <span>{l.beds} bd</span><span>{l.baths} ba</span><span>{l.cars} car</span><span>{fmtLand(l.land)}</span>
            </>
          )}
        </p>
        <p className="qc-card__foot">
          <span className="qc-card__commute">{l.commute} min to the Quay</span>
          <span>Listed {l.listedDays}d ago</span>
        </p>
      </div>
    </li>
  )
}

/* ================================================================ sheet */

function DetailSheet({
  listing,
  saved,
  onSave,
  onClose,
}: {
  listing: Listing
  saved: boolean
  onSave: () => void
  onClose: () => void
}) {
  const [slot, setSlot] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [ref, setRef] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const book = () => {
    const e: Record<string, string> = {}
    if (slot === null) e.slot = 'Pick an inspection time.'
    if (!name.trim()) e.name = 'We need a name for the agent.'
    if (!emailOk(email)) e.email = 'That email won’t survive the trip.'
    setErrs(e)
    if (Object.keys(e).length) return
    const code = (hashStr(`${listing.id}:${slot}:${name}`) % 46656).toString(36).toUpperCase().padStart(3, '0')
    setRef(`QC-${code}`)
  }

  const l = listing
  const slotLabel = slot !== null ? `${l.opens[slot].day} ${l.opens[slot].time}` : ''

  return (
    <div
      className="qc-sheet-wrap"
      ref={wrapRef}
      onClick={(e) => {
        if (e.target === wrapRef.current) onClose()
      }}
    >
      <div className="qc-sheet" role="dialog" aria-modal="true" aria-label={`${l.address}, ${l.suburb}`}>
        <button type="button" ref={closeRef} className="qc-sheet__close" onClick={onClose} aria-label="Close listing details">
          ×
        </button>

        {!ref ? (
          <>
            <div className="qc-sheet__media">
              <PropertyArt listing={l} className="qc-sheet__art" />
              <span className="qc-card__lot">{l.lot}</span>
            </div>
            <div className="qc-sheet__body">
              <p className="qc-sheet__type">
                {l.type} · {l.suburb} · Listed {l.listedDays} days ago
              </p>
              <h2 className="qc-sheet__title">{l.address}</h2>
              <p className="qc-sheet__suburb">{l.suburb}, Ironbark Shire</p>
              <p className="qc-sheet__price">{fmtMoney(l.price)}</p>
              <p className="qc-sheet__specs">
                {l.type === 'Land' ? (
                  <span>{fmtLand(l.land)}</span>
                ) : (
                  <>
                    <span>{l.beds} bedrooms</span><span>{l.baths} bathrooms</span>
                    <span>{l.cars} car</span><span>{fmtLand(l.land)}</span>
                  </>
                )}
                <span>{l.commute} min to {`the Quay`}</span>
              </p>
              <p className="qc-sheet__blurb">{l.blurb}</p>
              <ul className="qc-sheet__feats">
                {l.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <p className="qc-sheet__agent">
                {l.agent.name} · <a href={`tel:${l.agent.phone.replace(/\s/g, '')}`}>{l.agent.phone}</a>
              </p>

              <div className="qc-sheet__booking">
                <h3>Book an inspection</h3>
                <fieldset className={errs.slot ? 'has-err' : ''}>
                  <legend className="qc-sr">Inspection times</legend>
                  {l.opens.map((o, i) => (
                    <label key={i} className={`qc-slot${slot === i ? ' is-on' : ''}`}>
                      <input
                        type="radio"
                        name="qc-slot"
                        checked={slot === i}
                        onChange={() => setSlot(i)}
                      />
                      <span>{o.day}</span>
                      <span className="qc-slot__time">{o.time}</span>
                    </label>
                  ))}
                </fieldset>
                {errs.slot && <p className="qc-err">{errs.slot}</p>}

                <div className="qc-sheet__form">
                  <div>
                    <label htmlFor="qc-bname">Name</label>
                    <input
                      id="qc-bname" type="text" value={name} autoComplete="name"
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!errs.name}
                    />
                    {errs.name && <p className="qc-err">{errs.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="qc-bemail">Email</label>
                    <input
                      id="qc-bemail" type="email" value={email} autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!errs.email}
                    />
                    {errs.email && <p className="qc-err">{errs.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="qc-bphone">Phone <span className="qc-opt">(optional)</span></label>
                    <input
                      id="qc-bphone" type="tel" value={phone} autoComplete="tel"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="qc-sheet__actions">
                  <button type="button" className="qc-btn-primary" onClick={book}>
                    Confirm inspection
                  </button>
                  <button
                    type="button"
                    className={`qc-btn-ghost${saved ? ' is-on' : ''}`}
                    aria-pressed={saved}
                    onClick={onSave}
                  >
                    {saved ? 'Shortlisted ✓' : 'Shortlist this lot'}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="qc-booked">
            <svg viewBox="0 0 64 64" aria-hidden="true" className="qc-booked__stamp">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeDasharray="4 4" />
              <path d="M20 33l8 8 16-18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="qc-booked__lead">Booked. Peg it in the diary.</p>
            <p className="qc-booked__detail">
              {name.trim().split(' ')[0]}, you’re down for <strong>{slotLabel}</strong> at{' '}
              <strong>{l.address}, {l.suburb}</strong>. {l.agent.name} will meet you at the gate with the keys.
            </p>
            <p className="qc-booked__ref">Reference <strong>{ref}</strong></p>
            <button type="button" className="qc-btn-primary" onClick={onClose}>
              Back to the map
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
