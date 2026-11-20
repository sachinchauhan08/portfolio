import Link from 'next/link'
import { FiArrowLeft, FiUser, FiAward, FiCheckCircle, FiBriefcase, FiBookOpen } from 'react-icons/fi'
import ThemeToggle from '@/components/ui/ThemeToggle'
import profile from '@/lib/profile'
import { SITE_URL } from '@/lib/siteConfig'
import styles from '@/styles/LegalPage.module.css'

export const metadata = {
  title: `About ${profile.name.full} | ${profile.roles.short}`,
  description: `Learn more about ${profile.name.full}, a Full Stack Developer with 3+ years experience building high-performance web applications with React, Next.js, Angular, and Node.js.`,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
}

export default function AboutPage() {
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
          <FiUser size={12} /> About the Author
        </span>
        <h1 className={styles.title}>About {profile.name.full}</h1>
        <div className={styles.lastUpdated}>
          {profile.roles.detailed} &bull; {profile.location.based}
        </div>

        <article className={styles.article}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Overview & Background</h2>
            <p className={styles.paragraph}>
              {profile.bio}
            </p>
            <p className={styles.paragraph}>
              {profile.description}
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Key Qualifications & Stats</h2>
            <div className={styles.highlightBox}>
              <ul className={styles.list}>
                {profile.stats.map((stat, idx) => (
                  <li key={idx}>
                    <strong>{stat.value}+</strong> {stat.label}
                  </li>
                ))}
                <li><strong>Current Status:</strong> {profile.availabilityLabel} ({profile.location.availability})</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional Experience</h2>
            {profile.experience.map((exp) => (
              <div key={exp.id} className={styles.experienceItem}>
                <h3 className={styles.experienceRole}>
                  {exp.role} &bull; {exp.company}
                </h3>
                <span className={styles.experiencePeriod}>
                  {exp.period} – {exp.periodEnd}
                </span>
                <p className={styles.paragraph}>
                  {exp.desc}
                </p>
                <ul className={styles.list}>
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Education & Academic Credentials</h2>
            <ul className={styles.list}>
              {profile.education.map((edu, idx) => (
                <li key={idx}>
                  <strong>{edu.degree}</strong> – {edu.institution} ({edu.period}) &bull; CGPA: {edu.cgpa}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Core Technical Competencies</h2>
            <div className={styles.skillPills}>
              {profile.skills.map((skill) => (
                <span key={skill} className={styles.skillPill}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Engineering Philosophy & Content Mission</h2>
            <p className={styles.paragraph}>
              On this website, I share in-depth technical publications, case studies, and practical guides covering full-stack architecture, API security, and high-performance UI engineering. All content published here is original, rigorously tested, and drawn from direct production software engineering experience.
            </p>
          </section>
        </article>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>&copy; {currentYear} {profile.name.full}. All rights reserved.</span>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/blog" className={styles.footerLink}>Articles</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

