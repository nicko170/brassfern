export interface JobSalary {
  /** Display text, e.g. "A$150,000–180,000 + super". */
  text: string
  min: number
  max: number
  currency: 'AUD' | 'GBP'
}

export interface Job {
  slug: string
  title: string
  team: string
  location: string
  type: string
  summary: string
  doing: string[]
  bring: string[]
  /** Published band — careers page copy promises bands on every role. */
  salary: JobSalary
  /** ISO dates for the posting window (also feed JobPosting JSON-LD). */
  posted: string
  closes: string
  /** Remote roles list eligible country codes (jobLocationType TELECOMMUTE). */
  remote: boolean
  applicantLocations: string[]
  /** Hybrid/on-site roles name a studio. */
  office?: string
}

/** Fictional open roles. */
export const jobs: Job[] = [
  {
    slug: 'senior-product-engineer',
    title: 'Senior Product Engineer',
    team: 'Product',
    location: 'Remote — AU/NZ',
    type: 'Full-time',
    summary: 'Own features end to end across React, TypeScript, Node and Postgres. You will pair with designers daily and demo to clients on Fridays — no throwaway code, no ticket caves.',
    doing: [
      'Ship whole features: schema, API, UI, tests, docs',
      'Hold our performance and accessibility budgets in review',
      'Pair with designers at the sketch stage, not the handoff',
      'Present your work directly to clients each week',
    ],
    bring: [
      '6+ years building web products, most of them with TypeScript',
      'Strong product instincts — you argue about outcomes, not frameworks',
      'Comfort being the most senior engineer in a three-person squad',
      'Writing clear enough to run a project without meetings',
    ],
    salary: { text: 'A$150,000–180,000 + super', min: 150000, max: 180000, currency: 'AUD' },
    posted: '2026-09-07',
    closes: '2027-01-30',
    remote: true,
    applicantLocations: ['AU', 'NZ'],
  },
  {
    slug: 'brand-designer',
    title: 'Brand Designer',
    team: 'Brand',
    location: 'Sydney (Surry Hills), hybrid',
    type: 'Full-time',
    summary: 'Design identity systems that survive production. You will work from strategy to tokens, and hand over brands that engineering teams can actually ship.',
    doing: [
      'Identity systems: logos, type, colour, motion principles',
      'Design tokens and component-ready brand kits',
      'Naming and verbal identity alongside our writers',
      'Living guideline sites instead of PDFs that rot',
    ],
    bring: [
      'A portfolio of systems, not just logos',
      'Real Figma craft: variables, components, libraries',
      'Opinions about type, held loosely',
      'Curiosity about how brands become interfaces',
    ],
    salary: { text: 'A$120,000–145,000 + super', min: 120000, max: 145000, currency: 'AUD' },
    posted: '2026-08-24',
    closes: '2027-01-16',
    remote: false,
    applicantLocations: ['AU'],
    office: 'Surry Hills, Sydney',
  },
  {
    slug: 'growth-strategist',
    title: 'Growth Strategist',
    team: 'Growth',
    location: 'London or Remote — UK',
    type: 'Full-time',
    summary: 'Run experiment programs for our retainer clients: SEO, CRO and lifecycle, reported in revenue. You will write hypotheses, kill your own ideas, and love it.',
    doing: [
      'Weekly experiment cadence with pre-registered kill criteria',
      'Technical SEO audits and content engines with our writers',
      'Live dashboards clients actually open',
      'Quarterly strategy that names what we will not do',
    ],
    bring: [
      '4+ years in growth, with numbers you are proud of and can explain',
      'Fluency in analytics tools and their failure modes',
      'Copywriting instincts — you can write the test variant yourself',
      'A allergy to vanity metrics',
    ],
    salary: { text: '£80,000–100,000', min: 80000, max: 100000, currency: 'GBP' },
    posted: '2026-08-31',
    closes: '2027-02-13',
    remote: true,
    applicantLocations: ['GB'],
    office: 'London',
  },
  {
    slug: 'design-engineer',
    title: 'Design Engineer',
    team: 'Studio',
    location: 'Remote — AU/NZ/SG',
    type: 'Full-time',
    summary: 'Live between the design file and the deploy. You will own motion, micro-interactions and the browser-level craft that makes our work feel expensive.',
    doing: [
      'Motion systems: easings, durations, choreography, restraint',
      'Prototype wild ideas in code before anyone commits',
      'Raise the craft bar across every squad\u2019s UI',
      'Own this website\u2019s weirdest corners with us',
    ],
    bring: [
      'Deep CSS, real TypeScript, and taste',
      'Experience with canvas, WebGL or creative coding',
      'A portfolio of interfaces that feel alive — and load fast',
      'Respect for prefers-reduced-motion as a design constraint',
    ],
    salary: { text: 'A$140,000–170,000 + super', min: 140000, max: 170000, currency: 'AUD' },
    posted: '2026-09-14',
    closes: '2027-02-27',
    remote: true,
    applicantLocations: ['AU', 'NZ', 'SG'],
  },
  {
    slug: 'ai-engineer',
    title: 'AI Engineer',
    team: 'AI',
    location: 'Remote — SG/AU/NZ',
    type: 'Full-time',
    summary: 'Ship LLM features users can trust: retrieval, agents, evals and the interfaces around them. You will benchmark before you recommend and instrument before you launch.',
    doing: [
      'RAG pipelines and agent workflows on real client data',
      'Evaluation harnesses and quality dashboards',
      'Cost and latency engineering that survives the finance team',
      'Guardrails, red-teaming and honest capability write-ups',
    ],
    bring: [
      'Production LLM experience — not just notebooks',
      'Healthy scepticism and a love of golden datasets',
      'Strong Python and TypeScript',
      'The ability to explain confidence scores to a client\u2019s lawyer',
    ],
    salary: { text: 'A$155,000–185,000 + super', min: 155000, max: 185000, currency: 'AUD' },
    posted: '2026-09-21',
    closes: '2027-03-06',
    remote: true,
    applicantLocations: ['AU', 'NZ', 'SG'],
  },
]

export function getJob(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug)
}
