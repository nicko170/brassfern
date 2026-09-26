/**
 * Osprey Pack Configurator — data & pricing.
 * Fictional product data for the fictional Osprey Outdoor. All prices AUD,
 * all weights and dimensions plausible-but-invented.
 */

export interface ColourOption {
  id: string
  name: string
  hex: string
  /** price modifier when used on the main body (hi-vis dye costs extra) */
  bodyAdd: number
}

export interface Model {
  id: string
  name: string
  litres: number
  price: number
  weightG: number
  dims: string
  backCm: number
  use: string
  scaleY: number
  scaleXZ: number
}

export interface Fabric {
  id: string
  name: string
  desc: string
  roughness: number
  add: number
  weightFactor: number
}

export interface Torso {
  id: string
  label: string
  range: string
  factor: number
  weightAdj: number
}

export interface Config {
  model: string
  torso: string
  fabric: string
  body: string
  pocket: string
  trim: string
  exploded: boolean
}

export const COLOURS: ColourOption[] = [
  { id: 'moss', name: 'Moss', hex: '#66794e', bodyAdd: 0 },
  { id: 'graphite', name: 'Graphite', hex: '#484d4b', bodyAdd: 0 },
  { id: 'blaze', name: 'Blaze', hex: '#e4561e', bodyAdd: 15 },
  { id: 'blue-hour', name: 'Blue Hour', hex: '#41597a', bodyAdd: 0 },
  { id: 'sandstone', name: 'Sandstone', hex: '#c2a97e', bodyAdd: 0 },
  { id: 'canyon', name: 'Canyon', hex: '#96552f', bodyAdd: 0 },
]

export const MODELS: Model[] = [
  {
    id: 'scout',
    name: 'Scout 28',
    litres: 28,
    price: 199,
    weightG: 1060,
    dims: '52 × 28 × 24 cm',
    backCm: 42,
    use: 'Day hikes, summit pushes, carry-on travel',
    scaleY: 1,
    scaleXZ: 1,
  },
  {
    id: 'range',
    name: 'Range 45',
    litres: 45,
    price: 259,
    weightG: 1390,
    dims: '64 × 32 × 28 cm',
    backCm: 46,
    use: 'Overnighters and long weekend trails',
    scaleY: 1.16,
    scaleXZ: 1.05,
  },
  {
    id: 'summit',
    name: 'Summit 65',
    litres: 65,
    price: 319,
    weightG: 1740,
    dims: '74 × 36 × 32 cm',
    backCm: 50,
    use: 'Multi-day treks and alpine approaches',
    scaleY: 1.3,
    scaleXZ: 1.1,
  },
]

export const FABRICS: Fabric[] = [
  {
    id: 'ripstop',
    name: 'Ripstop 210D',
    desc: 'Recycled nylon ripstop. The workhorse.',
    roughness: 0.68,
    add: 0,
    weightFactor: 1,
  },
  {
    id: 'canvas',
    name: 'Waxed canvas',
    desc: '14 oz waxed cotton. Ages like a good boot.',
    roughness: 0.92,
    add: 45,
    weightFactor: 1.22,
  },
  {
    id: 'dyneema',
    name: 'Dyneema® comp',
    desc: 'Composite laminate. Featherweight, bank-account-weight price.',
    roughness: 0.34,
    add: 85,
    weightFactor: 0.74,
  },
]

export const TORSOS: Torso[] = [
  { id: 's', label: 'S', range: '38–43 cm', factor: 0.94, weightAdj: -40 },
  { id: 'm', label: 'M', range: '43–48 cm', factor: 1, weightAdj: 0 },
  { id: 'l', label: 'L', range: '48–53 cm', factor: 1.06, weightAdj: 45 },
]

export const DEFAULT_CONFIG: Config = {
  model: 'range',
  torso: 'm',
  fabric: 'ripstop',
  body: 'moss',
  pocket: 'graphite',
  trim: 'blaze',
  exploded: false,
}

export function byId<T extends { id: string }>(list: T[], id: string): T {
  return list.find((x) => x.id === id) ?? list[0]
}

function pick(list: { id: string }[], id: string, fallback: string): string {
  return list.some((x) => x.id === id) ? id : fallback
}

export function hexOf(id: string): string {
  return byId(COLOURS, id).hex
}

export interface Spec {
  model: Model
  fabric: Fabric
  torso: Torso
  weightG: number
  weightKg: string
  backCm: number
  colourAdd: number
  price: number
  colourwayName: string
}

export function specOf(c: Config): Spec {
  const model = byId(MODELS, c.model)
  const fabric = byId(FABRICS, c.fabric)
  const torso = byId(TORSOS, c.torso)
  const colourAdd = byId(COLOURS, c.body).bodyAdd
  const weightG = Math.round((model.weightG * fabric.weightFactor + torso.weightAdj) / 5) * 5
  return {
    model,
    fabric,
    torso,
    weightG,
    weightKg: (weightG / 1000).toFixed(2),
    backCm: Math.round(model.backCm * torso.factor),
    colourAdd,
    price: model.price + fabric.add + colourAdd,
    colourwayName: `${byId(COLOURS, c.body).name} / ${byId(COLOURS, c.pocket).name} / ${byId(COLOURS, c.trim).name}`,
  }
}

export function parseConfig(search: string): Config {
  const p = new URLSearchParams(search)
  const g = (k: string) => p.get(k) ?? ''
  return {
    model: pick(MODELS, g('pack'), DEFAULT_CONFIG.model),
    torso: pick(TORSOS, g('fit'), DEFAULT_CONFIG.torso),
    fabric: pick(FABRICS, g('fabric'), DEFAULT_CONFIG.fabric),
    body: pick(COLOURS, g('body'), DEFAULT_CONFIG.body),
    pocket: pick(COLOURS, g('pocket'), DEFAULT_CONFIG.pocket),
    trim: pick(COLOURS, g('trim'), DEFAULT_CONFIG.trim),
    exploded: g('view') === 'exploded',
  }
}

export function serializeConfig(c: Config): string {
  const p = new URLSearchParams()
  p.set('pack', c.model)
  p.set('fit', c.torso)
  p.set('fabric', c.fabric)
  p.set('body', c.body)
  p.set('pocket', c.pocket)
  p.set('trim', c.trim)
  if (c.exploded) p.set('view', 'exploded')
  return p.toString()
}
