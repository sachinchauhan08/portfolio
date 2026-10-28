'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  SiAngular,
  SiDocker,
  SiDotnet,
  SiDrizzle,
  SiExpress,
  SiFastapi,
  SiGit,
  SiGithub,
  SiGithubcopilot,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedis,
  SiSwagger,
  SiTailwindcss,
  SiTypescript,
  SiVscodium,
} from 'react-icons/si'
import {
  FiCloud,
  FiCode,
  FiCommand,
  FiDatabase,
  FiLayers,
  FiLayout,
  FiLock,
  FiShield,
  FiZap,
} from 'react-icons/fi'
import profile from '@/lib/profile'
import styles from '@/styles/sections/HeroSection.module.css'

const TECHNOLOGY_ICONS = {
  'React.js': SiReact,
  'React Native': SiReact,
  'Next.js': SiNextdotjs,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  Angular: SiAngular,
  HTML5: SiHtml5,
  CSS3: FiCode,
  'Responsive UI': FiLayout,
  RxJS: FiZap,
  'Tailwind CSS': SiTailwindcss,
  'Node.js': SiNodedotjs,
  Python: SiPython,
  NestJS: SiNestjs,
  'Express.js': SiExpress,
  FastAPI: SiFastapi,
  'REST APIs': FiCode,
  'JWT Authentication': FiLock,
  'Role-Based Access Control': FiShield,
  'Middleware & Guards': FiLayers,
  Swagger: SiSwagger,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  'Redis Caching': SiRedis,
  Redis: SiRedis,
  'SQL Server': FiDatabase,
  'Entity Framework Core': SiDotnet,
  Dapper: FiDatabase,
  'Drizzle ORM': SiDrizzle,
  Git: SiGit,
  GitHub: SiGithub,
  Postman: SiPostman,
  'VS Code': SiVscodium,
  Cursor: FiCommand,
  'GitHub Copilot': SiGithubcopilot,
  Docker: SiDocker,
  AWS: FiCloud,
}

const SKILL_ENTRIES = [
  ...profile.skillGroups.flatMap((group) =>
    group.skills.map((name) => ({
      name,
      category: group.category.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-'),
    }))
  ),
  ...profile.skills.map((name) => ({ name, category: 'core-stack' })),
  { name: 'Python', category: 'core-stack' },
]

const TECHNOLOGIES = SKILL_ENTRIES
  .filter((technology, index, list) => (
    list.findIndex((item) => item.name.toLowerCase().replace(/ caching$/, '') === technology.name.toLowerCase().replace(/ caching$/, '')) === index
  ))
  .map(({ name, category }) => ({
    name,
    category,
    Icon: TECHNOLOGY_ICONS[name] || FiCode,
  }))

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const ANCHORS = TECHNOLOGIES.map((_, index) => {
  const y = 1 - ((index + 0.5) / TECHNOLOGIES.length) * 2
  const radius = Math.sqrt(1 - y * y)
  const angle = GOLDEN_ANGLE * index
  return [Math.cos(angle) * radius, y, Math.sin(angle) * radius]
})

