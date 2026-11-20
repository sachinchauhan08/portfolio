import Link from 'next/link'
import { FiArrowLeft, FiFileText } from 'react-icons/fi'
import ThemeToggle from '@/components/ui/ThemeToggle'
import profile from '@/lib/profile'
import { SITE_URL } from '@/lib/siteConfig'
import styles from '@/styles/LegalPage.module.css'

export const metadata = {
  title: `Terms of Service | ${profile.name.full}`,
  description: `Terms and Conditions for accessing and using ${profile.name.full}'s personal portfolio and engineering publications.`,
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
}

export default function TermsPage() {
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
          <FiFileText size={12} /> Terms & Conditions
        </span>
        <h1 className={styles.title}>Terms of Service</h1>
        <div className={styles.lastUpdated}>
          Effective Date: January 1, {currentYear} &bull; Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>

        <article className={styles.article}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Agreement to Terms</h2>
            <p className={styles.paragraph}>
              By accessing or using <strong>{SITE_URL}</strong> (the &ldquo;Website&rdquo;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our <Link href="/privacy-policy" className={styles.link}>Privacy Policy</Link>. If you do not agree to these terms, please discontinue using this Website immediately.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Intellectual Property Rights</h2>
            <p className={styles.paragraph}>
              Unless explicitly indicated otherwise, all content displayed on this website—including articles, code snippets, project showcases, designs, layout, graphics, and trademarks—is the intellectual property of <strong>{profile.name.full}</strong> and is protected under applicable intellectual property laws.
            </p>
            <ul className={styles.list}>
              <li>You may view, print, or download code demos and educational material for personal, non-commercial educational use.</li>
              <li>You may not reproduce, redistribute, resell, or exploit any project visual assets or proprietary portfolio elements without prior written consent.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Third-Party Links & Advertising</h2>
            <p className={styles.paragraph}>
              This website may feature links to external websites, third-party repositories, social networks, and advertisements served by ad networks (such as <strong>Google AdSense</strong>).
            </p>
            <p className={styles.paragraph}>
              We do not control, endorse, or assume responsibility for the content, privacy policies, or business practices of any third-party websites or services. Any interactions or business dealings with advertisers found on this Website are solely between you and the advertiser.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Disclaimer of Warranties</h2>
            <p className={styles.paragraph}>
              The content, code samples, and resources provided on this website are shared on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis for informational and demonstration purposes only. We make no representations or warranties of any kind, express or implied, regarding accuracy, completeness, reliability, or availability.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Limitation of Liability</h2>
            <p className={styles.paragraph}>
              In no event shall {profile.name.full} be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your access to, use of, or inability to use this website, including any software or code examples retrieved herein.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Governing Law</h2>
            <p className={styles.paragraph}>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Contact Information</h2>
            <p className={styles.paragraph}>
              For any questions, clarifications, or permissions regarding these Terms of Service, please contact:
            </p>
            <ul className={styles.list}>
              <li><strong>Contact:</strong> {profile.name.full}</li>
              <li><strong>Email:</strong> <a href={`mailto:${profile.email}`} className={styles.link}>{profile.email}</a></li>
              <li><strong>Website:</strong> <a href={SITE_URL} className={styles.link}>{SITE_URL}</a></li>
            </ul>
          </section>
        </article>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>&copy; {currentYear} {profile.name.full}. All rights reserved.</span>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/about" className={styles.footerLink}>About</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
            <Link href="/blog" className={styles.footerLink}>Articles</Link>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/disclaimer" className={styles.footerLink}>Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

