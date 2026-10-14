'use client'

import { useEffect, useRef, useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/ui/Navbar.module.css'
import { FaBars, FaTimes } from 'react-icons/fa'

const PROJECT_COUNT = profile.projects.length
const HOME_IDX       = 0
const ABOUT_IDX      = 2
const SKILLS_IDX     = 3
const PROJECTS_IDX   = 4
const EXPERIENCE_IDX = 4 + PROJECT_COUNT
const CONTACT_IDX    = 4 + PROJECT_COUNT + 1

const NAV_ITEMS = [
  { label: 'Home',       idx: HOME_IDX },
  { label: 'About',      idx: ABOUT_IDX },
  { label: 'Skills',     idx: SKILLS_IDX },
  { label: 'Projects',   idx: PROJECTS_IDX, isRange: true, rangeEnd: EXPERIENCE_IDX - 1 },
  { label: 'Experience', idx: EXPERIENCE_IDX },
  { label: 'Contact',    idx: CONTACT_IDX },
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
  const [time, setTime]             = useState('')
  const [onIntro, setOnIntro]       = useState(true)
  const [onDark, setOnDark]         = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [activeSection, setActiveSection] = useState('Home')
  const headerRef   = useRef(null)
  const lastY       = useRef(0)
  const hidden      = useRef(false)
  const stopTimer   = useRef(null)

  // Live IST Clock
  useEffect(() => {
    setTime(getIST())
    const id = setInterval(() => setTime(getIST()), 1000)
    return () => clearInterval(id)
  }, [])

  // Auto-hide on scroll-down, reveal on scroll-up & active section tracking
  useEffect(() => {
    const scroller = document.querySelector('main') ?? window
    const vh = window.innerHeight

    function showNavbar() {
      if (!hidden.current) return
      gsap.to(headerRef.current, { y: '0%', duration: 0.35, ease: 'power2.out' })
      hidden.current = false
    }

    const onScroll = () => {
      const currentY   = scroller.scrollTop ?? window.scrollY
      const delta      = currentY - lastY.current
      const sectionIdx = Math.round(currentY / vh)

      setOnIntro(currentY < vh * 0.7)
      setOnDark(sectionIdx >= 3)

      // Determine active section
      if (sectionIdx <= 1) {
        setActiveSection('Home')
      } else if (sectionIdx === 2) {
        setActiveSection('About')
      } else if (sectionIdx === 3) {
        setActiveSection('Skills')
      } else if (sectionIdx >= PROJECTS_IDX && sectionIdx < EXPERIENCE_IDX) {
        setActiveSection('Projects')
      } else if (sectionIdx === EXPERIENCE_IDX) {
        setActiveSection('Experience')
      } else if (sectionIdx >= CONTACT_IDX) {
        setActiveSection('Contact')
      }

      if (delta > 8 && !hidden.current) {
        gsap.to(headerRef.current, { y: '-100%', duration: 0.35, ease: 'power2.inOut' })
        hidden.current = true
      } else if (delta < -6) {
        showNavbar()
      }

      lastY.current = currentY

      clearTimeout(stopTimer.current)
      stopTimer.current = setTimeout(showNavbar, 400)
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      scroller.removeEventListener('scroll', onScroll)
      clearTimeout(stopTimer.current)
    }
  }, [])

  function navigateTo(idx) {
    const scroller = document.querySelector('main')
    if (scroller) {
      gsap.to(scroller, {
        scrollTop: idx * window.innerHeight,
        duration: 1.0,
        ease: 'power3.inOut',
      })
    }
    setMenuOpen(false)
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${onIntro ? styles.introMode : ''} ${onDark ? styles.darkMode : ''}`}
      >
        <span className={styles.time}>INDIA · {time}</span>

        <NavigationMenu className={styles.navMenu}>
          <NavigationMenuList className="flex gap-1.5 md:gap-3">
            {NAV_ITEMS.map(({ label, idx }) => {
              const isActive = activeSection === label
              return (
                <NavigationMenuItem key={label}>
                  <NavigationMenuLink
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => navigateTo(idx)}
                  >
                    {label}
                    {isActive && <span className={styles.activeDot} />}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <a
          href={`mailto:${profile.email}`}
          className={styles.emailBtn}
        >
          Email Me
        </a>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuLinks}>
            {NAV_ITEMS.map(({ label, idx }) => {
              const isActive = activeSection === label
              return (
                <button
                  key={label}
                  className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
                  onClick={() => navigateTo(idx)}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <a
            href={`mailto:${profile.email}`}
            className={styles.mobileMailLink}
            onClick={() => setMenuOpen(false)}
          >
            {profile.email}
          </a>
        </div>
      )}
    </>
  )
}
