import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import './demo.css'
import { Avatar } from './Avatar'
import { Drawer } from './Drawer'
import {
  LABELS,
  PEOPLE,
  PRIORITIES,
  dueLabel,
  loadState,
  personById,
  saveState,
  seedState,
  uid,
  type BoardState,
  type Card,
  type Priority,
} from './data'

/**
 * Switchyard — kanban board for a fictional rail-ops scheduling SaaS.
 * Art direction: signal box. Cream paper, ink-black type, telegraph-wire
 * rules, tabular mono card numbers. Safety orange appears for one thing
 * only: a column over its WIP limit.
 *
 * Interaction contract: pointer drag-and-drop is the fast path, never the
 * only one. Every card is keyboard-focusable (roving tabindex), arrows move
 * focus, Shift+arrows shuttle the card itself, Enter opens the record,
 * A inserts below. Everything is announced through a polite live region.
 * State persists to localStorage; "reset demo data" restores the seed.
 */

// ------------------------------------------------------------------ reducer

type Action =
  | { type: 'reset' }
  | {
      type: 'move'
      cardId: string
      toCol: string
      after: string | null
      before: string | null
      priority?: Priority
      note: string
      now: string
    }
  | {
      type: 'add'
      colId: string
      after: string | null
      title: string
      priority: Priority
      now: string
    }
  | { type: 'patch'; cardId: string; patch: Partial<Card>; note?: string; now: string }
  | { type: 'remove'; cardId: string }
  | { type: 'restore'; card: Card; now: string }
  | { type: 'renameCol'; colId: string; name: string }
  | { type: 'lanes'; on: boolean }

/** Order value for a card inserted between two neighbours in a column. */
function orderFor(state: BoardState, colId: string, after: string | null, before: string | null): number {
  const colCards = state.cards.filter((c) => c.columnId === colId)
  const afterCard = after ? colCards.find((c) => c.id === after) : undefined
  const beforeCard = before ? colCards.find((c) => c.id === before) : undefined
  if (afterCard && beforeCard) return (afterCard.order + beforeCard.order) / 2
  if (beforeCard) return beforeCard.order - 1
  if (afterCard) return afterCard.order + 1
  return colCards.reduce((m, c) => Math.max(m, c.order), 0) + 1
}

function reduce(state: BoardState, a: Action): BoardState {
  switch (a.type) {
    case 'reset':
      return seedState()
    case 'move': {
      const card = state.cards.find((c) => c.id === a.cardId)
      if (!card) return state
      const order = orderFor(state, a.toCol, a.after, a.before)
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === a.cardId
            ? {
                ...c,
                columnId: a.toCol,
                priority: a.priority ?? c.priority,
                order,
                activity: [...c.activity, { id: uid('a'), at: a.now, text: a.note }],
              }
            : c,
        ),
      }
    }
    case 'add': {
      const seq = state.nextSeq
      const colCards = state.cards
        .filter((c) => c.columnId === a.colId)
        .sort((x, y) => x.order - y.order)
      let order: number
      if (a.after) {
        const i = colCards.findIndex((c) => c.id === a.after)
        const prev = colCards[i]
        const next = i >= 0 ? colCards[i + 1] : undefined
        order = prev ? (next ? (prev.order + next.order) / 2 : prev.order + 1) : colCards.length ? colCards[colCards.length - 1].order + 1 : 1
      } else {
        order = colCards.length ? colCards[colCards.length - 1].order + 1 : 1
      }
      const card: Card = {
        id: `SW-${seq}`,
        title: a.title,
        desc: '',
        columnId: a.colId,
        order,
        assignee: null,
        labels: [],
        priority: a.priority,
        checklist: [],
        activity: [{ id: uid('a'), at: a.now, text: 'Written on the board.' }],
        due: null,
      }
      return { ...state, nextSeq: seq + 1, cards: [...state.cards, card] }
    }
    case 'patch':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === a.cardId
            ? {
                ...c,
                ...a.patch,
                activity: a.note
                  ? [...c.activity, { id: uid('a'), at: a.now, text: a.note }]
                  : c.activity,
              }
            : c,
        ),
      }
    case 'remove':
      return { ...state, cards: state.cards.filter((c) => c.id !== a.cardId) }
    case 'restore':
      return { ...state, cards: [...state.cards, a.card] }
    case 'renameCol':
      return {
        ...state,
        columns: state.columns.map((col) => (col.id === a.colId ? { ...col, name: a.name } : col)),
      }
    case 'lanes':
      return { ...state, lanes: a.on }
  }
}

// ------------------------------------------------------------------ drag model

