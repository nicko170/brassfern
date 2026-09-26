/**
 * Ledgerline — pricing calculator.
 * Pure data + quote maths. Ledgerline is a fictional expense-management SaaS;
 * every price, discount code and plan limit below is mocked but internally
 * consistent, so the calculator always adds up.
 */

export type PlanId = 'tally' | 'ledger' | 'balance' | 'volume'
export type Cycle = 'monthly' | 'annual'

export interface Plan {
  id: PlanId
  name: string
  tagline: string
  /** base monthly price, includes `includedSeats` seats */
  base: number
  includedSeats: number
  /** per additional seat, per month */
  perSeat: number
  /** expense reports included per month */
  includedReports: number
  /** overage per report beyond the allowance */
  overage: number
  /** hard ceiling on seats; null = unlimited */
  maxSeats: number | null
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'tally',
    name: 'Tally',
    tagline: 'For the spreadsheet escapees.',
    base: 49,
    includedSeats: 3,
    perSeat: 8,
    includedReports: 150,
    overage: 0.15,
    maxSeats: 12,
    features: ['Receipt capture + OCR', 'One approval chain', 'CSV export', 'Email support'],
  },
  {
    id: 'ledger',
    name: 'Ledger',
    tagline: 'The plan most teams land on.',
    base: 129,
    includedSeats: 10,
    perSeat: 7,
    includedReports: 1000,
    overage: 0.09,
    maxSeats: 80,
    features: [
      'Everything in Tally',
      'Multi-step approvals',
      'Accounting sync (Xero, MYOB)',
      'Policy rules + flags',
      'Priority support',
    ],
  },
  {
    id: 'balance',
    name: 'Balance',
    tagline: 'For finance teams with opinions.',
    base: 349,
    includedSeats: 25,
    perSeat: 6,
    includedReports: 5000,
    overage: 0.06,
    maxSeats: 300,
    features: [
      'Everything in Ledger',
      'Multi-entity + budgets',
      'Custom GL mapping',
      'SSO (SAML)',
      'Dedicated success manager',
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    tagline: 'Whole-company rollouts.',
    base: 899,
    includedSeats: 60,
    perSeat: 5,
    includedReports: 20000,
    overage: 0.04,
    maxSeats: null,
    features: [
      'Everything in Balance',
      'Unlimited entities',
      'API + webhooks',
      'Audit log retention (7y)',
      '99.9% uptime SLA',
    ],
  },
]

export interface DiscountCode {
  code: string
  pct: number
  /** months the discount covers */
  months: number
  note: string
  expired?: boolean
}

export const CODES: DiscountCode[] = [
  { code: 'LEDGER10', pct: 10, months: 12, note: '10% off for your first 12 months' },
  { code: 'MIGRATE20', pct: 20, months: 6, note: '20% off for 6 months — the leaving-spreadsheets offer' },
  { code: 'EOFY24', pct: 15, months: 3, note: 'ended 30 June 2024', expired: true },
]

export function findCode(raw: string): { status: 'ok' | 'expired' | 'unknown'; deal: DiscountCode | null } {
  const code = raw.trim().toUpperCase()
  if (!code) return { status: 'unknown', deal: null }
  const deal = CODES.find((c) => c.code === code) ?? null
  if (!deal) return { status: 'unknown', deal: null }
  if (deal.expired) return { status: 'expired', deal }
  return { status: 'ok', deal }
}

// ------------------------------------------------------------ state

export interface CalcState {
  seats: number
  /** expense reports per month */
  reports: number
  cycle: Cycle
  /** 'auto' follows our recommendation */
  plan: PlanId | 'auto'
  /** an applied, verified discount code ('' = none) */
  code: string
  /** blended hourly rate of the people who touch expenses */
  rate: number
  /** minutes to assemble one report today */
  minsPerReport: number
  /** minutes spent chasing each approval today */
  chaseMins: number
  /** % of that time Ledgerline removes */
  cutPct: number
}

export const DEFAULTS: CalcState = {
  seats: 14,
  reports: 650,
  cycle: 'annual',
  plan: 'auto',
  code: '',
  rate: 95,
  minsPerReport: 22,
  chaseMins: 35,
  cutPct: 68,
}

