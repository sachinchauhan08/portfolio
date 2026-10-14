'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { FiPlay, FiPause, FiArrowDown } from 'react-icons/fi'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/VideoIntro.module.css'

function scrollNext() {
  const main = document.querySelector('main')
  if (main) {
    gsap.to(main, {
      scrollTop: window.innerHeight,
      duration: 1.0,
      ease: 'power3.inOut',
    })
  }
}

export default function VideoIntro() {
  const videoRef = useRef(null)
  const bgVideoRef = useRef(null)
  const textRef = useRef(null)
  const cinemaRef = useRef(null)
  const scrollRef = useRef(null)
  const hasEndedRef = useRef(false)
  const hasLeftTopRef = useRef(false)

  const [playing, setPlaying] = useState(true)

  // Smooth entrance choreography
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.25 })

    if (textRef.current) {
      tl.fromTo(
        textRef.current,
        { opacity: 0, x: -35, filter: 'blur(8px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' }
      )
    }

    if (cinemaRef.current) {
      tl.fromTo(
        cinemaRef.current,
        { opacity: 0, scale: 0.94, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' },
        '-=0.65'
      )
    }

    if (scrollRef.current) {
      tl.fromTo(
        scrollRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
    }

    return () => tl.kill()
  }, [])

  // Strictly unmuted playback - never mute
  function startPlayback() {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (!v) return

    v.volume = 1
    v.muted = false

    const playPromise = v.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlaying(true)
          if (bg) bg.play().catch(() => { })
        })
        .catch(() => {
          // Wait for first user click/touch to play unmuted with audio
          setPlaying(false)
        })
    }
  }

  // Launch playback on mount
  useEffect(() => {
    startPlayback()
  }, [])

  // Trigger playback when ScreenLoader finishes
  useEffect(() => {
    function onLoaderDone() {
      startPlayback()
    }
    window.addEventListener('loader-animation-done', onLoaderDone)
    return () => window.removeEventListener('loader-animation-done', onLoaderDone)
  }, [])

  // Automatically unmute audio with full volume on any user click or touch
  useEffect(() => {
    function unlockAudio() {
      const v = videoRef.current
      if (!v) return

      v.muted = false
      v.volume = 1

      if (v.paused && !hasEndedRef.current) {
        v.play().then(() => setPlaying(true)).catch(() => { })
      }
    }

    window.addEventListener('pointerdown', unlockAudio, { passive: true })
    window.addEventListener('click', unlockAudio, { passive: true })
    window.addEventListener('touchstart', unlockAudio, { passive: true })
    window.addEventListener('keydown', unlockAudio, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  // Section Tracking: Automatically PAUSE and MUTE when moving to other sections,
  // and resume playing with audio when returning to top
  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    function onMainScroll() {
      const v = videoRef.current
      const bg = bgVideoRef.current
      if (!v) return

      // Moving to other sections: automatically MUTE & PAUSE
      if (main.scrollTop >= window.innerHeight * 0.4) {
        v.pause()
        if (bg) bg.pause()
        v.muted = true
        setPlaying(false)
        hasLeftTopRef.current = true
      }
      // Returning to top section: automatically UNMUTE & PLAY
      else if (main.scrollTop < 30 && hasLeftTopRef.current) {
        hasLeftTopRef.current = false
        hasEndedRef.current = false
        v.currentTime = 0
        if (bg) bg.currentTime = 0
        v.muted = false
        v.volume = 1
        v.play().then(() => {
          if (bg) bg.play().catch(() => { })
          setPlaying(true)
        }).catch(() => {
          v.play().then(() => setPlaying(true)).catch(() => { })
        })
      }
    }

    main.addEventListener('scroll', onMainScroll, { passive: true })
    return () => main.removeEventListener('scroll', onMainScroll)
  }, [])

  // Video End: ALWAYS scroll to the next section
  function handleEnded() {
    hasEndedRef.current = true
    setPlaying(false)
    if (bgVideoRef.current) {
      bgVideoRef.current.pause()
    }
    scrollNext()
  }

  function togglePlay() {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (!v) return

    if (!v.paused) {
      v.pause()
      if (bg) bg.pause()
      setPlaying(false)
    } else {
      v.muted = false
      v.volume = 1
      hasEndedRef.current = false

      if (v.ended || (v.duration && v.currentTime >= v.duration - 0.2)) {
        v.currentTime = 0
        if (bg) bg.currentTime = 0
      }

      const p = v.play()
      if (p !== undefined) {
        p.then(() => {
          if (bg) bg.play().catch(() => { })
          setPlaying(true)
        }).catch(() => setPlaying(false))
      } else {
        if (bg) bg.play().catch(() => { })
        setPlaying(true)
      }
    }
  }

  return (
    <section className={styles.section} id="intro">
      {/* 1 - Ambient blurred background bloom */}
      <video
        ref={bgVideoRef}
        src="/assets/about-me.mp4"
        autoPlay
        muted
        playsInline
        aria-hidden="true"
        className={styles.bgVideo}
      />

      {/* 2 - Radial glow and atmospheric vignette */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* 3 - Studio Split Grid Container */}
      <div className={styles.studioContainer}>
        {/* Left Column: Editorial Identity & Typography */}
        <div ref={textRef} className={styles.textContent}>
          {/* Status Badge */}
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>
              {profile.availabilityLabel || 'Available for Roles'}
            </span>
            <span className={styles.statusYear}>· 2026</span>
          </div>

          {/* Bold Name Typography */}
          <h1 className={styles.nameHeading}>
            <span>{profile.name.first}</span>
            <span className={styles.nameGradient}>{profile.name.last}</span>
          </h1>

          {/* Subtitle / Focus */}
          <p className={styles.heroDescription}>
            Building high-performance digital experiences with modern web technologies & AI.
          </p>

          {/* Clean Meta Tags (No Mute Button) */}
          <div className={styles.metaRow}>
            <span className={styles.roleTag}>
              {profile.roles.short}
            </span>
            <span className={styles.roleTag}>
              React · Next.js · Full Stack
            </span>
          </div>

          {/* Quick Action Button */}
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={scrollNext}
            >
              <span>Explore Portfolio</span>
              <FiArrowDown size={14} className={styles.arrowIcon} />
            </button>
          </div>
        </div>

        {/* Right Column: 16:9 Studio Cinema Display */}
        <div ref={cinemaRef} className={styles.cinemaCard}>
          <video
            ref={videoRef}
            data-testid="intro-video"
            src="/assets/about-me.mp4"
            playsInline
            autoPlay
            onEnded={handleEnded}
            onPlay={() => {
              setPlaying(true)
              hasEndedRef.current = false
            }}
            onPause={() => setPlaying(false)}
            className={styles.mainVideo}
          />

          {/* Glass border reflection highlight */}
          <div className={styles.cardGlassHighlight} aria-hidden="true" />

          {/* Paused state centered play button */}
          {!playing && !hasEndedRef.current && (
            <button
              type="button"
              className={styles.playOverlay}
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              aria-label="Play video"
            >
              <div className={styles.playCircle}>
                <FiPlay size={28} className={styles.playIcon} />
              </div>
            </button>
          )}

          {/* Pinned Play/Pause Transport Controls (No Mute Option) */}
          <div className={styles.cinemaControls}>
            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              aria-label={playing ? 'Pause video' : 'Play video'}
              title={playing ? 'Pause' : 'Play'}
            >
              {playing ? <FiPause size={14} /> : <FiPlay size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4 - Minimalist scroll cue */}
      <button
        ref={scrollRef}
        type="button"
        className={styles.scrollPill}
        onClick={scrollNext}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollMouse}>
          <span className={styles.scrollWheel} />
        </span>
        <span className={styles.scrollText}>SCROLL</span>
      </button>
    </section>
  )
}
