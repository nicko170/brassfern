import { useEffect, useState } from 'react'
import type { YearPoint } from './data'

/**
 * Ten-year savings chart. Teal blocks are each year's bill savings; the gold
 * line is the cumulative cash position from day one (starting at the net
 * install price, below zero). Bars morph smoothly when inputs change, and
 * reveal with a stagger on mount — both fully static under reduced motion.
 */

const VBW = 640
const VBH = 336
const ML = 58
const MR = 20
const MT = 30
const MB = 38
const PW = VBW - ML - MR
const PH = VBH - MT - MB

function fmtK(n: number): string {
  const sign = n < 0 ? '−' : ''
  const abs = Math.abs(n)
  if (abs >= 1000) {
    const k = Math.round(abs / 100) / 10
    return `${sign}$${Number.isInteger(k) ? k : k.toFixed(1)}k`
  }
  return `${sign}$${abs}`
}

export default function SavingsChart({
  years,
  breakEven,
}: {
  years: YearPoint[]
  breakEven: number | null
}) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = window.requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const cmin = Math.min(0, ...years.map((y) => y.cumulative))
  const cmax = Math.max(0, ...years.map((y) => y.cumulative))
  const span = cmax - cmin || 1

  const px = (i: number) => ML + (PW * i) / 10
  const py = (v: number) => MT + (PH * (cmax - v)) / span
  const zeroY = py(0)

  const barMax = Math.max(...years.map((y) => y.annual)) * 1.12 || 1

  // gridline ticks on the cumulative scale
  const rawStep = span / 3
  const pow = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const step = Math.max(500, Math.round(rawStep / pow) * pow)
  const ticks: number[] = []
  for (let v = Math.ceil(cmin / step) * step; v <= cmax; v += step) {
    if (ticks.indexOf(0) === -1 && v > 0) ticks.push(0)
    ticks.push(v)
  }

  const linePoints = years.map((y, i) => `${px(i).toFixed(1)},${py(y.cumulative).toFixed(1)}`)
  const lineD = `M${linePoints.join(' L')}`
  const areaD = `${lineD} L${ML + PW},${zeroY.toFixed(1)} L${ML},${zeroY.toFixed(1)} Z`

  const last = years[years.length - 1]

  // interpolated break-even point on the zero line
  let beX: number | null = null
  if (breakEven !== null) {
    const i = Math.min(9, Math.floor(breakEven))
    beX = px(i) + (PW / 10) * (breakEven - i)
  }

  const barW = (PW / 11) * 0.52

  return (
    <div className={`bsq-chart${on ? ' bsq-chart--on' : ''}`}>
      <svg viewBox={`0 0 ${VBW} ${VBH}`} role="img" aria-label={`Ten-year savings chart. Break-even ${breakEven ? `at about ${breakEven} years` : 'beyond ten years'}, net position after ten years ${fmtK(last.cumulative)}.`}>
        <defs>
          <linearGradient id="bsq-cum-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2b124" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#f2b124" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={ML} x2={ML + PW} y1={py(t)} y2={py(t)} className={`bsq-chart__grid${t === 0 ? ' bsq-chart__grid--zero' : ''}`} />
            <text x={ML - 8} y={py(t) + 3.5} className="bsq-chart__ticklabel">
              {fmtK(t)}
            </text>
          </g>
        ))}

        {/* area under the cumulative line */}
        <path d={areaD} fill="url(#bsq-cum-fill)" className="bsq-chart__area" />

        {/* annual saving bars */}
        {years.map((y, i) =>
          i === 0 ? null : (
            <rect
              key={y.year}
              x={px(i) - barW / 2}
              y={MT}
              width={barW}
              height={Math.max(2, zeroY - MT)}
              rx="3"
              className="bsq-chart__bar"
              style={{ '--f': y.annual / barMax, '--i': i } as React.CSSProperties}
            />
          ),
        )}

        {/* cumulative line */}
        <path d={lineD} pathLength={1} className="bsq-chart__cum" />

        {/* end point + label */}
        <circle cx={ML + PW} cy={py(last.cumulative)} r="4.5" className="bsq-chart__enddot" />
        <text x={ML + PW - 8} y={Math.max(MT - 4, py(last.cumulative) - 12)} className="bsq-chart__endlabel">
          {fmtK(last.cumulative)} net
        </text>

        {/* break-even marker */}
        {beX !== null && (
          <g className="bsq-chart__be">
            <line x1={beX} x2={beX} y1={zeroY} y2={MT + 44} className="bsq-chart__be-line" />
            <circle cx={beX} cy={zeroY} r="5" className="bsq-chart__be-dot" />
            <text
              x={beX < ML + PW * 0.7 ? beX : beX - 4}
              y={zeroY - 12}
              className="bsq-chart__be-label"
              textAnchor={beX < ML + PW * 0.7 ? 'start' : 'end'}
            >
              break-even ≈ {breakEven} yrs
            </text>
          </g>
        )}

        {/* x labels */}
        <text x={ML} y={VBH - 12} className="bsq-chart__xlabel">Now</text>
        <text x={ML + PW / 2} y={VBH - 12} className="bsq-chart__xlabel" textAnchor="middle">5 yrs</text>
        <text x={ML + PW} y={VBH - 12} className="bsq-chart__xlabel" textAnchor="end">10 yrs</text>
      </svg>
      <p className="bsq-chart__legend">
        <span><i className="bsq-chart__key bsq-chart__key--bar" /> savings each year</span>
        <span><i className="bsq-chart__key bsq-chart__key--line" /> cumulative cash position</span>
      </p>
    </div>
  )
}
