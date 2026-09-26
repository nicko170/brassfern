import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_QUEUE,
  XFADE,
  byId,
  fmtMS,
  fmtTC,
  type DeckTrack,
} from './data'
import Waveform from './Waveform'
import Queue from './Queue'
import Shelf from './Shelf'
import './demo.css'

/**
 * Holloway Records — Deck 02, the promo room.
 * The label's mastering-suite deck recreated for the web: a crate of
 * white-label promo plates, a waveform deck with beat ruler and cue flags,
 * a drag-to-reorder rack and a crossfade you can watch. Silent by design —
 * every plate is simulated. Charcoal studio dark, oxblood and bone.
 * Scoped under .hwp; honours prefers-reduced-motion.
 */

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

const useReducedMotion = () =>
  useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

/* ------------------------------------------------------------------ */
/* Transport icons                                                     */
/* ------------------------------------------------------------------ */

const ix = {
  fill: 'currentColor',
} as const

function IPrev() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 6v12L8.8 12z" {...ix} />
      <rect x="6" y="6" width="2.4" height="12" {...ix} />
    </svg>
  )
}
function INext() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 6v12l8.2-6z" {...ix} />
      <rect x="15.6" y="6" width="2.4" height="12" {...ix} />
    </svg>
  )
}
function IPlay() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.5 5.5v13L19 12z" {...ix} />
    </svg>
  )
}
function IPause() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="5" width="3.2" height="14" rx="0.6" {...ix} />
      <rect x="13.8" y="5" width="3.2" height="14" rx="0.6" {...ix} />
    </svg>
  )
}
function IStop() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" rx="1" {...ix} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type Tab = 'notes' | 'rack'

