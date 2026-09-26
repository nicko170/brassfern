import { useEffect, useMemo, useRef, useState } from 'react'
import './demo.css'
import { CheckGlyph, Stamp, StampDefs } from './icons'
import {
  ICON_CHOICES,
  activeHabitsFor,
  addDays,
  bestStreak,
  currentStreak,
  exportJson,
  formatLong,
  formatShort,
  heatGrid,
  loadState,
  reviewWeek,
  saveState,
  seedState,
  todayIso,
  uid,
  weekCount,
  weekStartOf,
  type Habit,
  type IconKey,
  type TwState,
} from './data'

/**
 * Trailswell — habit tracker.
 * Art direction: warm risograph print. Dusty cream paper, one ink (burnt
 * sienna) with a sage second colour printed forever a millimetre off —
 * visible misregistration is the point. Chunky rounded type, hand-stamped
 * icons, and celebrations that stamp slowly instead of exploding. All data
 * is fictional, deterministic on first load, then yours; it lives only in
 * localStorage and exports as JSON.
 */

const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Softer suggestions for the weakest habit, keyed by stamp. */
const NUDGES: Record<IconKey, string> = {
  sun: 'The sun will be there tomorrow, showing off as usual.',
  boot: "The trail keeps. Tomorrow's a fine morning for it.",
  mug: 'The kettle takes four minutes. So does the habit.',
  moon: 'Start with two minutes on the mat, horizontal counts.',
  book: 'Put the book on the pillow tonight and let it guilt you gently.',
  leaf: 'One plant, one breath, one tick — that is enough.',
  drop: 'Fill the glass now; future you says thanks.',
  bell: 'Set it for the hour you always notice anyway.',
}

// ================================================================= ring

/** Per-habit ring: the last seven days as arc segments, sienna where done. */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const x0 = cx + r * Math.cos(a0)
  const y0 = cy + r * Math.sin(a0)
  const x1 = cx + r * Math.cos(a1)
  const y1 = cy + r * Math.sin(a1)
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
}

function Ring({ habit, today }: { habit: Habit; today: string }) {
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)), [today])
  const done = days.filter((d) => habit.log[d]).length
  const seg = (Math.PI * 2) / 7
  const gap = 0.18
  const r = 36
  const c = 48
  return (
    <svg viewBox="0 0 96 96" width="84" height="84" className="tw-ring" role="img"
      aria-label={`${habit.name}: ${done} of the last 7 days`}>
      {days.map((iso, i) => {
        const a0 = -Math.PI / 2 + i * seg + gap / 2
        const a1 = -Math.PI / 2 + (i + 1) * seg - gap / 2
        const isToday = iso === today
        const hit = habit.log[iso] === true
        const before = iso < habit.created
        return (
          <path
            key={iso}
            d={arcPath(c, c, r, a0, a1)}
            className={
              'tw-ring__seg' +
              (hit ? ' tw-ring__seg--done' : '') +
              (isToday && !hit ? ' tw-ring__seg--today' : '') +
              (before ? ' tw-ring__seg--before' : '')
            }
          />
        )
      })}
      <text x={c} y={c - 2} textAnchor="middle" className="tw-ring__num">
        {done}
      </text>
      <text x={c} y={c + 14} textAnchor="middle" className="tw-ring__of">
        of 7
      </text>
    </svg>
  )
}

// ================================================================= dialog

interface DialogDraft {
  name: string
  cue: string
  icon: IconKey
  target: number
}

