'use client'

import { useEffect, useRef, Fragment } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { FiArrowUpRight, FiFileText, FiSend } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'

import profile from '@/data/profile.json'
import content from '@/data/content.json'
import styles from '@/styles/sections/HeroSection.module.css'

const HeroBackground = dynamic(() => import('@/components/three/HeroBackground'), { ssr: false })

const SOCIAL_ICON_MAP = { GitHub: FaGithub, LinkedIn: FaLinkedinIn }
const SIDEBAR_LABELS  = ['GitHub', 'LinkedIn']

export default function HeroSection() {
  const sectionRef     = useRef(null)
  const availRef       = useRef(null)
  const headingRef     = useRef(null)
  const descRef        = useRef(null)
  const ctaGroupRef    = useRef(null)
  const pillsRef       = useRef(null)
  const statsRef       = useRef(null)
  const photoRef       = useRef(null)
  const socialRef      = useRef(null)
  const scrollCueRef   = useRef(null)

  function handleViewProjects() {
    const scroller = document.querySelector('main')
    const target = document.getElementById('projects')
    if (scroller && target) {
      gsap.to(scroller, { scrollTop: target.offsetTop, duration: 1.0, ease: 'power3.inOut' })
    } else if (scroller) {
      gsap.to(scroller, { scrollTop: 4 * window.innerHeight, duration: 1.0, ease: 'power3.inOut' })
    }
  }

  function handleConnect() {
    const scroller = document.querySelector('main')
    const target = document.getElementById('contact')
    if (scroller && target) {
      gsap.to(scroller, { scrollTop: target.offsetTop, duration: 1.1, ease: 'power3.inOut' })
    } else if (scroller) {
      const contactIdx = 4 + profile.projects.length + 1
      gsap.to(scroller, { scrollTop: contactIdx * window.innerHeight, duration: 1.2, ease: 'power3.inOut' })
    }
  }

  function handleResume() {
    window.location.href = `mailto:${profile.email}?subject=Resume%20Inquiry%20-%20Sachin%20Chauhan&body=Hi%20Sachin,%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20request%20your%20latest%20resume.`
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const fadeY = [
      availRef.current,
      headingRef.current,
      descRef.current,
      ctaGroupRef.current,
      pillsRef.current,
      statsRef.current,
    ].filter(Boolean)

    gsap.set(fadeY, { opacity: 0, y: 30 })
    if (photoRef.current)     gsap.set(photoRef.current,     { opacity: 0, scale: 0.96, x: 40 })
    if (socialRef.current)    gsap.set(socialRef.current,    { opacity: 0, x: -20 })
    if (scrollCueRef.current) gsap.set(scrollCueRef.current, { opacity: 0, y: 15 })

    const tl = gsap.timeline({ paused: true })
    tl.to(availRef.current,       { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .to(headingRef.current,     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.25')
      .to(descRef.current,        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35')
      .to(ctaGroupRef.current,    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
      .to(pillsRef.current,       { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .to(statsRef.current,       { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .to(photoRef.current,       { opacity: 1, scale: 1, x: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7')
      .to(socialRef.current,      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.5')
      .to(scrollCueRef.current,   { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')

    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { tl.play(); observer.disconnect() } },
      { threshold: 0.25 },
    )
    observer.observe(section)
    return () => { observer.disconnect(); tl.kill() }
  }, [])

  const sidebarSocials = SIDEBAR_LABELS
    .map(label => profile.socials.find(s => s.label === label))
    .filter(Boolean)

  return (
    <section ref={sectionRef} className={styles.section} id="hero">
      <HeroBackground />

      {/* Portrait visual with refined gradient masking */}
      <div ref={photoRef} className={styles.photo}>
        <Image
          src="/assets/hero.png"
          alt={profile.name.full}
          fill
          priority
          quality={100}
          sizes="(min-width: 768px) 52vw, 100vw"
          className={styles.photoImg}
        />
        <div className={styles.photoGlow} aria-hidden />
      </div>

      {/* Left Social Sidebar */}
      <div ref={socialRef} className={styles.socialSidebar}>
        {sidebarSocials.map(social => {
          const Icon = SOCIAL_ICON_MAP[social.label]
          if (!Icon) return null
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={social.label}
            >
              <Icon size={16} />
              <span className={styles.socialLabel}>{social.label}</span>
            </a>
          )
        })}
      </div>

      {/* Main Content Column */}
      <div className={styles.content}>

        {/* Small Availability Badge */}
        {profile.available && (
          <div ref={availRef} className={styles.availPill}>
            <span className={styles.availDot} />
            <span className={styles.availText}>{content.hero.availabilityLabel}</span>
            <span className={styles.availLocation}>· India / Worldwide</span>
          </div>
        )}

        {/* Main Heading */}
        <div ref={headingRef} className={styles.headingBlock}>
          <h1 className={styles.mainTitle}>
            <span className={styles.titleLine1}>{content.hero.headingLine1}</span>
            <span className={styles.titleLine2}>{content.hero.headingLine2}</span>
          </h1>
        </div>

        {/* Supporting Recruiter Description */}
        <p ref={descRef} className={styles.supportingDesc}>
          {content.hero.supportingDesc}
        </p>

        {/* Action Button Row */}
        <div ref={ctaGroupRef} className={styles.ctaGroup}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleViewProjects}
          >
            <span>{content.hero.primaryCta}</span>
            <FiArrowUpRight size={16} />
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleConnect}
          >
            <FiSend size={14} />
            <span>{content.hero.secondaryCta}</span>
          </button>

          <button
            type="button"
            className={styles.resumeBtn}
            onClick={handleResume}
            aria-label="Request Resume"
          >
            <FiFileText size={14} />
            <span>{content.hero.resumeCta}</span>
          </button>
        </div>

        {/* Compact Tech Stack Indicator */}
        <div ref={pillsRef} className={styles.pills}>
          <span className={styles.pillsLabel}>Core Stack:</span>
          {content.hero.pills.map((tag, i) => (
            <Fragment key={tag}>
              <span className={styles.pill}>{tag}</span>
              {i < content.hero.pills.length - 1 && (
                <span className={styles.pillDot} aria-hidden="true" />
              )}
            </Fragment>
          ))}
        </div>

        {/* Key Metrics / Stats Row */}
        <div ref={statsRef} className={styles.stats}>
          {[...profile.stats, content.hero.specialistStat].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Subtle Scroll Indicator */}
      <div ref={scrollCueRef} className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollMouse}>
          <span className={styles.scrollWheel} />
        </div>
      </div>

    </section>
  )
}
