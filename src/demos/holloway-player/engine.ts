/**
 * Holloway player — generative audio engine.
 * Each "track" is a deterministic generative loop tuned to its album's key
 * and tempo: a minor-pentatonic pluck pattern, a low sine bass on the bar,
 * and a soft off-beat shimmer. Built on the Web Audio API with a lookahead
 * scheduler. Falls back to silent simulated playback if AudioContext is
 * unavailable (or the tab blocks it) — the UI never depends on sound.
 * An AudioContext is only created inside a user-gesture play call.
 */

import { mulberry } from './data'

export interface EngineOpts {
  seed: number
  bpm: number
  root: number
}

export interface Player {
  start(opts: EngineOpts): void
  stop(): void
  setVolume(v: number): void
}

const SCALE = [0, 3, 5, 7, 10, 12, 15, 19, 22]
const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

export function createPlayer(): Player {
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let tone: BiquadFilterNode | null = null
  let timer: number | null = null
  let volume = 0.6

  let step = 0
  let nextTime = 0
  let opts: EngineOpts = { seed: 1, bpm: 100, root: 45 }
  let melody: number[] = [] // 16 steps; -1 = rest, else scale degree

  function ensureCtx(): boolean {
    if (ctx) return true
    if (typeof window === 'undefined') return false
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return false
    try {
      ctx = new AC()
      master = ctx.createGain()
      tone = ctx.createBiquadFilter()
      tone.type = 'lowpass'
      tone.frequency.value = 2400
      tone.Q.value = 0.4
      volumeRamp()
      master.connect(tone)
      tone.connect(ctx.destination)
      return true
    } catch {
      ctx = null
      master = null
      tone = null
      return false
    }
  }

  function volumeRamp() {
    if (!ctx || !master) return
    master.gain.setTargetAtTime(volume * volume * 0.5, ctx.currentTime, 0.05)
  }

  /** Build a deterministic 16-step melody from the track seed. */
  function buildPattern(seed: number) {
    const rnd = mulberry(seed)
    const p: number[] = []
    let deg = 4
    for (let i = 0; i < 16; i++) {
      const r = rnd()
      if (i % 4 === 0 || r > 0.36) {
        deg = Math.max(0, Math.min(SCALE.length - 1, deg + Math.round((rnd() - 0.5) * 4)))
        p.push(deg)
      } else {
        p.push(-1)
      }
    }
    melody = p
  }

  function pluck(freq: number, t: number, vel: number, decay: number, type: OscillatorType) {
    if (!ctx || !master) return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(vel, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    osc.connect(g)
    g.connect(master)
    osc.start(t)
    osc.stop(t + decay + 0.05)
  }

  function scheduleStep(s: number, time: number) {
    const { root } = opts
    // low sine bass at the top and middle of the bar
    if (s === 0 || s === 8) {
      pluck(midiToFreq(root - 12), time, 0.34, 1.1, 'sine')
    }
    // melody pluck, an octave up, triangle for a mallet feel
    const deg = melody[s]
    if (deg >= 0 && deg < SCALE.length) {
      pluck(midiToFreq(root + SCALE[deg] + 12), time, 0.2, 0.55, 'triangle')
    }
    // soft off-beat shimmer
    if (s % 2 === 1) {
      pluck(midiToFreq(root + 24), time, 0.045, 0.08, 'sine')
    }
  }

  function schedule() {
    if (!ctx || ctx.state !== 'running') return
    const ahead = ctx.currentTime + 0.7
    const stepDur = 60 / opts.bpm / 2 // eighth notes
    let guard = 0
    while (nextTime < ahead && guard < 64) {
      scheduleStep(step, nextTime)
      nextTime += stepDur
      step = (step + 1) % 16
      guard++
    }
  }

  return {
    start(next: EngineOpts) {
      if (!ensureCtx() || !ctx) return
      opts = next
      buildPattern(next.seed)
      if (tone) tone.frequency.value = 1800 + (next.seed % 1400)
      step = 0
      nextTime = ctx.currentTime + 0.08
      void ctx.resume().catch(() => undefined)
      if (timer !== null) window.clearInterval(timer)
      timer = window.setInterval(schedule, 170)
    },
    stop() {
      if (timer !== null) {
        window.clearInterval(timer)
        timer = null
      }
      if (ctx && ctx.state === 'running') {
        void ctx.suspend().catch(() => undefined)
      }
    },
    setVolume(v: number) {
      volume = Math.max(0, Math.min(1, v))
      volumeRamp()
    },
  }
}
