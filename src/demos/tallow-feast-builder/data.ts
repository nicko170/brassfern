/** Tallow & Co. Feast Box Builder — fictional pantry, honest arithmetic. All prices AUD. */

export type Category = 'cheese' | 'smallgoods' | 'preserves' | 'crackers' | 'sweets' | 'pour'
export type ThemeId = 'picnic' | 'fireside' | 'celebration'
export type BoxId = 'spread' | 'feast' | 'bounty'

export type IconKind =
  | 'wedge'
  | 'wheel'
  | 'log'
  | 'slices'
  | 'terrine'
  | 'jar'
  | 'bar'
  | 'stack'
  | 'comb'
  | 'twist'
  | 'bottle'
  | 'swingtop'

export interface PantryItem {
  id: string
  name: string
  maker: string
  price: number
  category: Category
  icon: IconKind
  /** one line in the counter's voice */
  note: string
  /** weight/volume badge, e.g. "150 g" */
  weight: string
  /** max units of this item in one box */
  max: number
}

export const aud = (n: number) => `$${n.toFixed(2)}`

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'cheese', label: 'Cheeses' },
  { id: 'smallgoods', label: 'Smallgoods' },
  { id: 'preserves', label: 'Preserves' },
  { id: 'crackers', label: 'Crackers' },
  { id: 'sweets', label: 'Sweets' },
  { id: 'pour', label: 'Something to pour' },
]

export const BOXES: { id: BoxId; name: string; slots: number; fee: number; feeds: string; blurb: string }[] = [
  { id: 'spread', name: 'The Spread', slots: 6, fee: 8, feeds: 'Feeds 2–3, politely', blurb: 'A board for the table and a little left for Monday.' },
  { id: 'feast', name: 'The Feast', slots: 9, fee: 12, feeds: 'Feeds 4–6, generously', blurb: 'The Saturday-night unit of measure around here.' },
  { id: 'bounty', name: 'The Bounty', slots: 12, fee: 16, feeds: 'Feeds a crowd — the good one', blurb: 'Weddings, wakes and long-lunch diplomacy.' },
]

export const FREE_DELIVERY_AT = 120
export const FLAT_DELIVERY = 9
export const CUTOFF_HOUR = 14 // order by 2:00 pm for the next day's van
export const CLOSED_DAYS = [0, 1] // Sunday, Monday — the shop rests

