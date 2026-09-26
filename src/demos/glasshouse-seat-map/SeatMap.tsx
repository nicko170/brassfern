import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  CX,
  SEAT_BY_ID,
  SEATS,
  STAGE,
  TIERS,
  firstFree,
  nearestInDirection,
  type Seat,
} from './data'

/**
 * The house, drawn as an architect's plan on deep oxblood: gilded stage,
 * stalls in a gentle fan, dress circle above the rear stalls, wall boxes.
 *
 * Interaction model:
 *  - pointer: drag to pan, scroll/pinch to zoom, click chairs to take them
 *  - keyboard: the map is one tab stop (a multi-selectable listbox); arrow
 *    keys walk the chairs geometrically, Enter/Space takes or releases,
 *    + / − / 0 drive the zoom; aria-activedescendant + per-chair labels do
 *    the screen-reader talking
 *  - everyone else: the full list view beside it
 */

interface Props {
  sold: Set<string>
  selected: Set<string>
  activeId: string | null
  onActive: (id: string | null) => void
  onToggle: (id: string) => void
}

interface View {
  k: number
  tx: number
  ty: number
}

const VB_W = 1000
const VB_H = 900
const K_MIN = 1
const K_MAX = 4

function seatClass(s: Seat, sold: Set<string>, selected: Set<string>, activeId: string | null): string {
  const c = [`gsm-seat`, `gsm-seat--${s.tier}`]
  if (sold.has(s.id)) c.push('is-sold')
  if (selected.has(s.id)) c.push('is-on')
  if (s.id === activeId) c.push('is-focus')
  if (s.restricted) c.push('is-restricted')
  return c.join(' ')
}

