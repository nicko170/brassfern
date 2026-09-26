import { Link, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { getJob, jobs } from '../data/jobs'
import { breadcrumbLd, jobPostingLd } from '../lib/jsonld'
import { formatDate } from '../lib/content'
import Crumbs from '../components/Crumbs'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

export function Careers() {
  return (
    <>
      <Seo
        title="Careers"
        description="Join Brassfern: senior roles in product engineering, brand design, growth, design engineering and AI. Remote across AU/NZ, Singapore and London."
        path="/careers"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Careers</Reveal>
        <h1 className="display">Do the best work of your life, <em>then go home</em></h1>
        <p className="lead lead--wide">
          No hero hours, no open-plan theatre, no “fast-paced family”. Senior people, small squads, four-day summer Fridays, and a published salary band on every role. Work you will still be proud of in five years. (Roles shown are fictional — this is a concept studio.)
        </p>
      </header>

      <section className="section container">
        <Reveal className="overline">Open roles</Reveal>
        <div className="rows" style={{ marginTop: 'var(--space-5)' }}>
          {jobs.map((j, i) => (
            <Link to={`/careers/${j.slug}`} className="row-link" key={j.slug}>
              <span className="row-link__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{j.title}</h3>
              <span className="row-link__arrow" aria-hidden>→</span>
              <p>{j.team} · {j.location} · {j.type} · {j.salary.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="night section">
        <div className="container">
          <Reveal className="overline overline--night">The deal</Reveal>
          <div className="pov-grid" style={{ marginTop: 'var(--space-6)' }}>
            {[
              { t: 'Actual seniority', p: 'You will never be managed by someone who has not done your job. Reviews come from practitioners.' },
              { t: 'Sanity by design', p: 'Fixed scope means weekends stay yours. On-call is a product decision, not a lifestyle.' },
              { t: 'Grow in public', p: 'Write, speak, open-source. Your reputation compounds; the studio benefits. That is the whole trick.' },
            ].map((v, i) => (
              <Reveal key={v.t} delay={i * 80} className="pov-item">
                <h3>{v.t}</h3>
                <p>{v.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export function JobPage() {
  const { slug } = useParams()
  const job = slug ? getJob(slug) : undefined
  if (!job) return <NotFound />
  return (
    <>
      <Seo
        title={`${job.title} — Careers`}
        description={job.summary}
        path={`/careers/${job.slug}`}
        jsonLd={[
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }, { name: job.title, path: `/careers/${job.slug}` }]),
          jobPostingLd(job),
        ]}
      />
      <header className="article-head container">
        <Crumbs items={[
          { name: 'Careers', path: '/careers' },
          { name: job.title },
        ]} />
        <Reveal className="overline">{job.team} · {job.location} · {job.type}</Reveal>
        <h1 className="display">{job.title}</h1>
        <p className="lead lead--wide">{job.summary}</p>
      </header>
      <section className="section--tight container">
        <ul className="fact-list">
          <li><span>Salary band</span><span>{job.salary.text}</span></li>
          <li><span>Team</span><span>{job.team}</span></li>
          <li><span>Location</span><span>{job.location}</span></li>
          <li><span>Type</span><span>{job.type}</span></li>
          <li><span>Posted</span><span>{formatDate(job.posted)}</span></li>
          <li><span>Applications close</span><span>{formatDate(job.closes)}</span></li>
        </ul>
      </section>
      <section className="section container">
        <div className="two-col">
          <div>
            <h2 className="mono muted" style={{ marginBottom: '1rem' }}>What you will do</h2>
            <ul style={{ paddingLeft: '1.2em', display: 'grid', gap: '0.6rem', color: 'var(--ink-2)' }}>
              {job.doing.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="mono muted" style={{ marginBottom: '1rem' }}>What you will bring</h2>
            <ul style={{ paddingLeft: '1.2em', display: 'grid', gap: '0.6rem', color: 'var(--ink-2)' }}>
              {job.bring.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </div>
        <div style={{ marginTop: 'var(--space-7)' }}>
          <Link to="/contact" className="btn btn--primary">
            Apply via the contact form <span className="arrow" aria-hidden>→</span>
          </Link>
          <p className="muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            Mention “{job.title}” in your message. (Concept-studio disclaimer: this role is fictional, but the standards described are real.)
          </p>
        </div>
      </section>
    </>
  )
}
