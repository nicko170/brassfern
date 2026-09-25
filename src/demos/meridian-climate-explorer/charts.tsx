/**
 * Meridian Climate explorer — hand-rolled SVG/CSS charts.
 * Bar chart, tile-grid choropleth, multi-line trends, sparkline,
 * stacked sector composition. No chart library; the dataset is small
 * and the art direction is specific.
 */
import {
  changePct,
  COHORT_COLOURS,
  cohortLine,
  GRID_COLS,
  GRID_ROWS,
  heat,
  LAST,
  LGAS,
  nationalTotal,
  perCapita,
  RAMP_CSS,
  round1,
  SECTORS,
  sectorYear,
  totalKt,
  YEARS,
  type Cohort,
  type LGA,
  type SectorId,
} from './data'

// ------------------------------------------------------------- formatting

export const fmtKt = (kt: number) => (kt >= 1000 ? `${(kt / 1000).toFixed(2)} Mt` : `${Math.round(kt)} kt`)
export const fmtPc = (t: number) => `${round1(t)} t/person`
export const fmtChange = (p: number) => `${p > 0 ? '+' : '−'}${Math.round(Math.abs(p * 100))}%`

export type MapMetric = 'pc' | 'total' | 'change'

export function metricValue(lga: LGA, metric: MapMetric, yi: number): number {
  if (metric === 'pc') return perCapita(lga, yi)
  if (metric === 'total') return totalKt(lga, yi)
  return changePct(lga)
}

export function metricDomain(metric: MapMetric, yi: number): [number, number] {
  const vals = LGAS.map((l) => metricValue(l, metric, yi))
  let min = Math.min(...vals)
  let max = Math.max(...vals)
  if (metric === 'change') {
    const m = Math.max(Math.abs(min), Math.abs(max))
    min = -m
    max = m
  }
  return [min, max]
}

export function fmtMetric(v: number, metric: MapMetric): string {
  if (metric === 'pc') return fmtPc(v)
  if (metric === 'total') return fmtKt(v)
  return fmtChange(v)
}

export const METRIC_LABEL: Record<MapMetric, string> = {
  pc: 'Per person',
  total: 'Total',
  change: 'Change since 2014',
}

// ------------------------------------------------------------- TileGridMap

interface MapProps {
  metric: MapMetric
  yi: number
  selectedId: string | null
  onSelect?: (id: string) => void
  onFocusChange?: (lga: LGA | null) => void
  compact?: boolean
}

export function TileGridMap({ metric, yi, selectedId, onSelect, onFocusChange, compact }: MapProps) {
  const [min, max] = metricDomain(metric, yi)
  return (
    <div className="mce-mapwrap">
      <div
        className={`mce-map${compact ? ' mce-map--compact' : ''}`}
        role="group"
        aria-label={`Tile grid map of fourteen councils, coloured by ${METRIC_LABEL[metric].toLowerCase()}`}
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}
      >
        {LGAS.map((lga) => {
          const v = metricValue(lga, metric, yi)
          const t = max === min ? 0.5 : (v - min) / (max - min)
          const selected = lga.id === selectedId
          return (
            <button
              key={lga.id}
              type="button"
              className={`mce-tile${selected ? ' is-selected' : ''}`}
              style={{ gridColumn: lga.col + 1, gridRow: lga.row + 1, background: heat(t) }}
              aria-pressed={selected}
              aria-label={`${lga.name}, ${lga.state}: ${fmtMetric(v, metric)}`}
              onMouseEnter={() => onFocusChange?.(lga)}
              onMouseLeave={() => onFocusChange?.(null)}
              onFocus={() => onFocusChange?.(lga)}
              onBlur={() => onFocusChange?.(null)}
              onClick={() => onSelect?.(lga.id)}
            >
              <span aria-hidden>{lga.abbr}</span>
            </button>
          )
        })}
      </div>
      <div className="mce-ramp" aria-hidden>
        <span>{fmtMetric(min, metric)}</span>
        <i style={{ background: RAMP_CSS }} />
        <span>{fmtMetric(max, metric)}</span>
      </div>
    </div>
  )
}