export default function SeatMap({ sold, selected, activeId, onActive, onToggle }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>({ k: 1, tx: 0, ty: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{
    mode: 'pan' | 'pinch' | null
    start: View
    pt: { x: number; y: number }
    p0: { x: number; y: number }
    p1: { x: number; y: number }
    d0: number
    mid0: { x: number; y: number }
    moved: boolean
  }>({ mode: null, start: { k: 1, tx: 0, ty: 0 }, pt: { x: 0, y: 0 }, p0: { x: 0, y: 0 }, p1: { x: 0, y: 0 }, d0: 0, mid0: { x: 0, y: 0 }, moved: false })
  const suppressClick = useRef(false)

  // ---- coordinate helpers -------------------------------------------------

  const toSvg = useCallback((clientX: number, clientY: number) => {
    const r = svgRef.current!.getBoundingClientRect()
    return { x: ((clientX - r.left) / r.width) * VB_W, y: ((clientY - r.top) / r.height) * VB_H }
  }, [])

  const zoomAt = useCallback(
    (pt: { x: number; y: number }, factor: number) => {
      setView((v) => {
        const k = Math.min(K_MAX, Math.max(K_MIN, v.k * factor))
        const wx = (pt.x - v.tx) / v.k
        const wy = (pt.y - v.ty) / v.k
        return { k, tx: pt.x - wx * k, ty: pt.y - wy * k }
      })
    },
    [],
  )

  const centreZoom = useCallback(
    (factor: number) => zoomAt({ x: VB_W / 2, y: VB_H / 2 }, factor),
    [zoomAt],
  )

  const fit = useCallback(() => setView({ k: 1, tx: 0, ty: 0 }), [])

  // ---- wheel zoom (non-passive) -------------------------------------------

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      const pt = { x: ((e.clientX - r.left) / r.width) * VB_W, y: ((e.clientY - r.top) / r.height) * VB_H }
      zoomAt(pt, e.deltaY < 0 ? 1.18 : 1 / 1.18)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  // ---- pointer pan / pinch -------------------------------------------------

  function onPointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    svgRef.current?.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesture.current
    if (pointers.current.size === 1) {
      g.mode = 'pan'
      g.start = { ...view }
      g.pt = toSvg(e.clientX, e.clientY)
      g.moved = false
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      g.mode = 'pinch'
      g.start = { ...view }
      g.d0 = Math.hypot(b.x - a.x, b.y - a.y)
      g.mid0 = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2)
      g.moved = true
    }
  }

  function onPointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesture.current
    if (g.mode === 'pan' && pointers.current.size === 1) {
      const pt = toSvg(e.clientX, e.clientY)
      const dx = pt.x - g.pt.x
      const dy = pt.y - g.pt.y
      if (Math.abs(dx) + Math.abs(dy) > 5) {
        g.moved = true
        suppressClick.current = true
      }
      if (g.moved) setView({ k: g.start.k, tx: g.start.tx + dx, ty: g.start.ty + dy })
    } else if (g.mode === 'pinch' && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      const d = Math.hypot(b.x - a.x, b.y - a.y)
      if (g.d0 <= 0) return
      const k = Math.min(K_MAX, Math.max(K_MIN, g.start.k * (d / g.d0)))
      const mid = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2)
      const wx = (g.mid0.x - g.start.tx) / g.start.k
      const wy = (g.mid0.y - g.start.ty) / g.start.k
      setView({ k, tx: mid.x - wx * k, ty: mid.y - wy * k })
    }
  }

  function onPointerEnd(e: ReactPointerEvent<SVGSVGElement>) {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2 && gesture.current.mode === 'pinch') gesture.current.mode = null
    if (pointers.current.size === 0) {
      gesture.current.mode = null
      // let the click event land first, then re-enable
      window.setTimeout(() => {
        suppressClick.current = false
      }, 0)
    }
  }

  function clickSeat(id: string) {
    if (suppressClick.current || sold.has(id)) return
    onToggle(id)
  }

  // ---- keyboard: one tab stop, arrows walk the chairs ----------------------

  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    const dir =
      e.key === 'ArrowLeft' ? 'left' : e.key === 'ArrowRight' ? 'right' : e.key === 'ArrowUp' ? 'up' : e.key === 'ArrowDown' ? 'down' : null
    if (dir) {
      e.preventDefault()
      const from = activeId ? SEAT_BY_ID[activeId] : null
      const next = from ? nearestInDirection(from, dir, sold) : firstFree(sold)
      if (next) onActive(next.id)
      return
    }
    if ((e.key === 'Enter' || e.key === ' ') && activeId && !sold.has(activeId)) {
      e.preventDefault()
      onToggle(activeId)
      return
    }
    if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      centreZoom(1.3)
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault()
      centreZoom(1 / 1.3)
    } else if (e.key === '0') {
      e.preventDefault()
      fit()
    }
  }

  function onWrapFocus() {
    if (!activeId) {
      const s = firstFree(sold)
      if (s) onActive(s.id)
    }
  }

  // ---- render ---------------------------------------------------------------

  const stallsRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']
  const circleRows = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <div className="gsm-mapwrap" ref={wrapRef}>
      <div
        className="gsm-navzone"
        role="listbox"
        aria-multiselectable="true"
        aria-label={`The Glasshouse seating plan. Use arrow keys to walk the chairs, Enter to take or release, plus and minus to zoom. Selected chairs can also be managed in the order summary.`}
        aria-activedescendant={activeId ? `gsm-o-${activeId}` : undefined}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={onWrapFocus}
      >
        <svg
          ref={svgRef}
          className="gsm-map"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          <defs>
            <pattern id="gsm-plan-hatch" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="9" className="gsm-hatchline" />
            </pattern>
          </defs>

          <g transform={`translate(${view.tx} ${view.ty}) scale(${view.k})`}>
            {/* house outline */}
            <rect x="20" y="14" width="960" height="872" rx="10" className="gsm-house" />
            <rect x="20" y="14" width="960" height="872" rx="10" fill="url(#gsm-plan-hatch)" pointerEvents="none" />

            {/* stage: gilded box with apron arc + footlights */}
            <g className="gsm-stage">
              <rect x={STAGE.x} y={STAGE.y} width={STAGE.w} height={STAGE.h} rx="6" className="gsm-stage__box" />
              <path d={`M ${STAGE.x} ${STAGE.apron} Q ${STAGE.centreX} ${STAGE.apron + 34} ${STAGE.x + STAGE.w} ${STAGE.apron}`} className="gsm-stage__apron" />
              {Array.from({ length: 12 }, (_, i) => {
                const t = i / 11
                const fx = STAGE.x + 24 + t * (STAGE.w - 48)
                const fy = STAGE.apron + 15 + Math.pow((fx - STAGE.centreX) / 230, 2) * -17
                return <circle key={i} cx={fx} cy={fy} r="3" className="gsm-footlight" />
              })}
              <text x={STAGE.centreX} y={82} className="gsm-stage__label" textAnchor="middle">
                STAGE
              </text>
              <text x={STAGE.centreX} y={STAGE.apron + 52} className="gsm-orch" textAnchor="middle">
                orchestra pit · rows A–K
              </text>
            </g>

            {/* centre line */}
            <line x1={CX} y1="150" x2={CX} y2="886" className="gsm-centreline" />

            {/* row letters, each side of the stalls */}
            {stallsRows.map((r, i) => {
              const y = 196 + i * 36
              return (
                <g key={r} pointerEvents="none">
                  <text x="112" y={y + 14} className="gsm-rowlabel" textAnchor="end">{r}</text>
                  <text x="838" y={y + 14} className="gsm-rowlabel">{r}</text>
                </g>
              )
            })}

            {/* dress circle divider + labels */}
            <g pointerEvents="none">
              <rect x="48" y="600" width="880" height="26" rx="4" className="gsm-divider" />
              <text x="70" y="618" className="gsm-divider__label">Dress circle — over stalls H–K</text>
              <text x="926" y="618" className="gsm-divider__label gsm-divider__label--r" textAnchor="end">balcony rail ↓</text>
            </g>
            {circleRows.map((r, i) => {
              const y = 640 + i * 34
              return (
                <g key={`c${r}`} pointerEvents="none">
                  <text x="204" y={y + 16} className="gsm-rowlabel" textAnchor="end">C·{r}</text>
                </g>
              )
            })}

            {/* wall boxes — dashed private rooms */}
            {[1, 2, 3, 4, 5, 6].map((b) => {
              const left = b <= 3
              const n = left ? b : b - 3
              const y0 = 246 + (n - 1) * 132
              const x0 = left ? 34 : 900
              return (
                <g key={b} pointerEvents="none">
                  <rect x={x0} y={y0 - 20} width="66" height="92" rx="8" className="gsm-boxroom" />
                  <text x={x0 + 33} y={y0 - 26} className="gsm-boxlabel" textAnchor="middle">Box {b}</text>
                </g>
              )
            })}
            <text x="68" y="566" className="gsm-wallnote" pointerEvents="none">boxes seat four — phone the box office</text>

            {/* the chairs */}
            {SEATS.map((s) => {
              const isSold = sold.has(s.id)
              const tier = TIERS[s.tier]
              const label = s.section === 'box'
                ? `${s.sectionName} chair ${s.num}, ${tier.name}, $${tier.price}${isSold ? ', sold' : selected.has(s.id) ? ', in your order' : ', available'}`
                : `${s.sectionName} row ${s.row} seat ${s.num}, ${tier.name} tier, $${tier.price}${s.restricted ? ', restricted view' : ''}${isSold ? ', sold' : selected.has(s.id) ? ', in your order' : ', available'}`
              return (
                <g
                  key={s.id}
                  id={`gsm-o-${s.id}`}
                  role="option"
                  aria-selected={selected.has(s.id)}
                  aria-disabled={isSold || undefined}
                  aria-label={label}
                  className={seatClass(s, sold, selected, activeId)}
                  onClick={() => clickSeat(s.id)}
                  onMouseEnter={() => onActive(s.id)}
                >
                  <circle cx={s.x} cy={s.y} r="10" className="gsm-seat__hit" />
                  <circle cx={s.x} cy={s.y} r="8" className="gsm-seat__dot" />
                  {selected.has(s.id) && (
                    <path d={`M ${s.x - 3.4} ${s.y + 0.4} l 2.4 2.6 l 4.4 - 5}` className="gsm-seat__tick" pointerEvents="none" />
                  )}
                  {s.restricted && !isSold && !selected.has(s.id) && (
                    <circle cx={s.x} cy={s.y - 8.5} r="1.6" className="gsm-seat__flag" pointerEvents="none" />
                  )}
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* zoom cluster — a sibling of the listbox, not an option in it */}
      <div className="gsm-zoom" role="group" aria-label="Map zoom controls">
        <button type="button" className="gsm-zoom__btn" onClick={() => centreZoom(1.35)} aria-label="Zoom in">＋</button>
        <button type="button" className="gsm-zoom__btn" onClick={() => centreZoom(1 / 1.35)} aria-label="Zoom out">－</button>
        <button type="button" className="gsm-zoom__btn gsm-zoom__fit" onClick={fit} aria-label="Fit the whole house">Fit</button>
      </div>
      <p className="gsm-maphint" aria-hidden="true">Drag to pan · scroll or pinch to zoom</p>
    </div>
  )
}