export default function HeroVisual() {
  const mountRef = useRef(null)
  const iconRefs = useRef([])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const anchors = ANCHORS.map((point) => (
      new THREE.Vector3(...point).multiplyScalar(2.48)
    ))
    const worldPosition = new THREE.Vector3()

    // Check WebGL availability
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return
    }

    let W = mount.clientWidth || 500
    let H = mount.clientHeight || 500

    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2))
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.z = 7.2

    // Check current theme
    function getTheme() {
      if (typeof document !== 'undefined') {
        return document.documentElement.getAttribute('data-theme') || 'dark'
      }
      return 'dark'
    }

    let isDark = getTheme() === 'dark'

    // Theme color definitions
    const colors = {
      dark: {
        wireframe: new THREE.Color('#818cf8'),
        inner: new THREE.Color('#4f46e5'),
        nodes: new THREE.Color('#22d3ee'),
        particles: new THREE.Color('#c084fc'),
        coreGlow: new THREE.Color('#38bdf8'),
      },
      light: {
        wireframe: new THREE.Color('#4f46e5'),
        inner: new THREE.Color('#2563eb'),
        nodes: new THREE.Color('#0284c7'),
        particles: new THREE.Color('#7c3aed'),
        coreGlow: new THREE.Color('#6366f1'),
      },
    }

    // ── Outer Sculptural Lattice (Icosahedron Wireframe) ──
    const outerGeo = new THREE.IcosahedronGeometry(2.35, 1)
    const wireMat = new THREE.MeshBasicMaterial({
      color: isDark ? colors.dark.wireframe : colors.light.wireframe,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45,
    })
    const outerMesh = new THREE.Mesh(outerGeo, wireMat)
    scene.add(outerMesh)

    // ── Node Vertices on Outer Lattice ──
    const posAttr = outerGeo.getAttribute('position')
    const nodeCount = posAttr.count
    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', posAttr)

    const nodeMat = new THREE.PointsMaterial({
      color: isDark ? colors.dark.nodes : colors.light.nodes,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
    })
    const nodePoints = new THREE.Points(nodeGeo, nodeMat)
    outerMesh.add(nodePoints)

    // ── Inner Faceted Sculptural Core (Octahedron) ──
    const innerGeo = new THREE.OctahedronGeometry(1.3, 0)
    const innerMat = new THREE.MeshStandardMaterial({
      color: isDark ? colors.dark.inner : colors.light.inner,
      roughness: 0.25,
      metalness: 0.85,
      transparent: true,
      opacity: isDark ? 0.82 : 0.75,
      flatShading: true,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    scene.add(innerMesh)

    // ── Concentric Inner Wireframe Core ──
    const innerWireGeo = new THREE.OctahedronGeometry(1.32, 0)
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: isDark ? colors.dark.coreGlow : colors.light.coreGlow,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    })
    const innerWireMesh = new THREE.Mesh(innerWireGeo, innerWireMat)
    innerMesh.add(innerWireMesh)

    // ── Orbital Particle Ring / Halo ──
    const P_COUNT = 90
    const pPositions = new Float32Array(P_COUNT * 3)
    for (let i = 0; i < P_COUNT; i++) {
      const angle = (i / P_COUNT) * Math.PI * 2
      const radius = 3.1 + (Math.random() - 0.5) * 0.7
      pPositions[i * 3] = Math.cos(angle) * radius
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.2
      pPositions[i * 3 + 2] = Math.sin(angle) * radius
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? colors.dark.particles : colors.light.particles,
      size: 0.055,
      transparent: true,
      opacity: 0.65,
    })
    const particleHalo = new THREE.Points(particleGeo, particleMat)
    scene.add(particleHalo)

    // ── Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.4 : 2.0)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x818cf8, isDark ? 3.5 : 2.8, 20)
    pointLight1.position.set(4, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x06b6d4, isDark ? 2.5 : 2.2, 20)
    pointLight2.position.set(-4, -3, 3)
    scene.add(pointLight2)

    // ── Pointer Interaction & Smooth Damping ──
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    function onMouseMove(e) {
      const rect = mount.getBoundingClientRect()
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const hostSection = mount.closest('section') || window
    hostSection.addEventListener('mousemove', onMouseMove)

    // ── Listen for Theme Change ──
    function onThemeChange(e) {
      const resolved = e?.detail?.resolvedTheme || getTheme()
      isDark = resolved === 'dark'
      const cur = isDark ? colors.dark : colors.light
      wireMat.color.copy(cur.wireframe)
      wireMat.opacity = isDark ? 0.35 : 0.45
      nodeMat.color.copy(cur.nodes)
      innerMat.color.copy(cur.inner)
      innerWireMat.color.copy(cur.coreGlow)
      particleMat.color.copy(cur.particles)
      ambientLight.intensity = isDark ? 1.4 : 2.0
    }
    window.addEventListener('theme-changed', onThemeChange)

    // ── Visibility Tracking (Pause RAF when off-screen) ──
    let isVisible = true
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    }, { threshold: 0.1 })
    observer.observe(mount)

    // ── Animation Loop ──
    let rafId
    let clock = new THREE.Clock()
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function animate() {
      rafId = requestAnimationFrame(animate)

      if (!isVisible) return

      const dt = clock.getDelta()

      if (!prefersReducedMotion) {
        // Interpolate mouse coordinates
        mouse.x += (mouse.targetX - mouse.x) * 0.045
        mouse.y += (mouse.targetY - mouse.y) * 0.045

        // Outer rotation
        outerMesh.rotation.y += 0.12 * dt + mouse.x * 0.008
        outerMesh.rotation.x += 0.07 * dt + mouse.y * 0.008

        // Inner core counter-rotation
        innerMesh.rotation.y -= 0.22 * dt
        innerMesh.rotation.z += 0.1 * dt

        // Orbital particle halo spin and tilt
        particleHalo.rotation.y += 0.06 * dt
        particleHalo.rotation.x = Math.sin(clock.getElapsedTime() * 0.25) * 0.16 + mouse.y * 0.04
        particleHalo.rotation.z = mouse.x * 0.06
      }

      outerMesh.updateMatrixWorld(true)
      anchors.forEach((anchor, index) => {
        const icon = iconRefs.current[index]
        if (!icon) return

        worldPosition.copy(anchor)
        outerMesh.localToWorld(worldPosition)
        const facing = worldPosition.z / 2.48
        worldPosition.project(camera)

        const x = ((worldPosition.x + 1) / 2) * W
        const y = ((1 - worldPosition.y) / 2) * H
        const inFront = facing > 0.02
        icon.style.left = `${x}px`
        icon.style.top = `${y}px`
        icon.style.opacity = inFront ? String(Math.min(1, 0.55 + facing * 0.45)) : '0'
        icon.style.zIndex = String(Math.round((facing + 1) * 10))
        icon.style.transform = `translate(-50%, -50%) scale(${inFront ? 0.82 + facing * 0.12 : 0.7})`
      })

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize Observer ──
    const ro = new ResizeObserver(() => {
      W = mount.clientWidth || 500
      H = mount.clientHeight || 500
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    })
    ro.observe(mount)

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      observer.disconnect()
      hostSection.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('theme-changed', onThemeChange)

      outerGeo.dispose()
      wireMat.dispose()
      nodeGeo.dispose()
      nodeMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      innerWireGeo.dispose()
      innerWireMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={styles.visualCanvas}
      aria-hidden="true"
    >
      {TECHNOLOGIES.map(({ name, category, Icon }, index) => (
        <span
          key={name}
          ref={(element) => { iconRefs.current[index] = element }}
          className={styles.techIcon}
          data-category={category}
          title={name}
        >
          <Icon size={20} />
        </span>
      ))}
    </div>
  )
}
