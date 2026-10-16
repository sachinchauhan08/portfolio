'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import {
    FiMail,
    FiGithub,
    FiLinkedin,
    FiCopy,
    FiCheck,
    FiArrowUpRight,
    FiMapPin,
    FiGlobe,
    FiBriefcase,
    FiActivity,
} from 'react-icons/fi'

import profile from '@/data/profile.json'
import content from '@/data/content.json'
import styles from '@/styles/sections/ContactSection.module.css'

const CONTACT = content.contact
const SOCIAL_ICONS = { GitHub: FiGithub, LinkedIn: FiLinkedin }

export default function ContactSection() {
    const sectionRef = useRef(null)
    const headerRef = useRef(null)
    const panelRef = useRef(null)
    const stripRef = useRef(null)
    const tlRef = useRef(null)
    const copyTimer = useRef(null)
    const [copied, setCopied] = useState(false)

    // ── Copy email to clipboard (with legacy fallback) ──────────────
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(profile.email)
        } catch {
            const el = document.createElement('textarea')
            el.value = profile.email
            el.setAttribute('readonly', '')
            el.style.position = 'absolute'
            el.style.left = '-9999px'
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
        }
        setCopied(true)
        clearTimeout(copyTimer.current)
        copyTimer.current = setTimeout(() => setCopied(false), 2200)
    }

    useEffect(() => () => clearTimeout(copyTimer.current), [])

    // ── Entrance animation driven by snap scroll position ───────────
    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const scroller = document.querySelector('main')
        if (!scroller) return

        const items = [headerRef.current, panelRef.current, stripRef.current].filter(Boolean)
        const reduce =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let isActive = false

        function reset() {
            tlRef.current?.kill()
            gsap.set(items, { opacity: 0, y: 34 })
        }

        function play() {
            reset()
            const tl = gsap.timeline()
            tlRef.current = tl
            tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0)
                .to(panelRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.14)
                .to(stripRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.28)
        }

        if (reduce) {
            gsap.set(items, { opacity: 1, y: 0 })
            isActive = true
        } else {
            reset()
        }

        function onScroll() {
            const scrollY = scroller.scrollTop
            const top = section.offsetTop
            const height = section.offsetHeight
            const inRange =
                scrollY + window.innerHeight * 0.7 >= top &&
                scrollY <= top + height - window.innerHeight * 0.1

            if (inRange && !isActive) {
                isActive = true
                play()
            } else if (!inRange && isActive && !reduce) {
                isActive = false
                reset()
            }
        }

        scroller.addEventListener('scroll', onScroll, { passive: true })
        onScroll()

        return () => {
            scroller.removeEventListener('scroll', onScroll)
            tlRef.current?.kill()
        }
    }, [])

    const channels = profile.socials
        .map((s) => ({ ...s, Icon: SOCIAL_ICONS[s.label] }))
        .filter((s) => s.Icon)

    return (
        <section ref={sectionRef} className={styles.section} id="contact">
            {/* Backdrop decoration */}
            <div className={styles.orbA} aria-hidden="true" />
            <div className={styles.orbB} aria-hidden="true" />
            <div className={styles.gridLines} aria-hidden="true" />
            <span className={styles.ghostWord} aria-hidden="true">Contact</span>

            <div className={styles.inner}>
                {/* ── Header ───────────────────────────────────────────── */}
                <header ref={headerRef} className={styles.header}>
                    <span className={styles.eyebrow}>
                        <span className={styles.eyebrowDot} />
                        {CONTACT.eyebrow}
                    </span>

                    <h2 className={styles.title}>
                        <span className={styles.titleLine}>{CONTACT.headingLine1}</span>
                        <span className={styles.titleAccent}>{CONTACT.headingLine2}</span>
                    </h2>

                    <p className={styles.subtitle}>{CONTACT.supportingText}</p>
                </header>

                {/* ── Contact panel ────────────────────────────────────── */}
                <div ref={panelRef} className={styles.panel}>
                    <div className={styles.emailRow}>
                        <span className={styles.emailIcon}>
                            <FiMail size={18} />
                        </span>
                        <div className={styles.emailMeta}>
                            <span className={styles.emailLabel}>Direct Email</span>
                            <a className={styles.emailValue} href={`mailto:${profile.email}`}>
                                {profile.email}
                            </a>
                        </div>
                        <button
                            type="button"
                            className={`${styles.copyBtn} ${copied ? styles.copyBtnActive : ''}`}
                            onClick={handleCopy}
                            aria-label="Copy email address to clipboard"
                        >
                            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>

                    <div className={styles.channels}>
                        {channels.map(({ label, href, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.channelCard}
                            >
                                <span className={styles.channelIcon}>
                                    <Icon size={17} />
                                </span>
                                <span className={styles.channelBody}>
                                    <span className={styles.channelLabel}>{label}</span>
                                    <span className={styles.channelHint}>View profile</span>
                                </span>
                                <FiArrowUpRight className={styles.channelArrow} size={16} />
                            </a>
                        ))}
                    </div>

                    <div className={styles.ctaRow}>
                        <a
                            className={styles.primaryCta}
                            href={`mailto:${profile.email}?subject=Let's%20work%20together`}
                        >
                            <span>Start a Conversation</span>
                            <FiArrowUpRight size={16} />
                        </a>
                        <span className={styles.responseNote}>
                            <FiActivity size={13} />
                            Typically replies within 24 hours
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Fact strip ─────────────────────────────────────────── */}
            <div ref={stripRef} className={styles.strip}>
                <div className={styles.fact}>
                    <FiMapPin size={13} className={styles.factIcon} />
                    <span className={styles.factLabel}>Location</span>
                    <span className={styles.factValue}>{profile.location.based}</span>
                </div>

                <div className={styles.fact}>
                    <FiGlobe size={13} className={styles.factIcon} />
                    <span className={styles.factLabel}>Work Mode</span>
                    <span className={styles.factValue}>{profile.location.availability}</span>
                </div>

                <div className={styles.fact}>
                    <FiBriefcase size={13} className={styles.factIcon} />
                    <span className={styles.factLabel}>Focus</span>
                    <span className={styles.factValue}>{profile.roles.short}</span>
                </div>

                <div className={styles.fact}>
                    <span className={styles.statusDot} />
                    <span className={styles.factLabel}>Status</span>
                    <span className={styles.factValueAccent}>{profile.availabilityLabel}</span>
                </div>
            </div>
        </section>
    )
}
