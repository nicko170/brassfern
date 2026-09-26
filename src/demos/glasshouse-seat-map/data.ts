/**
 * The Glasshouse — venue + season data.
 *
 * The Glasshouse is a fictional independent theatre: 384 chairs across
 * stalls, a dress circle and six wall boxes, drawn as an architect's plan.
 * All coordinates are SVG units in a viewBox of 0 0 1000 900.
 * Availability is seeded per performance — deterministic fake sell-through.
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

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// ---------------------------------------------------------------- tiers

export type TierKey = 'box' | 'premium' | 'standard' | 'restricted' | 'gallery'

export interface Tier {
  key: TierKey
  name: string
  price: number
  blurb: string
}

export const TIERS: Record<TierKey, Tier> = {
  box: {
    key: 'box',
    name: 'Private box',
    price: 148,
    blurb: 'Your own four chairs on the wall, drinks brought to the door.',
  },
  premium: {
    key: 'premium',
    name: 'Premium',
    price: 118,
    blurb: 'Stalls centre, or the circle’s front rail. The critic’s rows.',
  },
  standard: {
    key: 'standard',
    name: 'Standard',
    price: 82,
    blurb: 'A full view at an honest price. Most of the house.',
  },
  restricted: {
    key: 'restricted',
    name: 'Restricted view',
    price: 52,
    blurb: 'Side stalls with a clipped upstage corner, priced accordingly.',
  },
  gallery: {
    key: 'gallery',
    name: 'Gallery',
    price: 46,
    blurb: 'Rear of the circle. The usher swears the acoustics peak up here.',
  },
}

export const TIER_ORDER: TierKey[] = ['box', 'premium', 'standard', 'restricted', 'gallery']

/** rank for "best seat" logic — lower is better */
const TIER_RANK: Record<TierKey, number> = {
  premium: 0,
  standard: 1,
  gallery: 2,
  restricted: 3,
  box: 9, // boxes never auto-suggested; ask the box office
}

export const BOOKING_FEE = 6.5
export const MAX_SEATS = 8
export const HOLD_MS = 10 * 60 * 1000

