/**
 * Postcards Archive — data & catalogue engine.
 * 120 fictional postcards from the Corrowong Museums Trust, generatively
 * catalogued: seeded scenes, stamps, postmarks, senders, messages and replies.
 * Deterministic from a seed so the "collection" is stable across visits.
 */

export type ThemeId =
  | 'main-street'
  | 'railway'
  | 'river'
  | 'wool'
  | 'hotel'
  | 'show'
  | 'school'
  | 'mail'

export type StampMotif = 'sprig' | 'kanga' | 'wattle' | 'sun' | 'star'

export interface StampDef {
  value: string
  hue: string
  motif: StampMotif
  label: string
}

export interface Postcard {
  id: string
  seq: number
  accession: string
  title: string
  year: number
  month: string
  day: number
  decade: string
  town: string
  to: string
  theme: ThemeId
  sender: string
  recipient: string
  message: string
  reply: string | null
  stamp: StampDef
  tint: 0 | 1 | 2
  seed: number
  condition: string
}

export interface Filters {
  decades: string[]
  towns: string[]
  themes: ThemeId[]
  reply: boolean
}

export const EMPTY_FILTERS: Filters = { decades: [], towns: [], themes: [], reply: false }

/* ---------------- deterministic RNG ---------------- */

export function mulberry32(a: number): () => number {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(r: () => number, arr: readonly T[]): T {
  return arr[Math.floor(r() * arr.length)]
}

/* ---------------- vocab ---------------- */

export const TOWNS = [
  'Corrowong',
  'Elderslie',
  'Weerumba',
  'Dangle Creek',
  'Tinpot Junction',
  'Mount Kestrel',
  'Looby’s Bridge',
  'Narrabil',
] as const

const DESTS: readonly string[] = [...TOWNS, 'Sydney', 'Melbourne', 'Hayward’s Flat']

export const DECADES = [
  { id: '1900s', label: '1900–09', count: 14 },
  { id: '1910s', label: '1910–19', count: 16 },
  { id: '1920s', label: '1920–29', count: 15 },
  { id: '1930s', label: '1930–39', count: 12 },
  { id: '1940s', label: '1940–49', count: 13 },
  { id: '1950s', label: '1950–59', count: 13 },
  { id: '1960s', label: '1960–69', count: 11 },
  { id: '1970s', label: '1970–79', count: 9 },
  { id: '1980s', label: '1980–89', count: 9 },
  { id: '1990s', label: '1990–94', count: 8 },
] as const

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'main-street', label: 'Main streets' },
  { id: 'railway', label: 'The railway' },
  { id: 'river', label: 'The river' },
  { id: 'wool', label: 'Wool & harvest' },
  { id: 'hotel', label: 'Hotels & pubs' },
  { id: 'show', label: 'Show days' },
  { id: 'school', label: 'School days' },
  { id: 'mail', label: 'The home front' },
]

export const THEME_LABEL: Record<ThemeId, string> = Object.fromEntries(
  THEMES.map((t) => [t.id, t.label]),
) as Record<ThemeId, string>

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const STAMPS: { until: number; stamp: StampDef }[] = [
  { until: 1913, stamp: { value: '1d', hue: '#9c3a28', motif: 'sprig', label: 'State issue, one penny' } },
  { until: 1930, stamp: { value: '1½d', hue: '#7d4a2c', motif: 'kanga', label: 'Kangaroo and map, penny-halfpenny' } },
  { until: 1945, stamp: { value: '2d', hue: '#4a6138', motif: 'wattle', label: 'Wattle, two pence' } },
  { until: 1965, stamp: { value: '3d', hue: '#3f5570', motif: 'sun', label: 'Pastoral, three pence' } },
  { until: 1978, stamp: { value: '5c', hue: '#a5642f', motif: 'sprig', label: 'Decimal definitive, five cents' } },
  { until: 1999, stamp: { value: '24c', hue: '#3d5c57', motif: 'star', label: 'Decimal definitive, twenty-four cents' } },
]

const CONDITIONS = ['Fine', 'Good', 'Good', 'Worn at edges', 'Corner crease', 'Fragile — gloves only']

