import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Woodcut, { WaxSeal } from './Woodcut'
import {
  PANTRY,
  BOXES,
  THEMES,
  CATEGORIES,
  itemById,
  aud,
  deliveryDays,
  longDate,
  FREE_DELIVERY_AT,
  FLAT_DELIVERY,
  CUTOFF_HOUR,
  type BoxId,
  type Category,
  type ThemeId,
} from './data'
import './demo.css'

/**
 * Tallow & Co. — Feast Box Builder.
 * A build-your-own providore box for the fictional Adelaide butcher-providore:
 * pick a crate size, fill slots from the pantry, let Frankie's themes pack it
 * for you, write a gift note, and choose from a genuinely honest delivery
 * calendar. Kraft paper, deep green ink, wax-seal red. Scoped under .tfb.
 */

interface BuildState {
  size: BoxId
  /** item ids — one entry per filled slot, order = slot order */
  lines: string[]
  note: string
  dateISO: string | null
}

const BUILD_KEY = 'tfb-build-v1'
const boxById = new Map(BOXES.map((b) => [b.id, b]))

function isBuild(v: unknown): v is BuildState {
  const b = v as BuildState
  return (
    !!b &&
    typeof b === 'object' &&
    boxById.has(b.size) &&
    Array.isArray(b.lines) &&
    b.lines.every((id) => typeof id === 'string' && itemById.has(id)) &&
    typeof b.note === 'string' &&
    (b.dateISO === null || typeof b.dateISO === 'string')
  )
}

function readBuild(): BuildState {
  const fallback: BuildState = { size: 'feast', lines: [], note: '', dateISO: null }
  try {
    if (typeof localStorage === 'undefined') return fallback
    const raw = localStorage.getItem(BUILD_KEY)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (!isBuild(parsed)) return fallback
    return { ...parsed, lines: parsed.lines.slice(0, boxById.get(parsed.size)!.slots) }
  } catch {
    return fallback
  }
}

