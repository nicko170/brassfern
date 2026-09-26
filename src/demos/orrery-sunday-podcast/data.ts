/**
 * Orrery Sunday — show data. Twenty-eight fictional episodes of a weekly
 * podcast about systems, maps and the people who draw them. Chapter
 * timestamps are partitioned deterministically from the episode number so
 * server and client always agree, and no audio ever exists — playback is a
 * silent simulation.
 */

export type SeriesId = 'cartography' | 'clockwork' | 'networks' | 'weather' | 'borders'

export interface Series {
  id: SeriesId
  name: string
  note: string
}

export const SERIES: Series[] = [
  { id: 'cartography', name: 'Lines on paper', note: 'Cartography' },
  { id: 'clockwork', name: 'Keeping time', note: 'Clockwork' },
  { id: 'networks', name: 'Grids & routes', note: 'Networks' },
  { id: 'weather', name: 'Reading the sky', note: 'Weather' },
  { id: 'borders', name: 'Argued lines', note: 'Borders' },
]

export interface Chapter {
  t: number
  label: string
}

export interface Episode {
  id: string
  n: number
  title: string
  dek: string
  date: string // ISO
  duration: number // seconds
  series: SeriesId
  guest: string
  chapters: Chapter[]
}

/* ------------------------------------------------------------ helpers */

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Partition a duration into `count` chapter starts with seeded jitter. */
function chapterTimes(seedNum: number, count: number, duration: number): number[] {
  const rng = mulberry32(seedNum * 7919 + 13)
  const out: number[] = [0]
  for (let i = 1; i < count; i++) {
    const base = (duration * i) / count
    const jitter = (rng() - 0.5) * (duration / count) * 0.42
    let t = Math.round(base + jitter)
    t = Math.max(t, out[i - 1] + 120)
    out.push(Math.min(t, duration - 90))
  }
  return out
}

/* ------------------------------------------------------------ episodes */

interface RawEpisode {
  n: number
  title: string
  dek: string
  date: string
  duration: number
  series: SeriesId
  guest: string
  chapterLabels: string[]
}

