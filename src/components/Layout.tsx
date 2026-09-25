import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { HeadContext, type HeadCollector, createCollector } from '../lib/head'
import { services } from '../data/services'
import { CLUSTERS, CLUSTER_LABELS } from '../lib/types'

export function FernMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none">
        <path d="M16 27 C16 20 16 12 16 6" />
        <path d="M16 23 C13 22 11 20 10.5 17.5" />
        <path d="M16 23 C19 22 21 20 21.5 17.5" />
        <path d="M16 19 C13.6 18 12 16.4 11.6 14" />
        <path d="M16 19 C18.4 18 20 16.4 20.4 14" />
        <path d="M16 15 C14.2 14 13 12.8 12.8 11" />
        <path d="M16 15 C17.8 14 19 12.8 19.2 11" />
      </g>
    </svg>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

const NAV = [
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/lab', label: 'Lab' },
  { to: '/journal', label: 'Journal' },
  { to: '/studio', label: 'Studio' },
]

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  return (
    <>
      <header className="site-head">
        <div className="container site-head__in">
          <Link to="/" className="brand" aria-label="Brassfern home">
            <FernMark />
            <span>Brassfern</span>
          </Link>
          <nav className="site-nav" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/contact" className="btn btn--primary site-head__cta">
            Start a project <span className="arrow" aria-hidden>→</span>
          </Link>
          <button className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>
      <div className={`mobile-menu${open ? ' open' : ''}`} id="mobile-menu" aria-hidden={!open}>
        <div className="mobile-menu__top">
          <Link to="/" className="brand" tabIndex={open ? 0 : -1}>
            <FernMark /> <span>Brassfern</span>
          </Link>
        </div>
        <nav className="mobile-menu__links" aria-label="Mobile">
          {[...NAV, { to: '/contact', label: 'Contact' }].map((n, i) => (
            <Link key={n.to} to={n.to} tabIndex={open ? 0 : -1}>
              {n.label} <span aria-hidden>0{i + 1}</span>
            </Link>
          ))}
        </nav>
        <p className="mobile-menu__foot">Sydney · Singapore · London — est. 2014</p>
      </div>
    </>
  )
}

function Footer() {
  return (
    <footer className="site-foot">
      <div className="container foot-cta">
        <p className="overline overline--night">Next step</p>
        <h2 className="display">
          Have something <em>worth building?</em>
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn btn--brass">
            Start a project <span className="arrow" aria-hidden>→</span>
          </Link>
          <Link to="/pricing" className="btn btn--ghost" style={{ color: 'var(--night-text)', borderColor: 'var(--night-line)' }}>
            See how we charge
          </Link>
        </div>
      </div>
      <div className="container foot-grid">
        <div className="foot-col foot-brand">
          <Link to="/" className="brand" style={{ color: 'var(--night-text)' }}>
            <FernMark /> <span>Brassfern</span>
          </Link>
          <p>
            An independent product studio in Surry Hills, Sydney. Squads across AU/NZ, Singapore and London. Software with a heartbeat since 2014.
          </p>
        </div>
        <div className="foot-col">
          <h3>Services</h3>
          <ul>
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="foot-col">
          <h3>Studio</h3>
          <ul>
            <li><Link to="/work">Work</Link></li>
            <li><Link to="/lab">Lab</Link></li>
            <li><Link to="/approach">Approach</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="foot-col">
          <h3>Journal</h3>
          <ul>
            {CLUSTERS.slice(0, 5).map((c) => (
              <li key={c}>
                <Link to={`/journal/${c}`}>{CLUSTER_LABELS[c]}</Link>
              </li>
            ))}
            <li><Link to="/journal">All writing</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/legal/privacy">Privacy</Link></li>
            <li><Link to="/legal/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="container foot-colophon">
        <p>
          Brassfern is a concept studio. This site — every page, article and demo — was designed and built autonomously by Kimi&nbsp;K3 running on GreenThread. All clients, people and metrics are fictional.
        </p>
        <p>© {new Date().getFullYear()} Brassfern Pty Ltd (fictional). Grown in Surry Hills.</p>
      </div>
    </footer>
  )
}

export default function Layout({ head }: { head?: HeadCollector }) {
  const [fallback] = useState(() => createCollector())
  return (
    <HeadContext.Provider value={head ?? fallback}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </HeadContext.Provider>
  )
}

export function Grain() {
  return <div className="grain" aria-hidden="true" />
}

export function LayoutShell({ children }: { children: ReactNode }) {
  return <>{children}</>
}
