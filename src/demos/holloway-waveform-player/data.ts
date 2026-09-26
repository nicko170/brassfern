/**
 * Holloway Records — Deck 02 catalogue data.
 * The promo room's crate: dub plates, alt masters and one-take plates cut
 * from the label's catalogue. Same fictional artists as the listening-room
 * demo (holloway-player); everything invented, nothing real.
 */

export interface Cue {
  t: number
  label: string
}

export interface DeckTrack {
  id: string
  cat: string
  title: string
  version: string
  artist: string
  base: string // the catalogue cut this plate is cut from
  dur: number // seconds
  bpm: number
  keySig: string
  year: number
  seed: number
  engineer: string
  room: string
  cutDate: string
  run: string // pressing run
  mood: string
  notes: string[]
  cues: Cue[]
  tint: number // 0..1 sleeve warm-tint blend
}

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

const tr = (
  cat: string,
  title: string,
  version: string,
  artist: string,
  base: string,
  m: number,
  s: number,
  bpm: number,
  keySig: string,
  mood: string,
  engineer: string,
  cutDate: string,
  run: string,
  room: string,
  cues: [number, number, string][],
  notes: string[],
  tint: number,
): DeckTrack => ({
  id: cat.toLowerCase(),
  cat,
  title,
  version,
  artist,
  base,
  dur: m * 60 + s,
  bpm,
  keySig,
  year: 2026,
  seed: hashStr(cat + title),
  engineer,
  room,
  cutDate,
  run,
  mood,
  cues: cues.map(([cm, cs, label]) => ({ t: cm * 60 + cs, label })),
  notes,
  tint,
})

