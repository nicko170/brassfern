/**
 * Tallow & Co. Supper Series — seating data.
 *
 * "The Sawdust Room" is the dining room out the back of the fictional
 * Norwood butcher: one long table under the joists, six stools at the
 * butcher-block pass, two wall banquettes and a window rail. 36 chairs,
 * three ticketed suppers, seeded fake availability.
 *
 * All coordinates are in SVG units, viewBox 0 0 720 600.
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

// ---------------------------------------------------------------- events

export interface Supper {
  id: string
  sup: number // supper serial, e.g. 24
  iso: string // '2026-10-09T19:00:00'
  weekday: string
  dateShort: string
  month: string
  day: string
  title: string
  blurb: string
  courses: string[]
}

export const SUPPERS: Supper[] = [
  {
    id: 'salt-smoke',
    sup: 24,
    iso: '2026-10-09T19:00:00',
    weekday: 'Friday',
    dateShort: 'Fri 9 Oct',
    month: 'OCT',
    day: '09',
    title: 'Salt & Smoke',
    blurb:
      'Five courses built around the new smokehouse — and the first night anyone outside the family gets to stand at the pass and watch Gus slice.',
    courses: ['Smoked river trout rillette', 'Charred leek, cured yolk', 'Twelve-hour brisket, bone marrow', 'Burnt-honey custard'],
  },
  {
    id: 'whole-beast',
    sup: 25,
    iso: '2026-10-24T19:00:00',
    weekday: 'Saturday',
    dateShort: 'Sat 24 Oct',
    month: 'OCT',
    day: '24',
    title: 'The Whole Beast',
    blurb:
      'One Clare Valley hog, nose to tail, over an evening. Frankie walks the room explaining every cut before it lands on the table.',
    courses: ['Scratchings, quince mustard', 'Head cheese, pickled fennel', 'Loin chops, crackling crumb', 'Lard-pastry apple pie'],
  },
  {
    id: 'high-spring',
    sup: 26,
    iso: '2026-11-05T19:00:00',
    weekday: 'Thursday',
    dateShort: 'Thu 5 Nov',
    month: 'NOV',
    day: '05',
    title: 'High Spring Providore',
    blurb:
      'The Barossa patch in full flush: vegetables first, a sixty-day dry-aged rib to finish, and the rosé barrel tapped at the door.',
    courses: ['Asparagus, bottarga butter', 'Green olive focaccia', 'Garden vegetables, smoked ricotta', 'Dry-aged rib, spring onions', 'Rhubarb, buttermilk'],
  },
]

// ---------------------------------------------------------------- tiers

export type TierKey = 'counter' | 'table' | 'booth' | 'window'

export interface Tier {
  key: TierKey
  name: string
  price: number // fictional, per chair, courses + matched pour
  note: string
}

export const TIERS: Record<TierKey, Tier> = {
  counter: { key: 'counter', name: "Chef's counter", price: 185, note: 'Elbows on the pass' },
  table: { key: 'table', name: 'The long table', price: 145, note: 'Under the joists' },
  booth: { key: 'booth', name: 'Banquette', price: 165, note: 'Cosy wall seats' },
  window: { key: 'window', name: 'Window rail', price: 155, note: 'Over the lane' },
}

// ---------------------------------------------------------------- seats

export interface Seat {
  id: string
  tier: TierKey
  x: number
  y: number
  r: number
}

export interface Run {
  key: string
  name: string
  ids: string[]
  tier: TierKey
}

const seats: Seat[] = []
const runs: Run[] = []

function addRun(key: string, name: string, tier: TierKey, prefix: string, points: Array<[number, number]>, r: number) {
  const ids: string[] = []
  points.forEach(([x, y], i) => {
    const id = `${prefix}${i + 1}`
    ids.push(id)
    seats.push({ id, tier, x, y, r })
  })
  runs.push({ key, name, ids, tier })
}

// Chef's counter — six stools along the pass (top of the room)
addRun('counter', "Chef's counter", 'counter', 'C', [170, 246, 322, 398, 474, 550].map((x) => [x, 162] as [number, number]), 15)

// The long table — ten chairs each side
const tableXs = Array.from({ length: 10 }, (_, i) => 224 + i * ((496 - 224) / 9))
addRun('table-top', 'Long table · north side', 'table', 'T', tableXs.map((x) => [x, 222] as [number, number]), 13)
addRun('table-bottom', 'Long table · south side', 'table', 'T', tableXs.map((x) => [x, 374] as [number, number]), 13)

// Wall banquettes — three chairs per wall
addRun('booth-left', 'Banquette · west wall', 'booth', 'B', [0, 1, 2].map((i) => [142, 256 + i * 46] as [number, number]), 14)
addRun('booth-right', 'Banquette · east wall', 'booth', 'B', [0, 1, 2].map((i) => [578, 256 + i * 46] as [number, number]), 14)

// Window rail — four stools along the lane window (bottom)
addRun('window', 'Window rail', 'window', 'W', [232, 321, 417, 506].map((x) => [x, 556] as [number, number]), 14)

export const SEATS = seats
export const RUNS = runs
export const SEAT_BY_ID: Record<string, Seat> = Object.fromEntries(seats.map((s) => [s.id, s]))
export const RUN_OF_SEAT: Record<string, Run> = {}
for (const run of runs) for (const id of run.ids) RUN_OF_SEAT[id] = run
export const TOTAL_SEATS = seats.length

// -------------------------------------------------------------- availability

/**
 * Seeded "box office" availability per supper. Taken chairs arrive in
 * blocks (people book together), with a per-run sell-through so one
 * supper reads nearly full and another roomy.
 */
