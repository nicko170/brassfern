import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CARDS,
  CARD_BY_ID,
  DECADES,
  THEMES,
  THEME_LABEL,
  TOWNS,
  THREADS,
  EMPTY_FILTERS,
  applyFilters,
  facetCount,
  replyCount,
  sortCards,
  filtersEqual,
  threadFilters,
  describeFilters,
  citationFor,
  parseUrl,
  filtersToSearch,
  type Filters,
  type Postcard,
  type SortId,
  type ThemeId,
} from './data'
import { CardArt, Stamp, Postmark } from './CardArt'
import './demo.css'

/**
 * Postcards Archive — public explorer for the (fictional) Corrowong Museums
 * Trust postcard collection. Art direction: the archive index card — aged
 * stock, bureaucratic green, red accession ink, slab display + typewriter
 * catalogue numbers. Facets, threads, timeline and lightbox all sync to the
 * URL; the whole reading room works from a keyboard.
 */

const BATCH = 24
const TOTAL_CATALOGUED = 8342

const SORTS: { id: SortId; label: string }[] = [
  { id: 'curated', label: 'Curator’s order' },
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
]

function readInitial(): { filters: Filters; thread: string | null; card: string | null } {
  if (typeof window === 'undefined') return { filters: EMPTY_FILTERS, thread: null, card: null }
  return parseUrl(window.location.search)
}

