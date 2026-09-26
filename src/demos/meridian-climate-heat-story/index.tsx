/**
 * Meridian Climate — "2046: the heat map of one summer".
 * Art direction: newspaper at midnight. Deep charcoal rising to ash white
 * as the story cools; editorial serif; thermal-spectrum colour reserved
 * strictly for data. Scroll-driven chapters steer a sticky canvas heat
 * grid (IntersectionObserver + rAF); an SVG temperature ledger draws
 * itself on approach; a canopy before/after slider compares 1997 with
 * the 2046 Shade Budget. Under prefers-reduced-motion the story becomes
 * a static stepped article — every state still reachable, no animation.
 *
 * All data is hard-coded, fictional and flagged as illustrative.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './demo.css'
import HeatGrid from './HeatGrid'
import { CanopyCompare, TempChart } from './charts'
import {
  AVG_CANOPY_1997,
  AVG_CANOPY_2046,
  AVG_MAX_1997,
  AVG_MAX_2046,
  AVG_PLANNED,
  HOT_BLOCK,
  OVER40_1997,
  OVER40_2046,
  PARK_SET,
  PEAK,
  STUBBORN,
  WEST_SET,
  type Suburb,
} from './data'

interface Step {
  id: string
  folio: string
  title: string
  paras: string[]
  quote?: { text: string; by: string }
  amount: number
  emphasis: Suburb[] | null
  exhibit: 'grid' | 'chart' | 'canopy' | 'none'
}

const STEPS: Step[] = [
  {
    id: 'ch-01',
    folio: 'Chapter 01',
    title: 'The summer, as recorded',
    paras: [], // filled below — copy needs the computed figures
    amount: 1,
    emphasis: null,
    exhibit: 'grid',
  },
  {
    id: 'ch-02',
    folio: 'Chapter 02',
    title: 'The west runs hotter',
    paras: [],
    quote: {
      text: 'Heat is a zoning decision. It just sends the bill to the ambulance service.',
      by: 'The Shade Budget, preamble (fictional)',
    },
    amount: 1,
    emphasis: WEST_SET,
    exhibit: 'grid',
  },
  {
    id: 'ch-03',
    folio: 'Exhibit A · Chapter 03',
    title: `Days over forty: ${OVER40_2046}, and counting`,
    paras: [],
    amount: 1,
    emphasis: null,
    exhibit: 'chart',
  },
  {
    id: 'ch-04',
    folio: 'Exhibit B · Chapter 04',
    title: 'The canopy divide',
    paras: [],
    amount: 1,
    emphasis: null,
    exhibit: 'canopy',
  },
  {
    id: 'ch-05',
    folio: 'Chapter 05',
    title: 'Enter the Shade Budget',
    paras: [],
    amount: 0,
    emphasis: null,
    exhibit: 'grid',
  },
  {
    id: 'ch-06',
    folio: 'Chapter 06',
    title: 'What a degree buys',
    paras: [],
    amount: 0,
    emphasis: PARK_SET,
    exhibit: 'grid',
  },
]

// Copy, written late so the numbers come from the data, never from memory.
STEPS[0].paras = [
  `The grid on the left is a city that does not exist: Greater Meridian, 96 invented blocks between the harbour and the western flats. The summer it just lived through is invented too — 90 days of seeded, self-consistent numbers about a season that never happened. Treat every figure as illustrative, because it is. But the shape is honest, and the shape is this: the whole city ran hot, and some of it ran hotter.`,
  `${HOT_BLOCK.name}, out in the flats, spent the season at +${HOT_BLOCK.anomaly}°C against the twentieth-century average. On ${PEAK.label} the city peaked at ${PEAK.t2046}°C — the kind of afternoon that buckles tram tracks and empties parks. Even the harbour blocks, the ones with sea-breeze privilege, sat three degrees above their grandparents' normal.`,
]
STEPS[1].paras = [
  `Scroll, and the map dims everything except the western third. This is the part of the story the averages launder. Distance from the water, streets laid for cars not shade, roofs the colour of a barbecue plate — the west stacks the penalties one on another until the anomaly stops being weather and starts being design.`,
  `The city's average anomaly this summer was above four degrees. The western blocks you can see lit here ran closer to seven. Heat maps like this get called "data journalism"; residents further west tend to call it Tuesday.`,
]
STEPS[2].paras = [
  `Exhibit A is the daily ledger: every maximum from December to February, 2045–46 in ember, the same summer fifty years earlier in ash. The 1996–97 line looks quaint now — it climbed above forty ${OVER40_1997 === 0 ? 'not once' : `${OVER40_1997} time${OVER40_1997 === 1 ? '' : 's'}`}. The 2046 line did it ${OVER40_2046} times, in two long spells the papers named, as papers do: the Nine-Day Bake and the February Forgiveness.`,
  `The season's average maximum was ${AVG_MAX_2046}°C against ${AVG_MAX_1997}°C half a century before. The gap between those two lines is not a forecast. In this fiction it already happened — which is the point of the exercise.`,
]
STEPS[3].paras = [
  `Exhibit B is quieter but crueller. Shade was rationed unevenly by history: citywide canopy sat at ${AVG_CANOPY_1997}% in 1997, but it was planted where the money was. Drag the line — or pick a district — and watch the Shade Budget's 2046 target arrive: ${AVG_CANOPY_2046}% citywide, with the steepest increases written into the postcodes that needed them most.`,
]
STEPS[4].paras = [
  `Now re-run the summer with that canopy grown. Same season, same weather system overhead; the only thing changed is the shade. The grid cools block by block — the plan's hottest address, still ${HOT_BLOCK.name}, falls to +${HOT_BLOCK.planned}°C. The city average comes down to +${AVG_PLANNED}°C.`,
  `This is the move the Shade Budget makes that most plans don't: it spends first where the mercury is highest, not where the lobbying is loudest. You can see the ethics directly in the colour — the west keeps the most ink.`,
]
STEPS[5].paras = [
  `The old parks — ringed here in sage — prove the mechanism. They held their cool all summer with canopies planted a century ago by people who would never sit under them. The Budget is an attempt to send the same favour forward in time.`,
  `Honesty corner: even shaded, ${STUBBORN.length} block${STUBBORN.length === 1 ? '' : 's'} stay above +5°C. Planting is relief, not reversal. The map won't let anyone claim otherwise — the stubborn core stays faintly ember, on the record, in the appendix, in colour.`,
]

const CHAPTER_ANCHORS = STEPS.map((s, i) => ({ id: s.id, folio: `№ 0${i + 1}`, title: s.title }))

export default function MeridianHeatStory() {
  const [reduced, setReduced] = useState(false)
  const [active, setActive] = useState(0)
  const [chartProgress, setChartProgress] = useState(0)
  const stepRefs = useRef<(HTMLElement | null)[]>([])
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // scroll-spy across every chapter + the epilogue (index 6)
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.step ?? 0)
            setActive(i)
            e.target.classList.add('is-in')
          }
        }
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 },
    )
    stepRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // the ledger draws as its exhibit scrolls through the middle of the viewport
  useEffect(() => {
    const el = stepRefs.current[2]
    if (!el) return
    if (reduced) {
      setChartProgress(1)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === el) setChartProgress(Math.min(1, e.intersectionRatio * 1.55))
        }
      },
      { threshold: Array.from({ length: 41 }, (_, i) => i / 40) },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduced])

  // reading progress rule
  useEffect(() => {
    if (reduced) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = progressRef.current
        if (!el) return
        const max = document.documentElement.scrollHeight - window.innerHeight
        el.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / Math.max(1, max)))})`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  const phase = active >= 6 ? 'ash' : active >= 4 ? 'plan' : 'record'

  const setStepRef = (i: number) => (el: HTMLElement | null) => {
    stepRefs.current[i] = el
  }

  const copyBlock = (i: number) => (
    <div className="mchs__copy">
      <p className="mchs__folio mono">{STEPS[i].folio}</p>
      {STEPS[i].paras.map((p, j) => (
        <p key={j}>{p}</p>
      ))}
      {STEPS[i].quote && (
        <blockquote className="mchs__pull">
          <p>“{STEPS[i].quote.text}”</p>
          <cite className="mono">— {STEPS[i].quote.by}</cite>
        </blockquote>
      )}
    </div>
  )

  return (
    <div className="mchs" data-phase={phase}>
      <div className="mchs__progress mono" ref={progressRef} aria-hidden />

      <div className="mchs__wrap">
        {/* ------------------------------------------------ masthead */}
        <div className="mchs__masthead mono" role="presentation">
          <span>Meridian Climate — Urban Heat Desk</span>
          <span>File №04 · summer 2045–46</span>
          <span>Illustrative data throughout</span>
        </div>

        {/* ------------------------------------------------ hero */}
        <header className="mchs__hero">
          <p className="mchs__kicker mono">A data story in six chapters · every figure invented, flagged and earned</p>
          <h1>
            2046: the <em>heat map</em> of one summer
          </h1>
          <p className="mchs__standfirst">
            Greater Meridian — a harbour city that does not exist — has just lived through its hottest summer on a
            record that also does not exist. The fiction is the numbers. The physics is not. This is what
            {' '}+{roundDelta()} degrees feels like, block by block, and what a city can buy back with trees.
          </p>
          <p className="mchs__byline mono">
            Words: the Meridian Data Desk · Graphics: Brassfern Lab · Reading time: six minutes
          </p>
          <nav className="mchs__toc" aria-label="Chapters in this file">
            <p className="mono">Inside this file</p>
            <ol>
              {CHAPTER_ANCHORS.map((c, i) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className={active === i ? 'is-active' : undefined}>
                    <span className="mono">{c.folio}</span>
                    {c.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#fine-print" className={active === 6 ? 'is-active' : undefined}>
                  <span className="mono">№ 07</span>
                  The fine print
                </a>
              </li>
            </ol>
          </nav>
          <p className="mchs__cue mono" aria-hidden>
            Scroll — the mercury rises ↓
          </p>
        </header>

        {/* ----------------------------------- scrolly A: the recorded summer */}
        <div className="mchs__scrolly">
          <div className="mchs__viz">
            <HeatGrid
              amount={1}
              initFrom={0.55}
              emphasis={active === 1 ? WEST_SET : null}
              reduced={reduced}
              headline="Anomaly vs 20th-century average — 96 blocks, summer 2045–46"
            />
          </div>
          <div className="mchs__steps">
            <section className="mchs__step" data-step={0} id="ch-01" ref={setStepRef(0)} aria-labelledby="ch-01-h">
              <h2 id="ch-01-h">{STEPS[0].title}</h2>
              {copyBlock(0)}
            </section>
            <section className="mchs__step" data-step={1} id="ch-02" ref={setStepRef(1)} aria-labelledby="ch-02-h">
              <h2 id="ch-02-h">{STEPS[1].title}</h2>
              {copyBlock(1)}
            </section>
          </div>
        </div>

        {/* ----------------------------------- exhibit A: the daily ledger */}
        <section className="mchs__exhibit" data-step={2} id="ch-03" ref={setStepRef(2)} aria-labelledby="ch-03-h">
          <div className="mchs__exhibitgrid">
            <div className="mchs__exhibitcopy">
              <h2 id="ch-03-h">{STEPS[2].title}</h2>
              {copyBlock(2)}
            </div>
            <TempChart progress={reduced ? 1 : chartProgress} />
          </div>
        </section>

        {/* ----------------------------------- exhibit B: the canopy divide */}
        <section className="mchs__exhibit" data-step={3} id="ch-04" ref={setStepRef(3)} aria-labelledby="ch-04-h">
          <div className="mchs__exhibitgrid">
            <div className="mchs__exhibitcopy">
              <h2 id="ch-04-h">{STEPS[3].title}</h2>
              {copyBlock(3)}
            </div>
            <CanopyCompare />
          </div>
        </section>

        {/* ----------------------------------- scrolly B: the shaded summer */}
        <div className="mchs__scrolly mchs__scrolly--plan">
          <div className="mchs__viz">
            <HeatGrid
              amount={0}
              initFrom={1}
              emphasis={active === 5 ? PARK_SET : null}
              reduced={reduced}
              headline="The same summer, shaded — anomaly under the 2046 canopy plan"
            />
          </div>
          <div className="mchs__steps">
            <section className="mchs__step" data-step={4} id="ch-05" ref={setStepRef(4)} aria-labelledby="ch-05-h">
              <h2 id="ch-05-h">{STEPS[4].title}</h2>
              {copyBlock(4)}
            </section>
            <section className="mchs__step" data-step={5} id="ch-06" ref={setStepRef(5)} aria-labelledby="ch-06-h">
              <h2 id="ch-06-h">{STEPS[5].title}</h2>
              {copyBlock(5)}
            </section>
          </div>
        </div>

        {/* ----------------------------------- epilogue: the fine print */}
        <section className="mchs__epilogue" data-step={6} id="fine-print" ref={setStepRef(6)} aria-labelledby="fine-print-h">
          <div className="mchs__epiloguegrid">
            <div>
              <p className="mchs__folio mono">№ 07 — the fine print</p>
              <h2 id="fine-print-h">Absolutely none of it happened.<br />All of it is true.</h2>
              <p className="mchs__lead">
                Greater Meridian is a fiction. Its 96 blocks, its two named heatwaves, its Shade Budget and its
                2046 canopy targets were generated for this page and are labelled illustrative wherever they
                appear. What is not fictional: the physics of urban heat, the ethics of where shade gets planted,
                and the chart grammar — colour means quantity, never alarm; per-block figures beside every
                average; uncertainty admitted in print.
              </p>
            </div>
            <div className="mchs__method">
              <h3 className="mono">Method, such as it is</h3>
              <ul>
                <li>96 blocks, seeded from one number; anomalies modelled from distance-to-water, urban core and parkland — then frozen.</li>
                <li>90 daily maximums per summer; the 1997 series is 2046 minus ~4.8°C and a shrug of noise.</li>
                <li>The Shade Budget converts each added point of canopy into roughly 0.13°C of relief.</li>
                <li>Reduced-motion readers get the same states as static frames. Nobody is rewarded for having a fast GPU.</li>
              </ul>
              <p className="mchs__signoff">
                Filed from a city that isn’t there, about a summer that could be. — <i>The Data Desk</i>
              </p>
              <p className="mchs__caselink mono">
                Read how this story became a platform:{' '}
                <Link to="/work/meridian-climate-data-explorer">the Meridian Climate case study →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------- colophon */}
        <footer className="mchs__foot">
          <div className="mchs__masthead mono" role="presentation">
            <span>Meridian Climate</span>
            <span>A Brassfern Lab demo</span>
            <span>Continued on page 46</span>
          </div>
          <p>
            <b>Meridian Climate</b> is a fictional non-profit; every block, figure and heatwave in this story is
            invented and illustrative. The craft — the scrollytelling, the canvas, the restraint — is real.
          </p>
        </footer>
      </div>
    </div>
  )
}

function roundDelta(): string {
  return (AVG_MAX_2046 - AVG_MAX_1997).toFixed(1)
}
