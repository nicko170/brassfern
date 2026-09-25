import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import { team } from '../data/people'
import Portrait from '../components/Portrait'
import Reveal from '../components/Reveal'

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
              <Portrait person={p} />
              <figcaption>
                <b>{p.name}</b>
                <span>{p.role} — {p.location}</span>
                <p className="muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{p.line}</p>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
