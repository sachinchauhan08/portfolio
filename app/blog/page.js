import Link from 'next/link'
import { FiArrowLeft, FiArrowRight, FiBookOpen, FiClock, FiCalendar } from 'react-icons/fi'
import ThemeToggle from '@/components/ui/ThemeToggle'
import AdBanner from '@/components/ui/AdBanner'
import profile from '@/lib/profile'
import { SITE_URL } from '@/lib/siteConfig'
import articles from '@/data/articles.json'
import styles from '@/styles/Blog.module.css'

export const metadata = {
  title: `Engineering Articles & Insights | ${profile.name.full}`,
  description: `Technical deep dives, tutorials, and architectural insights on Next.js, Node.js, UI engineering, and full-stack development by ${profile.name.full}.`,
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
}

export default function BlogIndexPage() {
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
          <FiBookOpen size={12} /> Engineering Publications
        </span>
        <h1 className={styles.title}>Articles & Insights</h1>
        <p className={styles.subtitle}>
          In-depth architectural guides, frontend performance recipes, and lessons learned building scalable modern digital experiences.
        </p>

        <div className={styles.grid}>
          {articles.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={styles.card}
            >
              <div className={styles.cardMeta}>
                <span className={styles.categoryTag}>{post.category}</span>
                <span>&bull;</span>
                <span className={styles.readTimeBadge}>
                  <FiClock size={12} /> {post.readTime}
                </span>
              </div>

              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.cardExcerpt}>{post.excerpt}</p>

              <div className={styles.cardFooter}>
                <div className={styles.tagList}>
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span className={styles.readMore}>
                  Read <FiArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* AdSense Unit on Blog index */}
        <AdBanner />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>&copy; {currentYear} {profile.name.full}. All rights reserved.</span>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/about" className={styles.footerLink}>About</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
            <Link href="/disclaimer" className={styles.footerLink}>Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

