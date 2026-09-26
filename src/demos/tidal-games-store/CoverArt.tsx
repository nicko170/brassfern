import { useEffect, useRef } from 'react'
import { hashStr, mulberry, type TgGame } from './data'

/**
 * Generative key art. Each game gets a pixel-grid seascape painted on canvas:
 * banded sky, drifting stars, one celestial body and two silhouetted land
 * masses — seeded from the game id so the art is stable forever. Variants
 * (used for the screenshot strip) re-roll phases and add arcade HUD chrome.
 * The canvases upscale with `image-rendering: pixelated` for the CRT feel.
 */

type Rgb = [number, number, number]

function hex(c: string): Rgb {
  const n = parseInt(c.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function lerp(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

const css = (c: Rgb, alpha = 1) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${alpha})`

function paint(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  game: TgGame,
  variant: number,
  shot: boolean,
) {
  const rnd = mulberry(hashStr(game.id) + variant * 7919 + (shot ? 101 : 0))
  const [skyA, skyB, ridgeFar, ridgeNear, accent] = game.palette.map(hex)

  const cell = 2
  const px = (x: number, y: number, cw: number, ch: number, color: string) => {
    ctx.fillStyle = color
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(cw), Math.round(ch))
  }

  /* banded sky */
  const horizon = h * (0.5 + rnd() * 0.12)
  for (let y = 0; y < h; y += cell) {
    const t = Math.min(1, y / horizon)
    px(0, y, w, cell, css(lerp(skyA, skyB, t)))
  }

  /* stars */
  const starCount = Math.floor((w * horizon) / (shot ? 70 : 110))
  for (let i = 0; i < starCount; i++) {
    const x = rnd() * w
    const y = rnd() * horizon * 0.85
    const big = rnd() > 0.86
    px(x, y, big ? cell : 1, big ? cell : 1, css(lerp(accent, [255, 255, 255], 0.55), 0.35 + rnd() * 0.6))
  }

  /* celestial body — rasterised circle with a glow ring */
  const bodyR = Math.floor(Math.min(w, h) * (0.09 + rnd() * 0.05))
  const bx = w * (0.2 + rnd() * 0.6)
  const by = horizon * (0.25 + rnd() * 0.45)
  for (let gx = -bodyR * 2; gx <= bodyR * 2; gx += cell) {
    for (let gy = -bodyR * 2; gy <= bodyR * 2; gy += cell) {
      const d = Math.hypot(gx + cell / 2, gy + cell / 2)
      if (d <= bodyR) {
        const shade = lerp(accent, [255, 255, 255], Math.max(0, 0.5 - d / (bodyR * 2)))
        px(bx + gx, by + gy, cell, cell, css(shade))
      } else if (d <= bodyR * 1.6 && rnd() > 0.5) {
        px(bx + gx, by + gy, cell, cell, css(accent, 0.22))
      }
    }
  }

  /* two ridge layers — sin-swept silhouettes filled downward */
  const layers: [Rgb, number, number, number][] = [
    [ridgeFar, horizon, 0.5 + rnd() * 0.5, 0], // colour, baseY, amp factor, yOffset
    [ridgeNear, horizon + h * 0.14, 0.9 + rnd() * 0.6, 0],
  ]
  layers.forEach(([col, baseY, amp], li) => {
    const f1 = (1 / w) * (1.2 + rnd() * 2.2) * Math.PI * 2
    const f2 = (1 / w) * (3 + rnd() * 5) * Math.PI * 2
    const p1 = rnd() * Math.PI * 2
    const p2 = rnd() * Math.PI * 2
    const a1 = h * 0.05 * amp
    const a2 = h * 0.02 * amp
    for (let x = 0; x < w; x += cell) {
      const yTop = baseY + Math.sin(x * f1 + p1) * a1 + Math.sin(x * f2 + p2) * a2
      px(x, yTop, cell, h - yTop, css(lerp(col, [0, 0, 0], li * 0.12)))
    }
  })

  /* water shimmer — occasional horizontal streaks in the near layer */
  const streaks = 4 + Math.floor(rnd() * 5)
  for (let i = 0; i < streaks; i++) {
    const y = horizon + h * 0.14 + rnd() * (h - horizon - h * 0.14)
    const x = rnd() * w * 0.7
    px(x, y, w * (0.06 + rnd() * 0.2), cell, css(accent, 0.18 + rnd() * 0.2))
  }

  /* screenshot chrome: a HUD bar and a few "entities" */
  if (shot) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, w, 5)
    for (let i = 0; i < 3; i++) px(2 + i * 4, 1.5, 2.5, 2, css(accent))
    px(w - 14, 1.5, 12, 2, 'rgba(255,255,255,0.35)')
    px(w - 14, 1.5, 12 * (0.3 + rnd() * 0.7), 2, css(accent))
    const ents = 2 + Math.floor(rnd() * 3)
    for (let i = 0; i < ents; i++) {
      const ex = rnd() * (w - 6)
      const ey = horizon * 0.4 + rnd() * (h - horizon * 0.6)
      px(ex, ey, 3 + rnd() * 2, 2 + rnd() * 3, css(lerp(accent, [255, 255, 255], 0.3)))
      px(ex + 1, ey - 2, 1, 2, css(accent, 0.8))
    }
  }
}

export default function CoverArt({
  game,
  variant = 0,
  shot = false,
  className,
}: {
  game: TgGame
  variant?: number
  /** 16:10 “in-game screen” with HUD chrome instead of 3:4 cover */
  shot?: boolean
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const w = shot ? 80 : 96
  const h = shot ? 50 : 128

  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (ctx) paint(ctx, w, h, game, variant, shot)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id, variant, shot])

  return (
    <canvas
      ref={ref}
      width={w}
      height={h}
      className={className}
      aria-hidden="true"
      data-shot={shot || undefined}
    />
  )
}
