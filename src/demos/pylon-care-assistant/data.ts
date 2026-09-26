/**
 * Pylon Care — scripted response bank, source library and prompts.
 * Everything here is fictional, deterministic and client-only. The "AI" is
 * honest about it: retrieval from a small help library, visible confidence,
 * citations, guardrails and a human handover — the responsible-AI patterns
 * Brassfern designed for Pylon Health.
 */

export interface Source {
  id: string
  kind: 'Help centre' | 'Policy' | 'Product doc'
  title: string
  section: string
  updated: string
  excerpt: string
}

export type AnswerBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }

export interface Topic {
  id: string
  intent: string
  /** lowercase trigger words/phrases; more weight = stronger match */
  keywords: string[]
  confidence: number
  blocks: AnswerBlock[]
  sourceIds: string[]
  followups: string[]
}

// ------------------------------------------------------------- sources

export const SOURCES: Source[] = [
  {
    id: 'hc-reschedule',
    kind: 'Help centre',
    title: 'Rescheduling or cancelling a video consult',
    section: 'Appointments · Managing your bookings',
    updated: 'Aug 2026',
    excerpt:
      'You can move or cancel any appointment from the Pylon app or the member portal up to 4 hours before it starts, at no cost. Within 4 hours, call the care team and we\'ll rebook you without a fee if the reason is illness or an emergency.',
  },
  {
    id: 'hc-reminders',
    kind: 'Help centre',
    title: 'Appointment reminders and preparation',
    section: 'Appointments · Getting ready',
    updated: 'Jun 2026',
    excerpt:
      'We text you 24 hours and 15 minutes before your consult. Ten minutes before, open the app and run the connection check — it tests your camera, mic and bandwidth in about 20 seconds.',
  },
  {
    id: 'hc-results',
    kind: 'Help centre',
    title: 'Where your test results live',
    section: 'Records · Results and letters',
    updated: 'Jul 2026',
    excerpt:
      'Pathology and imaging results appear in Results in the app once your practitioner has reviewed them — usually 1–3 business days after the lab processes them. Urgent results always trigger a phone call from the clinic, never just a notification.',
  },
  {
    id: 'hc-scripts',
    kind: 'Help centre',
    title: 'Repeat prescriptions (repeats)',
    section: 'Prescriptions · Repeats and delivery',
    updated: 'Sep 2026',
    excerpt:
      'Request a repeat from Prescriptions → Request repeat. Scripts issued by a Pylon practitioner are usually turned around within one business day; repeats from an external GP need a short consult first. eScripts go to your phone by SMS token, or we courier to partner pharmacies.',
  },
  {
    id: 'hc-billing',
    kind: 'Help centre',
    title: 'Fees, private billing and Medicare rebates',
    section: 'Billing · How Pylon charges',
    updated: 'Sep 2026',
    excerpt:
      'Video consults are privately billed and itemised before you book — the fee you see is the fee you pay. Where an item number applies, the Medicare rebate (usually $41.70 for a standard telehealth item) is claimed for you automatically and lands back in your account in 1–2 business days.',
  },
  {
    id: 'hc-refunds',
    kind: 'Help centre',
    title: 'Refunds and billing disputes',
    section: 'Billing · Getting money back',
    updated: 'May 2026',
    excerpt:
      'Cancel a consult more than 4 hours ahead and you\'re never charged. Anything wrong on an invoice, reply to it or message the care team — refunds are assessed within one business day and paid back to the original card within 5–10 business days.',
  },
  {
    id: 'hc-account',
    kind: 'Help centre',
    title: 'Sign-in problems and two-factor codes',
    section: 'Your account · Access',
    updated: 'Apr 2026',
    excerpt:
      'Sign-in links expire after 15 minutes. If your SMS code never arrives, check the number on your profile, then use "try a voice call instead". After five failed attempts the account locks for 10 minutes — it\'s protective, not punishing.',
  },
  {
    id: 'hc-access',
    kind: 'Help centre',
    title: 'Interpreters, captions and accessible consults',
    section: 'Appointments · Accessibility',
    updated: 'Mar 2026',
    excerpt:
      'Every video consult supports live captions at no cost. We book Auslan interpreters and TIS National spoken-language interpreters with 48 hours\' notice, free of charge. Relay users can reach the care team through the National Relay Service.',
  },
  {
    id: 'pol-privacy',
    kind: 'Policy',
    title: 'Privacy & your data — plain-English summary',
    section: 'Policies · Privacy v3.2',
    updated: 'Aug 2026',
    excerpt:
      'Chat transcripts are stored for 30 days so the care team can pick up where you left off, then deleted. Before anything is stored we strip numbers that look like Medicare numbers, card numbers and phone numbers. We never sell data and never use your health information to train models.',
  },
  {
    id: 'pol-ai',
    kind: 'Policy',
    title: 'How the Pylon Care assistant works',
    section: 'Policies · AI transparency',
    updated: 'Sep 2026',
    excerpt:
      'Pylon Care answers only from Pylon\'s reviewed help library — it does not browse the web and does not invent. It shows its confidence and its sources with every answer, it refuses to give medical advice, and one tap always reaches a human.',
  },
  {
    id: 'doc-telehealth',
    kind: 'Product doc',
    title: 'Video consult troubleshooting',
    section: 'Product · Connection quality',
    updated: 'Jul 2026',
    excerpt:
      'If video freezes, the consult drops back to audio-only automatically — the practitioner stays on. Under 1.5 Mbps we recommend turning your camera off; you need Chrome, Safari or the app. A consult that fails technically within 5 minutes is never billed.',
  },
  {
    id: 'doc-id',
    kind: 'Product doc',
    title: 'Verifying your identity for scripts and results',
    section: 'Product · Identity checks',
    updated: 'May 2026',
    excerpt:
      'Some actions — eScripts, result release, record downloads — require a one-time Medicare card check plus a photo ID. Verification takes about two minutes in the app and lasts 12 months.',
  },
]

