/* Copperline Mutual — fixtures.
   All data fictional. The member is Ada Lim, a primary-school teacher in
   Castlemaine who banks with the nice mutual. Today is 26 September 2026. */

export interface Account {
  id: string
  name: string
  bsb: string
  number: string
  balance: number
}

export interface Pot {
  id: string
  name: string
  goal: number
  saved: number
  tint: 'mint' | 'brass' | 'sage' | 'rose'
  note: string
}

export type CategoryId =
  | 'groceries'
  | 'eating'
  | 'transport'
  | 'home'
  | 'health'
  | 'shopping'
  | 'income'
  | 'giving'
  | 'transfer'

export interface Txn {
  id: string
  merchant: string
  note?: string
  category: CategoryId
  dir: 'in' | 'out'
  amount: number
  date: string // ISO
  pending?: boolean
}

export interface Contact {
  id: string
  name: string
  initials: string
  tint: 'mint' | 'brass' | 'sage' | 'rose'
  handle: string
  lastPaid?: number
}

export const TODAY = '2026-09-26'

export const MEMBER = { first: 'Ada', name: 'Ada Lim', initials: 'AL', since: 2016 }

export const ACCOUNTS: Account[] = [
  { id: 'everyday', name: 'Everyday', bsb: '633-108', number: '…4821', balance: 2316.44 },
  { id: 'savings', name: 'Bonus Saver', bsb: '633-108', number: '…9107', balance: 14286.2 },
]

export const INITIAL_POTS: Pot[] = [
  {
    id: 'nz',
    name: "New Zealand '27",
    goal: 4200,
    saved: 1835,
    tint: 'mint',
    note: 'Two weeks, one campervan, zero regrets.',
  },
  {
    id: 'rainy',
    name: 'Rainy day',
    goal: 8000,
    saved: 5470,
    tint: 'sage',
    note: 'Three months of calm, one invoice at a time.',
  },
  {
    id: 'vespa',
    name: 'Vespa fund',
    goal: 2200,
    saved: 940,
    tint: 'rose',
    note: 'Helmet first. Style always.',
  },
]

export const CATEGORIES: { id: CategoryId; label: string; glyph: string }[] = [
  { id: 'groceries', label: 'Groceries', glyph: 'basket' },
  { id: 'eating', label: 'Eating out', glyph: 'cup' },
  { id: 'transport', label: 'Transport', glyph: 'tram' },
  { id: 'home', label: 'Home & bills', glyph: 'house' },
  { id: 'health', label: 'Health', glyph: 'heart' },
  { id: 'shopping', label: 'Shopping', glyph: 'bag' },
  { id: 'income', label: 'Income', glyph: 'down' },
  { id: 'giving', label: 'Giving', glyph: 'leaf' },
  { id: 'transfer', label: 'Transfers', glyph: 'swap' },
]

export const catOf = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!

