/**
 * Meridian Climate — LGA emissions scrollytelling explorer.
 * Art direction: deep-ink editorial with a teal→amber heat ramp,
 * serif headlines, mono exhibit labels. Deliberately unlike Brassfern.
 *
 * A scroll-driven story (pinned chart morphs bars → map → trends) on top
 * of a free-form explorer: tile-grid choropleth, sortable council table,
 * per-council detail. IntersectionObserver drives the narrative; with
 * prefers-reduced-motion every chapter renders its chart inline instead.
 * All data fictional, seeded, internally consistent.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import './demo.css'
import {
  changePct,
  GRID_ROWS,
  LAST,
  LGAS,
  nationalPerCapita,
  nationalTotal,
  perCapita,
  round1,
  sectorYear,
  totalKt,
  YEARS,
  type Cohort,
  type LGA,
} from './data'
import {
  CohortTrend,
  fmtChange,
  fmtKt,
  fmtMetric,
  fmtPc,
  HighlightTrend,
  METRIC_LABEL,
  metricValue,
  SectorBars,
  Sparkline,
  StackedSectors,
  TileGridMap,
  type MapMetric,
} from './charts'

// ------------------------------------------------------------ view model

type View =
  | { kind: 'bars'; baseline?: number }
  | { kind: 'map'; metric: MapMetric }
  | { kind: 'trend'; mode: 'cohorts' | 'highlight' }
  | { kind: 'summary' }

interface Chapter {
  kicker: string
  title: string
  body: string[]
  takeaway: string
  view: View
}

// stats computed against the (fictional) dataset, so copy and charts agree
const energyDelta = sectorYear('energy', LAST) / sectorYear('energy', 0) - 1
const transportDelta = sectorYear('transport', LAST) / sectorYear('transport', 0) - 1
const totalDelta = nationalTotal(LAST) / nationalTotal(0) - 1
const improvers = LGAS.filter((l) => changePct(l) < -0.005).length
const risers = LGAS.filter((l) => changePct(l) > 0.005).length
const faller = LGAS.reduce((a, b) => (changePct(a) < changePct(b) ? a : b))
const mangrove = LGAS.find((l) => l.id === 'mangrove-bay')!
const ironwood = LGAS.find((l) => l.id === 'ironwood')!

const CHAPTERS: Chapter[] = [
  {
    kicker: 'The mix',
    title: 'Four in ten tonnes come from keeping the lights on.',
    body: [
      `Across Meridian's fourteen-council deep sample, stationary energy is the single biggest source — ${Math.round((sectorYear('energy', LAST) / nationalTotal(LAST)) * 100)}% of everything counted in ${YEARS[LAST]}. Transport is second, and it isn't close to third.`,
      'This is the shape of the problem before you touch a map: two sectors doing most of the talking, three more waiting for a plan.',
    ],
    takeaway: 'Shares change slowly. Geography changes everything — keep scrolling.',
    view: { kind: 'bars' },
  },
  {
    kicker: 'The decade',
    title: `Energy fell ${Math.round(Math.abs(energyDelta) * 100)}%. Transport barely flinched.`,
    body: [
      `Eleven years of telemetry, one awkward truth: the sample cut energy emissions ${fmtChange(energyDelta)} while transport finished the decade ${fmtChange(transportDelta)} — the grid got cleaner faster than the roads did.`,
      'Watch the transport bar wobble in 2020. The sample’s only involuntary experiment, and the fastest drawdown transport ever managed. It did not last.',
    ],
    takeaway: 'Efficiency without electrification is a treadmill.',
    view: { kind: 'bars', baseline: 0 },
  },
  {
    kicker: 'The map, per person',
    title: 'Per resident, the map inverts the headline.',
    body: [
      `Absolute tonnes pick winners by size: metro councils always look worst because more people live there. Divide by residents and the picture flips — rural shires like ${LGAS.find((l) => l.id === 'koorinya')!.name} run two to three times the metro figure per person.`,
      'Hover or tab across the tiles. Every council, same question, same scale.',
    ],
    takeaway: 'Per capita first; absolutes second; both on the label.',
    view: { kind: 'map', metric: 'pc' },
  },
  {
    kicker: 'Direction over size',
    title: 'Ask about direction, and the map rearranges itself.',
    body: [
      'Same councils, different question: what changed since 2014? Cooler tiles are falling, warmer tiles are rising.',
      `${faller.name} leads the falls at ${fmtChange(changePct(faller))} — though, as we’ll see, the reason matters as much as the number.`,
    ],
    takeaway: 'A league table of levels punishes geography. A league table of direction punishes luck. Neither is the story.',
    view: { kind: 'map', metric: 'change' },
  },
  {
    kicker: 'Peers, not league tables',
    title: 'A rural shire should never be graded against a metro.',
    body: [
      'Meridian’s rule: every council is benchmarked against a peer cohort matched on density and economic base — never against the nation as a whole.',
      `Rural councils carry agriculture their metro cousins outsourced decades ago; coastal shires carry tourist traffic they don't get to tax. The cohort lines make that structural gap visible instead of pretending it's a performance gap.`,
    ],
    takeaway: 'Comparison is a design decision. Meridian publishes its methodology next to every chart.',
    view: { kind: 'trend', mode: 'cohorts' },
  },
  {
    kicker: 'Two ways down',
    title: `${mangrove.name} bent its curve. ${ironwood.name} lost its mill.`,
    body: [
      `${mangrove.name} cut per-capita emissions ${fmtChange(changePct(mangrove))} with a community solar farm and a hard line on new gas connections — a fall you can repeat. ${ironwood.name} fell ${fmtChange(changePct(ironwood))} because the smelter closed in 2019 and nine hundred jobs went with it.`,
      'Both lines plunge. One is a template; the other is a wound. Emissions accounting that can’t tell the difference will eventually tell the wrong story — so the explorer carries both numbers and notes.',
    ],
    takeaway: 'Quantity in colour. Judgement in words.',
    view: { kind: 'trend', mode: 'highlight' },
  },
  {
    kicker: 'The wall',
    title: 'What fourteen councils taught one platform.',
    body: [
      `${improvers} of ${LGAS.length} councils finished ${YEARS[LAST]} below where they started in 2014; ${risers} rose, mostly on transport and herd recovery.`,
      'Below the story sits the instrument itself: the whole sample, scrubbed by year, sortable by any column, every council one click deep. That’s the demo.',
    ],
    takeaway: 'The story ends. The data doesn’t.',
    view: { kind: 'summary' },
  },
]

const viewKey = (v: View) =>
  v.kind === 'bars' ? `bars-${v.baseline ?? 'none'}` : v.kind === 'map' ? `map-${v.metric}` : v.kind === 'trend' ? `trend-${v.mode}` : 'summary'

// ------------------------------------------------------------ stage views

function StageView({ view, onSelect, onFocus }: { view: View; onSelect: (id: string) => void; onFocus: (lga: LGA | null) => void }) {
  if (view.kind === 'bars') return <SectorBars yi={LAST} baseline={view.baseline} />
  if (view.kind === 'map') return <TileGridMap metric={view.metric} yi={LAST} selectedId={null} onSelect={onSelect} onFocusChange={onFocus} />
  if (view.kind === 'trend')
    return view.mode === 'cohorts' ? (
      <CohortTrend />
    ) : (
      <HighlightTrend
        highlightIds={['mangrove-bay', 'ironwood']}
        labels={{ 'mangrove-bay': mangrove.name, ironwood: ironwood.name }}
      />
    )
  return (
    <div className="mce-summary" role="group" aria-label="Story summary statistics">
      <div className="mce-summary__stat">
        <b>{improvers} / {LGAS.length}</b>
        <span>councils below their 2014 level in {YEARS[LAST]}</span>
      </div>
      <div className="mce-summary__stat">
        <b>{fmtChange(energyDelta)}</b>
        <span>stationary energy, sample-wide, 2014 → {YEARS[LAST]}</span>
      </div>
      <div className="mce-summary__stat">
        <b>{fmtChange(totalDelta)}</b>
        <span>all sources, {fmtKt(nationalTotal(0))} → {fmtKt(nationalTotal(LAST))} CO₂-e</span>
      </div>
      <div className="mce-summary__stat">
        <b>0</b>
        <span>league tables published, by design</span>
      </div>
    </div>
  )
}

// ------------------------------------------------------------ the demo

export default function MeridianClimateExplorer() {
  const [reduced, setReduced] = useState(false)
  const [step, setStep] = useState(0)
  const stepRefs = useRef<(HTMLElement | null)[]>([])

  // explorer state
  const [metric, setMetric] = useState<MapMetric>('pc')
  const [year, setYear] = useState(LAST)
  const [selectedId, setSelectedId] = useState('mangrove-bay')
  const [focusLga, setFocusLga] = useState<LGA | null>(null)
  const [cohortFilter, setCohortFilter] = useState<Cohort | 'All'>('All')
  const [sortKey, setSortKey] = useState<'name' | 'cohort' | 'pc' | 'change' | 'total'>('pc')
  const [sortDir, setSortDir] = useState<1 | -1>(-1)

  const selected = LGAS.find((l) => l.id === selectedId) ?? LGAS[0]
  const readout = focusLga ?? selected

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // scroll-spy on chapters
  useEffect(() => {
    if (reduced) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.step ?? 0))
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    )
    stepRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [reduced])

  const gotoStep = (i: number) => {
    const el = stepRefs.current[i]
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const rows = useMemo(() => {
    const filtered = LGAS.filter((l) => cohortFilter === 'All' || l.cohort === cohortFilter)
    const val = (l: LGA): number | string => {
      switch (sortKey) {
        case 'name': return l.name
        case 'cohort': return l.cohort
        case 'pc': return perCapita(l, year)
        case 'total': return totalKt(l, year)
        default: return changePct(l)
      }
    }
    return [...filtered].sort((a, b) => {
      const va = val(a)
      const vb = val(b)
      const c = typeof va === 'string' ? va.localeCompare(String(vb)) : va - (vb as number)
      return c * sortDir
    })
  }, [cohortFilter, sortKey, sortDir, year])

  const toggleSort = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1))
    else {
      setSortKey(key)
      setSortDir(key === 'name' || key === 'cohort' ? 1 : -1)
    }
  }

  const chapter = CHAPTERS[step]
  const cohorts: (Cohort | 'All')[] = ['All', 'Metro', 'Regional city', 'Coastal shire', 'Rural']

  return (
    <div className="mce" data-reduced={reduced || undefined}>
      {/* ------------------------------------------------ hero */}
      <header className="mce-hero">
        <div className="mce-hero__bar">
          <span className="mce-mark" aria-hidden>
            <i />
            Meridian Climate
          </span>
          <span className="mce-hero__meta">Emissions explorer · sample of {LGAS.length} councils · 2014–{YEARS[LAST]}</span>
        </div>
        <h1 className="mce-hero__title">
          Where the tonnes <em>live.</em>
        </h1>
        <p className="mce-hero__lede">
          A scrollytelling explorer for council emissions data — the kind of spreadsheet nobody reads, rebuilt
          as seven chapters and one instrument. Per person first, peers before league tables, and quantity in
          colour while judgement stays in words.
        </p>
        <div className="mce-hero__stats" role="list">
          <span role="listitem"><b>{fmtKt(nationalTotal(LAST))}</b> counted in {YEARS[LAST]}</span>
          <span role="listitem"><b>{fmtPc(round1(nationalPerCapita(LAST)))}</b> sample average</span>
          <span role="listitem"><b>{fmtChange(totalDelta)}</b> since 2014</span>
        </div>
        <div className="mce-hero__actions">
          <a className="mce-btn mce-btn--solid" href="#mce-story">
            Read the story
          </a>
          <a className="mce-btn" href="#mce-explorer">
            Skip to the explorer ↓
          </a>
        </div>
      </header>

      {/* ------------------------------------------------ scrolly story */}
      <div className="mce-story" id="mce-story">
        {!reduced && (
          <div className="mce-stage">
            <div className="mce-stage__bar">
              <span className="mce-stage__crumb" aria-live="polite">
                Chapter {step + 1} / {CHAPTERS.length} — {chapter.kicker}
              </span>
              <span className="mce-stage__nav">
                <button type="button" onClick={() => gotoStep(step - 1)} disabled={step === 0} aria-label="Previous chapter">
                  ←
                </button>
                <button type="button" onClick={() => gotoStep(step + 1)} disabled={step === CHAPTERS.length - 1} aria-label="Next chapter">
                  →
                </button>
              </span>
            </div>
            <div className="mce-view" key={viewKey(chapter.view)}>
              <StageView view={chapter.view} onSelect={setSelectedId} onFocus={setFocusLga} />
            </div>
            <div className="mce-readout" aria-live="polite">
              {focusLga ? (
                <>
                  <b>{focusLga.name}</b>
                  <span>{focusLga.state} · {focusLga.cohort} · {focusLga.pop}k residents</span>
                  <span>
                    {chapter.view.kind === 'map'
                      ? fmtMetric(metricValue(focusLga, chapter.view.metric, LAST), chapter.view.metric)
                      : `${fmtPc(round1(perCapita(focusLga, LAST)))} · ${fmtChange(changePct(focusLga))} since 2014`}
                  </span>
                </>
              ) : (
                <span className="mce-readout__hint">Hover or tab a tile to inspect a council</span>
              )}
            </div>
          </div>
        )}

        <div className="mce-steps">
          {CHAPTERS.map((c, i) => (
            <section
              key={c.kicker}
              id={`mce-step-${i}`}
              data-step={i}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className={`mce-step${i === step && !reduced ? ' is-active' : ''}`}
              aria-label={`Chapter ${i + 1}: ${c.kicker}`}
            >
              <div className="mce-step__card">
                <p className="mce-step__kicker">
                  <span>0{i + 1}</span> {c.kicker}
                </p>
                <h2 className="mce-step__title">{c.title}</h2>
                {c.body.map((p, j) => (
                  <p className="mce-step__body" key={j}>
                    {p}
                  </p>
                ))}
                <p className="mce-step__take">
                  <span aria-hidden>▸ </span>
                  {c.takeaway}
                </p>
                {reduced && (
                  <div className="mce-step__chart">
                    <StageView view={c.view} onSelect={setSelectedId} onFocus={() => undefined} />
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ explorer */}
      <section className="mce-explorer" id="mce-explorer" aria-labelledby="mce-explorer-h">
        <div className="mce-explorer__head">
          <p className="mce-overline">The instrument</p>
          <h2 id="mce-explorer-h">Explore the whole sample</h2>
          <p>
            Fourteen councils, five sectors, eleven years. Scrub the year, switch the metric, sort the table —
            selection drives the detail panel. Nothing here is a league table; the peers column is the context.
          </p>
        </div>

        <div className="mce-controls">
          <fieldset className="mce-controls__group">
            <legend>Map metric</legend>
            {(Object.keys(METRIC_LABEL) as MapMetric[]).map((m) => (
              <button
                key={m}
                type="button"
                className={`mce-chip${metric === m ? ' is-on' : ''}`}
                aria-pressed={metric === m}
                onClick={() => setMetric(m)}
              >
                {METRIC_LABEL[m]}
              </button>
            ))}
          </fieldset>
          <div className="mce-controls__group mce-controls__year">
            <label htmlFor="mce-year">
              Year · <b>{YEARS[year]}</b>
            </label>
            <input
              id="mce-year"
              type="range"
              min={0}
              max={LAST}
              step={1}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              aria-valuetext={String(YEARS[year])}
            />
            <div className="mce-controls__ticks" aria-hidden>
              <span>2014</span>
              <span>{YEARS[LAST]}</span>
            </div>
          </div>
          <fieldset className="mce-controls__group">
            <legend>Cohort</legend>
            {cohorts.map((c) => (
              <button
                key={c}
                type="button"
                className={`mce-chip${cohortFilter === c ? ' is-on' : ''}`}
                aria-pressed={cohortFilter === c}
                onClick={() => setCohortFilter(c)}
              >
                {c}
              </button>
            ))}
          </fieldset>
        </div>

        <div className="mce-explorer__grid">
          <div className="mce-explorer__map">
            <TileGridMap metric={metric} yi={year} selectedId={selectedId} onSelect={setSelectedId} onFocusChange={setFocusLga} />
            <div className="mce-readout" aria-live="polite">
              <b>{readout.name}</b>
              <span>{readout.state} · {readout.cohort} · {readout.pop}k residents</span>
              <span>{fmtMetric(metricValue(readout, metric, year), metric)} · {fmtChange(changePct(readout))} since 2014</span>
            </div>
          </div>

          <aside className="mce-detail" aria-label={`Detail for ${selected.name}`}>
            <div className="mce-detail__head">
              <div>
                <h3>{selected.name}</h3>
                <p className="mce-detail__sub">
                  {selected.state} · {selected.cohort}
                </p>
              </div>
              <span className={`mce-badge ${changePct(selected) <= 0 ? 'is-down' : 'is-up'}`}>
                {fmtChange(changePct(selected))} <small>vs 2014</small>
              </span>
            </div>
            <dl className="mce-detail__stats">
              <div>
                <dt>Per resident ({YEARS[year]})</dt>
                <dd>{fmtPc(round1(perCapita(selected, year)))}</dd>
              </div>
              <div>
                <dt>Total ({YEARS[year]})</dt>
                <dd>{fmtKt(totalKt(selected, year))}</dd>
              </div>
            </dl>
            <p className="mce-detail__trendlabel">
              Per-resident trend vs {selected.cohort} cohort average
            </p>
            <Sparkline values={YEARS.map((_, yi) => perCapita(selected, yi))} colour="#4db39b" width={240} height={52} />
            <StackedSectors lga={selected} yi={year} />
            {selected.note && <p className="mce-detail__note">{selected.note}</p>}
          </aside>
        </div>

        <div className="mce-tablewrap">
          <table className="mce-table">
            <caption>
              All {cohortFilter === 'All' ? LGAS.length : rows.length} councils{cohortFilter !== 'All' ? ` in “${cohortFilter}”` : ''}, year {YEARS[year]}. Select a column to sort.
            </caption>
            <thead>
              <tr>
                {(
                  [
                    ['name', 'Council'],
                    ['cohort', 'Cohort'],
                    ['pc', `t/person`],
                    ['total', 'Total'],
                    ['change', 'Δ since 2014'],
                  ] as const
                ).map(([key, label]) => (
                  <th key={key} aria-sort={sortKey === key ? (sortDir === 1 ? 'ascending' : 'descending') : undefined}>
                    <button type="button" onClick={() => toggleSort(key)}>
                      {label}
                      <span aria-hidden className="mce-table__arrow">
                        {sortKey === key ? (sortDir === 1 ? '▲' : '▼') : '↕'}
                      </span>
                    </button>
                  </th>
                ))}
                <th>11-year shape</th>
                <th className="mce-table__sr">Open</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className={l.id === selectedId ? 'is-selected' : undefined}>
                  <td>
                    <button type="button" className="mce-table__name" onClick={() => setSelectedId(l.id)}>
                      {l.name}
                      <small>{l.state}</small>
                    </button>
                  </td>
                  <td className="mce-table__muted">{l.cohort}</td>
                  <td className="mce-table__num">{round1(perCapita(l, year))}</td>
                  <td className="mce-table__num mce-table__muted">{fmtKt(totalKt(l, year))}</td>
                  <td className={`mce-table__num ${changePct(l) <= 0 ? 'is-down' : 'is-up'}`}>{fmtChange(changePct(l))}</td>
                  <td>
                    <Sparkline values={YEARS.map((_, yi) => perCapita(l, yi))} colour={changePct(l) <= 0 ? '#4db39b' : '#e0a552'} />
                  </td>
                  <td>
                    <button type="button" className="mce-table__open" onClick={() => setSelectedId(l.id)} aria-label={`Show ${l.name} in the detail panel`}>
                      →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ------------------------------------------------ method footer */}
      <footer className="mce-foot">
        <div className="mce-foot__col">
          <h2>How this platform shows data</h2>
          <ul>
            <li>Per-capita figures are primary; absolutes are second; both are always on the label.</li>
            <li>Councils are compared with a peer cohort matched on density and economic base — never the nation as a whole.</li>
            <li>Colour encodes quantity, never judgement. There is no red, and there are no league tables.</li>
            <li>Reductions caused by closures are annotated, not celebrated.</li>
          </ul>
        </div>
        <div className="mce-foot__col mce-foot__colophon">
          <p>
            <b>Meridian Climate</b> is a fictional non-profit; every council, figure and trend in this demo is
            generated and illustrative. The craft — the interaction model, the ethics, the chart grammar — is real.
          </p>
          <p className="mce-foot__fine">A Brassfern Lab demo · tile grid rows ≈ {GRID_ROWS} · single static page, zero network calls</p>
        </div>
      </footer>
    </div>
  )
}
