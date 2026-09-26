/**
 * Sundial Itinerary Builder — data & money.
 * All journeys, stations, prices and availability are fictional and
 * illustrative: a real planner checks the ledger before promising anything.
 */

export type Mode = 'rail' | 'ferry' | 'walk' | 'cycle' | 'bus'

export interface DayPlan {
  /** Short, opinionated name of the day */
  title: string
  from: string
  to: string
  mode: Mode
  /** minutes of moving time */
  durationMin: number
  /** where you sleep that night */
  stay: string
  /** AUD for two, base tier */
  travel: number
  /** AUD for two, family-run guesthouse tier */
  sleep: number
  extras?: { label: string; cost: number }[]
  /** one-line planner's note */
  note: string
}

export interface ArtPalette {
  sky1: string
  sky2: string
  sky3: string
  sun: string
  land: string
  sea: string
}

export interface Journey {
  id: string
  name: string
  region: string
  blurb: string
  mood: string[]
  /** 0-indexed months where the season is kind */
  bestMonths: number[]
  seasonNote: string
  days: DayPlan[]
  art: ArtPalette
}

export const MODE_LABEL: Record<Mode, string> = {
  rail: 'Rail',
  ferry: 'Ferry',
  walk: 'On foot',
  cycle: 'Cycle',
  bus: 'Bus',
}

/** Sundial's planning fee — shown on purpose, never buried. AUD per day, per trip. */
export const FEE_PER_DAY = 90

export type StayTier = 'family' | 'boutique'

/** Boutique tier multiplies the nightly rate; honest arithmetic, rounded to 5. */
export const TIER_MULTIPLIER: Record<StayTier, number> = { family: 1, boutique: 1.6 }

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function aud(n: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function fmtDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}

/** Deterministic PRNG so mocked availability is stable per trip + month. */
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

export type Availability = 'open' | 'tight' | 'waitlist'

export function checkAvailability(journeyIds: string[], month: number): Availability {
  const seed = journeyIds.join('|').split('').reduce((a, c) => a + c.charCodeAt(0), month * 977 + 41)
  const r = mulberry(seed)()
  if (r < 0.55) return 'open'
  if (r < 0.85) return 'tight'
  return 'waitlist'
}

/** Suggest kinder months: the overlap of the plan's seasons. */
export function suggestedMonths(journeys: Journey[], month: number): number[] {
  if (journeys.length === 0) return []
  const overlap = journeys[0].bestMonths.filter((m) => journeys.every((j) => j.bestMonths.includes(m)))
  const picks = (overlap.length ? overlap : journeys[0].bestMonths).filter((m) => m !== month)
  return picks.slice(0, 2)
}

