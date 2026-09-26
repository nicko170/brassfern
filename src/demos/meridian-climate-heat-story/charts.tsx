/**
 * Exhibits for the heat story:
 *  - TempChart: 90 days of maximums, 1997 vs 2046, drawn as the reader
 *    passes (stroke-dashoffset driven by the parent's IntersectionObserver
 *    ratio; fully drawn under prefers-reduced-motion).
 *  - CanopyCompare: a before/after canopy slider — 1997 street-level
 *    tree cover vs the 2046 Shade Budget — per district, keyboard
 *    accessible via a native range input.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { AVG_MAX_1997, AVG_MAX_2046, DAYS, DISTRICTS, OVER40_1997, OVER40_2046, PEAK, rng } from './data'

// ------------------------------------------------------------ temperature

const W = 760
const H = 380
const M = { t: 34, r: 20, b: 40, l: 52 }
const T_MIN = 25
const T_MAX = 50

const xAt = (i: number) => M.l + (i / (DAYS.length - 1)) * (W - M.l - M.r)
const yAt = (t: number) => M.t + (1 - (t - T_MIN) / (T_MAX - T_MIN)) * (H - M.t - M.b)

function linePath(key: 't1997' | 't2046'): string {
  return DAYS.map((d, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(d[key]).toFixed(1)}`).join('')
}

function areaPath(): string {
  const top = linePath('t2046')
  const baseY = yAt(T_MIN)
  return `${top}L${xAt(DAYS.length - 1).toFixed(1)},${baseY}L${xAt(0).toFixed(1)},${baseY}Z`
}

const TICKS = [30, 35, 40, 45]
const MONTH_MARKS: [number, string][] = [
  [0, 'Dec'],
  [31, 'Jan'],
  [62, 'Feb'],
  [89, 'Mar'],
]
/** heatwave windows, in day indices, for the shading bands */
const HEATWAVES: [number, number, string][] = [
  [40, 48, 'the Nine-Day Bake'],
  [66, 71, 'the Feb. Forgiveness'],
]

export function TempChart({ progress }: { progress: number }) {
  const path2046 = useRef<SVGPathElement>(null)
  const path1997 = useRef<SVGPathElement>(null)
  const [len, setLen] = useState({ a: 0, b: 0 })

  useEffect(() => {
    setLen({ a: path2046.current?.getTotalLength() ?? 0, b: path1997.current?.getTotalLength() ?? 0 })
  }, [])

  const peakOpacity = Math.min(1, Math.max(0, (progress - 0.92) / 0.08))

  return (
    <figure className="mchs-chartfig">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="mchs-tc-title mchs-tc-desc">
        <title id="mchs-tc-title">Daily maximum temperatures, Greater Meridian, summer 1996–97 vs 2045–46</title>
        <desc id="mchs-tc-desc">
          Illustrative data. The 2046 summer line runs about {Math.round(AVG_MAX_2046 - AVG_MAX_1997)} degrees
          hotter than 1997, peaking at {PEAK.t2046}°C on {PEAK.label}. {OVER40_2046} days over forty degrees in
          2046; {OVER40_1997} in 1997.
        </desc>
        <defs>
          <linearGradient id="mchs-thermal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#98927f" />
            <stop offset="55%" stopColor="#d9964e" />
            <stop offset="100%" stopColor="#e0432a" />
          </linearGradient>
          <linearGradient id="mchs-thermal-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0432a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e0432a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* heatwave bands */}
        {HEATWAVES.map(([a, b, name]) => (
          <g key={name}>
            <rect
              x={xAt(a)}
              y={M.t}
              width={xAt(b) - xAt(a)}
              height={H - M.t - M.b}
              className="mchs-chart__band"
            />
            <text x={xAt((a + b) / 2)} y={M.t - 14} textAnchor="middle" className="mchs-chart__bandlabel">
              {name}
            </text>
          </g>
        ))}

        {/* gridlines + axes */}
        {TICKS.map((t) => (
          <g key={t}>
            <line x1={M.l} x2={W - M.r} y1={yAt(t)} y2={yAt(t)} className="mchs-chart__grid" />
            <text x={M.l - 10} y={yAt(t) + 4} textAnchor="end" className="mchs-chart__tick">
              {t}°
            </text>
          </g>
        ))}
        {MONTH_MARKS.map(([i, m]) => (
          <text key={m + i} x={xAt(i)} y={H - M.b + 22} textAnchor="middle" className="mchs-chart__tick">
            {m}
          </text>
        ))}

        {/* area + lines */}
        <path d={areaPath()} fill="url(#mchs-thermal-fill)" opacity={progress > 0.15 ? 1 : 0} style={{ transition: 'opacity 600ms ease' }} />
        <path
          ref={path1997}
          d={linePath('t1997')}
          className="mchs-chart__y97"
          strokeDasharray={len.b || undefined}
          strokeDashoffset={len.b ? len.b * (1 - progress) : undefined}
        />
        <path
          ref={path2046}
          d={linePath('t2046')}
          className="mchs-chart__y46"
          strokeDasharray={len.a || undefined}
          strokeDashoffset={len.a ? len.a * (1 - progress) : undefined}
        />

        {/* peak marker */}
        <g opacity={peakOpacity} style={{ transition: 'opacity 400ms ease' }}>
          <circle cx={xAt(PEAK.i)} cy={yAt(PEAK.t2046)} r={5} className="mchs-chart__peak" />
          <circle cx={xAt(PEAK.i)} cy={yAt(PEAK.t2046)} r={10} className="mchs-chart__peakhalo" />
          <text x={xAt(PEAK.i) - 12} y={yAt(PEAK.t2046) - 16} textAnchor="end" className="mchs-chart__peaklabel">
            {PEAK.t2046}°C — {PEAK.label}
          </text>
        </g>
      </svg>
      <figcaption className="mchs-chartfig__cap mono">
        <span aria-hidden><i className="mchs-swatch mchs-swatch--46" /> 2045–46</span>
        <span aria-hidden><i className="mchs-swatch mchs-swatch--97" /> 1996–97</span>
        <span>
          {OVER40_2046} days ≥ 40°C in 2046, vs {OVER40_1997} in 1997 — illustrative data
        </span>
      </figcaption>
    </figure>
  )
}

