import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ALL_BENEFITS,
  CATEGORY_LABELS,
  FORMULA_BY_ID,
  INGREDIENTS,
  INGREDIENT_BY_ID,
  conflictsBetween,
  decodeRoutine,
  encodeRoutine,
  ingredientIdsOf,
  routineToText,
  type Category,
  type Ingredient,
} from './data'
import Sheet, { EvidenceDots } from './Sheet'
import Formulas from './Formulas'
import Routine, { type SavedRitual, type Step } from './Routine'
import './demo.css'

/**
 * GLADE Rituals — the fictional Melbourne skincare house's ingredient-honesty
 * explorer. A searchable, evidence-rated index of 46 ingredients; eight fully
 * disclosed formulations with a radar-card comparison; and a morning/evening
 * routine builder wired to a conflict ledger. Working routines persist to
 * localStorage, save to a named library, share via URL hash and export as
 * text. Apothecary restraint: bone paper, sage, terracotta; serif names and
 * mono INCI. Scoped under .gix.
 */

const WORK_KEY = 'gix-working-v1'
const LIB_KEY = 'gix-library-v1'

type View = 'index' | 'formulas' | 'routine'

interface WorkingRoutine {
  am: string[]
  pm: string[]
}

let uidCounter = 0
const uid = () => `s${Date.now().toString(36)}${(uidCounter++).toString(36)}`

const toSteps = (ids: string[]): Step[] => ids.filter((id) => FORMULA_BY_ID.has(id)).map((formulaId) => ({ key: uid(), formulaId }))

function readWorking(): WorkingRoutine {
  // A shared link in the URL hash beats local storage.
  if (typeof location !== 'undefined' && location.hash.startsWith('#r=')) {
    const shared = decodeRoutine(location.hash.slice(3))
    if (shared) return shared
  }
  try {
    const raw = localStorage.getItem(WORK_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as WorkingRoutine
      if (Array.isArray(parsed.am) && Array.isArray(parsed.pm)) {
        return { am: parsed.am.filter((id) => FORMULA_BY_ID.has(id)), pm: parsed.pm.filter((id) => FORMULA_BY_ID.has(id)) }
      }
    }
  } catch {
    /* blocked storage — session-only mode */
  }
  return { am: [], pm: [] }
}