export default function HollowayWaveformPlayer() {
  const reduced = useReducedMotion()

  /* ---------------- deck state ---------------- */
  const [queue, setQueue] = useState<string[]>(DEFAULT_QUEUE)
  const [qi, setQi] = useState(0)
  const [pos, setPos] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [xfade, setXfade] = useState(true)
  const [tab, setTab] = useState<Tab>('notes')
  const [spin, setSpin] = useState(0) // session seconds on the platter
  const [finished, setFinished] = useState(false) // rack played out
  const [announce, setAnnounce] = useState('Promo room ready. Three plates on the rack.')

  const track = byId(queue[qi] ?? DEFAULT_QUEUE[0] ?? 'hwp-021')
  const dur = track.dur
  const incoming: DeckTrack | null = xfade && qi < queue.length - 1 ? byId(queue[qi + 1] as string) : null

  /* ---------------- transport clock ---------------- */
  const posRef = useRef(pos)
  const playingRef = useRef(playing)
  const durRef = useRef(dur)
  posRef.current = pos
  playingRef.current = playing
  durRef.current = dur

  const advance = useCallback(() => {
    if (qi < queue.length - 1) {
      setQi(qi + 1)
      setPos(0)
      setFinished(false)
    } else {
      setPlaying(false)
      setFinished(true)
      setAnnounce('Rack finished. Pull another plate from the shelf.')
    }
  }, [qi, queue.length])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    let acc = 0
    const step = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      const next = posRef.current + dt
      acc += dt
      if (acc >= 1) {
        setSpin((s) => s + Math.floor(acc))
        acc -= Math.floor(acc)
      }
      if (next >= durRef.current) {
        setPos(durRef.current)
        // one frame later so the boundary paints
        window.setTimeout(advance, 16)
        return
      }
      setPos(next)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [playing, advance])

  /* announce deck changes */
  const firstRef = useRef(true)
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false
      return
    }
    setAnnounce(`Now on deck: ${track.title}, ${track.version}, by ${track.artist}.`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id])

  /* ---------------- actions ---------------- */
  const seek = useCallback((t: number) => {
    setPos(clamp(t, 0, durRef.current))
    setFinished(false)
  }, [])
  const playPause = useCallback(() => {
    const p = playingRef.current
    if (!p && posRef.current >= durRef.current) setPos(0) // re-cue a played-out plate
    setPlaying(!p)
    setFinished(false)
    setAnnounce(
      p
        ? `Paused — ${track.title} at ${fmtMS(posRef.current)}.`
        : `Playing — ${track.title} by ${track.artist}.`,
    )
  }, [track])
  const stop = useCallback(() => {
    setPlaying(false)
    setPos(0)
    setFinished(false)
    setAnnounce('Deck stopped and re-cued to zero.')
  }, [])
  const next = useCallback(() => {
    setFinished(false)
    if (qi < queue.length - 1) {
      setQi(qi + 1)
      setPos(0)
    } else {
      setPlaying(false)
      setPos(0)
      setAnnounce('Last plate re-cued. Stack the rack for more.')
    }
  }, [qi, queue.length])
  const prev = useCallback(() => {
    setFinished(false)
    if (posRef.current > 4 || qi === 0) setPos(0)
    else {
      setQi(qi - 1)
      setPos(0)
    }
  }, [qi])

  const cutTo = useCallback(
    (id: string, autoplay = true) => {
      setQueue((rack) => {
        const rest = rack.filter((_, i) => i > qi)
        const head = rack[qi]
        return [head ?? id, id, ...rest.filter((x) => x !== id)]
          .slice(1) // drop old current, new plate leads
      })
      setQi(0)
      setPos(0)
      setFinished(false)
      if (autoplay) setPlaying(true)
      const t = byId(id)
      setAnnounce(`Cut ${t.title}, ${t.version}, to the deck.`)
    },
    [qi],
  )

  const addToRack = useCallback(
    (id: string, upNext = false) => {
      setQueue((rack) => {
        const clean = rack.filter((x, i) => !(i > qi && x === id))
        const nextRack = [...clean]
        nextRack.splice(upNext ? qi + 1 : clean.length, 0, id)
        return nextRack
      })
      const t = byId(id)
      setAnnounce(upNext ? `${t.title} stacked up next.` : `${t.title} stacked at the end of the rack.`)
      setTab('rack')
    },
    [qi],
  )

  const moveRack = useCallback(
    (from: number, to: number) => {
      setQueue((rack) => {
        const items = rack.slice(qi + 1)
        const [moved] = items.splice(from, 1)
        if (!moved) return rack
        items.splice(to, 0, moved)
        return [...rack.slice(0, qi + 1), ...items]
      })
    },
    [qi],
  )
  const removeRack = useCallback(
    (i: number) => setQueue((rack) => rack.filter((_, x) => x !== qi + 1 + i)),
    [qi],
  )
  const jumpRack = useCallback(
    (i: number) => {
      setQi(qi + 1 + i)
      setPos(0)
      setFinished(false)
      setPlaying(true)
    },
    [qi],
  )

  /* ---------------- global keys ---------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el?.closest('input, textarea, select, button, a, [role="tab"]')) return
      const inSlider = !!el?.closest('[role="slider"]')
      switch (e.key) {
        case ' ':
          e.preventDefault()
          playPause()
          break
        case 'ArrowLeft':
          if (!inSlider) {
            e.preventDefault()
            seek(posRef.current - (e.shiftKey ? 15 : 5))
          }
          break
        case 'ArrowRight':
          if (!inSlider) {
            e.preventDefault()
            seek(posRef.current + (e.shiftKey ? 15 : 5))
          }
          break
        case 'n':
        case 'N':
          next()
          break
        case 'p':
        case 'P':
          prev()
          break
        case 'x':
        case 'X':
          setXfade((x) => !x)
          break
        default:
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playPause, next, prev, seek])

  const upcoming = useMemo(() => queue.slice(qi + 1).map(byId), [queue, qi])
  const remaining = dur - pos
  const spinH = Math.floor(spin / 3600)
  const spinM = Math.floor((spin % 3600) / 60)
  const spinS = Math.floor(spin % 60)

  return (
    <div className="hwp">
      <p aria-live="polite" className="hwp-sr">{announce}</p>

      {/* ------------------------------------------------ masthead */}
      <header className="hwp-mast">
        <div className="hwp-mast__brand">
          <span className="hwp-mast__over">HOLLOWAY RECORDS — MASTERING SUITE</span>
          <h1 className="hwp-mast__title">
            Deck 02 <span>promo room</span>
          </h1>
        </div>
        <dl className="hwp-mast__meta">
          <div>
            <dt>Session</dt>
            <dd aria-label="Session platter time">
              {String(spinH).padStart(2, '0')}:{String(spinM).padStart(2, '0')}:
              {String(spinS).padStart(2, '0')}
            </dd>
          </div>
          <div>
            <dt>Room</dt>
            <dd>Suite B, Surry Hills</dd>
          </div>
          <div>
            <dt>Signal</dt>
            <dd>Silent — simulated</dd>
          </div>
        </dl>
      </header>

      {/* ------------------------------------------------ stage + side */}
      <main className="hwp-main">
        <section className="hwp-stage" aria-label="The deck">
          <div className="hwp-now">
            <div className="hwp-now__id">
              <span className="hwp-now__over">
                NOW ON DECK · {track.cat} · plate {qi + 1} of {queue.length}
              </span>
              <h2 className="hwp-now__title">
                {track.title} <em>{track.version}</em>
              </h2>
              <p className="hwp-now__artist">
                {track.artist} · cut from <i>{track.base}</i>
              </p>
            </div>
            <div className="hwp-now__time" role="timer" aria-label="Deck timecode">
              <span>
                <small>ELAPSED</small>
                {fmtTC(pos)}
              </span>
              <span>
                <small>TOTAL</small>
                {fmtTC(dur)}
              </span>
              <span>
                <small>TO RUN</small>−{fmtTC(remaining)}
              </span>
            </div>
          </div>

          <Waveform
            track={track}
            pos={pos}
            playing={playing}
            crossfade={xfade}
            incoming={incoming}
            reduced={reduced}
            onSeek={seek}
          />

          <div className="hwp-trans">
            <div className="hwp-trans__btns">
              <button className="hwp-tbtn" onClick={prev} aria-label="Previous plate or re-cue (P)">
                <IPrev />
              </button>
              <button className="hwp-tbtn" onClick={stop} aria-label="Stop and re-cue">
                <IStop />
              </button>
              <button
                className="hwp-tbtn hwp-tbtn--play"
                onClick={playPause}
                aria-label={playing ? 'Pause (Space)' : 'Play (Space)'}
                aria-pressed={playing}
              >
                {playing ? <IPause /> : <IPlay />}
              </button>
              <button className="hwp-tbtn" onClick={next} aria-label="Next plate (N)">
                <INext />
              </button>
            </div>
            <button
              className={`hwp-xf${xfade ? ' hwp-xf--on' : ''}`}
              role="switch"
              aria-checked={xfade}
              aria-label="Crossfade, eight seconds"
              onClick={() => setXfade((x) => !x)}
            >
              <span className="hwp-xf__rail" aria-hidden="true">
                <span className="hwp-xf__nub" />
              </span>
              X-FADE 8S
            </button>
            <div className="hwp-trans__chips" aria-label="Master spec">
              <span>{track.bpm} BPM</span>
              <span>{track.keySig.toUpperCase()}</span>
              <span>{fmtMS(dur)}</span>
            </div>
          </div>

          <div className="hwp-upnext" aria-live="off">
            {upcoming[0] ? (
              <>
                <span className="hwp-upnext__label">{xfade ? 'MIXES IN AT' : 'UP NEXT'}</span>
                <span className="hwp-upnext__when">{xfade ? fmtTC(Math.max(0, dur - XFADE)) : 'ON CUT'}</span>
                <span className="hwp-upnext__track">
                  {upcoming[0].artist} — {upcoming[0].title} <i>({upcoming[0].version})</i>
                </span>
              </>
            ) : (
              <span className="hwp-upnext__label hwp-upnext__label--dim">
                {finished ? 'RACK FINISHED — PULL ANOTHER PLATE' : 'LAST PLATE ON THE RACK'}
              </span>
            )}
          </div>
        </section>

        {/* ---------------- side: liner / rack ---------------- */}
        <aside className="hwp-side">
          <div
            className="hwp-tabs"
            role="tablist"
            aria-label="Deck panels"
            onKeyDown={(e) => {
              if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
              e.preventDefault()
              const nextTab: Tab = tab === 'notes' ? 'rack' : 'notes'
              setTab(nextTab)
              document.getElementById(`hwp-tab-${nextTab}`)?.focus()
            }}
          >
            <button
              role="tab"
              id="hwp-tab-notes"
              tabIndex={tab === 'notes' ? 0 : -1}
              aria-selected={tab === 'notes'}
              aria-controls="hwp-panel-notes"
              className={tab === 'notes' ? 'is-on' : ''}
              onClick={() => setTab('notes')}
            >
              LINER NOTES
            </button>
            <button
              role="tab"
              id="hwp-tab-rack"
              tabIndex={tab === 'rack' ? 0 : -1}
              aria-selected={tab === 'rack'}
              aria-controls="hwp-panel-rack"
              className={tab === 'rack' ? 'is-on' : ''}
              onClick={() => setTab('rack')}
            >
              RACK <span className="hwp-tabs__n">{upcoming.length}</span>
            </button>
          </div>

          <div
            role="tabpanel"
            id="hwp-panel-notes"
            aria-labelledby="hwp-tab-notes"
            className="hwp-side__panel"
            hidden={tab !== 'notes'}
          >
            <p className="hwp-liner__stamp">MASTER NOTES · {track.cat}</p>
            <dl className="hwp-liner__spec">
              <div>
                <dt>Engineer</dt>
                <dd>{track.engineer}</dd>
              </div>
              <div>
                <dt>Room</dt>
                <dd>{track.room}</dd>
              </div>
              <div>
                <dt>Cut</dt>
                <dd>{track.cutDate}</dd>
              </div>
              <div>
                <dt>Run</dt>
                <dd>{track.run}</dd>
              </div>
            </dl>
            {track.notes.map((p, i) => (
              <p key={i} className="hwp-liner__note">{p}</p>
            ))}
            <p className="hwp-liner__cuehead">CUES — jump the needle</p>
            <ul className="hwp-liner__cues">
              {track.cues.map((c) => (
                <li key={c.label}>
                  <button
                    onClick={() => seek(c.t)}
                    aria-label={`Jump to cue ${c.label} at ${fmtMS(c.t)}`}
                  >
                    <span>{c.label}</span>
                    <time>{fmtTC(c.t)}</time>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div
            role="tabpanel"
            id="hwp-panel-rack"
            aria-labelledby="hwp-tab-rack"
            className="hwp-side__panel hwp-side__panel--rack"
            hidden={tab !== 'rack'}
          >
            <p className="hwp-rack__hint">
              Drag a plate by its grip to reorder — or use the arrows. The
              deck is {xfade ? 'crossfading' : 'cutting hard'} between plates.
            </p>
            <Queue
              items={upcoming}
              onMove={moveRack}
              onRemove={removeRack}
              onJump={jumpRack}
              onAnnounce={setAnnounce}
            />
          </div>
        </aside>
      </main>

      {/* ------------------------------------------------ shelf */}
      <Shelf currentId={track.id} queue={queue} qi={qi} onCut={cutTo} onRack={addToRack} />

      {/* ------------------------------------------------ key hints */}
      <footer className="hwp-keys">
        <span>SPACE play/pause</span>
        <span>← → seek 5s</span>
        <span>SHIFT+← → 15s</span>
        <span>N / P plate</span>
        <span>X crossfade</span>
        <span>drag rack grips to reorder</span>
      </footer>
    </div>
  )
}
