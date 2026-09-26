/**
 * Trailswell habit tracker — data layer.
 * Habit trackers live in local days, never UTC: every key is a local
 * YYYY-MM-DD. History is seeded deterministically (a tiny FNV-ish hash) so
 * the heatmap looks walked-in on first visit but identical on every visit.
 * Everything persists to localStorage; export produces the same shape.
 */

export const DAY_MS = 86_400_000
export const WINDOW_DAYS = 91 // thirteen weeks of footprints

export type IconKey = 'sun' | 'boot' | 'mug' | 'moon' | 'book' | 'leaf' | 'drop' | 'bell'

export interface Habit {
  id: string
  name: string
  cue: string
  icon: IconKey
  /** anchor days per week — the gentle target */
  target: number
  created: string // iso date
  archived: boolean
  log: Record<string, true>
}

export interface TwState {
  habits: Habit[]
}

// ------------------------------------------------------------------ dates

export function isoOf(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayIso(): string {
  return isoOf(new Date())
}

/** Noon anchor so DST transitions can't skip a date. */
export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + n)
  return isoOf(d)
}

export function weekdayOf(iso: string): number {
  return new Date(`${iso}T12:00:00`).getDay() // 0 = Sunday
}

export function formatLong(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatShort(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

/** Monday-first week start. */
export function weekStartOf(iso: string): string {
  const dow = weekdayOf(iso)
  const back = dow === 0 ? 6 : dow - 1
  return addDays(iso, -back)
}

export function weekDays(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

// ------------------------------------------------------------------ rng

/** Deterministic 0..1 hash — stable across loads, browsers and timelines. */
function hash01(key: string): number {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995)
  h ^= h >>> 15
  return (h >>> 0) / 4294967296
}

// ------------------------------------------------------------------ seed

interface SeedSpec {
  name: string
  cue: string
  icon: IconKey
  target: number
  /** base probability of a day being done */
  consistency: number
  /** extra chance of a rest on Sunday */
  sundayDip: number
}

const SEEDS: SeedSpec[] = [
  { name: 'Sunrise salute', cue: 'Before the kettle boils', icon: 'sun', target: 6, consistency: 0.84, sundayDip: 0.05 },
  { name: 'Walk the ridge loop', cue: 'Shoes by the door at five', icon: 'boot', target: 4, consistency: 0.6, sundayDip: 0.35 },
  { name: 'Brew tea, no phone', cue: 'After the last email', icon: 'mug', target: 7, consistency: 0.74, sundayDip: 0 },
  { name: 'Ten pages of fiction', cue: 'Book waits on the pillow', icon: 'book', target: 5, consistency: 0.58, sundayDip: 0.1 },
  { name: 'Stretch before bed', cue: 'When the house goes quiet', icon: 'moon', target: 5, consistency: 0.44, sundayDip: 0.15 },
]

/**
 * Builds a plausible, human-looking past: momentum matters (a done day
 * makes tomorrow likelier), Sundays soften, and today is left blank so
 * there is always something to stamp.
 */
export function seedState(): TwState {
  const today = todayIso()
  const first = addDays(today, -WINDOW_DAYS)
  const habits: Habit[] = SEEDS.map((s, idx) => {
    const id = `seed-${idx}`
    const log: Record<string, true> = {}
    let prev = false
    for (let back = WINDOW_DAYS; back >= 1; back--) {
      const iso = addDays(today, -back)
      let p: number = prev ? Math.min(0.97, s.consistency + 0.16) : s.consistency * 0.8
      if (weekdayOf(iso) === 0) p -= s.sundayDip
      prev = hash01(`${id}:${iso}`) < p
      if (prev) log[iso] = true
    }
    return {
      id,
      name: s.name,
      cue: s.cue,
      icon: s.icon,
      target: s.target,
      created: first,
      archived: false,
      log,
    }
  })
  return { habits }
}

// ------------------------------------------------------------------ storage

const KEY = 'trailswell-habit-tracker:v1'

function validHabit(h: unknown): h is Habit {
  if (!h || typeof h !== 'object') return false
  const r = h as Record<string, unknown>
  return (
    typeof r.id === 'string' &&
    typeof r.name === 'string' &&
    typeof r.log === 'object' &&
    r.log !== null
  )
}

export function loadState(): TwState {
  if (typeof window === 'undefined') return seedState()
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return seedState()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return seedState()
    const habits = (parsed as TwState).habits
    if (!Array.isArray(habits)) return seedState()
    const clean = habits.filter(validHabit).map((h) => ({
      ...h,
      cue: typeof h.cue === 'string' ? h.cue : '',
      target: typeof h.target === 'number' ? Math.min(7, Math.max(3, h.target)) : 5,
      archived: h.archived === true,
      log: Object.fromEntries(
        Object.entries(h.log).filter(([k, v]) => /^\d{4}-\d{2}-\d{2}$/.test(k) && v === true),
      ) as Record<string, true>,
    }))
    return { habits: clean }
  } catch {
    return seedState()
  }
}

export function saveState(state: TwState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* private mode or quota — the tracker still works for the session */
  }
}