export const getSource = (id: string) => SOURCES.find((s) => s.id === id)!

// ------------------------------------------------------------- topics

export const TOPICS: Topic[] = [
  {
    id: 'appointments',
    intent: 'Appointments',
    keywords: [
      'appointment', 'booking', 'book', 'reschedule', 'cancel', 'consult',
      'video call', 'move my', 'change my', 'slot', 'waitlist', 'running late',
      'how do i join', 'join the call',
    ],
    confidence: 0.93,
    blocks: [
      {
        kind: 'p',
        text: 'You can reschedule or cancel any video consult from the Pylon app or the member portal — Bookings → open the appointment → Reschedule. It\'s free up to 4 hours before start time. [1]',
      },
      {
        kind: 'ul',
        items: [
          'More than 4 hours out — move or cancel yourself, no fee, takes about 30 seconds. [1]',
          'Inside 4 hours — the app will ask you to call the care team; we rebook free for illness or emergencies. [1]',
          'Running late? Join anyway. Practitioners hold the room for 10 minutes, and a text at T-15 and T-24h keeps you honest. [2]',
        ],
      },
      {
        kind: 'p',
        text: 'If a consult fails technically inside the first 5 minutes, you\'re never billed for it. [3]',
      },
    ],
    sourceIds: ['hc-reschedule', 'hc-reminders', 'doc-telehealth'],
    followups: [
      'What happens if my video freezes?',
      'Where are my test results?',
      'How does Medicare billing work?',
    ],
  },
  {
    id: 'results',
    intent: 'Results & records',
    keywords: [
      'result', 'results', 'pathology', 'blood test', 'test', 'scan', 'xray',
      'x-ray', 'imaging', 'letter', 'referral letter', 'record', 'records',
      'download my', 'history',
    ],
    confidence: 0.91,
    blocks: [
      {
        kind: 'p',
        text: 'Results land in the app under Results, always after a practitioner has reviewed them — typically 1–3 business days after the lab finishes processing. You\'ll get a push notification and a text. [1]',
      },
      {
        kind: 'ul',
        items: [
          'Anything urgent triggers a phone call from the clinic — never just a notification. [1]',
          'Downloading records or releasing older results needs a one-time identity check (Medicare card + photo ID, about 2 minutes, valid 12 months). [2]',
          'Can\'t see something you were expecting? The lab may still be processing; after 5 business days, the care team can chase it for you.',
        ],
      },
    ],
    sourceIds: ['hc-results', 'doc-id'],
    followups: [
      'How do I verify my identity?',
      'Do you store my chat history?',
      'Can I get a repeat prescription?',
    ],
  },
  {
    id: 'prescriptions',
    intent: 'Prescriptions',
    keywords: [
      'prescription', 'script', 'repeat', 'medication', 'medicine', 'pharmacy',
      'escript', 'refill', 'pill', 'antibiotic',
    ],
    confidence: 0.9,
    blocks: [
      {
        kind: 'p',
        text: 'Repeats are the easy case: open Prescriptions → Request repeat, and a script your Pylon practitioner has already issued is usually turned around within one business day. [1]',
      },
      {
        kind: 'ul',
        items: [
          'eScripts arrive as an SMS token — show it to any pharmacy. [1]',
          'Courier to a partner pharmacy is available in metro areas, or the token works anywhere. [1]',
          'A repeat of a script from an external GP needs a short consult first — that\'s a safety rule, not a hoop. [1]',
          'Issuing or re-issuing a script requires your one-time identity check to be current. [2]',
        ],
      },
      {
        kind: 'p',
        text: 'Worth knowing: I can explain the process, but I can\'t advise on which medication or dose is right for you — that\'s a conversation with your practitioner.',
      },
    ],
    sourceIds: ['hc-scripts', 'doc-id'],
    followups: [
      'How do I book a consult for a repeat?',
      'What ID do I need to verify?',
      'Can I talk to a pharmacist?',
    ],
  },
  {
    id: 'billing',
    intent: 'Billing & Medicare',
    keywords: [
      'bill', 'billing', 'invoice', 'charge', 'charged', 'cost', 'fee', 'price',
      'medicare', 'rebate', 'refund', 'money back', 'bulk bill', 'payment',
      'receipt', 'insurance',
    ],
    confidence: 0.92,
    blocks: [
      {
        kind: 'p',
        text: 'Pylon video consults are privately billed, and the fee is itemised before you book — the number you see is the number you pay. There are no surprise extras afterwards. [1]',
      },
      {
        kind: 'ul',
        items: [
          'Where a Medicare item applies, we claim the rebate for you automatically — usually $41.70 for a standard telehealth item, back in your account in 1–2 business days. [1]',
          'Cancel more than 4 hours ahead and you\'re never charged. [2]',
          'Spot something wrong on an invoice? Reply to the invoice email or ask here — refunds are assessed within one business day and land back on the original card within 5–10 business days. [2]',
        ],
      },
    ],
    sourceIds: ['hc-billing', 'hc-refunds'],
    followups: [
      'Dispute a charge on my last invoice',
      'How do I cancel without a fee?',
      'Do you store my chat history?',
    ],
  },
  {
    id: 'account',
    intent: 'Account & sign-in',
    keywords: [
      'login', 'log in', 'sign in', 'password', 'locked', 'lock out', 'code',
      'verification code', '2fa', 'two-factor', 'sms code', 'email link',
      'update my details', 'change email', 'change phone',
    ],
    confidence: 0.88,
    blocks: [
      {
        kind: 'p',
        text: 'Most sign-in snags are one of three things — expired links, a stale phone number, or a protective lock. The fixes: [1]',
      },
      {
        kind: 'ul',
        items: [
          'Magic sign-in links expire after 15 minutes — request a fresh one rather than re-tapping the old one. [1]',
          'No SMS code? Confirm the number on your profile, then use "try a voice call instead". [1]',
          'Five failed attempts locks the account for 10 minutes. It lifts by itself; calling the care team can\'t unlock it faster. [1]',
        ],
      },
      {
        kind: 'p',
        text: 'To change the phone number or email on your account you\'ll need to be signed in on at least one device — otherwise it\'s a quick identity check with the care team.',
      },
    ],
    sourceIds: ['hc-account'],
    followups: [
      'How do I verify my identity?',
      'What do you do with my data?',
      'Talk to a human',
    ],
  },
  {
    id: 'identity',
    intent: 'Identity verification',
    keywords: [
      'verify', 'identity', 'id check', 'photo id', 'passport', 'licence',
      'medicare card', 'who i am', 'prove',
    ],
    confidence: 0.86,
    blocks: [
      {
        kind: 'p',
        text: 'Some actions — releasing results, issuing eScripts, downloading your record — ask for a one-time identity check. It\'s a Medicare card check plus a photo ID, done in the app in about two minutes, and it stays valid for 12 months. [1]',
      },
      {
        kind: 'p',
        text: 'Your ID documents are checked and then discarded from the queue — they\'re stored encrypted, access-logged, and never visible to support staff like me. [1]',
      },
    ],
    sourceIds: ['doc-id'],
    followups: [
      'Where are my test results?',
      'How do repeats work?',
      'Do you store my chat history?',
    ],
  },
  {
    id: 'privacy',
    intent: 'Privacy & data',
    keywords: [
      'privacy', 'data', 'store', 'stored', 'history', 'delete', 'deleted',
      'sold', 'sell my', 'train', 'model', 'ai', 'chatbot', 'who sees',
      'transcript', 'recordings', 'gdpr', 'secure', 'security', 'safe',
    ],
    confidence: 0.9,
    blocks: [
      {
        kind: 'p',
        text: 'Fair question — you should always ask it. This transcript is kept for 30 days so the care team can pick up where we left off, then it\'s deleted. Before anything is stored, numbers that look like Medicare, card or phone numbers are stripped automatically. [1]',
      },
      {
        kind: 'ul',
        items: [
          'Your data is never sold, and your health information is never used to train models. [1]',
          'I answer only from Pylon\'s reviewed help library — I don\'t browse the web, and I don\'t invent. [2]',
          'You can end this chat and wipe it early any time from the bin icon above. [1]',
        ],
      },
      {
        kind: 'p',
        text: 'Try it if you like: send me a made-up phone or Medicare number in your next message and watch the redaction note appear. That\'s the storage step happening in front of you.',
      },
    ],
    sourceIds: ['pol-privacy', 'pol-ai'],
    followups: [
      'How does this assistant actually work?',
      'Where are my test results?',
      'Talk to a human',
    ],
  },
  {
    id: 'how',
    intent: 'About this assistant',
    keywords: [
      'how do you work', 'how does this work', 'what are you', 'who are you',
      'are you ai', 'are you a bot', 'are you real', 'chatbot', 'robot',
      'what can you do', 'help', 'capabilities',
    ],
    confidence: 0.95,
    blocks: [
      {
        kind: 'p',
        text: 'Straight answers: I\'m Pylon Care, an assistant that retrieves from a small, human-reviewed library of Pylon help articles and policies. Every answer shows its confidence and the exact sources it drew from — no black box. [1]',
      },
      {
        kind: 'ul',
        items: [
          'I\'m good at: appointments, billing, results, prescriptions, account and privacy questions. [1]',
          'I won\'t: give medical advice, diagnose, or guess. For anything clinical, I\'ll help you book a human instead. [1]',
          'Low confidence? I\'ll say so and offer to hand you to the care team rather than bluff. [1]',
        ],
      },
      {
        kind: 'p',
        text: 'Humans are available 7am–10pm AEST, every day. One tap on "Talk to a person" and this transcript comes with you — no repeating yourself. [2]',
      },
    ],
    sourceIds: ['pol-ai', 'pol-privacy'],
    followups: [
      'What do you do with my data?',
      'How do I reschedule my consult?',
      'Talk to a person',
    ],
  },
  {
    id: 'accessibility',
    intent: 'Accessibility',
    keywords: [
      'interpreter', 'auslan', 'caption', 'captions', 'deaf', 'hearing',
      'blind', 'screen reader', 'tty', 'relay', 'language', 'translate',
      'accessible', 'disability', 'wheelchair',
    ],
    confidence: 0.89,
    blocks: [
      {
        kind: 'p',
        text: 'Every video consult has live captions built in, at no cost. For anything more, you book and we arrange it — no forms, no fees. [1]',
      },
      {
        kind: 'ul',
        items: [
          'Auslan interpreters and TIS National spoken-language interpreters: book 48 hours ahead, free. [1]',
          'National Relay Service users can reach the care team through their usual relay channel. [1]',
          'App and portal are tested against WCAG 2.2 AA — screen readers, full keyboard, 200% text zoom.',
        ],
      },
    ],
    sourceIds: ['hc-access'],
    followups: [
      'How do I book with an interpreter?',
      'What happens if my video freezes?',
      'Talk to a person',
    ],
  },
  {
    id: 'tech',
    intent: 'Connection & tech help',
    keywords: [
      'video freezes', 'frozen', 'freezing', 'bandwidth', 'internet', 'wifi',
      'camera', 'microphone', 'mic', 'audio', 'sound', 'connection', 'lag',
      'browser', 'app crash', 'blurry',
    ],
    confidence: 0.87,
    blocks: [
      {
        kind: 'p',
        text: 'If video gives out mid-consult, the call drops to audio-only automatically — the practitioner stays with you, you don\'t lose the appointment. [1]',
      },
      {
        kind: 'ul',
        items: [
          'Below 1.5 Mbps, turn your camera off and keep audio — that\'s usually enough for a good consult. [1]',
          'Run the 20-second connection check in the app ten minutes before you start. [2]',
          'A consult that fails technically in the first 5 minutes is never billed. [1]',
        ],
      },
    ],
    sourceIds: ['doc-telehealth', 'hc-reminders'],
    followups: [
      'How do I reschedule my consult?',
      'How does Medicare billing work?',
      'Talk to a person',
    ],
  },
  {
    id: 'greeting',
    intent: 'Greeting',
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'gday', "g'day", 'yo'],
    confidence: 0.96,
    blocks: [
      {
        kind: 'p',
        text: 'Hello! I\'m Pylon Care — I answer questions about appointments, billing, results, prescriptions, your account and privacy, always with my sources attached. What can I sort out for you?',
      },
      {
        kind: 'p',
        text: 'One thing I won\'t do is medical advice — for anything clinical I\'ll help you book a real practitioner instead. [1]',
      },
    ],
    sourceIds: ['pol-ai'],
    followups: [
      'How do I reschedule my video consult?',
      'Where are my test results?',
      'How does Medicare billing work?',
    ],
  },
  {
    id: 'thanks',
    intent: 'Courtesy',
    keywords: ['thank', 'thanks', 'great', 'perfect', 'awesome', 'cheers', 'nice one', 'thx'],
    confidence: 0.93,
    blocks: [
      {
        kind: 'p',
        text: 'Anytime. If that answer helped, the little thumbs-up beside it genuinely teaches our team what\'s working — and if anything\'s still unclear, ask it however you\'d ask a mate at the front desk.',
      },
    ],
    sourceIds: [],
    followups: [
      'How do I reschedule my video consult?',
      'Where are my test results?',
      'Do you store my chat history?',
    ],
  },
]

