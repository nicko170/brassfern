/**
 * Fernleigh Cellar — realistic fake data for a fictional Adelaide Hills winery.
 * Cool-climate wines, club tiers, drink-by windows, a seeded member cellar.
 */

export type WineKind = 'white' | 'red' | 'sparkling'

export interface Wine {
  id: string
  name: string
  kind: WineKind
  varietal: string
  region: string
  vintages: number[]
  /** price per bottle in AUD */
  price: number
  tasting: string
  story: string
  /** drink window [fromYear, toYear] */
  drinkFrom: number
  drinkTo: number
  /** capsule (wax) colour for the bottle art */
  capsule: string
  glass: string
}

export const wines: Wine[] = [
  {
    id: 'fog-line-chardonnay',
    name: 'Fog Line',
    kind: 'white',
    varietal: 'Chardonnay',
    region: 'Lenswood, Adelaide Hills',
    vintages: [2023, 2022],
    price: 38,
    tasting: 'White peach, sea spray, a line of lemon pith. Barrel-fermented, barely handled.',
    story:
      'Picked before the fog lifts off the Lenswood block, whole-bunch pressed to old French oak. The kind of chardonnay that converts sauvignon blanc drinkers.',
    drinkFrom: 2025,
    drinkTo: 2030,
    capsule: '#7a8455',
    glass: '#c9d0b4',
  },
  {
    id: 'stoney-rise-pinot',
    name: 'Stoney Rise',
    kind: 'red',
    varietal: 'Pinot Noir',
    region: 'Piccadilly Valley, Adelaide Hills',
    vintages: [2022, 2021],
    price: 46,
    tasting: 'Sour cherry, crushed rose petal, turned earth. Silky, cool, quietly serious.',
    story:
      'The steepest, stoniest rise on the property — so rocky the tractor refuses it. Hand-picked, 20% whole bunch, bottled unfined.',
    drinkFrom: 2024,
    drinkTo: 2032,
    capsule: '#8e2f2c',
    glass: '#232a22',
  },
  {
    id: 'hill-block-nebbiolo',
    name: 'Hill Block',
    kind: 'red',
    varietal: 'Nebbiolo',
    region: 'Top block, Fernleigh Estate',
    vintages: [2021, 2019],
    price: 58,
    tasting: 'Tar and roses, as it should be. Dried herb, orange peel, tannins like wire.',
    story:
      'The wine the winemaker refuses to enter into shows. Eight rows of nebbiolo on the highest point of the hill; made in the years the season allows.',
    drinkFrom: 2026,
    drinkTo: 2038,
    capsule: '#3c5a3a',
    glass: '#232a22',
  },
  {
    id: 'first-pick-sauvignon',
    name: 'First Pick',
    kind: 'white',
    varietal: 'Sauvignon Blanc',
    region: 'Kuitpo, Adelaide Hills',
    vintages: [2024],
    price: 30,
    tasting: 'Gooseberry, snow pea, sea salt. No oak, no malo, no apologies.',
    story:
      'The first fruit off the vines each vintage — the picking-bin starter wine. Fermented cold, bottled young, drunk younger.',
    drinkFrom: 2024,
    drinkTo: 2027,
    capsule: '#a9b786',
    glass: '#c9d0b4',
  },
  {
    id: 'long-row-reserve',
    name: 'Long Row Reserve',
    kind: 'red',
    varietal: 'Petit Verdot',
    region: 'Fernleigh Estate, single row',
    vintages: [2020, 2018],
    price: 72,
    tasting: 'Violet, blackberry compote, cocoa nibs. Dense, dark, built for the long haul.',
    story:
      'One long row of petit verdot, planted as a blending vine and promoted to the main act in 2016. Two hundred dozen a year, when the year deserves it.',
    drinkFrom: 2026,
    drinkTo: 2040,
    capsule: '#8e2f2c',
    glass: '#1d231c',
  },
  {
    id: 'morning-fog-petillant',
    name: 'Morning Fog',
    kind: 'sparkling',
    varietal: 'Pétillant Naturel',
    region: 'Adelaide Hills, wild ferment',
    vintages: [2023],
    price: 42,
    tasting: 'Cloudy, lively, lightly petulant. Green apple skin and chamomile.',
    story:
      'Bottled mid-ferment on the morning the fog came down the valley and never left. Disgorged by hand, capped under wax.',
    drinkFrom: 2024,
    drinkTo: 2028,
    capsule: '#d8b34a',
    glass: '#b9c4a4',
  },
]

