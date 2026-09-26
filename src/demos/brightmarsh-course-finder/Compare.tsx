import { useRef } from 'react'
import { fmtMoney, fmtStart, fmtWeeks, memberPrice, seatInfo, type Course } from './data'
import { useOverlay } from './hooks'

interface TrayProps {
  courses: Course[]
  onOpen: () => void
  onRemove: (id: string) => void
  onClear: () => void
}

/** Fixed bottom tray shown while ≥1 course is staged for comparison. */
export function CompareTray({ courses, onOpen, onRemove, onClear }: TrayProps) {
  if (courses.length === 0) return null
  return (
    <div className="bcf-tray" role="region" aria-label="Compare tray">
      <p className="bcf-tray__label">
        Compare <b>{courses.length}/3</b>
      </p>
      <ul className="bcf-tray__items">
        {courses.map((c) => (
          <li key={c.id} className="bcf-tray__item">
            <span>{c.title}</span>
            <button type="button" aria-label={`Remove ${c.title} from compare`} onClick={() => onRemove(c.id)}>
              ×
            </button>
          </li>
        ))}
        {courses.length < 3 && <li className="bcf-tray__hint">add up to {3 - courses.length} more</li>}
      </ul>
      <div className="bcf-tray__actions">
        <button type="button" className="bcf-btn bcf-btn--sm" onClick={onOpen} disabled={courses.length < 2}>
          {courses.length < 2 ? 'Pick two to compare' : 'Compare side by side'}
        </button>
        <button type="button" className="bcf-linkbtn" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  )
}

interface TableProps {
  courses: Course[]
  onClose: () => void
  onRemove: (id: string) => void
  onEnrol: (id: string) => void
}

function Row({ label, cells }: { label: string; cells: string[] }) {
  return (
    <tr>
      <th scope="row">{label}</th>
      {cells.map((v, i) => (
        <td key={i}>{v}</td>
      ))}
    </tr>
  )
}

export function CompareTable({ courses, onClose, onRemove, onEnrol }: TableProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useOverlay(true, panelRef, onClose)

  return (
    <div className="bcf-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className="bcf-compare"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bcf-compare-title"
        tabIndex={-1}
      >
        <header className="bcf-compare__head">
          <div>
            <p className="bcf-sheet__code">Side by side</p>
            <h2 id="bcf-compare-title" className="bcf-sheet__title">
              Three-way honesty
            </h2>
          </div>
          <button type="button" className="bcf-close" onClick={onClose} aria-label="Close comparison">
            ×
          </button>
        </header>

        <div className="bcf-compare__scroll">
          <table className="bcf-compare__table">
            <caption className="bcf__sr">
              Comparing {courses.map((c) => c.title).join(', ')}
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="bcf__sr">Feature</span>
                </th>
                {courses.map((c) => (
                  <th key={c.id} scope="col">
                    <span className="bcf-compare__code">{c.code}</span>
                    {c.title}
                    <button
                      type="button"
                      className="bcf-compare__remove"
                      aria-label={`Remove ${c.title}`}
                      onClick={() => onRemove(c.id)}
                    >
                      ×
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Tutor" cells={courses.map((c) => c.tutor)} />
              <Row label="Level" cells={courses.map((c) => c.level)} />
              <Row label="Starts" cells={courses.map((c) => fmtStart(c))} />
              <Row label="Meets" cells={courses.map((c) => `${c.day}s, ${c.time}`)} />
              <Row label="Runs" cells={courses.map((c) => fmtWeeks(c))} />
              <Row label="Where" cells={courses.map((c) => c.room)} />
              <Row label="Style" cells={courses.map((c) => c.style)} />
              <Row label="Price" cells={courses.map((c) => `${fmtMoney(c.price)} (${fmtMoney(memberPrice(c.price))} members)`)} />
              <Row label="Seats" cells={courses.map((c) => seatInfo(c).label)} />
              <tr>
                <th scope="row">Best first outcome</th>
                {courses.map((c) => (
                  <td key={c.id}>{c.outcomes[0]}</td>
                ))}
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">
                  <span className="bcf__sr">Actions</span>
                </th>
                {courses.map((c) => (
                  <td key={c.id}>
                    {seatInfo(c).tone === 'waitlist' ? (
                      <button type="button" className="bcf-btn bcf-btn--sm bcf-btn--ghost" onClick={() => onEnrol(c.id)}>
                        Join waitlist
                      </button>
                    ) : (
                      <button type="button" className="bcf-btn bcf-btn--sm" onClick={() => onEnrol(c.id)}>
                        Enrol — {fmtMoney(c.price)}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="bcf-compare__note">
          On a phone? The table scrolls sideways — or shortlist all three and take the details page by page.
        </p>
      </div>
    </div>
  )
}
