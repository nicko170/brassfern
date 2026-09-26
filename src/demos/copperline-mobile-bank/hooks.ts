import { useEffect, useRef, useState } from 'react'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

/** Tween a number toward its target; snap instantly under reduced motion. */
export function useTweenNumber(target: number, reduced: boolean, ms = 620) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(0)

  useEffect(() => {
    if (reduced) {
      fromRef.current = target
      setValue(target)
      return
    }
    const from = fromRef.current
    if (from === target) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + (target - from) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, reduced, ms])

  return value
}
