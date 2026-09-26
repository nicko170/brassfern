import { useState } from 'react'
import {
  FORMULAS,
  FORMULA_BY_ID,
  SLOT_LABELS,
  analyseRoutine,
  type Formula,
} from './data'

export interface Step {
  key: string
  formulaId: string
}

export interface SavedRitual {
  id: string
  name: string
  am: string[]
  pm: string[]
  savedAt: string
}

interface Props {
  am: Step[]
  pm: Step[]
  saved: SavedRitual[]
  onMove: (when: 'am' | 'pm', index: number, dir: -1 | 1) => void
  onRemove: (when: 'am' | 'pm', index: number) => void
  onAdd: (formulaId: string, when: 'am' | 'pm') => void
  onSave: (name: string) => void
  onLoad: (ritual: SavedRitual) => void
  onDelete: (id: string) => void
  onShare: () => void
  onExport: () => void
  onStarter: () => void
  onClear: () => void
}

function StepList({
  when,
  steps,
  onMove,
  onRemove,
}: Pick<Props, 'onMove' | 'onRemove'> & { when: 'am' | 'pm'; steps: Step[] }) {
  if (!steps.length) {
    return <p className="gix-routine__empty">Nothing here yet. Add a step from the tray below.</p>
  }
  return (
    <ol className="gix-routine__list">
      {steps.map((s, i) => {
        const f = FORMULA_BY_ID.get(s.formulaId) as Formula
        return (
          <li key={s.key} className="gix-step">
            <span className="gix-step__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="gix-step__body">
              <span className="gix-step__name">{f.name}</span>
              <span className="gix-step__meta">
                {SLOT_LABELS[f.slot]} · {f.kind} · ${f.price}
              </span>
            </div>
            <div className="gix-step__acts">
              <button
                type="button"
                className="gix-iconbtn"
                onClick={() => onMove(when, i, -1)}
                disabled={i === 0}
                aria-label={`Move ${f.name} earlier`}
              >
                ↑
              </button>
              <button
                type="button"
                className="gix-iconbtn"
                onClick={() => onMove(when, i, 1)}
                disabled={i === steps.length - 1}
                aria-label={`Move ${f.name} later`}
              >
                ↓
              </button>
              <button type="button" className="gix-iconbtn gix-iconbtn--remove" onClick={() => onRemove(when, i)} aria-label={`Remove ${f.name}`}>
                ✕
              </button>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default function Routine(props: Props) {
  const { am, pm, saved, onAdd, onSave, onLoad, onDelete, onShare, onExport, onStarter, onClear } = props
  const [ritualName, setRitualName] = useState('')
  const [pickerWhen, setPickerWhen] = useState<'am' | 'pm'>('am')

  const notices = analyseRoutine(
    am.map((s) => s.formulaId),
    pm.map((s) => s.formulaId),
  )
  const total = am.length + pm.length

  return (
    <section aria-label="Routine builder" className="gix-routine">
      <div className="gix-routine__head">
        <div>
          <span className="gix-overline">Routine builder</span>
          <h2 className="gix-h2">
            Build the ritual, <em>read the ledger</em>
          </h2>
        </div>
        <div className="gix-routine__actions">
          <button type="button" className="gix-btn gix-btn--small gix-btn--ghost" onClick={onStarter}>
            Load starter ritual
          </button>
          <button type="button" className="gix-btn gix-btn--small gix-btn--ghost" onClick={onClear} disabled={!total}>
            Clear
          </button>
        </div>
      </div>

      <div className="gix-routine__cols">
        <div className="gix-routine__col">
          <h3 className="gix-routine__half">
            <span className="gix-routine__sun" aria-hidden="true">
              ☀
            </span>{' '}
            Morning <span className="gix-routine__count">{am.length}</span>
          </h3>
          <StepList when="am" steps={am} {...props} />
        </div>
        <div className="gix-routine__col">
          <h3 className="gix-routine__half">
            <span className="gix-routine__moon" aria-hidden="true">
              ☾
            </span>{' '}
            Evening <span className="gix-routine__count">{pm.length}</span>
          </h3>
          <StepList when="pm" steps={pm} {...props} />
        </div>
      </div>

      <div className="gix-tray">
        <div className="gix-tray__nav" role="group" aria-label="Choose which half of the day to add to">
          <button type="button" className={pickerWhen === 'am' ? 'gix-chip gix-chip--on' : 'gix-chip'} onClick={() => setPickerWhen('am')} aria-pressed={pickerWhen === 'am'}>
            Add to morning
          </button>
          <button type="button" className={pickerWhen === 'pm' ? 'gix-chip gix-chip--on' : 'gix-chip'} onClick={() => setPickerWhen('pm')} aria-pressed={pickerWhen === 'pm'}>
            Add to evening
          </button>
        </div>
        <ul className="gix-tray__list">
          {FORMULAS.map((f) => (
            <li key={f.id}>
              <button type="button" className="gix-tray__item" onClick={() => onAdd(f.id, pickerWhen)}>
                <span className="gix-tray__name">{f.name}</span>
                <span className="gix-tray__meta">
                  {SLOT_LABELS[f.slot]} · ${f.price}
                </span>
                <span className="gix-tray__plus" aria-hidden="true">
                  +
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {notices.length > 0 && (
        <div className="gix-ledger">
          <span className="gix-overline gix-overline--small">The conflict ledger</span>
          <ul className="gix-ledger__list">
            {notices.map((n, i) => (
              <li key={i} className={`gix-ledger__item gix-ledger__item--${n.severity}`}>
                <span className="gix-ledger__badge">
                  {n.severity === 'avoid' ? 'never' : n.severity === 'caution' ? 'care' : n.severity === 'fine' ? 'fine' : 'note'}
                </span>
                <span>{n.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="gix-save">
        <div className="gix-save__row">
          <label className="gix-save__label">
            <span className="gix-sr">Ritual name</span>
            <input
              className="gix-input"
              value={ritualName}
              onChange={(e) => setRitualName(e.target.value)}
              placeholder="Name this ritual — e.g. Winter repair"
              maxLength={60}
            />
          </label>
          <button type="button" className="gix-btn" onClick={() => onSave(ritualName.trim() || 'Untitled ritual')} disabled={!total}>
            Save ritual
          </button>
          <button type="button" className="gix-btn gix-btn--ghost" onClick={onShare} disabled={!total}>
            Copy share link
          </button>
          <button type="button" className="gix-btn gix-btn--ghost" onClick={onExport} disabled={!total}>
            Copy as text
          </button>
        </div>

        {saved.length > 0 && (
          <div className="gix-saved">
            <span className="gix-overline gix-overline--small">Your saved rituals</span>
            <ul className="gix-saved__list">
              {saved.map((r) => (
                <li key={r.id} className="gix-saved__item">
                  <button type="button" className="gix-saved__load" onClick={() => onLoad(r)}>
                    <span className="gix-saved__name">{r.name}</span>
                    <span className="gix-saved__meta">
                      {r.am.length} AM · {r.pm.length} PM · {r.savedAt}
                    </span>
                  </button>
                  <button type="button" className="gix-iconbtn gix-iconbtn--remove" onClick={() => onDelete(r.id)} aria-label={`Delete ${r.name}`}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
