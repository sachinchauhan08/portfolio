'use client'

import { useEffect, useRef } from 'react'
import styles from '@/styles/ui/ScrollProgressBar.module.css'

export default function ScrollProgressBar({ className = '' }) {
  const containerRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    let rafId = null
    let mainEl = null

    const updateProgress = () => {
      if (!barRef.current) return

      // In this portfolio, the primary scroll container is <main>, which is styled
      // with height: 100vh / overflowY: scroll in app/page.js.
      // We check for <main> first, then fall back to the window/document.
      const target = document.querySelector('main')
      let currentScroll = 0
      let maxScroll = 0

      if (
        target &&
        (target.scrollHeight > target.clientHeight ||
          window.getComputedStyle(target).overflowY === 'scroll' ||
          window.getComputedStyle(target).overflowY === 'auto')
      ) {
        currentScroll = target.scrollTop
        maxScroll = target.scrollHeight - target.clientHeight
      } else {
        const doc = document.documentElement
        const body = document.body
        currentScroll = window.scrollY || doc.scrollTop || (body ? body.scrollTop : 0) || 0
        const scrollHeight = Math.max(
          doc.scrollHeight,
          body ? body.scrollHeight : 0,
          doc.offsetHeight,
          body ? body.offsetHeight : 0,
          doc.clientHeight
        )
        const clientHeight = window.innerHeight || doc.clientHeight || 0
        maxScroll = scrollHeight - clientHeight
      }

      let progress = 0
      if (maxScroll > 0 && !isNaN(maxScroll) && !isNaN(currentScroll)) {
        progress = Math.min(Math.max(currentScroll / maxScroll, 0), 1)
      }

      const percentage = Math.round(progress * 100)

      barRef.current.style.transform = `scaleX(${progress})`
      barRef.current.style.opacity = progress > 0.001 ? '1' : '0'

      if (containerRef.current) {
        containerRef.current.setAttribute('aria-valuenow', String(percentage))
      }
    }

    const onScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        updateProgress()
        rafId = null
      })
    }

    // Capture phase on window intercepts scroll events from any container element
    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('orientationchange', onScroll, { passive: true })
    window.addEventListener('footer-loop-back', onScroll)
    window.addEventListener('portfolio-navigate', onScroll)

    mainEl = document.querySelector('main')
    if (mainEl) {
      mainEl.addEventListener('scroll', onScroll, { passive: true })
    }

    // MutationObserver to attach to <main> if it renders/replaces dynamically
    let mutationObs = null
    if (!mainEl && typeof MutationObserver !== 'undefined') {
      mutationObs = new MutationObserver(() => {
        const m = document.querySelector('main')
        if (m && m !== mainEl) {
          mainEl = m
          mainEl.addEventListener('scroll', onScroll, { passive: true })
          updateProgress()
        }
      })
      mutationObs.observe(document.body, { childList: true, subtree: true })
    }

    // ResizeObserver tracks dynamic content height updates (images, font loads, responsive changes)
    let resizeObs = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(() => {
        onScroll()
      })
      if (mainEl) resizeObs.observe(mainEl)
      resizeObs.observe(document.documentElement)
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(updateProgress).catch(() => {})
    }

    // Initial calculation on mount
    updateProgress()

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('orientationchange', onScroll)
      window.removeEventListener('footer-loop-back', onScroll)
      window.removeEventListener('portfolio-navigate', onScroll)
      if (mainEl) {
        mainEl.removeEventListener('scroll', onScroll)
      }
      mutationObs?.disconnect()
      resizeObs?.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`${styles.track} ${className}`.trim()}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div ref={barRef} className={styles.bar} />
    </div>
  )
}
