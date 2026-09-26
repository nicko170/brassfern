/**
 * Orrery Sunday — plated cover art. Each episode gets a deterministic
 * miniature orrery: concentric orbits, a planet at a seeded angle, and a
 * brass hour-hand. Pure SVG, no motion — the hero's big orrery is the only
 * thing that spins, and only when motion is welcome.
 */

interface Props {
  seed: number
  size?: number
  className?: string
}

const pick = (seed: number, salt: number, mod: number): number => {
  let x = seed * 374761393 + salt * 668265263
  x = (x ^ (x >>> 13)) * 1274126177
  return ((x ^ (x >>> 16)) >>> 0) % mod
}

export default function Cover({ seed, size = 64, className }: Props) {
  const rings = 3 + pick(seed, 1, 2)
  const planetA = (pick(seed, 2, 360) * Math.PI) / 180
  const ringIdx = 1 + pick(seed, 3, Math.max(1, rings - 1))
  const radius = 14 + (ringIdx * 62) / (rings + 1)
  const px = 80 + radius * Math.cos(planetA)
  const py = 80 + radius * Math.sin(planetA)
  const handA = (pick(seed, 4, 360) * Math.PI) / 180
  const hx = 80 + 58 * Math.cos(handA)
  const hy = 80 + 58 * Math.sin(handA)
  const ticks = 24

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 160 160"
      role="img"
      aria-hidden="true"
    >
      <circle cx="80" cy="80" r="79" fill="#0a0c1a" />
      {/* degree ticks */}
      <circle
        cx="80"
        cy="80"
        r="71"
        fill="none"
        stroke="rgba(242,234,210,.28)"
        strokeWidth={3.4}
        strokeDasharray={`1.4 ${(2 * Math.PI * 71) / ticks - 1.4}`}
      />
      {/* orbits */}
      {Array.from({ length: rings }, (_, i) => (
        <circle
          key={i}
          cx="80"
          cy="80"
          r={14 + ((i + 1) * 62) / (rings + 1)}
          fill="none"
          stroke={i + 1 === ringIdx ? 'rgba(217,152,63,.85)' : 'rgba(242,234,210,.2)'}
          strokeWidth={i + 1 === ringIdx ? 1.6 : 1}
        />
      ))}
      {/* hour hand */}
      <line x1="80" y1="80" x2={hx} y2={hy} stroke="rgba(242,234,210,.36)" strokeWidth={1.4} />
      <circle cx={hx} cy={hy} r={3.2} fill="none" stroke="#d9983f" strokeWidth={1.4} />
      {/* the planet */}
      <circle cx={px} cy={py} r={5.4} fill="#d9983f" />
      <circle cx={px} cy={py} r={9.4} fill="none" stroke="rgba(217,152,63,.5)" strokeWidth={1} />
      {/* sun */}
      <circle cx="80" cy="80" r={4.6} fill="#f2ead2" />
    </svg>
  )
}
