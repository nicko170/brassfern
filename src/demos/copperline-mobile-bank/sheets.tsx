import { useEffect, useRef, useState } from 'react'
import type { Contact, Pot } from './data'
import { fmt } from './data'
import Icon from './icons'
import Sheet from './Sheet'

// ---------------------------------------------------------------- pay sheet

type PayStage = 'amount' | 'review' | 'processing' | 'done'

export function PaySheet({
  contact,
  balance,
  reduced,
  onSend,
  onClose,
}: {
  contact: Contact
  balance: number
  reduced: boolean
  onSend: (c: Contact, amount: number, note: string) => void
  onClose: () => void
}) {
  const [stage, setStage] = useState<PayStage>('amount')
  const [raw, setRaw] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const amount = parseFloat(raw)
  const valid = !isNaN(amount) && amount > 0 && amount <= balance

  const review = () => {
    if (isNaN(amount) || amount <= 0) {
      setError('Enter an amount greater than $0.')
      return
    }
    if (amount > balance) {
      setError(`That's more than your available ${fmt(balance)}.`)
      return
    }
    setError(null)
    setStage('review')
  }

  const confirm = () => {
    setStage('processing')
    window.setTimeout(
      () => {
        onSend(contact, amount, note.trim())
        setStage('done')
      },
      reduced ? 60 : 700,
    )
  }

  return (
    <Sheet open onClose={onClose} label={`Pay ${contact.name}`}>
      <div className="cl-ps__head">
        <span className={`cl-contact__av cl-contact__av--${contact.tint} cl-contact__av--lg`} aria-hidden="true">
          {contact.initials}
        </span>
        <div>
          <h2 className="cl-sheet__title">Pay {contact.name}</h2>
          <p className="cl-sheet__sub">{contact.handle} · instant via PayID</p>
        </div>
      </div>

      {stage === 'amount' && (
        <>
          <label className="cl-field">
            <span className="cl-field__lbl">Amount</span>
            <span className="cl-amount">
              <span aria-hidden="true">$</span>
              <input
                className="cl-ser"
                type="text"
                inputMode="decimal"
                value={raw}
                onChange={(e) => {
                  setRaw(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))
                  setError(null)
                }}
                onKeyDown={(e) => e.key === 'Enter' && review()}
                placeholder="0.00"
                aria-describedby={error ? 'cl-pay-err' : undefined}
                aria-invalid={!!error}
                autoFocus
              />
            </span>
          </label>
          <div className="cl-chips cl-chips--pad" role="group" aria-label="Quick amounts">
            {[20, 50, 100].map((v) => (
              <button key={v} className="cl-chip cl-chip--light" onClick={() => setRaw(String(v))}>
                ${v}
              </button>
            ))}
            <button className="cl-chip cl-chip--light" onClick={() => setRaw((Math.floor(balance * 0.1 * 100) / 100).toFixed(2))}>
              10% of balance
            </button>
          </div>
          <label className="cl-field">
            <span className="cl-field__lbl">Note (optional)</span>
            <input
              className="cl-input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={40}
              placeholder="Dinner split, rent, that book…"
            />
          </label>
          <p className="cl-sheet__avail cl-ser">Available · {fmt(balance)}</p>
          {error && (
            <p className="cl-err" id="cl-pay-err" role="alert">
              {error}
            </p>
          )}
          <button className="cl-btn cl-btn--block" onClick={review} disabled={!raw}>
            Review payment
          </button>
        </>
      )}

      {stage === 'review' && (
        <>
          <dl className="cl-review">
            <div>
              <dt>To</dt>
              <dd>
                {contact.name} <span className="cl-sheet__sub">{contact.handle}</span>
              </dd>
            </div>
            <div>
              <dt>From</dt>
              <dd>Everyday · …4821</dd>
            </div>
            <div>
              <dt>Amount</dt>
              <dd className="cl-ser cl-review__amt">{fmt(amount)}</dd>
            </div>
            {note && (
              <div>
                <dt>Note</dt>
                <dd>{note}</dd>
              </div>
            )}
          </dl>
          <div className="cl-rowbtns">
            <button className="cl-btn cl-btn--ghost" onClick={() => setStage('amount')}>
              Back
            </button>
            <button className="cl-btn cl-btn--block" onClick={confirm}>
              Confirm &amp; pay
            </button>
          </div>
        </>
      )}

      {stage === 'processing' && (
        <div className="cl-ps__center" role="status">
          <span className="cl-spinner" aria-hidden="true" />
          <p>Checking the rails…</p>
        </div>
      )}

      {stage === 'done' && (
        <div className="cl-ps__center">
          <span className="cl-done" aria-hidden="true">
            <Icon glyph="check" size={26} />
          </span>
          <p className="cl-ps__big cl-ser">{fmt(amount)} sent</p>
          <p className="cl-sheet__sub">
            {contact.name} has it already. It'll show as pending until tonight's settlement.
          </p>
          <button className="cl-btn cl-btn--block" onClick={onClose}>
            Done
          </button>
        </div>
      )}
    </Sheet>
  )
}

// ------------------------------------------------------------ allocate sheet

