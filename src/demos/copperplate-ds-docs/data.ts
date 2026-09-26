/**
 * Copperplate DS — editorial content. Nav, specimens, guidance, changelog.
 * Copperplate is a fictional observability-tooling company; this data makes
 * the docs feel like a system with history and opinions.
 */

export interface PageMeta {
  id: string
  section: string
  no: string
  title: string
  lede: string
  keywords: string[]
  bare?: boolean
}

export const SECTIONS = ['Foundations', 'Tokens', 'Components', 'Patterns'] as const

export const PAGES: PageMeta[] = [
  {
    id: 'overview',
    section: 'Foundations',
    no: '§ 0',
    title: 'Copperplate DS',
    lede:
      'The design system for Copperplate’s observability products — tokens, components and the opinions that bind them, documented as live plates.',
    keywords: ['home', 'intro', 'specimen', 'principles', 'changelog', 'version'],
    bare: true,
  },
  {
    id: 'colour',
    section: 'Foundations',
    no: '§ 1.1',
    title: 'Colour',
    lede:
      'Six hues, no more. Copper does the talking, verdigris and clay tell the truth, and every legal pairing is printed with its contrast ratio.',
    keywords: ['palette', 'swatch', 'contrast', 'wcag', 'copper', 'verdigris', 'clay', 'night'],
  },
  {
    id: 'typography',
    section: 'Foundations',
    no: '§ 1.2',
    title: 'Typography',
    lede:
      'A serif with plates under its nails for display, a system sans for the coalface. One scale, honest measures, no orphan heading sizes.',
    keywords: ['type', 'scale', 'serif', 'font', 'heading', 'measure', 'line height'],
  },
  {
    id: 'iconography',
    section: 'Foundations',
    no: '§ 1.3',
    title: 'Iconography',
    lede:
      'Twenty-four glyphs cut on one plate: 24×24, 1.5px stroke, round caps, no fills. Search them, copy their names, draw no more.',
    keywords: ['icons', 'glyphs', 'library', 'stroke', 'svg', 'pictogram'],
  },
  {
    id: 'playground',
    section: 'Tokens',
    no: '§ 2.1',
    title: 'Token playground',
    lede:
      'Edit the tokens. Eight citizens of the system re-render instantly — not screenshots, the real components. Then take the CSS home.',
    keywords: ['tokens', 'playground', 'theme', 'customise', 'css variables', 'export', 'copy'],
  },
  {
    id: 'reference',
    section: 'Tokens',
    no: '§ 2.2',
    title: 'Token reference',
    lede:
      'Every token, its value and its job, printed with your playground overrides applied. If a value isn’t here, it isn’t a token.',
    keywords: ['tokens', 'table', 'spacing', 'radius', 'scale', 'values', 'reference'],
  },
  {
    id: 'buttons',
    section: 'Components',
    no: '§ 3.1',
    title: 'Buttons',
    lede:
      'One primary per view, verbs not vague nouns, and a disabled state that explains itself. The five button styles we retired are not missed.',
    keywords: ['button', 'cta', 'primary', 'ghost', 'danger', 'click', 'action'],
  },
  {
    id: 'forms',
    section: 'Components',
    no: '§ 3.2',
    title: 'Form controls',
    lede:
      'Labels always visible, errors that name the fix, and placeholders that know their place. Forms are where trust is won or quietly lost.',
    keywords: ['input', 'field', 'label', 'error', 'validation', 'select', 'checkbox', 'form'],
  },
  {
    id: 'alerts',
    section: 'Components',
    no: '§ 3.3',
    title: 'Alerts',
    lede:
      'Four tones, each with a job. An alert that doesn’t tell you what to do next is just anxiety with a border-radius.',
    keywords: ['alert', 'toast', 'banner', 'error', 'success', 'warning', 'message', 'status'],
  },
  {
    id: 'cards',
    section: 'Components',
    no: '§ 3.4',
    title: 'Cards',
    lede:
      'A card is an index card, not a junk drawer: one subject, one action. If it needs two headlines, it needs to be two cards.',
    keywords: ['card', 'panel', 'tile', 'container', 'link card'],
  },
  {
    id: 'badges',
    section: 'Components',
    no: '§ 3.5',
    title: 'Badges',
    lede:
      'Status words, not decoration. A badge is read, not admired — and it never carries meaning by colour alone.',
    keywords: ['badge', 'tag', 'status', 'label', 'pill', 'chip'],
  },
  {
    id: 'tabs',
    section: 'Components',
    no: '§ 3.6',
    title: 'Tabs',
    lede:
      'Tabs switch between siblings, not strangers. Arrow keys roam, panels stay put, and nobody hides critical content in tab three.',
    keywords: ['tabs', 'tablist', 'panels', 'navigation', 'keyboard'],
  },
  {
    id: 'choosing',
    section: 'Patterns',
    no: '§ 4.1',
    title: 'Which component when',
    lede:
      'The part of a design system that actually gets read at 5pm on a deadline: a decision table, not a parts bin.',
    keywords: ['decision', 'chooser', 'modal', 'drawer', 'toast', 'when to use', 'guidance'],
  },
  {
    id: 'do-dont',
    section: 'Patterns',
    no: '§ 4.2',
    title: 'The do/don’t plates',
    lede:
      'Abstract rules get ignored; concrete pairs get remembered. The gallery we point to in review when taste alone won’t settle it.',
    keywords: ['do', 'dont', 'comparison', 'rules', 'gallery', 'examples', 'review'],
  },
]

