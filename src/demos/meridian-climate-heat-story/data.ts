/**
 * Meridian Climate — "2046: the heat map of one summer".
 * Every number in this file is fictional, seeded and internally consistent.
 * The city — Greater Meridian — does not exist. The craft does.
 */

export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const round1 = (n: number) => Math.round(n * 10) / 10
export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

// ---------------------------------------------------------------- the grid

export const COLS = 12
export const ROWS = 8

const FIRSTS = ['Jarrah', 'Ochre', 'Salt', 'Ferro', 'Gully', 'Lark', 'Harrow', 'Cinder', 'Tern', 'Moss', 'Piper', 'Vesper']
const SECONDS = ['Hill', 'Ford', 'Grove', 'Hollow', 'Marsh', 'Park', 'Ridge', 'Cross']

export interface Suburb {
  id: string
  name: string
  col: number
  row: number
  /** 0 = harbourside (east), 1 = the far west */
  west: number
  water: boolean
  park: boolean
  /** summer 2045–46 anomaly vs the 20th-century baseline, °C */
  anomaly: number
  /** projected anomaly with the Shade Budget canopy plan in place, °C */
  planned: number
  canopy1997: number
  canopy2046: number
}

// default park pockets — old plantings that kept their cool
const PARK_CELLS = new Set(['9,0', '10,1', '2,1', '8,5', '3,6', '6,2'])

function buildSuburbs(): Suburb[] {
  const rand = rng(20460114)
  // deterministic permutation so names sit still between renders
  const order = Array.from({ length: COLS * ROWS }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const suburbs: Suburb[] = []
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const p = order[row * COLS + col]
      const name = `${FIRSTS[p % FIRSTS.length]} ${SECONDS[Math.floor(p / FIRSTS.length)]}`
      const west = col / (COLS - 1)
      const coast = row / (ROWS - 1) // bottom edge fronts the harbour
      const water = row === ROWS - 1 && col >= 5 && col <= 7
      const park = PARK_CELLS.has(`${col},${row}`)
      const dx = (col - 5.5) / 6
      const dy = (row - 3) / 4
      const core = clamp(1 - Math.sqrt(dx * dx + dy * dy), 0, 1)
      const noise = (rand() - 0.5) * 0.9
      let anomaly = 2.4 + west * 3.2 + core * 1.3 + (1 - coast) * 0.9 - (park ? 1.6 : 0) + noise
      if (water) anomaly -= 1.4
      anomaly = round1(clamp(anomaly, 0.6, 7.6))

      const canopy1997 = Math.round(
        clamp(34 - west * 16 - core * 8 + coast * 4 + (park ? 12 : 0) + (rand() - 0.5) * 8, 4, 58),
      )
      const canopy2046 = Math.round(clamp(canopy1997 + 6 + west * 11 + core * 4 + (rand() - 0.5) * 4, canopy1997, 52))
      // every added point of canopy buys roughly 0.13°C of relief
      const planned = round1(clamp(anomaly - (canopy2046 - canopy1997) * 0.13 - (park ? 0.3 : 0), 0.4, anomaly))
      suburbs.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        col,
        row,
        west,
        water,
        park,
        anomaly,
        planned,
        canopy1997,
        canopy2046,
      })
    }
  }
  return suburbs
}

export const SUBURBS: Suburb[] = buildSuburbs()

const land = SUBURBS.filter((s) => !s.water)
export const HOTTEST: Suburb[] = [...land].sort((a, b) => b.anomaly - a.anomaly).slice(0, 8)
export const HOT_BLOCK = HOTTEST[0]
const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length
export const AVG_ANOMALY = round1(mean(land.map((s) => s.anomaly)))
export const AVG_PLANNED = round1(mean(land.map((s) => s.planned)))
export const AVG_CANOPY_1997 = Math.round(mean(land.map((s) => s.canopy1997)))
export const AVG_CANOPY_2046 = Math.round(mean(land.map((s) => s.canopy2046)))
export const WEST_SET = SUBURBS.filter((s) => s.col >= 9 && !s.water)
export const PARK_SET = SUBURBS.filter((s) => s.park)
/** blocks that stay above +5°C after the plan — the stubborn core */
export const STUBBORN = land.filter((s) => s.planned > 5)

// ------------------------------------------------------------ the summer

export interface Day {
  i: number
  label: string
  short: string
  t1997: number
  t2046: number
}

