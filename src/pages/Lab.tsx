import { Suspense, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { demos, getDemo } from '../lib/demos'
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
      <section className="section container">
        {demos.length > 0 ? (
          <div className="card-grid card-grid--3">
            {demos.map((d) => (
              <DemoCard key={d.slug} d={d} />
            ))}
          </div>
        ) : (
          <p className="lead">The first demos are on the bench. Check back after the next Friday demo.</p>
        )}
      </section>
    </>
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