const FIRST_EARLY = ['Ethel', 'Dot', 'Stan', 'Alf', 'Beryl', 'Hilda', 'Cecil', 'Vera', 'Maud', 'Reg', 'Ivy', 'Percy', 'Edna', 'Clarrie', 'Lorna', 'Clem']
const FIRST_MID = ['Joyce', 'Ron', 'Shirley', 'Doug', 'Val', 'Keith', 'Mavis', 'Colin', 'Dawn', 'Lionel', 'Betty', 'Norm', 'Phyllis', 'Alma', 'Gordon', 'Nance']
const FIRST_LATE = ['Kim', 'Sharon', 'Greg', 'Kylie', 'Darren', 'Tracey', 'Craig', 'Jenny', 'Wayne', 'Leanne', 'Paul', 'Maree']

const SURNAMES = ['McAlister', 'Bracken', 'Teasdale', 'O’Rourke', 'Fendall', 'Curnow', 'Petty', 'Doolan', 'Wren', 'Shearwood', 'Blight', 'Quilliam', 'Tannock', 'Greville', 'Mulholland', 'Papadakis', 'Costello', 'Fisher', 'Huntly', 'Marsh']

const RELATIONS = ['sister', 'brother', 'cousin', 'niece', 'aunt', 'old chum']

const TITLES: Record<ThemeId, string[]> = {
  'main-street': ['Main street looking east', 'Main street on a Saturday', 'The co-op corner', 'Main street after rain', 'Outside the post office'],
  railway: ['The 4:10 at the platform', 'The station yard, winter', 'The junction at dusk', 'Goods shed and scullion', 'The last carriage out'],
  river: ['The crossing at Looby’s', 'The river in flood', 'Below the weir', 'The punt at first light', 'Willows on the far bank'],
  wool: ['Shearing shed, forty stand', 'Wool bales on the siding', 'The bore drain at sunset', 'Yards full, June', 'The ram paddock'],
  hotel: ['The Royal, balcony intact', 'Corner door, Friday', 'The Terminus before the fire', 'The Railway Hotel, flood year'],
  show: ['Judging the merinos', 'The grand parade, noon', 'Side-show alley', 'The pavilion, entries closed'],
  school: ['Play time at the little school', 'The new roof, almost', 'Arbor day planting', 'The shelter shed debate'],
  mail: ['The letter that took the boat', 'Small writing, brave corners', 'The telegraph office, busy week', 'Waiting on the mail coach'],
}

const EVENTS: Record<ThemeId, string[]> = {
  'main-street': [
    'The new co-op opened with flags out and a queue clean past the bakery',
    'Three motor cars outside Dent’s now — the horse trough looks lonely',
    'McAlister’s window has silk stockings the colour of watermelon rind',
    'They are kerbing the gutter, so half the street is barricaded with rocks',
    'The picture show let out into the rain and nobody minded at all',
    'The baker’s boy races the railway shunter every morning and usually wins',
    'A circus bill went up over the bank’s notice — the manager is not amused',
    'Saturday the street was that full you could smell the horses over the pies',
    'Someone painted the post box blue and the whole town has an opinion',
  ],
  railway: [
    'The 4:10 waited for the mail again; the guard pretends it’s in the timetable',
    'They have relaid the loop past Dangle Creek, smooth as a kitchen table now',
    'New porter at the junction can whistle two tunes at once, both religious',
    'Your trunk went to Narrabil by mistake but fame followed it back',
    'The goods shed roof came off in the blow and landed polite on the paddock',
    'Railway Institute ball next month — the band from Weerumba is engaged',
    'I waved from the last carriage like you taught me, even at nobody',
    'Coal strike talk again; the men play cards in the shade of the wagons',
    'They say the line will never close. They say a lot of things down here',
  ],
  river: [
    'The river is up over the lower flats and the eels are in the orchard',
    'Cod biting below the bridge if you can sit still longer than a fence post',
    'The punt sank at Looby’s on Tuesday; they raised her Sunday, everyone watching',
    'Willows are out and the crossing looks like a picture in a magazine',
    'Your father caught a turtle and talked to it all the way home',
    'The weir pool is warm as tea. The children live in it entirely',
    'Flood mail came by boat and the postmaster looked like an admiral',
    'A platypus lives under the far bank. Tell no one. Too late',
  ],
  wool: [
    'Shearing starts Monday — forty stand, and the cook has already resigned twice',
    'The wool cheque is the best since before the war, so the roof gets iron',
    'Burrs are something shocking; the sheep look like walking teasels',
    'The ram jumped the yard and walked the ramp like a councillor on inspection',
    'Rain at exactly the right hour. Even the dogs look smug',
    'The bales went off on the goods train smelling of lanolin and luck',
    'Lambing is heavy this year; I have two in a box by the stove',
    'Prices are down, spirits perversely up. That is wool for you',
    'We tarred the swellings and the fly trouble is over, mostly',
  ],
  hotel: [
    'The Royal has changed hands again; the new missus paints everything cream',
    'They have put a wireless in the front bar and the moths listen outside',
    'The balcony came down in the storm with nobody on it, mercifully',
    'Ma still saves the good glasses for the magistrate, who has died',
    'The Terminus door blew open in the blow and the weather checked in',
    'The beer garden got a fernery last year and a reputation this year',
    'Closing time is nine sharp now, and the town walks home like a choir',
    'The cook’s pudding made a shearer weep with his whole face',
  ],
  show: [
    'Dad took first for the merino ram and has not stopped wearing the ribbon',
    'The merry-go-round broke down with Edna on it and she refused rescue',
    'Judging was crook this year — everyone says so except the judge',
    'The cake competition ended in a formal inquiry over a sponge',
    'Side-show alley took my sixpence and gave me a plaster kookaburra',
    'The grand parade marched past twice because no one told the band to stop',
    'I entered the chutney under an assumed name and came second to myself',
    'The pavilion roof rang all day with rain, and dancing regardless',
  ],
  school: [
    'Taught forty-one scholars today with the fire out and my voice intact',
    'The new roof leaks in only two places now, neither over my desk',
    'Arbor day: we planted twelve silky oaks and one improved attitude',
    'Your old desk is third row still, and someone has carved a whale in it',
    'The inspector called and the whole school sang beautifully on purpose',
    'A goanna attended scripture by way of the chimney and was excused',
    'We won the banner drill. The banner has been to the pub twice since',
    'The picnic races fund stands at three pounds, my patience somewhat less',
  ],
  mail: [
    'Your letter took the long boat but arrived with its corners brave',
    'The censor left us half a sentence, and it was the half we needed',
    'Everybody knits. Even the rector. Badly, but he knits',
    'The fruitcake went out Tuesday wrapped in three socks and a hymn',
    'We heard the coast station signals like weather from another life',
    'Your Aunt sends the magazines with the recipes cut out, as is tradition',
    'The honour board has a new name, and the whole street went quiet at tea',
    'The writing fits a lot if you write small and brave',
  ],
}

