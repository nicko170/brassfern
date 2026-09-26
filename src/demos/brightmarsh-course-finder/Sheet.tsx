import { useRef } from 'react'
import {
  LEVEL_NOTES,
  fmtMoney,
  fmtStart,
  fmtWeeks,
  memberPrice,
  seatInfo,
  type Course,
} from './data'
import { useOverlay } from './hooks'

interface Props {
  course: Course
  shortlisted: boolean
  inCompare: boolean
  compareFull: boolean
  waitlisted: boolean
  onClose: () => void
  onToggleShort: (id: string) => void
  onToggleCompare: (id: string) => void
  onEnrol: (id: string) => void
}

export default function Sheet({
  course: c,
  shortlisted,
  inCompare,
  compareFull,
  waitlisted,
  onClose,
  onToggleShort,
  onToggleCompare,
  onEnrol,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  useOverlay(true, panelRef, onClose)
  const seat = seatInfo(c)

  return (
    <div className="bcf-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className="bcf-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bcf-sheet-title"
        tabIndex={-1}
      >
        <header className="bcf-sheet__head">
          <div>
            <p className="bcf-sheet__code">
              {c.code} · {c.style} · {c.level}
            </p>
            <h2 id="bcf-sheet-title" className="bcf-sheet__title">
              {c.title}
            </h2>
          </div>
          <button type="button" className="bcf-close" onClick={onClose} aria-label="Close course details">
            ×
          </button>
        </header>

        <div className="bcf-sheet__body">
          <p className="bcf-sheet__lede">{c.blurb}</p>
          <p className="bcf-sheet__tutor">
            Led by <b>{c.tutor}</b> — {c.tutorRole}.
          </p>

          <dl className="bcf-sheet__facts">
            <div>
              <dt>Starts</dt>
              <dd>{seat.tone === 'waitlist' ? 'Intake full — next date to be confirmed' : fmtStart(c)}</dd>
            </div>
            <div>
              <dt>Meets</dt>
              <dd>
                {c.day}s, {c.time}
              </dd>
            </div>
            <div>
              <dt>Runs</dt>
              <dd>{fmtWeeks(c)}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>{c.room}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>
                {fmtMoney(c.price)} · {fmtMoney(memberPrice(c.price))} members
              </dd>
            </div>
            <div>
              <dt>Seats</dt>
              <dd>{seat.label}</dd>
            </div>
          </dl>

          <p className="bcf-sheet__levelnote">
            <b>{c.level}.</b> {LEVEL_NOTES[c.level]}
          </p>

          <h3 className="bcf-sheet__h">What you leave with</h3>
          <ul className="bcf-sheet__outcomes">
            {c.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>

          <h3 className="bcf-sheet__h">The {c.weeks <= 2 ? 'sessions' : `${c.weeks} weeks`}, in order</h3>
          <div className="bcf-syllabus">
            {c.outline.map((w, i) => (
              <details key={w.t} className="bcf-week" open={i === 0}>
                <summary>
                  <span className="bcf-week__num">
                    {c.weeks <= 2 ? `Session ${i + 1}` : `Week ${i + 1}`}
                  </span>
                  <span className="bcf-week__t">{w.t}</span>
                  <span className="bcf-week__chev" aria-hidden="true" />
                </summary>
                <p className="bcf-week__d">{w.d}</p>
              </details>
            ))}
          </div>
        </div>

        <footer className="bcf-sheet__foot">
          <button
            type="button"
            className={`bcf-btn bcf-btn--ghost${shortlisted ? ' bcf-btn--on' : ''}`}
            aria-pressed={shortlisted}
            onClick={() => onToggleShort(c.id)}
          >
            {shortlisted ? 'Shortlisted ✓' : 'Shortlist'}
          </button>
          <button
            type="button"
            className={`bcf-btn bcf-btn--ghost${inCompare ? ' bcf-btn--on' : ''}`}
            aria-pressed={inCompare}
            disabled={!inCompare && compareFull}
            onClick={() => onToggleCompare(c.id)}
          >
            {inCompare ? 'In compare ✓' : compareFull ? 'Compare full (3)' : 'Add to compare'}
          </button>
          {seat.tone === 'waitlist' ? (
            <button
              type="button"
              className={`bcf-btn${waitlisted ? ' bcf-btn--on' : ''}`}
              onClick={() => onEnrol(c.id)}
            >
              {waitlisted ? 'On the waitlist ✓' : 'Join the waitlist'}
            </button>
          ) : (
            <button type="button" className="bcf-btn" onClick={() => onEnrol(c.id)}>
              Enrol — {fmtMoney(c.price)}
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
