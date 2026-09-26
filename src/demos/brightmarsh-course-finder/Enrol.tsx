import { useEffect, useMemo, useRef, useState } from 'react'
import { MEMBERSHIP_PRICE, fmtMoney, fmtStart, fmtWeeks, memberPrice, type Course } from './data'
import { useOverlay, useReducedMotion } from './hooks'

type Step = 0 | 1 | 2
type PriceChoice = 'standard' | 'member' | 'join'

export interface EnrolResult {
  ref: string
  courseTitle: string
}

interface Props {
  course: Course
  onClose: () => void
  onDone: (r: EnrolResult) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MEMBER_RE = /^BM-\d{4}$/i

interface FormState {
  choice: PriceChoice
  memberNo: string
  name: string
  email: string
  access: string
  gift: boolean
  giftName: string
  giftEmail: string
  giftMsg: string
  card: string
  expiry: string
  cvc: string
  terms: boolean
}

const INITIAL: FormState = {
  choice: 'standard',
  memberNo: '',
  name: '',
  email: '',
  access: '',
  gift: false,
  giftName: '',
  giftEmail: '',
  giftMsg: '',
  card: '',
  expiry: '',
  cvc: '',
  terms: false,
}

/** The mocked three-step enrolment: place → you → review & pay → done. */
export default function Enrol({ course: c, onClose, onDone }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  useOverlay(true, panelRef, onClose)
  const rm = useReducedMotion()

  const [step, setStep] = useState<Step>(0)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<'form' | 'processing' | 'success'>('form')
  const [ref, setRef] = useState('')

  useEffect(() => {
    titleRef.current?.focus()
  }, [step, phase])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  /* pricing */
  const memberRate = form.choice !== 'standard'
  const courseCost = memberRate ? memberPrice(c.price) : c.price
  const membershipCost = form.choice === 'join' ? MEMBERSHIP_PRICE : 0
  const total = courseCost + membershipCost
  const saved = c.price - courseCost

  const validate = (s: Step): boolean => {
    const e: Record<string, string> = {}
    if (s === 0 && form.choice === 'member' && !MEMBER_RE.test(form.memberNo.trim())) {
      e.memberNo = 'Member numbers look like BM-1024 — four digits after the dash.'
    }
    if (s === 1) {
      if (form.name.trim().length < 2) e.name = 'We need a name for the class roll.'
      if (!EMAIL_RE.test(form.email.trim())) e.email = 'That email does not look right — check the dots.'
      if (form.gift) {
        if (form.giftName.trim().length < 2) e.giftName = 'Whose name goes on the gift?'
        if (!EMAIL_RE.test(form.giftEmail.trim())) e.giftEmail = 'Where do we send the gift email?'
      }
    }
    if (s === 2) {
      const digits = form.card.replace(/\D/g, '')
      if (digits.length !== 16) e.card = 'Sixteen digits — this is a demo, 4242 4242 4242 4242 is the house favourite.'
      const m = form.expiry.match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/)
      if (!m) {
        e.expiry = 'Use MM/YY — e.g. 09/28.'
      } else {
        const yy = 2000 + Number(m[2])
        const mm = Number(m[1])
        const now = new Date()
        if (yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1)) {
          e.expiry = 'That card looks expired. Time flies.'
        }
      }
      if (!/^\d{3,4}$/.test(form.cvc.trim())) e.cvc = 'Three or four digits, on the back.'
      if (!form.terms) e.terms = 'Tick the box — it is the only way we know you read none of the terms.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate(step)) return
    setStep((s) => Math.min(2, s + 1) as Step)
  }