export function exportJson(state: TwState): string {
  return JSON.stringify(
    {
      app: 'Trailswell habit tracker (fictional demo)',
      exported: new Date().toISOString(),
      habits: state.habits,
    },
    null,
    2,
  )
}

// ------------------------------------------------------------------ stats

/** Days a habit counts toward on a given date (exists, not counting future). */
export function habitActiveOn(h: Habit, iso: string): boolean {
  return h.created <= iso
}

/** A habit is part of today's trail if it isn't shelved and existed that day. */
export function activeHabitsFor(state: TwState, iso: string): Habit[] {
  return state.habits.filter((h) => !h.archived && habitActiveOn(h, iso))
}

export function doneCountOn(state: TwState, iso: string): number {
  return activeHabitsFor(state, iso).filter((h) => h.log[iso] === true).length
}

/** Consecutive done days ending today; if today is undone, count back from yesterday. */
export function currentStreak(h: Habit, today: string): number {
  let cursor = h.log[today] ? today : addDays(today, -1)
  let n = 0
  while (h.log[cursor] && cursor >= h.created) {
    n++
    cursor = addDays(cursor, -1)
  }
  return n
}

export function bestStreak(h: Habit, today: string): number {
  let best = 0
  let run = 0
  for (let back = WINDOW_DAYS; back >= 0; back--) {
    const iso = addDays(today, -back)
    if (iso < h.created) continue
    if (h.log[iso]) {
      run++
      if (run > best) best = run
    } else {
      run = 0
    }
  }
  return best
}

export function weekCount(h: Habit, weekStart: string): number {
  return weekDays(weekStart).filter((d) => h.log[d]).length
}

// ------------------------------------------------------------------ review

export interface HabitWeekRow {
  habit: Habit
  done: number
  target: number
  met: boolean
}

export interface WeekReview {
  rows: HabitWeekRow[]
  heldAnchors: number
  totalAnchors: number
  daysWalked: number
  daysSoFar: number
  weakest: HabitWeekRow | null
  /** anchors held last week, for the honest comparison line */
  lastWeekHeld: number
  lastWeekTotal: number
}

function rowsFor(habits: Habit[], weekStart: string, uptoIso: string): HabitWeekRow[] {
  return habits
    .filter((h) => !h.archived)
    .map((h) => {
      const done = weekDays(weekStart).filter((d) => d <= uptoIso && d >= h.created && h.log[d]).length
      return { habit: h, done, target: h.target, met: done >= h.target }
    })
}

export function reviewWeek(state: TwState, today: string): WeekReview {
  const weekStart = weekStartOf(today)
  const rows = rowsFor(state.habits, weekStart, today)
  const days = weekDays(weekStart).filter((d) => d <= today)
  const daysWalked = days.filter((d) => doneCountOn(state, d) > 0).length
  const lastStart = addDays(weekStart, -7)
  const lastRows = rowsFor(state.habits, lastStart, addDays(lastStart, 6))

  let weakest: HabitWeekRow | null = null
  for (const r of rows) {
    if (r.met) continue
    const ratio = r.target === 0 ? 1 : r.done / r.target
    if (!weakest || ratio < weakest.done / weakest.target) weakest = r
  }

  return {
    rows,
    heldAnchors: rows.filter((r) => r.met).length,
    totalAnchors: rows.length,
    daysWalked,
    daysSoFar: days.length,
    weakest,
    lastWeekHeld: lastRows.filter((r) => r.met).length,
    lastWeekTotal: lastRows.length,
  }
}

// ------------------------------------------------------------------ heatmap

export interface HeatCell {
  iso: string
  future: boolean
  done: number
  active: number
  /** 0..4 intensity */
  level: number
}

export type HeatGrid = HeatCell[][] // 13 columns (weeks) × 7 rows (Mon..Sun)

export function heatGrid(state: TwState, today: string): HeatGrid {
  const thisWeekStart = weekStartOf(today)
  const firstCol = addDays(thisWeekStart, -12 * 7)
  const grid: HeatGrid = []
  for (let col = 0; col < 13; col++) {
    const week: HeatCell[] = []
    for (let row = 0; row < 7; row++) {
      const iso = addDays(firstCol, col * 7 + row)
      const future = iso > today
      const active = activeHabitsFor(state, iso).length
      const done = activeHabitsFor(state, iso).filter((h) => h.log[iso]).length
      const frac = active === 0 ? 0 : done / active
      const level = active === 0 || frac === 0 ? 0 : frac <= 0.34 ? 1 : frac <= 0.67 ? 2 : frac < 1 ? 3 : 4
      week.push({ iso, future, done, active, level })
    }
    grid.push(week)
  }
  return grid
}

// ------------------------------------------------------------------ ids

export function uid(): string {
  return `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export const ICON_CHOICES: Array<{ key: IconKey; label: string }> = [
  { key: 'sun', label: 'Sunrise' },
  { key: 'boot', label: 'Boot' },
  { key: 'mug', label: 'Mug' },
  { key: 'moon', label: 'Moon' },
  { key: 'book', label: 'Book' },
  { key: 'leaf', label: 'Leaf' },
  { key: 'drop', label: 'Drop' },
  { key: 'bell', label: 'Bell' },
]
