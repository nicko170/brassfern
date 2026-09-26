/**
 * Wattle & Daub — data & availability model.
 * Everything fictional: 48 seats, a chef's counter of four, a courtyard,
 * closed Mondays, Sunday long lunch. Availability is deterministic per
 * (date, zone, slot, party) so a page refresh tells the same story.
 */

export interface Zone {
  id: 'room' | 'counter' | 'courtyard'
  name: string
  note: string
  maxParty: number
}

export const ZONES: Zone[] = [
  {
    id: 'room',
    name: 'The dining room',
    note: '48 seats around the open hearth — banquettes, bentwood, the long brass bar.',
    maxParty: 8,
  },
  {
    id: 'counter',
    name: "Chef's counter",
    note: 'Four stools at the pass. Watch the coals, talk to the cooks, eat early.',
    maxParty: 4,
  },
  {
    id: 'courtyard',
    name: 'The courtyard',
    note: 'Fig tree, string lights, blankets after nine. Weather permitting.',
    maxParty: 6,
  },
]

export type Sitting = 'lunch' | 'early' | 'dinner' | 'late'

export interface Slot {
  id: string
  minutes: number
  label: string
  sitting: Sitting
  /** keyed by zone id — true means already booked */
  gone: Record<Zone['id'], boolean>
}

export interface Day {
  key: string
  date: Date
  weekday: string
  dayNum: number
  month: string
  isSaturday: boolean
  closed: boolean
  /** 'dinner' Tue–Sat, 'lunch' Sundays */
  service: 'dinner' | 'lunch' | null
  slots: Slot[]
}

const DINNER_MINUTES = [
  { m: 17 * 60 + 30, sitting: 'early' as Sitting },
  { m: 17 * 60 + 45, sitting: 'early' as Sitting },
  { m: 18 * 60, sitting: 'early' as Sitting },
  { m: 18 * 60 + 15, sitting: 'early' as Sitting },
  { m: 19 * 60, sitting: 'dinner' as Sitting },
  { m: 19 * 60 + 15, sitting: 'dinner' as Sitting },
  { m: 19 * 60 + 30, sitting: 'dinner' as Sitting },
  { m: 19 * 60 + 45, sitting: 'dinner' as Sitting },
  { m: 20 * 60 + 45, sitting: 'late' as Sitting },
  { m: 21 * 60, sitting: 'late' as Sitting },
]

const LUNCH_MINUTES = [
  { m: 12 * 60, sitting: 'lunch' as Sitting },
  { m: 12 * 60 + 30, sitting: 'lunch' as Sitting },
  { m: 13 * 60, sitting: 'lunch' as Sitting },
  { m: 13 * 60 + 30, sitting: 'lunch' as Sitting },
  { m: 14 * 60, sitting: 'lunch' as Sitting },
  { m: 14 * 60 + 30, sitting: 'lunch' as Sitting },
]