// ------------------------------------------------------------- SectorBars

interface BarsProps {
  yi: number
  /** ghost baseline year index (e.g. 0 for 2014) */
  baseline?: number
}

export function SectorBars({ yi, baseline }: BarsProps) {
  const max = Math.max(...SECTORS.map((s) => Math.max(sectorYear(s.id, yi), baseline != null ? sectorYear(s.id, baseline) : 0)))
  const total = nationalTotal(yi)
  return (
    <div className="mce-bars" role="img" aria-label={`Sector totals for ${YEARS[yi]}: ${SECTORS.map((s) => `${s.label} ${fmtKt(sectorYear(s.id, yi))}`).join(', ')}`}>
      {SECTORS.map((s) => {
        const now = sectorYear(s.id, yi)
        const base = baseline != null ? sectorYear(s.id, baseline) : null
        const delta = base != null ? now / base - 1 : null
        return (
          <div className="mce-bar" key={s.id}>
            <div className="mce-bar__head">
              <span className="mce-bar__label">
                <i style={{ background: s.colour }} />
                {s.label}
              </span>
              <span className="mce-bar__value">
                {fmtKt(now)}
                {delta != null && (
                  <em className={delta <= 0 ? 'is-down' : 'is-up'}>{fmtChange(delta)}</em>
                )}
              </span>
            </div>
            <div className="mce-bar__track">
              {base != null && <i className="mce-bar__ghost" style={{ width: `${(base / max) * 100}%` }} aria-hidden />}
              <i className="mce-bar__fill" style={{ width: `${(now / max) * 100}%`, background: s.colour }} aria-hidden />
            </div>
          </div>
        )
      })}
      <p className="mce-bars__total">
        Deep-sample total, {YEARS[yi]}: <strong>{fmtKt(total)}</strong> CO₂-e
        {baseline != null && ` (was ${fmtKt(nationalTotal(baseline))} in ${YEARS[baseline]})`}
      </p>
    </div>
  )
}

// ------------------------------------------------------------- TrendChart

interface TrendSeries {
  id: string
  label: string
  colour: string
  values: number[]
  dash?: string
  dim?: boolean
  width?: number
}

interface TrendProps {
  series: TrendSeries[]
  caption: string
}

