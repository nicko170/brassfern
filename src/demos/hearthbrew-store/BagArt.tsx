import { useMemo } from 'react'
import type { Coffee } from './data'

/* Seeded RNG so every bag illustration is stable across renders. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedFrom(id: string) {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Generative coffee-bag artwork: a kraft bag in the coffee's palette with
 * a small botanical vine grown from the coffee id. Pure SVG, no images.
 */
export default function BagArt({ coffee, large = false }: { coffee: Coffee; large?: boolean }) {
  const seed = seedFrom(coffee.id)
  const vines = useMemo(() => {
    const rand = rng(seed)
    const paths: { d: string; w: number; o: number }[] = []
    const count = large ? 5 : 4
    for (let v = 0; v < count; v++) {
      const x0 = 14 + rand() * 148
      let x = x0
      let y = 188
      let d = `M ${x} ${y}`
      const steps = 5 + Math.floor(rand() * 3)
      let ang = -Math.PI / 2 + (rand() - 0.5) * 0.5
      for (let s = 0; s < steps; s++) {
        ang += (rand() - 0.5) * 0.9
        const len = 12 + rand() * 16
        x += Math.cos(ang) * len
        y += Math.sin(ang) * len
        d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
        if (rand() < 0.75) {
          // leaf as a small loop off the path
          const lx = x + Math.cos(ang + 1.2) * 7
          const ly = y + Math.sin(ang + 1.2) * 7
          d += ` M ${x.toFixed(1)} ${y.toFixed(1)} Q ${lx.toFixed(1)} ${ly.toFixed(1)} ${lx.toFixed(1)} ${ly.toFixed(1)} M ${lx.toFixed(1)} ${ly.toFixed(1)} Q ${
            lx.toFixed(1)
          } ${ly.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`
        }
      }
      paths.push({ d, w: 1.4 + rand() * 1.2, o: 0.5 + rand() * 0.4 })
    }
    return paths
  }, [seed, large])

  const berries = useMemo(() => {
    const rand = rng(seed + 7)
    const pts: { x: number; y: number; r: number }[] = []
    for (let i = 0; i < (large ? 9 : 6); i++) {
      pts.push({ x: 22 + rand() * 140, y: 60 + rand() * 110, r: 1.3 + rand() * 1.6 })
    }
    return pts
  }, [seed, large])

  const labelLines = coffee.name.split(' ')

  return (
    <svg
      className="hbs-bag"
      viewBox="0 0 180 200"
      role="img"
      aria-label={`${coffee.name} kraft coffee bag`}
      aria-hidden="true"
    >
      {/* bag body */}
      <path d="M24 46 L156 46 L164 190 L16 190 Z" fill={coffee.palette.bag} />
      {/* side seam */}
      <path d="M24 46 L16 190 M156 46 L164 190" stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
      {/* top fold */}
      <path d="M20 30 L160 30 L156 46 L24 46 Z" fill="rgba(0,0,0,0.24)" />
      <rect x="20" y="26" width="140" height="7" rx="3" fill={coffee.palette.accent} opacity="0.9" />
      {/* vines */}
      <g stroke={coffee.palette.accent} fill="none">
        {vines.map((v, i) => (
          <path key={i} d={v.d} strokeWidth={v.w} opacity={v.o} strokeLinecap="round" />
        ))}
      </g>
      {/* berries */}
      <g fill={coffee.palette.accent}>
        {berries.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} opacity="0.85" />
        ))}
      </g>
      {/* label */}
      <g>
        <rect x="46" y="86" width="88" height="62" rx="3" fill={coffee.palette.label} opacity="0.96" />
        <rect x="52" y="92" width="76" height="50" rx="2" fill="none" stroke={coffee.palette.bag} strokeWidth="1" opacity="0.5" />
        {labelLines.map((line, i) => (
          <text
            key={i}
            x="90"
            y={110 + i * 15}
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="13"
            fill={coffee.palette.bag}
          >
            {line}
          </text>
        ))}
        <line x1="64" y1="132" x2="116" y2="132" stroke={coffee.palette.accent} strokeWidth="1.4" />
      </g>
      {/* roast dot row */}
      <g fill={coffee.palette.label}>
        {Array.from({ length: 5 }, (_, i) => (
          <circle
            key={i}
            cx={76 + i * 7}
            cy={178}
            r="2.1"
            opacity={i < coffee.roast ? 0.95 : 0.28}
          />
        ))}
      </g>
    </svg>
  )
}