export const PANTRY: PantryItem[] = [
  // ——— cheeses ———
  {
    id: 'squatters-select',
    name: "Squatter's Select",
    maker: 'Ferguson Vale dairy, SA',
    price: 16.5,
    category: 'cheese',
    icon: 'wedge',
    note: 'Clothbound eighteen months. Sharp as Gus\'s wit, friendlier.',
    weight: '200 g',
    max: 2,
  },
  {
    id: 'hillfold-brie',
    name: 'Hillfold Brie',
    maker: 'Hills Face zone, SA',
    price: 13,
    category: 'cheese',
    icon: 'wheel',
    note: 'Washed weekly, eaten quickly. Serve it warm from the sun.',
    weight: '180 g',
    max: 2,
  },
  {
    id: 'norwood-blue',
    name: 'Norwood Blue',
    maker: 'Made two suburbs over',
    price: 15,
    category: 'cheese',
    icon: 'wheel',
    note: "Frankie's pick. Salty, veined, completely unrepentant.",
    weight: '150 g',
    max: 2,
  },
  {
    id: 'ember-gouda',
    name: 'Ember Gouda',
    maker: 'Smoked over mallee root',
    price: 12.5,
    category: 'cheese',
    icon: 'wedge',
    note: 'Tastes like a bonfire remembered politely. Kids love it.',
    weight: '175 g',
    max: 2,
  },
  // ——— smallgoods ———
  {
    id: 'finocchiona',
    name: 'Finocchiona',
    maker: 'Hung in our own cold room',
    price: 14,
    category: 'smallgoods',
    icon: 'log',
    note: 'Fennel-seed salami. The tube that always goes first.',
    weight: '220 g',
    max: 3,
  },
  {
    id: 'high-country-bresaola',
    name: 'High Country Bresaola',
    maker: 'Air-dried, eye of round',
    price: 17,
    category: 'smallgoods',
    icon: 'slices',
    note: 'Silked thin, lemon-scented. Barely makes it to the board.',
    weight: '120 g',
    max: 2,
  },
  {
    id: 'red-gate-chorizo',
    name: 'Red Gate Chorizo',
    maker: 'Paprika-forward, slow cured',
    price: 13.5,
    category: 'smallgoods',
    icon: 'log',
    note: 'The reason the toothpicks run out.',
    weight: '200 g',
    max: 2,
  },
  {
    id: 'pate-de-campagne',
    name: 'Pâté de Campagne',
    maker: 'Baked Tuesdays and Fridays',
    price: 12,
    category: 'smallgoods',
    icon: 'terrine',
    note: 'Coarse, peppery, honest. Cornichons already in the tin.',
    weight: '180 g',
    max: 2,
  },
  // ——— preserves ———
  {
    id: 'memory-quince',
    name: '"Memory" Quince Paste',
    maker: "Frankie's grandmother's recipe",
    price: 9.5,
    category: 'preserves',
    icon: 'bar',
    note: 'Set overnight in the cool of the shop. Cut it thick.',
    weight: '200 g',
    max: 3,
  },
  {
    id: 'piccalilli-no4',
    name: 'Piccalilli No. 4',
    maker: 'Fourth and final formula',
    price: 8.5,
    category: 'preserves',
    icon: 'jar',
    note: 'Numbers 1–3 were not spoken of again.',
    weight: '250 g',
    max: 2,
  },
  {
    id: 'fig-vincotto',
    name: 'Fig & Vincotto Jam',
    maker: 'Kensington fig trees, bartered',
    price: 11,
    category: 'preserves',
    icon: 'jar',
    note: 'For the blue cheese, though the cheddar will inquire.',
    weight: '220 g',
    max: 2,
  },
  {
    id: 'chardonnay-onions',
    name: 'Chardonnay Pickled Onions',
    maker: 'Sharp enough to correct you',
    price: 8,
    category: 'preserves',
    icon: 'jar',
    note: 'The jar that empties before the cheese board does.',
    weight: '300 g',
    max: 2,
  },
  // ——— crackers ———
  {
    id: 'sea-salt-lavosh',
    name: 'Sea Salt Lavosh',
    maker: 'Rolled thin, snapped by hand',
    price: 7,
    category: 'crackers',
    icon: 'stack',
    note: 'Structurally sound under a full load of brie.',
    weight: '150 g',
    max: 3,
  },
  {
    id: 'rye-fennel-flatbread',
    name: 'Rye & Fennel Flatbreads',
    maker: 'Dark, seeded, serious',
    price: 7.5,
    category: 'crackers',
    icon: 'stack',
    note: 'Built for pâté. Won\'t apologise to anyone.',
    weight: '140 g',
    max: 3,
  },
  {
    id: 'friday-crostini',
    name: 'Friday Crostini',
    maker: 'Olive oil brushed, twice baked',
    price: 6,
    category: 'crackers',
    icon: 'stack',
    note: 'Named for the day they never survive to see.',
    weight: '120 g',
    max: 3,
  },
  // ——— sweets ———
  {
    id: 'apiary-honeycomb',
    name: 'Apiary Honeycomb',
    maker: 'Backyard hives, Payneham Road',
    price: 14,
    category: 'sweets',
    icon: 'comb',
    note: 'A whole comb in the jar. Spoon it over the blue.',
    weight: '280 g',
    max: 2,
  },
  {
    id: 'quince-walnut-roll',
    name: 'Quince & Walnut Roll',
    maker: 'Slice and surrender',
    price: 10,
    category: 'sweets',
    icon: 'bar',
    note: 'Dense enough to need a sharp knife and a soft chair.',
    weight: '180 g',
    max: 2,
  },
  {
    id: 'candied-orange-peel',
    name: 'Candied Orange Peel',
    maker: 'Dark-chocolate tipped',
    price: 9,
    category: 'sweets',
    icon: 'twist',
    note: 'Wrapped in a twist of paper, like it\'s 1987 again.',
    weight: '130 g',
    max: 2,
  },
  // ——— pour ———
  {
    id: 'hills-petnat',
    name: 'Adelaide Hills Pét-Nat',
    maker: 'Crown-sealed, barely tamed',
    price: 24,
    category: 'pour',
    icon: 'bottle',
    note: 'Cloudy, cool, dangerous at picnics. Chill it properly.',
    weight: '750 mL',
    max: 2,
  },
  {
    id: 'quince-cordial',
    name: 'Sparkling Quince Cordial',
    maker: 'For the designated driver of flavour',
    price: 12,
    category: 'pour',
    icon: 'swingtop',
    note: 'The non-drinker\'s revenge: better than half the wines.',
    weight: '500 mL',
    max: 3,
  },
  {
    id: 'cellar-vermouth',
    name: 'Cellar Door Vermouth',
    maker: 'Bitter orange, bay, patience',
    price: 22,
    category: 'pour',
    icon: 'bottle',
    note: 'Over ice while the board is built. Builder\'s rights.',
    weight: '500 mL',
    max: 2,
  },
]

