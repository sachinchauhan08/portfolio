'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { FiMapPin, FiBriefcase } from 'react-icons/fi'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/WorkExperienceSection.module.css'

const EXPS = profile.experience

export default function WorkExperienceSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const railRef = useRef(null)
  const rowRefs = useRef([])
  const tlRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const scroller = document.querySelector('main')
    if (!scroller) return

    let isActive = false
    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth <= 1024

    function resetAnim() {
      tlRef.current?.kill()
      gsap.set(headerRef.current, { opacity: 0, y: 24 })
      gsap.set(railRef.current, { scaleY: 0, transformOrigin: 'top center' })
      rowRefs.current.forEach(el => el && gsap.set(el, { opacity: 0, y: 26 }))
    }

    function playAnim() {
      resetAnim()
      const n = EXPS.length
      const tl = gsap.timeline()
      tlRef.current = tl

      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0)
      tl.to(railRef.current, { scaleY: 1, duration: 0.7 + n * 0.16, ease: 'power2.inOut' }, 0.1)

      EXPS.forEach((_, i) => {
        tl.to(rowRefs.current[i], {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
        }, 0.24 + i * 0.16)
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
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      tlRef.current?.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} id="experience">
      <div className={styles.bgGlow} aria-hidden />
      <div className={styles.gridLines} aria-hidden />

      <div className={styles.container}>

        {/* Header */}
        <header ref={headerRef} className={styles.header}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrow}>Career Timeline</span>
          </div>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>
              Work <span className={styles.titleAccent}>Experience</span>
            </h2>
            <span className={styles.countBadge}>
              0{EXPS.length} Companies · 4+ Years
            </span>
          </div>
          <p className={styles.subtitle}>
            A track record of shipping production-grade frontend and full-stack systems —
            from reusable component libraries to high-throughput pipelines and AI platforms.
          </p>
        </header>

        {/* Timeline */}
        <div className={styles.timeline}>
          <div className={styles.railTrack} aria-hidden>
            <div ref={railRef} className={styles.railFill} />
          </div>

          <ol className={styles.entries}>
            {EXPS.map((exp, i) => {
              const isCurrent = i === EXPS.length - 1
              return (
                <li
                  key={exp.id}
                  ref={el => { rowRefs.current[i] = el }}
                  className={styles.card}
                >
                  <span className={styles.cardGlow} aria-hidden />

                  <div className={styles.indexCol}>
                    <span className={styles.indexBadge}>0{i + 1}</span>
                  </div>

                  <div className={styles.contentCol}>
                    <div className={styles.headRow}>
                      <h3 className={styles.company}>{exp.company}</h3>
                      <span className={styles.role}>
                        <FiBriefcase size={12} className={styles.metaIcon} />
                        {exp.role}
                      </span>
                    </div>
                    <p className={styles.desc}>{exp.desc}</p>
                    <div className={styles.stack}>
                      {exp.tech.map(t => (
                        <span key={t} className={styles.tag}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.metaCol}>
                    <span className={styles.period}>
                      {exp.period} — {exp.periodEnd}
                    </span>
                    <span className={styles.typeTag}>{exp.type}</span>
                    {isCurrent && <span className={styles.currentTag}>Current</span>}
                    {exp.location && (
                      <span className={styles.location}>
                        <FiMapPin size={11} className={styles.metaIcon} />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

      </div>
    </section>
  )
}
