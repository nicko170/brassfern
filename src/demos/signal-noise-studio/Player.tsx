import { useMemo } from 'react'
import CoverArt from './Covers'
import { ScrubWave } from './Waveform'
import {
  RATES,
  fmtTime,
  lineAt,
  peaksFor,
  type Episode,
  type Show,
} from './data'

/**
 * The docked network player — persists across the whole demo while you
 * browse. Silent simulation: position is a timer, not audio. A live
 * caption follows the playhead through the episode transcript.
 */

interface Props {
  ep: Episode
  show: Show
  pos: number
  playing: boolean
  rateIdx: number
  guard: { a: number; b: number } | null
  next: Episode | null
  onToggle: () => void
  onSeek: (t: number) => void
  onSkip: (dt: number) => void
  onCycleRate: () => void
  onOpenClip: () => void
  onStop: () => void
}

export default function Player({
  ep,
  show,
  pos,
  playing,
  rateIdx,
  guard,
  next,
  onToggle,
  onSeek,
  onSkip,
  onCycleRate,
  onOpenClip,
  onStop,
}: Props) {
  const peaks = useMemo(() => peaksFor(ep, 12), [ep])
  const caption = lineAt(ep, pos)
  const rate = RATES[rateIdx] ?? 1

  return (
    <div className="sns-player" role="region" aria-label="Network player">
      <div className="sns-player__now">
        <CoverArt show={show} className="sns-player__art" />
        <div className="sns-player__meta">
          <span className="sns-player__show" style={{ color: show.accent }}>
            {show.title}
          </span>
          <span className="sns-player__title">{ep.title}</span>
          <span className="sns-player__caption" aria-hidden="true">
            {guard
              ? `CLIP ${fmtTime(guard.a)}–${fmtTime(guard.b)}`
              : caption
                ? `“${caption.tx}”`
                : 'S+N · sim · no audio'}
          </span>
        </div>
      </div>

      <div className="sns-player__deck">
        <div className="sns-player__transport">
          <button
            type="button"
            className="sns-btn sns-btn--icon"
            onClick={() => onSkip(-15)}
            aria-label="Back 15 seconds"
          >
            −15
          </button>
          <button
            type="button"
            className={`sns-btn sns-btn--play${playing ? ' is-playing' : ''}`}
            onClick={onToggle}
            aria-label={playing ? 'Pause' : 'Play'}
            aria-pressed={playing}
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <button
            type="button"
            className="sns-btn sns-btn--icon"
            onClick={() => onSkip(15)}
            aria-label="Forward 15 seconds"
          >
            +15
          </button>
        </div>
        <div className="sns-player__wave">
          <span className="sns-player__time" aria-hidden="true">
            {fmtTime(pos)}
          </span>
          <ScrubWave
            peaks={peaks}
            pos={pos}
            dur={ep.duration}
            accent={show.accent}
            label={ep.title}
            onSeek={onSeek}
          />
          <span className="sns-player__time" aria-hidden="true">
            −{fmtTime(ep.duration - pos)}
          </span>
        </div>
      </div>

      <div className="sns-player__side">
        <button
          type="button"
          className="sns-btn sns-btn--mono"
          onClick={onCycleRate}
          aria-label={`Playback speed ${rate}× — press to change`}
        >
          {rate}×
        </button>
        <button type="button" className="sns-btn sns-btn--clip" onClick={onOpenClip}>
          ✂ Cut clip
        </button>
        <button type="button" className="sns-btn sns-btn--icon" onClick={onStop} aria-label="Stop and clear player">
          ✕
        </button>
      </div>

      {next && (
        <span className="sns-player__next" aria-hidden="true">
          UP NEXT — {next.title.toUpperCase()}
        </span>
      )}
    </div>
  )
}
