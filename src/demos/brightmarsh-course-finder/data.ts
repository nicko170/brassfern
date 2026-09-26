/**
 * Brightmarsh course finder — data layer.
 * 24 fictional short courses, computed (never hard-coded) start dates so the
 * "starts soon / nearly full" honesty chips stay honest forever.
 */

export type Mood = 'lead' | 'write' | 'analyse' | 'design' | 'grow' | 'build'
export type Level = 'New to it' | 'Working' | 'Deep end'
export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Sat' | 'Sun'
export type Style = 'Workshop' | 'Seminar' | 'Studio' | 'Intensive'

export interface Week {
  t: string
  d: string
}

export interface Course {
  id: string
  code: string
  title: string
  tutor: string
  tutorRole: string
  blurb: string
  moods: Mood[]
  level: Level
  day: Day
  time: string
  room: string
  weeks: number
  /** Whole weeks from "today" the course begins; snapped forward to `day`. */
  weeksOut: number
  price: number
  capacity: number
  seatsLeft: number
  style: Style
  outcomes: string[]
  outline: Week[]
}

/* ------------------------------------------------------------ vocab */

export const MOODS: { id: Mood; label: string; verb: string }[] = [
  { id: 'lead', label: 'Lead people', verb: 'lead people' },
  { id: 'write', label: 'Write better', verb: 'write better' },
  { id: 'analyse', label: 'Number sense', verb: 'make sense of numbers' },
  { id: 'design', label: 'Design eye', verb: 'sharpen your design eye' },
  { id: 'grow', label: 'Grow something', verb: 'grow something' },
  { id: 'build', label: 'Build things', verb: 'build things' },
]

export const LEVELS: Level[] = ['New to it', 'Working', 'Deep end']

export const LEVEL_NOTES: Record<Level, string> = {
  'New to it': 'No prior knowledge assumed. Bring curiosity and a pen.',
  Working: 'You already do some of this. We make you quicker and surer.',
  'Deep end': 'For practitioners. We assume the basics and skip them.',
}

export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Sat', 'Sun']

export const PRICE_BANDS = [
  { id: 'a', label: 'Under $200', test: (p: number) => p < 200 },
  { id: 'b', label: '$200–349', test: (p: number) => p >= 200 && p < 350 },
  { id: 'c', label: '$350 +', test: (p: number) => p >= 350 },
] as const

export type PriceBandId = (typeof PRICE_BANDS)[number]['id']

export const MEMBERSHIP_PRICE = 89
export const MEMBER_DISCOUNT = 0.15

/* ------------------------------------------------------------ catalogue */

