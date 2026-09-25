import { useState, type FormEvent } from 'react'
import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import { services } from '../data/services'
import Reveal from '../components/Reveal'

interface FormState {
  name: string
  email: string
  company: string
  budget: string
  timeline: string
  message: string
  services: string[]
}

const initial: FormState = {
  name: '',
  email: '',
  company: '',
  budget: '',
  timeline: '',
  message: '',
  services: [],
}

const budgets = ['Under AUD 45k', 'AUD 45–120k', 'AUD 120–300k', 'AUD 300k+', 'Not sure yet']

export default function Contact() {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [sent, setSent] = useState(false)

  const set = (k: keyof FormState, v: string | string[]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const toggleService = (s: string) =>
    set('services', form.services.includes(s) ? form.services.filter((x) => x !== s) : [...form.services, s])

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (form.name.trim().length < 2) e.name = 'Tell us who you are — first name is fine.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'That email does not look right.'
    if (!form.budget) e.budget = 'Pick the closest honest answer.’'
    if (form.message.trim().length < 30) e.message = 'Give us at least a couple of sentences about the project.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    if (validate()) setSent(true)
  }

  return (
    <>
      <Seo
        title="Contact — start a project"
        description="Tell Brassfern what you are building. A senior person replies within two business days — with an honest opinion, not a sales deck."
        path="/contact"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Contact</Reveal>
        <h1 className="display">Start a <em>project</em></h1>
        <p className="lead lead--wide">
          A senior person reads every brief — not a bot, not a BDR. Expect an honest reply within two business days, including “we are not the right squad” when that is the truth.
        </p>
      </header>
      <section className="section container" style={{ maxWidth: '60rem' }}>
        {sent ? (
          <div className="form-success" role="status">
            <p className="overline">Brief received</p>
            <h2 className="display h-3">Thank you, {form.name.split(' ')[0]}. The kettle is on.</h2>
            <p>
              Your brief for <strong>{form.company || 'your project'}</strong> is in the studio inbox. Because Brassfern is a concept studio, nothing was actually sent — but the form works exactly as it would in production, right down to this success state.
            </p>
            <p className="mono muted">Response time: within 2 business days · Reply comes from a human</p>
            <button className="btn btn--ghost" onClick={() => { setForm(initial); setSent(false) }} style={{ justifySelf: 'start' }}>
              Send another
            </button>
          </div>
        ) : (
          <form className="form-grid" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="f-name">Your name</label>
              <input id="f-name" value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} autoComplete="name" />
              {errors.name && <p className="err">{errors.name}</p>}
            </div>
            <div className="field">
              <label htmlFor="f-email">Email</label>
              <input id="f-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} autoComplete="email" />
              {errors.email && <p className="err">{errors.email}</p>}
            </div>
            <div className="field">
              <label htmlFor="f-company">Company</label>
              <input id="f-company" value={form.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" />
            </div>
            <div className="field">
              <label htmlFor="f-timeline">Ideal timeline</label>
              <input id="f-timeline" value={form.timeline} onChange={(e) => set('timeline', e.target.value)} placeholder="e.g. launched before spring" />
            </div>
            <div className="field span-2">
              <label id="f-budget-label">Budget range</label>
              <div className="chipset" role="group" aria-labelledby="f-budget-label">
                {budgets.map((b) => (
                  <button type="button" key={b} className="chip" aria-pressed={form.budget === b} onClick={() => set('budget', b)}>
                    {b}
                  </button>
                ))}
              </div>
              {errors.budget && <p className="err" style={{ color: 'var(--clay)', fontSize: '0.82rem' }}>{errors.budget}</p>}
            </div>
            <div className="field span-2">
              <label id="f-services-label">What do you need? (optional)</label>
              <div className="chipset" role="group" aria-labelledby="f-services-label">
                {services.map((s) => (
                  <button type="button" key={s.slug} className="chip" aria-pressed={form.services.includes(s.slug)} onClick={() => toggleService(s.slug)}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="field span-2">
              <label htmlFor="f-message">The project</label>
              <textarea id="f-message" rows={6} value={form.message} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} placeholder="What are you building, why now, and what does success look like?" />
              {errors.message && <p className="err">{errors.message}</p>}
            </div>
            <div className="span-2">
              <button type="submit" className="btn btn--primary" style={{ fontSize: '1rem', padding: '1.05rem 1.8rem' }}>
                Send the brief <span className="arrow" aria-hidden>→</span>
              </button>
              <p className="muted" style={{ marginTop: '0.9rem', fontSize: '0.85rem' }}>
                Concept-studio note: this form validates entirely in your browser and stores nothing.
              </p>
            </div>
          </form>
        )}
      </section>
    </>
  )
}
