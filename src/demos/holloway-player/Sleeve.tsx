import { useMemo } from 'react'
import type { HAlbum } from './data'
import { hashStr, mulberry } from './data'

/**
 * Procedural sleeve art. Each release gets its own composition mode —
 * rings, rays, halftone, wave, bauhaus, checker, orbits, bars — seeded from
 * the album id so the artwork is stable. No photography, no type beyond the
 * tiny catalogue stamp a real sleeve would carry.
 */

interface SleeveProps {
  album: HAlbum
  className?: string
  decorative?: boolean
}

const NS = 'http://www.w3.org/2000/svg'

function Rings({ bg, ink, accent }: HAlbum['palette'], rnd: () => number) {
  const cx = 50 + (rnd() - 0.5) * 30
  const cy = 54 + (rnd() - 0.5) * 26
  const rings = []
  for (let i = 9; i > 0; i--) {
    const r = i * 13
    rings.push(
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        fill={i % 3 === 0 ? accent : i % 2 === 0 ? ink : bg}
      />,
    )
  }
  return (
    <>
      <rect width="200" height="200" fill={bg} />
      {rings}
      <circle cx={cx} cy={cy} r="5" fill={bg} />
    </>
  )
}

function Rays({ bg, ink, accent }: HAlbum['palette'], rnd: () => number) {
  const cx = 26 + rnd() * 40
  const cy = 22 + rnd() * 30
  const n = 14 + Math.floor(rnd() * 6)
  const rays = []
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2
    const a1 = ((i + 1) / n) * Math.PI * 2
    const R = 320
    rays.push(
      <path
        key={i}
        d={`M ${cx} ${cy} L ${cx + Math.cos(a0) * R} ${cy + Math.sin(a0) * R} L ${
          cx + Math.cos(a1) * R
        } ${cy + Math.sin(a1) * R} Z`}
        fill={i % 4 === 0 ? accent : i % 2 === 0 ? ink : bg}
      />,
    )
  }
  return (
    <>
      <rect width="200" height="200" fill={bg} />
      {rays}
      <circle cx={cx} cy={cy} r="16" fill={accent} />
    </>
  )
}

function Halftone({ bg, ink, accent }: HAlbum['palette'], rnd: () => number) {
  const fx = 40 + rnd() * 120
  const fy = 40 + rnd() * 120
  const dots = []
  const gap = 13
  let k = 0
  for (let y = gap / 2; y < 200; y += gap) {
    for (let x = gap / 2; x < 200; x += gap) {
      const d = Math.hypot(x - fx, y - fy)
      const r = Math.max(0.4, 5.4 - d / 34)
      dots.push(<circle key={k++} cx={x} cy={y} r={r} fill={d < 92 ? accent : ink} />)
    }
  }
  return (
    <>
      <rect width="200" height="200" fill={bg} />
      {dots}
    </>
  )
}

function Wave({ bg, ink, accent }: HAlbum['palette'], rnd: () => number) {
  const rows = []
  const bands = 9
  for (let i = 0; i < bands; i++) {
    const y0 = (i / bands) * 200
    const h = 200 / bands + 1.5
    const amp = 6 + rnd() * 9
    const phase = rnd() * Math.PI * 2
    let d = `M 0 ${y0 + h / 2}`
    for (let x = 0; x <= 200; x += 8) {
      d += ` L ${x} ${y0 + h / 2 + Math.sin(phase + x / 26) * amp * 0.4}`
    }
    d += ` L 200 ${y0 + h} L 0 ${y0 + h} Z`
    rows.push(
      <path key={i} d={d} fill={i % 4 === 1 ? accent : i % 2 === 0 ? ink : bg} />,
    )
  }
  return (
    <>
      <rect width="200" height="200" fill={bg} />
      {rows}
      <circle cx={150 + rnd() * 30} cy={34 + rnd() * 26} r="15" fill={accent} />
    </>
  )
}

function Bauhaus({ bg, ink, accent }: HAlbum['palette'], rnd: () => number) {
  const tiles = []
  const size = 50
  let k = 0
  for (let y = 0; y < 200; y += size) {
    for (let x = 0; x < 200; x += size) {
      const rot = Math.floor(rnd() * 4) * 90
      const fill = rnd() > 0.72 ? accent : rnd() > 0.42 ? ink : bg
      tiles.push(
        <g key={k++} transform={`rotate(${rot} ${x + size / 2} ${y + size / 2})`}>
          <path d={`M ${x} ${y + size} A ${size} ${size} 0 0 1 ${x + size} ${y} Z`} fill={fill} />
        </g>,
      )
    }
  }
  return (
    <>
      <rect width="200" height="200" fill={ink} />
      {tiles}
    </>
  )
}

