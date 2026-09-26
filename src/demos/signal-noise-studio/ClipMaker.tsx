import { useEffect, useMemo, useRef, useState } from 'react'
import CoverArt from './Covers'
import { ClipWave } from './Waveform'
import {
  CLIP_HASH,
  CLIP_MAX,
  CLIP_MIN,
  decodeClip,
  encodeClip,
  fmtTime,
  linesInWindow,
  peaksFor,
  type ClipShare,
  type Episode,
  type Show,
} from './data'

/**
 * Clip maker — drag a 15–60s window across an episode's waveform, title it,
 * and export a link with the clip baked into the URL hash. Opens in
 * "received" mode when the demo is loaded with such a link.
 */

interface Props {
  ep: Episode
  show: Show
  initial: ClipShare | null
  pos: number
  onPlayClip: (a: number, b: number) => void
  onSeek: (t: number) => void
  onClose: () => void
}

const defaultTitle = (ep: Episode, a: number, b: number): string => {
  const lines = linesInWindow(ep, a, b)
  const first = lines[0]
  if (first) {
    const words = first.tx.split(' ').slice(0, 8).join(' ')
    return words.length < first.tx.length ? `${words}…` : words
  }
  return `${ep.title} — the good part`
}

export default function ClipMaker({ ep, show, initial, pos, onPlayClip, onSeek, onClose }: Props) {
  const init: [number, number] = useMemo(() => {
    const len = initial ? Math.min(CLIP_MAX, Math.max(CLIP_MIN, initial.b - initial.a)) : 30
    const a0 = initial
      ? Math.max(0, Math.min(ep.duration - len, initial.a))
      : Math.max(0, Math.min(ep.duration - len, pos - len / 2))
    return [a0, Math.min(ep.duration, a0 + len)]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // established once per dialog open
  const [range, setRange] = useState<[number, number]>(init)
  const [title, setTitle] = useState<string>(() => (initial ? initial.t : defaultTitle(ep, init[0], init[1])))
  const [titleTouched, setTitleTouched] = useState(Boolean(initial))
  const [copied, setCopied] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const restoreRef = useRef<Element | null>(null)

  const [a, b] = range
  const peaks = useMemo(() => peaksFor(ep, 12), [ep])
  const inWin = useMemo(() => linesInWindow(ep, a, b), [ep, a, b])
  const wordCount = useMemo(
    () => inWin.reduce((n, l) => n + l.tx.split(/\s+/).length, 0),
    [inWin],
  )

  /* focus title on open, restore focus on close */
  useEffect(() => {
    restoreRef.current = document.activeElement
    const id = window.setTimeout(() => titleRef.current?.focus(), 60)
    return () => {
      window.clearTimeout(id)
      ;(restoreRef.current as HTMLElement | null)?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const setClip = (na: number, nb: number) => {
    setRange([na, nb])
    if (!titleTouched) setTitle(defaultTitle(ep, na, nb))
  }

  const setLen = (len: number) => {
    const na = Math.min(a, ep.duration - len)
    setClip(na, na + len)
  }

  const share: ClipShare = { e: ep.id, a: Math.round(a * 10) / 10, b: Math.round(b * 10) / 10, t: title }

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}${CLIP_HASH}${encodeClip(share)}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* clipboard can be unavailable in iframes/sandbox — still update hash */
    }
    try {
      window.history.replaceState(null, '', CLIP_HASH + encodeClip(share))
    } catch {
      /* ignore */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2400)
  }

  const previewHref = `${CLIP_HASH}${encodeClip(share)}`

  return (
    <div className="sns-clipwrap">
      <button
        type="button"
        className="sns-clipwrap__backdrop"
        onClick={onClose}
        aria-label="Close clip maker"
      />
      <div className="sns-clip" role="dialog" aria-modal="true" aria-label={`Clip maker — ${ep.title}`}>
        <header className="sns-clip__head">
          <CoverArt show={show} className="sns-clip__art" />
          <div className="sns-clip__ids">
            <span className="sns-clip__over" style={{ color: show.accent }}>
              {initial ? 'Shared clip — make it yours' : 'Cut a clip'}
            </span>
            <h2 className="sns-clip__title">
              S{ep.season}·E{String(ep.ep).padStart(2, '0')} — {ep.title}
            </h2>
            <span className="sns-clip__show">{show.title} · {fmtTime(ep.duration)}</span>
          </div>
          <button type="button" className="sns-btn sns-btn--icon sns-clip__close" onClick={onClose} aria-label="Close clip maker">
            ✕
          </button>
        </header>

        <ClipWave
          peaks={peaks}
          dur={ep.duration}
          pos={pos}
          accent={show.accent}
          a={a}
          b={b}
          minLen={CLIP_MIN}
          maxLen={CLIP_MAX}
          onChange={setClip}
        />

        <div className="sns-clip__row">
          <div className="sns-clip__times" aria-hidden="true">
            <span>{fmtTime(a)}</span>
            <span className="sns-clip__len">{fmtTime(b - a)} clip</span>
            <span>{fmtTime(b)}</span>
          </div>
          <div className="sns-clip__presets" role="group" aria-label="Clip length presets">
            {[15, 30, 45, 60].map((len) => (
              <button
                key={len}
                type="button"
                className={`sns-btn sns-btn--pill${Math.round(b - a) === len ? ' is-on' : ''}`}
                onClick={() => setLen(len)}
              >
                {len}s
              </button>
            ))}
          </div>
        </div>

        <label className="sns-clip__field">
          <span className="sns-clip__label">Clip title</span>
          <input
            ref={titleRef}
            className="sns-clip__input"
            value={title}
            maxLength={90}
            onChange={(e) => {
              setTitleTouched(true)
              setTitle(e.target.value)
            }}
            placeholder="Give the moment a name"
          />
        </label>

        <div className="sns-clip__transcript" aria-live="polite">
          <span className="sns-clip__label">
            Transcript in window — {inWin.length} {inWin.length === 1 ? 'line' : 'lines'} · ~{wordCount} words
          </span>
          {inWin.length > 0 ? (
            <ul className="sns-clip__lines">
              {inWin.map((l) => (
                <li key={l.t}>
                  <button type="button" className="sns-clip__linetime" onClick={() => onSeek(l.t)}>
                    {fmtTime(l.t)}
                  </button>
                  <span className="sns-clip__sp">{l.sp}</span>
                  <span>{l.tx}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="sns-clip__empty">
              No spoken words in this window — widen it, or drag it toward a livelier patch of waveform.
            </p>
          )}
        </div>

        <footer className="sns-clip__foot">
          <button
            type="button"
            className="sns-btn sns-btn--signal"
            onClick={() => {
              onPlayClip(a, b)
            }}
          >
            ▶ Play clip ({fmtTime(b - a)})
          </button>
          <button type="button" className="sns-btn sns-btn--ghostcream" onClick={copyLink}>
            {copied ? '✓ Link copied' : '⧉ Copy clip link'}
          </button>
          <a className="sns-clip__preview" href={previewHref} onClick={(e) => e.preventDefault()} tabIndex={-1} aria-hidden="true">
            link: /lab/signal-noise-studio#snsclip=…
          </a>
        </footer>
      </div>
    </div>
  )
}

/** Parse a clip from the current location hash, if present. */
export const clipFromHash = (): ClipShare | null => {
  if (typeof window === 'undefined') return null
  const h = window.location.hash
  if (!h.startsWith(CLIP_HASH)) return null
  return decodeClip(h.slice(CLIP_HASH.length))
}