export const TRACKS: DeckTrack[] = [
  tr(
    'HWP-021',
    'Coral Static',
    'Plant Floor Dub',
    'Sable Coast',
    'Coral Static · HW-031',
    5, 12, 96, 'F minor', 'Harbour soul, dried out',
    'Nadia Reyes', 'Aug 2026', '40 plates · hand-stamped', 'Suite B, Surry Hills',
    [[0, 32, 'GROOVE'], [1, 48, 'BASS DROP'], [2, 56, 'BREAK'], [3, 40, 'TRAIN TAKE'], [4, 44, 'OUT']],
    [
      'Stripped the vocal to a ghost and let the rhythm section carry the whole plate. The warehouse roller door stayed open again — the freight line at 3:40 is the take, not a mistake.',
      'Cut hot on the lathe. Warn pressing plant before the drop at 1:48 or the stylus will walk.',
    ],
    0.15,
  ),
  tr(
    'HWP-022',
    'Dashboard Constellations',
    '2AM Re-Master',
    'October Radio',
    'Late Transmission · HW-026',
    4, 47, 108, 'A minor', 'Night-drive synth',
    'Felix Okafor', 'Jul 2026', '60 plates', 'Suite B, Surry Hills',
    [[0, 0, 'IGNITION'], [0, 54, 'LEAD IN'], [1, 50, 'MOTORWAY'], [3, 12, 'STATION ID'], [4, 20, 'COAST']],
    [
      'Re-mastered for late radio. We pulled the synth arp forward 2dB and pushed everything else out the window at speed. Plays best between midnight and regret.',
      'The station-ID sample at 3:12 is a real 1987 captive recording from the tape archive. Cleaned, not sanitised.',
    ],
    0.55,
  ),
  tr(
    'HWP-023',
    'Margin IV (Unsent)',
    'Solo Piano Plate',
    'Meera Vale',
    'Night Margins · HW-029',
    6, 3, 58, 'D-flat major', 'Ambient piano',
    'Nadia Reyes', 'Sep 2026', '30 plates · numbered', 'The Quiet Room',
    [[0, 0, 'FELT'], [1, 38, 'THEME'], [2, 56, 'LETTERS'], [4, 10, 'REPRISE'], [5, 30, 'DECAY']],
    [
      'Felt piano, one ribbon mic, no second take. The creak at the letters is the piano stool. Meera asked us to leave it in, so it is written into the master.',
      'Cut at half speed, half level. Side etiquette: lower the needle like you mean it, then apologise to no one.',
    ],
    0.8,
  ),
  tr(
    'HWP-024',
    'Mirror Ball & Mop',
    'Wharfside Extended',
    'Pelican Club',
    'Moulded Gold · HW-024',
    6, 36, 118, 'G minor', 'Wharf disco',
    'Tom Havelock', 'Jun 2026', '80 plates', 'Suite A, Surry Hills',
    [[0, 0, 'COUNT-IN'], [0, 48, 'HOOK'], [2, 4, 'HORNS'], [3, 42, 'ACID SOLO'], [4, 58, 'CONGA LANE'], [6, 0, 'LAST CALL']],
    [
      'Extended for the floor by request of every DJ who got the seven-inch and ran out of record. Two extra minutes of conga lane, horns re-blown, mop bucket still audible.',
      'The acid line at 3:42 is the synth nobody admits to bringing to the session. We comped the best twelve bars and burned the session sheet.',
    ],
    0.3,
  ),
  tr(
    'HWP-025',
    'Bitumen Heart',
    'Bark River Acoustic',
    'The Hinterlands',
    'Bitumen Heart · HW-028',
    3, 58, 92, 'E major', 'Jangle pop, unplugged',
    'Nadia Reyes', 'Aug 2026', '50 plates', 'Verandah, Bark River',
    [[0, 0, 'MAGPIES'], [0, 22, 'VERSE'], [1, 6, 'HOOK'], [2, 28, 'HARMONY'], [3, 30, 'ENGINE']],
    [
      'Recorded on the verandah at Bark River with one mic and a wind sock made from a shirt. The magpies open the take and a road train closes it. Both got royalties.',
      'Mastered warm and wide. The vocal harmony at 2:28 is the whole band around one mic, three takes, first take kept.',
    ],
    0.65,
  ),
  tr(
    'HWP-026',
    'Antenna Teeth',
    'Static Cut',
    'Gull Weather',
    'Salt Telecom · HW-030',
    3, 21, 134, 'B minor', 'Coastal post-punk',
    'Felix Okafor', 'May 2026', '70 plates', 'Suite B, Surry Hills',
    [[0, 0, 'FEEDBACK'], [0, 14, 'RIFF'], [0, 46, 'CHORUS'], [1, 38, 'STATIC'], [2, 44, 'RUN-OUT']],
    [
      'Mastered louder than the album version and proud of it. Guitars tracked through a desk that was actively failing — you can hear the console surrender at 1:38.',
      'Run-out groove is cut to lock. Lift the needle yourself; the record will not do it for you.',
    ],
    0.1,
  ),
  tr(
    'HWP-027',
    'Torchlight Set',
    'Moonshine Mix',
    'Bracken & the Fox',
    'Understory · HW-027',
    4, 29, 76, 'G major', 'Mountain folk',
    'Tom Havelock', 'Jul 2026', '45 plates', 'The Quiet Room',
    [[0, 0, 'TUNE-UP'], [0, 40, 'CHORUS'], [1, 52, 'FIDDLE'], [2, 56, 'STOMP'], [3, 58, 'EMBERS']],
    [
      'The moonshine mix: everything through the old spring reverb until it sounds like a hall with no walls. Fiddle at 1:52 is one pass, one player, one shot.',
      'Stomp section recorded on the actual floorboards of the Quiet Room. The boards are credited on the label copy.',
    ],
    0.9,
  ),
  tr(
    'HWP-028',
    'Floorboard Choir',
    'One-Take Plate',
    'Wren Lightsey',
    'Kitchen Window · HW-025',
    4, 52, 66, 'C major', 'Songwriter',
    'Nadia Reyes', 'Sep 2026', '25 plates · numbered', 'Kitchen, Enmore',
    [[0, 0, 'KETTLE'], [0, 36, 'VERSE'], [1, 44, 'CHOIR'], [3, 2, 'BRIDGE'], [4, 20, 'LAST LINE']],
    [
      'Cut from the kitchen demo because the “real” session never beat it. Kettle at the top, floorboards throughout, neighbours on the chorus whether they knew it or not.',
      'One take, one mic, one plate master. If you hear the fridge compressor you are listening correctly.',
    ],
    0.5,
  ),
  tr(
    'HWP-029',
    'Pressed in Gold',
    'Brass Section Pass',
    'Sable Coast',
    'Coral Static · HW-031',
    4, 18, 98, 'F minor', 'Harbour soul, gilt',
    'Felix Okafor', 'Sep 2026', '40 plates', 'Suite A, Surry Hills',
    [[0, 0, 'HORNS UP'], [0, 34, 'VERSE'], [1, 30, 'STAB'], [2, 26, 'BRASS BREAK'], [3, 36, 'GOLD RUN']],
    [
      'The album cut rebuilt around the brass until the groove had to wear a jacket. Recorded in a day, mixed in a night, cut before anyone sobered up and second-guessed it.',
      'Brass break at 2:26 slammed to tape twice. Headroom is a rumour on this plate — DJ-friendly, needle-tested, plant-approved.',
    ],
    0.4,
  ),
]

