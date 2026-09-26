import { memo } from 'react'
import { mulberry32, type Postcard, type StampDef } from './data'

/**
 * Generative postcard art — three aged-print "tints" (sepia, hand-tinted
 * green, blue-tone) and a seeded scene per theme. No text in the art;
 * the DOM carries all information.
 */

interface Palette {
  paper: string
  sky: string
  ink: string
  ink2: string
  wash: string
  hi: string
}

const PALETTES: Palette[] = [
  // sepia halftone
  { paper: '#e9dcc0', sky: '#e0cfa9', ink: '#6b5233', ink2: '#8a6c44', wash: '#d3bd90', hi: '#f2e8d2' },
  // hand-tinted green
  { paper: '#e4e2cd', sky: '#cfd6bd', ink: '#4c5c3e', ink2: '#6b7d55', wash: '#b9c4a2', hi: '#eef0df' },
  // blue-tone collotype
  { paper: '#dde3e4', sky: '#c6d6dc', ink: '#3d566b', ink2: '#5b7288', wash: '#aec2cd', hi: '#e9eef0' },
]

export function paletteFor(tint: 0 | 1 | 2): Palette {
  return PALETTES[tint]
}

function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i)
}

function scene(p: Palette, theme: Postcard['theme'], seed: number) {
  const r = mulberry32(seed)
  const sunX = 40 + Math.floor(r() * 300)
  const sunY = 30 + Math.floor(r() * 40)
  const cloud = r() < 0.6
  const g: JSX.Element[] = []

  // shared sky: sun disc + optional clouds
  g.push(<circle key="sun" cx={sunX} cy={sunY} r={20} fill={p.hi} opacity="0.85" />)
  g.push(<circle key="sunring" cx={sunX} cy={sunY} r={28} fill="none" stroke={p.hi} strokeOpacity="0.4" strokeWidth="2" />)
  if (cloud)
    g.push(
      <g key="clouds" fill={p.hi} opacity="0.7">
        <ellipse cx={90 + r() * 60} cy={46} rx={34} ry={9} />
        <ellipse cx={230 + r() * 60} cy={34} rx={42} ry={8} />
      </g>,
    )

  const horizon = 128 + Math.floor(r() * 18)

  switch (theme) {
    case 'main-street': {
      const n = 3 + Math.floor(r() * 3)
      let x = 6
      const shops = range(n).map((i) => {
        const w = 60 + Math.floor(r() * 36)
        const h = 52 + Math.floor(r() * 30)
        const shop = (
          <g key={i}>
            <rect x={x} y={horizon - h} width={w} height={h} fill={p.ink2} />
            <path d={`M${x} ${horizon - h} L${x + w / 2} ${horizon - h - 14} L${x + w} ${horizon - h} Z`} fill={p.ink} />
            <rect x={x} y={horizon - 26} width={w} height={26} fill={p.ink} opacity="0.9" />
            <rect x={x + 5} y={horizon - 22} width={w / 3} height={16} fill={p.wash} />
            <rect x={x + w - w / 3 - 5} y={horizon - 22} width={w / 3} height={16} fill={p.wash} />
          </g>
        )
        x += w + 8
        return shop
      })
      g.push(<g key="shops">{shops}</g>)
      g.push(<rect key="verandahline" x={0} y={horizon - 30} width={400} height={3} fill={p.ink} opacity="0.6" />)
      g.push(
        <g key="poles" stroke={p.ink} strokeWidth="2.4">
          <line x1={330} y1={horizon - 78} x2={330} y2={horizon} />
          <line x1={314} y1={horizon - 68} x2={346} y2={horizon - 68} />
          <path d={`M0 ${horizon - 74} Q 170 ${horizon - 60} 330 ${horizon - 70}`} fill="none" opacity="0.6" />
        </g>,
      )
      break
    }
    case 'railway': {
      const vpX = 180 + Math.floor(r() * 60)
      const vpY = horizon - 26
      g.push(
        <g key="tracks" stroke={p.ink} strokeWidth="3">
          <line x1={60} y1={244} x2={vpX - 6} y2={vpY} />
          <line x1={210} y1={244} x2={vpX + 6} y2={vpY} />
        </g>,
      )
      g.push(
        <g key="sleepers" stroke={p.ink2} strokeWidth="2.4">
          {range(7).map((i) => {
            const t = i / 7
            const y = 244 - t * (244 - vpY)
            const xl = 60 + t * (vpX - 6 - 60) - 12
            const xr = 210 + t * (vpX + 6 - 210) + 12
            return <line key={i} x1={xl} y1={y} x2={xr} y2={y} />
          })}
        </g>,
      )
      g.push(
        <g key="station">
          <rect x={296} y={horizon - 46} width={70} height={46} fill={p.ink2} />
          <path d={`M290 ${horizon - 46} L331 ${horizon - 66} L372 ${horizon - 46} Z`} fill={p.ink} />
          <rect x={318} y={horizon - 24} width={22} height={24} fill={p.wash} />
        </g>,
      )
      g.push(
        <g key="smoke" fill={p.hi} opacity="0.8">
          <circle cx={vpX - 40} cy={vpY - 26} r={7} />
          <circle cx={vpX - 56} cy={vpY - 38} r={10} />
          <circle cx={vpX - 78} cy={vpY - 48} r={13} />
        </g>,
      )
      break
    }
    case 'river': {
      g.push(
        <path
          key="bridge"
          d={`M40 ${horizon + 10} Q 200 ${horizon - 66} 360 ${horizon + 10}`}
          fill="none"
          stroke={p.ink}
          strokeWidth="5"
        />,
      )
      g.push(
        <g key="bridgeposts" stroke={p.ink} strokeWidth="2.4">
          {range(6).map((i) => {
            const t = (i + 0.5) / 6
            const x = 40 + t * 320
            const y = horizon + 10 - Math.sin(Math.PI * t) * 66
            return <line key={i} x1={x} y1={y} x2={x} y2={horizon + 34} />
          })}
        </g>,
      )
      g.push(
        <g key="water" stroke={p.ink2} strokeWidth="2" opacity="0.75">
          {range(5).map((i) => (
            <path key={i} d={`M${20 + i * 6} ${horizon + 44 + i * 16} q 24 -7 48 0 t 48 0 t 48 0 t 48 0 t 48 0`} fill="none" />
          ))}
        </g>,
      )
      g.push(
        <g key="willows" fill={p.ink2}>
          <ellipse cx={52} cy={horizon - 34} rx={30} ry={24} />
          <ellipse cx={34} cy={horizon - 12} rx={16} ry={26} />
          <ellipse cx={356} cy={horizon - 30} rx={26} ry={20} />
        </g>,
      )
      g.push(
        <g key="birds" stroke={p.ink} strokeWidth="2" fill="none" opacity="0.8">
          <path d="M120 60 q 6 -6 12 0 q 6 -6 12 0" />
          <path d="M250 44 q 5 -5 10 0 q 5 -5 10 0" />
        </g>,
      )
      break
    }
    case 'wool': {
      g.push(
        <g key="field">
          {range(5).map((i) => (
            <rect key={i} x={0} y={horizon + i * 22} width={400} height={22} fill={i % 2 ? p.wash : p.paper} opacity="0.85" />
          ))}
        </g>,
      )
      g.push(
        <g key="stacks" fill={p.ink2}>
          {range(3).map((i) => {
            const x = 70 + i * 110 + Math.floor(r() * 24)
            return <path key={i} d={`M${x - 26} ${horizon} L${x} ${horizon - 40} L${x + 26} ${horizon} Z`} />
          })}
        </g>,
      )
      const wx = 300 + Math.floor(r() * 40)
      g.push(
        <g key="mill" stroke={p.ink} strokeWidth="3" fill="none">
          <line x1={wx} y1={horizon - 64} x2={wx - 16} y2={horizon} />
          <line x1={wx} y1={horizon - 64} x2={wx + 16} y2={horizon} />
          <line x1={wx} y1={horizon - 64} x2={wx} y2={horizon - 96} />
          <line x1={wx} y1={horizon - 64} x2={wx - 30} y2={horizon - 44} />
          <line x1={wx} y1={horizon - 64} x2={wx + 30} y2={horizon - 44} />
          <circle cx={wx} cy={horizon - 64} r={4} fill={p.ink} />
        </g>,
      )
      g.push(
        <g key="sheep" fill={p.ink}>
          {range(7).map((i) => (
            <ellipse key={i} cx={30 + r() * 220} cy={horizon + 24 + r() * 60} rx={7} ry={5} />
          ))}
        </g>,
      )
      break
    }
    case 'hotel': {
      const hx = 40 + Math.floor(r() * 30)
      g.push(
        <g key="hotel">
          <rect x={hx} y={horizon - 96} width={170} height={96} fill={p.ink2} />
          <rect x={hx - 8} y={horizon - 108} width={186} height={14} fill={p.ink} />
          <rect x={hx} y={horizon - 56} width={170} height={7} fill={p.ink} />
          {range(6).map((i) => (
            <line key={i} x1={hx + 10 + i * 28} y1={horizon - 56} x2={hx + 10 + i * 28} y2={horizon - 30} stroke={p.ink} strokeWidth="2.4" />
          ))}
          {range(4).map((i) => (
            <rect key={`w${i}`} x={hx + 16 + i * 40} y={horizon - 86} width={18} height={20} fill={p.wash} />
          ))}
          <rect x={hx + 74} y={horizon - 28} width={26} height={28} fill={p.ink} />
          <line x1={hx + 170} y1={horizon - 40} x2={hx + 200} y2={horizon - 40} stroke={p.ink} strokeWidth="3" />
          <circle cx={hx + 206} cy={horizon - 36} r={10} fill="none" stroke={p.ink} strokeWidth="2.6" />
          <rect x={hx + 132} y={horizon - 128} width={14} height={24} fill={p.ink} />
        </g>,
      )
      g.push(
        <g key="hitches" stroke={p.ink2} strokeWidth="2.4">
          {range(3).map((i) => (
            <line key={i} x1={hx + 210 + i * 26} y1={horizon - 12} x2={hx + 210 + i * 26} y2={horizon} />
          ))}
        </g>,
      )
      break
    }
    case 'show': {
      g.push(
        <path key="stringwire" d="M10 52 Q 200 96 390 44" fill="none" stroke={p.ink} strokeWidth="2.4" />,
      )
      g.push(
        <g key="bunting">
          {range(11).map((i) => {
            const t = (i + 0.5) / 11
            const x = 10 + t * 380
            const y = 52 + Math.sin(Math.PI * t * 0.9 + 0.35) * (t < 0.5 ? 30 * t + 8 : 52 - 44 * t)
            return <path key={i} d={`M${x - 8} ${y} L${x + 8} ${y} L${x} ${y + 16} Z`} fill={i % 2 ? p.ink : p.ink2} />
          })}
        </g>,
      )
      const px = 90 + Math.floor(r() * 60)
      g.push(
        <g key="pavilion">
          <path d={`M${px} ${horizon} L${px + 52} ${horizon - 92} L${px + 104} ${horizon} Z`} fill={p.ink2} />
          <path d={`M${px + 18} ${horizon} L${px + 52} ${horizon - 92} L${px + 42} ${horizon} Z`} fill={p.paper} opacity="0.55" />
          <path d={`M${px + 66} ${horizon} L${px + 52} ${horizon - 92} L${px + 86} ${horizon} Z`} fill={p.paper} opacity="0.55" />
          <line x1={px + 52} y1={horizon - 92} x2={px + 52} y2={horizon - 116} stroke={p.ink} strokeWidth="2.6" />
          <path d={`M${px + 52} ${horizon - 116} l 26 7 l -26 7 Z`} fill={p.ink} />
        </g>,
      )
      g.push(
        <g key="crowd" fill={p.ink}>
          {range(16).map((i) => (
            <circle key={i} cx={30 + r() * 340} cy={horizon + 26 + r() * 46} r={3.4} />
          ))}
        </g>,
      )
      break
    }
    case 'school': {
      const sx = 96 + Math.floor(r() * 80)
      g.push(
        <g key="school">
          <rect x={sx} y={horizon - 70} width={120} height={70} fill={p.ink2} />
          <path d={`M${sx - 10} ${horizon - 70} L${sx + 60} ${horizon - 106} L${sx + 130} ${horizon - 70} Z`} fill={p.ink} />
          <path d={`M${sx + 46} ${horizon - 106} h28 v-16 a14 14 0 0 0 -28 0 Z`} fill={p.ink2} />
          <circle cx={sx + 60} cy={horizon - 122} r={5} fill={p.hi} />
          {range(3).map((i) => (
            <rect key={i} x={sx + 14 + i * 36} y={horizon - 52} width={20} height={26} fill={p.wash} />
          ))}
        </g>,
      )
      g.push(
        <g key="flag" stroke={p.ink} strokeWidth="3">
          <line x1={sx + 150} y1={horizon - 118} x2={sx + 150} y2={horizon} />
        </g>,
      )
      g.push(<path key="flagcloth" d={`M${sx + 150} ${horizon - 118} l 34 9 l -34 9 Z`} fill={p.ink2} />)
      g.push(
        <g key="fence" stroke={p.ink2} strokeWidth="2.4">
          {range(8).map((i) => (
            <line key={i} x1={40 + i * 44} y1={horizon + 22} x2={40 + i * 44} y2={horizon + 44} />
          ))}
          <line x1={30} y1={horizon + 28} x2={380} y2={horizon + 28} />
        </g>,
      )
      break
    }
    case 'mail': {
      // envelope + telegraph poles receding with wires
      g.push(
        <g key="envelope">
          <rect x={128} y={64} width={150} height={96} fill={p.hi} stroke={p.ink} strokeWidth="2.6" />
          <path d="M128 64 L203 122 L278 64" fill="none" stroke={p.ink} strokeWidth="2.6" />
        </g>,
      )
      g.push(
        <g key="poles" stroke={p.ink}>
          {[0.8, 0.55, 0.35].map((s, i) => {
            const x = 40 + i * 110
            const h = 120 * s
            return (
              <g key={i} strokeWidth={3 * s + 1}>
                <line x1={x} y1={horizon + 40 - h} x2={x} y2={horizon + 40} />
                <line x1={x - 26 * s} y1={horizon + 40 - h + 6} x2={x + 26 * s} y2={horizon + 40 - h + 6} />
              </g>
            )
          })}
          <path d={`M14 ${horizon - 46} Q 90 ${horizon - 30} 150 ${horizon - 30} T 260 ${horizon - 4}`} fill="none" strokeWidth="1.6" opacity="0.7" />
        </g>,
      )
      g.push(
        <g key="swifts" stroke={p.ink} strokeWidth="2" fill="none">
          <path d="M300 40 q 7 -8 14 0 q 7 -8 14 0" />
          <path d="M330 58 q 5 -6 10 0 q 5 -6 10 0" />
        </g>,
      )
      break
    }
  }

  // shared ground + hill line
  const hills = (
    <path
      d={`M0 ${horizon - 10} Q 100 ${horizon - 34} 210 ${horizon - 16} T 400 ${horizon - 24} L400 ${horizon} L0 ${horizon} Z`}
      fill={p.wash}
      opacity="0.8"
    />
  )
  const ground = <rect x={0} y={horizon} width={400} height={132} fill={p.paper} />
  return { sunLayer: g[0], clouds: cloud ? g[1] : null, hills, ground, scene: g.slice(cloud ? 2 : 1), horizon }
}