const RAW: RawEpisode[] = [
  {
    n: 41,
    title: 'The leap second retires',
    dek: "The world's clocks are about to stop hiccupping. A fifty-year campaign to retire the leap second — and the keepers of the second who will quietly miss it.",
    date: '2026-09-20',
    duration: 3480,
    series: 'clockwork',
    guest: 'Dr. Roland Eng, timekeeper',
    chapterLabels: [
      'Cold open: a second goes missing',
      'What the Earth keeps doing wrong',
      'Smear, soak, or step',
      'The conference where it nearly died',
      '2035, and after',
      'Sign-off',
    ],
  },
  {
    n: 40,
    title: "The address that isn't there",
    dek: "Half the world lives somewhere the mail can't parse. How informal settlements get addressed — and who gets to name a street.",
    date: '2026-09-13',
    duration: 2840,
    series: 'networks',
    guest: 'Priya Chattopadhyay, addressing specialist',
    chapterLabels: [
      'Cold open: the house behind the blue tank',
      'Why addresses are infrastructure',
      'Landmarks as grammar',
      'The startup with three words',
      'Consent and naming',
      'Postscript',
    ],
  },
  {
    n: 39,
    title: 'Reading the sky without instruments',
    dek: 'Long before barometers, navigators read swells like sentences. The wayfinding traditions that treat the ocean as a map you feel.',
    date: '2026-09-06',
    duration: 2650,
    series: 'weather',
    guest: 'Keahi Marama, wayfinder',
    chapterLabels: [
      'Cold open: the swell pattern at dawn',
      'The star compass',
      'What a wave remembers',
      'Teaching the body to notice',
      'Instruments, after all',
      'Sign-off',
    ],
  },
  {
    n: 38,
    title: 'Projections pick a fight',
    dek: 'Every flat map is a compromise wearing a costume. Mercator, Peters, and the quiet politics of how you unfold a globe.',
    date: '2026-08-30',
    duration: 3100,
    series: 'cartography',
    guest: 'Dmitri Sorokin, projection scholar',
    chapterLabels: [
      'Cold open: the classroom wall',
      'The Mercator defence',
      'Peters and the backlash',
      'Interrupted oranges',
      'The projection we actually need',
      'Sign-off',
    ],
  },
  {
    n: 37,
    title: 'The border in the sand',
    dek: 'Some boundaries are drawn through deserts that refuse to sit still. Surveying a line when the landscape itself keeps moving.',
    date: '2026-08-23',
    duration: 2550,
    series: 'borders',
    guest: 'Laila Haddad, dune geomorphologist',
    chapterLabels: [
      'Cold open: a cairn under a dune',
      'Straight lines, restless ground',
      'The geometry of wandering',
      'Treaties with metres of slack',
      'Who maintains a border',
      'Sign-off',
    ],
  },
  {
    n: 36,
    title: 'Standard time, erected',
    dek: 'In 1883 the railroads simply announced what time it was. How noon became a network decision instead of a solar fact.',
    date: '2026-08-16',
    duration: 2990,
    series: 'clockwork',
    guest: 'Gordon Pryce, railway archivist',
    chapterLabels: [
      'Cold open: seventy-five noons in one city',
      'The companies take the clock',
      'The day of two noons',
      'Holdouts and time riots',
      'What the left-behind towns did',
      'Sign-off',
    ],
  },
  {
    n: 35,
    title: 'The ship that reported the storm',
    dek: 'For decades, lonely ships held fixed positions at sea so the weather maps on land would work. Life aboard an ocean weather station.',
    date: '2026-08-09',
    duration: 2760,
    series: 'weather',
    guest: 'Bram Iversen, former weather-ship radio officer',
    chapterLabels: [
      'Cold open: station kilo, forty days',
      'Why a ship, not a buoy',
      'The rhythm of the radiosonde',
      'One storm, properly measured',
      'Satellites take the watch',
      'Sign-off',
    ],
  },
  {
    n: 34,
    title: 'Where the cables land',
    dek: 'The internet has a shoreline. We trace the submarine cables to the unglamorous beach huts where continents plug into each other.',
    date: '2026-08-02',
    duration: 3210,
    series: 'networks',
    guest: 'Tessa Quill, marine cable engineer',
    chapterLabels: [
      'Cold open: the hut at low tide',
      'A nerve made of glass and tar',
      'Landing politics',
      'The map nobody publishes',
      'What a ship can break',
      'Sign-off',
    ],
  },
  {
    n: 33,
    title: 'Six hundred scales of home',
    dek: 'We asked listeners to draw their neighbourhoods from memory. Six hundred maps arrived, and not one matched the survey.',
    date: '2026-07-26',
    duration: 2360,
    series: 'cartography',
    guest: 'Ofelia Ruiz, community mapper',
    chapterLabels: [
      'Cold open: the callout',
      'What everyone exaggerates',
      'The street that exists only at school pickup',
      'Drawn landmarks, real data',
      'What the survey missed',
      'Sign-off',
    ],
  },
  {
    n: 32,
    title: 'The parallel that took a detour',
    dek: "The 49th parallel is famously straight — except where it isn't. Astronomical errors, stubborn surveyors, and a notch nobody fixed.",
    date: '2026-07-19',
    duration: 2740,
    series: 'borders',
    guest: 'Maeve Tallis, survey historian',
    chapterLabels: [
      'Cold open: the notch',
      'Instruments and weather',
      'Deciding an error is official',
      'The people living on the mistake',
      'Fix it or frame it',
      'Sign-off',
    ],
  },
  {
    n: 31,
    title: 'Faith in the glass',
    dek: "Robert FitzRoy's barometers turned shipwreck statistics into the first public forecast — and the word 'forecast' itself.",
    date: '2026-07-12',
    duration: 2890,
    series: 'weather',
    guest: 'Dr. Rowan Beck, storm historian',
    chapterLabels: [
      'Cold open: the Royal Charter storm',
      'A network of observers, by telegraph',
      'Cones on the coast',
      'The forecast fights back',
      "FitzRoy's last barometer",
      'Sign-off',
    ],
  },
  {
    n: 30,
    title: 'Ten hours, ten decades',
    dek: 'Revolutionary France tried to decimalise the day: ten hours, a hundred minutes each. Why the calendar lasted years and the clocks barely one.',
    date: '2026-07-05',
    duration: 2580,
    series: 'clockwork',
    guest: 'Lucien Fabre, watchmaker',
    chapterLabels: [
      'Cold open: a ten-hour pocket watch',
      'The case for base ten',
      'The calendar that did stick',
      'Who actually used decimal time',
      'Metric Mars',
      'Sign-off',
    ],
  },
  {
    n: 29,
    title: 'The last mile is a person',
    dek: "Every logistics network ends in a human being with a trolley and thirty seconds to decide. The unmapped skill inside 'last mile' delivery.",
    date: '2026-06-28',
    duration: 2490,
    series: 'networks',
    guest: 'Jessie Ngata, courier co-op founder',
    chapterLabels: [
      'Cold open: the thirty seconds',
      'Routes are suggestions',
      "The knowledge that isn't in the app",
      'Co-op maths',
      'What customers never see',
      'Sign-off',
    ],
  },
  {
    n: 28,
    title: 'A field inside a field inside a field',
    dek: "For seventy years the world's most complicated border hosted enclaves within counter-enclaves. How people farmed, voted, and finally swapped maps.",
    date: '2026-06-21',
    duration: 3010,
    series: 'borders',
    guest: 'Oskar Lindt, border correspondent',
    chapterLabels: [
      'Cold open: the third-order enclave',
      'How a treaty made a jigsaw',
      'Passports for a cabbage field',
      'The land-swap summer',
      'What remained tangled',
      'Sign-off',
    ],
  },
  {
    n: 27,
    title: 'Learning to draw mountains',
    dek: 'Caterpillars of hachures, hairline contours, candlelit relief. The centuries-long argument over how ink should stand in for altitude.',
    date: '2026-06-14',
    duration: 2690,
    series: 'cartography',
    guest: 'Saoirse Bianchi, relief artist',
    chapterLabels: [
      'Cold open: the molehill problem',
      'Hachure wars',
      'The contour arrives late',
      'Shading by candlelight',
      'Relief in the age of lidar',
      'Sign-off',
    ],
  },
  {
    n: 26,
    title: 'Naming the clouds',
    dek: 'In 1802 a young pharmacist gave the sky a Latin grammar. How Luke Howard\u2019s cloud names changed painting, poetry and forecasting.',
    date: '2026-06-07',
    duration: 2300,
    series: 'weather',
    guest: 'Mina Alcott, writer and cloudkeeper',
    chapterLabels: [
      'Cold open: the lecture at Plough Court',
      'Cirrus, cumulus, stratus',
      'Goethe writes fan mail',
      'What names let you notice',
      'The atlas today',
      'Sign-off',
    ],
  },
  {
    n: 25,
    title: "The star-keeper's day",
    dek: 'Astronomers keep a day that drifts four minutes against yours. Sidereal time, and the observatories that ran on the schedule of stars.',
    date: '2026-05-31',
    duration: 2440,
    series: 'clockwork',
    guest: 'Dr. Yusuf Adeyemi, astronomer',
    chapterLabels: [
      'Cold open: the clock on the dome wall',
      'Four minutes a day',
      'Transit telescopes and true noon',
      'When the observatory phoned the railway',
      'Stars for wifi',
      'Sign-off',
    ],
  },
  {
    n: 24,
    title: 'Switchboard',
    dek: 'Before algorithms routed calls, women did — at ten connections a minute. The switchboard as the first routing layer of the modern network.',
    date: '2026-05-24',
    duration: 2870,
    series: 'networks',
    guest: 'Nadine Corrigan, oral historian',
    chapterLabels: [
      'Cold open: the cord board at full tilt',
      'The girls who became the network',
      'Etiquette as protocol',
      'The strike that automated us',
      'What pattern-matching lost',
      'Sign-off',
    ],
  },
  {
    n: 23,
    title: 'The corner nobody agrees on',
    dek: 'Four countries, one point — in theory. The geometry and diplomacy of quadripoints, and why the map rarely survives contact with the ground.',
    date: '2026-05-17',
    duration: 2530,
    series: 'borders',
    guest: 'Hilde Renner, geodetic surveyor',
    chapterLabels: [
      'Cold open: standing in four countries, allegedly',
      'The maths of a meeting point',
      'Rivers ruin everything',
      'Monuments as arguments',
      'Is there a true quadripoint',
      'Sign-off',
    ],
  },
  {
    n: 22,
    title: 'Blank spots, politely filled',
    dek: 'When mapmakers ran out of information, they invented. The Mountains of Kong, the interior sea, and other confident fictions that lasted decades.',
    date: '2026-05-10',
    duration: 2700,
    series: 'cartography',
    guest: 'Ambrose Teal, rare-maps dealer',
    chapterLabels: [
      'Cold open: the mountains that weren\u2019t there',
      'Nature abhors a blank',
      'The economics of invention',
      'Correcting a lie in print',
      'Modern blanks',
      'Sign-off',
    ],
  },
  {
    n: 21,
    title: 'Pneumatic post',
    dek: 'For a century, cities moved paper through tubes at forty kilometres an hour. The rise and graceful retirement of the pneumatic network.',
    date: '2026-05-03',
    duration: 2620,
    series: 'networks',
    guest: 'Colette Vannier, systems engineer',
    chapterLabels: [
      'Cold open: the canister arrives',
      'A cubic metre of city',
      'The operators of pressure',
      'Why it almost scaled',
      'Tubes that remain',
      'Sign-off',
    ],
  },
  {
    n: 20,
    title: 'A barometer in every port',
    dek: 'Before satellites, the forecast began with a thousand volunteers reading glass tubes at the same hour. The first weather network, kept by hand.',
    date: '2026-04-26',
    duration: 2790,
    series: 'weather',
    guest: 'Jude Ferreira, marine librarian',
    chapterLabels: [
      'Cold open: the logbook shelf',
      'Synchronising the ports',
      'The telegraph changes the deadline',
      'Women of the signal service',
      'Handing the sky to machines',
      'Sign-off',
    ],
  },
  {
    n: 19,
    title: 'Seven days, no reason',
    dek: "The week matches no orbit and survives every revolution. A history of the calendar's strangest unit — and the attempts to kill it.",
    date: '2026-04-19',
    duration: 2460,
    series: 'clockwork',
    guest: 'Emeka Obi, historian',
    chapterLabels: [
      'Cold open: the blank week',
      'Planets, gods, and market days',
      'The Soviets try five',
      'The French try ten',
      'Why seven wins',
      'Sign-off',
    ],
  },
  {
    n: 18,
    title: 'The island that wasn\u2019t',
    dek: 'Sandy Island sat on maps and satellite-era databases — until a research ship sailed straight through it. The afterlife of phantom geography.',
    date: '2026-04-12',
    duration: 2660,
    series: 'cartography',
    guest: 'Petra Lindqvist, ocean archivist',
    chapterLabels: [
      'Cold open: sailing through an island',
      'Penguins and other witnesses',
      'How errors reproduce',
      'The undiscovery',
      'Copyright traps and other ghosts',
      'Sign-off',
    ],
  },
  {
    n: 17,
    title: 'The line the river moved',
    dek: 'When a river jumps its bed, the border must decide what it is: the water, or the line on the deed.',
    date: '2026-04-05',
    duration: 3120,
    series: 'borders',
    guest: 'Salomé Usher, river lawyer',
    chapterLabels: [
      'Cold open: the farm that changed countries',
      'Accretion vs avulsion',
      'Surveying water',
      'The treaty phrase doing the work',
      'Climate quickens the rivers',
      'Sign-off',
    ],
  },
  {
    n: 16,
    title: 'The geometry of a bus route',
    dek: 'Straighter is not always better. The trade-offs hiding inside every bus map — coverage against speed, grid against demand.',
    date: '2026-03-29',
    duration: 2920,
    series: 'networks',
    guest: 'Rufus Hale, transit planner',
    chapterLabels: [
      'Cold open: the 22 and its critics',
      'Maximum walk, minimum wait',
      'The ridership recipe',
      'Grids, and when to break them',
      'Redrawing a city live',
      'Sign-off',
    ],
  },
  {
    n: 15,
    title: 'Megaprojects of ink',
    dek: 'National atlases were the moonshots of print: decades, ministries, and millions of entries. What it took to bind a country into a book.',
    date: '2026-03-22',
    duration: 2770,
    series: 'cartography',
    guest: 'Ingrid Maalouf, atlas editor',
    chapterLabels: [
      'Cold open: the atlas room',
      'A census of everything',
      'Arguments over shade',
      'The update problem',
      'The atlas after the database',
      'Sign-off',
    ],
  },
  {
    n: 14,
    title: 'Mean time, and other polite fictions',
    dek: 'The second on your phone is an average wrapped in a correction wrapped in a vote. A gentle tour through mean time and the true sun it ignores.',
    date: '2026-03-15',
    duration: 2390,
    series: 'clockwork',
    guest: 'Dr. Ada Ostrander, horologist',
    chapterLabels: [
      'Cold open: the sundial is wrong',
      'Apparent vs mean',
      'The equation of time, tabled',
      'Who needed averages',
      'Living slightly off',
      'Sign-off',
    ],
  },
]