function HabitDialog({
  mode,
  habit,
  onClose,
  onSave,
}: {
  mode: 'new' | 'edit'
  habit: Habit | null
  onClose: () => void
  onSave: (draft: DialogDraft) => void
}) {
  const [draft, setDraft] = useState<DialogDraft>(() =>
    habit
      ? { name: habit.name, cue: habit.cue, icon: habit.icon, target: habit.target }
      : { name: '', cue: '', icon: 'sun', target: 5 },
  )
  const [error, setError] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLInputElement>(null)
  const openerRef = useRef<Element | null>(null)

  useEffect(() => {
    openerRef.current = document.activeElement
    const t = window.setTimeout(() => firstRef.current?.focus(), 30)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const els = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex="0"]',
      )
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      const opener = openerRef.current
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [onClose])

  const submit = () => {
    const name = draft.name.trim()
    if (!name) {
      setError('Give the habit a name — even “stare at a gum tree” counts.')
      firstRef.current?.focus()
      return
    }
    onSave({ ...draft, name, cue: draft.cue.trim() })
  }

  return (
    <div className="tw-modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className="tw-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tw-dialog-title"
      >
        <p className="tw-overline">{mode === 'new' ? 'New trail' : 'Reshape the trail'}</p>
        <h2 id="tw-dialog-title" className="tw-modal__title">
          {mode === 'new' ? 'Plant a new habit' : `Edit “${habit?.name}”`}
        </h2>

        <div className="tw-field">
          <label htmlFor="tw-f-name">The habit</label>
          <input
            id="tw-f-name"
            ref={firstRef}
            type="text"
            maxLength={40}
            placeholder="Walk the fire trail"
            value={draft.name}
            aria-invalid={!!error}
            aria-describedby={error ? 'tw-f-err' : undefined}
            onChange={(e) => {
              setDraft((d) => ({ ...d, name: e.target.value }))
              if (error) setError('')
            }}
          />
          {error && (
            <p id="tw-f-err" className="tw-field__err" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="tw-field">
          <label htmlFor="tw-f-cue">The cue — when does it happen?</label>
          <input
            id="tw-f-cue"
            type="text"
            maxLength={60}
            placeholder="Straight after morning coffee"
            value={draft.cue}
            onChange={(e) => setDraft((d) => ({ ...d, cue: e.target.value }))}
          />
          <p className="tw-field__hint">Habits hitchhike on routines. “After X” beats “sometime”.</p>
        </div>

        <fieldset className="tw-field">
          <legend>Pick its stamp</legend>
          <div className="tw-iconpick" role="radiogroup" aria-label="Stamp icon">
            {ICON_CHOICES.map((c) => (
              <button
                key={c.key}
                type="button"
                role="radio"
                aria-checked={draft.icon === c.key}
                aria-label={c.label}
                className={'tw-iconpick__btn' + (draft.icon === c.key ? ' tw-iconpick__btn--on' : '')}
                onClick={() => setDraft((d) => ({ ...d, icon: c.key }))}
              >
                <Stamp icon={c.key} size={26} />
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="tw-field">
          <legend>Anchor days per week</legend>
          <div className="tw-anchorpick" role="radiogroup" aria-label="Anchor days per week">
            {[3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={draft.target === n}
                className={'tw-anchorpick__btn' + (draft.target === n ? ' tw-anchorpick__btn--on' : '')}
                onClick={() => setDraft((d) => ({ ...d, target: n }))}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="tw-field__hint">
            Anchors are the days that count — the rest are bonus track. Three is honest; seven is a vow.
          </p>
        </fieldset>

        <div className="tw-modal__actions">
          <button type="button" className="tw-btn" onClick={submit}>
            {mode === 'new' ? 'Plant it' : 'Save the shape'}
          </button>
          <button type="button" className="tw-btn tw-btn--ghost" onClick={onClose}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}

// ================================================================= heatmap

function Heatmap({
  state,
  today,
  selected,
  onSelect,
}: {
  state: TwState
  today: string
  selected: string
  onSelect: (iso: string) => void
}) {
  const grid = useMemo(() => heatGrid(state, today), [state, today])
  const cellRefs = useRef(new Map<string, HTMLButtonElement>())

  const focusCell = (col: number, row: number) => {
    if (col < 0 || col > 12 || row < 0 || row > 6) return
    const cell = grid[col][row]
    onSelect(cell.iso)
    cellRefs.current.get(cell.iso)?.focus()
  }

  // month ticks: label a column when its Monday opens a new month
  const months: Array<{ col: number; label: string } | null> = grid.map((week, col) => {
    const mon = week[0].iso
    const prev = col > 0 ? grid[col - 1][0].iso : null
    const m = Number(mon.slice(5, 7)) - 1
    if (prev && prev.slice(5, 7) === mon.slice(5, 7)) return null
    return { col, label: MONTH_SHORT[m] }
  })

  return (
    <div className="tw-heat-wrap">
      <div className="tw-heat" role="group" aria-label="Thirteen weeks of check-ins, newest week last">
        <div className="tw-heat__labels" aria-hidden="true">
          {WEEKDAY_LETTERS.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
        <div className="tw-heat__cols">
          <div className="tw-heat__months" aria-hidden="true">
            {months.map((m, col) => (
              <span key={col}>{m ? m.label : ''}</span>
            ))}
          </div>
          <div className="tw-heat__grid">
            {grid.map((week, col) => (
              <div className="tw-heat__col" key={col} role="presentation">
                {week.map((cell, row) => {
                  const label = cell.future
                    ? `${formatLong(cell.iso)} — hasn't happened yet`
                    : cell.active === 0
                      ? `${formatLong(cell.iso)} — no habits planted yet`
                      : `${formatLong(cell.iso)} — ${cell.done} of ${cell.active} habits walked`
                  return (
                    <button
                      key={cell.iso}
                      ref={(el) => {
                        if (el) cellRefs.current.set(cell.iso, el)
                        else cellRefs.current.delete(cell.iso)
                      }}
                      type="button"
                      className={
                        `tw-cell tw-cell--l${cell.level}` +
                        (cell.future ? ' tw-cell--future' : '') +
                        (cell.iso === today ? ' tw-cell--today' : '') +
                        (cell.iso === selected ? ' tw-cell--sel' : '')
                      }
                      tabIndex={cell.iso === selected ? 0 : -1}
                      aria-label={label}
                      aria-pressed={cell.iso === selected}
                      onClick={() => onSelect(cell.iso)}
                      onKeyDown={(e) => {
                        const move = (dc: number, dr: number) => {
                          e.preventDefault()
                          focusCell(col + dc, row + dr)
                        }
                        switch (e.key) {
                          case 'ArrowLeft': move(-1, 0); break
                          case 'ArrowRight': move(1, 0); break
                          case 'ArrowUp': move(0, -1); break
                          case 'ArrowDown': move(0, 1); break
                          case 'Home': e.preventDefault(); focusCell(col, 0); break
                          case 'End': e.preventDefault(); focusCell(col, 6); break
                        }
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="tw-heat__legend" aria-hidden="true">
        <span>quiet</span>
        <i className="tw-cell tw-cell--l0" />
        <i className="tw-cell tw-cell--l1" />
        <i className="tw-cell tw-cell--l2" />
        <i className="tw-cell tw-cell--l3" />
        <i className="tw-cell tw-cell--l4" />
        <span>all trails walked</span>
      </p>
    </div>
  )
}

// ================================================================= review

function WeekReviewCard({ state, today }: { state: TwState; today: string }) {
  const review = useMemo(() => reviewWeek(state, today), [state, today])
  if (review.totalAnchors === 0) return null

  const allHeld = review.heldAnchors === review.totalAnchors
  const drift = review.lastWeekHeld - review.heldAnchors
  const comparison =
    review.lastWeekTotal === 0
      ? null
      : drift > 0
        ? `Last week held ${review.lastWeekHeld} of ${review.lastWeekTotal}. The trail dips; it doesn't judge.`
        : drift < 0
          ? `Up from ${review.lastWeekHeld} of ${review.lastWeekTotal} last week. Quietly excellent.`
          : `Level with last week's ${review.lastWeekHeld} of ${review.lastWeekTotal}. Consistency is a personality trait now.`

  return (
    <div className="tw-review">
      <div className="tw-review__head">
        <p className="tw-overline">The week so far · gentle honesty</p>
        <p className="tw-review__big">
          <b>{review.heldAnchors}</b> of {review.totalAnchors} anchors held
        </p>
        <p className="tw-review__sub">
          {review.daysWalked} of {review.daysSoFar} days walked
          {comparison ? ` · ${comparison}` : ''}
        </p>
      </div>
      <ul className="tw-review__rows">
        {review.rows.map((r) => (
          <li key={r.habit.id} className={'tw-review__row' + (r.met ? ' tw-review__row--met' : '')}>
            <span className="tw-review__name">{r.habit.name}</span>
            <span className="tw-review__bar" aria-hidden="true">
              {Array.from({ length: r.target }, (_, i) => (
                <i key={i} className={i < r.done ? 'on' : ''} />
              ))}
            </span>
            <span className="tw-review__count">
              {r.done} of {r.target}
            </span>
          </li>
        ))}
      </ul>
      <p className="tw-review__note">
        {allHeld
          ? 'Every anchor held. Take the long way home tonight — you’ve earned the view.'
          : review.weakest
            ? `Gentlest nudge: “${review.weakest.habit.name}” is at ${review.weakest.done} of ${review.weakest.target} anchors. ${NUDGES[review.weakest.habit.icon]}`
            : ''}
      </p>
    </div>
  )
}

// ================================================================= app

export default function TrailswellHabitTracker() {
  const [state, setState] = useState<TwState>(loadState)
  const today = todayIso()
  const [selected, setSelected] = useState(today)
  const [dialog, setDialog] = useState<{ mode: 'new' | 'edit'; habit: Habit | null } | null>(null)
  const [announce, setAnnounce] = useState('')
  const [resetArmed, setResetArmed] = useState(false)
  const announceTimer = useRef(0)
  const resetTimer = useRef(0)

  useEffect(() => saveState(state), [state])
  useEffect(
    () => () => {
      window.clearTimeout(announceTimer.current)
      window.clearTimeout(resetTimer.current)
    },
    [],
  )

  const say = (msg: string) => {
    setAnnounce(msg)
    if (typeof window !== 'undefined') {
      window.clearTimeout(announceTimer.current)
      announceTimer.current = window.setTimeout(() => setAnnounce(''), 4000)
    }
  }

  const actives = activeHabitsFor(state, today)
  const shelved = state.habits.filter((h) => h.archived)
  const todayDone = actives.filter((h) => h.log[today]).length
  const allDone = actives.length > 0 && todayDone === actives.length

  // ------------------------------------------------------------ actions

  const toggle = (habit: Habit, iso: string, opts?: { quiet?: boolean }) => {
    const turningOn = habit.log[iso] !== true
    setState((prev) => ({
      habits: prev.habits.map((h) => {
        if (h.id !== habit.id) return h
        const log = { ...h.log }
        if (turningOn) log[iso] = true
        else delete log[iso]
        return { ...h, log }
      }),
    }))
    if (!opts?.quiet) {
      say(
        turningOn
          ? `“${habit.name}” stamped for ${formatShort(iso)}.`
          : `“${habit.name}” un-stamped for ${formatShort(iso)}. No judgement.`,
      )
    }
  }

  const saveDialog = (draft: DialogDraft) => {
    if (dialog?.mode === 'edit' && dialog.habit) {
      setState((prev) => ({
        habits: prev.habits.map((h) =>
          h.id === dialog.habit!.id
            ? { ...h, name: draft.name, cue: draft.cue, icon: draft.icon, target: draft.target }
            : h,
        ),
      }))
      say(`“${draft.name}” reshaped.`)
    } else {
      const habit: Habit = {
        id: uid(),
        name: draft.name,
        cue: draft.cue,
        icon: draft.icon,
        target: draft.target,
        created: today,
        archived: false,
        log: {},
      }
      setState((prev) => ({ habits: [...prev.habits, habit] }))
      say(`“${draft.name}” planted. First stamp is today, if you like.`)
    }
    setDialog(null)
  }

  const setShelved = (habit: Habit, archived: boolean) => {
    setState((prev) => ({
      habits: prev.habits.map((h) => (h.id === habit.id ? { ...h, archived } : h)),
    }))
    say(archived ? `“${habit.name}” shelved. The shelf is a kind place.` : `“${habit.name}” is back on the trail.`)
  }

  const removeHabit = (habit: Habit) => {
    setState((prev) => ({ habits: prev.habits.filter((h) => h.id !== habit.id) }))
    say(`“${habit.name}” and its footprints, gone for good.`)
  }

  const doExport = () => {
    if (typeof document === 'undefined') return
    const blob = new Blob([exportJson(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'trailswell-habits.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 2000)
    say(`Exported ${state.habits.length} habits and every stamp as JSON.`)
  }

  const doReset = () => {
    if (!resetArmed) {
      setResetArmed(true)
      say('Press “Really reset” within six seconds to wipe your stamps and replant the sample trail.')
      if (typeof window !== 'undefined') {
        window.clearTimeout(resetTimer.current)
        resetTimer.current = window.setTimeout(() => setResetArmed(false), 6000)
      }
      return
    }
    window.clearTimeout(resetTimer.current)
    setResetArmed(false)
    setState(seedState())
    setSelected(today)
    say('Fresh sample trail planted. Your stamps were composted.')
  }

  // ------------------------------------------------------------ derived day panel

  const selFuture = selected > today
  const selHabits = activeHabitsFor(state, selected)
  const selDone = selHabits.filter((h) => h.log[selected]).length
  const weekStart = weekStartOf(today)

  return (
    <div className="tw">
      <StampDefs />
      <div className="tw-sr" aria-live="polite">
        {announce}
      </div>

      {/* -------------------------------------------------- header */}
      <header className="tw-head">
        <p className="tw-wordmark">
          <span className="tw-wordmark__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" focusable="false">
              <g filter="url(#tw-rough)" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M12 21c-4-1-5.5-3.5-6-7M12 21c4-1 5.5-3.5 6-7M12 15c-3-.7-4.3-2.6-5-5.5M12 15c3-.7 4.3-2.6 5-5.5M12 9c-2-.5-3-2-3.4-4M12 9c2-.5 3-2 3.4-4" />
              </g>
            </svg>
          </span>
          Trailswell
        </p>
        <p className="tw-head__tag">Small steps, walked daily.</p>
        <div className="tw-head__actions">
          <button type="button" className="tw-btn" onClick={() => setDialog({ mode: 'new', habit: null })}>
            + New habit
          </button>
          <button type="button" className="tw-btn tw-btn--ghost" onClick={doExport}>
            Export JSON
          </button>
          <button
            type="button"
            className={'tw-btn tw-btn--ghost' + (resetArmed ? ' tw-btn--danger' : '')}
            onClick={doReset}
          >
            {resetArmed ? 'Really reset?' : 'Reset demo'}
          </button>
        </div>
      </header>

      {/* -------------------------------------------------- today */}
      <section className="tw-today tw-card" aria-labelledby="tw-h-today">
        <div className="tw-today__head">
          <div>
            <p className="tw-overline">Today’s trail</p>
            <h1 id="tw-h-today" className="tw-today__title">
              {formatLong(today)}
            </h1>
          </div>
          <p className="tw-today__progress">
            <b>{todayDone}</b> of {actives.length} stamped
          </p>
        </div>

        {actives.length === 0 ? (
          <p className="tw-empty">
            A blank trailhead. Plant your first habit below — start embarrassingly small; that’s the trick.
          </p>
        ) : (
          <ul className="tw-today__list">
            {actives.map((h) => {
              const on = h.log[today] === true
              return (
                <li key={h.id} className={'tw-check' + (on ? ' tw-check--on' : '')}>
                  <span className="tw-check__stamp" aria-hidden="true">
                    <Stamp icon={h.icon} size={30} />
                  </span>
                  <span className="tw-check__text">
                    <span className="tw-check__name">{h.name}</span>
                    <span className="tw-check__cue">{h.cue || 'Whenever it fits'}</span>
                  </span>
                  <button
                    type="button"
                    className="tw-check__btn"
                    aria-pressed={on}
                    aria-label={`${on ? 'Un-stamp' : 'Stamp'} “${h.name}” for today`}
                    onClick={() => toggle(h, today)}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                      <g filter="url(#tw-rough)" className="tw-check__ring">
                        <circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" strokeWidth="2" />
                      </g>
                      {on && (
                        <g filter="url(#tw-rough)" className="tw-check__mark">
                          <CheckGlyph width={2.6} />
                        </g>
                      )}
                    </svg>
                    <span className="tw-check__btnlabel">{on ? 'stamped' : 'stamp it'}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {allDone && (
          <div className="tw-bravo" role="status">
            <svg viewBox="0 0 120 120" className="tw-bravo__stamp" aria-hidden="true" focusable="false">
              <g filter="url(#tw-rough)">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="60" cy="60" r="41" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </g>
              <g filter="url(#tw-rough)" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M38 62l14 15 30-33" />
              </g>
            </svg>
            <p className="tw-bravo__text">
              Every trail walked today. <span>Nothing loud — just this.</span>
            </p>
          </div>
        )}
      </section>

      {/* -------------------------------------------------- heatmap + day */}
      <section className="tw-heatcard tw-card" aria-labelledby="tw-h-heat">
        <div className="tw-card__head">
          <p className="tw-overline">Thirteen weeks of footprints</p>
          <h2 id="tw-h-heat" className="tw-h2">
            The long view
          </h2>
          <p className="tw-muted">
            Tap any day to read it, correct it, or forgive it. Arrow keys walk the grid; Home and End leap
            the week.
          </p>
        </div>
        <div className="tw-heatrow">
          <Heatmap state={state} today={today} selected={selected} onSelect={setSelected} />
          <div className="tw-day" aria-live="off">
            <p className="tw-day__date">{formatLong(selected)}</p>
            {selFuture ? (
              <p className="tw-muted">
                Still upstream. Habits only count once the day arrives — come back with your boots on.
              </p>
            ) : selHabits.length === 0 ? (
              <p className="tw-muted">No habits had been planted yet. A genuinely quiet day.</p>
            ) : (
              <>
                <p className="tw-day__tally">
                  <b>{selDone}</b> of {selHabits.length} walked
                </p>
                <ul className="tw-day__list">
                  {selHabits.map((h) => {
                    const on = h.log[selected] === true
                    return (
                      <li key={h.id}>
                        <button
                          type="button"
                          className={'tw-day__row' + (on ? ' tw-day__row--on' : '')}
                          aria-pressed={on}
                          onClick={() => toggle(h, selected)}
                        >
                          <Stamp icon={h.icon} size={24} />
                          <span className="tw-day__name">{h.name}</span>
                          <span className="tw-day__state">{on ? 'walked' : 'not walked'}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <p className="tw-muted tw-day__hint">
                  Editing the past is allowed here. The heatmap is a journal, not a judge.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- review */}
      <section aria-labelledby="tw-h-review" className="tw-reviewwrap">
        <h2 id="tw-h-review" className="tw-sr">
          The week so far
        </h2>
        <WeekReviewCard state={state} today={today} />
      </section>

      {/* -------------------------------------------------- habits */}
      <section className="tw-habits" aria-labelledby="tw-h-habits">
        <div className="tw-habits__head">
          <div>
            <p className="tw-overline">On the trail</p>
            <h2 id="tw-h-habits" className="tw-h2">
              Your habits
            </h2>
          </div>
          <button type="button" className="tw-btn" onClick={() => setDialog({ mode: 'new', habit: null })}>
            + New habit
          </button>
        </div>

        {actives.length === 0 ? (
          <p className="tw-empty tw-card">
            Nothing on the trail right now. Plant one small habit — “stretch while the jug boils” small —
            and let momentum do the heavy lifting.
          </p>
        ) : (
          <ul className="tw-habits__grid">
            {actives.map((h) => {
              const streak = currentStreak(h, today)
              const best = bestStreak(h, today)
              const wk = weekCount(h, weekStart)
              return (
                <li key={h.id} className="tw-habit tw-card">
                  <div className="tw-habit__top">
                    <span className="tw-habit__stamp" aria-hidden="true">
                      <Stamp icon={h.icon} size={34} />
                    </span>
                    <div className="tw-habit__id">
                      <h3 className="tw-habit__name">{h.name}</h3>
                      <p className="tw-habit__cue">{h.cue || 'Whenever it fits'}</p>
                    </div>
                    <Ring habit={h} today={today} />
                  </div>
                  <dl className="tw-habit__facts">
                    <div>
                      <dt>This week</dt>
                      <dd>
                        {wk} of {h.target} anchors
                      </dd>
                    </div>
                    <div>
                      <dt>Current run</dt>
                      <dd>{streak === 1 ? '1 day' : `${streak} days`}</dd>
                    </div>
                    <div>
                      <dt>Best run</dt>
                      <dd>{best === 1 ? '1 day' : `${best} days`}</dd>
                    </div>
                  </dl>
                  <div className="tw-habit__actions">
                    <button type="button" className="tw-link" onClick={() => setDialog({ mode: 'edit', habit: h })}>
                      Edit
                    </button>
                    <button type="button" className="tw-link" onClick={() => setShelved(h, true)}>
                      Shelf it
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* -------------------------------------------------- shelf */}
      {shelved.length > 0 && (
        <section className="tw-shelf" aria-labelledby="tw-h-shelf">
          <div className="tw-card tw-card--quiet">
            <div className="tw-card__head">
              <p className="tw-overline">The shelf</p>
              <h2 id="tw-h-shelf" className="tw-h2">
                Resting habits
              </h2>
              <p className="tw-muted">
                Shelving isn’t quitting; it’s admitting the season changed. Bring one back any time.
              </p>
            </div>
            <ul className="tw-shelf__list">
              {shelved.map((h) => (
                <li key={h.id} className="tw-shelf__row">
                  <Stamp icon={h.icon} size={22} />
                  <span className="tw-shelf__name">{h.name}</span>
                  <span className="tw-shelf__meta muted">
                    shelved · {h.target} anchors/wk
                  </span>
                  <span className="tw-shelf__actions">
                    <button type="button" className="tw-link" onClick={() => setShelved(h, false)}>
                      Bring back
                    </button>
                    <button type="button" className="tw-link tw-link--danger" onClick={() => removeHabit(h)}>
                      Compost
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* -------------------------------------------------- footer */}
      <footer className="tw-foot">
        <p>
          Trailswell is a fictional wellness brand. Every stamp lives in this browser’s localStorage — leave
          and it stays; export and it follows. Walk gently.
        </p>
      </footer>

      {dialog && (
        <HabitDialog
          mode={dialog.mode}
          habit={dialog.habit}
          onClose={() => setDialog(null)}
          onSave={saveDialog}
        />
      )}
    </div>
  )
}
