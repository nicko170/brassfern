import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export default function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  style,
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'figure'
  style?: CSSProperties
}) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${className}`}
      style={{ ...(delay ? { transitionDelay: `${delay}ms` } : {}), ...style }}
    >
      {children}
    </Tag>
  )
}