/** Newest first. Chapter timestamps are deterministic per episode number. */
export const EPISODES: Episode[] = RAW.map((r) => {
  const times = chapterTimes(r.n, r.chapterLabels.length, r.duration)
  return {
    id: `ep-${r.n}`,
    n: r.n,
    title: r.title,
    dek: r.dek,
    date: r.date,
    duration: r.duration,
    series: r.series,
    guest: r.guest,
    chapters: r.chapterLabels.map((label, i) => ({ t: times[i] ?? 0, label })),
  }
})

/* ------------------------------------------------------------- lookups */

export const epCode = (n: number): string => `EP\u2009${String(n).padStart(3, '0')}`

export const seriesOf = (id: SeriesId): Series =>
  SERIES.find((s) => s.id === id) ?? SERIES[0]

export const nextOlder = (ep: Episode): Episode | undefined =>
  EPISODES.find((e) => e.n === ep.n - 1)

export const fmtClock = (s: number): string => {
  const v = Math.max(0, Math.round(s))
  const h = Math.floor(v / 3600)
  const m = Math.floor((v % 3600) / 60)
  const sec = v % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`
}

export const fmtDur = (s: number): string => `${Math.round(s / 60)}\u2009min`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const fmtDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[(m ?? 1) - 1] ?? ''} ${y}`
}

