import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'
import { breadcrumbLd } from '../lib/jsonld'
import Reveal from '../components/Reveal'

const principles = [
  {
    t: 'Squads, not pyramids',
    p: 'Every project gets three to five senior people: design, engineering, strategy — and a producer who keeps Friday demos sacred. Nobody bills time they did not spend building.',
  },
  {
    t: 'Fixed scope, flexed honestly',
    p: 'We scope tightly and price it fixed. When reality disagrees with the plan — it always does — we re-scope together in week-zero terms, not in a change-order ambush.',
  },
  {
    t: 'Demos are the deliverable',
    p: 'Every Friday, working software or real designs on a staging link. If a week produced nothing clickable, that week failed — and we say so first.',
  },
  {
    t: 'Ship in public',
    p: 'Staging URLs from day one, changelogs in plain English, decisions documented where you can find them. You never wonder what is happening with your budget.',
  },
  {
    t: 'Numbers or it did not happen',
    p: 'Every engagement defines its measurement plan before kickoff. Baselines, targets, and the honesty to report both the wins and the flatlines.',
  },
  {
    t: 'Leave it better',
    p: 'Documentation, tokens, playbooks and a handover your team thanks us for. Success is being invited back, not being needed forever.',
  },
]

const week = [
  { d: 'Monday', t: 'Cut the scope', p: 'Squad, client and producer agree exactly what this sprint proves. It fits on an index card.' },
  { d: 'Tuesday–Thursday', t: 'Heads down', p: 'Design and engineering pair daily. Async updates in your channel; meetings only when a decision needs a human.' },
  { d: 'Friday', t: 'Demo day', p: 'Twenty minutes, working software, honest commentary. Decisions get made on the spot and recorded.' },
]

export default function Approach() {
  return (
    <>
      <Seo
        title="Approach — How we work"
        description="Small senior squads, fixed-scope sprints, weekly demos and shipping in public. This is exactly how a Brassfern engagement runs, week by week."
        path="/approach"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Approach', path: '/approach' }])]}
      />
      <header className="article-head container">
        <Reveal className="overline">How we work</Reveal>
        <h1 className="display" style={{ maxWidth: '16ch' }}>Process you can <em>click on</em></h1>
        <p className="lead lead--wide">
          Most agency “process” pages are a funnel diagram and a prayer. Ours is simpler: small squads, short sprints, working demos every Friday. Here is the whole playbook.
        </p>
      </header>

      <section className="section container">
        <Reveal className="overline">Principles</Reveal>
        <h2 className="display h-2" style={{ marginBlock: '1rem 2.5rem' }}>Six rules we actually keep</h2>
        <div className="pov-grid" style={{ gap: 'var(--space-6)' }}>
          {principles.map((v, i) => (
            <Reveal key={v.t} delay={(i % 3) * 80} className="pov-item" style={{ borderTopColor: 'var(--line-strong)' }}>
              <span className="card__index">0{i + 1}</span>
              <h3>{v.t}</h3>
              <p style={{ color: 'var(--ink-2)' }}>{v.p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="night section">
        <div className="container">
          <Reveal className="overline overline--night">A week inside a sprint</Reveal>
          <h2 className="display h-2" style={{ marginBlock: '1rem 3rem', color: 'var(--night-text)' }}>
            Monday to <em>Friday</em>
          </h2>
          <div className="pov-grid">
            {week.map((w, i) => (
              <Reveal key={w.d} delay={i * 90} className="pov-item">
                <span className="card__index">{w.d}</span>
                <h3>{w.t}</h3>
                <p>{w.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="two-col">
          <div>
            <Reveal className="overline">Engagement shapes</Reveal>
            <h2 className="display h-3" style={{ marginBlock: '1rem' }}>Two shapes, no mystery</h2>
            <p className="lead" style={{ marginBottom: '1rem' }}>
              A <strong>sprint</strong> is a fixed-scope block with a single outcome — a rebrand, a checkout rebuild, an AI prototype. You know the price and the date before we start.
            </p>
            <p className="lead">
              A <strong>retainer</strong> is a standing squad on a quarterly rhythm — growth programs, product roadmaps, long builds. Same people, same Friday demo, compounding context.
            </p>
          </div>
          <div style={{ alignSelf: 'center' }}>
            <Link to="/pricing" className="btn btn--primary" style={{ marginRight: '1rem' }}>
              See pricing <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link to="/contact" className="link-line">Or just ask us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
