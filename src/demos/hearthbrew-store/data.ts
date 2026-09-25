/** Hearthbrew Storefront — fake catalogue. Prices in AUD, roast days for demo only. */

export type RoastLevel = 1 | 2 | 3 | 4 | 5
export type Brew = 'espresso' | 'filter' | 'both' | 'decaf'

export interface CoffeePalette {
  bag: string
  accent: string
  label: string
}

export interface Coffee {
  id: string
  name: string
  origin: string
  altitude: string
  process: string
  roast: RoastLevel
  brew: Brew
  notes: [string, string, string]
  price250: number
  price1000: number
  roastedDaysAgo: number
  blurb: string
  palette: CoffeePalette
}

export const FREE_SHIPPING_AT = 45
export const FLAT_SHIPPING = 7.9
export const SUB_DISCOUNT = 0.15

export const GRINDS = ['Whole bean', 'Filter', 'Espresso', 'French press'] as const
export type Grind = (typeof GRINDS)[number]

export const INTERVALS = [2, 4, 6] as const
export type Interval = (typeof INTERVALS)[number]

export const coffees: Coffee[] = [
  {
    id: 'cinder-house',
    name: 'Cinder House',
    origin: 'Brazil + Ethiopia · house espresso blend',
    altitude: '1,100–2,100 masl',
    process: 'Natural + washed',
    roast: 3,
    brew: 'espresso',
    notes: ['Chocolate', 'Hazelnut', 'Orange peel'],
    price250: 18,
    price1000: 62,
    roastedDaysAgo: 3,
    blurb:
      'The café workhorse. Fat-bodied, forgiving under pressure, and sweet enough to drink without milk — though it loves milk dearly.',
    palette: { bag: '#3a2417', accent: '#c07a2a', label: '#f2e7d3' },
  },
  {
    id: 'kirra-crest',
    name: 'Kirra Crest',
    origin: 'Ethiopia · Guji zone, single origin',
    altitude: '1,950–2,200 masl',
    process: 'Washed, sun-dried',
    roast: 2,
    brew: 'filter',
    notes: ['Jasmine', 'Apricot', 'Bergamot'],
    price250: 22,
    price1000: 72,
    roastedDaysAgo: 4,
    blurb:
      'Our filter favourite when the weather warms up. Floral without perfume, juicy without noise. Serve it where people can taste.',
    palette: { bag: '#e8dcc4', accent: '#55663c', label: '#faf4e6' },
  },
  {
    id: 'saltfed',
    name: 'Saltfed',
    origin: 'Colombia · Huila, smallholder lots',
    altitude: '1,650–1,900 masl',
    process: 'Washed, 36-hour ferment',
    roast: 3,
    brew: 'both',
    notes: ['Caramel', 'Red apple', 'Panela'],
    price250: 19,
    price1000: 64,
    roastedDaysAgo: 6,
    blurb:
      'Named for the sea wind that reaches the mill. Sweet, tidy, endlessly repeatable — the coffee we hand to people who "just want a coffee".',
    palette: { bag: '#b06e28', accent: '#2a1d12', label: '#f6efe3' },
  },
  {
    id: 'marlborough-sun',
    name: 'Marlborough Sun',
    origin: 'Colombia · Sugarcane EA decaf',
    altitude: '1,700–2,000 masl',
    process: 'Washed, EA decaffeination',
    roast: 3,
    brew: 'decaf',
    notes: ['Cocoa', 'Malt', 'Dried fig'],
    price250: 19,
    price1000: 66,
    roastedDaysAgo: 5,
    blurb:
      'A decaf you’d order on purpose. Decaffeinated at origin with sugarcane ethyl acetate, so it keeps its Sunday-afternoon malt and cocoa.',
    palette: { bag: '#d9c9a3', accent: '#8a5a2b', label: '#faf4e6' },
  },
  {
    id: 'gully-line',
    name: 'Gully Line',
    origin: 'Kenya · Nyeri, AA grade',
    altitude: '1,800–2,050 masl',
    process: 'Double-washed, raised beds',
    roast: 2,
    brew: 'filter',
    notes: ['Blackcurrant', 'Tomato leaf', 'Molasses'],
    price250: 23,
    price1000: 76,
    roastedDaysAgo: 4,
    blurb:
      'Loud in the best way. That unmistakable Nyeri line of blackcurrant running straight through the cup, sweetened at the shoulder.',
    palette: { bag: '#5f7a52', accent: '#f2e7d3', label: '#2a1d12' },
  },
  {
    id: 'low-paddock',
    name: 'Low Paddock',
    origin: 'Brazil · Cerrado Mineiro',
    altitude: '950–1,250 masl',
    process: 'Natural, patio-dried',
    roast: 4,
    brew: 'espresso',
    notes: ['Peanut brittle', 'Banana', 'Brown sugar'],
    price250: 17,
    price1000: 58,
    roastedDaysAgo: 2,
    blurb:
      'The comfort lot. Low-grown, easy-roasted, impossible to ruin in a moka pot. The bag we send to your dad.',
    palette: { bag: '#6e4a26', accent: '#e8b04b', label: '#fbf3e2' },
  },
  {
    id: 'fern-window',
    name: 'Fern Window',
    origin: 'Colombia + Papua New Guinea · blend',
    altitude: '1,500–1,980 masl',
    process: 'Washed + honey',
    roast: 3,
    brew: 'both',
    notes: ['Tangerine', 'Vanilla', 'Shortbread'],
    price250: 20,
    price1000: 68,
    roastedDaysAgo: 7,
    blurb:
      'Our café’s filter-day blend. Bright enough to notice, soft enough not to talk about. Names the window the roastery opens in summer.',
    palette: { bag: '#2e4634', accent: '#d8a04e', label: '#f2e7d3' },
  },
  {
    id: 'night-ferry',
    name: 'Night Ferry',
    origin: 'Brazil + Sumatra · dark espresso blend',
    altitude: '900–1,500 masl',
    process: 'Natural + wet-hulled',
    roast: 5,
    brew: 'espresso',
    notes: ['Dark chocolate', 'Smoked almond', 'Molasses'],
    price250: 18,
    price1000: 60,
    roastedDaysAgo: 3,
    blurb:
      'Dark done honestly — built for the old-school flat white, bitter-sweet right through without ever tasting of ash.',
    palette: { bag: '#241a14', accent: '#b06e28', label: '#efe4d1' },
  },
  {
    id: 'tidewater',
    name: 'Tidewater',
    origin: 'Papua New Guinea · Waghi Valley',
    altitude: '1,450–1,800 masl',
    process: 'Washed, river transport',
    roast: 2,
    brew: 'filter',
    notes: ['Tropical fruit', 'Cocoa nibs', 'Lime'],
    price250: 21,
    price1000: 70,
    roastedDaysAgo: 5,
    blurb:
      'Travelled down the river to reach you. Fruit-forward with a cocoa finish that keeps it grounded. Brew it a touch coarse.',
    palette: { bag: '#3e5c52', accent: '#e8b04b', label: '#f6efe3' },
  },
]

export const aud = (n: number) => `$${n.toFixed(2)}`

export const freshness = (days: number) =>
  days === 0 ? 'Roasted today' : days === 1 ? 'Roasted yesterday' : `Roasted ${days} days ago`

export const priceFor = (c: Coffee, grams: 250 | 1000) => (grams === 250 ? c.price250 : c.price1000)
