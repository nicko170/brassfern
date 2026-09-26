import { useEffect, useRef, useState } from 'react'
import {
  LABELS,
  PEOPLE,
  PRIORITIES,
  PRIORITY_ORDER,
  dueLabel,
  initials,
  labelName,
  personById,
  timeAgo,
  type Card,
  type Column,
  type Priority,
} from './data'
import { Avatar } from './Avatar'

/**
 * Card drawer: the full record for one card — editable title, description,
 * assignee, priority, labels, due date, checklist, move control, activity
 * log, delete. Slides in from the edge; Esc or the overlay closes it.
 */
export function Drawer({
  card,
  columns,
  onClose,
  onPatch,
  onToggleCheck,
  onAddCheck,
  onRemoveCheck,
  onDelete,
  onMoveColumn,
}: {
  card: Card
  columns: Column[]
  onClose: () => void
  onPatch: (patch: Partial<Card>) => void
  onToggleCheck: (itemId: string) => void
  onAddCheck: (text: string) => void
  onRemoveCheck: (itemId: string) => void
  onDelete: () => void
  onMoveColumn: (colId: string) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [title, setTitle] = useState(card.title)
  const [desc, setDesc] = useState(card.desc)
  const [checkText, setCheckText] = useState('')
  const [confirming, setConfirming] = useState(false)

  // Sync local edit buffers if a different card is opened.
  useEffect(() => {
    setTitle(card.title)
    setDesc(card.desc)
    setConfirming(false)
  }, [card.id])

  useEffect(() => {
    closeRef.current?.focus()
  }, [card.id])

  const commitTitle = () => {
    const t = title.trim()
    if (t && t !== card.title) onPatch({ title: t })
    else setTitle(card.title)
  }
  const commitDesc = () => {
    if (desc !== card.desc) onPatch({ desc: desc.trim() })
  }

  const done = card.checklist.filter((k) => k.done).length
  const due = card.due ? dueLabel(card.due) : null
  const assignee = personById(card.assignee)

  return (
    <div className="swy-drawer-wrap" role="presentation">
      <button className="swy-scrim" aria-label="Close card details" onClick={onClose} tabIndex={-1} />
      <aside
        className="swy-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Card ${card.id}: ${card.title}`}
      >
        <header className="swy-drawer__head">
          <p className="swy-drawer__id">
            <span className="swy-mono">{card.id}</span>
            <span className={`swy-ptag swy-ptag--${card.priority}`}>
              {PRIORITIES[card.priority].code}
            </span>
          </p>
          <button ref={closeRef} className="swy-iconbtn" onClick={onClose} aria-label={`Close ${card.id}`}>
            ✕
          </button>
        </header>

        <div className="swy-drawer__body">
          <label className="swy-field">
            <span className="swy-field__label">Title</span>
            <input
              className="swy-input swy-input--title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  commitTitle()
                  e.currentTarget.blur()
                }
              }}
              maxLength={90}
            />
          </label>

          <label className="swy-field">
            <span className="swy-field__label">Notes</span>
            <textarea
              className="swy-input swy-input--area"
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onBlur={commitDesc}
              placeholder="What does done look like?"
            />
          </label>

          <div className="swy-field">
            <span className="swy-field__label" id={`asg-${card.id}`}>Driver</span>
            <div className="swy-pickrow" role="group" aria-labelledby={`asg-${card.id}`}>
              <button
                type="button"
                className={'swy-pick' + (card.assignee === null ? ' is-on' : '')}
                aria-pressed={card.assignee === null}
                onClick={() => onPatch({ assignee: null })}
              >
                — Unassigned
              </button>
              {PEOPLE.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={'swy-pick' + (card.assignee === p.id ? ' is-on' : '')}
                  aria-pressed={card.assignee === p.id}
                  onClick={() => onPatch({ assignee: p.id })}
                  title={`${p.name} · ${p.role}`}
                >
                  <Avatar person={p} size={18} /> {initials(p.name)}
                </button>
              ))}
            </div>
          </div>

          <div className="swy-field">
            <span className="swy-field__label" id={`pri-${card.id}`}>Service class</span>
            <div className="swy-segset" role="radiogroup" aria-labelledby={`pri-${card.id}`}>
              {PRIORITY_ORDER.map((pr: Priority) => (
                <button
                  key={pr}
                  type="button"
                  role="radio"
                  aria-checked={card.priority === pr}
                  className={'swy-seg' + (card.priority === pr ? ' is-on' : '')}
                  onClick={() => onPatch({ priority: pr })}
                >
                  {PRIORITIES[pr].name}
                  <span className="swy-mono"> {PRIORITIES[pr].code}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="swy-field">
            <span className="swy-field__label" id={`lbl-${card.id}`}>Tags</span>
            <div className="swy-pickrow" role="group" aria-labelledby={`lbl-${card.id}`}>
              {LABELS.map((l) => {
                const on = card.labels.includes(l.id)
                return (
                  <button
                    key={l.id}
                    type="button"
                    className={'swy-chip' + (on ? ' is-on' : '')}
                    aria-pressed={on}
                    onClick={() =>
                      onPatch({
                        labels: on
                          ? card.labels.filter((x) => x !== l.id)
                          : [...card.labels, l.id],
                      })
                    }
                  >
                    {l.name}
                  </button>
                )
              })}
            </div>
          </div>

          <label className="swy-field">
            <span className="swy-field__label">Timetabled for</span>
            <input
              type="date"
              className="swy-input"
              value={card.due ?? ''}
              onChange={(e) => onPatch({ due: e.target.value || null })}
            />
            {due && (
              <span className={'swy-due swy-mono' + (due.overdue ? ' swy-due--over' : '')}>
                {due.text}
              </span>
            )}
          </label>

          <div className="swy-field">
            <span className="swy-field__label" id={`shf-${card.id}`}>Move to</span>
            <select
              className="swy-input"
              aria-labelledby={`shf-${card.id}`}
              value={card.columnId}
              onChange={(e) => onMoveColumn(e.target.value)}
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <section className="swy-field" aria-label={`Checklist, ${done} of ${card.checklist.length} done`}>
            <span className="swy-field__label">
              Manifest {card.checklist.length > 0 && <span className="swy-mono">{done}/{card.checklist.length}</span>}
            </span>
            {card.checklist.length > 0 && (
              <div className="swy-progress" aria-hidden="true">
                <span style={{ width: `${(done / card.checklist.length) * 100}%` }} />
              </div>
            )}
            <ul className="swy-checklist">
              {card.checklist.map((item) => (
                <li key={item.id} className={'swy-check' + (item.done ? ' is-done' : '')}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => onToggleCheck(item.id)}
                    />
                    <span>{item.text}</span>
                  </label>
                  <button
                    type="button"
                    className="swy-iconbtn swy-iconbtn--sm"
                    onClick={() => onRemoveCheck(item.id)}
                    aria-label={`Remove checklist item ${item.text}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="swy-checkadd"
              onSubmit={(e) => {
                e.preventDefault()
                const t = checkText.trim()
                if (t) onAddCheck(t)
                setCheckText('')
              }}
            >
              <input
                className="swy-input"
                value={checkText}
                onChange={(e) => setCheckText(e.target.value)}
                placeholder="Add an item…"
                maxLength={80}
                aria-label="Add a checklist item"
              />
              <button type="submit" className="swy-btn swy-btn--sm" disabled={!checkText.trim()}>
                Add
              </button>
            </form>
          </section>

          <section className="swy-field">
            <span className="swy-field__label">Ledger</span>
            <ol className="swy-ledger">
              {[...card.activity].reverse().map((entry) => (
                <li key={entry.id}>
                  <span className="swy-mono swy-ledger__when">{timeAgo(entry.at)}</span>
                  <span>{entry.text}</span>
                </li>
              ))}
              <li>
                <span className="swy-mono swy-ledger__when">—</span>
                <span>{assignee ? `${assignee.name} holds the key.` : 'Nobody holds the key yet.'}</span>
              </li>
            </ol>
          </section>

          <section className="swy-field swy-field--danger">
            <span className="swy-field__label">Sidings</span>
            {confirming ? (
              <div className="swy-confirm">
                <p>Scrap {card.id}? You can undo from the toast.</p>
                <button type="button" className="swy-btn swy-btn--danger" onClick={onDelete}>
                  Scrap it
                </button>
                <button type="button" className="swy-btn swy-btn--ghost" onClick={() => setConfirming(false)}>
                  Keep
                </button>
              </div>
            ) : (
              <button type="button" className="swy-btn swy-btn--ghost" onClick={() => setConfirming(true)}>
                Scrap this card…
              </button>
            )}
          </section>
        </div>
      </aside>
    </div>
  )
}

export { labelName }