export default function TallowFeastBuilder() {
  const [build, setBuild] = useState<BuildState>(readBuild)
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [drawer, setDrawer] = useState<'closed' | 'review' | 'done'>('closed')
  const [orderNo, setOrderNo] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  const triggerRef = useRef<HTMLElement | null>(null)

  const box = boxById.get(build.size)!
  const slots = box.slots

  useEffect(() => {
    try {
      localStorage.setItem(BUILD_KEY, JSON.stringify(build))
    } catch {
      /* the bench remembers even when the browser won't */
    }
  }, [build])

  const announce = useCallback((msg: string) => {
    setNotice('')
    requestAnimationFrame(() => setNotice(msg))
  }, [])

  /* ---------- box arithmetic ---------- */

  const tally = useMemo(() => {
    const items = build.lines.reduce((s, id) => s + itemById.get(id)!.price, 0)
    const itemsAndPacking = items + box.fee
    const delivery = itemsAndPacking >= FREE_DELIVERY_AT || build.lines.length === 0 ? 0 : FLAT_DELIVERY
    return { items, fee: box.fee, itemsAndPacking, delivery, total: itemsAndPacking + delivery, count: build.lines.length }
  }, [build.lines, box])

  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const id of build.lines) m.set(id, (m.get(id) ?? 0) + 1)
    return m
  }, [build.lines])

  const full = build.lines.length >= slots

  /* ---------- mutations ---------- */

  const changeSize = (size: BoxId) => {
    setBuild((prev) => {
      if (prev.size === size) return prev
      const nextSlots = boxById.get(size)!.slots
      const trimmed = prev.lines.slice(0, nextSlots)
      if (trimmed.length < prev.lines.length) {
        announce(`Switched to ${boxById.get(size)!.name} — ${prev.lines.length - trimmed.length} item${prev.lines.length - trimmed.length === 1 ? '' : 's'} came back off the board.`)
      } else {
        announce(`Switched to ${boxById.get(size)!.name}, ${nextSlots} slots.`)
      }
      return { ...prev, size, lines: trimmed }
    })
  }

  const addItem = useCallback(
    (id: string) => {
      setBuild((prev) => {
        if (prev.lines.length >= boxById.get(prev.size)!.slots) {
          announce('The crate is full. Take something off the board first.')
          return prev
        }
        const p = itemById.get(id)!
        const have = prev.lines.filter((x) => x === id).length
        if (have >= p.max) {
          announce(`Easy — we've put a cap of ${p.max} on the ${p.name}. Supply is real.`)
          return prev
        }
        announce(`Added ${p.name} to the crate.`)
        return { ...prev, lines: [...prev.lines, id] }
      })
    },
    [announce],
  )

  const removeOne = useCallback(
    (id: string, fromIndex = -1) => {
      setBuild((prev) => {
        let i =
          fromIndex >= 0 && prev.lines[fromIndex] === id
            ? fromIndex
            : prev.lines.lastIndexOf(id)
        if (i < 0) return prev
        const next = prev.lines.slice()
        next.splice(i, 1)
        announce(`Took the ${itemById.get(id)!.name} back off. No judgment.`)
        return { ...prev, lines: next }
      })
    },
    [announce],
  )

  const applyTheme = (theme: ThemeId) => {
    const t = THEMES.find((x) => x.id === theme)!
    setBuild((prev) => {
      const capacity = boxById.get(prev.size)!.slots - prev.lines.length
      if (capacity <= 0) {
        announce('The crate is full — Frankie refuses to squash the brie.')
        return prev
      }
      const next = prev.lines.slice()
      const have = new Map<string, number>()
      for (const id of next) have.set(id, (have.get(id) ?? 0) + 1)
      let added = 0
      for (const id of t.items) {
        if (added >= capacity) break
        const max = itemById.get(id)!.max
        if ((have.get(id) ?? 0) < max) {
          next.push(id)
          have.set(id, (have.get(id) ?? 0) + 1)
          added++
        }
      }
      announce(
        added > 0
          ? `${t.name}: Frankie packed ${added} item${added === 1 ? '' : 's'}. Swap anything — she's not precious.`
          : `${t.name}: nothing new to add — you've already out-picked her.`,
      )
      return { ...prev, lines: next }
    })
  }

  const clearCrate = () => {
    setBuild((prev) => ({ ...prev, lines: [] }))
    announce('Crate emptied. The pantry forgives you.')
  }

  /* ---------- drawer ---------- */

  const openDrawer = (from: HTMLElement) => {
    triggerRef.current = from
    setDrawer('review')
  }

  const closeDrawer = useCallback(() => {
    setDrawer('closed')
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (drawer === 'closed') return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [drawer, closeDrawer])

  const placeOrder = () => {
    setOrderNo(`TLW-${2000 + Math.floor(Math.random() * 8000)}`)
    setBuild({ size: build.size, lines: [], note: '', dateISO: null })
    setDrawer('done')
    announce('Order placed. It is on the manifest now.')
  }

  /* ---------- filtered pantry ---------- */

  const shown = useMemo(
    () => (cat === 'all' ? PANTRY : PANTRY.filter((p) => p.category === cat)),
    [cat],
  )

  const chalkItems = [
    'Cold room at 4°C',
    'Finocchiona going fast',
    'Pâté baked Friday',
    'Quince paste: Nonna’s batch No. 41',
    'The van leaves at 9 sharp',
    'Ask about the blue',
  ]

  return (
    <div className="tfb">
      <a className="tfb-skip" href="#tfb-pantry">
        Skip to the pantry
      </a>

      <header className="tfb-head">
        <a className="tfb-word" href="#tfb-top" aria-label="Tallow and Co. home">
          TALLOW <span aria-hidden="true">✶</span> CO.
        </a>
        <p className="tfb-linage">Butcher &amp; providore · Norwood, Adelaide · since 1987</p>
        <button
          type="button"
          className="tfb-boxbtn"
          onClick={(e) => openDrawer(e.currentTarget)}
          disabled={build.lines.length === 0}
          aria-label={`Review the box, ${tally.count} items, total ${aud(tally.total)}`}
        >
          The crate · {tally.count}
          {tally.count > 0 && <span className="tfb-boxbtn__sum">{aud(tally.total)}</span>}
        </button>
      </header>

      <main id="tfb-top">
        {/* ————— hero ————— */}
        <section className="tfb-hero">
          <div className="tfb-hero__text">
            <p className="tfb-eyebrow">Seasonal providore boxes · limited run of 250</p>
            <h1 className="tfb-h1">
              Build the box. <em>We’ll pack it like a regular’s watching.</em>
            </h1>
            <p className="tfb-lede">
              Pick a crate, fill it from the pantry — cheeses, smallgoods, preserves and something
              to pour — and tell us which day the van should stop at yours. Same arithmetic the
              counter uses. No surprises, no squashed brie.
            </p>
            <div className="tfb-themes" role="group" aria-label="Curator's choice — let Frankie pack it">
              <p className="tfb-themes__label">Curator’s choice — Frankie packs:</p>
              {THEMES.map((t) => (
                <button key={t.id} type="button" className="tfb-theme" onClick={() => applyTheme(t.id)} title={t.brief}>
                  <strong>{t.name}</strong>
                  <span>{t.brief}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="tfb-hero__seal" aria-hidden="true">
            <WaxSeal size={120} />
            <p className="tfb-hero__stampline">Est. 1987 · Third generation · The binder is gone</p>
          </div>
          <div className="tfb-chalk" aria-hidden="true">
            <div className="tfb-chalk__row">
              {[0, 1].map((half) => (
                <span key={half}>
                  {chalkItems.map((c, i) => (
                    <span key={i}>
                      {c} <b>✶</b>{' '}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ————— builder ————— */}
        <section className="tfb-builder" aria-label="Build your box">
          <div className="tfb-bench">
            <SizePicker size={build.size} onChange={changeSize} />

            <div className="tfb-crate" role="group" aria-label={`Your crate — ${box.name}, ${tally.count} of ${slots} slots filled`}>
              <div className="tfb-crate__branding" aria-hidden="true">
                <span>TALLOW &amp; CO.</span>
                <span>· PROVIDORE ·</span>
                <span>NORWOOD</span>
              </div>
              <ul className="tfb-slots" data-slots={slots}>
                {Array.from({ length: slots }, (_, i) => {
                  const id = build.lines[i]
                  if (!id) {
                    return (
                      <li key={`e${i}-${slots}`} className="tfb-slot tfb-slot--empty" aria-hidden="true">
                        <span>—</span>
                      </li>
                    )
                  }
                  const p = itemById.get(id)!
                  return (
                    <li key={`f${i}-${id}`} className="tfb-slot tfb-slot--filled" style={{ '--i': i } as CSSProperties}>
                      <button
                        type="button"
                        onClick={() => removeOne(id, i)}
                        aria-label={`Remove ${p.name} from the crate`}
                        title={`${p.name} — remove`}
                      >
                        <Woodcut kind={p.icon} size={30} />
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className="tfb-crate__front" aria-hidden="true">
                <span className="tfb-crate__stamp">{full ? 'PACKED ✶ SEALED' : 'PACKED TO ORDER'}</span>
              </div>
              {full && (
                <div className="tfb-crate__seal">
                  <WaxSeal size={54} />
                </div>
              )}
            </div>

            <div
              className="tfb-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={slots}
              aria-valuenow={tally.count}
              aria-label={`${tally.count} of ${slots} slots packed`}
            >
              <i style={{ width: `${(tally.count / slots) * 100}%` }} />
            </div>
            <p className="tfb-progress__label">
              <strong>{tally.count} of {slots}</strong> packed
              {full ? ' — the lid is on.' : ` — ${slots - tally.count} slot${slots - tally.count === 1 ? '' : 's'} still free.`}
              {build.lines.length > 0 && (
                <button type="button" className="tfb-clearlink" onClick={clearCrate}>
                  Empty the crate
                </button>
              )}
            </p>

            <dl className="tfb-tally">
              <div>
                <dt>Provisions</dt>
                <dd>{aud(tally.items)}</dd>
              </div>
              <div>
                <dt>Crate, board &amp; wrap</dt>
                <dd>{aud(tally.fee)}</dd>
              </div>
              <div>
                <dt>Van run</dt>
                <dd>
                  {tally.delivery === 0 ? (
                    tally.count > 0 ? (
                      <em>On us</em>
                    ) : (
                      aud(0)
                    )
                  ) : (
                    aud(tally.delivery)
                  )}
                </dd>
              </div>
              <div className="tfb-tally__grand">
                <dt>Total on the ticket</dt>
                <dd>{aud(tally.total)}</dd>
              </div>
            </dl>
            {tally.count > 0 && tally.itemsAndPacking < FREE_DELIVERY_AT && (
              <p className="tfb-shiphint">
                Add {aud(FREE_DELIVERY_AT - tally.itemsAndPacking)} more and the van run is on us.
              </p>
            )}

            <button
              type="button"
              className="tfb-review"
              disabled={build.lines.length === 0}
              onClick={(e) => openDrawer(e.currentTarget)}
            >
              Review &amp; send to the counter →
            </button>
            {build.lines.length === 0 && (
              <p className="tfb-review__hint">Add something from the pantry and this lights up.</p>
            )}
          </div>

          <div className="tfb-pantry" id="tfb-pantry">
            <div className="tfb-pantry__bar" role="group" aria-label="Filter the pantry">
              <button type="button" className="tfb-chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
                Whole pantry <sup>{PANTRY.length}</sup>
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="tfb-chip"
                  aria-pressed={cat === c.id}
                  onClick={() => setCat(c.id)}
                >
                  {c.label} <sup>{PANTRY.filter((p) => p.category === c.id).length}</sup>
                </button>
              ))}
            </div>

            <ul className="tfb-grid">
              {shown.map((p) => {
                const inBox = counts.get(p.id) ?? 0
                const capped = inBox >= p.max
                return (
                  <li key={p.id} className="tfb-card" data-in={inBox > 0 || undefined}>
                    <div className="tfb-card__art" aria-hidden="true">
                      <Woodcut kind={p.icon} size={44} />
                      <span className="tfb-card__weight">{p.weight}</span>
                    </div>
                    <div className="tfb-card__body">
                      <h3>{p.name}</h3>
                      <p className="tfb-card__maker">{p.maker}</p>
                      <p className="tfb-card__note">“{p.note}”</p>
                    </div>
                    <div className="tfb-card__foot">
                      <span className="tfb-card__price">{aud(p.price)}</span>
                      {inBox === 0 ? (
                        <button
                          type="button"
                          className="tfb-add"
                          onClick={() => addItem(p.id)}
                          disabled={full}
                          aria-label={full ? `Add ${p.name} — the crate is full` : `Add ${p.name} to the crate`}
                        >
                          {full ? 'Crate full' : 'In the box →'}
                        </button>
                      ) : (
                        <div className="tfb-stepper" aria-label={`${p.name} in the crate: ${inBox}`}>
                          <button type="button" onClick={() => removeOne(p.id)} aria-label={`Remove one ${p.name}`}>
                            −
                          </button>
                          <span aria-live="polite">×{inBox}</span>
                          <button
                            type="button"
                            onClick={() => addItem(p.id)}
                            disabled={capped || full}
                            aria-label={`Add one more ${p.name}`}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* ————— finishing touches ————— */}
        <section className="tfb-finish" aria-label="Finishing touches">
          <NoteComposer
            note={build.note}
            onChange={(note) => setBuild((prev) => ({ ...prev, note }))}
            announce={announce}
          />
          <DateRail
            dateISO={build.dateISO}
            onPick={(iso) => {
              setBuild((prev) => ({ ...prev, dateISO: iso }))
              announce(iso ? `Delivery booked for ${longDate(iso)}.` : '')
            }}
          />
        </section>

        {/* ————— the promise ————— */}
        <section className="tfb-promise">
          <h2 className="tfb-h2">
            <em>The manifest is honest.</em> The binder is gone; the arithmetic stayed.
          </h2>
          <ul className="tfb-facts">
            <li>
              <strong>2:00 pm cutoff, genuinely.</strong> Order after two and the earliest van is the
              day after next. The picker shows you, not the fine print.
            </li>
            <li>
              <strong>The shop rests Sunday &amp; Monday.</strong> The cold room gets scrubbed; the
              people get a weekend. Those days are greyed out, always.
            </li>
            <li>
              <strong>Caps on the rare stuff.</strong> Two per crate on the small-batch things, so the
              regulars don’t riot. The counter rule, digitised.
            </li>
            <li>
              <strong>Free van run at {aud(FREE_DELIVERY_AT)}.</strong> Flat {aud(FLAT_DELIVERY)} under
              that, inside Norwood and the near suburbs.
            </li>
          </ul>
        </section>
      </main>

      <footer className="tfb-foot">
        <p>
          <strong>Tallow &amp; Co.</strong> — a fictional providore. Demo storefront by Brassfern; the
          van, sadly, is also fictional.
        </p>
        <p className="tfb-foot__mono">Shop · 1 The Parade, Norwood SA · Tue–Sat · The binder: 1987–2024, RIP</p>
      </footer>

      {drawer !== 'closed' && (
        <OrderDrawer
          mode={drawer}
          build={build}
          box={box}
          tally={tally}
          counts={counts}
          orderNo={orderNo}
          onClose={closeDrawer}
          onRemove={removeOne}
          onPlace={placeOrder}
        />
      )}

      <p className="tfb-visually-hidden" role="status" aria-live="polite">
        {notice}
      </p>
    </div>
  )
}

/* ================= size picker ================= */

function SizePicker({ size, onChange }: { size: BoxId; onChange: (s: BoxId) => void }) {
  return (
    <fieldset className="tfb-sizes">
      <legend>Pick your crate</legend>
      <div className="tfb-sizes__row">
        {BOXES.map((b) => (
          <label key={b.id} className="tfb-size" data-on={size === b.id || undefined}>
            <input
              type="radio"
              name="tfb-size"
              checked={size === b.id}
              onChange={() => onChange(b.id)}
            />
            <span className="tfb-size__name">{b.name}</span>
            <span className="tfb-size__meta">
              {b.slots} slots · {b.feeds.toLowerCase()}
            </span>
            <span className="tfb-size__desc">{b.blurb}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/* ================= gift note ================= */

function NoteComposer({
  note,
  onChange,
}: {
  note: string
  onChange: (note: string) => void
  announce: (m: string) => void
}) {
  const MAX = 200
  return (
    <div className="tfb-note">
      <p className="tfb-eyebrow">Finishing touch № 1</p>
      <h2 className="tfb-h2">A note on the ticket.</h2>
      <p className="tfb-finish__intro">
        Written by hand, pinned under the twine, sealed with wax. Frankie’s handwriting is
        genuinely terrible; the sentiment survives.
      </p>
      <label className="tfb-field">
        <span className="tfb-visually-hidden">Your gift note</span>
        <textarea
          value={note}
          maxLength={MAX}
          rows={4}
          placeholder="e.g. Happy 40th, Marg — the blue one is for you. Share it."
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="tfb-field__count" aria-hidden="true">
          {note.length}/{MAX}
        </span>
      </label>
      <div className="tfb-ticket" aria-label={note.trim() ? `Ticket preview: ${note}` : 'Ticket preview — empty'}>
        <p className="tfb-ticket__head">FROM THE COUNTER ✶ TALLOW &amp; CO.</p>
        <p className="tfb-ticket__body">{note.trim() ? `“${note.trim()}”` : '— your words here —'}</p>
        <p className="tfb-ticket__foot">Packed by F. Tallow · Stay cold, stay kind</p>
        <div className="tfb-ticket__seal" aria-hidden="true">
          <WaxSeal size={44} />
        </div>
      </div>
    </div>
  )
}

/* ================= delivery date rail ================= */

function DateRail({ dateISO, onPick }: { dateISO: string | null; onPick: (iso: string | null) => void }) {
  const { days, beforeCutoff } = useMemo(() => deliveryDays(14), [])
  const firstFree = days.find((d) => !d.closed)
  const chosenMissing = dateISO && !days.some((d) => d.iso === dateISO && !d.closed)
  return (
    <div className="tfb-date">
      <p className="tfb-eyebrow">Finishing touch № 2</p>
      <h2 className="tfb-h2">Book the van.</h2>
      <p className="tfb-finish__intro">
        It’s {beforeCutoff ? 'before' : 'past'} the {CUTOFF_HOUR - 12}:00 pm cutoff, so the earliest
        run is <strong>{firstFree ? firstFree.label : '—'}</strong>. Sundays and Mondays the shop
        rests — the calendar says so out loud.
      </p>
      {chosenMissing && (
        <p className="tfb-date__stale" role="note">
          Your earlier date has sailed past the cutoff — pick a fresh one.
        </p>
      )}
      <ul className="tfb-days" role="listbox" aria-label="Delivery days">
        {days.map((d) => {
          const sel = d.iso === dateISO
          return (
            <li key={d.iso} role="presentation">
              <button
                type="button"
                id={`tfb-day-${d.iso}`}
                className="tfb-day"
                role="option"
                aria-selected={sel}
                disabled={d.closed}
                onClick={() => onPick(sel ? null : d.iso)}
                title={d.closed ? `${d.label} — the shop rests` : d.label}
              >
                <span className="tfb-day__stamp">{d.stamp}</span>
                <span className="tfb-day__num">{d.date.getDate()}</span>
                <span className="tfb-day__state">{d.closed ? 'resting' : sel ? 'booked' : 'open'}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="tfb-date__chosen" aria-live="polite">
        {dateISO && !chosenMissing ? (
          <>
            Van booked: <strong>{longDate(dateISO)}</strong>, between 9 and 1. We SMS when it’s cut,
            wrapped and loaded.
          </>
        ) : (
          'No day booked yet — tap an open one.'
        )}
      </p>
    </div>
  )
}

/* ================= order drawer ================= */

function OrderDrawer({
  mode,
  build,
  box,
  tally,
  counts,
  orderNo,
  onClose,
  onRemove,
  onPlace,
}: {
  mode: 'review' | 'done'
  build: BuildState
  box: (typeof BOXES)[number]
  tally: { items: number; fee: number; itemsAndPacking: number; delivery: number; total: number; count: number }
  counts: Map<string, number>
  orderNo: string | null
  onClose: () => void
  onRemove: (id: string) => void
  onPlace: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const grouped = useMemo(() => {
    return Array.from(counts.entries())
      .map(([id, qty]) => ({ item: itemById.get(id)!, qty, firstIdx: build.lines.indexOf(id) }))
      .sort((a, b) => a.firstIdx - b.firstIdx)
  }, [counts, build.lines])

  const ready = tally.count > 0 && !!build.dateISO

  return (
    <div className="tfb-overlay" onClick={onClose}>
      <aside
        className="tfb-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'done' ? 'Order confirmed' : 'Review your box'}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="tfb-drawer__head">
          <h2>{mode === 'done' ? 'On the manifest.' : `The ticket · ${box.name}`}</h2>
          <button type="button" ref={closeRef} className="tfb-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        {mode === 'done' ? (
          <div className="tfb-done">
            <WaxSeal size={88} />
            <p>
              <strong>Order {orderNo}</strong> is pinned to the bench.
            </p>
            <p>
              Frankie packs it the morning it ships, writes your note in her worst handwriting, and
              the van does its lap between 9 and 1. You’ll get one SMS — shipped, not marketed to.
            </p>
            <button type="button" className="tfb-btn" onClick={onClose}>
              Back to the bench
            </button>
          </div>
        ) : (
          <>
            {tally.count === 0 ? (
              <div className="tfb-empty">
                <p>
                  <strong>The crate is empty.</strong> The pantry is not.
                </p>
                <button type="button" className="tfb-btn tfb-btn--bare" onClick={onClose}>
                  Back to the pantry
                </button>
              </div>
            ) : (
              <>
                <ul className="tfb-lines">
                  {grouped.map(({ item, qty }) => (
                    <li key={item.id} className="tfb-line">
                      <span className="tfb-line__art" aria-hidden="true">
                        <Woodcut kind={item.icon} size={30} />
                      </span>
                      <span className="tfb-line__info">
                        <strong>{item.name}</strong>
                        <em>
                          {item.weight} · {qty > 1 ? `${qty} in the crate` : 'one in the crate'}
                        </em>
                      </span>
                      <span className="tfb-line__price">{aud(item.price * qty)}</span>
                      <button
                        type="button"
                        className="tfb-line__rm"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remove one ${item.name}`}
                      >
                        −
                      </button>
                    </li>
                  ))}
                </ul>

                {build.note.trim() && (
                  <div className="tfb-notechip">
                    <strong>On the ticket:</strong> “{build.note.trim()}”
                  </div>
                )}

                <div className="tfb-drawer__date">
                  {build.dateISO ? (
                    <>
                      Van run: <strong>{longDate(build.dateISO)}</strong>, 9–1.
                    </>
                  ) : (
                    <>
                      <strong>No delivery day booked.</strong> Pick one at “Book the van” before you
                      send it through.
                    </>
                  )}
                </div>

                <dl className="tfb-tally tfb-tally--drawer">
                  <div>
                    <dt>Provisions</dt>
                    <dd>{aud(tally.items)}</dd>
                  </div>
                  <div>
                    <dt>Crate, board &amp; wrap</dt>
                    <dd>{aud(tally.fee)}</dd>
                  </div>
                  <div>
                    <dt>Van run</dt>
                    <dd>{tally.delivery === 0 ? <em>On us</em> : aud(tally.delivery)}</dd>
                  </div>
                  <div className="tfb-tally__grand">
                    <dt>Total on the ticket</dt>
                    <dd>{aud(tally.total)}</dd>
                  </div>
                </dl>

                <button type="button" className="tfb-place" disabled={!ready} onClick={onPlace}>
                  {ready ? 'Send it to the counter →' : 'Book a delivery day first'}
                </button>
                <p className="tfb-place__hint">
                  Pay on pickup or by link when it ships — nobody types a card number into a demo.
                </p>
              </>
            )}
          </>
        )}
      </aside>
    </div>
  )
}