export const LIMITS = {
  seats: { min: 1, max: 400 },
  reports: { min: 50, max: 20000 },
  rate: { min: 40, max: 200 },
  minsPerReport: { min: 5, max: 60 },
  chaseMins: { min: 0, max: 90 },
  cutPct: { min: 30, max: 90 },
} as const

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Stepped snapping: fine control at small numbers, coarse at large ones. */
export const snapSeats = (v: number) => {
  const n = clamp(v, LIMITS.seats.min, LIMITS.seats.max)
  if (n <= 50) return Math.round(n)
  if (n <= 200) return Math.round(n / 5) * 5
  return Math.round(n / 25) * 25
}

export const snapReports = (v: number) => {
  const n = clamp(v, LIMITS.reports.min, LIMITS.reports.max)
  if (n <= 1000) return Math.round(n / 25) * 25
  if (n <= 5000) return Math.round(n / 50) * 50
  return Math.round(n / 500) * 500
}

// ------------------------------------------------------------ pricing

export interface PlanPrice {
  plan: Plan
  available: boolean
  extraSeats: number
  seatCost: number
  overReports: number
  usageCost: number
  /** total, monthly billing */
  monthly: number
  /** effective monthly cost when billed annually (pay 10, get 12) */
  annualPerMonth: number
  annualUpfront: number
  perSeat: number
}

export function pricePlan(plan: Plan, seats: number, reports: number): PlanPrice {
  const available = plan.maxSeats === null || seats <= plan.maxSeats
  const extraSeats = Math.max(0, seats - plan.includedSeats)
  const seatCost = Math.round(extraSeats * plan.perSeat * 100) / 100
  const overReports = Math.max(0, reports - plan.includedReports)
  const usageCost = Math.round(overReports * plan.overage * 100) / 100
  const monthly = plan.base + seatCost + usageCost
  return {
    plan,
    available,
    extraSeats,
    seatCost,
    overReports,
    usageCost,
    monthly,
    annualPerMonth: (monthly * 10) / 12,
    annualUpfront: monthly * 10,
    perSeat: monthly / seats,
  }
}

export interface Roi {
  beforeMins: number
  afterMins: number
  hoursSaved: number
  valueMonthly: number
  /** value ÷ plan cost, ∞ reported as 99 */
  multiple: number
  paybackDays: number
}

export interface Quote {
  prices: PlanPrice[]
  recommended: PlanPrice
  active: PlanPrice
  pinned: boolean
  cycle: Cycle
  /** billed amount per cycle, before discount */
  cycleAmount: number
  /** effective per-month figure for the active cycle */
  effectiveMonthly: number
  /** what annual billing saves vs 12 × monthly */
  annualSaving: number
  deal: DiscountCode | null
  /** $ saved by the discount code across its covered months */
  discountValue: number
  /** first-12-months total, including cycle + discount */
  yearOneTotal: number
  ref: string
  roi: Roi
}

export function compute(state: CalcState): Quote {
  // clamp only — snapping is a UI concern handled on commit
  const seats = Math.round(clamp(state.seats, LIMITS.seats.min, LIMITS.seats.max))
  const reports = clamp(state.reports, LIMITS.reports.min, LIMITS.reports.max)
  const prices = PLANS.map((p) => pricePlan(p, seats, reports))
  const recommended = prices
    .filter((p) => p.available)
    .reduce((best, p) => (p.monthly < best.monthly ? p : best))
  const pinned = state.plan !== 'auto'
  const chosen = pinned ? prices.find((p) => p.plan.id === state.plan) ?? null : null
  const active = chosen && chosen.available ? chosen : recommended

  const annualSaving = Math.round((active.monthly * 12 - active.annualUpfront) * 100) / 100
  const cycleAmount = state.cycle === 'annual' ? active.annualUpfront : active.monthly
  const effectiveMonthly = state.cycle === 'annual' ? active.annualPerMonth : active.monthly

  const deal = state.code ? findCode(state.code).deal : null
  const validDeal = deal && !deal.expired ? deal : null
  // covered months ÷ cycle: discount applies to the first `months` months of billing
  const coveredCycles =
    state.cycle === 'annual'
      ? Math.min(1, validDeal ? validDeal.months / 12 : 0)
      : validDeal
        ? Math.min(validDeal.months, 12)
        : 0
  const discountValue = validDeal
    ? Math.round(cycleAmount * coveredCycles * (validDeal.pct / 100) * 100) / 100
    : 0

  const yearOneGross = state.cycle === 'annual' ? active.annualUpfront : active.monthly * 12
  const yearOneTotal = Math.round((yearOneGross - discountValue) * 100) / 100

  const beforeMins = state.minsPerReport + state.chaseMins
  const afterMins = Math.round(beforeMins * (1 - state.cutPct / 100) * 10) / 10
  const hoursSaved = Math.round(((reports * (beforeMins - afterMins)) / 60) * 10) / 10
  const valueMonthly = Math.round(hoursSaved * state.rate)
  const multiple = effectiveMonthly > 0 ? Math.min(99, valueMonthly / effectiveMonthly) : 0
  const paybackDays = multiple > 1 ? Math.ceil(30 / multiple) : 0

  return {
    prices,
    recommended,
    active,
    pinned: pinned && chosen !== null && chosen.available,
    cycle: state.cycle,
    cycleAmount,
    effectiveMonthly,
    annualSaving,
    deal: validDeal,
    discountValue,
    yearOneTotal,
    ref: quoteRef(state),
    roi: { beforeMins, afterMins, hoursSaved, valueMonthly, multiple, paybackDays },
  }
}

