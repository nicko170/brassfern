import { useCallback, useEffect, useRef, useState } from 'react'
import type { HAlbum } from './data'
import {
  ALBUMS,
  FEATURED,
  albumDuration,
  fmtTime,
  hashStr,
  lookup,
  waveBars,
} from './data'
import { createPlayer } from './engine'
import type { Player } from './engine'
import Sleeve, { Vinyl } from './Sleeve'
import './demo.css'

/**
 * Holloway Records — a label-site listening room.
 * Sleeve-art maximalism: deep aubergine, cream, hot coral. A persistent
 * player with a generative WebAudio sketch per track, queue management,
 * liner-notes drawer, full-screen now-playing and keyboard shortcuts.
 * Scoped under .hp; honours prefers-reduced-motion.
 */

interface Deck {
  q: string[]
  i: number
}

type Repeat = 'off' | 'all' | 'one'

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const ico = {
  stroke: {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const,
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
    </svg>
  )
}
function IconPause() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
      <rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
    </svg>
  )
}
function IconNext() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 5.5v13l8.5-6.5z" fill="currentColor" />
      <rect x="16" y="5" width="2.6" height="13" rx="1" fill="currentColor" />
    </svg>
  )
}
function IconPrev() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 5.5v13L9.5 12z" fill="currentColor" />
      <rect x="5.4" y="5" width="2.6" height="13" rx="1" fill="currentColor" />
    </svg>
  )
}
function IconShuffle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <path d="M3 7h4l10 10h4m0 0-2.4-2.4M21 17l-2.4 2.4M3 17h4l2.5-2.5M21 7l-2.4-2.4M21 7l-2.4 2.4M21 7h-4l-2.6 2.6" />
    </svg>
  )
}
function IconRepeat() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <path d="M17 3l3 3-3 3M7 21l-3-3 3-3" />
      <path d="M20 6H8a4 4 0 0 0-4 4v1M4 18h12a4 4 0 0 0 4-4v-1" />
    </svg>
  )
}
function IconRepeatOne() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <path d="M17 3l3 3-3 3M7 21l-3-3 3-3" />
      <path d="M20 6H8a4 4 0 0 0-4 4v1M4 18h12a4 4 0 0 0 4-4v-1" />
      <path d="M11 15.5v-5l-1.4.9" strokeWidth="1.8" />
    </svg>
  )
}
function IconQueue() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <path d="M4 6h16M4 11h16M4 16h7" />
      <path d="M16.5 14v6l5-3z" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.6" r="0.4" fill="currentColor" />
    </svg>
  )
}
function IconVolume() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" stroke="none" />
      <path d="M15 9.5a4 4 0 0 1 0 5M17.5 7a7.4 7.4 0 0 1 0 10" />
    </svg>
  )
}
function IconMute() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" stroke="none" />
      <path d="M15.5 9.5l5 5m0-5-5 5" />
    </svg>
  )
}
function IconExpand() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </svg>
  )
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
function IconUp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <path d="M6 14.5 12 8.5l6 6" />
    </svg>
  )
}
function IconDown() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...ico.stroke}>
      <path d="M6 9.5 12 15.5l6-6" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Waveform seek bar                                                   */
/* ------------------------------------------------------------------ */

