/**
 * Promo sleeve — the Deck 02 house style: bone jacket, oxblood rubber
 * stamps, vinyl disc peeking with a machined sheen. CSS-only art; the only
 * type a real white-label would carry.
 */

import type { DeckTrack } from './data'
import { fmtMS, mulberry } from './data'

interface SleeveProps {
  track: DeckTrack
  /** how far the disc slides out when the sleeve is current / hovered */
  slipping?: boolean
}

export default function Sleeve({ track, slipping = false }: SleeveProps) {
  const rnd = mulberry(track.seed ^ 0x9e3779b9)
  const rot = (rnd() - 0.5) * 14 // stamp rotation
  const bars: number[] = []
  for (let i = 0; i < 18; i++) bars.push(1 + Math.floor(rnd() * 4))
  const notches = 3 + Math.floor(rnd() * 3)

  return (
    <div
      className={`hwp-sl${slipping ? ' hwp-sl--slip' : ''}`}
      style={{ '--tint': track.tint, '--stamp-rot': `${rot.toFixed(1)}deg` } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="hwp-sl__disc">
        <div className="hwp-sl__label" />
      </div>
      <div className="hwp-sl__jacket">
        <span className="hwp-sl__corner">DECK 02</span>
        <span className="hwp-sl__cat">{track.cat}</span>
        <span className="hwp-sl__bars">
          {bars.map((wdt, i) => (
            <i key={i} style={{ width: wdt }} />
          ))}
        </span>
        <span className="hwp-sl__stamp">PROMO · NOT FOR RESALE</span>
        <span className="hwp-sl__meta">
          {track.artist.toUpperCase()} — {track.title.toUpperCase()}
          <br />
          {fmtMS(track.dur)} · {track.bpm} BPM · {track.keySig.toUpperCase()}
        </span>
        <span className="hwp-sl__notches">
          {Array.from({ length: notches }, (_, i) => (
            <i key={i} />
          ))}
        </span>
      </div>
    </div>
  )
}

/** Tiny sleeve for the incoming strip / queue rows. */
export function SleeveChip({ track }: { track: DeckTrack }) {
  return (
    <div className="hwp-chip" style={{ '--tint': track.tint } as React.CSSProperties} aria-hidden="true">
      <i className="hwp-chip__dot" />
      <span className="hwp-chip__cat">{track.cat}</span>
    </div>
  )
}
