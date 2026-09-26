import { useRef, useState } from 'react'
import { QUIZ, fmtMoney, fmtStart, memberPrice, recommend, seatInfo, type Recommendation } from './data'
import { useOverlay } from './hooks'

interface Props {
  onClose: () => void
  onSave: (ids: string[]) => void
  onOpenCourse: (id: string) => void
}

/**
 * The 60-second advisor: five questions, three recommendations with reasons.
 * Click an answer to advance; Back revisits without losing earlier answers.
 */
export default function Quiz({ onClose, onSave, onOpenCourse }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  useOverlay(true, panelRef, onClose)
  const [answers, setAnswers] = useState<number[]>([])
  const [saved, setSaved] = useState(false)

  const step = answers.length
  const done = step >= QUIZ.length
  const results: Recommendation[] = done ? recommend(answers) : []
  const q = done ? null : QUIZ[step]

  const choose = (i: number) => setAnswers((prev) => [...prev, i])
  const back = () => setAnswers((prev) => prev.slice(0, -1))

  const save = () => {
    onSave(results.map((r) => r.course.id))
    setSaved(true)
  }

  return (
    <div className="bcf-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className="bcf-quiz"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bcf-quiz-title"
        tabIndex={-1}
      >
        <header className="bcf-sheet__head">
          <div>
            <p className="bcf-sheet__code">The 60-second advisor</p>
            <h2 id="bcf-quiz-title" className="bcf-sheet__title">
              {done ? 'Your three, argued for' : `Question ${step + 1} of ${QUIZ.length}`}
            </h2>
          </div>
          <button type="button" className="bcf-close" onClick={onClose} aria-label="Close the advisor">
            ×
          </button>
        </header>

        {!done && q && (
          <div className="bcf-quiz__body" key={q.id}>
            <div className="bcf-quiz__progress" aria-hidden="true">
              {QUIZ.map((qq, i) => (
                <span key={qq.id} className={i < step ? 'is-done' : i === step ? 'is-now' : ''} />
              ))}
            </div>
            <h3 className="bcf-quiz__q">{q.q}</h3>
            <div className="bcf-quiz__options" role="group" aria-label={q.q}>
              {q.options.map((o, i) => (
                <button key={o.label} type="button" className="bcf-quiz__opt" onClick={() => choose(i)}>
                  <span className="bcf-quiz__optlabel">{o.label}</span>
                  {o.hint && <span className="bcf-quiz__opthint">{o.hint}</span>}
                </button>
              ))}
            </div>
            <div className="bcf-quiz__nav">
              {step > 0 ? (
                <button type="button" className="bcf-linkbtn" onClick={back}>
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button type="button" className="bcf-linkbtn" onClick={onClose}>
                Skip — show me the catalogue
              </button>
            </div>
          </div>
        )}

        {done && (
          <div className="bcf-quiz__body">
            <p className="bcf-quiz__verdict">
              Five answers in, three courses out. Here is what we would put in front of you — and why, out
              loud, because a recommendation without a reason is just an ad.
            </p>
            <ol className="bcf-quiz__results">
              {results.map((r, i) => {
                const seat = seatInfo(r.course)
                return (
                  <li key={r.course.id} className="bcf-rec">
                    <span className="bcf-rec__rank">{i + 1}</span>
                    <div className="bcf-rec__main">
                      <h3 className="bcf-rec__title">{r.course.title}</h3>
                      <p className="bcf-rec__why">{r.why}</p>
                      <p className="bcf-rec__meta">
                        {r.course.code} · starts {fmtStart(r.course)} · {fmtMoney(r.course.price)} (
                        {fmtMoney(memberPrice(r.course.price))} members) · {seat.label}
                      </p>
                    </div>
                    <button type="button" className="bcf-minibtn" onClick={() => onOpenCourse(r.course.id)}>
                      Details
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="bcf-quiz__actions">
              <button type="button" className="bcf-btn" onClick={save} disabled={saved}>
                {saved ? 'Saved to your shortlist ✓' : 'Shortlist all three'}
              </button>
              <button type="button" className="bcf-btn bcf-btn--ghost" onClick={() => setAnswers([])}>
                Start over
              </button>
              <button type="button" className="bcf-linkbtn" onClick={onClose}>
                Browse the full catalogue instead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