const gauss = (x: number, mu: number, sigma: number) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma))

function buildDays(): Day[] {
  const rand = rng(19970204)
  const months: [string, number][] = [['Dec', 31], ['Jan', 31], ['Feb', 28]]
  const days: Day[] = []
  let i = 0
  for (const [mon, len] of months) {
    for (let d = 1; d <= len; d++) {
      const seasonal = Math.sin((Math.PI * (i + 10)) / 110) // crests mid-January
      const heat1 = gauss(i, 44, 4.5) * 11 // the Nine-Day Bake, cresting 14 Jan 2046
      const heat2 = gauss(i, 68, 3) * 5.4 // the February Forgiveness (misnomer)
      const t2046 = round1(30.5 + 4.5 * seasonal + heat1 + heat2 + (rand() - 0.5) * 2.4)
      const t1997 = round1(t2046 - 4.6 - 0.5 * seasonal + (rand() - 0.5) * 2.6)
      days.push({ i, label: `${d} ${mon}`, short: `${d} ${mon}`, t1997, t2046 })
      i++
    }
  }
  return days
}

export const DAYS: Day[] = buildDays()
export const PEAK: Day = DAYS.reduce((a, b) => (b.t2046 > a.t2046 ? b : a), DAYS[0])
export const OVER40_2046 = DAYS.filter((d) => d.t2046 >= 40).length
export const OVER40_1997 = DAYS.filter((d) => d.t1997 >= 40).length
export const AVG_MAX_2046 = round1(mean(DAYS.map((d) => d.t2046)))
export const AVG_MAX_1997 = round1(mean(DAYS.map((d) => d.t1997)))

// ------------------------------------------------------------- districts

export interface District {
  id: string
  name: string
  c1997: number
  c2046: number
  blurb: string
}

export const DISTRICTS: District[] = [
  {
    id: 'west-flats',
    name: 'West Flats',
    c1997: 9,
    c2046: 24,
    blurb: 'Post-war brick and bitumen. In 1997 you could fry the cliché on its footpaths; the plan plants it like it means it.',
  },
  {
    id: 'old-grid',
    name: 'The Old Grid',
    c1997: 14,
    c2046: 26,
    blurb: 'The nineteenth-century core — narrow streets, deep eaves, almost no trees. The budget buys it a second roof.',
  },
  {
    id: 'southmarsh',
    name: 'Southmarsh',
    c1997: 18,
    c2046: 29,
    blurb: 'Reclaimed wetlands and light industry. Shade arrives with the stormwater scheme, root by root.',
  },
  {
    id: 'ironbark-ridges',
    name: 'Ironbark Ridges',
    c1997: 26,
    c2046: 33,
    blurb: 'Leafy in patches, scorching in others. Infill planting closes the gap between the haves and the have-yards.',
  },
  {
    id: 'harbour-ward',
    name: 'Harbour Ward',
    c1997: 34,
    c2046: 39,
    blurb: 'Already shaded, already expensive. The plan spends least here — fairness, printed in the appendix.',
  },
]

// ------------------------------------------------------ the thermal ramp

/** °C → colour. Ice for relief, ash for the old normal, ember for 2046. */
const STOPS: [number, [number, number, number]][] = [
  [0.0, [46, 74, 94]],
  [1.6, [63, 111, 134]],
  [3.0, [110, 143, 150]],
  [4.2, [152, 146, 127]],
  [5.2, [201, 149, 92]],
  [6.4, [217, 111, 69]],
  [7.6, [224, 67, 42]],
]

export function heatColor(v: number): string {
  const t = clamp(v, STOPS[0][0], STOPS[STOPS.length - 1][0])
  let lo = STOPS[0]
  let hi = STOPS[STOPS.length - 1]
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (t >= STOPS[i][0] && t <= STOPS[i + 1][0]) {
      lo = STOPS[i]
      hi = STOPS[i + 1]
      break
    }
  }
  const f = hi[0] === lo[0] ? 0 : (t - lo[0]) / (hi[0] - lo[0])
  const c = lo[1].map((a, k) => Math.round(a + (hi[1][k] - a) * f))
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

export const RAMP_GRADIENT = `linear-gradient(90deg, ${STOPS.map(
  ([v, c]) => `rgb(${c[0]},${c[1]},${c[2]}) ${((v / 7.6) * 100).toFixed(1)}%`,
).join(', ')})`