export const itemById = new Map(PANTRY.map((p) => [p.id, p]))

/** Curator's choice: Frankie's three weekend briefs, in her packing order. */
export const THEMES: { id: ThemeId; name: string; brief: string; items: string[] }[] = [
  {
    id: 'picnic',
    name: 'The Picnic',
    brief: 'Grass, sun, nothing that needs a knife mission.',
    items: [
      'hillfold-brie',
      'finocchiona',
      'sea-salt-lavosh',
      'memory-quince',
      'apiary-honeycomb',
      'quince-cordial',
      'friday-crostini',
      'fig-vincotto',
      'pate-de-campagne',
      'candied-orange-peel',
      'quince-cordial',
      'sea-salt-lavosh',
    ],
  },
  {
    id: 'fireside',
    name: 'The Fireside',
    brief: 'Socks on, mallee coals, the good blanket.',
    items: [
      'squatters-select',
      'ember-gouda',
      'red-gate-chorizo',
      'norwood-blue',
      'rye-fennel-flatbread',
      'piccalilli-no4',
      'quince-walnut-roll',
      'cellar-vermouth',
      'high-country-bresaola',
      'chardonnay-onions',
      'rye-fennel-flatbread',
      'ember-gouda',
    ],
  },
  {
    id: 'celebration',
    name: 'The Celebration',
    brief: 'Someone got the job, the ring, or the all-clear.',
    items: [
      'hills-petnat',
      'high-country-bresaola',
      'hillfold-brie',
      'finocchiona',
      'apiary-honeycomb',
      'fig-vincotto',
      'candied-orange-peel',
      'squatters-select',
      'sea-salt-lavosh',
      'pate-de-campagne',
      'hills-petnat',
      'memory-quince',
    ],
  },
]

export interface DeliveryDay {
  iso: string
  date: Date
  closed: boolean
  label: string
  /** relative stamp, e.g. "Tomorrow", "Fri 2 Oct" */
  stamp: string
}

const DAY = 86400000

/**
 * Honest delivery calendar: `span` days starting from the earliest possible
 * van run (today if before the 2pm cutoff, else tomorrow), marking the days
 * the shop rests.
 */
export function deliveryDays(span = 14, now = new Date()): { days: DeliveryDay[]; beforeCutoff: boolean } {
  const beforeCutoff = now.getHours() < CUTOFF_HOUR
  const start = new Date(now)
  if (!beforeCutoff) start.setTime(start.getTime() + DAY)
  start.setHours(0, 0, 0, 0)

  const tomorrow = new Date(now)
  tomorrow.setTime(tomorrow.getTime() + DAY)

  const days: DeliveryDay[] = []
  for (let i = 0; i < span; i++) {
    const d = new Date(start.getTime() + i * DAY)
    const closed = CLOSED_DAYS.includes(d.getDay())
    const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()
    const stamp = sameDay(d, now)
      ? 'Today'
      : sameDay(d, tomorrow)
        ? 'Tomorrow'
        : d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
    days.push({
      iso: d.toISOString(),
      date: d,
      closed,
      label: d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }),
      stamp,
    })
  }
  return { days, beforeCutoff }
}

export function longDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })
}
