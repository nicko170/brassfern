import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { DeckTrack } from './data'
import { XFADE, beatsFor, fmtMS, fmtTC, peaksFor } from './data'

/**
 * The deck face: a canvas-rendered waveform with beat ruler, cue flags,
 * beat-precise scrubbing and a crossfade window that shows the incoming
 * plate's opening bars waxing over the run-out. No audio — simulation only.
 */

interface WaveformProps {
  track: DeckTrack
  pos: number
  playing: boolean
  crossfade: boolean
  incoming: DeckTrack | null
  reduced: boolean
  onSeek: (seconds: number) => void
}

const C = {
  bone: '#eadfc8',
  boneDim: 'rgba(234,223,200,0.20)',
  boneGhost: 'rgba(234,223,200,0.08)',
  ox: '#a62b3c',
  oxHi: '#d04859',
  ruler: 'rgba(234,223,200,0.42)',
  cueText: '#e6cdbd',
}

const RULER_H = 16

export default function Waveform({
  track,
  pos,
  playing,
  crossfade,
  incoming,
  reduced,
  onSeek,
}: WaveformProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hover, setHover] = useState<number | null>(null) // seconds
  const [scrubbing, setScrubbing] = useState(false)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })

  const peaks = useMemo(() => peaksFor(track), [track])
  const inPeaks = useMemo(
    () => (incoming ? peaksFor(incoming, 96) : null),
    [incoming],
  )
  const grid = useMemo(() => beatsFor(track), [track])

  const dur = track.dur
  const xfOn = crossfade && incoming != null && !reduced
  const xfStart = dur - XFADE
  const inZone = xfOn && pos >= xfStart
  const xfProg = inZone ? Math.min(1, (pos - xfStart) / XFADE) : 0

  /* ------------------------------------------------ canvas painting */
  const paintRef = useRef<() => void>(() => {})
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const paint = () => {
      const { w, h, dpr } = sizeRef.current
      if (w === 0 || h === 0) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const bodyH = h - RULER_H
      const mid = RULER_H + bodyH / 2
      const pxPerSec = w / dur
      const playedX = (pos / dur) * w

      /* groove bed */
      ctx.fillStyle = 'rgba(0,0,0,0.18)'
      ctx.fillRect(0, RULER_H, w, bodyH)

      /* beat ruler */
      ctx.strokeStyle = C.boneGhost
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, RULER_H - 0.5)
      ctx.lineTo(w, RULER_H - 0.5)
      ctx.stroke()
      for (const b of grid.beats) {
        const x = Math.round(b * pxPerSec) + 0.5
        const isBar = Math.round(b / (60 / track.bpm)) % 4 === 0
        ctx.strokeStyle = isBar ? C.ruler : C.boneGhost
        ctx.beginPath()
        ctx.moveTo(x, RULER_H - (isBar ? 9 : 5))
        ctx.lineTo(x, RULER_H)
        ctx.stroke()
      }
      ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.fillStyle = C.boneGhost
      grid.bars.forEach((b, i) => {
        if (i % 2 !== 0) return
        const x = b * pxPerSec + 3
        if (x < w - 24) ctx.fillText(String(i + 1).padStart(2, '0'), x, 10)
      })

      /* bars — bucket peaks to pixel columns */
      const step = 3
      const cols = Math.floor(w / step)
      const n = peaks.length
      const xfZoneX = xfOn ? xfStart * pxPerSec : w
      for (let c = 0; c < cols; c++) {
        const x = c * step
        const i0 = Math.floor((c / cols) * n)
        let p = peaks[i0] ?? 0
        const i1 = Math.floor(((c + 1) / cols) * n)
        for (let i = i0 + 1; i < i1; i++) p = Math.max(p, peaks[i] ?? 0)
        const bh = Math.max(1.5, p * (bodyH - 14))
        if (x < xfZoneX) {
          ctx.fillStyle = x < playedX ? C.bone : C.boneDim
          ctx.fillRect(x, mid - bh / 2, step - 1, bh)
        }
      }

      /* crossfade window */
      if (xfOn) {
        const zx = xfStart * pxPerSec
        const zw = w - zx
        /* region tint */
        const g = ctx.createLinearGradient(zx, 0, w, 0)
        g.addColorStop(0, 'rgba(166,43,60,0)')
        g.addColorStop(1, 'rgba(166,43,60,0.26)')
        ctx.fillStyle = g
        ctx.fillRect(zx, RULER_H, zw, bodyH)
        /* outgoing bars inside zone, waxing down */
        const oCols = Math.floor(zw / step)
        for (let c = 0; c < oCols; c++) {
          const x = zx + c * step
          const i = Math.floor(((zx + c * step) / w) * n)
          const p = peaks[i] ?? 0
          const bh = Math.max(1.5, p * (bodyH - 14))
          const fadeOut = 1 - (c / oCols) * 0.72
          ctx.fillStyle = x < playedX ? C.bone : C.boneDim
          ctx.globalAlpha = fadeOut
          ctx.fillRect(x, mid - bh / 2, step - 1, bh)
          ctx.globalAlpha = 1
        }
        /* incoming opening bars waxing in */
        if (inPeaks) {
          const ip = inPeaks.length
          for (let c = 0; c < oCols; c++) {
            const x = zx + c * step
            const i = Math.floor((c / oCols) * ip)
            const p = inPeaks[i] ?? 0
            const bh = Math.max(1.5, p * (bodyH - 14) * 0.92)
            const rise = (c / oCols) * (inZone ? 0.55 + xfProg * 0.45 : 0.45)
            ctx.fillStyle = C.ox
            ctx.globalAlpha = Math.min(0.95, rise)
            ctx.fillRect(x, mid - bh / 2, step - 1, bh)
            ctx.globalAlpha = 1
          }
        }
        /* X curves */
        ctx.strokeStyle = 'rgba(208,72,89,0.5)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(zx, RULER_H + 4)
        ctx.lineTo(w, h - 4)
        ctx.moveTo(zx, h - 4)
        ctx.lineTo(w, RULER_H + 4)
        ctx.stroke()
        /* boundary + label */
        ctx.strokeStyle = C.oxHi
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.moveTo(zx + 0.5, RULER_H)
        ctx.lineTo(zx + 0.5, h)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = C.cueText
        ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText('X-FADE', zx + 6, RULER_H + 12)
      }

      /* cue flags */
      ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace'
      for (const cue of track.cues) {
        const x = cue.t * pxPerSec
        ctx.strokeStyle = C.oxHi
        ctx.beginPath()
        ctx.moveTo(x + 0.5, RULER_H + 2)
        ctx.lineTo(x + 0.5, RULER_H + 12)
        ctx.moveTo(x + 0.5, RULER_H + 2)
        ctx.lineTo(x + 7.5, RULER_H + 2)
        ctx.stroke()
        ctx.fillStyle = C.cueText
        ctx.fillText(cue.label, x + 10, RULER_H + 10)
      }

      /* hover scrub line */
      if (hover != null && !scrubbing) {
        const x = (hover / dur) * w
        ctx.strokeStyle = 'rgba(234,223,200,0.35)'
        ctx.beginPath()
        ctx.moveTo(x + 0.5, RULER_H)
        ctx.lineTo(x + 0.5, h)
        ctx.stroke()
      }

      /* playhead */
      ctx.strokeStyle = '#fff7e6'
      ctx.lineWidth = 1.6
      if (playing && !reduced) {
        ctx.shadowColor = 'rgba(234,223,200,0.8)'
        ctx.shadowBlur = 8
      }
      ctx.beginPath()
      ctx.moveTo(Math.round(playedX) + 0.5, RULER_H)
      ctx.lineTo(Math.round(playedX) + 0.5, h)
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.lineWidth = 1
      ctx.fillStyle = '#fff7e6'
      ctx.beginPath()
      ctx.moveTo(playedX - 4, RULER_H)
      ctx.lineTo(playedX + 4, RULER_H)
      ctx.lineTo(playedX, RULER_H + 5)
      ctx.closePath()
      ctx.fill()
    }

    paintRef.current = paint
    paint()
  }, [peaks, inPeaks, grid, track, pos, hover, scrubbing, playing, reduced, xfOn, inZone, xfProg, dur, xfStart])

  /* sizing — own effect so the observer isn't re-created per frame */
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ro = new ResizeObserver(() => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      sizeRef.current = { w: rect.width, h: rect.height, dpr }
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      paintRef.current()
    })
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  /* ------------------------------------------------ interactions */
  const ratioFromEvent = useCallback(
    (e: React.PointerEvent) => {
      const wrap = wrapRef.current
      if (!wrap) return 0
      const rect = wrap.getBoundingClientRect()
      return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    },
    [],
  )

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setScrubbing(true)
    const t = ratioFromEvent(e) * dur
    setHover(t)
    onSeek(t)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const t = ratioFromEvent(e) * dur
    setHover(t)
    if (scrubbing) onSeek(t)
  }
  const endScrub = () => setScrubbing(false)

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 15 : 5
    let handled = true
    let t = pos
    switch (e.key) {
      case 'ArrowLeft':
        t = Math.max(0, pos - step)
        break
      case 'ArrowRight':
        t = Math.min(dur, pos + step)
        break
      case 'Home':
        t = 0
        break
      case 'End':
        t = dur
        break
      default:
        handled = false
    }
    if (handled) {
      e.preventDefault()
      onSeek(t)
    }
  }

  return (
    <div
      ref={wrapRef}
      className={`hwp-wave${scrubbing ? ' hwp-wave--scrub' : ''}`}
      role="slider"
      tabIndex={0}
      aria-label={`Seek — ${track.title}`}
      aria-valuemin={0}
      aria-valuemax={Math.floor(dur)}
      aria-valuenow={Math.floor(pos)}
      aria-valuetext={`${fmtMS(pos)} of ${fmtMS(dur)}`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home End"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endScrub}
      onPointerCancel={endScrub}
      onPointerLeave={() => setHover(null)}
      onKeyDown={onKeyDown}
    >
      <canvas ref={canvasRef} className="hwp-wave__canvas" aria-hidden="true" />
      {hover != null && !scrubbing && (
        <span
          className="hwp-wave__tip"
          style={{ left: `${(hover / dur) * 100}%` }}
          aria-hidden="true"
        >
          {fmtTC(hover)}
        </span>
      )}
      {xfOn && (
        <span className="hwp-wave__xmeta" aria-hidden="true">
          {inZone
            ? `MIXING → ${incoming?.artist.toUpperCase()} · ${Math.round(xfProg * 100)}%`
            : `NEXT: ${incoming?.artist.toUpperCase()} — ${incoming?.title.toUpperCase()}`}
        </span>
      )}
    </div>
  )
}
