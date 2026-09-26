/**
 * Trailswell stamp icons — chunky two-weight line drawings, pushed through a
 * turbulence displacement filter so every edge reads as ink pressed into
 * paper by hand. One shared defs block; icons draw with currentColor.
 */
import type { IconKey } from './data'

/** Rubber-stamp roughness filter. Mount once near the app root. */
export function StampDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <filter id="tw-rough" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
        </filter>
        <filter id="tw-rough-soft" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" />
        </filter>
      </defs>
    </svg>
  )
}

function Glyph({ icon }: { icon: IconKey }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (icon) {
    case 'sun':
      return (
        <g {...common}>
          <circle cx="12" cy="12" r="4.6" />
          <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
        </g>
      )
    case 'boot':
      return (
        <g {...common}>
          <path d="M7 3.5h6v7.5c2.4.4 4.6 1.6 5.6 3.6l1 2.1c.3.7-.1 1.5-.9 1.5H6.6c-.8 0-1.4-.6-1.4-1.4V4.9c0-.8.7-1.4 1.8-1.4Z" />
          <path d="M7 8h6M5.2 15.4h14.5" />
        </g>
      )
    case 'mug':
      return (
        <g {...common}>
          <path d="M5 8.5h10v7.2a3.8 3.8 0 0 1-3.8 3.8H8.8A3.8 3.8 0 0 1 5 15.7V8.5Z" />
          <path d="M15 10.2h2a2.6 2.6 0 0 1 0 5.2h-2" />
          <path d="M8 3.4c.9 1-.9 1.6 0 2.6M11.5 3.4c.9 1-.9 1.6 0 2.6" />
        </g>
      )
    case 'moon':
      return (
        <g {...common}>
          <path d="M19.4 13.8A8 8 0 1 1 10.2 4.6a6.6 6.6 0 0 0 9.2 9.2Z" />
        </g>
      )
    case 'book':
      return (
        <g {...common}>
          <path d="M5 5.6c2-1.2 4.4-1.2 6.4 0v13.2c-2-1.2-4.4-1.2-6.4 0V5.6Z" />
          <path d="M19 5.6c-2-1.2-4.4-1.2-6.4 0v13.2c2-1.2 4.4-1.2 6.4 0V5.6Z" />
        </g>
      )
    case 'leaf':
      return (
        <g {...common}>
          <path d="M19.5 4.5C11 4.5 5.5 9 5.5 14.5c0 2.6 1.8 4.5 4.4 4.5 5.5 0 9.6-6.5 9.6-14.5Z" />
          <path d="M5.5 19c2.2-5.6 6-9.6 11-12" />
        </g>
      )
    case 'drop':
      return (
        <g {...common}>
          <path d="M12 3.6c3 3.6 5.6 6.8 5.6 10a5.6 5.6 0 0 1-11.2 0c0-3.2 2.6-6.4 5.6-10Z" />
          <path d="M9.4 14.2a2.8 2.8 0 0 0 2.4 3" />
        </g>
      )
    case 'bell':
      return (
        <g {...common}>
          <path d="M12 4a5.4 5.4 0 0 1 5.4 5.4c0 4 .9 5.4 1.8 6.4H4.8c.9-1 1.8-2.4 1.8-6.4A5.4 5.4 0 0 1 12 4Z" />
          <path d="M10 19.4a2.1 2.1 0 0 0 4 0" />
        </g>
      )
  }
}

/**
 * A stamp: glyph inside a hand-pressed ring. `filled` swaps to solid ink
 * (the pressed checkmark state is handled by the caller with a check glyph).
 */
export function Stamp({
  icon,
  size = 44,
  rough = true,
  className = '',
}: {
  icon: IconKey
  size?: number
  rough?: boolean
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={`tw-stampicon ${className}`}
    >
      <g filter={rough ? 'url(#tw-rough)' : undefined}>
        <Glyph icon={icon} />
      </g>
    </svg>
  )
}

/** Standalone pressed checkmark, used inside toggles and the celebration. */
export function CheckGlyph({ width = 2.4 }: { width?: number }) {
  return (
    <path
      d="M5 12.6l4.2 4.4L19 7.4"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}