export function takenFor(supperId: string): Set<string> {
  const rnd = mulberry(hashString(`tallow-sawdust-${supperId}`))
  const taken = new Set<string>()

  // per-run sold-through between ~25% and ~85%
  for (const run of runs) {
    const sellThrough = 0.25 + rnd() * 0.6
    const ids = [...run.ids]
    // shuffle
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1))
      ;[ids[i], ids[j]] = [ids[j], ids[i]]
    }
    let target = Math.round(run.ids.length * sellThrough)
    // sell in blocks of 1–3 starting at random anchors so the map reads real
    let guard = 40
    while (target > 0 && guard-- > 0) {
      const start = Math.floor(rnd() * run.ids.length)
      const block = 1 + Math.floor(rnd() * 3)
      for (let k = 0; k < block && target > 0; k++) {
        const id = run.ids[Math.min(start + k, run.ids.length - 1)]
        if (!taken.has(id)) {
          taken.add(id)
          target--
        }
      }
    }
  }

  // guarantee at least one party-of-4 block survives somewhere (demo stays bookable)
  const roomy = runs[rnd() < 0.5 ? 1 : 2] // a long-table side
  const free: string[] = []
  for (const id of roomy.ids) if (!taken.has(id)) free.push(id)
  let longest = 0
  let cur = 0
  const isFree = new Set(free)
  for (let i = 0; i < roomy.ids.length; i++) {
    cur = isFree.has(roomy.ids[i]) ? cur + 1 : 0
    longest = Math.max(longest, cur)
  }
  if (longest < 4) {
    let need = 4
    for (let i = 2; i < 7 && need > 0; i++) {
      if (taken.delete(roomy.ids[i])) need--
    }
  }

  return taken
}

// ------------------------------------------------------------- group logic

/**
 * Contiguous block selection: from an anchor chair, fill nearest free
 * chairs beside it within the same run — alternating sides — until the
 * party fits or the run is exhausted. Taken chairs and bench ends stop
 * the walk. This is the same rule the map and the accessible list use.
 */
export function blockFor(anchorId: string, party: number, taken: Set<string>): string[] {
  const run = RUN_OF_SEAT[anchorId]
  if (!run || taken.has(anchorId) || party < 1) return []
  const { ids } = run
  const a = ids.indexOf(anchorId)
  const picked = [anchorId]
  let l = a - 1
  let r = a + 1
  let takeRight = true
  while (picked.length < party) {
    const canL = l >= 0 && !taken.has(ids[l])
    const canR = r < ids.length && !taken.has(ids[r])
    if (!canL && !canR) break
    if (canR && (takeRight || !canL)) {
      picked.push(ids[r])
      r++
    } else if (canL) {
      picked.unshift(ids[l])
      l--
    }
    takeRight = !takeRight
  }
  return picked
}

// ------------------------------------------------------------- formatting

export const fmtMoney = (n: number) => `$${n.toLocaleString('en-AU')}`

export const fmtTime = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export const DIETARY_OPTIONS = ['All in', 'Vegetarian', 'Pescatarian', 'Gluten-free', 'Dairy-free'] as const

export const VENUE = {
  name: 'The Sawdust Room',
  address: '8 Ebenezer Place, Norwood, Adelaide',
  doors: 'Doors 6:45 pm · First course 7:00 pm sharp',
}

export const HOLD_MS = 10 * 60 * 1000