const OPENERS = ['Dear {r},', 'My dear {r},', 'Dear old {r},', '{r} —']
const MIDS = ['Anyway,', 'You will laugh, but', 'Between you and me,', 'Don’t repeat this,', 'For the record,']
const LOWERS = [
  'All well here.',
  'The dogs ask after you.',
  'Mother sends her love and most of her opinions.',
  'We think of you at milking time.',
  'Nothing here changes except everything.',
]
const CLOSERS = [
  'Write soon.',
  'Keep this one, it’s the good one.',
  'Don’t wait as long as I did.',
  'Come home when the rains come.',
  'Fold it small and carry it.',
]
const SIGNS = [
  'Yrs aff., {s}',
  'Ever yours, {s}',
  'Your {rel}, {s}',
  'Your old cobber, {s}',
  'With love from all at {town}, {s}',
]

const REPLY_OPENERS = [
  'Your card to hand,',
  'Yours arrived with the Tuesday mail,',
  'The postmistress praised your hand, and then',
]

const REPLY_MIDS = [
  'we read it aloud at tea until the pot went cold',
  'Mother kept the stamp and I kept the news',
  'the whole kitchen wanted the ending twice',
  'Alf missed the good part, so we began again',
]

const REPLY_CLOSE = [
  'All the same here, only more so.',
  'Come for the show, if you can stand the excitement.',
  'I have written small so you get your two bob’s worth.',
  'The river is behaving. You should too.',
]

function fill(t: string, vars: Record<string, string>): string {
  return t.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')
}

/* ---------------- catalogue construction ---------------- */

function themeForDecade(decadeIdx: number, r: () => number): ThemeId {
  const w: [ThemeId, number][] = [
    ['main-street', 3],
    ['railway', decadeIdx <= 3 ? 3.2 : decadeIdx <= 6 ? 1.6 : 0.8],
    ['river', 1.9],
    ['wool', 2.4],
    ['hotel', decadeIdx <= 5 ? 1.7 : 0.7],
    ['show', 1.4],
    ['school', decadeIdx >= 1 && decadeIdx <= 6 ? 1.5 : 0.7],
    ['mail', decadeIdx === 1 || decadeIdx === 4 ? 1.7 : 0.25],
  ]
  const total = w.reduce((s, [, x]) => s + x, 0)
  let roll = r() * total
  for (const [t, x] of w) {
    roll -= x
    if (roll <= 0) return t
  }
  return 'main-street'
}

