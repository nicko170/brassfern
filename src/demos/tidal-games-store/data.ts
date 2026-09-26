/**
 * Tidal Games — catalogue data, regions, discount codes, seeded PRNG.
 * Every game, studio, price and review score is fictional.
 */

export type Genre =
  | 'Action'
  | 'Adventure'
  | 'Puzzle'
  | 'Simulation'
  | 'RPG'
  | 'Strategy'
  | 'Rhythm'
  | 'Racing'

export type Platform = 'PC' | 'Mac' | 'Switch' | 'PS5' | 'Xbox' | 'Deck'

export interface TgGame {
  id: string
  title: string
  dev: string
  year: number
  genres: Genre[]
  platforms: Platform[]
  /** base price in USD; regional prices derive from RATES */
  usd: number
  /** fraction off, e.g. 0.3 = 30% off */
  sale?: number
  rating: number
  players: string
  length: string
  blurb: string
  pitch: string
  features: string[]
  /** [skyTop, skyBottom, ridgeFar, ridgeNear, accent] */
  palette: [string, string, string, string, string]
}

export const PLATFORMS: Platform[] = ['PC', 'Mac', 'Switch', 'PS5', 'Xbox', 'Deck']

export const GENRES: Genre[] = [
  'Action',
  'Adventure',
  'Puzzle',
  'Simulation',
  'RPG',
  'Strategy',
  'Rhythm',
  'Racing',
]

