/**
 * Signal & Noise — network catalogue data.
 * Nine shows, twenty-seven episodes, full mock transcripts. Everything
 * fictional: hosts, guests, episodes and the network itself. The waveform
 * peaks and cover art are seeded so the catalogue looks identical on every
 * visit.
 */

export interface Show {
  id: string
  title: string
  hosts: string
  cadence: string
  genre: string
  blurb: string
  accent: string
  /** generative cover motif */
  motif: 'blueprint' | 'roost' | 'ledger' | 'dial' | 'sine' | 'badge' | 'table' | 'drift' | 'mast'
  seed: number
}

export type Speaker = 'HOST' | 'GUEST' | 'NARR'

export interface Line {
  t: number // seconds from episode start
  sp: Speaker
  tx: string
}

export interface Episode {
  id: string
  showId: string
  season: number
  ep: number
  title: string
  date: string
  duration: number // seconds
  blurb: string
  seed: number
  transcript: Line[]
}

export const RATES = [1, 1.25, 1.5, 1.75, 2] as const

/* ------------------------------------------------------------ helpers */

export const mulberry = (seed: number) => {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const hashStr = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Seeded, smoothed waveform peaks — ~9 bars per minute, values 0..1. */
export const peaksFor = (ep: Episode, perMinute = 9): number[] => {
  const n = Math.max(48, Math.round((ep.duration / 60) * perMinute))
  const rnd = mulberry(ep.seed)
  const raw: number[] = []
  for (let i = 0; i < n; i++) {
    // speech-like envelope: quiet floor, bursts, occasional silence
    const burst = rnd()
    const level = 0.16 + Math.pow(burst, 1.6) * 0.84
    raw.push(rnd() < 0.07 ? 0.06 + rnd() * 0.08 : level)
  }
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    const a = raw[i - 1] ?? raw[i] ?? 0
    const b = raw[i] ?? 0
    const c = raw[i + 1] ?? b
    out.push(Math.min(1, (a + b * 2 + c) / 4))
  }
  return out
}

export const fmtTime = (s: number): string => {
  const v = Math.max(0, Math.floor(s))
  const h = Math.floor(v / 3600)
  const m = Math.floor((v % 3600) / 60)
  const sec = v % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  return `${h > 0 ? `${h}:` : ''}${mm}:${String(sec).padStart(2, '0')}`
}

