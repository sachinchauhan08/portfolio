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
  // True while the video is running but the browser forced us to mute it.
  const blockedRef = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [needsGesture, setNeedsGesture] = useState(false)
  const [muted, setMuted] = useState(false)

  /**
   * Start the video and try to do it WITH SOUND.
   * Chrome/Safari only allow unmuted autoplay after a user gesture, so when
   * that is refused we immediately fall back to muted autoplay (the film still
   * runs) and surface an "Unmute" control that restores audio on click.
   */
  const startPlayback = useCallback(({ restart = false, forceMuted } = {}) => {
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

    const startBg = () => {
      if (!bg) return
      bg.muted = true
      bg.play().catch(() => { })
    }

    const playWith = (mute) => {
      v.muted = mute
      if (!mute) v.volume = 1
      setMuted(mute)
      return v.play()
    }

    const onStarted = () => {
      setNeedsGesture(false)
      setPlaying(true)
      startBg()
    }

    const onBlocked = () => {
      blockedRef.current = true
      setNeedsGesture(true)
      setPlaying(false)
    }

    if (forceMuted) {
      const attempt = playWith(true)
      if (attempt && typeof attempt.then === 'function') {
        attempt.then(onStarted).catch(onBlocked)
      } else {
        onStarted()
      }
      return
    }

    // First choice: sound on (allowed once the user has interacted with the page)
    const soundAttempt = playWith(false)
    if (!soundAttempt || typeof soundAttempt.then !== 'function') {
      blockedRef.current = false
      onStarted()
      return
    }

    soundAttempt
      .then(() => {
        blockedRef.current = false
        onStarted()
      })
      .catch(() => {
        // Browsers refused unmuted autoplay → keep the film running, muted,
        // and show the Unmute affordance.
        const mutedAttempt = playWith(true)
        if (mutedAttempt && typeof mutedAttempt.then === 'function') {
          mutedAttempt
            .then(() => {
              blockedRef.current = true
              setNeedsGesture(true)
              onStarted()
            })
            .catch(onBlocked)
        } else {
          blockedRef.current = true
          setNeedsGesture(true)
          onStarted()
        }
      })
  }, [])

  /** Restore sound — always called from a real user gesture. */
  const unmute = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = 1
    setMuted(false)
    blockedRef.current = false
    setNeedsGesture(false)
    if (v.paused && !hasEndedRef.current) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => { })
    }
  }, [])

  // Keep the React state in sync if the browser changes the mute state.
  function handleVolumeChange(e) {
    setMuted(e.currentTarget.muted)
    if (!e.currentTarget.muted) blockedRef.current = false
  }

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

  // ── Auto-play on first mount (sound first, muted fallback) ────────
  useEffect(() => {
    startPlayback()
  }, [startPlayback])

  // ── Unlock sound on the first user gesture ────────────────────────
  useEffect(() => {
    // Only treat the intro as "active" while its slide is the current viewport
    function isOnIntroPage() {
      const main = document.querySelector('main')
      if (!main) return true
      return main.scrollTop < window.innerHeight * 0.4
    }

    function unlockAudio(e) {
      const v = videoRef.current
      if (!v) return

      // A click/tap anywhere on the site fires this handler globally.
      // Never touch playback unless the intro slide is actually on screen —
      // otherwise clicking another section would unmute the video there.
      if (!isOnIntroPage()) return

      // Gestures inside the cinematic stage are handled by the local controls
      if (
        cinemaRef.current &&
        e?.target instanceof Node &&
        cinemaRef.current.contains(e.target)
      ) {
        return
      }

      if (v.muted) unmute()
    }

    window.addEventListener('pointerdown', unlockAudio, { passive: true })
    window.addEventListener('keydown', unlockAudio)
    window.addEventListener('touchstart', unlockAudio, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
    }
  }, [unmute])

  // ── Leave page → pause · Return to page → restart & autoplay ──────
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
        setPlaying(false)
      } else if (hasLeftTopRef.current) {
        // Arrived back on the video page → autoplay from the beginning
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

  // Overlay is only rendered while paused/blocked/ended.
  function handleOverlayPlay(e) {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    const atEnd = v.ended || (v.duration && v.currentTime >= v.duration - 0.2)
    startPlayback({ restart: Boolean(atEnd) })
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

    const atEnd = v.ended || (v.duration && v.currentTime >= v.duration - 0.2)
    // An explicit click is a user gesture, so sound is allowed here
    if (atEnd) {
      startPlayback({ restart: true })
    } else {
      v.muted = false
      v.volume = 1
      setMuted(false)
      blockedRef.current = false
      setNeedsGesture(false)
      v.play()
        .then(() => {
          setPlaying(true)
          if (bg) {
            bg.muted = true
            bg.play().catch(() => { })
          }
        })
        .catch(() => { })
    }
  }

  return (
    <section className={styles.section} id="intro">
      {/* Ambient blurred background bloom — decorative, stays muted */}
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
            autoPlay
            onEnded={handleEnded}
            onVolumeChange={handleVolumeChange}
            onPlay={() => {
              setPlaying(true)
              hasEndedRef.current = false
              setHasEnded(false)
            }}
            onPause={() => setPlaying(false)}
            className={styles.mainVideo}
          />

          {/* Glass frame highlight */}
          <div className={styles.frameGlow} aria-hidden="true" />

          {/* Corner brackets for the cinematic look */}
          <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

          {/* Paused / ended / blocked state → centered play button */}
          {!playing && (
            <button
              type="button"
              className={styles.playOverlay}
              onClick={handleOverlayPlay}
              aria-label={hasEnded ? 'Replay video' : 'Play video with sound'}
            >
              <span className={styles.playContent}>
                <span className={styles.playCircle}>
                  <FiPlay size={26} className={styles.playIcon} />
                </span>
                {needsGesture && (
                  <span className={styles.playLabel}>Click to Play with Sound</span>
                )}
              </span>
            </button>
          )}

          {/* Playing but the browser forced muted autoplay → offer unmute */}
          {playing && muted && (
            <button
              type="button"
              className={styles.unmuteHint}
              onClick={(e) => {
                e.stopPropagation()
                unmute()
              }}
              aria-label="Unmute video"
            >
              <FiVolumeX size={15} />
              <span>Tap for sound</span>
            </button>
          )}
        </div>

        {/* Transport controls (play / pause + mute toggle) */}
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
            className={`${styles.ctrlBtn} ${muted ? styles.ctrlBtnAttention : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              if (muted) {
                unmute()
              } else {
                const v = videoRef.current
                if (!v) return
                v.muted = true
                setMuted(true)
              }
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
