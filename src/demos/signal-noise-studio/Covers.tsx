import { useId } from 'react'
import { mulberry, type Show } from './data'

/**
 * Generative show covers. Each show gets a parametric motif drawn in its
 * accent colour on broadcast teal — jittered by the show seed so the art is
 * stable between visits. Pure SVG, no raster.
 */

interface Props {
  show: Show
  className?: string
}

const INK = '#0c1b18'
const CREAM = '#f0ead6'

export default function CoverArt({ show, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const rnd = mulberry(show.seed * 7919)
  const A = show.accent

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={`${show.title} cover art`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`sns-cg-${uid}`} cx="32%" cy="22%" r="90%">
          <stop offset="0%" stopColor={A} stopOpacity="0.22" />
          <stop offset="60%" stopColor={INK} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={INK} />
      <rect width="200" height="200" fill={`url(#sns-cg-${uid})`} />
      {/* registration frame */}
      <rect x="10" y="10" width="180" height="180" fill="none" stroke={CREAM} strokeOpacity="0.16" />
      {renderMotif(show, A, rnd)}
      <text
        x="20"
        y="184"
        fill={CREAM}
        fillOpacity="0.55"
        fontSize="10"
        fontFamily="ui-monospace, Menlo, Consolas, monospace"
        letterSpacing="2"
      >
        S+N · {show.id.slice(0, 2).toUpperCase()}
        {String(show.seed).padStart(2, '0')}
      </text>
    </svg>
  )
}