export default function PostcardsArchiveExplorer() {
  const init = useMemo(readInitial, [])
  const [filters, setFilters] = useState<Filters>(init.filters)
  const [threadId, setThreadId] = useState<string | null>(init.thread)
  const [sort, setSort] = useState<SortId>('curated')
  const [openId, setOpenId] = useState<string | null>(init.card && CARD_BY_ID.has(init.card) ? init.card : null)
  const [verso, setVerso] = useState(false)
  const [visible, setVisible] = useState(BATCH)
  const [notice, setNotice] = useState('')
  const [cited, setCited] = useState(false)

  const triggerRef = useRef<HTMLElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const browseRef = useRef<HTMLElement | null>(null)

  const announce = useCallback((msg: string) => {
    setNotice('')
    requestAnimationFrame(() => setNotice(msg))
  }, [])

  /* ---------------- derived catalogue ---------------- */

  const filtered = useMemo(() => applyFilters(CARDS, filters), [filters])
  const sorted = useMemo(() => sortCards(filtered, sort), [filtered, sort])
  const shown = sorted.slice(0, visible)

  const decadeCounts = useMemo(
    () => DECADES.map((d) => ({ ...d, n: facetCount(CARDS, filters, 'decades', d.id) })),
    [filters],
  )
  const townCounts = useMemo(
    () => TOWNS.map((t) => ({ name: t, n: facetCount(CARDS, filters, 'towns', t) })),
    [filters],
  )
  const themeCounts = useMemo(
    () => THEMES.map((t) => ({ ...t, n: facetCount(CARDS, filters, 'themes', t.id) })),
    [filters],
  )
  const repliesN = useMemo(() => replyCount(CARDS, filters), [filters])
  const maxDecade = Math.max(1, ...decadeCounts.map((d) => d.n))

  const anyFilter =
    filters.decades.length > 0 || filters.towns.length > 0 || filters.themes.length > 0 || filters.reply

  /* ---------------- URL sync ---------------- */

  useEffect(() => {
    if (typeof window === 'undefined') return
    const qs = filtersToSearch(filters, threadId, openId)
    window.history.replaceState(null, '', `${window.location.pathname}${qs}`)
  }, [filters, threadId, openId])

  /* ---------------- announce + reset pagination on filter change ---------------- */

  const serialized = JSON.stringify(filters)
  useEffect(() => {
    setVisible(BATCH)
    const n = applyFilters(CARDS, JSON.parse(serialized) as Filters).length
    const desc = describeFilters(JSON.parse(serialized) as Filters)
    announce(
      n === 0
        ? 'The drawer is empty for that combination — loosen a facet.'
        : `${n} card${n === 1 ? '' : 's'} in the drawer${desc ? ` — ${desc}` : ''}.`,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized])

  /* ---------------- lazy rendering ---------------- */

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible((v) => Math.min(v + BATCH * 3, sorted.length))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible((v) => Math.min(v + BATCH, sorted.length))
      },
      { rootMargin: '1200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [sorted.length])

  /* ---------------- filter ops ---------------- */

  const setFacet = useCallback(
    (facet: 'decades' | 'towns' | 'themes', value: string) => {
      setThreadId(null)
      setFilters((prev) => {
        const list = prev[facet] as string[]
        const next = list.includes(value) ? list.filter((v) => v !== value) : [value]
        return { ...prev, [facet]: next }
      })
    },
    [],
  )

  const toggleReply = useCallback(() => {
    setThreadId(null)
    setFilters((prev) => ({ ...prev, reply: !prev.reply }))
  }, [])

  const clearAll = useCallback(() => {
    setThreadId(null)
    setFilters(EMPTY_FILTERS)
  }, [])

  const openThread = useCallback(
    (id: string) => {
      if (threadId === id) {
        setThreadId(null)
        setFilters(EMPTY_FILTERS)
        return
      }
      const t = THREADS.find((x) => x.id === id)
      if (!t) return
      setThreadId(id)
      setFilters(threadFilters(t))
      browseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    [threadId],
  )

  /* ---------------- lightbox ---------------- */

  const openCard = CARD_BY_ID.get(openId ?? '') ?? null
  const openIndex = openCard ? sorted.findIndex((c) => c.id === openCard.id) : -1

  const closeLightbox = useCallback(() => {
    setOpenId(null)
    setVerso(false)
    triggerRef.current?.focus()
  }, [])

  const openLightbox = useCallback((c: Postcard, from: HTMLElement) => {
    triggerRef.current = from
    setVerso(false)
    setCited(false)
    setOpenId(c.id)
  }, [])

  const stepCard = useCallback(
    (dir: 1 | -1) => {
      if (openIndex < 0) return
      const next = sorted[(openIndex + dir + sorted.length) % sorted.length]
      setVerso(false)
      setCited(false)
      setOpenId(next.id)
    },
    [openIndex, sorted],
  )

  useEffect(() => {
    if (!openCard) return
    document.body.style.overflow = 'hidden'
    const dlg = dialogRef.current
    const first = dlg?.querySelector<HTMLElement>('.pcx-light__close')
    first?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeLightbox()
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        stepCard(1)
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        stepCard(-1)
        return
      }
      if (e.key === 'Tab' && dlg) {
        const focusables = dlg.querySelectorAll<HTMLElement>(
          'button, [href], input, select, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const firstEl = focusables[0]
        const lastEl = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [openCard, closeLightbox, stepCard])

  const copyCitation = useCallback(() => {
    if (!openCard) return
    const text = citationFor(openCard)
    const done = () => {
      setCited(true)
      announce('Citation copied to your clipboard.')
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, () => announce('Copy failed — the citation is printed below.'))
    } else {
      announce('Clipboard unavailable — the citation is printed below.')
    }
  }, [openCard, announce])

  const activeThread = THREADS.find((t) => t.id === threadId) ?? null

  /* ---------------- render ---------------- */

  return (
    <div className="pcx">
      <a className="pcx-skip" href="#pcx-browse">
        Skip to the catalogue
      </a>

      {/* ============ masthead ============ */}
      <header className="pcx-head">
        <a className="pcx-stampbrand" href="#pcx-top" aria-label="The Corrowong Museums Trust — Postcards home">
          <svg viewBox="0 0 30 30" aria-hidden="true" focusable="false" className="pcx-head__mark">
            <rect x="7" y="4" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 4 L15 11 L23 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M5 22 h20 M8 26 h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>
            <strong>Postcards</strong>
            <em>Corrowong Museums Trust</em>
          </span>
        </a>
        <nav className="pcx-nav" aria-label="Archive sections">
          <a href="#pcx-threads">Threads</a>
          <a href="#pcx-browse">The drawer</a>
          <a href="#pcx-about">About the archive</a>
        </nav>
        <span className="pcx-head__acc" aria-hidden="true">
          Cut 03 · Public
        </span>
      </header>

      <main id="pcx-top">
        {/* ============ hero ============ */}
        <section className="pcx-hero">
          <p className="pcx-eyebrow">Postcards Collection · digitised 2019–2026 · Box PC-1 through PC-208</p>
          <h1 className="pcx-h1">
            A hundred years of <em>“wish you were here.”</em>
          </h1>
          <p className="pcx-lede">
            Eight towns, six museum collections, {TOTAL_CATALOGUED.toLocaleString()} postcards — and the
            hundred and twenty in this drawer to wander. Open one, turn it over, fall into somebody
            else’s Tuesday. Every search is a shareable address; every card has a citation.
          </p>
          <dl className="pcx-stats" aria-label="Archive at a glance">
            <div>
              <dt>{TOTAL_CATALOGUED.toLocaleString()}</dt>
              <dd>cards catalogued</dd>
            </div>
            <div>
              <dt>{CARDS.length}</dt>
              <dd>in this reading cut</dd>
            </div>
            <div>
              <dt>{TOWNS.length}</dt>
              <dd>postmark towns</dd>
            </div>
            <div>
              <dt>1900–94</dt>
              <dd>years of mail</dd>
            </div>
          </dl>
        </section>

        {/* ============ threads rail ============ */}
        <section className="pcx-threads" id="pcx-threads" aria-label="Curated threads">
          <div className="pcx-threads__head">
            <h2 className="pcx-h2">Threads, pulled by our curators</h2>
            <p>
              Not search results — invitations. Each thread is a hand-pulled drawer of cards that
              talk to each other. Open one; every facet stays live.
            </p>
          </div>
          <ul className="pcx-threads__rail" role="list">
            {THREADS.map((t) => {
              const n = applyFilters(CARDS, threadFilters(t)).length
              const active = threadId === t.id
              return (
                <li key={t.id} className="pcx-thread" data-active={active || undefined}>
                  <button
                    type="button"
                    className="pcx-thread__btn"
                    aria-pressed={active}
                    onClick={() => openThread(t.id)}
                  >
                    <span className="pcx-thread__kicker">{t.kicker}</span>
                    <span className="pcx-thread__title">{t.title}</span>
                    <span className="pcx-thread__blurb">{t.blurb}</span>
                    <span className="pcx-thread__foot">
                      <span className="pcx-thread__count">{n} cards</span>
                      <span className="pcx-thread__cta">{active ? 'Close thread ✕' : 'Open the thread →'}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ============ browse ============ */}
        <section className="pcx-browse" id="pcx-browse" ref={browseRef} aria-label="Browse the collection">
          <div className="pcx-browse__scrollpad" />

          {/* ---- facets ---- */}
          <div className="pcx-facets-col">
            <aside className="pcx-facets" aria-label="Refine the drawer">
              <div className="pcx-facets__top">
                <h2 className="pcx-facets__title">The card drawer</h2>
                <button type="button" className="pcx-clear" onClick={clearAll} disabled={!anyFilter}>
                  {anyFilter ? 'Reset drawer ✕' : 'Drawer is open'}
                </button>
              </div>

              {activeThread && (
                <p className="pcx-facets__thread">
                  Thread open: <strong>{activeThread.title}</strong>
                </p>
              )}

              {/* decade timeline */}
              <fieldset className="pcx-facet">
                <legend>Decade posted</legend>
                <div className="pcx-timeline" role="group" aria-label="Cards per decade">
                  {decadeCounts.map((d) => {
                    const on = filters.decades.includes(d.id)
                    return (
                      <button
                        key={d.id}
                        type="button"
                        className="pcx-tl__col"
                        aria-pressed={on}
                        aria-label={`${d.id}: ${d.n} cards`}
                        disabled={d.n === 0 && !on}
                        onClick={() => setFacet('decades', d.id)}
                      >
                        <span className="pcx-tl__n">{d.n}</span>
                        <span className="pcx-tl__bar" style={{ height: `${Math.max(6, (d.n / maxDecade) * 100)}%` }} />
                        <span className="pcx-tl__label">{d.id.replace('s', '’s')}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {/* towns */}
              <fieldset className="pcx-facet">
                <legend>Postmarked from</legend>
                <ul className="pcx-opts">
                  {townCounts.map((t) => {
                    const on = filters.towns.includes(t.name)
                    return (
                      <li key={t.name}>
                        <button
                          type="button"
                          className="pcx-opt"
                          aria-pressed={on}
                          disabled={t.n === 0 && !on}
                          onClick={() => setFacet('towns', t.name)}
                        >
                          <span>{t.name}</span>
                          <span className="pcx-opt__n">{t.n}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </fieldset>

              {/* themes */}
              <fieldset className="pcx-facet">
                <legend>What it shows</legend>
                <ul className="pcx-opts">
                  {themeCounts.map((t) => {
                    const on = filters.themes.includes(t.id)
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          className="pcx-opt"
                          aria-pressed={on}
                          disabled={t.n === 0 && !on}
                          onClick={() => setFacet('themes', t.id)}
                        >
                          <span>{t.label}</span>
                          <span className="pcx-opt__n">{t.n}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </fieldset>

              <fieldset className="pcx-facet pcx-facet--toggle">
                <legend>The conversation</legend>
                <button
                  type="button"
                  className="pcx-opt pcx-opt--reply"
                  aria-pressed={filters.reply}
                  onClick={toggleReply}
                  disabled={repliesN === 0 && !filters.reply}
                >
                  <span>Answered cards only</span>
                  <span className="pcx-opt__n">{repliesN}</span>
                </button>
                <p className="pcx-facet__note">A card with its reply in the box — the whole correspondence.</p>
              </fieldset>
            </aside>
          </div>

          {/* ---- wall ---- */}
          <div className="pcx-wallwrap">
            <div className="pcx-wallbar">
              <p className="pcx-walcount" role="status" aria-live="polite">
                <strong>{filtered.length}</strong> of {CARDS.length} cards
                {describeFilters(filters) ? ` — ${describeFilters(filters)}` : ''}
              </p>
              <label className="pcx-sort">
                <span>Arrange</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortId)}>
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {filtered.length === 0 ? (
              <div className="pcx-empty">
                <p>
                  <strong>Nothing in the drawer matches.</strong> The archive is large but not
                  infinite — loosen a facet or two.
                </p>
                <button type="button" className="pcx-btn" onClick={clearAll}>
                  Open the whole drawer
                </button>
              </div>
            ) : (
              <ul className="pcx-wall" role="list">
                {shown.map((c) => (
                  <WallCard key={c.id} card={c} onOpen={openLightbox} />
                ))}
              </ul>
            )}

            {visible < sorted.length && (
              <div ref={sentinelRef} className="pcx-sentinel" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            )}
            {visible >= sorted.length && sorted.length > BATCH && (
              <p className="pcx-wallend">That’s the whole drawer — {sorted.length} cards.</p>
            )}
          </div>
        </section>

        {/* ============ about ============ */}
        <section className="pcx-about" id="pcx-about">
          <h2 className="pcx-h2">
            This archive is <em>for wandering</em>, as much as for finding.
          </h2>
          <div className="pcx-about__grid">
            <article>
              <h3>Every combination is an address</h3>
              <p>
                Facets, threads and open cards all live in the URL. The local history society shares
                “the flood cards” as a link, not instructions — that single decision did more for
                visitation than any redesign of the logo.
              </p>
            </article>
            <article>
              <h3>A reading room, not a slideshow</h3>
              <p>
                Turn a card over with the button or your arrow keys. Transcriptions sit beside the
                scan because handwriting from 1914 deserves a translator, and screen readers deserve
                better than a picture of a letter.
              </p>
            </article>
            <article>
              <h3>Citations people actually use</h3>
              <p>
                Every card copies a full citation in one tap — teachers, footnotes and family
                historians all get the same honest string: title, year, towns, accession number,
                collection.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="pcx-foot">
        <p>
          <strong>The Corrowong Museums Trust — Postcards Collection.</strong> A fictional archive
          and a working demo by Brassfern: all 120 cards, scenes, stamps and messages are generated
          in the browser from a seed. No mail was harmed.
        </p>
        <p className="pcx-foot__mono">READING ROOM OPEN · BRING YOUR OWN MAGNIFYING GLASS</p>
      </footer>

      {/* ============ lightbox ============ */}
      {openCard && (
        <div className="pcx-light" onClick={closeLightbox}>
          <div
            className="pcx-light__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pcx-light-title"
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="pcx-light__close" onClick={closeLightbox} aria-label="Close the reading room">
              ✕
            </button>

            <div className="pcx-light__stage">
              <div className="pcx-flip" data-side={verso ? 'verso' : 'recto'}>
                <div className="pcx-flip__inner">
                  <div className="pcx-flip__face pcx-flip__recto">
                    <CardArt card={openCard} />
                    <p className="pcx-flip__cap">{openCard.title}</p>
                  </div>
                  <div className="pcx-flip__face pcx-flip__verso" aria-hidden={!verso}>
                    <div className="pcx-verso">
                      <div className="pcx-verso__left">
                        <p className="pcx-verso__label">Correspondence</p>
                        <p className="pcx-verso__msg">{openCard.message}</p>
                      </div>
                      <div className="pcx-verso__rule" aria-hidden="true" />
                      <div className="pcx-verso__right">
                        <div className="pcx-verso__stampcorner">
                          <Stamp stamp={openCard.stamp} />
                          <Postmark
                            town={openCard.town}
                            label={`${openCard.day} ${openCard.month} ${String(openCard.year).slice(2)}`}
                            seed={openCard.seed}
                          />
                        </div>
                        <p className="pcx-verso__label">Address</p>
                        <address className="pcx-verso__addr">
                          {openCard.recipient}
                          <br />
                          c/o the Post Office
                          <br />
                          {openCard.to}
                        </address>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pcx-light__ctl">
                <button
                  type="button"
                  className="pcx-btn pcx-btn--ghost"
                  onClick={() => stepCard(-1)}
                  disabled={sorted.length < 2}
                  aria-label="Previous card in the drawer"
                >
                  ← Previous
                </button>
                <button type="button" className="pcx-btn" onClick={() => setVerso((v) => !v)} aria-pressed={verso}>
                  {verso ? 'Turn back over ⟲' : 'Turn the card over ⟳'}
                </button>
                <button
                  type="button"
                  className="pcx-btn pcx-btn--ghost"
                  onClick={() => stepCard(1)}
                  disabled={sorted.length < 2}
                  aria-label="Next card in the drawer"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="pcx-light__meta">
              <p className="pcx-light__acc">{openCard.accession}</p>
              <h3 className="pcx-light__title" id="pcx-light-title">
                {openCard.title}
              </h3>
              <p className="pcx-light__date">
                Postmarked {openCard.town}, {openCard.day} {openCard.month} {openCard.year} · addressed to{' '}
                {openCard.to}
              </p>

              <dl className="pcx-dl">
                <div>
                  <dt>From</dt>
                  <dd>{openCard.sender}</dd>
                </div>
                <div>
                  <dt>To</dt>
                  <dd>{openCard.recipient}</dd>
                </div>
                <div>
                  <dt>Theme</dt>
                  <dd>{THEME_LABEL[openCard.theme]}</dd>
                </div>
                <div>
                  <dt>Stamp</dt>
                  <dd>{openCard.stamp.label}</dd>
                </div>
                <div>
                  <dt>Condition</dt>
                  <dd>{openCard.condition}</dd>
                </div>
                <div>
                  <dt>Reply held</dt>
                  <dd>{openCard.reply ? 'Yes — full transcription below' : 'No reply survives'}</dd>
                </div>
              </dl>

              <div className="pcx-transcript">
                <h4>Transcription</h4>
                <p>{openCard.message}</p>
              </div>

              {openCard.reply && (
                <div className="pcx-transcript pcx-transcript--reply">
                  <h4>The reply, held in the same box</h4>
                  <p>{openCard.reply}</p>
                </div>
              )}

              <div className="pcx-cite">
                <button type="button" className="pcx-btn pcx-btn--full" onClick={copyCitation}>
                  {cited ? 'Citation copied ✓' : 'Copy a citation'}
                </button>
                <p className="pcx-cite__text">{citationFor(openCard)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="pcx-visually-hidden" role="status" aria-live="polite">
        {notice}
      </p>
    </div>
  )
}

/* ================= wall card ================= */

const WallCard = memo(function WallCard({
  card,
  onOpen,
}: {
  card: Postcard
  onOpen: (c: Postcard, from: HTMLElement) => void
}) {
  const tilt = ((card.seed % 13) - 6) / 10 // -0.6 … 0.6 deg
  return (
    <li className="pcx-card" style={{ ['--tilt' as string]: `${tilt}deg` }}>
      <button
        type="button"
        className="pcx-card__btn"
        onClick={(e) => onOpen(card, e.currentTarget)}
        aria-label={`Open card ${card.accession}: ${card.title}, postmarked ${card.town} ${card.year}`}
      >
        <span className="pcx-card__artwrap">
          <CardArt card={card} />
          {card.reply && <span className="pcx-card__flag">↩ reply held</span>}
        </span>
        <span className="pcx-card__body">
          <span className="pcx-card__acc">{card.accession}</span>
          <span className="pcx-card__title">{card.title}</span>
          <span className="pcx-card__meta">
            {card.town} → {card.to} · {card.year} · {THEME_LABEL[card.theme]}
          </span>
        </span>
      </button>
    </li>
  )
})
