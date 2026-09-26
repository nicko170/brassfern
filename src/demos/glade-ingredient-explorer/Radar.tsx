import { RADAR_AXES, type Formula } from './data'

/**
 * Hand-rolled SVG pentagon radar comparing two formulations across the five
 * GLADE scorecard axes. Sage for A, terracotta for B.
 */

const CX = 150
const CY = 132
const R = 92

function point(axisIndex: number, value: number): [number, number] {
  const angle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / RADAR_AXES.length
  const r = (value / 5) * R
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)]
}

function polygon(values: Record<string, number>): string {
  return RADAR_AXES.map((axis, i) => point(i, values[axis]).join(',')).join(' ')
}

export default function Radar({ a, b }: { a: Formula; b: Formula }) {
  const labelPoint = (i: number): [number, number] => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / RADAR_AXES.length
    const r = R + 26
    return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)]
  }

  return (
    <div className="gix-radar-wrap">
      <svg className="gix-radar" viewBox="0 0 300 264" role="img" aria-label={`Radar comparing ${a.name} and ${b.name} across ${RADAR_AXES.join(', ')}`}>
        {RADAR_AXES.map((axis, i) => {
          const [x, y] = point(i, 5)
          return <line key={axis} className="gix-radar__spoke" x1={CX} y1={CY} x2={x} y2={y} />
        })}
        {[1, 2, 3, 4, 5].map((ring) => (
          <polygon
            key={ring}
            className={ring === 5 ? 'gix-radar__ring gix-radar__ring--edge' : 'gix-radar__ring'}
            points={RADAR_AXES.map((_, i) => point(i, ring).join(',')).join(' ')}
          />
        ))}
        {RADAR_AXES.map((axis, i) => {
          const [x, y] = labelPoint(i)
          return (
            <text key={axis} className="gix-radar__label" x={x} y={y} textAnchor="middle" dominantBaseline="middle">
              {axis}
            </text>
          )
        })}
        <polygon className="gix-radar__poly gix-radar__poly--a" points={polygon(a.radar)} />
        <polygon className="gix-radar__poly gix-radar__poly--b" points={polygon(b.radar)} />
      </svg>
      <ul className="gix-radar__legend" aria-label="Comparison values">
        {RADAR_AXES.map((axis) => (
          <li key={axis}>
            <span className="gix-radar__axis">{axis}</span>
            <span className="gix-radar__val gix-radar__val--a">{a.radar[axis]}</span>
            <span className="gix-radar__val gix-radar__val--b">{b.radar[axis]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
