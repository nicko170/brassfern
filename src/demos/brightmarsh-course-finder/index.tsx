import { useMemo, useRef, useState } from 'react'
import './demo.css'
import CourseCard from './CourseCard'
import { CompareTable, CompareTray } from './Compare'
import Enrol from './Enrol'
import Quiz from './Quiz'
import Sheet from './Sheet'
import {
  COURSES,
  DAYS,
  DEFAULT_FILTERS,
  LEVELS,
  MOODS,
  PRICE_BANDS,
  STORAGE_KEYS,
  applyFilters,
  byId,
  daysUntil,
  facetCount,
  seatInfo,
  type Course,
  type Filters,
} from './data'
import { toggleId, useStoredIds } from './hooks'

/**
 * Brightmarsh — course finder.
 * Art direction: the study room. Olive and oxblood on cream stock, engraved
 * double rules, serif prospectus headings, mono timetable chips. Deliberately
 * unlike Brassfern, and unlike Brightmarsh's own onboarding demo.
 *
 * Everything works: faceted filters with live per-option counts, shortlist +
 * compare persisted to localStorage, a three-up side-by-side table, native
 * <details> syllabi, a five-question advisor quiz, and a mocked three-step
 * enrolment with member pricing and gift options. Dates are computed from
 * now, so the honesty chips never rot.
 */

type Sort = 'soon' | 'price' | 'alpha'

const SORTS: { id: Sort; label: string }[] = [
  { id: 'soon', label: 'Soonest first' },
  { id: 'price', label: 'Price, low to high' },
  { id: 'alpha', label: 'A to Z' },
]

