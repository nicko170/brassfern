import { useEffect, useRef, useState, type RefObject } from 'react'

/* Reduced motion (live-reacting) -------------------------------------- */

export function useReducedMotion(): boolean {
  const [rm, setRm] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setRm(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return rm
}

/* localStorage-persisted id lists ------------------------------------- */

export function useStoredIds(key: string): [string[], (next: string[]) => void] {
  const [ids, setIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(key)
      const parsed: unknown = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
    } catch {
      return []
    }
  })
  const set = (next: string[]) => {
    setIds(next)
    try {
      window.localStorage.setItem(key, JSON.stringify(next))
    } catch {
      /* private mode — state still works for the session */
    }
  }
  return [ids, set]
}

export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
}

/* Modal overlay: focus in, escape out, scroll lock, restore focus ----- */

export function useOverlay(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
      }
    }
    document.addEventListener('keydown', onKey, true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prevOverflow
      prev?.focus?.()
    }
  }, [open, ref])
}