export function AllocateSheet({
  pots,
  preset,
  spare,
  onAllocate,
  onClose,
}: {
  pots: Pot[]
  preset?: number
  spare: number
  onAllocate: (potId: string, amount: number) => void
  onClose: () => void
}) {
  const [potId, setPotId] = useState(pots[0]?.id ?? '')
  const [raw, setRaw] = useState(preset ? String(preset) : '')
  const [error, setError] = useState<string | null>(null)
  const amount = parseFloat(raw)

  const apply = () => {
    if (isNaN(amount) || amount <= 0) {
      setError('Enter an amount greater than $0.')
      return
    }
    if (amount > spare) {
      setError(`Only ${fmt(spare)} is ready to allocate.`)
      return
    }
    onAllocate(potId, Math.round(amount * 100) / 100)
    onClose()
  }

  return (
    <Sheet open onClose={onClose} label="Move money into a pot">
      <h2 className="cl-sheet__title">Move money into a pot</h2>
      <p className="cl-sheet__sub">
        <span className="cl-ser">{fmt(spare)}</span> ready to allocate from Bonus Saver.
      </p>

      <div className="cl-chips cl-chips--pad" role="group" aria-label="Choose a pot">
        {pots.map((p) => (
          <button
            key={p.id}
            className={`cl-chip cl-chip--light${potId === p.id ? ' is-on' : ''}`}
            onClick={() => setPotId(p.id)}
            aria-pressed={potId === p.id}
          >
            {p.name}
          </button>
        ))}
      </div>

      <label className="cl-field">
        <span className="cl-field__lbl">Amount</span>
        <span className="cl-amount">
          <span aria-hidden="true">$</span>
          <input
            className="cl-ser"
            type="text"
            inputMode="decimal"
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))
              setError(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder="0.00"
            aria-invalid={!!error}
            autoFocus
          />
        </span>
      </label>
      <div className="cl-chips cl-chips--pad" role="group" aria-label="Quick amounts">
        {[20, 50, 100, 250].map((v) => (
          <button key={v} className="cl-chip cl-chip--light" onClick={() => setRaw(String(v))} disabled={v > spare}>
            ${v}
          </button>
        ))}
      </div>
      {error && (
        <p className="cl-err" role="alert">
          {error}
        </p>
      )}
      <button className="cl-btn cl-btn--block" onClick={apply} disabled={!raw}>
        Move it in
      </button>
    </Sheet>
  )
}

// ----------------------------------------------------------- statement sheet

const PERIODS = ['September 2026', 'Last 90 days', 'FY 2025–26']
const SIZES: Record<string, string> = { 'September 2026': '182 KB', 'Last 90 days': '486 KB', 'FY 2025–26': '1.9 MB' }

export function StatementSheet({
  accounts,
  reduced,
  onDone,
  onClose,
}: {
  accounts: { id: string; name: string }[]
  reduced: boolean
  onDone: (message: string) => void
  onClose: () => void
}) {
  const [acct, setAcct] = useState(accounts[0].id)
  const [period, setPeriod] = useState(PERIODS[0])
  const [format, setFormat] = useState<'PDF' | 'CSV'>('PDF')
  const [busy, setBusy] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const slug = `${accounts.find((a) => a.id === acct)?.name.toLowerCase().replace(/\s+/g, '-')}-${period
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`
  const filename = `copperline-${slug}.${format.toLowerCase()}`

  const download = () => {
    setBusy(true)
    timer.current = window.setTimeout(
      () => {
        onDone(`${filename} — ${SIZES[period]} saved to Files`)
      },
      reduced ? 80 : 900,
    )
  }

  return (
    <Sheet open onClose={onClose} label="Export a statement">
      <h2 className="cl-sheet__title">Statements &amp; export</h2>
      <p className="cl-sheet__sub">Certified for tax time. Paper-free since 2019.</p>

      <p className="cl-field__lbl" id="cl-st-acct">
        Account
      </p>
      <div className="cl-chips" role="group" aria-labelledby="cl-st-acct">
        {accounts.map((a) => (
          <button
            key={a.id}
            className={`cl-chip cl-chip--light${acct === a.id ? ' is-on' : ''}`}
            onClick={() => setAcct(a.id)}
            aria-pressed={acct === a.id}
          >
            {a.name}
          </button>
        ))}
      </div>

      <p className="cl-field__lbl" id="cl-st-period">
        Period
      </p>
      <div className="cl-chips" role="group" aria-labelledby="cl-st-period">
        {PERIODS.map((p) => (
          <button
            key={p}
            className={`cl-chip cl-chip--light${period === p ? ' is-on' : ''}`}
            onClick={() => setPeriod(p)}
            aria-pressed={period === p}
          >
            {p}
          </button>
        ))}
      </div>

      <p className="cl-field__lbl" id="cl-st-fmt">
        Format
      </p>
      <div className="cl-chips" role="group" aria-labelledby="cl-st-fmt">
        {(['PDF', 'CSV'] as const).map((f) => (
          <button
            key={f}
            className={`cl-chip cl-chip--light${format === f ? ' is-on' : ''}`}
            onClick={() => setFormat(f)}
            aria-pressed={format === f}
          >
            {f === 'PDF' ? 'PDF statement' : 'CSV for spreadsheets'}
          </button>
        ))}
      </div>

      <p className="cl-filename" aria-live="polite">
        <Icon glyph="doc" size={14} /> <span className="cl-ser">{filename}</span>
      </p>

      <button className="cl-btn cl-btn--block" onClick={download} disabled={busy}>
        {busy ? (
          <>
            <span className="cl-spinner cl-spinner--sm" aria-hidden="true" /> Preparing…
          </>
        ) : (
          <>
            <Icon glyph="download" size={15} /> Download
          </>
        )}
      </button>
    </Sheet>
  )
}
