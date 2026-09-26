import { hashStr, type Listing } from './data'

/**
 * PropertyArt — generative "photograph" placeholders.
 *
 * Each listing gets a deterministic little landscape: a graded sky, a sun,
 * ridge lines, and a silhouette that matches the dwelling type — gabled
 * houses, paired terraces, a walk-up block, or a pegged-and-flagged empty
 * lot. Drawn, not rendered; no two lots share a sky.
 */

const SKIES: Array<[string, string]> = [
  ['#f6ecd2', '#e8cf9e'], // late morning
  ['#f3e2c0', '#dfb985'], // afternoon
  ['#efe0c6', '#d9c096'], // high cloud
  ['#f7e7c8', '#e3c48d'], // golden
  ['#efe6d8', '#d3c3ab'], // overcast warm
]

const RIDGES = ['#c2ab7d', '#a68d5e', '#8a744e']
const INK = '#4a3b28'

function rng(seed: number) {
  let a = seed | 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function ridge(r: () => number, y: number, amp: number): string {
  let d = `M -10 ${y}`
  let x = -10
  while (x < 410) {
    const nx = x + 40 + r() * 70
    const ny = y - amp / 2 + r() * amp
    d += ` L ${Math.min(410, nx).toFixed(0)} ${ny.toFixed(0)}`
    x = nx
  }
  d += ` L 410 320 L -10 320 Z`
  return d
}

export default function PropertyArt({
  listing,
  className,
}: {
  listing: Listing
  className?: string
}) {
  const r = rng(hashStr(listing.id))
  const sky = SKIES[Math.floor(r() * SKIES.length)]
  const sunX = 40 + r() * 320
  const sunY = 30 + r() * 50
  const gid = `qc-sky-${listing.id}`

  const building = (() => {
    switch (listing.type) {
      case 'House':
        return (
          <g fill={INK}>
            <rect x={150} y={196} width={110} height={54} />
            <path d="M 142 198 L 205 158 L 268 198 Z" />
            <rect x={238} y={166} width={12} height={30} />
            <rect x={168} y={214} width={18} height={22} fill="#e8b64c" />
            <rect x={220} y={214} width={18} height={22} fill="#e8b64c" opacity={0.75} />
            <rect x={120} y={212} width={26} height={38} opacity={0.82} />
            <path d="M 116 213 L 133 197 L 150 213 Z" opacity={0.82} />
          </g>
        )
      case 'Townhouse':
        return (
          <g fill={INK}>
            <rect x={138} y={186} width={62} height={64} />
            <rect x={200} y={178} width={62} height={72} />
            <path d="M 134 187 L 169 164 L 204 187 Z" />
            <path d="M 196 179 L 231 156 L 266 179 Z" />
            <rect x={152} y={206} width={13} height={18} fill="#e8b64c" />
            <rect x={176} y={206} width={13} height={18} fill="#e8b64c" opacity={0.7} />
            <rect x={214} y={198} width={13} height={18} fill="#e8b64c" opacity={0.85} />
            <rect x={238} y={198} width={13} height={18} fill="#e8b64c" opacity={0.6} />
          </g>
        )
      case 'Unit':
        return (
          <g fill={INK}>
            <rect x={162} y={138} width={84} height={112} />
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={172 + col * 24}
                  y={150 + row * 26}
                  width={14}
                  height={12}
                  fill="#e8b64c"
                  opacity={0.35 + ((row * 3 + col) % 3) * 0.25}
                />
              )),
            )}
            <rect x={206} y={124} width={12} height={14} />
          </g>
        )
      case 'Land':
        return (
          <g>
            {/* survey peg with the orange flag */}
            <rect x={196} y={172} width={5} height={30} fill={INK} />
            <path d="M 201 172 L 232 180 L 201 189 Z" fill="#d9622b" />
            {/* fence line */}
            <path d="M 10 236 L 390 222" stroke={INK} strokeWidth={2} fill="none" />
            {[40, 110, 180, 300, 360].map((fx) => (
              <rect key={fx} x={fx} y={214 + (fx % 3)} width={3.4} height={20} fill={INK} />
            ))}
          </g>
        )
    }
  })()

  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      role="img"
      aria-label={`Illustrated ${listing.type.toLowerCase()} scene for ${listing.address}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gid})`} />
      <circle cx={sunX} cy={sunY} r={16 + r() * 8} fill="#f2d38a" opacity={0.9} />
      <path d={ridge(r, 168, 26)} fill={RIDGES[0]} opacity={0.75} />
      <path d={ridge(r, 208, 22)} fill={RIDGES[1]} opacity={0.85} />
      <path d={ridge(r, 246, 14)} fill={RIDGES[2]} />
      <rect x="0" y="252" width="400" height="48" fill="#cbb57f" />
      {building}
      {/* scrub tufts */}
      {Array.from({ length: 7 }).map((_, i) => {
        const tx = 20 + r() * 360
        const ty = 262 + r() * 26
        return (
          <path
            key={i}
            d={`M ${tx} ${ty} l 3 -7 l 3 7 M ${tx + 6} ${ty} l 2 -5 l 3 5`}
            stroke="#7a643f"
            strokeWidth="1.6"
            fill="none"
          />
        )
      })}
    </svg>
  )
}
