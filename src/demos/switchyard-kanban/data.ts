/**
 * Switchyard kanban — data, seed board, persistence.
 * All people and work items are fictional. The board persists to
 * localStorage after the first paint; seed data is deterministic.
 */

export type Priority = 'express' | 'local' | 'freight'

export interface Person {
  id: string
  name: string
  role: string
  /** Determines which geometric motif the avatar stamp uses (0–5). */
  motif: number
}

export interface CheckItem {
  id: string
  text: string
  done: boolean
}

export interface Activity {
  id: string
  at: string // ISO
  text: string
}

export interface Card {
  id: string // SW-1042
  title: string
  desc: string
  columnId: string
  order: number
  assignee: string | null
  labels: string[]
  priority: Priority
  checklist: CheckItem[]
  activity: Activity[]
  due: string | null
}

export interface Column {
  id: string
  name: string
  /** Max cards before the safety-orange breach warning. null = unlimited. */
  limit: number | null
}

export interface BoardState {
  v: 1
  nextSeq: number
  lanes: boolean
  columns: Column[]
  cards: Card[]
}

// ---------------------------------------------------------------- vocabulary

export const PRIORITIES: Record<Priority, { name: string; code: string; rank: number; lane: string }> = {
  express: { name: 'Express', code: 'EXP', rank: 0, lane: 'Express line' },
  local: { name: 'Local', code: 'LOC', rank: 1, lane: 'Local stops' },
  freight: { name: 'Freight', code: 'FRT', rank: 2, lane: 'Freight' },
}

export const PRIORITY_ORDER: Priority[] = ['express', 'local', 'freight']

export const PEOPLE: Person[] = [
  { id: 'mok', name: 'Marnie Okafor', role: 'Product', motif: 0 },
  { id: 'dvp', name: 'Devraj Pillai', role: 'Engineering', motif: 1 },
  { id: 'itv', name: 'Ines Tavares', role: 'Design', motif: 2 },
  { id: 'yhm', name: 'Yuki Hamada', role: 'Engineering', motif: 3 },
  { id: 'rlg', name: 'Rosa Lindgren', role: 'Crew ops', motif: 4 },
  { id: 'twh', name: 'Theo Whitfield', role: 'Billing & data', motif: 5 },
]

export const personById = (id: string | null): Person | undefined =>
  PEOPLE.find((p) => p.id === id)

export const LABELS: { id: string; name: string }[] = [
  { id: 'rostering', name: 'Rostering' },
  { id: 'dispatch', name: 'Dispatch' },
  { id: 'crew-app', name: 'Crew app' },
  { id: 'billing', name: 'Billing' },
  { id: 'integrations', name: 'Integrations' },
  { id: 'research', name: 'Research' },
]

export const labelName = (id: string): string =>
  LABELS.find((l) => l.id === id)?.name ?? id

export const initials = (name: string): string =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

// ---------------------------------------------------------------- seed board

const c = (
  seq: number,
  columnId: string,
  order: number,
  title: string,
  desc: string,
  opts: Partial<Omit<Card, 'id' | 'title' | 'desc' | 'columnId' | 'order'>> = {},
): Card => ({
  id: `SW-${seq}`,
  title,
  desc,
  columnId,
  order,
  assignee: opts.assignee ?? null,
  labels: opts.labels ?? [],
  priority: opts.priority ?? 'local',
  checklist: opts.checklist ?? [],
  activity: opts.activity ?? [],
  due: opts.due ?? null,
})

const ci = (n: number, text: string, done = false): CheckItem => ({
  id: `k${n}`,
  text,
  done,
})

const act = (iso: string, text: string): Activity => ({
  id: `a-${iso}-${text.length}`,
  at: iso,
  text,
})

