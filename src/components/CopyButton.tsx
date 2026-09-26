import { useEffect, useRef, useState } from 'react'

/**
 * Copies `text` to the clipboard with a plain-DOM fallback (non-secure
 * contexts, older browsers). Button label reports state; the state change
 * is also announced via an aria-live region for screen readers.
 */
export default function CopyButton({ text, label = 'Copy', className = '' }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        ok = document.execCommand('copy')
        ta.remove()
      } catch {
        ok = false
      }
    }
    setState(ok ? 'copied' : 'failed')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 2200)
  }

  return (
    <button type="button" className={`btn btn--ghost copy-btn ${className}`} onClick={copy}>
      <span aria-live="polite">{state === 'copied' ? 'Copied ✓' : state === 'failed' ? 'Select & copy manually' : label}</span>
    </button>
  )
}
