/**
 * Brightline Solar — instant quote engine.
 * Pure data + quote maths. All figures are mocked-but-plausible AU energy
 * numbers, labelled illustrative in the UI. Brightline Solar is fictional.
 */

export interface AddressEntry {
  id: string
  line: string
  suburb: string
  state: string
  postcode: string
  /** STC-style zone 1–4 (1 = sunniest) */
  zone: 1 | 2 | 3 | 4
  /** average peak sun hours per day */
  sunHours: number
}

export const ADDRESSES: AddressEntry[] = [
  { id: 'cairns', line: '18 Pandanus Parade', suburb: 'Cairns', state: 'QLD', postcode: '4870', zone: 1, sunHours: 5.4 },
  { id: 'broome', line: '14 Paperbark Way', suburb: 'Broome', state: 'WA', postcode: '6725', zone: 1, sunHours: 5.6 },
  { id: 'alice', line: '58 Sandalwood Court', suburb: 'Alice Springs', state: 'NT', postcode: '0870', zone: 1, sunHours: 5.8 },
  { id: 'paddington', line: '7 Heights Terrace', suburb: 'Paddington', state: 'QLD', postcode: '4064', zone: 2, sunHours: 5.1 },
  { id: 'sth-brisbane', line: '121 Ferry Road', suburb: 'South Brisbane', state: 'QLD', postcode: '4101', zone: 2, sunHours: 5.1 },
  { id: 'fremantle', line: '77 Quartz Street', suburb: 'Fremantle', state: 'WA', postcode: '6160', zone: 2, sunHours: 5.2 },
  { id: 'byron', line: '12 Shoalhaven Court', suburb: 'Byron Bay', state: 'NSW', postcode: '2481', zone: 2, sunHours: 4.9 },
  { id: 'grafton', line: '42 Jacaranda Street', suburb: 'Grafton', state: 'NSW', postcode: '2460', zone: 2, sunHours: 5.0 },
  { id: 'bondi', line: '33 Banksia Avenue', suburb: 'Bondi', state: 'NSW', postcode: '2026', zone: 3, sunHours: 4.7 },
  { id: 'katoomba', line: '9 Currawong Close', suburb: 'Katoomba', state: 'NSW', postcode: '2780', zone: 3, sunHours: 4.4 },
  { id: 'dubbo', line: '88 Ironbark Road', suburb: 'Dubbo', state: 'NSW', postcode: '2830', zone: 3, sunHours: 5.0 },
  { id: 'barton', line: '5 Correa Lane', suburb: 'Barton', state: 'ACT', postcode: '2600', zone: 3, sunHours: 4.6 },
  { id: 'glenelg', line: '29 Fuchsia Grove', suburb: 'Glenelg', state: 'SA', postcode: '5045', zone: 3, sunHours: 4.9 },
  { id: 'fitzroy', line: '3 Tecoma Street', suburb: 'Fitzroy', state: 'VIC', postcode: '3065', zone: 4, sunHours: 4.1 },
  { id: 'ballarat', line: '64 Wattlebird Drive', suburb: 'Ballarat', state: 'VIC', postcode: '3350', zone: 4, sunHours: 4.0 },
  { id: 'hobart', line: '40 Kingfisher Crescent', suburb: 'Hobart', state: 'TAS', postcode: '7000', zone: 4, sunHours: 4.0 },
]

export interface Orientation {
  id: string
  label: string
  /** compass degrees, N = 0 */
  deg: number
  factor: number
  quip: string
}

export const ORIENTATIONS: Orientation[] = [
  { id: 'N', label: 'North', deg: 0, factor: 1, quip: 'the gold standard. Panels face the arc of the sun all day.' },
  { id: 'NE', label: 'North-east', deg: 45, factor: 0.96, quip: 'nearly perfect. Great if your mornings are busy.' },
  { id: 'E', label: 'East', deg: 90, factor: 0.88, quip: 'a morning person. Lovely for kettle-and-toast households.' },
  { id: 'SE', label: 'South-east', deg: 135, factor: 0.8, quip: 'workable. We would probably split the array.' },
  { id: 'S', label: 'South', deg: 180, factor: 0.68, quip: 'the tough one. We would tilt hard or split with a west array.' },
  { id: 'SW', label: 'South-west', deg: 225, factor: 0.8, quip: 'workable. Afternoon sun still earns its keep.' },
  { id: 'W', label: 'West', deg: 270, factor: 0.88, quip: 'the evening person. Pairs beautifully with a battery.' },
  { id: 'NW', label: 'North-west', deg: 315, factor: 0.96, quip: 'nearly perfect. Long, golden afternoons.' },
]

