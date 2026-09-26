/**
 * Holloway Records — catalogue data.
 * Eight fictional releases from the fictional Sydney label. All artists,
 * lyrics, pressing numbers and liner notes are invented for this demo.
 */

export interface HTrack {
  id: string
  no: number
  title: string
  dur: number // seconds
  lyrics?: string[]
}

export type SleeveMode =
  | 'rings'
  | 'rays'
  | 'halftone'
  | 'wave'
  | 'bauhaus'
  | 'checker'
  | 'orbits'
  | 'bars'

export interface HAlbum {
  id: string
  cat: string
  title: string
  artist: string
  genre: string
  year: number
  bpm: number
  root: number // midi note the generative engine tunes to
  pressing: string
  palette: { bg: string; ink: string; accent: string }
  mode: SleeveMode
  liner: string
  cassNote: string
  tracks: HTrack[]
}

const t = (
  id: string,
  no: number,
  title: string,
  m: number,
  s: number,
  lyrics?: string[],
): HTrack => ({ id, no, title, dur: m * 60 + s, lyrics })

export const ALBUMS: HAlbum[] = [
  {
    id: 'coral-static',
    cat: 'HW-031',
    title: 'Coral Static',
    artist: 'Sable Coast',
    genre: 'Harbour soul',
    year: 2026,
    bpm: 96,
    root: 45,
    pressing: '350 copies · coral marble 12″',
    palette: { bg: '#f2e3cb', ink: '#2b1330', accent: '#f2543d' },
    mode: 'rings',
    liner:
      'Recorded over nine humid nights in a Marrickville warehouse with the roller door open. You can hear trains on two takes and nobody wanted to fix it. Coral Static is Sable Coast leaning harder into the groove and further from the polish — a record that sweats.',
    cassNote:
      'We signed Sable Coast in a front bar at 1am on a handshake. This is the record the handshake promised.',
    tracks: [
      t('cs-1', 1, 'Coral Static', 3, 42, [
        'Tuned the radio to the space between,',
        'found your voice in the coral static.',
        'Every wave that ever reached this town',
        'kept a little of the light on automatic.',
        'So hold the line, hold the line —',
        'the harbour hums in its own good time.',
        'We were only ever passing through the noise,',
        'learning how to keep a signal warm.',
      ]),
      t('cs-2', 2, 'Velvet Hour', 4, 5),
      t('cs-3', 3, 'Second Line in the Rain', 3, 18, [
        'Umbrellas down on King Street,',
        'the horn section doesn’t care.',
        'We march like the gutters are a parade route,',
        'brass notes hanging in the wet night air.',
        'Rain on the snare drum, keep it,',
        'rain on the setlist, keep it,',
        'if the city wants to join the band tonight —',
        'keep it, keep it, keep it.',
      ]),
      t('cs-4', 4, 'Basement Light', 5, 1),
      t('cs-5', 5, 'Pressed in Gold', 3, 33, [
        'They only made three hundred of us,',
        'numbered in pencil on the sleeve.',
        'Someday a stranger finds us in a milk crate',
        'and we play like nothing ever leaves.',
        'So press it in gold while the master’s warm,',
        'scratch our names in the run-out groove.',
        'Everything we couldn’t say out loud —',
        'the vinyl keeps the proof.',
      ]),
    ],
  },
  {
    id: 'salt-telecom',
    cat: 'HW-030',
    title: 'Salt Telecom',
    artist: 'Gull Weather',
    genre: 'Coastal post-punk',
    year: 2025,
    bpm: 134,
    root: 48,
    pressing: '300 copies · storm grey 12″',
    palette: { bg: '#16212b', ink: '#e8e0cd', accent: '#ff6b57' },
    mode: 'rays',
    liner:
      'Gull Weather wrote Salt Telecom in a coastal caravan park during a week of cancelled gigs and horizontal rain. It is their fastest, saltiest, most short-tempered record, mixed loud enough to feel the wind in it.',
    cassNote:
      'They sent a demo recorded on a phone in a stairwell. It was already finished, we just had to press it.',
    tracks: [
      t('st-1', 1, 'Dial Tone Gull', 2, 48),
      t('st-2', 2, 'Antenna Teeth', 3, 11),
      t('st-3', 3, 'Cliff Static', 2, 56),
      t('st-4', 4, 'Salt Telecom', 3, 27, [
        'Call me from the payphone at the headland,',
        'coins and salt inside the slot.',
        'The line is mostly weather now,',
        'but weather was the thing we’ve got.',
        'Say it twice, the gulls are thieves,',
        'say it loud, the tide receives —',
        'every message sent from this coastline',
        'arrives as what the wind believes.',
      ]),
    ],
  },
  {
    id: 'night-margins',
    cat: 'HW-029',
    title: 'Night Margins',
    artist: 'Meera Vale',
    genre: 'Ambient piano',
    year: 2025,
    bpm: 62,
    root: 41,
    pressing: '250 copies · aubergine 12″',
    palette: { bg: '#241a2e', ink: '#e7dcc8', accent: '#97a889' },
    mode: 'halftone',
    liner:
      'One piano, one room, two microphones, recorded between midnight and 4am across a single winter. Meera Vale wrote these pieces in the margins of other people’s deadlines; they play like the part of the day that finally belongs to you.',
    cassNote:
      'Some records you release. This one we just tried not to disturb.',
    tracks: [
      t('nm-1', 1, 'Margin I (For the Last Train)', 4, 38),
      t('nm-2', 2, 'Margin II (Kettle On)', 3, 52),
      t('nm-3', 3, 'Margin III (Porchlight)', 5, 14),
      t('nm-4', 4, 'Margin IV (Unsent)', 4, 21),
    ],
  },
  {
    id: 'bitumen-heart',
    cat: 'HW-028',
    title: 'Bitumen Heart',
    artist: 'The Hinterlands',
    genre: 'Jangle pop',
    year: 2025,
    bpm: 122,
    root: 43,
    pressing: '300 copies · bitumen black 12″',
    palette: { bg: '#e9d9b8', ink: '#1f2a24', accent: '#c8502e' },
    mode: 'checker',
    liner:
      'Four friends, one touring van, every servo pie between here and the border. Bitumen Heart is The Hinterlands’ love letter to the long drive — twelve-string guitars, harmonies stacked like luggage and choruses built for the last hour before home.',
    cassNote:
      'They practise in a shearers’ shed and it shows in the best way: nothing precious, everything sung.',
    tracks: [
      t('bh-1', 1, 'Overtake Me', 3, 8),
      t('bh-2', 2, 'Bitumen Heart', 3, 31, [
        'White line, gold light, quarter tank of courage,',
        'your name in the dust on the dash.',
        'Every kilometre’s a small apology',
        'for every time I came and went too fast.',
        'So meet me where the highway bends the river,',
        'where the road trains shake the scrub apart —',
        'I’ll be the one with both hands on the window,',
        'reading you my bitumen heart.',
      ]),
      t('bh-3', 3, 'Servo Flowers', 2, 57),
      t('bh-4', 4, 'Population Nine', 4, 2),
      t('bh-5', 5, 'Last Hour Before Home', 3, 44),
    ],
  },
  {
    id: 'understory',
    cat: 'HW-027',
    title: 'Understory',
    artist: 'Bracken & the Fox',
    genre: 'Mountain folk',
    year: 2024,
    bpm: 78,
    root: 50,
    pressing: '200 copies · fern green 10″',
    palette: { bg: '#22301f', ink: '#efe4c9', accent: '#e0a458' },
    mode: 'bauhaus',
    liner:
      'Recorded live around one microphone in a Blue Mountains kitchen, with the dog asleep on the rug and the kettle allowed to interrupt. Understory is folk music that trusts silence — banjo, pump organ and two voices that finish each other’s sentences.',
    cassNote:
      'First time I saw them, the power failed and they kept playing by torchlight. Easiest yes of my life.',
    tracks: [
      t('us-1', 1, 'Understory', 4, 12, [
        'Tall ones take the weather,',
        'we take what filters through —',
        'a little light, a little rain,',
        'a greener point of view.',
        'Grow where you’re planted,',
        'that’s what the old folk say.',
        'I was planted in your shadow, love,',
        'and I liked it fine that way.',
      ]),
      t('us-2', 2, 'Torchlight Set', 3, 33),
      t('us-3', 3, 'Dog on the Rug', 2, 51),
      t('us-4', 4, 'Kettle Interlude', 2, 19),
      t('us-5', 5, 'Greenest Point of View', 4, 47),
    ],
  },
  {
    id: 'late-transmission',
    cat: 'HW-026',
    title: 'Late Transmission',
    artist: 'October Radio',
    genre: 'Night-drive synth',
    year: 2024,
    bpm: 108,
    root: 46,
    pressing: '300 copies · midnight swirl 12″',
    palette: { bg: '#101820', ink: '#d7e3ea', accent: '#58a6b8' },
    mode: 'orbits',
    liner:
      'October Radio makes music for the drive home from the gig — analogue synths, drum machines with a limp and melodies that arrive like a station you can only pick up after 2am. Late Transmission was tracked entirely at night, by rule.',
    cassNote:
      'They insisted we credit the drum machine on the sleeve. We insisted harder. It’s on the sleeve.',
    tracks: [
      t('lt-1', 1, 'Late Transmission', 4, 26, [
        'After two the dial clears,',
        'after two the sky leans in.',
        'I am sending you a signal',
        'through the spaces in the din.',
        'If you catch it, keep it playing.',
        'If you don’t, I’ll send again.',
        'Every lonely late transmission',
        'finds a dashboard in the end.',
      ]),
      t('lt-2', 2, 'Dashboard Constellations', 3, 40),
      t('lt-3', 3, 'Analogue Lullaby', 4, 55),
      t('lt-4', 4, '2AM Station ID', 3, 17),
    ],
  },
  {
    id: 'kitchen-window',
    cat: 'HW-025',
    title: 'Kitchen Window',
    artist: 'Wren Lightsey',
    genre: 'Songwriter',
    year: 2024,
    bpm: 84,
    root: 52,
    pressing: '250 copies · buttermilk 12″',
    palette: { bg: '#efe0c9', ink: '#3a2a20', accent: '#d98e4a' },
    mode: 'wave',
    liner:
      'Wren Lightsey writes songs the way other people write shopping lists — constantly, and on the back of envelopes. Kitchen Window collects ten years of them, recorded solo in the house they were written in, faucets and floorboards included.',
    cassNote:
      'Wren played me forty songs on a Tuesday. We argued for a year about which ten. We were both right.',
    tracks: [
      t('kw-1', 1, 'Kitchen Window', 3, 24, [
        'The geranium survived the winter,',
        'the kettle’s learnt the neighbourhood.',
        'I write your name in window weather',
        'and wipe it off before it’s any good.',
        'There’s an hour of afternoon that lands here,',
        'square and patient as a plate —',
        'if you came by round about that hour,',
        'I’d have something on your plate.',
      ]),
      t('kw-2', 2, 'Back of Envelopes', 2, 58),
      t('kw-3', 3, 'Ten Years of Tuesdays', 3, 49),
      t('kw-4', 4, 'Floorboard Choir', 4, 8),
    ],
  },
  {
    id: 'moulded-gold',
    cat: 'HW-024',
    title: 'Moulded Gold',
    artist: 'Pelican Club',
    genre: 'Wharf disco',
    year: 2023,
    bpm: 112,
    root: 38,
    pressing: '400 copies · glitter gold 12″ · repress',
    palette: { bg: '#2b1330', ink: '#f2e3cb', accent: '#e9b84c' },
    mode: 'bars',
    liner:
      'Eight-piece disco from the wharf side of town — horns, handclaps, a rhythm section that has never once been early. Moulded Gold is Pelican Club’s second record and first repress: the initial run sold out in eleven days, mostly to people who saw them live once.',
    cassNote:
      'Their rider asks for a mirror ball and a mop. Both get used. That is the whole review.',
    tracks: [
      t('mg-1', 1, 'Moulded Gold', 3, 52, [
        'Sweep the wharf and strike the lanterns,',
        'tell the tide it’s welcome to the floor.',
        'We were moulded from the gold light',
        'that the harbour keeps in store.',
        'Clap — where the water answers,',
        'spin — where the gulls patrol.',
        'Tonight the city pays us back in full,',
        'in moulded, moulded gold.',
      ]),
      t('mg-2', 2, 'Eleven Days', 3, 35),
      t('mg-3', 3, 'Mirror Ball & Mop', 4, 14),
      t('mg-4', 4, 'Wharfside Strut', 3, 26),
    ],
  },
]

