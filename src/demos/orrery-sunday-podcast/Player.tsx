import { useEffect, useMemo, useRef } from 'react'
import Cover from './Cover'
import Waveform from './Waveform'
import { RATES, epCode, fmtClock, seriesOf, type Episode } from './data'

/**
 * The dock — Orrery Sunday's fixed listening console. Transport, speed,
 * chapter steppers, the seeded waveform slider, and an expandable chapter
 * list with full keyboard seek. Every button carries a text label or an
 * aria-label; track changes are announced by the parent via aria-live.
 */

interface Props {
  ep: Episode
  pos: number
  playing: boolean
  rateIdx: number
  reduced: boolean
  chaptersOpen: boolean
  onToggle: () => void
  onSkip: (delta: number) => void
  onCycleRate: () => void
  onSeek: (seconds: number) => void
  onStepChapter: (dir: 1 | -1) => void
  onToggleChapters: () => void
  onPickChapter: (t: number) => void
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.2v13.6L19 12z" fill="currentColor" />
    </svg>
  )
}
function IconPause() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6.6" y="5" width="3.4" height="14" fill="currentColor" />
      <rect x="14" y="5" width="3.4" height="14" fill="currentColor" />
    </svg>
  )
}
function IconBack15() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5V2L7 6l5 4V7a5.5 5.5 0 1 1-5.5 5.5H4A8 8 0 1 0 12 4.5z"
        fill="currentColor"
      />
      <text x="12" y="15.4" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="700">
        15
      </text>
    </svg>
  )
}
function IconFwd15() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5V2l5 4-5 4V7a5.5 5.5 0 1 0 5.5 5.5H20A8 8 0 1 1 12 4.5z"
        fill="currentColor"
      />
      <text x="12" y="15.4" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="700">
        15
      </text>
    </svg>
  )
}
function IconChapterPrev() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.5 6v12L7.5 12z" fill="currentColor" />
      <rect x="5" y="6" width="2.2" height="12" fill="currentColor" />
    </svg>
  )
}
function IconChapterNext() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.5 6v12l8-6z" fill="currentColor" />
      <rect x="16.8" y="6" width="2.2" height="12" fill="currentColor" />
    </svg>
  )
}

export function chapterIndexOf(ep: Episode, pos: number): number {
  let idx = 0
  for (let i = 0; i < ep.chapters.length; i++) {
    if ((ep.chapters[i]?.t ?? 0) <= pos + 0.5) idx = i
  }
  return idx
}

