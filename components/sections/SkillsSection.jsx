'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import {
  FiLayout,
  FiServer,
  FiDatabase,
  FiTerminal,
  FiAward,
  FiCheck,
} from 'react-icons/fi'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/SkillsSection.module.css'

const CATEGORY_ICONS = {
  'Frontend': FiLayout,
  'Backend & APIs': FiServer,
  'Database': FiDatabase,
  'Tools & Workflow': FiTerminal,
}

export default function SkillsSection() {
  const sectionRef  = useRef(null)
  const headerRef   = useRef(null)
  const cardsRef    = useRef([])
  const eduCardRef  = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const scroller = document.querySelector('main')
    if (!scroller) return

    let isActive = false

    function resetAnim() {
      gsap.killTweensOf(headerRef.current)
      cardsRef.current.forEach(el => el && gsap.killTweensOf(el))
      gsap.killTweensOf(eduCardRef.current)
      gsap.set(headerRef.current, { opacity: 0, y: 30 })
      cardsRef.current.forEach(el => el && gsap.set(el, { opacity: 0, y: 25, scale: 0.98 }))
      if (eduCardRef.current) gsap.set(eduCardRef.current, { opacity: 0, y: 20 })
    }

    function playAnim() {
      resetAnim()
      gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      cardsRef.current.forEach((el, idx) => {
        if (el) gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', delay: 0.2 + idx * 0.08 })
      })
      if (eduCardRef.current) gsap.to(eduCardRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.55 })
    }

    resetAnim()

    function onScroll() {
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.55
      if (inRange && !isActive)  { isActive = true;  playAnim() }
      if (!inRange && isActive)  { isActive = false; resetAnim() }
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
          <div className={styles.titleRow}>
            <h2 className={styles.title}>
              Skills &amp;{' '}
              <span className={styles.titleAccent}>Specializations</span>
            </h2>
          </div>
          <p className={styles.subtitle}>
            Production-proven tools and frameworks across frontend engineering, backend services, databases, and modern developer workflows.
          </p>
        </div>

        {/* 4 Skill Category Cards */}
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
                    <span className={styles.countBadge}>{group.skills.length} Technologies</span>
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

        {/* Education Banner */}
        {profile.education && profile.education.length > 0 && (
          <div ref={eduCardRef} className={styles.eduBanner}>
            <div className={styles.eduIconWrap}>
              <FiAward size={22} />
            </div>
            <div className={styles.eduContent}>
              <div className={styles.eduLeft}>
                <div className={styles.eduDegreeRow}>
                  <h4 className={styles.eduDegree}>{profile.education[0].degree}</h4>
                  <span className={styles.verifiedTag}>
                    <FiCheck size={11} /> Verified
                  </span>
                </div>
                <p className={styles.eduFocus}>{profile.education[0].focus}</p>
              </div>
              <div className={styles.eduDivider} />
              <p className={styles.eduDesc}>{profile.education[0].description}</p>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