export const RATES = [1, 1.25, 1.5, 1.75, 2]

/** Seeded waveform bars (0–1), gently smoothed, with talk-pause valleys. */
export function barsFor(seedNum: number, count: number): number[] {
  const rng = mulberry32(seedNum * 2654435761 + 97)
  const out: number[] = []
  let prev = 0.55
  for (let i = 0; i < count; i++) {
    let v = 0.18 + 0.82 * (prev * 0.55 + rng() * 0.45)
    if (rng() < 0.07) v *= 0.24 // breath / pause
    out.push(Math.min(1, v))
    prev = v
  }
  return out
}

/* ---------------------------------------------------------- start here */

export interface PathStop {
  epN: number
  why: string
}

export const START_HERE: PathStop[] = [
  {
    epN: 17,
    why: 'The episode regulars send to friends. A border dispute that turns out to be about a river\u2019s personality.',
  },
  {
    epN: 16,
    why: 'Our most-argued-about thesis: the wiggly bus might be the good bus.',
  },
  {
    epN: 34,
    why: 'The internet, traced to an unmarked hut above the tide line. Recorded on location.',
  },
  {
    epN: 41,
    why: 'The newest — clocks, diplomacy, and a retirement party for a second.',
  },
]

export const episodeByN = (n: number): Episode | undefined =>
  EPISODES.find((e) => e.n === n)

