import type { Account } from './data'
import { fmt } from './data'
import Icon from './icons'

interface MoreProps {
  frozen: boolean
  toggleFreeze: () => void
  notifications: boolean
  toggleNotifications: () => void
  openStatements: () => void
  cardAccount: Account
}

export default function More({ frozen, toggleFreeze, notifications, toggleNotifications, openStatements, cardAccount }: MoreProps) {
  return (
    <div className="cl-view" key="more">
      <header className="cl-viewhead">
        <h1 className="cl-h1">
          The <em>useful</em> drawer
        </h1>
        <p className="cl-sub">Everything a bank app needs, nothing it doesn't.</p>
      </header>

      <section className={`cl-cardvis${frozen ? ' is-frozen' : ''}`} aria-label={`Debit card ${frozen ? 'frozen' : 'active'}`}>
        <div className="cl-cardvis__row">
          <span className="cl-cardvis__brand">
            Copperline <em>mutual</em>
          </span>
          {frozen && (
            <span className="cl-pill cl-pill--ice">
              <Icon glyph="lock" size={12} /> Frozen
            </span>
          )}
        </div>
        <p className="cl-cardvis__num cl-ser" aria-label="Card number ending in 2246">
          •••• •••• •••• 2246
        </p>
        <div className="cl-cardvis__row cl-cardvis__row--end">
          <span>Ada Lim</span>
          <span>09 / 29</span>
        </div>
      </section>

      <ul className="cl-rows">
        <li>
          <button className="cl-row" onClick={openStatements}>
            <span className="cl-row__ico">
              <Icon glyph="doc" size={17} />
            </span>
            <span className="cl-row__main">
              <span className="cl-row__title">Statements &amp; documents</span>
              <span className="cl-row__meta">PDF or CSV, tax-time friendly</span>
            </span>
            <Icon glyph="upRight" size={15} />
          </button>
        </li>
        <li className="cl-row cl-row--static">
          <span className="cl-row__ico">
            <Icon glyph={frozen ? 'lock' : 'card'} size={17} />
          </span>
          <span className="cl-row__main">
            <span className="cl-row__title">Freeze card</span>
            <span className="cl-row__meta">{frozen ? `Frozen · ${cardAccount.number} blocked instantly` : 'One tap, applies instantly'}</span>
          </span>
          <button
            className={`cl-switch${frozen ? ' is-on' : ''}`}
            role="switch"
            aria-checked={frozen}
            aria-label="Freeze card"
            onClick={toggleFreeze}
          >
            <span />
          </button>
        </li>
        <li className="cl-row cl-row--static">
          <span className="cl-row__ico">
            <Icon glyph="bell" size={17} />
          </span>
          <span className="cl-row__main">
            <span className="cl-row__title">Spend alerts</span>
            <span className="cl-row__meta">Ping me when money moves</span>
          </span>
          <button
            className={`cl-switch${notifications ? ' is-on' : ''}`}
            role="switch"
            aria-checked={notifications}
            aria-label="Spend alerts"
            onClick={toggleNotifications}
          >
            <span />
          </button>
        </li>
        <li>
          <a className="cl-row" href="tel:133321">
            <span className="cl-row__ico">
              <Icon glyph="phone" size={17} />
            </span>
            <span className="cl-row__main">
              <span className="cl-row__title">Call a person</span>
              <span className="cl-row__meta">13 33 21 · answered in two rings, Castlemaine time</span>
            </span>
            <Icon glyph="upRight" size={15} />
          </a>
        </li>
      </ul>

      <section className="cl-panel cl-panel--soft">
        <h2 className="cl-sect-h">Good to know</h2>
        <p className="cl-panel__note">
          Copperline Mutual is owned by its members — that's you. Eleven branches across regional Victoria, zero
          shareholders to please, and a profits-to-community program that has funded 214 local projects since 1998.
        </p>
        <p className="cl-balance-line">
          Everyday balance right now: <strong className="cl-ser">{fmt(cardAccount.balance)}</strong>
        </p>
      </section>

      <p className="cl-fineprint">
        Copperline app · build 4.2.1 · concept build, every figure fictional. No real money was moved in the making of
        this screen. {frozen ? ' Your card stays frozen until you unfreeze it.' : ''}
      </p>
    </div>
  )
}
