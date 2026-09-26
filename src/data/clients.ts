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
    quote: 'Brassfern rebuilt our dashboard and our customers started reading their own numbers for the first time. Honestly? The Friday demos were the best part. We could see it working.',
    name: 'Imogen Hart',
    title: 'VP Growth',
    company: 'Northwind Ledger',
    caseStudy: 'northwind-ledger-dashboard-rebuild',
  },
  {
    quote: 'They said no to three of our favourite ideas and were right every time. That is what you are paying for — judgement, not just hands.',
    name: 'Marcus Oduya',
    title: 'Founder',
    company: 'Pylon Health',
    caseStudy: 'pylon-health-telehealth-flow',
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
  {
    quote: 'We asked for a booking widget. They asked why our Fridays looked the way they did. The answer ended up being the product.',
    name: 'Astrid Kwan',
    title: 'Director of Operations',
    company: 'Fernleigh',
    caseStudy: 'fernleigh-wines-dtc-storefront',
  },
  {
    quote: 'Half the agencies we met wanted a bigger feature list. Brassfern wanted a smaller one, shipped sooner. The site pays for itself every January.',
    name: 'Rowan Pillay',
    title: 'Head of Digital',
    company: 'Brightmarsh',
    caseStudy: 'brightmarsh-onboarding',
  },
  {
    quote: 'Our grandmothers complained about the website. The new one, they use. That is the whole review.',
    name: 'Vince Catalano',
    title: 'Third-generation owner',
    company: 'Tallow & Co.',
    caseStudy: 'tallow-and-co-providore',
  },
  {
    quote: 'They treated our waiting list like a product, not a marketing asset. Bookings went up and the phone finally went quiet.',
    name: 'Sylvie Moreau',
    title: 'Co-owner',
    company: 'Wattle & Daub',
    caseStudy: 'wattle-and-daub-reservations',
  },
  {
    quote: 'A mutual bank cannot look clever and get trust wrong. Brassfern made us legible without making us boring.',
    name: 'Dieter Amundsen',
    title: 'Chief Experience Officer',
    company: 'Copperline Mutual',
    caseStudy: 'copperline-community-bank',
  },
  {
    quote: 'Subscription was the plan we had failed to ship twice. Brassfern shipped it in nine weeks and our churn curve bent the right way.',
    name: 'Greta Salim',
    title: 'Head of E-commerce',
    company: 'Hearthbrew Coffee',
    caseStudy: 'hearthbrew-subscription-club',
  },
  {
    quote: 'They built the configurator our customers play with for eleven minutes at a time. Then they buy the pack they designed.',
    name: 'Ewan Quill',
    title: 'Product Director',
    company: 'Osprey Outdoor',
    caseStudy: 'osprey-outdoor-configurator-launch',
  },
  {
    quote: 'Every supplier audit used to be a PDF treasure hunt. Now the answer is on the product page, and so is our conscience.',
    name: 'Nadia Ferreira',
    title: 'Founder',
    company: 'GLADE',
    caseStudy: 'glade-skincare-ingredient-honesty',
  },
]
