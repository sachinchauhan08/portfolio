'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { FiLayers, FiCpu, FiTrendingUp } from 'react-icons/fi'
import profile from '@/lib/profile'
import styles from '@/styles/sections/AboutSection.module.css'

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
}

const PILLARS = [
  {
    icon: FiLayers,
    title: 'Frontend Architecture',
    desc: 'Modular React & Next.js systems, responsive component libraries, and clean state workflows.',
  },
  {
    icon: FiCpu,
    title: 'API & Microservices',
    desc: 'Scalable RESTful endpoints, JWT/RBAC security, Redis caching, and async job queues with BullMQ.',
  },
  {
    icon: FiTrendingUp,
    title: 'Speed & Optimization',
    desc: 'Core Web Vitals tuning, SSR/ISR data fetching, memoization, and optimized asset pipelines.',
  },
]

export default function AboutSection() {
  const sectionRef  = useRef(null)
  const photoColRef = useRef(null)
  const contentRef  = useRef(null)
  const pillarsRef  = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const scroller = document.querySelector('main')
    if (!scroller) return

    let isActive = false
    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth <= 1024

    function resetAnim() {
      gsap.killTweensOf(photoColRef.current)
      gsap.killTweensOf(contentRef.current)
      pillarsRef.current.forEach(el => el && gsap.killTweensOf(el))
      gsap.set(photoColRef.current, { opacity: 0, x: -40 })
      gsap.set(contentRef.current,  { opacity: 0, y: 30 })
      pillarsRef.current.forEach(el => el && gsap.set(el, { opacity: 0, y: 20 }))
    }

    function playAnim() {
      resetAnim()
      gsap.to(photoColRef.current, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' })
      gsap.to(contentRef.current,  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.15 })
      pillarsRef.current.forEach((el, idx) => {
        if (el) gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.4 + idx * 0.08 })
      })
    }

    if (isMobileOrTablet) {
      // Ensure content is immediately visible on mobile/tablet without waiting for exact scroll threshold
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
    <section ref={sectionRef} className={styles.section} id="about">
      <div className={styles.bgNoise} aria-hidden />
      <div className={styles.gridLines} aria-hidden />

      <div className={styles.container}>

        {/* Left: Identity Panel */}
        <div ref={photoColRef} className={styles.identityPanel}>
          <div className={styles.photoWrapper}>
            <div className={styles.photoCornerGlow} aria-hidden />
            <div className={styles.photoFrame}>
              <Image
                src="/assets/myImage.png"
                alt={profile.name.full}
                fill
                quality={100}
                sizes="(min-width: 768px) 32vw, 100vw"
                className={styles.photoImg}
              />
              <div className={styles.photoOverlay} aria-hidden />
              <div className={styles.photoBadge}>
                <div className={styles.badgeAvatar}>SC</div>
                <div className={styles.badgeInfo}>
                  <span className={styles.badgeName}>{profile.name.full}</span>
                  <span className={styles.badgeRole}>{profile.roles.short}</span>
                </div>
                <div className={styles.badgeStatus}>
                  <span className={styles.statusDot} />
                  Available
                </div>
              </div>
            </div>
          </div>

          <div className={styles.socialRow}>
            {profile.socials.map(s => {
              const Icon = SOCIAL_ICONS[s.label]
              if (!Icon) return null
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label={s.label}
                >
                  <Icon size={14} />
                  <span>{s.label}</span>
                </a>
              )
            })}
          </div>
        </div>

        {/* Right: Content Column */}
        <div ref={contentRef} className={styles.contentCol}>

          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrow}>About Me</span>
          </div>

          <h2 className={styles.heading}>
            Engineering{' '}
            <span className={styles.headingAccent}>High-Performance</span>{' '}
            Interfaces &amp; Modern Web Apps
          </h2>

          <p className={styles.bioParagraph}>{profile.bio}</p>

          <div className={styles.statsStrip}>
            {profile.stats.map(s => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.strengthsGrid}>
            {PILLARS.map((p, idx) => {
              const Icon = p.icon
              return (
                <div
                  key={p.title}
                  ref={el => { pillarsRef.current[idx] = el }}
                  className={styles.strengthCard}
                >
                  <div className={styles.strengthIconBox}>
                    <Icon size={17} />
                  </div>
                  <h3 className={styles.strengthTitle}>{p.title}</h3>
                  <p className={styles.strengthDesc}>{p.desc}</p>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
