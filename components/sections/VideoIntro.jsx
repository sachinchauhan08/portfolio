'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { FiPlay, FiPause } from 'react-icons/fi'
import styles from '@/styles/sections/VideoIntro.module.css'

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

  const [playing, setPlaying] = useState(true)
  const [hasEnded, setHasEnded] = useState(false)

  // Smooth entrance choreography
  useEffect(() => {
    if (!cinemaRef.current) return
    const tween = gsap.fromTo(
      cinemaRef.current,
      { opacity: 0, scale: 0.94, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.95, ease: 'power3.out', delay: 0.2 }
    )
    return () => tween.kill()
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

  // Automatically unmute audio with full volume on any user click or touch.
  // NOTE: deliberately NOT bound to keyboard events — pressing any key must
  // never (re)start the video.
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

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
    }
  }, [])

  // Automatically PAUSE & MUTE when leaving the top, resume when returning
  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    function onMainScroll() {
      const v = videoRef.current
      const bg = bgVideoRef.current
      if (!v) return

      if (main.scrollTop >= window.innerHeight * 0.4) {
        v.pause()
        if (bg) bg.pause()
        v.muted = true
        setPlaying(false)
        hasLeftTopRef.current = true
      } else if (main.scrollTop < 30 && hasLeftTopRef.current) {
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
    setHasEnded(true)
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
      setHasEnded(false)

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
      {/* Ambient blurred background bloom */}
      <video
        ref={bgVideoRef}
        src="/assets/about-me.mp4"
        autoPlay
        muted
        playsInline
        aria-hidden="true"
        className={styles.bgVideo}
      />

      {/* Atmospheric layers */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* Centered video-only stage */}
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
            setHasEnded(false)
          }}
          onPause={() => setPlaying(false)}
          className={styles.mainVideo}
        />

        {/* Glass border reflection highlight */}
        <div className={styles.cardGlassHighlight} aria-hidden="true" />

        {/* Paused state centered play button */}
        {!playing && !hasEnded && (
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

        {/* Pinned Transport Control (icon only) */}
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
    </section>
  )
}
