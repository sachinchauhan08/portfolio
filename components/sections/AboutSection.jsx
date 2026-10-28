'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { FiAward } from 'react-icons/fi'
import profile from '@/lib/profile'
import styles from '@/styles/sections/AboutSection.module.css'

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
}

export default function AboutSection() {
  const sectionRef  = useRef(null)
  const photoColRef = useRef(null)
  const contentRef  = useRef(null)

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
      gsap.set(photoColRef.current, { opacity: 0, x: -32 })
      gsap.set(contentRef.current, { opacity: 0, y: 24 })
    }

    function playAnim() {
      resetAnim()
      gsap.to(photoColRef.current, { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out' })
      gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.12 })
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

      <div className={styles.container}>
        <div className={styles.profileLayout}>
          <div ref={photoColRef} className={styles.identityPanel}>
            <div className={styles.photoWrapper}>
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
                <div className={styles.photoAvailability}>
                  <span className={styles.statusDot} aria-hidden />
                  <span>{profile.availabilityLabel}</span>
                </div>
              </div>
            </div>

            <div className={styles.identityFooter}>
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
              <p className={styles.locationNote}>
                <span>{profile.location.based}</span>
                <span className={styles.locationDivider} aria-hidden>·</span>
                <span>{profile.location.availability}</span>
              </p>
            </div>
          </div>

          <div ref={contentRef} className={styles.contentCol}>
            <header className={styles.introHeader}>
              <div className={styles.eyebrowWrap}>
                <span className={styles.eyebrowLine} aria-hidden />
                <span className={styles.eyebrow}>About Me</span>
              </div>
              <h2 className={styles.heading}>
                <span className={styles.headingAccent}>{profile.name.full}</span>
                <span className={styles.headingRole}>{profile.roles.short}</span>
              </h2>
            </header>

            <p className={styles.bioParagraph}>{profile.bio}</p>

            <div className={styles.statsStrip} role="group" aria-label="Career highlights">
              {profile.stats.map(s => (
                <div key={s.label} className={styles.statItem}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            {profile.education && profile.education.length > 0 && (
              <section className={styles.educationSection} aria-labelledby="education-title">
                <div className={styles.educationHeading}>
                  <div>
                    <span className={styles.educationEyebrow}>Academic foundation</span>
                    <h3 className={styles.educationTitle} id="education-title">Education</h3>
                  </div>
                  <FiAward className={styles.educationIcon} size={19} aria-hidden />
                </div>
                <div className={styles.educationGrid}>
                  {profile.education.map((education) => (
                    <article key={education.degree} className={styles.educationCard}>
                      <div className={styles.educationDetails}>
                        <h4 className={styles.educationDegree}>{education.degree}</h4>
                        <p className={styles.educationInstitution}>{education.institution}</p>
                      </div>
                      <div className={styles.educationMeta}>
                        <span className={styles.educationPeriod}>{education.period}</span>
                        <span className={styles.educationGrade}>CGPA <strong>{education.cgpa}</strong></span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
