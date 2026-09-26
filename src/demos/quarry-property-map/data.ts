/**
 * Quarry & Compass — data layer.
 *
 * Everything here is invented: the Ironbark Shire, its eight districts, the
 * Mercantile Quay employment hub, every street, lot, agent and open time.
 * Listings are generated deterministically (seeded PRNG) so the atlas is
 * identical on every visit — like any good survey.
 */

export const WORLD = { w: 1200, h: 760 }

/** The employment hub all commutes are measured against. */
export const HUB = { x: 596, y: 296, name: 'Mercantile Quay' }

export const TYPES = ['House', 'Townhouse', 'Unit', 'Land'] as const
export type PropertyType = (typeof TYPES)[number]

export const PRICE_FLOOR = 400_000
export const PRICE_CEIL = 3_000_000
export const COMMUTE_MAX = 90

/* ----------------------------------------------------- randomness */

function mulberry32(seed: number) {
  let a = seed | 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/* ----------------------------------------------------- districts */

export interface Suburb {
  name: string
  cx: number
  cy: number
  r: number
  /** typical asking price anchor */
  base: number
  /** minutes added to (or taken from) raw drive time */
  commuteBias: number
  /** weighted type palette for this district */
  types: PropertyType[]
  note: string
}

export const SUBURBS: Suburb[] = [
  {
    name: 'Old Quarry',
    cx: 430, cy: 372, r: 128,
    base: 1_450_000, commuteBias: 6,
    types: ['House', 'House', 'Townhouse', 'Townhouse', 'Unit'],
    note: 'Bluestone terraces and worker’s cottages around the original 1898 cut.',
  },
  {
    name: 'Kestrel Ridge',
    cx: 838, cy: 196, r: 118,
    base: 1_680_000, commuteBias: 14,
    types: ['House', 'House', 'House', 'Townhouse'],
    note: 'Hillside streets above the treeline; most blocks face the ranges.',
  },
  {
    name: 'Briarbank',
    cx: 286, cy: 585, r: 120,
    base: 1_120_000, commuteBias: 16,
    types: ['House', 'House', 'House', 'Unit'],
    note: 'River-flat family streets with deep gardens and a rowing club.',
  },
  {
    name: 'Saltpan Flats',
    cx: 958, cy: 586, r: 148,
    base: 640_000, commuteBias: 27,
    types: ['Land', 'Land', 'House', 'House'],
    note: 'Big sky country on the shire’s edge — released lots and weekender shacks.',
  },
  {
    name: 'Myall Crossing',
    cx: 590, cy: 492, r: 108,
    base: 980_000, commuteBias: -6,
    types: ['Unit', 'Unit', 'Townhouse', 'Townhouse', 'House'],
    note: 'The commuter pocket: everything within eight minutes of the station.',
  },
  {
    name: 'Woolshed Hill',
    cx: 176, cy: 208, r: 128,
    base: 1_900_000, commuteBias: 26,
    types: ['House', 'House', 'House', 'Land'],
    note: 'Acreage, orchards and shearing sheds converted with restraint.',
  },
  {
    name: 'Pindari',
    cx: 726, cy: 646, r: 112,
    base: 2_350_000, commuteBias: 18,
    types: ['House', 'House', 'House', 'Townhouse'],
    note: 'Leafy prestige streets above the dam; the shire’s old money.',
  },
  {
    name: 'Granite Gully',
    cx: 1032, cy: 366, r: 118,
    base: 1_280_000, commuteBias: 23,
    types: ['House', 'House', 'Townhouse', 'Land'],
    note: 'Boulder country with fire trails, artist studios and cold mornings.',
  },
]

/* ----------------------------------------------------- vocabulary */

const STREET_NAMES = [
  'Surveyor’s', 'Theodolite', 'Ironbark', 'Culvert', 'Dray', 'Anvil',
  'Bluestone', 'Chaffcutter', 'Stringybark', 'Posthole', 'Adit', 'Ballast',
  'Cinnabar', 'Prospector', 'Diggings', 'Ochre', 'Chert', 'Mallet',
  'Winnow', 'Drystone', 'Mullock', 'Gunbarrel', 'Fernacre', 'Trace',
  'Line-of-Sight', 'Pick', 'Gad', 'Dollypot', 'Sluice', 'Crown',
]

const STREET_SUFFIX = [
  'Road', 'Street', 'Lane', 'Parade', 'Close', 'Crescent',
  'Terrace', 'Track', 'Circuit', 'Mews',
]

const FEATURES = [
  'North-facing garden', 'Bluestone cellar', 'River frontage',
  'Shed with 3-phase power', 'Baltic pine floors', 'Established orchard',
  'Solar + battery', 'Bore water', 'Wraparound verandah',
  'Studio over the garage', 'Fenced paddock', 'Slow-combustion fire',
  'Ducted cooling', '22 kL tank water', 'View to the ranges',
  'Walk to the station', 'Dual-occupancy potential', 'Heritage facade',
  'Workshop bench', 'Bay window', 'Mudroom', 'Morning-sun kitchen',
  'Fruit trees', 'Level lawn', 'Bush outlook', 'Cellar',
]

const OPEN_SLOTS: Array<[string, string]> = [
  ['Saturday', '11:00 – 11:30 am'],
  ['Saturday', '1:15 – 1:45 pm'],
  ['Wednesday', '5:15 – 5:45 pm'],
  ['Thursday', '12:15 – 12:45 pm'],
  ['Sunday', '10:00 – 10:30 am'],
]

const AGENTS = [
  { name: 'Ada Kershaw', phone: '0408 555 214' },
  { name: 'Miller Onyema', phone: '0412 555 908' },
  { name: 'Bec Hartley', phone: '0402 555 371' },
  { name: 'Dom Vella', phone: '0429 555 160' },
]

const BLURB_OPENERS: Record<PropertyType, string[]> = {
  House: [
    'A straight-backed family home that has watched the district grow up around it.',
    'Solid where it counts, sunny where it matters — this one has been kept, not flipped.',
    'The sort of house the street measures itself against.',
  ],
  Townhouse: [
    'A smart terrace with no wasted steps and a courtyard built for evenings.',
    'Low-maintenance without being low-character; the joinery alone is worth the visit.',
    'Terrace living done properly — brick, light and a shed of a kitchen.',
  ],
  Unit: [
    'A honest apartment with cross-breeze, a proper pantry and no lift to wait for.',
    'First-rung buying that doesn’t feel like settling — light on two sides.',
    'Compact, calm and walking distance to everything that matters midweek.',
  ],
  Land: [
    'A surveyed, fenced and pegged parcel ready for whatever you can get approved.',
    'Blank in the best way — flat, drained and staked at every corner.',
    'The last of the old release; soil tested, titled and ready to build on.',
  ],
}

const BLURB_CLOSERS = [
  'Inspection times below; bring boots if it’s rained.',
  'The owner has already bought elsewhere and means it.',
  'Priced on recent comparable sales, not optimism.',
  'Documents available on request — title, rates and the last survey.',
  'Best inspected mid-morning when the light does the selling.',
]

/* ----------------------------------------------------- listings */

export interface Listing {
  id: string
  lot: string
  address: string
  suburb: string
  x: number
  y: number
  price: number
  beds: number
  baths: number
  cars: number
  type: PropertyType
  /** m²; 0 for units */
  land: number
  /** minutes to the Mercantile Quay, fictional */
  commute: number
  listedDays: number
  features: string[]
  blurb: string
  agent: { name: string; phone: string }
  opens: Array<{ day: string; time: string }>
}

const COUNTS: Record<string, number> = {
  'Old Quarry': 12,
  'Kestrel Ridge': 9,
  'Briarbank': 9,
  'Saltpan Flats': 8,
  'Myall Crossing': 11,
  'Woolshed Hill': 6,
  'Pindari': 7,
  'Granite Gully': 6,
}

const TYPE_PRICE: Record<PropertyType, number> = {
  House: 1,
  Townhouse: 0.74,
  Unit: 0.52,
  Land: 0.44,
}

function buildListings(): Listing[] {
  const rnd = mulberry32(20260926)
  const out: Listing[] = []
  let serial = 100

  for (const sub of SUBURBS) {
    const n = COUNTS[sub.name] ?? 6
    for (let i = 0; i < n; i++) {
      serial += 7 + Math.floor(rnd() * 9)
      const id = `QC-${serial}`
      const type = sub.types[Math.floor(rnd() * sub.types.length)]

      // position inside the district blob
      const ang = rnd() * Math.PI * 2
      const dist = sub.r * (0.18 + rnd() * 0.78)
      const x = Math.round(sub.cx + Math.cos(ang) * dist)
      const y = Math.round(sub.cy + Math.sin(ang) * dist * 0.82)

      const price = Math.round((sub.base * TYPE_PRICE[type] * (0.84 + rnd() * 0.44)) / 5000) * 5000

      const beds =
        type === 'Land' ? 0 : type === 'Unit' ? 1 + Math.floor(rnd() * 2)
        : type === 'Townhouse' ? 2 + Math.floor(rnd() * 2)
        : 3 + Math.floor(rnd() * 3)
      const baths = type === 'Land' ? 0 : Math.max(1, Math.min(3, beds - 1 + Math.floor(rnd() * 2)))
      const cars = type === 'Land' ? 0 : type === 'Unit' ? (rnd() < 0.6 ? 1 : 2) : 1 + Math.floor(rnd() * 3)

      const land =
        type === 'Unit' ? 0
        : type === 'Land' ? 2_000 + Math.floor(rnd() * 8_000)
        : sub.name === 'Woolshed Hill' ? 10_000 + Math.floor(rnd() * 32_000)
        : 280 + Math.floor(rnd() * 900)

      const driveFrom = Math.hypot(x - HUB.x, y - HUB.y) / 13
      const commute = Math.max(9, Math.min(COMMUTE_MAX, Math.round(driveFrom + sub.commuteBias + rnd() * 8 - 4)))

      const streetNo = 1 + Math.floor(rnd() * 178)
      const street = `${STREET_NAMES[Math.floor(rnd() * STREET_NAMES.length)]} ${STREET_SUFFIX[Math.floor(rnd() * STREET_SUFFIX.length)]}`

      const feats: string[] = []
      const pool = [...FEATURES]
      const featCount = type === 'Land' ? 2 : 4
      for (let f = 0; f < featCount && pool.length; f++) {
        feats.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0])
      }

      const openers = BLURB_OPENERS[type]
      const blurb = `${openers[Math.floor(rnd() * openers.length)]} ${BLURB_CLOSERS[Math.floor(rnd() * BLURB_CLOSERS.length)]}`

      const o1 = OPEN_SLOTS[Math.floor(rnd() * OPEN_SLOTS.length)]
      let o2 = OPEN_SLOTS[Math.floor(rnd() * OPEN_SLOTS.length)]
      if (o2 === o1) o2 = OPEN_SLOTS[(OPEN_SLOTS.indexOf(o1) + 2) % OPEN_SLOTS.length]

      out.push({
        id,
        lot: `LOT ${100 + Math.floor(rnd() * 900)} · DP ${10_000 + Math.floor(rnd() * 89_999)}`,
        address: `${streetNo} ${street}`,
        suburb: sub.name,
        x, y, price, beds, baths, cars, type, land, commute,
        listedDays: 2 + Math.floor(rnd() * 41),
        features: feats,
        blurb,
        agent: AGENTS[Math.floor(rnd() * AGENTS.length)],
        opens: [
          { day: o1[0], time: o1[1] },
          { day: o2[0], time: o2[1] },
        ],
      })
    }
  }
  return out
}