/** Clinical guardrail — fired by symptom/medical-advice keywords. */
export const CLINICAL_KEYWORDS = [
  'symptom', 'symptoms', 'chest pain', 'dizzy', 'dizziness', 'fever', 'rash',
  'bleeding', 'diagnose', 'diagnosis', 'do i have', 'is it cancer', 'painful',
  'hurts', 'swollen', 'should i take', 'dosage', 'dose', 'side effect',
  'pregnant', 'migraine', 'covid', 'flu', 'infection', 'vomit', 'vomiting',
  'sick', 'unwell', 'worried i have',
]

export const CLINICAL_BLOCKS: AnswerBlock[] = [
  {
    kind: 'p',
    text: 'That sounds like something to raise with a practitioner, not a support assistant — and to be straight with you: giving medical guidance is the one thing I\'m deliberately not allowed to do. [1]',
  },
  {
    kind: 'p',
    text: 'What I can do right now is book you a video consult. Pylon practitioners are available 7am–10pm, appointments usually start from around $59 before any Medicare rebate, and most people are seen the same day.',
  },
]

/** Emergency guardrail — replaces everything when crisis keywords fire. */
export const EMERGENCY_KEYWORDS = [
  'chest pain', "can't breathe", 'cant breathe', 'cannot breathe', 'overdose',
  'suicide', 'suicidal', 'kill myself', 'self harm', 'self-harm',
  'heart attack', 'stroke', 'unconscious', 'passed out', 'anaphylaxis',
]

// ------------------------------------------------------------- prompts

export const OPENING_PROMPTS = [
  'How do I reschedule my video consult?',
  'Where are my test results?',
  'How does Medicare billing work?',
  'Do you store my chat history?',
]

export const OPENING_PROMPTS_2 = [
  'Can I get a repeat prescription?',
  'Why won\'t my sign-in code arrive?',
  'How do interpreters work?',
  'What happens if my video freezes?',
]

export const WELCOME = {
  intent: 'Welcome',
  confidence: 1,
  blocks: [
    {
      kind: 'p',
      text: 'Hello — I\'m Pylon Care, the support assistant for Pylon Health. I answer from a small, human-reviewed help library, I always show my sources and my confidence, and I\'m honest about my limits. [1]',
    },
    {
      kind: 'p',
      text: 'Two ground rules. First: I\'m not a clinician and won\'t give medical advice — for anything medical I\'ll help you book a human. Second: before anything you type is stored, numbers that look like Medicare cards or phone numbers are stripped automatically. [2]',
    },
  ] as AnswerBlock[],
  sourceIds: ['pol-ai', 'pol-privacy'],
}