export const pagesBySection = (section: string) => PAGES.filter((p) => p.section === section)

export const getPage = (id: string) => PAGES.find((p) => p.id === id) ?? PAGES[0]

/* --- palette specimens ----------------------------------------------------- */

export interface Swatch {
  name: string
  token: string
  hex: string
  nightHex: string
  note: string
}

export const PALETTE: Swatch[] = [
  { name: 'Ink', token: '--cp-ink', hex: '#2a2118', nightHex: '#ecdfc6', note: 'Text and ruling lines. Warm black — cold greys were banned in v3.' },
  { name: 'Bone', token: '--cp-paper', hex: '#f6efe0', nightHex: '#1c1611', note: 'The page. Everything prints on bone or not at all.' },
  { name: 'Copper', token: '--cp-accent', hex: '#a85b28', nightHex: '#d69352', note: 'One accent. Actions, focus rings, the rare flourish.' },
  { name: 'Copper ink', token: '--cp-accent-ink', hex: '#fff6e8', nightHex: '#241505', note: 'The only text allowed to sit on copper.' },
  { name: 'Verdigris', token: '--cp-success', hex: '#4d7263', nightHex: '#8fb8a2', note: 'Healthy, shipped, resolved. The patina copper earns.' },
  { name: 'Clay', token: '--cp-danger', hex: '#a33f20', nightHex: '#e08a63', note: 'Broken, destructive, late. Used sparingly enough to sting.' },
]

export interface Pair {
  fg: string
  fgHex: string
  bg: string
  bgHex: string
  use: string
}

export const PAIRS: Pair[] = [
  { fg: 'Ink', fgHex: '#2a2118', bg: 'Bone', bgHex: '#f6efe0', use: 'Body copy, headings' },
  { fg: 'Copper ink', fgHex: '#fff6e8', bg: 'Copper', bgHex: '#a85b28', use: 'Primary buttons, focus chips' },
  { fg: 'Copper', fgHex: '#a85b28', bg: 'Bone', bgHex: '#f6efe0', use: 'Links and accents at 18px+' },
  { fg: 'Verdigris', fgHex: '#4d7263', bg: 'Bone', bgHex: '#f6efe0', use: 'Success copy, resolved states' },
  { fg: 'Clay', fgHex: '#a33f20', bg: 'Bone', bgHex: '#f6efe0', use: 'Errors, destructive labels' },
  { fg: 'Bone', fgHex: '#f6efe0', bg: 'Ink', bgHex: '#2a2118', use: 'Night plates, inverted cards' },
]

/* --- type scale specimen ----------------------------------------------------- */

export const TYPE_SPECIMEN: Record<string, string> = {
  caption: 'Latency p99 · 214 ms · eu-west',
  body: 'Every plate on this site renders live.',
  lead: 'The system is the documentation.',
  'heading 3': 'Ruling lines, not boxes',
  'heading 2': 'Decisions, not parts',
  'heading 1': 'Etched in copper',
}

/* --- changelog ---------------------------------------------------------------- */

