/**
 * Pylon Care — deterministic "retrieval" engine.
 * Topic detection over the scripted bank, personal-detail redaction,
 * confidence shaping and transcript persistence. No network, no model —
 * that's the point of the demo: the honest plumbing behind the theatre.
 */

import {
  CLINICAL_KEYWORDS,
  EMERGENCY_KEYWORDS,
  SOURCES,
  TOPICS,
  type AnswerBlock,
  type Source,
  type Topic,
} from './data'

// ------------------------------------------------------------- types

export type Verdict = 'up' | 'down' | null

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  /** plain text for user messages; assistant messages use blocks */
  text?: string
  blocks?: AnswerBlock[]
  intent?: string
  confidence?: number
  sourceIds?: string[]
  /** special assistant payloads */
  kind?: 'answer' | 'clinical' | 'emergency' | 'escalate' | 'escalate-done' | 'rephrase'
  /** user message: something personal was stripped before storing */
  redacted?: boolean
  verdict?: Verdict
  followups?: string[]
  /** escalation card state */
  channel?: string
  ticket?: string
}

export interface DetectResult {
  kind: 'answer' | 'clinical' | 'emergency' | 'fallback'
  topic?: Topic
  confidence: number
  sourceIds: string[]
  blocks: AnswerBlock[]
  followups: string[]
}

// ------------------------------------------------------------- detection

const HUMAN_WORDS = [
  'human', 'person', 'agent', 'someone real', 'real person', 'operator',
  'talk to someone', 'speak to', 'staff', 'complaint', 'complain',
]

function normalise(input: string): string {
  return ` ${input.toLowerCase().replace(/[^a-z0-9'\s-]/g, ' ').replace(/\s+/g, ' ')} `
}

export function detect(input: string): DetectResult {
  const text = normalise(input)

  // 1) Emergency — outranks everything, never reaches "answer" logic.
  for (const kw of EMERGENCY_KEYWORDS) {
    if (text.includes(kw)) {
      return { kind: 'emergency', confidence: 1, sourceIds: [], blocks: [], followups: [] }
    }
  }

  // 2) Explicit human request.
  for (const kw of HUMAN_WORDS) {
    if (text.includes(kw)) {
      return { kind: 'fallback', confidence: 0.34, sourceIds: [], blocks: [], followups: [] }
    }
  }

  // 3) Clinical guardrail — answer process-around-care, refuse advice.
  let clinicalHit = false
  for (const kw of CLINICAL_KEYWORDS) {
    if (text.includes(kw)) {
      clinicalHit = true
      break
    }
  }

  // 4) Score topics.
  let best: Topic | null = null
  let bestScore = 0
  let secondScore = 0
  for (const topic of TOPICS) {
    let score = 0
    for (const kw of topic.keywords) {
      const conversational = topic.id === 'greeting' || topic.id === 'thanks'
      if (conversational && text.length < 40) {
        // pleasantries only fire on short, clearly-conversational messages
        if (text.trim() === kw || text.trim().startsWith(kw + ' ')) score += 3
      } else if (text.includes(kw)) {
        score += kw.length > 6 ? 2 : 1
      }
    }
    if (score > bestScore) {
      secondScore = bestScore
      bestScore = score
      best = topic
    } else if (score > secondScore) {
      secondScore = score
    }
  }

  if (clinicalHit) {
    return {
      kind: 'clinical',
      confidence: 0.97,
      sourceIds: ['pol-ai'],
      blocks: [],
      followups: [
        'Book me a video consult',
        'How much does a consult cost?',
        'Talk to a person',
      ],
    }
  }

  if (best && bestScore >= 2) {
    // confidence shaped by dominance over the runner-up
    const dominance = bestScore - secondScore
    const confidence = Math.min(
      0.97,
      Math.max(best.confidence - 0.18, best.confidence - (dominance >= 2 ? 0 : dominance === 1 ? 0.09 : 0.16)),
    )
    return {
      kind: 'answer',
      topic: best,
      confidence,
      sourceIds: best.sourceIds,
      blocks: best.blocks,
      followups: best.followups,
    }
  }

  if (best && bestScore === 1 && !clinicalHit) {
    // weak match — answer but flag it
    const t = best
    return {
      kind: 'answer',
      topic: t,
      confidence: 0.52,
      sourceIds: t.sourceIds,
      blocks: t.blocks,
      followups: t.followups,
    }
  }

  return { kind: 'fallback', confidence: 0.28, sourceIds: [], blocks: [], followups: [] }
}

// ------------------------------------------------------------- redaction

const PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\b\d{4}\s?\d{5}\s?\d\b/g, label: 'Medicare number' },
  { re: /\b(?:\+?61|0)\s?[2-478]\s?\d{4}\s?\d{4}\b/g, label: 'phone number' },
  { re: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, label: 'card number' },
]

export function redact(input: string): { text: string; redacted: string[] } {
  let text = input
  const redacted: string[] = []
  for (const { re, label } of PATTERNS) {
    if (re.test(text)) {
      text = text.replace(re, '•••••')
      redacted.push(label)
    }
    re.lastIndex = 0
  }
  return { text, redacted }
}

// ------------------------------------------------------------- words / streaming

export function countWords(blocks: AnswerBlock[]): number {
  let n = 0
  for (const b of blocks) {
    const s = b.kind === 'p' ? b.text : b.items.join(' ')
    n += s.split(/\s+/).filter(Boolean).length
  }
  return n
}

/** Returns a copy of blocks truncated to `budget` visible words. */
export function truncateBlocks(blocks: AnswerBlock[], budget: number): AnswerBlock[] {
  const out: AnswerBlock[] = []
  for (const b of blocks) {
    if (budget <= 0) break
    if (b.kind === 'p') {
      const words = b.text.split(/\s+/)
      if (words.length <= budget) {
        out.push(b)
        budget -= words.length
      } else {
        out.push({ kind: 'p', text: words.slice(0, budget).join(' ') })
        budget = 0
      }
    } else {
      const items: string[] = []
      for (const item of b.items) {
        if (budget <= 0) break
        const words = item.split(/\s+/)
        if (words.length <= budget) {
          items.push(item)
          budget -= words.length
        } else {
          items.push(words.slice(0, budget).join(' '))
          budget = 0
        }
      }
      if (items.length) out.push({ kind: 'ul', items })
    }
  }
  return out
}

// ------------------------------------------------------------- ticket ids

/** Deterministic ticket id from the transcript — same chat, same ticket. */
export function ticketId(messages: ChatMessage[]): string {
  let h = 2481
  for (const m of messages) {
    const s = m.id + (m.text || '')
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9000
  }
  return `PY-${1000 + ((h % 8999) + 8999) % 8999}`
}

// ------------------------------------------------------------- persistence

const KEY = 'pylon-care:transcript:v1'

export function loadTranscript(): ChatMessage[] | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { saved: number; messages: ChatMessage[] }
    // transcripts expire after 30 days, mirroring the fictional policy
    if (Date.now() - parsed.saved > 30 * 24 * 60 * 60 * 1000) return null
    return parsed.messages.filter((m) => m && m.id && m.role)
  } catch {
    return null
  }
}

export function saveTranscript(messages: ChatMessage[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ saved: Date.now(), messages }))
  } catch {
    /* storage unavailable — the chat still works, it just won't persist */
  }
}

export function clearTranscript() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}

export const sourcesById = (ids: string[]): Source[] =>
  ids.map((id) => SOURCES.find((s) => s.id === id)).filter((s): s is Source => Boolean(s))
