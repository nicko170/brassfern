import { useEffect, useRef } from 'react'
import {
  CATEGORY_LABELS,
  EVIDENCE_LABELS,
  INGREDIENT_BY_ID,
  conflictsFor,
  type Ingredient,
} from './data'

export function EvidenceDots({ n, small }: { n: number; small?: boolean }) {
  return (
    <span className={small ? 'gix-ev gix-ev--small' : 'gix-ev'} title={EVIDENCE_LABELS[n]} aria-label={`Evidence: ${EVIDENCE_LABELS[n]}`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? 'gix-ev__dot gix-ev__dot--on' : 'gix-ev__dot'} aria-hidden="true" />
      ))}
    </span>
  )
}

interface Props {
  ingredient: Ingredient
  onClose: () => void
  onOpen: (id: string) => void
}

/** Ingredient detail sheet — the "open lab notebook" pattern in miniature. */
export default function Sheet({ ingredient: ing, onClose, onOpen }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      restoreRef.current?.focus?.()
    }
  }, [onClose, ing.id])

  const conflicts = conflictsFor(ing.id)
  const other = (c: (typeof conflicts)[number]) => (c.a === ing.id ? c.b : c.a)

  return (
    <div className="gix-sheet-veil" onClick={onClose}>
      <div
        className="gix-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gix-sheet-name"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gix-sheet__top">
          <span className="gix-overline">{CATEGORY_LABELS[ing.category]}</span>
          <button ref={closeRef} type="button" className="gix-sheet__close" onClick={onClose} aria-label="Close ingredient sheet">
            ✕
          </button>
        </div>

        <h2 className="gix-sheet__name" id="gix-sheet-name">
          {ing.name}
        </h2>
        <p className="gix-sheet__inci">INCI · {ing.inci}</p>

        <p className="gix-sheet__does">{ing.does}</p>

        <dl className="gix-sheet__facts">
          <div>
            <dt>Honest band</dt>
            <dd>
              <span className="gix-sheet__band">{ing.band}</span>
              <span className="gix-sheet__bandnote">{ing.bandNote}</span>
            </dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>
              <EvidenceDots n={ing.evidence} />
              <span className="gix-sheet__evlabel">{EVIDENCE_LABELS[ing.evidence]}</span>
            </dd>
          </div>
          <div>
            <dt>Best time</dt>
            <dd>{ing.time === 'both' ? 'Morning or evening' : ing.time === 'am' ? 'Morning' : 'Evening'}</dd>
          </div>
        </dl>

        <p className="gix-sheet__detail">{ing.detail}</p>

        <div className="gix-sheet__provenance">
          <span className="gix-overline gix-overline--small">Provenance</span>
          <p>{ing.provenance}</p>
        </div>

        <div className="gix-sheet__chips" aria-label="Helps with">
          {ing.benefits.map((b) => (
            <span key={b} className="gix-chip gix-chip--static">
              {b}
            </span>
          ))}
        </div>

        {ing.pairs.length > 0 && (
          <div className="gix-sheet__section">
            <span className="gix-overline gix-overline--small">Pairs well with</span>
            <ul className="gix-sheet__links">
              {ing.pairs.map((pid) => {
                const p = INGREDIENT_BY_ID.get(pid)
                return p ? (
                  <li key={pid}>
                    <button type="button" className="gix-link" onClick={() => onOpen(pid)}>
                      {p.name} <span aria-hidden="true">→</span>
                    </button>
                  </li>
                ) : null
              })}
            </ul>
          </div>
        )}

        {conflicts.length > 0 && (
          <div className="gix-sheet__section">
            <span className="gix-overline gix-overline--small">Conflict ledger</span>
            <ul className="gix-sheet__conflicts">
              {conflicts.map((c) => {
                const o = INGREDIENT_BY_ID.get(other(c))
                return (
                  <li key={other(c)} className={`gix-conflict gix-conflict--${c.severity}`}>
                    <span className="gix-conflict__badge">{c.severity === 'avoid' ? 'never' : c.severity === 'caution' ? 'care' : 'fine'}</span>
                    <div>
                      <button type="button" className="gix-link" onClick={() => onOpen(other(c))}>
                        {o?.name ?? other(c)}
                      </button>
                      <p>{c.note}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