export const TRACK_BY_ID = new Map(TRACKS.map((t) => [t.id, t]))

/** Default session queue: three plates lined up like the engineer left them. */
export const DEFAULT_QUEUE: string[] = ['hwp-021', 'hwp-022', 'hwp-024']

/** Crossfade window in seconds. */
export const XFADE = 8

/* ------------------------------------------------------------ timing */

const pad2 = (n: number) => String(n).padStart(2, '0')

/** m:ss — queue rows, sleeves */
export function fmtMS(sec: number): string {
  const s = Math.max(0, Math.round(sec))
  return `${Math.floor(s / 60)}:${pad2(s % 60)}`
}

/** MM:SS·FF at 25fps — the deck timecode */
export function fmtTC(sec: number, signed = false): string {
  const neg = sec < 0
  const a = Math.abs(sec)
  const m = Math.floor(a / 60)
  const s = Math.floor(a % 60)
  const f = Math.floor((a - Math.floor(a)) * 25)
  return `${signed ? (neg ? '−' : '+') : ''}${pad2(m)}:${pad2(s)}·${pad2(f)}`
}

/* ------------------------------------------------------------ waveform */

/**
 * Deterministic, musical-looking peak series for a track: section-level
 * amplitude envelope, beat transients every bar, detail noise — smoothed.
 * n columns, values 0..1.
 */
export function peaksFor(track: DeckTrack, n = 432): Float32Array {
  const rnd = mulberry(track.seed)
  const sections = 7 + Math.floor(rnd() * 3)
  const bounds: number[] = [0]
  let acc = 0
  for (let i = 1; i < sections; i++) {
    acc += 0.6 + rnd() * 1.4
    bounds.push(acc)
  }
  bounds.push(acc + 1.2)
  const total = bounds[bounds.length - 1] ?? 1
  for (let i = 0; i < bounds.length; i++) bounds[i] = (bounds[i] ?? 0) / total

  const levels: number[] = []
  let level = 0.3 + rnd() * 0.15 // intro
  for (let i = 0; i < sections; i++) {
    levels.push(level)
    level = Math.min(1, Math.max(0.28, level + (rnd() - 0.42) * 0.5))
  }
  levels[levels.length - 1] = 0.32 + rnd() * 0.12 // outro pulls back

  const beat = 60 / track.bpm
  const raw = new Float32Array(n)
  for (let c = 0; c < n; c++) {
    const u = c / n
    let si = 0
    while (si < sections - 1 && u > (bounds[si + 1] ?? 1)) si++
    const base = levels[si] ?? 0.5
    const t = u * track.dur
    const phase = (t % beat) / beat
    const bar = Math.floor(t / beat) % 4
    const transient = Math.exp(-phase * 7) * (bar === 0 ? 0.5 : 0.28)
    const detail = (rnd() - 0.5) * 0.34
    raw[c] = Math.min(1, Math.max(0.06, base * 0.72 + transient + detail))
  }
  // one smoothing pass
  const out = new Float32Array(n)
  for (let c = 0; c < n; c++) {
    const a = raw[Math.max(0, c - 1)] ?? 0
    const b = raw[c] ?? 0
    const d = raw[Math.min(n - 1, c + 1)] ?? 0
    out[c] = (a + b * 2 + d) / 4
  }
  return out
}

/** Beat times + bar flags across the track. */
export function beatsFor(track: DeckTrack): { beats: number[]; bars: number[] } {
  const beat = 60 / track.bpm
  const beats: number[] = []
  const bars: number[] = []
  let t = 0
  let i = 0
  while (t < track.dur) {
    beats.push(t)
    if (i % 4 === 0) bars.push(t)
    t += beat
    i++
  }
  return { beats, bars }
}

export const byId = (id: string): DeckTrack => {
  const t = TRACK_BY_ID.get(id)
  if (!t) throw new Error(`unknown plate ${id}`)
  return t
}
