'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import styles from '@/styles/sections/ScreenLoader.module.css'

const NAME_LETTERS = 'SACHIN CHAUHAN'.split('')

export default function ScreenLoader({ onDismiss }) {
  const overlayRef = useRef(null)
  const subtitleRef = useRef(null)
  const lettersRef = useRef([])
  const barRef = useRef(null)
  const progressBoxRef = useRef(null)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const overlay = overlayRef.current
    const subtitle = subtitleRef.current
    const letters = lettersRef.current.filter(Boolean)
    const bar = barRef.current
    const progBox = progressBoxRef.current

    if (!overlay) return

    // ── Initial State ──
    gsap.set(overlay, { opacity: 1 })
    gsap.set(subtitle, { opacity: 0, y: -15, letterSpacing: '0.35em' })
    gsap.set(letters, { opacity: 0, y: 25, filter: 'blur(8px)', scale: 0.9 })
    gsap.set(progBox, { opacity: 0, y: 15 })
    if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' })

    const masterTl = gsap.timeline()

    // 1. Entrance: Subtitle fades in (0.0s - 0.5s)
    masterTl.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.1)

    // 2. Letter-by-letter reveal for "SACHIN CHAUHAN" (0.2s - 1.2s)
    masterTl.to(letters, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.7,
      stagger: 0.035,
      ease: 'power3.out',
    }, 0.25)

    // 3. Progress bar container fades in (0.5s)
    masterTl.to(progBox, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.5)

    // 4. Progress bar animates smoothly from 0% to 100% across the 5s window
    // Starts at 0.5s and finishes at 4.65s (duration = 4.15s)
    const counter = { val: 0 }
    masterTl.to(counter, {
      val: 100,
      duration: 4.15,
      ease: 'power1.inOut',
      onUpdate: () => {
        setPercent(Math.round(counter.val))
      },
    }, 0.5)

    if (bar) {
      masterTl.to(bar, {
        scaleX: 1,
        duration: 4.15,
        ease: 'power1.inOut',
      }, 0.5)
    }

    // 5. At exactly 5.0 seconds, dispatch event to trigger video autoplay
    // and smoothly fade out overlay
    masterTl.call(() => {
      window.dispatchEvent(new CustomEvent('loader-animation-done'))
    }, null, 8.0)

    masterTl.to(overlay, {
      opacity: 0,
      scale: 1.02,
      filter: 'blur(10px)',
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: () => {
        if (onDismiss) onDismiss()
      },
    }, 5.0)

    return () => {
      masterTl.kill()
    }
  }, [onDismiss])

  function handleDismiss() {
    window.dispatchEvent(new CustomEvent('loader-animation-done'))
    if (onDismiss) onDismiss()
  }

  return (
    <aside
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleDismiss}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      {/* Cinematic ambient background glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.nebulaOrb1} aria-hidden="true" />
      <div className={styles.nebulaOrb2} aria-hidden="true" />

      {/* Center Hero Block */}
      <div className={styles.centerBox}>
        {/* Subtitle */}
        <p ref={subtitleRef} className={styles.subtitle}>
          <span className={styles.subtitleDot} />
          <span>WELCOME TO MY PORTFOLIO</span>
        </p>

        {/* Name Reveal: Letter-by-letter */}
        <h1 className={styles.nameHeading}>
          {NAME_LETTERS.map((char, index) => (
            <span
              key={index}
              ref={el => { lettersRef.current[index] = el }}
              className={char === ' ' ? styles.spaceChar : styles.letterChar}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Animated Progress Bar & Percentage */}
        <div ref={progressBoxRef} className={styles.progressContainer}>
          <div className={styles.progressBarTrack}>
            <div ref={barRef} className={styles.progressBarFill} />
          </div>

          <div className={styles.progressMeta}>
            <span className={styles.loadingLabel}>INITIALIZING EXPERIENCE</span>
            <span className={styles.percentageText}>
              {percent < 10 ? `0${percent}%` : `${percent}%`}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}