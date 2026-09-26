import { useEffect, useMemo, useRef, useState } from 'react'
import { withBase } from '../../lib/base'
import {
  CLINICAL_BLOCKS,
  OPENING_PROMPTS,
  OPENING_PROMPTS_2,
  SOURCES,
  WELCOME,
  type Source,
} from './data'
import {
  clearTranscript,
  countWords,
  detect,
  loadTranscript,
  redact,
  saveTranscript,
  sourcesById,
  ticketId,
  truncateBlocks,
  type ChatMessage,
} from './engine'
import './demo.css'

/**
 * Pylon Care — an honest AI support assistant for fictional Pylon Health.
 * Calm clinical art direction: warm ivory, glacier teal, trust-first.
 *
 * Deliberately NOT a chatbot demo with sparkle — it's a study in responsible
 * AI plumbing: visible confidence, citations with a sources drawer, refusal
 * guardrails (no medical advice, emergency routing), personal-detail
 * redaction before storage, an accuracy feedback loop and a human handover
 * that carries the transcript. Fully client-side and deterministic.
 */

const REDUCE =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let idCounter = 0
const nextId = () => `m${++idCounter}-${Date.now().toString(36)}`

const CHANNELS = [
  {
    id: 'chat',
    label: 'Care team chat',
    meta: 'Usually under 4 minutes · 7am–10pm AEST',
  },
  {
    id: 'callback',
    label: 'Request a callback',
    meta: 'Within 2 hours, during care team hours',
  },
  {
    id: 'email',
    label: 'Email instead',
    meta: 'A considered reply the same business day',
  },
]

// ------------------------------------------------------------ rendering

/** Renders answer text, turning [n] markers into citation chips. */
function CitedText({
  text,
  sourceIds,
  onCite,
}: {
  text: string
  sourceIds: string[]
  onCite: (sourceIds: string[], index: number) => void
}) {
  const parts = text.split(/(\[\d+\])/g)
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[(\d+)\]$/)
        if (!m) return <span key={i}>{part}</span>
        const idx = Number(m[1]) - 1
        const src = sourceIds[idx]
        return (
          <button
            key={i}
            type="button"
            className="pca__cite"
            title={Sources.lookup(src)}
            onClick={() => onCite(sourceIds, idx)}
            aria-label={`Source ${m[1]}: ${Sources.lookup(src)}`}
          >
            {m[1]}
          </button>
        )
      })}
    </>
  )
}

// small module-level helper so CitedText doesn't re-memo SOURCES lookups
const Sources = {
  lookup(id?: string) {
    const s = SOURCES.find((x) => x.id === id)
    return s ? `${s.title} (${s.kind})` : 'Source'
  },
}

// ------------------------------------------------------------ component

