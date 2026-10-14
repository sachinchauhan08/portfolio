'use client'

import { useEffect, useRef, useState, Fragment } from 'react'
import Image from 'next/image'
import * as THREE from 'three'
import { gsap } from '@/lib/gsap'
import {
  FaGithub, FaLinkedinIn, FaEnvelope, FaCopy, FaCheck,
} from 'react-icons/fa'
import { FiArrowUpRight, FiChevronDown } from 'react-icons/fi'
import profile from '@/data/profile.json'
import content from '@/data/content.json'
import styles from '@/styles/sections/PublicationsFooterSection.module.css'

const SOCIAL_ICONS = {
  GitHub:   <FaGithub size={14} />,
  LinkedIn: <FaLinkedinIn size={14} />,
}

const VID_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const VID_FRAG = `
  uniform sampler2D uVideo;
  uniform float uOpacity;
  uniform float uVideoAspect;
  uniform float uCanvasAspect;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    if (uCanvasAspect > uVideoAspect) {
      float s = uVideoAspect / uCanvasAspect;
      uv.y = (vUv.y - 0.5) * s + 0.5;
    } else {
      float s = uCanvasAspect / uVideoAspect;
      uv.x = (vUv.x - 0.5) * s + 0.5;
    }
    vec4 tex = texture2D(uVideo, uv);
    float fadeY =
      smoothstep(0.0, 0.05, uv.y) *
      smoothstep(1.0, 0.95, uv.y);
    float alpha = fadeY * uOpacity;
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 col = mix(vec3(lum), tex.rgb, 0.72);
    float vx = smoothstep(0.0, 0.38, abs(uv.x - 0.5) * 2.0);
    vec3 dark = vec3(0.008, 0.008, 0.008);
    col = mix(col, dark, vx * 0.82);
    col *= 0.68;
    gl_FragColor = vec4(col, alpha);
  }
`

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function PublicationsFooterSection() {
  const wrapperRef       = useRef(null)
  const stickyRef        = useRef(null)
  const canvasRef        = useRef(null)
  const videoSrcRef      = useRef(null)
  const contactSuiteRef  = useRef(null)
  const footerContentRef = useRef(null)
  const leftRef          = useRef(null)
  const rightRef         = useRef(null)
  const bigNameRef       = useRef(null)
  const bottomBarRef     = useRef(null)

  const [copied, setCopied] = useState(false)

  function handleCopyEmail() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    }
  }

  useEffect(() => {
    const wrapper       = wrapperRef.current
    const sticky        = stickyRef.current
    const canvas        = canvasRef.current
    const videoEl       = videoSrcRef.current
    const scroller      = document.querySelector('main')
    if (!wrapper || !sticky || !scroller) return

    const isMobile = window.innerWidth < 768

    let renderer, vidUni, rafId, videoPlaying = false
    let onMouseMove = () => {}, onResize = () => {}

    if (!isMobile && canvas && videoEl) {
      // ── Three.js WebGL video setup ─────────────────────────
      const W = sticky.offsetWidth
      const H = sticky.offsetHeight

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W, H)
      renderer.setClearColor(0x000000, 0)

      const scene  = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 100)
      camera.position.z = 10

      videoEl.src         = '/assets/footer-video.mp4'
      videoEl.muted       = true
      videoEl.playsInline = true
      videoEl.loop        = true
      videoEl.preload     = 'auto'

      const vidTex = new THREE.VideoTexture(videoEl)
      vidTex.minFilter = THREE.LinearFilter
      vidTex.magFilter = THREE.LinearFilter

      vidUni = {
        uVideo:       { value: vidTex },
        uOpacity:     { value: 0 },
        uVideoAspect: { value: 16 / 9 },
        uCanvasAspect: { value: W / H },
      }

      videoEl.addEventListener('loadedmetadata', () => {
        if (videoEl.videoWidth && videoEl.videoHeight) {
          vidUni.uVideoAspect.value = videoEl.videoWidth / videoEl.videoHeight
        }
      }, { once: true })

      const vidMat = new THREE.ShaderMaterial({
        uniforms: vidUni,
        vertexShader: VID_VERT,
        fragmentShader: VID_FRAG,
        transparent: true,
      })

      const vidMesh = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.08, H * 1.08), vidMat)
      vidMesh.position.z = 1
      scene.add(vidMesh)

      const mx = { tx: 0, ty: 0, x: 0, y: 0 }
      onMouseMove = function(e) {
        const r = sticky.getBoundingClientRect()
        mx.tx = (e.clientX - r.left) / r.width  - 0.5
        mx.ty = (e.clientY - r.top)  / r.height - 0.5
      }
      sticky.addEventListener('mousemove', onMouseMove)

      onResize = function() {
        const w = sticky.offsetWidth
        const h = sticky.offsetHeight
        renderer.setSize(w, h)
        camera.left   = -w / 2; camera.right  = w / 2
        camera.top    =  h / 2; camera.bottom = -h / 2
        camera.updateProjectionMatrix()
        vidUni.uCanvasAspect.value = w / h
      }
      window.addEventListener('resize', onResize)

      function tick() {
        rafId = requestAnimationFrame(tick)
        mx.x += (mx.tx - mx.x) * 0.04
        mx.y += (mx.ty - mx.y) * 0.04
        vidMesh.position.x = mx.x * 14
        vidMesh.position.y = mx.y * -8
        vidTex.needsUpdate = true
        renderer.render(scene, camera)
      }
      tick()
    }

    // ── Scroll-driven animation between Contact (Phase 1) & Footer (Phase 2) ──
    function onScroll() {
      const vh   = window.innerHeight
      const dist = -wrapper.getBoundingClientRect().top
      // 200vh total wrapper height -> 1 viewport (vh) of travel between steps
      const p = Math.max(0, Math.min(1, dist / vh))

      // Phase 1: Contact suite fades out as user scrolls toward footer
      const contactFade = 1 - Math.max(0, Math.min(1, p / 0.48))
      if (contactSuiteRef.current) {
        gsap.set(contactSuiteRef.current, {
          opacity: contactFade,
          y: -p * 40,
          pointerEvents: contactFade > 0.05 ? 'auto' : 'none',
        })
      }

      // Three.js video background crossfade
      if (!isMobile && vidUni) {
        const xfadeRaw = Math.max(0, Math.min(1, (p - 0.35) / 0.55))
        const xfade    = 0.5 - 0.5 * Math.cos(Math.PI * xfadeRaw)
        vidUni.uOpacity.value = xfade

        if (xfade > 0.04 && !videoPlaying) {
          videoPlaying = true
          videoEl.play().catch(() => {})
        } else if (xfade <= 0.04 && videoPlaying) {
          videoPlaying = false
          videoEl.pause()
          videoEl.currentTime = 0
        }
      }

      // Phase 2: Footer content fades in
      const footerFade = Math.max(0, Math.min(1, (p - 0.52) / 0.48))
      if (footerContentRef.current) {
        gsap.set(footerContentRef.current, {
          opacity: footerFade,
          y: (1 - footerFade) * 30,
          pointerEvents: footerFade > 0.05 ? 'auto' : 'none',
        })
      }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      scroller.removeEventListener('scroll', onScroll)
      sticky.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (renderer) renderer.dispose()
    }
  }, [])

  const year = new Date().getFullYear()

  return (
    <div ref={wrapperRef} className={styles.wrapper} id="contact">
      <div ref={stickyRef} className={styles.sticky}>

        {/* ── Video canvas (desktop WebGL background) ── */}
        <canvas ref={canvasRef} className={styles.glCanvas} />
        <video ref={videoSrcRef} className={styles.hiddenVideo} />

        {/* ── Mobile background image (mobile only) ── */}
        <div className={styles.mobileFooterBg}>
          <Image
            src="/assets/footer-mobile.webp"
            alt=""
            fill
            quality={100}
            className={styles.mobileFooterBgImg}
            sizes="100vw"
            priority={false}
          />
        </div>

        <div className={styles.mobileDarkOverlay} aria-hidden />

        {/* ── Ambient Radial Vignette ── */}
        <div className={styles.vignetteOverlay} aria-hidden />

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* PHASE 1: Interactive Contact & Collaboration Suite           */}
        {/* ═════════════════════════════════════════════════════════════ */}
        <div ref={contactSuiteRef} className={styles.contactSuite}>
          <div className={styles.contactHeader}>
            <span className={styles.contactEyebrow}>{content.contact.eyebrow}</span>
            <h2 className={styles.contactTitle}>
              {content.contact.headingLine1} <br />
              <span className={styles.contactTitleAccent}>{content.contact.headingLine2}</span>
            </h2>
            <p className={styles.contactSubtitle}>
              {content.contact.supportingText}
            </p>
          </div>

          <div className={styles.contactCard}>
            {/* Live Availability Badge */}
            <div className={styles.contactBadge}>
              <span className={styles.availPulse} />
              <span>Available for worldwide projects</span>
            </div>

            {/* Email Action Block */}
            <div className={styles.emailBlock}>
              <div className={styles.emailTextWrap}>
                <span className={styles.emailLabel}>Direct Email</span>
                <span className={styles.emailAddress}>{profile.email}</span>
              </div>
              <div className={styles.emailActions}>
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <FaCheck className="text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaCopy />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${profile.email}`}
                  className={styles.sendEmailBtn}
                >
                  <span>Send Email</span>
                  <FiArrowUpRight />
                </a>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className={styles.contactMetrics}>
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>India</span>
                <span className={styles.metricLabel}>Location</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>Worldwide</span>
                <span className={styles.metricLabel}>Availability</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>React · Next.js · Full Stack</span>
                <span className={styles.metricLabel}>Core Specialization</span>
              </div>
            </div>

            {/* Social Pills */}
            <div className={styles.socialPillsRow}>
              {profile.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialPill}
                >
                  {SOCIAL_ICONS[s.label] || <FaGithub size={14} />}
                  <span>{s.label}</span>
                  <FiArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.scrollDownHint}>
            <span>Scroll down for footer</span>
            <FiChevronDown />
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* PHASE 2: Cinematic Signature Footer                          */}
        {/* ═════════════════════════════════════════════════════════════ */}
        <div ref={footerContentRef} className={styles.footerContent}>
          {/* Mobile Layout */}
          <div className={styles.mobileLayout}>
            <div className={styles.mobileBrand}>
              <span className={styles.mobileRoleDot} />
              <span className={styles.mobileRoleText}>{profile.roles.short.toUpperCase()}</span>
            </div>
            <h2 className={styles.mobileName}>
              {profile.name.first.toUpperCase()}
              <br />
              <span className={styles.mobileNameGhost}>{profile.name.last.toUpperCase()}</span>
            </h2>
            <p className={styles.mobileDesc}>{profile.description}</p>
            <div className={styles.mobileCtas}>
              <a href={`mailto:${profile.email}`} className={styles.mobileTalkBtn}>
                Let&apos;s talk <FiArrowUpRight />
              </a>
            </div>
            <div className={styles.mobileSocialRow}>
              {profile.socials.map((s, i) => (
                <Fragment key={s.label}>
                  {i > 0 && <div className={styles.mobileSocialDivider} aria-hidden />}
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mobileSocialLink}
                    aria-label={s.label}
                  >
                    <span>{s.label.toUpperCase()}</span>
                  </a>
                </Fragment>
              ))}
            </div>
          </div>

          {/* Desktop Main Grid */}
          <div className={styles.mainGrid}>
            <div ref={leftRef} className={styles.leftCol}>
              <div className={styles.identityBlock}>
                <p className={styles.greetLine}>
                  <span className={styles.greetDot} />
                  {getGreeting()}
                </p>
                <p className={styles.roleLabel}>{profile.roles.short}</p>
                <h2 className={styles.nameHeading}>
                  {profile.name.first}
                  <br />
                  <span className={styles.nameGhost}>{profile.name.last}</span>
                </h2>
              </div>

              <div className={styles.footerInfo}>
                <p className={styles.footerDescription}>{profile.description}</p>
                <div className={styles.footerLinks}>
                  {profile.socials.map((s, i) => (
                    <span key={s.label} className={styles.footerLinkWrap}>
                      {i > 0 && <span className={styles.footerPipe}>|</span>}
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.footerLink}
                      >
                        {SOCIAL_ICONS[s.label] && (
                          <span className={styles.socialIcon}>{SOCIAL_ICONS[s.label]}</span>
                        )}
                        {s.label}
                      </a>
                    </span>
                  ))}
                </div>
                <a href={`mailto:${profile.email}`} className={styles.footerMail}>
                  <FaEnvelope size={13} className="text-indigo-400" />
                  {profile.email}
                </a>
              </div>
            </div>

            <div className={styles.centerSpace} />

            <div ref={rightRef} className={styles.rightCol}>
              <div className={styles.ctaBlock}>
                <p className={styles.ctaEyebrow}>{content.footer.eyebrow}</p>
                <p className={styles.ctaHeading}>
                  {content.footer.ctaLines.map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                  <span className={styles.ctaAccent}>{content.footer.ctaAccent}</span>
                </p>
                <a href={`mailto:${profile.email}`} className={styles.talkBtn}>
                  Let&apos;s talk →
                </a>
              </div>
            </div>
          </div>

          {/* Large Watermark Signature */}
          <div ref={bigNameRef} className={styles.signatureWrap}>
            <h2 className={styles.signatureText}>{profile.name.full.toUpperCase()}</h2>
          </div>

          {/* Bottom Bar */}
          <div ref={bottomBarRef} className={styles.bottomBar}>
            <div className={styles.bottomLeft}>
              <div className={styles.monogram}>
                <span className={styles.monoLetters}>{profile.monogram || 'SC'}</span>
                <span className={styles.monoDot} />
              </div>
              <span className={styles.leftDivider} />
              <div className={styles.copyBlock}>
                <p className={styles.copy}>© {year} {profile.name.full.toUpperCase()}</p>
                <p className={styles.copyAll}>ALL RIGHTS RESERVED</p>
              </div>
            </div>
            <div className={styles.bottomRight}>
              <span className={styles.builtWith}>
                DESIGNED &amp; DEVELOPED
                <br />
                WITH PRECISION.
              </span>
              <span className={styles.barDivider} />
              <span className={styles.sunIcon}>✺</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
