'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { FiMenu, FiX } from 'react-icons/fi'
import ThemeToggle from '@/components/ui/ThemeToggle'
import profile from '@/data/profile.json'
import styles from '@/styles/ui/Navbar.module.css'

const PROJECT_COUNT = profile.projects.length
const HERO_IDX = 1

const NAV_ITEMS = [
  { label: 'Home', targetId: 'hero', idx: HERO_IDX },
  { label: 'About', targetId: 'about', idx: 2 },
  { label: 'Skills', targetId: 'skills', idx: 3 },
  { label: 'Projects', targetId: 'projects', idx: 4 },
  { label: 'Experience', targetId: 'experience', idx: 4 + PROJECT_COUNT },
  { label: 'Contact', targetId: 'contact', idx: 5 + PROJECT_COUNT },
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

  // Active section tracking based on scroll position
  useEffect(() => {
    const scroller = document.querySelector('main')
    if (!scroller) return

    const onScroll = () => {
      const currentY = scroller.scrollTop
      const vh = window.innerHeight

      if (currentY < vh * 0.5) {
        setActiveSection('Intro')
      } else if (currentY < vh * 1.5) {
        setActiveSection('Home')
      } else if (currentY < vh * 2.5) {
        setActiveSection('About')
      } else if (currentY < vh * 3.5) {
        setActiveSection('Skills')
      } else if (currentY < vh * (3.5 + PROJECT_COUNT)) {
        setActiveSection('Projects')
      } else if (currentY < vh * (4.5 + PROJECT_COUNT)) {
        setActiveSection('Experience')
      } else {
        setActiveSection('Contact')
      }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scroller.removeEventListener('scroll', onScroll)
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

    // Canonical GSAP snap navigation handled in page.js
    window.dispatchEvent(
      new CustomEvent('portfolio-navigate', { detail: { idx: item.idx } })
    )

    // Direct scroll fallback
    const scroller = document.querySelector('main')
    if (scroller) {
      scroller.scrollTo({ top: item.idx * window.innerHeight, behavior: 'smooth' })
    }
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