// ---------------------------------------------------------------- canopy

interface Dot {
  x: number
  y: number
  r: number
  o: number
}

function canopyDots(seed: number, count: number): Dot[] {
  const rand = rng(seed)
  const dots: Dot[] = []
  let guard = 0
  while (dots.length < count && guard < count * 40) {
    guard++
    const x = rand() * 160
    const y = rand() * 90
    // keep the middle lanes clearer — an impression of streets
    if (Math.abs(((x % 40) - 20)) < 3 && rand() < 0.75) continue
    if (Math.abs(((y % 45) - 22.5)) < 3.4 && rand() < 0.7) continue
    dots.push({ x, y, r: 1 + rand() * 2.1, o: 0.35 + rand() * 0.5 })
  }
  return dots
}

const MAX_DOTS = 620

export function CanopyCompare() {
  const [districtId, setDistrictId] = useState(DISTRICTS[0].id)
  const [pos, setPos] = useState(50)
  const district = DISTRICTS.find((d) => d.id === districtId) ?? DISTRICTS[0]

  const seed = DISTRICTS.findIndex((d) => d.id === district.id) * 7919 + 97
  const oldDots = useMemo(() => canopyDots(seed, Math.round((district.c1997 / 100) * MAX_DOTS)), [seed, district.c1997])
  const newDots = useMemo(() => canopyDots(seed + 5, Math.round((district.c2046 / 100) * MAX_DOTS)), [seed, district.c2046])

  const layer = (dots: Dot[], fill: string, label: string) => (
    <svg viewBox="0 0 160 90" aria-hidden className="mchs-canopy__dotsvg">
      <g fill={fill}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} opacity={d.o} />
        ))}
      </g>
      <text x="4" y="84" className="mchs-canopy__year">{label}</text>
    </svg>
  )

  return (
    <figure className="mchs-canopy">
      <div className="mchs-canopy__chips" role="group" aria-label="Choose a district">
        {DISTRICTS.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`mchs-canopy__chip ${d.id === district.id ? 'is-active' : ''}`}
            aria-pressed={d.id === district.id}
            onClick={() => setDistrictId(d.id)}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="mchs-canopy__stage">
        <div className="mchs-canopy__layer mchs-canopy__layer--old">{layer(oldDots, '#7d8378', `${district.c1997}% — 1997`)}</div>
        <div className="mchs-canopy__layer mchs-canopy__layer--new" style={{ clipPath: `inset(0 0 0 ${100 - pos}%)` }}>
          {layer(newDots, '#7d9378', `${district.c2046}% — 2046 (planned)`)}
        </div>
        <div className="mchs-canopy__hairline" style={{ left: `${100 - pos}%` }} aria-hidden />
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="mchs-canopy__range"
          aria-label={`Compare canopy cover in ${district.name}: left of the line is 1997, right is the 2046 plan`}
        />
      </div>

      <figcaption className="mchs-canopy__cap">
        <div>
          <b className="mono">{district.name}</b>
          <p>{district.blurb}</p>
        </div>
        <div className="mchs-canopy__nums mono">
          <span>
            1997 · <b>{district.c1997}%</b> canopy
          </span>
          <span>
            2046 plan · <b>{district.c2046}%</b> canopy
          </span>
          <span className="mchs-canopy__delta">+{district.c2046 - district.c1997} pts of shade</span>
        </div>
      </figcaption>
    </figure>
  )
}
