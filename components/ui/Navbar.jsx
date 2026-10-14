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
  { label: 'Home',       targetId: 'intro',      idx: HOME_IDX },
  { label: 'About',      targetId: 'about',      idx: ABOUT_IDX },
  { label: 'Skills',     targetId: 'skills',     idx: SKILLS_IDX },
  { label: 'Projects',   targetId: 'projects',   idx: PROJECTS_IDX, isRange: true, rangeEnd: EXPERIENCE_IDX - 1 },
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
  const [onIntro, setOnIntro]             = useState(true)
  const [onDark, setOnDark]               = useState(false)
  const [menuOpen, setMenuOpen]           = useState(false)
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
      const currentY = scroller.scrollTop ?? window.scrollY
      const delta    = currentY - lastY.current

      setOnIntro(currentY < vh * 0.7)

      // Section tracking by real offset
      let currentSection = 'Home'
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.targetId)
        if (el && currentY + vh * 0.35 >= el.offsetTop) {
          currentSection = item.label
        }
      }
      setActiveSection(currentSection)
      setOnDark(currentSection === 'Skills' || currentSection === 'Projects' || currentSection === 'Experience' || currentSection === 'Contact')

      if (delta > 10 && !hidden.current && currentY > 120) {
        gsap.to(headerRef.current, { y: '-130%', duration: 0.35, ease: 'power2.inOut' })
        hidden.current = true
      } else if (delta < -6) {
        showNavbar()
      }

      lastY.current = currentY

      clearTimeout(stopTimer.current)
      stopTimer.current = setTimeout(showNavbar, 350)
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      scroller.removeEventListener('scroll', onScroll)
      clearTimeout(stopTimer.current)
    }
  }, [])

  function navigateTo(item) {
    const scroller = document.querySelector('main')
    if (scroller) {
      const el = document.getElementById(item.targetId)
      const top = el ? el.offsetTop : item.idx * window.innerHeight
      gsap.to(scroller, {
        scrollTop: top,
        duration: 0.9,
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
        <button
          type="button"
          className={styles.mobileBrand}
          onClick={() => navigateTo(NAV_ITEMS[0])}
          aria-label="Go to Home"
        >
          <span className={styles.brandAvatar}>SC</span>
          <span className={styles.brandName}>Sachin Chauhan</span>
        </button>

        <span className={styles.time}>INDIA · {time}</span>

        <NavigationMenu className={styles.navMenu}>
          <NavigationMenuList className="flex gap-1.5 md:gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.label
              return (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => navigateTo(item)}
                  >
                    {item.label}
                    {isActive && <span className={styles.activeDot} />}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className={styles.rightActions}>
          <a
            href={`mailto:${profile.email}`}
            className={styles.emailBtn}
          >
            Email Me
          </a>

          <button
            type="button"
            className={styles.hamburger}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className={styles.mobileMenu}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className={styles.mobileMenuCard}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileBrand}>
                <span className={styles.brandAvatar}>SC</span>
                <span className={styles.brandName}>Sachin Chauhan</span>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <FaTimes size={18} />
              </button>
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