export function seedState(): BoardState {
  return {
    v: 1,
    nextSeq: 1050,
    lanes: false,
    columns: [
      { id: 'yard', name: 'The Yard', limit: 8 },
      { id: 'shunt', name: 'Shunting', limit: 3 },
      { id: 'signal', name: 'Signal check', limit: 2 },
      { id: 'arrived', name: 'Arrived', limit: null },
    ],
    cards: [
      // ——— The Yard: intake backlog ———
      c(1038, 'yard', 1, 'Multi-depot roster templates',
        'Depots keep rebuilding the same roster every quarter. Template library with depot-level overrides, versioned so a bad template can be rolled back without touching live rosters.',
        { assignee: 'mok', labels: ['rostering'], priority: 'freight', activity: [act('2026-09-14T09:12:00+10:00', 'Marnie raised this from the Mt Victoria depot visit notes.')] }),
      c(1041, 'yard', 2, 'Penalty-rate rules engine spike',
        'Two-day spike: can we express state award penalty rules as data, not code? Success looks like the WA weekend ruleset editable by ops without a deploy.',
        { assignee: 'dvp', labels: ['rostering', 'integrations'], priority: 'local', due: '2026-10-16' }),
      c(1043, 'yard', 3, 'Crew app: offline-first sync design',
        'Crews lose signal in cuttings constantly. Design how the app queues shift acknowledgements offline and reconciles conflicts when the tower re-appears.',
        { assignee: 'itv', labels: ['crew-app', 'research'], priority: 'express' }),
      c(1044, 'yard', 4, 'Billing: proration on plan changes',
        'Mid-cycle upgrades currently invoice a flat catch-up and support eats the confusion. Prorate to the day, show the maths on the invoice.',
        { assignee: 'twh', labels: ['billing'], priority: 'freight' }),
      c(1047, 'yard', 5, 'GTFS-rt ingest for live positions',
        'Pipe the public GTFS-realtime feed into the dispatch board so "where is the 17:42" stops being a radio call.',
        { assignee: 'yhm', labels: ['integrations'], priority: 'local', activity: [act('2026-09-21T15:40:00+10:00', 'Yuki confirmed the feed licence covers commercial reuse.')] }),

      // ——— Shunting: in progress, limit 3 ———————————————— (seeded one over)
      c(1039, 'shunt', 1, 'Conflict solver: roster overlap detection',
        'Flag double-booked crew, rest-rule breaches and qualification gaps at draft time, not when the roster is published. The solver suggests the cheapest fix first.',
        { assignee: 'dvp', labels: ['rostering'], priority: 'express', due: '2026-10-02',
          checklist: [ci(11, 'Model rest rules as constraints', true), ci(12, 'Overlap detection on draft save', true), ci(13, 'Rank suggested fixes by cost'), ci(14, 'Bench test against Goulburn roster (800 crew)')],
          activity: [act('2026-09-08T10:02:00+10:00', 'Devraj moved this to Shunting.'), act('2026-09-22T14:31:00+10:00', 'Overlap detection merged behind a flag.')] }),
      c(1040, 'shunt', 2, 'Dispatch board: drag affordances',
        'Dispatchers miss that rows are draggable. Persistent grip marks, a lift shadow on grab, and a proper keyboard shuttle so nobody is locked to a mouse.',
        { assignee: 'itv', labels: ['dispatch'], priority: 'express', due: '2026-09-25',
          checklist: [ci(21, 'Grip affordance at rest and hover', true), ci(22, 'Keyboard shuttle with announcements')],
          activity: [act('2026-09-11T11:20:00+10:00', 'Ines moved this to Shunting.'), act('2026-09-24T09:05:00+10:00', 'Due date passed — Ines is close behind on it, kept honest here.')] }),
      c(1045, 'shunt', 3, 'Shift-swap approvals flow',
        'Two-tap swap requests, push to the approver who is actually on duty, auto-expire after four hours with both parties told.',
        { assignee: 'yhm', labels: ['crew-app'], priority: 'local',
          checklist: [ci(31, 'Swap request payload', true), ci(32, 'On-duty approver routing'), ci(33, 'Expiry + notifications')],
          activity: [act('2026-09-17T13:48:00+10:00', 'Yuki moved this to Shunting.')] }),
      c(1046, 'shunt', 4, 'Alert copy pass: plain-English delays',
        '"Service alteration event" is not a sentence a human should read at 6am. Rewrite the 40 most-sent alert templates with ops.',
        { assignee: 'mok', labels: ['dispatch', 'research'], priority: 'local',
          activity: [act('2026-09-23T16:15:00+10:00', 'Marnie pulled this in over the WIP limit — marked as a breach until Signal check clears.')] }),

      // ——— Signal check: review, limit 2 ———
      c(1036, 'signal', 1, 'Leave requests v2',
        'Leave balance shown before the request is made, approval chain routed by depot, and a calendar clash warning for the approver.',
        { assignee: 'rlg', labels: ['crew-app'], priority: 'local', due: '2026-09-30',
          checklist: [ci(41, 'Balance-at-request', true), ci(42, 'Depot approval chains', true), ci(43, 'Clash warning', true)],
          activity: [act('2026-09-18T08:57:00+10:00', 'Rosa moved this to Signal check.')] }),
      c(1037, 'signal', 2, 'Roster PDF export',
        'The printout pinned to the depot wall still matters. A4, monochrome, legible at arm\u2019s length, with the QR link back to the live roster.',
        { assignee: 'dvp', labels: ['rostering'], priority: 'freight',
          activity: [act('2026-09-19T10:44:00+10:00', 'Devraj moved this to Signal check.')] }),

      // ——— Arrived: done ———
      c(1031, 'arrived', 1, 'Crew availability calendar',
        'Month view of availability per crew member, syncing leave and rest blocks from the roster automatically.',
        { assignee: 'itv', labels: ['crew-app'], priority: 'local',
          activity: [act('2026-09-02T12:00:00+10:00', 'Shipped in 2.14. Two support tickets in the first week, both cosmetic.')] }),
      c(1033, 'arrived', 2, 'Depot onboarding checklist',
        'New depots get a guided setup: crews imported, awards loaded, approval chains drawn — all before the first roster is drafted.',
        { assignee: 'rlg', labels: ['research'], priority: 'freight',
          activity: [act('2026-08-28T09:30:00+10:00', 'Shipped in 2.13. Gladstone depot onboarded in one afternoon.')] }),
      c(1034, 'arrived', 3, 'SSO via Okta',
        'Enterprise depots asked; enterprise depots received. SCIM provisioning is the follow-up.',
        { assignee: 'yhm', labels: ['integrations'], priority: 'express',
          activity: [act('2026-09-05T17:22:00+10:00', 'Shipped in 2.14. First enterprise tenant live on it.')] }),
    ],
  }
}

