import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { SITE_URL } from '@/lib/siteConfig';
import profile from '@/lib/profile';
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = `${profile.name.full} | ${profile.roles.short}`;
const siteDescription = profile.description || profile.tagline;
const ogImageUrl = `${SITE_URL}/assets/og-image.jpg`;

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#07090e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteTitle,
    template: `%s | ${profile.name.full}`,
  },
  description: siteDescription,
  applicationName: `${profile.name.full} Portfolio`,
  keywords: [
    profile.name.full,
    profile.roles.short,
    'Software Engineer',
    'Frontend Developer',
    'Full Stack Developer',
    'React Developer',
    'Next.js Developer',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'NestJS',
    'Web Architecture',
    'Portfolio',
    profile.location.based,
  ],
  authors: [{ name: profile.name.full, url: SITE_URL }],
  creator: profile.name.full,
  publisher: profile.name.full,
  category: 'technology',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: `${profile.name.full} Portfolio`,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${profile.name.full} | ${profile.roles.short} Portfolio`,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [ogImageUrl],
    creator: profile.name.full,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicons/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png' },
      { url: '/favicons/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/favicons/manifest.webmanifest',
  other: {
    'image': ogImageUrl,
    'og:image:secure_url': ogImageUrl,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="image_src" href={ogImageUrl} />
        <meta name="theme-color" content="#07090e" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme')||'light';var r=s;if(s==='system'){r=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',r);document.documentElement.classList.add(r);}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: profile.name.full,
              url: SITE_URL,
              email: profile.email,
              jobTitle: profile.roles.short,
              image: ogImageUrl,
              sameAs: profile.socials.map((social) => social.href),
              ...(profile.phone ? { telephone: profile.phone } : {}),
            }),
          }}
        />
        <ThemeProvider>
          <Cursor />
          <ScrollProgressBar />
          <WhatsAppButton />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
