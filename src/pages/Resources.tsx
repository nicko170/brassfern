import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import { byCluster } from '../lib/content'
import { ArticleCard } from '../components/Cards'
import Reveal from '../components/Reveal'

export default function Resources() {
  const playbooks = byCluster('playbooks').slice(0, 6)
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
          The checklists and playbooks we use internally, published because good process should be free. New guides land with the journal’s Playbooks cluster.
        </p>
      </header>
      <section className="section container">
        {playbooks.length > 0 ? (
          <div className="card-grid card-grid--3">
            {playbooks.map((a) => (
              <ArticleCard key={`${a.cluster}/${a.slug}`} a={a} />
            ))}
          </div>
        ) : (
          <p className="lead">
            The first playbooks are being typeset. Browse the <Link to="/journal/playbooks" className="link-line">Playbooks cluster</Link> soon.
          </p>
        )}
      </section>
    </>
  )
}
