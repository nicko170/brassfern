import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { Pot } from './data'
import { COIN_VALUES, fmt, fmtWhole } from './data'
import Icon from './icons'
import { useTweenNumber } from './hooks'

interface PotsProps {
  pots: Pot[]
  spare: number
  reduced: boolean
  onAllocate: (potId: string, amount: number) => void
  openAllocate: (preset?: number) => void
}

interface DragState {
  value: number
  x: number
  y: number
  startX: number
  startY: number
  hoverId: string | null
  moved: boolean
}

function PotBalance({ value, reduced }: { value: number; reduced: boolean }) {
  const v = useTweenNumber(value, reduced)
  return <span className="cl-ser">{fmt(v)}</span>
}

export default function Pots({ pots, spare, reduced, onAllocate, openAllocate }: PotsProps) {
  const [drag, setDrag] = useState<DragState | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const zoneRefs = useRef(new Map<string, HTMLElement>())

  const setZone = (id: string) => (el: HTMLElement | null) => {
    if (el) zoneRefs.current.set(id, el)
    else zoneRefs.current.delete(id)
  }

  const hitTest = (x: number, y: number): string | null => {
    for (const [id, el] of zoneRefs.current) {
      const r = el.getBoundingClientRect()
      if (x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6) return id
    }
    return null
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>, value: number) => {
    e.preventDefault()
    const start: DragState = { value, x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, hoverId: null, moved: false }
    dragRef.current = start
    setDrag(start)

    const move = (ev: PointerEvent) => {
      const cur = dragRef.current
      if (!cur) return
      const moved = cur.moved || Math.hypot(ev.clientX - cur.startX, ev.clientY - cur.startY) > 8
      const next: DragState = { ...cur, x: ev.clientX, y: ev.clientY, moved, hoverId: hitTest(ev.clientX, ev.clientY) }
      dragRef.current = next
      setDrag(next)
    }
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      const cur = dragRef.current
      dragRef.current = null
      setDrag(null)
      if (!cur) return
      const target = hitTest(ev.clientX, ev.clientY)
      if (!cur.moved) {
        // a deliberate tap: open the chooser with this coin preset
        openAllocate(cur.value)
      } else if (target) {
        onAllocate(target, cur.value)
      }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <div className="cl-view" key="pots">
      <header className="cl-viewhead">
        <h1 className="cl-h1">
          Pots for the <em>good stuff</em>
        </h1>
        <p className="cl-sub">Drag a coin onto a pot. Or tap one — we don't judge.</p>
      </header>

      <section className="cl-spare" aria-label="Money ready to allocate">
        <div>
          <p className="cl-overline cl-overline--dark">Ready to allocate</p>
          <p className="cl-spare__bal">
            <PotBalance value={spare} reduced={reduced} />
          </p>
          <p className="cl-spare__hint">Sitting in your Bonus Saver, earning while it waits.</p>
        </div>
        <div className="cl-coins" role="group" aria-label="Coins to drag onto a pot">
          {COIN_VALUES.map((v) => (
            <button
              key={v}
              className={`cl-coin${spare < v ? ' is-dim' : ''}`}
              disabled={spare < v}
              onPointerDown={(e) => onPointerDown(e, v)}
              aria-label={`$${v} coin — drag onto a pot, or press to choose a pot`}
            >
              <span className="cl-ser">${v}</span>
            </button>
          ))}
        </div>
      </section>

      <ul className="cl-pots">
        {pots.map((p) => {
          const pct = Math.min(100, (p.saved / p.goal) * 100)
          const done = p.saved >= p.goal
          const hot = drag?.hoverId === p.id
          return (
            <li
              key={p.id}
              ref={setZone(p.id)}
              className={`cl-pot cl-pot--${p.tint}${hot ? ' is-hot' : ''}${drag ? ' is-droppable' : ''}`}
              aria-label={`${p.name} pot, ${fmt(p.saved)} of ${fmt(p.goal)} saved`}
            >
              <div className="cl-pot__top">
                <div>
                  <h2 className="cl-pot__name">{p.name}</h2>
                  <p className="cl-pot__note">{p.note}</p>
                </div>
                {hot && (
                  <span className="cl-pot__drop" aria-hidden="true">
                    <Icon glyph="down" size={16} /> Drop
                  </span>
                )}
              </div>
              <div className="cl-pot__figures">
                <span className="cl-pot__saved">
                  <PotBalance value={p.saved} reduced={reduced} />
                </span>
                <span className="cl-pot__goal cl-ser">of {fmt(p.goal)}</span>
                {done && <span className="cl-pill cl-pill--mint">Funded — beauty</span>}
              </div>
              <div
                className="cl-pot__track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={p.goal}
                aria-valuenow={Math.round(p.saved)}
                aria-label={`${p.name} progress`}
              >
                <span className="cl-pot__fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="cl-pot__foot">
                <span className="cl-pot__pct">{done ? 'Goal reached' : `${Math.round(pct)}% there · ${fmtWhole(p.goal - p.saved)} to go`}</span>
                <button className="cl-pillbtn cl-pillbtn--ink" onClick={() => openAllocate(50)}>
                  <Icon glyph="plus" size={13} /> Add
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="cl-fineprint">Round-ups from your Everyday account top the pots up each Friday. You can switch that off — we won't take it personally.</p>

      {drag && drag.moved && (
        <div className="cl-dragcl" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          <span className={`cl-coin cl-coin--ghost${drag.hoverId ? ' is-hot' : ''}`}>
            <span className="cl-ser">${drag.value}</span>
          </span>
        </div>
      )}
    </div>
  )
}