export default function Player({
  ep,
  pos,
  playing,
  rateIdx,
  reduced,
  chaptersOpen,
  onToggle,
  onSkip,
  onCycleRate,
  onSeek,
  onStepChapter,
  onToggleChapters,
  onPickChapter,
}: Props) {
  const rate = RATES[rateIdx] ?? 1
  const chapterIdx = chapterIndexOf(ep, pos)
  const chapterFracs = useMemo(() => ep.chapters.map((c) => c.t / ep.duration), [ep])

  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)

  /* focus follow: open → current chapter, close → back to the toggle */
  useEffect(() => {
    if (chaptersOpen && !wasOpen.current) {
      const btn = panelRef.current?.querySelector<HTMLButtonElement>(
        '[aria-current="true"]',
      )
      ;(btn ?? panelRef.current?.querySelector('button'))?.focus()
    } else if (!chaptersOpen && wasOpen.current) {
      toggleRef.current?.focus()
    }
    wasOpen.current = chaptersOpen
  }, [chaptersOpen])

  const series = seriesOf(ep.series)

  return (
    <section className="os-dock" aria-label="Episode player">
      <div
        className={`os-chapters${chaptersOpen ? ' os-chapters--open' : ''}`}
        id="os-chapter-panel"
      >
        <div
          ref={panelRef}
          className="os-chapters__in"
          role="group"
          aria-label="Chapters"
          onKeyDown={(e) => {
            if (e.key === 'Escape' && chaptersOpen) {
              e.preventDefault()
              onToggleChapters()
            }
          }}
        >
          <p className="os-chapters__head">
            <span className="os-mono">{epCode(ep.n)} · {ep.chapters.length} chapters</span>
            <span className="os-mono os-chapters__dur">{fmtClock(ep.duration)}</span>
          </p>
          <ol className="os-chapters__list">
            {ep.chapters.map((c, i) => (
              <li key={c.label}>
                <button
                  type="button"
                  className={`os-chapter${i === chapterIdx ? ' os-chapter--now' : ''}`}
                  aria-current={i === chapterIdx ? 'true' : undefined}
                  onClick={() => onPickChapter(c.t)}
                >
                  <span className="os-mono os-chapter__t">{fmtClock(c.t)}</span>
                  <span className="os-chapter__label">{c.label}</span>
                  <span className="os-chapter__go" aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="os-dock__in">
        <div className="os-dock__media">
          <Cover seed={ep.n} size={56} className="os-dock__cover" />
          <div className="os-dock__titles">
            <p className="os-mono os-dock__code">
              {epCode(ep.n)} · {series.note}
            </p>
            <p className="os-dock__title">{ep.title}</p>
          </div>
        </div>

        <div className="os-dock__console">
          <div className="os-dock__transport">
            <button
              type="button"
              className="os-tbtn"
              aria-label={`Previous chapter: ${ep.chapters[Math.max(0, chapterIdx - 1)]?.label ?? 'none'}`}
              disabled={chapterIdx === 0 && pos < 4}
              onClick={() => onStepChapter(-1)}
            >
              <IconChapterPrev />
            </button>
            <button
              type="button"
              className="os-tbtn"
              aria-label="Back 15 seconds"
              onClick={() => onSkip(-15)}
            >
              <IconBack15 />
            </button>
            <button
              type="button"
              className="os-tbtn os-tbtn--play"
              aria-label={playing ? 'Pause episode' : 'Play episode'}
              aria-pressed={playing}
              onClick={onToggle}
            >
              {playing ? <IconPause /> : <IconPlay />}
            </button>
            <button
              type="button"
              className="os-tbtn"
              aria-label="Forward 15 seconds"
              onClick={() => onSkip(15)}
            >
              <IconFwd15 />
            </button>
            <button
              type="button"
              className="os-tbtn"
              aria-label={`Next chapter: ${ep.chapters[chapterIdx + 1]?.label ?? 'end of episode'}`}
              disabled={chapterIdx >= ep.chapters.length - 1}
              onClick={() => onStepChapter(1)}
            >
              <IconChapterNext />
            </button>
          </div>

          <Waveform
            seed={ep.n}
            duration={ep.duration}
            pos={pos}
            chapterFracs={chapterFracs}
            playing={playing}
            reduced={reduced}
            onSeek={onSeek}
            label={`${epCode(ep.n)} ${ep.title}`}
          />

          <div className="os-dock__meta">
            <span className="os-mono os-dock__time" aria-hidden="true">
              {fmtClock(pos)}<span className="os-dock__time-sep">/</span>{fmtClock(ep.duration)}
            </span>
            <span className="os-dock__sr">{fmtClock(pos)} of {fmtClock(ep.duration)}</span>
            <button
              type="button"
              className="os-tbtn os-tbtn--rate"
              aria-label={`Playback speed ${rate} times. Activate to change.`}
              onClick={onCycleRate}
            >
              {rate}×
            </button>
            <button
              ref={toggleRef}
              type="button"
              className={`os-tbtn os-tbtn--chapters${chaptersOpen ? ' os-tbtn--on' : ''}`}
              aria-expanded={chaptersOpen}
              aria-controls="os-chapter-panel"
              aria-label={`Chapters — now at ${ep.chapters[chapterIdx]?.label ?? ''}`}
              onClick={onToggleChapters}
            >
              <span className="os-tbtn__chip">{chapterIdx + 1}/{ep.chapters.length}</span>
              Chapters
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