export const games: TgGame[] = [
  {
    id: 'saltwake',
    title: 'Saltwake',
    dev: 'Stormglass Studio',
    year: 2025,
    genres: ['Adventure', 'Action'],
    platforms: ['PC', 'Switch', 'Deck'],
    usd: 24.99,
    rating: 4.8,
    players: 'Solo',
    length: 'Runs of 40–90 min',
    blurb: 'A sailing roguelite where the map is drawn by the storm you just survived.',
    pitch:
      'Chart a drowning archipelago one squall at a time. Every run redraws the sea; every port remembers your debts. Reef the sails, ride the swell, and try not to name the ship after anyone you love.',
    features: ['Procedural seas', 'Roguelite voyages', 'Shanty soundtrack', 'Photo mode'],
    palette: ['#03141f', '#0b3742', '#0f5560', '#16766d', '#5ff2b8'],
  },
  {
    id: 'lantern-reef',
    title: 'Lantern Reef',
    dev: 'Two Souls Down',
    year: 2024,
    genres: ['Puzzle', 'Adventure'],
    platforms: ['PC', 'Mac', 'Switch'],
    usd: 14.99,
    sale: 0.3,
    rating: 4.6,
    players: 'Solo',
    length: '6–8 h',
    blurb: 'A light-bending puzzle dive through a reef that only exists where you shine.',
    pitch:
      'You are the last lighthouse keeper, and the lighthouse sank. Carry its lantern into the dark, angle beams through coral lenses, and wake a reef that glows only for you. No timers. No fail states. Just the dark, and what you do with it.',
    features: ['200+ hand-built puzzles', 'Dynamic bioluminescence', 'Zero fail states'],
    palette: ['#020f1d', '#0a2c4a', '#104469', '#1e6a86', '#7ef3ff'],
  },
  {
    id: 'gritloop',
    title: 'Gritloop',
    dev: 'Hexadecibel',
    year: 2025,
    genres: ['Racing', 'Action'],
    platforms: ['PC', 'PS5', 'Xbox'],
    usd: 19.99,
    rating: 4.4,
    players: '1–2 split-screen',
    length: 'Loops of 60 s',
    blurb: 'An arcade racer where the lap repeats until you beat the ghost of your best mistake.',
    pitch:
      'Sixty seconds, one corner, every lap stacked on the last. Your previous loops race beside you as ghosts — draft them, block them, learn from the one that bin-fired you into the barrier. The track never changes. You do.',
    features: ['Ghost-stacking laps', 'Split-screen duels', 'Weekly seed leaderboards'],
    palette: ['#1a0b12', '#5b1a2e', '#8a2f3c', '#c1573f', '#ffc15c'],
  },
  {
    id: 'moss-cathedral',
    title: 'Moss Cathedral',
    dev: 'Slowblink Games',
    year: 2023,
    genres: ['Adventure', 'Puzzle'],
    platforms: ['PC', 'Mac', 'Switch', 'Deck'],
    usd: 12.99,
    rating: 4.9,
    players: 'Solo',
    length: '5 h, slow',
    blurb: 'A wordless platformer about a choir of lichen restoring a flooded chapel.',
    pitch:
      'Grow, cling and bloom across a drowned cathedral one hand-painted vault at a time. Nothing here hurts you. The only enemy is gravity, and gravity is negotiable once the moss learns to sing.',
    features: ['Hand-painted frames', 'Generative choir audio', 'One-button play'],
    palette: ['#04180f', '#0e3a22', '#175631', '#2c7a44', '#a8f0c0'],
  },
  {
    id: 'night-market-88',
    title: 'Night Market 88',
    dev: 'Paper Plan',
    year: 2024,
    genres: ['Simulation', 'RPG'],
    platforms: ['PC', 'Switch'],
    usd: 16.99,
    sale: 0.2,
    rating: 4.7,
    players: 'Solo',
    length: 'Seasons of 12 nights',
    blurb: 'Run a noodle stall in a market that opens at midnight and closes before the rain.',
    pitch:
      'Prep the broth by day, work the wok by night, and get to know the regulars — the taxi ghost, the mahjong aunties, the inspector who definitely is not a cat. Every recipe you master changes who sat at your counter, and who they brought.',
    features: ['30+ recipes', 'A cast of 40 regulars', 'Rain that matters'],
    palette: ['#160826', '#3a1140', '#6d1f4e', '#a63a54', '#ffb35c'],
  },
  {
    id: 'orchards-of-io',
    title: 'Orchards of Io',
    dev: 'Tiny Comet',
    year: 2025,
    genres: ['Simulation', 'Strategy'],
    platforms: ['PC', 'Mac'],
    usd: 21.99,
    rating: 4.5,
    players: 'Solo',
    length: 'Campaign ~20 h',
    blurb: 'Farming on a volcanic moon: graft sulphur pears, herd dust mites, mind the geysers.',
    pitch:
      'Terraform one stubborn hectare at a time on Jupiter’s angriest moon. Graft crops that thrive on sulphur, schedule harvests around eruptions, and trade surplus pears with the orbital monastery. Gentle, systemic, quietly ridiculous.',
    features: ['Grafting genetics', 'Eruption forecasting', 'Cozy-hard mode'],
    palette: ['#120b26', '#37245c', '#5c3c7e', '#8a5a86', '#ff8a6a'],
  },
  {
    id: 'verdigris',
    title: 'Verdigris',
    dev: 'Foundry Nine',
    year: 2022,
    genres: ['Strategy', 'RPG'],
    platforms: ['PC'],
    usd: 29.99,
    sale: 0.4,
    rating: 4.3,
    players: 'Solo',
    length: 'Campaign ~35 h',
    blurb: 'Tactics with rust: mechs that corrode mid-battle and crews who name every rivet.',
    pitch:
      'Command a salvage company on a coastline of drowned industry. Armour corrodes where the sea touches it, every pilot remembers every mission, and the best engine in the game is the one you talked a rival into abandoning.',
    features: ['Corrosion simulation', 'Permadeath, kindly', 'Salvage diplomacy'],
    palette: ['#07181a', '#123c3c', '#1f5c50', '#3f7a55', '#e0a458'],
  },
  {
    id: 'signal-choir',
    title: 'Signal Choir',
    dev: 'Quiet Machines',
    year: 2025,
    genres: ['Rhythm', 'Adventure'],
    platforms: ['PC', 'Mac', 'Switch', 'PS5'],
    usd: 17.99,
    rating: 4.8,
    players: 'Solo',
    length: '4 h',
    blurb: 'A narrative rhythm game sung between a dead radio station and the town that hears it.',
    pitch:
      'Every night at 2 a.m. the town’s dead radio station broadcasts one song, and every night the town sings back. Match the harmonies, decode the requests, and figure out who is still up there pressing play.',
    features: ['Original 18-track score', 'Live-harmony mechanics', 'Subtitled everything'],
    palette: ['#080c26', '#1c2b5c', '#31467e', '#4e6798', '#8affd8'],
  },
  {
    id: 'doldrums',
    title: 'Doldrums',
    dev: 'Beachwood Labs',
    year: 2024,
    genres: ['Simulation', 'Strategy'],
    platforms: ['PC', 'Mac', 'Deck'],
    usd: 22.99,
    rating: 4.2,
    players: 'Solo',
    length: 'Endless, kindly',
    blurb: 'A city builder for a town where nothing urgent ever happens, beautifully.',
    pitch:
      'Build a harbour town in a bay the wind forgot. There are no disasters, no invasions, no win state — just tides, tourists, and a council that cares deeply about the promenade. Optimise or potter. The sea does not judge.',
    features: ['No fail state, ever', 'Tidal building plots', 'Serious promenade sim'],
    palette: ['#0a171a', '#1e3a40', '#3a5c5c', '#7a8a72', '#e8d9a0'],
  },
  {
    id: 'petrichor',
    title: 'Petrichor',
    dev: 'Umbra Mile',
    year: 2023,
    genres: ['Adventure', 'RPG'],
    platforms: ['PC', 'PS5', 'Xbox'],
    usd: 26.99,
    sale: 0.25,
    rating: 4.6,
    players: 'Solo',
    length: '12–15 h',
    blurb: 'A rain-noir detective story where every clue smells different after the storm.',
    pitch:
      'You investigate by nose: rain rewires the city’s smells, and every case is a map of petrichor, ozone and somebody’s guilt. Interview downpipes. Stake out laundromats. Trust the storm drains more than the witnesses.',
    features: ['Scent-map mechanic', 'Branching casework', 'Fully voiced cast'],
    palette: ['#0a0e14', '#1e2834', '#32404e', '#556668', '#ffc15c'],
  },
  {
    id: 'kestrels-run',
    title: 'Kestrel’s Run',
    dev: 'Loftworks',
    year: 2025,
    genres: ['Action'],
    platforms: ['PC', 'Switch', 'Deck'],
    usd: 11.99,
    rating: 4.7,
    players: 'Solo',
    length: 'Runs of 3 min',
    blurb: 'A precision platformer played at falcon speed. Three minutes. One dive. No brakes.',
    pitch:
      'You are the kestrel; the level is the dive. Chain wing-beats, stall turns and sheer nerve down hand-tuned towers at 200 km/h. Every run is under three minutes, and you will attempt number four hundred.',
    features: ['300 hand-tuned drops', 'Instant retry', 'Daily tower'],
    palette: ['#081420', '#14344a', '#2c5a70', '#6aa0a8', '#e8f8ff'],
  },
  {
    id: 'babycakes',
    title: 'Babycakes vs The Deep',
    dev: 'Snackwave Interactive',
    year: 2024,
    genres: ['Action', 'Adventure'],
    platforms: ['Switch', 'PS5', 'Xbox', 'PC'],
    usd: 19.99,
    rating: 4.4,
    players: '1–4 couch co-op',
    length: 'Binges encouraged',
    blurb: 'A couch co-op brawler about four sentient pastries defending a bakery from the tide.',
    pitch:
      'The sea wants the bakery. The bakery has you: four eldritch pastries with rolling pins and grievances. Bash barnacles, frost your wounds, and argue about who let the octopus in. Best played loud, with cake.',
    features: ['4-player couch chaos', 'Frosting-based healing', 'A genuinely rude kraken'],
    palette: ['#140818', '#3c1430', '#6d2540', '#a64548', '#5ff2b8'],
  },
]