export const CHANGELOG = [
  { v: 'v4.2', date: 'Sep 2026', note: 'Radius moved 4px → 6px. Nobody mourned. Alerts gained an explicit live-region note.' },
  { v: 'v4.1', date: 'Jul 2026', note: 'Tabs learned arrow keys. The docs you are reading replaced a Notion page called “DRAFT v2”.' },
  { v: 'v4.0', date: 'Apr 2026', note: 'Tokens became CSS custom properties. The great px purge: 61 hard-coded values retired.' },
  { v: 'v3.3', date: 'Jan 2026', note: 'Cold greys banned. Ink warmed. Verdigris promoted from “nice” to “semantic”.' },
]

/* --- component guidance ------------------------------------------------------- */

export const GUIDANCE: Record<
  string,
  { usage: string[]; a11y: string[]; snippet: string; snippetLang?: string }
> = {
  buttons: {
    usage: [
      'Primary: the one action the view exists for. One per view — two primaries is a design review incident.',
      'Ghost: the respectable alternative — “View logs” beside “Deploy now”.',
      'Quiet: tertiary, table rows, anywhere a full button would shout.',
      'Danger: destructive actions only, and never the default focus.',
    ],
    a11y: [
      'Labels are verbs with objects — “Save dashboard”, never “Click here” or an icon alone.',
      'Focus is a 2px copper ring offset by 2px; it survives every background in the legal pairings table.',
      'Disabled buttons stay in the tab order story via aria-disabled in form flows, with the reason nearby.',
      'Hit area never drops below 40×40px, whatever the label length.',
    ],
    snippet: `<button class="cp-btn">Deploy to production</button>

<button class="cp-btn cp-btn--ghost">View logs</button>

<button class="cp-btn cp-btn--quiet">Dismiss</button>

<button class="cp-btn cp-btn--danger">Delete service</button>

<!-- Disabled states explain themselves nearby -->
<button class="cp-btn" disabled>Deploy to production</button>`,
  },
  forms: {
    usage: [
      'One label per control, always visible — placeholders are hints, never labels.',
      'Hints go under the label; errors replace hints and name the fix.',
      'Group related fields on one line only when the pairing is obvious (city + postcode).',
      'Validate on blur, not per keystroke. Nobody needs a red border mid-thought.',
    ],
    a11y: [
      'Every control is tied to its label with for/id — no wrapping-only associations.',
      'Errors use role="alert" and are linked with aria-describedby alongside the hint.',
      'Required fields say so in the label text, not an asterisk alone.',
      'Error colour is never the only signal — the message does the work.',
    ],
    snippet: `<div class="cp-field">
  <label class="cp-label" for="svc">Service name</label>
  <input class="cp-input" id="svc" aria-describedby="svc-hint">
  <p class="cp-note" id="svc-hint">Lowercase, hyphens, no mercy.</p>
</div>

<div class="cp-field cp-field--error">
  <label class="cp-label" for="email">Alert email</label>
  <input class="cp-input" id="email" aria-describedby="email-error"
         value="oncall@copperplate">
  <p class="cp-note cp-note--error" id="email-error" role="alert">
    Add a domain — “oncall@copperplate.io”.
  </p>
</div>`,
  },
  alerts: {
    usage: [
      'Info: context without urgency. “EU region is in maintenance Saturday.”',
      'Success: confirmation, then get out of the way — dismissible always.',
      'Warning: something will bite later. Say when and what to do.',
      'Danger: something is on fire now. Name the fire, name the extinguisher.',
    ],
    a11y: [
      'Success and info render role="status"; danger renders role="alert" so it interrupts.',
      'Never stack more than one live region per view — queue them instead.',
      'Dismiss buttons carry an aria-label naming the alert they close.',
      'Colour is backed by icon and tone word; a greyscale print still reads.',
    ],
    snippet: `<div class="cp-alert cp-alert--success" role="status">
  <p class="cp-alert__title">Deploy finished</p>
  <p>api-gateway is live in 3 regions · 42 s</p>
</div>

<div class="cp-alert cp-alert--danger" role="alert">
  <p class="cp-alert__title">Error budget exhausted</p>
  <p>checkout-api burned 98% of its budget. Freeze
     deploys or widen the window — then tell #incidents.</p>
</div>`,
  },
  cards: {
    usage: [
      'One subject per card: a service, a dashboard, an alert rule.',
      'Eyebrow for kind (“Service · 3 regions”), headline for the thing, one footer action.',
      'Interactive cards are one link — never a card full of tiny buttons.',
      'Six across is a dashboard; twenty across is a cry for filtering.',
    ],
    a11y: [
      'Interactive cards are a single <button> or link — the whole surface, one stop in the tab order.',
      'The arrow affordance is aria-hidden; the title carries the meaning.',
      'Status badges inside cards keep their words (“degraded”), not just their colour.',
      'Focus ring wraps the entire card, not an inner element.',
    ],
    snippet: `<a class="cp-card cp-card--interactive" href="/services/api-gateway">
  <p class="cp-card__eyebrow">Service · 3 regions</p>
  <h4 class="cp-card__title">api-gateway</h4>
  <p>p99 210 ms · error rate 0.02%</p>
  <span class="cp-badge cp-badge--success">Healthy</span>
</a>`,
  },
  badges: {
    usage: [
      'For status and kind: Healthy, Degraded, In maintenance, Retiring.',
      'Read-only. If it’s clickable, it’s a button wearing a costume.',
      'Pair with timestamps: “Degraded · 14 min” beats “Degraded”.',
      'Four tones exist. A fifth requires a design review and a good story.',
    ],
    a11y: [
      'Meaning rides on words, never colour alone — no bare dots.',
      'Contrast-checked against bone and ink plates; large-text AA minimum.',
      'Keep under 3 words; screen readers read every one of them, every row.',
      'In dense tables, badges replace icons-with-tooltips, which hide from keyboards.',
    ],
    snippet: `<span class="cp-badge cp-badge--success">Healthy</span>
<span class="cp-badge cp-badge--neutral">3 regions</span>
<span class="cp-badge cp-badge--accent">In maintenance</span>
<span class="cp-badge cp-badge--danger">Degraded · 14 min</span>`,
  },
  tabs: {
    usage: [
      'Tabs switch between peers: Overview, Metrics, Logs — same subject, different cuts.',
      'Three to five tabs, short labels, no icons without words.',
      'Never put the save button inside a tab panel. Panels are views, not flows.',
      'If the tabs feel like navigation, they’re navigation. Use the rail.',
    ],
    a11y: [
      'Full tablist semantics: role="tablist", aria-selected, aria-controls.',
      'Arrow keys roam between tabs, Home/End jump to the edges.',
      'Only the active tab is in the tab order — roving tabindex.',
      'Panels are labelled by their tab and focusable, so keyboard users can step in.',
    ],
    snippet: `<div class="cp-tabs">
  <div class="cp-tabs__list" role="tablist">
    <button role="tab" aria-selected="true"
            aria-controls="panel-metrics" id="tab-metrics">
      Metrics
    </button>
    <button role="tab" aria-selected="false" tabindex="-1"
            aria-controls="panel-logs" id="tab-logs">
      Logs
    </button>
  </div>
  <div role="tabpanel" id="panel-metrics"
       aria-labelledby="tab-metrics" tabindex="0">
    …
  </div>
</div>`,
  },
}

