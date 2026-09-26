import { ORIENTATIONS } from './data'

/**
 * Compass dial for roof orientation. The ring, ticks and the gold wedge are
 * decorative SVG; each of the eight sectors is a real button floated on top,
 * so the whole thing is keyboard and screen-reader friendly.
 */

function sectorPath(cx: number, cy: number, r: number, degCentre: number, half = 21.5): string {
  const a0 = ((degCentre - half - 90) * Math.PI) / 180
  const a1 = ((degCentre + half - 90) * Math.PI) / 180
  const x0 = cx + r * Math.cos(a0)
  const y0 = cy + r * Math.sin(a0)
  const x1 = cx + r * Math.cos(a1)
  const y1 = cy + r * Math.sin(a1)
  return `M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`
}

export default function Compass({
  selectedId,
  onChange,
}: {
  selectedId: string
  onChange: (id: string) => void
}) {
  const selected = ORIENTATIONS.find((o) => o.id === selectedId) ?? ORIENTATIONS[0]

  return (
    <div className="bsq-compass__wrap">
      <div className="bsq-compass" role="radiogroup" aria-label="Which way does the main roof face?">
        <svg className="bsq-compass__svg" viewBox="0 0 240 240" aria-hidden="true">
          <defs>
            <radialGradient id="bsq-sun" cx="50%" cy="42%" r="62%">
              <stop offset="0%" stopColor="#ffd978" />
              <stop offset="58%" stopColor="#f2b124" />
              <stop offset="100%" stopColor="#d99309" />
            </radialGradient>
          </defs>
          {/* face */}
          <circle cx="120" cy="120" r="112" className="bsq-compass__face" />
          {/* faint full sector guides */}
          {ORIENTATIONS.map((o) => (
            <path
              key={`guide-${o.id}`}
              d={sectorPath(120, 120, 96, o.deg)}
              className={`bsq-compass__sector${
                selected.id === o.id ? ' bsq-compass__sector--on' : ''
              }`}
            />
          ))}
          {/* sun in the middle */}
          <circle cx="120" cy="120" r="30" fill="url(#bsq-sun)" />
          <circle cx="120" cy="120" r="30" className="bsq-compass__sunning" />
          {/* tick marks */}
          {ORIENTATIONS.map((o) => {
            const rad = ((o.deg - 90) * Math.PI) / 180
            const cardinal = o.deg % 90 === 0
            const r1 = cardinal ? 100 : 104
            return (
              <line
                key={`tick-${o.id}`}
                x1={120 + r1 * Math.cos(rad)}
                y1={120 + r1 * Math.sin(rad)}
                x2={120 + 111 * Math.cos(rad)}
                y2={120 + 111 * Math.sin(rad)}
                className={`bsq-compass__tick${cardinal ? ' bsq-compass__tick--cardinal' : ''}`}
              />
            )
          })}
        </svg>
        <div className="bsq-compass__btns">
          {ORIENTATIONS.map((o) => {
            const rad = (o.deg * Math.PI) / 180
            const x = 50 + 40.5 * Math.sin(rad)
            const y = 50 - 40.5 * Math.cos(rad)
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected.id === o.id}
                className={`bsq-compass__btn${selected.id === o.id ? ' bsq-compass__btn--on' : ''}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => onChange(o.id)}
              >
                {o.id}
              </button>
            )
          })}
        </div>
      </div>
      <p className="bsq-compass__caption" aria-live="polite">
        <b>
          {selected.label}-facing — {Math.round(selected.factor * 100)}% sun score.
        </b>{' '}
        {selected.quip}
      </p>
    </div>
  )
}
