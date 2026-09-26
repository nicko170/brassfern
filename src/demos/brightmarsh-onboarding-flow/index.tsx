import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { COURSES, GOALS, type Course, type Goal } from './data'
import './demo.css'

/**
 * Brightmarsh — course onboarding flow.
 * Art direction: chalk-and-ink academia — bone-white ruled paper, ink navy,
 * highlighter yellow, red margin lines. Deliberately unlike Brassfern's brand.
 *
 * A four-step state machine (goal → honesty dial → course → week) with a
 * genuinely satisfying plan-ready ending. Draft autosaves to localStorage,
 * resume banner on return, "finish later" affordance, full keyboard support
 * (real radios/checkboxes under the card styling) and reduced-motion-safe
 * animation throughout. All tutors, courses and stats are fictional.
 */

const STORE_KEY = 'brightmarsh-onboarding-v1'
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const STEP_LABELS = ['Goal', 'Time', 'Course', 'Week'] as const

interface Saved {
  step: number
  goalId: string | null
  hours: number
  courseId: string | null
  days: number[]
  completed: boolean
}

function loadSaved(): Saved | null {
  try {
    const raw = window.localStorage.getItem(STORE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Partial<Saved>
    const out: Saved = {
      step: typeof s.step === 'number' ? Math.min(Math.max(Math.round(s.step), 0), 4) : 0,
      goalId: GOALS.some((g) => g.id === s.goalId) ? (s.goalId as string) : null,
      hours: typeof s.hours === 'number' ? Math.min(Math.max(s.hours, 1), 10) : 3,
      courseId: COURSES.some((c) => c.id === s.courseId) ? (s.courseId as string) : null,
      days: Array.isArray(s.days)
        ? [...new Set(s.days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort((a, b) => a - b)
        : [1, 3],
      completed: s.completed === true,
    }
    // coherence: steps 2+ need a course, step 3+ needs at least one day
    if (!out.courseId && out.step >= 2) out.step = 1
    if (out.days.length === 0 && out.step >= 3) out.step = 2
    if ((out.step === 4 || out.completed) && (!out.courseId || out.days.length === 0)) {
      out.step = Math.min(out.step, 1)
      out.completed = false
    }
    return out
  } catch {
    return null
  }
}

function persist(s: Saved) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(s))
  } catch {
    /* private mode — the demo still works, it just can't hold your place */
  }
}

function clearSaved() {
  try {
    window.localStorage.removeItem(STORE_KEY)
  } catch {
    /* ignore */
  }
}

// ------------------------------------------------------------- schedule

interface Session {
  /** index into DAY_NAMES (0 = Monday) */
  day: number
  minutes: number
  lessonFrom: number
  lessonTo: number
}

interface Plan {
  start: Date
  /** first-week sessions — one per chosen day, in weekday order */
  week: Session[]
  sessionMinutes: number
  totalSessions: number
  weeksNeeded: number
  finish: Date
}

/** Next Monday strictly after today. */
function nextMonday(from: Date): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const mondayOffset = (8 - d.getDay()) % 7 || 7
  d.setDate(d.getDate() + mondayOffset)
  return d
}

function buildPlan(course: Course, hours: number, days: number[]): Plan {
  const sorted = [...days].sort((a, b) => a - b)
  const sessionMinutes = Math.min(150, Math.max(25, Math.round((hours * 60) / sorted.length / 5) * 5))
  const totalSessions = Math.max(1, Math.ceil((course.hours * 60) / sessionMinutes))
  const weeksNeeded = Math.max(1, Math.ceil(totalSessions / sorted.length))
  const start = nextMonday(new Date())

  // lessons spread evenly across the whole plan; first week shows its slice
  const sessions: Session[] = []
  let lessonCursor = 1
  for (let s = 0; s < totalSessions; s++) {
    const day = sorted[s % sorted.length]
    const lessonTo = Math.min(course.lessons, Math.round(((s + 1) / totalSessions) * course.lessons))
    sessions.push({ day, minutes: sessionMinutes, lessonFrom: lessonCursor, lessonTo: Math.max(lessonTo, lessonCursor) })
    lessonCursor = Math.max(lessonTo, lessonCursor) + 1
  }

  const finish = new Date(start)
  finish.setDate(finish.getDate() + (weeksNeeded - 1) * 7 + sorted[sorted.length - 1])
  return { start, week: sessions.slice(0, sorted.length), sessionMinutes, totalSessions, weeksNeeded, finish }
}