export interface TrackRef {
  album: HAlbum
  track: HTrack
  albumIndex: number
  trackIndex: number
}

const index: Record<string, TrackRef> = {}
ALBUMS.forEach((album, albumIndex) => {
  album.tracks.forEach((track, trackIndex) => {
    index[track.id] = { album, track, albumIndex, trackIndex }
  })
})

/** Look up a track + its album by track id. */
export function lookup(id: string): TrackRef | null {
  return index[id] ?? null
}

export const FEATURED = ALBUMS[0]

export function albumDuration(album: HAlbum): number {
  return album.tracks.reduce((n, tr) => n + tr.dur, 0)
}

export function fmtTime(sec: number): string {
  const s = Math.max(0, Math.round(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Stable 32-bit hash for seeds. */
export function hashStr(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Deterministic PRNG for sleeve art and waveforms. */
export function mulberry(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let z = Math.imul(a ^ (a >>> 15), 1 | a)
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic waveform bar heights (0..1) for a track. */
export function waveBars(trackId: string, count: number): number[] {
  const rnd = mulberry(hashStr(trackId))
  const bars: number[] = []
  let prev = 0.5
  for (let i = 0; i < count; i++) {
    // smoothed random walk so neighbouring bars feel musical
    prev = Math.min(1, Math.max(0.12, prev + (rnd() - 0.48) * 0.42))
    bars.push(prev)
  }
  return bars
}
