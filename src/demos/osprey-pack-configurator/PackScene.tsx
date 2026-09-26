import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'

/**
 * PackScene — an imperative three.js stage wrapped in React.
 * The pack is built entirely from primitives (capsules, tori, boxes),
 * flat-shaded for a stylised low-poly look. All state changes (colours,
 * fabric sheen, model scale, exploded view) are damped toward targets
 * in the render loop, so nothing snaps.
 */

export interface SceneColours {
  body: string
  pocket: string
  trim: string
}

export interface SceneConfig {
  scaleY: number
  scaleXZ: number
  torso: number
  exploded: boolean
  colours: SceneColours
  roughness: number
}

export interface SceneHandle {
  rotate: (delta: number) => void
  toggleExploded?: never
}

interface Part {
  obj: THREE.Object3D
  base: THREE.Vector3
  off: THREE.Vector3
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export default function PackScene({
  config,
  handleRef,
}: {
  config: SceneConfig
  handleRef: MutableRefObject<SceneHandle | null>
}) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const live = useRef(config)
  live.current = config

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    mount.appendChild(renderer.domElement)
    const canvas = renderer.domElement

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x141816, 9.5, 16)

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60)
    camera.position.set(0.4, 0.55, 7.6)
    camera.lookAt(0, 0.05, 0)

    // ——— lights: dusk on a ridgeline ———
    scene.add(new THREE.HemisphereLight(0xdde4d2, 0x12160f, 0.95))
    const key = new THREE.DirectionalLight(0xfff0d8, 1.7)
    key.position.set(4, 6, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xff7433, 0.9)
    rim.position.set(-5.5, 2.5, -4.5)
    scene.add(rim)
    const fill = new THREE.DirectionalLight(0x9db8a0, 0.5)
    fill.position.set(-2, -1, 5)
    scene.add(fill)

    // ——— materials ———
    const std = (extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ flatShading: true, ...extra })
    const bodyMat = std({ color: live.current.colours.body, roughness: live.current.roughness })
    const pocketMat = std({ color: live.current.colours.pocket, roughness: live.current.roughness })
    const trimMat = std({ color: live.current.colours.trim, roughness: 0.72 })
    const darkMat = std({ color: '#232726', roughness: 0.8 })
    const metalMat = std({ color: '#b3945a', metalness: 0.65, roughness: 0.35, flatShading: false })
    const shadowMat = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.3 })
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#e4561e',
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    })

    const geos: THREE.BufferGeometry[] = []
    const mats: THREE.Material[] = [bodyMat, pocketMat, trimMat, darkMat, metalMat, shadowMat, ringMat]
    const geo = <T extends THREE.BufferGeometry>(g: T): T => {
      geos.push(g)
      return g
    }

    const root = new THREE.Group()
    root.scale.set(live.current.scaleXZ, live.current.scaleY * live.current.torso, live.current.scaleXZ)
    scene.add(root)

    const parts: Part[] = []
    const part = (obj: THREE.Object3D, base: [number, number, number], off: [number, number, number]) => {
      obj.position.set(base[0], base[1], base[2])
      parts.push({ obj, base: new THREE.Vector3(...base), off: new THREE.Vector3(...off) })
      root.add(obj)
      return obj
    }

    // main body — squashed capsule, height ≈ 3.1 units before scaling
    const body = part(
      new THREE.Mesh(geo(new THREE.CapsuleGeometry(1, 1.1, 5, 12)), bodyMat),
      [0, 0, 0],
      [0, 0, 0]
    )
    body.scale.set(1, 1, 0.62)

    // reinforced base panel
    const basePanel = part(
      new THREE.Mesh(geo(new THREE.CylinderGeometry(0.92, 1.0, 0.42, 12)), darkMat),
      [0, -1.3, 0],
      [0, -0.85, 0]
    )
    basePanel.scale.set(1, 1, 0.66)

    // brain lid + its pocket
    const lid = part(
      new THREE.Mesh(geo(new THREE.CapsuleGeometry(1.04, 0.28, 5, 12)), bodyMat),
      [0, 1.62, 0],
      [0, 1.35, 0]
    )
    lid.scale.set(1, 0.82, 0.68)
    const lidPocket = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.42, 0.3, 4, 10)), pocketMat)
    lidPocket.rotation.z = Math.PI / 2
    lidPocket.position.set(0, 0.34, 0)
    lidPocket.scale.set(1, 1, 0.5)
    lid.add(lidPocket)
    const lidZip = new THREE.Mesh(geo(new THREE.TorusGeometry(0.5, 0.022, 6, 14, Math.PI)), metalMat)
    lidZip.position.set(0, 0.42, 0.1)
    lidZip.scale.set(1, 1, 0.4)
    lid.add(lidZip)

    // front shove-it pocket (zip and pull are children, so they explode together)
    const frontPocket = part(
      new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.68, 0.5, 5, 12)), pocketMat),
      [0, -0.15, 0.64],
      [0, 0, 1.5]
    )
    frontPocket.scale.set(1, 1, 0.34)
    const pocketZip = new THREE.Mesh(geo(new THREE.TorusGeometry(0.62, 0.025, 6, 16, Math.PI)), darkMat)
    pocketZip.position.set(0, 0.42, 0.05)
    pocketZip.scale.set(1, 1, 0.4)
    frontPocket.add(pocketZip)
    const pull = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.03, 0.03, 0.16, 6)), metalMat)
    pull.position.set(0.6, 0.34, 0.14)
    pull.rotation.z = 0.5
    frontPocket.add(pull)

    // bottle pockets
    for (const side of [-1, 1]) {
      const sp = part(
        new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.3, 0.34, 4, 9)), pocketMat),
        [side * 1.0, -0.62, 0.08],
        [side * 1.2, 0, 0]
      )
      sp.scale.set(1, 1, 0.85)
    }

    // shoulder straps + buckles
    for (const side of [-1, 1]) {
      const strap = part(
        new THREE.Mesh(geo(new THREE.TorusGeometry(0.52, 0.13, 7, 14, Math.PI * 0.9)), trimMat),
        [side * 0.44, 0.5, -0.58],
        [side * 0.25, 0, -1.35]
      )
      strap.rotation.y = Math.PI / 2
      strap.rotation.x = -0.15
      const buckle = new THREE.Mesh(geo(new THREE.BoxGeometry(0.16, 0.22, 0.08)), metalMat)
      buckle.position.set(0.1, -0.5, 0.05)
      strap.add(buckle)
    }

    // hip belt
    const hipBelt = part(
      new THREE.Mesh(geo(new THREE.TorusGeometry(0.98, 0.16, 7, 18, Math.PI * 1.25)), trimMat),
      [0, -1.02, -0.18],
      [0, -1.35, 0]
    )
    hipBelt.rotation.set(Math.PI / 2 - 0.22, 0, Math.PI * 0.86)

    // grab handle
    const handle = part(
      new THREE.Mesh(geo(new THREE.TorusGeometry(0.2, 0.05, 6, 12, Math.PI)), trimMat),
      [0, 1.56, -0.48],
      [0, 0.3, -1.1]
    )
    handle.rotation.x = 0.25

    // daisy chains (two columns of webbing loops down the face)
    const daisies = new THREE.Group()
    for (const side of [-1, 1]) {
      for (let i = 0; i < 5; i++) {
        const loop = new THREE.Mesh(geo(new THREE.BoxGeometry(0.17, 0.26, 0.06)), trimMat)
        loop.position.set(side * 0.46, -0.78 + i * 0.4, 0.56)
        loop.rotation.x = -0.12
        daisies.add(loop)
      }
    }
    part(daisies, [0, 0, 0], [0, 0, 0.85])

    // side compression straps (stay with the body)
    for (const side of [-1, 1]) {
      for (const y of [0.42, -0.52]) {
        const strap = new THREE.Mesh(geo(new THREE.BoxGeometry(0.14, 0.1, 1.35)), trimMat)
        strap.position.set(side * 0.98, y, 0)
        strap.rotation.y = side * 0.06
        body.add(strap)
        const buckle = new THREE.Mesh(geo(new THREE.BoxGeometry(0.16, 0.16, 0.1)), darkMat)
        buckle.position.set(0, 0, 0.68)
        strap.add(buckle)
      }
    }

    // ground: soft shadow blob + a blaze trail-marker ring
    const shadow = new THREE.Mesh(geo(new THREE.CircleGeometry(1.75, 36)), shadowMat)
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -1.95
    root.add(shadow)
    const ring = new THREE.Mesh(geo(new THREE.RingGeometry(2.05, 2.12, 56)), ringMat)
    ring.rotation.x = -Math.PI / 2
    ring.position.y = -1.95
    root.add(ring)

    // ——— interaction & animation state ———
    let rotY = -0.6
    let rotX = 0.1
    let targetRotY = -0.6
    let targetRotX = 0.1
    let explodedT = live.current.exploded ? 1 : 0
    let dragging = false
    let lastX = 0
    let lastY = 0
    let lastInteract = performance.now()

    handleRef.current = {
      rotate: (delta: number) => {
        targetRotY += delta
        lastInteract = performance.now()
      },
    }

    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      lastInteract = performance.now()
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      targetRotY += (e.clientX - lastX) * 0.0085
      targetRotX = clamp(targetRotX + (e.clientY - lastY) * 0.004, -0.3, 0.4)
      lastX = e.clientX
      lastY = e.clientY
      lastInteract = performance.now()
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      lastInteract = performance.now()
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const tmpColour = new THREE.Color()
    const bodyTarget = new THREE.Color()
    const pocketTarget = new THREE.Color()
    const trimTarget = new THREE.Color()
    const targetScale = new THREE.Vector3()

    let raf = 0
    let prev = performance.now()

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      const c = live.current
      const k = Math.min(1, dt * 6)

      if (!dragging && now - lastInteract > 2000) targetRotY += dt * 0.32
      rotY += (targetRotY - rotY) * k
      rotX += (targetRotX - rotX) * k
      root.rotation.y = rotY
      root.rotation.x = rotX

      explodedT += ((c.exploded ? 1 : 0) - explodedT) * Math.min(1, dt * 5)
      for (const p of parts) {
        p.obj.position.copy(p.base).addScaledVector(p.off, explodedT)
      }

      targetScale.set(c.scaleXZ, c.scaleY * c.torso, c.scaleXZ)
      root.scale.lerp(targetScale, Math.min(1, dt * 4))

      bodyTarget.set(c.colours.body)
      pocketTarget.set(c.colours.pocket)
      trimTarget.set(c.colours.trim)
      bodyMat.color.lerp(bodyTarget, k)
      pocketMat.color.lerp(pocketTarget, k)
      trimMat.color.lerp(trimTarget, k)
      bodyMat.roughness += (c.roughness - bodyMat.roughness) * k
      pocketMat.roughness = bodyMat.roughness

      // shadow tightens slightly when exploded
      shadowMat.opacity = 0.3 - explodedT * 0.12
      ringMat.opacity = 0.4 + Math.sin(now * 0.0012) * 0.08

      tmpColour.copy(bodyMat.color)
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      handleRef.current = null
      for (const g of geos) g.dispose()
      for (const m of mats) m.dispose()
      renderer.dispose()
      if (canvas.parentNode === mount) mount.removeChild(canvas)
    }
  }, [handleRef])

  return <div ref={mountRef} className="opc-canvas" aria-hidden="true" />
}
