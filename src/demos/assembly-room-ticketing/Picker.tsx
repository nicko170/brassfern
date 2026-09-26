import { useId, useMemo, useState } from 'react'
import {
  SECTION_KEYS,
  SECTION_ROWS,
  SECTIONS,
  TIERS,
  fmtMoney,
  priceFor,
  seatLabel,
  type SectionKey,
  type Show,
} from './data'

/**
 * The list picker — the fully keyboard/screen-reader path that shares the
 * same cart as the visual plan: section → row → the chairs in that row.
 */

interface PickerProps {
  show: Show
  sold: Set<string>
  selected: Set<string>
  full: boolean
  showId: string
  onToggle: (id: string) => void
}

export default function Picker({ show, sold, selected, full, showId, onToggle }: PickerProps) {
  const [section, setSection] = useState<SectionKey>('stalls')
  const rows = SECTION_ROWS[section]
  const [rowKey, setRowKey] = useState(rows[0].key)
  const row = rows.find((r) => r.key === rowKey) ?? rows[0]
  const secId = useId()
  const rowId = useId()
  const noteId = useId()

  const selectedInSection = useMemo(
    () => SECTION_ROWS[section].flatMap((r) => r.seats).filter((s) => selected.has(s.id)).length,
    [section, selected],
  )

  function changeSection(next: SectionKey) {
    setSection(next)
    setRowKey(SECTION_ROWS[next][0].key)
  }

  return (
    <div className="asr-picker">
      <div className="asr-picker__controls">
        <div className="asr-picker__field">
          <label htmlFor={secId}>Section</label>
          <select id={secId} value={section} onChange={(e) => changeSection(e.target.value as SectionKey)}>
            {SECTION_KEYS.map((key) => {
              const seats = SECTION_ROWS[key].flatMap((r) => r.seats)
              const free = seats.reduce((n, s) => n + (sold.has(s.id) ? 0 : 1), 0)
              return (
                <option key={key} value={key}>
                  {SECTIONS[key].name} — {free} of {seats.length} free
                </option>
              )
            })}
          </select>
        </div>
        <div className="asr-picker__field">
          <label htmlFor={rowId}>Row</label>
          <select id={rowId} value={row.key} onChange={(e) => setRowKey(e.target.value)}>
            {rows.map((r) => {
              const free = r.seats.reduce((n, s) => n + (sold.has(s.id) ? 0 : 1), 0)
              const tier = TIERS[r.seats[0].tier]
              return (
                <option key={r.key} value={r.key}>
                  {r.label} — {tier.name} {fmtMoney(priceFor(show, tier.key))} · {free} free
                </option>
              )
            })}
          </select>
        </div>
        <p className="asr-picker__count">
          {selectedInSection ? `${selectedInSection} taken in ${SECTIONS[section].name}` : 'Nothing taken here yet'}
        </p>
      </div>

      {full && (
        <p className="asr-picker__full" id={noteId}>
          Your party is full — release a chair below or in your order to change your mind.
        </p>
      )}

      <fieldset className="asr-picker__seats" aria-describedby={full ? noteId : undefined}>
        <legend>
          {SECTIONS[section].name}, {row.label} — {TIERS[row.seats[0].tier].name},{' '}
          {fmtMoney(priceFor(show, row.seats[0].tier))} each
        </legend>
        <ul>
          {row.seats.map((seat) => {
            const isSold = sold.has(seat.id)
            const isSel = selected.has(seat.id)
            const disabled = isSold || (full && !isSel)
            return (
              <li key={seat.id}>
                <label className={`asr-pick${isSel ? ' is-sel' : ''}${isSold ? ' is-sold' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isSel}
                    disabled={disabled}
                    onChange={() => onToggle(seat.id)}
                  />
                  <span className="asr-pick__box" aria-hidden="true" />
                  <span className="asr-pick__label">
                    {seat.wc ? `Wheelchair space ${seat.num}` : `Seat ${seat.num}`}
                    {isSold && <span className="asr-pick__sold"> · sold</span>}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <p className="asr-picker__note">
        The same chairs appear on the house plan — switch views any time; your booking follows you.
      </p>
    </div>
  )
}