// ---------------------------------------------------------------- persistence

const KEY = 'switchyard-board-v1'

function isBoard(x: unknown): x is BoardState {
  if (!x || typeof x !== 'object') return false
  const b = x as BoardState
  return (
    b.v === 1 &&
    typeof b.nextSeq === 'number' &&
    typeof b.lanes === 'boolean' &&
    Array.isArray(b.columns) &&
    Array.isArray(b.cards) &&
    b.columns.every((col) => typeof col.id === 'string' && typeof col.name === 'string') &&
    b.cards.every((cd) => typeof cd.id === 'string' && typeof cd.columnId === 'string' && Array.isArray(cd.checklist))
  )
}

export function loadState(): BoardState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seedState()
    const parsed: unknown = JSON.parse(raw)
    if (!isBoard(parsed)) return seedState()
    return parsed
  } catch {
    return seedState()
  }
}

export function saveState(state: BoardState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* private mode etc. — the board still works, just without memory */
  }
}

// ---------------------------------------------------------------- labels & time

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "due Thu 2 Oct" / "overdue — was Fri 25 Sep" */
export function dueLabel(iso: string, now = new Date()): { text: string; overdue: boolean } {
  const d = new Date(iso + 'T12:00:00')
  const text = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const overdue = d.getTime() < today.getTime()
  return overdue ? { text: `overdue · was ${text}`, overdue: true } : { text: `due ${text}`, overdue: false }
}

export function timeAgo(iso: string, now = Date.now()): string {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return ''
  const s = Math.max(0, Math.floor((now - t) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return 'yesterday'
  if (d < 14) return `${d}d ago`
  const w = Math.floor(d / 7)
  if (w < 9) return `${w}w ago`
  const dt = new Date(t)
  return `${dt.getDate()} ${MONTHS[dt.getMonth()]}`
}

let uidCounter = 0
export const uid = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${(uidCounter++).toString(36)}`