  const pay = () => {
    if (!validate(2)) return
    setPhase('processing')
    const makeRef = () =>
      `${c.code}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    window.setTimeout(
      () => {
        const r = makeRef()
        setRef(r)
        setPhase('success')
        onDone({ ref: r, courseTitle: c.title })
      },
      rm ? 50 : 1100,
    )
  }

  const errList = useMemo(() => Object.values(errors), [errors])
  const stepNames = ['Your place', 'About you', 'Review & pay']

  return (
    <div className="bcf-overlay bcf-overlay--enrol" role="presentation">
      <div
        ref={panelRef}
        className="bcf-enrol"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bcf-enrol-title"
        tabIndex={-1}
      >
        {phase !== 'success' && (
          <header className="bcf-enrol__head">
            <div>
              <p className="bcf-sheet__code">
                {c.code} · {fmtWeeks(c)} · starts {fmtStart(c)}
              </p>
              <h2 id="bcf-enrol-title" className="bcf-sheet__title" ref={titleRef} tabIndex={-1}>
                Enrol in {c.title}
              </h2>
            </div>
            <button type="button" className="bcf-close" onClick={onClose} aria-label="Cancel enrolment">
              ×
            </button>
          </header>
        )}

        {phase === 'processing' && (
          <div className="bcf-enrol__processing" role="status">
            <span className="bcf-spinner" aria-hidden="true" />
            <p>Holding seat {c.capacity - c.seatsLeft + 1} of {c.capacity}…</p>
            <small>(Not really — this is a demo. But the pause is polite.)</small>
          </div>
        )}

        {phase === 'success' && (
          <div className="bcf-enrol__success">
            <p className="bcf-sheet__code">Booking confirmed · sort of</p>
            <h2 className="bcf-sheet__title">You&apos;re in, {form.name.split(' ')[0]}.</h2>
            <p className="bcf-enrol__ref">
              Reference <b>{ref}</b>
            </p>
            <ul className="bcf-enrol__next">
              <li>
                <b>Now:</b> a confirmation email to {form.email}
                {form.gift ? ` — and a gift email to ${form.giftEmail}` : ''}. (In this demo: neither. The
                feeling is real.)
              </li>
              <li>
                <b>Friday:</b> pre-course reading from {c.tutor}, short and worth it.
              </li>
              <li>
                <b>{fmtStart(c)}:</b> {c.title} begins, {c.day}s {c.time}, {c.room}.
              </li>
            </ul>
            <div className="bcf-quiz__actions">
              <button type="button" className="bcf-btn" onClick={onClose}>
                Back to the catalogue
              </button>
            </div>
            <p className="bcf-fineprint">
              Brightmarsh is fictional and this checkout is mocked — no card was charged, no seat was held, no
              email was sent. The UX, however, is the real thing.
            </p>
          </div>
        )}

        {phase === 'form' && (
          <>
            <ol className="bcf-steps" aria-label="Enrolment progress">
              {stepNames.map((n, i) => (
                <li key={n} className={i === step ? 'is-now' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
                  <span>{i + 1}</span>
                  {n}
                </li>
              ))}
            </ol>

            {errList.length > 0 && (
              <div className="bcf-errors" role="alert">
                <b>{errList.length} thing{errList.length > 1 ? 's' : ''} to fix:</b>
                <ul>
                  {errList.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ------------------------------------------------ step 0 */}
            {step === 0 && (
              <div className="bcf-enrol__step">
                <h3 className="bcf-enrol__h">01 — Your place</h3>
                <div className="bcf-pricewall" role="radiogroup" aria-label="Price option">
                  <label className={`bcf-pricetier${form.choice === 'standard' ? ' is-on' : ''}`}>
                    <input
                      type="radio"
                      name="bcf-choice"
                      checked={form.choice === 'standard'}
                      onChange={() => set('choice', 'standard')}
                    />
                    <span className="bcf-pricetier__name">Standard</span>
                    <b>{fmtMoney(c.price)}</b>
                    <span className="bcf-pricetier__note">Full course fee, pay once.</span>
                  </label>
                  <label className={`bcf-pricetier${form.choice === 'member' ? ' is-on' : ''}`}>
                    <input
                      type="radio"
                      name="bcf-choice"
                      checked={form.choice === 'member'}
                      onChange={() => set('choice', 'member')}
                    />
                    <span className="bcf-pricetier__name">I&apos;m a member</span>
                    <b>{fmtMoney(memberPrice(c.price))}</b>
                    <span className="bcf-pricetier__note">15% off, always. You save {fmtMoney(saved)}.</span>
                  </label>
                  <label className={`bcf-pricetier${form.choice === 'join' ? ' is-on' : ''}`}>
                    <input
                      type="radio"
                      name="bcf-choice"
                      checked={form.choice === 'join'}
                      onChange={() => set('choice', 'join')}
                    />
                    <span className="bcf-pricetier__name">Join &amp; save</span>
                    <b>
                      {fmtMoney(memberPrice(c.price))} + {fmtMoney(MEMBERSHIP_PRICE)}
                    </b>
                    <span className="bcf-pricetier__note">
                      Membership for the year; breaks even on your second course.
                    </span>
                  </label>
                </div>
                {form.choice === 'member' && (
                  <div className="bcf-field">
                    <label htmlFor="bcf-memberno">Member number</label>
                    <input
                      id="bcf-memberno"
                      type="text"
                      autoComplete="off"
                      placeholder="BM-1024"
                      value={form.memberNo}
                      aria-invalid={!!errors.memberNo}
                      onChange={(e) => set('memberNo', e.target.value)}
                    />
                    {errors.memberNo ? (
                      <p className="bcf-field__err">{errors.memberNo}</p>
                    ) : (
                      <p className="bcf-field__hint">It is on the back of the nice green card.</p>
                    )}
                  </div>
                )}
                <p className="bcf-enrol__seatsnote">
                  {c.seatsLeft} of {c.capacity} seats left for the {fmtStart(c)} intake. Enrolling now holds
                  yours.
                </p>
              </div>
            )}

            {/* ------------------------------------------------ step 1 */}
            {step === 1 && (
              <div className="bcf-enrol__step">
                <h3 className="bcf-enrol__h">02 — About you</h3>
                <div className="bcf-fieldgrid">
                  <div className="bcf-field">
                    <label htmlFor="bcf-name">Full name</label>
                    <input
                      id="bcf-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      aria-invalid={!!errors.name}
                      onChange={(e) => set('name', e.target.value)}
                    />
                    {errors.name && <p className="bcf-field__err">{errors.name}</p>}
                  </div>
                  <div className="bcf-field">
                    <label htmlFor="bcf-email">Email</label>
                    <input
                      id="bcf-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      aria-invalid={!!errors.email}
                      onChange={(e) => set('email', e.target.value)}
                    />
                    {errors.email && <p className="bcf-field__err">{errors.email}</p>}
                  </div>
                </div>
                <div className="bcf-field">
                  <label htmlFor="bcf-access">
                    Anything we should know? <span className="bcf-field__opt">optional</span>
                  </label>
                  <textarea
                    id="bcf-access"
                    rows={2}
                    placeholder="Accessibility needs, dietary notes, anxiety about week one — all welcome."
                    value={form.access}
                    onChange={(e) => set('access', e.target.value)}
                  />
                </div>

                <div className={`bcf-gift${form.gift ? ' is-on' : ''}`}>
                  <label className="bcf-gift__toggle">
                    <input type="checkbox" checked={form.gift} onChange={(e) => set('gift', e.target.checked)} />
                    <span>
                      <b>This is a gift</b> — we wrap it nicely and email the lucky human on the start date.
                    </span>
                  </label>
                  {form.gift && (
                    <div className="bcf-gift__fields">
                      <div className="bcf-fieldgrid">
                        <div className="bcf-field">
                          <label htmlFor="bcf-giftname">Their name</label>
                          <input
                            id="bcf-giftname"
                            type="text"
                            value={form.giftName}
                            aria-invalid={!!errors.giftName}
                            onChange={(e) => set('giftName', e.target.value)}
                          />
                          {errors.giftName && <p className="bcf-field__err">{errors.giftName}</p>}
                        </div>
                        <div className="bcf-field">
                          <label htmlFor="bcf-giftemail">Their email</label>
                          <input
                            id="bcf-giftemail"
                            type="email"
                            value={form.giftEmail}
                            aria-invalid={!!errors.giftEmail}
                            onChange={(e) => set('giftEmail', e.target.value)}
                          />
                          {errors.giftEmail && <p className="bcf-field__err">{errors.giftEmail}</p>}
                        </div>
                      </div>
                      <div className="bcf-field">
                        <label htmlFor="bcf-giftmsg">
                          Gift message <span className="bcf-field__opt">optional</span>
                        </label>
                        <textarea
                          id="bcf-giftmsg"
                          rows={2}
                          placeholder="Six Tuesdays of you becoming dangerous with a spreadsheet. Love, me."
                          value={form.giftMsg}
                          onChange={(e) => set('giftMsg', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ------------------------------------------------ step 2 */}
            {step === 2 && (
              <div className="bcf-enrol__step">
                <h3 className="bcf-enrol__h">03 — Review &amp; pay</h3>
                <dl className="bcf-order">
                  <div>
                    <dt>
                      {c.title} ({c.code}) · {memberRate ? 'member price' : 'standard'}
                    </dt>
                    <dd>{fmtMoney(courseCost)}</dd>
                  </div>
                  {form.choice === 'join' && (
                    <div>
                      <dt>Brightmarsh membership — one year</dt>
                      <dd>{fmtMoney(MEMBERSHIP_PRICE)}</dd>
                    </div>
                  )}
                  {saved > 0 && (
                    <div className="bcf-order__save">
                      <dt>Member saving on this course</dt>
                      <dd>−{fmtMoney(saved)}</dd>
                    </div>
                  )}
                  {form.gift && (
                    <div>
                      <dt>Gift delivery, wrapped &amp; timed</dt>
                      <dd>free</dd>
                    </div>
                  )}
                  <div className="bcf-order__total">
                    <dt>Total today</dt>
                    <dd>{fmtMoney(total)}</dd>
                  </div>
                </dl>

                <div className="bcf-fieldgrid">
                  <div className="bcf-field bcf-field--card">
                    <label htmlFor="bcf-card">Card number</label>
                    <input
                      id="bcf-card"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="4242 4242 4242 4242"
                      value={form.card}
                      aria-invalid={!!errors.card}
                      onChange={(e) => set('card', e.target.value)}
                    />
                    {errors.card && <p className="bcf-field__err">{errors.card}</p>}
                  </div>
                  <div className="bcf-field">
                    <label htmlFor="bcf-expiry">Expiry</label>
                    <input
                      id="bcf-expiry"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={form.expiry}
                      aria-invalid={!!errors.expiry}
                      onChange={(e) => set('expiry', e.target.value)}
                    />
                    {errors.expiry && <p className="bcf-field__err">{errors.expiry}</p>}
                  </div>
                  <div className="bcf-field">
                    <label htmlFor="bcf-cvc">CVC</label>
                    <input
                      id="bcf-cvc"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      maxLength={4}
                      value={form.cvc}
                      aria-invalid={!!errors.cvc}
                      onChange={(e) => set('cvc', e.target.value)}
                    />
                    {errors.cvc && <p className="bcf-field__err">{errors.cvc}</p>}
                  </div>
                </div>

                <label className={`bcf-terms${errors.terms ? ' is-err' : ''}`}>
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => set('terms', e.target.checked)}
                    aria-invalid={!!errors.terms}
                  />
                  <span>
                    I agree to the terms, which are short and fair: refunds to 7 days before start, transfers
                    anytime, and no spam beyond the course. {errors.terms && <em className="bcf-field__err">{errors.terms}</em>}
                  </span>
                </label>
                <p className="bcf-fineprint">
                  Demonstration checkout — nothing is charged and no details leave your browser.
                </p>
              </div>
            )}

            <footer className="bcf-enrol__nav">
              {step > 0 ? (
                <button type="button" className="bcf-linkbtn" onClick={() => setStep((s) => (s - 1) as Step)}>
                  ← {stepNames[step - 1]}
                </button>
              ) : (
                <button type="button" className="bcf-linkbtn" onClick={onClose}>
                  Keep browsing
                </button>
              )}
              {step < 2 ? (
                <button type="button" className="bcf-btn" onClick={next}>
                  Continue — {stepNames[(step + 1) as Step].toLowerCase()}
                </button>
              ) : (
                <button type="button" className="bcf-btn" onClick={pay}>
                  Pay {fmtMoney(total)} &amp; enrol
                </button>
              )}
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