export const CardArt = memo(function CardArt({ card }: { card: Postcard }) {
  const p = paletteFor(card.tint)
  const s = scene(p, card.theme, card.seed)
  return (
    <svg className="pcx-art" viewBox="0 0 400 262" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width={400} height={262} fill={p.paper} />
      <rect width={400} height={262} fill={p.sky} opacity="0.55" />
      {s.sunLayer}
      {s.clouds}
      {s.ground}
      {s.hills}
      {s.scene}
      <rect x={7} y={7} width={386} height={248} fill="none" stroke={p.hi} strokeWidth={2.4} />
      <rect x={11} y={11} width={378} height={240} fill="none" stroke={p.ink} strokeWidth={1} opacity="0.5" />
    </svg>
  )
})

/* ---------------- stamp & postmark ---------------- */

function StampMotifSvg({ motif, hue }: { motif: StampDef['motif']; hue: string }) {
  switch (motif) {
    case 'sprig':
      return (
        <g stroke={hue} strokeWidth="2" fill="none">
          <path d="M22 60 Q 34 34 46 20" />
          {range(4).map((i) => (
            <ellipse key={i} cx={28 + i * 5} cy={52 - i * 9} rx={7} ry={3.4} fill={hue} stroke="none" transform={`rotate(${-34} ${28 + i * 5} ${52 - i * 9})`} />
          ))}
        </g>
      )
    case 'kanga':
      return (
        <g fill={hue}>
          <ellipse cx={34} cy={44} rx={15} ry={10} transform="rotate(-18 34 44)" />
          <path d="M46 38 Q 60 30 62 20 l 6 2 q -2 12 -20 22 Z" />
          <circle cx={62} cy={18} r={5.4} />
          <path d="M20 46 Q 6 52 4 62 l 6 2 q 6 -8 14 -12 Z" />
          <path d="M40 52 q 2 10 -8 12 l 14 0 q 4 -8 0 -14 Z" />
        </g>
      )
    case 'wattle':
      return (
        <g fill={hue}>
          {range(8).map((i) => {
            const a = (i / 8) * Math.PI * 2
            return <circle key={i} cx={34 + Math.cos(a) * 13} cy={38 + Math.sin(a) * 13} r={5.6} />
          })}
          <circle cx={34} cy={38} r={6.4} />
        </g>
      )
    case 'sun':
      return (
        <g stroke={hue} strokeWidth="3" fill="none">
          <circle cx={34} cy={38} r={12} fill={hue} stroke="none" />
          {range(8).map((i) => {
            const a = (i / 8) * Math.PI * 2
            return (
              <line
                key={i}
                x1={34 + Math.cos(a) * 17}
                y1={38 + Math.sin(a) * 17}
                x2={34 + Math.cos(a) * 25}
                y2={38 + Math.sin(a) * 25}
              />
            )
          })}
        </g>
      )
    case 'star':
      return (
        <path
          fill={hue}
          d="M34 14 L39 30 L56 30 L42 40 L47 56 L34 46 L21 56 L26 40 L12 30 L29 30 Z"
        />
      )
  }
}