/* ---------- regions ---------- */

export interface Region {
  code: 'AUD' | 'NZD' | 'USD'
  label: string
  locale: string
  rate: number
}

export const REGIONS: Region[] = [
  { code: 'AUD', label: 'AU · AUD', locale: 'en-AU', rate: 1.55 },
  { code: 'NZD', label: 'NZ · NZD', locale: 'en-NZ', rate: 1.72 },
  { code: 'USD', label: 'US · USD', locale: 'en-US', rate: 1 },
]

export const gameById = new Map(games.map((g) => [g.id, g]))

/** Sale-aware USD price. */
export function usdPrice(g: TgGame): number {
  return g.sale ? g.usd * (1 - g.sale) : g.usd
}

/**
 * Regional price with storefront-style .99 endings:
 * convert, round to the nearest dollar, drop a cent.
 */
export function regionalPrice(g: TgGame, r: Region): { now: number; was: number | null } {
  const to99 = (v: number) => Math.max(0.99, Math.round(v * r.rate) - 0.01)
  const now = to99(usdPrice(g))
  const was = g.sale ? to99(g.usd) : null
  return { now, was: was && was > now ? was : null }
}

export function money(v: number, r: Region): string {
  return new Intl.NumberFormat(r.locale, {
    style: 'currency',
    currency: r.code,
    minimumFractionDigits: 2,
  }).format(v)
}

/* ---------- discount codes ---------- */

export interface CodeResult {
  ok: boolean
  message: string
  /** fraction of the subtotal to deduct */
  pct?: number
  code?: string
}

export function applyCode(raw: string, lineCount: number, subtotalUsd: number): CodeResult {
  const code = raw.trim().toUpperCase()
  if (!code) return { ok: false, message: 'Type a code first — try TIDAL10.' }
  switch (code) {
    case 'TIDAL10':
      return { ok: true, code, pct: 0.1, message: 'TIDAL10 applied — 10% off. Welcome aboard.' }
    case 'BUNDLE3':
      if (lineCount < 3)
        return {
          ok: false,
          message: `BUNDLE3 needs 3+ games in the cart — you have ${lineCount}.`,
        }
      return { ok: true, code, pct: 0.15, message: 'BUNDLE3 applied — 15% off the bundle.' }
    case 'ABYSS':
      if (subtotalUsd < 60)
        return { ok: false, message: 'ABYSS unlocks at US$60 of cart. Keep diving.' }
      return { ok: true, code, pct: 0.25, message: 'ABYSS applied — 25% off. Deep cut.' }
    default:
      return { ok: false, message: `“${code}” isn’t a code we honour. Try TIDAL10, BUNDLE3 or ABYSS.` }
  }
}

/* ---------- seeded PRNG ---------- */

export function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
