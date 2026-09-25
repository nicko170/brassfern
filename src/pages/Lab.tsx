import { Suspense, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { demos, getDemo, type DemoEntry } from '../lib/demos'
import { breadcrumbLd } from '../lib/jsonld'
import { DemoCard } from '../components/Cards'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

export function LabIndex() {
  return (
    <>
      <Seo
        title="Lab — live demos"
        description="Working mini-products built by Brassfern squads: storefronts, dashboards, configurators and more. Each one is real — click around."
        path="/lab"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Lab', path: '/lab' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">The Lab</Reveal>
        <h1 className="display">Demos you can <em>touch</em></h1>
        <p className="lead lead--wide">
          Every case study deserves proof. These are real, working mini-products built to production standards — each with its own art direction, its own fictional client, and its own case study.
        </p>
      </header>
      {demos.length > 0 && (
        <section className="container" style={{ marginTop: 'var(--space-6)' }}>
          <LabFeature demo={demos[0]} />
        </section>
      )}
      <section className="section container">
        {demos.length > 1 ? (
          <div className="card-grid card-grid--3">
            {demos.slice(1).map((d) => (
              <DemoCard key={d.slug} d={d} />
            ))}
          </div>
        ) : demos.length === 1 ? (
          <p className="lead">More demos join the bench each sprint — this is the first of many.</p>
        ) : (
          <p className="lead">The first demos are on the bench. Check back after the next Friday demo.</p>
        )}
      </section>
    </>
  )
}

/** Big night-band feature for the newest demo in the Lab. */
function LabFeature({ demo }: { demo: DemoEntry }) {
  return (
    <div className="night lab-feature">
      <div className="lab-feature__copy">
        <Reveal className="overline overline--night">Latest from the bench</Reveal>
        <h2 className="display h-2" style={{ marginTop: '1rem' }}>{demo.title}</h2>
        <p className="lab-feature__desc">{demo.description}</p>
        <p className="mono" style={{ color: 'var(--night-mute)', fontSize: 'var(--fs-micro)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {demo.client} · {demo.tags.slice(0, 4).join(' · ')}
        </p>
        <p style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Link to={`/lab/${demo.slug}`} className="btn btn--brass">
            Open the demo <span className="arrow" aria-hidden>→</span>
          </Link>
          {demo.caseStudy && (
            <Link to={`/work/${demo.caseStudy}`} className="link-line" style={{ color: 'var(--brass-hi)', alignSelf: 'center' }}>
              Read the case study
            </Link>
          )}
        </p>
      </div>
      <Link to={`/lab/${demo.slug}`} className="lab-feature__art" aria-hidden tabIndex={-1}>
        <span>{demo.client.slice(0, 2).toUpperCase()}</span>
      </Link>
    </div>
  )
}

export function LabDemo() {
  const { slug } = useParams()
  const demo = slug ? getDemo(slug) : undefined
  const [about, setAbout] = useState(false)
  if (!demo || !demo.Component) return <NotFound />
  const Demo = demo.Component

  return (
    <>
      <Seo
        title={`${demo.title} — Lab demo`}
        description={demo.description}
        path={`/lab/${demo.slug}`}
        robots="noindex,follow"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Lab', path: '/lab' }, { name: demo.title, path: `/lab/${demo.slug}` }])]}
      />
      <div>
        <div className="lab-bar">
          <Link to="/lab" aria-label="Back to the Lab">← Lab</Link>
          <span className="lab-bar__title">{demo.client} — {demo.title}</span>
          <span style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            {demo.caseStudy && <Link to={`/work/${demo.caseStudy}`}>Case study</Link>}
            <button
              onClick={() => setAbout(!about)}
              aria-expanded={about}
              style={{ background: 'none', border: 'none', color: 'var(--brass-hi)', cursor: 'pointer', font: 'inherit', padding: 0 }}
            >
              {about ? 'Close' : 'About this demo'}
            </button>
          </span>
        </div>
        {about && (
          <div className="lab-about">
            <p className="mono" style={{ color: 'var(--brass-2)', marginBottom: '0.75rem' }}>
              brassfern lab · {demo.tags.join(' · ')}
            </p>
            <p>{demo.description}</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              A working demo built by Brassfern for the fictional client “{demo.client}”. Data is mocked; the craft is real.
            </p>
          </div>
        )}
        <div className="demo-frame">
          <Suspense fallback={<div className="container section"><div className="skel"><span /><span /><span /><span /></div></div>}>
            <Demo />
          </Suspense>
        </div>
      </div>
    </>
  )
}