export const wineById = new Map(wines.map((w) => [w.id, w]))

/* ---------------- club tiers ---------------- */

export interface Tier {
  id: string
  name: string
  blurb: string
  min: number
  max: number
  defaultBottles: number
  discount: number
  shippingFree: boolean
  perks: string[]
}

export const tiers: Tier[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    blurb: 'A toe in the fog. New releases first, nothing you could buy at the bottlo.',
    min: 3,
    max: 4,
    defaultBottles: 3,
    discount: 0.1,
    shippingFree: false,
    perks: ['10% off all cellar-door prices', 'First pour of new releases', 'Members-only cuvées twice a year'],
  },
  {
    id: 'cellar',
    name: 'Cellar',
    blurb: 'The house pour, plus enough serious bottles to start an argument about windows.',
    min: 6,
    max: 8,
    defaultBottles: 6,
    discount: 0.15,
    shippingFree: true,
    perks: ['15% off everything, always', 'Free freight Australia-wide', 'Museum vintages on request', 'Cellar-door tastings on the house'],
  },
  {
    id: 'collector',
    name: 'Collector',
    blurb: 'Allocation-level access. Long Row by the six, museum releases, first refusal.',
    min: 10,
    max: 12,
    defaultBottles: 12,
    discount: 0.2,
    shippingFree: true,
    perks: [
      '20% off everything, always',
      'Free freight + insurance',
      'Guaranteed Long Row allocation',
      'Vertical tastings with the winemaker',
      'First refusal on museum stock',
    ],
  },
]

export const tierById = new Map(tiers.map((t) => [t.id, t]))

/** Representative per-bottle price used for club shipment estimates. */
export const CLUB_REFERENCE_PRICE = 44

/* ---------------- seeded member cellar ---------------- */

export interface CellarBottle {
  wineId: string
  vintage: number
  qty: number
}

export const seedCellar: CellarBottle[] = [
  { wineId: 'long-row-reserve', vintage: 2018, qty: 3 },
  { wineId: 'hill-block-nebbiolo', vintage: 2019, qty: 4 },
  { wineId: 'stoney-rise-pinot', vintage: 2021, qty: 5 },
  { wineId: 'stoney-rise-pinot', vintage: 2022, qty: 2 },
  { wineId: 'fog-line-chardonnay', vintage: 2022, qty: 4 },
  { wineId: 'fog-line-chardonnay', vintage: 2023, qty: 2 },
  { wineId: 'morning-fog-petillant', vintage: 2023, qty: 3 },
  { wineId: 'first-pick-sauvignon', vintage: 2024, qty: 2 },
]

/* ---------------- helpers ---------------- */

export const aud = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const addWeeks = (fromISO: string, weeks: number) =>
  new Date(new Date(fromISO).getTime() + weeks * 7 * 86400000).toISOString()

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

export const fmtShort = (iso: string) =>
  new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })

export const inWeeks = (weeks: number) => addWeeks(new Date().toISOString(), weeks)

export type DrinkStatus = 'hold' | 'opening' | 'drink' | 'drink-soon' | 'past'

export function drinkStatus(wine: Wine): { status: DrinkStatus; label: string; pct: number } {
  const now = new Date().getFullYear()
  const span = Math.max(1, wine.drinkTo - wine.drinkFrom)
  const t = Math.min(1, Math.max(0, (now - wine.drinkFrom) / span))
  if (now < wine.drinkFrom - 1) return { status: 'hold', label: `Hold until ${wine.drinkFrom}`, pct: t }
  if (now < wine.drinkFrom) return { status: 'opening', label: `Opens ${wine.drinkFrom}`, pct: t }
  if (now <= wine.drinkTo - 2) return { status: 'drink', label: `Drinking · until ${wine.drinkTo}`, pct: t }
  if (now <= wine.drinkTo) return { status: 'drink-soon', label: `Drink by ${wine.drinkTo}`, pct: t }
  return { status: 'past', label: 'Past its window', pct: 1 }
}

export const FREE_FREIGHT_AT = 150
export const FLAT_FREIGHT = 12
