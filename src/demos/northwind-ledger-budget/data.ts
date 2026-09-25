/**
 * Northwind Ledger — demo data.
 * Six months (Apr–Sep 2026) of deterministic fake books for a sample small
 * business, "Fieldstone Ceramics Pty Ltd". Every vendor, person and figure
 * on this page is fictional.
 */

export type TxnKind = 'in' | 'out'

export interface Txn {
  id: string
  /** month key, e.g. '2026-04' */
  month: string
  /** human date, e.g. '04 Apr' */
  date: string
  day: number
  vendor: string
  /** out-category id, or income id */
  category: string
  amount: number
  kind: TxnKind
}

export interface Category {
  id: string
  label: string
  color: string
  /** monthly budget, A$ */
  budget: number
}

export interface MonthInfo {
  key: string
  short: string
  label: string
  days: number
}

export interface MonthPoint {
  key: string
  short: string
  income: number
  spend: number
  budget: number
  net: number
}

export const OUT_CATEGORIES: Category[] = [
  { id: 'payroll', label: 'Payroll', color: '#5eead4', budget: 42000 },
  { id: 'rent', label: 'Rent & studio', color: '#6cb8f4', budget: 6800 },
  { id: 'contractors', label: 'Contractors', color: '#b79df7', budget: 9000 },
  { id: 'software', label: 'Software', color: '#f6a5c8', budget: 2400 },
  { id: 'marketing', label: 'Marketing', color: '#f6c177', budget: 5500 },
  { id: 'travel', label: 'Travel', color: '#8fd18f', budget: 1800 },
  { id: 'utilities', label: 'Utilities', color: '#94a9c9', budget: 950 },
  { id: 'tax', label: 'Tax & fees', color: '#fb8f8f', budget: 9800 },
]

export const INCOME_LABELS: Record<string, string> = {
  retainer: 'Retainer',
  invoice: 'Invoice payment',
  product: 'Product sales',
}

export const MONTHS: MonthInfo[] = [
  { key: '2026-04', short: 'Apr', label: 'April 2026', days: 30 },
  { key: '2026-05', short: 'May', label: 'May 2026', days: 31 },
  { key: '2026-06', short: 'Jun', label: 'June 2026', days: 30 },
  { key: '2026-07', short: 'Jul', label: 'July 2026', days: 31 },
  { key: '2026-08', short: 'Aug', label: 'August 2026', days: 31 },
  { key: '2026-09', short: 'Sep', label: 'September 2026', days: 30 },
]

/** The current demo "today": 26 Sep 2026 — used for pacing. */
export const TODAY = { label: 'Friday, 26 September 2026', dayOfMonth: 26, daysInMonth: 30, pace: 26 / 30 }

export const OPENING_CASH = 312000

export const MONTHLY_BUDGET = OUT_CATEGORIES.reduce((s, c) => s + c.budget, 0)

export interface Receivable {
  client: string
  invoice: string
  amount: number
  due: string
  overdue: boolean
}

export const RECEIVABLES: Receivable[] = [
  { client: 'Hollis Marine', invoice: 'INV-1042', amount: 8400, due: '18 Sep 2026', overdue: true },
  { client: 'Petal & Post', invoice: 'INV-1044', amount: 3150, due: '22 Sep 2026', overdue: true },
  { client: 'Bellweather Toys', invoice: 'INV-1048', amount: 6900, due: '02 Oct 2026', overdue: false },
  { client: 'Carmichael Roasters', invoice: 'INV-1049', amount: 2150, due: '05 Oct 2026', overdue: false },
]

export const GOAL = {
  name: 'Runway buffer',
  target: 48000,
  start: 24000,
  monthly: 3800,
  transfers: 6,
  eta: '31 October 2026',
  note: 'Auto-transfer A$3,800 on the last Friday of every month.',
}

// --- deterministic generation -------------------------------------------------

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const RETAINER_CLIENTS = ['Brightline Goods', 'Sorrel & Found', 'Paperharbour', 'Kindred Supply']

const INVOICE_PAYERS = [
  'Asterwell',
  'Littlefield & Co',
  'Moss & Timber',
  'Quarry St Bakery',
  'Hollis Marine',
  'Petal & Post',
  'Carmichael Roasters',
  'Bellweather Toys',
  'Nordhaus Gallery',
  'Tin Kettle Co',
]

const PRODUCT_SOURCES = ['Fieldstone web store', 'Market stall — Carriageworks', 'Wholesale — Petal & Post']

const CONTRACTORS = [
  'J. Okafor — product design',
  'R. Lindqvist — engineering',
  'Studio Palmer — interiors',
  'T. Nguyen — motion',
]

const MARKETING_VENDORS = ['Northshore Print', 'Castmail — lifecycle', 'Fernway Media — ads', 'Ledger & Letter — copy']

const SOFTWARE_FIXED: [string, number][] = [
  ['Ledgerflow Suite', 320],
  ['Vexsy Analytics', 145],
  ['Parcelwork CI', 210],
  ['Halcyon Design', 260],
  ['Archie Vault', 88],
]