export const fmtDur = (s: number): string => {
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min`
  return `${Math.floor(m / 60)} hr ${m % 60} min`
}

/** Transcript lines that overlap a window [a, b]. */
export const linesInWindow = (ep: Episode, a: number, b: number): Line[] => {
  const out: Line[] = []
  for (let i = 0; i < ep.transcript.length; i++) {
    const line = ep.transcript[i]
    if (!line) continue
    const next = ep.transcript[i + 1]
    const end = next ? next.t : Math.min(ep.duration, line.t + 30)
    if (line.t < b && end > a) out.push(line)
  }
  return out
}

/** The line spoken at time t, if any. */
export const lineAt = (ep: Episode, t: number): Line | null => {
  let cur: Line | null = null
  for (const line of ep.transcript) {
    if (line.t <= t) cur = line
    else break
  }
  return cur
}

/* ------------------------------------------------------- clip sharing */

export interface ClipShare {
  e: string // episode id
  a: number // start seconds
  b: number // end seconds
  t: string // title
}

const te = new TextEncoder()
const td = new TextDecoder()

const b64url = (bytes: Uint8Array): string => {
  let bin = ''
  bytes.forEach((x) => (bin += String.fromCharCode(x)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const unb64url = (s: string): Uint8Array => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export const encodeClip = (c: ClipShare): string =>
  b64url(te.encode(JSON.stringify(c)))

export const decodeClip = (s: string): ClipShare | null => {
  try {
    const parsed = JSON.parse(td.decode(unb64url(s))) as Partial<ClipShare>
    if (
      typeof parsed.e !== 'string' ||
      typeof parsed.a !== 'number' ||
      typeof parsed.b !== 'number' ||
      typeof parsed.t !== 'string' ||
      !(parsed.b > parsed.a)
    )
      return null
    return { e: parsed.e, a: parsed.a, b: parsed.b, t: parsed.t.slice(0, 90) }
  } catch {
    return null
  }
}

export const CLIP_MIN = 15
export const CLIP_MAX = 60
export const CLIP_HASH = '#snsclip='

/* ------------------------------------------------------------- shows */

export const SHOWS: Show[] = [
  {
    id: 'long-diagram',
    title: 'The Long Diagram',
    hosts: 'Wren Okafor',
    cadence: 'Weekly · Tuesdays',
    genre: 'Interviews',
    blurb:
      'Long conversations with the people who keep difficult, unglamorous systems standing — ferries, fonts, floodgates, orchestras.',
    accent: '#e0564a',
    motif: 'blueprint',
    seed: 11,
  },
  {
    id: 'rooftop-ordinances',
    title: 'Rooftop Ordinances',
    hosts: 'Cassian Pike & Doll Hardie',
    cadence: 'Fortnightly · Fridays',
    genre: 'Urban nature',
    blurb:
      'The beloved bird show. Every fortnight, the city’s feathered residents get the serious journalism they have always deserved.',
    accent: '#8fae62',
    motif: 'roost',
    seed: 22,
  },
  {
    id: 'dead-margin',
    title: 'Dead Margin',
    hosts: 'Imogen Slade',
    cadence: 'Seasons · Monthly drops',
    genre: 'Narrative',
    blurb:
      'A prestige document-forgery serial: six forgeries, six centuries, and the archivists who can still smell a lie in the ink.',
    accent: '#cfc4ae',
    motif: 'ledger',
    seed: 33,
  },
  {
    id: 'warm-static',
    title: 'Warm Static',
    hosts: 'Rufus Bell',
    cadence: 'Weekly · Sundays',
    genre: 'Music & memory',
    blurb:
      'Songs and the memories stuck to them. Guests bring one recording; Rufus brings the box of tissues he pretends is a prop.',
    accent: '#e0a458',
    motif: 'dial',
    seed: 44,
  },
  {
    id: 'fifty-hertz',
    title: 'Fifty Hertz',
    hosts: 'Petra Voss',
    cadence: 'Weekly · Wednesdays',
    genre: 'Technology',
    blurb:
      'The electricity grid, explained by a former systems operator who misses the hum. Engineering for people who own kettles.',
    accent: '#7db8c4',
    motif: 'sine',
    seed: 55,
  },
  {
    id: 'hr-violations',
    title: 'HR Violations',
    hosts: 'The Compliance Department',
    cadence: 'Weekly · Thursdays',
    genre: 'Comedy',
    blurb:
      'A workplace panel show recorded in an actual disused HR office. The kettle is mic’d. The kettle has opinions.',
    accent: '#e78fae',
    motif: 'badge',
    seed: 66,
  },
  {
    id: 'second-breakfast',
    title: 'Second Breakfast',
    hosts: 'Ada Whitlam & Jonno Reyes',
    cadence: 'Weekly · Saturdays',
    genre: 'Food culture',
    blurb:
      'Counter meals, broth etiquette, the economics of the servo pie. Food radio for people who read menus like novels.',
    accent: '#cf8a4a',
    motif: 'table',
    seed: 77,
  },
  {
    id: 'quiet-machines',
    title: 'Quiet Machines',
    hosts: 'Field recordings, no host',
    cadence: 'Monthly · Midnight',
    genre: 'Soundscapes',
    blurb:
      'One machine, one room, one hour. For the sleepless, the studious, and anyone who finds a ferry engine oddly moving.',
    accent: '#93a2c0',
    motif: 'drift',
    seed: 88,
  },
  {
    id: 'frequency-hour',
    title: 'The Frequency Hour',
    hosts: 'Elio Vasquez & guests',
    cadence: 'Member feed · Monthly',
    genre: 'Behind the network',
    blurb:
      'The Frequency’s own show: how episodes get made, guests get lost, and nine shows share one extremely contested kettle.',
    accent: '#e0b64c',
    motif: 'mast',
    seed: 99,
  },
]

/* ---------------------------------------------------------- episodes */

const eps: Episode[] = [
  /* ---- The Long Diagram */
  {
    id: 'ld-s2e14', showId: 'long-diagram', season: 2, ep: 14, seed: 1414,
    title: 'The people who move the Opera House',
    date: '2026-08-18', duration: 3240,
    blurb: 'Fifty-six sails, three hundred stagehands, one weekly ballet of forklifts. The venues team explains how you turn a masterpiece around overnight.',
    transcript: [
      { t: 12, sp: 'HOST', tx: 'Everyone sees the sails. Almost nobody thinks about what the sails are standing on, or who is underneath them at 2 a.m.' },
      { t: 88, sp: 'GUEST', tx: 'We call it the turnover. Last Tuesday we went from opera to a rock gig to a schools matinee in nineteen hours.' },
      { t: 340, sp: 'GUEST', tx: 'The stage floor has six hundred and forty-two traps, and every one of them has a name, and yes, the crew will correct you.' },
      { t: 1180, sp: 'HOST', tx: 'What breaks first when a schedule breaks?' },
      { t: 1224, sp: 'GUEST', tx: 'The dock. The dock is a jigsaw with a heartbeat — two trucks late and the whole day reorganises itself around the hole.' },
      { t: 2760, sp: 'GUEST', tx: 'People say the building is a sculpture. It is not. It is a workplace that happens to be beautiful, and that is a harder trick.' },
    ],
  },
  {
    id: 'ld-s2e11', showId: 'long-diagram', season: 2, ep: 11, seed: 1411,
    title: 'A ferry timetable is a promise',
    date: '2026-07-28', duration: 2760,
    blurb: 'The network planner behind the harbour’s ferries on headways, swell windows, and why the 6:12 is the most honest boat in the fleet.',
    transcript: [
      { t: 20, sp: 'HOST', tx: 'A timetable looks like arithmetic. You describe it as a promise. Who is it made to?' },
      { t: 96, sp: 'GUEST', tx: 'The nurse who finishes at 11:40 p.m. If she misses the midnight, she waits fifty-eight minutes. That is who I write it for.' },
      { t: 620, sp: 'GUEST', tx: 'Everyone wants express boats. Every express boat steals a minute from five stops. Fast for some is a tax on everyone else.' },
      { t: 1300, sp: 'HOST', tx: 'And the 6:12?' },
      { t: 1348, sp: 'GUEST', tx: 'Highest on-time rate in the fleet. The water is calm, the drivers are fresh, and nobody has had time to be surprised yet.' },
      { t: 2410, sp: 'GUEST', tx: 'You do not optimise a harbour. You negotiate with it, in writing, every quarter.' },
    ],
  },
  {
    id: 'ld-s1e09', showId: 'long-diagram', season: 1, ep: 9, seed: 1409,
    title: 'How a violin gets its voice',
    date: '2025-11-04', duration: 2460,
    blurb: 'A luthier who has carved four hundred tops on graduation, tap tones, and the varnishes you are legally not allowed to ask about.',
    transcript: [
      { t: 15, sp: 'HOST', tx: 'You work in millimetres, then tenths of millimetres, then — what — feelings?' },
      { t: 74, sp: 'GUEST', tx: 'After the tenths you work in tap tones. You hold the plate to your ear and knock it like a door you are not sure is home.' },
      { t: 480, sp: 'GUEST', tx: 'Spruce is a tattletale. It remembers every summer for three hundred years and it will tell on the forest if you know how to read it.' },
      { t: 1120, sp: 'HOST', tx: 'And the varnish question gets you thrown out of guilds?' },
      { t: 1176, sp: 'GUEST', tx: 'It gets you invited to dinners and then uninvited from the second dinner.' },
      { t: 2180, sp: 'GUEST', tx: 'A violin is not finished. It is just agreed upon, for now, between me and the next hundred years.' },
    ],
  },

  /* ---- Rooftop Ordinances */
  {
    id: 'ro-s3e02', showId: 'rooftop-ordinances', season: 3, ep: 2, seed: 2302,
    title: 'The bin chicken caucus',
    date: '2026-09-04', duration: 1860,
    blurb: 'Ibis have unionised the lunch courts of three capitals. We follow the bread-crumb trail to their surprisingly written-down rules.',
    transcript: [
      { t: 10, sp: 'HOST', tx: 'The Australian white ibis: sacred in Egypt, judicial in Hyde Park, and absolutely in charge of your chips.' },
      { t: 82, sp: 'HOST', tx: 'Doll has spent six weeks observing one flock and insists they have a speaker of the house.' },
      { t: 410, sp: 'GUEST', tx: 'There is a rotation! The same bird never opens the first bin two days running. That is not chaos, that is rostering.' },
      { t: 760, sp: 'HOST', tx: 'For international listeners: the beak is a crowbar, the neck is a hydraulics problem, and the dignity is non-negotiable.' },
      { t: 1290, sp: 'GUEST', tx: 'Council puts spikes on the bins. The ibis hold a meeting on the spikes. I am not editorialising. I have photographs.' },
      { t: 1700, sp: 'HOST', tx: 'Verdict: not vermin, just extremely employed. See you on the roof in a fortnight.' },
    ],
  },
  {
    id: 'ro-s2e18', showId: 'rooftop-ordinances', season: 2, ep: 18, seed: 2218,
    title: 'Peregrines over Martin Place',
    date: '2026-03-13', duration: 2100,
    blurb: 'The fastest animal alive nests on a bank. A raptor biologist and a window washer compare notes at three hundred metres.',
    transcript: [
      { t: 18, sp: 'HOST', tx: 'Above the lunchtime queue for sushi, at roughly the speed of a rumour, there are peregrines.' },
      { t: 104, sp: 'GUEST', tx: 'A stooping peregrine passes three hundred kilometres an hour. The ledges up there carry down feathers like confetti.' },
      { t: 560, sp: 'GUEST', tx: 'They do not hunt pigeons the way people think. They intercept them. It is air traffic control with talons.' },
      { t: 990, sp: 'HOST', tx: 'The window washer’s log says the chicks fledged on the 4th, wind north-easterly, first flight "wobbly but committed".' },
      { t: 1520, sp: 'GUEST', tx: 'Every skyscraper is a sea cliff if the wind agrees. The city accidentally built a mountain range.' },
      { t: 1980, sp: 'HOST', tx: 'So next time someone says the CBD has no nature, look up. Briefly. Then get out of the flight path.' },
    ],
  },
  {
    id: 'ro-s2e15', showId: 'rooftop-ordinances', season: 2, ep: 15, seed: 2215,
    title: 'Why currawongs steal your chips',
    date: '2026-01-30', duration: 1740,
    blurb: 'Crime, but with feathers. The pied currawong’s heist strategies, ranked by audacity, with expert testimony from three victims.',
    transcript: [
      { t: 14, sp: 'HOST', tx: 'The call of the pied currawong sounds like a piano being introduced to a staircase. The bird itself is a professional.' },
      { t: 90, sp: 'GUEST', tx: 'They case a table. There is a scout pass, a distraction pass, and a collection. I have seen three birds run a two-chip operation.' },
      { t: 470, sp: 'HOST', tx: 'Victim statement one: "I made eye contact. It maintained eye contact. It took the chip anyway."' },
      { t: 890, sp: 'GUEST', tx: 'The intelligence is corvid-adjacent. They remember faces, they remember uniforms, they hold grudges with filing systems.' },
      { t: 1330, sp: 'HOST', tx: 'Advice from the experts: eat at a run, surrender early, and never ever sit near the good bench.' },
      { t: 1620, sp: 'HOST', tx: 'Currawongs: zero remorse, full marks. Chip security is a personal journey.' },
    ],
  },

  /* ---- Dead Margin */
  {
    id: 'dm-s1e06', showId: 'dead-margin', season: 1, ep: 6, seed: 3106,
    title: 'The letter that wasn’t',
    date: '2026-05-21', duration: 2700,
    blurb: 'Season finale. The Lancaster letter returns to the reading room, and the forgery’s smallest mistake is finally big enough to name.',
    transcript: [
      { t: 30, sp: 'NARR', tx: 'Box fourteen comes out of the cold room at nine. By nine-twenty, three people have stopped pretending to work elsewhere.' },
      { t: 210, sp: 'NARR', tx: 'The letter has been authenticated eleven times, twice by people who were right about everything else in their careers.' },
      { t: 690, sp: 'GUEST', tx: 'Paper forgery is carpentry. Ink forgery is chemistry. But the fold pattern — the fold pattern is biography.' },
      { t: 1240, sp: 'NARR', tx: 'A letter folded in 1812 is folded by 1812 hands. This one was folded by someone who had only ever read about 1812.' },
      { t: 1990, sp: 'GUEST', tx: 'The forger got the wax, the whistle, the watermark. They tripped on a habit so small nobody had ever written it down. Until now.' },
      { t: 2540, sp: 'NARR', tx: 'The box goes back into the cold. The letter keeps its secret — but only, now, by agreement.' },
    ],
  },
  {
    id: 'dm-s1e04', showId: 'dead-margin', season: 1, ep: 4, seed: 3104,
    title: 'Ink under ultraviolet',
    date: '2026-03-26', duration: 2520,
    blurb: 'A conservator opens the lab door: what iron gall ink confesses under UV, and the 1903 map that glowed like a guilty conscience.',
    transcript: [
      { t: 24, sp: 'NARR', tx: 'The lab is basement-cold and smells of nothing, which in conservation is a flavour of its own.' },
      { t: 140, sp: 'GUEST', tx: 'Every ink has a signature at a wavelength it cannot see. UV is not a lie detector — it is a confessional nobody wrote down.' },
      { t: 540, sp: 'NARR', tx: 'The map enters the box as a proud 1903 original. It leaves it, forty minutes later, as a very good 1970s apology.' },
      { t: 1130, sp: 'GUEST', tx: 'Iron gall eats paper from inside. Real age has scars that heal outward. Faked age is a bruise painted on healthy skin.' },
      { t: 1860, sp: 'GUEST', tx: 'The forger aged it with tea and an oven. You want to be angry, and then you see the stitch-work, and honestly it is beautiful.' },
      { t: 2360, sp: 'NARR', tx: 'The map is not destroyed. Fakes get catalogued too — a good forgery is evidence, just of a different crime.' },
    ],
  },
  {
    id: 'dm-s1e01', showId: 'dead-margin', season: 1, ep: 1, seed: 3101,
    title: 'A signature in triplicate',
    date: '2026-01-15', duration: 2880,
    blurb: 'The series opens on a will signed three times by the same hand — or three hands that took turns being the same one.',
    transcript: [
      { t: 36, sp: 'NARR', tx: 'The estate was worth eleven houses and one argument, and the argument is the part that survived.' },
      { t: 190, sp: 'GUEST', tx: 'Handwriting examiners do not match letters. We match pressure, rhythm, the little lifts where the pen breathes.' },
      { t: 700, sp: 'NARR', tx: 'Three signatures, three decades apart, all perfect. Nobody’s hand stays that loyal. Hands betray you yearly.' },
      { t: 1310, sp: 'GUEST', tx: 'A genuine old signature gets faster where it is confident. A copied one gets slower exactly where it matters.' },
      { t: 2100, sp: 'NARR', tx: 'Somewhere in the file is a fourth signature nobody submitted. Every archive has a draft of its own mystery.' },
      { t: 2710, sp: 'GUEST', tx: 'People think we catch forgers. Mostly we catch families. The forgery is just the stationery the grief arrived on.' },
    ],
  },

  /* ---- Warm Static */
  {
    id: 'ws-s4e03', showId: 'warm-static', season: 4, ep: 3, seed: 4403,
    title: 'The cassette in the glovebox',
    date: '2026-08-30', duration: 2160,
    blurb: 'A retired long-haul driver brings the mixtape that outlasted three trucks, two marriages and one very patient mechanic.',
    transcript: [
      { t: 16, sp: 'HOST', tx: 'Forty-one years in a glovebox. The case is sun-crazed, the label is in biro, and side two is just called "GOOD BITS".' },
      { t: 120, sp: 'GUEST', tx: 'Bitumen between Hay and Mildura is four hours of nothing, and that tape filled the nothing better than any radio ever did.' },
      { t: 520, sp: 'GUEST', tx: 'You could set your odometer by the third song. If the bridge came in before the railway crossing, you were making good time.' },
      { t: 980, sp: 'HOST', tx: 'The wow and flutter near the end — the tape is fighting.' },
      { t: 1024, sp: 'GUEST', tx: 'It got hot in ’09 and it has sung with a limp ever since. Mate, haven’t we all.' },
      { t: 1960, sp: 'HOST', tx: 'The last track is eight minutes of engine and magpies. He recorded the destination. Of course he did.' },
    ],
  },
  {
    id: 'ws-s3e22', showId: 'warm-static', season: 3, ep: 22, seed: 4322,
    title: 'Songs your parents slow-danced to',
    date: '2025-06-14', duration: 2340,
    blurb: 'Listener letters on the songs that taught a generation to hold still in kitchens. Contains three unannounced tears, two of them ours.',
    transcript: [
      { t: 22, sp: 'HOST', tx: 'We asked for the song and you sent seven hundred and twelve letters. The postbag is a time machine with a stamp on it.' },
      { t: 130, sp: 'GUEST', tx: 'My parents danced to this every anniversary, in the kitchen, sauce going. The song is four minutes. The dance, I think, was fifty years.' },
      { t: 640, sp: 'HOST', tx: 'A slow dance is an agreement to be terrible together in public. Nobody ever fell in love with a good dancer at a wedding.' },
      { t: 1210, sp: 'GUEST', tx: 'I found the record after the funeral and the needle knew the part my throat forgot.' },
      { t: 1790, sp: 'HOST', tx: 'If your parents had a song, play it loud tonight. Tell them the radio told you to.' },
      { t: 2210, sp: 'HOST', tx: 'Warm Static is recorded to tape because digital never learned to sigh. Goodnight, and mind the ferry steps.' },
    ],
  },
  {
    id: 'ws-s3e19', showId: 'warm-static', season: 3, ep: 19, seed: 4319,
    title: 'AM radio at midnight',
    date: '2025-05-03', duration: 1980,
    blurb: 'The last late-night request host on the AM band on dead air, dedication etiquette, and voices arriving over mountains.',
    transcript: [
      { t: 18, sp: 'HOST', tx: 'After midnight the AM band stops being local. Stations arrive over mountains like relatives you only meet at weddings.' },
      { t: 110, sp: 'GUEST', tx: 'Thirty-one years of overnight requests. You learn the lonely hours have a population, and the population has excellent taste.' },
      { t: 480, sp: 'GUEST', tx: 'Rule one: never rush a dedication. The caller has rehearsed it since Tuesday and it is the bravest thing they will do all week.' },
      { t: 930, sp: 'HOST', tx: 'And dead air?' },
      { t: 976, sp: 'GUEST', tx: 'Eleven seconds, once, in 1999. I still dream about it. The silence had a shape.' },
      { t: 1740, sp: 'GUEST', tx: 'People think the night shift is where radio goes to sleep. It is where radio takes its jacket off and tells the truth.' },
    ],
  },

  /* ---- Fifty Hertz */
  {
    id: 'fh-s2e06', showId: 'fifty-hertz', season: 2, ep: 6, seed: 5206,
    title: 'Why the kettle matters',
    date: '2026-07-08', duration: 1500,
    blurb: 'Half-time in the big final puts six hundred megawatts in kettles at once. The grid loves you, but it flinches first.',
    transcript: [
      { t: 12, sp: 'HOST', tx: 'At half-time, a nation walks to the kitchen as one animal. The grid calls this the TV pickup, and it is the size of a power station.' },
      { t: 95, sp: 'GUEST', tx: 'In the control room you can watch the ad break arrive as a cliff on the frequency trace. Kettles have a signature.' },
      { t: 360, sp: 'HOST', tx: 'So the grid is listening to the telly?' },
      { t: 402, sp: 'GUEST', tx: 'We schedule around penalty shootouts. There is a spreadsheet. It is my proudest spreadsheet.' },
      { t: 830, sp: 'GUEST', tx: 'Fifty hertz is a promise made eight thousand times a second. Your kettle is the vowels in that promise.' },
      { t: 1380, sp: 'HOST', tx: 'Next time you brew at half-time, know that someone in a windowless room saw you coming, and smiled.' },
    ],
  },
  {
    id: 'fh-s2e03', showId: 'fifty-hertz', season: 2, ep: 3, seed: 5203,
    title: 'The night the lights almost went',
    date: '2026-06-10', duration: 1680,
    blurb: 'Oral history of the closest near-miss in the state’s grid history — told by the three operators whose kettle stayed cold.',
    transcript: [
      { t: 20, sp: 'HOST', tx: 'November the 14th, 18:41. Two interstates down, one storm cell with ambition, and forty minutes that took years off everyone.' },
      { t: 150, sp: 'GUEST', tx: 'You do not feel fear in the middle of it. You feel filing. Every alarm gets a name and a number and a little square of calm.' },
      { t: 510, sp: 'GUEST', tx: 'The rule is: shed load before the machine sheds it for you. Choosing a suburb is the least fun you can have with a keyboard.' },
      { t: 920, sp: 'HOST', tx: 'How close was it, honestly?' },
      { t: 966, sp: 'GUEST', tx: 'The frequency went to 49.1. The lights stayed on. Nobody outside the room ever knew, which is the whole job.' },
      { t: 1540, sp: 'GUEST', tx: 'At 19:26 the kettle finally got boiled. Best cup of my life. Room-temperature fear tastes terrible.' },
    ],
  },
  {
    id: 'fh-s1e12', showId: 'fifty-hertz', season: 1, ep: 12, seed: 5112,
    title: 'A battery the size of a suburb',
    date: '2025-12-17', duration: 1560,
    blurb: 'Inside the big battery that caught a falling grid in 130 milliseconds — and why its operators speak about it like a sheepdog.',
    transcript: [
      { t: 16, sp: 'HOST', tx: 'From the road it is a field of white filing cabinets. From the control room it is the fastest set of hands in the southern grid.' },
      { t: 130, sp: 'GUEST', tx: 'A coal unit thinks in minutes. The battery thinks in milliseconds. It caught a trip in 130 — before the lights could decide to flicker.' },
      { t: 430, sp: 'GUEST', tx: 'We talk about it like a sheepdog. Good battery. It does not get bored, it does not sleep, and it herds frequency all night.' },
      { t: 860, sp: 'GUEST', tx: 'Twelve shipping containers hold the evening news. That still bends my brain, and I sign its paperwork.' },
      { t: 1410, sp: 'HOST', tx: 'The grid of 2035 will be less cathedral, more flock. The battery, fittingly, does not care either way.' },
    ],
  },

  /* ---- HR Violations */
  {
    id: 'hrv-s5e01', showId: 'hr-violations', season: 5, ep: 1, seed: 6501,
    title: 'The offsite',
    date: '2026-09-10', duration: 2400,
    blurb: 'Season five opens at a wellness retreat with no wifi, one flipchart, and a trust fall that is now before the courts.',
    transcript: [
      { t: 14, sp: 'HOST', tx: 'Welcome back to HR Violations, recorded in the disused HR office of a company we are still not allowed to name.' },
      { t: 100, sp: 'GUEST', tx: 'The offsite brief said "unplug and connect". So naturally someone brought a signal jammer and a laminated agenda.' },
      { t: 450, sp: 'GUEST', tx: 'Trust falls are just meetings with consequences.' },
      { t: 940, sp: 'HOST', tx: 'The flipchart says only "SYNERGY?" and, underneath, in different handwriting, "HELP".' },
      { t: 1620, sp: 'GUEST', tx: 'Day two we did a listening circle. It took forty minutes before anyone noticed the facilitator had been replaced by a fern.' },
      { t: 2230, sp: 'HOST', tx: 'Verdict from the panel: the retreat worked. Nobody has spoken since, and morale has technically never been higher.' },
    ],
  },
  {
    id: 'hrv-s4e12', showId: 'hr-violations', season: 4, ep: 12, seed: 6412,
    title: 'The Wellness Wednesday incident',
    date: '2026-04-16', duration: 2280,
    blurb: 'Yoga mats in the breakout room, a kombucha tap nobody asked for, and the email thread that ended a manager.',
    transcript: [
      { t: 12, sp: 'HOST', tx: 'This week: the incident that legal has asked us to describe as "a series of stretches".' },
      { t: 88, sp: 'GUEST', tx: 'Wellness Wednesday began as a poster. By week three it had a budget, a gong, and a casualty list.' },
      { t: 420, sp: 'GUEST', tx: 'The kombucha tap was plumbed into the same line as the kettle outlet. For one glorious morning, the tea was alive.' },
      { t: 900, sp: 'HOST', tx: 'The email thread is three hundred replies deep. Somewhere around reply forty, someone attaches a spreadsheet of feelings.' },
      { t: 1560, sp: 'GUEST', tx: 'The gong was confiscated. It is now in evidence, which means somewhere a paralegal owns a label-maker that has seen things.' },
      { t: 2140, sp: 'HOST', tx: 'Ruling: mandatory wellness is just a meeting in activewear. Case closed, mats down, namaste at your desk.' },
    ],
  },
  {
    id: 'hrv-s4e09', showId: 'hr-violations', season: 4, ep: 9, seed: 6409,
    title: 'Mandatory fun',
    date: '2026-03-05', duration: 2160,
    blurb: 'The panel adjudicates a company-wide fun quota, an escape room that locked from the outside, and cake with an agenda.',
    transcript: [
      { t: 16, sp: 'HOST', tx: 'A listener’s employer has introduced — and I am reading from the policy — "a minimum fortnightly fun threshold".' },
      { t: 96, sp: 'GUEST', tx: 'You cannot schedule a mood. The moment fun has a KPI, it is just work wearing a hat.' },
      { t: 470, sp: 'GUEST', tx: 'The escape room locked from the outside for regulatory reasons. They escaped in nine minutes. It had taken facilities two hours to install.' },
      { t: 940, sp: 'HOST', tx: 'Item three: cake, but the cake has an agenda item. The agenda was laminated to the cake.' },
      { t: 1480, sp: 'GUEST', tx: 'Best line of the thread: "I am fun-compliant. Please see attached." Attached was a photo of a drained man holding a sparkler.' },
      { t: 2010, sp: 'HOST', tx: 'Ruling: fun is a byproduct, not a deliverable. The Compliance Department rests, recreationally, of its own free will.' },
    ],
  },

  /* ---- Second Breakfast */
  {
    id: 'sb-s6e04', showId: 'second-breakfast', season: 6, ep: 4, seed: 7604,
    title: 'In defence of the counter meal',
    date: '2026-08-22', duration: 2040,
    blurb: 'The schnitty, the bain-marie of destiny, and why the $14 rump with pepper sauce is a civic institution worth listing.',
    transcript: [
      { t: 12, sp: 'HOST', tx: 'This week we mount a full-throated, gravy-forward defence of the counter meal. Ada brought a number.' },
      { t: 70, sp: 'GUEST', tx: 'Number forty-seven. The table knows. The kitchen knows. I have been number forty-seven at this pub for eleven years.' },
      { t: 380, sp: 'GUEST', tx: 'A counter meal is a contract: no foam, no tweezers, chips that touch the sauce without shame.' },
      { t: 800, sp: 'HOST', tx: 'The bain-marie is where vegetables go to be forgiven.' },
      { t: 848, sp: 'GUEST', tx: 'And the pepper sauce is a personality test. Jar gravy people and jus people cannot marry. It is in the Family Law Act, I checked twice.' },
      { t: 1870, sp: 'HOST', tx: 'Verdict: heritage-list the lot. The schnitzel is load-bearing culture.' },
    ],
  },
  {
    id: 'sb-s5e20', showId: 'second-breakfast', season: 5, ep: 20, seed: 7520,
    title: 'The last lamington',
    date: '2026-02-14', duration: 1920,
    blurb: 'A fundraiser economics special: the lamington drive, the sausage sizzle index, and the tragic arc of the last slice on the tray.',
    transcript: [
      { t: 14, sp: 'HOST', tx: 'Every school fete has one table where the free market of dessert plays out in miniature. Today: the lamington economy.' },
      { t: 88, sp: 'GUEST', tx: 'At 9 a.m. they are a dollar each. By 11 the market has cornered itself. By noon, the last lamington is basically a futures contract.' },
      { t: 420, sp: 'HOST', tx: 'The physics of the last slice: nobody takes it, everybody wants it, and it dry-ages under cling film like a trophy.' },
      { t: 780, sp: 'GUEST', tx: 'There is one true strategy: buy two early, eat one publicly, sell the second to a parent having a committee day.' },
      { t: 1380, sp: 'HOST', tx: 'The sausage sizzle index says democracy is best measured in onions per dollar. Two onions or it did not happen.' },
      { t: 1760, sp: 'GUEST', tx: 'Final ruling: the last lamington belongs to the volunteer who packed the trestles. This is ancient law.' },
    ],
  },
  {
    id: 'sb-s5e17', showId: 'second-breakfast', season: 5, ep: 17, seed: 7517,
    title: 'Broth is a commitment',
    date: '2026-01-10', duration: 2100,
    blurb: 'A two-day stockpot, a baker who starts at 3 a.m., and a meditation on the foods that only exist because someone refused to hurry.',
    transcript: [
      { t: 18, sp: 'HOST', tx: 'Some dinners are decisions. Broth is a commitment you make on Thursday to a person you hope to be on Sunday.' },
      { t: 120, sp: 'GUEST', tx: 'The pot is older than my apprenticeship. It has outlasted three landlords and it gets better every year, like an apology.' },
      { t: 530, sp: 'GUEST', tx: 'You cannot multitask a stock. It knows. The scum rises out of respect for your attention or lack of it.' },
      { t: 1010, sp: 'HOST', tx: 'The baker starts at three. Why three?' },
      { t: 1056, sp: 'GUEST', tx: 'Because the dough takes what it takes and the croissants do not negotiate. Lamination is a one-sided treaty.' },
      { t: 1920, sp: 'HOST', tx: 'Fast food is a promise of time. Slow food is a promise of everything else. Keep a pot on. We will wait.' },
    ],
  },

  /* ---- Quiet Machines */
  {
    id: 'qm-e41', showId: 'quiet-machines', season: 1, ep: 41, seed: 8841,
    title: 'Ferry engine room, 4 a.m.',
    date: '2026-07-31', duration: 3600,
    blurb: 'One hour below the waterline of the first harbour service. Two microphones, one kettle (unboiled), zero announcements.',
    transcript: [
      { t: 60, sp: 'NARR', tx: 'You are below the waterline of the 4 a.m. service. The engine is at cruise. There is nothing you need to do.' },
      { t: 600, sp: 'NARR', tx: 'The hum holds at sixty cycles. A pipe somewhere finishes a thought from the last crossing.' },
      { t: 1260, sp: 'NARR', tx: 'The gearbox changes its mind about nothing, and tells you so, in the dark, at length.' },
      { t: 1900, sp: 'NARR', tx: 'Water moves along the hull like a page being turned very slowly by someone with no appointments.' },
      { t: 2700, sp: 'NARR', tx: 'The kettle remains unboiled. This is not a plot point. It is a promise.' },
      { t: 3400, sp: 'NARR', tx: 'First light reaches the intake grate. The service slows. Whenever you wake up, the harbour will still be there.' },
    ],
  },
  {
    id: 'qm-e38', showId: 'quiet-machines', season: 1, ep: 38, seed: 8838,
    title: 'Rain on a Colorbond roof',
    date: '2026-05-22', duration: 3300,
    blurb: 'A spring storm recorded from inside a tool shed in the Adelaide Hills. Gutters full, kookaburras unimpressed.',
    transcript: [
      { t: 55, sp: 'NARR', tx: 'The storm arrives on schedule, which is to say ten minutes after the washing went out in the next valley.' },
      { t: 700, sp: 'NARR', tx: 'Rain on corrugated iron is applause with no audience left to thank. Except you. You stayed.' },
      { t: 1500, sp: 'NARR', tx: 'The gutters are running full. Somewhere a kookaburra is filing a formal objection and losing.' },
      { t: 2210, sp: 'NARR', tx: 'The shed creaks once, considers its life choices, and settles back into being excellent at its job.' },
      { t: 3150, sp: 'NARR', tx: 'The rain thins to stitching. The valley exhales. Sleep well; the roof will keep count.' },
    ],
  },
  {
    id: 'qm-e35', showId: 'quiet-machines', season: 1, ep: 35, seed: 8835,
    title: 'Night shift, print works',
    date: '2026-04-03', duration: 3000,
    blurb: 'The last letterpress in the building runs its weekly poster job after dark. Treadle, ink rhythm, one whistling compositor.',
    transcript: [
      { t: 50, sp: 'NARR', tx: 'The press is from 1958 and it runs better after midnight, which the operator insists is common knowledge.' },
      { t: 640, sp: 'NARR', tx: 'Treadle, impression, delivery. A poster exists forty times a minute. Repetition is the whole craft.' },
      { t: 1420, sp: 'NARR', tx: 'Ink has a smell at this hour that the daytime tours never get. It is worth resigning from a day job for. Two people have.' },
      { t: 2080, sp: 'NARR', tx: 'The compositor whistles the same nine notes all night. Nobody has identified the tune. It may not be one.' },
      { t: 2880, sp: 'NARR', tx: 'Job done. Three hundred posters, one signature in the margin, lights out. The press cools like rain on a roof.' },
    ],
  },

  /* ---- The Frequency Hour */
  {
    id: 'fq-e33', showId: 'frequency-hour', season: 3, ep: 33, seed: 9933,
    title: 'How we book a guest (and lose one)',
    date: '2026-09-01', duration: 1500,
    blurb: 'Elio opens the booking ledger: the guest who required a specific chair, the one who found us, and the one who got away to sea.',
    transcript: [
      { t: 12, sp: 'HOST', tx: 'Welcome to The Frequency Hour, the show where we explain the sausage factory to the people who paid for the sausage.' },
      { t: 84, sp: 'GUEST', tx: 'Booking a guest is forty per cent research, forty per cent charm, and twenty per cent apologising for the car park.' },
      { t: 390, sp: 'GUEST', tx: 'One guest stipulated a specific ergonomic chair. We sourced the chair. The chair now has its own shelf and, frankly, seniority.' },
      { t: 800, sp: 'HOST', tx: 'And the one who got away?' },
      { t: 848, sp: 'GUEST', tx: 'Joined a tall ship. Sent a postcard from the Roaring Forties that just says "STILL NOT DOING PODCASTS". We framed it.' },
      { t: 1360, sp: 'HOST', tx: 'Moral: the ledger never balances, but every no has good posture now. Thanks for being a member of The Frequency.' },
    ],
  },
  {
    id: 'fq-e30', showId: 'frequency-hour', season: 3, ep: 30, seed: 9930,
    title: 'The audiozine, dissected',
    date: '2026-05-05', duration: 1620,
    blurb: 'The quarterly member audiozine gets the commentary-track treatment: edits we fought over, bleeped names, and the jingle’s origin story.',
    transcript: [
      { t: 15, sp: 'HOST', tx: 'This is the audiozine commentary track: the quarterly you already own, now with us talking over it professionally.' },
      { t: 110, sp: 'GUEST', tx: 'The jingle is four notes because the fifth note tested badly. We paid a choir to discover this.' },
      { t: 460, sp: 'GUEST', tx: 'Segment two was cut for legal and re-cut for length. The remaining seventeen seconds are the best seventeen seconds in network history.' },
      { t: 830, sp: 'HOST', tx: 'The bleeped name is not scandalous. It is just a man called Craig who prefers mystery, and who are we to argue.' },
      { t: 1290, sp: 'GUEST', tx: 'The outro pause is intentional. Eleven seconds of room tone. Members have written poems about it. One was good.' },
      { t: 1540, sp: 'HOST', tx: 'Next quarter: a jingle remix and, if Craig permits, a name above a whisper. Members only, obviously.' },
    ],
  },
  {
    id: 'fq-e27', showId: 'frequency-hour', season: 3, ep: 27, seed: 9927,
    title: 'Nine shows, one kettle',
    date: '2026-02-03', duration: 1440,
    blurb: 'The full story of the warehouse kettle: nine shows, four rosters, one appliance, and the peacemaking rota that saved the network.',
    transcript: [
      { t: 12, sp: 'HOST', tx: 'Nine shows. One warehouse. One kettle. This is the story of the closest Signal & Noise ever came to civil war.' },
      { t: 95, sp: 'GUEST', tx: 'The Rooftop Ordinances team boiled it for birdwatching tea at 5 a.m. Fifty Hertz measured it for a segment. Everyone was right. That was the problem.' },
      { t: 410, sp: 'GUEST', tx: 'The kettle has a peacemaking rota now. It is laminated. It has clauses. Clause four is just "the kettle is mic’d, behave".' },
      { t: 810, sp: 'HOST', tx: 'HR Violations offered to adjudicate and were disqualified for buying the kettle in the first place.' },
      { t: 1180, sp: 'GUEST', tx: 'The Quiet Machines episode in the engine room? The unboiled kettle is our kettle. It was a statement.' },
      { t: 1350, sp: 'HOST', tx: 'Membership pays for a second kettle next quarter. Democracy works. Slowly, and with tea.' },
    ],
  },
]

export const EPISODES: Episode[] = eps

const byId = new Map(EPISODES.map((e) => [e.id, e]))
const showById = new Map(SHOWS.map((s) => [s.id, s]))

export const getEpisode = (id: string): Episode | undefined => byId.get(id)
export const getShow = (id: string): Show | undefined => showById.get(id)

/** Season numbers present for a show, descending. */
export const seasonsOf = (showId: string): number[] => {
  const set = new Set<number>()
  for (const e of EPISODES) if (e.showId === showId) set.add(e.season)
  return [...set].sort((a, b) => b - a)
}

/** Episodes of a show, newest season first, newest ep first. */
export const episodesOf = (showId: string): Episode[] =>
  EPISODES.filter((e) => e.showId === showId).sort(
    (a, b) => b.season - a.season || b.ep - a.ep,
  )

/** Next episode in the same show (older), used to auto-advance the queue. */
export const nextInShow = (ep: Episode): Episode | null => {
  const list = episodesOf(ep.showId)
  const i = list.findIndex((e) => e.id === ep.id)
  return i >= 0 ? (list[i + 1] ?? null) : null
}
