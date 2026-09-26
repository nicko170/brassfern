import { useCallback, useEffect, useMemo, useRef } from 'react'
import { barsFor, fmtClock } from './data'

/**
 * Seeded canvas waveform. Bars are deterministic per episode; the played
 * portion fills ochre and a faint aurora band chases the playhead while
 * playing (stilled under prefers-reduced-motion, where updates arrive as
 * quiet steps instead of a sweep). The strip is a full ARIA slider:
 * pointer to seek, arrows ±5 s, Page keys ±60 s, Home/End.
 */

interface Props {
  seed: number
  duration: number
  pos: number
  chapterFracs: number[]
  playing: boolean
  reduced: boolean
  onSeek: (seconds: number) => void
  label: string
}

const BARS = 132

export default function Waveform({
  seed,
  duration,
  pos,
  chapterFracs,
  playing,
  reduced,
  onSeek,
  label,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ pos, duration, playing, reduced })
  stateRef.current = { pos, duration, playing, reduced }

  const bars = useMemo(() => barsFor(seed, BARS), [seed])

  const draw = useCallback(
    (phase: number) => {
      const canvas = canvasRef.current
      const wrap = wrapRef.current
      if (!canvas || !wrap) return
      const { pos: p, duration: d, playing: pl, reduced: rd } = stateRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const frac = d > 0 ? Math.min(1, Math.max(0, p / d)) : 0
      const gap = Math.max(1, Math.round(w / BARS / 3.2))
      const bw = (w - gap * (BARS - 1)) / BARS
      const mid = h * 0.5

      for (let i = 0; i < BARS; i++) {
        const x = i * (bw + gap)
        const v = bars[i] ?? 0
        const bh = Math.max(2, v * (h * 0.82))
        const barFrac = (i + 0.5) / BARS
        const played = barFrac <= frac
        let alpha = played ? 0.95 : 0.2
        // aurora band chasing the playhead (motion-safe: only when playing)
        if (pl && !rd) {
          const dist = Math.abs(barFrac - frac)
          alpha += 0.34 * Math.max(0, 1 - dist * 11) * (0.66 + 0.34 * Math.sin(phase))
        }
        ctx.fillStyle = played
          ? `rgba(217,152,63,${Math.min(1, alpha).toFixed(3)})`
          : `rgba(242,234,210,${Math.min(1, alpha).toFixed(3)})`
        ctx.fillRect(x, mid - bh / 2, bw, bh)
      }

      // chapter ticks
      ctx.fillStyle = 'rgba(217,152,63,.55)'
      for (const f of chapterFracs) {
        if (f <= 0 || f >= 1) continue
        const x = Math.round(f * w) + 0.5
        ctx.fillRect(x, 0, 1, 7)
        ctx.fillRect(x, h - 7, 1, 7)
      }

      // playhead
      const cx = Math.round(frac * w) + 0.5
      ctx.fillStyle = 'rgba(14,16,32,.85)'
      ctx.fillRect(cx - 2, 0, 5, h)
      ctx.fillStyle = '#f2ead2'
      ctx.fillRect(cx, 0, 1.5, h)
    },
    [bars, chapterFracs],
  )

  /* size the canvas to the wrapper, honouring DPR */
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const fit = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.max(40, Math.round(rect.width * dpr))
      canvas.height = Math.max(24, Math.round(rect.height * dpr))
      draw(0)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [draw])

  /* static redraws on progress change */
  useEffect(() => {
    draw(0)
  }, [pos, draw])

  /* aurora sweep while playing — a real rAF sweep unless reduced motion */
  useEffect(() => {
    if (!playing || reduced) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      draw(((now - t0) / 900) * Math.PI)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, reduced, draw])

  /* ------------------------------------------------------------ input */

  const fracFromPointer = useCallback((clientX: number): number => {
    const wrap = wrapRef.current
    if (!wrap) return 0
    const r = wrap.getBoundingClientRect()
    return Math.min(1, Math.max(0, (clientX - r.left) / Math.max(1, r.width)))
  }, [])

  const seekToClientX = useCallback(
    (clientX: number) => onSeek(fracFromPointer(clientX) * duration),
    [fracFromPointer, onSeek, duration],
  )

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    wrapRef.current?.setPointerCapture(e.pointerId)
    wrapRef.current?.focus()
    seekToClientX(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return
    seekToClientX(e.clientX)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = (k: number) => {
      e.preventDefault()
      e.stopPropagation()
      onSeek(Math.min(duration, Math.max(0, pos + k)))
    }
    switch (e.key) {
      case 'ArrowLeft':
        step(-5)
        break
      case 'ArrowRight':
        step(5)
        break
      case 'PageDown':
        step(-60)
        break
      case 'PageUp':
        step(60)
        break
      case 'Home':
        e.preventDefault()
        e.stopPropagation()
        onSeek(0)
        break
      case 'End':
        e.preventDefault()
        e.stopPropagation()
        onSeek(duration)
        break
    }
  }

  return (
    <div
      ref={wrapRef}
      className="os-wave"
      role="slider"
      tabIndex={0}
      aria-label={`Seek within ${label}`}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(pos)}
      aria-valuetext={`${fmtClock(pos)} of ${fmtClock(duration)}`}
      aria-orientation="horizontal"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
    >
      <canvas ref={canvasRef} className="os-wave__canvas" />
    </div>
  )
}
