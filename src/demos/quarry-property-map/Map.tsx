import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  CONTOURS,
  DAM,
  HILLS,
  HUB,
  RAIL,
  RIVER,
  ROADS,
  STATION,
  SUBURBS,
  WORLD,
  type Listing,
} from './data'

/**
 * The survey map. One SVG, panned and zoomed by rewriting the viewBox.
 * Pins cluster by district while zoomed out and split into individual,
 * keyboard-focusable markers as you move in. In draw mode, clicks drop
 * boundary corners instead of opening listings.
 */

export type Pt = [number, number]

interface MapProps {
  listings: Listing[]
  shortlist: Set<string>
  boundary: Pt[] | null
  drawMode: boolean
  draft: Pt[]
  onAddPoint: (p: Pt) => void
  onOpen: (l: Listing) => void
  onLive: (msg: string) => void
  children?: ReactNode
}

const CLUSTER_BELOW = 1.7
const MAX_SCALE = 5

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

/** Fake shire coordinates for the readout — surveyor flavour. */
function toGrid(x: number, y: number): string {
  const e = (x / WORLD.w) * 1000
  const n = (1 - y / WORLD.h) * 1000
  return `E ${e.toFixed(0).padStart(3, '0')} · N ${n.toFixed(0).padStart(3, '0')}`
}