const fmtDate = (d: Date) => `${DAY_NAMES[(d.getDay() + 6) % 7]} ${d.getDate()} ${MONTHS[d.getMonth()]}`

/** Session start label — weeknights after work, weekend mornings. */
const sessionTime = (day: number) => (day >= 5 ? '10:00' : '18:30')

function icsFor(plan: Plan, course: Course): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Brightmarsh//Onboarding Plan//EN',
  ]
  plan.week.forEach((s, i) => {
    const start = new Date(plan.start)
    start.setDate(start.getDate() + s.day)
    const [hh, mm] = sessionTime(s.day).split(':').map(Number)
    start.setHours(hh, mm, 0, 0)
    const end = new Date(start.getTime() + s.minutes * 60_000)
    lines.push(
      'BEGIN:VEVENT',
      `UID:${start.getTime()}-${i}@brightmarsh.demo`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${course.title} — lessons ${s.lessonFrom}–${s.lessonTo} (Brightmarsh)`,
      `DESCRIPTION:${DAY_NAMES[s.day]} study session, ${s.minutes} minutes. Miss one? It moves, it doesn't pile up.`,
      'END:VEVENT',
    )
  })
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

// --------------------------------------------------------- small pieces

function Icon({ name }: { name: Goal['icon'] }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'compass':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5 13.4 13.4 8.5 15.5 10.6 10.6z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'sigma':
      return (
        <svg {...common}>
          <path d="M17 6H8l6 6-6 6h9" />
        </svg>
      )
    case 'pen':
      return (
        <svg {...common}>
          <path d="M14.5 4.5 19.5 9.5 8.5 20.5 3.5 21.5 4.5 16.5z" />
          <path d="M13 6l5 5" />
        </svg>
      )
    case 'mic':
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
        </svg>
      )
    case 'rocket':
      return (
        <svg {...common}>
          <path d="M12 3c4 1.5 6 5 6 9l-4 4c-4 0-7.5-2-9-6l7-7zM9 15l-2.5 2.5M14 19l-1 2M5 10l-2 1" />
          <circle cx="12.5" cy="9.5" r="1.4" />
        </svg>
      )
    case 'map':
      return (
        <svg {...common}>
          <path d="M8 4 3 6v14l5-2 8 2 5-2V4l-5 2-8-2zM8 4v14M16 6v14" />
        </svg>
      )
  }
}

// ------------------------------------------------------------- component