export const LISTINGS: Listing[] = buildListings()

/* ----------------------------------------------------- formatting */

export function fmtMoney(n: number): string {
  return '$' + n.toLocaleString('en-AU')
}

export function fmtLand(m2: number): string {
  if (!m2) return '—'
  if (m2 >= 10_000) return `${(m2 / 10_000).toFixed(2)} ha`
  return `${m2.toLocaleString('en-AU')} m²`
}

export function pointInPolygon(px: number, py: number, poly: Array<[number, number]>): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/* ----------------------------------------------------- terrain
   Rivers, roads, rail and contours — hand-tuned fictional geography.
   Contour rings are generated with a seeded wobble so they render
   identically everywhere. */

function contourPath(cx: number, cy: number, r: number, seed: number): string {
  const rnd = mulberry32(seed)
  const wob1 = 0.05 + rnd() * 0.07
  const wob2 = 0.04 + rnd() * 0.06
  const p1 = rnd() * Math.PI * 2
  const p2 = rnd() * Math.PI * 2
  const pts: string[] = []
  const STEPS = 26
  for (let i = 0; i <= STEPS; i++) {
    const a = (i / STEPS) * Math.PI * 2
    const rr = r * (1 + Math.sin(a * 3 + p1) * wob1 + Math.sin(a * 5 + p2) * wob2)
    const px = cx + Math.cos(a) * rr
    const py = cy + Math.sin(a) * rr * 0.86
    pts.push(`${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`)
  }
  return pts.join(' ') + ' Z'
}

