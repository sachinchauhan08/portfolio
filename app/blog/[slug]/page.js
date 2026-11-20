import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowLeft, FiClock, FiCalendar, FiTag, FiBookOpen } from 'react-icons/fi'
import ThemeToggle from '@/components/ui/ThemeToggle'
import AdBanner from '@/components/ui/AdBanner'
import profile from '@/lib/profile'
import { SITE_URL } from '@/lib/siteConfig'
import articles from '@/data/articles.json'
import styles from '@/styles/Blog.module.css'

export async function generateStaticParams() {
  return articles.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const post = articles.find((p) => p.slug === resolvedParams.slug)

  if (!post) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${post.title} | ${profile.name.full}`,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}`,
      authors: [profile.name.full],
    },
  }
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params
  const post = articles.find((p) => p.slug === resolvedParams.slug)

  if (!post) {
    notFound()
  }

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
            <Link href="/blog" className={styles.backBtn}>
              <FiArrowLeft size={14} />
              <span>All Articles</span>
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.articleShell}>
        <article>
          <header className={styles.articleHeader}>
            <div className={styles.articleMeta}>
              <span className={styles.badge} style={{ marginBottom: 0 }}>
                <FiBookOpen size={12} /> {post.category}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FiCalendar size={13} /> {post.date}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FiClock size={13} /> {post.readTime}
              </span>
            </div>

            <h1 className={styles.articleTitle}>{post.title}</h1>
            <p className={styles.articleExcerptLead}>{post.excerpt}</p>
          </header>

          <div className={styles.articleBody}>
            {post.content.map((section, idx) => (
              <div key={idx}>
                <section>
                  <h2 className={styles.articleHeading}>{section.heading}</h2>
                  {section.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                      {para}
                    </p>
                  ))}
                </section>
                {/* Mid-article Ad Unit after Section 2 */}
                {idx === 1 && <AdBanner />}
              </div>
            ))}
          </div>

          {/* End-of-article Ad Unit */}
          <AdBanner />

          <div className={styles.authorBox}>
            <div className={styles.authorInfo}>
              <span className={styles.authorLabel}>Written by</span>
              <div className={styles.authorName}>{profile.name.full}</div>
              <div className={styles.authorBio}>
                {profile.roles.short} based in {profile.location.based}. {profile.description}
              </div>
            </div>
          </div>
        </article>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>&copy; {currentYear} {profile.name.full}. All rights reserved.</span>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/blog" className={styles.footerLink}>Blog</Link>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

