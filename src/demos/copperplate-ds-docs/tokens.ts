/**
 * Copperplate DS — token model.
 * The playground edits this state; the proof sheet re-renders from it and
 * "Copy as CSS" exports it. Pure functions only — no React here.
 */

export interface TokenState {
  ink: string
  paper: string
  accent: string
  accentInk: string
  success: string
  danger: string
  /** base spacing unit, px */
  space: number
  /** corner radius, px */
  radius: number
  /** body font size, px */
  fontSize: number
  /** modular scale ratio */
  scale: number
}

export const DEFAULT_TOKENS: TokenState = {
  ink: '#2a2118',
  paper: '#f6efe0',
  accent: '#a85b28',
  accentInk: '#fff6e8',
  success: '#4d7263',
  danger: '#a33f20',
  space: 8,
  radius: 6,
  fontSize: 16,
  scale: 1.25,
}

export const SCALE_OPTIONS = [
  { value: 1.125, label: '1.125 — major second' },
  { value: 1.2, label: '1.200 — minor third' },
  { value: 1.25, label: '1.250 — major third' },
  { value: 1.333, label: '1.333 — perfect fourth' },
]

export const SPACE_STEPS = [
  { name: 'xs', mult: 0.5 },
  { name: 's', mult: 1 },
  { name: 'm', mult: 1.5 },
  { name: 'l', mult: 2.5 },
  { name: 'xl', mult: 4 },
]

export const TYPE_STEPS = [
  { name: 'caption', pow: -1 },
  { name: 'body', pow: 0 },
  { name: 'lead', pow: 1 },
  { name: 'heading 3', pow: 2 },
  { name: 'heading 2', pow: 3 },
  { name: 'heading 1', pow: 4 },
]

export const round1 = (n: number) => Math.round(n * 10) / 10

export function spaceValue(base: number, mult: number): number {
  return round1(base * mult)
}

export function typeValue(base: number, ratio: number, pow: number): number {
  return round1(base * Math.pow(ratio, pow))
}

/** CSS custom-property map consumed by the live components (inline style). */
export function tokenVars(t: TokenState): Record<string, string> {
  return {
    '--t-ink': t.ink,
    '--t-paper': t.paper,
    '--t-accent': t.accent,
    '--t-accent-ink': t.accentInk,
    '--t-success': t.success,
    '--t-danger': t.danger,
    '--t-sp': `${t.space}px`,
    '--t-radius': `${t.radius}px`,
    '--t-fs': `${t.fontSize}px`,
    '--t-scale': String(t.scale),
  }
}

/** The :root block the "Copy as CSS" button exports. */
export function tokenCss(t: TokenState): string {
  const spaces = SPACE_STEPS.map((s) => `${s.name} ${spaceValue(t.space, s.mult)}`).join(' · ')
  const types = TYPE_STEPS.map((s) => `${s.name} ${typeValue(t.fontSize, t.scale, s.pow)}px`).join(' · ')
  return `/* ---------------------------------------------------------------
   Copperplate DS — design tokens
   Exported from the docs playground. Paste into your app entry;
   every component reads these through var().
--------------------------------------------------------------- */
:root {
  /* colour */
  --cp-ink: ${t.ink};
  --cp-paper: ${t.paper};
  --cp-accent: ${t.accent};
  --cp-accent-ink: ${t.accentInk};
  --cp-success: ${t.success};
  --cp-danger: ${t.danger};

  /* space & shape — ${spaces} */
  --cp-space: ${t.space}px;
  --cp-radius: ${t.radius}px;

  /* type — ${types} */
  --cp-font-size: ${t.fontSize}px;
  --cp-scale: ${t.scale};
}
`
}

/* --- colour maths (contrast table) ------------------------------------ */

export function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace('#', '')
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

export function isHex(v: string): boolean {
  return hexToRgb(v) !== null
}

function channel(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function luminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2])
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100
}

export function wcagLevel(ratio: number): 'AAA' | 'AA' | 'AA large' | 'Fail' {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA large'
  return 'Fail'
}