function renderMotif(show: Show, A: string, rnd: () => number) {
  switch (show.motif) {
    case 'blueprint': {
      const lines = []
      for (let i = 1; i < 10; i++) {
        const p = i * 20
        lines.push(
          <line key={`v${i}`} x1={p} y1="10" x2={p} y2="190" stroke={A} strokeOpacity="0.14" />,
        )
        lines.push(
          <line key={`h${i}`} x1="10" y1={p} x2="190" y2={p} stroke={A} strokeOpacity="0.14" />,
        )
      }
      const r = 34 + rnd() * 20
      return (
        <g>
          {lines}
          <circle cx="100" cy="92" r={r} fill="none" stroke={A} strokeWidth="2.5" />
          <circle cx="100" cy="92" r={r * 0.55} fill="none" stroke={A} strokeWidth="1" strokeOpacity="0.6" />
          <line x1="100" y1="92" x2={100 + r} y2="92" stroke={A} strokeWidth="1.5" />
          <path d={`M 100 ${92 - r} A ${r} ${r} 0 0 1 ${100 + r * 0.8} ${92 + r * 0.6}`} fill="none" stroke={CREAM} strokeOpacity="0.7" strokeWidth="3" />
          {[100 - r, 100 + r].map((x) => (
            <line key={x} x1={x} y1="86" x2={x} y2="98" stroke={A} strokeWidth="2" />
          ))}
        </g>
      )
    }
    case 'roost': {
      const wires = [54, 104, 154]
      const birds = wires.flatMap((y, row) => {
        const n = 2 + ((show.seed + row) % 3)
        return Array.from({ length: n }, (_, i) => {
          const x = 34 + rnd() * 132
          const s = 6 + rnd() * 4
          const flip = rnd() > 0.5 ? 1 : -1
          const key = `b${row}-${i}`
          return (
            <g key={key} transform={`translate(${x}, ${y - s})`}>
              <path d={`M ${-s} 0 Q 0 ${-s * 1.6} ${s} 0 Q 0 ${s * 0.5} ${-s} 0 Z`} fill={A} />
              <circle cx={flip * s * 0.55} cy={-s * 1.3} r={s * 0.42} fill={A} />
              <line x1={flip * s * 0.95} y1={-s * 1.3} x2={flip * s * 1.5} y2={-s * 1.1} stroke={A} strokeWidth="1.6" />
            </g>
          )
        })
      })
      return (
        <g>
          {wires.map((y) => (
            <line key={y} x1="10" y1={y} x2="190" y2={y} stroke={CREAM} strokeOpacity="0.4" strokeWidth="1.5" />
          ))}
          {birds}
        </g>
      )
    }
    case 'ledger': {
      return (
        <g>
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1="24" y1={44 + i * 18} x2="176" y2={44 + i * 18} stroke={A} strokeOpacity="0.5" strokeWidth="1" />
          ))}
          <path
            d={`M 30 ${70 + rnd() * 10} C 60 ${58 + rnd() * 20}, 90 ${88 - rnd() * 16}, 128 ${66 + rnd() * 12} S 168 ${76 - rnd() * 10}, 172 70`}
            fill="none" stroke={CREAM} strokeOpacity="0.85" strokeWidth="2.4" strokeLinecap="round"
          />
          <circle cx="150" cy="132" r="20" fill={A} fillOpacity="0.9" />
          <circle cx="150" cy="132" r="13" fill="none" stroke={INK} strokeWidth="1.5" />
          <circle cx="150" cy="132" r="20" fill="none" stroke={CREAM} strokeOpacity="0.4" strokeDasharray="2 4" />
        </g>
      )
    }
    case 'dial': {
      const ticks = Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2 - Math.PI * 0.75
        const long = i % 3 === 0
        const r1 = long ? 62 : 68
        const r2 = 74
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * r1}
            y1={100 + Math.sin(a) * r1}
            x2={100 + Math.cos(a) * r2}
            y2={100 + Math.sin(a) * r2}
            stroke={long ? A : CREAM}
            strokeOpacity={long ? 0.9 : 0.4}
            strokeWidth={long ? 2.5 : 1.5}
          />
        )
      })
      const na = -Math.PI * 0.75 + rnd() * Math.PI * 1.5
      return (
        <g>
          <circle cx="100" cy="100" r="84" fill="none" stroke={A} strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="54" fill="none" stroke={CREAM} strokeOpacity="0.3" />
          {ticks}
          <line
            x1="100" y1="100"
            x2={100 + Math.cos(na) * 58}
            y2={100 + Math.sin(na) * 58}
            stroke={CREAM} strokeWidth="3.5" strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="6" fill={A} />
        </g>
      )
    }
    case 'sine': {
      const waves = [0.9, 0.55, 0.28].map((op, k) => {
        const amp = 16 + k * 12 + rnd() * 8
        const yc = 58 + k * 34
        let d = `M 14 ${yc}`
        for (let x = 14; x <= 186; x += 6) {
          d += ` L ${x} ${(yc + Math.sin((x / 186) * Math.PI * (3 + k * 2) + k) * amp).toFixed(1)}`
        }
        return <path key={k} d={d} fill="none" stroke={k === 0 ? CREAM : A} strokeOpacity={op} strokeWidth={2.2 - k * 0.4} />
      })
      return (
        <g>
          <line x1="14" y1="100" x2="186" y2="100" stroke={CREAM} strokeOpacity="0.14" strokeDasharray="1 6" />
          {waves}
          <text x="150" y="38" fill={A} fontSize="15" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="1">50 Hz</text>
        </g>
      )
    }
    case 'badge': {
      return (
        <g transform={`rotate(${-8 + rnd() * 16} 100 100)`}>
          <rect x="40" y="52" width="120" height="96" rx="6" fill="none" stroke={A} strokeWidth="4" />
          <rect x="52" y="64" width="96" height="72" rx="3" fill="none" stroke={A} strokeWidth="1.5" strokeOpacity="0.7" />
          <path
            d="M100 78 l7 15 16 2 -12 11 3 16 -14 -8 -14 8 3 -16 -12 -11 16 -2 Z"
            fill={A}
          />
          <line x1="66" y1="128" x2="134" y2="128" stroke={A} strokeWidth="2" strokeOpacity="0.8" />
          <circle cx="156" cy="62" r="10" fill={CREAM} fillOpacity="0.85" />
          <line x1="151" y1="62" x2="161" y2="62" stroke={INK} strokeWidth="2" />
        </g>
      )
    }
    case 'table': {
      return (
        <g>
          <circle cx="100" cy="104" r="52" fill="none" stroke={A} strokeWidth="3" />
          <circle cx="100" cy="104" r="38" fill="none" stroke={CREAM} strokeOpacity="0.35" strokeWidth="1.5" />
          <ellipse cx="100" cy="104" rx="24" ry={18 + rnd() * 8} fill={A} fillOpacity="0.5" />
          {[44, 58].map((x) => (
            <line key={x} x1={x} y1="66" x2={x} y2="142" stroke={CREAM} strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" />
          ))}
          {[-6, 0, 6].map((dx) => (
            <line key={dx} x1={44 + dx} y1="66" x2={44 + dx} y2="80" stroke={CREAM} strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" />
          ))}
          <line x1="146" y1="66" x2="146" y2="142" stroke={CREAM} strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" />
          <path d="M146 66 q7 4 0 22" fill="none" stroke={CREAM} strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" />
        </g>
      )
    }
    case 'drift': {
      const blobs = Array.from({ length: 4 }, (_, i) => {
        const cx = 40 + rnd() * 120
        const cy = 40 + rnd() * 110
        const rx = 34 + rnd() * 40
        const ry = rx * (0.5 + rnd() * 0.5)
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={i === 0 ? A : CREAM} fillOpacity={i === 0 ? 0.32 : 0.1} />
        )
      })
      return (
        <g>
          {blobs}
          <ellipse cx="100" cy="102" rx="30" ry="22" fill="none" stroke={A} strokeWidth="2.5" />
          <line x1="10" y1="166" x2="190" y2="166" stroke={A} strokeOpacity="0.55" strokeWidth="1.5" />
          <line x1="10" y1="172" x2="190" y2="172" stroke={CREAM} strokeOpacity="0.15" />
        </g>
      )
    }
    case 'mast': {
      const arcs = [30, 48, 66].map((r) => (
        <path
          key={r}
          d={`M ${100 - r * 0.72} ${118 - r * 0.7} A ${r} ${r} 0 0 1 ${100 + r * 0.72} ${118 - r * 0.7}`}
          fill="none" stroke={A} strokeWidth="2.5" strokeOpacity={(110 - r) / 90 + 0.2}
        />
      ))
      return (
        <g>
          {arcs}
          <path d="M100 56 L64 160 M100 56 L136 160 M78 122 L122 122 M88 92 L112 92" stroke={CREAM} strokeOpacity="0.8" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="100" cy="52" r="7" fill={A} />
          <circle cx="100" cy="52" r="12" fill="none" stroke={A} strokeOpacity="0.5" />
          <line x1="52" y1="160" x2="148" y2="160" stroke={CREAM} strokeOpacity="0.35" strokeWidth="2" />
        </g>
      )
    }
  }
}