export default function SurveyMap({
  listings,
  shortlist,
  boundary,
  drawMode,
  draft,
  onAddPoint,
  onOpen,
  onLive,
  children,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [scale, setScale] = useState(1)
  const [centre, setCentre] = useState<[number, number]>([WORLD.w / 2, WORLD.h / 2])
  const [cursor, setCursor] = useState<string | null>(null)
  const drag = useRef<{ px: number; py: number; cx: number; cy: number; moved: boolean } | null>(null)

  const vw = WORLD.w / scale
  const vh = WORLD.h / scale

  const clampCentre = useCallback(
    (c: [number, number], s: number): [number, number] => {
      const hw = WORLD.w / (2 * s)
      const hh = WORLD.h / (2 * s)
      return [
        hw >= WORLD.w / 2 ? WORLD.w / 2 : clamp(c[0], hw, WORLD.w - hw),
        hh >= WORLD.h / 2 ? WORLD.h / 2 : clamp(c[1], hh, WORLD.h - hh),
      ]
    },
    [],
  )

  const setView = useCallback(
    (s: number, c: [number, number]) => {
      const ns = clamp(s, 1, MAX_SCALE)
      setScale(ns)
      setCentre(clampCentre(c, ns))
    },
    [clampCentre],
  )

  const zoomBy = useCallback(
    (factor: number, about?: Pt) => {
      const ns = clamp(scale * factor, 1, MAX_SCALE)
      if (ns === scale) return
      const pt = about ?? centre
      const next: Pt = [pt[0] - (pt[0] - centre[0]) * (scale / ns), pt[1] - (pt[1] - centre[1]) * (scale / ns)]
      setView(ns, next)
      onLive(`Map zoom ${ns < 1.2 ? 'reset to full shire' : `${ns.toFixed(1)} times`}.`)
    },
    [scale, centre, setView, onLive],
  )

  const panBy = useCallback(
    (dx: number, dy: number) => {
      setCentre((c) => clampCentre([c[0] + dx, c[1] + dy], scale))
    },
    [scale, clampCentre],
  )

  // wheel zoom (non-passive so the page doesn't scroll mid-pinch)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = svg.getBoundingClientRect()
      const world = screenToWorld(e.clientX, e.clientY, rect)
      zoomBy(e.deltaY < 0 ? 1.22 : 1 / 1.22, world)
    }
    const screenToWorld = (mx: number, my: number, rect: DOMRect): Pt => {
      const vx = centre[0] - vw / 2
      const vy = centre[1] - vh / 2
      return [vx + ((mx - rect.left) / rect.width) * vw, vy + ((my - rect.top) / rect.height) * vh]
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [zoomBy, centre, vw, vh])

  const toWorld = (clientX: number, clientY: number): Pt | null => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect || !rect.width) return null
    const vx = centre[0] - vw / 2
    const vy = centre[1] - vh / 2
    return [vx + ((clientX - rect.left) / rect.width) * vw, vy + ((clientY - rect.top) / rect.height) * vh]
  }

  /* ----- pointer pan / click-to-draw */

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { px: e.clientX, py: e.clientY, cx: centre[0], cy: centre[1], moved: false }
  }

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const w = toWorld(e.clientX, e.clientY)
    if (w) setCursor(toGrid(w[0], w[1]))
    const d = drag.current
    if (!d) return
    const dxPx = e.clientX - d.px
    const dyPx = e.clientY - d.py
    if (!d.moved && Math.hypot(dxPx, dyPx) > 4) d.moved = true
    if (d.moved) {
      const rect = e.currentTarget.getBoundingClientRect()
      const perPx = vw / rect.width
      setCentre(clampCentre([d.cx - dxPx * perPx, d.cy - dyPx * perPx], scale))
    }
  }

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current
    drag.current = null
    if (!d || d.moved) return
    if (drawMode) {
      const w = toWorld(e.clientX, e.clientY)
      if (w) onAddPoint([Math.round(w[0]), Math.round(w[1])])
    }
  }

  /* ----- keyboard pan / zoom on the map itself */

  const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    const step = vw * 0.18
    switch (e.key) {
      case 'ArrowLeft': panBy(-step, 0); e.preventDefault(); break
      case 'ArrowRight': panBy(step, 0); e.preventDefault(); break
      case 'ArrowUp': panBy(0, -step); e.preventDefault(); break
      case 'ArrowDown': panBy(0, step); e.preventDefault(); break
      case '+': case '=': zoomBy(1.25); e.preventDefault(); break
      case '-': case '_': zoomBy(1 / 1.25); e.preventDefault(); break
      case '0': setView(1, [WORLD.w / 2, WORLD.h / 2]); onLive('Map zoom reset.'); e.preventDefault(); break
    }
  }

  /* ----- clustering */

  const clusters = useMemo(() => {
    const bySuburb = new Map<string, { xs: number; ys: number; n: number }>()
    for (const l of listings) {
      const c = bySuburb.get(l.suburb) ?? { xs: 0, ys: 0, n: 0 }
      c.xs += l.x; c.ys += l.y; c.n += 1
      bySuburb.set(l.suburb, c)
    }
    return [...bySuburb.entries()].map(([name, c]) => ({
      name,
      x: c.xs / c.n,
      y: c.ys / c.n,
      n: c.n,
    }))
  }, [listings])

  const showPins = scale >= CLUSTER_BELOW

  const openCluster = (name: string, x: number, y: number) => {
    setView(Math.max(2.2, scale * 1.9), [x, y])
    onLive(`Zoomed into ${name}. ${listings.filter((l) => l.suburb === name).length} lots as pins.`)
  }

  const pinKey = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      fn()
    }
  }

  const vbX = centre[0] - vw / 2
  const vbY = centre[1] - vh / 2
  const px = 1 / scale // 1px stroke at current zoom

  return (
    <div className={`qc-map${drawMode ? ' qc-map--drawing' : ''}`}>
      <svg
        ref={svgRef}
        className="qc-map__svg"
        viewBox={`${vbX} ${vbY} ${vw} ${vh}`}
        role="application"
        aria-label={`Survey map of the Ironbark Shire. ${listings.length} lots shown. Arrow keys pan, plus and minus zoom, zero resets.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => { setCursor(null); drag.current = null }}
      >
        {/* ---------- terrain ---------- */}
        <rect x={-40} y={-40} width={WORLD.w + 80} height={WORLD.h + 80} fill="#efe4c8" />
        {CONTOURS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(96,78,52,.30)" strokeWidth={px * 1.1} strokeDasharray={`${px * 5} ${px * 3}`} />
        ))}
        {HILLS.map((h) => (
          <text
            key={h.name}
            x={h.cx}
            y={h.cy}
            className="qc-map__hill"
            fontSize={11 * px * 2}
            textAnchor="middle"
          >
            ▲ {h.name}
          </text>
        ))}
        <path d={DAM ? `M ${DAM.cx - DAM.rx} ${DAM.cy} a ${DAM.rx} ${DAM.ry} 0 1 0 ${DAM.rx * 2} 0 a ${DAM.rx} ${DAM.ry} 0 1 0 ${-DAM.rx * 2} 0` : ''} fill="#a9bda2" opacity={0.85} />
        <text x={DAM.cx} y={DAM.cy + 3 * px * 2} className="qc-map__water" fontSize={10 * px * 2} textAnchor="middle">
          {DAM.name}
        </text>
        <path d={RIVER} fill="none" stroke="#a9bda2" strokeWidth={22 * px} strokeLinecap="round" opacity={0.9} />
        <path d={RIVER} fill="none" stroke="rgba(96,78,52,.35)" strokeWidth={px} opacity={0.6} />

        {/* ---------- roads & rail ---------- */}
        {ROADS.map((d, i) => (
          <path key={`c${i}`} d={d} fill="none" stroke="#cdbb92" strokeWidth={7 * px} strokeLinecap="round" />
        ))}
        {ROADS.map((d, i) => (
          <path key={`r${i}`} d={d} fill="none" stroke="#f6efdd" strokeWidth={4.6 * px} strokeLinecap="round" />
        ))}
        <path d={RAIL} fill="none" stroke="#6c5a40" strokeWidth={2.4 * px} strokeDasharray={`${px * 9} ${px * 5}`} />
        <g transform={`translate(${STATION.x} ${STATION.y})`}>
          <rect x={-5 * px} y={-5 * px} width={10 * px} height={10 * px} fill="#6c5a40" transform="rotate(45)" />
        </g>

        {/* ---------- the hub ---------- */}
        <g transform={`translate(${HUB.x} ${HUB.y})`}>
          <circle r={9 * px} fill="#d9622b" stroke="#f6efdd" strokeWidth={2 * px} />
          <path d={`M 0 ${-14 * px} L 0 ${14 * px} M ${-14 * px} 0 L ${14 * px} 0`} stroke="#d9622b" strokeWidth={1.4 * px} />
          <text y={-20 * px} textAnchor="middle" className="qc-map__hub" fontSize={11 * px * 2}>
            {HUB.name}
          </text>
        </g>

        {/* ---------- district labels ---------- */}
        {SUBURBS.map((s) => (
          <text
            key={s.name}
            x={s.cx}
            y={s.cy - s.r * 0.62}
            textAnchor="middle"
            className="qc-map__suburb"
            fontSize={13 * px * 2}
            opacity={showPins ? 0.4 : 0.85}
          >
            {s.name}
          </text>
        ))}

        {/* ---------- committed boundary ---------- */}
        {boundary && boundary.length >= 3 && (
          <polygon
            points={boundary.map((p) => p.join(',')).join(' ')}
            fill="rgba(217,98,43,.10)"
            stroke="#d9622b"
            strokeWidth={2 * px}
            strokeDasharray={`${px * 8} ${px * 4}`}
          />
        )}

        {/* ---------- draft boundary ---------- */}
        {drawMode && draft.length > 0 && (
          <g>
            <polyline
              points={draft.map((p) => p.join(',')).join(' ')}
              fill={draft.length >= 3 ? 'rgba(217,98,43,.08)' : 'none'}
              stroke="#d9622b"
              strokeWidth={2 * px}
              strokeDasharray={`${px * 6} ${px * 4}`}
            />
            {draft.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r={4.5 * px} fill="#d9622b" stroke="#f6efdd" strokeWidth={1.5 * px} />
            ))}
          </g>
        )}

        {/* ---------- markers ---------- */}
        {!showPins
          ? clusters.map((c) => (
              <g
                key={c.name}
                transform={`translate(${c.x} ${c.y})`}
                role="button"
                tabIndex={0}
                aria-label={`${c.name}: ${c.n} lots. Activate to zoom in.`}
                className="qc-cluster"
                onClick={() => openCluster(c.name, c.x, c.y)}
                onKeyDown={(e) => pinKey(e, () => openCluster(c.name, c.x, c.y))}
              >
                <circle r={(14 + Math.min(10, c.n)) * Math.max(px, 0.55)} className="qc-cluster__halo" />
                <circle r={(11 + Math.min(8, c.n)) * Math.max(px, 0.55)} className="qc-cluster__body" />
                <text textAnchor="middle" dy="0.35em" fontSize={12 * Math.max(px * 2, 1.1)} className="qc-cluster__n">
                  {c.n}
                </text>
              </g>
            ))
          : listings.map((l) => (
              <g
                key={l.id}
                transform={`translate(${l.x} ${l.y})`}
                role="button"
                tabIndex={0}
                aria-label={`${l.address}, ${l.suburb}. ${l.type}, $${Math.round(l.price / 1000)} thousand. Activate for details.`}
                className={`qc-pin${shortlist.has(l.id) ? ' qc-pin--saved' : ''}`}
                onClick={() => { if (!drawMode) onOpen(l) }}
                onKeyDown={(e) => pinKey(e, () => onOpen(l))}
              >
                <path
                  d={`M 0 ${3 * px} C ${-6 * px} ${-4 * px} ${-9 * px} ${-8 * px} ${-9 * px} ${-13 * px} A ${9 * px} ${9 * px} 0 1 1 ${9 * px} ${-13 * px} C ${9 * px} ${-8 * px} ${6 * px} ${-4 * px} 0 ${3 * px} Z`}
                  className="qc-pin__drop"
                  strokeWidth={1.4 * px}
                />
                <circle cy={-13 * px} r={3.4 * px} className="qc-pin__dot" />
              </g>
            ))}
      </svg>

      {/* HTML overlays */}
      <div className="qc-map__tools">
        <button type="button" onClick={() => zoomBy(1.35)} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => zoomBy(1 / 1.35)} aria-label="Zoom out">−</button>
        <button
          type="button"
          onClick={() => { setView(1, [WORLD.w / 2, WORLD.h / 2]); onLive('Map reset to the full shire.') }}
          aria-label="Reset map view"
          className="qc-map__reset"
        >
          ⌂
        </button>
      </div>

      <div className="qc-map__readout" aria-hidden="true">
        <span>{cursor ?? 'E ——— · N ———'}</span>
        <span className="qc-map__scalebar">
          <i style={{ width: `${Math.round(60 * (1 / scale))}px` }} /> {scale < 1.2 ? '2 km' : `${(2 / scale).toFixed(1)} km`}
        </span>
      </div>

      {children}
    </div>
  )
}