interface DragState {
  cardId: string
  colId: string
  x: number
  y: number
  dx: number // grab offset inside the card
  dy: number
  w: number
  h: number
  originIndex: number // slot the card came from, in the visible list excluding itself
  target: { colId: string; index: number } | null
}

interface PendingGrab {
  cardId: string
  pointerId: number
  startX: number
  startY: number
  dx: number
  dy: number
  w: number
  h: number
}

const TAP_ONLY = (el: EventTarget | null): boolean =>
  el instanceof Element && !!el.closest('button, a, input, select, textarea, [data-nodrag]')

// ------------------------------------------------------------------ component

export default function SwitchyardKanban() {
  const [state, dispatch] = useReducer(reduce, undefined, loadState)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)
  const [labelFilter, setLabelFilter] = useState<string[]>([])
  const [openCardId, setOpenCardId] = useState<string | null>(null)
  const [composer, setComposer] = useState<{ colId: string; after: string | null } | null>(null)
  const [composerTitle, setComposerTitle] = useState('')
  const [composerPriority, setComposerPriority] = useState<Priority>('local')
  const [renamingCol, setRenamingCol] = useState<string | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [toast, setToast] = useState<{ card: Card } | null>(null)
  const [scrollPos, setScrollPos] = useState(0)

  const liveRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const colRefs = useRef(new Map<string, HTMLElement>())
  const cardRefs = useRef(new Map<string, HTMLElement>())
  const pendingFocus = useRef<string | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const grabRef = useRef<PendingGrab | null>(null)
  const rafRef = useRef(0)
  const cleanupRef = useRef<(() => void) | null>(null)
  const toastTimer = useRef<number>(0)
  const composerInputRef = useRef<HTMLInputElement>(null)

  // persist
  useEffect(() => saveState(state), [state])

  const announce = useCallback((msg: string) => {
    const el = liveRef.current
    if (!el) return
    el.textContent = ''
    window.setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = msg
    }, 40)
  }, [])

  // deferred focus after a re-render
  useLayoutEffect(() => {
    const id = pendingFocus.current
    if (!id) return
    pendingFocus.current = null
    cardRefs.current.get(id)?.focus()
  })

  useEffect(() => {
    if (composer) composerInputRef.current?.focus()
  }, [composer])

  useEffect(() => () => {
    cleanupRef.current?.()
    window.clearTimeout(toastTimer.current)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  // -------------------------------------------------------------- derived

  const colName = (id: string): string => state.columns.find((c) => c.id === id)?.name ?? id

  const matches = useCallback(
    (c: Card): boolean => {
      if (assigneeFilter && c.assignee !== assigneeFilter) return false
      return labelFilter.every((l) => c.labels.includes(l))
    },
    [assigneeFilter, labelFilter],
  )

  /** Visible cards in a column, honouring filters and lane grouping. */
  const visibleOf = useCallback(
    (colId: string): Card[] => {
      const list = state.cards.filter((c) => c.columnId === colId && matches(c))
      list.sort(
        state.lanes
          ? (x, y) => PRIORITIES[x.priority].rank - PRIORITIES[y.priority].rank || x.order - y.order
          : (x, y) => x.order - y.order,
      )
      return list
    },
    [state.cards, state.lanes, matches],
  )

  const allInCol = (colId: string): Card[] => state.cards.filter((c) => c.columnId === colId)
  const breachCols = state.columns.filter((col) => col.limit != null && allInCol(col.id).length > col.limit)

  // -------------------------------------------------------------- moves

  const nowIso = () => new Date().toISOString()

  const commitMove = useCallback(
    (
      card: Card,
      toCol: string,
      after: string | null,
      before: string | null,
      pos: number,
      total: number,
      via: 'dragged' | 'shuttled' | 'moved',
    ) => {
      const fromCol = card.columnId
      let priority: Priority | undefined
      if (state.lanes) {
        const vis = visibleOf(toCol).filter((c) => c.id !== card.id)
        const neighbour = (before ? vis.find((c) => c.id === before) : undefined) ??
          (after ? vis.find((c) => c.id === after) : undefined)
        if (neighbour && neighbour.priority !== card.priority) priority = neighbour.priority
      }
      const colLabel = colName(toCol)
      const sameCol = fromCol === toCol
      const note = sameCol
        ? `Reshuffled within ${colLabel}.`
        : `Shunted from ${colName(fromCol)} to ${colLabel}${priority ? ` (${PRIORITIES[priority].name} line)` : ''}.`
      dispatch({ type: 'move', cardId: card.id, toCol, after, before, priority, note, now: nowIso() })
      const base = sameCol
        ? `${card.id} reshuffled within ${colLabel}, position ${pos} of ${total}.`
        : `${card.id} ${via} to ${colLabel}, position ${pos} of ${total}.`
      const col = state.columns.find((c) => c.id === toCol)
      const newCount = allInCol(toCol).length + (sameCol ? 0 : 1)
      const breach = col?.limit != null && newCount > col.limit
      announce(breach ? `${base} ${colLabel} is now over its limit of ${col!.limit}.` : base)
    },
    [state.lanes, state.columns, state.cards, visibleOf, announce],
  )

  /** Keyboard shuttle: move the focused card one slot. */
  const shuttle = (card: Card, dir: 'up' | 'down' | 'left' | 'right') => {
    const colIdx = state.columns.findIndex((c) => c.id === card.columnId)
    if (dir === 'up' || dir === 'down') {
      const vis = visibleOf(card.columnId)
      const i = vis.findIndex((c) => c.id === card.id)
      if (dir === 'up' && i > 0) {
        commitMove(card, card.columnId, i > 1 ? vis[i - 2].id : null, vis[i - 1].id, i, vis.length, 'shuttled')
      } else if (dir === 'down' && i < vis.length - 1) {
        commitMove(card, card.columnId, vis[i + 1].id, i + 2 < vis.length ? vis[i + 2].id : null, i + 2, vis.length, 'shuttled')
      } else {
        announce(dir === 'up' ? `${card.id} is already first in ${colName(card.columnId)}.` : `${card.id} is already last in ${colName(card.columnId)}.`)
      }
      return
    }
    const targetCol = state.columns[colIdx + (dir === 'right' ? 1 : -1)]
    if (!targetCol) {
      announce(dir === 'left' ? `${card.id} — no column to the left.` : `${card.id} — no column to the right.`)
      return
    }
    const vis = visibleOf(targetCol.id)
    const i = Math.min(visibleOf(card.columnId).findIndex((c) => c.id === card.id), vis.length - 1)
    const after = i >= 0 ? vis[i].id : vis.length > 0 ? vis[vis.length - 1].id : null
    const before = i >= 0 && vis[i + 1] ? vis[i + 1].id : null
    const pos = i >= 0 ? i + 2 : vis.length + 1
    commitMove(card, targetCol.id, after, before, pos, vis.length + 1, 'shuttled')
  }

  // -------------------------------------------------------------- pointer DnD

  /** Which column + insertion index is under this point? (index counts the dragged card's column list excluding it.) */
  const measureTarget = (x: number, y: number, excludeId: string): { colId: string; index: number } | null => {
    for (const col of state.columns) {
      const el = colRefs.current.get(col.id)
      if (!el) continue
      const r = el.getBoundingClientRect()
      if (x < r.left - 14 || x > r.right + 14 || y < r.top || y > r.bottom + 48) continue
      const items = Array.from(el.querySelectorAll<HTMLElement>('[data-cardid]')).filter(
        (n) => n.dataset.cardid !== excludeId,
      )
      for (let i = 0; i < items.length; i++) {
        const ir = items[i].getBoundingClientRect()
        if (y < ir.top + ir.height / 2) return { colId: col.id, index: i }
      }
      return { colId: col.id, index: items.length }
    }
    return null
  }

  const endDrag = useCallback(
    (commit: boolean) => {
      cleanupRef.current?.()
      cleanupRef.current = null
      grabRef.current = null
      const d = dragRef.current
      dragRef.current = null
      setDrag(null)
      if (!d) return
      dragEndedAt = performance.now()
      pendingFocus.current = d.cardId
      const card = state.cards.find((c) => c.id === d.cardId)
      if (!card) return
      if (!commit || !d.target) {
        announce(`${card.id} set back in ${colName(d.colId)}.`)
        setFocusId(d.cardId)
        return
      }
      if (d.target.colId === card.columnId && d.target.index === d.originIndex) {
        announce(`${card.id} set back where it was in ${colName(d.colId)}.`)
        setFocusId(d.cardId)
        return
      }
      const vis = visibleOf(d.target.colId).filter((c) => c.id !== card.id)
      const after = d.target.index > 0 ? vis[d.target.index - 1].id : null
      const before = d.target.index < vis.length ? vis[d.target.index].id : null
      commitMove(card, d.target.colId, after, before, d.target.index + 1, vis.length + 1, 'dragged')
      setFocusId(d.cardId)
    },
    [state.cards, visibleOf, commitMove, announce],
  )

  const detachDragListeners = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
  }, [])

  const onCardPointerDown = (e: ReactPointerEvent<HTMLElement>, card: Card) => {
    if (e.button !== 0 || openCardId || dragRef.current || grabRef.current) return
    if (TAP_ONLY(e.target)) return
    const rect = e.currentTarget.getBoundingClientRect()
    grabRef.current = {
      cardId: card.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    }

    const originIndex = visibleOf(card.columnId).findIndex((c) => c.id === card.id)

    const onMove = (ev: PointerEvent) => {
      const g = grabRef.current
      if (!g || ev.pointerId !== g.pointerId) return
      const dist = Math.hypot(ev.clientX - g.startX, ev.clientY - g.startY)
      if (!dragRef.current) {
        if (dist < 7) return
        const d: DragState = {
          cardId: g.cardId,
          colId: card.columnId,
          x: g.startX,
          y: g.startY,
          dx: g.dx,
          dy: g.dy,
          w: g.w,
          h: g.h,
          originIndex,
          target: null,
        }
        dragRef.current = d
        setDrag(d)
        announce(`${card.id} picked up. Move the pointer or press Escape.`)
      }
      if (ev.cancelable) ev.preventDefault()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const cx = ev.clientX
      const cy = ev.clientY
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        const d = dragRef.current
        if (!d) return
        const target = measureTarget(cx, cy, d.cardId)
        const next: DragState = { ...d, x: cx, y: cy, target }
        dragRef.current = next
        setDrag(next)
      })
    }
    const onUp = (ev: PointerEvent) => {
      if (grabRef.current && ev.pointerId !== grabRef.current.pointerId) return
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      endDrag(true)
    }
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.preventDefault()
        if (dragRef.current) endDrag(false)
        else {
          grabRef.current = null
          detachDragListeners()
        }
      }
    }
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('keydown', onKey)
    cleanupRef.current = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('keydown', onKey)
    }
  }

  // -------------------------------------------------------------- keyboard nav

  const focusCard = (id: string | undefined) => {
    if (!id) return
    cardRefs.current.get(id)?.focus()
    setFocusId(id)
  }

  const onCardKeyDown = (e: ReactKeyboardEvent<HTMLElement>, card: Card) => {
    const vis = visibleOf(card.columnId)
    const i = vis.findIndex((c) => c.id === card.id)
    const colIdx = state.columns.findIndex((c) => c.id === card.columnId)
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        if (e.shiftKey) {
          shuttle(card, 'up')
          pendingFocus.current = card.id
          setFocusId(card.id)
        } else if (i > 0) focusCard(vis[i - 1]?.id)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (e.shiftKey) {
          shuttle(card, 'down')
          pendingFocus.current = card.id
          setFocusId(card.id)
        } else if (i < vis.length - 1) focusCard(vis[i + 1]?.id)
        break
      case 'ArrowLeft':
      case 'ArrowRight': {
        e.preventDefault()
        const dir = e.key === 'ArrowRight' ? 'right' : 'left'
        const tcol = state.columns[colIdx + (dir === 'right' ? 1 : -1)]
        if (e.shiftKey) {
          shuttle(card, dir)
          pendingFocus.current = card.id
          setFocusId(card.id)
        } else if (tcol) {
          const tv = visibleOf(tcol.id)
          if (tv.length > 0) focusCard(tv[Math.min(i, tv.length - 1)].id)
          else announce(`${colName(tcol.id)} has no cards to focus.`)
        }
        break
      }
      case 'Home':
        e.preventDefault()
        if (vis.length > 0) focusCard(vis[0].id)
        break
      case 'End':
        e.preventDefault()
        if (vis.length > 0) focusCard(vis[vis.length - 1].id)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        setOpenCardId(card.id)
        break
      case 'a':
      case 'A':
        if (e.metaKey || e.ctrlKey || e.altKey) return
        e.preventDefault()
        setComposerTitle('')
        setComposerPriority(card.priority)
        setComposer({ colId: card.columnId, after: card.id })
        break
      default:
        break
    }
  }

  // -------------------------------------------------------------- card ops

  const checkBreachAfter = (colId: string, delta: number) => {
    const col = state.columns.find((c) => c.id === colId)
    if (col?.limit != null && allInCol(colId).length + delta > col.limit) {
      announce(`${col.name} is over its limit of ${col.limit} — the tally turns orange until it clears.`)
    }
  }

  const submitComposer = (e: FormEvent) => {
    e.preventDefault()
    if (!composer) return
    const title = composerTitle.trim()
    if (!title) return
    const col = state.columns.find((c) => c.id === composer.colId)
    if (!col) return
    dispatch({ type: 'add', colId: col.id, after: composer.after, title, priority: composerPriority, now: nowIso() })
    const newId = `SW-${state.nextSeq}`
    announce(`${newId} written on the board in ${col.name}.`)
    checkBreachAfter(col.id, 1)
    pendingFocus.current = newId
    setFocusId(newId)
    setComposer(null)
  }

  const patchCard = (cardId: string, patch: Partial<Card>, note?: string) =>
    dispatch({ type: 'patch', cardId, patch, note, now: nowIso() })

  const handleDrawerPatch = (card: Card, patch: Partial<Card>) => {
    let note: string | undefined
    if (patch.title !== undefined) note = 'Retitled.'
    else if (patch.desc !== undefined) note = 'Notes updated.'
    else if (patch.assignee !== undefined) {
      const p = personById(patch.assignee)
      note = p ? `Key handed to ${p.name}.` : 'Left without a driver.'
    } else if (patch.priority !== undefined) note = `Reclassed to ${PRIORITIES[patch.priority].name} service.`
    else if (patch.labels !== undefined) note = 'Tags updated.'
    else if (patch.due !== undefined)
      note = patch.due ? `Timetabled for ${dueLabel(patch.due).text.replace('due ', '')}.` : 'Taken off the timetable.'
    patchCard(card.id, patch, note)
    if (note) announce(`${card.id}: ${note}`)
  }

  const deleteCard = (card: Card) => {
    setOpenCardId(null)
    dispatch({ type: 'remove', cardId: card.id })
    setToast({ card })
    announce(`${card.id} scrapped. Undo available.`)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 7000)
  }

  const undoDelete = () => {
    if (!toast) return
    dispatch({ type: 'restore', card: toast.card, now: nowIso() })
    announce(`${toast.card.id} rolled back onto ${colName(toast.card.columnId)}.`)
    pendingFocus.current = toast.card.id
    setFocusId(toast.card.id)
    setToast(null)
    window.clearTimeout(toastTimer.current)
  }

  const renameColumn = (colId: string, name: string) => {
    const n = name.trim()
    setRenamingCol(null)
    if (!n || n === colName(colId)) return
    dispatch({ type: 'renameCol', colId, name: n })
    announce(`Column renamed to ${n}.`)
  }

  const resetBoard = () => {
    dispatch({ type: 'reset' })
    setToast(null)
    setOpenCardId(null)
    setComposer(null)
    setAssigneeFilter(null)
    setLabelFilter([])
    setFocusId(null)
    announce('Board reset to the demo timetable. Shunting is over its limit again, as tradition demands.')
  }

  // -------------------------------------------------------------- render

  const openCard = openCardId ? state.cards.find((c) => c.id === openCardId) : undefined
  const draggingCard = drag ? state.cards.find((c) => c.id === drag.cardId) : undefined
  const totalCards = state.cards.length
  const filtersOn = assigneeFilter !== null || labelFilter.length > 0

  return (
    <div className="swy">
      {/* ————————— head ————————— */}
      <header className="swy-head">
        <div className="swy-nameplate">
          <svg className="swy-lamp" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <circle cx="12" cy="7" r="5.5" className="swy-lamp__lit" />
            <circle cx="12" cy="17" r="5.5" className="swy-lamp__dark" />
          </svg>
          <span className="swy-wordmark">Switchyard</span>
          <span className="swy-plate">Signal box №3 · product board</span>
        </div>

        <div className="swy-head__tools">
          <label className="swy-selectwrap">
            <span className="swy-mono">Driver</span>
            <select
              className="swy-select"
              value={assigneeFilter ?? ''}
              onChange={(e) => setAssigneeFilter(e.target.value || null)}
              aria-label="Filter by assignee"
            >
              <option value="">All drivers</option>
              {PEOPLE.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <div className="swy-chips" role="group" aria-label="Filter by tag">
            {LABELS.map((l) => {
              const on = labelFilter.includes(l.id)
              return (
                <button
                  key={l.id}
                  type="button"
                  className={'swy-chip' + (on ? ' is-on' : '')}
                  aria-pressed={on}
                  onClick={() =>
                    setLabelFilter((f) => (on ? f.filter((x) => x !== l.id) : [...f, l.id]))
                  }
                >
                  {l.name}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className={'swy-toggle' + (state.lanes ? ' is-on' : '')}
            aria-pressed={state.lanes}
            onClick={() => dispatch({ type: 'lanes', on: !state.lanes })}
          >
            <span className="swy-toggle__rail" aria-hidden="true">
              <span className="swy-toggle__key" />
            </span>
            Priority lanes
          </button>
        </div>
      </header>

      {/* ————————— stat strip ————————— */}
      <div className="swy-strip" role="status" aria-label="Board tally">
        <span><b className="swy-mono">{totalCards}</b> on the board</span>
        <span><b className="swy-mono">{allInCol('shunt').length}</b> shunting</span>
        <span><b className="swy-mono">{allInCol('signal').length}</b> at signal check</span>
        <span className={breachCols.length > 0 ? 'swy-strip--breach' : ''}>
          <b className="swy-mono">{breachCols.length}</b> column{breachCols.length === 1 ? '' : 's'} over limit
        </span>
        {filtersOn && (
          <button type="button" className="swy-linkbtn" onClick={() => { setAssigneeFilter(null); setLabelFilter([]) }}>
            Clear filters
          </button>
        )}
      </div>

      {/* ————————— board ————————— */}
      <div
        className="swy-boardwrap"
        ref={boardRef}
        onScroll={(e) => {
          const el = e.currentTarget
          setScrollPos(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth))
        }}
      >
        <div className="swy-board" role="region" aria-label="Switchyard product board">
          {state.columns.map((col, colIdx) => {
            const allCount = allInCol(col.id).length
            const breach = col.limit != null && allCount > col.limit
            const visAll = visibleOf(col.id)
            // While dragging, the dragged card leaves its column list; a slot marks the target.
            const dragExcl = drag ? visAll.filter((c) => c.id !== drag.cardId) : visAll
            const slotIndex = drag
              ? drag.target && drag.target.colId === col.id
                ? drag.target.index
                : drag.colId === col.id && !drag.target
                  ? drag.originIndex
                  : null
              : null
            const tabbable = focusId && visAll.some((c) => c.id === focusId) ? focusId : visAll[0]?.id

            const rows: ReactNode[] = []
            dragExcl.forEach((card, i) => {
              if (slotIndex === i) {
                rows.push(
                  <li key="__slot" className="swy-slot" style={{ height: drag ? drag.h : 40 }} aria-hidden="true" />,
                )
              }
              const person = personById(card.assignee)
              const prev = i > 0 ? dragExcl[i - 1] : null
              const laneBreak = state.lanes && (!prev || prev.priority !== card.priority)
              const kl = card.checklist.filter((k) => k.done).length
              const due = card.due ? dueLabel(card.due) : null
              if (laneBreak) {
                rows.push(
                  <li key={`lane-${card.priority}`} className="swy-lane" aria-hidden="true">
                    <span className="swy-mono">{PRIORITIES[card.priority].lane}</span>
                  </li>,
                )
              }
              rows.push(
                <li key={card.id}>
                  <article
                    ref={(el) => {
                      if (el) cardRefs.current.set(card.id, el)
                      else cardRefs.current.delete(card.id)
                    }}
                    data-cardid={card.id}
                    className={
                      'swy-card' +
                      (drag?.cardId === card.id ? ' is-source' : '') +
                      (focusId === card.id ? ' is-focus' : '')
                    }
                    tabIndex={card.id === tabbable ? 0 : -1}
                    role="button"
                    aria-roledescription="card"
                    aria-label={`${card.id} — ${card.title}. In ${col.name}, position ${i + 1} of ${dragExcl.length}. Press Enter to open, Shift plus arrow keys to move.`}
                    onFocus={() => setFocusId(card.id)}
                    onKeyDown={(e) => onCardKeyDown(e, card)}
                    onPointerDown={(e) => onCardPointerDown(e, card)}
                    onClick={() => {
                      if (grabJustEnded()) return
                      setOpenCardId(card.id)
                    }}
                  >
                    <div className="swy-card__top">
                      <span className="swy-card__id swy-mono">{card.id}</span>
                      <span className={`swy-ptag swy-ptag--${card.priority}`}>{PRIORITIES[card.priority].code}</span>
                    </div>
                    <h3 className="swy-card__title">{card.title}</h3>
                    {card.labels.length > 0 && (
                      <div className="swy-card__tags">
                        {card.labels.slice(0, 3).map((l) => (
                          <span key={l} className="swy-minichip">{l}</span>
                        ))}
                        {card.labels.length > 3 && <span className="swy-minichip">+{card.labels.length - 3}</span>}
                      </div>
                    )}
                    <div className="swy-card__meta">
                      {card.checklist.length > 0 && (
                        <span className="swy-mono swy-card__check" aria-label={`${kl} of ${card.checklist.length} checklist items done`}>
                          <span className="swy-minibar" aria-hidden="true">
                            <span style={{ width: `${(kl / card.checklist.length) * 100}%` }} />
                          </span>
                          {kl}/{card.checklist.length}
                        </span>
                      )}
                      {due && (
                        <span className={'swy-mono swy-card__due' + (due.overdue ? ' is-over' : '')}>{due.text}</span>
                      )}
                      {person && (
                        <span className="swy-card__who">
                          <Avatar person={person} size={22} />
                        </span>
                      )}
                    </div>
                  </article>
                </li>,
              )
              if (composer && composer.colId === col.id && composer.after === card.id) {
                rows.push(
                  <li key="__composer">
                    <Composer
                      inputRef={composerInputRef}
                      title={composerTitle}
                      setTitle={setComposerTitle}
                      priority={composerPriority}
                      setPriority={setComposerPriority}
                      onSubmit={submitComposer}
                      onCancel={() => setComposer(null)}
                      nextId={state.nextSeq}
                    />
                  </li>,
                )
              }
            })
            if (slotIndex === dragExcl.length) {
              rows.push(
                <li key="__slot" className="swy-slot" style={{ height: drag ? drag.h : 40 }} aria-hidden="true" />,
              )
            }
            if (composer && composer.colId === col.id && composer.after === null) {
              rows.push(
                <li key="__composer">
                  <Composer
                    inputRef={composerInputRef}
                    title={composerTitle}
                    setTitle={setComposerTitle}
                    priority={composerPriority}
                    setPriority={setComposerPriority}
                    onSubmit={submitComposer}
                    onCancel={() => setComposer(null)}
                    nextId={state.nextSeq}
                  />
                </li>,
              )
            }

            return (
              <section
                key={col.id}
                className={'swy-col' + (breach ? ' is-breach' : '')}
                aria-label={`${col.name}, column ${colIdx + 1}, ${allCount} card${allCount === 1 ? '' : 's'}${breach ? `, over its limit of ${col.limit}` : ''}`}
              >
                <header className="swy-col__head">
                  <div className="swy-col__titlerow">
                    <span className="swy-mono swy-col__no">{String(colIdx + 1).padStart(2, '0')}</span>
                    {renamingCol === col.id ? (
                      <input
                        className="swy-input swy-input--colname"
                        defaultValue={col.name}
                        autoFocus
                        maxLength={24}
                        aria-label="Column name"
                        onBlur={(e) => renameColumn(col.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') renameColumn(col.id, e.currentTarget.value)
                          if (e.key === 'Escape') setRenamingCol(null)
                        }}
                      />
                    ) : (
                      <h2 className="swy-col__name">
                        <button
                          type="button"
                          className="swy-col__namebtn"
                          onClick={() => setRenamingCol(col.id)}
                          title="Rename this column"
                        >
                          {col.name}
                        </button>
                      </h2>
                    )}
                    <span className={'swy-col__count swy-mono' + (breach ? ' is-breach' : '')}>
                      {allCount}
                      {col.limit != null && `/${col.limit}`}
                    </span>
                  </div>
                  {breach && (
                    <p className="swy-breach" role="note">
                      <span className="swy-mono">Over limit</span> — clear the line before taking on more.
                    </p>
                  )}
                </header>

                <ul
                  className="swy-list"
                  ref={(el) => {
                    if (el) colRefs.current.set(col.id, el)
                    else colRefs.current.delete(col.id)
                  }}
                >
                  {rows}
                  {visAll.length === 0 && !drag && (
                    <li className="swy-empty" aria-hidden="true">
                      {allCount > 0 ? 'Filtered out of sight' : 'Nothing in this siding'}
                    </li>
                  )}
                </ul>

                {!composer || composer.colId !== col.id ? (
                  <button
                    type="button"
                    className="swy-add"
                    onClick={() => {
                      setComposerTitle('')
                      setComposerPriority('local')
                      setComposer({ colId: col.id, after: null })
                    }}
                  >
                    <span aria-hidden="true">+</span> Write a card
                  </button>
                ) : null}
              </section>
            )
          })}
        </div>
      </div>

      {/* mobile progress dots */}
      <div className="swy-dots" aria-label="Column position">
        {state.columns.map((col, i) => {
          const active = Math.round(scrollPos * (state.columns.length - 1)) === i
          return (
            <button
              key={col.id}
              type="button"
              aria-current={active ? 'true' : undefined}
              aria-label={`Go to column ${col.name}`}
              className={'swy-dot' + (active ? ' is-on' : '')}
              onClick={() =>
                colRefs.current.get(col.id)?.closest('.swy-col')?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
              }
            />
          )
        })}
      </div>

      {/* ————————— foot ————————— */}
      <footer className="swy-foot">
        <p className="swy-keys">
          <span className="swy-mono">Board manners</span> — drag a card, or focus it and use
          <kbd>Shift</kbd>+<kbd>←→↑↓</kbd> to shunt · <kbd>Enter</kbd> opens the record ·
          <kbd>A</kbd> writes a card below · <kbd>Esc</kbd> cancels.
        </p>
        <p className="swy-persist">
          Saved to this browser only.{' '}
          <button type="button" className="swy-linkbtn" onClick={resetBoard}>
            Reset demo data
          </button>
        </p>
      </footer>

      {/* ————————— drag ghost ————————— */}
      {drag && draggingCard && (
        <div
          className="swy-ghost"
          style={{ width: drag.w, transform: `translate3d(${drag.x - drag.dx}px, ${drag.y - drag.dy}px, 0) rotate(1.2deg)` }}
          aria-hidden="true"
        >
          <div className="swy-card__top">
            <span className="swy-card__id swy-mono">{draggingCard.id}</span>
            <span className={`swy-ptag swy-ptag--${draggingCard.priority}`}>{PRIORITIES[draggingCard.priority].code}</span>
          </div>
          <div className="swy-card__title">{draggingCard.title}</div>
        </div>
      )}

      {/* ————————— drawer ————————— */}
      {openCard && (
        <Drawer
          card={openCard}
          columns={state.columns}
          onClose={() => {
            setOpenCardId(null)
            pendingFocus.current = openCard.id
          }}
          onPatch={(patch) => handleDrawerPatch(openCard, patch)}
          onToggleCheck={(itemId) =>
            patchCard(openCard.id, {
              checklist: openCard.checklist.map((k) => (k.id === itemId ? { ...k, done: !k.done } : k)),
            })
          }
          onAddCheck={(text) =>
            patchCard(openCard.id, { checklist: [...openCard.checklist, { id: uid('k'), text, done: false }] }, 'Manifest item added.')
          }
          onRemoveCheck={(itemId) =>
            patchCard(openCard.id, { checklist: openCard.checklist.filter((k) => k.id !== itemId) }, 'Manifest item struck.')
          }
          onDelete={() => deleteCard(openCard)}
          onMoveColumn={(colId) => {
            const vis = visibleOf(colId).filter((c) => c.id !== openCard.id)
            const after = vis.length > 0 ? vis[vis.length - 1].id : null
            commitMove(openCard, colId, after, null, vis.length + 1, vis.length + 1, 'moved')
          }}
        />
      )}

      {/* ————————— toast ————————— */}
      {toast && (
        <div className="swy-toast" role="status">
          <span>
            <b className="swy-mono">{toast.card.id}</b> scrapped.
          </span>
          <button type="button" className="swy-toast__undo" onClick={undoDelete}>
            Roll back
          </button>
          <button type="button" className="swy-iconbtn" aria-label="Dismiss" onClick={() => setToast(null)}>
            ✕
          </button>
        </div>
      )}

      <div ref={liveRef} className="swy-sr" aria-live="polite" role="status" />
    </div>
  )
}

/** True for ~300ms after a drag ends, so the pointerup click doesn't open the drawer. */
let dragEndedAt = 0
function grabJustEnded(): boolean {
  return performance.now() - dragEndedAt < 300
}

// ------------------------------------------------------------------ composer

function Composer({
  inputRef,
  title,
  setTitle,
  priority,
  setPriority,
  onSubmit,
  onCancel,
  nextId,
}: {
  inputRef: RefObject<HTMLInputElement>
  title: string
  setTitle: (v: string) => void
  priority: Priority
  setPriority: (p: Priority) => void
  onSubmit: (e: FormEvent) => void
  onCancel: () => void
  nextId: number
}) {
  return (
    <form className="swy-composer" onSubmit={onSubmit}>
      <div className="swy-card__top">
        <span className="swy-card__id swy-mono">SW-{nextId}</span>
        <select
          className="swy-select swy-select--pri"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          aria-label="Service class"
        >
          <option value="express">EXP — Express</option>
          <option value="local">LOC — Local</option>
          <option value="freight">FRT — Freight</option>
        </select>
      </div>
      <input
        ref={inputRef}
        className="swy-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Name the work…"
        maxLength={90}
        aria-label="Card title"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            onCancel()
          }
        }}
      />
      <div className="swy-composer__row">
        <button type="submit" className="swy-btn swy-btn--sm" disabled={!title.trim()}>
          Pin it
        </button>
        <button type="button" className="swy-btn swy-btn--sm swy-btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
