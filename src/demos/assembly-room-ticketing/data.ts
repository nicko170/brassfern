/**
 * Assembly Room — season + hall data.
 *
 * Assembly Room is a fictional contemporary chamber-music series playing a
 * horseshoe-shaped hall of 386 chairs: stalls on the floor, a dress circle
 * wrapping the side walls beside the stage, and a gallery balcony at the
 * back. All coordinates are SVG units in a viewBox of 0 0 1000 770.
 * Availability is seeded per programme — deterministic fake sell-through.
 */

// ---------------------------------------------------------------- rng

export function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// ---------------------------------------------------------------- season

export interface Work {
  composer: string
  title: string
}

export interface Show {
  id: string
  no: string
  title: string
  kind: string
  weekday: string
  dateShort: string
  day: string
  month: string
  year: number
  time: string
  dur: string
  artists: string
  notes: string
  works: Work[]
  /** price multiplier, e.g. the lunchtime recital is gentler */
  mul: number
  /** sell-through appetite — feeds the fake availability seed */
  demand: number
}

export const SHOWS: Show[] = [
  {
    id: 'moon-on-water',
    no: 'I',
    title: 'Moon on Water',
    kind: 'Evening concert',
    weekday: 'Friday',
    dateShort: '16 October',
    day: '16',
    month: 'OCT',
    year: 2026,
    time: '7.30 pm',
    dur: '~100 min incl. interval',
    artists: 'Wattlebird Quartet · Mara Ilves, piano',
    notes:
      'The season opens with music that moves like weather — Takemitsu’s rain garden, Debussy’s restlessness, and the Ravel quartet everyone hums on the train home.',
    works: [
      { composer: 'Toru Takemitsu', title: 'Rain Tree Sketch II' },
      { composer: 'Claude Debussy', title: 'String Quartet in G minor, Op. 10' },
      { composer: 'Maurice Ravel', title: 'String Quartet in F major' },
    ],
    mul: 1,
    demand: 1.12,
  },
  {
    id: 'lark-ascends',
    no: 'II',
    title: 'The Lark Ascends',
    kind: 'Sunday matinee',
    weekday: 'Sunday',
    dateShort: '25 October',
    day: '25',
    month: 'OCT',
    year: 2026,
    time: '3.00 pm',
    dur: '~90 min incl. interval',
    artists: 'Assembly Players · Aya Corcoran, violin',
    notes:
      'A matinee for people who like their big feelings before dinner. Corcoran takes the lark up through the hall’s famously kind roof acoustic.',
    works: [
      { composer: 'Ralph Vaughan Williams', title: 'The Lark Ascending' },
      { composer: 'Edward Elgar', title: 'Elegy for Strings, Op. 58' },
      { composer: 'Antonín Dvořák', title: 'String Quartet No. 12 “American”' },
    ],
    mul: 0.9,
    demand: 0.95,
  },
  {
    id: 'end-of-time',
    no: 'III',
    title: 'The End of Time',
    kind: 'Late concert',
    weekday: 'Thursday',
    dateShort: '5 November',
    day: '05',
    month: 'NOV',
    year: 2026,
    time: '8.00 pm',
    dur: '~55 min, no interval',
    artists: 'Assembly Players · Jonas Feld, clarinet',
    notes:
      'Messiaen wrote it in a camp on ration paper; we play it once a season, after dark, with the hall lights low. No interval — bring nothing that rustles.',
    works: [{ composer: 'Olivier Messiaen', title: 'Quartet for the End of Time (complete)' }],
    mul: 1,
    demand: 1.05,
  },
  {
    id: 'forty-minutes',
    no: 'IV',
    title: 'Forty Minutes of Schubert',
    kind: 'Lunchtime recital',
    weekday: 'Friday',
    dateShort: '13 November',
    day: '13',
    month: 'NOV',
    year: 2026,
    time: '1.00 pm',
    dur: '~45 min, no interval',
    artists: 'Mara Ilves, piano',
    notes:
      'In by one, out by two — the city’s gentlest lunch break. Coffee in the foyer from midday; the hall stays open for anyone who wants to sit a while after.',
    works: [{ composer: 'Franz Schubert', title: 'Impromptus, D. 899 (selection)' }],
    mul: 0.55,
    demand: 0.5,
  },
]

