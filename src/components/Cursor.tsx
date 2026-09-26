import { useEffect, useRef, useState } from 'react'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, [data-cursor]'

/**
 * A brass ring that trails the pointer and blooms over interactive things.
 * Never mounted for touch users or reduced-motion users; never hides the
 * system cursor — it is company, not a replacement.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine && !reduce)
  }, [])

  useEffect(() => {
    if (!enabled || !ref.current) return
    const el = ref.current
    document.documentElement.classList.add('has-cursor')

    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    let seen = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!seen) {
        seen = true
        x = tx
        y = ty
        el.classList.add('is-on')
      }
    }
    const onOver = (e: MouseEvent) => {
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE)
      el.classList.toggle('is-active', Boolean(hit))
    }
    const onLeave = () => {
      el.classList.remove('is-on')
      seen = false
    }
    const loop = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return <div ref={ref} className="cursor-ring" aria-hidden="true" />
}