export default function PylonCareAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [composing, setComposing] = useState(false)
  const [stream, setStream] = useState<{ id: string; total: number; visible: number } | null>(null)
  const [restored, setRestored] = useState(false)
  const [drawer, setDrawer] = useState<{ sources: Source[]; active: number } | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [liveNote, setLiveNote] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timers = useRef<number[]>([])

  // ---- boot: restore transcript or greet
  useEffect(() => {
    const prior = loadTranscript()
    if (prior && prior.length) {
      setMessages(prior)
      setRestored(true)
    } else {
      setMessages([
        {
          id: nextId(),
          role: 'assistant',
          kind: 'answer',
          blocks: WELCOME.blocks,
          intent: WELCOME.intent,
          confidence: WELCOME.confidence,
          sourceIds: WELCOME.sourceIds,
          followups: OPENING_PROMPTS,
        },
      ])
    }
  }, [])

  // ---- persist
  useEffect(() => {
    if (messages.length) saveTranscript(messages)
  }, [messages])

  // ---- autoscroll
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: REDUCE ? 'auto' : 'smooth' })
  }, [messages, stream, composing])

  useEffect(() => () => timers.current.forEach((t) => window.clearInterval(t)), [])

  const later = (fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, REDUCE ? 0 : ms)
    timers.current.push(t)
  }

  const announce = (note: string) => setLiveNote(note)

  // ---- sending -----------------------------------------------------

  const pushAnswer = (msg: ChatMessage) => {
    const total = msg.blocks ? countWords(msg.blocks) : 0
    if (REDUCE || total === 0) {
      setMessages((ms) => [...ms, msg])
      announce('Pylon Care replied.')
      return
    }
    setMessages((ms) => [...ms, { ...msg }])
    setStream({ id: msg.id, total, visible: 4 })
    const iv = window.setInterval(() => {
      setStream((s) => {
        if (!s || s.id !== msg.id) {
          window.clearInterval(iv)
          return s
        }
        const visible = s.visible + 3
        if (visible >= s.total) {
          window.clearInterval(iv)
          announce('Pylon Care replied.')
          return null
        }
        return { ...s, visible }
      })
    }, 30)
    timers.current.push(iv)
  }

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text || composing || stream) return
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'

    const red = redact(text)
    setMessages((ms) => [
      ...ms,
      { id: nextId(), role: 'user', text: red.text, redacted: red.redacted.length > 0 },
    ])
    if (red.redacted.length) {
      announce(`We detected and removed a ${red.redacted.join(' and ')} before storing your message.`)
    } else {
      announce('Message sent.')
    }

    const result = detect(red.text)
    setComposing(true)

    later(() => {
      setComposing(false)
      if (result.kind === 'emergency') {
        pushAnswer({
          id: nextId(),
          role: 'assistant',
          kind: 'emergency',
          intent: 'Immediate help',
          confidence: 1,
        })
        return
      }
      if (result.kind === 'clinical') {
        pushAnswer({
          id: nextId(),
          role: 'assistant',
          kind: 'clinical',
          blocks: CLINICAL_BLOCKS,
          intent: 'Clinical guardrail',
          confidence: result.confidence,
          sourceIds: result.sourceIds,
          followups: result.followups,
        })
        return
      }
      if (result.kind === 'fallback' || (result.kind === 'answer' && result.confidence < 0.45)) {
        pushAnswer({
          id: nextId(),
          role: 'assistant',
          kind: 'escalate',
          intent: 'Human handover',
          confidence: result.confidence,
          blocks: [
            {
              kind: 'p',
              text:
                'I want to be straight with you: I\'m not confident I know the answer to that — and guessing is worse than saying so. The fastest route from here is a real person from the care team. This transcript comes along, so you won\'t repeat yourself.',
            },
          ],
          followups: ['How does this assistant actually work?', 'Do you store my chat history?'],
        })
        return
      }
      pushAnswer({
        id: nextId(),
        role: 'assistant',
        kind: 'answer',
        blocks: result.blocks,
        intent: result.topic!.intent,
        confidence: result.confidence,
        sourceIds: result.sourceIds,
        followups: result.followups,
      })
    }, 620)
  }

  // ---- feedback ------------------------------------------------------

  const setVerdict = (id: string, verdict: 'up' | 'down') => {
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, verdict } : m)))
    announce(verdict === 'up' ? 'Thanks — marked as accurate.' : 'Thanks — marked as off the mark.')
  }

  const rephrase = (afterId: string) => {
    const original = messages.find((m) => m.id === afterId)
    if (!original?.blocks) return
    pushAnswer({
      id: nextId(),
      role: 'assistant',
      kind: 'rephrase',
      intent: original.intent,
      confidence: original.confidence,
      sourceIds: original.sourceIds,
      blocks: [
        { kind: 'p', text: 'Let me try that again, more plainly.' },
        ...original.blocks,
      ],
      followups: original.followups,
    })
  }

  const openEscalation = () => {
    pushAnswer({
      id: nextId(),
      role: 'assistant',
      kind: 'escalate',
      intent: 'Human handover',
      confidence: 1,
      blocks: [
        {
          kind: 'p',
          text: 'Of course. Pick how you\'d like to hear from us and I\'ll open a ticket with the care team — this transcript attached, no repeating yourself.',
        },
      ],
      followups: [],
    })
  }

  const chooseChannel = (id: string, channel: string) =>
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, channel } : m)))

  const confirmHandover = (id: string) => {
    setMessages((ms) =>
      ms.map((m) =>
        m.id === id ? { ...m, kind: 'escalate-done', ticket: ticketId(ms) } : m,
      ),
    )
    announce('Ticket opened. The care team has this conversation now.')
  }

  // ---- housekeeping ---------------------------------------------------

  const newChat = () => {
    clearTranscript()
    setRestored(false)
    setMessages([
      {
        id: nextId(),
        role: 'assistant',
        kind: 'answer',
        blocks: WELCOME.blocks,
        intent: WELCOME.intent,
        confidence: WELCOME.confidence,
        sourceIds: WELCOME.sourceIds,
        followups: OPENING_PROMPTS_2,
      },
    ])
    announce('Started a fresh conversation.')
    inputRef.current?.focus()
  }

  const openDrawer = (ids: string[], active = 0) => {
    const sources = sourcesById(ids)
    if (sources.length) setDrawer({ sources, active: Math.max(0, Math.min(active, sources.length - 1)) })
  }

  const lastAssistant = useMemo(
    () => [...messages].reverse().find((m) => m.role === 'assistant'),
    [messages],
  )
  const suggestions = lastAssistant?.followups?.length ? lastAssistant.followups : OPENING_PROMPTS
  const busy = composing || Boolean(stream)

  const confidenceLabel = (c?: number) => {
    if (c === undefined) return ''
    if (c >= 0.8) return `${Math.round(c * 100)}% — high confidence`
    if (c >= 0.5) return `${Math.round(c * 100)}% — moderate, worth a skim of the sources`
    return `${Math.round(c * 100)}% — low, human recommended`
  }

  // ------------------------------------------------------------ render

  return (
    <div className="pca">
      <a className="pca__skip" href="#pca-composer">
        Skip to message field
      </a>

      <header className="pca__header">
        <div>
          <p className="pca__wordmark">
            Pylon <span>care</span>
          </p>
          <p className="pca__tagline">Member support assistant — honest about what it knows</p>
        </div>
        <nav className="pca__actions" aria-label="Assistant options">
          <button type="button" className="pca__headbtn" onClick={() => setAboutOpen(true)}>
            How this works
          </button>
          <button type="button" className="pca__headbtn pca__headbtn--solid" onClick={newChat}>
            New chat
          </button>
        </nav>
      </header>

      <ul className="pca__trustbar" aria-label="What to expect">
        <li>Answers from Pylon's reviewed help library</li>
        <li>No medical advice — ever</li>
        <li>Personal details stripped before storing</li>
      </ul>

      {restored && (
        <div className="pca__restored" role="status">
          <p>
            Welcome back — I've restored our earlier conversation. It deletes itself 30 days
            after your last message.
          </p>
          <button type="button" onClick={newChat}>
            Start fresh
          </button>
        </div>
      )}

      <div className="pca__chat" ref={scrollRef} role="log" aria-label="Conversation with Pylon Care">
        <ol className="pca__msgs">
          {messages.map((m) => {
            const isStreaming = stream?.id === m.id
            const blocks = m.blocks
              ? isStreaming
                ? truncateBlocks(m.blocks, stream!.visible)
                : m.blocks
              : undefined

            if (m.role === 'user') {
              return (
                <li key={m.id} className="pca__row pca__row--user">
                  <div className="pca__bubble pca__bubble--user">
                    <p>{m.text}</p>
                  </div>
                  {m.redacted && (
                    <p className="pca__redaction">
                      <ShieldIcon /> A personal detail was removed before this was stored.
                    </p>
                  )}
                </li>
              )
            }

            return (
              <li key={m.id} className="pca__row pca__row--bot">
                <div className="pca__avatar" aria-hidden="true">
                  PC
                </div>
                <div className={`pca__msg${m.kind === 'emergency' ? ' pca__msg--emergency' : ''}`}>
                  {m.kind === 'emergency' ? (
                    <EmergencyCard />
                  ) : (
                    <>
                      {m.kind === 'clinical' && (
                        <p className="pca__guardrail-tag">
                          <ShieldIcon /> Guardrail — I don't give medical advice
                        </p>
                      )}
                      {blocks?.map((b, i) =>
                        b.kind === 'p' ? (
                          <p key={i}>
                            <CitedText
                              text={b.text}
                              sourceIds={m.sourceIds ?? []}
                              onCite={openDrawer}
                            />
                          </p>
                        ) : (
                          <ul key={i}>
                            {b.items.map((item, j) => (
                              <li key={j}>
                                <CitedText
                                  text={item}
                                  sourceIds={m.sourceIds ?? []}
                                  onCite={openDrawer}
                                />
                              </li>
                            ))}
                          </ul>
                        ),
                      )}
                      {isStreaming && <span className="pca__caret" aria-hidden="true" />}

                      {m.kind === 'clinical' && !isStreaming && (
                        <div className="pca__clinical-cta">
                          <a
                            className="pca__cta"
                            href={withBase('/lab/pylon-health-booking')}
                          >
                            Book a video consult
                            <ArrowIcon />
                          </a>
                          <p>
                            If symptoms are severe, sudden or frightening, call 000 first — then
                            come back and we'll help with the admin.
                          </p>
                        </div>
                      )}

                      {m.kind === 'escalate' && (
                        <div className="pca__handover" role="group" aria-label="Choose how to reach the care team">
                          {CHANNELS.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              className={`pca__channel${m.channel === c.id ? ' is-on' : ''}`}
                              aria-pressed={m.channel === c.id}
                              onClick={() => chooseChannel(m.id, c.id)}
                            >
                              <strong>{c.label}</strong>
                              <span>{c.meta}</span>
                            </button>
                          ))}
                          <button
                            type="button"
                            className="pca__cta"
                            disabled={!m.channel}
                            onClick={() => confirmHandover(m.id)}
                          >
                            Hand me over
                            <ArrowIcon />
                          </button>
                        </div>
                      )}

                      {m.kind === 'escalate-done' && (
                        <div className="pca__handover pca__handover--done" role="status">
                          <p className="pca__ticket">Ticket {m.ticket}</p>
                          <p>
                            Done — the care team has this conversation and will pick it up via{' '}
                            {CHANNELS.find((c) => c.id === m.channel)?.label.toLowerCase() ?? 'your chosen channel'}.
                            Anything else I can sort in the meantime?
                          </p>
                        </div>
                      )}

                      {!isStreaming &&
                        (m.kind === 'answer' || m.kind === 'clinical' || m.kind === 'rephrase') && (
                          <footer className="pca__meta">
                            <span className="pca__intent">{m.intent}</span>
                            {m.sourceIds && m.sourceIds.length > 0 && (
                              <button
                                type="button"
                                className="pca__srcbtn"
                                onClick={() => openDrawer(m.sourceIds!, 0)}
                              >
                                {m.sourceIds.length}{' '}
                                {m.sourceIds.length === 1 ? 'source' : 'sources'}
                              </button>
                            )}
                            <Feedback
                              verdict={m.verdict ?? null}
                              onVerdict={(v) => setVerdict(m.id, v)}
                              onRephrase={() => rephrase(m.id)}
                              onHuman={openEscalation}
                            />
                          </footer>
                        )}
                    </>
                  )}
                </div>
                {!isStreaming &&
                  (m.kind === 'answer' || m.kind === 'clinical' || m.kind === 'rephrase') &&
                  m.confidence !== undefined && (
                  <p
                    className={`pca__conf pca__conf--${
                      m.confidence >= 0.8 ? 'hi' : m.confidence >= 0.5 ? 'mid' : 'lo'
                    }`}
                  >
                    <i aria-hidden="true" /> {confidenceLabel(m.confidence)}
                  </p>
                )}
              </li>
            )
          })}
          {composing && (
            <li className="pca__row pca__row--bot">
              <div className="pca__avatar" aria-hidden="true">
                PC
              </div>
              <div className="pca__msg pca__msg--typing" role="status">
                <span className="pca__dot" />
                <span className="pca__dot" />
                <span className="pca__dot" />
                <span className="pca__sr">Pylon Care is composing a reply…</span>
              </div>
            </li>
          )}
        </ol>

        <div className="pca__prompts" aria-label="Suggested questions">
          {suggestions.map((s) => (
            <button key={s} type="button" className="pca__chip" disabled={busy} onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <form
        className="pca__composer"
        id="pca-composer"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <label htmlFor="pca-input" className="pca__sr">
          Message Pylon Care
        </label>
        <textarea
          id="pca-input"
          ref={inputRef}
          value={input}
          rows={1}
          placeholder="Ask about appointments, billing, results, privacy…"
          onChange={(e) => {
            setInput(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
        />
        <button type="submit" className="pca__send" disabled={busy || !input.trim()} aria-label="Send message">
          <ArrowIcon />
        </button>
        <p className="pca__composer-note">
          Enter to send · Shift+Enter for a new line · Try typing a made-up Medicare or phone
          number to see redaction work
        </p>
      </form>

      {/* ---- sources drawer */}
      {drawer && (
        <div className="pca__scrim" onClick={() => setDrawer(null)}>
          <aside
            className="pca__drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Sources for this answer"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="pca__drawer-head">
              <p>
                Sources <span>{drawer.sources.length}</span>
              </p>
              <button
                type="button"
                className="pca__drawer-close"
                onClick={() => setDrawer(null)}
                aria-label="Close sources"
              >
                ×
              </button>
            </header>
            <ol className="pca__drawer-list">
              {drawer.sources.map((s, i) => (
                <li key={s.id} className={i === drawer.active ? 'is-active' : ''}>
                  <button type="button" onClick={() => setDrawer({ ...drawer, active: i })}>
                    <span className="pca__drawer-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pca__drawer-title">{s.title}</span>
                    <span className="pca__drawer-meta">
                      {s.kind} · {s.section} · reviewed {s.updated}
                    </span>
                  </button>
                  {i === drawer.active && <blockquote>{s.excerpt}</blockquote>}
                </li>
              ))}
            </ol>
            <p className="pca__drawer-foot">
              Every article is reviewed by a human on the Pylon care team. The assistant can only
              quote from this library — it can't invent beyond it.
            </p>
          </aside>
        </div>
      )}

      {/* ---- about panel */}
      {aboutOpen && (
        <div className="pca__scrim" onClick={() => setAboutOpen(false)}>
          <aside
            className="pca__drawer"
            role="dialog"
            aria-modal="true"
            aria-label="How this assistant works"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="pca__drawer-head">
              <p>
                How this works <span>plain version</span>
              </p>
              <button
                type="button"
                className="pca__drawer-close"
                onClick={() => setAboutOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </header>
            <div className="pca__about">
              <p>
                <strong>No model, no magic.</strong> This demo answers from a fixed library of{' '}
                {SOURCES.length} reviewed help articles. A question is matched to a topic, the
                matching article shapes the answer, and the percentage you see is a real confidence
                signal from that match — not theatre.
              </p>
              <p>
                <strong>Guardrails are the feature.</strong> Ask about symptoms and I'll refuse —
                politely, and with a route to a human. Mention an emergency and everything else
                stops. Low confidence means handover, not bluffing.
              </p>
              <p>
                <strong>Storage is honest.</strong> Anything resembling a Medicare, card or phone
                number is stripped before your message is kept. The transcript lives in this
                browser for 30 days, then deletes itself — nothing leaves your device in this demo.
              </p>
              <p>
                <strong>Your verdict counts.</strong> The thumbs beside each answer feed the
                accuracy loop: a down-vote offers a rephrase or a human, because "sorry you feel
                that way" is not a support strategy.
              </p>
            </div>
          </aside>
        </div>
      )}

      <p className="pca__foot">
        Pylon Care is a fictional product demo — no advice is given, and nothing leaves this
        browser.
      </p>

      <div className="pca__sr" aria-live="polite">
        {liveNote}
      </div>
    </div>
  )
}

// ------------------------------------------------------------ pieces

function EmergencyCard() {
  return (
    <div className="pca__emergency" role="alert">
      <p className="pca__emergency-title">This needs people, right now — not me.</p>
      <ul>
        <li>
          <strong>Immediate danger? Call 000</strong> (triple zero) — or ask someone nearby to.
        </li>
        <li>
          <strong>Lifeline: 13 11 14</strong> — 24-hour crisis support.
        </li>
        <li>
          <strong>13YARN: 13 92 76</strong> — crisis support for Aboriginal &amp; Torres Strait
          Islander people.
        </li>
      </ul>
      <p>
        I'll stay right here. When the moment has passed, the care team can help with everything
        else.
      </p>
    </div>
  )
}

function Feedback({
  verdict,
  onVerdict,
  onRephrase,
  onHuman,
}: {
  verdict: 'up' | 'down' | null
  onVerdict: (v: 'up' | 'down') => void
  onRephrase: () => void
  onHuman: () => void
}) {
  if (verdict === 'up') {
    return <span className="pca__thanks">Noted — thank you.</span>
  }
  if (verdict === 'down') {
    return (
      <span className="pca__repair">
        Sorry about that.
        <button type="button" onClick={onRephrase}>
          Say it differently
        </button>
        <button type="button" onClick={onHuman}>
          Talk to a person
        </button>
      </span>
    )
  }
  return (
    <span className="pca__vote">
      Was this accurate?
      <button type="button" onClick={() => onVerdict('up')} aria-label="Yes, accurate">
        <ThumbIcon up />
      </button>
      <button type="button" onClick={() => onVerdict('down')} aria-label="No, not accurate">
        <ThumbIcon />
      </button>
    </span>
  )
}

// ------------------------------------------------------------ icons

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1.2 12 3v3.6c0 3.1-2.1 5.2-5 6.2-2.9-1-5-3.1-5-6.2V3l5-1.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="m4.8 6.9 1.6 1.6 3-3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ThumbIcon({ up = false }: { up?: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={up ? undefined : { transform: 'scaleY(-1)' }}
    >
      <path
        d="M5.2 6.8v7H3a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h2.2Zm0 0 3-4.6c1.2 0 1.9.9 1.7 2l-.4 1.6h3.3a1.2 1.2 0 0 1 1.2 1.5l-1 3.8a1.6 1.6 0 0 1-1.5 1.2H5.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}
