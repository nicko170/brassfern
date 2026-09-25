import { Link } from 'react-router-dom'
import Fern from '../components/Fern'
import Reveal from '../components/Reveal'
import { Seo } from '../lib/head'
import { organizationLd, websiteLd } from '../lib/jsonld'
import { clients, testimonials } from '../data/clients'
import { services } from '../data/services'
import { articles, caseStudies } from '../lib/content'
import { demos } from '../lib/demos'
import { ArticleCard, WorkCard } from '../components/Cards'

function WordmarkWall() {
  const row = [...clients, ...clients] // duplicated for the -50% marquee loop
  return (
    <section className="marquee" aria-label="Selected clients">
      <div className="marquee__track">
        {row.map((c, i) => (
          <span key={`${c.name}-${i}`} className={`wordmark wordmark--${c.style}`} aria-hidden={i >= clients.length}>
            {c.name}
          </span>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  // Prefer case studies with real hero art for the front-page reel.
  const featured = caseStudies
    .filter((cs) => cs.heroImage)
    .concat(caseStudies.filter((cs) => !cs.heroImage))
    .slice(0, 3)
  const latest = articles.slice(0, 3)
  const featuredTestimonials = testimonials.slice(0, 3)

  return (
    <>
      <Seo
        title="Brassfern — Software with a heartbeat"
        description="Brassfern is an independent digital product studio in Sydney. Brand, websites, product engineering, e-commerce, AI and growth — shipped by small senior squads."
        path="/"
        jsonLd={[organizationLd(), websiteLd()]}
      />

      {/* ——— hero ——— */}
      <section className="hero">
        <Fern />
        <div className="container hero__in">
          <Reveal className="overline">Independent product studio — Sydney · Singapore · London</Reveal>
          <h1 className="display h-hero hero__title">
            Software with a <em>heartbeat.</em>
          </h1>
          <Reveal delay={120}>
            <p className="lead">
              We are designers, engineers and writers who build brands, sites and products that feel alive — and can prove they work.
            </p>
          </Reveal>
          <div className="hero__meta">
            <Link to="/work" className="btn btn--primary">
              See the work <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link to="/contact" className="btn btn--ghost">
              Start a project
            </Link>
            <span className="mono muted">Est. 2014 · 45 people · zero juniors on your budget</span>
          </div>
        </div>
        <p className="hero__scroll">Scroll — the fern waits</p>
      </section>

      <WordmarkWall />

      {/* ——— featured work ——— */}
      <section className="section">
        <div className="container">
          <div className="split-head">
            <div>
              <Reveal className="overline">Selected work</Reveal>
              <h2 className="display h-2" style={{ marginTop: '1rem' }}>
                Proof, not <em>promises</em>
              </h2>
            </div>
            <Link to="/work" className="link-line">All case studies</Link>
          </div>
          {featured.length > 0 ? (
            <div className="card-grid card-grid--3">
              {featured.map((cs, i) => (
                <Reveal key={cs.slug} delay={i * 90}>
                  <WorkCard cs={cs} index={i} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="lead">Case studies are being grown. Visit the <Link to="/lab" className="link-line">Lab</Link> in the meantime.</p>
          )}
          {demos.length > 0 && (
            <p style={{ marginTop: 'var(--space-6)' }}>
              <Link className="link-line" to="/lab">And {demos.length} live demo{demos.length > 1 ? 's' : ''} in the Lab →</Link>
            </p>
          )}
        </div>
      </section>

      {/* ——— services ——— */}
      <section className="section section--tight">
        <div className="container">
          <Reveal className="overline">What we do</Reveal>
          <h2 className="display h-2" style={{ marginBlock: '1rem 3rem' }}>
            Six crafts, <em>one squad</em>
          </h2>
          <div className="rows">
            {services.map((s) => (
              <Link to={`/services/${s.slug}`} className="row-link" key={s.slug}>
                <span className="row-link__num">{s.num}</span>
                <h3>{s.name}</h3>
                <span className="row-link__arrow" aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ——— point of view ——— */}
      <section className="night section">
        <div className="container">
          <Reveal className="overline overline--night">Our point of view</Reveal>
          <Reveal delay={80}>
            <p className="pov-quote" style={{ marginBlock: '1.5rem 4rem' }}>
              Most agencies sell you a process. We would rather show you a <em>working product</em> every Friday and let the demos do the talking.
            </p>
          </Reveal>
          <div className="pov-grid">
            {[
              { t: 'Small senior squads', p: 'Three to five people who have shipped together for years. No account-layer telephone game — the people you meet are the people who build.' },
              { t: 'Fixed scope, honest numbers', p: 'We name the price, the date and the kill criteria up front. If an idea is not working, we say so while it is still cheap.' },
              { t: 'Ship in public', p: 'Staging links from week one, a demo every Friday, and a changelog you can actually read. Progress you can click.' },
            ].map((v, i) => (
              <Reveal key={v.t} delay={i * 90} className="pov-item">
                <span className="card__index">0{i + 1}</span>
                <h3>{v.t}</h3>
                <p>{v.p}</p>
              </Reveal>
            ))}
          </div>
          <p style={{ marginTop: 'var(--space-6)' }}>
            <Link to="/approach" className="link-line" style={{ color: 'var(--brass-hi)' }}>How we work →</Link>
          </p>
        </div>
      </section>

      {/* ——— stats ——— */}
      <section className="section">
        <div className="container">
          <Reveal className="overline">The studio in numbers</Reveal>
          <div className="stats" style={{ marginTop: 'var(--space-6)' }}>
            {[
              { n: '12', l: 'Years independent' },
              { n: '45', l: 'Designers, engineers, writers' },
              { n: '130+', l: 'Products shipped' },
              { n: '4', l: 'Time zones, one standard' },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 70} className="stat">
                <b>{s.n}</b>
                <span>{s.l}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— testimonials ——— */}
      <section className="section section--tight" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <Reveal className="overline">Kind words</Reveal>
          <div className="pov-grid" style={{ marginTop: 'var(--space-6)' }}>
            {featuredTestimonials.map((t, i) => (
              <Reveal as="figure" key={t.name} delay={i * 90} className="quote-block">
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>
                  {t.name} — {t.title}, {t.company}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— latest journal ——— */}
      {latest.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="split-head">
              <div>
                <Reveal className="overline">From the journal</Reveal>
                <h2 className="display h-2" style={{ marginTop: '1rem' }}>
                  Thinking, <em>in public</em>
                </h2>
              </div>
              <Link to="/journal" className="link-line">All articles</Link>
            </div>
            <div className="card-grid card-grid--3">
              {latest.map((a, i) => (
                <Reveal key={a.slug} delay={i * 90}>
                  <ArticleCard a={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— CTA ——— */}
      <section className="section" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Reveal>
            <h2 className="display h-1" style={{ marginInline: 'auto', maxWidth: '15ch' }}>
              Your move, <em>founder.</em>
            </h2>
            <p className="lead" style={{ margin: '1.5rem auto 2.5rem' }}>
              Tell us what you are building. We will tell you honestly whether we are the right squad — usually within two business days.
            </p>
            <Link to="/contact" className="btn btn--brass" style={{ fontSize: '1.05rem', padding: '1.1rem 2rem' }}>
              Start the conversation <span className="arrow" aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