function Brightmark() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true" className="bcf-mark">
      <rect x="3" y="3" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="6.5" y="6.5" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <path
        d="M13 28V12h7.2c2.9 0 4.8 1.5 4.8 4 0 1.9-1.2 3.2-3 3.7 2.2.5 3.6 1.9 3.6 4 0 2.7-2.1 4.3-5.1 4.3H13zm3.6-9.4h3c1.6 0 2.5-.8 2.5-2.1s-.9-2-2.5-2h-3v4.1zm0 6.9h3.4c1.7 0 2.6-.8 2.6-2.1s-.9-2.1-2.6-2.1h-3.4v4.2z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function BrightmarshCourseFinder() {
  /* persisted state */
  const [shortlist, setShortlist] = useStoredIds(STORAGE_KEYS.shortlist)
  const [compareIds, setCompareIds] = useStoredIds(STORAGE_KEYS.compare)
  const [waitlist, setWaitlist] = useStoredIds(STORAGE_KEYS.waitlist)

  /* filters + view state */
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [shortOnly, setShortOnly] = useState(false)
  const [sort, setSort] = useState<Sort>('soon')

  /* overlays */
  const [sheetId, setSheetId] = useState<string | null>(null)
  const [compareOpen, setCompareOpen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [enrolId, setEnrolId] = useState<string | null>(null)

  /* announcements */
  const [announce, setAnnounce] = useState('')
  const announceTimer = useRef<number>(0)
  const say = (msg: string) => {
    setAnnounce(msg)
    if (typeof window !== 'undefined') {
      window.clearTimeout(announceTimer.current)
      announceTimer.current = window.setTimeout(() => setAnnounce(''), 4000)
    }
  }

  /* ------------------------------------------------------------ derived */

  const filtered = useMemo(() => {
    const list = applyFilters(filters, shortOnly, shortlist)
    const sorted = [...list]
    if (sort === 'soon') sorted.sort((a, b) => daysUntil(a) - daysUntil(b))
    if (sort === 'price') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'alpha') sorted.sort((a, b) => a.title.localeCompare(b.title))
    return sorted
  }, [filters, shortOnly, shortlist, sort])

  const counts = useMemo(
    () => ({
      mood: new Map(MOODS.map((m) => [m.id, facetCount(filters, 'mood', (c) => c.moods.includes(m.id))])),
      level: new Map(LEVELS.map((l) => [l, facetCount(filters, 'level', (c) => c.level === l)])),
      day: new Map(DAYS.map((d) => [d, facetCount(filters, 'day', (c) => c.day === d)])),
      price: new Map(PRICE_BANDS.map((b) => [b.id, facetCount(filters, 'price', (c) => b.test(c.price))])),
    }),
    [filters],
  )

  const compareCourses = useMemo(
    () => compareIds.map((id) => byId.get(id)).filter((c): c is Course => !!c),
    [compareIds],
  )

  const sheetCourse = sheetId ? byId.get(sheetId) : undefined
  const enrolCourse = enrolId ? byId.get(enrolId) : undefined

  const filtersActive =
    filters.mood !== 'any' || filters.level !== 'any' || filters.day !== 'any' || filters.price !== 'any' || shortOnly

  /* ------------------------------------------------------------ actions */

  const setFacet = <K extends keyof Filters>(key: K, value: Filters[K] | 'any') =>
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? 'any' : value }))

  const reset = () => {
    setFilters(DEFAULT_FILTERS)
    setShortOnly(false)
    say('All filters cleared — the whole shelf again.')
  }

  const toggleShort = (id: string) => {
    const on = !shortlist.includes(id)
    setShortlist(toggleId(shortlist, id))
    say(on ? `${byId.get(id)?.title} added to your shortlist.` : `${byId.get(id)?.title} removed from your shortlist.`)
  }

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((x) => x !== id))
      say(`${byId.get(id)?.title} removed from compare.`)
      return
    }
    if (compareIds.length >= 3) {
      say('The compare table holds three courses — remove one first.')
      return
    }
    setCompareIds([...compareIds, id])
    say(`${byId.get(id)?.title} added to compare (${compareIds.length + 1} of 3).`)
  }

  const startEnrol = (id: string) => {
    const c = byId.get(id)
    if (!c) return
    if (seatInfo(c).tone === 'waitlist') {
      const on = !waitlist.includes(id)
      setWaitlist(toggleId(waitlist, id))
      say(on ? `You're on the ${c.title} waitlist. We will email before we advertise.` : `Removed you from the ${c.title} waitlist.`)
      return
    }
    setSheetId(null)
    setCompareOpen(false)
    setEnrolId(id)
  }

  const saveQuizShortlist = (ids: string[]) => {
    const merged = [...shortlist]
    for (const id of ids) if (!merged.includes(id)) merged.push(id)
    setShortlist(merged)
    say('Three advisor picks saved to your shortlist.')
  }

  /* ------------------------------------------------------------ render */

  return (
    <div className="bcf">
      <div className="bcf__sr" aria-live="polite">
        {announce}
      </div>

      {/* top chrome ---------------------------------------------------- */}
      <header className="bcf-top">
        <p className="bcf-brand">
          <Brightmark />
          <span>
            Brightmarsh <b>Course Finder</b>
          </span>
        </p>
        <div className="bcf-top__meta">
          <span className="bcf-top__short">
            Shortlist <b>{shortlist.length}</b>
          </span>
          <button type="button" className="bcf-btn bcf-btn--sm bcf-btn--ox" onClick={() => setQuizOpen(true)}>
            60-second advisor
          </button>
        </div>
      </header>

      {/* hero ----------------------------------------------------------- */}
      <section className="bcf-hero">
        <p className="bcf-overline">Term Four · Spring · 24 courses · Surry Hills &amp; online</p>
        <h1>
          Learn something <em>useful</em> by Christmas.
        </h1>
        <p className="bcf-hero__lede">
          Short courses for working adults: two to six weeks, small rooms, honest prices, and tutors who
          still do the work they teach. Filter the shelf, compare three at a time, or let the advisor read
          your mind in five questions.
        </p>
        <ul className="bcf-hero__facts" aria-label="How Brightmarsh courses work">
          <li>Max 20 seats a class</li>
          <li>Members save 15%</li>
          <li>Refunds to 7 days out</li>
          <li>Gift any course</li>
        </ul>
      </section>

      {/* filters -------------------------------------------------------- */}
      <div className="bcf-filters" role="search" aria-label="Filter the catalogue">
        <div className="bcf-filters__row" role="group" aria-label="Filter by mood">
          <span className="bcf-filters__label" id="bcf-l-mood">
            I want to
          </span>
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`bcf-fchip${filters.mood === m.id ? ' is-on' : ''}`}
              aria-pressed={filters.mood === m.id}
              onClick={() => setFacet('mood', m.id)}
            >
              {m.label}
              <sup>{counts.mood.get(m.id)}</sup>
            </button>
          ))}
        </div>
        <div className="bcf-filters__row" role="group" aria-label="Filter by level">
          <span className="bcf-filters__label">Level</span>
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              className={`bcf-fchip${filters.level === l ? ' is-on' : ''}`}
              aria-pressed={filters.level === l}
              onClick={() => setFacet('level', l)}
            >
              {l}
              <sup>{counts.level.get(l)}</sup>
            </button>
          ))}
          <span className="bcf-filters__label bcf-filters__label--gap">Meets</span>
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              className={`bcf-fchip bcf-fchip--mono${filters.day === d ? ' is-on' : ''}`}
              aria-pressed={filters.day === d}
              onClick={() => setFacet('day', d)}
            >
              {d}
              <sup>{counts.day.get(d)}</sup>
            </button>
          ))}
        </div>
        <div className="bcf-filters__row" role="group" aria-label="Filter by price">
          <span className="bcf-filters__label">Price</span>
          {PRICE_BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`bcf-fchip${filters.price === b.id ? ' is-on' : ''}`}
              aria-pressed={filters.price === b.id}
              onClick={() => setFacet('price', b.id)}
            >
              {b.label}
              <sup>{counts.price.get(b.id)}</sup>
            </button>
          ))}
          <button
            type="button"
            className={`bcf-fchip bcf-fchip--short${shortOnly ? ' is-on' : ''}`}
            aria-pressed={shortOnly}
            onClick={() => setShortOnly(!shortOnly)}
          >
            ★ Shortlisted
            <sup>{shortlist.length}</sup>
          </button>
          {filtersActive && (
            <button type="button" className="bcf-fchip bcf-fchip--reset" onClick={reset}>
              Clear all ×
            </button>
          )}
        </div>
      </div>

      {/* results meta ---------------------------------------------------- */}
      <div className="bcf-resultsbar">
        <p className="bcf-count" aria-live="polite">
          Showing <b>{filtered.length}</b> of {COURSES.length} courses
          {shortOnly && shortlist.length === 0 ? ' — your shortlist is empty, star a few courses first' : ''}
        </p>
        <label className="bcf-sort">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* catalogue -------------------------------------------------------- */}
      <main className="bcf-main">
        {filtered.length === 0 ? (
          <div className="bcf-empty">
            <h2>Nothing on the shelf matches that.</h2>
            <p>
              The filters are arguing with each other. Loosen one — or clear them all and browse the full
              term.
            </p>
            <button type="button" className="bcf-btn" onClick={reset}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="bcf-grid">
            {filtered.map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                shortlisted={shortlist.includes(c.id)}
                inCompare={compareIds.includes(c.id)}
                compareFull={compareIds.length >= 3}
                waitlisted={waitlist.includes(c.id)}
                onDetails={(id) => setSheetId(id)}
                onToggleShort={toggleShort}
                onToggleCompare={toggleCompare}
                onEnrol={startEnrol}
              />
            ))}
          </div>
        )}

        <footer className="bcf-foot">
          <p>
            <b>A note on honesty.</b> Every scarcity chip on this page is computed from real seat counts and
            today&apos;s date — nothing flashes &ldquo;only 2 left!&rdquo; unless only 2 are left. Brightmarsh
            itself is fictional, and so is every course, tutor and dollar here; the interface thinking is
            genuine Brassfern.
          </p>
        </footer>
      </main>

      {/* overlays + tray -------------------------------------------------- */}
      <CompareTray
        courses={compareCourses}
        onOpen={() => setCompareOpen(true)}
        onRemove={toggleCompare}
        onClear={() => {
          setCompareIds([])
          say('Compare tray cleared.')
        }}
      />

      {compareOpen && compareCourses.length > 0 && (
        <CompareTable
          courses={compareCourses}
          onClose={() => setCompareOpen(false)}
          onRemove={toggleCompare}
          onEnrol={startEnrol}
        />
      )}

      {sheetCourse && (
        <Sheet
          course={sheetCourse}
          shortlisted={shortlist.includes(sheetCourse.id)}
          inCompare={compareIds.includes(sheetCourse.id)}
          compareFull={compareIds.length >= 3}
          waitlisted={waitlist.includes(sheetCourse.id)}
          onClose={() => setSheetId(null)}
          onToggleShort={toggleShort}
          onToggleCompare={toggleCompare}
          onEnrol={startEnrol}
        />
      )}

      {quizOpen && (
        <Quiz
          onClose={() => setQuizOpen(false)}
          onSave={saveQuizShortlist}
          onOpenCourse={(id) => {
            setQuizOpen(false)
            setSheetId(id)
          }}
        />
      )}

      {enrolCourse && (
        <Enrol
          course={enrolCourse}
          onClose={() => setEnrolId(null)}
          onDone={(r) => say(`Booking ${r.ref} confirmed for ${r.courseTitle} (demo — nothing charged).`)}
        />
      )}

    </div>
  )
}