export const Stamp = memo(function Stamp({ stamp, size = 76 }: { stamp: StampDef; size?: number }) {
  const title = stamp.label
  return (
    <svg width={size} height={size} viewBox="0 0 68 76" role="img" aria-label={`Postage stamp: ${title}, ${stamp.value}`}>
      <rect x={2} y={2} width={64} height={72} fill="#f4ead2" stroke={stamp.hue} strokeWidth={2} strokeDasharray="3 3" />
      <rect x={8} y={8} width={52} height={60} fill="none" stroke={stamp.hue} strokeWidth={1.4} />
      <rect x={10} y={26} width={48} height={36} fill="#efe6cf" />
      <StampMotifSvg motif={stamp.motif} hue={stamp.hue} />
      <text x={12} y={20} fontSize={11} fontFamily="'Courier New', Courier, monospace" fill={stamp.hue} fontWeight="bold">
        {stamp.value}
      </text>
      <text x={56} y={20} fontSize={6.2} fontFamily="'Courier New', Courier, monospace" textAnchor="end" fill={stamp.hue}>
        POSTAGE
      </text>
    </svg>
  )
})

export function Postmark({ town, label, seed }: { town: string; label: string; seed: number }) {
  const r = mulberry32(seed ^ 0x9e37)
  const rot = Math.floor(r() * 24) - 12
  const townUp = town.replace(/’/g, "'").toUpperCase()
  const id = `pm-${seed}`
  return (
    <svg className="pcx-postmark" viewBox="0 0 150 96" aria-hidden="true" focusable="false" transform={`rotate(${rot})`}>
      <defs>
        <path id={id} d="M 18 48 a 30 30 0 1 1 60 0 a 30 30 0 1 1 -60 0" fill="none" />
      </defs>
      <g opacity="0.52" stroke="#2b322c" fill="none">
        <circle cx={48} cy={48} r={31} strokeWidth="1.6" />
        <circle cx={48} cy={48} r={25} strokeWidth="1.2" />
        {range(4).map((i) => (
          <path key={i} d={`M${84} ${34 + i * 10} q 14 -6 28 0 t 28 0`} strokeWidth="2" />
        ))}
      </g>
      <text fontSize="7.6" fontFamily="'Courier New', Courier, monospace" fill="#2b322c" opacity="0.62" letterSpacing="1.5">
        <textPath href={`#${id}`} startOffset="2%">
          {townUp} · (FIC) ·
        </textPath>
      </text>
      <text x={48} y={52} textAnchor="middle" fontSize="9.5" fontFamily="'Courier New', Courier, monospace" fill="#2b322c" opacity="0.66">
        {label}
      </text>
    </svg>
  )
}