export interface Pitch {
  id: string
  label: string
  desc: string
  factor: number
}

export const PITCHES: Pitch[] = [
  { id: 'flat', label: 'Flat', desc: '~10° raked mounts', factor: 0.97 },
  { id: 'standard', label: 'Standard', desc: '~22° pitched roof', factor: 1 },
  { id: 'steep', label: 'Steep', desc: '~35° pitched roof', factor: 0.95 },
]

export interface Roof {
  id: string
  label: string
  desc: string
  /** panel capacity at 430 W panels */
  capacity: number
}

export const ROOFS: Roof[] = [
  { id: 'small', label: 'Cosy', desc: 'Terrace or cottage roof', capacity: 14 },
  { id: 'medium', label: 'Family', desc: 'Standard family home', capacity: 22 },
  { id: 'large', label: 'Sprawling', desc: 'Big roof, big shed, both', capacity: 34 },
]

export interface Shade {
  id: string
  label: string
  factor: number
}

export const SHADES: Shade[] = [
  { id: 'none', label: 'Clear sky', factor: 1 },
  { id: 'some', label: 'A couple of trees', factor: 0.9 },
  { id: 'heavy', label: 'Afternoon shade', factor: 0.78 },
]

export interface Battery {
  id: string
  label: string
  kwh: number
  price: number
  desc: string
}

export const BATTERIES: Battery[] = [
  { id: 'none', label: 'Panels only', kwh: 0, price: 0, desc: 'No storage — sell the excess back to the grid.' },
  { id: 'sunbank-s', label: 'Sunbank S', kwh: 6.5, price: 7900, desc: 'Covers most evening cooking and telly.' },
  { id: 'sunbank-m', label: 'Sunbank M', kwh: 10, price: 9800, desc: 'The sweet spot for a family of four.' },
  { id: 'sunbank-l', label: 'Sunbank L', kwh: 13.5, price: 12600, desc: 'Overnight, with room for the EV.' },
]

export const PANEL_KW = 0.43
export const PANEL_PRICE_PER_KW = 1180
export const TARIFF = 0.33 // $/kWh usage
export const FEED_IN = 0.065 // $/kWh export
export const SYSTEM_LOSSES = 0.82 // inverter, heat, dust, cabling
export const MIN_PANELS = 6
export const ESCALATION = 0.04 // assumed power-price rise per year
export const DEGRADATION = 0.006 // panel output fade per year
export const SUPPLY_PER_QUARTER = 92 // fixed daily-supply charge that solar can't erase

const ZONE_STC_RATE: Record<number, number> = { 1: 690, 2: 620, 3: 585, 4: 520 }

/** Mocked per-state incentive, dollars + display label. */
export function stateIncentive(state: string, batteryKwh: number): { amount: number; label: string } {
  switch (state) {
    case 'NSW':
      return batteryKwh >= 6.5
        ? { amount: 1600, label: 'NSW battery incentive (mocked)' }
        : { amount: 0, label: '' }
    case 'VIC':
      return { amount: 1400, label: 'Solar Homes program rebate (mocked)' }
    case 'QLD':
      return batteryKwh >= 6.5 ? { amount: 600, label: 'QLD battery booster (mocked)' } : { amount: 0, label: '' }
    case 'SA':
      return batteryKwh >= 6.5
        ? { amount: 2400, label: 'Home Battery Scheme (mocked)' }
        : { amount: 400, label: 'SA small-scale top-up (mocked)' }
    case 'WA':
      return { amount: 500, label: 'WA distributed-energy credit (mocked)' }
    case 'TAS':
      return { amount: 0, label: '' }
    case 'ACT':
      return { amount: 1200, label: 'Actew-style sustainability rebate (mocked)' }
    case 'NT':
      return batteryKwh >= 6.5 ? { amount: 1000, label: 'NT energy grant (mocked)' } : { amount: 0, label: '' }
    default:
      return { amount: 0, label: '' }
  }
}

export interface QuoteConfig {
  addressId: string
  orientationId: string
  pitchId: string
  roofId: string
  shadeId: string
  billQuarter: number
  /** explicit panel override; null = auto-size from usage */
  panels: number | null
  batteryId: string
}

export interface YearPoint {
  year: number
  annual: number
  cumulative: number
}

