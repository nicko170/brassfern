/**
 * Meridian Climate — emissions explorer: fictional data engine.
 * Every figure is generated with a seeded PRNG, so the demo is stable
 * between renders and reloads while remaining entirely made up.
 * Unit conventions: emissions in kilotonnes CO2-e; population in thousands.
 */

export const YEARS: number[] = Array.from({ length: 11 }, (_, i) => 2014 + i)
export const LAST = YEARS.length - 1

export type SectorId = 'energy' | 'transport' | 'industry' | 'agriculture' | 'waste'

export interface SectorDef {
  id: SectorId
  label: string
  colour: string
}

export const SECTORS: SectorDef[] = [
  { id: 'energy', label: 'Stationary energy', colour: '#e0a552' },
  { id: 'transport', label: 'Transport', colour: '#4db39b' },
  { id: 'industry', label: 'Industry', colour: '#7d97ad' },
  { id: 'agriculture', label: 'Agriculture', colour: '#9cae5c' },
  { id: 'waste', label: 'Waste', colour: '#c97b5f' },
]

export type Cohort = 'Metro' | 'Regional city' | 'Coastal shire' | 'Rural'

export const COHORT_COLOURS: Record<Cohort, string> = {
  Metro: '#4db39b',
  'Regional city': '#e0a552',
  'Coastal shire': '#7d97ad',
  Rural: '#c97b5f',
}

export type YearEmissions = Record<SectorId, number>

export interface LGA {
  id: string
  name: string
  state: string
  cohort: Cohort
  /** residents, in thousands */
  pop: number
  /** tile-grid position (approximate geography) */
  col: number
  row: number
  /** 2–3 letter tile abbreviation */
  abbr: string
  /** editorial note shown in the detail panel */
  note?: string
  /** kt CO2-e per sector, index aligned with YEARS */
  series: YearEmissions[]
}

// ------------------------------------------------------------ seeded rng

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ------------------------------------------------------------ generation

const SHARES: Record<Cohort, Record<SectorId, number>> = {
  Metro: { energy: 0.42, transport: 0.3, industry: 0.15, agriculture: 0.04, waste: 0.09 },
  'Regional city': { energy: 0.36, transport: 0.28, industry: 0.18, agriculture: 0.08, waste: 0.1 },
  'Coastal shire': { energy: 0.34, transport: 0.3, industry: 0.1, agriculture: 0.16, waste: 0.1 },
  Rural: { energy: 0.2, transport: 0.22, industry: 0.12, agriculture: 0.38, waste: 0.08 },
}

/** baseline tonnes CO2-e per resident, by cohort */
const BASE_PC: Record<Cohort, number> = {
  Metro: 9.4,
  'Regional city': 13.8,
  'Coastal shire': 16.9,
  Rural: 27.5,
}

const DRIFT: Record<SectorId, number> = {
  energy: -0.033,
  transport: 0.004,
  industry: -0.009,
  agriculture: -0.002,
  waste: 0.007,
}

interface Spec {
  id: string
  name: string
  state: string
  cohort: Cohort
  pop: number
  col: number
  row: number
  abbr: string
  note?: string
}

const SPECS: Spec[] = [
  { id: 'saltberry-heights', name: 'Saltberry Heights', state: 'NSW', cohort: 'Metro', pop: 212, col: 9, row: 4, abbr: 'SH', note: 'A dense, fast-gentrifying metro council. Falling energy use per person, but ride-hail and delivery freight keep dragging transport the other way.' },
  { id: 'brackenfield', name: 'Brackenfield', state: 'QLD', cohort: 'Metro', pop: 265, col: 8, row: 2, abbr: 'BF' },
  { id: 'northgate', name: 'Northgate', state: 'VIC', cohort: 'Metro', pop: 188, col: 7, row: 5, abbr: 'NG' },
  { id: 'yallambee', name: 'Yallambee', state: 'VIC', cohort: 'Metro', pop: 96, col: 8, row: 6, abbr: 'YA', note: 'Bought 100% renewable electricity for all council operations in 2022 — small in absolute terms, but it moved the conversation.' },
  { id: 'corio-junction', name: 'Corio Junction', state: 'VIC', cohort: 'Regional city', pop: 121, col: 7, row: 6, abbr: 'CJ' },
  { id: 'hartley-crossing', name: 'Hartley Crossing', state: 'NSW', cohort: 'Regional city', pop: 84, col: 8, row: 4, abbr: 'HX' },
  { id: 'marble-hill', name: 'Marble Hill', state: 'SA', cohort: 'Regional city', pop: 57, col: 5, row: 5, abbr: 'MH' },
  { id: 'ironwood', name: 'Ironwood', state: 'SA', cohort: 'Regional city', pop: 43, col: 4, row: 4, abbr: 'IW', note: 'The steepest fall in the sample — and the least comfortable one. The smelter closed in 2019 and 900 jobs went with it. A decline is not always a victory, and this platform says so.' },
  { id: 'mangrove-bay', name: 'Mangrove Bay', state: 'QLD', cohort: 'Coastal shire', pop: 61, col: 7, row: 1, abbr: 'MB', note: 'The sample’s quiet overachiever: a community-owned solar farm and a hard line on new gas connections bent the curve from 2018 without losing a single major employer.' },
  { id: 'cape-lyrebird', name: 'Cape Lyrebird', state: 'VIC', cohort: 'Coastal shire', pop: 38, col: 6, row: 7, abbr: 'CL' },
  { id: 'boomerang-point', name: 'Boomerang Point', state: 'NSW', cohort: 'Coastal shire', pop: 74, col: 9, row: 3, abbr: 'BP' },
  { id: 'tenterdon-plains', name: 'Tenterdon Plains', state: 'NSW', cohort: 'Rural', pop: 29, col: 7, row: 3, abbr: 'TP', note: 'Herd rebuilding after the drought years pushed agricultural emissions up — a real rise, driven by recovery, not waste.' },
  { id: 'fern-gully', name: 'Fern Gully Shire', state: 'QLD', cohort: 'Rural', pop: 22, col: 6, row: 2, abbr: 'FG' },
  { id: 'lake-cummin', name: 'Lake Cummin', state: 'TAS', cohort: 'Rural', pop: 18, col: 8, row: 7, abbr: 'LC', note: 'Mostly hydro-powered grid, forestry in the ledger. The lowest per-capita figure in the rural cohort by a distance.' },
  { id: 'koorinya', name: 'Koorinya', state: 'WA', cohort: 'Rural', pop: 31, col: 2, row: 3, abbr: 'KO' },
]

