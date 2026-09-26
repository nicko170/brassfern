import { useMemo, useState } from 'react'
import {
  CHANGELOG,
  DECISIONS,
  GUIDANCE,
  ICON_SPEC,
  PAIRS,
  PALETTE,
  TYPE_SPECIMEN,
} from './data'
import { GLYPHS, GlyphIcon } from './icons'
import {
  A11yNote,
  CodeBlock,
  CpAlert,
  CpBadge,
  CpButton,
  CpCard,
  CpCheckbox,
  CpField,
  CpInput,
  CpSelect,
  CpTabs,
  CopyButton,
  DdPlate,
} from './kit'
import {
  SCALE_OPTIONS,
  SPACE_STEPS,
  TYPE_STEPS,
  contrastRatio,
  isHex,
  spaceValue,
  tokenCss,
  tokenVars,
  typeValue,
  wcagLevel,
  type TokenState,
} from './tokens'

/**
 * The fourteen plates of the Copperplate docs. Every example is a live
 * Copperplate component — the docs are the system's own first customer.
 */

export interface PageCtx {
  tokens: TokenState
  patch: (p: Partial<TokenState>) => void
  resetTokens: () => void
  go: (id: string) => void
  copied: string | null
  copy: (id: string, text: string) => void
}

/* === foundations =========================================================== */

