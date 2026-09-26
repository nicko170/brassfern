import { useEffect, useRef, useState } from 'react'
import Activity from './Activity'
import Home from './Home'
import Icon from './icons'
import More from './More'
import Pay from './Pay'
import Pots from './Pots'
import { PaySheet, AllocateSheet, StatementSheet } from './sheets'
import type { Contact, Pot, Txn } from './data'
import { ACCOUNTS, fmt, INITIAL_POTS, INITIAL_TXNS, TODAY } from './data'
import { usePrefersReducedMotion } from './hooks'
import './demo.css'

/**
 * Copperline Mutual — the nice bank's member app.
 * Art direction: midnight-fern ink, mint accents, cream cards, friendly
 * serif numerals and a rounded thumb-reach tab bar. Mobile-first: this is
 * an app you hold, not a dashboard you visit. All data fictional.
 */

type View = 'home' | 'activity' | 'pay' | 'pots' | 'more'
type SheetState = null | { kind: 'pay'; contact: Contact } | { kind: 'allocate'; preset?: number } | { kind: 'statement' }

const NAV: { id: View; label: string; glyph: string }[] = [
  { id: 'home', label: 'Home', glyph: 'home' },
  { id: 'activity', label: 'Activity', glyph: 'receipt' },
  { id: 'pay', label: 'Pay', glyph: 'pay' },
  { id: 'pots', label: 'Pots', glyph: 'jar' },
  { id: 'more', label: 'More', glyph: 'dots' },
]

export default function CopperlineMobileBank() {
  const reduced = usePrefersReducedMotion()
  const [view, setView] = useState<View>('home')
  const [txns, setTxns] = useState<Txn[]>(INITIAL_TXNS)
  const [accounts, setAccounts] = useState(ACCOUNTS)
  const [pots, setPots] = useState<Pot[]>(INITIAL_POTS)
  const [frozen, setFrozen] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [sheet, setSheet] = useState<SheetState>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [lastSent, setLastSent] = useState<string | null>(null)
  const toastTimer = useRef(0)

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const say = (msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3600)
  }

  const potsTotal = pots.reduce((s, p) => s + p.saved, 0)
  const spare = accounts[1].balance - potsTotal

  const sendPayment = (c: Contact, amount: number, note: string) => {
    setAccounts((accs) => accs.map((a, i) => (i === 0 ? { ...a, balance: a.balance - amount } : a)))
    setTxns((ts) => [
      {
        id: `t-new-${Date.now()}`,
        merchant: c.name,
        note: note || 'PayID transfer',
        category: 'transfer',
        dir: 'out',
        amount,
        date: TODAY,
        pending: true,
      },
      ...ts,
    ])
    setLastSent(`${fmt(amount)} sent to ${c.name}.`)
    say(`${fmt(amount)} sent to ${c.name} — nice and instant.`)
  }

  const allocate = (potId: string, amount: number) => {
    const amt = Math.min(amount, spare)
    if (amt <= 0) return
    setPots((ps) => ps.map((p) => (p.id === potId ? { ...p, saved: p.saved + amt } : p)))
    const pot = pots.find((p) => p.id === potId)
    say(`${fmt(amt)} moved into ${pot?.name ?? 'your pot'}.`)
  }

  const toggleFreeze = () => {
    setFrozen((f) => {
      say(f ? 'Card unfrozen — go gently.' : 'Card frozen. New purchases blocked instantly.')
      return !f
    })
  }

  return (
    <div className="cl-stage">
      <div className="cl">
        <a className="cl-skiplink" href="#cl-nav">
          Skip to navigation
        </a>

        <main className="cl-main">
          {view === 'home' && (
            <Home
              accounts={accounts}
              pots={pots}
              txns={txns}
              frozen={frozen}
              reduced={reduced}
              go={(v) => setView(v as View)}
              openStatements={() => setSheet({ kind: 'statement' })}
              toggleFreeze={toggleFreeze}
            />
          )}
          {view === 'activity' && <Activity txns={txns} />}
          {view === 'pay' && (
            <Pay onPay={(contact) => setSheet({ kind: 'pay', contact })} lastSent={lastSent} />
          )}
          {view === 'pots' && (
            <Pots
              pots={pots}
              spare={spare}
              reduced={reduced}
              onAllocate={allocate}
              openAllocate={(preset) => setSheet({ kind: 'allocate', preset })}
            />
          )}
          {view === 'more' && (
            <More
              frozen={frozen}
              toggleFreeze={toggleFreeze}
              notifications={notifications}
              toggleNotifications={() => {
                setNotifications((n) => {
                  say(n ? 'Spend alerts off. Blissful silence.' : 'Spend alerts on. We\'ll keep you posted.')
                  return !n
                })
              }}
              openStatements={() => setSheet({ kind: 'statement' })}
              cardAccount={accounts[0]}
            />
          )}
        </main>

        <nav className="cl-nav" id="cl-nav" aria-label="App sections">
          {NAV.map((n) =>
            n.id === 'pay' ? (
              <button
                key={n.id}
                className={`cl-nav__btn cl-nav__btn--pay${view === 'pay' ? ' is-on' : ''}`}
                onClick={() => setView('pay')}
                aria-current={view === 'pay' ? 'page' : undefined}
              >
                <span className="cl-nav__coin">
                  <Icon glyph="pay" size={20} />
                </span>
                <span className="cl-nav__lbl">Pay</span>
              </button>
            ) : (
              <button
                key={n.id}
                className={`cl-nav__btn${view === n.id ? ' is-on' : ''}`}
                onClick={() => setView(n.id)}
                aria-current={view === n.id ? 'page' : undefined}
              >
                <Icon glyph={n.glyph} size={19} />
                <span className="cl-nav__lbl">{n.label}</span>
              </button>
            ),
          )}
        </nav>

        {/* sheets */}
        {sheet?.kind === 'pay' && (
          <PaySheet
            contact={sheet.contact}
            balance={accounts[0].balance}
            reduced={reduced}
            onSend={sendPayment}
            onClose={() => setSheet(null)}
          />
        )}
        {sheet?.kind === 'allocate' && (
          <AllocateSheet
            pots={pots}
            preset={sheet.preset}
            spare={spare}
            onAllocate={allocate}
            onClose={() => setSheet(null)}
          />
        )}
        {sheet?.kind === 'statement' && (
          <StatementSheet
            accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
            reduced={reduced}
            onDone={(msg) => {
              setSheet(null)
              say(msg)
            }}
            onClose={() => setSheet(null)}
          />
        )}

        {/* toast + live region */}
        <div className={`cl-toast${toast ? ' is-on' : ''}`} role="status" aria-live="polite">
          {toast && (
            <>
              <span className="cl-toast__dot" aria-hidden="true" />
              {toast}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