/* --- pattern pages ----------------------------------------------------------- */

export const DECISIONS = [
  {
    need: 'Confirm a destructive action',
    reach: 'Alert dialog',
    never: 'A toast you can’t undo, or a badge that says “oops”.',
  },
  {
    need: 'Announce something finished',
    reach: 'Alert (success, role="status")',
    never: 'A modal. Nobody should click “OK” to being told it worked.',
  },
  {
    need: 'Show one service three ways',
    reach: 'Tabs — Overview, Metrics, Logs',
    never: 'Three cards with the same headline and dawning horror.',
  },
  {
    need: 'Collect more than three fields',
    reach: 'A dedicated form view',
    never: 'A modal with a scroll bar. Modals are interruptions, not filing cabinets.',
  },
  {
    need: 'Let someone scan 200 services',
    reach: 'A table with filter + search',
    never: 'A card grid. Cards are for the six things that matter.',
  },
  {
    need: 'Flag that something is degrading',
    reach: 'Badge + timestamp, inline where it happened',
    never: 'Colour alone, or a banner on an unrelated page.',
  },
]

export const ICON_SPEC = [
  { k: 'Plate', v: '24 × 24' },
  { k: 'Stroke', v: '1.5 px' },
  { k: 'Caps', v: 'Round' },
  { k: 'Fill', v: 'None — dots only' },
  { k: 'Count', v: '24 glyphs' },
]
