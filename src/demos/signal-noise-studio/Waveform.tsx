import { useCallback, useMemo, useRef, useState } from 'react'
import { fmtTime } from './data'

/**
 * Waveform rendering + the two interactive surfaces built on it:
 * - `<ScrubWave>` — click/drag/keyboard seek bar for the player
 * - `<ClipWave>` — two draggable handles selecting a clip window
 * Bars are a stretched SVG (preserveAspectRatio="none") so no canvas or
 * resize observer is needed; the seeded peaks make speech-like envelopes.
 */

const CREAM = '#f0ead6'
const DIM = 'rgba(240,234,214,0.24)'
const GHOST = 'rgba(240,234,214,0.10)'

interface BarsProps {
  peaks: number[]
  progress: number // 0..1
  window?: { a: number; b: number } | null // ratios 0..1
  accent: string
  height?: number
}

export function Bars({ peaks, progress, window: win, accent, height = 56 }: BarsProps) {
  const n = peaks.length
  const step = 4
  const bw = 3
  const H = 100
  const playedX = progress * n * step
  const aX = win ? win.a * n * step : -1
  const bX = win ? win.b * n * step : -1

  return (
    <svg
      className="sns-bars"
      viewBox={`0 0 ${n * step} ${H}`}
      height={height}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {peaks.map((p, i) => {
        const h = Math.max(4, p * (H - 10))
        const x = i * step
        let fill = GHOST
        if (win) {
          const inWin = x >= aX && x <= bX
          if (inWin) fill = x < playedX ? accent : DIM
          else fill = x < playedX ? 'rgba(240,234,214,0.34)' : GHOST
        } else if (x < playedX) {
          fill = CREAM
        }
        return <rect key={i} x={x} y={(H - h) / 2} width={bw} height={h} fill={fill} />
      })}
      {/* playhead */}
      <rect x={playedX - 1} y={0} width={2.5} height={H} fill={win ? accent : CREAM} />
    </svg>
  )
}

/* ------------------------------------------------------------ scrub */

interface ScrubProps {
  peaks: number[]
  pos: number
  dur: number
  accent: string
  label: string
  onSeek: (t: number) => void
}