export interface Hill { name: string; cx: number; cy: number; base: number; seed: number }

export const HILLS: Hill[] = [
  { name: 'Kestrel Ridge', cx: 838, cy: 196, base: 42, seed: 11 },
  { name: 'Woolshed Hill', cx: 176, cy: 208, base: 40, seed: 22 },
  { name: 'Granite Gully', cx: 1032, cy: 366, base: 38, seed: 33 },
]

export const CONTOURS: string[] = HILLS.flatMap((h) =>
  [0, 1, 2, 3, 4, 5].map((i) => contourPath(h.cx, h.cy, h.base + i * 30, h.seed + i)),
)

export const RIVER =
  'M -20 452 C 120 420, 210 566, 356 600 C 480 628, 560 700, 720 668 C 860 640, 940 540, 1060 566 C 1130 580, 1180 610, 1220 600'

export const DAM = { cx: 690, cy: 716, rx: 74, ry: 26, name: 'Pindari Dam' }

/** Two-stroke roads: casing + fill drawn in the map. */
export const ROADS: string[] = [
  // western loop: Woolshed Hill → Old Quarry → Briarbank
  'M 176 214 C 260 260, 360 300, 428 366 C 470 410, 420 500, 330 548 C 300 566, 288 574, 284 586',
  // spine: Old Quarry → Myall Crossing → Pindari → Saltpan Flats
  'M 436 380 C 500 420, 540 452, 588 486 C 660 540, 700 600, 724 640 C 800 640, 880 614, 952 590',
  // ridge road: Old Quarry → Kestrel Ridge → Granite Gully
  'M 452 350 C 560 300, 700 250, 830 200 C 900 220, 980 300, 1026 358',
  // north to the Quay
  'M 596 296 C 570 320, 520 340, 470 356',
]

export const RAIL = 'M 236 640 C 360 560, 470 520, 586 496 C 640 486, 660 420, 622 340 C 610 316, 602 306, 596 296'

export const STATION = { x: 586, y: 496, name: 'Myall Crossing Station' }
