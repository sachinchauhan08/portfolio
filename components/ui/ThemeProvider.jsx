'use client'

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light')
  const [resolvedTheme, setResolvedTheme] = useState('light')
  const [, startTransition] = useTransition()

  // Initialize theme from localStorage or document attribute on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme') || 'light'
      const isSystem = stored === 'system'
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const resolved = isSystem ? (systemDark ? 'dark' : 'light') : stored

      startTransition(() => {
        setThemeState(stored)
        setResolvedTheme(resolved)
      })

      document.documentElement.setAttribute('data-theme', resolved)
      document.documentElement.classList.remove('dark', 'light')
      document.documentElement.classList.add(resolved)
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Listen for system theme changes if theme is 'system'
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    function handleChange(e) {
      if (theme === 'system') {
        const nextResolved = e.matches ? 'dark' : 'light'
        setResolvedTheme(nextResolved)
        document.documentElement.setAttribute('data-theme', nextResolved)
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(nextResolved)
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: { resolvedTheme: nextResolved } }))
      }
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  function setTheme(newTheme) {
    let resolved = newTheme
    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      resolved = systemDark ? 'dark' : 'light'
    }

    setThemeState(newTheme)
    setResolvedTheme(resolved)

    try {
      localStorage.setItem('theme', newTheme)
    } catch {
      // Ignore localStorage errors
    }

    document.documentElement.setAttribute('data-theme', resolved)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(resolved)

    // Notify non-React or canvas listeners (e.g. Three.js scenes)
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { resolvedTheme: resolved } }))
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