export const INITIAL_TXNS: Txn[] = [
  { id: 't01', merchant: 'Fernway Grocer', category: 'groceries', dir: 'out', amount: 84.2, date: '2026-09-26' },
  { id: 't02', merchant: 'Copper Kettle Café', note: 'Flat white + toastie', category: 'eating', dir: 'out', amount: 16.5, date: '2026-09-26' },
  { id: 't03', merchant: 'Salary — Holloway Records', note: 'Fortnightly pay', category: 'income', dir: 'in', amount: 2840.0, date: '2026-09-25' },
  { id: 't04', merchant: 'Slow Lane Bakery', category: 'eating', dir: 'out', amount: 12.8, date: '2026-09-25' },
  { id: 't05', merchant: 'Arch Doyle', note: 'Dinner split', category: 'transfer', dir: 'out', amount: 42.0, date: '2026-09-24' },
  { id: 't06', merchant: 'VLine · Castlemaine', note: 'Weekly fare cap', category: 'transport', dir: 'out', amount: 36.4, date: '2026-09-23' },
  { id: 't07', merchant: 'Tindall St Chemist', category: 'health', dir: 'out', amount: 27.9, date: '2026-09-22' },
  { id: 't08', merchant: 'Fernway Grocer', category: 'groceries', dir: 'out', amount: 112.6, date: '2026-09-21' },
  { id: 't09', merchant: 'Tenterfield Power Co.', note: 'Electricity · quarterly', category: 'home', dir: 'out', amount: 298.44, date: '2026-09-20' },
  { id: 't10', merchant: 'Riverbend Cellars', note: 'Shiraz for dinner club', category: 'eating', dir: 'out', amount: 58.0, date: '2026-09-19' },
  { id: 't11', merchant: 'Gumleaf Yoga', note: '10-class pass', category: 'health', dir: 'out', amount: 180.0, date: '2026-09-18' },
  { id: 't12', merchant: 'Merri Cricket Club', note: 'Season dues', category: 'giving', dir: 'out', amount: 95.0, date: '2026-09-17' },
  { id: 't13', merchant: 'Pigment & Paper', category: 'shopping', dir: 'out', amount: 43.25, date: '2026-09-16' },
  { id: 't14', merchant: "Sal's Garage", note: 'Rego + pink slip', category: 'transport', dir: 'out', amount: 689.0, date: '2026-09-15' },
  { id: 't15', merchant: 'Copper Kettle Café', category: 'eating', dir: 'out', amount: 9.4, date: '2026-09-14' },
  { id: 't16', merchant: 'Fernway Grocer', category: 'groceries', dir: 'out', amount: 96.15, date: '2026-09-13' },
  { id: 't17', merchant: 'The Drapery', note: 'Linen shirt', category: 'shopping', dir: 'out', amount: 129.0, date: '2026-09-12' },
  { id: 't18', merchant: 'Salary — Holloway Records', note: 'Fortnightly pay', category: 'income', dir: 'in', amount: 2840.0, date: '2026-09-11' },
  { id: 't19', merchant: 'Motion Picture House', note: 'Two tickets, balcony', category: 'shopping', dir: 'out', amount: 38.0, date: '2026-09-10' },
  { id: 't20', merchant: 'Petals & Stem', category: 'giving', dir: 'out', amount: 65.0, date: '2026-09-09' },
  { id: 't21', merchant: 'Interest — Bonus Saver', note: 'September credit', category: 'income', dir: 'in', amount: 41.27, date: '2026-09-08' },
  { id: 't22', merchant: 'Common Ground Co-op', category: 'groceries', dir: 'out', amount: 52.7, date: '2026-09-07' },
  { id: 't23', merchant: 'Acacia Hair', note: 'Cut and colour', category: 'health', dir: 'out', amount: 145.0, date: '2026-09-05' },
  { id: 't24', merchant: 'Wildmidford Meats', category: 'groceries', dir: 'out', amount: 61.3, date: '2026-09-04' },
  { id: 't25', merchant: 'Winnie Lau', note: 'Farmers market stall', category: 'transfer', dir: 'in', amount: 210.0, date: '2026-09-03' },
  { id: 't26', merchant: 'Fernway Grocer', category: 'groceries', dir: 'out', amount: 71.85, date: '2026-09-02' },
]

export const CONTACTS: Contact[] = [
  { id: 'sal', name: 'Sal Moretti', initials: 'SM', tint: 'brass', handle: '@salplumbs', lastPaid: 180 },
  { id: 'winnie', name: 'Winnie Lau', initials: 'WL', tint: 'mint', handle: '@winnie-grows', lastPaid: 210 },
  { id: 'arch', name: 'Arch Doyle', initials: 'AD', tint: 'sage', handle: '@archdoyle', lastPaid: 42 },
  { id: 'bea', name: 'Bea Frankel', initials: 'BF', tint: 'rose', handle: '@beafrankel' },
  { id: 'nina', name: 'Nina Osei', initials: 'NO', tint: 'mint', handle: '@ninaosei' },
  { id: 'eunice', name: 'Mrs E. Kowalski', initials: 'EK', tint: 'brass', handle: '@eunicek', lastPaid: 35 },
  { id: 'merri', name: 'Merri Cricket Club', initials: 'MC', tint: 'sage', handle: '@merricc', lastPaid: 95 },
  { id: 'tom', name: 'Tom Grady', initials: 'TG', tint: 'rose', handle: '@tomgrady' },
]

export const COIN_VALUES = [20, 50, 100]

// ---------------------------------------------------------------- helpers

export const fmt = (n: number, opts?: { sign?: boolean }) =>
  `${opts?.sign ? (n < 0 ? '−' : '+') : ''}$${Math.abs(n).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const fmtWhole = (n: number) => `$${Math.round(n).toLocaleString('en-AU')}`

const DAY = 86_400_000

export function dayLabel(iso: string): string {
  const today = new Date(TODAY + 'T12:00:00')
  const d = new Date(iso + 'T12:00:00')
  const diff = Math.round((today.getTime() - d.getTime()) / DAY)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Weekly spend (out only) for the trailing four ISO weeks ending TODAY. */
export function weeklySpend(txns: Txn[]): { label: string; total: number }[] {
  const today = new Date(TODAY + 'T12:00:00')
  const weeks = [3, 2, 1, 0].map((back) => {
    const end = new Date(today.getTime() - back * 7 * DAY)
    const start = new Date(end.getTime() - 6 * DAY)
    const total = txns
      .filter((t) => {
        const d = new Date(t.date + 'T12:00:00')
        return t.dir === 'out' && d >= start && d <= end
      })
      .reduce((s, t) => s + t.amount, 0)
    const label = back === 0 ? 'This week' : `${back}w ago`
    return { label, total }
  })
  return weeks
}