// ---------------------------------------------------------------- tiers

export type TierKey = 'a' | 'b' | 'gallery'

export interface Tier {
  key: TierKey
  name: string
  price: number
  blurb: string
}

export const TIERS: Record<TierKey, Tier> = {
  a: {
    key: 'a',
    name: 'A Reserve',
    price: 98,
    blurb: 'Stalls front and centre, or the circle’s stage-side rows. Close enough to read the score.',
  },
  b: {
    key: 'b',
    name: 'B Reserve',
    price: 72,
    blurb: 'Rear stalls and the outer circle. The usher’s honest favourite.',
  },
  gallery: {
    key: 'gallery',
    name: 'Gallery',
    price: 44,
    blurb: 'Up under the roof. Upright chairs, generous acoustics, the best view of the chandelier.',
  },
}

export const TIER_ORDER: TierKey[] = ['a', 'b', 'gallery']

const roundHalf = (n: number) => Math.round(n * 2) / 2

export function priceFor(show: Show, tier: TierKey): number {
  return roundHalf(TIERS[tier].price * show.mul)
}

// ---------------------------------------------------------------- ticket types

export type TypeKey = 'full' | 'concession' | 'companion'

export const TYPES: Record<TypeKey, { name: string; hint: string }> = {
  full: { name: 'Full price', hint: '' },
  concession: { name: 'Concession', hint: 'Seniors, students and pensioners — card at the door' },
  companion: { name: 'Companion card', hint: 'Free for a companion of a Companion Card holder' },
}

export function priceForType(show: Show, tier: TierKey, type: TypeKey): number {
  const base = priceFor(show, tier)
  if (type === 'companion') return 0
  if (type === 'concession') return roundHalf(base * 0.7)
  return base
}

export const FEES = { restoration: 3, booking: 4 }
export const MAX_SEATS = 6
export const HOLD_MS = 10 * 60 * 1000

// ---------------------------------------------------------------- the hall

export type SectionKey = 'stalls' | 'circle' | 'balcony'

export interface Seat {
  id: string
  section: SectionKey
  side?: 'left' | 'right'
  row: string
  num: number
  tier: TierKey
  x: number
  y: number
  wc?: boolean
}

export interface RowInfo {
  key: string
  label: string
  seats: Seat[]
}

const CX = 500
const CY = 70
const ROW_LETTERS = 'ABCDEFGHIJKL'

const polar = (r: number, th: number, cx = CX, cy = CY) => ({
  x: Math.round((cx + r * Math.sin(th)) * 10) / 10,
  y: Math.round((cy + r * Math.cos(th)) * 10) / 10,
})

const deg = (d: number) => (d * Math.PI) / 180

/** Stalls: 12 rows of 15 on widening arcs, two aisles, two wheelchair spaces in row L. */
function buildStalls(): RowInfo[] {
  const rows: RowInfo[] = []
  for (let i = 0; i < 12; i++) {
    const row = ROW_LETTERS[i]
    const r = 280 + i * 25
    const step = 28 / r
    const seats: Seat[] = []
    for (let n = 0; n < 15; n++) {
      // centre the row on the hall axis, opening a gap after seats 5 and 10
      const p = n - 7 + (n > 4 ? 0.3 : 0) + (n > 9 ? 0.3 : 0)
      const { x, y } = polar(r, p * step)
      const wc = i === 11 && n >= 13
      seats.push({
        id: `stalls-${row}-${n + 1}`,
        section: 'stalls',
        row,
        num: n + 1,
        tier: i <= 6 ? 'a' : 'b',
        x,
        y,
        wc,
      })
    }
    rows.push({ key: `stalls:${row}`, label: `Row ${row}`, seats })
  }
  return rows
}