export const COURSES: Course[] = [
  {
    id: 'copy-that-converts',
    code: 'BM-104',
    title: 'Copy That Converts',
    tutor: 'Sadie Brennan',
    tutorRole: 'Direct-response copywriter, 15 years in',
    blurb:
      'Landing pages, emails and ads that earn the click without lying to get it. Every week you ship something real and we mark it up in front of you.',
    moods: ['write', 'grow'],
    level: 'Working',
    day: 'Tue',
    time: '6:30–8:30pm',
    room: 'Studio 1',
    weeks: 6,
    weeksOut: 1,
    price: 320,
    capacity: 18,
    seatsLeft: 5,
    style: 'Workshop',
    outcomes: [
      'A rewritten landing page you can actually publish',
      'A swipe file of 40 annotated examples',
      'A personal editing checklist, pressure-tested in class',
    ],
    outline: [
      { t: 'The hook and the promise', d: 'Why most headlines fail, and the three shapes that rarely do.' },
      { t: 'The brief behind the brief', d: 'Extracting the real job from a client, a boss, or yourself.' },
      { t: 'Landing pages, end to end', d: 'Structure a page from first line to button. First big rewrite due.' },
      { t: 'Emails people open twice', d: 'Subject lines, sequencing, and the unsubscribe you want to keep.' },
      { t: 'Editing ruthlessly', d: 'Cut 30% without losing the point. Bring your worst paragraph.' },
      { t: 'Teardown night', d: 'Live reviews of volunteer work — yours, if you are brave. Portfolio polish.' },
    ],
  },
  {
    id: 'essay-clinic',
    code: 'BM-110',
    title: 'The Essay Clinic',
    tutor: 'Ruth Kellaway',
    tutorRole: 'Essayist and former acquisitions editor',
    blurb:
      'For people who have something to say and a draft drawer full of false starts. Structure, voice, and the discipline of finishing.',
    moods: ['write'],
    level: 'New to it',
    day: 'Sat',
    time: '10am–12:30pm',
    room: 'Room 4',
    weeks: 4,
    weeksOut: 2,
    price: 180,
    capacity: 14,
    seatsLeft: 9,
    style: 'Seminar',
    outcomes: [
      'One finished 1,200-word essay, workshopped twice',
      'A structure toolkit for arguments that wander',
      'Feedback skills you can reuse on any draft',
    ],
    outline: [
      { t: 'Finding the actual subject', d: 'Your topic is rarely your subject. Exercises in drilling down.' },
      { t: 'Architecture', d: 'Outlines that hold weight: the braid, the spiral, the straight spine.' },
      { t: 'Voice on the page', d: 'Reading aloud, cutting throat-clearing, keeping your accent.' },
      { t: 'Workshop week', d: 'Full group review of finished drafts. You leave with an essay and a map.' },
    ],
  },
  {
    id: 'grant-tender-writing',
    code: 'BM-121',
    title: 'Grant & Tender Writing',
    tutor: 'Arun Chawla',
    tutorRole: 'Funding strategist for arts and research bodies',
    blurb:
      'The unglamorous writing that pays for everything else. Learn to answer the question that was asked, score against the rubric, and survive compliance.',
    moods: ['write', 'lead'],
    level: 'Working',
    day: 'Wed',
    time: '6:30–8:30pm',
    room: 'Live online',
    weeks: 5,
    weeksOut: 3,
    price: 340,
    capacity: 16,
    seatsLeft: 3,
    style: 'Seminar',
    outcomes: [
      'A complete draft application against a real rubric',
      'A reusable evidence bank template',
      'A compliance checklist that catches the silly rejections',
    ],
    outline: [
      { t: 'Reading guidelines like an assessor', d: 'What rubrics reward, and where applications die quietly.' },
      { t: 'The case for funding', d: 'Need, method, outcomes: building the argument in the funder\u2019s order.' },
      { t: 'Budgets that tell the truth', d: 'Costing honestly and defending every line item.' },
      { t: 'Draft week', d: 'Write your application in class with live review. Bring a real opportunity.' },
      { t: 'Compliance and submission', d: 'Attachments, word counts, portals, and the 48-hour buffer rule.' },
    ],
  },
  {
    id: 'editing-your-own-work',
    code: 'BM-118',
    title: 'Editing Your Own Work',
    tutor: 'Clare Messiter',
    tutorRole: 'Structural editor, trade non-fiction',
    blurb:
      'Advanced workshop for writers who can draft but cannot kill. Six weeks of distance techniques, structural surgery, and group critique that stings usefully.',
    moods: ['write'],
    level: 'Deep end',
    day: 'Thu',
    time: '6:30–9pm',
    room: 'Studio 2',
    weeks: 6,
    weeksOut: 0,
    price: 360,
    capacity: 12,
    seatsLeft: 2,
    style: 'Workshop',
    outcomes: [
      'A self-editing workflow you will actually follow',
      'One piece cut by a third and better for it',
      'A critique circle that outlives the course',
    ],
    outline: [
      { t: 'Distance and cold reads', d: 'Techniques for reading your own work like a stranger.' },
      { t: 'Structural surgery', d: 'Moving sections, deleting darlings, finding the spine again.' },
      { t: 'Line editing', d: 'Rhythm, repetition, and the sentences that only exist to impress.' },
      { t: 'The reader\u2019s contract', d: 'Promises made in paragraph one and kept — or broken on purpose.' },
      { t: 'Critique practice', d: 'Giving notes that help, receiving notes without flinching.' },
      { t: 'Final surgery', d: 'Your piece, before and after, read aloud to the room.' },
    ],
  },
  {
    id: 'spreadsheets-for-grown-ups',
    code: 'BM-201',
    title: 'Spreadsheets for Grown-Ups',
    tutor: 'Meg Doherty',
    tutorRole: 'Operations consultant and reformed accountant',
    blurb:
      'Formulas, pivot tables and named ranges, taught through real-ish messes: budgets, rosters, invoices. You will never screenshot a sum again.',
    moods: ['analyse'],
    level: 'New to it',
    day: 'Mon',
    time: '6:30–8:30pm',
    room: 'Studio 3',
    weeks: 4,
    weeksOut: 1,
    price: 190,
    capacity: 18,
    seatsLeft: 11,
    style: 'Workshop',
    outcomes: [
      'A household or project budget that updates itself',
      'Pivot tables built without fear',
      'A personal formula cheat-sheet, laminated by request',
    ],
    outline: [
      { t: 'Tables, not soup', d: 'Structuring data so the software can help you. Sort, filter, freeze.' },
      { t: 'Formulas that matter', d: 'SUMIFS, XLOOKUP and IF — the ten functions that do 90% of the work.' },
      { t: 'Pivot tables', d: 'Summarising 5,000 rows in five clicks. Practice files included and messy.' },
      { t: 'Build your own', d: 'Bring a real spreadsheet problem; leave with it solved and explained.' },
    ],
  },
  {
    id: 'analytics-without-tears',
    code: 'BM-210',
    title: 'Analytics Without Tears',
    tutor: 'Dev Raman',
    tutorRole: 'Measurement lead, ex-agency',
    blurb:
      'For marketers and founders drowning in dashboards. Set up events that mean something, read trends without panicking, and report like a grown-up.',
    moods: ['analyse'],
    level: 'Working',
    day: 'Tue',
    time: '6:30–8:30pm',
    room: 'Hybrid · Studio 3',
    weeks: 5,
    weeksOut: 4,
    price: 310,
    capacity: 16,
    seatsLeft: 6,
    style: 'Workshop',
    outcomes: [
      'A measurement plan for your actual site or product',
      'A one-page weekly report format, built in class',
      'The confidence to say "that spike is noise"',
    ],
    outline: [
      { t: 'What to measure and why', d: 'Goals, events, and the metric hierarchy that ends debate.' },
      { t: 'Reading traffic honestly', d: 'Seasonality, bot noise, and why last Tuesday proves nothing.' },
      { t: 'Funnels and drop-off', d: 'Finding the leaky step and knowing when you cannot fix it with data.' },
      { t: 'Experiments without a lab', d: 'A/B tests, holdouts, and the sample-size talk nobody wants.' },
      { t: 'The weekly one-pager', d: 'Build your report template and road-test it on live data.' },
    ],
  },
  {
    id: 'financial-modelling-basics',
    code: 'BM-215',
    title: 'Financial Modelling Basics',
    tutor: 'Belinda Cross',
    tutorRole: 'Former VC analyst, now freelance CFO',
    blurb:
      'Build a three-statement model from a blank sheet, then stress-test it until it confesses. For operators, founders and the CFO-curious.',
    moods: ['analyse', 'lead'],
    level: 'Working',
    day: 'Wed',
    time: '6:30–9pm',
    room: 'Live online',
    weeks: 6,
    weeksOut: 2,
    price: 370,
    capacity: 14,
    seatsLeft: 4,
    style: 'Workshop',
    outcomes: [
      'A working model of a fictional business, built by you',
      'Scenario switches for best / base / bleak cases',
      'A checklist of the ten errors that sink models',
    ],
    outline: [
      { t: 'Model hygiene', d: 'Layout, colour codes, and the inputs/outputs separation that saves careers.' },
      { t: 'Revenue build-up', d: 'From units and price to a revenue engine that drivers actually drive.' },
      { t: 'Costs and headcount', d: 'Fixed, variable, and the salaries that sneak up on you.' },
      { t: 'Cash flow, the truth-teller', d: 'Profit is an opinion; cash is a fact. Wire them together.' },
      { t: 'Scenarios and switches', d: 'Sensitivity tables and the tornado chart your board will love.' },
      { t: 'Break your model', d: 'We attack your assumptions in class. Stronger model, thicker skin.' },
    ],
  },
  {
    id: 'read-a-p-and-l',
    code: 'BM-220',
    title: 'Read a P&L Like a CFO',
    tutor: 'Ray Caulfield',
    tutorRole: 'CFO, three exits, zero patience for jargon',
    blurb:
      'Four sessions, one skill: looking at a profit-and-loss statement and knowing within two minutes what is really going on. Advanced, fast, unforgiving.',
    moods: ['analyse', 'lead'],
    level: 'Deep end',
    day: 'Thu',
    time: '6:30–8:30pm',
    room: 'Studio 1',
    weeks: 4,
    weeksOut: 5,
    price: 390,
    capacity: 12,
    seatsLeft: 0,
    style: 'Seminar',
    outcomes: [
      'Fluency in margin, burn and runway conversations',
      'A red-flag checklist for dodgy accounts',
      'The nerve to ask the right question in the meeting',
    ],
    outline: [
      { t: 'Anatomy of the statement', d: 'Revenue to net income, line by line, with the tricks named.' },
      { t: 'Margin stories', d: 'Gross vs operating margin, and what each is secretly telling you.' },
      { t: 'Cash vs accrual combat', d: 'Why a profitable company dies; reading the cash statement cold.' },
      { t: 'Board-pack speed round', d: 'Real anonymised packs, five minutes each, verdicts out loud.' },
    ],
  },
  {
    id: 'design-systems-from-scratch',
    code: 'BM-301',
    title: 'Design Systems from Scratch',
    tutor: 'Greta Lindqvist',
    tutorRole: 'Design systems lead, ex-fintech scale-up',
    blurb:
      'Tokens, components, documentation and the politics of adoption. You will leave with a small, real system and a plan to make it survive contact with a company.',
    moods: ['design', 'build'],
    level: 'Deep end',
    day: 'Wed',
    time: '6:30–9pm',
    room: 'Studio 2',
    weeks: 6,
    weeksOut: 6,
    price: 420,
    capacity: 14,
    seatsLeft: 7,
    style: 'Studio',
    outcomes: [
      'A token architecture for colour, type and space',
      'Three documented components with usage guidance',
      'An adoption plan that accounts for human nature',
    ],
    outline: [
      { t: 'Audit before architecture', d: 'Inventorying an existing product honestly before building.' },
      { t: 'Design tokens', d: 'Naming, layering, and the decisions that should hurt a little.' },
      { t: 'Component anatomy', d: 'APIs for designers and engineers: one button, both worlds.' },
      { t: 'Documentation that gets read', d: 'Do/don\u2019t pairs, examples over doctrine, search over nav.' },
      { t: 'Versioning and releases', d: 'Breaking changes, changelogs, and deprecation without enemies.' },
      { t: 'Adoption politics', d: 'Pilot teams, office hours, and proving value in one quarter.' },
    ],
  },
  {
    id: 'typography-for-the-terrified',
    code: 'BM-305',
    title: 'Typography for the Terrified',
    tutor: 'Hugo Franks',
    tutorRole: 'Type designer and recovering brand consultant',
    blurb:
      'Four Saturday mornings that will ruin restaurant menus for you forever. Pairing, hierarchy, spacing — taught on paper first, software second.',
    moods: ['design'],
    level: 'New to it',
    day: 'Sat',
    time: '10am–1pm',
    room: 'Studio 1',
    weeks: 4,
    weeksOut: 1,
    price: 210,
    capacity: 16,
    seatsLeft: 8,
    style: 'Studio',
    outcomes: [
      'A working eye for hierarchy and spacing',
      'Three pairing recipes that never fail',
      'A poster, hand-set and then digitised',
    ],
    outline: [
      { t: 'Seeing type', d: 'Anatomy, classification, and a guided walk through a century of letterforms.' },
      { t: 'Hierarchy', d: 'Size, weight, position: making pages that readers navigate without thinking.' },
      { t: 'Pairing without tears', d: 'Contrast rules, superfamilies, and the two-font maximum that works.' },
      { t: 'Set your poster', d: 'Compose a real poster by hand, critique, then set it digitally.' },
    ],
  },
  {
    id: 'figma-bootcamp',
    code: 'BM-310',
    title: 'Figma Bootcamp',
    tutor: 'Frankie Moss',
    tutorRole: 'Product designer and auto-layout evangelist',
    blurb:
      'From artboards to auto-layout to components that behave. Five evenings, one fictional app, zero tolerance for detached instances.',
    moods: ['design', 'build'],
    level: 'Working',
    day: 'Tue',
    time: '6:30–9pm',
    room: 'Studio 3',
    weeks: 5,
    weeksOut: 3,
    price: 290,
    capacity: 18,
    seatsLeft: 12,
    style: 'Workshop',
    outcomes: [
      'A clickable prototype of a small app',
      'A component library with variants done properly',
      'Handoff habits that engineers thank you for',
    ],
    outline: [
      { t: 'Frames and thinking', d: 'Layout logic before pixels; constraints that survive real content.' },
      { t: 'Auto-layout, properly', d: 'Nesting, spacing tokens-in-spirit, and the resize test.' },
      { t: 'Components and variants', d: 'Properties, slots, and when NOT to componentise.' },
      { t: 'Prototyping', d: 'Flows, overlays, smart animate — and knowing when a sketch wins.' },
      { t: 'Ship the app', d: 'Finish the prototype, annotate it, and survive a fake handoff review.' },
    ],
  },
  {
    id: 'accessibility-auditing',
    code: 'BM-318',
    title: 'Accessibility Auditing',
    tutor: 'Imogen Hart',
    tutorRole: 'Accessibility consultant, screen-reader daily driver',
    blurb:
      'Learn to audit a website against WCAG the way a professional does: with tools, with a keyboard, and with assistive technology you will use yourself.',
    moods: ['design'],
    level: 'Working',
    day: 'Thu',
    time: '6:30–8:30pm',
    room: 'Live online',
    weeks: 4,
    weeksOut: 0,
    price: 330,
    capacity: 14,
    seatsLeft: 3,
    style: 'Workshop',
    outcomes: [
      'A complete audit of a real page, findings ranked',
      'Keyboard and screen-reader testing fluency',
      'A remediation report format clients act on',
    ],
    outline: [
      { t: 'The rules and the reasons', d: 'WCAG structure, conformance levels, and the humans behind them.' },
      { t: 'Keyboard first', d: 'Focus order, traps, skip links — auditing with your mouse unplugged.' },
      { t: 'Screen-reader week', d: 'Running NVDA or VoiceOver yourself. Landmarks, labels, live regions.' },
      { t: 'Write the audit', d: 'Severity ranking, reproduction steps, and recommendations that land.' },
    ],
  },
  {
    id: 'first-time-manager',
    code: 'BM-401',
    title: 'First-Time Manager Intensive',
    tutor: 'Marcus Tiye',
    tutorRole: 'Executive coach, former engineering director',
    blurb:
      'Five Monday nights for people promoted on Friday and panicking by Sunday. One-on-ones, delegation, feedback, and the calendar you actually control.',
    moods: ['lead'],
    level: 'New to it',
    day: 'Mon',
    time: '6:30–9pm',
    room: 'Studio 1',
    weeks: 5,
    weeksOut: 2,
    price: 350,
    capacity: 16,
    seatsLeft: 5,
    style: 'Intensive',
    outcomes: [
      'A one-on-one system you will stick to',
      'Scripts for feedback that is kind and clear',
      'A delegation plan for your real workload',
    ],
    outline: [
      { t: 'The identity shift', d: 'From maker to multiplier: what changes on day one, honestly.' },
      { t: 'One-on-ones that matter', d: 'Agendas, cadence, and the questions that unlock the quiet ones.' },
      { t: 'Feedback without flinching', d: 'SBI model, praise-to-correct ratios, practice on real cases.' },
      { t: 'Delegation and trust', d: 'Letting go of the craft without letting go of the standard.' },
      { t: 'Your first 90 days', d: 'Build the plan: stakeholders, rhythms, and early wins you can see.' },
    ],
  },
  {
    id: 'meetings-people-like',
    code: 'BM-407',
    title: 'Meetings People Don\u2019t Dread',
    tutor: 'Paula Steer',
    tutorRole: 'Facilitator and org-design consultant',
    blurb:
      'The average professional loses a day a week to bad meetings. Take it back: agendas, decision rights, defaults, and the courage to decline.',
    moods: ['lead'],
    level: 'Working',
    day: 'Wed',
    time: '6:30–8pm',
    room: 'Live online',
    weeks: 4,
    weeksOut: 1,
    price: 240,
    capacity: 20,
    seatsLeft: 13,
    style: 'Seminar',
    outcomes: [
      'A personal meeting charter, written and tested',
      'Agenda templates for the five meeting types',
      'The polite decline, worded for you',
    ],
    outline: [
      { t: 'The audit', d: 'Score your real calendar. Most people save six hours before week two.' },
      { t: 'Purpose and decision rights', d: 'Inform, decide, or make: three meeting types, three designs.' },
      { t: 'Running the room', d: 'Facilitation moves for dominators, drifters and the silent majority.' },
      { t: 'Async by default', d: 'What to kill entirely, and how to say so without a incident report.' },
    ],
  },
  {
    id: 'difficult-conversations',
    code: 'BM-412',
    title: 'Difficult Conversations',
    tutor: 'Dee Nguyen',
    tutorRole: 'Mediator and former HR director',
    blurb:
      'Underperformance, money, behaviour, endings. Four evenings of practice with professional role-players, so the real thing is the second time you have done it.',
    moods: ['lead'],
    level: 'Working',
    day: 'Tue',
    time: '6:30–9pm',
    room: 'Studio 2',
    weeks: 4,
    weeksOut: 7,
    price: 260,
    capacity: 14,
    seatsLeft: 6,
    style: 'Intensive',
    outcomes: [
      'A preparation framework for any hard conversation',
      'Live practice with actor role-players',
      'De-escalation phrases that do not sound like HR',
    ],
    outline: [
      { t: 'Preparation, not courage', d: 'The one-page prep: goal, evidence, opening line, exits.' },
      { t: 'Saying the thing', d: 'Openings that land, silence as a tool, staying on the behavioural.' },
      { t: 'Role-play week one', d: 'Underperformance and pay conversations with professional actors.' },
      { t: 'Role-play week two', d: 'Behaviour complaints and endings. Debrief and personal toolkit.' },
    ],
  },
  {
    id: 'strategy-in-a-weekend',
    code: 'BM-420',
    title: 'Strategy in a Weekend',
    tutor: 'Owen Pallas',
    tutorRole: 'Strategy director, two decades, three continents',
    blurb:
      'Two full Sundays producing one artefact: a strategy for your real business that fits on one page and survives Monday morning. Bring a laptop and a problem.',
    moods: ['lead', 'grow'],
    level: 'Deep end',
    day: 'Sun',
    time: '10am–4pm',
    room: 'The Long Room',
    weeks: 2,
    weeksOut: 4,
    price: 480,
    capacity: 12,
    seatsLeft: 0,
    style: 'Intensive',
    outcomes: [
      'A one-page strategy for your actual organisation',
      'A ruthless diagnosis of where you are now',
      'A 90-day action spine with owners and dates',
    ],
    outline: [
      { t: 'Sunday one: diagnosis', d: 'Where you are, why, and the honest constraints. Frameworks as tools, not wallpaper.' },
      { t: 'Sunday two: the choice', d: 'Where to play, how to win, what to stop. You leave with the one-pager, argued over and signed.' },
    ],
  },
  {
    id: 'small-business-seo',
    code: 'BM-501',
    title: 'Small-Business SEO',
    tutor: 'Bec Hollis',
    tutorRole: 'SEO lead, ten years of local and e-comm wins',
    blurb:
      'No dark arts, no rented backlinks. Technical basics, content that answers real questions, and local search — sized for a business without a marketing team.',
    moods: ['grow'],
    level: 'New to it',
    day: 'Mon',
    time: '6:30–8:30pm',
    room: 'Live online',
    weeks: 5,
    weeksOut: 3,
    price: 270,
    capacity: 20,
    seatsLeft: 9,
    style: 'Workshop',
    outcomes: [
      'A technical health check of your own site',
      'A six-month content plan mapped to real queries',
      'Google Business Profile set up like a professional',
    ],
    outline: [
      { t: 'How search actually works', d: 'Crawl, index, rank — and the myths to bin immediately.' },
      { t: 'Technical foundations', d: 'Speed, structure, titles and the checks you can run free tonight.' },
      { t: 'Finding the questions', d: 'Keyword research as customer research; building the query map.' },
      { t: 'Content that ranks and reads', d: 'Writing answer-first pages; avoiding the AI-content swamp.' },
      { t: 'Local and measurement', d: 'Maps, reviews, and a reporting ritual of ten minutes a month.' },
    ],
  },
  {
    id: 'newsletters-people-read',
    code: 'BM-505',
    title: 'Newsletters People Read',
    tutor: 'Nina Petrides',
    tutorRole: 'Editor of a 40k-subscriber industry letter',
    blurb:
      'Subject lines, structure, voice and the cadence you can sustain. Bring your list (or your intention to build one); leave with four issues drafted.',
    moods: ['grow', 'write'],
    level: 'Working',
    day: 'Thu',
    time: '6:30–8:30pm',
    room: 'Studio 3',
    weeks: 4,
    weeksOut: 1,
    price: 250,
    capacity: 16,
    seatsLeft: 4,
    style: 'Workshop',
    outcomes: [
      'Four drafted issues of your newsletter',
      'A format doc so issue fifty is as good as issue five',
      'Growth tactics that are not tricks',
    ],
    outline: [
      { t: 'The promise', d: 'What your letter is for, who it misses, and the one-line pitch test.' },
      { t: 'Structure and voice', d: 'Formats that scale, and sounding like yourself on a deadline.' },
      { t: 'Subject lines and opens', d: 'We draft twenty each. Some will be terrible; that is the point.' },
      { t: 'Growth and ritual', d: 'Referral loops that are not annoying, plus your sustainable cadence.' },
    ],
  },
  {
    id: 'pricing-your-work',
    code: 'BM-510',
    title: 'Pricing Your Work',
    tutor: 'Ken Aoyama',
    tutorRole: 'Pricing consultant for studios and freelancers',
    blurb:
      'Cost-plus, value-based, retainers and the discovery call where money stops being awkward. For anyone who invoices other humans.',
    moods: ['grow', 'analyse'],
    level: 'Working',
    day: 'Wed',
    time: '6:30–8:30pm',
    room: 'Live online',
    weeks: 4,
    weeksOut: 5,
    price: 290,
    capacity: 18,
    seatsLeft: 10,
    style: 'Seminar',
    outcomes: [
      'A rate card you can defend without apologising',
      'A value-based pricing worksheet for proposals',
      'Scripts for the rise conversation with existing clients',
    ],
    outline: [
      { t: 'What price is', d: 'Anchoring, framing, and why your instinct is about twenty percent low.' },
      { t: 'Models', d: 'Hourly, day, project, retainer, value: the trade-offs with real numbers.' },
      { t: 'The money conversation', d: 'Quotes, negotiation, discounts and the dignity of saying no.' },
      { t: 'Raise your prices', d: 'Plan and rehearse the increase conversation. Yes, this quarter.' },
    ],
  },
  {
    id: 'brand-voice-workshop',
    code: 'BM-515',
    title: 'Brand Voice Workshop',
    tutor: 'Marion Deale',
    tutorRole: 'Verbal identity lead, ex-publishing',
    blurb:
      'Three Saturdays to find how your organisation should sound, and to write the guide that keeps it sounding that way after you leave the room.',
    moods: ['grow', 'design'],
    level: 'Working',
    day: 'Sat',
    time: '10am–1pm',
    room: 'Studio 2',
    weeks: 3,
    weeksOut: 2,
    price: 230,
    capacity: 14,
    seatsLeft: 5,
    style: 'Studio',
    outcomes: [
      'A voice chart: three sliders that define your sound',
      'Before/after rewrites of your real comms',
      'A one-page voice guide people actually use',
    ],
    outline: [
      { t: 'Hearing your brand', d: 'Sampling your existing copy; naming what it currently says about you.' },
      { t: 'Building the sliders', d: 'From values to dials: formal↔casual, serious↔playful, terse↔warm.' },
      { t: 'The guide', d: 'Write it, test it on the sceptics, and leave with usage examples that sell it.' },
    ],
  },
  {
    id: 'no-code-mvp-weekend',
    code: 'BM-601',
    title: 'No-Code MVP Weekend',
    tutor: 'Sam Lightbody',
    tutorRole: 'Founder, three launches, one acquisition',
    blurb:
      'Two Saturdays. You arrive with an idea and leave with a working product stitched from no-code tools, plus the judgement to know when no-code stops being enough.',
    moods: ['build'],
    level: 'New to it',
    day: 'Sat',
    time: '10am–4pm',
    room: 'The Workshop',
    weeks: 2,
    weeksOut: 1,
    price: 380,
    capacity: 16,
    seatsLeft: 3,
    style: 'Intensive',
    outcomes: [
      'A working MVP of your own idea',
      'A founder\u2019s map of the no-code landscape',
      'The handover question answered: rebuild or ride it out',
    ],
    outline: [
      { t: 'Saturday one: scope and build', d: 'Cut the idea to its smallest testable self, then build the spine of it by 4pm.' },
      { t: 'Saturday two: finish and face users', d: 'Payments, polish, and five real strangers trying it while you watch.' },
    ],
  },
  {
    id: 'javascript-for-the-curious',
    code: 'BM-605',
    title: 'JavaScript for the Curious',
    tutor: 'Jack Irons',
    tutorRole: 'Front-end engineer and patient explainer',
    blurb:
      'Programming from zero, taught through the browser you already live in. Variables to fetch() in six weeks, with homework you will actually want to do.',
    moods: ['build'],
    level: 'New to it',
    day: 'Tue',
    time: '6:30–9pm',
    room: 'Studio 3',
    weeks: 6,
    weeksOut: 8,
    price: 340,
    capacity: 18,
    seatsLeft: 14,
    style: 'Workshop',
    outcomes: [
      'An interactive web toy, built end to end',
      'Reading-level fluency with real-world code',
      'A clear answer to "should I learn more of this"',
    ],
    outline: [
      { t: 'Values and verbs', d: 'Variables, types, functions — building a working mental model, not syntax trivia.' },
      { t: 'The page is an object', d: 'The DOM, events, and making buttons that do something.' },
      { t: 'Data in, data out', d: 'Arrays, objects, loops — with datasets about things you care about.' },
      { t: 'Talking to the internet', d: 'fetch(), JSON, and the day your page shows live data.' },
      { t: 'State and storage', d: 'Remembering things between clicks and between visits.' },
      { t: 'Ship a toy', d: 'Build and demo a small interactive piece. Friends and family welcome.' },
    ],
  },
  {
    id: 'ai-tools-small-teams',
    code: 'BM-612',
    title: 'AI Tools for Small Teams',
    tutor: 'Ade Bakare',
    tutorRole: 'Product engineer, applied-AI tinkerer',
    blurb:
      'A clear-eyed four weeks on what LLM tools genuinely do for a small team: drafting, support deflection, research, and the workflows where they waste your time.',
    moods: ['build', 'grow'],
    level: 'Working',
    day: 'Thu',
    time: '6:30–8:30pm',
    room: 'Live online',
    weeks: 4,
    weeksOut: 0,
    price: 360,
    capacity: 20,
    seatsLeft: 0,
    style: 'Seminar',
    outcomes: [
      'Three workflows automated or augmented, properly',
      'A team policy draft: data, disclosure, review',
      'An evaluation habit: is it actually better?',
    ],
    outline: [
      { t: 'What the tools are', d: 'Capabilities and limits, without hype and without dismissal.' },
      { t: 'Drafting and research', d: 'Prompt patterns, source discipline, and the human sign-off.' },
      { t: 'Support and ops uses', d: 'Deflection done honestly; where automation quietly insults people.' },
      { t: 'Policy and evaluation', d: 'Write your team\u2019s usage policy and a simple before/after test.' },
    ],
  },
  {
    id: 'shipping-side-projects',
    code: 'BM-620',
    title: 'Shipping Side Projects',
    tutor: 'Ray Ellison',
    tutorRole: 'Indie maker, eleven shipped things, nine failures',
    blurb:
      'For experienced builders whose side projects die at 80%. Scoping, finishing rituals, launching small, and the psychology of the final 20%.',
    moods: ['build'],
    level: 'Deep end',
    day: 'Mon',
    time: '6:30–9pm',
    room: 'The Workshop',
    weeks: 5,
    weeksOut: 6,
    price: 390,
    capacity: 12,
    seatsLeft: 4,
    style: 'Studio',
    outcomes: [
      'A shipped project — actually live, with a URL',
      'A finishing checklist for the 80% wall',
      'A public build-log habit, if you want one',
    ],
    outline: [
      { t: 'Autopsy week', d: 'Post-mortems on your abandoned projects. Patterns emerge fast.' },
      { t: 'Scope surgery', d: 'Cutting the current project to a two-week shippable core.' },
      { t: 'The boring 20%', d: 'Auth, billing, errors, onboarding: the unglamorous finishing list.' },
      { t: 'Launch small', d: 'Shipping to ten users on purpose; feedback without a meltdown.' },
      { t: 'Ship night', d: 'Go live in class. Champagne is cheap; shipped URLs are priceless.' },
    ],
  },
]

