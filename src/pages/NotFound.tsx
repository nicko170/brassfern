import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'

export default function NotFound() {
  return (
    <>
      <Seo
        title="404 — Lost in the undergrowth"
        description="This page has not grown here. Head back to the Brassfern homepage."
        path="/404"
        robots="noindex"
      />
      <div className="notfound container">
        <p className="notfound__code" aria-hidden="true">404</p>
        <h1 className="display h-3">Lost in the undergrowth.</h1>
        <p className="muted" style={{ maxWidth: '38ch', marginInline: 'auto' }}>
          No page grows at this address. It may have been pruned, repotted, or never planted.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn--primary">Back to the canopy <span className="arrow" aria-hidden>→</span></Link>
          <Link to="/search" className="btn btn--ghost">Search instead</Link>
        </div>
      </div>
    </>
  )
}
