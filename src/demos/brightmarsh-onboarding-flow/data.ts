/**
 * Brightmarsh catalogue — 12 fictional short courses, 6 learner goals.
 * All tutors and stats are invented for the demo.
 */

export interface Goal {
  id: string
  title: string
  blurb: string
  /** key into the Icon component in index.tsx */
  icon: 'compass' | 'sigma' | 'pen' | 'mic' | 'rocket' | 'map'
}

export interface Course {
  id: string
  title: string
  level: 'Foundations' | 'Intermediate' | 'Advanced'
  hours: number
  lessons: number
  goals: string[]
  blurb: string
  tutor: string
  note: string
}

export const GOALS: Goal[] = [
  {
    id: 'lead',
    title: 'Lead people well',
    blurb: 'First manager gig or tenth — the wardrobe never comes with instructions.',
    icon: 'compass',
  },
  {
    id: 'numbers',
    title: 'Make friends with numbers',
    blurb: 'Spreadsheets, pricing, P&Ls. Panic strictly optional.',
    icon: 'sigma',
  },
  {
    id: 'write',
    title: 'Write so people read it',
    blurb: 'Emails, docs and decks that survive the skim.',
    icon: 'pen',
  },
  {
    id: 'speak',
    title: 'Speak up in rooms',
    blurb: "Meetings, panels and the terrifying 'any questions?'.",
    icon: 'mic',
  },
  {
    id: 'make',
    title: 'Ship creative work',
    blurb: 'Finish things. On a deadline. More than once.',
    icon: 'rocket',
  },
  {
    id: 'career',
    title: 'Plot the next move',
    blurb: 'Side projects, pivots and carefully mislabelled second acts.',
    icon: 'map',
  },
]

export const COURSES: Course[] = [
  {
    id: 'first-ninety',
    title: 'The First 90 Days of Managing',
    level: 'Intermediate',
    hours: 6,
    lessons: 9,
    goals: ['lead'],
    blurb: 'Nobody hands you the manual. This is the manual: 1:1s, feedback, and not becoming the boss you swore you\'d never be.',
    tutor: 'Celia Onwu',
    note: 'Most-taken course on Brightmarsh',
  },
  {
    id: 'difficult-conversations',
    title: 'Difficult Conversations, Kinder Outcomes',
    level: 'Foundations',
    hours: 4,
    lessons: 6,
    goals: ['lead', 'speak'],
    blurb: 'Working scripts for the meetings you rehearse in the shower — and how to stop rehearsing and have them.',
    tutor: 'Theo Lindqvist',
    note: 'Includes 12 word-for-word openers',
  },
  {
    id: 'meetings-worth-having',
    title: 'Meetings People Don\'t Dread',
    level: 'Foundations',
    hours: 4,
    lessons: 5,
    goals: ['lead'],
    blurb: 'Agendas that fit on a sticky note, endings that end, and the radical act of the 25-minute slot.',
    tutor: 'Casimir Doyle',
    note: 'Pairs dangerously well with a calendar audit',
  },
  {
    id: 'spreadsheet-literacy',
    title: 'Spreadsheet Literacy for the Spreadsheet-Wary',
    level: 'Foundations',
    hours: 5,
    lessons: 8,
    goals: ['numbers'],
    blurb: 'From "where do I click" to lookups that hold, without the macho keyboard-shortcut culture.',
    tutor: 'Wren Bickford',
    note: 'Assumes zero formulas, zero shame',
  },
  {
    id: 'p-and-l',
    title: 'Reading a P&L Without Panicking',
    level: 'Intermediate',
    hours: 6,
    lessons: 8,
    goals: ['numbers', 'career'],
    blurb: 'The three lines that matter, what "EBITDA" is hiding, and where bodies get buried in the notes.',
    tutor: 'Marguerite Ash',
    note: 'Includes four real-feeling sample ledgers',
  },
  {
    id: 'pricing-your-work',
    title: 'Pricing Your Work',
    level: 'Intermediate',
    hours: 4,
    lessons: 6,
    goals: ['numbers', 'make'],
    blurb: 'Stop charging by the vibe. Cost floors, value anchors and the sentence that raises your rate.',
    tutor: 'Petra Solano',
    note: 'Most finishers recoup the fee with one invoice',
  },
  {
    id: 'writing-that-gets-read',
    title: 'Writing That Gets Read',
    level: 'Foundations',
    hours: 5,
    lessons: 7,
    goals: ['write'],
    blurb: 'Plain words, strong verbs, one idea per sentence — mostly. The unglamorous habits that carry the load.',
    tutor: 'Roman Quill',
    note: 'You will rewrite your outbox in week two',
  },
  {
    id: 'the-editing-pass',
    title: 'The Editing Pass',
    level: 'Intermediate',
    hours: 4,
    lessons: 6,
    goals: ['write'],
    blurb: 'A ruthless second look: structure first, rhythm second, and killing darlings without a funeral.',
    tutor: 'Inga Moreau',
    note: 'Bring 800 words of your own to butcher',
  },
  {
    id: 'presenting-unslid',
    title: 'Presenting Without Hiding Behind Slides',
    level: 'Intermediate',
    hours: 6,
    lessons: 8,
    goals: ['speak'],
    blurb: 'Build a talk you can deliver from three index cards — then add slides only where they earn their keep.',
    tutor: 'Yuki Herrera',
    note: 'Two recorded practice reps included',
  },
  {
    id: 'voice-in-the-room',
    title: 'Finding Your Voice in the Room',
    level: 'Foundations',
    hours: 4,
    lessons: 6,
    goals: ['speak', 'lead'],
    blurb: 'Interrupting gracefully, disagreeing usefully, and finishing your own sentences for a change.',
    tutor: 'Odette Kim',
    note: 'Quiet people report the biggest gains',
  },
  {
    id: 'shipping-creative',
    title: 'Shipping Creative Work on a Deadline',
    level: 'Advanced',
    hours: 7,
    lessons: 9,
    goals: ['make'],
    blurb: 'Constraint as co-author. Finish the thing, then make it good — in that order, every time.',
    tutor: 'Silas Beaumont',
    note: 'Week five is deliberately uncomfortable',
  },
  {
    id: 'side-project-february',
    title: 'A Side Project That Survives February',
    level: 'Foundations',
    hours: 5,
    lessons: 7,
    goals: ['career', 'make'],
    blurb: 'Ideas are cheap in January. Small scopes, honest cadences, and systems that survive your enthusiasm.',
    tutor: 'Augusta Te Rangi',
    note: 'Starts with killing your second-best idea',
  },
]
