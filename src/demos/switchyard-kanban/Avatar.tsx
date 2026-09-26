import { initials, type Person } from './data'

/**
 * Geometric initials avatar — never a photo. Ink block, cream geometry,
 * mono initials. The motif is deterministic per person, like a signal-box
 * stamp: circle, diagonal, bars, quarter, triangle, ring.
 */
export function Avatar({ person, size = 26 }: { person: Person; size?: number }) {
  const m = person.motif % 6
  const id = `swy-av-${person.id}`
  return (
    <svg
      className="swy-avatar"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label={person.name}
    >
      <title>{person.name}</title>
      <defs>
        <clipPath id={id}>
          <rect width="32" height="32" rx="7" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="32" height="32" className="swy-avatar__bg" />
        {m === 0 && <circle cx="24" cy="8" r="9" className="swy-avatar__fg" />}
        {m === 1 && <path d="M32 0 L0 32 L32 32 Z" className="swy-avatar__fg" />}
        {m === 2 && <rect x="0" y="24" width="32" height="8" className="swy-avatar__fg" />}
        {m === 3 && <path d="M0 0 A32 32 0 0 1 32 32 L32 0 Z" className="swy-avatar__fg" />}
        {m === 4 && <path d="M0 32 L16 6 L32 32 Z" className="swy-avatar__fg" />}
        {m === 5 && <circle cx="9" cy="9" r="7" fill="none" strokeWidth="3.5" className="swy-avatar__ring" />}
        <text x="16" y="21" textAnchor="middle" className="swy-avatar__init">
          {initials(person.name)}
        </text>
      </g>
    </svg>
  )
}
