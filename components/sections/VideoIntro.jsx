'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi'
import styles from '@/styles/sections/VideoIntro.module.css'

const VIDEO_SRC = '/assets/about-me.mp4'
// How far the user must scroll before we consider the video page "left"
const LEFT_TOP_THRESHOLD = 40

function scrollNext() {
  const main = document.querySelector('main')
  const hero = document.getElementById('hero')
  if (main && hero) {
    gsap.to(main, {
      scrollTop: hero.offsetTop,
      duration: 1.0,
      ease: 'power3.inOut',
    })
  } else if (main) {
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
  const cinemaRef = useRef(null)

  const hasEndedRef = useRef(false)
  const hasLeftTopRef = useRef(false)
  // Tracks whether the user has interacted, allowing unmuted playback
  const userUnlockedRef = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [hasEnded, setHasEnded] = useState(false)

  /**
   * Attempt to play the video.
   * 1. Try UNMUTED first — works if the user has already interacted with the page.
   * 2. If the browser blocks it, fall back to MUTED autoplay so the video still runs.
   * 3. As soon as any user gesture happens, `unlockAudio` upgrades it to unmuted.
   */
  const startPlayback = useCallback(({ restart = false } = {}) => {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (!v) return

    if (restart) {
      try {
        v.currentTime = 0
        if (bg) bg.currentTime = 0
      } catch {
        /* seeking before metadata is ready — ignore */
      }
    }

    hasEndedRef.current = false
    setHasEnded(false)

    // Attempt with sound first
    v.muted = false
    v.volume = 1

    const attempt = v.play()
    const handleSuccess = () => {
      setPlaying(true)
      setMuted(false)
      if (bg) {
        bg.muted = true
        bg.play().catch(() => { })
      }
    }

    if (attempt && typeof attempt.then === 'function') {
      attempt
        .then(handleSuccess)
        .catch(() => {
          // Unmuted blocked → retry muted so autoplay still works
          v.muted = true
          const mutedAttempt = v.play()
          if (mutedAttempt && typeof mutedAttempt.then === 'function') {
            mutedAttempt
              .then(() => {
                setPlaying(true)
                setMuted(true)
                if (bg) bg.play().catch(() => { })
              })
              .catch(() => setPlaying(false))
          }
        })
    } else {
      handleSuccess()
    }
  }, [])

  // ── Cinematic entrance choreography ───────────────────────────────
  useEffect(() => {
    if (!cinemaRef.current) return
    const tween = gsap.fromTo(
      cinemaRef.current,
      { opacity: 0, scale: 0.96, filter: 'blur(12px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out', delay: 0.15 }
    )
    return () => tween.kill()
  }, [])

  // ── Auto-play on first mount ──────────────────────────────────────
  useEffect(() => {
    startPlayback()
  }, [startPlayback])

  // ── Upgrade to unmuted audio on the first user gesture ────────────
  useEffect(() => {
    // Only treat the intro as "active" while its slide is the current viewport
    function isOnIntroPage() {
      const main = document.querySelector('main')
      if (!main) return true
      return main.scrollTop < window.innerHeight * 0.4
    }

    function unlockAudio() {
      const v = videoRef.current
      if (!v) return

      userUnlockedRef.current = true

      // A click/tap anywhere on the site fires this handler globally.
      // Never touch playback unless the intro slide is actually on screen —
      // otherwise clicking another section would start the video there.
      if (!isOnIntroPage()) return

      v.muted = false
      v.volume = 1
      setMuted(false)

      // If playback was blocked before the gesture, kick it off now
      if (v.paused && !hasEndedRef.current) {
        v.play()
          .then(() => setPlaying(true))
          .catch(() => { })
      }
    }

    window.addEventListener('pointerdown', unlockAudio, { passive: true })
    window.addEventListener('keydown', unlockAudio)
    window.addEventListener('touchstart', unlockAudio, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
    }
  }, [])

  // ── Leave page → pause/mute · Return to page → restart & play ─────
  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    function onMainScroll() {
      const v = videoRef.current
      const bg = bgVideoRef.current
      if (!v) return

      const onIntroViewport = main.scrollTop < window.innerHeight * 0.4

      if (!onIntroViewport) {
        // Left the video page → stop it so it never runs in the background
        if (!hasLeftTopRef.current) hasLeftTopRef.current = true
        if (!v.paused) v.pause()
        if (bg && !bg.paused) bg.pause()
        v.muted = true
        setPlaying(false)
        setMuted(true)
      } else if (hasLeftTopRef.current) {
        // Arrived back on the video page → replay from the beginning
        hasLeftTopRef.current = false
        hasEndedRef.current = false
        startPlayback({ restart: true })
      } else if (main.scrollTop < LEFT_TOP_THRESHOLD && !hasEndedRef.current && v.paused) {
        // Landed on the video page (e.g. via navbar) but it isn't running
        startPlayback()
      }
    }

    main.addEventListener('scroll', onMainScroll, { passive: true })
    // Handle the case where the page loads already scrolled into the intro
    onMainScroll()
    return () => main.removeEventListener('scroll', onMainScroll)
  }, [startPlayback])

  // ── Video finished → always advance to the next section ───────────
  function handleEnded() {
    hasEndedRef.current = true
    setHasEnded(true)
    setPlaying(false)
    if (bgVideoRef.current) bgVideoRef.current.pause()
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
      return
    }

    hasEndedRef.current = false
    setHasEnded(false)

    if (v.ended || (v.duration && v.currentTime >= v.duration - 0.2)) {
      try {
        v.currentTime = 0
        if (bg) bg.currentTime = 0
      } catch {
        /* ignore */
      }
    }

    v.muted = false
    v.volume = 1
    const p = v.play()
    if (p && typeof p.then === 'function') {
      p.then(() => {
        setPlaying(true)
        setMuted(false)
        if (bg) bg.play().catch(() => { })
      }).catch(() => setPlaying(false))
    } else {
      setPlaying(true)
      setMuted(false)
      if (bg) bg.play().catch(() => { })
    }
  }

  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    const nextMuted = !v.muted
    v.muted = nextMuted
    setMuted(nextMuted)
    if (!nextMuted) {
      userUnlockedRef.current = true
      v.volume = 1
    }
  }

  return (
    <section className={styles.section} id="intro">
      {/* Ambient blurred background bloom */}
      <video
        ref={bgVideoRef}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        className={styles.bgVideo}
      />

      {/* Atmospheric layers */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      {/* Cinematic stage */}
      <div ref={cinemaRef} className={styles.stage}>
        <div className={styles.frame}>
          <video
            ref={videoRef}
            data-testid="intro-video"
            src={VIDEO_SRC}
            playsInline
            preload="auto"
            onEnded={handleEnded}
            onPlay={() => {
              setPlaying(true)
              hasEndedRef.current = false
              setHasEnded(false)
            }}
            onPause={() => setPlaying(false)}
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            className={styles.mainVideo}
          />

          {/* Glass frame highlight */}
          <div className={styles.frameGlow} aria-hidden="true" />

          {/* Corner brackets for the cinematic look */}
          <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

          {/* Paused / ended state → centered play button */}
          {!playing && (
            <button
              type="button"
              className={styles.playOverlay}
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              aria-label={hasEnded ? 'Replay video' : 'Play video'}
            >
              <span className={styles.playCircle}>
                <FiPlay size={26} className={styles.playIcon} />
              </span>
            </button>
          )}
        </div>

        {/* Transport controls */}
        <div className={styles.controls}>
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
            {playing ? <FiPause size={15} /> : <FiPlay size={15} />}
          </button>

          <button
            type="button"
            className={styles.ctrlBtn}
            onClick={(e) => {
              e.stopPropagation()
              toggleMute()
            }}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <FiVolumeX size={15} /> : <FiVolume2 size={15} />}
          </button>
        </div>
      </div>
    </section>
  )
}
