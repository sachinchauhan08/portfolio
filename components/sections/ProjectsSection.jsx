'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { FaGithub } from 'react-icons/fa'
import { FiArrowUpRight, FiExternalLink } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'
import profile from '@/lib/profile'
import styles from '@/styles/sections/ProjectsSection.module.css'

const PROJECTS = profile.projects

export default function ProjectsSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])
  const [ready, setReady] = useState(false)

  function resetAnim() {
    gsap.killTweensOf(headerRef.current)
    cardsRef.current.forEach(el => el && gsap.killTweensOf(el))
    gsap.set(headerRef.current, { opacity: 0, y: 30 })
    cardsRef.current.forEach(el => el && gsap.set(el, { opacity: 0, y: 28, scale: 0.97 }))
  }

  function playAnim() {
    resetAnim()
    gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    cardsRef.current.forEach((el, idx) => {
      if (el) {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: 'power2.out',
          delay: 0.2 + idx * 0.1,
        })
      }
    })
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const scroller = document.querySelector('main')
    if (!scroller) return

    let isActive = false
    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth <= 1024

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
  }, [ready])

  // Swiper is a client-only component — mount it after hydration so the
  // grid→carousel transition is smooth and refs line up before animation.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth <= 1024

    if (isMobileOrTablet) {
      playAnim()
    } else {
      resetAnim()
    }
    setReady(true)
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} id="projects">
      <div className={styles.bgGlow} aria-hidden />
      <div className={styles.gridLines} aria-hidden />

      <div className={styles.container}>

        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrow}>Featured Work</span>
          </div>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>
              Projects &{' '}
              <span className={styles.titleAccent}>Case Studies</span>
            </h2>
            <span className={styles.countBadge}>{PROJECTS.length} Projects Shipped</span>
          </div>
          <p className={styles.subtitle}>
            Production applications spanning AI marketplaces, conversational agents, multi-user
            platforms, and healthcare SaaS — built end to end with modern full-stack tooling.
          </p>
        </div>

        {/* Projects Carousel */}
        <div className={styles.carouselWrap}>
          {ready && (
            <Swiper
              slidesPerView={1}
              spaceBetween={16}
              loop
              centeredSlides={false}
              grabCursor={true}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                768: { slidesPerView: 1, spaceBetween: 20 },
                1024: { slidesPerView: 2, spaceBetween: 22 },
                1440: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className={styles.swiper}
            >
              {PROJECTS.map((proj, idx) => (
                <SwiperSlide key={proj.id}>
                  <article
                    ref={el => { cardsRef.current[idx] = el }}
                    className={styles.card}
                  >
                    {/* Media */}
                    <div className={styles.media}>
                      <Image
                        src={proj.image}
                        alt={proj.title}
                        fill
                        quality={100}
                        sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={styles.mediaImg}
                      />
                      <div className={styles.mediaOverlay} aria-hidden />
                      <span className={styles.typeTag}>{proj.type}</span>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewIcon}
                          aria-label={`Open ${proj.title}`}
                        >
                          <FiExternalLink size={16} />
                        </a>
                      )}
                    </div>

                    {/* Body */}
                    <div className={styles.body}>
                      <h3 className={styles.cardTitle}>{proj.title}</h3>
                      <p className={styles.cardSubtitle}>{proj.subtitle}</p>
                      <p className={styles.desc}>{proj.desc}</p>

                      <div className={styles.stack}>
                        {proj.tech.slice(0, 5).map(t => (
                          <span key={t} className={styles.tag}>{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={styles.cardFooter}>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.liveBtn}
                        >
                          <span>View Project</span>
                          <FiArrowUpRight size={14} />
                        </a>
                      )}
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.githubBtn}
                          aria-label={`${proj.title} source code`}
                        >
                          <FaGithub size={15} />
                        </a>
                      )}
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

      </div>
    </section>
  )
}