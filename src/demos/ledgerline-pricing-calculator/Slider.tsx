import { useId, useState } from 'react'

interface SliderProps {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  step: number
  /** snap fn applied on commit (pointer-up, key-up, blur) */
  snap: (v: number) => number
  format: (v: number) => string
  unit?: string
  /** live value while dragging/typing (clamped only) */
  onInput: (v: number) => void
  /** final snapped value */
  onCommit: (v: number) => void
}

/**
 * Ledgerline's house control: a range slider with a tabular-numeral number
 * twin. Dragging is fluid and snapping happens on release — so keyboard
 * users are never marooned on a step boundary. The two stay in lockstep.
 */
export default function Slider({ label, hint, value, min, max, step, snap, format, unit, onInput, onCommit }: SliderProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const [editing, setEditing] = useState<string | null>(null)

  const clampLive = (v: number) => onInput(Math.min(max, Math.max(min, v)))
  const commit = (v: number) => onCommit(snap(Math.min(max, Math.max(min, v))))

  return (
    <div className="ll-slider">
      <div className="ll-slider__head">
        <label className="ll-slider__label" htmlFor={`${id}-num`}>
          {label}
        </label>
        <span className="ll-slider__numwrap">
          <input
            id={`${id}-num`}
            className="ll-slider__num"
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={editing ?? value}
            aria-label={`${label} (exact value)`}
            onFocus={() => setEditing(String(value))}
            onChange={(e) => {
              setEditing(e.target.value)
              const raw = Number(e.target.value)
              if (e.target.value !== '' && Number.isFinite(raw)) clampLive(raw)
            }}
            onBlur={() => {
              const raw = Number(editing ?? NaN)
              commit(Number.isFinite(raw) && editing !== '' ? raw : value)
              setEditing(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
            }}
          />
          {unit && <span className="ll-slider__unit">{unit}</span>}
        </span>
      </div>
      <input
        id={`${id}-range`}
        className="ll-slider__range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-describedby={hintId}
        aria-valuetext={format(value)}
        onChange={(e) => clampLive(Number(e.target.value))}
        onPointerUp={(e) => commit(Number((e.target as HTMLInputElement).value))}
        onKeyUp={(e) => {
          if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
            commit(Number((e.target as HTMLInputElement).value))
          }
        }}
        onBlur={(e) => commit(Number(e.target.value))}
      />
      <div className="ll-slider__foot">
        <span aria-hidden="true">{format(min)}</span>
        {hint && (
          <span id={hintId} className="ll-slider__hint">
            {hint}
          </span>
        )}
        <span aria-hidden="true">{format(max)}</span>
      </div>
    </div>
  )
}