function readLibrary(): SavedRitual[] {
  try {
    const raw = localStorage.getItem(LIB_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedRitual[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (r) => r && typeof r.name === 'string' && Array.isArray(r.am) && Array.isArray(r.pm) && r.am.every((id) => FORMULA_BY_ID.has(id)) && r.pm.every((id) => FORMULA_BY_ID.has(id)),
    )
  } catch {
    return []
  }
}

const TIME_BADGE: Record<Ingredient['time'], string> = { am: 'AM', pm: 'PM', both: 'AM·PM' }

export default function GladeIngredientExplorer() {
  const [view, setView] = useState<View>('index')
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [benefit, setBenefit] = useState<string | 'all'>('all')
  const [openIng, setOpenIng] = useState<string | null>(null)
  const [compareA, setCompareA] = useState('morning-proof')
  const [compareB, setCompareB] = useState('plot-nine')
  const [am, setAm] = useState<Step[]>(() => toSteps(readWorking().am))
  const [pm, setPm] = useState<Step[]>(() => toSteps(readWorking().pm))
  const [saved, setSaved] = useState<SavedRitual[]>(readLibrary)
  const [toast, setToast] = useState('')

  const amIds = useMemo(() => am.map((s) => s.formulaId), [am])
  const pmIds = useMemo(() => pm.map((s) => s.formulaId), [pm])

  const conflictCount = useMemo(() => {
    const hits = [...conflictsBetween(ingredientIdsOf(amIds)), ...conflictsBetween(ingredientIdsOf(pmIds))]
    return hits.filter((h) => h.severity !== 'fine').length
  }, [amIds, pmIds])

  // Persist working routine + welcome shared links.
  useEffect(() => {
    try {
      localStorage.setItem(WORK_KEY, JSON.stringify({ am: amIds, pm: pmIds }))
    } catch {
      /* session-only mode */
    }
  }, [amIds, pmIds])

  useEffect(() => {
    if (typeof location !== 'undefined' && location.hash.startsWith('#r=')) {
      announce('Shared ritual loaded from link.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const announce = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast((t) => (t === msg ? '' : t)), 3600)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return INGREDIENTS.filter((ing) => {
      if (cat !== 'all' && ing.category !== cat) return false
      if (benefit !== 'all' && !ing.benefits.includes(benefit)) return false
      if (!q) return true
      return (
        ing.name.toLowerCase().includes(q) ||
        ing.inci.toLowerCase().includes(q) ||
        ing.does.toLowerCase().includes(q) ||
        ing.benefits.some((b) => b.includes(q))
      )
    })
  }, [query, cat, benefit])

  // ── Routine actions ────────────────────────────────────────────────

  const addStep = useCallback(
    (formulaId: string, when: 'am' | 'pm') => {
      const f = FORMULA_BY_ID.get(formulaId)
      if (!f) return
      const step = { key: uid(), formulaId }
      if (when === 'am') setAm((s) => [...s, step])
      else setPm((s) => [...s, step])
      announce(`${f.name} added to ${when === 'am' ? 'morning' : 'evening'} ritual.`)
    },
    [announce],
  )

  const moveStep = useCallback((when: 'am' | 'pm', index: number, dir: -1 | 1) => {
    const set = when === 'am' ? setAm : setPm
    set((steps) => {
      const next = [...steps]
      const j = index + dir
      if (j < 0 || j >= next.length) return steps
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
  }, [])

  const removeStep = useCallback(
    (when: 'am' | 'pm', index: number) => {
      const set = when === 'am' ? setAm : setPm
      set((steps) => steps.filter((_, i) => i !== index))
      announce('Step removed.')
    },
    [announce],
  )

  const saveRitual = useCallback(
    (name: string) => {
      const ritual: SavedRitual = {
        id: uid(),
        name: name.slice(0, 60),
        am: amIds,
        pm: pmIds,
        savedAt: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }),
      }
      setSaved((list) => {
        const next = [ritual, ...list].slice(0, 12)
        try {
          localStorage.setItem(LIB_KEY, JSON.stringify(next))
        } catch {
          /* session-only mode */
        }
        return next
      })
      announce(`Saved “${ritual.name}” to your library.`)
    },
    [amIds, pmIds, announce],
  )

  const loadRitual = useCallback(
    (r: SavedRitual) => {
      setAm(toSteps(r.am))
      setPm(toSteps(r.pm))
      announce(`Loaded “${r.name}”.`)
    },
    [announce],
  )

  const deleteRitual = useCallback(
    (id: string) => {
      setSaved((list) => {
        const next = list.filter((r) => r.id !== id)
        try {
          localStorage.setItem(LIB_KEY, JSON.stringify(next))
        } catch {
          /* session-only mode */
        }
        return next
      })
      announce('Ritual deleted.')
    },
    [announce],
  )

  const shareRoutine = useCallback(() => {
    const url = `${location.origin}${location.pathname}${location.search}#r=${encodeRoutine({ am: amIds, pm: pmIds })}`
    const done = () => announce('Share link copied — the ritual travels in the URL.')
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(done, () => announce(url))
    else announce(url)
  }, [amIds, pmIds, announce])

  const exportRoutine = useCallback(() => {
    const name = saved[0]?.name ?? 'Current ritual'
    const text = routineToText(name, amIds, pmIds)
    const done = () => announce('Ritual copied as text — ledger included.')
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, () => announce(text))
    else announce(text)
  }, [amIds, pmIds, saved, announce])

  const loadStarter = useCallback(() => {
    setAm(toSteps(['field-notes', 'morning-proof', 'hedgerow', 'field-day']))
    setPm(toSteps(['field-notes', 'night-margin', 'hedgerow']))
    announce('Starter ritual loaded — four AM, three PM, zero conflicts.')
  }, [announce])

  const clearRoutine = useCallback(() => {
    setAm([])
    setPm([])
    announce('Ritual cleared.')
  }, [announce])

  const openIngredient = useCallback((id: string) => {
    if (INGREDIENT_BY_ID.has(id)) setOpenIng(id)
  }, [])

  const sheetIng = openIng ? INGREDIENT_BY_ID.get(openIng) : undefined

  return (
    <div className="gix">
      <a className="gix-skip" href="#gix-main">
        Skip to content
      </a>

      <header className="gix-head">
        <div className="gix-head__brand">
          <p className="gix-wordmark">
            GLADE<span aria-hidden="true"> ✳</span>
          </p>
          <p className="gix-head__tag">Rituals — every ingredient, indexed</p>
        </div>
        <nav className="gix-tabs" aria-label="Sections">
          {(
            [
              ['index', 'Ingredient index'],
              ['formulas', 'Formulations'],
              ['routine', `Routine${am.length + pm.length ? ` (${am.length + pm.length})` : ''}`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={view === id ? 'gix-tab gix-tab--on' : 'gix-tab'}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {label}
              {id === 'routine' && conflictCount > 0 && <span className="gix-tab__alert" aria-label={`${conflictCount} conflicts`} />}
            </button>
          ))}
        </nav>
      </header>

      <main className="gix-main" id="gix-main">
        {view === 'index' && (
          <section aria-label="Ingredient index">
            <div className="gix-intro">
              <h1 className="gix-h1">
                The ingredient ledger — <em>{INGREDIENTS.length} entries,</em> nothing hiding behind Latin.
              </h1>
              <p className="gix-intro__sub">
                Search anything. Every entry carries its honest concentration band, an evidence rating and its place in the
                conflict ledger — the notebook the industry keeps in the drawer.
              </p>
            </div>

            <div className="gix-toolbar">
              <label className="gix-search">
                <span className="gix-sr">Search ingredients</span>
                <input
                  className="gix-input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, INCI, or concern — try “redness”"
                />
              </label>
              <div className="gix-chips" role="group" aria-label="Filter by category">
                <button type="button" className={cat === 'all' ? 'gix-chip gix-chip--on' : 'gix-chip'} aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
                  All
                </button>
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
                  <button key={c} type="button" className={cat === c ? 'gix-chip gix-chip--on' : 'gix-chip'} aria-pressed={cat === c} onClick={() => setCat(c)}>
                    {CATEGORY_LABELS[c]}
                  </button>
                ))}
              </div>
              <div className="gix-chips gix-chips--benefits" role="group" aria-label="Filter by what it actually does">
                <span className="gix-chips__label">Helps with</span>
                <button type="button" className={benefit === 'all' ? 'gix-chip gix-chip--on' : 'gix-chip'} aria-pressed={benefit === 'all'} onClick={() => setBenefit('all')}>
                  Anything
                </button>
                {ALL_BENEFITS.map((b) => (
                  <button key={b} type="button" className={benefit === b ? 'gix-chip gix-chip--on' : 'gix-chip'} aria-pressed={benefit === b} onClick={() => setBenefit(b)}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <p className="gix-count" role="status">
              {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
            </p>

            {filtered.length ? (
              <ul className="gix-grid">
                {filtered.map((ing) => (
                  <li key={ing.id}>
                    <button type="button" className="gix-card" onClick={() => setOpenIng(ing.id)}>
                      <span className="gix-card__top">
                        <span className="gix-card__cat">{CATEGORY_LABELS[ing.category]}</span>
                        <span className="gix-card__time">{TIME_BADGE[ing.time]}</span>
                      </span>
                      <span className="gix-card__name">{ing.name}</span>
                      <span className="gix-card__inci">{ing.inci}</span>
                      <span className="gix-card__does">{ing.does}</span>
                      <span className="gix-card__foot">
                        <span className="gix-card__band">{ing.band}</span>
                        <EvidenceDots n={ing.evidence} small />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="gix-none">
                <p className="gix-none__title">Nothing in the ledger matches.</p>
                <p>Try a broader word — “calm”, “spots”, “water”. Or clear the filters.</p>
                <button
                  type="button"
                  className="gix-btn gix-btn--small gix-btn--ghost"
                  onClick={() => {
                    setQuery('')
                    setCat('all')
                    setBenefit('all')
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}

        {view === 'formulas' && (
          <Formulas
            compareA={compareA}
            compareB={compareB}
            onCompare={(slot, id) => (slot === 'a' ? setCompareA(id) : setCompareB(id))}
            onAdd={addStep}
            onOpenIngredient={openIngredient}
          />
        )}

        {view === 'routine' && (
          <Routine
            am={am}
            pm={pm}
            saved={saved}
            onMove={moveStep}
            onRemove={removeStep}
            onAdd={addStep}
            onSave={saveRitual}
            onLoad={loadRitual}
            onDelete={deleteRitual}
            onShare={shareRoutine}
            onExport={exportRoutine}
            onStarter={loadStarter}
            onClear={clearRoutine}
          />
        )}
      </main>

      <footer className="gix-foot">
        <p>
          GLADE is a fictional skincare house built by Brassfern. Every percentage, study and herb is illustrative — wear
          real sunscreen.
        </p>
      </footer>

      {sheetIng && <Sheet ingredient={sheetIng} onClose={() => setOpenIng(null)} onOpen={openIngredient} />}

      <div className="gix-toast" role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  )
}