export function fmtMoney(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`
}

export function fmtTime(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

// ---------------------------------------------------------------- seats

export type SectionKey = 'stalls' | 'circle' | 'box'

export interface Seat {
  id: string // 'S-C07', 'C-A3', 'X2-4'
  section: SectionKey
  sectionName: string
  row: string
  num: number
  x: number
  y: number
  tier: TierKey
  restricted?: boolean
  boxNo?: number
}

export const CX = 473 // centre line of the house
const STAGE_Y = 96

const STALL_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']
const CIRCLE_ROWS = ['A', 'B', 'C', 'D', 'E', 'F']

/** gentle fan curve: edges of a row sit further from the stage */
function arc(x: number, depth = 17): number {
  const t = (x - CX) / 420
  return t * t * depth
}

function buildSeats(): Seat[] {
  const seats: Seat[] = []

  // ---- stalls: rows A–K, three blocks (7 · 10 · 7), two promenade aisles
  STALL_ROWS.forEach((row, i) => {
    const baseY = 196 + i * 36
    const blocks: Array<{ x0: number; count: number; side: 'L' | 'C' | 'R' }> = [
      { x0: 130, count: 7, side: 'L' },
      { x0: 350, count: 10, side: 'C' },
      { x0: 660, count: 7, side: 'R' },
    ]
    let num = 1
    for (const b of blocks) {
      for (let j = 0; j < b.count; j++, num++) {
        const x = b.x0 + j * 26
        let tier: TierKey = 'standard'
        let restricted = false
        if (b.side === 'C' && i <= 4) tier = 'premium'
        if (b.side !== 'C' && i <= 1 && (j <= 1 || j >= b.count - 2)) {
          tier = 'restricted'
          restricted = true
        }
        seats.push({
          id: `S-${row}${String(num).padStart(2, '0')}`,
          section: 'stalls',
          sectionName: 'Stalls',
          row,
          num,
          x,
          y: baseY + arc(x),
          tier,
          restricted,
        })
      }
    }
  })

  // ---- dress circle: rows A–F, single sweep of 20
  CIRCLE_ROWS.forEach((row, i) => {
    const baseY = 640 + i * 34
    for (let j = 0; j < 20; j++) {
      const x = 220 + j * 29.5
      let tier: TierKey = 'standard'
      if (i <= 1) tier = 'premium'
      else if (i >= 4) tier = 'gallery'
      seats.push({
        id: `C-${row}${j + 1}`,
        section: 'circle',
        sectionName: 'Dress circle',
        row,
        num: j + 1,
        x,
        y: baseY + arc(x, 22),
        tier,
      })
    }
  })

  // ---- six wall boxes, 2×2 chairs each, flanking the stalls
  for (let b = 1; b <= 6; b++) {
    const left = b <= 3
    const n = left ? b : b - 3
    const y0 = 246 + (n - 1) * 132
    const xs = left ? [52, 82] : [918, 948]
    let num = 1
    for (const x of xs) {
      for (let r = 0; r < 2; r++, num++) {
        seats.push({
          id: `X${b}-${num}`,
          section: 'box',
          sectionName: `Box ${b}`,
          row: '—',
          num,
          x,
          y: y0 + r * 32,
          tier: 'box',
          boxNo: b,
        })
      }
    }
  }

  return seats
}

export const SEATS: Seat[] = buildSeats()
export const SEAT_BY_ID: Record<string, Seat> = Object.fromEntries(SEATS.map((s) => [s.id, s]))
export const TOTAL_SEATS = SEATS.length
export const STAGE = { x: 250, y: 34, w: 446, h: 84, centreX: CX, apron: 128 }

/** rows grouped for the list view — boxes first, then stalls, then circle */
export interface RowGroup {
  key: string
  sectionName: string
  rowLabel: string
  seats: Seat[]
}

export const ROW_GROUPS: RowGroup[] = (() => {
  const groups: RowGroup[] = []
  const byRow = new Map<string, Seat[]>()
  for (const s of SEATS) {
    const k = `${s.section}:${s.sectionName}`
    if (!byRow.has(k)) byRow.set(k, [])
    byRow.get(k)!.push(s)
  }
  const order: SectionKey[] = ['box', 'stalls', 'circle']
  for (const sec of order) {
    for (const [k, seats] of byRow) {
      if (!k.startsWith(sec + ':')) continue
      const sectionName = k.split(':')[1]
      // box: one group per box; stalls/circle: one group per row
      if (sec === 'box') {
        groups.push({ key: k, sectionName: 'Private boxes', rowLabel: sectionName, seats })
      } else {
        const rows = new Map<string, Seat[]>()
        for (const s of seats) {
          if (!rows.has(s.row)) rows.set(s.row, [])
          rows.get(s.row)!.push(s)
        }
        for (const [row, rseats] of rows) {
          groups.push({ key: `${k}:${row}`, sectionName, rowLabel: `Row ${row}`, seats: rseats })
        }
      }
    }
  }
  return groups
})()

// ---------------------------------------------------------------- shows

export interface Show {
  id: string
  title: string
  kind: string
  blurb: string
  weekday: string
  dateShort: string
  day: string
  month: string
  time: string
  iso: string
  demand: number // 0..1 illustrative sell-through
  watching: number // illustrative concurrent browsers
}

export const SHOWS: Show[] = [
  {
    id: 'astrid-night-bus',
    title: 'Astrid & the Night Bus',
    kind: 'New Australian play',
    blurb:
      'A night-shift cleaner and a decommissioned bus. The premiere season everyone claims they saw first.',
    weekday: 'Saturday',
    dateShort: 'Sat 14 Nov',
    day: '14',
    month: 'NOV',
    time: '7:30 pm',
    iso: '2026-11-14T19:30:00',
    demand: 0.52,
    watching: 43,
  },
  {
    id: 'nocturne-six-voices',
    title: 'Nocturne for Six Voices',
    kind: 'Contemporary music theatre',
    blurb: 'Six singers, one piano, a city that will not sleep. Sung in the dark for forty minutes. Trust us.',
    weekday: 'Friday',
    dateShort: 'Fri 20 Nov',
    day: '20',
    month: 'NOV',
    time: '8:00 pm',
    iso: '2026-11-20T20:00:00',
    demand: 0.34,
    watching: 27,
  },
  {
    id: 'understudys-wife',
    title: 'The Understudy’s Wife',
    kind: 'Comedy',
    blurb:
      'She has heard every line from the wings for eleven years. Tonight she says them all, out of order, on purpose.',
    weekday: 'Saturday',
    dateShort: 'Sat 28 Nov',
    day: '28',
    month: 'NOV',
    time: '2:00 pm',
    iso: '2026-11-28T14:00:00',
    demand: 0.24,
    watching: 15,
  },
]

/**
 * Deterministic fake availability for a performance — sells in little
 * clusters like real bookings (couples and foursomes), per-seat seeded.
 */
export function soldFor(showId: string): Set<string> {
  const show = SHOWS.find((s) => s.id === showId)
  const demand = show ? show.demand : 0.3
  const rnd = mulberry(hashString(`glasshouse:${showId}`))
  const sold = new Set<string>()
  let run = 0
  for (const s of SEATS) {
    if (run > 0) {
      if (rnd() < 0.82) {
        sold.add(s.id)
        run--
        continue
      }
      run = 0
    }
    if (rnd() < demand) {
      sold.add(s.id)
      run = 1 + Math.floor(rnd() * 3) // companions
    }
  }
  return sold
}

// ---------------------------------------------------------------- helpers

export function sightline(s: Seat): string {
  if (s.restricted) return 'Side-on to the stage — the upstage corner clips behind the proscenium leg.'
  if (s.section === 'box') return 'From the wall boxes you watch the house as much as the play.'
  const m = Math.max(4, Math.round(Math.hypot(s.x - CX, s.y - STAGE_Y) / 24))
  if (s.section === 'circle') {
    return s.row <= 'B'
      ? `Front rail of the circle, ${m} m out — the whole stage picture at once.`
      : `Elevated and centred, ${m} m out. The usher’s favourite acoustics.`
  }
  if (Math.abs(s.x - CX) < 42) return `Dead centre, about ${m} m from the footlights.`
  return `A slight angle on the stage, about ${m} m from the footlights.`
}

/** nearest free seat from `from` in a cardinal direction (keyboard nav) */
export function nearestInDirection(from: Seat, dir: 'up' | 'down' | 'left' | 'right', skip: Set<string>): Seat | null {
  let best: Seat | null = null
  let bestScore = Infinity
  for (const s of SEATS) {
    if (s.id === from.id || skip.has(s.id)) continue
    const dx = s.x - from.x
    const dy = s.y - from.y
    let primary = 0
    let perp = 0
    if (dir === 'left') { primary = -dx; perp = Math.abs(dy) }
    if (dir === 'right') { primary = dx; perp = Math.abs(dy) }
    if (dir === 'up') { primary = -dy; perp = Math.abs(dx) }
    if (dir === 'down') { primary = dy; perp = Math.abs(dx) }
    if (primary <= 4) continue // must move that way
    const score = primary + perp * 3.2
    if (score < bestScore) {
      bestScore = score
      best = s
    }
  }
  return best
}

export function firstFree(sold: Set<string>): Seat | null {
  return SEATS.find((s) => !sold.has(s.id)) ?? null
}

/**
 * Best available: the best run of `party` adjacent free chairs in a row.
 * Boxes are excluded — the box office books those by phone, on purpose.
 */
export function findBestAvailable(sold: Set<string>, party: number): string[] | null {
  // Boxed so the closure assignments below survive TS control-flow analysis.
  const best = { current: null as { ids: string[]; score: number } | null }
  const consider = (run: Seat[]) => {
    const midX = run.reduce((n, s) => n + s.x, 0) / run.length
    const rowIdx = run[0].row.charCodeAt(0) - 64
    const sectionPenalty = run[0].section === 'circle' ? 6 : 0
    const score = TIER_RANK[run[0].tier] * 1000 + sectionPenalty + rowIdx * 9 + Math.abs(midX - CX) / 26
    if (!best.current || score < best.current.score) best.current = { ids: run.map((s) => s.id), score }
  }
  const rows = new Map<string, Seat[]>()
  for (const s of SEATS) {
    if (s.section === 'box') continue
    const k = `${s.section}:${s.row}`
    if (!rows.has(k)) rows.set(k, [])
    rows.get(k)!.push(s)
  }
  for (const seats of rows.values()) {
    const sorted = [...seats].sort((a, b) => a.x - b.x)
    let run: Seat[] = []
    const flush = () => {
      if (run.length >= party) {
        for (let i = 0; i + party <= run.length; i++) consider(run.slice(i, i + party))
      }
      run = []
    }
    for (const s of sorted) {
      const prev = run[run.length - 1]
      // adjacency = neighbouring columns of the same tier (aisles break runs)
      const contiguous = !!prev && s.x - prev.x < 34 && s.tier === prev.tier
      if (sold.has(s.id)) {
        flush()
      } else if (contiguous || !prev) {
        run.push(s)
      } else {
        flush()
        run = [s]
      }
    }
    flush()
  }
  return best.current?.ids ?? null
}
