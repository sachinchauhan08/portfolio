import Link from 'next/link'
import { FiArrowLeft, FiMail, FiMapPin, FiGlobe, FiGithub, FiLinkedin, FiClock, FiSend } from 'react-icons/fi'
import ThemeToggle from '@/components/ui/ThemeToggle'
import profile from '@/lib/profile'
import { SITE_URL } from '@/lib/siteConfig'
import styles from '@/styles/LegalPage.module.css'

export const metadata = {
  title: `Contact ${profile.name.full} | Full Stack Developer`,
  description: `Get in touch with ${profile.name.full} for engineering consulting, project collaborations, software architecture inquiries, or recruitment opportunities.`,
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
}

export default function ContactPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brandLink}>
            {profile.name.full}
          </Link>
          <div className={styles.headerActions}>
            <ThemeToggle />
            <Link href="/" className={styles.backBtn}>
              <FiArrowLeft size={14} />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.contentShell}>
        <span className={styles.badge}>
          <FiMail size={12} /> Direct Communication
        </span>
        <h1 className={styles.title}>Contact & Inquiries</h1>
        <div className={styles.lastUpdated}>
          Open to Opportunities &bull; Worldwide / Remote &bull; Based in {profile.location.based}
        </div>

        <article className={styles.article}>
          <section className={styles.section}>
            <p className={styles.paragraph}>
              Have a project inquiry, software consulting opportunity, or feedback on my technical publications? I am always open to discussing new engineering collaborations, speaking engagements, and full-stack development roles.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Direct Communication Channels</h2>
            <div className={styles.highlightBox}>
              <ul className={styles.list}>
                <li>
                  <strong>Direct Email:</strong>{' '}
                  <a href={`mailto:${profile.email}`} className={styles.link}>
                    {profile.email}
                  </a>
                </li>
                {profile.phone && (
                  <li>
                    <strong>Phone / WhatsApp:</strong> {profile.phone}
                  </li>
                )}
                <li>
                  <strong>Primary Location:</strong> {profile.location.based} (Available {profile.location.availability})
                </li>
                <li>
                  <strong>Response SLA:</strong> Typically replies within 24 business hours.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Verified Professional Profiles</h2>
            <div className={styles.socialButtons}>
              {profile.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.backBtn} ${styles.socialBtn}`}
                >
                  {social.label === 'GitHub' && <FiGithub size={14} />}
                  {social.label === 'LinkedIn' && <FiLinkedin size={14} />}
                  <span>{social.label} Profile</span>
                </a>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Start a Conversation</h2>
            <p className={styles.paragraph}>
              The quickest way to reach me is by sending a direct email. Please include a brief description of your project scope, timeline, and requirements:
            </p>
            <div className={styles.ctaWrapper}>
              <a
                href={`mailto:${profile.email}?subject=Project%20Inquiry%20from%20Portfolio`}
                className={`${styles.backBtn} ${styles.sendBtn}`}
              >
                <FiSend size={15} />
                <span>Send Email ({profile.email})</span>
              </a>
            </div>
          </section>
        </article>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>&copy; {currentYear} {profile.name.full}. All rights reserved.</span>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/about" className={styles.footerLink}>About</Link>
            <Link href="/blog" className={styles.footerLink}>Articles</Link>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

