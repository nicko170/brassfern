import { useRef, useState, type CSSProperties, type UIEvent } from 'react'
import type { Account, Pot, Txn } from './data'
import { catOf, dayLabel, fmt, fmtWhole, greeting, MEMBER, weeklySpend, TODAY } from './data'
import Icon from './icons'
import { useTweenNumber } from './hooks'

interface HomeProps {
  accounts: Account[]
  pots: Pot[]
  txns: Txn[]
  frozen: boolean
  reduced: boolean
  go: (view: string) => void
  openStatements: () => void
  toggleFreeze: () => void
}

function Balance({ value, reduced }: { value: number; reduced: boolean }) {
  const v = useTweenNumber(value, reduced)
  return <span className="cl-ser">{fmt(v)}</span>
}

export default function Home({ accounts, pots, txns, frozen, reduced, go, openStatements, toggleFreeze }: HomeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [card, setCard] = useState(0)

  const potsTotal = pots.reduce((s, p) => s + p.saved, 0)
  const potsGoal = pots.reduce((s, p) => s + p.goal, 0)
  const weeks = weeklySpend(txns)
  const maxWeek = Math.max(...weeks.map((w) => w.total), 1)
  const latest = txns.slice(0, 3)
  const funded = pots.filter((p) => p.saved >= p.goal).length

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const first = el.firstElementChild as HTMLElement | null
    if (!first) return
    const w = first.offsetWidth + 12
    setCard(Math.max(0, Math.min(2, Math.round(el.scrollLeft / w))))
  }

  const scrollToCard = (i: number) => {
    const el = trackRef.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return
    el.scrollTo({ left: i * (first.offsetWidth + 12), behavior: reduced ? 'auto' : 'smooth' })
  }

  const todayLabel = new Date(TODAY + 'T12:00:00').toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const streak = pots.filter((p) => p.saved > 0).length

  return (
    <div className="cl-view" key="home">
      <header className="cl-top">
        <div>
          <p className="cl-overline">{todayLabel}</p>
          <h1 className="cl-h1">
            {greeting()}, <em>{MEMBER.first}</em>
          </h1>
        </div>
        <div className="cl-top__side">
          <button className="cl-iconbtn" aria-label="Notifications, 2 unread">
            <Icon glyph="bell" size={18} />
            <span className="cl-iconbtn__dot" aria-hidden="true" />
          </button>
          <span className="cl-avatar" aria-label={`Signed in as ${MEMBER.name}`} role="img">
            {MEMBER.initials}
          </span>
        </div>
      </header>

      {/* account carousel */}
      <section aria-roledescription="carousel" aria-label="Your accounts">
        <div className="cl-carousel" ref={trackRef} onScroll={onScroll} tabIndex={0} aria-label="Account cards, scroll horizontally">
          <article className="cl-acct cl-acct--everyday" aria-roledescription="slide" aria-label="1 of 3: Everyday account">
            <div className="cl-acct__head">
              <span className="cl-acct__name">{accounts[0].name}</span>
              <span className="cl-acct__no">
                {accounts[0].bsb} · {accounts[0].number}
              </span>
            </div>
            <p className="cl-acct__bal">
              <Balance value={accounts[0].balance} reduced={reduced} />
            </p>
            <div className="cl-acct__foot">
              <span>Available now</span>
              <span className={frozen ? 'cl-pill cl-pill--ice' : 'cl-pill'}>{frozen ? 'Card frozen' : 'Card active'}</span>
            </div>
          </article>

          <article className="cl-acct cl-acct--saver" aria-roledescription="slide" aria-label="2 of 3: Bonus Saver account">
            <div className="cl-acct__head">
              <span className="cl-acct__name">{accounts[1].name}</span>
              <span className="cl-acct__no">
                {accounts[1].bsb} · {accounts[1].number}
              </span>
            </div>
            <p className="cl-acct__bal">
              <Balance value={accounts[1].balance} reduced={reduced} />
            </p>
            <div className="cl-acct__foot">
              <span>4.10% p.a. bonus rate</span>
              <span className="cl-pill">Interest monthly</span>
            </div>
          </article>

          <article className="cl-acct cl-acct--pots" aria-roledescription="slide" aria-label="3 of 3: savings pots summary">
            <div className="cl-acct__head">
              <span className="cl-acct__name">Pots</span>
              <span className="cl-acct__no">{pots.length} on the go</span>
            </div>
            <p className="cl-acct__bal">
              <span className="cl-ser">{fmt(potsTotal)}</span>
            </p>
            <div className="cl-acct__foot">
              <span>
                {Math.round((potsTotal / potsGoal) * 100)}% of {fmtWhole(potsGoal)} of goals
                {funded > 0 ? ` · ${funded} funded` : ''}
              </span>
              <button className="cl-pillbtn" onClick={() => go('pots')}>
                Open <Icon glyph="chevronL" size={13} />
              </button>
            </div>
          </article>
        </div>
        <div className="cl-dots" role="tablist" aria-label="Account carousel position">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              role="tab"
              aria-selected={card === i}
              aria-label={`Account card ${i + 1} of 3`}
              className={`cl-dot${card === i ? ' is-on' : ''}`}
              onClick={() => scrollToCard(i)}
            />
          ))}
        </div>
      </section>

      {/* quick actions */}
      <nav className="cl-quick" aria-label="Quick actions">
        <button className="cl-quick__btn" onClick={() => go('pay')}>
          <Icon glyph="pay" /> <span>Pay</span>
        </button>
        <button className="cl-quick__btn" onClick={() => go('pots')}>
          <Icon glyph="jar" /> <span>Pots</span>
        </button>
        <button className="cl-quick__btn" onClick={openStatements}>
          <Icon glyph="doc" /> <span>Statements</span>
        </button>
        <button className="cl-quick__btn" onClick={toggleFreeze} aria-pressed={frozen}>
          <Icon glyph={frozen ? 'unlock' : 'lock'} /> <span>{frozen ? 'Unfreeze' : 'Freeze'}</span>
        </button>
      </nav>

      {/* weekly pulse */}
      <section className="cl-panel" aria-labelledby="cl-pulse-h">
        <div className="cl-panel__head">
          <h2 className="cl-h2" id="cl-pulse-h">
            The weekly pulse
          </h2>
          <span className="cl-panel__hint">money out, four weeks</span>
        </div>
        <div className="cl-bars" role="img" aria-label={`Weekly spending: ${weeks.map((w) => `${w.label} ${fmtWhole(w.total)}`).join(', ')}`}>
          {weeks.map((w, i) => (
            <div className="cl-bars__col" key={w.label}>
              <span className="cl-bars__amt cl-ser">{fmtWhole(w.total)}</span>
              <span
                className={`cl-bars__bar${i === weeks.length - 1 ? ' is-now' : ''}`}
                style={{ '--h': `${Math.max(8, (w.total / maxWeek) * 100)}%` } as CSSProperties}
              />
              <span className="cl-bars__lbl">{w.label}</span>
            </div>
          ))}
        </div>
        <p className="cl-panel__note">
          {streak} pots growing · you're {fmtWhole(Math.max(0, weeks[2].total - weeks[3].total))} lighter than last week.
        </p>
      </section>

      {/* latest activity */}
      <section className="cl-panel" aria-labelledby="cl-latest-h">
        <div className="cl-panel__head">
          <h2 className="cl-h2" id="cl-latest-h">
            Latest
          </h2>
          <button className="cl-linkbtn" onClick={() => go('activity')}>
            All activity <Icon glyph="upRight" size={13} />
          </button>
        </div>
        <ul className="cl-feed">
          {latest.map((t) => (
            <li className="cl-feed__row" key={t.id}>
              <span className={`cl-feed__glyph cl-feed__glyph--${t.category}`} aria-hidden="true">
                <Icon glyph={catOf(t.category).glyph} size={16} />
              </span>
              <span className="cl-feed__main">
                <span className="cl-feed__merchant">{t.merchant}</span>
                <span className="cl-feed__meta">{t.pending ? 'Pending' : dayLabel(t.date)}</span>
              </span>
              <span className={`cl-feed__amt cl-ser${t.dir === 'in' ? ' is-in' : ''}`}>
                {fmt(t.dir === 'in' ? t.amount : -t.amount, { sign: true })}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