// ------------------------------------------------------------ URL state

const PLAN_IDS: PlanId[] = PLANS.map((p) => p.id)

export function stateFromSearch(search: string): CalcState {
  if (typeof window === 'undefined') return DEFAULTS
  const p = new URLSearchParams(search)
  const num = (key: string, min: number, max: number, fb: number) => {
    const raw = Number(p.get(key))
    return Number.isFinite(raw) ? clamp(raw, min, max) : fb
  }
  const cycle = p.get('cycle') === 'monthly' ? 'monthly' : p.get('cycle') === 'annual' ? 'annual' : DEFAULTS.cycle
  const planRaw = p.get('plan') ?? ''
  const plan = PLAN_IDS.includes(planRaw as PlanId) ? (planRaw as PlanId) : 'auto'
  const codeRaw = (p.get('code') ?? '').trim().toUpperCase()
  const code = findCode(codeRaw).status === 'ok' ? codeRaw : ''
  return {
    seats: snapSeats(num('seats', LIMITS.seats.min, LIMITS.seats.max, DEFAULTS.seats)),
    reports: snapReports(num('reports', LIMITS.reports.min, LIMITS.reports.max, DEFAULTS.reports)),
    cycle,
    plan,
    code,
    rate: num('rate', LIMITS.rate.min, LIMITS.rate.max, DEFAULTS.rate),
    minsPerReport: num('mins', LIMITS.minsPerReport.min, LIMITS.minsPerReport.max, DEFAULTS.minsPerReport),
    chaseMins: num('chase', LIMITS.chaseMins.min, LIMITS.chaseMins.max, DEFAULTS.chaseMins),
    cutPct: num('cut', LIMITS.cutPct.min, LIMITS.cutPct.max, DEFAULTS.cutPct),
  }
}

export function searchFromState(s: CalcState): string {
  const p = new URLSearchParams()
  p.set('seats', String(s.seats))
  p.set('reports', String(s.reports))
  p.set('cycle', s.cycle)
  if (s.plan !== 'auto') p.set('plan', s.plan)
  if (s.code) p.set('code', s.code)
  p.set('rate', String(s.rate))
  p.set('mins', String(s.minsPerReport))
  p.set('chase', String(s.chaseMins))
  p.set('cut', String(s.cutPct))
  return p.toString()
}

/** Deterministic quote reference derived from the configuration. */
export function quoteRef(s: CalcState): string {
  const str = searchFromState({ ...s, plan: typeof s.plan === 'string' ? s.plan : 'auto' })
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0
  return `LL-${(h % 46655).toString(36).toUpperCase().padStart(3, '0')}`
}

// ------------------------------------------------------------ formatting

const aud0 = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })
const aud2 = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const num0 = new Intl.NumberFormat('en-AU', { maximumFractionDigits: 0 })

export const fmt0 = (n: number) => aud0.format(n)
export const fmt2 = (n: number) => aud2.format(n)
export const fmtInt = (n: number) => num0.format(n)
