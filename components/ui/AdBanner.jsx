'use client'

import { useEffect, useRef } from 'react'
import styles from '@/styles/ui/AdBanner.module.css'

export default function AdBanner({
  slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || '',
  format = 'auto',
  responsive = 'true',
  className = '',
}) {
  const adRef = useRef(null)
  const pushedRef = useRef(false)
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1407777244890571'

  useEffect(() => {
    if (!clientId) return
    const el = adRef.current
    if (!el) return

    // If this banner has already pushed or AdSense has already processed this ins element, do not push again
    if (
      pushedRef.current ||
      el.getAttribute('data-adsbygoogle-status') === 'done' ||
      el.children.length > 0
    ) {
      return
    }

    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = window.adsbygoogle || []
        adsbygoogle.push({})
        pushedRef.current = true
      }
    } catch (err) {
      // Silence known harmless warning in StrictMode / fast navigation
      const msg = err?.message || err?.toString?.() || ''
      if (!msg.includes('already have ads')) {
        console.warn('Google AdSense push warning:', err)
      }
    }
  }, [clientId, slot])

  // If Client ID is not configured yet, show a developer-friendly placeholder
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return (
      <aside className={`${styles.adContainer} ${styles.placeholder} ${className}`} aria-label="Sponsored Content">
        <span className={styles.adLabel}>Advertisement</span>
        <span className={styles.placeholderText}>
          Google AdSense Unit (Ad will appear here once approved &amp; Publisher ID is added).
        </span>
      </aside>
    )
  }

  return (
    <aside className={`${styles.adContainer} ${className}`} aria-label="Sponsored Content">
      <span className={styles.adLabel}>Advertisement</span>
      <ins
        ref={adRef}
        className={`adsbygoogle ${styles.adUnit}`}
        data-ad-client={clientId}
        data-ad-slot={slot || undefined}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </aside>
  )
}

