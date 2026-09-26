export interface ClientMark {
  name: string
  style: 'serif' | 'caps' | 'mono' | 'wide' | 'slab'
  note: string
}

/**
 * Fictional clients — the wordmark wall. Never use real company names.
 * Demo builders and writers should draw from this registry so the universe
 * stays consistent.
 */
export const clients: ClientMark[] = [
  { name: 'Hearthbrew Coffee', style: 'serif', note: 'Specialty coffee, roasted in Marrickville' },
  { name: 'NORTHWIND LEDGER', style: 'caps', note: 'Accounting software for small business' },
  { name: 'Pylon Health', style: 'mono', note: 'Telehealth for regional Australia' },
  { name: 'FERNLEIGH', style: 'wide', note: 'Cool-climate wines from the Adelaide Hills' },
  { name: 'Osprey Outdoor', style: 'slab', note: 'Gear for people who get lost on purpose' },
  { name: 'Brightmarsh', style: 'serif', note: 'Short courses for restless minds' },
  { name: 'TALLOW & CO.', style: 'caps', note: 'Butcher-turned-providore, est. 1987' },
  { name: 'meridian/climate', style: 'mono', note: 'Open climate data for councils' },
  { name: 'Holloway Records', style: 'serif', note: 'Independent label, Sydney' },
  { name: 'SUNDIAL', style: 'wide', note: 'Slow travel, planned properly' },
  { name: 'Wattle & Daub', style: 'slab', note: 'A firelit dining room in Surry Hills' },
  { name: 'GLADE', style: 'caps', note: 'Skincare with nothing to hide' },
]

export interface Testimonial {
  quote: string
  /** phrase(s) the template may wrap in <em> */
  name: string
  title: string
  company: string
  /** slug of the matching file in src/content/work/ — deep-links the quote */
  caseStudy?: string
}

export const testimonials: Testimonial[] = [
  {
    quote: 'Brassfern rebuilt our storefront and our conversion rate went up by a third in a quarter. But honestly? The weekly demos were the best part. We could see it working.',
    name: 'Imogen Hart',
    title: 'VP Growth',
    company: 'Northwind Ledger',
    caseStudy: 'northwind-ledger-budget',
  },
  {
    quote: 'They said no to three of our favourite ideas and were right every time. That is what you are paying for — judgement, not just hands.',
    name: 'Marcus Oduya',
    title: 'Founder',
    company: 'Pylon Health',
    caseStudy: 'pylon-health-booking',
  },
  {
    quote: 'Our rebrand could have been a committee tragedy. Instead it shipped in eleven weeks and the team still uses the system daily. It held.',
    name: 'Claire Beaumont',
    title: 'Head of Brand',
    company: 'Hearthbrew Coffee',
    caseStudy: 'hearthbrew-brand-system',
  },
  {
    quote: 'The rare agency that treats your budget like their own money. Fixed scope, no surprises, and the numbers afterwards were real.',
    name: 'Theo Lindqvist',
    title: 'CEO',
    company: 'Meridian Climate',
    caseStudy: 'meridian-climate-data-explorer',
  },
]
