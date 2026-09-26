import { useRef, useState } from 'react'
import type { DeckTrack } from './data'
import { fmtMS } from './data'
import { SleeveChip } from './Sleeve'

/**
 * The rack — the session queue. Pointer drag-to-reorder on the grip rows,
 * with keyboard equivalents (nudge up/down, cut to deck, pull from rack)
 * on every row. Rows announce every move to the shared polite region.
 */

interface QueueProps {
  items: DeckTrack[]
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
  onJump: (index: number) => void
  onAnnounce: (msg: string) => void
}

interface Drag {
  i: number
  y0: number
  dy: number
  over: number
  rowH: number
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

export default function Queue({ items, onMove, onRemove, onJump, onAnnounce }: QueueProps) {
  const listRef = useRef<HTMLOListElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)

  const gripDown = (e: React.PointerEvent, i: number) => {
    if (e.button !== 0 || items.length < 2) return
    const handle = e.currentTarget as HTMLElement
    handle.setPointerCapture(e.pointerId)
    const row = handle.closest('li')
    const rowH = row ? row.getBoundingClientRect().height + 6 : 58
    setDrag({ i, y0: e.clientY, dy: 0, over: i, rowH })
  }

  const gripMove = (e: React.PointerEvent) => {
    if (!drag) return
    e.preventDefault()
    const dy = e.clientY - drag.y0
    const over = clamp(drag.i + Math.round(dy / drag.rowH), 0, items.length - 1)
    if (over !== drag.over || Math.abs(dy - drag.dy) > 2) setDrag({ ...drag, dy, over })
  }

  const gripUp = () => {
    if (!drag) return
    if (drag.over !== drag.i) {
      onMove(drag.i, drag.over)
      const t = items[drag.i]
      if (t) {
        onAnnounce(
          `Moved ${t.title} by ${t.artist} to position ${drag.over + 1} in the rack.`,
        )
      }
    }
    setDrag(null)
  }

  if (items.length === 0) {
    return (
      <div className="hwp-rack__empty">
        <p className="hwp-rack__empty-title">THE RACK IS EMPTY</p>
        <p>
          Pull a plate from the shelf below — cut it to the deck or stack it on
          the rack. This plate ends the session.
        </p>
      </div>
    )
  }

  return (
    <ol className="hwp-rack" ref={listRef} aria-label="Rack — upcoming plates">
      {items.map((t, i) => {
        const isDrag = drag?.i === i
        let shift = 0
        if (drag && !isDrag) {
          if (drag.over > drag.i && i > drag.i && i <= drag.over) shift = -1
          else if (drag.over < drag.i && i >= drag.over && i < drag.i) shift = 1
        }
        const style: React.CSSProperties = {}
        if (isDrag) {
          style.transform = `translateY(${(drag?.dy ?? 0).toFixed(1)}px)`
        } else if (shift !== 0 && drag) {
          style.transform = `translateY(${(shift * drag.rowH).toFixed(1)}px)`
        }
        return (
          <li
            key={t.id}
            className={`hwp-rack__row${isDrag ? ' hwp-rack__row--drag' : ''}`}
            style={style}
          >
            <button
              className="hwp-rack__grip"
              aria-label={`Drag to reorder ${t.title} by ${t.artist}. Currently position ${i + 1}.`}
              aria-roledescription="sortable plate"
              onPointerDown={(e) => gripDown(e, i)}
              onPointerMove={gripMove}
              onPointerUp={gripUp}
              onPointerCancel={gripUp}
              style={{ touchAction: 'none' }}
            >
              <svg viewBox="0 0 12 20" aria-hidden="true" focusable="false">
                {[5, 10, 15].map((y) => (
                  <g key={y}>
                    <circle cx="3.4" cy={y} r="1.3" fill="currentColor" />
                    <circle cx="8.6" cy={y} r="1.3" fill="currentColor" />
                  </g>
                ))}
              </svg>
            </button>
            <span className="hwp-rack__no" aria-hidden="true">
              {String(i + 2).padStart(2, '0')}
            </span>
            <SleeveChip track={t} />
            <span className="hwp-rack__info">
              <b>{t.title}</b>
              <small>
                {t.artist} · {t.version}
              </small>
            </span>
            <span className="hwp-rack__dur">{fmtMS(t.dur)}</span>
            <span className="hwp-rack__acts">
              <button
                className="hwp-rack__act"
                aria-label={`Move ${t.title} earlier`}
                disabled={i === 0}
                onClick={() => {
                  onMove(i, i - 1)
                  onAnnounce(`${t.title} moved to position ${i}.`)
                }}
              >
                ↑
              </button>
              <button
                className="hwp-rack__act"
                aria-label={`Move ${t.title} later`}
                disabled={i === items.length - 1}
                onClick={() => {
                  onMove(i, i + 1)
                  onAnnounce(`${t.title} moved to position ${i + 2}.`)
                }}
              >
                ↓
              </button>
              <button
                className="hwp-rack__act hwp-rack__act--cut"
                aria-label={`Cut ${t.title} to the deck now`}
                onClick={() => onJump(i)}
              >
                ⏵
              </button>
              <button
                className="hwp-rack__act hwp-rack__act--pull"
                aria-label={`Pull ${t.title} from the rack`}
                onClick={() => {
                  onRemove(i)
                  onAnnounce(`Pulled ${t.title} from the rack.`)
                }}
              >
                ✕
              </button>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
