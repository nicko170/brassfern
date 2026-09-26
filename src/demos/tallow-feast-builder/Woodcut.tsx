import { useId } from 'react'
import type { IconKind } from './data'

/**
 * Woodcut — hand-cut engraved pictograms for the Tallow & Co. pantry.
 * One stroke colour (currentColor), hatch shading, no fills that fight the
 * kraft paper. Drawn at 48×48.
 */

const hatch = (x: number, y: number, n: number, dy = 3, len = 7) =>
  Array.from({ length: n }, (_, i) => (
    <line key={`h${i}`} className="tfb-wc-hatch" x1={x} y1={y + i * dy} x2={x + len} y2={y + i * dy - 2} />
  ))

function Glyph({ kind }: { kind: IconKind }) {
  switch (kind) {
    case 'wedge':
      // cheddar wedge in elevation with a clothbound rind
      return (
        <>
          <path d="M7 37 L36 15 L43 37 Z" />
          <path d="M14.5 37 L36.9 20.4" className="tfb-wc-hatch" />
          <path d="M10 35 L36 17" />
          <path d="M36 15 L43 37 L38.5 37" />
          <circle cx="26" cy="32" r="1.4" className="tfb-wc-dot" />
          <circle cx="33" cy="30" r="1.1" className="tfb-wc-dot" />
          {hatch(8.5, 30, 3)}
        </>
      )
    case 'wheel':
      // a wheel of brie with a slice claimed
      return (
        <>
          <circle cx="22" cy="26" r="13" />
          <path d="M22 26 L22 13" />
          <path d="M22 26 L33 18.5" />
          <path d="M22 13 A13 13 0 0 1 33 18.5 L22 26 Z" className="tfb-wc-cut" />
          <path d="M13 21 A10.5 10.5 0 0 1 22 15.5" className="tfb-wc-hatch" />
          <path d="M11.5 29 A10.5 10.5 0 0 1 16 19.5" className="tfb-wc-hatch" />
          <path d="M31 21.5 L24.5 26.6" className="tfb-wc-hatch" />
          <path d="M33.5 24.8 L27 29.8" className="tfb-wc-hatch" />
        </>
      )
    case 'log':
      // hanging salami: coupe end with marbling, string tie
      return (
        <>
          <path d="M11 16 L31 10 A6 6 0 0 1 38.5 17.5 L18.5 23.5 A6 6 0 0 1 11 16 Z" />
          <path d="M18.5 16 L38.5 10" className="tfb-wc-hatch" transform="translate(-14 3.5)" />
          <ellipse cx="11.5" cy="19.8" rx="6" ry="4.4" transform="rotate(-16 11.5 19.8)" />
          <circle cx="10.5" cy="19" r="1.2" className="tfb-wc-dot" />
          <circle cx="13.5" cy="21" r="0.9" className="tfb-wc-dot" />
          <circle cx="9.8" cy="22" r="0.8" className="tfb-wc-dot" />
          <path d="M36 12 L40 6" />
          <path d="M38.5 15.5 L43 10" />
          <path d="M40 6 L43 10" />
        </>
      )
    case 'slices':
      // fanned slices of bresaola
      return (
        <>
          <ellipse cx="17" cy="30" rx="9" ry="6" transform="rotate(-18 17 30)" />
          <ellipse cx="26" cy="25" rx="9" ry="6" transform="rotate(-6 26 25)" />
          <ellipse cx="33.5" cy="19" rx="8" ry="5.6" transform="rotate(12 33.5 19)" />
          <path d="M11 31.5 A9 6 -18 0 0 23 31" className="tfb-wc-hatch" />
          <path d="M21 26.5 A9 6 -6 0 0 32 26" className="tfb-wc-hatch" />
          <circle cx="33" cy="19" r="1" className="tfb-wc-dot" />
          <circle cx="30" cy="17.5" r="0.8" className="tfb-wc-dot" />
        </>
      )
    case 'terrine':
      // pâté pot with lid and knob
      return (
        <>
          <path d="M11 22 h26 v9 a8 8 0 0 1 -8 8 h-10 a8 8 0 0 1 -8 -8 Z" />
          <rect x="9" y="17.5" width="30" height="4.5" rx="1.5" />
          <path d="M21 17.5 v-2.5 a3 3 0 0 1 6 0 v2.5" />
          <line x1="14" y1="26.5" x2="34" y2="26.5" className="tfb-wc-hatch" />
          <line x1="14.8" y1="30" x2="33.2" y2="30" className="tfb-wc-hatch" />
          {hatch(15, 33, 2, 2.4, 5)}
        </>
      )
    case 'jar':
      // preserve jar with ridged lid and a label
      return (
        <>
          <path d="M15 19 c0-2 1-3.5 3-4 h12 c2 .5 3 2 3 4 v15 a6 6 0 0 1 -6 6 h-6 a6 6 0 0 1 -6 -6 Z" />
          <rect x="14" y="9" width="20" height="6" rx="2" />
          <line x1="18" y1="9" x2="18" y2="15" className="tfb-wc-hatch" />
          <line x1="24" y1="9" x2="24" y2="15" className="tfb-wc-hatch" />
          <line x1="30" y1="9" x2="30" y2="15" className="tfb-wc-hatch" />
          <rect x="18" y="23" width="12" height="8" rx="1" className="tfb-wc-hatch" />
          {hatch(15.6, 34, 2, 2.2, 4)}
        </>
      )
    case 'bar':
      // a slab of quince paste in its paper
      return (
        <>
          <path d="M8 30 c2-1 3 1 5 0 s3 1 5 0 3 1 5 0 3 1 5 0 3 1 5 0 3 1 5 0 v8 H8 Z" />
          <path d="M8 38 v2.5" className="tfb-wc-hatch" />
          <path d="M12 33 L20 26.5" className="tfb-wc-hatch" />
          <path d="M18 35 L28 27" className="tfb-wc-hatch" />
          <path d="M25 36.5 L36 28.5" className="tfb-wc-hatch" />
          <path d="M8 30 L4 33 v8 l4 -3" />
        </>
      )
    case 'stack':
      // lavosh / flatbread stack with pierce marks
      return (
        <>
          <rect x="10" y="13" width="26" height="6.5" rx="3" transform="rotate(-5 23 16)" />
          <rect x="9" y="22" width="27" height="6.5" rx="3" transform="rotate(3 22.5 25)" />
          <rect x="11" y="30.5" width="26" height="6.5" rx="3" transform="rotate(-3 24 33.8)" />
          <circle cx="18" cy="16.5" r="0.9" className="tfb-wc-dot" />
          <circle cx="28" cy="14.8" r="0.9" className="tfb-wc-dot" />
          <circle cx="17" cy="25.4" r="0.9" className="tfb-wc-dot" />
          <circle cx="29" cy="26.4" r="0.9" className="tfb-wc-dot" />
          <circle cx="20" cy="34" r="0.9" className="tfb-wc-dot" />
          <circle cx="31" cy="32.6" r="0.9" className="tfb-wc-dot" />
        </>
      )
    case 'comb':
      // honeycomb jar: cells over a drip
      return (
        <>
          <path d="M16 12 l0 -3 h16 l0 3" />
          <path d="M14 12 h20 v6 h-20 Z" />
          <path d="M15 18 v16 a7 7 0 0 0 7 7 h4 a7 7 0 0 0 7 -7 V18" />
          <path d="M20 24 l4 -2.3 4 2.3 v4.6 l-4 2.3 -4 -2.3 Z" />
          <path d="M28 31 l3 -1.7 3 1.7 v3.4 l-3 1.7 -3 -1.7 Z" className="tfb-wc-hatch" />
          <path d="M21 33 q-1.5 2.4 0 3.6 q1.5 -1.2 0 -3.6" className="tfb-wc-hatch" />
          <line x1="15.5" y1="20.6" x2="32.5" y2="20.6" className="tfb-wc-hatch" />
        </>
      )
    case 'twist':
      // twist of paper with candied peel escaping
      return (
        <>
          <path d="M13 19 L24 13 L35 19 L35 29 L24 35 L13 29 Z" />
          <path d="M35 19 l6 -3.4 -1.6 5.8 3.4 3 -5.8 1.4 L35 29" />
          <path d="M13 19 l-6 -3.4 1.6 5.8 -3.4 3 5.8 1.4 L13 29" />
          <path d="M13 19 L24 25 L35 19" className="tfb-wc-hatch" />
          <path d="M24 25 v10" className="tfb-wc-hatch" />
          <path d="M22.5 30 q3.5 -1.5 3.5 -4" className="tfb-wc-dot" />
        </>
      )
    case 'bottle':
      // pét-nat bottle, crown seal, cloudy
      return (
        <>
          <path d="M21 7 h6 v10 c0 2 4.5 3.4 4.5 8 v12 a4 4 0 0 1 -4 4 h-7 a4 4 0 0 1 -4 -4 V25 c0 -4.6 4.5 -6 4.5 -8 Z" />
          <rect x="21" y="4.5" width="6" height="3" rx="1" />
          <path d="M20.5 41 q3.5 2.4 7 0" className="tfb-wc-hatch" />
          {hatch(19, 22, 2, 2.4, 8)}
          <line x1="17" y1="30" x2="31" y2="30" className="tfb-wc-hatch" />
        </>
      )
    case 'swingtop':
      // swing-top cordial bottle with wire clasp
      return (
        <>
          <path d="M20 14 h8 v7 c0 2.2 4 3 4 7.4 v9.6 a4 4 0 0 1 -4 4 h-8 a4 4 0 0 1 -4 -4 v-9.6 c0 -4.4 4 -5.2 4 -7.4 Z" />
          <circle cx="24" cy="9" r="4" />
          <path d="M20.8 12.4 L16 18 M27.2 12.4 L32 18" />
          <path d="M14 21 h20" className="tfb-wc-hatch" />
          {hatch(18.5, 33, 3, 2.6, 11)}
        </>
      )
  }
}

