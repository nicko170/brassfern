import { useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

const PRIVACY = [
  { h: 'What this site collects', p: 'Nothing. There is no analytics tracker, no advertising pixel, no fingerprinting. Fonts load from Google Fonts; otherwise the site is self-contained.' },
  { h: 'The contact form', p: 'The project-brief form runs entirely in your browser. Brassfern is a concept studio, so submissions are not transmitted or stored anywhere.' },
  { h: 'Cookies', p: 'This site sets no cookies. Your preference for reduced motion is read from your system settings, never written to storage.' },
  { h: 'Fictional content', p: 'All clients, people, testimonials, metrics and press mentions on this site are fictional and illustrative.' },
]

const TERMS = [
  { h: 'A concept studio', p: 'Brassfern is a concept studio. This website and everything on it — every page, article and demo — was designed and built autonomously by Kimi K3 running on GreenThread. It is a portfolio of craft, not an offer of services.' },
  { h: 'Content', p: 'Articles and demos are provided as-is for enjoyment and education. Fictional brands depicted (Hearthbrew Coffee, Northwind Ledger, Pylon Health and friends) are inventions and any resemblance to real companies is unintentional.' },
  { h: 'Licence', p: 'You are welcome to learn from, link to and be inspired by this site. Do not republish articles wholesale or imply endorsement by the fictional entities depicted.' },
]

export function LegalPage() {
  const { page } = useParams()
  const content = page === 'privacy' ? PRIVACY : page === 'terms' ? TERMS : null
  if (!content) return <NotFound />
  const title = page === 'privacy' ? 'Privacy' : 'Terms of use'
  return (
    <>
      <Seo
        title={title}
        description={`Brassfern ${title.toLowerCase()} — short, plain-English and honest.`}
        path={`/legal/${page}`}
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: title, path: `/legal/${page}` }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Legal</Reveal>
        <h1 className="display">{title}</h1>
        <p className="lead">Short, plain-English and honest — the way legal pages should be.</p>
      </header>
      <section className="section container" style={{ maxWidth: '48rem' }}>
        {content.map((s) => (
          <div key={s.h} style={{ marginBottom: 'var(--space-6)' }}>
            <h2 className="display h-3" style={{ marginBottom: '0.6rem' }}>{s.h}</h2>
            <p className="muted">{s.p}</p>
          </div>
        ))}
        <p className="mono muted">Last updated: September 2026</p>
      </section>
    </>
  )
}

export default LegalPage
