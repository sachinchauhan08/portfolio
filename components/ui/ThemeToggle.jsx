'use client'

import { useState, useSyncExternalStore } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '@/components/ui/ThemeProvider'
import styles from '@/styles/ui/ThemeToggle.module.css'

const emptySubscribe = () => () => {}

export default function ThemeToggle({ className = '' }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const [animating, setAnimating] = useState(false)

  if (!mounted) {
    return (
      <button
        type="button"
        className={`${styles.toggleBtn} ${className}`}
        aria-label="Toggle theme"
        disabled
      >
        <span className={styles.iconWrap}>
          <FiMoon size={16} className={styles.moonIcon} />
        </span>
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  function handleToggle() {
    setAnimating(true)
    const nextTheme = isDark ? 'light' : 'dark'
    setTheme(nextTheme)
    setTimeout(() => setAnimating(false), 450)
  }

  return (
    <button
      type="button"
      className={`${styles.toggleBtn} ${className}`}
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className={`${styles.iconWrap} ${animating ? styles.iconSpin : ''}`}>
        {isDark ? (
          <FiSun size={17} className={styles.sunIcon} />
        ) : (
          <FiMoon size={17} className={styles.moonIcon} />
        )}
      </span>
    </button>
  )
}
