import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import { allTags, articles, byCluster, caseStudies } from '../lib/content'
import { readyDemos } from '../lib/demos'
import { services } from '../data/services'
import { industries } from '../data/industries'
import { jobs } from '../data/jobs'
import { personSlug, team } from '../data/people'
import { CLUSTER_LABELS, CLUSTERS } from '../lib/types'
import Crumbs from '../components/Crumbs'
import Reveal from '../components/Reveal'

/**
 * Human-readable sitemap — the prerendered sitemap.xml's visible twin.
 * Every list is derived from the same data sources as the route table,
 * so it can't drift when writers and demo builders ship.
 */
export default function Sitemap() {
  const totalPages =
    2 + // home + this page
    12 + // work, lab, services, industries, approach, pricing, studio, team, careers, journal, search, resources
    4 + // contact, press, colophon + 2 legal
    services.length +
    industries.length +
    jobs.length +
    team.length +
    caseStudies.length +
    readyDemos.length +
    articles.length +
    allTags().length

  return (
    <>
      <Seo
        title="Sitemap — every page, indexed"
        description="The whole Brassfern site on one page: services, industries, case studies, lab demos, journal clusters, people, careers and legal."
        path="/sitemap"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Sitemap', path: '/sitemap' }])]}
      />
      <header className="article-head container">
        <Crumbs items={[{ name: 'Home', path: '/' }, { name: 'Sitemap' }]} />
        <Reveal className="overline">Sitemap</Reveal>
        <h1 className="display">Every path in <em>the garden</em></h1>
        <p className="lead lead--wide">
          {totalPages}+ pages and counting, indexed by hand — services, case studies, live demos, a journal of {articles.length} articles, and the people who (fictionally) wrote them. Lost already? Try the <Link to="/search" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '0.18em' }}>search</Link>.
        </p>
      </header>

      <div className="section container map-grid">
        <div className="map-block">
          <Reveal className="overline">Start here</Reveal>
          <ul className="map-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/work">Work</Link></li>
            <li><Link to="/lab">Lab</Link></li>
            <li><Link to="/approach">Approach</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/studio">Studio</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/press">Press</Link></li>
          </ul>
        </div>

        <div className="map-block">
          <Reveal className="overline">Services</Reveal>
          <ul className="map-list">
            {services.map((s) => (
              <li key={s.slug}><Link to={`/services/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
          <Reveal className="overline" style={{ marginTop: 'var(--space-6)' }}>Industries</Reveal>
          <ul className="map-list">
            {industries.map((i) => (
              <li key={i.slug}><Link to={`/industries/${i.slug}`}>{i.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="map-block">
          <Reveal className="overline">The journal</Reveal>
          <ul className="map-list">
            {CLUSTERS.map((c) => (
              <li key={c}>
                <Link to={`/journal/${c}`}>{CLUSTER_LABELS[c]}</Link>
                <span className="map-count">{byCluster(c).length}</span>
              </li>
            ))}
          </ul>
          <p className="mono map-note">
            Plus {allTags().length} tag pages · <Link to="/journal/tag/accessibility">e.g. #accessibility</Link>
          </p>
        </div>

        <div className="map-block">
          <Reveal className="overline">The lab — {readyDemos.length} live demos</Reveal>
          <ul className="map-list">
            {readyDemos.map((d) => (
              <li key={d.slug}><Link to={`/lab/${d.slug}`}>{d.title}</Link></li>
            ))}
          </ul>
        </div>

        <div className="map-block">
          <Reveal className="overline">People &amp; careers</Reveal>
          <ul className="map-list">
            {team.map((p) => (
              <li key={p.name}><Link to={`/team/${personSlug(p.name)}`}>{p.name}</Link></li>
            ))}
          </ul>
          <Reveal className="overline" style={{ marginTop: 'var(--space-6)' }}>Open roles</Reveal>
          <ul className="map-list">
            {jobs.map((j) => (
              <li key={j.slug}><Link to={`/careers/${j.slug}`}>{j.title}</Link></li>
            ))}
          </ul>
        </div>

        <div className="map-block">
          <Reveal className="overline">The fine print</Reveal>
          <ul className="map-list">
            <li><Link to="/colophon">Colophon</Link></li>
            <li><Link to="/legal/privacy">Privacy</Link></li>
            <li><Link to="/legal/terms">Terms</Link></li>
            <li><Link to="/press">Press kit</Link></li>
          </ul>
          <p className="mono map-note">
            Machine-readable twin at /sitemap.xml · feed at /rss.xml
          </p>
        </div>
      </div>

      <section className="section container">
        <Reveal className="overline">Case studies — all {caseStudies.length}</Reveal>
        <ul className="map-list map-list--cols" style={{ marginTop: 'var(--space-5)' }}>
          {caseStudies.map((c) => (
            <li key={c.slug}>
              <Link to={`/work/${c.slug}`}>{c.title}</Link>
              <span className="map-count">{c.client}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