export function ScrubWave({ peaks, pos, dur, accent, label, onSeek }: ScrubProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [scrubbing, setScrubbing] = useState(false)

  const toTime = useCallback(
    (e: React.PointerEvent) => {
      const wrap = wrapRef.current
      if (!wrap) return 0
      const r = wrap.getBoundingClientRect()
      return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * dur
    },
    [dur],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 15 : 5
    let t: number | null = null
    if (e.key === 'ArrowLeft') t = Math.max(0, pos - step)
    else if (e.key === 'ArrowRight') t = Math.min(dur, pos + step)
    else if (e.key === 'Home') t = 0
    else if (e.key === 'End') t = dur
    if (t != null) {
      e.preventDefault()
      onSeek(t)
    }
  }

  return (
    <div
      ref={wrapRef}
      className="sns-scrub"
      role="slider"
      tabIndex={0}
      aria-label={`Seek — ${label}`}
      aria-valuemin={0}
      aria-valuemax={Math.floor(dur)}
      aria-valuenow={Math.floor(pos)}
      aria-valuetext={`${fmtTime(pos)} of ${fmtTime(dur)}`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home End"
      onPointerDown={(e) => {
        if (e.button !== 0) return
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        setScrubbing(true)
        const t = toTime(e)
        setHover(t)
        onSeek(t)
      }}
      onPointerMove={(e) => {
        const t = toTime(e)
        setHover(t)
        if (scrubbing) onSeek(t)
      }}
      onPointerUp={() => setScrubbing(false)}
      onPointerCancel={() => setScrubbing(false)}
      onPointerLeave={() => setHover(null)}
      onKeyDown={onKeyDown}
    >
      <Bars peaks={peaks} progress={dur > 0 ? pos / dur : 0} accent={accent} />
      {hover != null && !scrubbing && (
        <span className="sns-scrub__tip" style={{ left: `${(hover / dur) * 100}%` }} aria-hidden="true">
          {fmtTime(hover)}
        </span>
      )}
    </div>
  )
}

/* --------------------------------------------------------- clip wave */

interface ClipProps {
  peaks: number[]
  dur: number
  pos: number
  accent: string
  a: number
  b: number
  minLen: number
  maxLen: number
  onChange: (a: number, b: number) => void
}

type DragTarget = 'a' | 'b' | 'win' | null

export function ClipWave({ peaks, dur, pos, accent, a, b, minLen, maxLen, onChange }: ClipProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ target: DragTarget; grabOffset: number }>({ target: null, grabOffset: 0 })

  /* clamp helpers keep the window in-bounds and within [minLen, maxLen] */
  const setA = useCallback(
    (na: number) => {
      let v = Math.max(0, Math.min(na, dur - minLen))
      if (b - v > maxLen) v = b - maxLen
      if (b - v < minLen) v = b - minLen
      onChange(Math.max(0, v), b)
    },
    [b, dur, minLen, maxLen, onChange],
  )
  const setB = useCallback(
    (nb: number) => {
      let v = Math.min(dur, Math.max(nb, minLen))
      if (v - a > maxLen) v = a + maxLen
      if (v - a < minLen) v = a + minLen
      onChange(a, Math.min(dur, v))
    },
    [a, dur, minLen, maxLen, onChange],
  )
  const moveWin = useCallback(
    (na: number) => {
      const len = b - a
      const v = Math.max(0, Math.min(dur - len, na))
      onChange(v, v + len)
    },
    [a, b, dur, onChange],
  )

  const toTime = useCallback(
    (clientX: number) => {
      const wrap = wrapRef.current
      if (!wrap) return 0
      const r = wrap.getBoundingClientRect()
      return Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * dur
    },
    [dur],
  )

  const startDrag = (target: DragTarget) => (e: React.PointerEvent) => {
    if (e.button !== 0) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    const t = toTime(e.clientX)
    dragRef.current = {
      target,
      grabOffset: target === 'win' ? t - a : 0,
    }
    e.preventDefault()
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const { target, grabOffset } = dragRef.current
    if (!target) return
    const t = toTime(e.clientX)
    if (target === 'a') setA(t)
    else if (target === 'b') setB(t)
    else moveWin(t - grabOffset)
  }
  const endDrag = () => {
    dragRef.current = { target: null, grabOffset: 0 }
  }

  /** clicking the bars outside the window snaps the nearest handle */
  const onTrackPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('.sns-clip__handle, [data-sns-win]')) return
    const t = toTime(e.clientX)
    if (t >= a && t <= b) return
    const nearerA = Math.abs(t - a) <= Math.abs(t - b)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragRef.current = { target: nearerA ? 'a' : 'b', grabOffset: 0 }
    if (nearerA) setA(t)
    else setB(t)
  }

  const handleKey = (which: 'a' | 'b') => (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 5 : 1
    const cur = which === 'a' ? a : b
    let t: number | null = null
    if (e.key === 'ArrowLeft') t = cur - step
    else if (e.key === 'ArrowRight') t = cur + step
    else if (e.key === 'Home') t = which === 'a' ? 0 : a + minLen
    else if (e.key === 'End') t = which === 'a' ? b - minLen : dur
    if (t != null) {
      e.preventDefault()
      if (which === 'a') setA(t)
      else setB(t)
    }
  }

  const aPct = (a / dur) * 100
  const bPct = (b / dur) * 100
  const progress = useMemo(() => (dur > 0 ? pos / dur : 0), [pos, dur])

  return (
    <div
      ref={wrapRef}
      className="sns-clip__wave"
      onPointerDown={onTrackPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Bars
        peaks={peaks}
        progress={progress}
        window={{ a: a / dur, b: b / dur }}
        accent={accent}
        height={104}
      />
      <div
        data-sns-win
        className="sns-clip__win"
        style={{ left: `${aPct}%`, width: `${bPct - aPct}%` }}
        onPointerDown={startDrag('win')}
        aria-hidden="true"
      >
        <span className="sns-clip__winlabel">{fmtTime(b - a)}</span>
      </div>
      <button
        type="button"
        className="sns-clip__handle sns-clip__handle--a"
        style={{ left: `${aPct}%` }}
        role="slider"
        aria-label="Clip start"
        aria-valuemin={0}
        aria-valuemax={Math.floor(dur)}
        aria-valuenow={Math.floor(a)}
        aria-valuetext={fmtTime(a)}
        aria-keyshortcuts="ArrowLeft ArrowRight Home End"
        onPointerDown={startDrag('a')}
        onKeyDown={handleKey('a')}
      >
        <span aria-hidden="true">◂</span>
      </button>
      <button
        type="button"
        className="sns-clip__handle sns-clip__handle--b"
        style={{ left: `${bPct}%` }}
        role="slider"
        aria-label="Clip end"
        aria-valuemin={0}
        aria-valuemax={Math.floor(dur)}
        aria-valuenow={Math.floor(b)}
        aria-valuetext={fmtTime(b)}
        aria-keyshortcuts="ArrowLeft ArrowRight Home End"
        onPointerDown={startDrag('b')}
        onKeyDown={handleKey('b')}
      >
        <span aria-hidden="true">▸</span>
      </button>
    </div>
  )
}
