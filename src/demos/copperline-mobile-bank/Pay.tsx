import { useState } from 'react'
import type { Contact } from './data'
import { CONTACTS, fmt } from './data'
import Icon from './icons'

const PAYID_RESULT: Contact = { id: 'mo', name: 'Mo Castellano', initials: 'MC', tint: 'brass', handle: '@mocastellano' }

export default function Pay({ onPay, lastSent }: { onPay: (c: Contact) => void; lastSent: string | null }) {
  const [payid, setPayid] = useState('')
  const [looked, setLooked] = useState(false)

  const recents = CONTACTS.filter((c) => c.lastPaid)
  const everyone = CONTACTS.filter((c) => !c.lastPaid)

  const lookup = () => {
    if (payid.trim().length >= 3) setLooked(true)
  }

  return (
    <div className="cl-view" key="pay">
      <header className="cl-viewhead">
        <h1 className="cl-h1">
          Pay <em>anyone</em>
        </h1>
        <p className="cl-sub">Money lands in seconds, even on a Sunday.</p>
      </header>

      {lastSent && (
        <p className="cl-banner" role="status">
          <Icon glyph="check" size={15} /> {lastSent}
        </p>
      )}

      <section aria-labelledby="cl-recent-h">
        <h2 className="cl-sect-h" id="cl-recent-h">
          Recents
        </h2>
        <ul className="cl-contacts">
          {recents.map((c) => (
            <li key={c.id}>
              <button className="cl-contact" onClick={() => onPay(c)}>
                <span className={`cl-contact__av cl-contact__av--${c.tint}`} aria-hidden="true">
                  {c.initials}
                </span>
                <span className="cl-contact__name">{c.name}</span>
                <span className="cl-contact__meta cl-ser">last · {fmt(c.lastPaid!)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cl-all-h">
        <h2 className="cl-sect-h" id="cl-all-h">
          Everyone else
        </h2>
        <ul className="cl-contacts">
          {everyone.map((c) => (
            <li key={c.id}>
              <button className="cl-contact" onClick={() => onPay(c)}>
                <span className={`cl-contact__av cl-contact__av--${c.tint}`} aria-hidden="true">
                  {c.initials}
                </span>
                <span className="cl-contact__name">{c.name}</span>
                <span className="cl-contact__meta">{c.handle}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="cl-panel" aria-labelledby="cl-new-h">
        <h2 className="cl-sect-h" id="cl-new-h">
          Someone new
        </h2>
        <p className="cl-panel__note">Pop in a PayID, mobile or email. We'll find them.</p>
        <div className="cl-payid">
          <input
            type="text"
            value={payid}
            onChange={(e) => {
              setPayid(e.target.value)
              setLooked(false)
            }}
            onKeyDown={(e) => e.key === 'Enter' && lookup()}
            placeholder="e.g. mo@makersco-op.au"
            aria-label="PayID, mobile or email"
          />
          <button className="cl-btn" onClick={lookup} disabled={payid.trim().length < 3}>
            Find
          </button>
        </div>
        {looked && (
          <button className="cl-contact cl-contact--found" onClick={() => onPay(PAYID_RESULT)}>
            <span className={`cl-contact__av cl-contact__av--${PAYID_RESULT.tint}`} aria-hidden="true">
              {PAYID_RESULT.initials}
            </span>
            <span className="cl-contact__name">{PAYID_RESULT.name}</span>
            <span className="cl-contact__meta">
              {PAYID_RESULT.handle} · <span className="cl-verified">verified</span>
            </span>
          </button>
        )}
      </section>
    </div>
  )
}
