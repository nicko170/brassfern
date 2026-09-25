import type { Person } from '../data/people'

/**
 * Stylised geometric portraits — deliberately illustrated, never photoreal.
 * Each person gets a deterministic composition of arcs and leaf forms in
 * their two signature hues.
 */
export default function Portrait({ person }: { person: Person }) {
  const [h1, h2] = person.hues
  let seed = 0
  for (const ch of person.name) seed = (seed * 33 + ch.charCodeAt(0)) >>> 0
  const r = (n: number) => ((seed >> n) & 0xffff) / 0xffff
  const cx = 50 + (r(0) - 0.5) * 40
  const cy = 46 + (r(4) - 0.5) * 30
  const big = 30 + r(8) * 26
  const leafRot = r(12) * 180
  const id = person.name.replace(/\s+/g, '-').toLowerCase()

  return (
    <svg viewBox="0 0 200 220" role="img" aria-label={`Illustrated portrait of ${person.name}`} style={{ background: '#ece3cc', borderRadius: 3 }}>
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={h2} stopOpacity="0.9" />
          <stop offset="1" stopColor={h2} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {/* halo */}
      <circle cx={cx} cy={cy} r={big + 22} fill={`url(#g-${id})`} opacity="0.5" />
      {/* head */}
      <circle cx={cx} cy={cy} r={big} fill={h1} />
      {/* shoulders */}
      <path d={`M ${cx - big - 14} 200 Q ${cx} ${cy + big + 26} ${cx + big + 14} 200 Z`} fill={h1} opacity="0.92" />
      {/* fern leaf accent */}
      <g transform={`rotate(${leafRot} ${cx + big * 0.5} ${cy - big * 0.7})`} stroke={h2} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d={`M ${cx + big * 0.5} ${cy - big * 0.55} q 0 -26 6 -42`} />
        <path d={`M ${cx + big * 0.5} ${cy - big * 0.72} q -12 -4 -18 -12`} />
        <path d={`M ${cx + big * 0.5} ${cy - big * 0.86} q 12 -4 18 -12`} />
      </g>
      {/* brass pin */}
      <circle cx={cx - big * 0.55} cy={cy + big * 0.4} r={4 + r(10) * 4} fill={h2} />
    </svg>
  )
}