export function TrendChart({ series, caption }: TrendProps) {
  const W = 640
  const H = 340
  const pad = { l: 46, r: 104, t: 18, b: 30 }
  const all = series.flatMap((s) => s.values)
  const maxV = Math.max(...all) * 1.06
  const minV = Math.min(0, Math.min(...all))
  const x = (i: number) => pad.l + (i / (YEARS.length - 1)) * (W - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - (v - minV) / (maxV - minV)) * (H - pad.t - pad.b)
  const ticks = [0, Math.round(maxV / 2), Math.round(maxV)]
  return (
    <figure className="mce-trend">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={caption}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="mce-trend__grid" />
            <text x={pad.l - 8} y={y(t) + 4} className="mce-trend__tick" textAnchor="end">
              {t}
            </text>
          </g>
        ))}
        {[0, 5, 10].map((yi) => (
          <text key={yi} x={x(yi)} y={H - 8} className="mce-trend__tick" textAnchor="middle">
            {YEARS[yi]}
          </text>
        ))}
        {series.map((s) => {
          const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
          return (
            <g key={s.id} className={s.dim ? 'is-dim' : undefined}>
              <path d={d} fill="none" stroke={s.colour} strokeWidth={s.width ?? 2.4} strokeDasharray={s.dash} strokeLinecap="round" strokeLinejoin="round" />
              {!s.dim && (
                <>
                  <circle cx={x(YEARS.length - 1)} cy={y(s.values[s.values.length - 1])} r={3.5} fill={s.colour} />
                  <text x={x(YEARS.length - 1) + 9} y={y(s.values[s.values.length - 1]) + 4} className="mce-trend__end" fill={s.colour}>
                    {s.label}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>
      <figcaption className="mce-trend__cap">{caption}</figcaption>
    </figure>
  )
}

/** four cohort average per-capita lines */
export function CohortTrend({ highlightCohort }: { highlightCohort?: Cohort }) {
  const cohorts = Object.keys(COHORT_COLOURS) as Cohort[]
  const short: Record<Cohort, string> = { Metro: 'Metro', 'Regional city': 'Regional', 'Coastal shire': 'Coastal', Rural: 'Rural' }
  const series: TrendSeries[] = cohorts.map((c) => ({
    id: c,
    label: short[c],
    colour: COHORT_COLOURS[c],
    values: cohortLine(c),
    dim: highlightCohort != null && c !== highlightCohort,
  }))
  return (
    <TrendChart
      series={series}
      caption="Average emissions per resident by council cohort, tonnes CO₂-e. Councils are compared with peers, not the nation."
    />
  )
}

/** all 14 LGAs dimmed with named highlights in front */
export function HighlightTrend({ highlightIds, labels }: { highlightIds: string[]; labels: Record<string, string> }) {
  const series: TrendSeries[] = [
    ...LGAS.filter((l) => !highlightIds.includes(l.id)).map((l) => ({
      id: l.id,
      label: l.name,
      colour: 'rgba(233,231,218,.14)',
      values: YEARS.map((_, yi) => perCapita(l, yi)),
      dim: true,
      width: 1.4,
    })),
    ...highlightIds.map((id, k) => {
      const l = LGAS.find((x) => x.id === id)!
      return {
        id,
        label: labels[id] ?? l.name,
        colour: k === 0 ? '#4db39b' : '#e0a552',
        values: YEARS.map((_, yi) => perCapita(l, yi)),
        width: 3,
      }
    }),
  ]
  return (
    <TrendChart
      series={series}
      caption={`Emissions per resident for all fourteen sample councils, with ${highlightIds.map((id) => labels[id] ?? id).join(' and ')} highlighted.`}
    />
  )
}

// ------------------------------------------------------------- Sparkline

export function Sparkline({ values, colour, width = 92, height = 28 }: { values: number[]; colour: string; width?: number; height?: number }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * (width - 4) + 2).toFixed(1)},${(height - 3 - ((v - min) / span) * (height - 6)).toFixed(1)}`)
  return (
    <svg className="mce-spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline points={pts.join(' ')} fill="none" stroke={colour} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r={2.4} fill={colour} />
    </svg>
  )
}

// ------------------------------------------------------------- StackedSectors

export function StackedSectors({ lga, yi }: { lga: LGA; yi: number }) {
  const total = totalKt(lga, yi)
  return (
    <div className="mce-stack">
      <div className="mce-stack__bar" role="img" aria-label={`${lga.name} sector mix in ${YEARS[yi]}: ${SECTORS.map((s) => `${s.label} ${Math.round((lga.series[yi][s.id] / total) * 100)} percent`).join(', ')}`}>
        {SECTORS.map((s) => (
          <i key={s.id} style={{ width: `${(lga.series[yi][s.id] / total) * 100}%`, background: s.colour }} />
        ))}
      </div>
      <ul className="mce-stack__legend">
        {SECTORS.map((s) => (
          <li key={s.id}>
            <i style={{ background: s.colour }} />
            <span>{s.label}</span>
            <b>{Math.round((lga.series[yi][s.id] / total) * 100)}%</b>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function sectorChangeNote(lga: LGA, sector: SectorId): string {
  const a = lga.series[0][sector]
  const b = lga.series[LAST][sector]
  return fmtChange(b / a - 1)
}
