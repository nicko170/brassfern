import type { ReactNode } from 'react'

/**
 * Copperplate glyph library — 24 icons, hand-cut on a 24×24 plate.
 * Spec: 1.5px stroke, round caps, no fills except intentional dots.
 * Every glyph renders at currentColor so it inherits its context.
 */

export interface Glyph {
  name: string
  tags: string[]
  art: ReactNode
}

export const GLYPHS: Glyph[] = [
  {
    name: 'gauge',
    tags: ['performance', 'metric', 'speed', 'dashboard'],
    art: (
      <>
        <path d="M4 14a8 8 0 0 1 16 0" />
        <path d="M12 14l4.2-5" />
        <circle cx="12" cy="14" r="1.3" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: 'activity',
    tags: ['pulse', 'monitor', 'heartbeat', 'live'],
    art: <path d="M3 12h4l2.5-6 4.5 12 2.5-6h4.5" />,
  },
  {
    name: 'server',
    tags: ['infrastructure', 'host', 'rack', 'database'],
    art: (
      <>
        <rect x="4" y="5" width="16" height="6" rx="1.5" />
        <rect x="4" y="13" width="16" height="6" rx="1.5" />
        <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
        <circle cx="8" cy="16" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: 'layers',
    tags: ['stack', 'levels', 'arrange'],
    art: (
      <>
        <path d="M12 4l8 4-8 4-8-4 8-4z" />
        <path d="M4 12l8 4 8-4" />
        <path d="M4 16l8 4 8-4" />
      </>
    ),
  },
  {
    name: 'terminal',
    tags: ['cli', 'console', 'command', 'code', 'logs'],
    art: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 10l3 2-3 2" />
        <path d="M12.5 14.2h4.5" />
      </>
    ),
  },
  {
    name: 'bell',
    tags: ['alert', 'notification', 'notify'],
    art: (
      <>
        <path d="M6 16.5v-5.7a6 6 0 0 1 12 0v5.7l1.2 1.8H4.8L6 16.5z" />
        <path d="M10.4 20.4a1.8 1.8 0 0 0 3.2 0" />
      </>
    ),
  },
  {
    name: 'filter',
    tags: ['funnel', 'narrow', 'refine', 'query'],
    art: <path d="M4 6h16l-6.2 7v4.6L10 20v-7L4 6z" />,
  },
  {
    name: 'search',
    tags: ['find', 'magnifier', 'query'],
    art: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="M15.4 15.4L20 20" />
      </>
    ),
  },
  {
    name: 'sliders',
    tags: ['settings', 'controls', 'adjust', 'tune'],
    art: (
      <>
        <path d="M4 8h16" />
        <path d="M4 16h16" />
        <circle cx="9.5" cy="8" r="2.2" />
        <circle cx="14.5" cy="16" r="2.2" />
      </>
    ),
  },
  {
    name: 'database',
    tags: ['data', 'store', 'query', 'table'],
    art: (
      <>
        <ellipse cx="12" cy="6" rx="7" ry="2.8" />
        <path d="M5 6v12c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V6" />
        <path d="M5 12c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8" />
      </>
    ),
  },
  {
    name: 'branch',
    tags: ['git', 'version', 'merge', 'fork'],
    art: (
      <>
        <circle cx="7" cy="6" r="2.1" />
        <circle cx="7" cy="18" r="2.1" />
        <circle cx="17" cy="8" r="2.1" />
        <path d="M7 8.1v7.8" />
        <path d="M17 10.1c0 3.8-4.6 3.4-6.8 5.6" />
      </>
    ),
  },
  {
    name: 'clock',
    tags: ['time', 'schedule', 'duration', 'latency'],
    art: (
      <>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M12 7.4V12l3.1 2.5" />
      </>
    ),
  },
  {
    name: 'alert',
    tags: ['warning', 'error', 'danger', 'incident'],
    art: (
      <>
        <path d="M12 4.4L21 19.6H3L12 4.4z" />
        <path d="M12 10v4" />
        <circle cx="12" cy="16.9" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: 'check',
    tags: ['done', 'ok', 'success', 'tick'],
    art: <path d="M5 12.6l4.4 4.4L19 7.6" />,
  },
  {
    name: 'plus',
    tags: ['add', 'new', 'create'],
    art: <path d="M12 5v14M5 12h14" />,
  },
  {
    name: 'arrow-right',
    tags: ['next', 'forward', 'go', 'continue'],
    art: (
      <>
        <path d="M4 12h15" />
        <path d="M13.6 6.2L19.4 12l-5.8 5.8" />
      </>
    ),
  },
  {
    name: 'copy',
    tags: ['duplicate', 'clipboard'],
    art: (
      <>
        <rect x="9" y="9" width="11" height="11" rx="1.6" />
        <path d="M5.5 15h-.7A1.8 1.8 0 0 1 3 13.2V4.8A1.8 1.8 0 0 1 4.8 3h8.4A1.8 1.8 0 0 1 15 4.8v.7" />
      </>
    ),
  },
  {
    name: 'eye',
    tags: ['view', 'visible', 'observe', 'preview'],
    art: (
      <>
        <path d="M2.6 12S6.2 5.8 12 5.8 21.4 12 21.4 12 17.8 18.2 12 18.2 2.6 12 2.6 12z" />
        <circle cx="12" cy="12" r="2.6" />
      </>
    ),
  },
  {
    name: 'lock',
    tags: ['secure', 'private', 'auth', 'permission'],
    art: (
      <>
        <rect x="5.5" y="10.5" width="13" height="9" rx="1.6" />
        <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
        <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: 'user',
    tags: ['person', 'account', 'profile', 'owner'],
    art: (
      <>
        <circle cx="12" cy="8.2" r="3.4" />
        <path d="M5.6 19.6c.9-3.4 3.4-5.1 6.4-5.1s5.5 1.7 6.4 5.1" />
      </>
    ),
  },
  {
    name: 'globe',
    tags: ['world', 'region', 'network', 'edge'],
    art: (
      <>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M3.8 12h16.4" />
        <path d="M12 3.8c2.6 2.3 4 5 4 8.2s-1.4 5.9-4 8.2c-2.6-2.3-4-5-4-8.2s1.4-5.9 4-8.2z" />
      </>
    ),
  },
  {
    name: 'bolt',
    tags: ['fast', 'energy', 'trigger', 'instant'],
    art: <path d="M13 3L6 13.5h4.6L10.5 21l7-10.5h-4.6L13 3z" />,
  },
  {
    name: 'grid',
    tags: ['layout', 'apps', 'overview', 'tiles'],
    art: (
      <>
        <rect x="4.6" y="4.6" width="6.3" height="6.3" rx="1" />
        <rect x="13.1" y="4.6" width="6.3" height="6.3" rx="1" />
        <rect x="4.6" y="13.1" width="6.3" height="6.3" rx="1" />
        <rect x="13.1" y="13.1" width="6.3" height="6.3" rx="1" />
      </>
    ),
  },
  {
    name: 'chip',
    tags: ['cpu', 'compute', 'processor', 'worker'],
    art: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="1.4" />
        <rect x="10.4" y="10.4" width="3.2" height="3.2" />
        <path d="M9.6 3.5V7M14.4 3.5V7M9.6 17v3.5M14.4 17v3.5M3.5 9.6H7M3.5 14.4H7M17 9.6h3.5M17 14.4h3.5" />
      </>
    ),
  },
  {
    name: 'compass',
    tags: ['explore', 'navigate', 'direction'],
    art: (
      <>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5 5-2.2z" />
      </>
    ),
  },
]

export function GlyphIcon({ name, size = 20 }: { name: string; size?: number }) {
  const glyph = GLYPHS.find((g) => g.name === name)
  return (
    <svg
      className="cpd-glyph"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph ? glyph.art : null}
    </svg>
  )
}

/** Inline X for dismiss buttons — kept simple, matches the stroke spec. */
export function CrossIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