/** Dress circle: five rows wrapping each side wall beside the stage. */
function buildCircle(): RowInfo[] {
  const rows: RowInfo[] = []
  for (let i = 0; i < 5; i++) {
    const row = ROW_LETTERS[i]
    const r = 330 + i * 26
    for (const side of ['left', 'right'] as const) {
      const seats: Seat[] = []
      for (let n = 0; n < 11; n++) {
        const th = deg(54 + n * 2.8)
        const sx = CX + (side === 'left' ? -1 : 1) * r * Math.sin(th)
        const sy = 330 - r * Math.cos(th)
        seats.push({
          id: `circle-${side}-${row}-${n + 1}`,
          section: 'circle',
          side,
          row,
          num: n + 1,
          tier: i <= 1 ? 'a' : 'b',
          x: Math.round(sx * 10) / 10,
          y: Math.round(sy * 10) / 10,
        })
      }
      rows.push({ key: `circle:${side}:${row}`, label: `Row ${row} · ${side}`, seats })
    }
  }
  return rows
}

/** Gallery balcony: four long rows under the roof, two aisles. */
function buildBalcony(): RowInfo[] {
  const rows: RowInfo[] = []
  for (let i = 0; i < 4; i++) {
    const row = ROW_LETTERS[i]
    const r = 585 + i * 26
    const step = 26 / r
    const seats: Seat[] = []
    for (let n = 0; n < 24; n++) {
      const p = n - 11.5 + (n > 7 ? 0.3 : 0) + (n > 15 ? 0.3 : 0)
      const { x, y } = polar(r, p * step)
      seats.push({
        id: `balcony-${row}-${n + 1}`,
        section: 'balcony',
        row,
        num: n + 1,
        tier: 'gallery',
        x,
        y,
      })
    }
    rows.push({ key: `balcony:${row}`, label: `Row ${row}`, seats })
  }
  return rows
}

export const SECTION_ROWS: Record<SectionKey, RowInfo[]> = {
  stalls: buildStalls(),
  circle: buildCircle(),
  balcony: buildBalcony(),
}

export const SECTIONS: Record<SectionKey, { name: string; blurb: string }> = {
  stalls: { name: 'Stalls', blurb: 'On the floor, in the wash of it.' },
  circle: { name: 'Dress circle', blurb: 'Along the walls, beside the stage.' },
  balcony: { name: 'Gallery balcony', blurb: 'Under the roof, over everything.' },
}

export const SEATS: Seat[] = (['stalls', 'circle', 'balcony'] as SectionKey[]).flatMap((s) =>
  SECTION_ROWS[s].flatMap((r) => r.seats),
)

export const SEAT_BY_ID: Record<string, Seat> = Object.fromEntries(SEATS.map((s) => [s.id, s]))
export const SECTION_KEYS: SectionKey[] = ['stalls', 'circle', 'balcony']
export const TOTAL_SEATS = SEATS.length

/** Flat seat list per section (row order). */
export function sectionSeats(section: SectionKey): Seat[] {
  return SECTION_ROWS[section].flatMap((r) => r.seats)
}

export function seatLabel(seat: Seat): string {
  const where =
    seat.section === 'circle'
      ? `${SECTIONS.circle.name} (${seat.side}), row ${seat.row}, seat ${seat.num}`
      : seat.wc
        ? `${SECTIONS[seat.section].name}, row ${seat.row}, wheelchair space ${seat.num}`
        : `${SECTIONS[seat.section].name}, row ${seat.row}, seat ${seat.num}`
  return where
}

// ---------------------------------------------------------------- availability (fake, deterministic)

const soldCache = new Map<string, Set<string>>()

