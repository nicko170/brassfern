import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import { articles, byCluster, formatDate } from '../lib/content'
import { ArticleCard, ArticleFeature } from '../components/Cards'
import Reveal from '../components/Reveal'

/** Cross-cluster pieces that read as tools, not essays. */
const TOOL_TAGS = new Set(['checklist', 'audit', 'template'])

export default function Resources() {
  const playbooks = byCluster('playbooks')
  const lead = playbooks[0]
  const rest = playbooks.slice(1)
  const tools = articles
    .filter((a) => a.cluster !== 'playbooks' && a.tags.some((t) => TOOL_TAGS.has(t)))
    .slice(0, 6)

  return (
    <>
      <Seo
        title="Resources"
        description="Guides, checklists and templates from the Brassfern studio — briefs, audits, estimators and playbooks you can steal."
        path="/resources"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Resources</Reveal>
        <h1 className="display">Steal our <em>homework</em></h1>
        <p className="lead lead--wide">
          The checklists, audits and playbooks we use internally, published because good process should be free. Take them, adapt them, credit optional.
        </p>
      </header>

      {lead && (
        <section className="section container" style={{ paddingBottom: 0 }}>
          <ArticleFeature a={lead} label="The latest playbook" />
        </section>
      )}

      {rest.length > 0 && (
        <section className="section container">
          <Reveal className="overline">The playbooks</Reveal>
          <h2 className="display h-3" style={{ marginTop: '1rem' }}>
            {playbooks.length} ways to run a better project
          </h2>
          <div className="resource-rows" style={{ marginTop: 'var(--space-6)' }}>
            {rest.map((a, i) => (
              <Link key={a.slug} to={`/journal/${a.cluster}/${a.slug}`} className="resource-row">
                <span className="resource-row__num mono">{String(i + 2).padStart(2, '0')}</span>
                <span className="resource-row__title">{a.title}</span>
                <span className="resource-row__meta mono">
                  {formatDate(a.date)} · {a.readingTime} min
                </span>
                <span className="resource-row__arrow" aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {tools.length > 0 && (
        <section className="section section--tight container">
          <hr className="rule" style={{ marginBottom: 'var(--space-6)' }} />
          <div className="split-head">
            <div>
              <Reveal className="overline">From the journal</Reveal>
              <h2 className="display h-3" style={{ marginTop: '1rem' }}>Checklists, audits &amp; templates</h2>
            </div>
            <Link to="/journal/playbooks" className="link-line">Playbooks in the journal</Link>
          </div>
          <div className="card-grid card-grid--3" style={{ marginTop: 'var(--space-6)' }}>
            {tools.map((a) => (
              <ArticleCard key={`${a.cluster}/${a.slug}`} a={a} />
            ))}
          </div>
        </section>
      )}

      {playbooks.length === 0 && (
        <section className="section container">
          <p className="lead">
            The first playbooks are being typeset. Browse the <Link to="/journal/playbooks" className="link-line">Playbooks cluster</Link> soon.
          </p>
        </section>
      )}
    </>
  )
}
