export interface ServiceFaq {
  q: string
  a: string
}
export interface ServiceStep {
  title: string
  text: string
}
export interface Service {
  slug: string
  num: string
  name: string
  tagline: string
  description: string
  deliverables: string[]
  process: ServiceStep[]
  faqs: ServiceFaq[]
}

export const services: Service[] = [
  {
    slug: 'brand-identity',
    num: '01',
    name: 'Brand & identity',
    tagline: 'Brands with a pulse, built to flex across every surface.',
    description:
      'Strategy first, then a visual and verbal system that survives contact with the real world — from a favicon to a freeway billboard. We name, design, write and systematise identities that engineering teams can actually ship.',
    deliverables: [
      'Brand strategy & positioning',
      'Naming & verbal identity',
      'Logo systems & art direction',
      'Motion principles & kinetic identity',
      'Design tokens & component-ready brand kits',
      'Brand guidelines people actually read',
    ],
    process: [
      { title: 'Listen', text: 'Stakeholder interviews, audience research, competitive teardown. We find the one true thing worth amplifying.' },
      { title: 'Define', text: 'Positioning, personality and voice — written down in plain language, tested against real scenarios.' },
      { title: 'Design', text: 'Identity systems explored in context: the product UI, the pitch deck, the packaging — never just a logo sheet.' },
      { title: 'Systemise', text: 'Tokens, templates, motion specs and a living guideline site, so the brand stays sharp after we leave.' },
    ],
    faqs: [
      { q: 'How long does a rebrand take?', a: 'A focused identity sprint runs 6–8 weeks. Full rebrands with naming, rollout assets and a design-system handoff typically run 12–16 weeks.' },
      { q: 'Do you hand over source files?', a: 'Everything. Figma libraries, token JSON, type licences guidance, motion prototypes — organised so your team can run without us.' },
      { q: 'Can you work with our in-house team?', a: 'That is our favourite shape. We often co-design with internal designers and hand over a system they own outright.' },
    ],
  },
  {
    slug: 'websites',
    num: '02',
    name: 'Websites',
    tagline: 'Marketing sites that load fast, read well and convert.',
    description:
      'We design and build editorial-grade marketing sites on headless stacks. Performance is a feature, type is a weapon, and every page is measured against a business outcome — not just a moodboard.',
    deliverables: [
      'Site strategy & information architecture',
      'Editorial art direction & type systems',
      'Headless CMS setup & content models',
      'Core Web Vitals-obsessed front-end builds',
      'SEO foundations: schema, sitemaps, migrations',
      'Analytics & experimentation wiring',
    ],
    process: [
      { title: 'Map', text: 'Audiences, journeys, content inventory. We kill pages before we design them.' },
      { title: 'Write & sketch', text: 'Copy and layout evolve together — words first, because the web is still mostly reading.' },
      { title: 'Build', text: 'A component library with tokens, motion and CMS blocks, shipped incrementally behind feature flags.' },
      { title: 'Tune', text: 'Vitals budgets, accessibility audit, SEO checks and a 30-day post-launch iteration window.' },
    ],
    faqs: [
      { q: 'Which CMS do you recommend?', a: 'We are stack-agnostic but opinionated: Sanity, Contentful and Payload are our usual picks. We choose based on your editors, not our preferences.' },
      { q: 'How fast is fast?', a: 'We budget for LCP under 2.0s on 4G mid-tier hardware and hold it in CI. Most of our sites land comfortably in the green.' },
      { q: 'Can you migrate our existing site without hurting SEO?', a: 'Yes — redirect maps, canonical strategy, structured data parity and pre/post-launch crawl comparisons are standard in every migration.' },
    ],
  },
  {
    slug: 'product',
    num: '03',
    name: 'Product design & engineering',
    tagline: 'Web apps and SaaS products, designed and built by one squad.',
    description:
      'Dashboards, workflows, mobile apps and the design systems beneath them. One senior squad designs and engineers together, so nothing is lost between a Figma frame and a production deploy.',
    deliverables: [
      'Product strategy & scope definition',
      'UX research & prototype testing',
      'UI design & design systems',
      'React / React Native / TypeScript engineering',
      'Node & Postgres architecture',
      'Accessibility to WCAG AA and beyond',
    ],
    process: [
      { title: 'Frame', text: 'Jobs-to-be-done interviews and a ruthless scope cut. We decide what not to build first.' },
      { title: 'Prototype', text: 'Clickable, instrumented prototypes tested with real users before a line of production code.' },
      { title: 'Ship weekly', text: 'Fixed-scope sprints with a demo every Friday. You see the product grow, not a status deck.' },
      { title: 'Harden', text: 'Performance passes, a11y audits, error budgets and observability before we call it done.' },
    ],
    faqs: [
      { q: 'Do you take over existing codebases?', a: 'Often. We start with a technical audit, stabilise the riskiest seams, then rebuild incrementally rather than rewriting.' },
      { q: 'Who owns the code?', a: 'You do — full repo access, CI/CD in your accounts, and documentation from day one. No lock-in, ever.' },
      { q: 'How senior is the squad?', a: 'A typical squad is 3–5 people: a design lead, two senior engineers and a producer. No juniors learning on your budget.' },
    ],
  },
  {
    slug: 'ecommerce',
    num: '04',
    name: 'E-commerce',
    tagline: 'Headless storefronts where every pixel sells.',
    description:
      'Storefronts, subscriptions and checkout flows engineered around conversion. We blend merchandising craft with hard performance work, because a one-second delay is a revenue line, not a vanity metric.',
    deliverables: [
      'Headless storefront design & build',
      'PDP, PLP & merchandising systems',
      'Checkout & subscription optimisation',
      'Conversion research & A/B testing',
      'Loyalty, bundling & lifecycle hooks',
      'Composable stack integration (commerce, search, CMS)',
    ],
    process: [
      { title: 'Audit', text: 'Funnel analytics, session replay and speed profiling. We find where money leaks before designing anything.' },
      { title: 'Design the money pages', text: 'PDPs and checkout first — the pages closest to revenue — then the brand experience around them.' },
      { title: 'Build & integrate', text: 'Headless build with your commerce engine, search, reviews, subscriptions and email stack wired in.' },
      { title: 'Experiment', text: 'A prioritised testing backlog with clearly instrumented hypotheses, run with you post-launch.' },
    ],
    faqs: [
      { q: 'Shopify or fully headless?', a: 'Both, depending on scale. We build Hydrogen storefronts, headless builds on commerce APIs, and optimised themes when that is the honest answer.' },
      { q: 'Can you prove conversion impact?', a: 'Every engagement defines a measurement plan up front. Metrics we publish are illustrative here, but your dashboards are real.' },
      { q: 'Do you handle subscriptions?', a: 'Yes — subscribe-and-save UX, dunning flows, customer portals and the retention email journeys behind them.' },
    ],
  },
  {
    slug: 'ai',
    num: '05',
    name: 'AI products',
    tagline: 'LLM features that earn user trust — and keep it.',
    description:
      'We design and ship AI features end to end: retrieval, agents, evaluation and the interface craft that makes automation feel trustworthy. Prototypes in days, production systems with evals and guardrails.',
    deliverables: [
      'AI opportunity & feasibility mapping',
      'RAG pipelines & knowledge architecture',
      'Agent & copilot UX design',
      'Evaluation harnesses & quality dashboards',
      'Guardrails, red-teaming & responsible-AI reviews',
      'Cost & latency engineering',
    ],
    process: [
      { title: 'Prove value small', text: 'A thin-slice prototype against real data in week one. If the demo does not impress, we stop.' },
      { title: 'Instrument everything', text: 'Evals, traces and feedback loops wired before launch — quality you can graph, not vibes.' },
      { title: 'Design for doubt', text: 'Citations, confidence cues, undo paths. Users should always know what the machine did and why.' },
      { title: 'Harden & hand over', text: 'Cost ceilings, fallbacks, prompt libraries and playbooks your team can operate.' },
    ],
    faqs: [
      { q: 'Which models do you use?', a: 'Whatever fits the job and budget — frontier APIs, open-weight models, or hybrids. We benchmark on your data before recommending.' },
      { q: 'How do you measure quality?', a: 'Task-specific eval suites: golden datasets, rubric graders and human review loops, tracked per release like unit tests.' },
      { q: 'Is our data safe?', a: 'We design around your constraints: no-training APIs, VPC deployments, redaction layers — and we write the architecture down clearly.' },
    ],
  },
  {
    slug: 'growth',
    num: '06',
    name: 'Growth',
    tagline: 'Compounding channels, honest dashboards, no vanity metrics.',
    description:
      'SEO, content, CRO, lifecycle and paid — run as one system. We find the loops that compound for your product, instrument them properly, and report in revenue rather than impressions.',
    deliverables: [
      'Growth audits & measurement plans',
      'Technical SEO & content engines',
      'CRO research & experiment programs',
      'Lifecycle & email systems',
      'Performance marketing creative & ops',
      'Analytics stacks & leadership dashboards',
    ],
    process: [
      { title: 'Instrument', text: 'Tracking audit and a measurement plan. Decisions get better the day the data gets honest.' },
      { title: 'Find the loop', text: 'We model your funnel, find the constraint, and pick channels where effort compounds.' },
      { title: 'Ship experiments', text: 'Weekly experiment cadence with pre-registered hypotheses and kill criteria.' },
      { title: 'Compound', text: 'Winners become systems: templates, playbooks and automations your team can run.' },
    ],
    faqs: [
      { q: 'Retainer or project?', a: 'Growth works on rhythm, so most engagements are quarterly retainers with a weekly experiment cadence. Audits and setups are fixed-scope projects.' },
      { q: 'How do you report?', a: 'A live dashboard plus a weekly one-pager: what we shipped, what moved, what we learned, what is next. No 40-slide decks.' },
      { q: 'Do you write the content too?', a: 'Yes — our writers pair with strategists. Content without distribution is a diary; we build both.' },
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
