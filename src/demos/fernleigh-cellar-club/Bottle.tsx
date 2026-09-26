import type { Wine } from './data'

/**
 * Hand-drawn SVG bottle. No photographs: a bottle silhouette with a wax
 * capsule, a paper label and a coloured stripe for the varietal. Variant
 * 'row' is a half-bottle used in the cellar list; 'hero' adds a punt shadow.
 */
export default function Bottle({
  wine,
  vintage,
  variant = 'card',
}: {
  wine: Wine
  vintage?: number
  variant?: 'card' | 'row' | 'hero'
}) {
  const spark = wine.kind === 'sparkling'
  const id = `fcc-b-${wine.id}-${variant}-${vintage ?? 'x'}`
  return (
    <svg
      className={`fcc-bottle fcc-bottle--${variant}`}
      viewBox="0 0 60 180"
      role="img"
      aria-label={`Bottle of ${wine.name} ${wine.varietal}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={wine.glass} stopOpacity="0.92" />
          <stop offset="0.42" stopColor={wine.kind === 'red' ? '#2c352a' : wine.glass} />
          <stop offset="0.62" stopColor={wine.glass} />
          <stop offset="1" stopColor={wine.kind === 'red' ? '#161b14' : '#a8b393'} />
        </linearGradient>
      </defs>
      {/* capsule */}
      {spark ? (
        <path d="M22 4h16l4 14c0 4-4 7-12 7s-12-3-12-7z" fill={wine.capsule} />
      ) : (
        <rect x="23" y="2" width="14" height="22" rx="3" fill={wine.capsule} />
      )}
      {spark && <circle cx="30" cy="8" r="4" fill="#e7e2cf" opacity="0.65" />}
      {/* neck + shoulders */}
      <path
        d={
          spark
            ? 'M25 22h10v26c14 6 17 16 17 26v96a10 10 0 0 1-10 10H18a10 10 0 0 1-10-10V74c0-10 3-20 17-26z'
            : 'M25 22h10v30c12 5 15 14 15 24v94a10 10 0 0 1-10 10H20a10 10 0 0 1-10-10V76c0-10 3-19 15-24z'
        }
        fill={`url(#${id})`}
      />
      {/* glass highlight */}
      <rect x="14" y="80" width="4" height="88" rx="2" fill="#ffffff" opacity={wine.kind === 'red' ? 0.07 : 0.28} />
      {/* label */}
      <rect x="13" y="92" width="34" height="46" rx="1.5" fill="#efe9d8" />
      <rect x="13" y="92" width="34" height="5" fill={wine.capsule} />
      <text x="30" y="110" textAnchor="middle" className="fcc-bottle__name">
        {wine.name.split(' ').map((word, i) => (
          <tspan key={i} x="30" dy={i === 0 ? 0 : 8.5}>
            {word}
          </tspan>
        ))}
      </text>
      <text x="30" y="132" textAnchor="middle" className="fcc-bottle__var">
        {wine.varietal}
      </text>
      {vintage != null && (
        <text x="30" y="147" textAnchor="middle" className="fcc-bottle__vint">
          {vintage}
        </text>
      )}
      {/* punt */}
      {variant !== 'row' && <ellipse cx="30" cy="178" rx="17" ry="2" fill="#000" opacity="0.14" />}
    </svg>
  )
}
