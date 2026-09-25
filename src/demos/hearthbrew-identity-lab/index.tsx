import { useCallback, useEffect, useRef, useState } from 'react'
import './demo.css'

/**
 * Hearthbrew Identity Lab — a generative brand playground for the fictional
 * Hearthbrew Coffee. Three dials (Blend warmth, Growth, Density) grow the
 * brand's botanical pattern; palette and type pairing stay in-system.
 */

// mulberry32 — deterministic seeded RNG so every composition is shareable
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Palette {
  paper: string
  inks: [string, string, string]
  accent: string
}

function paletteFor(warmth: number): Palette {
  // warmth 0 → cooler, leaf-forward; 1 → roasty caramel-heavy
  const lerp = (a: number[], b: number[], t: number) =>
    a.map((v, i) => Math.round(v + (b[i] - v) * t))
  const hex = (c: number[]) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')
  const t = warmth / 100
  return {
    paper: hex(lerp([243, 236, 222], [247, 226, 198], t)),
    inks: [hex(lerp([44, 62, 40], [58, 34, 22], t)), hex(lerp([95, 122, 82], [122, 84, 40], t)), hex(lerp([34, 22, 16], [46, 26, 16], t))],
    accent: hex(lerp([140, 160, 96], [201, 138, 62], t)),
  }
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
  growth: number,
  density: number,
  palette: Palette,
) {
  const rand = rng(seed)
  ctx.fillStyle = palette.paper
  ctx.fillRect(0, 0, w, h)

  const stems = Math.round(6 + density * 0.9)
  const maxDepth = Math.round(3 + growth * 0.08)

  const vine = (x: number, y: number, angle: number, len: number, depth: number) => {
    if (depth > maxDepth || len < 3) return
    const steps = Math.max(3, Math.round(len / 14))
    let px = x
    let py = y
    let a = angle
    ctx.strokeStyle = palette.inks[depth % 3 === 0 ? 0 : 1]
    ctx.lineWidth = Math.max(0.8, (maxDepth - depth + 1) * 0.9)
    ctx.beginPath()
    ctx.moveTo(px, py)
    for (let s = 0; s < steps; s++) {
      a += (rand() - 0.5) * 0.5
      px += Math.cos(a) * (len / steps)
      py += Math.sin(a) * (len / steps)
      ctx.lineTo(px, py)
      // leaf or bean
      if (rand() < 0.4 + growth * 0.004) {
        const lr = 5 + rand() * (9 + growth * 0.3)
        ctx.save()
        ctx.translate(px, py)
        ctx.rotate(a + (rand() < 0.5 ? 1.1 : -1.1))
        ctx.beginPath()
        ctx.fillStyle = rand() < 0.22 ? palette.accent : palette.inks[1]
        ctx.globalAlpha = 0.75 + rand() * 0.25
        ctx.ellipse(lr * 0.6, 0, lr, lr * 0.42, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        ctx.globalAlpha = 1
      }
    }
    ctx.stroke()
    // branch
    const branches = depth === 0 ? 2 : rand() < 0.7 ? 2 : 1
    for (let b = 0; b < branches; b++) {
      const spread = 0.5 + rand() * 0.5
      const na = a + (b === 0 ? spread : -spread)
      vine(px, py, na, len * (0.55 + rand() * 0.2), depth + 1)
    }
  }

  for (let i = 0; i < stems; i++) {
    const x = (w / (stems + 1)) * (i + 1) + (rand() - 0.5) * (w / stems) * 0.6
    const fromBottom = rand() < 0.75
    const y = fromBottom ? h + 10 : -10
    const baseAngle = fromBottom ? -Math.PI / 2 : Math.PI / 2
    vine(x, y, baseAngle + (rand() - 0.5) * 0.5, h * (0.22 + rand() * 0.2), 0)
  }

  // frame rule
  ctx.strokeStyle = palette.inks[2]
  ctx.lineWidth = 1
  ctx.strokeRect(w * 0.045, h * 0.045, w * 0.91, h * 0.91)
}

const SWATCH_NAMES = ['Parchment', 'Cherry bark', 'Roast leaf', 'Espresso', 'Caramel']

export default function HearthbrewIdentityLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [seed, setSeed] = useState(() => 2026)
  const [warmth, setWarmth] = useState(55)
  const [growth, setGrowth] = useState(60)
  const [density, setDensity] = useState(45)
  const [copied, setCopied] = useState<string | null>(null)

  const palette = paletteFor(warmth)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawPattern(ctx, rect.width, rect.height, seed, growth, density, palette)
  }, [seed, warmth, growth, density])

  const copyHex = useCallback((hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => undefined)
    setCopied(hex)
    window.setTimeout(() => setCopied(null), 1400)
  }, [])

  const reroll = () => setSeed(Math.floor(Math.random() * 90000) + 1000)

  const swatches: [string, string][] = [
    [SWATCH_NAMES[0], palette.paper],
    [SWATCH_NAMES[1], palette.inks[0]],
    [SWATCH_NAMES[2], palette.inks[1]],
    [SWATCH_NAMES[3], palette.inks[2]],
    [SWATCH_NAMES[4], palette.accent],
  ]

  return (
    <div className="hb">
      <div className="hb__wrap">
        <header className="hb__head">
          <h1 className="hb__brand">
            <small>Hearthbrew Coffee — Identity Lab</small>
            HEARTHBREW
          </h1>
          <p className="hb__tag">Turn the dials. The brand grows itself — warm, botanical, never the same twice, always on-brief.</p>
        </header>

        <div className="hb__grid">
          <div className="hb__stage">
            <canvas ref={canvasRef} role="img" aria-label="Generative botanical pattern in Hearthbrew brand colours" />
            <span className="hb__seed">seed no. {seed}</span>
          </div>

          <div className="hb__panel">
            <div className="hb__controls">
              <div className="hb__control">
                <label htmlFor="hb-warmth">Blend warmth <output>{warmth}</output></label>
                <input id="hb-warmth" type="range" min={0} max={100} value={warmth} onChange={(e) => setWarmth(Number(e.target.value))} />
              </div>
              <div className="hb__control">
                <label htmlFor="hb-growth">Growth <output>{growth}</output></label>
                <input id="hb-growth" type="range" min={0} max={100} value={growth} onChange={(e) => setGrowth(Number(e.target.value))} />
              </div>
              <div className="hb__control">
                <label htmlFor="hb-density">Density <output>{density}</output></label>
                <input id="hb-density" type="range" min={0} max={100} value={density} onChange={(e) => setDensity(Number(e.target.value))} />
              </div>
              <div className="hb__actions">
                <button className="hb__btn" onClick={reroll}>Reroll seed</button>
                <button
                  className="hb__btn hb__btn--ghost"
                  onClick={() => {
                    setSeed(2026)
                    setWarmth(55)
                    setGrowth(60)
                    setDensity(45)
                  }}
                >
                  House blend
                </button>
              </div>
            </div>

            <div>
              <p style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: '0.6rem' }}>
                Live palette — click to copy
              </p>
              <div className="hb__palette">
                {swatches.map(([name, hex]) => {
                  const dark = name === 'Parchment' || name === 'Caramel'
                  return (
                    <button
                      key={name}
                      className="hb__swatch"
                      style={{ background: hex, color: dark ? '#221610' : '#f3e9dc' }}
                      onClick={() => copyHex(hex)}
                      aria-label={`Copy ${name} hex ${hex}`}
                    >
                      <b>{name}</b>
                      {hex}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="hb__type">
              <h3>Voice check</h3>
              <p className="hb__type-sample">
                Slowly grown, <em>honestly roasted.</em>
              </p>
              <small>Display: brand serif · Labels: grotesk mono · Rule: if it shouts, it’s off-brand</small>
            </div>
          </div>
        </div>
      </div>
      {copied && <div className="hb__copied" role="status">Copied {copied} — on-brand. Obviously.</div>}
    </div>
  )
}
