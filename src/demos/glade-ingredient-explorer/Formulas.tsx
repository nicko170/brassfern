import { FORMULAS, INGREDIENT_BY_ID, type Formula } from './data'
import Radar from './Radar'

interface Props {
  compareA: string
  compareB: string
  onCompare: (slot: 'a' | 'b', id: string) => void
  onAdd: (formulaId: string, when: 'am' | 'pm') => void
  onOpenIngredient: (id: string) => void
}

export default function Formulas({ compareA, compareB, onCompare, onAdd, onOpenIngredient }: Props) {
  const a = FORMULAS.find((f) => f.id === compareA) ?? FORMULAS[0]
  const b = FORMULAS.find((f) => f.id === compareB) ?? FORMULAS[1]

  const select = (slot: 'a' | 'b', current: Formula) => (
    <label className="gix-compare__pick">
      <span className={`gix-compare__letter gix-compare__letter--${slot}`}>{slot.toUpperCase()}</span>
      <select value={current.id} onChange={(e) => onCompare(slot, e.target.value)} aria-label={`Compare slot ${slot.toUpperCase()}`}>
        {FORMULAS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name} — {f.kind}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <section aria-label="Formulations">
      <div className="gix-compare">
        <div className="gix-compare__head">
          <div>
            <span className="gix-overline">Radar card</span>
            <h2 className="gix-h2">
              Two formulas, <em>five honest axes</em>
            </h2>
          </div>
          <div className="gix-compare__selects">
            {select('a', a)}
            {select('b', b)}
          </div>
        </div>
        <Radar a={a} b={b} />
      </div>

      <div className="gix-fgrid">
        {FORMULAS.map((f) => (
          <article key={f.id} className="gix-fcard">
            <header className="gix-fcard__head">
              <div>
                <h3 className="gix-fcard__name">{f.name}</h3>
                <p className="gix-fcard__kind">{f.kind}</p>
              </div>
              <p className="gix-fcard__price">
                ${f.price} <span>/ {f.size}</span>
              </p>
            </header>

            <p className="gix-fcard__does">
              <strong>Does.</strong> {f.does}
            </p>
            <p className="gix-fcard__wont">
              <strong>Won’t.</strong> {f.wont}
            </p>

            <table className="gix-ftable">
              <caption className="gix-sr">
                {f.name} full formula disclosure
              </caption>
              <thead>
                <tr>
                  <th scope="col">Ingredient</th>
                  <th scope="col">Dose</th>
                  <th scope="col">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {[...f.formula]
                  .sort((x, y) => y.pct - x.pct)
                  .map((e) => {
                    const ing = INGREDIENT_BY_ID.get(e.ing)
                    return (
                      <tr key={e.ing}>
                        <th scope="row">
                          <button type="button" className="gix-link" onClick={() => onOpenIngredient(e.ing)}>
                            {ing?.name ?? e.ing}
                          </button>
                        </th>
                        <td className="gix-ftable__pct">{e.pct}%</td>
                        <td className="gix-ftable__purpose">{e.purpose}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>

            <div className="gix-fcard__actions">
              <div className="gix-fcard__adds">
                <button type="button" className="gix-btn gix-btn--small" onClick={() => onAdd(f.id, 'am')}>
                  + Morning
                </button>
                <button type="button" className="gix-btn gix-btn--small gix-btn--ghost" onClick={() => onAdd(f.id, 'pm')}>
                  + Evening
                </button>
              </div>
              <span className="gix-fcard__time">
                {f.timeSuggest === 'both' ? 'AM / PM' : f.timeSuggest === 'am' ? 'Morning' : 'Evening'}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
