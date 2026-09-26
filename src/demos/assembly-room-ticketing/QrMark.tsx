import { mulberry, hashString } from './data'

/**
 * A QR-style code mark — a deterministic 21×21 module grid with finder
 * squares, generated from a seed string. Decorative, but stable per ticket.
 */
export default function QrMark({ seed, size = 92 }: { seed: string; size?: number }) {
  const n = 21
  const rng = mulberry(hashString(seed))

  const inFinder = (x: number, y: number, fx: number, fy: number) =>
    x >= fx && x < fx + 7 && y >= fy && y < fy + 7

  const cells: boolean[][] = []
  for (let y = 0; y < n; y++) {
    const row: boolean[] = []
    for (let x = 0; x < n; x++) {
      row.push(rng() < 0.46)
    }
    cells.push(row)
  }
  // timing stripes
  for (let i = 8; i < n - 8; i++) {
    cells[6][i] = i % 2 === 0
    cells[i][6] = i % 2 === 0
  }

  const rects: string = (() => {
    let d = ''
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const finder =
          inFinder(x, y, 0, 0) || inFinder(x, y, n - 7, 0) || inFinder(x, y, 0, n - 7)
        if (finder) continue
        if (cells[y][x]) d += `M${x} ${y}h1v1h-1Z`
      }
    }
    return d
  })()

  const finder = (fx: number, fy: number) => (
    <path
      key={`${fx}-${fy}`}
      d={`M${fx} ${fy}h7v7h-7ZM${fx + 1} ${fy + 1}v5h5v-5ZM${fx + 2} ${fy + 2}h3v3h-3Z`}
      fillRule="evenodd"
    />
  )

  return (
    <svg
      className="asr-qr"
      width={size}
      height={size}
      viewBox={`0 0 ${n} ${n}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Ticket code mark for ${seed}`}
    >
      <rect width={n} height={n} className="asr-qr__bg" />
      <path d={rects} />
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  )
}