/* ---------------------------------------------------------------- hosts */

export interface Host {
  name: string
  role: string
  bio: string
  seed: number
}

export const HOSTS: Host[] = [
  {
    name: 'Maren Voss',
    role: 'Host & cartographer',
    bio: 'Six years drawing tidal charts for harbours she has never visited. Believes most arguments are, at bottom, about a map.',
    seed: 7,
  },
  {
    name: 'Théo Larkin',
    role: 'Host & systems writer',
    bio: 'Covers tills, timetables and term sheets. Owns four hundred index cards and one follow-up question.',
    seed: 23,
  },
]

/* -------------------------------------------------------------- reviews */

export interface Review {
  quote: string
  name: string
  place: string
  stars: number
}

export const REVIEWS: Review[] = [
  {
    quote: 'I came for the maps and stayed for the lawsuits about rivers. The chaptered notes alone ruin other podcasts for me.',
    name: 'Noor A.',
    place: 'Muscat',
    stars: 5,
  },
  {
    quote: 'The rare show that treats a bus route with the gravity of a moon landing. Correctly.',
    name: 'Felix D.',
    place: 'Utrecht',
    stars: 5,
  },
  {
    quote: 'Maren and Théo argue about projections like other people argue about sport. I have opinions about Peters now.',
    name: 'Wren C.',
    place: 'Hobart',
    stars: 5,
  },
  {
    quote: 'Beautifully produced, quietly funny, and the show notes are a bibliography I actually use.',
    name: 'Idris K.',
    place: 'Lagos',
    stars: 5,
  },
  {
    quote: 'Episode 18 made my kid check whether islands are real. Five stars.',
    name: 'Marisol T.',
    place: 'Valparaíso',
    stars: 5,
  },
  {
    quote: 'Occasionally too delighted with itself. Then it explains leap seconds and I forgive everything.',
    name: 'Bea H.',
    place: 'Glasgow',
    stars: 4,
  },
]

export const PLATFORMS = ['Apple Podcasts', 'Spotify', 'Overcast', 'Pocket Casts', 'AntennaPod', 'RSS feed']
