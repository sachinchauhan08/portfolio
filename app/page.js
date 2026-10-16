'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import Navbar                from '@/components/ui/Navbar'
import VideoIntro            from '@/components/sections/VideoIntro'
import HeroSection           from '@/components/sections/HeroSection'
import AboutSection          from '@/components/sections/AboutSection'
import SkillsSection         from '@/components/sections/SkillsSection'
import ProjectsSection       from '@/components/sections/ProjectsSection'
import WorkExperienceSection from '@/components/sections/WorkExperienceSection'
import ContactSection        from '@/components/sections/ContactSection'
import profile               from '@/data/profile.json'

// Snap: 0=video 1=hero 2=about 3=skills 4=projects 5=work-exp 6=contact
// Projects render as a single card-grid viewport (no per-project scroll slides).
const PROJECT_SLIDES = 1
const TOTAL          = 6 + PROJECT_SLIDES // = 7 real sections → indices 0..6

export default function Home() {
  const mainRef        = useRef(null)
  const idxRef         = useRef(0)
  const busyRef        = useRef(false)
  const tweenRef       = useRef(null)
  const loopOverlayRef = useRef(null)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    // ── Measure each section's real pixel offset within the scroller ──────
    // Below 1024px every section becomes `position: relative; height: auto;
    // min-height: 100svh`, so sections are NOT uniformly one viewport tall.
    // The old `idx * window.innerHeight` math overshot (tapping "About"
    // landed on "Skills"). Measuring the live layout keeps navigation exact
    // on mobile while behaving identically to before on desktop, where each
    // section is exactly 100vh tall.
    const sections = Array.from(el.querySelectorAll('section'))
    const offsetsRef = { current: [] }

    function measure() {
      const base = el.getBoundingClientRect().top
      offsetsRef.current = sections.map(
        (s) => s.getBoundingClientRect().top - base + el.scrollTop
      )
      if (!offsetsRef.current.length) offsetsRef.current = [0]
    }

    function lastOffset() {
      return offsetsRef.current[offsetsRef.current.length - 1] ?? 0
    }

    function nearestIdx(scrollTop) {
      let best = 0
      let bestDist = Infinity
      offsetsRef.current.forEach((off, i) => {
        const d = Math.abs(scrollTop - off)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      return best
    }

    measure()

    // Fade to black → instant scrollTop jump → fade in
    // Used whenever we loop footer → first section
    function fadeLoop(targetScrollTop, targetIdx) {
      busyRef.current = true
      tweenRef.current?.kill()
      gsap.to(loopOverlayRef.current, {
        opacity: 1,
        duration: 0.55,
        ease: 'power2.in',
        onComplete: () => {
          el.scrollTop    = targetScrollTop
          idxRef.current  = targetIdx
          gsap.to(loopOverlayRef.current, {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: 0.05,
            onComplete: () => {
              setTimeout(() => { busyRef.current = false }, 300)
            },
          })
        },
      })
    }

    function goTo(idx) {
      // Wrap-around
      if (idx >= TOTAL) idx = 0
      if (idx < 0)      idx = TOTAL - 1

      if (idx === idxRef.current || busyRef.current) return

      // Last section → top: fade-cut instead of scrolling back through all sections
      if (idxRef.current === TOTAL - 1 && idx === 0) {
        fadeLoop(offsetsRef.current[0] ?? 0, 0)
        return
      }

      // Top → last section: fade-cut instead of scrolling forward through all sections
      if (idxRef.current === 0 && idx === TOTAL - 1) {
        fadeLoop(lastOffset(), TOTAL - 1)
        return
      }

      idxRef.current = idx
      busyRef.current = true
      tweenRef.current?.kill()
      tweenRef.current = gsap.to(el, {
        scrollTop: offsetsRef.current[idx] ?? lastOffset(),
        duration: 0.7,
        ease: 'power3.inOut',
        onComplete: () => { busyRef.current = false },
      })
    }

    function onWheel(e) {
      e.preventDefault()
      if (busyRef.current) return
      // Ignore tiny noise / horizontal scrolls so one gesture = one move
      if (Math.abs(e.deltaY) < 4) return
      goTo(idxRef.current + (e.deltaY > 0 ? 1 : -1))
    }

    let touchY = 0
    function onTouchStart(e) { touchY = e.touches[0].clientY }
    function onTouchEnd(e) {
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40 || busyRef.current) return
      goTo(idxRef.current + (dy > 0 ? 1 : -1))
    }

    let scrollTicking = false
    function onScroll() {
      if (scrollTicking) return
      scrollTicking = true
      requestAnimationFrame(() => {
        idxRef.current = nearestIdx(el.scrollTop)
        scrollTicking = false
      })
    }

    // Footer video ends → same fade-cut loop back to top
    function onFooterLoop() {
      if (busyRef.current) return
      fadeLoop(0, 0)
    }

    const isMobile = window.matchMedia('(max-width: 767px)').matches

    el.addEventListener('wheel',  onWheel,  { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true  })

    let mTouchY = 0
    function onMobileTouchStart(e) { mTouchY = e.touches[0].clientY }
    function onMobileTouchEnd(e) {
      const dy = mTouchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40) return
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
      const atTop    = el.scrollTop < 8
      if (dy > 0 && atBottom) fadeLoop(offsetsRef.current[0] ?? 0, 0)
      if (dy < 0 && atTop)    fadeLoop(lastOffset(), TOTAL - 1)
    }

    // Navigation from Navbar or CTAs
    function onPortfolioNavigate(e) {
      const { idx } = e.detail || {}
      if (typeof idx === 'number') {
        busyRef.current = false
        goTo(idx)
      }
    }

    if (!isMobile) {
      el.addEventListener('touchstart', onTouchStart, { passive: true })
      el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    } else {
      el.addEventListener('touchstart', onMobileTouchStart, { passive: true })
      el.addEventListener('touchend',   onMobileTouchEnd,   { passive: true })
    }

    // Re-measure whenever the layout metrics change (orientation flip, mobile
    // browser-UI collapse, font load, resize). Use ResizeObserver for accuracy
    // with a debounced resize handler as a fallback.
    let resizeTimer = null
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        measure()
        idxRef.current = nearestIdx(el.scrollTop)
      }, 120)
    }

    let ro = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        measure()
        idxRef.current = nearestIdx(el.scrollTop)
      })
      ro.observe(el)
      sections.forEach((s) => ro.observe(s))
    }

    window.addEventListener('resize', onResize)
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {})

    window.addEventListener('footer-loop-back', onFooterLoop)
    window.addEventListener('portfolio-navigate', onPortfolioNavigate)

    return () => {
      el.removeEventListener('wheel',  onWheel)
      el.removeEventListener('scroll', onScroll)
      if (!isMobile) {
        el.removeEventListener('touchstart', onTouchStart)
        el.removeEventListener('touchend',   onTouchEnd)
      } else {
        el.removeEventListener('touchstart', onMobileTouchStart)
        el.removeEventListener('touchend',   onMobileTouchEnd)
      }
      ro?.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('footer-loop-back', onFooterLoop)
      window.removeEventListener('portfolio-navigate', onPortfolioNavigate)
      clearTimeout(resizeTimer)
      tweenRef.current?.kill()
    }
  }, [])

  return (
    <>
      {/* Full-screen fade overlay for seamless footer → top loop */}
      <div
        ref={loopOverlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 9999,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      <Navbar />
      <main ref={mainRef} style={{ height: '100vh', overflowY: 'scroll', overscrollBehavior: 'none' }}>
        <div>
          <VideoIntro />
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <WorkExperienceSection />
          <ContactSection />
        </div>
      </main>
    </>
  )
}
