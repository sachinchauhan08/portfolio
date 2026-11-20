import Link from 'next/link'
import { FiArrowLeft, FiShield } from 'react-icons/fi'
import ThemeToggle from '@/components/ui/ThemeToggle'
import profile from '@/lib/profile'
import { SITE_URL } from '@/lib/siteConfig'
import styles from '@/styles/LegalPage.module.css'

export const metadata = {
  title: `Privacy Policy | ${profile.name.full}`,
  description: `Privacy Policy for ${profile.name.full}'s portfolio and digital services, including Google AdSense, cookies, and data protection practices.`,
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
}

export default function PrivacyPolicyPage() {
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
          <FiShield size={12} /> Legal & Privacy
        </span>
        <h1 className={styles.title}>Privacy Policy</h1>
        <div className={styles.lastUpdated}>
          Effective Date: January 1, {currentYear} &bull; Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>

        <article className={styles.article}>
          <section className={styles.section}>
            <p className={styles.paragraph}>
              Welcome to <strong>{SITE_URL}</strong> (the &ldquo;Website&rdquo;), operated by <strong>{profile.name.full}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We are committed to safeguarding your privacy and ensuring transparency regarding how information is collected, used, and protected when you browse our website.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Google AdSense & Third-Party Advertising</h2>
            <p className={styles.paragraph}>
              We may partner with third-party advertising vendors, including <strong>Google AdSense</strong>, to display advertisements when you visit our website.
            </p>
            <div className={styles.highlightBox}>
              <p>
                <strong>Important Notice on Cookies & Advertising:</strong>
                <br />
                &bull; Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites across the Internet.
                <br />
                &bull; Google&rsquo;s use of advertising cookies (such as DoubleClick / Google DART cookies) enables it and its partners to serve ads based on your visits to our site and/or other sites on the Internet.
                <br />
                &bull; You may opt out of personalized advertising at any time by visiting{' '}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Google Ads Settings
                </a>
                {' '}or through the{' '}
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Network Advertising Initiative (NAI) Opt-Out tool
                </a>
                .
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Cookies & Web Beacons</h2>
            <p className={styles.paragraph}>
              Like most professional websites, this site uses cookies to store information including visitor preferences, the pages visited, and browser behavior. This data helps optimize user experience by customizing content according to visitor browser type or other technical information.
            </p>
            <p className={styles.paragraph}>
              You can choose to disable cookies through your individual browser options. Detailed instructions on cookie management can be found in your browser&rsquo;s respective help documentation.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Information We Collect</h2>
            <p className={styles.paragraph}>
              We collect information in the following ways:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Direct Communications:</strong> If you contact us via email ({profile.email}) or external messaging (such as WhatsApp, LinkedIn, GitHub), we receive your name, email address, message contents, and any additional details you provide.
              </li>
              <li>
                <strong>Log Files & Analytics:</strong> We use standard server log files and privacy-focused analytics (such as Vercel Analytics). These logs record internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and number of clicks. This data is not linked to any personally identifiable information and is solely used for system administration and performance monitoring.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. How We Use Your Information</h2>
            <p className={styles.paragraph}>
              The information we gather is used to:
            </p>
            <ul className={styles.list}>
              <li>Operate, maintain, and enhance the performance and layout of our website.</li>
              <li>Respond to professional inquiries, consulting requests, and project collaboration opportunities.</li>
              <li>Analyze site traffic patterns to deliver high-quality developer resources, projects, and articles.</li>
              <li>Prevent unauthorized access and protect against security vulnerabilities.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Data Protection Rights (GDPR / CCPA / DPDP)</h2>
            <p className={styles.paragraph}>
              Depending on your location, you may have statutory rights regarding your personal information, including:
            </p>
            <ul className={styles.list}>
              <li><strong>Right of Access:</strong> You may request copies of personal information we hold about you.</li>
              <li><strong>Right to Rectification:</strong> You may request corrections to any inaccurate information.</li>
              <li><strong>Right to Erasure:</strong> You can ask us to delete your personal communication data where applicable.</li>
              <li><strong>Right to Restrict or Object:</strong> You can restrict or object to certain types of processing.</li>
            </ul>
            <p className={styles.paragraph}>
              To exercise any of these rights, please contact us directly at <a href={`mailto:${profile.email}`} className={styles.link}>{profile.email}</a>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Children&rsquo;s Information</h2>
            <p className={styles.paragraph}>
              Protecting children while using the internet is an essential priority. We do not knowingly collect any personally identifiable information from children under the age of 13. If you believe your child provided this kind of information on our website, please contact us immediately, and we will promptly remove such information from our records.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Updates to This Policy</h2>
            <p className={styles.paragraph}>
              We reserve the right to revise this Privacy Policy at our discretion to reflect technical changes, legal mandates, or evolving industry practices. Any amendments will be published on this page with an updated revision date.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Contact Us</h2>
            <p className={styles.paragraph}>
              If you have any questions or concerns regarding this Privacy Policy or our data handling practices, feel free to reach out:
            </p>
            <ul className={styles.list}>
              <li><strong>Author:</strong> {profile.name.full}</li>
              <li><strong>Email:</strong> <a href={`mailto:${profile.email}`} className={styles.link}>{profile.email}</a></li>
              <li><strong>Website:</strong> <a href={SITE_URL} className={styles.link}>{SITE_URL}</a></li>
              <li><strong>Location:</strong> {profile.location.based}</li>
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
            <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
            <Link href="/disclaimer" className={styles.footerLink}>Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