export default function BrightmarshOnboarding() {
  const [initial] = useState<Saved | null>(() => (typeof window === 'undefined' ? null : loadSaved()))
  const resumed = !!initial && (initial.step > 0 || initial.goalId !== null)

  const [step, setStep] = useState(() => initial?.step ?? 0)
  const [goalId, setGoalId] = useState<string | null>(() => initial?.goalId ?? null)
  const [hours, setHours] = useState(() => initial?.hours ?? 3)
  const [courseId, setCourseId] = useState<string | null>(() => initial?.courseId ?? null)
  const [days, setDays] = useState<number[]>(() => initial?.days ?? [1, 3])

  const [banner, setBanner] = useState<'resume' | 'later' | null>(resumed ? 'resume' : null)
  const [stepError, setStepError] = useState('')
  const [announce, setAnnounce] = useState('')
  const [savedTick, setSavedTick] = useState(false)
  const [copied, setCopied] = useState(false)
  const [browseAll, setBrowseAll] = useState(false)
  const [committed, setCommitted] = useState(() => initial?.completed === true)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRun = useRef(true)

  const goal = GOALS.find((g) => g.id === goalId) ?? null
  const course = COURSES.find((c) => c.id === courseId) ?? null
  const plan = useMemo(
    () => (course && days.length > 0 ? buildPlan(course, hours, days) : null),
    [course, hours, days],
  )

  // Autosave — the "progress saved across steps" promise, kept quietly.
  useEffect(() => {
    persist({ step, goalId, hours, courseId, days, completed: committed })
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setSavedTick(true)
    const t = window.setTimeout(() => setSavedTick(false), 1600)
    return () => window.clearTimeout(t)
  }, [step, goalId, hours, courseId, days, committed])

  // Focus + announce each step change.
  useEffect(() => {
    headingRef.current?.focus()
    const label = step >= 4 ? 'Your plan is ready' : STEP_LABELS[step]
    setAnnounce(step >= 4 ? 'Your first week is planned.' : `Step ${step + 1} of 4: ${label}`)
  }, [step])

  // Course recommendations: goal match first, then plans that fit inside a
  // sane number of weeks, with foundations gently favoured.
  const ranked = useMemo(() => {
    return COURSES.map((c) => {
      const weeks = Math.ceil(c.hours / hours)
      const score =
        (goalId && c.goals.includes(goalId) ? 10 : 0) + (weeks <= 3 ? 3 : weeks <= 5 ? 2 : 1) + (c.level === 'Foundations' ? 1 : 0)
      return { c, weeks, score }
    }).sort((a, b) => b.score - a.score || a.c.hours - b.c.hours)
  }, [goalId, hours])

  const recommended = ranked.slice(0, 3)

  const minutesPerDay = Math.round(((hours * 60) / 7) / 5) * 5
  const sixtyWeeks = Math.ceil(6 / hours)
  const bandCopy =
    hours < 2
      ? 'Slow burns count. We\u2019ll plan tiny and mean it.'
      : hours < 5
        ? 'The Brightmarsh sweet spot. Most finishers live here.'
        : hours < 7.5
          ? 'Solid. Two or three decent sittings a week.'
          : 'Ambitious. We\u2019ll build rest stops into the plan.'

  const canContinue = (s: number): string => {
    if (s === 0 && !goalId) return 'Pick the one that stings a little. That\u2019s usually it.'
    if (s === 2 && !courseId) return 'Choose a course to anchor week one — you can switch later, real life permitting.'
    if (s === 3 && days.length === 0) return 'Give week one at least one day to stand on.'
    return ''
  }

  const goNext = () => {
    const err = canContinue(step)
    if (err) {
      setStepError(err)
      return
    }
    setStepError('')
    if (step === 3) setCommitted(true)
    setStep((s) => Math.min(4, s + 1))
  }

  const goBack = () => {
    setStepError('')
    setStep((s) => Math.max(0, s - 1))
  }

  const startOver = () => {
    clearSaved()
    setStep(0)
    setGoalId(null)
    setHours(3)
    setCourseId(null)
    setDays([1, 3])
    setCommitted(false)
    setBanner(null)
    setStepError('')
    setCopied(false)
  }

  const downloadIcs = () => {
    if (!plan || !course) return
    const blob = new Blob([icsFor(plan, course)], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'brightmarsh-first-week.ics'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const copyPlan = () => {
    if (!plan || !course || !goal) return
    const text = [
      `BRIGHTMARSH — first-week plan`,
      ``,
      `Goal: ${goal.title}`,
      `Course: ${course.title} (${course.hours}h, ${course.lessons} lessons, with ${course.tutor})`,
      `Pace: ${hours} hrs/week across ${days.length} day${days.length === 1 ? '' : 's'} (${plan.sessionMinutes}-minute sittings)`,
      `Starts: ${fmtDate(plan.start)} · Aims to finish around: ${fmtDate(plan.finish)}`,
      `Week one: ${plan.week
        .map((s) => `${DAY_NAMES[s.day]} ${sessionTime(s.day)}, ${s.minutes} min, lessons ${s.lessonFrom}–${s.lessonTo}`)
        .join(' · ')}`,
      `Miss one? It moves, it doesn't pile up.`,
    ].join('\n')
    try {
      void navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2200)
      })
    } catch {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    }
  }

  const toggleDay = (d: number) =>
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b),
    )

  const matchReasons = (c: Course): string[] => {
    const out: string[] = []
    if (goalId && c.goals.includes(goalId)) out.push('Matches your goal')
    const weeks = Math.ceil(c.hours / hours)
    if (weeks <= 4) out.push(`Done in ~${weeks} wk${weeks === 1 ? '' : 's'} at your pace`)
    if (c.level === 'Foundations') out.push('No prerequisites')
    return out
  }

  // dial geometry
  const dialAngle = ((hours - 1) / 9) * 160 - 80
  const dialPoint = (h: number) => {
    const t = (h - 1) / 9
    const rad = ((180 - t * 180) * Math.PI) / 180
    return { x: 130 + 100 * Math.cos(rad), y: 130 - 100 * Math.sin(rad) }
  }
  const activeEnd = dialPoint(hours)
  const activeLarge = hours - 1 > 4.5 ? 1 : 0

  return (
    <div className="bm">
      <div className="bm__sr" aria-live="polite">
        {announce}
      </div>

      {/* ---------------------------------------------------------- head */}
      <header className="bm__head">
        <div className="bm__head-in">
          <p className="bm__wordmark">
            Bright<span className="bm__wordmark-hl">marsh</span>
            <em>short courses, taken seriously</em>
          </p>
          <div className="bm__head-right">
            <span className={`bm__saved${savedTick ? ' bm__saved--on' : ''}`} aria-hidden={!savedTick}>
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 6.5 5 9.5 10 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              place saved
            </span>
            {step < 4 && (
              <button type="button" className="bm__later" onClick={() => setBanner('later')}>
                Finish later
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------- banners */}
      {banner === 'resume' && (
        <div className="bm__banner" role="status">
          <p>
            <b>Welcome back.</b> Your draft is right where you left it
            {initial && initial.step > 0 && initial.step < 4 ? ` — on “${STEP_LABELS[Math.min(initial.step, 3)]}”` : ''}.
          </p>
          <div className="bm__banner-actions">
            <button type="button" className="bm__btn bm__btn--solid" onClick={() => setBanner(null)}>
              Keep going
            </button>
            <button type="button" className="bm__btn bm__btn--ghost" onClick={startOver}>
              Start fresh
            </button>
          </div>
        </div>
      )}
      {banner === 'later' && (
        <div className="bm__banner" role="status">
          <p>
            <b>Done for now.</b> Your place is saved in this browser — come back whenever and we&rsquo;ll be
            holding page {step + 1} of 4. No email guilt-trip. That&rsquo;s policy.
          </p>
          <div className="bm__banner-actions">
            <button type="button" className="bm__btn bm__btn--solid" onClick={() => setBanner(null)}>
              Keep going after all
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------ progress */}
      {step < 4 && (
        <nav className="bm__progress" aria-label="Onboarding progress">
          <ol className="bm__pips">
            {STEP_LABELS.map((label, i) => {
              const done = i < step
              const current = i === step
              return (
                <li key={label} className={`bm__pip${done ? ' bm__pip--done' : ''}${current ? ' bm__pip--now' : ''}`}>
                  {done ? (
                    <button type="button" onClick={() => { setStepError(''); setStep(i) }} aria-label={`Back to ${label}`}>
                      <span className="bm__pip-num" aria-hidden="true">✓</span>
                      <span className="bm__pip-label">{label}</span>
                    </button>
                  ) : (
                    <span className="bm__pip-static" aria-current={current ? 'step' : undefined}>
                      <span className="bm__pip-num" aria-hidden="true">{i + 1}</span>
                      <span className="bm__pip-label">{label}</span>
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
          <div className="bm__track" aria-hidden="true">
            <span style={{ width: `${(step / STEP_LABELS.length) * 100 + 12.5}%` }} />
          </div>
        </nav>
      )}

      {/* --------------------------------------------------------- main */}
      <main className="bm__main">
        {/* ------------------------------------------------ step 0 goal */}
        {step === 0 && (
          <section className="bm__card" aria-labelledby="bm-h">
            <p className="bm__overline">Step one — the honest bit</p>
            <h1 id="bm-h" ref={headingRef} tabIndex={-1} className="bm__h1">
              What are you here to get <em className="bm__hl">better</em> at?
            </h1>
            <p className="bm__lead">
              One answer. You can want all six — but plans built on &ldquo;everything&rdquo; finish nothing.
            </p>
            <div className="bm__goals" role="radiogroup" aria-label="Choose your goal">
              {GOALS.map((g) => (
                <label key={g.id} className={`bm__goal${goalId === g.id ? ' bm__goal--on' : ''}`}>
                  <input
                    type="radio"
                    name="bm-goal"
                    className="bm__sr"
                    checked={goalId === g.id}
                    onChange={() => { setGoalId(g.id); setStepError('') }}
                  />
                  <span className="bm__goal-icon" aria-hidden="true">
                    <Icon name={g.icon} />
                  </span>
                  <span className="bm__goal-body">
                    <b>{g.title}</b>
                    <span>{g.blurb}</span>
                  </span>
                  <span className="bm__goal-tick" aria-hidden="true">✓</span>
                </label>
              ))}
            </div>
            <p className="bm__margin-note" aria-hidden="true">pick the one that stings →</p>
          </section>
        )}

        {/* ------------------------------------------------ step 1 time */}
        {step === 1 && (
          <section className="bm__card" aria-labelledby="bm-h">
            <p className="bm__overline">Step two — no heroics</p>
            <h1 id="bm-h" ref={headingRef} tabIndex={-1} className="bm__h1">
              How many hours a week can you <em className="bm__hl">honestly</em> give?
            </h1>
            <p className="bm__lead">
              Not aspirational hours. Tuesday-after-work hours. The dial does the maths you&rsquo;d otherwise avoid.
            </p>

            <div className="bm__dial-wrap">
              <div className="bm__dial" aria-hidden="true">
                <svg viewBox="0 0 260 150">
                  <path d="M30 130 A100 100 0 0 1 230 130" className="bm__dial-arc" />
                  <path
                    d={`M30 130 A100 100 0 ${activeLarge} 1 ${activeEnd.x.toFixed(1)} ${activeEnd.y.toFixed(1)}`}
                    className="bm__dial-arc bm__dial-arc--active"
                  />
                  {Array.from({ length: 10 }, (_, i) => {
                    const p1 = dialPoint(i + 1)
                    const t = (i) / 9
                    const rad = ((180 - t * 180) * Math.PI) / 180
                    const p0 = { x: 130 + 88 * Math.cos(rad), y: 130 - 88 * Math.sin(rad) }
                    return <line key={i} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} className="bm__dial-tick" />
                  })}
                  <g className="bm__needle" style={{ transform: `rotate(${dialAngle}deg)` }}>
                    <line x1="130" y1="130" x2="130" y2="48" />
                    <circle cx="130" cy="130" r="6" />
                  </g>
                </svg>
                <p className="bm__dial-read">
                  <b>{hours % 1 === 0 ? hours : hours.toFixed(1)}</b> hrs<span>/week</span>
                </p>
              </div>

              <div className="bm__dial-side">
                <label className="bm__range-label" htmlFor="bm-hours">
                  Weekly commitment <span>slide, or use arrow keys</span>
                </label>
                <input
                  id="bm-hours"
                  className="bm__range"
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  style={{ '--fill': `${((hours - 1) / 9) * 100}%` } as CSSProperties}
                  aria-valuetext={`${hours} hours per week`}
                />
                <div className="bm__range-scale" aria-hidden="true">
                  <span>1</span>
                  <span className="bm__range-median">median finisher: 3–4</span>
                  <span>10</span>
                </div>
                <dl className="bm__math">
                  <div>
                    <dt>Per day, averaged</dt>
                    <dd>≈ {minutesPerDay} min</dd>
                  </div>
                  <div>
                    <dt>A 6-hour course takes</dt>
                    <dd>
                      {sixtyWeeks} wk{sixtyWeeks === 1 ? '' : 's'}
                    </dd>
                  </div>
                  <div>
                    <dt>Advised sitting length</dt>
                    <dd>{Math.min(150, Math.max(25, Math.round((hours * 60) / Math.max(days.length, 1) / 5) * 5))} min</dd>
                  </div>
                </dl>
                <p className="bm__verdict">{bandCopy}</p>
              </div>
            </div>
            <p className="bm__margin-note" aria-hidden="true">we&rsquo;ve done the maths ↓</p>
          </section>
        )}

        {/* ---------------------------------------------- step 2 course */}
        {step === 2 && (
          <section className="bm__card bm__card--wide" aria-labelledby="bm-h">
            <p className="bm__overline">Step three — the shortlist</p>
            <h1 id="bm-h" ref={headingRef} tabIndex={-1} className="bm__h1">
              Three courses that fit <em className="bm__hl">your</em> plan
            </h1>
            <p className="bm__lead">
              Matched to &ldquo;{goal?.title.toLowerCase()}&rdquo; and {hours} honest hours a week. The whole
              catalogue&rsquo;s below if you&rsquo;d rather browse.
            </p>

            <div className="bm__picks" role="radiogroup" aria-label="Recommended courses">
              {recommended.map(({ c, weeks }, i) => (
                <label
                  key={c.id}
                  className={`bm__course bm__course--pick${courseId === c.id ? ' bm__course--on' : ''}`}
                >
                  <input
                    type="radio"
                    name="bm-course"
                    className="bm__sr"
                    checked={courseId === c.id}
                    onChange={() => { setCourseId(c.id); setStepError('') }}
                  />
                  <span className="bm__course-flag" aria-hidden="true">
                    {i === 0 ? 'Start here' : i === 1 ? 'Then next' : 'Or instead'}
                  </span>
                  <b className="bm__course-title">{c.title}</b>
                  <span className="bm__course-meta">
                    {c.level} · {c.hours}h · {c.lessons} lessons · with {c.tutor}
                  </span>
                  <span className="bm__course-blurb">{c.blurb}</span>
                  <span className="bm__course-reasons">
                    {matchReasons(c).map((r) => (
                      <span key={r}>{r}</span>
                    ))}
                  </span>
                  <span className="bm__course-note" aria-hidden="true">“{c.note}” · ~{weeks} wks</span>
                </label>
              ))}
            </div>

            <button
              type="button"
              className="bm__btn bm__btn--ghost bm__browse"
              aria-expanded={browseAll}
              onClick={() => setBrowseAll((b) => !b)}
            >
              {browseAll ? 'Hide the full catalogue' : 'Browse the full catalogue (12)'}
            </button>
            {browseAll && (
              <div className="bm__catalogue" role="radiogroup" aria-label="All Brightmarsh courses">
                {[...COURSES]
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((c) => (
                    <label key={c.id} className={`bm__course bm__course--row${courseId === c.id ? ' bm__course--on' : ''}`}>
                      <input
                        type="radio"
                        name="bm-course"
                        className="bm__sr"
                        checked={courseId === c.id}
                        onChange={() => { setCourseId(c.id); setStepError('') }}
                      />
                      <span className="bm__course-rowmain">
                        <b>{c.title}</b>
                        <span>{c.level} · {c.hours}h · {c.lessons} lessons · with {c.tutor}</span>
                      </span>
                      <span className="bm__course-reasons">
                        {matchReasons(c).slice(0, 2).map((r) => (
                          <span key={r}>{r}</span>
                        ))}
                      </span>
                    </label>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* ------------------------------------------------ step 3 week */}
        {step === 3 && course && plan && (
          <section className="bm__card bm__card--wide" aria-labelledby="bm-h">
            <p className="bm__overline">Step four — make it real</p>
            <h1 id="bm-h" ref={headingRef} tabIndex={-1} className="bm__h1">
              Which days does <em className="bm__hl">week one</em> get?
            </h1>
            <p className="bm__lead">
              Pick your days and watch the plan adjust. Sessions are {plan.sessionMinutes} minutes — sized to your
              {' '}{hours} weekly hours, not to your optimism.
            </p>

            <div className="bm__days" role="group" aria-label="Choose your study days">
              {DAY_NAMES.map((name, i) => (
                <label key={name} className={`bm__day${days.includes(i) ? ' bm__day--on' : ''}`}>
                  <input
                    type="checkbox"
                    className="bm__sr"
                    checked={days.includes(i)}
                    onChange={() => { toggleDay(i); setStepError('') }}
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>

            <div className="bm__weekgrid-wrap">
              <ol className="bm__week" aria-label={`Week beginning Monday ${plan.start.getDate()} ${MONTHS[plan.start.getMonth()]}`}>
                {DAY_NAMES.map((name, i) => {
                  const s = plan.week.find((x) => x.day === i)
                  const date = new Date(plan.start)
                  date.setDate(date.getDate() + i)
                  return (
                    <li key={name} className={`bm__cell${s ? ' bm__cell--on' : ''}`}>
                      <span className="bm__cell-head">
                        {name} <span>{date.getDate()} {MONTHS[date.getMonth()]}</span>
                      </span>
                      {s ? (
                        <span className="bm__session">
                          <b>{sessionTime(i)} · {s.minutes} min</b>
                          <span>Lessons {s.lessonFrom}–{s.lessonTo}</span>
                        </span>
                      ) : (
                        <span className="bm__rest">rest</span>
                      )}
                    </li>
                  )
                })}
              </ol>
            </div>

            <aside className="bm__summary" aria-label="Your plan so far">
              <div>
                <span>Course</span>
                <b>{course.title}</b>
              </div>
              <div>
                <span>Goal</span>
                <b>{goal?.title}</b>
              </div>
              <div>
                <span>Pace</span>
                <b>{hours} hrs/wk · {days.length} sitting{days.length === 1 ? '' : 's'}</b>
              </div>
              <div>
                <span>Starts</span>
                <b>{fmtDate(plan.start)}</b>
              </div>
              <div>
                <span>Finishes around</span>
                <b>{fmtDate(plan.finish)} · {plan.totalSessions} sittings</b>
              </div>
              <p className="bm__summary-note">Miss one? It moves, it doesn&rsquo;t pile up. That&rsquo;s the whole trick.</p>
            </aside>
          </section>
        )}

        {/* ------------------------------------------------- step 4 done */}
        {step === 4 && course && plan && goal && (
          <section className="bm__card bm__card--done" aria-labelledby="bm-h">
            <div className="bm__stamp" aria-hidden="true">
              <span>Place held</span>
            </div>
            <p className="bm__overline">Syllabus, week one</p>
            <h1 id="bm-h" ref={headingRef} tabIndex={-1} className="bm__h1">
              You start <em className="bm__hl">{fmtDate(plan.start)}</em>. That&rsquo;s the whole announcement.
            </h1>
            <p className="bm__lead">
              No confetti, no streak to babysit. {plan.totalSessions} sittings of {plan.sessionMinutes} minutes,
              {' '}and <b>{course.title}</b> is done around {fmtDate(plan.finish)}.
            </p>

            <div className="bm__ticket" role="group" aria-label="Your first week">
              <div className="bm__ticket-head">
                <b>{course.title}</b>
                <span>with {course.tutor} · {course.level}</span>
              </div>
              <ol>
                {plan.week.map((s, i) => {
                  const date = new Date(plan.start)
                  date.setDate(date.getDate() + s.day)
                  return (
                    <li key={i}>
                      <span className="bm__ticket-day">{fmtDate(date)}</span>
                      <span className="bm__ticket-time">{sessionTime(s.day)} · {s.minutes} min</span>
                      <span className="bm__ticket-lesson">Lessons {s.lessonFrom}–{s.lessonTo}</span>
                      <span className="bm__ticket-box" aria-hidden="true" />
                    </li>
                  )
                })}
              </ol>
              <p className="bm__ticket-goal">
                In service of: <b>{goal.title}</b>
              </p>
            </div>

            <div className="bm__done-actions">
              <button type="button" className="bm__btn bm__btn--solid" onClick={downloadIcs}>
                Add week one to calendar (.ics)
              </button>
              <button type="button" className="bm__btn bm__btn--ghost" onClick={copyPlan}>
                {copied ? 'Copied ✓' : 'Copy the plan'}
              </button>
              <button type="button" className="bm__btn bm__btn--quiet" onClick={startOver}>
                Run the flow again
              </button>
            </div>
            <p className="bm__fine">
              Your draft lived in this browser only — nothing ever left it. The real Brightmarsh sends one nudge
              email, 48 hours after a missed session, then silence. It works. We checked.
            </p>
          </section>
        )}

        {/* --------------------------------------------------- step nav */}
        {step < 4 && (
          <div className="bm__nav">
            <button
              type="button"
              className="bm__btn bm__btn--ghost"
              onClick={goBack}
              disabled={step === 0}
            >
              ← Back
            </button>
            {stepError && (
              <p className="bm__error" role="alert">
                {stepError}
              </p>
            )}
            <button type="button" className="bm__btn bm__btn--solid" onClick={goNext}>
              {step === 3 ? 'Hold my place →' : 'Continue →'}
            </button>
          </div>
        )}
      </main>

      <footer className="bm__foot">
        <p>
          <b>Brightmarsh</b> — 4–8 hour courses for people with jobs. A working demo; the tutors, catalogue and
          stats are invented, the state machine is not.
        </p>
      </footer>
    </div>
  )
}