export const byId = new Map(COURSES.map((c) => [c.id, c]))

/* ------------------------------------------------------------ date logic */

const DAY_NUM: Record<Day, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Sat: 6 }

/** Start date: `weeksOut` whole weeks from today, snapped forward to the course day. */
export function startDate(c: Course, now: Date = new Date()): Date {
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + c.weeksOut * 7)
  let delta = (DAY_NUM[c.day] - base.getDay() + 7) % 7
  if (delta === 0 && c.weeksOut === 0) delta = 7 // a course never starts "today"
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + delta)
}

export function daysUntil(c: Course, now: Date = new Date()): number {
  const start = startDate(c, now)
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((start.getTime() - midnight.getTime()) / 86_400_000)
}

export function fmtStart(c: Course, now?: Date): string {
  const d = startDate(c, now)
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function isSoon(c: Course, now?: Date): boolean {
  return daysUntil(c, now) <= 10
}

/* ------------------------------------------------------------ money + seats */

export const fmtMoney = (n: number) => `$${n.toLocaleString('en-AU')}`
export const memberPrice = (price: number) => Math.round(price * (1 - MEMBER_DISCOUNT))

export type SeatTone = 'waitlist' | 'low' | 'ok'

export function seatInfo(c: Course): { tone: SeatTone; label: string } {
  if (c.seatsLeft <= 0) return { tone: 'waitlist', label: 'Full — waitlist open' }
  if (c.seatsLeft <= 4) return { tone: 'low', label: `Nearly full — ${c.seatsLeft} left` }
  return { tone: 'ok', label: `${c.seatsLeft} of ${c.capacity} seats left` }
}

/* ------------------------------------------------------------ filtering */

export interface Filters {
  mood: Mood | 'any'
  level: Level | 'any'
  day: Day | 'any'
  price: PriceBandId | 'any'
}

export const DEFAULT_FILTERS: Filters = { mood: 'any', level: 'any', day: 'any', price: 'any' }

export function matches(c: Course, f: Filters, exclude?: keyof Filters): boolean {
  if (exclude !== 'mood' && f.mood !== 'any' && !c.moods.includes(f.mood)) return false
  if (exclude !== 'level' && f.level !== 'any' && c.level !== f.level) return false
  if (exclude !== 'day' && f.day !== 'any' && c.day !== f.day) return false
  if (exclude !== 'price' && f.price !== 'any') {
    const band = PRICE_BANDS.find((b) => b.id === f.price)
    if (band && !band.test(c.price)) return false
  }
  return true
}

export function applyFilters(f: Filters, shortOnly: boolean, shortlist: string[]): Course[] {
  return COURSES.filter(
    (c) => matches(c, f) && (!shortOnly || shortlist.includes(c.id)),
  )
}

/** Count for one option within a facet, respecting the *other* active filters. */
export function facetCount(f: Filters, facet: keyof Filters, test: (c: Course) => boolean): number {
  return COURSES.filter((c) => matches(c, f, facet) && test(c)).length
}

/* ------------------------------------------------------------ advisor quiz */

export interface QuizOption {
  label: string
  hint?: string
}

export interface QuizQuestion {
  id: string
  q: string
  options: QuizOption[]
}

export const QUIZ: QuizQuestion[] = [
  {
    id: 'want',
    q: 'What do you want more of by the end of term?',
    options: [
      { label: 'A team that runs better', hint: 'managing, meetings, hard talks' },
      { label: 'Words that land', hint: 'copy, essays, applications' },
      { label: 'Numbers that behave', hint: 'spreadsheets, P&Ls, analytics' },
      { label: 'A sharper eye', hint: 'type, systems, accessibility' },
      { label: 'An audience', hint: 'SEO, newsletters, pricing' },
      { label: 'A shipped thing', hint: 'code, MVPs, side projects' },
    ],
  },
  {
    id: 'base',
    q: 'Where are you starting from?',
    options: [
      { label: 'Square one, happily', hint: 'no experience assumed' },
      { label: 'I do some of this already', hint: 'want to be quicker and surer' },
      { label: 'Take me to the deep end', hint: 'skip the basics please' },
    ],
  },
  {
    id: 'when',
    q: 'When can you actually show up?',
    options: [
      { label: 'Weeknights', hint: 'Mon–Thu, after work' },
      { label: 'Weekends', hint: 'Sat & Sun sessions' },
      { label: 'Whenever it runs', hint: 'my calendar bends' },
    ],
  },
  {
    id: 'budget',
    q: 'What is the budget feeling like?',
    options: [
      { label: 'Under $200', hint: 'a toe in the water' },
      { label: '$200–349 is fine', hint: 'the sweet spot' },
      { label: '$350+ if it earns it', hint: 'show me the value' },
      { label: 'Money is not the filter', hint: 'fit first' },
    ],
  },
  {
    id: 'style',
    q: 'How do you like to learn?',
    options: [
      { label: 'Hands messy, making things', hint: 'workshops & studios' },
      { label: 'Talking it through', hint: 'seminars & discussion' },
      { label: 'All in, short and sharp', hint: 'intensives' },
      { label: 'Surprise me', hint: 'no preference' },
    ],
  },
]

const DAY_GROUPS: Record<number, Day[]> = { 0: ['Mon', 'Tue', 'Wed', 'Thu'], 1: ['Sat', 'Sun'] }

export interface Recommendation {
  course: Course
  why: string
}

export function recommend(answers: number[]): Recommendation[] {
  const [want, base, when, budget, style] = answers
  const mood = MOODS[want]?.id
  const level = LEVELS[base]
  const band = budget <= 2 ? PRICE_BANDS[budget] : null

  const scored = COURSES.map((c) => {
    let score = 0
    const hits: string[] = []
    if (mood && c.moods.includes(mood)) {
      score += 3
      hits.push(`built for people who want to ${MOODS[want].verb}`)
    }
    if (level && c.level === level) {
      score += 2
      hits.push(`pitched at “${level}” level, like you asked`)
    }
    if (when <= 1) {
      if (DAY_GROUPS[when].includes(c.day)) {
        score += 2
        hits.push(when === 0 ? 'runs on a weeknight' : 'runs on a weekend')
      }
    } else {
      score += 1
    }
    if (band && band.test(c.price)) {
      score += 1
      hits.push(`inside your ${band.label} budget`)
    } else if (!band) {
      score += 1
    }
    if (style === 0 && (c.style === 'Workshop' || c.style === 'Studio')) {
      score += 1
      hits.push('hands-on from the first hour')
    } else if (style === 1 && c.style === 'Seminar') {
      score += 1
      hits.push('a discussion-led seminar')
    } else if (style === 2 && c.style === 'Intensive') {
      score += 1
      hits.push('short, sharp and immersive')
    } else if (style === 3) {
      score += 1
    }
    // sooner beats later at equal score
    const soon = daysUntil(c)
    return { c, score, soon, hits }
  })

  scored.sort((a, b) => b.score - a.score || a.soon - b.soon || a.c.price - b.c.price)

  return scored.slice(0, 3).map((s) => ({
    course: s.c,
    why:
      s.hits.length > 0
        ? `It is ${s.hits.slice(0, 2).join(' and ')}.`
        : 'Strong all-round match for your answers.',
  }))
}

/* ------------------------------------------------------------ misc */

export const fmtWeeks = (c: Course) => (c.weeks <= 2 ? `${c.weeks} × ${c.day} sessions` : `${c.weeks} weeks · ${c.day}s`)

export const STORAGE_KEYS = {
  shortlist: 'bcf:shortlist',
  compare: 'bcf:compare',
  waitlist: 'bcf:waitlist',
}
