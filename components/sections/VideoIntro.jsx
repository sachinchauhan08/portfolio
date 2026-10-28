'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { FiPlay, FiPause, FiVolume2, FiRotateCcw } from 'react-icons/fi'
import styles from '@/styles/sections/VideoIntro.module.css'

const VIDEO_SRC = '/assets/about-me.mp4'
const AUDIO_PREFERENCE_KEY = 'portfolio-audio-enabled'
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
  const audioChoiceRef = useRef('loading')
  const mediaReadyRef = useRef(false)
  const mediaErrorRef = useRef(false)
  const playbackAttemptRef = useRef(false)
  const playbackAttemptIdRef = useRef(0)
  const deferredPlaybackRef = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [audioChoice, setAudioChoice] = useState('loading')
  const [muted, setMuted] = useState(false)
  const [needsSoundGesture, setNeedsSoundGesture] = useState(false)
  const [playbackError, setPlaybackError] = useState(false)

  const startPlayback = useCallback(({ restart = false, fromGesture = false } = {}) => {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (!v || !v.isConnected || audioChoiceRef.current !== 'sound') return
    if (playbackAttemptRef.current) return

    if (!fromGesture && !mediaReadyRef.current && v.readyState < 3) {
      deferredPlaybackRef.current = { restart }
      return
    }
    deferredPlaybackRef.current = null

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
    setPlaybackError(false)
    v.muted = false
    v.volume = 1
    setMuted(false)
    const attemptId = ++playbackAttemptIdRef.current
    playbackAttemptRef.current = true

    const startBg = () => {
      if (!bg) return
      bg.muted = true
      bg.play().catch(() => { })
    }

    const onStarted = () => {
      if (attemptId !== playbackAttemptIdRef.current) return
      playbackAttemptRef.current = false
      mediaErrorRef.current = false
      setPlaying(true)
      setNeedsSoundGesture(v.muted)
      setPlaybackError(false)
      startBg()
    }

    const onBlocked = (error, allowMutedFallback = true) => {
      if (attemptId !== playbackAttemptIdRef.current) return

      if (error?.name === 'NotAllowedError' && allowMutedFallback && !v.muted) {
        v.muted = true
        v.volume = 1
        setMuted(true)
        setNeedsSoundGesture(true)
        try {
          const fallbackAttempt = v.play()
          if (!fallbackAttempt || typeof fallbackAttempt.then !== 'function') {
            onStarted()
            return
          }
          fallbackAttempt.then(onStarted).catch((fallbackError) => onBlocked(fallbackError, false))
          return
        } catch (fallbackError) {
          onBlocked(fallbackError, false)
          return
        }
      }

      playbackAttemptRef.current = false
      setPlaying(false)
      if (error?.name === 'AbortError' && v.paused && !v.error) return
      setPlaybackError(true)
    }

    try {
      const attempt = v.play()
      if (!attempt || typeof attempt.then !== 'function') {
        onStarted()
        return
      }

      attempt.then(onStarted).catch(onBlocked)
    } catch (error) {
      onBlocked(error)
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
          playbackAttemptIdRef.current += 1
          playbackAttemptRef.current = false
          deferredPlaybackRef.current = null
        if (!v.paused) v.pause()
        if (bg && !bg.paused) bg.pause()
        setPlaying(false)
      } else if (hasLeftTopRef.current) {
        // Arrived back on the video page → autoplay from the beginning
        hasLeftTopRef.current = false
        hasEndedRef.current = false
        startPlayback({ restart: true })
      } else if (
        audioChoiceRef.current === 'sound' &&
        main.scrollTop < LEFT_TOP_THRESHOLD &&
        !hasEndedRef.current &&
        v.paused
      ) {
        // Landed on the video page (e.g. via navbar) but it isn't running
        startPlayback()
      }
    }

    main.addEventListener('scroll', onMainScroll, { passive: true })
    // Handle the case where the page loads already scrolled into the intro
    onMainScroll()
    return () => main.removeEventListener('scroll', onMainScroll)
  }, [startPlayback])

  useEffect(() => {
    let soundPreferenceSaved = false
    try {
      soundPreferenceSaved = localStorage.getItem(AUDIO_PREFERENCE_KEY) === 'true'
    } catch {
      // Storage can be unavailable in private browsing contexts.
    }

    if (soundPreferenceSaved) {
      audioChoiceRef.current = 'sound'
      // Read storage after hydration to keep the server and initial client render consistent.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAudioChoice('sound')
      if (mediaErrorRef.current) {
        setPlaybackError(true)
        return
      }
      startPlayback()
      return
    }

    audioChoiceRef.current = 'pending'
    setAudioChoice('pending')
  }, [startPlayback])

  useEffect(() => () => {
    playbackAttemptIdRef.current += 1
    playbackAttemptRef.current = false
    deferredPlaybackRef.current = null
    if (videoRef.current && !videoRef.current.paused) videoRef.current.pause()
  }, [])

  function handleLoadedMetadata(e) {
    mediaReadyRef.current = e.currentTarget.readyState >= 3
  }

  function handleCanPlay(e) {
    mediaReadyRef.current = e.currentTarget.readyState >= 3
    mediaErrorRef.current = false
    const deferredPlayback = deferredPlaybackRef.current
    if (deferredPlayback && audioChoiceRef.current === 'sound') {
      startPlayback(deferredPlayback)
    }
  }

  function handleMediaError() {
    mediaReadyRef.current = false
    mediaErrorRef.current = true
    deferredPlaybackRef.current = null
    playbackAttemptIdRef.current += 1
    playbackAttemptRef.current = false
    setPlaying(false)
    if (audioChoiceRef.current === 'sound') setPlaybackError(true)
  }

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
    startPlayback({ restart: Boolean(atEnd), fromGesture: true })
  }

  function chooseAudio() {
    const v = videoRef.current
    if (!v) return

    audioChoiceRef.current = 'sound'
    setAudioChoice('sound')
    try {
      localStorage.setItem(AUDIO_PREFERENCE_KEY, 'true')
    } catch {
      // Keep playback available when storage is unavailable.
    }
    if (v.error || mediaErrorRef.current) {
      retryPlayback()
      return
    }
    const atEnd = v.ended || (v.duration && v.currentTime >= v.duration - 0.2)

    // Keep play() in the button's user-gesture call stack for browser autoplay policies.
    startPlayback({ restart: Boolean(atEnd), fromGesture: true })
  }

  function retryPlayback() {
    const v = videoRef.current
    if (!v) return
    const atEnd = v.ended || (v.duration && v.currentTime >= v.duration - 0.2)

    playbackAttemptIdRef.current += 1
    playbackAttemptRef.current = false

    if (v.error || v.readyState < 3) {
      mediaReadyRef.current = false
      deferredPlaybackRef.current = { restart: Boolean(atEnd) }
      if (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) v.load()
      return
    }

    startPlayback({ restart: Boolean(atEnd), fromGesture: true })
  }

  function enableSound(e) {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = 1
    audioChoiceRef.current = 'sound'
    setAudioChoice('sound')
    setNeedsSoundGesture(false)
    try {
      localStorage.setItem(AUDIO_PREFERENCE_KEY, 'true')
    } catch {
      // Keep playback available when storage is unavailable.
    }
    setMuted(false)
  }

  function togglePlay() {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (!v) return

    if (!v.paused) {
      playbackAttemptIdRef.current += 1
      playbackAttemptRef.current = false
      deferredPlaybackRef.current = null
      v.pause()
      if (bg) bg.pause()
      setPlaying(false)
      return
    }

    const atEnd = v.ended || (v.duration && v.currentTime >= v.duration - 0.2)
    startPlayback({ restart: Boolean(atEnd), fromGesture: true })
  }

  return (
    <section className={styles.section} id="intro">
      {/* Ambient blurred background bloom — decorative, stays muted */}
      <video
        ref={bgVideoRef}
        src={VIDEO_SRC}
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
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onError={handleMediaError}
            onEnded={handleEnded}
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            onPlay={(e) => {
              setPlaying(true)
              mediaErrorRef.current = false
              setNeedsSoundGesture(e.currentTarget.muted)
              setPlaybackError(false)
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

          {audioChoice === 'pending' && (
            <div className={styles.permissionOverlay} role="dialog" aria-modal="true" aria-labelledby="intro-audio-title">
              <div className={styles.permissionContent}>
                <span className={styles.permissionIcon} aria-hidden="true">
                  <FiVolume2 size={26} />
                </span>
                <span className={styles.permissionEyebrow}>AUDIO PREFERENCE</span>
                <h2 className={styles.permissionTitle} id="intro-audio-title">How would you like to begin?</h2>
                <p className={styles.permissionDescription}>
                  Choose whether the intro video should play with sound.
                </p>
                <button
                  type="button"
                  className={styles.allowSoundButton}
                  onClick={chooseAudio}
                  autoFocus
                >
                  <FiVolume2 size={17} />
                  <span>Allow Sound</span>
                  <FiPlay size={14} />
                </button>
              </div>
            </div>
          )}

          {playbackError && audioChoice !== 'pending' && (
            <div className={styles.playbackErrorOverlay} role="alert">
              <p>We couldn&apos;t start the intro video.</p>
              <button type="button" className={styles.retryButton} onClick={retryPlayback}>
                <FiRotateCcw size={16} />
                Retry playback
              </button>
            </div>
          )}

          {/* Paused or ended state → centered play button */}
          {!playing && !playbackError && audioChoice === 'sound' && (
            <button
              type="button"
              className={styles.playOverlay}
              onClick={handleOverlayPlay}
              aria-label={hasEnded ? 'Replay video' : 'Play video'}
            >
              <span className={styles.playContent}>
                <span className={styles.playCircle}>
                  <FiPlay size={26} className={styles.playIcon} />
                </span>
              </span>
            </button>
          )}

        </div>

        {audioChoice === 'sound' && (
          <div className={styles.controls}>
            {playing && muted && needsSoundGesture && (
              <button
                type="button"
                className={styles.soundControl}
                onClick={enableSound}
                aria-label="Enable video sound"
                title="Enable sound"
              >
                <FiVolume2 size={15} />
                <span>Enable sound</span>
              </button>
            )}
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
          </div>
        )}
      </div>
    </section>
  )
}
