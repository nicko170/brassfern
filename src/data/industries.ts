export interface Industry {
  slug: string
  name: string
  blurb: string
  focus: string[]
}

export const industries: Industry[] = [
  {
    slug: 'fintech',
    name: 'Fintech',
    blurb: 'Trust is the interface. We design ledgers, dashboards and onboarding flows where clarity is a compliance feature, not a courtesy.',
    focus: ['Onboarding & KYC flows', 'Data-dense dashboards', 'Design systems at scale', 'Performance under regulation'],
  },
  {
    slug: 'health',
    name: 'Health',
    blurb: 'Calm software for anxious moments. Telehealth, patient portals and clinical tools designed around accessibility and plain language.',
    focus: ['Telehealth journeys', 'Accessible by default', 'Booking & triage UX', 'Privacy-first architecture'],
  },
  {
    slug: 'retail',
    name: 'Retail & e-commerce',
    blurb: 'Storefronts that respect the scroll. Merchandising, speed and checkout flows tuned like a race engine.',
    focus: ['Headless storefronts', 'Conversion research', 'Subscriptions & loyalty', 'Site speed as revenue'],
  },
  {
    slug: 'hospitality',
    name: 'Hospitality',
    blurb: 'Bookings, menus and brand worlds for places people love. We make the website feel like the room.',
    focus: ['Reservation flows', 'Menu & editorial design', 'Venue brand identity', 'Local SEO that fills tables'],
  },
  {
    slug: 'climate',
    name: 'Climate',
    blurb: 'Data that moves people. Explorers, reports and products that turn atmospheric numbers into decisions.',
    focus: ['Data visualisation', 'Scrollytelling reports', 'Grant-ready web presence', 'Open-data platforms'],
  },
  {
    slug: 'education',
    name: 'Education',
    blurb: 'Learning products that hold attention honestly. Onboarding, curriculum UX and content platforms for curious minds.',
    focus: ['Learner onboarding', 'Course & content platforms', 'Progress & motivation UX', 'Accessibility in learning'],
  },
  {
    slug: 'media',
    name: 'Media & culture',
    blurb: 'Editorial platforms with a point of view. Memberships, archives and reading experiences worth paying for.',
    focus: ['Editorial CMS', 'Membership & paywall UX', 'Archive design', 'Audio & video experiences'],
  },
  {
    slug: 'saas',
    name: 'SaaS',
    blurb: 'From first landing page to enterprise dashboard. We build the product and the machine that sells it.',
    focus: ['Product design systems', 'Marketing site + funnel', 'Activation & onboarding', 'Pricing & packaging'],
  },
  {
    slug: 'non-profit',
    name: 'Non-profit',
    blurb: 'Small budgets, real stakes. Donation flows, campaign sites and storytelling that treats every dollar like it matters — because it does.',
    focus: ['Donation UX', 'Campaign microsites', 'Impact storytelling', 'Volunteer platforms'],
  },
]

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug)
}
