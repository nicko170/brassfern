import { Link, useParams } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd, personLd } from '../lib/jsonld'
import { personBySlug, personSlug, team, type Person } from '../data/people'
import { articles, caseStudies } from '../lib/content'
import { ArticleCard, WorkCard } from '../components/Cards'
import Portrait from '../components/Portrait'
import Crumbs from '../components/Crumbs'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

function countAuthored(p: Person) {
  const a = articles.filter((x) => x.author === p.name).length
  const c = caseStudies.filter((x) => x.author === p.name).length
  return { articles: a, cases: c, total: a + c }
}

export default function Team() {
  return (
    <>
      <Seo
        title="Team"
        description="The (fictional) people of Brassfern: 45 designers, engineers, strategists and writers across Sydney, Wellington, Auckland, Singapore and London."
        path="/team"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Team', path: '/team' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">Team</Reveal>
        <h1 className="display">The <em>squad</em> behind the squads</h1>
        <p className="lead lead--wide">
          Senior people, pictured honestly — which is to say, as illustrations. (This is a concept studio; the humans are fictional and the portraits are geometric. The standards are real.)
        </p>
      </header>
      <section className="section container">
        <div className="team-grid">
          {team.map((p, i) => (
            <Reveal as="figure" key={p.name} delay={(i % 4) * 70} className="person">
              <Link to={`/team/${personSlug(p.name)}`} className="person__link" aria-label={`${p.name}, ${p.role} — profile`}>
                <Portrait person={p} />
                <span className="person__plate">
                  <b>{p.name}</b>
                  <span>{p.role} — {p.location}</span>
                </span>
              </Link>
              <figcaption className="person__line muted">{p.line}</figcaption>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}

export function PersonPage() {
  const { slug } = useParams()
  const person = slug ? personBySlug(slug) : undefined
  if (!person) return <NotFound />
  const written = articles.filter((a) => a.author === person.name)
  const led = caseStudies.filter((c) => c.author === person.name)
  const counts = countAuthored(person)
  const desc = `${person.name} is ${person.role} at Brassfern, based in ${person.location}. ${
    counts.total > 0 ? `${counts.total} piece${counts.total > 1 ? 's' : ''} in the journal.` : person.line
  }`

  return (
    <>
      <Seo
        title={person.name}
        description={desc.slice(0, 158)}
        path={`/team/${personSlug(person.name)}`}
        jsonLd={[
          personLd(person),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Team', path: '/team' },
            { name: person.name, path: `/team/${personSlug(person.name)}` },
          ]),
        ]}
      />
      <header className="article-head container">
        <Crumbs items={[
          { name: 'Team', path: '/team' },
          { name: person.name },
        ]} />
        <Reveal className="overline">
          <Link to="/team" style={{ color: 'inherit' }}>Team</Link> — {person.role}
        </Reveal>
        <div className="person-hero">
          <div className="person-hero__text">
            <h1 className="display">{person.name}</h1>
            <p className="lead" style={{ maxWidth: '46ch' }}>{person.line}</p>
            <dl className="person-hero__facts">
              <div><dt>Role</dt><dd>{person.role}</dd></div>
              <div><dt>Based</dt><dd>{person.location}</dd></div>
              <div>
                <dt>In the journal</dt>
                <dd>
                  {counts.articles} article{counts.articles === 1 ? '' : 's'}
                  {counts.cases > 0 ? ` · ${counts.cases} case stud${counts.cases === 1 ? 'y' : 'ies'}` : ''}
                </dd>
              </div>
            </dl>
          </div>
          <Reveal className="person-hero__frame">
            <Portrait person={person} />
          </Reveal>
        </div>
      </header>

      {counts.total === 0 && (
        <section className="section container">
          <p className="lead">
            {person.name.split(' ')[0]} spends more time shipping than writing — the byline drought won't last.
          </p>
        </section>
      )}

      {led.length > 0 && (
        <section className="section container">
          <Reveal className="overline">Case studies</Reveal>
          <div className="card-grid card-grid--3" style={{ marginTop: 'var(--space-5)' }}>
            {led.map((c) => (
              <WorkCard key={c.slug} cs={c} />
            ))}
          </div>
        </section>
      )}

      {written.length > 0 && (
        <section className="section container" style={led.length > 0 ? { paddingTop: 0 } : undefined}>
          <hr className="rule" style={{ marginBottom: 'var(--space-6)' }} />
          <Reveal className="overline">From the journal</Reveal>
          <div className="card-grid card-grid--3" style={{ marginTop: 'var(--space-5)' }}>
            {written.map((a) => (
              <ArticleCard key={`${a.cluster}/${a.slug}`} a={a} />
            ))}
          </div>
        </section>
      )}

      <nav className="container" style={{ marginBottom: 'var(--space-7)' }} aria-label="More of the team">
        <hr className="rule" style={{ marginBottom: 'var(--space-5)' }} />
        <div className="chip-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          {team
            .filter((p) => p.name !== person.name)
            .map((p) => (
              <Link key={p.name} to={`/team/${personSlug(p.name)}`} className="tag">{p.name}</Link>
            ))}
        </div>
      </nav>
    </>
  )
}
