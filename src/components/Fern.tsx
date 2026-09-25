import { useEffect, useRef } from 'react'

/**
 * The Brassfern hero — a Barnsley fern grown point by point on canvas,
 * inked in brass on paper. Pointer position gently shears the canvas via
 * CSS transform (cheap parallax). With prefers-reduced-motion the full
 * fern is rendered once, statically.
 */
export default function Fern() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let raf = 0
    let w = 0
    let h = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Barnsley fern IFS
    let x = 0
    let y = 0
    const mapX = (px: number) => ((px + 2.182) / (2.6558 + 2.182)) * w * 0.92 + w * 0.04
    const mapY = (py: number) => h - (py / 9.9983) * h * 0.96 - h * 0.02

    const brassTop = [230, 204, 138] // --brass-hi
    const fernDeep = [30, 77, 51] // --fern
    const ink = [24, 33, 22]

    function plot(): boolean {
      const r = Math.random()
      let nx: number, ny: number
      if (r < 0.01) {
        nx = 0
        ny = 0.16 * y
      } else if (r < 0.86) {
        nx = 0.85 * x + 0.04 * y
        ny = -0.04 * x + 0.85 * y + 1.6
      } else if (r < 0.93) {
        nx = 0.2 * x - 0.26 * y
        ny = 0.23 * x + 0.22 * y + 1.6
      } else {
        nx = -0.15 * x + 0.28 * y
        ny = 0.26 * x + 0.24 * y + 0.44
      }
      x = nx
      y = ny
      const t = y / 9.9983
      const rC = Math.round(fernDeep[0] + (brassTop[0] - fernDeep[0]) * t + ink[0] * 0.06 * (1 - t))
      const gC = Math.round(fernDeep[1] + (brassTop[1] - fernDeep[1]) * t)
      const bC = Math.round(fernDeep[2] + (brassTop[2] - fernDeep[2]) * t * 0.7)
      ctx!.fillStyle = `rgba(${rC},${gC},${bC},${0.5 + t * 0.4})`
      ctx!.fillRect(mapX(x), mapY(y), 1.25, 1.25)
      return false
    }

    const TOTAL = reduced ? 90000 : 56000
    let drawn = 0
    const tick = () => {
      const batch = reduced ? TOTAL : 480
      for (let i = 0; i < batch && drawn < TOTAL; i++) {
        plot()
        drawn++
      }
      if (drawn < TOTAL && !reduced) raf = requestAnimationFrame(tick)
    }
    tick()

    // pointer parallax — transform the element, never redraw
    const onMove = (e: PointerEvent) => {
      if (reduced) return
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      canvas.style.transform = `translate3d(${nx * -14}px, ${ny * -10}px, 0) rotate(${nx * -1.2}deg)`
    }
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="hero__fern" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  )
}