function OverviewPage({ ctx }: { ctx: PageCtx }) {
  return (
    <div className="cpd-overview">
      <header className="cpd-hero">
        <p className="cpd-eyebrow">Specimen sheet · № 04 · Copperplate Observability</p>
        <div className="cpd-hero__grid">
          <p className="cpd-hero__glyph" aria-hidden="true">
            Aa<span>¶</span>
          </p>
          <div className="cpd-hero__intro">
            <h1 className="cpd-hero__title">
              Copperplate<span className="cpd-hero__amp"> DS</span>
            </h1>
            <p className="cpd-hero__v mono">Version 4.2 · set live · Sep 2026</p>
            <p className="cpd-hero__lede">
              Tokens, components and the opinions that bind them — documented the way a typefounder
              prints a specimen: big plates, honest measures, and proof pulled from real type, never
              mock-ups. Everything renderable on these pages <em>is the system</em>.
            </p>
            <div className="cpd-hero__cta">
              <CpButton onClick={() => ctx.go('playground')}>Open the token playground</CpButton>
              <CpButton variant="ghost" onClick={() => ctx.go('buttons')}>
                Skip to components
              </CpButton>
            </div>
          </div>
        </div>
      </header>

      <section className="cpd-sect">
        <h2 className="cpd-h2">Four opinions, held loosely but printed firmly</h2>
        <ol className="cpd-principles">
          <li>
            <span className="cpd-principles__no mono">§ 1</span>
            <h3>Plain words</h3>
            <p>If a sentence needs a diagram, we rewrite the sentence. Docs are read at 5pm on a deadline.</p>
          </li>
          <li>
            <span className="cpd-principles__no mono">§ 2</span>
            <h3>Live or it didn’t happen</h3>
            <p>Every example renders the production components. A screenshot is a bug report waiting to be filed.</p>
          </li>
          <li>
            <span className="cpd-principles__no mono">§ 3</span>
            <h3>Decisions, not parts</h3>
            <p>Each page says when to reach for a thing, not just what it is. See “Which component when”.</p>
          </li>
          <li>
            <span className="cpd-principles__no mono">§ 4</span>
            <h3>Accessible by default</h3>
            <p>Contrast is a build error, not a ticket. The legal pairings are printed on the colour plate.</p>
          </li>
        </ol>
      </section>

      <section className="cpd-sect">
        <div className="cpd-statband" role="list" aria-label="System at a glance">
          {[
            ['14', 'plates'],
            ['24', 'glyphs'],
            ['6', 'component pages'],
            ['5', 'button styles retired'],
            ['0', 'screenshots'],
          ].map(([n, l]) => (
            <div className="cpd-stat" role="listitem" key={l}>
              <span className="cpd-stat__n">{n}</span>
              <span className="cpd-stat__l mono">{l}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cpd-sect">
        <h2 className="cpd-h2">Changelog</h2>
        <ul className="cpd-changes">
          {CHANGELOG.map((c) => (
            <li key={c.v}>
              <span className="cpd-changes__v mono">{c.v}</span>
              <span className="cpd-changes__date mono">{c.date}</span>
              <span className="cpd-changes__note">{c.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function ColourPage({ ctx }: { ctx: PageCtx }) {
  return (
    <div>
      <section className="cpd-sect">
        <h2 className="cpd-h2">The palette</h2>
        <p className="cpd-p">
          Six hues, each shown day-plate and night-plate. Click any specimen to copy its hex. If you
          reach for a seventh colour, the answer is almost always a tint of copper.
        </p>
        <div className="cpd-swatches">
          {PALETTE.map((s) => (
            <div className="cpd-swatch" key={s.token}>
              <button
                className="cpd-swatch__chip"
                style={{ background: s.hex }}
                onClick={() => ctx.copy(`sw-${s.token}`, s.hex)}
                aria-label={`Copy ${s.name} hex ${s.hex}`}
              >
                <span className="cpd-swatch__copied mono">{ctx.copied === `sw-${s.token}` ? 'Copied' : s.hex}</span>
              </button>
              <div className="cpd-swatch__meta">
                <p className="cpd-swatch__name">{s.name}</p>
                <p className="cpd-swatch__tok mono">{s.token}</p>
                <p className="cpd-swatch__night mono">night · {s.nightHex}</p>
                <p className="cpd-swatch__note">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cpd-sect">
        <h2 className="cpd-h2">Legal pairings</h2>
        <p className="cpd-p">
          New colour enters the system with its pairings already printed, or it doesn’t enter.
          Ratios computed against WCAG 2.2 relative luminance.
        </p>
        <div className="cpd-pairs" role="table" aria-label="Approved colour pairings with contrast ratios">
          <div className="cpd-pairs__row cpd-pairs__row--head" role="row">
            <span role="columnheader">Pairing</span>
            <span role="columnheader">Use</span>
            <span role="columnheader">Ratio</span>
            <span role="columnheader">Grade</span>
          </div>
          {PAIRS.map((p) => {
            const ratio = contrastRatio(p.fgHex, p.bgHex)
            const level = wcagLevel(ratio)
            return (
              <div className="cpd-pairs__row" role="row" key={`${p.fg}-${p.bg}`}>
                <span role="cell">
                  <span className="cpd-pairs__sample" style={{ color: p.fgHex, background: p.bgHex }}>
                    Aa
                  </span>
                  {p.fg} on {p.bg}
                </span>
                <span role="cell" className="cpd-pairs__use">
                  {p.use}
                </span>
                <span role="cell" className="mono">
                  {ratio.toFixed(2)}:1
                </span>
                <span role="cell">
                  <span className={`cpd-grade cpd-grade--${level === 'Fail' ? 'fail' : level === 'AA large' ? 'large' : 'pass'}`}>
                    {level}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <A11yNote
        items={[
          'Copper on bone passes at 18px and larger — that’s why links at body size are underlined, not just tinted.',
          'Night plate inverts the pairings; the toggle above the plates is the proof, not an afterthought.',
          'Charts tint within a hue family; a greyscale print of any chart still reads.',
        ]}
      />
    </div>
  )
}

function TypographyPage() {
  const base = 16
  const ratio = 1.25
  return (
    <div>
      <section className="cpd-sect">
        <h2 className="cpd-h2">The scale</h2>
        <p className="cpd-p">
          In product we ship <em>Platina Text</em> for display and a system sans for the coalface.
          These docs approximate with your local Iowan or Palatino — honest rendering beats a font
          download. The scale is a strict 1.25 major third; sizes between the rungs don’t exist.
        </p>
        <div className="cpd-typescale">
          {TYPE_STEPS.map((s) => {
            const px = typeValue(base, ratio, s.pow)
            return (
              <div className="cpd-typerow" key={s.name}>
                <div className="cpd-typerow__meta">
                  <span className="cpd-typerow__name">{s.name}</span>
                  <span className="mono">{px}px</span>
                </div>
                <p className="cpd-typerow__sample" style={{ fontSize: `clamp(13px, ${px / 16}rem, ${px * 2}px)` }}>
                  {TYPE_SPECIMEN[s.name]}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="cpd-sect">
        <h2 className="cpd-h2">House rules</h2>
        <ul className="cpd-rules">
          <li><strong>Measure.</strong> Body copy holds 45–75 characters. These paragraphs are set at 62ch and feel smug about it.</li>
          <li><strong>Leading.</strong> 1.55 for body, 1.15 for display. Line-height is a function of measure, not vibes.</li>
          <li><strong>Contrast of voice.</strong> Serif for what we say, sans for what the machine says. Never mix them mid-sentence.</li>
          <li><strong>Numerals.</strong> Tabular in tables and metrics; the “214” in a latency figure must never jitter as it counts.</li>
        </ul>
      </section>

      <A11yNote
        items={[
          'Body text never drops below 16px; caption is 12.8px and reserved for furniture, not content.',
          'Users who set a 200% text zoom get a single column and nothing overlaps — we test it, not assume it.',
          'Justified text is banned. Rivers of white space are a readability tax on everyone.',
        ]}
      />
    </div>
  )
}

function IconographyPage({ ctx }: { ctx: PageCtx }) {
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return GLYPHS
    return GLYPHS.filter(
      (g) => g.name.includes(needle) || g.tags.some((t) => t.includes(needle)),
    )
  }, [q])
  return (
    <div>
      <section className="cpd-sect">
        <div className="cpd-specrow">
          {ICON_SPEC.map((s) => (
            <div className="cpd-spec" key={s.k}>
              <span className="cpd-spec__k mono">{s.k}</span>
              <span className="cpd-spec__v">{s.v}</span>
            </div>
          ))}
        </div>
        <div className="cpd-iconsearch">
          <input
            className="cp-input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search glyphs — try “alert” or “git”"
            aria-label="Search the glyph library"
          />
          <p className="cpd-iconsearch__count mono" role="status">
            {results.length} of {GLYPHS.length} glyphs
          </p>
        </div>
        <div className="cpd-glyphgrid">
          {results.map((g) => (
            <button
              key={g.name}
              className="cpd-glyphcell"
              onClick={() => ctx.copy(`glyph-${g.name}`, g.name)}
              title={`Copy glyph name “${g.name}”`}
            >
              <GlyphIcon name={g.name} size={26} />
              <span className="cpd-glyphcell__name mono">
                {ctx.copied === `glyph-${g.name}` ? 'copied' : g.name}
              </span>
            </button>
          ))}
          {results.length === 0 ? (
            <p className="cpd-empty">No glyph by that name. Draw it, propose it, or use words — words are cheap and accessible.</p>
          ) : null}
        </div>
      </section>
      <A11yNote
        items={[
          'Glyphs are decorative by default: aria-hidden, with meaning carried by an adjacent word.',
          'An icon-only button must supply an aria-label and a visible focus ring — see the alert dismiss button.',
          'Stroke scales with font size; at 12px the grid holds, below that we use words.',
        ]}
      />
    </div>
  )
}

/* === tokens ================================================================= */

function ColourField({
  label,
  token,
  value,
  onChange,
}: {
  label: string
  token: string
  value: string
  onChange: (v: string) => void
}) {
  const [text, setText] = useState(value)
  const [dirty, setDirty] = useState(false)
  const shown = dirty ? text : value
  const valid = isHex(shown)
  return (
    <div className={`cpd-tokfield${valid ? '' : ' cpd-tokfield--invalid'}`}>
      <input
        type="color"
        value={valid ? shown : '#000000'}
        onChange={(e) => {
          setDirty(false)
          setText(e.target.value)
          onChange(e.target.value)
        }}
        aria-label={`${label} — colour picker`}
      />
      <input
        className="cpd-tokfield__hex mono"
        type="text"
        value={shown}
        spellCheck={false}
        aria-label={`${label} — hex value`}
        onChange={(e) => {
          const v = e.target.value
          setDirty(true)
          setText(v)
          if (isHex(v)) {
            setDirty(false)
            onChange(v)
          }
        }}
      />
      <span className="cpd-tokfield__meta">
        <span className="cpd-tokfield__label">{label}</span>
        <span className="cpd-tokfield__tok mono">{token}</span>
      </span>
      {!valid ? <span className="cpd-tokfield__err mono">not a hex</span> : null}
    </div>
  )
}

function PlaygroundPage({ ctx }: { ctx: PageCtx }) {
  const t = ctx.tokens
  const css = tokenCss(t)
  const [autoChecked, setAutoChecked] = useState(true)
  return (
    <div>
      <div className="cpd-play">
        <div className="cpd-play__editor">
          <section className="cpd-edgroup" aria-labelledby="cpd-ed-colour">
            <h3 className="cpd-h3" id="cpd-ed-colour">Colour</h3>
            <ColourField label="Ink" token="--cp-ink" value={t.ink} onChange={(v) => ctx.patch({ ink: v })} />
            <ColourField label="Bone" token="--cp-paper" value={t.paper} onChange={(v) => ctx.patch({ paper: v })} />
            <ColourField label="Copper" token="--cp-accent" value={t.accent} onChange={(v) => ctx.patch({ accent: v })} />
            <ColourField label="Copper ink" token="--cp-accent-ink" value={t.accentInk} onChange={(v) => ctx.patch({ accentInk: v })} />
            <ColourField label="Verdigris" token="--cp-success" value={t.success} onChange={(v) => ctx.patch({ success: v })} />
            <ColourField label="Clay" token="--cp-danger" value={t.danger} onChange={(v) => ctx.patch({ danger: v })} />
          </section>

          <section className="cpd-edgroup" aria-labelledby="cpd-ed-space">
            <h3 className="cpd-h3" id="cpd-ed-space">Space &amp; shape</h3>
            <div className="cpd-slider">
              <label htmlFor="cpd-sp">Space unit <span className="mono">{t.space}px</span></label>
              <input
                id="cpd-sp"
                type="range"
                min={4}
                max={12}
                step={1}
                value={t.space}
                onChange={(e) => ctx.patch({ space: Number(e.target.value) })}
              />
            </div>
            <div className="cpd-slider">
              <label htmlFor="cpd-rd">Radius <span className="mono">{t.radius}px</span></label>
              <input
                id="cpd-rd"
                type="range"
                min={0}
                max={16}
                step={1}
                value={t.radius}
                onChange={(e) => ctx.patch({ radius: Number(e.target.value) })}
              />
            </div>
          </section>

          <section className="cpd-edgroup" aria-labelledby="cpd-ed-type">
            <h3 className="cpd-h3" id="cpd-ed-type">Type</h3>
            <div className="cpd-slider">
              <label htmlFor="cpd-fs">Body size <span className="mono">{t.fontSize}px</span></label>
              <input
                id="cpd-fs"
                type="range"
                min={14}
                max={19}
                step={1}
                value={t.fontSize}
                onChange={(e) => ctx.patch({ fontSize: Number(e.target.value) })}
              />
            </div>
            <div className="cpd-slider">
              <label htmlFor="cpd-sc">Scale ratio</label>
              <CpSelect
                id="cpd-sc"
                value={String(t.scale)}
                onChange={(e) => ctx.patch({ scale: Number(e.target.value) })}
              >
                {SCALE_OPTIONS.map((o) => (
                  <option key={o.value} value={String(o.value)}>
                    {o.label}
                  </option>
                ))}
              </CpSelect>
            </div>
          </section>

          <div className="cpd-play__actions">
            <CopyButton id="tokencss" text={css} copied={ctx.copied} copy={ctx.copy} label="Copy as CSS" />
            <CpButton variant="ghost" onClick={ctx.resetTokens}>
              Reset plates
            </CpButton>
          </div>
        </div>

        <div className="cpd-play__preview">
          <p className="cpd-eyebrow">Proof sheet — eight citizens, live</p>
          <div className="cpd-proof" style={tokenVars(t) as React.CSSProperties}>
            <div className="cpd-proof__cell"><CpButton>Deploy build</CpButton></div>
            <div className="cpd-proof__cell"><CpButton variant="ghost">View logs</CpButton></div>
            <div className="cpd-proof__cell">
              <CpField id="pg-input" label="Service name">
                <CpInput id="pg-input" defaultValue="api-gateway" />
              </CpField>
            </div>
            <div className="cpd-proof__cell">
              <CpCheckbox id="pg-check" label="Auto-rollback on burn" checked={autoChecked} onChange={setAutoChecked} />
            </div>
            <div className="cpd-proof__cell cpd-proof__cell--wide">
              <CpAlert tone="success" title="Deploy finished">
                <p>api-gateway is live in 3 regions · 42 s</p>
              </CpAlert>
            </div>
            <div className="cpd-proof__cell">
              <span className="cpd-proof__badges">
                <CpBadge tone="success">Healthy</CpBadge>
                <CpBadge tone="accent">Maintenance</CpBadge>
              </span>
            </div>
            <div className="cpd-proof__cell">
              <CpCard eyebrow="Service · 3 regions" title="api-gateway" footer={<span className="mono">p99 · 210 ms</span>}>
                <p>Error rate 0.02% — inside budget.</p>
              </CpCard>
            </div>
            <div className="cpd-proof__cell cpd-proof__cell--wide">
              <CpTabs
                tabs={[
                  { id: 'pgo', label: 'Overview', panel: <p className="cpd-proof__panel">3 regions, 1,204 samples/min, budget 68% intact.</p> },
                  { id: 'pgm', label: 'Metrics', panel: <p className="cpd-proof__panel">p50 96 ms · p95 188 ms · p99 210 ms.</p> },
                ]}
              />
            </div>
          </div>
          <p className="cpd-play__note mono" role="status">
            Proof re-renders as you edit — nothing above is a screenshot.
          </p>
          <CodeBlock code={css} label="CSS" copied={ctx.copied} copy={ctx.copy} />
        </div>
      </div>

      <A11yNote
        items={[
          'Every editor control is a labelled native input — the playground itself follows its own rules.',
          'If a colour edit breaks a legal pairing, the pairing table on the colour plate is where we ask you to look.',
          'Exported CSS is plain custom properties; no build step, no runtime, no excuses.',
        ]}
      />
    </div>
  )
}

function ReferencePage({ ctx }: { ctx: PageCtx }) {
  const t = ctx.tokens
  const rows: Array<[string, string, string]> = [
    ['--cp-ink', t.ink, 'text'],
    ['--cp-paper', t.paper, 'surface'],
    ['--cp-accent', t.accent, 'action'],
    ['--cp-accent-ink', t.accentInk, 'text on accent'],
    ['--cp-success', t.success, 'healthy'],
    ['--cp-danger', t.danger, 'harm'],
    ['--cp-space', `${t.space}px`, 'rhythm'],
    ['--cp-radius', `${t.radius}px`, 'shape'],
    ['--cp-font-size', `${t.fontSize}px`, 'type'],
    ['--cp-scale', String(t.scale), 'type'],
  ]
  return (
    <div>
      <section className="cpd-sect">
        <h2 className="cpd-h2">Colour</h2>
        <div className="cpd-reftable" role="table" aria-label="Token reference">
          <div className="cpd-reftable__row cpd-reftable__row--head" role="row">
            <span role="columnheader">Token</span>
            <span role="columnheader">Value</span>
            <span role="columnheader">Job</span>
          </div>
          {rows.map(([name, value, job]) => (
            <div className="cpd-reftable__row" role="row" key={name}>
              <span role="cell" className="mono">{name}</span>
              <span role="cell" className="mono">
                {name.includes('ink') || name.includes('paper') || name.includes('accent') || name.includes('success') || name.includes('danger') ? (
                  <i className="cpd-reftable__dot" style={{ background: value }} aria-hidden="true" />
                ) : null}
                {value}
              </span>
              <span role="cell">{job}</span>
            </div>
          ))}
        </div>
        <p className="cpd-p cpd-p--note">Values shown with your playground overrides applied.</p>
      </section>

      <section className="cpd-sect">
        <h2 className="cpd-h2">Space, drawn to scale</h2>
        <div className="cpd-spbars">
          {SPACE_STEPS.map((s) => (
            <div className="cpd-spbar" key={s.name}>
              <span className="cpd-spbar__name mono">space-{s.name}</span>
              <span
                className="cpd-spbar__bar"
                style={{ width: `${Math.min(100, (spaceValue(t.space, s.mult) / (t.space * 4)) * 100)}%` }}
                aria-hidden="true"
              />
              <span className="cpd-spbar__val mono">{spaceValue(t.space, s.mult)}px</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cpd-sect">
        <h2 className="cpd-h2">Radius</h2>
        <div className="cpd-radii" aria-label={`Radius preview at ${t.radius}px`}>
          <span className="cpd-radii__sq" style={{ borderRadius: t.radius }} />
          <span className="cpd-radii__sq" style={{ borderRadius: t.radius }} />
          <span className="cpd-radii__sq" style={{ borderRadius: t.radius }} />
          <span className="cpd-radii__val mono">{t.radius}px — buttons, cards, inputs. Sheets may double it. Circles stay circles.</span>
        </div>
      </section>
    </div>
  )
}

/* === components ============================================================== */

function ComponentShell({
  id,
  ctx,
  plate,
  dd,
}: {
  id: keyof typeof GUIDANCE
  ctx: PageCtx
  plate: React.ReactNode
  dd: React.ReactNode
}) {
  const g = GUIDANCE[id]
  return (
    <div>
      <section className="cpd-sect">
        <h2 className="cpd-h2">Live plate</h2>
        <div className="cpd-plate">{plate}</div>
      </section>
      <section className="cpd-sect">
        <h2 className="cpd-h2">When to use</h2>
        <ul className="cpd-rules">
          {g.usage.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </section>
      <section className="cpd-sect">
        <h2 className="cpd-h2">Markup</h2>
        <CodeBlock code={g.snippet} label={g.snippetLang ?? 'HTML'} copied={ctx.copied} copy={ctx.copy} />
      </section>
      <A11yNote items={g.a11y} />
      <section className="cpd-sect">
        <h2 className="cpd-h2">Do / don’t</h2>
        <div className="cpd-ddgrid">{dd}</div>
      </section>
    </div>
  )
}

function ButtonsPage({ ctx }: { ctx: PageCtx }) {
  return (
    <ComponentShell
      id="buttons"
      ctx={ctx}
      plate={
        <div className="cpd-plate__row">
          <CpButton>Deploy to production</CpButton>
          <CpButton variant="ghost">View logs</CpButton>
          <CpButton variant="quiet">Dismiss</CpButton>
          <CpButton variant="danger">Delete service</CpButton>
          <CpButton disabled>Deploy to production</CpButton>
        </div>
      }
      dd={
        <>
          <DdPlate kind="do" caption="Verbs with objects. The button answers “what happens when I press this?”">
            <CpButton>Save dashboard</CpButton>
          </DdPlate>
          <DdPlate kind="dont" caption="Vague nouns, click-here copy, icon-only mysteries.">
            <CpButton>Click here</CpButton>
          </DdPlate>
          <DdPlate kind="do" caption="One primary per view; the alternative sits quietly beside it.">
            <span className="cpd-dd__pair">
              <CpButton>Deploy</CpButton>
              <CpButton variant="ghost">Preview first</CpButton>
            </span>
          </DdPlate>
          <DdPlate kind="dont" caption="Two primaries is a custody battle the user pays for.">
            <span className="cpd-dd__pair">
              <CpButton>Deploy</CpButton>
              <CpButton>Save draft</CpButton>
            </span>
          </DdPlate>
          <DdPlate kind="do" caption="Destructive actions look dangerous and sit away from safe ones.">
            <span className="cpd-dd__pair">
              <CpButton variant="ghost">Rename service</CpButton>
              <CpButton variant="danger">Delete service</CpButton>
            </span>
          </DdPlate>
          <DdPlate kind="dont" caption="A red primary next to the safe path is an incident report in waiting.">
            <span className="cpd-dd__pair">
              <CpButton variant="danger">Delete service</CpButton>
              <CpButton>Rename service</CpButton>
            </span>
          </DdPlate>
        </>
      }
    />
  )
}

function FormsPage({ ctx }: { ctx: PageCtx }) {
  const [email, setEmail] = useState('oncall@copperplate')
  const [touched, setTouched] = useState(false)
  const error = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Add a domain — “oncall@copperplate.io”.' : undefined
  const [notify, setNotify] = useState(true)
  const [weekly, setWeekly] = useState(false)
  return (
    <ComponentShell
      id="forms"
      ctx={ctx}
      plate={
        <div className="cpd-plate__form">
          <CpField id="cpd-f-svc" label="Service name" hint="Lowercase, hyphens, no mercy.">
            <CpInput id="cpd-f-svc" defaultValue="api-gateway" aria-describedby="cpd-f-svc-hint" />
          </CpField>
          <CpField id="cpd-f-email" label="Alert email" error={error}>
            <CpInput
              id="cpd-f-email"
              type="email"
              value={email}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'cpd-f-email-error' : undefined}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
            />
          </CpField>
          <CpField id="cpd-f-region" label="Home region" hint="Where dashboards open by default.">
            <CpSelect id="cpd-f-region" defaultValue="syd">
              <option value="syd">ap-southeast-2 · Sydney</option>
              <option value="sin">ap-southeast-1 · Singapore</option>
              <option value="dub">eu-west-1 · Dublin</option>
              <option value="iad">us-east-1 · N. Virginia</option>
            </CpSelect>
          </CpField>
          <fieldset className="cpd-fieldset">
            <legend>Notify me when</legend>
            <CpCheckbox id="cpd-f-n1" label="Error budget burns faster than 2×" checked={notify} onChange={setNotify} />
            <CpCheckbox id="cpd-f-n2" label="A digest would do (weekly)" checked={weekly} onChange={setWeekly} />
            <CpCheckbox id="cpd-f-n3" label="Saturn aligns with Mars (disabled)" checked={false} onChange={() => {}} disabled />
          </fieldset>
          <p className="cpd-p cpd-p--note">Try the email field — validation fires on blur, not per keystroke.</p>
        </div>
      }
      dd={
        <>
          <DdPlate kind="do" caption="Labels above, always visible; the hint does the light work.">
            <CpField id="cpd-d-email1" label="Alert email" hint="Where incidents find you.">
              <CpInput id="cpd-d-email1" placeholder="oncall@copperplate.io" />
            </CpField>
          </DdPlate>
          <DdPlate kind="dont" caption="Placeholder-as-label evaporates the moment it’s needed most.">
            <CpInput aria-label="alert email, placeholder only" placeholder="Alert email" />
          </DdPlate>
          <DdPlate kind="do" caption="Errors name the fix and keep the user’s own text.">
            <CpField id="cpd-d-email2" label="Alert email" error="Add a domain — “oncall@copperplate.io”.">
              <CpInput id="cpd-d-email2" defaultValue="oncall@copperplate" aria-invalid="true" aria-describedby="cpd-d-email2-error" />
            </CpField>
          </DdPlate>
          <DdPlate kind="dont" caption="“Invalid input” is an accusation, not guidance.">
            <CpField id="cpd-d-email3" label="Alert email" error="Invalid input.">
              <CpInput id="cpd-d-email3" defaultValue="oncall@copperplate" aria-invalid="true" aria-describedby="cpd-d-email3-error" />
            </CpField>
          </DdPlate>
        </>
      }
    />
  )
}

function AlertsPage({ ctx }: { ctx: PageCtx }) {
  const [showDeploy, setShowDeploy] = useState(true)
  return (
    <ComponentShell
      id="alerts"
      ctx={ctx}
      plate={
        <div className="cpd-plate__stack">
          <CpAlert tone="info" title="Maintenance Saturday 02:00–03:00 AEST">
            <p>eu-west region. Dashboards stay read-only; alerts keep firing.</p>
          </CpAlert>
          {showDeploy ? (
            <CpAlert tone="success" title="Deploy finished" onDismiss={() => setShowDeploy(false)}>
              <p>api-gateway is live in 3 regions · 42 s. Dismiss me — I insist.</p>
            </CpAlert>
          ) : (
            <CpButton variant="quiet" onClick={() => setShowDeploy(true)}>
              Bring back the success alert
            </CpButton>
          )}
          <CpAlert tone="warning" title="Certificate expires in 9 days">
            <p>Rotate certs for checkout-api before 5 Oct or the pager finds you first.</p>
          </CpAlert>
          <CpAlert tone="danger" title="Error budget exhausted">
            <p>checkout-api burned 98% of its budget. Freeze deploys or widen the window — then tell #incidents.</p>
          </CpAlert>
        </div>
      }
      dd={
        <>
          <DdPlate kind="do" caption="Name the fire, name the extinguisher, name the channel.">
            <CpAlert tone="danger" title="Error budget exhausted">
              <p>Freeze deploys for checkout-api, then tell #incidents.</p>
            </CpAlert>
          </DdPlate>
          <DdPlate kind="dont" caption="“Something went wrong” is anxiety with a border-radius.">
            <CpAlert tone="danger" title="Something went wrong">
              <p>Please try again later.</p>
            </CpAlert>
          </DdPlate>
          <DdPlate kind="do" caption="Success confirms and leaves — always dismissible.">
            <CpAlert tone="success" title="Deploy finished" onDismiss={() => {}}>
              <p>api-gateway · 3 regions · 42 s</p>
            </CpAlert>
          </DdPlate>
          <DdPlate kind="dont" caption="A success you can’t dismiss becomes furniture by Thursday.">
            <CpAlert tone="success" title="Deploy finished">
              <p>api-gateway · 3 regions · 42 s</p>
            </CpAlert>
          </DdPlate>
        </>
      }
    />
  )
}

function CardsPage({ ctx }: { ctx: PageCtx }) {
  const [n, setN] = useState(0)
  return (
    <ComponentShell
      id="cards"
      ctx={ctx}
      plate={
        <div className="cpd-plate__cards">
          <CpCard
            eyebrow="Service · 3 regions"
            title="api-gateway"
            footer={<CpBadge tone="success">Healthy</CpBadge>}
          >
            <p>p99 210 ms · error rate 0.02%. Boring, as it should be.</p>
          </CpCard>
          <CpCard
            interactive
            eyebrow="Dashboard · on-call"
            title="Golden signals"
            footer={<span className="mono">opened {n === 0 ? 'never — try the card' : `${n} time${n === 1 ? '' : 's'}`}</span>}
            onClick={() => setN((x) => x + 1)}
          >
            <p>Latency, traffic, errors, saturation. The whole surface is one link.</p>
          </CpCard>
          <CpCard
            eyebrow="Alert rule · paging"
            title="Budget burn > 2×"
            footer={<CpBadge tone="accent">In maintenance</CpBadge>}
          >
            <p>Pages the owning team when burn rate doubles for 15 minutes.</p>
          </CpCard>
        </div>
      }
      dd={
        <>
          <DdPlate kind="do" caption="One subject, one action, status in words.">
            <CpCard eyebrow="Service · 3 regions" title="api-gateway" footer={<CpBadge tone="success">Healthy</CpBadge>}>
              <p>p99 210 ms · error rate 0.02%.</p>
            </CpCard>
          </DdPlate>
          <DdPlate kind="dont" caption="A junk drawer of micro-buttons no keyboard can survive.">
            <div className="cpd-dd__mess">
              <CpButton variant="quiet">Logs</CpButton>
              <CpButton variant="quiet">Metrics</CpButton>
              <CpButton variant="quiet">Traces</CpButton>
              <CpButton variant="quiet">Alerts</CpButton>
            </div>
          </DdPlate>
        </>
      }
    />
  )
}

function BadgesPage({ ctx }: { ctx: PageCtx }) {
  return (
    <ComponentShell
      id="badges"
      ctx={ctx}
      plate={
        <div className="cpd-plate__row">
          <CpBadge tone="success">Healthy</CpBadge>
          <CpBadge tone="neutral">3 regions</CpBadge>
          <CpBadge tone="accent">In maintenance</CpBadge>
          <CpBadge tone="danger">Degraded · 14 min</CpBadge>
        </div>
      }
      dd={
        <>
          <DdPlate kind="do" caption="Words with a timestamp; a greyscale print still reads.">
            <CpBadge tone="danger">Degraded · 14 min</CpBadge>
          </DdPlate>
          <DdPlate kind="dont" caption="A bare dot carries meaning only in colour vision you might not have.">
            <span className="cpd-dd__dotrow">
              <i className="cpd-dd__dot" /> <i className="cpd-dd__dot cpd-dd__dot--warn" /> <i className="cpd-dd__dot cpd-dd__dot--bad" />
            </span>
          </DdPlate>
          <DdPlate kind="do" caption="Status next to the thing it describes — same row, same breath.">
            <span className="cpd-dd__pair">
              <span>checkout-api</span> <CpBadge tone="accent">Maintenance</CpBadge>
            </span>
          </DdPlate>
          <DdPlate kind="dont" caption="A legend three scrolls away turns status into archaeology.">
            <span className="cpd-dd__pair mono">status: see legend ↓↓↓</span>
          </DdPlate>
        </>
      }
    />
  )
}

function TabsPage({ ctx }: { ctx: PageCtx }) {
  return (
    <ComponentShell
      id="tabs"
      ctx={ctx}
      plate={
        <CpTabs
          tabs={[
            {
              id: 'ov',
              label: 'Overview',
              panel: (
                <div className="cpd-tabpanel">
                  <p><strong>api-gateway</strong> serves 1,204 samples/min across 3 regions. Error budget 68% intact, on pace to finish the quarter boring.</p>
                  <p className="mono cpd-tabpanel__meta">Owner: platform · Tier 1 · Runbook v12</p>
                </div>
              ),
            },
            {
              id: 'mt',
              label: 'Metrics',
              panel: (
                <div className="cpd-tabpanel">
                  <p>p50 96 ms · p95 188 ms · p99 210 ms. The p99 wobble at 14:00 is the nightly fraud-scan fan-out; it’s in the runbook.</p>
                  <p className="mono cpd-tabpanel__meta">Window: 24 h · Resolution: 1 min</p>
                </div>
              ),
            },
            {
              id: 'lg',
              label: 'Logs',
              panel: (
                <div className="cpd-tabpanel">
                  <p className="mono cpd-tabpanel__log">14:02:11 deploy ok · sha 9f31c<br />14:02:40 warm pools ready<br />14:03:02 health checks green in 3/3 regions</p>
                </div>
              ),
            },
          ]}
        />
      }
      dd={
        <>
          <DdPlate kind="do" caption="Three peers, short labels, one subject.">
            <span className="cpd-dd__tabs">
              <span className="cpd-dd__tab is-active">Overview</span>
              <span className="cpd-dd__tab">Metrics</span>
              <span className="cpd-dd__tab">Logs</span>
            </span>
          </DdPlate>
          <DdPlate kind="dont" caption="Seven long labels is navigation wearing a tab costume.">
            <span className="cpd-dd__tabs">
              <span className="cpd-dd__tab is-active">Overview &amp; summary</span>
              <span className="cpd-dd__tab">Metrics</span>
              <span className="cpd-dd__tab">Logs &amp; events</span>
              <span className="cpd-dd__tab">Settings</span>
              <span className="cpd-dd__tab">Billing…</span>
            </span>
          </DdPlate>
        </>
      }
    />
  )
}

/* === patterns ================================================================ */

function ChoosingPage({ ctx }: { ctx: PageCtx }) {
  return (
    <div>
      <p className="cpd-p">
        This is the page we point to in review when two people reach for different components. It
        changes rarely and argues often.
      </p>
      <div className="cpd-decisions" role="table" aria-label="Component decision table">
        <div className="cpd-decisions__row cpd-decisions__row--head" role="row">
          <span role="columnheader">If you need to…</span>
          <span role="columnheader">Reach for</span>
          <span role="columnheader">Never</span>
        </div>
        {DECISIONS.map((d) => (
          <div className="cpd-decisions__row" role="row" key={d.need}>
            <span role="cell" className="cpd-decisions__need">{d.need}</span>
            <span role="cell" className="cpd-decisions__reach">{d.reach}</span>
            <span role="cell" className="cpd-decisions__never">{d.never}</span>
          </div>
        ))}
      </div>
      <section className="cpd-sect">
        <h2 className="cpd-h2">Still stuck?</h2>
        <p className="cpd-p">
          Two questions settle most arguments: <em>does the user leave the page mentally?</em> (then
          it isn’t a tab) and <em>can they ignore it safely?</em> (then it isn’t a modal). When in
          doubt, the boring component wins — that’s the point of having a system.
        </p>
        <div className="cpd-hero__cta">
          <CpButton variant="ghost" onClick={() => ctx.go('alerts')}>
            Re-read the alerts plate
          </CpButton>
          <CpButton variant="quiet" onClick={() => ctx.go('do-dont')}>
            Browse the do/don’t plates
          </CpButton>
        </div>
      </section>
    </div>
  )
}

function DoDontPage() {
  return (
    <div>
      <p className="cpd-p">
        Abstract rules get ignored; concrete pairs get remembered. Each component plate carries its
        own pair — these are the cross-cutting ones.
      </p>
      <div className="cpd-ddgrid">
        <DdPlate kind="do" caption="Empty states teach the first action.">
          <div className="cpd-dd__empty">
            <p className="cpd-dd__emptytitle">No dashboards yet</p>
            <p className="cpd-dd__emptynote">Dashboards group the signals you check at 3am.</p>
            <CpButton>Create your first dashboard</CpButton>
          </div>
        </DdPlate>
        <DdPlate kind="dont" caption="A blank well says “your problem now”.">
          <div className="cpd-dd__empty cpd-dd__empty--blank" aria-label="An empty panel with no content" />
        </DdPlate>
        <DdPlate kind="do" caption="Confirmations use calm language and tell you what’s next.">
          <CpAlert tone="success" title="Dashboard saved">
            <p>Shared with platform · visible on the on-call wall in ~30 s.</p>
          </CpAlert>
        </DdPlate>
        <DdPlate kind="dont" caption="“Success!” tells you nothing about what succeeded or where.">
          <CpAlert tone="success" title="Success!">
            <p>Operation completed successfully.</p>
          </CpAlert>
        </DdPlate>
        <DdPlate kind="do" caption="Numbers line up; tabular numerals, right-aligned in tables.">
          <span className="cpd-dd__nums mono">
            <span>api-gateway · 210 ms</span>
            <span>checkout-api · 92 ms</span>
            <span>fraud-scan · 1,204 ms</span>
          </span>
        </DdPlate>
        <DdPlate kind="dont" caption="Proportional numerals jitter as they count and misalign the eye.">
          <span className="cpd-dd__nums cpd-dd__nums--ragged mono">
            <span>api-gateway 210ms</span>
            <span>checkout 92ms</span>
            <span>fraud 1.2s</span>
          </span>
        </DdPlate>
      </div>
      <A11yNote
        items={[
          'Every “don’t” plate is a real rendered failure, not a scribbled-out screenshot — test your craft by tabbing through them.',
          "If a rule isn’t worth rendering as a pair, it isn’t worth a section in the docs.",
        ]}
      />
    </div>
  )
}

/* === registry ================================================================== */

const RENDERERS: Record<string, (ctx: PageCtx) => React.ReactElement> = {
  overview: (ctx) => <OverviewPage ctx={ctx} />,
  colour: (ctx) => <ColourPage ctx={ctx} />,
  typography: () => <TypographyPage />,
  iconography: (ctx) => <IconographyPage ctx={ctx} />,
  playground: (ctx) => <PlaygroundPage ctx={ctx} />,
  reference: (ctx) => <ReferencePage ctx={ctx} />,
  buttons: (ctx) => <ButtonsPage ctx={ctx} />,
  forms: (ctx) => <FormsPage ctx={ctx} />,
  alerts: (ctx) => <AlertsPage ctx={ctx} />,
  cards: (ctx) => <CardsPage ctx={ctx} />,
  badges: (ctx) => <BadgesPage ctx={ctx} />,
  tabs: (ctx) => <TabsPage ctx={ctx} />,
  choosing: (ctx) => <ChoosingPage ctx={ctx} />,
  'do-dont': () => <DoDontPage />,
}

export function renderPage(id: string, ctx: PageCtx): React.ReactElement {
  const r = RENDERERS[id] ?? RENDERERS.overview
  return r(ctx)
}