function Checker({ bg, ink, accent }: HAlbum['palette'], rnd: () => number) {
  const cells = []
  const n = 8
  const size = 200 / n
  const warp = 3 + rnd() * 5
  let k = 0
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const ox = Math.sin(y / 1.4) * warp
      cells.push(
        <rect
          key={k++}
          x={x * size + ox}
          y={y * size}
          width={size + 0.6}
          height={size + 0.6}
          fill={(x + y) % 2 === 0 ? ink : bg}
        />,
      )
    }
  }
  return (
    <>
      <rect width="200" height="200" fill={bg} />
      {cells}
      <circle cx={100} cy={100} r={34 + rnd() * 14} fill={accent} />
      <circle cx={100} cy={100} r="9" fill={bg} />
    </>
  )
}

function Orbits({ bg, ink, accent }: HAlbum['palette'], rnd: () => number) {
  const rings = []
  for (let i = 0; i < 5; i++) {
    rings.push(
      <ellipse
        key={i}
        cx={100}
        cy={104}
        rx={24 + i * 17}
        ry={12 + i * 13}
        fill="none"
        stroke={i % 2 ? ink : accent}
        strokeWidth={i % 2 ? 2 : 4}
      />,
    )
  }
  const dots = []
  for (let i = 0; i < 5; i++) {
    const rx = 24 + i * 17
    const ry = 12 + i * 13
    const a = rnd() * Math.PI * 2
    dots.push(
      <circle
        key={i}
        cx={100 + Math.cos(a) * rx}
        cy={104 + Math.sin(a) * ry}
        r={i === 2 ? 8 : 4.5}
        fill={i === 2 ? accent : ink}
      />,
    )
  }
  return (
    <>
      <rect width="200" height="200" fill={bg} />
      {rings}
      {dots}
    </>
  )
}

function Bars({ bg, ink, accent }: HAlbum['palette'], rnd: () => number) {
  const bars = []
  let x = 0
  let k = 0
  while (x < 200) {
    const w = 7 + rnd() * 22
    const fill = rnd() > 0.78 ? accent : rnd() > 0.45 ? ink : bg
    bars.push(<rect key={k++} x={x} width={w} height="200" fill={fill} />)
    x += w
  }
  return (
    <>
      <rect width="200" height="200" fill={ink} />
      {bars}
      <circle cx={100} cy={96} r="44" fill={accent} />
      <circle cx={100} cy={96} r="26" fill={bg} />
    </>
  )
}

const MODES = { rings: Rings, rays: Rays, halftone: Halftone, wave: Wave, bauhaus: Bauhaus, checker: Checker, orbits: Orbits, bars: Bars }

export default function Sleeve({ album, className, decorative = true }: SleeveProps) {
  const art = useMemo(() => {
    const rnd = mulberry(hashStr(album.id))
    const render = MODES[album.mode] ?? Rings
    return render(album.palette, rnd)
  }, [album])

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns={NS}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `${album.title} sleeve artwork`}
    >
      {art}
      <rect
        x="5"
        y="5"
        width="190"
        height="190"
        fill="none"
        stroke={album.palette.ink}
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <text
        x="12"
        y="190"
        fontSize="7.5"
        fontFamily="ui-monospace, Menlo, monospace"
        letterSpacing="1.2"
        fill={album.palette.ink}
        fillOpacity="0.85"
      >
        HOLLOWAY · {album.cat}
      </text>
    </svg>
  )
}

/** A vinyl disc that spins while the album is playing. */
export function Vinyl({
  album,
  spinning,
  className,
}: {
  album: HAlbum
  spinning: boolean
  className?: string
}) {
  return (
    <div
      className={`hp-vinyl ${spinning ? 'is-live' : ''} ${className ?? ''}`}
      aria-hidden="true"
      style={{ ['--hp-label' as string]: album.palette.accent, ['--hp-label-2' as string]: album.palette.bg }}
    >
      <span className="hp-vinyl__label" />
    </div>
  )
}
