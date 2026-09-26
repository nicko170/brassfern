/* Tiny inline icon set — 20×20 stroke icons, drawn once, reused everywhere. */

const PATHS: Record<string, string> = {
  home: 'M4 11.5 10 6l6 5.5M5.5 10.5V16h9v-5.5',
  receipt: 'M6 3.5h8V17l-2-1.4L10 17l-2-1.4L6 17zM8.5 7.5h3M8.5 10.5h3',
  pay: 'M3.5 7.5h9M9.5 4.5l3 3-3 3M16.5 12.5h-9M10.5 9.5l-3 3 3 3',
  jar: 'M7 3.5h6v2a4.5 4.5 0 0 1 1.8 3.6V16a1.5 1.5 0 0 1-1.5 1.5H6.7A1.5 1.5 0 0 1 5.2 16V9.1A4.5 4.5 0 0 1 7 5.5zM7 3.5h6M5.5 12.5h9',
  dots: 'M5 10h.01M10 10h.01M15 10h.01',
  search: 'M8.8 8.8a4.3 4.3 0 1 0 0 .01zM12.2 12.2 16.5 16.5',
  close: 'M5.5 5.5l9 9M14.5 5.5l-9 9',
  plus: 'M10 4.5v11M4.5 10h11',
  check: 'M4.5 10.5l3.5 3.5 7.5-8',
  chevronL: 'M12.5 4.5 7 10l5.5 5.5',
  arrowUp: 'M5 15 15 5M7.5 5H15v7.5',
  upRight: 'M6 14 14 6M8 6h6v6',
  lock: 'M6.5 9.5V7a3.5 3.5 0 0 1 7 0v2.5M5.5 9.5h9v7h-9zM10 12.5v1.5',
  unlock: 'M6.5 9.5V7a3.5 3.5 0 0 1 6.8-1.2M5.5 9.5h9v7h-9zM10 12.5v1.5',
  doc: 'M6 3.5h5.5L14.5 7v9.5H6zM11 3.5V7.5h3.5M8.5 11h3M8.5 13.5h3',
  bell: 'M10 3.8a4.2 4.2 0 0 1 4.2 4.2v2.6l1.3 2.4H4.5l1.3-2.4V8A4.2 4.2 0 0 1 10 3.8zM8.6 15.8a1.6 1.6 0 0 0 2.8 0',
  basket: 'M4 8.5h12l-1.2 8H5.2zM7 8.5 10 4l3 4.5M10 11v3.2',
  cup: 'M5 6.5h8.5V13a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3zM13.5 8h1.6a1.7 1.7 0 0 1 0 3.4h-1.6M6.5 3.5v1M9.2 3.5v1',
  tram: 'M5 4.5h10A1.5 1.5 0 0 1 16.5 6v7a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 13V6A1.5 1.5 0 0 1 5 4.5zM3.5 9.5h13M7 18l1.5-2.5M13 18l-1.5-2.5',
  house: 'M4 10.5 10 5l6 5.5M5.8 9.2v6.3h8.4V9.2M8.6 15.5v-3h2.8v3',
  heart: 'M10 16.2S4 12.4 4 8.4A3.2 3.2 0 0 1 10 6a3.2 3.2 0 0 1 6 2.4c0 4-6 7.8-6 7.8z',
  bag: 'M5.8 7.5h8.4l-.8 9H6.6zM8 7.5V6a2 2 0 0 1 4 0v1.5',
  down: 'M10 4.5v9M6.5 10 10 13.5 13.5 10M5 16h10',
  leaf: 'M5 15C5 8.5 9.5 4.5 16 4.5c0 6.5-4 10.5-11 10.5zM5 15c2.5-3.5 5.5-5.5 8.5-7',
  swap: 'M4 8h10M11 5l3 3-3 3M16 12H6M9 9l-3 3 3 3',
  card: 'M4 6.5h12A1.5 1.5 0 0 1 17.5 8v6a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 14V8A1.5 1.5 0 0 1 4 6.5zM2.5 10h15M5.5 13h3',
  phone: 'M6.5 3.5h3l1 3.5-2 1.2a8.5 8.5 0 0 0 3.3 3.3l1.2-2 3.5 1v3a1.5 1.5 0 0 1-1.6 1.5C9 16 4 11 4 5.1A1.5 1.5 0 0 1 5.5 3.5z',
  download: 'M10 3.5v8M6.8 8.4 10 11.6l3.2-3.2M4.5 14.5v2h11v-2',
  eye: 'M2.5 10S5.2 5.5 10 5.5 17.5 10 17.5 10 14.8 14.5 10 14.5 2.5 10 2.5 10zM10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
}

export default function Icon({ glyph, size = 20 }: { glyph: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d={PATHS[glyph] ?? PATHS.dots} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
