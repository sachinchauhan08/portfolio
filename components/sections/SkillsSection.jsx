'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import {
  FiLayout,
  FiServer,
  FiTerminal,
  FiCpu,
  FiDatabase,
  FiCreditCard,
} from 'react-icons/fi'
import profile from '@/lib/profile'
import styles from '@/styles/sections/SkillsSection.module.css'

const CATEGORY_ICONS = {
  'Frontend': FiLayout,
  'Backend & APIs': FiServer,
  'AI & Automation': FiCpu,
  'Tools & Workflow': FiTerminal,
  'Data & Infrastructure': FiDatabase,
  'Payments & Integrations': FiCreditCard,
}

export default function SkillsSection() {
  const sectionRef  = useRef(null)
  const headerRef   = useRef(null)
  const cardsRef    = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const scroller = document.querySelector('main')
    if (!scroller) return

    let isActive = false
    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth <= 1024

    function resetAnim() {
      gsap.killTweensOf(headerRef.current)
      cardsRef.current.forEach(el => el && gsap.killTweensOf(el))
      gsap.set(headerRef.current, { opacity: 0, y: 30 })
      cardsRef.current.forEach(el => el && gsap.set(el, { opacity: 0, y: 25, scale: 0.98 }))
    }

    function playAnim() {
      resetAnim()
      gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      cardsRef.current.forEach((el, idx) => {
        if (el) gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', delay: 0.2 + idx * 0.08 })
      })
    }

    if (isMobileOrTablet) {
      playAnim()
      isActive = true
    } else {
      resetAnim()
    }

    function onScroll() {
      const scrollY = scroller.scrollTop
      const top = section.offsetTop
      const height = section.offsetHeight
      const inRange =
        scrollY + window.innerHeight * 0.85 >= top &&
        scrollY <= top + height - window.innerHeight * 0.15

      if (inRange && !isActive) {
        isActive = true
        playAnim()
      } else if (!inRange && isActive && !isMobileOrTablet) {
        isActive = false
        resetAnim()
      }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} id="skills">
      <div className={styles.bgGlow} aria-hidden />
      <div className={styles.gridLines} aria-hidden />

      <div className={styles.container}>

        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrow}>Technical Expertise</span>
          </div>
          <div className={styles.headerMain}>
            <div className={styles.headerCopy}>
              <h2 className={styles.title}>
                Skills &amp;{' '}
                <span className={styles.titleAccent}>Specializations</span>
              </h2>
              <p className={styles.subtitle}>
                A practical toolkit for building polished interfaces and dependable web applications.
              </p>
            </div>
          </div>
        </div>

        {/* Skill category cards */}
        <div className={styles.skillsGrid}>
          {profile.skillGroups.map((group, idx) => {
            const Icon = CATEGORY_ICONS[group.category] || FiTerminal
            return (
              <div
                key={group.category}
                ref={el => { cardsRef.current[idx] = el }}
                className={styles.skillCard}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrap}>
                    <Icon size={18} />
                  </div>
                  <div className={styles.cardTitleWrap}>
                    <h3 className={styles.categoryName}>{group.category}</h3>
                    <span className={styles.countBadge}>
                      {String(idx + 1).padStart(2, '0')} / {String(group.skills.length).padStart(2, '0')} skills
                    </span>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.tagsWrap}>
                  {group.skills.map(skill => (
                    <span key={skill} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
