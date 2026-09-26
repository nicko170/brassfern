import {
  fmtMoney,
  fmtStart,
  fmtWeeks,
  isSoon,
  memberPrice,
  seatInfo,
  type Course,
} from './data'

interface Props {
  course: Course
  shortlisted: boolean
  inCompare: boolean
  compareFull: boolean
  waitlisted: boolean
  onDetails: (id: string) => void
  onToggleShort: (id: string) => void
  onToggleCompare: (id: string) => void
  onEnrol: (id: string) => void
}

export default function CourseCard({
  course: c,
  shortlisted,
  inCompare,
  compareFull,
  waitlisted,
  onDetails,
  onToggleShort,
  onToggleCompare,
  onEnrol,
}: Props) {
  const seat = seatInfo(c)
  const soon = isSoon(c)
  const pctFull = Math.round(((c.capacity - c.seatsLeft) / c.capacity) * 100)

  return (
    <article className={`bcf-card${seat.tone === 'waitlist' ? ' bcf-card--waitlist' : ''}`}>
      <header className="bcf-card__head">
        <span className="bcf-card__code">{c.code}</span>
        <span className="bcf-card__style">{c.style}</span>
      </header>

      <h3 className="bcf-card__title">
        <button type="button" className="bcf-card__titlebtn" onClick={() => onDetails(c.id)}>
          {c.title}
        </button>
      </h3>
      <p className="bcf-card__tutor">
        {c.tutor} · <span>{c.tutorRole}</span>
      </p>
      <p className="bcf-card__blurb">{c.blurb}</p>

      <dl className="bcf-card__meta">
        <div>
          <dt>When</dt>
          <dd>
            {fmtStart(c)} · {c.day}s {c.time}
          </dd>
        </div>
        <div>
          <dt>Length</dt>
          <dd>{fmtWeeks(c)}</dd>
        </div>
        <div>
          <dt>Level</dt>
          <dd>{c.level}</dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>{c.room}</dd>
        </div>
      </dl>

      <div className="bcf-chipline" aria-label="Availability">
        <span className={`bcf-chipmono${soon && seat.tone !== 'waitlist' ? ' bcf-chipmono--soon' : ''}`}>
          {seat.tone === 'waitlist' ? 'Next intake TBC' : `Starts ${fmtStart(c)}`}
        </span>
        {seat.tone === 'low' && <span className="bcf-chipmono bcf-chipmono--low">{seat.label}</span>}
        {seat.tone === 'waitlist' && (
          <span className="bcf-chipmono bcf-chipmono--wait">
            {waitlisted ? 'Waitlist — you\u2019re on it' : seat.label}
          </span>
        )}
      </div>

      <div
        className="bcf-seatmeter"
        role="img"
        aria-label={`${c.capacity - c.seatsLeft} of ${c.capacity} seats taken`}
      >
        <span style={{ width: `${pctFull}%` }} />
      </div>

      <footer className="bcf-card__foot">
        <p className="bcf-card__price">
          <b>{fmtMoney(c.price)}</b>
          <span>{fmtMoney(memberPrice(c.price))} members</span>
        </p>
        <div className="bcf-card__actions">
          <button
            type="button"
            className={`bcf-iconbtn${shortlisted ? ' bcf-iconbtn--on' : ''}`}
            aria-pressed={shortlisted}
            aria-label={shortlisted ? `Remove ${c.title} from shortlist` : `Shortlist ${c.title}`}
            title={shortlisted ? 'Remove from shortlist' : 'Shortlist'}
            onClick={() => onToggleShort(c.id)}
          >
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
              <path
                d="M3 2.5h10v11l-5-3.4-5 3.4z"
                fill={shortlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className={`bcf-minibtn${inCompare ? ' bcf-minibtn--on' : ''}`}
            aria-pressed={inCompare}
            disabled={!inCompare && compareFull}
            title={!inCompare && compareFull ? 'Compare holds three courses' : 'Add to compare'}
            onClick={() => onToggleCompare(c.id)}
          >
            {inCompare ? 'Comparing ✓' : 'Compare'}
          </button>
          {seat.tone === 'waitlist' ? (
            <button
              type="button"
              className={`bcf-minibtn bcf-minibtn--solid${waitlisted ? ' bcf-minibtn--on' : ''}`}
              onClick={() => onEnrol(c.id)}
            >
              {waitlisted ? 'On waitlist ✓' : 'Join waitlist'}
            </button>
          ) : (
            <button type="button" className="bcf-minibtn bcf-minibtn--solid" onClick={() => onEnrol(c.id)}>
              Enrol
            </button>
          )}
        </div>
      </footer>
    </article>
  )
}
