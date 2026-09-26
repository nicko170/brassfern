import { useEffect, useRef, type ReactNode } from 'react'
import Icon from './icons'

/**
 * Bottom sheet — slides up over a scrim, traps focus loosely, closes on
 * Escape / scrim tap / close button, returns focus to whatever opened it.
 */
export default function Sheet({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const first =
      panel?.querySelector<HTMLElement>('[autofocus]') ??
      panel?.querySelector<HTMLElement>('input, button, [tabindex]')
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panel) return
      const items = Array.from(panel.querySelectorAll<HTMLElement>('input, button, [href]')).filter(
        (el) => !el.hasAttribute('disabled'),
      )
      if (items.length === 0) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      lastFocus.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="cl-sheet" role="presentation">
      <button className="cl-sheet__scrim" aria-label="Close" onClick={onClose} tabIndex={-1} />
      <div className="cl-sheet__panel" role="dialog" aria-modal="true" aria-label={label} ref={panelRef}>
        <div className="cl-sheet__grab" aria-hidden="true" />
        <button className="cl-sheet__close" onClick={onClose} aria-label="Close sheet">
          <Icon glyph="close" size={16} />
        </button>
        {children}
      </div>
    </div>
  )
}
