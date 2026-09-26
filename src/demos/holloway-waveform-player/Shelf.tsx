import { memo } from 'react'
import { TRACKS } from './data'
import Sleeve from './Sleeve'

/**
 * The shelf — all nine HWP promo plates. Memoised: the deck clock ticks at
 * 60fps beside it and the shelf doesn't move unless the rack does.
 */

interface ShelfProps {
  currentId: string
  queue: string[]
  qi: number
  onCut: (id: string) => void
  onRack: (id: string, upNext?: boolean) => void
}

export default memo(function Shelf({ currentId, queue, qi, onCut, onRack }: ShelfProps) {
  return (
    <section className="hwp-shelf" aria-label="The shelf">
      <header className="hwp-shelf__head">
        <h2>
          The shelf <span>HWP promo series — nine plates</span>
        </h2>
        <p>
          One-hand-stamped batch, Suite B. Cut one to the deck or stack it on
          the rack; nothing here is for sale, everything here is real.
        </p>
      </header>
      <ul className="hwp-shelf__grid">
        {TRACKS.map((t) => {
          const onDeck = t.id === currentId
          const rackPos = queue.indexOf(t.id)
          const queued = rackPos > qi
          return (
            <li key={t.id} className={onDeck ? 'is-on-deck' : ''}>
              <div className="hwp-card">
                <Sleeve track={t} slipping={onDeck} />
                <span className="hwp-card__state" aria-hidden="true">
                  {onDeck ? 'ON THE DECK' : queued ? `RACK · ${rackPos - qi}` : ''}
                </span>
                <p className="hwp-card__title">
                  {t.title}
                  <span>
                    {t.artist} · {t.version}
                  </span>
                </p>
                <div className="hwp-card__acts">
                  <button
                    className="hwp-card__btn hwp-card__btn--cut"
                    onClick={() => onCut(t.id)}
                    disabled={onDeck}
                  >
                    {onDeck ? 'On deck' : 'Cut to deck'}
                  </button>
                  <button className="hwp-card__btn" onClick={() => onRack(t.id, true)} disabled={onDeck}>
                    Up next
                  </button>
                  <button className="hwp-card__btn" onClick={() => onRack(t.id)} disabled={onDeck}>
                    + Rack
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
})
