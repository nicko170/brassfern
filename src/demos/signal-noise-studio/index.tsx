import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import './demo.css'
import CoverArt from './Covers'
import Player from './Player'
import ClipMaker, { clipFromHash } from './ClipMaker'
import {
  EPISODES,
  RATES,
  SHOWS,
  episodesOf,
  fmtDur,
  fmtTime,
  getEpisode,
  getShow,
  nextInShow,
  seasonsOf,
  type ClipShare,
  type Episode,
} from './data'

/**
 * Signal & Noise Studio — the listening home of a fictional nine-show
 * podcast network. Broadcast-industrial art direction: deep teal night,
 * cream condensed lettering, signal-red accents. The docked player is the
 * spine; everything else — the show reel, the dial browser, the clip
 * maker, the subscribe hub — hangs off it. Silent simulation, no audio.
 */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

const FEATURED = EPISODES.reduce((a, b) => (a.date > b.date ? a : b))

const PLATFORMS = ['Apple Podcasts', 'Spotify', 'Pocket Casts', 'Overcast', 'YouTube', 'RSS']

const fmtDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d ?? 1} ${months[(m ?? 1) - 1] ?? ''} ${y ?? ''}`
}

export default function SignalNoiseStudio() {
  const reduced = usePrefersReducedMotion()
  const [current, setCurrent] = useState<Episode | null>(null)
  const [pos, setPos] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [rateIdx, setRateIdx] = useState(0)
  const [guard, setGuard] = useState<{ a: number; b: number } | null>(null)
  const [clip, setClip] = useState<{ ep: Episode; initial: ClipShare | null } | null>(null)
  const [announce, setAnnounce] = useState('')

  const [showFilter, setShowFilter] = useState<string>('all')
  const [seasonFilter, setSeasonFilter] = useState<string>('all')

  const posRef = useRef(0)
  const guardRef = useRef<{ a: number; b: number } | null>(null)
  const dialRef = useRef<HTMLElement>(null)

  /* ---------------------------------------------------------- playback */

  const playEpisode = useCallback((ep: Episode, at = 0, keepPlaying = true) => {
    posRef.current = at
    setCurrent(ep)
    setPos(at)
    guardRef.current = null
    setGuard(null)
    setPlaying(keepPlaying)
    const show = getShow(ep.showId)
    setAnnounce(`Now playing: ${ep.title} — ${show?.title ?? ''}`)
  }, [])

  const seek = useCallback((t: number) => {
    const v = Math.max(0, Math.min(current?.duration ?? 0, t))
    posRef.current = v
    setPos(v)
    guardRef.current = null
    setGuard(null)
  }, [current])

  useEffect(() => {
    if (!playing || !current) return
    const stepMs = reduced ? 400 : 200
    const id = window.setInterval(() => {
      const rate = RATES[rateIdx] ?? 1
      let np = posRef.current + (stepMs / 1000) * rate
      const g = guardRef.current
      if (g && np >= g.b) {
        np = g.b
        guardRef.current = null
        setGuard(null)
        setPlaying(false)
        setAnnounce('Clip finished')
      } else if (np >= current.duration) {
        const nx = nextInShow(current)
        if (nx && !reduced) {
          playEpisode(nx, 0, true)
          return
        }
        np = current.duration
        setPlaying(false)
        setAnnounce('Episode finished')
      }
      posRef.current = np
      setPos(np)
    }, stepMs)
    return () => window.clearInterval(id)
  }, [playing, current, rateIdx, reduced, playEpisode])

  /* --------------------------------------------------- clip deep link */

  useEffect(() => {
    const fromHash = () => {
      const c = clipFromHash()
      if (!c) return
      const ep = getEpisode(c.e)
      if (!ep) return
      const a = Math.max(0, Math.min(ep.duration - 15, c.a))
      const b = Math.min(ep.duration, Math.max(a + 15, c.b))
      setClip({ ep, initial: { ...c, a, b } })
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const playClip = useCallback(
    (a: number, b: number) => {
      if (!clip) return
      guardRef.current = { a, b }
      setGuard({ a, b })
      posRef.current = a
      setPos(a)
      setCurrent(clip.ep)
      setPlaying(true)
      setAnnounce(`Playing clip: ${clip.initial?.t || clip.ep.title}, ${Math.round(b - a)} seconds`)
      setClip(null)
    },
    [clip],
  )

  /* ----------------------------------------------------------- filter */

  const seasons = seasonsOf(showFilter === 'all' ? EPISODES[0]?.showId ?? '' : showFilter)
  const visible = useMemo(() => {
    let list = showFilter === 'all' ? EPISODES : episodesOf(showFilter)
    if (seasonFilter !== 'all' && showFilter !== 'all') {
      const s = Number(seasonFilter)
      list = list.filter((e) => e.season === s)
    }
    return list
  }, [showFilter, seasonFilter])

  const pickShow = (id: string) => {
    setShowFilter(id)
    setSeasonFilter('all')
    dialRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const currentShow = current ? getShow(current.showId) : undefined
  const next = current ? nextInShow(current) : null

  return (
    <div className={`sns${reduced ? ' sns--calm' : ''}`}>
      <p className="sns-visuallyhidden" aria-live="polite">{announce}</p>

      {/* ---------------------------------------------------------- hero */}
      <header className="sns-hero">
        <div className="sns-hero__top mono">
          <span>Collingwood · Naarm</span>
          <span>Broadcast co-op est. 2019</span>
          <span className="sns-hero__live">
            <span className="sns-dot" aria-hidden="true" /> On air now
          </span>
        </div>
        <h1 className="sns-hero__title">
          <span className="sns-hero__line">Signal</span>
          <span className="sns-hero__amp" aria-hidden="true">&amp;</span>
          <span className="sns-hero__line sns-hero__line--indent">Noise</span>
        </h1>
        <div className="sns-eq" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} style={{ animationDelay: `${(i % 9) * 0.13}s`, animationDuration: `${1.6 + (i % 5) * 0.42}s` }} />
          ))}
        </div>
        <p className="sns-hero__lede">
          Nine shows about birds, workplace policy, grid frequency, forged parchment
          and one extremely contested kettle. Every listen lands here first: a site
          the network actually owns.
        </p>
        <div className="sns-hero__cta">
          <button
            type="button"
            className="sns-btn sns-btn--signal sns-btn--big"
            onClick={() => playEpisode(FEATURED)}
          >
            ▶ Tune in — {FEATURED.title}
          </button>
          <span className="mono sns-hero__stat">9 shows · {EPISODES.length} episodes · 1.9M listens/mo<sup>*</sup></span>
        </div>
      </header>

      {/* ----------------------------------------------------- show reel */}
      <section className="sns-section" id="sns-network" aria-labelledby="sns-network-h">
        <div className="sns-section__head">
          <span className="mono sns-over">01 — The network</span>
          <h2 className="sns-h2" id="sns-network-h">Nine voices, one switchboard</h2>
        </div>
        <div className="sns-reel" role="list">
          {SHOWS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="listitem"
              className={`sns-card${showFilter === s.id ? ' is-active' : ''}`}
              style={{ '--acc': s.accent } as CSSProperties}
              onClick={() => pickShow(showFilter === s.id ? 'all' : s.id)}
              aria-pressed={showFilter === s.id}
            >
              <CoverArt show={s} className="sns-card__art" />
              <span className="sns-card__id mono">{s.genre}</span>
              <span className="sns-card__title">{s.title}</span>
              <span className="sns-card__hosts">{s.hosts}</span>
              <span className="sns-card__cad mono">{s.cadence}</span>
            </button>
          ))}
        </div>
        <p className="sns-note mono"><sup>*</sup> Illustrative figure from a fictional network. Tap a show to tune the dial.</p>
      </section>

      {/* ------------------------------------------------------ the dial */}
      <section className="sns-section" id="sns-dial" ref={dialRef} aria-labelledby="sns-dial-h">
        <div className="sns-section__head">
          <span className="mono sns-over">02 — On the dial</span>
          <h2 className="sns-h2" id="sns-dial-h">Episode index</h2>
        </div>

        <div className="sns-filters">
          <div className="sns-chips" role="group" aria-label="Filter by show">
            <button
              type="button"
              className={`sns-chip${showFilter === 'all' ? ' is-on' : ''}`}
              onClick={() => {
                setShowFilter('all')
                setSeasonFilter('all')
              }}
            >
              All <span className="sns-chip__n">{EPISODES.length}</span>
            </button>
            {SHOWS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`sns-chip${showFilter === s.id ? ' is-on' : ''}`}
                style={{ '--acc': s.accent } as CSSProperties}
                onClick={() => {
                  setShowFilter(s.id)
                  setSeasonFilter('all')
                }}
                aria-pressed={showFilter === s.id}
              >
                {s.title} <span className="sns-chip__n">{episodesOf(s.id).length}</span>
              </button>
            ))}
          </div>
          {showFilter !== 'all' && seasons.length > 1 && (
            <label className="sns-season">
              <span className="mono">Season</span>
              <select
                className="sns-select"
                value={seasonFilter}
                onChange={(e) => setSeasonFilter(e.target.value)}
              >
                <option value="all">All seasons</option>
                {seasons.map((s) => (
                  <option key={s} value={s}>Season {s}</option>
                ))}
              </select>
            </label>
          )}
          <span className="sns-count mono" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'episode' : 'episodes'} on the dial
          </span>
        </div>

        <ol className="sns-list">
          {visible.map((ep) => {
            const show = getShow(ep.showId)
            if (!show) return null
            const isCurrent = current?.id === ep.id
            return (
              <li
                key={ep.id}
                className={`sns-row${isCurrent ? ' is-current' : ''}`}
                style={{ '--acc': show.accent } as CSSProperties}
              >
                <span className="sns-row__idx mono">
                  S{ep.season}·E{String(ep.ep).padStart(2, '0')}
                </span>
                <span className="sns-row__body">
                  <span className="sns-row__title">
                    {isCurrent && playing ? (
                      <span className="sns-row__eq" aria-hidden="true"><i /><i /><i /></span>
                    ) : null}
                    {ep.title}
                  </span>
                  <span className="sns-row__blurb">{ep.blurb}</span>
                  <span className="sns-row__meta mono">
                    {show.title} · {fmtDate(ep.date)} · {fmtDur(ep.duration)} · transcript
                  </span>
                </span>
                <span className="sns-row__acts">
                  <button
                    type="button"
                    className="sns-btn sns-btn--rowplay"
                    onClick={() =>
                      isCurrent ? setPlaying(!playing) : playEpisode(ep)
                    }
                    aria-pressed={isCurrent && playing}
                  >
                    {isCurrent && playing ? '❚❚ Pause' : '▶ Play'}
                  </button>
                  <button
                    type="button"
                    className="sns-btn sns-btn--rowclip"
                    onClick={() => setClip({ ep, initial: null })}
                  >
                    ✂ Clip
                  </button>
                </span>
              </li>
            )
          })}
        </ol>
      </section>

      {/* ------------------------------------------------- clip promo */}
      <section className="sns-section sns-band" aria-labelledby="sns-band-h">
        <div className="sns-band__text">
          <span className="mono sns-over">03 — Give the moment a name</span>
          <h2 className="sns-h2" id="sns-band-h">The clip maker</h2>
          <p className="sns-band__p">
            Half the discovery of a show happens one 30-second window at a time. Drag the
            handles across any episode’s waveform, lift out the good part with its
            transcript, and you get a link that opens right there — fifteen to sixty
            seconds, no login, no app.
          </p>
          <div className="sns-band__cta">
            <button
              type="button"
              className="sns-btn sns-btn--signal"
              onClick={() => setClip({ ep: current ?? FEATURED, initial: null })}
            >
              ✂ Cut a clip from {current && current.id !== FEATURED.id ? 'what’s playing' : 'the latest episode'}
            </button>
            <span className="mono sns-band__hint">
              current: {(current ?? FEATURED).title} · {fmtTime((current ?? FEATURED).duration)}
            </span>
          </div>
        </div>
        <div className="sns-band__art" aria-hidden="true">
          <span className="sns-band__brand">S+N</span>
        </div>
      </section>

      {/* ------------------------------------------------- subscription */}
      <section className="sns-section" id="sns-subscribe" aria-labelledby="sns-sub-h">
        <div className="sns-section__head">
          <span className="mono sns-over">04 — Never miss a frequency</span>
          <h2 className="sns-h2" id="sns-sub-h">Subscribe anywhere ears are sold</h2>
        </div>
        <div className="sns-sub">
          <ul className="sns-platforms">
            {PLATFORMS.map((p) => (
              <li key={p}>
                <a
                  className="sns-platform"
                  href={`#sns-subscribe`}
                  onClick={(e) => e.preventDefault()}
                  aria-disabled="true"
                  title="Demo destination — link inert in the lab"
                >
                  <span className="sns-platform__glyph" aria-hidden="true">◉</span>
                  {p}
                </a>
              </li>
            ))}
          </ul>
          <aside className="sns-member">
            <span className="mono sns-member__over">Member feed</span>
            <h3 className="sns-member__title">The Frequency</h3>
            <p className="sns-member__p">
              Three dollars a month keeps the warehouse humming: member-only episodes,
              the quarterly audiozine, and the legendary kettle rota minutes.
            </p>
            <span className="sns-member__stat mono">3,400 members · 0 guilt trips</span>
          </aside>
        </div>
      </section>

      <footer className="sns-foot mono">
        <span>Simulated audio — waveform, playhead and transcripts are rendered, nothing streams.</span>
        <span>All shows, hosts, guests and figures are fictional · a Brassfern Lab demo for Signal &amp; Noise</span>
      </footer>

      {/* -------------------------------------------------------- player */}
      {current && currentShow && (
        <Player
          ep={current}
          show={currentShow}
          pos={pos}
          playing={playing}
          rateIdx={rateIdx}
          guard={guard}
          next={next}
          onToggle={() => setPlaying(!playing)}
          onSeek={seek}
          onSkip={(dt) => {
            const v = posRef.current + dt
            seek(v)
          }}
          onCycleRate={() => setRateIdx((rateIdx + 1) % RATES.length)}
          onOpenClip={() => setClip({ ep: current, initial: null })}
          onStop={() => {
            setPlaying(false)
            setCurrent(null)
            guardRef.current = null
            setGuard(null)
            setAnnounce('Player cleared')
          }}
        />
      )}

      {/* ----------------------------------------------------- clip maker */}
      {clip && (
        <ClipMaker
          ep={clip.ep}
          show={getShow(clip.ep.showId) ?? SHOWS[0]!}
          initial={clip.initial}
          pos={current?.id === clip.ep.id ? pos : 0}
          onPlayClip={playClip}
          onSeek={(t) => {
            if (current?.id === clip.ep.id) seek(t)
            else playEpisode(clip.ep, t, false)
          }}
          onClose={() => setClip(null)}
        />
      )}
    </div>
  )
}