export interface QuoteResult {
  address: AddressEntry
  orientation: Orientation
  pitch: Pitch
  roof: Roof
  shade: Shade
  battery: Battery
  dailyKwh: number
  annualUse: number
  panels: number
  recommended: number
  kw: number
  annualGen: number
  gross: number
  stc: number
  stateAmount: number
  stateLabel: string
  net: number
  selfKwh: number
  exportKwh: number
  savingYear1: number
  newQuarter: number
  paybackYears: number
  years: YearPoint[]
  /** interpolated break-even year, or null if beyond 10 */
  breakEven: number | null
  grossTenYear: number
}

const round50 = (n: number) => Math.round(n / 50) * 50

export function computeQuote(cfg: QuoteConfig): QuoteResult {
  const address = ADDRESSES.find((a) => a.id === cfg.addressId) ?? ADDRESSES[8] // Bondi
  const orientation = ORIENTATIONS.find((o) => o.id === cfg.orientationId) ?? ORIENTATIONS[0]
  const pitch = PITCHES.find((p) => p.id === cfg.pitchId) ?? PITCHES[1]
  const roof = ROOFS.find((r) => r.id === cfg.roofId) ?? ROOFS[1]
  const shade = SHADES.find((s) => s.id === cfg.shadeId) ?? SHADES[0]
  const battery = BATTERIES.find((b) => b.id === cfg.batteryId) ?? BATTERIES[0]

  const dailyKwh = Math.round(((cfg.billQuarter * 4) / 365 / TARIFF) * 10) / 10
  const annualUse = cfg.billQuarter * 4

  const yieldFactor = orientation.factor * pitch.factor * shade.factor * SYSTEM_LOSSES
  const perPanelDaily = PANEL_KW * address.sunHours * yieldFactor
  const recommended = Math.min(
    roof.capacity,
    Math.max(MIN_PANELS, Math.ceil(dailyKwh / perPanelDaily)),
  )
  const panels = Math.min(
    roof.capacity,
    Math.max(MIN_PANELS, cfg.panels ?? recommended),
  )
  const kw = Math.round(panels * PANEL_KW * 10) / 10

  const annualGen = Math.round(panels * PANEL_KW * address.sunHours * 365 * yieldFactor)

  const gross = round50(kw * PANEL_PRICE_PER_KW) + battery.price
  const stc = round50(kw * ZONE_STC_RATE[address.zone])
  const { amount: stateAmount, label: stateLabel } = stateIncentive(address.state, battery.kwh)
  const net = Math.max(0, gross - stc - stateAmount)

  const selfRatio = Math.min(0.82, 0.35 + (battery.kwh > 0 ? 0.33 : 0))
  const selfKwh = Math.round(Math.min(annualGen * selfRatio, annualUse))
  const exportKwh = Math.max(0, annualGen - selfKwh)
  const savingYear1 = Math.round(selfKwh * TARIFF + exportKwh * FEED_IN)

  const newQuarter = Math.round(Math.max(SUPPLY_PER_QUARTER, cfg.billQuarter - savingYear1 / 4))

  const years: YearPoint[] = [{ year: 0, annual: 0, cumulative: -net }]
  let cumulative = -net
  let breakEven: number | null = null
  for (let y = 1; y <= 10; y++) {
    const annual = Math.round(
      savingYear1 * Math.pow(1 + ESCALATION, y - 1) * (1 - DEGRADATION * (y - 1)),
    )
    cumulative += annual
    if (breakEven === null && cumulative >= 0) {
      const prev = cumulative - annual
      const frac = annual > 0 ? Math.min(1, Math.max(0, -prev / annual)) : 0
      breakEven = Math.round((y - 1 + frac) * 10) / 10
      if (breakEven === 0) breakEven = y === 1 ? 1 : breakEven
    }
    years.push({ year: y, annual, cumulative })
  }

  const paybackYears = savingYear1 > 0 ? Math.round((net / savingYear1) * 10) / 10 : 0

  return {
    address,
    orientation,
    pitch,
    roof,
    shade,
    battery,
    dailyKwh,
    annualUse,
    panels,
    recommended,
    kw,
    annualGen,
    gross,
    stc,
    stateAmount,
    stateLabel,
    net,
    selfKwh,
    exportKwh,
    savingYear1,
    newQuarter,
    paybackYears,
    years,
    breakEven,
    grossTenYear: cumulative + net,
  }
}

export const fmtMoney = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-AU', { maximumFractionDigits: 0 })

export const fmtKwh = (n: number) => `${Math.round(n).toLocaleString('en-AU')} kWh`

export const fmtKw = (n: number) => `${Number(n.toFixed(1))} kW`
