import Link from 'next/link'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import ThemeToggle from '@/components/ui/ThemeToggle'
import profile from '@/lib/profile'
import { SITE_URL } from '@/lib/siteConfig'
import styles from '@/styles/LegalPage.module.css'

export const metadata = {
  title: `Disclaimer | ${profile.name.full}`,
  description: `Advertising, professional advice, and liability disclaimer for ${profile.name.full}'s portfolio and technical publications.`,
  alternates: {
    canonical: `${SITE_URL}/disclaimer`,
  },
}

export default function DisclaimerPage() {
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
          <FiAlertCircle size={12} /> Transparency & Disclosures
        </span>
        <h1 className={styles.title}>Disclaimer</h1>
        <div className={styles.lastUpdated}>
          Effective Date: January 1, {currentYear} &bull; Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>

        <article className={styles.article}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Website Content & Educational Purpose</h2>
            <p className={styles.paragraph}>
              All materials, technical tutorials, architectural guides, and code snippets published on <strong>{SITE_URL}</strong> are provided solely for general educational, illustrative, and informational purposes. While we strive to ensure that all information is accurate and up to date, {profile.name.full} makes no representations or warranties of any kind regarding accuracy, completeness, or suitability for any specific commercial application.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Advertising & Third-Party Sponsorship Disclosures</h2>
            <p className={styles.paragraph}>
              This website may display advertisements served by third-party ad networks, including <strong>Google AdSense</strong>. We do not personally endorse or guarantee any products, services, or companies promoted within third-party advertising banners.
            </p>
            <div className={styles.highlightBox}>
              <p>
                Any transaction, purchase, or contract you enter into with an advertiser displayed on this site is strictly between you and that third party. For full details on how ad tracking and cookies operate, please read our{' '}
                <Link href="/privacy-policy" className={styles.link}>
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Professional Advice Disclaimer</h2>
            <p className={styles.paragraph}>
              The engineering advice, architecture recommendations, and security practices shared in our articles represent the professional opinions and experiences of the author. Before applying any code or architectural changes to production financial, healthcare, or mission-critical systems, developers should conduct independent security audits, performance profiling, and rigorous regression testing.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. External Links Disclaimer</h2>
            <p className={styles.paragraph}>
              This site may contain links to external third-party repositories, documentation sites, and external web resources that are not operated or maintained by {profile.name.full}. We do not control or assume responsibility for the availability, content, or privacy policies of any third-party websites.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Contact for Questions</h2>
            <p className={styles.paragraph}>
              If you have any questions or require further clarification regarding this Disclaimer, please reach out via email at{' '}
              <a href={`mailto:${profile.email}`} className={styles.link}>
                {profile.email}
              </a>
              .
            </p>
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
            <Link href="/blog" className={styles.footerLink}>Blog</Link>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

