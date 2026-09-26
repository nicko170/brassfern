import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PackScene, { type SceneConfig, type SceneHandle } from './PackScene'
import Poster from './Poster'
import {
  COLOURS,
  FABRICS,
  MODELS,
  TORSOS,
  DEFAULT_CONFIG,
  byId,
  hexOf,
  parseConfig,
  serializeConfig,
  specOf,
  type Config,
} from './pack'
import './demo.css'

/**
 * Osprey Outdoor — "Ridgeline Works" 3D pack configurator.
 * Trail-dusk art direction: graphite, moss, blaze orange, spec-sheet type.
 * The pack is assembled live from three.js primitives; everything the
 * visitor touches — model, fabric, colourway, torso fit — reprices,
 * reweighs and re-renders instantly, and the whole configuration is
 * shareable via URL. Reduced motion (or no WebGL) falls back to a
 * static spec-sheet elevation with identical controls.
 */

function initialConfig(): Config {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  return parseConfig(window.location.search)
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') ?? c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function OspreyPackConfigurator() {
  const [config, setConfig] = useState<Config>(initialConfig)
  const [copied, setCopied] = useState(false)
  const [sceneReady, setSceneReady] = useState<boolean | null>(null)
  const handleRef = useRef<SceneHandle | null>(null)
  const copyTimer = useRef<number | null>(null)

  // Decide once, on the client, whether the live scene can run.
  useEffect(() => {
    setSceneReady(!prefersReducedMotion() && webglAvailable())
  }, [])

  // Keep the URL in sync so any configuration is shareable.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const q = serializeConfig(config)
    window.history.replaceState(null, '', `${window.location.pathname}?${q}`)
  }, [config])

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current)
    },
    []
  )

  const spec = useMemo(() => specOf(config), [config])

  const set = useCallback(<K extends keyof Config>(key: K, value: Config[K]) => {
    setConfig((c) => ({ ...c, [key]: value }))
  }, [])

  const copyLink = useCallback(async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    if (copyTimer.current) window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 2200)
  }, [])

  const sceneConfig = useMemo<SceneConfig>(
    () => ({
      scaleY: spec.model.scaleY,
      scaleXZ: spec.model.scaleXZ,
      torso: spec.torso.factor,
      exploded: config.exploded,
      colours: { body: hexOf(config.body), pocket: hexOf(config.pocket), trim: hexOf(config.trim) },
      roughness: spec.fabric.roughness,
    }),
    [spec, config.exploded, config.body, config.pocket, config.trim]
  )

  const onStageKey = (e: React.KeyboardEvent) => {
    if (!handleRef.current) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handleRef.current.rotate(-0.45)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleRef.current.rotate(0.45)
    }
  }

  const usingScene = sceneReady === true

  return (
    <div className="opc">
      {/* ————— stage ————— */}
      <section
        className="opc-stage"
        onKeyDown={usingScene ? onStageKey : undefined}
        tabIndex={usingScene ? 0 : undefined}
        role={usingScene ? 'img' : undefined}
        aria-roledescription={usingScene ? 'interactive 3D model' : undefined}
        aria-label={
          usingScene
            ? `Interactive 3D model of the ${spec.model.name} in ${spec.colourwayName}. Drag or use left and right arrow keys to rotate.`
            : undefined
        }
      >
        <div className="opc-stage__topline">
          <span className="opc-tag">RW/{spec.model.litres}</span>
          <span className="opc-tag">{spec.fabric.name.toUpperCase()}</span>
          <span className="opc-tag">FIT {spec.torso.label}</span>
        </div>

        <div className="opc-stage__view">
          {usingScene ? (
            <PackScene config={sceneConfig} handleRef={handleRef} />
          ) : (
            <Poster
              body={hexOf(config.body)}
              pocket={hexOf(config.pocket)}
              trim={hexOf(config.trim)}
              modelName={spec.model.name}
              scaleY={spec.model.scaleY * spec.torso.factor * 0.92}
            />
          )}
        </div>

        <div className="opc-stage__foot">
          {usingScene && (
            <span className="opc-hint">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2 7h10M2 7l3-3M2 7l3 3M12 7L9 4M12 7L9 10" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              Drag to rotate
            </span>
          )}
          <button
            type="button"
            className="opc-explode"
            role="switch"
            aria-checked={config.exploded}
            onClick={() => set('exploded', !config.exploded)}
            disabled={!usingScene}
          >
            <span className="opc-explode__track" aria-hidden="true">
              <span className="opc-explode__thumb" />
            </span>
            Exploded view
          </button>
        </div>
        <noscript>
          <p className="opc-noscript">Enable JavaScript to spin the pack — the spec sheet on the right still tells the story.</p>
        </noscript>
      </section>

      {/* ————— spec sheet ————— */}
      <section className="opc-panel" aria-label="Configure your pack">
        <header className="opc-panel__head">
          <p className="opc-wordmark">
            <span className="opc-wordmark__glyph" aria-hidden="true">▲</span> Osprey Outdoor
          </p>
          <h1 className="opc-title">Ridgeline Works configurator</h1>
          <p className="opc-sub">Series 02 · Built to order in 3 weeks · Ships carbon-neutral</p>
        </header>

        <fieldset className="opc-group">
          <legend className="opc-legend">01 · Model</legend>
          <div className="opc-models">
            {MODELS.map((m) => (
              <label key={m.id} className="opc-model" data-on={config.model === m.id || undefined}>
                <input
                  className="opc-sr"
                  type="radio"
                  name="opc-model"
                  value={m.id}
                  checked={config.model === m.id}
                  onChange={() => set('model', m.id)}
                />
                <span className="opc-model__row">
                  <span className="opc-model__name">{m.name}</span>
                  <span className="opc-model__price">A${m.price}</span>
                </span>
                <span className="opc-model__use">{m.use}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="opc-group">
          <legend className="opc-legend">02 · Torso fit</legend>
          <div className="opc-seg" role="group" aria-label="Torso fit">
            {TORSOS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="opc-seg__btn"
                aria-pressed={config.torso === t.id}
                onClick={() => set('torso', t.id)}
              >
                <span className="opc-seg__label">{t.label}</span>
                <span className="opc-seg__range">{t.range}</span>
              </button>
            ))}
          </div>
          <p className="opc-groupnote">Measure from C7 vertebra to iliac crest. Between sizes? Size down.</p>
        </fieldset>

        <fieldset className="opc-group">
          <legend className="opc-legend">03 · Fabric</legend>
          <div className="opc-fabrics">
            {FABRICS.map((f) => (
              <label key={f.id} className="opc-fabric" data-on={config.fabric === f.id || undefined}>
                <input
                  className="opc-sr"
                  type="radio"
                  name="opc-fabric"
                  value={f.id}
                  checked={config.fabric === f.id}
                  onChange={() => set('fabric', f.id)}
                />
                <span className="opc-fabric__row">
                  <span className="opc-fabric__name">{f.name}</span>
                  <span className="opc-fabric__add">{f.add ? `+A$${f.add}` : 'incl.'}</span>
                </span>
                <span className="opc-fabric__desc">{f.desc}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="opc-group">
          <legend className="opc-legend">04 · Colourway</legend>
          {(
            [
              ['body', 'Body'],
              ['pocket', 'Pockets'],
              ['trim', 'Webbing & straps'],
            ] as const
          ).map(([key, label]) => (
            <div className="opc-colrow" key={key}>
              <span className="opc-colrow__label" id={`opc-col-${key}`}>
                {label}
                {key === 'body' && config.body === 'blaze' && <em className="opc-colrow__flag"> hi-vis +A$15</em>}
              </span>
              <div className="opc-swatches" role="group" aria-labelledby={`opc-col-${key}`}>
                {COLOURS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="opc-swatch"
                    style={{ backgroundColor: c.hex }}
                    aria-label={`${label}: ${c.name}`}
                    aria-pressed={config[key] === c.id}
                    title={c.name}
                    onClick={() => set(key, c.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </fieldset>

        <div className="opc-spec" aria-hidden="true">
          <div className="opc-spec__row">
            <span>Volume</span>
            <span>{spec.model.litres} L</span>
          </div>
          <div className="opc-spec__row">
            <span>Carry weight</span>
            <span>{spec.weightKg} kg</span>
          </div>
          <div className="opc-spec__row">
            <span>Dimensions</span>
            <span>{spec.model.dims}</span>
          </div>
          <div className="opc-spec__row">
            <span>Back length</span>
            <span>{spec.backCm} cm</span>
          </div>
          <div className="opc-spec__row">
            <span>Colourway</span>
            <span>{spec.colourwayName}</span>
          </div>
        </div>
        <p className="opc-sr" role="status">
          {spec.model.name}, {spec.fabric.name}, {spec.colourwayName}, torso fit {spec.torso.label}. {spec.weightKg} kilograms, A${spec.price}.
        </p>

        <div className="opc-price">
          <div className="opc-price__row">
            <span>{spec.model.name}</span>
            <span>A${spec.model.price}</span>
          </div>
          {spec.fabric.add > 0 && (
            <div className="opc-price__row">
              <span>{spec.fabric.name}</span>
              <span>+A${spec.fabric.add}</span>
            </div>
          )}
          {spec.colourAdd > 0 && (
            <div className="opc-price__row">
              <span>Blaze hi-vis dye</span>
              <span>+A${spec.colourAdd}</span>
            </div>
          )}
          <div className="opc-price__total">
            <span>Total</span>
            <span className="opc-price__amount">A${spec.price}</span>
          </div>
        </div>

        <div className="opc-actions">
          <button type="button" className="opc-copy" data-copied={copied || undefined} onClick={copyLink}>
            {copied ? '✓ Link copied' : 'Copy configuration link'}
          </button>
          <button type="button" className="opc-reset" onClick={() => setConfig(DEFAULT_CONFIG)}>
            Reset
          </button>
        </div>

        <p className="opc-note">
          A fictional configurator for a fictional pack maker, built by Brassfern. Prices and specs are illustrative.
        </p>
      </section>
    </div>
  )
}