function WaveSeek({
  trackId,
  dur,
  pos,
  playing,
  onSeek,
  big = false,
}: {
  trackId: string
  dur: number
  pos: number
  playing: boolean
  onSeek: (frac: number) => void
  big?: boolean
}) {
  const bars = waveBars(trackId, big ? 64 : 46)
  const ratio = dur > 0 ? clamp(pos / dur, 0, 1) : 0
  const played = Math.round(ratio * bars.length)
  return (
    <div className={`hp-wave ${playing ? 'is-live' : ''} ${big ? 'hp-wave--big' : ''}`}>
      <div className="hp-wave__bars" aria-hidden="true">
        {bars.map((h, i) => (
          <span
            key={i}
            className={`hp-wave__bar ${i < played ? 'is-played' : ''}`}
            style={{ height: `${Math.round(h * 100)}%`, animationDelay: `${(i % 9) * 0.09}s` }}
          />
        ))}
      </div>
      <input
        className="hp-wave__range"
        type="range"
        min={0}
        max={dur}
        step={1}
        value={Math.round(clamp(pos, 0, dur))}
        onChange={(e) => onSeek(Number(e.target.value) / dur)}
        aria-label="Seek through the track"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Track row                                                           */
/* ------------------------------------------------------------------ */

function TrackRow({
  album,
  no,
  active,
  onPlay,
  onQueue,
  onPlayNext,
}: {
  album: HAlbum
  no: number
  active: boolean
  onPlay: () => void
  onQueue: () => void
  onPlayNext: () => void
}) {
  const track = album.tracks[no]
  return (
    <li className={`hp-tr ${active ? 'is-active' : ''}`}>
      <button
        type="button"
        className="hp-tr__play"
        onClick={onPlay}
        aria-label={`Play “${track.title}” by ${album.artist}`}
        aria-current={active || undefined}
      >
        <span className="hp-tr__no">{String(track.no).padStart(2, '0')}</span>
        <span className="hp-tr__title">{track.title}</span>
        {track.lyrics && <span className="hp-tr__lens">lyrics</span>}
        <span className="hp-tr__dur">{fmtTime(track.dur)}</span>
        <span className="hp-tr__icon" aria-hidden="true">
          <IconPlay />
        </span>
      </button>
      <span className="hp-tr__acts">
        <button type="button" onClick={onPlayNext} aria-label={`Play “${track.title}” next`} title="Play next">
          ↑
        </button>
        <button type="button" onClick={onQueue} aria-label={`Add “${track.title}” to the queue`} title="Add to queue">
          +
        </button>
      </span>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* Main demo                                                           */
/* ------------------------------------------------------------------ */

export default function HollowayPlayer() {
  const [deck, setDeck] = useState<Deck>(() => ({ q: FEATURED.tracks.map((t) => t.id), i: 0 }))
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [pos, setPos] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<Repeat>('off')
  const [volume, setVolume] = useState(0.6)
  const [muted, setMuted] = useState(false)
  const [albumView, setAlbumView] = useState<string | null>(null)
  const [queueOpen, setQueueOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [nowOpen, setNowOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [announce, setAnnounce] = useState('')

  const engineRef = useRef<Player | null>(null)
  const albumSectionRef = useRef<HTMLElement | null>(null)
  const queueBtnRef = useRef<HTMLButtonElement | null>(null)
  const infoBtnRef = useRef<HTMLButtonElement | null>(null)

  const currentId = deck.q[deck.i] ?? null
  const current = currentId ? lookup(currentId) : null

  // Live snapshot for stable callbacks / keyboard handler.
  const sRef = useRef({ deck, shuffle, repeat, playing, pos, muted, volume })
  sRef.current = { deck, shuffle, repeat, playing, pos, muted, volume }

  /* ------------------------------ actions ------------------------- */

  const togglePlay = useCallback(() => {
    const s = sRef.current
    if (!s.deck.q.length) return
    setStarted(true)
    setPlaying((p) => {
      setAnnounce(p ? 'Paused.' : 'Playing.')
      return !p
    })
  }, [])

  const startDeck = useCallback((next: Deck) => {
    setDeck(next)
    setPos(0)
    setStarted(true)
    setPlaying(true)
  }, [])

  const playFromAlbum = useCallback(
    (album: HAlbum, trackIndex: number) => {
      startDeck({ q: album.tracks.map((t) => t.id), i: trackIndex })
    },
    [startDeck],
  )

  const advance = useCallback((auto: boolean) => {
    const s = sRef.current
    const d = s.deck
    if (!d.q.length) return
    let i: number
    if (s.shuffle && d.q.length > 1) {
      let j = d.i
      while (j === d.i) j = Math.floor(Math.random() * d.q.length)
      i = j
    } else {
      i = d.i + 1
      if (i >= d.q.length) {
        if (auto && s.repeat !== 'all') {
          setPlaying(false)
          setAnnounce('End of the queue. The needle is up.')
          return
        }
        i = 0
      }
    }
    setDeck({ ...d, i })
    setPos(0)
  }, [])

  const back = useCallback(() => {
    const s = sRef.current
    const d = s.deck
    if (!d.q.length) return
    if (s.pos > 3) {
      setPos(0)
      return
    }
    setDeck({ ...d, i: (d.i - 1 + d.q.length) % d.q.length })
    setPos(0)
  }, [])

  const seekTo = useCallback((frac: number) => {
    const s = sRef.current
    const d = s.deck
    const id = d.q[d.i]
    const c = id ? lookup(id) : null
    if (!c) return
    setPos(clamp(frac, 0, 1) * c.track.dur)
  }, [])

  const seekBy = useCallback(
    (delta: number) => {
      const s = sRef.current
      const d = s.deck
      const id = d.q[d.i]
      const c = id ? lookup(id) : null
      if (!c) return
      setPos(clamp(s.pos + delta, 0, c.track.dur))
    },
    [],
  )

  const queueTrack = useCallback((id: string) => {
    setDeck((d) => ({ ...d, q: [...d.q, id] }))
    const c = lookup(id)
    if (c) setAnnounce(`Added “${c.track.title}” to the queue.`)
  }, [])

  const playNext = useCallback((id: string) => {
    setDeck((d) => {
      if (!d.q.length) return { q: [id], i: 0 }
      const q = [...d.q]
      q.splice(d.i + 1, 0, id)
      return { ...d, q }
    })
    const c = lookup(id)
    if (c) setAnnounce(`“${c.track.title}” will play next.`)
  }, [])

  const queueAlbum = useCallback((album: HAlbum) => {
    const ids = album.tracks.map((t) => t.id)
    setDeck((d) => (d.q.length ? { ...d, q: [...d.q, ...ids] } : { q: ids, i: 0 }))
    setAnnounce(`Added ${album.tracks.length} tracks from “${album.title}” to the queue.`)
  }, [])

  const removeAt = useCallback((idx: number) => {
    const s = sRef.current
    const d = s.deck
    const wasCurrent = idx === d.i
    const c = lookup(d.q[idx])
    setDeck(() => {
      if (idx < 0 || idx >= d.q.length) return d
      const q = d.q.filter((_, j) => j !== idx)
      let i = d.i
      if (idx < d.i) i = d.i - 1
      else if (idx === d.i) i = Math.min(d.i, Math.max(0, q.length - 1))
      return { q, i }
    })
    if (wasCurrent) setPos(0)
    if (d.q.length <= 1) setPlaying(false)
    if (c) setAnnounce(`Removed “${c.track.title}” from the queue.`)
  }, [])

  const moveAt = useCallback((idx: number, dir: -1 | 1) => {
    setDeck((d) => {
      const j = idx + dir
      if (idx < 0 || j < 0 || idx >= d.q.length || j >= d.q.length) return d
      const q = [...d.q]
      const tmp = q[idx]
      q[idx] = q[j]
      q[j] = tmp
      let i = d.i
      if (d.i === idx) i = j
      else if (d.i === j) i = idx
      return { q, i }
    })
  }, [])

  const clearQueue = useCallback(() => {
    setDeck({ q: [], i: 0 })
    setPlaying(false)
    setStarted(false)
    setPos(0)
    setAnnounce('Queue cleared. The deck is empty.')
  }, [])

  const shuffleCrate = useCallback(() => {
    const ids = ALBUMS.flatMap((a) => a.tracks.map((t) => t.id))
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = ids[i]
      ids[i] = ids[j]
      ids[j] = tmp
    }
    startDeck({ q: ids, i: 0 })
    setShuffle(true)
    setAnnounce('Shuffling the whole crate.')
  }, [startDeck])

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => {
      const next: Repeat = r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'
      setAnnounce(
        next === 'off' ? 'Repeat off.' : next === 'all' ? 'Repeating the queue.' : 'Repeating this track.',
      )
      return next
    })
  }, [])

  const toggleShuffle = useCallback(() => {
    setShuffle((s) => {
      setAnnounce(s ? 'Shuffle off.' : 'Shuffle on.')
      return !s
    })
  }, [])

  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  const openAlbum = useCallback((id: string) => {
    setAlbumView(id)
    window.setTimeout(() => {
      albumSectionRef.current?.scrollIntoView({
        behavior: reduced() ? 'auto' : 'smooth',
        block: 'start',
      })
    }, 30)
  }, [])

  /* ------------------------------ effects ------------------------- */

  // Generative audio follows transport state.
  useEffect(() => {
    const eng = (engineRef.current ??= createPlayer())
    if (playing && current) {
      eng.start({ seed: hashStr(current.track.id), bpm: current.album.bpm, root: current.album.root })
    } else {
      eng.stop()
    }
  }, [playing, currentId])

  useEffect(() => {
    engineRef.current?.setVolume(muted ? 0 : volume)
  }, [muted, volume])

  // Stop sound on unmount.
  useEffect(
    () => () => {
      engineRef.current?.stop()
    },
    [],
  )

  // Position clock.
  useEffect(() => {
    if (!playing || !current) return
    const t = window.setInterval(() => setPos((p) => p + 0.2), 200)
    return () => window.clearInterval(t)
  }, [playing, currentId])

  // End of track.
  useEffect(() => {
    if (!current || !playing) return
    if (pos < current.track.dur) return
    if (repeat === 'one') {
      setPos(0)
      return
    }
    advance(true)
  }, [pos, playing, current, repeat, advance])

  // Announce track changes.
  useEffect(() => {
    if (!current) return
    setAnnounce(`Now playing “${current.track.title}” by ${current.album.artist}.`)
  }, [currentId])

  // Focus management for modal-ish overlays.
  useEffect(() => {
    if (!nowOpen) return
    const el = document.querySelector<HTMLButtonElement>('.hp-now__close')
    el?.focus()
  }, [nowOpen])
  useEffect(() => {
    if (!helpOpen) return
    const el = document.querySelector<HTMLButtonElement>('.hp-help__close')
    el?.focus()
  }, [helpOpen])

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tgt = e.target as HTMLElement | null
      const inField = !!tgt?.closest('input, textarea, select, [contenteditable="true"]')
      if (e.key === 'Escape') {
        if (helpOpen) setHelpOpen(false)
        else if (nowOpen) setNowOpen(false)
        else if (infoOpen) {
          setInfoOpen(false)
          infoBtnRef.current?.focus()
        } else if (queueOpen) {
          setQueueOpen(false)
          queueBtnRef.current?.focus()
        }
        return
      }
      if (inField) return
      const key = e.key.toLowerCase()
      if ((key === ' ' || key === 'spacebar') && tgt?.closest('button, a')) return
      switch (key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'j':
          seekBy(-10)
          break
        case 'l':
          seekBy(10)
          break
        case 'arrowleft':
          e.preventDefault()
          seekBy(-10)
          break
        case 'arrowright':
          e.preventDefault()
          seekBy(10)
          break
        case 'arrowup':
          e.preventDefault()
          setVolume((v) => clamp(v + 0.1, 0, 1))
          setMuted(false)
          break
        case 'arrowdown':
          e.preventDefault()
          setVolume((v) => clamp(v - 0.1, 0, 1))
          setMuted(false)
          break
        case 'n':
          advance(false)
          break
        case 'p':
          back()
          break
        case 's':
          toggleShuffle()
          break
        case 'r':
          cycleRepeat()
          break
        case 'm':
          toggleMute()
          break
        case 'q':
          setQueueOpen((o) => !o)
          break
        case 'i':
          setInfoOpen((o) => !o)
          break
        case 'f':
          if (sRef.current.deck.q.length) setNowOpen((o) => !o)
          break
        case '?':
          setHelpOpen((o) => !o)
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [helpOpen, nowOpen, infoOpen, queueOpen, togglePlay, seekBy, advance, back, toggleShuffle, cycleRepeat, toggleMute])

  /* ------------------------------ derived ------------------------- */

  const viewedAlbum = albumView ? ALBUMS.find((a) => a.id === albumView) ?? null : null
  const queueRefs = deck.q.map((id) => lookup(id)).filter((r): r is NonNullable<typeof r> => r !== null)
  const queueTotal = queueRefs.reduce((n, r) => n + r.track.dur, 0)

  const repeatLabel = repeat === 'off' ? 'Repeat: off' : repeat === 'all' ? 'Repeat: queue' : 'Repeat: this track'

  const transport = (size: 'small' | 'big') => (
    <div className={`hp-transport hp-transport--${size}`}>
      <button
        type="button"
        className={`hp-tbtn ${shuffle ? 'is-on' : ''}`}
        onClick={toggleShuffle}
        aria-pressed={shuffle}
        aria-label={shuffle ? 'Shuffle is on' : 'Shuffle is off'}
        title="Shuffle (S)"
      >
        <IconShuffle />
      </button>
      <button
        type="button"
        className="hp-tbtn"
        onClick={back}
        disabled={!deck.q.length}
        aria-label="Previous track"
        title="Previous (P)"
      >
        <IconPrev />
      </button>
      <button
        type="button"
        className={`hp-tbtn hp-tbtn--play`}
        onClick={togglePlay}
        disabled={!deck.q.length}
        aria-label={playing ? 'Pause' : 'Play'}
        title="Play / pause (Space)"
      >
        {playing ? <IconPause /> : <IconPlay />}
      </button>
      <button
        type="button"
        className="hp-tbtn"
        onClick={() => advance(false)}
        disabled={!deck.q.length}
        aria-label="Next track"
        title="Next (N)"
      >
        <IconNext />
      </button>
      <button
        type="button"
        className={`hp-tbtn ${repeat !== 'off' ? 'is-on' : ''}`}
        onClick={cycleRepeat}
        aria-pressed={repeat !== 'off'}
        aria-label={repeatLabel}
        title="Repeat (R)"
      >
        {repeat === 'one' ? <IconRepeatOne /> : <IconRepeat />}
      </button>
    </div>
  )

  /* ------------------------------ render -------------------------- */

  return (
    <div className="hp">
      {/* screen-reader announcements */}
      <p className="hp-sr" role="status" aria-live="polite">
        {announce}
      </p>

      {/* masthead */}
      <header className="hp-mast">
        <div className="hp-mast__row">
          <div>
            <p className="hp-mast__kicker">Independent label · Sydney · est. 2011</p>
            <h1 className="hp-mast__word">
              Holloway <em>Records</em>
            </h1>
          </div>
          <div className="hp-mast__meta">
            <p>
              A listening room, not a flyer board. Every record below plays in the deck — a
              generative sketch stands in for the audio so nothing here auto-blares.
            </p>
            <p className="hp-mast__stats">
              <span>{ALBUMS.length} releases in the crate</span>
              <span>{ALBUMS.reduce((n, a) => n + a.tracks.length, 0)} tracks</span>
              <span>no ads, ever</span>
            </p>
            <button type="button" className="hp-mast__keys" onClick={() => setHelpOpen(true)}>
              Keyboard shortcuts <kbd>?</kbd>
            </button>
          </div>
        </div>
        <div className="hp-ticker" aria-hidden="true">
          <div className="hp-ticker__in">
            {[0, 1].map((n) => (
              <span key={n}>
                Now pressing — Sable Coast “Coral Static”, 350 copies on coral marble · Pelican Club
                first repress, gone in eleven days · Members hear full records before anyone ·
                Holloway Records, the listening room of Surry Hills ·
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* featured pressing */}
      <section className="hp-feature" aria-labelledby="hp-feature-h">
        <div className="hp-feature__art">
          <Vinyl album={FEATURED} spinning={playing && current?.album.id === FEATURED.id} className="hp-feature__vinyl" />
          <Sleeve album={FEATURED} className="hp-feature__sleeve" />
        </div>
        <div className="hp-feature__copy">
          <p className="hp-kicker">
            {FEATURED.cat} · {FEATURED.year} · {FEATURED.genre}
          </p>
          <h2 className="hp-feature__title" id="hp-feature-h">
            {FEATURED.title}
          </h2>
          <p className="hp-feature__artist">{FEATURED.artist}</p>
          <p className="hp-feature__liner">{FEATURED.liner}</p>
          <blockquote className="hp-cass">
            <p>“{FEATURED.cassNote}”</p>
            <cite>— Cass Ando, label founder</cite>
          </blockquote>
          <div className="hp-feature__cta">
            <button type="button" className="hp-btn hp-btn--coral" onClick={() => playFromAlbum(FEATURED, 0)}>
              <IconPlay /> Play the pressing
            </button>
            <button type="button" className="hp-btn hp-btn--ghost" onClick={() => queueAlbum(FEATURED)}>
              Add to queue · {FEATURED.tracks.length} tracks
            </button>
          </div>
          <p className="hp-mono-note">
            {FEATURED.pressing} · {fmtTime(albumDuration(FEATURED))}
          </p>
        </div>
      </section>

      {/* the crate */}
      <section className="hp-crate" ref={albumSectionRef} aria-labelledby="hp-crate-h">
        <div className="hp-crate__head">
          <div>
            <p className="hp-kicker">The catalogue</p>
            <h2 className="hp-h2" id="hp-crate-h">
              The crate
            </h2>
          </div>
          <button type="button" className="hp-btn hp-btn--ghost" onClick={shuffleCrate}>
            <IconShuffle /> Shuffle the whole crate
          </button>
        </div>

        {viewedAlbum ? (
          <div className="hp-albumview">
            <button type="button" className="hp-backbtn" onClick={() => setAlbumView(null)}>
              ← Back to the crate
            </button>
            <div className="hp-albumview__grid">
              <div className="hp-albumview__art">
                <Vinyl
                  album={viewedAlbum}
                  spinning={playing && current?.album.id === viewedAlbum.id}
                  className="hp-albumview__vinyl"
                />
                <Sleeve album={viewedAlbum} className="hp-albumview__sleeve" decorative={false} />
              </div>
              <div>
                <p className="hp-kicker">
                  {viewedAlbum.cat} · {viewedAlbum.year} · {viewedAlbum.genre}
                </p>
                <h3 className="hp-albumview__title">{viewedAlbum.title}</h3>
                <p className="hp-albumview__artist">{viewedAlbum.artist}</p>
                <div className="hp-chips" aria-label="Release details">
                  <span className="hp-chip">{viewedAlbum.tracks.length} tracks</span>
                  <span className="hp-chip">{fmtTime(albumDuration(viewedAlbum))}</span>
                  <span className="hp-chip">{viewedAlbum.pressing}</span>
                </div>
                <p className="hp-albumview__liner">{viewedAlbum.liner}</p>
                <blockquote className="hp-cass">
                  <p>“{viewedAlbum.cassNote}”</p>
                  <cite>— Cass Ando</cite>
                </blockquote>
                <div className="hp-feature__cta">
                  <button
                    type="button"
                    className="hp-btn hp-btn--coral"
                    onClick={() => playFromAlbum(viewedAlbum, 0)}
                  >
                    <IconPlay /> Play this record
                  </button>
                  <button type="button" className="hp-btn hp-btn--ghost" onClick={() => queueAlbum(viewedAlbum)}>
                    Add to queue
                  </button>
                </div>
                <ol className="hp-tracklist" aria-label={`${viewedAlbum.title} tracklist`}>
                  {viewedAlbum.tracks.map((_, ti) => (
                    <TrackRow
                      key={viewedAlbum.tracks[ti].id}
                      album={viewedAlbum}
                      no={ti}
                      active={deck.q[deck.i] === viewedAlbum.tracks[ti].id}
                      onPlay={() => playFromAlbum(viewedAlbum, ti)}
                      onQueue={() => queueTrack(viewedAlbum.tracks[ti].id)}
                      onPlayNext={() => playNext(viewedAlbum.tracks[ti].id)}
                    />
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <ul className="hp-grid" aria-label="All releases">
            {ALBUMS.map((album) => (
              <li key={album.id} className="hp-card">
                <button
                  type="button"
                  className="hp-card__art"
                  onClick={() => openAlbum(album.id)}
                  aria-label={`Open “${album.title}” by ${album.artist}`}
                >
                  <Sleeve album={album} className="hp-card__sleeve" />
                  <span className="hp-card__hover" aria-hidden="true">
                    <IconPlay />
                  </span>
                </button>
                <div className="hp-card__meta">
                  <button type="button" className="hp-card__title" onClick={() => openAlbum(album.id)}>
                    {album.title}
                  </button>
                  <p className="hp-card__artist">{album.artist}</p>
                  <p className="hp-card__sub">
                    {album.cat} · {album.year} · {album.tracks.length} tracks
                  </p>
                </div>
                <div className="hp-card__acts">
                  <button
                    type="button"
                    onClick={() => playFromAlbum(album, 0)}
                    aria-label={`Play “${album.title}”`}
                    title="Play now"
                  >
                    <IconPlay />
                  </button>
                  <button
                    type="button"
                    onClick={() => queueAlbum(album)}
                    aria-label={`Add “${album.title}” to the queue`}
                    title="Queue record"
                  >
                    <IconQueue />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* footer note */}
      <footer className="hp-footer">
        <p>
          Holloway Records is a fictional label invented by Brassfern. Every artist, lyric and
          pressing above is made up. The sound is a generative sketch tuned per record — a stand-in
          for the real audio, because this is a demo and we respect your speakers.
        </p>
        <p className="hp-footer__sig">HW · Surry Hills NSW · “Paid by the record, not the ad.”</p>
      </footer>

      {/* -------------------------- player bar ---------------------- */}
      <footer className="hp-player" aria-label="Record deck">
        <div className="hp-player__now">
          {current ? (
            <>
              <span className={`hp-player__disc ${playing ? 'is-live' : ''}`} aria-hidden="true">
                <span
                  className="hp-player__disc-label"
                  style={{ background: current.album.palette.accent }}
                />
              </span>
              <span className="hp-player__text">
                <strong>{current.track.title}</strong>
                <span>
                  {current.album.artist} · {current.album.cat}
                </span>
              </span>
            </>
          ) : (
            <span className="hp-player__empty">Nothing on the deck — pick a record above.</span>
          )}
        </div>

        <div className="hp-player__mid">
          {transport('small')}
          <div className="hp-player__scrub">
            <span className="hp-player__time">{current ? fmtTime(pos) : '—:—'}</span>
            {current ? (
              <WaveSeek trackId={current.track.id} dur={current.track.dur} pos={pos} playing={playing} onSeek={seekTo} />
            ) : (
              <span className="hp-player__spacer" aria-hidden="true" />
            )}
            <span className="hp-player__time">{current ? `-${fmtTime(Math.max(0, current.track.dur - pos))}` : '—:—'}</span>
          </div>
        </div>

        <div className="hp-player__side">
          <div className="hp-player__vol">
            <button
              type="button"
              className="hp-ibtn"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              aria-pressed={muted}
              title="Mute (M)"
            >
              {muted ? <IconMute /> : <IconVolume />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value))
                setMuted(false)
              }}
              aria-label="Volume"
              style={{ ['--hp-fill' as string]: `${(muted ? 0 : volume) * 100}%` }}
            />
          </div>
          <button
            type="button"
            className={`hp-ibtn ${queueOpen ? 'is-on' : ''}`}
            onClick={() => setQueueOpen((o) => !o)}
            aria-expanded={queueOpen}
            aria-label={`Play queue, ${deck.q.length} tracks`}
            title="Queue (Q)"
            ref={queueBtnRef}
          >
            <IconQueue />
            {deck.q.length > 0 && <span className="hp-badge">{deck.q.length}</span>}
          </button>
          <button
            type="button"
            className={`hp-ibtn ${infoOpen ? 'is-on' : ''}`}
            onClick={() => setInfoOpen((o) => !o)}
            aria-expanded={infoOpen}
            aria-label="Liner notes and lyrics"
            title="Liner notes (I)"
            ref={infoBtnRef}
          >
            <IconInfo />
          </button>
          <button
            type="button"
            className="hp-ibtn"
            onClick={() => current && setNowOpen(true)}
            disabled={!current}
            aria-label="Open now-playing view"
            title="Now playing (F)"
          >
            <IconExpand />
          </button>
        </div>
      </footer>

      {/* -------------------------- queue panel --------------------- */}
      {queueOpen && (
        <aside className="hp-queue" aria-label="Play queue" role="region">
          <div className="hp-panel__head">
            <h2 className="hp-panel__title">
              Up next
              {queueTotal > 0 && <span className="hp-panel__sub"> · {fmtTime(queueTotal)}</span>}
            </h2>
            <button type="button" className="hp-ibtn" onClick={() => setQueueOpen(false)} aria-label="Close queue">
              <IconClose />
            </button>
          </div>
          {deck.q.length === 0 ? (
            <p className="hp-panel__empty">The queue is empty. Add a record from the crate.</p>
          ) : (
            <>
              <ol className="hp-queue__list">
                {deck.q.map((id, qi) => {
                  const ref = lookup(id)
                  if (!ref) return null
                  const isCurrent = qi === deck.i
                  return (
                    <li key={`${id}-${qi}`} className={`hp-queue__row ${isCurrent ? 'is-current' : ''}`}>
                      <button
                        type="button"
                        className="hp-queue__jump"
                        onClick={() => {
                          setDeck({ ...deck, i: qi })
                          setPos(0)
                          setStarted(true)
                          setPlaying(true)
                        }}
                        aria-label={
                          isCurrent
                            ? `“${ref.track.title}” by ${ref.album.artist} — playing now`
                            : `Play “${ref.track.title}” by ${ref.album.artist} now`
                        }
                      >
                        <span className="hp-queue__no">{isCurrent ? (playing ? '▶' : '‖') : String(qi + 1).padStart(2, '0')}</span>
                        <span className="hp-queue__text">
                          <strong>{ref.track.title}</strong>
                          <span>{ref.album.artist}</span>
                        </span>
                        <span className="hp-queue__dur">{fmtTime(ref.track.dur)}</span>
                      </button>
                      <span className="hp-queue__acts">
                        <button type="button" onClick={() => moveAt(qi, -1)} disabled={qi === 0} aria-label={`Move “${ref.track.title}” up`}>
                          <IconUp />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveAt(qi, 1)}
                          disabled={qi === deck.q.length - 1}
                          aria-label={`Move “${ref.track.title}” down`}
                        >
                          <IconDown />
                        </button>
                        <button type="button" onClick={() => removeAt(qi)} aria-label={`Remove “${ref.track.title}” from the queue`}>
                          <IconClose />
                        </button>
                      </span>
                    </li>
                  )
                })}
              </ol>
              <button type="button" className="hp-queue__clear" onClick={clearQueue}>
                Clear queue
              </button>
            </>
          )}
        </aside>
      )}

      {/* -------------------------- liner drawer -------------------- */}
      {infoOpen && current && (
        <aside className="hp-drawer" aria-label="Liner notes" role="region">
          <div className="hp-panel__head">
            <h2 className="hp-panel__title">Liner notes</h2>
            <button type="button" className="hp-ibtn" onClick={() => setInfoOpen(false)} aria-label="Close liner notes">
              <IconClose />
            </button>
          </div>
          <div className="hp-drawer__scroll">
            <button type="button" className="hp-drawer__art" onClick={() => openAlbum(current.album.id)}>
              <Sleeve album={current.album} className="hp-drawer__sleeve" />
              <span className="hp-drawer__art-hint">View “{current.album.title}” in the crate</span>
            </button>
            <p className="hp-kicker">
              {current.album.cat} · {current.album.year} · {current.album.genre}
            </p>
            <h3 className="hp-drawer__track">
              {current.track.title} <span>— {current.album.artist}</span>
            </h3>
            <p className="hp-drawer__liner">{current.album.liner}</p>
            <blockquote className="hp-cass">
              <p>“{current.album.cassNote}”</p>
              <cite>— Cass Ando</cite>
            </blockquote>
            {current.track.lyrics ? (
              <div className="hp-lyrics" aria-label={`Lyrics for ${current.track.title}`}>
                <p className="hp-kicker">Lyrics</p>
                {current.track.lyrics.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ) : (
              <p className="hp-lyrics hp-lyrics--instr">Instrumental — no lyrics in the pressing notes.</p>
            )}
            <p className="hp-mono-note">{current.album.pressing}</p>
          </div>
        </aside>
      )}

      {/* -------------------------- now playing overlay ------------- */}
      {nowOpen && current && (
        <div className="hp-now" role="dialog" aria-modal="true" aria-label="Now playing">
          <button
            type="button"
            className="hp-now__scrim"
            onClick={() => setNowOpen(false)}
            aria-label="Close now-playing view"
            tabIndex={-1}
          />
          <div className="hp-now__stage">
            <button type="button" className="hp-ibtn hp-now__close" onClick={() => setNowOpen(false)} aria-label="Close now-playing view">
              <IconClose />
            </button>
            <div className="hp-now__art">
              <Vinyl album={current.album} spinning={playing} className="hp-now__vinyl" />
              <Sleeve album={current.album} className="hp-now__sleeve" />
            </div>
            <div className="hp-now__info">
              <p className="hp-kicker">
                {current.album.cat} · track {deck.i + 1} of {deck.q.length}
              </p>
              <h2 className="hp-now__title">{current.track.title}</h2>
              <p className="hp-now__artist">
                {current.album.artist} — <em>{current.album.title}</em> ({current.album.year})
              </p>
              {transport('big')}
              <div className="hp-now__scrub">
                <span className="hp-player__time">{fmtTime(pos)}</span>
                <WaveSeek trackId={current.track.id} dur={current.track.dur} pos={pos} playing={playing} onSeek={seekTo} big />
                <span className="hp-player__time">{fmtTime(current.track.dur)}</span>
              </div>
              {current.track.lyrics ? (
                <div className="hp-lyrics hp-now__lyrics">
                  <p className="hp-kicker">Lyrics</p>
                  {current.track.lyrics.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="hp-lyrics hp-lyrics--instr">Instrumental — put the window down and drive.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------- help overlay -------------------- */}
      {helpOpen && (
        <div className="hp-help" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
          <button type="button" className="hp-now__scrim" onClick={() => setHelpOpen(false)} aria-label="Close shortcuts" tabIndex={-1} />
          <div className="hp-help__card">
            <div className="hp-panel__head">
              <h2 className="hp-panel__title">Keyboard shortcuts</h2>
              <button type="button" className="hp-ibtn hp-help__close" onClick={() => setHelpOpen(false)} aria-label="Close shortcuts">
                <IconClose />
              </button>
            </div>
            <dl className="hp-help__list">
              <div><dt><kbd>Space</kbd> / <kbd>K</kbd></dt><dd>Play or pause</dd></div>
              <div><dt><kbd>J</kbd> / <kbd>L</kbd> or <kbd>←</kbd> / <kbd>→</kbd></dt><dd>Seek back / forward 10s</dd></div>
              <div><dt><kbd>N</kbd> / <kbd>P</kbd></dt><dd>Next / previous track</dd></div>
              <div><dt><kbd>S</kbd></dt><dd>Toggle shuffle</dd></div>
              <div><dt><kbd>R</kbd></dt><dd>Cycle repeat: off → queue → track</dd></div>
              <div><dt><kbd>↑</kbd> / <kbd>↓</kbd></dt><dd>Volume up / down</dd></div>
              <div><dt><kbd>M</kbd></dt><dd>Mute</dd></div>
              <div><dt><kbd>Q</kbd></dt><dd>Toggle the queue</dd></div>
              <div><dt><kbd>I</kbd></dt><dd>Liner notes &amp; lyrics</dd></div>
              <div><dt><kbd>F</kbd></dt><dd>Full-screen now playing</dd></div>
              <div><dt><kbd>Esc</kbd></dt><dd>Close panels</dd></div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
