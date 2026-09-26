import {
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { CrossIcon, GlyphIcon } from './icons'

/**
 * The Copperplate DS itself. These are the real components — every doc page
 * and the playground proof sheet renders these, never screenshots. Styles
 * live in demo.css and read the --t-* token custom properties.
 */

/* --- buttons ---------------------------------------------------------- */

type ButtonVariant = 'primary' | 'ghost' | 'quiet' | 'danger'

interface CpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function CpButton({ variant = 'primary', className = '', children, ...rest }: CpButtonProps) {
  return (
    <button className={`cp-btn cp-btn--${variant} ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}

/* --- form controls ----------------------------------------------------- */

interface CpFieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

export function CpField({ id, label, hint, error, children }: CpFieldProps) {
  return (
    <div className={`cp-field${error ? ' cp-field--error' : ''}`}>
      <label className="cp-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="cp-note cp-note--error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="cp-note" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function CpInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="cp-input" {...props} />
}

export function CpSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="cp-select-wrap">
      <select className="cp-select" {...props} />
    </span>
  )
}

interface CpCheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function CpCheckbox({ id, label, checked, onChange, disabled }: CpCheckboxProps) {
  return (
    <label className={`cp-check${disabled ? ' cp-check--disabled' : ''}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="cp-check__box" aria-hidden="true">
        <GlyphIcon name="check" size={12} />
      </span>
      <span className="cp-check__text">{label}</span>
    </label>
  )
}

/* --- alert ------------------------------------------------------------- */

type AlertTone = 'info' | 'success' | 'warning' | 'danger'

const ALERT_ICON: Record<AlertTone, string> = {
  info: 'bell',
  success: 'check',
  warning: 'alert',
  danger: 'alert',
}

interface CpAlertProps {
  tone: AlertTone
  title: string
  children?: ReactNode
  onDismiss?: () => void
}

export function CpAlert({ tone, title, children, onDismiss }: CpAlertProps) {
  return (
    <div
      className={`cp-alert cp-alert--${tone}`}
      role={tone === 'danger' ? 'alert' : 'status'}
    >
      <span className="cp-alert__icon" aria-hidden="true">
        <GlyphIcon name={ALERT_ICON[tone]} size={17} />
      </span>
      <div className="cp-alert__body">
        <p className="cp-alert__title">{title}</p>
        {children ? <div className="cp-alert__text">{children}</div> : null}
      </div>
      {onDismiss ? (
        <button className="cp-alert__close" onClick={onDismiss} aria-label="Dismiss this alert">
          <CrossIcon />
        </button>
      ) : null}
    </div>
  )
}

/* --- badge -------------------------------------------------------------- */

type BadgeTone = 'neutral' | 'accent' | 'success' | 'danger'

export function CpBadge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={`cp-badge cp-badge--${tone}`}>{children}</span>
}

/* --- card ---------------------------------------------------------------- */

interface CpCardProps {
  eyebrow?: string
  title: string
  children?: ReactNode
  footer?: ReactNode
  interactive?: boolean
  onClick?: () => void
}

export function CpCard({ eyebrow, title, children, footer, interactive, onClick }: CpCardProps) {
  /* Interactive cards are one big <button>: phrasing content only inside,
     so headings become styled spans. Static cards keep real headings. */
  const eyebrowEl = eyebrow ? <span className="cp-card__eyebrow">{eyebrow}</span> : null
  const titleEl = interactive ? (
    <span className="cp-card__title">{title}</span>
  ) : (
    <h4 className="cp-card__title">{title}</h4>
  )
  const eyebrowBlock = interactive ? eyebrowEl : eyebrow ? <p className="cp-card__eyebrow">{eyebrow}</p> : null
  const inner = (
    <>
      {eyebrowBlock}
      {titleEl}
      {children ? <span className="cp-card__body">{children}</span> : null}
      {footer ? <span className="cp-card__footer">{footer}</span> : null}
    </>
  )
  if (interactive) {
    return (
      <button className="cp-card cp-card--interactive" onClick={onClick}>
        {inner}
        <span className="cp-card__go" aria-hidden="true">
          <GlyphIcon name="arrow-right" size={15} />
        </span>
      </button>
    )
  }
  return <div className="cp-card">{inner}</div>
}

/* --- tabs ------------------------------------------------------------------ */

export interface CpTab {
  id: string
  label: string
  panel: ReactNode
}

export function CpTabs({ tabs, initialId }: { tabs: CpTab[]; initialId?: string }) {
  const [active, setActive] = useState(initialId ?? tabs[0]?.id)
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = tabs.length
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % n
    else if (e.key === 'ArrowLeft') next = (i - 1 + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    if (next !== null) {
      e.preventDefault()
      setActive(tabs[next].id)
      refs.current[next]?.focus()
    }
  }

  const current = tabs.find((t) => t.id === active) ?? tabs[0]
  return (
    <div className="cp-tabs">
      <div className="cp-tabs__list" role="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            id={`cp-tab-${t.id}`}
            aria-selected={t.id === current.id}
            aria-controls={`cp-panel-${t.id}`}
            tabIndex={t.id === current.id ? 0 : -1}
            className={`cp-tabs__tab${t.id === current.id ? ' is-active' : ''}`}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        className="cp-tabs__panel"
        role="tabpanel"
        id={`cp-panel-${current.id}`}
        aria-labelledby={`cp-tab-${current.id}`}
        tabIndex={0}
      >
        {current.panel}
      </div>
    </div>
  )
}

/* --- copy-to-clipboard hook ------------------------------------------------ */

export function useCopied(timeout = 1600): [string | null, (id: string, text: string) => void] {
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = (id: string, text: string) => {
    const done = () => {
      setCopied(id)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(null), timeout)
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, () => legacyCopy(text, done))
    } else {
      legacyCopy(text, done)
    }
  }
  return [copied, copy]
}

