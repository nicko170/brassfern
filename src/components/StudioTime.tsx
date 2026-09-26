import { useEffect, useState } from 'react'

interface Office {
  city: string
  tz: string
  note: string
}

export const OFFICES: Office[] = [
  { city: 'Sydney', tz: 'Australia/Sydney', note: 'HQ — Surry Hills' },
  { city: 'Auckland', tz: 'Pacific/Auckland', note: 'Growth & lifecycle' },
  { city: 'Singapore', tz: 'Asia/Singapore', note: 'APAC product' },
  { city: 'London', tz: 'Europe/London', note: 'EMEA product' },
]

/** Client-only clock: renders em-dashes during prerender, fills on mount. */
function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 20_000)
    return () => clearInterval(id)
  }, [])
  return now
}

function localTime(now: Date, tz: string): { time: string; open: boolean } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
  return { time: `${String(hour).padStart(2, '0')}:${minute}`, open: hour >= 9 && hour < 18 }
}

/** Compact mono strip for the footer — one glance tells you who is awake. */
export function ClockStrip() {
  const now = useNow()
  return (
    <div className="container clock-strip" aria-label="Studio local times">
      <span className="clock-strip__label mono">The studio, right now</span>
      <ul className="clock-strip__list">
        {OFFICES.map((o) => {
          const t = now ? localTime(now, o.tz) : null
          return (
            <li key={o.city} className="clock-strip__item">
              <span className="clock-strip__city">{o.city}</span>
              <span className="clock-strip__time">{t ? t.time : '——:——'}</span>
              <span className={`clock-strip__dot${t?.open ? ' open' : ''}`} aria-hidden="true" />
              <span className="visually-hidden">{t ? (t.open ? 'studio open' : 'studio offline') : 'time unknown'}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Full grid for the contact page — sets reply-time expectations across zones. */
export function ClockGrid() {
  const now = useNow()
  return (
    <ul className="clock-grid" aria-label="Studio local times">
      {OFFICES.map((o) => {
        const t = now ? localTime(now, o.tz) : null
        return (
          <li key={o.city} className="clock">
            <span className="clock__city mono">{o.city}</span>
            <span className="clock__time">{t ? t.time : '——:——'}</span>
            <span className="clock__note muted">{o.note}</span>
            <span className={`clock__status mono${t?.open ? ' open' : ''}`}>
              <span className="clock__dot" aria-hidden="true" />
              {t ? (t.open ? 'Someone is at their desk' : 'Off the clock') : '…'}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
