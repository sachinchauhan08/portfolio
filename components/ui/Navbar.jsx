'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { FiMenu, FiX } from 'react-icons/fi'
import ThemeToggle from '@/components/ui/ThemeToggle'
import profile from '@/data/profile.json'
import styles from '@/styles/ui/Navbar.module.css'

// Section order matches the DOM in app/page.js:
// 0=VideoIntro(intro) 1=Hero(hero) 2=About(about) 3=Skills(skills)
// 4=Projects(projects) 5=WorkExperience(experience) 6=Contact(contact)
// The nav intentionally skips the intro slide, so Home points at the hero (1).
const NAV_ITEMS = [
  { label: 'Home', targetId: 'hero', idx: 1 },
  { label: 'About', targetId: 'about', idx: 2 },
  { label: 'Skills', targetId: 'skills', idx: 3 },
  { label: 'Projects', targetId: 'projects', idx: 4 },
  { label: 'Experience', targetId: 'experience', idx: 5 },
  { label: 'Contact', targetId: 'contact', idx: 6 },
]

// Maps a raw section index (including the intro video at 0) to a nav label.
const SECTION_LABELS = [
  'Intro',
  ...NAV_ITEMS.map((item) => item.label),
]

const LOCATION_LABEL = profile.location.based

function getIST() {
  return new Date()
    .toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
    .toUpperCase()
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Navbar() {
  const [time, setTime] = useState('')
  const [activeSection, setActiveSection] = useState('Intro')
  const [menuOpen, setMenuOpen] = useState(false)

  const headerRef = useRef(null)
  const navRef = useRef(null)
  const indicatorRef = useRef(null)
  const linkRefs = useRef({})

  // The intro slide (0) is the full-bleed video stage: hide the navbar there.
  const isIntro = activeSection === 'Intro'

  // Live IST clock
  useEffect(() => {
    const t = setTimeout(() => setTime(getIST()), 0)
    const id = setInterval(() => setTime(getIST()), 1000)
    return () => {
      clearTimeout(t)
      clearInterval(id)
    }
  }, [])

  // Active section tracking based on the real rendered section positions.
  // Sections are NOT uniformly one viewport tall on mobile (they become
  // `height: auto; min-height: 100svh`), so mapping scrollTop → index with
  // `window.innerHeight` misreported the active item. Instead we measure each
  // section's offset and pick the one nearest the current scroll position.
  useEffect(() => {
    const scroller = document.querySelector('main')
    if (!scroller) return

    const sections = Array.from(scroller.querySelectorAll('section'))
    const offsets = []

    function measure() {
      const base = scroller.getBoundingClientRect().top
      offsets.length = 0
      sections.forEach((s) =>
        offsets.push(s.getBoundingClientRect().top - base + scroller.scrollTop)
      )
    }

    function sync() {
      const y = scroller.scrollTop
      let nearest = 0
      let best = Infinity
      offsets.forEach((off, i) => {
        const d = Math.abs(y - off)
        if (d < best) {
          best = d
          nearest = i
        }
      })
      setActiveSection(SECTION_LABELS[nearest] ?? 'Intro')
    }

    measure()

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        sync()
        ticking = false
      })
    }

    let resizeTimer = null
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        measure()
        sync()
      }, 120)
    }

    let ro = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        measure()
        sync()
      })
      sections.forEach((s) => ro.observe(s))
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    sync()

    return () => {
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
      clearTimeout(resizeTimer)
    }
  }, [])

  // Move the sliding active indicator beneath the active link
  const positionIndicator = useCallback(() => {
    const indicator = indicatorRef.current
    if (!indicator) return

    const target = linkRefs.current[activeSection]
    const reduce = prefersReducedMotion()

    if (!target || isIntro || menuOpen) {
      gsap.to(indicator, { opacity: 0, duration: reduce ? 0 : 0.25, ease: 'power2.out' })
      return
    }

    gsap.to(indicator, {
      x: target.offsetLeft,
      width: target.offsetWidth,
      opacity: 1,
      duration: reduce ? 0 : 0.45,
      ease: 'power3.out',
    })
  }, [activeSection, isIntro, menuOpen])

  useEffect(() => {
    positionIndicator()
  }, [positionIndicator])

  // Reposition on resize so the indicator stays aligned
  useEffect(() => {
    const onResize = () => positionIndicator()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [positionIndicator])

  // Entrance animation (clears inline styles so the CSS hidden state can win)
  useEffect(() => {
    if (!headerRef.current || prefersReducedMotion()) return
    const tween = gsap.fromTo(
      headerRef.current,
      { y: -26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: 'power3.out',
        delay: 0.15,
        onComplete: () => gsap.set(headerRef.current, { clearProps: 'transform,opacity' }),
      }
    )
    return () => tween.kill()
  }, [])

  // Auto-close the mobile menu when switching to desktop width
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 767) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Escape always closes the mobile menu
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  function navigateTo(item) {
    setMenuOpen(false)

    // Canonical GSAP snap navigation handled in page.js. page.js measures the
    // real section offsets, so no native scroll here (a competing scrollTo
    // fought the GSAP tween and mis-targeted sections on mobile).
    window.dispatchEvent(
      new CustomEvent('portfolio-navigate', { detail: { idx: item.idx } })
    )
  }

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${isIntro ? styles.headerHidden : ''}`}
      aria-hidden={isIntro ? 'true' : undefined}
    >
      {/* ── Menu list (desktop) ────────────────────────────── */}
      <nav ref={navRef} className={styles.navLinks} aria-label="Main Navigation">
        <span
          ref={indicatorRef}
          className={styles.activeIndicator}
          aria-hidden="true"
        />
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.label
          return (
            <button
              key={item.label}
              type="button"
              ref={(el) => { linkRefs.current[item.label] = el }}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => navigateTo(item)}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* ── India time + theme toggle + mobile trigger ─────── */}
      <div className={styles.actions}>
        <span className={styles.time} aria-label={`${LOCATION_LABEL} time`}>
          {LOCATION_LABEL} · {time}
        </span>

        <ThemeToggle />

        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
        >
          {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      {/* ── Mobile dropdown menu ───────────────────────────── */}
      <nav
        id="mobile-nav-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-label="Mobile Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.label
          return (
            <button
              key={item.label}
              type="button"
              className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
              onClick={() => navigateTo(item)}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </button>
          )
        })}
        <span className={styles.mobileTime} aria-label={`${LOCATION_LABEL} time`}>
          {LOCATION_LABEL} · {time}
        </span>
      </nav>
    </header>
  )
}