function legacyCopy(text: string, done: () => void) {
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  } catch {
    /* clipboard unavailable — the UI state still acknowledges the attempt */
  }
  done()
}

export function CopyButton({
  id,
  text,
  copied,
  copy,
  label = 'Copy',
  small,
}: {
  id: string
  text: string
  copied: string | null
  copy: (id: string, text: string) => void
  label?: string
  small?: boolean
}) {
  const is = copied === id
  return (
    <button className={`cpd-copy${small ? ' cpd-copy--small' : ''}${is ? ' is-copied' : ''}`} onClick={() => copy(id, text)}>
      <GlyphIcon name={is ? 'check' : 'copy'} size={small ? 12 : 13} />
      {is ? 'Copied' : label}
    </button>
  )
}

/* --- code block ------------------------------------------------------------ */

const TOKEN_RE =
  /(\/\*[^\n]*?\*\/|<!--[^\n]*?-->|--[\w-]+|"[^"\n]*"|'[^'\n]*'|<\/?[\w-]+|\/?>|\b\d[\d.]*(?:px|rem|em|%|ms|s)?\b)/g

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let k = 0
  let m: RegExpExecArray | null
  TOKEN_RE.lastIndex = 0
  while ((m = TOKEN_RE.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const tok = m[0]
    let cls = 'cd-tok'
    if (tok.startsWith('/*') || tok.startsWith('<!--')) cls = 'cd-tok cd-tok--com'
    else if (tok.startsWith('--')) cls = 'cd-tok cd-tok--var'
    else if (tok.startsWith('"') || tok.startsWith("'")) cls = 'cd-tok cd-tok--str'
    else if (tok.startsWith('<')) cls = 'cd-tok cd-tok--tag'
    else if (/^\d/.test(tok)) cls = 'cd-tok cd-tok--num'
    out.push(
      <span key={k++} className={cls}>
        {tok}
      </span>,
    )
    last = m.index + tok.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function CodeBlock({
  code,
  label = 'HTML',
  copied,
  copy,
}: {
  code: string
  label?: string
  copied: string | null
  copy: (id: string, text: string) => void
}) {
  return (
    <figure className="cpd-code">
      <figcaption className="cpd-code__bar">
        <span className="cpd-code__lang">{label}</span>
        <CopyButton id={`code-${label}-${code.length}`} text={code} copied={copied} copy={copy} small />
      </figcaption>
      <pre>
        <code>{highlight(code)}</code>
      </pre>
    </figure>
  )
}

/* --- doc furniture: a11y callout + do/don't plates -------------------------- */

export function A11yNote({ items }: { items: string[] }) {
  return (
    <aside className="cpd-a11y" aria-label="Accessibility notes">
      <p className="cpd-a11y__label">
        <GlyphIcon name="eye" size={14} /> Accessibility
      </p>
      <ul>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </aside>
  )
}

export function DdPlate({
  kind,
  caption,
  children,
}: {
  kind: 'do' | 'dont'
  caption: string
  children: ReactNode
}) {
  return (
    <figure className={`cpd-dd cpd-dd--${kind}`}>
      <div className="cpd-dd__scene">{children}</div>
      <figcaption className="cpd-dd__cap">
        <span className="cpd-dd__mark" aria-hidden="true">
          {kind === 'do' ? <GlyphIcon name="check" size={13} /> : <CrossIcon size={12} />}
        </span>
        <span>
          <strong>{kind === 'do' ? 'Do' : 'Don’t'}.</strong> {caption}
        </span>
      </figcaption>
    </figure>
  )
}
