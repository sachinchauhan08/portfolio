'use client'

import { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import profile from '@/lib/profile'
import styles from '@/styles/ui/WhatsAppButton.module.css'

const MESSAGE = 'Hi Sachin, I visited your portfolio and would like to connect with you.'

export default function WhatsAppButton() {
  const [introVisible, setIntroVisible] = useState(false)
  const phoneNumber = profile.phone.replace(/\D/g, '')

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    const updatePosition = () => {
      setIntroVisible(main.scrollTop < main.clientHeight / 2)
    }

    updatePosition()
    main.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition)

    return () => {
      main.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [])

  if (!phoneNumber) return null

  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(MESSAGE)}`

  return (
    <a
      className={`${styles.button} ${introVisible ? styles.introVisible : ''}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with me on WhatsApp"
      title="Chat with me on WhatsApp"
    >
      <FaWhatsapp className={styles.icon} aria-hidden="true" />
      <span className={styles.tooltip} aria-hidden="true">
        Chat with me on WhatsApp
      </span>
    </a>
  )
}
