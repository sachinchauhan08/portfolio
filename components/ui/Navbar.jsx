'use client'

import { useEffect, useRef, useState } from 'react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import profile from '@/data/profile.json'
import styles from '@/styles/ui/Navbar.module.css'
import { FaBars, FaTimes } from 'react-icons/fa'

const PROJECT_COUNT = profile.projects.length
const HERO_IDX       = 1
const ABOUT_IDX      = 2
const SKILLS_IDX     = 3
const PROJECTS_IDX   = 4
const EXPERIENCE_IDX = 4 + PROJECT_COUNT // 8
const CONTACT_IDX    = 4 + PROJECT_COUNT + 1 // 9

const NAV_ITEMS = [
  { label: 'Home',       targetId: 'hero',       idx: HERO_IDX },
  { label: 'About',      targetId: 'about',      idx: ABOUT_IDX },
  { label: 'Skills',     targetId: 'skills',     idx: SKILLS_IDX },
  { label: 'Projects',   targetId: 'projects',   idx: PROJECTS_IDX },
  { label: 'Experience', targetId: 'experience', idx: EXPERIENCE_IDX },
  { label: 'Contact',    targetId: 'contact',    idx: CONTACT_IDX },
]

function getIST() {
  return new Date().toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).toUpperCase()
}

export default function Navbar() {
  const [time, setTime]                   = useState('')
  const [menuOpen, setMenuOpen]           = useState(false)
  const [activeSection, setActiveSection] = useState('Home')
  const headerRef                         = useRef(null)

  // Live IST Clock
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

  function navigateTo(item) {
    setMenuOpen(false)

    // 1. Dispatch custom event to page.js for canonical GSAP snap navigation
    window.dispatchEvent(
      new CustomEvent('portfolio-navigate', { detail: { idx: item.idx } })
    )

    // 2. Direct scroll fallback
    const scroller = document.querySelector('main')
    if (scroller) {
      const top = item.idx * window.innerHeight
      scroller.scrollTo({ top, behavior: 'smooth' })
    }
  }

  function navigateHome() {
    setMenuOpen(false)
    const scroller = document.querySelector('main')
    const currentY = scroller ? scroller.scrollTop : 0
    // If currently at hero, scroll to intro; otherwise scroll to hero
    const targetIdx = currentY >= window.innerHeight * 0.8 && currentY <= window.innerHeight * 1.5 ? 0 : HERO_IDX

    window.dispatchEvent(
      new CustomEvent('portfolio-navigate', { detail: { idx: targetIdx } })
    )

    if (scroller) {
      scroller.scrollTo({ top: targetIdx * window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        {/* Brand Logo */}
        <button
          type="button"
          className={styles.mobileBrand}
          onClick={navigateHome}
          aria-label="Go to Home"
        >
          <span className={styles.brandAvatar}>SC</span>
          <span className={styles.brandName}>Sachin Chauhan</span>
        </button>

        {/* Live IST clock */}
        <span className={styles.time}>INDIA · {time}</span>

        {/* Desktop Navigation Links */}
        <nav className={styles.navLinks} aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.label
            return (
              <button
                key={item.label}
                type="button"
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onClick={() => navigateTo(item)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{item.label}</span>
                {isActive && <span className={styles.activeDot} />}
              </button>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className={styles.rightActions}>
          <ThemeToggle />

          <a
            href={`mailto:${profile.email}?subject=Resume%20Inquiry%20-%20Sachin%20Chauhan&body=Hi%20Sachin,%20I%20would%20like%20to%20request%20your%20latest%20resume.`}
            className={styles.resumeBtn}
            aria-label="Request Resume"
          >
            Resume
          </a>

          <a
            href={`mailto:${profile.email}`}
            className={styles.emailBtn}
          >
            Email Me
          </a>

          <button
            type="button"
            className={styles.hamburger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div
          className={styles.mobileMenu}
          onClick={() => setMenuOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.mobileMenuCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileBrand}>
                <span className={styles.brandAvatar}>SC</span>
                <span className={styles.brandName}>Sachin Chauhan</span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            <div className={styles.mobileMenuLinks}>
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.label
                return (
                  <button
                    type="button"
                    key={item.label}
                    className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
                    onClick={() => navigateTo(item)}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className={styles.mobileActiveDot} />}
                  </button>
                )
              })}
            </div>

            <div className={styles.mobileMenuFooter}>
              <a
                href={`mailto:${profile.email}`}
                className={styles.mobileMailLink}
                onClick={() => setMenuOpen(false)}
              >
                {profile.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