function makeMessage(r: () => number, theme: ThemeId, sender: string, recipient: string, town: string): string {
  const rel = pick(r, RELATIONS)
  const vars = { s: sender.split(' ')[0], r: recipient.split(' ')[0], rel, town }
  const parts: string[] = [fill(pick(r, OPENERS), vars), fill(pick(r, EVENTS[theme]), vars) + '.']
  if (r() < 0.65) parts.push(pick(r, MIDS) + ' ' + fill(pick(r, EVENTS[theme]), vars).toLowerCase() + '.')
  parts.push(pick(r, LOWERS), pick(r, CLOSERS), fill(pick(r, SIGNS), vars))
  return parts.join('\n')
}

function makeReply(r: () => number, sender: string, recipient: string): string {
  const vars = { s: recipient.split(' ')[0] }
  return [
    pick(r, REPLY_OPENERS),
    pick(r, REPLY_MIDS) + '.',
    pick(r, REPLY_CLOSE),
    `Affectionately, ${sender.split(' ')[0]}.`,
  ].join('\n')
}

function buildCards(): Postcard[] {
  const cards: Postcard[] = []
  let seq = 0
  DECADES.forEach((d, decadeIdx) => {
    for (let k = 0; k < d.count; k++) {
      seq++
      const seed = 1729 + seq * 7919
      const r = mulberry32(seed)
      const year = Math.min(1900 + decadeIdx * 10 + Math.floor(r() * 10), 1994)
      const theme = themeForDecade(decadeIdx, r)
      const town = pick(r, TOWNS)
      const dests = DESTS.filter((t) => t !== town)
      const to = pick(r, dests)
      const pool = decadeIdx <= 3 ? FIRST_EARLY : decadeIdx <= 6 ? FIRST_MID : FIRST_LATE
      const sender = `${pick(r, pool)} ${pick(r, SURNAMES)}`
      const recipient = `${pick(r, pool)} ${pick(r, SURNAMES)}`
      const stamp = (STAMPS.find((s) => year <= s.until) ?? STAMPS[STAMPS.length - 1]).stamp
      const reply = r() < 0.34 ? makeReply(r, sender, recipient) : null
      cards.push({
        id: `pcx-${String(seq).padStart(3, '0')}`,
        seq,
        accession: `CMT·PC·${year}·${String(seq).padStart(4, '0')}`,
        title: pick(r, TITLES[theme]),
        year,
        month: pick(r, MONTHS),
        day: 1 + Math.floor(r() * 28),
        decade: d.id,
        town,
        to,
        theme,
        sender,
        recipient,
        message: makeMessage(r, theme, sender, recipient, town),
        reply,
        stamp,
        tint: (Math.floor(r() * 3) as 0 | 1 | 2),
        seed,
        condition: pick(r, CONDITIONS),
      })
    }
  })
  return cards
}

export const CARDS: Postcard[] = buildCards()
export const CARD_BY_ID = new Map(CARDS.map((c) => [c.id, c]))

/* ---------------- filters, threads, sort ---------------- */

export function applyFilters(cards: readonly Postcard[], f: Filters): Postcard[] {
  return cards.filter(
    (c) =>
      (f.decades.length === 0 || f.decades.includes(c.decade)) &&
      (f.towns.length === 0 || f.towns.includes(c.town)) &&
      (f.themes.length === 0 || f.themes.includes(c.theme)) &&
      (!f.reply || c.reply !== null),
  )
}

/** Count you'd get if `value` were selected on `facet`, holding the other facets. */
export function facetCount(
  cards: readonly Postcard[],
  f: Filters,
  facet: 'decades' | 'towns' | 'themes',
  value: string,
): number {
  const next: Filters = { ...f, [facet]: [value] }
  return applyFilters(cards, next).length
}

export function replyCount(cards: readonly Postcard[], f: Filters): number {
  return applyFilters(cards, { ...f, reply: true }).length
}

export type SortId = 'curated' | 'newest' | 'oldest'

