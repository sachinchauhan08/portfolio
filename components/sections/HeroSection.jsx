'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { FiArrowUpRight, FiDownload, FiSend } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'

import profile from '@/lib/profile'
import content from '@/data/content.json'
import styles from '@/styles/sections/HeroSection.module.css'

const HeroVisual = dynamic(() => import('@/components/three/HeroVisual'), { ssr: false })

const SOCIAL_ICON_MAP = { GitHub: FaGithub, LinkedIn: FaLinkedinIn }
const SOCIAL_LABELS = ['GitHub', 'LinkedIn']

export default function HeroSection() {
  const sectionRef = useRef(null)
  const availRef = useRef(null)
  const headingRef = useRef(null)
  const descRef = useRef(null)
  const ctaGroupRef = useRef(null)
  const visualRef = useRef(null)
  const socialRef = useRef(null)
  const scrollCueRef = useRef(null)

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
      gsap.to(scroller, { scrollTop: 6 * window.innerHeight, duration: 1.2, ease: 'power3.inOut' })
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const fadeY = [
      availRef.current,
      headingRef.current,
      descRef.current,
      ctaGroupRef.current,
    ].filter(Boolean)

    gsap.set(fadeY, { opacity: 0, y: 22 })
    if (visualRef.current) gsap.set(visualRef.current, { opacity: 0, scale: 0.98, x: 20 })
    if (socialRef.current) gsap.set(socialRef.current, { opacity: 0, y: 10 })
    if (scrollCueRef.current) gsap.set(scrollCueRef.current, { opacity: 0, y: 10 })

    const tl = gsap.timeline({ paused: true })
    tl.to(availRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
      .to(headingRef.current, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.2')
      .to(descRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to(ctaGroupRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.2')
      .to(visualRef.current, { opacity: 1, scale: 1, x: 0, duration: 0.75, ease: 'power3.out' }, '-=0.55')
      .to(socialRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.35')
      .to(scrollCueRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tl.play()
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(section)
    return () => {
      observer.disconnect()
      tl.kill()
    }
  }, [])

  const socials = SOCIAL_LABELS
    .map((label) => profile.socials.find((social) => social.label === label))
    .filter(Boolean)

  return (
    <section ref={sectionRef} className={styles.section} id="hero">
      <div className={styles.content}>
        {profile.available && (
          <div ref={availRef} className={styles.availPill}>
            <span className={styles.availDot} aria-hidden="true" />
            <span>{profile.availabilityLabel}</span>
            <span className={styles.availDivider} aria-hidden="true" />
            <span className={styles.availLocation}>
              {profile.location.based} · {profile.location.availability}
            </span>
          </div>
        )}

        <div ref={headingRef} className={styles.headingBlock}>
          <span className={styles.eyebrow}>{profile.roles.short}</span>
          <h1 className={styles.mainTitle}>
            <span className={styles.titleLine1}>{content.hero.headingLine1}</span>
            <span className={styles.titleLine2}>{content.hero.headingLine2}</span>
          </h1>
        </div>

        <p ref={descRef} className={styles.supportingDesc}>
          {content.hero.supportingDesc}
        </p>

        <div ref={ctaGroupRef} className={styles.ctaGroup}>
          <button type="button" className={styles.primaryBtn} onClick={handleViewProjects}>
            <span>{content.hero.primaryCta}</span>
            <FiArrowUpRight size={16} aria-hidden="true" />
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={handleConnect}>
            <FiSend size={14} aria-hidden="true" />
            <span>{content.hero.secondaryCta}</span>
          </button>
          <a
            href="/assets/Sachin_Chauhan_Full_Stack_Developer_Resume.pdf"
            download="Sachin_Chauhan_Full_Stack_Developer_Resume.pdf"
            className={styles.resumeBtn}
            aria-label={`Download ${profile.name.first}'s resume`}
          >
            <FiDownload size={14} aria-hidden="true" />
            <span>{content.hero.resumeCta}</span>
          </a>
        </div>

        <nav ref={socialRef} className={styles.socialRow} aria-label="Social profiles">
          {socials.map((social) => {
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
                <Icon size={16} aria-hidden="true" />
                <span>{social.label}</span>
                <FiArrowUpRight size={12} aria-hidden="true" />
              </a>
            )
          })}
        </nav>
      </div>

      <div ref={visualRef} className={styles.visualWrap} aria-hidden="true">
        <HeroVisual />
      </div>

      <div ref={scrollCueRef} className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollText}>Scroll to explore</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  )
}
