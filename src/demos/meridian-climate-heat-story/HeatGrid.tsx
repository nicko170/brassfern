/**
 * HeatGrid — the sticky canvas exhibit. 96 fictional blocks of Greater
 * Meridian; each paints its summer anomaly through a thermal ramp.
 * `amount` 1 = the summer as recorded, 0 = the same summer wearing the
 * Shade Budget's canopy. The display value is lerped in a rAF loop for
 * motion users and jumped instantaneously under prefers-reduced-motion.
 * Pointer hover/tap inspects a block; the full table lives in the
 * <details> below the exhibit for keyboard and screen-reader readers.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AVG_ANOMALY,
  AVG_PLANNED,
  COLS,
  HOT_BLOCK,
  RAMP_GRADIENT,
  ROWS,
  SUBURBS,
  heatColor,
  round1,
  type Suburb,
} from './data'

interface Props {
  amount: number
  emphasis: Suburb[] | null
  reduced: boolean
  headline: string
}

const SUBURB_INDEX = new Map(SUBURBS.map((s, i) => [s.id, i]))

/** Manual rounded-rect path — avoids depending on ctx.roundRect availability. */
function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export default function HeatGrid({ amount, emphasis, reduced, headline }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shown = useRef(amount)
  const hoverRef = useRef(-1)
  const [hover, setHover] = useState(-1)
  const emphasisRef = useRef<Suburb[] | null>(emphasis)
  emphasisRef.current = emphasis

  // Render loop: lerp toward the target, wobble gently, stop when settled.
  useEffect(() => {
    if (reduced) shown.current = amount
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = 0

    const draw = (t: number) => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      if (canvas.width !== Math.round(rect.width * dpr)) {
        canvas.width = Math.round(rect.width * dpr)
        canvas.height = Math.round(rect.height * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // background of the exhibit "screen"
      ctx.clearRect(0, 0, rect.width, rect.height)

      const pad = 10
      const gap = 4
      const cw = (rect.width - pad * 2 - gap * (COLS - 1)) / COLS
      const ch = (rect.height - pad * 2 - gap * (ROWS - 1)) / ROWS
      const r = Math.min(5, cw * 0.18)
      const amt = shown.current
      const emp = emphasisRef.current
      const empSet = emp ? new Set(emp.map((s) => s.id)) : null

      for (const s of SUBURBS) {
        let v = s.planned + (s.anomaly - s.planned) * amt
        if (!reduced) v += Math.sin(t * 0.0011 + (s.col * 7 + s.row * 13)) * 0.12
        const x = pad + s.col * (cw + gap)
        const y = pad + s.row * (ch + gap)
        const hovered = hoverRef.current === SUBURB_INDEX.get(s.id)

        ctx.beginPath()
        roundRectPath(ctx, x, y, cw, ch, r)
        ctx.fillStyle = heatColor(v)
        ctx.globalAlpha = empSet && !empSet.has(s.id) && !hovered ? 0.34 : 1
        ctx.fill()
        if (s.water) {
          // harbour water reads as wave ticks, not a block
          ctx.fillStyle = 'rgba(21,22,25,0.55)'
          ctx.fill()
          ctx.globalAlpha = 1
          ctx.strokeStyle = 'rgba(127,180,212,0.55)'
          ctx.lineWidth = 1
          for (let w = 0; w < 2; w++) {
            ctx.beginPath()
            ctx.moveTo(x + cw * 0.22, y + ch * (0.36 + w * 0.28))
            ctx.lineTo(x + cw * 0.78, y + ch * (0.36 + w * 0.28))
            ctx.stroke()
          }
        } else {
          ctx.globalAlpha = 1
        }
        if (s.park) {
          ctx.strokeStyle = 'rgba(125,147,120,0.9)'
          ctx.setLineDash([2, 3])
          ctx.stroke()
          ctx.setLineDash([])
        }
        if (hovered) {
          ctx.strokeStyle = '#eceae3'
          ctx.lineWidth = 1.6
          ctx.stroke()
        }
      }
    }

    const tick = (t: number) => {
      const diff = amount - shown.current
      if (reduced) shown.current = amount
      else shown.current += diff * 0.07
      // settle check — stop the loop when close and hold a last static frame
      if (Math.abs(amount - shown.current) < 0.004) shown.current = amount
      const settled = shown.current === amount
      if (!settled || !reduced || t - last > 120) {
        draw(reduced ? 0 : t)
        last = t
      }
      if (!settled || !reduced) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // hover changes repaint via the same loop (hoverRef read every frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, reduced, hover])

  // pointer inspect
  const cellAt = (clientX: number, clientY: number): number => {
    const canvas = canvasRef.current
    if (!canvas) return -1
    const rect = canvas.getBoundingClientRect()
    const pad = 10
    const gap = 4
    const cw = (rect.width - pad * 2 - gap * (COLS - 1)) / COLS
    const ch = (rect.height - pad * 2 - gap * (ROWS - 1)) / ROWS
    const x = clientX - rect.left
    const y = clientY - rect.top
    const col = Math.floor((x - pad + gap / 2) / (cw + gap))
    const row = Math.floor((y - pad + gap / 2) / (ch + gap))
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return -1
    return row * COLS + col
  }

  const hoveredSuburb = hover >= 0 ? SUBURBS[hover] : null
  const spared = round1(HOT_BLOCK.anomaly - HOT_BLOCK.planned)

  const ariaSummary =
    amount > 0.5
      ? `Illustrative heat anomaly map of Greater Meridian, summer 2045–46, as recorded. Hottest block: ${HOT_BLOCK.name} at plus ${HOT_BLOCK.anomaly} degrees.`
      : `Illustrative heat anomaly map of Greater Meridian under the fictional Shade Budget canopy plan. Hottest block falls to plus ${HOT_BLOCK.planned} degrees.`

  return (
    <figure className="mchs-heat">
      <figcaption className="mchs-heat__cap mono">
        <span>{headline}</span>
        <b>{amount > 0.5 ? 'AS RECORDED' : 'WITH THE SHADE BUDGET'}</b>
      </figcaption>
      <div className="mchs-heat__screen">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={ariaSummary}
          onPointerMove={(e) => {
            const idx = cellAt(e.clientX, e.clientY)
            if (idx !== hoverRef.current) {
              hoverRef.current = idx
              setHover(idx)
            }
          }}
          onPointerLeave={() => {
            hoverRef.current = -1
            setHover(-1)
          }}
        />
      </div>
      <div className="mchs-heat__legend" aria-hidden>
        <span className="mono">+0°</span>
        <i style={{ background: RAMP_GRADIENT }} />
        <span className="mono">+7.6°</span>
      </div>
      <p className="mchs-heat__readout mono" role="status">
        {hoveredSuburb ? (
          hoveredSuburb.water ? (
            <>
              {hoveredSuburb.name} — harbour water · <b>+{hoveredSuburb.anomaly.toFixed(1)}°C</b> anyway
            </>
          ) : (
            <>
              {hoveredSuburb.name} · now <b>+{hoveredSuburb.anomaly.toFixed(1)}°C</b> · with the plan{' '}
              <b>+{hoveredSuburb.planned.toFixed(1)}°C</b> · canopy {hoveredSuburb.canopy1997}%
              <span aria-hidden> → </span>
              <span className="mchs-heat__sr">to </span>
              {hoveredSuburb.canopy2046}%
            </>
          )
        ) : (
          <>
            City average <b>+{AVG_ANOMALY}°C</b> as recorded · <b>+{AVG_PLANNED}°C</b> under the plan · hover a
            block to inspect it
          </>
        )}
      </p>
      <p className="mchs-heat__foot mono">
        {HOT_BLOCK.name} peaks at +{HOT_BLOCK.anomaly}°C; the budget buys it {spared}°C back.
      </p>
      <details className="mchs-heat__table">
        <summary className="mono">All 96 blocks — the data table</summary>
        <div className="mchs-heat__scroll">
          <table>
            <caption className="mchs-heat__sr">
              Fictional per-block data: summer anomaly as recorded and with the Shade Budget, canopy cover 1997 and
              planned 2046.
            </caption>
            <thead>
              <tr>
                <th scope="col">Block</th>
                <th scope="col">Δ recorded</th>
                <th scope="col">Δ with plan</th>
                <th scope="col">Canopy ’97→’46</th>
              </tr>
            </thead>
            <tbody>
              {SUBURBS.map((s) => (
                <tr key={s.id}>
                  <th scope="row">{s.water ? `${s.name} (harbour)` : s.name}</th>
                  <td>+{s.anomaly.toFixed(1)}°C</td>
                  <td>+{s.planned.toFixed(1)}°C</td>
                  <td>
                    {s.canopy1997}% → {s.canopy2046}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}

/** Legend chips reused by the copy — tiny inline ramp sample. */
export function HeatScaleLabel() {
  const stops = useMemo(() => [0, 2, 4, 6, 7.6], [])
  return (
    <span className="mchs-scale mono" aria-hidden>
      {stops.map((v) => (
        <i key={v} style={{ background: heatColor(v) }} />
      ))}
    </span>
  )
}