export function sortCards(cards: readonly Postcard[], sort: SortId): Postcard[] {
  const list = cards.slice()
  if (sort === 'newest') return list.sort((a, b) => b.year - a.year || b.seq - a.seq)
  if (sort === 'oldest') return list.sort((a, b) => a.year - b.year || a.seq - b.seq)
  // curator's order: deterministic seeded shuffle
  const r = mulberry32(47)
  return list
    .map((c) => ({ c, k: r() }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.c)
}

export interface Thread {
  id: string
  kicker: string
  title: string
  blurb: string
  filters: Partial<Filters>
}

export const THREADS: Thread[] = [
  {
    id: 'the-big-dry',
    kicker: 'Thread 01',
    title: 'The Big Dry',
    blurb: '1900–1919, when the river got shy: bore drains, wool cheques, and rain reported like royalty.',
    filters: { decades: ['1900s', '1910s'], themes: ['wool', 'river'] },
  },
  {
    id: 'sweethearts-of-the-line',
    kicker: 'Thread 02',
    title: 'Sweethearts of the Line',
    blurb: 'Railway cards that got an answer. The Institute dances did their work.',
    filters: { themes: ['railway'], reply: true },
  },
  {
    id: 'lost-hotels',
    kicker: 'Thread 03',
    title: 'Hotels that no longer pour',
    blurb: 'Balconies, corner doors and nine-o’clock choirs from buildings you now walk past without knowing.',
    filters: { themes: ['hotel'] },
  },
  {
    id: 'writing-small-and-brave',
    kicker: 'Thread 04',
    title: 'Writing small and brave',
    blurb: 'Home-front mail from the 1910s and ’40s — fruitcakes in socks, censors, and courage by the page.',
    filters: { themes: ['mail'] },
  },
  {
    id: 'judges-choice',
    kicker: 'Thread 05',
    title: 'Judge’s choice, disputed',
    blurb: 'Show days: ribbons worn to breakfast, sponges investigated, judges discussed at length.',
    filters: { themes: ['show'] },
  },
  {
    id: 'school-bell',
    kicker: 'Thread 06',
    title: 'Forty-one scholars, one bell',
    blurb: 'The little schools of the shire — roofs that leaked in only two places, on good years.',
    filters: { themes: ['school'] },
  },
]

export function threadFilters(t: Thread): Filters {
  return { ...EMPTY_FILTERS, ...t.filters, decades: t.filters.decades ?? [], towns: t.filters.towns ?? [], themes: t.filters.themes ?? [] }
}

/* ---------------- URL state ---------------- */

const isDecade = (v: string): boolean => DECADES.some((d) => d.id === v)
const isTown = (v: string): boolean => (TOWNS as readonly string[]).includes(v)
const isTheme = (v: string): v is ThemeId => THEMES.some((t) => t.id === v)

export interface UrlState {
  filters: Filters
  thread: string | null
  card: string | null
}

export function parseUrl(search: string): UrlState {
  const p = new URLSearchParams(search)
  const list = (key: string) => (p.get(key) ?? '').split(',').filter(Boolean)
  return {
    filters: {
      decades: list('decade').filter(isDecade),
      towns: list('town').filter(isTown),
      themes: list('theme').filter(isTheme),
      reply: p.get('reply') === '1',
    },
    thread: THREADS.some((t) => t.id === p.get('thread')) ? p.get('thread') : null,
    card: p.get('card'),
  }
}

export function filtersToSearch(filters: Filters, thread: string | null, card: string | null): string {
  const p = new URLSearchParams()
  if (filters.decades.length) p.set('decade', filters.decades.join(','))
  if (filters.towns.length) p.set('town', filters.towns.join(','))
  if (filters.themes.length) p.set('theme', filters.themes.join(','))
  if (filters.reply) p.set('reply', '1')
  if (thread) p.set('thread', thread)
  if (card) p.set('card', card)
  const s = p.toString()
  return s ? `?${s}` : ''
}

export function filtersEqual(a: Filters, b: Filters): boolean {
  return (
    a.reply === b.reply &&
    a.decades.join() === b.decades.join() &&
    a.towns.join() === b.towns.join() &&
    a.themes.join() === b.themes.join()
  )
}

export function describeFilters(f: Filters): string {
  const bits: string[] = []
  if (f.decades.length) bits.push(f.decades.join(' + '))
  if (f.towns.length) bits.push(f.towns.join(' + '))
  if (f.themes.length) bits.push(f.themes.map((t) => THEME_LABEL[t]).join(' + '))
  if (f.reply) bits.push('with replies')
  return bits.join(' · ')
}

export function citationFor(c: Postcard): string {
  return `“${c.title}” (${c.year}), postcard, ${c.town} to ${c.to}. ${c.accession}. Postcards Collection, The Corrowong Museums Trust.`
}