export function soldFor(showId: string): Set<string> {
  const hit = soldCache.get(showId)
  if (hit) return hit
  const show = SHOWS.find((s) => s.id === showId) ?? SHOWS[0]
  const rng = mulberry(hashString(showId))
  const sold = new Set<string>()
  const base: Record<TierKey, number> = { a: 0.52, b: 0.47, gallery: 0.36 }
  for (const row of SECTION_KEYS.flatMap((k) => SECTION_ROWS[k])) {
    let rowSold = 0
    const cap = Math.max(2, row.seats.length - 2)
    for (const seat of row.seats) {
      const p = (seat.wc ? 0.18 : base[seat.tier]) * show.demand
      if (rowSold < cap && rng() < p) {
        sold.add(seat.id)
        rowSold++
        // pairs go fast — often take the chair next door too
        const next = row.seats[seat.num] // num is 1-based within the row
        if (next && !next.wc && !sold.has(next.id) && rowSold < cap && rng() < 0.42) {
          sold.add(next.id)
          rowSold++
        }
      }
    }
  }
  soldCache.set(showId, sold)
  return sold
}

export function freeInSection(showId: string, section: SectionKey, sold: Set<string>): number {
  return sectionSeats(section).reduce((n, s) => n + (sold.has(s.id) ? 0 : 1), 0)
}

// ---------------------------------------------------------------- zone art (overview plan)

function roundRectPath(x: number, y: number, w: number, h: number, r: number): string {
  return `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`
}

/** A band hugging a run of curved rows: left edge, back cap, right edge, front cap. */
function rowBand(rows: RowInfo[]): string {
  const padA = 0.05
  const pts: string[] = []
  const ptsR: string[] = []
  rows.forEach((row, i) => {
    const first = row.seats[0]
    const last = row.seats[row.seats.length - 1]
    const rIn = Math.hypot(first.x - CX, first.y - CY)
    const off = i === 0 ? -22 : i === rows.length - 1 ? 24 : 0
    const edge = (s: Seat, dir: 1 | -1) => {
      const th = Math.atan2(s.x - CX, s.y - CY) + dir * padA
      const rr = rIn + off
      return { x: CX + rr * Math.sin(th), y: CY + rr * Math.cos(th) }
    }
    const L = edge(first, -1)
    const R = edge(last, 1)
    pts.push(`${i === 0 ? 'M' : 'L'} ${L.x.toFixed(1)} ${L.y.toFixed(1)}`)
    ptsR.unshift(`L ${R.x.toFixed(1)} ${R.y.toFixed(1)}`)
  })
  return [...pts, ...ptsR, 'Z'].join(' ')
}

function seatBox(seats: Seat[]): string {
  const xs = seats.map((s) => s.x)
  const ys = seats.map((s) => s.y)
  const pad = 20
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  return roundRectPath(minX, minY, Math.max(...xs) - minX + pad, Math.max(...ys) - minY + pad, 24)
}

export const BANDS: Record<SectionKey, string[]> = {
  stalls: [rowBand(SECTION_ROWS.stalls)],
  circle: [
    seatBox(sectionSeats('circle').filter((s) => s.side === 'left')),
    seatBox(sectionSeats('circle').filter((s) => s.side === 'right')),
  ],
  balcony: [rowBand(SECTION_ROWS.balcony)],
}

function centroid(seats: Seat[]): { x: number; y: number } {
  const { x, y } = seats.reduce((a, s) => ({ x: a.x + s.x, y: a.y + s.y }), { x: 0, y: 0 })
  return { x: Math.round(x / seats.length), y: Math.round(y / seats.length) }
}

export const CENTROIDS: Record<SectionKey, { x: number; y: number }> = {
  stalls: centroid(sectionSeats('stalls')),
  circle: centroid(sectionSeats('circle')),
  balcony: centroid(sectionSeats('balcony')),
}

/** Stage art path (viewBox 0 0 1000 770). */
export const STAGE_PATH = 'M 320 84 Q 500 134 680 84 L 680 30 L 320 30 Z'

// ---------------------------------------------------------------- formatting

export function fmtMoney(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`
}

export function fmtClock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