export const JOURNEYS: Journey[] = [
  {
    id: 'citrus-coast-line',
    name: 'The Citrus Coast Line',
    region: 'Liguria & the Cinque Terre, Italy',
    blurb:
      'Five days of lemon groves, harbour swims before breakfast, and a coastal railway that treats tunnels as punctuation.',
    mood: ['citrus', 'harbour swims', 'regional rail'],
    bestMonths: [4, 5, 8, 9],
    seasonNote: 'Kind in late May, June and the shoulder of September — swimmable, bookable, breathable.',
    art: { sky1: '#f8d9a0', sky2: '#f2b46a', sky3: '#e08a4e', sun: '#c85a2a', land: '#a34d2c', sea: '#275f5c' },
    days: [
      {
        title: 'Arrive by the water',
        from: 'Genoa', to: 'Camogli', mode: 'rail', durationMin: 42, stay: 'Camogli — Albergo al Ponte',
        travel: 28, sleep: 210,
        extras: [{ label: 'Aperitivo fund (we insist)', cost: 24 }],
        note: 'Check in, walk the harbour wall, eat the focaccia the town is quietly famous for.',
      },
      {
        title: 'The abbey under the cliff',
        from: 'Camogli', to: 'Sestri Levante', mode: 'rail', durationMin: 28, stay: 'Sestri Levante — Casa di Nonna Bruna',
        travel: 26, sleep: 195,
        extras: [{ label: 'Boat to San Fruttuoso', cost: 38 }],
        note: 'A monastery you can only reach by water or by wanting to. Swim first, abbey second.',
      },
      {
        title: 'Five villages, slowly',
        from: 'Sestri Levante', to: 'Vernazza', mode: 'rail', durationMin: 34, stay: 'Vernazza — Affittacamere La Torre',
        travel: 32, sleep: 240,
        extras: [{ label: 'Sentiero Azzurro day pass', cost: 16 }],
        note: 'The village that takes the morning light. Walk Corniglia, dine where the day boats land.',
      },
      {
        title: 'Around the gulf of poets',
        from: 'Vernazza', to: 'Lerici', mode: 'rail', durationMin: 65, stay: 'Lerici — Pensione Miramare',
        travel: 48, sleep: 205,
        note: 'Change at La Spezia with a coffee worth the platform. Shelleys and storms optional.',
      },
      {
        title: 'The slow goodbye',
        from: 'Lerici', to: 'La Spezia', mode: 'bus', durationMin: 35, stay: 'Departure day — sleeper to Milan optional',
        travel: 24, sleep: 0,
        extras: [{ label: 'Lunch at the mussel co-op', cost: 44 }],
        note: 'One last pesto. The co-op doesn’t take cards and doesn’t need to.',
      },
    ],
  },
  {
    id: 'bookshop-line',
    name: 'The Bookshop Line',
    region: 'Paris to Provence by slow rail',
    blurb:
      'Six days down the old PLM line the way it was meant to be ridden — market towns, river valleys, one bookshop per overnight.',
    mood: ['trains', 'bookshops', 'markets'],
    bestMonths: [3, 4, 5, 8],
    seasonNote: 'April to June for the markets; September for the light Impressionists kept writing home about.',
    art: { sky1: '#f7e3b8', sky2: '#eecf9a', sky3: '#d9a95f', sun: '#b4552d', land: '#6f5a33', sea: '#8c6a8f' },
    days: [
      {
        title: 'Out of Paris, on purpose',
        from: 'Paris Bercy', to: 'Auxerre', mode: 'rail', durationMin: 109, stay: 'Auxerre — Hôtel de la Gare (the good one)',
        travel: 62, sleep: 185,
        note: 'Bercy, not Lyon. The slow line starts where the fast one doesn’t.',
      },
      {
        title: 'Chablis at cellar price',
        from: 'Auxerre', to: 'Beaune', mode: 'rail', durationMin: 112, stay: 'Beaune — Maison des Vignerons',
        travel: 54, sleep: 215,
        extras: [{ label: 'Cellar tasting, small grower', cost: 52 }],
        note: 'A co-operative that pours without ceremony. Buy the bottle, not the case.',
      },
      {
        title: 'Lunch is the destination',
        from: 'Beaune', to: 'Lyon', mode: 'rail', durationMin: 128, stay: 'Lyon Croix-Rousse — La Meunière rooms',
        travel: 58, sleep: 195,
        note: 'Arrive hungry. The bouchon books itself once we email — that’s the fee working.',
      },
      {
        title: 'Into the mistral',
        from: 'Lyon Part-Dieu', to: 'Avignon Centre', mode: 'rail', durationMin: 162, stay: 'Avignon — Courtine side guesthouse',
        travel: 74, sleep: 205,
        note: 'The slow train, not the TGV. Two and a half hours of river mist instead of one hour of tunnel.',
      },
      {
        title: 'Antiques & river arms',
        from: 'Avignon', to: 'L’Isle-sur-la-Sorgue', mode: 'rail', durationMin: 33, stay: 'L’Isle-sur-la-Sorgue — above the bookbinder',
        travel: 22, sleep: 175,
        extras: [{ label: 'Sunday market budget', cost: 60 }],
        note: 'A town made of waterwheels and second-hand atlases. Trains hourly; linger anyway.',
      },
      {
        title: 'The sea appears',
        from: 'L’Isle-sur-la-Sorgue', to: 'Marseille', mode: 'rail', durationMin: 71, stay: 'Departure — or stay: we book the corniche side',
        travel: 40, sleep: 0,
        note: 'Bouillabaisse if you overnight, a platform pastis if you don’t.',
      },
    ],
  },
  {
    id: 'seto-inland-drift',
    name: 'Seto Inland Drift',
    region: 'Western Honshu & the island ferries, Japan',
    blurb:
      'Seven days across the calmest sea in Japan: castle towns, a cycling road strung between islands, and ferries that leave exactly when they say.',
    mood: ['ferries', 'cycling', 'islands'],
    bestMonths: [2, 3, 4, 9, 10],
    seasonNote: 'Spring for the blossoms along the Kaidō, October–November for persimmons and empty decks.',
    art: { sky1: '#efd9b0', sky2: '#d8e0c4', sky3: '#8fb5a8', sun: '#d9952f', land: '#1e5e54', sea: '#143d3f' },
    days: [
      {
        title: 'Castle before coffee',
        from: 'Osaka', to: 'Okayama', mode: 'rail', durationMin: 47, stay: 'Okayama — station-side ryokan',
        travel: 118, sleep: 230,
        note: 'One shinkansen, we promise — the only fast hour on the whole trip.',
      },
      {
        title: 'The lazy channel',
        from: 'Okayama', to: 'Onomichi', mode: 'rail', durationMin: 82, stay: 'Onomichi — hillside guesthouse U2',
        travel: 84, sleep: 195,
        extras: [{ label: 'Temple-ropeway return', cost: 18 }],
        note: 'A town on a slope with a literature path and cats with seniority. Take the ropeway up, walk down.',
      },
      {
        title: 'The island-hop ride',
        from: 'Onomichi', to: 'Imabari', mode: 'cycle', durationMin: 330, stay: 'Imabari — port hotel (towel capital of Japan)',
        travel: 46, sleep: 185,
        extras: [{ label: 'Rental bike + luggage forwarding', cost: 72 }],
        note: 'Seventy kilometres of bridges, but the honest version is: ride the half you like, ferry the rest.',
      },
      {
        title: 'Ferry to the west',
        from: 'Imabari', to: 'Matsuyama', mode: 'ferry', durationMin: 60, stay: 'Matsuyama — Dōgo onsen district ryokan',
        travel: 38, sleep: 250,
        extras: [{ label: 'Dōgo Onsen Honkan soak', cost: 28 }],
        note: 'Soak where the emperor sent a bathtub as a thank-you card.',
      },
      {
        title: 'Udon pilgrimage',
        from: 'Matsuyama', to: 'Takamatsu', mode: 'rail', durationMin: 151, stay: 'Takamatsu — arcade-side inn',
        travel: 96, sleep: 190,
        note: 'The limited express threads the coast; buy the ekiben at Iyo-Saijō and trust us on this.',
      },
      {
        title: 'The art island',
        from: 'Takamatsu', to: 'Naoshima', mode: 'ferry', durationMin: 52, stay: 'Naoshima — beach-side bungalow',
        travel: 34, sleep: 265,
        extras: [{ label: 'Museum day passes ×2', cost: 96 }],
        note: 'Pumpkins at the pier, Monet Underground. Bookings made by us; wonder by you.',
      },
      {
        title: 'Kyoto, earned',
        from: 'Naoshima', to: 'Kyoto', mode: 'rail', durationMin: 178, stay: 'Departure — machiya stay if you linger',
        travel: 132, sleep: 0,
        note: 'Arrive by early evening. The izakaya under the tracks knows we’re coming.',
      },
    ],
  },
  {
    id: 'atlantic-light',
    name: 'Atlantic Light',
    region: 'Porto to the Algarve, Portugal',
    blurb:
      'Five days down the coast the long way: tiled stations, sardine smoke, and a final leg on the slowest train we love.',
    mood: ['coast', 'tiles', 'sardines'],
    bestMonths: [2, 3, 4, 5, 8, 9],
    seasonNote: 'March to June before the north packs its bags; late September when the light turns bronze.',
    art: { sky1: '#fbe3b4', sky2: '#f4c27c', sky3: '#e8935a', sun: '#c2542e', land: '#365f4a', sea: '#1f5966' },
    days: [
      {
        title: 'The tiled departure',
        from: 'Porto São Bento', to: 'Aveiro', mode: 'rail', durationMin: 58, stay: 'Aveiro — canal-row pousada',
        travel: 30, sleep: 170,
        extras: [{ label: 'Moliceiro canal hour', cost: 26 }],
        note: 'Look up before you board — the station hall is the day’s first exhibit.',
      },
      {
        title: 'Salt & spray',
        from: 'Aveiro', to: 'Nazaré', mode: 'rail', durationMin: 101, stay: 'Nazaré — Sítio cliff guesthouse',
        travel: 44, sleep: 165,
        note: 'In winter the waves are world-record. In May they’re simply dinner theatre.',
      },
      {
        title: 'Lisbon, but locals’',
        from: 'Nazaré', to: 'Lisbon Oriente', mode: 'bus', durationMin: 132, stay: 'Lisbon — Graça townhouse rooms',
        travel: 26, sleep: 210,
        extras: [{ label: 'Fado house, the un-touristed one', cost: 58 }],
        note: 'We book the hill, not the postcard. Sunset at the miradouro with the neighbours.',
      },
      {
        title: 'Cork country',
        from: 'Lisbon', to: 'Évora', mode: 'rail', durationMin: 93, stay: 'Évora — convent-turned-inn',
        travel: 36, sleep: 185,
        extras: [{ label: 'Cork grove walk with a guide', cost: 48 }],
        note: 'The train crosses plains the colour of toast. The chapel of bones is optional; lunch isn’t.',
      },
      {
        title: 'The slowest good train',
        from: 'Évora', to: 'Lagos', mode: 'rail', durationMin: 238, stay: 'Departure — cliff rooms if you stay',
        travel: 58, sleep: 0,
        note: 'Nearly four hours, two changes, zero regrets. The Algarve arrives like a held breath let go.',
      },
    ],
  },
  {
    id: 'kii-peninsula-slow',
    name: 'Kii Peninsula Slow',
    region: 'Wakayama & the Kumano Kodō, Japan',
    blurb:
      'Four days of mountain shrines, riverside onsen and one honest walk — the pilgrimage route without the pilgrimage logistics.',
    mood: ['onsen', 'shrines', 'one good walk'],
    bestMonths: [3, 4, 9, 10],
    seasonNote: 'April–May under fresh green; October–November when the maples carry the colour for you.',
    art: { sky1: '#eed9AE', sky2: '#cfe0c9', sky3: '#8fb59d', sun: '#cf8a35', land: '#14524b', sea: '#0f3d37' },
    days: [
      {
        title: 'To the threshold',
        from: 'Kyoto', to: 'Kii-Tanabe', mode: 'rail', durationMin: 137, stay: 'Kii-Tanabe — harbour minshuku',
        travel: 118, sleep: 205,
        extras: [{ label: 'Luggage forwarding to Yunomine', cost: 29 }],
        note: 'The Kuroshio express runs the ocean side. Your big bag goes on ahead; you carry curiosity.',
      },
      {
        title: 'Steam above the river',
        from: 'Kii-Tanabe', to: 'Yunomine Onsen', mode: 'bus', durationMin: 108, stay: 'Yunomine — riverside ryokan, half-board',
        travel: 42, sleep: 285,
        extras: [{ label: 'Tsuboyu bath booking (the one-bath house)', cost: 16 }],
        note: 'The only UNESCO-listed hot spring you can actually bathe in. Dinner appears; you did nothing.',
      },
      {
        title: 'The walk you’ll tell people about',
        from: 'Yunomine', to: 'Katsuura', mode: 'walk', durationMin: 318, stay: 'Katsuura — over-water rooms',
        travel: 22, sleep: 265,
        note: 'Five and a half hours over the pass to Hongū Taisha, then the bus to the sea. Stamps in the credential book: ours.',
      },
      {
        title: 'Tuna, then home',
        from: 'Katsuura', to: 'Osaka', mode: 'rail', durationMin: 222, stay: 'Departure — we can add Kyoto softly',
        travel: 128, sleep: 0,
        extras: [{ label: 'Market breakfast: the serious tuna', cost: 46 }],
        note: 'The 5am auction is voluntary. The breakfast that follows is not.',
      },
    ],
  },
  {
    id: 'postcard-alps',
    name: 'Postcard Alps',
    region: 'Lucerne to Innsbruck, Switzerland & Austria',
    blurb:
      'Six days across the Alps at postcard speed: lake steamers, panorama coaches, and passes the autobahn never sees.',
    mood: ['panorama cars', 'lake steamers', 'high passes'],
    bestMonths: [4, 5, 6, 7, 8],
    seasonNote: 'May to September; the big panorama trains sleep in winter and honestly, so should you.',
    art: { sky1: '#f4e2b6', sky2: '#dcd9b8', sky3: '#a8c4b2', sun: '#d99a3f', land: '#2c5e52', sea: '#7fa8b0' },
    days: [
      {
        title: 'Lake before mountain',
        from: 'Lucerne', to: 'Brienz', mode: 'rail', durationMin: 78, stay: 'Brienz — lakefront chalet inn',
        travel: 66, sleep: 235,
        extras: [{ label: 'Steamer crossing, first class bow', cost: 42 }],
        note: 'Arrive by water if you can. The woodcarvers’ street smells like a workshop should.',
      },
      {
        title: 'Over the Lötschberg',
        from: 'Brienz', to: 'Brig', mode: 'rail', durationMin: 132, stay: 'Brig — old-town Gasthof',
        travel: 88, sleep: 215,
        note: 'The old line, through the short tunnel, not the base tunnel. Views are the whole point.',
      },
      {
        title: 'The slow express',
        from: 'Brig', to: 'Chur', mode: 'rail', durationMin: 252, stay: 'Chur — arcaded old town rooms',
        travel: 142, sleep: 225,
        extras: [{ label: 'Panorama seat reservation', cost: 49 }],
        note: 'The “fastest slow train” takes its time over the Oberalp. Lunch service to your window.',
      },
      {
        title: 'Into Austria, gently',
        from: 'Chur', to: 'St. Anton', mode: 'rail', durationMin: 168, stay: 'St. Anton — family Haus, valley side',
        travel: 96, sleep: 245,
        note: 'The Arlberg line was engineering bravado in 1884 and still feels like it. Ears pop; spirits lift.',
      },
      {
        title: 'Down to the Inn',
        from: 'St. Anton', to: 'Innsbruck', mode: 'rail', durationMin: 68, stay: 'Innsbruck — Wilten quarter guesthouse',
        travel: 34, sleep: 195,
        extras: [{ label: 'Nordkette funicular, sunset slot', cost: 62 }],
        note: 'A city you can leave by cable car in twenty minutes. Do exactly that at golden hour.',
      },
      {
        title: 'Postcard, signed',
        from: 'Innsbruck', to: '—', mode: 'walk', durationMin: 0, stay: 'Departure — or add Salzburg; we know a schnitzel',
        travel: 0, sleep: 0,
        note: 'Morning in the old town, coffee under the arcades, airport bus out. Alps: confirmed.',
      },
    ],
  },
]

export const JOURNEY_BY_ID = new Map(JOURNEYS.map((j) => [j.id, j]))

/** Rough per-day “from” price for the card face (base tier), for two. */
export function journeyPerDay(j: Journey): number {
  const total = j.days.reduce((s, d) => s + d.travel + d.sleep + (d.extras ?? []).reduce((x, e) => x + e.cost, 0), 0)
  return Math.round((total + j.days.length * FEE_PER_DAY) / j.days.length / 5) * 5
}