export default function Woodcut({ kind, size = 48 }: { kind: IconKind; size?: number }) {
  const gid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg
      className="tfb-wc"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-gid={gid}
    >
      <Glyph kind={kind} />
    </svg>
  )
}

/** The shop's wax seal, stamped when the box is full. */
export function WaxSeal({ size = 64 }: { size?: number }) {
  const gid = useId().replace(/[^a-zA-Z0-9]/g, '')
  // 14-point wax lobes
  const pts: string[] = []
  const cx = 32
  const cy = 32
  for (let i = 0; i < 42; i++) {
    const a = (i / 42) * Math.PI * 2
    const r = 27 + Math.sin(i * 2.4) * 2.6 + Math.cos(i * 5.1) * 1.4
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`)
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="tfb-seal" aria-hidden="true" focusable="false">
      <polygon points={pts.join(' ')} className="tfb-seal__wax" />
      <circle cx={cx} cy={cy} r={20.5} className="tfb-seal__ring" />
      <text x={cx} y={cy - 1.5} textAnchor="middle" className="tfb-seal__t" data-gid={gid}>
        T
      </text>
      <text x={cx} y={cy + 9.5} textAnchor="middle" className="tfb-seal__amp">
        &amp; Co.
      </text>
      <path d="M14 32 h6 M44 32 h6" className="tfb-seal__ray" />
      <path d="M32 14 v5 M32 45 v5" className="tfb-seal__ray" />
    </svg>
  )
}