export const SITTING_META: Record<Sitting, { name: string; note: string }> = {
  lunch: { name: 'Sunday long lunch', note: 'Roasts, spritzes, no hurry. Kitchen rests at 3.' },
  early: { name: 'First sitting', note: 'In by 5:30, out by 7:30 — pre-theatre friendly.' },
  dinner: { name: 'The middle of it', note: 'The room at full hum. Our favourite shift.' },
  late: { name: 'Late tables', note: 'The long finish — nightcaps and the last of the fire.' },
}

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function fmtTime(totalMinutes: number) {
  const h24 = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const ampm = h24 < 12 ? 'am' : 'pm'
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

export function fmtDateLong(d: Date) {
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

// deterministic rng --------------------------------------------------------

function hashString(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

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

/** Demand profile by day of week — Friday and Saturday are the hard tables. */
function demand(dayOfWeek: number) {
  switch (dayOfWeek) {
    case 6:
      return 0.56 // Saturday
    case 5:
      return 0.48 // Friday
    case 0:
      return 0.34 // Sunday lunch
    case 4:
      return 0.34 // Thursday
    default:
      return 0.26 // Tue–Wed locals' nights
  }
}

export function buildAvailability(daysAhead = 14): Day[] {
  const now = new Date()
  const days: Day[] = []
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const dow = date.getDay()
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const closed = dow === 1 // dark Mondays
    const service: Day['service'] = closed ? null : dow === 0 ? 'lunch' : 'dinner'
    const base = demand(dow)
    const minutes = service === 'lunch' ? LUNCH_MINUTES : DINNER_MINUTES
    const slots: Slot[] = minutes.map(({ m, sitting }, sIdx) => {
      const gone: Slot['gone'] = { room: true, counter: true, courtyard: true }
      ZONES.forEach((z) => {
        const rand = mulberry(hashString(`${key}:${z.id}:${m}:${sIdx}`))
        // the counter only seats four, so it books out fastest
        const lift = z.id === 'counter' ? 0.16 : z.id === 'courtyard' ? -0.08 : 0
        gone[z.id] = rand() < base + lift
      })
      return { id: `${key}-${m}`, minutes: m, label: fmtTime(m), sitting, gone }
    })
    days.push({
      key,
      date,
      weekday: WEEKDAYS[dow],
      dayNum: date.getDate(),
      month: MONTHS[date.getMonth()],
      isSaturday: dow === 6,
      closed,
      service,
      slots,
    })
  }
  return days
}

export function dayHasRoom(day: Day, zone: Zone['id']) {
  return !day.closed && day.slots.some((s) => !s.gone[zone])
}

// menu ---------------------------------------------------------------------

export interface Dish {
  name: string
  desc: string
  price: number
  tags: string[]
}

export interface Course {
  name: string
  tagline: string
  dishes: Dish[]
}

export const TAG_LABELS: Record<string, string> = {
  v: 'vegetarian',
  vg: 'vegan',
  gf: 'gluten-free',
  df: 'dairy-free',
  n: 'nuts',
}

export const MENU: Course[] = [
  {
    name: 'To start',
    tagline: 'Small things while the coals settle',
    dishes: [
      {
        name: 'Sourdough & cultured butter',
        desc: 'House loaf off the wood oven, wattleseed butter, smoked salt.',
        price: 9,
        tags: ['v'],
      },
      {
        name: 'Oysters, finger lime & pepperberry',
        desc: 'Shucked to order, mignonette with a native bite.',
        price: 6,
        tags: ['gf', 'df'],
      },
      {
        name: 'Smoked ham hock croquettes',
        desc: 'Three of them, burnt-apple sauce, crackling crumb.',
        price: 16,
        tags: [],
      },
      {
        name: 'Charred broccolini, macadamia cream',
        desc: 'Straight off the grill, lemon myrtle oil, toasted nuts.',
        price: 15,
        tags: ['vg', 'n'],
      },
    ],
  },
  {
    name: 'From the fire',
    tagline: 'Where the kitchen lives, mostly',
    dishes: [
      {
        name: 'Whole flounder, brown butter & saltbush',
        desc: 'Cooked on the bone over ironbark, for one greedy person or two.',
        price: 42,
        tags: ['gf'],
      },
      {
        name: 'Dry-aged duck, quandong & witlof',
        desc: "Mara's signature. The skin alone is worth the booking.",
        price: 46,
        tags: [],
      },
      {
        name: 'Lamb shoulder for the table',
        desc: 'Native thyme, smoked garlic, flatbreads. Serves two, generously.',
        price: 78,
        tags: [],
      },
      {
        name: 'Celeriac pithivier',
        desc: 'Layers of slow celeriac in pastry, roasted in the hearth coals.',
        price: 34,
        tags: ['v'],
      },
    ],
  },
  {
    name: 'On the side',
    tagline: 'The supporting cast, unpaid but essential',
    dishes: [
      {
        name: 'Kipfler potatoes, chicken salt',
        desc: 'Crushed, twice-cooked, dangerously seasoned.',
        price: 12,
        tags: ['v', 'gf'],
      },
      {
        name: 'Buttered greens & almond',
        desc: 'Whatever the market had that morning, buttered within an inch.',
        price: 13,
        tags: ['v', 'n'],
      },
    ],
  },
  {
    name: 'Sweet',
    tagline: 'Because leaving now would be a mistake',
    dishes: [
      {
        name: 'Wattleseed custard, oat crumb',
        desc: 'Set like silk, coffee-adjacent, entirely our own.',
        price: 16,
        tags: ['v'],
      },
      {
        name: 'Dark chocolate & lilly pilly sorbet',
        desc: 'Seventy per cent, sharp native berries, olive oil.',
        price: 17,
        tags: ['vg', 'gf'],
      },
      {
        name: 'Two cheeses, quince & lavosh',
        desc: "From the trolley, chosen by whoever's sharpest tonight.",
        price: 22,
        tags: ['v'],
      },
    ],
  },
]

export const WINE: { name: string; region: string; notes: string; glass: number; bottle: number }[] = [
  { name: 'Riesling', region: 'Clare Valley, 2024', notes: 'Lime zest, bath salts, a long dry line.', glass: 15, bottle: 74 },
  { name: 'Pét-nat', region: 'Orange, 2024', notes: 'Cloudy, joyful, chill it further than you think.', glass: 16, bottle: 78 },
  { name: 'Pinot noir', region: 'Adelaide Hills, 2023', notes: 'Cherry and woodsmoke — a match for the duck.', glass: 18, bottle: 88 },
  { name: 'Shiraz viognier', region: 'Canberra District, 2022', notes: 'Apricot lift over dark fruit; built for lamb.', glass: 19, bottle: 92 },
  { name: 'Native soda', region: 'Made here, daily', notes: 'Lemon aspen & rivermint, or quandong & lime.', glass: 9, bottle: 0 },
]

export const OCCASIONS = ['No occasion — just hungry', 'Birthday', 'Anniversary', 'Date night', 'Business', 'Celebration']

/** Card hold applies to parties of 5+ and all Saturday bookings. */
export function cardHoldApplies(party: number, isSaturday: boolean) {
  return party >= 5 || isSaturday
}

// storage ------------------------------------------------------------------

export interface Reservation {
  ref: string
  name: string
  phone: string
  email: string
  party: number
  dateKey: string
  dateLabel: string
  isoStart: string
  timeLabel: string
  zone: Zone['id']
  zoneName: string
  occasion: string
  notes: string
  cardHold: boolean
}

export const STORAGE_KEY = 'wd-reservations'

export function loadReservations(): Reservation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Reservation[]) : []
  } catch {
    return []
  }
}

export function saveReservations(list: Reservation[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* private mode — bookings live in memory only */
  }
}