const SOFTWARE_EXTRAS = ['Pixelbench', 'Draftline', 'Oatmail', 'Canopy Meet', 'Fig & Ferret QA']

const TRAVEL_VENDORS = ['SydeRail', 'Mooring Hotel — Fitzroy', 'Airlane — return MEL', 'Cabs & tolls']

const round = (n: number, step: number) => Math.round(n / step) * step

export function buildTransactions(): Txn[] {
  const txns: Txn[] = []
  let n = 0
  const push = (
    month: MonthInfo,
    day: number,
    vendor: string,
    category: string,
    amount: number,
    kind: TxnKind,
  ) => {
    n += 1
    txns.push({
      id: `${month.key}-${n}`,
      month: month.key,
      date: `${String(day).padStart(2, '0')} ${month.short}`,
      day,
      vendor,
      category,
      amount,
      kind,
    })
  }

  MONTHS.forEach((month, m) => {
    const rand = rng(20260401 + m * 977)
    const day = () => 1 + Math.floor(rand() * month.days)

    // Income
    RETAINER_CLIENTS.forEach((c, i) => push(month, 1 + i, c, 'retainer', 6800, 'in'))
    // August is quiet — clients on holiday
    const invoiceCount = m === 4 ? 5 + Math.floor(rand() * 2) : 7 + Math.floor(rand() * 5)
    let incomeSum = 27200
    for (let i = 0; i < invoiceCount; i++) {
      const amount = round(2400 + rand() * 6200, 50)
      incomeSum += amount
      push(month, day(), INVOICE_PAYERS[Math.floor(rand() * INVOICE_PAYERS.length)], 'invoice', amount, 'in')
    }
    const productCount = 6 + Math.floor(rand() * 3)
    for (let i = 0; i < productCount; i++) {
      const amount = round(320 + rand() * 1900, 10)
      incomeSum += amount
      push(month, day(), PRODUCT_SOURCES[i % PRODUCT_SOURCES.length], 'product', amount, 'in')
    }

    // Payroll — three runs
    ;[7, 14, 28].forEach((d, i) =>
      push(month, d, 'Payroll — 9 staff', 'payroll', 13700 + m * 130 + round(rand() * 120, 10) + i * 3, 'out'),
    )

    push(month, 3, 'Fitzroy Works — studio lease', 'rent', 6800, 'out')

    const contractorCount = 2 + Math.floor(rand() * 3)
    for (let i = 0; i < contractorCount; i++) {
      push(month, day(), CONTRACTORS[Math.floor(rand() * CONTRACTORS.length)], 'contractors', round(1800 + rand() * 2400, 50), 'out')
    }

    SOFTWARE_FIXED.forEach(([v, amt], i) => push(month, 5 + i, v, 'software', amt, 'out'))
    const extraTools = Math.floor(rand() * 3)
    for (let i = 0; i < extraTools; i++) {
      push(month, day(), SOFTWARE_EXTRAS[Math.floor(rand() * SOFTWARE_EXTRAS.length)], 'software', round(45 + rand() * 300, 5), 'out')
    }

    const marketingCount = 3 + Math.floor(rand() * 3)
    for (let i = 0; i < marketingCount; i++) {
      push(month, day(), MARKETING_VENDORS[Math.floor(rand() * MARKETING_VENDORS.length)], 'marketing', round(600 + rand() * 1300, 50), 'out')
    }
    // May: trade fair + conference push
    if (m === 1) {
      push(month, 14, 'Trade-fair stand — Finders Keepers', 'marketing', 4800, 'out')
      push(month, 12, 'Airlane — team ×3', 'travel', 1140, 'out')
      push(month, 13, 'Mooring Hotel — 3 rooms', 'travel', 620, 'out')
    } else {
      const trips = Math.floor(rand() * 2.2)
      for (let i = 0; i < trips; i++) {
        push(month, day(), TRAVEL_VENDORS[Math.floor(rand() * TRAVEL_VENDORS.length)], 'travel', round(180 + rand() * 700, 10), 'out')
      }
    }

    push(month, 15, 'PowerDock Energy', 'utilities', round(290 + rand() * 120, 1), 'out')
    push(month, 11, 'Bluequay Fibre', 'utilities', 129, 'out')

    // GST set-aside ≈ 9% of the month's income
    push(month, Math.min(28, month.days), 'ATO — GST set-aside', 'tax', round(incomeSum * 0.09, 10), 'out')
  })

  return txns
}

// --- formatting ----------------------------------------------------------------

export const fmt = (n: number, digits = 0) =>
  'A$' + Math.abs(n).toLocaleString('en-AU', { minimumFractionDigits: digits, maximumFractionDigits: digits })

export const fmtSigned = (n: number) => (n < 0 ? '−' + fmt(-n) : '+' + fmt(n))

export const fmtK = (n: number) => {
  const abs = Math.abs(n)
  if (abs >= 1000) return 'A$' + (abs / 1000).toFixed(abs >= 10000 ? 0 : 1) + 'k'
  return 'A$' + Math.round(abs)
}