function buildSeries(spec: Spec): YearEmissions[] {
  const rand = mulberry(hashString(spec.id))
  const shares = SHARES[spec.cohort]
  const baseKt = ((BASE_PC[spec.cohort] * spec.pop) / 1000) * (0.9 + rand() * 0.2)
  const offset = {} as Record<SectorId, number>
  const cur = {} as Record<SectorId, number>
  for (const s of SECTORS) {
    offset[s.id] = (rand() - 0.5) * 0.02
    cur[s.id] = baseKt * shares[s.id] * (0.88 + rand() * 0.24)
  }
  const out: YearEmissions[] = []
  for (let yi = 0; yi < YEARS.length; yi++) {
    if (yi > 0) {
      const year = YEARS[yi]
      for (const s of SECTORS) {
        let d = DRIFT[s.id] + offset[s.id] + (rand() - 0.5) * 0.014
        // story specials — deliberate narrative arcs inside the fake data
        if (spec.id === 'mangrove-bay' && s.id === 'energy' && yi >= 4) d = -0.11
        if (spec.id === 'tenterdon-plains' && s.id === 'agriculture' && yi >= 5) d = 0.055
        if (spec.id === 'saltberry-heights' && s.id === 'transport' && yi >= 7) d = 0.03
        cur[s.id] *= 1 + d
      }
      if (year === 2020) cur.transport *= 0.82
      if (year === 2021) cur.transport *= 0.94
      if (spec.id === 'ironwood' && year === 2019) cur.industry *= 0.45
      if (spec.id === 'ironwood' && year === 2020) cur.industry *= 0.7
    }
    out.push({ ...cur })
  }
  return out
}

export const LGAS: LGA[] = SPECS.map((spec) => ({ ...spec, series: buildSeries(spec) }))

export const GRID_COLS = 10
export const GRID_ROWS = 8

// ------------------------------------------------------------ derived data

export const round1 = (n: number) => Math.round(n * 10) / 10

export function totalKt(lga: LGA, yi: number): number {
  const y = lga.series[yi]
  return SECTORS.reduce((sum, s) => sum + y[s.id], 0)
}

export function perCapita(lga: LGA, yi: number): number {
  return (totalKt(lga, yi) * 1000) / lga.pop
}

export function changePct(lga: LGA, yi: number = LAST): number {
  return totalKt(lga, yi) / totalKt(lga, 0) - 1
}

export function sectorYear(sector: SectorId, yi: number): number {
  return LGAS.reduce((sum, lga) => sum + lga.series[yi][sector], 0)
}

export function nationalTotal(yi: number): number {
  return LGAS.reduce((sum, lga) => sum + totalKt(lga, yi), 0)
}

export function nationalPerCapita(yi: number): number {
  const pop = LGAS.reduce((sum, lga) => sum + lga.pop, 0)
  return (nationalTotal(yi) * 1000) / pop
}

/** average per-capita line for a cohort, one value per year */
export function cohortLine(cohort: Cohort): number[] {
  const members = LGAS.filter((l) => l.cohort === cohort)
  return YEARS.map((_, yi) => members.reduce((sum, l) => sum + perCapita(l, yi), 0) / members.length)
}

// ------------------------------------------------------------ heat ramp

const RAMP: [number, string][] = [
  [0, '#2e8f7a'],
  [0.35, '#79ab8b'],
  [0.55, '#d5c58c'],
  [0.78, '#e0a458'],
  [1, '#c96b3a'],
]

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** teal → amber heat ramp, t in [0,1] */
export function heat(t: number): string {
  const x = Math.min(1, Math.max(0, t))
  let i = 0
  while (i < RAMP.length - 2 && x > RAMP[i + 1][0]) i++
  const [t0, c0] = RAMP[i]
  const [t1, c1] = RAMP[i + 1]
  const f = (x - t0) / (t1 - t0 || 1)
  const a = hexRgb(c0)
  const b = hexRgb(c1)
  const mix = a.map((v, k) => Math.round(v + (b[k] - v) * f))
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`
}

export const RAMP_CSS = `linear-gradient(90deg, ${RAMP.map(([, c]) => c).join(', ')})`
